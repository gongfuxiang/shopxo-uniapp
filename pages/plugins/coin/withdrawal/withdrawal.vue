<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <view class="withdrawal">
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="title flex-col padding-lg">
                    <view class="margin-bottom-xxxl flex-row jc-sb margin-top-xl">
                        <view class="cr-white">
                            <view class="flex-row align-e margin-bottom-main">
                                <picker class="coin-dropdown text-size-md pr" @change="coin_event" :value="coin_index" :range="coin_list" range-key="name">
                                    <view class="picker pr">
                                        <text>{{ coin_list[coin_index]['name'] }}</text>
                                        <view class="coin-dropdown-icon pa padding-left-xxl">
                                            <iconfont name="icon-arrow-bottom" size="24rpx" color="#fff"></iconfont>
                                        </view>
                                    </view>
                                </picker>
                                <view class="text-size-xs fw-b padding-left-main text">可提现金额</view>
                            </view>
                            <view class="flex-row align-e">
                                <view class="text-size-40 fw-b">{{ coin_num }}</view>
                                <view class="padding-left-sm margin-bottom-main cr-grey-d">$300.00</view>
                            </view>
                        </view>
                        <view class="detail pa right-0 fw-b cr-white">提现明细</view>
                    </view>
                </view>
                <view class="content padding-main">
                    <view class="padding-xxxl bg-white radius-md">
                        <view class="margin-bottom-xxxl">
                            <view class="margin-bottom-main fw-b">提现数量</view>
                            <view class="padding-vertical-main br-b-e flex-row align-c">
                                <input type="digit" :value="input_coin_num" class="flex-1 flex-width" placeholder-class="text-size-sm cr-grey-9" placeholder="请输入" />
                                <view @tap.stop="all_withdrawal_event">全部提现</view>
                            </view>
                        </view>
                        <view class="margin-bottom-xxxl">
                            <view class="margin-bottom-main">提币地址</view>
                            <view class="recharge-content-input-bg padding-main border-radius-sm flex-row align-c">
                                <view class="single-text padding-right-sm flex-1 flex-width">4gfgefg33445fghfghh4bfbfghebdfb34fgdfg44gfgefg33445fghfghh4bfbfghebdfb34fgdfg4</view>
                                <view @tap.stop="text_copy_event">
                                    <iconfont name="icon-copy" size="24rpx" color="#999"></iconfont>
                                </view>
                            </view>
                        </view>
                        <view class="margin-bottom-xxxl">
                            <view class="margin-bottom-main">提币网络</view>
                            <picker class="content-input-bg padding-main margin-bottom-main border-radius-sm" @change="withdrawal_event" :value="withdrawal_web_index" :range="withdrawal_web_list" range-key="name">
                                <view class="picker arrow-bottom">
                                    {{ withdrawal_web_list[withdrawal_web_index]['name'] }}
                                </view>
                            </picker>
                            <input type="text" class="" placeholder-class="text-size-sm cr-grey-9" placeholder="请输入提现备注信息" />
                        </view>
                        <view class="margin-bottom-xxxl">
                            <view class="margin-bottom-xs">选择充值金额</view>
                            <view class="flex-row flex-warp price-item margin-bottom-xs">
                                <view v-for="(item, index) in withdrawal_price_list" :key="index" class="price-list flex-col align-c jc-c">
                                    <view class="flex-row align-c jc-c">
                                        <image :src="wallet_static_url + 'withdrawal-price.png'" mode="widthFix" class="price-img round" />
                                        <view>{{ item.name }}</view>
                                    </view>
                                    <view>{{ item.price }}</view>
                                </view>
                            </view>
                            <view class="content-input-bg padding-main border-radius-sm flex-row align-c margin-bottom-xxl">
                                <text>其他数量</text>
                                <view class="padding-left-lg">
                                    <input type="digit" class="" placeholder-class="text-size-sm cr-grey-9" placeholder="请输入充值数量" />
                                </view>
                            </view>
                            <button type="default" class="withdrawal-btn cr-white round" @tap="popup_goods_search_event">立即充值</button>
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

                // 虚拟币
                coin_num: 38000,
                input_coin_num: 0,

                // 虚拟币状态
                coin_index: 0,
                coin_list: [
                    {
                        name: 'BTC',
                    },
                    {
                        name: 'USDT-polygon',
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
            coin_event(e) {
                this.setData({
                    coin_index: parseInt(e.detail.value || 0),
                });
            },
            // 充币网络切换
            withdrawal_event(e) {
                this.setData({
                    withdrawal_web_index: parseInt(e.detail.value || 0),
                });
            },
            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },

            // 全部提现
            all_withdrawal_event(e) {
                this.setData({
                    input_coin_num: this.coin_num,
                });
            },
        },
    };
</script>
<style>
    @import './withdrawal.css';
</style>
