<template>
    <view>
        <!-- 导航 -->
        <view class="nav-child flex-row align-c margin-bottom-lg">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view class="item dis-inline-block round bg-grey-e margin-right-main tc" :class="'cr-grey ' + (nav_status_index == index ? 'cr-main bg-main-light' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>

        <!-- 列表 -->
        <view v-if="data_list.length > 0" class="data-list">
            <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                    <text class="cr-grey-9">{{ item.add_time_time }}</text>
                    <text :class="item.status == 0 ? 'cr-main' : 'cr-grey-c'">{{ item.status_name }}</text>
                </view>
                <view class="content margin-top">
                    <navigator :url="'/pages/plugins/wallet/user-recharge-detail/user-recharge-detail?id=' + item.id" hover-class="none">
                        <block v-for="(fv, fi) in content_list" :key="fi">
                            <view class="single-text margin-top-sm">
                                <text class="cr-grey-9 margin-right-main">{{ fv.name }}</text>
                                <text class="fw-b">{{ item[fv.field] }}</text>
                                <text v-if="(fv.unit || null) != null" class="fw-b">{{ fv.unit }}</text>
                            </view>
                        </block>
                    </navigator>
                </view>
                <view v-if="item.status == 0" class="item-operation tr margin-top-main">
                    <button class="round bg-white br-grey-9 text-size-md" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">删除</button>
                    <button class="round bg-white cr-main br-main text-size-md" type="default" size="mini" @tap="pay_event" :data-price="item.money" :data-value="item.id" :data-index="index" :data-payment="item.payment_id" hover-class="none">去支付</button>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

        <!-- 支付弹窗 -->
        <component-payment
            :prop-pay-url="pay_url"
            :prop-qrcode-url="qrcode_url"
            prop-pay-data-key="recharge_id"
            :prop-payment-list="payment_list"
            :prop-temp-pay-value="temp_pay_value"
            :prop-temp-pay-index="temp_pay_index"
            :prop-pay-price="pay_price"
            :prop-is-show-payment="is_show_payment_popup"
            @close-payment-poupon="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
        ></component-payment>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';

    import componentPayment from '@/components/payment/payment';

    export default {
        props: {
            propPullDownRefresh: {
                type: Boolean,
                default: false,
            },
            propScrollLower: {
                type: Boolean,
                default: false,
            },
            propCurrent: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                payment_id: 0,
                nav_status_list: [
                    { name: '全部', value: '-1' },
                    { name: '待支付', value: '0' },
                    { name: '已支付', value: '1' },
                ],
                nav_status_index: 0,
                content_list: [
                    { name: '充值单号', field: 'recharge_no' },
                    { name: '充值金额', field: 'money', unit: '元' },
                    { name: '支付金额', field: 'pay_money', unit: '元' },
                ],

                // 支付弹窗参数
                pay_url: app.globalData.get_request_url('pay', 'recharge', 'wallet'),
                qrcode_url: app.globalData.get_request_url('paycheck', 'recharge', 'wallet'),
                payment_list: [],
                temp_pay_value: '',
                temp_pay_index: 0,
                payment_id: 0,
                is_show_payment_popup: false,
                pay_price: 0,
            };
        },

        components: {
            componentPopup,
            componentNoData,
            componentBottomLine,
            componentPayment,
        },

        created() {
            this.init();
        },

        mounted() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },
        watch: {
            propPullDownRefresh(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        data_page: 1,
                    });
                    this.get_data_list(1);
                }
            },
            propScrollLower(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.get_data_list();
                }
            },
            propCurrent(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        nav_status_index: newVal,
                    });
                }
            },
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    } else {
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
                    url: app.globalData.get_request_url('index', 'recharge', 'wallet'),
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
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 支付
            pay_event(e) {
                this.setData({
                    is_show_payment_popup: true,
                    temp_pay_value: e.currentTarget.dataset.value,
                    temp_pay_index: e.currentTarget.dataset.index,
                    pay_price: e.currentTarget.dataset.price,
                    payment_id: e.currentTarget.dataset.payment,
                });
            },

            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false,
                });
            },
            // 支付成功数据设置
            order_item_pay_success_handle(data, index) {
                // 数据设置
                var temp_data_list = this.data_list;
                temp_data_list[index]['pay_money'] = temp_data_list[index]['money'];
                temp_data_list[index]['status'] = 1;
                temp_data_list[index]['status_name'] = '已支付';
                this.setData({
                    data_list: temp_data_list,
                });
                this.$emit('pay-success');
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
                                url: app.globalData.get_request_url('delete', 'recharge', 'wallet'),
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
                                    app.globalData.showToast('服务器请求出错');
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

            // 页面卸载
            onUnload(e) {
                clearInterval(this.popup_view_pay_timer);
            },
        },
    };
</script>
<style scoped>
    .nav-child .item {
        height: 60rpx;
        line-height: 60rpx;
        padding: 0 30rpx;
        min-width: 84rpx;
    }
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
