<template>
    <view :style="style_content_container">
        <view :style="style_content_img_container">
            <view v-if="data_source_content_list.length > 0 && form.data_source_direction == 'vertical'">
                <view class="flex-row flex-wrap" :style="'row-gap:' + new_style.row_gap + 'px;column-gap:' + new_style.column_gap + 'px;'">
                    <view v-for="(item, index) in data_source_content_list" :key="index" class="ht-auto" :style="gap_width">
                        <view v-for="(item1, index1) in item.split_list" :key="index1">
                            <view :style="style_container">
                                <view class="wh-auto ht-auto oh" :style="style_img_container">
                                    <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propSourceList="item1" :propSourceType="form.data_source" :propDataHeight="form.height" :propScale="scale" :propDataIndex="index" :propDataSplitIndex="index1" :propIsCustom="form.is_custom_data == '1'" :propShowData="show_data" @url_event="url_event"></dataRendering>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <div v-else-if="data_source_content_list.length > 0 && ['vertical-scroll', 'horizontal'].includes(form.data_source_direction)" class="oh pr">
                <swiper class="w flex" circular="true" :vertical="form.data_source_direction != 'horizontal'" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :display-multiple-items="slides_per_view" :style="{ width: '100%', height: swiper_height + 'px' }" @change="slideChange">
                    <swiper-item v-for="(item, index) in data_source_content_list" :key="index">
                        <view :class="form.data_source_direction != 'horizontal' ? '' : 'flex-row'" :style="form.data_source_direction == 'horizontal' ? 'column-gap:' + new_style.column_gap + 'px;' : ''">
                            <view v-for="(item1, index1) in item.split_list" :key="index1" :style="style_container + swiper_width + (form.data_source_direction == 'horizontal' ? gap_width : 'margin-bottom:' + content_outer_spacing_magin)">
                                <div class="wh-auto ht-auto oh" :style="style_img_container">
                                    <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propSourceList="item1" :propSourceType="form.data_source" :propDataHeight="form.height" :propScale="scale" :propDataIndex="index" :propDataSplitIndex="index1" :propIsCustom="form.is_custom_data == '1'" :propShowData="show_data" @url_event="url_event"></dataRendering>
                                </div>
                            </view>
                        </view>
                    </swiper-item>
                </swiper>
            </div>
            <view v-else>
                <view :style="style_container">
                    <view class="wh-auto ht-auto oh" :style="style_img_container">
                        <dataRendering :propKey="propKey" :propCustomList="form.custom_list" :propDataHeight="form.height" :propScale="scale" @url_event="url_event"></dataRendering>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { padding_computer, isEmpty, margin_computer, gradient_computer, radius_computer, background_computer, common_styles_computer, common_img_computer } from '@/common/js/common/common.js';
import dataRendering from '@/components/diy/modules/custom/data-rendering.vue';
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
        init() {
            if (!isEmpty(this.propValue)) {
                const new_form = this.propValue.data_content;
                const new_style = this.propValue.data_style;
                const { data_color_list = [], data_direction = '180deg', data_radius = { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 }, data_background_img = [], data_background_img_style = '2', data_chunk_padding = { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 }, data_chunk_margin = { margin: 0, margin_top: 0, margin_bottom: 0, margin_left: 0, margin_right: 0 } } = new_style;
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
                const new_list = list.length > 0 ? this.get_list(list, new_form, new_style) : [];
                // 计算宽度
                const { padding_left, padding_right, padding_top, padding_bottom } = data_chunk_padding;
                const { margin_left, margin_right, margin_bottom, margin_top } = data_chunk_margin;
                const width = new_form.width - padding_left - padding_right - margin_left - margin_right - (this.propDataSpacing / 2);
                const new_scale = (width / new_form.width) * this.propMagicScale;
                // 间距
                const space_between = new_form.data_source_direction == 'horizontal' ? new_style.column_gap : new_style.row_gap;
                // 判断是平移还是整屏滚动
                let swiper_height = 0;
                // 商品数量大于列数的时候，高度是列数，否则是当前的数量
                const col = new_list.length > Number(new_form.data_source_carousel_col) ? Number(new_form.data_source_carousel_col) : new_list.length;
                // 轮播图高度控制
                if (new_form.data_source_direction == 'horizontal') {
                    swiper_height = new_form.height * new_scale + padding_top + padding_bottom + margin_bottom + margin_top;
                } else {
                    swiper_height = (new_form.height * new_scale + padding_top + padding_bottom + margin_bottom + margin_top) * col + ((Number(new_form.data_source_carousel_col) - 1) * space_between);
                }
                // 拿到对应的数量
                const model_number = Number(new_form.data_source_carousel_col);
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (new_style.column_gap * (model_number - 1)) / model_number;
                // 横向的时候，根据选择的行数和每行显示的个数来区分具体是显示多少个
                const swiper_width = (new_form.data_source_direction == 'horizontal' && new_style.rolling_fashion != 'translation') ? `width: ${ 100 / new_form.data_source_carousel_col }%;`: 'width: 100%;';
                const content_style = !isEmpty(new_style.data_content_style)? new_style.data_content_style : this.defalt_style;
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    div_width: width,
                    scale: new_scale,
                    custom_list_length: new_form.custom_list.length - 1,
                    style_content_container: common_styles_computer(content_style),
                    style_content_img_container: common_img_computer(content_style),
                    style_container: gradient_computer(style_data) + radius_computer(data_radius) + margin_computer(data_chunk_margin), // 用于样式显示
                    style_img_container: padding_computer(data_chunk_padding) + background_computer(style_img_data) + 'box-sizing: border-box;',
                    data_source_content_list: new_list,
                    data_source: !isEmpty(new_form.data_source)? new_form.data_source : '',
                    slides_per_view: new_style.rolling_fashion == 'translation' ? (new_form.data_source_direction != 'horizontal' ? col : new_form.data_source_carousel_col) : 1,
                    swiper_height: swiper_height,
                    swiper_width: swiper_width,
                    show_data: new_form?.show_data || { data_key: 'id', data_name: 'name' },
                    content_outer_spacing_magin: space_between + 'px',
                    gap_width: `width: calc(${100 / model_number}% - ${gap}px);`,
                });
            }
        },
        get_list(list, form, new_style) {
            // 深拷贝一下，确保不会出现问题
            const cloneList = JSON.parse(JSON.stringify(list));
            if (new_style.rolling_fashion != 'translation' && form.data_source_direction != 'vertical') {
                // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
                if (cloneList.length > 0) {
                    // 每页显示的数量
                    const num = form.data_source_carousel_col;
                    // 存储数据显示
                    let nav_list = [];
                    // 拆分的数量
                    const split_num = Math.ceil(cloneList.length / num);
                    for (let i = 0; i < split_num; i++) {
                        nav_list.push({
                            split_list: cloneList.slice(i * num, (i + 1) * num),
                        });
                    }
                    return nav_list;
                } else {
                    // 否则的话，就返回全部的信息
                    return [
                        {
                            split_list: cloneList,
                        },
                    ];
                }
            } else {
                // 存储数据显示
                let nav_list = [];
                cloneList.forEach((item) => {
                    nav_list.push({
                        split_list: [item],
                    });
                });
                return nav_list;
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
            app.globalData.url_event(e);
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
