<template>
    <!-- 文章列表  66rpx是自定义顶部导航栏的高度-->
    <uv-sticky :disabled="!propIsTop" :offset-top="propTop" :zIndex="propZIndex" :customNavHeight="custom_nav_height">
        <view class="tabs-view flex-row gap-10 jc-sb align-c" :style="propStyle + propTabsBackground">
            <view class="tabs flex-1 flex-width">
                <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'one-nav-item-' + active_index" class="wh-auto">
                    <view class="flex-row">
                        <view v-for="(item, index) in tabs_list" :key="index" :id="'one-nav-item-' + index" class="item nowrap flex-col jc-c align-c gap-4" :class="tabs_theme + (index == active_index ? ' active' : '')" :style="'margin-left:' + (index == 0 ? '0' : tabs_spacing) + 'rpx;margin-right:' + (index - 1 == tabs_list ? '0' : tabs_spacing) + 'rpx;'" :data-index="index" @tap="handle_event">
                            <view class="nowrap flex-col jc-c align-c gap-4">
                                <image v-if="!isEmpty(item.img)" :src="item.img[0].url" class="img" mode="widthFix" />
                                <view class="title" :style="index == active_index ? tabs_theme_style.tabs_title_checked : tabs_theme_style.tabs_title">{{ item.title }}</view>
                                <view class="desc" :style="tabs_theme_index == '1' && index == active_index ? tabs_check : ''">{{ item.desc }}</view>
                                <iconfont v-if="tabs_theme_index == '3' && index == active_index" name="icon-checked-smooth" class="icon" :style="tabs_theme_index == '3' && index == active_index ? icon_tabs_check : ''"></iconfont>
                                <view class="bottom_line" :class="tabs_bottom_line_theme" :style="tabs_check"></view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <iconfont v-if="propIsTabsIcon" :name="'icon-' + icon.more_icon_class || 'category-more'" :size="icon.more_icon_size + '' || '14'" :color="icon.more_icon_color || '#000'" propContainerDisplay="flex" @click="category_check_event"></iconfont>
        </view>
        <componentPopup :propShow="popup_status" :propIsBar="propIsBar" propPosition="top" :propMask="true" :propTop="tabs_top" @onclose="quick_close_event">
            <view class="padding-vertical-lg">
                <view class="padding-left-main padding-bottom-main">{{ $t('recommend-form.recommend-form.7gc30l') }}</view>
                <view class="divider-b">
                    <view class="nav-list-more">
                        <view class="flex-row flex-wrap align-c">
                            <view v-for="(item, index) in tabs_list" :key="index" class="item tc cr-base cp text-size-xs" :data-index="index" @tap="handle_event">
                                <view class="dis-inline-block padding-vertical-xs padding-horizontal-sm round" :class="active_index == index ? 'bg-main border-color-main cr-white' : ''">
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
    </uv-sticky>
</template>

<script>
    const app = getApp();
    import { gradient_computer, isEmpty } from '@/common/js/common/common.js';
    import componentPopup from '@/components/popup/popup';

    // 状态栏高度
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
            // 粘性定位距离顶部的高度
            propTop: {
                type: Number,
                default: 0,
            },
            // 指定样式
            propStyle: {
                type: String,
                default: '',
            },
            // 层级
            propZIndex: {
                type: Number,
                default: 2,
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
        },
        components: {
            componentPopup,
        },
        data() {
            return {
                tabs_theme_index: '',
                tabs_theme: '',
                tabs_check: '',
                icon_tabs_check: '',
                tabs_spacing: '',
                tabs_list: [],
                active_index: 0,
                tabs_theme_style: {
                    tabs_title_checked: '',
                    tabs_title: '',
                },
                icon: {
                    more_icon_class: '',
                    more_icon_size: '',
                    more_icon_color: '',
                },
                // 过滤弹窗
                popup_status: false,
                propIsBar: false,
                // 5,7,0 是误差，， 12 是下边距，60是高度，bar_height是不同小程序下的导航栏距离顶部的高度
                // #ifdef MP
                tabs_top: 'calc(' + (bar_height + 5 + 12) + 'px + 66rpx);',
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                tabs_top: 'calc(' + (bar_height + 7 + 12) + 'px+ 66rpx);',
                // #endif
                // #ifdef APP
                tabs_top: 'calc(' + (bar_height + 0 + 12) + 'px+ 66rpx);',
                // #endif
                custom_nav_height: '66rpx',
                tabs_bottom_line_theme: '',
            };
        },
        mounted() {
            this.init();
            // 延迟执行，等待dom渲染完成
            this.$nextTick(() => {
                this.setData({
                    custom_nav_height: this.propCustomNavHeight,
                });
            });
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
                // 标题样式
                const new_tabs_theme_style = {
                    tabs_title_checked: `font-weight: ${new_style.tabs_weight_checked};font-size: ${new_style.tabs_size_checked * 2}rpx;color:${new_style.tabs_color_checked};` + (['2', '4'].includes(this.tabs_theme_index) ? this.tabs_check : ``),
                    tabs_title: `font-weight: ${new_style.tabs_weight};font-size: ${new_style.tabs_size * 2}rpx;color:${new_style.tabs_color};`,
                };
                this.setData({
                    tabs_spacing: Number(new_style.tabs_spacing),
                    tabs_list: new_content.tabs_list,
                    // 选项卡主题
                    tabs_theme: this.get_tabs_theme(new_content),
                    tabs_theme_index: new_content.tabs_theme,
                    // 选项卡样式
                    tabs_check: new_tabs_check,
                    icon_tabs_check: `${new_tabs_check};line-height: 1;background-clip: text;-webkit-background-clip: text;-webkit-text-fill-color: transparent;`,
                    icon: new_icon,
                    tabs_theme_style: new_tabs_theme_style,
                    tabs_bottom_line_theme: new_style.tabs_one_theme == '1' ? 'tabs-bottom-line-theme' : '',
                });
            },
            // 获取选项卡主题
            get_tabs_theme(data) {
                switch (data.tabs_theme) {
                    case '1':
                        return 'tabs-style-2';
                    case '2':
                        return 'tabs-style-3';
                    case '3':
                        return 'tabs-style-4';
                    case '4':
                        return 'tabs-style-5';
                    default:
                        return 'tabs-style-1';
                }
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
                this.$emit('onTabsTap', index, tabs_list_item);
            },
            // 分类选择事件
            category_check_event() {
                this.setData({
                    popup_status: true,
                });
            },
            // 关闭分类选择事件
            quick_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .tabs {
        .item {
            padding: 0 0 10rpx 0;
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
                position: absolute;
                left: 0;
                right: 0;
                bottom: -10rpx;
                display: none;
            }
            .icon {
                position: absolute;
                // left: 0;
                // right: 0;
                bottom: 0;
                text-align: center;
                font-size: 40rpx;
                display: none;
            }
            .img {
                width: 78rpx;
                height: 78rpx;
                border-radius: 100%;
                border: 2rpx solid transparent;
                display: none;
            }
            &.tabs-style-1 {
                &.active {
                    .bottom_line {
                        display: block;
                    }
                }
                .tabs-bottom-line-theme {
                    opacity: 0.6;
                    bottom: 16rpx;
                    z-index: 0;
                    height: 14rpx;
                    border-radius: 0;
                    width: 76%;
                    left: 12%;
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
                    display: inline-block;
                }
            }
            &.tabs-style-3 {
                &.active {
                    .title {
                        background: #ff2222;
                        border-radius: 40rpx;
                        padding: 4rpx 24rpx;
                        color: #fff;
                    }
                }
            }
            &.tabs-style-4 {
                padding-bottom: 36rpx;
                &.active {
                    .title {
                        color: #ff2222;
                    }
                    .icon {
                        color: #ff2222;
                        display: block;
                    }
                }
            }
            &.tabs-style-5 {
                align-items: center;
                &.active {
                    .title {
                        font-size: 22rpx;
                        background: #ff5e5e;
                        border-radius: 40rpx;
                        padding: 4rpx 14rpx;
                        color: #fff;
                    }
                    .img {
                        border-color: #ff5e5e;
                    }
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
</style>
