<template>
    <!-- 视频 -->
    <view class="video pr wh-auto ht-auto">
        <video :src="video" class="wh-auto ht-auto" :poster="video_img" objectFit="cover" :style="'object-fit: cover;' + video_style"></video>
    </view>
</template>

<script>
    import { padding_computer, radius_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            propKey: {
                type: [String, Number],
                default: '',
            },
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propDataStyle: {
                type: Object,
                default: () => ({}),
            }
        },
        data() {
            return {
                style_container: '',
                video_img: '',
                video: '',
                video_style: '',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            // 初始化数据
            init() {
                const new_content = this.propValue || {};
                // 视频比例
                this.setData({
                    video_img: new_content.video_img.length > 0 ? new_content.video_img[0].url : '',
                    video: new_content.video.length > 0 ? new_content.video[0].url : '',
                    video_style: radius_computer(this.propDataStyle.img_radius),
                });
            }
        },
    };
</script>

<style></style>
