<template>
    <view :class="theme_view">
        <block v-if="(data_base || null) != null">
            <view v-if="(data_list || null) != null && data_list.length > 0" class="page-bottom-fixed">
                <!-- 导航 -->
                <scroll-view class="nav scroll-view-horizontal bg-white oh tc" :class="data_list.length < 4 ? 'average-' + data_list.length : ''" scroll-x="true">
                    <block v-for="(item, index) in data_list" :key="index">
                        <view :class="'item dis-inline-block padding-left-xxl padding-right-xxl cr-black ' + (selected_tabs_index === index ? 'cr-main nav-active-line' : '')" @tap="tabs_event" :data-index="index">
                            {{ item.name }}
                        </view>
                    </block>
                </scroll-view>
                <!-- 分割线 -->
                <view class="tc margin-top-xxl spacing-mb">
                    <text class="divider pr">{{$t('buy.buy.g7dk3f')}}</text>
                </view>
                <!-- 内容 -->
                <view class="vip-content bg-white padding-vertical-main padding-horizontal-sm spacing-mb">
                    <block v-for="(item, index) in data_list" :key="index">
                        <block v-if="selected_tabs_index == index">
                            <block v-if="(item.pay_period_rules || null) != null">
                                <view class="data-list flex-row flex-wrap align-c">
                                    <block v-for="(rules, ri) in item.pay_period_rules" :key="ri">
                                        <view class="list padding-sm oh" @tap="content_event" :data-index="ri" :data-value="currency_symbol + rules.price + '/' + ((rules.number || null) == null ? $t('buy.buy.b3dyo7') : rules.value + rules.unit)">
                                            <view class="item flex-col" :class="selected_content_index === ri ? 'active' : ''">
                                                <view class="number single-text text-size-lg">
                                                    <text class="fw-b">{{ (rules.number || null) == null ? $t('buy.buy.b3dyo7') : rules.value }}</text>
                                                    <text v-if="(rules.unit || null) != null" class="margin-left-sm">{{ rules.unit }}</text>
                                                </view>
                                                <view v-if="(rules.desc || null) != null" class="desc margin-top-sm">{{ rules.desc }}</view>
                                                <view class="price flex-row align-s">
                                                    <text class="cr-red text-size-md pr top-lg margin-right-xs">{{ currency_symbol }}</text>
                                                    <text class="fw-b cr-red text-size-xl single-text">{{ rules.price }}</text>
                                                </view>
                                            </view>
                                        </view>
                                    </block>
                                    <view class="bottom-fixed" :style="bottom_fixed_style">
                                        <view class="bottom-line-exclude">
                                            <button class="item bg-main br-main cr-white round text-size" type="default" hover-class="none" @tap="submit_event" :disabled="submit_disabled_status">{{$t('buy.buy.0s1k23')}}{{ selected_tabs_value }}</button>
                                        </view>
                                    </view>
                                </view>
                            </block>
                            <block v-else>
                                <!-- 提示信息 -->
                                <component-no-data propStatus="0" :propMsg="$t('buy.buy.5lr84j')"></component-no-data>
                            </block>
                        </block>
                    </block>
                </view>
                <view class="all-order flex-row jc-sb align-c padding-main bg-white spacing-mb" data-value="/pages/plugins/membershiplevelvip/order/order" @tap="url_event">
                    <view> <iconfont name="icon-kaitonghuiy-dingdan" propClass="margin-right-sm" color="#666"></iconfont>{{$t('buy.buy.ntm2z5')}}</view>
                    <iconfont name="icon-arrow-right" size="24rpx" color="#666"></iconfont>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data propStatus="0" :propMsg="$t('buy.buy.5x86n3')"></component-no-data>
            </view>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <!-- 支付组件 -->
        <component-payment
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            propPayDataKey="id"
            :propPaymentList="payment_list"
            :propTempPayValue="temp_pay_value"
            :propTempPayIndex="temp_pay_index"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsRedirectTo="true"
            :propToFailPage="to_fail_page"
            :propToAppointPage="to_appoint_page"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
        ></component-payment>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                data_list: [],
                data_base: null,
                selected_tabs_index: 0,
                selected_tabs_value: '',
                selected_content_index: null,
                submit_disabled_status: false,
                currency_symbol: app.globalData.currency_symbol(),
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
                // 支付失败跳转的页面
                to_fail_page: '/pages/plugins/membershiplevelvip/order/order',
                // 现金--跳转指定页面
                to_appoint_page: '/pages/plugins/membershiplevelvip/order/order',
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentPayment
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 加载数据
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
            this.get_data_list();
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
            get_data_list() {
                if (this.data_list.length <= 0) {
                    this.setData({
                        data_list_loding_status: 1,
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'buy', 'membershiplevelvip'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var status = (data.data || []).length > 0;
                            this.setData({
                                data_base: data.base || null,
                                data_list: data.data || [],
                                default_payment_id: data.default_payment_id || 0,
                                data_list_loding_msg: '',
                                data_list_loding_status: status ? 3 : 0,
                                data_bottom_line_status: status,
                                payment_list: data.payment_list,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
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
            // tabs事件
            tabs_event(e) {
                this.setData({
                    selected_tabs_index: e.currentTarget.dataset.index || 0,
                    selected_content_index: null,
                    selected_tabs_value: '',
                    temp_pay_index: 0,
                });
            },
            // 时长事件
            content_event(e) {
                this.setData({
                    selected_content_index: e.currentTarget.dataset.index || 0,
                    selected_tabs_value: e.currentTarget.dataset.value || '',
                    temp_pay_index: e.currentTarget.dataset.index,
                });
            },
            // 确认支付事件
            submit_event(e) {
                if (this.selected_tabs_index < 0 || this.selected_content_index === null) {
                    app.globalData.showToast(this.$t('buy.buy.bmueac'));
                    return false;
                }
                // 请求参数
                var item = this.data_list[this.selected_tabs_index] || null;
                if (item == null) {
                    app.globalData.showToast(this.$t('buy.buy.64ml60'));
                    return false;
                }
                var rules = (item['pay_period_rules'] || null) == null ? null : item['pay_period_rules'][this.selected_content_index] || null;
                if (rules == null) {
                    app.globalData.showToast(this.$t('buy.buy.64ml60'));
                    return false;
                }
                // 请求生成支付订单
                this.setData({
                    submit_disabled_status: true,
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('create', 'buy', 'membershiplevelvip'),
                    method: 'POST',
                    data: {
                        opening: item['id'] + '-' + rules['number'],
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        this.setData({
                            submit_disabled_status: false,
                        });
                        if (res.data.code == 0) {
                            this.setData({
                                is_show_payment_popup: this.is_show_payment_popup ? false : true,
                                temp_pay_value: res.data.data.id,
                                pay_price: res.data.data.price,
                                payment_id: res.data.data.payment_user_id,
                            });
                            uni.setStorageSync(app.globalData.data.cache_page_pay_key, {
                                order_ids: res.data.data.id,
                            });
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'submit_event')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 打开url
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 支付窗口关闭
            payment_popup_event_close() {
                this.setData({
                    is_show_payment_popup: false,
                });
            }
        }
    };
</script>
<style scoped>
    @import './buy.css';
</style>
