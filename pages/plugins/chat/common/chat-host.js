/**
 * 咨询端宿主适配（shopxo-uniapp / Vue2）
 * 将 admin-app common.js 能力映射到 App.globalData
 */
import base64 from '@/common/js/lib/base64.js';

const get_app = () => getApp();

export const get_global_data = (key) => {
	const app = get_app();
	return app && app.globalData ? app.globalData[key] : null;
};

export const isEmpty = (value) => {
	if (value === null || value === undefined) {
		return true;
	}
	if (typeof value == 'string' && value.trim() === '') {
		return true;
	}
	if (Array.isArray(value) && value.length === 0) {
		return true;
	}
	return false;
};

export const get_user_cache_info = (key, default_value) => {
	const app = get_app();
	if (!app || !app.globalData || typeof app.globalData.get_user_cache_info != 'function') {
		return default_value === undefined ? null : default_value;
	}
	return app.globalData.get_user_cache_info(key, default_value);
};

export const get_config = (key, default_value) => {
	const app = get_app();
	if (!app || !app.globalData || typeof app.globalData.get_config != 'function') {
		return default_value === undefined ? null : default_value;
	}
	return app.globalData.get_config(key, default_value);
};

/** 对齐商城全局默认头像 app.globalData.data.default_user_head_src */
export const get_default_avatar = () => {
	const app = get_app();
	const src = app && app.globalData && app.globalData.data && app.globalData.data.default_user_head_src;
	return src || '/static/images/common/user.png';
};

export const request_uuid = () => {
	const app = get_app();
	if (app && app.globalData && typeof app.globalData.request_uuid == 'function') {
		return app.globalData.request_uuid();
	}
	return '';
};

export const refresh_request_uuid = () => {
	const app = get_app();
	if (app && app.globalData && typeof app.globalData.refresh_request_uuid == 'function') {
		return app.globalData.refresh_request_uuid();
	}
	return request_uuid();
};

/** 对齐商城 App.globalData.application_client_type（h5/weixin/app 等） */
export const get_application_client_type = () => {
	const app = get_app();
	if (app && app.globalData && typeof app.globalData.application_client_type == 'function') {
		const value = String(app.globalData.application_client_type() || '').trim();
		if (value) {
			return value;
		}
	}
	return 'pc';
};

export const showToast = (msg, status) => {
	const app = get_app();
	if (app && app.globalData && typeof app.globalData.showToast == 'function') {
		app.globalData.showToast(msg, status == 'success' ? 'success' : 'none');
		return;
	}
	uni.showToast({ title: String(msg || ''), icon: 'none' });
};

export const url_open = (url, type) => {
	const app = get_app();
	if (app && app.globalData && typeof app.globalData.url_open == 'function') {
		app.globalData.url_open(url, type);
		return;
	}
	if (type == 3) {
		uni.switchTab({ url });
	} else if (type == 1) {
		uni.redirectTo({ url });
	} else {
		uni.navigateTo({ url });
	}
};

export const open_web_view = (url) => {
	const app = get_app();
	if (app && app.globalData && typeof app.globalData.open_web_view == 'function') {
		app.globalData.open_web_view(url);
		return;
	}
	url_open('/pages/web-view/web-view?url=' + encodeURIComponent(url));
};

export const page_back_prev_event = () => {
	const app = get_app();
	if (app && app.globalData && typeof app.globalData.page_back_prev_event == 'function') {
		app.globalData.page_back_prev_event();
		return;
	}
	const pages = getCurrentPages();
	if (pages.length > 1) {
		uni.navigateBack();
	} else {
		url_open('/pages/index/index', 3);
	}
};

export const get_request_url = (action, control, plugins, params, group) => {
	const app = get_app();
	if (app && app.globalData && typeof app.globalData.get_request_url == 'function') {
		return app.globalData.get_request_url(action, control, plugins, params, group);
	}
	return '';
};

/** 对齐 admin-app common.js：逗号路径 → get_request_url 参数 */
export const parse_request_api_path = (url = 'index') => {
	let action = 'index';
	let control = 'index';
	let plugins = '';
	let params = '';
	let group = 'api';
	const arr = String(url || '').split(',');
	if (arr.length >= 1 && arr[0] !== '') {
		action = arr[0];
	}
	if (arr.length >= 2 && arr[1] !== '') {
		control = arr[1];
	}
	if (arr.length >= 3 && arr[2] !== '') {
		plugins = arr[2];
	}
	if (arr.length >= 4) {
		params = arr[3] || '';
	}
	if (arr.length >= 5 && arr[4] !== '') {
		group = arr[4];
	}
	return {
		action,
		control,
		plugins: plugins || null,
		params,
		group,
	};
};

export const get_request_api_url = (url = 'index') => {
	const row = parse_request_api_path(url);
	return get_request_url(row.action, row.control, row.plugins, row.params, row.group);
};

const parse_chat_entry_from_url = (url = '') => {
	const entry = {};
	const str = String(url || '');
	const qIdx = str.indexOf('?');
	if (qIdx < 0) {
		return entry;
	}
	const keys = ['data_id', 'data_type', 'chat_user', 'chat_type', 'source', 'id'];
	str.substring(qIdx + 1).split('&').forEach((pair) => {
		const seg = pair.split('=');
		if (seg.length < 2) {
			return;
		}
		const key = decodeURIComponent(seg[0] || '');
		if (keys.indexOf(key) === -1) {
			return;
		}
		entry[key] = decodeURIComponent(seg.slice(1).join('='));
	});
	return entry;
};

const build_chat_list_url = (entry = {}) => {
	let url = '/pages/plugins/chat/list/list';
	const qs = [];
	['source', 'data_id', 'data_type', 'chat_user', 'chat_type'].forEach((key) => {
		if (!isEmpty(entry[key])) {
			qs.push(key + '=' + encodeURIComponent(String(entry[key])));
		}
	});
	if (qs.length > 0) {
		url += '?' + qs.join('&');
	}
	return url;
};

/** 会话列表页 URL（保留进线参数） */
export const chat_build_list_url = build_chat_list_url;

/** 评价结束 / 关闭评价后回到会话列表 */
export const chat_back_to_list_event = (entry = {}) => {
	const pages = getCurrentPages();
	if (pages.length > 1) {
		const prev = pages[pages.length - 2];
		const route = String((prev && prev.route) || '').replace(/^\//, '');
		if (route === 'pages/plugins/chat/list/list') {
			uni.navigateBack();
			return;
		}
	}
	uni.redirectTo({ url: build_chat_list_url(entry) });
};

const append_chat_entry_source = (entry = {}) => {
	if (!isEmpty(entry.source)) {
		return entry;
	}
	try {
		const app = get_app();
		if (app && app.globalData && typeof app.globalData.current_page == 'function') {
			const route = app.globalData.current_page();
			if (!isEmpty(route)) {
				entry.source = base64.encode(route).replace(/=/g, '');
			}
		}
	} catch (err) {}
	return entry;
};

/**
 * 原生客服入口（列表 → 详情），不影响 chat_entry_handle / WebView chat.html
 * @param {string|object} url_or_params chat_url 或进线参数 { data_id, data_type, chat_user, chat_type, source, id, to_list }
 */
export const chat_native_entry_handle = (url_or_params) => {
	const app = get_app();
	let entry = {};
	if (typeof url_or_params == 'string') {
		let url = url_or_params;
		if (app && app.globalData && typeof app.globalData.request_params_handle == 'function') {
			url = app.globalData.request_params_handle(url);
		}
		entry = parse_chat_entry_from_url(url);
	} else if (url_or_params && typeof url_or_params == 'object') {
		entry = { ...url_or_params };
		if (!isEmpty(entry.chat_url)) {
			entry = { ...parse_chat_entry_from_url(entry.chat_url), ...entry };
			delete entry.chat_url;
		}
	}
	entry = append_chat_entry_source(entry);
	const agent_id = parseInt(entry.id || entry.chat_user || 0, 10) || 0;
	const to_list = entry.to_list === true || entry.to_list == 1 || entry.to_list == '1';
	if (agent_id > 0 && !to_list) {
		const { chat_build_session_url } = require('./chat-socket.js');
		uni.navigateTo({ url: chat_build_session_url(agent_id, entry) });
		return true;
	}
	uni.navigateTo({ url: build_chat_list_url(entry) });
	return true;
};
