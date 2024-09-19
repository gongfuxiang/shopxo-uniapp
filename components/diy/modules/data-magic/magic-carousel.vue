<template>
    <swiper circular="true" :autoplay="value.data_style.is_roll == '1'" :interval="value.data_style.interval_time * 1000" :duration="500" :vertical="value.data_style.rotation_direction == 'vertical'" class="swiper" style="height: 100%;" @change="carousel_change">
        <swiper-item v-for="(item1, index1) in value.data_content.list" :key="index1">
            <template v-if="type === 'img'">
                <view @tap="url_event(item1.carousel_link.page)">
                    <image-empty v-model="item1.carousel_img[0]" :style="contentImgRadius" error-style="width: 80rpx;height: 80rpx;"></image-empty>
                </view>
            </template>
            <template v-else>
                <product-list-show :outerflex="value.outerflex" :flex="value.flex" :num="value.num" :actived="actived" :is-show="value.data_content.is_show" :chunk-padding="value.data_style.chunk_padding" :value="item1.split_list" :content-img-radius="contentImgRadius" @url_event="url_event"></product-list-show>
            </template>
        </swiper-item>
    </swiper>
</template>

<script>
    const app = getApp();
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
    import productListShow from '@/components/diy/modules/data-magic/product-list-show.vue';
import { isEmpty } from '../../../../common/js/common/common';
    export default {
        components: {
            imageEmpty,
            productListShow,
        },
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
            contentImgRadius: {
                type: String,
                default: () => '',
            },
            type: {
                type: String,
                default: () => '',
            },
            actived: {
                type: Number,
                default: () => 0,
            },
        },
        methods: {
            carousel_change(e) {
                this.$emit('carousel_change', e);
            },
            // 跳转链接
            url_event(link) {
                if (!isEmpty(link)) {
                    app.globalData.url_open(link);
                }
            },
        }
    }
</script>

<style>
</style>