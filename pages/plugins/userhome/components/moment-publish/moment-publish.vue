<template>
    <view>
        <!-- 内联：个人主页头部下方直接发布 -->
        <view v-if="propInline" class="moment-publish-inline bg-white border-radius-main padding-main">
            <component-moment-compose
                ref="compose"
                :propPlaceholder="content_placeholder"
                :propSubmitText="$t('moment-form.submit')"
                :propMaxlength="1000"
                :propLoading="form_submit_loading"
                :propEditorPathType="editor_path_type"
                :propImagesMax="images_max"
                :propTools="compose_tools"
                @compose-submit="form_submit"
                @emoji-open="emoji_open_event"
            ></component-moment-compose>
        </view>

        <!-- 弹窗：广场/列表点按钮发布 -->
        <component-popup v-else :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="moment-publish bg-white" @tap.stop="">
                <view class="flex-row jc-sb align-c padding-main br-b-e">
                    <view class="text-size fw-b">{{ $t('home.publish_moment') }}</view>
                    <view @tap.stop="popup_close_event">
                        <iconfont name="icon-close-line" color="#333" size="28rpx"></iconfont>
                    </view>
                </view>
                <view class="moment-publish-body padding-main">
                    <component-moment-compose
                        v-if="popup_status"
                        ref="compose"
                        :propPlaceholder="content_placeholder"
                        :propSubmitText="$t('moment-form.submit')"
                        :propMaxlength="1000"
                        :propLoading="form_submit_loading"
                        :propAutoFocus="true"
                        :propEditorPathType="editor_path_type"
                        :propImagesMax="images_max"
                        :propTools="compose_tools"
                        @compose-submit="form_submit"
                        @emoji-open="emoji_open_event"
                    ></component-moment-compose>
                </view>
            </view>
        </component-popup>

        <!-- 表情挂在发布弹层外，避免嵌套 fixed 失效 -->
        <component-emoji-popup ref="emoji" v-on:choiceConfirmEvent="emoji_choice_confirm_event"></component-emoji-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentMomentCompose from '@/pages/plugins/userhome/components/moment-compose/moment-compose';
    import componentEmojiPopup from '@/pages/plugins/userhome/components/emoji-popup/emoji-popup';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
    import { getUserhomeConfig, getMomentSaveinfo } from '@/pages/plugins/userhome/utils/compose-cache.js';
    export default {
        mixins: [pluginLocale],
        components: {
            componentPopup,
            componentMomentCompose,
            componentEmojiPopup,
        },
        props: {
            // 个人主页内联展示；广场等仍用弹窗
            propInline: { type: Boolean, default: false },
        },
        data() {
            return {
                popup_status: false,
                form_submit_loading: false,
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
                    at_mutual: 0,
                },
                comment_input_placeholder: '',
            };
        },
        computed: {
            content_placeholder() {
                return this.comment_input_placeholder || this.$t('moment-form.content_placeholder');
            },
        },
        mounted() {
            if (this.propInline) {
                this.load_init();
            } else {
                uni.$on('plugins_userhome_publish_open', this.on_publish_open_event);
            }
        },
        beforeDestroy() {
            uni.$off('plugins_userhome_publish_open', this.on_publish_open_event);
        },
        methods: {
            on_publish_open_event() {
                this.open();
            },
            // 打开发布弹窗
            open() {
                var user = app.globalData.get_user_info(this, 'open');
                if (user == false) {
                    return false;
                }
                if (this.propInline) {
                    return true;
                }
                this.popup_status = true;
                this.load_init();
                return true;
            },
            popup_close_event() {
                this.popup_status = false;
            },
            emoji_open_event() {
                if ((this.$refs.emoji || null) != null) {
                    this.$refs.emoji.init({ emoji_list: this.emoji_list });
                }
            },
            emoji_choice_confirm_event(emoji) {
                emoji = uni.getStorageSync(app.globalData.data.cache_emoji_popup_key) || emoji || '';
                if (emoji && (this.$refs.compose || null) != null) {
                    this.$refs.compose.insert_text(emoji);
                }
            },
            // 初始化配置（path_type 优先用 config 统一下发）
            load_init() {
                var self = this;
                getUserhomeConfig()
                    .then((cfg) => {
                        cfg = cfg || {};
                        if (cfg.editor_path_type) {
                            self.editor_path_type = cfg.editor_path_type;
                        }
                        if (cfg.publish_images_max_number) {
                            self.images_max = parseInt(cfg.publish_images_max_number || 9) || 9;
                        }
                        if (cfg.comment_input_placeholder) {
                            self.comment_input_placeholder = (cfg.comment_input_placeholder || '').toString();
                        }
                        return getMomentSaveinfo();
                    })
                    .then((data) => {
                        if (!data) {
                            return;
                        }
                        self.editor_path_type = data.editor_path_type || self.editor_path_type || '';
                        self.images_max = parseInt(data.images_max_number || self.images_max || 9) || 9;
                        if (data.comment_input_placeholder) {
                            self.comment_input_placeholder = (data.comment_input_placeholder || '').toString();
                        }
                        self.emoji_list = data.emoji_list || [];
                        self.compose_tools = {
                            emoji: data.is_publish_emoji == 1 ? 1 : 0,
                            images: data.is_publish_images == 1 ? 1 : 0,
                            video: data.is_publish_video == 1 ? 1 : 0,
                            at: data.is_publish_at == 1 ? 1 : 0,
                            topic: data.is_publish_topic == 1 ? 1 : 0,
                            at_follow: data.is_moment_at_follow == 1 ? 1 : 0,
                            at_fans: data.is_moment_at_fans == 1 ? 1 : 0,
                            at_mutual: data.is_moment_at_mutual == 1 ? 1 : 0,
                        };
                    });
            },
            // 提交保存
            form_submit(data) {
                if (this.form_submit_loading) {
                    return;
                }
                var user = app.globalData.get_user_info(this, 'form_submit');
                if (user == false) {
                    return;
                }
                this.form_submit_loading = true;
                uni.showLoading({ title: this.$t('common.submit_in_text') });
                uni.request({
                    url: app.globalData.get_request_url('save', 'moment', 'userhome'),
                    method: 'POST',
                    data: {
                        content: data.content || '',
                        images: JSON.stringify(data.images || []),
                        video_url: data.video_url || '',
                        at_user_ids: JSON.stringify(data.at_user_ids || []),
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            if (this.$refs.compose && this.$refs.compose.reset) {
                                this.$refs.compose.reset();
                            }
                            this.form_submit_loading = false;
                            if (!this.propInline) {
                                this.popup_status = false;
                            }
                            this.$emit('success');
                        } else {
                            this.form_submit_loading = false;
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.form_submit_loading = false;
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style scoped>
    .moment-publish {
        border-radius: 24rpx 24rpx 0 0;
        overflow: hidden;
    }
    .moment-publish-body {
        padding-bottom: 40rpx;
    }
</style>
