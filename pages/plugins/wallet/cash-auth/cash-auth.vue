<template>
    <view :class="theme_view">
        <view v-if="data_base != null" class="padding-main">
            <view v-if="is_can_cash == 1">
                <form v-if="check_account_list.length > 0" @submit="form_submit" class="form-container oh">
                    <view class="bg-white border-radius-main">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('cash-auth.cash-auth.b39a25')}}<text class="form-group-tips-must">*</text></view>
                            <view class="section">
                                <picker name="account_type" @change="select_check_account_event" :value="check_account_value" :range="check_account_list" range-key="msg">
                                    <view :class="'picker name ' + (check_account_value == null ? 'cr-grey' : 'cr-base')">
                                        <view v-if="check_account_value == null">{{$t('cash-auth.cash-auth.582q6x')}}</view>
                                        <view v-else>{{ check_account_list[check_account_value]['msg'] }}</view>
                                    </view>
                                </picker>
                            </view>
                        </view>

                        <view class="form-gorup pr">
                            <view class="form-gorup-title">{{$t('cash-auth.cash-auth.d318op')}}<text class="form-group-tips-must">*</text></view>
                            <input type="number" name="verify" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('cash-auth.cash-auth.2hc312')" maxlength="4" />
                            <button :class="'bg-grey br-grey cr-base pa round text-size-sm verify-sub ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">
                                {{ verify_submit_text }}
                            </button>
                        </view>
                    </view>

                    <view class="form-gorup form-gorup-submit margin-top-main">
                        <button class="bg-main cr-white br-main round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('common.submit')}}</button>
                    </view>
                </form>

                <view class="margin-top-lg cr-base">
                    <view class="fw-b text-size">{{$t('cash-auth.cash-auth.0j8388')}}</view>
                    <view class="text-size-xs">
                        <view>{{$t('cash-auth.cash-auth.59iipw')}}<text class="cr-red" data-value="/pages/login/login?opt_type=bind_email&opt_form=bind_email" @tap="url_event">{{$t('login.login.tgsa4d')}}</text>{{$t('cash-auth.cash-auth.t8y3r7')}}<text class="cr-red" data-value="/pages/login/login?opt_form=bind_verify" @tap="url_event">{{$t('login.login.np9177')}}</text>{{$t('cash-auth.cash-auth.5wbuuy')}}</view>
                        <view>{{$t('cash-auth.cash-auth.r569wz')}}</view>
                        <view>{{$t('cash-auth.cash-auth.35837l')}}</view>
                        <view>{{$t('cash-auth.cash-auth.q2a553')}}</view>
                        <view>{{$t('cash-auth.cash-auth.lh6bjr')}}</view>
                        <view>{{$t('cash-auth.cash-auth.ob4gn0')}}</view>
                    </view>
                </view>

                <view v-if="check_account_list.length == 0" class="margin-top-xxxl">
                    <button data-value="/pages/login/login?opt_type=bind_email&opt_form=bind_email" @tap="url_event" class="bg-main-pair br-main-pair cr-white text-size round" type="default">{{$t('login.login.8ytyuf')}}</button>
                    <button data-value="/pages/login/login?opt_form=bind_verify" @tap="url_event" class="bg-main br-main cr-white text-size round margin-top-xl" type="default">{{$t('login.login.d2ng16')}}</button>
                </view>
            </view>
            <view v-else>
                <view class="margin-top-lg">
                    <view>
                        <text>{{$t('cash-auth.cash-auth.l2i4s8')}}</text>
                        <text class="cr-green fw-b margin-left-sm margin-right-sm">{{ user_wallet.normal_money }}</text>
                    </view>
                    <view class="margin-top-sm">
                        <text>{{$t('cash-auth.cash-auth.27b4w5')}}</text>
                        <text class="cr-red fw-b margin-left-sm margin-right-sm">{{ data_base.cash_minimum_amount }}</text>
                    </view>
                </view>
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

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                user_wallet: null,
                check_account_list: [],
                verify_submit_text: this.$t('login.login.s665h5'),
                verify_loading: false,
                verify_disabled: false,
                form_submit_loading: false,
                verify_time_total: 60,
                temp_clear_time: null,
                check_account_value: null,
                form_submit_disabled_status: false,
                is_can_cash: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
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
                            };
                            if ((upd_data.data_base != null && upd_data.user_wallet != null && (upd_data.data_base.cash_minimum_amount || 0) <= 0) || parseFloat(upd_data.user_wallet.normal_money) >= parseFloat(upd_data.data_base.cash_minimum_amount)) {
                                upd_data['is_can_cash'] = 1;
                            }
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
                    app.globalData.showToast(this.$t('cash-auth.cash-auth.5dcsbd'));
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
                                        verify_submit_text: self.$t('login.login.s665h5'),
                                        verify_disabled: false,
                                    });
                                } else {
                                    temp_time--;
                                    self.setData({
                                        verify_submit_text: self.$t('login.login.n24i5u') + temp_time + self.$t('login.login.4306xr'),
                                    });
                                }
                            }, 1000);
                        } else {
                            this.setData({
                                verify_submit_text: this.$t('login.login.s665h5'),
                                verify_loading: false,
                                verify_disabled: false,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            verify_submit_text: this.$t('login.login.s665h5'),
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
                    { fields: 'account_type', msg: this.$t('cash-auth.cash-auth.5dcsbd'), is_can_zero: 1 },
                    { fields: 'verify', msg: this.$t('login.login.cesl5d') },
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
