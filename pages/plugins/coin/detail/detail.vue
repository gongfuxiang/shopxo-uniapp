<template>
    <view :class="theme_view">
        <component-nav-back propName="BTC详情"></component-nav-back>
        <view>
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="coin-title flex-col padding-lg">
                    <view class="margin-bottom-xxxxl margin-top-xl padding-bottom-main flex-row jc-sb align-c">
                        <view class="flex-row">
                            <image :src="coin_list[coin_index]['img']" mode="widthFix" class="coin-content-list-img round" />
                            <view class="padding-left-main">
                                <picker class="coin-dropdown text-size-md pr margin-bottom-xs" @change="coin_event" :value="coin_index" :range="coin_list" range-key="name">
                                    <view class="picker flex-row">
                                        <text class="cr-666">{{ coin_list[coin_index]['name'] }}</text>
                                        <view class="padding-left-sm">
                                            <iconfont name="icon-arrow-bottom" size="24rpx" color="#666"></iconfont>
                                        </view>
                                    </view>
                                </picker>
                                <view class="fw-b text-size">{{ is_price_show ? '5410.00' : '***' }}</view>
                            </view>
                        </view>
                        <view @tap="price_change">
                            <iconfont :name="is_price_show ? 'icon-wodeqianbao-eye' : 'icon-wodeqianbao-eyeclo2'" size="44rpx"></iconfont>
                        </view>
                    </view>
                    <view class="flex-row jc-sb">
                        <view v-for="(item, index) in coin_oprate_list" class="flex-1 padding-sm tc text-size-md" :key="index" :data-value="item.url" :data-method="item.method" @tap="url_event">
                            <view class="coin-oprate-list bg-white flex-row align-c jc-c">
                                <view class="pr top-xs">
                                    <iconfont :name="item.icon" size="28rpx" color="#635BFF"></iconfont>
                                </view>
                                <view class="margin-left-sm fw-b">{{ item.name }}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="coin-content padding-lg">
                    <view v-for="(item, index) in coin_data" :key="index" class="bg-white radius-md padding-main margin-bottom-main">
                        <view class="br-b-dashed padding-bottom-main margin-bottom-main flex-row jc-sb align-c">
                            <view>消费</view>
                            <view class="cr-grey-9">2023-09-20 15:12:35</view>
                        </view>
                        <view>
                            <view class="margin-bottom-sm flex-row">
                                <text class="cr-grey-9">金额类型：</text>
                                <text class="fw-b">有效</text>
                            </view>
                            <view class="margin-bottom-sm flex-row">
                                <text class="cr-grey-9">操作金额：</text>
                                <text class="fw-b">2190.00</text>
                            </view>
                            <view class="margin-bottom-sm flex-row">
                                <text class="cr-grey-9">原始金额：</text>
                                <text class="fw-b">1500.00</text>
                            </view>
                            <view class="flex-row">
                                <text class="cr-grey-9">最新金额：</text>
                                <text class="fw-b">1500.00</text>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <!-- 明细 -->
            <component-popup :propShow="popup_user_detail_status" propPosition="bottom" @onclose="popup_user_detail_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="oh">
                        <text class="text-size">明细</text>
                        <view class="fr" @tap.stop="popup_user_detail_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="popup_user_detail_container padding-vertical-main flex-row flex-warp align-c tc text-size">
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/transfer-accounts-detail/transfer-accounts-detail" @tap="url_event">转账明细</view>
                        </view>
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/transaction-detail/transaction-detail" @tap="url_event">交易明细</view>
                        </view>
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/withdrawal-detail/withdrawal-detail" @tap="url_event">提现明细</view>
                        </view>
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/convert-detail/convert-detail" @tap="url_event">转换明细</view>
                        </view>
                    </view>
                </view>
            </component-popup>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNavBack from '@/components/nav-back/nav-back';
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
                status_bar_height: bar_height,

                // 是否显示虚拟币
                is_price_show: false,
                // 虚拟币操作列表
                coin_oprate_list: [
                    {
                        name: '充值',
                        icon: 'icon-transfer-count',
                        url: '/pages/plugins/coin/recharge/recharge',
                    },
                    {
                        name: '收款',
                        icon: 'icon-collection',
                        url: '/pages/plugins/coin/convert/convert',
                    },
                    {
                        name: '明细',
                        icon: 'icon-detail',
                        url: '',
                        method: true,
                    },
                ],
                coin_data: [
                    {
                        img: wallet_static_url + 'user-head-bg.png',
                        name: 'BTC',
                        price: '¥20000',
                        num: '200000',
                    },
                ],

                // 虚拟币
                coin_index: 0,
                coin_list: [
                    {
                        name: 'BTC',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                ],
                // 明细弹窗
                popup_user_detail_status: false,
            };
        },

        components: {
            componentNavBack,
            componentNoData,
            componentPopup,
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

            // 虚拟币切换
            coin_event(e) {
                this.setData({
                    coin_index: parseInt(e.detail.value || 0),
                });
            },

            // 明细弹窗打开
            popup_user_detail_open_event() {
                this.setData({
                    popup_user_detail_status: true,
                });
            },
            // 明细弹窗关闭
            popup_user_detail_close_event(e) {
                this.setData({
                    popup_user_detail_status: false,
                });
            },

            // url事件
            url_event(e) {
                console.log(e);
                if (e.currentTarget.dataset.method) {
                    this.popup_user_detail_open_event();
                } else {
                    app.globalData.url_event(e);
                }
            },
        },
    };
</script>
<style>
    @import './detail.css';
</style>
