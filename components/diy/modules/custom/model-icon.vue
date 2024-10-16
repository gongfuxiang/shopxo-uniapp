<template>
    <view class="img-outer pr oh flex-row align-c wh-auto ht-auto" :style="com_style" :data-value="form.icon_link.page" @tap="url_event">
        <iconfont :name="'icon-' + form.icon_class" :color="form.icon_color" :size="form.icon_size * scale + 'px'" propContainerDisplay="flex"></iconfont>
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
                type: [ Object, Array ],
                default: () => {
                    return {};
                },
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
                com_style: '',
                scale: 1,
            };
        },
        watch: {
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
                    scale: this.propScale,
                    com_style: this.get_com_style(this.propValue, this.propScale),
                });
            },
            get_com_style(form, scale) {
                let style = `${ gradient_handle(form.color_list, form.direction) } ${ radius_computer(form.bg_radius, scale, true) };transform: rotate(${form.icon_rotate}deg);${ padding_computer(form.icon_padding, scale, true) };`;
                if (form.border_show == '1') {
                    style += `border: ${form.border_size * scale }px ${form.border_style} ${form.border_color};box-sizing: border-box;`;
                }
                if (form.icon_location == 'center') {
                    style += `justify-content: center;`;
                } else if (form.icon_location == 'left') {
                    style += `justify-content: flex-start;`;
                } else if (form.icon_location == 'right') {
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
