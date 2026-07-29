<template>
    <view class="more-title flex-row align-c overlay-content" @tap="comment_more_event">
        <text class="more-title">{{ propText || $t('common.expand') }}</text>
        <view class="ml-5">
            <!-- #ifdef APP-NVUE -->
            <component-u-icon :propName="propIconName" propColor="#999" propSize="20rpx"></component-u-icon>
            <!-- #endif -->
            <!-- #ifndef APP-NVUE -->
            <iconfont :name="'icon-' + propIconName" color="#999" size="20rpx"></iconfont>
            <!-- #endif -->
        </view>
    </view>
</template>

<script> 
//#ifdef APP-NVUE
import i18n from '@/locale/index.js';
//#endif
// #ifdef APP-NVUE
import componentUIcon from '@/pages/plugins/live/components/u-icon/u-icon';
// #endif
export default {
    //#ifdef APP-NVUE
    i18n,
    //#endif
    components: {
        // #ifdef APP-NVUE
        componentUIcon,
        // #endif
    },
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
            default: 'arrow-down'
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
    /* #ifndef APP-NVUE */
    white-space: nowrap;
    /* #endif */
}
</style>