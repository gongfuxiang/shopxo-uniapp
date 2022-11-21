<template>
    <view class="scroll-box bg-white">
        <!-- 主体内容 -->
        <block v-if="data_list_loding_status == 3">
            <!-- 条码 -->
            <view class="brcode auto">
                <w-barcode :options="barcode"></w-barcode>
                <view class="fw-b tc margin-top text-size-lg">{{member_code}}</view>
            </view>

            <!-- 二维码 -->
            <view class="qrcode auto br radius">
                <w-qrcode :options="qrcode"></w-qrcode>
            </view>

            <!-- 提示信息 -->
            <view class="cr-grey tc margin-top-xxxl">如遇到扫码失败请将屏幕调至最亮重新扫码</view>
            
            <!-- 导航 -->
            <view class="bottom-fixed padding-main">
                <view class="bg-gray round oh">
                    <button type="default" class="bg-main br-main cr-white round fl" size="mini">会员码</button>
                    <button type="default" class="bg-gray br-gray cr-base round fr" size="mini" data-value="/pages/plugins/wallet/payment-code/payment-code" data-redirect="1" @tap="url_event">钱包付款码</button>
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
                user: null,
                member_code: '',
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

        onShow() {
            // 获取屏幕亮度
            // #ifndef H5
            var self = this;
            uni.getScreenBrightness({
            	success: function (res) {
                    self.setData({
                        screen_brightness_value: res.value
                    });
            	}
            });
            // #endif

            // 数据加载
            this.init();
        },

        methods: {
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
                        if((user.number_code || null) != null) {
                            // 会员码数据
                            var barcode = this.barcode;
                            var qrcode = this.qrcode;
                            barcode['code'] = user.number_code;
                            qrcode['code'] = user.number_code;
                            this.setData({
                                data_list_loding_status: 3,
                                is_to_login: 0,
                                user: user,
                                barcode: barcode,
                                qrcode: qrcode,
                                member_code: user.number_code,
                            });

                            // #ifndef H5
                            // 设置屏幕亮度
                            uni.setScreenBrightness({
                                value: 1
                            });
                            // #endif
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: '会员码为空',
                                is_to_login: 0
                            });
                        }
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: '请先登录',
                        is_to_login: 1
                    });
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },

        // 页面销毁时执行
        onUnload: function() {
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
    @import './member-code.css';
</style>