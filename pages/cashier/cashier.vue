<template>
    <view :class="theme_view">
        <view class="page bg-white">
            <view class="content padding-horizontal-main tc">
                <block v-if="data_list_loding_status == 3">
                    <view class="padding-vertical-xxxxl">
                        <text class="cr-price fw-b text-size-lg">{{payment_currency_symbol}}</text>
                        <text class="cr-price fw-b text-size-xxl">{{data.pay_price}}</text>
                    </view>
                    <view class="margin-top-sm padding-bottom-xxxxl">
                        <view :class="'cr-'+(pay_status == 1 ? 'green' : (pay_status == 2 ? 'red' : 'grey'))">{{pay_msg}}</view>
                    </view>
                    <view v-if="pay_status == 2" class="margin-top-xxxxl padding-vertical-xxxxl">
                        <button class="bg-green br-green cr-white round text-size-sm padding-horizontal-xxxxl" size="mini" hover-class="none" @tap="pay_handle">{{pay_btn_text}}</button>
                    </view>
                </block>
                <block v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </block>
                <view v-if="is_back_btn && pay_status != 0" class="margin-top-xxxxl padding-top-xxxxl tc">
                    <button class="bg-white br-main cr-main round text-size-sm padding-horizontal-xxxxl" size="mini" hover-class="none" open-type="launchApp" app-parameter="wechat">{{pay_back_app_text}}</button>
                </view>
            </view>
        </view>

        <!-- 支付中提示弹窗 -->
        <view v-if="payment_confirm_modal_status" class="payment-confirm-modal">
            <view class="content padding-xl margin-xxl tc bg-white border-radius-main">
                <view class="padding-vertical-xxxxl">{{$t('common.payment_in_text')}}</view>
                <view class="margin-top-lg">
                    <button type="default" size="mini" class="bg-white br-black cr-black text-size-sm round margin-right-xxxxl" data-type="0" @tap="payment_confirm_event">{{$t('common.not_have_name')}}</button>
                    <button type="default" size="mini" class="bg-main br-main cr-white text-size-sm round margin-left-xxxxl" data-type="1" @tap="payment_confirm_event">{{$t('order.order.s8g966')}}</button>
                </view>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common" :propIsAppAdmin="false"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                payment_currency_symbol: app.globalData.currency_symbol(),
                params: {},
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                scene: 0,
                scene_back_arr: [1069, 1038, 1089, 1090, 1001, 1131, 1187],
                is_back_btn: false,
                data: {},
                pay_status: 0,
                pay_msg: '',
                payment_confirm_modal_status: false,
                is_first: 1,
                pay_btn_text: this.$t('common.again_pay_text'),
                pay_back_app_text: this.$t('common.back_app_text')
            };
        },

        components: {
            componentCommon,
            componentNoData
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            params = app.globalData.launch_params_handle(params);
            var scene = app.globalData.get_scene_data();
            this.setData({
                params: params,
                scene: scene,
                is_back_btn: this.scene_back_arr.indexOf(scene) != -1,
            });

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // // 初始化
            get_data() {
                var self = this;
                var action = 'login';
                // #ifdef MP-BAIDU
                action = 'getLoginCode';
                // #endif
                uni[action]({
                    success: (res) => {
                        if (res.code) {
                            uni.request({
                                url: app.globalData.get_request_url("paydata", "cashier", self.params.plugins || ''),
                                method: 'POST',
                                data: {...self.params, ...{authcode: res.code}},
                                dataType: 'json',
                                success: (res) => {
                                    uni.stopPullDownRefresh();
                                    if (res.data.code == 0 && (res.data.data || null) != null) {
                                        this.setData({
                                            data_list_loding_status: 3,
                                            data_list_loding_msg: '',
                                            data: res.data.data,
                                        });
                                    
                                        // 直接调起支付
                                        this.pay_handle();
                                    } else {
                                        this.setData({
                                            is_first: 0,
                                            data_list_loding_status: 0,
                                            data_list_loding_msg: res.data.msg,
                                        });
                                    }
                                },
                                fail: () => {
                                    uni.stopPullDownRefresh();
                                    this.setData({
                                        is_first: 0,
                                        data_list_loding_status: 0,
                                        data_list_loding_msg: self.$t('common.internet_error_tips'),
                                    });
                                },
                            });
                        }
                    },
                    fail: (e) => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            is_first: 0,
                            data_list_loding_status: 0,
                            data_list_loding_msg: self.$t('login.login.3nmrg2'),
                        });
                    },
                });
            },

            // 支付处理
            pay_handle() {
                if(this.pay_status != 1) {
                    var self = this;
                    var data = self.data.pay_data;
                    // 是否打开另一个小程序
                    if (typeof data != 'string' && (data.appid || null) != null && (data.path || null) != null && (data.order_no || null) != null) {
                        uni.navigateToMiniProgram({
                            appId: data.appid,
                            path: data.path,
                            extraData: data.extra_data || {},
                            success(res) {
                                // 提示弹窗
                                self.setData({
                                    is_first: 0,
                                    payment_confirm_modal_status: true,
                                });
                            },
                            fail(res) {
                                self.setData({
                                    is_first: 0,
                                    pay_status: 2,
                                    pay_msg: self.is_first == 1 ? '' : self.$t('paytips.paytips.6y488i'),
                                    pay_btn_text: self.is_first == 1 ? self.$t('common.click_pay_text') : self.$t('common.again_pay_text'),
                                });
                            }
                        });
                    } else {
                        self.setData({
                            is_first: 0,
                            pay_status: 0,
                            pay_msg: self.$t('common.payment_in_text'),
                        });
                        uni.requestPayment({
                            timeStamp: data.timeStamp,
                            nonceStr: data.nonceStr,
                            package: data.package,
                            signType: data.signType,
                            paySign: data.paySign,
                            success: (res) => {
                                self.setData({
                                    pay_status: 1,
                                    pay_msg: self.$t('paytips.paytips.679rxu'),
                                });
                            },
                            fail: (res) => {
                                self.setData({
                                    pay_status: 2,
                                    pay_msg: self.$t('paytips.paytips.6y488i'),
                                });
                            },
                        });
                    }
                }
            },

            // 支付确认弹窗事件
            payment_confirm_event(e) {
                // 关闭弹窗清除定时任务
                this.setData({
                    payment_confirm_modal_status: false,
                });
                // 回调处理
                if(parseInt(e.currentTarget.dataset.type || 0) == 1) {
                    this.setData({
                        pay_status: 1,
                        pay_msg: this.$t('paytips.paytips.679rxu'),
                    });
                } else {
                    this.setData({
                        pay_status: 2,
                        pay_msg: this.$t('paytips.paytips.6y488i'),
                    });
                }
            }
        }
    };
</script>
<style scoped>
    @import './cashier.css';
</style>