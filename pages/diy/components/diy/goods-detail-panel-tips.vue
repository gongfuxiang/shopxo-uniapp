<template>
    <view v-if="show_bar" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="panel" :style="card_style">
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
            propGoods: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                list: [],
                show_bar: false,
                style_container: '',
                style_img_container: '',
                card_style: '',
                text_style: '',
                line_color: 'rgba(240, 240, 240, 1)',
                line_style: 'dashed',
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
            propGoods() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const style = (this.propValue || {}).style || null;
                if (style == null) {
                    return;
                }
                const view = this.card_view(style);
                const raw = this.propGoods && this.propGoods.plugins_view_panel_data;
                const list = on_goods_detail_page() && Array.isArray(raw) ? raw.map((item) => (item == null ? '' : String(item))).filter((item) => item !== '') : [];
                this.setData({
                    list: list,
                    show_bar: list.length > 0,
                    style_container: view.style_container,
                    style_img_container: view.style_img_container,
                    card_style: view.card_style,
                    text_style: 'color:' + (style.text_color || 'rgba(153, 153, 153, 1)') + ';font-size:' + (style.text_size == null ? 12 : Number(style.text_size)) * 2 + 'rpx;',
                    line_color: style.line_color || 'rgba(240, 240, 240, 1)',
                    line_style: style.line_style || 'dashed',
                    line_size: style.line_size == null || !isFinite(Number(style.line_size)) ? 1 : Number(style.line_size),
                    line_show: style.line_is_show == null ? '1' : String(style.line_is_show),
                    item_space: style.item_space == null || !isFinite(Number(style.item_space)) ? 8 : Number(style.item_space),
                });
            },
            item_style(index) {
                const pad = 'padding:' + this.item_space * 2 + 'rpx 0;';
                if (index <= 0 || this.line_show != '1') {
                    return pad;
                }
                return pad + 'border-top:' + this.line_size + 'px ' + (this.line_style || 'dashed') + ' ' + this.line_color + ';';
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
                return {
                    style_container: common_styles_computer(common),
                    style_img_container: common_img_computer(common),
                    card_style: bg + bg_img + radius_computer(style.content_radius) + 'overflow:hidden;' + this.border_style(style, '0') + padding_computer(style.content_padding),
                };
            },
            border_style(style, fallback) {
                const size = style.card_border_size;
                const border_size = size && typeof size === 'object' ? size : { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1 };
                const show = style.card_border_is_show == null ? (style.card_border_show == null ? fallback : String(style.card_border_show)) : String(style.card_border_is_show);
                return border_computer({
                    border_is_show: show,
                    border_color: style.card_border_color || '',
                    border_style: style.card_border_style || 'solid',
                    border_size: border_size,
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
.panel {
    width: 100%;
    box-sizing: border-box;
}
.item {
    line-height: 1.5;
}
.text {
    display: block;
}
</style>
