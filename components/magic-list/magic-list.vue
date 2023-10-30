<template>
    <view class="">
        <view v-for="(items, indexs) in hotData" :key="indexs" class="bg-white border-radius-main spacing-mb">
            <view class="padding-vertical-main" :style="(items.bg_images || null) !== null ? 'background-image: url(' + items.bg_images + ');background-size: auto 100%;' : ''">
                <view class="hot-list flex-row flex-warp">
                    <view v-for="(item, index) in items.data" :key="index" class="flex-width-half">
                        <view class="padding-horizontal-main">
                            <view class="flex-row align-c margin-bottom-xs">
                                <text class="text-size fw-b single-text">{{ item.title }}</text>
                                <view class="hot-go border-radius-main margin-left-sm pr single-text">
                                    <text class="cr-white padding-right-xs text-size-xs">{{ item.icon }}</text>
                                    <iconfont class="icon-index-xptj-jiantou cr-white" size="16rpx"></iconfont>
                                </view>
                            </view>
                            <view class="cr-grey-9 text-size-xs margin-bottom-sm">{{ item.describe }}</view>
                            <swiper class="swiper" circular :autoplay="false" :vertical="propVertical" :interval="propInterval" :duration="propDuration">
                                <swiper-item v-for="(swiperItem, swiperIndex) in item.data" :key="swiperIndex">
                                    <view class="swiper-item">
                                        <view class="flex-row">
                                            <view v-for="(listItem, listIndex) in swiperItem" :key="listIndex" class="flex-1" :class="swiperItem.length > 2 ? '' : 'flex-width-half'">
                                                <view class="padding-main" :data-value="(listItem.goods_url || null) !== null ? listItem.goods_url : ''" @tap="url_event">
                                                    <image :src="(listItem.images || null) !== null ? listItem.images : ''" mode="widthFix" class="wh-auto border-radius-sm"> </image>
                                                    <view class="price">
                                                        <text class="sales-price va-m text-size-xss va-b">{{ currency_symbol }}</text>
                                                        <text class="sales-price va-m">{{ listItem.min_price }}</text>
                                                    </view>
                                                </view>
                                            </view>
                                            <!-- <view class="flex-1 flex-width-half" @tap="banner_event">
                                                <view class="padding-main">
                                                    <image src="@/static/images/common/user.png" mode="widthFix" class="wh-auto"> </image>
                                                    <view class="price">
                                                        <text class="sales-price va-m text-size-xss va-b">¥</text>
                                                        <text class="sales-price va-m">8970.99</text>
                                                    </view>
                                                </view>
                                            </view> -->
                                        </view>
                                    </view>
                                </swiper-item>
                            </swiper>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    export default {
        name: 'recommend-hot',
        props: {
            propData: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propVertical: {
                type: Boolean,
                default: true,
            },
            propInterval: {
                type: Number,
                default: 6000,
            },
            propAutoplay: {
                type: Boolean,
                default: true,
            },
            propDuration: {
                type: Number,
                default: 1000,
            },
        },
        data() {
            return {
                hotData: [],
                currency_symbol: app.globalData.data.currency_symbol,
            };
        },
        mounted() {
            this.set_data(this.propData);
        },
        methods: {
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 轮播数据处理
            set_data(data) {
                let goods = data.goods;
                goods.forEach((items) => {
                    items.data.forEach((item, i) => {
                        let swiperData = [];
                        if (items.data.length % 2 == 0) {
                            // 偶数
                            swiperData = app.globalData.group_arry(item.goods_list, 2);
                        } else {
                            // 奇数
                            if (items.data.length === i + 1) {
                                swiperData = app.globalData.group_arry(item.goods_list, 4);
                            } else {
                                swiperData = app.globalData.group_arry(item.goods_list, 2);
                            }
                        }
                        item.data = swiperData;
                    });
                });
                this.setData({
                    hotData: goods,
                });
                console.log(goods);
            },
        },
    };
</script>

<style scoped>
    .hot-list > .flex-width-half {
        margin-bottom: 12rpx;
    }
    .hot-list > .flex-width-half:last-of-type {
        width: 100%;
        margin-bottom: 0;
    }

    .hot-list .swiper {
        height: 214rpx;
    }

    .hot-go {
        background: linear-gradient(90deg, #ff8f42 0%, #fe541e 100%);
        padding-left: 12rpx;
        padding-right: 34rpx;
        height: 34rpx;
        line-height: 34rpx;
    }

    .hot-go .iconfont {
        position: absolute;
        top: 0;
    }
</style>
