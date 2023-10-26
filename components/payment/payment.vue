<template>
    <view>
        <!-- 支付二维码展示 -->
        <component-popup :propShow="popup_view_pay_qrcode_is_show" propPosition="bottom" @onclose="popup_view_pay_qrcode_event_close">
            <view class="padding-top-xxxl padding-bottom-xxxl padding-left-xxxl padding-right-xxxl tc">
                <block v-if="(popup_view_pay_data || null) == null || (popup_view_pay_data.qrcode_url || null) == null || (popup_view_pay_data.name || null) == null || (popup_view_pay_data.check_url || null) == null || (popup_view_pay_data.order_no || null) == null">
                    <text class="cr-grey">无支付信息</text>
                </block>
                <block v-else>
                    <view class="fw-b text-size cr-base margin-bottom-sm">{{ popup_view_pay_data.name }}</view>
                    <image :src="popup_view_pay_data.qrcode_url" mode="aspectFit" class="dis-block auto max-w"></image>
                    <view v-if="(popup_view_pay_data.msg || null) != null" class="cr-yellow margin-top-sm">{{ popup_view_pay_data.msg }}</view>
                    <!-- #ifdef H5 -->
                    <view v-if="popup_view_pay_data.pay_url != null" class="margin-top-xl">
                        <a :href="popup_view_pay_data.pay_url" target="_blank" class="dis-inline-block cr-green">尝试点击去支付</a>
                    </view>
                    <!-- #endif -->
                </block>
            </view>
        </component-popup>
        <!-- 支付方式 popup -->
        <component-popup :propShow="is_show_payment_popup" propPosition="bottom" @onclose="payment_popup_event_close">
            <view class="poupon-title padding-main tc text-size-md pr">
                付款详情
                <iconfont name="icon-huiyuan-guanbi" class="pa right-0 margin-right-main margin-top-xs" size="30rpx" color="#999" @tap="payment_popup_event_close"></iconfont>
            </view>
            <view class="payment-price tc padding-top-sm padding-bottom-sm br-b">
                <text class="text-size-md">{{ currency_symbol }}</text>
                {{ propPayPrice }}
            </view>
            <view v-if="propPaymentList.length > 0" class="oh">
                <view class="payment-list">
                    <scroll-view scroll-y="true" class="scroll-y wh-auto">
                        <view v-for="(item, index) in propPaymentList" :key="index" class="item br-b flex-row jc-sb align-c" :data-value="item.id" @tap="checked_payment">
                            <view class="flex-1">
                                <image v-if="(item.logo || null) != null" class="icon va-m margin-right-sm" :src="item.logo" mode="widthFix"></image>
                                <text class="va-m">{{ item.name }}</text>
                            </view>
                            <iconfont :name="payment_id == item.id ? 'icon-zhifu-yixuan' : 'icon-zhifu-weixuan'" size="44rpx" :color="payment_id == item.id ? '#E22C08' : '#ccc'"></iconfont>
                            <!-- <iconfont v-else name="icon-qiandao-tancguanbi" size="44rpx" color="#ccc"></iconfont> -->
                        </view>
                    </scroll-view>
                </view>
                <view class="payment-sub">
                    <button class="bg-main br-main cr-white round text-size" type="default" hover-class="none" @tap="popup_payment_event" :disabled="submit_disabled_status">立即付款</button>
                </view>
            </view>
            <view v-else class="padding-top-xxxl padding-bottom-xxxl oh bg-white tc cr-grey">没有支付方式</view>
        </component-popup>

        <!-- 支付html展示 -->
        <component-popup :propShow="popup_view_pay_html_is_show" propPosition="bottom" @onclose="popup_view_pay_html_event_close">
            <view class="popup-pay-html-content padding-top-xxxl padding-bottom-xxxl padding-left-xxxl padding-right-xxxl tc">
                <block v-if="(popup_view_pay_data || null) == null">
                    <text class="cr-grey">无支付信息</text>
                </block>
                <block v-else>
                    <mp-html :content="popup_view_pay_data" />
                </block>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentPopup from '@/components/popup/popup';
    export default {
        name: 'pay',
        props: {
            propPayUrl: {
                type: String,
                default: '',
            },
            propQrcodeUrl: {
                type: String,
                default: '',
            },
            propPaymentList: {
                type: Array,
                default: () => {
                    return [];
                },
            },
            propIsShowPayment: {
                type: Boolean,
                default: false,
            },
            // 订单id
            propTempPayValue: {
                type: [String, Number],
                default: '',
            },
            // 订单id参数名，默认为id
            propPayDataKey: {
                type: String,
                default: 'id',
            },
            // 订单下标  ---- 用于处理支付成功后前端修改成功状态
            propTempPayIndex: {
                type: [Number, String],
                default: 0,
            },
            // 支付id 值为0表示没有配置支付方式
            propPaymentId: {
                type: [Number, String],
                default: 0,
            },
            // 默认支付id 值为0表示没有默认
            propDefaultPaymentId: {
                type: [Number, String],
                default: 0,
            },
            // 跳转第三方链接的重定向
            propNavStatusIndex: {
                type: Number,
                default: 0,
            },
            // 付款金额
            propPayPrice: {
                type: [Number, String],
                default: 0,
            },
            // 支付跳转页面
            propToPage: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            // 支付失败跳转页面
            propToFailPage: {
                type: String,
                default: '',
            },
            //
            propIsRedirectTo: {
                type: Boolean,
                default: false,
            },
        },
        components: {
            componentPopup,
        },
        watch: {
            propIsShowPayment(newVal, oldVal) {
                if (newVal !== oldVal) {
                    let bool = true;
                    if (this.propPaymentList.length === 1) {
                        bool = false;
                        this.setData({
                            payment_id: this.propPaymentList[0].id,
                        });
                    } else {
                        let self = this;
                        self.propPaymentList.forEach((item) => {
                            let new_payment_id = Number(self.propPaymentId) === 0 ? self.propDefaultPaymentId : Number(self.propPaymentId);
                            if (item.id == new_payment_id) {
                                bool = false;
                            }
                        });
                        this.setData({
                            payment_id: Number(this.propPaymentId) === 0 ? this.propDefaultPaymentId : Number(this.propPaymentId),
                        });
                    }
                    this.setData({
                        is_show_payment_popup: newVal,
                        submit_disabled_status: bool,
                    });
                    console.log('payment_id:' + this.payment_id);
                }
            },
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
                payment_id: Number(this.propPaymentId) === 0 ? this.propDefaultPaymentId : Number(this.propPaymentId),
                submit_disabled_status: true,
                order_id: 0,
                currency_symbol: app.globalData.data.currency_symbol,

                popup_view_pay_html_is_show: false,
            };
        },
        methods: {
            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false,
                });
                this.$emit('close-payment-poupon', false);
            },
            // 支付二维码展示窗口事件
            popup_view_pay_qrcode_event_close(e) {
                this.setData({
                    popup_view_pay_qrcode_is_show: false,
                });
            },
            // 选择支付方式
            checked_payment(e) {
                this.setData({
                    payment_id: e.currentTarget.dataset.value,
                    submit_disabled_status: false,
                });
            },
            // 支付弹窗发起支付
            popup_payment_event() {
                if (this.submit_disabled_status) {
                    app.globalData.showToast('请先选择支付方式');
                    return false;
                }
                this.setData({
                    is_show_payment_popup: false,
                });
                this.pay_handle(this.propTempPayValue, this.payment_id);
                this.$emit('close-payment-poupon', false);
            },
            // 支付方法
            pay_handle(order_id, payment_id) {
                // #ifdef H5
                // 微信环境判断是否已有web_openid、不存在则不继续执行跳转到插件进行授权
                if (!app.globalData.is_user_weixin_web_openid(order_id, payment_id || this.payment_id)) {
                    return false;
                }
                // #endif
                // 支付方式
                var payment = null;
                for (var i in this.propPaymentList) {
                    if (this.propPaymentList[i]['id'] == (payment_id || this.payment_id)) {
                        payment = this.propPaymentList[i];
                    }
                }
                if (payment == null) {
                    app.globalData.showToast('支付方式有误');
                    return false;
                }
                // 请求数据
                var post_data = {
                    [this.propPayDataKey]: order_id,
                    payment_id: payment_id || this.payment_id,
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
                    title: '请求中...',
                });
                if (this.propPayUrl) {
                    uni.request({
                        url: this.propPayUrl,
                        method: 'POST',
                        data: post_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                // 是否直接支付成功
                                if ((res.data.data.is_success || 0) == 1) {
                                    // 数据设置
                                    this.order_item_pay_success_handle(data, order_id, false);
                                    app.globalData.showToast('支付成功', 'success');
                                    setTimeout(() => {
                                        this.to_success_page_event();
                                    }, 2000);
                                } else {
                                    // 支付方式类型
                                    let payment_type = Number(res.data.data.is_payment_type || 0);
                                    switch (payment_type) {
                                        // 正常线上支付
                                        case 0:
                                            var data = res.data.data;
                                            // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
                                            this.common_pay_handle(this, data, order_id);
                                            // #endif
                                            // #ifdef MP-KUAISHOU
                                            this.kuaishou_pay_handle(this, data, order_id);
                                            // #endif
                                            // #ifdef MP-QQ
                                            this.qq_pay_handle(this, data, order_id);
                                            // #endif
                                            // #ifdef H5
                                            this.h5_pay_handle(this, data, order_id);
                                            // #endif
                                            break;
                                        // 线下支付
                                        case 1:
                                            // 现金支付
                                            uni.showModal({
                                                content: res.data.msg,
                                                showCancel: false,
                                                success(res) {
                                                    if (res.confirm) {
                                                        // 跳转订单列表页
                                                        uni.redirectTo({
                                                            url: '/pages/user-order/user-order?data=' + order_id,
                                                        });
                                                    }
                                                },
                                            });
                                            break;
                                        // 钱包支付
                                        case 2:
                                            this.order_item_pay_success_handle(data, order_id);
                                            break;
                                        // 默认
                                        default:
                                            app.globalData.showToast('支付类型有误');
                                    }
                                }
                            } else {
                                // 是否返回html代码展示、则提示错误
                                if (res.data.code == -6666 && (res.data.data || null) != null) {
                                    this.setData({
                                        popup_view_pay_data: res.data.data,
                                        popup_view_pay_html_is_show: true,
                                    });
                                } else {
                                    this.order_item_pay_fail_handle(res.data.data, order_id, res.data.msg);
                                }
                            }
                        },
                        fail: (res) => {
                            uni.hideLoading();
                            this.order_item_pay_fail_handle(res.data.data, order_id, '服务器请求出错');
                        },
                    });
                } else {
                    app.globalData.showToast('支付组件接口不能为空');
                }
            },
            // 快手小程序
            kuaishou_pay_handle(self, data, order_id) {
                uni.pay({
                    orderInfo: data.data,
                    serviceId: '1',
                    success: (res) => {
                        // 数据设置
                        self.order_item_pay_success_handle(data, order_id);
                    },
                    fail: (res) => {
                        self.order_item_pay_fail_handle(data, order_id, '支付失败');
                    },
                });
            },
            // 微信、支付宝、百度、头条、QQ
            common_pay_handle(self, data, order_id) {
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
                    success: (res) => {
                        // #ifdef MP-ALIPAY
                        if (res.resultCode != 9000) {
                            self.order_item_pay_fail_handle(data, order_id, res.memo || '支付失败');
                            return false;
                        }
                        // #endif
                        // #ifdef MP-TOUTIAO
                        if (res.code != 0) {
                            self.order_item_pay_fail_handle(data, order_id, '支付失败');
                            return false;
                        }
                        // #endif
                        // 数据设置
                        self.order_item_pay_success_handle(data, order_id);
                    },
                    fail: (res) => {
                        self.order_item_pay_fail_handle(data, order_id, '支付失败');
                    },
                });
            },
            // QQ支付处理
            qq_pay_handle(self, data, order_id) {
                // 是否微信支付
                if (data.payment.payment == 'Weixin') {
                    uni.requestWxPayment({
                        url: data.data,
                        referer: app.globalData.data.request_url,
                        success: function (res) {
                            app.globalData.alert({
                                msg: '支付成功后、请不要重复支付、如果订单状态未成功请联系客服处理',
                                is_show_cancel: 0,
                            });
                            // 支付接口调用成功，但是不知道是否支付成功，所以需要重新获取列表数据
                            this.$emit('reset-event');
                        },
                        fail: function (res) {
                            self.order_item_pay_fail_handle(data, order_id, '支付失败');
                        },
                    });
                } else {
                    self.common_pay_handle(self, data, order_id);
                }
            },
            // h5支付处理
            h5_pay_handle(self, data, order_id) {
                // 字符串则为跳转地址直接进入
                if (typeof data.data == 'string') {
                    window.location.href = data.data;
                } else {
                    var status = false;
                    // 微信jsapi
                    if (data.payment.payment == 'Weixin' && (data.data.appId || null) != null && (data.data.timeStamp || null) != null && (data.data.nonceStr || null) != null && (data.data.package || null) != null && (data.data.signType || null) != null && (data.data.paySign || null) != null) {
                        status = true;

                        function onBridgeReady() {
                            WeixinJSBridge.invoke(
                                'getBrandWCPayRequest',
                                {
                                    appId: data.data.appId,
                                    timeStamp: data.data.timeStamp,
                                    nonceStr: data.data.nonceStr,
                                    package: data.data.package,
                                    signType: data.data.signType,
                                    paySign: data.data.paySign,
                                },
                                function (res) {
                                    if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                        // 数据设置
                                        self.order_item_pay_success_handle(data, order_id);
                                    } else {
                                        self.order_item_pay_fail_handle(data, order_id, res.err_msg);
                                    }
                                }
                            );
                        }
                        if (typeof WeixinJSBridge == 'undefined') {
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
                            popup_view_pay_qrcode_is_show: true,
                        });
                        if (this.propQrcodeUrl) {
                            // 定时校验支付状态
                            var timer = setInterval(function () {
                                uni.request({
                                    url: this.propQrcodeUrl,
                                    method: 'POST',
                                    data: {
                                        order_no: self.popup_view_pay_data.order_no,
                                    },
                                    dataType: 'json',
                                    success: (res) => {
                                        uni.hideLoading();
                                        if (res.data.code == 0) {
                                            // 清除定时和支付数据
                                            clearInterval(self.popup_view_pay_timer);
                                            self.setData({
                                                popup_view_pay_data: null,
                                                popup_view_pay_qrcode_is_show: false,
                                            });
                                            // 数据设置
                                            self.order_item_pay_success_handle(data, order_id);
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
                                        self.order_item_pay_fail_handle(data, order_id, '服务器请求出错');
                                    },
                                });
                            }, 3000);
                            self.setData({
                                popup_view_pay_timer: timer,
                            });
                        }
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
            // 支付成功数据设置 data:后台返回的参数， order_id: 订单id，is_to_page，是否需要跳转页面的参数控制
            order_item_pay_success_handle(data, order_id, is_to_page = true) {
                let newData = {
                    data: data,
                    order_id: order_id,
                    is_to_page: is_to_page,
                };
                this.$emit('pay-success', newData, this.propTempPayIndex, Number(this.propPaymentId) === 0 ? this.propDefaultPaymentId : Number(this.propPaymentId));
                if (is_to_page) {
                    this.to_success_page_event();
                }
            },
            // 支付失败数据设置 data:后台返回的参数， order_id: 订单id, msg: 错误提示信息
            order_item_pay_fail_handle(data, order_id, msg) {
                let newData = {
                    data: data,
                    order_id: order_id,
                    temp_pay_index: this.propTempPayIndex,
                    payment_id: this.payment_id,
                };
                this.$emit('pay-fail', newData);
                this.to_fail_page_event(msg);
            },
            // 成功跳转
            to_success_page_event() {
                let url_data = {
                    code: '9000',
                };
                url_data = Object.assign({}, url_data, this.propToPage);
                if (this.propIsRedirectTo) {
                    // 跳转支付页面
                    uni.redirectTo({
                        url: '/pages/paytips/paytips?params=' + encodeURIComponent(base64.encode(JSON.stringify(url_data))),
                    });
                } else {
                    // 跳转支付页面
                    uni.navigateTo({
                        url: '/pages/paytips/paytips?params=' + encodeURIComponent(base64.encode(JSON.stringify(url_data))),
                    });
                }
            },
            // 失败跳转
            to_fail_page_event(msg) {
                let to_fail_page = this.propToFailPage;
                if (to_fail_page) {
                    if (msg) {
                        // 现金支付
                        uni.showModal({
                            content: msg,
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    // 跳转支付页面
                                    uni.redirectTo({
                                        url: to_fail_page,
                                    });
                                }
                            },
                        });
                    } else {
                        // 跳转支付页面
                        uni.redirectTo({
                            url: to_fail_page,
                        });
                    }
                } else {
                    if (msg) {
                        app.globalData.showToast(msg);
                    }
                }
            },
            // 页面卸载
            onUnload(e) {
                clearInterval(this.popup_view_pay_timer);
            },
            // 支付html展示窗口事件
            popup_view_pay_html_event_close(e) {
                this.setData({
                    popup_view_pay_html_is_show: false,
                });
                this.to_fail_page_event();
            },
        },
    };
</script>
<style scoped>
    /**
    * 支付方式
    */
    .payment-price {
        font-size: 80rpx;
    }

    .payment-list .scroll-y {
        max-height: 430rpx;
    }

    .payment-list .item {
        padding: 28rpx 28rpx 28rpx 32rpx;
    }

    .payment-list .item-content image {
        width: 50rpx;
        height: 50rpx !important;
    }

    .payment-sub {
        padding: 86rpx 90rpx 24rpx 90rpx;
    }
</style>
