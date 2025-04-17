<template>
    <view :class="theme_view">
        <component-nav-back :propIsShowBack="true" :propName="$t('pages.plugins-wallet-user')"></component-nav-back>
        <block v-if="(data_base || null) != null">
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60" @scroll="scroll_event">
                <view class="page-bottom-fixed">
                    <view class="weixin-nav-padding-top">
                        <view class="padding-top-xxxl">
                            <!-- 头部背景 -->
                            <image :src="(default_images_data.default_center_head_bg_images_app || wallet_static_url + 'head-bg.png')" mode="widthFix" class="pa bg-img wh-auto" :class="status_bar_height > 0 ? 'top-0' : 'wallet-bg'" />
                            <view class="pr padding-top-main">
                                <!-- 钱包信息 -->
                                <view class="padding-top-xxxl oh margin-top-main">
                                    <view class="wallet-head padding-horizontal-xxxl">
                                        <!-- 用户中心公告 -->
                                        <view v-if="(data_base.user_center_notice || null) != null && data_base.user_center_notice.length > 0">
                                            <uni-notice-bar class="padding-0" show-icon scrollable :text="data_base.user_center_notice.join('')" background-color="transparent" color="#fff" />
                                        </view>
                                        <view class="content oh cr-white pr filter-blur">
                                            <view class="pa content-padding-1 oh filter-blur-child">
                                                <image :src="wallet_static_url + 'wallet-bg.png'" mode="widthFix" class="wh-auto wallet-child-bg" />
                                            </view>
                                            <view class="pr z-i flex-row jc-c align-s">
                                                <view class="flex-1 flex-width">
                                                    <view>{{$t('frequencycard-list.frequencycard-list.954ewh')}}</view>
                                                    <text class="fw-b effective">{{ is_price_show ? user_wallet.normal_money || '0.00' : '***' }}</text>
                                                </view>
                                                <view class="flex-row">
                                                    <view @tap="price_change">
                                                        <iconfont :name="is_price_show ? 'icon-wodeqianbao-eye' : 'icon-eye-half'" size="44rpx"></iconfont>
                                                    </view>
                                                    <view v-if="(data_base.is_enable_payment_code || 0) == 1" class="margin-left-xxxl" data-value="/pages/plugins/wallet/payment-code/payment-code" @tap="url_event">
                                                        <iconfont name="icon-qrcode" size="44rpx"></iconfont>
                                                    </view>
                                                </view>
                                            </view>
                                            <view class="pr z-i flex-row jc-c align-c">
                                                <view class="flex-1 flex-width flex-row jc-sb align-c margin-top-main">
                                                    <view class="flex-1">
                                                        <view class="tetx-size-xs">{{$t('user.user.mgx9x4')}}</view>
                                                        <text class="freeze">{{ is_price_show ? user_wallet.frozen_money || '0.00' : '***' }}</text>
                                                    </view>
                                                    <view class="flex-1">
                                                        <view class="tetx-size-xs">{{$t('user.user.424v6n')}}</view>
                                                        <text class="give">{{ is_price_show ? user_wallet.give_money || '0.00' : '***' }}</text>
                                                    </view>
                                                </view>
                                                <view v-if="(data_base || null) != null && (data_base.is_enable_transfer || 0) == 1" class="transfer-accounts cr-white va-m round flex-row align-c" data-value="/pages/plugins/wallet/transfer/transfer" @tap="url_event">
                                                    <iconfont name="icon-transfer" size="28rpx" propClass="transfer-icon"></iconfont>
                                                    <text class="margin-left-xs">{{$t('user.user.29f6n5')}}</text>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                                <view class="padding-main padding-top-xxxl">
                                    <!-- 导航 -->
                                    <view v-if="nav_list.length > 0" class="nav oh margin-bottom-xl">
                                        <view :class="'flex-row align-c '+(nav_list.length <= 3 ? 'gap-20' : 'jc-sb')">
                                            <block v-for="(item, index) in nav_list" :key="index">
                                                <view class="text-size fw-b" :data-value="item.control" @tap="nav_change">
                                                    <view class="pr dis-inline-block">
                                                        {{ item.title }}
                                                        <view v-if="current == item.control" class="pa active" :style="'background: linear-gradient(90deg, ' + theme_color + ' 0%, rgba(255, 255, 255, 0.27) 100%)'"></view>
                                                    </view>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                    <!-- 明细 -->
                                    <view class="nav-detail margin-bottom-lg">
                                        <view v-if="current == 'wallet'">
                                            <component-wallet-log :propPullDownRefresh="propPullDownRefresh" :propScrollLower="scroll_lower_bool"></component-wallet-log>
                                        </view>
                                        <view v-if="current == 'recharge'">
                                            <component-user-recharge :propPullDownRefresh="propPullDownRefresh" :propScrollLower="scroll_lower_bool" @pay-success="pay_success_event"></component-user-recharge>
                                        </view>
                                        <view v-if="current == 'cash'">
                                            <component-user-cash :propPullDownRefresh="propPullDownRefresh" :propScrollLower="scroll_lower_bool"></component-user-cash>
                                        </view>
                                        <view v-if="current == 'transfer'">
                                            <component-transfer :propPullDownRefresh="propPullDownRefresh" :propScrollLower="scroll_lower_bool"></component-transfer>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="bottom-fixed" :style="bottom_fixed_style">
                                <view class="bottom-line-exclude">
                                    <view class="flex-row jc-sb align-c gap-10">
                                        <button v-if="(data_base || null) != null && (data_base.is_enable_recharge || 0) == 1" class="item round cr-white bg-main br-main text-size wh-auto" type="default" hover-class="none" data-value="/pages/plugins/wallet/recharge/recharge" @tap="url_event">{{$t('recharge.recharge.otwkjn')}}</button>
                                        <button v-if="(data_base || null) != null && (data_base.is_enable_cash || 0) == 1" class="item round cr-main bg-white br-main text-size wh-auto" type="default" hover-class="none" data-value="/pages/plugins/wallet/cash-auth/cash-auth" @tap="url_event">{{$t('user.user.8752a4')}}</button>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentWalletLog from '../components/wallet-log/wallet-log';
    import componentUserRecharge from '../components/user-recharge/user-recharge';
    import componentUserCash from '../components/user-cash/user-cash';
    import componentTransfer from '../components/transfer/transfer';
    var wallet_static_url = app.globalData.get_static_url('wallet', true) + 'app/';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                wallet_static_url: wallet_static_url,
                theme_color: app.globalData.get_theme_color(),
                status_bar_height: bar_height,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                data_base: null,
                user_wallet: null,
                nav_list: [],
                default_images_data: {},
                submit_disabled_status: false,
                // 是否显示价格
                is_price_show: false,
                // 账户明细
                params: null,
                current: 'wallet',
                propPullDownRefresh: false,
                scroll_lower_bool: false,
                payment_page_url: null,
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentBottomLine,
            componentWalletLog,
            componentUserRecharge,
            componentUserCash,
            componentTransfer,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 是否指定状态
            if ((params.type || null) != null) {
                this.setData({
                    params: params,
                    current: params.type || 'wallet',
                });
            }

            var ck = app.globalData.data.cache_page_pay_key;
            var pay_data = uni.getStorageSync(ck) || null;
            if (pay_data !== null) {
                uni.removeStorageSync(ck);
                this.setData({
                    current: pay_data.type || 'wallet',
                });
                setTimeout(() => {
                    app.globalData.update_query_string_parameter([{ key: 'type', value: pay_data.type }]);
                }, 200);
            }
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
            this.get_data();
            this.setData({
                propPullDownRefresh: !this.propPullDownRefresh,
            });
        },
        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'user', 'wallet'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                user_wallet: data.user_wallet || null,
                                nav_list: data.nav_list || [],
                                default_images_data: data.default_images_data || {},
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
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
            price_change() {
                this.setData({
                    is_price_show: !this.is_price_show,
                });
            },
            // 明细导航切换
            nav_change(e) {
                var value = e.currentTarget.dataset.value || 'wallet';
                this.setData({
                    current: value,
                });
                app.globalData.update_query_string_parameter([{ key: 'type', value: value }]);
            },

            // 滚动加载
            scroll_lower(e) {
                this.setData({
                    scroll_lower_bool: !this.scroll_lower_bool,
                });
            },

            // 支付成功回调
            pay_success_event() {
                this.get_data();
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './user.css';
</style>
