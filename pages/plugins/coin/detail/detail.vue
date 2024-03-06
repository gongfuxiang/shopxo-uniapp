<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <view>
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="coin-title flex-col padding-lg" :style="'background-image:url(' + wallet_static_url + 'title-bg.png)'">
                    <view class="margin-bottom-main flex-row jc-sb align-c margin-top-xl">
                        <view>
                            <view class="cr-base text-size-md">总数量</view>
                            <view class="text-size-40 fw-b">{{ is_price_show ? '5410.00' : '***' }}</view>
                        </view>
                        <view @tap="price_change">
                            <iconfont :name="is_price_show ? 'icon-wodeqianbao-eye' : 'icon-wodeqianbao-eyeclo2'" size="44rpx"></iconfont>
                        </view>
                    </view>
                    <view class="flex-row jc-sb padding-bottom-main">
                        <view v-for="(item, index) in coin_oprate_list" class="tc text-size-xs" :key="index" :data-value="item.url" @tap="url_event">
                            <view class="coin-oprate-list bg-white flex-row align-c jc-c margin-bottom-main">
                                <iconfont :name="item.icon" size="44rpx" color="#635BFF"></iconfont>
                            </view>
                            <view>{{ item.name }}</view>
                        </view>
                    </view>
                </view>
                <view class="coin-content padding-lg">
                    <view class="bg-white radius-lg padding-lg">
                        <view v-for="(item, index) in coin_data" :key="index" class="flex-row jc-sb align-c" :class="coin_data.length == index + 1 ? '' : 'br-b-f5 margin-bottom-lg padding-bottom-lg'">
                            <view class="flex-1 flex-width flex-row align-c padding-right-main">
                                <image :src="item.img" mode="widthFix" class="coin-content-list-img round" />
                                <text class="fw-b single-text margin-left-main">{{ item.name }}</text>
                            </view>
                            <view class="flex-col">
                                <view class="margin-bottom-xss">{{ item.num }}</view>
                                <view class="cr-grey-9">{{ item.price }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
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
                status_bar_height: bar_height,

                // 是否显示虚拟币
                is_price_show: false,
                // 虚拟币操作列表
                coin_oprate_list: [
                    {
                        name: '充值',
                        icon: 'icon-recharge',
                        url: '/pages/plugins/coin/recharge/recharge',
                    },
                    {
                        name: '转换',
                        icon: 'icon-convert',
                        url: '/pages/plugins/coin/convert/convert',
                    },
                    {
                        name: '提现',
                        icon: 'icon-withdrawal',
                        url: '/pages/plugins/coin/withdrawal/withdrawal',
                    },
                    {
                        name: '明细',
                        icon: 'icon-detail',
                        url: '/pages/plugins/coin/detail/detail',
                    },
                ],
                coin_data: [
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                    {
                        img: wallet_static_url + 'title-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                ],
            };
        },

        components: {
            componentNavBack,
            componentNoData,
        },
        props: {},

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();
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
                    }
                }
            },

            // 获取数据
            get_data() {},

            // 显示隐藏虚拟币
            price_change() {
                this.setData({
                    is_price_show: !this.is_price_show,
                });
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
    @import './detail.css';
</style>
