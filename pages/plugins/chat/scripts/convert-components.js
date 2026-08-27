/**
 * Convert chat components Vue3 → Vue2
 */
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '../components');

function write(file, tpl, script, style) {
	fs.writeFileSync(file, `<template>${tpl}</template>\n\n${script}\n\n<style lang="scss" scoped>${style}</style>\n`);
}

function convertSimple(name) {
	const file = path.join(DIR, name);
	const content = fs.readFileSync(file, 'utf8');
	const tpl = content.match(/<template>([\s\S]*?)<\/template>/)[1];
	const style = content.match(/<style[\s\S]*?>([\s\S]*?)<\/style>/)[1];

	if (name === 'chat-voice-mask.vue') {
		write(file, tpl.replace(/props\.willCancel/g, 'willCancel'), `<script>
	export default {
		options: { virtualHost: true, styleIsolation: 'shared' },
		props: { willCancel: { type: Boolean, default: false } },
		methods: {
			emit_start(e) { this.$emit('start', e); },
			emit_move(e) { this.$emit('move', e); },
			emit_end(e) { this.$emit('end', e); },
		},
	};
</script>`, style);
		return;
	}

	if (name === 'chat-msg-menu.vue') {
		const t = tpl.replace(/props\.menu/g, 'menu').replace(/props\.menuStyle/g, 'menuStyle')
			.replace(/<u-icon name="copy-square" size="40" color="#ffffff"><\/u-icon>/g, '<iconfont name="icon-copy-square" size="80rpx" color="#ffffff"></iconfont>')
			.replace(/<u-icon name="quote" size="40" color="#ffffff"><\/u-icon>/g, '<iconfont name="icon-quote" size="80rpx" color="#ffffff"></iconfont>')
			.replace(/<u-icon name="back" size="40" color="#ffffff"><\/u-icon>/g, '<iconfont name="icon-back" size="80rpx" color="#ffffff"></iconfont>');
		write(file, t, `<script>
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
</script>`, style);
		return;
	}

	if (name === 'chat-video-popup.vue') {
		const t = tpl
			.replace(/props\.headHeight/g, 'headHeight').replace(/props\.statusBarHeight/g, 'statusBarHeight')
			.replace(/props\.playerStyle/g, 'playerStyle').replace(/props\.src/g, 'src')
			.replace(/props\.poster/g, 'poster').replace(/props\.loading/g, 'loading')
			.replace(/<u-icon name="close-line" size="28" color="#ffffff"><\/u-icon>/g, '<iconfont name="icon-close-line" size="56rpx" color="#ffffff"></iconfont>');
		write(file, t, `<script>
	export default {
		options: { virtualHost: true, styleIsolation: 'shared' },
		props: {
			src: { type: String, default: '' },
			poster: { type: String, default: '' },
			headHeight: { type: Number, default: 0 },
			statusBarHeight: { type: Number, default: 0 },
			playerStyle: { type: Object, default: () => ({}) },
			loading: { type: Boolean, default: false },
		},
		methods: {
			emit_close(e) { this.$emit('close', e); },
			emit_ready(e) { this.$emit('ready', e); },
			emit_play(e) { this.$emit('play', e); },
			emit_timeupdate(e) { this.$emit('timeupdate', e); },
			emit_error(e) { this.$emit('error', e); },
		},
	};
</script>`, style);
		return;
	}

	if (name === 'chat-msg-search.vue') {
		const t = tpl
			.replace(/props\.navWrapStyle/g, 'navWrapStyle').replace(/props\.navBarStyle/g, 'navBarStyle')
			.replace(/props\.keyword/g, 'keyword').replace(/props\.focus/g, 'focus')
			.replace(/props\.loading/g, 'loading').replace(/props\.hits/g, 'hits')
			.replace(/props\.listHeight/g, 'listHeight').replace(/props\.defaultAvatar/g, 'defaultAvatar')
			.replace(/<u-icon name="search" size="32" color="#999"><\/u-icon>/g, '<iconfont name="icon-search" size="64rpx" color="#999"></iconfont>')
			.replace(/<u-icon name="close-round" size="28" color="#c0c0c0"><\/u-icon>/g, '<iconfont name="icon-close-round" size="56rpx" color="#c0c0c0"></iconfont>')
			.replace(/<u-no-data[\s\S]*?<\/u-no-data>/g, '<view v-else-if="hits.length === 0" class="msg-search-empty">无匹配消息</view>');
		write(file, t, `<script>
	import { isEmpty } from '../common/chat-host.js';
	export default {
		options: { virtualHost: true, styleIsolation: 'shared' },
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
</script>`, style);
	}
}

function convertMessageItem() {
	const file = path.join(DIR, 'chat-message-item.vue');
	const content = fs.readFileSync(file, 'utf8');
	let tpl = content.match(/<template>([\s\S]*?)<\/template>/)[1];
	const style = content.match(/<style[\s\S]*?>([\s\S]*?)<\/style>/)[1];
	['item', 'index', 'defaultAvatar', 'flashRecordId', 'playingAudioKey', 'goodsClickable', 'showReadReceipt', 'recallNow'].forEach((p) => {
		tpl = tpl.replace(new RegExp('props\\.' + p, 'g'), p);
	});
	tpl = tpl.replace(/<u-icon name="file" size="28" color="#666"><\/u-icon>/g, '<iconfont name="icon-file" size="56rpx" color="#666"></iconfont>');
	tpl = tpl.replace(/<u-icon([^>]*)name="([^"]+)"([^>]*)size="(\d+)"([^>]*)color="([^"]+)"([^>]*)><\/u-icon>/g, (_, a, name, b, size, c, color) => {
		return `<iconfont name="icon-${name}" size="${Number(size) * 2}rpx" color="${color}"></iconfont>`;
	});

	const script = `<script>
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
				name = String(name || '').replace(/^\\[音频\\]\\s*/, '').replace(/^【音频】\\s*/, '').trim();
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
</script>`;
	write(file, tpl, script, style);
}

['chat-voice-mask.vue', 'chat-msg-menu.vue', 'chat-video-popup.vue', 'chat-msg-search.vue'].forEach(convertSimple);
convertMessageItem();
console.log('components ok');
