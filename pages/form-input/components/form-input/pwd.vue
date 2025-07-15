<template>
    <view class="flex-row align-c wh-auto gap-10" :style="propStyle">
        <iconfont :name="'icon-' + com_data.icon_name" size="24rpx" color="#666" propContainerDisplay="flex" ></iconfont>
        <input :value="form_value" class="uni-input flex-1" :style="propStyle" :password="is_show" :type="is_show ? '' : 'text'" :placeholder="placeholder" placeholder-style="color: gray;" @blur="data_check" @input="input_value_event" />
        <view @tap="eye_change">
            <iconfont :name="'icon-' + (is_show ? 'eye' : 'eye-close')" size="24rpx" color="#666" propContainerDisplay="flex"></iconfont>
        </view>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty } from '@/common/js/common/common.js';
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
            }
        },
        data() {
            return {
                placeholder: '请输入内容...',
                form_value: '',
                is_show: true,
                com_data: {},
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
                    placeholder: com_data.placeholder,
                    form_value: com_data?.form_value || '', 
                    is_show: true,
                });
            },
            eye_change() {
                this.setData({
                    is_show: !this.is_show
                });
            },
            data_check() {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, this.form_value, false);
                this.$emit('dataCheck', { is_error, error_text, value: this.form_value, id: this.propDataId });
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
.number-icon {
    color: #ccc;
}
</style>