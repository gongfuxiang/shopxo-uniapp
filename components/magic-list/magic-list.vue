<template>
    <view class="">
        <view v-for="(items, indexs) in hotData" :key="indexs" class="bg-white border-radius-main spacing-mb">
            <view class="padding-vertical-main" :style="(items.bg_images || null) !== null ? 'background-image: url(' + items.bg_images + ');background-size: auto 100%;' : ''">
                <view class="hot-list flex-row flex-warp">
                    <view v-for="(item, index) in items.data" :key="index" :class="items.data.length % 2 == 0 ? 'flex-width-half' : items.data.length === index + 1 ? 'wh-auto' : 'flex-width-half'">
                        <view class="padding-horizontal-main">
                            <view class="flex-row align-c margin-bottom-xs">
                                <text class="text-size fw-b single-text">{{ item.title }}</text>
                                <view class="hot-go margin-left-sm">
                                    <block v-if="(item.icon || null) !== null">
                                        <image :src="item.icon" mode="heightFix" class="ht-auto"> </image>
                                    </block>
                                </view>
                            </view>
                            <view class="cr-grey-9 text-size-xs margin-bottom-sm">{{ item.describe }}</view>
                            <swiper class="swiper" circular :autoplay="(item.rolling_time || null) !== null ? true : false" :vertical="propVertical" :interval="(item.rolling_time || null) !== null ? Number(item.rolling_time) * 1000 : '6000'" :duration="propDuration">
                                <swiper-item v-for="(swiperItem, swiperIndex) in item.data" :key="swiperIndex">
                                    <view class="swiper-item">
                                        <view class="flex-row">
                                            <view v-for="(listItem, listIndex) in swiperItem" :key="listIndex" :class="items.data.length % 2 == 0 ? 'flex-width-half' : items.data.length === index + 1 ? 'flex-width-half-2' : 'flex-width-half'">
                                                <view class="padding-main" :data-value="(listItem.goods_url || null) !== null ? listItem.goods_url : ''" @tap="url_event">
                                                    <image :src="(listItem.images || null) !== null ? listItem.images : ''" mode="widthFix" class="wh-auto border-radius-sm"> </image>
                                                    <view class="price">
                                                        <text class="sales-price va-m text-size-xss va-b">{{ currency_symbol }}</text>
                                                        <text class="sales-price va-m">{{ listItem.min_price }}</text>
                                                    </view>
                                                </view>
                                            </view>
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
    /* .hot-list > .flex-width-half:last-of-type {
        width: 100%;
        margin-bottom: 0;
    } */

    .hot-list .swiper {
        height: 214rpx;
    }

    .hot-go {
        height: 34rpx;
        line-height: 34rpx;
    }

    .flex-width-half-2 {
        width: 25%;
    }
</style>
