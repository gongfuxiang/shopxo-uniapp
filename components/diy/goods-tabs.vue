<template>
    <view class="ou" :style="style_container">
        <componentDiyModulesTabsView :propValue="goods_tabs" :propIsTop="top_up == '1'" :propTop="tabs_top" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
        <view class="padding-top oh">
            <componentGoodsList v-if="hackReset" :propValue="goods_tabs" :propIsCommonStyle="false"></componentGoodsList>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    import componentGoodsList from '@/components/diy/goods-list'; // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        components: {
            componentDiyModulesTabsView,
            componentGoodsList,
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
                goods_tabs: {},
                hackReset: true,
                // 是否滑动置顶
                top_up: '0',
                // 5,7,0 是误差，， 12 是下边距，60是高度，bar_height是不同小程序下的导航栏距离顶部的高度
                // #ifdef MP
                tabs_top: 'calc(' + (bar_height + 5 + 12) + 'px + 66rpx);',
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                tabs_top: 'calc(' + (bar_height + 7 + 12) + 'px + 66rpx);',
                // #endif
                // #ifdef APP
                tabs_top: 'calc(' + (bar_height + 0 + 12) + 'px + 66rpx);',
                // #endif
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                let new_data = JSON.parse(JSON.stringify(this.propValue));
                this.top_up = new_content.tabs_top_up;
                // 产品的值
                new_data.content.data_type = new_data.content.tabs_list[0].data_type;
                new_data.content.category = new_data.content.tabs_list[0].category;
                new_data.content.brand = new_data.content.tabs_list[0].brand;
                new_data.content.number = new_data.content.tabs_list[0].number;
                new_data.content.sort = new_data.content.tabs_list[0].sort;
                new_data.content.sort_rules = new_data.content.tabs_list[0].sort_rules;
                new_data.content.data_list = new_data.content.tabs_list[0].data_list;
                new_data.content.data_auto_list = new_data.content.tabs_list[0].data_auto_list;
                this.setData({
                    goods_tabs: new_data,
                    style_container: common_styles_computer(new_style.common_style),
                });
            },
            tabs_click_event(index) {
                let new_data = JSON.parse(JSON.stringify(this.propValue));
                new_data.content.data_type = new_data.content.tabs_list[index].data_type;
                new_data.content.category = new_data.content.tabs_list[index].category;
                new_data.content.brand = new_data.content.tabs_list[index].brand;
                new_data.content.number = new_data.content.tabs_list[index].number;
                new_data.content.sort = new_data.content.tabs_list[index].sort;
                new_data.content.sort_rules = new_data.content.tabs_list[index].sort_rules;
                new_data.content.data_list = new_data.content.tabs_list[index].data_list;
                new_data.content.data_auto_list = new_data.content.tabs_list[index].data_auto_list;
                this.setData({
                    goods_tabs: new_data,
                    hackReset: false,
                });
                this.$nextTick(() => {
                    this.setData({
                        hackReset: true,
                    });
                });
            },
        },
    };
</script>

<style scoped lang="scss"></style>
