<template>
    <view :class="theme_view">
        <view v-if="(friendpay || null) != null" class="page-bottom-fixed">
            <view class="padding-main">
                <!-- 基础信息 + 商品 -->
                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="tc fw-b text-size">{{ pageTitle }}</view>
                    <view v-if="has_buyer_name" class="flex-row align-c jc-c margin-top-main cr-grey text-size-sm">
                        <image :src="buyer_avatar" mode="aspectFill" class="buyer-avatar circle margin-right-sm"></image>
                        <view>{{ invite_text_plain || buyer_invite_fallback }}</view>
                    </view>
                    <view class="tc margin-top-sm">
                        <text class="cr-grey">{{ $t('friendpay.pay_amount') }}</text>
                        <text class="sales-price text-size-xl margin-left-sm">{{ currency_symbol }}{{ order_total_price }}</text>
                    </view>
                    <component-friendpay-goods-list :propGoodsList="order_goods_list"></component-friendpay-goods-list>
                </view>
                <!-- 支付方式 -->
                <view v-if="payment_list.length > 0" class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="fw-b text-size-sm">{{ $t('friendpay.select_payment') }}</view>
                    <view v-for="(item, index) in payment_list" :key="index" class="flex-row jc-sb align-c padding-vertical-sm" @tap="payment_event" :data-value="item.id">
                        <view class="flex-row align-c flex-1 flex-width">
                            <image v-if="(item.logo || null) != null" :src="item.logo" mode="widthFix" class="pay-icon margin-right-sm"></image>
                            <text>{{ item.name }}</text>
                            <text v-if="(item.tips || null) != null" class="cr-red text-size-xs margin-left-sm">（{{ item.tips }}）</text>
                        </view>
                        <iconfont :name="payment_id == item.id ? 'icon-selected-solid' : 'icon-not-selected'" size="40rpx" :color="payment_id == item.id ? theme_color : '#ccc'"></iconfont>
                    </view>
                </view>
            </view>
            <view class="bottom-fixed" :style="bottom_fixed_style">
                <view class="bottom-line-exclude padding-main">
                    <button v-if="is_login == 0" class="bg-main cr-white round text-size wh-auto" type="default" hover-class="none" @tap="login_event">{{ $t('friendpay.login_to_pay') }}</button>
                    <button v-else class="bg-main cr-white round text-size wh-auto" type="default" hover-class="none" :disabled="submit_disabled" @tap="pay_event">{{ $t('friendpay.confirm_pay') }}</button>
                </view>
            </view>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
        <component-payment
            ref="payment"
            :propPayUrl="pay_url"
            :propQrcodeUrl="pay_check_url"
            propPayDataKey="id"
            propQrcodeDataKey="id"
            :propQrcodePayValue="id"
            :propPaymentList="payment_list"
            :propTempPayValue="id"
            :propPaymentId="payment_id"
            :propIsRedirectTo="true"
            :propToPage="success_page_full"
            :propToAppointPage="success_page_full"
        ></component-payment>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';
    import componentFriendpayGoodsList from '@/pages/plugins/friendpay/components/goods-list/goods-list';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        components: {
            componentCommon,
            componentNoData,
            componentPayment,
            componentFriendpayGoodsList,
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                currency_symbol: app.globalData.currency_symbol(),
                default_avatar: app.globalData.data.default_user_head_src,
                bottom_fixed_style: '',
                params: {},
                id: '',
                friendpay: null,
                order_data: null,
                payment_list: [],
                payment_id: 0,
                page_text: {},
                invite_text_plain: '',
                is_login: 0,
                submit_disabled: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                pay_url: '',
                pay_check_url: '',
                success_page: '/pages/plugins/friendpay/pay/success',
            };
        },
        computed: {
            // 页面标题
            pageTitle() {
                return (this.page_text.pay_page_title || this.$t('friendpay.pay_page_title'));
            },
            // 支付成功页地址
            success_page_full() {
                return '/pages/plugins/friendpay/pay/success?id=' + encodeURIComponent(this.id || '');
            },
            // 买家头像
            buyer_avatar() {
                var avatar = ((this.order_data || {}).buyer_avatar || '').trim();
                return avatar != '' ? avatar : this.default_avatar;
            },
            // 邀请文案兜底
            buyer_invite_fallback() {
                var name = (this.order_data || {}).buyer_name || '';
                return this.$t('friendpay.invite_fallback_pay').replace('${name}', name);
            },
            // 是否展示下单人信息
            has_buyer_name() {
                var order_data = this.order_data;
                return order_data != null && (order_data.buyer_name || '') != '';
            },
            // 代付金额
            order_total_price() {
                var order_data = this.order_data;
                return order_data != null ? (order_data.total_price || '') : '';
            },
            // 商品列表
            order_goods_list() {
                var order_data = this.order_data;
                return order_data != null ? (order_data.goods_list || []) : [];
            },
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            this.setData({
                params: params,
                id: params.id || params.i || '',
                pay_url: app.globalData.get_request_url('pay', 'pay', 'friendpay'),
                pay_check_url: app.globalData.get_request_url('paycheck', 'pay', 'friendpay'),
            });
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 获取数据
            this.get_data();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            // 获取数据
            get_data() {
                if ((this.id || '') == '') {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('friendpay.link_error'),
                    });
                    return;
                }
                this.setData({
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                });
                uni.request({
                    url: app.globalData.get_request_url('index', 'pay', 'friendpay'),
                    method: 'POST',
                    data: { id: this.id },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var payment_list = data.payment_list || [];
                            var payment_id = payment_list.length > 0 ? payment_list[0].id : 0;
                            this.setData({
                                friendpay: data.friendpay || null,
                                order_data: data.order_data || null,
                                payment_list: payment_list,
                                payment_id: payment_id,
                                page_text: data.page_text || {},
                                invite_text_plain: data.invite_text_plain || '',
                                is_login: parseInt(data.is_login || 0),
                                data_list_loding_status: 3,
                            });
                            uni.setNavigationBarTitle({ title: this.pageTitle });
                        } else {
                            if (res.data.code == -400) {
                                app.globalData.is_login_check(res.data, this, 'get_data');
                                return;
                            }
                            this.setData({
                                friendpay: null,
                                order_data: null,
                                payment_list: [],
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg || '',
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            friendpay: null,
                            order_data: null,
                            payment_list: [],
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 支付方式选择
            payment_event(e) {
                this.payment_id = parseInt(e.currentTarget.dataset.value || 0);
            },

            // 登录
            login_event() {
                app.globalData.url_open('/pages/login/login');
            },

            // 确认代付
            pay_event() {
                if (this.payment_id <= 0) {
                    app.globalData.showToast(this.$t('common.select_payment_method'));
                    return;
                }
                if ((this.$refs.payment || null) != null) {
                    this.$refs.payment.pay_handle(this.id, this.payment_id, this.payment_list);
                }
            },
        },
    };
</script>
<style scoped>
    .page-bottom-fixed {
        padding-bottom: 180rpx !important;
    }
    .buyer-avatar {
        width: 60rpx;
        height: 60rpx;
        flex-shrink: 0;
    }
    .pay-icon {
        width: 50rpx;
        height: 50rpx;
    }
</style>
