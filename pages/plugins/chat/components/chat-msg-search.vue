<template>
	<view class="msg-search-mask" @tap.stop @touchmove.stop.prevent="emit_prevent">
		<view class="msg-search-mask-hd" :style="navWrapStyle" @touchmove.stop.prevent="emit_prevent">
			<view class="msg-search-mask-bar" :style="navBarStyle">
				<view class="msg-search-input-wrap">
					<iconfont name="icon-search" size="32rpx" color="#999"></iconfont>
					<input
						class="msg-search-input"
						type="text"
						confirm-type="search"
						:focus="focus"
						:value="keyword"
						placeholder="搜索聊天记录"
						@input="emit_input"
						@confirm="emit_confirm"
					/>
					<view
						v-if="!isEmpty(keyword)"
						class="msg-search-clear"
						@tap.stop="emit_clear"
					>
						<iconfont name="icon-close-round" size="32rpx" color="#c0c0c0"></iconfont>
					</view>
				</view>
				<text class="msg-search-cancel" @tap="emit_close">取消</text>
			</view>
		</view>
		<scroll-view class="msg-search-list" scroll-y :style="{ height: listHeight + 'px' }" @touchmove.stop="emit_prevent">
			<view v-if="loading && hits.length === 0" class="msg-search-empty">搜索中...</view>
			<view v-else-if="isEmpty(keyword)" class="msg-search-empty">输入关键词搜索聊天记录</view>
			<component-no-data
				v-else-if="hits.length === 0"
				:propStatus="0"
				propMsg="无匹配消息"
			></component-no-data>
			<view
				v-for="(hit, hit_idx) in hits"
				:key="'hit-' + (hit.id || hit_idx)"
				class="msg-search-item"
				:data-id="hit.id"
				:data-index="hit_idx"
				@tap.stop="emit_hit"
			>
				<image class="msg-search-avatar" :src="hit.avatar || defaultAvatar" mode="aspectFill"></image>
				<view class="msg-search-main">
					<view class="msg-search-meta">
						<text class="msg-search-name">{{ hit.name || '' }}</text>
						<text class="msg-search-time">{{ hit.time || '' }}</text>
					</view>
					<view class="msg-search-text">
						<text
							v-for="(seg, seg_idx) in hit.segments"
							:key="'hs-' + hit_idx + '-' + seg_idx"
							:class="{ 'is-hit': seg.hit }"
						>{{ seg.text }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { isEmpty } from '../common/chat-host.js';
	import componentNoData from '@/components/no-data/no-data.vue';
	export default {
		options: { virtualHost: true, styleIsolation: 'shared' },
		components: {
			componentNoData,
		},
		props: {
			keyword: { type: String, default: '' },
			focus: { type: Boolean, default: false },
			loading: { type: Boolean, default: false },
			hits: { type: Array, default: () => [] },
			listHeight: { type: Number, default: 0 },
			navWrapStyle: { type: Object, default: () => ({}) },
			navBarStyle: { type: Object, default: () => ({}) },
			defaultAvatar: { type: String, default: '' },
		},
		methods: {
			isEmpty,
			emit_input(e) { this.$emit('input', e); },
			emit_confirm(e) { this.$emit('confirm', e); },
			emit_clear(e) { this.$emit('clear', e); },
			emit_close(e) { this.$emit('close', e); },
			emit_hit(e) { this.$emit('hit', e); },
			emit_prevent(e) { this.$emit('preventMove', e); },
		},
	};
</script>

<style lang="scss" scoped>
.msg-search-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 1100;
	background: #fff;
	display: flex;
	flex-direction: column;
}

.msg-search-mask-hd {
	flex-shrink: 0;
	background: #ededed;
	border-bottom: 1rpx solid #d6d6d6;
	box-sizing: border-box;
	/* #ifdef MP */
	padding-bottom: 12rpx;
	padding-left: 8rpx;
	/* #endif */
}

.msg-search-mask-bar {
	height: 88rpx;
	padding: 0 20rpx 0 16rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	box-sizing: border-box;
}

/* #ifdef MP */
.msg-search-mask-bar {
	padding-left: 16rpx;
	padding-right: 8rpx;
}
/* #endif */

.msg-search-input-wrap {
	flex: 1;
	min-width: 0;
	height: 64rpx;
	padding: 0 16rpx;
	border-radius: 12rpx;
	background: #fff;
	display: flex;
	align-items: center;
	gap: 10rpx;
	box-sizing: border-box;
	/* #ifdef MP */
	padding: 0 20rpx;
	/* #endif */
}

.msg-search-input {
	flex: 1;
	min-width: 0;
	height: 64rpx;
	font-size: 28rpx;
	color: #191919;
}

.msg-search-clear {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.msg-search-cancel {
	flex-shrink: 0;
	font-size: 28rpx;
	color: #576b95;
	padding: 8rpx 4rpx;
}

.msg-search-list {
	flex: 1;
	height: 0;
	min-height: 0;
	box-sizing: border-box;
}

.msg-search-empty {
	padding: 80rpx 24rpx;
	text-align: center;
	font-size: 26rpx;
	color: #999;
}

.msg-search-list :deep(.no-data-box) {
	padding: 60rpx 0 80rpx;
}

.msg-search-list :deep(.no-data-box .image) {
	width: 400rpx;
}

.msg-search-item {
	padding: 24rpx 32rpx;
	border-bottom: 1rpx solid #f5f5f5;
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 16rpx;
}

.msg-search-item:active {
	background: #f7f7f7;
}

.msg-search-avatar {
	width: 72rpx;
	height: 72rpx;
	border-radius: 8rpx;
	flex-shrink: 0;
	background: #f0f0f0;
}

.msg-search-main {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.msg-search-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
}

.msg-search-name {
	flex: 1;
	min-width: 0;
	font-size: 26rpx;
	font-weight: 500;
	color: #191919;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.msg-search-time {
	flex-shrink: 0;
	font-size: 22rpx;
	color: #999;
}

.msg-search-text {
	font-size: 28rpx;
	color: #191919;
	line-height: 1.45;
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	word-break: break-all;
}

.msg-search-text .is-hit {
	color: #f7ba2a;
	background: transparent;
}

</style>
