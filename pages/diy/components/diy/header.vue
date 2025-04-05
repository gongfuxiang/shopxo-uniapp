<template>
    <view v-if="(propValue || null) !== null" class="header-container">
        <view class="header-around wh-auto" :style="roll_style + position">
            <view class="wh-auto" :style="roll_img_style">
                <view class="wh-auto ht-auto pa up_slide_bg" :style="up_slide_style">
                    <view class="wh-auto ht-auto" :style="up_slide_img_style"></view>
                </view>
                <view :style="top_content_style">
                    <view class="header-content flex-row align-s">
                        <view class="model-top flex-1 mt-1">
                            <view class="roll pr z-i">
                                <view class="model-head pr padding-left-main padding-right-main" style="box-sizing: border-box">
                                    <view class="flex-col" :style="'gap:' + data_alone_row_space">
                                        <view class="model-head-content flex-row align-c jc-sb gap-16 wh-auto pr" :style="header_style">
                                            <!-- 支付宝小程序自带返回按钮，这里就不给返回按钮了，这里给留出一点空间就行 -->
                                            <!-- #ifndef MP-ALIPAY -->
                                            <view v-if="!is_tabbar_pages && is_left_back_btn_show == '1'" class="z-i dis-inline-block margin-top-xs" @tap="top_nav_left_back_event">
                                                <iconfont name="icon-arrow-left" size="40rpx" propContainerDisplay="flex" :color="form.style.left_back_btn_color || '#333'"></iconfont>
                                            </view>
                                            <!-- #endif -->
                                            <!-- #ifdef MP-ALIPAY -->
                                            <view class="dis-inline-block padding-left-sm"></view>
                                            <!-- #endif -->
                                            <view v-if="['1', '2', '3'].includes(form.content.theme)" class="flex-1">
                                                <view class="flex-row align-c jc-c ht-auto gap-16" :class="position_class" :style="text_style + 'justify-content:' + form.content.indicator_location || 'center'">
                                                    <template v-if="['2', '3'].includes(form.content.theme)">
                                                        <view v-if="form.content.logo.length > 0" class="logo-outer-style re flex-row align-c" :data-value="form.content.link.page" @tap.stop="url_event">
                                                            <template v-if="form.style.up_slide_logo && form.style.up_slide_logo.length > 0">
                                                                <!-- 有上滑logo的处理逻辑 -->
                                                                <view v-if="(propScrollTop - 5) / (header_top + 33) < 1" class="logo-style" :style="up_slide_old_logo_style">
                                                                    <image class="logo-style" :src="form.content.logo[0].url" mode="heightFix" />
                                                                </view>
                                                                <view :class="['logo-style left-0', { pa: (propScrollTop - 5) / (header_top + 33) < 1 }]" :style="'opacity:0;' + up_slide_opacity">
                                                                    <image class="logo-style" :src="form.style.up_slide_logo[0].url" mode="heightFix" />
                                                                </view>
                                                            </template>
                                                            <template v-else>
                                                                <!-- 没有上滑logo的处理逻辑 -->
                                                                <image class="logo-style" :src="form.content.logo[0].url" mode="heightFix" />
                                                            </template>
                                                        </view>
                                                    </template>
                                                    <view v-if="['1', '2', '3'].includes(form.content.theme) && !isEmpty(form.content.title)" :data-value="form.content.link.page" @tap.stop="url_event">{{ form.content.title }}</view>
                                                    <template v-if="['3'].includes(form.content.theme) && !is_search_alone_row">
                                                        <view class="flex-1 fw-n">
                                                            <component-diy-search :propValue="form" :propIsPageSettings="true"></component-diy-search>
                                                        </view>
                                                    </template>
                                                </view>
                                            </view>
                                            <view v-else-if="['4', '5'].includes(form.content.theme)" class="flex-1 flex-row align-c">
                                                <view v-if="form.content.positioning_name_float !== '1'" class="flex-row align-c gap-2">
                                                    <view :style="location_margin">
                                                        <component-choice-location :propLocationContainerStyle="style_location_container" :propLocationImgContainerStyle="style_location_img_container" :propBaseColor="location_color" :propTextDefaultName="form.content.positioning_name" :propIsLeftIconArrow="form.content.is_location_left_icon_show == '1'" :propLeftImgValue="form.content.location_left_img" :propLeftIconValue="'icon-' + form.content.location_left_icon" :propIconLocationSize="location_left_size" :propIconArrowSize="location_right_size" :propIsRightIconArrow="form.content.is_location_right_icon_show == '1'" :propRightImgValue="form.content.location_right_img" :propRightIconValue="'icon-' + form.content.location_right_icon" :propTextMaxWidth="location_name_style" propContainerDisplay="flex" @onBack="choice_location_back"></component-choice-location>
                                                    </view>
                                                </view>
                                                <template v-if="['5'].includes(form.content.theme) && !is_search_alone_row">
                                                    <view class="flex-1">
                                                        <component-diy-search :propValue="form" :propIsPageSettings="true" :propLocationMargin="location_margin" propSearchType="header" :propLocationContainerStyle="style_location_container" :propLocationImgContainerStyle="style_location_img_container" :propBaseColor="location_color" :propIconLocationSize="location_left_size" :propIconArrowSize="location_right_size" @onBack="choice_location_back"></component-diy-search>
                                                    </view>
                                                </template>
                                            </view>
                                            <view v-if="!isEmpty(form.content.icon_setting) && !is_icon_alone_row" class="flex-row align-c z-i" :class="['1'].includes(form.content.theme) ? 'right-0' : ''" :style="{ gap: form.style.img_space * 2 + 'rpx' }">
                                                <view v-for="(item, index) in form.content.icon_setting" :key="index" class="pr" :style="{ width: form.style.img_size * 2 + 'rpx', height: form.style.img_size * 2 + 'rpx' }" :data-value="item.link.page" @tap="url_event">
                                                    <image-empty v-if="item.img.length > 0" :propImageSrc="item.img[0].url" :propErrorStyle="'width: ' + Number(form.style.img_size) * 2 + 'rpx;height:' + Number(form.style.img_size) * 2 + 'rpx;'"></image-empty>
                                                    <iconfont v-else :name="'icon-' + item.icon" :size="form.style.img_size * 2 + 'rpx'" :color="form.style.img_color" propContainerDisplay="flex"></iconfont>
                                                    <view v-if="!isEmpty(item.badge) && item.badge !== 0" class="pa badge-style">
                                                        <component-badge :propNumber="item.badge || 0"></component-badge>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                        <view v-if="is_search_alone_row || is_icon_alone_row" class="model-head-content flex-row align-c gap-16">
                                            <template v-if="['3', '5'].includes(form.content.theme) && is_search_alone_row">
                                                <view class="flex-1">
                                                    <component-diy-search :propValue="form" :propIsPageSettings="true" :propLocationMargin="location_margin" propSearchType="header" :propLocationContainerStyle="style_location_container" :propLocationImgContainerStyle="style_location_img_container" :propBaseColor="location_color" :propIconLocationSize="location_left_size" :propIconArrowSize="location_right_size" @onBack="choice_location_back"></component-diy-search>
                                                </view>
                                            </template>
                                            <view v-if="!isEmpty(form.content.icon_setting) && is_icon_alone_row" class="flex-row align-c z-i" :class="['1'].includes(form.content.theme) ? 'right-0' : ''" :style="{ gap: form.style.img_space * 2 + 'rpx' }">
                                                <view v-for="(item, index) in form.content.icon_setting" :key="index" class="pr" :style="{ width: form.style.img_size * 2 + 'rpx', height: form.style.img_size * 2 + 'rpx' }" :data-value="item.link.page" @tap="url_event">
                                                    <image-empty v-if="item.img.length > 0" :propImageSrc="item.img[0].url" :propErrorStyle="'width: ' + Number(form.style.img_size) * 2 + 'rpx;height:' + Number(form.style.img_size) * 2 + 'rpx;'"></image-empty>
                                                    <iconfont v-else :name="'icon-' + item.icon" :size="form.style.img_size * 2 + 'rpx'" :color="form.style.img_color" propContainerDisplay="flex"></iconfont>
                                                    <view v-if="!isEmpty(item.badge) && item.badge !== 0" class="pa badge-style">
                                                        <component-badge :propNumber="item.badge || 0"></component-badge>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <block v-if="!is_immersion_model">
            <view v-if="!is_positon_realative" class="nav-seat" :style="top_content_style">
                <view :style="'height:' + (is_search_alone_row || is_icon_alone_row ? 'calc(132rpx + ' + data_alone_row_space + ');' : '66rpx;')"></view>
            </view>
        </block>
        <!-- #ifndef H5 || MP-TOUTIAO -->
        <!-- <view v-if="is_positon_realative" class="wh-auto pf top-0 left-0 right-0" :style="roll_style">
            <view :style="top_content_style">
                <view :style="'height:' + (is_search_alone_row || is_icon_alone_row ? 'calc(132rpx + ' + data_alone_row_space + ');' : '66rpx;')"></view>
            </view>
        </view> -->
        <!-- #endif -->
    </view>
</template>

<script>
    const app = getApp();
    import componentDiySearch from '@/pages/diy/components/diy/search';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty';
    import componentChoiceLocation from '@/components/choice-location/choice-location';
    import componentBadge from '@/components/badge/badge';
    import { isEmpty, background_computer, gradient_computer, margin_computer, padding_computer, radius_computer } from '@/common/js/common/common.js';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        props: {
            propValue: {
                type: [String, Number, Object],
                default: '',
            },
            // 滚动距离
            propScrollTop: {
                type: Number,
                default: 0,
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
        },
        components: {
            componentDiySearch,
            imageEmpty,
            componentChoiceLocation,
            componentBadge,
        },
        data() {
            return {
                form: {},
                new_style: {},
                position: '',
                roll_style: '',
                text_style: '',
                header_style: 'max-width:100%',
                common_app_is_header_nav_fixed: 0,
                // 5,7,0 是误差，， 10 是下边距，66是高度，bar_height是不同小程序下的导航栏距离顶部的高度
                // #ifdef MP
                top_content_style: 'padding-top:' + (bar_height + 5) + 'px;padding-bottom:10px;',
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                top_content_style: 'padding-top:' + (bar_height + 7) + 'px;padding-bottom:10px;',
                // #endif
                // #ifdef APP
                top_content_style: 'padding-top:' + bar_height + 'px;padding-bottom:10px;',
                // #endif
                is_positon_realative: false,
                // 顶部背景样式类别
                header_background_type: 'color_image',
                // #ifdef MP
                header_top: bar_height + 5 + 10 + 33,
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                header_top: bar_height + 7 + 10 + 33,
                // #endif
                // #ifdef APP
                header_top: bar_height + 0 + 10 + 33,
                // #endif
                // 判断是否是沉浸模式
                is_immersion_model: false,
                up_slide_opacity: '',
                up_slide_old_logo_style: '',
                up_slide_style: '',
                up_slide_img_style: '',
                // 当前页面是否在底部菜单中
                is_tabbar_pages: app.globalData.is_tabbar_pages(),
                is_left_back_btn_show: '0',
                // 判断header的查询是否独行
                is_search_alone_row: false,
                is_icon_alone_row: false,
                data_alone_row_space: '0rpx',
                // 定位设置
                style_location_container: '',
                style_location_img_container: '',
                location_left_size: '24rpx',
                location_right_size: '24rpx',
                location_margin: '', // 悬浮之后有间距，所以要将margin设置成外padding
                location_color: '', // 定位颜色
                location_name_style: '', // 定位样式
                // 默认数据
                old_radius: { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 },
                old_padding: { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 },
                old_margin: { margin: 0, margin_top: 0, margin_bottom: 0, margin_left: 0, margin_right: 0 },
            };
        },
        watch: {
            // 监听滚动距离
            propScrollTop(newVal) {
                const { up_slide_background_color_list, up_slide_background_direction, up_slide_background_img, up_slide_background_img_style, up_slide_display } = this.propValue.style || {};
                if (up_slide_display == '1') {
                    // 渐变
                    const gradient = { color_list: up_slide_background_color_list, direction: up_slide_background_direction };
                    // 背景图
                    const back = { background_img: up_slide_background_img, background_img_style: up_slide_background_img_style };
                    const up_slide_opacity = 'opacity:' + ((newVal - 20) / this.header_top > 1 ? 1 : ((newVal - 20) / this.header_top).toFixed(2)) + ';';
                    this.up_slide_opacity = up_slide_opacity;
                    // 来的logo要比新的隐藏的快，所以要比原来的logo快一点
                    this.up_slide_old_logo_style = 'opacity:' + ((newVal - 5) / this.header_top > 1 ? 0 : (1 - (newVal - 5) / this.header_top).toFixed(2)) + ';';
                    // =0是大小误差
                    this.up_slide_style = gradient_computer(gradient) + up_slide_opacity;
                    this.up_slide_img_style = background_computer(back);
                }
            },
            propKey(val) {
                if ((this.propValue || null) !== null) {
                    this.init();
                }
            },
        },
        created() {
            // 判断是否有值初始化
            if ((this.propValue || null) !== null) {
                this.init();
            }
        },
        methods: {
            // 判断是否为空
            isEmpty,
            // 初始化
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                let new_roll_style = '';
                let new_roll_img_style = '';
                const { header_background_img, header_background_img_style, header_background_color_list, header_background_direction, header_background_type, immersive_style } = new_style;
                if (header_background_type === 'color_image') {
                    // 渐变
                    const gradient = { color_list: header_background_color_list, direction: header_background_direction };
                    // 背景图
                    const back = { background_img: header_background_img, background_img_style: header_background_img_style };
                    new_roll_style += gradient_computer(gradient);
                    new_roll_img_style += background_computer(back);
                } else {
                    new_roll_style += `background: transparent;`;
                }
                // 小程序下，获取小程序胶囊的宽度
                let menu_button_info = 'max-width:100%';
                let new_text_style = `font-weight:${new_style.header_background_title_typeface}; font-size: ${new_style.header_background_title_size * 2}rpx; color: ${new_style.header_background_title_color};`;
                // #ifndef MP-TOUTIAO
                // #ifdef MP
                // 判断是否有胶囊
                const is_current_single_page = app.globalData.is_current_single_page();
                // 如果有胶囊的时候，做处理
                if (is_current_single_page == 0) {
                    const custom = uni.getMenuButtonBoundingClientRect();
                    menu_button_info = `max-width:calc(100% - ${custom.width + 10}px);`;
                    new_text_style += `right:-${custom.width + 10}px;`;
                }
                // #endif
                // #endif
                const { location_margin = this.old_margin } = new_style;
                this.setData({
                    form: this.propValue,
                    position: new_style.up_slide_display == '1' ? 'position:fixed;' : new_style.immersive_style === '1' ? 'position:absolute;' : 'position:relative;',
                    is_positon_realative: new_style.up_slide_display == '1' ? false : true,
                    roll_style: new_roll_style,
                    roll_img_style: new_roll_img_style,
                    text_style: new_text_style,
                    is_left_back_btn_show: new_content?.is_left_back_btn_show || '1',
                    position_class: new_content.indicator_location == 'center' ? `indicator-center` : '',
                    header_style: menu_button_info,
                    header_background_type: header_background_type,
                    is_immersion_model: header_background_type !== 'color_image' && immersive_style == '1',
                    data_alone_row_space: new_style.data_alone_row_space * 2 + 'rpx',
                    is_search_alone_row: new_content.data_alone_row_value && new_content.data_alone_row_value.includes('search'),
                    is_icon_alone_row: new_content.data_alone_row_value && new_content.data_alone_row_value.includes('icon'),
                    style_location_container: this.get_style_location_container(new_style),
                    style_location_img_container: this.get_style_location_img_container(new_style),
                    location_left_size: !isEmpty(new_style.location_left_icon_size) ? new_style.location_left_icon_size * 2 + 'rpx' : '24rpx',
                    location_right_size: !isEmpty(new_style.location_right_icon_size) ? new_style.location_right_icon_size * 2 + 'rpx' : '24rpx',
                    location_color: !isEmpty(new_style.location_color) ? new_style.location_color : new_style?.position_color || '',
                    location_name_style: this.get_location_name_style(new_content),
                    location_margin: `padding: ${location_margin.margin_top * 2}rpx ${location_margin.margin_right * 2}rpx ${location_margin.margin_bottom * 2}rpx ${location_margin.margin_left * 2}rpx;`, // 悬浮之后有间距，所以要将margin设置成外padding
                });
                // this.$emit('onImmersionModelCallBack', this.is_immersion_model);
            },
            get_location_name_style(new_content) {
                const is_search_alone_row = new_content.data_alone_row_value && new_content.data_alone_row_value.includes('search');
                const is_icon_alone_row = new_content.data_alone_row_value && new_content.data_alone_row_value.includes('icon');
                let width = 0;
                if (is_search_alone_row && is_icon_alone_row) {
                    width = 200;
                } else if (is_search_alone_row || is_icon_alone_row) {
                    width = 100;
                }
                if (new_content.theme == '4') {
                    return `${(150 + width) * 2}rpx;`;
                } else {
                    return `${(100 + width) * 2}rpx;`;
                }
            },
            // 定位设置
            get_style_location_container(new_style) {
                const { location_margin = this.old_margin, location_radius = this.old_radius } = new_style;
                const style = {
                    color_list: new_style?.location_color_list || [],
                    direction: new_style?.location_direction || '',
                };
                const height = 32 - location_margin.margin_top - location_margin.margin_bottom;
                return gradient_computer(style) + radius_computer(location_radius) + `height: ${height * 2}rpx;line-height: ${height * 2}rpx;`;
            },
            // 背景图片
            get_style_location_img_container(new_style) {
                const { location_background_img = [], location_background_img_style = '2', location_border_show = '0', location_padding = this.old_padding, location_margin = this.old_margin, location_border_size = this.old_padding, location_border_color = '', location_border_style = 'solid' } = new_style;
                const style = {
                    background_img: location_background_img,
                    background_img_style: location_background_img_style,
                };
                let border = ``;
                if (location_border_show == '1') {
                    border += `border-width: ${location_border_size.padding_top}px ${location_border_size.padding_right}px ${location_border_size.padding_bottom}px ${location_border_size.padding_left}px;border-style: ${location_border_style};border-color: ${location_border_color};`;
                }
                const height = 32 - (location_margin.margin_top || 0) - (location_margin.margin_bottom || 0);
                return background_computer(style) + padding_computer(location_padding) + border + `height: ${(height > 0 ? height : 0) * 2}rpx;line-height: ${(height > 0 ? height : 0) * 2}rpx;box-sizing: border-box;`;
            },
            // 获取顶部导航高度
            get_nav_height() {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select('.article-tabs')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            this.setData({
                                tabs_top: res.top,
                            });
                        }
                    })
                    .exec();
            },
            // 位置回调
            choice_location_back(e) {
                this.$emit('onLocationBack', e);
            },
            // 打开地址
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 返回事件
            top_nav_left_back_event() {
                app.globalData.page_back_prev_event();
            },
        },
    };
</script>

<style lang="scss" scoped>
    .header-container {
        width: 100%;
        .header-around {
            z-index: 12;
        }
        .model-top {
            .roll {
                width: 100%;
                height: 100%;
                margin: 0 auto;
            }
            .img {
                width: 680rpx;
            }
        }
        .model-head {
            .model-head-content {
                height: 66rpx;
                // overflow: hidden;
                top: -1rpx;
                /* #ifdef H5 || MP-TOUTIAO */
                top: 4rpx;
                /* #endif */
            }
        }
        .model-head-icon {
            position: absolute;
            right: 0;
            bottom: 0;
            height: 66rpx;
            .function-icon {
                height: 66rpx;
            }
        }
        .logo-outer-style {
            height: 56rpx;
            .logo-style {
                height: 56rpx;
                width: 100%;
            }
        }
    }
    .indicator-center {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        top: 0;
        padding-left: 0;
    }
    .up_slide_bg {
        z-index: -1;
    }
    .badge-style {
        top: -20rpx;
        right: 5rpx;
    }
</style>
