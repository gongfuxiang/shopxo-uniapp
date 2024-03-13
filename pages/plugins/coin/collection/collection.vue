<template>
    <view :class="theme_view">
        <view class="collection">
            <view class="padding-main pr">
                <view class="padding-lg bg-white radius-md margin-bottom-main tc">
                    <image :src="wallet_static_url + 'user-head-bg.png'" mode="widthFix" class="img" />
                    <view class="code br-c radius flex-row">
                        <view class="num flex-1 flex-width flex-row align-c text-size-md">{{ code }}</view>
                        <view class="copy br-l-c text-size fw-b" :data-value="code" @tap.stop="text_copy_event">复制</view>
                    </view>
                </view>
                <view class="cr-grey-9 margin-top-xxl flex-row">
                    <view class="pr top-xs">
                        <iconfont name="icon-sigh-o" size="32rpx"></iconfont>
                    </view>
                    <text class="margin-left-sm text-size-xs">说出来的是你想的，做出来的是你说的，交出来的是你做的</text>
                </view>
            </view>
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

                code: '3453sdfsdf3254233453sdfsdf325423',
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
                    this.get_data();
                }
            },

            // 获取数据
            get_data() {},

            // 复制文本
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },
        },
    };
</script>
<style>
    @import './collection.css';
</style>
