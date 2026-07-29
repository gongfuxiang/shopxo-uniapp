<template>
    <view v-if="operate_bar_show" :class="propClass">
        <button v-if="propOrder.operate_data.is_cancel == 1" class="round bg-white cr-yellow br-yellow margin-bottom-main" type="default" size="mini" @tap="cancel_event" hover-class="none">{{ $t('common.cancel') }}</button>
        <button v-if="propOrder.operate_data.is_pay == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="pay_event" hover-class="none">{{ $t('common.pay') }}</button>
        <button v-if="payvoucher_show" class="round bg-white cr-blue br-blue margin-bottom-main" type="default" size="mini" @tap="payvoucher_event" hover-class="none">{{ payvoucher_name }}</button>
        <button v-if="propOrder.operate_data.is_collect == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="collect_event" hover-class="none">{{ $t('orderallot-list.orderallot-list.w2w2w4') }}</button>
        <button v-if="propOrder.operate_data.is_comments == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="comments_event" hover-class="none">{{ $t('common.comment') }}</button>
        <button v-if="more_actions_count > 0" class="round bg-white cr-base br-base margin-bottom-main" type="default" size="mini" @tap="more_open_event" hover-class="none">{{ $t('common.more') }}</button>

        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="more_close_event">
            <view class="padding-horizontal-main padding-top-main padding-bottom-lg">
                <view class="order-more-header flex-row jc-sb align-c margin-bottom-main">
                    <view class="fw-b text-size">{{ $t('common.more_operate') }}</view>
                    <view class="cp" @tap.stop="more_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <scroll-view v-if="more_actions.length > 0" :scroll-y="true" class="order-more-scroll">
                    <view v-for="(item, index) in more_actions" :key="index" class="order-more-item br-b padding-vertical-main tc cp" :data-index="index" @tap="more_select_event">{{ item.name }}</view>
                </scroll-view>
                <view class="order-more-footer padding-top-main">
                    <button class="round bg-grey-f5 cr-base text-size wh-auto" type="default" hover-class="none" @tap="more_close_event">{{ $t('common.cancel') }}</button>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentPopup from '@/components/popup/popup';

    export default {
        components: {
            componentPopup,
        },
        props: {
            propOrder: {
                type: Object,
                default: null,
            },
            propIndex: {
                type: Number,
                default: -1,
            },
            propSource: {
                type: String,
                default: 'list',
            },
            propClass: {
                type: String,
                default: 'item-operation tr br-t padding-top-main',
            },
        },
        data() {
            return {
                popup_status: false,
            };
        },
        computed: {
            // 是否展示操作栏
            operate_bar_show() {
                if ((this.propOrder || null) == null || this.propOrder.operate_data == null) {
                    return false;
                }
                var od = this.propOrder.operate_data;
                return od.is_cancel == 1 || od.is_pay == 1 || od.is_collect == 1 || od.is_comments == 1 || this.more_actions_count > 0 || this.payvoucher_show;
            },
            // 支付凭证入口
            payvoucher_show() {
                var d = (this.propOrder && this.propOrder.plugins_payvoucher_data) || null;
                return d != null && (d.is_show || 0) == 1;
            },
            payvoucher_name() {
                var d = (this.propOrder && this.propOrder.plugins_payvoucher_data) || null;
                return (d && d.name) || '凭证';
            },
            // 更多操作列表
            more_actions() {
                return this.build_more_actions(this.propOrder);
            },
            // 更多操作数量
            more_actions_count() {
                return this.more_actions.length;
            },
        },
        methods: {
            // 构建更多操作项（插件操作、删除等）
            build_more_actions(order) {
                if ((order || null) == null) {
                    return [];
                }
                var actions = [];
                if ((order.plugins_express_data || 0) == 1 && (order.express_data || null) != null) {
                    actions.push({
                        key: 'express',
                        name: this.$t('orderallot-list.orderallot-list.w2t242'),
                        type: 'url',
                        value: '/pages/plugins/express/detail/detail?oid=' + order.id,
                    });
                }
                var invoice_data = order.plugins_invoice_data || null;
                if (invoice_data != null && (invoice_data.is_show || 0) == 1) {
                    actions.push({
                        key: 'invoice',
                        name: invoice_data.event_type == 'detail' ? '发票' : invoice_data.name,
                        type: 'url',
                        value: invoice_data.event_type == 'detail' ? invoice_data.detail_page : invoice_data.apply_page,
                    });
                }
                if ((order.plugins_delivery_data || 0) > 0) {
                    actions.push({
                        key: 'delivery',
                        name: this.$t('orderallot-list.orderallot-list.w2t242'),
                        type: 'url',
                        value: '/pages/plugins/delivery/logistics/logistics?id=' + order.plugins_delivery_data,
                    });
                }
                if (order.status == 2 && order.order_model != 2) {
                    actions.push({
                        key: 'rush',
                        name: this.$t('common.urge_text'),
                        type: 'event',
                        event: 'rush',
                    });
                }
                if ((order.plugins_is_order_allot_button || 0) == 1) {
                    actions.push({
                        key: 'order_allot',
                        name: this.$t('common.sub_order'),
                        type: 'url',
                        value: '/pages/plugins/realstore/orderallot-list/orderallot-list?oid=' + order.id,
                    });
                }
                if ((order.plugins_is_order_batch_button || 0) == 1) {
                    actions.push({
                        key: 'order_batch',
                        name: this.$t('orderallot-list.orderallot-list.6m73j2'),
                        type: 'url',
                        value: '/pages/plugins/realstore/batchorder-list/batchorder-list?oid=' + order.id,
                    });
                }
                if ((order.plugins_is_order_frequencycard_button || 0) == 1) {
                    actions.push({
                        key: 'frequencycard',
                        name: this.$t('orderallot-list.orderallot-list.b13k5r'),
                        type: 'url',
                        value: '/pages/plugins/realstore/frequencycard-list/frequencycard-list?oid=' + order.id,
                    });
                }
                if ((order.plugins_ordergoodsform_data || 0) == 1) {
                    actions.push({
                        key: 'ordergoodsform',
                        name: this.$t('common.form'),
                        type: 'url',
                        value: '/pages/plugins/ordergoodsform/order/order?id=' + order.id,
                    });
                }
                if ((order.plugins_orderresources_data || 0) == 1) {
                    actions.push({
                        key: 'orderresources',
                        name: this.$t('common.resource'),
                        type: 'url',
                        value: '/pages/plugins/orderresources/orderannex/orderannex?oid=' + order.id,
                    });
                }
                if ((order.plugins_is_orderfeed_button || 0) == 1) {
                    actions.push({
                        key: 'orderfeed',
                        name: this.$t('common.feed_text'),
                        type: 'url',
                        value: '/pages/plugins/orderfeed/form/form?oid=' + order.id,
                    });
                }
                if ((order.plugins_is_bargain_team_button || 0) == 1) {
                    actions.push({
                        key: 'bargain',
                        name: this.$t('pages.plugins-bargain-team'),
                        type: 'url',
                        value: order.plugins_bargain_record_url,
                    });
                }
                if ((order.plugins_is_groupbuy_team_button || 0) == 1) {
                    actions.push({
                        key: 'groupbuy',
                        name: this.$t('pages.plugins-groupbuy-team'),
                        type: 'url',
                        value: order.plugins_groupbuy_team_url,
                    });
                }
                var intellect_data = order.plugins_intellectstools_data || null;
                if (intellect_data != null && (intellect_data.continue_buy_data || null) != null && intellect_data.continue_buy_data.length > 0) {
                    actions.push({
                        key: 'repurchase',
                        name: this.$t('common.repurchase'),
                        type: 'event',
                        event: 'repurchase',
                    });
                }
                if (order.operate_data != null && order.operate_data.is_delete == 1) {
                    actions.push({
                        key: 'delete',
                        name: this.$t('common.del'),
                        type: 'event',
                        event: 'delete',
                    });
                }
                return actions;
            },

            // 取消订单
            cancel_event() {
                this.$emit('cancel', {
                    value: this.propOrder.id,
                    index: this.propIndex,
                });
            },

            // 支付订单
            pay_event() {
                this.$emit('pay', {
                    value: this.propOrder.id,
                    index: this.propIndex,
                    price: this.propOrder.total_price,
                    payment: this.propOrder.payment_id,
                    currencySymbol: this.propOrder.currency_data.currency_symbol,
                });
            },

            // 上传支付凭证
            payvoucher_event() {
                var d = this.propOrder.plugins_payvoucher_data || null;
                var url = (d && d.page) || ('/pages/plugins/payvoucher/order/saveinfo/saveinfo?oid=' + this.propOrder.id + '&stype=system_order&from=' + (this.propSource || 'list'));
                app.globalData.url_open(url);
            },

            // 确认收货
            collect_event() {
                this.$emit('collect', {
                    value: this.propOrder.id,
                    index: this.propIndex,
                    transactionid: this.propOrder.weixin_collect_data || '',
                });
            },

            // 评价订单
            comments_event() {
                app.globalData.url_open('/pages/user-order-comments/user-order-comments?id=' + this.propOrder.id);
            },

            // 打开更多操作弹窗
            more_open_event() {
                if (this.more_actions.length == 0) {
                    return;
                }
                this.setData({
                    popup_status: true,
                });
            },

            // 关闭更多操作弹窗
            more_close_event() {
                this.setData({
                    popup_status: false,
                });
            },

            // 更多操作项点击
            more_select_event(e) {
                var index = e.currentTarget.dataset.index;
                var action = this.more_actions[index];
                this.more_close_event();
                this.more_action_handle(action);
            },

            // 更多操作项处理
            more_action_handle(action) {
                if ((action || null) == null) {
                    return;
                }
                if (action.type == 'url') {
                    if (action.value) {
                        app.globalData.url_open(action.value);
                    }
                    return;
                }
                if (action.type != 'event') {
                    return;
                }
                switch (action.event) {
                    case 'rush':
                        app.globalData.showToast(this.$t('common.urge_success'), 'success');
                        break;
                    case 'delete':
                        this.$emit('delete', {
                            value: this.propOrder.id,
                            index: this.propIndex,
                            source: this.propSource,
                        });
                        break;
                    case 'repurchase':
                        this.continue_buy_by_order(this.propOrder);
                        break;
                }
            },

            // 回购（智能工具箱）
            continue_buy_by_order(order) {
                if ((order.plugins_intellectstools_data || null) == null) {
                    return;
                }
                var plugins_intellectstools_data = order.plugins_intellectstools_data;
                var continue_buy_data = plugins_intellectstools_data.continue_buy_data || null;
                if (continue_buy_data == null || continue_buy_data.length == 0) {
                    return;
                }
                var is_buy_again_buy = parseInt(plugins_intellectstools_data.is_buy_again_buy || 0);
                var is_buy_again_cart = parseInt(plugins_intellectstools_data.is_buy_again_cart || 0);
                if (is_buy_again_buy == 1 && is_buy_again_cart == 1) {
                    var self = this;
                    uni.showActionSheet({
                        itemList: [this.$t('common.add_cart'), this.$t('common.direct_buy')],
                        success: function(res) {
                            if (res.tapIndex == 0) {
                                self.continue_order_goods_cart_handle(continue_buy_data);
                            } else {
                                self.continue_order_goods_buy_handle(continue_buy_data);
                            }
                        },
                    });
                } else if (is_buy_again_cart == 1) {
                    this.continue_order_goods_cart_handle(continue_buy_data);
                } else if (is_buy_again_buy == 1) {
                    this.continue_order_goods_buy_handle(continue_buy_data);
                }
            },

            // 订单商品直接购买
            continue_order_goods_buy_handle(goods_data) {
                var data = {
                    buy_type: 'goods',
                    goods_data: encodeURIComponent(base64.encode(JSON.stringify(goods_data))),
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },

            // 订单商品加入购物车
            continue_order_goods_cart_handle(goods_data) {
                var self = this;
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'cart'),
                    method: 'POST',
                    data: {
                        goods_data: goods_data,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(function() {
                                app.globalData.url_open('/pages/cart-page/cart-page');
                            }, 1000);
                        } else {
                            if (app.globalData.is_login_check(res.data, self, 'continue_order_goods_cart_handle', goods_data)) {
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
    .order-more-header {
        min-height: 48rpx;
    }
    .order-more-scroll {
        max-height: 520rpx;
    }
    .order-more-item:last-child {
        border-bottom: 0;
    }
</style>
