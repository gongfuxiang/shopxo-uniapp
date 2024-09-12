<template>
    <view :style="style_container">
        <view :style="style"></view>
    </view>
</template>

<script>
    const app = getApp();
    import {
        common_styles_computer
    } from '@/common/js/common/common.js';
    export default {
        props: {
            value: {
                type: Object,
                default: () => {
                    return {};
                },
            },
        },
        data() {
            return {
                style_container: '',
                style: ''
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const {
                    height
                } = this.value.content;
                const {
                    line_color,
                    common_style
                } = this.value.style;
                this.setData({
                    style: `height: ${height * 2 }rpx;background: ${line_color || 'transparent'};`,
                    style_container: common_styles_computer(common_style)
                });
            }
        },
    };
</script>

<style scoped lang="scss">
    .right-0 {
        top: 50%;
        transform: translateY(-50%);
    }
</style>