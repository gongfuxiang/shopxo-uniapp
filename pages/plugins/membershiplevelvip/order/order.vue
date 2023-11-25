<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc cr-grey ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>
        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time }}</text>
                        <text class="fr cr-main">{{ item.status_name }}</text>
                    </view>
                    <view class="content margin-top">
                        <navigator :url="'/pages/plugins/membershiplevelvip/order-detail/order-detail?id=' + item.id" hover-class="none">
                            <block v-for="(fv, fi) in content_list" :key="fi">
                                <view class="single-text margin-top-xs">
                                    <text class="cr-grey margin-right-xl">{{ fv.name }}</text>
                                    <text class="cr-base">{{ item[fv.field] }}</text>
                                    <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                                    <text v-if="(item[fv.unit_field] || null) != null" class="cr-grey">{{ item[fv.unit_field] }}</text>
                                </view>
                            </block>
                        </navigator>
                    </view>
                    <view v-if="item.status == 0 || item.status == 2 || item.status == 3" class="item-operation tr br-t padding-top-main margin-top-main">
                        <button v-if="item.status == 0" class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-price="item.price" :data-index="index" :data-payment="item.payment_id" hover-class="none">支付</button>
                        <button v-if="item.status == 0" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">取消</button>
                        <button v-if="item.status == 2 || item.status == 3" class="round bg-white cr-red br-red" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">删除</button>
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
        <component-payment
            :prop-pay-url="pay_url"
            :prop-qrcode-url="qrcode_url"
            prop-pay-data-key="id"
            :prop-payment-list="payment_list"
            :prop-temp-pay-value="temp_pay_value"
            :prop-temp-pay-index="temp_pay_index"
            :prop-payment-id="payment_id"
            :prop-default-payment-id="default_payment_id"
            :prop-pay-price="pay_price"
            :prop-is-show-payment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
            :prop-nav-status-index="nav_status_index"
            @reset-event="reset_event"
        ></component-payment>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';
    import componentBottomLine from '../../../../components/bottom-line/bottom-line';
    import componentPayment from '@/components/payment/payment';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                // 支付弹窗参数
                pay_url: '',
                qrcode_url: '',
                payment_list: [],
                temp_pay_value: '',
                temp_pay_index: 0,
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
                pay_price: 0,
                nav_status_list: [
                    {
                        name: '全部',
                        value: '-1',
                    },
                    {
                        name: '待支付',
                        value: '0',
                    },
                    {
                        name: '已支付',
                        value: '1',
                    },
                    {
                        name: '已取消',
                        value: '2',
                    },
                    {
                        name: '已关闭',
                        value: '3',
                    },
                ],
                nav_status_index: 0,
                content_list: [
                    {
                        name: '开通单号',
                        field: 'payment_user_order_no',
                    },
                    {
                        name: '开通时长',
                        field: 'period_value',
                        unit_field: 'period_unit',
                    },
                    {
                        name: '订单金额',
                        field: 'price',
                        unit: '元',
                    },
                    {
                        name: '支付金额',
                        field: 'pay_price',
                        unit: '元',
                    },
                ],
            };
        },
        components: {
            componentPayment,
            componentNoData,
            componentBottomLine,
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
                nav_status_index: nav_status_index,
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
                data_page: 1,
            });
            this.get_data_list(1);
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    } else {
                        this.setData({
                            pay_url: app.globalData.get_request_url('pay', 'buy', 'membershiplevelvip'),
                            qrcode_url: app.globalData.get_request_url('paycheck', 'buy', 'membershiplevelvip'),
                        });
                        // 获取数据
                        this.get_data_list();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
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
                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });
                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });
                // 参数
                var order_status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value'];
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'order', 'membershiplevelvip'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        status: order_status,
                        is_more: 1,
                    },
                    dataType: 'json',
                    success: (res) => {
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
                                this.setData({
                                    payment_list: res.data.data.payment_list || [],
                                    default_payment_id: res.data.data.default_payment_id || 0,
                                    data_list: temp_data_list,
                                    data_total: res.data.data.total,
                                    data_page_total: res.data.data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_list: [],
                                    data_bottom_line_status: false,
                                    data_is_loading: 0,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
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
                            data_is_loading: 0,
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
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
                    temp_pay_index: e.currentTarget.dataset.index,
                    pay_price: e.currentTarget.dataset.price,
                    payment_id: e.currentTarget.dataset.payment || '',
                });
            },
            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false,
                });
            },
            // 重置列表数据
            reset_event() {
                this.get_data_list();
            },
            // 支付成功数据设置
            order_item_pay_success_handle(data, index) {
                // 数据设置
                var temp_data_list = this.data_list;
                temp_data_list[index]['pay_price'] = temp_data_list[index]['price'];
                temp_data_list[index]['status'] = 1;
                temp_data_list[index]['status_name'] = '已支付';
                this.setData({
                    data_list: temp_data_list,
                });
            },
            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '取消后不可恢复，确定继续吗?',
                    confirmText: '确认',
                    cancelText: '不了',
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            // 加载loding
                            uni.showLoading({
                                title: '处理中...',
                            });
                            uni.request({
                                url: app.globalData.get_request_url('cancel', 'order', 'membershiplevelvip'),
                                method: 'POST',
                                data: {
                                    id: id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]['status'] = 2;
                                        temp_data_list[index]['status_name'] = '已取消';
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast('网络开小差了哦~');
                                },
                            });
                        }
                    },
                });
            },
            // 删除
            delete_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '删除后不可恢复，确定继续吗?',
                    confirmText: '确认',
                    cancelText: '不了',
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            // 加载loding
                            uni.showLoading({
                                title: '处理中...',
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'order', 'membershiplevelvip'),
                                method: 'POST',
                                data: {
                                    id: id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        if (temp_data_list.length == 0) {
                                            this.setData({
                                                data_list_loding_status: 0,
                                                data_bottom_line_status: false,
                                            });
                                        }
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast('网络开小差了哦~');
                                },
                            });
                        }
                    },
                });
            },
            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                });
                this.get_data_list(1);
            },
        },
    };
</script>
<style>
    @import './order.css';
</style>
