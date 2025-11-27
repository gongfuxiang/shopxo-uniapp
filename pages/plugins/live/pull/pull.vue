<template>
    <view :class="theme_view + ' bg-0'">
        <view class="w h">
            <live-video src="http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8"></live-video>
        </view>
        <view class="live-content">
            <live-content></live-content>
        </view>
    </view>
</template>
<script>
    import liveVideo from './components/video/video.vue';
    import liveContent from './components/live-content/live-content.vue';
    const app = getApp();
    export default {
        components: {
            liveVideo,
            liveContent
        },
        data() {
            return {
            }
        },
        
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        
            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },
        
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },
        methods: {
            
        }
    }
</script>
<style scoped>
    .live-content {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
        height: 100%;
    }
</style>