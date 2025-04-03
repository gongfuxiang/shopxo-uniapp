<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
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
                    <view :data-value="'/pages/plugins/membershiplevelvip/order-detail/order-detail?id=' + item.id" @tap="url_event" class="content margin-top cp">
                        <view v-for="(fv, fi) in content_list" :key="fi">
                            <view class="single-text margin-top-xs">
                                <text class="cr-grey margin-right-xl">{{ fv.name }}</text>
                                <text class="cr-base">{{ item[fv.field] }}</text>
                                <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                                <text v-if="(item[fv.unit_field] || null) != null" class="cr-grey">{{ item[fv.unit_field] }}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if="item.status == 0 || item.status == 2 || item.status == 3" class="item-operation tr br-t padding-top-main margin-top-main">
                        <button v-if="item.status == 0" class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-price="item.price" :data-index="index" :data-payment="item.payment_id" hover-class="none">{{$t('order.order.1i873j')}}</button>
                        <button v-if="item.status == 0" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.cancel')}}</button>
                        <button v-if="item.status == 2 || item.status == 3" class="round bg-white cr-red br-red" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.del')}}</button>
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
            ref="payment"
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            propPayDataKey="id"
            :propPaymentList="payment_list"
            :propTempPayValue="temp_pay_value"
            :propTempPayIndex="temp_pay_index"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
            :propNavDtatusIndex="nav_status_index"
            @reset-event="reset_event"
        ></component-payment>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
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
                        name: this.$t('common.all'),
                        value: '-1',
                    },
                    {
                        name: this.$t('order.order.pjb15r'),
                        value: '0',
                    },
                    {
                        name: this.$t('order.order.s8g966'),
                        value: '1',
                    },
                    {
                        name: this.$t('order.order.1k98tk'),
                        value: '2',
                    },
                    {
                        name: this.$t('order.order.6390gk'),
                        value: '3',
                    },
                ],
                nav_status_index: 0,
                content_list: [
                    {
                        name: this.$t('order.order.vvxct1'),
                        field: 'payment_user_order_no',
                    },
                    {
                        name: this.$t('order.order.vjfki8'),
                        field: 'period_value',
                        unit_field: 'period_unit',
                    },
                    {
                        name: this.$t('order-detail.order-detail.x3ge6c'),
                        field: 'price',
                    },
                    {
                        name: this.$t('user-order-detail.user-order-detail.516tlr'),
                        field: 'pay_price',
                    },
                ],
            };
        },
        components: {
            componentCommon,
            componentPayment,
            componentNoData,
            componentBottomLine,
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

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
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

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
                    this.setData({
                        pay_url: app.globalData.get_request_url('pay', 'buy', 'membershiplevelvip'),
                        qrcode_url: app.globalData.get_request_url('paycheck', 'buy', 'membershiplevelvip'),
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
                    url: app.globalData.get_request_url('index', 'order', 'membershiplevelvip'),
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
            order_item_pay_success_handle(data) {
                var order_ids_arr = data.order_id.toString().split(',');
                var temp_data_list = this.data_list;
                for (var i in temp_data_list) {
                    if (order_ids_arr.indexOf(temp_data_list[i]['id'].toString()) != -1) {
                        temp_data_list[i]['pay_price'] = temp_data_list[i]['price'];
                        temp_data_list[i]['status'] = 1;
                        temp_data_list[i]['status_name'] = this.$t('order.order.s8g966');
                    }
                }
                this.setData({
                    data_list: temp_data_list,
                });
            },

            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.pn78ns'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            // 加载loding
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
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
                                        temp_data_list[index]['status_name'] = this.$t('order.order.1k98tk');
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
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 删除
            delete_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('recommend-list.recommend-list.54d418'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            // 加载loding
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
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
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
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

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import './order.css';
</style>
