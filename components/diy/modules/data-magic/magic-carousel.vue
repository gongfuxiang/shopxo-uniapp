<template>
    <view class="wh-auto ht-auto oh ssss" :style="style_container">
        <view class="wh-auto ht-auto" :style="style_img_container">
            <swiper circular="true" :autoplay="propValue.data_style.is_roll == '1'" :interval="propValue.data_style.interval_time * 1000" :duration="500" :vertical="propValue.data_style.rotation_direction == 'vertical'" class="swiper" style="height: 100%" @change="carousel_change">
                <swiper-item v-for="(item1, index1) in propValue.data_content.list" :key="index1">
                    <template v-if="propType === 'img'">
                        <view class="wh-auto ht-auto" :data-value="item1.carousel_link.page" @tap="url_event">
                            <imageEmpty :propImageSrc="item1.carousel_img[0]" :propStyle="propValue.data_style.get_img_radius" :propImgFit="propValue.data_content.fit" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                        </view>
                    </template>
                    <template v-else>
                        <product-list-show :propOuterflex="propValue.outerflex" :propFlex="propValue.flex" :propNum="propValue.num" :propActived="propActived" :propIsShow="propValue.data_content.is_show" :propChunkPadding="propValue.data_style.chunk_padding" :propValue="item1.split_list" :propGoodStyle="propGoodStyle" :propContentImgRadius="propValue.data_style.get_img_radius" @url_event="url_event"></product-list-show>
                    </template>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
    import { gradient_computer, radius_computer, padding_computer, background_computer, isEmpty } from "@/common/js/common/common.js";
    const app = getApp();
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
    import productListShow from '@/components/diy/modules/data-magic/product-list-show.vue';
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
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (!isEmpty(this.propValue)) {
                    const { data_color_list = [], data_direction = '180deg', data_radius = { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 }, data_background_img = [], data_background_img_style = '2', data_chunk_padding = { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 }} = this.propValue.data_style;
                    const style_data = {
                        color_list: data_color_list,
                        direction: data_direction,
                    }
                    const style_img_data = {
                        background_img: data_background_img,
                        background_img_style: data_background_img_style,
                    }
                    this.setData({
                        style_container: gradient_computer(style_data) + radius_computer(data_radius) + 'box-sizing: border-box;', // 用于样式显示
                        style_img_container: padding_computer(data_chunk_padding) + background_computer(style_img_data),
                    });
                } else {
                    return '';
                }
            },
            carousel_change(e) {
                this.$emit('onCarouselChange', e);
            },      
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style></style>
