<template>
    <view :class="theme_view + ' live-bg'">
        <view v-if="!is_live_ended" class="w h pr" @dblclick="handle_double_click" @touchend="handle_touch_end" :data-ignore="false">
            <live-video ref="liveVideo" :propSrc="live_config.pull_flv_url || 'http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8'" @ended="ended" @mutedAutoPlaySuccess="muted_auto_play_success"></live-video>
            <!-- 简化版点赞效果组件 -->
            <full-screen-like-effect ref="fullScreenLikeEffect" :propCustomImages="like_show_imgs"></full-screen-like-effect>
        </view>
        <template v-if="!is_loading"> 
            <view class="live-content pointer-events-none">
                <live-content ref="liveContent" :propLiveConfig="live_config" :propLiveShowImgs="like_show_imgs" @liveBack="live_back" @liveStatus="socket_live_status"></live-content>
            </view>
            <view v-if="is_live_ended" class="live-ended flex-row align-c jc-c">
                <view class="flex-col align-c">
                    <text class="live-ended-text">{{live_end_msg}}</text>
                    <button plain size="mini" class="mt-10 live-ended-button" @tap.stop="live_back">
                        <text class="cr-f pa-5">退出直播间</text>
                    </button>
                </view>
            </view>
            <!-- 静音提示 -->
            <view v-if="!is_live_ended && is_muted_auto_play_success" class="live-muted flex-row align-c jc-c">
                <view class="live-muted-tips">
                    因浏览器限制静音，<text class="ml-5 cr-f live-muted-text" @tap="muted_tap">请点击打开声音</text>
                </view>
            </view>
        </template>
    </view>
</template>
<script>
    import liveVideo from './components/video/video.vue';
    import liveContent from './components/live-content/live-content.vue';
    // 引入点赞效果组件
    import fullScreenLikeEffect from './components/full-screen-like-effect/full-screen-like-effect.vue';
    // 引入混入公共逻辑，避免nvue和vue使用同一套逻辑出现问题
    import mixins from './mixins/mixins.js';
    const app = getApp();
    export default {
        components: {
            liveVideo,
            liveContent,
            fullScreenLikeEffect
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
        z-index: 11;
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
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        .live-ended-text {
            color:#fff;
            font-size:16px;
        }
    }
    .live-ended-button {
        border-radius: 6px;
        border-color: #fff;
    }
</style>