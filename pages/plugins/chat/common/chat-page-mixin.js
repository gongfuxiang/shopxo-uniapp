import { isEmpty, showToast, page_back_prev_event, chat_back_to_list_event, get_global_data, get_config, get_default_avatar, open_web_view, get_chat_nav_layout_metrics, get_chat_client_type, get_menu_button_rect_safe } from '../common/chat-host.js';
import base64 from '@/common/js/lib/base64.js';
import { ensure_chat_user_init, apply_chat_user_page_config } from '../common/chat-user-init.js';
// #ifdef APP-PLUS
import { callVideoFrameInfo, releaseVideoFrame } from '@/uni_modules/lxw-video-frame';
// #endif
import {
	chat_upload_file,
	chat_upload_make_chunk_key,
	chat_upload_clear_resume,
} from '../common/chat-upload.js';
import { pick_chat_local_file } from '../common/chat-pick-file.js';
import {
	chat_connect,
	chat_apply_entry_params,
	chat_resume_connect,
	on_chat_event,
	off_chat_event,
	get_chat_state,
	chat_set_receive_user,
	chat_get_receive_user_cache,
	chat_load_record,
	chat_load_record_history,
	chat_send_message,
	parse_message_content,
	normalize_quote,
	is_quote_recalled,
	chat_set_friend_base,
	chat_get_friend_base,
	chat_load_user_base,
	chat_leave_session,
	chat_send_input_status,
	chat_can_input_status,
	chat_can_show_input_message,
	chat_load_business_goods,
	is_obsolete_phase_divider,
	is_mode_tip_message,
	is_session_end_continue_tip,
	is_system_message,
	is_recall_message,
	is_ai_bot_user,
	is_ai_summary_message,
	chat_ai_bot_user,
	chat_transfer_human,
	chat_transfer_ai,
	chat_load_agent_online_list,
	chat_transfer_agent,
	chat_can_end,
	chat_end_session,
	chat_continue_session,
	chat_session_revive_inflight,
	chat_submit_rating,
	chat_can_rating,
	chat_can_show_read,
	chat_can_open_goods,
	chat_open_goods,
	chat_can_recall,
	chat_recall_still_valid,
	chat_recall_seconds,
	chat_recall_message,
	chat_can_use_tool,
	chat_get_emoji_list,
	chat_is_voice_message,
	chat_voice_mark_played,
	chat_can_search_record,
	chat_search_record,
	chat_load_record_around,
	chat_update_friend_preview,
	chat_site_logged_in,
	get_chat_config,
} from '../common/chat-socket.js';

const bind_chat_push = () => {};
const request_chat_push_auth = () => {};
const create_chat_local_push = () => {};
const request_chat_media_auth = () => {
	// #ifdef MP-WEIXIN
	try {
		uni.getSetting({
			success(res) {
				const auth = (res && res.authSetting) || {};
				if (auth['scope.record']) {
					return;
				}
				uni.authorize({
					scope: 'scope.record',
					fail() {
						showToast('需要麦克风权限才能发送语音');
						setTimeout(() => {
							try {
								uni.openSetting({});
							} catch (e) {}
						}, 800);
					},
				});
			},
		});
	} catch (e) {}
	// #endif
	// #ifndef MP-WEIXIN
	try { uni.authorize && uni.authorize({ scope: 'scope.record' }); } catch (e) {}
	// #endif
};
const ensure_chat_media_auth_before_pick = () => Promise.resolve(true);

// #ifdef APP-PLUS
// #endif

const chat_currency_symbol = () => {
	const sym = get_config('currency_symbol');
	if (sym) {
		return String(sym);
	}
	const app = getApp();
	if (app && app.globalData) {
		if (typeof app.globalData.currency_symbol === 'function') {
			return String(app.globalData.currency_symbol() || '¥');
		}
		if (app.globalData.data && app.globalData.data.currency_symbol) {
			return String(app.globalData.data.currency_symbol);
		}
	}
	return '¥';
};

/** 导航内容行高度（与微信胶囊同高） */

/** 导航右侧留白：避开微信胶囊 */

/** 页面是否仍可用，避免销毁后改视图触发 receiveTasks */
/** 正在 HTTP 上传的媒体消息 key，防重复发起 */
const media_upload_inflight = new Set();
/** 真上传进度达到该值后才停假进度（避免低真值/假进度顶格后卡死） */
const REAL_UPLOAD_PROGRESS_TAKEOVER = 18;
let keyboard_bound = false;
/** 本页用户主动结束后禁止自动继续与结束询问弹窗 */

/** 已结束会话选择弹窗进行中，避免重复弹 */
let ended_choice_showing = false;
/** 本次展示已处理过结束态（继续或退出），避免重复弹 */
let ended_choice_handled = false;
/** 本页记录已 init；曾处于未结束态后，超时结束才弹询问 */
let record_init_done = false;
let allow_ended_prompt = false;
/** 进页为结束态，等待 chat-continue 成功后再算 engaged */
let pending_session_revive = false;
/** 本页会话已激活（续聊完成后），才允许弹「是否继续」 */
let session_page_engaged = false;
/** 聊天页是否前台可见（onHide 去详情等为 false） */
let page_visible = true;
/** 离开聊天页期间会话结束：回页时重连续聊，不弹「是否继续」 */
let ended_while_page_hidden = false;
/** 自动续聊 / 结束态发消息排队 continue 期间，忽略迟到的 chat-end、chat-rating-open */
let suppress_ended_choice = false;
let suppress_ended_choice_timer = null;

const arm_suppress_ended_choice = (ms = 2000) => {
	suppress_ended_choice = true;
	if (suppress_ended_choice_timer) {
		clearTimeout(suppress_ended_choice_timer);
	}
	suppress_ended_choice_timer = setTimeout(() => {
		suppress_ended_choice_timer = null;
		suppress_ended_choice = false;
	}, ms);
};

const clear_suppress_ended_choice = () => {
	suppress_ended_choice = false;
	if (suppress_ended_choice_timer) {
		clearTimeout(suppress_ended_choice_timer);
		suppress_ended_choice_timer = null;
	}
};

/** 续聊恢复后延迟再允许「是否继续」弹窗，避免迟到 chat-end 误弹 */
let allow_ended_prompt_timer = null;
const clear_allow_ended_prompt_timer = () => {
	if (allow_ended_prompt_timer) {
		clearTimeout(allow_ended_prompt_timer);
		allow_ended_prompt_timer = null;
	}
};
const schedule_allow_ended_prompt = (ms = 5000) => {
	clear_allow_ended_prompt_timer();
	allow_ended_prompt = false;
	allow_ended_prompt_timer = setTimeout(() => {
		allow_ended_prompt_timer = null;
		if (record_init_done && session_page_engaged && !pending_session_revive) {
			allow_ended_prompt = true;
		}
	}, ms);
};

/** 结束态发消息进入排队续聊时，统一标记续聊中并屏蔽结束弹窗 */
const mark_send_revive_queued = () => {
	pending_session_revive = true;
	arm_suppress_ended_choice(8000);
};

/** 用户在本页真正开始聊天后，才允许超时结束弹窗 */
const mark_session_page_engaged = () => {
	if (session_page_engaged) {
		return;
	}
	session_page_engaged = true;
	pending_session_revive = false;
	arm_suppress_ended_choice(2000);
	if (record_init_done) {
		schedule_allow_ended_prompt(2000);
	}
};

let flash_record_timer = null;
const REEDIT_TTL_MS = 60 * 1000;
const HISTORY_LOAD_DISTANCE = 80;
const HISTORY_LOAD_MIN_MS = 280;

let reedit_tick_timer = null;

let history_edge_armed = false;
let history_load_timer = null;
let history_pending_payload = null;
let history_load_started_at = 0;
let history_scroll_top = 0;
let history_main_height = 0;

/** 待发送的引用消息 */

let fs_video_loading_timer = null;

/** 长按消息菜单 */

/** 表情列表：仅用初始化/WS 下发的 emoji_list */

/** 对齐 PC ChatIsEmojiOnlyText：去掉表情后无剩余则视为纯表情 */

const RECENT_EMOJI_CACHE_KEY = 'cache_chat_emoji_recent_key';
const RECENT_EMOJI_MAX = 8;

/** 从相册/文件管理器回前台：先别把输入框打成「未连接」 */

let input_status_timer = null; // 发送输入状态节流
let typing_hide_timer = null; // 对方输入提示自动隐藏（对齐 PC 30s）
let rating_submit_fallback_timer = null;

let skip_hide_panel_until = 0;

/** 商品卡片是否可点（本管理端默认关；宿主项目开 goods_click_enable / on_goods_click） */

const MORE_PAGE_SIZE = 8;

let msg_search_timer = null;
let msg_search_jump_id = 0;
const THINKING_KEY = 'ai-thinking';
/** chat-read 早于 ack 到达时暂存 record_id */
const pending_read_ids = {};

/** 本页首次 init 完成前 / WS 连接中 / 记录未就绪：全屏 loading */

/** 评价弹层打开时仍按未结束展示底部按钮，避免栏位收起导致页面闪一下 */
/** 结束会话后 / 评价弹层打开时，按已结束态收起操作按钮，避免底部栏闪动或误点 */

/** 表情/加号面板或全屏输入时暂时隐藏；键盘顶起时仍显示（小程序键盘高度偶发残留会导致按钮整栏消失） */

let msg_key_seed = 0;

//#region 工具
let scroll_pin_seq = 0;
let scroll_layout_timers = [];
let list_ready_fallback_timer = null;

/** 温馨提示撑开后再钉到底；遮罩挡住，避免看到滚动过程 */

/** 对齐 PC ChatFormatMessageTime，并带秒，便于「具体时间」 */

/** 稳定锚点：优先 record_id，便于引用跳转 */

/** 自己撤回：你撤回了一条信息；对方保持服务端文案 */

/** 淘宝风：己方气泡内容左侧显示已读/未读 */

/** 对齐 PC ChatConsultPanelApplyType：从 tabs[type].list 取当前类型列表 */

/** 对齐 PC：文本中 http(s)/pages 链接分段，便于点击 */

/** 对齐 PC ChatAiSummaryHtml：卡片标题已有「AI接待摘要」，正文去掉重复前缀 */

/** 上传进度文案：圆环内部百分比（不展示 100%，三位数会把内圈撑歪） */

const upload_progress_last = {};
const fake_progress_timers = {};

/** 切页回来：假进度续跑；已中断的上传断点续传 */

/** 相册/拍摄临时路径 → 平台绝对路径（lxw-video-frame 必须用这个，直接传 temp 会「查找文件失败」） */

/** 本地临时路径转成 image/video 能用的 src（App 的 _doc/_www 需转成 file://） */

/** 截取视频第一帧封面（H5/App 对齐：得到图片后再显示在气泡里） */

/** 封面图给 <image> 用：_doc 等临时路径转成 file://，否则 App 经常黑块 */

/** 真机相册/拍摄文件常在沙盒外，插件 File.exists / AVAsset 会失败；先拷进 _doc */

/** 发送视频前准备封面：有相册缩略图则落盘，否则抽第一帧；失败返回空串，不抛错 */

const VIDEO_POSTER_PREPARE_TIMEOUT_MS = 10000;

/** 抽帧带超时：超时或失败都不阻塞后续上传 */

const video_poster_cache = {};
const video_poster_queue = [];
let video_poster_running = false;

const FAILED_STORE_KEY = 'cache_chat_failed_messages';
const RESEND_NOW_KEY = 'cache_chat_resend_now';

const slim_failed_row = (row) => ({
	key: row.key,
	data_type: row.data_type,
	text: row.text,
	url: row.url || '',
	local_url: row.local_url || '',
	file_path: row.file_path || '',
	poster: row.poster || '',
	duration_text: row.duration_text || '',
	quote: row.quote || null,
	send_payload: row.send_payload || null,
	upload_chunk_key: row.upload_chunk_key || '',
});

const RESEND_SPIN_MS = 480;

/** 对齐 PC：success.msg / UserMessageView(..., 'message-pure') */

//#endregion

//#region 事件监听

/** 对齐 PC ChatQuoteMarkRecalled：引用该 record 的气泡改为「引用内容已撤回」 */

//#region 会话列表预览（撤回后取上一条未撤回消息）

//#endregion

/** 对齐 PC ChatApplyRecallToDom：原消息替换为撤回提示 */

/** 对齐 PC chat-ack：给乐观发送气泡补 record_id（媒体按 url 匹配，避免并发串绑） */

/** 对齐 PC ChatApplyReadReceipt：按 record_id 更新；all=1 需阅读者是当前会话 */

/** 对齐 PC chat-reject / 敏感词：恢复输入，去掉乐观气泡，不锁发送 */

/** 对齐 PC：点击引用块跳转 / 已撤回提示 */

/** 对齐 PC ChatMsgJumpToRecord / ChatMsgSearchJump */

//#region 会话内消息搜索（对齐 PC chat-msg-search）
/** 对齐 PC ChatMsgSearchHighlightHtml：匹配关键词高亮分段 */

//#endregion

//#endregion

//#region 输入区

const VOICE_MIN_MS = 1000;
const VOICE_RELEASE_GRACE_MS = 200;
const VOICE_TOO_SHORT_TIP = '录音不足 1 秒，请长按说话';
let voice_short_hinted = false;

let recorder_mgr = null;
let voice_start_ts = 0;
let voice_start_y = 0;
let voice_cancel_rect = null;
let voice_send_rect = null;
let voice_stopping = false;
let voice_want_record = false;
let voice_pending_cancel = false;
let voice_pending_hold_ms = 0;
let voice_stop_timer = null;
let voice_release_timer = null;
let voice_cancel_leave_timer = null;
let voice_handled = false;
let voice_ignore_mouse_until = 0;
let voice_doc_end_handler = null;
let voice_doc_move_handler = null;
let audio_ctx = null;
const voice_touch_opts = { passive: false };

/** H5：uni.getRecorderManager 不可用，用 MediaRecorder 对齐 start/stop/onStop/onError */

/** 返回上一页；无上一页则回首页（common.page_back_prev_event） */

/** 商品卡片点击：本管理端默认不跳；迁移项目通过 chat_set_config 开启 */

/**
 * 当前页聊天超时（或对方结束）变为已结束：询问继续聊天或退出
 * 从列表进入已结束会话：由 record init 静默 chat-continue，不走此弹窗
 */

/** 发送媒体：先占位灰块+进度，完成后再展示并可点击 */

/** 对齐 PC 工具栏 accept / ChatClipboardAllowedFileExt */
const CHAT_VIDEO_ALLOW_EXT = ['mp4'];
const CHAT_AUDIO_ALLOW_EXT = ['mp3'];
const CHAT_FILE_ALLOW_EXT = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', '7z'];

/** 对齐 PC ChatNormalizeUploadType */

let file_pick_hold = false;
let resume_hold_timer = null;
let resume_hold_expire_timer = null;

/** 仅文件等真实资源链接；商品/订单卡片不跳转 */

/** 外链：H5 新开；小程序/App 走 web-view（文件/文本链接用，商品订单不用） */

/** 对齐 PC 消息内链接点击 */

/** 对齐 PC ChatCanQuoteContent */

/** 对齐 PC message-recall-reedit：撤回后的文本填回输入框 */

/** 打开长按菜单（App @longpress / H5 长按模拟 / H5 右键） */

// ---------- H5：触摸/鼠标长按模拟（@longpress 在浏览器不可靠） ----------
const MSG_PRESS_MS = 480;
const MSG_MOVE_PX = 12;
let msg_press_timer = null;
let msg_press_index = -1;
let msg_press_x = 0;
let msg_press_y = 0;

/** H5 桌面：按住鼠标约 0.5s */

/** H5：右键直接引用（桌面更自然） */

//#endregion

export default {
	data() {
		const default_avatar = get_default_avatar();
		const navInit = get_chat_nav_layout_metrics(88);
		return {
			page_alive: true,
			show_agent_transfer: false,
			chat_id: '',
			route_chat_id: '',
			chat_title: '会话',
			status_bar_height: navInit.status_bar_height,
			window_height: navInit.window_height,
			nav_content_h: navInit.nav_content_h,
			nav_right_pad: navInit.nav_right_pad,
			input_text: '',
			input_focus: false,
			input_view_key: 0,
			panel_type: '',
			keyboard_height: 0,
			skip_auto_continue: false,
			list_ready: false,
			flash_record_id: 0,
			recall_now: Date.now(),
			message_list: [],
			has_more: false,
			history_loading: false,
			min_record_id: 0,
			nav_bar_h: navInit.nav_bar_h,
			nav_occupy_h: navInit.nav_occupy_h,
			nav_layout_ready: false,
			composer_occupy_h: 0,
			input_status_text: '',
			input_status_msg: '',
			default_avatar,
			current_avatar: default_avatar,
			receive_avatar: default_avatar,
			quote_draft: null,
			playing_video_url: '',
			playing_video_poster: '',
			playing_video_loading: false,
			playing_audio_key: '',
			voice_recording: false,
			voice_will_cancel: false,
			msg_menu: {
	show: false,
	index: -1,
	is_self: false,
	can_recall: false,
	placement: 'top', // top=内容上方；bottom=内容下方
	time_text: '',
	top: 0,
	left: 0,
},
			emoji_list: chat_get_emoji_list(),
			recent_emoji_list: [],
			is_input_fullscreen: false,
			is_voice_input: false,
			input_line_count: 1,
			is_connecting: false,
			connect_status: 0,
			online_status: 'off',
			is_resume_hold: false,
			ai_mode: 'human',
			ai_enabled: false,
			ai_switching: false,
			session_ended: false,
			agent_online_others: 0,
			queue_status_text: '',
			agent_transfer_list: [],
			agent_transfer_selected_id: '',
			agent_transfer_ref: null,
			show_rating_modal: false,
			show_ended_choice_modal: false,
			rating_score: 0,
			rating_content: '',
			rating_submitting: false,
			friend_base: null,
			consult_popup_type: '',
			consult_popup_show: false,
			consult_keyword_input: '',
			consult_keyword: '',
			show_read_receipt: chat_can_show_read(),
			show_tool_emoji: chat_can_use_tool('emoji'),
			show_tool_images: chat_can_use_tool('images'),
			show_tool_video: chat_can_use_tool('video'),
			show_tool_audio: chat_can_use_tool('audio'),
			show_tool_voice: chat_can_use_tool('voice'),
			show_tool_file: chat_can_use_tool('file'),
			more_swiper_index: 0,
			show_msg_search_btn: chat_can_search_record(),
			msg_search_open: false,
			msg_search_focus: false,
			msg_search_keyword: '',
			msg_search_hits: [],
			msg_search_loading: false,
			page_user_inited: false,
			can_end_session: false,
		};
	},
	computed: {
		nav_wrap_style() {
			return 'padding-top:' + (this.status_bar_height || 0) + 'px;box-sizing:border-box;';
		},

		nav_status_bar_style() {
			return 'height:' + (this.status_bar_height || 0) + 'px;width:100%;flex-shrink:0;';
		},

		nav_bar_style() {
			let style = 'padding-right:' + (this.nav_right_pad || 12) + 'px;box-sizing:border-box;';
			if (this.nav_content_h > 0) {
				style += 'height:' + this.nav_content_h + 'px;';
			}
			return style;
		},

		chat_main_style() {
			const occupy = this.nav_occupy_h || this.nav_bar_h || 0;
			const bottom = this.composer_occupy_h + Number(this.keyboard_height || 0);
			let style = 'padding-bottom:' + bottom + 'px;box-sizing:border-box;';
			if (occupy > 0) {
				style = 'padding-top:' + occupy + 'px;' + style;
			}
			return style;
		},

		video_fs_head_h() {
			return Number(this.status_bar_height || 0) + 56;
		},

		video_fs_player_style() {
	const top = this.video_fs_head_h;
	const h = Math.max(240, Number(this.window_height || 667) - top);
	let w = 375;
	try {
		w = Number((uni.getSystemInfoSync() || {}).windowWidth || 375);
	} catch (e) {}
	return {
		position: 'absolute',
		left: '0px',
		top: top + 'px',
		width: w + 'px',
		height: h + 'px',
	};
},

		msg_menu_style() {
	if (!this.msg_menu.show) {
		return {};
	}
	const below = this.msg_menu.placement == 'bottom';
	return {
		top: this.msg_menu.top + 'px',
		left: this.msg_menu.left + 'px',
		transform: below ? 'translate(-50%, 8px)' : 'translate(-50%, calc(-100% - 8px))',
	};
},

		emoji_keys_sorted() {
	const keys = [];
	const seen = {};
	(this.emoji_list || []).forEach((em) => {
		if (!seen[em]) {
			keys.push(em);
			seen[em] = 1;
		}
		const bare = String(em).replace(/\uFE0F/g, '');
		if (bare && bare !== em && !seen[bare]) {
			keys.push(bare);
			seen[bare] = 1;
		}
	});
	keys.sort((a, b) => b.length - a.length);
	return keys;
},

		consult_is_trace_panel() {
			return this.consult_popup_type === 'source';
		},

		goods_clickable() {
			return chat_can_open_goods();
		},

		more_panel_items() {
	const rows = [];
	if (this.show_tool_images) {
		rows.push({ key: 'images', name: '照片', icon: 'img', action: 'images', type: '' });
	}
	if (this.show_tool_video) {
		rows.push({ key: 'video', name: '视频', icon: 'video', action: 'video', type: '' });
	}
	if (this.show_tool_file) {
		rows.push({ key: 'file', name: '附件', icon: 'annex', action: 'file', type: '' });
	}
	if (this.show_tool_audio) {
		rows.push({ key: 'audio', name: '音频', icon: 'audio', action: 'audio', type: '' });
	}
	if (chat_site_logged_in()) {
		const consult_items = [
			{ key: 'goods', name: '商品', icon: 'admin-goods', action: '', type: 'goods' },
			{ key: 'cart', name: '购物车', icon: 'cart', action: '', type: 'cart' },
			{ key: 'order', name: '订单', icon: 'order', action: '', type: 'order' },
			{ key: 'aftersale', name: '售后', icon: 'after-sales', action: '', type: 'aftersale' },
		];
		consult_items.forEach((row) => rows.push(row));
	}
	return rows;
},

		more_panel_pages() {
	const list = this.more_panel_items;
	const pages = [];
	for (let i = 0; i < list.length; i += MORE_PAGE_SIZE) {
		pages.push(list.slice(i, i + MORE_PAGE_SIZE));
	}
	return pages.length > 0 ? pages : [[]];
},

		can_send() {
			return !isEmpty(String(this.input_text || '').trim()) && !this.input_locked;
		},

		show_ws_loading() {
			return this.is_connecting && this.connect_status !== 1;
		},

		show_chat_loading() {
			return !this.page_user_inited || this.show_ws_loading || !this.list_ready;
		},

		input_locked() {
	if (this.skip_auto_continue || this.session_ended) {
		return true;
	}
	if (this.is_resume_hold) {
		return this.connect_status === 1 && this.online_status != 'online';
	}
	return this.connect_status !== 1 || this.online_status != 'online';
},

		has_uploading_media() {
	return (this.message_list || []).some((row) => row && row.upload_status == 'uploading');
},

		input_placeholder() {
	if (this.ai_mode == 'ai') {
		const client = get_chat_client_type();
		if (['weixin', 'alipay', 'baidu', 'qq', 'kuaishou'].indexOf(client) !== -1) {
			return this.show_float_ai_bar ? '智能客服接待中' : '点击「转人工客服」';
		}
		return '智能客服接待中，可点击「转人工客服」';
	}
	if (this.ai_enabled && this.ai_mode == 'human' && !this.session_ended_for_ui) {
		return '人工客服接待中，可点击「切回智能客服」';
	}
	if (this.connect_status !== 1) {
		if (this.is_connecting || this.is_resume_hold || this.has_uploading_media) {
			return '连接中...';
		}
		return '未连接';
	}
	if (this.online_status == 'logout') {
		return '您已退出';
	}
	if (this.online_status != 'online') {
		return '您已离线';
	}
	return '请输入内容';
},

		input_placeholder_style() {
	return 'font-size:26rpx;color:#b2b2b2;line-height:45rpx;';
},

		consult_panel_has_source_tab() {
			// 对齐 PC 咨询端：不加号「轨迹」
			return false;
		},

		show_goods_panel_btn() {
			if (this.input_locked) {
				return false;
			}
			if ((get_chat_state().user_type || 'user') != 'user') {
				return false;
			}
			return chat_site_logged_in();
		},

		session_ended_for_ui() {
			return this.session_ended || this.show_rating_modal;
		},

		show_end_btn() {
			return this.can_end_session && !this.session_ended_for_ui;
		},

		show_transfer_human_btn() {
			return this.ai_enabled && this.ai_mode == 'ai' && !this.session_ended_for_ui;
		},

		/** 人工接待中：切回智能客服（对齐 PC 咨询端） */
		show_back_ai_btn() {
			return this.ai_enabled && this.ai_mode == 'human' && !this.session_ended_for_ui;
		},

		show_ai_bar() {
			return this.show_end_btn || this.show_transfer_human_btn || this.show_back_ai_btn;
		},

		show_float_ai_bar() {
	if (this.panel_type) {
		return false;
	}
	if (this.is_input_fullscreen) {
		return false;
	}
	return this.show_ai_bar;
},

		show_input_expand() {
	const text = String(this.input_text || '');
	if (isEmpty(text.trim())) {
		return false;
	}
	return this.input_line_count > 1 || text.indexOf('\n') >= 0 || text.length >= 20;
},

		msg_search_list_h() {
	const hd = this.nav_occupy_h || this.nav_bar_h || ((this.status_bar_height || 0) + (this.nav_content_h || this.rpx_to_px(88)) + this.get_nav_bottom_pad());
	const h = (this.window_height || 0) - hd;
	return h > 0 ? h : 400;
},

		consult_popup_title() {
	const type = this.consult_popup_type;
	const panel = this.consult_panel_for_type(type);
	if (panel && panel.title) {
		return String(panel.title);
	}
	const map = { goods: '商品', cart: '购物车', order: '订单', source: '轨迹', aftersale: '售后' };
	return map[type] || '相关信息';
},

		consult_empty_text() {
	const map = { goods: '暂无浏览商品', cart: '暂无购物车商品', order: '暂无订单', source: '暂无轨迹', aftersale: '暂无售后' };
	return map[this.consult_popup_type] || '暂无数据';
},

		consult_send_label() {
	const type = this.consult_popup_type;
	const panel = this.consult_panel_for_type(type);
	if (panel && panel.send_label) {
		return String(panel.send_label);
	}
	if (type == 'goods' || type == 'cart') {
		return '发送商品';
	}
	if (type == 'order') {
		return '发送订单';
	}
	if (type == 'aftersale') {
		return '发送售后';
	}
	return '';
},

		consult_popup_list() {
	const type = this.consult_popup_type;
	const ext = (this.friend_base && this.friend_base.ext) || {};
	if (type == 'source') {
		const panel = this.consult_panel_for_type('source');
		if (panel && Array.isArray(panel.list) && panel.list.length > 0) {
			return panel.list;
		}
		const list = ext.source;
		return Array.isArray(list) ? list : [];
	}
	if (type != 'goods' && type != 'cart' && type != 'order' && type != 'aftersale') {
		return [];
	}
	const rows = [];
	const seen = {};
	const add_row = (item, is_current) => {
		if (!item || typeof item != 'object') {
			return;
		}
		const key = String(item.id || item.goods_id || item.order_no || item.title || item.goods_title || '');
		if (key && seen[key]) {
			if (is_current) {
				seen[key].is_current = 1;
			}
			return;
		}
		const row = {
			...item,
			is_current: is_current || parseInt(item.is_current || 0) == 1 ? 1 : 0,
		};
		if (key) {
			seen[key] = row;
		}
		rows.push(row);
	};
	const panel = this.consult_panel_for_type(type);
	if (panel && Array.isArray(panel.list)) {
		panel.list.forEach((item) => add_row(item, parseInt(item.is_current || 0) == 1));
	}
	// 兼容：仅有当前进线单条 ext.goods / ext.order / ext.aftersale
	if (ext[type]) {
		add_row(ext[type], true);
	}
	rows.sort((a, b) => Number(b.is_current || 0) - Number(a.is_current || 0));
	return rows;
},

		consult_filtered_list() {
	const type = this.consult_popup_type;
	const list = this.consult_popup_list;
	const kw = String(this.consult_keyword || '').trim().toLowerCase();
	if (kw === '') {
		return list;
	}
	return list.filter((item) => this.consult_item_search_text(type, item).indexOf(kw) !== -1);
}
	},
	watch: {
		show_ws_loading(loading) {
			if (!loading && this.page_alive && this.list_ready) {
				this.scroll_to_bottom();
			}
		},
		show_chat_loading(loading) {
			if (!loading && this.page_alive) {
				this.$nextTick(() => {
					this.measure_chrome();
					this.scroll_to_bottom_after_layout(false);
					setTimeout(() => {
						if (!this.page_alive) return;
						this.measure_chrome();
						this.scroll_to_bottom();
					}, 320);
				});
			}
		},
		queue_status_text() { this.measure_chrome(); },
		show_float_ai_bar() { this.measure_chrome(); },
		panel_type() { this.measure_chrome(); },
		quote_draft() { this.measure_chrome(); },
		keyboard_height() { this.measure_chrome(); },
		input_status_text() { this.measure_chrome(); },
		input_status_msg() { this.measure_chrome(); },
		show_input_expand() { this.measure_chrome(); },
		is_voice_input() { this.measure_chrome(); },
	},
	methods: {
		more_item_icon(icon) {
			const map = {
				img: 'icon-images',
				video: 'icon-video',
				annex: 'icon-file',
				audio: 'icon-audio',
				'admin-goods': 'icon-admin-goods',
				cart: 'icon-cart',
				order: 'icon-order',
				location: 'icon-location',
				'after-sales': 'icon-order',
			};
			return map[icon] || 'icon-file';
		},
		_bound_sync_emoji_list() { this.sync_emoji_list(); },
		_bound_keyboard_height_change(res) { this.on_keyboard_height_change(res); },
		_bound_chat_resend_now(data) { this.on_chat_resend_now(data); },
		isEmpty,
		showToast,
		page_back_prev_event,
		get_global_data,
		open_web_view,
		is_emoji_only_text(text) {
			
				const s = String(text || '');
				if (s.replace(/\s/g, '') === '') {
					return false;
				}
				const keys = this.emoji_keys_sorted || [];
				if (keys.length <= 0) {
					return false;
				}
				let left = s;
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					if (left.indexOf(key) !== -1) {
						left = left.split(key).join('');
					}
				}
				left = left.replace(/[\s\uFE0F\u200D\u200B]/g, '');
				return left === '';
			
		},

		sync_emoji_list() {
			
				this.emoji_list = chat_get_emoji_list();
			
		},

		rpx_to_px(num) {
			
				if (typeof uni.upx2px == 'function') {
					return uni.upx2px(num);
				}
				return num / 2;
			
		},

		apply_nav_layout(patch = {}) {
			const setNum = (key) => {
				if (patch[key] == null || Number.isNaN(Number(patch[key]))) {
					return;
				}
				const next = Number(patch[key]);
				if (Math.abs(next - Number(this[key] || 0)) >= 1) {
					this[key] = next;
				}
			};
			setNum('status_bar_height');
			setNum('nav_content_h');
			setNum('nav_right_pad');
			setNum('nav_bar_h');
			setNum('nav_occupy_h');
			setNum('window_height');
		},

		get_nav_bottom_pad() {
			try {
				const app = getApp();
				const client = app && app.globalData && typeof app.globalData.application_client_type == 'function'
					? app.globalData.application_client_type()
					: '';
				if (['weixin', 'alipay', 'baidu', 'qq', 'kuaishou'].indexOf(client) !== -1) {
					return this.rpx_to_px(12);
				}
			} catch (e) {}
			return 0;
		},

		init_nav_metrics(force = false) {
			if (this.nav_layout_ready && !force) {
				return;
			}
			let statusBarHeight = 0;
			let navContentHeight = 0;
			let navRightPad = 12;
			let windowHeight = 667;
			try {
				const app = getApp();
				let sys = {};
				if (app && app.globalData && typeof app.globalData.get_system_info == 'function') {
					sys = app.globalData.get_system_info(null, null, true) || {};
				}
				if (!sys || sys.windowWidth == null) {
					sys = uni.getSystemInfoSync() || {};
				}
				statusBarHeight = Number(sys.statusBarHeight || 0);
				windowHeight = Number(sys.windowHeight || 667);
				const win_w = Number(sys.windowWidth || 375);
				if (!(statusBarHeight > 0)) {
					statusBarHeight = Number(
						(sys.safeAreaInsets && sys.safeAreaInsets.top)
						|| (sys.safeArea && sys.safeArea.top)
						|| 0
					);
				}
				try {
					const mb = get_menu_button_rect_safe();
					if (mb) {
						statusBarHeight = Number(mb.top || statusBarHeight);
						navContentHeight = Number(mb.height || 0);
						navRightPad = Math.max(12, win_w - Number(mb.left || win_w) + 6);
					}
				} catch (e2) {}
			} catch (e) {
				statusBarHeight = 0;
			}
			if (!(navContentHeight > 0)) {
				navContentHeight = this.rpx_to_px(88);
			}
			const bottomPad = this.get_nav_bottom_pad();
			const navBarHeight = statusBarHeight + navContentHeight + bottomPad;
			this.apply_nav_layout({
				status_bar_height: statusBarHeight,
				nav_content_h: navContentHeight,
				nav_right_pad: navRightPad,
				window_height: windowHeight,
				nav_bar_h: navBarHeight,
				nav_occupy_h: navBarHeight,
			});
			this.nav_layout_ready = true;
			if (!(this.composer_occupy_h > 0)) {
				this.composer_occupy_h = this.rpx_to_px(104);
			}
		},

		schedule_nav_remeasure() {},

		measure_chrome() {
			this.$nextTick(() => {
				if (!this.page_alive) {
					return;
				}
				try {
					uni.createSelectorQuery().in(this)
						.select('.nav-wrap').boundingClientRect()
						.select('.header-meta').boundingClientRect()
						.select('.composer-fixed').boundingClientRect()
						.exec((res) => {
							if (!this.page_alive) {
								return;
							}
							const nav = res && res[0];
							const meta = res && res[1];
							const composer = res && res[2];
							if (nav && nav.height > 0) {
								const navH = Math.round(nav.height);
								const metaH = Math.round((meta && meta.height) || 0);
								const occupyH = navH + metaH;
								if (Math.abs(navH - Number(this.nav_bar_h || 0)) >= 1) {
									this.nav_bar_h = navH;
								}
								if (Math.abs(occupyH - Number(this.nav_occupy_h || 0)) >= 1) {
									this.nav_occupy_h = occupyH;
								}
							}
							if (composer && composer.height > 0) {
								const composerH = Math.round(composer.height);
								if (Math.abs(composerH - Number(this.composer_occupy_h || 0)) >= 1) {
									this.composer_occupy_h = composerH;
								}
							}
						});
				} catch (e) {}
			});
		},

		prevent_touch_move() {
			
		},

		prevent_default_event() {
			
		},

		load_recent_emoji() {
			
				try {
					const list = uni.getStorageSync(RECENT_EMOJI_CACHE_KEY);
					this.recent_emoji_list = Array.isArray(list) ? list.filter((item) => !isEmpty(item)).slice(0, RECENT_EMOJI_MAX) : [];
				} catch (e) {
					this.recent_emoji_list = [];
				}
			
		},

		save_recent_emoji(emoji) {
			
				if (isEmpty(emoji)) {
					return;
				}
				let list = [];
				try {
					const cached = uni.getStorageSync(RECENT_EMOJI_CACHE_KEY);
					list = Array.isArray(cached) ? cached.filter((item) => !isEmpty(item)) : [];
				} catch (e) {
					list = [];
				}
				const next = [emoji].concat(list.filter((item) => item !== emoji)).slice(0, RECENT_EMOJI_MAX);
				try {
					uni.setStorageSync(RECENT_EMOJI_CACHE_KEY, next);
				} catch (e) {}
			
		},

		next_key() {
			
				msg_key_seed += 1;
				return 'm-' + msg_key_seed;
			
		},

		clear_scroll_layout_timers() {
			
				scroll_layout_timers.forEach((id) => clearTimeout(id));
				scroll_layout_timers = [];
			
		},

		pin_scroll_bottom() {
			
				if (!this.page_alive) {
					return;
				}
				scroll_pin_seq += 1;
				this.$nextTick(() => {
					if (!this.page_alive) {
						return;
					}
					const go = (use_selector) => {
						const opt = {
							duration: 0,
							fail: () => {
								if (use_selector) {
									uni.pageScrollTo({ scrollTop: 999999, duration: 0 });
								}
							},
						};
						if (use_selector) {
							opt.selector = '#msg-bottom';
						} else {
							opt.scrollTop = 999999;
						}
						uni.pageScrollTo(opt);
					};
					go(true);
					go(false);
				});
			
		},

		page_scroll_to_id(dom_id) {
			
				if (!dom_id || !this.page_alive) {
					return;
				}
				const go = () => {
					if (!this.page_alive) {
						return;
					}
					const offset = -Math.max(8, Number(this.nav_occupy_h || 0) + 8);
					try {
						uni.pageScrollTo({
							selector: '#' + dom_id,
							offsetTop: offset,
							duration: 0,
						});
					} catch (e) {}
					const scope = this;
					const query = scope ? uni.createSelectorQuery().in(scope) : uni.createSelectorQuery();
					query.select('#' + dom_id).boundingClientRect().selectViewport().scrollOffset().exec((res) => {
						if (!this.page_alive) {
							return;
						}
						const rect = res && res[0];
						const scroll = res && res[1];
						if (!rect || !scroll) {
							return;
						}
						const top = Math.max(0, Number(scroll.scrollTop || 0) + Number(rect.top || 0) + offset);
						uni.pageScrollTo({
							scrollTop: top,
							duration: 0,
						});
					});
				};
				this.$nextTick(() => {
					go();
					setTimeout(go, 80);
					setTimeout(go, 220);
				});
			
		},

		scroll_to_bottom() {
			
				this.pin_scroll_bottom();
			
		},

		scroll_to_bottom_after_layout(reveal = false) {
			
				if (!this.page_alive) {
					return;
				}
				this.clear_scroll_layout_timers();
				this.pin_scroll_bottom();
				const delays = reveal ? [80, 200, 480] : [80, 240];
				delays.forEach((ms, idx) => {
					const last = reveal && idx == delays.length - 1;
					const tid = setTimeout(() => {
						this.pin_scroll_bottom();
						if (last) {
							const rid = setTimeout(() => {
								if (this.page_alive) {
									this.list_ready = true;
									this.measure_chrome();
									if (pending_session_revive) {
										this.try_enter_auto_continue();
									}
								}
							}, 32);
							scroll_layout_timers.push(rid);
						}
					}, ms);
					scroll_layout_timers.push(tid);
				});
			
		},

		format_msg_detail_time(ts) {
			
				if (ts != null && typeof ts == 'string') {
					const raw = String(ts).trim();
					if (raw && (raw.indexOf('月') >= 0 || raw.indexOf(':') >= 0) && raw.indexOf('T') < 0 && Number.isNaN(Number(raw))) {
						return raw;
					}
				}
				let sec = parseInt(ts || 0, 10);
				if (!(sec > 0)) {
					return '';
				}
				if (sec > 9999999999) {
					sec = Math.floor(sec / 1000);
				}
				const d = new Date(sec * 1000);
				if (Number.isNaN(d.getTime())) {
					return '';
				}
				const pad = (n) => (n < 10 ? '0' : '') + n;
				const now = new Date();
				const same_year = d.getFullYear() === now.getFullYear();
				const date_part = same_year
					? (d.getMonth() + 1) + '月' + d.getDate() + '日'
					: d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
				return date_part + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
			
		},

		msg_dom_id(item, index) {
			
				const rid = Number(item?.record_id || 0);
				if (rid > 0) {
					return 'msg-rid-' + rid;
				}
				return 'msg-' + index;
			
		},

		can_recall_item(item) {
			
				if (!item || !item.is_self || item.is_system || item.is_mode_tip || item.is_pure || item.is_thinking) {
					return false;
				}
				if (item.send_status == 'fail' || item.send_status == 'sending') {
					return false;
				}
				if (!chat_can_recall()) {
					return false;
				}
				const rid = Number(item.record_id || 0);
				if (!(rid > 0)) {
					return false;
				}
				return chat_recall_still_valid(item.add_time);
			
		},

		recall_tip_text(raw, is_self) {
			
				if (is_self) {
					return '你撤回了一条信息';
				}
				const text = String(raw || '').trim();
				return text || '撤回了一条消息';
			
		},

		is_text_recall_source(item) {
			
				if (!item) {
					return false;
				}
				const dt = item.data_type || 'text';
				return dt == 'text' || dt == 'recall';
			
		},

		pick_recall_edit_text(item) {
			
				if (!item || !this.is_text_recall_source(item)) {
					return '';
				}
				const from_payload = (item.send_payload && typeof item.send_payload == 'object')
					? String(item.send_payload.content || item.send_payload.text || '')
					: '';
				return String(item.recall_text || item.text || from_payload || '').trim();
			
		},

		to_time_ms(value) {
			
				const n = Number(value || 0) || 0;
				if (!(n > 0)) {
					return 0;
				}
				return n < 1e12 ? n * 1000 : n;
			
		},

		recall_at_ms(item) {
			
				if (!item) {
					return 0;
				}
				if (Number(item.recall_at || 0) > 0) {
					return Number(item.recall_at);
				}
				return this.to_time_ms(item.upd_time);
			
		},

		show_recall_reedit(item) {
			
				if (!item || !(item.data_type == 'recall' || item.is_system)) {
					return false;
				}
				if (!item.can_reedit || isEmpty(item.recall_text)) {
					return false;
				}
				const at = this.recall_at_ms(item);
				if (!(at > 0)) {
					return false;
				}
				return (this.recall_now - at) < REEDIT_TTL_MS;
			
		},

		stop_reedit_tick() {
			
				if (reedit_tick_timer) {
					clearInterval(reedit_tick_timer);
					reedit_tick_timer = null;
				}
			
		},

		ensure_reedit_tick() {
			
				this.recall_now = Date.now();
				const has_live = this.message_list.some((row) => {
					if (!row || !row.can_reedit || isEmpty(row.recall_text)) {
						return false;
					}
					const at = this.recall_at_ms(row);
					return at > 0 && (Date.now() - at) < REEDIT_TTL_MS;
				});
				if (!has_live) {
					this.stop_reedit_tick();
					return;
				}
				if (reedit_tick_timer) {
					return;
				}
				reedit_tick_timer = setInterval(() => {
					this.recall_now = Date.now();
					const still = this.message_list.some((row) => {
						if (!row || !row.can_reedit || isEmpty(row.recall_text)) {
							return false;
						}
						const at = this.recall_at_ms(row);
						return at > 0 && (Date.now() - at) < REEDIT_TTL_MS;
					});
					if (!still) {
						this.stop_reedit_tick();
					}
				}, 1000);
			
		},

		show_msg_read_status(item) {
			
				if (!this.show_read_receipt) {
					return false;
				}
				if (!item || !item.is_self || item.is_system || item.is_mode_tip || item.is_pure || item.is_thinking) {
					return false;
				}
				if (item.data_type == 'recall') {
					return false;
				}
				if (item.send_status == 'fail' || item.send_status == 'sending') {
					return false;
				}
				return true;
			
		},

		order_card_head(order = {}) {
			
				const bits = [];
				if (order.order_no) {
					bits.push('订单号 ' + order.order_no);
				}
				if (order.status_name) {
					bits.push(order.status_name);
				}
				if (order.total_price !== undefined && order.total_price !== null && order.total_price !== '') {
					bits.push('¥' + order.total_price);
				}
				if (order.add_time) {
					bits.push(order.add_time);
				}
				return bits.join(' · ') || '订单';
			
		},

		aftersale_card_head(as = {}) {
			
				const bits = ['售后单'];
				if (as.type_name) {
					bits.push(as.type_name);
				}
				if (as.status_name) {
					bits.push(as.status_name);
				}
				if (as.order_no) {
					bits.push('订单 ' + as.order_no);
				}
				if (as.price !== undefined && as.price !== null && as.price !== '') {
					bits.push('¥' + as.price);
				}
				if (as.add_time) {
					bits.push(as.add_time);
				}
				return bits.join(' · ');
			
		},

		consult_panel_for_type(type) {
			
				const ext = (this.friend_base && this.friend_base.ext) || {};
				const raw = ext.consult_panel;
				if (!raw || typeof raw != 'object') {
					return null;
				}
				const key = type || raw.type || 'goods';
				const tab = (raw.tabs && raw.tabs[key]) ? raw.tabs[key] : null;
				if (tab && typeof tab == 'object') {
					return {
						...raw,
						type: key,
						list: Array.isArray(tab.list) ? tab.list : [],
						send_label: tab.send_label || raw.send_label || '',
						title: tab.title || raw.title || '',
					};
				}
				// 无 tabs 时：仅当顶层 type 匹配才用 list，避免商品 list 串到订单
				if (Array.isArray(raw.list) && (!raw.type || raw.type == key)) {
					return {
						...raw,
						type: key,
						list: raw.list,
					};
				}
				return {
					...raw,
					type: key,
					list: [],
				};
			
		},

		consult_item_search_text(type, item = {}) {
			
				const bits = [];
				if (type == 'goods' || type == 'cart') {
					bits.push(item.title || '', String(item.id || item.goods_id || ''), item.spec_text || '');
				} else if (type == 'order') {
					bits.push(item.order_no || '', item.goods_title || '', String(item.id || ''));
					(item.items || []).forEach((row) => bits.push(row.title || ''));
				} else if (type == 'aftersale') {
					bits.push(item.order_no || '', item.goods_title || '', item.reason || '', String(item.id || ''));
					(item.items || []).forEach((row) => bits.push(row.title || ''));
				} else if (type == 'source') {
					bits.push(item.value || item.url || '', item.time || '');
				}
				return bits.join(' ').toLowerCase();
			
		},

		consult_goods_rows(item = {}) {
			
				const rows = Array.isArray(item.items) ? item.items : [];
				if (rows.length > 0) {
					return rows;
				}
				if (item.goods_title || item.images) {
					return [{
						title: item.goods_title || '',
						images: item.images || '',
						price: item.total_price != null && item.total_price !== '' ? item.total_price : item.price,
						buy_number: item.buy_number || item.number || 0,
					}];
				}
				return [];
			
		},

		consult_row_cover(item = {}) {
			
				if (this.consult_popup_type == 'goods' || this.consult_popup_type == 'cart') {
					return item.images || this.default_avatar;
				}
				const rows = this.consult_goods_rows(item);
				return (rows[0] && rows[0].images) || item.images || this.default_avatar;
			
		},

		consult_row_title(item = {}) {
			
				const type = this.consult_popup_type;
				if (type == 'goods' || type == 'cart') {
					return item.title || '商品';
				}
				const rows = this.consult_goods_rows(item);
				return (rows[0] && rows[0].title) || item.goods_title || (type == 'order' ? '商品' : '售后商品');
			
		},

		consult_row_price(item = {}) {
			
				if (this.consult_popup_type == 'goods' || this.consult_popup_type == 'cart') {
					if (isEmpty(item.price)) {
						return '';
					}
					const stock = parseInt(item.stock || 0) || 0;
					if (this.consult_popup_type == 'cart' && stock > 0) {
						return chat_currency_symbol() + item.price + ' x' + stock;
					}
					return chat_currency_symbol() + item.price;
				}
				const rows = this.consult_goods_rows(item);
				const goods = rows[0] || {};
				if (!isEmpty(goods.price)) {
					return chat_currency_symbol() + goods.price;
				}
				if (!isEmpty(item.price)) {
					return chat_currency_symbol() + item.price;
				}
				if (!isEmpty(item.total_price)) {
					return chat_currency_symbol() + item.total_price;
				}
				return '';
			
		},

		strip_consult_meta(item) {
			
				const row = { ...(item || {}) };
				delete row.is_current;
				return row;
			
		},

		build_consult_send_payload(type, item) {
			
				if (!item || typeof item != 'object') {
					return null;
				}
				const row = this.strip_consult_meta(item);
				if (type == 'goods' || type == 'cart') {
					return {
						data_type: 'goods',
						id: row.goods_id || row.id,
						title: row.title || '',
						price: row.price,
						images: row.images || '',
						goods_url: row.goods_url || '',
					};
				}
				if (type == 'order') {
					return {
						data_type: 'order',
						id: row.id,
						order_no: row.order_no || '',
						status: row.status,
						status_name: row.status_name || '',
						total_price: row.total_price,
						goods_title: row.goods_title || '',
						images: row.images || '',
						items: row.items || [],
						add_time: row.add_time || '',
						order_url: row.order_url || '',
						list: [row],
					};
				}
				if (type == 'aftersale') {
					return {
						data_type: 'aftersale',
						id: row.id,
						order_id: row.order_id || 0,
						order_no: row.order_no || '',
						status: row.status,
						status_name: row.status_name || '',
						type: row.type,
						type_name: row.type_name || '',
						price: row.price,
						reason: row.reason || '',
						msg: row.msg || '',
						number: row.number || 0,
						goods_title: row.goods_title || '',
						images: row.images || '',
						items: row.items || [],
						add_time: row.add_time || '',
						aftersale_url: row.aftersale_url || '',
						order_url: row.order_url || '',
					};
				}
				return null;
			
		},

		sync_friend_base(base = null) {
			
				this.friend_base = base || chat_get_friend_base();
			
		},

		refresh_friend_base() {
			
				this.sync_friend_base();
				if (get_chat_state().connect_status === 1 && get_chat_state().receive_user?.id) {
					chat_load_user_base();
				}
			
		},

		on_friend_base(base) {
			
				if (!this.page_alive) {
					return;
				}
				this.sync_friend_base(base);
			
		},

		open_consult_popup_event(e) {
			
				const type = e?.currentTarget?.dataset?.type || 'goods';
				if (!chat_site_logged_in()) {
					return;
				}
				// 对齐 PC：咨询端不提供轨迹面板
				if (type == 'source') {
					return;
				}
				this.consult_popup_type = type;
				this.consult_keyword_input = '';
				this.consult_keyword = '';
				this.input_focus = false;
				this.keyboard_height = 0;
				this.refresh_friend_base();
				this.$nextTick(() => {
					const ref = this.$refs.consult_popup_ref;
					ref && ref.open && ref.open();
				});
			
		},

		close_consult_popup_event() {
			const ref = this.$refs.consult_popup_ref;
			if (ref && ref.close) {
				ref.close();
			}
			skip_hide_panel_until = Date.now() + 400;
		},

		on_consult_popup_change(e) {
			
				if (e && e.show === true) {
					this.consult_popup_show = true;
					return;
				}
				if (e && e.show === false) {
					this.consult_popup_show = false;
					skip_hide_panel_until = Date.now() + 400;
				}
			
		},

		consult_search_input_event(e) {
			
				this.consult_keyword_input = e?.detail?.value || '';
				this.consult_keyword = String(this.consult_keyword_input || '').trim();
			
		},

		consult_search_confirm_event() {
			
				this.consult_keyword = String(this.consult_keyword_input || '').trim();
			
		},

		open_consult_track_event(e) {
			
				const idx = parseInt(e?.currentTarget?.dataset?.idx, 10);
				const item = Number.isFinite(idx) ? (this.consult_filtered_list[idx] || null) : null;
				const url = String((item && (item.value || item.url)) || '').trim();
				if (isEmpty(url) || !/^https?:\/\//i.test(url)) {
					return;
				}
				// #ifdef H5
				window.open(url);
				return;
				// #endif
				// #ifndef H5
				uni.setClipboardData({
					data: url,
					success: () => showToast('链接已复制'),
				});
				// #endif
			
		},

		send_consult_item_event(idx) {
			
				if (this.consult_popup_type == 'source') {
					return;
				}
				if (!this.assert_can_compose()) {
					return;
				}
				const type = this.consult_popup_type;
				const item = this.consult_filtered_list[idx] || null;
				const payload = this.build_consult_send_payload(type, item);
				if (!payload) {
					showToast('数据有误');
					return;
				}
				const row = this.append_local_message(payload, true, {
					send_status: 'sending',
					send_payload: payload,
				});
				const ok = chat_send_message(payload);
				if (ok === 'queued') {
					mark_send_revive_queued();
				}
				if (!ok) {
					this.mark_send_fail(row.key);
					return;
				}
				this.close_consult_popup_event();
				if (ok !== 'queued') {
					this.schedule_mark_send_ok(row.key);
				}
			
		},

		split_text_segments(text = '') {
			
				const raw = String(text || '');
				if (!raw) {
					return [];
				}
				const reg = /(https?:\/\/[^\s]+|(?:\/)?pages\/[^\s]+)/gi;
				const segments = [];
				let last = 0;
				let match = reg.exec(raw);
				while (match) {
					if (match.index > last) {
						segments.push({ type: 'text', value: raw.slice(last, match.index) });
					}
					segments.push({ type: 'link', value: match[0] });
					last = match.index + match[0].length;
					match = reg.exec(raw);
				}
				if (last < raw.length) {
					segments.push({ type: 'text', value: raw.slice(last) });
				}
				return segments.length > 0 ? segments : [{ type: 'text', value: raw }];
			
		},

		ai_summary_body_text(text) {
			
				let s = String(text || '');
				s = s.replace(/^【AI接待摘要】\s*/, '');
				s = s.replace(/^AI接待摘要[:：]?\s*/, '');
				return s;
			
		},

		append_local_message(content, is_self = true, options = {}) {
			
				const parsed = parse_message_content(content);
				const chat_state = get_chat_state();
				const is_pure = !!options.is_pure;
				const is_ai_summary = !!options.is_ai_summary || is_ai_summary_message(content);
				const is_mode_tip = !is_ai_summary && (!!options.is_mode_tip || is_mode_tip_message(content));
				const is_system = !!options.is_system || is_system_message(content) || parsed.data_type == 'recall' || is_recall_message(content);
				const is_thinking = !!options.is_thinking;
				const is_ai_reply = !is_ai_summary && (!!options.is_ai_reply || is_ai_bot_user(options.user));
				const name = is_pure || is_ai_summary
					? ''
					: (options.name
						|| (is_self
							? (chat_state.current_user?.name || '客服')
							: (options.user?.name || (is_ai_reply ? '智能客服' : (chat_state.receive_user?.name || this.chat_title || '用户')))));
				// 对齐 PC：非纯提示/系统消息时双方都显示发送方名称
				const show_sender = !is_pure && !is_ai_summary && !is_mode_tip && !is_system && !is_thinking && !!String(name || '').trim();
				const body_text = is_ai_summary ? this.ai_summary_body_text(parsed.text) : parsed.text;
				const row = {
					key: options.key || this.next_key(),
					is_self: is_pure || is_ai_summary || is_mode_tip || is_system || is_thinking ? false : is_self,
					is_pure,
					is_ai_summary,
					is_mode_tip,
					is_system: is_system && !is_mode_tip && !is_ai_summary,
					is_thinking,
					show_sender,
					name,
					avatar: is_pure || is_ai_summary || is_mode_tip || is_system
						? ''
						: (options.avatar
							|| (is_self
								? (chat_state.current_user?.avatar || this.current_avatar || this.default_avatar)
								: (options.user?.avatar || (is_ai_reply ? (chat_ai_bot_user()?.avatar || this.default_avatar) : (chat_state.receive_user?.avatar || this.receive_avatar || this.default_avatar))))),
					data_type: parsed.data_type,
					text: body_text,
					text_segments: this.split_text_segments(body_text),
					url: parsed.url,
					goods_id: parsed.goods_id || 0,
					goods: parsed.goods || null,
					order: parsed.order || null,
					aftersale: parsed.aftersale || null,
					file: parsed.file || null,
					quote: parsed.quote || null,
					show_time: false,
					time_text: options.time_text || '',
					add_time: Number(options.add_time || 0) || this.now_unix_sec(),
					record_id: Number(options.record_id || 0),
					upload_status: options.upload_status || '',
					upload_progress: Number(options.upload_progress || 0),
					media_ready: options.media_ready == null ? true : !!options.media_ready,
					poster: options.poster || parsed.poster || '',
					duration_text: options.duration_text || '',
					local_url: options.local_url || '',
					file_path: options.file_path || '',
					send_status: options.send_status || '',
					send_payload: options.send_payload || null,
					is_read: parseInt(options.is_read || 0) == 1 ? 1 : 0,
					can_reedit: !!options.can_reedit,
					recall_text: String(options.recall_text || ''),
					recall_at: Number(options.recall_at || 0) || 0,
					is_emoji_only: !is_ai_summary && parsed.data_type == 'text' && this.is_emoji_only_text(body_text),
					duration_sec: Number(options.duration_sec != null ? options.duration_sec : parsed.duration) || 0,
					is_voice: parseInt(options.is_voice != null ? options.is_voice : parsed.voice) == 1
						|| chat_is_voice_message(content)
						|| chat_is_voice_message(options.send_payload)
						? 1 : 0,
					voice_played: parseInt(options.voice_played || 0) == 1 ? 1 : 0,
					upload_chunk_key: String(options.upload_chunk_key || ''),
				};
				this.message_list.push(row);
				if (row.data_type == 'video' && isEmpty(row.poster)) {
					this.enqueue_video_poster(row.key, row.local_url || row.file_path || row.url);
				}
				if (!is_pure && !is_ai_summary && !is_mode_tip && !is_system && row.goods_id > 0 && !row.goods) {
					this.request_business_goods([row.goods_id]);
				}
				if (this.list_ready) {
					this.scroll_to_bottom();
				}
				return row;
			
		},

		patch_local_message(key, patch = {}) {
			
				if (!this.page_alive) {
					return;
				}
				const idx = this.message_list.findIndex((row) => row.key === key);
				if (idx < 0) {
					return;
				}
				this.message_list.splice(idx, 1, { ...this.message_list[idx], ...patch });
			
		},

		on_media_ready(key) {
			
				if (!this.page_alive || isEmpty(key)) {
					return;
				}
				this.stop_fake_progress(key);
				this.patch_local_message(key, {
					media_ready: true,
					upload_status: '',
					upload_progress: 100,
					send_status: '',
				});
			
		},

		on_send_image_load(item) {
			
				if (!item || item.media_ready) {
					return;
				}
				if (item.upload_status == 'uploading') {
					return;
				}
				this.on_media_ready(item.key);
			
		},

		on_send_image_error(item) {
			
				if (!item || !item.key) {
					return;
				}
				if (item.local_url && item.url && item.local_url != item.url) {
					this.patch_local_message(item.key, { local_url: '' });
				}
			
		},

		media_progress_text(progress) {
			
				const n = Math.max(0, Math.min(99, Math.floor(Number(progress) || 0)));
				return n + '%';
			
		},

		media_progress_ring_style(progress) {
			
				const p = Math.max(0, Math.min(99, Math.floor(Number(progress) || 0)));
				const deg = p * 3.6;
				return {
					background: 'conic-gradient(from -90deg, #ffffff 0deg, #ffffff ' + deg + 'deg, rgba(255,255,255,0.28) ' + deg + 'deg, rgba(255,255,255,0.28) 360deg)',
				};
			
		},

		fake_progress_ceiling(file_size) {
			
				const mb = (Number(file_size) || 0) / (1024 * 1024);
				if (mb <= 0) {
					return 6;
				}
				if (mb <= 2) {
					return 5;
				}
				if (mb <= 10) {
					return 7;
				}
				if (mb <= 50) {
					return 9;
				}
				if (mb <= 100) {
					return 11;
				}
				return 12;
			
		},

		fake_progress_tail_ceiling(file_size) {
			
				const mb = (Number(file_size) || 0) / (1024 * 1024);
				if (mb <= 2) {
					return 7;
				}
				if (mb <= 10) {
					return 14;
				}
				if (mb <= 50) {
					return 16;
				}
				if (mb <= 100) {
					return 20;
				}
				return 22;
			
		},

		fake_progress_tick_ms(file_size) {
			
				const mb = (Number(file_size) || 0) / (1024 * 1024);
				if (mb <= 0) {
					return 700;
				}
				if (mb <= 2) {
					return 900;
				}
				if (mb <= 10) {
					return 800;
				}
				if (mb <= 50) {
					return 1000;
				}
				if (mb <= 100) {
					return 1200;
				}
				return 1400;
			
		},

		fake_progress_tail_skip(file_size) {
			
				const mb = (Number(file_size) || 0) / (1024 * 1024);
				if (mb <= 10) {
					return 3;
				}
				if (mb <= 50) {
					return 2;
				}
				return 2;
			
		},

		clear_fake_progress_timer(key) {
			
				if (fake_progress_timers[key]) {
					clearInterval(fake_progress_timers[key]);
					delete fake_progress_timers[key];
				}
			
		},

		start_fake_progress(key, options = {}) {
			
				if (isEmpty(key)) {
					return;
				}
				const file_size = Number(options.file_size || 0) || 0;
				const ceiling = this.fake_progress_ceiling(file_size);
				const tail_ceiling = this.fake_progress_tail_ceiling(file_size);
				const tick_ms = this.fake_progress_tick_ms(file_size);
				const tail_skip = this.fake_progress_tail_skip(file_size);
				let tail_wait = 0;
				this.clear_fake_progress_timer(key);
				fake_progress_timers[key] = setInterval(() => {
					if (!this.page_alive) {
						this.clear_fake_progress_timer(key);
						return;
					}
					const last = upload_progress_last[key] || 0;
					if (last >= tail_ceiling) {
						return;
					}
					let next = last;
					if (last < ceiling) {
						next = Math.min(ceiling, last + 1);
					} else {
						tail_wait += 1;
						if (tail_wait < tail_skip) {
							return;
						}
						tail_wait = 0;
						next = Math.min(tail_ceiling, last + 1);
					}
					if (next <= last) {
						return;
					}
					upload_progress_last[key] = next;
					this.patch_local_message(key, { upload_progress: next });
				}, tick_ms);
			
		},

		stop_fake_progress(key) {
			
				this.clear_fake_progress_timer(key);
				delete upload_progress_last[key];
			
		},

		ensure_uploading_progress_and_resume() {
			
				this.message_list.forEach((row) => {
					if (!row || row.upload_status != 'uploading' || row.send_status != 'sending') {
						return;
					}
					const key = row.key;
					const last = parseInt(upload_progress_last[key] || row.upload_progress || 1) || 1;
					upload_progress_last[key] = last;
					if (!fake_progress_timers[key]) {
						const path = row.file_path || row.local_url || '';
						if (!isEmpty(path)) {
							uni.getFileInfo({
								filePath: path,
								success: (res) => {
									if (this.page_alive) {
										this.start_fake_progress(key, { file_size: (res && res.size) || 0 });
									}
								},
								fail: () => {
									if (this.page_alive) {
										this.start_fake_progress(key);
									}
								},
							});
						} else {
							this.start_fake_progress(key);
						}
					}
					if (media_upload_inflight.has(key)) {
						return;
					}
					const progress = parseInt(row.upload_progress || 0) || 0;
					if (progress >= 99) {
						return;
					}
					const file_path = row.file_path || row.local_url || '';
					if (isEmpty(file_path)) {
						return;
					}
					const payload = row.send_payload || {};
					chat_resume_connect();
					this.sync_connect_ui();
					this.upload_and_send_media_row(key, file_path, {
						data_type: row.data_type || payload.data_type || 'images',
						quote: payload.quote || row.quote || null,
						file_name: payload.name || payload.content || '',
						poster: row.poster || '',
						chunk_key: row.upload_chunk_key || '',
						voice: parseInt(payload.voice || row.is_voice || 0) == 1 ? 1 : 0,
						duration: row.duration_sec || payload.duration || 0,
					});
				});
			
		},

		to_absolute_local_path(path) {
			
				const s = String(path || '');
				if (isEmpty(s) || /^(https?:)/i.test(s)) {
					return s;
				}
				// #ifdef APP-PLUS
				try {
					if (typeof plus != 'undefined' && plus.io && plus.io.convertLocalFileSystemURL) {
						const abs = plus.io.convertLocalFileSystemURL(s);
						if (!isEmpty(abs)) {
							return abs;
						}
					}
				} catch (e) {}
				// #endif
				return s;
			
		},

		to_media_src(path) {
			
				const s = String(path || '');
				if (isEmpty(s)) {
					return '';
				}
				if (/^(https?:|blob:|data:|wxfile:|file:)/i.test(s)) {
					return s;
				}
				// #ifdef APP-PLUS
				try {
					if (typeof plus != 'undefined' && plus.io && plus.io.convertLocalFileSystemURL) {
						const abs = plus.io.convertLocalFileSystemURL(s);
						if (!isEmpty(abs)) {
							return /^(https?:|file:)/i.test(abs) ? abs : ('file://' + abs);
						}
					}
				} catch (e) {}
				// #endif
				return s;
			
		},

		capture_video_frame_canvas(src) {
			
				return new Promise((resolve) => {
					try {
						if (typeof document == 'undefined' || typeof document.createElement != 'function') {
							resolve('');
							return;
						}
						const video = document.createElement('video');
						video.muted = true;
						video.playsInline = true;
						video.setAttribute('playsinline', 'true');
						video.setAttribute('webkit-playsinline', 'true');
						video.setAttribute('crossorigin', 'anonymous');
						video.crossOrigin = 'anonymous';
						video.preload = 'auto';
						video.src = this.to_media_src(src);
						let done = false;
						const finish = (url) => {
							if (done) {
								return;
							}
							done = true;
							try {
								video.pause();
								video.removeAttribute('src');
								video.load();
							} catch (e) {}
							resolve(url || '');
						};
						const timer = setTimeout(() => finish(''), 4000);
						const snap = () => {
							try {
								let w = video.videoWidth || 0;
								let h = video.videoHeight || 0;
								if (!(w > 0 && h > 0)) {
									clearTimeout(timer);
									finish('');
									return;
								}
								const max_w = 480;
								if (w > max_w) {
									h = Math.round(h * max_w / w);
									w = max_w;
								}
								const canvas = document.createElement('canvas');
								canvas.width = w;
								canvas.height = h;
								const ctx = canvas.getContext('2d');
								ctx.drawImage(video, 0, 0, w, h);
								clearTimeout(timer);
								finish(canvas.toDataURL('image/jpeg', 0.82));
							} catch (e) {
								clearTimeout(timer);
								finish('');
							}
						};
						video.addEventListener('loadeddata', () => {
							try {
								if (video.currentTime < 0.05) {
									video.currentTime = Math.min(0.1, (video.duration || 1) * 0.01);
								} else {
									snap();
								}
							} catch (e) {
								snap();
							}
						});
						video.addEventListener('seeked', snap);
						video.addEventListener('error', () => {
							clearTimeout(timer);
							finish('');
						});
						// #ifdef H5
						const play_ret = video.play();
						if (play_ret && typeof play_ret.catch == 'function') {
							play_ret.catch(() => {});
						}
						// #endif
					} catch (e) {
						resolve('');
					}
				});
			
		},

		persist_chat_image(path) {
			
				return new Promise((resolve) => {
					const s = String(path || '');
					if (isEmpty(s) || /^(https?:|data:|blob:)/i.test(s)) {
						resolve(this.to_poster_src(s));
						return;
					}
					// #ifdef APP-PLUS || MP-WEIXIN
					uni.saveFile({
						tempFilePath: s,
						success: (res) => {
							resolve(this.to_poster_src((res && res.savedFilePath) || s));
						},
						fail: () => {
							resolve(this.to_poster_src(s));
						},
					});
					return;
					// #endif
					resolve(this.to_poster_src(s));
				});
			
		},

		plugin_local_path(src) {
			
				let path = String(src || '');
				if (typeof plus != 'undefined' && plus.io && plus.io.convertLocalFileSystemURL) {
					try {
						const abs = plus.io.convertLocalFileSystemURL(path);
						if (!isEmpty(abs)) {
							path = abs;
						}
					} catch (e) {}
				}
				return path.replace(/^file:\/\//i, '');
			
		},

		to_ios_file_url(src) {
			
				let p = String(src || '').replace(/^file:\/\//i, '');
				if (p.indexOf('/var/') == 0) {
					p = '/private' + p;
				}
				return p.indexOf('/') == 0 ? ('file://' + p) : String(src || '');
			
		},

		copy_local_video_to_doc(src) {
			
				return new Promise((resolve) => {
					const raw = String(src || '');
					const fallback = () => resolve(this.plugin_local_path(raw) || raw);
					// #ifndef APP-PLUS
					resolve(raw);
					return;
					// #endif
					// #ifdef APP-PLUS
					if (typeof plus == 'undefined' || !plus.io || !plus.io.resolveLocalFileSystemURL) {
						fallback();
						return;
					}
					const urls = [];
					const add = (u) => {
						if (!isEmpty(u) && urls.indexOf(u) < 0) {
							urls.push(u);
						}
					};
					add(raw);
					const abs = this.to_absolute_local_path(raw);
					add(abs);
					if (abs && abs.indexOf('file://') != 0 && abs.indexOf('/') == 0) {
						add('file://' + abs);
					}
					if (abs && abs.indexOf('/var/') == 0) {
						add('/private' + abs);
						add('file:///private' + abs);
					}
					const try_url = (i) => {
						if (i >= urls.length) {
							fallback();
							return;
						}
						plus.io.resolveLocalFileSystemURL(urls[i], (entry) => {
							plus.io.resolveLocalFileSystemURL('_doc/', (dir) => {
								const name = 'chat_vf_' + Date.now() + '.mp4';
								entry.copyTo(dir, name, (copied) => {
									let full = '';
									if (copied) {
										full = copied.fullPath || '';
										if (isEmpty(full) && typeof copied.toLocalURL == 'function') {
											full = copied.toLocalURL() || '';
										}
									}
									resolve(full || ('_doc/' + name));
								}, () => {
									resolve(entry.fullPath || urls[i]);
								});
							}, () => {
								resolve(entry.fullPath || urls[i]);
							});
						}, () => try_url(i + 1));
					};
					try_url(0);
					// #endif
				});
			
		},

		call_video_frame_once(path, type) {
			
				return new Promise((resolve) => {
					// #ifndef APP-PLUS
					resolve('');
					return;
					// #endif
					// #ifdef APP-PLUS
					if (typeof callVideoFrameInfo != 'function' || isEmpty(path)) {
						resolve('');
						return;
					}
					let done = false;
					const finish = (url) => {
						if (done) {
							return;
						}
						done = true;
						resolve(url || '');
					};
					const timer = setTimeout(() => finish(''), 8000);
					try {
						callVideoFrameInfo({
							data: { path, type },
							success: (res) => {
								clearTimeout(timer);
								if (!this.page_alive) {
									finish('');
									return;
								}
								const b64 = res && res.base64 ? String(res.base64) : '';
								finish(b64);
							},
							fail: () => {
								clearTimeout(timer);
								finish('');
							},
						});
					} catch (e) {
						clearTimeout(timer);
						finish('');
					}
					// #endif
				});
			
		},

		async capture_video_frame_native(src) {
			
				const raw = String(src || '');
				if (isEmpty(raw)) {
					return '';
				}
				if (/^(https?:)/i.test(raw)) {
					return await this.call_video_frame_once(raw, 0);
				}
				// #ifdef APP-PLUS
				if (!this.is_ios_app()) {
					let abs = this.plugin_local_path(this.to_absolute_local_path(raw));
					if (isEmpty(abs)) {
						abs = this.plugin_local_path(raw);
					}
					if (!isEmpty(abs)) {
						const b64 = await this.call_video_frame_once(abs, 1);
						if (!isEmpty(b64)) {
							return b64;
						}
					}
				}
				// #endif
				const local = await this.copy_local_video_to_doc(raw);
				if (this.is_ios_app()) {
					const fs = this.plugin_local_path(local);
					let b64 = await this.call_video_frame_once(fs, 1);
					if (!isEmpty(b64)) {
						return b64;
					}
					return await this.call_video_frame_once(this.to_ios_file_url(local), 0);
				}
				return await this.call_video_frame_once(this.plugin_local_path(local), 1);
			
		},

		async capture_video_first_frame(src) {
			
				if (isEmpty(src)) {
					return '';
				}
				// #ifdef H5
				return await this.capture_video_frame_canvas(src);
				// #endif
				// #ifdef APP-PLUS
				return await this.capture_video_frame_native(src);
				// #endif
				return '';
			
		},

		async prepare_video_poster(src, poster_raw = '') {
			
				try {
					if (!isEmpty(poster_raw)) {
						const saved = await this.persist_chat_image(poster_raw);
						const src_key = String(src || '');
						if (!isEmpty(src_key) && !isEmpty(saved)) {
							video_poster_cache[src_key] = saved;
						}
						return saved;
					}
					const src_key = String(src || '');
					if (isEmpty(src_key)) {
						return '';
					}
					const cached = video_poster_cache[src_key];
					if (!isEmpty(cached)) {
						return cached;
					}
					const captured = await this.capture_video_first_frame(src);
					if (isEmpty(captured)) {
						return '';
					}
					const saved = await this.persist_chat_image(captured);
					if (!isEmpty(saved)) {
						video_poster_cache[src_key] = saved;
					}
					return saved;
				} catch (e) {
					return '';
				}
			
		},

		prepare_video_poster_safe(src, poster_raw = '') {
			
				return new Promise((resolve) => {
					let done = false;
					const finish = (val) => {
						if (done) {
							return;
						}
						done = true;
						resolve(val || '');
					};
					const timer = setTimeout(() => finish(''), VIDEO_POSTER_PREPARE_TIMEOUT_MS);
					this.prepare_video_poster(src, poster_raw).then((val) => {
						clearTimeout(timer);
						finish(val);
					}).catch(() => {
						clearTimeout(timer);
						finish('');
					});
				});
			
		},

		enqueue_video_poster(key, src, force = false) {
			
				if (isEmpty(key) || isEmpty(src)) {
					return;
				}
				const src_s = String(src || '');
				// #ifdef APP-PLUS
				if (/^https?:/i.test(src_s)) {
					return;
				}
				if (this.has_uploading_media) {
					return;
				}
				// #endif
				const cached = video_poster_cache[src];
				if (!isEmpty(cached)) {
					this.patch_local_message(key, { poster: cached });
					return;
				}
				const exist = video_poster_queue.find((job) => job.key == key);
				if (exist) {
					if (force) {
						exist.force = true;
					}
					return;
				}
				video_poster_queue.push({ key, src, force: !!force });
				this.run_video_poster_queue();
			
		},

		async run_video_poster_queue() {
			
				if (video_poster_running) {
					return;
				}
				video_poster_running = true;
				while (this.page_alive && video_poster_queue.length) {
					if (this.playing_video_url || this.has_uploading_media) {
						await new Promise((resolve) => setTimeout(resolve, 800));
						continue;
					}
					const job = video_poster_queue.shift();
					const row = this.message_list.find((item) => item.key === job.key);
					if (!row || row.data_type != 'video') {
						continue;
					}
					if (!job.force && !isEmpty(row.poster)) {
						continue;
					}
					if (!isEmpty(video_poster_cache[job.src])) {
						this.patch_local_message(job.key, { poster: video_poster_cache[job.src] });
						continue;
					}
					const poster = await this.persist_chat_image(await this.capture_video_first_frame(job.src));
					if (!this.page_alive) {
						break;
					}
					if (isEmpty(poster)) {
						continue;
					}
					video_poster_cache[job.src] = poster;
					this.patch_local_message(job.key, { poster: this.to_poster_src(poster) });
				}
				video_poster_running = false;
			
		},

		fill_missing_video_posters() {
			
				if (this.has_uploading_media) {
					return;
				}
				this.message_list.forEach((row) => {
					if (!row || row.data_type != 'video' || !isEmpty(row.poster)) {
						return;
					}
					const src = row.local_url || row.file_path || row.url || '';
					if (/^https?:/i.test(String(src))) {
						return;
					}
					this.enqueue_video_poster(row.key, src);
				});
			
		},

		clear_video_poster_queue() {
			
				video_poster_queue.length = 0;
				video_poster_running = false;
			
		},

		on_video_poster_error(e) {
			
				const key = e?.currentTarget?.dataset?.key || '';
				if (isEmpty(key)) {
					return;
				}
				const row = this.message_list.find((item) => item.key === key);
				if (!row || row.poster_error) {
					return;
				}
				// 小程序不能抽帧，封面坏了也先留着，避免被清空后永远没图
				// #ifdef MP-WEIXIN
				this.patch_local_message(key, { poster_error: 1 });
				return;
				// #endif
				const src = row.local_url || row.file_path || row.url || '';
				if (!isEmpty(src)) {
					delete video_poster_cache[src];
				}
				this.patch_local_message(key, { poster: '', poster_error: 1 });
				this.enqueue_video_poster(key, src);
			
		},

		read_failed_store() {
			
				try {
					const all = uni.getStorageSync(FAILED_STORE_KEY);
					return all && typeof all == 'object' ? all : {};
				} catch (e) {
					return {};
				}
			
		},

		save_failed_message(key) {
			
				const row = this.message_list.find((item) => item.key === key);
				if (!row) {
					return;
				}
				const id = String(this.chat_id || '');
				if (isEmpty(id)) {
					return;
				}
				const all = this.read_failed_store();
				const list = Array.isArray(all[id]) ? all[id].slice() : [];
				const slim = slim_failed_row(row);
				const idx = list.findIndex((item) => item.key === key);
				if (idx >= 0) {
					list.splice(idx, 1, slim);
				} else {
					list.push(slim);
				}
				all[id] = list;
				try {
					uni.setStorageSync(FAILED_STORE_KEY, all);
				} catch (e) {}
			
		},

		remove_failed_message(key) {
			
				const id = String(this.chat_id || '');
				const all = this.read_failed_store();
				if (!Array.isArray(all[id])) {
					return;
				}
				all[id] = all[id].filter((item) => item.key !== key);
				try {
					uni.setStorageSync(FAILED_STORE_KEY, all);
				} catch (e) {}
			
		},

		restore_failed_messages() {
			
				const id = String(this.chat_id || '');
				const list = this.read_failed_store()[id] || [];
				list.forEach((item) => {
					if (!item || !item.key) {
						return;
					}
					if (this.message_list.some((row) => row.key === item.key)) {
						return;
					}
					const payload = item.send_payload || {
						data_type: item.data_type || 'text',
						content: item.text || '',
						url: item.url || '',
						quote: item.quote || null,
					};
					this.append_local_message(payload, true, {
						key: item.key,
						send_status: 'fail',
						media_ready: true,
						local_url: this.to_media_src(item.local_url || ''),
						file_path: item.file_path || '',
						poster: this.to_media_src(item.poster || ''),
						duration_text: item.duration_text || '',
						send_payload: payload,
						quote: item.quote || null,
						upload_chunk_key: item.upload_chunk_key || '',
					});
				});
			
		},

		notify_send_fail(key) {
			
				create_chat_local_push('发送失败', '有一条信息没有发送成功', {
					type: 'chat_resend',
					key,
					chat_id: String(this.chat_id || ''),
				});
			
		},

		mark_send_fail(key) {
			
				this.stop_fake_progress(key);
				const row = this.message_list.find((item) => item.key === key);
				if (!row || Number(row.record_id || 0) > 0) {
					return;
				}
				const is_media = row.data_type == 'images' || row.data_type == 'video';
				this.patch_local_message(key, {
					send_status: 'fail',
					upload_status: 'fail',
					media_ready: is_media ? false : true,
				});
				this.save_failed_message(key);
				this.notify_send_fail(key);
			
		},

		mark_send_ok(key, extra = {}) {
			
				this.stop_fake_progress(key);
				this.remove_failed_message(key);
				this.patch_local_message(key, {
					send_status: '',
					upload_status: '',
					upload_progress: 100,
					media_ready: true,
					...extra,
				});
			
		},

		async upload_and_send_media_row(row_key, file_path, extra = {}) {
			
				if (media_upload_inflight.has(row_key)) {
					return;
				}
				media_upload_inflight.add(row_key);
				const quote = extra.quote || null;
				const data_type = extra.data_type || 'images';
				const cur0 = this.message_list.find((row) => row.key === row_key);
				const chunk_key = String(extra.chunk_key || (cur0 && cur0.upload_chunk_key) || chat_upload_make_chunk_key(row_key));
				this.patch_local_message(row_key, {
					upload_chunk_key: chunk_key,
					file_path: file_path || (cur0 && cur0.file_path) || '',
					upload_status: 'uploading',
					send_status: 'sending',
				});
			
				if (data_type == 'video') {
					const cur_v = this.message_list.find((row) => row.key === row_key);
					const raw_src = file_path || (cur_v && cur_v.local_url) || '';
					const saved = await this.prepare_video_poster_safe(raw_src, extra.poster_raw || '');
					let poster_path = '';
					if (!isEmpty(saved)) {
						poster_path = this.to_poster_src(saved);
					} else if (!isEmpty(extra.poster)) {
						poster_path = String(extra.poster || '');
					} else if (cur_v && !isEmpty(cur_v.poster)) {
						poster_path = String(cur_v.poster || '');
					}
					if (!isEmpty(poster_path) && this.page_alive) {
						this.patch_local_message(row_key, { poster: poster_path });
					} else if (isEmpty(poster_path) && !isEmpty(raw_src)) {
						this.enqueue_video_poster(row_key, raw_src, true);
					}
					extra.poster = poster_path;
				}
				if (!this.page_alive) {
					media_upload_inflight.delete(row_key);
					return;
				}
			
				const apply_progress = (progress) => {
					if (!this.page_alive) {
						return;
					}
					const p = Math.max(0, Math.min(99, Math.floor(Number(progress) || 0)));
					const last = upload_progress_last[row_key] || 0;
					const has_fake = !!fake_progress_timers[row_key];
					// 假进度还在跑：真值不够高时不接管，避免卡在 10% 这类顶格值
					if (has_fake && p < REAL_UPLOAD_PROGRESS_TAKEOVER) {
						return;
					}
					if (has_fake && p <= last) {
						return;
					}
					this.clear_fake_progress_timer(row_key);
					const next = Math.max(last, p);
					if (next <= last) {
						return;
					}
					upload_progress_last[row_key] = next;
					this.patch_local_message(row_key, { upload_progress: next });
				};
			
				try {
					const result = await chat_upload_file({
						file_path,
						data_type,
						file_name: extra.file_name || '',
						voice: parseInt(extra.voice || 0) == 1 ? 1 : 0,
						chunk_key,
						user_type: 'user',
						check_alive: () => this.page_alive,
						on_progress: apply_progress,
					});
					if (!this.page_alive) {
						return;
					}
					if (!result || result.code != 0 || !result.data) {
						this.mark_send_fail(row_key);
						showToast((result && result.msg) || '上传失败');
						return;
					}
					const payload = {
						data_type: result.data.data_type || data_type,
						url: result.data.url || '',
						content: result.data.content || extra.file_name || '',
					};
					if (result.data.name || extra.file_name) {
						payload.name = result.data.name || extra.file_name;
					}
					if (result.data.unit) {
						payload.unit = result.data.unit;
					}
					if (quote) {
						payload.quote = quote;
					}
					if (parseInt(extra.voice || 0) == 1) {
						payload.voice = 1;
						payload.name = '';
						payload.content = '';
						if (parseInt(extra.duration || 0) > 0) {
							payload.duration = parseInt(extra.duration);
						}
					}
					if ((payload.data_type || data_type) == 'video' && parseInt(extra.duration || 0) > 0) {
						payload.duration = parseInt(extra.duration);
					}
					chat_upload_clear_resume(chunk_key);
					let ok = chat_send_message(payload);
					if (!ok) {
						const ready = await this.wait_chat_online();
						if (ready) {
							ok = chat_send_message(payload);
						}
					}
					if (!ok) {
						this.patch_local_message(row_key, { send_payload: payload, url: payload.url });
						this.mark_send_fail(row_key);
						return;
					}
					const cur = this.message_list.find((row) => row.key === row_key);
					const patch = {
						url: payload.url,
						data_type: payload.data_type,
						send_payload: payload,
						upload_progress: 100,
						upload_chunk_key: '',
					};
					if (payload.data_type == 'file' || payload.data_type == 'audio') {
						patch.file = {
							name: payload.name || extra.file_name || '',
							unit: payload.unit || '',
							url: payload.url,
						};
					}
					if (payload.data_type == 'video') {
						if (extra.poster) {
							patch.poster = extra.poster;
						} else if (cur && cur.poster) {
							patch.poster = cur.poster;
						}
						if (cur && cur.local_url) {
							patch.local_url = cur.local_url;
						}
						// #ifdef APP-PLUS
						if (isEmpty(patch.poster)) {
							this.enqueue_video_poster(row_key, file_path || (cur && cur.local_url) || '', true);
						}
						// #endif
					}
					chat_upload_clear_resume(chunk_key);
					if (ok === 'queued') {
						mark_send_revive_queued();
						this.patch_local_message(row_key, {
							...patch,
							send_status: 'sending',
							upload_status: '',
							media_ready: true,
						});
						return;
					}
					this.mark_send_ok(row_key, patch);
				} catch (err) {
					if (!this.page_alive) {
						return;
					}
					this.mark_send_fail(row_key);
					showToast((err && err.message) || '上传失败');
				} finally {
					media_upload_inflight.delete(row_key);
				}
			
		},

		resend_failed_message(e) {
			
				const from_ds = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.key : '';
				const key = from_ds != null && String(from_ds) !== ''
					? String(from_ds)
					: (typeof e == 'string' || typeof e == 'number' ? String(e) : '');
				if (isEmpty(key)) {
					return;
				}
				const row = this.message_list.find((item) => String(item.key) == key);
				if (!row || row.send_status != 'fail') {
					return;
				}
				const is_media = row.data_type == 'images' || row.data_type == 'video';
				this.patch_local_message(row.key, {
					send_status: 'sending',
					upload_status: is_media ? 'uploading' : '',
					media_ready: is_media ? false : true,
					upload_progress: is_media ? 8 : (row.upload_progress || 0),
				});
				if (is_media) {
					upload_progress_last[row.key] = 8;
					const retry_path = row.file_path || row.local_url || '';
					if (!isEmpty(retry_path)) {
						uni.getFileInfo({
							filePath: retry_path,
							success: (res) => {
								if (this.page_alive && res && res.size > 0) {
									this.start_fake_progress(row.key, { file_size: res.size });
								} else {
									this.start_fake_progress(row.key);
								}
							},
							fail: () => this.start_fake_progress(row.key),
						});
					} else {
						this.start_fake_progress(row.key);
					}
				}
				setTimeout(() => {
					if (!this.page_alive) {
						return;
					}
					const cur = this.message_list.find((item) => String(item.key) == key);
					if (!cur || cur.send_status != 'sending') {
						return;
					}
					this.do_resend_failed_message(cur);
				}, RESEND_SPIN_MS);
			
		},

		do_resend_failed_message(row) {
			
				const key = row.key;
				if (row.data_type == 'images' || row.data_type == 'video') {
					if (row.send_payload && !isEmpty(row.send_payload.url)) {
						const ok = chat_send_message(row.send_payload);
						if (ok === 'queued') {
							mark_send_revive_queued();
							this.patch_local_message(key, { send_status: 'sending', upload_status: '', media_ready: true, upload_progress: 100 });
						} else if (ok) {
							this.mark_send_ok(key);
						} else {
							this.mark_send_fail(key);
						}
						return;
					}
					const file_path = row.file_path || row.local_url || '';
					if (isEmpty(file_path)) {
						this.mark_send_fail(key);
						showToast('附件已失效，请重新选择');
						return;
					}
					this.upload_and_send_media_row(key, file_path, {
						data_type: row.data_type,
						quote: row.send_payload?.quote || row.quote || null,
						poster: row.poster || '',
						chunk_key: row.upload_chunk_key || '',
						file_name: (row.send_payload && (row.send_payload.name || row.send_payload.content)) || '',
						voice: parseInt((row.send_payload && row.send_payload.voice) || row.is_voice || 0) == 1 ? 1 : 0,
						duration: row.duration_sec || (row.send_payload && row.send_payload.duration) || 0,
					});
					return;
				}
				if ((row.data_type == 'audio' || row.data_type == 'file') && row.send_payload && isEmpty(row.send_payload.url)) {
					const file_path = row.file_path || row.local_url || '';
					if (isEmpty(file_path)) {
						this.mark_send_fail(key);
						showToast('附件已失效，请重新选择');
						return;
					}
					this.upload_and_send_media_row(key, file_path, {
						data_type: row.data_type,
						quote: row.send_payload?.quote || row.quote || null,
						chunk_key: row.upload_chunk_key || '',
						file_name: (row.send_payload && (row.send_payload.name || row.send_payload.content)) || '',
						voice: parseInt((row.send_payload && row.send_payload.voice) || row.is_voice || 0) == 1 ? 1 : 0,
						duration: row.duration_sec || (row.send_payload && row.send_payload.duration) || 0,
					});
					return;
				}
				const payload = row.send_payload || { data_type: 'text', content: row.text || '', quote: row.quote || null };
				const ok = chat_send_message(payload);
				if (ok === 'queued') {
					mark_send_revive_queued();
					return;
				}
				if (ok) {
					this.mark_send_ok(key);
				} else {
					this.mark_send_fail(key);
				}
			
		},

		on_chat_resend_now(data) {
			
				const payload = data && typeof data == 'object' ? data : {};
				if (String(payload.chat_id || '') != String(this.chat_id || '')) {
					return;
				}
				this.resend_failed_message(payload.key);
			
		},

		consume_resend_now() {
			
				try {
					const job = uni.getStorageSync(RESEND_NOW_KEY);
					if (!job || !job.key) {
						return;
					}
					if (String(job.chat_id || '') != String(this.chat_id || '')) {
						return;
					}
					uni.removeStorageSync(RESEND_NOW_KEY);
					this.$nextTick(() => this.resend_failed_message(job.key));
				} catch (e) {}
			
		},

		append_init_message() {
			
				const raw = get_chat_state().init_message;
				if (raw == null || raw === false) {
					return;
				}
				if (typeof raw == 'string') {
					if (isEmpty(raw.trim())) {
						return;
					}
				} else if (typeof raw == 'object') {
					const tip = String(raw.content || raw.msg || '').trim();
					if (isEmpty(tip)) {
						return;
					}
				} else {
					return;
				}
				// 避免重复追加
				this.message_list = this.message_list.filter((row) => !row.is_pure);
				this.append_local_message(raw, false, { is_pure: true });
			
		},

		request_business_goods(ids = []) {
			
				const need = (ids || []).filter((id) => Number(id) > 0);
				if (need.length === 0) {
					return;
				}
				chat_load_business_goods(need);
			
		},

		flatten_record(record, mode = 'init') {
			
				if (!record || !record.data || record.data.length === 0) {
					if (mode == 'init') {
						this.message_list = [];
						this.has_more = false;
						this.min_record_id = 0;
					} else if (mode == 'around') {
						showToast('未找到该消息');
					} else if (mode == 'history') {
						this.has_more = false;
					}
					return;
				}
			
				const rows = [];
				const goods_ids = [];
				let local_min_id = 0;
				record.data.forEach((group) => {
					const is_self = group.type == 'right';
					const time_text = group.time || '';
					const list = group.data || [];
					const group_user = group.user || null;
					list.forEach((msg, idx) => {
						if (is_obsolete_phase_divider(msg.content) || is_session_end_continue_tip(msg.content)) {
							return;
						}
						const parsed = parse_message_content(msg.content);
						const record_id = Number(msg.id) || 0;
						if (record_id > 0 && (local_min_id === 0 || record_id < local_min_id)) {
							local_min_id = record_id;
						}
						if (parsed.goods_id > 0) {
							goods_ids.push(parsed.goods_id);
						}
						const is_ai_summary = is_ai_summary_message(msg.content);
						const is_mode_tip = is_mode_tip_message(msg.content) && !is_ai_summary;
						const is_recall = is_recall_message(msg.content);
						const is_system = is_system_message(msg.content) || is_recall;
						const is_ai_reply = !is_ai_summary && is_ai_bot_user(group_user);
						const recall_text = (msg.content && typeof msg.content == 'object') ? String(msg.content.recall_text || '') : '';
						const can_reedit = is_self && is_recall && recall_text !== '';
						const recall_at = can_reedit ? this.to_time_ms(msg.upd_time) : 0;
						const is_read = is_self && !is_system && !is_mode_tip && !is_ai_summary && parseInt(msg.is_read || 0) == 1 ? 1 : 0;
						const sender = is_self
							? (get_chat_state().current_user?.name || '客服')
							: (group_user?.name || (is_ai_reply ? '智能客服' : (get_chat_state().receive_user?.name || this.chat_title || '用户')));
						const avatar = is_self
							? (get_chat_state().current_user?.avatar || this.current_avatar || this.default_avatar)
							: (group_user?.avatar || (is_ai_reply ? (chat_ai_bot_user()?.avatar || this.default_avatar) : (get_chat_state().receive_user?.avatar || this.receive_avatar || this.default_avatar)));
						const add_time = Number(msg.add_time || 0) || 0;
						const duration_sec = Number(parsed.duration || 0) || 0;
						const display_text = is_recall
							? this.recall_tip_text(parsed.text, is_self)
							: (is_ai_summary ? this.ai_summary_body_text(parsed.text) : parsed.text);
						rows.push({
							key: this.next_key(),
							is_self: is_mode_tip || is_system || is_ai_summary ? false : is_self,
							is_pure: false,
							is_ai_summary,
							is_mode_tip,
							is_ai_reply,
							is_system: is_system && !is_mode_tip && !is_ai_summary,
							is_thinking: false,
							show_sender: !is_mode_tip && !is_system && !is_ai_summary && !!String(sender || '').trim(),
							name: is_ai_summary ? '' : sender,
							avatar: is_ai_summary ? '' : avatar,
							data_type: parsed.data_type,
							text: display_text,
							text_segments: this.split_text_segments(display_text),
							url: parsed.url,
							goods_id: parsed.goods_id || 0,
							goods: parsed.goods || null,
							order: parsed.order || null,
							aftersale: parsed.aftersale || null,
							file: parsed.file || null,
							quote: parsed.quote || null,
							show_time: idx === 0 && !isEmpty(time_text) && !is_mode_tip && !is_system && !is_ai_summary,
							time_text,
							add_time,
							record_id,
							upload_status: '',
							upload_progress: 100,
							media_ready: true,
							poster: parsed.poster || '',
							duration_text: duration_sec > 0 ? this.format_duration_text(duration_sec) : '',
							duration_sec,
							local_url: '',
							file_path: '',
							send_status: '',
							send_payload: null,
							is_read,
							can_reedit,
							recall_text,
							recall_at,
							is_emoji_only: !is_ai_summary && parsed.data_type == 'text' && this.is_emoji_only_text(display_text),
							is_voice: parseInt(parsed.voice || 0) == 1 || chat_is_voice_message(msg.content) ? 1 : 0,
							voice_played: parseInt(msg.is_read || 0) == 1 ? 1 : 0,
						});
					});
				});
			
				const more = parseInt(record.has_more || 0) == 1 || (Number(record.current_total || 0) >= Number(record.page_size || 30));
				if (mode == 'init' || mode == 'around') {
					const pending = this.message_list.filter((row) => {
						if (!row || !row.is_self || Number(row.record_id || 0) > 0) {
							return false;
						}
						return row.upload_status == 'uploading' || row.send_status == 'sending' || row.send_status == 'fail';
					});
					this.message_list = rows;
					pending.forEach((row) => {
						if (!this.message_list.some((item) => item.key === row.key)) {
							this.message_list.push(row);
						}
					});
					this.has_more = more;
					this.min_record_id = local_min_id;
				} else {
					this.message_list = rows.concat(this.message_list);
					this.has_more = Number(record.current_total || 0) >= Number(record.page_size || 30);
					if (local_min_id > 0) {
						this.min_record_id = local_min_id;
					}
				}
				this.request_business_goods(goods_ids);
				this.ensure_reedit_tick();
				this.fill_missing_video_posters();
				if (mode == 'init' || mode == 'around') {
					this.sync_session_list_preview();
				}
			
		},

		clear_history_load() {
			
				if (history_load_timer) {
					clearTimeout(history_load_timer);
					history_load_timer = null;
				}
				history_pending_payload = null;
				history_load_started_at = 0;
				this.history_loading = false;
			
		},

		measure_chat_scroll(cb) {
			
				const scope = this;
				const query = scope ? uni.createSelectorQuery().in(scope) : uni.createSelectorQuery();
				query.select('.chat-main').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec((res) => {
					const rect = res && res[0];
					const scroll = res && res[1];
					cb({
						height: Number((rect && rect.height) || 0),
						top: Number((scroll && scroll.scrollTop) || 0),
					});
				});
			
		},

		restore_history_scroll() {
			
				this.$nextTick(() => {
					if (!this.page_alive) {
						return;
					}
					this.measure_chat_scroll((info) => {
						const delta = info.height - history_main_height;
						const top = Math.max(HISTORY_LOAD_DISTANCE + 48, history_scroll_top + Math.max(0, delta));
						uni.pageScrollTo({
							scrollTop: top,
							duration: 0,
						});
						history_edge_armed = true;
					});
				});
			
		},

		apply_history_payload(payload) {
			
				if (!payload || !this.page_alive) {
					this.clear_history_load();
					return;
				}
				this.flatten_record(payload.record, 'history');
				if (payload.base) {
					chat_set_friend_base(payload.base);
					this.sync_friend_base(payload.base);
				}
				this.sync_ai_state();
				history_pending_payload = null;
				history_load_started_at = 0;
				if (history_load_timer) {
					clearTimeout(history_load_timer);
					history_load_timer = null;
				}
				this.history_loading = false;
				this.restore_history_scroll();
			
		},

		try_apply_history_record() {
			
				if (!this.history_loading || history_pending_payload == null) {
					return;
				}
				const remain = HISTORY_LOAD_MIN_MS - (Date.now() - history_load_started_at);
				if (remain > 0) {
					if (!history_load_timer) {
						history_load_timer = setTimeout(() => {
							history_load_timer = null;
							this.try_apply_history_record();
						}, remain);
					}
					return;
				}
				this.apply_history_payload(history_pending_payload);
			
		},

		load_history_event() {
			
				if (this.history_loading || !this.has_more || !this.min_record_id) {
					return;
				}
				this.history_loading = true;
				this.measure_chat_scroll((info) => {
					history_scroll_top = info.top;
					history_main_height = info.height;
					history_pending_payload = null;
					history_load_started_at = Date.now();
					if (history_load_timer) {
						clearTimeout(history_load_timer);
						history_load_timer = null;
					}
					chat_load_record_history(this.min_record_id);
					history_load_timer = setTimeout(() => {
						history_load_timer = null;
						this.try_apply_history_record();
					}, HISTORY_LOAD_MIN_MS);
				});
			
		},

		on_page_scroll_event(e) {
			
				const top = Number((e && e.scrollTop) || 0);
				if (!this.list_ready) {
					return;
				}
				if (top > HISTORY_LOAD_DISTANCE + 40) {
					history_edge_armed = true;
					return;
				}
				if (history_edge_armed && top <= HISTORY_LOAD_DISTANCE && this.has_more && !this.history_loading) {
					history_edge_armed = false;
					this.load_history_event();
				}
			
		},

		on_record(payload) {
			
				if (!this.page_alive) {
					return;
				}
				const expect_id = Number(this.chat_id || get_chat_state().receive_user?.id || 0);
				const contact_id = Number(payload?.contact_id || 0);
				if (expect_id > 0 && contact_id > 0 && contact_id != expect_id) {
					return;
				}
				const mode = payload?.mode || 'init';
				if (mode == 'history') {
					history_pending_payload = payload;
					this.try_apply_history_record();
					return;
				}
				if (mode == 'init') {
					this.clear_history_load();
				}
				this.flatten_record(payload?.record, mode);
				if (payload?.base) {
					chat_set_friend_base(payload.base);
					this.sync_friend_base(payload.base);
				}
				this.sync_ai_state(payload?.ai ? { ai: payload.ai } : undefined);
				// 对齐 PC UserRecordView：init 后追加初始提示（含空会话）
				if (payload?.mode == 'init') {
					this.append_init_message();
					this.restore_failed_messages();
					record_init_done = true;
					if (!this.session_ended) {
						// 进页未结束：之后若超时结束再弹询问
						session_page_engaged = true;
						pending_session_revive = false;
						allow_ended_prompt = true;
					} else {
						// 进页已结束：主动 chat-continue，续聊成功前不弹「是否继续」
						this.mark_enter_ended_session();
						this.try_enter_auto_continue();
					}
					this.scroll_to_bottom_after_layout(true);
				}
			
		},

		clear_typing_tip() {
			
				this.input_status_text = '';
				this.input_status_msg = '';
				if (typing_hide_timer) {
					clearTimeout(typing_hide_timer);
					typing_hide_timer = null;
				}
			
		},

		on_chat(payload) {
			
				if (!this.page_alive) {
					return;
				}
				this.clear_typing_tip();
				if (!payload?.is_active) {
					return;
				}
				this.remove_thinking_message();
				if (is_ai_summary_message(payload.content)) {
					const rid = Number(payload?.data?.record_id || 0);
					if (rid > 0 && this.message_list.some((row) => Number(row.record_id || 0) == rid && row.is_ai_summary)) {
						return;
					}
					this.append_local_message(payload.content, false, {
						is_ai_summary: true,
						record_id: rid,
						add_time: payload?.data?.add_time,
						time_text: '',
					});
					return;
				}
				if (payload.is_mode_tip || is_mode_tip_message(payload.content)) {
					if (is_session_end_continue_tip(payload.content)) {
						return;
					}
					this.append_local_message(payload.content, false, {
						is_mode_tip: true,
						record_id: payload?.data?.record_id,
						add_time: payload?.data?.add_time,
					});
					return;
				}
				if (payload.is_system || is_system_message(payload.content) || is_recall_message(payload.content)) {
					if (is_session_end_continue_tip(payload.content)) {
						return;
					}
					const rid = Number(payload?.data?.record_id || 0);
					if (rid > 0 && this.message_list.some((row) => Number(row.record_id || 0) == rid && (row.is_system || row.data_type == 'recall'))) {
						return;
					}
					const me_id = get_chat_state().current_user?.id;
					const from_self = !!payload.from_self || (me_id && payload.user && String(payload.user.id) == String(me_id));
					let content = payload.content;
					const recall_text = (content && typeof content == 'object') ? String(content.recall_text || '') : '';
					if (is_recall_message(content) && from_self && content && typeof content == 'object') {
						content = { ...content, content: this.recall_tip_text(content.content, true) };
					}
					this.append_local_message(content, false, {
						is_system: true,
						record_id: rid,
						add_time: payload?.data?.add_time,
						can_reedit: !!(from_self && recall_text),
						recall_text,
						recall_at: from_self && recall_text ? Date.now() : 0,
					});
					if (from_self && recall_text) {
						this.ensure_reedit_tick();
					}
					return;
				}
				const me_id = get_chat_state().current_user?.id;
				const from_self = !!payload.from_self || (me_id && payload.user && String(payload.user.id) == String(me_id));
				if (from_self) {
					// 对齐 PC：自动回复等无本地占位时补己方气泡；手动发送已有乐观气泡则只绑 record_id，避免双条
					const rid = Number(payload?.data?.record_id || 0);
					if (rid > 0 && this.message_list.some((row) => Number(row.record_id || 0) == rid)) {
						return;
					}
					const content = payload.content;
					const ack_url = (content && typeof content == 'object') ? String(content.url || '') : '';
					const ack_type = (content && typeof content == 'object') ? String(content.data_type || '') : '';
					let bind_idx = -1;
					if (ack_url) {
						for (let i = 0; i < this.message_list.length; i++) {
							const row = this.message_list[i];
							if (!row || !row.is_self || row.is_system || row.is_mode_tip || row.is_pure) {
								continue;
							}
							if (Number(row.record_id || 0) > 0 || row.upload_status == 'uploading') {
								continue;
							}
							const got = String(
								row.url
								|| (row.file && row.file.url)
								|| (row.send_payload && row.send_payload.url)
								|| ''
							);
							if (got && got === ack_url && (!ack_type || !row.data_type || row.data_type == ack_type)) {
								bind_idx = i;
								break;
							}
						}
					}
					if (bind_idx < 0) {
						for (let i = this.message_list.length - 1; i >= 0; i--) {
							const row = this.message_list[i];
							if (!row || !row.is_self || row.is_system || row.is_mode_tip || row.is_pure) {
								continue;
							}
							if (Number(row.record_id || 0) > 0 || row.upload_status == 'uploading' || row.send_status == 'fail') {
								continue;
							}
							bind_idx = i;
							break;
						}
					}
					if (bind_idx >= 0 && rid > 0) {
						const row = this.message_list[bind_idx];
						let is_read = row.is_read == 1 ? 1 : 0;
						if (pending_read_ids[rid] && parseInt(row.is_voice || 0) != 1) {
							is_read = 1;
							delete pending_read_ids[rid];
						}
						this.message_list.splice(bind_idx, 1, {
							...row,
							record_id: rid,
							add_time: Number(payload?.data?.add_time || 0) || row.add_time,
							send_status: row.send_status == 'fail' ? row.send_status : '',
							is_read,
						});
						return;
					}
					if (rid > 0) {
						this.append_local_message(payload.content, true, {
							record_id: rid,
							add_time: payload?.data?.add_time,
							is_read: 0,
						});
					}
					return;
				}
				this.append_local_message(payload.content, false, {
					is_ai_reply: !!payload.is_ai_reply || is_ai_bot_user(payload.user),
					user: payload.user,
					record_id: payload?.data?.record_id,
					add_time: payload?.data?.add_time,
				});
			
		},

		mark_quotes_recalled(record_id) {
			
				const rid = Number(record_id || 0);
				if (!(rid > 0)) {
					return;
				}
				this.message_list = this.message_list.map((row) => {
					if (!row.quote || Number(row.quote.record_id || 0) != rid) {
						return row;
					}
					if (is_quote_recalled(row.quote)) {
						return row;
					}
					return {
						...row,
						quote: normalize_quote({
							...row.quote,
							is_recalled: 1,
							data_type: 'recall',
						}),
					};
				});
				if (this.quote_draft && Number(this.quote_draft.record_id || 0) == rid) {
					this.quote_draft = null;
				}
			
		},

		is_session_preview_row(row) {
			
				if (!row) {
					return false;
				}
				if (row.is_thinking || row.is_pure || row.is_mode_tip || row.is_ai_summary) {
					return false;
				}
				if (row.is_system || row.data_type == 'recall') {
					return false;
				}
				if (row.send_status == 'fail') {
					return false;
				}
				return true;
			
		},

		preview_content_from_row(row) {
			
				const dt = row.data_type || 'text';
				if (dt == 'goods') {
					return { data_type: 'goods', title: (row.goods && row.goods.title) || row.text || '' };
				}
				if (dt == 'order') {
					return { data_type: 'order', order_no: (row.order && row.order.order_no) || '' };
				}
				if (dt == 'aftersale') {
					return { data_type: 'aftersale', order_no: (row.aftersale && row.aftersale.order_no) || '' };
				}
				if (dt == 'audio' && row.is_voice) {
					return { data_type: 'audio', voice: 1, duration: row.duration_sec || 0 };
				}
				if (dt == 'images') {
					return { data_type: dt };
				}
				if (dt == 'video') {
					const name = (row.send_payload && (row.send_payload.name || row.send_payload.content))
						|| (row.file && row.file.name)
						|| row.text
						|| '';
					return {
						data_type: 'video',
						duration: row.duration_sec || (row.send_payload && row.send_payload.duration) || 0,
						duration_text: row.duration_text || '',
						name,
						content: name,
					};
				}
				if (dt == 'file' || dt == 'audio') {
					const name = (row.file && row.file.name) || row.text || '';
					return { data_type: dt, name, content: name };
				}
				return { data_type: 'text', content: row.text || '' };
			
		},

		sync_session_list_preview() {
			
				const uid = Number(this.chat_id || 0);
				if (!(uid > 0)) {
					return;
				}
				const list = this.message_list || [];
				let row = null;
				for (let i = list.length - 1; i >= 0; i--) {
					if (this.is_session_preview_row(list[i])) {
						row = list[i];
						break;
					}
				}
				chat_update_friend_preview(uid, row ? this.preview_content_from_row(row) : { data_type: 'text', content: '' });
			
		},

		apply_message_recalled(record_id, content, opts = {}) {
			
				const rid = Number(record_id || 0);
				if (!(rid > 0)) {
					return false;
				}
				const server_text = (content && typeof content == 'object')
					? String(content.recall_text || '')
					: '';
				const raw_tip = (content && typeof content == 'object')
					? (content.content || '')
					: (content || '');
				const patch_existing = () => {
					let hit = false;
					this.message_list = this.message_list.map((row) => {
						if (Number(row.record_id || 0) != rid || !(row.is_system || row.data_type == 'recall')) {
							return row;
						}
						hit = true;
						const recall_text = String(opts.recall_text || row.recall_text || server_text || '').trim();
						const self_recall = !!opts.is_self || !!row.can_reedit;
						const can_reedit = self_recall && recall_text !== '';
						return {
							...row,
							text: this.recall_tip_text(raw_tip || row.text, self_recall || !!opts.is_self),
							can_reedit,
							recall_text,
							recall_at: Number(row.recall_at || opts.recall_at || 0) || (can_reedit ? Date.now() : 0),
						};
					});
					if (hit) {
						this.ensure_reedit_tick();
						this.sync_session_list_preview();
					}
					return hit;
				};
				if (this.message_list.some((row) => Number(row.record_id || 0) == rid && (row.is_system || row.data_type == 'recall'))) {
					return patch_existing();
				}
				let found = false;
				this.message_list = this.message_list.map((row) => {
					if (Number(row.record_id || 0) != rid || row.is_system || row.is_mode_tip || row.is_pure) {
						return row;
					}
					found = true;
					const self_recall = !!opts.is_self || !!row.is_self;
					const from_row = (row.data_type == 'text') ? String(row.text || '').trim() : '';
					const recall_text = String(opts.recall_text || server_text || from_row || '').trim();
					const can_reedit = self_recall && recall_text !== '' && (row.data_type == 'text' || !!opts.recall_text || !!server_text);
					return {
						...row,
						is_self: false,
						is_pure: false,
						is_mode_tip: false,
						is_system: true,
						is_thinking: false,
						show_sender: false,
						name: '',
						avatar: '',
						data_type: 'recall',
						text: this.recall_tip_text(raw_tip, self_recall),
						text_segments: [],
						url: '',
						goods_id: 0,
						goods: null,
						quote: null,
						show_time: false,
						time_text: '',
						is_read: 0,
						can_reedit,
						recall_text,
						recall_at: Number(opts.recall_at || 0) || (can_reedit ? Date.now() : 0),
					};
				});
				if (found) {
					this.ensure_reedit_tick();
					this.sync_session_list_preview();
				}
				return found;
			
		},

		on_chat_recall(payload) {
			
				if (!this.page_alive || !payload) {
					return;
				}
				const rid = Number(payload.record_id || 0);
				if (!(rid > 0)) {
					return;
				}
				// 对齐 PC：先改引用块，再替换原消息；找不到且与当前会话相关时重拉记录
				this.mark_quotes_recalled(rid);
				const me_id = parseInt(get_chat_state().current_user?.id || 0);
				const send_cuid = parseInt(payload.send_cuid || 0);
				const recall_text = (payload.content && typeof payload.content == 'object')
					? String(payload.content.recall_text || '')
					: '';
				const is_self = me_id > 0 && me_id == send_cuid;
				const ok = this.apply_message_recalled(rid, payload.content, {
					can_reedit: is_self && recall_text !== '',
					recall_text,
					is_self,
				});
				if (!ok && payload.is_active) {
					chat_load_record();
				}
			
		},

		on_chat_ack(payload) {
			
				if (!this.page_alive || !payload) {
					return;
				}
				const ack_id = Number(payload.record_id || 0);
				if (!(ack_id > 0)) {
					return;
				}
				const add_time = Number(payload.add_time || 0) || this.now_unix_sec();
				const ack_content = payload.data && payload.data.content != null
					? payload.data.content
					: (payload.content != null ? payload.content : null);
				let ack_url = '';
				let ack_type = '';
				if (ack_content && typeof ack_content == 'object') {
					ack_url = String(ack_content.url || '');
					ack_type = String(ack_content.data_type || '');
				}
			
				const row_matches_media = (row) => {
					if (!ack_url) {
						return false;
					}
					const got = String(
						row.url
						|| (row.file && row.file.url)
						|| (row.send_payload && row.send_payload.url)
						|| ''
					);
					if (!got || got !== ack_url) {
						return false;
					}
					if (ack_type && row.data_type && row.data_type != ack_type) {
						return false;
					}
					return true;
				};
			
				let target_idx = -1;
				if (ack_url) {
					// 对齐 PC ChatAckFindPendingMediaLi：按 url 取最早一条未绑定
					for (let i = 0; i < this.message_list.length; i++) {
						const row = this.message_list[i];
						if (!row || !row.is_self || row.is_system || row.is_mode_tip || row.is_pure) {
							continue;
						}
						if (Number(row.record_id || 0) > 0 || row.upload_status == 'uploading') {
							continue;
						}
						if (row_matches_media(row)) {
							target_idx = i;
							break;
						}
					}
				}
				if (target_idx < 0) {
					// 对齐 PC：url 未命中时回退到最后一条未绑定且非上传中的己方气泡
					for (let i = this.message_list.length - 1; i >= 0; i--) {
						const row = this.message_list[i];
						if (!row || !row.is_self || row.is_system || row.is_mode_tip || row.is_pure) {
							continue;
						}
						if (Number(row.record_id || 0) > 0) {
							continue;
						}
						if (row.upload_status == 'uploading' || row.send_status == 'fail') {
							continue;
						}
						target_idx = i;
						break;
					}
				}
				if (target_idx < 0) {
					return;
				}
				const row = this.message_list[target_idx];
				// 对齐 PC：语音未播放不因 pending-read 标已读
				let is_read = row.is_read == 1 ? 1 : 0;
				if (pending_read_ids[ack_id]) {
					if (parseInt(row.is_voice || 0) != 1) {
						is_read = 1;
					}
					delete pending_read_ids[ack_id];
				}
				const patch = {
					...row,
					record_id: ack_id,
					add_time: add_time || row.add_time,
					send_status: row.send_status == 'fail' ? row.send_status : '',
					is_read,
				};
				// 对齐 PC ChatSyncAckContent：回执带过滤后 content 时同步展示
				if (ack_content && typeof ack_content == 'object') {
					if (ack_content.data_type == 'text' && ack_content.content != null) {
						patch.text = String(ack_content.content);
						patch.text_segments = this.split_text_segments(patch.text);
						patch.is_emoji_only = this.is_emoji_only_text(patch.text);
					}
					if (ack_content.name) {
						patch.file = {
							...(patch.file || {}),
							name: ack_content.name,
							unit: ack_content.unit || (patch.file && patch.file.unit) || '',
							url: patch.url || ack_content.url || '',
						};
					}
					if (ack_content.quote) {
						patch.quote = normalize_quote(ack_content.quote);
					}
				}
				this.message_list.splice(target_idx, 1, patch);
			
		},

		on_chat_read(payload) {
			
				if (!this.page_alive || !payload) {
					return;
				}
				const ids = Array.isArray(payload.record_ids)
					? payload.record_ids.map((id) => Number(id) || 0).filter((id) => id > 0)
					: [];
				const all = parseInt(payload.all || 0) == 1;
				if (!all && ids.length === 0) {
					return;
				}
				const id_set = {};
				ids.forEach((id) => { id_set[id] = 1; });
				const active_id = parseInt((get_chat_state().receive_user && get_chat_state().receive_user.id) || 0) || 0;
				const reader = parseInt(payload.reader_cuid || 0) || 0;
				const peer = parseInt(payload.peer_cuid || 0) || 0;
				const me_id = parseInt((get_chat_state().current_user && get_chat_state().current_user.id) || 0) || 0;
				// 已读回执只表示对方看了自己发的消息；自己读对方的消息不改己方气泡
				if (me_id > 0 && reader == me_id) {
					return;
				}
				const same_session = reader > 0 && reader == active_id;
				const i_am_peer = peer > 0 && me_id > 0 && peer == me_id && same_session;
				const allow_all = all && (same_session || i_am_peer);
				const seen = {};
				this.message_list = this.message_list.map((row) => {
					if (!row || !row.is_self || row.is_system) {
						return row;
					}
					const rid = Number(row.record_id || 0);
					// 对齐 PC：批量 all=1 不把语音气泡标成已读
					if (all && parseInt(row.is_voice || 0) == 1) {
						return row;
					}
					if ((allow_all) || (rid > 0 && id_set[rid])) {
						if (rid > 0) {
							seen[rid] = 1;
						}
						return { ...row, is_read: 1 };
					}
					return row;
				});
				if (!all) {
					ids.forEach((id) => {
						if (!seen[id]) {
							pending_read_ids[id] = 1;
						}
					});
				}
			
		},

		on_chat_reject(payload) {
			
				if (!this.page_alive) {
					return;
				}
				let restore = '';
				const list = this.message_list || [];
				for (let i = list.length - 1; i >= 0; i--) {
					const row = list[i];
					if (!row || !row.is_self || row.data_type != 'text') {
						continue;
					}
					if (row.send_status == 'sending' || row.send_status == 'fail' || !(Number(row.record_id || 0) > 0)) {
						restore = String((row.send_payload && row.send_payload.content) || row.text || '');
						this.message_list = list.filter((item) => item.key !== row.key);
						break;
					}
				}
				if (restore && isEmpty(String(this.input_text || '').trim())) {
					this.input_text = restore;
				}
			
		},

		quote_block_tap_event(quote) {
			
				if (!quote) {
					return;
				}
				if (is_quote_recalled(quote)) {
					showToast('引用内容已撤回');
					return;
				}
				const rid = Number(quote.record_id || 0);
				if (!(rid > 0)) {
					showToast('原消息不可定位');
					return;
				}
				this.jump_to_record(rid, { silent: false });
			
		},

		jump_to_record(record_id, opts = {}) {
			
				const rid = Number(record_id || 0);
				const silent = !!opts.silent;
				if (!(rid > 0)) {
					if (!silent) {
						showToast('原消息不可定位');
					}
					return false;
				}
				const tip_idx = this.message_list.findIndex((row) => (
					Number(row.record_id || 0) == rid && (row.is_system || row.data_type == 'recall')
				));
				if (tip_idx >= 0) {
					if (!silent) {
						showToast('引用内容已撤回');
					}
					return 'recall';
				}
				const idx = this.message_list.findIndex((row) => (
					Number(row.record_id || 0) == rid && !row.is_system && !row.is_mode_tip && !row.is_pure
				));
				if (idx < 0) {
					if (opts.allow_around) {
						msg_search_jump_id = rid;
						chat_load_record_around(rid);
						return 'around';
					}
					if (!silent) {
						showToast('原消息不在当前列表');
					}
					return false;
				}
				const anchor = this.msg_dom_id(this.message_list[idx], idx);
				this.page_scroll_to_id(anchor);
				this.flash_record_id = rid;
				if (flash_record_timer) {
					clearTimeout(flash_record_timer);
				}
				flash_record_timer = setTimeout(() => {
					this.flash_record_id = 0;
					flash_record_timer = null;
				}, 1200);
				return true;
			
		},

		msg_search_highlight_segments(text, kw) {
			
				const source = String(text || '');
				const key = String(kw || '');
				if (key === '' || source === '') {
					return [{ text: source, hit: false }];
				}
				let re = null;
				try {
					re = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
				} catch (e) {
					return [{ text: source, hit: false }];
				}
				const parts = [];
				let last = 0;
				let m = re.exec(source);
				while (m) {
					if (m.index > last) {
						parts.push({ text: source.slice(last, m.index), hit: false });
					}
					parts.push({ text: m[0], hit: true });
					last = m.index + m[0].length;
					if (m[0].length === 0) {
						re.lastIndex += 1;
					}
					m = re.exec(source);
				}
				if (last < source.length) {
					parts.push({ text: source.slice(last), hit: false });
				}
				return parts.length > 0 ? parts : [{ text: source, hit: false }];
			
		},

		msg_search_clear_hits() {
			
				this.msg_search_hits = [];
				this.msg_search_loading = false;
				msg_search_jump_id = 0;
			
		},

		open_msg_search_event() {
			
				this.panel_type = '';
				this.input_focus = false;
				this.msg_search_open = true;
				this.msg_search_focus = false;
				this.$nextTick(() => {
					this.msg_search_focus = true;
				});
			
		},

		close_msg_search_event() {
			
				this.msg_search_open = false;
				this.msg_search_focus = false;
				this.msg_search_keyword = '';
				if (msg_search_timer) {
					clearTimeout(msg_search_timer);
					msg_search_timer = null;
				}
				this.msg_search_clear_hits();
			
		},

		msg_search_clear_event() {
			
				this.msg_search_keyword = '';
				this.msg_search_clear_hits();
			
		},

		msg_search_request() {
			
				if (!chat_can_search_record()) {
					return;
				}
				const kw = String(this.msg_search_keyword || '').trim();
				if (kw === '') {
					this.msg_search_clear_hits();
					return;
				}
				msg_search_jump_id = 0;
				this.msg_search_loading = true;
				chat_search_record(kw);
			
		},

		msg_search_input_event(e) {
			
				this.msg_search_keyword = e?.detail?.value || '';
				if (msg_search_timer) {
					clearTimeout(msg_search_timer);
					msg_search_timer = null;
				}
				const kw = String(this.msg_search_keyword || '').trim();
				if (kw === '') {
					this.msg_search_clear_hits();
					return;
				}
				msg_search_timer = setTimeout(() => {
					msg_search_timer = null;
					this.msg_search_request();
				}, 280);
			
		},

		msg_search_confirm_event() {
			
				if (msg_search_timer) {
					clearTimeout(msg_search_timer);
					msg_search_timer = null;
				}
				this.msg_search_request();
			
		},

		on_record_search(data = {}) {
			
				if (!this.page_alive || !this.msg_search_open) {
					return;
				}
				const active = parseInt((get_chat_state().receive_user && get_chat_state().receive_user.id) || 0) || 0;
				const resp = parseInt(data.receive_user || data.contact_cuid || 0) || 0;
				if (resp > 0 && active > 0 && resp != active) {
					return;
				}
				const input_kw = String(this.msg_search_keyword || '').trim();
				if (input_kw === '') {
					return;
				}
				const kw = String(data.keywords || '').trim();
				if (kw !== '' && kw !== input_kw) {
					return;
				}
				const list = Array.isArray(data.list) ? data.list : [];
				const hl_kw = kw || input_kw;
				this.msg_search_hits = list.map((item) => {
					const text = String(item.text || '');
					const sender = this.resolve_search_hit_sender(item);
					return {
						id: parseInt(item.id || item.record_id || 0) || 0,
						time: String(item.time || ''),
						name: sender.name,
						avatar: sender.avatar,
						text,
						segments: this.msg_search_highlight_segments(text, hl_kw),
					};
				});
				this.msg_search_loading = false;
			
		},

		resolve_search_hit_sender(item = {}) {
			
				const rid = parseInt(item.id || 0) || 0;
				const local = rid > 0 ? this.message_list.find((row) => Number(row.record_id || 0) == rid) : null;
				const user = item.user || item.send_user || {};
				const chat_state = get_chat_state();
				const self_name = chat_state.current_user?.name || '客服';
				const self_avatar = chat_state.current_user?.avatar || this.current_avatar || this.default_avatar;
				const other_name = chat_state.receive_user?.name || this.chat_title || '用户';
				const other_avatar = chat_state.receive_user?.avatar || this.receive_avatar || this.default_avatar;
				let is_self = local != null ? !!local.is_self : null;
				if (is_self == null) {
					if (item.is_self != null) {
						is_self = parseInt(item.is_self) === 1 || item.is_self === true || item.is_self == '1';
					} else if (item.type == 'right') {
						is_self = true;
					} else if (item.type == 'left') {
						is_self = false;
					} else {
						const send_id = parseInt(item.send_cuid || item.user_id || user.id || 0) || 0;
						const self_id = parseInt(chat_state.current_user?.id || 0) || 0;
						if (send_id > 0 && self_id > 0) {
							is_self = send_id == self_id;
						}
					}
				}
				const name = String(item.name || user.name || (local && local.name) || (is_self ? self_name : other_name) || '').trim();
				const avatar = item.avatar || user.avatar || (local && local.avatar) || (is_self ? self_avatar : other_avatar) || this.default_avatar;
				return { name, avatar };
			
		},

		on_record_around(data = {}) {
			
				if (!this.page_alive) {
					return;
				}
				const around_id = parseInt(data.around_id || 0) || 0;
				const want = parseInt(msg_search_jump_id || 0) || 0;
				if (want <= 0 || around_id <= 0 || around_id !== want) {
					return;
				}
				const active = parseInt((get_chat_state().receive_user && get_chat_state().receive_user.id) || 0) || 0;
				const resp = parseInt(data.receive_user || data.contact_cuid || 0) || 0;
				if (resp > 0 && active > 0 && resp != active) {
					return;
				}
				msg_search_jump_id = 0;
				if (!data.record) {
					showToast('未找到该消息');
					return;
				}
				this.flatten_record(data.record, 'around');
				this.$nextTick(() => {
					setTimeout(() => {
						this.jump_to_record(around_id, { silent: true });
					}, 80);
				});
			
		},

		msg_search_hit_event(e) {
			
				const ds = e?.currentTarget?.dataset || {};
				const hits = this.msg_search_hits;
				const idx = parseInt(ds.index);
				const hit = hits && !Number.isNaN(idx) ? hits[idx] : null;
				const rid = parseInt(ds.id || (hit && hit.id) || 0) || 0;
				if (rid <= 0) {
					return;
				}
				this.close_msg_search_event();
				const run = () => {
					if (!this.page_alive) {
						return;
					}
					const ok = this.jump_to_record(rid, { silent: true, allow_around: true });
					if (ok === 'recall') {
						showToast('该消息已撤回');
					}
				};
				this.$nextTick(() => {
					setTimeout(run, 80);
				});
			
		},

		resolve_route_receive_user() {
			
				const id = parseInt(this.route_chat_id || 0, 10) || 0;
				if (!(id > 0)) {
					return null;
				}
				const st = get_chat_state();
				let receive = chat_get_receive_user_cache();
				if ((!receive || !receive.id || String(receive.id) != String(id)) && st.user_list) {
					const hit = st.user_list.find((row) => String(row.id) == String(id));
					if (hit) {
						receive = hit.receive_user || {
							id: hit.id,
							name: hit.name,
							avatar: hit.avatar,
						};
					}
				}
				if ((!receive || !receive.id) && st.receive_user && parseInt(st.receive_user.id, 10) == id) {
					receive = st.receive_user;
				}
				// 刷新丢缓存时：用路由 id 兜底，避免拉不到 record
				if (!receive || !receive.id || String(receive.id) != String(id)) {
					receive = {
						id,
						name: (receive && receive.name) || this.chat_title || '在线客服',
						avatar: (receive && receive.avatar) || this.default_avatar,
					};
				}
				if (st.receive_user && String(st.receive_user.id) != String(receive.id)) {
					chat_leave_session();
				}
				this.sync_receive_user_ui(receive);
				return receive;
			
		},

		load_chat_record_if_connected() {
			
				const st = get_chat_state();
				if (st.connect_status !== 1 || !st.receive_user?.id || this.list_ready) {
					return false;
				}
				chat_load_record();
				chat_load_user_base();
				return true;
			
		},

		sync_ai_state(payload) {
			
				const data = payload || get_chat_state();
				const ai = data.ai || get_chat_state().ai || {};
				const prev_ai_mode = this.ai_mode;
				this.ai_mode = ai.mode || 'human';
				this.ai_enabled = parseInt(ai.is_enable || 0) == 1;
				this.ai_switching = !!ai.switching;
				const prev_ended = this.session_ended;
				this.session_ended = !!ai.ended;
				if (this.session_ended && !record_init_done) {
					this.mark_enter_ended_session();
				}
				if (!this.session_ended) {
					ended_choice_handled = false;
					ended_while_page_hidden = false;
					this.show_ended_choice_modal = false;
					ended_choice_showing = false;
					if (prev_ended) {
						// 刚从结束态恢复：先解除结束态，但不立刻 engaged（避免迟到 chat-end 误弹）
						pending_session_revive = false;
						arm_suppress_ended_choice(8000);
						// engaged 仍为 false 时 schedule 也不会打开弹窗权限
						schedule_allow_ended_prompt(8000);
					} else if (record_init_done && !pending_session_revive && session_page_engaged) {
						allow_ended_prompt = true;
					}
				} else if (
					allow_ended_prompt
					&& session_page_engaged
					&& !prev_ended
					&& !suppress_ended_choice
					&& !pending_session_revive
					&& !chat_session_revive_inflight()
				) {
					// 仅本页聊天过程中变为结束才询问；进页已结束/续聊中不弹
					this.prompt_ended_session_choice();
				}
				this.can_end_session = chat_can_end();
				this.show_read_receipt = chat_can_show_read();
				this.agent_online_others = Number(data.agent_online_others != null ? data.agent_online_others : get_chat_state().agent_online_others) || 0;
				if (this.ai_mode == 'ai') {
					this.panel_type = '';
				}
				if (prev_ai_mode != this.ai_mode) {
					this.input_view_key += 1;
				}
			
		},

		remove_thinking_message() {
			
				this.message_list = this.message_list.filter((row) => !row.is_thinking && row.key !== THINKING_KEY);
			
		},

		on_ai_thinking(payload) {
			
				if (!this.page_alive) {
					return;
				}
				this.remove_thinking_message();
				if (!payload || !payload.show) {
					return;
				}
				const user = payload.user || chat_ai_bot_user();
				this.append_local_message(
					{ data_type: 'text', content: payload.msg || '智能客服正在回复' },
					false,
					{
						key: THINKING_KEY,
						is_thinking: true,
						user,
						name: user?.name || '智能客服',
						avatar: user?.avatar || this.default_avatar,
					}
				);
			
		},

		on_agent_online_list(payload) {
			
				this.agent_online_others = Number((payload && payload.count) || (payload && payload.list && payload.list.length) || 0) || 0;
			
		},

		on_friend_input_status(payload) {
			
				// 对齐 PC：AI 接待中不展示对方输入状态
				if (this.ai_mode == 'ai') {
					this.clear_typing_tip();
					return;
				}
				if (!chat_can_input_status()) {
					this.clear_typing_tip();
					return;
				}
				const data = payload && typeof payload == 'object' ? payload : { msg: payload };
				const friend = data.friend || {};
				const active_id = get_chat_state().receive_user?.id;
				if (!active_id) {
					return;
				}
				if (friend.id && String(friend.id) != String(active_id)) {
					return;
				}
				this.clear_typing_tip();
				const msg = typeof data.msg === 'string' ? data.msg : '';
				if (msg === '') {
					return;
				}
				this.input_status_text = '客服正在输入...';
				// 对齐 PC is-user-input-message：开才展示正文；'input' 是占位符不算正文
				if (chat_can_show_input_message() && msg != 'input') {
					this.input_status_msg = msg;
				} else {
					this.input_status_msg = '';
				}
				typing_hide_timer = setTimeout(() => {
					this.input_status_text = '';
					this.input_status_msg = '';
					typing_hide_timer = null;
				}, 5000);
			
		},

		on_friend_leave_session(payload) {
			
				const friend = (payload && payload.friend) || (payload && payload.data && payload.data.friend) || {};
				const active_id = get_chat_state().receive_user?.id;
				// 对齐 PC：仅当前会话好友离开才清输入提示
				if (!active_id || !friend.id || String(friend.id) != String(active_id)) {
					return;
				}
				this.clear_typing_tip();
			
		},

		on_friend_status(payload) {
			
				const friend = payload?.friend || payload;
				const active_id = get_chat_state().receive_user?.id;
				if (!active_id || !friend || String(friend.id) != String(active_id)) {
					return;
				}
				if (Number(friend.status) === 0) {
					this.clear_typing_tip();
				}
			
		},

		on_business(payload) {
			
				const goods_map = (payload && payload.goods) || {};
				if (isEmpty(goods_map)) {
					return;
				}
				this.message_list = this.message_list.map((row) => {
					if (!(row.goods_id > 0) || row.goods) {
						return row;
					}
					const goods = goods_map[row.goods_id] || goods_map[String(row.goods_id)];
					if (!goods) {
						return row;
					}
					return {
						...row,
						data_type: 'goods',
						goods: {
							id: goods.id || row.goods_id,
							title: goods.title || '',
							price: goods.price || '',
							images: goods.images || '',
							goods_url: goods.goods_url || '',
						},
					};
				});
			
		},

		sync_receive_user_ui(receive) {
			
				if (!receive || !receive.id) {
					return;
				}
				this.chat_id = String(receive.id);
				this.route_chat_id = this.chat_id;
				chat_set_receive_user(receive);
				this.receive_avatar = receive.avatar || this.default_avatar;
				this.chat_title = receive.name || '在线客服';
				try {
					uni.setNavigationBarTitle({ title: this.chat_title });
				} catch (e) {}
				this.current_avatar = get_chat_state().current_user?.avatar || this.default_avatar;
				if (record_init_done && pending_session_revive) {
					this.try_enter_auto_continue();
				}
			
		},

		on_success() {
			
				if (!this.page_alive) {
					return;
				}
				const chat_state = get_chat_state();
				this.is_resume_hold = false;
				this.is_connecting = false;
				this.connect_status = chat_state.connect_status || 0;
				this.online_status = chat_state.online_status || 'off';
				this.current_avatar = chat_state.current_user?.avatar || this.default_avatar;
				this.sync_emoji_list();
				this.sync_ai_state(chat_state);
				if (this.route_chat_id) {
					this.resolve_route_receive_user();
				} else if (chat_state.receive_user?.id) {
					this.sync_receive_user_ui(chat_state.receive_user);
				}
				this.list_ready = false;
				this.load_chat_record_if_connected();
				// WS / receive_user 就绪后补发进页续聊
				this.try_enter_auto_continue();

		},

		on_queue_status(payload) {
			
				if (!this.page_alive) {
					return;
				}
				const data = payload || {};
				const pos = parseInt(data.position || data.queue_position || 0) || 0;
				const total = parseInt(data.total || data.queue_total || 0) || 0;
				if (pos > 0) {
					this.queue_status_text = total > 0 ? ('排队中，您前面还有 ' + Math.max(0, pos - 1) + ' 人') : ('排队中，当前第 ' + pos + ' 位');
					return;
				}
				const tip = String(data.msg || data.content || data.tips || '').trim();
				this.queue_status_text = tip;
			
		},

		on_chat_rating_open() {
			
				if (!this.page_alive) {
					return;
				}
				if (suppress_ended_choice || pending_session_revive) {
					return;
				}
				// 超时结束：先弹继续/退出；主动结束（skip_auto_continue）则直接评价
				if (this.session_ended && allow_ended_prompt && session_page_engaged && !ended_choice_handled && !this.skip_auto_continue) {
					this.prompt_ended_session_choice();
					return;
				}
				if (!this.show_rating_modal) {
					this.open_rating_modal_event();
				}
			
		},

		sync_connect_ui() {
			
				const data = get_chat_state();
				if (data.connect_status === 1) {
					this.is_resume_hold = false;
				} else if (this.is_resume_hold || this.has_uploading_media) {
					this.is_connecting = false;
					return;
				}
				this.connect_status = data.connect_status || 0;
				this.online_status = data.online_status || 'off';
				this.is_connecting = !!data.is_connecting;
			
		},

		on_status(payload) {
			
				if (!this.page_alive) {
					return;
				}
				const data = payload || get_chat_state();
				if (data.connect_status === 1) {
					this.is_resume_hold = false;
				} else if (this.is_resume_hold || this.has_uploading_media) {
					this.is_connecting = false;
					return;
				}
				this.online_status = data.online_status || 'off';
				this.connect_status = data.connect_status || 0;
				this.is_connecting = !!data.is_connecting;
			
		},

		on_connecting(payload) {
			
				if (!this.page_alive) {
					return;
				}
				const data = payload || get_chat_state();
				if (data.connect_status === 1) {
					this.is_resume_hold = false;
				} else if (this.is_resume_hold || this.has_uploading_media) {
					return;
				}
				this.is_connecting = !!data.is_connecting;
				this.connect_status = data.connect_status || 0;
				this.online_status = data.online_status || this.online_status;
			
		},

		on_connect_error(payload) {
			
				if (!this.page_alive) {
					return;
				}
				this.is_connecting = !!get_chat_state().is_connecting;
				this.connect_status = get_chat_state().connect_status || 0;
				if (payload?.timeout || !get_chat_state().is_connecting) {
					this.is_connecting = false;
				}
			
		},

		bind_events() {
			on_chat_event('record', this.on_record);
			on_chat_event('chat', this.on_chat);
			on_chat_event('chat_recall', this.on_chat_recall);
			on_chat_event('chat_ack', this.on_chat_ack);
			on_chat_event('chat_read', this.on_chat_read);
			on_chat_event('friend_input_status', this.on_friend_input_status);
			on_chat_event('friend_leave_session', this.on_friend_leave_session);
			on_chat_event('friend_status', this.on_friend_status);
			on_chat_event('business', this.on_business);
			on_chat_event('success', this.on_success);
			on_chat_event('status', this.on_status);
			on_chat_event('close', this.on_status);
			on_chat_event('connecting', this.on_connecting);
			on_chat_event('success_fail', this.on_connect_error);
			on_chat_event('error', this.on_connect_error);
			on_chat_event('ai_mode', this.sync_ai_state);
			on_chat_event('ai_thinking', this.on_ai_thinking);
			on_chat_event('agent_online_list', this.on_agent_online_list);
			on_chat_event('friend_base', this.on_friend_base);
			on_chat_event('chat_features', this.on_chat_features);
			on_chat_event('emoji_list', this._bound_sync_emoji_list);
			on_chat_event('chat_reject', this.on_chat_reject);
			on_chat_event('record_search', this.on_record_search);
			on_chat_event('record_around', this.on_record_around);
			on_chat_event('chat_rating', this.on_chat_rating);
			on_chat_event('chat_rating_open', this.on_chat_rating_open);
			on_chat_event('queue_status', this.on_queue_status);
			on_chat_event('chat_pending_send_fail', this.on_chat_pending_send_fail);
			on_chat_event('chat_pending_send_flush', this.on_chat_pending_send_flush);
		},

		sync_tool_flags() {
			
				this.show_tool_emoji = chat_can_use_tool('emoji');
				this.show_tool_images = chat_can_use_tool('images');
				this.show_tool_video = chat_can_use_tool('video');
				this.show_tool_audio = chat_can_use_tool('audio');
				this.show_tool_voice = chat_can_use_tool('voice');
				this.show_tool_file = chat_can_use_tool('file');
				this.show_msg_search_btn = chat_can_search_record();
				if (!this.show_tool_emoji && this.panel_type == 'emoji') {
					this.panel_type = '';
				}
				if (!this.show_tool_voice && this.is_voice_input) {
					this.is_voice_input = false;
				}
				if (!this.show_msg_search_btn && this.msg_search_open) {
					this.close_msg_search_event();
				}
			
		},

		on_chat_features() {
			
				if (!this.page_alive) {
					return;
				}
				this.can_end_session = chat_can_end();
				this.show_read_receipt = chat_can_show_read();
				this.sync_tool_flags();
			
		},

		unbind_events() {
			off_chat_event('record', this.on_record);
			off_chat_event('chat', this.on_chat);
			off_chat_event('chat_recall', this.on_chat_recall);
			off_chat_event('chat_ack', this.on_chat_ack);
			off_chat_event('chat_read', this.on_chat_read);
			off_chat_event('friend_input_status', this.on_friend_input_status);
			off_chat_event('friend_leave_session', this.on_friend_leave_session);
			off_chat_event('friend_status', this.on_friend_status);
			off_chat_event('business', this.on_business);
			off_chat_event('success', this.on_success);
			off_chat_event('status', this.on_status);
			off_chat_event('close', this.on_status);
			off_chat_event('connecting', this.on_connecting);
			off_chat_event('success_fail', this.on_connect_error);
			off_chat_event('error', this.on_connect_error);
			off_chat_event('ai_mode', this.sync_ai_state);
			off_chat_event('ai_thinking', this.on_ai_thinking);
			off_chat_event('agent_online_list', this.on_agent_online_list);
			off_chat_event('friend_base', this.on_friend_base);
			off_chat_event('chat_features', this.on_chat_features);
			off_chat_event('emoji_list', this._bound_sync_emoji_list);
			off_chat_event('chat_reject', this.on_chat_reject);
			off_chat_event('record_search', this.on_record_search);
			off_chat_event('record_around', this.on_record_around);
			off_chat_event('chat_rating', this.on_chat_rating);
			off_chat_event('chat_rating_open', this.on_chat_rating_open);
			off_chat_event('queue_status', this.on_queue_status);
			off_chat_event('chat_pending_send_fail', this.on_chat_pending_send_fail);
			off_chat_event('chat_pending_send_flush', this.on_chat_pending_send_flush);
		},

		input_event(e) {
			
				this.input_text = e?.detail?.value || '';
				if (isEmpty(this.input_text)) {
					this.input_line_count = 1;
				}
				this.push_input_status_event();
			
		},

		push_input_status_event() {
			
				if (this.ai_mode == 'ai') {
					return;
				}
				if (input_status_timer) {
					clearTimeout(input_status_timer);
				}
				input_status_timer = setTimeout(() => {
					input_status_timer = null;
					chat_send_input_status(String(this.input_text || ''));
				}, 400);
			
		},

		input_linechange_event(e) {
			
				const count = Number(e?.detail?.lineCount || e?.detail?.height || 0);
				if (count > 0 && count < 100) {
					this.input_line_count = count;
				}
			
		},

		open_input_fullscreen_event() {
			
				this.panel_type = '';
				this.input_focus = false;
				this.is_input_fullscreen = true;
			
		},

		close_input_fullscreen_event() {
			
				this.is_input_fullscreen = false;
				this.panel_type = '';
			
		},

		hide_panel_event() {
			
				if (Date.now() < skip_hide_panel_until) {
					return;
				}
				this.panel_type = '';
				this.input_focus = false;
				this.keyboard_height = 0;
			
		},

		input_focus_event() {
			
				if (!this.assert_can_compose()) {
					this.input_focus = false;
					return;
				}
				this.is_voice_input = false;
				this.panel_type = '';
				this.push_input_status_event();
			
		},

		toggle_voice_event() {
			
				if (!this.assert_can_compose()) {
					return;
				}
				if (!this.show_tool_voice) {
					showToast('未开启语音');
					return;
				}
				if (this.voice_recording) {
					this.voice_will_cancel = true;
					this.voice_press_end();
				}
				if (!this.is_voice_input) {
					ensure_chat_media_auth_before_pick();
				}
				this.is_voice_input = !this.is_voice_input;
				this.panel_type = '';
				this.input_focus = false;
				this.keyboard_height = 0;
				if (!this.is_voice_input) {
					this.scroll_to_bottom();
				}
			
		},

		hint_voice_too_short() {
			
				if (voice_short_hinted) {
					return;
				}
				voice_short_hinted = true;
				showToast(VOICE_TOO_SHORT_TIP);
			
		},

		stop_audio_play() {
			
				if (audio_ctx) {
					try {
						audio_ctx.stop();
					} catch (e) {}
					try {
						audio_ctx.destroy();
					} catch (e) {}
					audio_ctx = null;
				}
				this.playing_audio_key = '';
			
		},

		guess_voice_file_name(path, mime) {
			
				const m = String(mime || '').toLowerCase();
				const p = String(path || '').toLowerCase();
				if (m.indexOf('mp4') >= 0 || m.indexOf('m4a') >= 0 || m.indexOf('aac') >= 0) {
					return 'voice.m4a';
				}
				if (m.indexOf('ogg') >= 0) {
					return 'voice.ogg';
				}
				if (m.indexOf('mpeg') >= 0 || m.indexOf('mp3') >= 0) {
					return 'voice.mp3';
				}
				if (m.indexOf('webm') >= 0) {
					return 'voice.webm';
				}
				if (/\.m4a(\?|$)/.test(p) || /\.mp4(\?|$)/.test(p)) {
					return 'voice.m4a';
				}
				if (/\.ogg(\?|$)/.test(p)) {
					return 'voice.ogg';
				}
				if (/\.webm(\?|$)/.test(p)) {
					return 'voice.webm';
				}
				if (/\.aac(\?|$)/.test(p)) {
					return 'voice.aac';
				}
				if (/\.mp3(\?|$)/.test(p)) {
					return 'voice.mp3';
				}
				return 'voice.webm';
			
		},

		is_voice_mouse_event(e) {
			
				const t = (e && e.type) || '';
				return t == 'mousedown' || t == 'mouseup' || t == 'mousemove';
			
		},

		pick_event_point(e) {
			
				if (!e) {
					return {};
				}
				if (e.touches && e.touches[0]) {
					return e.touches[0];
				}
				if (e.changedTouches && e.changedTouches[0]) {
					return e.changedTouches[0];
				}
				if (e.detail && (e.detail.clientY || e.detail.pageY)) {
					return e.detail;
				}
				return e;
			
		},

		clear_voice_stop_timer() {
			
				if (voice_stop_timer) {
					clearTimeout(voice_stop_timer);
					voice_stop_timer = null;
				}
			
		},

		clear_voice_release_timer() {
			
				if (voice_release_timer) {
					clearTimeout(voice_release_timer);
					voice_release_timer = null;
				}
			
		},

		clear_voice_cancel_leave_timer() {
			
				if (voice_cancel_leave_timer) {
					clearTimeout(voice_cancel_leave_timer);
					voice_cancel_leave_timer = null;
				}
			
		},

		reset_voice_ui() {
			
				this.clear_voice_stop_timer();
				this.clear_voice_release_timer();
				this.clear_voice_cancel_leave_timer();
				voice_want_record = false;
				voice_stopping = false;
				voice_cancel_rect = null;
				voice_send_rect = null;
				if (!this.page_alive) {
					return;
				}
				this.voice_recording = false;
				this.voice_will_cancel = false;
			
		},

		handle_voice_start_fail(err) {
			
				this.reset_voice_ui();
				const msg = String((err && err.message) || err || '').toLowerCase();
				if (msg.indexOf('mic') >= 0 || msg.indexOf('permission') >= 0 || msg.indexOf('notallowed') >= 0 || msg.indexOf('denied') >= 0) {
					showToast('请允许使用麦克风');
					// #ifdef MP-WEIXIN
					setTimeout(() => {
						try {
							uni.openSetting({});
						} catch (e) {}
					}, 800);
					// #endif
					return;
				}
				showToast('录音启动失败');
			
		},

		circle_from_rect(r) {
			
				if (!r || r.width <= 0) {
					return null;
				}
				const radius = Math.min(r.width, r.height) / 2;
				return {
					cx: r.left + r.width / 2,
					cy: r.top + r.height / 2,
					radius,
				};
			
		},

		point_in_voice_cancel(x, y, loose) {
			
				const outer = this.circle_from_rect(voice_cancel_rect);
				if (!outer) {
					return false;
				}
				const pad = loose ? 20 : 0;
				const dx = x - outer.cx;
				const dy = y - outer.cy;
				if (dx * dx + dy * dy > (outer.radius + pad) * (outer.radius + pad)) {
					return false;
				}
				const inner = this.circle_from_rect(voice_send_rect);
				if (inner) {
					const gap = loose ? 0 : 12;
					const hole = inner.radius + gap;
					const ix = x - inner.cx;
					const iy = y - inner.cy;
					if (ix * ix + iy * iy <= hole * hole) {
						return false;
					}
				}
				return true;
			
		},

		apply_voice_cancel_hit(hit) {
			
				if (hit) {
					this.clear_voice_cancel_leave_timer();
					this.voice_will_cancel = true;
					return;
				}
				if (!this.voice_will_cancel || voice_cancel_leave_timer) {
					return;
				}
				voice_cancel_leave_timer = setTimeout(() => {
					voice_cancel_leave_timer = null;
					this.voice_will_cancel = false;
				}, VOICE_RELEASE_GRACE_MS);
			
		},

		measure_voice_cancel_btn(retry = 0) {
			
				if (!this.page_alive) {
					return;
				}
				this.$nextTick(() => {
					if (!this.page_alive) {
						return;
					}
					const mask = this.$refs.chat_voice_mask_ref;
					if (mask && typeof mask.measure_zones === 'function') {
						mask.measure_zones().then(({ cancel, send }) => {
							if (!this.page_alive) {
								return;
							}
							if (cancel && cancel.width > 0) {
								voice_cancel_rect = cancel;
							}
							if (send && send.width > 0) {
								voice_send_rect = send;
							}
						});
						return;
					}
					if (retry < 3) {
						setTimeout(() => this.measure_voice_cancel_btn(retry + 1), 50);
						return;
					}
					const scope = this;
					const query = scope ? uni.createSelectorQuery().in(scope) : uni.createSelectorQuery();
					query.select('.voice-cancel-btn').boundingClientRect((rect) => {
						if (!this.page_alive) {
							return;
						}
						if (rect && rect.width > 0) {
							voice_cancel_rect = rect;
						}
					});
					query.select('.voice-send-arc').boundingClientRect((rect) => {
						if (!this.page_alive) {
							return;
						}
						if (rect && rect.width > 0) {
							voice_send_rect = rect;
						}
					});
					query.exec();
				});
			
		},

		is_dup_voice_event(e) {
			
				const t = (e && e.type) || '';
				if (Date.now() >= voice_ignore_mouse_until) {
					return false;
				}
				// 按住说话中不能丢掉 pointerup，部分端只有指针事件能收到松手
				if (this.voice_recording || voice_want_record) {
					return false;
				}
				return t.indexOf('mouse') == 0 || t.indexOf('pointer') == 0;
			
		},

		create_h5_recorder() {
			
				let stop_cb = null;
				let error_cb = null;
				let media_recorder = null;
				let media_stream = null;
				let chunks = [];
				let rec_mime = '';
				let rec_start_ts = 0;
				let start_token = 0;
				let want_stop = false;
				let starting = false;
			
				const cleanup_stream = () => {
					if (media_stream) {
						try {
							media_stream.getTracks().forEach((t) => {
								try {
									t.stop();
								} catch (e) {}
							});
						} catch (e) {}
						media_stream = null;
					}
					media_recorder = null;
					chunks = [];
					starting = false;
				};
			
				const pick_mime = () => {
					const types = [
						'audio/webm;codecs=opus',
						'audio/webm',
						'audio/mp4',
						'audio/aac',
						'audio/ogg;codecs=opus',
					];
					if (typeof MediaRecorder == 'undefined' || typeof MediaRecorder.isTypeSupported != 'function') {
						return '';
					}
					for (let i = 0; i < types.length; i++) {
						if (MediaRecorder.isTypeSupported(types[i])) {
							return types[i];
						}
					}
					return '';
				};
			
				const fire_stop = (res) => {
					starting = false;
					if (typeof stop_cb == 'function') {
						stop_cb(res || { tempFilePath: '', duration: 0 });
					}
				};
			
				const fire_error = () => {
					cleanup_stream();
					if (typeof error_cb == 'function') {
						error_cb();
					}
				};
			
				const stop_recorder_now = () => {
					if (media_recorder && media_recorder.state != 'inactive') {
						try {
							if (typeof media_recorder.requestData == 'function') {
								media_recorder.requestData();
							}
						} catch (e) {}
						try {
							media_recorder.stop();
						} catch (e) {
							cleanup_stream();
							fire_stop({ tempFilePath: '', duration: 0 });
						}
						return true;
					}
					return false;
				};
			
				return {
					onStop: (cb) => {
						stop_cb = cb;
					},
					onError: (cb) => {
						error_cb = cb;
					},
					start: () => {
						want_stop = false;
						starting = true;
						const token = ++start_token;
						chunks = [];
						if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia != 'function') {
							starting = false;
							return Promise.reject(new Error('no mic'));
						}
						if (typeof MediaRecorder == 'undefined') {
							starting = false;
							return Promise.reject(new Error('no MediaRecorder'));
						}
						return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
							if (token !== start_token) {
								stream.getTracks().forEach((t) => {
									try {
										t.stop();
									} catch (e) {}
								});
								return;
							}
							media_stream = stream;
							rec_mime = pick_mime();
							try {
								media_recorder = rec_mime
									? new MediaRecorder(stream, { mimeType: rec_mime })
									: new MediaRecorder(stream);
							} catch (err) {
								stream.getTracks().forEach((t) => {
									try {
										t.stop();
									} catch (e) {}
								});
								media_stream = null;
								starting = false;
								throw err;
							}
							rec_mime = media_recorder.mimeType || rec_mime;
							rec_start_ts = Date.now();
							starting = false;
							media_recorder.ondataavailable = (ev) => {
								if (ev && ev.data && ev.data.size > 0) {
									chunks.push(ev.data);
								}
							};
							media_recorder.onerror = () => {
								fire_error();
							};
							media_recorder.onstop = () => {
								const duration = Date.now() - rec_start_ts;
								const blob = new Blob(chunks, { type: rec_mime || 'audio/webm' });
								cleanup_stream();
								if (!blob.size) {
									fire_stop({ tempFilePath: '', duration, mimeType: rec_mime });
									return;
								}
								let url = '';
								try {
									url = URL.createObjectURL(blob);
								} catch (e) {
									fire_stop({ tempFilePath: '', duration, mimeType: rec_mime });
									return;
								}
								fire_stop({
									tempFilePath: url,
									duration,
									mimeType: blob.type || rec_mime,
								});
							};
							try {
								media_recorder.start(200);
							} catch (e) {
								media_recorder.start();
							}
							// 松手发生在 getUserMedia 等待期间：稍等首包再停，避免空 blob
							if (want_stop) {
								setTimeout(() => {
									if (want_stop && this.page_alive) {
										stop_recorder_now();
									}
								}, 280);
							}
						}).catch((err) => {
							cleanup_stream();
							if (want_stop) {
								fire_stop({ tempFilePath: '', duration: 0 });
								return;
							}
							throw err;
						});
					},
					stop: () => {
						want_stop = true;
						if (stop_recorder_now()) {
							return;
						}
						// getUserMedia 尚未返回：等 start 里就绪后再 stop，不要立刻空回调
						if (starting) {
							return;
						}
						if (media_stream) {
							cleanup_stream();
						}
						fire_stop({ tempFilePath: '', duration: 0 });
					},
				};
			
		},

		bind_recorder_handlers(mgr) {
			
				mgr.onStop((res) => {
					this.clear_voice_stop_timer();
					voice_stopping = false;
					voice_want_record = false;
					if (!this.page_alive) {
						voice_handled = true;
						return;
					}
					this.voice_recording = false;
					this.voice_will_cancel = false;
					if (voice_handled) {
						return;
					}
					voice_handled = true;
					const cancel = voice_pending_cancel;
					const hold_ms = voice_pending_hold_ms || (voice_start_ts > 0 ? (Date.now() - voice_start_ts) : 0);
					if (cancel) {
						return;
					}
					const path = (res && res.tempFilePath) || '';
					const dur_raw = Number((res && res.duration) || 0);
					let dur_ms = dur_raw;
					// 部分端 duration 是秒；H5 MediaRecorder 是毫秒
					if (dur_raw > 0 && dur_raw <= 120 && hold_ms > dur_raw * 2) {
						dur_ms = dur_raw * 1000;
					}
					if (!(dur_ms > 0)) {
						dur_ms = hold_ms;
					}
					// H5 getUserMedia 会吃掉一段启动时间，实际录音时长常短于按住时长；以按住时长为准判定是否太短
					const gate_ms = Math.max(hold_ms, dur_ms);
					if (isEmpty(path)) {
						if (hold_ms >= VOICE_MIN_MS) {
							showToast('录音失败，请重试');
						} else {
							this.hint_voice_too_short();
						}
						return;
					}
					if (gate_ms < VOICE_MIN_MS) {
						this.hint_voice_too_short();
						return;
					}
					const sec = Math.max(1, Math.round(gate_ms / 1000));
					const file_name = this.guess_voice_file_name(path, res && res.mimeType);
					this.send_media_message('audio', path, { file_name, duration: sec, voice: 1 });
				});
				mgr.onError(() => {
					if (voice_want_record || this.voice_recording) {
						return;
					}
					const hold_ms = voice_pending_hold_ms || (voice_start_ts > 0 ? (Date.now() - voice_start_ts) : 0);
					this.reset_voice_ui();
					if (!this.page_alive) {
						return;
					}
					if (hold_ms < VOICE_MIN_MS) {
						this.hint_voice_too_short();
						return;
					}
					showToast('录音失败，请重试');
				});
			
		},

		ensure_recorder() {
			
				if (recorder_mgr) {
					return recorder_mgr;
				}
				let mgr = null;
				// #ifdef H5
				mgr = this.create_h5_recorder();
				// #endif
				// #ifndef H5
				if (typeof uni.getRecorderManager == 'function') {
					mgr = uni.getRecorderManager();
				}
				// #endif
				if (!mgr) {
					return null;
				}
				recorder_mgr = mgr;
				this.bind_recorder_handlers(recorder_mgr);
				return recorder_mgr;
			
		},

		stop_voice_event(e) {
			if (!e) {
				return;
			}
			if (typeof e.stopPropagation === 'function') {
				e.stopPropagation();
			}
			if (typeof e.preventDefault === 'function') {
				e.preventDefault();
			}
		},

		voice_press_start(e) {
			
				this.stop_voice_event(e);
				if (this.is_dup_voice_event(e)) {
					return;
				}
				if ((e && e.type) == 'touchstart' || (e && e.pointerType == 'touch')) {
					voice_ignore_mouse_until = Date.now() + 700;
				}
				// 抖手瞬间离屏又按下：取消待结束，继续录
				if (voice_release_timer && (this.voice_recording || voice_want_record)) {
					this.clear_voice_release_timer();
					const resume_touch = this.pick_event_point(e);
					const resume_x = Number(resume_touch.clientX || resume_touch.pageX || 0);
					const resume_y = Number(resume_touch.clientY || resume_touch.pageY || 0);
					if (resume_y > 0) {
						voice_start_y = resume_y;
					}
					this.apply_voice_cancel_hit(this.point_in_voice_cancel(resume_x, resume_y, true));
					return;
				}
				if (this.voice_recording || voice_want_record) {
					return;
				}
				if (!this.assert_can_compose()) {
					return;
				}
				const mgr = this.ensure_recorder();
				if (!mgr) {
					showToast('当前环境暂不支持录音');
					return;
				}
				const touch = this.pick_event_point(e);
				voice_start_y = Number(touch.clientY || touch.pageY || 0);
				voice_start_ts = Date.now();
				this.voice_will_cancel = false;
				voice_want_record = true;
				this.voice_recording = true;
				voice_handled = false;
				voice_pending_cancel = false;
				voice_pending_hold_ms = 0;
				voice_short_hinted = false;
				this.measure_voice_cancel_btn();
				// #ifdef H5
				try {
					const el = e && e.currentTarget;
					if (el && e.pointerId != null && typeof el.setPointerCapture == 'function') {
						el.setPointerCapture(e.pointerId);
					}
				} catch (err) {}
				// #endif
				try {
					const start_opts = {
						duration: 60000,
						numberOfChannels: 1,
					};
					// #ifdef MP-WEIXIN
					start_opts.format = 'aac';
					start_opts.sampleRate = 16000;
					start_opts.encodeBitRate = 48000;
					// #endif
					// #ifndef MP-WEIXIN
					start_opts.format = 'mp3';
					// #endif
					const started = mgr.start(start_opts);
					this.bind_voice_doc_events();
					if (started && typeof started.then == 'function') {
						started.then(() => {
							if (!voice_want_record && recorder_mgr) {
								try {
									recorder_mgr.stop();
								} catch (err) {}
							}
						}).catch((err) => {
							this.handle_voice_start_fail(err);
						});
					}
				} catch (err) {
					this.handle_voice_start_fail(err);
				}
			
		},

		voice_press_move(e) {
			
				this.stop_voice_event(e);
				if (this.is_voice_mouse_event(e) && Date.now() < voice_ignore_mouse_until) {
					return;
				}
				if (!this.voice_recording) {
					return;
				}
				if (e && typeof e.preventDefault == 'function') {
					try {
						e.preventDefault();
					} catch (err) {}
				}
				const touch = this.pick_event_point(e);
				const x = Number(touch.clientX || touch.pageX || 0);
				const y = Number(touch.clientY || touch.pageY || 0);
				if (!voice_cancel_rect) {
					this.measure_voice_cancel_btn();
				}
				this.apply_voice_cancel_hit(this.point_in_voice_cancel(x, y, this.voice_will_cancel));
			
		},

		commit_voice_press_end() {
			
				this.clear_voice_release_timer();
				this.clear_voice_cancel_leave_timer();
				if (!this.voice_recording && !voice_want_record) {
					this.unbind_voice_doc_events();
					return;
				}
				voice_pending_hold_ms = voice_start_ts > 0 ? (Date.now() - voice_start_ts) : 0;
				voice_pending_cancel = !!this.voice_will_cancel;
				voice_want_record = false;
				this.voice_recording = false;
				this.voice_will_cancel = false;
				this.unbind_voice_doc_events();
				if (voice_stopping) {
					return;
				}
				voice_stopping = true;
				const mgr = recorder_mgr;
				const hold_ms = voice_pending_hold_ms;
				const cancel = voice_pending_cancel;
				if (!mgr || cancel) {
					voice_handled = true;
					try {
						mgr && mgr.stop();
					} catch (err) {}
					voice_stopping = false;
					return;
				}
				if (hold_ms < VOICE_MIN_MS) {
					voice_handled = true;
					try {
						mgr.stop();
					} catch (err) {}
					voice_stopping = false;
					this.hint_voice_too_short();
					return;
				}
				try {
					mgr.stop();
				} catch (err) {
					voice_stopping = false;
					if (hold_ms < VOICE_MIN_MS) {
						this.hint_voice_too_short();
					} else {
						showToast('录音失败，请重试');
					}
					return;
				}
				this.clear_voice_stop_timer();
				// H5 等 getUserMedia / MediaRecorder.onstop 可能较慢，超时勿误判成「不足 1 秒」
				voice_stop_timer = setTimeout(() => {
					voice_stop_timer = null;
					if (!voice_stopping) {
						return;
					}
					voice_stopping = false;
					if (voice_handled) {
						return;
					}
					voice_handled = true;
					if (hold_ms < VOICE_MIN_MS) {
						this.hint_voice_too_short();
						return;
					}
					showToast('录音失败，请重试');
				}, 2500);
			
		},

		voice_press_end(e) {
			
				this.stop_voice_event(e);
				if (e && ((e.type == 'touchend') || (e.type == 'touchcancel') || e.pointerType == 'touch')) {
					voice_ignore_mouse_until = Date.now() + 700;
				}
				if (this.is_dup_voice_event(e) || (this.is_voice_mouse_event(e) && Date.now() < voice_ignore_mouse_until && !this.voice_recording && !voice_want_record)) {
					return;
				}
				if (!this.voice_recording && !voice_want_record) {
					this.unbind_voice_doc_events();
					return;
				}
				if (voice_release_timer) {
					return;
				}
				voice_release_timer = setTimeout(() => {
					voice_release_timer = null;
					this.commit_voice_press_end();
				}, VOICE_RELEASE_GRACE_MS);
			
		},

		bind_voice_doc_events() {
			
				// #ifndef MP
				if (typeof document == 'undefined') {
					return;
				}
				this.unbind_voice_doc_events();
				const self = this;
				voice_doc_end_handler = (e) => self.voice_press_end(e);
				voice_doc_move_handler = (e) => self.voice_press_move(e);
				document.addEventListener('pointerup', voice_doc_end_handler);
				document.addEventListener('pointercancel', voice_doc_end_handler);
				document.addEventListener('pointermove', voice_doc_move_handler);
				document.addEventListener('mouseup', voice_doc_end_handler);
				document.addEventListener('mousemove', voice_doc_move_handler);
				document.addEventListener('touchend', voice_doc_end_handler);
				document.addEventListener('touchcancel', voice_doc_end_handler);
				document.addEventListener('touchmove', voice_doc_move_handler, voice_touch_opts);
				// #endif
			
		},

		unbind_voice_doc_events() {
			
				// #ifndef MP
				if (typeof document == 'undefined') {
					return;
				}
				if (voice_doc_end_handler) {
					document.removeEventListener('pointerup', voice_doc_end_handler);
					document.removeEventListener('pointercancel', voice_doc_end_handler);
					document.removeEventListener('mouseup', voice_doc_end_handler);
					document.removeEventListener('touchend', voice_doc_end_handler);
					document.removeEventListener('touchcancel', voice_doc_end_handler);
					voice_doc_end_handler = null;
				}
				if (voice_doc_move_handler) {
					document.removeEventListener('pointermove', voice_doc_move_handler);
					document.removeEventListener('mousemove', voice_doc_move_handler);
					document.removeEventListener('touchmove', voice_doc_move_handler, voice_touch_opts);
					voice_doc_move_handler = null;
				}
				// #endif
			
		},

		input_blur_event() {
			
				this.input_focus = false;
				// 对齐 PC：失焦推空串，清除对方「正在输入」
				if (this.ai_mode != 'ai' && get_chat_state().connect_status === 1) {
					chat_send_input_status('');
				}
			
		},

		toggle_emoji_event() {
			
				if (!this.assert_can_compose()) {
					return;
				}
				if (this.panel_type == 'emoji') {
					this.panel_type = '';
					return;
				}
				this.is_voice_input = false;
				this.load_recent_emoji();
				this.panel_type = 'emoji';
				this.input_focus = false;
				this.keyboard_height = 0;
				this.scroll_to_bottom();
			
		},

		toggle_more_event() {
			
				if (!this.assert_can_compose({ skip_connect: this.has_uploading_media || this.is_resume_hold })) {
					return;
				}
				if (this.panel_type == 'more') {
					this.panel_type = '';
				} else {
					this.more_swiper_index = 0;
					this.panel_type = 'more';
					ensure_chat_media_auth_before_pick();
				}
				this.input_focus = false;
				this.keyboard_height = 0;
				this.scroll_to_bottom();
			
		},

		more_swiper_change_event(e) {
			
				this.more_swiper_index = Number(e?.detail?.current || 0);
			
		},

		more_item_tap_event(e) {
			
				const type = e?.currentTarget?.dataset?.type || '';
				const action = e?.currentTarget?.dataset?.action || '';
				if (type) {
					this.open_consult_popup_event(e);
					return;
				}
				if (action == 'images') {
					this.pick_image_event();
					return;
				}
				if (action == 'video') {
					this.pick_video_album_event();
					return;
				}
				if (action == 'file') {
					this.pick_file_event();
					return;
				}
				if (action == 'audio') {
					this.pick_audio_event();
				}
			
		},

		toggle_goods_panel_event() {
			
				this.open_consult_popup_event({ currentTarget: { dataset: { type: 'goods' } } });
			
		},

		back_event() {
			
				page_back_prev_event();
			
		},

		more_menu_event() {
			
				uni.navigateTo({
					url: '/pages/customer-service/detail',
				});
			
		},

		open_goods_card_event(e) {
			
				if (!this.goods_clickable) {
					return;
				}
				const json_str = e?.currentTarget?.dataset?.json || '{}';
				let goods = {};
				try {
					goods = JSON.parse(json_str) || {};
				} catch (err) {
					goods = {};
				}
				chat_open_goods(goods);
			
		},

		transfer_human_event() {
			
				if (this.ai_switching) {
					return;
				}
				chat_transfer_human();
			
		},

		end_session_event() {
			
				if (!this.can_end_session) {
					showToast('未开启结束对话');
					return;
				}
				if (this.session_ended) {
					return;
				}
				uni.showModal({
					title: '温馨提示',
					content: '确认结束本次咨询吗？',
					success: (res) => {
						if (!res.confirm) {
							return;
						}
						this.skip_auto_continue = true;
						ended_choice_handled = true;
						allow_ended_prompt = false;
						this.panel_type = '';
						const should_rate = chat_can_rating();
						const run_end = () => {
							if (!this.page_alive) {
								return;
							}
							// 先弹出评价再发 chat-end，避免结束按钮消失后出现空档
							if (should_rate) {
								this.open_rating_modal_event();
							}
							const ok = chat_end_session();
							if (!ok) {
								this.show_rating_modal = false;
								this.skip_auto_continue = false;
								ended_choice_handled = false;
								allow_ended_prompt = record_init_done;
								return;
							}
							if (!should_rate) {
								setTimeout(() => {
									if (this.page_alive) {
										this.finish_end_rating_flow();
									}
								}, 100);
							}
						};
						// 等确认框关闭后立即执行（50ms），勿再等服务端 chat-rating-open
						setTimeout(run_end, 50);
					},
				});
			
		},

		chat_entry_back_params() {
			const cfg = get_chat_config();
			return {
				source: cfg.entry_source,
				data_id: cfg.entry_data_id,
				data_type: cfg.entry_data_type,
				chat_user: cfg.entry_chat_user,
				chat_type: cfg.entry_chat_type,
			};
		},

		takeover_human_event() {
			
				if (this.ai_switching) {
					return;
				}
				chat_transfer_human();
			
		},

		back_ai_event() {
			
				if (this.ai_switching) {
					return;
				}
				chat_transfer_ai();
			
		},

		mark_enter_ended_session() {
			session_page_engaged = false;
			pending_session_revive = true;
			clear_allow_ended_prompt_timer();
			allow_ended_prompt = false;
		},

		/** 进页结束态 / WS 就绪后：主动发 chat-continue（可重复尝试直到连上） */
		try_enter_auto_continue() {
			if (!this.page_alive || this.skip_auto_continue) {
				return false;
			}
			if (!pending_session_revive && !this.session_ended && !get_chat_state().ai?.ended) {
				return false;
			}
			const st = get_chat_state();
			if (st.connect_status !== 1 || !st.receive_user?.id) {
				return false;
			}
			if (!st.ai?.ended && !this.session_ended) {
				const was_pending = pending_session_revive;
				pending_session_revive = false;
				if (was_pending) {
					// 进页以为已结束但已恢复：等用户发消息后再 engaged
					arm_suppress_ended_choice(8000);
					schedule_allow_ended_prompt(8000);
				} else if (record_init_done) {
					session_page_engaged = true;
					allow_ended_prompt = true;
				}
				return false;
			}
			this.mark_enter_ended_session();
			arm_suppress_ended_choice(8000);
			return chat_continue_session({ silent: true });
		},

		/** 当前是否在聊天详情页且前台可见 */
		is_chat_page_foreground() {
			if (!this.page_alive || !page_visible) {
				return false;
			}
			try {
				const pages = getCurrentPages();
				const cur = pages && pages.length ? pages[pages.length - 1] : null;
				const route = String((cur && (cur.route || cur.__route__)) || '');
				return route.indexOf('plugins/chat/index') >= 0;
			} catch (e) {
				return page_visible;
			}
		},

		prompt_ended_session_choice() {
			
				// 仅本页聊天过程中超时/对方结束才弹；进页已结束走静默 chat-continue
				if (!this.page_alive || this.skip_auto_continue || this.show_rating_modal) {
					return;
				}
				if (suppress_ended_choice || pending_session_revive || !session_page_engaged) {
					return;
				}
				if (!allow_ended_prompt) {
					return;
				}
				if (ended_choice_showing || ended_choice_handled) {
					return;
				}
				if (!get_chat_state().receive_user?.id) {
					return;
				}
				if (!this.session_ended) {
					ended_choice_handled = false;
					return;
				}
				// 去了商品详情等其它页：不弹窗，回聊天页时重连续聊
				if (!this.is_chat_page_foreground()) {
					ended_while_page_hidden = true;
					return;
				}
				ended_choice_showing = true;
				this.show_ended_choice_modal = true;
			
		},

		/** 离开页期间会话结束 → 回页静默重连续聊 */
		resume_ended_session_after_return() {
			if (!this.page_alive || this.skip_auto_continue) {
				ended_while_page_hidden = false;
				return;
			}
			if (!ended_while_page_hidden) {
				return;
			}
			ended_while_page_hidden = false;
			ended_choice_showing = false;
			this.show_ended_choice_modal = false;
			this.mark_enter_ended_session();
			arm_suppress_ended_choice(8000);
			chat_resume_connect();
			this.sync_connect_ui();
			this.$nextTick(() => {
				this.try_enter_auto_continue();
			});
		},

		ended_choice_continue_event() {
			
				if (!this.page_alive) {
					return;
				}
				ended_choice_showing = false;
				this.show_ended_choice_modal = false;
				ended_choice_handled = true;
				if (get_chat_state().connect_status !== 1) {
					chat_resume_connect();
				}
				const ok = chat_continue_session();
				if (!ok) {
					ended_choice_handled = false;
					showToast('继续聊天失败，请重试');
					this.$nextTick(() => {
						this.prompt_ended_session_choice();
					});
				}
			
		},

		ended_choice_exit_event() {
			
				ended_choice_showing = false;
				this.show_ended_choice_modal = false;
				ended_choice_handled = true;
				this.page_alive = false;
				chat_back_to_list_event(this.chat_entry_back_params());
			
		},

		open_rating_modal_event() {
			
				if (this.show_rating_modal) {
					return;
				}
				this.rating_score = 0;
				this.rating_content = '';
				this.rating_submitting = false;
				this.panel_type = '';
				this.input_focus = false;
				this.show_rating_modal = true;
			
		},

		finish_end_rating_flow() {
			
				if (!this.page_alive && !this.show_rating_modal) {
					return;
				}
				this.show_rating_modal = false;
				this.rating_submitting = false;
				if (rating_submit_fallback_timer) {
					clearTimeout(rating_submit_fallback_timer);
					rating_submit_fallback_timer = null;
				}
				// 先标记页已失效，避免跳转后 WS 回调再改已销毁实例 / 重复跳转
				this.page_alive = false;
				chat_back_to_list_event(this.chat_entry_back_params());
			
		},

		close_rating_modal_event() {
			
				if (this.rating_submitting) {
					return;
				}
				this.finish_end_rating_flow();
			
		},

		select_rating_score_event(e) {
			
				const score = e?.currentTarget?.dataset?.score;
				this.rating_score = parseInt(score || 0) || 0;
			
		},

		rating_content_input_event(e) {
			
				this.rating_content = e?.detail?.value || '';
			
		},

		submit_rating_event() {
			
				if (this.rating_submitting) {
					return;
				}
				const score = parseInt(this.rating_score || 0) || 0;
				if (!(score >= 1 && score <= 5)) {
					showToast('请先选择星级');
					return;
				}
				const agent_cuid = parseInt(get_chat_state().receive_user?.id || 0) || 0;
				this.rating_submitting = true;
				const ok = chat_submit_rating({
					score,
					content: this.rating_content,
					agent_cuid,
					end_by: 'visitor',
				});
				if (!ok) {
					this.rating_submitting = false;
					return;
				}
				// 评价发出即回列表，不等 chat-rating 回包
				this.finish_end_rating_flow();
			
		},

		on_chat_rating() {
			
				if (!this.page_alive) {
					return;
				}
				if (rating_submit_fallback_timer) {
					clearTimeout(rating_submit_fallback_timer);
					rating_submit_fallback_timer = null;
				}
				// 提交时已立刻离开；若仍停在评价窗（异常路径）再兜底关闭
				if (this.show_rating_modal) {
					this.finish_end_rating_flow();
				}
			
		},

		open_agent_transfer_event() {
			
				if (!this.assert_can_compose()) {
					return;
				}
				if (this.session_ended) {
					return;
				}
				this.agent_transfer_list = [];
				this.agent_transfer_selected_id = '';
				const ok = chat_load_agent_online_list();
				if (ok) {
					this.show_agent_transfer = true;
					this.$nextTick(() => {
						this.agent_transfer_ref && this.agent_transfer_ref.open();
					});
				}
			
		},

		close_agent_transfer_event() {
			
				this.show_agent_transfer = false;
				this.agent_transfer_selected_id = '';
				if (this.agent_transfer_ref) {
					this.agent_transfer_ref.close();
				}
			
		},

		on_agent_transfer_popup_change(e) {
			
				if (e && e.show === false) {
					this.show_agent_transfer = false;
					this.agent_transfer_selected_id = '';
				}
			
		},

		select_agent_transfer_event(e) {
			
				const id = e?.currentTarget?.dataset?.id;
				if (isEmpty(id)) {
					return;
				}
				this.agent_transfer_selected_id = id;
			
		},

		confirm_agent_transfer_submit_event() {
			
				const id = this.agent_transfer_selected_id;
				if (isEmpty(id)) {
					showToast('请选择要转接的客服');
					return;
				}
				this.close_agent_transfer_event();
				chat_transfer_agent(id);
			
		},

		insert_emoji_event(e) {
			
				if (!this.assert_can_compose()) {
					return;
				}
				const emoji = e?.currentTarget?.dataset?.emoji || '';
				if (isEmpty(emoji)) {
					return;
				}
				this.input_text = String(this.input_text || '') + emoji;
				this.save_recent_emoji(emoji);
			
		},

		format_duration_text(sec) {
			
				const n = Math.max(0, Math.floor(Number(sec) || 0));
				const m = Math.floor(n / 60);
				const s = n % 60;
				return m + ':' + (s < 10 ? '0' + s : String(s));
			
		},

		send_media_message(data_type, file_path, extra = {}) {
			
				if (!this.assert_can_compose({ skip_connect: true })) {
					return;
				}
				const tool_key = (data_type == 'audio' && parseInt(extra.voice || 0) == 1) ? 'voice' : data_type;
				if (['images', 'video', 'audio', 'voice', 'file'].indexOf(tool_key) >= 0 && !chat_can_use_tool(tool_key)) {
					showToast('后台未开启该功能');
					return;
				}
				if (isEmpty(file_path)) {
					return;
				}
				this.panel_type = '';
			
				const quote = this.build_quote_payload();
				const duration_text = extra.duration != null && extra.duration !== ''
					? this.format_duration_text(extra.duration)
					: '';
				const duration_sec = extra.duration != null && extra.duration !== ''
					? Math.max(0, Math.floor(Number(extra.duration) || 0))
					: 0;
				const is_voice = parseInt(extra.voice || 0) == 1;
				const file_name = is_voice ? '' : (extra.file_name || this.file_name_from_path(file_path));
				const is_file_like = data_type == 'file' || data_type == 'audio';
				const send_payload = is_file_like
					? { data_type, url: '', content: file_name, name: file_name, quote }
					: { data_type, url: '', content: '', quote };
				if (is_voice) {
					send_payload.voice = 1;
					send_payload.name = '';
					send_payload.content = '';
					if (duration_sec > 0) {
						send_payload.duration = duration_sec;
					}
				}
				const poster_raw = extra.poster || '';
				const poster = poster_raw ? this.to_poster_src(poster_raw) : '';
				const local_url = (data_type == 'images' || data_type == 'video') ? (extra.absolute_path || file_path || '') : '';
				const chunk_key = chat_upload_make_chunk_key('up');
				const placeholder = this.append_local_message(
					send_payload,
					true,
					{
						upload_status: 'uploading',
						upload_progress: 1,
						media_ready: data_type == 'images' || data_type == 'video' ? false : true,
						poster,
						duration_text,
						duration_sec,
						local_url,
						file_path,
						send_status: 'sending',
						send_payload,
						is_voice: is_voice ? 1 : 0,
						upload_chunk_key: chunk_key,
					}
				);
				this.quote_draft = null;
				const row_key = placeholder.key;
				upload_progress_last[row_key] = 1;
				this.start_fake_progress(row_key);
				const pick_file_size = parseInt(extra.file_size || 0) || 0;
				if (pick_file_size > 0) {
					this.start_fake_progress(row_key, { file_size: pick_file_size });
				}
				uni.getFileInfo({
					filePath: file_path,
					success: (res) => {
						if (this.page_alive && res && res.size > 0) {
							this.start_fake_progress(row_key, { file_size: res.size });
						}
					},
				});
				this.scroll_to_bottom();
			
				void (async () => {
					chat_resume_connect();
					this.sync_connect_ui();
					this.upload_and_send_media_row(row_key, file_path, {
						data_type,
						quote,
						file_name: extra.file_name || file_name || this.file_name_from_path(file_path, data_type == 'video' ? 'video.mp4' : (data_type == 'images' ? 'image.jpg' : 'file.bin')),
						voice: is_voice ? 1 : 0,
						duration: duration_sec,
						poster,
						poster_raw,
						chunk_key,
						file_size: parseInt(extra.file_size || 0) || 0,
					});
				})();
			
		},

		pick_image_event() {
			
				if (!this.assert_can_compose({ skip_connect: this.has_uploading_media || this.is_resume_hold }) || !chat_can_use_tool('images')) {
					return;
				}
				this.begin_file_pick();
				// #ifdef MP-WEIXIN
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.end_file_pick();
						const path = (res.tempFilePaths && res.tempFilePaths[0]) || '';
						this.send_media_message('images', path);
					},
					fail: () => {
						this.end_file_pick();
					},
				});
				return;
				// #endif
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.end_file_pick();
						const path = (res.tempFilePaths && res.tempFilePaths[0]) || '';
						this.send_media_message('images', path);
					},
					fail: () => {
						this.end_file_pick();
					},
				});
			
		},

		pick_video_album_event() {
			
				if (!this.assert_can_compose({ skip_connect: this.has_uploading_media || this.is_resume_hold }) || !chat_can_use_tool('video')) {
					return;
				}
				ensure_chat_media_auth_before_pick();
				const send_video_file = (path, name, extra = {}) => {
					if (isEmpty(path)) {
						return;
					}
					const file_name = name || this.file_name_from_path(path);
					if (this.chat_file_ext(file_name) !== '' && CHAT_VIDEO_ALLOW_EXT.indexOf(this.chat_file_ext(file_name)) < 0) {
						showToast('暂仅支持 MP4 视频');
						return;
					}
					this.send_media_message('video', path, extra);
				};
				const from_choose_video = (res) => {
					const file = (res.tempFiles && res.tempFiles[0]) || {};
					const temp_path = res.tempFilePath || file.tempFilePath || file.path || '';
					const file_size = parseInt(file.size || file.fileSize || res.size || 0) || 0;
					send_video_file(temp_path, temp_path, {
						duration: res.duration != null ? res.duration : file.duration,
						poster: res.thumbTempFilePath || res.thumb || file.thumbTempFilePath || file.thumb || '',
						absolute_path: this.to_absolute_local_path(temp_path),
						file_size,
					});
				};
				this.begin_file_pick();
				const finish_pick = (res) => {
					this.end_file_pick();
					if (res) {
						from_choose_video(res);
					}
				};
				const cancel_pick = () => {
					this.end_file_pick();
				};
				// #ifdef H5
				if (typeof uni.chooseFile == 'function') {
					uni.chooseFile({
						count: 1,
						type: 'video',
						extension: this.chat_choose_extension(CHAT_VIDEO_ALLOW_EXT),
						success: (res) => {
							this.end_file_pick();
							const file = (res.tempFiles && res.tempFiles[0]) || {};
							const path = (res.tempFilePaths && res.tempFilePaths[0]) || file.path || file.tempFilePath;
							send_video_file(path, file.name, {
								duration: file.duration,
								poster: file.thumbTempFilePath || '',
							});
						},
						fail: cancel_pick,
					});
					return;
				}
				// #endif
				// #ifdef MP-WEIXIN
				if (typeof uni.chooseMedia == 'function') {
					uni.chooseMedia({
						count: 1,
						mediaType: ['video'],
						sourceType: ['album', 'camera'],
						maxDuration: 60,
						sizeType: ['original'],
						success: finish_pick,
						fail: cancel_pick,
					});
					return;
				}
				uni.chooseVideo({
					sourceType: ['album', 'camera'],
					maxDuration: 60,
					compressed: false,
					success: finish_pick,
					fail: cancel_pick,
				});
				return;
				// #endif
				// #ifdef APP-PLUS
				uni.chooseVideo({
					sourceType: ['album', 'camera'],
					maxDuration: 60,
					compressed: false,
					success: finish_pick,
					fail: cancel_pick,
				});
				return;
				// #endif
				uni.chooseVideo({
					sourceType: ['album', 'camera'],
					maxDuration: 60,
					compressed: false,
					success: finish_pick,
					fail: cancel_pick,
				});
			
		},

		file_name_from_path(path, fallback = '附件') {
			
				const raw = String(path || '');
				const name = raw.split('/').pop().split('\\').pop() || '';
				try {
					return decodeURIComponent(name) || fallback;
				} catch (e) {
					return name || fallback;
				}
			
		},

		chat_normalize_upload_type(name, type = 'file') {
			
				const n = String(name || '').toLowerCase();
				const m = n.match(/\.([a-z0-9]+)$/);
				const ext = m ? m[1] : '';
				if (['jpg', 'jpeg', 'png', 'gif', 'webp'].indexOf(ext) >= 0) {
					return 'images';
				}
				if (CHAT_VIDEO_ALLOW_EXT.indexOf(ext) >= 0) {
					return 'video';
				}
				if (CHAT_AUDIO_ALLOW_EXT.indexOf(ext) >= 0) {
					return 'audio';
				}
				return type || 'file';
			
		},

		chat_file_ext(name) {
			
				const n = String(name || '').toLowerCase();
				const m = n.match(/\.([a-z0-9]+)$/);
				return m ? m[1] : '';
			
		},

		send_picked_file(path, name) {
			
				if (isEmpty(path)) {
					return;
				}
				const file_name = name || this.file_name_from_path(path);
				const ext = this.chat_file_ext(file_name) || this.chat_file_ext(path);
				if (CHAT_FILE_ALLOW_EXT.indexOf(ext) < 0) {
					showToast('暂不支持该附件格式（pdf/doc/xls/ppt/txt/zip 等）');
					return;
				}
				this.send_media_message('file', path, { file_name });
			
		},

		arm_resume_hold() {
			
				this.is_resume_hold = true;
				if (resume_hold_expire_timer) {
					clearTimeout(resume_hold_expire_timer);
				}
				resume_hold_expire_timer = setTimeout(() => {
					resume_hold_expire_timer = null;
					this.is_resume_hold = false;
					this.sync_connect_ui();
				}, 20000);
			
		},

		begin_file_pick() {
			
				file_pick_hold = true;
				this.arm_resume_hold();
			
		},

		resume_after_native_pick() {
			
				if (resume_hold_timer) {
					clearTimeout(resume_hold_timer);
				}
				resume_hold_timer = setTimeout(() => {
					resume_hold_timer = null;
					if (!this.page_alive) {
						return;
					}
					chat_resume_connect();
					this.sync_connect_ui();
				}, 800);
			
		},

		end_file_pick() {
			
				file_pick_hold = false;
				this.arm_resume_hold();
				if (this.page_alive) {
					this.bind_keyboard();
					this.resume_after_native_pick();
					this.ensure_uploading_progress_and_resume();
				}
			
		},

		pick_file_event() {
			
				if (!this.assert_can_compose() || !chat_can_use_tool('file')) {
					return;
				}
				this.begin_file_pick();
				pick_chat_local_file({
					kind: 'file',
					extensions: CHAT_FILE_ALLOW_EXT,
					success: (res) => {
						this.end_file_pick();
						this.send_picked_file(res.path, res.name);
					},
					fail: (err) => {
						this.end_file_pick();
						const msg = String((err && err.errMsg) || '');
						if (msg.indexOf('type') >= 0) {
							showToast('暂不支持该附件格式（pdf/doc/xls/ppt/txt/zip 等）');
							return;
						}
						if (msg.indexOf('无法打开文件管理器') >= 0) {
							showToast('无法打开文件管理器');
							return;
						}
						showToast('附件读取失败，请重试');
					},
				});
			
		},

		pick_audio_event() {
			
				if (!this.assert_can_compose() || !chat_can_use_tool('audio')) {
					return;
				}
				ensure_chat_media_auth_before_pick();
				const send_audio_file = (path, name) => {
					if (isEmpty(path)) {
						return;
					}
					const file_name = name || this.file_name_from_path(path, 'audio.mp3');
					if (CHAT_AUDIO_ALLOW_EXT.indexOf(this.chat_file_ext(file_name)) < 0 && CHAT_AUDIO_ALLOW_EXT.indexOf(this.chat_file_ext(path)) < 0) {
						showToast('暂仅支持 MP3 音频');
						return;
					}
					this.send_media_message('audio', path, { file_name });
				};
				this.begin_file_pick();
				pick_chat_local_file({
					kind: 'audio',
					extensions: CHAT_AUDIO_ALLOW_EXT,
					success: (res) => {
						this.end_file_pick();
						send_audio_file(res.path, res.name);
					},
					fail: (err) => {
						this.end_file_pick();
						const msg = String((err && err.errMsg) || '');
						if (msg.indexOf('type') >= 0) {
							showToast('暂仅支持 MP3 音频');
							return;
						}
						if (msg.indexOf('无法打开文件管理器') >= 0) {
							showToast('无法打开文件管理器');
							return;
						}
						showToast('附件读取失败，请重试');
					},
				});
			
		},

		preview_image_event(e) {
			
				if (String(e?.currentTarget?.dataset?.ready || '1') == '0') {
					return;
				}
				const url = e?.currentTarget?.dataset?.url || '';
				if (isEmpty(url)) {
					return;
				}
				uni.previewImage({ urls: [url], current: url });
			
		},

		play_fs_video() {
			
				if (isEmpty(this.playing_video_url)) {
					return;
				}
				try {
					const popup = this.$refs.chat_video_popup_ref;
					if (popup && typeof popup.play_video === 'function') {
						popup.play_video();
						return;
					}
					const ctx = uni.createVideoContext('chat-fs-video', this);
					if (ctx && typeof ctx.play == 'function') {
						ctx.play();
					}
				} catch (e) {}
			
		},

		stop_fs_video() {
			
				try {
					const popup = this.$refs.chat_video_popup_ref;
					if (popup && typeof popup.stop_video === 'function') {
						popup.stop_video();
						return;
					}
					const ctx = uni.createVideoContext('chat-fs-video', this);
					if (ctx) {
						if (typeof ctx.pause == 'function') {
							ctx.pause();
						}
						if (typeof ctx.stop == 'function') {
							ctx.stop();
						}
					}
				} catch (e) {}
			
		},

		clear_fs_video_loading_timer() {
			
				if (fs_video_loading_timer) {
					clearTimeout(fs_video_loading_timer);
					fs_video_loading_timer = null;
				}
			
		},

		hide_fs_video_loading() {
			
				this.clear_fs_video_loading_timer();
				this.playing_video_loading = false;
			
		},

		on_fs_video_play() {
			
				this.hide_fs_video_loading();
			
		},

		on_fs_video_timeupdate(e) {
			
				if (!this.playing_video_loading) {
					return;
				}
				const t = Number(e?.detail?.currentTime || 0);
				if (t > 0) {
					this.hide_fs_video_loading();
				}
			
		},

		on_fs_video_error() {
			
				this.hide_fs_video_loading();
				showToast('播放失败');
			
		},

		open_video_player_event(e) {
			
				const ds = e?.currentTarget?.dataset || {};
				const remote_url = this.to_media_src(ds.url || '');
				const local_url = this.to_media_src(ds.local || '');
				const poster = this.to_media_src(ds.poster || '');
				const play_url = remote_url || local_url;
				if (isEmpty(play_url)) {
					showToast('视频无效');
					return;
				}
				this.clear_fs_video_loading_timer();
				this.playing_video_poster = poster;
				this.playing_video_loading = true;
				this.playing_video_url = play_url;
				const wait_ms = /^(https?:)/i.test(play_url) ? 15000 : 6000;
				fs_video_loading_timer = setTimeout(() => {
					if (!this.playing_video_loading) {
						return;
					}
					this.playing_video_loading = false;
					showToast('视频加载失败');
				}, wait_ms);
				this.$nextTick(() => {
					this.play_fs_video();
				});
			
		},

		close_playing_video() {
			
				this.stop_fs_video();
				this.clear_fs_video_loading_timer();
				this.playing_video_url = '';
				this.playing_video_poster = '';
				this.playing_video_loading = false;
				this.$nextTick(() => {
					this.run_video_poster_queue();
				});
			
		},

		audio_bubble_style(item) {
			
				const sec = Number(item && item.duration_sec) || 0;
				if (!(sec > 0)) {
					return {};
				}
				const w = Math.min(280, Math.max(96, 96 + sec * 6));
				return { width: w + 'rpx' };
			
		},

		toggle_audio_play_event(e) {
			
				const idx = Number(e?.currentTarget?.dataset?.index);
				const item = Number.isNaN(idx) ? null : this.message_list[idx];
				if (!item) {
					return;
				}
				const url = item.url || item.file?.url || item.file_path || item.local_url || '';
				if (isEmpty(url)) {
					showToast('音频无效');
					return;
				}
				if (this.playing_audio_key == item.key) {
					this.stop_audio_play();
					return;
				}
				this.stop_audio_play();
				if (typeof uni.createInnerAudioContext != 'function') {
					showToast('当前环境暂不支持播放音频');
					return;
				}
				audio_ctx = uni.createInnerAudioContext();
				audio_ctx.autoplay = true;
				audio_ctx.src = url;
				this.playing_audio_key = item.key;
				// 对齐 PC ChatVoiceMarkPlayed：对方语音点播放后发 played:1
				if (!item.is_self && parseInt(item.is_voice || 0) == 1 && parseInt(item.voice_played || 0) != 1) {
					const rid = Number(item.record_id || 0);
					if (rid > 0) {
						chat_voice_mark_played(rid);
						this.patch_local_message(item.key, { voice_played: 1 });
					}
				}
				audio_ctx.onEnded(() => {
					this.stop_audio_play();
				});
				audio_ctx.onStop(() => {
					this.playing_audio_key = '';
				});
				audio_ctx.onError(() => {
					this.stop_audio_play();
					showToast('播放失败');
				});
			
		},

		open_file_link_event(e) {
			
				const url = e?.currentTarget?.dataset?.url || '';
				this.open_external_url(url);
			
		},

		open_external_url(url) {
			
				const value = String(url || '').trim();
				if (isEmpty(value)) {
					return;
				}
				if (!/^https?:\/\//i.test(value)) {
					uni.setClipboardData({
						data: value,
						success: () => showToast('链接已复制'),
					});
					return;
				}
				// #ifdef H5
				window.open(value);
				return;
				// #endif
				// #ifndef H5
				open_web_view(value);
				// #endif
			
		},

		open_msg_link_event(e) {
			
				const url = e?.currentTarget?.dataset?.url || '';
				if (isEmpty(url)) {
					return;
				}
				const is_http = /^https?:\/\//i.test(url);
				if (is_http) {
					this.open_external_url(url);
					return;
				}
				// pages/ 路径：复制便于排查（管理端未必有对应商城页）
				uni.setClipboardData({
					data: url,
					success: () => showToast('链接已复制'),
				});
			
		},

		clear_quote_event() {
			
				this.quote_draft = null;
			
		},

		close_msg_menu_event() {
			
				this.msg_menu = {
					show: false,
					index: -1,
					is_self: false,
					can_recall: false,
					placement: 'top',
					time_text: '',
					top: 0,
					left: 0,
				};
			
		},

		get_msg_copy_text(item) {
			
				if (!item) {
					return '';
				}
				if (item.data_type == 'text' || item.data_type == 'ai_summary' || item.data_type == 'login_required') {
					return String(item.text || '');
				}
				if (item.data_type == 'images' || item.data_type == 'video') {
					return String(item.url || item.local_url || '');
				}
				if (item.data_type == 'goods') {
					const title = item.goods?.title || item.text || '';
					const price = item.goods?.price != null && item.goods?.price !== '' ? (' ¥' + item.goods.price) : '';
					return String(title + price).trim();
				}
				return String(item.text || item.url || '');
			
		},

		quote_truncate(s) {
			
				const text = String(s || '').replace(/\s+/g, ' ').trim();
				if (text.length > 80) {
					return text.slice(0, 80) + '…';
				}
				return text;
			
		},

		can_quote_item(item) {
			
				if (!item || item.is_pure || item.is_mode_tip || item.is_system || item.is_thinking) {
					return false;
				}
				const dt = item.data_type || '';
				if (dt == 'system' || dt == 'mode_tip' || dt == 'recall' || dt == 'visitor_notice') {
					return false;
				}
				// 对齐 PC：agent_notice 仅 AI 摘要可引用
				if (dt == 'agent_notice') {
					return false;
				}
				if (dt == 'images' || dt == 'video' || dt == 'audio' || dt == 'file') {
					return !!(item.url || '');
				}
				if (dt == 'goods' || dt == 'order' || dt == 'aftersale') {
					return true;
				}
				if (dt == 'ai_summary' || dt == 'login_required') {
					return String(item.text || '').trim() !== '';
				}
				return String(item.text || '').trim() !== '';
			
		},

		apply_quote_from_item(item) {
			
				if (!this.can_quote_item(item)) {
					showToast('该消息无法引用');
					return false;
				}
				const dt = item.data_type || 'text';
				const sender = item.name || (item.is_self ? '客服' : (this.chat_title || '用户'));
				const raw = {
					record_id: item.record_id || 0,
					send_name: sender,
					name: sender,
					data_type: dt,
					content: '',
					url: item.url || '',
				};
				if (dt == 'images') {
					raw.content = '[图片]';
				} else if (dt == 'video') {
					raw.content = '[视频]';
				} else if (dt == 'audio') {
					if (parseInt(item.is_voice || 0) == 1) {
						const vd = parseInt(item.duration_sec || item.duration || 0) || 0;
						raw.voice = 1;
						raw.duration = vd;
						raw.content = this.quote_truncate(vd > 0 ? ('[语音] ' + vd + '"') : '[语音]');
					} else {
						raw.name = item.file?.name || '';
						raw.content = this.quote_truncate('[音频] ' + (raw.name || 'MP3'));
					}
				} else if (dt == 'file') {
					raw.name = item.file?.name || '';
					raw.content = this.quote_truncate('[文件] ' + (raw.name || '附件'));
				} else if (dt == 'goods') {
					raw.content = this.quote_truncate('[商品] ' + (item.goods?.title || ''));
				} else if (dt == 'order') {
					raw.content = this.quote_truncate('[订单] ' + (item.order?.order_no || ''));
				} else if (dt == 'aftersale') {
					raw.content = this.quote_truncate('[售后] ' + (item.aftersale?.order_no || ''));
				} else {
					raw.content = this.quote_truncate(item.text || '');
				}
				const quote = normalize_quote(raw);
				if (!quote || is_quote_recalled(quote)) {
					showToast('该消息无法引用');
					return false;
				}
				this.quote_draft = quote;
				this.panel_type = '';
				this.input_focus = true;
				return true;
			
		},

		msg_menu_copy_event() {
			
				const item = this.message_list[this.msg_menu.index];
				this.close_msg_menu_event();
				const text = this.get_msg_copy_text(item);
				if (isEmpty(text)) {
					showToast('暂无可复制内容');
					return;
				}
				uni.setClipboardData({
					data: text,
					success: () => showToast('已复制'),
				});
			
		},

		msg_menu_quote_event() {
			
				const item = this.message_list[this.msg_menu.index];
				this.close_msg_menu_event();
				this.apply_quote_from_item(item);
			
		},

		fill_recall_to_input(text) {
			
				const value = String(text || '').trim();
				if (value === '' || this.input_locked) {
					return;
				}
				this.is_voice_input = false;
				this.panel_type = '';
				this.input_focus = false;
				this.input_text = value;
				this.input_view_key += 1;
				this.$nextTick(() => {
					this.input_focus = true;
					if (get_chat_state().connect_status === 1) {
						chat_send_input_status(value);
					}
				});
			
		},

		msg_menu_recall_event() {
			
				const item = this.message_list[this.msg_menu.index];
				this.close_msg_menu_event();
				if (!item || !item.is_self) {
					return;
				}
				if (!chat_can_recall()) {
					showToast('未开启消息撤回');
					return;
				}
				const rid = Number(item.record_id || 0);
				if (!(rid > 0)) {
					showToast('消息尚未同步，请稍后再试');
					return;
				}
				const limit = chat_recall_seconds();
				if (!chat_recall_still_valid(item.add_time)) {
					showToast('超过' + limit + '秒不可撤回');
					return;
				}
				uni.showModal({
					title: '温馨提示',
					content: '撤回这条消息、确认撤回吗？',
					confirmText: '撤回',
					success: (res) => {
						if (res.confirm) {
							const edit_text = this.pick_recall_edit_text(item);
							this.apply_message_recalled(rid, {
								data_type: 'recall',
								content: '你撤回了一条信息',
								recall_text: edit_text,
							}, {
								is_self: true,
								recall_text: edit_text,
								recall_at: Date.now(),
							});
							this.mark_quotes_recalled(rid);
							chat_recall_message(rid);
						}
					},
				});
			
		},

		reedit_recall_event(e) {
			
				const idx = Number(e?.currentTarget?.dataset?.index);
				const item = this.message_list[idx];
				if (!this.show_recall_reedit(item)) {
					return;
				}
				const text = this.pick_recall_edit_text(item);
				if (text === '') {
					return;
				}
				this.fill_recall_to_input(text);
			
		},

		open_quote_sheet(index) {
			
				if (Number.isNaN(index) || index < 0) {
					return;
				}
				const item = this.message_list[index];
				if (!item || item.is_pure || item.is_mode_tip || item.is_system || item.is_thinking) {
					return;
				}
				this.panel_type = '';
				this.input_focus = false;
				const time_text = this.format_msg_detail_time(item.add_time) || String(item.time_text || '').trim() || '时间未知';
				const can_recall = this.can_recall_item(item);
				const place_menu = (rect) => {
					const sys = uni.getSystemInfoSync() || {};
					const win_w = Number(sys.windowWidth || 375);
					const win_h = Number(sys.windowHeight || 667);
					const menu_w = typeof uni.upx2px == 'function' ? uni.upx2px(can_recall ? 420 : 360) : (can_recall ? 210 : 180);
					const menu_h = typeof uni.upx2px == 'function' ? uni.upx2px(236) : 118;
					const gap = 8;
					const min_left = 12 + menu_w / 2;
					const max_left = win_w - 12 - menu_w / 2;
					const safe_top = (this.status_bar_height || 0) + (typeof uni.upx2px == 'function' ? uni.upx2px(88) : 44) + 8;
					const safe_bottom = win_h - Math.max(Number(this.keyboard_height || 0), 0) - 16;
					let left = win_w / 2;
					let top = win_h * 0.35;
					let placement = 'top';
					if (rect && rect.width > 0) {
						left = rect.left + rect.width / 2;
						const space_above = rect.top - safe_top;
						const space_below = safe_bottom - rect.bottom;
						// 优先上方；上方放不下时改到下方（向上箭头）
						if (space_above >= menu_h + gap) {
							placement = 'top';
							top = rect.top;
						} else if (space_below >= menu_h + gap) {
							placement = 'bottom';
							top = rect.bottom;
						} else if (space_above >= space_below) {
							placement = 'top';
							top = rect.top;
						} else {
							placement = 'bottom';
							top = rect.bottom;
						}
					}
					if (left < min_left) {
						left = min_left;
					}
					if (left > max_left) {
						left = max_left;
					}
					this.msg_menu = {
						show: true,
						index,
						is_self: !!item.is_self,
						can_recall,
						placement,
						time_text,
						top,
						left,
					};
				};
				this.$nextTick(() => {
					try {
						// Vue3 + 小程序：优先 proxy，兼容部分端仅认 instance
						const scope = this;
						const query = scope
							? uni.createSelectorQuery().in(scope)
							: uni.createSelectorQuery();
						query
							.select('#msg-bubble-' + index)
							.boundingClientRect()
							.exec((res) => {
								const rect = Array.isArray(res) ? res[0] : res;
								if (rect && rect.width > 0) {
									place_menu(rect);
									return;
								}
								// 气泡节点未取到时回退整行
								const fallback = scope
									? uni.createSelectorQuery().in(scope)
									: uni.createSelectorQuery();
								fallback
									.select('#' + this.msg_dom_id(item, index))
									.boundingClientRect()
									.exec((res2) => {
										place_menu(Array.isArray(res2) ? res2[0] : res2);
									});
							});
					} catch (e) {
						place_menu(null);
					}
				});
			
		},

		on_msg_item_action(payload) {
			const type = payload && payload.type;
			if (!type) {
				return;
			}
			const event = payload.event;
			const data = payload.data;
			switch (type) {
				case 'reedit':
					return this.reedit_recall_event(event);
				case 'resend':
					return this.resend_failed_message(event);
				case 'imageLoad':
					return this.on_send_image_load(data);
				case 'imageError':
					return this.on_send_image_error(data);
				case 'previewImage':
					return this.preview_image_event(event);
				case 'videoPosterError':
					return this.on_video_poster_error(event);
				case 'openVideo':
					return this.open_video_player_event(event);
				case 'openGoods':
					return this.open_goods_card_event(event);
				case 'toggleAudio':
					return this.toggle_audio_play_event(event);
				case 'quote':
					return this.quote_message_event(event);
				case 'pressStart':
					return this.on_msg_press_start(event);
				case 'pressMove':
					return this.on_msg_press_move(event);
				case 'pressEnd':
					return this.on_msg_press_end(event);
				case 'mouseDown':
					return this.on_msg_mouse_down(event);
				case 'contextmenu':
					return this.on_msg_contextmenu(event);
				case 'openFile':
					return this.open_file_link_event(event);
				case 'openLink':
					return this.open_msg_link_event(event);
				case 'quoteBlockTap':
					return this.quote_block_tap_event(data);
				default:
					return;
			}
		},

		quote_message_event(e) {
			
				// App / 小程序走原生 longpress；H5 由下方 touch/mouse 模拟，避免重复弹出
				// #ifdef H5
				return;
				// #endif
				this.open_quote_sheet(Number(e?.currentTarget?.dataset?.index));
			
		},

		clear_msg_press_timer() {
			
				if (msg_press_timer) {
					clearTimeout(msg_press_timer);
					msg_press_timer = null;
				}
			
		},

		on_msg_press_start(e) {
			
				// #ifndef H5
				return;
				// #endif
				this.clear_msg_press_timer();
				msg_press_index = Number(e?.currentTarget?.dataset?.index);
				const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || null;
				msg_press_x = touch ? touch.clientX : 0;
				msg_press_y = touch ? touch.clientY : 0;
				msg_press_timer = setTimeout(() => {
					msg_press_timer = null;
					this.open_quote_sheet(msg_press_index);
				}, MSG_PRESS_MS);
			
		},

		on_msg_press_move(e) {
			
				// #ifndef H5
				return;
				// #endif
				if (!msg_press_timer) {
					return;
				}
				const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || null;
				if (!touch) {
					return;
				}
				const dx = Math.abs(touch.clientX - msg_press_x);
				const dy = Math.abs(touch.clientY - msg_press_y);
				if (dx > MSG_MOVE_PX || dy > MSG_MOVE_PX) {
					this.clear_msg_press_timer();
				}
			
		},

		on_msg_press_end() {
			
				// #ifndef H5
				return;
				// #endif
				this.clear_msg_press_timer();
			
		},

		on_msg_mouse_down(e) {
			
				// #ifndef H5
				return;
				// #endif
				// 仅左键
				if (e && e.button != null && e.button !== 0) {
					return;
				}
				this.clear_msg_press_timer();
				msg_press_index = Number(e?.currentTarget?.dataset?.index);
				msg_press_x = e?.clientX || 0;
				msg_press_y = e?.clientY || 0;
				msg_press_timer = setTimeout(() => {
					msg_press_timer = null;
					this.open_quote_sheet(msg_press_index);
				}, MSG_PRESS_MS);
			
		},

		on_msg_contextmenu(e) {
			
				// #ifndef H5
				return;
				// #endif
				if (e && typeof e.preventDefault == 'function') {
					e.preventDefault();
				}
				this.clear_msg_press_timer();
				this.open_quote_sheet(Number(e?.currentTarget?.dataset?.index));
			
		},

		build_quote_payload() {
			
				if (!this.quote_draft) {
					return null;
				}
				const q = this.quote_draft;
				if (is_quote_recalled(q)) {
					return null;
				}
				// 对齐 PC 发送字段：record_id / send_name / data_type / content / url；音频文件另带 name
				const payload = {
					record_id: Number(q.record_id || 0) || 0,
					send_name: String(q.send_name || q.name || ''),
					data_type: String(q.data_type || 'text'),
					content: String(q.content || ''),
				};
				if (q.url) {
					payload.url = String(q.url);
				}
				if ((payload.data_type == 'audio' || payload.data_type == 'file') && q.file_name) {
					payload.name = String(q.file_name);
				} else if ((payload.data_type == 'audio' || payload.data_type == 'file') && q.name && q.name != payload.send_name) {
					payload.name = String(q.name);
				}
				return payload;
			
		},

		assert_can_compose(opts = {}) {
			
				if (this.show_rating_modal || this.skip_auto_continue) {
					return false;
				}
				if (!opts.skip_connect && (this.connect_status !== 1 || this.online_status != 'online')) {
					if (this.connect_status !== 1) {
						showToast(this.is_connecting ? '正在连接...' : '未连接');
					} else {
						showToast(this.online_status == 'logout' ? '您已退出' : '您已离线');
					}
					return false;
				}
				return true;
			
		},

		wait_chat_online() {
			
				return new Promise((resolve) => {
					const is_online = () => get_chat_state().connect_status === 1 && get_chat_state().online_status == 'online';
					if (is_online()) {
						resolve(true);
						return;
					}
					chat_resume_connect();
					const start = Date.now();
					const timer = setInterval(() => {
						if (!this.page_alive) {
							clearInterval(timer);
							resolve(false);
							return;
						}
						if (is_online()) {
							clearInterval(timer);
							this.connect_status = 1;
							this.online_status = 'online';
							this.is_connecting = false;
							resolve(true);
							return;
						}
						if (Date.now() - start >= 20000) {
							clearInterval(timer);
							resolve(false);
						}
					}, 250);
				});
			
		},

		schedule_mark_send_ok(key) {
			
				setTimeout(() => {
					if (!this.page_alive) {
						return;
					}
					const cur = this.message_list.find((item) => item.key === key);
					if (cur && cur.send_status == 'sending') {
						this.mark_send_ok(key);
					}
				}, 480);
			
		},

		on_chat_pending_send_fail() {
			
				if (!this.page_alive) {
					return;
				}
				clear_suppress_ended_choice();
				pending_session_revive = false;
				this.message_list.forEach((row) => {
					if (row && row.is_self && row.send_status == 'sending' && row.upload_status != 'uploading') {
						this.mark_send_fail(row.key);
					}
				});
			
		},

		on_chat_pending_send_flush() {
			
				if (!this.page_alive) {
					return;
				}
				pending_session_revive = false;
				mark_session_page_engaged();
				this.message_list.forEach((row) => {
					if (row && row.is_self && row.send_status == 'sending' && row.upload_status != 'uploading') {
						this.schedule_mark_send_ok(row.key);
					}
				});
			
		},

		send_event() {
			
				if (!this.assert_can_compose()) {
					return;
				}
				const content = String(this.input_text || '').trim();
				if (isEmpty(content)) {
					return;
				}
				const payload = { data_type: 'text', content };
				const quote = this.build_quote_payload();
				if (quote) {
					payload.quote = quote;
				}
			
				const after_send = () => {
					this.input_text = '';
					this.input_line_count = 1;
					this.is_input_fullscreen = false;
					this.panel_type = '';
					this.quote_draft = null;
					// 对齐 PC：发送后推空串，清除对方「正在输入」
					chat_send_input_status('');
				};
			
				const row = this.append_local_message(payload, true, {
					send_status: 'sending',
					send_payload: payload,
				});
				after_send();
			
				const ok = chat_send_message(payload);
				if (ok === 'queued') {
					mark_send_revive_queued();
				}
				if (!ok) {
					this.mark_send_fail(row.key);
					return;
				}
				if (ok !== 'queued') {
					mark_session_page_engaged();
					this.schedule_mark_send_ok(row.key);
				}
			
		},

		on_keyboard_height_change(res) {
			
				if (!this.page_alive) {
					return;
				}
				const height = Number(res?.height || 0);
				if (this.is_input_fullscreen) {
					this.keyboard_height = 0;
					return;
				}
				// 仅用键盘高度顶起整页，避免与系统 resize 叠加出现灰带
				this.keyboard_height = height > 0 ? height : 0;
				if (height > 0) {
					this.panel_type = '';
					this.scroll_to_bottom();
				}
			
		},

		bind_keyboard() {
			
				if (keyboard_bound || typeof uni.onKeyboardHeightChange != 'function') {
					return;
				}
				uni.onKeyboardHeightChange(this._bound_keyboard_height_change);
				keyboard_bound = true;
			
		},

		unbind_keyboard() {
			
				if (keyboard_bound && typeof uni.offKeyboardHeightChange == 'function') {
					try {
						uni.offKeyboardHeightChange(this._bound_keyboard_height_change);
					} catch (e) {}
				}
				keyboard_bound = false;
				if (this.page_alive) {
					this.keyboard_height = 0;
				}
			
		},

		now_unix_sec() {
			return Math.floor(Date.now() / 1000);
		},

		to_poster_src(path) {
			return this.to_media_src(path);
		},

		is_ios_app() {
			return String((uni.getSystemInfoSync() || {}).platform || '').toLowerCase() == 'ios';
		},

		chat_choose_extension(list) {
			return (list || []).map((ext) => '.' + ext);
		},

		chat_page_on_load(params) {
			this.page_alive = true;
				const entry = { ...(params || {}) };
				if (isEmpty(entry.source)) {
					try {
						const app = getApp();
						const route = app && app.globalData && typeof app.globalData.current_page == 'function'
							? app.globalData.current_page()
							: '';
						if (!isEmpty(route)) {
							entry.source = base64.encode(route).replace(/=/g, '');
						}
					} catch (e) {}
				}
				chat_apply_entry_params(entry);
				this.route_chat_id = String(params.id || params.chat_id || '');
				// 对齐 admin-app：进页先同步解析 receive_user
				this.resolve_route_receive_user();
				this.skip_auto_continue = false;
				ended_choice_handled = false;
				ended_choice_showing = false;
				record_init_done = false;
				allow_ended_prompt = false;
				session_page_engaged = false;
				pending_session_revive = false;
				page_visible = true;
				ended_while_page_hidden = false;
				clear_suppress_ended_choice();
				clear_allow_ended_prompt_timer();
				this.show_ended_choice_modal = false;
				this.list_ready = false;
				history_edge_armed = false;
				this.clear_scroll_layout_timers();
				if (list_ready_fallback_timer) {
					clearTimeout(list_ready_fallback_timer);
				}
				list_ready_fallback_timer = setTimeout(() => {
					list_ready_fallback_timer = null;
					if (this.page_alive && !this.list_ready) {
						this.scroll_to_bottom_after_layout(true);
					}
				}, 1500);
				this.init_nav_metrics(true);
				bind_chat_push();
				request_chat_push_auth();
				this.measure_chrome();
				apply_chat_user_page_config();
				this.chat_title = '在线客服';
				try {
					uni.setNavigationBarTitle({ title: this.chat_title });
				} catch (e) {}
				this.message_list = [];
				this.can_end_session = chat_can_end();
				this.sync_tool_flags();
				this.sync_ai_state();
			
				this.bind_events();
				this.bind_keyboard();
				uni.$on('chat_resend_now', this._bound_chat_resend_now);
				this.restore_failed_messages();
				const before = get_chat_state();
				this.connect_status = before.connect_status || 0;
				this.online_status = before.online_status || 'off';
				this.is_connecting = !!before.is_connecting;
				this.page_user_inited = false;
				ensure_chat_user_init({ silentError: true }).then((ret) => {
					if (!this.page_alive) {
						return;
					}
					if (!ret.ok) {
						showToast(ret.msg || '咨询端初始化失败');
					}
					this.page_user_inited = true;
					this.sync_emoji_list();
					this.sync_tool_flags();
					apply_chat_user_page_config();
					if (before.connect_status === 1 && before.user_type == 'user') {
						chat_resume_connect();
					} else {
						chat_connect({ user_type: 'user' });
					}
					const linked = get_chat_state();
					this.connect_status = linked.connect_status || 0;
					this.online_status = linked.online_status || 'off';
					this.is_connecting = !!linked.is_connecting;
					// 对齐 admin-app：仅连接成功后再拉 record
					if (linked.connect_status === 1) {
						this.load_chat_record_if_connected();
					}
					this.sync_tool_flags();
				});
		},

		chat_page_on_show() {
			this.page_alive = true;
				page_visible = true;
				if (!(Number(this.nav_occupy_h || 0) > 0)) {
					this.init_nav_metrics(true);
					this.measure_chrome();
				}
				if (file_pick_hold) {
					this.arm_resume_hold();
					chat_resume_connect();
					this.sync_connect_ui();
					try {
						const app = getApp();
						if (app && app.globalData) {
							app.globalData.chat_viewing_id = String(this.chat_id || '');
						}
					} catch (e) {}
					if (ended_while_page_hidden) {
						this.resume_ended_session_after_return();
					}
					return;
				}
				chat_resume_connect();
				this.sync_connect_ui();
				this.bind_keyboard();
				try {
					const app = getApp();
					if (app && app.globalData) {
						app.globalData.chat_viewing_id = String(this.chat_id || '');
					}
				} catch (e) {}
				// 从详情改备注名返回后，同步标题（本地数据，不打接口）
				const chat_state = get_chat_state();
				const base = chat_get_friend_base();
				this.sync_friend_base(base);
				const title = (base?.friend?.name || chat_state.receive_user?.name || this.chat_title || '会话').trim();
				if (title) {
					this.chat_title = title;
					try {
						uni.setNavigationBarTitle({ title });
					} catch (e) {}
				}
				try {
					const clear_flag = uni.getStorageSync('cache_chat_clear_record_key');
					if (clear_flag && String(clear_flag.id || '') == String(this.chat_id || '')) {
						this.message_list = [];
						this.has_more = false;
						this.min_record_id = 0;
						uni.removeStorageSync('cache_chat_clear_record_key');
						this.append_init_message();
					}
				} catch (e) {}
				this.consume_resend_now();
				chat_resume_connect();
				this.sync_connect_ui();
				this.ensure_uploading_progress_and_resume();
				setTimeout(() => {
					request_chat_media_auth();
				}, 300);
				if (this.list_ready) {
					this.scroll_to_bottom();
				}
				this.sync_emoji_list();
				this.sync_tool_flags();
				// 离开期间会话超时结束：回页重连续聊，不弹「是否继续」
				if (ended_while_page_hidden) {
					this.resume_ended_session_after_return();
				}
		},

		chat_page_on_hide() {
			// 对齐 PC：进详情页不离开会话，保持 WS 监听，避免漏消息
				page_visible = false;
				// 离开时若结束询问已弹出：收起弹窗，回页改走重连续聊
				if (this.show_ended_choice_modal || ended_choice_showing) {
					this.show_ended_choice_modal = false;
					ended_choice_showing = false;
					if (this.session_ended && !ended_choice_handled) {
						ended_while_page_hidden = true;
					}
				}
				this.unbind_keyboard();
				this.close_msg_menu_event();
		},

		chat_page_on_unload() {
			this.page_alive = false;
				// 先掐断录音回调，避免 stop 异步 onStop 再改已销毁实例
				voice_handled = true;
				voice_pending_cancel = true;
				voice_want_record = false;
				voice_stopping = false;
				this.unbind_voice_doc_events();
				this.clear_voice_stop_timer();
				this.clear_voice_release_timer();
				this.clear_voice_cancel_leave_timer();
				try {
					if (recorder_mgr) {
						recorder_mgr.stop();
					}
				} catch (e) {}
				this.reset_voice_ui();
				this.skip_auto_continue = false;
				ended_choice_handled = false;
				ended_choice_showing = false;
				record_init_done = false;
				allow_ended_prompt = false;
				session_page_engaged = false;
				pending_session_revive = false;
				page_visible = false;
				ended_while_page_hidden = false;
				clear_suppress_ended_choice();
				clear_allow_ended_prompt_timer();
				try {
					this.show_ended_choice_modal = false;
					this.show_rating_modal = false;
				} catch (e) {}
				if (rating_submit_fallback_timer) {
					clearTimeout(rating_submit_fallback_timer);
					rating_submit_fallback_timer = null;
				}
				this.clear_scroll_layout_timers();
				if (list_ready_fallback_timer) {
					clearTimeout(list_ready_fallback_timer);
					list_ready_fallback_timer = null;
				}
				if (resume_hold_timer) {
					clearTimeout(resume_hold_timer);
					resume_hold_timer = null;
				}
				if (resume_hold_expire_timer) {
					clearTimeout(resume_hold_expire_timer);
					resume_hold_expire_timer = null;
				}
				this.is_resume_hold = false;
				this.unbind_keyboard();
				this.unbind_events();
				if (msg_search_timer) {
					clearTimeout(msg_search_timer);
					msg_search_timer = null;
				}
				try {
					this.msg_search_open = false;
				} catch (e) {}
				this.msg_search_clear_hits();
				if (input_status_timer) {
					clearTimeout(input_status_timer);
					input_status_timer = null;
				}
				this.clear_typing_tip();
				this.quote_draft = null;
				this.stop_fs_video();
				this.clear_fs_video_loading_timer();
				this.clear_video_poster_queue();
				// #ifdef APP-PLUS
				try {
					if (typeof releaseVideoFrame == 'function') {
						releaseVideoFrame();
					}
				} catch (e) {}
				// #endif
				try {
					this.playing_video_url = '';
					this.playing_video_poster = '';
					this.playing_video_loading = false;
				} catch (e) {}
				this.stop_audio_play();
				this.close_msg_menu_event();
				if (flash_record_timer) {
					clearTimeout(flash_record_timer);
					flash_record_timer = null;
				}
				try {
					this.flash_record_id = 0;
				} catch (e) {}
				this.stop_reedit_tick();
				this.clear_history_load();
				Object.keys(fake_progress_timers).forEach((key) => this.stop_fake_progress(key));
				this.clear_msg_press_timer();
				uni.$off('chat_resend_now', this._bound_chat_resend_now);
				try {
					const app = getApp();
					if (app && app.globalData) {
						app.globalData.chat_viewing_id = '';
					}
				} catch (e) {}
				// 对齐 PC：离开会话；保留 receive 缓存，刷新会话页可按 id 恢复拉记录
				chat_leave_session();
		},

		chat_page_on_ready() {
			this.measure_chrome();
		},

		chat_page_on_scroll(e) {
			if (this.msg_menu.show) {
					this.close_msg_menu_event();
				}
				if (this.msg_search_open) {
					return;
				}
				this.on_page_scroll_event(e);
		},

		isEmpty(value) {
			return isEmpty(value);
		},
	},
};
