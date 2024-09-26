<template>
    <view class="overflow-unset" :style="style_container">
        <componentDiyModulesTabsView :propValue="goods_tabs" :propIsTop="top_up == '1'" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
        <view class="padding-top oh">
            <componentGoodsList :key="key" :propValue="goods_tabs" :propIsCommonStyle="false"></componentGoodsList>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, get_math } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    import componentGoodsList from '@/components/diy/goods-list';
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
                key: 1,
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
                    key: get_math(),
                });
            },
        },
    };
</script>

<style scoped lang="scss">
    .overflow-unset {
        overflow: unset !important;
    }
</style>
