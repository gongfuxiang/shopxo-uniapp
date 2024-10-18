<template>
    <!-- 富文本 -->
    <view class="diy-rich-text" :style="style_container">
        <view :style="style_img_container">
            <mp-html :content="content" />
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
            propKey: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                content: '',
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
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                this.setData({
                    content: new_content.html,
                    style_container: common_styles_computer(new_style.common_style),
                    style_img_container: common_img_computer(new_style.common_style),
                });
            },
        },
    };
</script>

<style>
    .diy-rich-text {
        * {
            max-width: 100%;
        }
        /* #ifdef H5 */
        [id^=v] {
            width: 100%;
        }
        /* #endif */
    }
    .diy-rich-text video {
        width: 100%;
    }
</style>
