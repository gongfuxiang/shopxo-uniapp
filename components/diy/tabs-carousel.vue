<template>
    <view class="flex-col ou" :style="style_container">
        <view class="ou" :style="style_img_container">
            <componentDiyTabs :propValue="propValue" :propTop="propTop" :propNavIsTop="propNavIsTop" :propTabsIsTop="propTabsIsTop" @onComputerHeight="tabs_height_event" @onTabsTap="tabs_click_event"></componentDiyTabs>
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
            propKey: {
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
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        methods: {
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                this.setData({
                    // style_container: `${common_styles_computer(common_style)};gap:${new_style.data_spacing * 2}rpx`,
                    style_container: `${common_styles_computer(new_style.common_style)};gap:${new_style.data_spacing * 2}rpx`,
                    style_img_container: common_img_computer(new_style.common_style),
                    top_up: new_content.tabs_top_up,
                });
            },
            tabs_click_event(tabs_id, is_micro_page) {
                this.$emit('onTabsTap', tabs_id, is_micro_page);
            },
            tabs_height_event(height) {
                this.$emit('onComputerHeight', height);
            },
        },
    };
</script>

<style scoped lang="scss"></style>
