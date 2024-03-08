
<template>
    <view :class="theme_view">
        <view>
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="padding-main pr">
                    <view class="padding-lg bg-white radius-md margin-bottom-main">
                        <view class="br-f5 margin-bottom-main radius-md padding-lg flex-row jc-sb">
                            <view>
                                <picker class="coin-dropdown text-size-md pr" @change="coin_event_old" :value="coin_index_old" :range="coin_list_old" range-key="name">
                                    <view class="picker pr">
                                        <view class="flex-row align-c">
                                            <image :src="coin_list_old[coin_index_old]['img']" mode="widthFix" class="coin-list-img round" />
                                            <span class="padding-left-sm flex-1 flex-width single-text">{{ coin_list_old[coin_index_old]['name'] }}</span>
                                        </view>
                                        <view class="coin-dropdown-icon pa padding-left-xxl">
                                            <iconfont name="icon-arrow-bottom" size="24rpx" color="#000"></iconfont>
                                        </view>
                                    </view>
                                </picker>
                                <view class="margin-top-main text-size-xs flex-row align-c"> <text class="margin-right-sm">余额:</text><text class="cr-blue">23.234</text> </view>
                            </view>
                            <view class="coin-num pr flex-col">
                                <input type="digit" class="num input-br text-size" placeholder-class="text-size-sm cr-grey-9" placeholder="金额" />
                                <view class="margin-top-main tr text-size-xs">$21.00</view>
                            </view>
                        </view>
                        <view class="coin-center-convert pa flex-row jc-c align-c" @tap="coin_center_convert_event">
                            <iconfont name="icon-convert2" class="pa convert-icon" :class="convert_bool ? 'convert_true' : 'convert_false'" color="#1D7DEF" size="36rpx"></iconfont>
                        </view>
                        <view class="br-f5 margin-bottom-main radius-md padding-lg flex-row jc-sb">
                            <view>
                                <picker class="coin-dropdown text-size-md pr" @change="coin_event_new" :value="coin_index_new" :range="coin_list_new" range-key="name">
                                    <view class="picker pr">
                                        <view class="flex-row align-c">
                                            <image :src="coin_list_new[coin_index_new]['img']" mode="widthFix" class="coin-list-img round" />
                                            <span class="padding-left-sm flex-1 flex-width single-text">{{ coin_list_new[coin_index_new]['name'] }}</span>
                                        </view>
                                        <view class="coin-dropdown-icon pa padding-left-xxl">
                                            <iconfont name="icon-arrow-bottom" size="24rpx" color="#000"></iconfont>
                                        </view>
                                    </view>
                                </picker>
                                <view class="margin-top-main text-size-xs flex-row align-c"> <text class="margin-right-sm">余额:</text><text class="cr-blue">23.234</text> </view>
                            </view>
                            <view class="coin-num pr flex-col">
                                <input type="digit" class="num text-size" placeholder-class="text-size-sm cr-grey-9" disabled placeholder="金额" />
                                <view class="margin-top-main tr text-size-xs">$21.00</view>
                            </view>
                        </view>
                        <view class="flex-row align-c">
                            <iconfont name="icon-recharge" color="#333" size="32rpx"></iconfont>
                            <view class="margin-left-sm">1XRP = 2.45546 <text class="cr-grey-9">($21.00)</text></view>
                        </view>
                    </view>
                    <view class="padding-main bg-white radius-md margin-bottom-xxxxl flex-row align-c">
                        <text class="padding-right">支付密码</text>
                        <input type="number" class="text-size flex-1 flex-width" placeholder-class="text-size-md cr-grey-9" placeholder="请输入支付密码" />
                    </view>
                    <view class="padding-main radius-md margin-bottom-main">
                        <button type="default" class="convert-btn cr-white round" @tap="popup_goods_search_event">立即转换</button>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
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

                // 虚拟币状态
                coin_index_old: 0,
                coin_list_old: [
                    {
                        name: 'BTC',
                        img: wallet_static_url + 'user-head-bg.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'user-head-bg.png',
                    },
                ],
                coin_index_new: 0,
                coin_list_new: [
                    {
                        name: 'BTC',
                        img: wallet_static_url + 'user-head-bg.png',
                    },
                    {
                        name: 'USDT-polygon',
                        img: wallet_static_url + 'user-head-bg.png',
                    },
                ],
                // 是否转换
                convert_bool: false,
            };
        },

        components: {
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

            // 虚拟币切换1
            coin_event_old(e) {
                this.setData({
                    coin_index_old: parseInt(e.detail.value || 0),
                });
            },

            // 虚拟币切换2
            coin_event_new(e) {
                this.setData({
                    coin_index_new: parseInt(e.detail.value || 0),
                });
            },

            // 虚拟货币调换
            coin_center_convert_event() {
                var old_index = this.coin_index_old;
                var new_index = this.coin_index_new;
                this.setData({
                    coin_index_new: old_index,
                    coin_index_old: new_index,
                    convert_bool: !this.convert_bool,
                });
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },
        },
    };
</script>
<style>
    @import './convert-detail.css';
</style>
