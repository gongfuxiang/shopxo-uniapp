<template>
    <view v-if="is_show" class="ht-auto" :style="style_container">
        <view :style="style_img_container">
            <view :style="style_content_container">
                <view class="w h pr" :style="style_content_img_container">
                    <template v-if="data_source_content_list.length > 0 && form.data_source_direction == 'vertical'">
                        <view class="flex-row flex-wrap" :style="'row-gap:' + new_style.row_gap + 'px;column-gap:' + new_style.column_gap + 'px;'">
                            <view v-for="(item, index) in data_source_content_list" :key="index" class="ht-auto" :style="gap_width">
                                <view v-for="(item1, index1) in item.split_list" :key="index1">
                                    <view :style="style_chunk_container">
                                        <view class="wh-auto ht-auto oh" :style="style_chunk_img_container">
                                            <dataGroupRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="index1" :propSourceList="item1" :propFieldList="propFieldList" :propDataHeight="propDataHeight" :propScale="custom_scale" :propIsCustom="propIsCustom" :propIsCustomGroup="true" :propShowData="propShowData" :propConfigLoop="propConfigLoop !== '1' ? form.is_use_parent_data : '1'" :propDataIndex="index" :propDataSplitIndex="index1" @url_event="url_event"></dataGroupRendering>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </template>
                    <view v-else-if="data_source_content_list.length > 0 && ['vertical-scroll', 'horizontal'].includes(form.data_source_direction)" class="oh ht-auto">
                        <swiper class="w flex" circular="true" :vertical="form.data_source_direction != 'horizontal'" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :display-multiple-items="slides_per_view" :style="{ width: '100%', height: swiper_height + 'px' }" @change="slideChange">
                            <swiper-item v-for="(item, index) in data_source_content_list" :key="index">
                                <view :class="form.data_source_direction != 'horizontal' ? 'wh-auto ht-auto' : 'flex-row ht-auto'" :style="form.data_source_direction == 'horizontal' ? 'column-gap:' + new_style.column_gap + 'px;' : ''">
                                    <view v-for="(item1, index1) in item.split_list" :key="index1" class="wh-auto ht-auto" :style="style_chunk_container + swiper_width + (form.data_source_direction == 'horizontal' ? gap_width : 'margin-bottom:' + content_outer_spacing_magin)">
                                        <view class="wh-auto ht-auto oh" :style="style_chunk_img_container">
                                            <dataGroupRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="index1" :propSourceList="item1" :propFieldList="propFieldList" :propDataHeight="propDataHeight" :propScale="custom_scale" :propIsCustom="propIsCustom" :propIsCustomGroup="true" :propShowData="propShowData" :propConfigLoop="propConfigLoop !== '1' ? form.is_use_parent_data : '1'" :propDataIndex="index" :propDataSplitIndex="index1" @url_event="url_event"></dataGroupRendering>
                                        </view>
                                    </view>
                                </view>
                            </swiper-item>
                        </swiper>
                        <view v-if="new_style.is_show == '1' && data_source_content_list.length > 1" :class="['left', 'right'].includes(new_style.indicator_new_location) ? 'indicator_up_down_location' : 'indicator_about_location'" :style="indicator_location_style">
                            <block v-if="new_style.indicator_style == 'num'">
                                <view :style="indicator_style" class="dot-item">
                                    <text :style="{ color: new_style.actived_color }">{{ actived_index + 1 }}</text>
                                    <text>/{{ data_source_content_list.length }}</text>
                                </view>
                            </block>
                            <block v-else>
                                <view v-for="(item, index) in data_source_content_list" :key="index" :style="indicator_style + (actived_index == index ? 'background:' + new_style.actived_color : '')" class="dot-item" />
                            </block>
                        </view>
                    </view>
                    <template v-else>
                        <view :style="style_chunk_container">
                            <view class="wh-auto ht-auto oh" :style="style_chunk_img_container">
                                <dataGroupRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="0" :propFieldList="propFieldList" :propDataHeight="propDataHeight" :propScale="custom_scale" :propConfigLoop="propConfigLoop !== '1' ? form.is_use_parent_data : '1'" @url_event="url_event"></dataGroupRendering>
                            </view>
                        </view>
                    </template>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, common_img_computer, percentage_count, isEmpty, get_indicator_style, get_indicator_location_style, border_width, get_is_eligible, get_swiper_list } from '@/common/js/common/common.js';
    // a组件调用b组件 b组件调用a组件，为了避免循环引用在uniapp中出问题，复制一个相同的data-group-rendering组件
    import dataGroupRendering from '@/pages/diy/components/diy/modules/custom/data-group-rendering.vue';
    const app = getApp();

    export default {
        components: {
            dataGroupRendering
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
                required: true,
            },
            propSourceList: {
                type: [ Object, Array ],
                default: () => {
                    return {};
                },
            },
            propKey: {
                type: [String,Number],
                default: '',
            },
            propScale: {
                type: Number,
                default: 1
            },
            propDataWidth: {
                type: Number,
                default: 0,
            },
            propDataHeight: {
                type: Number,
                default: 0,
            },
            propIsCustom: {
                type: Boolean,
                default: false
            },
            propFieldList: {
                type: Array,
                default: []
            },
            propGroupSourceList: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            propShowData: {
                type: Object,
                default: () => ({
                    data_key: 'id',
                    data_name: 'name',
                })
            },
            propConfigLoop: {
                type: String,
                default: "1"
            }
        },
        data() {
            return {
                form: {},
                new_style: {},
                custom_scale: 1,
                style_container: '',
                style_img_container: '',
                custom_list_length: 0,
                custom_group_field_id: '',
                source_list: {
                    // 存放手动输入的id
                    data_ids: [],
                    // 手动输入
                    data_list: [],
                    // 自动
                    data_auto_list: [],
                },
                data_source_content_list: [],
                data_source: '',
                // 内容样式
                style_content_container: '',
                style_content_img_container: '',
                // 数据样式
                style_chunk_container: '',
                style_chunk_img_container: '',
                // 指示器选中的下标
                actived_index: 0,
                // 轮播高度
                swiper_height: 0,
                swiper_width: 'width: 100%;',
                // 指示器样式
                indicator_location_style: '',
                indicator_style: '',
                slides_per_view: 1,
                show_data: { data_key: 'id', data_name: 'name' },
                old_data_style: {
                    color_list: [{ color: 'rgb(244, 252, 255)', color_percentage: undefined }],
                    direction: '180deg',
                    background_img_style: '2',
                    background_img: [],
                    radius: 0,
                    radius_top_left: 0,
                    radius_top_right: 0,
                    radius_bottom_left: 0,
                    radius_bottom_right: 0,
                    padding: 0,
                    padding_top: 0,
                    padding_bottom: 0,
                    padding_left: 0,
                    padding_right: 0,
                    margin: 0,
                    margin_top: 0,
                    margin_bottom: 0,
                    margin_left: 0,
                    margin_right: 0,
                },
                content_outer_spacing_magin: '0rpx',
                gap_width: '',
                is_show: true
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
            percentage_count,
            init() {
                const new_form = this.propValue;
                const new_style = this.propValue.data_style;
                const data_source_id = new_form?.data_source_field?.id || '';
                // 自定义组的数据源内容切换, 判断是取自定义组数据源内容还是取自定义数据源内容
                const is_data_source_id = this.propFieldList.filter((item) => item.field == data_source_id);
                let new_list = [];
                // 判断是否是循环内容
                if (this.propConfigLoop == '1') {
                    // 如果自定义组选择了数据源，就按照自定义组的数据源的方式走，否则的话就按照自定义的数据走
                    if (is_data_source_id.length > 0) {
                        const list = this.get_data_source_content_list(this.propSourceList, new_form);
                        // 数据来源的内容
                        new_list = list.length > 0 ? get_swiper_list(list, new_form.data_source_carousel_col, new_style.rolling_fashion, new_form.data_source_direction != 'vertical') : [];
                    } else {
                        if (!isEmpty(this.propSourceList)) {
                            const new_source_list = [ this.propSourceList ];
                            new_list = [{ split_list: new_source_list }];
                        } else {
                            new_list = [];
                        }
                    }
                } else {
                    // 如果使用父级数据，就直接使用父级的全部数据，否则的话就没有任何数据
                    if (new_form.is_use_parent_data == '1') {
                        new_list = this.propGroupSourceList;
                    } else {
                        new_list = [];
                    }
                }
                // 初始化数据
                const { common_style, data_content_style, data_style } = new_style;
                const old_width = this.propDataWidth * this.propScale;
                // 外层左右间距
                const outer_spacing = (common_style?.margin_left || 0) + (common_style?.margin_right || 0) + (common_style?.padding_left || 0) + (common_style?.padding_right || 0) + border_width(common_style);
                // 内容左右间距
                const content_spacing = (data_content_style?.margin_left || 0) + (data_content_style?.margin_right || 0) + (data_content_style?.padding_left || 0) + (data_content_style?.padding_right || 0) + border_width(data_content_style);
                // 数据左右间距
                const internal_spacing = (data_style?.margin_left || 0) + (data_style?.margin_right || 0) + (data_style?.padding_left || 0) + (data_style?.padding_right || 0) + border_width(data_style);
                // 一行显示的数量
                const carousel_col = Number(new_form.data_source_carousel_col);
                // 数据间距
                const data_spacing = ['vertical', 'horizontal'].includes(new_form.data_source_direction) ? new_style.column_gap * (carousel_col - 1) : 0;
                // 自定义组件宽度
                const width = old_width - outer_spacing - content_spacing - internal_spacing - data_spacing;
                // 自定义组的比例
                const scale_number = width / this.propDataWidth;
                const custom_scale = scale_number > 0 ? scale_number : 0;
                const new_data_style = !isEmpty(new_style.data_style) ? new_style.data_style : this.old_data_style;
                const new_data_content_style = !isEmpty(new_style.data_content_style)? new_style.data_content_style : this.old_data_style;
                // 判断是平移还是整屏滚动
                const { padding_top = 0, padding_bottom = 0, margin_bottom = 0, margin_top = 0 } = new_data_style;
                let swiper_height = 0;
                let col = Number(new_form.data_source_carousel_col);
                // 间距
                const space_between = new_form.data_source_direction == 'horizontal' ? new_style.column_gap : new_style.row_gap;
                // 轮播图高度控制
                if (new_form.data_source_direction == 'horizontal') {
                    swiper_height = this.propDataHeight * custom_scale + padding_top + padding_bottom + margin_bottom + margin_top;
                } else {
                    // 商品数量大于列数的时候，高度是列数，否则是当前的数量
                    col = new_list.length > carousel_col ? carousel_col : new_list.length;
                    swiper_height = (this.propDataHeight * custom_scale + padding_top + padding_bottom + margin_bottom + margin_top) * col + ((Number(new_form.data_source_carousel_col) - 1) * space_between);
                }
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (new_style.column_gap * (carousel_col - 1)) / carousel_col;
                // 横向的时候，根据选择的行数和每行显示的个数来区分具体是显示多少个
                const swiper_width = (new_form.data_source_direction == 'horizontal' && new_style.rolling_fashion != 'translation') ? `width: ${ 100 / carousel_col }%;`: 'width: 100%;';
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    custom_scale: custom_scale,
                    custom_list_length: new_form.custom_list.length - 1,
                    style_container: common_styles_computer(new_style.common_style) + (new_form.is_scroll_bar == '1' ? 'overflow: auto;' : '') + 'box-sizing: border-box;', // 用于样式显示
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    style_content_container: common_styles_computer(new_data_content_style) + 'box-sizing: border-box;', // 用于样式显示
                    style_content_img_container: common_img_computer(new_data_content_style),
                    style_chunk_container: common_styles_computer(new_data_style) + 'box-sizing: border-box;', // 用于样式显示
                    style_chunk_img_container: common_img_computer(new_data_style),
                    style_chunk_width: width,
                    data_source_content_list: new_list,
                    data_source: !isEmpty(new_form.data_source)? new_form.data_source : '',
                    indicator_style: get_indicator_style(new_style), // 指示器的样式
                    indicator_location_style: get_indicator_location_style(new_style),
                    swiper_height: swiper_height,
                    swiper_width: swiper_width,
                    content_outer_spacing_magin: space_between + 'px',
                    gap_width: `width: calc(${100 / carousel_col}% - ${gap}px);`,
                    slides_per_view: new_style.rolling_fashion == 'translation' ? (new_form.data_source_direction != 'horizontal' ? col : new_form.data_source_carousel_col ) : 1,
                    is_show: this.get_is_show(new_form),
                    custom_group_field_id: new_form.data_source_field.id,
                });
            },
            get_is_show(form) {
                if (this.propConfigLoop == '1') {
                    // 取出条件判断的内容
                    const condition = form?.condition || { field: '', type: '', value: '' };
                    return get_is_eligible(this.propFieldList, condition, this.propSourceList, this.propIsCustom, false, this.propCustomGroupFieldId);
                } else {
                    return true;
                }
            },
            get_data_source_content_list(sourceList, form) {
                if (!isEmpty(sourceList)) {
                    const data_source_id = form?.data_source_field.id || '';
                    let list = this.get_nested_property(sourceList, data_source_id);
                    // 如果是自定义标题，进一步处理嵌套对象中的数据
                    if (sourceList.data) {
                        list = this.get_nested_property(sourceList.data, data_source_id);
                    }
                    return list == '' ? [] : list;
                } else {
                    return [];
                }
            },
            get_nested_property(obj, path) {
                // 检查路径参数是否为字符串且非空，若不满足条件则返回空字符串
                if (typeof path !== 'string' || !path) return [];
                // 将属性路径字符串拆分为属性键数组
                const keys = path.split('.');
                // 使用reduce方法遍历属性键数组，逐层访问对象属性
                // 如果当前对象存在且拥有下一个属性键，则继续访问；否则返回空字符串
                return keys.reduce((o, key) => (o != null && o[key] != null ? o[key] : []), obj) ?? [];
            },
            slideChange(e) {
                this.setData({
                    actived_index: e.detail.current,
                });
            },
            url_event(e, index, split_index) {
                if (this.data_source == 'goods' && this.data_source_content_list.length > 0) {
                    const list = this.data_source_content_list[index];
                    if (!isEmpty(list) && !isEmpty(list.split_list[split_index])) {
                        const new_list = list.split_list[split_index];
                        if (!isEmpty(new_list)) {
                            // 缓存商品数据
                            app.globalData.goods_data_cache_handle(new_list.data.id, new_list.data);
                        }
                    }
                }
                app.globalData.url_open(e);
            },
        },
    };
</script>

<style scoped lang="scss">
</style>
