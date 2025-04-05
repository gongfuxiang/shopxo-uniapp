<template>
    <view class="pr" :style="style_container + swiper_bg_style">
        <view class="pa top-0 wh-auto ht-auto" :style="swiper_bg_img_style"></view>
        <view class="wh-auto" :style="style_img_container + (!isEmpty(swiper_bg_img_style) ? swiper_bg_img_style_null : '')">
            <component-diy-tabs :propKey="propKey" :propContentPadding="propContentPadding" :propValue="propValue" :propTop="propTop" :propIsRotatingBackground="is_rotating_background" :propBgStyle="swiper_bg_style" :propBgImgStyle="swiper_bg_img_style" :propStickyTop="propStickyTop" :propIsImmersionModel="propIsImmersionModel" :propNewIsTabsSafeDistance="new_is_tabs_safe_distance" :propNavIsTop="propNavIsTop" :propTabsIsTop="propTabsIsTop" :propIsCommon="false" :propsTabsContainer="tabs_container" :propsTabsImgContainer="tabs_img_container" :propSpacingCommonStyle="spacing_common_style" :propTabsSlidingFixedBg="tabs_sliding_fixed_bg" @onComputerHeight="tabs_height_event" @onTabsTap="tabs_click_event"></component-diy-tabs>
            <view :style="carousel_margin_top">
                <view :style="carousel_container">
                    <view :style="carousel_img_container">
                        <component-diycarousel :propValue="propValue" :propIsCommon="false" @onVideoPlay="video_play" @slideChange="slideChange"></component-diycarousel>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, padding_computer, isEmpty, gradient_computer, margin_computer, background_computer, radius_computer, old_margin, old_padding, old_radius, old_border_and_box_shadow, border_computer, box_shadow_computer, } from '@/common/js/common/common.js';
    import componentDiyTabs from '@/pages/diy/components/diy/tabs';
    import componentDiycarousel from '@/pages/diy/components/diy/carousel';
    export default {
        components: {
            componentDiyTabs,
            componentDiycarousel,
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
                tabs_padding_style: '',
                // 选项卡内容
                tabs_container: '',
                tabs_img_container: '',
                tabs_sliding_fixed_bg: '',
                // 轮播图内容
                carousel_margin_top: '',
                carousel_container: '',
                carousel_img_container: '',
                // top_up: '0',
                actived_index: 0,
                // 轮播图背景
                swiper_bg_style: '',
                swiper_bg_img_style: '',
                swiper_bg_img_style_null: `background-image: url('')`,
                is_rotating_background: false,
                new_is_tabs_safe_distance: false,
            };
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
                const { tabs_bg_color_list = [], tabs_bg_direction = '', tabs_bg_background_img_style = '', tabs_bg_background_img = [], tabs_radius = old_radius, tabs_padding = old_padding, tabs_margin = old_margin, tabs_content = old_border_and_box_shadow, carousel_content_color_list = [], carousel_content_direction = '', carousel_content_background_img_style = '', carousel_content_background_img = [], carousel_content_margin = old_margin, carousel_content_padding = old_padding, carousel_content_radius = old_radius, carousel_content = old_border_and_box_shadow } = new_style;
                // 选项卡背景设置
                const tabs_data = {
                    color_list: tabs_bg_color_list,
                    direction: tabs_bg_direction,
                    background_img_style: tabs_bg_background_img_style,
                    background_img: tabs_bg_background_img,
                }
                // 商品区域背景设置
                const carousel_content_data = {
                    color_list: carousel_content_color_list,
                    direction: carousel_content_direction,
                    background_img_style: carousel_content_background_img_style,
                    background_img: carousel_content_background_img,
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
                    // style_container: `${common_styles_computer(common_style)};gap:${new_style.data_spacing * 2}rpx`,
                    style_container: `${common_styles_computer(new_style.common_style)};`,
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    carousel_margin_top: 'margin-top:' + new_style.data_spacing * 2 + 'rpx',
                    new_is_tabs_safe_distance: new_content.is_tabs_safe_distance == '1',
                    // 是否开启轮播图背景设置
                    is_rotating_background: new_content.rotating_background == '1',
                    tabs_sliding_fixed_bg: gradient_computer(tabs_data),
                    tabs_container: gradient_computer(tabs_data) + radius_computer(tabs_radius) + margin_computer(tabs_margin) + border_computer(tabs_content) + box_shadow_computer(tabs_content) + `overflow: hidden;margin-top: ${ new_tabs_top - tabs_margin_top }px;`,
                    tabs_img_container: background_computer(tabs_data) + padding_computer(tabs_padding) + `box-sizing: border-box;overflow: hidden;padding-top: ${ (tabs_padding?.padding_top || 0) + tabs_margin_top }px;`,
                    carousel_container: gradient_computer(carousel_content_data) + margin_computer(carousel_content_margin) + radius_computer(carousel_content_radius) + border_computer(carousel_content) + box_shadow_computer(carousel_content)  + 'overflow: hidden;',
                    carousel_img_container: background_computer(carousel_content_data) + padding_computer(carousel_content_padding) + 'box-sizing: border-box;overflow: hidden;',
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
                    },
                    swiper_bg_style: this.get_swiper_bg_style(new_content, 0),
                    swiper_bg_img_style: this.get_swiper_bg_img_style(new_content, 0),
                });
            },
            // tab点击
            tabs_click_event(tabs_id, is_micro_page) {
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
            get_swiper_bg_style(form, actived_index) {
                const style = form?.carousel_list?.[actived_index]?.style;
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
                return '';
            },
            get_swiper_bg_img_style(form, actived_index) {
                const { carousel_img, style = {} } = form?.carousel_list[actived_index] || {};
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
                return '';
            },
            slideChange(index) {
                this.setData({
                    actived_index: index,
                    swiper_bg_style: this.get_swiper_bg_style(this.propValue.content || {}, index),
                    swiper_bg_img_style: this.get_swiper_bg_img_style(this.propValue.content || {}, index),
                });
            },
        },
    };
</script>

<style scoped lang="scss"></style>
