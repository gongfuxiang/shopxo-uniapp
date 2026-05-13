<template>
    <view :class="theme_view">
        <view v-if="(integral_to_balance || null) != null" class="padding-main">
            <!-- 功能未开或暂不可兑换 -->
            <block v-if="(integral_to_balance.is_enable_feature || 0) != 1 || (integral_to_balance.can_exchange || 0) != 1">
                <component-no-data :propStatus="0" :propMsg="(integral_to_balance.display_message || '') != '' ? integral_to_balance.display_message : integral_to_balance.text_popup_fallback_tip"></component-no-data>
            </block>
            <!-- 兑换表单 -->
            <view v-else class="form-container page-bottom-fixed">
                    <view class="bg-white border-radius-main padding-main">
                        <view class="text-size-sm cr-base margin-bottom-xs">{{ integral_to_balance.text_popup_line_integral }}</view>
                        <view class="text-size-sm cr-base margin-bottom-xs">{{ integral_to_balance.text_popup_line_ratio }}</view>
                        <view class="text-size-sm cr-base">{{ integral_to_balance.text_popup_line_estimate_all }}</view>
                    </view>
                    <view class="bg-white border-radius-main padding-main margin-top-main">
                        <view class="form-gorup">
                            <view class="margin-bottom-xs">{{ integral_to_balance.text_label_exchange_integral }}<text class="form-group-tips-must">*</text></view>
                            <input type="number" :value="integral_input" placeholder-class="cr-grey" class="cr-base bg-grey-f9 padding-horizontal-main border-radius-sm" :placeholder="integral_to_balance.text_placeholder_integral_input" @input="integral_input_event" />
                            <view class="text-size-sm cr-grey margin-top-sm">{{ integral_to_balance.text_preview_convertible_balance }}<text class="cr-base fw-b">{{ integral_to_balance.currency_symbol }}{{ preview_money }}</text></view>
                        </view>
                    </view>
                    <view class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <button type="default" class="item bg-main br-main cr-white round text-size" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading" @tap="submit_event">{{ integral_to_balance.text_btn_submit_exchange }}</button>
                        </view>
                    </view>
                </view>
        </view>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
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
                bottom_fixed_style: '',
                integral_to_balance: null,
                integral_input: '',
                preview_money: '0.00',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                form_submit_loading: false,
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
        
            // 加载数据
            this.init();
        
            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },

            // 获取数据
            get_data() {
                this.setData({
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                    integral_to_balance: null,
                });
                uni.request({
                    url: app.globalData.get_request_url('integralbalanceinfo', 'user', 'wallet'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var row = res.data.data || null;
                            this.setData({
                                integral_to_balance: row,
                                data_list_loding_status: 0,
                                data_list_loding_msg: '',
                                integral_input: '',
                            });
                            this.sync_preview('', row);
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 输入事件
            integral_input_event(e) {
                var raw = e.detail.value || '';
                this.sync_preview(raw);
            },

            // 同步渲染兑换金额
            sync_preview(raw, row_opt) {
                var row = row_opt || this.integral_to_balance;
                if ((row || null) == null) {
                    return;
                }
                var maxI = parseInt(row.user_integral_value, 10) || 0;
                var points = parseInt(row.integral_to_balance_points, 10) || 100;
                if (points < 1) {
                    points = 100;
                }
                var v = parseInt(String(raw).replace(/\D/g, ''), 10);
                if (isNaN(v) || v < 0) {
                    v = 0;
                }
                if (v > maxI) {
                    v = maxI;
                }
                var disp = v > 0 ? String(v) : '';
                var m = v > 0 && points > 0 ? v / points : 0;
                var pm = (Math.round(m * 100) / 100).toFixed(2);
                this.setData({
                    integral_input: disp,
                    preview_money: pm,
                });
            },

            // 提交兑换余额
            submit_event() {
                var row = this.integral_to_balance;
                if ((row || null) == null || (row.can_exchange || 0) != 1) {
                    return;
                }
                var maxI = parseInt(row.user_integral_value, 10) || 0;
                var amt = parseInt(this.integral_input, 10) || 0;
                if (amt < 1) {
                    app.globalData.showToast(row.text_validation_integral_input || this.$t('common.params_error_tips'));
                    return;
                }
                if (amt > maxI) {
                    app.globalData.showToast(row.text_validation_integral_input || this.$t('common.params_error_tips'));
                    return;
                }
                this.setData({
                    form_submit_loading: true,
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('integralbalanceconvert', 'user', 'wallet'),
                    method: 'POST',
                    data: {
                        integral_amount: amt,
                    },
                    dataType: 'json',
                    success: (res) => {
                        this.setData({
                            form_submit_loading: false,
                        });
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.wallet_integral_to_balance_refresh = 1;
                            app.globalData.showToast(res.data.msg);
                            setTimeout(function () {
                                uni.navigateBack();
                            }, 300);
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'submit_event')) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_loading: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style>
</style>