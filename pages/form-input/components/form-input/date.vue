<template>
    <view class="flex-row align-c wh-auto pr" :style="propStyle">
        <view class="bg-white wh-auto ht-auto flex-row align-c" @tap="data_time_change">
            <template v-if="isEmpty(form_value)">
                <view class="cr-gray flex-1 text-line-1">{{ com_data.placeholder }}</view>
            </template>
            <template v-else>
                <view class="datetime-value flex-1 text-line-1">{{ form_value }}</view>
            </template>
            <iconfont :name="'icon-'+ com_data.icon_name" class="ml-5" size="28rpx" color="#333333" />
        </view>
        <template v-if="['option1', 'option2'].includes(date_type)">
            <myDatetime ref="option4" dataType="time" :shownum="date_type == 'option1' ? 2 : 3" @timeSubmit="data_date_change" @maskClick="mask_click"></myDatetime>
        </template>
        <template v-else-if="date_type == 'option3'">
            <myDatetime ref="option4" :shownum="2" @timeSubmit="data_date_change" @maskClick="mask_click"></myDatetime>
        </template>
        <template v-else>
            <view class="datetime-picker">
                <uni-datetime-picker ref="option4" :value="form_value" :border="false" :type="date_type == 'option4' ? 'date' : 'datetime'" :hideSecond="date_type !== 'option4'" @change="data_date_change" @maskClick="mask_click" />
            </view>
        </template>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty, time_stamp } from '@/common/js/common/common.js';
    import myDatetime from '@/pages/form-input/components/form-input/modules/my-datetime/my-datetime.vue';
    export default {
        components: {
            myDatetime
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
            }
        },
        data() {
            return {
                placeholder: '请输入内容...',
                form_value: '',
                com_data: {},
                date_style: '',
                date_type: 'option1',
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
                let date = com_data.form_value;
                if (!isEmpty(com_data.form_value)) {
                    date = time_stamp(com_data.form_value, com_data.date_style, com_data.date_type);
                }
                this.$nextTick(() => {
                    this.setData({
                        com_data: com_data,
                        placeholder: com_data.placeholder,
                        form_value: date, 
                        date_style: com_data.date_style,
                        date_type: com_data.date_type,
                    });
                });
            },
            data_time_change() {
                // 进行操作时，将当前组件的层级调到最高，避免弹出框被其他的盖住
                this.z_index_change(this.propDataId);
                if (['option1', 'option2', 'option3'].includes(this.date_type)) {
                    this.$refs.option4.open(this.form_value || '');
                } else {
                    this.$refs.option4.show();
                }
            },
            data_check(e) {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, e.detail.value);
                this.$emit('dataCheck', { is_error, error_text, value: e.detail.value, id: this.propDataId });
            },
            data_date_change(e) { 
                const date = time_stamp(e, this.date_style, this.date_type);
                // 重新编辑一下历史数据
                this.setData({
                    form_value: date,
                });
                this.z_index_change('');
                this.$emit('dataChange', { value: date, id: this.propDataId });
            },
            mask_click() {
                this.z_index_change('');
            },
            /**
             * 有值的时候就是将当前组件的层级调到最高，没有值的时候就是将当前组件的层级调回原样，避免弹出框出来的时候被其他组件盖住或悬浮在弹出框外部
             */
            z_index_change(e) {
                this.$emit('zIndexChange', e);
            }
        }
    }
</script>

<style lang="scss" scoped>
::v-deep .uniui-calendar::before {
    content: '',
}
.datetime-picker {
    position: absolute;
    top: 160rpx;
    left: 0;
    width: 0;
}
.datetime-placeholder {
    color: #606266;
    opacity: 0.6;
}
.datetime-value {
    color: #606266;
    line-height: 1.5;
}
</style>