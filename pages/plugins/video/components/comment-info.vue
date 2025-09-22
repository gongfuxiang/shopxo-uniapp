<template> 
    <view class="flex-row align-s gap-10 wh-auto ht-auto"> 
        <image class="comment-avatar" :src="propsComment.userHead" mode="aspectFill"></image>
        <view class="comment-info" @tap="comment_reply">
            <view class="comment-user">{{ propsComment.userNick }}</view>
            <view class="comment-text">{{ propsComment.content }}</view>
            <view class="comment-operation flex-row align-c jc-sb">
                <view class="comment-operation-left flex-row align-c gap-10">
                    <view class="comment-time">{{ propsComment.time }}</view>
                    <view class="comment-reply">{{ propsReplyContent }}</view>
                </view>
                <view class="comment-operation-right flex-row align-c gap-5" @tap.stop="comment_like">
                    <iconfont name="icon-givealike-o-fine" color="#000" size="28rpx" />
                    <view class="comment-like-num">{{ propsComment.likeNum || 0 }}</view>
                </view>
            </view>
            <slot name="sub-comment"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            propsComment: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propsid: {
                type: [String, Number],
                default: '',
            },
            propsReplyContent: {
                type: String,
                default: '回复'
            }
        },
        methods: {
            // 回复
            comment_reply() {
                this.$emit('comment_reply', this.propsid);
            },
            // 点赞
            comment_like() {
                this.$emit('comment_like', this.propsid);
            }
        }
    }   
</script>

<style lang="scss" scoped>
.comment-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
}
.comment-info {
    flex: 1;
    gap: 8rpx;
}
.comment-user {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
}

.comment-text {
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
}

.comment-time {
    font-size: 28rpx;
    color: #999999;
    line-height: 34rpx;
}
.comment-reply {
    font-weight: blod;
    font-size: 24rpx;
    color: #666666;
    line-height: 34rpx;
}
.comment-like-num {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
}
</style>