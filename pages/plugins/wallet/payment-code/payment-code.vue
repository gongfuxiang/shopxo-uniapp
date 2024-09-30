<template>
    <view :class="theme_view">
        <view class="scroll-box bg-white">
            <!-- 主体内容 -->
            <block v-if="data_list_loding_status == 3">
                <!-- 条码 -->
                <view class="brcode auto">
                    <w-barcode :options="barcode"></w-barcode>
                    <view class="fw-b tc margin-top text-size-lg">{{ payment_code }}</view>
                </view>

                <!-- 二维码 -->
                <view class="qrcode auto br radius">
                    <w-qrcode :options="qrcode"></w-qrcode>
                </view>

                <!-- 提示信息 -->
                <view class="cr-grey tc margin-top-xxxl">{{$t('member-code.member-code.oc4x18')}}</view>

                <!-- 倒计时 -->
                <view class="margin-top-xxxl cr-yellow tc">({{ scheduled_value }}{{$t('payment-code.payment-code.b74qxe')}}</view>

                <!-- 导航 -->
                <view v-if="(plugins_membershiplevelvip || null) != null" class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view class="bg-white br-grey-d round oh">
                            <button type="default" class="btn bg-white round text-size fl br-0" size="mini" :data-value="'/pages/plugins/membershiplevelvip/member-code/member-code?screen_brightness_value=' + screen_brightness_value" data-redirect="1" @tap="url_event">{{$t('member-code.member-code.26bu38')}}</button>
                            <button type="default" class="btn bg-main cr-white round text-size fr br-0" size="mini">{{$t('member-code.member-code.x58gqu')}}</button>
                        </view>
                    </view>
                </view>
            </block>

            <!-- 错误提示 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            <view v-if="is_to_login == 1" class="margin-top-lg tc">
                <button type="default" class="bg-main br-main cr-white" size="mini" data-value="/pages/login/login" @tap="url_event">{{$t('member-code.member-code.yj6g3a')}}</button>
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
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                is_to_login: 0,
                screen_brightness_value: 0,
                plugins_membershiplevelvip: null,
                scheduled_timer: null,
                scheduled_value: 0,
                payment_code: '',
                barcode: {
                    width: 660,
                    height: 120,
                    code: '',
                },
                qrcode: {
                    code: '',
                    size: 450,
                },
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        // 页面加载初始化
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 获取屏幕亮度
            // #ifndef H5
            var self = this;
            if ((params || null) != null && (params.screen_brightness_value || null) == null) {
                uni.getScreenBrightness({
                    success: function (res) {
                        self.setData({
                            screen_brightness_value: res.value,
                        });
                    },
                });
            } else {
                self.setData({
                    screen_brightness_value: params.screen_brightness_value,
                });
            }
            // #endif
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        plugins_membershiplevelvip: app.globalData.get_config('plugins_base.membershiplevelvip', null),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 获取付款码
                    this.get_data();

                    // #ifndef H5
                    // 设置屏幕亮度
                    uni.setScreenBrightness({
                        value: 1,
                    });
                    // #endif
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('setup.setup.nwt4o1'),
                        is_to_login: 1,
                    });
                }
            },

            // 获取付款码
            get_data() {
                clearInterval(this.scheduled_timer);
                var self = this;
                uni.request({
                    url: app.globalData.get_request_url('paymentcode', 'user', 'wallet'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var time = parseInt(res.data.data.time || 30);
                            var timer = setInterval(function () {
                                if (time <= 1) {
                                    self.get_data();
                                } else {
                                    time--;
                                    self.setData({ scheduled_value: time });
                                }
                            }, 1000);

                            // 付款码数据
                            var barcode = this.barcode;
                            var qrcode = this.qrcode;
                            barcode['code'] = res.data.data.code;
                            qrcode['code'] = res.data.data.code;
                            this.setData({
                                data_list_loding_status: 3,
                                is_to_login: 0,
                                barcode: barcode,
                                qrcode: qrcode,
                                payment_code: res.data.data.code,
                                scheduled_timer: timer,
                                scheduled_value: time,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                is_to_login: 0,
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            is_to_login: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },

        // 页面销毁时执行
        onUnload: function () {
            clearInterval(this.scheduled_timer);
            // #ifndef H5
            // 恢复屏幕原始亮度
            if (this.screen_brightness_value > 0) {
                uni.setScreenBrightness({
                    value: this.screen_brightness_value,
                });
            }
            // #endif
        },
    };
</script>
<style>
    @import './payment-code.css';
</style>
