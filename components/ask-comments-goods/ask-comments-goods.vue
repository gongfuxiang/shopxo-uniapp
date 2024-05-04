<template>
    <view :class="theme_view">
        <block v-if="(propData || null) != null && propData.length > 0">
            <view v-for="(item, index) in propData" :key="index" class="ask-comment-item">
                <view :data-value="item.url" @tap="url_event" class="flex-row cp">
                    <view class="title cr-white tc">{{$t('goods-list.goods-list.00n7i3')}}</view>
                    <view class="base-nav flex-1 flex-width margin-left-sm">
                        <view class="oh nav padding-bottom-sm">
                            <view class="flex-row jc-sb align-c">
                                <text class="va-m single-text flex-1 flex-width">{{ item.title || item.content }}</text>
                                <text class="cr-grey text-size-xs">{{$t('detail.detail.025362')}}{{ item.comments_count }}{{$t('ask-comments-goods.ask-comments-goods.xl51n6')}}</text>
                            </view>
                            <view v-if="(item.images || null) != null && item.images.length > 0" class="images oh margin-top-lg">
                                <block v-for="(iv, ix) in item.images" :key="ix">
                                    <image class="br radius margin-right-sm" @tap="comment_images_show_event" :data-index="index" :data-ix="ix" :src="iv" mode="aspectFit"></image>
                                </block>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </block>
        <block v-else>
            <view class="cr-grey-d tc spacing-mb flex-row jc-c align-c">
                <image :src="ask_static_url + 'no-ask.png'" mode="widthFix" class="no-ask margin-right-main" />{{$t('ask-comments-goods.ask-comments-goods.g6mc44')}}</view>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    var ask_static_url = app.globalData.get_static_url('ask', true) + 'app/';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                ask_static_url:ask_static_url,
            };
        },
        props: {
            propData: {
                type: Array,
                default: () => {
                    return [];
                },
            },
        },

        created: function () {},

        methods: {
            // 评价图片预览
            comment_images_show_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                uni.previewImage({
                    current: this.propData[index]["images"][ix],
                    urls: this.propData[index]["images"],
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style scoped>
    /**
     * 商品评价
    */
    .title {
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        background: #fd9525;
        border-radius: 4rpx;
    }
    .ask-comment-item {
        padding-bottom: 10rpx;
        margin-bottom: 20rpx;
    }
    .ask-comment-item .avatar {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        border: 1px solid #e2e2e2;
    }
    .ask-comment-item .base-nav {
        border-bottom: 2rpx solid #f5f5f5;
    }

    .ask-comment-item:last-of-type {
        margin-bottom: 0;
    }

    .ask-comment-item:last-of-type .base-nav {
        border: 0;
    }
    .no-ask {
        width: 174rpx;
    }
</style>
