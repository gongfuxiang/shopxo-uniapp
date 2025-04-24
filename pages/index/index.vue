<template>
    <view :class="theme_view">
        <view :class="(plugins_mourning_data_is_app ? ' grayscale' : '') + (is_single_page == 1 ? ' single-page-top' : '')">
            <!-- diy模式 -->
            <block v-if="data_mode == 3">
                <block v-if="(data_list || null) != null && (data_list.config || null) != null">
                    <component-diy :propValue="data_list.config" :propDataId="data_list.id" :propKey="random_value" @onLocationBack="user_back_choice_location">
                        <!-- 由于diy组件异步加载、默认先加载骨架屏展示 -->
                        <component-no-data propStatus="1" :propLoadingUseSkeleton="true" propPage="home"></component-no-data>
                        <!-- 底部内容 -->
                        <template slot="diy-bottom-content">
                            <!-- 结尾 -->
                            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                            <!-- 版权信息 -->
                            <component-copyright></component-copyright>
                        </template>
                        <!-- 底部公共 -->
                        <template slot="diy-bottom-common">
                            <component-common ref="common" :propIsGrayscale="plugins_mourning_data_is_app"></component-common>
                        </template>
                    </component-diy>
                </block>
                <block v-else>
                    <component-no-data propStatus="0" propPage="home"></component-no-data>
                </block>
            </block>
            <!-- 自动和手动模式 -->
            <block v-else>
                <!-- 顶部内容、如果没有轮播和导航则使用矮的浮动导航背景样式，则使用高的背景样式 -->
                <view v-if="load_status == 1" class="home-top-nav-content pr" :style="(banner_list.length > 0 || navigation.length > 0 ? top_content_bg_color : top_content_search_bg_color) + top_content_style">
                    <!-- 顶部背景图片 -->
                    <view class="pa top-0 left-0 right-0">
                        <image class="bg-img wh-auto" mode="widthFix" :src="static_url + 'nav-top.png'"></image>
                    </view>

                    <!-- 搜索 -->
                    <view v-if="common_app_is_header_nav_fixed == 1" :class="'search-fixed-seat ' + (common_app_is_enable_search == 1 ? 'nav-enable-search' : '')"></view>
                    <view :class="'pr ' + (common_app_is_header_nav_fixed == 1 ? 'search-content-fixed' : '')" :style="common_app_is_header_nav_fixed == 1 ? top_content_search_bg_color : ''">
                        <view :class="'search-content-fixed-content ' + (common_app_is_enable_search == 1 ? 'nav-enable-search' : '')" :style="(common_app_is_header_nav_fixed == 1 ? top_content_style : '') + (common_app_is_header_nav_fixed == 1 ? top_content_search_content_style : '')">
                            <view class="home-top-nav margin-bottom-sm pr padding-right-main">
                                <!-- 定位 -->
                                <view v-if="is_home_location_choice == 1" class="home-top-nav-location dis-inline-block va-m single-text cr-white pr bs-bb padding-left-main padding-right-lg">
                                    <component-choice-location @onBack="user_back_choice_location"></component-choice-location>
                                </view>
                                <block v-else>
                                    <!-- logo/标题 -->
                                    <view class="home-top-nav-logo dis-inline-block va-m padding-left-main">
                                        <block v-if="is_home_logo_use_text == 0 && (application_logo || null) != null">
                                            <image :src="application_logo" mode="heightFix" class="home-top-nav-logo-image"></image>
                                        </block>
                                        <block v-else>
                                            <view v-if="(application_title || null) != null" class="home-top-nav-logo-title cr-white single-text">{{ application_title }}</view>
                                        </block>
                                    </view>
                                </block>
                                <!-- #ifdef H5 || APP -->
                                <!-- 右上角icon列表 -->
                                <view v-if="(right_icon_list || null) != null && right_icon_list.length > 0" class="nav-top-right-icon fr">
                                    <block v-for="(item, index) in right_icon_list">
                                        <view class="item dis-inline-block cp pr" :data-value="item.url || ''" @tap="url_event">
                                            <iconfont :name="item.icon" size="38rpx" color="#fff"></iconfont>
                                            <view v-if="(item.badge || null) != null" class="badge-icon pa">
                                                <component-badge :propNumber="item.badge"></component-badge>
                                            </view>
                                        </view>
                                    </block>
                                </view>
                                <!-- #endif -->
                            </view>
                            <view v-if="common_app_is_enable_search == 1" class="search-content-input padding-horizontal-main">
                                <!-- 是否开启搜索框前面icon扫一扫 -->
                                <block v-if="is_home_search_scan == 1">
                                    <component-search :propIsBtn="true" propSize="sm" :propPlaceholder="$t('customview.customview.726k7y')" propPlaceholderClass="cr-grey-c" propIconColor="#999" propBgColor="#fff"
                                        <!-- #ifndef H5 -->
                                        @onicon="search_icon_event" propIcon="icon-scan" :propIsIconOnEvent="true"
                                        <!-- #endif -->
                                    ></component-search>
                                </block>
                                <block v-else>
                                    <component-search :propIsBtn="true" propSize="sm" :propPlaceholder="$t('customview.customview.726k7y')" propPlaceholderClass="cr-grey-c" propIconColor="#999" propBgColor="#fff"></component-search>
                                </block>
                            </view>
                        </view>
                    </view>

                    <!-- 轮播 -->
                    <view class="banner-content padding-horizontal-main margin-top-xs" v-if="banner_list.length > 0">
                        <component-banner :propData="banner_list" @changeBanner="change_banner"></component-banner>
                    </view>
                    <!-- 导航 -->
                    <view v-if="navigation.length > 0" class="spacing-mt" :class="load_status == 1 && (common_shop_notice || null) != null ? '' : ' spacing-mb'">
                        <view class="padding-horizontal-main">
                            <view class="bg-white border-radius-main">
                                <component-icon-nav :propData="{ ...{ data: navigation }, ...{ random: random_value } }"></component-icon-nav>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 内容 -->
                <view class="content padding-horizontal-main pr">
                    <!-- 商城公告 -->
                    <view v-if="load_status == 1 && (common_shop_notice || null) != null" class="notice">
                        <uni-notice-bar show-icon scrollable :text="common_shop_notice" background-color="transparent" color="#666" />
                    </view>
                    <!-- 推荐文章 -->
                    <view v-if="article_list.length > 0" class="article-list padding-main border-radius-main oh bg-white spacing-mb">
                        <view mode="aspectFit" class="new-icon va-m fl cp pr divider-r" data-value="/pages/article-category/article-category" @tap="url_event">
                            <text>{{ $t('index.index.t8bll8') }}</text
                            ><text class="cr-red">{{ $t('index.index.t8bll9') }}</text>
                        </view>
                        <view class="right-content fr va-m">
                            <swiper :vertical="true" :autoplay="true" :circular="true" display-multiple-items="1" interval="3000">
                                <block v-for="(item, index) in article_list" :key="index">
                                    <swiper-item class="single-text">
                                        <text class="cr-base text-size-sm cp" :data-value="item.category_url" @tap="url_event">[{{ item.article_category_name }}]</text>
                                        <text class="cr-base text-size-sm margin-left-xs cp" :style="(item.title_color || null) != null ? 'color:' + item.title_color + ' !important;' : ''" :data-value="item.url" @tap="url_event">{{ item.title }}</text>
                                    </swiper-item>
                                </block>
                            </swiper>
                        </view>
                    </view>

                    <!-- 按照插件顺序渲染插件数据 -->
                    <block v-if="plugins_sort_list.length > 0">
                        <block v-for="(pv, pi) in plugins_sort_list" :key="pi">
                            <!-- 首页中间广告 - 插件 -->
                            <view v-if="pv.plugins == 'homemiddleadv' && (plugins_homemiddleadv_data || null) != null && plugins_homemiddleadv_data.length > 0" class="plugins-homemiddleadv oh spacing-mb">
                                <view v-for="(item, index) in plugins_homemiddleadv_data" :key="index" class="item border-radius-main oh cp" :data-value="item.url || ''" @tap="url_event">
                                    <image class="dis-block wh-auto border-radius-main" :src="item.images" mode="widthFix"> </image>
                                </view>
                            </view>

                            <!-- 限时秒杀 - 插件 -->
                            <view v-if="pv.plugins == 'seckill' && (plugins_seckill_data || null) != null && (plugins_seckill_data.data || null) != null && (plugins_seckill_data.data.goods || null) != null && plugins_seckill_data.data.goods.length > 0" class="plugins-seckill-data border-radius-main spacing-mb bg-white" :style="'background-image: url(' + plugins_seckill_data.data.home_bg + ');'">
                                <view class="flex-row jc-sb align-c padding-top-main padding-horizontal-main">
                                    <view class="flex-1">
                                        <image class="dis-inline-block va-m icon" :src="plugins_seckill_data.data.home_title_icon" mode="widthFix"></image>
                                        <view class="dis-inline-block va-m margin-left-sm">
                                            <component-countdown :propHour="plugins_seckill_data.data.time.hours" :propMinute="plugins_seckill_data.data.time.minutes" :propSecond="plugins_seckill_data.data.time.seconds"></component-countdown>
                                        </view>
                                    </view>
                                    <text data-value="/pages/plugins/seckill/index/index" @tap="url_event" class="arrow-right padding-right cr-grey text-size-xs cp">{{ $t('common.more') }}</text>
                                </view>
                                <component-goods-list :propData="{ style_type: 2, goods_list: plugins_seckill_data.data.goods }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true" propSource="index" :propOpenCart="false"></component-goods-list>
                            </view>

                            <!-- 活动配置-楼层顶部 - 插件 -->
                            <view v-if="pv.plugins == 'activity' && (plugins_activity_data || null) != null">
                                <component-activity-list :propConfig="plugins_activity_data.base" :propData="plugins_activity_data.data" propLocation="0" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true" propSource="index"></component-activity-list>
                            </view>

                            <!-- 门店 - 插件 -->
                            <view v-if="pv.plugins == 'realstore' && (plugins_realstore_data || null) != null">
                                <view v-if="(plugins_realstore_data.base.home_data_list_title || null) != null" class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                    <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ plugins_realstore_data.base.home_data_list_title }}</text>
                                    <text data-value="/pages/plugins/realstore/search/search" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                                </view>
                                <component-realstore-list :propData="{ ...{ data: plugins_realstore_data.data }, ...{ random: random_value } }"></component-realstore-list>
                            </view>

                            <!-- 多商户 - 插件 -->
                            <view v-if="pv.plugins == 'shop' && (plugins_shop_data || null) != null">
                                <view v-if="(plugins_shop_data.base.home_data_list_title || null) != null" class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                    <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ plugins_shop_data.base.home_data_list_title }}</text>
                                    <text data-value="/pages/plugins/shop/index/index" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                                </view>
                                <component-shop-list :propConfig="plugins_shop_data.base" :propData="{ ...{ data: plugins_shop_data.data }, ...{ random: random_value } }"></component-shop-list>
                            </view>

                            <!-- 组合搭配 - 插件 -->
                            <view v-if="pv.plugins == 'binding' && (plugins_binding_data || null) != null">
                                <view v-if="(plugins_binding_data.base.home_data_list_title || null) != null" class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                    <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ plugins_binding_data.base.home_data_list_title }}</text>
                                    <text data-value="/pages/plugins/binding/index/index" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                                </view>
                                <component-binding-list :propConfig="plugins_binding_data.base" :propData="{ ...{ data: plugins_binding_data.data }, ...{ random: random_value } }" :propCurrencySymbol="currency_symbol"></component-binding-list>
                            </view>

                            <!-- 博客-楼层顶部 - 插件 -->
                            <view v-if="pv.plugins == 'blog' && (plugins_blog_data || null) != null">
                                <component-blog-list :propConfig="plugins_blog_data.base" :propData="plugins_blog_data.data" propLocation="0"></component-blog-list>
                            </view>

                            <!-- 魔方 - 插件 -->
                            <view v-if="pv.plugins == 'magic' && (plugins_magic_data || null) != null">
                                <component-magic-list :propData="{ ...plugins_magic_data, ...{ random: random_value } }" :propCurrencySymbol="currency_symbol" :propLabel="plugins_label_data"></component-magic-list>
                            </view>
                        </block>
                    </block>

                    <!-- 楼层数据 -->
                    <block v-if="(data_list || null) != null && data_list.length > 0">
                        <!-- 数据模式0,1自动+手动、2拖拽 -->
                        <block v-if="data_mode == 2">
                            <!-- 引入拖拽数据模块 -->
                            <component-layout :propData="data_list"></component-layout>
                        </block>
                        <block v-else>
                            <!-- 自动+手动 -->
                            <view v-for="(floor, index) in data_list" :key="index" class="floor">
                                <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                    <view class="title-left">
                                        <text class="text-wrapper title-left-border" :style="'color:' + (floor.bg_color || '#333') + ';'">{{ floor.name }}</text>
                                        <text v-if="(floor.describe || null) != null" class="vice-name margin-left-lg cr-grey">{{ floor.describe }}</text>
                                    </view>
                                    <text :data-value="'/pages/goods-search/goods-search?category_id=' + floor.id" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                                </view>
                                <view class="floor-list wh-auto oh pr">
                                    <block v-if="(floor.goods || null) != null && floor.goods.length > 0">
                                        <component-goods-list :propData="{ style_type: 1, goods_list: floor.goods }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true" propSource="index"></component-goods-list>
                                    </block>
                                </view>
                            </view>
                        </block>
                    </block>

                    <!-- 按照插件顺序渲染插件数据 -->
                    <block v-if="plugins_sort_list.length > 0">
                        <block v-for="(pv, pi) in plugins_sort_list" :key="pi">
                            <!-- 活动配置-楼层底部 - 插件 -->
                            <view v-if="pv.plugins == 'activity' && (plugins_activity_data || null) != null">
                                <component-activity-list :propConfig="plugins_activity_data.base" :propData="plugins_activity_data.data" propLocation="1" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" propSource="index" :propOpenCart="false"></component-activity-list>
                            </view>

                            <!-- 博客-楼层底部 - 插件 -->
                            <view v-if="pv.plugins == 'blog' && (plugins_blog_data || null) != null">
                                <component-blog-list :propConfig="plugins_blog_data.base" :propData="plugins_blog_data.data" propLocation="1"></component-blog-list>
                            </view>

                            <!--- 底部购买记录 - 插件 -->
                            <view v-if="pv.plugins == 'salerecords' && (plugins_salerecords_data || null) != null && (plugins_salerecords_data.data || null) != null && plugins_salerecords_data.data.length > 0" class="plugins-salerecords bg-white border-radius-main padding-main spacing-mb">
                                <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                    <view class="title-left">
                                        <text class="text-wrapper">{{ plugins_salerecords_data.base.home_bottom_title || $t('index.index.s5r784') }}</text>
                                        <text v-if="(plugins_salerecords_data.base || null) != null && (plugins_salerecords_data.base.home_bottom_desc || null) != null" class="vice-name margin-left-sm cr-grey-9">{{ plugins_salerecords_data.base.home_bottom_desc }}</text>
                                    </view>
                                </view>
                                <view class="oh">
                                    <swiper :vertical="true" :autoplay="true" :circular="true" :display-multiple-items="plugins_salerecords_data.data.length < 6 ? plugins_salerecords_data.data.length : 6" interval="3000" :style="plugins_salerecords_data.data.length < 6 ? 'height:' + plugins_salerecords_data.data.length * 84.33 + 'rpx;' : ''">
                                        <block v-for="(item, index) in plugins_salerecords_data.data" :key="index">
                                            <swiper-item>
                                                <view class="item oh padding-vertical-main">
                                                    <view class="item-content single-text fl">
                                                        <image mode="widthFix" :src="item.user.avatar" class="va-m br"> </image>
                                                        <text class="margin-left-sm">{{ item.user.user_name_view }}</text>
                                                        <text v-if="(item.user.province || null) != null"><text class="padding-left-xs padding-right-xs">-</text>{{ item.user.province }}</text>
                                                    </view>
                                                    <view class="item-content fl">
                                                        <view :data-value="item.goods_url" @tap="url_event" class="cp single-text">
                                                            <image mode="widthFix" :src="item.images" class="va-m br"> </image>
                                                            <text class="margin-left-sm single-text">{{ item.title }}</text>
                                                        </view>
                                                    </view>
                                                    <view class="item-content single-text fr tr cr-grey padding-top-xs">
                                                        {{ item.add_time }}
                                                    </view>
                                                </view>
                                            </swiper-item>
                                        </block>
                                    </swiper>
                                </view>
                            </view>
                        </block>
                    </block>
                </view>
            </block>

            <!-- 提示信息 -->
            <block v-if="load_status == 0">
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" propPage="home" :propIsHeader="true"></component-no-data>
            </block>
        </view>

        <!-- 页面已加载、模式 -->
        <block v-if="load_status == 1 && data_mode != 3">
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 版权信息 -->
            <component-copyright></component-copyright>

            <!-- 在线客服 -->
            <component-online-service :propIsNav="true" :propIsBar="true" :propIsGrayscale="plugins_mourning_data_is_app"></component-online-service>

            <!-- 快捷导航 -->
            <component-quick-nav :propIsNav="true" :propIsBar="true" :propIsGrayscale="plugins_mourning_data_is_app"></component-quick-nav>

            <!-- 公共 -->
            <component-common ref="common" :propIsGrayscale="plugins_mourning_data_is_app"></component-common>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentSearch from '@/components/search/search';
    import componentQuickNav from '@/components/quick-nav/quick-nav';
    import componentIconNav from '@/components/icon-nav/icon-nav';
    import componentBanner from '@/components/slider/slider';
    import componentCountdown from '@/components/countdown/countdown';
    import componentLayout from '@/pages/design/components/layout/layout';
    import componentBadge from '@/components/badge/badge';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentCopyright from '@/components/copyright/copyright';
    import componentOnlineService from '@/components/online-service/online-service';
    import componentActivityList from '@/pages/plugins/activity/components/activity-list/activity-list';
    import componentBlogList from '@/pages/plugins/blog/components/blog-list/blog-list';
    import componentRealstoreList from '@/pages/plugins/realstore/components/realstore-list/realstore-list';
    import componentShopList from '@/pages/plugins/shop/components/shop-list/shop-list';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentBindingList from '@/pages/plugins/binding/components/binding-list/binding-list';
    import componentMagicList from '@/pages/plugins/magic/components/magic-list/magic-list';
    import componentDiy from '@/pages/diy/components/diy/diy';
    import componentChoiceLocation from '@/components/choice-location/choice-location';

    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        data() {
            return {
                theme_view: '',
                theme_color: '',
                common_static_url: '',
                seckill_static_url: '',
                static_url: '',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                load_status: 0,
                currency_symbol: app.globalData.currency_symbol(),
                is_home_search_scan: app.globalData.data.is_home_search_scan,
                data_list: [],
                banner_list: [],
                navigation: [],
                article_list: [],
                cart_total: 0,
                message_total: 0,
                right_icon_list: [],
                // 首页数据模式
                data_mode: 0,
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
                // 基础配置
                common_shop_notice: null,
                common_app_is_enable_search: 0,
                common_app_is_header_nav_fixed: 0,
                common_app_is_online_service: 0,
                // 顶部导航、名称、logo、定位
                application_title: app.globalData.data.application_title,
                application_logo: app.globalData.data.application_logo,
                is_home_logo_use_text: app.globalData.data.is_home_logo_use_text,
                is_home_location_choice: app.globalData.data.is_home_location_choice,
                // 顶部+搜索样式配置
                top_content_bg_color: '',
                top_content_search_bg_color: '',
                top_content_search_content_style: '',
                // #ifdef MP
                top_content_style: 'padding-top:' + (bar_height + 10) + 'px;',
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                top_content_style: 'padding-top:' + (bar_height + 14) + 'px;',
                // #endif
                // #ifdef APP
                top_content_style: 'padding-top:' + bar_height + 'px;',
                // #endif
                // 是否单页预览
                is_single_page: app.globalData.is_current_single_page() || 0,
                // 轮播滚动时，背景色替换
                slider_bg: null,
                // 插件顺序列表
                plugins_sort_list: [],
                // 限时秒杀插件
                plugins_seckill_data: null,
                // 购买记录插件
                plugins_salerecords_data: null,
                // 活动配置插件
                plugins_activity_data: null,
                // 标签插件
                plugins_label_data: null,
                // 首页中间广告插件
                plugins_homemiddleadv_data: null,
                // 哀悼灰度插件
                plugins_mourning_data_is_app: app.globalData.is_app_mourning(),
                // 标签插件
                plugins_blog_data: null,
                // 门店插件
                plugins_realstore_data: null,
                // 多商户插件
                plugins_shop_data: null,
                // 组合搭配插件
                plugins_binding_data: null,
                // 魔方插件
                plugins_magic_data: null,
            };
        },

        components: {
            componentCommon,
            componentSearch,
            componentQuickNav,
            componentIconNav,
            componentBanner,
            componentCountdown,
            componentLayout,
            componentBadge,
            componentNoData,
            componentBottomLine,
            componentCopyright,
            componentOnlineService,
            componentActivityList,
            componentBlogList,
            componentRealstoreList,
            componentShopList,
            componentGoodsList,
            componentBindingList,
            componentMagicList,
            componentDiy,
            componentChoiceLocation,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 初始化配置
            if(app.globalData.get_config('status') == 1) {
                app.globalData.init_config(0, this, 'init_config', true);
            } else {
                app.globalData.is_config(this, 'init_config');
            }

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show({object: this, method: 'init'});
            }

            // 设置顶部导航的默认颜色
            this.set_navigation_bar_color();
        },

        // 下拉刷新
        onPullDownRefresh() {
            if (this.data_list_loding_status === 1) {
                uni.stopPullDownRefresh();
            } else {
                this.init();
            }
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        common_shop_notice: app.globalData.get_config('config.common_shop_notice'),
                        common_app_is_enable_search: app.globalData.get_config('config.common_app_is_enable_search'),
                        common_app_is_header_nav_fixed: app.globalData.get_config('config.common_app_is_header_nav_fixed'),
                        common_app_is_online_service: app.globalData.get_config('config.common_app_is_online_service'),
                        application_title: app.globalData.get_application_title(),
                        application_logo: app.globalData.get_application_logo(),
                    });
                }
            },

            // 获取数据
            init(params = {}) {
                // 还没有数据则读取缓存
                var cache_key = app.globalData.data.cache_index_data_key;
                if (this.load_status == 0) {
                    // 本地缓存数据
                    var upd_data = uni.getStorageSync(cache_key) || null;
                    if (upd_data != null) {
                        // 先使用缓存数据展示
                        this.setData(upd_data);

                        // 初始化返回公共处理
                        this.init_result_common_handle();

                        // 已有本地缓存则直接取远程有效数据（默认首次取的是远程缓存数据）
                        params['is_cache'] = 0;

                        // 设置顶部导航的默认颜色
                        this.set_navigation_bar_color();
                    }
                } else {
                    // 已有本地缓存则直接取远程有效数据（默认首次取的是远程缓存数据）
                    params['is_cache'] = 0;
                }

                // 网络检查
                if ((params || null) == null || (params.loading || 0) == 0) {
                    app.globalData.network_type_handle(this, 'init', params);
                    return false;
                }

                // 没有缓存数据则开启加载层
                if (upd_data == null) {
                    this.setData({
                        data_list_loding_status: 1,
                    });
                }
                // 请求远程数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'index'),
                    method: 'POST',
                    data: params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        // 数据处理
                        var data = res.data.data;
                        if (res.data.code == 0) {
                            var data_list = data.data_list || null;
                            var upd_data = {
                                random_value: Math.random(),
                                data_bottom_line_status: true,
                                banner_list: data.banner_list || [],
                                navigation: data.navigation || [],
                                article_list: data.article_list || [],
                                data_mode: data.data_mode || 0,
                                data_list: data_list,
                                cart_total: data.cart_total.buy_number || 0,
                                message_total: parseInt(data.message_total || 0),
                                right_icon_list: data.right_icon_list || [],
                                data_list_loding_status: data_list == null || data_list.length == 0 ? 0 : 3,
                                plugins_sort_list: data.plugins_sort_list || [],
                                plugins_seckill_data: data.plugins_seckill_data || null,
                                plugins_salerecords_data: (data.plugins_salerecords_data || null) == null || data.plugins_salerecords_data.length <= 0 ? null : data.plugins_salerecords_data,
                                plugins_activity_data: (data.plugins_activity_data || null) == null || data.plugins_activity_data.length <= 0 ? null : data.plugins_activity_data,
                                plugins_label_data: (data.plugins_label_data || null) == null || (data.plugins_label_data.base || null) == null || (data.plugins_label_data.data || null) == null || data.plugins_label_data.data.length <= 0 ? null : data.plugins_label_data,
                                plugins_homemiddleadv_data: (data.plugins_homemiddleadv_data || null) == null || data.plugins_homemiddleadv_data.length <= 0 ? null : data.plugins_homemiddleadv_data,
                                plugins_mourning_data_is_app: parseInt(data.plugins_mourning_data || 0) == 1,
                                plugins_blog_data: data.plugins_blog_data || null,
                                plugins_realstore_data: data.plugins_realstore_data || null,
                                plugins_shop_data: data.plugins_shop_data || null,
                                plugins_binding_data: data.plugins_binding_data || null,
                                plugins_magic_data: data.plugins_magic_data || null,
                            };
                            // 如果开启了哀悼灰色则不固定导航
                            if (upd_data.plugins_mourning_data_is_app == 1) {
                                upd_data['common_app_is_header_nav_fixed'] = 0;
                            }
                            this.setData(upd_data);

                            // 存储缓存
                            uni.setStorageSync(cache_key, upd_data);

                            // 设置顶部导航的默认颜色
                            this.set_navigation_bar_color();

                            // 是否需要重新加载数据
                            if (parseInt(data.is_result_data_cache || 0) == 1) {
                                this.init({ is_cache: 0 });
                            } else {
                                // 购物车导航角标
                                app.globalData.set_tab_bar_badge('cart', this.cart_total);
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_bottom_line_status: true,
                            });
                        }

                        // 初始化返回公共处理
                        this.init_result_common_handle();
                    },
                    fail: () => {
                        // 轮播数据处理
                        if (this.load_status == 0 || (this.top_content_search_bg_color || null) == null) {
                            this.change_banner(app.globalData.get_theme_color());
                        }

                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_bottom_line_status: true,
                            load_status: 1,
                        });
                    },
                });
            },

            // 设置顶部导航的默认颜色
            set_navigation_bar_color() {
                if(this.data_mode == 3) {
                    app.globalData.set_navigation_bar_color(parseInt(app.globalData.get_key_data(this.data_list, 'config.header.com_data.style.function_buttons_type', 0)) == 1);
                }
            },

            // 初始化返回公共处理
            init_result_common_handle() {
                var theme_view = app.globalData.get_theme_value_view();
                var theme_color = app.globalData.get_theme_color();
                var common_static_url = app.globalData.get_static_url('common');
                var static_url = app.globalData.get_static_url('home');

                // 轮播数据处理
                if (this.load_status == 0 || (this.top_content_search_bg_color || null) == null) {
                    var color = this.banner_list && this.banner_list.length > 0 && (this.banner_list[0]['bg_color'] || null) != null ? this.banner_list[0]['bg_color'] : theme_color;
                    this.change_banner(color);
                }

                // 公共数据
                this.setData({
                    top_content_search_content_style: 'background-image: url("' + static_url + 'nav-top.png");',
                    theme_view: theme_view,
                    theme_color: theme_color,
                    common_static_url: common_static_url,
                    static_url: static_url,
                    load_status: 1,
                });

                // 分享菜单处理、延时执行，确保基础数据已加载完成
                setTimeout(function () {
                    app.globalData.page_share_handle();
                }, 3000);
            },

            // 选择用户地理位置回调
            user_back_choice_location(e) {
                // 重新刷新数据
                this.init();
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 轮播改变、背景色处理
            change_banner(color) {
                if ((color || null) == null) {
                    color = this.theme_color;
                }
                this.setData({
                    top_content_bg_color: 'background: linear-gradient(180deg, ' + color + ' 0%, #f5f5f5 80%);',
                    top_content_search_bg_color: 'background: linear-gradient(180deg, ' + color + ' 0%, #f5f5f5 300%);',
                });
            },

            // 搜索icon扫码事件
            search_icon_event(e) {
                app.globalData.scan_handle();
            }
        },
    };
</script>
<style>
    @import './index.css';
</style>
