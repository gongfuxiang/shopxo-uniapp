<template>
    <!--  66rpx是自定义顶部导航栏的高度-->
    <view :class="'tabs-view ' + tabs_roll" :style="tabs_sticky">
        <view class="tabs-view" :style="propStyle + propTabsBackground">
            <view class="pr" :style="propsTabsContainer">
                <view v-if="propIsRotatingBackground" class="pa top-0 wh-auto ht-auto" :style="propBgImgStyle"></view>
                <view class="flex-row gap-10 jc-sb align-c" :style="propsTabsImgContainer">
                    <view class="tabs flex-1 flex-width">
                        <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="tabs_list_is_sliding_fixed" :scroll-left="scroll_left" :class="'wh-auto interior-area-' + propKey">
                            <view :class="'flex-row ' + flex_class" :style="'height:' + tabs_height + ';width:' + tabs_scroll_width + 'px;'">
                                <view v-for="(item, index) in tabs_list" :key="index" :class="'item nowrap flex-col jc-c align-c gap-4 scroll-item-' + propKey + ' ' + tabs_theme + (index == active_index ? ' active' : '') + ((tabs_theme_index == '0' && tabs_theme_1_style) || tabs_theme_index == '1' || tabs_theme_index == '2' ? ' pb-0' : '')" :style="'flex:0 0 auto;padding-left:' + (index == 0 ? '0' : tabs_spacing) + 'rpx;padding-right:' + (index + 1 == tabs_list.length ? '0' : tabs_spacing) + 'rpx;' + get_item_style(item.is_sliding_fixed)" :data-index="index" @tap="handle_event">
                                    <view class="nowrap ma-auto">
                                        <view v-if="tabs_theme_index == '4'" :class="'img oh pr z-i-deep ' + (!isEmpty(item.img) ? 'img-no-empty' : '')" :style="tabs_theme_style.tabs_top_img">
                                            <image-empty :propImageSrc="item.img[0]" propImgFit="aspectFit" propErrorStyle="width: 20rpx;height: 20rpx;"></image-empty>
                                            <!-- <image :src="item.img[0].url" class="img" mode="aspectFit" /> -->
                                        </view>
                                        <template v-if="item.tabs_type == '1'">
                                            <template v-if="!isEmpty(item.tabs_icon)">
                                                <view :class="tabs_theme_index == '4' ? 'title pr z-i' : 'title pr z-i-deep'" :style="(tabs_theme_index == '4' ? tabs_sign_spacing : '') + (index == active_index ? (['2', '4'].includes(tabs_theme_index) ? tabs_check : '') :  '' + tabs_padding_bottom)">
                                                    <iconfont :name="'icon-' + item.tabs_icon" :color="index == active_index ? tabs_icon_checked_color : tabs_icon_color" propContainerDisplay="flex" :size="index == active_index ? tabs_icon_checked_size : tabs_icon_size"></iconfont>
                                                </view>
                                            </template>
                                            <template v-else>
                                                <view :class="tabs_theme_index == '4' ? 'title pr z-i' : 'title pr z-i-deep'" :style="(tabs_theme_index == '4' ? tabs_sign_spacing : '') + index == active_index ? new_style.is_tabs_img_background == '1' && ['2', '4'].includes(tabs_theme_index) ? tabs_check : '' : tabs_padding_bottom">
                                                    <image-empty :propImageSrc="item.tabs_img[0]" :propStyle="index == active_index ? tabs_theme_style.tabs_img_checked : tabs_theme_style.tabs_img" propImgFit="heightFix" propErrorStyle="width: 40rpx;height: 40rpx;"></image-empty>
                                                </view>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <view :class="tabs_theme_index == '4' ? 'title pr z-i' : 'title pr z-i-deep'" :style="(tabs_theme_index == '4' ? tabs_sign_spacing : '') + (index == active_index ? ['2', '4'].includes(tabs_theme_index) ? tabs_theme_style.tabs_title_checked + tabs_check : tabs_theme_style.tabs_title_checked : tabs_theme_style.tabs_title + tabs_padding_bottom)">{{ item.title }}</view>
                                        </template>
                                        <view class="desc pr z-i wh-auto" :style="tabs_sign_spacing + (tabs_theme_index == '1' && index == active_index ? tabs_check : '')">{{ item.desc }}</view>
                                        <template v-if="tabs_theme_index == '3' && index == active_index">
                                            <template v-if="!isEmpty(form.tabs_adorn_icon)">
                                                <view class="icon pr z-i wh-auto flex-row jc-c align-c" :style="tabs_sign_spacing">
                                                    <iconfont :name="'icon-' + form.tabs_adorn_icon" :style="icon_tabs_check" propContainerDisplay="flex" :size="tabs_adorn_icon_size"></iconfont>
                                                </view>
                                            </template>
                                            <template v-else>
                                                <view class="pr z-i wh-auto flex-row jc-c align-c ma-auto" :style="tabs_sign_spacing">
                                                    <image-empty :propImageSrc="form.tabs_adorn_img[0]" :propStyle="tabs_adorn_img_style" propImgFit="aspectFit" propErrorStyle="width: 20rpx;height: 20rpx;"></image-empty>
                                                </view>
                                            </template>
                                        </template>
                                        <view class="bottom_line z-i" :class="tabs_bottom_line_theme" :style="tabs_check + tabs_sign_spacing"></view>
                                    </view>
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                    <view v-if="propIsTabsIcon && form.show_more !== '0'" :style="tabs_padding_bottom">
                        <iconfont :name="'icon-' + icon.more_icon_class || 'category-more'" :size="icon.more_icon_size + '' || '14'" :color="icon.more_icon_color || '#000'" propContainerDisplay="flex" @click="category_check_event"></iconfont>
                    </view>
                </view>
            </view>
        </view>
        <!-- 选项卡更多弹窗 -->
        <componentPopup :propShow="popup_status" :propIsBar="propIsBar" propPosition="top" :propMask="true" :propTop="newPropTop" :propStyle="newPropStyle" @onclose="quick_close_event">
            <view :class="'padding-bottom-lg ' + (['toutiao', 'app', 'h5'].includes(platform) ? 'padding-top-lg' : 'padding-top')">
                <view class="padding-left-main padding-bottom-main">全部选项卡</view>
                <view class="divider-b">
                    <view class="nav-list-more">
                        <view class="flex-row flex-wrap align-c">
                            <view v-for="(item, index) in tabs_list" :key="index" class="item tc cr-base cp text-size-xs" :data-index="index" @tap="handle_event">
                                <view class="dis-inline-block padding-vertical-xs padding-horizontal round" :class="active_index == index ? 'bg-main border-color-main cr-white' : ''">
                                    {{ item.title }}
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="tc padding-top-lg flex-row jc-c align-c" @tap="quick_close_event">
                    <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                    <iconfont name="icon-arrow-top" color="#ccc" propContainerDisplay="flex"></iconfont>
                </view>
            </view>
        </componentPopup>
    </view>
</template>

<script>
    const app = getApp();
    import { gradient_computer, isEmpty, radius_computer } from '@/common/js/common/common.js';
    import componentPopup from '@/components/popup/popup';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        components: {
            componentPopup,
            imageEmpty,
        },
        props: {
            propValue: {
                type: Object,
                default: () => {},
            },
            // 是否需要icon
            propIsTabsIcon: {
                type: Boolean,
                default: false,
            },
            // 是否需要粘性定位置顶
            propIsTop: {
                type: Boolean,
                default: false,
            },
            // 指定样式
            propStyle: {
                type: String,
                default: '',
            },
            // 层级
            propZIndex: {
                type: Number,
                default: 11,
            },
            // 自定义导航栏高度
            propCustomNavHeight: {
                type: String,
                default: '66rpx',
            },
            // tabs背景色
            propTabsBackground: {
                type: String,
                default: 'transparent',
            },
            // 置顶距离顶部高度
            propTop: {
                type: [String, Number],
                default: '0',
            },
            propsTabsContainer: {
                type: String,
                default: ''
            },
            propsTabsImgContainer: {
                type: String,
                default: '',
            },
            propIsRotatingBackground: {
                type: Boolean,
                default: false,
            },
            propBgImgStyle: {
                type: String,
                default: '',
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propTabsSlidingFixedBg: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                form: {},
                new_style: {},
                tabs_theme_index: '',
                tabs_theme: '',
                tabs_check: '',
                icon_tabs_check: '',
                tabs_spacing: '',
                tabs_sign_spacing: '',
                tabs_padding_bottom: '',
                tabs_list: [],
                active_index: 0,
                tabs_theme_style: {
                    tabs_title_checked: '',
                    tabs_title: '',
                    tabs_img_checked: '',
                    tabs_img: '',
                    tabs_top_img: ''
                },
                tabs_icon_checked_size: '',
                tabs_icon_size: '',
                tabs_icon_checked_color: '',
                tabs_icon_color: '',
                icon: {
                    more_icon_class: '',
                    more_icon_size: '',
                    more_icon_color: '',
                },
                // 过滤弹窗
                popup_status: false,
                propIsBar: false,
                tabs_bottom_line_theme: '',
                tabs_sticky: '',
                tabs_height: '100%',
                tabs_adorn_img_style: '',
                tabs_width: 0,
                tabs_scroll_width: 0,
                tabs_roll: '',
                // #ifdef MP
                sticky_top: bar_height,
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                sticky_top: bar_height,
                // #endif
                // #ifdef APP
                sticky_top: bar_height,
                // #endif
                newPropTop: '',
                newPropStyle: '',
                platform: app.globalData.application_client_type(),
                is_out_of_range: false,
                tabs_list_is_sliding_fixed: true,
                scroll_left: 0,
                tabs_adorn_icon_size: '0rpx',
                // 默认数据
                old_radius: { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 },
                old_padding: { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 },
                old_margin: { margin: 0, margin_top: 10, margin_bottom: 0, margin_left: 0, margin_right: 0 },
            };
        },
        computed: {
            flex_class() {
                if (this.is_out_of_range) {
                    return this.form.justification == 'center' ? 'jc-c' : this.form.justification == 'right' ? 'jc-e': '';
                } else {
                    return '';
                }
            },
            get_item_style() {
                return (val) => {
                    return val == '1' ? `${ this.propTabsSlidingFixedBg };position: sticky;left: 0;z-index: 11;` : ''
                }
            }
        },
        watch: {
            propValue() {
                this.init();
            },
            propIsTop: {
                deep: true,
                immediate: true,
                handler(new_val) {
                    if (new_val) {
                        this.tabs_sticky = 'position: sticky;top: calc(' + parseInt(this.propTop) + 'px + ' + this.propCustomNavHeight + ');z-index: ' + this.propZIndex + ';';
                    } else {
                        this.tabs_sticky = '';
                    }
                },
            },
            propTop(new_val, old_val) {
                if (this.propIsTop) {
                    this.tabs_sticky = 'position: sticky;top: calc(' + parseInt(this.propTop) + 'px + ' + this.propCustomNavHeight + ');z-index: ' + this.propZIndex + ';';
                } else {
                    this.tabs_sticky = '';
                }
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            // 判断是否为空
            isEmpty,
            // 初始化数据
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                const new_tabs_check = this.tabs_check_computer(new_style);
                const new_icon = {
                    more_icon_class: new_style.more_icon_class,
                    more_icon_size: new_style.more_icon_size,
                    more_icon_color: new_style.more_icon_color,
                };
                const tabs_top_img_height = new_style?.tabs_top_img_height || 39;
                const tabs_top_img_radius = new_style?.tabs_top_img_radius || { radius: 100, radius_top_left: 100, radius_top_right: 100, radius_bottom_left: 100, radius_bottom_right: 100}
                // 标题样式
                const new_tabs_theme_style = {
                    tabs_title_checked: `font-weight: ${new_style.tabs_weight_checked};font-size: ${new_style.tabs_size_checked * 2}rpx;line-height: ${new_style.tabs_size_checked * 2}rpx;color:${new_style.tabs_color_checked};`,
                    tabs_title: `font-weight: ${new_style.tabs_weight};font-size: ${new_style.tabs_size * 2}rpx;line-height: ${new_style.tabs_size * 2}rpx;color:${new_style.tabs_color};`,
                    tabs_img_checked: `height: ${(new_style?.tabs_img_height || 0) * 2}rpx;` + radius_computer(new_style?.tabs_img_radius || this.old_radius),
                    tabs_img: `height: ${(new_style?.tabs_img_height || 0) * 2}rpx;` + radius_computer(new_style?.tabs_img_radius || this.old_radius),
                    tabs_top_img: `height: ${tabs_top_img_height * 2 }rpx;width: ${tabs_top_img_height * 2 }rpx;box-sizing: border-box;` + radius_computer(tabs_top_img_radius),
                };
                const { tabs_size_checked, tabs_size, tabs_icon_size_checked = 0, tabs_icon_size = 0, tabs_img_height = 0, tabs_sign_spacing = 0 } = new_style || {};
                const new_content_tabs_list = new_content?.tabs_list || [];
                let default_height = 0;
                if (new_content.tabs_theme == '2') {
                    default_height = 12; // 选中的时候,风格二的内间距
                } else if (new_content.tabs_theme == '4') {
                    // const top_index = new_content?.tabs_list?.findIndex((item) => !isEmpty(item.img)) ?? -1;
                    // default_height = 4 + (top_index > -1 ? tabs_top_img_height + tabs_sign_spacing : 0); // 选中的时候,风格二的内间距 加上上边图片的大小和上边图片之间的间距
                    default_height = 4 + tabs_top_img_height + tabs_sign_spacing;
                }
                // 筛选出所有的icon
                const is_icon = new_content_tabs_list.findIndex((item) => item.tabs_type === '1' && !isEmpty(item.tabs_icon)) ?? -1;
                // 如果有icon，则取选中的icon大小和未选中的icon大小取最大值，作为图标的高度
                let icon_height = 0;
                if (is_icon > -1) {
                    icon_height = Math.max(tabs_icon_size_checked + default_height, tabs_icon_size);
                }
                // 筛选出所有的图片, 没有选择图标的时候默认是图片
                const is_img = new_content_tabs_list.findIndex((item) => item.tabs_type === '1' && isEmpty(item.tabs_icon)) ?? -1;
                // 选项卡高度 五个值，作为判断依据，因为图片没有未选中的大小设置，所以高度判断的时候只取选中的高度, 其余的icon和标题都分别取选中和未选中的大小对比，取出最大的值，作为选项卡的高度，避免选项卡切换时会出现抖动问题
                const height = Math.max(tabs_size_checked + default_height, tabs_size, icon_height, is_img > -1 ? (tabs_img_height + default_height) : '');
                const findIndex = new_content_tabs_list.findIndex(item => item.is_sliding_fixed == '1');
                let roll = '';
                // #ifdef H5
                let systemInfo = uni.getSystemInfoSync();
                if(/(iPhone|iPod|Android|ios|iPad)/i.test(systemInfo.platform)) {
                    roll = 'tabs_phone';
                } else {
                    roll = 'tabs_pc';
                }
                // #endif
                // 参数设置
                this.setData({
                    tabs_roll: roll,
                    form: new_content,
                    tabs_list_is_sliding_fixed: findIndex == -1,
                    newPropTop: `calc(${ this.sticky_top * 2}rpx);`,
                    newPropStyle: `padding-top: ${ this.sticky_top * 2 }rpx;margin-top: -${ this.sticky_top * 2 }rpx;`,
                    new_style: new_style,
                    tabs_spacing: Number(new_style.tabs_spacing),
                    tabs_sign_spacing: !isEmpty(new_style.tabs_sign_spacing) ? `margin-top: ${new_style.tabs_sign_spacing * 2}rpx;` : 'margin-top: 8rpx;',
                    tabs_list: new_content.tabs_list,
                    tabs_padding_bottom: this.get_padding_bottom(new_content, new_style) + 'z-index: 11;',
                    // 选项卡主题
                    tabs_theme: this.get_tabs_theme(new_content),
                    tabs_theme_index: new_content.tabs_theme,
                    // 选项卡样式
                    tabs_check: new_tabs_check,
                    icon_tabs_check: `${new_tabs_check};line-height: 1;background-clip: text;-webkit-background-clip: text;-webkit-text-fill-color: transparent;`,
                    icon: new_icon,
                    tabs_icon_checked_size: (new_style?.tabs_icon_size_checked || 0) * 2 + 'rpx',
                    tabs_icon_size: (new_style?.tabs_icon_size || 0) * 2 + 'rpx',
                    tabs_icon_checked_color: new_style?.tabs_icon_color_checked || '',
                    tabs_icon_color: new_style?.tabs_icon_color || '',
                    tabs_theme_style: new_tabs_theme_style,
                    tabs_bottom_line_theme: new_style.tabs_one_theme == '1' ? 'tabs-bottom-line-theme' : '',
                    tabs_theme_1_style: new_style.tabs_one_theme == '1',
                    tabs_height: ['2', '4'].includes(new_content.tabs_theme) ? height * 2 + 'rpx' : '100%;',
                    tabs_adorn_img_style: this.get_tabs_adorn_img_style(new_style),
                    tabs_adorn_icon_size: (new_style?.tabs_adorn_icon_size || 0) * 2 + 'rpx',
                });
                // 只有居中居右的才重新获取dom判断
                // if (['center', 'right'].includes(this.form.justification)) {
                setTimeout(() => {
                    const query = uni.createSelectorQuery().in(this);
                    query.select('.interior-area-' + this.propKey)
                        .fields({ size: true, scrollOffset: true},(res) => {
                            if ((res || null) != null) {
                                const { scrollWidth, width } = res;
                                this.setData({
                                    is_out_of_range: scrollWidth <= width,
                                    tabs_scroll_width: scrollWidth,
                                    tabs_width: width
                                });
                            }
                        })
                        .exec();
                }, 0)
                // }
            },
            get_tabs_adorn_img_style(new_style) {
                return radius_computer(new_style?.tabs_adorn_img_radius || this.old_radius) + `height: ${(new_style?.tabs_adorn_img_height || 10) * 2}rpx;${ new_style.is_tabs_adorn_img_background == '1' ? tabs_check.value : ''}`;
            },
            // 获取选项卡主题
            get_tabs_theme(data) {
                let arr = {
                    1: 'tabs-style-2',
                    2: 'tabs-style-3',
                    3: 'tabs-style-4',
                    4: 'tabs-style-5',
                };
                let value = arr[data.tabs_theme];
                return value === undefined ? 'tabs-style-1' : value;
            },
            get_padding_bottom(form, new_style) {
                let bottom = 0;
                if (form.tabs_theme == '0') {
                    if (new_style.tabs_one_theme == '1') {
                        bottom = 6;
                    } else {
                        bottom = 3;
                    }
                } else if (form.tabs_theme == '3') {
                    bottom = !isEmpty(form.tabs_adorn_icon) ? new_style.tabs_adorn_icon_size : new_style.tabs_adorn_img_height;
                }
                const tabs_sign_spacing = !isEmpty(new_style.tabs_sign_spacing) ? new_style.tabs_sign_spacing : 4;
                return ['1', '2', '4'].includes(form.tabs_theme) ? '' : `padding-bottom: ${(tabs_sign_spacing + bottom) * 2 }rpx;`;
            },
            // 选中的背景渐变色样式
            tabs_check_computer(data) {
                const new_gradient_params = {
                    color_list: data.tabs_checked,
                    direction: data.tabs_direction,
                };
                return gradient_computer(new_gradient_params);
            },

            // 事件
            // tabs切换事件
            handle_event(e) {
                const index = e.currentTarget.dataset.index;
                const tabs_list_item = this.tabs_list[index];
                this.setData({
                    active_index: index,
                    popup_status: false,
                });
                this.set_scoll_left(index);
                this.$emit('onTabsTap', index, tabs_list_item);
                setTimeout(() => {
                    this.$emit('tabsZindex', 11)
                }, 200)
            },
            // 将选中的内容定位到中间
            set_scoll_left(index) {
                const query = uni.createSelectorQuery().in(this);
                query.selectAll(`.scroll-item-` + this.propKey)
                .boundingClientRect((rect) => {
                    const tabs_index = this.form?.tabs_list?.findIndex(item => item.is_sliding_fixed == '1');
                    // 如果第一个悬浮了，就取第二个的left加上 第一个的宽度和left
                    let new_width = tabs_index == 0 && index != 0 ? rect[1].left - rect[0].width - rect[0].left : rect[0].left;
                    // 如果悬浮的不是第一个并且选中的是悬浮的内容
                    if (index > 0 && tabs_index == index) {
                        new_width = rect[0].left - rect[index + 1].left + rect[index].width; 
                    }
                    const scrollLeft =
                        rect[index].left +
                        rect[index].width / 2 -
                        this.tabs_width / 2 -
                        new_width
                    this.setData({
                        scroll_left: scrollLeft,
                    });
                })
                .exec();
            },
            // 分类选择事件
            category_check_event() {
                this.setData({
                    popup_status: true,
                });
                setTimeout(() => {
                    this.$emit('tabsZindex', 13)
                }, 0)
            },
            // 关闭分类选择事件
            quick_close_event(e) {
                this.setData({
                    popup_status: false,
                });
                setTimeout(() => {
                    this.$emit('tabsZindex', 11)
                }, 200)
            },
        },
    };
</script>
<style lang="scss" scoped>
    .tabs {
        .item {
            // padding: 0 0 10rpx 0;
            position: relative;
            &:first-of-type {
                margin-left: 0;
            }
            &:last-of-type {
                margin-right: 0;
            }
            .title {
                font-size: 28rpx;
                text-align: center;
            }
            .desc {
                font-size: 22rpx;
                color: #999;
                text-align: center;
                display: none;
            }
            .bottom_line {
                width: 100%;
                height: 6rpx;
                border-radius: 20rpx;
                background-color: red;
                // position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                display: none;
            }
            .icon {
                // position: absolute;
                bottom: 0;
                text-align: center;
                font-size: 40rpx;
                line-height: 20rpx !important;
                display: none;
            }
            .img {
                // width: 78rpx;
                // height: 78rpx;
                border-radius: 100%;
                border: 2rpx solid transparent;
                display: none;
                margin: 0 auto;
            }
            &.tabs-style-1 {
                &.active {
                    .bottom_line {
                        display: block;
                    }
                }
                .tabs-bottom-line-theme {
                    opacity: 0.6;
                    bottom: 0;
                    z-index: 0;
                    height: 14rpx;
                    border-radius: 0;
                    // left: 12%;
                }
            }
            &.tabs-style-2 {
                &.active {
                    .desc {
                        background: #ff5e5e;
                        color: #fff;
                    }
                }
                .desc {
                    border-radius: 40rpx;
                    padding: 4rpx 12rpx;
                    box-sizing: border-box;
                    display: block;
                }
            }
            &.tabs-style-3 {
                &.active {
                    .title {
                        // background: #ff2222;
                        border-radius: 40rpx;
                        padding: 6px 12px;
                        box-sizing: border-box;
                        color: #fff;
                    }
                }
            }
            &.tabs-style-4 {
                // padding-bottom: 28rpx;
                &.active {
                    .title {
                        color: #ff2222;
                    }
                    .icon {
                        color: #ff2222;
                        display: flex;
                    }
                }
            }
            &.tabs-style-5 {
                align-items: center;
                &.active {
                    .title {
                        // font-size: 22rpx;
                        // background: #ff5e5e;
                        border-radius: 40rpx;
                        padding: 2px 7px;
                        box-sizing: border-box;
                        // color: #fff;
                    }
                    .img {
                        border-color: #ff5e5e;
                    }
                }
                .img-no-empty {
                    width: 100% !important;
                }
                .img {
                    display: block;
                }
            }
        }
    }
    .nav-list-more {
        width: 100%;
        max-height: 550rpx;
        padding-bottom: 20rpx;
        overflow-y: auto;
    }
    .nav-list-more .item {
        width: 20%;
        padding: 20rpx 0;
    }
    .pb-14 {
        padding-bottom: 28rpx;
    }
    .pb-0 {
        padding-bottom: 0 !important;
    }
    .ma-auto {
        margin: auto;
    }
    
    /* #ifdef H5 */
    .tabs_phone {
        ::v-deep ::-webkit-scrollbar
        {
            width: 0rpx!important;
            height: 0rpx!important;
            background-color: #F5F5F5;
        }
    }
    .tabs_pc {
        ::v-deep ::-webkit-scrollbar
        {
            width: 5rpx!important;
            height: 5rpx!important;
            background-color: #F5F5F5;
        }
            
        /*定义滚动条轨道 内阴影+圆角*/
        ::v-deep ::-webkit-scrollbar-track {
            border-radius: 5rpx;
            background-color: #fff;
        }
            
        /*定义滑块 内阴影+圆角*/
        ::v-deep ::-webkit-scrollbar-thumb{
            border-radius: 5rpx;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: #f7f7f7;
        }
    }
    /* #endif */
</style>
