<template>
    <!-- 视频 -->
    <view :style="style_container">
        <view :style="style_img_container">
            <view class="video pr" :style="style">
                <video :src="video" class="wh-auto ht-auto" :poster="video_img"></video>
            </view>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, common_img_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propkey: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                style: '',
                video_img: '',
                video: '',
            };
        },
        watch: {
            propkey(val) {
                // 初始化
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                // 视频比例
                this.get_video_height(new_content.video_ratio);
                this.setData({
                    video_img: new_content.video_img.length > 0 ? new_content.video_img[0].url : '',
                    video: new_content.video.length > 0 ? new_content.video[0].url : '',
                    style_container: common_styles_computer(new_style.common_style),
                    style_img_container: common_img_computer(new_style.common_style),
                });
            },
            get_video_height(data) {
                uni.getSystemInfo({
                    success: (res) => {
                        let video_ratio = ``;
                        const width = res.windowWidth;
                        if (data == '4:3') {
                            video_ratio = `height: ${(((width * 3) / 4) * 2).toFixed(2)}rpx;`;
                        } else if (data == '1:1') {
                            video_ratio = `height: ${width * 2}rpx;`;
                        } else {
                            // 16:9 保留两位小数
                            video_ratio = `height: ${(((width * 9) / 16) * 2).toFixed(2)}rpx;`;
                        }
                        this.setData({
                            style: video_ratio,
                        });
                    },
                });
            },
        },
    };
</script>

<style></style>
