<template>
    <!-- 横线 -->
    <view :style="style_container">
        <view :style="style"></view>
    </view>
</template>

<script>
    import { common_styles_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                style_container: '',
                style: '',
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                let border_content = `border-bottom-style: ${new_content?.styles || 'solid'};`;
                let border_style = `border-bottom-width: ${new_style.line_width * 2 || 2}rpx; border-bottom-color: ${new_style.line_color || 'rgba(204, 204, 204, 1)'};`;
                this.setData({
                    style: border_content + border_style,
                    style_container: common_styles_computer(new_style.common_style),
                });
            },
        },
    };
</script>

<style></style>
