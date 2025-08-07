<template>
    <view class="pr" :style="style_container + style_active_container + swiper_bg_style">
        <view class="pa top-0 wh-auto ht-auto" :style="swiper_bg_img_style"></view>
        <view class="wh-auto" :style="style_img_container + style_active_img_container + (!isEmpty(swiper_bg_img_style) ? swiper_bg_img_style_null : '')">
            <component-diy-tabs :propKey="propKey" :propContentPadding="propContentPadding" :propValue="propValue" :propTop="propTop" :propIsRotatingBackground="is_rotating_background" :propBgStyle="swiper_bg_style" :propBgImgStyle="swiper_bg_img_style" :propStickyTop="propStickyTop" :propIsImmersionModel="propIsImmersionModel" :propNewIsTabsSafeDistance="new_is_tabs_safe_distance" :propNavIsTop="propNavIsTop" :propTabsIsTop="propTabsIsTop" :propIsCommon="false" :propsTabsContainer="tabs_container" :propsTabsImgContainer="tabs_img_container" :propSpacingCommonStyle="spacing_common_style" :propTabsSlidingFixedBg="tabs_sliding_fixed_bg" :propsIsTabsMagic="true" :propsTabsMagicStyle="tabs_magic_value_common_style" :propsTabsSlidingFixedStyle="sliding_fixed_style" @onComputerHeight="tabs_height_event" @onTabsTap="tabs_click_event"></component-diy-tabs>
            <view :style="magic_margin_top">
                <view :style="magic_container">
                    <view :style="magic_img_container">
                        <!-- 轮播 -->
                        <template v-if="tabs_magic_type == 'carousel'">
                            <component-diy-carousel :propKey="diy_key" :propValue="tabs_magic_value" :propIsCommonStyle="false" @onVideoPlay="video_play" @slideChange="slideChange"></component-diy-carousel>
                        </template>
                        <!-- 自定义 -->
                        <template v-else-if="tabs_magic_type == 'custom'">
                            <component-diy-custom :propKey="diy_key" :propValue="tabs_magic_value" :propMagicScale="magic_scale" :propIsCommonStyle="false"></component-diy-custom>
                        </template>
                        <!-- 导航组 -->
                        <template v-else-if="tabs_magic_type == 'nav_group'">
                            <component-diy-nav-group :propKey="diy_key" :propValue="tabs_magic_value" :propIsCommonStyle="false"></component-diy-nav-group>
                        </template>
                        <!-- 商品魔方 -->
                        <template v-else-if="tabs_magic_type == 'goods_magic'">
                            <component-diy-goods-magic ref="diy_goods_list" :propKey="diy_key" :propValue="tabs_magic_value" :propIsCommonStyle="false" @goods_buy_event="goods_buy_event"></component-diy-goods-magic>
                        </template>
                        <!-- 商品列表 -->
                        <template v-else-if="tabs_magic_type == 'goods_list'">
                            <component-diy-goods-list ref="diy_goods_list" :propKey="diy_key" :propValue="tabs_magic_value" :propIsCommonStyle="false" @goods_buy_event="goods_buy_event"></component-diy-goods-list>
                        </template>
                        <!-- 文章列表 -->
                        <template v-else-if="tabs_magic_type == 'article_list'">
                            <component-diy-article-list :propKey="diy_key" :propValue="tabs_magic_value" :propIsCommonStyle="false"></component-diy-article-list>
                        </template>
                        <!-- 热区 -->
                        <template v-else-if="tabs_magic_type == 'hot_zone'">
                            <component-diy-hot-zone :propKey="diy_key" :propValue="tabs_magic_value" :propIsCommonStyle="false"></component-diy-hot-zone>
                        </template>
                        <!-- 图片魔方 -->
                        <template v-else-if="tabs_magic_type == 'img_magic'">
                            <component-diy-img-magic :propKey="diy_key" :propValue="tabs_magic_value" :propIsCommonStyle="false"></component-diy-img-magic>
                        </template>
                        <!-- 视频 -->
                        <template v-else-if="tabs_magic_type == 'video'">
                            <component-diy-video :propKey="diy_key" :propValue="tabs_magic_value" :propIsCommonStyle="false"></component-diy-video>
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, padding_computer, isEmpty, gradient_computer, margin_computer, background_computer, radius_computer, old_margin, old_padding, old_radius, old_border_and_box_shadow, border_computer, box_shadow_computer, border_width} from '@/common/js/common/common.js';
    import componentDiyTabs from '@/pages/diy/components/diy/tabs';
    // 轮播图
    import componentDiyCarousel from '@/pages/diy/components/diy/carousel';
    // 商品列表
    import componentDiyGoodsList from '@/pages/diy/components/diy/goods-list';
    // 文章列表
    import componentDiyArticleList from '@/pages/diy/components/diy/article-list';
    // 商品魔方
    import componentDiyGoodsMagic from '@/pages/diy/components/diy/goods-magic';
    // 导航组
    import componentDiyNavGroup from '@/pages/diy/components/diy/nav-group';
    // 自定义
    import componentDiyCustom from '@/pages/diy/components/diy/custom';
    // 热区
    import componentDiyHotZone from '@/pages/diy/components/diy/hot-zone';
    // 图片魔方
    import componentDiyImgMagic from '@/pages/diy/components/diy/img-magic';
    // 视频
    import componentDiyVideo from '@/pages/diy/components/diy/video';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            componentDiyTabs,
            componentDiyCarousel,
            componentDiyGoodsList, 
            componentDiyArticleList,
            componentDiyGoodsMagic,
            componentDiyNavGroup,
            componentDiyCustom,
            componentDiyHotZone,
            componentDiyImgMagic,
            componentDiyVideo,
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propTop: {
                type: [String, Number],
                default: 0,
            },
            propStickyTop: {
                type: Number,
                default: 0,
            },
            // 是否导航栏置顶
            propNavIsTop: {
                type: Boolean,
                default: true,
            },
            // 是否选项卡置顶
            propTabsIsTop: {
                type: Boolean,
                default: false,
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propContentPadding: {
                type: String,
                default: '',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
            // 选项卡是否使用安全距离
            propIsImmersionModel: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                style_margin_container: '',
                spacing_common_style: {
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
                },
                // 选项卡选中的值
                tabs_active_index: 0,
                tabs_padding_style: '',
                // 选项卡内容
                tabs_container: '',
                tabs_img_container: '',
                tabs_sliding_fixed_bg: '',
                // 轮播图内容
                magic_margin_top: '',
                // top_up: '0',
                actived_index: 0,
                // 轮播图背景
                swiper_bg_style: '',
                swiper_bg_img_style: '',
                swiper_bg_img_style_null: `background-image: url('')`,
                sliding_fixed_style: '',
                new_is_tabs_safe_distance: false,
                diy_key: '',
                new_tabs_data_list: [],
            };
        },
        computed: { 
            // 当前选项卡的内容
            active_tabs_value() {
                if (!isEmpty(this.new_tabs_data_list)) {
                    return this.new_tabs_data_list[this.tabs_active_index];
                } else {
                    return {};
                }
            },
            // 当前选项卡的类型
            tabs_magic_type() {
                if (!isEmpty(this.active_tabs_value)) {
                    return this.active_tabs_value.magic_type;
                } else {
                    return '';
                }
            },
            // 当前选项卡的魔方数据
            tabs_magic_value() {
                if (!isEmpty(this.active_tabs_value)) {
                    return this.active_tabs_value[this.tabs_magic_type];
                } else {
                    return {};
                }
            },
            // 当前选中的公共样式
            tabs_magic_value_common_style() {
                if (!isEmpty(this.tabs_magic_value)) {
                    return this.tabs_magic_value.style.magic_common;
                } else {
                    return {};
                }
            },
            // 是否开启轮播图背景设置
            is_rotating_background() {
                if (!isEmpty(this.active_tabs_value)) {
                    return this.active_tabs_value.rotating_background == '1';
                } else {
                    return false;
                }
            },
            // 当前选项卡的公共样式
            style_active_container() {
                if (!isEmpty(this.tabs_magic_value_common_style)) {
                    return this.tabs_magic_value_common_style.is_show == '1' ? gradient_computer(this.tabs_magic_value_common_style) : '';
                } else {
                    return '';
                }
            },
            // 当前选项卡的公共图片样式
            style_active_img_container() {
                if (!isEmpty(this.tabs_magic_value_common_style)) {
                    return this.tabs_magic_value_common_style.is_show == '1' ? background_computer(this.tabs_magic_value_common_style) : '';
                } else {
                    return '';
                }
            },
            // 当前选项卡的内容样式
            magic_container() {
                if (!isEmpty(this.tabs_magic_value)) {
                    return common_styles_computer(this.tabs_magic_value.style.magic_content);
                } else {
                    return '';
                }
            },
            // 当前选项卡的内容样式
            magic_img_container() {
                if (!isEmpty(this.tabs_magic_value)) {
                    return common_img_computer(this.tabs_magic_value.style.magic_content);
                } else {
                    return '';
                }
            },
            magic_scale() {
                if (!isEmpty(this.tabs_magic_value)) {
                    // 获取公共样式的数据
                    const common_data = this.propValue.style.common_style;
                    const common_width = common_data.margin_left + common_data.margin_right + common_data.padding_left + common_data.padding_right + border_width(common_data);

                    const { margin_left, margin_right, padding_left, padding_right } = this.tabs_magic_value.style.magic_content;
                    const content_width = margin_left + margin_right + padding_left + padding_right + border_width(this.tabs_magic_value.style.magic_content);
                    // 根据容器宽度来计算内部大小
                    const typewidth = sys_width - content_width - common_width;
                    // 获得对应宽度的比例
                    return typewidth / 390;
                } else {
                    return 1;
                }
            }
        },
        created() {
            this.init();
        },
        // 属性值改变监听
        watch: {
            // 数据
            propTabsIsTop(value, old_value) {
                this.init();
            },
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        methods: {
            isEmpty,
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                const { tabs_bg_color_list = [], tabs_bg_direction = '', tabs_bg_background_img_style = '', tabs_bg_background_img = [], tabs_radius = old_radius, tabs_padding = old_padding, tabs_margin = old_margin, tabs_content = old_border_and_box_shadow, magic_content_color_list = [], magic_content_direction = '', magic_content_background_img_style = '', magic_content_background_img = [], magic_content_margin = old_margin, magic_content_padding = old_padding, magic_content_radius = old_radius, magic_content = old_border_and_box_shadow } = new_style;
                // 选项卡背景设置
                const tabs_data = {
                    color_list: tabs_bg_color_list,
                    direction: tabs_bg_direction,
                    background_img_style: tabs_bg_background_img_style,
                    background_img: tabs_bg_background_img,
                }
                // 头部的高度
                const newPropTop = app.globalData.rpx_to_px(this.propTop);
                // 选项卡的外边距
                const new_tabs_top = app.globalData.rpx_to_px(tabs_margin?.margin_top || 0);
                // 选项卡的实际外边距
                const tabs_margin_top = new_content.is_tabs_safe_distance == '1' ? newPropTop + this.propStickyTop : 0;
                // 选项卡的内边距处理
                const new_padding_top = new_style.common_style.padding_top - newPropTop;
                this.setData({
                    diy_key: this.propKey,
                    new_tabs_data_list: [new_content.home_data, ...new_content.tabs_list],
                    style_container: `${common_styles_computer(new_style.common_style)};`,
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    magic_margin_top: 'margin-top:' + new_style.data_spacing * 2 + 'rpx',
                    new_is_tabs_safe_distance: new_content.is_tabs_safe_distance == '1',
                    tabs_sliding_fixed_bg: gradient_computer(tabs_data),
                    tabs_container: gradient_computer(tabs_data) + radius_computer(tabs_radius) + margin_computer(tabs_margin) + border_computer(tabs_content) + box_shadow_computer(tabs_content) + `overflow: hidden;margin-top: ${ new_tabs_top - tabs_margin_top }px;`,
                    tabs_img_container: background_computer(tabs_data) + padding_computer(tabs_padding) + `box-sizing: border-box;overflow: hidden;padding-top: ${ (tabs_padding?.padding_top || 0) + tabs_margin_top }px;`,
                    spacing_common_style: {
                        padding: 0,
                        padding_top: (this.propIsImmersionModel && new_content.is_tabs_safe_distance == '1' ? new_style.common_style.padding_top + this.propStickyTop : new_padding_top > 0 ? new_padding_top : 0),
                        padding_bottom: 0,
                        padding_left: new_style.common_style.padding_left,
                        padding_right: new_style.common_style.padding_right,
                        margin: 0,
                        margin_top: new_style.common_style.margin_top,
                        margin_left: new_style.common_style.margin_left,
                        margin_right: new_style.common_style.margin_right,
                    }
                });
                setTimeout(() => {
                    this.setData({
                        swiper_bg_style: this.get_swiper_bg_style(0),
                        swiper_bg_img_style: this.get_swiper_bg_img_style(0),
                        sliding_fixed_style: this.get_sliding_fixed_style(0),
                    })
                }, 0);
            },
            // tab点击
            tabs_click_event(tabs_id, is_micro_page, index) {
                this.setData({
                    tabs_active_index: index,
                    diy_key: Math.random().toString(36).substring(2),
                })
                setTimeout(() => {
                    this.setData({
                        swiper_bg_style: this.get_swiper_bg_style(0),
                        swiper_bg_img_style: this.get_swiper_bg_img_style(0),
                        sliding_fixed_style: this.get_sliding_fixed_style(0),
                    })
                }, 0);
                this.$emit('onTabsTap', tabs_id, is_micro_page);
            },
            // tab高度
            tabs_height_event(height) {
                this.$emit('onComputerHeight', height);
            },
            // 视频播放
            video_play(url, popup_width, popup_height) {
                this.$emit('onVideoPlay', url, popup_width, popup_height);
            },
            get_sliding_fixed_style(actived_index) {
                if (this.tabs_magic_type == 'carousel') {
                    const style = this.tabs_magic_value.content?.carousel_list?.[actived_index]?.style;
                    if (style && !isEmpty(style.color_list)) {
                        const color_list = style.color_list;
                        const list = color_list.filter((item) => !isEmpty(item.color));
                        if (list.length > 0) {
                            try {
                                if (style.background_img.length > 0) {
                                    return `background: linear-gradient(90deg, rgb(255 255 255 / 0%) 0%, rgb(255 255 255 / 0%) 0%)`;
                                } else {
                                    return gradient_computer(style);
                                }
                            } catch (error) {
                                return '';
                            }
                        }
                        return '';
                    }
                }
                return '';
            },
            get_swiper_bg_style(actived_index) {
                if (this.tabs_magic_type == 'carousel') {
                    const style = this.tabs_magic_value.content?.carousel_list?.[actived_index]?.style;
                    if (style && !isEmpty(style.color_list)) {
                        const color_list = style.color_list;
                        const list = color_list.filter((item) => !isEmpty(item.color));
                        if (list.length > 0) {
                            try {
                                return gradient_computer(style);
                            } catch (error) {
                                return '';
                            }
                        }
                        return '';
                    }
                }
                return '';
            },
            get_swiper_bg_img_style(actived_index) {
                if (this.tabs_magic_type == 'carousel') {
                    const { carousel_img, style = {} } = this.tabs_magic_value.content?.carousel_list[actived_index] || {};
                    // 如果是自定义的图片 判断图片是否存在
                    if (!isEmpty(carousel_img) && style?.background_type == 'carousel') {
                        // 如果是使用轮播图，判断轮播图是否存在
                        const data = {
                            background_img: carousel_img,
                            background_img_style: style?.background_img_style || '2',
                        }
                        return background_computer(data) + (style.is_background_img_blur == '1' ? `filter: blur(14px);opacity: 0.6;` : '');
                    } else if (!isEmpty(style?.background_img)) {
                        return background_computer(style) + (style.is_background_img_blur == '1' ? `filter: blur(14px);opacity: 0.6;` : '');
                    }
                }
                return '';
            },
            slideChange(index) {
                this.setData({
                    actived_index: index,
                    swiper_bg_style: this.get_swiper_bg_style(index),
                    swiper_bg_img_style: this.get_swiper_bg_img_style(index),
                    sliding_fixed_style: this.get_sliding_fixed_style(index),
                });
            },
            goods_buy_event(index, goods = {}, params = {}, back_data = null) {
                this.$emit('goods_buy_event', index, goods, params, back_data, 'tabs');
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
