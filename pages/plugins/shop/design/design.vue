<template>
    <view>
        <view v-if="(data || null) != null">
            <!-- 头部 -->
            <block v-if="(data.is_header || 0) == 1">
                <!-- 搜索 -->
                <view class="search padding-main bg-white pr oh br-b">
                    <input class="bg-white wh-auto fl padding-left-xxl text-size-xs round border-color-main" type="done" placeholder="请输入您搜索的商品关键字" :value="search_keywords_value || ''" placeholder-class="cr-grey" @input="search_keywords_event">
                    <view class="search-btn pa">
                        <button class="bg-main br-main cr-white round text-size-xs" type="default" size="mini" hover-class="none" @tap="search_button_event" :data-value="'/pages/plugins/shop/search/search?shop_id=' + shop.id + '&'">搜本店</button>
                        <button class="bg-main-pair br-main-pair cr-white round text-size-xs" type="default" size="mini" hover-class="none" @tap="search_button_event" data-value="/pages/goods-search/goods-search?">搜全站</button>
                    </view>
                </view>
                <!-- 顶部 -->
                <view class="header bg-white oh">
                    <image :src="shop.logo_long" mode="widthFix" class="shop-logo fl br-r padding-right-lg margin-top-xs"></image>
                    <view class="base fr">
                        <view class="shop-title single-text">
                            <text v-if="((data_base.is_auth_fill_info || 0) == 1 || (data_base.is_auth_upload_pic || 0) == 1) && shop.auth_type == 1 && (shop.auth_type_name || null) != null" class="shop-auth-icon round fw-b margin-right-sm">{{shop.auth_type_name}}</text>
                            <text>{{shop.name}}</text>
                        </view>
                        <view class="base-bottom oh margin-top-sm">
                            <view v-if="(data_base.is_service_info || 0) == 1" class="fl margin-right-xxl" @tap="header_service_event">
                                <image class="va-m margin-right-sm" :src="common_static_url+'customer-service-icon.png'" mode="scaleToFill"></image>
                                <text class="va-m cr-base">在线客服</text>
                            </view>
                            <view class="fl single-text" @tap="shop_favor_event">
                                <image class="va-m margin-right-sm" :src="common_static_url+'favor'+(shop_favor_info.status == 1 ? '-active' : '')+'-icon.png'" mode="scaleToFill"></image>
                                <text :class="'va-m ' + (shop_favor_info.status == 1 ? 'cr-main' : '')">{{shop_favor_info.text}}({{shop_favor_info.count}})</text>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 在线客服 -->
                <view v-if="header_service_status && (data_base.is_service_info || 0) == 1" class="header-service pa border-radius-main oh padding-top-xxl bg-white br">
                    <view v-if="(shop.service_weixin_qrcode || null) != null" class="tc margin-bottom-sm">
                        <image class="radius" :src="shop.service_weixin_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="shop.service_weixin_qrcode"></image>
                        <view>点击长按微信咨询</view>
                    </view>
                    <view v-if="(shop.service_qq || null) != null" class="item padding-main br-t single-text">
                        <text>QQ：</text>
                        <text @tap="text_copy_event" :data-value="shop.service_qq">{{shop.service_qq}}</text>
                    </view>
                    <view v-if="(shop.service_tel || null) != null" class="item padding-main br-t single-text">
                        <text>电话：</text>
                        <text @tap="tel_event" :data-value="shop.service_tel">{{shop.service_tel}}</text>
                    </view>
                    <view v-if="(shop.open_week_name || null) != null && (shop.close_week_name || null) != null" class="item padding-main br-t single-text">
                        <text>时间：</text>
                        <text @tap="text_copy_event" :data-value="shop.open_week_name + '至' + shop.close_week_name + '，' + shop.open_time + '-' + shop.close_time">{{shop.open_week_name}}至{{shop.close_week_name}}，{{shop.open_time}}-{{shop.close_time}}</text>
                    </view>
                </view>
                <!-- 导航 -->
                <view class="nav scroll-view-horizontal bg-white padding-top-lg border-color-main">
                    <view class="item padding-main arrow-bottom nav-shop-category dis-inline-block fw-b" @tap="nav_shop_category_event">查看商品分类</view>
                    <scroll-view scroll-x class="nav-scroll">
                        <block v-if="shop_navigation.length > 0">
                            <block v-for="(item, index) in shop_navigation" :key="index">
                                <view class="item dis-inline-block fw-b" @tap="nav_event" :data-value="item.url" :data-index="index">{{item.name}}</view>
                            </block>
                        </block>
                    </scroll-view>
                    <view v-if="nav_category_status" class="nav-category bg-white pa tc">
                        <scroll-view scroll-y class="category-scroll">
                            <block v-if="shop_goods_category.length > 0">
                                <block v-for="(item, index) in shop_goods_category" :key="index">
                                    <view class="item dis-block cr-base single-text" @tap="shop_category_event" :data-value="item.id">{{item.name}}</view>
                                </block>
                            </block>
                            <block v-else>
                                <view class="padding-top-xxl padding-bottom-xxl cr-grey">暂无数据</view>
                            </block>
                        </scroll-view>
                    </view>
                </view>
            </block>

            <!-- 拖拽模式、引入拖拽数据模块 -->
            <component-layout :propData="layout_data"></component-layout>

            <!-- 结尾 -->
            <block v-if="(data.is_footer || 0) == 1">
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentLayout from "../../../../components/layout/layout";
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                user: null,
                data_base: null,
                shop: null,
                shop_favor_user: [],
                shop_navigation: [],
                shop_goods_category: [],
                data: null,
                layout_data: [],
                // 基础配置
                search_keywords_value: '',
                header_service_status: false,
                nav_category_status: false,
                shop_category_tab_value: 0,
                shop_favor_info: {
                    "text": "收藏",
                    "status": 0,
                    "count": 0
                },
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentLayout,
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params,
                user: app.globalData.get_user_cache_info()
            });
        },

        onShow() {
            this.get_data();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "design", "shop"),
                    method: "POST",
                    data: {
                        "id": this.params.id || 0
                    },
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                shop: (data.shop || null) == null || data.shop.length <= 0 ? null : data.shop,
                                shop_favor_user: data.shop_favor_user || [],
                                shop_navigation: data.shop_navigation || [],
                                shop_goods_category: data.shop_goods_category || [],
                                data: (data.data || null) != null && data.data.length != 0 ? data.data : null,
                                layout_data: data.layout_data || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });
                            
                            // 收藏信息
                            if ((this.shop || null) != null) {
                                var status = this.shop_favor_user.indexOf(this.shop.id) != -1 ? 1 : 0;
                                this.setData({
                                    shop_favor_info: {
                                        "count": this.shop.shop_favor_count || 0,
                                        "status": status,
                                        "text": (status == 1 ? '已' : '') + '收藏'
                                    }
                                });
                            }

                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.name,
                                        desc: this.data.seo_desc,
                                        path: '/pages/plugins/shop/design/design',
                                        query: 'id='+this.data.id,
                                        img: this.data.logo
                                    }
                                });

                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.data.name
                                });
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }
                        
                        // 显示分享菜单
                        app.globalData.show_share_menu();
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 店铺收藏事件
            shop_favor_event(e) {
                var user = app.globalData.get_user_info(this, 'shop_favor_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=shop_favor_event"
                        });
                        return false;
                    } else {
                        uni.showLoading({
                            title: '处理中...'
                        });
                        uni.request({
                            url: app.globalData.get_request_url("favor", "shopfavor", "shop"),
                            method: 'POST',
                            data: {
                                "id": this.shop.id
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    this.setData({
                                        shop_favor_info: res.data.data
                                    });
                                    app.globalData.showToast(res.data.msg, "success");
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, 'shop_favor_event')) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast('服务器请求出错');
                            }
                        });
                    }
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
                uni.navigateTo({
                    url: value + 'keywords=' + this.search_keywords_value || ''
                });
            },

            // 导航分类事件
            header_service_event(e) {
                this.setData({
                    header_service_status: !this.header_service_status
                });
            },

            // 导航分类事件
            nav_shop_category_event(e) {
                this.setData({
                    nav_category_status: !this.nav_category_status
                });
            },

            // 导航分类事件
            shop_category_event(e) {
                var value = e.currentTarget.dataset.value || null;
                uni.navigateTo({
                    url: '/pages/plugins/shop/search/search?shop_id=' + this.shop.id + '&category_id=' + value
                });
            },

            // 导航事件
            nav_event(e) {
                app.globalData.url_event(e);
            },

            // 剪切板
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },

            // 电话
            tel_event(e) {
                app.globalData.call_tel(e.currentTarget.dataset.value || null);
            },

            // 图片预览
            image_show_event(e) {
                app.globalData.image_show_event(e);
            }
        }
    };
</script>
<style>
    @import './design.css';
</style>