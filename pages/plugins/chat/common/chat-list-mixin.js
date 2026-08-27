import base64 from '@/common/js/lib/base64.js';
import { isEmpty, showToast, get_default_avatar, page_back_prev_event } from '../common/chat-host.js';
import { ensure_chat_user_init, apply_chat_user_page_config } from '../common/chat-user-init.js';
import {
	chat_connect,
	chat_resume_connect,
	chat_apply_entry_params,
	chat_build_session_url,
	chat_set_receive_user,
	on_chat_event,
	off_chat_event,
	get_chat_state,
	chat_load_user_history,
	chat_search_users,
} from '../common/chat-socket.js';

export default {
	data() {
		const default_avatar = get_default_avatar();
		return {
			page_alive: false,
			page_user_inited: false,
			user_list: [],
			list_loading: true,
			is_connecting: false,
			connect_status: 0,
			entry_params: {},
			list_keyword_input: '',
			list_keyword: '',
			list_search_loading: false,
			default_avatar,
			status_bar_height: 0,
			nav_content_h: 0,
			nav_bar_h: 0,
			nav_occupy_h: 0,
			window_height: 667,
		};
	},
	computed: {
		list_nav_style() {
			return {
				paddingTop: (this.status_bar_height || 0) + 'px',
			};
		},
		list_main_style() {
			return {
				paddingTop: (this.nav_occupy_h || 0) + 'px',
			};
		},
		list_body_style() {
			const h = Math.max(0, Number(this.window_height || 0) - Number(this.nav_occupy_h || 0));
			return h > 0 ? { height: h + 'px' } : {};
		},
		filtered_list() {
			const rows = this.display_list;
			const kw = String(this.list_keyword || '').trim().toLowerCase();
			if (!kw) {
				return rows;
			}
			return rows.filter((row) => this.list_match_keyword(row, kw));
		},
		list_empty_text() {
			const kw = String(this.list_keyword || '').trim();
			if (kw) {
				return '未找到匹配的会话';
			}
			return '暂无会话，稍后再试';
		},
		display_list() {
			const rows = Array.isArray(this.user_list) ? this.user_list : [];
			if (rows.length > 0) {
				return rows;
			}
			const recv = get_chat_state().receive_user;
			if (recv && recv.id) {
				return [{
					id: recv.id,
					name: recv.name || '在线客服',
					avatar: recv.avatar || this.default_avatar,
					preview_content: '',
					time_text: '',
					unread: 0,
					receive_user: recv,
				}];
			}
			return [];
		},
		show_list_loading() {
			return !this.page_user_inited || this.list_loading || (this.is_connecting && this.connect_status !== 1);
		},
	},
	methods: {
		isEmpty(v) {
			return isEmpty(v);
		},

		init_list_nav() {
			try {
				const sys = uni.getSystemInfoSync() || {};
				this.status_bar_height = Number(sys.statusBarHeight || 0);
				this.window_height = Number(sys.windowHeight || 667);
				const win_w = Number(sys.windowWidth || 375);
				// #ifdef MP
				try {
					const mb = typeof uni.getMenuButtonBoundingClientRect == 'function'
						? uni.getMenuButtonBoundingClientRect()
						: null;
					if (mb && mb.width > 0 && mb.left > 0) {
						this.status_bar_height = Number(mb.top || this.status_bar_height);
						this.nav_content_h = Number(mb.height || 0);
					}
				} catch (e2) {}
				// #endif
			} catch (e) {
				this.status_bar_height = 0;
			}
			if (!(this.nav_content_h > 0)) {
				this.nav_content_h = typeof uni.upx2px == 'function' ? uni.upx2px(88) : 44;
			}
			this.nav_bar_h = this.status_bar_height + this.nav_content_h;
			this.nav_occupy_h = this.nav_bar_h;
		},

		list_back_event() {
			page_back_prev_event();
		},

		sync_user_list(payload) {
			const data = payload || get_chat_state();
			this.user_list = Array.isArray(data.user_list) ? data.user_list : [];
			if (this.connect_status === 1) {
				this.list_loading = false;
				this.list_search_loading = false;
			}
		},

		sync_connect_ui() {
			const data = get_chat_state();
			this.connect_status = data.connect_status || 0;
			this.is_connecting = !!data.is_connecting;
		},

		bind_list_events() {
			this._bound_list_success = () => this.on_list_success();
			this._bound_list_user_list = (payload) => this.sync_user_list(payload);
			this._bound_list_status = () => this.sync_connect_ui();
			this._bound_list_error = () => {
				this.list_loading = false;
				this.sync_connect_ui();
			};
			on_chat_event('success', this._bound_list_success);
			on_chat_event('user_list', this._bound_list_user_list);
			on_chat_event('status', this._bound_list_status);
			on_chat_event('error', this._bound_list_error);
		},

		unbind_list_events() {
			off_chat_event('success', this._bound_list_success);
			off_chat_event('user_list', this._bound_list_user_list);
			off_chat_event('status', this._bound_list_status);
			off_chat_event('error', this._bound_list_error);
		},

		on_list_success() {
			if (!this.page_alive) {
				return;
			}
			this.sync_connect_ui();
			this.sync_user_list();
			this.list_search_loading = false;
			if (this.connect_status === 1) {
				chat_load_user_history(1);
			}
		},

		open_chat_event(e) {
			const idx = parseInt(e?.currentTarget?.dataset?.index, 10);
			const row = this.filtered_list[idx];
			if (!row || !row.id) {
				return;
			}
			const receive = row.receive_user || { id: row.id, name: row.name, avatar: row.avatar };
			chat_set_receive_user(receive);
			const url = chat_build_session_url(row.id, this.entry_params);
			uni.navigateTo({ url });
		},

		chat_list_on_load(params) {
			this.page_alive = true;
			this.list_loading = true;
			this.init_list_nav();
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
				} catch (err) {}
			}
			this.entry_params = { ...entry };
			chat_apply_entry_params(entry);
			apply_chat_user_page_config();
			this.bind_list_events();
			this.sync_connect_ui();
			this.page_user_inited = false;
			const before = get_chat_state();
			this.connect_status = before.connect_status || 0;
			this.is_connecting = !!before.is_connecting;
			if (before.connect_status === 1) {
				this.sync_user_list(before);
			}
			ensure_chat_user_init({ silentError: true }).then((ret) => {
				if (!this.page_alive) {
					return;
				}
				if (!ret.ok) {
					showToast(ret.msg || '咨询端初始化失败');
				}
				this.page_user_inited = true;
				if (before.connect_status === 1 && before.user_type == 'user') {
					chat_resume_connect();
					this.sync_connect_ui();
					this.sync_user_list();
					chat_load_user_history(1);
					return;
				}
				chat_connect({ user_type: 'user' });
				const after = get_chat_state();
				this.connect_status = after.connect_status || 0;
				this.is_connecting = !!after.is_connecting;
				this.sync_user_list(after);
			});
		},

		chat_list_on_show() {
			this.page_alive = true;
			chat_resume_connect();
			this.sync_connect_ui();
			if (this.connect_status === 1) {
				const kw = String(this.list_keyword || '').trim();
				if (kw) {
					chat_search_users(kw);
				} else {
					chat_load_user_history(1);
				}
			}
		},

		chat_list_on_hide() {
			this.page_alive = false;
		},

		chat_list_on_unload() {
			this.page_alive = false;
			if (this._list_search_timer) {
				clearTimeout(this._list_search_timer);
				this._list_search_timer = null;
			}
			this.unbind_list_events();
		},

		preview_text(row) {
			const tag = row.preview_tag ? (row.preview_tag + ' ') : '';
			return tag + (row.preview_content || row.last_message || '');
		},

		unread_text(row) {
			const raw = (row.unread_count != null && row.unread_count !== '')
				? row.unread_count
				: (row.unread != null && row.unread !== '' ? row.unread : 0);
			if (raw == null || raw === '' || String(raw) === '0') {
				return '';
			}
			if (String(raw) === '99+') {
				return '99+';
			}
			const n = parseInt(raw, 10) || 0;
			if (n <= 0) {
				return '';
			}
			return n > 99 ? '99+': String(n);
		},

		list_match_keyword(row, kw) {
			const name = String(row.name || '').toLowerCase();
			const preview = String(this.preview_text(row) || '').toLowerCase();
			return name.indexOf(kw) !== -1 || preview.indexOf(kw) !== -1;
		},

		list_search_input_event(e) {
			this.list_keyword_input = e?.detail?.value || '';
			this.list_keyword = String(this.list_keyword_input || '').trim();
			if (this._list_search_timer) {
				clearTimeout(this._list_search_timer);
				this._list_search_timer = null;
			}
			const kw = this.list_keyword;
			if (!kw) {
				this.list_search_request('');
				return;
			}
			this._list_search_timer = setTimeout(() => {
				this._list_search_timer = null;
				this.list_search_request(kw);
			}, 300);
		},

		list_search_confirm_event() {
			if (this._list_search_timer) {
				clearTimeout(this._list_search_timer);
				this._list_search_timer = null;
			}
			this.list_keyword = String(this.list_keyword_input || '').trim();
			this.list_search_request(this.list_keyword);
		},

		list_search_clear_event() {
			if (this._list_search_timer) {
				clearTimeout(this._list_search_timer);
				this._list_search_timer = null;
			}
			this.list_keyword_input = '';
			this.list_keyword = '';
			this.list_search_request('');
		},

		list_search_request(keywords) {
			const kw = String(keywords || '').trim();
			if (!this.page_user_inited || this.connect_status !== 1) {
				return;
			}
			this.list_search_loading = true;
			chat_search_users(kw);
		},
	},
};
