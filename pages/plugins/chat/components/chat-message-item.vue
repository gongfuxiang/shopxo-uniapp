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
					@contextmenu="emit_contextmenu"
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
			emit_msg(type, payload) {
				this.$emit('msgAction', { type, ...(payload || {}) });
			},
			emit_reedit(e) { this.emit_msg('reedit', { event: e }); },
			emit_resend(e) { this.emit_msg('resend', { event: e }); },
			emit_image_load() { this.emit_msg('imageLoad', { data: this.item }); },
			emit_image_error() { this.emit_msg('imageError', { data: this.item }); },
			emit_preview_image(e) { this.emit_msg('previewImage', { event: e }); },
			emit_video_poster_error(e) { this.emit_msg('videoPosterError', { event: e }); },
			emit_open_video(e) { this.emit_msg('openVideo', { event: e }); },
			emit_open_goods(e) { this.emit_msg('openGoods', { event: e }); },
			emit_toggle_audio(e) { this.emit_msg('toggleAudio', { event: e }); },
			emit_quote(e) { this.emit_msg('quote', { event: e }); },
			emit_press_start(e) { this.emit_msg('pressStart', { event: e }); },
			emit_press_move(e) { this.emit_msg('pressMove', { event: e }); },
			emit_press_end(e) { this.emit_msg('pressEnd', { event: e }); },
			emit_mouse_down(e) { this.emit_msg('mouseDown', { event: e }); },
			emit_contextmenu(e) {
				if (e && typeof e.preventDefault === 'function') {
					e.preventDefault();
				}
				this.emit_msg('contextmenu', { event: e });
			},
			emit_open_file(e) { this.emit_msg('openFile', { event: e }); },
			emit_open_link(e) { this.emit_msg('openLink', { event: e }); },
			emit_quote_block_tap() { this.emit_msg('quoteBlockTap', { data: this.item && this.item.quote }); },
		},
	};
</script>

<style scoped>
@import './chat-message-item.css';
</style>
