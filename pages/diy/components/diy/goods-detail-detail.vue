<template>
    <view v-if="has_body" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view class="card" :style="card">
                <view v-if="show_header" class="header" :style="header_style">
                    <view v-if="title_bar_show == '1' && title_bar_type == 'line'" class="title-bar" :style="title_bar_style"></view>
                    <image v-else-if="title_bar_show == '1' && title_bar_img" class="title-bar-img" :style="title_bar_img_style" :src="title_bar_img" mode="heightFix"></image>
                    <view v-else-if="title_bar_show == '1' && title_bar_icon" class="title-mark">
                        <iconfont :name="title_bar_icon" :size="title_bar_icon_size" :color="title_bar_icon_color"></iconfont>
                    </view>
                    <text v-if="title_show == '1' && title_text" class="title" :style="title_style">{{ title_text }}</text>
                </view>
                <view v-if="use_app" class="body" :style="body_style">
                    <view v-for="(item, index) in view.content_app" :key="index">
                        <image v-if="item.images" class="photo" :src="item.images" mode="widthFix" @tap="preview" :data-src="item.images"></image>
                        <view v-if="item.content && item.content.length">
                            <view v-for="(line, line_index) in item.content" :key="line_index" class="line">{{ line }}</view>
                        </view>
                    </view>
                </view>
                <view v-else-if="view.content_web" class="web body" :style="body_style">
                    <mp-html :content="view.content_web" />
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { padding_computer } from '@/common/js/common/common.js';
    import { goods_view, outer_style, card_style, page_vm, media_url, icon_name } from './goods-detail-common.js';
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
            view() { return goods_view(this.propGoods); },
            use_app() {
                const page = page_vm();
                const mobile = page && String(page.common_app_is_use_mobile_detail) === '1';
                return mobile && this.view.content_app.length > 0;
            },
            has_body() {
                return this.use_app || !!this.view.content_web;
            },
            title_text() {
                if (this.content.title_text == null) return '商品详情';
                return String(this.content.title_text);
            },
            title_show() { return String(this.content.title_show == null ? '1' : this.content.title_show) === '0' ? '0' : '1'; },
            title_bar_show() { return String(this.content.title_bar_show == null ? '1' : this.content.title_bar_show) === '0' ? '0' : '1'; },
            show_header() { return this.title_show === '1' || this.title_bar_show === '1'; },
            header_style() {
                const align = String(this.content.header_align || 'left');
                const justify = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
                const bg = this.style.header_bg ? 'background:' + this.style.header_bg + ';' : '';
                const pad = this.style.header_padding ? padding_computer(this.style.header_padding) : '';
                const gap = this.px(this.style.header_gap, 0) * 2;
                return 'justify-content:' + justify + ';' + bg + pad + 'margin-bottom:' + gap + 'rpx;';
            },
            body_style() {
                return this.style.content_padding ? padding_computer(this.style.content_padding) : '';
            },
            title_bar_type() {
                return this.content.title_bar_type === 'img-icon' ? 'img-icon' : 'line';
            },
            title_bar_img() {
                return media_url(this.content.title_bar_img);
            },
            title_bar_icon() {
                const name = this.content.title_bar_icon;
                if (name == null || name === '') return '';
                return icon_name(name, '');
            },
            title_bar_icon_size() {
                return (this.px(this.style.title_bar_size, 14) * 2) + 'rpx';
            },
            title_bar_icon_color() {
                return this.style.title_bar_icon_color || this.style.title_bar_color || 'rgba(255,77,99,1)';
            },
            title_bar_img_style() {
                const s = this.px(this.style.title_bar_size, 14) * 2;
                return 'height:' + s + 'rpx;width:auto;max-width:100%;';
            },
            title_bar_style() {
                const bar = this.px(this.style.title_bar_size, 14);
                const title = this.px(this.style.title_size, 15);
                const h = Math.max(bar, Math.round(title * 0.95)) * 2;
                const c1 = this.style.title_bar_color || 'rgba(255,77,99,1)';
                const c2 = this.style.title_bar_color_end || '';
                const bg = c2 ? 'linear-gradient(180deg,' + c1 + ',' + c2 + ')' : c1;
                return 'width:6rpx;height:' + h + 'rpx;background:' + bg + ';margin-right:12rpx;';
            },
            title_style() {
                const size = this.px(this.style.title_size, 15) * 2;
                const color = this.style.title_color || '#333';
                const weight = this.style.title_weight || 'bold';
                return 'font-size:' + size + 'rpx;color:' + color + ';font-weight:' + weight + ';';
            },
            outer() { return outer_style(this.style); },
            card() {
                return card_style(Object.assign({}, this.style, { content_padding: null }));
            },
        },
        methods: {
            px(value, fallback) {
                if (value == null || value === '') return fallback;
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            preview(e) {
                const src = e.currentTarget.dataset.src;
                if (!src) {
                    return;
                }
                uni.previewImage({ current: src, urls: [src] });
            },
        },
    };
</script>
<style lang="scss" scoped>
.card { width: 100%; }
.header { display: flex; flex-direction: row; align-items: center; width: 100%; min-width: 0; }
.title-bar { border-radius: 4rpx; flex-shrink: 0; }
.title-bar-img { flex: 0 1 auto; min-width: 0; max-width: 100%; margin-right: 12rpx; }
.title-mark { flex-shrink: 0; margin-right: 12rpx; }
.title { font-weight: bold; font-size: 28rpx; color: #333; }
.photo { width: 100%; display: block; }
.line { font-size: 26rpx; color: #333; line-height: 1.6; padding: 8rpx 0; }
.web { font-size: 26rpx; }
</style>
