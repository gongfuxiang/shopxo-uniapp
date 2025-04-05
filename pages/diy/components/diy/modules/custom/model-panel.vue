<template>
    <view v-if="is_show" class="wh-auto ht-auto re oh" :style="com_style" @tap="url_event">
        <view class="wh-auto ht-auto" :style="com_img_style"></view>
    </view>
</template>
<script>
    import { radius_computer, background_computer, gradient_handle, isEmpty, get_custom_link, get_is_eligible } from '@/common/js/common/common.js';
    
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
                text_title: '',
                text_style: '',
                com_style: '',
                panel_url: '',
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
                let url = '';
                if (!isEmpty(new_form.link)) {
                    url = new_form.link?.page || '';
                } else {
                    // 获取数据源ID
                    const data_source_link_id = !isEmpty(new_form?.data_source_link_field?.id || '') && this.propConfigLoop == '1' ? new_form.data_source_link_field.id : '';
                    // 数据源内容
                    const source_link_option = new_form?.data_source_link_field?.option || {};
                    url = get_custom_link(data_source_link_id, this.propSourceList, source_link_option);
                }
                this.setData({
                    form: new_form,
                    com_style: this.get_com_style(new_form, this.propScale),
                    com_img_style: this.get_com_img_style(new_form),
                    panel_url: url,
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
            get_com_style(form, scale) {
                let style = `${ gradient_handle(form.color_list, form.direction) } ${radius_computer(form.bg_radius, scale, true)}; transform: rotate(${form.panel_rotate}deg);`;
                if (form.border_show == '1') {
                    style += `border: ${form.border_size * scale }px ${form.border_style} ${form.border_color};box-sizing: border-box;`;
                }
                return style;
            },
            get_com_img_style(form) {
                const data = {
                    background_img: form?.background_img || [],
                    background_img_style: form?.background_img_style || '2'
                }
                return background_computer(data);
            },
            url_event(e) {
                this.$emit('url_event', this.panel_url);
            },
        },
    };  
</script>
<style lang="scss" scoped>
    .break {
        word-wrap: break-word;
        word-break: break-all;
    }
    .rich-text-content {
        white-space: normal;
        word-break: break-all;
        * {
            max-width: 100%;
        }
    }
</style>
