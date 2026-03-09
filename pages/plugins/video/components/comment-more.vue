<template>
    <view class="more-title flex-row align-c" @tap="comment_more_event">
        <text class="more-title">{{ propText || $t('common.expand') }}</text>
        <view class="ml-5">
            <iconfont :name="propIconName" color="#999" size="20rpx" />
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
        propId: {
            type: [String, Number],
            default: '',
        },
        propText: {
            type: String,
            default: ''
        },
        propIsLevel: {
            type: Number,
            default: 1
        },
        propIconName: {
            type: String,
            default: 'icon-arrow-down'
        },
    },
    methods: {
        comment_more_event() {
            this.$emit('comment_more_event', this.propId, this.propIsLevel);
        }
    }
}   
</script>

<style lang="scss" scoped>
.more-title {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
    white-space: nowrap;
}
</style>