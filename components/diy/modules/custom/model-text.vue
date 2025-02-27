<template>
    <view v-if="is_show" class="img-outer wh-auto ht-auto re oh" :style="com_style" @tap="url_event">
        <view :style="text_style" :class="'break ' + text_line_class">
            <template v-if="form.is_rich_text == '1'">
                <mp-html :content="text_title" />
            </template>
            <template v-else>
                {{ text_title }}
            </template>
        </view>
    </view>
</template>
<script>
    import { radius_computer, padding_computer, isEmpty, gradient_handle, get_nested_property, get_custom_link, get_is_eligible, custom_condition_data } from '@/common/js/common/common.js';
    
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
            propTitleParams: {
                type: String,
                default: 'name'
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
                text_url: '',
                keyMap: {
                    goods: 'title',
                    article: 'title',
                    brand: 'name'
                },
                is_show: true,
                text_line_class: ''
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
                if (!isEmpty(new_form.text_link)) {
                    url = new_form.text_link?.page || '';
                } else {
                    // 获取数据源ID
                    const data_source_link_id = !isEmpty(new_form?.data_source_link_field?.id || '') && this.propConfigLoop == '1' ? new_form.data_source_link_field.id : '';
                    // 数据源内容
                    const source_link_option = new_form?.data_source_link_field?.option || {};
                    // 调用方法处理数据显示
                    url = get_custom_link(data_source_link_id, this.propSourceList, source_link_option);
                }
                this.setData({
                    form: new_form,
                    text_title: (new_form?.text_captions || '') + this.get_text_title(new_form),
                    text_style: this.get_text_style(new_form, this.propScale),
                    com_style: this.get_com_style(new_form, this.propScale),
                    text_url: url,
                    is_show: this.get_is_show(new_form),
                    text_line_class: new_form.width_omit_num == '0' || new_form.is_rich_text == '1' ? '' : `text-line-${ new_form?.width_omit_num || '' }`
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
            get_text_title(form) {
                let text = '';
                if (!isEmpty(form.text_title)) {
                    // 存储待处理的文本标题
                    let new_title = JSON.parse(JSON.stringify((form.text_title)));
                    let new_field_list = this.propFieldList;
                    // 判断是否是自定义组
                    if (this.propIsCustomGroup && !isEmpty(this.propCustomGroupFieldId)) {
                        // 取出对应自定义组的内容
                        const group_option_list = new_field_list.find((item) => item.field === this.propCustomGroupFieldId);
                        // 取出自定义组内部数据源参数的详细数据
                        new_field_list = group_option_list?.data || [];
                    }
                    // 遍历字段列表，替换文本标题中的占位符
                    if (!isEmpty(new_field_list)) {
                        new_field_list.forEach((item) => {
                            const new_field = '${' +  item.field + '}';
                            if (form.text_title.includes(new_field)) {
                                // 获取到字段的真实数据
                                const field_value = custom_condition_data(item.field, item, this.propSourceList, this.propIsCustom);
                                // 使用正则表达式替换文本标题
                                const regular = new RegExp(`\\$\\{\\s*${item.field}\\s*\\}`, 'g');
                                // 替换后的内容赋值给原内容, 确保后续可以继续替换
                                new_title = new_title.replace(regular, field_value);
                            }
                        });
                    }
                    // 将内容替换为处理后的标题
                    text = new_title;
                } else {
                    let text_title = '';
                    // 获取数据源ID
                    const data_source_id = !isEmpty(form?.data_source_field?.id || []) && this.propConfigLoop == '1' ? form?.data_source_field?.id : [];
                    // 数据源内容
                    const option = form?.data_source_field?.option || [];
                    // 多选判断
                    if (data_source_id.length > 0) {
                        text_title += form?.data_split?.left || '';
                        // 遍历取出所有的值
                        data_source_id.forEach((source_id, index) => {
                            const sourceList = option.find((item) => item.field == source_id);
                            // 根据数据源ID是否包含点号来区分处理方式
                            if (source_id.includes(';')) {
                                const ids = source_id.split(';');
                                let source_text = '';
                                ids.forEach((item, index) => {
                                    source_text += this.data_handling(item) + (index != ids.length - 1 ? (sourceList?.join || '') : '');
                                });
                                text_title += (sourceList?.first || '') + source_text + (sourceList?.last || '');
                            } else {
                                text_title += (sourceList?.first || '') + this.data_handling(source_id) + (sourceList?.last || '');
                            }
                            if (index < data_source_id.length - 1) {
                                text_title += form?.data_split?.middle || '';
                            }
                        });
                        text_title += form?.data_split?.right || '';
                    }
                    // 如果是商品的标题或者是品牌的名称，需要判断是否有新的标题，没有的话就取原来的标题
                    text = text_title;
                }
                return text;
            },
            data_handling(data_source_id) {
                let text = get_nested_property(this.propSourceList, data_source_id);
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
                return text;
            },
            get_text_style(form, scale) {
                let style = `font-size: ${form.text_size * scale }px;line-height: ${ (typeof form.line_text_size === "number" ? form.line_text_size : form.text_size) * scale }px;color: ${form.text_color}; text-align: ${form.text_location}; transform: rotate(${form.text_rotate}deg);text-decoration: ${form.text_option};${padding_computer(form.text_padding, scale, true)};box-sizing: border-box;`;
                if (form.text_weight == 'italic') {
                    style += `font-style: italic`;
                } else if (['bold', '500'].includes(form.text_weight)) {
                    style += `font-weight: bold;`;
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
                this.$emit('url_event', this.text_url)
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
