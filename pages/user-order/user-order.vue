<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view v-if="nav_status_index == index" class="item fl tc cr-main nav-active-line" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                <view v-else class="item fl tc" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>

        <!-- 订单列表 -->
        <scroll-view :scroll-y="true" class="order-scroll" @scrolltolower="scroll_lower" lower-threshold="60">
            <view :class="nav_status_index == 1 && order_select_ids.length > 0 && home_is_enable_order_bulk_pay == 1 ? 'page-bottom-fixed' : ''">
                <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="list-item padding-horizontal-main padding-top-main border-radius-main bg-white oh spacing-mb">
                        <view class="item-base oh br-b padding-bottom-main">
                            <!-- 选择 -->
                            <view v-if="nav_status_index == 1 && home_is_enable_order_bulk_pay == 1" :data-price="item.total_price" :data-oid="item.id" :data-payment="item.payment_id" class="dis-inline-block va-m margin-right-lg" @tap="selected_event">
                                <iconfont :name="'icon-zhifu-'+((order_select_ids.indexOf(item.id) != -1) ? 'yixuan' : 'weixuan')" size="40rpx" :color="(order_select_ids.indexOf(item.id) != -1) ? theme_color : '#999'" propClass="fl margin-top-xs"></iconfont>
                            </view>
                            <!-- 基础信息 -->
                            <view class="dis-inline-block va-m cp" @tap="url_event" :data-value="item.warehouse_url || ''">
                                <image v-if="(item.warehouse_icon || null) != null" class="warehouse-group-icon va-m margin-right-sm" :src="item.warehouse_icon" mode="aspectFit"></image>
                                <text class="cr-base va-m">{{ item.warehouse_name }}</text>
                            </view>
                            <text class="fr cr-red">{{ item.status_name }}<text v-if="(item.is_under_line_text || null) != null">（{{ item.is_under_line_text }}）</text></text>
                        </view>
                        <view v-for="(detail, di) in item.items" :key="di" class="br-b-dashed oh padding-vertical-main">
                            <view :data-value="'/pages/user-order-detail/user-order-detail?id=' + item.id" @tap="url_event">
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
                                    <view v-if="item.is_can_launch_aftersale == 1 && (detail.orderaftersale_btn_text || null) != null" class="orderaftersale-btn-text cr-blue pa bg-white" @tap.stop="orderaftersale_event" :data-oid="item.id" :data-did="detail.id">{{
                                        detail.orderaftersale_btn_text
                                    }}</view>
                                </view>
                            </view>
                        </view>
                        <view class="padding-vertical-main tr cr-base text-size-sm">
                            <text>{{$t('user-order-detail.user-order-detail.423rmr')}}<text class="fw-b">{{ item.buy_number_count }}</text>{{$t('user-order-detail.user-order-detail.41ty94')}}<text class="sales-price margin-right-xs">{{ item.currency_data.currency_symbol }}{{ item.total_price }}</text></text>
                        </view>
                        <view
                            v-if="
                                (
                                    item.operate_data.is_cancel +
                                    item.operate_data.is_pay +
                                    item.operate_data.is_collect +
                                    item.operate_data.is_comments +
                                    item.operate_data.is_delete +
                                    (item.plugins_is_order_allot_button || 0) +
                                    (item.plugins_is_order_batch_button || 0) +
                                    (item.plugins_is_order_frequencycard_button || 0) +
                                    (item.plugins_delivery_data || 0) +
                                    (item.plugins_ordergoodsform_data || 0) +
                                    (item.plugins_orderresources_data || 0)
                                 > 0 ) ||
                                (item.status == 2 && item.order_model != 2) ||
                                ((item.plugins_express_data || 0) == 1 && (item.express_data || null) != null) ||
                                ((item.plugins_intellectstools_data || null) != null && (item.plugins_intellectstools_data.continue_buy_data || null) != null && item.plugins_intellectstools_data.continue_buy_data.length > 0)
                            "
                            class="item-operation tr br-t padding-top-main">
                            <button v-if="item.operate_data.is_cancel == 1" class="round bg-white cr-yellow br-yellow margin-bottom-main" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.cancel')}}</button>
                            <button v-if="item.operate_data.is_pay == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-index="index" :data-price="item.total_price" :data-payment="item.payment_id" :data-currency-symbol="item.currency_data.currency_symbol" hover-class="none">{{$t('order.order.1i873j')}}</button>
                            <button v-if="item.operate_data.is_collect == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="collect_event" :data-transactionid="item.weixin_collect_data || ''" :data-value="item.id" :data-index="index" hover-class="none">{{$t('orderallot-list.orderallot-list.w2w2w4')}}</button>
                            <button v-if="(item.plugins_express_data || 0) == 1 && (item.express_data || null) != null" class="round bg-white cr-main br-main margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/express/detail/detail?oid=' + item.id" hover-class="none">{{$t('orderallot-list.orderallot-list.w2t242')}}</button>
                            <button v-if="(item.plugins_delivery_data || 0) > 0" class="round bg-white cr-main br-main margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/delivery/logistics/logistics?id=' + item.plugins_delivery_data" hover-class="none">{{$t('orderallot-list.orderallot-list.w2t242')}}</button>
                            <button v-if="item.operate_data.is_comments == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="comments_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('user-order.user-order.twc3r7')}}</button>
                            <button v-if="item.status == 2 && item.order_model != 2" class="round cr-base br margin-bottom-main" type="default" size="mini" @tap="rush_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('user-order.user-order.lp1v28')}}</button>
                            <button v-if="item.operate_data.is_delete == 1" class="round bg-white cr-red br-red margin-bottom-main" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.del')}}</button>
                            <button v-if="(item.plugins_is_order_allot_button || 0) == 1" class="round bg-white cr-main br-main margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/orderallot-list/orderallot-list?oid=' + item.id" hover-class="none">{{$t('user-order.user-order.ht65c9')}}</button>
                            <button v-if="(item.plugins_is_order_batch_button || 0) == 1" class="round bg-white cr-blue br-blue margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/batchorder-list/batchorder-list?oid=' + item.id" hover-class="none">{{$t('orderallot-list.orderallot-list.6m73j2')}}</button>
                            <button v-if="(item.plugins_is_order_frequencycard_button || 0) == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/frequencycard-list/frequencycard-list?oid=' + item.id" hover-class="none">{{$t('orderallot-list.orderallot-list.b13k5r')}}</button>
                            <button v-if="(item.plugins_ordergoodsform_data || 0) == 1" class="round bg-white cr-blue br-blue margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/ordergoodsform/order/order?id=' + item.id" hover-class="none">{{$t('user-order.user-order.9l47b6')}}</button>
                            <button v-if="(item.plugins_orderresources_data || 0) == 1" class="round bg-white cr-blue br-blue margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/orderresources/orderannex/orderannex?oid=' + item.id" hover-class="none">{{$t('user-order.user-order.fyuikn')}}</button>
                            <button v-if="(item.plugins_intellectstools_data || null) != null && (item.plugins_intellectstools_data.continue_buy_data || null) != null && item.plugins_intellectstools_data.continue_buy_data.length > 0" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" :data-index="index" @tap="continue_buy_event" hover-class="none">{{$t('user-order.user-order.3l2jr5')}}</button>
                        </view>
                    </view>
                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status"></component-no-data>
                </view>
            </view>
        </scroll-view>

        <!-- 合并支付 -->
        <view v-if="nav_status_index == 1 && order_select_ids.length > 0 && home_is_enable_order_bulk_pay == 1" class="bottom-fixed" :style="bottom_fixed_style">
            <view class="bottom-line-exclude">
                <button class="item bg-main cr-white round text-size wh-auto" hover-class="none" @tap="pay_merge_event">{{$t('user-order.user-order.7571p2')}}</button>
            </view>
        </view>

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
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPayment from '@/components/payment/payment';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                common_static_url: common_static_url,
                bottom_fixed_style: '',
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                input_keyword_value: '',
                nav_status_list: [
                    { name: this.$t('common.all'), value: '-1' },
                    { name: this.$t('user.user.9u8e61'), value: '1' },
                    { name: this.$t('user.user.66714e'), value: '2' },
                    { name: this.$t('order.order.q820hx'), value: '3' },
                    { name: this.$t('order.order.15lr5l'), value: '4' },
                    { name: this.$t('detail.detail.32171c'), value: '5,6' },
                ],
                mult_payment_id_list: [],
                order_select_ids: [],
                mult_pay_price: [],
                nav_status_index: 0,
                // 基础配置
                home_is_enable_order_bulk_pay: 0,
                // 页面从其他页面跳转过来携带的参数
                params: {},
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
            componentPopup,
            componentNoData,
            componentBottomLine,
            componentPayment,
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
                nav_status_index: nav_status_index,
                params: params || {},
            });

            // 初始化配置
            this.init_config();

            // 数据加载
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
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        home_is_enable_order_bulk_pay: app.globalData.get_config('config.home_is_enable_order_bulk_pay'),
                        is_order_pay_only_can_buy_payment: parseInt(app.globalData.get_config('plugins_base.intellectstools.data.is_order_pay_only_can_buy_payment', 0)),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
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

            // 输入框事件
            input_event(e) {
                this.setData({
                    input_keyword_value: e.detail.value,
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
                    url: app.globalData.get_request_url('index', 'order'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        keywords: this.input_keyword_value || '',
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
                    if (order_ids_arr.indexOf(temp_data_list[i]['id'].toString()) != -1) {
                        temp_data_list[i]['operate_data']['is_pay'] = 0;
                        temp_data_list[i]['operate_data']['is_cancel'] = 0;
                        switch (parseInt(temp_data_list[i]['order_model'])) {
                            // 销售,同城模式
                            case 0:
                            case 1:
                                temp_data_list[i]['status'] = 2;
                                temp_data_list[i]['status_name'] = this.$t('user.user.66714e');
                                break;
                            // 自提模式
                            case 2:
                                temp_data_list[i]['status'] = 2;
                                temp_data_list[i]['status_name'] = this.$t('user-order.user-order.hp123x');
                                break;
                            // 虚拟模式
                            case 3:
                                temp_data_list[i]['status'] = 3;
                                temp_data_list[i]['status_name'] = this.$t('order.order.q820hx');
                                break;
                        }
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
                                url: app.globalData.get_request_url('cancel', 'order'),
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
                                        temp_data_list[index]['is_can_launch_aftersale'] = 0;
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
                var transactionid = e.currentTarget.dataset.transactionid || null;
                if(transactionid == null || !uni.openBusinessView) {
                    this.collect_hand_handle(e);
                } else {
                    // 存在微信单号收货数据，则拉起微信确认收货组件、失败则调用手动收货模式
                    var self = this;
                    uni.openBusinessView({
                        businessType: 'weappOrderConfirm',
                        extraData: {
                            transaction_id: transactionid
                        },
                        success(res) {
                            self.collect_handle(e);
                        },
                        fail(res) {
                            if((res.status || null) == 'fail') {
                                self.collect_hand_handle(e);
                            }
                        }
                    });
                }
            },

            // 手动收货
            collect_hand_handle(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('orderallot-list.orderallot-list.o3ouqv'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            this.collect_handle(e);
                        }
                    },
                });
            },

            // 收货处理
            collect_handle(e) {
                // 参数
                var id = e.currentTarget.dataset.value;
                var index = e.currentTarget.dataset.index;

                // 加载loding
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('collect', 'order'),
                    method: 'POST',
                    data: {
                        id: id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp_data_list = this.data_list;
                            temp_data_list[index]['status'] = 4;
                            temp_data_list[index]['status_name'] = this.$t('order.order.15lr5l');
                            temp_data_list[index]['operate_data']['is_collect'] = 0;
                            temp_data_list[index]['operate_data']['is_comments'] = 1;
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
                                url: app.globalData.get_request_url('delete', 'order'),
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
                                        var len = temp_data_list.length;
                                        this.setData({
                                            data_list: temp_data_list,
                                            data_list_loding_status: len == 0 ? 0 : 3,
                                            data_bottom_line_status: len == 0 ? false : this.data_bottom_line_status,
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

            // 催催
            rush_event(e) {
                app.globalData.showToast(this.$t('user-order.user-order.f5qqhu'), 'success');
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    order_select_ids: [],
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });

                // 重新拉取数据
                this.get_data_list(1);
            },

            // 售后订单事件
            orderaftersale_event(e) {
                var oid = e.currentTarget.dataset.oid || 0;
                var did = e.currentTarget.dataset.did || 0;
                if (oid == 0 || did == 0) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.5k6k56'));
                    return false;
                }

                // 进入售后页面
                app.globalData.url_open('/pages/user-orderaftersale-detail/user-orderaftersale-detail?oid=' + oid + '&did=' + did);
            },

            // 订单评论
            comments_event(e) {
                app.globalData.url_open('/pages/user-order-comments/user-order-comments?id=' + e.currentTarget.dataset.value);
            },

            // 选中处理
            selected_event(e) {
                var oid = e.currentTarget.dataset.oid || 0;
                var price = e.currentTarget.dataset.price || 0;
                var payment_id = e.currentTarget.dataset.payment || '';
                var temp_select_ids = this.order_select_ids;
                var temp_mult_pay_price = this.mult_pay_price;
                var temp_payment_id = this.mult_payment_id_list;
                if (temp_select_ids.indexOf(oid) == -1) {
                    temp_select_ids.push(oid);
                    temp_mult_pay_price.push(price);
                    temp_payment_id.push(payment_id);
                } else {
                    for (var i in temp_select_ids) {
                        if (temp_select_ids[i] == oid) {
                            temp_select_ids.splice(i, 1);
                            temp_mult_pay_price.splice(i, 1);
                            temp_payment_id.splice(i, 1);
                        }
                    }
                }
                this.setData({
                    order_select_ids: temp_select_ids,
                    mult_pay_price: temp_mult_pay_price,
                    mult_payment_id_list: temp_payment_id,
                });
            },

            // 合并支付
            pay_merge_event(e) {
                var num = 0;
                if (this.mult_pay_price.length > 0) {
                    num = this.mult_pay_price.reduce((old, now) => {
                        return Number(old) + Number(now);
                    }, 0);
                }
                this.setData({
                    is_show_payment_popup: true,
                    temp_pay_value: this.order_select_ids.join(','),
                    pay_price: Math.round(parseFloat(num) * 100) / 100,
                    payment_id: this.order_select_ids.length > 1 ? this.default_payment_id : this.mult_payment_id_list[0],
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 回购事件
            continue_buy_event(e) {
                var item = this.data_list[e.currentTarget.dataset.index];
                if ((item.plugins_intellectstools_data || null) != null) {
                    var plugins_intellectstools_data = item.plugins_intellectstools_data;
                    var continue_buy_data = plugins_intellectstools_data.continue_buy_data || null;
                    // 是否存在订单可以购买的商品数据
                    if(continue_buy_data != null && continue_buy_data.length > 0) {
                        // 是否直接购买
                        var is_buy_again_buy = parseInt(plugins_intellectstools_data.is_buy_again_buy || 0);
                        // 是否加入购物车
                        var is_buy_again_cart = parseInt(plugins_intellectstools_data.is_buy_again_cart || 0);
                        // 如果同时都支持则让用户选择
                        if(is_buy_again_buy == 1 && is_buy_again_cart == 1) {
                            var self = this;
                            uni.showActionSheet({
                                itemList: [this.$t('user-order.user-order.a3c81d'), this.$t('user-order.user-order.5o756f')],
                                success: function (res) {
                                    if(res.tapIndex == 0) {
                                        // 加入购物车
                                        self.continue_order_goods_cart_handle(continue_buy_data, self);
                                    } else {
                                        // 直接购买
                                        self.continue_order_goods_buy_handle(continue_buy_data);
                                    }
                                }
                            });
                        } else if(is_buy_again_cart == 1) {
                            // 加入购物车
                            this.continue_order_goods_cart_handle(continue_buy_data, this);
                        } else if(is_buy_again_buy == 1) {
                            // 直接购买
                            this.continue_order_goods_buy_handle(continue_buy_data);
                        }
                    }
                }
            },

            // 订单商品直接购买处理
            continue_order_goods_buy_handle(goods_data) {
                // 进入订单确认页面
                var data = {
                    buy_type: 'goods',
                    goods_data: encodeURIComponent(base64.encode(JSON.stringify(goods_data))),
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },

            // 订单商品加入购物车处理
            continue_order_goods_cart_handle(goods_data, self) {
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url("save", "cart"),
                    method: "POST",
                    data: { goods_data: goods_data },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, "success");
                            setTimeout(function() {
                                app.globalData.url_open('/pages/cart-page/cart-page');
                            }, 1000);
                        } else {
                            if (app.globalData.is_login_check(res.data, self, "continue_order_goods_cart_handle", goods_data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style scoped>
    @import './user-order.css';
</style>
