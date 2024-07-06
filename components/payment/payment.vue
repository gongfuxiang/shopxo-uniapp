<template>
    <view :class="theme_view">
        <!-- 支付二维码展示 -->
        <component-popup :propShow="popup_view_pay_qrcode_is_show" propPosition="bottom" @onclose="popup_view_pay_qrcode_event_close">
            <view class="padding-top-xxxl padding-bottom-xxxl padding-left-xxxl padding-right-xxxl tc">
                <block v-if="(popup_view_pay_data || null) == null || (popup_view_pay_data.qrcode_url || null) == null || (popup_view_pay_data.name || null) == null || (popup_view_pay_data.check_url || null) == null || (popup_view_pay_data.order_no || null) == null">
                    <text class="cr-grey">{{$t('payment.payment.973g2e')}}</text>
                </block>
                <block v-else>
                    <view class="fw-b text-size cr-base margin-bottom-sm">{{ popup_view_pay_data.name }}</view>
                    <image :src="popup_view_pay_data.qrcode_url" mode="aspectFit" class="dis-block auto max-w"></image>
                    <view v-if="(popup_view_pay_data.msg || null) != null" class="cr-yellow margin-top-sm">{{ popup_view_pay_data.msg }}</view>
                    <!-- #ifdef H5 -->
                    <view v-if="popup_view_pay_data.pay_url != null" class="margin-top-xl">
                        <a :href="popup_view_pay_data.pay_url" target="_blank" class="dis-inline-block cr-green">{{$t('payment.payment.z3y296')}}</a>
                    </view>
                    <!-- #endif -->
                </block>
            </view>
        </component-popup>
        <!-- 支付方式 popup -->
        <component-popup :propShow="is_show_payment_popup" propPosition="bottom" @onclose="payment_popup_event_close">
            <view class="poupon-title padding-main tc text-size-md pr">{{$t('payment.payment.iu792d')}}<iconfont name="icon-close-o" propClass="pa right-0 margin-right-main margin-top-xs" size="30rpx" color="#999" @tap="payment_popup_event_close"></iconfont>
            </view>
            <view class="payment-price tc padding-top-sm padding-bottom-sm br-b">
                <text class="text-size-md">{{ propCurrencySymbol }}</text>
                {{ propPayPrice }}
            </view>
            <view v-if="payment_list.length > 0" class="oh">
                <view class="payment-list">
                    <scroll-view scroll-y="true" class="scroll-y wh-auto">
                        <view v-for="(item, index) in payment_list" :key="index" class="item br-b flex-row jc-sb align-c" :data-value="item.id" @tap="checked_payment">
                            <view class="flex-1">
                                <image v-if="(item.logo || null) != null" class="icon va-m margin-right-sm" :src="item.logo" mode="widthFix"></image>
                                <text class="va-m">{{ item.name }}</text>
                                <text v-if="(item.tips || null) !== null" class="va-m cr-red">（{{ item.tips }}）</text>
                            </view>
                            <iconfont :name="payment_id == item.id ? 'icon-zhifu-yixuan' : 'icon-zhifu-weixuan'" size="44rpx" :color="payment_id == item.id ? '#E22C08' : '#ccc'"></iconfont>
                        </view>
                    </scroll-view>
                </view>
                <view class="payment-sub">
                    <button class="bg-main br-main cr-white round text-size" type="default" hover-class="none" @tap="popup_payment_event" :disabled="submit_disabled_status">{{$t('payment.payment.25r53g')}}</button>
                </view>
            </view>
            <view v-else class="padding-top-xxxl padding-bottom-xxxl oh bg-white tc cr-grey">{{$t('payment.payment.058a46')}}</view>
        </component-popup>

        <!-- 支付html展示 -->
        <component-popup :propShow="popup_view_pay_html_is_show" propPosition="bottom" @onclose="popup_view_pay_html_event_close">
            <view class="popup-pay-html-content padding-top-xxxl padding-bottom-xxxl padding-left-xxxl padding-right-xxxl tc">
                <block v-if="(popup_view_pay_data || null) == null">
                    <text class="cr-grey">{{$t('payment.payment.973g2e')}}</text>
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
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol(),
            },
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
            // 付款金额
            propPayPrice: {
                type: [Number, String],
                default: 0,
            },
            // 支付跳转页面------跳转成功页面---后返回的页面
            propToPageBack: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            // 指定所有页面跳转到指定页面------除现金支付外
            propToPage: {
                type: String,
                default: '',
            },
            // 现金支付-指定跳转页面----不进入充值成功页面：不配置则表示不跳转
            propToAppointPage: {
                type: String,
                default: '',
            },
            // 支付失败跳转页面------不传则停留在当前页面
            propToFailPage: {
                type: String,
                default: '',
            },
            //是否需要关闭页面进行跳转
            propIsRedirectTo: {
                type: Boolean,
                default: false,
            },
            // 判断错误时是否需要弹窗提示
            propIsFailAlert: {
                type: Boolean,
                default: true,
            },
        },
        components: {
            componentPopup,
        },
        watch: {
            // 是否显示支付方式
            propIsShowPayment(newVal, oldVal) {
                if (newVal !== oldVal) {
                    let bool = true;
                    if (this.payment_list.length === 1) {
                        bool = false;
                        this.setData({
                            payment_id: this.payment_list[0].id,
                        });
                    } else {
                        let self = this;
                        self.payment_list.forEach((item) => {
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
                }
            },
            // 支付方式是否改变
            propPaymentList(value, old_value) {
                this.setData({
                    payment_list: value,
                });
            },
        },
        // 页面被展示
        created: function () {
            this.setData({
                payment_list: this.payment_list
            });
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                // 支付方式列表
                payment_list: [],
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
                popup_view_pay_html_is_show: false,
                // 打开url地址定时任务和状态
                open_pay_url_timer: null,
                open_pay_url_status: true,
            };
        },
        methods: {
            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false,
                });
                this.$emit('close-payment-popup', false);
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
                    app.globalData.showToast(this.$t('payment.payment.x6d585'));
                    return false;
                }
                this.setData({
                    is_show_payment_popup: false,
                });
                this.pay_handle(this.propTempPayValue, this.payment_id);
                this.$emit('close-payment-popup', false);
            },

            // 支付方法
            pay_handle(order_id, payment_id = 0, payment_list = []) {
                // 没有指定支付方式则使用属性传过来的值
                if((payment_list || null) != null && payment_list.length > 0) {
                    this.setData({
                        payment_list: payment_list
                    });
                }
                // 没有支付方式
                if((payment_id || 0) == 0) {
                    this.pay_handle_event(order_id, payment_id);
                } else {
                    // 循环匹配支付方式
                    this.payment_list.forEach((item) => {
                        if (item.id == payment_id) {
                            if (item.payment === 'WalletPay') {
                                var self = this;
                                uni.showModal({
                                    title: self.$t('common.warm_tips'),
                                    content: self.$t('payment.payment.011cj4'),
                                    confirmText: self.$t('common.confirm'),
                                    cancelText: self.$t('common.not_yet'),
                                    success(res) {
                                        if (res.confirm) {
                                            self.pay_handle_event(order_id, payment_id);
                                        } else {
                                            self.order_item_pay_fail_handle(null, order_id, self.$t('paytips.paytips.6mpsl7'));
                                        }
                                    },
                                });
                            } else {
                                this.pay_handle_event(order_id, payment_id);
                            }
                        }
                    });
                }
            },

            // 支付处理
            pay_handle_event(order_id, payment_id = 0) {
                // 没有指定支付方式则不匹配支付标识
                var payment = null;
                if((payment_id || 0) != 0) {
                    // #ifdef H5
                    // 微信环境判断是否已有web_openid、不存在则不继续执行跳转到插件进行授权
                    if (!app.globalData.is_user_weixin_web_openid(order_id, payment_id || this.payment_id)) {
                        return false;
                    }
                    // #endif
                    // 支付方式
                    for (var i in this.payment_list) {
                        if (this.payment_list[i]['id'] == (payment_id || this.payment_id)) {
                            payment = this.payment_list[i];
                        }
                    }
                    if (payment == null) {
                        app.globalData.showToast(this.$t('payment.payment.7ihx9u'));
                        return false;
                    }
                }

                // 请求数据
                var post_data = {
                    [this.propPayDataKey]: order_id,
                    payment_id: payment_id || this.payment_id,
                };
                // h5自定义重定向地址
                // #ifdef H5
                var redirect_url = app.globalData.page_url_protocol(this.propToAppointPage || app.globalData.get_page_url(false));
                post_data['redirect_url'] = encodeURIComponent(base64.encode(redirect_url));
                // 存在支付标识、指定支付方式使用respond_url返回地址、移除重定向地址
                if(payment != null) {
                    var respond_arr = ['PayPal', 'UniPayment'];
                    if (respond_arr.indexOf(payment.payment) != -1) {
                        post_data['respond_url'] = post_data['redirect_url'];
                        delete post_data['redirect_url'];
                    }
                }
                // #endif
                // 请求支付接口
                uni.showLoading({
                    title: this.$t('payment.payment.e1f54e'),
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
                                    app.globalData.showToast(this.$t('paytips.paytips.679rxu'), 'success');
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
                                            // #ifdef APP
                                            this.app_pay_handle(this, data, order_id);
                                            // #endif
                                            // #ifdef MP-TOUTIAO
                                            // 头条是否非普通版本支持
                                            if(parseInt(data.data.pay_type || 0) == 1) {
                                                this.toutiao_transaction_pay_handle(this, data, order_id);
                                            } else {
                                                this.mp_pay_handle(this, data, order_id);
                                            }
                                            // #endif
                                            // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU
                                            this.mp_pay_handle(this, data, order_id);
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
                                            let self = this;
                                            uni.showModal({
                                                content: res.data.msg,
                                                showCancel: false,
                                                success(res) {
                                                    if (res.confirm) {
                                                        self.to_other(order_id);
                                                    } else {
                                                        self.order_item_pay_fail_handle(data, order_id, self.$t('paytips.paytips.6mpsl7'));
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
                                            app.globalData.showToast(this.$t('payment.payment.vhx5dv'));
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
                            this.order_item_pay_fail_handle(res.data.data, order_id, this.$t('common.internet_error_tips'));
                        },
                    });
                } else {
                    app.globalData.showToast(this.$t('payment.payment.597s8b'));
                }
            },
            // APP支付
            app_pay_handle(self, data, order_id) {
                var arr = {
                    Alipay: 'alipay',
                    Weixin: 'wxpay',
                    PayPal: 'paypal'
                }
                var pay_value = arr[data.payment.payment] || null;
                if(pay_value != null) {
                    uni.getProvider({
                        service: 'payment',
                        success: function (res) {
                            if(~res.provider.indexOf(pay_value)) {
                                var pay_data = ((data.data.pay_data || null) == null) ? data.data : data.data.pay_data;
                                uni.requestPayment({
                                    provider: pay_value,
                                    orderInfo: pay_data,
                                    success: function (res) {
                                        // 是否需要回调捕获
                                        var call_back_url = data.data.call_back_url || null;
                                        if(call_back_url != null) {
                                            uni.request({url: call_back_url, method: 'GET'});
                                        }
                    
                                        // 成功处理数据
                                        self.order_item_pay_success_handle(data, order_id);
                                    },
                                    fail: function (err) {
                                        self.order_item_pay_fail_handle(data, order_id, self.$t('paytips.paytips.6y488i'));
                                    }
                                });
                            } else {
                                app.globalData.showToast(data.payment.payment+self.$t('payment.payment.bv637f'));
                            }
                        }
                    });
                } else {
                    // 先清除定时任务
                    if(self.open_pay_url_timer != null) {
                        clearTimeout(self.open_pay_url_timer);
                    }
                    // 显示加载层
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                        mask: true
                    });
                    // 设置打开url状态
                    self.setData({
                        open_pay_url_status: true
                    });
                    // 打开url
                    plus.runtime.openURL(data.data, function(error) {
                        uni.hideLoading();
                        // 打开url失败、并进入提示失败环节
                        self.setData({
                            open_pay_url_status: false
                        });
                        self.order_item_pay_fail_handle(data, order_id, error.message+'('+error.code+')');
                    });
                    // 定时3秒后提示用户确认支付状态
                    self.open_pay_url_timer = setTimeout(function() {
                        if(self.open_pay_url_status) {
                            uni.hideLoading();
                            uni.showModal({
                                content: self.$t('payment.payment.sdfs31'),
                                showCancel: true,
                                cancelText: self.$t('common.not_have_name'),
                                confirmText: self.$t('order.order.s8g966'),
                                success(res) {
                                    if (res.confirm) {
                                        self.order_item_pay_success_handle(data, order_id);
                                    } else {
                                        self.order_item_pay_fail_handle(data, order_id, self.$t('paytips.paytips.6y488i'));
                                    }
                                },
                            });
                        }
                    }, 3000);
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
                        self.order_item_pay_fail_handle(data, order_id, self.$t('paytips.paytips.6y488i'));
                    },
                });
            },
            // 头条小程序非普通交易支付处理
            toutiao_transaction_pay_handle(self, data, order_id) {
                if(!uni.canIUse('requestOrder') || !uni.canIUse('getOrderPayment')) {
                    app.globalData.showToast(self.$t('payment.payment.4dszme'));
                    return false;
                }
                uni.requestOrder({
                    data: data.data.data,
                    byteAuthorization: data.data.auth,
                    success: (res) => {
                        uni.getOrderPayment({
                            orderId: res.orderId,
                            success: (res) => {
                                // 数据设置
                                self.order_item_pay_success_handle(data, order_id);
                            },
                            fail: (res) => {
                                self.order_item_pay_fail_handle(data, order_id, self.$t('paytips.paytips.6y488i'));
                            }
                        });
                    },
                    fail: (res) => {
                        app.globalData.showToast(res.errMsg+'('+res.errNo+')');
                    }
                });
            },
            // 小程序: 微信、支付宝、百度、头条、QQ
            mp_pay_handle(self, data, order_id) {
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
                            self.order_item_pay_fail_handle(data, order_id, res.memo || self.$t('paytips.paytips.6y488i'));
                            return false;
                        }
                        // #endif
                        // #ifdef MP-TOUTIAO
                        if (res.code != 0) {
                            self.order_item_pay_fail_handle(data, order_id, self.$t('paytips.paytips.6y488i'));
                            return false;
                        }
                        // #endif
                        // 数据设置
                        self.order_item_pay_success_handle(data, order_id);
                    },
                    fail: (res) => {
                        self.order_item_pay_fail_handle(data, order_id, self.$t('paytips.paytips.6y488i'));
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
                                msg: self.$t('payment.payment.k2i010'),
                                is_show_cancel: 0,
                            });
                            // 支付接口调用成功，但是不知道是否支付成功，所以需要重新获取列表数据
                            self.$emit('reset-event');
                        },
                        fail: function (res) {
                            self.order_item_pay_fail_handle(data, order_id, self.$t('paytips.paytips.6y488i'));
                        },
                    });
                } else {
                    self.mp_pay_handle(self, data, order_id);
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
                        self.setData({
                            popup_view_pay_data: data.data,
                            popup_view_pay_qrcode_is_show: true,
                        });
                        if (self.propQrcodeUrl) {
                            // 定时校验支付状态
                            var timer = setInterval(function () {
                                uni.request({
                                    url: self.propQrcodeUrl,
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
                                        self.order_item_pay_fail_handle(data, order_id, self.$t('common.internet_error_tips'));
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
                        app.globalData.showToast(data.payment.name + self.$t('payment.payment.2rw3qh'));
                    }
                }
            },

            // 支付成功数据设置 data:后台返回的参数， order_id: 订单id，is_to_page，是否需要跳转页面的参数控制
            order_item_pay_success_handle(data, order_id, is_to_page = true) {
                let back_data = {
                    data: data,
                    order_id: order_id,
                    is_to_page: is_to_page,
                };
                this.$emit('pay-success', back_data, this.propTempPayIndex, Number(this.propPaymentId) === 0 ? this.propDefaultPaymentId : Number(this.propPaymentId));
                if (is_to_page) {
                    this.to_success_page_event();
                }
            },
            // 支付失败数据设置 data:后台返回的参数， order_id: 订单id, msg: 错误提示信息
            order_item_pay_fail_handle(data, order_id, msg) {
                let back_data = {
                    data: data,
                    order_id: order_id,
                    temp_pay_index: this.propTempPayIndex,
                    payment_id: this.payment_id,
                };
                this.$emit('pay-fail', back_data);
                this.to_fail_page_event(msg);
            },
            // 成功跳转
            to_success_page_event() {
                if (this.propToPage) {
                    // 跳转支付页面
                    app.globalData.url_open(this.propToPage, true);
                } else {
                    let url_data = {
                        code: '9000',
                    };
                    url_data = Object.assign({}, url_data, this.propToPageBack);
                    if (this.propIsRedirectTo) {
                        // 跳转支付页面
                        app.globalData.url_open('/pages/paytips/paytips?params=' + encodeURIComponent(base64.encode(JSON.stringify(url_data))), true);
                    } else {
                        // 跳转支付页面
                        app.globalData.url_open('/pages/paytips/paytips?params=' + encodeURIComponent(base64.encode(JSON.stringify(url_data))));
                    }
                }
            },
            // 失败跳转
            to_fail_page_event(msg) {
                let to_fail_page = this.propToFailPage || null;
                if (to_fail_page != null) {
                    let join = (to_fail_page.indexOf('?') == -1) ? '?' : '&';
                    to_fail_page += join+'msg='+msg;
                    if (this.propIsFailAlert) {
                        // 现金支付
                        uni.showModal({
                            content: msg,
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    // 跳转支付页面
                                    app.globalData.url_open(to_fail_page, true);
                                }
                            },
                        });
                    } else {
                        // 跳转支付页面
                        app.globalData.url_open(to_fail_page, true);
                    }
                } else {
                    if (msg) {
                        app.globalData.showToast(msg);
                    }
                }
            },
            to_other(order_id) {
                if (this.propToAppointPage) {
                    // 跳转订单列表页
                    app.globalData.url_open(this.propToAppointPage, true);
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
                this.to_other();
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
    .payment-list .icon {
        width: 50rpx;
        height: 50rpx !important;
    }
    .payment-sub {
        padding: 86rpx 90rpx 24rpx 90rpx;
    }
</style>