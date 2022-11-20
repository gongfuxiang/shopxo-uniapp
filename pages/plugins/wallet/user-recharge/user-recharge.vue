<template>
    <view>
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc cr-gray ' + (nav_status_index == index ? 'cr-main' : '')" :data-index="index" @tap="nav_event">{{item.name}}</view>
            </block>
        </view>
        
        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="30">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{item.add_time_time}}</text>
                        <text class="fr cr-main">{{item.status_name}}</text>
                    </view>
                    <view class="content margin-top">
                        <navigator :url="'/pages/plugins/wallet/user-recharge-detail/user-recharge-detail?id=' + item.id" hover-class="none">
                            <block v-for="(fv,fi) in content_list">
                                <view class="single-text margin-top-xs">
                                    <text class="cr-gray margin-right-xl">{{fv.name}}</text>
                                    <text class="cr-base">{{item[fv.field]}}</text>
                                    <text v-if="(fv.unit || null) != null" class="cr-gray">{{fv.unit}}</text>
                                </view>
                            </block>
                        </navigator>
                    </view>
                    <view v-if="item.status == 0" class="item-operation tr br-t padding-top-main margin-top-main">
                        <button class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-index="index" hover-class="none">支付</button>
                        <button class="round bg-white cr-red br-red" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">删除</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>
        
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>
        
        <!-- 支付二维码展示 -->
        <component-popup :propShow="popup_view_pay_qrcode_is_show" propPosition="bottom" @onclose="popup_view_pay_qrcode_event_close">
            <view class="padding-top-xxxl padding-bottom-xxxl padding-left-xxxl padding-right-xxxl tc">
                <block v-if="(popup_view_pay_data || null) == null || (popup_view_pay_data.qrcode_url || null) == null || (popup_view_pay_data.name || null) == null || (popup_view_pay_data.check_url || null) == null || (popup_view_pay_data.order_no || null) == null">
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
            <view v-if="payment_list.length > 0" class="payment-list oh bg-base padding-main">
                <view class="padding-top-main padding-left-main">
                    <view v-for="(item, index) in payment_list" :key="index" class="item tc fl">
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
    import base64 from '../../../../common/js/lib/base64.js';
    import componentPopup from "../../../../components/popup/popup";
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                params: null,
                load_status: 0,
                is_show_payment_popup: false,
                payment_list: [],
                payment_id: 0,
                temp_pay_value: 0,
                temp_pay_index: 0,
                nav_status_list: [
                    { name: "全部", value: "-1" },
                    { name: "待支付", value: "0" },
                    { name: "已支付", value: "1" },
                ],
                nav_status_index: 0,
                content_list: [
                    {name: "充值单号", field: "recharge_no"},
                    {name: "充值金额", field: "money", unit: "元"},
                    {name: "支付金额", field: "pay_money", unit: "元"}
                ],
                // 支付信息
                popup_view_pay_qrcode_is_show: false,
                popup_view_pay_data: null,
                popup_view_pay_timer: null
            };
        },

        components: {
            componentPopup,
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            // 是否指定状态
            var nav_status_index = 0;
            if ((params.status || null) != null) {
                for (var i in this.nav_status_list) {
                    if (this.nav_status_list[i]['value'] == params.status) {
                        nav_status_index = i;
                        break;
                    }
                }
            }
            this.setData({
                params: params,
                nav_status_index: nav_status_index
            });
            this.init();
        },

        onShow() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data_list();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false
                    });
                }
            },

            // 获取数据
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                
                // 加载loding
                uni.showLoading({
                    title: '加载中...'
                });
                this.setData({
                    data_list_loding_status: 1
                });
                
                // 参数
                var order_status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value'];
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "recharge", "wallet"),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        status: order_status,
                        is_more: 1
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = res.data.data.data;
                                    // 下订单支付处理
                                    if (this.load_status == 0) {
                                        var ck = app.globalData.data.cache_page_pay_key;
                                        var recharge_id = uni.getStorageSync(ck) || null;
                                        if (recharge_id != null) {
                                            uni.removeStorageSync(ck);
                                            for (var i in temp_data_list) {
                                                if (recharge_id == temp_data_list[i]['id']) {
                                                    this.setData({
                                                        is_show_payment_popup: true,
                                                        temp_pay_value: temp_data_list[i]['id'],
                                                        temp_pay_index: i
                                                    });
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = res.data.data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }

                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: res.data.data.total,
                                    data_page_total: res.data.data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    load_status: 1,
                                    payment_list: res.data.data.payment_list || []
                                });
                                
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    load_status: 1,
                                    data_list: [],
                                    data_bottom_line_status: false
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                load_status: 1
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            load_status: 1
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 支付
            pay_event(e) {
                this.setData({
                    is_show_payment_popup: true,
                    temp_pay_value: e.currentTarget.dataset.value,
                    temp_pay_index: e.currentTarget.dataset.index
                });
            },

            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false
                });
            },

            // 支付弹窗发起支付
            popup_payment_event(e) {
                var payment_id = e.currentTarget.dataset.value || 0;
                this.setData({
                    payment_id: payment_id
                });
                this.payment_popup_event_close();
                this.pay_handle(this.temp_pay_value, this.temp_pay_index);
            },

            // 支付方法
            pay_handle(recharge_id, index) {
                // #ifdef H5
                // 微信环境判断是否已有web_openid、不存在则不继续执行跳转到插件进行授权
                if(!app.globalData.is_user_weixin_web_openid(recharge_id)) {
                    return false;
                }
                // #endif

                // 支付方式
                var payment = null;
                for(var i in this.payment_list) {
                    if(this.payment_list[i]['id'] == this.payment_id) {
                        payment = this.payment_list[i];
                    }
                }
                if(payment == null) {
                    app.globalData.showToast('支付方式有误');
                    return false;
                }

                // 请求数据
                var post_data = {
                    recharge_id: recharge_id,
                    payment_id: this.payment_id
                };

                // h5自定义重定向地址
                // #ifdef H5
                post_data['redirect_url'] = encodeURIComponent(base64.encode(app.globalData.get_page_url(false)+(this.nav_status_index > 0 ? '?status='+this.nav_status_index : '')));
                // paypal支付方式使用respond_url返回地址、移除重定向地址
                if(payment.payment == 'PayPal') {
                    post_data['respond_url'] = post_data['redirect_url'];
                    delete post_data['redirect_url'];
                }
                // #endif

                // 请求支付接口
                uni.showLoading({
                    title: "请求中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("pay", "recharge", "wallet"),
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
                        self.order_item_pay_success_handle(index);
            
                        // 跳转支付页面
                        uni.navigateTo({
                            url: "/pages/paytips/paytips?code=9000"
                        });
                    },
                    fail: res => {
                        app.globalData.showToast('支付失败');
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
                        self.order_item_pay_success_handle(index);
                    
                        // 跳转支付页面
                        uni.navigateTo({
                            url: "/pages/paytips/paytips?code=9000"
                        });
                    },
                    fail: res => {
                        app.globalData.showToast('支付失败');
                    }
                });
            },
            
            // QQ支付处理
            qq_pay_handle(self, data, index) {
                // 是否微信支付
                if(data.payment.payment == 'Weixin') {
                    uni.requestWxPayment({
                        url: data.data,
                        referer: app.globalData.data.request_url,
                        success: function(res) {
                            app.globalData.alert({msg: '支付成功后、请不要重复支付、如果订单状态未成功请联系客服处理', is_show_cancel: 0});
                            self.get_data_list();
                        },
                        fail: function (res) {
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
                if(typeof data.data == 'string') {
                    window.location.href = data.data;
                } else {
                    var status = false;
                    // 微信jsapi
                    if(data.payment.payment == 'Weixin' && (data.data.appId || null) != null && (data.data.timeStamp || null) != null && (data.data.nonceStr || null) != null && (data.data.package || null) != null && (data.data.signType || null) != null && (data.data.paySign || null) != null) {
                        status = true;
                        function onBridgeReady() {
                            WeixinJSBridge.invoke("getBrandWCPayRequest", {
                                appId: data.data.appId,
                                timeStamp: data.data.timeStamp,
                                nonceStr: data.data.nonceStr,
                                package: data.data.package,
                                signType: data.data.signType,
                                paySign: data.data.paySign
                            },
                            function(res) {
                                if(res.err_msg == "get_brand_wcpay_request:ok") {
                                    // 数据设置
                                    self.order_item_pay_success_handle(index);
                                    
                                    // 跳转支付页面
                                    uni.navigateTo({
                                        url: "/pages/paytips/paytips?code=9000"
                                    });
                                }
                            });
                        }
                        if(typeof WeixinJSBridge == "undefined") {
                            if(document.addEventListener) {
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
                    if((data.data.qrcode_url || null) != null && (data.data.name || null) != null && (data.data.check_url || null) != null && (data.data.order_no || null) != null) {
                        status = true;
                        // 显示支付窗口
                        this.setData({
                            popup_view_pay_data: data.data,
                            popup_view_pay_qrcode_is_show: true
                        });
                        // 定时校验支付状态
                        var timer = setInterval(function() {
                            uni.request({
                                url: app.globalData.get_request_url("paycheck", "recharge", "wallet"),
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
                                        self.order_item_pay_success_handle(index);
                                    
                                        // 跳转支付页面
                                        uni.navigateTo({
                                            url: "/pages/paytips/paytips?code=9000"
                                        });
                                    } else {
                                        // -300支付中、其它状态则提示错误
                                        if(res.data.code != -300) {
                                            clearInterval(self.popup_view_pay_timer);
                                            app.globalData.showToast(res.data.msg);
                                        }
                                    }
                                },
                                fail: () => {
                                    clearInterval(self.popup_view_pay_timer);
                                    app.globalData.showToast('服务器请求出错');
                                }
                            });
                        }, 3000);
                        self.setData({
                            popup_view_pay_timer: timer
                        });
                    }

                    // 返回html表单
                    if((data.data.html || null) != null) {
                        status = true;
                        var div = document.createElement('paydivform');
                        div.innerHTML= data.data.html;
                        document.body.appendChild(div);
                        var fm = document.forms;
                        if(fm.length > 0) {
                            fm[0].submit();
                        }
                    }

                    // 未匹配到的支付处理方式
                    if(!status) {
                        app.globalData.showToast(data.payment.name+'支付方式还未适配');
                    }
                }
            },

            // 支付成功数据设置
            order_item_pay_success_handle(index) {
                // 数据设置
                var temp_data_list = this.data_list;
                temp_data_list[index]['pay_money'] = temp_data_list[index]['money'];
                temp_data_list[index]['status'] = 1;
                temp_data_list[index]['status_name'] = '已支付';
                this.setData({
                    data_list: temp_data_list
                });
            },

            // 删除
            delete_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '删除后不可恢复，确定继续吗?',
                    confirmText: '确认',
                    cancelText: '不了',
                    success: result => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            
                            // 加载loding
                            uni.showLoading({
                                title: '处理中...'
                            });
                            uni.request({
                                url: app.globalData.get_request_url("delete", "recharge", "wallet"),
                                method: 'POST',
                                data: {
                                    id: id
                                },
                                dataType: 'json',
                                success: res => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data_list
                                        });
                                        if (temp_data_list.length == 0) {
                                            this.setData({
                                                data_list_loding_status: 0,
                                                data_bottom_line_status: false
                                            });
                                        }
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast('服务器请求出错');
                                }
                            });
                        }
                    }
                });
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1
                });
                this.get_data_list(1);
            },

            // 支付二维码展示窗口事件
            popup_view_pay_qrcode_event_close(e) {
                this.setData({
                    popup_view_pay_qrcode_is_show: false
                });
                clearInterval(this.popup_view_pay_timer);
            },
            
            // 页面卸载
            onUnload(e) {
                clearInterval(this.popup_view_pay_timer);
            }
        }
    };
</script>
<style>
    @import './user-recharge.css';
</style>