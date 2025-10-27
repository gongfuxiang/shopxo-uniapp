<template>
    <view :class="theme_view">
        <video class="wh-auto ht dis-block" :is-live="true" src="rtmp://live-pull.shopxo.vip/68f764013572f9240ca7ce6c/shopxo" 
            @error="video_error_callback" 
            :autoplay="autoplay" 
            :controls="controls" 
            :show-fullscreen-btn="show_fullscreen_btn" 
            :enable-play-gesture="false"
        ></video>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                // 自动播放
                autoplay: true,
                // 控制
                controls: false,
                // 全屏按钮
                show_fullscreen_btn: false,
            }
        },
        methods: {
            // 播放错误回调
            video_error_callback: function(e) {
                uni.showModal({
                    content: e.target.errMsg,
                    showCancel: false
                })
            }
        }
    }
</script>
<style>
    
</style>