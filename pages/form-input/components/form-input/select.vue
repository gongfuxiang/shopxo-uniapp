<template>
    <view class="wh-auto">
        <view class="flex-row align-c wh-auto" :style="propStyle" @tap="data_value_event">
            <view class="flex-1">
                <template v-if="isEmpty(form_value)"><view class="placeholder">{{ placeholder }}</view></template>
                <template v-else>
                    <view class="flex-row align-c">
                        <view class="text-size-sm" :style="is_multicolour == '1' ? 'background:' + form_value_data.color + ';color:' + (form_value_data.is_other == '1' ? '#141E31' : '#fff') + ';border-radius:8rpx;' + color_style : color_style + 'padding-left:0rpx;padding-right:0rpx;'">{{ form_value_data.name || form_value  }}</view>
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
        <uni-popup ref="selectPopup" type="bottom" class="popup-bottom" @onclose="quick_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white popup-content flex-col gap-10">
                <!-- 头部的样式 -->
                <view class="flex-row jc-sb">
                    <view class="text-size-sm cr-blue" @tap="quick_close_event">取消</view>
                </view>
                <!-- 内容区域的样式 -->
                <view class="flex-1 flex-col gap-10">
                    <view class="flex-row popup-search align-c gap-10">
                        <iconfont name="icon-search" size="32rpx" color="#666" propContainerDisplay="flex"></iconfont>
                        <input :value="popup_search_value" class="uni-input flex-1" type="text" placeholder="搜索(多个关键字用空格隔开)" @input="search_input" />
                    </view>
                    <template v-if="new_option_list.length > 0">
                        <view class="flex-col gap-10 mt-10 popup-list">
                            <radio-group @change="data_change" class="flex-col gap-10">
                                <label v-for="item in new_option_list" class="popup-radio" :key="item.value">
                                    <radio :value="item.value" :checked="!isEmpty(form_value) && form_value == item.value">
                                        <view :style="is_multicolour == '1' ? 'background:' + item.color + ';color:' + (item.is_other == '1' ? '#141E31' : '#fff') + ';border-radius:8rpx;' + color_style : color_style + 'padding-left:0rpx;padding-right:0rpx;'">{{ item.name }}</view>
                                    </radio>
                                </label>
                            </radio-group>
                        </view>
                    </template>
                    <template v-else>
                        <view class="flex-1 flex-row align-c jc-c">
                            <view class="text-size-sm cr-grey">暂无数据</view>
                        </view>
                    </template>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import { isEmpty, get_color_style } from '@/common/js/common/common.js';
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
                form_value_data: {},
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
                const data = com_data?.option_list.find(item => item.value == com_data?.form_value);
                let form_value_data = {};
                if (!isEmpty(data)) {
                    form_value_data = data;
                }
                this.setData({
                    com_data: com_data,
                    is_multicolour: com_data.is_multicolour,
                    placeholder: com_data.placeholder,
                    option_list: com_data?.option_list || [],
                    color_style: get_color_style(this.propMobile),
                    form_value: com_data?.form_value || '',
                    form_value_data: form_value_data,
                });
            },
            /**
             * 下拉框选择事件
             */
            data_value_event() {
                this.$refs.selectPopup.open();
            },
            /**
             * 快速关闭事件
             */
            quick_close_event() {
                this.$refs.selectPopup.close();
            },
            /**
             * 搜索事件
             * @param {*} e
             */
            search_input(e) {
                // 搜索
                this.setData({
                    popup_search_value: e.detail.value,
                });
            }, 
            /**
             * 输入事件
             * @param {*} e
             */
            data_change(e) {
                // 取出选择的中文名称和内容
                const data = this.new_option_list.find(item => item.value == e.detail.value);
                let form_value_data = {};
                if (!isEmpty(data)) {
                    form_value_data = data;
                }
                // 重新编辑一下历史数据
                this.setData({
                    form_value: e.detail.value,
                    form_value_data: form_value_data,
                });
                // 关闭选择框
                this.$refs.selectPopup.close();

                this.$emit('dataChange', { value: e.detail.value, id: this.propDataId });
            }
        }
    }
</script>

<style lang="scss" scoped>
.placeholder {
    color: gray;
}
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
.popup-radio {
    padding: 0 0 20rpx 0;
    border-bottom: 2rpx solid #f5f6f8;
}
::v-deep .uni-radio-input {
    transform: scale(0.7);
}
.popup-list {
    max-height: 660rpx;
    overflow: hidden;
    overflow-y: auto;
}
</style>