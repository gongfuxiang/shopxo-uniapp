<template>
    <view :class="theme_view">
        <view v-if="propNumber != 0" class="am-badge">
            <view :class="'am-badge-text ' + ((propNumber > 99) ? 'am-badge-text-max' : '')">
                <text>{{(propNumber > 99) ? '99+' : propNumber}}</text>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
            };
        },
        components: {},
        props: {
            propNumber: {
            	type: [Number,String],
            	default: 0
            }
        },
        methods: {}
    };
</script>
<style scoped>
    .am-badge {
        display: inline-block;
        position: relative;
        vertical-align: middle;
    }
    .am-badge-text {
        display: inline-block;
        position: absolute;
        right: 0;
        transform: translate(50%, -50%);
        top: 0;
        min-width: 28rpx;
        padding: 0;
        height: 28rpx;
        line-height: 28rpx;
        text-align: center;
        background-color: #FF3B30;
        border-radius: 40rpx;
        color: #fff;
        font-size: 20rpx;
        padding: 2rpx 2rpx;
        box-shadow: 0 0 10rpx rgb(0 0 0 / 30%);
    }
    .am-badge-text-max {
        padding: 2rpx 4rpx;
    }
</style>