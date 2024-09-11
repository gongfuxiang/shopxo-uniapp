<template>
    <!-- 文章列表 -->
    <view :style="style_container">
        <componentDiyModulesTabsView :value="article_tabs"></componentDiyModulesTabsView>
        <view class="pt-10">
            <componentDiyArticleList :value="article_tabs" :is-common-style="false"></componentDiyArticleList>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    export default {
        props: {
            value: {
                type: Object,
                default: () => {},
            },
            isCommonStyle: {
                type: Boolean,
                default: true,
            },
        },
        components: {
            componentDiyModulesTabsView,
        },
        data() {
            return {
                style_container: '',
                style: '',
                article_tabs: {},
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_style = this.value.style || {};
                let new_data = JSON.parse(JSON.stringify(this.value));
                new_data.content.theme = new_data.content.article_theme;
                new_data.content.data_type = new_data.content.tabs_list[0].data_type;
                new_data.content.category = new_data.content.tabs_list[0].category;
                new_data.content.carousel_col = new_data.content.article_carousel_col;
                new_data.content.data_list = new_data.content.tabs_list[0].data_list;
                new_data.content.data_ids = new_data.content.tabs_list[0].data_ids;
                new_data.content.number = new_data.content.tabs_list[0].number;
                new_data.content.sort = new_data.content.tabs_list[0].sort;
                new_data.content.sort_rules = new_data.content.tabs_list[0].sort_rules;
                new_data.content.field_show = new_data.content.field_show;
                new_data.content.is_cover = new_data.content.tabs_list[0].is_cover;
                article_tabs = new_data;
                style_container += common_styles_computer(new_style.common_style);
            },
        },
    };
</script>
<style lang="scss" scoped></style>
