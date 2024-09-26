<template>
    <view :class="['oh img_wh', propClass]" :style="empty_outer_style + propStyle">
        <image :src="imageUrl" @error="handleImageError" :mode="propImgFit" :style="empty_style" />
    </view>
</template>

<script>
    import { is_obj, isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            propImageSrc: {
                type: [Object, String],
                default: () => {},
            },
            propErrorStyle: {
                type: String,
                default: () => '',
            },
            propImgFit: {
                type: String,
                default: () => 'aspectFill',
            },
            propStyle: {
                type: String,
                default: () => '',
            },
            propClass: {
                type: String,
                default: () => '',
            },
        },
        data() {
            return {
                empty_outer_style: '',
                empty_style: 'width: 100%; height: 100%;', // 有图片的时候显示为100%
                imageUrl: '',
                defaultImage: '/static/images/common/image-empty.png',
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let img_url = this.propImageSrc;
                if (is_obj(this.propImageSrc)) {
                    img_url = !isEmpty(this.propImageSrc) ? this.propImageSrc.url : '';
                }
                // 没有图片的时候根据默认值来算
                if (img_url == undefined || img_url == null || img_url == '') {
                    this.setData({
                        empty_outer_style: 'background: #f4fcff;display:flex;align-items: center;justify-content: center;',
                        empty_style: `${this.propErrorStyle}`,
                    });
                    img_url = this.defaultImage;
                }
                this.setData({
                    imageUrl: img_url,
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .img_wh {
        width: 100%;
        height: 100%;
    }
</style>
