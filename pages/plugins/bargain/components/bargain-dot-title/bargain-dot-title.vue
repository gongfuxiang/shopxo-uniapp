<template>
    <view class="bargain-dot-title" :class="propClass">
        <view class="title-dot-deco title-dot-deco-left" aria-hidden="true">
            <view v-for="(item, index) in dot_list" :key="item" class="title-dot"></view>
        </view>
        <text class="title-text" :class="propTextClass">{{ propTitle }}</text>
        <view class="title-dot-deco title-dot-deco-right" aria-hidden="true">
            <view v-for="(item, index) in dot_list" :key="item" class="title-dot"></view>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            propTitle: {
                type: String,
                default: '',
            },
            propClass: {
                type: String,
                default: '',
            },
            propTextClass: {
                type: String,
                default: 'text-size-md',
            },
        },
        data() {
            return {
                dot_list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            };
        },
    };
</script>
<style scoped>
.bargain-dot-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24rpx;
    margin-bottom: 16rpx;
}
.bargain-dot-title .title-text {
    color: #333;
    font-weight: 500;
    line-height: 1.2;
    flex-shrink: 0;
}
.bargain-dot-title .title-dot-deco {
    display: grid;
    grid-template-columns: repeat(5, 9rpx);
    gap: 7rpx;
    flex-shrink: 0;
}
.bargain-dot-title .title-dot {
    width: 7rpx;
    height: 7rpx;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.12);
}
.bargain-dot-title .title-dot-deco-left .title-dot:nth-child(5n + 2) {
    background: rgba(0, 0, 0, 0.2);
}
.bargain-dot-title .title-dot-deco-left .title-dot:nth-child(5n + 3) {
    background: rgba(0, 0, 0, 0.3);
}
.bargain-dot-title .title-dot-deco-left .title-dot:nth-child(5n + 4) {
    background: rgba(0, 0, 0, 0.42);
}
.bargain-dot-title .title-dot-deco-left .title-dot:nth-child(5n) {
    background: rgba(0, 0, 0, 0.55);
}
.bargain-dot-title .title-dot-deco-right .title-dot:nth-child(5n + 1) {
    background: rgba(0, 0, 0, 0.55);
}
.bargain-dot-title .title-dot-deco-right .title-dot:nth-child(5n + 2) {
    background: rgba(0, 0, 0, 0.42);
}
.bargain-dot-title .title-dot-deco-right .title-dot:nth-child(5n + 3) {
    background: rgba(0, 0, 0, 0.3);
}
.bargain-dot-title .title-dot-deco-right .title-dot:nth-child(5n + 4) {
    background: rgba(0, 0, 0, 0.2);
}
</style>
