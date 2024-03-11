<!-- 转账支付页 -->
<template>
    <view :class="theme_view">
        <view class="padding-main">
            <block v-if="(data || null) != null">
                <form @submit="form_submit" class="form-container">
                    <view class="border-radius-main bg-white padding-vertical-main padding-left-main flex-row" :class="is_error_msg ? '' : 'spacing-mb'">
                        <view class="title fw-b text-size margin-right-main">{{$t('cash-create.cash-create.36756z')}}</view>
                        <view class="flex-1 flex-width padding-right-main">
                            <view class="flex-row jc-sb align-c">
                                <input name="keywords" :value="inputClearValue" class="text-size-md pr top-sm flex-1 flex-width" :placeholder="$t('transfer.transfer.t53ary')" placeholder-class="cr-grey-c" @input="input_account_event" />
                                <text class="cr-main pr top-xs margin-left-sm" @tap="search_account_event">{{$t('common.confirm')}}</text>
                            </view>
                            <view v-if="(receive_user || null) != null && inputClearValue" class="br-t-e padding-top-main margin-top-main flex-row align-c">
                                <image :src="receive_user.avatar" mode="widthFix" class="img margin-right-xs circle" />
                                <text class="text-size-xs">{{ receive_user.username }}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if="is_error_msg" class="error-msg text-size-xs padding-vertical-xs">{{ error_msg }}</view>
                    <view class="border-radius-main bg-white padding-main spacing-mb">
                        <view class="title fw-b text-size margin-bottom-xxxl padding-bottom-xl">{{$t('transfer.transfer.2q274j')}}</view>
                        <input name="money" type="number" class="text-size-xl tc cr-red" :placeholder="$t('transfer.transfer.g22y5v')" placeholder-class="cr-grey-c" />
                        <view class="tc spacing-mt-10 margin-bottom-xxxl padding-bottom-main">
                            <text class="cr-grey-9">{{$t('transfer.transfer.9xe2bl')}}</text>
                            <text class="fw-b">{{ data.normal_money }}</text>
                        </view>
                        <input name="note" class="text-size-md bg-grey-f9 padding-main border-radius-sm" :placeholder="$t('transfer.transfer.2bwh7h')" placeholder-class="cr-grey-c" />
                    </view>
                    <view class="padding-main">
                        <button type="default" form-type="submit" hover-class="none" size="mini" class="br-main bg-main cr-white round buy-submit text-size dis-block">{{$t('common.confirm')}}</button>
                    </view>
                </form>
            </block>
            <block v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </block>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 加载数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 账户输入事件
            input_account_event(e) {
                this.setData({
                    inputClearValue: e.detail.value,
                });
            },
            // 用户查询
            search_account_event() {
                if (this.is_user_login) {
                    uni.request({
                        url: app.globalData.get_request_url('userquery', 'transfer', 'wallet'),
                        method: 'POST',
                        data: {
                            keywords: this.inputClearValue,
                        },
                        dataType: 'json',
                        success: (res) => {
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
                                error_msg: this.$t('common.internet_error_tips'),
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },
            // 转账表单提交
            form_submit(e) {
                if (this.is_user_login) {
                    var new_data = {
                        ...e.detail.value,
                        receive_user_id: (this.receive_user || null) === null ? '' : this.receive_user.id,
                    };
                    var validation = [
                        { fields: 'keywords', msg: this.$t('transfer.transfer.1aijp1') },
                        { fields: 'receive_user_id', msg: this.$t('transfer.transfer.x4mzo9') },
                        { fields: 'money', msg: this.$t('transfer.transfer.g22y5v') },
                    ];
                    if (app.globalData.fields_check(new_data, validation)) {
                        uni.showLoading({
                            title: this.$t('common.processing_in_text'),
                        });
                        uni.request({
                            url: app.globalData.get_request_url('save', 'transfer', 'wallet'),
                            method: 'POST',
                            data: new_data,
                            dataType: 'json',
                            success: (res) => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
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
                                app.globalData.showToast(this.$t('common.internet_error_tips'));
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
