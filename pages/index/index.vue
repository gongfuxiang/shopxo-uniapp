<template>
    <view :class="theme_view">
        <view :class="(plugins_mourning_data_is_app ? ' grayscale' : '') + (is_single_page == 1 ? ' single-page-top' : '')">
            <!-- 顶部内容 -->
            <view v-if="load_status == 1" class="home-top-nav-content pr" :style="top_content_bg_color + top_content_style">
                <!-- 顶部背景图片 -->
                <view class="pa top-0 left-0 right-0">
                    <image class="bg-img wh-auto" mode="widthFix" :src="static_url + 'nav-top.png'"></image>
                </view>

                <!-- 搜索 -->
                <view v-if="common_app_is_header_nav_fixed == 1" class="search-fixed-seat"></view>
                <view v-if="load_status == 1" :class="'pr ' + (common_app_is_header_nav_fixed == 1 ? 'search-content-fixed' : '')" :style="common_app_is_header_nav_fixed == 1 && search_is_fixed == 1 ? top_content_search_bg_color : ''">
                    <view class="search-content-fixed-content padding-left-main" :style="(common_app_is_header_nav_fixed == 1 ? top_content_style : '') + (common_app_is_header_nav_fixed == 1 && search_is_fixed == 1 ? top_content_search_content_style : '')">
                        <!-- logo/标题 -->
                        <!-- #ifndef MP-TOUTIAO -->
                        <view v-if="(is_logo_use_text == 0 && (application_logo || null) != null) || (is_logo_use_text == 1 && (application_title || null) != null)" class="home-top-nav-logo dis-inline-block va-m margin-right-xxl">
                            <block v-if="is_logo_use_text == 0 && (application_logo || null) != null">
                                <image :src="application_logo" mode="heightFix" class="home-top-nav-logo-image"></image>
                            </block>
                            <block v-else>
                                <view v-if="is_logo_use_text == 1 && (application_title || null) != null" class="home-top-nav-logo-title cr-white single-text">{{ application_title }}</view>
                            </block>
                        </view>
                        <!-- #endif -->
                        <view v-if="common_app_is_enable_search == 1" class="search-content-input dis-inline-block va-m" :style="top_content_search_style">
                            <!-- 是否开启搜索框前面icon扫一扫 -->
                            <block v-if="is_home_search_scan == 1">
                                <component-search propPlaceholder="输入商品名称搜索" propPlaceholderClass="cr-white" propIconColor="#fff" propBgColor="rgb(255 255 255 / 0.5)" 
                                <!-- #ifndef H5 -->
                                @onicon="search_icon_event" propIcon="icon-mendian-sousuosm" :propIsIconOnEvent="true"
                                <!-- #endif -->
                                ></component-search>
                            </block>
                            <block v-else>
                                <component-search propPlaceholder="输入商品名称搜索" propPlaceholderClass="cr-white" propIconColor="#fff" propBgColor="rgb(255 255 255 / 0.5)"></component-search>
                            </block>
                        </view>
                        <!-- #ifdef H5 || MP-TOUTIAO || APP -->
                        <!-- 右上角icon列表 -->
                        <view v-if="(right_icon_list || null) != null && right_icon_list.length > 0" class="nav-top-right-icon pa">
                            <block v-for="(item, index) in right_icon_list">
                                <view class="item dis-inline-block cp" :data-value="item.url || ''" @tap="url_event">
                                    <uni-icons :type="item.icon" size="32rpx" color="#f1f1f1"></uni-icons>
                                    <view v-if="(item.badge || null) != null" class="badge-icon pa">
                                        <component-badge :propNumber="item.badge"></component-badge>
                                    </view>
                                </view>
                            </block>
                        </view>
                        <!-- #endif -->
                    </view>
                </view>

                <!-- 轮播 -->
                <view class="banner-content padding-horizontal-main" v-if="banner_list.length > 0">
                    <component-banner :propData="banner_list" @changeBanner="change_banner"></component-banner>
                </view>
                <!-- 导航 -->
                <view v-if="navigation.length > 0" class="spacing-mt">
                    <view class="padding-horizontal-main">
                        <view class="bg-white border-radius-main">
                            <component-icon-nav :propData="navigation"></component-icon-nav>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 内容 -->
            <view class="content padding-horizontal-main">
                <!-- 商城公告 -->
                <view v-if="load_status == 1 && (common_shop_notice || null) != null" class="notice">
                    <uni-notice-bar show-icon scrollable :text="common_shop_notice" background-color="transparent" color="#666" />
                </view>
                <!-- 推荐文章 -->
                <view v-if="article_list.length > 0" class="article-list padding-main border-radius-main oh bg-white spacing-mb" :class="load_status == 1 && (common_shop_notice || null) != null ? '' : 'spacing-mt'">
                    <view mode="aspectFit" class="new-icon va-m fl cp pr divider-r" data-value="/pages/article-category/article-category" @tap="url_event"> <text>最新</text><text class="cr-red">资讯</text> </view>
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
                        <view v-if="pv.plugins == 'homemiddleadv' && (plugins_homemiddleadv_data || null) != null && plugins_homemiddleadv_data.length > 0" class="plugins-homemiddleadv oh">
                            <view v-for="(item, index) in plugins_homemiddleadv_data" :key="index" class="item border-radius-main oh cp spacing-mb" :data-value="item.url || ''" @tap="url_event">
                                <image class="dis-block wh-auto border-radius-main" :src="item.images" mode="widthFix"> </image>
                            </view>
                        </view>

                        <!-- 限时秒杀 - 插件 -->
                        <view
                            v-if="pv.plugins == 'seckill' && (plugins_seckill_data || null) != null && (plugins_seckill_data.data || null) != null && (plugins_seckill_data.data.goods || null) != null && plugins_seckill_data.data.goods.length > 0"
                            class="plugins-seckill-data border-radius-main spacing-mb bg-white"
                            :style="'background-image: url(' + seckill_static_url + 'seckill-bg.png);'">
                            <view class="flex-row jc-sb align-c padding-top-main padding-horizontal-main">
                                <view class="flex-1">
                                    <image class="dis-inline-block va-m icon" :src="plugins_seckill_data.data.home_title_icon" mode="widthFix"></image>
                                    <view class="dis-inline-block va-m margin-left-sm">
                                        <component-countdown :propHour="plugins_seckill_data.data.time.hours" :propMinute="plugins_seckill_data.data.time.minutes" :propSecond="plugins_seckill_data.data.time.seconds"></component-countdown>
                                    </view>
                                </view>
                                <navigator url="/pages/plugins/seckill/index/index" hover-class="none" class="arrow-right padding-right cr-grey text-size-xs">更多</navigator>
                            </view>
                            <component-goods-list :propData="{ style_type: 2, goods_list: plugins_seckill_data.data.goods }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true" propSource="index" :prop-open-cart="false"></component-goods-list>
                        </view>

                        <!-- 活动配置-楼层顶部 - 插件 -->
                        <block v-if="pv.plugins == 'activity' && (plugins_activity_data || null) != null">
                            <component-activity-list :propConfig="plugins_activity_data.base" :propData="plugins_activity_data.data" propLocation="0" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true" propSource="index"></component-activity-list>
                        </block>

                        <!-- 门店 - 插件 -->
                        <block v-if="pv.plugins == 'realstore' && (plugins_realstore_data || null) != null">
                            <view v-if="(plugins_realstore_data.base.home_data_list_title || null) != null" class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                <text class="text-wrapper title-left-border">{{ plugins_realstore_data.base.home_data_list_title }}</text>
                                <navigator url="/pages/plugins/realstore/search/search" hover-class="none" class="arrow-right padding-right cr-grey">更多</navigator>
                            </view>
                            <component-realstore-list :propDataList="plugins_realstore_data.data"></component-realstore-list>
                        </block>

                        <!-- 多商户 - 插件 -->
                        <block v-if="pv.plugins == 'shop' && (plugins_shop_data || null) != null">
                            <view v-if="(plugins_shop_data.base.home_data_list_title || null) != null" class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                <text class="text-wrapper title-left-border">{{ plugins_shop_data.base.home_data_list_title }}</text>
                                <navigator url="/pages/plugins/shop/index/index" hover-class="none" class="arrow-right padding-right cr-grey">更多</navigator>
                            </view>
                            <component-shop-list :propConfig="plugins_shop_data.base" :propDataList="plugins_shop_data.data"></component-shop-list>
                        </block>

                        <!-- 组合搭配 - 插件 -->
                        <block v-if="pv.plugins == 'binding' && (plugins_binding_data || null) != null">
                            <view v-if="(plugins_binding_data.base.home_data_list_title || null) != null" class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                <text class="text-wrapper title-left-border">{{ plugins_binding_data.base.home_data_list_title }}</text>
                                <navigator url="/pages/plugins/binding/index/index" hover-class="none" class="arrow-right padding-right cr-grey">更多</navigator>
                            </view>
                            <component-binding-list :propConfig="plugins_binding_data.base" :propDataList="plugins_binding_data.data" :propCurrencySymbol="currency_symbol"></component-binding-list>
                        </block>

                        <!-- 博客-楼层顶部 - 插件 -->
                        <block v-if="pv.plugins == 'blog' && (plugins_blog_data || null) != null">
                            <component-blog-list :propConfig="plugins_blog_data.base" :propData="plugins_blog_data.data" propLocation="0"></component-blog-list>
                        </block>

                        <!-- 魔方 - 插件 -->
                        <block v-if="pv.plugins == 'magic' && (plugins_magic_data || null) != null">
                            <component-magic-list :propData="plugins_magic_data"></component-magic-list>
                        </block>
                    </block>
                </block>

                <!-- 楼层数据 -->
                <block v-if="(data_list || null) != null && data_list.length > 0">
                    <!-- 数据模式0,1自动+手动、2拖拽 -->
                    <block v-if="home_index_floor_data_type == 2">
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
                                <navigator :url="'/pages/goods-search/goods-search?category_id=' + floor.id" hover-class="none" class="arrow-right padding-right cr-grey">更多 </navigator>
                            </view>
                            <view class="floor-list wh-auto oh pr">
                                <block v-if="floor.goods.length > 0">
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
                        <block v-if="pv.plugins == 'activity' && (plugins_activity_data || null) != null">
                            <component-activity-list :propConfig="plugins_activity_data.base" :propData="plugins_activity_data.data" propLocation="1" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" propSource="index" :prop-open-cart="false"></component-activity-list>
                        </block>

                        <!-- 弹屏广告 - 插件 -->
                        <view v-if="(plugins_popupscreen_data || null) != null && plugins_popupscreen_status == 1" class="plugins-popupscreen wh-auto ht-auto">
                            <view class="content pr">
                                <view class="close pa cp" @tap.stop="plugins_popupscreen_close_event">
                                    <iconfont name="icon-huiyuan-guanbi" size="28rpx" color="#999"></iconfont>
                                </view>
                                <image class="dis-block auto" :src="plugins_popupscreen_data.images" mode="widthFix" :data-value="plugins_popupscreen_data.images_url || ''" @tap="url_event"></image>
                            </view>
                        </view>

                        <!--- 底部购买记录 - 插件 -->
                        <view v-if="pv.plugins == 'salerecords' && (plugins_salerecords_data || null) != null && (plugins_salerecords_data.data || null) != null && plugins_salerecords_data.data.length > 0" class="plugins-salerecords bg-white border-radius-main padding-main spacing-mb">
                            <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                                <view class="title-left">
                                    <text class="text-wrapper">{{ plugins_salerecords_data.base.home_bottom_title || '最新购买' }}</text>
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
                                                    <navigator :url="item.goods_url" hover-class="none" class="single-text">
                                                        <image mode="widthFix" :src="item.images" class="va-m br"> </image>
                                                        <text class="margin-left-sm single-text">{{ item.title }}</text>
                                                    </navigator>
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

                <!-- 弹屏广告 - 插件 -->
                <view v-if="(plugins_popupscreen_data || null) != null && plugins_popupscreen_status == 1" class="plugins-popupscreen wh-auto ht-auto">
                    <view class="content pr">
                        <icon type="clear" size="46rpx" class="close pa cp" @tap.stop="plugins_popupscreen_close_event"> </icon>
                        <image class="dis-block auto" :src="plugins_popupscreen_data.images" mode="widthFix" :data-value="plugins_popupscreen_data.images_url || ''" @tap="url_event"></image>
                    </view>
                </view>

                <!-- 留言 -->
                <view v-if="load_status == 1 && common_app_is_enable_ask == 1" class="bg-white border-radius-main oh spacing-mt">
                    <navigator url="/pages/form/form" hover-class="none">
                        <image mode="widthFix" :src="static_url + 'ask-form.jpg'" class="wh-auto border-radius-main"> </image>
                    </navigator>
                </view>
            </view>

            <!-- 提示信息 -->
            <block v-if="load_status == 0">
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </block>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 版权信息 -->
            <view v-if="load_status == 1">
                <component-copyright></component-copyright>
            </view>
        </view>

        <block v-if="load_status == 1">
            <!-- 在线客服 -->
            <component-online-service :propIsNav="true" :propIsBar="true" :propIsGrayscale="plugins_mourning_data_is_app"></component-online-service>

            <!-- 快捷导航 -->
            <component-quick-nav :propIsNav="true" :propIsBar="true" :propIsGrayscale="plugins_mourning_data_is_app"></component-quick-nav>

            <!-- 用户基础 -->
            <component-user-base ref="user_base" :propIsGrayscale="plugins_mourning_data_is_app"></component-user-base>
        </block>
    </view>
</template>

<script>
    const app = getApp();
    import componentSearch from '../../components/search/search';
    import componentQuickNav from '../../components/quick-nav/quick-nav';
    import componentIconNav from '../../components/icon-nav/icon-nav';
    import componentBanner from '../../components/slider/slider';
    import componentCountdown from '../../components/countdown/countdown';
    import componentLayout from '../../components/layout/layout';
    import componentBadge from '../../components/badge/badge';
    import componentNoData from '../../components/no-data/no-data';
    import componentBottomLine from '../../components/bottom-line/bottom-line';
    import componentCopyright from '../../components/copyright/copyright';
    import componentOnlineService from '../../components/online-service/online-service';
    import componentActivityList from '../../components/activity-list/activity-list';
    import componentBlogList from '../../components/blog-list/blog-list';
    import componentRealstoreList from '../../components/realstore-list/realstore-list';
    import componentShopList from '../../components/shop-list/shop-list';
    import componentGoodsList from '../../components/goods-list/goods-list';
    import componentUserBase from '../../components/user-base/user-base';
    import componentBindingList from '../../components/binding-list/binding-list';
    import componentMagicList from '../../components/magic-list/magic-list';

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
                currency_symbol: app.globalData.data.currency_symbol,
                is_home_search_scan: app.globalData.data.is_home_search_scan,
                data_list: [],
                banner_list: [],
                navigation: [],
                article_list: [],
                cart_total: 0,
                message_total: 0,
                right_icon_list: [],
                // 基础配置
                common_shop_notice: null,
                home_index_floor_data_type: 0,
                common_app_is_enable_search: 0,
                common_app_is_enable_ask: 0,
                common_app_is_header_nav_fixed: 0,
                common_app_is_online_service: 0,
                // 名称
                application_title: app.globalData.data.application_title,
                application_logo: app.globalData.data.application_logo,
                is_logo_use_text: app.globalData.data.is_logo_use_text || 0,
                // 顶部+搜索样式配置
                top_content_bg_color: '',
                top_content_search_bg_color: '',
                top_content_search_content_style: '',
                top_content_style: 'padding-top:' + (bar_height + 6) + 'px;',
                // #ifdef H5 || MP-TOUTIAO || APP
                top_content_style: 'padding-top:' + (bar_height + 10) + 'px;',
                // #endif
                top_content_search_style: '',
                search_is_fixed: 0,
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
                // 弹屏广告、这里设置一天后可以再次显示
                plugins_popupscreen_data: null,
                plugins_popupscreen_status: 0,
                plugins_popupscreen_cache_key: 'plugins_popupscreen_cache_key',
                plugins_popupscreen_timer: null,
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
            componentUserBase,
            componentBindingList,
            componentMagicList,
        },
        props: {},

        onShow() {
            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();

            // 用户头像和昵称设置提示
            if ((this.$refs.user_base || null) != null) {
                this.$refs.user_base.init('index');
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        common_shop_notice: app.globalData.get_config('config.common_shop_notice'),
                        home_index_floor_data_type: app.globalData.get_config('config.home_index_floor_data_type'),
                        common_app_is_enable_search: app.globalData.get_config('config.common_app_is_enable_search'),
                        common_app_is_enable_ask: app.globalData.get_config('config.common_app_is_enable_ask'),
                        common_app_is_header_nav_fixed: app.globalData.get_config('config.common_app_is_header_nav_fixed'),
                        common_app_is_online_service: app.globalData.get_config('config.common_app_is_online_service'),
                        application_title: app.globalData.get_application_title(),
                        application_logo: app.globalData.get_application_logo(),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('index', 'index'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        // 获取最新缓存
                        if (this.load_status == 0) {
                            this.init_config(true);
                        }

                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var theme_view = app.globalData.get_theme_value_view();
                            var theme_color = app.globalData.get_theme_color();
                            var common_static_url = app.globalData.get_static_url('common');
                            var seckill_static_url = app.globalData.get_static_url('seckill', true) + 'app/';
                            var static_url = app.globalData.get_static_url('home');
                            var upd_data = {
                                theme_view: theme_view,
                                theme_color: theme_color,
                                common_static_url: common_static_url,
                                seckill_static_url: seckill_static_url,
                                static_url: static_url,
                                top_content_search_content_style: 'background-image: url("' + static_url + 'nav-top.png");',
                                data_bottom_line_status: true,
                                banner_list: data.banner_list || [],
                                navigation: data.navigation || [],
                                article_list: data.article_list || [],
                                data_list: data.data_list,
                                cart_total: data.cart_total.buy_number || 0,
                                message_total: parseInt(data.message_total || 0),
                                right_icon_list: data.right_icon_list || [],
                                data_list_loding_status: data.data_list.length == 0 ? 0 : 3,
                                plugins_sort_list: data.plugins_sort_list || [],
                                plugins_seckill_data: data.plugins_seckill_data || null,
                                plugins_salerecords_data: (data.plugins_salerecords_data || null) == null || data.plugins_salerecords_data.length <= 0 ? null : data.plugins_salerecords_data,
                                plugins_activity_data: (data.plugins_activity_data || null) == null || data.plugins_activity_data.length <= 0 ? null : data.plugins_activity_data,
                                plugins_label_data: (data.plugins_label_data || null) == null || (data.plugins_label_data.base || null) == null || (data.plugins_label_data.data || null) == null || data.plugins_label_data.data.length <= 0 ? null : data.plugins_label_data,
                                plugins_homemiddleadv_data: (data.plugins_homemiddleadv_data || null) == null || data.plugins_homemiddleadv_data.length <= 0 ? null : data.plugins_homemiddleadv_data,
                                plugins_popupscreen_data: data.plugins_popupscreen_data || null,
                                plugins_mourning_data_is_app: parseInt(data.plugins_mourning_data || 0) == 1,
                                plugins_blog_data: data.plugins_blog_data || null,
                                plugins_realstore_data: data.plugins_realstore_data || null,
                                plugins_shop_data: data.plugins_shop_data || null,
                                plugins_binding_data: data.plugins_binding_data || null,
                                plugins_magic_data: data.plugins_magic_data || null,
                            };

                            // 轮播数据处理
                            if (this.load_status == 0 && data.banner_list && data.banner_list.length > 0) {
                                if ((data.banner_list[0]['bg_color'] || null) != null) {
                                    upd_data['top_content_bg_color'] = 'background: linear-gradient(180deg, ' + data.banner_list[0].bg_color + ' 0%, #f5f5f5 80%);';
                                    upd_data['top_content_search_bg_color'] = 'background: linear-gradient(180deg, ' + data.banner_list[0].bg_color + ' 0%, #f5f5f5 460%);';
                                } else {
                                    upd_data['top_content_bg_color'] = 'background: linear-gradient(180deg, ' + this.theme_color + ' 0%, #f5f5f5 80%);';
                                    upd_data['top_content_search_bg_color'] = 'background: linear-gradient(180deg, ' + this.theme_color + ' 0%, #f5f5f5 460%);';
                                }
                            }

                            // 搜索框宽度处理
                            var width = this.is_logo_use_text == 1 ? app.globalData.string_width(this.application_title) : (this.application_logo || null) == null ? 0 : 112;
                            // #ifdef H5 || MP-TOUTIAO || APP
                            var len = (this.right_icon_list || []).length;
                            width += len <= 0 ? 0 : 70 * len;
                            // #endif
                            // #ifdef MP
                            width += 220;
                            // #endif
                            upd_data['top_content_search_style'] = 'width: calc(100% - ' + width + 'rpx);';
                            // 设置数据
                            this.setData(upd_data);

                            // 弹屏广告插件处理
                            this.plugins_popupscreen_handle();

                            // 导航购物车处理
                            if (this.cart_total <= 0) {
                                app.globalData.set_tab_bar_badge(2, 0);
                            } else {
                                app.globalData.set_tab_bar_badge(2, 1, this.cart_total);
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_bottom_line_status: true,
                            });
                            app.globalData.showToast(res.data.msg);
                        }

                        // 设置首次加载状态
                        this.setData({
                            load_status: 1,
                        });

                        // 分享菜单处理、延时执行，确保基础数据已加载完成
                        setTimeout(function () {
                            app.globalData.page_share_handle();
                        }, 3000);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '网络开小差了哦~',
                            data_bottom_line_status: true,
                            load_status: 1,
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 页面滚动监听
            onPageScroll(e) {
                if (this.common_app_is_header_nav_fixed == 1 && this.common_app_is_enable_search == 1) {
                    // 开启哀悼插件的时候不需要浮动导航并且搜索框也不需要缩短、开启站点灰度会导致浮动失效
                    if (!this.plugins_mourning_data_is_app) {
                        this.setData({
                            search_is_fixed: e.scrollTop > 0 ? 1 : 0,
                        });
                    }
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 弹屏广告插件处理
            plugins_popupscreen_handle() {
                if (this.plugins_popupscreen_data != null) {
                    // 不存在关闭缓存或者超过间隔时间则显示
                    var cv = parseInt(uni.getStorageSync(this.plugins_popupscreen_cache_key)) || 0;
                    var pv = parseInt(this.plugins_popupscreen_data.interval_time) || 86400;
                    if (cv == 0 || cv + pv < app.globalData.get_timestamp()) {
                        // 是否开启自动关闭
                        var timer = null;
                        var ct = parseInt(this.plugins_popupscreen_data.close_time) || 0;
                        if (ct > 0) {
                            var self = this;
                            timer = setTimeout(function () {
                                self.setData({
                                    plugins_popupscreen_status: 0,
                                });
                                uni.setStorage({
                                    key: self.plugins_popupscreen_cache_key,
                                    data: app.globalData.get_timestamp(),
                                });
                            }, ct * 1000);
                        }
                        this.setData({
                            plugins_popupscreen_status: 1,
                            plugins_popupscreen_timer: timer,
                        });
                    }
                }
            },

            // 弹屏广告 - 插件 关闭事件
            plugins_popupscreen_close_event(e) {
                this.setData({
                    plugins_popupscreen_status: 0,
                });
                uni.setStorage({
                    key: this.plugins_popupscreen_cache_key,
                    data: app.globalData.get_timestamp(),
                });
                clearInterval(this.plugins_popupscreen_timer);
            },

            // 轮播改变、背景色处理
            change_banner(color) {
                if ((color || null) != null) {
                    this.top_content_bg_color = 'background: linear-gradient(180deg, ' + color + ' 0%, #f5f5f5 80%);';
                    this.top_content_search_bg_color = 'background: linear-gradient(180deg, ' + color + ' 0%, #f5f5f5 460%);';
                } else {
                    this.top_content_bg_color = 'background: linear-gradient(180deg, ' + this.theme_color + ' 0%, #f5f5f5 80%);';
                    this.top_content_search_bg_color = 'background: linear-gradient(180deg, ' + this.theme_color + ' 0%, #f5f5f5 460%);';
                }
            },

            // 搜索icon扫码事件
            search_icon_event(e) {
                app.globalData.scan_handle();
            },
        },
    };
</script>
<style>
    @import './index.css';
</style>
