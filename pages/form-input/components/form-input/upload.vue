<template>
    <uploads :propKey="propKey" :propType="propType" :propData="form_value" :propMaxNum="max_num" :propPathType="pathType" :propBorderStyle="border_style" :propBusiness="propBusiness" @call-back="call_back"></uploads>
</template>

<script>
    import { isEmpty, common_form_styles_computer, get_format_checks } from '@/common/js/common/common.js';
    import uploads from '@/pages/form-input/components/form-input/modules/uploads.vue';
    export default {
        components: {
            uploads
        },
        props: {
            propType: {
                type: String,
                default: 'img',
            },
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
            propFormInputId: {
                type: [String, Number],
                default: '',
            },
            propDataId: {
                type: String,
                default: '',
            },
            propStyle: {
                type: String,
                default: '',
            },
            propIsCustom: {
                type: Boolean,
                default: false,
            },
            propBusiness: {
                type: [String, Number],
                default: '',
            }
        },
        data() {
            return {
                com_data: {},
                form_value: [],
                pathType: '',
                max_num: 1000,
                border_style: '',
            };
        },
        watch: {
            propValue: {
                handler(newVal) {
                    this.init();
                },
                deep: true
            },
            propKey(val) {
                // 初始化
                this.init();
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                const com_data = this.propValue;
                this.setData({
                    com_data: com_data,
                    max_num: com_data.is_limit_num == '1' ? com_data.limit : 1000,
                    pathType: `forminputdata-${this.propFormInputId}`,
                    form_value: com_data.form_value || [],
                    border_style: common_form_styles_computer(com_data.common_config)
                });
            },
            call_back(list = [], call_data = '') {
                this.setData({
                    form_value: list,
                });
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, list);
                this.$emit('dataCheck', { is_error, error_text, value: list, id: this.propDataId });
            }
        },
    };
</script>

<style></style>
