<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <view :style="style_content_container">
                <view class="w h pr" :style="style_content_img_container">
                    <template v-if="!isEmpty(form.data_source) && form.data_source_is_loop !== '0'">
                        <template v-if="data_source_content_list.length > 0 && form.data_source_direction == 'vertical'">
                            <view class="flex-row flex-wrap" :style="'row-gap:' + new_style.row_gap + 'px;column-gap:' + new_style.column_gap + 'px;'">
                                <view v-for="(item, index) in data_source_content_list" :key="index" class="ht-auto" :style="gap_width">
                                    <view v-for="(item1, index1) in item.split_list" :key="index1">
                                        <template v-if="!isEmpty(item1)">
                                            <view :style="style_chunk_container">
                                                <view class="wh-auto ht-auto oh" :style="style_chunk_img_container">
                                                    <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="index1" :propSourceList="item1" :propConfigLoop="form.data_source_is_loop || '1'" :propGroupSourceList="data_source_content_list" :propFieldList="field_list" :propDataHeight="form.height" :propScale="scale" :propDataIndex="index" :propDataSplitIndex="index1" :propIsCustom="form.is_custom_data == '1'" :propShowData="show_data" @url_event="url_event"></dataRendering>
                                                </view>
                                            </view>
                                        </template>
                                    </view>
                                </view>
                            </view>
                        </template>
                        <view v-else-if="data_source_content_list.length > 0 && ['vertical-scroll', 'horizontal'].includes(form.data_source_direction)" class="oh ht-auto">
                            <swiper class="w flex" circular="true" :vertical="form.data_source_direction != 'horizontal'" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :display-multiple-items="slides_per_view" :style="{ width: '100%', height: swiper_height + 'px' }" @change="slideChange">
                                <swiper-item v-for="(item, index) in data_source_content_list" :key="index">
                                    <view :class="form.data_source_direction != 'horizontal' ? 'ht-auto ' : 'flex-row ht-auto'" :style="form.data_source_direction == 'horizontal' ? 'column-gap:' + new_style.column_gap + 'px;' : ''">
                                        <view v-for="(item1, index1) in item.split_list" :key="index1" class="wh-auto ht-auto" :style="style_chunk_container + swiper_width + (form.data_source_direction == 'horizontal' ? gap_width : 'margin-bottom:' + content_outer_spacing_magin)">
                                            <template v-if="!isEmpty(item1)">
                                                <view class="wh-auto ht-auto oh" :style="style_chunk_img_container">
                                                    <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="index1" :propSourceList="item1" :propConfigLoop="form.data_source_is_loop || '1'" :propGroupSourceList="data_source_content_list" :propFieldList="field_list" :propScale="scale" :propDataIndex="index" :propDataSplitIndex="index1" :propIsCustom="form.is_custom_data == '1'" :propShowData="show_data" @url_event="url_event"></dataRendering>
                                                </view>
                                            </template>
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
                                    <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="0" :propConfigLoop="form.data_source_is_loop || '1'" :propFieldList="field_list" :propDataHeight="form.height" :propScale="scale" @url_event="url_event"></dataRendering>
                                </view>
                            </view>
                        </template>
                    </template>
                    <template v-else-if="!isEmpty(form.data_source) && form.data_source_is_loop == '0'">
                        <view class="h" :style="style_chunk_container">
                            <view class="w h oh" :style="style_chunk_img_container">
                                <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="0" :propSourceList="{}" :propConfigLoop="form.data_source_is_loop || '1'" :propGroupSourceList="data_source_content_list" :propFieldList="field_list" :propDataHeight="form.height" :propScale="scale" :propIsCustom="form.is_custom_data == '1'" :propShowData="show_data" @url_event="url_event"></dataRendering>
                            </view>
                        </view>
                    </template>
                    <template v-else>
                        <view :style="style_chunk_container">
                            <view class="wh-auto ht-auto oh" :style="style_chunk_img_container">
                                <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="0" :propConfigLoop="form.data_source_is_loop || '1'" :propFieldList="field_list" :propDataHeight="form.height" :propScale="scale" @url_event="url_event"></dataRendering>
                            </view>
                        </view>
                    </template>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, common_img_computer, percentage_count, isEmpty, get_indicator_style, get_indicator_location_style, border_width, get_swiper_list } from '@/common/js/common/common.js';
    import dataRendering from '@/pages/diy/components/diy/modules/custom/data-rendering.vue';
    const app = getApp();
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);

    export default {
        components: {
            dataRendering
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propTabsDataType: {
                type: String,
                default: 'custom',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
            propOuterContainerPadding: {
                type: Number,
                default: 0,
            }
        },
        data() {
            return {
                form: {},
                new_style: {},
                scale: 1,
                style_container: '',
                style_img_container: '',
                div_width: 0,
                div_height: 0,
                custom_list_length: 0,
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
                field_list: [],
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
            isEmpty,
            init() {
                if (this.propTabsDataType !== 'custom') {
                    return;
                }
                const new_form = this.propValue.content;
                const new_style = this.propValue.style;
                // 不包含新创建的数组时，将历史数据放到手动添加数组中
                if (!Object.keys(new_form.data_source_content).includes('data_auto_list') && !Object.keys(new_form.data_source_content).includes('data_list')) {
                    //深拷贝一下，保留历史数据
                    const data = JSON.parse(JSON.stringify(new_form.data_source_content));
                    new_form.data_source_content = this.source_list;
                    // 如果老数组中有数据，将数据放到新数组中
                    if (!isEmpty(data)) {
                        new_form.data_source_content.data_list = [ data ];
                    }
                }
                // 数据来源的内容
                let list = [];
                if (new_form.is_custom_data == '1') {
                    if (Number(new_form.data_source_content.data_type) === 0) {
                        list = new_form.data_source_content?.data_list || [];
                    } else {
                        list = !isEmpty(new_form.data_source_content) ? 
                                new_form.data_source_content.data_auto_list.map(item => ({
                                    id: Math.random(),
                                    new_cover: [],
                                    new_title: '',
                                    data: item,
                                })) : [];
                    }
                } else {
                    list = new_form.data_source_content?.data_list || [];
                } 
                // 数组处理
                const new_list = list.length > 0 ? get_swiper_list(list, new_form.data_source_carousel_col, new_style.rolling_fashion, new_form.data_source_direction != 'vertical') : [];
                // 初始化数据
                const { common_style, data_content_style, data_style } = new_style;
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
                const width = sys_width - outer_spacing - content_spacing - internal_spacing - data_spacing - this.propOuterContainerPadding;
                const new_data_style = !isEmpty(new_style.data_style) ? new_style.data_style : this.old_data_style;
                const new_data_content_style = !isEmpty(new_style.data_content_style)? new_style.data_content_style : this.old_data_style;
                // 判断是平移还是整屏滚动
                const { padding_top = 0, padding_bottom = 0, margin_bottom = 0, margin_top = 0 } = new_data_style;
                let swiper_height = 0;
                const scale_number = width / 390;
                const new_scale = scale_number > 0 ? scale_number : 0;
                // 间距
                const space_between = new_form.data_source_direction == 'horizontal' ? new_style.column_gap : new_style.row_gap;
                let col = Number(new_form.data_source_carousel_col);
                // 轮播图高度控制
                if (new_form.data_source_direction == 'horizontal') {
                    swiper_height = new_form.height * new_scale + padding_top + padding_bottom + margin_bottom + margin_top;
                } else {
                    // 商品数量大于列数的时候，高度是列数，否则是当前的数量
                    col = new_list.length > carousel_col ? carousel_col : new_list.length;
                    swiper_height = (new_form.height * new_scale + padding_top + padding_bottom + margin_bottom + margin_top) * col + ((Number(new_form.data_source_carousel_col) - 1) * space_between);
                }
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (new_style.column_gap * (carousel_col - 1)) / carousel_col;
                // 横向的时候，根据选择的行数和每行显示的个数来区分具体是显示多少个
                const swiper_width = (new_form.data_source_direction == 'horizontal' && new_style.rolling_fashion != 'translation') ? `width: ${ 100 / carousel_col }%;`: 'width: 100%;';
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    div_width: width,
                    scale: new_scale,
                    custom_list_length: new_form.custom_list.length - 1,
                    style_container: this.propIsCommonStyle ? common_styles_computer(new_style.common_style) + 'box-sizing: border-box;' : '', // 用于样式显示
                    style_img_container: this.propIsCommonStyle ? common_img_computer(new_style.common_style, this.propIndex) : '',
                    style_content_container: common_styles_computer(new_data_content_style) + 'box-sizing: border-box;', // 用于样式显示
                    style_content_img_container: common_img_computer(new_data_content_style),
                    style_chunk_container: common_styles_computer(new_data_style) + 'box-sizing: border-box;', // 用于样式显示
                    style_chunk_img_container: common_img_computer(new_data_style),
                    style_chunk_width: width,
                    div_height: new_form.height,
                    data_source_content_list: new_list,
                    data_source: !isEmpty(new_form.data_source)? new_form.data_source : '',
                    indicator_style: get_indicator_style(new_style), // 指示器的样式
                    indicator_location_style: get_indicator_location_style(new_style),
                    swiper_height: swiper_height,
                    swiper_width: swiper_width,
                    content_outer_spacing_magin: space_between + 'px',
                    gap_width: `width: calc(${100 / carousel_col}% - ${gap}px);`,
                    slides_per_view: new_style.rolling_fashion == 'translation' ? (new_form.data_source_direction != 'horizontal' ? col : new_form.data_source_carousel_col ) : 1,
                    show_data: new_form?.show_data || { data_key: 'id', data_name: 'name' },
                    field_list: new_form?.field_list || [],
                });
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
