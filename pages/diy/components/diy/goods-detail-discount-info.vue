<template>
    <view v-if="names.length" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view class="bar" :style="bar_style" @tap="open_popup">
                <scroll-view v-if="theme != '2'" scroll-x class="scroll" :show-scrollbar="false">
                    <view class="items" :style="items_style">
                        <block v-if="theme == '1'">
                            <view v-for="(name, index) in names" :key="index" class="text-item" :style="text_style">
                                <text>{{ name }}</text>
                            </view>
                        </block>
                        <block v-else>
                            <view v-for="(name, index) in names" :key="index" class="chip" :style="chip_style">
                                <text>{{ name }}</text>
                            </view>
                        </block>
                    </view>
                </scroll-view>
                <view v-else class="comma-wrap">
                    <text class="comma" :style="text_style">{{ comma_text }}</text>
                </view>
                <view v-if="show_view" class="view" :style="view_style">
                    <text v-if="view_text">{{ view_text }}</text>
                    <image v-if="view_img" class="view-img" :style="view_img_style" :src="view_img" mode="aspectFit"></image>
                    <iconfont v-else-if="view_icon" :name="view_icon" :size="arrow_size" :color="arrow_color"></iconfont>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { gradient_handle, background_computer, padding_computer, radius_computer } from '@/common/js/common/common.js';
    import { outer_style, page_vm, media_url, icon_name, call_page } from './goods-detail-common.js';
    export default {
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 0 },
        },
        computed: {
            content() { return (this.propValue && this.propValue.content) || {}; },
            style() { return (this.propValue && this.propValue.style) || {}; },
            theme() {
                const theme = String(this.content.theme == null ? '0' : this.content.theme);
                return theme === '1' || theme === '2' ? theme : '0';
            },
            names() {
                const goods = this.propGoods;
                return discount_names(page_vm(), goods);
            },
            comma_text() { return this.names.join('，'); },
            show_view() { return String(this.content.view_show) !== '0'; },
            view_text() {
                if (this.content.view_text == null) return '查看';
                return String(this.content.view_text);
            },
            view_img() { return media_url(this.content.view_img); },
            view_icon() {
                if (this.content.view_icon == null) return icon_name('arrow-right', '');
                if (this.content.view_icon === '') return '';
                return icon_name(this.content.view_icon, '');
            },
            arrow_size() { return (this.px(this.style.arrow_size, 10) * 2) + 'rpx'; },
            arrow_color() { return this.style.arrow_color || this.style.view_color || 'rgba(153, 153, 153, 1)'; },
            view_img_style() {
                const s = this.px(this.style.arrow_size, 10) * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;';
            },
            text_color() { return this.style.text_color || 'rgba(255, 77, 109, 1)'; },
            text_style() {
                return 'color:' + this.text_color + ';font-size:' + (this.px(this.style.text_size, 12) * 2) + 'rpx;';
            },
            items_style() {
                if (this.theme === '2') return '';
                return 'gap:' + (this.px(this.style.item_gap, 8) * 2) + 'rpx;';
            },
            chip_style() {
                const border = this.style.item_border || this.text_color;
                const bg = this.style.item_bg ? 'background:' + this.style.item_bg + ';' : 'background:#fff;';
                const radius = radius_computer(this.corner(this.style.item_radius, 4));
                const pad = this.style.item_padding && typeof this.style.item_padding === 'object'
                    ? padding_computer(this.style.item_padding)
                    : 'padding:6rpx 16rpx;box-sizing:border-box;';
                return bg + 'color:' + this.text_color + ';border:1px solid ' + border + ';' + this.text_style + radius + pad;
            },
            view_style() {
                const color = this.style.view_color || 'rgba(153, 153, 153, 1)';
                const bg = this.style.view_bg ? 'background:' + this.style.view_bg + ';' : '';
                const pad = this.style.view_padding && typeof this.style.view_padding === 'object' ? padding_computer(this.style.view_padding) : '';
                return 'color:' + color + ';font-size:' + (this.px(this.style.text_size, 12) * 2) + 'rpx;' + bg + pad;
            },
            bar_style() {
                const colors = this.style.content_color_list || [];
                const bg = Array.isArray(colors) && colors.some((item) => item && item.color) ? gradient_handle(colors, this.style.content_direction || '90deg') : '';
                const imgs = this.style.content_background_img || [];
                const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: this.style.content_background_img_style || '2' }) : '';
                const radius = radius_computer(this.corner(this.style.content_radius, 8));
                const pad = this.style.content_padding && typeof this.style.content_padding === 'object' ? padding_computer(this.style.content_padding) : '';
                return bg + img + radius + 'overflow:hidden;' + pad;
            },
            outer() { return outer_style(this.style); },
        },
        methods: {
            px(value, fallback) {
                if (value == null || value === '') return fallback;
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            corner(value, fallback) {
                if (value && typeof value === 'object') return value;
                const n = Number(value);
                const r = Number.isFinite(n) ? n : fallback;
                return { radius: r, radius_top_left: r, radius_top_right: r, radius_bottom_right: r, radius_bottom_left: r };
            },
            open_popup() { call_page('popup_discount_event'); },
        },
    };

    function push_name(list, name) {
        const text = name == null ? '' : String(name).trim();
        if (text) list.push(text);
    }

    function discount_names(page) {
        const names = [];
        if (!page) return names;
        const coupon = page.plugins_coupon_data;
        if (coupon && Array.isArray(coupon.data)) {
            coupon.data.forEach((item) => push_name(names, item && (item.desc || item.name)));
        }
        const cashback = page.plugins_excellentbuyreturntocash_data;
        if (cashback) {
            if (cashback.cash) push_name(names, cashback.cash.tag);
            if (Array.isArray(cashback.data)) {
                cashback.data.forEach((item) => push_name(names, item && (item.desc || item.name)));
            }
        }
        ['plugins_fullreduce_data', 'plugins_fullgive_data', 'plugins_npiecendis_data', 'plugins_newpersongift_data'].forEach((key) => {
            const block = page[key];
            if (!block || !Array.isArray(block.data)) return;
            block.data.forEach((item) => {
                const lines = item && item.rule_lines;
                if (!Array.isArray(lines)) return;
                lines.forEach((line) => push_name(names, line));
            });
        });
        return names;
    }
</script>
<style lang="scss" scoped>
.bar { width: 100%; display: flex; flex-direction: row; align-items: center; box-sizing: border-box; }
.scroll { flex: 1; width: 0; min-width: 0; white-space: nowrap; scrollbar-width: none; }
.scroll::-webkit-scrollbar,
.scroll ::-webkit-scrollbar { display: none; width: 0; height: 0; }
.items { display: inline-flex; flex-direction: row; align-items: center; flex-wrap: nowrap; }
.chip, .text-item { flex-shrink: 0; line-height: 1.4; box-sizing: border-box; }
.comma-wrap { flex: 1; min-width: 0; }
.comma { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.4; }
.view { flex-shrink: 0; display: flex; flex-direction: row; align-items: center; margin-left: 16rpx; line-height: 1.4; }
.view-img { display: block; margin-left: 4rpx; }
</style>
