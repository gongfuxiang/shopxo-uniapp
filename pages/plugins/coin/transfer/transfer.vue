<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status == 3" class="transfer">
            <view class="padding-main">
                <view class="bg-white padding-main radius-md margin-bottom-main">
                    <view class="padding-vertical-sm border-radius-sm flex-row align-c">
                        <view class="flex-row">
                            <image v-if="accounts.platform_icon" :src="accounts.platform_icon" mode="widthFix" class="coin-content-list-img round" />
                            <view class="padding-left-main">
                                <view class="coin-dropdown text-size-md pr margin-bottom-xs flex-row">
                                    <text class="cr-666">{{ accounts.platform_name }}</text>
                                </view>
                                <view class="fw-b text-size">{{ accounts.platform_symbol }} {{ accounts.normal_coin }}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bg-white padding-main radius-md margin-bottom-main">
                    <view class="padding-vertical-sm flex-row align-c">
                        <iconfont name="icon-scan" size="40rpx" @tap="scancode_event"></iconfont>
                        <view class="padding-left-lg flex-row jc-sb align-c flex-1 flex-width">
                            <view class="flex-1 padding-right-main">
                                <input type="text" name="receive_accounts_key" :value="receive_accounts_key" placeholder-class="text-size-md cr-grey-9" :placeholder="$t('transfer.transfer.1aijp1')" @input="receive_accounts_key_change" />
                            </view>
                            <button type="default" class="accounts-btn text-size-xs cr-white round" @tap="receive_accounts_key_event">{{$t('common.confirm')}}</button>
                        </view>
                    </view>
                </view>
                <view class="bg-white padding-main radius-md margin-bottom-main">
                    <view class="padding-vertical-sm">
                        <text class="text-size fw-b">{{$t('transfer.transfer.b4m5p3')}}</text>
                        <view class="margin-top-xxxxl">
                            <input type="digit" name="coin" :value="coin" class="text-size-xl tc" placeholder-class="cr-grey-9" :placeholder="$t('transfer.transfer.d15853')" @input="coin_change" />
                            <view class="cr-grey-9 tc margin-top-main">{{$t('transfer.transfer.9xe2bl')}}<text class="cr-black fw-b">{{ accounts.platform_symbol }} {{ accounts.default_coin }}</text>
                            </view>
                        </view>
                        <view class="note padding-main radius margin-top-xxxl">
                            <input type="text" name="note" :value="note" placeholder-class="text-size-md cr-grey-9" :placeholder="$t('transfer.transfer.2bwh7h')" @input="note_change" />
                        </view>
                    </view>
                </view>
                <!-- <view class="padding-main bg-white radius-md">
                    <view class="padding-vertical-sm border-radius-sm flex-row align-c">
                        <text class="text-size fw-b">转账密码</text>
                        <view class="padding-left-lg">
                            <input type="password" name="pay_pwd" :value="pay_pwd" placeholder-class="text-size-md cr-grey-9" placeholder="请输入支付密码" @input="pwd_num_change" />
                        </view>
                    </view>
                </view> -->
                <view class="padding-xxxl margin-top-sm">
                    <button type="default" class="transfer-btn cr-white round" @tap="transfer_event">{{$t('transfer.transfer.3i4h4z')}}</button>
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
    var accounts_static_url = app.globalData.get_static_url('coin', true) + 'app/';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                accounts_static_url: accounts_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',

                accounts_id: null,
                receive_accounts_key: null,
                receive_accounts_id: null,
                accounts: {},
                receive_accounts: {},
                coin: null,
                note: '',
                // pay_pwd: '',
            };
        },
        components: {
            componentCommon,
            componentNoData
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 设置参数
            this.setData({
                accounts_id: params.id,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();

            // 初始数据
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },
            // 初始化数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('createinfo', 'transfer', 'coin'),
                    method: 'POST',
                    data: { accounts_id: this.accounts_id, accounts_key: this.receive_accounts_key },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                accounts: data.accounts || {},
                                receive_accounts: data.receive_accounts || {},
                                receive_accounts_id: data.receive_accounts ? data.receive_accounts.id : null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            scancode_event() {
                // 调用扫码
                var self = this;
                uni.scanCode({
                    success: function (res) {
                        self.setData({
                            receive_accounts_key: res.result,
                        });
                    },
                });
            },
            // 收款账号
            receive_accounts_key_change(e) {
                this.setData({
                    receive_accounts_key: e.detail.value,
                });
            },
            // 确认收款账号
            receive_accounts_key_event() {
                this.get_data();
            },
            // 转账币
            coin_change(e) {
                this.setData({
                    coin: e.detail.value,
                });
            },
            // 备注
            note_change(e) {
                this.setData({
                    note: e.detail.value,
                });
            },
            // 转账密码
            pwd_num_change(e) {
                this.setData({
                    pwd_num: e.detail.value,
                });
            },
            // 立即转账
            transfer_event(e) {
                var new_data = {
                    receive_accounts_id: this.receive_accounts_id,
                    coin: this.coin,
                    note: this.note,
                    // pwd_num: this.pwd_num,
                };
                // 数据校验
                var validation = [
                    { fields: 'receive_accounts_key', msg: this.$t('transfer.transfer.1aijp1') },
                    { fields: 'coin', msg: this.$t('transfer.transfer.d15853') },
                ];
                // 验证提交表单
                if (app.globalData.fields_check(new_data, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('create', 'transfer', 'coin'),
                        method: 'POST',
                        data: new_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.url_open('/pages/plugins/coin/transfer-list/transfer-list', true);
                                }, 1000);
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.stopPullDownRefresh();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },
        },
    };
</script>
<style>
    @import './transfer.css';
</style>
