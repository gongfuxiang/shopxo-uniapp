<template>
    <view class="wh-auto ht-auto oh" :style="style_container">
        <view class="pr oh wh-auto ht-auto" :style="style_img_container">
            <swiper circular="true" :autoplay="propValue.data_style.is_roll == '1'" :interval="propValue.data_style.interval_time * 1000" :duration="500" :vertical="propValue.data_style.rotation_direction == 'vertical'" :next-margin="next_margin" :display-multiple-items="slides_per_view" class="swiper" style="height: 100%" @change="carousel_change">
                <swiper-item v-for="(item1, index1) in propValue.data_content.list" :key="index1">
                    <template v-if="propType === 'img'">
                        <view class="wh-auto ht-auto" :data-value="item1.carousel_link.page" @tap="url_event">
                            <image-empty :propImageSrc="item1.carousel_img[0]" :propStyle="propValue.data_style.get_img_radius" :propImgFit="propValue.data_content.fit" propErrorStyle="width: 80rpx;height: 80rpx;"></image-empty>
                        </view>
                    </template>
                    <template v-else>
                        <view class="wh-auto ht-auto" :style="shop_spacing">
                            <product-list-show :propKey="propKey" :propOuterflex="propValue.data_content.goods_outerflex" :propFlex="propValue.data_content.goods_flex" :propNum="show_num" :propActived="propActived" :propIsShow="propValue.data_content.is_show" :propChunkPadding="propValue.data_style.chunk_padding" :propValue="item1.split_list" :propGoodStyle="propGoodStyle" :propContentImgRadius="propValue.data_style.get_img_radius" @url_event="url_event"></product-list-show>
                        </view>
                    </template>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
    import { gradient_computer, radius_computer, padding_computer, background_computer, isEmpty, border_computer, box_shadow_computer, old_border_and_box_shadow, old_margin, old_radius, old_padding, margin_computer } from "@/common/js/common/common.js";
    const app = getApp();
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    import productListShow from '@/pages/diy/components/diy/modules/data-magic/product-list-show.vue';
    export default {
        components: {
            imageEmpty,
            productListShow,
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propContentImgRadius: {
                type: String,
                default: () => '',
            },
            propType: {
                type: String,
                default: () => '',
            },
            propActived: {
                type: Number,
                default: () => 0,
            },
            propGoodStyle: {
                type: Object,
                default: () => {},
            },
            propDataIndex: {
                type: Number,
                default: () => 0,
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
                slides_per_view: 1,
                show_num: 1,
                shop_spacing: '',
                next_margin: '0rpx',
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
        methods: {
            init() {
                if (!isEmpty(this.propValue)) {
                    const { data_color_list = [], data_direction = '180deg', data_chunk_margin = old_margin, data_radius = old_radius, data_pattern = old_border_and_box_shadow, data_background_img = [], data_background_img_style = '2', data_chunk_padding = old_padding } = this.propValue.data_style;
                    const style_data = {
                        color_list: data_color_list,
                        direction: data_direction,
                    }
                    const style_img_data = {
                        background_img: data_background_img,
                        background_img_style: data_background_img_style,
                    }
                    let slides_per_view = 1;
                    let show_num = 1;
                    // 商品时的处理逻辑
                    const { goods_outerflex, goods_num } = this.propValue.data_content;
                    const { rotation_direction, rolling_fashion, data_goods_gap } = this.propValue.data_style;
                    // 图片时的处理
                    if (this.propType === 'img') {
                        slides_per_view = 1; // 能够同时显示的slides数量
                    } else {
                        // 判断是平移还是整屏滚动, 平移的时候是一个为1组，如果是整屏滚动，就为一屏为一组
                        if (rolling_fashion == 'translation') {
                            // 如果是商品是横排的，轮播也是横排的，就不对商品进行拆分/如果商品是竖排的，轮播也是竖排的，不对商品进行拆分
                            if ((goods_outerflex == 'row' && rotation_direction == 'horizontal') || (goods_outerflex == 'col' && rotation_direction == 'vertical')) {
                                slides_per_view = goods_num; // 能够同时显示的slides数量
                                show_num = 1; // 一屏显示的数量 用于商品内部处理显示
                            } else {
                                slides_per_view = 1; // 能够同时显示的slides数量
                                show_num = goods_num; // 一屏显示的数量 用于商品内部处理显示
                            }
                        } else {
                            // 切屏的时候为多个为一组 
                            show_num = goods_num; // 一屏显示的数量 用于商品内部处理显示
                            slides_per_view = 1; // 能够同时显示的slides数量
                        }
                    }
                    
                    this.setData({
                        style_container: gradient_computer(style_data) + radius_computer(data_radius) + margin_computer(data_chunk_margin) + box_shadow_computer(data_pattern) + border_computer(data_pattern), // 用于样式显示
                        style_img_container: padding_computer(data_chunk_padding) + background_computer(style_img_data) + 'box-sizing: border-box;',
                        next_margin: rolling_fashion == 'translation' && rotation_direction == 'horizontal' ? `-${ data_goods_gap * 2 }rpx` : '0rpx',
                        shop_spacing: this.propType === 'img' ? 'margin-right: 0px;' : `margin-right: ${ data_goods_gap * 2 }rpx;`,
                        slides_per_view: slides_per_view,
                        show_num: show_num,
                    });
                } else {
                    return '';
                }
            },
            carousel_change(e) {
                this.$emit('onCarouselChange', e.detail.current, this.propDataIndex);
            },      
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style></style>
