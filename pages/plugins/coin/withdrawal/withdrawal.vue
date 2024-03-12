<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <view class="withdrawal">
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="title flex-col padding-lg">
                    <view class="margin-bottom-xxxl flex-row jc-sb margin-top-xl">
                        <view class="cr-white">
                            <view class="flex-row align-e margin-bottom-main">
                                <view class="flex-row align-c pr coin-dropdown" @tap="popup_coin_status_open_event">
                                    <image :src="coin_list[coin_index]['img']" mode="widthFix" class="coin-content-list-img round" />
                                    <text class="margin-left-xs">{{ coin_list[coin_index]['name'] }}</text>
                                    <view class="coin-dropdown-icon pa padding-left-xxl">
                                        <iconfont name="icon-arrow-bottom" size="24rpx" color="#fff"></iconfont>
                                    </view>
                                </view>
                                <view class="text-size-xs fw-b padding-left-main text">可提现金额</view>
                            </view>
                            <view class="flex-row align-e">
                                <view class="text-size-40 fw-b">{{ coin_num }}</view>
                                <view class="padding-left-sm margin-bottom-main cr-grey-d">$300.00</view>
                            </view>
                        </view>
                        <view class="detail pa right-0 fw-b cr-white" data-value="/pages/plugins/coin/withdrawal-detail/withdrawal-detail" @tap="url_event">提现明细</view>
                    </view>
                </view>
                <view class="content padding-main">
                    <view class="padding-xxxl bg-white radius-md margin-bottom-main">
                        <view class="margin-bottom-xxxl">
                            <view class="margin-bottom-main fw-b">提现数量</view>
                            <view class="padding-vertical-main br-b-e flex-row align-c">
                                <input type="digit" :value="input_coin_num" class="flex-1 flex-width" placeholder-class="text-size-md cr-grey-9" placeholder="请输入" />
                                <view @tap.stop="all_withdrawal_event">全部提现</view>
                            </view>
                        </view>
                        <view class="margin-bottom-xxxl">
                            <view class="margin-bottom-main">提币地址</view>
                            <view class="recharge-content-input-bg padding-main border-radius-sm flex-row align-c">
                                <view class="single-text padding-right-sm flex-1 flex-width">4gfgefg33445fghfghh4bfbfghebdfb34fgdfg44gfgefg33445fghfghh4bfbfghebdfb34fgdfg4</view>
                                <view @tap.stop="text_copy_event" data-value="123">
                                    <iconfont name="icon-copy" size="24rpx" color="#999"></iconfont>
                                </view>
                            </view>
                        </view>
                        <view>
                            <view class="margin-bottom-main">提币网络</view>
                            <picker class="content-input-bg padding-main margin-bottom-main border-radius-sm" @change="withdrawal_event" :value="withdrawal_web_index" :range="withdrawal_web_list" range-key="name">
                                <view class="picker arrow-bottom">
                                    {{ withdrawal_web_list[withdrawal_web_index]['name'] }}
                                </view>
                            </picker>
                            <view class="content-input-bg padding-main border-radius-sm">
                                <input type="text" class="" placeholder-class="text-size-md cr-grey-9" placeholder="请输入提现备注信息" />
                            </view>
                        </view>
                    </view>
                    <view class="padding-main bg-white radius-md">
                        <view class="padding-vertical-sm border-radius-sm flex-row align-c">
                            <text class="text-size fw-b">支付密码</text>
                            <view class="padding-left-lg">
                                <input type="digit" class="" placeholder-class="text-size-md cr-grey-9" placeholder="请输入支付密码" />
                            </view>
                        </view>
                    </view>
                    <view class="padding-xxxl">
                        <button type="default" class="withdrawal-btn cr-white round" @tap="apply_for_withdrawal_event">申请提现</button>
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

                // 虚拟币
                coin_num: 38000,
                input_coin_num: 0,

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
                withdrawal_web_index: 0,
                withdrawal_web_list: [
                    {
                        name: 'BTC',
                    },
                    {
                        name: 'USDT-polygon',
                    },
                ],
                // 充值金额
                withdrawal_price_list: [
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
            popup_coin_status_open_event() {
                this.setData({
                    popup_coin_status: !this.popup_coin_status,
                });
            },
            popup_coin_status_close_event() {
                this.setData({
                    popup_coin_status: false,
                });
            },

            // 充币网络切换
            withdrawal_event(e) {
                this.setData({
                    withdrawal_web_index: parseInt(e.detail.value || 0),
                });
            },

            // 全部提现
            all_withdrawal_event(e) {
                this.setData({
                    input_coin_num: this.coin_num,
                });
            },

            // 申请提现
            apply_for_withdrawal_event() {
                console.log('申请提现');
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },

            // 复制文本
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './withdrawal.css';
</style>
