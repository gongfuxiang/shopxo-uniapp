<template>
	<view class="msg-menu-mask" @tap="emit_close">
		<view
			class="msg-menu"
			:class="[
				menu.is_self ? 'is-self' : 'is-other',
				menu.placement == 'bottom' ? 'is-placement-bottom' : 'is-placement-top',
			]"
			:style="menuStyle"
			@tap.stop="stop_tap_event"
		>
			<view class="msg-menu-actions">
				<view class="msg-menu-item" @tap="emit_copy">
					<view class="msg-menu-icon">
						<iconfont name="icon-copy-square" size="40rpx" color="#ffffff"></iconfont>
					</view>
					<text class="msg-menu-label">复制</text>
				</view>
				<view class="msg-menu-item" @tap="emit_quote">
					<view class="msg-menu-icon">
						<iconfont name="icon-quote" size="40rpx" color="#ffffff"></iconfont>
					</view>
					<text class="msg-menu-label">引用</text>
				</view>
				<view v-if="menu.can_recall" class="msg-menu-item" @tap="emit_recall">
					<view class="msg-menu-icon">
						<iconfont name="icon-back" size="40rpx" color="#ffffff"></iconfont>
					</view>
					<text class="msg-menu-label">撤回</text>
				</view>
			</view>
			<view class="msg-menu-time">{{ menu.time_text || '时间未知' }}</view>
			<view class="msg-menu-arrow"></view>
		</view>
	</view>
</template>

<script>
	export default {
		options: { virtualHost: true, styleIsolation: 'shared' },
		props: {
			menu: { type: Object, default: () => ({}) },
			menuStyle: { type: Object, default: () => ({}) },
		},
		methods: {
			stop_tap_event() {},
			emit_close(e) { this.$emit('close', e); },
			emit_copy(e) { this.$emit('copy', e); },
			emit_quote(e) { this.$emit('quote', e); },
			emit_recall(e) { this.$emit('recall', e); },
		},
	};
</script>

<style scoped>
@import './chat-msg-menu.css';
</style>
