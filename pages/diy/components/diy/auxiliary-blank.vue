<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <view :style="style"></view>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, common_img_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                style: '',
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
                const { height } = this.propValue.content;
                const { line_color, common_style } = this.propValue.style;
                this.setData({
                    style: `height: ${height * 2}rpx;background: ${line_color || 'transparent'};`,
                    style_container: common_styles_computer(common_style),
                    style_img_container: common_img_computer(common_style, this.propIndex),
                });
            },
        },
    };
</script>

<style scoped lang="scss">
    .right-0 {
        top: 50%;
        transform: translateY(-50%);
    }
</style>
