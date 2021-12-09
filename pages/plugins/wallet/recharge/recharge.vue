<template>
    <view>
        <view class="form-container padding-main">
            <view class="form-gorup padding-vertical-main">
                <input type="digit" name="money" :value="recharge_money_value || ''" placeholder-class="cr-grey" class="cr-base text-size-xxl" placeholder="请输入充值金额" @input="recharge_money_value_input_event" maxlength="6">
            </view>
            <view class="form-gorup form-gorup-submit">
                <button class="round cr-white bg-main br-main text-size" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_event">提交</button>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();

    export default {
        data() {
            return {
                params: null,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                recharge_money_value: '',
                form_submit_disabled_status: false
            };
        },

        components: {},
        props: {},

        onLoad(params) {
            this.setData({
                params: params,
                recharge_money_value: params.money || ''
            });
        },

        onShow() {
            this.init();

            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '请先绑定手机号码'
                        });
                        return false;
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '请先授权用户信息'
                    });
                }
            },

            // 充值金额输入事件
            recharge_money_value_input_event(e) {
                this.setData({
                    recharge_money_value: e.detail.value || ''
                });
            },

            // 数据提交
            form_submit_event(e) {
                // 参数
                if ((this.recharge_money_value || null) == null) {
                    app.globalData.showToast('请输入充值金额');
                    return false;
                }

                this.setData({
                    form_submit_disabled_status: true
                });
                uni.showLoading({
                    title: "处理中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("create", "recharge", "wallet"),
                    method: "POST",
                    data: {
                        money: this.recharge_money_value
                    },
                    dataType: "json",
                    success: res => {
                        this.setData({
                            form_submit_disabled_status: false
                        });
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            uni.setStorageSync(app.globalData.data.cache_page_pay_key, res.data.data.recharge_id);
                            uni.redirectTo({
                                url: '/pages/plugins/wallet/user-recharge/user-recharge'
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
                            form_submit_disabled_status: false
                        });
                        uni.hideLoading();
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './recharge.css';
</style>