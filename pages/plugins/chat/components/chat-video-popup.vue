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
			:src="src"
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
			src: { type: String, default: '' },
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
		},
	};
</script>

<style lang="scss" scoped>
.video-fs-mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	background: #000;
}

.video-fs-head {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	z-index: 3;
	background: #000;
}

.video-fs-close {
	position: absolute;
	left: 24rpx;
	width: 64rpx;
	height: 64rpx;
	min-width: 64rpx;
	min-height: 64rpx;
	padding: 0;
	margin: 0;
	border: 0;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	overflow: hidden;
	flex-shrink: 0;
}

.video-fs-close ::v-deep .icon-font {
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.video-fs-player {
	background: #000;
}

.video-fs-loading {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	pointer-events: none;
}

.video-fs-loading-spin {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.25);
	border-top-color: #fff;
	box-sizing: border-box;
	animation: video-fs-spin 0.8s linear infinite;
}

@keyframes video-fs-spin {
	to {
		transform: rotate(360deg);
	}
}

.video-fs-loading-text {
	margin-top: 16rpx;
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.85);
	line-height: 1.2;
}

</style>
