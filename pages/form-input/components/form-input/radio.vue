<template>
    <radio-group @change="data_change" class="flex-row gap-10 flex-wrap">
        <label v-for="item in option_list" :key="item.value">
            <radio :value="item.value" :checked="!isEmpty(form_value) && form_value.includes(item.value)">
                <view :style="is_multicolour == '1' ? 'background:' + item.color + ';color:' + (item.is_other == '1' ? '#141E31' : '#fff') + ';border-radius:8rpx;' + color_style : color_style + 'padding-left:0rpx;padding-right:0rpx;'">{{ item.name }}</view>
            </radio>
        </label>
    </radio-group>
</template>

<script>
    import { get_format_checks, isEmpty, get_color_style } from '@/common/js/common/common.js';
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
                    is_multicolour: com_data.is_multicolour,
                    color_style: get_color_style(this.propMobile),
                    option_list: com_data?.option_list || [],
                    form_value: com_data?.form_value || [], 
                });
            },
            data_change(e) {
                // 重新编辑一下历史数据
                this.setData({
                    form_value: e.detail.value,
                });
                this.$emit('dataChange', { value: e.detail.value, index: this.propDataIndex });
            },
        }
    }
</script>

<style lang="scss" scoped>
.input-limit-num {
    margin-left: 20rpx;
} 
</style>