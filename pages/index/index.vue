<template>
    <view>
        <!-- 顶部内容 -->
        <view v-if="load_status == 1" class="top-content" :style="top_content_style">
            <!-- 标题 -->
            <view class="nav-top-title single-text">{{application_title}}</view>

            <!-- 搜索 -->
            <view v-if="search_is_fixed == 1" class="search-fixed-seat"></view>
            <view v-if="load_status == 1" :class="search_is_fixed == 1 ? 'search-content-fixed bg-main' : ''" :style="search_is_fixed == 1 ? top_content_style : ''">
                <view :style="search_style">
                    <view class="search-content margin-horizontal-main">
                        <icon type="search" size="32rpx"></icon>
                        <input type="text" confirm-type="search" placeholder="其实搜索很简单^_^！" placeholder-class="cr-grey" class="cr-base" @confirm="search_input_event">
                    </view>
                </view>
            </view>
            
            <!-- 轮播 拖拽模式下不展示 -->
            <view class="banner-content padding-horizontal-main" v-if="banner_list.length > 0 && home_index_floor_data_type != 2">
                <component-banner :prop-data="banner_list"></component-banner>
            </view>
        </view>

        <!-- 内容 -->
        <view class="content padding-horizontal-main">
            <!-- 导航 拖拽模式下不展示 -->
            <view v-if="navigation.length > 0 && home_index_floor_data_type != 2">
                <component-icon-nav :prop-data="navigation"></component-icon-nav>
            </view>

            <!-- 商城公告 -->
            <view class="notice-content spacing-mb" v-if="load_status == 1 && (common_shop_notice || null) != null">{{common_shop_notice}}</view>

            <!-- 限时秒杀 -->
            <view v-if="plugins_limitedtimediscount_is_valid == 1 && plugins_limitedtimediscount_data.goods.length > 0" class="limitedtimediscount spacing-mb">
                <view class="spacing-nav-title">
                    <text class="text-wrapper va-m">限时秒杀</text>
                    <view class="dis-inline-block va-m margin-left-sm">
                        <component-countdown :prop-hour="plugins_limitedtimediscount_data.time.hours" :prop-minute="plugins_limitedtimediscount_data.time.minutes" :prop-second="plugins_limitedtimediscount_data.time.seconds"></component-countdown>
                    </view>
                    <navigator url="/pages/goods-search/goods-search" hover-class="none" class="arrow-right padding-right-xxxl margin-top-xs cr-gray fr">更多</navigator>
                </view>
                <view class="goods-list scroll-view-horizontal border-radius-main oh">
                    <scroll-view scroll-x>
                        <view v-for="(item, index) in plugins_limitedtimediscount_data.goods" :key="index"
                            class="item bg-white border-radius-main oh">
                            <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.goods_id" hover-class="none">
                                <image class="dis-block" :src="item.images" mode="aspectFit"></image>
                                <view class="goods-base padding-left padding-right">
                                    <view class="goods-title multi-text margin-bottom-sm">{{item.title}}</view>
                                    <view class="sales-price single-text">{{currency_symbol}}{{item.min_price}}</view>
                                    <view v-if="(item.min_original_price || null) != null && item.min_original_price > 0" class="original-price single-text">{{currency_symbol}}{{item.min_original_price}}</view>
                                    <!-- <button size="mini">抢</button> -->
                                    <uni-icons type="cart" size="16" color="#E02020" class="icon"></uni-icons>
                                </view>
                            </navigator>
                        </view>
                    </scroll-view>
                </view>
            </view>

            <!-- 楼层数据 -->
            <block v-if="(data_list || nul) != null && data_list.length > 0">
                <!-- 数据模式0,1自动+手动、2拖拽 -->
                <block v-if="home_index_floor_data_type == 2">
                    <!-- 引入拖拽数据模块 -->
                    <component-layout :prop-data="data_list"></component-layout>
                </block>
                <block v-else>
                    <!-- 自动+手动 -->
                    <view v-for="(floor, index) in data_list" :key="index" class="floor spacing-mb">
                        <view class="spacing-nav-title">
                            <text class="text-wrapper">{{floor.name}}</text>
                            <text v-if="floor.describe.length > 0" class="vice-name margin-left-lg cr-gray">{{floor.describe}}</text>
                            <navigator :url="'/pages/goods-search/goods-search?category_id=' + floor.id" hover-class="none" class="arrow-right padding-right-xxxl margin-top-xs cr-gray fr">更多</navigator>
                        </view>
                        
                        <view class="floor-list wh-auto oh">
                            <view class="word scroll-view-horizontal">
                                <scroll-view scroll-x>
                                    <block v-if="floor.items.length > 0">
                                        <block v-for="(icv, icx) in floor.items" :key="icx">
                                            <navigator :url="'/pages/goods-search/goods-search?category_id=' + icv.id" hover-class="none" class="word-icon dis-inline-block bg-main-light cr-main border-radius-main padding-top-xs padding-bottom-xs padding-left padding-right">{{icv.name}}</navigator>
                                        </block>
                                    </block>
                                </scroll-view>
                                
                               <!-- <navigator :url="'/pages/goods-search/goods-search?category_id=' + floor.id"
                                    hover-class="none">
                                    <image v-if="floor.big_images.length > 0" :src="floor.big_images" mode="aspectFit"
                                        class="dis-block"></image>
                                </navigator> -->
                            </view>
                            <view v-if="floor.goods.length > 0" class="goods-list margin-top-lg">
                                <view v-for="(goods, index2) in floor.goods" :key="index2" class="goods bg-white border-radius-main oh">
                                    <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + goods.id" hover-class="none">
                                        <image :src="goods.images" mode="aspectFit"></image>
                                        <view class="goods-base padding-left-lg padding-right-lg">
                                            <view class="goods-title multi-text margin-bottom-sm">{{goods.title}}</view>
                                            <view class="sales-price">{{currency_symbol}}{{goods.min_price}}</view>
                                        </view>
                                    </navigator>
                                </view>
                            </view>
                        </view>
                    </view>
                </block>
            </block>         <!---main 底部购买记录 -->
            <view v-if="(plugins_salerecords_data || null) != null && (plugins_salerecords_data.data || null) != null && plugins_salerecords_data.data.length > 0" class="spacing-mb plugins-salerecords">
                <view class="spacing-nav-title">
                    <text class="text-wrapper">{{plugins_salerecords_data.base.home_bottom_title || '最新购买'}}</text>
                    <text v-if="(plugins_salerecords_data.base || null) != null && (plugins_salerecords_data.base.home_bottom_desc || null) != null" class="vice-name margin-left-lg cr-gray">{{plugins_salerecords_data.base.home_bottom_desc}}</text>
                </view>
                <view class="bg-white border-radius-main oh">
                    <swiper vertical="true" autoplay="true" circular="true" display-multiple-items="6" interval="3000">
                        <block v-for="(item, index) in plugins_salerecords_data.data" :key="index">
                            <swiper-item>
                                <view class="item oh padding-lg">
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

            <!-- 留言 -->
            <view v-if="load_status == 1 && common_app_is_enable_answer == 1" class="bg-white border-radius-main oh spacing-10">
                <navigator url="/pages/answer-form/answer-form" hover-class="none">
                    <image mode="widthFix" :src="answer_form_images" class="wh-auto border-radius-main"></image>
                </navigator>
            </view>
            
            <!-- 提示信息 -->
            <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>

            <!-- 在线客服 -->
            <view v-if="common_app_is_online_service == 1">
                <button open-type="contact" class="common-quick-nav common-online-service">
                    <image src="/static/images/online-service-icon.png" class="dis-block"></image>
                </button>
            </view>

            <!-- 快捷导航 -->
            <!-- <component-quick-nav></component-quick-nav> -->

            <!-- 版权信息 -->
            <view v-if="load_status == 1">
                <component-copyright></component-copyright>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentQuickNav from "../../components/quick-nav/quick-nav";
    import componentIconNav from "../../components/icon-nav/icon-nav";
    import componentBanner from "../../components/slider/slider";
    import componentCountdown from "../../components/countdown/countdown";
    import componentLayout from "../../components/layout/layout";
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";
    import componentCopyright from "../../components/copyright/copyright";

    var static_url = app.globalData.get_static_url('home');
    export default {
        data() {
            return {
                load_status: 0,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_list: [],
                banner_list: [],
                navigation: [],
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                common_shop_notice: null,
                home_index_floor_data_type: 0,
                common_app_is_enable_search: 0,
                common_app_is_enable_answer: 0,
                common_app_is_header_nav_fixed: 0,
                common_app_is_online_service: 0,
                // 限时秒杀插件
                plugins_limitedtimediscount_is_valid: 0,
                plugins_limitedtimediscount_data: null,
                plugins_limitedtimediscount_timer_title: '',
                plugins_limitedtimediscount_is_show_time: true,
                plugins_limitedtimediscount_timer: null,
                // 购买记录插件
                plugins_salerecords_data: null,
                // 顶部+搜索样式配置
                top_content_style: 'background-image: url("'+static_url+'nav-top.png");',
                search_style: '',
                search_is_fixed: 0,
                // 留言入口图片
                answer_form_images: static_url+'answer-form.jpg',
                // 名称
                application_title: app.globalData.data.application_title,
            };
        },

        components: {
            componentQuickNav,
            componentIconNav,
            componentBanner,
            componentCountdown,
            componentLayout,
            componentNoData,
            componentBottomLine,
            componentCopyright
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

        // 页面从前台变为后台时执行
        onHide: function() {
            clearInterval(this.plugins_limitedtimediscount_timer);
        },
        // 页面销毁时执行
        onUnload: function() {
            clearInterval(this.plugins_limitedtimediscount_timer);
        },

        // 自定义分享
        onShareAppMessage() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: app.globalData.data.application_title,
                desc: app.globalData.data.application_describe,
                path: '/pages/index/index?referrer=' + user_id
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: app.globalData.data.application_title,
                query: 'referrer=' + user_id
            };
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        common_shop_notice: app.globalData.get_config('config.common_shop_notice'),
                        home_index_floor_data_type: app.globalData.get_config(
                            'config.home_index_floor_data_type'),
                        common_app_is_enable_search: app.globalData.get_config(
                            'config.common_app_is_enable_search'),
                        common_app_is_enable_answer: app.globalData.get_config(
                            'config.common_app_is_enable_answer'),
                        common_app_is_header_nav_fixed: app.globalData.get_config(
                            'config.common_app_is_header_nav_fixed'),
                        common_app_is_online_service: app.globalData.get_config(
                            'config.common_app_is_online_service')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var self = this;
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
                            self.init_config(true);
                        }

                        // 设置首次加载状态
                        self.setData({
                            load_status: 1
                        });

                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                data_bottom_line_status: true,
                                banner_list: data.banner_list || [],
                                navigation: data.navigation || [],
                                data_list: data.data_list,
                                data_list_loding_status: data.data_list.length == 0 ? 0 : 3,
                                plugins_limitedtimediscount_data: data
                                    .plugins_limitedtimediscount_data || null,
                                plugins_limitedtimediscount_is_valid: (data
                                        .plugins_limitedtimediscount_data || null) != null && (data
                                        .plugins_limitedtimediscount_data.is_valid || 0) == 1 ? 1 :
                                    0,
                                plugins_salerecords_data: (data.plugins_salerecords_data || null) ==
                                    null || data.plugins_salerecords_data.length <= 0 ? null : data
                                    .plugins_salerecords_data
                            });

                            // 导航购物车处理
                            var cart_total = data.common_cart_total || 0;
                            if (cart_total <= 0) {
                                app.globalData.set_tab_bar_badge(2, 0);
                            } else {
                                app.globalData.set_tab_bar_badge(2, 1, cart_total);
                            }

                            // 限时秒杀倒计时
                            if (this.plugins_limitedtimediscount_is_valid == 1) {
                                //this.plugins_limitedtimediscount_countdown();
                            }
                        } else {
                            self.setData({
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: true,
                            load_status: 1
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 搜索事件
            search_input_event(e) {
                var keywords = e.detail.value || null;
                if (keywords == null) {
                    app.globalData.showToast("请输入搜索关键字");
                    return false;
                }

                // 进入搜索页面
                uni.navigateTo({
                    url: '/pages/goods-search/goods-search?keywords=' + keywords
                });
            },

            // 显示秒杀插件-倒计时
            plugins_limitedtimediscount_countdown() {
                // 销毁之前的任务
                clearInterval(this.plugins_limitedtimediscount_timer);

                // 定时参数
                var data = this.plugins_limitedtimediscount_data;
                var status = data.time.status || 0;
                var msg = data.time.msg || '';
                var hours = parseInt(data.time.hours) || 0;
                var minutes = parseInt(data.time.minutes) || 0;
                var seconds = parseInt(data.time.seconds) || 0;
                var self = this;
                if (status == 1) {
                    // 秒
                    var timer = setInterval(function() {
                        if (seconds <= 0) {
                            if (minutes > 0) {
                                minutes--;
                                seconds = 59;
                            } else if (hours > 0) {
                                hours--;
                                minutes = 59;
                                seconds = 59;
                            }
                        } else {
                            seconds--;
                        }

                        var temp = self.plugins_limitedtimediscount_data;
                        temp['time']['hours'] = hours < 10 ? '0' + hours : hours;
                        temp['time']['minutes'] = minutes < 10 ? '0' + minutes : minutes;
                        temp['time']['seconds'] = seconds < 10 ? '0' + seconds : seconds;
                        self.setData({
                            plugins_limitedtimediscount_data: temp,
                            plugins_limitedtimediscount_timer: timer
                        });

                        if (hours <= 0 && minutes <= 0 && seconds <= 0) {
                            // 停止时间
                            clearInterval(timer);

                            // 活动已结束
                            self.setData({
                                plugins_limitedtimediscount_timer_title: '活动已结束',
                                plugins_limitedtimediscount_is_show_time: false
                            });
                        }
                    }, 1000);
                } else {
                    // 活动已结束
                    self.setData({
                        plugins_limitedtimediscount_timer_title: msg,
                        plugins_limitedtimediscount_is_show_time: false
                    });
                }
            },
            
            // 页面滚动监听
            onPageScroll(e) {
                var top = e.scrollTop > 35 ? 35 : e.scrollTop;
                var num = top*7;
                var val = (num > 220) ? 220 : num;
                this.setData({
                    search_style: 'width: calc(100% - '+val+'rpx);',
                    search_is_fixed: (top >= 35) ? 1 : 0,
                });
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>
