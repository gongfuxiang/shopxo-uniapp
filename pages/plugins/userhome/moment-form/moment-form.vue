<template>
    <view :class="theme_view">
        <form @submit="form_submit" class="form-container">
            <view class="page-bottom-fixed padding-main">
                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <textarea name="content" class="wh-auto" :value="form.content" maxlength="1000" :placeholder="$t('moment-form.content_placeholder')" placeholder-class="cr-grey-9" @input="content_event" />
                    <view class="margin-top-main">
                        <component-upload :propData="image_list" :propMaxNum="9" :propPathType="editor_path_type" @call-back="return_image_event"></component-upload>
                    </view>
                </view>
            </view>
            <view class="bottom-fixed">
                <view class="bottom-line-exclude">
                    <button class="item cr-white bg-main round text-size wh-auto" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('moment-form.submit')}}</button>
                </view>
            </view>
        </form>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentUpload from '@/pages/common/components/upload/upload';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                form: { content: '' },
                image_list: [],
                editor_path_type: '',
                form_submit_loading: false,
            };
        },
        components: { componentCommon, componentUpload },
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
                        if (res.data.code == 0) {
                            this.setData({
                                editor_path_type: res.data.data.editor_path_type || '',
                            });
                        }
                    },
                });
            },
            content_event(e) {
                this.setData({
                    form: { ...this.form, content: e.detail.value },
                });
            },
            return_image_event() {
                var data = (uni.getStorageSync(app.globalData.data.cache_upload_callback_key) || {}).data || [];
                this.setData({ image_list: data });
            },
            form_submit() {
                if (this.form_submit_loading) {
                    return;
                }
                this.setData({ form_submit_loading: true });
                uni.showLoading({ title: this.$t('common.submit_in_text') });
                uni.request({
                    url: app.globalData.get_request_url('save', 'moment', 'userhome'),
                    method: 'POST',
                    data: {
                        content: this.form.content || '',
                        images: JSON.stringify(this.image_list || []),
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
<style>
    textarea {
        min-height: 240rpx;
    }
</style>
