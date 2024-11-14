<template>
    <view class="img-outer pr wh-auto ht-auto" :style="border_style" :data-value="img_url" @tap="url_event">
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
            propKey: {
                type: [String,Number],
                default: '',
            },
            propScale: {
                type: Number,
                default: 1
            },
            propSourceType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                form: {},
                img: '',
                img_url: '',
                image_style: '',
                border_style: '',
                keyMap: {
                    goods: 'images',
                    article: 'cover',
                    brand: 'logo'
                },
            };
        },
        watch: {
            propKey(val) {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let url = '';
                if (!isEmpty(this.propValue.icon_link)) {
                    url = this.propValue.icon_link?.page || '';
                } else if (!isEmpty(this.propSourceList.data)) {
                    url = this.propSourceList.data[this.propValue?.data_source_link] || '';
                } else {
                    url = this.propSourceList[this.propValue?.data_source_link] || '';
                }
                this.setData({
                    form: this.propValue,
                    img: this.get_img_url(this.propValue),
                    image_style: this.get_image_style(this.propValue, this.propScale),
                    border_style: this.get_border_style(this.propValue, this.propScale),
                    img_url: url,
                });
            },
            get_img_url(form) {
                if (!isEmpty(form.img[0])) {
                    return form.img[0];
                } else {
                    if (!isEmpty(this.propSourceList)) {
                        // 不输入商品， 文章和品牌时，从外层处理数据
                        let image_url = this.propSourceList[form.data_source_id];
                        // 如果是商品,品牌，文章的图片， 其他的切换为从data中取数据
                        if (['goods', 'article', 'brand'].includes(this.propSourceType) && !isEmpty(this.propSourceList.data)) {
                            // 判断是否是同一标志
                            if (form.data_source_id == this.keyMap[this.propSourceType]) {
                                // 如果是符合条件的标志，先判断新的图片是否存在，存在就取新的图片，否则的话取原来的图片
                                image_url = !isEmpty(this.propSourceList.new_cover)? this.propSourceList.new_cover[0]?.url || '' : this.propSourceList.data[this.keyMap[this.propSourceType]];
                            } else {
                                image_url = this.propSourceList.data[form.data_source_id];
                            }
                        }
                        return image_url;
                    } else {
                        return '';
                    }
                }
            },
            get_image_style(form, scale) {
                return `width: ${percentage_count(form.img_width, form.com_width)}; height: ${percentage_count(form.img_height, form.com_height)};transform: rotate(${form.img_rotate}deg); ${radius_computer(form.img_radius, scale, true)};`;
            },
            get_border_style(form, scale) {
                let style = ``;
                if (form.border_show == '1') {
                    style += `border: ${form.border_size * scale }px ${form.border_style} ${form.border_color}; ${radius_computer(form.border_radius, scale, true)};box-sizing: border-box;`;
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
