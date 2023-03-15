<template>
    <view>
        <web-view :src="web_url"></web-view>
    </view>
</template>
<script>
    const app = getApp();

    export default {
        data() {
            return {
                web_url: null
            };
        },

        components: {},
        props: {},

        onLoad(option) {
            // url处理
            var url = decodeURIComponent(option.url) || null;
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

        methods: {}
    };
</script>