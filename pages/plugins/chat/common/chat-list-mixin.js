import base64 from '@/common/js/lib/base64.js';
import { isEmpty, showToast, get_default_avatar, page_back_prev_event, url_open, get_config, get_chat_nav_layout_metrics, get_menu_button_rect_safe } from '../common/chat-host.js';
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
		const navInit = get_chat_nav_layout_metrics(88);
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
			status_bar_height: navInit.status_bar_height,
			nav_content_h: navInit.nav_content_h,
			nav_bar_h: navInit.nav_bar_h,
			nav_occupy_h: navInit.nav_occupy_h,
			nav_right_pad: navInit.nav_right_pad,
			window_height: navInit.window_height,
			list_page_title: '在线客服',
			list_nav_layout_ready: false,
		};
	},
	computed: {
		list_status_bar_style() {
			return 'height:' + (this.status_bar_height || 0) + 'px;width:100%;flex-shrink:0;';
		},
		list_nav_wrap_style() {
			return 'padding-top:' + (this.status_bar_height || 0) + 'px;box-sizing:border-box;';
		},
		list_nav_bar_style() {
			let style = 'padding-right:' + (this.nav_right_pad || 12) + 'px;box-sizing:border-box;';
			if (this.nav_content_h > 0) {
				style += 'height:' + this.nav_content_h + 'px;';
			}
			return style;
		},
		list_main_style() {
			const occupy = this.nav_occupy_h || this.nav_bar_h || 0;
			if (!(occupy > 0)) {
				return 'box-sizing:border-box;';
			}
			return 'padding-top:' + occupy + 'px;box-sizing:border-box;';
		},
		list_body_style() {
			return {
				flex: '1',
				minHeight: '0',
			};
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

		rpx_to_px(rpx) {
			return typeof uni.upx2px == 'function' ? uni.upx2px(rpx) : Math.round(Number(rpx) / 2);
		},

		apply_list_nav_layout(patch = {}) {
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

		get_list_nav_bottom_pad() {
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

		init_list_nav(force = false) {
			if (this.list_nav_layout_ready && !force) {
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
			const bottomPad = this.get_list_nav_bottom_pad();
			const navBarHeight = statusBarHeight + navContentHeight + bottomPad;
			this.apply_list_nav_layout({
				status_bar_height: statusBarHeight,
				nav_content_h: navContentHeight,
				nav_right_pad: navRightPad,
				window_height: windowHeight,
				nav_bar_h: navBarHeight,
				nav_occupy_h: navBarHeight,
			});
			this.list_nav_layout_ready = true;
		},

		measure_list_nav() {
			this.$nextTick(() => {
				if (!this.page_alive) {
					return;
				}
				try {
					uni.createSelectorQuery().in(this).select('.chat-list-nav').boundingClientRect((rect) => {
						if (!this.page_alive || !rect || !(rect.height > 0)) {
							return;
						}
						const h = Math.round(rect.height);
						if (Math.abs(h - Number(this.nav_occupy_h || 0)) >= 1) {
							this.nav_bar_h = h;
							this.nav_occupy_h = h;
						}
					}).exec();
				} catch (e) {}
			});
		},

		list_back_event() {
			page_back_prev_event();
		},

		pick_chat_page_title(source) {
			const bags = [];
			const push = (obj) => {
				if (obj && typeof obj == 'object') {
					bags.push(obj);
				}
			};
			push(source);
			push(source && source.base_data);
			push(source && source.data);
			try {
				const plugins_base = get_config('plugins_base');
				if (Array.isArray(plugins_base)) {
					const row = plugins_base.find((item) => item && item.plugins == 'chat');
					push(row && row.data);
					push(row);
				} else if (plugins_base && typeof plugins_base == 'object') {
					const chat = plugins_base.chat;
					push(chat && chat.data);
					push(chat);
				}
			} catch (e) {}
			for (let i = 0; i < bags.length; i++) {
				const bag = bags[i];
				const name = bag.application_name || bag.seo_title || bag.title || bag.name;
				if (!isEmpty(name)) {
					return String(name).trim();
				}
			}
			return '';
		},

		default_list_page_title() {
			if (typeof this.$t == 'function') {
				const text = this.$t('pages.plugins-chat-list');
				if (!isEmpty(text) && String(text).indexOf('pages.plugins-') !== 0) {
					return String(text);
				}
			}
			return '在线客服';
		},

		apply_list_page_title(source) {
			const title = this.pick_chat_page_title(source) || this.default_list_page_title();
			if (isEmpty(title)) {
				return;
			}
			this.list_page_title = title;
			try {
				uni.setNavigationBarTitle({ title });
			} catch (e) {}
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
			url_open(chat_build_session_url(row.id, this.entry_params));
		},

		chat_list_on_load(params) {
			this.page_alive = true;
			this.list_loading = true;
			this.init_list_nav(true);
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
				apply_chat_user_page_config();
				this.apply_list_page_title(ret.data);
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

		chat_list_on_ready() {
			this.measure_list_nav();
		},

		chat_list_on_show() {
			this.page_alive = true;
			if (!(Number(this.nav_occupy_h || 0) > 0)) {
				this.init_list_nav(true);
				this.measure_list_nav();
			}
			this.apply_list_page_title();
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
