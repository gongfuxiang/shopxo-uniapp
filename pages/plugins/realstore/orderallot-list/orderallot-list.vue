<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view v-if="nav_status_index == index" class="item fl tc cr-main nav-active-line" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                <view v-else class="item fl tc" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>

        <!-- 数据列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="list-item padding-horizontal-main padding-top-main border-radius-main bg-white oh spacing-mb">
                    <view class="item-base oh br-b padding-bottom-main">
                        <text class="fl cr-base">{{ item.order_allot_no }}</text>
                        <text class="fr cr-red"
                            >{{ item.status_name }}<text v-if="(item.is_under_line_text || null) != null">（{{ item.is_under_line_text }}）</text></text
                        >
                    </view>
                    <view v-for="(detail, di) in item.items" :key="di" class="br-b-dashed oh padding-vertical-main">
                        <view :data-value="'/pages/plugins/realstore/orderallot-detail/orderallot-detail?id=' + item.id" @tap="url_event" class="cp">
                            <image class="goods-image fl radius" :src="detail.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{ detail.title }}</view>
                                <view v-if="detail.spec != null" class="margin-top-sm">
                                    <block v-for="(sv, si) in detail.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-grey">{{ sv.value }}</text>
                                    </block>
                                </view>
                                <view class="margin-top-sm">
                                    <text class="fw-b">{{ item.currency_data.currency_symbol }}{{ detail.price }}</text>
                                    <text class="margin-left-sm">x{{ detail.buy_number }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="padding-vertical-main tr cr-base text-size">
                        <text>{{$t('user-order-detail.user-order-detail.423rmr')}}<text class="fw-b">{{ item.buy_number_count }}</text>{{$t('user-order-detail.user-order-detail.41ty94')}}<text class="sales-price margin-right-xs">{{ item.currency_data.currency_symbol }}{{ item.total_price }}</text></text>
                    </view>
                    <view v-if="
                        (
                            item.operate_data.is_cancel +
                            item.operate_data.is_pay +
                            item.operate_data.is_collect +
                            (item.plugins_delivery_data || 0) +
                            (item.plugins_is_order_frequencycard_button || 0) > 0
                        ) ||
                        ((item.express_data || null) != null && item.express_data.length > 0) ||
                        (item.operate_data.is_order_batch || 0) == 1 ||
                        (item.operate_data.is_order_frequencycard || 0) == 1
                    " class="item-operation tr br-t padding-vertical-main">
                        <button v-if="item.operate_data.is_cancel == 1" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.cancel')}}</button>
                        <button v-if="item.operate_data.is_pay == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.order_id" :data-index="index" :data-price="item.total_price" :data-payment="item.main_order_data.payment_id" :data-currency-symbol="item.currency_data.currency_symbol" hover-class="none">{{$t('order.order.1i873j')}}</button>
                        <button v-if="item.operate_data.is_collect == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="collect_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('orderallot-list.orderallot-list.w2w2w4')}}</button>
                        <button v-if="(item.operate_data.is_order_batch || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/batchorder-list/batchorder-list?oid=' + item.order_id" hover-class="none">{{$t('orderallot-list.orderallot-list.6m73j2')}}</button>
                        <button v-if="(item.operate_data.is_order_frequencycard || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/frequencycard-list/frequencycard-list?oid=' + item.order_id" hover-class="none">{{$t('orderallot-list.orderallot-list.b13k5r')}}</button>
                        <button v-if="(item.express_data || null) != null && item.express_data.length > 0" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/express/detail/detail?oid=' + item.id + '&action_type=realstore'" hover-class="none">{{$t('orderallot-list.orderallot-list.w2t242')}}</button>
                        <button v-if="(item.plugins_delivery_data || 0) > 0" class="round bg-white cr-main br-main margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/delivery/logistics/logistics?id=' + item.plugins_delivery_data" hover-class="none">{{$t('orderallot-list.orderallot-list.w2t242')}}</button>
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

        <!-- 支付组件 -->
        <component-payment
            ref="payment"
            :propCurrencySymbol="payment_currency_symbol"
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            :propPaymentList="payment_list"
            propPayDataKey="ids"
            :propTempPayValue="temp_pay_value"
            :propTempPayIndex="temp_pay_index"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
        ></component-payment>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
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
                nav_status_list: [
                    { name: this.$t('common.all'), value: "-1" },
                    { name: this.$t('extraction.extraction.53h4fj'), value: "0,1" },
                    { name: this.$t('orderallot-list.orderallot-list.285ir2'), value: "2,5" },
                    { name: this.$t('order.order.q820hx'), value: "3" },
                    { name: this.$t('order.order.15lr5l'), value: "4" },
                    { name: this.$t('detail.detail.32171c'), value: "6,7" },
                ],
                nav_status_index: 0,
                // 前往页面携带的参数
                payment_currency_symbol: app.globalData.currency_symbol(),
                pay_price: 0,
                pay_url: '',
                qrcode_url: '',
                payment_list: [],
                temp_pay_value: '',
                temp_pay_index: 0,
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
                // 智能工具箱（限定仅可选择下单支付方式）
                is_order_pay_only_can_buy_payment: 0,
                original_payment_list: [],
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPayment
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 是否指定状态
            var nav_status_index = 0;
            if ((params.status || null) != null) {
                for (var i in this.nav_status_list) {
                    if (this.nav_status_list[i]["value"] == params.status) {
                        nav_status_index = i;
                        break;
                    }
                }
            }
            this.setData({
                params: params,
                nav_status_index: nav_status_index,
            });

            // 初始化配置
            this.init_config();

            // 数据加载
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        is_order_pay_only_can_buy_payment: parseInt(app.globalData.get_config('plugins_base.intellectstools.data.is_order_pay_only_can_buy_payment', 0)),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.setData({
                        pay_url: app.globalData.get_request_url('pay', 'order'),
                        qrcode_url: app.globalData.get_request_url('paycheck', 'order'),
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
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]["value"];

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "orderallot", "realstore"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        status: status,
                        oid: this.params.oid || 0,
                    },
                    dataType: "json",
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
                                    original_payment_list: data.payment_list || [],
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
                                        this.$refs.payment.pay_handle(pay_data.order_ids, pay_data.payment_id, this.original_payment_list);
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
                            if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
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
                // 参数
                var index = e.currentTarget.dataset.index || 0;
                var payment_id = e.currentTarget.dataset.payment || 0;

                // 智能工具箱（限定仅可选择下单支付方式）
                if(this.is_order_pay_only_can_buy_payment == 1) {
                    var payment_list = [];
                    this.original_payment_list.forEach(function(v, k) {
                        if(v.id == payment_id) {
                            payment_list.push(v);
                        }
                    });
                } else {
                    var payment_list = this.original_payment_list;
                }

                // 设置支付参数
                this.setData({
                    is_show_payment_popup: true,
                    payment_list: payment_list,
                    payment_currency_symbol: e.currentTarget.dataset.currencySymbol,
                    temp_pay_value: e.currentTarget.dataset.value,
                    temp_pay_index: index,
                    payment_id: payment_id,
                    pay_price: e.currentTarget.dataset.price,
                    order_select_ids: [],
                });
            },

            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false,
                });
            },

            // 支付成功数据设置
            // 订单完成回调
            order_item_pay_success_handle(data) {
                var order_ids_arr = data.order_id.toString().split(',');
                var temp_data_list = this.data_list;
                for (var i in temp_data_list) {
                    if (order_ids_arr.indexOf(temp_data_list[i]['order_id'].toString()) != -1) {
                        temp_data_list[i]['operate_data']['is_pay'] = 0;
                        temp_data_list[i]['operate_data']['is_cancel'] = 0;
                        temp_data_list[i]['status'] = 2;
                        temp_data_list[i]['status_name'] = this.$t('orderallot-list.orderallot-list.x5l17j');
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
                                url: app.globalData.get_request_url("cancel", "orderallot", "realstore"),
                                method: 'POST',
                                data: {
                                    id: id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]['status'] = 5;
                                        temp_data_list[index]['status_name'] = this.$t('order.order.1k98tk');
                                        temp_data_list[index]['operate_data']['is_cancel'] = 0;
                                        temp_data_list[index]['operate_data']['is_pay'] = 0;
                                        temp_data_list[index]['operate_data']['is_delete'] = 1;
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

            // 收货
            collect_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('orderallot-list.orderallot-list.o3ouqv'),
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
                                url: app.globalData.get_request_url("collect", "orderallot", "realstore"),
                                method: "POST",
                                data: {
                                    id: id,
                                },
                                dataType: "json",
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]["status"] = 4;
                                        temp_data_list[index]["status_name"] = this.$t('order.order.15lr5l');
                                        temp_data_list[index]["operate_data"]["is_collect"] = 0;
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        app.globalData.showToast(res.data.msg, "success");
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

                // 重新拉取数据
                this.get_data_list(1);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import "./orderallot-list.css";
</style>
