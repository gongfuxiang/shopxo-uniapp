<template>
    <view class="flex-col gap-10"> 
        <radio-group @change="data_change" :class="(com_data.arrangement == 'horizontal' ? 'flex-row flex-wrap' : 'flex-col') + ' gap-10'">
            <label v-for="item in option_list" :key="item.value" class="flex-row align-c margin-right-xxl">
                <view>
                    <radio :value="item.value" :checked="!isEmpty(form_value) && form_value.includes(item.value)" style="transform:scale(0.7)"/>
                </view>
                <view :style="is_multicolour == '1' ? 'background:' + item.color + ';color:' + (item.is_other == '1' ? '#141E31' : '#fff') + ';border-radius:8rpx;' + color_style : color_style + 'padding-left:0rpx;padding-right:0rpx;'">{{ item.name }}</view>
            </label>
        </radio-group>
        <template v-if="!isEmpty(option_value) && form_value == option_value">
            <input :value="other_value" class="uni-input" :style="propStyle"  type="text" placeholder="请输入其他内容" placeholder-style="color: gray;" @blur="data_other_check" @input="input_other_value_event" />
        </template>
    </view>
</template>

<script>
    import { isEmpty, get_color_style, get_format_checks } from '@/common/js/common/common.js';
    const app = getApp();
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
            },
            propMobile: {
                type: Object,
                default: () => ({}),
            }
        },
        data() {
            return {
                option_list: [],
                form_value: [],
                com_data: {},
                color_style: '',
                is_multicolour: '0',
                dialog_value: '',
                option_value: '',
                other_value: '',
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
                // 判断其他的code值是什么
                let option_value = '';
                const value_list = com_data?.option_list.filter((item) => item.is_other == '1');
                if (value_list.length > 0) {
                    option_value = value_list[0].value;
                }
                this.setData({
                    com_data: com_data,
                    is_multicolour: com_data.is_multicolour,
                    color_style: get_color_style(this.propMobile),
                    option_list: com_data?.option_list || [],
                    form_value: com_data?.form_value || [], 
                    other_value: com_data?.other_value || '',
                    option_value: option_value,
                });
            },
            input_other_value_event(e) {
                this.setData({
                    other_value: e.detail.value,
                });
                // 执行校验逻辑
                this.data_other_check({ detail: { value: this.other_value } });
                // 传递参数给父级
                this.$emit('dataOtherChange', { value: e.detail.value, id: this.propDataId });
            },
            data_other_check(e) {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, e.detail.value, false, '');
                this.$emit('dataOtherCheck', { is_error, error_text, value: e.detail.value, id: this.propDataId });
            },
            // 校验逻辑
            data_check(e) {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, e.detail.value, false, 'radio');
                this.$emit('dataCheck', { is_error, error_text, value: e.detail.value, id: this.propDataId });
            },
            data_change(e) {
                // 重新编辑一下历史数据
                this.setData({
                    form_value: e.detail.value,
                });
                // 执行校验逻辑
                this.data_check(e);
                // 传递参数给父级
                this.$emit('dataChange', { value: e.detail.value, id: this.propDataId });
            },
        }
    }
</script>

<style lang="scss" scoped>
.input-limit-num {
    margin-left: 20rpx;
} 
</style>