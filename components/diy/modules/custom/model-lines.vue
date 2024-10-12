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
            propkey: {
                type: String,
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
                scale: 1,
            };
        },
        watch: {
            propScale(val) {
                this.scale = val;
                this.init();
            },
            propkey(val) {
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
                    border_style: this.get_border_style(this.propValue),
                });
            },
            get_border_style(form) {
                if (form.line_settings === 'horizontal') {
                    return `margin: 10rpx 0;border-bottom: ${form.line_size * this.scale * 2}rpx ${form.line_style} ${form.line_color};`;
                } else {
                    return `margin: 0 10rpx;border-right: ${form.line_size * this.scale * 2}rpx ${form.line_style} ${form.line_color};`;
                }
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>
