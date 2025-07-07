<template>
    <view class="wh-auto">
        <view class="flex-row align-c wh-auto gap-10" :style="propStyle" @tap="data_value_event">
            <view class="flex-1 oh">
                <template v-if="isEmpty(form_value_data)"><view class="placeholder cr-gray text-line-1">{{ placeholder }}</view></template>
                <template v-else>
                    <view :class="'flex-row align-c' + (is_multicolour == '1' ? ' gap-10' : '')">
                        <view class="text-size-sm nowrap text-line-1" v-for="(item, index) in form_value_data" :key="index" :style="is_multicolour == '1' ? 'background:' + item.color + ';color:' + (item.is_other == '1' ? '#141E31' : '#fff') + ';border-radius:8rpx;' + color_style : color_style + 'padding-left:0rpx;padding-right:0rpx;'">{{ item.name || item.value  }}{{ index != form_value_data.length - 1 && is_multicolour !== '1' ? ',' : ''}}</view>
                    </view>
                </template>
            </view>
            <template v-if="propDirection == 'row'">
                <iconfont name="icon-arrow-right" size="24rpx" color="#666" propContainerDisplay="flex"></iconfont>
            </template>
            <template v-else>
                <iconfont name="icon-arrow-bottom" size="24rpx" color="#666" propContainerDisplay="flex" ></iconfont>
            </template>
        </view>
        <!-- 弹窗 -->
        <uni-popup ref="selectPopup" type="bottom" class="popup-bottom" background-color="#fff" :animation="true" @maskClick="quick_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white popup-content flex-col">
                <!-- 头部的样式 -->
                <view class="flex-row jc-sb margin-bottom">
                    <view class="text-size-sm cr-blue" @tap.stop="quick_close_event">取消</view>
                    <view class="text-size-sm cr-blue" @tap.stop="data_change">确定</view>
                </view>
                <!-- 内容区域的样式 -->
                <view class="flex-1 flex-col gap-10">
                    <view class="flex-row popup-search align-c gap-10">
                        <iconfont name="icon-search" size="32rpx" color="#666" propContainerDisplay="flex"></iconfont>
                        <input :value="popup_search_value" class="uni-input flex-1" type="text" placeholder="搜索(多个关键字用空格隔开)" @input="search_input" />
                    </view>
                    <template v-if="new_option_list.length > 0">
                        <view :class="'flex-col gap-10 mt-10 ' + ( com_data.is_add_option == '1' ? 'popup-add-list' : 'popup-list')">
                           <checkbox-group @change="data_all_change" class="flex-col gap-10">
                                <label class="popup-checkbox flex-row">
                                    <checkbox value="all" :checked="select_value == 'all'" class="flex-row align-c" />
                                    <view :style="color_style + 'padding-left:0rpx;padding-right:0rpx;'">全选</view>
                                </label>
                            </checkbox-group>
                            <checkbox-group @change="data_checkbox_change" class="flex-col gap-10">
                                <label v-for="(item, index) in new_option_list" class="popup-checkbox flex-row" :key="index">
                                    <view>
                                        <checkbox :value="item.value" :checked="!isEmpty(popup_list) && popup_list.includes(item.value)" class="flex-row align-c" />
                                    </view>
                                    <view :style="is_multicolour == '1' ? 'background:' + item.color + ';color:' + (item.is_other == '1' ? '#141E31' : '#fff') + ';border-radius:8rpx;' + color_style : color_style + 'padding-left:0rpx;padding-right:0rpx;'">{{ item.name }}</view>
                                </label>
                            </checkbox-group>
                        </view>
                    </template>
                    <template v-else>
                        <view class="flex-1 flex-row align-c jc-c">
                            <view class="text-size-sm cr-grey">暂无数据</view>
                        </view>
                    </template>
                </view>
                <view v-if="com_data.is_add_option == '1'" class="add-option flex-row gap-10 align-c" @tap="add_option">
                    <iconfont name="icon-xzdz-tianjiabiaoq" size="14" color="#2a94ff"/>
                    <view class="size-14 cr-blue">添加选项</view>
                </view>
            </view>
        </uni-popup>
        <!-- 选项弹出框 -->
        <uni-popup ref="inputDialog" type="dialog">
            <uni-popup-dialog ref="inputClose" mode="input" title="输入内容" :value="dialog_value" before-close placeholder="请输入内容" @close="dialog_input_close" @confirm="dialog_input_confirm"></uni-popup-dialog>
        </uni-popup>
        <!-- 失败提示 -->
        <uni-popup ref="message" type="message">
            <uni-popup-message type="error" message="选项名称不能为空" :duration="2000"></uni-popup-message>
        </uni-popup>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty, get_color_style, color_change } from '@/common/js/common/common.js';
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
            },
            propDirection: {
                type: String,
                default: 'row',
            }
        },
        data() {
            return {
                placeholder: '请输入内容...',
                form_value: '',
                com_data: {},
                popup_status: false,
                is_multicolour: '0',
                option_list: [],
                popup_search_value: '',
                color_style: '',
                select_value: '',
                form_value_data: {},
                popup_list: [],
                dialog_value: '',
            };
        },
        watch: {
            propValue(val) {
                // 初始化
                this.init();
            },
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        computed: {
            new_option_list() {
               if (!isEmpty(this.popup_search_value)) {
                    const inputValue = this.popup_search_value.split(' ').filter(item => item !== '');
                    return this.option_list.filter((item) => inputValue.some(keyword => item.name.includes(keyword)));
                } else {
                    return this.option_list;
                }
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                const com_data = this.propValue;
                // 取出选择的中文名称和内容
                const data = com_data?.option_list.filter(item => com_data?.form_value.includes(item.value));
                let form_value_data = [];
                if (!isEmpty(data)) {
                    form_value_data = data;
                }
                this.setData({
                    com_data: com_data,
                    is_multicolour: com_data.is_multicolour,
                    placeholder: com_data?.placeholder,
                    option_list: com_data?.option_list.concat(com_data?.custom_option_list || []) || [],
                    custom_option_list: com_data?.custom_option_list || [],
                    color_style: get_color_style(this.propMobile),
                    form_value: com_data?.form_value || '',
                    popup_list: com_data?.form_value || [],
                    form_value_data: form_value_data,
                });
            },
            /**
             * 下拉框选择事件
             */
            data_value_event() {
                const count = this.new_option_list.reduce((acc, item) => this.form_value.includes(item.value) ? acc + 1 : acc, 0);
                this.setData({
                    select_value: count == this.new_option_list.length ? 'all' : '',
                    popup_list: this.form_value,
                });
                // 进行popup操作时，将当前组件的层级调到最高，避免弹出框被其他的盖住
                this.z_index_change(this.propDataId);
                this.$refs.selectPopup.open();
            },
            add_option() {
                this.setData({
                    dialog_value: '',
                })
                this.$refs.inputDialog.open();
            },
            dialog_input_confirm(val) {
                if (!isEmpty(val)) {
                    const value = 'option' + get_math();
                    const data = {
                        name: val,
                        value: value,
                        color: color_change(this.option_list.length - 1),
                    };
                    this.setData({
                        option_list: [...this.option_list, data],
                        popup_list: [...this.popup_list, value],
                        custom_option_list: [...this.custom_option_list, data],
                        dialog_value: '',
                    });
                    this.z_index_change('');
                    this.$refs.inputDialog.close();
                    this.$emit('dataOptionChange', { list: custom_option_list, value: this.form_value, id: this.propDataId });
                } else {
                    this.$refs.message.open();
                }
            },
            dialog_input_close() {
                this.$refs.inputDialog.close();
            },
            /**
             * 快速关闭事件
             */
            quick_close_event() {
                this.z_index_change('');
                this.$refs.selectPopup.close();
            },
            /**
             * 搜索事件
             * @param {*} e
            */
            search_input(e) {
                let list = this.option_list;
                if (!isEmpty(this.popup_search_value)) {
                    const inputValue = this.popup_search_value.split(' ').filter(item => item !== '');
                    list = this.option_list.filter((item) => inputValue.some(keyword => item.name.includes(keyword)));
                }
                const count = list.reduce((acc, item) => this.popup_list.includes(item.value) ? acc + 1 : acc, 0);
                // 搜索
                this.setData({
                    select_value: count == list.length ? 'all' : '',
                    popup_search_value: e.detail.value,
                });
            }, 
            data_all_change(e) {
                const selectAll = e.detail.value.includes('all');
                let val = selectAll ? this.option_list.map((item) => item.value) : [];
                if (!isEmpty(this.popup_search_value)) {
                    // 判断有多少个符合筛选条件的数据
                    const option_list_value = this.new_option_list.map((item) => item.value);
                    val = selectAll ? this.popup_list.concat(option_list_value) : this.popup_list.filter((item) => !option_list_value.includes(item))
                }
                this.setData({
                    select_value: e.detail.value,
                    popup_list: val,
                });
            },
            data_checkbox_change(e) {
                // 取出当前搜索到的数据
                const data = this.new_option_list.map(item => item.value);
                // 历史选中的去除当前搜索出来的数据
                const new_data = this.popup_list.filter(item => !data.includes(item));
                // 然后将两个数据进行合并得到所有选中的值
                const val = new_data.concat(e.detail.value);
                const count = this.new_option_list.reduce((acc, item) => val.includes(item.value) ? acc + 1 : acc, 0);
                this.setData({
                    select_value: count == this.new_option_list.length ? 'all' : '',
                    popup_list: val,
                });
            },
            /**
             * 点击弹出框的确定事件
             */
            data_change() {
                // 取出选择的中文名称和内容
                const data = this.option_list.filter(item => this.popup_list.includes(item.value));
                let form_value_data = [];
                if (!isEmpty(data)) {
                    form_value_data = data;
                }
                // 重新编辑一下历史数据
                this.setData({
                    form_value: this.popup_list,
                    form_value_data: form_value_data,
                });
                this.z_index_change('');
                this.$refs.selectPopup.close();
                const { is_error = '0', error_text = '' } = get_format_checks(this.com_data, this.popup_list, true, 'checkbox');
                // 校验数据
                this.$emit('dataCheck', { is_error, error_text, value: this.popup_list, id: this.propDataId });
                // 数据更新时的处理
                this.$emit('dataChange', { value: this.popup_list, id: this.propDataId });
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
.popup-content {
    height: 800rpx;
}
.popup-search {
    background: #f5f6f8;
    border-radius: 32rpx;
    padding: 0 20rpx;
    .uni-input {
        height: 64rpx;
    }
}
.popup-checkbox {
    padding: 0 0 20rpx 0;
    border-bottom: 2rpx solid #f5f6f8;
}
::v-deep .uni-radio-input {
    transform: scale(0.7);
}
.add-option {
    height: 80rpx;
}
.popup-add-list {
    max-height: 580rpx;
    overflow: hidden;
    overflow-y: auto;
}
.popup-list {
    max-height: 640rpx;
    overflow: hidden;
    overflow-y: auto;
}
</style>