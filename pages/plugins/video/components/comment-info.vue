<template> 
    <view class="flex-row align-s gap-10 wh-auto ht-auto"> 
        <image class="comment-avatar" :src="propComment.user.avatar" mode="aspectFill"></image>
        <view class="comment-info flex-col jc-c" @tap="comment_reply">
            <view class="flex-row jc-sb gap-10">
                <view class="comment-user">{{ propComment.user.user_name_view }}</view>
                <view @tap="option_comment">
                    <iconfont name="icon-ellipsis" color="#999" size="28rpx" />
                </view>
            </view>
            <view class="comment-text">{{ propComment.content }}</view>
            <view class="comment-images flex-row align-c gap-5">
                <view v-for="(item, index) in propComment.images" class="comment-image">
                    <image :src="item.url" :data-index="index" @tap="upload_show_event" mode="aspectFill" class="wh-auto ht-auto"></image>
                </view>
            </view>
            <view class="comment-operation flex-row align-c jc-sb">
                <view class="comment-operation-left flex-row align-c gap-10">
                    <view class="comment-time">{{ propComment.add_time }}</view>
                    <view class="comment-reply">{{ propReplyContent }}</view>
                </view>
                <view class="comment-operation-right flex-row align-c gap-5" @tap.stop="comment_like">
                    <iconfont name="icon-givealike-o-fine" :color="propComment.is_give_thumbs == 0 ? '#000' : '#F4B73F'" size="28rpx" />
                    <view class="comment-like-num">{{ propComment.give_thumbs_count || 0 }}</view>
                </view>
            </view>
            <slot name="sub-comment"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            propComment: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propId: {
                type: [String, Number],
                default: '',
            },
            propReplyContent: {
                type: String,
                default: '回复'
            }
        },
        methods: {
            // 回复
            comment_reply(e) {
                this.$emit('comment_reply', this.propId, e);
            },
            // 点赞
            comment_like(e) {
                this.$emit('comment_like', this.propId, e);
            },
            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.propComment.images[e.currentTarget.dataset.index].url,
                    urls: this.propComment.images.map(item => item.url),
                });
            },
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
    gap: 6rpx;
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
.comment-image {
    width: 50rpx;
    height: 50rpx;
}
</style>