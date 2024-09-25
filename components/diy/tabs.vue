<template>
    <!-- 选项卡 -->
    <view class="pr">
        <view v-if="top_up == '1'" class="pf z-i-deep-must left-0 right-0 top-0">
            <view class="seize-seat" :style="tabs_top"></view>
            <view :style="style_container">
                <componentDiyModulesTabsView :value="tabs_data" isTabs @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
            </view>
        </view>
        <!-- 占位 -->
        <view class="pr" :class="top_up == '1' ? 'vs-hide' : ''">
            <view :style="style_container">
                <componentDiyModulesTabsView :value="tabs_data" isTabs @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, padding_computer, margin_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
            isCommon: {
                type: Boolean,
                default: true,
            },
            spacingCommonStyle: {
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
                tabs_data: {},

                // 是否滑动置顶
                top_up: 0,
                tabs_top: 'padding-top:' + bar_height + 34 + 'px',
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                let new_tabs_data = this.value;
                new_tabs_data.content.tabs_list.unshift(new_tabs_data.content.home_data);
                this.setData({
                    tabs_data: new_tabs_data,
                    style_container: this.isCommon ? common_styles_computer(new_style.common_style) : new_content.tabs_top_up == '1' ? padding_computer(this.spacingCommonStyle) + margin_computer(this.spacingCommonStyle) : '',
                    top_up: new_content.tabs_top_up,
                });
            },
            // 选项卡回调
            tabs_click_event(index, item) {
                let tabs_id = '';
                // 抽象出获取 tabs_id 的逻辑
                tabs_id = this.get_tabs_id(item, index);
                // 是否是商品分类页面
                const is_micro_page = item.data_type == '0';
                this.$emit('tabs-click', tabs_id, is_micro_page);
            },
            get_tabs_id(item, index) {
                if (item.data_type === '0') {
                    return index !== 0 ? item.micro_page_list?.id : '';
                } else {
                    return index !== 0 ? item.classify?.id : '';
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .seize-seat {
        z-index: 101;
        position: relative;
    }
    .vs-hide {
        visibility: hidden;
    }
</style>
