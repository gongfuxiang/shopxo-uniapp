<template>
    <view class="img-outer pr wh-auto ht-auto" :style="border_style" @tap="url_open(form.link)">
        <image-empty v-model="img" :style="image_style"></image-empty>
    </view>
</template>
<script>
    import { percentage_count, radius_computer, isEmpty } from '@/common/js/common/common.js';

    export default {
        props: {
            value: {
                type: Object,
                default: () => {
                    return {};
                },
                required: true,
            },
            sourceList: {
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
                form: this.value,
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
                    if (!isEmpty(this.sourceList)) {
                        return this.sourceList[this.form.data_source_id];
                    } else {
                        return '';
                    }
                }
            },
            get_image_style() {
                return `${set_count()};transform: rotate(${this.form.img_rotate}deg); ${radius_computer(this.form.img_radius)};`;
            },
            get_border_style() {
                let style = ``;
                if (this.form.border_show == '1') {
                    style += `border: ${this.form.border_size}px ${this.form.border_style} ${this.form.border_color}; ${radius_computer(this.form.border_radius)};`;
                }
                return style;
            },
            set_count() {
                return `width: ${percentage_count(this.form.img_width, this.form.com_width)}; height: ${percentage_count(this.form.img_height, this.form.com_height)};`;
            },
            url_open(link) {
                this.$emit('url_open', link)
            },
        },
    };
</script>
<style lang="scss" scoped>
    .img-outer {
        overflow: hidden;
    }
</style>
