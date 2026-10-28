<template>
    <view v-if="show_bar" class="oh" :style="outer_style">
        <view :style="outer_img">
            <view class="shop" :style="card_style" :data-value="view.url" @tap="open_url">
                <image v-if="show('logo') && view.logo" class="logo" :style="logo_style" :src="view.logo" mode="aspectFill"></image>
                <view v-if="show_main" class="main">
                    <view v-if="show('name') || show('badge')" class="name-row">
                        <view v-if="show('badge') && view.badges.length" class="badges" :style="badge_group_style">
                            <image v-for="(src, index) in view.badges" :key="index" class="badge" :style="badge_style" :src="src" mode="aspectFit"></image>
                        </view>
                        <text v-if="show('name')" class="name" :style="name_style">{{ view.name }}</text>
                    </view>
                    <text v-if="show('desc') && view.desc" class="desc" :class="desc_row == '1' ? 'line-1' : 'line-2'" :style="desc_style">{{ view.desc }}</text>
                </view>
                <iconfont v-if="show('arrow')" name="icon-arrow-right" :size="arrow_size" :color="arrow_color"></iconfont>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer } from '@/common/js/common/common.js';
    import { page_vm } from './goods-detail-common.js';
    const fields = ['logo', 'badge', 'name', 'desc', 'arrow'];
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
            field_show() { return field_list(this.content.field_show, fields); },
            desc_row() { return String(this.content.desc_row) === '1' ? '1' : '2'; },
            view() {
                const goods = this.propGoods;
                const page = page_vm();
                const shop = page && page.plugins_shop_data;
                if (!shop || typeof shop !== 'object') return { name: '', desc: '', logo: '', url: '', badges: [] };
                const icons = Array.isArray(shop.icon_list) ? shop.icon_list.map((item) => item && item.icon).filter(Boolean) : [];
                return {
                    name: shop.name || '',
                    desc: shop.describe || '',
                    logo: shop.logo || '',
                    url: shop.url || '',
                    badges: icons,
                };
            },
            show_main() { return this.show('name') || this.show('badge') || this.show('desc'); },
            show_bar() {
                const view = this.view;
                const has = !!(view.name || view.logo || view.desc || view.badges.length);
                return has && (this.show_main || this.show('logo') || this.show('arrow'));
            },
            outer_style() { return common_styles_computer(this.style.common_style || {}); },
            outer_img() { return common_img_computer(this.style.common_style || {}, this.propIndex); },
            card_style() { return block_style(this.style, 8, 'content_padding', 'content_color_list', 'content_direction', 'content_background_img', 'content_background_img_style', 'content_radius'); },
            logo_style() {
                const size = px(this.style.logo_size, 48) * 2;
                const radius = px(this.style.logo_radius, 4) * 2;
                return 'width:' + size + 'rpx;height:' + size + 'rpx;border-radius:' + radius + 'rpx;';
            },
            badge_style() {
                const size = px(this.style.badge_size, 16) * 2;
                return 'width:' + size + 'rpx;height:' + size + 'rpx;';
            },
            badge_group_style() {
                const gap = px(this.style.badge_gap, 4) * 2;
                const right = this.show('name') ? 'margin-right:' + (px(this.style.badge_name_gap, 4) * 2) + 'rpx;' : '';
                return 'gap:' + gap + 'rpx;' + right;
            },
            name_style() {
                return 'color:' + (this.style.name_color || 'rgba(51,51,51,1)') + ';font-size:' + (px(this.style.name_size, 14) * 2) + 'rpx;font-weight:' + (this.style.name_typeface || 'bold') + ';';
            },
            desc_style() {
                return 'color:' + (this.style.desc_color || 'rgba(153,153,153,1)') + ';font-size:' + (px(this.style.desc_size, 12) * 2) + 'rpx;';
            },
            arrow_size() { return (px(this.style.arrow_size, 14) * 2) + 'rpx'; },
            arrow_color() { return this.style.arrow_color || 'rgba(204,204,204,1)'; },
        },
        methods: {
            show(key) { return this.field_show.indexOf(key) !== -1; },
            open_url(e) {
                if (!e.currentTarget.dataset.value) return;
                app.globalData.url_event(e);
            },
        },
    };

    function px(value, fallback) {
        if (value == null || value === '') return fallback;
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }
    function field_list(list, allow) {
        if (!Array.isArray(list)) return allow.slice();
        const filtered = list.map(String).filter((key) => allow.indexOf(key) !== -1);
        return list.length > 0 && filtered.length === 0 ? allow.slice() : filtered;
    }
    function corner(value, fallback) {
        if (value && typeof value === 'object' && value.radius_top_left != null) return value;
        const n = Number(value);
        const r = Number.isFinite(n) ? n : fallback;
        return { radius: r, radius_top_left: r, radius_top_right: r, radius_bottom_right: r, radius_bottom_left: r };
    }
    function block_style(style, radius_fallback, pad_key, color_key, dir_key, img_key, img_style_key, radius_key) {
        style = style || {};
        const colors = style[color_key] || [];
        const bg = Array.isArray(colors) && colors.some((item) => item && item.color) ? gradient_handle(colors, style[dir_key] || '90deg') : '';
        const imgs = style[img_key] || [];
        const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: style[img_style_key] || '2' }) : '';
        const pad = style[pad_key] && typeof style[pad_key] === 'object' ? padding_computer(style[pad_key]) : '';
        return bg + img + radius_computer(corner(style[radius_key], radius_fallback)) + 'overflow:hidden;' + pad;
    }
</script>
<style lang="scss" scoped>
.shop { width: 100%; box-sizing: border-box; display: flex; flex-direction: row; align-items: center; gap: 20rpx; }
.logo, .badge { display: block; overflow: hidden; flex-shrink: 0; }
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8rpx; }
.name-row, .badges { display: flex; flex-direction: row; align-items: center; min-width: 0; }
.name { flex: 1; min-width: 0; line-height: 1.3; }
.desc { line-height: 1.4; }
.line-1, .name { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.line-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
