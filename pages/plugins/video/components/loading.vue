<template>
    <view class="wh-auto ht-auto flex-row align-c jc-c">
        <view class="more-history-btn cp flex-row align-c">
            <view class="more-history-btn-icon margin-right-xs">
                <u-icon propName="reset" propSize="28rpx" propColor="#999"></u-icon>
            </view>
            <text style="font-size: 28rpx;color: #999999; line-height: 40rpx;">{{ propContent || $t('common.loading_in_text') }}</text>
        </view>
    </view>
</template>

<script>
    //#ifdef APP-NVUE
    import i18n from '@/locale/index.js';
    //#endif
    export default {
        //#ifdef APP-NVUE
        i18n,
        //#endif
        props: {
            propContent: {
                type: String,
                default: ''
            }
        }
    }   
</script>

<style lang="scss" scoped>
.more-history-btn {
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    line-height: 40rpx;
    margin-top: 20rpx;
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