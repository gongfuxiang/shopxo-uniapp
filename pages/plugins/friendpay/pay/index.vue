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
                    <button v-if="is_pay_need_login == 1 && is_login == 0" class="bg-main cr-white round text-size wh-auto" type="default" hover-class="none" @tap="login_event">{{ $t('friendpay.login_to_pay') }}</button>
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
        ></component-payment>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/pages/common/components/payment/payment';
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
                is_pay_need_login: 0,
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

            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);

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
                                is_pay_need_login: parseInt(data.is_pay_need_login || 0),
                                data_list_loding_status: 3,
                            });
                            uni.setNavigationBarTitle({ title: this.pageTitle });
                            // 微信网页授权回跳后继续支付
                            this.continue_pay_after_weixin_auth();
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

            // 支付相关 URL 必须在拿到 token 后再拼，否则请求里 token 为空
            refresh_pay_urls() {
                this.setData({
                    pay_url: app.globalData.get_request_url('pay', 'pay', 'friendpay'),
                    pay_check_url: app.globalData.get_request_url('paycheck', 'pay', 'friendpay'),
                });
            },

            // 微信网页授权回跳后：仅在授权回跳时继续；先恢复用户/openid，再支付
            continue_pay_after_weixin_auth() {
                var key = app.globalData.data.cache_page_pay_key;
                var pay_data = uni.getStorageSync(key) || null;
                if (pay_data == null || (pay_data.order_ids || null) == null || (pay_data.payment_id || null) == null) {
                    return;
                }
                // #ifdef H5
                var launch = app.globalData.get_launch_cache_info() || null;
                // 无授权回跳标记：视为上次残留，清掉即可，切勿自动拉起支付（退出登录后再扫会因此死循环）
                if (launch == null || parseInt(launch.is_weixin_auth_web_openid || 0) != 1) {
                    uni.removeStorageSync(key);
                    return;
                }
                // 立刻清标记与待付缓存，防止 onShow/get_data 重复进入
                try {
                    launch.is_weixin_auth_web_openid = 0;
                    app.globalData.set_launch_cache_info(launch);
                } catch (e0) {}
                uni.removeStorageSync(key);
                // #endif
                // #ifndef H5
                // 非 H5 不走微信网页授权续付
                uni.removeStorageSync(key);
                return;
                // #endif

                var self = this;
                var do_pay = () => {
                    // 没有 openid 就停止，避免再次跳授权形成循环
                    var openid = app.globalData.get_user_cache_info('weixin_web_openid') || null;
                    if (openid == null || openid == '') {
                        return;
                    }
                    self.refresh_pay_urls();
                    self.setData({
                        payment_id: parseInt(pay_data.payment_id || 0),
                    });
                    if ((self.$refs.payment || null) != null) {
                        self.$refs.payment.pay_handle(pay_data.order_ids, pay_data.payment_id, self.payment_list);
                    }
                };
                // 先确保本地有 token（退出后为空；授权可能已把 openid 用户写进服务端 session）
                var after_user_ready = () => {
                    var user = app.globalData.get_user_cache_info() || null;
                    if (user != null && (user.weixin_web_openid || '') != '') {
                        do_pay();
                        return;
                    }
                    uni.request({
                        url: app.globalData.get_request_url('tokenuserinfo', 'user'),
                        method: 'POST',
                        data: {},
                        dataType: 'json',
                        success: (res) => {
                            if (res.data.code == 0 && (res.data.data || null) != null) {
                                uni.setStorageSync(app.globalData.data.cache_user_info_key, res.data.data);
                                self.setData({ is_login: 1 });
                            }
                            do_pay();
                        },
                        fail: () => {},
                    });
                };
                this.ensure_guest_payer(after_user_ready);
            },

            // 确认代付（无需登录时静默准备轻用户后再支付）
            pay_event() {
                if (this.payment_id <= 0) {
                    app.globalData.showToast(this.$t('common.select_payment_method'));
                    return;
                }
                if (this.is_pay_need_login == 1) {
                    if (this.is_login == 0) {
                        this.login_event();
                        return;
                    }
                    this.refresh_pay_urls();
                    if ((this.$refs.payment || null) != null) {
                        this.$refs.payment.pay_handle(this.id, this.payment_id, this.payment_list);
                    }
                    return;
                }
                this.ensure_guest_payer(() => {
                    this.refresh_pay_urls();
                    if ((this.$refs.payment || null) != null) {
                        this.$refs.payment.pay_handle(this.id, this.payment_id, this.payment_list);
                    }
                });
            },

            // 静默准备代付轻用户（写入本地 token；H5 微信内后续再网页授权绑定 openid）
            ensure_guest_payer(callback) {
                var user = app.globalData.get_user_cache_info() || null;
                if (user != null && (user.id || null) != null && (user.token || null) != null && user.token != '') {
                    this.setData({ is_login: 1 });
                    if (typeof callback === 'function') {
                        callback();
                    }
                    return;
                }
                var self = this;
                this.setData({ submit_disabled: true });
                uni.showLoading({ title: self.$t('common.auth_in_text') || '...' });

                // #ifdef MP
                // 小程序：uni.login → prepare
                var action = 'login';
                // #ifdef MP-BAIDU
                action = 'getLoginCode';
                // #endif
                uni[action]({
                    success: (login_res) => {
                        if (!login_res.code) {
                            uni.hideLoading();
                            self.setData({ submit_disabled: false });
                            app.globalData.showToast(self.$t('common.privilege_grant_failed'));
                            return;
                        }
                        self.request_prepare({ authcode: login_res.code }, callback);
                    },
                    fail: () => {
                        uni.hideLoading();
                        self.setData({ submit_disabled: false });
                        app.globalData.showToast(self.$t('common.privilege_grant_failed'));
                    },
                });
                return;
                // #endif

                // H5 / App：prepare 创建轻用户并落 token（无 authcode）
                self.request_prepare({}, callback);
            },

            // 调用代付 prepare 接口
            request_prepare(extra, callback) {
                var self = this;
                var post = Object.assign({ id: self.id }, extra || {});
                uni.request({
                    url: app.globalData.get_request_url('prepare', 'pay', 'friendpay'),
                    method: 'POST',
                    data: post,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        self.setData({ submit_disabled: false });
                        if (res.data.code == 0 && (res.data.data || {}).user && (res.data.data.user.token || '') != '') {
                            uni.setStorageSync(app.globalData.data.cache_user_info_key, res.data.data.user);
                            self.setData({ is_login: 1 });
                            if (typeof callback === 'function') {
                                callback();
                            }
                        } else {
                            app.globalData.showToast((res.data && res.data.msg) || self.$t('friendpay.link_error'));
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        self.setData({ submit_disabled: false });
                        app.globalData.showToast(self.$t('common.internet_error_tips'));
                    },
                });
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
