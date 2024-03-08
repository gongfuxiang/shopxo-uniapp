<template>
    <view :class="theme_view">
        <view class="withdrawal">
            <view class="padding-main bg-white pr nav flex-row">
                <view class="flex-row align-c margin-right-main" @tap="popup_wallet_open_event">
                    <view>钱包</view>
                    <view class="padding-left-sm"><iconfont :name="popup_wallet_status ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx"></iconfont></view>
                </view>
                <view class="flex-row align-c margin-left-sm" @tap="popup_type_open_event">
                    <view>类型</view>
                    <view class="padding-left-sm"><iconfont :name="popup_type_status ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx"></iconfont></view>
                </view>
            </view>
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="padding-main">
                    <view class="padding-main bg-white radius-md">
                        <view class="br-b-dashed padding-bottom-main margin-bottom-main flex-row jc-sb align-c">
                            <view class="cr-grey-9">2023-09-20 15:12:35</view>
                            <view>未打款</view>
                        </view>
                        <view>
                            <view class="margin-bottom-sm flex-row">
                                <text class="cr-grey-9">提现单号：</text>
                                <text class="fw-b">202330303030303030</text>
                            </view>
                            <view class="flex-row">
                                <text class="cr-grey-9">提现金额：</text>
                                <text class="fw-b">2190.00</text>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <!-- 钱包 -->
            <component-popup :propShow="popup_wallet_status" propPosition="top" :propTop="popup_top_height + 'px'" @onclose="popup_wallet_close_event">
                <view class="padding-vertical-lg">
                    <view class="padding-horizontal-main text-size-xs">钱包种类</view>
                    <view class="popup_wallet_container padding-sm flex-row flex-warp align-c tc text-size-md">
                        <view v-for="(item, index) in wallet_list" class="flex-width-half-half">
                            <view class="item margin-sm padding-vertical-sm" :class="wallet_list_index === index ? 'cr-main bg-main-light' : ''" :data-index="index" @tap="wallet_event">{{ item.name }}</view>
                        </view>
                    </view>
                    <view class="tc padding-top-lg br-t" @tap="popup_wallet_close_event">
                        <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                        <iconfont name="icon-arrow-top" color="#ccc"></iconfont>
                    </view>
                </view>
            </component-popup>
            <!-- 类型 -->
            <component-popup :propShow="popup_type_status" propPosition="top" :propTop="popup_top_height + 'px'" @onclose="popup_type_close_event">
                <view class="padding-vertical-lg">
                    <view class="padding-horizontal-main text-size-xs">提现类型</view>
                    <view class="popup_wallet_container padding-sm flex-row flex-warp align-c tc text-size-md">
                        <view v-for="(item, index) in type_list" class="flex-width-half-half">
                            <view class="item margin-sm padding-vertical-sm" :class="type_list_index === index ? 'cr-main bg-main-light' : ''" :data-index="index" @tap="type_event">{{ item.name }}</view>
                        </view>
                    </view>
                    <view class="tc padding-top-lg br-t" @tap="popup_type_close_event">
                        <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                        <iconfont name="icon-arrow-top" color="#ccc"></iconfont>
                    </view>
                </view>
            </component-popup>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';
    var wallet_static_url = app.globalData.get_static_url('coin', true) + 'app/';
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

                // 弹窗距离顶部距离
                popup_top_height: 0,

                // 钱包
                popup_wallet_status: false,
                wallet_list_index: 0,
                wallet_list: [
                    {
                        name: '全部',
                    },
                    {
                        name: 'BTC',
                    },
                    {
                        name: 'ETH',
                    },
                    {
                        name: 'XRP',
                    },
                    {
                        name: 'DASH',
                    },
                ],
                // 类型
                popup_type_status: false,
                type_list_index: 0,
                type_list: [
                    {
                        name: '全部',
                    },
                    {
                        name: '未打款',
                    },
                    {
                        name: '已打款',
                    },
                    {
                        name: '打款失败',
                    },
                ],
            };
        },

        components: {
            componentNoData,
            componentPopup,
        },
        props: {},

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();

            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                    } else {
                        this.get_data();
                        var self = this;
                        var timer = setInterval(function () {
                            if (self.popup_top_height == 0) {
                                self.popup_top_height_computer();
                            } else {
                                clearInterval(timer);
                            }
                        }, 500);
                    }
                }
            },

            // 获取数据
            get_data() {},

            // 钱包打开
            popup_wallet_open_event() {
                if (!this.popup_type_status) {
                    this.setData({
                        popup_wallet_status: !this.popup_wallet_status,
                    });
                }
            },

            // 钱包关闭
            popup_wallet_close_event() {
                this.setData({
                    popup_wallet_status: false,
                });
            },

            // 钱包选择
            wallet_event(e) {
                this.setData({
                    wallet_list_index: e.currentTarget.dataset.index,
                });
            },

            // 类型打开
            popup_type_open_event() {
                if (!this.popup_wallet_status) {
                    this.setData({
                        popup_type_status: !this.popup_type_status,
                    });
                }
            },

            // 类型关闭
            popup_type_close_event() {
                this.setData({
                    popup_type_status: false,
                });
            },

            // 类型选择
            type_event(e) {
                this.setData({
                    type_list_index: e.currentTarget.dataset.index,
                });
            },

            // 计算搜索框的高度
            popup_top_height_computer() {
                const query = uni.createSelectorQuery();
                query
                    .select('.nav')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            // 获取搜索框高度
                            this.setData({
                                popup_top_height: res.height,
                            });
                        }
                    })
                    .exec();
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },
        },
    };
</script>
<style>
    @import './withdrawal-detail.css';
</style>
