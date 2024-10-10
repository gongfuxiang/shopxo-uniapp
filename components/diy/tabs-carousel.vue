<template>
    <view class="flex-col ou" :style="style_container">
        <view class="ou" :style="style_img_container">
            <componentDiyTabs :propValue="propValue" :propTop="propTop" :propNavIsTop="propNavIsTop" :propTabsIsTop="propTabsIsTop" @computer-height="tabs_height_event" @tabs-click="tabs_click_event"></componentDiyTabs>
            <componentDiycarousel :propValue="propValue" :propIsCommon="false"></componentDiycarousel>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, common_img_computer } from '@/common/js/common/common.js';
    import componentDiyTabs from '@/components/diy/tabs';
    import componentDiycarousel from '@/components/diy/carousel';
    export default {
        components: {
            componentDiyTabs,
            componentDiycarousel,
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propTop: {
                type: Number,
                default: 0,
            },
            // 是否导航栏置顶
            propNavIsTop: {
                type: Boolean,
                default: true,
            },
            // 是否选项卡置顶
            propTabsIsTop: {
                type: Boolean,
                default: false,
            },
            propkey: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                spacing_common_style: {
                    padding: 0,
                    padding_top: 0,
                    padding_bottom: 0,
                    padding_left: 0,
                    padding_right: 0,
                    margin: 0,
                    margin_top: 0,
                    margin_bottom: 0,
                    margin_left: 0,
                    margin_right: 0,
                },
                top_up: '0',
                tabs_style: '',
            };
        },
        created() {
            this.init();
        },
        // 属性值改变监听
        watch: {
            // 数据
            propTabsIsTop(value, old_value) {
                this.init();
            },
            propkey(val) {
                // 初始化
                this.init();
            },
        },
        methods: {
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                // let tabs_style_obj = {
                //     padding_top: new_style.common_style.padding_top,
                //     padding_left: new_style.common_style.padding_left,
                //     padding_right: new_style.common_style.padding_right,
                //     margin_top: new_style.common_style.margin_top,
                //     margin_left: new_style.common_style.margin_left,
                //     margin_right: new_style.common_style.margin_right,
                // };
                // let new_tabs_style = padding_computer(tabs_style_obj) + margin_computer(tabs_style_obj) + `position:relative;left: -${tabs_style_obj.padding_left * 2}rpx;right: -${tabs_style_obj.padding_right * 2}rpx;width:100%;`;
                // let common_style = Object.assign({}, new_style.common_style, {
                //     padding_top: 0,
                //     margin_top: 0,
                // });
                this.setData({
                    // style_container: `${common_styles_computer(common_style)};gap:${new_style.data_spacing * 2}rpx`,
                    style_container: `${common_styles_computer(new_style.common_style)};gap:${new_style.data_spacing * 2}rpx`,
                    style_img_container: common_img_computer(new_style.common_style),
                    top_up: new_content.tabs_top_up,
                    // tabs_style: new_tabs_style,
                });
            },
            tabs_click_event(tabs_id, is_micro_page) {
                this.$emit('tabs-click', tabs_id, is_micro_page);
            },
            tabs_height_event(height) {
                this.$emit('computer-height', height);
            },
        },
    };
</script>

<style scoped lang="scss"></style>
