<template>
	<!-- #ifdef MP-WEIXIN -->
	<view
		class="voice-record-mask"
		:class="{ 'is-cancel': willCancel }"
		@touchstart="emit_start"
		@touchmove="emit_move"
		@touchend="emit_end"
		@touchcancel="emit_end"
	>
	<!-- #endif -->
	<!-- #ifndef MP-WEIXIN -->
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
	<!-- #endif -->
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
			measure_zones() {
				return new Promise((resolve) => {
					try {
						const query = uni.createSelectorQuery().in(this);
						const result = { cancel: null, send: null };
						query.select('.voice-cancel-btn').boundingClientRect((rect) => {
							if (rect && rect.width > 0) {
								result.cancel = rect;
							}
						});
						query.select('.voice-send-arc').boundingClientRect((rect) => {
							if (rect && rect.width > 0) {
								result.send = rect;
							}
						});
						query.exec(() => resolve(result));
					} catch (e) {
						resolve({ cancel: null, send: null });
					}
				});
			},
		},
	};
</script>

<style scoped>
@import './chat-voice-mask.css';
</style>
