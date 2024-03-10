<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <view>
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="recharge-title flex-col padding-lg">
                    <view class="margin-bottom-xxxl flex-row jc-sb margin-top-xl">
                        <view class="cr-white">
                            <view class="coin-dropdown">
                                <view class="flex-row align-c pr" @tap="popup_coin_status = !popup_coin_status">
                                    <image :src="coin_list[coin_index]['img']" mode="widthFix" class="coin-content-list-img round" />
                                    <text class="margin-left-xs">{{ coin_list[coin_index]['name'] }}</text>
                                    <view class="coin-dropdown-icon pa padding-left-xxl">
                                        <iconfont name="icon-arrow-bottom" size="24rpx" color="#fff"></iconfont>
                                    </view>
                                </view>
                            </view>
                            <view class="text-size-40 fw-b">38000</view>
                        </view>
                        <view class="recharge-qrcode">
                            <iconfont name="icon-qrcode" size="160rpx"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="recharge-content padding-xxl bg-white">
                    <view class="margin-bottom-xxxl">
                        <view class="margin-bottom-main">充币地址</view>
                        <view class="recharge-content-input-bg padding-main border-radius-sm flex-row align-c">
                            <view class="single-text padding-right-sm flex-1 flex-width">4gfgefg33445fghfghh4bfbfghebdfb34fgdfg44gfgefg33445fghfghh4bfbfghebdfb34fgdfg4</view>
                            <view @tap.stop="text_copy_event" data-value="123">
                                <iconfont name="icon-copy" size="24rpx" color="#999"></iconfont>
                            </view>
                        </view>
                    </view>
                    <view class="margin-bottom-xxxl">
                        <view class="margin-bottom-main">充币网络</view>
                        <picker class="recharge-content-input-bg padding-main border-radius-sm" @change="recharge_event" :value="recharge_web_index" :range="recharge_web_list" range-key="name">
                            <view class="picker arrow-bottom">
                                {{ recharge_web_list[recharge_web_index]['name'] }}
                            </view>
                        </picker>
                    </view>
                    <view class="margin-bottom-xxxl">
                        <view class="margin-bottom-xs">选择充值金额</view>
                        <view class="flex-row flex-warp recharge-price-item margin-bottom-xs">
                            <view v-for="(item, index) in recharge_price_list" :key="index" class="recharge-price-list flex-col align-c jc-c">
                                <view class="flex-row align-c jc-c">
                                    <image :src="wallet_static_url + 'recharge-price.png'" mode="widthFix" class="recharge-price-img round" />
                                    <view class="margin-left-xs recharge-price-name">{{ item.name }}</view>
                                </view>
                                <view class="margin-top-sm cr-grey-9 text-size-xs">{{ item.price }}</view>
                            </view>
                        </view>
                        <view class="recharge-content-input-bg padding-main border-radius-sm flex-row align-c margin-bottom-xxl">
                            <text>其他数量</text>
                            <view class="padding-left-lg">
                                <input type="digit" class="" placeholder-class="text-size-md cr-grey-9" placeholder="请输入充值数量" />
                            </view>
                        </view>
                        <button type="default" class="recharge-btn cr-white round" @tap="popup_goods_search_event">立即充值</button>
                    </view>
                    <view class="margin-bottom-xxxl">
                        <view class="margin-bottom-main">充值说明：</view>
                        <view class="recharge-content-tips">
                            <view class="item pr padding-left-xl margin-bottom-sm cr-grey-9 text-size-xs">充值只可选择以上固定档位金额</view>
                            <view class="item pr padding-left-xl margin-bottom-sm cr-grey-9 text-size-xs">充值只可选择以上固定档位金额</view>
                            <view class="item pr padding-left-xl margin-bottom-sm cr-grey-9 text-size-xs">充值只可选择以上固定档位金额</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <!-- 虚拟币下拉框 -->
            <component-popup :propShow="popup_coin_status" propPosition="bottom" @onclose="popup_coin_status_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="oh">
                        <view class="fr" @tap.stop="popup_coin_status_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="popup_coin_status_container padding-vertical-main flex-col text-size">
                        <view class="scroll-y">
                            <view v-for="(item, index) in coin_list" :key="index" class="flex-row jc-sb align-c padding-vertical-main" :class="coin_list.length == index + 1 ? '' : 'br-b-f9'" :data-value="item" :data-index="index" @tap="coin_checked_event">
                                <view class="flex-row align-c">
                                    <image :src="item.img" mode="widthFix" class="coin-list-img round" />
                                    <view class="margin-left-sm text-size-md single-text">{{ item.name }}</view>
                                </view>
                                <view>
                                    <iconfont :name="coin_index === index ? 'icon-zhifu-yixuan cr-red' : 'icon-zhifu-weixuan'" size="36rpx"></iconfont>
                                </view>
                            </view>
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

                // 虚拟币下拉框探弹窗状态
                popup_coin_status: false,
                // 虚拟币下标
                coin_index: 0,
                // 虚拟币下拉框list
                coin_list: [
                    {
                        name: 'BTC',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'recharge-price.png',
                    },
                ],
                // 充币网络
                recharge_web_index: 0,
                recharge_web_list: [
                    {
                        name: 'BTC',
                    },
                    {
                        name: 'USDT-polygon',
                    },
                ],
                // 充值金额
                recharge_price_list: [
                    {
                        name: '100',
                        price: '100',
                    },
                    {
                        name: '400',
                        price: '400',
                    },
                    {
                        name: '400',
                        price: '400',
                    },
                    {
                        name: '400',
                        price: '400',
                    },
                    {
                        name: '400',
                        price: '400',
                    },
                ],
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
                this.setData({});
            },
            // 虚拟币切换
            coin_checked_event(e) {
                this.setData({
                    coin_index: parseInt(e.currentTarget.dataset.index || 0),
                    popup_coin_status: false,
                });
            },
            popup_coin_status_close_event() {
                this.setData({
                    popup_coin_status: false,
                });
            },
            // 充币网络切换
            recharge_event(e) {
                this.setData({
                    recharge_web_index: parseInt(e.detail.value || 0),
                });
            },
            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },

            // 复制文本
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },
        },
    };
</script>
<style>
    @import './recharge.css';
</style>
