<template>
    <!-- 热区 -->
    <view ref="containerRef" class="oh" :style="style_container">
        <view ref="hotRef" class="hot pr" :style="style">
            <image src="img" class="wh-auto" mode="widthFix" />
            <view v-for="(item, index) in hot_data" :key="index" class="hot_box" :style="rect_style(item.drag_start, item.drag_end)"></view>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                style_container: '',
                content: '',
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                this.content = new_content.html;
                this.style_container = common_styles_computer(new_style.common_style);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .hot {
        min-height: 20rpx;
        .hot_box {
            background: rgba(42, 148, 255, 0.15);
            border: 2rpx dashed rgba(142, 198, 255, 0.5);
            position: absolute;
            opacity: 0.4;
        }
    }
</style>
