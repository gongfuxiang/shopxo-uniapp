<template>
    <view :class="theme_view">
        <form @submit="form_submit">
            <view class="page-bottom-fixed padding-main">
                <view v-if="profile_pending_tip" class="bg-yellow-light border-radius-main padding-main text-size-sm margin-bottom-main">{{ profile_pending_tip }}</view>

                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="text-size-sm cr-grey margin-bottom-sm">{{ $t('profile.nickname') }}</view>
                    <input class="wh-auto" name="nickname" type="text" maxlength="60" :value="form.nickname" :placeholder="nickname_placeholder" placeholder-class="cr-grey-9" @input="nickname_event" />
                    <view v-if="nickname_reject_tip" class="text-size-xs cr-red margin-top-xs">{{ nickname_reject_tip }}</view>
                </view>

                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="text-size-sm cr-grey margin-bottom-sm">{{ $t('profile.avatar') }}</view>
                    <view class="flex-row align-c">
                        <view class="avatar-box pr" @tap="avatar_choose_event">
                            <image v-if="form.avatar" class="avatar-img circle" :src="form.avatar" mode="aspectFill"></image>
                            <view v-else class="avatar-img circle flex-row align-c jc-c bg-grey-e">
                                <iconfont name="icon-add" size="40rpx" color="#999"></iconfont>
                            </view>
                            <view v-if="form.avatar" class="avatar-del pa" @tap.stop="avatar_clear_event">
                                <iconfont name="icon-close-fillup" size="28rpx" color="rgba(87,91,102,0.7)"></iconfont>
                            </view>
                        </view>
                        <text class="text-size-xs cr-grey-9 margin-left-main flex-1">{{ $t('profile.avatar_tips') }}</text>
                    </view>
                    <view v-if="avatar_reject_tip" class="text-size-xs cr-red margin-top-xs">{{ avatar_reject_tip }}</view>
                </view>

                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="text-size-sm cr-grey margin-bottom-sm">{{ $t('profile.signature') }}</view>
                    <textarea class="wh-auto" name="signature" maxlength="255" :value="form.signature" :placeholder="$t('profile.signature_placeholder')" placeholder-class="cr-grey-9" @input="signature_event"></textarea>
                    <view v-if="signature_reject_tip" class="text-size-xs cr-red margin-top-xs">{{ signature_reject_tip }}</view>
                </view>

                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="text-size-sm cr-grey margin-bottom-sm">{{ $t('profile.follow_list_view') }}</view>
                    <view class="text-size-xs cr-grey-9 margin-bottom-sm">{{ $t('profile.follow_list_view_tips') }}</view>
                    <radio-group @change="follow_view_event">
                        <label class="flex-row align-c margin-bottom-sm">
                            <radio value="0" :checked="form.follow_list_view == 0" :color="theme_color" style="transform: scale(0.7)" />
                            <text class="margin-left-sm text-size-sm">{{ $t('profile.list_follow_system') }}（{{ follow_list_system_tips }}）</text>
                        </label>
                        <label class="flex-row align-c margin-bottom-sm">
                            <radio value="1" :checked="form.follow_list_view == 1" :color="theme_color" style="transform: scale(0.7)" />
                            <text class="margin-left-sm text-size-sm">{{ $t('profile.list_allow') }}</text>
                        </label>
                        <label class="flex-row align-c">
                            <radio value="2" :checked="form.follow_list_view == 2" :color="theme_color" style="transform: scale(0.7)" />
                            <text class="margin-left-sm text-size-sm">{{ $t('profile.list_deny') }}</text>
                        </label>
                    </radio-group>
                </view>

                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="text-size-sm cr-grey margin-bottom-sm">{{ $t('profile.fans_list_view') }}</view>
                    <view class="text-size-xs cr-grey-9 margin-bottom-sm">{{ $t('profile.fans_list_view_tips') }}</view>
                    <radio-group @change="fans_view_event">
                        <label class="flex-row align-c margin-bottom-sm">
                            <radio value="0" :checked="form.fans_list_view == 0" :color="theme_color" style="transform: scale(0.7)" />
                            <text class="margin-left-sm text-size-sm">{{ $t('profile.list_follow_system') }}（{{ fans_list_system_tips }}）</text>
                        </label>
                        <label class="flex-row align-c margin-bottom-sm">
                            <radio value="1" :checked="form.fans_list_view == 1" :color="theme_color" style="transform: scale(0.7)" />
                            <text class="margin-left-sm text-size-sm">{{ $t('profile.list_allow') }}</text>
                        </label>
                        <label class="flex-row align-c">
                            <radio value="2" :checked="form.fans_list_view == 2" :color="theme_color" style="transform: scale(0.7)" />
                            <text class="margin-left-sm text-size-sm">{{ $t('profile.list_deny') }}</text>
                        </label>
                    </radio-group>
                </view>
            </view>

            <view class="bottom-fixed">
                <view class="bottom-line-exclude">
                    <button class="bg-main cr-white round text-size wh-auto" type="default" form-type="submit" hover-class="none" :loading="form_loading" :disabled="form_loading">{{ $t('common.save') }}</button>
                </view>
            </view>
        </form>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import pluginLocale from '@/pages/plugins/sns/locale/index.js';
    export default {
        mixins: [pluginLocale],
        components: {
            componentCommon,
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                form_loading: false,
                form: {
                    nickname: '',
                    signature: '',
                    avatar: '',
                    follow_list_view: 0,
                    fans_list_view: 0,
                },
                avatar_path_type: '',
                nickname_placeholder: '',
                nickname_reject_tip: '',
                signature_reject_tip: '',
                avatar_reject_tip: '',
                profile_pending_tip: '',
                follow_list_system_tips: '',
                fans_list_system_tips: '',
            };
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);
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
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user == false) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('profilesaveinfo', 'index', 'sns'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code != 0) {
                            app.globalData.showToast(res.data.msg);
                            return;
                        }
                        var data = res.data.data || {};
                        var default_name = data.user_name_view || '';
                        this.setData({
                            form: {
                                nickname: data.nickname || '',
                                signature: data.signature || '',
                                avatar: data.avatar || '',
                                follow_list_view: parseInt(data.follow_list_view || 0) || 0,
                                fans_list_view: parseInt(data.fans_list_view || 0) || 0,
                            },
                            avatar_path_type: data.avatar_path_type || '',
                            nickname_placeholder: this.$t('profile.nickname_placeholder') + (default_name ? '（' + default_name + '）' : ''),
                            nickname_reject_tip: data.nickname_reject_tip || '',
                            signature_reject_tip: data.signature_reject_tip || '',
                            avatar_reject_tip: data.avatar_reject_tip || '',
                            profile_pending_tip: data.profile_pending_tip || '',
                            follow_list_system_tips: data.follow_list_system_tips || '',
                            fans_list_system_tips: data.fans_list_system_tips || '',
                        });
                    },
                });
            },
            // 昵称输入
            nickname_event(e) {
                this.form.nickname = e.detail.value;
            },
            // 签名输入
            signature_event(e) {
                this.form.signature = e.detail.value;
            },
            // 关注列表可见
            follow_view_event(e) {
                this.form.follow_list_view = parseInt(e.detail.value || 0) || 0;
            },
            // 粉丝列表可见
            fans_view_event(e) {
                this.form.fans_list_view = parseInt(e.detail.value || 0) || 0;
            },
            // 选择头像（仅改表单；保存成功后由服务端删旧文件）
            avatar_choose_event() {
                var self = this;
                uni.chooseImage({
                    count: 1,
                    success(res) {
                        var path = (res.tempFilePaths || [])[0];
                        if (!path) {
                            return;
                        }
                        uni.showLoading({ title: self.$t('common.uploading_wait_moment'), mask: true });
                        uni.uploadFile({
                            url: app.globalData.get_request_url('index', 'ueditor'),
                            filePath: path,
                            name: 'upfile',
                            formData: {
                                action: 'uploadimage',
                                path_type: self.avatar_path_type || '',
                            },
                            complete: () => {
                                uni.hideLoading();
                            },
                            success: (up) => {
                                var result = typeof up.data == 'object' ? up.data : JSON.parse(up.data || '{}');
                                if (up.statusCode == 200 && result.code == 0 && result.data && result.data.url) {
                                    self.form.avatar = result.data.url;
                                } else {
                                    app.globalData.showToast((result && result.msg) || self.$t('common.sub_error_retry_tips'));
                                }
                            },
                            fail: () => {
                                app.globalData.showToast(self.$t('common.internet_error_tips'));
                            },
                        });
                    },
                });
            },
            // 清除头像（仅清表单，未保存不删远程）
            avatar_clear_event() {
                this.form.avatar = '';
            },
            // 提交保存
            form_submit() {
                if (this.form_loading) {
                    return;
                }
                this.form_loading = true;
                uni.showLoading({ title: this.$t('common.submit_in_text') });
                uni.request({
                    url: app.globalData.get_request_url('profilesave', 'index', 'sns'),
                    method: 'POST',
                    data: {
                        nickname: this.form.nickname || '',
                        signature: this.form.signature || '',
                        avatar: this.form.avatar || '',
                        follow_list_view: this.form.follow_list_view,
                        fans_list_view: this.form.fans_list_view,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        app.globalData.showToast(res.data.msg, res.data.code == 0 ? 'success' : 'error');
                        if (res.data.code == 0) {
                            // 通知主页返回后刷新资料（主页不在 onShow 常刷）
                            uni.setStorageSync('cache_plugins_sns_home_refresh', 1);
                            setTimeout(() => {
                                app.globalData.page_back_prev_event();
                            }, 1200);
                        } else {
                            this.form_loading = false;
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.form_loading = false;
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style scoped>
    @import './profile-edit.css';
</style>
