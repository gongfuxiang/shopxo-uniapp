<template>
    <div class="flex-col oh" :style="style_container">
        <componentDiyTabs :propValue="value" :isCommon="false" :spacingCommonStyle="spacing_common_style" @tabs-click="tabs_click_event"></componentDiyTabs>
        <componentDiycarousel :propValue="value" :isCommon="false"></componentDiycarousel>
    </div>
</template>

<script>
    import { common_styles_computer } from '@/common/js/common/common.js';
    import componentDiyTabs from '@/components/diy/tabs';
    import componentDiycarousel from '@/components/diy/carousel';
    export default {
        components: {
            componentDiyTabs,
            componentDiycarousel
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
        },
        data() {
            return {
                style_container: '',
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
                }
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const new_style = this.propValue.style || {};
                this.setData({
                    style_container: `${ common_styles_computer(new_style.common_style)};gap:${new_style.data_spacing * 2}rpx`,
                    spacing_common_style: {
                        padding: 0,
                        padding_top: new_style.common_style.padding_top,
                        padding_bottom: 0,
                        padding_left: new_style.common_style.padding_left,
                        padding_right: new_style.common_style.padding_right,
                        margin: 0,
                        margin_top: new_style.common_style.margin_top,
                        margin_bottom: 0,
                        margin_left: new_style.common_style.margin_left,
                        margin_right: new_style.common_style.margin_right,
                    }
                })
            },
            tabs_click_event(tabs_id, is_micro_page) {
                this.$emit('tabs-click', tabs_id, is_micro_page);
            }
        },
    };
</script>

<style scoped lang="scss">
</style>
