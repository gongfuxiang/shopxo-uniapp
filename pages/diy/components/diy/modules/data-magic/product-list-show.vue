<template>
    <view :class="['align-c flex-1 w h', (propOuterflex == 'row' ? 'flex-row' : 'flex-col')]" :style="'gap:' + propGoodStyle.data_goods_gap + 'px;'">
        <template v-if="propFlex === 'row'">
            <view v-for="(item, index) in propValue" :key="index" :style="block_size" class="w h">
                <view class="w h oh" :style="style_container">
                    <view class="w h flex-row gap-10" :style="style_img_container" :data-index="index" :data-value="item.goods_url" @tap="url_event">
                        <template v-if="!isEmpty(item.new_cover)">
                            <view class="w h">
                                <image-empty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></image-empty>
                            </view>
                        </template>
                        <template v-else>
                            <view class="w h">
                                <image-empty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></image-empty>
                            </view>
                        </template>
                        <view v-if="!isEmpty(propIsShow)" class="flex-col w h tl jc-sb">
                            <view v-if="propIsShow.includes('title')" class="text-line-2" :style="propGoodStyle.goods_title_style + 'height:'+ ((propGoodStyle.goods_title_size + 3) * 4) + 'rpx;'">{{ item.title || '' }}</view>
                            <view v-if="propIsShow.includes('price')" :style="propGoodStyle.goods_price_style">
                                <text :style="propGoodStyle.goods_price_symbol_style">{{ item.show_price_symbol || '' }}</text>
                                {{ item.min_price || '' }}
                                <template v-if="propIsShow.includes('price_unit')">
                                    <text :style="propGoodStyle.goods_price_unit_style">{{ item.show_price_unit || '' }}</text>
                                </template>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </template>
        <template v-else-if="propFlex === 'col_price_float'">
            <view v-for="(item, index) in propValue" :key="index" :style="block_size" class="w h">
                <view class="w h oh" :style="style_container">
                    <view class="w h flex-col gap-10" :style="style_img_container" :data-index="index" :data-value="item.goods_url" @tap="url_event">
                        <view class="w h flex-1 pr oh">
                            <template v-if="!isEmpty(item.new_cover)">
                                <view class="w h">
                                    <image-empty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></image-empty>
                                </view>
                            </template>
                            <template v-else>
                                <view class="w h">
                                    <image-empty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></image-empty>
                                </view>
                            </template>
                            <view v-if="propIsShow.includes('price')" class="pa" :style="propGoodStyle.goods_price_style + float_pirce_style">
                                <text :style="propGoodStyle.goods_price_symbol_style">{{ item.show_price_symbol || ''}}</text>{{ item.min_price  || ''}}
                                <template v-if="propIsShow.includes('price_unit')">
                                    <text :style="propGoodStyle.goods_price_unit_style">{{ item.show_price_unit || ''}}</text>
                                </template>
                            </view>
                        </view>
                        <view v-if="propIsShow.includes('title')" class="text-line-1 tl w" :style="propGoodStyle.goods_title_style + 'height:'+ ((propGoodStyle.goods_title_size + 3) * 2) + 'rpx;'">{{ item.title || '' }}</view>
                    </view>
                </view>
            </view>
        </template>
        <template v-else>
            <view v-for="(item, index) in propValue" :key="index" :style="block_size" class="w h">
                <view class="w h oh" :style="style_container">
                    <view class="w h flex-col" :style="style_img_container" :data-index="index" :data-value="item.goods_url" @tap="url_event">
                        <template v-if="!isEmpty(item.new_cover)">
                            <view class="w h">
                                <image-empty :propImageSrc="item.new_cover[0]" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></image-empty>
                            </view>
                        </template>
                        <template v-else>
                            <view class="w h">
                                <image-empty :propImageSrc="item.images" :propStyle="propContentImgRadius" propErrorStyle="width: 80rpx;height: 80rpx;"></image-empty>
                            </view>
                        </template>
                        <view v-if="!isEmpty(propIsShow)" class="flex-col w h tl jc-sb">
                            <view v-if="propIsShow.includes('title')" class="text-line-2" :style="propGoodStyle.goods_title_style + 'height:'+ ((propGoodStyle.goods_title_size + 3) * 4) + 'rpx;'">{{ item.title || '' }}</view>
                            <view v-if="propIsShow.includes('price')" :style="propGoodStyle.goods_price_style">
                                <text :style="propGoodStyle.goods_price_symbol_style">{{ item.show_price_symbol || ''}}</text>{{ item.min_price || '' }}
                                <template v-if="propIsShow.includes('price_unit')">
                                    <text :style="propGoodStyle.goods_price_unit_style">{{ item.show_price_unit || ''}}</text>
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
    import { gradient_computer, radius_computer, padding_computer, background_computer, isEmpty, margin_computer, box_shadow_computer, border_computer, old_margin, old_border_and_box_shadow, old_padding } from "@/common/js/common/common.js";
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
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
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                block_size: '',
                float_pirce_style: '',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
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
                    const { goods_color_list = [], goods_direction = '180deg', goods_radius = old_radius, goods_background_img = [], goods_background_img_style = '2', goods_chunk_padding = old_padding, goods_price_color_list = [], goods_price_direction = '180deg', goods_price_radius = old_radius, goods_price_padding = old_padding, goods_price_margin = old_margin, goods_price_location = 'center', goods_chunk_margin = old_margin} = this.propGoodStyle;
                    const style_data = {
                        color_list: goods_color_list,
                        direction: goods_direction,
                    }
                    const style_img_data = {
                        background_img: goods_background_img,
                        background_img_style: goods_background_img_style,
                    }
                    
                    const data = {
                        color_list: goods_price_color_list,
                        direction: goods_price_direction,
                    }
                    let location = 'left:50%;transform:translateX(-50%);bottom:0;'
                    if (goods_price_location == 'left') {
                        location = 'left:0;bottom:0;';
                    } else if (goods_price_location == 'right') {
                        location = 'right:0;bottom:0;';
                    }
                    // 左右间距
                    const shop_left_right_width_margin = goods_chunk_margin?.margin_left || 0 + goods_chunk_margin?.margin_right || 0;
                    // 上下间距
                    const shop_top_bottom_width_margin = goods_chunk_margin?.margin_top || 0 + goods_chunk_margin?.margin_bottom || 0;
                    // 内容间距
                    const total_gap = this.propGoodStyle.data_goods_gap * (this.propValue.length - 1);
                    // 总的宽度
                    const all_width = total_gap + (shop_left_right_width_margin.value * this.propNum);
                    // 总的高度
                    const all_height = total_gap + (shop_top_bottom_width_margin.value * this.propNum);
                    this.setData({
                        float_pirce_style: gradient_computer(data) + radius_computer(goods_price_radius) + padding_computer(goods_price_padding) + margin_computer(goods_price_margin) + location,
                        style_container: gradient_computer(style_data) + radius_computer(goods_radius) + margin_computer(goods_chunk_margin) + border_computer(this.propGoodStyle) + box_shadow_computer(this.propGoodStyle), // 用于样式显示
                        style_img_container: this.propFlex == 'col' ? background_computer(style_img_data) : padding_computer(goods_chunk_padding) + background_computer(style_img_data) + 'box-sizing: border-box;',
                        block_size: this.propOuterflex == 'row' ?  'height:calc(100% - ' +  shop_top_bottom_width_margin.value + 'px);width:calc((100% - ' + all_width + 'px) / ' + this.propNum  + ');' : 'width:calc(100% - ' +  shop_left_right_width_margin.value + 'px);height:calc((100% - ' + all_height + 'px) / ' + this.propNum  + ');',
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
