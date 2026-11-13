<template>
    <view class="moment-compose">
        <textarea
            class="comment-input wh-auto border-radius-main padding-horizontal-main padding-vertical-sm bg-grey-f8"
            :style="input_style"
            :value="form.content"
            :maxlength="propMaxlength"
            :focus="input_focus"
            :cursor="input_cursor"
            :placeholder="propPlaceholder"
            placeholder-class="cr-grey-9"
            @input="content_event"
            @blur="input_blur_event"
        />

        <view v-if="(image_list || []).length > 0 || video_url" class="media-wrap margin-top-main">
            <view v-if="(image_list || []).length > 0" class="media-images">
                <view v-for="(img, index) in image_list" :key="index" class="media-item radius">
                    <image class="media-img" :src="img" mode="aspectFill" :data-index="index" @tap="preview_image_event"></image>
                    <!-- iconfont 是自定义组件，小程序点击不冒泡，需同时绑 click -->
                    <view class="media-del" @tap.stop="image_delete_event(index)">
                        <iconfont name="icon-close-fillup" size="32rpx" color="rgba(87,91,102,0.7)" @click.stop="image_delete_event(index)"></iconfont>
                    </view>
                </view>
            </view>
            <view v-if="video_url" class="video-item margin-top-sm">
                <video class="media-video radius" :src="video_url" controls object-fit="cover"></video>
                <view class="media-del media-del-video" @tap.stop="video_delete_event">
                    <iconfont name="icon-close-fillup" size="32rpx" color="rgba(87,91,102,0.7)" @click.stop="video_delete_event"></iconfont>
                </view>
            </view>
        </view>

        <view class="toolbar flex-row align-c">
            <view class="toolbar-left flex-1 flex-row align-c flex-wrap">
                <image v-if="tools.emoji == 1" :src="common_static_url + 'emoji-icon.png'" mode="aspectFill" class="emoji-icon tool-btn" @tap="emoji_event"></image>
                <view v-if="tools.images == 1" class="tool-btn flex-row align-c" @tap="images_event">
                    <iconfont name="icon-images" size="40rpx" color="#666"></iconfont>
                    <text class="images-count text-size-xs cr-grey margin-left-xs">{{ (image_list || []).length }}/{{ images_max }}</text>
                </view>
                <view v-if="tools.video == 1" class="tool-btn" @tap="video_event">
                    <iconfont name="icon-video" size="40rpx" color="#666"></iconfont>
                </view>
                <view v-if="show_at" class="tool-btn tool-text" @tap="at_event"><text class="tool-char tool-char-at">@</text></view>
                <view v-if="tools.topic == 1" class="tool-btn tool-text" @tap="topic_event"><text class="tool-char tool-char-topic">#</text></view>
            </view>
            <view class="toolbar-right">
                <button class="round cr-white bg-main text-size-sm" type="default" size="mini" hover-class="none" :loading="propLoading" :disabled="propLoading" @tap.stop="submit_event">{{ propSubmitText }}</button>
            </view>
        </view>

        <!-- 未打开时不渲染；勿抬高 propIndex（遮罩会盖住内容层） -->
        <component-popup v-if="at_popup_status" :propShow="true" propPosition="bottom" @onclose="at_popup_close_event">
            <view class="at-popup bg-white flex-col">
                <!-- 标题栏与关闭叉齐平；关注/粉丝模式直接把 tabs 放标题位，省一行 -->
                <view class="at-popup-head flex-row jc-sb align-c padding-main br-b-e">
                    <view v-if="show_at_tabs" class="flex-row align-c flex-1 flex-width">
                        <view
                            :class="'at-tab-item text-size fw-b margin-right-xl ' + (at_type == 'follow' ? 'cr-main nav-active-line' : 'cr-grey')"
                            data-type="follow"
                            @tap.stop="at_type_event"
                        >{{ $t('moment-form.at_follow') }}</view>
                        <view
                            :class="'at-tab-item text-size fw-b ' + (at_type == 'fans' ? 'cr-main nav-active-line' : 'cr-grey')"
                            data-type="fans"
                            @tap.stop="at_type_event"
                        >{{ $t('moment-form.at_fans') }}</view>
                    </view>
                    <view v-else class="text-size fw-b flex-1 flex-width">{{ at_popup_title }}</view>
                    <view class="flex-shrink" @tap.stop="at_popup_close_event">
                        <iconfont name="icon-close-line" color="#333" size="28rpx"></iconfont>
                    </view>
                </view>
                <view class="at-search padding-horizontal-main padding-top-main padding-bottom-sm">
                    <view class="at-search-box flex-row align-c bg-grey-f8 border-radius-main padding-horizontal-main">
                        <iconfont name="icon-search" size="28rpx" color="#999"></iconfont>
                        <input
                            class="flex-1 at-search-input margin-left-sm"
                            type="text"
                            :value="at_keywords"
                            :placeholder="$t('moment-form.at_search')"
                            placeholder-class="cr-grey-9"
                            confirm-type="search"
                            @input="at_keywords_input_event"
                            @confirm="at_search_event"
                        />
                        <view v-if="at_keywords" class="padding-left-sm" @tap.stop="at_keywords_clear_event">
                            <iconfont name="icon-close-line" size="24rpx" color="#999"></iconfont>
                        </view>
                    </view>
                </view>
                <scroll-view scroll-y class="at-list flex-1" @scrolltolower="at_scroll_lower_event">
                    <block v-if="(at_user_list || []).length > 0">
                        <view v-for="(user, index) in at_user_list" :key="user.id || index" class="at-user-item flex-row align-c padding-main" :data-id="user.id" :data-name="user.user_name_view" @tap="at_user_choice_event">
                            <image class="at-avatar circle margin-right-main" :src="user.avatar" mode="aspectFill"></image>
                            <text class="flex-1">{{ user.user_name_view }}</text>
                        </view>
                        <view v-if="at_loading_more" class="tc padding-main cr-grey text-size-sm">{{ $t('common.loading_in_text') }}</view>
                        <view v-else-if="at_bottom_line" class="tc padding-main cr-grey-9 text-size-xs">{{ $t('moment-form.at_no_more') }}</view>
                    </block>
                    <view v-else class="tc padding-main cr-grey text-size-sm">{{ at_loading ? $t('common.loading_in_text') : $t('moment-form.at_empty') }}</view>
                </scroll-view>
            </view>
        </component-popup>

    </view>
</template>
<script>
    const app = getApp();
    var common_static_url = app.globalData.get_static_url('common');
    import componentPopup from '@/components/popup/popup';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
    export default {
        mixins: [pluginLocale],
        components: {
            componentPopup,
        },
        props: {
            propPlaceholder: { type: String, default: '' },
            propSubmitText: { type: String, default: '' },
            propMaxlength: { type: [Number, String], default: 1000 },
            propLoading: { type: Boolean, default: false },
            propAutoFocus: { type: Boolean, default: false },
            propEditorPathType: { type: String, default: '' },
            propImagesMax: { type: [Number, String], default: 9 },
            // 输入框高度（原生 textarea 无 height 属性，需走 style）
            propHeight: { type: String, default: '140rpx' },
            propTools: {
                type: Object,
                default: () => ({
                    emoji: 0,
                    images: 0,
                    video: 0,
                    at: 0,
                    topic: 0,
                    at_follow: 0,
                    at_fans: 0,
                    at_mutual: 0,
                }),
            },
        },
        // 组件数据
        data() {
            return {
                common_static_url: common_static_url,
                form: { content: '' },
                image_list: [],
                // 与 image_list 下标对齐的附件 id（勿用 url 做对象 key，小程序 setData 会把 / . 当路径）
                image_id_list: [],
                video_url: '',
                video_id: 0,
                // 编辑回填的已保存附件：叉掉/替换时不立刻删，等保存由服务端对比清理
                saved_image_map: {},
                saved_video_url: '',
                at_user_ids: [],
                at_user_list: [],
                at_type: 'follow',
                at_popup_status: false,
                at_loading: false,
                at_loading_more: false,
                at_keywords: '',
                at_page: 1,
                at_has_more: 0,
                at_bottom_line: false,
                at_req_seq: 0,
                input_focus: false,
                input_cursor: -1,
                // 已点提交：附件归业务侧，禁止再调 deletefile（防误触叉号）
                media_locked: false,
            };
        },
        computed: {
            // 输入框高度样式
            input_style() {
                var h = this.propHeight || '140rpx';
                return 'height:' + h + ';';
            },
            // 工具开关
            tools() {
                return this.propTools || {};
            },
            // 图片上限
            images_max() {
                return parseInt(this.propImagesMax || 9) || 9;
            },
            // 是否可艾特
            show_at() {
                return this.tools.at == 1 && (this.tools.at_follow == 1 || this.tools.at_fans == 1 || this.tools.at_mutual == 1);
            },
            // 是否显示关注/粉丝切换（仅「关注/粉丝」模式）
            show_at_tabs() {
                return this.tools.at_follow == 1 && this.tools.at_fans == 1 && this.tools.at_mutual != 1;
            },
            // 弹窗标题（与关闭叉齐平）
            at_popup_title() {
                if (this.tools.at_mutual == 1) {
                    return this.$t('moment-form.at_mutual');
                }
                if (this.show_at_tabs) {
                    return this.$t('moment-form.at');
                }
                if (this.tools.at_follow == 1) {
                    return this.$t('moment-form.at_follow');
                }
                if (this.tools.at_fans == 1) {
                    return this.$t('moment-form.at_fans');
                }
                return this.$t('moment-form.at');
            },
            // 空内容提示（与 PC 一致，按开启的附件能力）
            content_empty_tips() {
                var images = this.tools.images == 1;
                var video = this.tools.video == 1;
                if (images && video) {
                    return this.$t('moment-form.content_empty_images_video');
                }
                if (images) {
                    return this.$t('moment-form.content_empty_images');
                }
                if (video) {
                    return this.$t('moment-form.content_empty_video');
                }
                return this.$t('moment-form.content_empty');
            },
        },
        watch: {
            // 自动聚焦输入框
            propAutoFocus(val) {
                if (val) {
                    this.focus_input();
                } else {
                    this.input_focus = false;
                }
            },
            // 提交结束且未 reset（失败）时解锁，允许继续删图
            propLoading(val) {
                if (!val && this.media_locked) {
                    this.media_locked = false;
                }
            },
            // 默认艾特类型
            propTools: {
                immediate: true,
                deep: true,
                handler() {
                    this.at_type = this.default_at_type();
                },
            },
        },
        methods: {
            default_at_type() {
                if (this.tools.at_mutual == 1) {
                    return 'mutual';
                }
                if (this.tools.at_follow == 1) {
                    return 'follow';
                }
                return 'fans';
            },
            // 附件是否编辑回填的已保存文件（路径归一后比对）
            is_saved_media_url(url) {
                var key = this.media_path_key(url);
                return !!(key && this.saved_image_map && this.saved_image_map[key]);
            },
            media_path_key(url) {
                url = String(url || '').trim();
                if (!url) {
                    return '';
                }
                // 去掉协议域名，只留路径部分做对比
                url = url.replace(/^https?:/i, '');
                if (url.indexOf('//') === 0) {
                    var slash = url.indexOf('/', 2);
                    url = slash >= 0 ? url.substring(slash) : '';
                }
                return url.split('?')[0];
            },
            // 重置表单
            reset() {
                this.form = { content: '' };
                this.image_list = [];
                this.image_id_list = [];
                this.video_url = '';
                this.video_id = 0;
                this.saved_image_map = {};
                this.saved_video_url = '';
                this.at_user_ids = [];
                this.at_user_list = [];
                this.at_popup_status = false;
                this.input_focus = false;
                this.input_cursor = -1;
                this.media_locked = false;
            },
            // 回填编辑数据（优先 content_edit 保留换行；缺话题时另起一行补入）
            set_form_data(data) {
                data = data || {};
                var content = (data.content_edit != null) ? String(data.content_edit) : (data.content || '');
                var topics = Array.isArray(data.topic_list) ? data.topic_list : [];
                for (var i = 0; i < topics.length; i++) {
                    var name = ((topics[i] && topics[i].name) || '').replace(/#/g, '').trim();
                    if (!name) {
                        continue;
                    }
                    if (content.indexOf('#' + name) >= 0) {
                        continue;
                    }
                    content += (content === '' || /\n$/.test(content) ? '' : '\n') + '#' + name;
                }
                var images = Array.isArray(data.images) ? data.images.slice() : [];
                this.form = { content: content };
                this.image_list = images.map((u) => this.media_url_view(u));
                this.image_id_list = images.map(function () {
                    return 0;
                });
                var saved_map = {};
                (this.image_list || []).forEach((u) => {
                    var key = this.media_path_key(u);
                    if (key) {
                        saved_map[key] = 1;
                    }
                });
                this.saved_image_map = saved_map;
                this.video_url = this.media_url_view(data.video_url || '');
                this.video_id = 0;
                this.saved_video_url = this.media_path_key(this.video_url);
                this.at_user_ids = Array.isArray(data.at_user_ids) ? data.at_user_ids.slice() : [];
                this.at_popup_status = false;
                this.input_focus = false;
                this.input_cursor = -1;
                if (content) {
                    this.focus_input(content.length);
                }
            },
            // 附件地址：相对路径补域名；保持服务端协议（勿强改 https，本地 http 站会裂图）
            media_url_view(url) {
                url = url || '';
                if (!url) {
                    return '';
                }
                if (url.indexOf('//') === 0) {
                    return 'http:' + url;
                }
                if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
                    return url;
                }
                var base = (app.globalData.data && app.globalData.data.request_url) || '';
                if (!base) {
                    return url;
                }
                if (url.charAt(0) === '/') {
                    return base.replace(/\/$/, '') + url;
                }
                return base.replace(/\/$/, '') + '/' + url;
            },
            // 删除远程附件（仅未提交时可叉掉；提交后禁止，否则会把已发布附件删掉）
            delete_remote_file(opts) {
                if (this.media_locked || this.propLoading) {
                    return;
                }
                opts = opts || {};
                var id = parseInt(opts.id || 0) || 0;
                var url = opts.url || '';
                if (!id && !url) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'ueditor'),
                    method: 'POST',
                    data: {
                        action: 'deletefile',
                        id: id > 0 ? id : '',
                        url: url,
                        path_type: this.propEditorPathType || '',
                    },
                    dataType: 'json',
                });
            },
            // 组装提交数据（拷贝，避免外部改到内部列表）
            get_data() {
                return {
                    content: this.form.content || '',
                    images: (this.image_list || []).slice(),
                    video_url: this.video_url || '',
                    at_user_ids: (this.at_user_ids || []).slice(),
                };
            },
            // 输入失焦
            input_blur_event() {
                this.input_focus = false;
            },
            // 聚焦输入
            focus_input(cursor) {
                var pos = typeof cursor === 'number' ? cursor : -1;
                this.input_focus = false;
                this.$nextTick(() => {
                    if (pos < 0) {
                        pos = (this.form.content || '').length;
                    }
                    this.input_cursor = pos;
                    this.input_focus = true;
                });
            },
            // 内容输入
            content_event(e) {
                this.form = { content: e.detail.value };
                if (typeof e.detail.cursor === 'number') {
                    this.input_cursor = e.detail.cursor;
                }
            },
            // 插入文本
            insert_text(text) {
                var next = (this.form.content || '') + text;
                this.form = { content: next };
                this.focus_input(next.length);
            },
            // 打开表情（外层 $refs.emoji.init）
            emoji_event() {
                this.input_focus = false;
                this.$emit('emoji-open');
            },
            // 插入话题#
            topic_event() {
                var content = this.form.content || '';
                if (/#\s*$/.test(content)) {
                    this.focus_input(content.length);
                    return;
                }
                this.insert_text(content !== '' && !/\s$/.test(content) ? ' #' : '#');
            },
            // 打开艾特弹窗
            at_event() {
                if (!this.show_at) {
                    return;
                }
                this.input_focus = false;
                this.at_popup_status = true;
                this.at_keywords = '';
                this.load_at_users(1, true);
            },
            // 关闭艾特
            at_popup_close_event() {
                this.at_popup_status = false;
                this.focus_input();
            },
            // 切换艾特类型（再点当前选中项则重新加载）
            at_type_event(e) {
                var type = e.currentTarget.dataset.type || 'follow';
                if (type == this.at_type) {
                    this.load_at_users(1, true);
                    return;
                }
                this.at_type = type;
                this.at_keywords = '';
                this.load_at_users(1, true);
            },
            at_keywords_input_event(e) {
                this.at_keywords = (e.detail && e.detail.value) || '';
            },
            at_keywords_clear_event() {
                this.at_keywords = '';
                this.load_at_users(1, true);
            },
            at_search_event() {
                this.load_at_users(1, true);
            },
            at_scroll_lower_event() {
                if (this.at_loading || this.at_loading_more || this.at_has_more != 1) {
                    return;
                }
                this.load_at_users((this.at_page || 1) + 1, false);
            },
            // 获取艾特用户（支持搜索、分页滚动）
            load_at_users(page, reset) {
                page = page || 1;
                reset = !!reset;
                if (reset) {
                    this.at_loading = true;
                    this.at_user_list = [];
                    this.at_page = 1;
                    this.at_has_more = 0;
                    this.at_bottom_line = false;
                } else {
                    this.at_loading_more = true;
                }
                this.at_req_seq = (this.at_req_seq || 0) + 1;
                var req_seq = this.at_req_seq;
                var req_type = this.at_type || 'follow';
                var req_keywords = this.at_keywords || '';
                uni.request({
                    url: app.globalData.get_request_url('atuser', 'moment', 'userhome'),
                    method: 'POST',
                    data: {
                        type: req_type,
                        page: page,
                        n: 20,
                        keywords: req_keywords,
                    },
                    dataType: 'json',
                    complete: () => {
                        if (req_seq !== this.at_req_seq) {
                            return;
                        }
                        this.at_loading = false;
                        this.at_loading_more = false;
                    },
                    success: (res) => {
                        if (req_seq !== this.at_req_seq) {
                            return;
                        }
                        var payload = res.data && res.data.code == 0 ? res.data.data : null;
                        var list = [];
                        var has_more = 0;
                        if (Array.isArray(payload)) {
                            list = payload;
                            has_more = 0;
                        } else if (payload && typeof payload === 'object') {
                            list = payload.data || [];
                            has_more = parseInt(payload.has_more || 0) || 0;
                        }
                        var next = reset ? list : (this.at_user_list || []).concat(list);
                        this.at_user_list = next;
                        this.at_page = page;
                        this.at_has_more = has_more;
                        this.at_bottom_line = next.length > 0 && has_more != 1;
                    },
                });
            },
            // 选择艾特用户
            at_user_choice_event(e) {
                var id = parseInt(e.currentTarget.dataset.id || 0) || 0;
                var name = e.currentTarget.dataset.name || '';
                if (!id || !name) {
                    return;
                }
                var ids = (this.at_user_ids || []).slice();
                if (ids.indexOf(id) == -1) {
                    ids.push(id);
                    this.at_user_ids = ids;
                    var content = this.form.content || '';
                    this.insert_text((content !== '' && !/\s$/.test(content) ? ' @' : '@') + name + ' ');
                } else {
                    this.focus_input();
                }
                this.at_popup_status = false;
            },
            // 选择图片（可多选；微信等端单次最多 9 张）
            images_event() {
                var self = this;
                var remain = this.images_max - (this.image_list || []).length;
                if (remain <= 0) {
                    app.globalData.showToast(this.$t('moment-form.images_max').replace('{max}', this.images_max));
                    return;
                }
                var count = Math.min(remain, 9);
                // #ifdef MP-WEIXIN
                if (typeof uni.chooseMedia === 'function') {
                    uni.chooseMedia({
                        count: count,
                        mediaType: ['image'],
                        success(res) {
                            var paths = (res.tempFiles || []).map(function (f) {
                                return f.tempFilePath;
                            }).filter(Boolean);
                            self.upload_images(paths, 0);
                        },
                    });
                    return;
                }
                // #endif
                uni.chooseImage({
                    count: count,
                    success(res) {
                        self.upload_images(res.tempFilePaths || [], 0);
                    },
                });
            },
            // 上传图片
            upload_images(paths, index) {
                if (index >= paths.length || (this.image_list || []).length >= this.images_max) {
                    return;
                }
                uni.showLoading({ title: this.$t('common.uploading_wait_moment'), mask: true });
                uni.uploadFile({
                    url: app.globalData.get_request_url('index', 'ueditor'),
                    filePath: paths[index],
                    name: 'upfile',
                    formData: {
                        action: 'uploadimage',
                        path_type: this.propEditorPathType,
                    },
                    complete: () => {
                        uni.hideLoading();
                    },
                    success: (up) => {
                        var result = typeof up.data == 'object' ? up.data : JSON.parse(up.data || '{}');
                        if (up.statusCode == 200 && result.code == 0 && result.data && result.data.url) {
                            var url = this.media_url_view(result.data.url || '');
                            this.image_list = (this.image_list || []).concat([url]);
                            this.image_id_list = (this.image_id_list || []).concat([parseInt(result.data.id || 0) || 0]);
                        } else {
                            app.globalData.showToast((result && result.msg) || this.$t('common.sub_error_retry_tips'));
                        }
                        this.upload_images(paths, index + 1);
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 删除图片（支持直接传 index，或旧的 event.dataset）
            image_delete_event(index) {
                if (this.media_locked || this.propLoading) {
                    return;
                }
                if (typeof index === 'object' && index != null) {
                    var ds = (index.currentTarget && index.currentTarget.dataset) || {};
                    index = ds.index;
                }
                index = parseInt(index, 10);
                if (isNaN(index) || index < 0) {
                    return;
                }
                var list = (this.image_list || []).slice();
                var id_list = (this.image_id_list || []).slice();
                if (index >= list.length) {
                    return;
                }
                var url = list[index] || '';
                var file_id = id_list[index] || 0;
                // 已保存附件留给保存接口对比删除；本次新上传的可立刻清理
                if (url && !this.is_saved_media_url(url)) {
                    this.delete_remote_file({ id: file_id, url: url });
                }
                list.splice(index, 1);
                id_list.splice(index, 1);
                this.image_list = list;
                this.image_id_list = id_list;
            },
            // 预览图片
            preview_image_event(e) {
                var index = parseInt((e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.index) || 0, 10);
                var urls = this.image_list || [];
                if (!urls.length) {
                    return;
                }
                uni.previewImage({ current: urls[index] || urls[0], urls: urls });
            },
            // 选择视频
            video_event() {
                var self = this;
                if (this.video_url) {
                    uni.showModal({
                        title: this.$t('common.warm_tips'),
                        content: this.$t('moment-form.video_replace'),
                        success(ret) {
                            if (ret.confirm) {
                                self.choose_video();
                            }
                        },
                    });
                    return;
                }
                this.choose_video();
            },
            // 选择并上传视频
            choose_video() {
                var self = this;
                var old_url = this.video_url || '';
                var old_id = this.video_id || 0;
                uni.chooseVideo({
                    sourceType: ['album', 'camera'],
                    compressed: true,
                    success(res) {
                        uni.showLoading({
                            title: self.$t('common.uploading_wait_moment'),
                            mask: true,
                        });
                        uni.uploadFile({
                            url: app.globalData.get_request_url('index', 'ueditor'),
                            filePath: res.tempFilePath,
                            name: 'upfile',
                            formData: {
                                action: 'uploadvideo',
                                path_type: self.propEditorPathType,
                            },
                            success: function (up) {
                                uni.hideLoading();
                                var result = typeof up.data == 'object' ? up.data : JSON.parse(up.data || '{}');
                                if (up.statusCode == 200 && result.code == 0 && result.data && result.data.url) {
                                    self.video_url = self.media_url_view(result.data.url || '');
                                    self.video_id = result.data.id || 0;
                                    // 仅清理本次新上传被替换掉的视频；编辑回填的旧视频等保存再删
                                    if (old_url && old_url != self.video_url) {
                                        var old_key = self.media_path_key(old_url);
                                        if (!old_key || old_key != self.saved_video_url) {
                                            self.delete_remote_file({ id: old_id, url: old_url });
                                        }
                                    }
                                } else {
                                    app.globalData.showToast((result && result.msg) || self.$t('common.sub_error_retry_tips'));
                                }
                            },
                            fail: function () {
                                uni.hideLoading();
                                app.globalData.showToast(self.$t('common.internet_error_tips'));
                            },
                        });
                    },
                });
            },
            // 删除视频
            video_delete_event() {
                if (this.media_locked || this.propLoading) {
                    return;
                }
                if (this.video_url) {
                    var key = this.media_path_key(this.video_url);
                    if (!key || key != this.saved_video_url) {
                        this.delete_remote_file({ id: this.video_id || 0, url: this.video_url });
                    }
                }
                this.video_url = '';
                this.video_id = 0;
            },
            // 校验并提交
            submit_event() {
                if (this.propLoading || this.media_locked) {
                    return;
                }
                var data = this.get_data();
                var content = (data.content || '').trim();
                if (!content && !(data.images || []).length && !data.video_url) {
                    app.globalData.showToast(this.content_empty_tips);
                    return;
                }
                // 一点击发布，附件已随表单提交，禁止再 deletefile
                this.media_locked = true;
                this.$emit('compose-submit', data);
            },
        },
    };
</script>
<style scoped>
    .comment-input {
        /* 小程序原生 textarea 不认 scoped 的 min-height，高度用内联 style */
        width: 100%;
        box-sizing: border-box;
    }
    .media-wrap {
        width: 100%;
    }
    /* 与动态展示一致：一行三张铺满 */
    .media-images {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10rpx;
    }
    .media-item {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        overflow: hidden;
        background: #f5f5f5;
    }
    .media-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: block;
    }
    .video-item {
        position: relative;
        width: 100%;
    }
    .media-video {
        width: 100%;
        height: 320rpx;
        display: block;
    }
    .media-del {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        width: 48rpx;
        height: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .media-del-video {
        top: 10rpx;
        right: 10rpx;
    }
    .toolbar {
        padding-top: 20rpx;
    }
    .toolbar-left {
        min-height: 48rpx;
    }
    .toolbar-right {
        flex-shrink: 0;
        margin-left: 20rpx;
        display: flex;
        align-items: center;
    }
    .tool-btn {
        width: 48rpx;
        height: 48rpx;
        margin-right: 20rpx;
        padding: 0;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        line-height: 1;
    }
    .emoji-icon {
        width: 40rpx;
        height: 40rpx !important;
    }
    /* 图+数量：宽度自适应，高度与其它按钮一致 */
    .tool-btn.flex-row {
        width: auto;
        min-width: 48rpx;
        padding-right: 4rpx;
    }
    .tool-text {
        color: #666;
    }
    .tool-char {
        font-size: 40rpx;
        font-weight: 500;
        line-height: 48rpx;
        height: 48rpx;
        color: #666;
    }
    .tool-char-at {
        transform: translateY(-6rpx);
    }
    .tool-char-topic {
        transform: translateY(-2rpx);
    }
    .images-count {
        line-height: 1;
        display: flex;
        align-items: center;
    }
    .at-popup {
        position: relative;
        height: 60vh;
        border-radius: 24rpx 24rpx 0 0;
        overflow: hidden;
        box-sizing: border-box;
    }
    .at-popup-head,
    .at-search {
        flex-shrink: 0;
    }
    .at-tab-item {
        padding-bottom: 8rpx;
    }
    .at-search-box {
        height: 64rpx;
    }
    .at-search-input {
        height: 64rpx;
        font-size: 26rpx;
    }
    .at-list {
        height: 0;
        min-height: 0;
    }
    .at-avatar {
        width: 64rpx;
        height: 64rpx;
        flex-shrink: 0;
    }
</style>
