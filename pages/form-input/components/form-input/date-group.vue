<template>
    <view class="flex-row align-c wh-auto pr " :style="propStyle">
        <view class="bg-white wh-auto ht-auto flex-row align-c gap-5 oh">
            <template v-if="isEmpty(form_value)">
                <view class="datetime-placeholder flex-1 flex-row align-c ht-auto gap-5 oh">
                    <view class="flex-1 flex-row align-c jc-c" :data-index="0" @tap="data_time_change">{{ com_data.start_placeholder }}</view>-
                    <view class="flex-1 flex-row align-c jc-c" :data-index="1" @tap="data_time_change">{{ com_data.end_placeholder }}</view>
                </view>
            </template>
            <template v-else>
                <view class="datetime-value flex-1 flex-row align-c ht-auto gap-5 oh">
                    <view class="flex-1 flex-row align-c jc-c ht-auto nowrap text-line-1" :data-index="0" @tap="data_time_change">{{ form_value[0] || '' }}</view>-
                    <view class="flex-1 flex-row align-c jc-c ht-auto nowrap text-line-1" :data-index="1" @tap="data_time_change">{{ form_value[1] || '' }}</view>
                </view>
            </template>
            <iconfont :name="'icon-'+ com_data.icon_name" class="ml-5" size="28rpx" color="#333333" />
        </view>
        <template v-if="['option1', 'option2'].includes(date_type)">
            <myDatetime ref="option4" dataType="time" :shownum="date_type == 'option1' ? 2 : 3" @timeSubmit="data_change"></myDatetime>
        </template>
        <template v-else-if="date_type == 'option3'">
            <myDatetime ref="option4" :shownum="2" @timeSubmit="data_change"></myDatetime>
        </template>
        <template v-else>
            <view class="datetime-picker">
                <uni-datetime-picker ref="option4" :value="form_value" :border="false" :type="date_type == 'option4' ? 'daterange' : 'datetimerange'" :hideSecond="date_type !== 'option6'" @change="data_date_change" />
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
                form_index: 0,
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
                const date_list = [];
                if (!isEmpty(com_data.form_value)) {
                    com_data.form_value.forEach((item, index) => {
                        date_list[index] = time_stamp(item, com_data.date_style, com_data.date_type);
                    })
                }
                this.$nextTick(() => {
                    this.setData({
                        com_data: com_data,
                        placeholder: com_data?.placeholder,
                        form_value: date_list, 
                        date_style: com_data.date_style,
                        date_type: com_data.date_type,
                    });
                });
            },
            data_time_change(e) {
                if (['option1', 'option2', 'option3'].includes(this.date_type)) {
                    const index = e.currentTarget.dataset.index;
                    const val = this.form_value[index] || '';
                    this.setData({
                        form_index: e.currentTarget.dataset.index,
                    });
                    this.$refs.option4.open(val);
                } else {
                    this.$refs.option4.show();
                }
            },
            data_check(e) {
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, e.detail.value);
                this.$emit('dataCheck', { is_error, error_text, value: e.detail.value, id: this.propDataId });
            },
            data_change(e) {
                const date = time_stamp(e, this.date_style, this.date_type);
                const value = this.form_value;
                value[this.form_index] = date;
                const data = this.date_handle(value[0], value[1]);
                // 重新编辑一下历史数据
                this.setData({
                    form_value: data,
                });
                this.$emit('dataChange', { value: value, id: this.propDataId });
            },
            date_handle(time0, time1) {
                if (isEmpty(time0) || isEmpty(time1)) {
                    if (isEmpty(time0)) {
                        return [time1, time1];
                    } else {
                        return [time0, time0];
                    }
                } else {
                    let time_date0 = new Date(time0);
                    let time_date1 = new Date(time1);
                    if (['option1', 'option2'].includes(this.date_type)) {
                        const time_0 = '1970-01-01 ' + time0.replace(/时|分|秒/g, ':').replace(/:+$/, '');
                        const time_1 = '1970-01-01 ' + time1.replace(/时|分|秒/g, ':').replace(/:+$/, '');
                        time_date0 = new Date(time_0);
                        time_date1 = new Date(time_1);
                    } else {
                        time_date0 = new Date(time0);
                        time_date1 = new Date(time1);
                    }
                    // 如果开始时间大于结束时间，开始时间就是结束时间
                    if (time_date0 > time_date1) {
                        return [time1, time1];
                    } else if (time_date1 < time_date0) {
                        // 如果结束时间小于开始时间，结束时间就是开始时间
                        return [time0, time0];
                    } else {
                        // 否则的话，返回原本的数据
                        return [time0, time1];
                    }
                }
            },
            data_date_change(e) { 
                let date = [];
                e.forEach((item, index) => {
                    date[index] = time_stamp(item, this.date_style, this.date_type);
                })
                // 重新编辑一下历史数据
                this.setData({
                    form_value: date,
                });
                this.$emit('dataChange', { value: date, id: this.propDataId });
            },
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