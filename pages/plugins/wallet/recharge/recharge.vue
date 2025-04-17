<template>
    <view :class="theme_view">
        <component-nav-back :propName="$t('recharge.recharge.otwkjn')"></component-nav-back>
        <view v-if="data_list_loding_status == 3" class="weixin-nav-padding-top">
            <view class="padding-top-xxxl">
                <!-- 头部背景 -->
                <image :src="wallet_static_url + 'rechage-bg.png'" mode="widthFix" class="pa top-0 bg-img wh-auto" />
                <view class="pr padding-top-main">
                    <view class="wallet-price cr-white">
                        <view class="text-size-lg fw-b">{{$t('recharge.recharge.3shyx4')}}</view>
                        <view class="margin-top-sm">
                            <text class="unit">{{ currency_symbol }}</text>
                            <text class="price fw-b">{{ user_wallet.normal_money }}</text>
                        </view>
                    </view>
                    <view class="recharge-content bg-white spacing-mt">
                        <block v-if="preset_data.length > 0">
                            <view class="padding-horizontal-sm spacing-mb">{{$t('recharge.recharge.60k2v3')}}</view>
                            <view class="flex-row flex-wrap tc spacing-mb">
                                <view v-for="(item, index) in preset_data" :key="index" class="recharge-price-list" :data-index="index" :data-value="item.value" @tap="change_price_event">
                                    <view class="recharge-price-content border-radius-main pr" :class="select_index === index ? 'active' : ''">
                                        <view v-if="item.tips" class="tips cr-white dis-inline-block pa left-0 text-size-xss">{{ item.tips }}</view>
                                        <view class="single-text">
                                            <text class="text-size-md">{{ currency_symbol }}</text>
                                            <text class="text-size-xl">{{ item.value }}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </block>
                        <view class="form-container padding-top-sm padding-horizontal-sm">
                            <view class="form-gorup border-radius-main custom-price flex-row align-c">
                                <view class="margin-right-xxl">{{preset_data.length > 0 ? $t('recharge.recharge.23zwpz') : $t('recharge.recharge.otwkjn')}}{{$t('recharge.recharge.qbw1x2')}}</view>
                                <input type="digit" name="money" v-model="recharge_money_value" placeholder-class="cr-grey-9" class="cr-base text-size-md flex-1 flex-width" :placeholder="$t('recharge.recharge.73f4v9')" @input="recharge_money_value_input_event" maxlength="6" />
                            </view>
                            <view class="form-gorup form-gorup-submit spacing-mt">
                                <button class="round cr-white bg-main br-main text-size" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_event">{{$t('recharge.recharge.x27b25')}}</button>
                            </view>
                        </view>
                        <view v-if="((recharge_desc || null) != null && recharge_desc.length > 0)" class="recharge-desc padding-top-xxl padding-horizontal-sm">
                            <view class="recharge-desc-title padding-bottom-sm">{{$t('recharge.recharge.4fm61g')}}</view>
                            <view v-for="(item, index) in recharge_desc" :key="index" class="recharge-desc-content cr-grey-9 flex-row align-c">
                                <text class="dis-inline-block circle bg-main circle-poiont margin-right-sm"></text>
                                <text class="text-size-xs">{{ item }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <!-- 支付弹窗 -->
        <component-payment
            :propCurrencySymbol="currency_symbol"
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            propPayDataKey="recharge_id"
            :propPaymentList="payment_list"
            :propTempPayValue="temp_pay_value"
            :propPayPrice="pay_price"
            :propPaymentId="payment_id"
            :propIsRedirectTo="true"
            :propToFailPage="to_fail_page"
            :propToAppointPage="to_appoint_page"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
        ></component-payment>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';
    var wallet_static_url = app.globalData.get_static_url('wallet', true) + 'app/';

    var currency_symbol = (app.globalData.data.is_wallet_use_fixed_currency_symbol == 1) ? app.globalData.data.currency_symbol : app.globalData.currency_symbol();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                wallet_static_url: wallet_static_url,
                currency_symbol: currency_symbol,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                recharge_money_value: '',
                form_submit_disabled_status: false,
                preset_data: [],
                recharge_desc: '',
                user_wallet: null,
                select_index: null,

                // 支付弹窗参数
                pay_url: '',
                qrcode_url: '',
                payment_list: [],
                temp_pay_value: '',
                is_show_payment_popup: false,
                pay_price: 0,
                payment_id: 0,
                // 支付失败跳转的页面
                to_fail_page: '/pages/plugins/wallet/user/user',
                to_appoint_page: '/pages/plugins/wallet/user/user?type=recharge',
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentPayment,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
                recharge_money_value: params.money || '',
            });
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
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        pay_url: app.globalData.get_request_url('pay', 'recharge', 'wallet'),
                        qrcode_url: app.globalData.get_request_url('paycheck', 'recharge', 'wallet'),
                    });
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('extraction-apply.extraction-apply.m3xdif'),
                    });
                }
            },
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('rechargeconfigdata', 'recharge', 'wallet'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                preset_data: data.preset_data || [],
                                recharge_desc: data.recharge_desc || '',
                                user_wallet: data.user_wallet || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 选择充值金额
            change_price_event(e) {
                this.setData({
                    select_index: e.currentTarget.dataset.index,
                    recharge_money_value: e.currentTarget.dataset.value,
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
                    app.globalData.showToast(this.$t('recharge.recharge.73f4v9'));
                    return false;
                }

                this.setData({
                    form_submit_disabled_status: true,
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
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
                            var data = res.data.data;
                            this.setData({
                                pay_price: data.money,
                                temp_pay_value: data.recharge_id,
                                payment_id: data.default_payment_id || 0,
                                payment_list: data.payment_list,
                                is_show_payment_popup: true,
                            });
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
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
