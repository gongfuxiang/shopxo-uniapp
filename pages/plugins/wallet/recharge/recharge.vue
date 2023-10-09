<template>
    <view>
        <view class="form-container padding-main">
            <view class="form-gorup padding-vertical-main border-radius-main">
                <input type="digit" name="money" :value="recharge_money_value || ''" placeholder-class="cr-grey" class="cr-base text-size-xxl" placeholder="请输入充值金额" @input="recharge_money_value_input_event" maxlength="6" />
            </view>
            <view class="form-gorup form-gorup-submit">
                <button class="round cr-white bg-main br-main text-size" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_event">提交</button>
            </view>
        </view>
        <!-- 支付弹窗 -->
        <component-payment
            :prop-pay-url="pay_url"
            :prop-qrcode-url="qrcode_url"
            prop-pay-data-key="recharge_id"
            :prop-payment-list="payment_list"
            :prop-temp-pay-value="temp_pay_value"
            :prop-pay-price="pay_price"
            :propIsRedirectTo="true"
            :prop-to-fail-page="to_fail_page"
            @close-payment-poupon="payment_popup_event_close"
        ></component-payment>
    </view>
</template>
<script>
    const app = getApp();
    import componentPayment from '@/components/payment/payment';

    export default {
        data() {
            return {
                params: null,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                recharge_money_value: '',
                form_submit_disabled_status: false,

                // 支付弹窗参数
                pay_url: app.globalData.get_request_url('pay', 'recharge', 'wallet'),
                qrcode_url: app.globalData.get_request_url('paycheck', 'recharge', 'wallet'),
                payment_list: [],
                temp_pay_value: '',
                is_show_payment_popup: false,
                pay_price: 0,
                // 支付失败跳转的页面
                to_fail_page: '/pages/plugins/wallet/user/user',
            };
        },

        components: {
            componentPayment,
        },

        props: {},

        onLoad(params) {
            this.setData({
                params: params,
                recharge_money_value: params.money || '',
            });
        },

        onShow() {
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '请先绑定手机号码',
                        });
                        return false;
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '请先授权用户信息',
                    });
                }
            },

            // 充值金额输入事件
            recharge_money_value_input_event(e) {
                this.setData({
                    recharge_money_value: e.detail.value || '',
                });
            },

            // 数据提交
            form_submit_event(e) {
                // 参数
                if ((this.recharge_money_value || null) == null) {
                    app.globalData.showToast('请输入充值金额');
                    return false;
                }

                this.setData({
                    form_submit_disabled_status: true,
                });
                uni.showLoading({
                    title: '处理中...',
                });
                uni.request({
                    url: app.globalData.get_request_url('create', 'recharge', 'wallet'),
                    method: 'POST',
                    data: {
                        money: this.recharge_money_value,
                    },
                    dataType: 'json',
                    success: (res) => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            uni.setStorageSync(app.globalData.data.cache_page_pay_key, { type: 1 });
                            this.setData({
                                is_show_payment_popup: true,
                                pay_price: res.data.data.money,
                                temp_pay_value: res.data.data.recharge_id,
                                payment_list: res.data.data.payment_list,
                            });
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },
            payment_popup_event_close() {
                this.setData({
                    is_show_payment_popup: false,
                });
            },
        },
    };
</script>
<style>
    @import './recharge.css';
</style>
