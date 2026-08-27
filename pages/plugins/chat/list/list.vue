<template>
	<view :class="theme_view + ' chat-list-page'">
		<view class="chat-list-nav" :style="list_nav_style">
			<view class="chat-list-nav-bar" :style="{ height: nav_content_h + 'px' }">
				<view class="chat-list-nav-back" @tap.stop="list_back_event">
					<iconfont name="icon-angle-left" size="36rpx" color="#191919"></iconfont>
				</view>
				<text class="chat-list-nav-title">在线客服</text>
				<view class="chat-list-nav-side"></view>
			</view>
		</view>

		<view class="chat-list-main" :style="list_main_style">
			<view v-if="show_list_loading" class="chat-list-loading" :style="list_body_style">
				<component-no-data :propStatus="1" propLoadingLogoTop="280rpx"></component-no-data>
			</view>
			<view v-else class="chat-list-body" :style="list_body_style">
				<view class="chat-list-search">
					<view class="chat-list-search-inner">
						<iconfont name="icon-search" size="32rpx" color="#999"></iconfont>
						<input
							class="chat-list-search-input"
							type="text"
							confirm-type="search"
							:value="list_keyword_input"
							placeholder="搜索联系人或聊天记录"
							placeholder-class="chat-list-search-placeholder"
							@input="list_search_input_event"
							@confirm="list_search_confirm_event"
						/>
						<view
							v-if="!isEmpty(list_keyword_input)"
							class="chat-list-search-clear"
							@tap.stop="list_search_clear_event"
						>
							<iconfont name="icon-close-line" size="28rpx" color="#bbb"></iconfont>
						</view>
					</view>
				</view>
				<scroll-view class="chat-list-scroll" scroll-y>
					<component-no-data
						v-if="filtered_list.length == 0"
						:propStatus="0"
						:propMsg="list_empty_text"
					></component-no-data>
					<view
						v-for="(item, index) in filtered_list"
						:key="'chat-list-' + item.id"
						class="chat-list-item"
						:data-index="index"
						@tap="open_chat_event"
					>
						<view class="chat-list-avatar-wrap">
							<image class="chat-list-avatar" :src="item.avatar || default_avatar" mode="aspectFill"></image>
							<view v-if="unread_text(item)" class="chat-list-badge">{{ unread_text(item) }}</view>
						</view>
						<view class="chat-list-body-main">
							<view class="chat-list-row">
								<text class="chat-list-name">{{ item.name || '在线客服' }}</text>
								<text v-if="item.time_text" class="chat-list-time">{{ item.time_text }}</text>
							</view>
							<view class="chat-list-row">
								<text class="chat-list-preview">{{ preview_text(item) }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<component-common ref="common"></component-common>
	</view>
</template>

<script>
	const app = getApp();
	import componentCommon from '@/components/common/common';
	import componentNoData from '@/components/no-data/no-data';
	import chatListMixin from '../common/chat-list-mixin.js';

	export default {
		mixins: [chatListMixin],
		components: {
			componentCommon,
			componentNoData,
		},
		data() {
			return {
				theme_view: app.globalData.get_theme_value_view(),
				default_avatar: app.globalData.data.default_user_head_src,
			};
		},
		onLoad(params) {
			params = app.globalData.launch_params_handle(params);
			app.globalData.page_event_onload_handle(params);
			this.chat_list_on_load(params);
		},
		onShow() {
			app.globalData.page_event_onshow_handle && app.globalData.page_event_onshow_handle();
			this.$refs.common && this.$refs.common.on_show && this.$refs.common.on_show();
			this.chat_list_on_show();
		},
		onHide() {
			this.chat_list_on_hide();
		},
		onUnload() {
			this.chat_list_on_unload();
		},
	};
</script>

<style>
@import './list.css';
</style>
