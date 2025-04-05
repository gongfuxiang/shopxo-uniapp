<template>
    <!-- 文章列表 -->
    <view class="blog-tabs" :class="'blog-tabs-' + propKey" :style="style_container">
        <view :style="style_img_container">
            <component-diy-modules-tabs-view :propKey="propKey" :propValue="blog_tabs" :propIsTop="top_up == '1'" :propTop="sticky_top" :propStyle="tabs_style" :propsTabsContainer="tabs_container" :propsTabsImgContainer="tabs_img_container" :propCustomNavHeight="propIsTabsUseSafeDistance ? (propCustomNavHeight * 2 + 'rpx') : '0rpx'" :propTabsBackground="tabs_background" :propTabsSlidingFixedBg="tabs_sliding_fixed_bg" @onTabsTap="tabs_click_event"></component-diy-modules-tabs-view>
            <view :style="blog_margin_top">
                <view :style="blog_container">
                    <view :style="blog_img_container">
                        <component-diy-blog-list :propKey="diy_key" :propValue="blog_tabs" :propIsCommonStyle="false"></component-diy-blog-list>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, padding_computer, margin_computer, background_computer, gradient_computer, radius_computer, isEmpty, box_shadow_computer, border_computer, old_border_and_box_shadow, old_margin, old_padding } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/pages/diy/components/diy/modules/tabs-view';
    import componentDiyBlogList from '@/pages/diy/components/diy/blog-list'; // 状态栏高度
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
            // 距离顶部高度
            propTop: {
                type: Number,
                default: 0,
            },
            // 自定义导航栏高度
            propCustomNavHeight: {
                type: Number,
                default: 33,
            },
            // 滚动距离
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
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
            // 选项卡是否使用安全距离
            propIsTabsUseSafeDistance: {
                type: Boolean,
                default: true
            }
        },
        components: {
            componentDiyModulesTabsView,
            componentDiyBlogList,
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                style: '',
                blog_tabs: {},
                // 是否滑动置顶
                top_up: '0',
                tabs_style: '',
                tabs_top: 0,
                tabs_background: 'background:transparent',
                custom_nav_height: 33,
                diy_key: '',
                // 选项卡背景设置
                blog_margin_top: '',
                tabs_container: '',
                tabs_img_container: '',
                tabs_sliding_fixed_bg: '',
                // 商品区域背景设置
                blog_container: '',
                blog_img_container: '',
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
                sticky_top: 0,
            };
        },
        watch: {
            // 监听滚动距离
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
                this.setData({
                    diy_key: val,
                });
                // 初始化
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
            // 初始化数据
            init() {
                let new_content = this.propValue.content || {};
                let new_style = this.propValue.style || {};
                let new_data = JSON.parse(JSON.stringify(this.propValue));

                const new_tabs_data = new_data.content.tabs_list[this.tabs_index] || {};
                new_data.content.theme = new_data.content.blog_theme;
                new_data.content.data_type = new_tabs_data.data_type;
                new_data.content.category = new_tabs_data.category;
                new_data.content.carousel_col = new_data.content.blog_carousel_col;
                new_data.content.data_list = new_tabs_data.data_list;
                new_data.content.data_auto_list = new_tabs_data.data_auto_list;
                new_data.content.data_ids = new_tabs_data.data_ids;
                new_data.content.number = new_tabs_data.number;
                new_data.content.sort = new_tabs_data.sort;
                new_data.content.sort_rules = new_tabs_data.sort_rules;
                new_data.content.field_show = new_data.content.field_show;
                new_data.content.is_cover = new_tabs_data.is_cover;
                // 公共样式
                const common_style = new_style.common_style;
                let tabs_style_obj = {
                    padding_top: common_style.padding_top - this.propCustomNavHeight < 0 ? 0 : common_style.padding_top - this.propCustomNavHeight,
                    padding_left: common_style.padding_left,
                    padding_right: common_style.padding_right,
                };
                let new_tabs_style = padding_computer(tabs_style_obj) + margin_computer(tabs_style_obj) + `position:relative;left: -${tabs_style_obj.padding_left * 2}rpx;right: -${tabs_style_obj.padding_right * 2}rpx;width:100%;`;
                // 如果是历史数据的话，就执行默认添加下边距
                if (isEmpty(new_style.tabs_padding)) {
                    new_tabs_style += 'padding-bottom: 20rpx;';
                }
                const { tabs_bg_color_list = [], tabs_bg_direction = '', tabs_bg_background_img_style = '', tabs_bg_background_img = [], tabs_radius = old_radius, tabs_padding = old_padding, blog_content_color_list = [], blog_content_direction = '', blog_content_background_img_style = '', blog_content_background_img = [], blog_content_margin = old_margin, blog_content_padding = old_padding, blog_content_radius = old_radius } = new_style;
                // 选项卡背景设置
                const tabs_data = {
                    color_list: tabs_bg_color_list,
                    direction: tabs_bg_direction,
                    background_img_style: tabs_bg_background_img_style,
                    background_img: tabs_bg_background_img,
                };
                // 文章区域背景设置
                const blog_content_data = {
                    color_list: blog_content_color_list,
                    direction: blog_content_direction,
                    background_img_style: blog_content_background_img_style,
                    background_img: blog_content_background_img,
                };
                const blog_content = new_style?.blog_content || old_border_and_box_shadow;
                const tabs_content = new_style?.tabs_content || old_border_and_box_shadow;
                this.setData({
                    top_up: new_content.tabs_top_up,
                    sticky_top: this.propTop + (new_style?.tabs_margin?.margin_top || 0),
                    blog_tabs: new_data,
                    style_container: common_styles_computer(common_style) + (new_content.tabs_top_up == '1' ? 'overflow: unset;' : ''),
                    style_img_container: common_img_computer(common_style, this.propIndex) + radius_computer(common_style) +(new_content.tabs_top_up == '1' ? 'overflow: unset;' : ''),
                    tabs_style: new_tabs_style,
                    blog_margin_top:  'margin-top:' + (new_style?.blog_content_spacing || 0) * 2 + 'rpx',
                    tabs_sliding_fixed_bg: gradient_computer(tabs_data),
                    tabs_container: gradient_computer(tabs_data) + radius_computer(tabs_radius) + margin_computer(new_style?.tabs_margin || old_margin) + border_computer(tabs_content) + box_shadow_computer(tabs_content) + 'overflow: hidden;',
                    tabs_img_container: background_computer(tabs_data) + padding_computer(tabs_padding) + 'box-sizing: border-box;overflow: hidden;',
                    blog_container: gradient_computer(blog_content_data) + margin_computer(blog_content_margin) + radius_computer(blog_content_radius) + box_shadow_computer(blog_content) + border_computer(blog_content) + 'overflow: hidden;',
                    blog_img_container: background_computer(blog_content_data) + padding_computer(blog_content_padding) + 'box-sizing: border-box;overflow: hidden;',
                });
            },
            // tabs切换事件
            tabs_click_event(index) {
                let new_data = JSON.parse(JSON.stringify(this.propValue));
                new_data.content.theme = new_data.content.blog_theme;
                new_data.content.data_type = new_data.content.tabs_list[index].data_type;
                new_data.content.category = new_data.content.tabs_list[index].category;
                new_data.content.carousel_col = new_data.content.blog_carousel_col;
                new_data.content.data_list = new_data.content.tabs_list[index].data_list;
                new_data.content.data_auto_list = new_data.content.tabs_list[index].data_auto_list;
                new_data.content.data_ids = new_data.content.tabs_list[index].data_ids;
                new_data.content.number = new_data.content.tabs_list[index].number;
                new_data.content.sort = new_data.content.tabs_list[index].sort;
                new_data.content.sort_rules = new_data.content.tabs_list[index].sort_rules;
                new_data.content.field_show = new_data.content.field_show;
                new_data.content.is_cover = new_data.content.tabs_list[index].is_cover;
                this.setData({
                    tabs_index: index,
                    blog_tabs: new_data,
                    diy_key: Math.random(),
                });
            },
            // 获取商品距离顶部的距离
            getTop() {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select('.blog-tabs-' + this.propKey)
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            let new_data = typeof this.propValue == 'string' ? JSON.parse(JSON.stringify(this.propValue)) : this.propValue;
                            const new_style = new_data.style || {};
                            this.setData({
                                tabs_top: res.top - (new_style.common_style?.margin_top || 0) + (new_style?.tabs_margin?.margin_top || 0),
                            });
                        }
                    })
                    .exec();
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
