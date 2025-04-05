<template>
    <view v-if="is_show" class="img-outer pr wh-auto ht-auto" :style="border_style" @tap="url_event">
        <image-empty :propImageSrc="img" :propStyle="image_style" propErrorStyle="width: 60rpx;height: 60rpx;"></image-empty>
    </view>
</template>
<script>
    import { percentage_count, radius_computer, isEmpty, get_nested_property, get_custom_link, get_is_eligible } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
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
            propIsCustom: {
                type: Boolean,
                default: false
            },
            propIsCustomGroup: {
                type: Boolean,
                default: false
            },
            propImgParams: {
                type: String,
                default: ''
            },
            propCustomGroupFieldId: {
                type: String,
                default: ''
            },
            propFieldList: {
                type: Array,
                default: []
            },
            propConfigLoop: {
                type: String,
                default: "1"
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
                is_show: true,
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
                const new_form = this.propValue;
                this.setData({
                    form: new_form,
                    img: this.get_img_url(new_form),
                    image_style: this.get_image_style(new_form, this.propScale),
                    border_style: this.get_border_style(new_form, this.propScale),
                    img_url: this.get_img_link(new_form),
                    is_show: this.get_is_show(new_form),
                });
            },
            get_is_show(form) {
                if (this.propConfigLoop == '1') {
                    // 取出条件判断的内容
                    const condition = form?.condition || { field: '', type: '', value: '' };
                    return get_is_eligible(this.propFieldList, condition, this.propSourceList, this.propIsCustom, this.propIsCustomGroup, this.propCustomGroupFieldId);
                } else {
                    return true;
                }
            },
            get_img_link(form) {
                let url = '';
                if (!isEmpty(form.link)) {
                    url = form.link?.page || '';
                } else {
                    // 获取数据源ID
                    const data_source_link_id = !isEmpty(form?.data_source_link_field?.id || '') && this.propConfigLoop == '1' ? form.data_source_link_field.id : '';
                    // 数据源内容
                    const source_link_option = form?.data_source_link_field?.option || {};
                    url = get_custom_link(data_source_link_id, this.propSourceList, source_link_option)
                }
                return url;
            },
            get_img_url(form) {
                if (!isEmpty(form.img[0])) {
                    return form.img[0];
                } else {
                    if (!isEmpty(this.propSourceList)) {
                        let image_url = '';
                        // 获取数据源ID
                        const data_source_id = !isEmpty(form?.data_source_field?.id || '') && this.propConfigLoop == '1' ? form.data_source_field.id : '';
                        // 数据源内容
                        const option = form?.data_source_field?.option || {};
                        if (data_source_id.includes(';')) {
                            const ids = data_source_id.split(';');
                            let url = '';
                            ids.forEach((item, index) => {
                                url += this.data_handling(item) + (index != ids.length - 1 ? (option?.join || '') : '');
                            });
                            image_url = url;
                        } else {
                            image_url = this.data_handling(data_source_id);
                        }
                        return (option?.first || '') + image_url + (option?.last || '');
                    } else {
                        return '';
                    }
                }
            },
            data_handling(data_source_id) {
                // 不输入商品， 文章和品牌时，从外层处理数据
                let image_url = get_nested_property(this.propSourceList, data_source_id);
                // 如果是商品,品牌，文章的图片， 其他的切换为从data中取数据
                if (this.propIsCustom && !isEmpty(this.propSourceList.data)) {
                    // 判断是否是同一标志
                    if (data_source_id == this.propImgParams) {
                        // 如果是符合条件的标志，先判断新的图片是否存在，存在就取新的图片，否则的话取原来的图片
                        image_url = !isEmpty(this.propSourceList.new_cover)? this.propSourceList.new_cover[0]?.url || '' : get_nested_property(this.propSourceList.data, data_source_id);
                    } else {
                        image_url = get_nested_property(this.propSourceList.data, data_source_id);
                    }
                }
                return image_url;
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
                this.$emit('url_event', this.img_url);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .img-outer {
        overflow: hidden;
    }
</style>
