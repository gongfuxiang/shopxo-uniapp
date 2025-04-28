<template>
    <view class="data-tabs" :class="'data-tabs-' + propKey" :style="style_container">
        <view :style="style_img_container">
            <component-diy-modules-tabs-view :propKey="propKey" :propValue="data_tabs" :propIsTop="top_up == '1'" :propTop="sticky_top" :propStyle="tabs_style" :propsTabsContainer="tabs_container" :propsTabsImgContainer="tabs_img_container" :propCustomNavHeight="propIsTabsUseSafeDistance ? (propCustomNavHeight * 2 + 'rpx') : '0rpx'" :propTabsSlidingFixedBg="tabs_sliding_fixed_bg" :propTabsBackground="tabs_background" @onTabsTap="tabs_click_event"></component-diy-modules-tabs-view>
            <view :style="data_margin_top">
                <view :style="data_container">
                    <view :style="data_img_container">
                        <template v-if="tabs_data_type == 'goods'">
                            <view class="oh" :style="data_content_container">
                                <view class="oh" :style="data_content_img_container">
                                    <component-diy-goods-list ref="diy_goods_list" :propKey="diy_key" :propDiyIndex="propDiyIndex" :propValue="tabs_list" :propIsCommonStyle="false" @goods_buy_event="goods_buy_event"></component-diy-goods-list>
                                </view>
                            </view>
                        </template>
                        <template v-else-if="tabs_data_type == 'article'">
                            <view class="oh" :style="data_content_container">
                                <view class="oh" :style="data_content_img_container">
                                    <component-diy-article-list :propKey="diy_key" :propValue="tabs_list" :propIsCommonStyle="false"></component-diy-article-list>
                                </view>
                            </view>
                        </template>
                        <view v-show="tabs_data_type == 'custom'" class="wh-auto ht-auto">
                            <component-diy-custom-list :propKey="diy_key" :propTabsDataType="tabs_data_type" :propValue="tabs_list" :propOuterContainerPadding="outer_container_width" :propIsCommonStyle="false"></component-diy-custom-list>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, padding_computer, margin_computer, background_computer, gradient_computer, isEmpty, old_border_and_box_shadow, old_margin, old_radius, old_padding, border_computer, box_shadow_computer, radius_computer, get_math } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/pages/diy/components/diy/modules/tabs-view';
    import componentDiyGoodsList from '@/pages/diy/components/diy/goods-list';
    import componentDiyArticleList from '@/pages/diy/components/diy/article-list';
    import componentDiyCustomList from '@/pages/diy/components/diy/custom';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        components: {
            componentDiyModulesTabsView,
            componentDiyGoodsList,
            componentDiyArticleList,
            componentDiyCustomList,
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
            // 选项卡是否使用安全距离
            propIsTabsUseSafeDistance: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                data_tabs: {},
                tabs_list: {},
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
                data_margin_top: '',
                data_container: '',
                data_img_container: '',
                // #ifdef MP
                nav_safe_space: bar_height + 5,
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                nav_safe_space: bar_height + 7,
                // #endif
                // #ifdef APP
                nav_safe_space: bar_height + 0,
                // #endif
                tabs_style: '',
                // 选项卡默认数据
                tabs_index: 0,
                sticky_top: 0,
                tabs_data_type: 'goods',
                outer_container_width: 0,
                // 数据样式
                data_content_container: '',
                data_content_img_container: '',
                tabs_sliding_fixed_bg: '',
                // 滑动固定的背景
                tabs_sliding_fixed_bg: '',
                data_content_style: {
                    color_list: [{ color: '', color_percentage: undefined }],
                    direction: '180deg',
                    background_img_style: '2',
                    background_img: [],
                    radius: 0,
                    radius_top_left: 0,
                    radius_top_right: 0,
                    radius_bottom_left: 0,
                    radius_bottom_right: 0,
                    padding: 0,
                    padding_top: 0,
                    padding_bottom: 0,
                    padding_left: 0,
                    padding_right: 0,
                    margin: 0,
                    margin_top: 0,
                    margin_bottom: 0,
                    margin_left: 0,
                    margin_right: 0,
                    // 边框样式
                    border_is_show: '0',
                    border_color: '#FF3F3F',
                    border_style: 'solid',
                    border_size: {
                        padding: 1,
                        padding_top: 1,
                        padding_right: 1,
                        padding_bottom: 1,
                        padding_left: 1,
                    },
                    // 阴影
                    box_shadow_color: '',
                    box_shadow_x: 0,
                    box_shadow_y: 0,
                    box_shadow_blur: 0,
                    box_shadow_spread: 0,
                }
            };
        },
        watch: {
            propScrollTop(newVal) {
                if (newVal + this.sticky_top + this.custom_nav_height > this.tabs_top + this.nav_safe_space && this.top_up == '1') {
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
            propTop(val) {
                this.init();
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
                // 公共样式
                const common_style = new_style.common_style;
                let tabs_style_obj = {
                    padding_top: (common_style.padding_top - this.propCustomNavHeight) < 0 ? 0 : common_style.padding_top - this.propCustomNavHeight,
                    padding_left: common_style.padding_left,
                    padding_right: common_style.padding_right,
                };
                let new_tabs_style = padding_computer(tabs_style_obj) + `position:relative;left: -${tabs_style_obj.padding_left * 2}rpx;right: -${tabs_style_obj.padding_right * 2}rpx;width:100%;`;
                // 如果是历史数据的话，就执行默认添加下边距
                if (isEmpty(new_style.tabs_padding)) {
                    new_tabs_style += 'padding-bottom: 20rpx;';
                }

                const { tabs_bg_color_list = [], tabs_bg_direction = '', tabs_bg_background_img_style = '', tabs_bg_background_img = [], tabs_radius = old_radius, tabs_padding = old_padding, data_content_color_list = [], data_content_direction = '', data_content_background_img_style = '', data_content_background_img = [], data_content_margin = old_margin, data_content_padding = old_padding, data_content_radius = old_radius } = new_style;
                // 选项卡背景设置
                const tabs_data = {
                    color_list: tabs_bg_color_list,
                    direction: tabs_bg_direction,
                    background_img_style: tabs_bg_background_img_style,
                    background_img: tabs_bg_background_img,
                };
                // 商品区域背景设置
                const data_content_data = {
                    color_list: data_content_color_list,
                    direction: data_content_direction,
                    background_img_style: data_content_background_img_style,
                    background_img: data_content_background_img,
                };
                const data_content = new_style?.data_content || old_border_and_box_shadow;
                const tabs_content = new_style?.tabs_content || old_border_and_box_shadow;
                //显示的数据处理
                this.tabs_click_event(this.tabs_index);
                this.setData({
                    top_up: new_content.tabs_top_up,
                    sticky_top: this.propTop + (new_style?.tabs_margin?.margin_top || 0),
                    data_tabs: new_data,
                    // 自定义需要做等比缩放，因此宽度需要减去 外层通用的宽度和内容区域的宽度
                    outer_container_width: common_style.margin_left + common_style.margin_right + common_style.padding_left + common_style.padding_right + new_style.data_content_margin.margin_left + new_style.data_content_margin.margin_right + new_style.data_content_padding.padding_left + new_style.data_content_padding.padding_right,
                    style_container: common_styles_computer(common_style) + (new_content.tabs_top_up == '1' ? 'overflow: unset;' : ''),
                    style_img_container: common_img_computer(common_style, this.propIndex) + radius_computer(common_style) +(new_content.tabs_top_up == '1' ? 'overflow: unset;' : ''),
                    tabs_style: new_tabs_style,
                    tabs_sliding_fixed_bg: gradient_computer(tabs_data),
                    tabs_container: gradient_computer(tabs_data) + radius_computer(tabs_radius) + margin_computer(new_style?.tabs_margin || old_margin) + border_computer(tabs_content) + box_shadow_computer(tabs_content) + 'overflow: hidden;',
                    tabs_img_container: background_computer(tabs_data) + padding_computer(tabs_padding) + 'box-sizing: border-box;overflow: hidden;',
                    data_margin_top: 'margin-top:' + (new_style?.data_content_spacing || 0) * 2 + 'rpx;',
                    data_container: gradient_computer(data_content_data) + margin_computer(data_content_margin) + radius_computer(data_content_radius) + box_shadow_computer(data_content) + border_computer(data_content) + 'overflow: hidden;',
                    data_img_container: background_computer(data_content_data) + padding_computer(data_content_padding) + 'box-sizing: border-box;overflow: hidden;',
                });
            },
            tabs_click_event(index) {
                let new_data = JSON.parse(JSON.stringify(this.propValue));
                // 显示的数据处理
                const tabs_data_list = new_data.content.tabs_list[index] || {};
                const tabs_data_type = tabs_data_list?.tabs_data_type || '';
                let tabs_list = {};
                // 内容样式
                let data_content_container = '';
                let data_content_img_container = '';
                if (tabs_data_type === 'goods') {
                    tabs_list = tabs_data_list.goods_config;
                    const new_style = tabs_data_list.goods_config.style;
                    // 内容样式
                    data_content_container = common_styles_computer(new_style?.data_content_style || this.data_content_style);
                    data_content_img_container = common_img_computer(new_style?.data_content_style || this.data_content_style);
                } else if (tabs_data_type === 'article') {
                    tabs_list = tabs_data_list.article_config;
                    const new_style = tabs_data_list.article_config.style;
                    // 内容样式
                    data_content_container = common_styles_computer(new_style?.data_content_style || this.data_content_style);
                    data_content_img_container = common_img_computer(new_style?.data_content_style || this.data_content_style);
                } else if (tabs_data_type === 'custom') {
                    tabs_list = tabs_data_list.custom_config;
                }
                this.setData({
                    tabs_data_type: tabs_data_type,
                    tabs_index: index,
                    tabs_list: tabs_list,
                    data_content_container: data_content_container,
                    data_content_img_container: data_content_img_container,
                    diy_key: get_math(),
                });
            },
            // 获取商品距离顶部的距离
            getTop() {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select('.data-tabs-' + this.propKey)
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
