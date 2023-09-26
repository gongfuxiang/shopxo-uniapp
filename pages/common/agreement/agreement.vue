<template>
    <view class="agreement-page bs-bb">
        <view class="agreement-content border-radius-main bg-white" v-if="is_show_privacy">
            <view class="tc">
                <image class="logo circle auto dis-block margin-bottom-lg br" :src="logo" mode="widthFix"></image>
                <view class="cr-base fw-b text-size-lg">{{ title }}温馨提示</view>
            </view>
            <view class="margin-top-lg text-size-sm cr-base content-desc">
                <block v-if="(content || null) == null">
                    尊敬的用户、为了向您提供更优质的服务，在您使用{{ title }}小程序前，您需要通过点击【同意】并阅读以下协议内容以表示您充分知悉、理解并同意本温馨提示的相关协议的各项规则，包括我们会在您开启的位置信息提供更契合您需求的页面展示、产品或服务，比如首页向您推荐商品或相关门店及排行榜信息。
                </block>
                <block v-else>{{ content }}</block>
            </view>
            <view class="cr-blue margin-top-lg">
                <view>
                    <text @tap="agreement_event" data-value="userregister">《{{ title }}服务用户协议》</text>
                </view>
                <view class="margin-top-sm">
                    <text @tap="agreement_event" data-value="userprivacy">《{{ title }}隐私权政策》</text>
                </view>
            </view>
            <view class="buttom tc margin-top-xxxl padding-top-lg">
                <button type="default" size="mini" class="br-grey cr-base bg-white text-size-sm round margin-right-xxxl" @tap="exit_event">不同意</button>
                <button type="default" size="mini" class="br-main cr-white bg-main text-size-sm round margin-left-xxxl" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="agree_privacy_auth_event">同意</button>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                logo: app.globalData.get_application_logo_square(),
                title: app.globalData.get_application_title(),
                is_show_privacy: false,
                content: null,
            };
        },

        // 页面加载初始化
        onLoad() {
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

        methods: {
            // 协议事件
            agreement_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value == null) {
                    app.globalData.showToast('协议类型有误');
                    return false;
                }

                // 是否存在协议 url 地址
                var key = 'agreement_' + value + '_url';
                var url = app.globalData.get_config('config.' + key) || null;
                if (url == null) {
                    app.globalData.showToast('协议url地址有误');
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
        margin-top: 30%;
        padding: 40rpx;
    }
    .agreement-content .logo {
        width: 160rpx;
        height: 160rpx;
    }
    .agreement-content .content-desc {
        line-height: 46rpx;
    }
    .agreement-content .buttom button {
        min-width: 200rpx;
    }
</style>
