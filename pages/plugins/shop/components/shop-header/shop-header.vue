<template>
    <view :class="theme_view">
        <!-- 搜索 -->
        <view class="flex-row jc-sb align-c padding-main bg-white oh bs-bb z-i search-content" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 0)+'px;'">
            <view v-if="top_nav_left_back_status == 1" @tap="top_nav_left_back_event" class="dis-inline-block padding-right-sm">
                <iconfont name="icon-arrow-left" size="40rpx" propClass="pr top-xs z-i"></iconfont>
            </view>
            <view class="flex-1 wh-auto">
                <view class="search flex-row jc-sb align-c round border-color-main bg-white">
                    <view class="flex-row align-c flex-1 wh-auto padding-left-main">
                        <iconfont name="icon-search-max" size="28rpx" color="#ccc"></iconfont>
                        <input class="text-size-xs flex-1 wh-auto padding-left-sm" type="done" :placeholder="$t('detail.detail.8q6345')" :value="search_keywords_value || ''" placeholder-class="cr-grey-c" @input="search_keywords_event" />
                    </view>
                    <button class="bg-main br-main cr-white round text-size-xs" type="default" size="mini" hover-class="none" @tap="search_button_event" :data-value="'/pages/plugins/shop/search/search?shop_id=' + propShop.id + '&'">
                        {{ is_shop_search_all_search_button == 1 ? $t('design.design.i7725u') : $t('common.search') }}
                    </button>
                </view>
            </view>
            <view v-if="is_shop_search_all_search_button == 1" class="search-btn padding-left-sm flex-row align-c">
                <button class="bg-main-pair br-main-pair cr-white round text-size-xs" type="default" size="mini" hover-class="none" @tap="search_button_event" data-value="/pages/goods-search/goods-search?">{{$t('design.design.ay7m42')}}</button>
            </view>
        </view>
        <view class="search-content-seat" :style="'margin-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 0)+'px;'"></view>
        <!-- 顶部 -->
        <view class="header plugins-shop-data-list bg-white oh">
            <image :src="propShop.logo" mode="widthFix" class="shop-logo fl border-radius-main cp" @tap="image_show_event" :data-value="propShop.logo"></image>
            <view class="base fr item">
                <view class="shop-title single-text">
                    <!-- 认证信息 -->
                    <view v-if="(propShop.icon_list || null) != null && propShop.icon_list.length > 0" class="auth-icon dis-inline-block">
                        <block v-for="(itemiv, indexix) in propShop.icon_list" :key="indexix">
                            <image :src="itemiv.icon" class="icon va-m" mode="aspectFill" :data-value="itemiv.url || ''" @tap="url_event"></image>
                        </block>
                    </view>
                    <!-- 标题 -->
                    <text class="fw-b text-size va-m">{{ propShop.name }}</text>
                </view>
                <view class="base-bottom oh margin-top-sm text-size-xs">
                    <!-- 在线客服 -->
                    <view v-if="(propBase.is_service_info || 0) == 1" class="fl margin-right-xxl cp" @tap="popup_service_event">
                        <image class="va-m margin-right-sm" :src="common_static_url + 'customer-service-icon.png'" mode="scaleToFill"></image>
                        <text class="va-m cr-base">{{$t('design.design.21kak7')}}</text>
                    </view>
                    <!-- 收藏 -->
                    <view class="fl single-text cp" @tap="shop_favor_event">
                        <image class="va-m margin-right-sm" :src="common_static_url + 'favor' + (shop_favor_info.status == 1 ? '-active' : '') + '-icon.png'" mode="scaleToFill"></image>
                        <text :class="'va-m ' + (shop_favor_info.status == 1 ? 'cr-main' : '')">{{ shop_favor_info.text }}({{ shop_favor_info.count }})</text>
                    </view>
                    <!-- 评分 -->
                    <view v-if="(propShop.score_data || null) != null" class="fl margin-left-xxl">
                        <view class="dis-inline-block va-m">
                            <uni-rate :value="propShop.score_data.value" :readonly="true" :is-fill="false" :size="14" />
                        </view>
                        <text class="va-m cr-red">{{ propShop.score_data.value }}{{$t('design.design.745kx2')}}</text>
                    </view>
                </view>
            </view>
        </view>
        
        <!-- 导航 -->
        <view v-if="((propShopGoodsCategory || null) != null && propShopGoodsCategory.length > 0) || ((shop_navigation || null) != null && shop_navigation.length > 0)" class="nav bg-white padding-sm flex-row">
            <view v-if="propShopGoodsCategory.length > 0" class="item padding-main arrow-bottom nav-shop-category dis-inline-block cp" @tap="popup_all_goods_category_event">{{$t('recommend-form.recommend-form.203itn')}}</view>
            <scroll-view scroll-x class="nav-scroll" :class="propShopGoodsCategory.length > 0 ? 'category-all' : ''">
                <view class="pr flex-row">
                    <block v-if="(shop_navigation || null) != null && shop_navigation.length > 0">
                        <block v-for="(item, index) in shop_navigation" :key="index">
                            <view class="item par dis-inline-block cp" @tap="nav_event" :data-value="((item.items || null) == null || item.items.length == 0) ? item.url : ''" :data-index="index">{{ item.name }}</view>
                        </block>
                    </block>
                </view>
            </scroll-view>
        </view>

        <!-- 导航二级分类弹窗 -->
        <component-popup :propShow="popup_nav_two_category_status" propPosition="bottom" @onclose="popup_nav_two_category_event">
            <view class="padding-top-main bg-white">
                <view class="padding-horizontal-main padding-bottom-main">
                    <view class="close oh">
                        <text class="fw-b">{{$t('common.two_nav_text')}}</text>
                        <view class="fr" @tap.stop="popup_nav_two_category_event">
                            <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="popup-nav-category-container">
                    <scroll-view scroll-y class="nav-two-scroll">
                        <view v-if="shop_navigation_two_data.length > 0" class="cr-base padding">
                            <block v-for="(item, index) in shop_navigation_two_data" :key="index">
                                <view class="single-text cp padding-sm" @tap="nav_event" :data-value="item.url" :data-index="index">{{ item.name }}</view>
                            </block>
                        </view>
                        <block v-else>
                            <component-no-data propStatus="0" :propMsg="$t('common.no_data')"></component-no-data>
                        </block>
                    </scroll-view>
                </view>
            </view>
        </component-popup>

        <!-- 店铺全部商品分类弹窗 -->
        <component-popup :propShow="popup_all_goods_category_status" propPosition="bottom" @onclose="popup_all_goods_category_event">
            <view class="padding-top-main bg-white">
                <view class="padding-horizontal-main padding-bottom-main">
                    <view class="close oh">
                        <text class="fw-b">{{$t('recommend-form.recommend-form.203itn')}}</text>
                        <view class="fr" @tap.stop="popup_all_goods_category_event">
                            <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="popup-nav-category-container">
                    <scroll-view scroll-y class="category-scroll">
                        <view v-if="(propShopGoodsCategory || null) != null && propShopGoodsCategory.length > 0" class="cr-base padding">
                            <block v-for="(item, index) in propShopGoodsCategory" :key="index">
                                <view class="single-text cp padding-sm" @tap="shop_goods_category_event" :data-value="item.id">{{ item.name }}</view>
                                <block v-if="(item.items || null) != null && item.items.length > 0">
                                    <view v-for="(item2, index2) in item.items" :key="index2" class="padding-left-xl">
                                        <view class="single-text cp padding-sm" @tap="shop_goods_category_event" :data-value="item2.id">{{ item2.name }}</view>
                                    </view>
                                </block>
                            </block>
                        </view>
                        <block v-else>
                            <component-no-data propStatus="0" :propMsg="$t('common.no_data')"></component-no-data>
                        </block>
                    </scroll-view>
                </view>
            </view>
        </component-popup>

        <!-- 客服弹窗 -->
        <component-popup :propShow="popup_service_status" propPosition="bottom" @onclose="popup_service_event">
            <view class="padding-top-main bg-white">
                <view class="padding-horizontal-main">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_service_event">
                            <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="popup-service-container">
                    <view v-if="(propShop || null) != null && (propBase || null) != null && (propBase.is_service_info || 0) == 1" class="header-service">
                        <view v-if="(propShop.chat_info || null) != null" class="item padding-main single-text">
                            <text class="va-m">{{$t('detail.detail.r4124d')}}</text>
                            <view class="dis-inline-block chat-info cp" @tap="chat_event">
                                <image class="dis-inline-block va-m" :src="propShop.chat_info.icon" mode="scaleToFill"></image>
                                <text class="margin-left-sm va-m cr-blue" :data-value="propShop.chat_info.chat_url">{{ propShop.chat_info.name }}</text>
                            </view>
                        </view>
                        <view v-if="(propShop.service_qq || null) != null" class="item padding-main br-t-f9 single-text">
                            <text>Q Q：</text>
                            <text class="cp" @tap="text_copy_event" :data-value="propShop.service_qq">{{ propShop.service_qq }}</text>
                        </view>
                        <view v-if="(propShop.service_tel || null) != null" class="item padding-main br-t-f9 single-text">
                            <text>{{$t('order.order.7dxbm5')}}：</text>
                            <text class="cp" @tap="tel_event" :data-value="propShop.service_tel">{{ propShop.service_tel }}</text>
                        </view>
                        <view v-if="(propShop.open_week_name || null) != null && (propShop.close_week_name || null) != null" class="item padding-main br-t-f9 single-text">
                            <text>{{$t('article-detail.article-detail.728374')}}</text>
                            <text class="cp" @tap="text_copy_event" :data-value="propShop.open_week_name + $t('design.design.gv16tj') + propShop.close_week_name + '，' + propShop.open_time + '-' + propShop.close_time">{{ propShop.open_week_name }}{{$t('detail.detail.324777')}}{{ propShop.close_week_name }}，{{ propShop.open_time }}-{{ propShop.close_time }}</text>
                        </view>
                        <view v-if="(propShop.service_weixin_qrcode || null) != null || (propShop.service_line_qrcode || null) != null" class="oh qrcode tc br-t-f9 padding-top-main">
                            <view v-if="(propShop.service_weixin_qrcode || null) != null" class="item padding-bottom-lg dis-inline-block">
                                <image class="radius cp" :src="propShop.service_weixin_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="propShop.service_weixin_qrcode"></image>
                                <view>{{$t('detail.detail.54k10s')}}</view>
                            </view>
                            <view v-if="(propShop.service_line_qrcode || null) != null" class="item padding-bottom-lg dis-inline-block">
                                <image class="radius cp" :src="propShop.service_line_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="propShop.service_line_qrcode"></image>
                                <view>{{$t('detail.detail.vj4nom')}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    var common_static_url = app.globalData.get_static_url('common');
    export default {
        props: {
            propBase: {
                type: [Object,String],
                default: '',
            },
            propShop: {
                type: [Object,String],
                default: '',
            },
            propShopGoodsCategory: {
                type: [Array,String],
                default: '',
            },
            propShopNavigation: {
                type: [Array,String],
                default: '',
            },
            propShopFavorUser: {
                type: [Array,Object],
                default: '',
            },
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                is_shop_search_all_search_button: 0,
                search_keywords_value: '',
                popup_service_status: false,
                popup_all_goods_category_status: false,
                shop_navigation: [],
                shop_navigation_two_data: [],
                popup_nav_two_category_status: false,
                shop_favor_info: {
                    "text": this.$t('goods-detail.goods-detail.dco1sc'),
                    "status": 0,
                    "count": 0
                },
                // 左侧返回按钮
                top_nav_left_back_status: app.globalData.data.is_shop_top_nav_back || 0,
                // #ifdef MP-TOUTIAO
                top_nav_left_back_status : 0,
                // #endif
                // 状态栏高度
                status_bar_height: 0,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU || MP-ALIPAY || APP
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0, true)),
                // #endif
                // #ifdef H5
                status_bar_height: 5,
                // #endif
            };
        },

        components: {
            componentPopup,
            componentNoData
        },
        created() {
            this.init();
        },

        methods: {
            // 初始化
            init() {
                var upd_data = {
                    is_shop_search_all_search_button: (this.propBase == null || parseInt(this.propBase.is_shop_search_all_search_button || 0) != 1) ? 0 : 1,
                    shop_navigation: this.propShopNavigation,
                }
                // 收藏信息
                if ((this.propShop || null) != null) {
                    var status = this.propShopFavorUser.indexOf(this.propShop.id) != -1 ? 1 : 0;
                    upd_data['shop_favor_info'] = {
                        count: this.propShop.shop_favor_count || 0,
                        status: status,
                        text: (status == 1 ? this.$t('goods-detail.goods-detail.by7052') : '') + this.$t('goods-detail.goods-detail.dco1sc')
                    };
                }
                this.setData(upd_data);
            },

            // 店铺收藏事件
            shop_favor_event(e) {
                var user = app.globalData.get_user_info(this, 'shop_favor_event');
                if (user != false) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text')
                    });
                    uni.request({
                        url: app.globalData.get_request_url("favor", "shopfavor", "shop"),
                        method: 'POST',
                        data: {
                            "id": this.propShop.id
                        },
                        dataType: 'json',
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    shop_favor_info: res.data.data
                                });
                                app.globalData.showToast(res.data.msg, 'success');
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'shop_favor_event')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        }
                    });
                }
            },

            // 搜索输入事件
            search_keywords_event(e) {
                this.setData({
                    search_keywords_value: e.detail.value || ''
                });
            },

            // 搜索事件
            search_button_event(e) {
                var value = e.currentTarget.dataset.value || null;
                app.globalData.url_open(value + 'keywords=' + this.search_keywords_value || '');
            },

            // 店铺全部商品分类事件
            popup_all_goods_category_event(e) {
                this.setData({
                    popup_all_goods_category_status: !this.popup_all_goods_category_status
                });
            },

            // 分类事件
            shop_goods_category_event(e) {
                var value = e.currentTarget.dataset.value || null;
                app.globalData.url_open('/pages/plugins/shop/search/search?shop_id=' + this.propShop.id + '&category_id=' + value);
                this.popup_all_goods_category_event();
            },

            // 导航事件
            nav_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if(value == null) {
                    var index = e.currentTarget.dataset.index;
                    this.setData({
                        shop_navigation_two_data: this.propShopNavigation[index]['items'] || [],
                        popup_nav_two_category_status: true
                    });
                } else {
                    app.globalData.url_event(e);
                    this.popup_nav_two_category_event();
                }
            },
            
            // 店铺导航二级事件弹窗
            popup_nav_two_category_event(e) {
                this.setData({
                    popup_nav_two_category_status: !this.popup_nav_two_category_status
                });
            },

            // 客服弹层事件
            popup_service_event(e) {
                this.setData({
                    popup_service_status: !this.popup_service_status
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 剪切板
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },

            // 电话
            tel_event(e) {
                app.globalData.call_tel(e);
            },

            // 图片预览
            image_show_event(e) {
                app.globalData.image_show_event(e);
            },

            // 进入客服系统
            chat_event() {
                app.globalData.chat_entry_handle(this.propShop.chat_info.chat_url);
            },

            // 返回事件
            top_nav_left_back_event() {
                app.globalData.page_back_prev_event();
            }
        },
    };
</script>
<style scoped>
    /**
    * 搜索
    */
    .search {
        border: 2rpx solid;
        padding: 2rpx;
    }
    
    .search button {
        width: 124rpx;
        height: 52rpx;
        line-height: 52rpx;
        padding: 0;
    }
    
    .search input {
        height: 50rpx;
        line-height: 50rpx;
    }
    
    .search-btn {
        width: 124rpx;
    }
    
    .search-btn button {
        width: 100%;
        padding: 0;
        height: 60rpx;
        line-height: 60rpx;
    }
    .search-content {
        position: fixed;
        left: auto;
        top: 0;
        width: 100%;
        /* #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU */
        padding-right: 200rpx;
        /* #endif */
    }
    .search-content-seat {
        height: 74rpx;
    }
    /* #ifdef H5 */
    @media only screen and (min-width: 1600rpx) {
        .search-content {
            width: 1560rpx;
        }
    }
    @media only screen and (min-width: 961px) {
        .search-content {
            width: 800px;
        }
    }
    /* #endif */
    
    /**
    * 头部
    */
    .header {
        padding: 20rpx 24rpx;
        font-size: 24rpx;
    }
    
    .shop-logo {
        width: 90rpx;
    }
    
    .base-bottom image {
        width: 28rpx;
        height: 28rpx;
    }
    
    .header .base {
        width: calc(100% - 110rpx);
    }
    
    .shop-title {
        line-height: 40rpx;
    }
    
    /**
    * 导航
    */
    .nav .nav-scroll {
        float: right;
        width: 100%;
    }
    .nav .nav-scroll.category-all {
        width: calc(100% - 172rpx);
    }
    .nav .nav-scroll .item.par {
        height: 56rpx;
        line-height: 56rpx;
        white-space: nowrap;
    }
    
    .nav .item {
        padding: 0 20rpx;
    }
    
    .nav-shop-category {
        padding-right: 32rpx !important;
        background-size: 28rpx 28rpx;
        height: 56rpx;
        line-height: 56rpx;
    }
    
    /**
    * 导航二级分类弹窗
    */
    .popup-nav-category-container .nav-two-scroll {
        max-height: 600rpx;
    }
    
    /**
    * 导航商品分类
    */
    .popup-nav-category-container .category-scroll {
        max-height: 600rpx;
    }
    
    /**
    * 商品分类切换
    */
    .shop-category-list .item {
        margin: 20rpx 0;
    }
    
    .shop-category-list .item {
        margin-left: 20rpx;
    }
    
    .shop-category-list .item:last-child {
        margin-right: 20rpx;
    }
</style>
