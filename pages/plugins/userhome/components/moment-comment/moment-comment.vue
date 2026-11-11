<template>
    <view class="moment-comment" @tap.stop="">
        <view v-if="propShowTitle" class="fw-b margin-bottom-main">
            {{ $t('moment.comment') }}
            <text v-if="comment_count > 0" class="cr-grey margin-left-xs">({{ comment_count }})</text>
        </view>

        <!-- 详情页：顶部仅发新评论；回复走底部弹窗 -->
        <view v-if="!propPopupMode && compose_open" class="compose-form margin-bottom-main">
            <block v-if="is_login">
                <component-moment-compose
                    ref="composeInline"
                    :propPlaceholder="$t('moment.comment_placeholder')"
                    :propSubmitText="$t('moment.comment_publish')"
                    :propMaxlength="500"
                    :propLoading="comment_loading"
                    :propEditorPathType="editor_path_type"
                    :propImagesMax="images_max"
                    :propEmojiList="emoji_list"
                    :propTools="compose_tools"
                    @compose-submit="comment_submit_inline"
                ></component-moment-compose>
            </block>
            <button v-else class="round text-size-sm" type="default" size="mini" hover-class="none" @tap="login_event">{{ $t('moment.comment_login') }}</button>
        </view>

        <view v-if="comment_list.length > 0" :class="!propPopupMode ? 'margin-top-xxxl' : ''">
            <view v-for="(row, index) in comment_list" :key="row.id || index" class="comment-row padding-vertical-main flex-row">
                <image class="avatar circle" :src="row.avatar" mode="aspectFill" :data-value="row.user_home_url" @tap="url_event"></image>
                <view class="flex-1 flex-width padding-left-main">
                    <view class="flex-row align-c flex-wrap">
                        <text class="fw-b" :data-value="row.user_home_url" @tap="url_event">{{ row.user_name_view }}</text>
                        <text class="text-size-xs cr-grey-9 margin-left-sm">{{ row.add_time_text || row.add_time }}</text>
                        <text v-if="row.audit_status_name" class="text-size-xs cr-yellow margin-left-sm">{{ row.audit_status_name }}</text>
                    </view>
                    <view v-if="row.reply_user_name || row.reply_content" class="quote margin-top-xs text-size-sm cr-grey">
                        <view v-if="row.reply_user_name" class="quote-name" :data-value="row.reply_user_home_url" @tap="url_event">@{{ row.reply_user_name }}</view>
                        <view v-if="row.reply_content">{{ row.reply_content }}</view>
                        <view v-if="(row.reply_images || []).length > 0" class="comment-images margin-top-xs">
                            <view v-for="(img, ii) in row.reply_images" :key="'rq' + ii" class="comment-img-item radius" :data-urls="row.reply_images" :data-index="ii" @tap="preview_event">
                                <image class="comment-img" :src="img" mode="aspectFill"></image>
                            </view>
                        </view>
                    </view>
                    <view class="margin-top-xs content-text">{{ row.content }}</view>
                    <view v-if="(row.images || []).length > 0" class="comment-images margin-top-xs">
                        <view v-for="(img, ii) in row.images" :key="ii" class="comment-img-item radius" :data-urls="row.images" :data-index="ii" @tap="preview_event">
                            <image class="comment-img" :src="img" mode="aspectFill"></image>
                        </view>
                    </view>
                    <view v-if="row.video_url" class="margin-top-xs">
                        <video class="comment-video radius" :src="row.video_url" controls object-fit="cover"></video>
                    </view>
                    <view class="flex-row align-c margin-top-sm text-size-sm cr-grey-9">
                        <view v-if="propEnableLike" class="action-item margin-right-xl" :class="row.is_like == 1 ? 'cr-main' : ''" @tap="comment_like_event(row, index)">
                            <iconfont :name="row.is_like == 1 ? 'icon-givealike' : 'icon-givealike-o'" size="28rpx" :color="row.is_like == 1 ? theme_color : '#999'" propClass="va-m"></iconfont>
                            <text v-if="row.like_count > 0" class="margin-left-xs va-m">{{ row.like_count }}</text>
                        </view>
                        <view class="action-item margin-right-xl" :class="popup_status && reply_id == row.id ? 'cr-main' : ''" @tap="reply_event(row)">
                            <iconfont name="icon-message-o" size="28rpx" :color="popup_status && reply_id == row.id ? theme_color : '#999'" propClass="va-m"></iconfont>
                            <text v-if="row.reply_count > 0" class="margin-left-xs va-m">{{ row.reply_count }}</text>
                        </view>
                        <view v-if="row.is_self == 1" class="action-item" @tap="comment_delete_event(row)">
                            <iconfont name="icon-delete" size="28rpx" color="#E22C08" propClass="va-m"></iconfont>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="comment_has_more == 1" class="tc padding-vertical-main text-size-sm cr-grey" @tap="load_more_comment">
                <block v-if="more_loading">{{ $t('common.loading_in_text') }}</block>
                <block v-else>
                    {{ $t('moment.comment_more') }}
                    <iconfont name="icon-angle-double-down" size="24rpx" color="#999" propClass="va-m margin-left-xs"></iconfont>
                </block>
            </view>
        </view>
        <view v-else-if="propShowEmpty" class="tc padding-main text-size-sm cr-grey-9">{{ $t('moment.comment_empty') }}</view>

        <!-- 列表评论/回复、详情回复：底部弹窗（勿抬高 propIndex） -->
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="comment-popup bg-white" @tap.stop="">
                <view class="flex-row jc-sb align-c padding-main br-b-e">
                    <view class="text-size fw-b">{{ popup_title }}</view>
                    <view @tap.stop="popup_close_event">
                        <iconfont name="icon-close-line" color="#333" size="28rpx"></iconfont>
                    </view>
                </view>
                <view class="padding-main">
                    <block v-if="is_login">
                        <component-moment-compose
                            v-if="popup_status"
                            :key="'compose-' + popup_kind + '-' + (reply_id || 0)"
                            ref="composePopup"
                            :propPlaceholder="popup_placeholder"
                            :propSubmitText="popup_submit_text"
                            :propMaxlength="500"
                            :propLoading="comment_loading"
                            :propAutoFocus="true"
                            :propEditorPathType="editor_path_type"
                            :propImagesMax="images_max"
                            :propEmojiList="emoji_list"
                            :propTools="compose_tools"
                            @compose-submit="comment_submit_popup"
                        ></component-moment-compose>
                    </block>
                    <button v-else class="round text-size-sm" type="default" size="mini" hover-class="none" @tap="login_event">{{ $t('moment.comment_login') }}</button>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentMomentCompose from '@/pages/plugins/userhome/components/moment-compose/moment-compose';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
    import { getUserhomeConfig, getMomentSaveinfo } from '@/pages/plugins/userhome/utils/compose-cache.js';
    export default {
        mixins: [pluginLocale],
        components: {
            componentPopup,
            componentMomentCompose,
        },
        props: {
            propMomentId: { type: [Number, String], default: 0 },
            propList: { type: Array, default: () => [] },
            propHasMore: { type: [Number, Boolean], default: 0 },
            propCommentCount: { type: [Number, String], default: 0 },
            propEnableLike: { type: Boolean, default: true },
            propShowTitle: { type: Boolean, default: false },
            propShowEmpty: { type: Boolean, default: false },
            propComposeOpen: { type: Boolean, default: false },
            propAutoLoad: { type: Boolean, default: false },
            propPopupMode: { type: Boolean, default: false },
        },
        // 组件数据
        data() {
            return {
                theme_color: app.globalData.get_theme_color(),
                comment_list: [],
                comment_has_more: 0,
                comment_count: 0,
                comment_loading: false,
                more_loading: false,
                reply_id: 0,
                reply_name: '',
                // comment=评动态；reply=回评论（决定弹窗标题/按钮文案）
                popup_kind: 'comment',
                compose_open: false,
                popup_status: false,
                is_login: false,
                synced_id: 0,
                compose_ready: false,
                compose_loading: false,
                editor_path_type: '',
                images_max: 9,
                emoji_list: [],
                compose_tools: {
                    emoji: 0,
                    images: 0,
                    video: 0,
                    at: 0,
                    topic: 0,
                    at_follow: 0,
                    at_fans: 0,
                },
            };
        },
        computed: {
            // 是否回复模式
            is_reply_mode() {
                return this.popup_kind === 'reply' && !!this.reply_id;
            },
            // 弹窗标题（回复时为「回复 xxx」）
            popup_title() {
                return this.is_reply_mode ? this.$t('moment.reply') + ' ' + this.reply_name : this.$t('moment.comment');
            },
            // 输入框占位文案
            popup_placeholder() {
                return this.is_reply_mode ? this.$t('moment.reply_holder') + this.reply_name : this.$t('moment.comment_placeholder');
            },
            // 提交按钮文案
            popup_submit_text() {
                return this.is_reply_mode ? this.$t('moment.reply_publish') : this.$t('moment.comment_publish');
            },
        },
        watch: {
            // 切换动态时同步评论列表
            propMomentId: {
                immediate: true,
                handler(val) {
                    var id = parseInt(val || 0);
                    if (id !== this.synced_id) {
                        this.synced_id = id;
                        this.reset_form();
                        this.popup_status = false;
                        this.comment_count = parseInt(this.propCommentCount || 0) || 0;
                        if (this.propAutoLoad && id > 0) {
                            this.comment_list = [];
                            this.comment_has_more = 0;
                            this.reload_comments();
                        } else {
                            this.comment_list = (this.propList || []).slice();
                            this.comment_has_more = this.propHasMore ? 1 : 0;
                        }
                    }
                },
            },
            // 同步评论总数
            propCommentCount(val) {
                this.comment_count = parseInt(val || 0) || 0;
            },
            // 详情下拉刷新后列表随 props 同步，避免再打 commentlist
            propList(val) {
                if (!this.propAutoLoad) {
                    this.comment_list = (val || []).slice();
                }
            },
            // 同步是否还有更多
            propHasMore(val) {
                if (!this.propAutoLoad) {
                    this.comment_has_more = val ? 1 : 0;
                }
            },
            // 向外抛出更多状态（详情底线用）
            comment_has_more(val) {
                this.$emit('more-change', val ? 1 : 0);
            },
            // 打开/关闭评论输入
            propComposeOpen: {
                immediate: true,
                handler(val) {
                    if (this.propPopupMode) {
                        if (val) {
                            // 回复图标打开时会同步 compose_open，这里不能再重置成「评论」
                            if (this.popup_status && this.popup_kind === 'reply') {
                                return;
                            }
                            this.open_compose_popup();
                        } else if (this.popup_status) {
                            this.popup_status = false;
                            this.reset_form();
                        }
                        return;
                    }
                    this.compose_open = !!val;
                    // 详情页内嵌输入框：仅在真正打开时拉工具配置
                    if (val) {
                        this.ensure_compose_ready();
                    }
                },
            },
        },
        // 初始化登录态
        created() {
            this.is_login = !!app.globalData.get_user_cache_info();
        },
        methods: {
            // 刷新登录状态
            refresh_login() {
                this.is_login = !!app.globalData.get_user_cache_info();
            },
            // 准备评论工具配置（多实例共用缓存）
            ensure_compose_ready() {
                if (this.compose_ready || this.compose_loading) {
                    return Promise.resolve(this.compose_ready);
                }
                this.compose_loading = true;
                var self = this;
                return getUserhomeConfig()
                    .then((data) => {
                        data = data || {};
                        // path_type 由 config/feedinit 统一下发，与 PC BaseService 一致
                        self.editor_path_type = data.editor_path_type || '';
                        self.images_max = parseInt(data.comment_images_max_number || 9) || 9;
                        self.compose_tools = {
                            emoji: data.is_comment_emoji == 1 ? 1 : 0,
                            images: data.is_comment_images == 1 ? 1 : 0,
                            video: data.is_comment_video == 1 ? 1 : 0,
                            at: 0,
                            topic: 0,
                            at_follow: 0,
                            at_fans: 0,
                        };
                        // 表情列表仍走 saveinfo；上传 path 已由 config 下发
                        if (data.is_comment_emoji != 1) {
                            return null;
                        }
                        return getMomentSaveinfo();
                    })
                    .then((save) => {
                        if (save) {
                            if (!self.editor_path_type && save.editor_path_type) {
                                self.editor_path_type = save.editor_path_type;
                            }
                            if (self.compose_tools.emoji == 1) {
                                self.emoji_list = save.emoji_list || [];
                            }
                        }
                        self.compose_ready = true;
                        self.compose_loading = false;
                        return true;
                    })
                    .catch(() => {
                        self.compose_loading = false;
                        return false;
                    });
            },
            // 重置输入框
            reset_compose(which) {
                var refs = [];
                if (which === 'popup') {
                    refs = [this.$refs.composePopup];
                } else if (which === 'inline') {
                    refs = [this.$refs.composeInline];
                } else {
                    refs = [this.$refs.composePopup, this.$refs.composeInline];
                }
                refs.forEach((ref) => {
                    if (ref && ref.reset) {
                        ref.reset();
                    }
                });
            },
            // 重置表单
            reset_form() {
                this.reply_id = 0;
                this.reply_name = '';
                this.popup_kind = 'comment';
                this.reset_compose('popup');
            },
            // 打开评论弹窗
            open_compose_popup() {
                this.refresh_login();
                var user = app.globalData.get_user_info(this, 'open_compose_popup');
                if (user == false) {
                    this.$emit('compose-change', false);
                    return false;
                }
                // 评动态：强制评论文案，避免残留回复态
                this.reply_id = 0;
                this.reply_name = '';
                this.popup_kind = 'comment';
                this.reset_compose('popup');
                this.ensure_compose_ready();
                this.popup_status = true;
                this.$emit('compose-change', true);
                return true;
            },
            // 关闭弹窗
            popup_close_event() {
                this.popup_status = false;
                this.reset_form();
                this.$emit('compose-change', false);
            },
            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 预览图片
            preview_event(e) {
                var urls = e.currentTarget.dataset.urls || [];
                var index = parseInt(e.currentTarget.dataset.index || 0);
                if (!urls.length) {
                    return;
                }
                uni.previewImage({ current: urls[index] || urls[0], urls: urls });
            },
            // 登录
            login_event() {
                app.globalData.get_user_info(this, 'refresh_login');
            },
            // 回复
            reply_event(row) {
                var user = app.globalData.get_user_info(this, 'reply_event');
                if (user == false || !row) {
                    return;
                }
                this.refresh_login();
                // 再点同一条：关闭回复弹窗
                if (this.popup_status && this.popup_kind === 'reply' && this.reply_id == row.id) {
                    this.popup_close_event();
                    return;
                }
                this.reply_id = row.id || 0;
                this.reply_name = row.user_name_view || '';
                this.popup_kind = 'reply';
                this.reset_compose('popup');
                this.ensure_compose_ready();
                this.popup_status = true;
                this.$emit('compose-change', true);
            },
            // 取消回复
            cancel_reply() {
                this.reply_id = 0;
                this.reply_name = '';
                this.popup_kind = 'comment';
            },
            // 加载更多评论
            load_more_comment() {
                if (this.more_loading || !this.propMomentId) {
                    return;
                }
                this.more_loading = true;
                uni.request({
                    url: app.globalData.get_request_url('commentlist', 'index', 'userhome'),
                    method: 'POST',
                    data: {
                        moment_id: this.propMomentId,
                        offset: this.comment_list.length,
                    },
                    dataType: 'json',
                    complete: () => {
                        this.more_loading = false;
                    },
                    success: (res) => {
                        if (!res.data || res.data.code != 0) {
                            if (res.data && res.data.msg) {
                                app.globalData.showToast(res.data.msg);
                            }
                            return;
                        }
                        var data = res.data.data || {};
                        this.comment_list = (this.comment_list || []).concat(data.list || []);
                        this.comment_has_more = data.has_more ? 1 : 0;
                        this.$emit('more-change', this.comment_has_more);
                    },
                });
            },
            // 刷新评论
            reload_comments() {
                if (!this.propMomentId) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('commentlist', 'index', 'userhome'),
                    method: 'POST',
                    data: {
                        moment_id: this.propMomentId,
                        offset: 0,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (!res.data || res.data.code != 0) {
                            return;
                        }
                        var data = res.data.data || {};
                        this.comment_list = data.list || [];
                        this.comment_has_more = data.has_more ? 1 : 0;
                        this.$emit('more-change', this.comment_has_more);
                    },
                });
            },
            // 内嵌提交
            comment_submit_inline(data) {
                // 详情顶部输入框只发新评论，不受回复弹窗 reply_id 影响
                this.comment_submit(data, 0);
            },
            // 弹窗提交
            comment_submit_popup(data) {
                var reply_id = this.is_reply_mode ? this.reply_id || 0 : 0;
                this.comment_submit(data, reply_id);
            },
            // 提交评论
            comment_submit(data, reply_comment_id) {
                var user = app.globalData.get_user_info(this, 'comment_submit');
                if (user == false || this.comment_loading || !this.propMomentId) {
                    return;
                }
                var is_popup = !!this.popup_status;
                this.comment_loading = true;
                uni.request({
                    url: app.globalData.get_request_url('comment', 'index', 'userhome'),
                    method: 'POST',
                    data: {
                        moment_id: this.propMomentId,
                        content: data.content || '',
                        images: JSON.stringify(data.images || []),
                        video_url: data.video_url || '',
                        reply_comment_id: reply_comment_id || 0,
                    },
                    dataType: 'json',
                    complete: () => {
                        this.comment_loading = false;
                    },
                    success: (res) => {
                        app.globalData.showToast((res.data && res.data.msg) || '');
                        if (!res.data || res.data.code != 0) {
                            return;
                        }
                        var count = (res.data.data && res.data.data.comment_count) || this.comment_count;
                        this.comment_count = count;
                        if (is_popup) {
                            this.popup_status = false;
                            this.reset_form();
                            this.$emit('compose-change', false);
                        } else {
                            this.reset_compose('inline');
                        }
                        this.$emit('count-change', count);
                        this.reload_comments();
                    },
                });
            },
            // 评论点赞
            comment_like_event(row, index) {
                var user = app.globalData.get_user_info(this, 'comment_like_event');
                if (user == false || !row) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('commentlike', 'index', 'userhome'),
                    method: 'POST',
                    data: { comment_id: row.id },
                    dataType: 'json',
                    success: (res) => {
                        if (!res.data || res.data.code != 0) {
                            if (res.data && res.data.msg) {
                                app.globalData.showToast(res.data.msg);
                            }
                            return;
                        }
                        var list = this.comment_list.slice();
                        if (list[index]) {
                            list[index] = {
                                ...list[index],
                                is_like: res.data.data.is_like,
                                like_count: res.data.data.like_count,
                            };
                            this.comment_list = list;
                        }
                    },
                });
            },
            // 删除评论
            comment_delete_event(row) {
                if (!row || !row.id) {
                    return;
                }
                var self = this;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('moment.delete_confirm'),
                    success(ret) {
                        if (!ret.confirm) {
                            return;
                        }
                        uni.request({
                            url: app.globalData.get_request_url('commentdelete', 'index', 'userhome'),
                            method: 'POST',
                            data: { id: row.id },
                            dataType: 'json',
                            success: (res) => {
                                app.globalData.showToast((res.data && res.data.msg) || '');
                                if (!res.data || res.data.code != 0) {
                                    return;
                                }
                                var count = (res.data.data && res.data.data.comment_count);
                                if (typeof count === 'undefined') {
                                    count = Math.max(0, (self.comment_count || 0) - 1);
                                }
                                self.comment_count = count;
                                self.$emit('count-change', count);
                                self.reload_comments();
                            },
                        });
                    },
                });
            },
        },
    };
</script>
<style scoped>
    .avatar {
        width: 64rpx;
        height: 64rpx;
        flex-shrink: 0;
    }
    .quote {
        padding: 12rpx 16rpx;
        background: #f5f6f8;
        border-left: 6rpx solid #d9d9d9;
    }
    .quote-name {
        color: #666;
    }
    .content-text {
        white-space: pre-wrap;
        word-break: break-word;
    }
    .comment-images {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10rpx;
    }
    .comment-img-item {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        overflow: hidden;
    }
    .comment-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .comment-video {
        width: 100%;
        height: 280rpx;
    }
    .action-item {
        display: inline-flex;
        align-items: center;
    }
    .comment-popup {
        border-radius: 24rpx 24rpx 0 0;
        overflow: hidden;
    }
</style>
