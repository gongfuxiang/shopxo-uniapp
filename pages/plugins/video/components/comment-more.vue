<template>
    <view class="more-title flex-row align-c" @tap="comment_more_event">
        {{ propText }}
        <view class="ml-3">
            <iconfont :name="propIconName" color="#999" size="20rpx" />
        </view>
    </view>
</template>

<script> 
export default {
    props: {
        propId: {
            type: [String, Number],
            default: '',
        },
        propText: {
            type: String,
            default: '展开'
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
.ml-3 {
    margin-left: 6rpx;
}
.more-title {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
    white-space: nowrap;
}
</style>