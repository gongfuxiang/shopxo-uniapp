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
                <view v-if="is_live_ended" class="live-ended flex-row align-c jc-c" :style="'width:' + windowWidth + 'px;height:' + windowHeight + 'px;'">
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
        background-image: linear-gradient(to bottom,#AD18F9,#05DFC7);
        .live-ended-text {
            color:#fff;
            font-size:16px;
        }
    }
</style>