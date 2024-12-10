<template>
    <view class="wh-auto ht-auto re oh" :style="com_style" :data-value="panel_url" @tap="url_event">
        <div class="wh-auto ht-auto" :style="com_img_style"></div>
    </view>
</template>
<script>
    import { radius_computer, background_computer, gradient_handle, isEmpty, get_custom_link } from '@/common/js/common/common.js';
    
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
            }
        },
        data() {
            return {
                form: {},
                text_title: '',
                text_style: '',
                com_style: '',
                panel_url: '',
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
                if (!isEmpty(this.propValue.link)) {
                    url = this.propValue.link?.page || '';
                } else {
                    // 获取数据源ID
                    const data_source_link_id = this.propValue?.data_source_link_field?.id || '';
                    // 数据源内容
                    const source_link_option = this.propValue?.data_source_link_field?.option || {};
                    url = get_custom_link(data_source_link_id, this.propSourceList, source_link_option);
                }
                this.setData({
                    form: this.propValue,
                    com_style: this.get_com_style(this.propValue, this.propScale),
                    com_img_style: this.get_com_img_style(this.propValue),
                    panel_url: url,
                });
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
                this.$emit('url_event', e);
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
