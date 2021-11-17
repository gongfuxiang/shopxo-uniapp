<template>
    <view class="page">
        <form v-if="check_status == 1" @submit="form_submit" class="form-container">
            <view class="padding-main oh">
                <view class="form-gorup">
                    <view class="form-gorup-title">提现金额<text class="form-group-tips-must">必填</text></view>
                    <input type="digit" name="money" :value="default_data.money || ''" placeholder-class="cr-grey" class="cr-base" :placeholder="'提现金额，最低' + ((data_base.cash_minimum_amount || 0) <= 0 ? 0.01 : data_base.cash_minimum_amount) + '元，最高' + can_cash_max_money + '元'">
                    <view class="notice-content-blue">
                        <view v-if="(data_base || null) == null || data_base.is_cash_retain_give != 0" class="cr-red margin-bottom-sm">赠送金额不可提现</view>
                        <view v-if="(data_base || null) != null && data_base.cash_minimum_amount > 0">提现最低金额<text class="cr-red fw-b margin-left-sm margin-right-sm">{{data_base.cash_minimum_amount}}</text>元起</view>
                        <view>可提现金额<text class="cr-main fw-b margin-left-sm margin-right-sm">{{can_cash_max_money}}</text>元</view>
                        <view>可用金额<text class="cr-green fw-b margin-left-sm margin-right-sm">{{user_wallet.normal_money}}</text>元</view>
                        <view>赠送总额<text class="cr-base fw-b margin-left-sm margin-right-sm">{{user_wallet.give_money}}</text>元</view>
                    </view>
                </view>

                <view class="form-gorup">
                    <view class="form-gorup-title">收款平台<text class="form-group-tips-must">必填</text></view>
                    <input type="text" name="bank_name" :value="default_data.bank_name || ''" placeholder-class="cr-grey" class="cr-base" maxlength="60" placeholder="收款平台格式 1~60 个字符之间">
                    <view class="notice-content-blue">
                        强烈建议优先填写国有4大银行(中国银行、中国建设银行、中国工商银行和中国农业银行) 请填写详细的开户银行分行名称，虚拟账户如支付宝、财付通、微信 直接填写 相应的名称 即可。
                    </view>
                </view>

                <view class="form-gorup">
                    <view class="form-gorup-title">收款账号<text class="form-group-tips-must">必填</text></view>
                    <input type="text" name="bank_accounts" :value="default_data.bank_accounts || ''" placeholder-class="cr-grey" class="cr-base" maxlength="60" placeholder="收款账号格式 1~60 个字符之间">
                    <view class="notice-content-blue">
                        银行账号或虚拟账号(支付宝、财付通、微信等账号)
                    </view>
                </view>

                <view class="form-gorup">
                    <view class="form-gorup-title">开户人姓名<text class="form-group-tips-must">必填</text></view>
                    <input type="text" name="bank_username" :value="default_data.bank_username || ''"
                        placeholder-class="cr-grey" class="cr-base" maxlength="30" placeholder="开户人姓名格式 1~30 个字符之间">
                    <view class="notice-content-blue">
                        收款账号的开户人真实姓名
                    </view>
                </view>

                <view class="submit-fixed padding-main">
                    <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">提交</button>
                </view>
            </view>
        </form>

        <!-- 已过期 -->
        <view v-else-if="check_status === 0" class="overdue tc">
            <view class="padding-main">
                <view class="cr-red margin-top-xxxl">安全验证已超时，请重新验证再操作</view>
                <navigator class="dis-inline" hover-class="none" open-type="navigateBack">
                    <button class="round bg-main cr-white cr-white text-size margin-top-xl" size="mini" type="default" hover-class="none">返回重新申请提现</button>
                </navigator>
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
    import componentNoData from "../../../../components/no-data/no-data";

    export default {
        data() {
            return {
                params: null,
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                default_data: null,
                data_base: null,
                user_wallet: null,
                check_status: null,
                can_cash_max_money: 0.00
            };
        },

        components: {
            componentNoData
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
        },

        onShow() {
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
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
                    } else {
                        this.get_data();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '请先授权用户信息'
                    });
                }
            },

            // 获取数据
            get_data() {
                this.setData({
                    data_list_loding_status: 1
                });
                uni.showLoading({
                    title: "加载中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("createinit", "cash", "wallet"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || null;
                            this.setData({
                                data_list_loding_status: 3,
                                data_base: data.base || null,
                                check_status: data.check_status || 0,
                                default_data: data.default_data || null,
                                user_wallet: data.user_wallet || null,
                                can_cash_max_money: parseFloat(data.can_cash_max_money) || 0.00
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;
                
                // 数据校验
                var validation = [
                    { fields: "money", msg: "请填写提现金额" },
                    { fields: "bank_name", msg: "请填写收款平台" },
                    { fields: "bank_accounts", msg: "请填写收款账号" },
                    { fields: "bank_username", msg: "请填写开户人姓名" }
                ];
                
                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    // 提现金额不能小于最低金额、不能大于最大可提现金额
                    if(parseFloat(this.data_base.cash_minimum_amount || 0) > 0 && parseFloat(form_data.money) < parseFloat(this.data_base.cash_minimum_amount)) {
                        app.globalData.showToast('提现不能低于'+this.data_base.cash_minimum_amount+'元');
                        return false;
                    }
                    if(parseFloat(form_data.money) > this.can_cash_max_money) {
                        app.globalData.showToast('提现不能大于'+this.can_cash_max_money+'元');
                        return false;
                    }
                    
                    // 远程请求
                    this.setData({
                        form_submit_loading: true
                    });
                    uni.showLoading({
                        title: "处理中..."
                    });
                    uni.request({
                        url: app.globalData.get_request_url("create", "cash", "wallet"),
                        method: "POST",
                        data: form_data,
                        dataType: "json",
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, "success");
                                setTimeout(function() {
                                    uni.redirectTo({
                                        url: '/pages/plugins/wallet/user-cash/user-cash'
                                    });
                                }, 1000);
                            } else {
                                this.setData({
                                    form_submit_loading: false
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast('提交失败，请重试！');
                                }
                            }
                        },
                        fail: () => {
                            this.setData({
                                form_submit_loading: false
                            });
                            uni.hideLoading();
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            }
        }
    };
</script>
<style>
    @import './cash-create';
</style>