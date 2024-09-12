<template>
    <view class="oh" :style="empty_outer_style">
        <image :src="imageUrl" @error="handleImageError" :mode="img_fit" :style="empty_style" />
    </view>
</template>

<script>
    import { is_obj, is_obj_empty } from '@/common/js/common/common.js';
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
            }
        },
        data() {
            return {
                empty_outer_style: '',
                empty_style: '',
                imageUrl: '',
                defaultImage: '/static/images/common/image-empty.png',
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let img_url = this.imageSrc;
                if (is_obj(this.imageSrc)) {
                    img_url = !is_obj_empty(this.imageSrc) ? this.imageSrc.url : '';
                }
                if (img_url == undefined || img_url == null || img_url == '') {
                    this.setData({
                        empty_outer_style: 'background: #f4fcff;',
                        empty_style: `top: 50%;transform: translateY(-50%);${ this.errorStyle }`
                    })
                    img_url = this.defaultImage;
                }
                this.setData({
                    imageUrl: img_url
                })
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>
