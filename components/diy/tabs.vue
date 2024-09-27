<template>
    <!-- 选项卡 -->
    <componentDiyModulesTabsView :propValue="tabs_data" propIsTabsIcon :propIsTop="top_up == '1'" :propTop="propTop" :propStyle="style_container" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
</template>

<script>
    const app = getApp();
    import { common_styles_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propTop: {
                type: Number,
                default: 0,
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
                top_up: '0',
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                let new_tabs_data = JSON.parse(JSON.stringify(this.propValue));
                new_tabs_data.content.tabs_list.unshift(new_tabs_data.content.home_data);
                this.setData({
                    tabs_data: new_tabs_data,
                    style_container: common_styles_computer(new_style.common_style),
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
    .tabs {
        max-height: 100rpx;
    }
</style>
