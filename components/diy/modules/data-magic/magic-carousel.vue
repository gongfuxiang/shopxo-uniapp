<template>
    <swiper circular="true" :autoplay="propValue.data_style.is_roll == '1'" :interval="propValue.data_style.interval_time * 1000" :duration="500" :vertical="propValue.data_style.rotation_direction == 'vertical'" class="swiper" style="height: 100%" @change="carousel_change">
        <swiper-item v-for="(item1, index1) in propValue.data_content.list" :key="index1">
            <template v-if="propType === 'img'">
                <view :data-value="item1.carousel_link.page" @tap="url_event">
                    <imageEmpty :propImageSrc="item1.carousel_img[0]" :propStyle="propContentImgRadius" :propImgFit="propValue.data_content.fit" propErrorStyle="width: 80rpx;height: 80rpx;"></imageEmpty>
                </view>
            </template>
            <template v-else>
                <product-list-show :propOuterflex="propValue.outerflex" :propFlex="propValue.flex" :propNum="propValue.num" :propActived="propActived" :propIsShow="propValue.data_content.is_show" :propChunkPadding="propValue.data_style.chunk_padding" :propValue="item1.split_list" :propGoodStyle="propGoodStyle" :propContentImgRadius="propContentImgRadius" @url_event="url_event"></product-list-show>
            </template>
        </swiper-item>
    </swiper>
</template>

<script>
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
        methods: {
            carousel_change(e) {
                this.$emit('onCarouselChange', e);
            },
            // 跳转链接
            url_event(link) {
                app.globalData.url_event(link);
            },
        },
    };
</script>

<style></style>
