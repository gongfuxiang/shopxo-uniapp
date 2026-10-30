<template>
    <view class="hero-media">
        <swiper class="swiper" :style="box_style" :current="current" :circular="loop" :autoplay="auto" :interval="interval_ms" :vertical="vertical" :duration="duration_ms" @change="on_change">
            <swiper-item v-if="video">
                <view class="slide-box" :id="box_id" :style="box_style">
                    <image v-if="poster" class="slide" :src="poster" mode="aspectFill" :style="box_style"></image>
                    <video
                        v-if="playing"
                        :id="video_id"
                        class="video"
                        :style="video_style"
                        :src="video"
                        :poster="poster"
                        autoplay
                        playsinline
                        webkit-playsinline
                        object-fit="contain"
                        :muted="muted"
                        :controls="false"
                        :show-progress="false"
                        :show-bottom-progress="false"
                        :show-play-btn="false"
                        :show-fullscreen-btn="false"
                        :show-center-play-btn="false"
                        :show-mute-btn="false"
                        :enable-progress-gesture="false"
                        @tap="enter_full"
                        @timeupdate="on_time"
                        @fullscreenchange="on_full"
                        @ended="on_ended"
                    >
                        <!-- 小程序等原生 video 上必须用 cover-view；H5 由外层更高层级控件承接，避免被指示器挡住 -->
                        <!-- #ifndef H5 -->
                        <cover-view v-if="!fullscreen" class="inline-ctrls">
                            <cover-view class="horn-btn" :style="btn_style" @tap.stop="toggle_pause">
                                <cover-image v-if="pause_img" class="horn-img" :src="pause_img" :style="img_style"></cover-image>
                                <cover-view v-else class="horn-icon" :class="pause_icon_class" :style="icon_style">{{ pause_text }}</cover-view>
                            </cover-view>
                            <cover-view class="horn-btn" :style="btn_style + gap_style" @tap.stop="toggle_mute">
                                <cover-image v-if="mute_img" class="horn-img" :src="mute_img" :style="img_style"></cover-image>
                                <cover-view v-else class="horn-icon" :class="mute_icon_class" :style="icon_style">{{ mute_text }}</cover-view>
                            </cover-view>
                        </cover-view>
                        <!-- #endif -->
                        <block v-if="fullscreen">
                            <cover-view class="fs-close" @tap.stop="exit_full">×</cover-view>
                            <cover-view class="fs-bar">
                                <cover-view class="horn-btn" :style="btn_style" @tap.stop="toggle_pause">
                                    <cover-image v-if="pause_img" class="horn-img" :src="pause_img" :style="img_style"></cover-image>
                                    <cover-view v-else class="horn-icon" :class="pause_icon_class" :style="icon_style">{{ pause_text }}</cover-view>
                                </cover-view>
                                <cover-view class="fs-time">{{ time_text }}</cover-view>
                                <cover-view class="fs-track" @tap.stop="seek_event">
                                    <cover-view class="fs-track-bg">
                                        <cover-view class="fs-fill" :style="'width:' + progress_percent + '%;'"></cover-view>
                                    </cover-view>
                                </cover-view>
                                <cover-view class="horn-btn" :style="btn_style" @tap.stop="toggle_mute">
                                    <cover-image v-if="mute_img" class="horn-img" :src="mute_img" :style="img_style"></cover-image>
                                    <cover-view v-else class="horn-icon" :class="mute_icon_class" :style="icon_style">{{ mute_text }}</cover-view>
                                </cover-view>
                            </cover-view>
                        </block>
                    </video>
                    <view v-else class="play" @tap.stop="play">
                        <view class="play-circle"><view class="play-tri"></view></view>
                    </view>
                </view>
            </swiper-item>
            <swiper-item v-for="(img, index) in photos" :key="index">
                <image class="slide" :src="img" mode="aspectFill" :style="box_style" :data-index="index" @tap="photo_tap"></image>
            </swiper-item>
        </swiper>
    </view>
</template>
<script>
    export default {
        props: {
            photos: { type: Array, default: () => [] },
            video: { type: String, default: '' },
            /** DIY/主图封面，空则再退回相册首图 */
            videoPoster: { type: String, default: '' },
            height: { type: String, default: '375px' },
            vertical: { type: Boolean, default: false },
            switchBottom: { type: String, default: '24rpx' },
            propKey: { type: [String, Number], default: '' },
            ctrlIcons: { type: Object, default: () => ({}) },
            ctrlStyle: { type: Object, default: () => ({}) },
            /** 自动轮播开关 */
            isRoll: { type: Boolean, default: true },
            /** 间隔秒数 */
            intervalTime: { type: [Number, String], default: 3 },
            /** 切换动画毫秒 */
            scrollDuration: { type: [Number, String], default: 400 },
        },
        data() {
            return {
                current: 0,
                playing: false,
                paused: false,
                muted: false,
                fullscreen: false,
                current_time: 0,
                duration: 0,
                default_speaker: '\ue7ef',
                default_mute: '\ue7e0',
                default_play: '▶',
                default_pause: '❚❚',
            };
        },
        computed: {
            box_style() {
                return 'height:' + this.height + ';';
            },
            video_style() {
                if (this.fullscreen) {
                    return 'width:100%;height:100%;';
                }
                return 'width:100%;height:' + this.height + ';';
            },
            poster() {
                if (this.videoPoster) {
                    return this.videoPoster;
                }
                return this.photos.length ? this.photos[0] : '';
            },
            slide_total() {
                return this.photos.length + (this.video ? 1 : 0);
            },
            loop() {
                return this.slide_total > 1;
            },
            auto() {
                // 有视频也可自动轮播；正在播视频时暂停，避免和播放冲突
                return this.isRoll && this.slide_total > 1 && !this.playing;
            },
            interval_ms() {
                const n = Number(this.intervalTime);
                const sec = Number.isFinite(n) && n > 0 ? n : 3;
                return Math.round(sec * 1000);
            },
            duration_ms() {
                const n = Number(this.scrollDuration);
                return Number.isFinite(n) && n > 0 ? Math.round(n) : 400;
            },
            video_id() {
                return 'goods-hero-video-' + String(this.propKey || '0');
            },
            box_id() {
                return 'goods-hero-box-' + String(this.propKey || '0');
            },
            progress_percent() {
                if (!this.duration) {
                    return 0;
                }
                const n = Math.round((this.current_time / this.duration) * 100);
                if (n < 0) {
                    return 0;
                }
                return n > 100 ? 100 : n;
            },
            time_text() {
                return this.format_time(this.current_time) + ' / ' + this.format_time(this.duration);
            },
            btn_style() {
                return (this.ctrlStyle && this.ctrlStyle.btn) || '';
            },
            icon_style() {
                return (this.ctrlStyle && this.ctrlStyle.icon) || '';
            },
            img_style() {
                return (this.ctrlStyle && this.ctrlStyle.img) || '';
            },
            gap_style() {
                return (this.ctrlStyle && this.ctrlStyle.gap) || 'margin-top:16rpx;';
            },
            pause_img() {
                const icons = this.ctrlIcons || {};
                const item = this.paused ? icons.play : icons.pause;
                return (item && item.img) || '';
            },
            mute_img() {
                const icons = this.ctrlIcons || {};
                const item = this.muted ? icons.mute : icons.sound;
                return (item && item.img) || '';
            },
            pause_icon_class() {
                const icons = this.ctrlIcons || {};
                const item = this.paused ? icons.play : icons.pause;
                const name = item && item.icon ? String(item.icon) : '';
                if (!name) {
                    return '';
                }
                return 'iconfont ' + (name.indexOf('icon-') === 0 ? name : 'icon-' + name);
            },
            mute_icon_class() {
                const icons = this.ctrlIcons || {};
                const item = this.muted ? icons.mute : icons.sound;
                const name = item && item.icon ? String(item.icon) : '';
                if (!name) {
                    return 'iconfont';
                }
                return 'iconfont ' + (name.indexOf('icon-') === 0 ? name : 'icon-' + name);
            },
            pause_text() {
                const icons = this.ctrlIcons || {};
                const item = this.paused ? icons.play : icons.pause;
                if (item && item.icon) {
                    return '';
                }
                return this.paused ? this.default_play : this.default_pause;
            },
            mute_text() {
                const icons = this.ctrlIcons || {};
                const item = this.muted ? icons.mute : icons.sound;
                if (item && item.icon) {
                    return '';
                }
                return this.muted ? this.default_mute : this.default_speaker;
            },
        },
        watch: {
            video() {
                this.current = 0;
                this.stop_video();
            },
        },
        mounted() {
            // #ifdef H5
            this._on_doc_full = () => {
                const el = document.getElementById(this.box_id);
                const node = document.fullscreenElement || document.webkitFullscreenElement;
                this.fullscreen = !!(node && el && (node === el || node.contains(el) || el.contains(node)));
                this.emit_ctrl();
            };
            document.addEventListener('fullscreenchange', this._on_doc_full);
            document.addEventListener('webkitfullscreenchange', this._on_doc_full);
            // #endif
        },
        beforeDestroy() {
            // #ifdef H5
            if (this._on_doc_full) {
                document.removeEventListener('fullscreenchange', this._on_doc_full);
                document.removeEventListener('webkitfullscreenchange', this._on_doc_full);
            }
            // #endif
        },
        methods: {
            format_time(sec) {
                sec = Math.floor(Number(sec) || 0);
                const m = Math.floor(sec / 60);
                const s = sec % 60;
                const pad = (n) => (n < 10 ? '0' + n : '' + n);
                return pad(m) + ':' + pad(s);
            },
            context() {
                return uni.createVideoContext(this.video_id, this);
            },
            emit_ctrl() {
                this.$emit('ctrl', {
                    playing: this.playing,
                    paused: this.paused,
                    muted: this.muted,
                    fullscreen: this.fullscreen,
                });
            },
            play() {
                this.current_time = 0;
                this.paused = false;
                this.playing = true;
                this.emit_ctrl();
                this.$nextTick(() => this.apply_mute());
            },
            toggle_pause() {
                if (!this.playing) {
                    return;
                }
                if (this.paused) {
                    this.resume_video();
                } else {
                    this.pause_video();
                }
            },
            pause_video() {
                try {
                    this.context().pause();
                } catch (e) {}
                // #ifdef H5
                this.$nextTick(() => {
                    const el = this.video_el();
                    if (el) {
                        el.pause();
                    }
                });
                // #endif
                this.paused = true;
                this.emit_ctrl();
            },
            resume_video() {
                try {
                    this.context().play();
                } catch (e) {}
                // #ifdef H5
                this.$nextTick(() => {
                    const el = this.video_el();
                    if (el) {
                        const p = el.play();
                        if (p && p.catch) {
                            p.catch(() => {});
                        }
                    }
                });
                // #endif
                this.paused = false;
                this.emit_ctrl();
                this.apply_mute();
            },
            toggle_mute() {
                this.muted = !this.muted;
                this.emit_ctrl();
                this.apply_mute();
            },
            video_el() {
                // #ifdef H5
                let el = document.getElementById(this.video_id);
                if (el && el.tagName !== 'VIDEO') {
                    el = el.querySelector && el.querySelector('video');
                }
                return el || null;
                // #endif
                // #ifndef H5
                return null;
                // #endif
            },
            apply_mute() {
                // #ifdef H5
                this.$nextTick(() => {
                    const el = this.video_el();
                    if (el) {
                        el.muted = !!this.muted;
                        try {
                            el.volume = this.muted ? 0 : 1;
                        } catch (e) {}
                    }
                });
                // #endif
            },
            enter_full() {
                if (this.fullscreen) {
                    return;
                }
                // #ifdef H5
                let el = document.getElementById(this.box_id);
                if (!el) {
                    el = document.getElementById(this.video_id);
                }
                if (el && el.tagName === 'VIDEO' && el.parentElement) {
                    el = el.parentElement;
                }
                const req = el && (el.requestFullscreen || el.webkitRequestFullscreen);
                if (req) {
                    req.call(el);
                }
                // #endif
                // #ifndef H5
                this.context().requestFullScreen({ direction: 0 });
                // #endif
            },
            exit_full() {
                // #ifdef H5
                const exit = document.exitFullscreen || document.webkitExitFullscreen;
                if (exit && (document.fullscreenElement || document.webkitFullscreenElement)) {
                    exit.call(document);
                } else {
                    this.fullscreen = false;
                }
                // #endif
                // #ifndef H5
                this.context().exitFullScreen();
                // #endif
            },
            on_full(e) {
                const detail = (e && e.detail) || {};
                const full = detail.fullScreen != null ? detail.fullScreen : detail.fullscreen;
                this.fullscreen = !!full;
                this.emit_ctrl();
            },
            on_time(e) {
                const detail = (e && e.detail) || {};
                this.current_time = Number(detail.currentTime) || 0;
                if (detail.duration) {
                    this.duration = Number(detail.duration) || 0;
                }
            },
            on_ended() {
                this.current_time = 0;
                this.paused = false;
                if (this.fullscreen) {
                    this.exit_full();
                }
                this.fullscreen = false;
                this.playing = false;
                this.emit_ctrl();
            },
            seek_event(e) {
                let x = 0;
                const touch = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]);
                if (touch && (touch.clientX || touch.clientX === 0)) {
                    x = touch.clientX;
                } else if (e.detail && (e.detail.x || e.detail.x === 0)) {
                    x = e.detail.x;
                } else if (e.clientX || e.clientX === 0) {
                    x = e.clientX;
                }
                const query = uni.createSelectorQuery().in(this);
                query.select('.fs-track').boundingClientRect((rect) => {
                    if (!rect || !rect.width || !this.duration) {
                        return;
                    }
                    let ratio = (x - rect.left) / rect.width;
                    if (ratio < 0) {
                        ratio = 0;
                    }
                    if (ratio > 1) {
                        ratio = 1;
                    }
                    this.context().seek(ratio * this.duration);
                    this.current_time = ratio * this.duration;
                }).exec();
            },
            stop_video() {
                if (!this.playing && !this.fullscreen) {
                    return;
                }
                if (this.fullscreen) {
                    this.exit_full();
                }
                try {
                    this.context().pause();
                } catch (e) {}
                this.playing = false;
                this.paused = false;
                this.fullscreen = false;
                this.current_time = 0;
                this.emit_ctrl();
            },
            on_change(e) {
                const index = (e.detail && e.detail.current) || 0;
                this.current = index;
                if (index !== 0) {
                    this.stop_video();
                }
                this.$emit('change', index);
            },
            jump(index) {
                if (this.current === index) {
                    return;
                }
                this.stop_video();
                this.current = index;
                this.$emit('change', index);
            },
            photo_tap(e) {
                const index = (e.currentTarget.dataset && e.currentTarget.dataset.index) || 0;
                this.$emit('preview', index);
            },
        },
    };
</script>
<style lang="scss" scoped>
.hero-media, .swiper, .slide, .slide-box { width: 100%; }
.slide { display: block; }
.slide-box { position: relative; overflow: hidden; background: #000; }
.video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
}
.play {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.play-circle {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
}
.play-tri {
    width: 0;
    height: 0;
    margin-left: 6rpx;
    border-style: solid;
    border-width: 16rpx 0 16rpx 26rpx;
    border-color: transparent transparent transparent #fff;
}
.horn-btn {
    border-radius: 28rpx;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 32rpx;
    line-height: 1;
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.horn-icon {
    color: #fff;
    font-size: 32rpx;
    line-height: 1;
    text-align: center;
}
.horn-img {
    width: 32rpx;
    height: 32rpx;
    display: block;
}
.inline-ctrls {
    position: absolute;
    right: 16rpx;
    bottom: 100rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.fs-close {
    position: absolute;
    top: 48rpx;
    right: 24rpx;
    width: 64rpx;
    height: 64rpx;
    border-radius: 32rpx;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 44rpx;
    line-height: 60rpx;
    text-align: center;
}
.fs-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 48rpx;
    height: 72rpx;
    padding: 0 24rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.fs-bar .horn-btn {
    margin-right: 12rpx;
}
.fs-time {
    width: 170rpx;
    color: #fff;
    font-size: 22rpx;
    line-height: 32rpx;
}
.fs-track {
    flex: 1;
    height: 36rpx;
    margin: 0 16rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.fs-track-bg {
    width: 100%;
    height: 6rpx;
    border-radius: 6rpx;
    background: rgba(255, 255, 255, 0.35);
    overflow: hidden;
}
.fs-fill {
    height: 6rpx;
    background: #fff;
}
</style>
