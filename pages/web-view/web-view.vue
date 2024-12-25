<template>
    <view :class="theme_view">
        <web-view :src="web_url"></web-view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                web_url: null
            };
        },

        components: {
            componentCommon
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // url处理
            var url = decodeURIComponent(params.url) || null;
            if (url != null) {
                // token处理
                if (url.indexOf('{token}') >= 0) {
                    var user = app.globalData.get_user_cache_info();
                    var token = user == null ? null : (user.token || null);
                    if (token != null) {
                        url = url.replace(/{token}/ig, token);
                    }
                }
            }

            this.setData({
                web_url: url
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {}
    };
</script>