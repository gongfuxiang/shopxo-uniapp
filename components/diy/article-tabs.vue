<template>
    <!-- 文章列表 -->
    <view class="overflow-unset" :style="style_container">
        <componentDiyModulesTabsView :propValue="article_tabs" :isTop="top_up == '1'" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
        <view class="padding-top oh">
            <componentDiyArticleList :key="key" :propValue="article_tabs" :propIsCommonStyle="false"></componentDiyArticleList>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, get_math } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    import componentDiyArticleList from '@/components/diy/article-list';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {},
            },
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
        },
        components: {
            componentDiyModulesTabsView,
            componentDiyArticleList,
        },
        data() {
            return {
                style_container: '',
                style: '',
                article_tabs: {},
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
                new_data.content.theme = new_data.content.article_theme;
                new_data.content.data_type = new_data.content.tabs_list[0].data_type;
                new_data.content.category = new_data.content.tabs_list[0].category;
                new_data.content.carousel_col = new_data.content.article_carousel_col;
                new_data.content.data_list = new_data.content.tabs_list[0].data_list;
                new_data.content.data_auto_list = new_data.content.tabs_list[0].data_auto_list;
                new_data.content.data_ids = new_data.content.tabs_list[0].data_ids;
                new_data.content.number = new_data.content.tabs_list[0].number;
                new_data.content.sort = new_data.content.tabs_list[0].sort;
                new_data.content.sort_rules = new_data.content.tabs_list[0].sort_rules;
                new_data.content.field_show = new_data.content.field_show;
                new_data.content.is_cover = new_data.content.tabs_list[0].is_cover;
                this.setData({
                    article_tabs: new_data,
                    style_container: common_styles_computer(new_style.common_style),
                });
            },
            tabs_click_event(index) {
                let new_data = JSON.parse(JSON.stringify(this.propValue));
                new_data.content.theme = new_data.content.article_theme;
                new_data.content.data_type = new_data.content.tabs_list[index].data_type;
                new_data.content.category = new_data.content.tabs_list[index].category;
                new_data.content.carousel_col = new_data.content.article_carousel_col;
                new_data.content.data_list = new_data.content.tabs_list[index].data_list;
                new_data.content.data_auto_list = new_data.content.tabs_list[index].data_auto_list;
                new_data.content.data_ids = new_data.content.tabs_list[index].data_ids;
                new_data.content.number = new_data.content.tabs_list[index].number;
                new_data.content.sort = new_data.content.tabs_list[index].sort;
                new_data.content.sort_rules = new_data.content.tabs_list[index].sort_rules;
                new_data.content.field_show = new_data.content.field_show;
                new_data.content.is_cover = new_data.content.tabs_list[index].is_cover;
                this.setData({
                    article_tabs: new_data,
                    key: get_math(),
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .overflow-unset {
        overflow: unset !important;
    }
</style>
