<template>
    <view :class="theme_view + ' live-bg'">
        <view class="w h">
            <live-video ref="liveVideo" :src="live_config.pull_flv_url || 'http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8'" @ended="ended" @mutedAutoPlaySuccess="muted_auto_play_success"></live-video>
        </view>
        <view v-if="!is_loading" class="live-content">
            <template v-if="!is_live_ended"> 
                <live-content :live-config="live_config" @live-back="live_back"></live-content>
            </template>
            <template v-else> 
                <view class="live-ended flex-row align-c jc-c">
                     <view class="flex-col align-c">
                        <text class="live-ended-text">直播已结束</text>
                        <button plain size="mini" class="mt-10 live-ended-button" @tap="live_back">
                            <text class="cr-f pa-5">退出直播间</text>
                        </button>
                    </view>
                </view>
            </template>
        </view>
        <!-- 静音提示 -->
        <view v-if="!is_loading && !is_live_ended && is_muted_auto_play_success" class="live-muted flex-row align-c jc-c">
            <view class="live-muted-tips">
                因浏览器限制静音，<text class="ml-5 cr-f live-muted-text" @tap="muted_tap">请点击打开声音</text>
            </view>
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
                is_muted_auto_play_success: false,
            }
        },
        methods: {
            muted_auto_play_success() {
                this.is_muted_auto_play_success = true;
            },
            // 静音提示点击
            muted_tap() {
                this.$refs.liveVideo.muted_tap();
                // 关闭静音提示
                this.is_muted_auto_play_success = false;
            }
        },
    }
</script>
<style lang="scss" scoped>
    .live-bg {
        background-image: linear-gradient(to bottom,#ba623c,#14766a);
    }
    .live-content {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
        height: 100%;
    }
    .live-muted {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        width: 100%;
        height: 100%;
        .live-muted-tips {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 20rpx;
            padding: 15rpx 20rpx;
            font-size: 32rpx;
            color: #fff;
        }
        .live-muted-text {
            color: rgba(210,27,70,1);
            padding-bottom: 4rpx;
            font-size:16px;
        }
        .live-muted-text:hover {
            color: rgba(210,27,70,1);
            border-bottom: 1px solid rgba(210,27,70,1);
        }
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