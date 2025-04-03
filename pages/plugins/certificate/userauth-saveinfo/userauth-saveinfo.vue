<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <view v-if="data_list_loding_status === 3">
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
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                bottom_fixed_style: '',
                data_base: null,
                data: null,
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

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
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'userauth', 'certificate'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var upd_data = {
                                data_base: data.base || null,
                                data: data.data || [],
                                editor_path_type: data.editor_path_type || '',
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: '',
                            };
                            this.setData(upd_data);
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
            },
        },
    };
</script>
<style></style>
