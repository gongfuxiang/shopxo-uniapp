<template>
    <view :class="theme_view">
        <view class="agreement-page bs-bb pr">
            <view class="agreement-content border-radius-main bg-white" v-if="is_show_privacy">
                <view class="tc">
                    <image class="logo circle auto dis-block margin-bottom-lg br" :src="logo" mode="widthFix"></image>
                    <view class="cr-base fw-b text-size-lg">{{ title }}{{$t('common.warm_tips')}}</view>
                </view>
                <view class="margin-top-lg text-size-sm cr-base content-desc">
                    <block v-if="(content || null) == null">{{$t('agreement.agreement.w38e3v')}}{{ title }}{{$t('agreement.agreement.hjn568')}}</block>
                    <block v-else>{{ content }}</block>
                </view>
                <view class="cr-blue margin-top-lg">
                    <view>
                        <text @tap="agreement_event" data-value="userregister">《{{ title }}{{$t('agreement.agreement.iy7863')}}</text>
                    </view>
                    <view class="margin-top-sm">
                        <text @tap="agreement_event" data-value="userprivacy">《{{ title }}{{$t('agreement.agreement.jwi8n1')}}</text>
                    </view>
                </view>
                <view class="buttom tc margin-top-xxxl padding-top-lg">
                    <button type="default" size="mini" class="br-grey cr-base bg-white text-size-sm round margin-right-xxxl" @tap="exit_event">{{$t('agreement.agreement.062co8')}}</button>
                    <button type="default" size="mini" class="br-main cr-white bg-main text-size-sm round margin-left-xxxl" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="agree_privacy_auth_event">{{$t('agreement.agreement.60t34e')}}</button>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                logo: app.globalData.get_application_logo_square(),
                title: app.globalData.get_application_title(),
                is_show_privacy: false,
                content: null,
            };
        },

        // 页面加载初始化
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 协议验证
            uni.getPrivacySetting({
                success: (res) => {
                    if (res.needAuthorization) {
                        this.setData({
                            is_show_privacy: true,
                            content: app.globalData.get_config('config.common_app_mini_weixin_privacy_content', null),
                        });
                    } else {
                        uni.navigateBack();
                    }
                },
                fail: () => {
                    uni.navigateBack();
                },
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
        },

        methods: {
            // 协议事件
            agreement_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value == null) {
                    app.globalData.showToast(this.$t('login.login.4wc3hr'));
                    return false;
                }

                // 是否存在协议 url 地址
                var key = 'agreement_' + value + '_url';
                var url = app.globalData.get_config('config.' + key) || null;
                if (url == null) {
                    app.globalData.showToast(this.$t('login.login.x0nxxf'));
                    return false;
                }

                // 打开 webview
                app.globalData.open_web_view(url);
            },

            // 退出小程序
            exit_event(e) {
                uni.exitMiniProgram();
            },

            // 授权回调
            agree_privacy_auth_event() {
                uni.navigateBack();
            },
        },
    };
</script>
<style>
    .agreement-page {
        background-color: rgba(0, 0, 0, 0.6);
        height: 100vh;
        padding: 40rpx;
    }
    .agreement-content {
        padding: 40rpx;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: calc(100% - 160rpx);
    }
    .agreement-content .logo {
        width: 160rpx;
        height: 160rpx;
    }
    .agreement-content .content-desc {
        line-height: 46rpx;
        max-height: calc(30vh);
        overflow-y: auto;
    }
    .agreement-content .buttom button {
        min-width: 200rpx;
    }
</style>
