<template>
    <view v-if="has_body" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view class="wrap" :style="wrap_style">
                <!-- 标题在白块外 -->
                <view v-if="show_header" class="header" :style="header_style">
                    <view v-if="title_bar_show == '1' && title_bar_type == 'line'" class="title-bar" :style="title_bar_style"></view>
                    <image v-else-if="title_bar_show == '1' && title_bar_img" class="title-bar-img" :style="title_bar_img_style" :src="title_bar_img" mode="heightFix"></image>
                    <view v-else-if="title_bar_show == '1' && title_bar_icon" class="title-mark">
                        <iconfont :name="title_bar_icon" :size="title_bar_icon_size" :color="title_bar_icon_color"></iconfont>
                    </view>
                    <text v-if="title_show == '1' && title_text" class="title" :style="title_style">{{ title_text }}</text>
                </view>

                <view class="card" :style="card">
                    <view v-if="show_album" class="album" :style="album_pad_style">
                        <image
                            v-for="(img, index) in view.photos"
                            :key="index"
                            class="photo"
                            :src="img"
                            mode="widthFix"
                            :data-index="index"
                            @tap="album_preview"
                        ></image>
                    </view>
                    <view v-if="use_app" class="body app" :style="body_pad_style">
                        <view v-for="(item, index) in view.content_app" :key="index" class="app-item">
                            <image v-if="item.images" class="photo" :src="item.images" mode="widthFix" @tap="preview" :data-src="item.images"></image>
                            <view v-if="item.content && item.content.length" class="content-items">
                                <view v-for="(line, line_index) in item.content" :key="line_index" class="line">{{ line }}</view>
                            </view>
                        </view>
                    </view>
                    <view v-else-if="show_web" class="web body" :style="body_pad_style">
                        <mp-html :content="view.content_web" />
                    </view>
                    <view v-else-if="!show_album" class="empty" :style="body_pad_style">{{ $t('goods-detail.detailed_data_available_moment') }}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { padding_computer } from '@/common/js/common/common.js';
    import { goods_view, outer_style, card_style, media_url, icon_name, use_mobile_detail, detail_show_photo, preview_photos } from './goods-detail-common.js';
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
            mobile_detail() { return use_mobile_detail(); },
            use_app() { return this.mobile_detail && this.view.content_app.length > 0; },
            show_web() { return !this.mobile_detail && !!this.view.content_web; },
            show_album() { return detail_show_photo() && this.view.photos.length > 0; },
            has_body() { return this.show_album || this.use_app || this.show_web || this.has_goods; },
            has_goods() { return !!(this.propGoods && (this.propGoods.id || this.view.title)); },
            title_text() {
                if (this.content.title_text == null) return '商品详情';
                return String(this.content.title_text);
            },
            title_show() { return String(this.content.title_show == null ? '1' : this.content.title_show) === '0' ? '0' : '1'; },
            title_bar_show() { return String(this.content.title_bar_show == null ? '1' : this.content.title_bar_show) === '0' ? '0' : '1'; },
            show_header() { return this.title_show === '1' || this.title_bar_show === '1'; },
            wrap_style() {
                const gap = this.px(this.style.header_gap, 8) * 2;
                return this.show_header ? 'gap:' + gap + 'rpx;' : '';
            },
            header_style() {
                const align = String(this.content.header_align || 'left');
                const justify = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
                const bg = this.style.header_bg ? 'background:' + this.style.header_bg + ';' : '';
                const pad = this.style.header_padding ? padding_computer(this.style.header_padding) : '';
                return 'justify-content:' + justify + ';' + bg + pad;
            },
            album_pad_style() {
                const pad = this.style.content_padding;
                if (!pad || typeof pad !== 'object') {
                    return 'padding:20rpx 20rpx 0;box-sizing:border-box;';
                }
                const top = pad.padding_top != null ? pad.padding_top : (pad.padding || 0);
                const left = pad.padding_left != null ? pad.padding_left : (pad.padding || 0);
                const right = pad.padding_right != null ? pad.padding_right : (pad.padding || 0);
                return 'padding-top:' + (Number(top) * 2) + 'rpx;padding-left:' + (Number(left) * 2) + 'rpx;padding-right:' + (Number(right) * 2) + 'rpx;padding-bottom:0;box-sizing:border-box;';
            },
            body_pad_style() {
                if (!this.show_album) {
                    return this.style.content_padding ? padding_computer(this.style.content_padding) : '';
                }
                const pad = this.style.content_padding;
                if (!pad || typeof pad !== 'object') {
                    return 'padding-left:0;padding-right:0;padding-bottom:24rpx;';
                }
                const left = pad.padding_left != null ? pad.padding_left : (pad.padding || 0);
                const right = pad.padding_right != null ? pad.padding_right : (pad.padding || 0);
                const bottom = pad.padding_bottom != null ? pad.padding_bottom : (pad.padding || 0);
                return 'padding-top:0;padding-left:' + (Number(left) * 2) + 'rpx;padding-right:' + (Number(right) * 2) + 'rpx;padding-bottom:' + (Number(bottom) * 2) + 'rpx;box-sizing:border-box;';
            },
            title_bar_type() { return this.content.title_bar_type === 'img-icon' ? 'img-icon' : 'line'; },
            title_bar_img() { return media_url(this.content.title_bar_img); },
            title_bar_icon() {
                const name = this.content.title_bar_icon;
                if (name == null || name === '') return '';
                return icon_name(name, '');
            },
            title_bar_icon_size() { return (this.px(this.style.title_bar_size, 14) * 2) + 'rpx'; },
            title_bar_icon_color() { return this.style.title_bar_icon_color || this.style.title_bar_color || 'rgba(255,77,99,1)'; },
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
                return 'font-size:' + (this.px(this.style.title_size, 15) * 2) + 'rpx;color:' + (this.style.title_color || '#333') + ';font-weight:' + (this.style.title_weight || 'bold') + ';';
            },
            outer() { return outer_style(this.style); },
            /** 内容白块：去掉 content_padding 由内部 album/body 自己铺，避免标题进白底 */
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
                if (!src) return;
                uni.previewImage({ current: src, urls: [src] });
            },
            album_preview(e) {
                const index = Number(e.currentTarget.dataset.index) || 0;
                preview_photos(this.view.photos, index);
            },
        },
    };
</script>
<style lang="scss" scoped>
.wrap { width: 100%; display: flex; flex-direction: column; }
.card { width: 100%; }
.header { display: flex; flex-direction: row; align-items: center; width: 100%; min-width: 0; }
.title-bar { border-radius: 4rpx; flex-shrink: 0; }
.title-bar-img { flex: 0 1 auto; min-width: 0; max-width: 100%; margin-right: 12rpx; }
.title-mark { flex-shrink: 0; margin-right: 12rpx; }
.title { font-weight: bold; font-size: 28rpx; color: #333; }
.album { width: 100%; box-sizing: border-box; }
.photo { width: 100%; display: block; }
.app-item { width: 100%; }
.content-items { width: 100%; }
.line { font-size: 26rpx; color: #333; line-height: 1.6; padding: 8rpx 0; }
.web { font-size: 26rpx; }
.empty { width: 100%; text-align: center; color: #999; font-size: 26rpx; padding: 48rpx 0; box-sizing: border-box; }
</style>
