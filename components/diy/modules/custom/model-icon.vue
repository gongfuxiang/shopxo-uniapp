<template>
    <view class="img-outer pr oh flex-row align-c wh-auto ht-auto" :style="com_style" :data-value="form.icon_link.page" @tap="url_event">
        <iconfont :name="'icon-' + form.icon_class" :color="form.icon_color" :size="form.icon_size * 2 + 'rpx'"></iconfont>
    </view>
</template>
<script>
    import { radius_computer, padding_computer, gradient_handle } from '@/common/js/common/common.js';
    
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
                type: Object,
                default: () => {
                    return {};
                },
            }
        },
        data() {
            return {
                form: {},
                com_style: '',
            };
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
                let style = `${ gradient_handle(this.form.color_list, this.form.direction) } ${ radius_computer(this.form.bg_radius) };transform: rotate(${this.form.icon_rotate}deg);${ padding_computer(this.form.icon_padding) };`;
                if (this.form.border_show == '1') {
                    style += `border: ${this.form.border_size * 2 }rpx ${this.form.border_style} ${this.form.border_color};box-sizing: border-box;`;
                }
                if (this.form.icon_location == 'center') {
                    style += `justify-content: center;`;
                } else if (this.form.icon_location == 'left') {
                    style += `justify-content: flex-start;`;
                } else if (this.form.icon_location == 'right') {
                    style += `justify-content: flex-end;`;
                }
                return style;
            },
            url_event(e) {
                this.$emit('url_event', e)
            },
        },
    };  
</script>
<style lang="scss" scoped>
</style>
