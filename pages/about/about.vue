<template>
    <view :class="theme_view">
        <view class="padding-main tc">
            <view class="bg-white border-radius-main padding-main">
                <view class="padding-vertical-xxl">
                    <image class="logo circle br-f5 padding-sm dis-block auto margin-top-xl" :src="logo" mode="aspectFill"></image>
                    <view class="margin-top-sm text-size">{{title}}</view>
                    <!-- #ifdef APP -->
                    <view class="margin-top-sm cr-grey-9">{{app_version_info}}</view>
                    <!-- #endif -->
                    <view class="margin-top-xxl cr-base text-size-sm">{{describe}}</view>
                    <view class="margin-top-xxxxl padding-vertical-xxxxl">
                        <text class="cp cr-blue margin-right" data-value="userregister" @tap="agreement_event">{{ $t('login.login.2v11we') }}</text>
                        <text class="cp cr-blue margin-left" data-value="userprivacy" @tap="agreement_event">{{ $t('login.login.myno2x') }}</text>
                    </view>
                </view>
            </view>
            <view class="margin-top cr-grey-c">Copyright 2018-{{year}} by {{title}}</view>
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
                describe: app.globalData.get_application_describe(),
                app_version_info: app.globalData.data.app_version_info,
                year: (new Date()).getFullYear(),
            };
        },

        components: {},
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
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
        }
    };
</script>
<style>
    @import './about.css';
</style>