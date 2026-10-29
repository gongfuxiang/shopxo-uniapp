<template>
    <view v-if="tiers.length" class="oh" :style="outer_style">
        <view :style="outer_img">
            <view class="card" :style="card_style" @tap="open_popup">
                <view class="main">
                    <scroll-view scroll-x class="tiers" :show-scrollbar="false">
                        <view class="tier-track">
                        <view v-for="(tier, index) in tiers" :key="index" class="tier">
                            <view class="value" :style="value_style">
                                <text v-if="tier.kind == 'price'" class="symbol" :style="symbol_style">{{ symbol }}</text>
                                <text class="num">{{ tier.value }}</text>
                                <text v-if="tier.kind == 'discount'" class="unit" :style="unit_style">{{ tier.unit }}</text>
                            </view>
                            <text class="desc" :style="desc_style">{{ tier.desc }}</text>
                        </view>
                        </view>
                    </scroll-view>
                    <view v-if="more_show" class="more">
                        <text v-if="more_text" class="more-text" :style="more_text_style">{{ more_text }}</text>
                        <image v-if="more_img" class="more-img" :style="more_img_style" :src="more_img" mode="aspectFit"></image>
                        <iconfont v-else-if="more_icon" :name="more_icon" :size="more_icon_size" :color="more_icon_color"></iconfont>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer } from '@/common/js/common/common.js';
    import { page_vm, media_url, icon_name, call_page } from './goods-detail-common.js';
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
            symbol() {
                const goods = this.propGoods || {};
                const page = page_vm();
                return goods.show_price_symbol || (page && page.currency_symbol) || '¥';
            },
            tiers() {
                const goods = this.propGoods;
                const page = page_vm();
                const data = page && page.plugins_wholesale_data;
                if (!data || String(data.is_hide_goods_price) === '1' || !Array.isArray(data.rules)) return [];
                return data.rules.map((item) => {
                    const arr = (item && item.arr) || {};
                    const price = String(arr.type) === '1';
                    return {
                        kind: price ? 'price' : 'discount',
                        value: item.range_val == null ? '' : String(item.range_val),
                        unit: arr.unit || '折',
                        desc: item.range_msg || '',
                    };
                }).filter((item) => item.value || item.desc);
            },
            more_show() { return this.content.more_show !== false && String(this.content.more_show) !== '0'; },
            more_text() {
                if (this.content.more_text == null) return '更多';
                return String(this.content.more_text);
            },
            more_img() { return media_url(this.content.more_img); },
            more_icon() {
                let name = this.content.more_icon == null || this.content.more_icon === '' || this.content.more_icon === 'arrow-right' ? 'category-more' : String(this.content.more_icon);
                return icon_name(name, '');
            },
            more_icon_size() { return (px(this.style.more_icon_size, 12) * 2) + 'rpx'; },
            more_icon_color() { return this.style.more_icon_color || '#999'; },
            more_img_style() {
                const s = px(this.style.more_icon_size, 12) * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;';
            },
            more_text_style() {
                return 'color:' + (this.style.more_color || '#999') + ';font-size:' + (px(this.style.more_size, 12) * 2) + 'rpx;';
            },
            value_style() {
                const color = this.style.accent_color || '#ff4d4f';
                return 'color:' + color + ';font-size:' + (px(this.style.value_size, 22) * 2) + 'rpx;';
            },
            symbol_style() {
                return 'color:' + (this.style.symbol_color || this.style.accent_color || '#ff4d4f') + ';font-size:' + (px(this.style.symbol_size, 13) * 2) + 'rpx;';
            },
            unit_style() {
                return 'color:' + (this.style.unit_color || '#999') + ';font-size:' + (px(this.style.unit_size, 12) * 2) + 'rpx;';
            },
            desc_style() {
                return 'color:' + (this.style.desc_color || '#999') + ';font-size:' + (px(this.style.desc_size, 12) * 2) + 'rpx;';
            },
            outer_style() { return common_styles_computer(this.style.common_style || {}); },
            outer_img() { return common_img_computer(this.style.common_style || {}, this.propIndex); },
            card_style() {
                const colors = this.style.content_color_list || [];
                const has = Array.isArray(colors) && colors.some((item) => item && item.color);
                const bg = has ? gradient_handle(colors, this.style.content_direction || '90deg') : 'background:#fff;';
                const imgs = this.style.content_background_img || [];
                const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: this.style.content_background_img_style || '2' }) : '';
                const pad = this.style.content_padding && typeof this.style.content_padding === 'object' ? padding_computer(this.style.content_padding) : 'padding:28rpx 16rpx;box-sizing:border-box;';
                return bg + img + radius_computer(corner(this.style.content_radius, 0)) + 'overflow:hidden;' + pad;
            },
        },
        methods: {
            open_popup() { call_page('diy_wholesale_popup_event'); },
        },
    };
    function px(value, fallback) {
        if (value == null || value === '') return fallback;
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }
    function corner(value, fallback) {
        if (value && typeof value === 'object' && value.radius_top_left != null) return value;
        const n = Number(value);
        const r = Number.isFinite(n) ? n : fallback;
        return { radius: r, radius_top_left: r, radius_top_right: r, radius_bottom_right: r, radius_bottom_left: r };
    }
</script>
<style lang="scss" scoped>
.card { width: 100%; box-sizing: border-box; }
.main { display: flex; flex-direction: row; align-items: center; width: 100%; min-width: 0; gap: 16rpx; }
.tiers { flex: 1; width: 0; min-width: 0; white-space: nowrap; scrollbar-width: none; }
.tiers::-webkit-scrollbar,
.tiers ::-webkit-scrollbar { display: none; width: 0; height: 0; }
.tier-track { display: inline-flex; flex-direction: row; align-items: flex-start; min-width: 100%; }
.tier { flex: 1 0 auto; display: flex; flex-direction: column; align-items: center; padding: 0 8rpx; box-sizing: border-box; }
.value { font-weight: 700; line-height: 1.15; white-space: nowrap; }
.unit { font-weight: 400; }
.desc { margin-top: 12rpx; line-height: 1.2; text-align: center; }
.more { width: 1.2em; align-self: stretch; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4rpx; flex-shrink: 0; }
.more-text { width: 1em; line-height: 1.15; text-align: center; word-break: break-all; }
.more-img { display: block; }
</style>
