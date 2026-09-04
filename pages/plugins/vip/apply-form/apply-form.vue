<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status == 3" class="page-bottom-fixed">
            <view class="padding-main">
                <view v-if="(apply_data || null) != null && apply_data.status == 0" class="padding-vertical-main border-radius-main bg-yellow-light cr-yellow">
                    <view>{{$t('apply-form.modifications_resubmitted_review_confirm_info_co')}}</view>
                </view>
                <view v-else-if="(apply_data || null) != null && apply_data.status == 2" class="padding-vertical-main border-radius-main bg-red-light cr-red">
                    <view>{{$t('apply.previous_application_not_approved')}}<template v-if="(apply_data.fail_reason || null) != null && apply_data.fail_reason != ''">：{{ apply_data.fail_reason }}</template></view>
                    <view class="margin-top-xs">{{$t('apply.modify_info_submit_again')}}</view>
                </view>

                <view v-if="(form_input_data || null) == null || (form_input_data.config || null) == null" class="padding-vertical-main border-radius-main bg-grey-f5 cr-grey">{{$t('apply-form.application_form_configured_yet_contact_administ')}}</view>
                <block v-else>
                    <view class="bg-white border-radius-main padding-main spacing-mb">
                        <component-form-input-base ref="form_input_base" :propConfig="form_input_data.config" :propFormInputId="form_input_data.id" :propKey="random_value" :propBusiness="editor_path_type"></component-form-input-base>
                    </view>
                    <view class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <button class="item bg-main br-main cr-white round text-size" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_event">{{ submit_btn_text }}</button>
                        </view>
                    </view>
                </block>
            </view>
        </view>
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
    import componentFormInputBase from '@/pages/form-input/components/form-input/form-input-base';
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                apply_data: null,
                form_input_data: null,
                editor_path_type: '',
                form_submit_disabled_status: false,
                random_value: 0,
                submit_btn_text: '',
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentFormInputBase,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.init();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'apply', 'vip'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            // 已有会员权限，回申请详情
                            if ((data.is_has_vip_level || 0) == 1) {
                                this.back_to_apply_event();
                                return;
                            }
                            var apply_data = data.apply_data || null;
                            var submit_btn_text = this.$t('apply-form.submit_application');
                            if ((apply_data || null) != null && parseInt(apply_data.status || 0) == 0) {
                                submit_btn_text = this.$t('apply-form.save_changes');
                            }
                            this.setData({
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                                apply_data: apply_data,
                                form_input_data: data.form_input_data || null,
                                editor_path_type: data.editor_path_type || '',
                                submit_btn_text: submit_btn_text,
                                random_value: Math.random(),
                            });
                            uni.setNavigationBarTitle({
                                title: this.$t('pages.plugins-vip-apply-form'),
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            form_submit_event() {
                if (this.form_submit_disabled_status) {
                    return false;
                }
                if ((this.$refs.form_input_base || null) == null) {
                    return false;
                }
                var e = this.$refs.form_input_base.on_submit_event();
                var status = e.status || 'success';
                var message = e.message || '';
                var submit_data = e.submit_data || {};
                if (status == 'error') {
                    app.globalData.showToast(message);
                    return false;
                }
                this.setData({
                    form_submit_disabled_status: true,
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'apply', 'vip'),
                    method: 'POST',
                    data: submit_data,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            // 成功保持禁用，避免重复点击；提示后返回
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(() => {
                                this.back_to_apply_event();
                            }, 1000);
                        } else {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'form_submit_event')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 上级是申请页则返回，否则进入申请页
            back_to_apply_event() {
                var prev = app.globalData.prev_page() || '';
                if (prev.indexOf('pages/plugins/vip/apply/apply') != -1) {
                    uni.navigateBack();
                } else {
                    app.globalData.url_open('/pages/plugins/vip/apply/apply', true);
                }
            },
        },
    };
</script>
<style></style>
