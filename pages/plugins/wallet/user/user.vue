<template>
    <view>
        <scroll-view :scroll-y="true" class="scroll-box scroll-wallet" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="(data_base || null) != null" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 10) + 'px;'">
                <!-- 头部背景 -->
                <image :src="wallet_static_url + 'title-bg.png'" mode="widthFix" class="pa top-0 bg-img wh-auto wallet-bg" />
                <view class="pr z-i">
                    <!-- 返回 -->
                    <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
                    <view v-if="is_realstore_top_nav_back == 1" class="nav-back padding-horizontal-main padding-top-sm round va-m cr-white">
                        <iconfont name="icon-tongyong-fanhui" size="40rpx" @tap="top_nav_left_back_event"></iconfont>
                    </view>
                    <!-- #endif -->

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
                                <view class="pr z-i flex-row jc-c">
                                    <view class="flex-1 flex-width">
                                        <view>有效(元)</view>
                                        <text class="fw-b effective">{{ is_price_show ? user_wallet.normal_money || '0.00' : '***' }}</text>
                                        <view class="flex-row jc-sb align-c margin-top-main">
                                            <view class="flex-1">
                                                <view class="tetx-size-xs">冻结(元)</view>
                                                <text class="freeze">{{ is_price_show ? user_wallet.frozen_money || '0.00' : '***' }}</text>
                                            </view>
                                            <view class="flex-1">
                                                <view class="tetx-size-xs">赠送(元)</view>
                                                <text class="give">{{ is_price_show ? user_wallet.give_money || '0.00' : '***' }}</text>
                                            </view>
                                        </view>
                                    </view>
                                    <view class="is-price-show">
                                        <iconfont :name="is_price_show ? 'icon-wodeqianbao-eye' : 'icon-wodeqianbao-eyeclo2'" size="44rpx" @tap="price_change"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="padding-main padding-top-xxxl">
                        <!-- 导航 -->
                        <view v-if="nav_list.length > 0" class="nav oh margin-bottom-xl">
                            <view class="flex-row jc-sb align-c">
                                <block v-for="(item, index) in nav_list" :key="index">
                                    <view class="text-size fw-b" :data-index="index" @tap="nav_change">
                                        <view class="pr dis-inline-block">
                                            {{ item.title }}
                                            <view v-if="current === index" class="pa active" :style="'background: linear-gradient(90deg, ' + theme_color + ' 0%, rgba(255, 255, 255, 0.27) 100%)'"></view>
                                        </view>
                                    </view>
                                </block>
                            </view>
                        </view>
                        <!-- 明细 -->
                        <view class="nav-detail margin-bottom-lg">
                            <view v-if="current === 0">
                                <component-wallet-log :prop-pull-down-refresh="propPullDownRefresh" :prop-scroll-lower="scroll_lower_bool"></component-wallet-log>
                            </view>
                            <view v-if="current === 1">
                                <component-user-recharge :prop-pull-down-refresh="propPullDownRefresh" :prop-scroll-lower="scroll_lower_bool" @pay-success="pay_success_event"></component-user-recharge>
                            </view>
                            <view v-if="current === 2">
                                <component-user-cash :prop-pull-down-refresh="propPullDownRefresh" :prop-scroll-lower="scroll_lower_bool"></component-user-cash>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bottom-fixed bg-white submit-container flex-row jc-sb align-c">
                    <navigator v-if="(data_base || null) != null && (data_base.is_enable_recharge || 0) == 1" url="/pages/plugins/wallet/recharge/recharge" hover-class="none" class="sub-btn">
                        <button class="round cr-white bg-main br-main text-size wh-auto" type="default" hover-class="none">充值</button>
                    </navigator>
                    <navigator v-if="(data_base || null) != null && (data_base.is_enable_cash || 0) == 1" url="/pages/plugins/wallet/cash-auth/cash-auth" hover-class="none" class="sub-btn">
                        <button class="round cr-main bg-white br-main text-size wh-auto" type="default" hover-class="none">提现</button>
                    </navigator>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentWalletLog from '@/components/wallet/wallet-log/wallet-log';
    import componentUserRecharge from '@/components/wallet/user-recharge/user-recharge';
    import componentUserCash from '@/components/wallet/user-cash/user-cash';
    var wallet_static_url = app.globalData.get_static_url('wallet', true) + 'app/';

    export default {
        data() {
            return {
                wallet_static_url: wallet_static_url,
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                theme_color: app.globalData.get_theme_color(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                user_wallet: null,
                nav_list: [],
                submit_disabled_status: false,
                // 是否显示价格
                is_price_show: false,
                // 账户明细
                params: null,
                current: 0,
                propPullDownRefresh: false,
                scroll_lower_bool: false,
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentWalletLog,
            componentUserRecharge,
            componentUserCash,
        },
        props: {},

        onLoad(params) {
            // 是否指定状态
            if ((params.type || null) != null) {
                this.setData({
                    params: params,
                    current: Number(params.type),
                });
            }

            var ck = app.globalData.data.cache_page_pay_key;
            var pay_data = uni.getStorageSync(ck) || null;
            if (pay_data !== null) {
                uni.removeStorageSync(ck);
                this.setData({
                    current: pay_data.type || 0,
                });
                setTimeout(() => {
                    app.globalData.updateQueryStringParameter([{ key: 'type', value: pay_data.type }]);
                }, 200);
            }
            this.init();
        },

        onShow() {
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
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '绑定手机号码',
                            confirmText: '确认',
                            cancelText: '暂不',
                            success: (result) => {
                                uni.stopPullDownRefresh();
                                if (result.confirm) {
                                    uni.navigateTo({
                                        url: '/pages/login/login?event_callback=init',
                                    });
                                }
                            },
                        });
                    } else {
                        this.get_data();
                    }
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
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
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
                this.setData({
                    current: e.currentTarget.dataset.index || 0,
                });
                app.globalData.updateQueryStringParameter([{ key: 'type', value: e.currentTarget.dataset.index }]);
            },
            // 滚动加载
            scroll_lower(e) {
                this.setData({
                    scroll_lower_bool: !this.scroll_lower_bool,
                });
            },
            // 顶部返回操作
            top_nav_left_back_event(e) {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0],
                    });
                } else {
                    uni.navigateBack();
                }
            },
            // 支付成功回调
            pay_success_event() {
                this.get_data();
            },
        },
    };
</script>
<style scoped>
    @import './user.css';
</style>
