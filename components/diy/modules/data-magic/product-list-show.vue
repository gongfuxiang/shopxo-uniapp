<template>
    <view v-if="propOuterflex == 'row'" class="w h">
        <view class="flex-row gap-10 align-c w h">
            <template v-if="propFlex === 'row'">
                <view v-for="(item, index) in propValue" :key="index" class="flex-row gap-10 half-width ht-auto" :data-index="index" :data-value="item.goods_url" @tap="url_event">
                    <template v-if="!isEmpty(item.new_cover)">
                        <view class="w h">
                            <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <template v-else>
                        <view class="w h">
                            <imageEmpty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <view v-if="!isEmpty(propIsShow)" class="flex-col w h tl jc-sb">
                        <view v-if="propIsShow.includes('title')" class="text-line-2" :style="propGoodStyle.goods_title_style">{{ item.title }}</view>
                        <view v-if="propIsShow.includes('price')" class="identifying" :style="propGoodStyle.goods_price_style">
                            <text class="num">{{ item.show_price_symbol }}</text>
                            {{ item.min_price }}
                            <template v-if="propIsShow.includes('price_unit')">
                                <text class="num">{{ item.show_price_unit }}</text>
                            </template>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else-if="propActived != 7 || propNum !== 1">
                <view v-for="(item, index) in propValue" :key="index" :class="['flex-col gap-10 ht-auto', { 'half-width': propNum !== 1, 'w': propNum == 1 }]" :data-index="index" :data-value="item.goods_url" @tap="url_event">
                    <view class="w h pr">
                        <template v-if="!isEmpty(item.new_cover)">
                            <view class="w h">
                                <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                            </view>
                        </template>
                        <template v-else>
                            <view class="w h">
                                <imageEmpty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                            </view>
                        </template>
                        <view v-if="propIsShow.includes('price')" class="price-suspension text-line-1" :style="propGoodStyle.goods_price_style">
                            {{ item.show_price_symbol }}{{ item.min_price }}
                            <template v-if="propIsShow.includes('price_unit')">
                                {{ item.show_price_unit }}
                            </template>
                        </view>
                    </view>
                    <view v-if="propIsShow.includes('title')" class="text-line-1 tl w" :style="propGoodStyle.goods_title_style + ';overflow: inherit'">{{ item.title }}</view>
                </view>
            </template>
            <template v-else>
                <view v-for="(item, index) in propValue" :key="index" class="flex-col w h" :data-index="index" :data-value="item.goods_url" @tap="url_event">
                    <template v-if="!isEmpty(item.new_cover)">
                        <view class="w h">
                            <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <template v-else>
                        <view class="w h">
                            <imageEmpty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <view v-if="!isEmpty(propIsShow)" class="flex-col w h tl jc-sb" :style="img_padding_computer">
                        <view v-if="propIsShow.includes('title')" class="text-line-2" :style="propGoodStyle.goods_title_style">{{ item.title }}</view>
                        <view v-if="propIsShow.includes('price')" class="identifying" :style="propGoodStyle.goods_price_style">
                            <text class="num">{{ item.show_price_symbol }}</text>
                            {{ item.min_price }}
                            <template v-if="propIsShow.includes('price_unit')">
                                <text class="num">{{ item.show_price_unit }}</text>
                            </template>
                        </view>
                    </view>
                </view>
            </template>
        </view>
    </view>
    <view v-else class="w h">
        <view class="flex-col gap-20 align-c w h">
            <template v-if="propFlex === 'row'">
                <view v-for="(item, index) in propValue" :key="index" class="flex-row gap-10 align-c w h shop-max-height" :data-index="index" :data-value="item.goods_url" @tap="url_event">
                    <template v-if="!isEmpty(item.new_cover)">
                        <view class="w h">
                            <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <template v-else>
                        <view class="w h">
                            <imageEmpty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <view v-if="!isEmpty(propIsShow)" class="flex-col w h tl jc-sb">
                        <view v-if="propIsShow.includes('title')" class="text-line-2" :style="propGoodStyle.goods_title_style">{{ item.title }}</view>
                        <view v-if="propIsShow.includes('price')" class="identifying" :style="propGoodStyle.goods_price_style">
                            <text class="num">{{ item.show_price_symbol }}</text
                            >{{ item.min_price }}
                            <template v-if="propIsShow.includes('price_unit')">
                                <text class="num">{{ item.show_price_unit }}</text>
                            </template>
                        </view>
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, padding_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
    export default {
        components: {
            imageEmpty,
        },
        props: {
            propValue: {
                type: Array,
                default: () => [],
            },
            propOuterflex: {
                type: String,
                default: () => '',
            },
            propFlex: {
                type: String,
                default: () => '',
            },
            propContentImgRadius: {
                type: String,
                default: () => '',
            },
            propNum: {
                type: Number,
                default: () => 0,
            },
            propActived: {
                type: Number,
                default: () => 0,
            },
            propIsShow: {
                type: Array,
                default: () => [],
            },
            propChunkPadding: {
                type: Object,
                default: () => {},
            },
            propGoodStyle: {
                type: Object,
                default: () => {},
            }
        },
        computed: {
            img_padding_computer() {
                if (!isEmpty(this.propChunkPadding)) {
                    return padding_computer(this.propChunkPadding) + ';box-sizing: border-box;';
                } else {
                    return '';
                }
            },
        },
        methods: {
            isEmpty,
            url_event(e) {
                // 存储数据显示缓存
                let index = e.currentTarget.dataset.index || 0;
                let goods = this.propValue[index];
                app.globalData.goods_data_cache_handle(goods.id, goods);

                this.$emit('url_event', e);
            },
        },
    };
</script>

<style scoped lang="scss">
    .identifying .num {
        font-size: 18rpx;
    }
    .price-suspension {
        width: calc(100% - 32rpx);
        margin: 0 8rpx;
        background: #fff;
        font-size: 24rpx;
        line-height: 34rpx;
        color: #ea3323;
        text-align: center;
        position: absolute;
        bottom: 8rpx;
        border-radius: 16rpx;
    }
    .shop-max-height {
        max-height: calc(100% / 3);
    }
    .w {
        width: 100%;
    }
    .h {
        height: 100%;
    }
    .half-width {
        width: 50%;
    }
    .gap-20 {
        gap: 40rpx;
    }
</style>
