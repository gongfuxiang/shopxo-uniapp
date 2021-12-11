<template>
    <view>
        <view :class="(plugins_mourning_data || 0) == 1 ? 'grayscale' : ''">
            <!-- 顶部内容 -->
            <view v-if="load_status == 1" class="home-top-nav-content" :style="top_content_style">
                <!-- 标题 -->
                <view class="home-top-nav-title cr-white single-text">{{application_title}}</view>

                <!-- 搜索 -->
                <view v-if="search_is_fixed == 1" class="search-fixed-seat"></view>
                <view v-if="load_status == 1" :class="'pr '+(search_is_fixed == 1 ? 'search-content-fixed bg-main' : '')" :style="search_is_fixed == 1 ? top_content_style : ''">
                    <view :style="search_style">
                        <view class="margin-horizontal-main">
                            <component-search propPlaceholder="输入商品名称搜索" propBgColor="#fff"></component-search>
                        </view>
                    </view>

                    <!-- #ifdef H5 || APP -->
                    <!-- 右上角icon列表 -->
                    <view v-if="(right_icon_list || null) != null && right_icon_list.length > 0" class="nav-top-right-icon pa">
                        <block v-for="(item,index) in right_icon_list">
                            <view class="item dis-inline-block cp" :data-value="item.url || ''" @tap="url_event">
                                <uni-icons :type="item.icon" size="18" color="#f1f1f1"></uni-icons>
                                <view v-if="(item.badge || null) != null" class="badge-icon pa">
                                    <component-badge :propNumber="item.badge"></component-badge>
                                </view>
                            </view>
                        </block>
                    </view>
                    <!-- #endif -->
                </view>

                <!-- 轮播 -->
                <view class="banner-content padding-horizontal-main" v-if="banner_list.length > 0">
                    <component-banner :propData="banner_list"></component-banner>
                </view>
            </view>

            <!-- 内容 -->
            <view class="content padding-horizontal-main">
                <!-- 导航 -->
                <view v-if="navigation.length > 0">
                    <component-icon-nav :propData="navigation"></component-icon-nav>
                </view>

                <!-- 商城公告 -->
                <view class="notice-content spacing-mb" v-if="load_status == 1 && (common_shop_notice || null) != null">{{common_shop_notice}}</view>

                <!-- 推荐文章 -->
                <view v-if="article_list.length > 0" class="article-list padding-main border-radius-main oh bg-white spacing-mb">
                    <image :src="static_url+'new-icon.png'" mode="aspectFit" class="new-icon va-m fl cp" data-value="/pages/article-category/article-category" @tap="url_event"></image>
                    <view class="right-content fr va-m">
                        <swiper :vertical="true" :autoplay="true" :circular="true" display-multiple-items="1" interval="3000">
                            <block v-for="(item, index) in article_list" :key="index">
                                <swiper-item class="single-text">
                                    <text class="cr-base text-size-sm cp" :data-value="item.category_url" @tap="url_event">[{{item.article_category_name}}]</text>
                                    <text class="cr-base text-size-sm margin-left-xs cp" :style="(item.title_color || null) != null ? 'color:'+item.title_color+' !important;' : ''" :data-value="item.url" @tap="url_event">{{item.title}}</text>
                                </swiper-item>
                            </block>
                        </swiper>
                    </view>
                </view>
                
                <!-- 首页中间广告 - 插件 -->
                <view v-if="(plugins_homemiddleadv_data || null) != null && plugins_homemiddleadv_data.length > 0" class="plugins-homemiddleadv oh">
                    <view v-for="(item,index) in plugins_homemiddleadv_data" :key="index" class="item border-radius-main oh cp spacing-mb" :data-value="item.url || ''" @tap="url_event">
                        <image class="dis-block wh-auto border-radius-main" :src="item.images" mode="widthFix"></image>
                    </view>
                </view>
                
                <!-- 限时秒杀 - 插件 -->
                <view v-if="plugins_seckill_is_valid == 1 && plugins_seckill_data.goods.length > 0" class="seckill spacing-mb">
                    <view class="spacing-nav-title">
                        <text class="text-wrapper va-m">限时秒杀</text>
                        <view class="dis-inline-block va-m margin-left-sm">
                            <component-countdown :propHour="plugins_seckill_data.time.hours" :propMinute="plugins_seckill_data.time.minutes" :propSecond="plugins_seckill_data.time.seconds"></component-countdown>
                        </view>
                        <navigator url="/pages/plugins/seckill/index/index" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                    </view>
                    <view class="goods-list scroll-view-horizontal border-radius-main oh">
                        <swiper :vertical="false" :autoplay="(plugins_seckill_data.base || null) != null && (plugins_seckill_data.base.is_home_auto_play || 0) == 1" :circular="true" :display-multiple-items="plugins_seckill_data.goods.length < 3 ? plugins_seckill_data.goods.length : 3" interval="3000">
                            <block v-for="(item, index) in plugins_seckill_data.goods" :key="index">
                                <swiper-item class="padding-right-main">
                                    <view class="item bg-white border-radius-main oh pr ht-auto">
                                        <!-- 商品主体内容 -->
                                        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.goods_id" hover-class="none">
                                            <image class="goods-img dis-block" :src="item.images" mode="aspectFit"></image>
                                            <view class="goods-base padding-left padding-right margin-top-sm">
                                                <view class="goods-title multi-text margin-bottom-sm">{{item.title}}</view>
                                                <view class="sales-price single-text">{{currency_symbol}}{{item.min_price}}</view>
                                                <view v-if="(item.min_original_price || null) != null && item.min_original_price > 0" class="original-price single-text">{{currency_symbol}}{{item.min_original_price}}</view>
                                                <view class="icon pa">
                                                    <uni-icons type="cart" size="16" color="#E02020"></uni-icons>
                                                </view>
                                            </view>
                                        </navigator>
                                        <!-- 标签插件 -->
                                        <view v-if="(plugins_label_data || null) != null && plugins_label_data.data.length > 0" :class="'plugins-label oh pa plugins-label-'+((plugins_label_data.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(plugins_label_data.base.user_goods_show_style || 'top-left')">
                                            <block v-for="(lv,li) in plugins_label_data.data" :key="li">
                                                <view v-if="lv.goods_ids.indexOf(item.goods_id) != -1" class="lv dis-inline-block va-m" :data-value="((plugins_label_data.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
                                                    <view v-if="(plugins_label_data.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">{{lv.name}}</view>
                                                    <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                </swiper-item>
                            </block>
                        </swiper>
                    </view>
                </view>

                <!-- 活动信息-楼层顶部 - 插件 -->
                <view v-if="(plugins_activity_data || null) != null && plugins_activity_data.length > 0" class="activity">
                    <block v-for="(floor, index) in plugins_activity_data" :key="index">
                        <view v-if="floor.goods_list.length > 0 && (floor.home_data_location || 0) == 0" class="floor">
                            <view class="spacing-nav-title">
                                <text class="text-wrapper" :style="'color:'+(floor.color || '#333')+';'">{{floor.title}}</text>
                                <text v-if="(floor.vice_title || null) != null" class="vice-name margin-left-lg cr-gray">{{floor.vice_title}}</text>
                                <navigator :url="'/pages/plugins/activity/detail/detail?id=' + floor.id" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                            </view>
                            <view class="floor-list wh-auto oh">
                                <view v-if="floor.keywords_arr.length > 0" class="word scroll-view-horizontal">
                                    <scroll-view scroll-x>
                                        <block v-for="(kv, ki) in floor.keywords_arr" :key="ki">
                                            <navigator :url="'/pages/goods-search/goods-search?keywords=' + kv" hover-class="none" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right">{{kv}}</navigator>
                                        </block>
                                    </scroll-view>
                                </view>
                                <view class="goods-list margin-top-lg">
                                    <view v-for="(goods, index2) in floor.goods_list" :key="index2" class="goods bg-white border-radius-main oh pr">
                                        <!-- 商品主体内容 -->
                                        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + goods.id" hover-class="none">
                                            <image class="goods-img dis-block" :src="goods.images" mode="aspectFit"></image>
                                            <view class="goods-base padding-horizontal-main margin-top-sm">
                                                <view class="goods-title multi-text margin-bottom-sm">{{goods.title}}</view>
                                                <view class="sales-price">{{currency_symbol}}{{goods.min_price}}</view>
                                            </view>
                                        </navigator>
                                        <!-- 标签插件 -->
                                        <view v-if="(plugins_label_data || null) != null && plugins_label_data.data.length > 0" :class="'plugins-label oh pa plugins-label-'+((plugins_label_data.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(plugins_label_data.base.user_goods_show_style || 'top-left')">
                                            <block v-for="(lv,li) in plugins_label_data.data" :key="li">
                                                <view v-if="lv.goods_ids.indexOf(goods.id) != -1" class="lv dis-inline-block va-m" :data-value="((plugins_label_data.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
                                                    <view v-if="(plugins_label_data.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">{{lv.name}}</view>
                                                    <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
                
                <!-- 楼层数据 -->
                <block v-if="(data_list || nul) != null && data_list.length > 0">
                    <!-- 数据模式0,1自动+手动、2拖拽 -->
                    <block v-if="home_index_floor_data_type == 2">
                        <!-- 引入拖拽数据模块 -->
                        <component-layout :propData="data_list"></component-layout>
                    </block>
                    <block v-else>
                        <!-- 自动+手动 -->
                        <view v-for="(floor, index) in data_list" :key="index" class="floor">
                            <view class="spacing-nav-title">
                                <text class="text-wrapper" :style="'color:'+(floor.bg_color || '#333')+';'">{{floor.name}}</text>
                                <text v-if="(floor.describe || null) != null" class="vice-name margin-left-lg cr-gray">{{floor.describe}}</text>
                                <navigator :url="'/pages/goods-search/goods-search?category_id=' + floor.id" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                            </view>
                            <view class="floor-list wh-auto oh">
                                <view v-if="floor.items.length > 0" class="word scroll-view-horizontal">
                                    <scroll-view scroll-x>
                                        <block v-for="(icv, icx) in floor.items" :key="icx">
                                            <navigator :url="'/pages/goods-search/goods-search?category_id=' + icv.id" hover-class="none" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right">{{icv.name}}</navigator>
                                        </block>
                                    </scroll-view>
                                </view>
                                <view v-if="floor.goods.length > 0" class="goods-list margin-top-lg">
                                    <view v-for="(goods, index2) in floor.goods" :key="index2" class="goods bg-white border-radius-main oh pr">
                                        <!-- 商品主体内容 -->
                                        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + goods.id" hover-class="none">
                                            <image class="goods-img dis-block" :src="goods.images" mode="aspectFit"></image>
                                            <view class="goods-base padding-horizontal-main margin-top-sm">
                                                <view class="goods-title multi-text margin-bottom-sm">{{goods.title}}</view>
                                                <view class="sales-price">{{currency_symbol}}{{goods.min_price}}</view>
                                            </view>
                                        </navigator>
                                        <!-- 标签插件 -->
                                        <view v-if="(plugins_label_data || null) != null && plugins_label_data.data.length > 0" :class="'plugins-label oh pa plugins-label-'+((plugins_label_data.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(plugins_label_data.base.user_goods_show_style || 'top-left')">
                                            <block v-for="(lv,li) in plugins_label_data.data" :key="li">
                                                <view v-if="lv.goods_ids.indexOf(goods.id) != -1" class="lv dis-inline-block va-m" :data-value="((plugins_label_data.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
                                                    <view v-if="(plugins_label_data.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">{{lv.name}}</view>
                                                    <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                </block>
                
                <!-- 活动信息-楼层底部 - 插件 -->
                <view v-if="(plugins_activity_data || null) != null && plugins_activity_data.length > 0" class="activity">
                    <block v-for="(floor, index) in plugins_activity_data" :key="index">
                        <view v-if="floor.goods_list.length > 0 && (floor.home_data_location || 0) == 1" class="floor">
                            <view class="spacing-nav-title">
                                <text class="text-wrapper" :style="'color:'+(floor.color || '#333')+';'">{{floor.title}}</text>
                                <text v-if="(floor.vice_title || null) != null" class="vice-name margin-left-lg cr-gray">{{floor.vice_title}}</text>
                                <navigator :url="'/pages/plugins/activity/detail/detail?id=' + floor.id" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                            </view>
                            <view class="floor-list wh-auto oh">
                                <view v-if="floor.keywords_arr.length > 0" class="word scroll-view-horizontal">
                                    <scroll-view scroll-x>
                                        <block v-for="(kv, ki) in floor.keywords_arr" :key="ki">
                                            <navigator :url="'/pages/goods-search/goods-search?keywords=' + kv" hover-class="none" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right">{{kv}}</navigator>
                                        </block>
                                    </scroll-view>
                                </view>
                                <view class="goods-list margin-top-lg">
                                    <view v-for="(goods, index2) in floor.goods_list" :key="index2" class="goods bg-white border-radius-main oh pr">
                                        <!-- 商品主体内容 -->
                                        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + goods.id" hover-class="none">
                                            <image class="goods-img dis-block" :src="goods.images" mode="aspectFit"></image>
                                            <view class="goods-base padding-horizontal-main margin-top-sm">
                                                <view class="goods-title multi-text margin-bottom-sm">{{goods.title}}</view>
                                                <view class="sales-price">{{currency_symbol}}{{goods.min_price}}</view>
                                            </view>
                                        </navigator>
                                        <!-- 标签插件 -->
                                        <view v-if="(plugins_label_data || null) != null && plugins_label_data.data.length > 0" :class="'plugins-label oh pa plugins-label-'+((plugins_label_data.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(plugins_label_data.base.user_goods_show_style || 'top-left')">
                                            <block v-for="(lv,li) in plugins_label_data.data" :key="li">
                                                <view v-if="lv.goods_ids.indexOf(goods.id) != -1" class="lv dis-inline-block va-m" :data-value="((plugins_label_data.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
                                                    <view v-if="(plugins_label_data.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">{{lv.name}}</view>
                                                    <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
                
                <!--- 底部购买记录 - 插件 -->
                <view v-if="(plugins_salerecords_data || null) != null && (plugins_salerecords_data.data || null) != null && plugins_salerecords_data.data.length > 0" class="spacing-mb plugins-salerecords">
                    <view class="spacing-nav-title">
                        <text class="text-wrapper">{{plugins_salerecords_data.base.home_bottom_title || '最新购买'}}</text>
                        <text v-if="(plugins_salerecords_data.base || null) != null && (plugins_salerecords_data.base.home_bottom_desc || null) != null" class="vice-name margin-left-lg cr-gray">{{plugins_salerecords_data.base.home_bottom_desc}}</text>
                    </view>
                    <view class="bg-white padding-horizontal-main border-radius-main oh">
                        <swiper :vertical="true" :autoplay="true" :circular="true" :display-multiple-items="plugins_salerecords_data.data.length < 6 ? plugins_salerecords_data.data.length : 6" interval="3000" :style="plugins_salerecords_data.data.length < 6 ? 'height:'+(plugins_salerecords_data.data.length*84.33)+'rpx;' : ''">
                            <block v-for="(item, index) in plugins_salerecords_data.data" :key="index">
                                <swiper-item>
                                    <view class="item oh padding-vertical-main">
                                        <view class="item-content single-text fl">
                                            <image mode="widthFix" :src="item.user.avatar" class="va-m br"></image>
                                            <text class="margin-left-sm">{{item.user.user_name_view}}</text>
                                            <text v-if="(item.user.province || null) != null"><text class="padding-left-xs padding-right-xs">-</text>{{item.user.province}}</text>
                                        </view>
                                        <view class="item-content fl">
                                            <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.goods_id" hover-class="none" class="single-text">
                                                <image mode="widthFix" :src="item.images" class="va-m br"></image>
                                                <text class="margin-left-sm single-text">{{item.title}}</text>
                                            </navigator>
                                        </view>
                                        <view class="item-content single-text fr tr cr-gray padding-top-xs">{{item.add_time}}</view>
                                    </view>
                                </swiper-item>
                            </block>
                        </swiper>
                    </view>
                </view>
                
                <!-- 弹屏广告 - 插件 -->
                <view v-if="(plugins_popupscreen_data || null) != null && plugins_popupscreen_status == 1" class="plugins-popupscreen wh-auto ht-auto">
                    <view class="content pr">
                        <icon type="clear" size="20" class="close pa cp" @tap.stop="plugins_popupscreen_close_event"></icon>
                        <image class="dis-block auto" :src="plugins_popupscreen_data.images" mode="widthFix" :data-value="plugins_popupscreen_data.images_url || ''" @tap="url_event"></image>
                    </view>
                </view>

                <!-- 留言 -->
                <view v-if="load_status == 1 && common_app_is_enable_answer == 1" class="bg-white border-radius-main oh spacing-10">
                    <navigator url="/pages/answer-form/answer-form" hover-class="none">
                        <image mode="widthFix" :src="static_url+'answer-form.jpg'" class="wh-auto border-radius-main"></image>
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

        <!-- 在线客服 -->
        <component-online-service :propIsNav="true" :propIsBar="true" :propIsGrayscale="plugins_mourning_data || 0"></component-online-service>
        
        <!-- 快捷导航 -->
        <component-quick-nav :propIsNav="true" :propIsBar="true" :propIsGrayscale="plugins_mourning_data || 0"></component-quick-nav>
    </view>
</template>

<script>
    const app = getApp();
    import componentSearch from "../../components/search/search";
    import componentQuickNav from "../../components/quick-nav/quick-nav";
    import componentIconNav from "../../components/icon-nav/icon-nav";
    import componentBanner from "../../components/slider/slider";
    import componentCountdown from "../../components/countdown/countdown";
    import componentLayout from "../../components/layout/layout";
    import componentBadge from "../../components/badge/badge";
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";
    import componentCopyright from "../../components/copyright/copyright";
    import componentOnlineService from "../../components/online-service/online-service";

    var common_static_url = app.globalData.get_static_url('common');
    var static_url = app.globalData.get_static_url('home');
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight'));
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                static_url: static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                load_status: 0,
                currency_symbol: app.globalData.data.currency_symbol,
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
                common_app_is_enable_answer: 0,
                common_app_is_header_nav_fixed: 0,
                common_app_is_online_service: 0,
                // 名称
                application_title: app.globalData.data.application_title,
                // 顶部+搜索样式配置
                top_content_style: 'background-image: url("'+static_url+'nav-top.png");'+'padding-top:'+(bar_height+8)+'px;',
                search_style: '',
                search_is_fixed: 0,
                // 限时秒杀插件
                plugins_seckill_is_valid: 0,
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
                plugins_mourning_data: 0
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
            componentOnlineService
        },
        props: {},

        onShow() {
            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
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
                        common_app_is_enable_answer: app.globalData.get_config('config.common_app_is_enable_answer'),
                        common_app_is_header_nav_fixed: app.globalData.get_config('config.common_app_is_header_nav_fixed'),
                        common_app_is_online_service: app.globalData.get_config('config.common_app_is_online_service')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "index"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        // 获取最新缓存
                        if (this.load_status == 0) {
                            this.init_config(true);
                        }

                        // 设置首次加载状态
                        this.setData({
                            load_status: 1
                        });

                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_bottom_line_status: true,
                                banner_list: data.banner_list || [],
                                navigation: data.navigation || [],
                                article_list: data.article_list || [],
                                data_list: data.data_list,
                                cart_total: (data.common_cart_total || 0) == 0 ? 0 : data.common_cart_total,
                                message_total: (data.common_message_total || 0) == 0 ? 0 : data.common_message_total,
                                right_icon_list: data.right_icon_list || [],
                                data_list_loding_status: data.data_list.length == 0 ? 0 : 3,
                                plugins_seckill_data: data.plugins_seckill_data || null,
                                plugins_seckill_is_valid: (data.plugins_seckill_data || null) != null && (data.plugins_seckill_data.is_valid || 0) == 1 ? 1 : 0,
                                plugins_salerecords_data: (data.plugins_salerecords_data || null) == null || data.plugins_salerecords_data.length <= 0 ? null : data.plugins_salerecords_data,
                                plugins_activity_data: (data.plugins_activity_data || null) == null || data.plugins_activity_data.length <= 0 ? null : data.plugins_activity_data,
                                plugins_label_data: (data.plugins_label_data || null) == null || (data.plugins_label_data.base || null) == null || (data.plugins_label_data.data || null) == null || data.plugins_label_data.data.length <= 0 ? null : data.plugins_label_data,
                                plugins_homemiddleadv_data: (data.plugins_homemiddleadv_data || null) == null || data.plugins_homemiddleadv_data.length <= 0 ? null : data.plugins_homemiddleadv_data,
                                plugins_popupscreen_data: data.plugins_popupscreen_data || null,
                                plugins_mourning_data: data.plugins_mourning_data || 0
                            });

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
                                data_bottom_line_status: true
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错',
                            data_bottom_line_status: true,
                            load_status: 1
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },
            
            // 页面滚动监听
            onPageScroll(e) {
                var top = e.scrollTop > 35 ? 35 : e.scrollTop;
                var num = top*7;
                var base = 230;
                // #ifdef MP-ALIPAY
                    base = 235
                // #endif
                // #ifdef H5 || APP
                    var len = (this.right_icon_list || []).length;
                    base = (len <= 0) ? 0 : 66*len;
                // #endif
                var val = (num > base) ? base : num;
                this.setData({
                    search_style: 'width: calc(100% - '+val+'rpx);',
                    search_is_fixed: (top >= 35) ? 1 : 0,
                });
            },
            
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            
            // 弹屏广告插件处理
            plugins_popupscreen_handle() {
                if(this.plugins_popupscreen_data != null) {
                    // 不存在关闭缓存或者超过间隔时间则显示
                    var cv = parseInt(uni.getStorageSync(this.plugins_popupscreen_cache_key)) || 0;
                    var pv = parseInt(this.plugins_popupscreen_data.interval_time) || 86400;
                    if(cv == 0 || cv+pv < app.globalData.get_timestamp()) {
                        // 是否开启自动关闭
                        var timer = null;
                        var ct = parseInt(this.plugins_popupscreen_data.close_time) || 0;
                        if(ct > 0) {
                            var self = this;
                            timer = setTimeout(function() {
                                self.setData({
                                    plugins_popupscreen_status: 0
                                });
                                uni.setStorage({
                                    key: self.plugins_popupscreen_cache_key,
                                    data: app.globalData.get_timestamp()
                                });
                            }, ct*1000);
                        }
                        this.setData({
                            plugins_popupscreen_status: 1,
                            plugins_popupscreen_timer: timer
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
                    data: app.globalData.get_timestamp()
                });
                clearInterval(this.plugins_popupscreen_timer);
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>