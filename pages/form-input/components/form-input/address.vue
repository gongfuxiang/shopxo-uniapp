<template>
    <view>
        <view :class="'flex-col ' + (propDirection == 'row' ? '' : 'gap-10')">
            <view class="flex-row align-c" :style="com_data.common_style + propStyle" @tap="open_region">
                <text v-if="province_name" class="flex-1 text-line-1">{{ province_name }}{{ city_name ? ' / ' + city_name : '' }}{{ county_name ? ' / ' + county_name : '' }}</text>
                <text v-else class="cr-gray flex-1 text-line-1">{{ placeholder }}</text>
                <template v-if="propDirection == 'row'">
                    <iconfont name="icon-arrow-right" size="24rpx" color="#666" propContainerDisplay="flex"></iconfont>
                </template>
                <template v-else>
                    <iconfont name="icon-arrow-bottom" size="24rpx" color="#666" propContainerDisplay="flex" ></iconfont>
                </template>
            </view>
            <view v-if="propDirection == 'row' && address_type == 'detailed'" class="border-line"></view>
            <view v-if="address_type == 'detailed'" class="flex-row">
                <textarea :value="detailed_value" class="uni-input flex-1 ht-auto" :style="com_data.common_style + propStyle + 'min-height:100rpx;' + (propDirection == 'row' ? '' : 'padding: 18rpx 22rpx;')" placeholder="请输入详细地址" @input="input_value_event" />
            </view>
        </view>
        <component-region-picker :propProvinceId="province_id" :propCityId="city_id" :propCountyId="county_id" :propShow="region_picker_show" @onclose="close_event" @callBackEvent="region_event"></component-region-picker>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty, formatNumber } from '@/common/js/common/common.js';
    import componentRegionPicker from '@/pages/common/components/region-picker/region-picker';
    const app = getApp();
    export default {
        components: {
            componentRegionPicker,
        },
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
            // 打开地区选择器
            open_region(e) {
                this.setData({ 
                    region_picker_show: true, 
                });
                this.z_index_change(this.propDataId);
            },
            // 地区选择器关闭事件
            close_event(e) {
                this.setData({ 
                    region_picker_show: false 
                });
                this.z_index_change('');
            },
            // 地区选择器提交事件
            region_event(e) {
                let data = uni.getStorageSync(app.globalData.data.cache_region_picker_choice_key) || {};
                if((data.province || null) == null) {
                    data.province = {};
                }
                if((data.city || null) == null) {
                    data.city = {};
                }
                if((data.areal || null) == null) {
                    data.areal = {};
                }
                this.setData({
                    province_id: data.province.id || null,
                    city_id: data.city.id || null,
                    county_id: data.areal.id || null,
                    province_name: data.province.name || '',
                    city_name: data.city.name || '',
                    county_name: data.areal.name || '',
                });
                // 改变对应id的数据
                this.$emit('regionEvent', { value: [ data.province.id, data.city.id, data.areal.id ], province_name: data.province.name, city_name: data.city.name, county_name: data.areal.name, id: this.propDataId });
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
            },
            /**
             * 有值的时候就是将当前组件的层级调到最高，没有值的时候就是将当前组件的层级调回原样，避免弹出框出来的时候被其他组件盖住或悬浮在弹出框外部
             */
            z_index_change(e) {
                // 如果为空的时候延时关闭，避免因为关闭动画效果导致其他组件提前显示
                if (e == '') {
                    setTimeout(() => {
                        this.$emit('zIndexChange', e);
                    }, 400)
                } else {
                    this.$emit('zIndexChange', e);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.number-icon {
    color: #ccc;
}
.border-line {
    border-top: 2rpx solid #eee;
    margin: 10rpx 0;
}
</style>