<template>
    <view :style="border_style"></view>
</template>
<script>
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
                required: true,
            },
            propKey: {
                type: [String,Number],
                default: '',
            },
            propScale: {
                type: Number,
                default: 1,
            }
        },
        data() {
            return {
                form: {},
                border_style: '',
            };
        },
        watch: {
            propKey(val) {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.setData({
                    form: this.propValue,
                    border_style: this.get_border_style(this.propValue, this.propScale),
                });
            },
            get_border_style(form, scale) {
                if (form.line_settings === 'horizontal') {
                    return `margin: 10rpx 0;border-bottom: ${form.line_size * scale }px ${form.line_style} ${form.line_color};`;
                } else {
                    return `margin: 0 10rpx;height:100%;border-right: ${form.line_size * scale }px ${form.line_style} ${form.line_color};`;
                }
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>
