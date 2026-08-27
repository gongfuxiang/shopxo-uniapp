<template>
	<view class="msg-menu-mask" @tap="emit_close">
		<view
			class="msg-menu"
			:class="[
				menu.is_self ? 'is-self' : 'is-other',
				menu.placement == 'bottom' ? 'is-placement-bottom' : 'is-placement-top',
			]"
			:style="menuStyle"
			@tap.stop
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
			emit_close(e) { this.$emit('close', e); },
			emit_copy(e) { this.$emit('copy', e); },
			emit_quote(e) { this.$emit('quote', e); },
			emit_recall(e) { this.$emit('recall', e); },
		},
	};
</script>

<style lang="scss" scoped>
/* 长按消息菜单（对齐微信深色操作条） */
.msg-menu-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 120;
	background: transparent;
}

.msg-menu {
	position: fixed;
	width: 360rpx;
	padding: 20rpx 12rpx 16rpx;
	border-radius: 16rpx;
	background: #4c4c4c;
	box-sizing: border-box;
	box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.28);
	z-index: 121;
	/* top/left 由内联样式指定，transform 把菜单整体放到气泡上方并水平居中 */
}

.msg-menu-actions {
	display: flex;
	align-items: stretch;
	justify-content: space-around;
}

.msg-menu-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 4rpx 8rpx 12rpx;
}

.msg-menu-icon {
	width: 40rpx;
	height: 40rpx;
	margin-bottom: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.msg-menu-label {
	font-size: 22rpx;
	color: #fff;
	line-height: 1.2;
}

.msg-menu-time {
	margin-top: 4rpx;
	padding-top: 14rpx;
	border-top: 1rpx solid rgba(255, 255, 255, 0.14);
	text-align: center;
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.72);
	line-height: 1.4;
}

.msg-menu-arrow {
	position: absolute;
	left: 50%;
	width: 16rpx;
	height: 16rpx;
	margin-left: -8rpx;
	background: inherit;
	transform: rotate(45deg);
	border-radius: 2rpx;
	z-index: 0;
}

/* 默认：菜单在内容上方，三角朝下（叠进菜单，避免接缝） */
.msg-menu.is-placement-top .msg-menu-arrow {
	bottom: -6rpx;
}

/* 菜单在内容下方，三角朝上 */
.msg-menu.is-placement-bottom .msg-menu-arrow {
	top: -6rpx;
	bottom: auto;
}
</style>
