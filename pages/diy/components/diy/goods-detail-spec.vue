<template>
    <view v-if="view.sku.length || view.levels.length" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view class="card" :style="card">
                <view v-if="theme == '4'" class="flat" :style="flat_level_style">
                    <view v-for="(level, level_index) in view.levels" :key="level_index" class="flat-level" :style="flat_title_style">
                        <text class="flat-label">{{ level.name }}</text>
                        <view class="flat-options" :style="flat_value_style">
                            <view v-for="(opt, index) in level.options" :key="index" class="flat-opt" :class="[opt.active ? 'active' : '', opt.img && show('img') ? 'has-img' : '']" :style="flat_opt_style(opt, level)" @tap.stop="flat_choice(level_index, index, opt)">
                                <image v-if="show('img') && opt.img" class="opt-img" :style="flat_img_style(opt)" :src="opt.img" mode="aspectFill"></image>
                                <text v-if="show('name')">{{ opt.name }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="flat-buy" :style="flat_level_style">
                        <view class="flat-row">
                            <text class="flat-label" :style="flat_name_style">数量</text>
                            <view class="flat-qty" :style="flat_qty_style">
                                <view class="stepper">
                                    <view class="step" @tap.stop="flat_number(0)">-</view>
                                    <input class="step-val" type="number" :value="buy_number" @blur="flat_number_input" />
                                    <view class="step" @tap.stop="flat_number(1)">+</view>
                                </view>
                                <text class="flat-stock" :style="flat_stock_style">库存 {{ view.stock }}{{ stock_unit }}</text>
                            </view>
                        </view>
                        <view class="flat-row">
                            <text class="flat-label" :style="flat_name_style">售价</text>
                            <view class="flat-prices" :style="flat_price_gap_style">
                                <text class="flat-sale">
                                    <text :style="flat_symbol_style">{{ view.symbol }}</text>
                                    <text :style="flat_sale_style">{{ view.price }}</text>
                                </text>
                                <text v-if="view.origin" :style="flat_market_style">{{ view.origin_symbol }}{{ view.origin }}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <scroll-view v-else scroll-x class="sku-scroll" :show-scrollbar="false" @tap="spec_tap">
                    <view class="sku-row" :class="'theme' + theme" :style="row_style">
                        <view v-for="(item, index) in sku_show" :key="index" class="sku-item" :class="[theme == '2' ? 'grid' : '', item.active ? 'active' : '']" :style="sku_item_style(item)">
                            <image v-if="show('img') && item.img" class="thumb" :style="thumb_box(item.active)" :src="item.img" mode="aspectFill"></image>
                            <view v-else-if="theme == '0' && sku_has_img" class="thumb thumb-name" :style="thumb_box(item.active) + name_style(item.active)">{{ item.name }}</view>
                            <view v-else-if="theme == '2' && sku_has_img" :style="thumb_box(false)"></view>
                            <text v-if="show('name') && theme != '0'" class="name" :class="(theme == '2' ? !sku_has_img : !item.img) ? 'solo' : ''" :style="name_style(item.active)">{{ item.name }}</text>
                            <text v-else-if="theme == '0' && !sku_has_img" class="name solo" :style="name_style(item.active)">{{ item.name }}</text>
                        </view>
                        <view v-if="show('more')" class="more" :style="more_style">
                            <text>{{ view.sku.length }}款可选</text>
                            <iconfont name="icon-arrow-right" :size="arrow_size" :color="arrow_color"></iconfont>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>
<script>
    import { field_on, goods_view, outer_style, card_style, open_spec, call_page, visible_sku } from './goods-detail-common.js';
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
                return ['0', '1', '2', '3', '4'].indexOf(theme) === -1 ? '0' : theme;
            },
            view() { return goods_view(this.propGoods); },
            outer() { return outer_style(this.style); },
            card() { return card_style(this.style); },
            sku_show() {
                return visible_sku(this.view.sku, this.theme == '2' ? 4 : 6);
            },
            sku_has_img() {
                if (!this.show('img')) return false;
                return (this.view.sku || []).some((item) => item && item.img);
            },
            sku_img_px() {
                const n = Number(this.style.sku_img_size);
                if (Number.isFinite(n) && n > 0) return n;
                if (this.theme == '4') return 28;
                if (this.theme == '1') return 40;
                if (this.theme == '2') return 48;
                return 44;
            },
            bar_img_px() {
                return Math.max(22, Math.round(this.sku_img_px * 0.64));
            },
            row_style() {
                const gap = this.px(this.style.sku_item_gap, this.theme == '2' ? 12 : 8) * 2;
                return 'gap:' + gap + 'rpx;';
            },
            arrow_size() {
                return (this.px(this.style.sku_arrow_size, 12) * 2) + 'rpx';
            },
            arrow_color() {
                return this.style.sku_arrow_color || this.style.sku_count_color || '#ff4d4f';
            },
            more_style() {
                const size = this.px(this.style.sku_count_size, 11) * 2;
                const color = this.style.sku_count_color || '#ff4d4f';
                const text = 'font-size:' + size + 'rpx;color:' + color + ';';
                if (this.theme == '3') {
                    const bg = this.style.sku_float_bg || 'rgba(245, 245, 245, 1)';
                    const box = 'background:' + bg + ';border-radius:16rpx;margin-right:0;border:1px solid transparent;box-sizing:border-box;display:flex;align-items:center;align-self:stretch;';
                    if (!this.sku_has_img) {
                        return text + box + 'height:auto;padding:8rpx 16rpx;';
                    }
                    return text + box + 'height:' + (this.sku_img_px * 2 + 20) + 'rpx;padding:0 16rpx;';
                }
                if (this.theme == '0' || this.theme == '2') {
                    const chip = this.theme == '0' ? 'padding:0 16rpx;border-radius:12rpx;background:rgba(255,255,255,0.92);' : '';
                    if (!this.sku_has_img) {
                        return text + 'height:auto;' + chip;
                    }
                    return text + 'height:' + (this.sku_img_px * 2) + 'rpx;' + chip;
                }
                return text + 'margin-left:20rpx;';
            },
            flat_level_style() {
                return 'gap:' + (this.px(this.style.flat_level_gap, 14) * 2) + 'rpx;';
            },
            flat_title_style() {
                return 'gap:' + (this.px(this.style.flat_title_gap, 8) * 2) + 'rpx;';
            },
            flat_value_style() {
                return 'gap:' + (this.px(this.style.flat_value_gap, 8) * 2) + 'rpx;';
            },
            buy_number() {
                const goods = this.propGoods || {};
                if (goods.diy_buy_number != null && goods.diy_buy_number !== '') return goods.diy_buy_number;
                return goods.buy_min_number || 1;
            },
            stock_unit() {
                const goods = this.propGoods || {};
                return goods.diy_spec_inventory_unit || goods.inventory_unit || '';
            },
            flat_name_style() {
                const size = this.px(this.style.flat_name_size, 12) * 2;
                const weight = this.style.flat_name_weight === 'bold' ? 'bold' : '400';
                return 'color:' + (this.style.flat_name_color || '#333') + ';font-size:' + size + 'rpx;font-weight:' + weight + ';';
            },
            flat_qty_style() {
                return 'gap:' + (this.px(this.style.flat_stock_gap, 8) * 2) + 'rpx;';
            },
            flat_stock_style() {
                const size = this.px(this.style.flat_stock_size, 12) * 2;
                return 'color:' + (this.style.flat_stock_color || '#999') + ';font-size:' + size + 'rpx;';
            },
            flat_price_gap_style() {
                return 'gap:' + (this.px(this.style.flat_price_gap, 8) * 2) + 'rpx;';
            },
            flat_symbol_style() {
                const size = this.px(this.style.flat_symbol_size, 14) * 2;
                return 'color:' + (this.style.flat_symbol_color || '#ff4d4f') + ';font-size:' + size + 'rpx;';
            },
            flat_sale_style() {
                const size = this.px(this.style.flat_price_size, 16) * 2;
                return 'color:' + (this.style.flat_price_color || '#ff4d4f') + ';font-size:' + size + 'rpx;font-weight:bold;';
            },
            flat_market_style() {
                const size = this.px(this.style.flat_market_size, 12) * 2;
                return 'color:' + (this.style.flat_market_color || '#999') + ';font-size:' + size + 'rpx;text-decoration:line-through;';
            },
            float_more_style() {
                const bg = this.style.sku_float_bg || 'rgba(245, 245, 245, 1)';
                return 'background:' + bg + ';padding:8rpx 16rpx;border-radius:16rpx;margin-right:0;';
            },
        },
        methods: {
            show(key) { return field_on(this.content, key); },
            px(value, fallback) {
                if (value == null || value === '') return fallback;
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            thumb_box(active) {
                const img = this.theme == '1' ? this.bar_img_px : this.sku_img_px;
                const s = img * 2;
                const radius = this.theme == '1' || this.theme == '3' ? 8 : 12;
                let border = 'box-sizing:border-box;';
                if (this.theme == '0' || this.theme == '1') {
                    border += 'border:1px solid ' + (active ? this.active_color() : 'transparent') + ';';
                } else if (this.theme == '2' && active) {
                    border += 'box-shadow:inset 0 0 0 3rpx ' + this.active_color() + ';';
                }
                return 'width:' + s + 'rpx;height:' + s + 'rpx;border-radius:' + radius + 'rpx;' + border;
            },
            flat_img_style(opt) {
                const s = this.sku_img_px * 2;
                const opacity = opt && opt.disabled ? 'opacity:0.3;' : (opt && opt.dont ? 'opacity:0.5;' : '');
                return 'width:' + s + 'rpx;height:' + s + 'rpx;border-radius:8rpx;margin-right:12rpx;' + opacity;
            },
            spec_tap() { open_spec(); },
            flat_choice(level, index, opt) {
                if (opt && (opt.disabled || opt.dont)) {
                    return;
                }
                call_page('diy_flat_spec_choice', { level: level, index: index });
            },
            flat_number(type) {
                call_page('diy_flat_number_event', { type: type });
            },
            flat_number_input(e) {
                const value = e && e.detail ? e.detail.value : '';
                call_page('diy_flat_number_input', { value: value });
            },
            active_color() {
                return this.style.sku_active_color || '#ff4d4f';
            },
            sku_item_style(item) {
                const active = item && item.active;
                const mark = active ? '--sku-on:' + this.active_color() + ';' : '';
                const has_img = !!(item && item.img);
                if (this.theme == '1') {
                    const bg = this.style.sku_bg_color || '#f5f5f5';
                    const border = active ? this.active_color() : 'transparent';
                    const box = 'background:' + bg + ';border:1px solid ' + border + ';border-radius:12rpx;margin-right:0;box-sizing:border-box;align-items:center;' + mark;
                    if (!this.sku_has_img) {
                        return box + 'padding:8rpx 16rpx;';
                    }
                    const pad = has_img ? '6rpx 16rpx 6rpx 6rpx' : '0 16rpx';
                    return box + 'padding:' + pad + ';height:' + (this.bar_img_px * 2 + 16) + 'rpx;';
                }
                if (this.theme == '2') {
                    if (!this.sku_has_img) {
                        return 'margin-right:0;' + mark;
                    }
                    const text = this.px(this.style.sku_text_size, 12);
                    const width = Math.max(this.sku_img_px, text * 4) * 2;
                    return 'width:' + width + 'rpx;margin-right:0;' + mark;
                }
                if (this.theme == '3') {
                    const bg = active ? (this.style.sku_float_active_bg || 'rgba(255, 255, 255, 1)') : (this.style.sku_float_bg || 'rgba(245, 245, 245, 1)');
                    const border = active ? this.active_color() : 'transparent';
                    const box = 'background:' + bg + ';border:1px solid ' + border + ';border-radius:16rpx;margin-right:0;box-sizing:border-box;align-items:center;';
                    if (!this.sku_has_img) {
                        return box + 'padding:8rpx 16rpx;';
                    }
                    return box + 'padding:0 16rpx;height:' + (this.sku_img_px * 2 + 20) + 'rpx;';
                }
                return 'margin-right:0;' + mark;
            },
            name_style(active) {
                const color = this.active_color();
                if (this.theme == '3') {
                    const size = this.px(active ? this.style.sku_active_size : this.style.sku_text_size, 12) * 2;
                    return 'font-size:' + size + 'rpx;color:' + (active ? color : (this.style.sku_float_text_color || '#000')) + ';';
                }
                const size = this.px(active ? this.style.sku_active_size : this.style.sku_text_size, 12) * 2;
                const text_color = active ? color : (this.style.sku_text_color || '#333');
                return 'font-size:' + size + 'rpx;color:' + text_color + ';';
            },
            flat_level_has_img(level) {
                if (!this.show('img') || !level || !Array.isArray(level.options)) return false;
                return level.options.some((opt) => opt && opt.img);
            },
            flat_opt_style(opt, level) {
                const size = this.px(this.style.sku_text_size, 12) * 2;
                const box = 'box-sizing:border-box;font-size:' + size + 'rpx;';
                let style = '';
                if (opt && opt.disabled) {
                    style = box + 'color:' + (this.style.sku_disabled_color || '#d2cfcf') + ';background:' + (this.style.sku_disabled_bg || '#fff') + ';border:1px dashed ' + (this.style.sku_disabled_border || '#d5d5d5') + ';';
                } else if (opt && opt.dont) {
                    style = box + 'color:' + (this.style.sku_dont_color || '#b4b3b3') + ';background:' + (this.style.sku_dont_bg || '#fff') + ';border:1px solid ' + (this.style.sku_dont_border || '#ebeaea') + ';';
                } else if (opt && opt.active) {
                    const color = this.active_color();
                    const active_size = this.px(this.style.sku_active_size, 12) * 2;
                    style = 'box-sizing:border-box;font-size:' + active_size + 'rpx;--sku-on:' + color + ';color:' + color + ';background:#fff;border:1px solid ' + color + ';';
                } else {
                    style = box + 'color:' + (this.style.sku_text_color || '#333') + ';background:' + (this.style.sku_bg_color || '#f5f5f5') + ';border:1px solid ' + (this.style.sku_border_color || 'transparent') + ';';
                }
                if (this.flat_level_has_img(level)) {
                    style += 'height:' + (this.sku_img_px * 2 + 16) + 'rpx;';
                    if (!(opt && opt.img)) {
                        style += 'padding:0 20rpx;';
                    }
                }
                return style;
            },
        },
    };
</script>
<style lang="scss" scoped>
.card { width: 100%; }
.sku-scroll { width: 100%; white-space: nowrap; }
.sku-row { display: flex; flex-direction: row; align-items: center; }
.sku-row.theme3 { align-items: stretch; }
.sku-row.theme3 .more { align-self: stretch; height: auto; display: flex; align-items: center; }
.sku-item { display: inline-flex; flex-direction: row; align-items: center; flex-shrink: 0; }
.sku-row.theme2 { align-items: flex-start; }
.sku-row.theme2 .sku-item { flex-direction: column; }
.sku-row.theme1 .name { margin-left: 12rpx; }
.sku-row.theme3 .name { margin-left: 12rpx; }
.thumb { width: 88rpx; height: 88rpx; border-radius: 12rpx; background: #f5f5f5; box-sizing: border-box; }
.thumb-name { display: flex; align-items: center; justify-content: center; overflow: hidden; text-align: center; line-height: 1.2; background: #fff; }
.name { margin-left: 8rpx; font-size: 24rpx; color: #333; max-width: 160rpx; overflow: hidden; }
.name.solo { margin-left: 0; }
.grid .name, .sku-row.theme2 .name { margin-left: 0; margin-top: 12rpx; width: 100%; max-width: none; text-align: center; }
.grid .name.solo, .sku-row.theme2 .name.solo { margin-top: 0; }
.sku-row.theme1 .name.solo, .sku-row.theme3 .name.solo { margin-left: 0; }
.more { display: inline-flex; align-items: center; font-size: 24rpx; color: #999; flex-shrink: 0; }
.flat { display: flex; flex-direction: column; }
.flat-level { display: flex; flex-direction: column; }
.flat-label { display: block; font-size: 26rpx; color: #333; }
.flat-options { display: flex; flex-direction: row; flex-wrap: wrap; }
.flat-opt { display: flex; flex-direction: row; align-items: center; padding: 8rpx 20rpx; background: #f6f6f6; border-radius: 12rpx; font-size: 24rpx; border: 1px solid transparent; box-sizing: border-box; }
.flat-opt.has-img { padding: 6rpx 20rpx 6rpx 6rpx; }
.opt-img { width: 56rpx; height: 56rpx; border-radius: 8rpx; margin-right: 12rpx; flex-shrink: 0; }
.flat-buy { display: flex; flex-direction: column; gap: 20rpx; }
.flat-row { display: flex; flex-direction: row; align-items: center; }
.flat-row .flat-label { width: 2.5em; flex-shrink: 0; }
.flat-qty, .flat-prices, .flat-sale { display: flex; flex-direction: row; align-items: center; }
.flat-sale { align-items: baseline; }
.flat-stock { flex-shrink: 0; }
.stepper { display: flex; flex-direction: row; align-items: center; border: 1px solid #e5e5e5; border-radius: 8rpx; overflow: hidden; }
.step, .step-val { width: 56rpx; height: 52rpx; line-height: 52rpx; text-align: center; font-size: 26rpx; color: #333; }
.step-val { width: 112rpx; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; }
</style>
