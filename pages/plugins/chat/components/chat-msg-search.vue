<template>
	<!-- #ifdef MP-WEIXIN -->
	<view class="msg-search-mask" @tap.stop="emit_prevent" @touchmove.stop="emit_prevent">
		<view class="msg-search-mask-hd" @touchmove.stop="emit_prevent">
	<!-- #endif -->
	<!-- #ifndef MP-WEIXIN -->
	<view class="msg-search-mask" @tap.stop="emit_prevent" @touchmove.stop.prevent="emit_prevent">
		<view class="msg-search-mask-hd" @touchmove.stop.prevent="emit_prevent">
	<!-- #endif -->
			<view class="msg-search-status-bar" :style="navStatusBarStyle"></view>
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
				:key="hit_idx"
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
							:key="seg_idx"
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
			navStatusBarStyle: { type: String, default: '' },
			navBarStyle: { type: String, default: '' },
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

<style scoped>
@import './chat-msg-search.css';
</style>
