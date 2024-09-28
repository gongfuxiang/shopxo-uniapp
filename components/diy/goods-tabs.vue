<template>
    <view class="goods-tabs ou" :style="style_container">
        <componentDiyModulesTabsView :propValue="goods_tabs" :propIsTop="top_up == '1'" :propTop="propTop" :propStyle="tabs_style + 'padding-bottom:24rpx;'" :propCustomNavHeight="propCustomNavHeight * 2 + 'rpx'" :propTabsBackground="tabs_background" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
        <view class="oh">
            <componentGoodsList v-if="hackReset" :propValue="goods_tabs" :propIsCommonStyle="false"></componentGoodsList>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, padding_computer, margin_computer, background_computer, gradient_computer } from '@/common/js/common/common.js';
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
            propTop: {
                type: Number,
                default: 0,
            },
            propCustomNavHeight: {
                type: Number,
                default: 33,
            },
            propScrollTop: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                style_container: '',
                goods_tabs: {},
                hackReset: true,
                // 是否滑动置顶
                top_up: '0',
                tabs_top: 0,
                tabs_background: 'background:transparent',
                custom_nav_height: 33,
            };
        },
        watch: {
            propScrollTop(newVal) {
                if (newVal + this.propTop + this.custom_nav_height >= this.tabs_top) {
                    let new_style = this.propValue.style || {};
                    let tabs_bg = new_style.common_style.color_list;
                    let new_tabs_background = '';
                    if (tabs_bg.length > 0 && tabs_bg[0].color !== '') {
                        new_tabs_background = gradient_computer(new_style.common_style);
                    }
                    this.setData({
                        tabs_background: background_computer(new_style.common_style) + (new_tabs_background.length > 0 ? new_tabs_background : 'background:#fff'),
                    });
                } else {
                    this.tabs_background = 'background:transparent';
                }
            },
        },
        created() {
            this.init();
        },
        mounted() {
            this.$nextTick(() => {
                const self = this;
                setTimeout(() => {
                    self.getTop();
                });
                // #ifdef H5 || MP-TOUTIAO
                // 获取自定义导航栏高度
                this.setData({
                    custom_nav_height: this.propCustomNavHeight,
                });
                // #endif
            });
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
                    goods_tabs: new_data,
                    style_container: common_styles_computer(common_style),
                    tabs_style: new_tabs_style,
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
            // 获取商品距离顶部的距离
            getTop() {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select('.goods-tabs')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            this.setData({
                                tabs_top: res.top,
                            });
                        }
                    })
                    .exec();
            },
        },
    };
</script>

<style scoped lang="scss"></style>
