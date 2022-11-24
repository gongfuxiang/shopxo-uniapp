<template>
    <view class="scroll-box bg-white">
        <!-- 主体内容 -->
        <block v-if="data_list_loding_status == 3">
            <!-- 条码 -->
            <view class="brcode auto">
                <w-barcode :options="barcode"></w-barcode>
                <view class="fw-b tc margin-top text-size-lg">{{payment_code}}</view>
            </view>

            <!-- 二维码 -->
            <view class="qrcode auto br radius">
                <w-qrcode :options="qrcode"></w-qrcode>
            </view>

            <!-- 提示信息 -->
            <view class="cr-grey tc margin-top-xxxl">如遇到扫码失败请将屏幕调至最亮重新扫码</view>
            
            <!-- 倒计时 -->
            <view class="margin-top-xxxl cr-yellow tc">({{scheduled_value}})秒后自动刷新付款码</view>

            <!-- 导航 -->
            <view v-if="(plugins_membershiplevelvip || null) != null" class="bottom-fixed padding-main">
                <view class="bg-gray round oh">
                    <button type="default" class="bg-gray br-gray cr-base round text-size fl" size="mini" :data-value="'/pages/plugins/membershiplevelvip/member-code/member-code?screen_brightness_value='+screen_brightness_value" data-redirect="1" @tap="url_event">会员码</button>
                    <button type="default" class="bg-main br-main cr-white round text-size fr" size="mini">钱包付款码</button>
                </view>
            </view>
        </block>

        <!-- 错误提示 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        <view v-if="is_to_login == 1" class="margin-top-lg tc">
            <button type="default" class="bg-main br-main cr-white" size="mini" data-value="/pages/login/login" @tap="url_event">去登录</button>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                is_to_login: 0,
                screen_brightness_value: 0,
                plugins_membershiplevelvip: null,
                scheduled_timer: null,
                scheduled_value: 0,
                payment_code: '',
                barcode:{
                    width: 660,
                    height: 120,
                    code: ''
                },
                qrcode:{
                    code: '',
                    size: 450,
                }
            }
        },

        components: {
            componentNoData
        },

        // 页面加载初始化
        onLoad(params) {
            // 获取屏幕亮度
            // #ifndef H5
            var self = this;
            if((params || null) != null && (params.screen_brightness_value || null) == null) {
                uni.getScreenBrightness({
                    success: function (res) {
                        self.setData({
                            screen_brightness_value: res.value
                        });
                    }
                });
            } else {
                self.setData({
                    screen_brightness_value: params.screen_brightness_value
                });
            }
            // #endif
        },

        onShow() {
            // 数据加载
            this.init();
        
            // 初始化配置
            this.init_config();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        plugins_membershiplevelvip: app.globalData.get_config('plugins_base.membershiplevelvip', null)
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        this.setData({
                            data_list_loding_status: 0,
                            data_list_loding_msg: '请先绑定手机',
                            is_to_login: 1
                        });
                        return false;
                    } else {
                        // 获取付款码
                        this.get_data();

                        // #ifndef H5
                        // 设置屏幕亮度
                        uni.setScreenBrightness({
                            value: 1
                        });
                        // #endif
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: '请先登录',
                        is_to_login: 1
                    });
                }
            },

            // 获取付款码
            get_data() {
                clearInterval(this.scheduled_timer);
                var self = this;
                uni.request({
                    url: app.globalData.get_request_url("paymentcode", "user", "wallet"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        if(res.data.code == 0) {
                            var time = parseInt(res.data.data.time || 30);
                            var timer = setInterval(function() {
                                if(time <= 1) {
                                    self.get_data();
                                } else {
                                    time--;
                                    self.setData({scheduled_value: time});
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
                                data_list_loding_msg: res.msg,
                                is_to_login: 0
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错',
                            is_to_login: 0
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },

        // 页面销毁时执行
        onUnload: function() {
            clearInterval(this.scheduled_timer);
            // #ifndef H5
            // 恢复屏幕原始亮度
            if(this.screen_brightness_value > 0) {
                uni.setScreenBrightness({
                	value: this.screen_brightness_value
                });
            }
            // #endif
        }
    }
</script>
<style>
    @import './payment-code.css';
</style>