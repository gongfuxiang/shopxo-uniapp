<template>
    <view class="bg-white pf top-0 left-0 right-0" :style="'padding-top:' + bar_height + 'rpx'">
        <view class="header-content flex-row">
            <view>返回</view>
            <view>这是头部</view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        data() {
            return {
                bar_height: bar_height,
            };
        },
        methods: {},
    };
</script>

<style lang="scss" scoped>
    .header-content {
        height: 120rpx;
        line-height: 120rpx;
    }
</style>
