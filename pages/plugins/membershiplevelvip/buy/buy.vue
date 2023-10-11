<template>
    <view>
        <view v-if="(data_base || null) != null">
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
                    <text class="divider pr">卡种选择</text>
                </view>
                <!-- 内容 -->
                <view class="vip-content bg-white padding-vertical-main padding-horizontal-sm spacing-mb">
                    <block v-for="(item, index) in data_list" :key="index">
                        <block v-if="selected_tabs_index == index">
                            <block v-if="(item.pay_period_rules || null) != null">
                                <view class="data-list flex-row flex-warp align-c">
                                    <block v-for="(rules, ri) in item.pay_period_rules" :key="ri">
                                        <view class="list padding-sm oh" @tap="content_event" :data-index="ri" :data-value="currency_symbol + rules.price + '/' + ((rules.number || null) == null ? '终身' : rules.value + rules.unit)">
                                            <view class="item flex-col" :class="selected_content_index === ri ? 'active' : ''">
                                                <view class="number single-text text-size-lg">
                                                    <text class="fw-b">{{ (rules.number || null) == null ? '终身' : rules.value }}</text>
                                                    <text v-if="(rules.unit || null) != null" class="margin-left-sm">{{ rules.unit }}</text>
                                                </view>
                                                <view v-if="(rules.desc || null) != null" class="desc margin-top-sm">{{ rules.desc }}</view>
                                                <view class="price flex-row align-s">
                                                    <text class="cr-red text-size-md pr top-lg margin-right-xs">{{ currency_symbol }}</text>
                                                    <text class="fw-b cr-red text-size-xl single-text">{{ rules.price }}</text>
                                                    <!-- <text class="cr-grey margin-left-sm">元</text> -->
                                                </view>
                                            </view>
                                        </view>
                                    </block>
                                    <view class="bottom-fixed sub-pay bg-white padding-vertical-main">
                                        <button class="bg-main br-main cr-white round text-size" type="default" hover-class="none" @tap="submit_event" :disabled="submit_disabled_status">立即开通{{ selected_tabs_value }}</button>
                                    </view>
                                </view>
                            </block>
                            <block v-else>
                                <!-- 提示信息 -->
                                <component-no-data propStatus="0" propMsg="购买时长未配置"></component-no-data>
                            </block>
                        </block>
                    </block>
                </view>
                <view class="all-order flex-row jc-sb align-c padding-main bg-white" data-value="/pages/plugins/membershiplevelvip/order/order" @tap="url_event">
                    <view> <iconfont name="icon-pp-all" class="margin-right-sm" color="#666"></iconfont> 所有订单 </view>
                    <iconfont name="icon-index-morejiantou" size="12rpx" color="#666"></iconfont>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data propStatus="0" propMsg="未配置会员等级"></component-no-data>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
        <component-payment
            :prop-pay-url="pay_url"
            :prop-qrcode-url="qrcode_url"
            prop-pay-data-key="id"
            :prop-payment-list="payment_list"
            :prop-temp-pay-value="temp_pay_value"
            :prop-temp-pay-index="temp_pay_index"
            :prop-payment-id="payment_id"
            :prop-default-payment-id="default_payment_id"
            :prop-pay-price="pay_price"
            :propIsRedirectTo="true"
            :prop-to-fail-page="to_fail_page"
            :prop-is-show-payment="is_show_payment_popup"
            @close-payment-poupon="payment_popup_event_close"
        ></component-payment>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';
    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_list: [],
                data_base: null,
                selected_tabs_index: 0,
                selected_tabs_value: '',
                selected_content_index: null,
                submit_disabled_status: false,
                currency_symbol: app.globalData.data.currency_symbol,
                // 支付弹窗参数
                pay_url: app.globalData.get_request_url('pay', 'buy', 'membershiplevelvip'),
                qrcode_url: app.globalData.get_request_url('paycheck', 'buy', 'membershiplevelvip'),
                payment_list: [],
                temp_pay_value: '',
                temp_pay_index: 0,
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
                pay_price: 0,
                // 支付失败跳转的页面
                to_fail_page: 'pages/plugins/membershiplevelvip/order/order',
            };
        },
        components: {
            componentNoData,
            componentPayment,
        },
        props: {},
        onLoad(params) {
            this.init();
        },
        onShow() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },
        methods: {
            init() {
                // 获取数据
                this.get_data_list();
            },
            // 获取数据
            get_data_list() {
                uni.showLoading({
                    title: '加载中...',
                });
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
                        uni.hideLoading();
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
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
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
                console.log(e.currentTarget.dataset);
            },
            // 确认支付事件
            submit_event(e) {
                if (this.selected_tabs_index < 0 || this.selected_content_index === null) {
                    app.globalData.showToast('请选择开通时长');
                    return false;
                }
                // 请求参数
                var item = this.data_list[this.selected_tabs_index] || null;
                if (item == null) {
                    app.globalData.showToast('开通时长有误');
                    return false;
                }
                var rules = (item['pay_period_rules'] || null) == null ? null : item['pay_period_rules'][this.selected_content_index] || null;
                if (rules == null) {
                    app.globalData.showToast('开通时长有误');
                    return false;
                }
                // 请求生成支付订单
                this.setData({
                    submit_disabled_status: true,
                });
                uni.showLoading({
                    title: '处理中...',
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
                            is_show_payment_popup: this.is_show_payment_popup ? false : true,
                            temp_pay_value: res.data.data.id,
                            pay_price: res.data.data.price,
                            payment_id: res.data.data.payment_user_id,
                        });
                        if (res.data.code == 0) {
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
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },
            // 打开url
            url_event(e) {
                app.globalData.url_event(e);
            },
            payment_popup_event_close() {
                this.setData({
                    is_show_payment_popup: false,
                });
            },
        },
    };
</script>
<style>
    @import './buy.css';
</style>
