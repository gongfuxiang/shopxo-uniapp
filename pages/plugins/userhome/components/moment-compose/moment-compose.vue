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
            <view v-if="(image_list || []).length > 0" class="flex-row flex-wrap">
                <view v-for="(img, index) in image_list" :key="index" class="media-item pr margin-right-sm margin-bottom-sm">
                    <image class="media-img radius" :src="img" mode="aspectFill" :data-index="index" @tap="preview_image_event"></image>
                    <view class="media-del pa" :data-index="index" @tap.stop="image_delete_event">
                        <iconfont name="icon-close-fillup" size="32rpx" color="rgba(87,91,102,0.7)"></iconfont>
                    </view>
                </view>
            </view>
            <view v-if="video_url" class="video-item pr margin-top-sm">
                <video class="media-video radius" :src="video_url" controls object-fit="cover"></video>
                <view class="media-del pa" @tap.stop="video_delete_event">
                    <iconfont name="icon-close-fillup" size="32rpx" color="rgba(87,91,102,0.7)"></iconfont>
                </view>
            </view>
        </view>

        <view class="toolbar flex-row align-c">
            <view class="toolbar-left flex-1 flex-row align-c flex-wrap">
                <view v-if="tools.emoji == 1" class="tool-btn" @tap="emoji_event">
                    <iconfont name="icon-emoji" size="40rpx" color="#666"></iconfont>
                </view>
                <view v-if="tools.images == 1" class="tool-btn flex-row align-c" @tap="images_event">
                    <iconfont name="icon-images" size="40rpx" color="#666"></iconfont>
                    <text class="images-count text-size-xs cr-grey margin-left-xs">{{ (image_list || []).length }}/{{ images_max }}</text>
                </view>
                <view v-if="tools.video == 1" class="tool-btn" @tap="video_event">
                    <iconfont name="icon-video" size="40rpx" color="#666"></iconfont>
                </view>
                <view v-if="show_at" class="tool-btn tool-text" @tap="at_event"><text class="tool-char">@</text></view>
                <view v-if="tools.topic == 1" class="tool-btn tool-text" @tap="topic_event"><text class="tool-char">#</text></view>
            </view>
            <view class="toolbar-right">
                <button class="round cr-white bg-main text-size-sm" type="default" size="mini" hover-class="none" :loading="propLoading" :disabled="propLoading" @tap.stop="submit_event">{{ propSubmitText }}</button>
            </view>
        </view>

        <!-- 未打开时不渲染；勿抬高 propIndex（遮罩会盖住内容层） -->
        <component-popup v-if="at_popup_status" :propShow="true" propPosition="bottom" @onclose="at_popup_close_event">
            <view class="at-popup bg-white">
                <view class="flex-row jc-sb align-c padding-main br-b-e">
                    <view class="text-size fw-b">{{ $t('moment-form.at') }}</view>
                    <view @tap="at_popup_close_event">
                        <iconfont name="icon-close-line" color="#333" size="28rpx"></iconfont>
                    </view>
                </view>
                <view v-if="show_at_tabs" class="flex-row padding-horizontal-main padding-top-main">
                    <view v-if="tools.at_follow == 1" class="at-tab margin-right-main" :class="at_type == 'follow' ? 'cr-main fw-b' : 'cr-grey'" data-type="follow" @tap="at_type_event">{{ $t('moment-form.at_follow') }}</view>
                    <view v-if="tools.at_fans == 1" class="at-tab" :class="at_type == 'fans' ? 'cr-main fw-b' : 'cr-grey'" data-type="fans" @tap="at_type_event">{{ $t('moment-form.at_fans') }}</view>
                </view>
                <scroll-view scroll-y class="at-list">
                    <block v-if="(at_user_list || []).length > 0">
                        <view v-for="(user, index) in at_user_list" :key="user.id || index" class="at-user-item flex-row align-c padding-main br-b-f5" :data-id="user.id" :data-name="user.user_name_view" @tap="at_user_choice_event">
                            <image class="at-avatar circle margin-right-main" :src="user.avatar" mode="aspectFill"></image>
                            <text class="flex-1">{{ user.user_name_view }}</text>
                            <iconfont v-if="(at_user_ids || []).indexOf(user.id) >= 0" name="icon-checked" size="28rpx" color="#999"></iconfont>
                        </view>
                    </block>
                    <view v-else class="tc padding-main cr-grey text-size-sm">{{ at_loading ? $t('common.loading_in_text') : $t('moment-form.at_empty') }}</view>
                </scroll-view>
            </view>
        </component-popup>

        <component-emoji-popup v-if="emoji_ready" ref="emoji" @choiceConfirmEvent="emoji_choice_event"></component-emoji-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentEmojiPopup from '@/pages/common/components/emoji-popup/emoji-popup';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
    export default {
        mixins: [pluginLocale],
        components: {
            componentPopup,
            componentEmojiPopup,
        },
        props: {
            propPlaceholder: { type: String, default: '' },
            propSubmitText: { type: String, default: '' },
            propMaxlength: { type: [Number, String], default: 1000 },
            propLoading: { type: Boolean, default: false },
            propAutoFocus: { type: Boolean, default: false },
            propEditorPathType: { type: String, default: '' },
            propImagesMax: { type: [Number, String], default: 9 },
            propEmojiList: { type: Array, default: () => [] },
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
                }),
            },
        },
        // 组件数据
        data() {
            return {
                form: { content: '' },
                image_list: [],
                // url -> 附件 id，叉掉时调 deletefile
                image_ids: {},
                video_url: '',
                video_id: 0,
                at_user_ids: [],
                at_user_list: [],
                at_type: 'follow',
                at_popup_status: false,
                at_loading: false,
                emoji_ready: false,
                input_focus: false,
                input_cursor: -1,
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
                return this.tools.at == 1 && (this.tools.at_follow == 1 || this.tools.at_fans == 1);
            },
            // 是否显示关注/粉丝切换
            show_at_tabs() {
                return this.tools.at_follow == 1 && this.tools.at_fans == 1;
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
            // 默认艾特类型（关注优先）
            'tools.at_follow': {
                immediate: true,
                handler() {
                    this.at_type = this.tools.at_follow == 1 ? 'follow' : 'fans';
                },
            },
        },
        methods: {
            // 重置表单
            reset() {
                this.form = { content: '' };
                this.image_list = [];
                this.image_ids = {};
                this.video_url = '';
                this.video_id = 0;
                this.at_user_ids = [];
                this.at_user_list = [];
                this.at_popup_status = false;
                this.emoji_ready = false;
                this.input_focus = false;
                this.input_cursor = -1;
            },
            // 回填编辑数据
            set_form_data(data) {
                data = data || {};
                this.form = { content: data.content || '' };
                this.image_list = Array.isArray(data.images) ? data.images.slice() : [];
                this.image_ids = {};
                this.video_url = data.video_url || '';
                this.video_id = 0;
                this.at_user_ids = Array.isArray(data.at_user_ids) ? data.at_user_ids.slice() : [];
                this.at_popup_status = false;
                this.emoji_ready = false;
                this.input_focus = false;
                this.input_cursor = -1;
            },
            // 删除远程附件（发布未提交时叉掉）
            delete_remote_file(opts) {
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
            // 组装提交数据
            get_data() {
                return {
                    content: this.form.content || '',
                    images: this.image_list || [],
                    video_url: this.video_url || '',
                    at_user_ids: this.at_user_ids || [],
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
            // 打开表情
            emoji_event() {
                this.input_focus = false;
                this.emoji_ready = true;
                this.$nextTick(() => {
                    var emoji_ref = this.$refs.emoji;
                    if (!emoji_ref || !emoji_ref.init) {
                        return;
                    }
                    // 关闭表情层时卸载，避免隐藏弹层挡住发布弹窗
                    if (!emoji_ref._moment_compose_close_bind) {
                        var self = this;
                        var origin_close = emoji_ref.popup_close_event;
                        emoji_ref.popup_close_event = function (e) {
                            if (typeof origin_close === 'function') {
                                origin_close.call(emoji_ref, e);
                            }
                            self.emoji_ready = false;
                            self.focus_input();
                        };
                        emoji_ref._moment_compose_close_bind = true;
                    }
                    emoji_ref.init({ emoji_list: this.propEmojiList || [] });
                });
            },
            // 选择表情
            emoji_choice_event(emoji) {
                emoji = uni.getStorageSync(app.globalData.data.cache_emoji_popup_key) || emoji || '';
                this.emoji_ready = false;
                if (emoji) {
                    this.insert_text(emoji);
                } else {
                    this.focus_input();
                }
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
                this.load_at_users();
            },
            // 关闭艾特
            at_popup_close_event() {
                this.at_popup_status = false;
                this.focus_input();
            },
            // 切换艾特类型
            at_type_event(e) {
                var type = e.currentTarget.dataset.type || 'follow';
                if (type == this.at_type) {
                    return;
                }
                this.at_type = type;
                this.load_at_users();
            },
            // 获取艾特用户
            load_at_users() {
                this.at_loading = true;
                this.at_user_list = [];
                uni.request({
                    url: app.globalData.get_request_url('atuser', 'moment', 'userhome'),
                    method: 'POST',
                    data: { type: this.at_type || 'follow' },
                    dataType: 'json',
                    complete: () => {
                        this.at_loading = false;
                    },
                    success: (res) => {
                        this.at_user_list = res.data && res.data.code == 0 ? res.data.data || [] : [];
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
                            var url = result.data.url;
                            this.image_list = (this.image_list || []).concat([url]);
                            if (result.data.id) {
                                var ids = Object.assign({}, this.image_ids || {});
                                ids[url] = result.data.id;
                                this.image_ids = ids;
                            }
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
            // 删除图片
            image_delete_event(e) {
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var list = (this.image_list || []).slice();
                var url = list[index] || '';
                if (url) {
                    var ids = Object.assign({}, this.image_ids || {});
                    this.delete_remote_file({ id: ids[url] || 0, url: url });
                    delete ids[url];
                    this.image_ids = ids;
                }
                list.splice(index, 1);
                this.image_list = list;
            },
            // 预览图片
            preview_image_event(e) {
                var index = parseInt(e.currentTarget.dataset.index || 0);
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
                                    self.video_url = result.data.url;
                                    self.video_id = result.data.id || 0;
                                    // 替换成功后删旧视频
                                    if (old_url && old_url != self.video_url) {
                                        self.delete_remote_file({ id: old_id, url: old_url });
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
                if (this.video_url) {
                    this.delete_remote_file({ id: this.video_id || 0, url: this.video_url });
                }
                this.video_url = '';
                this.video_id = 0;
            },
            // 校验并提交
            submit_event() {
                var data = this.get_data();
                var content = (data.content || '').trim();
                if (!content && !(data.images || []).length && !data.video_url) {
                    app.globalData.showToast(this.content_empty_tips);
                    return;
                }
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
    .media-item,
    .media-img {
        width: 160rpx;
        height: 160rpx;
    }
    .media-video {
        width: 100%;
        height: 320rpx;
    }
    .media-del {
        top: -10rpx;
        right: -10rpx;
        z-index: 2;
    }
    .video-item .media-del {
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
        /* 文字字形视觉中心偏上，略下移与 iconfont 对齐 */
        transform: translateY(2rpx);
    }
    .images-count {
        line-height: 1;
        display: flex;
        align-items: center;
    }
    .at-popup {
        border-radius: 24rpx 24rpx 0 0;
        overflow: hidden;
    }
    .at-list {
        max-height: 60vh;
    }
    .at-avatar {
        width: 64rpx;
        height: 64rpx;
        flex-shrink: 0;
    }
    .at-tab {
        font-size: 28rpx;
    }
</style>
