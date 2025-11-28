<template>
    <!-- #ifdef H5 -->
    <h5-hls-video :src="src" autoplay class="video-size" :muted="true"></h5-hls-video>
    <!-- #endif -->
    <!-- #ifdef MP -->
    <live-player :src="src" autoplay :muted="true" class="video-size" @statechange="statechange" @error="error" />
    <!-- #endif -->
    <!-- #ifdef APP -->
    <video :src="src" autoplay :is-video="true" :controls="false" muted object-fit="fill" :style="{width: windowWidth + 'px', height: windowHeight + 'px'}" @error="error" @ended="ended"></video>
    <!-- #endif -->
</template>

<script>
    import H5HlsVideo from '@/pages/plugins/live/pull/components/h5-hls-video/h5-hls-video.vue';
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
                console.log(e.detail.errMsg, 'error');
            },
            // video app使用这种方式，判断直播是否结束
            ended() {
                this.$emit('ended');
            }
        },
    }
</script>

<style scoped>
    .video-size {
        width: 100vw;
        height: 100vh;
    }
</style>