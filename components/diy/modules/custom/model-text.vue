<template>
    <view class="img-outer wh-auto ht-auto re oh" :style="com_style" :data-value="form.text_link.page" @tap="url_event">
        <view :style="text_style" class="break">
            <template v-if="form.is_rich_text == '1'">
                <view class="rich-text-content" :innerHTML="text_title"></view>
            </template>
            <template v-else>
                {{ text_title }}
            </template>
        </view>
    </view>
</template>
<script>
    import { radius_computer, padding_computer, isEmpty, gradient_handle } from '@/common/js/common/common.js';
    
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
                this.setData({
                    form: this.propValue,
                    text_title: this.get_text_title(this.propValue),
                    text_style: this.get_text_style(this.propValue, this.propScale),
                    com_style: this.get_com_style(this.propValue, this.propScale),
                });
            },
            get_text_title(form) {
                let text = '';
                if (!isEmpty(form.text_title)) {
                    text = form.text_title;
                } else if (!isEmpty(this.propSourceList[form.data_source_id])) {
                    text = this.propSourceList[form.data_source_id];
                }
                return text;
            },
            get_text_style(form, scale) {
                let style = `font-size: ${form.text_size * scale }px;line-height: ${form.text_size * scale }px;color: ${form.text_color}; text-align: ${form.text_location}; transform: rotate(${form.text_rotate}deg);text-decoration: ${form.text_option};${padding_computer(form.text_padding, scale, true)};box-sizing: border-box;`;
                if (form.text_weight == 'italic') {
                    style += `font-style: italic`;
                } else if (form.text_weight == '500') {
                    style += `font-weight: 500`;
                }
                return style;
            },
            get_com_style(form, scale) {
                let style = `${ gradient_handle(form.color_list, form.direction) } ${radius_computer(form.bg_radius, scale, true)}`;
                if (form.border_show == '1') {
                    style += `border: ${form.border_size * scale }px ${form.border_style} ${form.border_color};`;
                }
                // 是富文本并且开启了上下滚动的开关
                if (form.is_rich_text == '1' && form.is_up_down == '1') {
                    style += `overflow-y: auto;`;
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
