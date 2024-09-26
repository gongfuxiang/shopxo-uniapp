<template>
    <view class="img-outer pr wh-auto ht-auto" :style="border_style" @tap="url_open(form.link)">
        <image-empty :propImageSrc="img" :propTypeStyle="image_style" propErrorStyle="width: 60rpx;height: 60rpx;"></image-empty>
    </view>
</template>
<script>
    import { percentage_count, radius_computer, isEmpty } from '@/common/js/common/common.js';
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
    export default {
        components: {
            imageEmpty,
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
                required: true,
            },
            propSourceList: {
                type: Object,
                default: () => {
                    return {};
                },
            },
        },
        data() {
            return {
                form: {},
                img: '',
                image_style: '',
                border_style: '',
            };
        },
        created() {
            this.setData({
                form: this.propValue,
            });
            this.init();
        },
        methods: {
            init() {
                this.setData({
                    img: this.get_img_url(),
                    image_style: this.get_image_style(),
                    border_style: this.get_border_style(),
                });
            },
            get_img_url() {
                if (!isEmpty(this.form.img[0])) {
                    return this.form.img[0];
                } else {
                    if (!isEmpty(this.propSourceList)) {
                        return this.propSourceList[this.form.data_source_id];
                    } else {
                        return '';
                    }
                }
            },
            get_image_style() {
                return `width: ${percentage_count(this.form.img_width, this.form.com_width)}; height: ${percentage_count(this.form.img_height, this.form.com_height)};transform: rotate(${this.form.img_rotate}deg); ${radius_computer(this.form.img_radius)};`;
            },
            get_border_style() {
                let style = ``;
                if (this.form.border_show == '1') {
                    style += `border: ${this.form.border_size * 2}rpx ${this.form.border_style} ${this.form.border_color}; ${radius_computer(this.form.border_radius)};box-sizing: border-box;`;
                }
                return style;
            },
            url_open(link) {
                this.$emit('url_open', link);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .img-outer {
        overflow: hidden;
    }
</style>
