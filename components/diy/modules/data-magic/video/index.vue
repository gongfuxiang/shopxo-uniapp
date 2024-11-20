<template>
    <!-- 视频 -->
    <view class="wh-auto ht-auto" :style="style_container">
        <view class="video pr wh-auto ht-auto">
            <video :src="video" class="wh-auto ht-auto" :poster="video_img" objectFit="cover" style="object-fit: cover"></video>
        </view>
    </view>
</template>

<script>
    import { padding_computer, radius_computer } from '@/common/js/common/common.js';
    export default {
        props: {
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
            };
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
                    style_container: padding_computer(this.propDataStyle.chunk_padding) + radius_computer(this.propDataStyle.img_radius) + 'box-sizing: border-box;',
                });
            }
        },
    };
</script>

<style></style>
