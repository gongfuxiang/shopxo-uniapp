<template>
    <!-- #ifdef H5 -->
    <h5-hls-video :src="src" autoplay class="video-size"></h5-hls-video>
    <!-- #endif -->
    <!-- #ifdef MP -->
    <live-player :src="src" autoplay class="video-size" @statechange="statechange" @error="error" />
    <!-- #endif -->
    <!-- #ifdef APP -->
    <video :src="src" autoplay :is-video="true" :style="{width: windowWidth + 'px', height: windowHeight + 'px'}"></video>
    <!-- #endif -->
</template>

<script>
    export default {
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
            
        }
    }
</script>

<style scoped>
    .video-size {
        width: 100vw;
        height: 100vh;
    }
</style>