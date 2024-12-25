<template>
    <view class="img-outer pr oh flex-row align-c wh-auto ht-auto" :style="com_style" :data-value="icon_url" @tap="url_event">
        <iconfont :name="'icon-' + icon_class" :color="form.icon_color" :size="form.icon_size * scale + 'px'" propContainerDisplay="flex"></iconfont>
    </view>
</template>
<script>
    import { radius_computer, padding_computer, gradient_handle, isEmpty, get_nested_property, get_custom_link } from '@/common/js/common/common.js';
    
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
            propIsCustom: {
                type: Boolean,
                default: false
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
                        let icon = '';
                        // 获取数据源ID
                        const data_source_id = this.propValue?.data_source_field?.id || '';
                        // 数据源内容
                        const option = this.propValue?.data_source_field?.option || {};
                        if (data_source_id.includes(';')) {
                            const ids = data_source_id.split(';');
                            let url = '';
                            ids.forEach((item, index) => {
                                url += this.data_handling(item) + (index != ids.length - 1 ? (option?.join || '') : '');
                            });
                            icon = url;
                        } else {
                            // 不输入商品， 文章和品牌时，从外层处理数据
                            icon = this.data_handling(data_source_id);
                        }
                        icon_class_value = (option?.first || '') + icon + (option?.last || '');
                    } else {
                        icon_class_value = '';
                    }
                }
                this.setData({
                    form: this.propValue,
                    scale: this.propScale,
                    com_style: this.get_com_style(this.propValue, this.propScale),
                    icon_class: icon_class_value,
                    icon_url: this.get_icon_link(),
                });
            },
            get_icon_link() {
                let url = '';
                if (!isEmpty(this.propValue.icon_link)) {
                    url = this.propValue.icon_link?.page || '';
                } else {
                    // 获取数据源ID
                    const data_source_link_id = this.propValue?.data_source_link_field?.id || '';
                    // 数据源内容
                    const source_link_option = this.propValue?.data_source_link_field?.option || {};
                    url = get_custom_link(data_source_link_id, this.propSourceList, source_link_option)
                }
                return url;
            },
            data_handling(data_source_id) {
                // 不输入商品， 文章和品牌时，从外层处理数据
                let icon = get_nested_property(this.propSourceList, data_source_id);
                // 如果是商品,品牌，文章的图片， 其他的切换为从data中取数据
                if (this.propIsCustom && !isEmpty(this.propSourceList.data)) {
                    icon = get_nested_property(this.propSourceList.data, data_source_id);
                }
                return icon;
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
