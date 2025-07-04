<template>
    <view class="flex-col gap-10">
        <view class="flex-row align-c" :style="com_data.common_style + propStyle" @tap="open_ragion">
            <text v-if="province_name" class="flex-1">{{ province_name }}{{ city_name ? ' / ' + city_name : '' }}{{ county_name ? ' / ' + county_name : '' }}</text>
            <text v-else class="placeholder flex-1">{{ placeholder }}</text>
            <template v-if="propDirection == 'row'">
                <iconfont name="icon-arrow-right" size="24rpx" color="#666" propContainerDisplay="flex"></iconfont>
            </template>
            <template v-else>
                <iconfont name="icon-arrow-bottom" size="24rpx" color="#666" propContainerDisplay="flex" ></iconfont>
            </template>
        </view>
        <view v-if="address_type == 'detailed'" class="flex-row">
            <textarea :value="detailed_value" class="uni-input flex-1 ht-auto" :style="com_data.common_style + propStyle + 'padding: 18rpx 22rpx;min-height:100rpx;'" placeholder="请输入详细地址" @input="input_value_event" />
        </view>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty, formatNumber } from '@/common/js/common/common.js';
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
            propDirection: {
                type: String,
                default: 'row',
            }
        },
        data() {
            return {
                placeholder: '请选择内容...',
                address_type: '',
                form_value: '',
                detailed_value: '',
                com_data: {},
                region_picker_show: false,
                province_id: '',
                city_id: '',
                county_id: '',
                province_name: '',
                city_name: '',
                county_name: '',
            };
        },
        watch: {
            propValue(val) {
                this.init();
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
                    address_type: com_data.address_type || 'noDetailed',
                    placeholder: com_data.placeholder,
                    form_value: com_data.form_value , 
                    detailed_value: com_data?.detailed_value || '',
                    province_id: com_data?.form_value[0] || '',
                    city_id: com_data?.form_value[1] || '',
                    county_id: com_data?.form_value[2] || '',
                    province_name: com_data.province_name || '',
                    city_name: com_data.city_name || '',
                    county_name: com_data.county_name || '',
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
            open_ragion() {
                this.$emit('openRagion', this.propDataId, this.province_id, this.city_id, this.county_id);
            },
            data_check(val) {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, val, true, 'number');
                this.$emit('dataCheck', { is_error, error_text, value: val, id: this.propDataId });
            },
            input_value_event(e) {
                // 重新编辑一下历史数据
                this.setData({
                    detailed_value: e.detail.value,
                });
                this.$emit('dataAddressChange', { value: e.detail.value, id: this.propDataId });
            }
        }
    }
</script>

<style lang="scss" scoped>
.number-icon {
    color: #ccc;
}
.placeholder {
    color: #606266;
    opacity: 0.6;
}
</style>