<template>
    <view :class="theme_view">
        <view v-if="nav_status_list.length > 0" class="nav-base bg-white flex-row jc-sa align-c">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>
        <scroll-view :scroll-y="true" :class="'scroll-box ' + (nav_status_list.length > 0 ? 'scroll-box-ece-nav' : '')" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time }}</text>
                        <text class="fr cr-main">{{ item.status_name }}</text>
                    </view>
                    <view :data-value="item.doc_id ? ('/pages/plugins/doc/detail/detail?id=' + item.doc_id + (item.doc_content_id ? ('&dcid=' + item.doc_content_id) : '')) : ''" @tap="url_event" class="content margin-top-main cp">
                        <component-panel-content :propData="item" :propDataField="field_list" propExcludeField="status_name,add_time" propIsItemShowMax="6" :propIsTerse="true"></component-panel-content>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button v-if="item.doc_id" class="round bg-white cr-main br-main" type="default" size="mini" :data-value="'/pages/plugins/doc/detail/detail?id=' + item.doc_id + (item.doc_content_id ? ('&dcid=' + item.doc_content_id) : '')" @tap="url_event" hover-class="none">{{ $t('doc.read') }}</button>
                        <button v-if="item.is_can_pay == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-index="index" :data-price="item.price_value" hover-class="none">{{ $t('doc.continue_pay') }}</button>
                        <button v-if="item.is_can_pay == 1" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" :data-id="item.id" hover-class="none">{{ $t('common.cancel') }}</button>
                        <button v-if="item.is_can_refund_apply == 1" class="round bg-white cr-red br-red" type="default" size="mini" @tap="refund_event" :data-id="item.id" hover-class="none">{{ $t('doc.refund_apply') }}</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

        <component-payment
            ref="payment"
            :propCurrencySymbol="currency_symbol"
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            propPayDataKey="unlock_id"
            :propPaymentList="payment_list"
            :propTempPayValue="temp_pay_value"
            :propTempPayIndex="temp_pay_index"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsShowPayment="is_show_payment_popup"
            propToAppointPage="/pages/plugins/doc/user/user"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
        ></component-payment>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPayment from '@/components/payment/payment';
    import componentPanelContent from '@/components/panel-content/panel-content';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                currency_symbol: app.globalData.currency_symbol(),
                data_base: null,
                field_list: [],
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                nav_status_list: [],
                nav_status_index: 0,
                payment_list: [],
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
                temp_pay_value: 0,
                temp_pay_index: 0,
                pay_price: 0,
                pay_url: '',
                qrcode_url: '',
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPayment,
            componentPanelContent,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            this.setData({
                params: params,
                pay_url: app.globalData.get_request_url('continuepay', 'buy', 'doc'),
                qrcode_url: app.globalData.get_request_url('paycheck', 'buy', 'doc'),
            });
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init();

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
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },
            // 获取公共数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('init', 'user', 'doc'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var nav_status_index = this.nav_status_index;
                            var nav_status_list = data.nav_status_list || [];
                            if ((this.params || null) != null && (this.params.status || null) != null) {
                                for (var i in nav_status_list) {
                                    if (nav_status_list[i]['value'] == this.params.status) {
                                        nav_status_index = i;
                                        break;
                                    }
                                }
                            }
                            this.setData({
                                data_base: data.base || null,
                                payment_list: data.payment_list || [],
                                payment_id: data.default_payment_id || 0,
                                default_payment_id: data.default_payment_id || 0,
                                nav_status_list: nav_status_list,
                                nav_status_index: nav_status_index,
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                                data_page: 1,
                            });
                            this.get_data_list(1);
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 列表数据
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
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                var post_data = {
                    page: this.data_page,
                };
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value'];
                if (status != -1) {
                    post_data['status'] = status;
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'user', 'doc'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data_list || [];
                            if (list.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = list;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    for (var i in list) {
                                        temp_data_list.push(list[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    field_list: data.field_list || [],
                                    data_total: data.data_total || 0,
                                    data_page_total: data.page_total || 0,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
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
                        if (this.data_page > 1) {
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
            scroll_lower() {
                this.get_data_list();
            },
            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },
            // 支付
            pay_event(e) {
                this.setData({
                    is_show_payment_popup: true,
                    temp_pay_value: e.currentTarget.dataset.value,
                    temp_pay_index: e.currentTarget.dataset.index,
                    pay_price: e.currentTarget.dataset.price || 0,
                    payment_id: this.default_payment_id || 0,
                });
            },
            // 支付弹窗关闭
            payment_popup_event_close() {
                this.setData({
                    is_show_payment_popup: false,
                });
            },
            // 支付成功
            order_item_pay_success_handle() {
                this.setData({
                    is_show_payment_popup: false,
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },
            // 取消待支付
            cancel_event(e) {
                var id = e.currentTarget.dataset.id;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('doc.cancel_pay_confirm'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (res) => {
                        if (res.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'user', 'doc'),
                                method: 'POST',
                                data: { id: id },
                                dataType: 'json',
                                success: (r) => {
                                    uni.hideLoading();
                                    if (r.data.code == 0) {
                                        app.globalData.showToast(r.data.msg, 'success');
                                        this.setData({
                                            data_page: 1,
                                            data_list: [],
                                            data_bottom_line_status: false,
                                        });
                                        this.get_data_list(1);
                                    } else {
                                        app.globalData.showToast(r.data.msg);
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
            // 申请售后
            refund_event(e) {
                var id = e.currentTarget.dataset.id;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('doc.refund_confirm'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (res) => {
                        if (res.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('refundapply', 'user', 'doc'),
                                method: 'POST',
                                data: { id: id },
                                dataType: 'json',
                                success: (r) => {
                                    uni.hideLoading();
                                    if (r.data.code == 0) {
                                        app.globalData.showToast(r.data.msg, 'success');
                                        this.setData({
                                            data_page: 1,
                                            data_list: [],
                                            data_bottom_line_status: false,
                                        });
                                        this.get_data_list(1);
                                    } else {
                                        app.globalData.showToast(r.data.msg);
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
            // url事件
            url_event(e) {
                var value = ((e.currentTarget || {}).dataset || {}).value || '';
                if (value) {
                    app.globalData.url_event(e);
                }
            },
        },
    };
</script>
