<template>
    <view class="moment-compose">
        <textarea
            class="comment-input wh-auto border-radius-main padding-main bg-grey-f8"
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

        <view class="toolbar flex-row align-c margin-top-main">
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
                <view v-if="show_at" class="tool-btn tool-text" @tap="at_event">@</view>
                <view v-if="tools.topic == 1" class="tool-btn tool-text" @tap="topic_event">#</view>
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
                    <view v-else class="tc padding-main cr-grey text-size-sm">{{ at_loading ? $t('common.loading_tips') : $t('moment-form.at_empty') }}</view>
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
    import pluginLocale from '../../locale/index.js';
    export default {
        mixins: [pluginLocale],
        components: { componentPopup, componentEmojiPopup },
        props: {
            propPlaceholder: { type: String, default: '' },
            propSubmitText: { type: String, default: '' },
            propMaxlength: { type: [Number, String], default: 1000 },
            propLoading: { type: Boolean, default: false },
            propAutoFocus: { type: Boolean, default: false },
            propEditorPathType: { type: String, default: '' },
            propImagesMax: { type: [Number, String], default: 9 },
            propEmojiList: { type: Array, default: () => [] },
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
        data() {
            return {
                form: { content: '' },
                image_list: [],
                video_url: '',
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
            tools() {
                return this.propTools || {};
            },
            images_max() {
                return parseInt(this.propImagesMax || 9) || 9;
            },
            show_at() {
                return this.tools.at == 1 && (this.tools.at_follow == 1 || this.tools.at_fans == 1);
            },
            show_at_tabs() {
                return this.tools.at_follow == 1 && this.tools.at_fans == 1;
            },
            // 与 PC MomentContentEmptyTips 一致：按开启的附件能力提示
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
            propAutoFocus(val) {
                if (val) {
                    this.focus_input();
                } else {
                    this.input_focus = false;
                }
            },
            'tools.at_follow': {
                immediate: true,
                handler() {
                    this.at_type = this.tools.at_follow == 1 ? 'follow' : 'fans';
                },
            },
        },
        methods: {
            reset() {
                this.form = { content: '' };
                this.image_list = [];
                this.video_url = '';
                this.at_user_ids = [];
                this.at_user_list = [];
                this.at_popup_status = false;
                this.emoji_ready = false;
                this.input_focus = false;
                this.input_cursor = -1;
            },
            get_data() {
                return {
                    content: this.form.content || '',
                    images: this.image_list || [],
                    video_url: this.video_url || '',
                    at_user_ids: this.at_user_ids || [],
                };
            },
            input_blur_event() {
                this.input_focus = false;
            },
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
            content_event(e) {
                this.form = { content: e.detail.value };
                if (typeof e.detail.cursor === 'number') {
                    this.input_cursor = e.detail.cursor;
                }
            },
            insert_text(text) {
                var next = (this.form.content || '') + text;
                this.form = { content: next };
                this.focus_input(next.length);
            },
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
            emoji_choice_event(emoji) {
                emoji = uni.getStorageSync(app.globalData.data.cache_emoji_popup_key) || emoji || '';
                this.emoji_ready = false;
                if (emoji) {
                    this.insert_text(emoji);
                } else {
                    this.focus_input();
                }
            },
            topic_event() {
                var content = this.form.content || '';
                if (/#\s*$/.test(content)) {
                    this.focus_input(content.length);
                    return;
                }
                this.insert_text(content !== '' && !/\s$/.test(content) ? ' #' : '#');
            },
            at_event() {
                if (!this.show_at) {
                    return;
                }
                this.input_focus = false;
                this.at_popup_status = true;
                this.load_at_users();
            },
            at_popup_close_event() {
                this.at_popup_status = false;
                this.focus_input();
            },
            at_type_event(e) {
                var type = e.currentTarget.dataset.type || 'follow';
                if (type == this.at_type) {
                    return;
                }
                this.at_type = type;
                this.load_at_users();
            },
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
            images_event() {
                var self = this;
                var remain = this.images_max - (this.image_list || []).length;
                if (remain <= 0) {
                    app.globalData.showToast(this.$t('moment-form.images_max').replace('{max}', this.images_max));
                    return;
                }
                uni.chooseImage({
                    count: remain,
                    success(res) {
                        self.upload_images(res.tempFilePaths || [], 0);
                    },
                });
            },
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
                            this.image_list = (this.image_list || []).concat([result.data.url]);
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
            image_delete_event(e) {
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var list = (this.image_list || []).slice();
                list.splice(index, 1);
                this.image_list = list;
            },
            preview_image_event(e) {
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var urls = this.image_list || [];
                if (!urls.length) {
                    return;
                }
                uni.previewImage({ current: urls[index] || urls[0], urls: urls });
            },
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
            choose_video() {
                var self = this;
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
            video_delete_event() {
                this.video_url = '';
            },
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
        min-height: 200rpx;
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
    .toolbar-right {
        flex-shrink: 0;
        margin-left: 20rpx;
    }
    .tool-btn {
        margin-right: 28rpx;
        min-width: 44rpx;
        min-height: 44rpx;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .tool-text {
        font-size: 40rpx;
        color: #666;
        font-weight: 600;
        line-height: 1;
    }
    .images-count {
        line-height: 1;
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
