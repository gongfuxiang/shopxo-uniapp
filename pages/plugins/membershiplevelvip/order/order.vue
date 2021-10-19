<template>
    <view>
        <!-- 导航 -->
        <view class="nav bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc cr-gray ' + (nav_status_index == index ? 'cr-main' : '')" :data-index="index" @tap="nav_event">{{item.name}}</view>
            </block>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{item.add_time_time}}</text>
                        <text class="fr cr-main">{{item.status_name}}</text>
                    </view>
                    <view class="content margin-top">
                        <navigator :url="'/pages/plugins/membershiplevelvip/order-detail/order-detail?id=' + item.id" hover-class="none">
                            <block v-for="(fv,fi) in content_list">
                                <view class="single-text margin-top-xs">
                                    <text class="cr-gray margin-right-xl">{{fv.name}}</text>
                                    <text class="cr-base">{{item[fv.field]}}</text>
                                    <text v-if="(fv.unit || null) != null" class="cr-gray">{{fv.unit}}</text>
                                </view>
                            </block>
                        </navigator>
                    </view>
                    <view v-if="item.status == 0 || item.status == 2 || item.status == 3" class="operation tr br-t padding-top-main margin-top-main">
                        <button v-if="item.status == 0" class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-index="index" hover-class="none">支付</button>
                        <button v-if="item.status == 0" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">取消</button>
                        <button v-if="item.status == 2 || item.status == 3" class="round bg-white cr-red br-red" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">删除</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :prop-status="data_list_loding_status"></component-no-data>
            </view>
                    
            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

        <!-- 支付方式 popup -->
        <component-popup :prop-show="is_show_payment_popup" prop-position="bottom" @onclose="payment_popup_event_close">
            <view v-if="payment_list.length > 0" class="payment-list oh bg-base padding-vertical-main">
                <view v-for="(item, index) in payment_list" :key="index" class="item tc fl">
                    <view class="item-content bg-white border-radius-main margin-main" :data-value="item.id" @tap="popup_payment_event">
                        <image v-if="(item.logo || null) != null" class="icon va-m margin-right-sm" :src="item.logo" mode="widthFix"></image>
                        <text class="va-m">{{item.name}}</text>
                    </view>
                </view>
            </view>
            <view v-else class="payment-list oh bg-white tc cr-gray">没有支付方式</view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
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
                    { name: "已取消", value: "2" },
                    { name: "已关闭", value: "3" },
                ],
                nav_status_index: 0,
                content_list: [
                    {name: "开通单号", field: "payment_user_order_no"},
                    {name: "开通时长", field: "period_unit"},
                    {name: "充值金额", field: "price", unit: "元"},
                    {name: "支付金额", field: "pay_price", unit: "元"},
                    {name: "结算状态", field: "settlement_status_name"}
                ]
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

        onShow() {},

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
                        return false;
                    }
                }
                
                // 加载loding
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                }); 
                
                // 参数
                var order_status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value']; // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "order", "membershiplevelvip"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        status: order_status,
                        is_more: 1
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();

                        if (res.data.code == 0) {
                            if (res.data.data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = res.data.data.data;
                                    
                                    // 下订单支付处理
                                    if (this.load_status == 0) {
                                        if ((this.params.is_pay || 0) == 1 && (this.params.order_id || 0) != 0) {
                                            for (var i in temp_data_list) {
                                                if (this.params.order_id == temp_data_list[i]['id']) {
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
                                    var temp_data_list = this.data_list;
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
                        app.globalData.showToast("服务器请求出错");
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
            pay_handle(order_id, index) {
                var self = this;
                uni.showLoading({
                    title: "请求中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("pay", "buy", "membershiplevelvip"),
                    method: "POST",
                    data: {
                        id: order_id,
                        payment_id: this.payment_id
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var data = res.data.data.data;
                            uni.requestPayment({
                                timeStamp: data.timeStamp,
                                nonceStr: data.nonceStr,
                                package: data.package,
                                signType: data.signType,
                                paySign: data.paySign,
                                success: function(res) {
                                    // 数据设置
                                    self.order_item_pay_success_handle(index);
                                    
                                    // 跳转支付页面
                                    uni.navigateTo({
                                        url: "/pages/paytips/paytips?code=9000&total_price=" + self.data_list[index]['price']
                                    });
                                },
                                fail: function(res) {
                                    app.globalData.showToast('支付失败');
                                }
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 支付成功数据设置
            order_item_pay_success_handle(index) {
                // 数据设置
                var temp_data_list = this.data_list;
                temp_data_list[index]['status'] = 1;
                temp_data_list[index]['status_name'] = '已支付';
                this.setData({
                    data_list: temp_data_list
                });
            },

            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: "温馨提示",
                    content: "取消后不可恢复，确定继续吗?",
                    confirmText: "确认",
                    cancelText: "不了",
                    success: result => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            
                            // 加载loding
                            uni.showLoading({
                                title: "处理中..."
                            });
                            uni.request({
                                url: app.globalData.get_request_url("cancel", "order", "membershiplevelvip"),
                                method: "POST",
                                data: {
                                    id: id
                                },
                                dataType: "json",
                                success: res => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]['status'] = 2;
                                        temp_data_list[index]['status_name'] = '已取消';
                                        this.setData({
                                            data_list: temp_data_list
                                        });
                                        app.globalData.showToast(res.data.msg, "success");
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast("服务器请求出错");
                                }
                            });
                        }
                    }
                });
            },

            // 删除
            delete_event(e) {
                uni.showModal({
                    title: "温馨提示",
                    content: "删除后不可恢复，确定继续吗?",
                    confirmText: "确认",
                    cancelText: "不了",
                    success: result => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            
                            // 加载loding
                            uni.showLoading({
                                title: "处理中..."
                            });
                            uni.request({
                                url: app.globalData.get_request_url("delete", "order", "membershiplevelvip"),
                                method: "POST",
                                data: {
                                    id: id
                                },
                                dataType: "json",
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
                                        app.globalData.showToast(res.data.msg, "success");
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast("服务器请求出错");
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
            }
        }
    };
</script>
<style>
    @import './order.css';
</style>