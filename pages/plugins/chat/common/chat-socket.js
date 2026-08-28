/**
 * 客服 WebSocket（对齐 PC 端 plugins/chat）
 * 协议：原生 WebSocket + JSON，非 socket.io
 *
 * 迁移到其他项目（插件式）：
 * 1. 拷贝 common/js/chat_*.js、hooks/chat_*、pages/consult（咨询端）或 pages/customer-service（工作台）、相关 components
 * 2. 改本文件顶部 chat_default_config，或运行时 chat_set_config / chat_connect
 * 3. 商品点击：开启 goods_click_enable=1，优先用消息里的 goods_url；或传 on_goods_click 回调
 */
import {
	get_user_cache_info,
	get_config,
	request_uuid,
	refresh_request_uuid,
	get_application_client_type,
	isEmpty,
	showToast,
	url_open,
	open_web_view,
} from './chat-host.js';
import { notify_incoming_chat } from './chat-push-stub.js';
import $api from './chat-request.js';
import { CHAT_USER_API } from './chat-request.js';

const CACHE_RECEIVE_USER_KEY = 'cache_chat_receive_user_key';
const CACHE_FRIEND_BASE_KEY = 'cache_chat_friend_base_key';

/**
 * 模块内默认配置（迁移时只改这里）
 * - ws_host 为空则从 request_url 域名解析
 * - is_wss：https 站点必须为 1
 * - debug：true 时在控制台打印 success / record 关键字段，便于排查「无文本」
 */
export const chat_default_config = {
	request_url: 'https://new.shopxo.vip/',
	static_url: 'https://new.shopxo.vip/',
	ws_host: '',
	ws_port: 9502,
	is_wss: 1,
	ping: 30,
	/** 首次连接超时秒数（对齐 PC 约 30 次 × 1s） */
	connect_timeout: 30,
	system_type: 'default',
	/**
	 * 以下开关对齐 PC：JS 默认 0，由工作台初始化接口（等同 PC 页面 data-is-*）写入后再展示
	 * 切勿在 init 完成前用本地默认猜开关，否则会和 PC 不一致
	 */
	is_chat_queue: 0,
	is_offline_auto_reply: 0,
	is_quick_message: 0,
	/** 对齐 PC chat_features.is_chat_end：结束会话入口（socket 未带字段时用页面默认） */
	is_chat_end: 1,
	/** 对齐 PC chat_features.is_chat_rating：会话评价（socket 未带字段时用页面默认） */
	is_chat_rating: 1,
	/** 对齐 PC data-is-input-status：检测输入状态 */
	is_input_status: 1,
	/** 对齐 PC data-is-user-input-message：工作台展示对方正在输入的正文 */
	is_user_input_message: 1,
	/**
	 * 工具 / 会话内搜索：对齐 PC ChatPageOrFeatFlag（无页面/接口下发时默认关）
	 */
	is_chat_tool_emoji: 0,
	is_chat_tool_images: 0,
	is_chat_tool_video: 0,
	is_chat_tool_audio: 0,
	is_chat_tool_voice: 0,
	is_chat_tool_file: 0,
	is_chat_record_search: 0,
	/** 对齐 PC data-is-goods-recommend，商品推荐入口；缺省关闭 */
	is_goods_recommend: 0,
	/**
	 * 商品卡片点击跳转（插件迁移用）
	 * - 本管理端：保持 0，不跳详情
	 * - 其他项目：chat_set_config({ goods_click_enable: 1, goods_detail_path: '/pages/goods-detail/goods-detail?id={id}' })
	 * - 或传 on_goods_click: (goods) => { ... } 自定义（优先于路径）
	 */
	goods_click_enable: 0,
	/** 详情页路径模板，支持 {id} / {goods_id}；空且无回调时若有 goods_url 则开 web-view */
	goods_detail_path: '',
	/** 自定义商品点击：(goods) => void | false */
	on_goods_click: null,
	/** true：控制台打印每条 WS 收发数据，方便联调；看完可改回 false */
	debug: false,
};

let runtime_config = { ...chat_default_config };

/** 合并运行时配置 */
export const chat_set_config = (cfg = {}) => {
	if (!cfg || typeof cfg != 'object') {
		return get_chat_config();
	}
	runtime_config = { ...runtime_config, ...cfg };
	return get_chat_config();
};

/** 当前生效配置（只读副本） */
export const get_chat_config = () => ({ ...runtime_config });

/** 当前宿主是否允许商品点击跳转（有回调或开启开关） */
export const chat_can_open_goods = () => {
	if (typeof runtime_config.on_goods_click == 'function') {
		return true;
	}
	return parseInt(runtime_config.goods_click_enable || 0) == 1;
};

/**
 * 打开商品（插件迁移入口）
 * 优先级：on_goods_click > 接口下发的 goods_url > goods_detail_path 模板兜底
 * @param {object} goods { id, goods_id, goods_url, title, ... }
 * @returns {boolean}
 */
const open_goods_link = (url) => {
	const link = String(url || '').trim();
	if (isEmpty(link)) {
		return false;
	}
	if (/^https?:\/\//i.test(link)) {
		open_web_view(link);
		return true;
	}
	if (link.indexOf('/pages/') === 0) {
		url_open(link);
		return true;
	}
	url_open(link);
	return true;
};

export const chat_open_goods = (goods = {}) => {
	const g = goods && typeof goods == 'object' ? goods : {};
	const id = parseInt(g.id || g.goods_id || 0) || 0;
	const cb = runtime_config.on_goods_click;
	if (typeof cb == 'function') {
		try {
			cb(g);
			return true;
		} catch (e) {
			return false;
		}
	}
	if (parseInt(runtime_config.goods_click_enable || 0) != 1) {
		return false;
	}
	const goods_url = String(g.goods_url || g.url || '').trim();
	if (!isEmpty(goods_url)) {
		return open_goods_link(goods_url);
	}
	const path_tpl = String(runtime_config.goods_detail_path || '').trim();
	if (path_tpl) {
		if (!(id > 0) && path_tpl.indexOf('{id}') >= 0) {
			showToast('商品信息有误');
			return false;
		}
		const path = path_tpl.replace(/\{goods_id\}/g, String(id)).replace(/\{id\}/g, String(id));
		url_open(path);
		return true;
	}
	return false;
};

const state = {
	socket_task: null,
	connect_status: 0, // 0未连接 1已就绪
	is_connecting: false, // 首次连接/重连进行中（用于页面 loading）
	socket_opened: false, // TCP/WS 已 open，等待业务 success
	user_type: 'work',
	current_user: null,
	receive_user: null,
	friend_base: null,
	user_list: [],
	user_list_page: 1,
	user_list_page_total: 0,
	quick_message: [],
	work_label: [],
	init_message: null,
	online_status: 'off', // online | off | logout
	error_msg: '',
	ws_url: '',
	/** 最近收到的 WS 包（debug 用，含完整 JSON） */
	last_recv_list: [],
	ping_timer: null,
	reconnect_timer: null,
	connect_timer: null,
	reconnect_count: 0,
	manual_close: false,
	/** 连接代数：相册/文件管理器回前台时旧 socket 的延迟 close 必须忽略 */
	socket_gen: 0,
	/** 对齐 PC socket_last_alive_ts：最近一次业务/心跳回包时间 */
	last_alive_ts: 0,
	/** 智能客服：当前窗口展示用（工作台以访客 mode 缓存为准） */
	ai_state: { mode: 'human', show_transfer: 0, is_enable: 0 },
	ai_mode_map: {},
	ai_waiting_map: {},
	ai_switching: false,
	agent_online_others: 0,
	agent_online_list: [],
	session_ended_map: {},
	/** 对齐 PC chat_session_rated_map：本轮是否已评价（按会话联系人） */
	session_rated_map: {},
	/** 对齐 PC chat_features */
	chat_features: {},
	/** 工作台离线/超时自动回复（对齐 PC auto_reply_config） */
	auto_reply_config: {
		offline_message: '',
		timeout_seconds: '',
		timeout_message: '',
	},
	/** 工作台待回复排队 */
	queue_list: [],
	queue_count: 0,
	_queue_from_server: false,
	_did_queue_reconnect: false,
	/** 对齐 PC BaseService::EmojiList / 初始化接口 emoji_list */
	emoji_list: [],
	/** 对齐 PC：record 请求序号 / 期望联系人，防串窗 */
	record_req_id: 0,
	record_expect_contact: 0,
	record_pending: [],
	/** 对齐 PC chat_friend_search：联系人搜索序号 */
	friend_search: { keyword: '', seq: 0 },
};

const CHAT_TOOL_KEYS = ['emoji', 'images', 'video', 'audio', 'voice', 'file'];
/** HTTP 初始化明确下发的开关，优先级高于 socket / 本地默认 */
const page_flags = {};
let ai_switching_timer = null;
let auto_reply_saving = false;

const chat_log = (...args) => {
	if (runtime_config.debug) {
		console.log('[chat_socket]', ...args);
	}
};

const listeners = {};

const emit = (event, payload) => {
	const list = listeners[event] || [];
	list.forEach((fn) => {
		try {
			fn(payload);
		} catch (err) {
			console.error('[chat_socket] listener error', event, err);
		}
	});
};

export const on_chat_event = (event, fn) => {
	if (!listeners[event]) {
		listeners[event] = [];
	}
	if (listeners[event].indexOf(fn) != -1) {
		return;
	}
	listeners[event].push(fn);
};

export const off_chat_event = (event, fn) => {
	if (!listeners[event]) {
		return;
	}
	if (!fn) {
		listeners[event] = [];
		return;
	}
	listeners[event] = listeners[event].filter((item) => item != fn);
};

const active_contact_id = () => parseInt((state.receive_user && state.receive_user.id) || 0) || 0;

const active_ai_snapshot = () => {
	const vid = active_contact_id();
	const cached = (vid > 0 && state.ai_mode_map[vid]) ? state.ai_mode_map[vid] : {};
	const merged = { ...state.ai_state, ...cached };
	return {
		mode: merged.mode || 'human',
		is_enable: parseInt(merged.is_enable || 0) == 1 ? 1 : 0,
		show_transfer: parseInt(merged.show_transfer || 0) == 1 ? 1 : 0,
		bot_cuid: parseInt(merged.bot_cuid || 0) || 0,
		bot_name: merged.bot_name || '智能客服',
		bot_avatar: merged.bot_avatar || '',
		visitor_cuid: parseInt(merged.visitor_cuid || vid) || 0,
		switching: !!state.ai_switching,
		waiting: vid > 0 && parseInt(state.ai_waiting_map[vid] || 0) == 1,
		ended: vid > 0 && parseInt(state.session_ended_map[vid] || 0) == 1,
	};
};

export const get_chat_state = () => ({
	connect_status: state.connect_status,
	is_connecting: state.is_connecting,
	socket_opened: state.socket_opened,
	user_type: state.user_type,
	current_user: state.current_user,
	receive_user: state.receive_user,
	user_list: state.user_list,
	user_list_page: state.user_list_page,
	user_list_page_total: state.user_list_page_total,
	quick_message: state.quick_message,
	work_label: state.work_label,
	init_message: state.init_message,
	online_status: state.online_status,
	error_msg: state.error_msg,
	ws_url: state.ws_url,
	last_recv_list: state.last_recv_list,
	ai: active_ai_snapshot(),
	agent_online_others: state.agent_online_others,
	agent_online_list: state.agent_online_list,
	chat_features: state.chat_features,
	auto_reply_config: state.auto_reply_config,
	queue_list: state.queue_list,
	queue_count: state.queue_count,
	emoji_list: state.emoji_list,
});

/** 清空 debug 收包缓存 */
export const chat_clear_recv_log = () => {
	state.last_recv_list = [];
	emit('debug_recv', state.last_recv_list);
};

const stringify_label_item = (item) => {
	if (item == null) {
		return '';
	}
	if (typeof item == 'string' || typeof item == 'number') {
		return String(item).trim();
	}
	if (typeof item == 'object') {
		return String(item.name || item.label || item.value || item.title || item.text || '').trim();
	}
	return String(item).trim();
};

/** 规范化标签数组（兼容逗号字符串 / JSON / 对象数组） */
export const normalize_label_list = (raw) => {
	if (raw == null || raw === '') {
		return [];
	}
	if (typeof raw == 'string') {
		const text = raw.trim();
		if (
			(text.charAt(0) == '[' && text.charAt(text.length - 1) == ']')
			|| (text.charAt(0) == '{' && text.charAt(text.length - 1) == '}')
		) {
			try {
				return normalize_label_list(JSON.parse(text));
			} catch (err) {}
		}
		return text.split(/[,，]/).map((item) => item.trim()).filter((item) => !isEmpty(item));
	}
	if (Array.isArray(raw)) {
		return raw.map((item) => stringify_label_item(item)).filter((item) => !isEmpty(item));
	}
	if (typeof raw == 'object') {
		if (Array.isArray(raw.list)) {
			return normalize_label_list(raw.list);
		}
		if (Array.isArray(raw.data)) {
			return normalize_label_list(raw.data);
		}
		if (raw.work_label != null) {
			return normalize_label_list(raw.work_label);
		}
		return Object.keys(raw).map((key) => stringify_label_item(raw[key])).filter((item) => !isEmpty(item));
	}
	return [];
};

/** 从对象树里取出 work_label（init success / user-base / 配置） */
const pick_work_label_value = (root) => {
	if (!root || typeof root != 'object') {
		return undefined;
	}
	const bags = [
		root,
		root.data,
		root.config,
		root.base_data,
		root.chat_features,
		root.base,
		root.data && root.data.data,
		root.data && root.data.config,
		root.data && root.data.chat_features,
		root.data && root.data.base,
	];
	for (let i = 0; i < bags.length; i++) {
		const bag = bags[i];
		if (bag && typeof bag == 'object' && bag.work_label != null) {
			return bag.work_label;
		}
	}
	return undefined;
};

/** 从 init / plugins_base 包提取 WS 连接字段（支持 data.socket 嵌套，对齐接口返回） */
const pick_socket_connect_patch = (root = {}) => {
	const patch = {};
	if (!root || typeof root != 'object') {
		return patch;
	}
	const bags = [];
	const push_bag = (bag) => {
		if (bag && typeof bag == 'object') {
			bags.push(bag);
		}
	};
	push_bag(root.socket);
	push_bag(root);
	push_bag(root.base_data);
	if (root.base_data && typeof root.base_data == 'object') {
		push_bag(root.base_data.socket);
	}
	for (let i = 0; i < bags.length; i++) {
		const bag = bags[i];
		if (isEmpty(patch.ws_host) && !isEmpty(bag.connect_host)) {
			patch.ws_host = String(bag.connect_host).trim();
		}
		const port_num = parseInt(bag.connect_port, 10);
		if (!(patch.ws_port > 0) && port_num > 0) {
			patch.ws_port = port_num;
		}
		if (patch.is_wss == null && bag.is_wss != null && String(bag.is_wss).trim() !== '') {
			patch.is_wss = parseInt(bag.is_wss, 10) == 1 ? 1 : 0;
		}
		const ping_num = parseInt(bag.heartbeat_check_interval || bag.heartbeat || bag.ping, 10);
		if (!(patch.ping > 0) && ping_num > 0) {
			patch.ping = ping_num;
		}
	}
	return patch;
};

/** HTTP 初始化 common,base → plugins_base.chat.data 的 WS 地址 */
const pick_connect_from_init_config = () => {
	const patch = {};
	try {
		const cfg = get_config(null) || {};
		const bags = [cfg, cfg.config, cfg.common];
		const plugins_base = cfg.plugins_base;
		if (Array.isArray(plugins_base)) {
			const chat = plugins_base.find((item) => item && item.plugins == 'chat');
			if (chat) {
				bags.push(chat, chat.data);
			}
		} else if (plugins_base && typeof plugins_base == 'object') {
			const chat = plugins_base.chat;
			if (chat) {
				bags.push(chat, chat.data);
			}
		}
		for (let i = 0; i < bags.length; i++) {
			const sub = pick_socket_connect_patch(bags[i]);
			Object.keys(sub).forEach((key) => {
				if (patch[key] == null || patch[key] === '') {
					patch[key] = sub[key];
				}
			});
		}
	} catch (err) {}
	return patch;
};

/** 仅在包内明确带 work_label 时写入，不走缓存/本地兜底 */
const apply_work_label = (raw) => {
	const list = normalize_label_list(raw);
	state.work_label = list;
	runtime_config.work_label = list;
	emit('work_label', state.work_label);
	return true;
};

const hydrate_work_label = (root) => {
	const from_packet = pick_work_label_value(root);
	if (from_packet == null) {
		return false;
	}
	return apply_work_label(from_packet);
};

/** 对齐 PC emoji_list：支持字符串或 { emoji, tips } */
export const normalize_emoji_list = (raw) => {
	const rows = Array.isArray(raw) ? raw : [];
	const list = [];
	const seen = {};
	rows.forEach((item) => {
		let emoji = '';
		if (typeof item == 'string' || typeof item == 'number') {
			emoji = String(item || '').trim();
		} else if (item && typeof item == 'object') {
			emoji = String(item.emoji || item.name || item.value || '').trim();
		}
		if (!emoji || seen[emoji]) {
			return;
		}
		seen[emoji] = 1;
		list.push(emoji);
	});
	return list;
};

const pick_emoji_list_value = (root) => {
	if (!root || typeof root != 'object') {
		return null;
	}
	const bags = [
		root,
		root.data,
		root.data && root.data.data,
		root.base_data,
		root.base_data && root.base_data.data,
		root.chat,
		root.chat && root.chat.data,
	];
	for (let i = 0; i < bags.length; i++) {
		const bag = bags[i];
		if (bag && typeof bag == 'object' && bag.emoji_list != null) {
			return bag.emoji_list;
		}
	}
	return null;
};

/** 仅在包内明确带 emoji_list 时写入，不走缓存/本地假数据 */
const apply_emoji_list = (raw) => {
	const list = normalize_emoji_list(raw);
	state.emoji_list = list;
	emit('emoji_list', list);
	return true;
};

const hydrate_emoji_list = (root) => {
	const from_packet = pick_emoji_list_value(root);
	if (from_packet == null) {
		return false;
	}
	return apply_emoji_list(from_packet);
};

/** 当前表情字符列表（仅初始化/WS 下发） */
export const chat_get_emoji_list = () => (state.emoji_list && state.emoji_list.length > 0) ? state.emoji_list.slice() : [];

/**
 * 工作台 HTTP 初始化（Work/Index）下发的配置
 */
const flag_is_set = (obj, key) => {
	if (!obj || typeof obj != 'object') {
		return false;
	}
	return obj[key] !== undefined && obj[key] !== null && String(obj[key]) !== '';
};

const flag_to_bit = (val) => parseInt(val) == 1 ? 1 : 0;

/** snake / kebab 都认（PC data-is-chat-tool-images 与接口 is_chat_tool_images） */
const flag_name_list = (key) => {
	const aliases = INIT_FLAG_ALIAS[key] || [key];
	const list = [];
	aliases.forEach((name) => {
		list.push(name);
		if (String(name).indexOf('_') >= 0) {
			list.push(String(name).replace(/_/g, '-'));
		}
	});
	return list;
};

const pick_init_flag = (sources, names) => {
	const list = Array.isArray(names) ? names : [names];
	for (let i = 0; i < sources.length; i++) {
		const src = sources[i];
		if (!src || typeof src != 'object') {
			continue;
		}
		for (let j = 0; j < list.length; j++) {
			const key = list[j];
			if (flag_is_set(src, key)) {
				return flag_to_bit(src[key]);
			}
		}
	}
	return null;
};

const INIT_FLAG_ALIAS = {
	is_input_status: ['is_input_status', 'is_realtime_detection_input_status'],
	is_user_input_message: ['is_user_input_message', 'is_realtime_detection_user_input_message'],
};

const INIT_FLAG_KEYS = [
	'is_chat_end',
	'is_chat_end_user',
	'is_chat_rating',
	'is_chat_recall',
	'is_chat_recall_user',
	'is_chat_read',
	'is_chat_read_user',
	'is_chat_record_search',
	'is_chat_record_search_user',
	'is_offline_auto_reply',
	'is_quick_message',
	'is_goods_recommend',
	'is_chat_queue',
	'is_input_status',
	'is_user_input_message',
	...CHAT_TOOL_KEYS.map((tk) => 'is_chat_tool_' + tk),
	...CHAT_TOOL_KEYS.map((tk) => 'is_chat_tool_' + tk + '_user'),
];

const collect_init_sources = (data) => {
	const base = (data && data.base_data && typeof data.base_data == 'object') ? data.base_data : null;
	const nested = (data && data.data && typeof data.data == 'object') ? data.data : null;
	return [
		data && data.chat_features,
		base && base.chat_features,
		nested && nested.chat_features,
		base,
		nested,
		data,
	];
};

/** 初始化接口 > socket feat > 本地默认 */
const resolve_feat_flag = (key, feat = {}, fallback = 0) => {
	if (flag_is_set(page_flags, key)) {
		return flag_to_bit(page_flags[key]);
	}
	if (flag_is_set(feat, key)) {
		return flag_to_bit(feat[key]);
	}
	if (flag_is_set(runtime_config, key)) {
		return flag_to_bit(runtime_config[key]);
	}
	return fallback;
};

const apply_init_feature_flags = (data) => {
	const sources = collect_init_sources(data);
	INIT_FLAG_KEYS.forEach((key) => {
		const val = pick_init_flag(sources, flag_name_list(key));
		if (val == null) {
			return;
		}
		page_flags[key] = val;
		runtime_config[key] = val;
	});
	chat_apply_features({ ...page_flags });
};

export const chat_apply_work_init = (data = {}) => {
	if (!data || typeof data != 'object') {
		return;
	}
	hydrate_work_label(data);
	hydrate_emoji_list(data);
	const base = (data.base_data && typeof data.base_data == 'object') ? data.base_data : null;
	if (base) {
		hydrate_work_label(base);
		hydrate_emoji_list(base);
	}
	const src = base || data;
	const patch = pick_socket_connect_patch({ ...src, base_data: base });
	if (Object.keys(patch).length > 0) {
		chat_set_config(patch);
	}
	apply_init_feature_flags(data);
};

/**
 * HTTP 事件（对齐 PC EventHandle）
 * 走已有插件接口 event,index,chat（不改 PHP）
 */
export const chat_event_http = (type = 'off') => {
	const current_user = state.current_user && state.current_user.id ? state.current_user.id : 0;
	if (!current_user || isEmpty(type)) {
		return Promise.resolve(null);
	}
	const payload = build_send_payload(type, {});
	return $api.post(CHAT_USER_API.EVENT, payload, false, '', {}, 10000, true).catch(() => null);
};

const push_recv_log = (res, raw) => {
	const type = (res && res.data && res.data.type) || '';
	const row = {
		time: Date.now(),
		type,
		code: res ? res.code : null,
		// 完整包，后台 success 会很大（user_list / quick_message / msg）
		data: res,
		raw: typeof raw == 'string' ? raw : '',
	};
	state.last_recv_list = [row].concat(state.last_recv_list).slice(0, 30);
	emit('debug_recv', state.last_recv_list);
	if (runtime_config.debug) {
		console.log('[chat_socket] ← recv', type || '(no type)', res);
	}
};

const set_connecting = (flag, extra = {}) => {
	state.is_connecting = !!flag;
	emit('connecting', { ...get_chat_state(), ...extra });
};

/** 从文本中解析商品 ID（对齐 PC UserMessageHtml 规则） */
export const extract_goods_id_from_text = (text = '') => {
	const value = String(text || '');
	if (isEmpty(value)) {
		return 0;
	}
	// 小程序参数 id= / goods_id=
	const query_match = value.match(/(?:^|[?&])(?:id|goods_id)=(\d+)/i);
	if (query_match) {
		return Number(query_match[1]) || 0;
	}
	// web：/goods-123 或 goods/index/id/123
	const web_rules = [/\/goods-(\d+)/i, /goods\/index\/id\/(\d+)/i];
	for (let i = 0; i < web_rules.length; i++) {
		const hit = value.match(web_rules[i]);
		if (hit) {
			return Number(hit[1]) || 0;
		}
	}
	return 0;
};

/** 消息预览文案（对齐 PC LeftUserMessageTips） */
/** 列表预览：左侧 [类型] + 右侧具体内容（对齐微信） */
const format_preview_duration = (sec) => {
	const n = Math.max(0, Math.floor(Number(sec) || 0));
	if (!(n > 0)) {
		return '';
	}
	const m = Math.floor(n / 60);
	const s = n % 60;
	return m + ':' + (s < 10 ? '0' + s : String(s));
};

export const format_list_message_preview = (data) => {
	if (typeof data != 'object' || data == null || data == '') {
		const text = String(data || '').replace(/\n+/g, ' ').trim();
		return { tag: '', content: text };
	}
	const dt = data.data_type || '';
	if (
		dt == 'text'
		|| dt == 'system'
		|| dt == 'agent_notice'
		|| dt == 'visitor_notice'
		|| dt == 'mode_tip'
		|| dt == 'ai_summary'
		|| dt == 'login_required'
		|| dt == 'recall'
	) {
		return { tag: '', content: String(data.content || '').replace(/\n+/g, ' ').trim() };
	}
	if (dt == 'goods') {
		return { tag: '[商品]', content: String(data.title || data.content || '').trim() };
	}
	if (dt == 'order') {
		return { tag: '[订单]', content: String(data.order_no || data.content || '').trim() };
	}
	if (dt == 'aftersale') {
		return { tag: '[售后]', content: String(data.order_no || data.content || '').trim() };
	}
	if (dt == 'audio' && (parseInt(data.voice || 0) == 1 || data.voice === true || data.voice === 'true')) {
		const vd = parseInt(data.duration || 0) || 0;
		return { tag: '[语音]', content: vd > 0 ? (vd + '"') : '' };
	}
	if (dt == 'images') {
		return { tag: '[图片]', content: '' };
	}
	if (dt == 'video') {
		let content = String(data.duration_text || '').trim();
		if (!content) {
			content = format_preview_duration(data.duration);
		}
		if (!content) {
			let name = String(data.name || data.content || '').trim();
			name = name.replace(/^\[视频\]\s*/, '').replace(/^【视频】\s*/, '');
			if (name && name.indexOf('http') != 0 && name.indexOf('/') < 0) {
				content = name;
			}
		}
		return { tag: '[视频]', content };
	}
	if (dt == 'audio') {
		let name = String(data.name || data.content || '').trim();
		name = name.replace(/^\[音频\]\s*/, '').replace(/^【音频】\s*/, '');
		return { tag: '[音频]', content: name };
	}
	if (dt == 'file') {
		let name = String(data.name || data.content || '').trim();
		name = name.replace(/^\[文件\]\s*/, '').replace(/^【文件】\s*/, '');
		return { tag: '[文件]', content: name };
	}
	return { tag: '', content: '' };
};

export const format_message_tips = (data) => {
	const preview = format_list_message_preview(data);
	if (!preview.tag) {
		return preview.content;
	}
	if (!preview.content) {
		return preview.tag;
	}
	return preview.tag + ' ' + preview.content;
};

const apply_friend_preview_fields = (row, content) => {
	const preview = format_list_message_preview(content);
	row.preview_tag = preview.tag;
	row.preview_content = preview.content;
	row.last_message = format_message_tips(content);
	return row;
};

const absolutize_url = (url = '') => {
	const value = String(url || '').trim();
	if (isEmpty(value)) {
		return '';
	}
	if (/^(https?:)?\/\//i.test(value) || value.indexOf('data:') === 0) {
		return value;
	}
	const base = String(runtime_config.static_url || runtime_config.request_url || '').replace(/\/$/, '');
	if (isEmpty(base)) {
		return value;
	}
	return base + '/' + value.replace(/^\//, '');
};

/** 尝试把 JSON 字符串还原为对象（兼容未解码的记录 content） */
const maybe_parse_json = (value) => {
	if (typeof value != 'string') {
		return value;
	}
	const text = value.trim();
	if (!text || (text[0] != '{' && text[0] != '[')) {
		return value;
	}
	try {
		return JSON.parse(text);
	} catch (err) {
		return value;
	}
};

/** 对齐 PC：引用原消息是否已撤回 */
export const is_quote_recalled = (quote = null) => {
	if (!quote || typeof quote != 'object') {
		return false;
	}
	return parseInt(quote.is_recalled || 0) == 1 || (quote.data_type || '') == 'recall';
};

/** 引用消息预览文案 */
export const format_quote_preview = (quote = null) => {
	if (!quote || typeof quote != 'object') {
		return '';
	}
	if (is_quote_recalled(quote)) {
		return '引用内容已撤回';
	}
	const data_type = quote.data_type || 'text';
	if (data_type == 'images') {
		return '[图片]';
	}
	if (data_type == 'video') {
		return '[视频]';
	}
	if (data_type == 'goods') {
		const title = String(quote.content || quote.title || '').trim();
		if (!title) {
			return '[商品]';
		}
		return title.indexOf('[商品]') == 0 ? title : ('[商品] ' + title);
	}
	if (data_type == 'order') {
		const no = String(quote.content || quote.order_no || '').trim();
		if (!no) {
			return '[订单]';
		}
		return no.indexOf('[订单]') == 0 ? no : ('[订单] ' + no);
	}
	if (data_type == 'aftersale') {
		const no = String(quote.content || quote.order_no || '').trim();
		if (!no) {
			return '[售后]';
		}
		return no.indexOf('[售后]') == 0 ? no : ('[售后] ' + no);
	}
	if (data_type == 'file') {
		const name = String(quote.content || quote.name || '').trim();
		if (!name) {
			return '[文件]';
		}
		return name.indexOf('[文件]') == 0 ? name : ('[文件] ' + name);
	}
	if (data_type == 'audio' && (parseInt(quote.voice || 0) == 1 || quote.voice === true || quote.voice === 'true')) {
		const vd = parseInt(quote.duration || 0) || 0;
		if (vd > 0) {
			return '[语音] ' + vd + '"';
		}
		const text = String(quote.content || '').trim();
		if (text.indexOf('[语音]') == 0) {
			return text;
		}
		return '[语音]';
	}
	if (data_type == 'audio') {
		const name = String(quote.content || quote.name || '').trim();
		if (!name) {
			return '[音频]';
		}
		return name.indexOf('[音频]') == 0 ? name : ('[音频] ' + name);
	}
	const text = String(quote.content != null ? quote.content : '').replace(/\s+/g, ' ').trim();
	if (text.length > 80) {
		return text.slice(0, 80) + '…';
	}
	return text;
};

/** 规范化引用结构（随消息 content.quote 下发/回传） */
export const normalize_quote = (raw) => {
	if (!raw || typeof raw != 'object') {
		return null;
	}
	const data_type = raw.data_type || 'text';
	const recalled = parseInt(raw.is_recalled || 0) == 1 || data_type == 'recall';
	const content = String(
		raw.content != null
			? raw.content
			: (raw.text != null ? raw.text : (raw.title || ''))
	);
	const send_name = String(raw.send_name || '').trim();
	const name_field = String(raw.name || '').trim();
	const person = send_name || name_field;
	const file_name = (data_type == 'audio' || data_type == 'file')
		? String(raw.file_name || ((send_name && name_field && name_field != send_name) ? name_field : '')).trim()
		: '';
	const quote = {
		record_id: Number(raw.record_id || raw.id || 0),
		name: person,
		send_name: person,
		file_name,
		data_type: recalled ? 'recall' : data_type,
		content,
		url: absolutize_url(raw.url || ''),
		is_recalled: recalled ? 1 : 0,
	};
	if (data_type == 'audio' && (parseInt(raw.voice || 0) == 1 || raw.voice === true || raw.voice === 'true')) {
		quote.voice = 1;
		quote.duration = parseInt(raw.duration || 0) || 0;
	}
	if (recalled) {
		// 对齐 PC ChatQuoteBlockHtml：不展示发送方名，正文固定「引用内容已撤回」
		quote.name = '';
		quote.url = '';
		quote.content = '引用内容已撤回';
		quote.preview = '引用内容已撤回';
		return quote;
	}
	quote.preview = format_quote_preview(quote);
	if (isEmpty(quote.preview) && isEmpty(quote.url)) {
		return null;
	}
	return quote;
};

/** 解析气泡展示内容 */
export const parse_message_content = (content) => {
	content = maybe_parse_json(content);
	if (typeof content == 'object' && content != null) {
		const data_type = content.data_type || 'text';
		const quote = normalize_quote(content.quote);
		if (data_type == 'text') {
			const text = String(content.content != null ? content.content : '');
			const goods_id = extract_goods_id_from_text(text);
			return { data_type: 'text', text, url: '', goods_id, quote };
		}
		if (data_type == 'images' || data_type == 'video') {
			return {
				data_type,
				text: format_message_tips(content),
				url: absolutize_url(content.url || ''),
				poster: data_type == 'video' ? absolutize_url(content.poster || content.cover || content.thumb || '') : '',
				goods_id: 0,
				quote,
			};
		}
		if (data_type == 'goods') {
			return {
				data_type: 'goods',
				text: String(content.title || content.content || '[商品]'),
				url: absolutize_url(content.images || content.url || ''),
				goods_id: Number(content.id || content.goods_id || 0),
				goods: {
					id: content.id || content.goods_id || 0,
					title: content.title || '',
					price: content.price || '',
					images: absolutize_url(content.images || ''),
					goods_url: content.goods_url || '',
				},
				quote,
			};
		}
		if (data_type == 'order') {
			const list = Array.isArray(content.list) && content.list.length ? content.list : [content];
			const first = list[0] || {};
			return {
				data_type: 'order',
				text: first.order_no ? ('订单 ' + first.order_no) : '[订单]',
				url: '',
				goods_id: 0,
				order: {
					id: first.id || 0,
					order_no: first.order_no || '',
					status_name: first.status_name || '',
					total_price: first.total_price != null ? first.total_price : '',
					add_time: first.add_time || '',
					order_url: first.order_url || '',
					images: absolutize_url(first.images || (first.items && first.items[0] && first.items[0].images) || ''),
					goods_title: first.goods_title || (first.items && first.items[0] && first.items[0].title) || '',
					items: (first.items || []).map((it) => ({
						title: it.title || '',
						price: it.price != null ? it.price : '',
						buy_number: it.buy_number || 0,
						images: absolutize_url(it.images || ''),
					})),
					tip: content.tip || '',
				},
				quote,
			};
		}
		if (data_type == 'aftersale') {
			const list = Array.isArray(content.list) && content.list.length ? content.list : [content];
			const first = list[0] || {};
			return {
				data_type: 'aftersale',
				text: first.order_no ? ('售后 ' + first.order_no) : '[售后]',
				url: '',
				goods_id: 0,
				aftersale: {
					id: first.id || 0,
					order_no: first.order_no || '',
					type_name: first.type_name || '',
					status_name: first.status_name || '',
					price: first.price != null ? first.price : '',
					add_time: first.add_time || '',
					aftersale_url: first.aftersale_url || '',
					images: absolutize_url(first.images || ''),
					goods_title: first.goods_title || '',
					tip: content.tip || '',
				},
				quote,
			};
		}
		if (data_type == 'file' || data_type == 'audio') {
			const duration = Number(content.duration || 0) || 0;
			const voice_flag = content.voice;
			const voice = data_type == 'audio'
				&& (parseInt(voice_flag || 0) == 1 || voice_flag === true || voice_flag === 'true')
				? 1 : 0;
			return {
				data_type,
				text: String(content.name || content.content || (voice ? '[语音]' : (data_type == 'audio' ? '[音频]' : '[文件]'))),
				url: absolutize_url(content.url || ''),
				goods_id: 0,
				duration,
				voice,
				file: {
					name: content.name || '',
					unit: content.unit || '',
					url: absolutize_url(content.url || ''),
				},
				quote,
			};
		}
		if (
			data_type == 'system'
			|| data_type == 'mode_tip'
			|| data_type == 'visitor_notice'
			|| data_type == 'agent_notice'
			|| data_type == 'ai_summary'
			|| data_type == 'recall'
			|| data_type == 'login_required'
		) {
			return {
				data_type,
				text: String(content.content != null ? content.content : ''),
				url: '',
				goods_id: 0,
				quote: null,
			};
		}
		return { data_type: 'text', text: format_message_tips(content), url: '', goods_id: 0, quote };
	}
	const text = String(content != null ? content : '');
	return { data_type: 'text', text, url: '', goods_id: extract_goods_id_from_text(text), quote: null };
};

export const is_ai_bot_user = (user) => {
	if (!user) {
		return false;
	}
	return parseInt(user.is_ai_bot || 0) == 1 || String(user.uuid || '') === 'plugins_chat_ai_bot';
};

export const is_system_message = (content) => {
	return content != null && typeof content == 'object' && (content.data_type || '') == 'system';
};

export const is_obsolete_phase_divider = (content) => {
	if (!is_system_message(content)) {
		return false;
	}
	const tip = String(content.content || '');
	// 对齐 PC ChatIsObsoletePhaseDivider：文案是「回答」不是「回复」
	return tip === '智能客服回答' || tip === '人工客服回答'
		|| tip === '智能客服回复' || tip === '人工客服回复';
};

export const is_ai_summary_message = (content) => {
	if (content == null || typeof content != 'object') {
		return false;
	}
	const dt = content.data_type || '';
	if (dt == 'ai_summary') {
		return true;
	}
	if (dt == 'agent_notice') {
		const text = String(content.content || '');
		return text.indexOf('【AI接待摘要】') === 0 || text.indexOf('AI接待摘要') >= 0;
	}
	return false;
};

export const is_mode_tip_message = (content) => {
	if (content == null || typeof content != 'object' || is_ai_summary_message(content)) {
		return false;
	}
	const dt = content.data_type || '';
	return dt == 'mode_tip' || dt == 'agent_notice' || dt == 'visitor_notice';
};

/** 结束会话 / 恢复对话 的聊天区提示：App 自动继续，不再展示 */
export const is_session_end_continue_tip = (content) => {
	if (content == null) {
		return false;
	}
	const dt = (typeof content == 'object') ? String(content.data_type || '') : '';
	const text = typeof content == 'object'
		? String(content.content != null ? content.content : (content.text || content.msg || ''))
		: String(content);
	if (text === '') {
		return false;
	}
	if (/因长时间未互动|长时间未互动|对话已自动结束|感谢您的咨询|会话已关闭/.test(text)) {
		return true;
	}
	if (dt && dt != 'mode_tip' && dt != 'system' && dt != 'agent_notice' && dt != 'visitor_notice') {
		return false;
	}
	return /对话已结束|本次对话已结束|会话已结束|会话结束|结束对话|结束本次|恢复对话|已恢复对话|已恢复会话|继续聊天|已切换为智能客服|切换为智能客服/.test(text);
};

export const is_recall_message = (content) => {
	return content != null && typeof content == 'object' && (content.data_type || '') == 'recall';
};

export const chat_ai_bot_user = () => {
	const snap = active_ai_snapshot();
	const name = snap.bot_name || '智能客服';
	const avatar = absolutize_url(snap.bot_avatar || '');
	if (snap.bot_cuid > 0 || avatar) {
		return { id: snap.bot_cuid, name, avatar, is_ai_bot: 1 };
	}
	return { id: 0, name, avatar: '', is_ai_bot: 1 };
};

const chat_ai_list_user_id = (user, extra = {}) => {
	const user_id = parseInt((user && user.id) || 0);
	const list_cuid = parseInt(extra.list_cuid || extra.visitor_cuid || extra.agent_cuid || 0);
	if (list_cuid > 0) {
		return list_cuid;
	}
	if (extra.content && typeof extra.content == 'object') {
		const content_id = parseInt(extra.content.visitor_cuid || extra.content.agent_cuid || 0);
		if (content_id > 0) {
			return content_id;
		}
	}
	if (state.user_type == 'work' && is_ai_bot_user(user)) {
		const rid = parseInt(extra.receive_id || 0);
		if (rid > 0) {
			return rid;
		}
	}
	return user_id;
};

const patch_friend_ai_mode = (vid, mode) => {
	vid = parseInt(vid || 0);
	if (!(vid > 0)) {
		return;
	}
	const idx = state.user_list.findIndex((row) => parseInt(row.id) == vid);
	if (idx < 0) {
		return;
	}
	if (state.user_list[idx].ai_mode == mode) {
		return;
	}
	state.user_list.splice(idx, 1, { ...state.user_list[idx], ai_mode: mode || '' });
};

const chat_session_ended_set = (contact_id, ended) => {
	contact_id = parseInt(contact_id || 0);
	if (!(contact_id > 0)) {
		return;
	}
	if (ended) {
		state.session_ended_map[contact_id] = 1;
	} else {
		delete state.session_ended_map[contact_id];
	}
};

/** 结束态下先发 chat-continue，回包后再发出排队中的消息 */
let pending_send_seq = 0;
let pending_send_after_continue = [];
const continue_inflight = {};
/** 续聊成功后短时间内忽略迟到 chat-end（否则刚进页/刚发消息会误弹「是否继续」） */
const continue_end_ignore_until = {};

const clone_send_content = (content) => {
	try {
		return JSON.parse(JSON.stringify(content || {}));
	} catch (e) {
		return { ...(content || {}) };
	}
};

const arm_continue_end_ignore = (contact_id, ms = 5000) => {
	const vid = parseInt(contact_id || 0) || active_contact_id();
	if (!(vid > 0)) {
		return;
	}
	const until = Date.now() + Math.max(0, parseInt(ms) || 0);
	if ((continue_end_ignore_until[vid] || 0) < until) {
		continue_end_ignore_until[vid] = until;
	}
};

const reset_pending_send_after_continue = () => {
	pending_send_after_continue = [];
	Object.keys(continue_inflight).forEach((key) => {
		delete continue_inflight[key];
	});
	Object.keys(continue_end_ignore_until).forEach((key) => {
		delete continue_end_ignore_until[key];
	});
};

const fail_pending_send_after_continue = (contact_id) => {
	const vid = parseInt(contact_id || 0) || active_contact_id();
	if (vid > 0) {
		delete continue_inflight[vid];
	}
	const rest = [];
	let dropped = 0;
	pending_send_after_continue.forEach((item) => {
		if (!item || !item.content) {
			return;
		}
		if (!item.contact_id || item.contact_id == vid) {
			dropped += 1;
			return;
		}
		rest.push(item);
	});
	pending_send_after_continue = rest;
	if (dropped > 0) {
		emit('chat_pending_send_fail', { contact_id: vid });
	}
};

const flush_pending_send_after_continue = (contact_id) => {
	const vid = parseInt(contact_id || 0) || active_contact_id();
	if (vid > 0) {
		delete continue_inflight[vid];
		// 清 inflight 后仍忽略迟到 end，避免刚续聊/刚发出排队消息立刻弹窗
		arm_continue_end_ignore(vid, 8000);
	}
	if (vid > 0 && parseInt(state.session_ended_map[vid] || 0) == 1) {
		return;
	}
	const wait = [];
	const rest = [];
	pending_send_after_continue.forEach((item) => {
		if (!item || !item.content) {
			return;
		}
		if (!item.contact_id || item.contact_id == vid) {
			wait.push(item);
		} else {
			rest.push(item);
		}
	});
	pending_send_after_continue = rest;
	wait.forEach((item) => {
		chat_send_message(item.content);
	});
	if (wait.length > 0) {
		emit('chat_pending_send_flush', { contact_id: vid });
	}
};

/** 续聊请求、排队待发、或续聊成功后的短忽略窗：忽略迟到的 chat-end */
export const chat_session_revive_inflight = (contact_id) => {
	const vid = parseInt(contact_id || 0) || active_contact_id();
	if (!(vid > 0)) {
		return false;
	}
	if (continue_inflight[vid]) {
		return true;
	}
	if ((continue_end_ignore_until[vid] || 0) > Date.now()) {
		return true;
	}
	return pending_send_after_continue.some((item) => item && item.content && (!item.contact_id || item.contact_id == vid));
};

/** 对齐 PC chat_session_rated_map：本轮是否已评价 */
const chat_session_rated_set = (contact_id, rated) => {
	contact_id = parseInt(contact_id || 0);
	if (!(contact_id > 0)) {
		return;
	}
	if (rated) {
		state.session_rated_map[contact_id] = 1;
	} else {
		delete state.session_rated_map[contact_id];
	}
};

const chat_session_is_rated = (contact_id) => {
	contact_id = parseInt(contact_id || 0);
	return contact_id > 0 && parseInt(state.session_rated_map[contact_id] || 0) == 1;
};

/** 对齐 PC ChatApplyFeatures.is_chat_rating */
export const chat_can_rating = () => {
	if (parseInt((state.chat_features || {}).is_chat_rating || 0) == 1) {
		return true;
	}
	return parseInt(runtime_config.is_chat_rating || 0) == 1;
};

/**
 * 对齐 PC ChatOpenRatingModal：仅咨询端；本轮已评过则不再弹
 * @param {object} data  { agent_cuid, end_by }
 */
export const chat_try_open_rating = (data = {}) => {
	// 对齐 PC：评价弹窗仅 user_type == 'user'
	if (state.user_type != 'user') {
		return false;
	}
	if (!chat_can_rating()) {
		return false;
	}
	const agent_cuid = parseInt(data.agent_cuid || 0) || active_contact_id();
	if (!(agent_cuid > 0)) {
		return false;
	}
	if (chat_session_is_rated(agent_cuid)) {
		return false;
	}
	const end_by = data.end_by || 'visitor';
	emit('chat_rating_open', {
		agent_cuid,
		end_by,
		contact_id: agent_cuid,
	});
	return true;
};

/** 提交评价 chat-rating */
export const chat_submit_rating = ({ score, content, agent_cuid, end_by } = {}) => {
	if (state.connect_status !== 1) {
		showToast('未连接');
		return false;
	}
	if (!chat_can_rating()) {
		showToast('未开启会话评价');
		return false;
	}
	const sc = parseInt(score || 0);
	if (!(sc >= 1 && sc <= 5)) {
		showToast('请先选择星级');
		return false;
	}
	const aid = parseInt(agent_cuid || 0) || active_contact_id();
	if (aid > 0 && chat_session_is_rated(aid)) {
		showToast('您已评价过本次服务');
		emit('chat_rating_close', { contact_id: aid });
		return false;
	}
	return chat_send('chat-rating', {
		data: {
			score: sc,
			content: content == null ? '' : String(content),
			agent_cuid: aid,
			end_by: end_by || (state.user_type == 'work' ? 'agent' : 'visitor'),
		},
	});
};

/** 对齐 PC ChatInvalidateRecordSnapshot：本地发出消息时作废进行中的 record 快照 */
export const chat_invalidate_record_snapshot = () => {
	state.record_req_id += 1;
	state.record_pending = [];
	state.record_expect_contact = active_contact_id();
};

/** 对齐 PC ChatMarkActiveConversationRead：标记当前会话对方消息已读 */
let mark_read_last = { contact: 0, ts: 0 };
export const chat_mark_active_conversation_read = (force = false) => {
	const active_id = active_contact_id();
	if (state.user_type == 'work' && !(active_id > 0)) {
		return false;
	}
	if (state.connect_status !== 1) {
		return false;
	}
	const now = Date.now();
	if (!force && mark_read_last.contact == active_id && (now - mark_read_last.ts) < 1500) {
		return false;
	}
	mark_read_last = { contact: active_id, ts: now };
	if (active_id > 0) {
		chat_clear_unread(active_id);
	}
	return chat_send('friend-receive-read');
};

const chat_ai_set_waiting = (contact_id, on) => {
	contact_id = parseInt(contact_id || 0) || active_contact_id();
	if (!(contact_id > 0)) {
		return;
	}
	if (on) {
		state.ai_waiting_map[contact_id] = 1;
	} else {
		delete state.ai_waiting_map[contact_id];
	}
};

const chat_ai_switch_unlock = () => {
	state.ai_switching = false;
	if (ai_switching_timer) {
		clearTimeout(ai_switching_timer);
		ai_switching_timer = null;
	}
	emit('ai_mode', get_chat_state());
};

const chat_ai_switch_lock = () => {
	state.ai_switching = true;
	if (ai_switching_timer) {
		clearTimeout(ai_switching_timer);
	}
	ai_switching_timer = setTimeout(() => {
		chat_ai_switch_unlock();
	}, 30000);
	emit('ai_mode', get_chat_state());
};

const emit_ai_and_list = () => {
	emit('ai_mode', get_chat_state());
	emit('user_list', get_chat_state());
};

/** 咨询端：从 AI 回复或历史推断当前为智能客服接待（未明确转人工时） */
const chat_user_infer_ai_mode = (contact_id = 0) => {
	if (state.user_type != 'user' || state.ai_switching) {
		return;
	}
	const cid = parseInt(contact_id || active_contact_id()) || 0;
	if (!(cid > 0)) {
		return;
	}
	const cached = state.ai_mode_map[cid] || {};
	// 会话已结束待续聊时不推断；续聊成功后由 chat-continue 切回 AI
	if (parseInt(state.session_ended_map[cid] || 0) == 1) {
		return;
	}
	if (cached.mode == 'human') {
		return;
	}
	chat_apply_ai_mode({ mode: 'ai', visitor_cuid: cid, is_enable: 1 }, '');
};

const record_has_ai_reply = (record) => {
	const groups = record && record.data;
	if (!Array.isArray(groups)) {
		return false;
	}
	for (let i = 0; i < groups.length; i++) {
		const group = groups[i];
		if (!group || group.type == 'right') {
			continue;
		}
		if (is_ai_bot_user(group.user)) {
			return true;
		}
	}
	return false;
};

/** 对齐 PC ChatAiApplyMode（工作台按 visitor_cuid 缓存） */
const chat_apply_ai_mode = (ai = {}, tip_msg = '') => {
	ai = ai || {};
	const visitor_cuid = parseInt(ai.visitor_cuid || 0);
	const active_id = active_contact_id();
	const map_key = visitor_cuid || active_id;
	if (state.user_type == 'work' && visitor_cuid > 0) {
		state.ai_mode_map[visitor_cuid] = {
			...(state.ai_mode_map[visitor_cuid] || {}),
			...ai,
			visitor_cuid,
		};
		if (Object.prototype.hasOwnProperty.call(ai, 'mode')) {
			patch_friend_ai_mode(visitor_cuid, ai.mode);
		}
	}
	if (!Object.prototype.hasOwnProperty.call(ai, 'mode') && typeof ai.is_enable != 'undefined') {
		state.ai_state = { ...state.ai_state, ...ai, is_enable: ai.is_enable };
		if (active_id > 0) {
			state.ai_mode_map[active_id] = {
				...(state.ai_mode_map[active_id] || {}),
				...ai,
				is_enable: ai.is_enable,
			};
		}
		if (typeof ai.is_chat_ended != 'undefined' && map_key > 0) {
			chat_session_ended_set(map_key, parseInt(ai.is_chat_ended || 0) == 1);
		}
		emit_ai_and_list();
		return;
	}
	// 对齐 PC：工作台仅当前选中访客时改按钮态
	const should_apply_ui = state.user_type != 'work'
		|| (visitor_cuid > 0 && visitor_cuid == active_id);
	if (should_apply_ui) {
		const cached = (active_id > 0 && state.ai_mode_map[active_id]) ? state.ai_mode_map[active_id] : {};
		state.ai_state = {
			...state.ai_state,
			...cached,
			...ai,
			mode: ai.mode || cached.mode || state.ai_state.mode || 'human',
		};
		if (active_id > 0) {
			chat_ai_set_waiting(active_id, false);
		}
	}
	if (typeof ai.is_chat_ended != 'undefined') {
		const ended_key = map_key > 0 ? map_key : active_id;
		if (ended_key > 0) {
			chat_session_ended_set(ended_key, parseInt(ai.is_chat_ended || 0) == 1);
			if (state.ai_mode_map[ended_key]) {
				state.ai_mode_map[ended_key].is_chat_ended = parseInt(ai.is_chat_ended || 0) == 1 ? 1 : 0;
			}
		}
	}
	if (!isEmpty(tip_msg) && should_apply_ui) {
		// 结束/续聊类文案不 toast（进页自动续聊时服务端常顺带推这类提示）
		if (!is_session_end_continue_tip(tip_msg) && !is_session_end_continue_tip({ data_type: 'mode_tip', content: tip_msg })) {
			showToast(tip_msg);
		}
	}
	emit_ai_and_list();
};

const parse_host_from_request_url = (request_url = '') => {
	const match = String(request_url || '').match(/^https?:\/\/([^/:]+)/i);
	return match ? match[1] : '';
};

/** 接口 connect_host 优先；没有则用当前 request_url 域名 */
const apply_work_connect_config = () => {
	if (isEmpty(runtime_config.ws_host)) {
		const from_init = pick_connect_from_init_config();
		if (Object.keys(from_init).length > 0) {
			chat_set_config(from_init);
		}
	}
	if (isEmpty(runtime_config.ws_host)) {
		const host = parse_host_from_request_url(runtime_config.request_url);
		if (!isEmpty(host)) {
			runtime_config.ws_host = host;
		}
	}
};

/** 对齐 PC GetConnectParams：WS URL 携带进线 source / data_id / data_type 等 */
const build_connect_query_string = () => {
	const cfg = runtime_config;
	const parts = [];
	const data_type = cfg.entry_data_type;
	const data_id = cfg.entry_data_id;
	if (data_type != null && String(data_type) !== '') {
		if (data_id != null && String(data_id) !== '' || data_type === 'order-list' || data_type === 'aftersale-list') {
			parts.push('data_id=' + encodeURIComponent(data_id != null && String(data_id) !== '' ? String(data_id) : '0'));
			parts.push('data_type=' + encodeURIComponent(String(data_type)));
		}
	}
	if (!isEmpty(cfg.entry_source)) {
		parts.push('source=' + encodeURIComponent(String(cfg.entry_source)));
	}
	if (!isEmpty(cfg.entry_chat_user)) {
		parts.push('chat_user=' + encodeURIComponent(String(cfg.entry_chat_user)));
	}
	if (!isEmpty(cfg.entry_chat_type)) {
		parts.push('chat_type=' + encodeURIComponent(String(cfg.entry_chat_type)));
	}
	return parts.length > 0 ? ('?' + parts.join('&')) : '';
};

/** 页面 onLoad 进线参数 → runtime_config（连接前调用） */
export const chat_apply_entry_params = (params = {}) => {
	const patch = {};
	if (params.source != null && String(params.source) !== '') {
		patch.entry_source = String(params.source);
	}
	if (params.data_id != null && String(params.data_id) !== '') {
		patch.entry_data_id = String(params.data_id);
	}
	if (params.data_type != null && String(params.data_type) !== '') {
		patch.entry_data_type = String(params.data_type);
	}
	if (params.chat_user != null && String(params.chat_user) !== '') {
		patch.entry_chat_user = String(params.chat_user);
	}
	if (params.chat_type != null && String(params.chat_type) !== '') {
		patch.entry_chat_type = String(params.chat_type);
	}
	if (Object.keys(patch).length > 0) {
		chat_set_config(patch);
	}
	return patch;
};

/** 原生会话页 URL（列表 → 详情，携带进线参数） */
export const chat_build_session_url = (id, entry = {}) => {
	const agent_id = parseInt(id || 0, 10) || 0;
	if (!(agent_id > 0)) {
		return '/pages/plugins/chat/index/index';
	}
	const src = entry || {};
	let url = '/pages/plugins/chat/index/index?id=' + encodeURIComponent(String(agent_id));
	if (!isEmpty(src.source)) {
		url += '&source=' + encodeURIComponent(String(src.source));
	}
	if (!isEmpty(src.data_type)) {
		url += '&data_type=' + encodeURIComponent(String(src.data_type));
		if (src.data_id != null && String(src.data_id) !== '') {
			url += '&data_id=' + encodeURIComponent(String(src.data_id));
		} else {
			url += '&data_id=0';
		}
	}
	if (!isEmpty(src.chat_user)) {
		url += '&chat_user=' + encodeURIComponent(String(src.chat_user));
	}
	if (!isEmpty(src.chat_type)) {
		url += '&chat_type=' + encodeURIComponent(String(src.chat_type));
	}
	return url;
};

const get_connect_params = () => {
	const cfg = runtime_config;
	const request_url = cfg.request_url || '';
	// 对齐 PC chat common.js：按当前页面协议判断（非 request_url），H5 本地 http 不误判
	let is_https = String(request_url).indexOf('https://') === 0;
	try {
		if (typeof window !== 'undefined' && window.location && window.location.protocol) {
			is_https = window.location.protocol === 'https:';
		}
	} catch (err) {}
	let is_wss = Number(cfg.is_wss);
	if (Number.isNaN(is_wss)) {
		is_wss = is_https ? 1 : 0;
	}
	const host = cfg.ws_host || parse_host_from_request_url(request_url) || '127.0.0.1';
	const port = Number(cfg.ws_port || 9502);
	const ws = is_wss === 1 ? 'wss' : 'ws';
	if (is_https && ws != 'wss') {
		return { error: 'https站点请开启wss连接方式' };
	}
	return {
		url: ws + '://' + host + ':' + port + build_connect_query_string(),
		ping: Number(cfg.ping || 30),
	};
};

export const chat_site_logged_in = () => {
	const auth = get_auth_info();
	return parseInt(auth.user_id || 0) > 0;
};

const get_auth_info = () => {
	const cfg = runtime_config;
	if (cfg.token != null || cfg.user_id != null) {
		return {
			token: cfg.token != null ? cfg.token : '',
			user_id: parseInt(cfg.user_id || 0) || 0,
			uuid: cfg.uuid || request_uuid(),
			system_type: cfg.system_type || 'default',
		};
	}
	const user = get_user_cache_info(null, null);
	return {
		token: user == null ? '' : (user.token != null ? user.token : ''),
		// 对齐 PC MessageSendDataHandle：user_id 用站点用户 id（非 chat cuid）
		user_id: user == null ? 0 : (parseInt(user.id || user.user_id || 0) || 0),
		uuid: request_uuid(),
		system_type: cfg.system_type || 'default',
	};
};

/** 当前 WS 身份是否与登录账号一致 */
const chat_identity_matches_login = () => {
	const auth = get_auth_info();
	const login_uid = parseInt(auth.user_id || 0) || 0;
	if (!(login_uid > 0) || !state.current_user) {
		return true;
	}
	// success.user.id 是 chat cuid，user_id 才是站点用户 id
	const site_uid = parseInt(state.current_user.user_id || 0) || 0;
	if (!(site_uid > 0)) {
		return true;
	}
	return site_uid == login_uid;
};

/** 强制断开并清空会话身份（换号登录后重连） */
const chat_force_reconnect_reset = () => {
	try {
		state._expect_close = true;
		state.manual_close = true;
		if (state.socket_task) {
			state.socket_task.close({});
		}
	} catch (err) {}
	clear_ping();
	clear_reconnect();
	state.socket_task = null;
	state.connect_status = 0;
	state.socket_opened = false;
	state.is_connecting = false;
	state.manual_close = false;
	state.last_alive_ts = 0;
	state.current_user = null;
	state.receive_user = null;
	state.user_list = [];
	state.queue_list = [];
	state.queue_count = 0;
	state._queue_from_server = false;
	state._did_queue_reconnect = false;
	state.session_ended_map = {};
	state.session_rated_map = {};
	state.ai_mode_map = {};
	state.ai_waiting_map = {};
	reset_pending_send_after_continue();
};

/** 从 success 包提取工作台初始提示（对齐 PC res.data.msg = init_work_message） */
const pick_init_message = (data = {}) => {
	const candidates = [data.msg, data.init_message, data.data && data.data.msg];
	for (let i = 0; i < candidates.length; i++) {
		const raw = candidates[i];
		if (raw == null) {
			continue;
		}
		if (typeof raw == 'string' && raw.trim() !== '') {
			return raw;
		}
		if (typeof raw == 'object') {
			const tip = String(raw.content || raw.msg || '').trim();
			if (tip !== '') {
				return raw;
			}
		}
	}
	return null;
};

/** 组装发送包（对齐 PC MessageSendDataHandle） */
export const build_send_payload = (type = 'chat', params = {}) => {
	const auth = get_auth_info();
	const current_user = state.current_user == null ? 0 : (state.current_user.id || 0);
	const receive_user = state.receive_user == null ? 0 : (state.receive_user.id || 0);
	const page_user_type = state.user_type || 'work';
	let payload_data = params.data;
	if (payload_data === undefined || payload_data === null) {
		payload_data = { user_type: page_user_type };
	} else if (payload_data && typeof payload_data == 'object' && !Array.isArray(payload_data)) {
		payload_data = { ...payload_data, user_type: page_user_type };
	}
	return {
		token: auth.token,
		user_id: auth.user_id,
		uuid: auth.uuid,
		system_type: auth.system_type,
		// 对齐 PC MessageSendDataHandle；client_type 跟商城终端一致（h5/weixin/app 等）
		application: 'web',
		application_client_type: get_application_client_type(),
		type: type || 'chat',
		content: params.content || '',
		fd: params.fd,
		data: payload_data,
		user_type: page_user_type,
		current_user,
		receive_user,
	};
};

export const chat_send = (type = 'chat', params = {}) => {
	if (!state.socket_task) {
		return false;
	}
	// init 在 open 后即可发送；其它类型需 success 就绪
	if (type != 'init' && state.connect_status !== 1) {
		return false;
	}
	// 对齐 PC ChatSend：半开死连接（浏览器仍 OPEN，服务端已掐线）先踢掉重连
	if (type != 'init' && type != 'ping' && state.connect_status === 1 && socket_is_stale_dead()) {
		chat_log('send blocked: stale half-open');
		socket_kick_stale('send-stale');
		return false;
	}
	const payload = build_send_payload(type, params);
	if (runtime_config.debug && type != 'ping') {
		console.log('[chat_socket] → send', type, payload);
	}
	try {
		state.socket_task.send({
			data: JSON.stringify(payload),
		});
		return true;
	} catch (err) {
		console.error('[chat_socket] send fail', err);
		return false;
	}
};

/** 对齐 PC SocketPingIntervalSec */
const socket_ping_interval_sec = () => {
	const ping = parseInt(runtime_config.ping || state._ping_seconds || 0, 10);
	return ping > 0 ? ping : 30;
};

/** 对齐 PC SocketIdleSuspectMs：心跳间隔 ×2，至少 45s */
const socket_idle_suspect_ms = () => Math.max(socket_ping_interval_sec() * 2000, 45000);

/** 对齐 PC SocketIsStaleDead */
const socket_is_stale_dead = () => {
	if (!(state.last_alive_ts > 0)) {
		return false;
	}
	return (Date.now() - state.last_alive_ts) >= socket_idle_suspect_ms();
};

const mark_socket_alive = () => {
	state.last_alive_ts = Date.now();
};

/** 踢半开连接，走 onClose → start_fail_reconnect */
const socket_kick_stale = (reason = '') => {
	chat_log('force dead stale', reason);
	state.last_alive_ts = 0;
	state.connect_status = 0;
	try {
		state.manual_close = false;
		state._expect_close = false;
		if (state.socket_task) {
			state.socket_task.close({});
		} else {
			set_connecting(true);
			start_fail_reconnect();
		}
	} catch (err) {
		set_connecting(true);
		start_fail_reconnect();
	}
};

const clear_ping = () => {
	if (state.ping_timer) {
		clearInterval(state.ping_timer);
		state.ping_timer = null;
	}
};

const clear_reconnect = () => {
	if (state.reconnect_timer) {
		clearInterval(state.reconnect_timer);
		state.reconnect_timer = null;
	}
	if (state.connect_timer) {
		clearInterval(state.connect_timer);
		state.connect_timer = null;
	}
};

const start_ping = (seconds) => {
	clear_ping();
	const ping = Number(seconds) || 0;
	if (ping <= 0) {
		return;
	}
	state.ping_timer = setInterval(() => {
		if (state.connect_status !== 1) {
			return;
		}
		if (socket_is_stale_dead()) {
			socket_kick_stale('ping-stale');
			return;
		}
		const ok = chat_send('ping', { data: Date.now() });
		if (!ok) {
			socket_kick_stale('ping-send-fail');
		}
	}, ping * 1000);
};

/** 列表包可能是数组、JSON 字符串、{data:[]}、{list:[]}，或 PHP 关联数组转成的数字键对象 */
const extract_array_rows = (value) => {
	if (typeof value == 'string') {
		const text = value.trim();
		if (text[0] == '[' || text[0] == '{') {
			try {
				return extract_array_rows(JSON.parse(text));
			} catch (err) {
				return [];
			}
		}
		return [];
	}
	if (Array.isArray(value)) {
		return value;
	}
	if (!value || typeof value != 'object') {
		return [];
	}
	if (Array.isArray(value.list)) {
		return value.list;
	}
	if (Array.isArray(value.queue_list)) {
		return value.queue_list;
	}
	if (Array.isArray(value.data)) {
		return value.data;
	}
	if (value.list && typeof value.list == 'object') {
		const nested = extract_array_rows(value.list);
		if (nested.length > 0) {
			return nested;
		}
	}
	if (value.queue_list && typeof value.queue_list == 'object') {
		const nested = extract_array_rows(value.queue_list);
		if (nested.length > 0) {
			return nested;
		}
	}
	const keys = Object.keys(value);
	const numeric_keys = keys.filter((key) => /^\d+$/.test(key));
	if (numeric_keys.length > 0) {
		return numeric_keys
			.sort((a, b) => Number(a) - Number(b))
			.map((key) => value[key])
			.filter((row) => row && typeof row == 'object');
	}
	return [];
};

const unread_number = (value) => {
	if (value == '99+') {
		return 99;
	}
	return parseInt(value, 10) || 0;
};

/**
 * 对齐 PC ChatPageOrFeatFlag：runtime（页面）优先，否则用 socket feat，再否则 0
 */
const chat_page_or_feat_flag = (runtime_key, feat_key, feat = {}) => {
	const pv = runtime_config[runtime_key];
	if (pv !== undefined && pv !== null && String(pv) !== '') {
		return parseInt(pv) == 1 ? 1 : 0;
	}
	if (feat[feat_key] !== undefined && feat[feat_key] !== null && String(feat[feat_key]) !== '') {
		return parseInt(feat[feat_key]) == 1 ? 1 : 0;
	}
	return 0;
};

/** 对齐 PC ChatToolFlagFromPageOrFeat */
const chat_tool_flag_from_page_or_feat = (tool, feat = {}, for_user = false) => {
	const runtime_key = for_user ? ('is_chat_tool_' + tool + '_user') : ('is_chat_tool_' + tool);
	return chat_page_or_feat_flag(runtime_key, runtime_key, feat);
};

/** 对齐 PC ChatIsVoiceMessage：audio + voice:1 */
export const chat_is_voice_message = (content) => {
	if (content == null) {
		return false;
	}
	let data = content;
	if (typeof data == 'string') {
		const s = data.replace(/^\s+/, '');
		if (s === '' || (s.charAt(0) !== '{' && s.charAt(0) !== '[')) {
			return false;
		}
		try {
			data = JSON.parse(data);
		} catch (e) {
			return /"data_type"\s*:\s*"audio"/.test(content) && /"voice"\s*:\s*(1|true|"1")/.test(content);
		}
	}
	if (typeof data != 'object' || data == null) {
		return false;
	}
	const voice_flag = data.voice;
	return (data.data_type || '') == 'audio'
		&& (parseInt(voice_flag || 0) == 1 || voice_flag === true || voice_flag === 'true');
};

/**
 * UniApp 无 SSR：socket 明确下发时以 socket 为准，缺省再用 runtime 页面默认
 * （避免默认全开后后台关工具关不掉）
 */
const chat_socket_or_page_flag = (runtime_key, feat_key, feat = {}) => {
	if (feat[feat_key] !== undefined && feat[feat_key] !== null && String(feat[feat_key]) !== '') {
		return parseInt(feat[feat_key]) == 1 ? 1 : 0;
	}
	return chat_page_or_feat_flag(runtime_key, feat_key, {});
};

/** 对齐 PC ChatApplyFeatures：socket 覆盖；queue/offline/quick 与页面配置 OR；工具/会话搜索走 page|feat */
const chat_apply_features = (feat = {}) => {
	const incoming = feat || {};
	const page_queue = parseInt(runtime_config.is_chat_queue || 0) == 1 ? 1 : 0;
	const page_offline = parseInt(runtime_config.is_offline_auto_reply || 0) == 1 ? 1 : 0;
	const page_quick = parseInt(runtime_config.is_quick_message || 0) == 1 ? 1 : 0;
	const page_goods = parseInt(runtime_config.is_goods_recommend || 0) == 1 ? 1 : 0;
	// 对齐 PC：$chat.data('is-input-status') 仅页面配置，不进 socket chat_features 覆盖
	const page_input = parseInt(runtime_config.is_input_status || 0) == 1 ? 1 : 0;
	const page_input_msg = parseInt(runtime_config.is_user_input_message || 0) == 1 ? 1 : 0;
	const next = { ...(state.chat_features || {}) };
	// OR 字段：incoming 未带该 key 时保留已有 socket/本地状态，避免 init 重跑把排队等冲掉
	const or_incoming_bit = (key) => {
		if (flag_is_set(incoming, key)) {
			return flag_to_bit(incoming[key]);
		}
		return parseInt((state.chat_features && state.chat_features[key]) || 0) == 1 ? 1 : 0;
	};
	// 结束/评价/撤回/已读：初始化 page_flags > socket > runtime；socket 缺字段时勿直接置 0（否则结束按钮会丢）
	next.is_chat_end = resolve_feat_flag('is_chat_end', incoming, 0);
	next.is_chat_end_user = resolve_feat_flag('is_chat_end_user', incoming, 0);
	next.is_chat_rating = resolve_feat_flag('is_chat_rating', incoming, 0);
	next.is_chat_recall = resolve_feat_flag('is_chat_recall', incoming, 0);
	next.is_chat_recall_user = resolve_feat_flag('is_chat_recall_user', incoming, 0);
	next.is_chat_read = resolve_feat_flag('is_chat_read', incoming, 0);
	next.is_chat_read_user = resolve_feat_flag('is_chat_read_user', incoming, 0);
	next.recall_seconds = parseInt(incoming.recall_seconds != null && String(incoming.recall_seconds) !== '' ? incoming.recall_seconds : (state.chat_features.recall_seconds || 120), 10) || 120;
	// 工具/会话搜索：对齐 PC ChatToolFlagFromPageOrFeat
	// 仅「初始化明确下发」或「本次 incoming 带字段」才改；不要用 runtime 默认 0 把已开的入口冲掉
	const apply_page_or_feat_bit = (key) => {
		if (flag_is_set(page_flags, key)) {
			next[key] = flag_to_bit(page_flags[key]);
			return;
		}
		const kebab = String(key).replace(/_/g, '-');
		if (flag_is_set(incoming, key)) {
			next[key] = flag_to_bit(incoming[key]);
			return;
		}
		if (flag_is_set(incoming, kebab)) {
			next[key] = flag_to_bit(incoming[kebab]);
		}
	};
	apply_page_or_feat_bit('is_chat_record_search');
	apply_page_or_feat_bit('is_chat_record_search_user');
	CHAT_TOOL_KEYS.forEach((tk) => {
		apply_page_or_feat_bit('is_chat_tool_' + tk);
		apply_page_or_feat_bit('is_chat_tool_' + tk + '_user');
	});
	// 对齐 PC ChatApplyFeatures：queue / offline / quick / goods = 页面 OR socket（任一侧开即开）
	next.is_offline_auto_reply = (page_offline == 1 || or_incoming_bit('is_offline_auto_reply') == 1) ? 1 : 0;
	next.is_quick_message = (page_quick == 1 || or_incoming_bit('is_quick_message') == 1) ? 1 : 0;
	next.is_chat_queue = (page_queue == 1 || or_incoming_bit('is_chat_queue') == 1) ? 1 : 0;
	next.is_goods_recommend = (page_goods == 1 || or_incoming_bit('is_goods_recommend') == 1) ? 1 : 0;
	// 输入状态：仅页面配置（对齐 PC data-is-input-status）
	next.is_input_status = page_input;
	next.is_user_input_message = page_input_msg;
	state.chat_features = next;
	emit('chat_features', { ...next });
};

// 对齐 PC ChatInitToolFlagsFromPage：启动时用 runtime 页面默认灌入工具/搜索开关
chat_apply_features({});

const apply_auto_reply_config = (cfg = {}) => {
	const sec = parseInt(cfg.timeout_seconds || 0);
	state.auto_reply_config = {
		offline_message: String(cfg.offline_message || ''),
		timeout_seconds: sec > 0 ? sec : '',
		timeout_message: String(cfg.timeout_message || ''),
	};
	emit('auto_reply_config', { ...state.auto_reply_config });
};

const chat_queue_panel_visible = () => {
	if (state.user_type != 'work' || state.connect_status !== 1) {
		return false;
	}
	// 对齐 PC ChatQueuePanelUiSync：页面 OR socket 功能开关
	const page_on = parseInt(runtime_config.is_chat_queue || 0) == 1;
	const feat_on = parseInt((state.chat_features && state.chat_features.is_chat_queue) || 0) == 1;
	return page_on || feat_on;
};

/** 对齐 PC ChatQueuePanelUiSync：按开关回写 is_chat_queue，关闭时隐藏面板 */
const chat_queue_panel_ui_sync = () => {
	if (state.user_type != 'work') {
		return false;
	}
	const on = parseInt(runtime_config.is_chat_queue || 0) == 1
		|| parseInt((state.chat_features && state.chat_features.is_chat_queue) || 0) == 1;
	const cur = parseInt((state.chat_features && state.chat_features.is_chat_queue) || 0) == 1;
	if (on) {
		if (!cur) {
			state.chat_features = { ...(state.chat_features || {}), is_chat_queue: 1 };
			emit('chat_features', { ...state.chat_features });
		}
		return true;
	}
	if (cur) {
		state.chat_features = { ...(state.chat_features || {}), is_chat_queue: 0 };
		emit('chat_features', { ...state.chat_features });
	}
	return false;
};

const map_friend_list = (list_data = {}) => {
	const rows = extract_array_rows(list_data);
	return rows
		.map((item) => {
			const receive = item.receive_user || null;
			if (!receive || !receive.id) {
				return null;
			}
			if (is_ai_bot_user(receive)) {
				return null;
			}
			const avatar = absolutize_url(receive.avatar) || '/static/images/common/user.png';
			const receive_user = {
				...receive,
				avatar,
				platform_name: receive.platform_name || receive.platform || '',
			};
			const rid = parseInt(receive.id || 0);
			const ai_mode = item.ai_mode || (state.ai_mode_map[rid] && state.ai_mode_map[rid].mode) || '';
			if (rid > 0 && ai_mode != '') {
				state.ai_mode_map[rid] = {
					...(state.ai_mode_map[rid] || {}),
					mode: ai_mode,
					visitor_cuid: rid,
				};
			}
			const unread_raw = (item.unread_count != null && item.unread_count !== '') ? item.unread_count : (item.unread || 0);
			const pending_raw = (item.pending_count != null && item.pending_count !== '') ? item.pending_count : null;
			const pending = pending_raw != null ? unread_number(pending_raw) : 0;
			const preview = format_list_message_preview(maybe_parse_json(item.content));
			return {
				id: receive.id,
				name: receive.name || '用户',
				avatar,
				status: Number(receive.status),
				ai_mode,
				preview_tag: preview.tag,
				preview_content: preview.content,
				last_message: format_message_tips(maybe_parse_json(item.content)),
				time_text: item.time || '',
				unread: unread_raw,
				unread_count: unread_raw,
				pending_count: pending,
				wait_text: item.wait_text || '',
				receive_user,
				raw: item,
			};
		})
		.filter((item) => item != null);
};

/** 对齐 PC ChatQueueListApply */
const map_queue_list = (payload = {}) => {
	const list = extract_array_rows(payload);
	const rows = [];
	list.forEach((row, index) => {
		if (!row || typeof row != 'object') {
			return;
		}
		const receive = row.receive_user || {};
		const vid = parseInt(row.visitor_cuid || receive.id || row.cuid || row.id || 0) || 0;
		if (!(vid > 0)) {
			return;
		}
		const pending_raw = row.pending_count != null ? row.pending_count : (row.unread_count != null ? row.unread_count : row.unread);
		let pending = unread_number(pending_raw);
		if (pending <= 0 && (row.pending_text || '') !== '') {
			const m = String(row.pending_text).match(/(\d+)/);
			pending = m ? parseInt(m[1]) : 0;
		}
		const preview_obj = format_list_message_preview(maybe_parse_json(row.content));
		const preview = row.preview || format_message_tips(row.content) || '等待回复';
		rows.push({
			visitor_cuid: vid,
			id: vid,
			name: row.name || receive.name || ('访客' + vid),
			avatar: absolutize_url(row.avatar || receive.avatar || ''),
			preview_tag: preview_obj.tag,
			preview_content: preview_obj.content,
			preview,
			wait_text: row.wait_text || '',
			position: parseInt(row.position || (index + 1)) || (index + 1),
			pending_count: pending,
			pending_text: pending > 99 ? '99+' : String(pending),
		});
	});
	return rows;
};

const apply_queue_list = (payload = {}, from_server = true) => {
	if (state.user_type != 'work') {
		emit('queue_list', get_chat_state());
		return;
	}
	// 对齐 PC ChatQueueListApply：先 UiSync，开关关闭则不渲染列表
	chat_queue_panel_ui_sync();
	if (parseInt((state.chat_features && state.chat_features.is_chat_queue) || 0) != 1
		&& parseInt(runtime_config.is_chat_queue || 0) != 1) {
		state.queue_list = [];
		state.queue_count = 0;
		emit('queue_list', get_chat_state());
		return;
	}
	const rows = map_queue_list(payload);
	const payload_obj = (payload && typeof payload == 'object' && !Array.isArray(payload)) ? payload : null;
	const raw_count = payload_obj ? payload_obj.count : 0;
	state.queue_list = rows;
	state.queue_count = parseInt(raw_count || rows.length || 0) || rows.length;
	if (from_server) {
		state._queue_from_server = true;
	}
	emit('queue_list', get_chat_state());
};

const upsert_friend_item = (payload) => {
	const mapped = map_friend_list(payload);
	if (mapped.length === 0) {
		return;
	}
	const item = mapped[0];
	const index = state.user_list.findIndex((row) => row.id == item.id);
	if (index >= 0) {
		state.user_list.splice(index, 1);
	}
	state.user_list.unshift(item);
	emit('user_list', get_chat_state());
};

/** 撤回时回退到上一条预览（发送/新消息写入 last_message 前备份） */
const friend_preview_backup = {};

const snapshot_friend_preview = (row) => ({
	tag: row.preview_tag || '',
	content: row.preview_content || '',
	last_message: row.last_message || '',
});

const update_friend_preview = (user_id, content, time_text, unread_delta = 0) => {
	const index = state.user_list.findIndex((row) => row.id == user_id);
	if (index < 0) {
		return;
	}
	const row = { ...state.user_list[index] };
	friend_preview_backup[user_id] = snapshot_friend_preview(row);
	apply_friend_preview_fields(row, content);
	if (!isEmpty(time_text)) {
		row.time_text = time_text;
	}
	if (unread_delta != 0) {
		let unread = Number(row.unread) || 0;
		if (String(row.unread) == '99+') {
			unread = 99;
		}
		unread += unread_delta;
		row.unread = unread >= 100 ? '99+' : unread;
	}
	state.user_list.splice(index, 1, row);
	emit('user_list', get_chat_state());
};

/** 直接写入会话预览（撤回后按聊天记录重算时用，避免把「图片」再备进去） */
export const chat_update_friend_preview = (user_id, content, time_text = '') => {
	const index = state.user_list.findIndex((row) => row.id == user_id);
	if (index < 0) {
		return;
	}
	const row = { ...state.user_list[index] };
	apply_friend_preview_fields(row, content);
	friend_preview_backup[user_id] = snapshot_friend_preview(row);
	if (!isEmpty(time_text)) {
		row.time_text = time_text;
	}
	state.user_list.splice(index, 1, row);
	emit('user_list', get_chat_state());
};

/** 当前会话不在眼前时：预览回退到撤回前的上一条 */
const revert_friend_preview = (user_id, fallback_content) => {
	const index = state.user_list.findIndex((row) => row.id == user_id);
	if (index < 0) {
		return;
	}
	const backup = friend_preview_backup[user_id];
	let next_tag = '';
	let next_content = '';
	let next_message = '';
	if (backup && typeof backup == 'object') {
		next_tag = backup.tag || '';
		next_content = backup.content || '';
		next_message = backup.last_message || format_message_tips(fallback_content);
	} else if (backup != null && String(backup) !== '') {
		next_message = String(backup);
	} else {
		const preview = format_list_message_preview(fallback_content);
		next_tag = preview.tag;
		next_content = preview.content;
		next_message = format_message_tips(fallback_content);
	}
	const row = { ...state.user_list[index] };
	row.preview_tag = next_tag;
	row.preview_content = next_content;
	row.last_message = next_message;
	friend_preview_backup[user_id] = snapshot_friend_preview(row);
	state.user_list.splice(index, 1, row);
	emit('user_list', get_chat_state());
};

/** 进入会话后清除未读角标 */
export const chat_clear_unread = (user_id) => {
	if (isEmpty(user_id)) {
		return false;
	}
	const index = state.user_list.findIndex((row) => String(row.id) == String(user_id));
	if (index < 0) {
		return false;
	}
	if (state.user_list[index].unread == 0 || state.user_list[index].unread === '0') {
		return true;
	}
	const row = { ...state.user_list[index], unread: 0 };
	state.user_list.splice(index, 1, row);
	emit('user_list', get_chat_state());
	return true;
};

const handle_message = (raw) => {
	let res = null;
	try {
		let value = raw;
		if (value && (value instanceof ArrayBuffer || (typeof ArrayBuffer != 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(value)))) {
			value = new TextDecoder('utf-8').decode(value);
		}
		res = typeof value == 'string' ? JSON.parse(value) : value;
		if (res && typeof res.data == 'string') {
			try {
				const inner = JSON.parse(res.data);
				if (inner && typeof inner == 'object' && (inner.code != null || inner.data || inner.type)) {
					res = inner;
				}
			} catch (err) {}
		}
	} catch (err) {
		console.error('[chat_socket] parse fail', err, raw);
		push_recv_log({ code: -1, msg: 'parse fail', data: { type: 'parse-fail', raw } }, raw);
		return;
	}
	// 对齐 PC ChatMarkSocketAlive：任意可解析回包刷新存活时间
	mark_socket_alive();
	let data = (res && res.data) || {};
	let type = (data && data.type) || res.type || '';
	if (!type && data && data.data && data.data.type) {
		data = data.data;
		type = data.type || '';
	}
	// ping 太频繁：仅 debug 且显式要看时再记；默认也 push 精简条
	if (type == 'ping') {
		if (runtime_config.debug) {
			// 心跳只留类型，避免刷屏
			state.last_recv_list = [{ time: Date.now(), type: 'ping', code: res.code, data: { type: 'ping' }, raw: '' }]
				.concat(state.last_recv_list.filter((item) => item.type != 'ping'))
				.slice(0, 30);
		}
	} else {
		push_recv_log(res, raw);
	}
	const is_queue_type = type == 'queue-list' || type == 'queue_list';
	if (!res || (res.code != 0 && res.code != '0' && !is_queue_type)) {
		const fail_type = (res && res.data && res.data.type) || '';
		const was_switching = !!state.ai_switching;
		const err_msg = (res && res.msg) || '';
		const is_chat_reject = fail_type == 'chat-reject' || String(err_msg).indexOf('敏感词') >= 0;
		if (was_switching) {
			chat_ai_switch_unlock();
		}
		if (auto_reply_saving) {
			auto_reply_saving = false;
			emit('auto_reply_save', { ok: false, msg: err_msg });
			if (err_msg) {
				showToast(err_msg);
			}
			return;
		}
		// 对齐 PC：敏感词/chat-reject 只 toast，恢复草稿，不锁发送区
		if (is_chat_reject) {
			if (err_msg) {
				showToast(err_msg);
			}
			emit('chat_reject', { msg: err_msg, type: fail_type || 'chat-reject', res });
			return;
		}
		if (err_msg) {
			state.error_msg = err_msg;
			emit('error', { msg: err_msg, res });
			if (
				was_switching
				|| /^(ai-|agent-|transfer|chat-end|chat-continue)/.test(fail_type)
				|| String(err_msg).indexOf('接管人工') >= 0
			) {
				showToast(err_msg);
			}
			if (state.user_type == 'work' && String(err_msg).indexOf('接管人工') >= 0) {
				const vid = active_contact_id();
				chat_apply_ai_mode({ mode: 'ai', visitor_cuid: vid }, '');
			}
		}
		if (fail_type == 'chat-continue') {
			const fail_vid = state.user_type == 'work'
				? parseInt((data.data && data.data.visitor_cuid) || 0)
				: parseInt((data.data && data.data.agent_cuid) || 0);
			fail_pending_send_after_continue(fail_vid || active_contact_id());
		}
		return;
	}

	switch (type) {
		case 'init':
			chat_send('init', { fd: data.fd, data: { user_type: state.user_type } });
			break;

		case 'success-fail':
			state.connect_status = 1;
			state.error_msg = res.msg || '初始化失败';
			state.online_status = 'off';
			set_connecting(false);
			emit('success_fail', { msg: state.error_msg, res });
			showToast(state.error_msg);
			break;

		case 'success':
			state.connect_status = 1;
			state.error_msg = '';
			state.online_status = 'online';
			set_connecting(false);
			state.current_user = data.user || null;
			if (state.current_user && state.current_user.avatar) {
				state.current_user = {
					...state.current_user,
					avatar: absolutize_url(state.current_user.avatar),
				};
			}
			// 登录账号与 WS 身份不一致时强制重连（避免 uuid 串号）
			if (!chat_identity_matches_login()) {
				chat_log('success identity mismatch, reconnect', {
					login_uid: get_auth_info().user_id,
					ws_user: state.current_user,
				});
				if (!state._identity_retry) {
					state._identity_retry = 1;
					try {
						refresh_request_uuid();
					} catch (e) {}
					chat_force_reconnect_reset();
					set_connecting(true);
					connect_once();
					break;
				}
				state._identity_retry = 0;
				showToast('客服身份异常，请重新登录');
			} else {
				state._identity_retry = 0;
			}
			// 初始提示来自插件配置 init_work_message，字段为 data.msg（可能为空）
			state.init_message = pick_init_message(data);
			hydrate_work_label(data);
			hydrate_work_label(res);
			hydrate_emoji_list(data);
			hydrate_emoji_list(res);
			if (data.data) {
				hydrate_emoji_list(data.data);
			}
			chat_log('success', {
				ws_url: state.ws_url,
				init_message: state.init_message,
				user: state.current_user && state.current_user.name,
				quick_message: (data.data && data.data.quick_message && data.data.quick_message.length) || 0,
				work_label: (state.work_label && state.work_label.length) || 0,
			});
			if (!state.init_message) {
				chat_log('init_message 为空：请在后台「客服插件」配置工作台初始消息，或确认 WS success.msg 有值');
			}
			if (state.user_type == 'user' && data.receive) {
				const receive = { ...data.receive };
				if (receive.avatar) {
					receive.avatar = absolutize_url(receive.avatar);
				}
				// 列表进会话后刷新重连：勿用 success.receive 冲掉已选客服（管理端 work 不会覆盖）
				const cur_id = parseInt((state.receive_user && state.receive_user.id) || 0) || 0;
				const next_id = parseInt(receive.id || 0) || 0;
				if (!(cur_id > 0) || cur_id == next_id) {
					state.receive_user = receive;
				}
			}
			if (data.data && data.data.user_list) {
				// 对齐 PC UserFriendView：空 data 不冲掉已有列表（首连空则保持空）
				const mapped_friends = map_friend_list(data.data.user_list);
				const rows_raw = extract_array_rows(data.data.user_list);
				if (rows_raw.length > 0) {
					state.user_list = mapped_friends;
					state.user_list_page = data.data.user_list.page || 1;
					state.user_list_page_total = data.data.user_list.page_total || 0;
				} else if (!(state.user_list && state.user_list.length)) {
					state.user_list = [];
					state.user_list_page = data.data.user_list.page || 1;
					state.user_list_page_total = data.data.user_list.page_total || 0;
				}
			} else if (!(state.user_list && state.user_list.length)) {
				state.user_list = [];
				state.user_list_page = 1;
				state.user_list_page_total = 0;
			}
			// 快捷消息（对齐 PC QuickMessageView）
			if (data.data && Array.isArray(data.data.quick_message)) {
				state.quick_message = data.data.quick_message.map((item) => ({
					id: item.id,
					content: String(item.content || ''),
				})).filter((item) => !isEmpty(item.content));
			} else {
				state.quick_message = [];
			}
			if (data.ai && typeof data.ai.is_enable != 'undefined') {
				chat_apply_ai_mode({
					is_enable: data.ai.is_enable,
					bot_cuid: data.ai.bot_cuid,
					bot_name: data.ai.bot_name,
					bot_avatar: data.ai.bot_avatar,
				}, '');
			}
			if (state.user_type == 'work') {
				state.agent_online_others = parseInt((data.data && data.data.agent_online_others) || 0);
			}
			// 对齐 PC ChatApplyFeatures（chat_features 在 res.data 根上）
			const feat = { ...(data.chat_features || (data.data && data.data.chat_features) || {}) };
			chat_apply_features(feat);
			if (state.user_type == 'work') {
				const queue_rows = (data.data && data.data.queue_list != null) ? extract_array_rows(data.data.queue_list) : null;
				chat_log('success work queue', {
					has_queue_field: !!(data.data && data.data.queue_list != null),
					queue_len: queue_rows ? queue_rows.length : 0,
					is_chat_queue: state.chat_features.is_chat_queue,
					user_list_len: state.user_list.length,
				});
				// 对齐 PC：有 queue_list 字段才 Apply；空数组也信任；不要用未读伪造
				if (data.data && data.data.queue_list != null) {
					apply_queue_list({
						list: data.data.queue_list,
						count: extract_array_rows(data.data.queue_list).length,
					}, true);
				} else {
					// 对齐 PC：无 queue_list 字段仍同步面板显隐
					chat_queue_panel_ui_sync();
					emit('queue_list', get_chat_state());
				}
				apply_auto_reply_config((data.data && data.data.auto_reply_config) || state.auto_reply_config || {});
			}
			start_ping(state._ping_seconds || get_connect_params().ping);
			emit('success', get_chat_state());
			emit('user_list', get_chat_state());
			emit('quick_message', state.quick_message);
			emit('work_label', state.work_label);
			break;

		case 'ping':
			state.connect_status = 1;
			break;

		case 'status':
			state.online_status = data.data || 'off';
			emit('status', get_chat_state());
			if (state.online_status == 'online') {
				if (state.receive_user && state.receive_user.id) {
					chat_send('record');
				} else {
					state.user_list_page = 1;
					chat_send('user-history', { data: { page: 1, seq: state.friend_search.seq } });
				}
			}
			break;

		case 'chat':
			// 对齐 PC：旧版脏分割线仍发 read，但不展示
			if (data.content != null && is_obsolete_phase_divider(data.content)) {
				if (data.data && data.data.record_id) {
					const active_id = active_contact_id();
					const extra_tip = { ...(data.data || {}), content: data.content, receive_id: data.receive && data.receive.id };
					const list_user_id = chat_ai_list_user_id(data.user, extra_tip);
					if (active_id > 0 && list_user_id == active_id) {
						chat_send('read', { data: { record_id: data.data.record_id } });
					}
				}
				break;
			}
			if (data.content != null && is_session_end_continue_tip(data.content)) {
				if (data.data && data.data.record_id) {
					const active_id = active_contact_id();
					const extra_tip = { ...(data.data || {}), content: data.content, receive_id: data.receive && data.receive.id };
					const list_user_id = chat_ai_list_user_id(data.user, extra_tip);
					if (active_id > 0 && list_user_id == active_id) {
						chat_send('read', { data: { record_id: data.data.record_id } });
					}
				}
				break;
			}
			if (data.content != null && (is_system_message(data.content) || is_mode_tip_message(data.content))) {
				const extra_tip = { ...(data.data || {}), content: data.content, receive_id: data.receive && data.receive.id };
				const list_user_id = chat_ai_list_user_id(data.user, extra_tip);
				const active_id = active_contact_id();
				const is_active = active_id > 0 && list_user_id == active_id;
				const is_system = is_system_message(data.content);
				if (state.ai_switching) {
					chat_ai_switch_unlock();
				}
				if (is_active) {
					chat_ai_set_waiting(active_id, false);
					emit('ai_thinking', { show: false, contact_id: active_id });
				} else if (list_user_id > 0 && !is_ai_bot_user(data.user)) {
					// 对齐 PC：system 不涨未读；mode tip 可更新预览
					update_friend_preview(
						list_user_id,
						data.content,
						(data.data && data.data.time) || '',
						is_system ? 0 : 1
					);
				}
				emit('chat', {
					content: data.content,
					user: data.user,
					receive: data.receive,
					data: data.data,
					is_active,
					is_system,
					is_mode_tip: is_mode_tip_message(data.content),
					list_user_id,
				});
				if (is_active && data.data && data.data.record_id) {
					chat_send('read', { data: { record_id: data.data.record_id } });
				}
				break;
			}
			if (data.content != null && data.user != null) {
				const extra = { ...(data.data || {}), content: data.content, receive_id: data.receive && data.receive.id };
				let list_user_id = chat_ai_list_user_id(data.user, extra);
				const me_id = state.current_user && state.current_user.id;
				const from_self = me_id && data.user && String(data.user.id) == String(me_id);
				// 对齐 PC：工作台自己发出的回声/自动回复按访客归会话，避免串到客服自己
				if (state.user_type == 'work' && from_self) {
					const self_recv = parseInt(
						(data.receive && data.receive.id)
						|| (data.data && data.data.list_cuid)
						|| 0
					);
					if (self_recv > 0) {
						list_user_id = self_recv;
					}
				}
				const bot_cuid = parseInt((state.ai_state && state.ai_state.bot_cuid) || 0);
				const is_ai_reply = parseInt((data.data && data.data.is_ai_reply) || 0) == 1
					|| (bot_cuid > 0 && parseInt(data.user.id) == bot_cuid)
					|| is_ai_bot_user(data.user);
				const active_id = active_contact_id();
				const is_active = active_id > 0 && list_user_id == active_id;
				const list_user = (from_self && data.receive && !is_ai_bot_user(data.receive))
					? data.receive
					: ((is_ai_bot_user(data.user) && data.receive && !is_ai_bot_user(data.receive))
						? data.receive
						: data.user);
				const skip_list = is_ai_bot_user(list_user);
				if (!skip_list) {
					const exists = state.user_list.some((row) => row.id == list_user_id);
					if (exists) {
						update_friend_preview(
							list_user_id,
							data.content,
							(data.data && data.data.time) || '',
							(is_active || from_self) ? 0 : 1
						);
						const row = state.user_list.find((item) => item.id == list_user_id);
						if (row) {
							row.status = 1;
							if (row.receive_user) {
								row.receive_user = { ...row.receive_user, status: 1 };
							}
							if (is_active || from_self) {
								row.unread = 0;
							}
							emit('user_list', get_chat_state());
						}
					} else if (!from_self) {
						upsert_friend_item({
							data: [{
								unread_count: is_active ? 0 : 1,
								time: (data.data && data.data.time) || '',
								receive_user: { ...list_user, status: 1 },
								content: data.content,
								ai_mode: is_ai_reply ? 'ai' : ((state.ai_mode_map[list_user_id] || {}).mode || ''),
							}],
						});
					}
				}
				if (is_ai_reply) {
					chat_ai_set_waiting(list_user_id, false);
					if (is_active) {
						emit('ai_thinking', { show: false, contact_id: list_user_id });
					}
					if (state.user_type == 'user' && is_active) {
						chat_user_infer_ai_mode(list_user_id);
					}
				}
				emit('chat', {
					content: data.content,
					user: is_ai_reply ? (data.user || chat_ai_bot_user()) : data.user,
					receive: data.receive,
					data: data.data,
					is_active,
					is_ai_reply,
					from_self: !!from_self,
					list_user_id,
				});
				if (!from_self) {
					const notify_user = skip_list
						? ((state.user_list.find((row) => row.id == list_user_id) || {}).receive_user || { id: list_user_id })
						: list_user;
					if (notify_user && notify_user.id) {
						notify_incoming_chat(notify_user, format_message_tips(data.content));
					}
				}
				if (is_active && !from_self) {
					// 对齐 PC：语音必须点播放才标已读，这里不自动 read
					if (
						data.data
						&& data.data.record_id
						&& !chat_is_voice_message(data.content)
						&& !chat_is_voice_message((data.data && data.data.content) || null)
					) {
						chat_send('read', { data: { record_id: data.data.record_id } });
					}
					chat_send('user-base');
				} else if (!is_active && !from_self) {
					try {
						uni.vibrateShort({});
					} catch (e) {}
				}
			}
			break;

		case 'record': {
			const active_now = active_contact_id();
			const resp_contact = parseInt(
				(data.data && (data.data.receive_user || data.data.contact_cuid || data.data.visitor_cuid)) || 0
			) || 0;
			let record_meta = null;
			let record_contact = 0;
			let record_req = 0;
			if (state.record_pending.length > 0) {
				let pending_idx = state.record_pending.findIndex((row) => {
					const cid = parseInt((row && row.contact_id) || 0) || 0;
					return resp_contact > 0 ? cid == resp_contact : (active_now > 0 && cid == active_now);
				});
				if (pending_idx < 0) {
					pending_idx = 0;
				}
				record_meta = state.record_pending.splice(pending_idx, 1)[0];
			}
			if (record_meta && typeof record_meta == 'object') {
				record_contact = parseInt(record_meta.contact_id || 0) || 0;
				record_req = parseInt(record_meta.id || 0) || 0;
			}
			// 对齐 PC：联系人 / 请求序号不一致则丢弃，避免串窗或覆盖乐观消息
			if (active_now <= 0) {
				break;
			}
			if (resp_contact > 0 && resp_contact != active_now) {
				break;
			}
			if (record_contact > 0 && record_contact != active_now) {
				break;
			}
			if (state.record_expect_contact > 0 && state.record_expect_contact != active_now) {
				break;
			}
			if (record_req > 0 && record_req !== state.record_req_id) {
				break;
			}
			if (data.data && data.data.base) {
				chat_set_friend_base(data.data.base);
			}
			if (data.data && data.data.ai) {
				const rec_ai = { ...data.data.ai };
				if (state.user_type == 'work' && state.receive_user && state.receive_user.id) {
					rec_ai.visitor_cuid = parseInt(state.receive_user.id);
				}
				chat_apply_ai_mode(rec_ai, '');
			} else if (state.user_type == 'user' && record_has_ai_reply(data.data && data.data.record)) {
				chat_user_infer_ai_mode(active_now);
			} else if (state.user_type == 'work') {
				emit('ai_mode', get_chat_state());
			}
			chat_log('record', {
				total: data.data && data.data.record && data.data.record.total,
				groups: data.data && data.data.record && data.data.record.data && data.data.record.data.length,
				init_message: state.init_message,
			});
			emit('record', {
				mode: 'init',
				record: (data.data && data.data.record) || null,
				base: (data.data && data.data.base) || null,
				ai: (data.data && data.data.ai) || null,
				contact_id: active_now,
			});
			if (state.receive_user && state.receive_user.id) {
				const row = state.user_list.find((item) => item.id == state.receive_user.id);
				if (row) {
					row.unread = 0;
					emit('user_list', get_chat_state());
				}
				// 对齐 PC ChatMarkActiveConversationRead(true)
				chat_mark_active_conversation_read(true);
			}
			break;
		}

		case 'chat-ack': {
			const ack = data.data || {};
			// 对齐 PC ChatAiOnChatAck
			if (ack.ai != null) {
				chat_apply_ai_mode(ack.ai, '');
			}
			if (typeof ack.ai_asking != 'undefined' && parseInt(ack.ai_asking) != 1) {
				const wait_cid = parseInt(ack.agent_cuid || 0) || active_contact_id();
				chat_ai_set_waiting(wait_cid, false);
				emit('ai_thinking', { show: false, contact_id: wait_cid });
				if (state.ai_switching && ack.ai && (ack.ai.mode || '') == 'human') {
					chat_ai_switch_unlock();
				}
			}
			const ack_id = parseInt(ack.record_id || 0) || 0;
			if (ack_id > 0) {
				emit('chat_ack', {
					record_id: ack_id,
					add_time: parseInt(ack.add_time || 0) || Math.floor(Date.now() / 1000),
					data: ack,
				});
			}
			break;
		}

		case 'chat-read':
			if (data.data) {
				emit('chat_read', data.data);
			}
			break;

		case 'user-base':
			if (data.data && data.data.base) {
				const incoming = data.data.base;
				const current = state.friend_base;
				// 刚本地改过备注/标签/名称时，避免迟到的 user-base 用旧值覆盖
				if (
					current
					&& current.friend
					&& incoming
					&& incoming.friend
					&& state._friend_edit_ts
					&& (Date.now() - state._friend_edit_ts < 5000)
				) {
					incoming.friend = {
						...incoming.friend,
						remark: current.friend.remark,
						label: normalize_label_list(current.friend.label),
						name: current.friend.name != null ? current.friend.name : incoming.friend.name,
					};
					if (current.user && incoming.user && current.user.name) {
						incoming.user = { ...incoming.user, name: current.user.name };
					}
				}
				chat_set_friend_base(incoming);
			}
			hydrate_work_label(data.data || data);
			emit('friend_base', state.friend_base);
			break;

		case 'record-history': {
			const active_now = active_contact_id();
			if (active_now <= 0) {
				break;
			}
			if (state.record_expect_contact > 0 && state.record_expect_contact != active_now) {
				break;
			}
			// 消费一条 history pending（若有）
			const hist_idx = state.record_pending.findIndex((row) => row && row.history);
			if (hist_idx >= 0) {
				const meta = state.record_pending.splice(hist_idx, 1)[0];
				const cid = parseInt((meta && meta.contact_id) || 0) || 0;
				if (cid > 0 && cid != active_now) {
					break;
				}
			}
			emit('record', {
				mode: 'history',
				record: (data.data && data.data.record) || null,
				base: (data.data && data.data.base) || null,
				contact_id: active_now,
			});
			break;
		}

		case 'record-search':
			emit('record_search', (data.data != null) ? data.data : {});
			break;

		case 'record-around':
			emit('record_around', (data.data != null) ? data.data : {});
			break;

		case 'queue-list':
		case 'queue_list':
			if (state.user_type == 'work') {
				const queue_payload = (data.data != null) ? data.data : data;
				apply_queue_list(queue_payload, true);
			}
			break;

		case 'queue-status':
			// 对齐 PC 咨询端：不展示访客排队位次提示；工作台本身忽略
			break;

		case 'user-history':
			if (data.data != null) {
				// 对齐 PC：搜索中忽略 history；seq 不一致丢弃
				if (String(state.friend_search.keyword || '').trim() !== '') {
					break;
				}
				const hist_seq = parseInt((data.data && data.data.seq) || 0) || 0;
				if (hist_seq > 0 && hist_seq !== state.friend_search.seq) {
					break;
				}
				const page = (data.data && data.data.page) || 1;
				const rows_raw = extract_array_rows(data.data);
				// 对齐 PC UserFriendView：空包直接忽略，不冲 success 列表
				if (!(rows_raw.length > 0)) {
					break;
				}
				const mapped = map_friend_list(data.data);
				if (page <= 1) {
					state.user_list = mapped;
				} else if (mapped.length > 0) {
					state.user_list = state.user_list.concat(mapped);
				}
				state.user_list_page = page;
				state.user_list_page_total = (data.data && data.data.page_total) || 0;
				emit('user_list', get_chat_state());
			}
			break;

		case 'user-search': {
			const search_data = (data.data != null) ? data.data : {};
			const search_seq = parseInt(search_data.seq || 0) || 0;
			if (search_seq > 0 && search_seq !== state.friend_search.seq) {
				break;
			}
			const input_kw = String(state.friend_search.keyword || '').trim();
			if (input_kw === '') {
				break;
			}
			const resp_kw = String(search_data.keywords || '').trim();
			if (resp_kw !== '' && resp_kw !== input_kw) {
				break;
			}
			const mapped = map_friend_list(search_data);
			state.user_list = mapped;
			state.user_list_page = 1;
			state.user_list_page_total = 1;
			emit('user_list', get_chat_state());
			emit('user_search', { keywords: resp_kw || input_kw, list: mapped, data: search_data });
			break;
		}

		case 'user-remark-edit':
			if (data.data && data.data.code == 0) {
				const base = { ...(state.friend_base || {}) };
				base.friend = { ...(base.friend || {}), remark: data.data.data || '' };
				chat_set_friend_base(base);
				showToast(data.data.msg || '修改成功');
			} else {
				showToast((data.data && data.data.msg) || '修改失败');
			}
			emit('user_remark_edit', data.data);
			break;

		case 'user-name-edit':
			if (data.data && data.data.code == 0) {
				const name = data.data.data || '';
				const base = { ...(state.friend_base || {}) };
				if (base.user) {
					base.user = { ...base.user, name };
				}
				if (base.friend) {
					base.friend = { ...base.friend, name };
				}
				chat_set_friend_base(base);
				if (state.receive_user) {
					state.receive_user = { ...state.receive_user, name };
					try {
						uni.setStorageSync(CACHE_RECEIVE_USER_KEY, state.receive_user);
					} catch (e) {}
				}
				const idx = state.user_list.findIndex((row) => row.id == (state.receive_user && state.receive_user.id));
				if (idx >= 0) {
					state.user_list[idx].name = name;
					emit('user_list', get_chat_state());
				}
				showToast(data.data.msg || '修改成功');
			} else {
				showToast((data.data && data.data.msg) || '修改失败');
			}
			emit('user_name_edit', data.data);
			break;

		case 'user-label-edit':
			if (data.data && data.data.code == 0) {
				const base = { ...(state.friend_base || {}) };
				base.friend = { ...(base.friend || {}), label: normalize_label_list(data.data.data) };
				chat_set_friend_base(base);
				showToast(data.data.msg || '修改成功');
			} else {
				showToast((data.data && data.data.msg) || '修改失败');
			}
			emit('user_label_edit', data.data);
			break;

		case 'friend-status':
			if (data.data && data.data.friend) {
				const friend = data.data.friend;
				const index = state.user_list.findIndex((row) => row.id == friend.id);
				if (index >= 0) {
					const fs_mode = ((state.ai_mode_map[friend.id] || {}).mode) || state.user_list[index].ai_mode || '';
					state.user_list[index].status = friend.status;
					state.user_list[index].ai_mode = fs_mode;
					state.user_list[index].receive_user = {
						...state.user_list[index].receive_user,
						...friend,
					};
					emit('user_list', get_chat_state());
				}
			}
			emit('friend_status', data.data);
			break;

		case 'friend-input-status': {
			const inner = (data.data != null) ? data.data : data;
			let msg = '';
			let friend = {};
			if (typeof inner == 'string') {
				msg = inner;
				friend = data.friend || {};
			} else if (inner && typeof inner == 'object') {
				if (typeof inner.msg == 'string') {
					msg = inner.msg;
				} else if (typeof inner.data == 'string') {
					msg = inner.data;
				}
				friend = inner.friend || data.friend || {};
			}
			emit('friend_input_status', { friend, msg });
			break;
		}

		case 'friend-leave-session':
			emit('friend_leave_session', data.data);
			break;

		case 'quick-message-add':
			if (data.data && data.data.code == 0 && data.data.data) {
				const row = data.data.data;
				const exists = state.quick_message.some((item) => String(item.id) == String(row.id));
				if (!exists) {
					state.quick_message = [{ id: row.id, content: String(row.content || '') }].concat(state.quick_message);
				}
				showToast(data.data.msg || '添加成功');
			} else {
				showToast((data.data && data.data.msg) || '添加失败');
			}
			emit('quick_message', state.quick_message);
			break;

		case 'quick-message-del':
			if (data.data && data.data.code == 0) {
				const del_id = data.data.data;
				state.quick_message = state.quick_message.filter((item) => String(item.id) != String(del_id));
				showToast(data.data.msg || '删除成功');
			} else {
				showToast((data.data && data.data.msg) || '删除失败');
			}
			emit('quick_message', state.quick_message);
			break;

		case 'auto-reply-config-save': {
			auto_reply_saving = false;
			const ar = data.data || {};
			if (ar.code == 0) {
				apply_auto_reply_config(ar.data || {});
				showToast(ar.msg || '保存成功');
				emit('auto_reply_save', { ok: true, data: state.auto_reply_config });
			} else {
				showToast(ar.msg || '保存失败');
				emit('auto_reply_save', { ok: false, msg: ar.msg || '保存失败' });
			}
			break;
		}

		case 'business':
			emit('business', (data.data && data.data) || null);
			break;

		case 'ai-status':
			if (data.data) {
				chat_apply_ai_mode(data.data, '');
				if (parseInt(data.data.is_enable || 0) != 1 || (data.data.mode || '') != 'ai') {
					chat_ai_set_waiting(parseInt(data.data.visitor_cuid || 0), false);
					emit('ai_thinking', { show: false, contact_id: data.data.visitor_cuid });
				}
			}
			if ((res.msg || data.msg || '') != '') {
				const tip = res.msg || data.msg;
				if (!is_session_end_continue_tip(tip) && !is_session_end_continue_tip({ data_type: 'mode_tip', content: tip })) {
					const vid = parseInt((data.data && data.data.visitor_cuid) || 0);
					if (state.user_type != 'work' || !vid || vid == active_contact_id()) {
						showToast(tip);
					}
				}
			}
			break;

		case 'ai-mode': {
			const mode_ai = data.ai || data.data || null;
			if (mode_ai) {
				chat_apply_ai_mode(mode_ai, res.msg || data.msg || '');
			}
			break;
		}

		case 'ai-thinking':
			if (data.data && parseInt(data.data.status || 0) == 1) {
				const think_id = parseInt(data.data.visitor_cuid || 0)
					|| (state.user_type == 'work' ? active_contact_id() : (parseInt(data.data.agent_cuid || 0) || active_contact_id()));
				chat_ai_set_waiting(think_id, true);
				if (think_id <= 0 || think_id == active_contact_id()) {
					emit('ai_thinking', {
						show: true,
						msg: data.data.msg || '智能客服正在回复',
						contact_id: think_id,
						user: chat_ai_bot_user(),
					});
				}
			} else {
				const think_end = parseInt((data.data && data.data.visitor_cuid) || 0)
					|| (state.user_type == 'work' ? active_contact_id() : (parseInt((data.data && data.data.agent_cuid) || 0) || active_contact_id()));
				chat_ai_set_waiting(think_end, false);
				emit('ai_thinking', { show: false, contact_id: think_end });
			}
			break;

		case 'ai-transfer': {
			const transfer_ai = data.ai || (data.data && data.data.ai) || { mode: 'human', show_transfer: 0 };
			if (data.data && data.data.visitor_cuid) {
				transfer_ai.visitor_cuid = data.data.visitor_cuid;
			}
			// 对齐 PC ChatWorkIsActiveVisitor(0)==true：本席主动接管时回包可能缺 visitor_cuid
			if (state.user_type == 'work' && !(parseInt(transfer_ai.visitor_cuid || 0) > 0)) {
				transfer_ai.visitor_cuid = active_contact_id();
			}
			if (data.data && data.data.user_list) {
				state.user_list = map_friend_list(data.data.user_list);
				emit('user_list', get_chat_state());
			}
			chat_apply_ai_mode(transfer_ai, '');
			chat_ai_set_waiting(parseInt(transfer_ai.visitor_cuid || 0), false);
			emit('ai_thinking', { show: false });
			if (state.ai_switching) {
				chat_ai_switch_unlock();
			}
			if (state.user_type == 'work' && (res.msg || data.msg)) {
				showToast(res.msg || data.msg);
			}
			break;
		}

		case 'ai-transfer-ai': {
			const back_ai = data.ai || (data.data && data.data.ai) || { mode: 'ai', show_transfer: 0, is_enable: 1 };
			if (data.data && data.data.visitor_cuid) {
				back_ai.visitor_cuid = data.data.visitor_cuid;
			}
			if (state.user_type == 'work' && !(parseInt(back_ai.visitor_cuid || 0) > 0)) {
				back_ai.visitor_cuid = active_contact_id();
			}
			if (data.data && data.data.user_list) {
				state.user_list = map_friend_list(data.data.user_list);
				emit('user_list', get_chat_state());
			}
			chat_apply_ai_mode(back_ai, '');
			chat_ai_set_waiting(parseInt(back_ai.visitor_cuid || 0), false);
			emit('ai_thinking', { show: false });
			if (state.user_type == 'work' && (res.msg || data.msg)) {
				showToast(res.msg || data.msg || '用户已切换为智能客服接待');
			}
			if (state.ai_switching) {
				chat_ai_switch_unlock();
			}
			break;
		}

		case 'agent-online-list': {
			const agents = ((data.data || {}).list) || [];
			state.agent_online_others = parseInt((data.data || {}).count || agents.length || 0);
			state.agent_online_list = agents.map((ag) => ({
				id: ag.id,
				name: ag.name || ('客服#' + ag.id),
				avatar: absolutize_url(ag.avatar || ''),
			}));
			emit('agent_online_list', {
				list: state.agent_online_list,
				count: state.agent_online_others,
			});
			emit('ai_mode', get_chat_state());
			// 对齐 PC：仅弹窗已开时才 toast（由页面根据 show_agent_transfer 决定）
			break;
		}

		case 'agent-online-count':
			if (state.user_type == 'work') {
				state.agent_online_others = parseInt((data.data && data.data.count) || 0);
				emit('ai_mode', get_chat_state());
			}
			break;

		case 'agent-transfer': {
			if (res.msg || data.msg) {
				showToast(res.msg || data.msg);
			}
			if (state.user_type == 'work') {
				const td = data.data || data || {};
				const prev_vid = active_contact_id();
				const transfer_vid = parseInt(td.visitor_cuid || 0);
				const recv_ai = data.ai || td.ai || null;
				if (transfer_vid > 0) {
					const human_ai = {
						...(recv_ai || {}),
						mode: 'human',
						show_transfer: 1,
						visitor_cuid: transfer_vid,
					};
					state.ai_mode_map[transfer_vid] = {
						...(state.ai_mode_map[transfer_vid] || {}),
						...human_ai,
					};
					patch_friend_ai_mode(transfer_vid, 'human');
					if (transfer_vid == prev_vid) {
						chat_apply_ai_mode(human_ai, '');
					}
				}
				if (td.user_list) {
					state.user_list = map_friend_list(td.user_list);
					if (transfer_vid > 0 && transfer_vid != prev_vid) {
						const idx = state.user_list.findIndex((row) => parseInt(row.id) == transfer_vid);
						if (idx >= 0) {
							const row = { ...state.user_list[idx] };
							const unread = Number(row.unread) || 0;
							row.unread = unread < 1 ? 1 : row.unread;
							state.user_list.splice(idx, 1, row);
						}
					}
					emit('user_list', get_chat_state());
				}
				emit_ai_and_list();
			}
			break;
		}

		case 'chat-end': {
			// 对齐 PC：整段逻辑包在 content != null 内
			if ((data.content || null) == null) {
				break;
			}
			const end_active = active_contact_id();
			const end_list = state.user_type == 'work'
				? parseInt((data.data && data.data.visitor_cuid) || 0)
				: parseInt((data.data && data.data.agent_cuid) || 0);
			// 咨询端：以当前 receive_user 为准，避免 agent_cuid 不一致导致结束态丢失
			let end_id = end_list > 0 ? end_list : end_active;
			if (state.user_type == 'user' && end_active > 0) {
				end_id = end_active;
			}
			const revive_vid = end_id > 0 ? end_id : end_active;
			if (chat_session_revive_inflight(revive_vid)) {
				break;
			}
			if (end_id > 0) {
				chat_session_ended_set(end_id, true);
				// 对齐 PC：新一轮结束允许再次评价（按联系人清 rated）
				chat_session_rated_set(end_id, false);
				if (state.ai_mode_map[end_id]) {
					state.ai_mode_map[end_id].is_chat_ended = 1;
				}
			} else if (end_active > 0) {
				chat_session_ended_set(end_active, true);
				chat_session_rated_set(end_active, false);
				if (state.ai_mode_map[end_active]) {
					state.ai_mode_map[end_active].is_chat_ended = 1;
				}
			}
			// 咨询端自动续聊：结束/恢复类提示不在聊天区重复展示
			const show_end_tip = (end_list <= 0 || end_active <= 0 || end_list == end_active || end_id == end_active)
				&& !(data.content != null && is_session_end_continue_tip(data.content));
			if (show_end_tip) {
				emit('chat', {
					content: data.content,
					is_mode_tip: true,
					is_active: true,
					data: data.data || {},
				});
			}
			emit('ai_mode', get_chat_state());
			break;
		}

		// 对齐 PC：撤回同步 → 原消息变提示，引用块改「引用内容已撤回」
		case 'chat-recall': {
			const rd = data.data || {};
			const record_id = parseInt(rd.record_id || 0) || 0;
			if (!(record_id > 0)) {
				break;
			}
			const active_id = active_contact_id();
			const me_id = state.current_user && state.current_user.id
				? parseInt(state.current_user.id)
				: 0;
			const send_cuid = parseInt(rd.send_cuid || 0) || 0;
			const receive_cuid = parseInt(rd.receive_cuid || 0) || 0;
			// 对齐 PC related：当前会话联系人是发送方或接收方
			const related = active_id > 0 && (active_id == send_cuid || active_id == receive_cuid);
			const self_involved = me_id > 0 && (me_id == send_cuid || me_id == receive_cuid) && active_id > 0;
			const is_active = !!(related || self_involved);
			emit('chat_recall', {
				record_id,
				content: data.content || { data_type: 'recall', content: '撤回了一条消息' },
				send_cuid,
				receive_cuid,
				is_active,
				data: rd,
			});
			// 列表预览：当前会话由聊天页按记录重算；其它会话回退到上一条
			const list_id = state.user_type == 'work'
				? (send_cuid == me_id ? receive_cuid : send_cuid)
				: (receive_cuid == me_id ? send_cuid : receive_cuid);
			if (list_id > 0 && list_id != active_id) {
				revert_friend_preview(list_id, data.content || { data_type: 'text', content: '' });
			}
			break;
		}

		case 'chat-continue': {
			const cont_list = state.user_type == 'work'
				? parseInt((data.data && data.data.visitor_cuid) || 0)
				: parseInt((data.data && data.data.agent_cuid) || 0);
			const cont_active = active_contact_id();
			const cont_id = cont_list > 0 ? cont_list : cont_active;
			const cont_vid = cont_id || cont_active;
			if (cont_id > 0) {
				chat_session_ended_set(cont_id, false);
				// 对齐 PC：继续聊天后本轮评价作废
				chat_session_rated_set(cont_id, false);
				if (state.ai_mode_map[cont_id]) {
					state.ai_mode_map[cont_id].is_chat_ended = 0;
				}
			} else if (cont_active > 0) {
				chat_session_ended_set(cont_active, false);
				chat_session_rated_set(cont_active, false);
				if (state.ai_mode_map[cont_active]) {
					state.ai_mode_map[cont_active].is_chat_ended = 0;
				}
			}
			// 进页静默续聊无排队消息时也会清 inflight；先开忽略窗挡住迟到 chat-end
			arm_continue_end_ignore(cont_vid, 8000);
			if (cont_list <= 0 || cont_active <= 0 || cont_list == cont_active) {
				if (state.user_type == 'user') {
					emit('chat_rating_close', { contact_id: cont_vid });
				}
			}
			// 咨询端续聊 = 新一轮会话：已开启智能客服时强制从 AI 开始（不延续上一轮人工）
			if (state.user_type == 'user' && cont_vid > 0) {
				const cont_ai = data.ai || (data.data && data.data.ai) || {};
				const snap = active_ai_snapshot();
				const enable = parseInt(
					(cont_ai.is_enable != null ? cont_ai.is_enable : snap.is_enable) || 0
				) == 1;
				const prev_mode = String(snap.mode || state.ai_state.mode || cont_ai.mode || '');
				if (enable) {
					chat_apply_ai_mode({
						...snap,
						...cont_ai,
						mode: 'ai',
						is_enable: 1,
						is_chat_ended: 0,
						show_transfer: cont_ai.show_transfer != null ? cont_ai.show_transfer : 1,
						visitor_cuid: cont_vid,
					}, '');
					state.ai_mode_map[cont_vid] = {
						...(state.ai_mode_map[cont_vid] || {}),
						mode: 'ai',
						is_enable: 1,
						is_chat_ended: 0,
					};
					// 上一轮是人工：通知服务端转智能客服，避免只改了本地 UI
					if (prev_mode == 'human' && state.connect_status === 1 && state.receive_user && state.receive_user.id) {
						chat_send('transfer-ai');
					}
				} else {
					emit('ai_mode', get_chat_state());
				}
			} else {
				emit('ai_mode', get_chat_state());
			}
			flush_pending_send_after_continue(cont_vid);
			break;
		}

		// 对齐 PC：打开评价仅咨询端
		case 'chat-rating-open': {
			if (state.user_type == 'user' && chat_can_rating()) {
				chat_try_open_rating(data.data || {});
			}
			break;
		}

		// 对齐 PC：评价结果仅咨询端关窗 / 记 rated（按 agent_cuid）
		case 'chat-rating': {
			const rate_msg = res.msg || data.msg || '';
			if (rate_msg != '') {
				showToast(rate_msg);
			}
			const rated_aid = parseInt((data.data && data.data.agent_cuid) || 0) || active_contact_id();
			if (rated_aid > 0) {
				chat_session_rated_set(rated_aid, true);
			}
			emit('chat_rating', {
				...(data.data || {}),
				contact_id: rated_aid,
				msg: rate_msg,
			});
			break;
		}

		default:
			// 未知包不再猜测 queue（对齐 PC）
			emit(type, data);
			break;
	}
};

const bind_socket_events = (task, ping_seconds, gen) => {
	task.onOpen(() => {
		if (gen != state.socket_gen) {
			return;
		}
		console.log('[chat_socket] open', state.ws_url);
		state.socket_opened = true;
		state._open_ts = Date.now();
		state.reconnect_count = 0;
		clear_reconnect();
	});
	task.onMessage((res) => {
		if (gen != state.socket_gen) {
			return;
		}
		handle_message(res.data);
	});
	task.onClose(() => {
		if (gen != state.socket_gen) {
			return;
		}
		console.log('[chat_socket] close');
		state.socket_opened = false;
		state._open_ts = 0;
		// 主动换连时忽略本次 close，避免误触发重连 loading
		if (state._expect_close) {
			state._expect_close = false;
			return;
		}
		state.connect_status = 0;
		state.online_status = 'off';
		clear_ping();
		// 对齐 PC：断开时 HTTP EventHandle('off')
		if (!state.manual_close) {
			chat_event_http('off');
		}
		emit('close', get_chat_state());
		if (!state.manual_close) {
			start_fail_reconnect();
		} else {
			set_connecting(false);
		}
	});
	task.onError(() => {
		if (gen != state.socket_gen) {
			return;
		}
		console.log('[chat_socket] error');
		state.error_msg = '连接失败';
		state.connect_status = 0;
		state.online_status = 'off';
		state.socket_opened = false;
		state._open_ts = 0;
		clear_ping();
		emit('error', { msg: state.error_msg, is_connecting: state.is_connecting });
		if (!state.manual_close && !state._expect_close) {
			start_fail_reconnect();
		}
	});
	// ping 在 success 后启动；此处保留参数供后续
	state._ping_seconds = ping_seconds;
};

const connect_once = () => {
	const params = get_connect_params();
	if (params.error) {
		state.error_msg = params.error;
		set_connecting(false);
		emit('error', { msg: params.error });
		showToast(params.error);
		return false;
	}
	// 已 open 且在等业务 success：短时间内不拆；回前台半开超过 5s 必须重连，否则输入框一直「未连接」
	if (state.socket_task && state.socket_opened && state.connect_status !== 1) {
		const opened_at = Number(state._open_ts || 0);
		if (opened_at > 0 && (Date.now() - opened_at) < 5000) {
			chat_log('skip reconnect, waiting success');
			return true;
		}
	}
	state.manual_close = false;
	state.ws_url = params.url;
	chat_log('connecting', params.url);
	try {
		state.socket_gen = Number(state.socket_gen || 0) + 1;
		const gen = state.socket_gen;
		if (state.socket_task) {
			try {
				state._expect_close = true;
				state.socket_task.close({});
			} catch (err) {
				state._expect_close = false;
			}
			state.socket_task = null;
			state.socket_opened = false;
		}
		const task = uni.connectSocket({
			url: params.url,
			complete: () => {},
		});
		state.socket_task = task;
		bind_socket_events(task, params.ping, gen);
		return true;
	} catch (err) {
		console.error('[chat_socket] connect fail', err);
		state.error_msg = '服务器连接失败';
		set_connecting(false);
		emit('error', { msg: state.error_msg });
		return false;
	}
};

const start_fail_reconnect = () => {
	if (state.reconnect_timer) {
		return;
	}
	state.reconnect_count = 0;
	state.error_msg = '连接失败';
	set_connecting(false);
	emit('error', { msg: state.error_msg });
	connect_once();
	state.reconnect_timer = setInterval(() => {
		state.reconnect_count += 1;
		if (state.reconnect_count >= 150) {
			clear_reconnect();
			state.error_msg = '连接失败';
			set_connecting(false);
			emit('error', { msg: state.error_msg });
			return;
		}
		if (state.connect_status === 1) {
			clear_reconnect();
			set_connecting(false);
			return;
		}
		connect_once();
	}, 2000);
};

const reuse_ready_connection = () => {
	if (!(state.connect_status === 1 && state.socket_task)) {
		return false;
	}
	const params = get_connect_params();
	if (params.url && state.ws_url && params.url != state.ws_url) {
		chat_log('ws url mismatch, reconnect', { old: state.ws_url, next: params.url });
		chat_force_reconnect_reset();
		return false;
	}
	const need_reauth = !chat_identity_matches_login();
	const need_queue_retry = state.user_type == 'work'
		&& !state._queue_from_server
		&& !(state.queue_list && state.queue_list.length)
		&& !state._did_queue_reconnect;
	if (need_reauth || need_queue_retry) {
		if (need_queue_retry && !need_reauth) {
			state._did_queue_reconnect = true;
		}
		chat_log('reconnect', need_reauth ? 'identity mismatch' : 'queue retry');
		chat_force_reconnect_reset();
		return false;
	}
	set_connecting(false);
	if (state.user_type == 'work') {
		emit('queue_list', get_chat_state());
	}
	emit('success', get_chat_state());
	emit('user_list', get_chat_state());
	emit('quick_message', state.quick_message);
	emit('work_label', state.work_label);
	return true;
};

const start_connect_loop = () => {
	if (reuse_ready_connection()) {
		return;
	}
	set_connecting(true);
	state.error_msg = '';
	clear_reconnect();
	connect_once();

	const timeout_sec = Math.max(5, Number(runtime_config.connect_timeout || 30));
	if (state.connect_status !== 1 && !state.connect_timer) {
		let total = 0;
		state.connect_timer = setInterval(() => {
			total += 1;
			if (total >= timeout_sec) {
				clearInterval(state.connect_timer);
				state.connect_timer = null;
				if (state.connect_status !== 1) {
					state.error_msg = '连接失败';
					set_connecting(false);
					emit('error', { msg: state.error_msg, timeout: true });
					start_fail_reconnect();
				}
				return;
			}
			if (state.connect_status === 1) {
				clearInterval(state.connect_timer);
				state.connect_timer = null;
				set_connecting(false);
				return;
			}
			chat_log('connect retry', total);
			connect_once();
		}, 1000);
	}
};

/**
 * 连接客服 WebSocket
 * @param {object} options
 * @param {string} options.user_type work|user
 * 其余字段同 chat_set_config（request_url / ws_host / ws_port / is_wss / ping / debug ...）
 */
export const chat_connect = (options = {}) => {
	const { user_type, ...cfg } = options || {};
	if (cfg && Object.keys(cfg).length > 0) {
		chat_set_config(cfg);
	}
	state.user_type = user_type || state.user_type || 'work';
	if (state.user_type == 'work' && state.connect_status !== 1) {
		chat_apply_features({
			is_chat_end: runtime_config.is_chat_end,
			is_chat_rating: runtime_config.is_chat_rating,
			is_chat_queue: runtime_config.is_chat_queue,
			is_offline_auto_reply: runtime_config.is_offline_auto_reply,
			is_quick_message: runtime_config.is_quick_message,
		});
	}
	set_connecting(true);
	apply_work_connect_config();
	start_connect_loop();
	return true;
};

/** 从相册/文件管理器/后台回到前台时静默续连；已连上只 ping，绝不拆掉正在用的连接 */
export const chat_resume_connect = () => {
	if (state.connect_status === 1 && state.socket_task) {
		if (socket_is_stale_dead()) {
			socket_kick_stale('resume-stale');
			return;
		}
		chat_send('ping');
		emit('status', get_chat_state());
		return;
	}
	apply_work_connect_config();
	if (reuse_ready_connection()) {
		return;
	}
	if (state.socket_task && state.socket_opened && state.connect_status !== 1) {
		const opened_at = Number(state._open_ts || 0);
		if (opened_at > 0 && (Date.now() - opened_at) < 5000) {
			emit('status', get_chat_state());
			return;
		}
	}
	if (state.reconnect_timer) {
		emit('status', get_chat_state());
		return;
	}
	connect_once();
	emit('status', get_chat_state());
	if (state.connect_status === 1 || state.reconnect_timer) {
		return;
	}
	state.reconnect_count = 0;
	state.reconnect_timer = setInterval(() => {
		state.reconnect_count += 1;
		if (state.reconnect_count >= 150 || state.connect_status === 1) {
			clear_reconnect();
			return;
		}
		connect_once();
	}, 2000);
};

export const chat_disconnect = () => {
	state.manual_close = true;
	clear_ping();
	clear_reconnect();
	// 对齐 PC：主动断开前标记离线
	chat_event_http('off');
	if (state.socket_task) {
		try {
			state.socket_task.close({});
		} catch (err) {}
		state.socket_task = null;
	}
	state.connect_status = 0;
	state.online_status = 'off';
	state.socket_opened = false;
	set_connecting(false);
	emit('close', get_chat_state());
};

export const chat_set_receive_user = (user) => {
	state.receive_user = user || null;
	try {
		if (user) {
			uni.setStorageSync(CACHE_RECEIVE_USER_KEY, user);
		} else {
			uni.removeStorageSync(CACHE_RECEIVE_USER_KEY);
			chat_set_friend_base(null);
		}
	} catch (err) {}
	const vid = parseInt((user && user.id) || 0);
	if (vid > 0) {
		const row = state.user_list.find((item) => parseInt(item.id) == vid);
		const cached = state.ai_mode_map[vid] || {};
		// 从列表进入时带上会话 AI 态，便于立刻露出「接管人工」
		if (row && row.ai_mode) {
			state.ai_mode_map[vid] = { ...cached, mode: row.ai_mode, visitor_cuid: vid };
		}
		if (state.ai_mode_map[vid]) {
			state.ai_state = { ...state.ai_state, ...state.ai_mode_map[vid], visitor_cuid: vid };
		} else {
			state.ai_state = { ...state.ai_state, visitor_cuid: vid };
		}
	}
	emit('ai_mode', get_chat_state());
};

export const chat_get_receive_user_cache = () => {
	try {
		return uni.getStorageSync(CACHE_RECEIVE_USER_KEY) || null;
	} catch (err) {
		return null;
	}
};

export const chat_set_friend_base = (base) => {
	if (base && base.friend) {
		base = {
			...base,
			friend: {
				...base.friend,
				label: normalize_label_list(base.friend.label),
			},
		};
	}
	state.friend_base = base || null;
	try {
		if (base) {
			uni.setStorageSync(CACHE_FRIEND_BASE_KEY, base);
		} else {
			uni.removeStorageSync(CACHE_FRIEND_BASE_KEY);
		}
	} catch (err) {}
	emit('friend_base', state.friend_base);
};

export const chat_get_friend_base = () => {
	let base = state.friend_base;
	if (!base) {
		try {
			base = uni.getStorageSync(CACHE_FRIEND_BASE_KEY) || null;
			if (base) {
				state.friend_base = base;
			}
		} catch (err) {
			base = null;
		}
	}
	if (base && base.friend && !Array.isArray(base.friend.label)) {
		base = {
			...base,
			friend: {
				...base.friend,
				label: normalize_label_list(base.friend.label),
			},
		};
		state.friend_base = base;
	}
	return base;
};

/** 修改备注（对齐 PC user-remark-edit） */
export const chat_edit_user_remark = (remark) => {
	state._friend_edit_ts = Date.now();
	return chat_send('user-remark-edit', { data: remark || '' });
};

/** 修改显示名（对齐 PC user-name-edit） */
export const chat_edit_user_name = (name) => {
	state._friend_edit_ts = Date.now();
	return chat_send('user-name-edit', { data: name || '' });
};

/** 修改标签（对齐 PC user-label-edit） */
export const chat_edit_user_label = (label_list) => {
	state._friend_edit_ts = Date.now();
	return chat_send('user-label-edit', { data: label_list || [] });
};

export const chat_load_record = () => {
	if (!state.receive_user || !state.receive_user.id) {
		return false;
	}
	const contact_id = parseInt(state.receive_user.id) || 0;
	state.record_req_id += 1;
	state.record_expect_contact = contact_id;
	state.record_pending = [{ id: state.record_req_id, contact_id }];
	return chat_send('record');
};

export const chat_load_record_history = (min_record_id) => {
	if (isEmpty(min_record_id)) {
		return false;
	}
	const contact_id = active_contact_id();
	state.record_req_id += 1;
	state.record_expect_contact = contact_id;
	state.record_pending.push({ id: state.record_req_id, contact_id, history: 1 });
	return chat_send('record-history', { data: min_record_id });
};

export const chat_load_user_history = (page = 1, opts = {}) => {
	const seq = (opts && opts.seq != null) ? parseInt(opts.seq) || 0 : (state.friend_search.seq || 0);
	return chat_send('user-history', { data: { page: parseInt(page || 1) || 1, seq } });
};

/**
 * 对齐 PC ChatFriendSearchRequest：联系人搜索（咨询端 / 工作台）
 */
export const chat_search_users = (keywords = '') => {
	const kw = String(keywords || '').trim();
	if (kw !== '' && state.connect_status !== 1) {
		showToast('请先连接后再搜索');
		return false;
	}
	state.friend_search.keyword = kw;
	state.friend_search.seq += 1;
	const seq = state.friend_search.seq;
	if (kw === '') {
		return chat_load_user_history(1, { seq });
	}
	return chat_send('user-search', { data: { keywords: kw, seq } });
};

/** 对齐 PC ChatCanSearchRecord */
export const chat_can_search_record = () => {
	const feat = state.chat_features || {};
	let search_on = parseInt(feat.is_chat_record_search || 0) == 1;
	if (!search_on) {
		search_on = parseInt(runtime_config.is_chat_record_search || 0) == 1;
	}
	if (!search_on) {
		return false;
	}
	if (state.user_type == 'user') {
		if (parseInt(feat.is_chat_record_search_user || 0) == 1) {
			return true;
		}
		return parseInt(runtime_config.is_chat_record_search_user || 0) == 1;
	}
	return true;
};

/** 对齐 PC ChatMsgSearchRequest */
export const chat_search_record = (keywords = '') => {
	if (!chat_can_search_record()) {
		return false;
	}
	const kw = String(keywords || '').trim();
	if (kw === '') {
		emit('record_search', { keywords: '', list: [] });
		return true;
	}
	if (!state.receive_user || !state.receive_user.id) {
		showToast(state.user_type == 'work' ? '请先选择联系人' : '请先进入会话');
		return false;
	}
	if (state.connect_status !== 1) {
		showToast('请先上线后再搜索');
		return false;
	}
	return chat_send('record-search', { data: { keywords: kw } });
};

/** 对齐 PC：定位未加载的命中消息 */
export const chat_load_record_around = (around_id) => {
	const rid = parseInt(around_id || 0) || 0;
	if (!(rid > 0)) {
		return false;
	}
	if (state.connect_status !== 1) {
		return false;
	}
	return chat_send('record-around', { data: { around_id: rid } });
};

/** 对齐 PC ChatCanUseTool */
export const chat_can_use_tool = (tool) => {
	const key = String(tool || '');
	if (!key) {
		return false;
	}
	const feat = state.chat_features || {};
	if (parseInt(feat['is_chat_tool_' + key] || 0) != 1) {
		return false;
	}
	if (state.user_type == 'user') {
		return parseInt(feat['is_chat_tool_' + key + '_user'] || 0) == 1;
	}
	return true;
};

/** 对齐 PC ChatVoiceMarkPlayed：播放后标 played:1 */
export const chat_voice_mark_played = (record_id) => {
	const rid = parseInt(record_id || 0) || 0;
	if (!(rid > 0) || state.connect_status !== 1) {
		return false;
	}
	return chat_send('read', { data: { record_id: rid, played: 1 } });
};

export const chat_set_status = (status = 'online') => {
	return chat_send('status', { data: status });
};

/** 拉取当前会话用户基础信息（对齐 PC user-base） */
export const chat_load_user_base = () => {
	if (!state.receive_user || !state.receive_user.id) {
		return false;
	}
	return chat_send('user-base');
};

/** 离开当前会话（对齐 PC friend-leave-session） */
export const chat_leave_session = () => {
	return chat_send('friend-leave-session');
};

/** 发送输入状态（对齐 PC ChatPushInputStatus：需开启 is-input-status） */
export const chat_send_input_status = (msg = '') => {
	if (!chat_can_input_status()) {
		return false;
	}
	if (state.connect_status !== 1) {
		return false;
	}
	if (active_ai_snapshot().mode == 'ai') {
		return false;
	}
	if (!state.receive_user || !state.receive_user.id) {
		return false;
	}
	return chat_send('friend-input-status', { data: msg || '' });
};

/** 对齐 PC data-is-input-status */
export const chat_can_input_status = () => {
	const feat = state.chat_features || {};
	if (feat.is_input_status != null && feat.is_input_status !== '') {
		return parseInt(feat.is_input_status || 0) == 1;
	}
	return parseInt(runtime_config.is_input_status || 0) == 1;
};

/** 对齐 PC data-is-user-input-message：工作台是否展示输入正文 */
export const chat_can_show_input_message = () => {
	if (state.user_type != 'work') {
		return false;
	}
	const feat = state.chat_features || {};
	if (feat.is_user_input_message != null && feat.is_user_input_message !== '') {
		return parseInt(feat.is_user_input_message || 0) == 1;
	}
	return parseInt(runtime_config.is_user_input_message || 0) == 1;
};

/** 添加快捷消息（对齐 PC quick-message-add） */
export const chat_quick_message_add = (content) => {
	const text = String(content || '').trim();
	if (isEmpty(text)) {
		showToast('请先输入内容');
		return false;
	}
	return chat_send('quick-message-add', { data: text });
};

/** 删除快捷消息（对齐 PC quick-message-del） */
export const chat_quick_message_del = (id) => {
	if (isEmpty(id)) {
		return false;
	}
	return chat_send('quick-message-del', { data: id });
};

/** 保存工作台离线/超时自动回复（对齐 PC auto-reply-config-save） */
export const chat_save_auto_reply_config = (cfg = {}) => {
	if (state.connect_status !== 1) {
		showToast('未连接');
		return false;
	}
	if (parseInt((state.chat_features || {}).is_offline_auto_reply || 0) != 1) {
		showToast('后台未开启离线自动回复');
		return false;
	}
	auto_reply_saving = true;
	const ok = chat_send('auto-reply-config-save', {
		data: {
			offline_message: String(cfg.offline_message || '').trim(),
			timeout_seconds: parseInt(cfg.timeout_seconds || 0) || 0,
			timeout_message: String(cfg.timeout_message || '').trim(),
		},
	});
	if (!ok) {
		auto_reply_saving = false;
	}
	return ok;
};

/** 拉取商品业务卡片（对齐 PC business） */
export const chat_load_business_goods = (goods_ids = []) => {
	const ids = (goods_ids || []).map((id) => Number(id)).filter((id) => id > 0);
	if (ids.length === 0) {
		return false;
	}
	return chat_send('business', { data: { goods: ids } });
};

/** 对齐 PC MsgPlainTextHandle：发送前净化文本（无 filterXSS 时做轻量剥离） */
export const msg_plain_text_handle = (msg) => {
	msg = msg == null ? '' : String(msg);
	msg = msg.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	msg = msg.replace(/<\s*br\s*\/?\s*>/gi, '\n');
	msg = msg.replace(/&lt;\s*br\s*\/?\s*&gt;/gi, '\n');
	msg = msg.replace(/<\s*\/\s*p\s*>/gi, '\n');
	msg = msg.replace(/&lt;\s*\/\s*p\s*&gt;/gi, '\n');
	const nl = '{{CHAT_NL}}';
	msg = msg.split('\n').join(nl);
	msg = msg.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
	msg = msg.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
	msg = msg.replace(/<[^>]+>/g, '');
	msg = String(msg || '').split(nl).join('\n');
	msg = msg
		.replace(/&nbsp;/gi, ' ')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&amp;/gi, '&')
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'");
	msg = msg.replace(/<\s*br\s*\/?\s*>/gi, '\n');
	return msg.replace(/\n{3,}/g, '\n\n').trim();
};

/**
 * 发送聊天消息（对齐 PC SendMessage）
 * content: { data_type: 'text'|'images'|'video', content?: string, url?: string, quote?: object }
 */
export const chat_send_message = (content) => {
	if (state.connect_status !== 1) {
		showToast('发送失败');
		return false;
	}
	if (state.online_status != 'online') {
		showToast('您已离线');
		return false;
	}
	if (!state.receive_user || !state.receive_user.id) {
		showToast('请先选择会话用户');
		return false;
	}
	const vid = active_contact_id();
	if (state.user_type == 'work' && active_ai_snapshot().mode == 'ai') {
		showToast('用户当前由智能客服接待，请先点击「接管人工」后再发送');
		return false;
	}
	if (!content || !content.data_type) {
		showToast('消息数据有误');
		return false;
	}
	const tool_key = (content.data_type == 'audio' && parseInt(content.voice || 0) == 1)
		? 'voice'
		: content.data_type;
	if (['emoji', 'images', 'video', 'audio', 'voice', 'file'].indexOf(tool_key) >= 0) {
		if (!chat_can_use_tool(tool_key)) {
			showToast('后台未开启该功能');
			return false;
		}
	}
	if (content.data_type == 'text') {
		const text = msg_plain_text_handle(content.content);
		if (isEmpty(text)) {
			showToast('请输入内容');
			return false;
		}
		content = { ...content, content: text };
	}
	if ((content.data_type == 'images' || content.data_type == 'video' || content.data_type == 'audio' || content.data_type == 'file') && isEmpty(content.url)) {
		showToast('附件数据有误');
		return false;
	}
	if (vid > 0 && parseInt(state.session_ended_map[vid] || 0) == 1) {
		const queued = {
			id: ++pending_send_seq,
			content: clone_send_content(content),
			contact_id: vid,
		};
		pending_send_after_continue.push(queued);
		if (chat_continue_session()) {
			return 'queued';
		}
		pending_send_after_continue = pending_send_after_continue.filter((item) => item.id !== queued.id);
		if (parseInt(state.session_ended_map[vid] || 0) == 1) {
			// 结束态由页内「是否继续」弹窗处理，不重复 toast
			return false;
		}
	}
	const ok = chat_send('chat', { content });
	if (ok && state.receive_user) {
		update_friend_preview(state.receive_user.id, content, '', 0);
		// 对齐 PC SendMessage：标已读 + 作废进行中的 record 快照 + 清输入状态
		chat_mark_active_conversation_read(true);
		chat_invalidate_record_snapshot();
		chat_send_input_status('');
	}
	return ok;
};

export const chat_work_active_ai_mode = () => active_ai_snapshot().mode;

export const chat_transfer_human = () => {
	if (state.connect_status !== 1) {
		showToast('未连接');
		return false;
	}
	if (!state.receive_user || !state.receive_user.id) {
		showToast('请先选择要接管的用户');
		return false;
	}
	if (state.ai_switching) {
		return false;
	}
	chat_ai_switch_lock();
	const ok = chat_send('transfer-human');
	if (!ok) {
		chat_ai_switch_unlock();
	}
	return ok;
};

export const chat_transfer_ai = () => {
	if (state.connect_status !== 1) {
		showToast('未连接');
		return false;
	}
	if (parseInt(active_ai_snapshot().is_enable || 0) != 1) {
		showToast('未开启智能客服');
		return false;
	}
	if (!state.receive_user || !state.receive_user.id) {
		showToast(state.user_type == 'user' ? '当前会话无效' : '请先选择要交回的用户');
		return false;
	}
	if (state.ai_switching) {
		return false;
	}
	chat_ai_switch_lock();
	const ok = chat_send('transfer-ai');
	if (!ok) {
		chat_ai_switch_unlock();
	}
	return ok;
};

export const chat_load_agent_online_list = () => {
	if (state.connect_status !== 1) {
		showToast('未连接');
		return false;
	}
	if (active_ai_snapshot().mode == 'ai') {
		showToast('用户当前由智能客服接待，请先接管人工后再转接');
		return false;
	}
	if (parseInt(state.agent_online_others || 0) <= 0) {
		showToast('当前没有其他在线客服可转接');
		return false;
	}
	if (!state.receive_user || !state.receive_user.id) {
		showToast('请先选择用户');
		return false;
	}
	return chat_send('agent-online-list');
};

export const chat_transfer_agent = (target_cuid) => {
	const tid = parseInt(target_cuid || 0);
	if (!(tid > 0)) {
		return false;
	}
	return chat_send('transfer-agent', { data: { target_cuid: tid } });
};

export const chat_upsert_queue_visitor = (row = {}) => {
	const vid = parseInt(row.visitor_cuid || row.id || 0) || 0;
	if (!(vid > 0)) {
		return null;
	}
	const exists = state.user_list.find((item) => parseInt(item.id) == vid);
	if (exists) {
		return exists;
	}
	upsert_friend_item({
		data: [{
			receive_user: {
				id: vid,
				name: row.name || ('访客' + vid),
				avatar: row.avatar || '',
				status: 1,
			},
			content: row.preview || '',
			time: '',
			unread_count: 0,
		}],
	});
	return state.user_list.find((item) => parseInt(item.id) == vid) || null;
};

/** 对齐 PC ChatCanEnd：工作台看 is_chat_end */
export const chat_can_end = () => {
	const feat = state.chat_features || {};
	if (parseInt(feat.is_chat_end || 0) != 1) {
		return false;
	}
	if (state.user_type == 'user') {
		return parseInt(feat.is_chat_end_user || 0) == 1;
	}
	return true;
};

/** 对齐 PC .chat-end-btn：结束当前会话（不弹评价，评价仅咨询端） */
export const chat_end_session = () => {
	if (state.connect_status !== 1) {
		showToast('未连接');
		return false;
	}
	if (!chat_can_end()) {
		showToast('未开启结束对话');
		return false;
	}
	if (!state.receive_user || !state.receive_user.id) {
		showToast('请先选择对话对象');
		return false;
	}
	const vid = active_contact_id();
	if (vid > 0 && parseInt(state.session_ended_map[vid] || 0) == 1) {
		return false;
	}
	if (vid > 0) {
		chat_session_ended_set(vid, true);
		chat_session_rated_set(vid, false);
		if (state.ai_mode_map[vid]) {
			state.ai_mode_map[vid].is_chat_ended = 1;
		}
		emit('ai_mode', get_chat_state());
	}
	const ok = chat_send('chat-end');
	if (!ok && vid > 0) {
		chat_session_ended_set(vid, false);
		if (state.ai_mode_map[vid]) {
			state.ai_mode_map[vid].is_chat_ended = 0;
		}
		emit('ai_mode', get_chat_state());
	}
	return ok;
};

/** 对齐 PC：只发 chat-continue，等回包再解除结束态 */
export const chat_continue_session = (opts = {}) => {
	const silent = !!(opts && opts.silent);
	if (state.connect_status !== 1) {
		if (!silent) {
			showToast('未连接');
		}
		return false;
	}
	if (!state.receive_user || !state.receive_user.id) {
		if (!silent) {
			showToast('请先选择对话对象');
		}
		return false;
	}
	const vid = active_contact_id();
	// 对齐 PC：未结束不发 chat-continue
	if (!(vid > 0) || parseInt(state.session_ended_map[vid] || 0) != 1) {
		return false;
	}
	if (continue_inflight[vid]) {
		return true;
	}
	const ok = chat_send('chat-continue');
	if (ok) {
		continue_inflight[vid] = 1;
	}
	return ok;
};

/** 对齐 PC ChatCanShowReadStatus：工作台看总开关 is_chat_read */
export const chat_can_show_read = () => {
	const feat = state.chat_features || {};
	if (parseInt(feat.is_chat_read || 0) != 1) {
		return false;
	}
	if (state.user_type == 'user') {
		return parseInt(feat.is_chat_read_user || 0) == 1;
	}
	return true;
};

/** 对齐 PC ChatQuickMessageUiSync */
export const chat_can_quick_message = () => {
	if (state.user_type != 'work') {
		return false;
	}
	return parseInt((state.chat_features || {}).is_quick_message || 0) == 1;
};

/** 对齐 PC ChatGoodsRecommendUiSync */
export const chat_can_goods_recommend = () => {
	if (state.user_type != 'work') {
		return false;
	}
	return parseInt((state.chat_features || {}).is_goods_recommend || 0) == 1;
};

/** 对齐 PC ChatCanRecall：工作台看总开关 */
export const chat_can_recall = () => {
	const feat = state.chat_features || {};
	if (parseInt(feat.is_chat_recall || 0) != 1) {
		return false;
	}
	if (state.user_type == 'user') {
		return parseInt(feat.is_chat_recall_user || 0) == 1;
	}
	return true;
};

/** 对齐 PC ChatRecallStillValid */
export const chat_recall_still_valid = (add_time) => {
	const ts = parseInt(add_time || 0) || 0;
	if (!(ts > 0)) {
		return true;
	}
	const feat = state.chat_features || {};
	const limit = parseInt(feat.recall_seconds || 120) || 120;
	return (Math.floor(Date.now() / 1000) - ts) <= limit;
};

export const chat_recall_seconds = () => {
	const feat = state.chat_features || {};
	return parseInt(feat.recall_seconds || 120) || 120;
};

/** 对齐 PC：发送撤回 */
export const chat_recall_message = (record_id) => {
	const rid = parseInt(record_id || 0) || 0;
	if (!(rid > 0)) {
		showToast('消息尚未同步，请稍后再试');
		return false;
	}
	if (!chat_can_recall()) {
		showToast('未开启消息撤回');
		return false;
	}
	return chat_send('chat-recall', { data: { record_id: rid } });
};

export default {
	chat_default_config,
	chat_set_config,
	get_chat_config,
	chat_can_open_goods,
	chat_open_goods,
	on_chat_event,
	off_chat_event,
	get_chat_state,
	chat_clear_recv_log,
	chat_event_http,
	chat_apply_work_init,
	normalize_label_list,
	normalize_emoji_list,
	chat_get_emoji_list,
	chat_apply_entry_params,
	chat_build_session_url,
	chat_connect,
	chat_disconnect,
	chat_send,
	chat_send_message,
	chat_set_receive_user,
	chat_get_receive_user_cache,
	chat_set_friend_base,
	chat_get_friend_base,
	chat_edit_user_remark,
	chat_edit_user_name,
	chat_edit_user_label,
	chat_load_record,
	chat_load_record_history,
	chat_load_user_history,
	chat_search_users,
	chat_can_search_record,
	chat_search_record,
	chat_load_record_around,
	chat_can_use_tool,
	chat_is_voice_message,
	chat_voice_mark_played,
	chat_set_status,
	chat_load_user_base,
	chat_leave_session,
	chat_send_input_status,
	chat_can_input_status,
	chat_can_show_input_message,
	chat_quick_message_add,
	chat_quick_message_del,
	chat_save_auto_reply_config,
	chat_load_business_goods,
	chat_clear_unread,
	chat_work_active_ai_mode,
	chat_transfer_human,
	chat_transfer_ai,
	chat_load_agent_online_list,
	chat_transfer_agent,
	chat_can_end,
	chat_end_session,
	chat_continue_session,
	chat_session_revive_inflight,
	chat_can_rating,
	chat_try_open_rating,
	chat_submit_rating,
	chat_invalidate_record_snapshot,
	chat_mark_active_conversation_read,
	chat_upsert_queue_visitor,
	chat_can_show_read,
	chat_can_quick_message,
	chat_can_goods_recommend,
	chat_can_recall,
	chat_recall_still_valid,
	chat_recall_seconds,
	chat_recall_message,
	chat_update_friend_preview,
	is_ai_bot_user,
	is_system_message,
	is_obsolete_phase_divider,
	is_ai_summary_message,
	is_mode_tip_message,
	is_session_end_continue_tip,
	is_recall_message,
	chat_ai_bot_user,
	format_message_tips,
	format_list_message_preview,
	format_quote_preview,
	normalize_quote,
	is_quote_recalled,
	parse_message_content,
	extract_goods_id_from_text,
};
