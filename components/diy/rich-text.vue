<template>
    <!-- 富文本 -->
    <view class="rich-text" :style="style_container">
        <mp-html :content="content" />
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
        created() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                this.setData({
                    content: new_content.html,
                    style_container: common_styles_computer(new_style.common_style),
                });
            },
        },
    };
</script>

<style>
    .rich-text {
        * {
            max-width: 100%;
        }
    }
</style>
