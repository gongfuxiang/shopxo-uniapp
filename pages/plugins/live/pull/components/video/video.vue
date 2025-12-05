<template>
    <!-- #ifdef H5 -->
    <h5-hls-video :propSrc="propSrc" propAutoplay :propMuted="muted" class="video-size" @hlsError="error" @ended="ended" @autoPlaySuccess="auto_play_success" @autoPlayError="auto_play_error"></h5-hls-video>
    <!-- #endif -->
    <!-- #ifdef MP -->
    <live-player :src="propSrc" autoplay :muted="muted" class="video-size" @statechange="statechange" @error="error" />
    <!-- #endif -->
    <!-- #ifdef APP -->
    <video :src="propSrc" autoplay :is-video="true" :controls="false" :muted="muted" object-fit="contain" :style="{'width': windowWidth + 'px', 'height': windowHeight + 'px', 'background-color': 'transparent'}" @error="error" @ended="ended"></video>
    <!-- #endif -->
</template>

<script>
    import H5HlsVideo from '@/pages/plugins/live/pull/components/h5-hls-video/h5-hls-video.vue';
    import { isEmpty } from '@/common/js/common/common.js';
    
    /**
     * 直播拉流视频组件
     * 支持H5、小程序和APP三种平台的视频播放
     * 根据不同平台使用不同的播放器组件实现视频播放功能
     */
    export default {
        components: {
            H5HlsVideo
        },
        props: {
            /**
             * 视频源地址
             * @type {String}
             * @default 'http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8'
             */
            propSrc:{
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
            // 获取窗口信息，用于设置视频尺寸
            const data = uni.getWindowInfo();
            this.windowWidth = data.windowWidth;
            this.windowHeight = data.windowHeight;
        },
        methods: {
            /**
             * 直播播放器状态变化处理函数（小程序平台）
             * @param {Object} e - 状态变化事件对象
             */
            statechange(e) {
                console.log(e.detail.code);
            },
            
            /**
             * 播放错误处理函数
             * 根据不同平台处理播放错误，并在适当条件下触发ended事件
             * @param {Object} e - 错误事件对象
             */
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
            
            /**
             * 视频播放结束处理函数
             * 当视频播放完成时触发ended事件通知父组件
             */
            // video app使用这种方式，判断直播是否结束
            ended() {
                this.$emit('ended');
            },
            
            //#ifdef H5
            /**
             * H5平台自动播放成功处理函数
             * 当静音自动播放成功时触发mutedAutoPlaySuccess事件
             * @param {Boolean} e - 是否自动播放成功
             */
            // 网页有的时候直接访问会报错，所以这里需要判断一下，如果报错则静音播放，静音播放成功添加提示，用户操作之后改为非静音播放
            // 静音自动播放成功, 触发事件, 添加提示弹出框，用户操作之后改为非静音播放
            auto_play_success(e) {
                // 静音播放成功时，触发事件，提示用户需要修改点击修改播放状态
                if (e) {
                    this.$emit('mutedAutoPlaySuccess');
                }
            },
            
            /**
             * H5平台自动播放失败处理函数
             * 当自动播放失败时，设置为静音状态重新尝试播放
             * @param {Boolean} e - 是否自动播放失败
             */
            // 自动播放失败, 静音播放
            auto_play_error(e) {
                // 播放失败，并且是非静音状态，则静音播放尝试是否成功
                if (!e) {
                    this.muted = true;
                }
            },
            
            /**
             * H5平台静音状态切换函数
             * 用户点击后取消静音状态
             */
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