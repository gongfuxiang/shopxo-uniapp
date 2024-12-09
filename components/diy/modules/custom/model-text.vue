<template>
    <view class="img-outer wh-auto ht-auto re oh" :style="com_style" :data-value="text_url" @tap="url_event">
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
    import { radius_computer, padding_computer, isEmpty, gradient_handle, get_nested_property } from '@/common/js/common/common.js';
    
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
            propTitleParams: {
                type: String,
                default: 'name'
            },
        },
        data() {
            return {
                form: {},
                text_title: '',
                text_style: '',
                com_style: '',
                text_url: '',
                keyMap: {
                    goods: 'title',
                    article: 'title',
                    brand: 'name'
                }
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
                const data_source_link = this.propValue?.data_source_link;
                if (!isEmpty(this.propValue.text_link)) {
                    url = this.propValue.text_link?.page || '';
                } else if (!isEmpty(this.propSourceList.data)) {
                    url = get_nested_property(this.propSourceList.data, data_source_link);
                } else {
                    url = get_nested_property(this.propSourceList, data_source_link);
                }
                this.setData({
                    form: this.propValue,
                    text_title: this.get_text_title(this.propValue),
                    text_style: this.get_text_style(this.propValue, this.propScale),
                    com_style: this.get_com_style(this.propValue, this.propScale),
                    text_url: url,
                });
            },
            get_text_title(form) {
                let text = '';
                if (!isEmpty(form.text_title)) {
                    text = form.text_title;
                } else {
                    let image_url = '';
                    // 获取数据源ID
                    const data_source_id = form.data_source_id;
                    if (!data_source_id.includes('.')) {
                        text = this.propSourceList[data_source_id];
                        // 如果是商品的标题或者是品牌的名称，需要判断是否有新的标题，没有的话就取原来的标题
                        if (this.propIsCustom && !isEmpty(this.propSourceList.data)) {
                            // 其他的切换为从data中取数据
                            if (data_source_id == this.propTitleParams) {
                                // 如果是符合条件的标志，先判断新的标题是否存在，存在就取新的标题，否则的话取原来的标题
                                text = !isEmpty(this.propSourceList.new_title) ? this.propSourceList.new_title : this.propSourceList.data[data_source_id];
                            } else {
                                text = this.propSourceList.data[data_source_id];
                            }
                        }
                    } else {
                        // 多层级数据
                        const keys = data_source_id.split('.');
                        text = get_nested_property(this.propSourceList, data_source_id);
                        // 如果是商品的标题或者是品牌的名称，需要判断是否有新的标题，没有的话就取原来的标题
                        if (this.propIsCustom && !isEmpty(this.propSourceList.data)) {
                            // 其他的切换为从data中取数据
                            if (data_source_id == this.propTitleParams) {
                                // 如果是符合条件的标志，先判断新的标题是否存在，存在就取新的标题，否则的话取原来的标题
                                text = !isEmpty(this.propSourceList.new_title) ? this.propSourceList.new_title : get_nested_property(this.propSourceList.data, data_source_id);
                            } else {
                                text = get_nested_property(this.propSourceList.data, data_source_id);
                            }
                        }
                    }
                }
                return text;
            },
            get_text_style(form, scale) {
                let style = `font-size: ${form.text_size * scale }px;line-height: ${ (typeof form.line_text_size === "number" ? form.line_text_size : form.text_size) * scale }px;color: ${form.text_color}; text-align: ${form.text_location}; transform: rotate(${form.text_rotate}deg);text-decoration: ${form.text_option};${padding_computer(form.text_padding, scale, true)};box-sizing: border-box;`;
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
                    style += `border: ${form.border_size * scale }px ${form.border_style} ${form.border_color};box-sizing: border-box;`;
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
