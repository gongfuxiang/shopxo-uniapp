import { get_config, isEmpty } from './chat-host.js';
import { chat_apply_work_init, chat_set_config } from './chat-socket.js';
import chat_request, { CHAT_USER_API } from './chat-request.js';

let inflight = null;

const pick_plugins_chat_data = () => {
	try {
		const plugins_base = get_config('plugins_base');
		if (Array.isArray(plugins_base)) {
			const row = plugins_base.find((item) => item && item.plugins == 'chat');
			return (row && row.data) || row || null;
		}
		if (plugins_base && typeof plugins_base == 'object') {
			const chat = plugins_base.chat;
			return (chat && chat.data) || chat || null;
		}
	} catch (err) {}
	return null;
};

/**
 * 咨询端初始化（对齐 admin-app ensure_chat_work_init：始终打 HTTP，plugins_base 仅作预填/失败兜底）
 */
export const ensure_chat_user_init = (options = {}) => {
	if (inflight) {
		return inflight;
	}
	const silent = !!(options && options.silentError);
	const from_plugins = pick_plugins_chat_data();
	if (from_plugins) {
		chat_apply_work_init({
			base_data: from_plugins,
			...(from_plugins.chat_features ? { chat_features: from_plugins.chat_features } : {}),
		});
	}
	inflight = chat_request.post(CHAT_USER_API.INIT, {
		business_control: 'index',
		business_action: 'index',
	}, false, '', {}, 10000, silent).then((res) => {
		const data = (res && res.data) || {};
		chat_apply_work_init(data);
		return {
			ok: true,
			data,
			msg: '',
			from: from_plugins ? 'plugins_base+api' : 'api',
		};
	}).catch((err) => {
		if (from_plugins) {
			return { ok: true, data: from_plugins, msg: '', from: 'plugins_base' };
		}
		return { ok: false, data: null, msg: (err && err.msg) || '咨询端初始化失败' };
	}).finally(() => {
		inflight = null;
	});
	return inflight;
};

export const apply_chat_user_page_config = (extra = {}) => {
	const patch = {
		goods_click_enable: 1,
		// 商品跳转优先用接口下发的 goods_url；无链接时再靠 goods_detail_path 兜底
		is_chat_record_search: 1,
		is_chat_record_search_user: 1,
		...(extra || {}),
	};
	const app = getApp();
	if (app && app.globalData && app.globalData.data && app.globalData.data.request_url) {
		patch.request_url = app.globalData.data.request_url;
	}
	const static_url = get_config('config.common_site_url') || patch.request_url || '';
	if (static_url) {
		patch.static_url = static_url;
	}
	chat_set_config(patch);
	// 写入 page_flags 并刷新 chat_features，否则导航栏搜索按钮不会出现
	chat_apply_work_init({
		is_chat_record_search: patch.is_chat_record_search,
		is_chat_record_search_user: patch.is_chat_record_search_user,
		chat_features: {
			is_chat_record_search: patch.is_chat_record_search,
			is_chat_record_search_user: patch.is_chat_record_search_user,
		},
	});
};
