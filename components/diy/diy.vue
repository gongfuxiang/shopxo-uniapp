<template>
    <view :style="page_style">
        <view :style="page_img_style">
            <scroll-view :scroll-y="true" class="ht" @scroll="on_scroll_event" @scrolltolower="on_scroll_lower_event" @scrolltoupper="on_scroll_upper_event" lower-threshold="60" scroll-with-animation="true">
                <!-- 头部小程序兼容 -->
                <view class="pr header">
                    <componentDiyHeader :propKey="header_data.id" :propValue="header_data.com_data" :propScrollTop="head_scroll_top" @onImmersionModelCallBack="immersion_model_call_back" @onLocationBack="choice_location_back"></componentDiyHeader>
                </view>
                <view :style="content_padding">
                    <view class="content flex-col" :style="'padding-top:' + (temp_is_header_top ? temp_header_top : '0')">
                        <view v-for="item in tabs_data" :key="item.key">
                            <template v-if="item.is_enable == '1'">
                                <componentDiyTabs v-if="item.key == 'tabs'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propContentPadding="content_padding" :propValue="item.com_data" :propTop="temp_header_top" :propNavIsTop="is_header_top" :propTabsIsTop="temp_is_header_top" @onComputerHeight="tabs_height_event" @onTabsTap="tabs_click_event"></componentDiyTabs>
                                <componentDiyTabsCarousel v-else-if="item.key == 'tabs-carousel'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propContentPadding="content_padding" :propValue="item.com_data" :propTop="temp_header_top" :propScrollTop="scroll_top" :propTabsIsTop="temp_is_header_top" :propCustomNavHeight="!is_immersion_model && is_header_top ? (is_search_alone_row ? 66 + data_alone_row_space : 33) : 0" @onComputerHeight="tabs_height_event" @onTabsTap="tabs_click_event" @onVideoPlay="video_play"></componentDiyTabsCarousel>
                            </template>
                        </view>
                        <template v-if="is_tabs_type">
                            <template v-if="diy_data.length > 0">
                                <view v-for="(item, index) in diy_data" :key="index" :style="'margin-top:' + (['float-window'].includes(item.key) ? '0rpx;z-index:1' : -(item.com_data.style.common_style.floating_up * 2 || 0) + 'rpx;z-index:' + (!isEmpty(item.com_data.style.common_style.module_z_index) ? item.com_data.style.common_style.module_z_index : 0))">
                                    <!-- 基础组件 -->
                                    <template v-if="item.is_enable == '1'">
                                        <componentDiySearch v-if="item.key == 'search'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiySearch>
                                        <componentDiyCarousel v-else-if="item.key == 'carousel'" :propOuterContainerPadding="outer_container_padding" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data" @onVideoPlay="video_play"></componentDiyCarousel>
                                        <componentDiyNavGroup v-else-if="item.key == 'nav-group'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyNavGroup>
                                        <componentDiyUserInfo v-else-if="item.key == 'user-info'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyUserInfo>
                                        <componentDiyNotice v-else-if="item.key == 'notice'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyNotice>
                                        <componentDiyVideo v-else-if="item.key == 'video'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyVideo>
                                        <componentDiyArticleList v-else-if="item.key == 'article-list'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyArticleList>
                                        <componentDiyArticleTabs v-else-if="item.key == 'article-tabs'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data" :propTop="(!is_immersion_model ? temp_sticky_top : 0) + tabs_height" :propScrollTop="scroll_top" :propCustomNavHeight="!is_immersion_model && is_header_top ? (is_search_alone_row ? 66 + data_alone_row_space : 33) : 0"></componentDiyArticleTabs>
                                        <componentDiyGoodsTabs v-else-if="item.key == 'goods-tabs'" :ref="'diy_goods_buy' + index" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propDiyIndex="index" :propKey="item.id + index" :propValue="item.com_data" :propTop="(!is_immersion_model ? temp_sticky_top : 0) + tabs_height" :propScrollTop="scroll_top" :propCustomNavHeight="!is_immersion_model && is_header_top ? (is_search_alone_row ? 66 + data_alone_row_space : 33) : 0" @goods_buy_event="goods_buy_event"></componentDiyGoodsTabs>
                                        <componentDiyGoodsList v-else-if="item.key == 'goods-list'" :ref="'diy_goods_buy' + index" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propDiyIndex="index" :propKey="item.id + index" :propValue="item.com_data" @goods_buy_event="goods_buy_event"></componentDiyGoodsList>
                                        <componentDiyDataMagic v-else-if="item.key == 'data-magic'" :propOuterContainerPadding="outer_container_padding" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyDataMagic>
                                        <componentDiyCustom v-else-if="item.key == 'custom'" :propOuterContainerPadding="outer_container_padding" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyCustom>
                                        <componentDiyImgMagic v-else-if="item.key == 'img-magic'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyImgMagic>
                                        <componentDiyHotZone v-else-if="item.key == 'hot-zone'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyHotZone>
                                        <componentDiySeckill v-else-if="item.key == 'seckill'" :propOuterContainerPadding="outer_container_padding" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiySeckill>
                                        <!-- 插件 -->
                                        <componentDiyCoupon v-else-if="item.key == 'coupon'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyCoupon>
                                        <!-- 工具组件 -->
                                        <componentDiyFloatWindow v-else-if="item.key == 'float-window'" :propKey="item.id + index" :propValue="item.com_data"></componentDiyFloatWindow>
                                        <componentDiyTitle v-else-if="item.key == 'title'" :propKey="item.id + index" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propValue="item.com_data"></componentDiyTitle>
                                        <componentDiyAuxiliaryLine v-else-if="item.key == 'row-line'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyAuxiliaryLine>
                                        <componentDiyRichText v-else-if="item.key == 'rich-text'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyRichText>
                                        <componentDiyAuxiliaryBlank v-else-if="item.key == 'auxiliary-blank'" :propIndex="is_immersive_style_and_general_safe_distance_value ? item.index : -1" :propKey="item.id + index" :propValue="item.com_data"></componentDiyAuxiliaryBlank>
                                    </template>
                                </view>
                            </template>

                            <!-- diy底部卡槽 -->
                            <slot name="diy-bottom-content"></slot>
                            <slot name="diy-bottom-common"></slot>
                        </template>
                        <template v-else>
                            <!-- 商品九宫格列表 -->
                            <view v-if="goods_list.length > 0" class="padding-horizontal-main padding-top-main oh">
                                <component-goods-list :propData="{ style_type: goods_show_type_value, goods_list: goods_list, random: random_value }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol"></component-goods-list>
                            </view>
                            <view v-else class="pr">
                                <!-- 提示信息 -->
                                <component-no-data :propStatus="goods_list_loding_status" :propMsg="goods_list_loding_msg" propLoadingLogoTop="30%"></component-no-data>
                            </view>

                            <!-- diy底部卡槽 -->
                            <template v-if="goods_bottom_line_status">
                                <slot name="diy-bottom-content"></slot>
                            </template>
                            <slot name="diy-bottom-common"></slot>
                        </template>

                        <view class="z-i-deep">
                            <!-- 商品购买 -->
                            <component-goods-buy ref="goods_buy" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>
                            <!-- 视频播放 -->
                            <uni-popup ref="popup" type="center" border-radius="20rpx" :mask-click="false">
                                <view class="flex-col align-c jc-c gap-10">
                                    <video :src="video_src" id="carousel_video" :autoplay="true" :controls="true" show-fullscreen-btn class="radius-md" :style="{ width: popup_width, height: popup_height }"></video>
                                    <iconfont name="icon-qiandao-tancguanbi" size="56rpx" color="#ccc" propContainerDisplay="flex" @tap="video_close"></iconfont>
                                </view>
                            </uni-popup>
                        </view>
                    </view>
                </view>
                <!-- 当前diy页面底部菜单（非公共底部菜单） -->
                <block v-if="is_show_footer == 1">
                    <componentDiyFooter :propKey="footer_data.id" :propValue="footer_data.com_data" @onFooterHeight="footer_height_value_event"></componentDiyFooter>
                    <view v-if="footer_height_value > 0" :style="'height:' + footer_height_value + 'rpx;'"></view>
                </block>

                <!-- 底部卡槽 -->
                <slot name="bottom"></slot>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, background_computer, padding_computer } from '@/common/js/common/common.js';
    import componentDiyHeader from '@/components/diy/header';
    import componentDiyFooter from '@/components/diy/footer';
    import componentDiyTabs from '@/components/diy/tabs';
    import componentDiySearch from '@/components/diy/search';
    import componentDiyCarousel from '@/components/diy/carousel';
    import componentDiyUserInfo from '@/components/diy/user-info';
    import componentDiyNotice from '@/components/diy/notice';
    import componentDiyVideo from '@/components/diy/video';
    import componentDiyArticleList from '@/components/diy/article-list';
    import componentDiyArticleTabs from '@/components/diy/article-tabs';
    import componentDiyHotZone from '@/components/diy/hot-zone';
    import componentDiyCoupon from '@/components/diy/coupon';
    import componentDiyFloatWindow from '@/components/diy/float-window';
    import componentDiyTitle from '@/components/diy/title';
    import componentDiyAuxiliaryLine from '@/components/diy/auxiliary-line';
    import componentDiyRichText from '@/components/diy/rich-text';
    import componentDiyAuxiliaryBlank from '@/components/diy/auxiliary-blank';
    import componentDiyNavGroup from '@/components/diy/nav-group';
    import componentDiyGoodsList from '@/components/diy/goods-list';
    import componentDiyGoodsTabs from '@/components/diy/goods-tabs';
    import componentDiyDataMagic from '@/components/diy/data-magic';
    import componentDiyCustom from '@/components/diy/custom';
    import componentDiyImgMagic from '@/components/diy/img-magic';
    import componentDiySeckill from '@/components/diy/seckill';
    import componentDiyTabsCarousel from '@/components/diy/tabs-carousel';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentSearch from '@/components/search/search';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);

    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        name: 'diy',
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propDataId: {
                type: [String, Number],
                default: '',
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
        },
        components: {
            componentDiyHeader,
            componentDiyFooter,
            componentDiyTabs,
            componentDiySearch,
            componentDiyCarousel,
            componentDiyUserInfo,
            componentDiyNotice,
            componentDiyVideo,
            componentDiyArticleList,
            componentDiyArticleTabs,
            componentDiyHotZone,
            componentDiyCoupon,
            componentDiyAuxiliaryLine,
            componentDiyRichText,
            componentDiyFloatWindow,
            componentDiyTitle,
            componentDiyAuxiliaryBlank,
            componentDiyNavGroup,
            componentDiyGoodsList,
            componentDiyGoodsTabs,
            componentDiyDataMagic,
            componentDiyCustom,
            componentDiyImgMagic,
            componentDiySeckill,
            componentDiyTabsCarousel,
            componentGoodsList,
            componentNoData,
            componentBottomLine,
            componentGoodsBuy,
            componentSearch,
        },
        data() {
            return {
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
                // 是否有选项卡
                is_tabs: false,
                // 是否是模块数据或者是九宫格商品分类样式数据， 默认模块数据
                is_tabs_type: true,
                // 是否开启沉浸模式
                is_immersion_model: false,

                // 5,7,0 是误差，， 10 是下边距，66是高度，bar_height是不同小程序下的导航栏距离顶部的高度
                // #ifdef MP
                sticky_top: bar_height + 5 + 10,
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                sticky_top: bar_height + 7 + 10,
                // #endif
                // #ifdef APP
                sticky_top: bar_height + 0 + 10,
                // #endif
                header_top: '',
                temp_sticky_top: 0,
                temp_header_top: '0px',
                is_header_top: false,
                temp_is_header_top: false,
                scroll_top: 0,
                // 选项卡高度
                tabs_height: 0,

                header_data: {},
                footer_data: {},
                // 选项卡数据
                tabs_data: {},
                diy_data: [],
                page_style: '',
                page_img_style: '',
                is_show_footer: 0,
                tabs_home_id: this.propDataId,
                // 商品列表
                goods_list: [],
                goods_total: 0,
                goods_page_total: 0,
                goods_page: 1,
                // 数据展示样式（0图文、1九方格）
                goods_show_type_value: 1,
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
                // 标签插件
                plugins_label_data: null,
                goods_list_loding_status: 1,
                goods_list_loding_msg: '',
                goods_bottom_line_status: false,
                // 判断数据是否在加载中
                data_is_loading: 0,
                // 缓存key
                cache_key: app.globalData.data.cache_diy_data_key,
                // 底部导航高度
                footer_height_value: 0,
                // 商品ref索引
                goods_index: 0,
                // 视频播放逻辑
                video_src: '',
                popup_width: '0rpx',
                popup_height: '0rpx',
                // 顶部导航是否换行
                is_search_alone_row: false,
                data_alone_row_space: 0,
                content_padding: '',
                outer_container_padding: 0,

                // 滚动延迟器
                head_scroll_top: 0,
                scroll_throttle_timeout: null,
            };
        },
        watch: {
            propKey(val) {
                // 如果当前存在别的diy或者商品分类tabs则不更新数据
                if ((this.tabs_id || null) == null) {
                    // 初始化
                    this.init();
                }
            },
        },
        created() {
            // 初始化配置
            this.init_config();

            // 初始化
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    // 是否显示底部菜单，如果当前地址已经存在系统底部菜单中则不显示当前diy页面自定义的底部菜单
                    var is_show_footer = parseInt(this.propValue.header.com_data.content.bottom_navigation_show || 0) == 1;
                    var is_tabbar = app.globalData.is_tabbar_pages();
                    this.setData({
                        is_show_footer: is_show_footer && !is_tabbar,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                const { header = {}, diy_data = [], tabs_data = [] } = this.propValue;
                let header_style = header.com_data.style;
                let new_diy_index = 0;
                let new_tabs_data = [];
                let new_diy_data = [];
                if (tabs_data.length > 0) {
                    tabs_data.forEach((item) => {
                        // 修改item的内容
                        item = this.get_index_content(new_diy_index, header, header_style, item);
                        new_tabs_data.push(item);
                        new_diy_index++;
                    });
                    new_diy_data = diy_data;
                } else {
                    new_tabs_data = tabs_data;
                    // 过滤数据
                    diy_data.forEach((item) => {
                        // 判断是否是商品列表
                        if (item.com_name == 'float-window') {
                            item.index = -1;
                        } else {
                            // 修改item的内容
                            item = this.get_index_content(new_diy_index, header, header_style, item);
                            new_diy_data.push(item);
                            new_diy_index++;
                        }
                    });
                }
                const { padding_right = 0, padding_left = 0 } = header.com_data.style.common_style;
                // tabs选项卡数据过滤
                this.setData({
                    header_data: header,
                    footer_data: this.propValue.footer,
                    diy_data: new_diy_data,
                    tabs_data: new_tabs_data,
                    page_style: common_styles_computer(header.com_data.style.common_style),
                    page_img_style: background_computer(header.com_data.style.common_style),
                    // 内间距
                    content_padding: `padding: 0px ${padding_right}px 0px ${padding_left}px;` + 'box-sizing:border-box;',
                    outer_container_padding: padding_right + padding_left,
                    // 判断顶部导航是否置顶
                    is_header_top: parseInt(header.com_data.style.up_slide_display) == 1 ? true : false,
                    temp_sticky_top: this.sticky_top,
                    temp_header_top: `calc(${this.sticky_top}px + 66rpx + ${parseInt(header.com_data.content.data_alone_row_value.length > 0 ? header.com_data.style.data_alone_row_space || 5 : 0) * 2}rpx + ${header.com_data.content.data_alone_row_value.length > 0 ? '66rpx' : '0rpx'});`,
                    header_top: `calc(${this.sticky_top}px + 66rpx + ${parseInt(header.com_data.content.data_alone_row_value.length > 0 ? header.com_data.style.data_alone_row_space || 5 : 0) * 2}rpx + ${header.com_data.content.data_alone_row_value.length > 0 ? '66rpx' : '0rpx'});`,
                    // 顶部导航高度是否变化--------------------------------------------------
                    is_search_alone_row: header.com_data.content.data_alone_row_value.length > 0 ? true : false,
                    data_alone_row_space: parseInt(header.com_data.style.data_alone_row_space || 5),
                    is_immersive_style_and_general_safe_distance_value: header_style.immersive_style == '1' && header_style.general_safe_distance_value == '1',
                });
                // 缓存数据
                uni.setStorageSync(this.cache_key + this.tabs_home_id, diy_data);
            },
            // 顶部导航沉浸模式回调
            immersion_model_call_back(bool) {
                this.setData({
                    is_immersion_model: bool,
                });
            },
            get_index_content(new_diy_index, header, header_style, item) {
                item.index = new_diy_index;
                if (new_diy_index == 0) {
                    // 判断是否开启沉浸模式和是否开启安全距离 如果为true则除了选项卡和选项卡轮播外， 第一个组件则加上安全距离样式的padding_top加上顶部导航的高度和安全距离的高度
                    if (header_style.immersive_style == '1' && header_style.general_safe_distance_value == '1') {
                        let new_data = JSON.parse(JSON.stringify(item));
                        // 顶部导航的高度
                        let header_top_height = (header.com_data.content.data_alone_row_value.length > 0 ? parseInt(header.com_data.style.data_alone_row_space || 5) : 0) + 33 + (header.com_data.content.data_alone_row_value.length > 0 ? 33 : 0);
                        new_data.com_data.style.common_style.padding_top = parseInt(new_data.com_data.style.common_style.padding_top) + header_top_height;
                        return new_data;
                    }
                    return item;
                }
                return item;
            },
            // 选项卡回调更新数据
            tabs_click_event(tabs_id, bool, params = {}) {
                let new_data = [];
                this.setData({
                    is_tabs_type: bool,
                    tabs_id: tabs_id,
                });
                let new_params = {
                    ...params,
                    id: tabs_id,
                };
                if (tabs_id) {
                    new_data = uni.getStorageSync(this.cache_key + tabs_id) || [];
                    if (new_data.length > 0) {
                        // 先使用缓存数据展示
                        this.setData({
                            diy_data: new_data,
                        });
                        // 已有本地缓存则直接取远程有效数据（默认首次取的是远程缓存数据）
                        new_params['is_cache'] = 0;
                    }
                    // diy数据
                    if (bool) {
                        uni.showLoading({
                            title: this.$t('common.loading_in_text'),
                            mask: true,
                        });
                        uni.request({
                            url: app.globalData.get_request_url('index', 'diy'),
                            method: 'POST',
                            data: new_params,
                            dataType: 'json',
                            success: (res) => {
                                uni.hideLoading();
                                // 数据处理
                                let data = res.data.data.data;
                                if (res.data.code == 0) {
                                    new_data = data?.config.diy_data || [];
                                    uni.setStorageSync(this.cache_key + tabs_id, new_data);
                                    this.setData({
                                        diy_data: new_data,
                                    });
                                    // 是否需要重新加载数据
                                    if (parseInt(data.is_result_data_cache || 0) == 1) {
                                        this.tabs_click_event(tabs_id, bool, { is_cache: 0 });
                                    }
                                } else {
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast(this.$t('common.internet_error_tips'));
                            },
                        });
                    } else {
                        this.setData({
                            goods_page: 1,
                            goods_list: [],
                            goods_list_loding_status: 1,
                            goods_bottom_line_status: false,
                        });
                        this.get_goods_list(1);
                    }
                } else {
                    if (tabs_id == '') {
                        new_data = uni.getStorageSync(this.cache_key + this.tabs_home_id) || [];
                    }
                    // 先使用缓存数据展示
                    this.setData({
                        diy_data: new_data,
                    });
                }
            },
            // 选项卡高度
            tabs_height_event(height) {
                let new_tabs_height = 0;
                // 判断是否有选项卡切选项卡数组数据内的字段is_enable值是否为1
                if (this.tabs_data.length > 0) {
                    this.tabs_data.forEach((item, index) => {
                        if (item.is_enable == '1') {
                            new_tabs_height = height;
                        }
                    });
                }
                this.setData({
                    tabs_height: new_tabs_height,
                });
            },

            // 滚动加载
            on_scroll_lower_event(e) {
                if (!this.is_tabs_type) {
                    this.get_goods_list();
                }
            },
            // 滚动到顶部
            on_scroll_upper_event() {
                setTimeout(() => {
                    this.head_scroll_top = 0;
                });
            },

            // 查询商品
            get_goods_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.goods_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                });

                // 获取数据
                if (this.goods_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                let new_data = {
                    category_id: this.tabs_id,
                    page: this.goods_page,
                };
                // 九宫格数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'search'),
                    method: 'POST',
                    data: new_data,
                    dataType: 'json',
                    success: (res) => {
                        if (this.goods_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.goods_page <= 1) {
                                    var temp_goods_list = data.data;
                                } else {
                                    var temp_goods_list = this.goods_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_goods_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    goods_list: temp_goods_list,
                                    random_value: Math.random(),
                                    goods_total: data.total,
                                    goods_page_total: data.page_total,
                                    goods_list_loding_status: 3,
                                    goods_list_loding_msg: '',
                                    goods_page: this.goods_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    goods_bottom_line_status: this.goods_page > 1 && this.goods_page > this.goods_page_total,
                                });
                            } else {
                                this.setData({
                                    goods_list_loding_status: 0,
                                    goods_list_loding_msg: res.data.msg,
                                    goods_total: 0,
                                    data_is_loading: 0,
                                });
                                if (this.goods_page <= 1) {
                                    this.setData({
                                        goods_list: [],
                                        goods_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                goods_list_loding_status: 0,
                                goods_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                            app.globalData.is_login_check(res.data, this, 'get_goods_list', is_mandatory);
                        }
                    },
                    fail: () => {
                        if (this.goods_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            goods_list_loding_status: 2,
                            goods_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_is_loading: 0,
                        });
                    },
                });
            },

            // 页面滚动事件
            on_scroll_event(e) {
                const scroll_num = parseInt(e.detail.scrollTop);
                if (scroll_num <= 20) {
                    this.head_scroll_top = 0;
                } else {
                    if (scroll_num / (this.sticky_top + 33) <= 1) {
                        // 更新数据的逻辑
                        this.head_scroll_top = scroll_num;
                    } else {
                        this.head_scroll_top = this.sticky_top + 100;
                    }
                }

                // 判断顶部导航是否置顶
                // #ifdef H5 || MP-TOUTIAO
                if (!this.is_header_top) {
                    if (scroll_num >= this.sticky_top + 33 + (this.is_search_alone_row ? 0 : 33 + this.data_alone_row_space)) {
                        this.temp_sticky_top = 0;
                        this.temp_header_top = 0;
                        this.temp_is_header_top = true;
                    } else {
                        this.temp_header_top = this.header_top;
                        this.temp_sticky_top = this.sticky_top;
                        this.temp_is_header_top = false;
                    }
                }
                // #endif
                this.scroll_timer_compute(scroll_num);
            },

            scroll_timer_compute(scroll_num) {
                // 使用节流技术减少事件触发的处理次数
                if (!this.scroll_throttle_timeout) {
                    const self = this;
                    this.scroll_throttle_timeout = setTimeout(() => {
                        this.scroll_top = scroll_num;
                        // 清除定时器
                        this.scroll_throttle_timeout = null;
                    }, 20); // 可以根据实际情况调整延时时间
                }
            },

            // 底部菜单高度
            footer_height_value_event(value) {
                this.setData({
                    footer_height_value: value * 2 + 20,
                });
            },
            // 商品数量更新回调
            goods_buy_event(index, goods = {}, params = {}, back_data = null) {
                if ((this.$refs.goods_buy || null) != null) {
                    this.goods_index = index;
                    this.$refs.goods_buy.init(goods, params, back_data);
                }
            },
            // 商品加购回调
            goods_cart_back_event(e) {
                if ((this.$refs[`diy_goods_buy${this.goods_index}`][0] || null) != null) {
                    this.$refs[`diy_goods_buy${this.goods_index}`][0].goods_cart_back_event(e);
                }
            },
            // 视频播放
            video_play(url, width, height) {
                this.setData({
                    video_src: url,
                    popup_width: width,
                    popup_height: height,
                });
                this.$refs.popup.open();
                const videoContext = uni.createVideoContext('carousel_video');
                if (!isEmpty(videoContext)) {
                    videoContext.play();
                }
            },
            // 视频关闭
            video_close() {
                const videoContext = uni.createVideoContext('carousel_video');
                if (!isEmpty(videoContext)) {
                    videoContext.pause();
                }
                this.$refs.popup.close();
            },
            // 位置回调
            choice_location_back(e) {
                // 如果存在tabs_id则表示当前有选择tab数据则仅当前模块更新，无需给上级回调位置
                if ((this.tabs_id || null) == null) {
                    this.$emit('onLocationBack', e);
                } else {
                    this.tabs_click_event(this.tabs_id, this.is_tabs_type);
                }
            },
        },
    };
</script>

<style lang="scss" scoped></style>
