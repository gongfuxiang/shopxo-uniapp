<template>
    <view class="goods-tabs ou" :style="style_container">
        <view class="ou" :style="style_img_container">
            <componentDiyModulesTabsView :propValue="goods_tabs" :propIsTop="top_up == '1'" :propTop="propTop" :propStyle="tabs_style + 'padding-bottom:24rpx;'" :propCustomNavHeight="propCustomNavHeight * 2 + 'rpx'" :propTabsBackground="tabs_background" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
            <view class="oh">
                <componentGoodsList ref="diy_goods_list" :propkey="diy_key" :propIndex="propIndex" :propValue="goods_tabs" :propIsCommonStyle="false" @goods_buy_event="goods_buy_event"></componentGoodsList>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, padding_computer, margin_computer, background_computer, gradient_computer } from '@/common/js/common/common.js';
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
            // 顶部导航是否开启沉浸模式
            isImmersionModel: {
                type: Boolean,
                default: false,
            },
            propkey: {
                type: String,
                default: '',
            },
            propIndex: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                goods_tabs: {},
                // 是否滑动置顶
                top_up: '0',
                tabs_top: 0,
                tabs_background: 'background:transparent',
                custom_nav_height: 33,
                diy_key: '',
            };
        },
        watch: {
            propScrollTop(newVal) {
                if (newVal + this.propTop + this.custom_nav_height >= this.tabs_top && this.top_up == '1') {
                    let new_style = this.propValue.style || {};
                    let tabs_bg = new_style.common_style.color_list;
                    let new_tabs_background = '';
                    if (tabs_bg.length > 0 && (tabs_bg[0].color || null) != null) {
                        new_tabs_background = gradient_computer(new_style.common_style);
                    }
                    let new_tabs_background_img = background_computer(new_style.common_style);
                    if (new_tabs_background_img.length > 0) {
                        new_tabs_background_img += 'background-position: top left;';
                    }
                    this.setData({
                        tabs_background: (new_tabs_background.length > 0 ? new_tabs_background : 'background:#fff;') + new_tabs_background_img,
                    });
                } else {
                    this.tabs_background = 'background:transparent';
                }
            },
            propkey(val) {
                // 初始化
                this.setData({
                    diy_key: val,
                });
                this.init();
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
                    style_img_container: common_img_computer(common_style),
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
                    diy_key: Math.random(),
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
            goods_buy_event(index, goods = {}, params = {}, back_data = null) {
                this.$emit('goods_buy_event', index, goods, params, back_data);
            },
            goods_cart_back_event(e) {
                if ((this.$refs.diy_goods_list || null) != null) {
                    this.$refs.diy_goods_list.goods_cart_back_event(e);
                }
            },
        },
    };
</script>

<style scoped lang="scss"></style>
