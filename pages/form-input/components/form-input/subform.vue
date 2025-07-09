<template>
    <view class="wh-auto ht-auto flex-col gap-10">
        <!-- 标题显示处理 -->
        <view class="flex-row align-c jc-sb">
            <view class="flex-1 flex-row align-c gap-10">
                <view class="flex-row align-c" :style="propTitleStyle">{{ com_data.title }}<view v-if="com_data.is_required == '1'" class="required">*</view></view>
                <view v-if="com_data.common_config && com_data.common_config.help_is_show == '1' && !isEmpty(com_data.common_config.help_explain)" :data-value="com_data.common_config.help_explain" @tap="help_icon_event">
                    <iconfont name="icon-miaosha-hdgz" :size="propHelpIconStyle" color="#999"></iconfont>
                </view>
            </view>
            <view class="flex-row align-c gap-10">
                <button class="title_btn" @tap="add_item">
                    <iconfont name="icon-add" size="24rpx" color="#2196F3" propContainerDisplay="flex"></iconfont>
                </button>    
                <button v-if="!isEmpty(data_list)" class="title_btn flex-row align-c gap-10" :data-value="is_all_away" @tap="expand_all">{{ is_all_away ?  '全部收起' : '全部展开' }}<iconfont :name="is_all_away ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx" color="#2196F3" propContainerDisplay="flex"></iconfont></button>
            </view>
        </view>
        <view v-if="mobile.arrange == 'direction'" class="direction-style">
            <view v-for="(item, index) in data_list" :key="index" class="subform-line oh" :style="'height:' + (item.is_expand ? '100%;' : '150rpx;')">
                <!-- 标题操作 -->
                <view class="subform-title-btns flex-row align-c jc-sb">
                    <span class="subform-number">{{ index + 1 }}</span>
                    <view class="flex-row align-c gap-10">
                        <view class="cr-blue size-12" :data-index="index" @tap="more_click">更多</view>
                        <view class="cr-blue size-12" :data-index="index" @tap="delete_item">删除</view>
                        <view class="cr-blue size-12 flex-row align-c gap-5" :data-index="index" @tap="expand_or_collapse">{{ item.is_expand ? '收起' : '展开' }}<iconfont :name="item.is_expand ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx" color="#2196F3" propContainerDisplay="flex"></iconfont></view>
                    </view>
                </view>
                <view>
                    <template v-if="!item.is_expand">
                        <view :class="'flex-row align-c jc-s gap-5 expand-title text-line-1 nowrap' + (is_error(item.data_list) ? ' required-error' : '')">
                            <template v-if="!isEmpty(show_list(item.data_list))">
                                <view v-for="(briefing_item, briefing_index) in show_list(item.data_list)" :key="briefing_index" class="flex-row align-c gap-5">
                                    <view :class="data_conversion(briefing_item) == 'empty_conversion' ? 'empty' : ''">{{ data_conversion(briefing_item) == 'empty_conversion' ? '暂无内容' : data_conversion(briefing_item) }}</view><span v-if="briefing_index < show_list(item.data_list).length - 1" class="empty">|</span>
                                </view>
                            </template>
                            <template v-else>
                                暂无数据
                            </template>
                        </view>
                    </template>
                    <template v-else>
                        <subform-component-show
                            :propValue="filteredDiyData(item.data_list)"
                            :propFieldLabelStyle="propFieldLabelStyle"
                            :propTitleStyle="propTitleStyle"
                            :propHelpIconStyle="propHelpIconStyle"
                            :propDataFormId="propDataFormId"
                            :propKey="propKey"
                            :propIndex="index"
                            propDirection="row" 
                            :propMobile="propMobile" 
                            :propComponentStyle="propStyle"
                            @dataChange="data_change"
                            @dataCheck="data_check"
                            @dataOptionChange="data_option_change"
                            @openRegion="open_region"
                            @helpIconEvent="help_icon_event"
                            @regionEvent="region_event"
                            @zIndexChange="z_index_change"
                        />
                    </template>
                </view>
            </view>
            <view class="direction-bottom flex-row align-c jc-c gap-10 cr-blue" :style="( data_list.length > 0 ? 'border-top: 2rpx solid #ccc;' : '')" @tap="add_item">
                <iconfont name="icon-add" size="32rpx" color="#2196F3" propContainerDisplay="flex"></iconfont>
                添加记录
            </view>
        </view>
        <view v-else>

        </view>
        <!-- 弹窗 -->
        <uni-popup ref="morePopup" type="bottom" class="popup-bottom" background-color="#fff" :animation="true" @maskClick="quick_close_event">
            <view class="bg-white popup-content action-sheet">
                <view class="action-sheet-item" data-value="copy" @tap="copy">复制到下一行</view>
                <view class="action-sheet-item" data-value="copy_last" @tap="copy">复制到最后一行</view>
                <view class="action-sheet-item" data-value="insert_up" @tap="copy">向上插入记录</view>
                <view class="action-sheet-item" data-value="insert_down" @tap="copy" >向下插入记录</view>
                <view class="action-sheet-segment"></view>
                <view class="action-sheet-item" @tap="quick_close_event">取消</view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import { isEmpty } from '@/common/js/common/common.js';
    import subformComponentShow from '@/pages/form-input/components/form-input/modules/subform-component-show/index.vue';
    export default {
        components: {
            subformComponentShow
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
            propFieldLabelStyle: {
                type: String,
                default: '',
            },
            propTitleStyle: {
                type: String,
                default: '',
            },
            propHelpIconStyle: {
                type: String,
                default: '20rpx',
            },
            propDataFormId: {
                type: [String, Number],
                default: '',
            },
            propMobile: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                com_data: {},
                form_value: [],
                data_list: [],
                children_list: [],
                mobile: {},
                direction_fixed: 'the_first_three',
                briefing_field: [],
                more_index: 0,
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        computed: { 
            is_all_away() {
                if (this.data_list.length == 0) {
                    return true;
                }
                const list = this.data_list.filter(item => item.is_expand);
                return list.length == this.data_list.length;
            },
            filteredDiyData() {
                return (children_item) => {
                    const componentMap = new Map(children_item.map((item) => [item.id, item]));

                    // 取出所有设置显隐规则的组件
                    const list = children_item.filter((item) => ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
                    const list_map = list.map((item) => ({ id: item.id, list: item.com_data.show_hidden_list }));
                    return children_item.filter((item) => {
                        // 优先判断是否启用
                        if (item.is_enable !== '1') return false;

                        if (list_map.length === 0) return true;
                        // 将所有的内容的组件进行筛选
                        const isShownByRule = list_map.some((list_item) => {
                            const targetComponent = componentMap.get(list_item.id);
                            // 判断显隐规则对应的组件是否存在
                            if (!targetComponent) return false;
                            return list_item.list.some(hidden_item => {
                                // 判断当前组件是否在显隐规则中，如果不在，直接显示，否则的话判断值是否存在
                                if (hidden_item.is_show.includes(item.id)) {
                                    return targetComponent.com_data.form_value.includes(hidden_item.value);
                                } else {
                                    return true;
                                }
                            });
                        });
                        return isShownByRule;
                    });
                }
            },
            show_list() {
                return (children_item) => {
                    // 去除当前参数不符合条件显示的数据
                    const list = this.filteredDiyData(children_item);
                    // 去除收起不显示的数据
                    const new_list = list.filter(item => !['video', 'img', 'auxiliary-line', 'upload-video', 'upload-attachments', 'upload-img', 'rich-text'].includes(item.key))
                    if (this.direction_fixed == 'the_first_three') {
                        return new_list.slice(0, 3);
                    } else {
                        return new_list.filter(item => this.briefing_field.includes(item.id));
                    }
                }
            },
            is_error() {
                return (children_item) => {
                    // 去除当前参数不符合条件显示的数据
                    const list = this.filteredDiyData(children_item);
                    return list.some(item1 => item1.com_data.common_config.is_error == '1');
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                const com_data = this.propValue;
                // 子表单数据
                const children_list = JSON.parse(JSON.stringify(com_data?.children || []));
                // 移动端配置参数
                const mobile = com_data.mobile || {};
                this.setData({
                    com_data: com_data,
                    direction_fixed: mobile.direction_fixed,
                    briefing_field: mobile?.briefing_field || [],
                    data_list: com_data?.data_list || [],
                    mobile: mobile,
                    form_value: com_data?.form_value || [],
                    children_list: children_list,
                });
            },
            help_icon_event(e) {
                this.$emit('helpIconEvent', e.currentTarget.dataset.value);
            },
            // 子表单校验逻辑
            data_check(e, index) {
                const { is_error, error_text, value, id } = e;
                // 改变对应id的数据
                const data = [...this.data_list];
                data.forEach((item, index1) => {
                    if (index1 == index) {
                        item.data_list.forEach(item1 => {
                            if (item1.id == id && item1.com_data && item1.com_data.common_config) {
                                item1.com_data.form_value = value;
                                item1.com_data.common_config.is_error = is_error;
                                item1.com_data.common_config.error_text = error_text;
                            }
                        });
                    }
                });
                this.setData({
                    data_list: data
                })
                this.$emit('subformDataChange', data, this.propDataId);
            },
            // 子表单内容参数修改
            data_change(e, index) {
                const { value, id } = e;
                // 改变对应id的数据
                const data = [...this.data_list];
                data.forEach((item, index1) => {
                    if (index1 == index) {
                        item.data_list.forEach(item1 => {
                            if (item1.id == id && item1.com_data) {
                                item1.com_data.form_value = value;
                            }
                        });
                    }
                });
                this.setData({
                    data_list: data
                })
                this.$emit('subformDataChange', data, this.propDataId);
            },
            // 子表单新增选项变化时的处理
            data_option_change(e, index) {
                const { list, value, id } = e;
                // 改变对应id的数据
                const data = [...this.data_list];
                data.forEach((item, index1) => {
                    if (index1 == index) {
                        item.data_list.forEach(item1 => {
                            if (item1.id == id && item1.com_data) {
                                item1.com_data.form_value = value;
                                item1.com_data.custom_option_list = list;
                            }
                        });
                    }
                });
                this.setData({
                    data_list: data
                })
                this.$emit('subformDataChange', data, this.propDataId);
            },
            // 地区选择器提交事件
            region_event(e, index) {
                const { value, id, province_name, city_name, county_name } = e;
                // 改变对应id的数据
                const data = [...this.data_list];
                data.forEach((item, index) => {
                    if (index1 == index) {
                        item.data_list.forEach(item1 => {
                            if (item1.id == id && item1.com_data) {
                                item1.com_data.form_value = value;
                                item1.com_data.province_name = province_name;
                                item1.com_data.city_name = city_name;
                                item1.com_data.county_name = county_name;
                            }
                        });
                    }
                });
                this.setData({ data_list: data });
                this.$emit('subformDataChange', data, this.propDataId);
            },
            expand_or_collapse(e) {
                const { index } = e.currentTarget.dataset;
                const data = [...this.data_list];
                data[index].is_expand = !data[index].is_expand;
                this.setData({ data_list: data });
            },
            more_click(e) {
                const { index } = e.currentTarget.dataset;
                this.setData({
                    more_index: index
                });
                this.$refs.morePopup.open();
            },
            quick_close_event() {
               this.$refs.morePopup.close(); 
            },
            copy(e) {
                const { value } = e.currentTarget.dataset;
                const data = [...this.data_list];
                const data_index = data[this.more_index];
                if (value == 'copy') {
                    // 复制到下一行
                    data.splice(this.more_index + 1, 0, JSON.parse(JSON.stringify(data_index)));
                } else if (value == 'copy_last') {
                    // 复制到最后一行
                    data.splice(data.length, 0, JSON.parse(JSON.stringify(data_index)));
                } else if (value == 'insert_up') {
                    // 向上插入记录
                    data.splice(this.more_index, 0, {
                        is_expand: data_index.is_expand,
                        data_list: JSON.parse(JSON.stringify(this.children_list))
                    });
                } else if (value == 'insert_down') {
                    // 向下插入记录
                    data.splice(this.more_index + 1, 0, {
                        is_expand: data_index.is_expand,
                        data_list: JSON.parse(JSON.stringify(this.children_list))
                    });
                }
                this.$refs.morePopup.close();
                this.setData({ data_list: data });
                this.$emit('subformDataChange', data, this.propDataId);
            },
            // 添加记录
            add_item() {
                const data = [...this.data_list];
                const list = this.data_list.filter(item => item.is_expand);
                data.push({
                    is_expand: list.length == this.data_list.length,
                    data_list: JSON.parse(JSON.stringify(this.children_list))
                });
                this.setData({ data_list: data });
            },
            expand_all(e) {
                const { value } = e.currentTarget.dataset;
                const data = [...this.data_list];
                data.forEach(item => {
                    item.is_expand = !value;
                });
                this.setData({ data_list: data });
            },
            // 删除某一个子表单数据
            delete_item(e) {
                const { index } = e.currentTarget.dataset;
                const data = [...this.data_list];
                data.splice(index, 1);
                this.setData({
                    data_list: data
                })
                this.$emit('subformDataChange', data, this.propDataId);
            },
            // 获取选择的中文名称
            data_conversion(item) {
                if (!isEmpty(item.com_data.form_value)) {
                    const value = item.com_data.form_value;
                    if (['single-text', 'radio-btns', 'select'].includes(item.key)) {
                        if (item.com_data.type !== 'single-text') {
                            const list = item.com_data?.option_list.concat(item.com_data?.custom_option_list || []) || [];
                            const name = list.find(item => item.value == value)?.name || 'empty_conversion';
                            return name;
                        } 
                        return value;
                    } else if (['select-multi', 'checkbox'].includes(item.key)) {
                        const list = item.com_data?.option_list.concat(item.com_data?.custom_option_list || []) || [];
                        const new_list = list.filter(item => value.includes(item.value));
                        if (new_list.length > 0) {
                            return new_list.map(item => item.name).join('，');
                        } else {
                            return 'empty_conversion'
                        }
                    } else if (item.com_data.type == 'address') {
                        const { province_name, city_name, county_name } = item.com_data;
                        if (province_name) {
                            return (province_name + (city_name ? ' / ' + city_name : '') + (county_name ? ' / ' + county_name : ''))
                        } else {
                            return 'empty_conversion'
                        }
                    } else {
                        return value;
                    }
                } else {
                    return 'empty_conversion';
                }
            },
            z_index_change(e) {
                this.$emit('zIndexChange', e);
            }
        },
    };
</script>

<style lang="scss" scoped>
.title_btn {
    font-size: 24rpx;
}
.direction-style {
    border: 2rpx solid #ccc;
    border-radius: 16rpx;
    overflow: hidden;
    // .subform-line {
    //     transition: height 0.1s linear;
    // }
    .subform-line+.subform-line {
        border-top: 2rpx solid #ccc;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        margin-top: 8rpx;
        overflow: hidden;
    }
}
.direction-bottom {
    padding: 20rpx;
    overflow: hidden;
}
.subform-title-btns {
    padding: 14rpx;
    background: linear-gradient(180deg, #f4f6f9, #fff);
    .subform-number {
        width: 40rpx;
        background: #2196F3;
        color: #fff;
        border-radius: 50%;
        padding: 4rpx;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.ml-5 {
    margin-left: 10rpx;
}
.expand-title {
    padding: 14rpx;
    font-size: 20rpx;
    color: #141e31;
    .empty {
        color: #838892;
    }
}
.action-sheet {
    .action-sheet-item {
        color: #141e31;
        font-size: 28rpx;
        background: #fff;
        border-bottom: 2rpx solid #ebecee;
        padding: 24rpx 18rpx;
        text-align: center;
    }
    .action-sheet-item:nth-child(4),  .action-sheet-item:nth-child(6){
        border-bottom: none;
    }
    .action-sheet-segment {
        background: #f8f8f8;
        height: 20rpx;
        width: 100%;
    }
}
.required-error {
    background: #fef6e6;
}
</style>
