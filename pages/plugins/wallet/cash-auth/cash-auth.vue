<template>
    <view>
        <view v-if="data_base != null" class="padding-main">
            <view v-if="is_can_cash == 1">
                <form v-if="check_account_list.length > 0" @submit="form_submit" class="form-container oh">
                    <view class="form-gorup">
                        <view class="form-gorup-title">选择身份认证方式<text class="form-group-tips-must">必选</text></view>
                        <view class="section">
                            <picker name="account_type" @change="select_check_account_event" :value="check_account_value" :range="check_account_list" range-key="msg">
                                <view :class="'picker name ' + (check_account_value == null ? 'cr-grey' : 'cr-base')">
                                    <view v-if="check_account_value == null">请选择认证账号</view>
                                    <view v-else>{{ check_account_list[check_account_value]['msg'] }}</view>
                                </view>
                            </picker>
                        </view>
                    </view>

                    <view class="form-gorup pr">
                        <view class="form-gorup-title">请输入安全验证码<text class="form-group-tips-must">*</text></view>
                        <input type="number" name="verify" placeholder-class="cr-grey" class="cr-base" placeholder="验证码格式 4 位数字" maxlength="4" />
                        <button :class="'bg-grey br-grey cr-base pa round text-size-sm verify-sub ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">
                            {{ verify_submit_text }}
                        </button>
                    </view>

                    <view class="form-gorup form-gorup-submit">
                        <button class="bg-main cr-white br-main round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">提交</button>
                    </view>
                </form>

                <view class="notice-content-blue">
                    <view>操作提示</view>
                    <view>1. 请选择 "<text class="cr-red">绑定邮箱</text>" 或 "<text class="cr-red">绑定手机</text>" 方式其一作为安全校验码的获取方式并正确输入。</view>
                    <view>2. 如果您未绑定手机或者邮箱已失效，可以绑定手机后通过接收手机短信完成验证。</view>
                    <view>3. 如果您未绑定邮箱或者已失效，可以绑定邮箱后通过接收邮件完成验证。</view>
                    <view>4. 请正确输入下方图形验证码，如看不清可点击图片进行更换，输入完成后进行下一步操作。</view>
                    <view>5. 收到安全验证码后，请在10分钟内完成验证。</view>
                    <view>6. 安全验证成功后，请在30分钟内完成提现申请。</view>
                </view>

                <view v-if="check_account_list.length == 0" class="margin-top-xxxl">
                    <navigator url="/pages/login/login?opt_form=bind_verify" hover-class="none">
                        <button class="bg-main br-main cr-white text-size round" type="default">绑定手机号码</button>
                    </navigator>
                </view>
            </view>
            <view v-else>
                <view class="notice-content-blue">
                    <view
                        >当前有效金额<text class="cr-green fw-b margin-left-sm margin-right-sm">{{ user_wallet.normal_money }}</text
                        >元</view
                    >
                    <view class="margin-top-sm"
                        >提现最低金额<text class="cr-red fw-b margin-left-sm margin-right-sm">{{ data_base.cash_minimum_amount }}</text
                        >元起</view
                    >
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';

    export default {
        data() {
            return {
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                user_wallet: null,
                check_account_list: [],
                verify_submit_text: '获取验证码',
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
            componentNoData,
        },
        props: {},

        onLoad(params) {},

        onShow() {
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                    });
                }
            },

            // 获取数据
            get_data() {
                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });
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
                        uni.hideLoading();
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
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast('服务器请求出错');
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
                    app.globalData.showToast('请选择认证方式');
                    return false;
                }

                uni.showLoading({
                    title: '发送中...',
                });
                this.setData({
                    verify_submit_text: '发送中',
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
                                        verify_submit_text: '获取验证码',
                                        verify_disabled: false,
                                    });
                                } else {
                                    temp_time--;
                                    self.setData({
                                        verify_submit_text: '剩余 ' + temp_time + ' 秒',
                                    });
                                }
                            }, 1000);
                        } else {
                            this.setData({
                                verify_submit_text: '获取验证码',
                                verify_loading: false,
                                verify_disabled: false,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            verify_submit_text: '获取验证码',
                            verify_loading: false,
                            verify_disabled: false,
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;

                // 数据校验
                var validation = [
                    { fields: 'account_type', msg: '请选择认证方式', is_can_zero: 1 },
                    { fields: 'verify', msg: '请输入验证码' },
                ];

                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    form_data['account_type'] = this.check_account_list[this.check_account_value]['field'];
                    this.setData({
                        form_submit_disabled_status: true,
                    });
                    uni.showLoading({
                        title: '处理中...',
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
                                uni.redirectTo({
                                    url: '/pages/plugins/wallet/user/user?status=2',
                                });
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast('提交失败，请重试！');
                                }
                            }
                        },
                        fail: () => {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            uni.hideLoading();
                            app.globalData.showToast('服务器请求出错');
                        },
                    });
                }
            },
        },
    };
</script>
<style>
    @import './cash-auth.css';
</style>
