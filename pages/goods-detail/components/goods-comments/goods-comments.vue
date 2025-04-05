<template>
    <view :class="theme_view">
        <block v-if="(propData || null) != null && propData.length > 0">
            <view v-for="(item, index) in propData" :key="index" class="goods-comment-item flex-row" :class="propClass">
                <image class="avatar dis-block margin-right-xs" :src="item.user.avatar || common_static_url + 'default-user.png'" mode="aspectFit"></image>
                <view class="base-nav flex-1 flex-width margin-left-sm" :class="propIsReply ? 'is-reply' : ''">
                    <view class="oh nav padding-bottom-sm">
                        <view class="">
                            <text class="va-m">{{ item.user.user_name_view }}</text>
                            <view class="dis-inline-block va-m margin-left-sm">
                                <uni-rate :value="item.rating" :readonly="true" :is-fill="false" :size="14" />
                            </view>
                            <view class="fr">
                                <text class="cr-grey text-size-xs">{{ item.add_time_date }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="base-content oh padding-vertical-sm">
                        <view class="content cr-base text-size-sm">{{ item.content }}</view>
                        <view v-if="(item.images || null) != null && item.images.length > 0" class="image-list oh margin-top-lg">
                            <block v-for="(iv, ix) in item.images" :key="ix">
                                <image class="image br radius" @tap="comment_images_show_event" :data-index="index" :data-ix="ix" :src="iv" mode="aspectFit"></image>
                            </block>
                        </view>
                        <view v-if="(item.msg || null) != null" class="spec cr-grey margin-top-lg">{{ item.msg }}</view>
                        <block v-if="propIsReply">
                            <view v-if="item.is_reply == 1 && (item.reply || null) != null" class="reply br-t-dashed margin-top-sm padding-top-sm text-size-sm">
                                <text class="cr-base">{{$t('goods-comments.goods-comments.s65197')}}</text>
                                <text class="reply-desc cr-main-pair">{{ item.reply }}</text>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </block>
        <block v-else>
            <view class="tc spacing-mb flex-row jc-c align-c margin-top-xxxxl">
                <image :src="common_static_url + 'no-comment.png'" mode="widthFix" class="no-comment margin-right-main" />
                <view class="cr-grey-d">{{$t('goods-comments.goods-comments.1p1r2e')}}</view>
            </view>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    var common_static_url = app.globalData.get_static_url('common');
    export default {
        props: {
            propData: {
                type: [Array,String],
                default: '',
            },
            // 是否需要显示管理员回复
            propIsReply: {
                type: Boolean,
                default: false,
            },
            // 额外样式控制
            propClass: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
            };
        },

        created: function () {},

        methods: {
            // 评价图片预览
            comment_images_show_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                uni.previewImage({
                    current: this.propData[index]['images'][ix],
                    urls: this.propData[index]['images'],
                });
            },
        },
    };
</script>
<style scoped>
    /**
     * 商品评价
    */
    .goods-comment-item {
        padding-bottom: 10rpx;
        margin-bottom: 20rpx;
    }
    .goods-comment-item .avatar {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        border: 1px solid #e2e2e2;
    }
    .goods-comment-item .base-nav {
        border-bottom: 2rpx solid #f5f5f5;
    }
    .goods-comment-item .base-nav.is-reply {
        border: 0;
    }

    .goods-comment-item:last-of-type {
        margin-bottom: 0;
    }
    .goods-comment-item:last-of-type .base-nav {
        border: 0;
    }
    .goods-comment-item .base-content .content,
    .goods-comment-item .base-content .reply {
        line-height: 46rpx;
    }
    .goods-comment-item .base-content .image-list .image {
        width: 100rpx;
        height: 100rpx;
    }
    .goods-comment-item .base-content .image-list .image:not(:last-child) {
        margin-right: 10rpx;
    }
    .no-comment {
        width: 174rpx;
    }
</style>
