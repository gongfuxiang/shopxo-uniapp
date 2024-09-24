<template>
    <view :class="['oh img_wh', type_class]" :style="empty_outer_style + type_style">
        <image :src="imageUrl" @error="handleImageError" :mode="img_fit" :style="empty_style" />
    </view>
</template>

<script>
    import { is_obj, isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            imageSrc: {
                type: [Object, String],
                default: () => {},
            },
            errorStyle: {
                type: String,
                default: () => '',
            },
            img_fit: {
                type: String,
                default: () => 'aspectFill',
            },
            type_style: {
                type: String,
                default: () => '',
            },
            type_class: {
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
        created() {
            this.init();
        },
        methods: {
            init() {
                let img_url = this.imageSrc;
                if (is_obj(this.imageSrc)) {
                    img_url = !isEmpty(this.imageSrc) ? this.imageSrc.url : '';
                }
                // 没有图片的时候根据默认值来算
                if (img_url == undefined || img_url == null || img_url == '') {
                    this.setData({
                        empty_outer_style: 'background: #f4fcff;display:flex;align-items: center;justify-content: center;',
                        empty_style: `${this.errorStyle}`,
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
