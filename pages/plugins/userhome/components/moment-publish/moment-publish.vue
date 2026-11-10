<template>
    <view>
        <!-- 内联：个人主页头部下方直接发布 -->
        <view v-if="propInline" class="moment-publish-inline bg-white border-radius-main padding-main">
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

        <!-- 弹窗：广场/列表点按钮发布 -->
        <component-popup v-else :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="moment-publish bg-white" @tap.stop="">
                <view class="flex-row jc-sb align-c padding-main br-b-e">
                    <view class="text-size fw-b">{{ $t('home.publish_moment') }}</view>
                    <view @tap.stop="popup_close_event">
                        <iconfont name="icon-close-line" color="#333" size="28rpx"></iconfont>
                    </view>
                </view>
                <view class="padding-main">
                    <component-moment-compose
                        v-if="popup_status"
                        ref="compose"
                        :propPlaceholder="$t('moment-form.content_placeholder')"
                        :propSubmitText="$t('moment-form.submit')"
                        :propMaxlength="1000"
                        :propLoading="form_submit_loading"
                        :propAutoFocus="true"
                        :propEditorPathType="editor_path_type"
                        :propImagesMax="images_max"
                        :propEmojiList="emoji_list"
                        :propTools="compose_tools"
                        @compose-submit="form_submit"
                    ></component-moment-compose>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentMomentCompose from '../moment-compose/moment-compose';
    import pluginLocale from '../../locale/index.js';
    export default {
        mixins: [pluginLocale],
        components: { componentPopup, componentMomentCompose },
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
                },
            };
        },
        mounted() {
            if (this.propInline) {
                this.load_init();
            }
        },
        methods: {
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
            load_init() {
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
                        this.editor_path_type = data.editor_path_type || '';
                        this.images_max = parseInt(data.images_max_number || 9) || 9;
                        this.emoji_list = data.emoji_list || [];
                        this.compose_tools = {
                            emoji: data.is_publish_emoji == 1 ? 1 : 0,
                            images: data.is_publish_images == 1 ? 1 : 0,
                            video: data.is_publish_video == 1 ? 1 : 0,
                            at: data.is_publish_at == 1 ? 1 : 0,
                            topic: data.is_publish_topic == 1 ? 1 : 0,
                            at_follow: data.is_moment_at_follow == 1 ? 1 : 0,
                            at_fans: data.is_moment_at_fans == 1 ? 1 : 0,
                        };
                    },
                });
            },
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
</style>
