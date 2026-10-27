<template>
    <view v-if="has_content" :style="style_container">
        <view class="pr" :style="style_img_container">
            <view class="service-nav" :style="content_bg_style">
                <view class="service-nav-inner" :style="content_inner_style">
                    <view v-if="show_title_row" class="service-title" :style="title_style">
                        <block v-if="title_bar_show == '1'">
                            <image-empty v-if="title_bar_img" :propImageSrc="title_bar_img" propImgFit="heightFix" :propStyle="title_bar_img_style" :propErrorStyle="title_bar_img_error_style"></image-empty>
                            <iconfont v-else-if="title_bar_icon" :name="'icon-' + title_bar_icon" :size="title_bar_size * 2 + 'rpx'" :color="title_bar_icon_color" propContainerDisplay="flex"></iconfont>
                        </block>
                        <text v-if="title_show == '1' && title" class="text-line-1">{{ title }}</text>
                    </view>

                    <view v-if="theme == '1' && service_list.length > 0" class="service-grid-wrap">
                        <swiper v-if="display_style == 'slide'" class="service-swiper" :circular="circular" :autoplay="autoplay" :interval="interval_time" :duration="500" :display-multiple-items="slides_per_group" :style="'height:' + swiper_height" @change="slide_change">
                            <swiper-item v-for="(page, p_index) in page_list" :key="p_index">
                                <view class="service-grid" :class="p_index == 0 ? 'service-grid-' + propKey : ''" :style="is_translation ? translation_grid_style : grid_style">
                                    <view v-for="(item, index) in page.split_list" :key="index" class="service-grid-item flex-col align-c" :style="is_translation ? translation_item_style : icon_text_gap_style" :data-value="item_url(item)" @tap="url_event">
                                        <view class="service-icon flex-row align-c jc-c" :style="icon_box_style">
                                            <image-empty v-if="item.img && item.img.length > 0" :propImageSrc="item.img[0]" propImgFit="aspectFit" :propStyle="icon_img_style" :propErrorStyle="icon_img_style"></image-empty>
                                            <iconfont v-else-if="item.icon" :name="'icon-' + item.icon" :size="icon_size * 2 + 'rpx'" :color="icon_color" propContainerDisplay="flex"></iconfont>
                                        </view>
                                        <view class="text-line-1 tc w" :style="item_style">{{ item.title || '服务' }}</view>
                                    </view>
                                </view>
                            </swiper-item>
                        </swiper>
                        <view v-else class="service-grid" :style="grid_style">
                            <view v-for="(item, index) in service_list" :key="index" class="service-grid-item flex-col align-c" :style="icon_text_gap_style" :data-value="item_url(item)" @tap="url_event">
                                <view class="service-icon flex-row align-c jc-c" :style="icon_box_style">
                                    <image-empty v-if="item.img && item.img.length > 0" :propImageSrc="item.img[0]" propImgFit="aspectFit" :propStyle="icon_img_style" :propErrorStyle="icon_img_style"></image-empty>
                                    <iconfont v-else-if="item.icon" :name="'icon-' + item.icon" :size="icon_size * 2 + 'rpx'" :color="icon_color" propContainerDisplay="flex"></iconfont>
                                </view>
                                <view class="text-line-1 tc w" :style="item_style">{{ item.title || '服务' }}</view>
                            </view>
                        </view>
                    </view>

                    <view v-else-if="theme == '0' && service_list.length > 0" class="service-list">
                        <block v-for="(item, index) in service_list" :key="index">
                            <view class="service-list-item flex-row align-c jc-sb gap-8" :style="item_padding_style" :data-value="item_url(item)" @tap="url_event">
                                <view class="flex-row align-c oh flex-1" :style="icon_text_gap_style">
                                    <view class="service-icon flex-row align-c jc-c flex-shrink" :style="icon_box_style">
                                        <image-empty v-if="item.img && item.img.length > 0" :propImageSrc="item.img[0]" propImgFit="aspectFit" :propStyle="icon_img_style" :propErrorStyle="icon_img_style"></image-empty>
                                        <iconfont v-else-if="item.icon" :name="'icon-' + item.icon" :size="icon_size * 2 + 'rpx'" :color="icon_color" propContainerDisplay="flex"></iconfont>
                                    </view>
                                    <view class="text-line-1" :style="item_style">{{ item.title || '服务' }}</view>
                                </view>
                                <view class="flex-row align-c gap-4 flex-shrink">
                                    <view v-if="item.right_text" class="text-line-1 right-text" :style="right_text_style">{{ item.right_text }}</view>
                                    <view v-if="arrow_show == '1'" class="arrow-icon flex-row align-c jc-c flex-shrink" :style="arrow_box_style">
                                        <image-empty v-if="arrow_img && arrow_img.length > 0" :propImageSrc="arrow_img[0]" propImgFit="aspectFit" :propStyle="arrow_img_style" :propErrorStyle="arrow_img_style"></image-empty>
                                        <iconfont v-else-if="arrow_icon" :name="'icon-' + arrow_icon" :size="arrow_size * 2 + 'rpx'" :color="arrow_color" propContainerDisplay="flex"></iconfont>
                                    </view>
                                </view>
                            </view>
                            <view v-if="index < service_list.length - 1" class="service-divider" :style="divider_style"></view>
                        </block>
                    </view>
                </view>
            </view>
            <view v-if="show_indicator" :class="['left', 'right'].includes(indicator_new_location) ? 'indicator_up_down_location' : 'indicator_about_location'" :style="indicator_location_style">
                <block v-if="indicator_style_type == 'num'">
                    <view :style="indicator_dot_style" class="dot-item">
                        <text :style="'color:' + actived_color">{{ actived_index + 1 }}</text>
                        <text>/{{ page_list.length }}</text>
                    </view>
                </block>
                <block v-else>
                    <view v-for="(page, index) in page_list" :key="index" class="dot-item" :style="indicator_dot_style + (actived_index == index ? 'background:' + actived_color + ';' : '')"></view>
                </block>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, padding_computer, margin_computer, radius_computer, background_computer, get_indicator_style, get_indicator_location_style } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    export default {
        components: {
            imageEmpty,
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propIndex: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                has_content: false,
                theme: '0',
                show_title_row: false,
                title_show: '1',
                title: '我的服务',
                title_bar_show: '0',
                title_bar_img: '',
                title_bar_icon: '',
                title_bar_size: 14,
                title_bar_icon_color: 'rgba(255, 77, 99, 1)',
                title_bar_img_style: '',
                title_bar_img_error_style: '',
                display_style: 'fixed',
                service_list: [],
                page_list: [],
                is_translation: false,
                icon_size: 28,
                icon_color: 'rgba(51, 51, 51, 1)',
                arrow_show: '1',
                arrow_img: [],
                arrow_icon: 'arrow-right',
                arrow_color: 'rgba(153, 153, 153, 1)',
                arrow_size: 12,
                circular: false,
                autoplay: false,
                interval_time: 3000,
                slides_per_group: 1,
                swiper_height: '160rpx',
                show_indicator: false,
                indicator_style_type: 'dot',
                indicator_new_location: 'bottom',
                indicator_dot_style: '',
                indicator_location_style: '',
                actived_color: '#2A94FF',
                actived_index: 0,
                style_container: '',
                style_img_container: '',
                content_bg_style: '',
                content_inner_style: '',
                title_style: '',
                item_style: '',
                icon_box_style: '',
                icon_img_style: '',
                icon_text_gap_style: '',
                grid_style: '',
                translation_grid_style: 'display:flex;width:100%;',
                translation_item_style: '',
                item_padding_style: '',
                right_text_style: '',
                arrow_box_style: '',
                arrow_img_style: '',
                divider_style: '',
            };
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            safe_common(style) {
                const common = style && typeof style == 'object' ? Object.assign({}, style) : {};
                if (!Array.isArray(common.background_img)) {
                    common.background_img = [];
                }
                return common;
            },
            num(value, fallback) {
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            radius_style(value, fallback) {
                if (value && typeof value == 'object' && value.radius_top_left != null) {
                    return radius_computer(value);
                }
                const n = this.num(value, fallback);
                return 'border-radius:' + n * 2 + 'rpx;';
            },
            align_justify(align) {
                if (align == 'center') {
                    return 'center';
                }
                if (align == 'right') {
                    return 'flex-end';
                }
                return 'flex-start';
            },
            build_pages(list, column, row, slide, translation) {
                if (!list.length || !slide) {
                    return [{ split_list: list }];
                }
                if (translation) {
                    return list.map((item) => ({ split_list: [item] }));
                }
                const per_page = column * row;
                const pages = [];
                const split_num = Math.ceil(list.length / per_page);
                for (let i = 0; i < split_num; i++) {
                    pages.push({ split_list: list.slice(i * per_page, (i + 1) * per_page) });
                }
                return pages.length ? pages : [{ split_list: [] }];
            },
            init() {
                const content = this.propValue.content || {};
                const style = this.propValue.style || {};
                const theme = content.theme == '1' ? '1' : '0';
                const title_show = String(content.title_show == null ? '1' : content.title_show) == '0' ? '0' : '1';
                const title_bar_show = String(content.title_bar_show) == '1' ? '1' : '0';
                const title = content.title == null ? '我的服务' : String(content.title);
                const list = Array.isArray(content.service_list) ? content.service_list : [];
                const column = Math.max(this.num(content.column, 4), 1);
                const row = Math.max(this.num(content.row, 1), 1);
                const display_style = content.display_style || 'fixed';
                const rolling = style.rolling_fashion || 'translation';
                const is_translation = display_style == 'slide' && row == 1 && rolling == 'translation';
                const pages = this.build_pages(list, column, row, display_style == 'slide', is_translation);
                const slides = is_translation ? Math.max(Math.min(column, pages.length), 1) : 1;
                const icon_size = this.num(style.icon_size, 28);
                const icon_text_gap = this.num(style.icon_text_gap, 12);
                const item_size = this.num(style.item_size, 12);
                const arrow_size = this.num(style.arrow_size, 12);
                const bar_size = this.num(style.title_bar_size, 14);
                const title_size = this.num(style.title_size, 15);
                const item_pad = style.item_padding && typeof style.item_padding == 'object' && 'padding_top' in style.item_padding ? style.item_padding : { padding_top: 10, padding_bottom: 10, padding_left: 0, padding_right: 0 };
                const row_gap = (this.num(item_pad.padding_top, 0) + this.num(item_pad.padding_bottom, 0)) / 2;
                const col_gap = (this.num(item_pad.padding_left, 0) + this.num(item_pad.padding_right, 0)) / 2;
                const pad = style.content_padding && typeof style.content_padding == 'object' ? style.content_padding : { padding_top: 14, padding_right: 14, padding_bottom: 14, padding_left: 14 };
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const bg_img = background_computer({
                    background_img: Array.isArray(style.content_background_img) ? style.content_background_img : [],
                    background_img_style: style.content_background_img_style || '0',
                });
                const divider_style_name = ['dashed', 'solid', 'dotted'].indexOf(style.divider_style) >= 0 ? style.divider_style : 'solid';
                const dm = style.divider_margin && typeof style.divider_margin == 'object' ? style.divider_margin : { margin_top: 0, margin_bottom: 0, margin_left: 0, margin_right: 0 };
                const title_align = content.title_align || style.title_align || 'left';
                const show_title_row = title_show == '1' || title_bar_show == '1';
                const title_bar_img = Array.isArray(content.title_bar_img) && content.title_bar_img.length > 0 ? content.title_bar_img[0] : '';
                let row_count = 1;
                if (display_style == 'slide') {
                    row_count = is_translation ? 1 : Math.min(row, Math.max(Math.ceil(list.length / column), 1));
                } else {
                    row_count = Math.max(Math.ceil(list.length / column), 1);
                }
                const item_h = icon_size + icon_text_gap + item_size;
                const swiper_h = item_h * row_count + Math.max(row_count - 1, 0) * row_gap;
                const can_roll = display_style == 'slide' && String(style.is_roll == null ? '1' : style.is_roll) == '1' && pages.length > slides;
                const indicator_style_source = {
                    indicator_radius: style.indicator_radius,
                    indicator_style: style.indicator_style || 'dot',
                    indicator_size: this.num(style.indicator_size, 5),
                    color: style.color || '#DDDDDD',
                    indicator_new_location: style.indicator_new_location || 'bottom',
                    indicator_location: style.indicator_location || 'center',
                    indicator_bottom: this.num(style.indicator_bottom, 16),
                };
                const common_style = this.safe_common(style.common_style);
                this.setData({
                    has_content: show_title_row || list.length > 0,
                    theme: theme,
                    show_title_row: show_title_row,
                    title_show: title_show,
                    title: title,
                    title_bar_show: title_bar_show,
                    title_bar_img: title_bar_img,
                    title_bar_icon: String(content.title_bar_icon || ''),
                    title_bar_size: bar_size,
                    title_bar_icon_color: style.title_bar_icon_color || 'rgba(255, 77, 99, 1)',
                    title_bar_img_style: 'height:' + bar_size * 2 + 'rpx;width:auto;max-width:100%;',
                    title_bar_img_error_style: 'width:' + Math.max(8, Math.round(bar_size * 0.6)) * 2 + 'rpx;',
                    display_style: display_style,
                    service_list: list,
                    page_list: pages,
                    is_translation: is_translation,
                    icon_size: icon_size,
                    icon_color: style.icon_color || 'rgba(51, 51, 51, 1)',
                    arrow_show: String(content.arrow_show == null ? '1' : content.arrow_show) == '0' ? '0' : '1',
                    arrow_img: Array.isArray(content.arrow_img) ? content.arrow_img : [],
                    arrow_icon: content.arrow_icon || '',
                    arrow_color: style.arrow_color || 'rgba(153, 153, 153, 1)',
                    arrow_size: arrow_size,
                    circular: pages.length > slides,
                    autoplay: can_roll,
                    interval_time: Math.max(this.num(style.interval_time, 3), 1) * 1000,
                    slides_per_group: slides,
                    swiper_height: swiper_h * 2 + 'rpx',
                    show_indicator: theme == '1' && display_style == 'slide' && String(style.is_show == null ? '1' : style.is_show) == '1' && pages.length > 1,
                    indicator_style_type: style.indicator_style || 'dot',
                    indicator_new_location: style.indicator_new_location || 'bottom',
                    indicator_dot_style: get_indicator_style(indicator_style_source),
                    indicator_location_style: get_indicator_location_style(indicator_style_source),
                    actived_color: style.actived_color || '#2A94FF',
                    actived_index: 0,
                    style_container: common_styles_computer(common_style),
                    style_img_container: common_img_computer(common_style, this.propIndex),
                    content_bg_style: bg + this.radius_style(style.content_radius, 10) + 'overflow:hidden;',
                    content_inner_style: bg_img + padding_computer(pad),
                    title_style: 'width:100%;display:flex;align-items:center;gap:12rpx;margin-bottom:24rpx;justify-content:' + this.align_justify(title_align) + ';color:' + (style.title_color || '#333') + ';font-size:' + title_size * 2 + 'rpx;font-weight:700;',
                    item_style: 'color:' + (style.item_color || '#333') + ';font-size:' + item_size * 2 + 'rpx;',
                    icon_box_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    icon_img_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    icon_text_gap_style: 'gap:' + icon_text_gap * 2 + 'rpx;',
                    grid_style: 'grid-template-columns:repeat(' + column + ', minmax(0, 1fr));row-gap:' + row_gap * 2 + 'rpx;column-gap:' + col_gap * 2 + 'rpx;',
                    translation_item_style: 'width:100%;box-sizing:border-box;gap:' + icon_text_gap * 2 + 'rpx;',
                    item_padding_style: padding_computer(item_pad),
                    right_text_style: 'color:' + (style.right_text_color || 'rgba(153, 153, 153, 1)') + ';font-size:' + this.num(style.right_text_size, 12) * 2 + 'rpx;',
                    arrow_box_style: 'width:' + arrow_size * 2 + 'rpx;height:' + arrow_size * 2 + 'rpx;',
                    arrow_img_style: 'width:' + arrow_size * 2 + 'rpx;height:' + arrow_size * 2 + 'rpx;',
                    divider_style: 'height:0;border:0;border-top:' + this.num(style.divider_height, 1) * 2 + 'rpx ' + divider_style_name + ' ' + (style.divider_color || 'rgba(240, 240, 240, 1)') + ';background:transparent;' + margin_computer(dm),
                });
                if (display_style == 'slide' && theme == '1') {
                    this.measure_swiper();
                }
            },
            measure_swiper() {
                const key = this.propKey;
                setTimeout(() => {
                    const query = uni.createSelectorQuery().in(this);
                    query.select('.service-grid-' + key).boundingClientRect((res) => {
                        if (res && res.height) {
                            this.setData({
                                swiper_height: res.height + 'px',
                            });
                        }
                    }).exec();
                }, 400);
            },
            slide_change(e) {
                const current = e && e.detail ? e.detail.current : 0;
                this.setData({
                    actived_index: current || 0,
                });
            },
            item_url(item) {
                return (item && item.link && item.link.page) || '';
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style lang="scss" scoped>
.service-nav {
    width: 100%;
}
.service-title {
    min-width: 0;
    max-width: 100%;
}
.service-grid-wrap,
.service-swiper {
    width: 100%;
}
.service-grid {
    display: grid;
    width: 100%;
}
.service-grid-item {
    min-width: 0;
    box-sizing: border-box;
}
.service-icon {
    flex-shrink: 0;
}
.service-list-item {
    width: 100%;
    box-sizing: border-box;
}
.right-text {
    max-width: 7em;
    text-align: right;
}
.service-divider {
    width: auto;
    box-sizing: border-box;
}
</style>
