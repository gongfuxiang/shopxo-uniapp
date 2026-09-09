<template>
    <view :class="theme_view + ' aichat-page' + (is_chatting ? ' is-chatting' : '') + (sidebar_open ? ' is-sidebar-open' : '') + (sidebar_closing ? ' is-sidebar-closing' : '')">
        <view v-if="page_loading" class="aichat-boot">
            <component-no-data propStatus="1"></component-no-data>
        </view>

        <view v-else-if="!is_enabled" class="aichat-disabled padding-main">
            <view class="aichat-disabled-card bg-white border-radius-main padding-xl tc">
                <view class="text-size-lg fw-b">{{$t('aichat.disabled_title')}}</view>
                <view class="cr-grey text-size-sm margin-top-sm">{{$t('aichat.disabled_desc')}}</view>
            </view>
            <component-common ref="common" :propIsFooterSeat="false"></component-common>
        </view>

        <block v-else>
            <!-- 历史侧栏 -->
            <view class="aichat-sidebar-mask" v-if="sidebar_open" @tap="close_sidebar"></view>
            <view class="aichat-sidebar">
                <view class="aichat-sidebar-hd">
                    <view class="aichat-brand flex-row align-c">
                        <image v-if="logo" class="aichat-brand-logo" :src="logo" mode="aspectFill"></image>
                        <text class="aichat-brand-name">{{ application_name }}</text>
                    </view>
                    <view class="aichat-new-chat flex-row align-c jc-c" @tap="start_new_chat">
                        <iconfont name="icon-add" size="28rpx" color="#fff"></iconfont>
                        <text class="margin-left-sm">{{$t('aichat.new_chat')}}</text>
                    </view>
                </view>
                <view class="aichat-sidebar-section-title flex-row align-c">
                    <iconfont name="icon-timing-time" size="26rpx" color="#8a919f"></iconfont>
                    <text class="margin-left-sm">{{$t('aichat.history')}}</text>
                </view>
                <scroll-view scroll-y class="aichat-history-scroll">
                    <view v-if="displayed_sessions.length === 0" class="aichat-history-empty">{{$t('aichat.history_empty')}}</view>
                    <view
                        v-for="(item, index) in displayed_sessions"
                        :key="index"
                        :class="'aichat-history-item flex-row align-c' + (same_id(item.id, current_id) ? ' is-active' : '')"
                        :data-id="item.id"
                        @tap="open_session_event"
                    >
                        <text class="aichat-history-title flex-1">{{ truncate_title(item.title, 18) }}</text>
                        <view class="aichat-history-del" :data-id="item.id" @tap.stop="delete_session_event">
                            <iconfont name="icon-delete" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view v-if="history_can_more || history_loading_more" class="aichat-history-more flex-row align-c jc-c" @tap="load_history_more">
                        <text>{{ history_loading_more ? $t('common.loading_in_text') : $t('common.view_more') }}</text>
                        <iconfont v-if="!history_loading_more" name="icon-arrow-bottom" size="24rpx" color="#8a919f" propClass="margin-left-xs"></iconfont>
                    </view>
                </scroll-view>
            </view>

            <!-- 主区域：开场态与 PC 一致，欢迎语+输入框垂直居中 -->
            <view class="aichat-main">
                <view class="aichat-main-bar flex-row align-c">
                    <view class="aichat-bar-btn" @tap="open_sidebar">
                        <iconfont name="icon-log-list" size="36rpx" color="#333"></iconfont>
                    </view>
                    <view class="aichat-bar-btn" @tap="start_new_chat">
                        <iconfont name="icon-add" size="34rpx" color="#333"></iconfont>
                    </view>
                    <text class="aichat-main-title flex-1">{{ main_title }}</text>
                </view>

                <!-- 开场：欢迎语+输入框作为一组垂直居中（对齐 PC） -->
                <view v-if="!is_chatting" class="aichat-welcome-panel">
                    <view class="aichat-flex-spacer"></view>
                    <view class="aichat-welcome">
                        <view class="aichat-welcome-title">{{ welcome_title }}</view>
                        <view class="aichat-welcome-desc">{{ desc }}</view>
                    </view>
                <view class="aichat-composer">
                    <view v-if="quick_questions.length" class="aichat-quick-wrap">
                        <view
                            v-for="(q, qi) in quick_questions"
                            :key="qi"
                            class="aichat-quick-btn"
                            :data-question="q"
                            @tap="quick_ask_event"
                        >{{ q }}</view>
                    </view>
                    <view class="aichat-input-wrap">
                        <textarea
                            class="aichat-input"
                            :value="input_value"
                            :maxlength="1000"
                            :auto-height="true"
                            :show-confirm-bar="false"
                            :adjust-position="true"
                            :placeholder="$t('aichat.placeholder')"
                            placeholder-class="cr-grey-9"
                            @input="input_event"
                            @confirm="send_event"
                        ></textarea>
                        <view class="aichat-input-toolbar flex-row align-c jc-e">
                            <view
                                :class="'aichat-send-btn' + (can_send ? '' : ' is-disabled')"
                                @tap="send_event"
                            >
                                <iconfont name="icon-sending-surface" size="34rpx" color="#fff"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
                    <view class="aichat-flex-spacer"></view>
                </view>

                <!-- 会话中：消息列表置顶滚动，输入框贴底 -->
                <block v-else>
                    <view class="aichat-chat-body">
                    <view class="aichat-stage-wrap">
                    <scroll-view
                        scroll-y
                        class="aichat-stage"
                        :scroll-into-view="scroll_into"
                        :scroll-top="scroll_top"
                        :scroll-with-animation="scroll_animate"
                        @scroll="on_msg_scroll"
                    >
                        <view class="aichat-messages">
                        <view v-if="msg_has_more || msg_loading_more" class="aichat-msg-more flex-row align-c jc-c" @tap="load_more_messages">
                            <text>{{ msg_loading_more ? $t('common.loading_in_text') : $t('common.view_more') }}</text>
                            <iconfont v-if="!msg_loading_more" name="icon-arrow-top" size="24rpx" color="#8a919f" propClass="margin-left-xs"></iconfont>
                        </view>
                        <view v-if="session_loading" class="aichat-session-loading">
                            <view class="aichat-session-loading-spinner"></view>
                            <text class="cr-grey text-size-sm">{{ session_loading_text }}</text>
                        </view>
                        <block v-for="(msg, idx) in messages" :key="idx">
                            <view v-if="msg.role === 'loading'" class="aichat-msg is-bot is-loading" :id="idx === keep_msg_index ? 'aichat-keep-pos' : ('msg-' + idx)">
                                <view class="aichat-msg-bubble">
                                    <view class="aichat-thinking">
                                        <view class="aichat-thinking-label">
                                            <text
                                                v-for="(ch, ci) in thinking_chars"
                                                :key="ci"
                                                class="aichat-thinking-char"
                                                :style="'animation-delay:' + (ci * 0.08) + 's'"
                                            >{{ ch }}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view v-else :class="'aichat-msg is-' + msg.role" :id="idx === keep_msg_index ? 'aichat-keep-pos' : ('msg-' + idx)">
                                <view v-if="msg.role === 'bot' && msg.revisions && msg.revisions.length" class="aichat-msg-revisions">
                                    <view
                                        v-for="(rev, ri) in msg.revisions"
                                        :key="ri"
                                        :class="'aichat-msg-revision' + (rev.open ? ' is-open' : '')"
                                    >
                                        <view class="aichat-msg-revision-hd">
                                            <view class="aichat-msg-revision-meta">
                                                <text class="aichat-msg-revision-tag">{{$t('aichat.revised_answer')}}</text>
                                                <text class="aichat-msg-revision-ver">{{ revision_ver_text(rev, ri) }}</text>
                                            </view>
                                            <view class="aichat-msg-revision-ops">
                                                <view class="aichat-msg-revision-btn" :data-msg-index="idx" :data-rev-index="ri" @tap="toggle_revision_event">{{ rev.open ? $t('common.retract') : $t('common.expand') }}</view>
                                                <view class="aichat-msg-revision-btn" :data-msg-index="idx" :data-rev-index="ri" @tap="view_revision_event">{{$t('common.view_text')}}</view>
                                            </view>
                                        </view>
                                        <view class="aichat-msg-revision-body">
                                            <view v-if="!rev.open" class="aichat-msg-revision-preview">{{ revision_plain_text(rev.text) }}</view>
                                            <block v-else>
                                                <mp-html class="aichat-msg-revision-preview" :content="format_message_html(rev.text)" :set-title="false"></mp-html>
                                                <view v-if="rev.goods && rev.goods.length" class="aichat-goods-list">
                                                    <view
                                                        v-for="(g, gi) in rev.goods"
                                                        :key="gi"
                                                        class="aichat-goods-card flex-row"
                                                        :data-value="goods_detail_url(g)"
                                                        @tap="url_event"
                                                    >
                                                        <image v-if="g.images" class="aichat-goods-img" :src="g.images" mode="aspectFill"></image>
                                                        <view v-else class="aichat-goods-img aichat-goods-img-empty"></view>
                                                        <view class="aichat-goods-meta flex-1">
                                                            <view class="aichat-goods-title">{{ g.title || $t('common.goods') }}</view>
                                                            <view v-if="g.price !== '' && g.price !== null && g.price !== undefined" class="aichat-goods-price">
                                                                {{ g.show_price_symbol || '￥' }}{{ g.price }}
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                                <view class="aichat-msg-bubble">
                                    <view v-if="msg.role === 'user'" class="aichat-msg-text">{{ msg.text }}</view>
                                    <block v-else>
                                        <view v-if="msg.regenerating" class="aichat-thinking">
                                            <view class="aichat-thinking-label">
                                                <text
                                                    v-for="(ch, ci) in thinking_chars"
                                                    :key="ci"
                                                    class="aichat-thinking-char"
                                                    :style="'animation-delay:' + (ci * 0.08) + 's'"
                                                >{{ ch }}</text>
                                            </view>
                                        </view>
                                        <view v-else-if="msg.typing" class="aichat-msg-text aichat-msg-typing">{{ msg.display_text }}</view>
                                        <mp-html v-else class="aichat-msg-text" :content="format_message_html(msg.text)" :set-title="false"></mp-html>
                                    </block>

                                    <view v-if="msg.role === 'bot' && !msg.typing && !msg.regenerating && msg.goods && msg.goods.length" class="aichat-goods-list">
                                        <view
                                            v-for="(g, gi) in msg.goods"
                                            :key="gi"
                                            class="aichat-goods-card flex-row"
                                            :data-value="goods_detail_url(g)"
                                            @tap="url_event"
                                        >
                                            <image v-if="g.images" class="aichat-goods-img" :src="g.images" mode="aspectFill"></image>
                                            <view v-else class="aichat-goods-img aichat-goods-img-empty"></view>
                                            <view class="aichat-goods-meta flex-1">
                                                <view class="aichat-goods-title">{{ g.title || $t('common.goods') }}</view>
                                                <view v-if="g.price !== '' && g.price !== null && g.price !== undefined" class="aichat-goods-price">
                                                    {{ g.show_price_symbol || '￥' }}{{ g.price }}
                                                </view>
                                            </view>
                                        </view>
                                    </view>

                                    <view v-if="msg.role === 'user'" class="aichat-msg-actions flex-row">
                                        <view class="aichat-msg-action" :data-index="idx" data-act="copy" @tap="msg_action_event">
                                            <iconfont name="icon-copy" size="28rpx" color="#8a919f"></iconfont>
                                        </view>
                                        <view class="aichat-msg-action" :data-index="idx" data-act="edit" @tap="msg_action_event">
                                            <iconfont name="icon-edit-two" size="28rpx" color="#8a919f"></iconfont>
                                        </view>
                                        <text v-if="message_time_text(msg)" class="aichat-msg-time">{{ message_time_text(msg) }}</text>
                                    </view>
                                    <view v-else-if="msg.role === 'bot' && !msg.typing" class="aichat-msg-actions flex-row">
                                        <view class="aichat-msg-action" :data-index="idx" data-act="copy" @tap="msg_action_event">
                                            <iconfont name="icon-copy" size="28rpx" color="#8a919f"></iconfont>
                                        </view>
                                        <view
                                            :class="'aichat-msg-action' + (msg.feedback === 1 ? ' is-on' : '')"
                                            :data-index="idx"
                                            data-act="like"
                                            @tap="msg_action_event"
                                        >
                                            <iconfont name="icon-givealike-o" size="28rpx" :color="msg.feedback === 1 ? '#7c3aed' : '#8a919f'"></iconfont>
                                        </view>
                                        <view
                                            :class="'aichat-msg-action is-dislike' + (msg.feedback === 2 ? ' is-on' : '')"
                                            :data-index="idx"
                                            data-act="dislike"
                                            @tap="msg_action_event"
                                        >
                                            <iconfont name="icon-givealike-o" size="28rpx" :color="msg.feedback === 2 ? '#7c3aed' : '#8a919f'"></iconfont>
                                        </view>
                                        <view
                                            :class="'aichat-msg-action' + (msg.regenerating ? ' is-spinning' : '')"
                                            :data-index="idx"
                                            data-act="regen"
                                            @tap="msg_action_event"
                                        >
                                            <iconfont name="icon-refresh" size="28rpx" color="#8a919f"></iconfont>
                                        </view>
                                        <text v-if="message_time_text(msg)" class="aichat-msg-time">{{ message_time_text(msg) }}</text>
                                    </view>

                                    <view
                                        v-if="msg.role === 'bot' && !msg.typing && !msg.regenerating && msg.suggests && msg.suggests.length && idx === last_bot_index"
                                        class="aichat-msg-suggests"
                                    >
                                        <view
                                            v-for="(sq, si) in msg.suggests"
                                            :key="si"
                                            class="aichat-msg-suggest"
                                            :data-question="sq"
                                            @tap="quick_ask_event"
                                        >{{ sq }} →</view>
                                    </view>
                                </view>
                            </view>
                        </block>
                        <view id="aichat-bottom-anchor"></view>
                        <!-- #ifdef MP -->
                        <view class="aichat-stage-fade-sticky"></view>
                        <!-- #endif -->
                    </view>
                    </scroll-view>
                    <!-- #ifndef MP -->
                    <view class="aichat-stage-fade"></view>
                    <!-- #endif -->
                    </view>
                <view class="aichat-composer">
                    <scroll-view v-if="!is_chatting && quick_questions.length" scroll-x class="aichat-quick-scroll">
                        <view class="aichat-quick-list flex-row">
                            <view
                                v-for="(q, qi) in quick_questions"
                                :key="qi"
                                class="aichat-quick-btn"
                                :data-question="q"
                                @tap="quick_ask_event"
                            >{{ q }}</view>
                        </view>
                    </scroll-view>
                    <view class="aichat-input-wrap">
                        <textarea
                            class="aichat-input"
                            :value="input_value"
                            :maxlength="1000"
                            :auto-height="true"
                            :show-confirm-bar="false"
                            :adjust-position="true"
                            :placeholder="$t('aichat.placeholder')"
                            placeholder-class="cr-grey-9"
                            @input="input_event"
                            @confirm="send_event"
                        ></textarea>
                        <view class="aichat-input-toolbar flex-row align-c jc-e">
                            <view
                                :class="'aichat-send-btn' + (can_send ? '' : ' is-disabled')"
                                @tap="send_event"
                            >
                                <iconfont name="icon-sending-surface" size="34rpx" color="#fff"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
                </view>
                </block>
            </view>

            <component-popup :propShow="revision_popup.show" propPosition="bottom" @onclose="close_revision_popup">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="oh padding-bottom-sm flex-row align-c">
                        <text class="flex-1 text-size fw-b aichat-revision-popup-title">{{ revision_popup.title }}</text>
                        <view class="margin-left-sm" @tap.stop="close_revision_popup">
                            <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <scroll-view :scroll-y="true" class="max-h-8h">
                        <view class="aichat-revision-popup-content padding-bottom-main">
                            <mp-html class="aichat-msg-text" :content="format_message_html(revision_popup.text)" :set-title="false"></mp-html>
                            <view v-if="revision_popup.goods && revision_popup.goods.length" class="aichat-goods-list">
                                <view
                                    v-for="(g, gi) in revision_popup.goods"
                                    :key="gi"
                                    class="aichat-goods-card flex-row"
                                    :data-value="goods_detail_url(g)"
                                    @tap="url_event"
                                >
                                    <image v-if="g.images" class="aichat-goods-img" :src="g.images" mode="aspectFill"></image>
                                    <view v-else class="aichat-goods-img aichat-goods-img-empty"></view>
                                    <view class="aichat-goods-meta flex-1">
                                        <view class="aichat-goods-title">{{ g.title || $t('common.goods') }}</view>
                                        <view v-if="g.price !== '' && g.price !== null && g.price !== undefined" class="aichat-goods-price">
                                            {{ g.show_price_symbol || '￥' }}{{ g.price }}
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </component-popup>

            <component-common ref="common" :propIsFooterSeat="false"></component-common>
        </block>
    </view>
</template>

<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';
    import pluginLocale from '../locale/index.js';

    const STORAGE_KEY = 'plugins_aichat_consult_sessions_v1';
    const GUEST_TOKEN_KEY = 'plugins_aichat_guest_token';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                page_loading: true,
                is_enabled: 0,
                is_login: 0,
                use_remote: true,
                application_name: this.$t('pages.plugins-aichat-index'),
                logo: '',
                welcome: '',
                desc: '',
                quick_questions: [],
                welcome_title: '',
                thinking_text: this.$t('aichat.thinking'),
                session_loading_text: this.$t('aichat.session_loading'),
                page_size: 20,
                history_page: 1,
                history_has_more: false,
                history_loading_more: false,
                history_more_show: false,
                msg_has_more: false,
                msg_loading_more: false,
                msg_more_show: false,
                msg_guest_start: 0,
                main_title: this.$t('aichat.new_session'),
                sidebar_open: false,
                sidebar_closing: false,
                is_chatting: false,
                session_loading: false,
                asking: false,
                is_typing: false,
                input_value: '',
                current_id: '',
                sessions: [],
                messages: [],
                goods_context_keywords: '',
                scroll_into: '',
                scroll_top: 0,
                scroll_animate: false,
                keep_msg_index: -1,
                detail_req_seq: 0,
                params: {},
                revision_popup: {
                    show: false,
                    title: '',
                    text: '',
                    goods: [],
                },
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentPopup,
        },
        computed: {
            can_send() {
                // 仅请求中禁用发送；打字动画中可继续提问
                return !this.asking && String(this.input_value || '').trim() !== '';
            },
            // 思考中文案拆成单字（渐变动画）
            thinking_chars() {
                var text = String(this.thinking_text || this.$t('aichat.thinking'));
                return text.split('');
            },
            // 最后一条机器人消息下标（用于追问展示）
            last_bot_index() {
                for (var i = this.messages.length - 1; i >= 0; i--) {
                    if (this.messages[i] && this.messages[i].role === 'bot') {
                        return i;
                    }
                }
                return -1;
            },
            // 历史侧栏当前展示的会话
            displayed_sessions() {
                if (this.use_remote) {
                    return this.sessions || [];
                }
                var n = (this.page_size || 20) * (this.history_page || 1);
                return (this.sessions || []).slice(0, n);
            },
            // 历史侧栏是否还可加载更多
            history_can_more() {
                if (this.use_remote) {
                    return !!this.history_has_more;
                }
                var n = (this.page_size || 20) * (this.history_page || 1);
                return (this.sessions || []).length > n;
            },
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 读取入口会话 id（路由参数；H5 还可从地址栏 ?id= 同步）
            var url_id = (params && params.id) ? String(params.id) : '';
            // #ifdef H5
            if (!url_id) {
                url_id = this.read_url_consult_id();
            }
            // #endif

            // 设置参数
            this.setData({
                params: params || {},
                current_id: url_id,
            });

            // 登录态会话保存串行链
            this.save_chain = Promise.resolve();

            // 初始化页面数据
            this.init_page();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 页面卸载
        onUnload() {
            this.stop_typewrite();
        },

        methods: {
            // 会话 id 是否相同（统一转字符串比较）
            same_id(a, b) {
                return String(a || '') === String(b || '');
            },
            // 游客身份令牌（小程序无 Cookie，需随请求带上）
            guest_token() {
                try {
                    return String(uni.getStorageSync(GUEST_TOKEN_KEY) || '');
                } catch (e) {
                    return '';
                }
            },
            // 保存服务端下发的游客令牌
            save_guest_token(token) {
                var t = String(token || '').trim();
                if (!t) {
                    return;
                }
                try {
                    uni.setStorageSync(GUEST_TOKEN_KEY, t);
                } catch (e) {}
            },
            // 请求体附带游客令牌（登录后也可带，服务端按 user_id 优先）
            guest_payload(data) {
                var out = data || {};
                var t = this.guest_token();
                if (t) {
                    out.guest_token = t;
                }
                return out;
            },
            // H5：从地址栏读取当前历史会话 id（与 PC ?id= 一致）
            read_url_consult_id() {
                // #ifdef H5
                try {
                    var href = window.location.href || '';
                    var hash_idx = href.indexOf('#');
                    if (hash_idx >= 0) {
                        var hash = href.slice(hash_idx + 1);
                        var q_idx = hash.indexOf('?');
                        if (q_idx < 0) {
                            return '';
                        }
                        return String(new URLSearchParams(hash.slice(q_idx + 1)).get('id') || '').trim();
                    }
                    return String(new URLSearchParams(window.location.search || '').get('id') || '').trim();
                } catch (e) {
                    return '';
                }
                // #endif
                // #ifndef H5
                return '';
                // #endif
            },
            // H5：将当前会话 id 写入地址栏（replaceState，不产生历史记录）
            set_url_consult_id(id) {
                // #ifdef H5
                try {
                    id = id === undefined || id === null ? '' : String(id);
                    var href = window.location.href || '';
                    var hash_idx = href.indexOf('#');
                    var next = href;
                    if (hash_idx >= 0) {
                        var base = href.slice(0, hash_idx);
                        var hash = href.slice(hash_idx + 1);
                        var q_idx = hash.indexOf('?');
                        var path = q_idx >= 0 ? hash.slice(0, q_idx) : hash;
                        var query = q_idx >= 0 ? hash.slice(q_idx + 1) : '';
                        var params = new URLSearchParams(query);
                        if (id === '') {
                            params.delete('id');
                        } else {
                            params.set('id', id);
                        }
                        var qs = params.toString();
                        next = base + '#' + path + (qs ? '?' + qs : '');
                    } else {
                        var url = new URL(href);
                        if (id === '') {
                            url.searchParams.delete('id');
                        } else {
                            url.searchParams.set('id', id);
                        }
                        next = url.pathname + url.search + url.hash;
                    }
                    if (next !== href) {
                        window.history.replaceState(null, '', next);
                    }
                } catch (e) {}
                // #endif
            },
            // 标题截断
            truncate_title(text, max) {
                text = String(text || '').trim() || this.$t('aichat.new_session');
                max = max || 18;
                return text.length > max ? text.slice(0, max) + '...' : text;
            },

            // HTML 转义
            escape_html(text) {
                return String(text || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            },
            // 仅允许 http(s) 图片地址
            is_safe_http_url(url) {
                url = String(url || '');
                if (!/^https?:\/\//i.test(url) || url.length > 2000) {
                    return false;
                }
                if (/[\s<>"']/.test(url) || /^(javascript|data|vbscript):/i.test(url)) {
                    return false;
                }
                return true;
            },
            // 仅允许 http(s) 图片地址
            is_safe_image_url(url) {
                return this.is_safe_http_url(url);
            },
            is_image_file_url(url) {
                return /\.(?:png|jpe?g|gif|webp|bmp)(?:[?#]|$)/i.test(String(url || ''));
            },
            // 简易 Markdown 转 HTML（图片 / 链接 / 加粗 / 斜体 / 代码 / 换行）
            format_message_html(text) {
                var raw = String(text || '');
                var slots = [];
                var self = this;
                var push_img = function (alt, url) {
                    url = String(url || '').replace(/[)\\s.,;]+$/g, '');
                    if (!self.is_safe_image_url(url)) {
                        return '';
                    }
                    slots.push({
                        type: 'img',
                        alt: alt ? String(alt) : self.$t('common.image'),
                        url: url,
                    });
                    return '@@AICHATIMG' + (slots.length - 1) + '@@';
                };
                var push_link = function (label, url) {
                    url = String(url || '').replace(/[)\\s.,;]+$/g, '');
                    if (!self.is_safe_http_url(url)) {
                        return '';
                    }
                    slots.push({
                        type: 'link',
                        text: label ? String(label) : url,
                        url: url,
                    });
                    return '@@AICHATIMG' + (slots.length - 1) + '@@';
                };
                raw = raw.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi, function (all, alt, url) {
                    var token = push_img(alt, url);
                    return token || all;
                });
                // [标题](图片地址) 也按图片展示；其它 [标题](网址) 做成可点击链接
                raw = raw.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi, function (all, label, url) {
                    var token = self.is_image_file_url(url) ? push_img(label, url) : push_link(label, url);
                    return token || all;
                });
                raw = raw.replace(/(^|[\s])(https?:\/\/[^\s<>"']+\.(?:png|jpe?g|gif|webp|bmp)(?:\?[^\s<>"']*)?)/gi, function (all, pre, url) {
                    var token = push_img(self.$t('common.image'), url);
                    return token ? (pre + token) : all;
                });
                var html = this.escape_html(raw);
                html = html.replace(/@@AICHATIMG(\d+)@@/g, function (_, idx) {
                    var item = slots[parseInt(idx, 10)];
                    if (!item) {
                        return '';
                    }
                    if (item.type === 'link') {
                        return '<a class="aichat-msg-link" href="' + self.escape_html(item.url) + '">' + self.escape_html(item.text) + '</a>';
                    }
                    var src = self.escape_html(item.url);
                    var alt = self.escape_html(item.alt);
                    return '<img class="aichat-msg-image" src="' + src + '" alt="' + alt + '" style="max-width:240px;max-height:240px;width:auto;height:auto;display:block;margin:8px 0;border-radius:10px;background:#f3f4f6;" />';
                });
                html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
                html = html.replace(/(^|[^\*])\*([^\*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');
                html = html.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
                html = html.replace(/\n/g, '<br/>');
                return html;
            },
            // 规范化历史回答列表
            clean_revisions(list) {
                if (!Array.isArray(list)) {
                    return [];
                }
                var out = [];
                for (var i = 0; i < list.length; i++) {
                    var item = list[i] || {};
                    var text = String(item.text || '').trim();
                    if (!text) {
                        continue;
                    }
                    out.push({
                        text: text,
                        goods: Array.isArray(item.goods) ? item.goods : [],
                        time: this.answer_time_of(item),
                        open: !!item.open,
                    });
                    if (out.length >= 8) {
                        break;
                    }
                }
                return out;
            },
            // 回答产生时间（秒）
            answer_time_of(m) {
                var t = parseInt((m && m.time) || 0, 10) || 0;
                if (t > 9999999999) {
                    t = Math.floor(t / 1000);
                }
                return t > 0 ? t : 0;
            },
            // 历史回答一行摘要（去掉图片 markdown）
            revision_plain_text(text) {
                return String(text || '')
                    .replace(/!\[[^\]]*\]\(https?:\/\/[^\s)]+\)/gi, ' ')
                    .replace(/https?:\/\/[^\s<>"']+\.(?:png|jpe?g|gif|webp|bmp)(?:\?[^\s<>"']*)?/gi, ' ')
                    .replace(/[*_`#]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            },
            // 补零
            pad_time(n) {
                n = parseInt(n, 10) || 0;
                return n < 10 ? ('0' + n) : String(n);
            },
            // 历史回答时间
            format_revision_time(sec) {
                sec = parseInt(sec, 10) || 0;
                if (sec <= 0) {
                    return '';
                }
                if (sec > 9999999999) {
                    sec = Math.floor(sec / 1000);
                }
                var d = new Date(sec * 1000);
                if (isNaN(d.getTime())) {
                    return '';
                }
                return d.getFullYear() + '-' + this.pad_time(d.getMonth() + 1) + '-' + this.pad_time(d.getDate()) + ' ' +
                    this.pad_time(d.getHours()) + ':' + this.pad_time(d.getMinutes()) + ':' + this.pad_time(d.getSeconds());
            },
            // 第 N 版 · 时间
            revision_ver_text(rev, index) {
                var time_text = this.format_revision_time(rev && rev.time);
                var suffix = this.$t('aichat.revision_suffix');
                return this.$t('aichat.revision_prefix') + ' ' + (index + 1) + (suffix ? (' ' + suffix) : '') + (time_text ? (' · ' + time_text) : '');
            },
            // 当前消息时间
            message_time_text(msg) {
                return this.format_revision_time(msg && msg.time);
            },
            // 展开 / 收起历史回答
            toggle_revision_event(e) {
                var msg_idx = parseInt(e.currentTarget.dataset.msgIndex, 10);
                var rev_idx = parseInt(e.currentTarget.dataset.revIndex, 10);
                if (!this.messages[msg_idx] || !Array.isArray(this.messages[msg_idx].revisions) || !this.messages[msg_idx].revisions[rev_idx]) {
                    return;
                }
                var list = this.messages.slice();
                var msg = Object.assign({}, list[msg_idx]);
                var revisions = msg.revisions.slice();
                revisions[rev_idx] = Object.assign({}, revisions[rev_idx], { open: !revisions[rev_idx].open });
                msg.revisions = revisions;
                list[msg_idx] = msg;
                this.setData({ messages: list });
            },
            // 查看全部历史回答
            view_revision_event(e) {
                var msg_idx = parseInt(e.currentTarget.dataset.msgIndex, 10);
                var rev_idx = parseInt(e.currentTarget.dataset.revIndex, 10);
                var msg = this.messages[msg_idx];
                if (!msg || !Array.isArray(msg.revisions) || !msg.revisions[rev_idx]) {
                    return;
                }
                var rev = msg.revisions[rev_idx];
                this.setData({
                    revision_popup: {
                        show: true,
                        title: this.revision_ver_text(rev, rev_idx),
                        text: rev.text || '',
                        goods: Array.isArray(rev.goods) ? rev.goods : [],
                    },
                });
            },
            // 关闭历史回答弹层
            close_revision_popup() {
                this.setData({
                    revision_popup: {
                        show: false,
                        title: '',
                        text: '',
                        goods: [],
                    },
                });
            },
            // 找到机器人消息对应的用户问题
            paired_user_question(bot_idx) {
                for (var i = bot_idx - 1; i >= 0; i--) {
                    if (this.messages[i] && this.messages[i].role === 'user' && String(this.messages[i].text || '').trim()) {
                        return String(this.messages[i].text).trim();
                    }
                }
                return '';
            },
            // 商品详情跳转地址
            goods_detail_url(g) {
                var id = parseInt((g && g.id) || 0, 10) || 0;
                return id > 0 ? '/pages/goods-detail/goods-detail?id=' + id : '';
            },
            // 统一 url 跳转事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 生成游客会话 id
            uid() {
                return 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
            },
            // 生成游客消息 id
            msg_uid() {
                return 'm_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
            },
            // 读取本地游客会话列表
            load_local_sessions() {
                try {
                    var raw = uni.getStorageSync(STORAGE_KEY);
                    var list = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : [];
                    return Array.isArray(list) ? list : [];
                } catch (e) {
                    return [];
                }
            },
            // 保存本地游客会话列表（最多 50 条）
            save_local_sessions_list(list) {
                try {
                    uni.setStorageSync(STORAGE_KEY, (list || []).slice(0, 50));
                } catch (e) {}
            },
            // 清空本地游客会话
            clear_local_sessions() {
                try {
                    uni.removeStorageSync(STORAGE_KEY);
                } catch (e) {}
            },
            // 按 id 查找当前列表中的会话
            find_session(id) {
                for (var i = 0; i < this.sessions.length; i++) {
                    if (this.same_id(this.sessions[i].id, id)) {
                        return this.sessions[i];
                    }
                }
                return null;
            },
            // 根据首条用户消息推导会话标题
            derive_title(msgs) {
                for (var i = 0; i < (msgs || []).length; i++) {
                    if (msgs[i].role === 'user' && String(msgs[i].text || '').trim()) {
                        return this.truncate_title(msgs[i].text, 30);
                    }
                }
                return this.$t('aichat.new_session');
            },
            // 记录消息区当前滚动位置
            on_msg_scroll(e) {
                var top = e && e.detail ? Number(e.detail.scrollTop || 0) : 0;
                if (!isNaN(top)) {
                    this._msg_scroll_top = top;
                }
            },
            // 测量消息区内容高度、滚动位置、「查看更多」行高
            measure_msg_scroll(cb) {
                uni.createSelectorQuery().in(this)
                    .select('.aichat-stage')
                    .scrollOffset()
                    .select('.aichat-messages')
                    .boundingClientRect()
                    .select('.aichat-msg-more')
                    .boundingClientRect()
                    .exec((res) => {
                        var stage = res && res[0] ? res[0] : {};
                        var top = typeof stage.scrollTop === 'number' ? stage.scrollTop : (this._msg_scroll_top || 0);
                        // 优先用滚动内容总高（含「查看更多」），boundingClientRect 往往只是可视高度
                        var height = 0;
                        if (typeof stage.scrollHeight === 'number' && stage.scrollHeight > 0) {
                            height = stage.scrollHeight;
                        } else if (res && res[1] && res[1].height) {
                            height = res[1].height;
                        }
                        var more = res && res[2] && res[2].height ? res[2].height : 0;
                        cb(height, top, more);
                    });
            },
            // 仅测量消息区内容高度与「查看更多」行高
            measure_msg_content(cb) {
                this.measure_msg_scroll(function (height, top, more) {
                    cb(height, more);
                });
            },
            // 还原消息区滚动位置
            restore_msg_scroll(keep) {
                var self = this;
                keep = Math.max(0, Number(keep) || 0);
                // 同值不滚动，先微偏再设回目标
                self.setData({
                    scroll_into: '',
                    scroll_animate: false,
                    scroll_top: keep + 0.01,
                });
                self.$nextTick(function () {
                    self.setData({
                        scroll_top: keep,
                        scroll_animate: false,
                    });
                    self._msg_scroll_top = keep;
                });
            },
            // 前置更早消息后保持当前阅读位置
            keep_msg_scroll_after_prepend(old_height, old_top, keep_index, old_more) {
                var self = this;
                this.$nextTick(function () {
                    setTimeout(function () {
                        self.measure_msg_scroll(function (new_height, new_top, new_more) {
                            old_more = old_more || 0;
                            new_more = new_more || 0;
                            var grown = Math.max(0, (new_height || 0) - (old_height || 0));
                            // 内容总高已含「查看更多」；按钮显隐/加载中变高时再补行高差
                            var keep = (old_top || 0) + grown + (old_more - new_more);
                            if (grown < 8 && keep_index >= 0) {
                                self.setData({
                                    keep_msg_index: keep_index,
                                    scroll_into: '',
                                    scroll_animate: false,
                                });
                                self.$nextTick(function () {
                                    self.setData({
                                        scroll_into: 'aichat-keep-pos',
                                        scroll_animate: false,
                                    });
                                    self.$nextTick(function () {
                                        setTimeout(function () {
                                            self.measure_msg_scroll(function (h, top) {
                                                self.setData({ scroll_into: '', keep_msg_index: -1 });
                                                // into-view 会把旧首条顶到视口最上，需退回「查看更多」那一行的高度
                                                self.restore_msg_scroll(Math.max(0, (top || 0) - old_more));
                                            });
                                        }, 30);
                                    });
                                });
                                return;
                            }
                            self.setData({ keep_msg_index: -1 });
                            self.restore_msg_scroll(keep);
                        });
                    }, 30);
                });
            },
            // 滚动到消息列表底部
            scroll_bottom(opts) {
                opts = opts || {};
                var self = this;
                var delays = Array.isArray(opts.delays) ? opts.delays : [0, 80, 220, 480];
                var animate = opts.animate === true;
                if (this._scroll_bottom_timers && this._scroll_bottom_timers.length) {
                    this._scroll_bottom_timers.forEach(function (t) {
                        clearTimeout(t);
                    });
                }
                this._scroll_bottom_timers = [];
                var run = function () {
                    // scroll-into-view 同值不生效，需先清空再设
                    self.setData({ scroll_into: '', scroll_animate: animate });
                    self.$nextTick(function () {
                        self._scroll_top_seed = (self._scroll_top_seed || 0) + 1;
                        self.setData({
                            scroll_into: 'aichat-bottom-anchor',
                            // scroll-top 变更才能强制滚到底（兼容部分端 scroll-into-view 失效）
                            scroll_top: 99999 + self._scroll_top_seed,
                            scroll_animate: animate,
                        });
                    });
                };
                delays.forEach(function (ms) {
                    if (!ms) {
                        run();
                    } else {
                        self._scroll_bottom_timers.push(setTimeout(run, ms));
                    }
                });
            },
            // 停止打字机动画；complete=true 时立即补全当前回复
            stop_typewrite(complete) {
                if (this._type_timer) {
                    clearTimeout(this._type_timer);
                    this._type_timer = null;
                }
                this._typing_active = false;
                var ctx = this._typewrite_ctx;
                this._typewrite_ctx = null;
                if (complete && ctx) {
                    var list = this.messages.slice();
                    var idx = ctx.msg_index;
                    var text = ctx.text;
                    var extras = ctx.extras || {};
                    // 以当前消息为底，避免打字结束覆盖用户刚点的赞/踩
                    var cur = (this.messages[idx] && this.messages[idx].role === 'bot') ? this.messages[idx] : null;
                    if (cur) {
                        list[idx] = Object.assign({}, cur, {
                            text: text,
                            display_text: text,
                            typing: false,
                            regenerating: false,
                            mid: extras.mid || cur.mid || '',
                            feedback: parseInt(cur.feedback || 0, 10) || 0,
                            goods: extras.goods || cur.goods || [],
                            suggests: extras.suggests || cur.suggests || [],
                            revisions: extras.revisions !== undefined ? extras.revisions : (cur.revisions || []),
                            time: extras.time || cur.time || Math.floor(Date.now() / 1000),
                        });
                    }
                    this.setData({
                        messages: list,
                        asking: false,
                        is_typing: false,
                    });
                    if (typeof extras.onDone === 'function') {
                        extras.onDone();
                    }
                    this.scroll_bottom();
                    return;
                }
                if (this.is_typing) {
                    this.setData({ is_typing: false });
                }
            },
            // 机器人回复打字机效果
            typewrite_bot_answer(msg_index, full_text, extras) {
                extras = extras || {};
                this.stop_typewrite(false);
                var text = String(full_text || '');
                this._typewrite_ctx = { msg_index: msg_index, text: text, extras: extras };
                this._typing_active = true;
                // 接口已返回：解除发送锁定，打字动画不阻塞下一条提问
                this.setData({ is_typing: true, asking: false });
                var i = 0;
                var total = text.length;
                var step = total > 400 ? 4 : (total > 180 ? 2 : 1);
                var delay = total > 400 ? 12 : (total > 180 ? 16 : 22);
                var self = this;
                var tick_count = 0;

                function finish() {
                    self._type_timer = null;
                    self._typing_active = false;
                    self._typewrite_ctx = null;
                    var list = self.messages.slice();
                    // 以最新消息为底，保留点赞（避免与点赞 setData 竞态被覆盖）
                    var cur = (self.messages[msg_index] && self.messages[msg_index].role === 'bot') ? self.messages[msg_index] : null;
                    if (cur) {
                        list[msg_index] = Object.assign({}, cur, {
                            text: text,
                            display_text: text,
                            typing: false,
                            regenerating: false,
                            mid: extras.mid || cur.mid || '',
                            feedback: parseInt(cur.feedback || 0, 10) || 0,
                            goods: extras.goods || cur.goods || [],
                            suggests: extras.suggests || cur.suggests || [],
                            revisions: extras.revisions !== undefined ? extras.revisions : (cur.revisions || []),
                            time: extras.time || cur.time || Math.floor(Date.now() / 1000),
                        });
                    }
                    self.setData({
                        messages: list,
                        asking: false,
                        is_typing: false,
                    });
                    if (typeof extras.onDone === 'function') {
                        extras.onDone();
                    }
                    self.scroll_bottom();
                }

                function tick() {
                    if (!self._typing_active) {
                        return;
                    }
                    i = Math.min(total, i + step);
                    tick_count++;
                    var cur = self.messages[msg_index];
                    if (!cur || cur.role !== 'bot') {
                        self._typing_active = false;
                        self._typewrite_ctx = null;
                        self.setData({ is_typing: false, asking: false });
                        return;
                    }
                    var list = self.messages.slice();
                    list[msg_index] = Object.assign({}, cur, {
                        display_text: text.slice(0, i),
                        typing: true,
                        feedback: parseInt(cur.feedback || 0, 10) || 0,
                    });
                    self.setData({ messages: list });
                    if (tick_count % 3 === 0 || i >= total) {
                        self.scroll_bottom();
                    }
                    if (i >= total) {
                        finish();
                        return;
                    }
                    self._type_timer = setTimeout(tick, delay);
                }

                if (total === 0) {
                    finish();
                    return;
                }
                tick();
            },
            // 打开历史侧栏
            open_sidebar() {
                if (this._sidebar_close_timer) {
                    clearTimeout(this._sidebar_close_timer);
                    this._sidebar_close_timer = null;
                }
                this.setData({ sidebar_closing: false, sidebar_open: true });
            },
            // 关闭历史侧栏（带动画）
            close_sidebar() {
                if (!this.sidebar_open) {
                    this.setData({ sidebar_closing: false });
                    return;
                }
                if (this._sidebar_close_timer) {
                    clearTimeout(this._sidebar_close_timer);
                    this._sidebar_close_timer = null;
                }
                this.setData({ sidebar_open: false, sidebar_closing: true });
                this._sidebar_close_timer = setTimeout(() => {
                    this.setData({ sidebar_closing: false });
                    this._sidebar_close_timer = null;
                }, 240);
            },
            // 输入框内容变化
            input_event(e) {
                this.setData({ input_value: e.detail.value });
            },
            // 快捷问题点击
            quick_ask_event(e) {
                var q = (e.currentTarget.dataset.question || '').trim();
                if (q) {
                    this.send_question(q);
                }
            },
            // 发送按钮 / 键盘确认
            send_event() {
                this.send_question(this.input_value);
            },
            // 初始化页面（咨询配置、会话列表、入口详情）
            init_page() {
                var self = this;
                var boot_id = this.current_id || this.read_url_consult_id() || '';
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'aichat'),
                    method: 'POST',
                    data: this.guest_payload(boot_id ? { id: boot_id, consult_id: boot_id } : {}),
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0 && res.data.data) {
                            var d = res.data.data;
                            self.save_guest_token(d.guest_token);
                            var is_login = parseInt(d.is_login || 0) === 1 ? 1 : 0;
                            var sessions_need_refresh = false;
                            // 以本地登录态为准，避免 token 场景下服务端未识别
                            if (!is_login && (app.globalData.get_user_cache_info() || null) != null) {
                                is_login = 1;
                                // 服务端未识别登录时 sessions 为空，启动后再拉一次列表
                                sessions_need_refresh = true;
                            }
                            self._sessions_need_refresh = sessions_need_refresh;
                            var sessions = [];
                            if (Array.isArray(d.sessions)) {
                                sessions = d.sessions.map((row) => ({
                                    id: row.id,
                                    title: row.title || this.$t('aichat.new_session'),
                                    updated_at: row.updated_at || row.upd_time || 0,
                                    messages: null,
                                }));
                            }
                            // 初始化已带详情：写入缓存，进页免再拉 consultdetail
                            if (d.session_detail && d.session_detail.consult) {
                                var did = d.session_detail.consult.id;
                                var dtitle = d.session_detail.consult.title || this.$t('aichat.new_session');
                                var dmsgs = Array.isArray(d.session_detail.messages) ? d.session_detail.messages : [];
                                var dmore = parseInt(d.session_detail.has_more || 0, 10) === 1;
                                var hit = false;
                                sessions = sessions.map((s) => {
                                    if (String(s.id) === String(did)) {
                                        hit = true;
                                        return Object.assign({}, s, { title: dtitle, messages: dmsgs, has_more: dmore });
                                    }
                                    return s;
                                });
                                if (!hit) {
                                    sessions.unshift({ id: did, title: dtitle, updated_at: Date.now(), messages: dmsgs, has_more: dmore });
                                }
                                self._boot_session_detail_id = String(did);
                            } else {
                                self._boot_session_detail_id = '';
                            }
                            self.setData({
                                page_loading: false,
                                is_enabled: parseInt(d.is_enabled || 0),
                                is_login: is_login,
                                application_name: d.application_name || this.$t('pages.plugins-aichat-index'),
                                logo: d.logo || '',
                                welcome: d.welcome || '',
                                welcome_title: d.welcome_title || '',
                                thinking_text: d.thinking_text || this.$t('aichat.thinking'),
                                session_loading_text: d.session_loading_text || this.$t('aichat.session_loading'),
                                page_size: parseInt(d.page_size || 20, 10) || 20,
                                history_has_more: parseInt(d.sessions_has_more || 0, 10) === 1,
                                history_page: 1,
                                desc: d.desc || '',
                                quick_questions: Array.isArray(d.quick_questions) ? d.quick_questions : [],
                                sessions: sessions,
                            });
                            uni.setNavigationBarTitle({ title: d.application_name || self.$t('pages.plugins-aichat-index') });
                            if (parseInt(d.is_enabled || 0) === 1) {
                                self.boot_sessions();
                            }
                        } else {
                            self.setData({ page_loading: false, is_enabled: 0 });
                            if (app.globalData.is_login_check(res.data, self, 'init_page')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        self.setData({ page_loading: false, is_enabled: 0 });
                        app.globalData.showToast(self.$t('common.internet_error_tips'));
                    },
                });
            },
            // 启动会话：打开入口会话或进入新对话
            boot_sessions() {
                var self = this;
                if (this.current_id) {
                    this.setData({
                        is_chatting: true,
                        session_loading: true,
                        main_title: this.$t('common.loading_in_text'),
                        messages: [],
                    });
                }
                var finish = () => {
                    var id = self.current_id || self.read_url_consult_id();
                    if (id) {
                        self.open_session(id);
                    } else {
                        self.set_url_consult_id('');
                        self.setData({ is_chatting: false, session_loading: false, main_title: this.$t('aichat.new_session') });
                    }
                };
                if (self._sessions_need_refresh) {
                    self._sessions_need_refresh = false;
                    self.refresh_remote_list(finish);
                } else {
                    finish();
                }
            },
            // 刷新服务端会话列表
            refresh_remote_list(done, append) {
                var self = this;
                var page = append ? (this.history_page + 1) : 1;
                uni.request({
                    url: app.globalData.get_request_url('consultlist', 'index', 'aichat'),
                    method: 'POST',
                    data: this.guest_payload({ page: page }),
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0 && res.data.data && Array.isArray(res.data.data.list)) {
                            self.save_guest_token(res.data.data.guest_token);
                            var rows = res.data.data.list.map((row) => ({
                                id: row.id,
                                title: row.title || this.$t('aichat.new_session'),
                                updated_at: row.updated_at || 0,
                                messages: null,
                            }));
                            var sessions = self.sessions.slice();
                            if (append) {
                                var exist_ids = {};
                                sessions.forEach((s) => { exist_ids[String(s.id)] = true; });
                                rows.forEach((row) => {
                                    if (!exist_ids[String(row.id)]) {
                                        sessions.push(row);
                                    }
                                });
                            } else {
                                sessions = rows;
                            }
                            self.setData({
                                sessions: sessions,
                                history_page: append ? page : 1,
                                history_has_more: parseInt(res.data.data.has_more || 0, 10) === 1,
                            });
                        } else if (res.data.code == -400) {
                            self.setData({
                                is_login: 0,
                                history_page: 1,
                            });
                        }
                    },
                    complete: () => {
                        typeof done === 'function' && done();
                    },
                });
            },
            // 开启新对话
            start_new_chat() {
                this.stop_typewrite();
                this.set_url_consult_id('');
                this.setData({
                    current_id: '',
                    messages: [],
                    is_chatting: false,
                    session_loading: false,
                    asking: false,
                    goods_context_keywords: '',
                    input_value: '',
                    main_title: this.$t('aichat.new_session'),
                    welcome_title: this.welcome_title || '',
                    sidebar_open: false,
                    scroll_into: '',
                    msg_has_more: false,
                    msg_more_show: false,
                    msg_guest_start: 0,
                });
            },
            // 历史列表点击打开会话
            open_session_event(e) {
                var id = e.currentTarget.dataset.id;
                this.open_session(id);
            },
            // 游客消息按分页条数截取最近一页
            slice_guest_messages(all) {
                all = Array.isArray(all) ? all : [];
                var size = this.page_size || 20;
                var start = Math.max(0, all.length - size);
                return {
                    list: all.slice(start),
                    has_more: start > 0,
                    start: start,
                };
            },
            // 消息区加载更早一页
            load_more_messages() {
                if (this.msg_loading_more || !this.msg_has_more) {
                    return;
                }
                var self = this;
                if (!this.use_remote) {
                    var session = this.find_session(this.current_id);
                    if (!session || !Array.isArray(session.messages) || this.msg_guest_start <= 0) {
                        this.setData({ msg_has_more: false, msg_more_show: false });
                        return;
                    }
                    this.measure_msg_scroll(function (old_height, old_top, old_more) {
                        var size = self.page_size || 20;
                        var next_start = Math.max(0, self.msg_guest_start - size);
                        var older = self.normalize_messages(session.messages.slice(next_start, self.msg_guest_start));
                        self.setData({
                            messages: older.concat(self.messages || []),
                            msg_guest_start: next_start,
                            msg_has_more: next_start > 0,
                            msg_more_show: next_start > 0,
                            keep_msg_index: older.length,
                            scroll_into: '',
                            scroll_animate: false,
                        }, function () {
                            self.keep_msg_scroll_after_prepend(old_height, old_top, older.length, old_more);
                        });
                    });
                    return;
                }
                // 先量「查看更多」完整高度，再切到加载中，避免行高差把内容顶上去
                this.measure_msg_scroll(function (old_height, old_top, old_more) {
                    self._msg_keep_height = old_height;
                    self._msg_keep_top = old_top;
                    self._msg_keep_more = old_more;
                    self.setData({ msg_loading_more: true, msg_more_show: false, scroll_into: '' });
                    self.fetch_session_detail(self.current_id, true, true);
                });
            },
            // 历史侧栏加载下一页
            load_history_more() {
                if (!this.history_can_more) {
                    return;
                }
                if (!this.use_remote) {
                    this.setData({ history_page: this.history_page + 1 });
                    return;
                }
                if (this.history_loading_more) {
                    return;
                }
                this.setData({ history_loading_more: true });
                var self = this;
                this.refresh_remote_list(function () {
                    self.setData({ history_loading_more: false });
                }, true);
            },
            // 打开指定会话（优先缓存再拉详情）
            open_session(id) {
                id = id === undefined || id === null ? '' : String(id);
                if (!id) return;
                this.stop_typewrite();
                this.close_sidebar();
                this.set_url_consult_id(id);
                this.setData({ asking: false, goods_context_keywords: '', msg_more_show: false });

                if (!this.use_remote) {
                    var session = this.find_session(id);
                    if (!session) return;
                    var sliced = this.slice_guest_messages(session.messages || []);
                    this.setData({
                        current_id: id,
                        messages: this.normalize_messages(sliced.list),
                        msg_has_more: sliced.has_more,
                        msg_guest_start: sliced.start,
                        is_chatting: true,
                        session_loading: false,
                        main_title: session.title || this.$t('aichat.new_session'),
                    });
                    this.restore_goods_context();
                    this.scroll_bottom({ delays: [50, 160, 360, 700] });
                    return;
                }

                var exist = this.find_session(id);
                this.setData({ current_id: id, main_title: (exist && exist.title) || this.$t('common.loading_in_text') });
                if (exist && Array.isArray(exist.messages) && exist.messages.length) {
                    this.setData({
                        messages: this.normalize_messages(exist.messages),
                        msg_has_more: !!exist.has_more,
                        is_chatting: true,
                        session_loading: false,
                    });
                    this.restore_goods_context();
                    this.scroll_bottom({ delays: [50, 160, 360, 700] });
                    this._boot_session_detail_id = '';
                    return;
                }
                this.setData({
                    messages: [],
                    is_chatting: true,
                    session_loading: true,
                    msg_has_more: false,
                });
                this.fetch_session_detail(id, false);
            },
            // 规范化消息结构（接口字段为 id，前端统一用 mid）
            normalize_messages(list) {
                // 与 PC 一致：接口字段是 id，页面统一用 mid（刷新后才能继续点赞入库）
                return (list || []).map((m) => {
                    var mid = '';
                    if (m.mid !== undefined && m.mid !== null && String(m.mid) !== '') {
                        mid = String(m.mid);
                    } else if (m.id !== undefined && m.id !== null && String(m.id) !== '') {
                        mid = String(m.id);
                    }
                    var feedback = parseInt(m.feedback || 0, 10) || 0;
                    if (feedback !== 1 && feedback !== 2) {
                        feedback = 0;
                    }
                    return {
                        role: m.role === 'user' ? 'user' : 'bot',
                        text: m.text || '',
                        mid: mid,
                        feedback: feedback,
                        goods: Array.isArray(m.goods) ? m.goods : [],
                        suggests: Array.isArray(m.suggests) ? m.suggests : [],
                        revisions: this.clean_revisions(m.revisions),
                        time: this.answer_time_of(m),
                    };
                });
            },
            // 拉取会话详情
            fetch_session_detail(id, silent, append) {
                var self = this;
                var req_id = ++this.detail_req_seq;
                var before_id = 0;
                if (append) {
                    var first = null;
                    var msgs = this.messages || [];
                    for (var fi = 0; fi < msgs.length; fi++) {
                        if (msgs[fi] && msgs[fi].role !== 'loading' && /^\d+$/.test(String(msgs[fi].mid || ''))) {
                            first = msgs[fi];
                            break;
                        }
                    }
                    before_id = first ? parseInt(first.mid, 10) : 0;
                    if (!before_id) {
                        this.setData({ msg_has_more: false, msg_more_show: false, msg_loading_more: false });
                        return;
                    }
                }
                uni.request({
                    url: app.globalData.get_request_url('consultdetail', 'index', 'aichat'),
                    method: 'POST',
                    data: this.guest_payload({ consult_id: id, before_id: before_id }),
                    dataType: 'json',
                    success: (res) => {
                        if (req_id !== self.detail_req_seq) return;
                        if (!(res.data.code == 0 && res.data.data)) {
                            if (append) {
                                self.setData({ msg_loading_more: false });
                                return;
                            }
                            if (!silent) {
                                app.globalData.showToast((res.data && res.data.msg) || this.$t('aichat.load_session_fail'));
                                if (self.same_id(self.current_id, id)) {
                                    self.start_new_chat();
                                }
                            }
                            return;
                        }
                        var more_flag = parseInt(res.data.data.has_more || 0, 10) === 1;
                        var incoming = self.normalize_messages(res.data.data.messages || []);
                        if (append) {
                            if (!self.same_id(self.current_id, id)) {
                                self.setData({ msg_loading_more: false });
                                return;
                            }
                            var list = incoming.concat(self.messages || []);
                            var exist_more = self.find_session(id);
                            if (exist_more) {
                                exist_more.messages = incoming.concat(exist_more.messages || []);
                                exist_more.has_more = more_flag;
                            }
                            var old_height = self._msg_keep_height || 0;
                            var old_top = self._msg_keep_top || 0;
                            var old_more = self._msg_keep_more || 0;
                            var keep_index = incoming.length;
                            self.setData({
                                messages: list,
                                msg_has_more: more_flag,
                                msg_loading_more: false,
                                keep_msg_index: keep_index,
                                scroll_into: '',
                                scroll_animate: false,
                            }, function () {
                                self.keep_msg_scroll_after_prepend(old_height, old_top, keep_index, old_more);
                            });
                            return;
                        }
                        var detail = {
                            id: res.data.data.consult ? res.data.data.consult.id : id,
                            title: (res.data.data.consult && res.data.data.consult.title) ? res.data.data.consult.title : this.$t('aichat.new_session'),
                            messages: incoming,
                            has_more: more_flag,
                        };
                        var exist = self.find_session(detail.id);
                        var sessions = self.sessions.slice();
                        if (exist) {
                            exist.title = detail.title;
                            exist.messages = detail.messages;
                            exist.has_more = more_flag;
                        } else if (self.same_id(self.current_id, id) || self.same_id(self.current_id, detail.id)) {
                            sessions.push({
                                id: detail.id,
                                title: detail.title,
                                messages: detail.messages,
                                has_more: more_flag,
                                updated_at: Date.now(),
                            });
                        }
                        if (!self.same_id(self.current_id, id) && !self.same_id(self.current_id, detail.id)) {
                            return;
                        }
                        self.set_url_consult_id(detail.id);
                        self.setData({
                            current_id: detail.id,
                            sessions: sessions,
                            messages: detail.messages,
                            msg_has_more: more_flag,
                            is_chatting: true,
                            session_loading: false,
                            main_title: detail.title,
                        });
                        self.restore_goods_context();
                        self.scroll_bottom({ delays: [50, 160, 360, 700] });
                    },
                    fail: () => {
                        if (append) {
                            self.setData({ msg_loading_more: false });
                            return;
                        }
                        if (req_id !== self.detail_req_seq || silent) return;
                        app.globalData.showToast(this.$t('aichat.load_session_fail_retry'));
                        if (self.same_id(self.current_id, id)) {
                            self.start_new_chat();
                        }
                    },
                });
            },
            // 删除会话确认弹窗
            delete_session_event(e) {
                var id = e.currentTarget.dataset.id;
                var self = this;
                uni.showModal({
                    title: this.$t('common.tips'),
                    content: this.$t('aichat.delete_confirm'),
                    success: (ret) => {
                        if (ret.confirm) {
                            self.delete_session(id);
                        }
                    },
                });
            },
            // 删除会话
            delete_session(id) {
                var self = this;
                if (!this.use_remote) {
                    var sessions = this.sessions.filter((s) => !this.same_id(s.id, id));
                    this.save_local_sessions_list(sessions);
                    this.setData({ sessions: sessions });
                    if (this.same_id(this.current_id, id)) {
                        this.start_new_chat();
                    }
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('consultdelete', 'index', 'aichat'),
                    method: 'POST',
                    data: this.guest_payload({ consult_id: id }),
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code != 0) {
                            app.globalData.showToast((res.data && res.data.msg) || this.$t('common.del_fail'));
                            return;
                        }
                        self.setData({
                            sessions: self.sessions.filter((s) => !self.same_id(s.id, id)),
                        });
                        if (self.same_id(self.current_id, id)) {
                            self.start_new_chat();
                        }
                    },
                });
            },
            // 确保存在当前会话
            ensure_session() {
                if (this.current_id && this.find_session(this.current_id)) {
                    return this.find_session(this.current_id);
                }
                if (this.use_remote) {
                    this.setData({ current_id: '' });
                    return { id: '', title: this.$t('aichat.new_session'), messages: [] };
                }
                var session = {
                    id: this.uid(),
                    title: this.$t('aichat.new_session'),
                    messages: [],
                    updated_at: Date.now(),
                };
                var sessions = this.sessions.slice();
                sessions.unshift(session);
                this.save_local_sessions_list(sessions);
                this.setData({
                    sessions: sessions,
                    current_id: session.id,
                });
                return session;
            },
            // 收集可持久化的用户/机器人消息
            collect_persist_messages() {
                return (this.messages || [])
                    .filter((m) => m.role === 'user' || m.role === 'bot')
                    .map((m) => {
                        var mid = '';
                        if (m.mid !== undefined && m.mid !== null && String(m.mid) !== '') {
                            mid = String(m.mid);
                        } else if (m.id !== undefined && m.id !== null && String(m.id) !== '') {
                            mid = String(m.id);
                        }
                        var feedback = parseInt(m.feedback || 0, 10) || 0;
                        if (feedback !== 1 && feedback !== 2) {
                            feedback = 0;
                        }
                        return {
                            role: m.role,
                            text: m.text || '',
                            mid: mid,
                            feedback: feedback,
                            goods: Array.isArray(m.goods) ? m.goods : [],
                            time: this.answer_time_of(m),
                            revisions: this.clean_revisions(m.revisions).map((r) => ({
                                text: r.text,
                                goods: r.goods,
                                time: r.time,
                            })),
                        };
                    });
            },
            // 持久化当前会话消息（远程走接口；本地仅兼容旧数据）
            persist_current_messages(done) {
                var self = this;
                var visible = this.collect_persist_messages();
                var msgs = visible;
                var title = this.derive_title(visible);
                if (!this.use_remote) {
                    if (!this.current_id) {
                        typeof done === 'function' && done();
                        return;
                    }
                    var session = this.find_session(this.current_id);
                    if (!session) {
                        typeof done === 'function' && done();
                        return;
                    }
                    var msgs = visible;
                    var start = this.msg_guest_start || 0;
                    if (start > 0 && Array.isArray(session.messages) && session.messages.length > start) {
                        msgs = session.messages.slice(0, start).concat(visible);
                    }
                    session.messages = msgs;
                    session.updated_at = Date.now();
                    session.title = this.derive_title(msgs);
                    var sessions = this.sessions.filter((s) => !this.same_id(s.id, this.current_id));
                    sessions.unshift(session);
                    this.save_local_sessions_list(sessions);
                    this.setData({ sessions: sessions, main_title: session.title || this.$t('aichat.new_session') });
                    typeof done === 'function' && done();
                    return;
                }
                this.save_chain = this.save_chain.then(() => {
                    return new Promise((resolve) => {
                        uni.request({
                            url: app.globalData.get_request_url('consultsave', 'index', 'aichat'),
                            method: 'POST',
                            data: self.guest_payload({
                                consult_id: self.current_id || 0,
                                title: title,
                                messages_b64: base64.encode(JSON.stringify(msgs || [])),
                            }),
                            dataType: 'json',
                            success: (res) => {
                                if (res.data.code == 0 && res.data.data) {
                                    var cid = res.data.data.id;
                                    var exist = self.find_session(cid);
                                    var sessions = self.sessions.slice();
                                    if (exist) {
                                        exist.title = res.data.data.title || title;
                                        exist.messages = msgs;
                                        exist.updated_at = Date.now();
                                        sessions = sessions.filter((s) => !self.same_id(s.id, cid));
                                        sessions.unshift(exist);
                                    } else {
                                        sessions.unshift({
                                            id: cid,
                                            title: res.data.data.title || title,
                                            messages: msgs,
                                            updated_at: Date.now(),
                                        });
                                    }
                                    self.set_url_consult_id(cid);
                                    self.setData({
                                        current_id: cid,
                                        sessions: sessions,
                                        main_title: res.data.data.title || title,
                                    });
                                }
                            },
                            complete: () => {
                                resolve();
                                typeof done === 'function' && done();
                            },
                        });
                    });
                });
            },
            // 取历史提问（最多 4 条）；exclude_text 用于重新生成时去掉当前问题
            get_history_questions(exclude_text) {
                var qs = [];
                var msgs = this.collect_persist_messages();
                for (var i = 0; i < msgs.length; i++) {
                    if (msgs[i].role === 'user' && String(msgs[i].text || '').trim()) {
                        qs.push(String(msgs[i].text).trim());
                    }
                }
                exclude_text = String(exclude_text || '').trim();
                if (exclude_text) {
                    for (var j = qs.length - 1; j >= 0; j--) {
                        if (qs[j] === exclude_text) {
                            qs.splice(j, 1);
                            break;
                        }
                    }
                } else if (qs.length > 0) {
                    qs.pop();
                }
                return qs.slice(-4);
            },
            // 从最近一次商品推荐恢复商品上下文关键词
            restore_goods_context() {
                var msgs = this.collect_persist_messages();
                var keywords = '';
                for (var i = msgs.length - 1; i >= 0; i--) {
                    var m = msgs[i];
                    if (m.role === 'bot' && Array.isArray(m.goods) && m.goods.length) {
                        for (var j = i - 1; j >= 0; j--) {
                            if (msgs[j].role === 'user' && String(msgs[j].text || '').trim()) {
                                keywords = String(msgs[j].text).trim();
                                break;
                            }
                        }
                        break;
                    }
                }
                this.setData({ goods_context_keywords: keywords });
            },
            // 发送提问并请求回答；options.replace_index 为重新生成
            send_question(question, options) {
                question = String(question || '').trim();
                options = options || {};
                var origin_idx = parseInt(options.replace_index, 10);
                if (isNaN(origin_idx) || origin_idx < 0 || !this.messages[origin_idx] || this.messages[origin_idx].role !== 'bot') {
                    origin_idx = -1;
                }
                if (!question || this.asking) return;
                // 打字中可继续发：先补全当前回复
                if (this.is_typing) {
                    this.stop_typewrite(true);
                } else {
                    this.stop_typewrite(false);
                }
                this.ensure_session();

                var replace_idx = -1;
                var snapshot = null;
                var exist_bot_mid = '';
                var messages = [];
                for (var mi = 0; mi < this.messages.length; mi++) {
                    if (this.messages[mi].role === 'loading') {
                        continue;
                    }
                    var copied = Object.assign({}, this.messages[mi]);
                    if (copied.role === 'bot') {
                        copied.suggests = [];
                    }
                    if (origin_idx >= 0 && mi === origin_idx) {
                        replace_idx = messages.length;
                    }
                    messages.push(copied);
                }

                if (replace_idx >= 0) {
                    var cur = messages[replace_idx];
                    exist_bot_mid = String(cur.mid || '');
                    var old_revisions = this.clean_revisions(cur.revisions);
                    snapshot = {
                        text: cur.text || '',
                        goods: Array.isArray(cur.goods) ? cur.goods.slice() : [],
                        feedback: parseInt(cur.feedback || 0, 10) || 0,
                        mid: exist_bot_mid,
                        revisions: old_revisions,
                        time: this.answer_time_of(cur) || Math.floor(Date.now() / 1000),
                    };
                    var revisions = old_revisions.slice();
                    if (snapshot.text) {
                        revisions.push({
                            text: snapshot.text,
                            goods: snapshot.goods,
                            time: snapshot.time,
                            open: false,
                        });
                        if (revisions.length > 8) {
                            revisions = revisions.slice(-8);
                        }
                    }
                    messages[replace_idx] = Object.assign({}, cur, {
                        regenerating: true,
                        typing: false,
                        display_text: '',
                        goods: [],
                        suggests: [],
                        feedback: 0,
                        revisions: revisions,
                    });
                } else {
                    var user_mid = this.use_remote ? '' : this.msg_uid();
                    messages.push({
                        role: 'user',
                        text: question,
                        mid: user_mid,
                        feedback: 0,
                        goods: [],
                        suggests: [],
                        revisions: [],
                        time: Math.floor(Date.now() / 1000),
                    });
                    messages.push({ role: 'loading', text: '', mid: '', feedback: 0, goods: [], suggests: [], revisions: [] });
                }

                this.setData({
                    asking: true,
                    is_chatting: true,
                    input_value: replace_idx >= 0 ? this.input_value : '',
                    messages: messages,
                    sidebar_open: false,
                });
                if (!this.use_remote && replace_idx < 0) {
                    this.persist_current_messages();
                }
                this.scroll_bottom();

                var history_questions = this.get_history_questions(replace_idx >= 0 ? question : '');
                var self = this;
                var persist_after_bot = function () {
                    if (self.use_remote) {
                        var s = self.find_session(self.current_id);
                        if (s) {
                            s.messages = self.collect_persist_messages();
                            s.has_more = self.msg_has_more;
                        }
                    } else {
                        self.persist_current_messages();
                    }
                };
                uni.request({
                    url: app.globalData.get_request_url('ask', 'index', 'aichat'),
                    method: 'POST',
                    data: this.guest_payload({
                        question: question,
                        consult_id: this.current_id || 0,
                        history_questions: history_questions.join('\n'),
                        goods_context_keywords: this.goods_context_keywords || '',
                        regenerate: replace_idx >= 0 ? 1 : 0,
                        bot_message_id: (replace_idx >= 0 && this.use_remote && /^\d+$/.test(exist_bot_mid)) ? exist_bot_mid : 0,
                    }),
                    dataType: 'json',
                    timeout: 120000,
                    success: (res) => {
                        var answer = '';
                        var bot_mid = exist_bot_mid;
                        var suggests = [];
                        var goods = [];
                        var list = self.messages.filter((m) => m.role !== 'loading');
                        var user_idx = -1;
                        if (replace_idx < 0) {
                            for (var i = list.length - 1; i >= 0; i--) {
                                if (list[i].role === 'user' && list[i].text === question) {
                                    user_idx = i;
                                    break;
                                }
                            }
                        }
                        if (res.data.code == 0 && res.data.data) {
                            self.save_guest_token(res.data.data.guest_token);
                            answer = res.data.data.answer || this.$t('aichat.no_answer');
                            suggests = Array.isArray(res.data.data.suggests) ? res.data.data.suggests : [];
                            goods = Array.isArray(res.data.data.goods) ? res.data.data.goods : [];
                            if (self.use_remote) {
                                if (res.data.data.user_message_id && user_idx >= 0) {
                                    list[user_idx].mid = res.data.data.user_message_id;
                                }
                                if (res.data.data.bot_message_id) {
                                    bot_mid = res.data.data.bot_message_id;
                                }
                                if (res.data.data.consult_id) {
                                    var cid = res.data.data.consult_id;
                                    var title = res.data.data.consult_title || self.derive_title([{ role: 'user', text: question }]);
                                    var exist = self.find_session(cid);
                                    var sessions = self.sessions.slice();
                                    if (exist) {
                                        exist.title = title;
                                        exist.updated_at = Date.now();
                                        sessions = sessions.filter((s) => !self.same_id(s.id, cid));
                                        sessions.unshift(exist);
                                    } else {
                                        sessions.unshift({
                                            id: cid,
                                            title: title,
                                            messages: null,
                                            updated_at: Date.now(),
                                        });
                                    }
                                    self.set_url_consult_id(cid);
                                    self.setData({
                                        current_id: cid,
                                        sessions: sessions,
                                        main_title: title,
                                    });
                                }
                            } else if (replace_idx < 0) {
                                bot_mid = self.msg_uid();
                            }
                            if (res.data.data.goods_keywords) {
                                self.setData({ goods_context_keywords: String(res.data.data.goods_keywords || '') });
                            } else if (goods.length) {
                                self.setData({
                                    goods_context_keywords: question || (history_questions.length ? history_questions[history_questions.length - 1] : self.goods_context_keywords),
                                });
                            }
                        } else {
                            answer = (res.data && res.data.msg) ? res.data.msg : this.$t('aichat.request_fail');
                            if (!self.use_remote && replace_idx < 0) bot_mid = self.msg_uid();
                        }
                        var bot_idx = list.length;
                        var revs = [];
                        var answer_time = Math.floor(Date.now() / 1000);
                        if (res.data && res.data.code == 0 && res.data.data && res.data.data.answer_time) {
                            answer_time = parseInt(res.data.data.answer_time, 10) || answer_time;
                        }
                        if (replace_idx >= 0 && list[replace_idx] && list[replace_idx].role === 'bot') {
                            bot_idx = replace_idx;
                            revs = list[replace_idx].revisions || [];
                            if (res.data && res.data.code == 0 && res.data.data && Array.isArray(res.data.data.revisions)) {
                                revs = self.clean_revisions(res.data.data.revisions);
                            }
                            list[replace_idx] = Object.assign({}, list[replace_idx], {
                                role: 'bot',
                                text: answer,
                                display_text: '',
                                typing: true,
                                regenerating: false,
                                mid: bot_mid,
                                feedback: 0,
                                goods: [],
                                suggests: [],
                                revisions: revs,
                                time: answer_time,
                            });
                        } else {
                            list.push({
                                role: 'bot',
                                text: answer,
                                display_text: '',
                                typing: true,
                                regenerating: false,
                                mid: bot_mid,
                                feedback: 0,
                                goods: [],
                                suggests: [],
                                revisions: [],
                                time: answer_time,
                            });
                            bot_idx = list.length - 1;
                        }
                        self.setData({ messages: list });
                        self.typewrite_bot_answer(bot_idx, answer, {
                            mid: bot_mid,
                            goods: goods,
                            suggests: suggests,
                            revisions: revs,
                            time: answer_time,
                            onDone: persist_after_bot,
                        });
                    },
                    fail: () => {
                        if (replace_idx >= 0 && snapshot) {
                            var restore = self.messages.filter((m) => m.role !== 'loading');
                            if (restore[replace_idx] && restore[replace_idx].role === 'bot') {
                                restore[replace_idx] = Object.assign({}, restore[replace_idx], {
                                    regenerating: false,
                                    typing: false,
                                    text: snapshot.text,
                                    display_text: snapshot.text,
                                    goods: snapshot.goods,
                                    feedback: snapshot.feedback,
                                    mid: snapshot.mid,
                                    revisions: snapshot.revisions,
                                    suggests: [],
                                    time: snapshot.time || 0,
                                });
                                self.setData({ messages: restore, asking: false });
                            } else {
                                self.setData({ asking: false });
                            }
                            app.globalData.showToast(this.$t('aichat.network_error'));
                            return;
                        }
                        var list = self.messages.filter((m) => m.role !== 'loading');
                        var fail_text = this.$t('aichat.network_error');
                        var fail_mid = self.use_remote ? '' : self.msg_uid();
                        list.push({
                            role: 'bot',
                            text: fail_text,
                            display_text: '',
                            typing: true,
                            regenerating: false,
                            mid: fail_mid,
                            feedback: 0,
                            goods: [],
                            suggests: [],
                            revisions: [],
                        });
                        self.setData({ messages: list });
                        self.typewrite_bot_answer(list.length - 1, fail_text, {
                            mid: fail_mid,
                            goods: [],
                            suggests: [],
                            revisions: [],
                            onDone: function () {
                                if (!self.use_remote) {
                                    self.persist_current_messages();
                                }
                            },
                        });
                    },
                });
            },
            // 消息操作：复制 / 编辑 / 赞踩 / 重新生成
            msg_action_event(e) {
                var idx = parseInt(e.currentTarget.dataset.index, 10);
                var act = e.currentTarget.dataset.act;
                var msg = this.messages[idx];
                if (!msg) return;
                if (act === 'copy') {
                    if (msg.regenerating) {
                        return;
                    }
                    uni.setClipboardData({
                        data: String(msg.text || ''),
                        success: () => app.globalData.showToast(this.$t('common.copy_success'), 'success'),
                    });
                    return;
                }
                if (act === 'edit') {
                    this.setData({ input_value: msg.text || '' });
                    return;
                }
                if (act === 'regen') {
                    if (this.asking || msg.regenerating) {
                        return;
                    }
                    var q = this.paired_user_question(idx);
                    if (!q) {
                        app.globalData.showToast(this.$t('aichat.no_question_regenerate'));
                        return;
                    }
                    this.send_question(q, { replace_index: idx });
                    return;
                }
                if (act === 'like' || act === 'dislike') {
                    if (msg.regenerating) {
                        return;
                    }
                    var cur = parseInt(msg.feedback || 0, 10) || 0;
                    var next = 0;
                    if (act === 'like') next = cur === 1 ? 0 : 1;
                    else next = cur === 2 ? 0 : 2;
                    this.submit_feedback(idx, next);
                }
            },
            // 提交消息反馈（赞/踩）
            submit_feedback(idx, next_feedback) {
                var msg = this.messages[idx];
                if (!msg) return;
                // 兼容接口 id 与页面 mid
                var mid = String(msg.mid || msg.id || '');
                var list = this.messages.slice();
                list[idx] = Object.assign({}, msg, { mid: mid, feedback: next_feedback });
                this.setData({ messages: list });

                if (!this.use_remote) {
                    this.persist_current_messages();
                    return;
                }
                if (!/^\d+$/.test(mid) || parseInt(mid, 10) <= 0) {
                    return;
                }
                var self = this;
                uni.request({
                    url: app.globalData.get_request_url('feedback', 'index', 'aichat'),
                    method: 'POST',
                    data: this.guest_payload({
                        message_id: mid,
                        feedback: next_feedback,
                    }),
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code != 0) {
                            // 回滚
                            var rollback = self.messages.slice();
                            if (rollback[idx]) {
                                rollback[idx] = Object.assign({}, rollback[idx], { feedback: msg.feedback || 0 });
                                self.setData({ messages: rollback });
                            }
                            app.globalData.showToast((res.data && res.data.msg) || this.$t('common.operate_fail'));
                        } else {
                            var s = self.find_session(self.current_id);
                            if (s) {
                                s.messages = self.collect_persist_messages();
                            }
                        }
                    },
                });
            },
        },
    };
</script>
<style>
    @import './index.css';
</style>
