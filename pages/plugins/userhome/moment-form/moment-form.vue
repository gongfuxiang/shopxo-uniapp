<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed padding-main">
            <view class="bg-white border-radius-main padding-main spacing-mb">
                <component-moment-compose
                    ref="compose"
                    :propPlaceholder="$t('moment-form.content_placeholder')"
                    :propSubmitText="moment_id > 0 ? $t('moment-form.save') : $t('moment-form.submit')"
                    :propMaxlength="1000"
                    :propLoading="form_submit_loading"
                    :propEditorPathType="editor_path_type"
                    :propImagesMax="images_max"
                    :propTools="compose_tools"
                    @compose-submit="form_submit"
                    @emoji-open="emoji_open_event"
                ></component-moment-compose>
            </view>
        </view>
        <component-emoji-popup ref="emoji" v-on:choiceConfirmEvent="emoji_choice_confirm_event"></component-emoji-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentMomentCompose from '@/pages/plugins/userhome/components/moment-compose/moment-compose';
    import componentEmojiPopup from '@/pages/plugins/userhome/components/emoji-popup/emoji-popup';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                moment_id: 0,
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
                },
            };
        },
        components: {
            componentCommon,
            componentMomentCompose,
            componentEmojiPopup,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);
            var moment_id = parseInt((params && params.id) || 0) || 0;
            this.setData({
                params: params || {},
                moment_id: moment_id,
            });
            uni.setNavigationBarTitle({
                title: this.$t(moment_id > 0 ? 'pages.plugins-userhome-moment-form-edit' : 'pages.plugins-userhome-moment-form'),
            });
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 初始化
            this.init();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);
        },
        methods: {
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
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user == false) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'moment', 'userhome'),
                    method: 'POST',
                    data: { id: this.moment_id || 0 },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code != 0) {
                            app.globalData.showToast(res.data.msg);
                            return;
                        }
                        var data = res.data.data || {};
                        this.setData({
                            editor_path_type: data.editor_path_type || '',
                            images_max: parseInt(data.images_max_number || 9) || 9,
                            emoji_list: data.emoji_list || [],
                            compose_tools: {
                                emoji: data.is_publish_emoji == 1 ? 1 : 0,
                                images: data.is_publish_images == 1 ? 1 : 0,
                                video: data.is_publish_video == 1 ? 1 : 0,
                                at: data.is_publish_at == 1 ? 1 : 0,
                                topic: data.is_publish_topic == 1 ? 1 : 0,
                                at_follow: data.is_moment_at_follow == 1 ? 1 : 0,
                                at_fans: data.is_moment_at_fans == 1 ? 1 : 0,
                            },
                        });
                        // 编辑回填
                        if (this.moment_id > 0 && data.data) {
                            this.$nextTick(() => {
                                if (this.$refs.compose && this.$refs.compose.set_form_data) {
                                    this.$refs.compose.set_form_data(data.data);
                                }
                            });
                        }
                    },
                });
            },
            // 提交保存
            form_submit(data) {
                if (this.form_submit_loading) {
                    return;
                }
                this.setData({ form_submit_loading: true });
                uni.showLoading({ title: this.$t('common.submit_in_text') });
                var post = {
                    content: data.content || '',
                    images: JSON.stringify(data.images || []),
                    video_url: data.video_url || '',
                    at_user_ids: JSON.stringify(data.at_user_ids || []),
                };
                if (this.moment_id > 0) {
                    post.id = this.moment_id;
                }
                uni.request({
                    url: app.globalData.get_request_url('save', 'moment', 'userhome'),
                    method: 'POST',
                    data: post,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            // 通知主页刷新；列表：编辑只替换当前条，新增整表重拉
                            var edit_id = parseInt(this.moment_id || 0);
                            uni.setStorageSync('cache_plugins_userhome_home_refresh', 1);
                            uni.setStorageSync('cache_plugins_userhome_list_refresh', {
                                type: edit_id > 0 ? 'edit' : 'add',
                                id: edit_id,
                            });
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(function () {
                                app.globalData.page_back_prev_event();
                            }, 1500);
                        } else {
                            this.setData({ form_submit_loading: false });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({ form_submit_loading: false });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style scoped>
    @import './moment-form.css';
</style>
