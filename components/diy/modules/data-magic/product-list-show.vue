<template>
    <view :class="['align-c w h', (propOuterflex == 'row' ? 'flex-row' : 'flex-col')]" :style="'gap:' + propGoodStyle.data_goods_gap + 'px;'">
        <template v-if="propFlex === 'row'">
            <view v-for="(item, index) in propValue" :key="index" :style="block_size">
                <view class="w h oh" :style="style_container">
                    <view class="w h flex-row gap-10" :style="style_img_container" :data-index="index" :data-value="item.goods_url" @tap="url_event">
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
                </view>
            </view>
        </template>
        <template v-else-if="propFlex === 'col_price_float'">
            <view v-for="(item, index) in propValue" :key="index" :style="block_size">
                <view class="w h oh" :style="style_container">
                    <view class="w h flex-col gap-10" :style="style_img_container" :data-index="index" :data-value="item.goods_url" @tap="url_event">
                        <view class="w h flex-1 pr oh">
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
                        <view v-if="propIsShow.includes('title')" class="text-line-1 tl w" :style="propGoodStyle.goods_title_style">{{ item.title }}</view>
                    </view>
                </view>
            </view>
        </template>
        <template v-else>
            <view v-for="(item, index) in propValue" :key="index" :style="block_size">
                <view class="w h oh" :style="style_container">
                    <view class="w h flex-col" :style="style_img_container" :data-index="index" :data-value="item.goods_url" @tap="url_event">
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
                </view>
            </view>
        </template>
    </view>
</template>

<script>
    const app = getApp();
    import { gradient_computer, radius_computer, padding_computer, background_computer, isEmpty } from "@/common/js/common/common.js";
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
        data() {
            return {
                style_container: '',
                style_img_container: '',
                block_size: '',
            };
        },
        mounted() {
            this.init();
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
            init() {
                if (!isEmpty(this.propGoodStyle)) {
                    const { goods_color_list = [], goods_direction = '180deg', goods_radius = { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 }, goods_background_img = [], goods_background_img_style = '2', goods_chunk_padding = { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 }} = this.propGoodStyle;
                    const style_data = {
                        color_list: goods_color_list,
                        direction: goods_direction,
                    }
                    const style_img_data = {
                        background_img: goods_background_img,
                        background_img_style: goods_background_img_style,
                    }
                    const total_gap = this.propGoodStyle.data_goods_gap * (this.propValue.length - 1);
                    this.setData({
                        style_container: gradient_computer(style_data) + radius_computer(goods_radius), // 用于样式显示
                        style_img_container: this.propFlex == 'col' ? background_computer(style_img_data) : padding_computer(goods_chunk_padding) + background_computer(style_img_data) + 'box-sizing: border-box;',
                        block_size: this.propOuterflex == 'row' ? 'height:100%;width:calc((100% - ' + total_gap * 2 + 'rpx) / ' + this.propNum  + ');' : 'width: 100%;height:calc((100% - ' + total_gap * 2 + 'rpx) / ' + this.propNum  + ');'
                    });
                } else {
                    return '';
                }
            },
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
        line-height: 18rpx;
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
