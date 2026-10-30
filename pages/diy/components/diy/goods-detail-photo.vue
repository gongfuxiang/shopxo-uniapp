<template>
    <view v-if="slide_total" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view class="hero pr" :style="'height:' + height + ';'">
                <goods-detail-hero-swiper ref="hero" :photos="photos" :video="video" :video-poster="video_poster" :height="height" :vertical="vertical" :prop-key="propKey" :ctrl-icons="ctrl_icons" :ctrl-style="ctrl_style" :is-roll="is_roll" :interval-time="interval_time" :scroll-duration="scroll_duration" @change="photo_change" @preview="photo_preview" @ctrl="on_ctrl"></goods-detail-hero-swiper>
                <view v-if="show_indicator && indicator_type == 'media'" class="indicator" :class="indicator_class" :style="indicator_place">
                    <view class="media-switch" :style="media_box_style">
                        <view v-if="video" class="media-item" :style="media_item_style(photo_index === 0)" @tap.stop="media_jump(0)">{{ video_label }}</view>
                        <view class="media-item" :style="media_item_style(photo_index > 0 || !video)" @tap.stop="media_jump(video ? 1 : 0)">{{ album_text }}</view>
                    </view>
                </view>
                <view v-else-if="show_indicator" class="indicator" :class="indicator_type == 'line' ? 'is-line' : indicator_class" :style="indicator_type == 'line' ? line_layout.box : indicator_place">
                    <text v-if="indicator_type == 'number'" class="num" :style="num_style">{{ photo_index + 1 }}/{{ slide_total }}</text>
                    <block v-else>
                        <view v-for="index in slide_total" :key="index" :class="indicator_type == 'line' ? 'line' : 'dot'" :style="mark_style(index - 1)"></view>
                    </block>
                </view>
                <!-- #ifdef H5 -->
                <view v-if="show_h5_ctrls" class="video-ctrl-layer">
                    <view class="horn-btn" :style="ctrl_style.btn" @tap.stop="hero_toggle_pause">
                        <image v-if="h5_pause_img" class="horn-img" :src="h5_pause_img" :style="ctrl_style.img" mode="aspectFit"></image>
                        <text v-else class="horn-icon" :class="h5_pause_class" :style="ctrl_style.icon">{{ h5_pause_text }}</text>
                    </view>
                    <view class="horn-btn" :style="ctrl_style.btn + (ctrl_style.gap || '')" @tap.stop="hero_toggle_mute">
                        <image v-if="h5_mute_img" class="horn-img" :src="h5_mute_img" :style="ctrl_style.img" mode="aspectFit"></image>
                        <text v-else class="horn-icon" :class="h5_mute_class" :style="ctrl_style.icon">{{ h5_mute_text }}</text>
                    </view>
                </view>
                <!-- #endif -->
            </view>
        </view>
    </view>
</template>
<script>
    import { field_on, goods_photos, goods_video, resolve_video_poster, outer_style, hero_height, preview_photos, text_style, indicator_layout, media_indicator_styles, video_ctrl_icons, video_ctrl_styles } from './goods-detail-common.js';
    import GoodsDetailHeroSwiper from './goods-detail-hero-swiper.vue';
    export default {
        components: { GoodsDetailHeroSwiper },
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 0 },
        },
        data() {
            return {
                photo_index: 0,
                video_playing: false,
                video_paused: false,
                video_muted: false,
                video_fullscreen: false,
            };
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
            video() {
                return goods_video(this.propGoods);
            },
            video_poster() {
                return resolve_video_poster(this.content, this.propGoods);
            },
            slide_total() {
                return this.photos.length + (this.video ? 1 : 0);
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
            is_roll() {
                return this.content.is_roll != '0';
            },
            interval_time() {
                const n = Number(this.content.interval_time);
                return Number.isFinite(n) && n > 0 ? n : 3;
            },
            scroll_duration() {
                const n = Number(this.content.scroll_duration);
                return Number.isFinite(n) && n > 0 ? n : 400;
            },
            indicator_type() {
                const type = String(this.content.indicator_type || 'dot');
                if (type === 'line' || type === 'number' || type === 'media') {
                    return type;
                }
                return 'dot';
            },
            show_indicator() {
                const shown = this.content.indicator_show == null ? field_on(this.content, 'dots') : this.content.indicator_show !== false;
                if (!shown) {
                    return false;
                }
                if (this.indicator_type === 'media') {
                    return this.photos.length > 0 || !!this.video;
                }
                return this.slide_total >= 2;
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
            video_label() {
                return this.content.indicator_video_text == null ? '视频' : String(this.content.indicator_video_text);
            },
            album_label() {
                return this.content.indicator_album_text == null ? '图集' : String(this.content.indicator_album_text);
            },
            album_count() {
                const total = this.photos.length;
                if (!total) {
                    return '';
                }
                if (this.video && this.photo_index === 0) {
                    return String(total);
                }
                const pos = this.video ? this.photo_index : this.photo_index + 1;
                return pos + '/' + total;
            },
            album_text() {
                if (this.album_label && this.album_count) {
                    return this.album_label + ' ' + this.album_count;
                }
                return this.album_label || this.album_count;
            },
            media_styles() {
                return media_indicator_styles(this.style);
            },
            media_box_style() {
                return this.media_styles.box;
            },
            ctrl_icons() {
                return video_ctrl_icons(this.content);
            },
            ctrl_style() {
                return video_ctrl_styles(this.style);
            },
            show_h5_ctrls() {
                return !!this.video && this.photo_index === 0 && this.video_playing && !this.video_fullscreen;
            },
            h5_pause_img() {
                const icons = this.ctrl_icons || {};
                const item = this.video_paused ? icons.play : icons.pause;
                return (item && item.img) || '';
            },
            h5_mute_img() {
                const icons = this.ctrl_icons || {};
                const item = this.video_muted ? icons.mute : icons.sound;
                return (item && item.img) || '';
            },
            h5_pause_class() {
                return '';
            },
            h5_mute_class() {
                return '';
            },
            h5_pause_text() {
                if (this.h5_pause_img) {
                    return '';
                }
                return this.video_paused ? '▶' : '❚❚';
            },
            h5_mute_text() {
                if (this.h5_mute_img) {
                    return '';
                }
                return this.video_muted ? '🔇' : '🔊';
            },
            accent() {
                return this.style.accent_color == null ? '#ff4d4f' : this.style.accent_color;
            },
            dot_style() {
                const color = this.style.indicator_color == null ? 'rgba(255,255,255,0.75)' : this.style.indicator_color;
                return 'background:' + color + ';';
            },
            num_style() {
                const color = this.style.indicator_num_color == null ? '#fff' : this.style.indicator_num_color;
                const bg = this.style.indicator_num_bg == null ? 'rgba(0,0,0,0.45)' : this.style.indicator_num_bg;
                return text_style(color, this.style.indicator_num_size || 12, 'background:' + bg + ';border-radius:' + ((Number(this.style.indicator_num_radius) || 10) * 2) + 'rpx;padding:4rpx 16rpx;');
            },
        },
        methods: {
            mark_style(index) {
                const idle = this.style.indicator_color == null ? 'rgba(255,255,255,0.75)' : this.style.indicator_color;
                const bg = index == this.photo_index ? this.accent : idle;
                if (this.indicator_type != 'line') {
                    return 'background:' + bg + ';';
                }
                return this.line_layout.item + 'background:' + bg + ';';
            },
            photo_change(index) {
                this.photo_index = index || 0;
            },
            photo_preview(index) {
                preview_photos(this.photos, index || 0);
            },
            media_item_style(on) {
                return on ? this.media_styles.active : this.media_styles.idle;
            },
            media_jump(index) {
                const hero = this.$refs.hero;
                if (hero && hero.jump) {
                    hero.jump(index);
                }
            },
            on_ctrl(state) {
                state = state || {};
                this.video_playing = !!state.playing;
                this.video_paused = !!state.paused;
                this.video_muted = !!state.muted;
                this.video_fullscreen = !!state.fullscreen;
            },
            hero_toggle_pause() {
                const hero = this.$refs.hero;
                if (hero && hero.toggle_pause) {
                    hero.toggle_pause();
                }
            },
            hero_toggle_mute() {
                const hero = this.$refs.hero;
                if (hero && hero.toggle_mute) {
                    hero.toggle_mute();
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
.hero, .swiper, .slide { width: 100%; }
.slide { display: block; }
.indicator { position: absolute; z-index: 2; display: flex; align-items: center; gap: 8rpx; pointer-events: none; }
.video-ctrl-layer {
    position: absolute;
    right: 16rpx;
    bottom: 100rpx;
    z-index: 6;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
}
.video-ctrl-layer .horn-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    line-height: 1;
    color: #fff;
    box-sizing: border-box;
}
.video-ctrl-layer .horn-icon {
    color: #fff;
    text-align: center;
    overflow: hidden;
}
.video-ctrl-layer .horn-img {
    display: block;
}
.indicator.is-center-bottom, .indicator.is-bottom-center { left: 0; right: 0; bottom: 0; justify-content: center; }
.media-switch { display: flex; flex-direction: row; align-items: center; box-sizing: border-box; pointer-events: auto; }
.media-item { box-sizing: border-box; text-align: center; pointer-events: auto; }
.indicator .num, .indicator .dot, .indicator .line { pointer-events: auto; }
.indicator.is-left-bottom, .indicator.is-bottom-left { left: 0; bottom: 0; }
.indicator.is-right-bottom, .indicator.is-bottom-right { right: 0; bottom: 0; }
.indicator.is-center-top, .indicator.is-top-center { left: 0; right: 0; top: 0; justify-content: center; }
.indicator.is-left-top, .indicator.is-top-left { left: 0; top: 0; }
.indicator.is-right-top, .indicator.is-top-right { right: 0; top: 0; }
.dot { width: 12rpx; height: 12rpx; border-radius: 50%; }
.indicator.is-line { left: auto; right: auto; top: auto; bottom: auto; gap: 0; }
.line { width: 28rpx; height: 6rpx; border-radius: 6rpx; }
</style>
