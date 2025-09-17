<template>
    <view class="wh-auto ht-auto flex-row align-c jc-c">
        <view class="more-history-btn cp flex-row align-c">
            <view class="more-history-btn-icon margin-right-xs">
                <iconfont name="icon-reset" size="28rpx" color="#999"></iconfont>
            </view>
            <text>加载中</text>
        </view>
    </view>
</template>

<script>
</script>

<style scoped lang="scss">
.more-history-btn {
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    line-height: 40rpx;
    margin-top: 40rpx;
}
.more-history-btn-icon {
    animation: rotate 1s linear infinite;
}
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>