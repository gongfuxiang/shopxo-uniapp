<template>
    <view class="more-title flex-row align-c" @tap="comment_more_event">
        {{ propsText }}
        <view class="ml-3">
            <iconfont :name="propsIconName" color="#999" size="20rpx" />
        </view>
    </view>
</template>

<script> 
export default {
    props: {
        propsId: {
            type: [String, Number],
            default: '',
        },
        propsText: {
            type: String,
            default: '展开'
        },
        propsIconName: {
            type: String,
            default: 'icon-arrow-down'
        },
    },
    methods: {
        comment_more_event() {
            this.$emit('comment_more_event', this.propsId);
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