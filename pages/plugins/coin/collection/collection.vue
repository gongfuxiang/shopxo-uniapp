<template>
    <view :class="theme_view">
        <view class="collection">
            <view class="padding-main pr">
                <view class="padding-lg bg-white radius-md margin-bottom-main tc">
                    <view class="flex-row jc-c qrcode">
                        <w-qrcode :options="qrcode"></w-qrcode>
                    </view>
                    <view class="code br-c radius flex-row">
                        <view class="num flex-1 flex-width flex-row align-c text-size-md">{{ accounts_key }}</view>
                        <view class="copy br-l-c text-size fw-b" :data-value="accounts_key" @tap.stop="text_copy_event">复制</view>
                    </view>
                </view>
                <view class="cr-grey-9 margin-top-xxl flex-row">
                    <view class="pr">
                        <iconfont name="icon-sigh-o" size="32rpx"></iconfont>
                    </view>
                    <text class="margin-left-sm text-size-xs">说出来的是你想的，做出来的是你说的，交出来的是你做的</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    var wallet_static_url = app.globalData.get_static_url('coin', true) + 'app/';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                qrcode: {
                    code: '',
                    size: 280,
                },
                accounts_key: '',
            };
        },

        components: {
            componentNoData,
        },
        props: {},

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 设置参数
            this.setData({
                params: params,
            });
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();
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

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'accounts', 'coin'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        console.log(res.data.data);
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                accounts_key: data.accounts.accounts_key || '',
                            });
                            var qrcode = this.qrcode;
                            qrcode['code'] = data.accounts.accounts_key;
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 复制文本
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },
        },
    };
</script>
<style>
    @import './collection.css';
</style>
