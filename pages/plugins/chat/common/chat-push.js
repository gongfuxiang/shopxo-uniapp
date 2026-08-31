/**
 * 咨询聊天本地推送（UniApp uni.createPushMessage / plus.push）
 * 客服来消息通知用户；点击通知进入对应会话
 */
import { get_chat_state, chat_leave_session, chat_set_receive_user, chat_clear_unread, chat_build_session_url } from './chat-socket.js';

let app_hidden = false;
let push_bound = false;

export const set_chat_app_hidden = (hidden) => {
	app_hidden = !!hidden;
};

const parse_push_payload = (msg) => {
	if (!msg) {
		return null;
	}
	let data = msg.payload;
	if (data == null && msg.data) {
		data = msg.data.payload != null ? msg.data.payload : msg.data;
	}
	if (typeof data == 'string') {
		try {
			data = JSON.parse(data);
		} catch (e) {
			return null;
		}
	}
	if (!data || typeof data != 'object') {
		return null;
	}
	return data;
};

const current_page_route = () => {
	const pages = getCurrentPages() || [];
	const cur = pages[pages.length - 1] || {};
	return String(cur.route || cur.__route__ || '');
};

const is_viewing_chat = (chat_id) => {
	if (current_page_route().indexOf('plugins/chat/index') == -1) {
		return false;
	}
	try {
		const app = getApp();
		const viewing = app && app.globalData ? app.globalData.chat_viewing_id : '';
		if (viewing) {
			return String(viewing) == String(chat_id);
		}
	} catch (e) {}
	return false;
};

/** 用 UniApp 推送 API 弹出本地通知 */
export const create_chat_local_push = (title, content, payload = {}) => {
	const body = String(content || '').trim() || '你收到一条新消息';
	const heading = String(title || '新消息').trim() || '新消息';

	if (typeof uni.createPushMessage == 'function') {
		uni.createPushMessage({
			title: heading,
			content: body,
			payload,
			cover: false,
			sound: 'system',
			fail: () => {
				create_plus_or_h5_push(heading, body, payload);
			},
		});
		return;
	}
	create_plus_or_h5_push(heading, body, payload);
};

const create_plus_or_h5_push = (title, content, payload) => {
	// #ifdef APP-PLUS
	try {
		plus.push.createMessage(content, JSON.stringify(payload), {
			title,
			cover: false,
		});
		return;
	} catch (e) {}
	// #endif

	// #ifdef H5
	try {
		if (typeof Notification == 'undefined') {
			return;
		}
		const show_n = () => {
			const n = new Notification(title, { body: content });
			n.onclick = () => {
				try {
					window.focus();
				} catch (err) {}
				handle_chat_push_click({ payload });
				n.close();
			};
		};
		if (Notification.permission == 'granted') {
			show_n();
		}
	} catch (e) {}
	// #endif
};

const open_chat_by_id = (chat_id) => {
	if (!chat_id) {
		return;
	}
	const list = get_chat_state().user_list || [];
	const row = list.find((item) => String(item.id) == String(chat_id));
	const current = get_chat_state().receive_user;
	if (row && row.receive_user) {
		if (current && String(current.id) != String(row.receive_user.id)) {
			chat_leave_session();
		}
		chat_set_receive_user(row.receive_user);
		chat_clear_unread(chat_id);
	}
	const url = chat_build_session_url(chat_id);
	const route = current_page_route();
	if (route.indexOf('plugins/chat/index') !== -1) {
		if (current && String(current.id) == String(chat_id)) {
			return;
		}
		uni.redirectTo({ url });
		return;
	}
	uni.navigateTo({
		url,
		fail: () => {
			uni.redirectTo({ url });
		},
	});
};

export const handle_chat_push_click = (msg) => {
	const data = parse_push_payload(msg);
	if (!data || !data.type) {
		return;
	}
	if (data.type == 'chat_resend') {
		try {
			uni.setStorageSync('cache_chat_resend_now', {
				chat_id: String(data.chat_id || ''),
				key: data.key,
			});
		} catch (e) {}
		const route = current_page_route();
		if (route.indexOf('plugins/chat/index') !== -1) {
			uni.$emit('chat_resend_now', data);
			return;
		}
		open_chat_by_id(data.chat_id);
		return;
	}
	if (data.type == 'chat_incoming') {
		open_chat_by_id(data.chat_id);
	}
};

/** 客服发来消息：本地推送给咨询用户 */
export const notify_incoming_chat = (user = {}, preview = '') => {
	const chat_id = user && user.id ? String(user.id) : '';
	if (!chat_id) {
		return;
	}
	if (!app_hidden && is_viewing_chat(chat_id)) {
		return;
	}
	const title = (user && user.name) || '新消息';
	const content = String(preview || '').trim() || '你收到一条新消息';
	create_chat_local_push(title, content, {
		type: 'chat_incoming',
		chat_id,
	});
};

export const bind_chat_push = () => {
	if (push_bound) {
		return;
	}
	push_bound = true;

	if (typeof uni.onPushMessage == 'function') {
		uni.onPushMessage((res) => {
			if (res && res.type == 'click') {
				handle_chat_push_click(res.data || res);
			}
		});
	}

	// #ifdef APP-PLUS
	const bind_plus = () => {
		plus.push.addEventListener('click', handle_chat_push_click);
	};
	if (typeof plus !== 'undefined') {
		bind_plus();
	} else if (typeof document !== 'undefined') {
		document.addEventListener('plusready', bind_plus);
	}
	// #endif
};

let push_auth_promise = null;
let push_auth_prompted = false;

const when_plus_ready = () => {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		if (typeof plus != 'undefined') {
			resolve();
			return;
		}
		const done = () => resolve();
		if (typeof document != 'undefined' && document.addEventListener) {
			document.addEventListener('plusready', done, false);
			setTimeout(done, 2500);
			return;
		}
		setTimeout(done, 500);
		// #endif
		// #ifndef APP-PLUS
		resolve();
		// #endif
	});
};

const get_notification_auth_status = () => {
	try {
		if (typeof uni.getAppAuthorizeSetting == 'function') {
			const res = uni.getAppAuthorizeSetting();
			return res && res.notificationAuthorized ? String(res.notificationAuthorized) : '';
		}
	} catch (e) {}
	return '';
};

const request_h5_notification_auth = () => {
	return new Promise((resolve) => {
		// #ifdef H5
		try {
			if (typeof Notification == 'undefined') {
				resolve(true);
				return;
			}
			if (Notification.permission == 'granted' || Notification.permission == 'denied') {
				resolve(true);
				return;
			}
			Notification.requestPermission().then(() => resolve(true), () => resolve(true));
		} catch (e) {
			resolve(true);
		}
		// #endif
		// #ifndef H5
		resolve(true);
		// #endif
	});
};

const request_android_notification_auth = () => {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		try {
			const Build = plus.android.importClass('android.os.Build');
			const sdk = parseInt(Build.VERSION.SDK_INT || 0) || 0;
			if (sdk > 0 && sdk < 33) {
				resolve(true);
				return;
			}
		} catch (e) {}
		if (!plus.android || typeof plus.android.requestPermissions != 'function') {
			resolve(true);
			return;
		}
		plus.android.requestPermissions(
			['android.permission.POST_NOTIFICATIONS'],
			() => resolve(true),
			() => resolve(true)
		);
		// #endif
		// #ifndef APP-PLUS
		resolve(true);
		// #endif
	});
};

const request_ios_notification_auth = () => {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		const status = get_notification_auth_status();
		if (status == 'authorized') {
			resolve(true);
			return;
		}
		if (status == 'denied') {
			resolve(false);
			return;
		}
		let finished = false;
		const finish = (ok) => {
			if (finished) {
				return;
			}
			finished = true;
			resolve(ok !== false);
		};
		try {
			const UNUserNotificationCenter = plus.ios.import('UNUserNotificationCenter');
			const center = UNUserNotificationCenter.currentNotificationCenter();
			center.requestAuthorizationWithOptionscompletionHandler(7, (granted) => {
				try {
					plus.ios.deleteObject(center);
					plus.ios.deleteObject(UNUserNotificationCenter);
				} catch (e) {}
				finish(!!granted);
			});
		} catch (e) {
			finish(true);
		}
		setTimeout(() => finish(true), 10000);
		// #endif
		// #ifndef APP-PLUS
		resolve(true);
		// #endif
	});
};

const request_app_notification_auth = () => {
	return when_plus_ready().then(() => {
		// #ifdef APP-PLUS
		const os = plus.os && plus.os.name ? String(plus.os.name) : '';
		if (os == 'Android') {
			return request_android_notification_auth();
		}
		if (os == 'iOS') {
			return request_ios_notification_auth();
		}
		// #endif
		return true;
	});
};

const run_push_auth = () => {
	return request_h5_notification_auth()
		.then(() => request_app_notification_auth())
		.then(() => {
			push_auth_prompted = true;
			return true;
		})
		.catch(() => {
			push_auth_prompted = true;
			return false;
		});
};

/** 进咨询页再申请通知权限 */
export const request_chat_push_auth = (options = {}) => {
	const force = options.force === true;
	if (!force && push_auth_prompted) {
		return Promise.resolve(true);
	}
	if (push_auth_promise) {
		return push_auth_promise;
	}
	push_auth_promise = run_push_auth().finally(() => {
		push_auth_promise = null;
	});
	return push_auth_promise;
};
