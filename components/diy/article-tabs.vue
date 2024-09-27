<template>
    <!-- 文章列表 -->
    <view class="ou" :style="style_container">
        <componentDiyModulesTabsView :propValue="article_tabs" :propIsTop="top_up == '1'" :propTop="propTop" :propStyle="tabs_style + 'padding-bottom:24rpx;'" :propCustomNavHeight="propCustomNavHeight" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
        <view class="oh">
            <componentDiyArticleList v-if="hackReset" :propValue="article_tabs" :propIsCommonStyle="false"></componentDiyArticleList>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, padding_computer, margin_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    import componentDiyArticleList from '@/components/diy/article-list'; // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {},
            },
            propTop: {
                type: Number,
                default: 0,
            },
            propCustomNavHeight: {
                type: String,
                default: '66rpx',
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
                hackReset: true,
                // 是否滑动置顶
                top_up: '0',
                tabs_style: '',
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let new_content = this.propValue.content || {};
                let new_style = this.propValue.style || {};
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
                let tabs_style_obj = {
                    padding_top: new_style.common_style.padding_top,
                    padding_left: new_style.common_style.padding_left,
                    padding_right: new_style.common_style.padding_right,
                    margin_top: new_style.common_style.margin_top,
                    margin_left: new_style.common_style.margin_left,
                    margin_right: new_style.common_style.margin_right,
                };
                let new_tabs_style = padding_computer(tabs_style_obj) + margin_computer(tabs_style_obj) + `position:relative;left: -${tabs_style_obj.padding_left * 2}rpx;right: -${tabs_style_obj.padding_right * 2}rpx;width:100%;`;
                let common_style = Object.assign({}, new_style.common_style, {
                    padding_top: 0,
                    margin_top: 0,
                });
                this.setData({
                    article_tabs: new_data,
                    style_container: common_styles_computer(common_style),
                    tabs_style: new_tabs_style,
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
<style lang="scss" scoped>
    .tabs-container {
        position: relative;
        width: 100%;
        left: 0;
        right: 0;
    }
</style>
