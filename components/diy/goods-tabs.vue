<template>
    <view class="goods-tabs ou" :class="'goods-tabs-' + propKey" :style="style_container">
        <view class="ou" :style="style_img_container">
            <componentDiyModulesTabsView :propValue="goods_tabs" :propIsTop="top_up == '1'" :propTop="propTop" :propStyle="tabs_style" :propsTabsContainer="tabs_container" :propsTabsImgContainer="tabs_img_container" :propCustomNavHeight="propCustomNavHeight * 2 + 'rpx'" :propTabsBackground="tabs_background" @onTabsTap="tabs_click_event"></componentDiyModulesTabsView>
            <view :style="shop_margin_top">
                <view :style="shop_container">
                    <view :style="shop_img_container">
                        <componentGoodsList ref="diy_goods_list" :propKey="diy_key" :propIndex="propDiyIndex" :propValue="goods_tabs" :propIsCommonStyle="false" @goods_buy_event="goods_buy_event"></componentGoodsList>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, padding_computer, margin_computer, background_computer, gradient_computer, isEmpty, radius_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    import componentGoodsList from '@/components/diy/goods-list';
    // 状态栏高度
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
                default: () => ({}),
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
            propIsImmersionModel: {
                type: Boolean,
                default: false,
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propDiyIndex: {
                type: Number,
                default: 0,
            },
            // 组件渲染的下标
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
                // 选项卡背景设置
                tabs_container: '',
                tabs_img_container: '',
                // 商品区域背景设置
                shop_margin_top: '',
                shop_container: '',
                shop_img_container: '',
                // 默认数据
                old_radius: { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 },
                old_padding: { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 },
                old_margin: { margin: 0, margin_top: 10, margin_bottom: 0, margin_left: 0, margin_right: 0 },
                // #ifdef MP
                nav_safe_space: bar_height + 5,
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                nav_safe_space: bar_height + 7,
                // #endif
                // #ifdef APP
                nav_safe_space: bar_height + 0,
                // #endif
                // 选项卡默认数据
                tabs_index: 0,
            };
        },
        watch: {
            propScrollTop(newVal) {
                if (newVal + this.propTop + this.custom_nav_height > this.tabs_top + this.nav_safe_space && this.top_up == '1') {
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
                    this.tabs_background = (new_tabs_background.length > 0 ? new_tabs_background : 'background:#fff;') + new_tabs_background_img;
                } else {
                    this.tabs_background = 'background:transparent';
                }
            },
            propKey(val) {
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
                let new_data = typeof this.propValue == 'string' ? JSON.parse(JSON.stringify(this.propValue)) : this.propValue;
                const new_content = new_data.content || {};
                const new_style = new_data.style || {};
                const new_tabs_data = new_data.content.tabs_list[this.tabs_index] || {};
                // 产品的值
                new_data.content.data_type = new_tabs_data.data_type;
                new_data.content.category = new_tabs_data.category;
                new_data.content.brand = new_tabs_data.brand;
                new_data.content.number = new_tabs_data.number;
                new_data.content.sort = new_tabs_data.sort;
                new_data.content.sort_rules = new_tabs_data.sort_rules;
                new_data.content.data_list = new_tabs_data.data_list;
                new_data.content.data_auto_list = new_tabs_data.data_auto_list;
                let tabs_style_obj = {
                    padding_top: new_style.common_style.padding_top,
                    padding_left: new_style.common_style.padding_left,
                    padding_right: new_style.common_style.padding_right,
                };
                let new_tabs_style = padding_computer(tabs_style_obj) + `position:relative;left: -${tabs_style_obj.padding_left * 2}rpx;right: -${tabs_style_obj.padding_right * 2}rpx;width:100%;`;
                // 如果是历史数据的话，就执行默认添加下边距
                if (isEmpty(new_style.tabs_padding)) {
                    new_tabs_style += 'padding-bottom: 20rpx;';
                }
                let common_style = Object.assign({}, new_style.common_style, {
                    padding_top: 0,
                });
                const { tabs_bg_color_list = [], tabs_bg_direction = '', tabs_bg_background_img_style = '', tabs_bg_background_img = [], tabs_radius = this.old_radius, tabs_padding = this.old_padding, shop_content_color_list = [], shop_content_direction = '', shop_content_background_img_style = '', shop_content_background_img = [], shop_content_margin = this.old_margin, shop_content_padding = this.old_padding, shop_content_radius = this.old_radius } = new_style;
                // 选项卡背景设置
                const tabs_data = {
                    color_list: tabs_bg_color_list,
                    direction: tabs_bg_direction,
                    background_img_style: tabs_bg_background_img_style,
                    background_img: tabs_bg_background_img,
                };
                // 商品区域背景设置
                const shop_content_data = {
                    color_list: shop_content_color_list,
                    direction: shop_content_direction,
                    background_img_style: shop_content_background_img_style,
                    background_img: shop_content_background_img,
                };
                this.setData({
                    top_up: new_content.tabs_top_up,
                    goods_tabs: new_data,
                    style_container: common_styles_computer(common_style),
                    style_img_container: common_img_computer(common_style, this.propIndex),
                    tabs_style: new_tabs_style,
                    tabs_container: gradient_computer(tabs_data) + radius_computer(tabs_radius) + 'overflow: hidden;',
                    tabs_img_container: background_computer(tabs_data) + padding_computer(tabs_padding) + 'box-sizing: border-box;overflow: hidden;',
                    shop_margin_top: 'margin-top:' + (new_style?.shop_content_spacing || 0) * 2 + 'rpx;',
                    shop_container: gradient_computer(shop_content_data) + margin_computer(shop_content_margin) + radius_computer(shop_content_radius) + 'overflow: hidden;',
                    shop_img_container: background_computer(shop_content_data) + padding_computer(shop_content_padding) + 'box-sizing: border-box;overflow: hidden;',
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
                    tabs_index: index,
                    goods_tabs: new_data,
                    diy_key: Math.random(),
                });
            },
            // 获取商品距离顶部的距离
            getTop() {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select('.goods-tabs-' + this.propKey)
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            let new_data = typeof this.propValue == 'string' ? JSON.parse(JSON.stringify(this.propValue)) : this.propValue;
                            const new_style = new_data.style || {};
                            this.setData({
                                tabs_top: res.top - (new_style.common_style?.margin_top || 0),
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
