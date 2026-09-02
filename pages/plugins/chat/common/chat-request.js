import { get_request_api_url, showToast } from './chat-host.js';

/** 咨询端 HTTP 路径（对齐 admin-app 逗号格式；商城走 plugins/index，非 seller 分发） */
export const CHAT_USER_API = {
	INIT: 'index,index,chat',
	EVENT: 'event,index,chat,,index',
	UPLOAD: 'upload,index,chat',
};

const api_log = (tag, payload) => {
	try {
		console.log('[chat_api]', tag, payload);
	} catch (e) {}
};

/**
 * 对齐 admin-app $api.post：逗号路径 + POST body（含 business_control / business_action）
 */
const chat_post = (api_path, data = {}, options = {}) => {
	const silent = !!options.silentError;
	const url = get_request_api_url(api_path);
	return new Promise((resolve, reject) => {
		if (!url) {
			reject({ msg: '请求地址无效' });
			return;
		}
		api_log('→ request', { api_path, url, data });
		uni.request({
			url,
			method: 'POST',
			data: data || {},
			dataType: 'json',
			timeout: options.timeout || 10000,
			success: (res) => {
				api_log('← response', { api_path, url, data: res.data });
				const body = res.data || {};
				if (body.code == 0) {
					resolve(body);
					return;
				}
				if (!silent && body.msg) {
					showToast(body.msg);
				}
				reject(body);
			},
			fail: (err) => {
				api_log('← fail', { api_path, url, err });
				if (!silent) {
					showToast('网络异常');
				}
				reject(err || { msg: '网络异常' });
			},
		});
	});
};

export default {
	post: (api_path, data, loading, loading_title, header, timeout, silentError) => {
		return chat_post(api_path, data, { silentError, timeout });
	},
};
