<template>
    <!-- 视频 -->
    <view class="video pr" :style="video_style">
        <!-- #ifndef APP -->
        <video :src="video" class="wh-auto ht-auto" :poster="video_img" objectFit="cover" style="object-fit: cover"></video>
        <!-- #endif-->
        <!-- #ifdef APP -->
        <video-player :poster="video_img" :src="video" objectFit="cover" controls />
        <!-- #endif-->
    </view>
</template>

<script>
    import { isEmpty } from '@/common/js/common/common.js';
    import VideoPlayer from '@/components/video-player/video-player.vue';
    export default {
        components: {
            VideoPlayer,
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
            propDataId: {
                type: String,
                default: '',
            },
            propStyle: {
                type: String,
                default: '',
            },
            propIsCustom: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                video_style: 'width: 100%;height:100%;',
                video_img: '',
                video: '',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                const com_data = this.propValue;
                let video_style = `width: 100%;height:100%;`;
                if (!this.propIsCustom && !isEmpty(com_data)) {
                    const { video_width, video_scale_type } = com_data;
                    const height = video_scale_type === '1' ? video_width : video_scale_type == '0' ? (video_width * 9) / 16 : (video_width * 3) / 4;
                    video_style = `width: ${ video_width * 2 }rpx;height:${ height * 2 }rpx;`
                }
                this.setData({
                    com_data: com_data,
                    video: com_data.video.length > 0 ? com_data.video[0].url : '',
                    video_img: com_data.video_img.length > 0 ? com_data.video_img[0].url : '',
                    video_style: video_style,
                });
            }
        },
    };
</script>

<style></style>
