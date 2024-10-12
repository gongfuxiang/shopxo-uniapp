<template>
    <view class="img-outer pr wh-auto ht-auto" :style="border_style" :data-value="form.link.page" @tap="url_event">
        <imageEmpty :propImageSrc="img" :propStyle="image_style" propErrorStyle="width: 60rpx;height: 60rpx;"></imageEmpty>
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
                type: [ Object, Array ],
                default: () => {
                    return {};
                },
            },
            propkey: {
                type: String,
                default: '',
            },
            propScale: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                form: {},
                img: '',
                image_style: '',
                border_style: '',
            };
        },
        watch: {
            propkey(val) {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.setData({
                    form: this.propValue,
                    img: this.get_img_url(this.propValue),
                    image_style: this.get_image_style(this.propValue),
                    border_style: this.get_border_style(this.propValue),
                });
            },
            get_img_url(form) {
                if (!isEmpty(form.img[0])) {
                    return form.img[0];
                } else {
                    if (!isEmpty(this.propSourceList)) {
                        return this.propSourceList[form.data_source_id];
                    } else {
                        return '';
                    }
                }
            },
            get_image_style(form) {
                return `width: ${percentage_count(form.img_width, form.com_width)}; height: ${percentage_count(form.img_height, form.com_height)};transform: rotate(${form.img_rotate}deg); ${radius_computer(form.img_radius, this.propScale)};`;
            },
            get_border_style(form) {
                let style = ``;
                if (form.border_show == '1') {
                    style += `border: ${form.border_size * this.propScale * 2}rpx ${form.border_style} ${form.border_color}; ${radius_computer(form.border_radius, this.propScale)};box-sizing: border-box;`;
                }
                return style;
            },
            url_event(e) {
                this.$emit('url_event', e);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .img-outer {
        overflow: hidden;
    }
</style>
