<template>
    <!-- #ifdef H5 -->
    <h5-hls-video :src="src" autoplay class="video-size" :muted="true" @hlsError="error" @ended="ended"></h5-hls-video>
    <!-- #endif -->
    <!-- #ifdef MP -->
    <live-player :src="src" autoplay :muted="true" class="video-size" @statechange="statechange" @error="error" />
    <!-- #endif -->
    <!-- #ifdef APP -->
    <video :src="src" autoplay :is-video="true" :controls="false" muted object-fit="contain" :style="{'width': windowWidth + 'px', 'height': windowHeight + 'px', 'background-color': 'transparent'}" @error="error" @ended="ended"></video>
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
                windowHeight: 0
            }
        },
        created() {
            const data = uni.getWindowInfo();
            this.windowWidth = data.windowWidth;
            this.windowHeight = data.windowHeight;
        },
        mounted() {
            
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
            }
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