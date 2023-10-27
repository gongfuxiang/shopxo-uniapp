<!-- 转账支付页 -->
<template>
    <view class="padding-main">
        <block v-if="(data || null) != null">
            <form @submit="form_submit" class="form-container">
                <view class="border-radius-main bg-white padding-vertical-main padding-left-main flex-row" :class="is_error_msg ? '' : 'spacing-mb'">
                    <view class="title fw-b text-size margin-right-main">收款账号</view>
                    <view class="flex-1 flex-width padding-right-main">
                        <view class="flex-row jc-sb align-c">
                            <input name="keywords" :value="inputClearValue" class="text-size-md pr top-sm flex-1 flex-width" placeholder="请输入用户ID/会员码/用户名/手机/邮箱" placeholder-class="cr-grey-c" @input="input_account_event" />
                            <text class="cr-main pr top-xs margin-left-sm" @tap="search_account_event">确认</text>
                        </view>
                        <view v-if="(receive_user || null) != null && inputClearValue" class="br-t-e padding-top-main margin-top-main flex-row align-c">
                            <image :src="receive_user.avatar" mode="widthFix" class="img margin-right-xs circle" />
                            <text class="text-size-xs">{{ receive_user.username }}</text>
                        </view>
                    </view>
                </view>
                <view v-if="is_error_msg" class="error-msg text-size-xs padding-vertical-xs">{{ error_msg }}</view>
                <view class="border-radius-main bg-white padding-main spacing-mb">
                    <view class="title fw-b text-size margin-bottom-xxxl padding-bottom-xl">转账金额</view>
                    <input name="money" type="number" class="text-size-xl tc cr-red" placeholder="请输入转账金额" placeholder-class="cr-grey-c" />
                    <view class="tc spacing-mt-10 margin-bottom-xxxl padding-bottom-main">
                        <text class="cr-grey-9">我的余额：</text>
                        <text class="fw-b">{{ data.normal_money }}元</text>
                    </view>
                    <input name="note" class="text-size-md bg-grey-f9 padding-main border-radius-sm" placeholder="请输入转账备注信息" placeholder-class="cr-grey-c" />
                </view>
                <view class="padding-main">
                    <button type="default" form-type="submit" hover-class="none" size="mini" class="br-main bg-main cr-white round buy-submit text-size dis-block">确认</button>
                </view>
            </form>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                data: null,
                receive_user: null,
                is_error_msg: false,
                error_msg: '',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                inputClearValue: '',
            };
        },
        components: {
            componentNoData,
        },
        onLoad(params) {
            this.init();
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
                        this.setData({
                            is_user_login: true,
                        });
                        this.get_data();
                    }
                }
            },
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'user', 'wallet'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data: data.user_wallet || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
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
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },
            input_account_event(e) {
                console.log(e);
                this.setData({
                    inputClearValue: e.detail.value,
                });
            },
            search_account_event() {
                console.log(this.inputClearValue);
                if (this.is_user_login) {
                    uni.request({
                        url: app.globalData.get_request_url('userquery', 'transfer', 'wallet'),
                        method: 'POST',
                        data: {
                            keywords: this.inputClearValue,
                        },
                        dataType: 'json',
                        success: (res) => {
                            console.log(res.data.data);
                            if (res.data.code == 0) {
                                this.setData({
                                    receive_user: res.data.data || null,
                                    is_error_msg: false,
                                });
                            } else {
                                this.setData({
                                    receive_user: null,
                                    is_error_msg: true,
                                    error_msg: res.data.msg,
                                });
                            }
                        },
                        fail: () => {
                            this.setData({
                                receive_user: null,
                                is_error_msg: true,
                                error_msg: '服务器请求出错',
                            });
                            app.globalData.showToast('服务器请求出错');
                        },
                    });
                }
            },
            form_submit(e) {
                if (this.is_user_login) {
                    var new_data = {
                        ...e.detail.value,
                        receive_user_id: (this.receive_user || null) === null ? '' : this.receive_user.id,
                    };
                    var validation = [
                        { fields: 'keywords', msg: '请输入收款账号' },
                        { fields: 'receive_user_id', msg: '请输入正确的收款账号' },
                        { fields: 'money', msg: '请输入转账金额' },
                    ];
                    if (app.globalData.fields_check(new_data, validation)) {
                        uni.showLoading({
                            title: '处理中...',
                        });
                        uni.request({
                            url: app.globalData.get_request_url('save', 'transfer', 'wallet'),
                            method: 'POST',
                            data: new_data,
                            dataType: 'json',
                            success: (res) => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    console.log(res.data.data);
                                    uni.redirectTo({
                                        url: '/pages/plugins/wallet/user/user?type=3',
                                    });
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, 'form_submit')) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast('服务器请求出错');
                            },
                        });
                    }
                }
            },
        },
    };
</script>
<style scoped>
    @import './transfer.css';
</style>
