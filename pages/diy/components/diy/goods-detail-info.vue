<template>
    <view v-if="propGoods" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view v-if="view.photos.length" class="hero pr" :style="'height:' + height + ';'">
                <swiper class="swiper" :style="'height:' + height + ';'" :circular="view.photos.length > 1" :autoplay="view.photos.length > 1" :vertical="vertical" @change="photo_change">
                    <swiper-item v-for="(img, index) in view.photos" :key="index">
                        <image class="slide" :src="img" mode="aspectFill" :style="'height:' + height + ';'" :data-index="index" @tap="photo_tap"></image>
                    </swiper-item>
                </swiper>
                <view v-if="show_indicator" class="indicator" :class="indicator_type == 'line' ? 'is-line' : indicator_class" :style="indicator_type == 'line' ? line_layout.box : ''">
                    <text v-if="indicator_type == 'number'" class="num">{{ photo_index + 1 }}/{{ view.photos.length }}</text>
                    <block v-else>
                        <view v-for="(img, index) in view.photos" :key="index" :class="indicator_type == 'line' ? 'line' : 'dot'" :style="mark_style(index)"></view>
                    </block>
                </view>
                <scroll-view v-if="theme == '0' && show('sku') && view.sku.length" scroll-x class="hero-sku" :show-scrollbar="false" @tap.stop="spec_tap">
                    <view class="sku-row" :style="theme0_row_style">
                        <block v-for="(item, index) in sku_show" :key="index">
                            <image v-if="item.img" class="thumb theme0" :class="item.active ? 'active' : ''" :style="theme0_thumb_style(item.active)" :src="item.img" mode="aspectFill"></image>
                            <view v-else class="thumb theme0 thumb-name" :class="item.active ? 'active' : ''" :style="theme0_thumb_style(item.active)">{{ item.name }}</view>
                        </block>
                        <view class="more theme0" :style="theme0_more_style">{{ view.sku.length }}款可选</view>
                    </view>
                </scroll-view>
                <scroll-view v-if="theme == '3' && show('sku') && view.sku.length" scroll-x class="hero-float" :show-scrollbar="false" @tap.stop="spec_tap">
                    <view class="sku-row">
                        <view v-for="(item, index) in sku_show" :key="index" class="float-item" :class="item.active ? 'active' : ''" :style="float_item_style(item)">
                            <image v-if="item.img" class="float-img" :style="sku_img_style" :src="item.img" mode="aspectFill"></image>
                            <text :style="name_style(item.active)">{{ item.name }}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <view class="card" :class="view.photos.length ? 'overlap' : ''" :style="card">
                <block v-if="theme == '1' && show('sku') && view.sku.length">
                    <scroll-view scroll-x class="sku-scroll" :show-scrollbar="false" @tap="spec_tap">
                        <view class="sku-row" :style="bar_row_style">
                            <view v-for="(item, index) in sku_show" :key="index" class="bar-item" :style="bar_item_style(item)">
                                <image v-if="item.img" class="thumb sm" :style="bar_thumb_style" :src="item.img" mode="aspectFill"></image>
                                <text :style="name_style(item.active)">{{ item.name }}</text>
                            </view>
                            <view class="more bar-count" :style="count_style">
                                <text>共{{ view.sku.length }}款</text>
                                <iconfont name="icon-arrow-right" :size="arrow_size" :color="arrow_color"></iconfont>
                            </view>
                        </view>
                    </scroll-view>
                </block>
                <block v-if="theme != '4'">
                    <view v-if="show('price') || show('price_label') || (show('market_price') && view.origin)" class="price-row">
                        <text v-if="show('price_label')" :style="pack.label">{{ view.label }}</text>
                        <text v-if="show('price')">
                            <text :style="pack.symbol">{{ view.symbol }}</text>
                            <text :style="pack.price">{{ view.price }}</text>
                        </text>
                        <text v-if="show('market_price') && view.origin" :style="pack.market">{{ view.origin_symbol }}{{ view.origin }}</text>
                    </view>
                    <view v-if="show('title') || tag_before_list.length" class="title" :style="show('title') ? pack.title : ''">
                        <text v-for="(tag, index) in tag_before_list" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                        <text v-if="show('title')">{{ view.title }}</text>
                    </view>
                    <view v-if="show_brief_text" class="brief" :style="pack.brief">{{ view.brief }}</view>
                </block>
                <block v-else>
                    <view v-if="show('title') || tag_before_list.length" class="title" :style="show('title') ? pack.title : ''">
                        <text v-for="(tag, index) in tag_before_list" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                        <text v-if="show('title')">{{ view.title }}</text>
                    </view>
                    <view v-if="show_brief_text" class="brief" :style="pack.brief">{{ view.brief }}</view>
                    <view class="price-action">
                        <view class="flex-1">
                            <view v-if="show('price') || show('price_label')" class="price-row">
                                <text v-if="show('price_label')" class="member" :style="pack.member">{{ view.label }}</text>
                                <text v-if="show('price')">
                                    <text :style="pack.symbol">{{ view.symbol }}</text>
                                    <text :style="pack.price">{{ view.price }}</text>
                                </text>
                            </view>
                            <text v-if="show('market_price') && view.origin" :style="pack.market">{{ view.origin_symbol }}{{ view.origin }}</text>
                        </view>
                        <view class="actions">
                            <view v-if="show('share')" class="action" :style="pack.action" @tap="share_event">
                                <iconfont :name="share_icon" :size="pack.action_icon" :color="pack.action_color"></iconfont>
                                <text>{{ share_text }}</text>
                            </view>
                            <view v-if="show('collect')" class="action" :style="pack.action" @tap="favor_event">
                                <iconfont :name="collect_icon" :size="pack.action_icon" :color="view.favored ? pack.accent : pack.action_color"></iconfont>
                                <text>{{ view.favored ? '已收藏' : collect_text }}</text>
                            </view>
                        </view>
                    </view>
                </block>
                <view v-if="show_meta_line" class="divider" :style="pack.divider"></view>
                <view v-if="show_meta" class="meta" :style="meta_box">
                    <text v-if="show('views')" :style="pack.meta">浏览量: {{ view.views }}</text>
                    <text v-if="show('stock') && view.show_stock" :style="pack.meta">库存: {{ view.stock }}</text>
                    <text v-if="show('sales') && view.show_sales" :style="pack.meta">销量: {{ view.sales }}</text>
                </view>
                <view v-if="show('tags') && !tag_before && view.tags.length" class="tags">
                    <text v-for="(tag, index) in view.tags" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                </view>
                <view v-if="show_sku_line" class="divider" :style="pack.sku_divider"></view>
                <view v-if="theme == '2' && show('sku') && view.sku.length" class="grid" :style="sku_box" @tap="spec_tap">
                    <view v-for="(item, index) in sku_show" :key="index" class="grid-item" :style="grid_item_style">
                        <image v-if="item.img" class="grid-thumb" :class="item.active ? 'active' : ''" :style="sku_img_style + (item.active ? active_border : '')" :src="item.img" mode="aspectFill"></image>
                        <view v-else-if="sku_has_img" :style="sku_img_style"></view>
                        <text class="grid-name" :class="sku_has_img ? '' : 'solo'" :style="name_style(item.active)">{{ item.name }}</text>
                    </view>
                    <view class="more grid-more" :style="grid_more_style">
                        <text>{{ view.sku.length }}款可选</text>
                        <iconfont name="icon-arrow-right" :size="arrow_size" :color="arrow_color"></iconfont>
                    </view>
                </view>
                <view v-if="theme == '4' && show('sku')" class="sku-select" :style="sku_box" @tap="spec_tap">
                    <text>规格</text>
                    <text class="flex-1 sku-text">{{ sku_text }}</text>
                    <iconfont name="icon-arrow-right" size="24rpx" color="#999"></iconfont>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { field_on, show_brief, goods_view, outer_style, card_style, price_pack, hero_height, preview_photos, open_spec, call_page, icon_name, page_vm, visible_sku, indicator_layout } from './goods-detail-common.js';
    export default {
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 0 },
        },
        data() {
            return { photo_index: 0 };
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
            pack() { return price_pack(this.style); },
            height() { return hero_height(this.style); },
            vertical() { return this.content.scroll_direction === 'vertical'; },
            indicator_type() {
                const type = String(this.content.indicator_type || 'dot');
                return type === 'line' || type === 'number' ? type : 'dot';
            },
            show_indicator() {
                if (this.view.photos.length < 2) return false;
                if (this.content.indicator_show == null) return true;
                return this.content.indicator_show !== false;
            },
            indicator_class() { return 'is-' + String(this.content.indicator_position || 'center-bottom'); },
            line_layout() {
                let bottom = 12;
                if (this.theme == '0' && this.show('sku') && this.view.sku.length) {
                    bottom = this.sku_has_img ? 48 : 24;
                } else if (this.theme == '3' && this.show('sku') && this.view.sku.length) {
                    bottom = this.sku_has_img ? 16 + this.sku_img_px : 24;
                }
                return indicator_layout(this.content, this.style, { gap: 20, bottom: bottom });
            },
            tag_before() { return this.content.tag_position !== 'row'; },
            tag_before_list() { return this.show('tags') && this.tag_before ? this.view.tags : []; },
            sku_show() { return visible_sku(this.view.sku, 6); },
            sku_has_img() {
                return (this.view.sku || []).some((item) => item && item.img);
            },
            sku_text() {
                const picked = [];
                (this.view.levels || []).forEach((level) => {
                    (level.options || []).forEach((opt) => {
                        if (opt.active && opt.name) picked.push(opt.name);
                    });
                });
                if (picked.length) return picked.join(' / ');
                const page = page_vm();
                if (page && page.goods_spec_selected_text) return page.goods_spec_selected_text;
                return '请选择';
            },
            active_color() { return this.style.sku_active_color || '#ff4d4f'; },
            active_border() { return 'border-color:' + this.active_color + ';'; },
            float_active_style() {
                return 'background:' + (this.style.sku_float_active_bg || '#fff') + ';border-color:' + this.active_color + ';';
            },
            show_meta() {
                return (this.show('views') && this.view.views !== '') || (this.show('stock') && this.view.show_stock) || (this.show('sales') && this.view.show_sales);
            },
            show_meta_line() { return this.content.divider_show !== false && this.show_meta; },
            sku_line_on() {
                if (this.content.sku_divider_show == null || this.content.sku_divider_show === '') {
                    return this.content.divider_show !== false;
                }
                return this.content.sku_divider_show !== false;
            },
            has_above_sku() {
                return this.show_meta || this.show_brief_text || (this.show('title') && !!this.view.title) || (this.show('tags') && this.view.tags.length) || this.show('price') || this.show('price_label') || this.show('market_price') || this.show('share') || this.show('collect');
            },
            show_sku_line() {
                if (this.theme !== '2' && this.theme !== '4') return false;
                if (!this.show('sku') || !this.has_above_sku) return false;
                if (this.theme === '2' && !this.view.sku.length) return false;
                return this.sku_line_on;
            },
            sku_box() {
                if (this.theme !== '2' && this.theme !== '4') return '';
                const top = this.show_sku_line ? 0 : (this.has_above_sku ? this.pack.sku_gap : 0);
                return 'margin-top:' + top + 'rpx;';
            },
            sku_img_px() {
                const n = Number(this.style.sku_img_size);
                return Number.isFinite(n) && n > 0 ? n : 44;
            },
            bar_img_px() {
                return Math.max(22, Math.round(this.sku_img_px * 0.64));
            },
            bar_thumb_style() {
                const s = this.bar_img_px * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;margin-right:12rpx;border-radius:8rpx;';
            },
            bar_row_style() {
                return 'gap:16rpx;';
            },
            count_style() {
                const size = this.px(this.style.sku_count_size, 11) * 2;
                const color = this.style.sku_count_color || '#ff4d4f';
                return 'margin-left:4rpx;padding:0;background:transparent;font-size:' + size + 'rpx;color:' + color + ';';
            },
            grid_more_style() {
                const size = this.px(this.style.sku_count_size, 11) * 2;
                const color = this.style.sku_count_color || '#ff4d4f';
                const text = 'padding:0;background:transparent;font-size:' + size + 'rpx;color:' + color + ';';
                if (!this.sku_has_img) {
                    return text + 'height:auto;';
                }
                return text + 'height:' + (this.sku_img_px * 2) + 'rpx;';
            },
            arrow_size() {
                return (this.px(this.style.sku_arrow_size, 12) * 2) + 'rpx';
            },
            arrow_color() {
                return this.style.sku_arrow_color || this.style.sku_count_color || '#ff4d4f';
            },
            sku_img_style() {
                const s = this.sku_img_px * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;';
            },
            theme0_row_style() {
                return 'gap:16rpx;';
            },
            theme0_more_style() {
                if (!this.sku_has_img) {
                    const size = this.px(this.style.sku_count_size, 11) * 2;
                    return 'height:auto;padding:4rpx 16rpx;border-radius:12rpx;font-size:' + size + 'rpx;line-height:1.4;background:rgba(255,255,255,0.92);';
                }
                const s = this.sku_img_px * 2;
                return 'height:' + s + 'rpx;padding:0 16rpx;border-radius:12rpx;font-size:22rpx;line-height:' + s + 'rpx;background:rgba(255,255,255,0.92);';
            },
            grid_item_style() {
                if (!this.sku_has_img) {
                    return '';
                }
                const text = Number(this.style.sku_text_size);
                const text_px = Number.isFinite(text) && text > 0 ? text : 12;
                const width = Math.max(this.sku_img_px, text_px * 4) * 2;
                return 'width:' + width + 'rpx;';
            },
            show_brief_text() { return show_brief(this.content) && !!this.view.brief; },
            meta_box() {
                const top = this.show_meta_line ? 0 : this.pack.meta_gap;
                return this.pack.meta + 'margin-top:' + top + 'rpx;';
            },
            share_text() { return this.content.share_text || '分享'; },
            collect_text() { return this.content.collect_text || '收藏'; },
            share_icon() { return icon_name(this.content.share_icon, 'icon-share-circle'); },
            collect_icon() { return icon_name(this.view.favored ? 'heart' : (this.content.collect_icon || 'collect'), 'icon-heart'); },
        },
        methods: {
            show(key) { return field_on(this.content, key); },
            px(value, fallback) {
                if (value == null || value === '') return fallback;
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            photo_change(e) { this.photo_index = (e.detail && e.detail.current) || 0; },
            photo_tap(e) { preview_photos(this.view.photos, e.currentTarget.dataset.index || 0); },
            mark_style(index) {
                const bg = index == this.photo_index ? (this.style.indicator_active_color || this.pack.accent) : (this.style.indicator_color || 'rgba(255,255,255,0.75)');
                if (this.indicator_type != 'line') {
                    return 'background:' + bg + ';';
                }
                return this.line_layout.item + 'background:' + bg + ';';
            },
            bar_item_style(item) {
                const active = item && item.active;
                const bg = this.style.sku_bg_color || '#f5f5f5';
                const border = active ? this.active_color : 'transparent';
                const box = 'background:' + bg + ';border:1px solid ' + border + ';border-radius:12rpx;margin-right:0;box-sizing:border-box;align-items:center;';
                if (!this.sku_has_img) {
                    return box + 'padding:8rpx 16rpx;';
                }
                const pad = item && item.img ? '6rpx 16rpx 6rpx 6rpx' : '0 16rpx';
                return box + 'padding:' + pad + ';height:' + (this.bar_img_px * 2 + 16) + 'rpx;';
            },
            float_item_style(item) {
                const active = item && item.active;
                let style = active ? this.float_active_style : '';
                if (!this.sku_has_img) {
                    return style;
                }
                const pad = item && item.img ? '8rpx 16rpx 8rpx 8rpx' : '0 16rpx';
                return style + 'height:' + (this.sku_img_px * 2 + 20) + 'rpx;padding:' + pad + ';box-sizing:border-box;align-items:center;';
            },
            theme0_thumb_style(active) {
                const border = 'margin-right:0;border-radius:12rpx;box-sizing:border-box;border:1px solid ' + (active ? this.active_color : 'transparent') + ';';
                if (!this.sku_has_img) {
                    const n = Number(active ? this.style.sku_active_size : this.style.sku_text_size);
                    const px = Number.isFinite(n) && n > 0 ? n : 12;
                    const color = active ? this.active_color : (this.style.sku_text_color || '#333');
                    return border + 'width:auto;height:auto;padding:4rpx 16rpx;font-size:' + (px * 2) + 'rpx;line-height:1.4;color:' + color + ';background:rgba(255,255,255,0.92);';
                }
                const s = this.sku_img_px * 2;
                return border + 'width:' + s + 'rpx;height:' + s + 'rpx;';
            },
            name_style(active) {
                const n = Number(active ? this.style.sku_active_size : this.style.sku_text_size);
                const px = Number.isFinite(n) && n > 0 ? n : 12;
                const color = active ? this.active_color : (this.style.sku_text_color || '');
                return 'font-size:' + (px * 2) + 'rpx;' + (color ? 'color:' + color + ';' : '');
            },
            spec_tap() { open_spec(); },
            share_event(e) { call_page('popup_share_event', e); },
            favor_event(e) { call_page('goods_favor_event', e); },
        },
    };
</script>
<style lang="scss" scoped>
.hero, .swiper, .slide { width: 100%; }
.slide { display: block; }
.indicator { position: absolute; z-index: 2; display: flex; gap: 8rpx; align-items: center; }
.indicator.is-line { left: auto; right: auto; top: auto; bottom: auto; gap: 0; }
.indicator.is-center-bottom { left: 0; right: 0; bottom: 24rpx; justify-content: center; }
.indicator.is-left-bottom { left: 24rpx; bottom: 24rpx; }
.indicator.is-right-bottom { right: 24rpx; bottom: 24rpx; }
.indicator.is-center-top { left: 0; right: 0; top: 24rpx; justify-content: center; }
.dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: rgba(255,255,255,0.75); }
.line { width: 28rpx; height: 6rpx; border-radius: 6rpx; background: rgba(255,255,255,0.75); }
.num { color: #fff; background: rgba(0,0,0,0.45); border-radius: 20rpx; padding: 4rpx 16rpx; font-size: 22rpx; }
.hero-sku, .hero-float { position: absolute; left: 0; right: 0; bottom: 16rpx; z-index: 2; white-space: nowrap; }
.sku-row, .price-row, .meta, .tags, .grid, .price-action, .actions, .sku-select { display: flex; flex-direction: row; align-items: center; }
.thumb { width: 88rpx; height: 88rpx; border-radius: 12rpx; margin-right: 12rpx; background: #fff; box-sizing: border-box; }
.thumb.theme0 { margin-right: 0; }
.thumb-name { display: flex; align-items: center; justify-content: center; overflow: hidden; font-size: 20rpx; color: #333; text-align: center; line-height: 1.2; background: rgba(255,255,255,0.92); }
.thumb.sm { width: 56rpx; height: 56rpx; margin-right: 12rpx; border-radius: 8rpx; }
.thumb.active { border: 1px solid #ff4d4f; }
.more { font-size: 22rpx; color: #666; background: rgba(255,255,255,0.9); border-radius: 8rpx; padding: 8rpx 12rpx; }
.card { width: 100%; position: relative; z-index: 3; }
.card.overlap { margin-top: -24rpx; }
.price-row { flex-wrap: wrap; gap: 8rpx; }
.title { margin-top: 12rpx; line-height: 1.45; }
.brief { line-height: 1.5; }
.tag { display: inline-block; margin-right: 12rpx; }
.meta, .tags { justify-content: space-between; flex-wrap: wrap; }
.tags { margin-top: 16rpx; }
.tags { justify-content: flex-start; gap: 12rpx; }
.divider { height: 1px; }
.bar-item, .float-item { display: inline-flex; flex-direction: row; align-items: center; margin-right: 0; padding: 6rpx 16rpx 6rpx 6rpx; background: #f5f5f5; border-radius: 12rpx; font-size: 24rpx; border: 1px solid transparent; box-sizing: border-box; }
.float-item.active { border: 1px solid #ff4d4f; }
.float-item { margin-right: 16rpx; padding: 8rpx 16rpx; border-radius: 16rpx; background: rgba(255,255,255,0.92); max-width: 280rpx; }
.float-img { border-radius: 8rpx; margin-right: 12rpx; flex-shrink: 0; }
.grid { flex-wrap: nowrap; gap: 24rpx; margin-top: 16rpx; align-items: flex-start; }
.grid-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; }
.grid-thumb { border-radius: 12rpx; background: #f4fcff; }
.grid-thumb.active { border: 1px solid #ff4d4f; }
.grid-name { margin-top: 12rpx; width: 100%; overflow: hidden; white-space: nowrap; text-align: center; line-height: 1.3; }
.grid-name.solo { margin-top: 0; }
.grid-more, .bar-count { display: inline-flex; flex-direction: row; align-items: center; }
.price-action { justify-content: space-between; margin-top: 16rpx; }
.actions { gap: 24rpx; }
.action { display: flex; flex-direction: column; align-items: center; }
.member { margin-right: 8rpx; }
.sku-select { margin-top: 16rpx; }
.sku-text { margin: 0 12rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: #666; }
.sku-scroll { white-space: nowrap; margin-bottom: 16rpx; }
.flex-1 { flex: 1; min-width: 0; }
</style>
