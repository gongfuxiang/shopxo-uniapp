<template>
    <view>
        <view class="pf z-i left-0 top-0 right-0 pa-w" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 10) + 'px;background-color:rgba(255,255,255,' + opacity + ')'">
            <!-- 返回 -->
            <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
            <view v-if="is_realstore_top_nav_back == 1" class="nav-back padding-horizontal-main padding-vertical-sm round va-m flex-row" :class="opacity > 0.3 ? 'cr-black' : 'cr-white'">
                <iconfont name="icon-tongyong-fanhui" size="40rpx" @tap="top_nav_left_back_event"></iconfont>
                <text class="text-size flex-1 tc">充值</text>
            </view>
            <!-- #endif -->
        </view>
        <view v-if="data.length > 0" class="weixin-nav-padding-top">
            <view class="padding-top-xxxl">
                <!-- 头部背景 -->
                <image :src="wallet_static_url + 'rechage-bg.png'" mode="widthFix" class="pa top-0 bg-img wh-auto" />
                <view class="pr padding-top-main">
                    <view class="wallet-price">
                        <view class="text-size-lg fw-b">账号余额</view>
                        <view class="margin-top-sm">
                            <text class="unit">{{ currency_symbol }}</text>
                            <text class="price fw-b">380</text>
                        </view>
                    </view>
                    <view class="recharge-content bg-white">
                        <view class="padding-horizontal-sm">选择充值金额</view>
                        <view class="flex-row flex-warp tc">
                            <view v-for="(item, index) in data" :key="index" class="recharge-price-list padding-sm" @tap="change_price_event">
                                <view class="recharge-price-content border-radius-main single-text" :class="select_index === index ? 'active' : ''">
                                    <text class="text-size-md">{{ currency_symbol }}</text>
                                    <text class="text-size-xl">100</text>
                                </view>
                            </view>
                        </view>
                        <view class="form-container padding-main">
                            <view class="form-gorup padding-vertical-main border-radius-main">
                                <input type="digit" name="money" :value="recharge_money_value || ''" placeholder-class="cr-grey" class="cr-base text-size-xxl" placeholder="请输入充值金额" @input="recharge_money_value_input_event" maxlength="6" />
                            </view>
                            <view class="form-gorup form-gorup-submit">
                                <button class="round cr-white bg-main br-main text-size" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_event">提交</button>
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
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';
    var wallet_static_url = app.globalData.get_static_url('wallet', true) + 'app/';

    export default {
        data() {
            return {
                wallet_static_url: wallet_static_url,
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                // 顶部返回导航背景透明度
                opacity: 0,
                currency_symbol: app.globalData.data.currency_symbol,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                recharge_money_value: '',
                form_submit_disabled_status: false,
                data: [],
                recharge_desc: '',

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
                            console.log(data);
                            this.setData({
                                data: data.preset_data || [],
                                payment_id: data.default_payment_id || '',
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
            change_price_event(e) {},

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

            // 顶部返回操作
            top_nav_left_back_event(e) {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0],
                    });
                } else {
                    uni.navigateBack();
                }
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
