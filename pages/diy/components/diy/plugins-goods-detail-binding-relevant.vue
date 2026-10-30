<template>
    <view v-if="goods.length" class="oh" :style="outer_style">
        <view :style="outer_img">
            <view class="wrap" :style="wrap_style">
                <view v-if="show_header" class="header" :style="header_style">
                    <view v-if="title_bar_show == '1' && title_bar_type == 'line'" class="title-bar" :style="title_bar_style"></view>
                    <image v-else-if="title_bar_show == '1' && title_bar_img" class="title-bar-img" :style="title_bar_img_style" :src="title_bar_img" mode="heightFix"></image>
                    <view v-else-if="title_bar_show == '1' && title_bar_icon" class="title-mark">
                        <iconfont :name="title_bar_icon" :size="title_bar_icon_size" :color="title_bar_icon_color"></iconfont>
                    </view>
                    <text v-if="title_show == '1' && title_text" class="title" :style="title_style">{{ title_text }}</text>
                </view>
                <view class="card" :style="card_style">
                    <scroll-view
                        scroll-x
                        class="goods-scroll"
                        :show-scrollbar="false"
                        :scroll-left="scroll_left"
                        :scroll-with-animation="scroll_anim"
                        @scroll="on_goods_scroll"
                    >
                        <view class="goods-row" :style="list_gap_style">
                            <view
                                v-for="(g, index) in goods"
                                :key="index"
                                class="goods-item"
                                :style="goods_item_style"
                                :data-value="g.goods_url || ('/pages/goods-detail/goods-detail?id=' + (g.id || ''))"
                                @tap="url_event"
                            >
                                <image class="goods-img" :style="goods_img_style" :src="g.images" mode="aspectFill"></image>
                                <text v-if="show('goods_title')" class="goods-name" :style="goods_title_style">{{ g.title }}</text>
                                <text class="goods-price" :style="goods_price_style">{{ currency }}{{ g.price }}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer } from '@/common/js/common/common.js';
    import { page_vm, media_url, icon_name } from './goods-detail-common.js';
    const fields = ['goods_title'];
    export default {
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
            propBinding: { type: Object, default: null },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 0 },
        },
        data() {
            return {
                scroll_left: 0,
                scroll_anim: true,
                _scroll_timer: null,
                _scroll_pos: 0,
                _scroll_max: 0,
            };
        },
        computed: {
            content() { return (this.propValue && this.propValue.content) || {}; },
            style() { return (this.propValue && this.propValue.style) || {}; },
            field_show() { return field_list(this.content.field_show, fields); },
            is_roll() { return String(this.content.is_roll || '0') === '1'; },
            interval_ms() { return Math.max(1, px(this.content.interval_time, 3)) * 1000; },
            scroll_duration() { return Math.max(100, px(this.content.scroll_duration, 400)); },
            binding_data() {
                if (this.propBinding && typeof this.propBinding === 'object') return this.propBinding;
                const page = page_vm();
                return (page && page.plugins_binding_data) || null;
            },
            relevant() {
                const data = this.binding_data;
                return (data && data.relevant_data) || null;
            },
            goods() {
                const relevant = this.relevant;
                return relevant && Array.isArray(relevant.data) ? relevant.data : [];
            },
            currency() {
                const page = page_vm();
                return (page && page.currency_symbol) || app.globalData.currency_symbol();
            },
            title_text() {
                if (this.content.title_text != null && String(this.content.title_text) !== '') return String(this.content.title_text);
                const relevant = this.relevant;
                return (relevant && relevant.name) || '组合关联';
            },
            title_show() { return String(this.content.title_show == null ? '1' : this.content.title_show) === '0' ? '0' : '1'; },
            title_bar_show() { return String(this.content.title_bar_show == null ? '1' : this.content.title_bar_show) === '0' ? '0' : '1'; },
            show_header() { return this.title_show === '1' || this.title_bar_show === '1'; },
            title_bar_type() { return this.content.title_bar_type === 'img-icon' ? 'img-icon' : 'line'; },
            title_bar_img() { return media_url(this.content.title_bar_img); },
            title_bar_icon() {
                const name = this.content.title_bar_icon;
                return name == null || name === '' ? '' : icon_name(name, '');
            },
            title_bar_icon_size() { return (px(this.style.title_bar_size, 14) * 2) + 'rpx'; },
            title_bar_icon_color() { return this.style.title_bar_icon_color || this.style.title_bar_color || 'rgba(255,77,99,1)'; },
            title_bar_img_style() { return 'height:' + (px(this.style.title_bar_size, 14) * 2) + 'rpx;width:auto;max-width:100%;'; },
            title_bar_style() {
                const bar = px(this.style.title_bar_size, 14);
                const title = px(this.style.title_size, 15);
                const h = Math.max(bar, Math.round(title * 0.95)) * 2;
                const c1 = this.style.title_bar_color || 'rgba(255,77,99,1)';
                const c2 = this.style.title_bar_color_end || '';
                return 'width:6rpx;height:' + h + 'rpx;background:' + (c2 ? 'linear-gradient(180deg,' + c1 + ',' + c2 + ')' : c1) + ';margin-right:12rpx;';
            },
            title_style() {
                return 'font-size:' + (px(this.style.title_size, 15) * 2) + 'rpx;color:' + (this.style.title_color || '#333') + ';font-weight:' + (this.style.title_weight || 'bold') + ';';
            },
            wrap_style() { return this.show_header ? 'gap:' + (px(this.style.header_gap, 8) * 2) + 'rpx;' : ''; },
            header_style() {
                const align = String(this.content.header_align || 'left');
                const justify = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
                const bg = this.style.header_bg ? 'background:' + this.style.header_bg + ';' : '';
                const pad = this.style.header_padding ? padding_computer(this.style.header_padding) : '';
                return 'justify-content:' + justify + ';' + bg + pad;
            },
            outer_style() { return common_styles_computer(this.style.common_style || {}); },
            outer_img() { return common_img_computer(this.style.common_style || {}, this.propIndex); },
            card_style() {
                return block_style(this.style, 8, 'content_padding', 'content_color_list', 'content_direction', 'content_background_img', 'content_background_img_style', 'content_radius');
            },
            list_gap_style() { return 'gap:' + (px(this.style.gap, 10) * 2) + 'rpx;'; },
            goods_img_style() {
                const s = px(this.style.goods_img_size, 90) * 2;
                const r = px(this.style.goods_img_radius, 6) * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;border-radius:' + r + 'rpx;';
            },
            goods_item_style() { return 'width:' + (px(this.style.goods_img_size, 90) * 2) + 'rpx;'; },
            goods_title_style() {
                return 'color:' + (this.style.goods_title_color || '#333') + ';font-size:' + (px(this.style.goods_title_size, 12) * 2) + 'rpx;line-height:1.4;';
            },
            goods_price_style() {
                return 'color:' + (this.style.goods_price_color || 'rgba(255,77,99,1)') + ';font-size:' + (px(this.style.goods_price_size, 13) * 2) + 'rpx;font-weight:600;line-height:1.4;';
            },
            goods_step_px() {
                const w = px(this.style.goods_img_size, 90);
                const gap = px(this.style.gap, 10);
                const rpx = (w + gap) * 2;
                return typeof uni !== 'undefined' && uni.upx2px ? uni.upx2px(rpx) : (w + gap);
            },
        },
        watch: {
            is_roll() { this.restart_auto_scroll(); },
            interval_ms() { this.restart_auto_scroll(); },
            goods() { this.restart_auto_scroll(); },
        },
        mounted() { this.restart_auto_scroll(); },
        beforeDestroy() { this.stop_auto_scroll(); },
        // #ifdef VUE3
        beforeUnmount() { this.stop_auto_scroll(); },
        // #endif
        methods: {
            show(key) { return this.field_show.indexOf(key) !== -1; },
            url_event(e) { app.globalData.url_event(e); },
            on_goods_scroll(e) {
                const left = e && e.detail ? Number(e.detail.scrollLeft) : 0;
                if (Number.isFinite(left)) this._scroll_pos = left;
                const w = e && e.detail ? Number(e.detail.scrollWidth) : 0;
                // scrollWidth - viewport 近似：无 viewport 时用已缓存 max
                if (Number.isFinite(w) && w > 0) {
                    // 部分端 detail 无 clientWidth，max 在 query 时更新
                }
            },
            stop_auto_scroll() {
                if (this._scroll_timer) {
                    clearInterval(this._scroll_timer);
                    this._scroll_timer = null;
                }
            },
            measure_and_tick() {
                const step = this.goods_step_px;
                if (!(step > 0)) return;
                const next = this._scroll_pos + step;
                if (this._scroll_max > 0 && next >= this._scroll_max - 1) {
                    this.scroll_anim = false;
                    this._scroll_pos = 0;
                    this.scroll_left = 0;
                    this.$nextTick(() => { this.scroll_anim = true; });
                    return;
                }
                this.scroll_anim = true;
                this._scroll_pos = next;
                this.scroll_left = next;
            },
            restart_auto_scroll() {
                this.stop_auto_scroll();
                this._scroll_pos = 0;
                this._scroll_max = 0;
                this.scroll_anim = false;
                this.scroll_left = 0;
                if (!this.is_roll || this.goods.length < 2) return;
                this.$nextTick(() => {
                    const q = uni.createSelectorQuery().in(this);
                    q.select('.goods-scroll').fields({ size: true, scrollOffset: true }, (res) => {
                        if (res && res.scrollWidth && res.width) {
                            this._scroll_max = Math.max(0, res.scrollWidth - res.width);
                        }
                    }).exec();
                    this._scroll_timer = setInterval(() => this.measure_and_tick(), this.interval_ms);
                });
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
.wrap { width: 100%; display: flex; flex-direction: column; }
.header { display: flex; flex-direction: row; align-items: center; width: 100%; min-width: 0; }
.title-bar { border-radius: 4rpx; flex-shrink: 0; }
.title-bar-img { flex: 0 1 auto; min-width: 0; max-width: 100%; margin-right: 12rpx; }
.title-mark { flex-shrink: 0; margin-right: 12rpx; }
.title { font-weight: bold; }
.card { width: 100%; box-sizing: border-box; }
.goods-scroll { width: 100%; white-space: nowrap; }
.goods-row { display: inline-flex; flex-direction: row; }
.goods-item { flex-shrink: 0; display: flex; flex-direction: column; gap: 8rpx; }
.goods-img { display: block; overflow: hidden; }
.goods-name { width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
</style>
