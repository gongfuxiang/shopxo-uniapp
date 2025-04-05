<template>
    <!-- 横线 -->
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
                default: () => ({}),
            },
            // key
            propKey: {
                type: [String,Number],
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
            // 初始化数据
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                // 边框设置
                let border_content = `border-bottom-style: ${new_content?.styles || 'solid'};`;
                // 边框颜色设置
                let border_style = `border-bottom-width: ${new_style.line_width * 2 || 2}rpx; border-bottom-color: ${new_style.line_color || 'rgba(204, 204, 204, 1)'};`;
                this.setData({
                    style: border_content + border_style,
                    style_container: common_styles_computer(new_style.common_style),
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                });
            },
        },
    };
</script>

<style></style>
