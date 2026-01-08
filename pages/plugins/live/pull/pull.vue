<template>
    <view :class="theme_view + ' pr'">
        <view class="pr live-bg" @click="handle_click" @touchend="handle_touch_end" :data-ignore="false">
<<<<<<< HEAD
            <component-live-video v-if="!is_live_ended" ref="liveVideo" :propSrc="live_video_src || 'https://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo.m3u8'" @ended="ended" @loadedmetadata="loadedmetadata" @mutedAutoPlaySuccess="muted_auto_play_success" @mutedTap="muted_tap"></component-live-video>
=======
            <text>{{ !is_live_ended && is_muted_auto_play_error && !live_be_right_back_error }}</text>
            <component-live-video v-if="!is_live_ended" ref="liveVideo" :propSrc="live_video_src || 'http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo.m3u8'" @ended="ended" @loadedmetadata="loadedmetadata" @mutedAutoPlaySuccess="muted_auto_play_success" @mutedTap="muted_tap" @mutedAutoPlayError="muted_auto_play_error"></component-live-video>
>>>>>>> 7609952be5c0b05fb18c21255ae272784897d2ad
            <!-- 简化版点赞效果组件 -->
            <component-full-screen-like-effect ref="fullScreenLikeEffect" :propCustomImages="like_show_imgs"></component-full-screen-like-effect>
        </view>
        <template v-if="!is_loading"> 
            <view class="live-content pointer-events-none">
                <component-live-content ref="liveContent" :propWindowWidth="windowWidth" :propWindowHeight="windowHeight" :propLiveData="live_data" :propLiveConfig="live_config" :propLiveShowImgs="like_show_imgs" @liveBack="live_back" @liveStatus="socket_live_status"></component-live-content>
            </view>
            <view v-if="is_live_ended" class="live-ended flex-row align-c jc-c">
                <view class="flex-col align-c">
                    <text class="live-ended-text">直播已结束</text>
                    <button plain size="mini" class="mt-10 live-ended-button" @tap.stop="live_back">
                        <text class="cr-f pa-5">退出直播间</text>
                    </button>
                </view>
            </view>
            <!-- 静音提示 -->
            <view v-if="!is_live_ended && is_muted_auto_play_success && !live_be_right_back_error" class="live-muted flex-row align-c jc-c pointer-events-none">
                <view class="live-muted-tips pointer-events-auto">
                    因浏览器限制静音，<text class="ml-5 cr-f live-muted-text" @tap="muted_tap">请点击打开声音</text>
                </view>
            </view>
            <!-- 视频播放提示 -->
            <view v-if="!is_live_ended && is_muted_auto_play_error && !live_be_right_back_error" class="live-play flex-row align-c jc-c pointer-events-none">
                <component-icon propName="bofang" class="component-icon-play" propSize="200rpx" propColor="#fff" @click="muted_tap"></component-icon>
            </view>
            <!-- 主播暂时离开的提示信息-->
            <view v-if="live_be_right_back_error" class="live-pause flex-row align-c jc-c pointer-events-none">
                <view class="flex-1 flex-col align-c jc-c">
                    <component-icon propName="coffee" propSize="100rpx" propColor="#fff"></component-icon>
                    <text class="text-size mt-5 cr-white">主播暂时离开</text>
                    <text class="text-size-sm mt-5 cr-white">休息片刻，更多精彩马上到来</text>
                </view>
            </view>
        </template>
    </view>
</template>
<script>
    import componentIcon from './components/icon/icon.vue';
    import componentLiveVideo from './components/video/video.vue';
    import componentLiveContent from './components/live-content/live-content.vue';
    // 引入点赞效果组件
    import componentFullScreenLikeEffect from './components/full-screen-like-effect/full-screen-like-effect.vue';
    // 引入混入公共逻辑，避免nvue和vue使用同一套逻辑出现问题
    import mixins from './mixins/mixins.js';
    const app = getApp();
    export default {
        components: {
            componentLiveVideo,
            componentLiveContent,
            componentIcon,
            componentFullScreenLikeEffect
        },
        mixins: [mixins],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                is_muted_auto_play_success: false,
                is_muted_auto_play_error: false,
                initial_reminder: false
            }
        },
        methods: {
            muted_auto_play_success(is_muted) {
                if (is_muted) {
                    this.is_muted_auto_play_success = true;
                }
            },
            muted_auto_play_error() {
                this.is_muted_auto_play_error = true;
            },
            // 静音提示点击
            muted_tap() {
                if (this.$refs.liveVideo) {
                    this.$refs.liveVideo.muted_tap();
                }
                // 关闭静音提示
                this.is_muted_auto_play_success = false;
                // 关闭播放按钮
                this.is_muted_auto_play_error = false;
            }
        },
    }
</script>
<style lang="scss" scoped>
    .live-bg {
        background-image: linear-gradient(to bottom,#ba623c,#14766a);
        width: 100%;
        height: 100vh;
    }
    .live-content {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
        height: 100%;
    }
    .live-pause {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 8;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #330066, #000000);
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
    .live-play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 11;
        width: 100%;
        height: 100%;
        background: red;
        .component-icon-play {
            height: 200rpx;
            width: 200rpx;
            font-size: 200rpx !important;
            color: inherit !important;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .live-ended {
        background: linear-gradient(to bottom,#AD18F9,#05DFC7);
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