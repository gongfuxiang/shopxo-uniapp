<template>
    <!-- 选项卡 -->
    <view class="tabs" :style="style_container">
        <componentDiyModulesTabsView :value="value" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
    </view>
</template>

<script>
    import { common_styles_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        components: {
            componentDiyModulesTabsView,
        },
        data() {
            return {
                style_container: '',
                content: '',
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                this.setData({
                    style_container: common_styles_computer(new_style.common_style),
                });
            },
            // 回调
            tabs_click_event(index, item) {
                // 调接口
                // 回调到上一级
                // 更新上一级的数据，渲染更新页面
            },
        },
    };
</script>

<style></style>
