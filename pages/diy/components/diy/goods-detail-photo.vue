<template>
    <view v-if="photos.length" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view class="hero pr" :style="'height:' + height + ';'">
                <swiper class="swiper" :style="'height:' + height + ';'" :circular="photos.length > 1" :autoplay="photos.length > 1" :vertical="vertical" @change="photo_change">
                    <swiper-item v-for="(img, index) in photos" :key="index">
                        <image class="slide" :src="img" mode="aspectFill" :style="'height:' + height + ';'" :data-index="index" @tap="photo_tap"></image>
                    </swiper-item>
                </swiper>
                <view v-if="show_indicator" class="indicator" :class="indicator_type == 'line' ? 'is-line' : indicator_class" :style="indicator_type == 'line' ? line_layout.box : indicator_place">
                    <text v-if="indicator_type == 'number'" class="num" :style="num_style">{{ photo_index + 1 }}/{{ photos.length }}</text>
                    <block v-else>
                        <view v-for="(img, index) in photos" :key="index" :class="indicator_type == 'line' ? 'line' : 'dot'" :style="mark_style(index)"></view>
                    </block>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { field_on, goods_photos, outer_style, hero_height, preview_photos, text_style, indicator_layout } from './goods-detail-common.js';
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
            content() {
                return (this.propValue && this.propValue.content) || {};
            },
            style() {
                return (this.propValue && this.propValue.style) || {};
            },
            photos() {
                return goods_photos(this.propGoods);
            },
            outer() {
                return outer_style(this.style);
            },
            height() {
                return hero_height(this.style);
            },
            vertical() {
                return this.content.scroll_direction === 'vertical';
            },
            indicator_type() {
                const type = String(this.content.indicator_type || 'dot');
                return type === 'line' || type === 'number' ? type : 'dot';
            },
            show_indicator() {
                if (this.photos.length < 2) {
                    return false;
                }
                if (this.content.indicator_show == null) {
                    return field_on(this.content, 'dots');
                }
                return this.content.indicator_show !== false;
            },
            indicator_class() {
                const pos = String(this.content.indicator_position || 'center-bottom');
                return 'is-' + pos;
            },
            indicator_place() {
                const gap = (Number(this.style.indicator_bottom) || 16) * 2;
                return 'margin:' + gap + 'rpx;';
            },
            line_layout() {
                return indicator_layout(this.content, this.style, { gap: 16 });
            },
            accent() {
                return this.style.accent_color || '#ff4d4f';
            },
            dot_style() {
                return 'background:' + (this.style.indicator_color || 'rgba(255,255,255,0.75)') + ';';
            },
            num_style() {
                return text_style(this.style.indicator_num_color || '#fff', this.style.indicator_num_size || 12, 'background:' + (this.style.indicator_num_bg || 'rgba(0,0,0,0.45)') + ';border-radius:' + ((Number(this.style.indicator_num_radius) || 10) * 2) + 'rpx;padding:4rpx 16rpx;');
            },
        },
        methods: {
            mark_style(index) {
                const bg = index == this.photo_index ? this.accent : (this.style.indicator_color || 'rgba(255,255,255,0.75)');
                if (this.indicator_type != 'line') {
                    return 'background:' + bg + ';';
                }
                return this.line_layout.item + 'background:' + bg + ';';
            },
            photo_change(e) {
                this.photo_index = (e.detail && e.detail.current) || 0;
            },
            photo_tap(e) {
                const index = e.currentTarget.dataset.index || 0;
                preview_photos(this.photos, index);
            },
        },
    };
</script>
<style lang="scss" scoped>
.hero, .swiper, .slide { width: 100%; }
.slide { display: block; }
.indicator { position: absolute; z-index: 2; display: flex; align-items: center; gap: 8rpx; }
.indicator.is-center-bottom, .indicator.is-bottom-center { left: 0; right: 0; bottom: 0; justify-content: center; }
.indicator.is-left-bottom, .indicator.is-bottom-left { left: 0; bottom: 0; }
.indicator.is-right-bottom, .indicator.is-bottom-right { right: 0; bottom: 0; }
.indicator.is-center-top, .indicator.is-top-center { left: 0; right: 0; top: 0; justify-content: center; }
.indicator.is-left-top, .indicator.is-top-left { left: 0; top: 0; }
.indicator.is-right-top, .indicator.is-top-right { right: 0; top: 0; }
.dot { width: 12rpx; height: 12rpx; border-radius: 50%; }
.indicator.is-line { left: auto; right: auto; top: auto; bottom: auto; gap: 0; }
.line { width: 28rpx; height: 6rpx; border-radius: 6rpx; }
</style>
