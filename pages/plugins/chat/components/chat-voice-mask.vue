<template>
	<view
		class="voice-record-mask"
		:class="{ 'is-cancel': willCancel }"
		@touchstart.stop.prevent="emit_start"
		@touchmove.stop.prevent="emit_move"
		@touchend.stop.prevent="emit_end"
		@touchcancel.stop.prevent="emit_end"
		@pointerdown.stop.prevent="emit_start"
		@pointermove.stop.prevent="emit_move"
		@pointerup.stop.prevent="emit_end"
		@pointercancel.stop.prevent="emit_end"
	>
		<view class="voice-record-bubble-wrap">
			<view class="voice-record-bubble">
				<view class="voice-record-wave">
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
					<view class="voice-record-bar"></view>
				</view>
			</view>
			<view class="voice-record-arrow"></view>
		</view>
		<view class="voice-cancel-btn" :class="{ 'is-active': willCancel }"></view>
		<view class="voice-cancel-label">
			<text class="voice-cancel-btn-text">{{ willCancel ? '松开取消' : '取消' }}</text>
		</view>
		<view class="voice-send-arc">
			<text class="voice-send-arc-text">松开 发送</text>
		</view>
	</view>
</template>

<script>
	export default {
		options: { virtualHost: true, styleIsolation: 'shared' },
		props: { willCancel: { type: Boolean, default: false } },
		methods: {
			emit_start(e) { this.$emit('start', e); },
			emit_move(e) { this.$emit('move', e); },
			emit_end(e) { this.$emit('end', e); },
		},
	};
</script>

<style lang="scss" scoped>
.voice-record-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 1200;
	pointer-events: auto;
	background: rgba(0, 0, 0, 0.5);
	overflow: hidden;
}

.voice-record-bubble-wrap {
	position: absolute;
	left: 50%;
	top: 34%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
}

.voice-record-bubble {
	width: 280rpx;
	height: 132rpx;
	border-radius: 18rpx;
	background: #95ec69;
	display: flex;
	align-items: center;
	justify-content: center;
}

.voice-record-mask.is-cancel .voice-record-bubble {
	background: #fa5151;
}

.voice-record-arrow {
	width: 0;
	height: 0;
	border-left: 14rpx solid transparent;
	border-right: 14rpx solid transparent;
	border-top: 16rpx solid #95ec69;
}

.voice-record-mask.is-cancel .voice-record-arrow {
	border-top-color: #fa5151;
}

.voice-record-wave {
	height: 36rpx;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.voice-record-bar {
	width: 4rpx;
	margin: 0 4rpx;
	border-radius: 4rpx;
	background: #2f3d28;
	animation: voice-record-wave 0.8s ease-in-out infinite;
}

.voice-record-mask.is-cancel .voice-record-bar {
	background: #fff;
}

.voice-record-bar:nth-child(1) {
	height: 10rpx;
	animation-delay: 0s;
}

.voice-record-bar:nth-child(2) {
	height: 20rpx;
	animation-delay: 0.05s;
}

.voice-record-bar:nth-child(3) {
	height: 30rpx;
	animation-delay: 0.1s;
}

.voice-record-bar:nth-child(4) {
	height: 16rpx;
	animation-delay: 0.15s;
}

.voice-record-bar:nth-child(5) {
	height: 26rpx;
	animation-delay: 0.2s;
}

.voice-record-bar:nth-child(6) {
	height: 12rpx;
	animation-delay: 0.25s;
}

.voice-record-bar:nth-child(7) {
	height: 32rpx;
	animation-delay: 0.3s;
}

.voice-record-bar:nth-child(8) {
	height: 18rpx;
	animation-delay: 0.35s;
}

.voice-record-bar:nth-child(9) {
	height: 24rpx;
	animation-delay: 0.4s;
}

.voice-record-bar:nth-child(10) {
	height: 12rpx;
	animation-delay: 0.45s;
}

.voice-record-bar:nth-child(11) {
	height: 22rpx;
	animation-delay: 0.5s;
}

.voice-record-bar:nth-child(12) {
	height: 14rpx;
	animation-delay: 0.55s;
}

@keyframes voice-record-wave {
	0%,
	100% {
		transform: scaleY(0.55);
	}
	50% {
		transform: scaleY(1);
	}
}

/* 与「松开 发送」同心的细环带，中间留缝；取消文字居中叠在环带上 */
.voice-cancel-btn {
	position: absolute;
	left: 50%;
	bottom: -1440rpx;
	z-index: 1;
	width: 1780rpx;
	height: 1780rpx;
	margin-left: -890rpx;
	border-radius: 50%;
	background: transparent;
	border: 112rpx solid rgba(48, 48, 48, 0.62);
	box-sizing: border-box;
}

.voice-cancel-btn.is-active {
	border-color: #fa5151;
}

.voice-cancel-label {
	position: absolute;
	left: 50%;
	bottom: 228rpx;
	z-index: 3;
	height: 112rpx;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
}

.voice-cancel-btn-text {
	font-size: 28rpx;
	color: #fff;
	line-height: 1;
	white-space: nowrap;
}

.voice-send-arc {
	position: absolute;
	left: 50%;
	bottom: -1300rpx;
	z-index: 2;
	width: 1500rpx;
	height: 1500rpx;
	margin-left: -750rpx;
	border-radius: 50%;
	background: #ebebeb;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding-top: 48rpx;
	box-sizing: border-box;
}

.voice-record-mask.is-cancel .voice-send-arc {
	background: #e0e0e0;
}

.voice-send-arc-text {
	font-size: 28rpx;
	color: #111;
	line-height: 1;
	letter-spacing: 2rpx;
}
</style>
