<template>
	<view class="chat-message-item">
				<view v-if="item.show_time" class="time-line">
					<text class="time-text">{{ item.time_text }}</text>
				</view>

				<!-- 对齐 PC message-pure：工作台初始温馨提示 -->
				<view v-if="item.is_pure" :id="'msg-' + index" class="message-pure">
					<view class="message-pure-card">
						<view class="message-pure-hd">
							<text class="message-pure-hd-icon">!</text>
							<text class="message-pure-hd-text">温馨提示</text>
						</view>
						<text class="message-pure-bd" user-select>{{ item.text }}</text>
					</view>
				</view>

				<!-- 对齐 PC ChatModeTipHtml：AI/人工切换提示 -->
				<view v-else-if="item.is_mode_tip" :id="'msg-' + index" class="message-mode-tip">
					<view class="message-mode-tip-body">
						<view class="message-mode-tip-icon">!</view>
						<text class="message-mode-tip-text">{{ item.text }}</text>
					</view>
				</view>

				<!-- 对齐 PC ChatAiSummaryHtml（2026-08-20）：坐席端系统卡片，非聊天气泡 -->
				<view v-else-if="item.is_ai_summary" :id="msg_dom_id(item, index)" class="message-ai-summary">
					<view class="message-ai-summary-card">
						<view class="message-ai-summary-hd">
							<iconfont name="icon-file" size="28rpx" color="#666"></iconfont>
							<text class="message-ai-summary-hd-text">AI接待摘要</text>
						</view>
						<text class="message-ai-summary-bd" user-select>{{ item.text }}</text>
						<text v-if="item.time_text" class="message-ai-summary-time">{{ item.time_text }}</text>
					</view>
				</view>

				<!-- 对齐 PC message-system-divider；己方文本可重新编辑 -->
				<view v-else-if="item.is_system || item.data_type == 'recall'" :id="msg_dom_id(item, index)" class="message-system-divider">
					<text class="message-system-text">{{ item.text }}</text>
					<text
						v-if="show_recall_reedit(item)"
						class="message-reedit"
						:data-index="index"
						@tap.stop="emit_reedit"
					>重新编辑</text>
				</view>

				<!-- 对齐 PC ChatAiThinkingView -->
				<view v-else-if="item.is_thinking" :id="msg_dom_id(item, index)" class="message-row is-other">
					<image class="msg-avatar" :src="item.avatar || defaultAvatar" mode="aspectFill"></image>
					<view class="bubble-wrap">
						<text class="msg-sender-name">{{ item.name || '智能客服' }}</text>
						<view class="bubble bubble-other">
							<view class="ai-thinking">
								<text class="ai-thinking-text">{{ item.text || '智能客服正在回复' }}</text>
								<view class="ai-thinking-dots">
									<view class="ai-thinking-dot"></view>
									<view class="ai-thinking-dot"></view>
									<view class="ai-thinking-dot"></view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view
					v-else
					:id="msg_dom_id(item, index)"
					class="message-row"
					:class="[
						item.is_self ? 'is-self' : 'is-other',
						flashRecordId > 0 && Number(item.record_id || 0) == flashRecordId ? 'is-quote-flash' : ''
					]"
					:data-index="index"
					@longpress="emit_quote"
					@touchstart="emit_press_start"
					@touchmove="emit_press_move"
					@touchend="emit_press_end"
					@touchcancel="emit_press_end"
					@mousedown="emit_mouse_down"
					@mouseup="emit_press_end"
					@mouseleave="emit_press_end"
					@contextmenu.prevent="emit_contextmenu"
				>
					<image class="msg-avatar" :src="item.avatar || defaultAvatar" mode="aspectFill"></image>
					<view class="bubble-wrap" :id="'msg-bubble-' + index">
						<!-- 对齐 PC message-sender-name：气泡上方显示发送方名称（双方） -->
						<text v-if="item.show_sender && item.name" class="msg-sender-name">{{ item.name }}</text>
						<view class="bubble-main" :class="item.is_self ? 'is-self' : ''">
							<view
								v-if="show_msg_send_loading"
								class="msg-send-loading"
							></view>
							<view
								v-else-if="item.is_self && item.send_status == 'fail'"
								class="msg-send-fail"
								:data-key="item.key"
								@tap.stop="emit_resend"
							>
								<iconfont name="icon-sigh" size="36rpx" color="#fa5151"></iconfont>
							</view>
							<text
								v-else-if="show_msg_read_status(item)"
								class="msg-read-status"
								:class="item.is_read == 1 ? 'is-read' : 'is-unread'"
							>{{ item.is_read == 1 ? '已读' : '未读' }}</text>
							<view
								class="bubble"
								:class="[
									item.is_self ? 'bubble-self' : 'bubble-other',
									(item.data_type == 'images' || item.data_type == 'video') ? 'is-media' : '',
									is_voice_message ? 'is-audio' : '',
									item.is_emoji_only ? 'is-emoji-only' : ''
								]"
							>
							<view
								v-if="item.data_type == 'images' || item.data_type == 'video'"
								class="media-box"
								:class="[
									item.data_type == 'video' ? 'is-video' : 'is-image',
									(item.media_ready || item.local_url || item.poster || item.url || item.file_path) ? 'is-ready' : ''
								]"
							>
								<image
									v-if="item.data_type == 'images' && (item.url || item.local_url)"
									class="bubble-image"
									:src="media_image_src"
									mode="widthFix"
									:data-url="item.url"
									:data-ready="item.media_ready ? '1' : '0'"
									@load="emit_image_load"
									@error="emit_image_error"
									@tap="emit_preview_image"
								></image>
								<!-- 视频气泡只用封面图，聊天列表不放 video，避免 App 原生组件盖住消息 -->
								<image
									v-else-if="item.data_type == 'video' && item.poster"
									class="video-poster"
									:src="item.poster"
									mode="aspectFill"
									:data-key="item.key"
									@error="emit_video_poster_error"
								></image>
								<view
									v-if="item.data_type == 'video' && (item.url || item.local_url || item.file_path)"
									class="video-cover-ui"
									:data-url="item.url || ''"
									:data-local="item.local_url || item.file_path || ''"
									:data-poster="item.poster || ''"
									@tap.stop="emit_open_video"
								>
									<view v-if="item.upload_status != 'uploading'" class="video-play">
										<iconfont name="icon-player" size="72rpx" color="#ffffff"></iconfont>
									</view>
									<text v-if="item.duration_text" class="video-duration">{{ item.duration_text }}</text>
								</view>
								<view v-if="show_media_status_mask" class="media-percent-mask">
									<view v-if="item.upload_status != 'fail'" class="media-progress" :style="media_progress_ring_style(item.upload_progress)">
										<view class="media-progress-hole">
											<text class="media-percent-text">{{ media_progress_text(item.upload_progress) }}</text>
										</view>
									</view>
									<text v-else class="media-fail-text">发送失败</text>
								</view>
							</view>
							<view
								v-else-if="item.data_type == 'goods' && item.goods"
								class="bubble-goods"
								:class="{ 'is-clickable': goodsClickable }"
								:data-json="JSON.stringify(item.goods)"
								@tap="emit_open_goods"
							>
								<image class="goods-cover" :src="item.goods.images || defaultAvatar" mode="aspectFill"></image>
								<view class="goods-meta">
									<text class="goods-title">{{ item.goods.title || '商品' }}</text>
									<text v-if="!isEmpty(item.goods.price)" class="goods-price">¥{{ item.goods.price }}</text>
								</view>
							</view>
							<!-- 对齐 PC order / aftersale 卡片 -->
							<view
								v-else-if="item.data_type == 'order' && item.order"
								class="bubble-order"
							>
								<view class="order-head">
									<text class="order-head-line">{{ order_card_meta_primary(item.order) }}</text>
									<text v-if="order_card_meta_sub(item.order)" class="order-head-sub">{{ order_card_meta_sub(item.order) }}</text>
								</view>
								<view v-if="item.order.goods_title || (item.order.items && item.order.items.length)" class="order-goods-row">
									<image
										class="order-cover"
										:src="(item.order.items && item.order.items[0] && item.order.items[0].images) || item.order.images || defaultAvatar"
										mode="aspectFill"
									></image>
									<view class="order-goods-meta">
										<text class="order-goods-title">{{ (item.order.items && item.order.items[0] && item.order.items[0].title) || item.order.goods_title || '商品' }}</text>
										<text v-if="!isEmpty(item.order.total_price)" class="order-goods-price">¥{{ item.order.total_price }}</text>
									</view>
								</view>
								<text v-if="item.order.tip" class="order-tip">{{ item.order.tip }}</text>
							</view>
							<view
								v-else-if="item.data_type == 'aftersale' && item.aftersale"
								class="bubble-order is-aftersale"
							>
								<text class="order-head">{{ aftersale_card_head(item.aftersale) }}</text>
								<view v-if="item.aftersale.goods_title || item.aftersale.images" class="order-goods-row">
									<image class="order-cover" :src="item.aftersale.images || defaultAvatar" mode="aspectFill"></image>
									<view class="order-goods-meta">
										<text class="order-goods-title">{{ item.aftersale.goods_title || '售后商品' }}</text>
										<text v-if="!isEmpty(item.aftersale.price)" class="order-goods-price">¥{{ item.aftersale.price }}</text>
									</view>
								</view>
								<text v-if="item.aftersale.tip" class="order-tip">{{ item.aftersale.tip }}</text>
							</view>
							<view
								v-else-if="item.data_type == 'audio' && is_voice_message"
								class="bubble-audio"
								:class="{ 'is-playing': playingAudioKey == item.key }"
								:style="audio_bubble_style(item)"
								:data-index="index"
								@tap.stop="emit_toggle_audio"
								@longpress.stop="emit_quote"
							>
								<view class="audio-wave">
									<view class="audio-horn-clip">
										<view class="audio-horn-c is-dot"></view>
										<view class="audio-horn-c is-r1"></view>
										<view class="audio-horn-c is-r2"></view>
									</view>
								</view>
								<text class="audio-duration">{{ item.duration_text || '0:01' }}</text>
							</view>
							<view
								v-else-if="item.data_type == 'audio'"
								class="bubble-file is-audio-file"
								:class="{ 'is-playing': playingAudioKey == item.key }"
								:data-index="index"
								@tap.stop="emit_toggle_audio"
								@longpress.stop="emit_quote"
							>
								<view class="bubble-file-icon is-audio">
									<view class="audio-bars">
										<view class="audio-bar is-1"></view>
										<view class="audio-bar is-2"></view>
										<view class="audio-bar is-3"></view>
										<view class="audio-bar is-4"></view>
									</view>
								</view>
								<view class="bubble-file-meta">
									<text class="bubble-file-name">{{ audio_file_display_name }}</text>
									<text v-if="audio_file_size_text" class="bubble-file-size">{{ audio_file_size_text }}</text>
								</view>
							</view>
							<view
								v-else-if="item.data_type == 'file' && item.file"
								class="bubble-file"
								:data-url="item.file.url || item.url"
								@tap="emit_open_file"
							>
								<text class="bubble-file-icon">文</text>
								<view class="bubble-file-meta">
									<text class="bubble-file-name">{{ item.file.name || item.text || '附件' }}</text>
									<text v-if="item.file.unit" class="bubble-file-size">{{ item.file.unit }}</text>
								</view>
							</view>
							<view v-else-if="item.goods_id > 0 && !item.goods" class="bubble-goods-loading">商品信息解析中...</view>
							<view v-else class="bubble-text-wrap" :class="{ 'is-emoji-only': item.is_emoji_only }">
								<block v-for="(seg, si) in (item.text_segments || [{ type: 'text', value: item.text }])" :key="si">
									<text
										v-if="seg.type == 'link'"
										class="bubble-link"
										user-select
										:data-url="seg.value"
										@tap.stop="emit_open_link"
									>{{ seg.value }}</text>
									<text v-else class="bubble-text" user-select>{{ seg.value }}</text>
								</block>
							</view>
						</view>
						</view>
						<!-- 引用在气泡下方，不塞进绿/白气泡里；对齐 PC：原消息撤回显示「引用内容已撤回」 -->
						<view
							v-if="item.quote"
							class="quote-block"
							:class="[
								item.is_self ? 'is-self' : 'is-other',
								is_quote_recalled(item.quote) ? 'is-recalled' : ''
							]"
							@tap.stop="emit_quote_block_tap"
						>
							<image
								v-if="!is_quote_recalled(item.quote) && item.quote.data_type == 'images' && item.quote.url"
								class="quote-thumb"
								:src="item.quote.url"
								mode="aspectFill"
							></image>
							<text v-if="is_quote_recalled(item.quote)" class="quote-text">引用内容已撤回</text>
							<text v-else class="quote-text">{{ item.quote.name || item.quote.send_name || '用户' }}：{{ item.quote.preview || item.quote.content || '' }}</text>
						</view>
					</view>
				</view>
	</view>
</template>

<script>
	import { isEmpty } from '../common/chat-host.js';
	import { is_quote_recalled } from '../common/chat-socket.js';

	const REEDIT_TTL_MS = 60 * 1000;

	export default {
		options: { virtualHost: true, styleIsolation: 'shared' },
		props: {
			item: { type: Object, default: () => ({}) },
			index: { type: Number, default: 0 },
			defaultAvatar: { type: String, default: '' },
			flashRecordId: { type: [Number, String], default: 0 },
			playingAudioKey: { type: [Number, String], default: '' },
			goodsClickable: { type: Boolean, default: false },
			showReadReceipt: { type: Boolean, default: false },
			recallNow: { type: Number, default: 0 },
		},
		computed: {
			show_msg_send_loading() {
				const item = this.item || {};
				if (!item.is_self) return false;
				if (item.send_status != 'sending' && item.upload_status != 'uploading') return false;
				if ((item.data_type == 'images' || item.data_type == 'video') && item.upload_status == 'uploading') return false;
				return true;
			},
			is_voice_message() {
				const item = this.item || {};
				return parseInt(item.is_voice || item.voice || 0) == 1;
			},
			audio_file_display_name() {
				const item = this.item || {};
				let name = (item.file && item.file.name) || item.text || '音频';
				name = String(name || '').replace(/^\[音频\]\s*/, '').replace(/^【音频】\s*/, '').trim();
				return name || '音频';
			},
			audio_file_size_text() {
				const item = this.item || {};
				return (item.file && item.file.unit) || '';
			},
			media_image_src() {
				const item = this.item || {};
				const remote = item.url || '';
				const local = item.local_url || '';
				if (Number(item.record_id || 0) > 0 || item.media_ready) return remote || local;
				return local || remote;
			},
			show_media_status_mask() {
				const item = this.item || {};
				if (!item.is_self || item.media_ready || Number(item.record_id || 0) > 0) return false;
				return item.upload_status == 'fail' || item.upload_status == 'uploading' || item.send_status == 'sending' || item.send_status == 'fail';
			},
		},
		methods: {
			isEmpty,
			is_quote_recalled,
			msg_dom_id(item, index) {
				const rid = Number(item?.record_id || 0);
				if (rid > 0) return 'msg-rid-' + rid;
				return 'msg-' + index;
			},
			to_time_ms(t) {
				const n = Number(t || 0);
				if (!(n > 0)) return 0;
				return n < 1e12 ? n * 1000 : n;
			},
			recall_at_ms(item) {
				if (!item) return 0;
				if (Number(item.recall_at || 0) > 0) return Number(item.recall_at);
				return this.to_time_ms(item.upd_time);
			},
			show_recall_reedit(item) {
				if (!item || !(item.data_type == 'recall' || item.is_system)) return false;
				if (!item.can_reedit || isEmpty(item.recall_text)) return false;
				const at = this.recall_at_ms(item);
				if (!(at > 0)) return false;
				return (this.recallNow - at) < REEDIT_TTL_MS;
			},
			show_msg_read_status(item) {
				if (!this.showReadReceipt) return false;
				if (!item || !item.is_self || item.is_system || item.is_mode_tip || item.is_pure || item.is_thinking) return false;
				if (item.data_type == 'recall') return false;
				if (item.send_status == 'fail' || item.send_status == 'sending') return false;
				return true;
			},
			order_card_head(order = {}) {
				const bits = [];
				if (order.order_no) bits.push('订单号 ' + order.order_no);
				if (order.status_name) bits.push(order.status_name);
				if (order.total_price !== undefined && order.total_price !== null && order.total_price !== '') bits.push('¥' + order.total_price);
				if (order.add_time) bits.push(order.add_time);
				return bits.join(' · ') || '订单';
			},
			order_card_meta_primary(order = {}) {
				const bits = [];
				if (order.order_no) bits.push('订单号 ' + order.order_no);
				if (order.status_name) bits.push(order.status_name);
				if (!bits.length) return '订单';
				return bits.join(' · ') + ' ·';
			},
			order_card_meta_sub(order = {}) {
				const bits = [];
				if (order.total_price !== undefined && order.total_price !== null && order.total_price !== '') bits.push('¥' + order.total_price);
				if (order.add_time) bits.push(order.add_time);
				return bits.join('  ');
			},
			aftersale_card_head(as = {}) {
				const bits = ['售后单'];
				if (as.type_name) bits.push(as.type_name);
				if (as.status_name) bits.push(as.status_name);
				if (as.order_no) bits.push('订单 ' + as.order_no);
				if (as.price !== undefined && as.price !== null && as.price !== '') bits.push('¥' + as.price);
				if (as.add_time) bits.push(as.add_time);
				return bits.join(' · ');
			},
			media_progress_text(progress) {
				const n = Math.max(0, Math.min(99, Math.floor(Number(progress) || 0)));
				return n + '%';
			},
			media_progress_ring_style(progress) {
				const p = Math.max(0, Math.min(99, Math.floor(Number(progress) || 0)));
				const deg = p * 3.6;
				return { background: 'conic-gradient(from -90deg, #ffffff 0deg, #ffffff ' + deg + 'deg, rgba(255,255,255,0.28) ' + deg + 'deg, rgba(255,255,255,0.28) 360deg)' };
			},
			audio_bubble_style(item) {
				const sec = Number(item && item.duration_sec) || 0;
				if (!(sec > 0)) return {};
				const w = Math.min(280, Math.max(96, 96 + sec * 6));
				return { width: w + 'rpx' };
			},
			emit_reedit(e) { this.$emit('reedit', e); },
			emit_resend(e) { this.$emit('resend', e); },
			emit_image_load() { this.$emit('imageLoad', this.item); },
			emit_image_error() { this.$emit('imageError', this.item); },
			emit_preview_image(e) { this.$emit('previewImage', e); },
			emit_video_poster_error(e) { this.$emit('videoPosterError', e); },
			emit_open_video(e) { this.$emit('openVideo', e); },
			emit_open_goods(e) { this.$emit('openGoods', e); },
			emit_toggle_audio(e) { this.$emit('toggleAudio', e); },
			emit_quote(e) { this.$emit('quote', e); },
			emit_press_start(e) { this.$emit('pressStart', e); },
			emit_press_move(e) { this.$emit('pressMove', e); },
			emit_press_end(e) { this.$emit('pressEnd', e); },
			emit_mouse_down(e) { this.$emit('mouseDown', e); },
			emit_contextmenu(e) { this.$emit('contextmenu', e); },
			emit_open_file(e) { this.$emit('openFile', e); },
			emit_open_link(e) { this.$emit('openLink', e); },
			emit_quote_block_tap() { this.$emit('quoteBlockTap', this.item && this.item.quote); },
		},
	};
</script>

<style lang="scss" scoped>
.time-line {
	display: flex;
	justify-content: center;
	margin: 16rpx 0 28rpx;
}

.time-text {
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	background: rgba(0, 0, 0, 0.08);
	color: #fff;
	font-size: 22rpx;
	line-height: 1.4;
}

/* 对齐 PC .message-pure：温馨提示黄底卡片 */
.message-pure {
	margin: 8rpx 0 28rpx;
	padding: 0 8rpx;
}

.message-pure-card {
	box-sizing: border-box;
	padding: 22rpx 28rpx;
	background: #fff8e8;
	border: 1rpx solid #f0e0b2;
	border-left: 8rpx solid #e6a23c;
	border-radius: 8rpx;
}

.message-pure-hd {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.message-pure-hd-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 10rpx;
	border-radius: 50%;
	background: #e6a23c;
	color: #fff;
	font-size: 22rpx;
	font-weight: 700;
	line-height: 32rpx;
	text-align: center;
	flex-shrink: 0;
}

.message-pure-hd-text {
	font-size: 26rpx;
	font-weight: 600;
	color: #e6a23c;
	line-height: 1.4;
}

.message-pure-bd {
	display: block;
	color: #8a6d3b;
	font-size: 26rpx;
	line-height: 1.6;
	white-space: pre-wrap;
	word-break: break-word;
}

.message-mode-tip {
	display: flex;
	justify-content: center;
	margin: 8rpx 0 28rpx;
	padding: 0 24rpx;
}

.message-mode-tip-body {
	display: flex;
	align-items: center;
	max-width: 100%;
}

.message-mode-tip-icon {
	width: 24rpx;
	height: 24rpx;
	margin-right: 8rpx;
	border-radius: 50%;
	background: #f5a623;
	color: #fff;
	font-size: 18rpx;
	line-height: 24rpx;
	text-align: center;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.message-mode-tip-text {
	color: #f5a623;
	font-size: 24rpx;
	line-height: 1.5;
	word-break: break-word;
}

/* 对齐 PC .message-ai-summary（2026-08-20） */
.message-ai-summary {
	margin: 16rpx 24rpx 28rpx;
}
.message-ai-summary-card {
	box-sizing: border-box;
	width: 100%;
	padding: 24rpx 28rpx 20rpx;
	background: #f7f8fa;
	border: 1rpx solid #e8ebf0;
	border-radius: 20rpx;
	text-align: left;
}
.message-ai-summary-hd {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}
.message-ai-summary-hd-text {
	color: #666;
	font-size: 26rpx;
	font-weight: 600;
	line-height: 36rpx;
	margin-left: 10rpx;
}
.message-ai-summary-bd {
	display: block;
	color: #333;
	font-size: 28rpx;
	line-height: 1.6;
	white-space: pre-wrap;
	word-break: break-word;
}
.message-ai-summary-time {
	display: block;
	margin-top: 12rpx;
	color: #999;
	font-size: 22rpx;
	line-height: 1.4;
}

.message-system-divider {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	margin: 8rpx 0 28rpx;
}

.message-system-text {
	font-size: 22rpx;
	color: #b2b2b2;
	font-style: italic;
	margin: 0 4rpx;
}

.message-reedit {
	font-size: 22rpx;
	color: #576b95;
	font-style: normal;
	margin-left: 4rpx;
}

.msg-sender-name {
	display: block;
	margin: 0 0 8rpx 4rpx;
	max-width: 100%;
	font-size: 22rpx;
	color: #999;
	line-height: 1.2;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.message-row.is-self .msg-sender-name {
	margin: 0 4rpx 8rpx 0;
	text-align: right;
}

.ai-thinking {
	display: flex;
	align-items: center;
}

.ai-thinking-text {
	font-size: 28rpx;
	color: #666;
}

.ai-thinking-dots {
	display: flex;
	align-items: center;
	margin-left: 10rpx;
}

.ai-thinking-dot {
	width: 10rpx;
	height: 10rpx;
	margin-left: 6rpx;
	border-radius: 50%;
	background: #b2b2b2;
	animation: ai-thinking-blink 1.2s infinite ease-in-out;
}

.ai-thinking-dot:nth-child(2) {
	animation-delay: 0.2s;
}

.ai-thinking-dot:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes ai-thinking-blink {
	0%,
	80%,
	100% {
		opacity: 0.25;
	}
	40% {
		opacity: 1;
	}
}

.message-row {
	display: flex;
	align-items: flex-start;
	margin-bottom: 28rpx;
}

.message-row.is-self {
	flex-direction: row-reverse;
}

.message-row.is-quote-flash .bubble {
	box-shadow: 0 0 0 4rpx rgba(64, 158, 255, 0.45);
}

/* #ifdef H5 */
.message-row {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	user-select: none;
}
/* #endif */

.msg-avatar {
	width: 80rpx;
	height: 80rpx;
	flex-shrink: 0;
}

.bubble-wrap {
	position: relative;
	max-width: calc(100% - 200rpx);
	margin: 0 20rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.message-row.is-self .bubble-wrap {
	align-items: flex-end;
}

.bubble-main {
	display: flex;
	flex-direction: row;
	align-items: center;
	max-width: 100%;
}

.bubble-main.is-self {
	flex-direction: row;
	align-items: flex-end;
}

.msg-read-status {
	flex-shrink: 0;
	margin: 0 10rpx 6rpx;
	font-size: 20rpx;
	line-height: 1.2;
	color: #b2b2b2;
}

.msg-read-status.is-read {
	color: #c0c0c0;
}

.msg-read-status.is-unread {
	color: #fa5151;
}

.msg-send-loading {
	width: 22rpx;
	height: 22rpx;
	margin: 0 12rpx;
	border-radius: 50%;
	border: 3rpx solid #d0d0d0;
	border-top-color: #8a8a8a;
	box-sizing: border-box;
	flex-shrink: 0;
	align-self: center;
	animation: msg-send-spin 0.8s linear infinite;
}

@keyframes msg-send-spin {
	to {
		transform: rotate(360deg);
	}
}

.msg-send-fail {
	margin: 0 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	align-self: center;
}

.bubble {
	position: relative;
	padding: 18rpx 22rpx;
	border-radius: 10rpx;
	word-break: break-word;
}

.bubble-text {
	font-size: 28rpx;
	line-height: 1.5;
	color: #191919;
	white-space: pre-wrap;
	word-break: break-word;
}

.bubble-text-wrap {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: flex-start;
}

.bubble.is-emoji-only {
	padding: 10rpx 16rpx;
}

.bubble-text-wrap.is-emoji-only .bubble-text {
	font-size: 40rpx;
	line-height: 1.2;
}

.bubble-link {
	font-size: 32rpx;
	line-height: 1.5;
	color: #576b95;
	word-break: break-all;
}

/* 图/视频：白底圆角；发送中灰色占位+进度 */
.bubble.is-media {
	padding: 0;
	background: #fff !important;
	overflow: hidden;
	border-radius: 8rpx;
}

.bubble.is-media::before {
	display: none;
}

.media-box {
	position: relative;
	width: 280rpx;
	min-height: 280rpx;
	background: #d8d8d8;
	border-radius: 8rpx;
	overflow: hidden;
}

.media-box.is-video {
	width: 480rpx;
	max-width: 100%;
	height: 270rpx;
	min-height: 270rpx;
	background: #2b2b2b;
}

.media-box.is-ready {
	min-height: 0;
	height: auto;
	background: #fff;
}

.media-box.is-video.is-ready {
	height: 270rpx;
	min-height: 270rpx;
	background: #2b2b2b;
}

.media-percent-mask {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.42);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 4;
	pointer-events: none;
}

.media-progress {
	position: relative;
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	flex-shrink: 0;
	overflow: hidden;
	box-sizing: border-box;
}

.media-progress-hole {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 54rpx;
	height: 54rpx;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.55);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	box-sizing: border-box;
}

.media-percent-text {
	width: 54rpx;
	font-size: 20rpx;
	font-weight: 600;
	color: #fff;
	line-height: 1;
	text-align: center;
}

.media-fail-text {
	font-size: 22rpx;
	color: #fff;
	line-height: 1.2;
}

.bubble-image {
	width: 280rpx;
	max-width: 280rpx;
	border-radius: 8rpx;
	display: block;
	background: #fff;
	border: none;
	outline: none;
	box-shadow: none;
	-webkit-tap-highlight-color: transparent;
}

.bubble-image.is-waiting {
	position: absolute;
	left: 0;
	top: 0;
	opacity: 0;
	pointer-events: none;
}

.bubble-video {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	border-radius: 8rpx;
	background: #2b2b2b;
	display: block;
	border: none;
	outline: none;
	box-shadow: none;
	pointer-events: none;
	-webkit-tap-highlight-color: transparent;
}

.bubble-video.is-waiting {
	opacity: 0;
}

.video-poster,
.video-poster-video {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	border-radius: 8rpx;
	background: #2b2b2b;
}

.video-poster-video {
	pointer-events: none;
	object-fit: cover;
}

.video-cover-ui {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 5;
}

.video-play {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 88rpx;
	height: 88rpx;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.video-play ::v-deep .icon-font {
	line-height: 1;
}

.video-duration {
	position: absolute;
	right: 16rpx;
	bottom: 12rpx;
	font-size: 22rpx;
	color: #fff;
	line-height: 1.2;
	text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.45);
}

/* #ifdef H5 */
.bubble-image ::v-deep img,
.bubble-video ::v-deep video {
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
}
/* #endif */

.bubble-goods {
	width: 360rpx;
	display: flex;
	flex-direction: row;
	align-items: flex-start;
}

.bubble-goods.is-clickable:active {
	opacity: 0.75;
}

.goods-cover {
	width: 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	background: #f0f0f0;
	flex-shrink: 0;
	margin-right: 16rpx;
}

.goods-meta {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 120rpx;
}

.goods-title {
	font-size: 28rpx;
	color: #191919;
	line-height: 1.4;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.goods-price {
	margin-top: 8rpx;
	font-size: 28rpx;
	color: #fa5151;
	font-weight: 600;
}

.bubble-goods-loading {
	font-size: 26rpx;
	color: #999;
	line-height: 1.4;
}

.bubble-order {
	max-width: 520rpx;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.order-head {
	margin-bottom: 12rpx;
}

.order-head-line {
	display: block;
	font-size: 22rpx;
	color: #888;
	line-height: 1.5;
	word-break: break-all;
}

.order-head-sub {
	display: block;
	margin-top: 4rpx;
	font-size: 22rpx;
	color: #888;
	line-height: 1.4;
}

.order-goods-row {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
}

.order-cover {
	width: 96rpx;
	height: 96rpx;
	border-radius: 8rpx;
	background: #f0f0f0;
	flex-shrink: 0;
	margin-right: 12rpx;
}

.order-goods-meta {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.order-goods-title {
	font-size: 26rpx;
	color: #191919;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.order-goods-price {
	margin-top: 8rpx;
	font-size: 26rpx;
	color: #fa5151;
}

.order-tip {
	margin-top: 10rpx;
	font-size: 22rpx;
	color: #999;
	line-height: 1.4;
}

.bubble-file {
	min-width: 240rpx;
	max-width: 400rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.bubble-file-icon {
	width: 56rpx;
	height: 56rpx;
	margin-right: 12rpx;
	border-radius: 8rpx;
	background: #f0f0f0;
	color: #666;
	font-size: 22rpx;
	line-height: 56rpx;
	text-align: center;
	flex-shrink: 0;
}

.bubble-file-meta {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.bubble-file-name {
	font-size: 26rpx;
	color: #191919;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.bubble-file-size {
	margin-top: 4rpx;
	font-size: 22rpx;
	color: #999;
}

.bubble-file.is-audio-file .bubble-file-icon.is-audio {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #e8f4ff;
	color: #1677ff;
	line-height: 1;
	font-size: 0;
}

.bubble-file.is-audio-file.is-playing .bubble-file-icon.is-audio {
	background: #1677ff;
}

.audio-bars {
	width: 28rpx;
	height: 28rpx;
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	justify-content: space-between;
}

.audio-bar {
	width: 4rpx;
	border-radius: 2rpx;
	background: #1677ff;
	transform-origin: center bottom;
}

.bubble-file.is-audio-file.is-playing .audio-bar {
	background: #fff;
}

.audio-bar.is-1 {
	height: 10rpx;
}

.audio-bar.is-2 {
	height: 20rpx;
}

.audio-bar.is-3 {
	height: 14rpx;
}

.audio-bar.is-4 {
	height: 22rpx;
}

.bubble-file.is-audio-file.is-playing .audio-bar.is-1 {
	animation: audio-bar-wave 0.7s ease-in-out infinite;
}

.bubble-file.is-audio-file.is-playing .audio-bar.is-2 {
	animation: audio-bar-wave 0.7s ease-in-out 0.12s infinite;
}

.bubble-file.is-audio-file.is-playing .audio-bar.is-3 {
	animation: audio-bar-wave 0.7s ease-in-out 0.24s infinite;
}

.bubble-file.is-audio-file.is-playing .audio-bar.is-4 {
	animation: audio-bar-wave 0.7s ease-in-out 0.08s infinite;
}

@keyframes audio-bar-wave {
	0%,
	100% {
		transform: scaleY(0.45);
	}
	50% {
		transform: scaleY(1);
	}
}

.bubble.is-audio {
	padding: 12rpx 16rpx;
}

.bubble-audio {
	min-width: 96rpx;
	max-width: 280rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.message-row.is-self .bubble-audio {
	flex-direction: row-reverse;
}

.message-row.is-self .bubble-audio .audio-wave {
	margin-left: 10rpx;
	margin-right: 0;
}

.bubble-audio .audio-wave {
	margin-right: 10rpx;
}

.audio-wave {
	width: 36rpx;
	height: 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.audio-horn-clip {
	width: 24rpx;
	height: 24rpx;
	overflow: hidden;
	position: relative;
	transform: rotate(45deg);
}

.message-row.is-self .audio-horn-clip {
	transform: rotate(-135deg);
}

.audio-horn-c {
	position: absolute;
	left: 0;
	bottom: 0;
	border-radius: 50%;
	box-sizing: border-box;
	transform: translate(-50%, 50%);
}

.audio-horn-c.is-dot {
	width: 9rpx;
	height: 9rpx;
	background: #191919;
}

.audio-horn-c.is-r1 {
	width: 24rpx;
	height: 24rpx;
	border: 4rpx solid #191919;
}

.audio-horn-c.is-r2 {
	width: 40rpx;
	height: 40rpx;
	border: 4rpx solid #191919;
}

.bubble-audio.is-playing .audio-horn-c.is-r1 {
	animation: audio-horn-a1 1.2s steps(1, end) infinite;
}

.bubble-audio.is-playing .audio-horn-c.is-r2 {
	animation: audio-horn-a2 1.2s steps(1, end) infinite;
}

@keyframes audio-horn-a1 {
	0%,
	16% {
		opacity: 0;
	}
	17%,
	74% {
		opacity: 1;
	}
	75%,
	100% {
		opacity: 0;
	}
}

@keyframes audio-horn-a2 {
	0%,
	41% {
		opacity: 0;
	}
	42%,
	74% {
		opacity: 1;
	}
	75%,
	100% {
		opacity: 0;
	}
}

.audio-duration {
	flex-shrink: 0;
	font-size: 26rpx;
	color: #191919;
	line-height: 1;
	white-space: nowrap;
	max-width: 120rpx;
	overflow: hidden;
	text-overflow: ellipsis;
}

.bubble-other {
	background: #fff;
}

.bubble-self {
	background: #95ec69;
}

.bubble-other::before,
.bubble-self::before {
	content: '';
	position: absolute;
	top: 26rpx;
	width: 16rpx;
	height: 16rpx;
	background: inherit;
	transform: rotate(45deg);
	border-radius: 2rpx;
	z-index: 0;
}

.bubble-other::before {
	left: -6rpx;
}

.bubble-self::before {
	right: -6rpx;
}

/* 气泡下方引用灰框（不在绿/白气泡内部） */
.quote-block {
	margin-top: 8rpx;
	max-width: 100%;
	padding: 10rpx 16rpx;
	border-radius: 8rpx;
	background: #e7e7e7;
	box-sizing: border-box;
	display: flex;
	align-items: center;
}

.quote-block.is-self {
	align-self: flex-end;
}

.quote-block.is-other {
	align-self: flex-start;
}

.quote-block.is-recalled {
	opacity: 0.85;
}

.quote-block.is-recalled .quote-text {
	font-style: italic;
	color: #999;
}

.quote-text {
	flex: 1;
	min-width: 0;
	font-size: 22rpx;
	color: #888;
	line-height: 1.4;
	word-break: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.quote-thumb {
	width: 40rpx;
	height: 40rpx;
	border-radius: 4rpx;
	background: #d0d0d0;
	margin-right: 10rpx;
	flex-shrink: 0;
}

</style>
