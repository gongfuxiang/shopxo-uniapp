<template>
    <view class="img-outer pr oh flex-row align-c wh-auto ht-auto" :style="com_style" :data-value="icon_url" @tap="url_event">
        <iconfont :name="'icon-' + icon_class" :color="form.icon_color" :size="form.icon_size * scale + 'px'" propContainerDisplay="flex"></iconfont>
    </view>
</template>
<script>
    import { radius_computer, padding_computer, gradient_handle, isEmpty } from '@/common/js/common/common.js';
    
    export default {
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
                default: 1,
            },
            propSourceType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                form: {},
                com_style: '',
                scale: 1,
                icon_class: '',
                icon_url: '',
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
                let icon_class_value = '';
                if (!isEmpty(this.propValue.icon_class)) {
                    icon_class_value = this.propValue.icon_class;
                } else {
                    if (!isEmpty(this.propSourceList)) {
                        // 不输入商品， 文章和品牌时，从外层处理数据
                        let icon = this.propSourceList[this.propValue.data_source_id];
                        // 如果是商品,品牌，文章的图片， 其他的切换为从data中取数据
                        if (['goods', 'article', 'brand'].includes(this.propSourceType) && !isEmpty(this.propSourceList.data)) {
                            icon = this.propSourceList.data[this.propValue.data_source_id];
                        }
                        icon_class_value = icon;
                    } else {
                        icon_class_value = '';
                    }
                }
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
                    scale: this.propScale,
                    com_style: this.get_com_style(this.propValue, this.propScale),
                    icon_class: icon_class_value,
                    icon_url: url,
                });
            },
            get_com_style(form, scale) {
                let style = `${ gradient_handle(form.color_list, form.direction) } ${ radius_computer(form.bg_radius, scale, true) };transform: rotate(${form.icon_rotate}deg);${ padding_computer(form.icon_padding, scale, true) };`;
                if (form.border_show == '1') {
                    style += `border: ${form.border_size * scale }px ${form.border_style} ${form.border_color};box-sizing: border-box;`;
                }
                if (form.icon_location == 'center') {
                    style += `justify-content: center;`;
                } else if (form.icon_location == 'left') {
                    style += `justify-content: flex-start;`;
                } else if (form.icon_location == 'right') {
                    style += `justify-content: flex-end;`;
                }
                return style;
            },
            url_event(e) {
                this.$emit('url_event', e)
            },
        },
    };  
</script>
<style lang="scss" scoped>
</style>
