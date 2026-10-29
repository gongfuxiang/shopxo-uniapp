<template>
    <view v-if="nav_list.length > 0" :style="style_container">
        <view :style="style_img_container">
            <view class="line-nav pr" :style="card_style">
                <view v-if="card_bg_img_style" class="line-nav-bg-img" :style="card_bg_img_style"></view>
                <view class="line-nav-inner flex-col" :style="rows_gap_style">
                    <block v-for="(row, r_index) in row_list" :key="r_index">
                        <view v-if="r_index > 0 && show_divider_h" class="divider-h-wrap" :style="divider_h_wrap_style">
                            <view class="divider-h" :style="divider_h_style"></view>
                        </view>
                        <view class="line-nav-row flex-row">
                            <block v-for="(item, index) in row" :key="index">
                                <view v-if="index > 0 && show_divider_v" class="divider-v-wrap" :style="divider_v_wrap_style">
                                    <view class="divider-v" :style="divider_v_style"></view>
                                </view>
                                <view class="nav-item flex-1 flex-row align-c jc-c" :class="layout == 'top' ? 'is-top' : ''" :style="item_box_style" :data-value="item_url(item)" @tap="url_event">
                                    <view v-if="has_icon(item)" class="nav-icon flex-row align-c jc-c" :style="icon_box_style">
                                        <image-empty v-if="item.img && item.img.length > 0" :propImageSrc="item.img[0]" propImgFit="aspectFit" :propStyle="icon_img_style" :propErrorStyle="icon_img_style"></image-empty>
                                        <iconfont v-else-if="item.icon" :name="'icon-' + item.icon" :size="icon_size * 2 + 'rpx'" :color="icon_color" propContainerDisplay="flex"></iconfont>
                                    </view>
                                    <view v-if="item.title" class="text-line-1" :style="item_style">{{ item.title }}</view>
                                </view>
                            </block>
                        </view>
                    </block>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, padding_computer, radius_computer, background_computer } from '@/common/js/common/common.js';
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
                nav_list: [],
                row_list: [],
                layout: 'left',
                show_divider_v: false,
                show_divider_h: false,
                icon_size: 18,
                icon_color: 'rgba(51, 51, 51, 1)',
                style_container: '',
                style_img_container: '',
                card_style: '',
                card_bg_img_style: '',
                item_style: '',
                item_box_style: '',
                icon_box_style: '',
                icon_img_style: '',
                divider_v_style: '',
                divider_v_wrap_style: '',
                divider_h_style: '',
                divider_h_wrap_style: '',
                rows_gap_style: '',
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
            init() {
                const content = this.propValue.content || {};
                const style = this.propValue.style || {};
                const list = Array.isArray(content.nav_list) ? content.nav_list : [];
                const column = Math.max(this.num(content.column, 2), 1);
                const rows = [];
                for (let i = 0; i < list.length; i += column) {
                    rows.push(list.slice(i, i + column));
                }
                const v_show = content.divider_v_show != null ? content.divider_v_show : content.divider_show != null ? content.divider_show : '1';
                const h_show = content.divider_h_show != null ? content.divider_h_show : '1';
                const icon_size = this.num(style.icon_size, 18);
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const pad = style.content_padding && typeof style.content_padding == 'object' ? style.content_padding : { padding_top: 12, padding_right: 12, padding_bottom: 12, padding_left: 12 };
                const item_pad = style.item_padding && typeof style.item_padding == 'object' ? style.item_padding : { padding_top: 0, padding_right: 8, padding_bottom: 0, padding_left: 8 };
                const gap = this.num(style.icon_text_gap != null ? style.icon_text_gap : style.item_gap, 8);
                const v_w = this.num(style.divider_v_width != null ? style.divider_v_width : style.divider_width, 1);
                const h_h = this.num(style.divider_h_height, 1);
                const v_margin = style.divider_v_margin && typeof style.divider_v_margin == 'object' ? style.divider_v_margin : style.divider_margin && typeof style.divider_margin == 'object' ? style.divider_margin : { margin_top: 4, margin_bottom: 4 };
                const h_margin = style.divider_h_margin && typeof style.divider_h_margin == 'object' ? style.divider_h_margin : { margin_left: 12, margin_right: 12, margin_top: 0, margin_bottom: 0 };
                const show_h = String(h_show) == '1' && h_h > 0;
                const row_gap = (this.num(item_pad.padding_top, 0) + this.num(item_pad.padding_bottom, 0)) / 2;
                const common_style = style.common_style && typeof style.common_style == 'object' ? Object.assign({}, style.common_style) : {};
                if (!Array.isArray(common_style.background_img)) {
                    common_style.background_img = [];
                }
                const bg_img = background_computer({
                    background_img: Array.isArray(style.content_background_img) ? style.content_background_img : [],
                    background_img_style: style.content_background_img_style || '4',
                });
                this.setData({
                    nav_list: list,
                    row_list: rows,
                    layout: content.layout == 'top' ? 'top' : 'left',
                    show_divider_v: String(v_show) == '1' && v_w > 0,
                    show_divider_h: show_h,
                    icon_size: icon_size,
                    icon_color: style.icon_color || 'rgba(51, 51, 51, 1)',
                    style_container: common_styles_computer(common_style),
                    style_img_container: common_img_computer(common_style, this.propIndex),
                    card_style: bg + this.radius_style(style.content_radius, 12) + 'overflow:hidden;' + padding_computer(pad),
                    card_bg_img_style: bg_img ? bg_img + 'border-radius:inherit;' : '',
                    item_style: 'color:' + (style.item_color || '#333') + ';font-size:' + this.num(style.item_size, 13) * 2 + 'rpx;font-weight:' + (style.item_weight || '400') + ';',
                    item_box_style: 'gap:' + gap * 2 + 'rpx;' + padding_computer(item_pad),
                    icon_box_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    icon_img_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    divider_v_wrap_style: 'padding-top:' + this.num(v_margin.margin_top, 0) * 2 + 'rpx;padding-bottom:' + this.num(v_margin.margin_bottom, 0) * 2 + 'rpx;',
                    divider_v_style: 'width:' + v_w * 2 + 'rpx;flex:1;min-height:2rpx;background:' + (style.divider_v_color || style.divider_color || 'rgba(238, 238, 238, 1)') + ';',
                    divider_h_wrap_style: 'padding-left:' + this.num(h_margin.margin_left, 0) * 2 + 'rpx;padding-right:' + this.num(h_margin.margin_right, 0) * 2 + 'rpx;padding-top:' + this.num(h_margin.margin_top, 0) * 2 + 'rpx;padding-bottom:' + this.num(h_margin.margin_bottom, 0) * 2 + 'rpx;',
                    divider_h_style: 'height:' + h_h * 2 + 'rpx;flex:1;min-width:2rpx;background:' + (style.divider_h_color || style.divider_color || 'rgba(238, 238, 238, 1)') + ';',
                    rows_gap_style: show_h ? 'gap:0;' : 'gap:' + row_gap * 2 + 'rpx;',
                });
            },
            has_icon(item) {
                return !!((item && item.img && item.img.length > 0) || (item && item.icon));
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
.line-nav {
    width: 100%;
    position: relative;
}
.line-nav-bg-img {
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
}
.line-nav-inner {
    width: 100%;
    min-height: 72rpx;
    position: relative;
    z-index: 1;
}
.line-nav-row {
    width: 100%;
    min-width: 0;
    min-height: 72rpx;
    align-items: stretch;
}
.nav-item {
    min-width: 0;
    box-sizing: border-box;
}
.nav-item.is-top {
    flex-direction: column;
}
.nav-icon {
    flex-shrink: 0;
}
.divider-v-wrap {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    box-sizing: border-box;
}
.divider-h-wrap {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
}
.divider-v,
.divider-h {
    box-sizing: border-box;
    border-radius: 999px;
}
</style>
