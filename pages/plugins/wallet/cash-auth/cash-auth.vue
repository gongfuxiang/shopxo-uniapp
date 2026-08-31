<template>
    <view :class="theme_view">
        <view v-if="data_base != null" class="padding-main">
            <view v-if="is_cash_available">
                <form v-if="check_account_list.length > 0" @submit="form_submit" class="form-container oh">
                    <view class="form-gorup margin-bottom radius-md">
                        <view class="form-gorup-title">{{$t('cash-auth.choose_identity_authentication_method')}}<text class="form-group-tips-must">*</text></view>
                        <view class="section">
                            <picker name="account_type" @change="select_check_account_event" :value="check_account_value" :range="check_account_list" range-key="msg">
                                <view :class="'picker name ' + (check_account_value == null ? 'cr-grey' : 'cr-base')">
                                    <view v-if="check_account_value == null">{{$t('cash-auth.select_authentication_account')}}</view>
                                    <view v-else>{{ check_account_list[check_account_value]['msg'] }}</view>
                                </view>
                            </picker>
                        </view>
                    </view>

                    <view class="form-gorup margin-bottom radius-md pr">
                        <view class="form-gorup-title">{{$t('cash-auth.enter_security_verification_code')}}<text class="form-group-tips-must">*</text></view>
                        <input type="number" name="verify" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('cash-auth.verification_code_format_digits')" maxlength="4" />
                        <button :class="'bg-grey br-grey cr-base pa round text-size-sm verify-sub ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">
                            {{ verify_submit_text }}
                        </button>
                    </view>

                    <view class="form-gorup form-gorup-submit margin-top-main">
                        <button class="bg-main cr-white br-main round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('common.submit')}}</button>
                    </view>
                </form>

                <view class="margin-top-lg cr-base">
                    <view class="fw-b text-size">{{$t('cash-auth.operation_prompt')}}</view>
                    <view class="text-size-xs">
                        <view>{{$t('cash-auth.select')}}<text class="cr-red" data-value="/pages/login/login?opt_type=bind_email&opt_form=bind_email" @tap="url_event">{{$t('common.bind_email')}}</text>{{$t('cash-auth.or')}}<text class="cr-red" data-value="/pages/login/login?opt_form=bind_verify" @tap="url_event">{{$t('common.bind_phone')}}</text>{{$t('cash-auth.one_way_obtain_security_verification_code')}}</view>
                        <view>{{$t('cash-auth.bound_phone_email_expired_bind_phone')}}</view>
                        <view>{{$t('cash-auth.bound_email_expired_bind_email_complete')}}</view>
                        <view>{{$t('cash-auth.input_verification_code_correctly_below_cannot')}}</view>
                        <view>{{$t('cash-auth.after_receiving_security_verification_code_compl')}}</view>
                        <view>{{$t('cash-auth.after_successful_security_verification_complete_')}}</view>
                    </view>
                </view>

                <view v-if="check_account_list.length == 0" class="margin-top-xxxl">
                    <button data-value="/pages/login/login?opt_type=bind_email&opt_form=bind_email" @tap="url_event" class="bg-main-pair br-main-pair cr-white text-size round" type="default">{{$t('login.bind_email_address')}}</button>
                    <button data-value="/pages/login/login?opt_form=bind_verify" @tap="url_event" class="bg-main br-main cr-white text-size round margin-top-xl" type="default">{{$t('login.bind_mobile_phone_number')}}</button>
                </view>
            </view>
            <view v-else-if="cash_apply_available != null">
                <component-cash-unavailable :propCashApplyAvailable="cash_apply_available"></component-cash-unavailable>
            </view>
            <view v-else class="padding-top-xxxl">
                <component-no-data propStatus="0" :propMsg="$t('common.no_relevant_data_tips')"></component-no-data>
            </view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentCashUnavailable from '@/pages/plugins/wallet/components/cash-unavailable/cash-unavailable';
    import { BuildCashApplyAvailable, IsCashApplyAvailable } from '@/pages/plugins/wallet/common/cash-apply-available';
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                user_wallet: null,
                check_account_list: [],
                verify_submit_text: this.$t('common.obtain_verification_code'),
                verify_loading: false,
                verify_disabled: false,
                form_submit_loading: false,
                verify_time_total: 60,
                temp_clear_time: null,
                check_account_value: null,
                form_submit_disabled_status: false,
                cash_apply_available: null,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentCashUnavailable,
        },

        computed: {
            is_cash_available() {
                return IsCashApplyAvailable(this.cash_apply_available);
            },
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                    });
                }
            },

            // 获取数据
            get_data() {
                this.setData({
                    data_list_loding_status: 1,
                });

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('auth', 'cash', 'wallet'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        this.setData({
                            data_list_loding_status: 0,
                        });
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var upd_data = {
                                data_base: data.base || null,
                                user_wallet: data.user_wallet || null,
                                check_account_list: data.check_account_list || [],
                                cash_apply_available: data.cash_apply_available || BuildCashApplyAvailable(data.user_wallet, data.base, app.globalData.currency_symbol()),
                            };
                            this.setData(upd_data);
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 身份认证方式事件
            select_check_account_event(e) {
                this.setData({
                    check_account_value: e.detail.value || 0,
                });
            },

            // 发送验证码
            verify_send_event() {
                // 数据验证
                var self = this;
                if (self.check_account_value == null) {
                    app.globalData.showToast(this.$t('cash-auth.choose_authentication_method'));
                    return false;
                }

                uni.showLoading({
                    title: this.$t('common.sending_in_text'),
                });
                this.setData({
                    verify_submit_text: this.$t('common.sending'),
                    verify_loading: true,
                    verify_disabled: true,
                });
                uni.request({
                    url: app.globalData.get_request_url('verifysend', 'cash', 'wallet'),
                    method: 'POST',
                    data: {
                        account_type: self.check_account_list[self.check_account_value]['field'],
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                verify_loading: false,
                            });
                            var temp_time = this.verify_time_total;
                            this.temp_clear_time = setInterval(function () {
                                if (temp_time <= 1) {
                                    clearInterval(self.temp_clear_time);
                                    self.setData({
                                        verify_submit_text: self.$t('common.obtain_verification_code'),
                                        verify_disabled: false,
                                    });
                                } else {
                                    temp_time--;
                                    self.setData({
                                        verify_submit_text: self.$t('common.remain') + temp_time + self.$t('common.second'),
                                    });
                                }
                            }, 1000);
                        } else {
                            this.setData({
                                verify_submit_text: this.$t('common.obtain_verification_code'),
                                verify_loading: false,
                                verify_disabled: false,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            verify_submit_text: this.$t('common.obtain_verification_code'),
                            verify_loading: false,
                            verify_disabled: false,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;

                // 数据校验
                var validation = [
                    { fields: 'account_type', msg: this.$t('cash-auth.choose_authentication_method'), is_can_zero: 1 },
                    { fields: 'verify', msg: this.$t('common.please_input_verify_code') },
                ];

                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    form_data['account_type'] = this.check_account_list[this.check_account_value]['field'];
                    this.setData({
                        form_submit_disabled_status: true,
                    });
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('verifycheck', 'cash', 'wallet'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            if (res.data.code == 0) {
                                app.globalData.url_open('/pages/plugins/wallet/cash-create/cash-create', true);
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import './cash-auth.css';
</style>
