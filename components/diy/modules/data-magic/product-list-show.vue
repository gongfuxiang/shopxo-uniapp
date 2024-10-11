<template>
    <view v-if="propOuterflex == 'row'" class="wh-auto ht-auto">
        <view class="flex-row gap-10 align-c wh-auto ht-auto">
            <template v-if="propFlex === 'row'">
                <view v-for="(item, index) in propValue" :key="index" class="flex-row gap-10 half-width ht-auto" :data-value="item.goods_url" @tap="url_event">
                    <template v-if="!isEmpty(item.new_cover)">
                        <view class="wh-auto ht-auto">
                            <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <template v-else>
                        <view class="wh-auto ht-auto">
                            <imageEmpty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <view v-if="!isEmpty(propIsShow)" class="flex-col wh-auto ht-auto tl gap-10">
                        <view v-if="propIsShow.includes('title')" class="text-line-2 text-size-md shop-title" :style="propGoodStyle.goods_title_style">{{ item.title }}</view>
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
                <view v-for="(item, index) in propValue" :key="index" :class="['flex-col gap-10 ht-auto', { 'half-width': propNum !== 1, 'wh-auto': propNum == 1 }]" :data-value="item.goods_url" @tap="url_event">
                    <view class="wh-auto ht-auto pr">
                        <template v-if="!isEmpty(item.new_cover)">
                            <view class="wh-auto ht-auto">
                                <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                            </view>
                        </template>
                        <template v-else>
                            <view class="wh-auto ht-auto">
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
                    <view v-if="propIsShow.includes('title')" class="text-line-1 text-size-md shop-title tl wh-auto" :style="propGoodStyle.goods_title_style + ';overflow: inherit'">{{ item.title }}</view>
                </view>
            </template>
            <template v-else>
                <view v-for="(item, index) in propValue" :key="index" class="flex-col wh-auto ht-auto" :data-value="item.goods_url" @tap="url_event">
                    <template v-if="!isEmpty(item.new_cover)">
                        <view class="wh-auto ht-auto">
                            <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <template v-else>
                        <view class="wh-auto ht-auto">
                            <imageEmpty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <view v-if="!isEmpty(propIsShow)" class="flex-col wh-auto tl gap-10" :style="img_padding_computer">
                        <view v-if="propIsShow.includes('title')" class="text-line-2 text-size-md shop-title" :style="propGoodStyle.goods_title_style">{{ item.title }}</view>
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
    <view v-else class="wh-auto ht-auto">
        <view class="flex-col gap-20 align-c wh-auto ht-auto">
            <template v-if="propFlex === 'row'">
                <view v-for="(item, index) in propValue" :key="index" class="flex-row gap-10 align-c wh-auto ht-auto shop-max-height" :data-value="item.goods_url" @tap="url_event">
                    <template v-if="!isEmpty(item.new_cover)">
                        <view class="wh-auto ht-auto">
                            <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <template v-else>
                        <view class="wh-auto ht-auto">
                            <imageEmpty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <view v-if="!isEmpty(propIsShow)" class="flex-col wh-auto ht-auto tl gap-20">
                        <view v-if="propIsShow.includes('title')" class="text-line-2 text-size-md shop-title" :style="propGoodStyle.goods_title_style">{{ item.title }}</view>
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
            url_event(link) {
                this.$emit('url_event', link);
            },
        },
    };
</script>

<style scoped lang="scss">
    .identifying {
        font-size: 28rpx;
        color: #ea3323;
        .num {
            font-size: 18rpx;
        }
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
    .half-width {
        width: 50%;
    }
    .shop-title {
        line-height: 40rpx;
    }
    .gap-20 {
        gap: 40rpx;
    }
</style>
