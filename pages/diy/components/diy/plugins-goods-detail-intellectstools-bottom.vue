<template>
    <view v-if="show_bar" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="box" :style="card_style">
                <text v-if="show_title" class="title" :style="title_style">{{ title }}</text>
                <view v-for="(item, index) in list" :key="index" class="item" :style="item_style(index)">
                    <text class="text" :style="text_style">{{ item }}</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, border_computer } from '@/common/js/common/common.js';
    import { on_goods_detail_page } from './goods-detail-common.js';
    const field_allow = ['title', 'text'];
    export default {
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
            propIntellectstools: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                field_show: field_allow.slice(),
                title: '',
                list: [],
                show_bar: false,
                show_title: false,
                show_text: true,
                style_container: '',
                style_img_container: '',
                card_style: '',
                text_style: '',
                title_style: '',
                line_color: 'rgba(200, 228, 251, 1)',
                line_style: 'solid',
                line_size: 1,
                line_show: '1',
                item_space: 8,
            };
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
            propIntellectstools() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const content = (this.propValue || {}).content || {};
                const style = (this.propValue || {}).style || null;
                if (style == null) {
                    return;
                }
                const field_show = this.normalize_field_show(content.field_show);
                const data = this.propIntellectstools && this.propIntellectstools.content_top ? this.propIntellectstools.content_top : null;
                const title = data && data.title != null ? String(data.title) : '';
                const list = this.lines(data && data.msg);
                const show_title = field_show.indexOf('title') !== -1 && title !== '';
                const show_text = field_show.indexOf('text') !== -1 && list.length > 0;
                const on_page = on_goods_detail_page();
                const view = this.card_view(style);
                const space = style.item_space == null || !isFinite(Number(style.item_space)) ? 8 : Number(style.item_space);
                const line_color = style.line_color || 'rgba(200, 228, 251, 1)';
                const line_style = style.line_style || 'solid';
                const line_size = style.line_size == null || !isFinite(Number(style.line_size)) ? 1 : Number(style.line_size);
                const line_show = style.line_is_show == null ? '1' : String(style.line_is_show);
                let title_style = 'color:' + (style.title_color || 'rgba(43, 110, 143, 1)') + ';font-size:' + (style.title_size == null ? 14 : Number(style.title_size)) * 2 + 'rpx;font-weight:' + (style.title_bold === '0' ? '400' : '700') + ';';
                title_style += 'padding-bottom:' + space * 2 + 'rpx;';
                if (show_text && line_show == '1') {
                    title_style += 'border-bottom:' + line_size + 'px ' + line_style + ' ' + line_color + ';';
                }
                this.setData({
                    field_show: field_show,
                    title: title,
                    list: show_text ? list : [],
                    show_title: show_title,
                    show_text: show_text,
                    show_bar: on_page && list.length > 0 && (show_text || show_title),
                    style_container: view.style_container,
                    style_img_container: view.style_img_container,
                    card_style: view.card_style,
                    text_style: 'color:' + (style.text_color || 'rgba(43, 110, 143, 1)') + ';font-size:' + (style.text_size == null ? 12 : Number(style.text_size)) * 2 + 'rpx;',
                    title_style: title_style,
                    line_color: line_color,
                    line_style: line_style,
                    line_size: line_size,
                    line_show: line_show,
                    item_space: space,
                });
            },
            lines(msg) {
                if (Array.isArray(msg)) {
                    return msg.map((item) => (item == null ? '' : String(item))).filter((item) => item !== '');
                }
                if (msg == null || msg === '') {
                    return [];
                }
                return String(msg)
                    .split('\n')
                    .filter((item) => item !== '');
            },
            item_style(index) {
                const pad = 'padding:' + this.item_space * 2 + 'rpx 0;';
                if (!this.show_text || this.line_show != '1' || index >= this.list.length - 1) {
                    return pad;
                }
                return pad + 'border-bottom:' + this.line_size + 'px ' + (this.line_style || 'solid') + ' ' + this.line_color + ';';
            },
            normalize_field_show(field_show) {
                if (!Array.isArray(field_show)) {
                    return field_allow.slice();
                }
                const filtered = field_show.map(String).filter((key) => field_allow.indexOf(key) !== -1);
                return field_show.length > 0 && filtered.length === 0 ? field_allow.slice() : filtered;
            },
            card_view(style) {
                const common = Object.assign({}, style.common_style || {});
                if (!Array.isArray(common.background_img)) {
                    common.background_img = [];
                }
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const bg_img = background_computer({
                    background_img: style.content_background_img || [],
                    background_img_style: style.content_background_img_style || '2',
                });
                const size = style.card_border_size;
                const border_size = size && typeof size === 'object' ? size : { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1 };
                const show = style.card_border_is_show == null ? (style.card_border_show == null ? '1' : String(style.card_border_show)) : String(style.card_border_is_show);
                const border = border_computer({
                    border_is_show: show,
                    border_color: style.card_border_color || '',
                    border_style: style.card_border_style || 'solid',
                    border_size: border_size,
                });
                return {
                    style_container: common_styles_computer(common),
                    style_img_container: common_img_computer(common),
                    card_style: bg + bg_img + radius_computer(style.content_radius) + 'overflow:hidden;' + border + padding_computer(style.content_padding),
                };
            },
        },
    };
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    box-sizing: border-box;
}
.title {
    display: block;
    line-height: 1.4;
}
.item {
    line-height: 1.5;
}
.text {
    display: block;
}
</style>
