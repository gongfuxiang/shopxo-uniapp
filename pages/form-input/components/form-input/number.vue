<template>
    <view class="flex-row align-c wh-auto" :style="propStyle">
        <template v-if="com_data.is_display_money == '1'">
            <view class="number-icon padding-right-sm">{{ com_data.money_sign }}</view>
        </template>
        <input :value="form_value" class="uni-input flex-1" :style="propStyle" type="text" :placeholder="placeholder" @focus="focus_input" @blur="blur_input" @input="input_value_event" />
        <template v-if="com_data.format == 'percentage'">
             <view class="number-icon padding-left">%</view>
        </template>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty, formatNumber } from '@/common/js/common/common.js';
    const app = getApp();
    export default {
        name: 'diy',
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
            propDataIndex: {
                type: Number,
                default: 0,
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
                max_length: '-1',
                decimal_num: 0,
                is_thousandths_symbol: '0',
                format: '',
            };
        },
        watch: {
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
                    placeholder: com_data?.placeholder || '请输入内容...',
                    form_value: com_data?.form_value || '', 
                    decimal_num: com_data.is_decimal == '1' ? com_data.decimal_num : 0,
                    is_thousandths_symbol: com_data.is_thousandths_symbol,
                    format: com_data.format,
                });
            },
            focus_input(e) {
                let value = '';
                // 不为空的时候，获取焦点的时候将千分位的转化为数字避免用户输入的时候出现问题
                if (!isEmpty(e.detail.value)) {
                    value = Number(formatNumber(e.detail.value, false)).toFixed(this.decimal_num);
                }
                this.setData({
                    form_value: value,
                });
            },
            blur_input(e){
                if (!isEmpty(e.detail.value)) {
                    let all_list = e.detail.value.replace(/[^0-9.]/g, '');
                    // 去除不是数字和.的值
                    let num = Number(formatNumber(all_list, false)).toFixed(this.decimal_num);
                    // 为数字并且时千分位的是你
                    if (this.format == 'num' && this.is_thousandths_symbol == '1') {
                        // 如果有多个.的话，去除多个.
                        const parts = all_list.split('.');
                        if (parts.length > 2) {
                            // 如果有多个小数点，则只保留第一个
                            all_list = parts[0] + '.' + parts.slice(1).join('');
                        }
                        num = formatNumber(Number(formatNumber(all_list, false)).toFixed(this.decimal_num).toString(), true)
                    }
                    this.data_check(num);
                    this.setData({ 
                        form_value: num,
                    });
                } else {
                    this.setData({ 
                        form_value: '',
                    });
                    this.data_check('');
                }
            },
            data_check(val) {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, val, true, 'number');
                this.$emit('dataCheck', { is_error, error_text, value: val, index: this.propDataIndex });
            },
            input_value_event(e) {
                // 重新编辑一下历史数据
                this.setData({
                    form_value: e.detail.value,
                });
                this.$emit('dataChange', { value: e.detail.value, index: this.propDataIndex });
            }
        }
    }
</script>

<style lang="scss" scoped>
.number-icon {
    color: #ccc;
}
</style>