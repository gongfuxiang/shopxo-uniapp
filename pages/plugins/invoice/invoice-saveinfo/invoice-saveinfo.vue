<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <view v-if="save_base_data != null && save_base_data.total_price > 0">
                <form @submit="form_submit" class="form-container">
                    <view class="padding-main oh">
                        <view class="padding-main border-radius-main bg-white spacing-mb">
                            <view>
                                <text class="cr-base margin-right-sm">{{$t('invoice.invoice.fvuc4p')}}</text>
                                <text class="cr-main text-size fw-b">{{ save_base_data.total_price }}</text>
                            </view>
                            <view class="cr-base margin-top-sm">{{ save_base_data.business_desc }}</view>
                        </view>

                        <component-invoice-form-fields
                            class="spacing-mb"
                            :can_invoice_type_list="can_invoice_type_list"
                            :apply_type_list="apply_type_list"
                            :invoice_content_list="invoice_content_list"
                            :form_data="data"
                            :form_invoice_type_index="form_invoice_type_index"
                            :form_apply_type_index="form_apply_type_index"
                            :form_invoice_content_index="form_invoice_content_index"
                            :form_apply_type_disabled="form_apply_type_disabled"
                            :company_container="company_container"
                            :company_special_container="company_special_container"
                            :addressee_container="addressee_container"
                            :email_container="email_container"
                            @invoice-type-change="form_invoice_type_event"
                            @apply-type-change="form_apply_type_event"
                            @invoice-content-change="form_invoice_content_event"
                        ></component-invoice-form-fields>

                        <view class="bottom-fixed" :style="bottom_fixed_style">
                            <view class="bottom-line-exclude">
                                <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                            </view>
                        </view>
                    </view>
                </form>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentInvoiceFormFields from '@/pages/plugins/invoice/components/invoice-form-fields/invoice-form-fields';
    import invoiceFormMixin from '@/pages/plugins/invoice/common/invoice-form-mixin.js';

    export default {
        mixins: [invoiceFormMixin],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                bottom_fixed_style: '',
                data_base: null,
                apply_type_list: [],
                can_invoice_type_list: [],
                invoice_content_list: [],
                save_base_data: null,
                data: {},
                form_invoice_type_index: 0,
                form_apply_type_index: 0,
                form_invoice_content_index: 0,
                form_apply_type_disabled: false,
                company_container: false,
                company_special_container: false,
                addressee_container: false,
                email_container: true,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentInvoiceFormFields,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params || {},
            });

            // 标题设置
            uni.setNavigationBarTitle({
                title: this.$t('invoice-saveinfo.invoice-saveinfo.89815t') + ((this.params.id || null) == null ? this.$t('invoice-saveinfo.invoice-saveinfo.004t56') : this.$t('common.edit')),
            });

            // 加载数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'user', 'invoice'),
                    method: 'POST',
                    data: {...this.params, ...{lang_can_key: 'apply_type_list,can_invoice_type_list'}},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var default_data = ((data.data || null) == null || data.data.length == 0) ? null : data.data;
                            this.setData({
                                data_base: data.base || null,
                                apply_type_list: data.apply_type_list || [],
                                can_invoice_type_list: data.can_invoice_type_list || [],
                                invoice_content_list: data.invoice_content_list || [],
                                save_base_data: data.save_base_data,
                                data: default_data || {},
                                data_list_loding_status: 0,
                                data_bottom_line_status: true,
                                data_list_loding_msg: data.save_base_data.total_price <= 0 ? this.$t('invoice-saveinfo.invoice-saveinfo.dl11n1') : '',
                            });
                            if (default_data != null) {
                                this.invoice_form_init_state(default_data, {}, {
                                    can_invoice_type_list: data.can_invoice_type_list || [],
                                    apply_type_list: data.apply_type_list || [],
                                    invoice_content_list: data.invoice_content_list || [],
                                });
                            } else {
                                this.invoice_container_handle();
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 表单提交
            form_submit(e) {
                var data = e.detail.value || {};
                if ((this.data || null) == null || (this.data.id || null) == null) {
                    data['ids'] = this.params.ids || '';
                    data['type'] = this.params.type || '';
                } else {
                    data['id'] = this.data.id;
                }

                // picker 在子组件内，form 的 detail.value 往往带不上；先用本地索引回填（含类型 id=0 电子发票）
                if ((this.can_invoice_type_list || [])[this.form_invoice_type_index] == undefined) {
                    app.globalData.showToast(this.$t('invoice-saveinfo.invoice-saveinfo.t3i3e3'));
                    return;
                }
                if ((this.apply_type_list || [])[this.form_apply_type_index] == undefined) {
                    app.globalData.showToast(this.$t('invoice-saveinfo.invoice-saveinfo.k31t2s'));
                    return;
                }
                data['invoice_type'] = this.can_invoice_type_list[this.form_invoice_type_index]['id'];
                data['apply_type'] = this.apply_type_list[this.form_apply_type_index]['id'];
                if (this.invoice_content_list.length > 0 && this.invoice_content_list[this.form_invoice_content_index] != undefined) {
                    data['invoice_content'] = this.invoice_content_list[this.form_invoice_content_index];
                }

                var validation = [
                    { fields: 'invoice_type', msg: this.$t('invoice-saveinfo.invoice-saveinfo.t3i3e3'), is_can_zero: 1 },
                    { fields: 'apply_type', msg: this.$t('invoice-saveinfo.invoice-saveinfo.k31t2s'), is_can_zero: 1 },
                    { fields: 'invoice_title', msg: this.$t('invoice-saveinfo.invoice-saveinfo.r13p43') },
                ];
                if (app.globalData.fields_check(data, validation)) {
                    if (!this.invoice_form_validate(data)) {
                        return;
                    }
                    uni.showLoading({
                        title: this.$t('common.submit_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });

                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'user', 'invoice'),
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                var is_to = (this.params || null) != null && (this.params.is_redirect || 0) == 1;
                                setTimeout(function () {
                                    // 是否关闭页面进入我的发票、适合从订单开票中过来提交成功直接进入我的发票列表
                                    if (is_to) {
                                        app.globalData.url_open('/pages/plugins/invoice/invoice/invoice', true);
                                    } else {
                                        uni.navigateBack();
                                    }
                                }, 2000);
                            } else {
                                this.setData({
                                    form_submit_loading: false,
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },
        },
    };
</script>
<style></style>
