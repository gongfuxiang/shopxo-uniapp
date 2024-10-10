<template>
    <view class="wh-auto ht-auto re oh" :style="com_style"></view>
</template>
<script>
    import { radius_computer, padding_computer, isEmpty, gradient_handle } from '@/common/js/common/common.js';
    
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
                required: true,
            },
            propSourceList: {
                type: [ Object, Array ],
                default: () => {
                    return {};
                },
            },
            propkey: {
                type: String,
                default: '',
            }
        },
        data() {
            return {
                form: {},
                text_title: '',
                text_style: '',
                com_style: '',
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
                    com_style: this.get_com_style(),
                });
            },
            get_com_style() {
                let style = `${ gradient_handle(this.form.color_list, this.form.direction) } ${radius_computer(this.form.bg_radius)}; transform: rotate(${this.form.panel_rotate}deg);`;
                if (this.form.border_show == '1') {
                    style += `border: ${this.form.border_size * 2}rpx ${this.form.border_style} ${this.form.border_color};`;
                }
                return style;
            },
        },
    };  
</script>
<style lang="scss" scoped>
    .break {
        word-wrap: break-word;
        word-break: break-all;
    }
    .rich-text-content {
        white-space: normal;
        word-break: break-all;
        * {
            max-width: 100%;
        }
    }
</style>
