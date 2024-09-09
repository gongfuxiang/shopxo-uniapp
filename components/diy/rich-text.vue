<template>
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

<style>
    @import url('@/components/u-parse/u-parse.css');
    .rich-text {
        * {
            max-width: 100%;
        }
    }
</style>
