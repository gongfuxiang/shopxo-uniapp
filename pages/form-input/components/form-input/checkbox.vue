<template>
    <view class="flex-col gap-5">
        <checkbox-group @change="data_change" :class="(com_data.arrangement == 'horizontal' ? 'flex-row flex-wrap' : 'flex-col') + ' gap-10'">
            <label v-for="item in option_list" :key="item.value" class="flex-row align-c margin-right-xxl">
                <view>
                    <checkbox :value="item.value" :checked="!isEmpty(form_value) && form_value.includes(item.value)" class="flex-row align-c" style="transform:scale(0.7)" />
                </view>
                <view class="flex-row align-c gap-5" :style="is_multicolour == '1' ? 'background:' + item.color + ';color:' + (item.is_other == '1' ? '#141E31' : '#fff') + ';border-radius:8rpx;' + color_style : color_style + 'padding-left:0rpx;padding-right:0rpx;'">
                    {{ item.name }}
                    <view v-if="item.type == 'add'" :data-value="item.value" @tap.stop="option_close_event">
                        <iconfont name="icon-close" :color="is_multicolour == '1' ? '#fff' : '#999'" size="32rpx"></iconfont>
                    </view>
                </view>
            </label>
        </checkbox-group>
        <view v-if="com_data.is_add_option == '1'" class="add-option flex-row gap-10 align-c" @tap="add_option">
            <iconfont name="icon-add-wide" size="14" color="#2a94ff"/>
            <view class="size-14 cr-blue">添加选项</view>
        </view>
        <!-- 选项弹出框 -->
        <uni-popup ref="inputDialog" type="dialog" class="forminput-popup" >
            <uni-popup-dialog ref="inputClose" mode="input" title="输入内容" :value="dialog_value" before-close placeholder="请输入内容" @close="dialog_input_close" @confirm="dialog_input_confirm"></uni-popup-dialog>
        </uni-popup>
        <!-- 失败提示 -->
        <uni-popup ref="message" type="message" class="forminput-popup">
            <uni-popup-message type="error" message="选项名称不能为空" :duration="2000"></uni-popup-message>
        </uni-popup>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty, get_color_style, get_math, color_change } from '@/common/js/common/common.js';
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
                custom_option_list: [],
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
                    custom_option_list: com_data?.custom_option_list || [],
                    option_list: com_data?.option_list.concat(com_data?.custom_option_list || []) || [],
                    form_value: com_data?.form_value || [], 
                });
            },
            add_option() {
                this.setData({
                    dialog_value: '',
                })
                this.$refs.inputDialog.open();
            },
            option_close_event(e) {
                const value = e.currentTarget.dataset.value;
                const new_custom_option_list = this.custom_option_list.filter(item => item.value != value);
                const new_value = this.form_value.filter(item => item != value);
                this.setData({
                    option_list: this.option_list.filter(item => item.value != value),
                    form_value: new_value,
                    custom_option_list: new_custom_option_list,
                });
                this.$emit('dataOptionChange', { list: new_custom_option_list, value: new_value, id: this.propDataId });
            },
            dialog_input_confirm(val) {
                if (!isEmpty(val)) {
                    const value = 'option' + get_math();
                    const data = {
                        type: 'add',
                        name: val,
                        value: value,
                        color: color_change(this.option_list.length),
                    };
                    const custom_option_list = [...this.custom_option_list, data];
                    this.setData({
                        option_list: [...this.option_list, data],
                        form_value: [...this.form_value, value],
                        custom_option_list: custom_option_list,
                        dialog_value: '',
                    });
                    this.$refs.inputDialog.close();
                    // 执行校验逻辑
                    this.data_check({ detail: { value: this.form_value } });
                    
                    this.$emit('dataOptionChange', { list: custom_option_list, value: this.form_value, id: this.propDataId });
                } else {
                    this.$refs.message.open();
                }
            },
            dialog_input_close() {
                this.$refs.inputDialog.close();
            },
            data_check(e) {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, e.detail.value, true, 'checkbox');
                this.$emit('dataCheck', { is_error, error_text, value: e.detail.value, id: this.propDataId });
            },
            data_change(e) {
                // 重新编辑一下历史数据
                this.setData({
                    form_value: e.detail.value,
                });
                // 执行校验逻辑
                this.data_check(e);
                // 将值传递给父级组件
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