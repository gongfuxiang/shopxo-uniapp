<template>
    <!-- #ifdef H5 -->
    <h5-hls-video :src="src" autoplay :muted="muted" class="video-size" @hlsError="error" @ended="ended" @autoPlaySuccess="auto_play_success" @autoPlayError="auto_play_error"></h5-hls-video>
    <!-- #endif -->
    <!-- #ifdef MP -->
    <live-player :src="src" autoplay :muted="muted" class="video-size" @statechange="statechange" @error="error" />
    <!-- #endif -->
    <!-- #ifdef APP -->
    <video :src="src" autoplay :is-video="true" :controls="false" :muted="muted" object-fit="contain" :style="{'width': windowWidth + 'px', 'height': windowHeight + 'px', 'background-color': 'transparent'}" @error="error" @ended="ended"></video>
    <!-- #endif -->
</template>

<script>
    import H5HlsVideo from '@/pages/plugins/live/pull/components/h5-hls-video/h5-hls-video.vue';
    import { isEmpty } from '@/common/js/common/common.js';
    export default {
        components: {
            H5HlsVideo
        },
        props: {
            src:{
                type: String,
                default: 'http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8'
            }
        },
        data() {
            return {
                windowWidth: 0,
                windowHeight: 0,
                muted: false,
            }
        },
        created() {
            const data = uni.getWindowInfo();
            this.windowWidth = data.windowWidth;
            this.windowHeight = data.windowHeight;
        },
        methods: {
            statechange(e) {
                console.log(e.detail.code);
            },
            error(e) {
                // #ifdef H5
                // 非初次加载错误的, 直播结束
                if (e.type != 'otherError' || e.details != 'internalException') {
                    this.$emit('ended');
                }
                // #endif
                // #ifdef APP-NVUE
                if (!isEmpty(e.type) && e.type == 'error') {
                    this.$emit('ended');
                }
                // #endif
                console.log(e, 'error');
            },
            // video app使用这种方式，判断直播是否结束
            ended() {
                this.$emit('ended');
            },
            //#ifdef H5
            // 网页有的时候直接访问会报错，所以这里需要判断一下，如果报错则静音播放，静音播放成功添加提示，用户操作之后改为非静音播放
            // 静音自动播放成功, 触发事件, 添加提示弹出框，用户操作之后改为非静音播放
            auto_play_success(e) {
                // 静音播放成功时，触发事件，提示用户需要修改点击修改播放状态
                if (e) {
                    this.$emit('mutedAutoPlaySuccess');
                }
            },
            // 自动播放失败, 静音播放
            auto_play_error(e) {
                // 播放失败，并且是非静音状态，则静音播放尝试是否成功
                if (!e) {
                    this.muted = true;
                }
            },
            // 静音提示点击
            muted_tap() {
                this.muted = false;
            }
            // #endif
        },
    }
</script>

<style lang="scss" scoped>
    .video-size {
        width: 100vw;
        height: 100vh;
    }
    .video-bg {
        background-image: linear-gradient(to bottom,#ba623c,#14766a);
    }
</style>