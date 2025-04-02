<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <view v-if="(data || null) != null">
                <form @submit="form_submit" class="form-container">
                    <view class="padding-main oh">
                        <view class="border-radius-main bg-white oh spacing-mb">
                            <view class="form-gorup">
                                <view class="form-gorup-title">{{$t('invoice.invoice.y724c7')}}<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="invoice_title" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.x461e0')" maxlength="200" :value="data.invoice_title || ''" />
                            </view>
                        </view>
                        <view class="bottom-fixed" :style="bottom_fixed_style">
                            <view class="bottom-line-exclude">
                                <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('form.form.4yd066')}}</button>
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

    export default {
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
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
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
                    url: app.globalData.get_request_url('saveinfo', 'userauth', 'certificate'),
                    method: 'POST',
                    data: {...this.params, ...{lang_can_key: 'apply_type_list,can_invoice_type_list'}},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var default_data = ((data.data || null) == null || data.data.length == 0) ? null : data.data;
                            var upd_data = {
                                data_base: data.base || null,
                                apply_type_list: data.apply_type_list || [],
                                can_invoice_type_list: data.can_invoice_type_list || [],
                                invoice_content_list: data.invoice_content_list || [],
                                save_base_data: data.save_base_data,
                                data: default_data || {},
                                data_list_loding_status: 0,
                                data_bottom_line_status: true,
                                data_list_loding_msg: data.save_base_data.total_price <= 0 ? this.$t('invoice-saveinfo.invoice-saveinfo.dl11n1') : '',
                            };
                            // 类型数据处理
                            if (default_data != null) {
                                var invoice_content_index = upd_data.invoice_content_list.indexOf(default_data.invoice_content);
                                upd_data['form_invoice_type_index'] = default_data.invoice_type;
                                upd_data['form_apply_type_index'] = default_data.apply_type;
                                upd_data['form_invoice_content_index'] = invoice_content_index == -1 ? 0 : invoice_content_index;
                                upd_data['form_apply_type_disabled'] = default_data.apply_type == 1;
                            }
                            this.setData(upd_data);

                            // 数据容器处理
                            this.invoice_container_handle();
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
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 发票类型事件
            form_invoice_type_event(e) {
                this.setData({
                    form_invoice_type_index: e.detail.value,
                });
                this.invoice_container_handle();
            },

            // 发票类型事件
            form_apply_type_event(e) {
                this.setData({
                    form_apply_type_index: e.detail.value,
                });
                this.invoice_container_handle();
            },

            // 发票内容事件
            form_invoice_content_event(e) {
                this.setData({
                    form_invoice_content_index: e.detail.value,
                });
            },

            // 容器显隐处理
            invoice_container_handle() {
                // 发票类型
                var invoice_type = this.can_invoice_type_list[this.form_invoice_type_index]['id'];
                if (invoice_type == 2 || invoice_type == 3) {
                    // 选择专票的时候申请类型必须是企业
                    this.setData({
                        form_apply_type_index: 1,
                        form_apply_type_disabled: true,
                    });
                } else {
                    this.setData({
                        form_apply_type_disabled: false,
                    });
                }

                // 申请类型
                switch (invoice_type) {
                    // 增值税普通电子发票
                    case 0:
                        this.setData({
                            company_special_container: false,
                            addressee_container: false,
                            email_container: true,
                        });
                        break;
                    // 增值税普通纸质发票
                    case 1:
                        this.setData({
                            company_special_container: false,
                            addressee_container: true,
                            email_container: false,
                        });
                        break;
                    // 增值税专用纸质发票
                    case 2:
                        this.setData({
                            company_container: true,
                            company_special_container: true,
                            addressee_container: true,
                            email_container: false,
                        });
                        break;
                        
                    // 增值税专用纸质发票
                    case 3:
                        this.setData({
                            company_container: true,
                            company_special_container: true,
                            addressee_container: false,
                            email_container: true,
                        });
                        break;
                }

                // 增值税专用纸质发票情况下个人类型处理
                if (invoice_type == 0 || invoice_type == 1) {
                    var apply_type = this.apply_type_list[this.form_apply_type_index]['id'];
                    this.setData({
                        company_container: apply_type != 0,
                    });
                }
            },

            // 表单提交
            form_submit(e) {
                var data = e.detail.value;
                if ((this.data || null) == null || (this.data.id || null) == null) {
                    data['ids'] = this.params.ids || '';
                    data['type'] = this.params.type || '';
                } else {
                    data['id'] = this.data.id;
                }

                // 数据验证
                var validation = [
                    { fields: 'invoice_type', msg: this.$t('invoice-saveinfo.invoice-saveinfo.t3i3e3'), is_can_zero: 1 },
                    { fields: 'apply_type', msg: this.$t('invoice-saveinfo.invoice-saveinfo.k31t2s'), is_can_zero: 1 },
                    { fields: 'invoice_title', msg: this.$t('invoice-saveinfo.invoice-saveinfo.r13p43') },
                ];
                if (app.globalData.fields_check(data, validation)) {
                    var invoice_type = this.can_invoice_type_list[this.form_invoice_type_index]['id'];
                    var apply_type = this.apply_type_list[this.form_apply_type_index]['id'];
                    if (apply_type == 1) {
                        validation.push({ fields: 'invoice_code', msg: this.$t('invoice-saveinfo.invoice-saveinfo.ws4wbb') });
                    }
                    if (invoice_type == 2) {
                        validation.push({ fields: 'invoice_bank', msg: this.$t('invoice-saveinfo.invoice-saveinfo.87itn8') });
                        validation.push({ fields: 'invoice_account', msg: this.$t('invoice-saveinfo.invoice-saveinfo.01lw93') });
                        validation.push({ fields: 'invoice_tel', msg: this.$t('invoice-saveinfo.invoice-saveinfo.414ihr') });
                        validation.push({ fields: 'invoice_address', msg: this.$t('invoice-saveinfo.invoice-saveinfo.g3yh32') });
                    }

                    if (invoice_type == 1 || invoice_type == 2) {
                        validation.push({ fields: 'name', msg: this.$t('invoice-saveinfo.invoice-saveinfo.4xy6xi') });
                        validation.push({ fields: 'tel', msg: this.$t('invoice-saveinfo.invoice-saveinfo.quhnk0') });
                        validation.push({ fields: 'address', msg: this.$t('invoice-saveinfo.invoice-saveinfo.kq77u3') });
                    }

                    if (app.globalData.fields_check(data, validation)) {
                        // 发票类型
                        data['invoice_type'] = this.can_invoice_type_list[this.form_invoice_type_index]['id'];

                        // 发票内容
                        if (this.invoice_content_list.length > 0 && this.invoice_content_list[this.form_invoice_content_index] != undefined) {
                            data['invoice_content'] = this.invoice_content_list[this.form_invoice_content_index];
                        }
                        uni.showLoading({
                            title: this.$t('buy.buy.r79t77'),
                        });
                        this.setData({
                            form_submit_loading: true,
                        });

                        // 网络请求
                        uni.request({
                            url: app.globalData.get_request_url('save', 'userauth', 'certificate'),
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
                }
            },
        },
    };
</script>
<style></style>
