<template>
	<view class="video-fs-mask">
		<view class="video-fs-head" :style="{ height: headHeight + 'px' }">
			<view
				class="video-fs-close"
				:style="{ top: (statusBarHeight + 12) + 'px' }"
				@tap.stop="emit_close"
			>
				<iconfont name="icon-close-line" size="28rpx" color="#ffffff"></iconfont>
			</view>
		</view>
		<video
			id="chat-fs-video"
			class="video-fs-player"
			:style="playerStyle"
			:src="videoUrl"
			:poster="poster"
			autoplay
			controls
			object-fit="contain"
			preload="auto"
			:http-cache="true"
			play-strategy="0"
			:show-center-play-btn="false"
			:show-fullscreen-btn="false"
			:enable-progress-gesture="true"
			@loadedmetadata="emit_ready"
			@canplay="emit_ready"
			@play="emit_play"
			@timeupdate="emit_timeupdate"
			@error="emit_error"
		></video>
		<!-- #ifdef H5 -->
		<view v-if="loading" class="video-fs-loading" :style="{ top: (headHeight + 80) + 'px' }">
			<view class="video-fs-loading-spin"></view>
			<text class="video-fs-loading-text">加载中</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		options: { virtualHost: true, styleIsolation: 'shared' },
		props: {
			videoUrl: { type: String, default: '' },
			poster: { type: String, default: '' },
			headHeight: { type: Number, default: 0 },
			statusBarHeight: { type: Number, default: 0 },
			playerStyle: { type: Object, default: () => ({}) },
			loading: { type: Boolean, default: false },
		},
		methods: {
			emit_close(e) { this.$emit('close', e); },
			emit_ready(e) { this.$emit('ready', e); },
			emit_play(e) { this.$emit('play', e); },
			emit_timeupdate(e) { this.$emit('timeupdate', e); },
			emit_error(e) { this.$emit('error', e); },
			get_video_ctx() {
				if (!this._video_ctx) {
					try {
						this._video_ctx = uni.createVideoContext('chat-fs-video', this);
					} catch (e) {
						this._video_ctx = null;
					}
				}
				return this._video_ctx;
			},
			play_video() {
				try {
					const ctx = this.get_video_ctx();
					if (ctx && typeof ctx.play === 'function') {
						ctx.play();
					}
				} catch (e) {}
			},
			stop_video() {
				try {
					const ctx = this.get_video_ctx();
					if (!ctx) {
						return;
					}
					if (typeof ctx.pause === 'function') {
						ctx.pause();
					}
					if (typeof ctx.stop === 'function') {
						ctx.stop();
					}
				} catch (e) {}
				this._video_ctx = null;
			},
		},
		beforeDestroy() {
			this._video_ctx = null;
		},
	};
</script>

<style scoped>
@import './chat-video-popup.css';
</style>
