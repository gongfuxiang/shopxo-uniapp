<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="page-bottom-fixed padding-main">
                <view v-if="moment_id > 0" class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="flex-row jc-sb align-c">
                        <view class="text-size">{{ $t('common.enabled') }}</view>
                        <switch :color="theme_color" style="transform: scale(0.7)" :checked="is_enable == 1" @change="is_enable_event"></switch>
                    </view>
                </view>
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
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentMomentCompose from '@/pages/plugins/userhome/components/moment-compose/moment-compose';
    import componentEmojiPopup from '@/pages/plugins/userhome/components/emoji-popup/emoji-popup';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                params: {},
                moment_id: 0,
                is_enable: 1,
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
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
            };
        },
        components: {
            componentCommon,
            componentNoData,
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
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('common.user_not_logged') || this.$t('common.no_relevant_data_tips'),
                    });
                    return;
                }
                this.setData({
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                });
                var post = { id: this.moment_id || 0 };
                // 参与话题：传 topic_id，由服务端取名称预填（避免中文 URL 乱码）
                if (this.moment_id <= 0 && this.params) {
                    var topic_id = parseInt(this.params.topic_id || 0) || 0;
                    if (topic_id > 0) {
                        post.topic_id = topic_id;
                    } else if (this.params.topic) {
                        post.topic = this.params.topic;
                    }
                }
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'moment', 'userhome'),
                    method: 'POST',
                    data: post,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code != 0) {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg || this.$t('common.no_relevant_data_tips'),
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                // 非登录失效：错误已用无数据组件展示
                            }
                            return;
                        }
                        var data = res.data.data || {};
                        this.setData({
                            data_list_loding_status: 3,
                            data_list_loding_msg: '',
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
                                at_mutual: data.is_moment_at_mutual == 1 ? 1 : 0,
                            },
                        });
                        // 编辑回填 / 参与话题预填
                        if (data.data) {
                            this.setData({
                                is_enable: parseInt(data.data.is_enable) == 0 ? 0 : 1,
                            });
                            this.$nextTick(() => {
                                if (this.$refs.compose && this.$refs.compose.set_form_data) {
                                    this.$refs.compose.set_form_data(data.data);
                                }
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            is_enable_event(e) {
                this.setData({
                    is_enable: e.detail.value ? 1 : 0,
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
                    post.is_enable = this.is_enable == 1 ? 1 : 0;
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
                            uni.setStorageSync('cache_plugins_userhome_topic_refresh', 1);
                            uni.setStorageSync('cache_plugins_userhome_feed_refresh', 1);
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
