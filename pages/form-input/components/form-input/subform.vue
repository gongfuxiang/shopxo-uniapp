<template>
    <view class="wh-auto ht-auto">
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
                    <button v-if="!isEmpty(data_list) && mobile.arrange == 'direction'" class="title_btn flex-row align-c gap-10" :data-value="is_all_away" @tap="expand_all">{{ is_all_away ?  '全部收起' : '全部展开' }}<iconfont :name="is_all_away ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx" color="#2196F3" propContainerDisplay="flex"></iconfont></button>
                </view>
            </view>
            <view v-if="data_list.length > 0" class="overflow-auto" :style="'height:' + custom_height">
                <view v-if="mobile.arrange == 'direction'" class="direction-style">
                    <view v-for="(item, index) in data_list" :key="index" class="subform-line oh" :style="'height:' + (item.is_expand ? '100%;' : '150rpx;')">
                        <!-- 标题操作 -->
                        <view class="subform-title-btns flex-row align-c jc-sb">
                            <span class="subform-number">{{ index + 1 }}</span>
                            <view class="flex-row align-c gap-10">
                                <view class="cr-blue size-12" :data-index="index" @tap="more_click">更多</view>
                                <view class="cr-blue size-12" :data-index="index" @tap="delete_click">删除</view>
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
                                    :propValue="filteredDiyDataItem(item.data_list)"
                                    :propFieldLabelStyle="propFieldLabelStyle"
                                    :propTitleStyle="propTitleStyle"
                                    :propHelpIconStyle="propHelpIconStyle"
                                    :propDataFormId="propDataFormId"
                                    :propKey="propKey"
                                    :propIndex="index"
                                    :propDirection="propDirection" 
                                    :propMobile="propMobile" 
                                    :propComponentStyle="propStyle"
                                    @dataChange="data_change"
                                    @dataCheck="data_check"
                                    @dataOptionChange="data_option_change"
                                    @openRegion="open_region"
                                    @helpIconEvent="subform_help_icon_event"
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
                    <view class="table-container rendering-area">
                        <view class="table-header flex">
                            <view class="flex-row align-c jc-c head">
                                <view class="head-label flex-row align-c jc-c shrink" :style="left_0_sticky"></view>
                                <view class="flex-row align-c">
                                    <!-- 头部标题显示 -->
                                    <view v-for="item in filteredDiyData('all')" :key="item.id" class="item-label flex-row align-c shrink" :style="'width:' + item.com_data.com_width + 'px;' + (!isEmpty(item.com_data) && !isEmpty(item.com_data.sticky_style) ? item.com_data.sticky_style : '')">
                                        <span v-if="item.com_data.is_required == '1'" class="required">*</span>
                                        {{ item.com_data.title }}
                                        <view v-if="item.com_data.common_config.help_is_show == '1' && !isEmpty(item.com_data.common_config.help_icon)"></view><view v-if="item.com_data.common_config.help_is_show == '1' && !isEmpty(item.com_data.common_config.help_explain)" :data-value="item.com_data.common_config.help_explain" @tap="help_icon_event">
                                            <iconfont name="icon-miaosha-hdgz" :size="propHelpIconStyle" color="#999"></iconfont>
                                        </view>
                                    </view>
                                </view>
                                <view class="head-more shrink"></view>
                            </view>
                        </view>
                        <view class="table-body">
                            <view class="flex-1 flex-col">
                                <view v-for="(item, index) in data_list" :key="index" class="table-row flex-row">
                                    <view class="cell-num flex-row align-c jc-c shrink re" :style="left_0_sticky">
                                        <view class="row-num flex-row align-c jc-c">
                                            <template v-if="isEmpty(line_error(index))">{{ index + 1 }}</template>
                                            <template v-else><view class="error-icon" :data-value="line_error(index)" @tap="error_text">!</view></template>
                                        </view>
                                    </view>
                                    <view class="flex-row align-c">
                                        <view v-for="children_item in filteredDiyDataItem(item.data_list, 'table')" :key="children_item.id" :class="['cell pr flex-row align-c jc-c shrink', { 'item-row-error': children_item.com_data.common_config.is_error == '1' }]" :style="'width:' + children_item.com_data.com_width  + 'px;' + (!isEmpty(children_item.com_data) && !isEmpty(children_item.com_data.sticky_style) ? (children_item.com_data.sticky_style + (children_item.id == z_index_id && index == z_index ? 'z-index: 999;' : '')) : '')">
                                            <template v-if="show_row(index, children_item.id)">
                                                <view class="flex-1 wh-auto">
                                                    <components-combination
                                                        :propData="children_item"
                                                        :propDataFormId="propDataFormId"
                                                        :propKey="propKey"
                                                        :propIndex="index"
                                                        :propDirection="propDirection" 
                                                        :propMobile="propMobile" 
                                                        :propComponentStyle="propStyle"
                                                        @dataChange="data_change"
                                                        @dataCheck="data_check"
                                                        @dataOptionChange="data_option_change"
                                                        @openRegion="open_region"
                                                        @regionEvent="region_event"
                                                        @zIndexChange="table_z_index_change"
                                                    />
                                                </view>
                                                
                                            </template>
                                        </view>
                                    </view>
                                    <view class="cell-more shrink flex-row align-c jc-c" :data-index="index" @tap="table_more_event">
                                        <iconfont name="icon-arrow-right" size="28rpx" color="#333" />
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="direction-bottom flex-row align-c jc-c gap-10 cr-blue" style="border: 2rpx solid #ccc;" @tap="add_item">
                        <iconfont name="icon-add" size="32rpx" color="#2196F3" propContainerDisplay="flex"></iconfont>
                        添加记录
                    </view>
                </view>
            </view>
            <template v-else>
                <view class="subform-data">暂无可用字段</view>
            </template>
        </view>
        <!-- 表格详情 -->
        <uni-popup ref="tableMorePopup" type="bottom" class="popup-bottom" background-color="#fff" :animation="true" @maskClick="quick_table_more_event">
            <view class="bg-white subform-row">
                <view class="subform-row-head">
                    <span class="title">{{ com_data.title }}</span><span>（{{ table_more_index + 1 }}）</span>
                </view>
                <view v-if="data_list.length > 0 && !isEmpty(data_list[table_more_index])" class="subform-row-content">
                    <subform-component-show
                        :propValue="filteredDiyDataItem(data_list[table_more_index].data_list)"
                        :propFieldLabelStyle="propFieldLabelStyle"
                        :propTitleStyle="propTitleStyle"
                        :propHelpIconStyle="propHelpIconStyle"
                        :propDataFormId="propDataFormId"
                        :propKey="propKey"
                        :propIndex="table_more_index"
                        :propDirection="propDirection" 
                        :propMobile="propMobile" 
                        :propComponentStyle="propStyle"
                        @dataChange="data_change"
                        @dataCheck="data_check"
                        @dataOptionChange="data_option_change"
                        @openRegion="open_region"
                        @helpIconEvent="subform_help_icon_event"
                        @regionEvent="region_event"
                        @zIndexChange="z_index_change"
                    />
                </view>
                <view class="flex-row align-c jc-sb subform-row-switch">
                    <button class="flex-row align-c gap-5 subform-row-switch-item" :disabled="table_more_index == 0" :data-index="table_more_index - 1" @tap="previous_or_next"><iconfont name="icon-arrow-left" size="28rpx" />上一条</button>
                    <button class="flex-row align-c gap-5 subform-row-switch-item" :disabled="table_more_index >= data_list.length - 1" :data-index="table_more_index + 1" @tap="previous_or_next">下一条<iconfont name="icon-arrow-right" size="28rpx" /></button>
                </view>
                <view class="subform-row-footer flex-row align-c gap-10">
                    <view class="save_del flex-col jc-c align-c" :data-index="table_more_index" @tap="delete_click">
                        <iconfont name="icon-del" size="30rpx" color="#eb5050" propContainerDisplay="flex"></iconfont>删除
                    </view>
                    <view class="save_more flex-col jc-c align-c" :data-index="table_more_index" @tap="more_click">
                        <iconfont name="icon-more-four-pieces" size="30rpx" color="#666" propContainerDisplay="flex"></iconfont>更多
                    </view>
                    <button class="flex-1 submit_title flex-row align-c jc-c"  type="default" @tap="quick_table_more_event">完成</button>
                </view>
            </view>
        </uni-popup>
        <!-- 删除提示弹出框 -->
        <uni-popup ref="deletePopup" type="dialog" @maskClick="delete_close">
            <uni-popup-dialog cancelText="取消" confirmText="确定" title="" content="是否确认删除这条数据" @confirm="delete_confirm" @close="delete_close"></uni-popup-dialog>
        </uni-popup>
        <!-- 更多弹窗 -->
        <uni-popup ref="morePopup" type="bottom" class="popup-bottom" background-color="#fff" :animation="true" @maskClick="quick_close_event">
            <view class="bg-white action-sheet">
                <view class="action-sheet-item" data-value="copy" @tap="copy">复制到下一行</view>
                <view class="action-sheet-item" data-value="copy_last" @tap="copy">复制到最后一行</view>
                <view class="action-sheet-item" data-value="insert_up" @tap="copy">向上插入记录</view>
                <view class="action-sheet-item" data-value="insert_down" @tap="copy" >向下插入记录</view>
                <view class="action-sheet-segment"></view>
                <view class="action-sheet-item" @tap="quick_close_event">取消</view>
            </view>
        </uni-popup>
        <!-- 表格报错提示 -->
        <uni-popup ref="popup_error" type="center" border-radius="20rpx" @maskClick="quick_close_event">
            <view class="popup-error-content">{{ popup_error_content }}</view>
        </uni-popup>
    </view>
</template>

<script>
    import { isEmpty, common_form_styles_computer } from '@/common/js/common/common.js';
    import subformComponentShow from '@/pages/form-input/components/form-input/modules/subform-component-show/index.vue';
    import componentsCombination from '@/pages/form-input/components/form-input/modules/components-combination/index.vue';
    export default {
        components: {
            subformComponentShow,
            componentsCombination
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
            propDirection: {
                type: String,
                default: 'row',
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
            propIsCustom: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                com_data: {},
                custom_height: '100%',
                form_value: [],
                data_list: [],
                children_list: [],
                mobile: {},
                direction_fixed: 'the_first_three',
                briefing_field: [],
                more_index: 0,
                popup_error_content: '',
                table_more_index: 0,
                left_0_sticky: '',
                // 区分层级问题
                z_index_id: '',
                z_index: '',
            };
        },
        watch: {
            propValue: {
                handler(val) {
                    this.init();
                },
                deep: true,
            },
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        computed: { 
            // 判断当前行是否有错误
            line_error() {
                return (index) => {
                    const item = this.data_list[index];
                    if (item) {
                        const line_error = item.data_list.filter((item) => item.com_data.common_config.is_error === '1')
                        if (line_error.length > 0) {
                            const err_list = line_error[0].com_data;
                            // 如果当前行有错误
                            if (err_list && err_list.common_config && err_list.common_config.is_error == '1') {
                                if (err_list.common_config.error_text == '此项为必填项') {
                                    return `请填写「${err_list.title}」`;
                                } else {
                                    return `请正确填写「${err_list.title}」`;
                                }
                            }
                        } else {
                           return '';
                        }
                    } else {
                        return '';
                    }
                };
            },
            // index: 列索引 id: 组件id
            show_row() {
                return (index, id) => {
                    const show_children = this.filteredDiyData('value', index);
                    const children_index = show_children.findIndex((item) => item.id === id);
                    return children_index !== -1;
                }
            },
            is_all_away() {
                const list = this.data_list.filter(item => item.is_expand);
                return list.length == this.data_list.length;
            },
            filteredDiyDataItem() {
                return (children_item, type = 'vertical') => {
                    const componentMap = new Map(children_item.map((item) => [item.id, item]));

                    // 取出所有设置显隐规则的组件
                    const list = children_item.filter((item) => ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
                    const list_map = list.map((item) => ({ id: item.id, list: item.com_data.show_hidden_list }));
                    const children_list = children_item.filter((item) => {
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
                                    // 如果类型是纵向的话，则只需要判断当前行是否显示就可以了
                                    if (type === 'vertical') {
                                        return targetComponent.com_data.form_value.includes(hidden_item.value);
                                    } else {
                                        // 如果是表格类型的需要判断全部是否有符合条件的，确保表格列跟下边的内容对齐
                                        const data = this.data_list.filter((form_item) => form_item.data_list.some((data_item_list) => data_item_list.id == list_item.id && data_item_list.com_data.form_value.includes(hidden_item.value)))
                                        return data.length > 0;
                                    }
                                } else {
                                    return true;
                                }
                            });
                        });
                        return isShownByRule;
                    });
                    if (this.mobile.arrange != 'direction') {
                        children_list.forEach((item, index) => {
                            item.com_data.sticky_style = this.left_sticky(index + 1, children_list, this.com_data);
                        })
                    }
                    return children_list;
                }
            },
            filteredDiyData() {
                return (type, index = null) => {
                    const componentMap = new Map(this.children_list.map((item) => [item.id, item]));
                    // 取出所有设置显隐规则的组件
                    const list = this.children_list.filter((item) => ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
                    const list_map = list.map((item) => ({ id: item.id, list: item.com_data.show_hidden_list }));
                    const children_list = this.children_list.filter((item) => {
                        // 优先判断是否启用
                        if (item.is_enable !== '1') return false;

                        if (list_map.length === 0) return true;
                        // 将所有的内容的组件进行筛选
                        const isShownByRule = list_map.some((list_item) => {
                            const targetComponent = componentMap.get(list_item.id);
                            // 判断显隐规则对应的组件是否存在
                            if (!targetComponent) return false;
                            return list_item.list.some((hidden_item) => {
                                // 判断当前组件是否在显隐规则中，如果不在，直接显示，否则的话判断值是否存在
                                if (hidden_item.is_show.includes(item.id)) {
                                    if (type == 'all') {
                                        // 判断所有的是否满足条件
                                        const data = this.data_list.filter((form_item) => form_item.data_list.some((data_item_list) => data_item_list.id == list_item.id && data_item_list.com_data.form_value.includes(hidden_item.value)))
                                        return data.length > 0;
                                    } else {
                                        // 判断是单个还是多个内容
                                        if (index == null) {
                                            return false;
                                        } else {
                                            // 否则判断当前组件的值是否存在
                                            const data = this.data_list[index];
                                            return data.data_list.some((data_item_list) => data_item_list.id == list_item.id && data_item_list.com_data.form_value.includes(hidden_item.value) )
                                        }
                                    }
                                } else {
                                    return true;
                                }
                            });
                        });
                        return isShownByRule;
                    });
                    if (this.mobile.arrange != 'direction') {
                        children_list.forEach((item, index) => {
                            item.com_data.sticky_style = this.left_sticky(index + 1, children_list, this.com_data);
                        })
                    }
                    return children_list;
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
                let custom_height = '100%';
                const com_data = this.propValue;
                // 移动端配置参数
                const mobile = com_data.mobile || {};
                if (this.propIsCustom) {
                    const filed_title_size_type = this.propMobile.filed_title_size_type || 'small';
                    const text_height = filed_title_size_type == 'big' ? 31 : filed_title_size_type == 'middle' ? 22.5 : 16.5;
                    // 20是按钮与表格和标题与表格之间的间隔 text_height 是表头的高度
                    custom_height = (com_data.com_height - 30 - text_height) * 2 + 'rpx;';
                }
                // 子表单数据
                let children_list = JSON.parse(JSON.stringify(com_data?.children || []));
                let data_list = com_data?.data_list || [];
                // #ifndef H5 || MP-WEIXIN || MP-QQ
                    // 上传文件只支持H5 微信小程序， qq小程序，其余的需要端需要过滤掉数据
                    children_list = children_list.filter(item => item.com_type != 'upload-attachments');
                    data_list = data_list.filter(item => item.com_type != 'upload-attachments');
                // #endif
                children_list.forEach(item => {
                    item.com_data.common_style = this.get_form_border_style(item.com_data.common_config,  mobile.arrange == 'direction' ? this.propDirection : 'column');
                })
                this.setData({
                    com_data: com_data,
                    custom_height: custom_height,
                    direction_fixed: mobile.direction_fixed,
                    briefing_field: mobile?.briefing_field || [],
                    data_list: data_list,
                    mobile: mobile,
                    form_value: com_data?.form_value || [],
                    children_list: children_list,
                    left_0_sticky: mobile.arrange != 'direction' ? this.left_sticky(0, [], com_data) : '',
                });
            },
            error_text(e) {
                this.setData({
                    popup_error_content: e.currentTarget.dataset.value,
                });
                this.z_index_change(this.propDataId);
                this.$refs.popup_error.open();
            },
            // 获取子表单样式
            get_form_border_style(item, flex_direction) {
                // 如果是默认模式需要区分是上下还是左右来判断是否显示边框
                return flex_direction == 'row' ? '' : common_form_styles_computer(item) + 'padding: 0px 22rpx;box-sizing:content-box;';
            },
            help_icon_event(e) {
                this.$emit('helpIconEvent', e.currentTarget.dataset.value);
            },
            subform_help_icon_event(e) {
                this.$emit('helpIconEvent', e);
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
            table_more_event(e) {
                const { index } = e.currentTarget.dataset;
                this.setData({
                    table_more_index: index
                })
                this.z_index_change(this.propDataId);
                this.$refs.tableMorePopup.open();
            },
            previous_or_next(e) {
                const { index } = e.currentTarget.dataset;
                this.setData({
                    table_more_index: index
                });
            },
            more_click(e) {
                const { index } = e.currentTarget.dataset;
                this.setData({
                    more_index: index
                });
                this.z_index_change(this.propDataId);
                this.$refs.morePopup.open();
            },
            quick_table_more_event() {
                this.$refs.tableMorePopup.close();
                this.z_index_change('');
            },
            quick_close_event() {
               this.$refs.morePopup.close();
               this.$refs.popup_error.close();
               this.z_index_change('');
            },
            copy(e) {
                const { value } = e.currentTarget.dataset;
                const data = [...this.data_list];
                const data_index = data[this.more_index];
                let new_index = this.more_index;
                if (value == 'copy') {
                    new_index = this.more_index + 1;
                    // 复制到下一行
                    data.splice(new_index, 0, JSON.parse(JSON.stringify(data_index)));
                } else if (value == 'copy_last') {
                    new_index = data.length;
                    // 复制到最后一行
                    data.splice(new_index, 0, JSON.parse(JSON.stringify(data_index)));
                } else if (value == 'insert_up') {
                    new_index = this.more_index;
                    // 向上插入记录
                    data.splice(new_index, 0, {
                        is_expand: data_index.is_expand,
                        data_list: JSON.parse(JSON.stringify(this.children_list))
                    });
                } else if (value == 'insert_down') {
                    new_index = this.more_index + 1;
                    // 向下插入记录
                    data.splice(new_index, 0, {
                        is_expand: data_index.is_expand,
                        data_list: JSON.parse(JSON.stringify(this.children_list))
                    });
                }
                
                this.$refs.morePopup.close();
                if (this.mobile.arrange == 'direction') {
                    this.setData({ data_list: data });
                } else {
                    this.setData({ data_list: data, table_more_index: new_index });
                }
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
            // 点击删除按钮的时候
            delete_click(e) {
                const { index } = e.currentTarget.dataset;
                this.setData({
                    delete_index: index
                })
                this.z_index_change(this.propDataId);
                this.$refs.deletePopup.open();
            },
            delete_confirm() {
                this.delete_item(this.delete_index);
                if (this.mobile.arrange != 'direction') {
                    setTimeout(() => {
                        this.$refs.tableMorePopup.close();
                        this.z_index_change('');
                    }, 100);
                }
            },
            delete_close() {
                this.$refs.deletePopup.close();
                this.z_index_change('');
            },
            // 删除某一个子表单数据
            delete_item(index) {
                const data = [...this.data_list];
                data.splice(index, 1);
                this.setData({
                    data_list: data
                })
                this.$emit('subformDataChange', data, this.propDataId);
            },
            // 获取选择的中文名称 empty_conversion 是用来区分有没有值,有值和没有值的颜色不一致
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
            /**
             * 计算左侧粘性定位样式
             * 
             * @param index - 当前元素的索引位置
             * @returns 返回CSS粘性定位样式字符串，若不符合条件则返回空字符串
            */
            left_sticky(index, childrenList = [], com_data) {
                // 从表单数据中获取是否启用固定和固定数量配置
                const { is_fixed = '0', horizontal_fixed_num = 1 } = com_data?.mobile || {};
                
                // 检查是否满足粘性定位条件：启用固定且索引在固定数量范围内
                if (is_fixed !== '1' || index >= horizontal_fixed_num || horizontal_fixed_num <= 0) {
                    return '';
                }

                // 初始左侧偏移量：第一个元素为0，其他元素默认78px
                let left = index === 0 ? 0 : 40;
                
                // 计算当前元素之前的兄弟元素宽度总和作为偏移量
                if (index > 0) {
                    for (let i = 1; i < index; i++) {
                        left += childrenList[i - 1]?.com_data?.com_width || 0;
                    }
                }
                
                // 生成粘性定位CSS样式
                return `position: sticky;left: ${left}px;z-index: 2;`;
            },
            table_z_index_change(e, index) {
                this.setData({
                    z_index_id: e,
                    z_index: index
                })
                this.z_index_change(e);
            },
            z_index_change(e) {
                // 不为空的时候代表着是子表单内部触发了，需要传递自身的id
                if (!isEmpty(e)) {
                    this.$emit('zIndexChange', this.propDataId);
                } else {
                    this.$emit('zIndexChange', e);
                }
            }
        },
    };
</script>

<style lang="scss" scoped>
.title_btn {
    font-size: 24rpx;
    background: #fff;
    border: 2rpx solid #ccc;
    padding: 0 28rpx;
    border-radius: 10rpx;
}
.direction-style {
    background: #fff;
    border: 2rpx solid #ccc;
    border-radius: 16rpx;
    overflow: hidden;
    .subform-line+.subform-line {
        border-top: 2rpx solid #ccc;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        margin-top: 8rpx;
        overflow: hidden;
    }
}
.direction-bottom {
    background: #fff;
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
.subform-data {
    width: 100%;
    height: 120rpx;
    background: #f0f1f4;
    font-size: 32rpx;
    color: #838892;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.overflow-auto {
    height: 100%;
    width: 100%;
    overflow: auto;
}
// 表格模式下的样式
.table-container {
    padding-bottom: 10rpx;
    overflow: auto; /* 允许滚动 */
    .table-header {
        position: sticky;
        top: 0;
        z-index: 3;
        display: flex;
        .head-label, .head-more {
            background: #f0f1f4;
            border: 2rpx solid #e6e8ed;
            border-top-left-radius: 6rpx;
            width: 40px;
            height: 70rpx;
            padding: 10rpx;
            box-sizing: border-box;
        }
        .head-more {
            border: 2rpx solid #e6e8ed;
            border-top-left-radius: 0;
            border-top-right-radius: 6rpx;
            position: sticky;
            right: 0;
        }
        .item-label {
            flex-shrink: 0;
            height: 70rpx;
            padding: 10rpx;
            background: #f0f1f4;
            font-size: 28rpx;
            color: #141E31;
            border: 2rpx solid #e6e8ed;
            border-left: 0;
            box-sizing: border-box;
        }
        .item-label:last-child {
            border: 2rpx solid #e6e8ed;
            border-left: 0;
            border-right: 0 !important;
        }
    }
    .table-body {
        display: flex;
        .table-row .cell-num, .table-row .cell-more {
            text-align: center;
            background: #fff;
            border: 2rpx solid #e6e8ed;
            border-top: 0;
            width: 40px;
            min-height: 62rpx;
            line-height: 62rpx;
            box-sizing: border-box;
        }
        .table-row .cell-more {
            border: 2rpx solid #e6e8ed;
            border-top: 0;
            position: sticky;
            right: 0;
            z-index: 2;
        }
        .table-row .cell {
            flex-shrink: 0;
            background: #fff;
            padding: 10rpx;
            min-height: 62rpx;
            height: 100%;
            border: 2rpx solid #e6e8ed;
            border-left: 0;
            border-top: 0;
            box-sizing: border-box;
        }
        .table-row .cell:last-child {
            border-right: 0 !important;
        }
        .item-row-error {
            background: #fef6e6 !important;
        }
        .table-row:hover {
            .cell {
                background: #f0f1f4 !important;
            }
            .item-row-error {
                background: #fdeeee !important;
            }
            .operate {
                display: flex;
            }
        }
    }
    .row-num {
        font-size: 28rpx;
    }
}
.shrink {
    flex-shrink: 0;
}
.error-icon {
    width: 40rpx;
    height: 40rpx;
    font-size: 32rpx;
    line-height: 32rpx;
    background: #eb5050;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.required {
    color: #FF5353;
    font-weight: 700;
    padding-left: 6rpx;
}
.popup-error-content {
    background: #fff;
    padding: 32rpx;
    border-radius: 10rpx;
    color: red;
}
// 表格更多数据
.subform-row {
    .subform-row-head {
        font-size: 28rpx;
        font-weight: bold;
        line-height: 60rpx;
        border-bottom: 2rpx solid #ccc;
        padding: 0 22rpx;
    }
    .subform-row-content {
        padding: 20rpx 0;
        max-height: 1000rpx;
        overflow-y: auto;
    }
    .subform-row-switch {
        height: 70rpx;
        border-top: 2rpx solid #ccc;
        border-bottom: 2rpx solid #ccc;
        .subform-row-switch-item {
            background: #fff;
            // color: #525967;
            font-size: 24rpx;
            padding: 0 22rpx;
            margin-left: 0;
            margin-right: 0;
            height: 70rpx;
        }
    }
    .subform-row-footer {
        padding: 10rpx 22rpx;
        .save_del, .save_more {
            min-width: 180rpx;
            font-size: 24rpx;
        }
        .save_del {
            color: #eb5050;
        }
        .submit_title {
            background: #2a94ff;
            text-align: center;
            height: 64rpx;
            color: #fff;
            border-radius: 40rpx;
            font-size: 32rpx;
        }
    }
}
</style>
