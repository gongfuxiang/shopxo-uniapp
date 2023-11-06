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
                                <iconfont :name="'icon-zhifu-'+((order_select_ids.indexOf(item.id) != -1) ? 'yixuan' : 'weixuan')" size="34rpx" :color="(order_select_ids.indexOf(item.id) != -1) ? theme_color : '#999'"></iconfont>
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
                        <view class="padding-vertical-main tr cr-base text-size">
                            <text
                                >共<text class="fw-b">{{ item.buy_number_count }}</text
                                >件 合计 <text class="sales-price margin-right-xs">{{ item.currency_data.currency_symbol }}{{ item.total_price }}</text
                                >元</text
                            >
                        </view>
                        <view
                            v-if="
                                item.operate_data.is_cancel +
                                    item.operate_data.is_pay +
                                    item.operate_data.is_collect +
                                    item.operate_data.is_comments +
                                    item.operate_data.is_delete +
                                    (item.plugins_is_order_allot_button || 0) +
                                    (item.plugins_is_order_batch_button || 0) +
                                    (item.plugins_is_order_frequencycard_button || 0) >
                                    0 ||
                                (item.status == 2 && item.order_model != 2) ||
                                ((item.plugins_express_data || 0) == 1 && (item.express_number || null) != null) ||
                                (item.plugins_delivery_data || 0) == 1 ||
                                ((item.plugins_intellectstools_data || null) != null && (item.plugins_intellectstools_data.continue_buy_data || null) != null && item.plugins_intellectstools_data.continue_buy_data.length > 0)
                            "
                            class="item-operation tr br-t padding-vertical-main"
                        >
                            <button v-if="item.operate_data.is_cancel == 1" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">取消</button>
                            <button v-if="item.operate_data.is_pay == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-index="index" :data-price="item.total_price" :data-payment="item.payment_id" hover-class="none">支付</button>
                            <button v-if="item.operate_data.is_collect == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="collect_event" :data-value="item.id" :data-index="index" hover-class="none">收货</button>
                            <button v-if="(item.plugins_express_data || 0) == 1 && (item.express_number || null) != null" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/express/detail/detail?id=' + item.id" hover-class="none">
                                物流
                            </button>
                            <button v-if="(item.plugins_delivery_data || 0) == 1" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/delivery/logistics/logistics?id=' + item.id" hover-class="none">物流</button>
                            <button v-if="item.operate_data.is_comments == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="comments_event" :data-value="item.id" :data-index="index" hover-class="none">评论</button>
                            <button v-if="item.status == 2 && item.order_model != 2" class="round cr-base br" type="default" size="mini" @tap="rush_event" :data-value="item.id" :data-index="index" hover-class="none">催催</button>
                            <button v-if="item.operate_data.is_delete == 1" class="round bg-white cr-red br-red" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">删除</button>
                            <button v-if="(item.plugins_is_order_allot_button || 0) == 1" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/orderallot-list/orderallot-list?oid=' + item.id" hover-class="none">子单</button>
                            <button v-if="(item.plugins_is_order_batch_button || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/batchorder-list/batchorder-list?oid=' + item.id" hover-class="none">批次</button>
                            <button v-if="(item.plugins_is_order_frequencycard_button || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/frequencycard-list/frequencycard-list?oid=' + item.id" hover-class="none">
                                次卡
                            </button>
                            <button
                                v-if="(item.plugins_intellectstools_data || null) != null && (item.plugins_intellectstools_data.continue_buy_data || null) != null && item.plugins_intellectstools_data.continue_buy_data.length > 0"
                                class="round bg-white cr-green br-green"
                                type="default"
                                size="mini"
                                :data-index="index"
                                @tap="continue_buy_event"
                                hover-class="none"
                            >
                                再次购买
                            </button>
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
        <view v-if="nav_status_index == 1 && order_select_ids.length > 0 && home_is_enable_order_bulk_pay == 1" class="bottom-fixed tc">
            <view class="bottom-line-exclude">
                <button class="pay-merge-submit bg-green cr-white round text-size" hover-class="none" @tap="pay_merge_event">合并支付</button>
            </view>
        </view>

        <component-payment
            :prop-pay-url="pay_url"
            :prop-qrcode-url="qrcode_url"
            :prop-payment-list="payment_list"
            prop-pay-data-key="ids"
            :prop-temp-pay-value="temp_pay_value"
            :prop-temp-pay-index="temp_pay_index"
            :prop-payment-id="payment_id"
            :prop-default-payment-id="default_payment_id"
            :prop-pay-price="pay_price"
            :prop-is-show-payment="is_show_payment_popup"
            @close-payment-poupon="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
        ></component-payment>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../common/js/lib/base64.js';
    import componentPopup from '../../components/popup/popup';
    import componentNoData from '../../components/no-data/no-data';
    import componentBottomLine from '../../components/bottom-line/bottom-line';
    import componentPayment from '@/components/payment/payment';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                common_static_url: common_static_url,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                input_keyword_value: '',
                nav_status_list: [
                    { name: '全部', value: '-1' },
                    { name: '待付款', value: '1' },
                    { name: '待发货', value: '2' },
                    { name: '待收货', value: '3' },
                    { name: '已完成', value: '4' },
                    { name: '已失效', value: '5,6' },
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
                pay_price: 0,
                pay_url: '',
                qrcode_url: '',
                payment_list: [],
                temp_pay_value: '',
                temp_pay_index: 0,
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
            };
        },

        components: {
            componentPopup,
            componentNoData,
            componentBottomLine,
            componentPayment,
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
                nav_status_index: nav_status_index,
                params: params || {},
            });

            // 初始化配置
            this.init_config();

            // 数据加载
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
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        home_is_enable_order_bulk_pay: app.globalData.get_config('config.home_is_enable_order_bulk_pay'),
                        pay_url: app.globalData.get_request_url('pay', 'order'),
                        qrcode_url: app.globalData.get_request_url('paycheck', 'order'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
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
                uni.showLoading({
                    title: '加载中...',
                });

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

                                // 判断url是否含有从其他页面携带过来的参数
                                if ((this.params.order_ids || null) !== null) {
                                    var order_ids_arr = this.params.order_ids.split(',');
                                    var temp_data_list = this.data_list;
                                    for (var i in temp_data_list) {
                                        if (order_ids_arr.indexOf(temp_data_list[i]['id']) != -1) {
                                            temp_data_list[i]['is_under_line'] = 1;
                                        }
                                    }
                                    this.setData({
                                        data_list: temp_data_list,
                                    });
                                }
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_bottom_line_status: false,
                                    data_list: [],
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
                    payment_id: e.currentTarget.dataset.payment || 0,
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
            order_item_pay_success_handle(data, index, order_ids) {
                var order_ids_arr = data.order_id.split(',');
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
                                        temp_data_list[index]['status_name'] = '已取消';
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
                                    app.globalData.showToast('网络开小差了哦~');
                                },
                            });
                        }
                    },
                });
            },

            // 收货
            collect_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '请确认已收到货物或已完成，操作后不可恢复，确定继续吗?',
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
                                        temp_data_list[index]['status_name'] = '已完成';
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
                                    app.globalData.showToast('网络开小差了哦~');
                                },
                            });
                        }
                    },
                });
            },

            // 催催
            rush_event(e) {
                app.globalData.showToast('催促成功', 'success');
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    order_select_ids: [],
                });

                // 重新拉取数据
                this.get_data_list(1);
            },

            // 售后订单事件
            orderaftersale_event(e) {
                var oid = e.currentTarget.dataset.oid || 0;
                var did = e.currentTarget.dataset.did || 0;
                if (oid == 0 || did == 0) {
                    app.globalData.showToast('参数有误');
                    return false;
                }

                // 进入售后页面
                uni.navigateTo({
                    url: '/pages/user-orderaftersale-detail/user-orderaftersale-detail?oid=' + oid + '&did=' + did,
                });
            },

            // 订单评论
            comments_event(e) {
                uni.navigateTo({
                    url: '/pages/user-order-comments/user-order-comments?id=' + e.currentTarget.dataset.value,
                });
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

            // 再次购买事件
            continue_buy_event(e) {
                var index = e.currentTarget.dataset.index;
                var data = this.data_list[index];
                if ((data.plugins_intellectstools_data || null) != null && (data.plugins_intellectstools_data.continue_buy_data || null) != null && data.plugins_intellectstools_data.continue_buy_data.length > 0) {
                    // 进入订单确认页面
                    var data = {
                        buy_type: 'goods',
                        goods_data: encodeURIComponent(base64.encode(JSON.stringify(data.plugins_intellectstools_data.continue_buy_data))),
                    };
                    uni.navigateTo({
                        url: '/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))),
                    });
                }
            },
        },
    };
</script>
<style scoped>
    @import './user-order.css';
</style>
