<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed padding-main">
            <view class="bg-white border-radius-main padding-main spacing-mb">
                <component-moment-compose
                    ref="compose"
                    :propPlaceholder="$t('moment-form.content_placeholder')"
                    :propSubmitText="$t('moment-form.submit')"
                    :propMaxlength="1000"
                    :propLoading="form_submit_loading"
                    :propEditorPathType="editor_path_type"
                    :propImagesMax="images_max"
                    :propEmojiList="emoji_list"
                    :propTools="compose_tools"
                    @compose-submit="form_submit"
                ></component-moment-compose>
            </view>
        </view>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentMomentCompose from '../components/moment-compose/moment-compose';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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
        components: { componentCommon, componentMomentCompose },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.init();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            app.globalData.page_common_on_show(this);
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user == false) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'moment', 'userhome'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code != 0) {
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
                    },
                });
            },
            form_submit(data) {
                if (this.form_submit_loading) {
                    return;
                }
                this.setData({ form_submit_loading: true });
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
</style>
