<template>
    <view>
        <!-- 支付二维码展示 -->
        <component-popup :propShow="popup_view_pay_qrcode_is_show" propPosition="bottom" @onclose="popup_view_pay_qrcode_event_close">
            <view class="padding-top-xxxl padding-bottom-xxxl padding-left-xxxl padding-right-xxxl tc">
                <block
                    v-if="(popup_view_pay_data || null) == null || (popup_view_pay_data.qrcode_url || null) == null || (popup_view_pay_data.name || null) == null || (popup_view_pay_data.check_url || null) == null || (popup_view_pay_data.order_no || null) == null">
                    <text class="cr-gray">无支付信息</text>
                </block>
                <block v-else>
                    <view class="fw-b text-size cr-base margin-bottom-sm">{{popup_view_pay_data.name}}</view>
                    <image :src="popup_view_pay_data.qrcode_url" mode="aspectFit" class="dis-block auto max-w"></image>
                    <view v-if="(popup_view_pay_data.msg || null) != null" class="cr-yellow margin-top-sm">{{popup_view_pay_data.msg}}</view>
                    <!-- #ifdef H5 -->
                    <view v-if="(popup_view_pay_data.pay_url) != null" class="margin-top-xl">
                        <a :href="popup_view_pay_data.pay_url" target="_blank" class="dis-inline-block cr-green">尝试点击去支付</a>
                    </view>
                    <!-- #endif -->
                </block>
            </view>
        </component-popup>
        <!-- 支付方式 popup -->
        <component-popup :propShow="is_show_payment_popup" propPosition="bottom" @onclose="payment_popup_event_close">
            <view v-if="propPaymentList.length > 0" class="payment-list oh bg-base padding-main">
                <view class="padding-top-main padding-left-main">
                    <view v-for="(item, index) in propPaymentList" :key="index" class="item tc fl">
                        <view class="item-content bg-white border-radius-main margin-right-main margin-bottom-main" :data-value="item.id" @tap="popup_payment_event">
                            <image v-if="(item.logo || null) != null" class="icon va-m margin-right-sm" :src="item.logo" mode="widthFix"></image>
                            <text class="va-m">{{item.name}}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else class="padding-top-xxxl padding-bottom-xxxl oh bg-white tc cr-gray">没有支付方式</view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentPopup from "@/components/popup/popup";
    export default {
        name: "pay",
        props: {
            propPaymentList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            propIsShowPayment: {
                type: Boolean,
                default: false
            },
            propIsShowQrcode: {
                type: Boolean,
                default: false
            },
            // 订单id
            propTempPayValue: {
                type: Number,
                default: 0
            },
            // 订单下标  ---- 用于处理支付成功后前端修改成功状态
            propTempPayIndex: {
                type: Number,
                default: 0
            },
            // 跳转第三方链接的重定向
            propNavStatusIndex: {
                type: Number,
                default: 0
            }
        },
        components: {
            componentPopup
        },
        watch: {
            propIsShowPayment(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        is_show_payment_popup: newVal
                    });
                }
            },
            propIsShowQrcode(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        popup_view_pay_qrcode_is_show: newVal
                    });
                }
            }
        },
        data() {
            return {
                // 弹窗开关
                is_show_payment_popup: false,
                popup_view_pay_qrcode_is_show: false,
                // 定时器
                popup_view_pay_timer: null,
                popup_view_pay_data: null,
                // 支付id
                payment_id: 0,
                order_id: 0
            };
        },
        methods: {
            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false
                });
                this.$emit('close-payment-poupon', false)
            },
            // 支付二维码展示窗口事件
            popup_view_pay_qrcode_event_close(e) {
                this.setData({
                    popup_view_pay_qrcode_is_show: false
                });
                this.$emit('close-qrcode-poupon', false)
            },
            // 支付弹窗发起支付
            popup_payment_event(e) {
                var payment_id = e.currentTarget.dataset.value || 0;
                this.setData({
                    payment_id: payment_id,
                    is_show_payment_popup: false
                });
                this.pay_handle(this.propTempPayValue, this.propTempPayIndex);
                this.$emit('close-payment-poupon', false)
            },
            // 支付方法
            pay_handle(order_id, index) {
                // #ifdef H5
                // 微信环境判断是否已有web_openid、不存在则不继续执行跳转到插件进行授权
                if (!app.globalData.is_user_weixin_web_openid(order_id, this.payment_id)) {
                    return false;
                }
                // #endif
                // 支付方式
                var payment = null;
                for (var i in this.propPaymentList) {
                    if (this.propPaymentList[i]['id'] == this.payment_id) {
                        payment = this.propPaymentList[i];
                    }
                }
                if (payment == null) {
                    app.globalData.showToast('支付方式有误');
                    return false;
                }
                // 请求数据
                var post_data = {
                    id: order_id,
                    payment_id: this.payment_id
                };
                // h5自定义重定向地址
                // #ifdef H5
                post_data['redirect_url'] = encodeURIComponent(base64.encode(app.globalData.get_page_url(false) + (this.propNavStatusIndex > 0 ? '?status=' + this.propNavStatusIndex : '')));
                // paypal支付方式使用respond_url返回地址、移除重定向地址
                if (payment.payment == 'PayPal') {
                    post_data['respond_url'] = post_data['redirect_url'];
                    delete post_data['redirect_url'];
                }
                // #endif
                // 请求支付接口
                uni.showLoading({
                    title: "请求中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("pay", "buy", "membershiplevelvip"),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
                            this.common_pay_handle(this, data, index);
                            // #endif
                            // #ifdef MP-KUAISHOU
                            this.kuaishou_pay_handle(this, data, index);
                            // #endif
                            // #ifdef MP-QQ
                            this.qq_pay_handle(this, data, index);
                            // #endif
                            // #ifdef H5
                            this.h5_pay_handle(this, data, index);
                            // #endif
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },
            // 快手小程序
            kuaishou_pay_handle(self, data, index) {
                uni.pay({
                    orderInfo: data.data,
                    serviceId: '1',
                    success: res => {
                        // 数据设置
                        self.order_item_pay_success_handle(data,index);
                        // 跳转支付页面
                        uni.navigateTo({
                            url: "/pages/paytips/paytips?code=9000"
                        });
                    },
                    fail: res => {
                        app.globalData.showToast('支付失败');
                        self.order_item_pay_fail_handle(data,index);
                    }
                });
            },
            // 微信、支付宝、百度、头条、QQ
            common_pay_handle(self, data, index) {
                uni.requestPayment({
                    // #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
                    orderInfo: data.data,
                    // #endif
                    // #ifdef MP-QQ
                    package: data.data,
                    // #endif
                    // #ifdef MP-WEIXIN
                    timeStamp: data.data.timeStamp,
                    nonceStr: data.data.nonceStr,
                    package: data.data.package,
                    signType: data.data.signType,
                    paySign: data.data.paySign,
                    // #endif
                    // #ifdef MP-TOUTIAO
                    service: 5,
                    // #endif
                    success: res => {
                        // #ifdef MP-ALIPAY
                        if (res.resultCode != 9000) {
                            app.globalData.showToast(res.memo || '支付失败');
                            return false;
                        }
                        // #endif
                        // #ifdef MP-TOUTIAO
                        if (res.code != 0) {
                            app.globalData.showToast('支付失败');
                            return false;
                        }
                        // #endif
                        // 数据设置
                        self.order_item_pay_success_handle(data,index);
                        // 跳转支付页面
                        uni.navigateTo({
                            url: "/pages/paytips/paytips?code=9000"
                        });
                    },
                    fail: res => {
                        app.globalData.showToast('支付失败');
                        self.order_item_pay_fail_handle(data,index);
                    }
                });
            },
            // QQ支付处理
            qq_pay_handle(self, data, index) {
                // 是否微信支付
                if (data.payment.payment == 'Weixin') {
                    uni.requestWxPayment({
                        url: data.data,
                        referer: app.globalData.data.request_url,
                        success: function(res) {
                            app.globalData.alert({
                                msg: '支付成功后、请不要重复支付、如果订单状态未成功请联系客服处理',
                                is_show_cancel: 0
                            });
                            // 支付借口调用成功，但是不知道是否支付成功，所以需要重新获取列表数据
                            this.$emit('reset-event')
                        },
                        fail: function(res) {
                            app.globalData.showToast('支付失败');
                        }
                    });
                } else {
                    self.common_pay_handle(self, data, index);
                }
            },
            // h5支付处理
            h5_pay_handle(self, data, index) {
                // 字符串则为跳转地址直接进入
                if (typeof data.data == 'string') {
                    window.location.href = data.data;
                } else {
                    var status = false;
                    // 微信jsapi
                    if (data.payment.payment == 'Weixin' && (data.data.appId || null) != null && (data.data.timeStamp || null) != null && (data.data.nonceStr || null) != null && (data.data.package ||
                            null) != null && (data.data.signType || null) != null && (data.data.paySign || null) != null) {
                        status = true;

                        function onBridgeReady() {
                            WeixinJSBridge.invoke("getBrandWCPayRequest", {
                                appId: data.data.appId,
                                timeStamp: data.data.timeStamp,
                                nonceStr: data.data.nonceStr,
                                package: data.data.package,
                                signType: data.data.signType,
                                paySign: data.data.paySign
                            }, function(res) {
                                if (res.err_msg == "get_brand_wcpay_request:ok") {
                                    // 数据设置
                                    self.order_item_pay_success_handle(data,index);
                                    // 跳转支付页面
                                    uni.navigateTo({
                                        url: "/pages/paytips/paytips?code=9000"
                                    });
                                } else {
                                    self.order_item_pay_fail_handle(data,index);
                                }
                            });
                        }
                        if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                            } else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                            }
                        } else {
                            onBridgeReady();
                        }
                    }
                    // 二维码展示
                    if ((data.data.qrcode_url || null) != null && (data.data.name || null) != null && (data.data.check_url || null) != null && (data.data.order_no || null) != null) {
                        status = true;
                        // 显示支付窗口
                        this.setData({
                            popup_view_pay_data: data.data,
                            popup_view_pay_qrcode_is_show: true
                        });
                        // 定时校验支付状态
                        var timer = setInterval(function() {
                            uni.request({
                                url: app.globalData.get_request_url("paycheck", "buy", "membershiplevelvip"),
                                method: 'POST',
                                data: {
                                    order_no: self.popup_view_pay_data.order_no,
                                },
                                dataType: 'json',
                                success: res => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        // 清除定时和支付数据
                                        clearInterval(self.popup_view_pay_timer);
                                        self.setData({
                                            popup_view_pay_data: null,
                                            popup_view_pay_qrcode_is_show: false
                                        });
                                        // 数据设置
                                        self.order_item_pay_success_handle(data,index);
                                        // 跳转支付页面
                                        uni.navigateTo({
                                            url: "/pages/paytips/paytips?code=9000"
                                        });
                                    } else {
                                        // -300支付中、其它状态则提示错误
                                        if (res.data.code != -300) {
                                            clearInterval(self.popup_view_pay_timer);
                                            app.globalData.showToast(res.data.msg);
                                        }
                                    }
                                },
                                fail: () => {
                                    clearInterval(self.popup_view_pay_timer);
                                    app.globalData.showToast('服务器请求出错');
                                    self.order_item_pay_fail_handle(data,index);
                                }
                            });
                        }, 3000);
                        self.setData({
                            popup_view_pay_timer: timer
                        });
                    }
                    // 返回html表单
                    if ((data.data.html || null) != null) {
                        status = true;
                        var div = document.createElement('paydivform');
                        div.innerHTML = data.data.html;
                        document.body.appendChild(div);
                        var fm = document.forms;
                        var fm_len = fm.length;
                        if (fm_len > 0) {
                            fm[fm_len - 1].submit();
                        }
                    }
                    // 未匹配到的支付处理方式
                    if (!status) {
                        app.globalData.showToast(data.payment.name + '支付方式还未适配');
                    }
                }
            },
            // 支付成功数据设置
            order_item_pay_success_handle(data,index) {
                this.$emit('pay-success', data,index)
            },
            // 支付成功数据设置
            order_item_pay_fail_handle(data,index) {
                this.$emit('pay-fail', data,index)
            },
            // 页面卸载
            onUnload(e) {
                clearInterval(this.popup_view_pay_timer);
            }
        }
    }
</script>
<style scoped>
    /**
    * 支付方式
    */
    .payment-list .item {
        width: 50%;
    }

    .payment-list .item-content {
        padding: 20rpx 10rpx;
    }

    .payment-list .item-content image {
        width: 50rpx;
        height: 50rpx !important;
    }
</style>