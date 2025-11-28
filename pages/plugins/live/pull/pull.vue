<template>
    <view :class="theme_view + ' bg-0'">
        <view class="w h">
            <live-video src="http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8" @ended="ended"></live-video>
        </view>
        <view class="live-content">
            <template v-if="!is_live_ended"> 
                <live-content></live-content>
            </template>
            <template v-else> 
                <view class="live-ended flex-row align-c jc-c">
                    <text class="live-ended-text">直播已结束</text>
                </view>
            </template>
        </view>
    </view>
</template>
<script>
    import liveVideo from './components/video/video.vue';
    import liveContent from './components/live-content/live-content.vue';
    // 引入混入公共逻辑，避免nvue和vue使用同一套逻辑出现问题
    import mixins from './mixins/mixins.js';
    const app = getApp();
    export default {
        components: {
            liveVideo,
            liveContent
        },
        mixins: [mixins],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
            }
        },
    }
</script>
<style lang="scss" scoped>
    .live-content {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
        height: 100%;
    }
    .live-ended {
        width: 100vw;
        height: 100vh;
        // 添加渐变背景色
        background-image: linear-gradient(to bottom, rgba(18, 12, 39, 0.85), rgba(52, 27, 43, 0.7), rgba(92, 39, 41, 0.6), rgba(132, 51, 39, 0.7), rgba(18, 12, 39, 0.85));
        .live-ended-text {
            color: rgba(255, 255, 255, 0.95);
            font-size: 16px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
    }
</style>