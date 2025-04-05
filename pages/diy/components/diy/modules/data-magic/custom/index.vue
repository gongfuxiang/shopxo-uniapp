<template>
    <view :style="style_content_container">
        <view :style="style_content_img_container">
            <template v-if="!isEmpty(form.data_source) && form.data_source_is_loop !== '0'">
                <view v-if="data_source_content_list.length > 0 && form.data_source_direction == 'vertical'">
                    <view class="flex-row flex-wrap" :style="'row-gap:' + new_style.row_gap + 'px;column-gap:' + new_style.column_gap + 'px;'">
                        <view v-for="(item, index) in data_source_content_list" :key="index" class="ht-auto" :style="gap_width">
                            <view v-for="(item1, index1) in item.split_list" :key="index1">
                                <template v-if="!isEmpty(item1)">
                                    <view :style="style_container">
                                        <view class="wh-auto ht-auto oh" :style="style_img_container">
                                            <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="index1" :propSourceList="item1" :propConfigLoop="form.data_source_is_loop || '1'" :propGroupSourceList="data_source_content_list" :propSourceType="form.data_source" :propDataHeight="form.height" :propScale="scale" :propDataIndex="index" :propDataSplitIndex="index1" :propIsCustom="form.is_custom_data == '1'" :propShowData="show_data" @url_event="url_event"></dataRendering>
                                        </view>
                                    </view>
                                </template>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else-if="data_source_content_list.length > 0 && ['vertical-scroll', 'horizontal'].includes(form.data_source_direction)" class="oh pr">
                    <swiper class="w flex" circular="true" :vertical="form.data_source_direction != 'horizontal'" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :display-multiple-items="slides_per_view" :style="{ width: '100%', height: swiper_height + 'px' }" @change="slideChange">
                        <swiper-item v-for="(item, index) in data_source_content_list" :key="index">
                            <view :class="form.data_source_direction != 'horizontal' ? '' : 'flex-row'" :style="form.data_source_direction == 'horizontal' ? 'column-gap:' + new_style.column_gap + 'px;' : ''">
                                <view v-for="(item1, index1) in item.split_list" :key="index1" :style="style_container + swiper_width + (form.data_source_direction == 'horizontal' ? gap_width : 'margin-bottom:' + content_outer_spacing_magin)">
                                    <template v-if="!isEmpty(item1)">
                                        <view class="wh-auto ht-auto oh" :style="style_img_container">
                                            <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="index1" :propSourceList="item1" :propConfigLoop="form.data_source_is_loop || '1'" :propGroupSourceList="data_source_content_list" :propSourceType="form.data_source" :propDataHeight="form.height" :propScale="scale" :propDataIndex="index" :propDataSplitIndex="index1" :propIsCustom="form.is_custom_data == '1'" :propShowData="show_data" @url_event="url_event"></dataRendering>
                                        </view>
                                    </template>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
                <view v-else>
                    <view :style="style_container">
                        <view class="wh-auto ht-auto oh" :style="style_img_container">
                            <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="0" :propConfigLoop="form.data_source_is_loop || '1'" :propDataHeight="form.height" :propScale="scale" @url_event="url_event"></dataRendering>
                        </view>
                    </view>
                </view>
            </template>
            <view v-else-if="!isEmpty(form.data_source) && form.data_source_is_loop == '0'">
                <view :style="style_container">
                    <view class="w h oh" :style="style_img_container">
                        <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="0" :propSourceList="{}" :propConfigLoop="form.data_source_is_loop || '1'" :propGroupSourceList="data_source_content_list" :propSourceType="form.data_source" :propDataHeight="form.height" :propScale="scale" :propIsCustom="form.is_custom_data == '1'" :propShowData="show_data" @url_event="url_event"></dataRendering>
                    </view>
                </view>
            </view>
            <view v-else>
                <view :style="style_container">
                    <view class="wh-auto ht-auto oh" :style="style_img_container">
                        <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propIndex="0" :propConfigLoop="form.data_source_is_loop || '1'" :propDataHeight="form.height" :propScale="scale" @url_event="url_event"></dataRendering>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { padding_computer, isEmpty, margin_computer, gradient_computer, radius_computer, background_computer, common_styles_computer, common_img_computer, border_width, box_shadow_computer, border_computer, old_border_and_box_shadow, old_margin, old_padding, old_radius, get_swiper_list } from '@/common/js/common/common.js';
import dataRendering from '@/pages/diy/components/diy/modules/custom/data-rendering.vue';
const app = getApp();

export default {
    components: {
        dataRendering
    },
    props: {
        propKey: {
            type: String,
            default: '',
        },
        propValue: {
            type: Object,
            default: () => {
                return {};
            },
        },
        propMagicScale: {
            type: Number,
            default: 1,
        },
        propDataSpacing: {
            type: Number,
            default: 0,
        },
        propDataIndex: {
            type: Number,
            default: 0,
        },
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
            data_source_content_list: [],
            data_source: '',
            // 一屏显示的数量
            slides_per_view: 1,
            // 轮播高度
            swiper_height: 0,
            swiper_width: 'width: 100%;',
            show_data: { data_key: 'id', data_name: 'name' },
            gap_width: '',
            content_outer_spacing_magin: '0rpx',
            defalt_style: {
                color_list: [{ color: '', color_percentage: undefined }],
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
            style_content_container: '',
            style_content_img_container: '',
        };
    },
    watch: {
        propKey(val) {
            // 初始化
            this.init();
        },
    },
    computed: {
        get_percentage_count() {
            return (num) => {
                return num * this.scale + 'px';
            };
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        isEmpty,
        init() {
            if (!isEmpty(this.propValue)) {
                const new_form = this.propValue.data_content;
                const new_style = this.propValue.data_style;
                const { data_common_style = {}, data_color_list = [], data_direction = '180deg', data_radius = old_radius, data_background_img = [], data_background_img_style = '2', data_chunk_padding = old_padding, data_chunk_margin = old_margin, data_content_style = {}, data_pattern = old_border_and_box_shadow } = new_style;
                const style_data = {
                    color_list: data_color_list,
                    direction: data_direction,
                }
                const style_img_data = {
                    background_img: data_background_img,
                    background_img_style: data_background_img_style,
                }
                // 数据来源的内容
                let list = [];
                if (new_form.is_custom_data == '1') {
                    if (Number(new_form.data_source_content.data_type) === 0) {
                        list = new_form.data_source_content.data_list;
                    } else {
                        list = new_form.data_source_content.data_auto_list.map(item => ({
                            id: Math.random(),
                            new_cover: [],
                            new_title: '',
                            data: item,
                        }));
                    }
                } else {
                    list = new_form.data_source_content.data_list;
                }
                const new_list = list.length > 0 ? get_swiper_list(list, new_form.data_source_carousel_col, new_style.rolling_fashion, new_form.data_source_direction != 'vertical') : [];
                // 计算宽度
                const { padding_left, padding_right, padding_top, padding_bottom } = data_chunk_padding;
                const { margin_left, margin_right, margin_bottom, margin_top } = data_chunk_margin;
                const old_width = new_form.width * this.propMagicScale;
                // 数据宽度
                const data_style = padding_left + padding_right + margin_left + margin_right + border_width(data_pattern);
                // 通用样式
                const chunk_padding = new_style?.chunk_padding || old_padding;
                const chunk_margin = new_style?.chunk_margin || old_margin;
                const common_styles = (chunk_margin?.margin_left || 0) + (chunk_margin?.margin_right || 0) + (chunk_padding?.padding_left || 0) + (chunk_padding?.padding_right || 0) + border_width(data_common_style);
                // 内容左右间距
                const content_spacing = (data_content_style?.margin_left || 0) + (data_content_style?.margin_right || 0) + (data_content_style?.padding_left || 0) + (data_content_style?.padding_right || 0) + border_width(data_content_style);
                const carousel_col = Number(new_form.data_source_carousel_col);
                // 数据间距
                const data_spacing = ['vertical', 'horizontal'].includes(new_form.data_source_direction) ? new_style.column_gap * (carousel_col - 1) : 0;
                // 当前容器的宽度 减去 左右两边的padding值 再减去 数据间距的一半 再除以 容器的宽度 得到比例 再乘以数据魔方的比例
                const width = old_width - data_style - content_spacing - common_styles - data_spacing - (this.propDataSpacing / 2);
                // 计算缩放比例
                // 比例增加最小值判断
                const scale_number = width / new_form.width;
                const new_scale = scale_number > 0 ? scale_number : 0;
                // 间距
                const space_between = new_form.data_source_direction == 'horizontal' ? new_style.column_gap : new_style.row_gap;
                // 判断是平移还是整屏滚动
                let swiper_height = 0;
                // 商品数量大于列数的时候，高度是列数，否则是当前的数量
                const col = new_list.length > carousel_col ? carousel_col : new_list.length;
                // 轮播图高度控制
                if (new_form.data_source_direction == 'horizontal') {
                    swiper_height = new_form.height * new_scale + padding_top + padding_bottom + margin_bottom + margin_top;
                } else {
                    swiper_height = (new_form.height * new_scale + padding_top + padding_bottom + margin_bottom + margin_top) * col + ((carousel_col - 1) * space_between);
                }
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (new_style.column_gap * (carousel_col - 1)) / carousel_col;
                // 横向的时候，根据选择的行数和每行显示的个数来区分具体是显示多少个
                const swiper_width = (new_form.data_source_direction == 'horizontal' && new_style.rolling_fashion != 'translation') ? `width: ${ 100 / carousel_col }%;`: 'width: 100%;';
                const content_style = !isEmpty(new_style.data_content_style)? new_style.data_content_style : this.defalt_style;
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    div_width: width,
                    scale: new_scale,
                    custom_list_length: new_form.custom_list.length - 1,
                    style_content_container: common_styles_computer(content_style),
                    style_content_img_container: common_img_computer(content_style),
                    style_container: gradient_computer(style_data) + radius_computer(data_radius) + margin_computer(data_chunk_margin) + box_shadow_computer(data_pattern) + border_computer(data_pattern), // 用于样式显示
                    style_img_container: padding_computer(data_chunk_padding) + background_computer(style_img_data) + 'box-sizing: border-box;',
                    data_source_content_list: new_list,
                    data_source: !isEmpty(new_form.data_source)? new_form.data_source : '',
                    slides_per_view: new_style.rolling_fashion == 'translation' ? (new_form.data_source_direction != 'horizontal' ? col : carousel_col) : 1,
                    swiper_height: swiper_height,
                    swiper_width: swiper_width,
                    show_data: new_form?.show_data || { data_key: 'id', data_name: 'name' },
                    content_outer_spacing_magin: space_between + 'px',
                    gap_width: `width: calc(${100 / carousel_col}% - ${gap}px);`,
                });
            }
        },
        slideChange(e) {
            this.$emit('onCarouselChange', e.detail.current, this.propDataIndex);
        },
        url_event(e, index, split_index) {
            if (this.form.data_source == 'goods' && this.data_source_content_list.length > 0) {
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
.main-content {
    position: absolute;
    overflow: hidden;
}
</style>
