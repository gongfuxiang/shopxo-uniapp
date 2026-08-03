<template>
    <view :class="theme_view">
        <!-- 搜索 -->
        <component-nav-back :propFixed="false" propClass="bg-white cr-black" propColor="#333" :style="'padding-top:' + status_bar_height + 'px;'">
            <template slot="right" :class="is_mp_env ? 'top-search-width' : ''">
                <view class="margin-left-main" :class="is_mp_env ? '' : 'flex-1 flex-width'">
                    <component-search @oninput="search_input_event" :propIsOnInputEvent="true" @onsearch="search_button_event" :propIsOnEvent="true" :propDefaultValue="search_keywords" :propIsRequired="false" propIconColor="#ccc" propPlaceholderClass="cr-grey-c" propBgColor="#f6f6f6"></component-search>
                </view>
            </template>
        </component-nav-back>
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view v-if="nav_status_index == index" class="item fl tc cr-main nav-active-line" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                <view v-else class="item fl tc" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>
        <!-- 订单列表 -->
        <scroll-view :scroll-y="true" class="order-scroll" :style="content_style" @scrolltolower="scroll_lower" lower-threshold="60">
            <view :class="nav_status_index == 1 && order_select_ids.length > 0 && home_is_enable_order_bulk_pay == 1 ? 'page-bottom-fixed' : ''">
                <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="list-item padding-horizontal-main padding-top-main border-radius-main bg-white oh spacing-mb">
                        <view class="item-base oh br-b padding-bottom-main">
                            <!-- 选择 -->
                            <view v-if="nav_status_index == 1 && home_is_enable_order_bulk_pay == 1" :data-price="item.total_price" :data-oid="item.id" :data-payment="item.payment_id" class="dis-inline-block va-m margin-right-lg" @tap="selected_event">
                                <iconfont :name="'icon-'+((order_select_ids.indexOf(item.id) != -1) ? 'selected-solid' : 'not-selected')" size="40rpx" :color="(order_select_ids.indexOf(item.id) != -1) ? theme_color : '#999'" propClass="fl margin-top-xs"></iconfont>
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
                            <text>{{$t('common.total')}}<text class="fw-b">{{ item.buy_number_count }}</text>{{$t('user-order-detail.user-order-detail.41ty94')}}<text class="sales-price margin-right-xs">{{ item.currency_data.currency_symbol }}{{ item.total_price }}</text></text>
                        </view>
                        <component-order-operate-more
                            :propOrder="item"
                            :propIndex="index"
                            propSource="list"
                            @cancel="order_operate_cancel_event"
                            @pay="order_operate_pay_event"
                            @collect="order_operate_collect_event"
                            @delete="order_operate_delete_event"
                        ></component-order-operate-more>
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
                <button class="item bg-main cr-white round text-size wh-auto" hover-class="none" @tap="pay_merge_event">{{$t('common.merge_payment')}}</button>
            </view>
        </view>

        <!-- 朋友代付支付弹窗 -->
        <component-friendpay-order-pay-popup
            :propShow="is_show_friendpay_order_popup"
            :propPluginsData="plugins_friendpay_data"
            :propPayPrice="pay_price"
            :propOrderIds="temp_pay_value"
            :propPaymentList="original_payment_list"
            :propDefaultPaymentId="default_payment_id"
            @close="friendpay_order_popup_close_event"
            @self-pay="friendpay_self_pay_event"
        ></component-friendpay-order-pay-popup>

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
            :propToAppointPage="'/pages/user-order/user-order'"
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
    import componentOrderOperateMore from './components/order-operate-more/order-operate-more';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentSearch from '@/components/search/search';
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPayment from '@/components/payment/payment';
    import componentFriendpayOrderPayPopup from '@/pages/plugins/friendpay/components/order-pay-popup/order-pay-popup';

    var common_static_url = app.globalData.get_static_url('common');
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO || H5
    bar_height = 0;
    // #endif
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                common_static_url: common_static_url,
                bottom_fixed_style: '',
                client_type: app.globalData.application_client_type(),
                status_bar_height: bar_height,
                is_mp_env: false,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || MP-QQ || MP-KUAISHOU
                is_mp_env: true,
                // #endif
                params: {},
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                search_keywords: '',
                content_style: '',
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
                plugins_friendpay_data: null,
                is_show_friendpay_order_popup: false,
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentSearch,
            componentPopup,
            componentNoData,
            componentBottomLine,
            componentPayment,
            componentOrderOperateMore,
            componentFriendpayOrderPayPopup,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

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
                search_keywords: params.keywords || '',
                content_style: 'height: calc(100vh - 80rpx - '+(this.status_bar_height+(this.client_type == 'h5' ? 55 : 50))+'px);',
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
                        keywords: this.search_keywords,
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
                                var update_data = {
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                };
                                if (this.data_page <= 1) {
                                    update_data.original_payment_list = data.payment_list || [];
                                    update_data.payment_list = data.payment_list || [];
                                    update_data.default_payment_id = data.default_payment_id || 0;
                                    update_data.plugins_friendpay_data = data.plugins_friendpay_data || null;
                                }
                                this.setData(update_data);

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
                var show_friendpay = (this.plugins_friendpay_data || null) != null && this.plugins_friendpay_data.is_enable == 1;
                this.setData({
                    payment_list: payment_list,
                    payment_currency_symbol: e.currentTarget.dataset.currencySymbol,
                    temp_pay_value: e.currentTarget.dataset.value,
                    temp_pay_index: index,
                    payment_id: payment_id,
                    pay_price: e.currentTarget.dataset.price,
                    order_select_ids: [],
                    is_show_friendpay_order_popup: show_friendpay,
                    is_show_payment_popup: !show_friendpay,
                });
            },

            // 朋友代付弹窗关闭
            friendpay_order_popup_close_event() {
                this.setData({ is_show_friendpay_order_popup: false });
            },

            // 朋友代付-自己支付（已在代付弹窗选好支付方式，直接发起支付，不再二次打开支付弹窗）
            friendpay_self_pay_event(e) {
                var payment_list = e.payment_list || this.original_payment_list;
                var payment_id = e.payment_id || this.default_payment_id;
                var order_ids = e.order_ids || this.temp_pay_value;
                this.setData({
                    is_show_friendpay_order_popup: false,
                    is_show_payment_popup: false,
                    payment_list: payment_list,
                    payment_id: payment_id,
                });
                if ((this.$refs.payment || null) != null && (order_ids || null) != null && payment_id > 0) {
                    this.$refs.payment.pay_handle(order_ids, payment_id, payment_list);
                }
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
                                temp_data_list[i]['status_name'] = this.$t('common.pending_pickup');
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
                    content: this.$t('common.cancel_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
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
                    cancelText: this.$t('common.no'),
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
                    content: this.$t('common.delete_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
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
                // 朋友代付与单笔支付一致
                var show_friendpay = (this.plugins_friendpay_data || null) != null && this.plugins_friendpay_data.is_enable == 1;
                this.setData({
                    temp_pay_value: this.order_select_ids.join(','),
                    pay_price: Math.round(parseFloat(num) * 100) / 100,
                    payment_id: this.order_select_ids.length > 1 ? this.default_payment_id : this.mult_payment_id_list[0],
                    is_show_friendpay_order_popup: show_friendpay,
                    is_show_payment_popup: !show_friendpay,
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 订单操作组件事件
            order_operate_cancel_event(data) {
                this.cancel_event({
                    currentTarget: {
                        dataset: data,
                    },
                });
            },
            order_operate_pay_event(data) {
                this.pay_event({
                    currentTarget: {
                        dataset: data,
                    },
                });
            },
            order_operate_collect_event(data) {
                this.collect_event({
                    currentTarget: {
                        dataset: data,
                    },
                });
            },
            order_operate_delete_event(data) {
                this.delete_event({
                    currentTarget: {
                        dataset: data,
                    },
                });
            },

            // 搜索输入事件
            search_input_event(e) {
                this.setData({
                    search_keywords: e
                });
            },

            // 关键字搜索
            search_button_event(e) {
                this.setData({
                    search_keywords: e,
                    order_select_ids: [],
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },
        },
    };
</script>
<style scoped>
    @import './user-order.css';
</style>
