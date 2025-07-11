<template>
    <view class="flex-row align-c wh-auto" :style="propStyle">
        <input :value="form_value" class="uni-input flex-1" :style="propStyle" type="text" :placeholder="placeholder" :maxlength="max_length" @blur="data_check" @input="input_value_event" />
        <view class="input-limit-num" v-if="com_data.is_limit_num == '1' && !isEmpty(com_data.max_num)">{{ form_value.length }}/{{ com_data.max_num }}</view>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
            propDataId: {
                type: String,
                default: '',
            },
            propStyle: {
                type: String,
                default: '',
            }
        },
        data() {
            return {
                placeholder: '请输入内容...',
                form_value: '',
                com_data: {},
                max_length: '-1'
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
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                const com_data = this.propValue;
                this.setData({
                    com_data: com_data,
                    max_length: com_data.is_limit_num == '1' && !isEmpty(com_data.max_num) ? com_data.max_num : '-1',
                    placeholder: com_data.placeholder,
                    form_value: com_data?.form_value || '', 
                });
            },
            data_check(e) {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, e.detail.value);
                this.$emit('dataCheck', { is_error, error_text, value: e.detail.value, id: this.propDataId });
            },
            input_value_event(e) {
                // 重新编辑一下历史数据
                this.setData({
                    form_value: e.detail.value,
                });
                this.$emit('dataChange', { value: e.detail.value, id: this.propDataId });
            }
        }
    }
</script>

<style lang="scss" scoped>
.input-limit-num {
    margin-left: 20rpx;
} 
</style>