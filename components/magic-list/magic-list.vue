<template>
    <view :class="theme_view">
        <view v-if="(data_goods_list || null) != null && data_goods_list.length > 0">
            <view v-for="(items, indexs) in data_goods_list" :key="indexs" class="bg-white border-radius-main spacing-mb">
                <view class="padding-vertical-main" :style="(items.bg_images || null) !== null ? 'background-image: url(' + items.bg_images + ');background-size: auto 100%;' : ''">
                    <view class="hot-list flex-row flex-warp">
                        <view v-for="(item, index) in items.data" :key="index" :class="items.data.length % 2 == 0 ? 'flex-width-half' : items.data.length === index + 1 ? 'wh-auto' : 'flex-width-half'">
                            <view class="padding-horizontal-main">
                                <view class="flex-row align-c margin-bottom-xs" :data-value="item.url" @tap="url_event">
                                    <text class="text-size fw-b single-text">{{ item.title }}</text>
                                    <view class="hot-go margin-left-sm">
                                        <block v-if="(item.icon || null) !== null">
                                            <image :src="item.icon" mode="heightFix" class="ht-auto"> </image>
                                        </block>
                                    </view>
                                </view>
                                <view class="cr-grey-9 text-size-xs margin-bottom-sm">{{ item.describe }}</view>
                                <swiper :class="items.data.length % 2 == 0 ? 'swiper-2' : items.data.length === index + 1 ? 'swiper-1' : 'swiper-2'" circular :autoplay="(item.rolling_time || null) !== null ? true : false" :vertical="propVertical" :interval="(item.rolling_time || null) !== null ? Number(item.rolling_time) * 1000 : '6000'" :duration="propDuration">
                                    <swiper-item v-for="(swiperItem, swiperIndex) in item.data" :key="swiperIndex">
                                        <view class="swiper-item">
                                            <view class="flex-row">
                                                <view v-for="(listItem, listIndex) in swiperItem" :key="listIndex" :class="items.data.length % 2 == 0 ? 'flex-width-half' : items.data.length === index + 1 ? 'flex-width-half-2' : 'flex-width-half'">
                                                    <view class="padding-horizontal-main tc" :data-value="(listItem.goods_url || null) !== null ? listItem.goods_url : ''" @tap="url_event">
                                                        <image :src="(listItem.images || null) !== null ? listItem.images : ''" mode="heightFix" class="swiper-img border-radius-sm"> </image>
                                                        <view class="price tc single-text">
                                                            <text class="sales-price va-m text-size-xss va-b">{{ propCurrencySymbol }}</text>
                                                            <text class="sales-price va-m text-size-xs">{{ listItem.min_price }}</text>
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
    </view>
</template>

<script>
    const app = getApp();
    export default {
        name: 'recommend-hot',
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_goods_list: [],
            };
        },
        props: {
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol(),
            },
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
        // 属性值改变监听
        watch: {
            // 数据
            propData(value, old_value) {
                this.set_data(value);
            }
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
                    data_goods_list: goods,
                });
            },
        },
    };
</script>

<style scoped>
    .hot-list > .flex-width-half {
        margin-bottom: 0;
    }
    .hot-list > .flex-width-half:nth-last-of-type(1),
    .hot-list > .flex-width-half:nth-last-of-type(2) {
        margin-bottom: 0;
    }
    .hot-list > .flex-width-half:nth-child(even) {
        position: relative;
    }

    .hot-list > .flex-width-half:nth-child(even)::before {
        content: '';
        height: 80%;
        width: 2rpx;
        border-left: 2rpx dashed #eeeeee;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    .hot-list .swiper-2 {
        height: 176rpx;
    }
    .hot-list .swiper-2 .swiper-img {
        height: 124rpx;
    }

    .hot-list .swiper-1 {
        height: 187rpx;
    }
    .hot-list .swiper-1 .swiper-img {
        height: 135rpx;
    }

    .hot-go {
        height: 34rpx;
        line-height: 34rpx;
    }

    .flex-width-half-2 {
        width: 25%;
    }
</style>
