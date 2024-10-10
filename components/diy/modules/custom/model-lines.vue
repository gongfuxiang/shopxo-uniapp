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
            }
        },
        data() {
            return {
                form: {},
                border_style: '',
            };
        },
        watch: {
            propkey(val) {
                this.setData({
                    form: this.propValue,
                });
                this.init();
            }
        },
        created() {
            this.setData({
                form: this.propValue,
            });
            this.init();
        },
        methods: {
            init() {
                this.setData({
                    border_style: this.get_border_style(),
                });
            },
            get_border_style() {
                if (this.form.line_settings === 'horizontal') {
                    return `margin: 10rpx 0;border-bottom: ${this.form.line_size * 2}rpx ${this.form.line_style} ${this.form.line_color};`;
                } else {
                    return `margin: 0 10rpx;border-right: ${this.form.line_size * 2}rpx ${this.form.line_style} ${this.form.line_color};`;
                }
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>
