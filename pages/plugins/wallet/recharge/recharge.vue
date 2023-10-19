<template>
    <view>
        <component-nav-back prop-name="充值"></component-nav-back>
        <view v-if="data.length > 0" class="weixin-nav-padding-top">
            <view class="padding-top-xxxl">
                <!-- 头部背景 -->
                <image :src="wallet_static_url + 'rechage-bg.png'" mode="widthFix" class="pa top-0 bg-img wh-auto" />
                <view class="pr padding-top-main">
                    <view class="wallet-price cr-white">
                        <view class="text-size-lg fw-b">账号余额</view>
                        <view class="margin-top-sm">
                            <text class="unit">{{ currency_symbol }}</text>
                            <text class="price fw-b">380</text>
                        </view>
                    </view>
                    <view class="recharge-content bg-white spacing-mt">
                        <view class="padding-horizontal-sm spacing-mb">选择充值金额</view>
                        <view class="flex-row flex-warp tc spacing-mb">
                            <view v-for="(item, index) in data" :key="index" class="recharge-price-list" :data-index="index" :data-value="item.value" @tap="change_price_event">
                                <view class="recharge-price-content border-radius-main pr" :class="select_index === index ? 'active' : ''">
                                    <view v-if="item.tips" class="tips cr-white dis-inline-block pa left-0 text-size-xss">{{ item.tips }}</view>
                                    <view class="single-text">
                                        <text class="text-size-md">{{ currency_symbol }}</text>
                                        <text class="text-size-xl">{{ item.value }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="form-container padding-top-sm padding-horizontal-sm">
                            <view class="form-gorup border-radius-main custom-price flex-row align-c">
                                <view class="margin-right-xxl">其他金额</view>
                                <input type="digit" name="money" v-model="recharge_money_value" placeholder-class="cr-grey-9" class="cr-base text-size-md flex-1 flex-width" placeholder="请输入充值金额" @input="recharge_money_value_input_event" maxlength="6" />
                            </view>
                            <view class="form-gorup form-gorup-submit spacing-mt">
                                <button class="round cr-white bg-main br-main text-size" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_event">立即充值</button>
                            </view>
                        </view>
                        <view class="recharge-desc padding-top-xxl padding-horizontal-sm">
                            <view class="recharge-desc-title padding-bottom-sm">充值说明</view>
                            <view v-for="(item, index) in recharge_desc" :key="index" class="recharge-desc-content cr-grey-9 flex-row align-c">
                                <text class="dis-inline-block circle bg-main circle-poiont margin-right-sm"></text>
                                <text class="flex-1 flex-width text-size-xs">{{ item }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
        <!-- 支付弹窗 -->
        <component-payment
            :prop-pay-url="pay_url"
            :prop-qrcode-url="qrcode_url"
            prop-pay-data-key="recharge_id"
            :prop-payment-list="payment_list"
            :prop-temp-pay-value="temp_pay_value"
            :prop-pay-price="pay_price"
            :prop-payment-id="payment_id"
            :propIsRedirectTo="true"
            :prop-to-fail-page="to_fail_page"
            :prop-is-show-payment="is_show_payment_popup"
            @close-payment-poupon="payment_popup_event_close"
        ></component-payment>
    </view>
</template>
<script>
    const app = getApp();
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';
    var wallet_static_url = app.globalData.get_static_url('wallet', true) + 'app/';

    export default {
        data() {
            return {
                wallet_static_url: wallet_static_url,
                currency_symbol: app.globalData.data.currency_symbol,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                recharge_money_value: '',
                // recharge_money_value: '',
                form_submit_disabled_status: false,
                data: [],
                recharge_desc: '',
                select_index: null,

                // 支付弹窗参数
                pay_url: app.globalData.get_request_url('pay', 'recharge', 'wallet'),
                qrcode_url: app.globalData.get_request_url('paycheck', 'recharge', 'wallet'),
                payment_list: [],
                temp_pay_value: '',
                is_show_payment_popup: false,
                pay_price: 0,
                payment_id: 0,
                // 支付失败跳转的页面
                to_fail_page: '/pages/plugins/wallet/user/user',
            };
        },

        components: {
            componentNavBack,
            componentPayment,
            componentNoData,
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
                    } else {
                        this.get_data();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '请先授权用户信息',
                    });
                }
            },
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('rechargeconfigdata', 'user', 'wallet'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data: data.preset_data || [],
                                payment_id: data.default_payment_id || 0,
                                recharge_desc: data.recharge_desc || '',
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                            });
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
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 选择充值金额
            change_price_event(e) {
                this.setData({
                    select_index: e.currentTarget.dataset.index,
                    recharge_money_value: e.currentTarget.dataset.value,
                    // recharge_money_value: '',
                });
            },

            // 充值金额输入事件
            recharge_money_value_input_event(e) {
                this.setData({
                    recharge_money_value: e.detail.value || '',
                    select_index: null,
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

            // 页面滚动监听
            onPageScroll(e) {
                var top = e.scrollTop > 47 ? 1 : e.scrollTop / 47;
                this.setData({
                    opacity: top,
                });
            },
        },
    };
</script>
<style>
    @import './recharge.css';
</style>
