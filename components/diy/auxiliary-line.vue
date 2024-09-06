<template>
    <view>
        <view :style="style_container">
            <view :style="style"></view>
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
                style: '',
            };
        },
        mounted() {
            const new_content = this.value.content || {};
            const new_style = this.value.style || {};
            let border_content = `border-bottom-style: ${new_content?.styles || 'solid'};`;
            let border_style = `border-bottom-width: ${new_style.line_width || 1}px; border-bottom-color: ${new_style.line_color || 'rgba(204, 204, 204, 1)'};`;
            this.style = border_content + border_style;
            this.style_container = common_styles_computer(new_style.common_style);
        },
        methods: {},
    };
</script>

<style></style>
