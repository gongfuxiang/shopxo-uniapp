<template>
    <view :class="theme_view">
        <view v-if="(shop || null) != null" class="pr">
            <!-- 头部 -->
            <component-shop-header :propBase="data_base" :propShop="shop" :propShopGoodsCategory="shop_goods_category" :propShopNavigation="shop_navigation" :propShopFavorUser="shop_favor_user"></component-shop-header>

            <!-- 数据模式 -->
            <!-- 自动模式 -->
            <block v-if="(shop.data_model || 0) == 0">
                <view v-if="(data || null) != null && data.length > 0" class="wh-auto">
                    <view class="padding-main">
                        <component-goods-list :propData="{ style_type: 1, goods_list: data }" :propCurrencySymbol="currency_symbol"></component-goods-list>
                        <button class="bg-main br-main cr-white round dis-block margin-top-xl margin-bottom-xl margin-horizontal-main" @tap="url_event" :data-value="'/pages/plugins/shop/search/search?shop_id=' + shop.id" size="mini">查看更多商品 >></button>
                    </view>
                </view>
                <block v-else>
                    <component-no-data propStatus="0"></component-no-data>
                </block>
            </block>

            <!-- 标准模式 -->
            <block v-if="(shop.data_model || 0) == 1">
                <block v-if="((slider || null) != null && slider.length > 0) || ((data || null) != null && data.length > 0)">
                    <view class="data-list padding-horizontal-main oh">
                        <!-- 轮播 -->
                        <view v-if="slider.length > 0" class="margin-top-main">
                            <component-banner :propData="slider"></component-banner>
                        </view>

                        <!-- 商品列表 -->
                        <view v-if="data.length > 0" :class="((slider || null) == null || slider.length == 0) ? 'margin-top-main' : ''">
                            <block v-for="(item, index) in data" :key="index">
                                <component-goods-list :propData="item" :propKeywordsUrl="'/pages/plugins/shop/search/search?shop_id=' + shop.id + '&keywords='" :propIsAutoPlay="true" :propCurrencySymbol="currency_symbol"></component-goods-list>
                            </block>
                        </view>
                    </view>
                </block>
                <block v-else>
                    <component-no-data propStatus="0"></component-no-data>
                </block>
            </block>

            <!-- 拖拽模式 -->
            <block v-if="(shop.data_model || 0) == 2">
                <block v-if="(data || null) != null && data.length > 0">
                    <!-- 拖拽模式、引入拖拽数据模块 -->
                    <component-layout :propData="data"></component-layout>
                </block>
                <block v-else>
                    <component-no-data propStatus="0"></component-no-data>
                </block>
            </block>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentLayout from '@/pages/design/components/layout/layout';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentBanner from '@/components/slider/slider';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentShopHeader from '../components/shop-header/shop-header';
    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.currency_symbol(),
                params: null,
                data_base: null,
                shop: null,
                shop_favor_user: [],
                shop_navigation: [],
                shop_goods_category: [],
                slider: [],
                data: [],
                search_keywords_value: '',
                popup_service_status: false,
                nav_category_status: false,
                // 自定义分享信息
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentLayout,
            componentNoData,
            componentBottomLine,
            componentBanner,
            componentGoodsList,
            componentShopHeader
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            params = app.globalData.launch_params_handle(params);
            // 是否指定店铺id
            var shop_id = app.globalData.data.plugins_shop_id || null;
            if(shop_id != null) {
                params['id'] = shop_id;
            }
            this.setData({
                params: params
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.get_data();

            // 初始化配置
            this.init_config();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            if(this.data_list_loding_status === 1) {
                uni.stopPullDownRefresh();
            } else {
                this.get_data();
            }
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            get_data(params = {}) {
                // 网络检查
                if((params || null) == null || (params.loading || 0) == 0) {
                    app.globalData.network_type_handle(this, 'get_data', params);
                    return false;
                }

                // 请求数据
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'shop'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var base = data.base || null;
                            var temp_data = data.data || [];
                            this.setData({
                                data_base: base,
                                shop: data.shop || null,
                                shop_favor_user: data.shop_favor_user || [],
                                shop_navigation: data.shop_navigation || [],
                                shop_goods_category: data.shop_goods_category || [],
                                data: temp_data,
                                slider: data.slider || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: temp_data.length > 0,
                            });
                            if ((this.shop || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.shop.seo_title || this.shop.name,
                                        desc: this.shop.seo_desc || this.shop.describe,
                                        path: '/pages/plugins/shop/detail/detail',
                                        query: 'id=' + this.shop.id,
                                        img: this.shop.share_images || this.shop.logo,
                                    },
                                });
                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.shop.name
                                });
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './detail.css';
</style>