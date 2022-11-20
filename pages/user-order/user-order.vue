<template>
    <view>
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view v-if="nav_status_index == index" class="item fl tc cr-main" :data-index="index" @tap="nav_event">{{item.name}}</view>
                <view v-else class="item fl tc" :data-index="index" @tap="nav_event">{{item.name}}</view>
            </block>
        </view>

        <!-- 订单列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="30">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="list-item padding-horizontal-main padding-top-main border-radius-main bg-white oh spacing-mb">
                    <view class="item-base oh br-b padding-bottom-main">
                        <!-- 选择 -->
                        <view v-if="nav_status_index == 1 && home_is_enable_order_bulk_pay == 1" @tap="selected_event" :data-oid="item.id" class="fl selected">
                            <image class="icon va-m" :src="common_static_url+'select' + (order_select_ids.indexOf(item.id) != -1 ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
                        </view>
                        <!-- 基础信息 -->
                        <view class="fl cp" @tap="url_event" :data-value="item.warehouse_url || ''">
                            <image v-if="(item.warehouse_icon || null) != null" class="warehouse-group-icon va-m margin-right-sm" :src="item.warehouse_icon" mode="aspectFit"></image>
                            <text class="cr-base va-m">{{item.warehouse_name}}</text>
                        </view>
                        <text class="fr cr-red">{{item.status_name}}<text v-if="(item.is_under_line_text || null) != null">（{{item.is_under_line_text}}）</text></text>
                    </view>
                    <view v-for="(detail, di) in item.items" :key="di" class="br-b-dashed oh padding-vertical-main">
                        <view :data-value="'/pages/user-order-detail/user-order-detail?id=' + item.id" @tap="url_event">
                            <image class="goods-image fl radius" :src="detail.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{detail.title}}</view>
                                <view v-if="detail.spec != null" class="margin-top-sm">
                                    <block v-for="(sv, si) in detail.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-gray">{{sv.value}}</text>
                                    </block>
                                </view>                            
                                <view class="margin-top-sm">
                                    <text class="fw-b">{{item.currency_data.currency_symbol}}{{detail.price}}</text>
                                    <text class="margin-left-sm">x{{detail.buy_number}}</text>
                                </view>
                                <view v-if="item.is_can_launch_aftersale == 1 && (detail.orderaftersale_btn_text || null) != null" class="orderaftersale-btn-text cr-blue pa bg-white" @tap.stop="orderaftersale_event" :data-oid="item.id" :data-did="detail.id">{{detail.orderaftersale_btn_text}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="padding-vertical-main tr cr-base text-size">
                        <text>共<text class="fw-b">{{item.buy_number_count}}</text>件 合计 <text class="sales-price margin-right-xs">{{item.currency_data.currency_symbol}}{{item.total_price}}</text>元</text>
                    </view>
                    <view v-if="item.operate_data.is_cancel + item.operate_data.is_pay + item.operate_data.is_collect + item.operate_data.is_comments + item.operate_data.is_delete+(item.plugins_is_order_allot_button || 0)+(item.plugins_is_order_batch_button || 0)+(item.plugins_is_order_frequencycard_button || 0) > 0 || (item.status == 2 && item.order_model != 2) || ((item.plugins_express_data || 0) == 1 && (item.express_number || null) != null)" class="item-operation tr br-t padding-vertical-main">
                        <button v-if="item.operate_data.is_cancel == 1" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">取消</button>
                        <button v-if="item.operate_data.is_pay == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-index="index" hover-class="none">支付</button>
                        <button v-if="item.operate_data.is_collect == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="collect_event" :data-value="item.id" :data-index="index" hover-class="none">收货</button>
                        <button v-if="(item.plugins_express_data || 0) == 1 && (item.express_number || null) != null" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/express/detail/detail?id='+item.id" hover-class="none">物流</button>
                        <button v-if="item.operate_data.is_comments == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="comments_event" :data-value="item.id" :data-index="index" hover-class="none">评论</button>
                        <button v-if="item.status == 2 && item.order_model != 2" class="round cr-base br" type="default" size="mini" @tap="rush_event" :data-value="item.id" :data-index="index" hover-class="none">催催</button>
                        <button v-if="item.operate_data.is_delete == 1" class="round bg-white cr-red br-red" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">删除</button>
                        <button v-if="(item.plugins_is_order_allot_button || 0) == 1" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/orderallot-list/orderallot-list?oid='+item.id" hover-class="none">子单</button>
                        <button v-if="(item.plugins_is_order_batch_button || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/batchorder-list/batchorder-list?oid='+item.id" hover-class="none">批次</button>
                        <button v-if="(item.plugins_is_order_frequencycard_button || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/frequencycard-list/frequencycard-list?oid='+item.id" hover-class="none">次卡</button>
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

        <!-- 合并支付 -->
        <view v-if="nav_status_index == 1 && order_select_ids.length > 0 && home_is_enable_order_bulk_pay == 1">
            <button class="bottom-fixed pay-merge-submit bg-green cr-white round" type="default" size="mini" hover-class="none" @tap="pay_merge_event">合并支付</button>
        </view>
        
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
        
        <!-- 支付html展示 -->
        <component-popup :propShow="popup_view_pay_html_is_show" propPosition="bottom" @onclose="popup_view_pay_html_event_close">
            <view class="popup-pay-html-content padding-top-xxxl padding-bottom-xxxl padding-left-xxxl padding-right-xxxl tc">
                <block v-if="(popup_view_pay_data || null) == null">
                    <text class="cr-gray">无支付信息</text>
                </block>
                <block v-else>
                    <mp-html :content="popup_view_pay_data" />
                </block>
            </view>
        </component-popup>

        <!-- 支付方式 popup -->
        <component-popup :propShow="is_show_payment_popup" propPosition="bottom" @onclose="payment_popup_event_close">
            <view v-if="payment_list.length > 0" class="payment-list oh bg-base padding-main">
                <view class="padding-top-main padding-left-main">
                    <view v-for="(item, index) in payment_list" :key="index" class="item tc fl">
                        <view class="item-content bg-white border-radius-main margin-right-main margin-bottom-main" :data-value="item.id" :data-type="item.payment" @tap="popup_payment_event">
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
    import base64 from '../../common/js/lib/base64.js';
    import componentPopup from "../../components/popup/popup";
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                params: null,
                input_keyword_value: '',
                load_status: 0,
                is_show_payment_popup: false,
                payment_list: [],
                payment_id: 0,
                payment_type: '',
                temp_pay_value: '',
                nav_status_list: [
                    { name: "全部", value: "-1" },
                    { name: "待付款", value: "1" },
                    { name: "待发货", value: "2" },
                    { name: "待收货", value: "3" },
                    { name: "已完成", value: "4" },
                    { name: "已失效", value: "5,6" },
                ],
                nav_status_index: 0,
                order_select_ids: [],
                // 支付信息
                popup_view_pay_html_is_show: false,
                popup_view_pay_qrcode_is_show: false,
                popup_view_pay_data: null,
                popup_view_pay_timer: null,
                // 基础配置
                home_is_enable_order_bulk_pay: 0
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
        },

        onShow() {
            // 数据加载
            this.init();
            
            // 初始化配置
            this.init_config();
            
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
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        home_is_enable_order_bulk_pay: app.globalData.get_config('config.home_is_enable_order_bulk_pay')
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

            // 输入框事件
            input_event(e) {
                this.setData({
                    input_keyword_value: e.detail.value
                });
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
                    url: app.globalData.get_request_url("index", "order"),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        keywords: this.input_keyword_value || "",
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
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = res.data.data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }

                                var temp_load_status = this.load_status;
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: res.data.data.total,
                                    data_page_total: res.data.data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    load_status: 1,
                                    payment_list: res.data.data.payment_list || []
                                });

                                // 下订单支付处理
                                if (temp_load_status == 0) {
                                    var ck = app.globalData.data.cache_page_pay_key;
                                    var pay_data = uni.getStorageSync(ck) || null;
                                    if (pay_data != null) {
                                        uni.removeStorageSync(ck);
                                        this.setData({payment_id: parseInt(pay_data.payment_id || 0)});
                                        this.pay_handle(pay_data.order_ids);
                                    }
                                }

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
                    order_select_ids: []
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
                var payment_type = e.currentTarget.dataset.type || '';
                this.setData({
                    payment_id: payment_id,
                    payment_type: payment_type
                });
                this.payment_popup_event_close();
                this.pay_handle(this.temp_pay_value);
            },

            // 支付方法
            pay_handle(order_ids) {
                // #ifdef H5
                // 微信环境判断是否已有web_openid、不存在则不继续执行跳转到插件进行授权
                if(!app.globalData.is_user_weixin_web_openid(order_ids)) {
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

                // 请求数据
                var post_data = {
                    ids: order_ids,
                    payment_id: this.payment_id
                };

                // h5自定义重定向地址
                // #ifdef H5
                if(payment != null) {
                    post_data['redirect_url'] = encodeURIComponent(base64.encode(app.globalData.get_page_url(false)+(this.nav_status_index > 0 ? '?status='+this.nav_status_index : '')));
                    // paypal支付方式使用respond_url返回地址、移除重定向地址
                    if(payment.payment == 'PayPal') {
                        post_data['respond_url'] = post_data['redirect_url'];
                        delete post_data['redirect_url'];
                    }
                }
                // #endif

                // 请求支付接口
                uni.showLoading({
                    title: "请求中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("pay", "order"),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            // 是否直接支付成功
                            if ((res.data.data.is_success || 0) == 1) {
                                this.order_item_pay_success_handle(order_ids);
                                app.globalData.showToast('支付成功', 'success');
                            } else {
                                // 支付方式类型
                                switch (res.data.data.is_payment_type) {
                                    // 正常线上支付
                                    case 0:
                                        var data = res.data.data;
                                        // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
                                        this.common_pay_handle(this, data, order_ids);
                                        // #endif
                                        // #ifdef MP-KUAISHOU
                                        this.kuaishou_pay_handle(this, data, order_ids);
                                        // #endif
                                        // #ifdef MP-QQ
                                        this.qq_pay_handle(this, data, order_ids);
                                        // #endif
                                        // #ifdef H5
                                        this.h5_pay_handle(this, data, order_ids);
                                        // #endif
                                        break;
                                    // 线下支付
                                    case 1:
                                        var order_ids_arr = order_ids.split(',');
                                        var temp_data_list = this.data_list;
                                        for (var i in temp_data_list) {
                                            if (order_ids_arr.indexOf(temp_data_list[i]['id']) != -1) {
                                                temp_data_list[i]['is_under_line'] = 1;
                                            }
                                        }
                                        this.setData({
                                            data_list: temp_data_list
                                        });
                                        app.globalData.alert({
                                            msg: res.data.msg,
                                            is_show_cancel: 0
                                        });
                                        break;
                                    // 钱包支付
                                    case 2:
                                        this.order_item_pay_success_handle(order_ids);
                                        app.globalData.showToast('支付成功', 'success');
                                        break;
                                    // 默认
                                    default:
                                        app.globalData.showToast('支付类型有误');
                                }
                            }
                        } else {
                            // 是否返回html代码展示、则提示错误
                            if(res.data.code == -6666 && (res.data.data || null) != null) {
                                this.setData({
                                    popup_view_pay_data: res.data.data,
                                    popup_view_pay_html_is_show: true
                                });
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 快手小程序
            kuaishou_pay_handle(self, data, order_ids) {
                uni.pay({
                    orderInfo: data.data,
                    serviceId: '1',
                    success: res => {                
                        // 数据设置
                        self.order_item_pay_success_handle(order_ids);

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
            common_pay_handle(self, data, order_ids) {
                uni.requestPayment({
                    // #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-KUAISHOU
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
                        self.order_item_pay_success_handle(order_ids);

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
            qq_pay_handle(self, data, order_ids) {
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
                    self.common_pay_handle(self, data, order_ids);
                }
            },

            // h5支付处理
            h5_pay_handle(self, data, order_ids) {
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
                                    self.order_item_pay_success_handle(order_ids);
                                    
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
                                url: app.globalData.get_request_url("paycheck", "order"),
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
                                        self.order_item_pay_success_handle(order_ids);
                    
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
            order_item_pay_success_handle(order_ids) {
                var order_ids_arr = order_ids.split(',');
                var temp_data_list = this.data_list;
                
                // 数据设置
                for (var i in temp_data_list) {
                    if (order_ids_arr.indexOf(temp_data_list[i]['id']) != -1) {
                        temp_data_list[i]['operate_data']['is_pay'] = 0;
                        temp_data_list[i]['operate_data']['is_cancel'] = 0;
                        switch (parseInt(temp_data_list[i]['order_model'])) {
                            // 销售模式
                            case 0:
                                temp_data_list[i]['status'] = 2;
                                temp_data_list[i]['status_name'] = '待发货';
                                break;
                            // 自提模式
                            case 2:
                                temp_data_list[i]['status'] = 2;
                                temp_data_list[i]['status_name'] = '待取货';
                                break;
                            // 虚拟模式
                            case 3:
                                temp_data_list[i]['status'] = 3;
                                temp_data_list[i]['status_name'] = '待收货';
                                break;
                        }
                    }
                }
                this.setData({
                    data_list: temp_data_list
                });
            },

            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '取消后不可恢复，确定继续吗?',
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
                                url: app.globalData.get_request_url("cancel", "order"),
                                method: 'POST',
                                data: {
                                    id: id
                                },
                                dataType: 'json',
                                success: res => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]['status'] = 5;
                                        temp_data_list[index]['status_name'] = '已取消';
                                        temp_data_list[index]['operate_data']['is_cancel'] = 0;
                                        temp_data_list[index]['operate_data']['is_pay'] = 0;
                                        temp_data_list[index]['operate_data']['is_delete'] = 1;
                                        temp_data_list[index]['is_can_launch_aftersale'] = 0;
                                        this.setData({
                                            data_list: temp_data_list
                                        });
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

            // 收货
            collect_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '请确认已收到货物或已完成，操作后不可恢复，确定继续吗?',
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
                                url: app.globalData.get_request_url("collect", "order"),
                                method: 'POST',
                                data: {
                                    id: id
                                },
                                dataType: 'json',
                                success: res => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]['status'] = 4;
                                        temp_data_list[index]['status_name'] = '已完成';
                                        temp_data_list[index]['operate_data']['is_collect'] = 0;
                                        temp_data_list[index]['operate_data']['is_comments'] = 1;
                                        temp_data_list[index]['operate_data']['is_delete'] = 1;
                                        this.setData({
                                            data_list: temp_data_list
                                        });
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
                                url: app.globalData.get_request_url("delete", "order"),
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
                                        var len = temp_data_list.length;
                                        this.setData({
                                            data_list: temp_data_list,
                                            data_list_loding_status: (len == 0) ? 0 : 3,
                                            data_bottom_line_status: (len == 0) ? false : this.data_bottom_line_status,
                                        });
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

            // 催催
            rush_event(e) {
                app.globalData.showToast("催促成功", 'success');
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    order_select_ids: []
                });
                
                // 重新拉取数据
                this.get_data_list(1);
            },

            // 售后订单事件
            orderaftersale_event(e) {
                var oid = e.currentTarget.dataset.oid || 0;
                var did = e.currentTarget.dataset.did || 0;
                if (oid == 0 || did == 0) {
                    app.globalData.showToast("参数有误");
                    return false;
                }
                
                // 进入售后页面
                uni.navigateTo({
                    url: "/pages/user-orderaftersale-detail/user-orderaftersale-detail?oid=" + oid + "&did=" + did
                });
            },

            // 订单评论
            comments_event(e) {
                uni.navigateTo({
                    url: "/pages/user-order-comments/user-order-comments?id=" + e.currentTarget.dataset.value
                });
            },

            // 选中处理
            selected_event(e) {
                var oid = e.currentTarget.dataset.oid || 0;
                var temp_select_ids = this.order_select_ids;
                if (temp_select_ids.indexOf(oid) == -1) {
                    temp_select_ids.push(oid);
                } else {
                    for (var i in temp_select_ids) {
                        if (temp_select_ids[i] == oid) {
                            temp_select_ids.splice(i, 1);
                        }
                    }
                }
                this.setData({
                    order_select_ids: temp_select_ids
                });
            },

            // 合并支付
            pay_merge_event(e) {
                this.setData({
                    is_show_payment_popup: true,
                    temp_pay_value: this.order_select_ids.join(',')
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            
            // 支付二维码展示窗口事件
            popup_view_pay_qrcode_event_close(e) {
                this.setData({
                    popup_view_pay_qrcode_is_show: false
                });
                clearInterval(this.popup_view_pay_timer);
            },
            
            // 支付html展示窗口事件
            popup_view_pay_html_event_close(e) {
                this.setData({
                    popup_view_pay_html_is_show: false
                });
            },
            
            // 页面卸载
            onUnload(e) {
                clearInterval(this.popup_view_pay_timer);
            }
        }
    };
</script>
<style>
    @import './user-order.css';
</style>