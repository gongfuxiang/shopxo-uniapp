<template>
	<view :class="[theme_view + ' chat-page page-chat', { 'is-msg-search': msg_search_open }]">
		<!-- 自定义导航：返回 + 标题 + 搜索；右侧避开微信胶囊 -->
		<view class="nav-wrap">
			<view class="nav-status-bar" :style="nav_status_bar_style"></view>
			<view class="nav-bar" :style="nav_bar_style">
				<view class="nav-left">
					<view class="nav-side nav-back" @tap.stop="back_event">
						<iconfont name="icon-angle-left" size="36rpx" color="#191919"></iconfont>
					</view>
					<view
						v-if="show_list_dot"
						class="nav-side nav-list-dot"
						@tap.stop="go_list_event"
					>
						<iconfont name="icon-list-dot" size="40rpx" color="#191919"></iconfont>
					</view>
				</view>
				<view class="nav-title-wrap">
					<view class="nav-avatar-wrap">
						<image class="nav-avatar" :src="receive_avatar || default_avatar" mode="aspectFill"></image>
						<view class="friend-status-dot" :class="nav_status_dot_class"></view>
					</view>
					<text class="nav-title">{{ chat_title }}</text>
				</view>
				<view class="nav-right">
					<view
						v-if="show_msg_search_btn"
						class="nav-side nav-search"
						@tap.stop="open_msg_search_event"
					>
						<iconfont name="icon-search" size="40rpx" color="#191919"></iconfont>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!isEmpty(queue_status_text)" class="header-meta queue-status-bar" :style="{ top: nav_bar_h + 'px' }">
			<text class="header-meta-v">{{ queue_status_text }}</text>
		</view>
		<view class="chat-main" :style="chat_main_style" @tap="hide_panel_event">
			<view v-if="history_loading" class="history-more">
				<view class="history-more-spin"></view>
				<text class="history-more-text">加载中</text>
			</view>
			<view class="message-list">
					<block v-for="(item, index) in message_list" :key="item.key">
						<chat-message-item
							:item="item"
							:index="index"
							:defaultAvatar="default_avatar"
							:flashRecordId="flash_record_id"
							:playingAudioKey="playing_audio_key"
							:goodsClickable="goods_clickable"
							:showReadReceipt="show_read_receipt"
							:recallNow="recall_now"
							@msgAction="on_msg_item_action"
						/>
					</block>
				</view>
				<view id="msg-bottom" class="scroll-anchor"></view>
		</view>

		<view v-if="!show_chat_loading" class="composer-fixed" :style="{ bottom: keyboard_height + 'px' }">
			<view v-if="!isEmpty(input_status_text)" class="input-status">
				<view class="input-status-text">
					<text class="input-status-tips">{{ input_status_text }}</text>
					<text v-if="!isEmpty(input_status_msg)" class="input-status-msg">{{ input_status_msg }}</text>
				</view>
			</view>
			<!-- 咨询端：结束对话在最左（与其它手机端一致），后接转人工 / 切回智能 -->
			<view v-if="show_float_ai_bar" class="ai-float-wrap">
				<view class="ai-float-bar">
					<view
						v-if="show_end_btn"
						class="ai-bar-btn"
						@tap="end_session_event"
					><text class="ai-bar-btn-text">结束对话</text></view>
					<view
						v-if="show_transfer_human_btn"
						class="ai-bar-btn"
						:class="{ 'is-disabled': ai_switching }"
						@tap="transfer_human_event"
					><text class="ai-bar-btn-text">转人工客服</text></view>
					<view
						v-if="show_back_ai_btn"
						class="ai-bar-btn"
						:class="{ 'is-disabled': ai_switching }"
						@tap="back_ai_event"
					><text class="ai-bar-btn-text">切回智能客服</text></view>
				</view>
			</view>

			<view class="footer" :class="{ 'is-keyboard': keyboard_height > 0 }">
			<!-- 微信逻辑：语音 + 输入框(右表情) + 商品选择 + 加号；引用在下一行，按钮行固定高度 flex 居中 -->
			<view class="input-bar" :class="{ 'is-locked': input_locked }">
				<view class="input-col">
					<view class="input-row">
					<view v-if="show_tool_voice" class="side-btn voice-btn" @tap="toggle_voice_event">
						<iconfont
							v-if="!is_voice_input"
							name="icon-speak"
							size="44rpx"
							color="#191919"
						></iconfont>
						<view v-else class="wx-keyboard">
							<view class="wx-keyboard-row"></view>
							<view class="wx-keyboard-row"></view>
							<view class="wx-keyboard-space"></view>
						</view>
					</view>

					<view class="input-wrap" :class="{ 'has-expand': show_input_expand && !is_voice_input, 'is-voice': is_voice_input }">
						<view v-if="show_input_expand && !is_voice_input" class="input-left-tools">
							<view
								class="input-expand-btn"
								@tap.stop="open_input_fullscreen_event"
							>
								<iconfont name="icon-enlarge" size="28rpx" color="#666"></iconfont>
							</view>
						</view>
						<textarea
							v-if="!is_voice_input"
							:key="input_view_key"
							class="msg-input"
							:focus="input_focus && !is_input_fullscreen && !input_locked"
							:disabled="input_locked"
							:auto-height="true"
							:show-confirm-bar="false"
							:adjust-position="false"
							:maxlength="2000"
							:value="input_text"
							:placeholder="input_placeholder"
							:placeholder-style="input_placeholder_style"
							placeholder-class="msg-input-placeholder"
							confirm-type="send"
							@input="input_event"
							@confirm="send_event"
							@focus="input_focus_event"
							@blur="input_blur_event"
							@linechange="input_linechange_event"
						/>
						<!-- #ifdef MP-WEIXIN -->
						<view
							v-else
							class="voice-hold-btn"
							:class="{ 'is-recording': voice_recording }"
							@touchstart="voice_press_start"
							@touchmove="voice_press_move"
							@touchend="voice_press_end"
							@touchcancel="voice_press_end"
						>{{ voice_recording ? (voice_will_cancel ? '松开取消' : '松开发送') : '按住说话' }}</view>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<view
							v-else
							class="voice-hold-btn"
							:class="{ 'is-recording': voice_recording }"
							@touchstart.stop.prevent="voice_press_start"
							@touchmove.stop.prevent="voice_press_move"
							@touchend.stop.prevent="voice_press_end"
							@touchcancel.stop.prevent="voice_press_end"
							@pointerdown.stop.prevent="voice_press_start"
							@pointermove.stop.prevent="voice_press_move"
							@pointerup.stop.prevent="voice_press_end"
							@pointercancel.stop.prevent="voice_press_end"
							@mousedown.stop.prevent="voice_press_start"
							@mouseup.stop.prevent="voice_press_end"
							@contextmenu.prevent="prevent_default_event"
						>{{ voice_recording ? (voice_will_cancel ? '松开取消' : '松开发送') : '按住说话' }}</view>
						<!-- #endif -->
						<view v-if="!is_voice_input && show_tool_emoji" class="input-emoji-btn" @tap="toggle_emoji_event">
							<iconfont
								name="icon-emoji"
								size="48rpx"
								:color="panel_type == 'emoji' ? '#07c160' : '#191919'"
							></iconfont>
						</view>
					</view>

					<view
						v-if="show_goods_panel_btn"
						class="side-btn goods-panel-btn"
						:class="{ 'is-open': consult_popup_show && consult_popup_type == 'goods' }"
						@tap="toggle_goods_panel_event"
					>
						<iconfont
							name="icon-admin-goods"
							size="44rpx"
							:color="consult_popup_show && consult_popup_type == 'goods' ? '#07c160' : '#191919'"
						></iconfont>
					</view>

					<view class="right-action" :class="{ 'is-send': can_send && !is_voice_input }">
						<view
							class="side-btn more-btn"
							:class="{ 'is-hide': can_send && !is_voice_input, 'is-open': panel_type == 'more' }"
							@tap="toggle_more_event"
						>
							<view class="more-btn-box">
								<view class="more-btn-icon" :class="{ 'is-show': panel_type != 'more' }">
									<view class="more-btn-icon-inner">
										<iconfont name="icon-add" size="22rpx" color="#111111"></iconfont>
									</view>
								</view>
								<view class="more-btn-icon" :class="{ 'is-show': panel_type == 'more' }">
									<view class="more-btn-icon-inner">
										<iconfont name="icon-close-line" size="22rpx" color="#111111"></iconfont>
									</view>
								</view>
							</view>
						</view>
						<view
							class="send-btn"
							:class="{ 'is-show': can_send && !is_voice_input }"
							@tap="send_event"
						>发送</view>
					</view>
					</view>

					<!-- 引用单独一行，不撑高按钮行 -->
					<view v-if="quote_draft" class="quote-bar">
						<view class="quote-bar-box">
							<view class="quote-bar-main">
								<image
									v-if="quote_draft.data_type == 'images' && quote_draft.url"
									class="quote-bar-thumb"
									:src="quote_draft.url"
									mode="aspectFill"
								></image>
								<text class="quote-bar-text">{{ quote_draft.name || '用户' }}：{{ quote_draft.preview || quote_draft.content || '' }}</text>
							</view>
							<view class="quote-bar-close" @tap="clear_quote_event">
								<text class="quote-bar-close-x">×</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-if="panel_type == 'emoji'" class="panel-box">
				<scroll-view class="emoji-scroll" scroll-y>
					<view v-if="recent_emoji_list.length > 0" class="emoji-section">
						<view class="emoji-section-title">最近使用</view>
						<view class="emoji-grid">
							<view
								v-for="(emoji, idx) in recent_emoji_list"
								:key="idx"
								class="emoji-item"
								:data-emoji="emoji"
								@tap="insert_emoji_event"
							>{{ emoji }}</view>
						</view>
					</view>
					<view class="emoji-section">
						<view class="emoji-section-title">所有表情</view>
						<view class="emoji-grid">
							<view
								v-for="(emoji, idx) in emoji_list"
								:key="idx"
								class="emoji-item"
								:data-emoji="emoji"
								@tap="insert_emoji_event"
							>{{ emoji }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view v-if="panel_type == 'more'" class="panel-box">
				<swiper
					class="more-swiper"
					:current="more_swiper_index"
					:indicator-dots="more_panel_pages.length > 1"
					indicator-color="rgba(0, 0, 0, 0.18)"
					indicator-active-color="#07c160"
					@change="more_swiper_change_event"
				>
					<swiper-item v-for="(page, pidx) in more_panel_pages" :key="pidx">
						<view class="more-grid">
							<view
								v-for="item in page"
								:key="item.key"
								class="more-item"
								:data-action="item.action"
								:data-type="item.type"
								@tap="more_item_tap_event"
							>
								<view class="more-icon-wrap">
									<iconfont :name="more_item_icon(item.icon)" size="52rpx" color="#666"></iconfont>
								</view>
								<text class="more-name">{{ item.name }}</text>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		</view>

		<!-- 微信式全屏输入 -->
		<view v-if="is_input_fullscreen" class="input-fs-mask">
			<view class="input-fs" :style="{ paddingTop: status_bar_height + 'px' }">
				<view class="input-fs-collapse" @tap="close_input_fullscreen_event">
					<view class="collapse-circle">
						<iconfont name="icon-arrow-bottom" size="28rpx" color="#666"></iconfont>
					</view>
				</view>
				<textarea
					class="input-fs-textarea"
					:focus="is_input_fullscreen"
					:auto-height="false"
					:show-confirm-bar="false"
					:adjust-position="false"
					:maxlength="2000"
					:value="input_text"
					:placeholder="input_placeholder"
					:placeholder-style="input_placeholder_style"
					placeholder-class="msg-input-placeholder"
					@input="input_event"
					@focus="push_input_status_event"
					@blur="input_blur_event"
				/>
				<view class="input-fs-bottom">
					<view class="input-fs-tools">
						<view v-if="show_tool_emoji" class="input-fs-tool-btn" @tap="toggle_emoji_event">
							<iconfont
								name="icon-emoji"
								size="48rpx"
								:color="panel_type == 'emoji' ? '#07c160' : '#191919'"
							></iconfont>
						</view>
					</view>
					<view v-if="can_send" class="input-fs-send" @tap="send_event">发送</view>
				</view>
				<view v-if="panel_type == 'emoji'" class="input-fs-emoji">
					<scroll-view class="emoji-scroll" scroll-y>
						<view v-if="recent_emoji_list.length > 0" class="emoji-section">
							<view class="emoji-section-title">最近使用</view>
							<view class="emoji-grid">
								<view
									v-for="(emoji, idx) in recent_emoji_list"
									:key="idx"
									class="emoji-item"
									:data-emoji="emoji"
									@tap="insert_emoji_event"
								>{{ emoji }}</view>
							</view>
						</view>
						<view class="emoji-section">
							<view class="emoji-section-title">所有表情</view>
							<view class="emoji-grid">
								<view
									v-for="(emoji, idx) in emoji_list"
									:key="idx"
									class="emoji-item"
									:data-emoji="emoji"
									@tap="insert_emoji_event"
								>{{ emoji }}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- loading 全屏盖住内容区与底部（含输入/黄色按钮），避免加载中可操作 -->
		<!-- #ifdef MP-WEIXIN -->
		<view
			v-if="show_chat_loading"
			class="ws-loading-cover"
			:style="{ top: nav_bar_h + 'px' }"
			@touchmove.stop="prevent_touch_move"
			@tap.stop="prevent_touch_move"
		>
			<component-no-data :propStatus="1" propLoadingLogoTop="280rpx"></component-no-data>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view
			v-if="show_chat_loading"
			class="ws-loading-cover"
			:style="{ top: nav_bar_h + 'px' }"
			@touchmove.stop.prevent="prevent_touch_move"
			@tap.stop="prevent_touch_move"
		>
			<component-no-data :propStatus="1" propLoadingLogoTop="280rpx"></component-no-data>
		</view>
		<!-- #endif -->

		<!-- 弹出框播放：列表不用 video；关掉后销毁，避免盖住输入栏 -->
		<chat-video-popup
			ref="chat_video_popup_ref"
			v-if="playing_video_url"
			:video-url="playing_video_url"
			:poster="playing_video_poster"
			:headHeight="video_fs_head_h"
			:statusBarHeight="status_bar_height"
			:playerStyle="video_fs_player_style"
			:loading="playing_video_loading"
			@close="close_playing_video"
			@ready="play_fs_video"
			@play="on_fs_video_play"
			@timeupdate="on_fs_video_timeupdate"
			@error="on_fs_video_error"
		/>

		<!-- 长按消息菜单：复制 / 引用 / 撤回(己方) / 发送时间 -->
		<chat-msg-menu
			v-if="msg_menu.show"
			:menu="msg_menu"
			:menuStyle="msg_menu_style"
			@close="close_msg_menu_event"
			@copy="msg_menu_copy_event"
			@quote="msg_menu_quote_event"
			@recall="msg_menu_recall_event"
		/>

		<!-- 服务评价 -->
		<view v-if="show_rating_modal" class="prompt-modal-mask" @tap="close_rating_modal_event">
			<view class="rating-popup-wrap prompt-modal rating-modal" @tap.stop="prevent_touch_move">
				<view class="rating-popup-hd">
					<text class="rating-popup-title">服务评价</text>
					<view class="rating-popup-close" @tap.stop="close_rating_modal_event">
						<iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
					</view>
				</view>
				<view class="rating-popup-body">
					<text class="rating-modal-tip">请对本次服务进行评价</text>
					<view class="rating-stars">
						<view
							v-for="n in 5"
							:key="n"
							class="rating-star"
							:data-score="n"
							@tap="select_rating_score_event"
						>
							<text class="rating-star-icon" :class="{ active: n <= rating_score }">★</text>
						</view>
					</view>
					<textarea
						class="rating-modal-input"
						:value="rating_content"
						placeholder="可选：说说您的感受"
						placeholder-class="consult-search-placeholder"
						:maxlength="200"
						@input="rating_content_input_event"
					/>
					<view
						class="rating-submit-btn"
						:class="{ 'is-disabled': rating_submitting }"
						@tap="submit_rating_event"
					>{{ rating_submitting ? '提交中...' : '提交评价' }}</view>
				</view>
			</view>
		</view>

		<!-- 加号：商品 / 购物车 / 订单 / 售后 -->
		<chat-u-popup
			ref="consult_popup_ref"
			propType="bottom"
			:propTitle="consult_popup_title"
			propCloseType="icon"
			:propTitleBorder="true"
			:propCloseable="true"
			:propRound="24"
			propBackgroundColor="#ffffff"
			propTimingFunction="linear"
			@change="on_consult_popup_change"
		>
			<view class="consult-popup-content">
				<view class="consult-search-bar">
					<view class="consult-search-keyword search-input">
						<input
							class="consult-search-input"
							type="text"
							confirm-type="search"
							:adjust-position="false"
							:value="consult_keyword_input"
							placeholder="请输入关键字搜索"
							placeholder-class="consult-search-placeholder"
							@input="consult_search_input_event"
							@confirm="consult_search_confirm_event"
						/>
					</view>
				</view>
				<view class="consult-popup-body">
				<scroll-view class="consult-list" scroll-y>
					<view class="consult-list-inner">
					<component-no-data
						v-if="consult_popup_list.length == 0"
						:propStatus="0"
						:propMsg="consult_empty_text"
					></component-no-data>
					<component-no-data
						v-else-if="consult_filtered_list.length == 0"
						:propStatus="0"
						propMsg="暂无数据"
					></component-no-data>
					<view
						v-else
						v-for="(item, idx) in consult_filtered_list"
						:key="idx"
						class="consult-item"
					>
						<view class="consult-item-main">
							<image
								class="consult-cover"
								:src="consult_row_cover(item)"
								mode="aspectFill"
							></image>
							<view class="consult-meta">
								<view class="consult-title-row">
									<text v-if="item.is_current == 1" class="consult-tag-current">当前</text>
									<view class="consult-title">
										<text class="consult-title-text">{{ consult_row_title(item) }}</text>
									</view>
								</view>
								<text v-if="consult_popup_type == 'order'" class="consult-sub">{{ order_card_head(item) }}</text>
								<text v-else-if="consult_popup_type == 'aftersale'" class="consult-sub">{{ aftersale_card_head(item) }}</text>
								<text v-else-if="consult_popup_type == 'cart' && item.spec_text" class="consult-sub">{{ item.spec_text }}</text>
								<text v-if="consult_popup_type == 'aftersale' && item.reason" class="consult-reason">申请原因：{{ item.reason }}</text>
								<text v-if="consult_row_price(item)" class="consult-price">{{ consult_row_price(item) }}</text>
							</view>
						</view>
						<view class="consult-send-btn" @tap.stop="send_consult_item_event(idx)">
							<iconfont name="icon-sending-surface" size="28rpx" color="#fff"></iconfont>
							<text class="consult-send-text">{{ consult_send_label }}</text>
						</view>
					</view>
					</view>
				</scroll-view>
				</view>
			</view>
		</chat-u-popup>

		<!-- 按住说话：松开发送 / 滑到取消松开 -->
		<chat-voice-mask
			ref="chat_voice_mask_ref"
			v-if="voice_recording"
			:willCancel="voice_will_cancel"
			@start="voice_press_start"
			@move="voice_press_move"
			@end="voice_press_end"
		/>

		<!-- 超时结束：询问是否继续聊天（进页已结束仍静默 chat-continue，不走此弹窗） -->
		<view
			v-if="show_ended_choice_modal"
			class="ended-choice-mask"
			@touchmove.stop.prevent="prevent_touch_move"
		>
			<view class="ended-choice-modal" @tap.stop="prevent_touch_move">
				<text class="ended-choice-title">温馨提示</text>
				<text class="ended-choice-content">当前对话已结束，是否继续聊天？</text>
				<view class="ended-choice-actions">
					<view class="ended-choice-btn ended-choice-cancel" @tap.stop="ended_choice_exit_event">退出</view>
					<view class="ended-choice-btn ended-choice-confirm" @tap.stop="ended_choice_continue_event">继续聊天</view>
				</view>
			</view>
		</view>

		<!-- 会话内搜索：全屏蒙层，点结果跳到对应消息 -->
		<chat-msg-search
			v-if="msg_search_open"
			:keyword="msg_search_keyword"
			:focus="msg_search_focus"
			:loading="msg_search_loading"
			:hits="msg_search_hits"
			:listHeight="msg_search_list_h"
			:navStatusBarStyle="nav_status_bar_style"
			:navBarStyle="nav_bar_style"
			:defaultAvatar="default_avatar"
			@input="msg_search_input_event"
			@confirm="msg_search_confirm_event"
			@clear="msg_search_clear_event"
			@close="close_msg_search_event"
			@hit="msg_search_hit_event"
			@preventMove="prevent_touch_move"
		/>

		<component-common ref="common"></component-common>
	</view>
</template>
<script>
	const app = getApp();
	import componentCommon from '@/components/common/common';
	import componentNoData from '@/components/no-data/no-data';
	import ChatUPopup from '../components/u-popup/u-popup.vue';
	import chatPageMixin from '../common/chat-page-mixin.js';
	import ChatMessageItem from '../components/chat-message-item.vue';
	import ChatVoiceMask from '../components/chat-voice-mask.vue';
	import ChatMsgSearch from '../components/chat-msg-search.vue';
	import ChatVideoPopup from '../components/chat-video-popup.vue';
	import ChatMsgMenu from '../components/chat-msg-menu.vue';
	import { get_chat_nav_layout_metrics } from '../common/chat-host.js';

	const chatNavInit = get_chat_nav_layout_metrics(88);

	export default {
		mixins: [chatPageMixin],
		components: {
			componentCommon,
			componentNoData,
			ChatUPopup,
			ChatMessageItem,
			ChatVoiceMask,
			ChatMsgSearch,
			ChatVideoPopup,
			ChatMsgMenu,
		},
		data() {
			return {
				theme_view: app.globalData.get_theme_value_view(),
				default_avatar: app.globalData.data.default_user_head_src,
				status_bar_height: chatNavInit.status_bar_height,
				nav_content_h: chatNavInit.nav_content_h,
				nav_occupy_h: chatNavInit.nav_occupy_h,
				nav_bar_h: chatNavInit.nav_bar_h,
				nav_right_pad: chatNavInit.nav_right_pad,
				window_height: chatNavInit.window_height,
			};
		},
		onLoad(params) {
			params = app.globalData.launch_params_handle(params);
			app.globalData.page_event_onload_handle(params);
			this.chat_page_on_load(params);
		},
		onShow() {
			app.globalData.page_event_onshow_handle && app.globalData.page_event_onshow_handle();
			this.$refs.common && this.$refs.common.on_show && this.$refs.common.on_show();
			this.chat_page_on_show();
		},
		onHide() {
			this.chat_page_on_hide();
		},
		onUnload() {
			this.chat_page_on_unload();
		},
		onReady() {
			this.chat_page_on_ready();
		},
		onPageScroll(e) {
			this.chat_page_on_scroll(e);
		},
	};
</script>

<style>
@import './index.css';
</style>
