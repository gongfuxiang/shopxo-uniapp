<template>
    <view v-if="is_show" :style="border_style"></view>
</template>
<script>
    import { get_is_eligible } from '@/common/js/common/common.js';
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
            },
            propCustomGroupFieldId: {
                type: String,
                default: ''
            },
            propFieldList: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                form: {},
                border_style: '',
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
                    border_style: this.get_border_style(new_form, this.propScale),
                    is_show: this.get_is_show(new_form),
                });
            },
            get_is_show(form) {
                // 取出条件判断的内容
                const condition = form?.condition || { field: '', type: '', value: '' };
                return get_is_eligible(this.propFieldList, condition, this.propSourceList, this.propIsCustom, this.propCustomGroupFieldId);
            },
            get_border_style(form, scale) {
                if (form.line_settings === 'horizontal') {
                    return `margin: 10rpx 0;border-bottom: ${form.line_size * scale }px ${form.line_style} ${form.line_color};`;
                } else {
                    return `margin: 0 10rpx;height:100%;border-right: ${form.line_size * scale }px ${form.line_style} ${form.line_color};`;
                }
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>
