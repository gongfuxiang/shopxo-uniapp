<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-child flex-row align-c margin-bottom-lg">
            <view v-for="(item, index) in nav_status_list" :key="index">
                <view class="item dis-inline-block round margin-right-main tc" :class="nav_status_index == index ? 'cr-main bg-main-light' : 'cr-grey bg-grey-e'" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </view>
        </view>

        <!-- 列表 -->
        <view v-if="data_list.length > 0" class="data-list">
            <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                    <text class="cr-grey-9">{{ item.add_time }}</text>
                    <text :class="item.status == 0 ? 'cr-main' : 'cr-grey-c'">{{ item.status_name }}</text>
                </view>
                <view :data-value="'/pages/plugins/wallet/user-recharge-detail/user-recharge-detail?id=' + item.id" @tap="url_event" class="content margin-top cp">
                    <view v-for="(fv, fi) in content_list" :key="fi">
                        <view class="single-text margin-top-sm recharge-item">
                            <text class="name cr-grey-9 margin-right-main">{{ fv.name }}:</text>
                            <text class="fw-b">{{ item[fv.field] }}</text>
                            <text v-if="(fv.unit || null) != null" class="fw-b">{{ fv.unit }}</text>
                        </view>
                    </view>
                </view>
                <view v-if="item.status == 0" class="item-operation tr margin-top-main">
                    <button class="round bg-white br-grey-9 text-size-md" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.del')}}</button>
                    <button class="round bg-white cr-main br-main text-size-md" type="default" size="mini" @tap="pay_event" :data-price="item.money" :data-value="item.id" :data-index="index" :data-payment="item.payment_id" hover-class="none">{{$t('user-recharge.user-recharge.8y9dki')}}</button>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" propLoadingLogoTop="85%"></component-no-data>
        </view>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

        <!-- 支付弹窗 -->
        <component-payment
            ref="payment"
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            propPayDataKey="recharge_id"
            :propPaymentList="payment_list"
            :propTempPayValue="temp_pay_value"
            :propTempPayIndex="temp_pay_index"
            :propPayPrice="pay_price"
            :propPaymentId="payment_id"
            :propToAppointPage="to_appoint_page"
            :propDefaultPaymentId="default_payment_id"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
        ></component-payment>
    </view>
</template>
<script>
    const app = getApp();
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
                theme_view: app.globalData.get_theme_value_view(),
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                nav_status_list: [
                    { name: this.$t('common.all'), value: '-1' },
                    { name: this.$t('order.order.pjb15r'), value: '0' },
                    { name: this.$t('order.order.s8g966'), value: '1' },
                ],
                nav_status_index: 0,
                content_list: [
                    { name: this.$t('user-recharge-detail.user-recharge-detail.ch84a8'), field: 'recharge_no' },
                    { name: this.$t('user-recharge-detail.user-recharge-detail.7272ia'), field: 'money' },
                    { name: this.$t('user-order-detail.user-order-detail.516tlr'), field: 'pay_money' },
                ],

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
                to_appoint_page: '/pages/plugins/wallet/user/user?type=wallet',
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
                    this.setData({
                        pay_url: app.globalData.get_request_url('pay', 'recharge', 'wallet'),
                        qrcode_url: app.globalData.get_request_url('paycheck', 'recharge', 'wallet'),
                    });
                    // 获取数据
                    this.get_data_list();
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
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

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
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }

                                this.setData({
                                    payment_list: data.payment_list || [],
                                    default_payment_id: data.default_payment_id || 0,
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });

                                // 下订单支付处理
                                var key = app.globalData.data.cache_page_pay_key;
                                var pay_data = uni.getStorageSync(key) || null;
                                if (pay_data != null && (pay_data.order_ids || null) != null && (pay_data.payment_id || null) != null) {
                                    uni.removeStorageSync(key);
                                    this.setData({
                                        temp_pay_value: pay_data.order_ids,
                                        payment_id: pay_data.payment_id,
                                    });
                                    if ((this.$refs.payment || null) != null) {
                                        this.$refs.payment.pay_handle(pay_data.order_ids, pay_data.payment_id, this.payment_list);
                                    }
                                }
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
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
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
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
                    payment_id: e.currentTarget.dataset.payment || 0,
                });
            },

            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false,
                });
            },
            // 支付成功数据设置
            order_item_pay_success_handle(data) {
                var order_ids_arr = data.order_id.toString().split(',');
                var temp_data_list = this.data_list;
                for (var i in temp_data_list) {
                    if (order_ids_arr.indexOf(temp_data_list[i]['id'].toString()) != -1) {
                        temp_data_list[i]['pay_money'] = temp_data_list[i]['money'];
                        temp_data_list[i]['status'] = 1;
                        temp_data_list[i]['status_name'] = this.$t('order.order.s8g966');
                    }
                }
                this.setData({
                    data_list: temp_data_list,
                });

                // 成功回调事件
                this.$emit('pay-success');
            },

            // 删除
            delete_event(e) {
                var self = this;
                uni.showModal({
                    title: self.$t('common.warm_tips'),
                    content: self.$t('recommend-list.recommend-list.54d418'),
                    confirmText: self.$t('common.confirm'),
                    cancelText: self.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;

                            // 加载loding
                            uni.showLoading({
                                title: self.$t('common.processing_in_text'),
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
                                        var temp_data_list = self.data_list;
                                        temp_data_list.splice(index, 1);
                                        self.setData({
                                            data_list: temp_data_list,
                                        });
                                        if (temp_data_list.length == 0) {
                                            self.setData({
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
                                    app.globalData.showToast(self.$t('common.internet_error_tips'));
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
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 页面卸载
            onUnload(e) {
                clearInterval(this.popup_view_pay_timer);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
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
    .recharge-item .name {
        min-width: 112rpx;
    }
</style>
