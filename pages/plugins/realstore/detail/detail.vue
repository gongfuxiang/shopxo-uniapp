<template>
    <view>
        <view v-if="(info || null) != null">
            <view class="pr">
                <!-- 头部 -->
                <view class="header" :style="'background-image: url('+info.banner+');'">
                    <!-- 顶部 -->
                    <view v-if="is_single_page == 0" class="header-top padding-horizontal-main" :style="'padding-top:'+(status_bar_height+8)+'px;'">
                        <!-- 返回 -->
                        <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
                        <view v-if="is_realstore_top_nav_back == 1" class="nav-back dis-inline-block round tc va-m" @tap="top_nav_left_back_event">
                            <uni-icons type="arrowleft" size="20" color="#fff"></uni-icons>
                        </view>
                        <!-- #endif -->
                        <!-- 搜索 -->
                        <view :class="'fr va-m '+(is_realstore_top_nav_back == 1 ? 'nav-search' : 'wh-auto')">
                            <!-- #ifndef H5 -->
                            <component-search @onsearch="search_button_event" @onicon="search_icon_event" :propIsIconOnEvent="true" :propIsOnEvent="true" :propIsRequired="false" propIcon="scan" propIconColor="#fff" propPlaceholderClass="cr-grey" propTextColor="#fff" propPlaceholder="商品搜索" propBgColor="rgba(0, 0, 0, 0.1)" propBrColor="rgb(205 205 205 / 60%)"></component-search>
                            <!-- #endif -->
                            <!-- #ifdef H5 -->
                            <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" propIconColor="#9A9A9A" propPlaceholderClass="cr-grey" propTextColor="#fff" propPlaceholder="商品搜索" propBgColor="rgba(0, 0, 0, 0.1)" propBrColor="rgb(205 205 205 / 60%)"></component-search>
                            <!-- #endif -->
                        </view>
                    </view>
                    <!-- 桌码 -->
                    <view v-if="(tablecode || null) != null" class="tablecode dis-inline-block margin-left-main round cr-red">
                        {{tablecode.name}}({{tablecode.code}})
                    </view>
                </view>
                <!-- 头部基础内容 -->
                <view class="header-content margin-main padding-main border-radius-main bg-white pa br">
                    <view class="base oh">
                        <!-- 基础内容 -->
                        <image :src="info.logo" mode="widthFix" class="logo circle fl br" :data-value="info.logo" @tap="image_show_event"></image>
                        <view class="base-right fr">
                            <view v-if="(info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0" class="use-type-icon pa text-size-xs cr-white bg-main" @tap="buy_use_type_event">
                                <text class="va-m margin-right-xs">{{info.buy_use_type_list[buy_use_type_index]['name']}}</text>
                                <view class="dis-inline-block va-m">
                                    <uni-icons type="arrowdown" size="12" color="#fff"></uni-icons>
                                </view>
                            </view>
                            <view :class="'title fw-b text-size single-text '+((info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0 ? 'title-length-limit' : '')">
                                <text v-if="(info.alias || null) != null" class="va-m title-icon round br-main cr-main text-size-xs padding-left-sm padding-right-sm margin-right-xs">{{info.alias}}</text>
                                <text class="va-m">{{info.name}}</text>
                            </view>
                            <view class="margin-top-xs text-size-xs cr-grey">
                                <view v-if="(info.status_info.time || null) != null">营业时间：{{info.status_info.time}}</view>
                                <view v-if="(info.distance || null) != null">距离您{{info.distance}}</view>
                            </view>
                        </view>
                    </view>
                    <!-- 地址 -->
                    <view class="margin-top-sm oh cp">
                        <view class="dis-inline-block va-m">
                            <uni-icons type="location-filled" size="12" color="#8d8d8d"></uni-icons>
                        </view>
                        <view class="address-content single-text cr-base margin-left-xs dis-inline-block text-size-sm va-m" :data-value="info.province_name+info.city_name+info.county_name+info.address" @tap="text_copy_event">{{info.province_name}}{{info.city_name}}{{info.county_name}}{{info.address}}</view>
                    </view>
                    <!-- 右侧操作 -->
                    <view class="icon-list pa">
                        <!-- #ifndef MP-KUAISHOU -->
                        <view v-if="(info.lat != 0 && info.lng != 0)" class="icon-item bg-green circle dis-inline-block tc cp" @tap="address_map_event">
                            <uni-icons type="paperplane-filled" size="12" color="#fff"></uni-icons>
                        </view>
                        <!-- #endif -->
                        <view v-if="(info.service_tel || null) != null" class="icon-item bg-yellow circle dis-inline-block tc cp" @tap="tel_event">
                            <uni-icons type="phone-filled" size="12" color="#fff"></uni-icons>
                        </view>
                        <view :class="'icon-item circle dis-inline-block tc cp pr '+((favor_info.status == 1) ? 'bg-red' : 'bg-gray')" @tap="favor_event">
                            <uni-icons type="heart-filled" size="12" color="#fff"></uni-icons>
                            <view class="badge-icon pa">
                                <component-badge :propNumber="favor_info.count"></component-badge>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            
            <!-- 内容 -->
            <view class="content oh">
                <!-- 左侧 -->
                <scroll-view :scroll-y="true" class="left-content fl ht-auto bg-white">
                    <view class="left-content-actual">
                        <view :class="'item tc cr-base text-size-sm cp ' + (nav_active_index == -1 ? 'active cr-main border-color-main fw-b' : '')" :data-index="-1" :data-itemindex="-1" @tap="nav_event">全部</view>
                        <block v-if="(goods_category || null) != null && goods_category.length > 0">
                            <block v-for="(item, index) in goods_category" :key="index">
                                <view :class="'item tc cr-base text-size-sm pr cp ' + (nav_active_index == index ? 'active cr-main border-color-main fw-b' : '')" :data-index="index" :data-itemindex="-1" @tap="nav_event">
                                    <text>{{item.name}}</text>
                                    <view v-if="(item.buy_number || 0) > 0" class="badge-icon pa">
                                        <component-badge :propNumber="item.buy_number"></component-badge>
                                    </view>
                                </view>
                            </block>
                        </block>
                    </view>
                </scroll-view>
                <!-- 右侧 -->
                <scroll-view :scroll-y="true" class="right-content padding-right-main fr ht-auto goods-list" :scroll-top="scroll_top" @scroll="scroll_event" @scrolltolower="scroll_lower" lower-threshold="30">
                    <view class="right-content-actual pr">
                        <!-- 二级分类 -->
                        <view v-if="(goods_category || null) != null && goods_category.length > 0 && nav_active_index != -1 && (goods_category[nav_active_index]['items'] || null) != null && goods_category[nav_active_index]['items'].length > 0" class="word-list scroll-view-horizontal">
                            <scroll-view scroll-x>
                                <view :class="'word-icon dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right '+((nav_active_item_index == -1) ? 'bg-main-light br-main-light cr-main' : 'br-gray cr-gray')" :data-index="nav_active_index" :data-itemindex="-1" @tap="nav_event">全部</view>
                                <block v-for="(cv, ci) in goods_category[nav_active_index]['items']" :key="ci">
                                    <view :class="'word-icon dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right '+((nav_active_item_index != -1 && nav_active_item_index == ci) ? 'bg-main-light br-main-light cr-main' : 'br-gray cr-gray')" :data-index="nav_active_index" :data-itemindex="ci" @tap="nav_event">{{cv.name}}</view>
                                </block>
                            </scroll-view>
                        </view>
                        <!-- 右侧商品列表 -->
                        <block v-if="(data_list || null) != null && data_list.length > 0">
                            <view v-for="(item, index) in data_list" :key="index" class="item bg-white padding-main border-radius-main oh spacing-mb">
                                <view :data-value="'/pages/goods-detail/goods-detail?id='+item.id+'&is_opt_back=1&buy_use_type_index='+buy_use_type_index+'&realstore_id='+info.id" @tap="url_event">
                                    <image :src="item.images" mode="widthFix" class="goods-img radius fl br"></image>
                                    <view class="goods-base fr">
                                        <view class="goods-base-content">
                                            <view class="goods-title text-size-sm single-text">{{item.title}}</view>
                                            <view v-if="(item.simple_desc || null) != null" class="simple-desc cr-red text-size-xs margin-top-xs multi-text">{{item.simple_desc}}</view>
                                        </view>
                                        <view class="margin-top-sm oh">
                                            <view class="sales-price text-size-sm single-text dis-inline-block va-m">{{currency_symbol}}{{item.min_price}}</view>
                                            <view class="tc fr">
                                                <block v-if="(item.is_error || 0) == 0">
                                                    <view v-if="(item.buy_number || 0) > 0" class="dis-inline-block va-m cp" :data-index="index" data-type="0" @tap.stop="buy_number_event">
                                                        <uni-icons type="minus" size="22" color="#f00"></uni-icons>
                                                    </view>
                                                    <view v-if="(item.buy_number || 0) > 0" class="buy-number dis-inline-block cr-base text-size-sm padding-left-xs padding-right-xs va-m">{{item.buy_number}}</view>
                                                    <view class="dis-inline-block va-m cp" :data-index="index" data-type="1" @tap.stop="buy_number_event">
                                                        <uni-icons type="plus" size="22" color="#1AAD19"></uni-icons>
                                                    </view>
                                                </block>
                                                <block v-else>
                                                    <text class="cr-grey text-size-xs">{{item.is_error_msg}}</text>
                                                </block>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </block>
                        <block v-else>
                            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                        </block>
                    </view>
                </scroll-view>
            </view>

            <!-- 购物车列表 -->
            <block v-if="cart_status">
                <view class="cart-mask wh-auto ht-auto pf" @tap="cart_event"></view>
                <view class="cart-content bg-white border-radius-main pa oh">
                    <block v-if="(cart || null) != null && (cart.data || null) != null && cart.data.length > 0">
                        <view class="oh br-b padding-vertical-main padding-horizontal-main">
                            <text class="va-m text-size-xs cr-base">已选商品</text>
                            <view class="dis-inline-block margin-left-xl text-size-xs">
                                <text class="cr-red">没有已加购的商品？</text>
                                <text class="br-green cr-green round padding-left padding-right padding-top-xs padding-bottom-xs cp" @tap="buy_use_type_event">切换下单类型</text>
                            </view>
                            <view class="fr cp" @tap="cart_all_delete_event">
                                <view class="dis-inline-block va-m">
                                    <uni-icons type="trash" size="12" color="#f00"></uni-icons>
                                </view>
                                <text class="cr-red va-m text-size-xs margin-left-xs">清空</text>
                            </view>
                        </view>
                        <scroll-view :scroll-y="true" class="cart-list goods-list">
                            <view v-for="(goods, index) in cart.data" :key="index" class="item padding-main oh spacing-mb">
                                <navigator :url="'/pages/goods-detail/goods-detail?id='+goods.goods_id+'&is_opt_back=1&buy_use_type_index='+buy_use_type_index+'&realstore_id='+info.id" hover-class="none">
                                    <image :src="goods.images" mode="widthFix" class="goods-img radius fl br"></image>
                                    <view class="goods-base fr">
                                        <view class="goods-base-content">
                                            <view class="goods-title text-size-sm single-text">{{goods.title}}</view>
                                            <view v-if="goods.spec != null" class="text-size-xs cr-grey margin-top-sm">
                                                <block v-for="(sv, si) in goods.spec" :key="si">
                                                    <text v-if="si > 0" class="padding-left-xs padding-right-xs">;</text>
                                                    <text>{{sv.value}}</text>
                                                </block>
                                            </view>
                                        </view>
                                        <view class="margin-top-sm oh">
                                            <view class="sales-price text-size-sm single-text dis-inline-block va-m">{{currency_symbol}}{{goods.price}}</view>
                                            <view class="tc fr">
                                                <view v-if="(goods.stock || 0) > 0" class="dis-inline-block va-m cp" :data-index="index" data-type="0" @tap.stop="cart_buy_number_event">
                                                    <uni-icons type="minus" size="22" color="#f00"></uni-icons>
                                                </view>
                                                <view v-if="(goods.stock || 0) > 0" class="buy-number dis-inline-block cr-base text-size-sm padding-left-xs padding-right-xs va-m">{{goods.stock}}</view>
                                                <view class="dis-inline-block va-m cp" :data-index="index" data-type="1" @tap.stop="cart_buy_number_event">
                                                    <uni-icons type="plus" size="22" color="#1AAD19"></uni-icons>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </navigator>
                            </view>
                        </scroll-view>
                    </block>
                    <block v-else>
                        <component-no-data propStatus="0" propMsg="请先选购商品"></component-no-data>
                        <view class="padding-bottom-xxxl margin-bottom-xxxl tc text-size-xs">
                            <text class="cr-red">没有已加购的商品？</text>
                            <text class="br-green cr-green round padding-left padding-right padding-top-xs padding-bottom-xs cp" @tap="buy_use_type_event">切换下单类型</text>
                        </view>
                    </block>
                </view>
            </block>

            <!-- 购物车底部导航 -->
            <view class="botton-nav round pa bg-main-pair oh">
                <view class="cart dis-inline-block va-m margin-left-xxl pr cp" @tap="cart_event">
                    <uni-icons type="cart" size="18" color="#fff"></uni-icons>
                    <view v-if="(cart || null) != null && (cart.buy_number || 0) > 0" class="badge-icon pa">
                        <component-badge :propNumber="cart.buy_number"></component-badge>
                    </view>
                </view>
                <view class="cart-total-price single-text dis-inline-block fw-b cr-white va-m margin-left-xl">
                    <text class="text-size-sm">{{currency_symbol}}</text>
                    <text class="text-size-lg">{{(cart || null) == null ? 0 : (cart.total_price || 0)}}</text>
                </view>
                <button type="default" size="mini" hover-class="none" @tap="buy_submit_event" :class="'text-size-sm pa radius-0 '+((info.status_info.status == 1) ? 'bg-main cr-white' : 'bg-gray cr-gray')">{{info.status_info.status == 1 ? '去结算' : info.status_info.msg}}</button>
            </view>
            
            <!-- 规格选择弹层 -->
            <component-popup :propShow="popup_spec_status" propPosition="bottom" @onclose="popup_spec_close_event">
                <view class="goods-spec-popup padding-main bg-white pr">
                    <view class="close fr oh">
                        <view class="fr" @tap.stop="popup_spec_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <!-- 规格基础信息 -->
                    <view class="goods-spec-popup-base oh br-b pr">
                        <image :src="goods_spec_base_images" mode="scaleToFill" class="radius br" @tap="goods_spec_base_images_view_event" :data-value="goods_spec_base_images"></image>
                        <view class="goods-spec-popup-base-content">
                            <view class="goods-price">
                                <view class="sales-price">{{currency_symbol}}{{goods_spec_base_price}}</view>
                                <view v-if="(goods_spec_base_original_price || null) != null && goods_spec_base_original_price != 0" class="original-price">{{currency_symbol}}{{goods_spec_base_original_price}}</view>
                            </view>
                            <view class="inventory">
                                <text class="cr-gray">库存</text>
                                <text class="cr-base">{{goods_spec_base_inventory}}</text>
                                <text class="cr-gray">{{goods_choose_data.inventory_unit}}</text>
                            </view>
                        </view>
                    </view>
                    <!-- 商品规格 -->
                    <view class="goods-spec-popup-content">
                        <view v-if="goods_specifications_choose.length > 0" class="goods-spec-choose">
                            <view v-for="(item, key) in goods_specifications_choose" :key="key" class="item br-b">
                                <view class="text-size">{{item.name}}</view>
                                <view v-if="item.value.length > 0" class="spec margin-top-sm">
                                    <block v-for="(items, keys) in item.value" :key="keys">
                                        <button @tap.stop="goods_specifications_event" :data-key="key" :data-keys="keys" type="default" size="mini" hover-class="none" :class="items.is_active + ' ' + items.is_dont + ' ' + items.is_disabled">
                                            <image v-if="(items.images || null) != null" :src="items.images" mode="scaleToFill" class="va-m dis-inline-block round margin-right-sm"></image>
                                            <text class="va-m">{{items.name}}</text>
                                        </button>
                                    </block>
                                </view>
                            </view>
                        </view>
                    </view>
                    <button class="goods-spec-popup-submit bg-main cr-white" type="default" @tap.stop="goods_spec_confirm_event" hover-class="none">确定</button>
                </view>
            </component-popup>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentSearch from "../../../../components/search/search";
    import componentBadge from "../../../../components/badge/badge";
    import componentPopup from "../../../../components/popup/popup";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.data.currency_symbol,
                cache_buy_use_type_index_key: 'cache_plugins_realstore_buy_use_type_index',
                buy_use_type_index: 0,
                params: null,
                is_first: 1,
                scroll_top: 0,
                scroll_top_old: 0,
                user: null,
                info: null,
                goods_category: [],
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                cart: null,
                goods_count: 0,
                data_base: null,
                favor_user: [],
                tablecode: null,
                category: [],
                goods_list: [],
                search_keywords_value: '',
                nav_active_index: -1,
                nav_active_item_index: -1,
                cart_status: false,
                popup_spec_status: false,
                goods_spec_base_price: 0,
                goods_spec_base_original_price: 0,
                goods_spec_base_inventory: 0,
                goods_spec_base_images: '',
                goods_choose_data: {},
                goods_specifications_choose: [],
                // 收藏信息
                favor_info: {
                    "text": "收藏",
                    "status": 0,
                    "count": 0
                },
                // 用户位置信息
                user_location: null,
                // 自定义分享信息
                share_info: {},
                // 是否单页预览
                is_single_page: app.globalData.is_current_single_page() || 0,
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
            };
        },

        components: {
            componentNoData,
            componentSearch,
            componentBadge,
            componentPopup
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: app.globalData.launch_params_handle(params),
                user: app.globalData.get_user_cache_info()
            });
        },

        onShow() {
            // 类型选择
            this.setData({
                buy_use_type_index: this.get_buy_use_type_index()
            });

            // 用户位置初始化
            this.user_location_init();

            // 获取数据
            this.get_detail_init();

            // 初始化配置
            this.init_config();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.reset_scroll();
            this.get_detail_init();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据-初始化
            get_detail_init() {
                uni.request({
                    url: app.globalData.get_request_url("index", "detail", "realstore"),
                    method: 'POST',
                    data: this.request_params_merge({
                        "id": this.params.id || 0
                    }, 'init'),
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                info: data.info || null,
                                goods_category: data.goods_category || [],
                                favor_user: data.favor_user || [],
                                tablecode: data.tablecode || null
                            });

                            // 下单类型是否存在索引
                            this.setData({
                                buy_use_type_index: this.get_buy_use_type_index()
                            });

                            // 收藏处理
                            if ((this.info || null) != null) {
                                // 收藏信息
                                var status = this.favor_user.indexOf(this.info.id) != -1 ? 1 : 0;
                                this.setData({
                                    favor_info: {
                                        "count": this.info.favor_count || 0,
                                        "status": status,
                                        "text": (status == 1 ? '已' : '') + '收藏'
                                    }
                                });

                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.info.seo_title || this.info.name,
                                        desc: this.info.seo_desc || this.info.describe,
                                        path: '/pages/plugins/realstore/detail/detail',
                                        query: 'id='+this.info.id,
                                        img: this.info.logo
                                    }
                                });

                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.info.name
                                });
                                
                                // 获取数据、仅首次调用
                                // 获取列表接口和购物车
                                if(this.is_first == 1) {
                                    this.get_data_list();
                                    this.get_cart_data(this.is_first);
                                    this.setData({is_first: 0});
                                } else {
                                    // 非首次赋值购物车数据
                                    this.setData({
                                        cart: data.cart || null,
                                    });
                                    // 购物车更新列表数据处理
                                    this.cart_data_list_handle();
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 获取数据-商品列表
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });

                // 分类id
                var temp_category = this.goods_category;
                if(this.nav_active_item_index != -1) {
                    var category_id = temp_category[this.nav_active_index]['items'][this.nav_active_item_index]['id'];
                } else {
                    var category_id = (this.nav_active_index == -1) ? 0 : temp_category[this.nav_active_index]['id'];
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("datalist", "detail", "realstore"),
                    method: 'POST',
                    data: this.request_params_merge({
                        id: this.params.id || 0,
                        page: this.data_page,
                        keywords: this.search_keywords_value,
                        category_id: category_id
                    }, 'data'),
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1
                                });
                                
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 收藏事件
            favor_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'favor_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=favor_event"
                        });
                        return false;
                    } else {
                        uni.showLoading({
                            title: '处理中...'
                        });
                        uni.request({
                            url: app.globalData.get_request_url("reversal", "favor", "realstore"),
                            method: 'POST',
                            data: {
                                "id": this.info.id
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    this.setData({
                                        favor_info: res.data.data
                                    });
                                    app.globalData.showToast(res.data.msg, 'success');
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, 'favor_event')) {
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

            // 列表数据操作
            buy_number_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this);
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=buy_number_event"
                        });
                        return false;
                    } else {
                        var index = e.currentTarget.dataset.index;
                        var type = parseInt(e.currentTarget.dataset.type) || 0;
                        var temp_goods = this.data_list[index];

                        // 是否存在多规格
                        if((temp_goods.is_exist_many_spec || 0) != 0) {
                            // 是否购物车中操作
                            if(type == 0) {
                                this.setData({
                                    cart_status: true
                                });
                                app.globalData.showToast('不同规格的商品需在购物车减购');
                            } else {
                                // 展示规格选择
                                var temp_specifications = temp_goods['specifications']['choose'] || [];
                                if(temp_specifications.length > 0) {
                                    for(var i in temp_specifications) {
                                        for(var k in temp_specifications[i]['value']) {
                                            temp_specifications[i]['value'][k]['is_active'] = '';
                                            if(i > 0) {
                                                temp_specifications[i]['value'][k]['is_dont'] = 'spec-dont-choose';
                                            }
                                        }
                                    }
                                }
                                this.setData({
                                    popup_spec_status: true,
                                    goods_choose_data: temp_goods,
                                    goods_specifications_choose: temp_specifications,
                                    goods_spec_base_price: temp_goods.price,
                                    goods_spec_base_original_price: temp_goods.original_price || 0,
                                    goods_spec_base_inventory: temp_goods.inventory,
                                    goods_spec_base_images: temp_goods.images,
                                });
                            }
                            return false;
                        }

                        // 数据操作处理
                        this.buy_number_event_handle(type, temp_goods);
                    }
                }
            },

            // 列表数量事件处理
            buy_number_event_handle(type, goods, spec = '') {
                var res = this.buy_number_handle(type, goods, 'buy_number');
                if(res === false) {
                    return false;
                }
                
                // 为0或减操作则查询
                var cart_item = null;
                if(type == 0 || (type == 1 && goods['buy_number'] > 0)) {
                    var cart_data = this.cart.data;
                    var params_spec = ((spec || null) == null || typeof(spec) != 'object') ? '' : JSON.stringify(spec);
                    for(var i in cart_data) {                        
                        if(goods['id'] == cart_data[i]['goods_id']) {
                            var cart_spec = ((cart_data[i]['spec'] || null) == null || typeof(cart_data[i]['spec']) != 'object') ? '' : JSON.stringify(cart_data[i]['spec']);
                            if(type == 0 || (type == 1 && cart_spec == params_spec)) {
                                cart_item = cart_data[i];
                            }
                            break;
                        }
                    }
                }

                // 操作类型
                if(res == 0) {
                    if(cart_item == null) {
                        app.globalData.showToast('购物车id有误');
                        return false;
                    }
                    this.cart_delete(cart_item.id);                    
                } else if(cart_item == null) {
                    this.cart_save(goods['id'], res, spec);
                } else {
                    var number = (type == 0) ? parseInt(cart_item['stock'])-res : res+parseInt(cart_item['stock']);
                    this.cart_update(cart_item.id, goods['id'], number);
                }
                return true;
            },

            // 购物车数量操作
            cart_buy_number_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this);
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=cart_buy_number_event"
                        });
                        return false;
                    } else {
                        var index = e.currentTarget.dataset.index;
                        var type = parseInt(e.currentTarget.dataset.type) || 0;
                        var temp_data = this.cart.data;
                        var temp_goods = temp_data[index];
                        
                        // 数据操作处理
                        var res = this.buy_number_handle(type, temp_goods, 'stock');
                        if(res === false) {
                            return false;
                        }
                        
                        // 操作类型
                        if(res == 0) {
                            this.cart_delete(temp_goods['id']);
                        } else {
                            var number = (type == 0) ? parseInt(temp_goods['stock'])-res : res+parseInt(temp_goods['stock']);
                            this.cart_update(temp_goods['id'], temp_goods['goods_id'], number);
                        }
                    }
                }
            },

            // 批量删除操作
            cart_all_delete_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '挑了这么久，真的要清空吗？',
                    confirmText: '确认',
                    cancelText: '暂不',
                    success: result => {
                        if (result.confirm) {
                            var ids = [];
                            var temp_data = this.cart.data;
                            for (var i in temp_data) {                
                                ids.push(temp_data[i]['id']);
                            }
                            this.cart_delete(ids.join(','));
                        }
                    }
                });
            },

            // 数量操作处理
            buy_number_handle(type, goods, buy_number_field) {
                // 门店状态
                if(type == 1 && !this.is_status_check()) {
                    return false;
                }

                // 加减处理
                var buy_number = parseInt(goods[buy_number_field]) || 0;
                if(type == 0) {
                    buy_number -= 1;
                } else {
                    buy_number += 1;
                }
                if(buy_number < 0) {
                    buy_number = 0;
                }

                // 数据校验
                var buy_min_number = parseInt(goods['buy_min_number']) || 1;
                var buy_max_number = parseInt(goods['buy_max_number']) || 0;
                var inventory = parseInt(goods['inventory']);
                var inventory_unit = goods['inventory_unit'];
                if (buy_min_number > 0) {
                    if(type == 0) {
                        if(buy_number < buy_min_number) {
                            buy_number = 0;
                        }
                    } else {
                        if(buy_number < buy_min_number) {
                            buy_number = buy_min_number;
                        }
                    }
                }
                if (buy_max_number > 0 && buy_number > buy_max_number) {
                    app.globalData.showToast('限购' + buy_max_number + inventory_unit);
                    return false;
                }
                if (buy_number > inventory) {
                    app.globalData.showToast('库存数量' + inventory + inventory_unit);
                    return false;
                }
                if (goods[buy_number_field] == buy_number) {
                    app.globalData.showToast('数量为改变');
                    return false;
                }

                // 操作数量
                var opt_number = 1;
                if(type == 0) {
                    if(buy_number <= 0) {
                        opt_number = 0;
                    }
                } else {
                    if(buy_number > goods['buy_number']) {
                        opt_number = buy_number-goods['buy_number'];
                    }
                }
                return opt_number;
            },
            
            // 购物车添加
            cart_save(goods_id, buy_number, spec = '') {
                uni.showLoading({
                    title: '处理中...'
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'cart'),
                    method: 'POST',
                    data: {
                        "goods_id": goods_id,
                        "stock": buy_number,
                        "spec": spec
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.get_cart_data();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 购物车更新
            cart_update(cart_id, goods_id, buy_number) {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                });
                uni.request({
                    url: app.globalData.get_request_url("stock", "cart"),
                    method: 'POST',
                    data: {
                        "id": cart_id,
                        "goods_id": goods_id,
                        "stock": buy_number
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.get_cart_data();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 购物车删除
            cart_delete(cart_id) {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                });
                uni.request({
                    url: app.globalData.get_request_url('delete', 'cart'),
                    method: 'POST',
                    data: {
                        "id": cart_id
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.get_cart_data();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 获取购物车数据、参数是否首次请求
            get_cart_data(is_first = 0) {
                uni.request({
                    url: app.globalData.get_request_url("cartdata", "detail", "realstore"),
                    method: 'POST',
                    data: this.request_params_merge({
                        "id": this.params.id || 0
                    }, 'cart'),
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            this.setData({
                                cart: res.data.data
                            });
                            this.cart_data_list_handle();

                            // 首次判断是否需要开启购物车
                            if(is_first == 1 && (this.params.is_show_cart || 0) == 1) {
                                this.setData({
                                    cart_status: true
                                });
                            }
                        } else {
                            app.globalData.showToast('请求失败，请重试！');
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 购物车更新列表数据处理
            cart_data_list_handle() {
                var temp_cart = this.cart || null;
                if(temp_cart != null) {
                    var temp_data_list = this.data_list;
                    if(temp_data_list.length > 0) {
                        for(var i in temp_data_list) {
                            temp_data_list[i]['buy_number'] = 0;
                            if(temp_cart.data.length > 0) {
                                for(var k in temp_cart.data) {
                                    if(temp_cart.data[k]['goods_id'] == temp_data_list[i]['id']) {
                                        temp_data_list[i]['buy_number'] += parseInt(temp_cart.data[k]['stock']);
                                    }
                                }
                            }
                        }
                    }
                    this.setData({
                        data_list: temp_data_list
                    });
                }
            },

            // 门店状态判断
            is_status_check() {
                if((this.info || null) == null) {
                    app.globalData.showToast('门店信息有误');
                    return false;
                } else {
                    if(this.info.status_info.status != 1) {
                        app.globalData.showToast(this.info.status_info.msg);
                        return false;
                    }
                }
                return true;
            },

            // 搜索事件
            search_button_event(e) {
                this.setData({
                    search_keywords_value: e || '',
                    data_page: 1
                });
                this.reset_scroll();
                this.get_data_list(1);
            },

            // 搜索icon扫码事件、扫码商品id实现加入购物车
            search_icon_event(e) {
                var user = app.globalData.get_user_info(this);
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=cart_buy_number_event"
                        });
                        return false;
                    } else {
                        // 门店状态
                        if(!this.is_status_check()) {
                            return false;
                        }

                        // 调用扫码
                        var self = this;
                        uni.scanCode({
                            success: function (res) {
                                uni.showLoading({
                                    title: '处理中...',
                                    mask: true
                                });
                                uni.request({
                                    url: app.globalData.get_request_url("scan", "detail", "realstore"),
                                    method: 'POST',
                                    data: self.request_params_merge({
                                        value: res.result
                                    }, 'buy'),
                                    dataType: 'json',
                                    success: res => {
                                        uni.hideLoading();
                                        if (res.data.code == 0) {
                                            if(res.data.data.is_error == 1) {
                                                app.globalData.showToast(res.data.data.is_error_msg);
                                            } else {
                                                // 加入购物车
                                                self.cart_save(res.data.data.goods_id, 1, res.data.data.spec);
                                            }
                                        } else {
                                            if (app.globalData.is_login_check(res.data)) {
                                                app.globalData.showToast(res.data.msg);
                                            } else {
                                                app.globalData.showToast('提交失败，请重试！');
                                            }
                                        }
                                    },
                                    fail: () => {
                                        uni.hideLoading();
                                        app.globalData.showToast('服务器请求出错');
                                    }
                                });
                            }
                        });
                    }
                }
            },

            // 购物车状态
            cart_event(e) {
                this.setData({
                    cart_status: !this.cart_status
                });
            },

            // 购物车结算
            buy_submit_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }

                // 门店状态
                if(!this.is_status_check()) {
                    return false;
                }

                // 获取购物车数据
                var ids = [];
                if((this.cart || null) != null) {
                    var temp_data = this.cart.data || [];
                    for (var i in temp_data) {
                        ids.push(temp_data[i]['id']);
                    }
                }
                if (ids.length <= 0) {
                    app.globalData.showToast('请先选购商品');
                    return false;
                }

                // 起步价
                var starting_price = parseFloat(this.info.starting_price) || 0;
                if(starting_price > 0 && this.cart.total_price < starting_price) {
                    // 是否限制类型
                    var limit_type = this.info.starting_price_limit_type_list || [];
                    if(limit_type.length > 0) {
                        var buy_use_type = this.info.buy_use_type_list[this.buy_use_type_index];
                        if(limit_type.indexOf(buy_use_type['index']) != -1 || limit_type.indexOf(buy_use_type['index'].toString()) != -1) {
                            app.globalData.showToast(buy_use_type['name']+'起步价'+starting_price+'元');
                            return false;
                        }
                    } else {
                        app.globalData.showToast('起步价'+starting_price+'元');
                        return false;
                    }
                }

                // 进入订单确认页面
                var data = this.request_params_merge({
                    "buy_type": "cart",
                    "ids": ids.join(',')
                }, 'buy');
                uni.navigateTo({
                    url: '/pages/buy/buy?data=' + encodeURIComponent(JSON.stringify(data))
                });
            },

            // 剪切板
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },
            
            // 地图查看
            address_map_event(e) {
                var info = this.info;
                if (info.lat == 0 || info.lng == 0) {
                    app.globalData.showToast("地址有误");
                    return false;
                }
            
                // 打开地图
                var address = (info.province_name || '') + (info.city_name || '') + (info.county_name || '') + (info.address || '');
                app.globalData.open_location(info.lng, info.lat, info.name, address);
            },

            // 电话
            tel_event(e) {
                app.globalData.call_tel(this.info.service_tel || null);
            },

            // 图片预览
            image_show_event(e) {
                app.globalData.image_show_event(e);
            },
            
            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_index: e.currentTarget.dataset.index,
                    nav_active_item_index: e.currentTarget.dataset.itemindex,
                    data_page: 1
                });
                this.reset_scroll();
                this.get_data_list(1);
            },
            
            // 重置滑动位置
            reset_scroll() {
                this.setData({
                    scroll_top: this.scroll_top_old
                });
                this.$nextTick(() => {
                    this.setData({
                        scroll_top: 0
                    });
                });
            },
            
            // 滑动事件位置记录
            scroll_event(e) {
                this.setData({
                    scroll_top_old: e.detail.scrollTop
                });
            },
            
            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },
            
            // 顶部返回操作
            top_nav_left_back_event(e) {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0]
                    });
                } else {
                    uni.navigateBack();
                }
            },
            
            // 地址信息初始化
            user_location_init() {
                var result = uni.getStorageSync(app.globalData.data.cache_userlocation_key) || null;
                var data = null;
                if (result != null) {
                    data = {
                        name: result.name || null,
                        address: result.address || null,
                        lat: result.latitude || null,
                        lng: result.longitude || null
                    };
                }
                this.setData({
                    user_location: data
                });
            },

            // 使用类型事件
            buy_use_type_event(e) {
                var self = this;
                uni.showActionSheet({
                    itemList: this.info.buy_use_type_list.map(function(v) {return v.name}),
                    success: function (res) {
                        self.setData({
                            buy_use_type_index: res.tapIndex,
                            data_page: 1
                        });
                        uni.setStorageSync(self.cache_buy_use_type_index_key, res.tapIndex);
                        self.reset_scroll();
                        self.get_data_list(1);
                        self.get_cart_data();
                    }
                });
            },

            // 获取使用类型数据索引、默认在店0
            get_buy_use_type_index() {
                var index = uni.getStorageSync(this.cache_buy_use_type_index_key);
                if((this.info || null) != null) {
                    // 用户未设置类型则使用默认的
                    if(index === null || index === '') {
                        // 是否默认类型
                        if(this.info.default_buy_use_type != undefined && this.info.default_buy_use_type != -1) {
                            // 不在店铺设置的类型列表则默认0
                            var temp_index = null;
                            for(var i in this.info.buy_use_type_list) {
                                if(this.info.buy_use_type_list[i]['index'] == this.info.default_buy_use_type) {
                                    temp_index = i;
                                }
                            }
                            if(temp_index !== null) {
                                index = temp_index;
                            }
                        }
                    }

                    // 不在店铺设置的类型列表则默认0
                    if(this.info.buy_use_type_list[index] == undefined) {
                        index = 0;
                    }
                }
                return index || 0;
            },

            // 请求参数处理
            // 默认增加使用类型参数
            // 下单 buy / 初始化 init / 获取数据 data / 获取购物车 cart
            request_params_merge(data, type = 'init') {
                // 用户使用类型
                var index = this.buy_use_type_index;
                if((this.info || null) != null && (this.info.buy_use_type_list || null) != null && this.info.buy_use_type_list.length > 0) {
                    if(this.info.buy_use_type_list[index] == undefined) {
                        index = 0;
                    }
                    data['buy_use_type_index'] = this.buy_use_type_index;
                }

                // 初始化
                if(type == 'init') {
                    // 桌码
                    if((this.params.tablecode_id || null) != null) {
                        data['tablecode_id'] = this.params.tablecode_id;
                    }
                }

                // 初始化、获取数据
                if(type == 'init' || type == 'data' || type == 'cart') {
                    // 用户选择的位置
                    var lng = 0;
                    var lat = 0;
                    if((this.user_location || null) != null) {
                        lng = this.user_location.lng || 0;
                        lat = this.user_location.lat || 0;
                    }
                    data['lng'] = lng;
                    data['lat'] = lat;
                }

                // 提交订单
                if(type == 'buy') {
                    // 门店id
                    data['realstore_id'] = this.info.id;

                    // 桌码
                    if((this.tablecode || null) != null) {
                        data['tablecode_id'] = this.tablecode.id;
                    }
                }

                return data;
            },

            // 规格选择弹层关闭
            popup_spec_close_event(e) {
                this.setData({
                    popup_spec_status: false
                });
            },

            // 规格事件
            goods_specifications_event(e) {
                var key = e.currentTarget.dataset.key || 0;
                var keys = e.currentTarget.dataset.keys || 0;
                this.goods_specifications_handle(key, keys);
            },

            // 规格选择处理
            goods_specifications_handle(key, keys) {            
                // 不能选择和禁止选择跳过
                var temp_data = this.goods_specifications_choose;
                var temp_images = this.goods_spec_base_images;
                if ((temp_data[key]['value'][keys]['is_dont'] || null) == null && (temp_data[key]['value'][keys]['is_disabled'] || null) == null) {
                    // 规格选择
                    for (var i in temp_data) {
                        for (var k in temp_data[i]['value']) {
                            if ((temp_data[i]['value'][k]['is_dont'] || null) == null && (temp_data[i]['value'][k]['is_disabled'] || null) == null) {
                                if (key == i) {
                                    if (keys == k && (temp_data[i]['value'][k]['is_active'] || null) == null) {
                                        temp_data[i]['value'][k]['is_active'] = 'cr-white bg-main br-main';
                                        if ((temp_data[i]['value'][k]['images'] || null) != null) {
                                            temp_images = temp_data[i]['value'][k]['images'];
                                        }
                                    } else {
                                        temp_data[i]['value'][k]['is_active'] = '';
                                    }
                                }
                            }
                        }
                    }
                    this.setData({
                        goods_specifications_choose: temp_data,
                        goods_spec_base_images: temp_images
                    });
            
                    // 不能选择规格处理
                    this.goods_specifications_choose_handle_dont(key);
            
                    // 获取下一个规格类型
                    this.get_goods_specifications_type(key);
            
                    // 获取规格详情
                    this.get_goods_specifications_detail();
                }
                
                // 已选择规格
                var spec_selected = [];
                for (var i in temp_data) {
                    for (var k in temp_data[i]['value']) {
                        if ((temp_data[i]['value'][k]['is_active'] || null) != null)
                        {
                            spec_selected.push(temp_data[i]['value'][k]['name']);
                        }
                    }
                }
                this.setData({
                    goods_spec_selected_text: (spec_selected.length <= 0) ? '请选择规格' : spec_selected.join(' / ')
                });
            },

            // 不能选择规格处理
            goods_specifications_choose_handle_dont(key) {
                var temp_data = this.goods_specifications_choose || [];
                if (temp_data.length <= 0) {
                    return false;
                }
            
                // 是否不能选择
                key = parseInt(key);
                for (var i in temp_data) {
                    for (var k in temp_data[i]['value']) {
                        if (i > key) {
                            temp_data[i]['value'][k]['is_dont'] = 'spec-dont-choose';
                            temp_data[i]['value'][k]['is_disabled'] = '';
                            temp_data[i]['value'][k]['is_active'] = '';
                        }
            
                        // 当只有一个规格的时候
                        if (key == 0 && temp_data.length == 1) {
                            temp_data[i]['value'][k]['is_disabled'] = (temp_data[i]['value'][k]['is_only_level_one'] || null) != null && (temp_data[i]['value'][k]['inventory'] || 0) <= 0 ? 'spec-items-disabled' : '';
                        }
                    }
                }
            
                this.setData({
                    goods_specifications_choose: temp_data
                });
            },
            
            // 获取下一个规格类型
            get_goods_specifications_type(key) {
                var temp_data = this.goods_specifications_choose;
                var active_index = parseInt(key) + 1;
                var sku_count = app.globalData.get_length(temp_data);
                if (active_index <= 0 || active_index >= sku_count) {
                    return false;
                }
                
                // 获取规格值
                var spec = [];
                for (var i in temp_data) {
                    for (var k in temp_data[i]['value']) {
                        if ((temp_data[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                "type": temp_data[i]['name'],
                                "value": temp_data[i]['value'][k]['name']
                            });
                            break;
                        }
                    }
                }
                if (spec.length <= 0) {
                    return false;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('spectype', 'goods'),
                    method: 'POST',
                    data: {
                        id: this.goods_choose_data.id,
                        spec: JSON.stringify(spec),
                        buy_use_type_index: this.buy_use_type_index,
                        realstore_id: this.info.id
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var spec_type = res.data.data.spec_type;
                            var spec_count = spec.length;
                            var index = spec_count > 0 ? spec_count : 0;
                            if (index < sku_count) {
                                for (var i in temp_data) {
                                    for (var k in temp_data[i]['value']) {
                                        if (index == i) {
                                            temp_data[i]['value'][k]['is_dont'] = '';
                                            var temp_value = temp_data[i]['value'][k]['name'];
                                            var temp_status = false;
                                            for (var t in spec_type) {
                                                if (spec_type[t] == temp_value) {
                                                    temp_status = true;
                                                    break;
                                                }
                                            }
                                            if (temp_status == true) {
                                                temp_data[i]['value'][k]['is_disabled'] = '';
                                            } else {
                                                temp_data[i]['value'][k]['is_disabled'] = 'spec-items-disabled';
                                            }
                                        }
                                    }
                                }
                                this.setData({
                                    goods_specifications_choose: temp_data
                                });
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },
            
            // 获取规格详情
            get_goods_specifications_detail() {
                // 获取规格值
                var spec = this.goods_selected_spec();
            
                // 存在规格的时候是否已完全选择规格
                var sku_count = this.goods_specifications_choose.length;
                var active_count = spec.length;
                if (spec.length <= 0 || active_count < sku_count) {
                    this.setData({
                        goods_spec_base_price: this.goods_choose_data.price,
                        goods_spec_base_original_price: this.goods_choose_data.original_price || 0,
                        goods_spec_base_inventory: this.goods_choose_data.inventory
                    });
                    return false;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('specdetail', 'goods'),
                    method: 'POST',
                    data: {
                        id: this.goods_choose_data.id,
                        spec: JSON.stringify(spec),
                        stock: 1,
                        buy_use_type_index: this.buy_use_type_index,
                        realstore_id: this.info.id
                    },
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            this.goods_spec_detail_back_handle(res.data.data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 已选的商品规格
            goods_selected_spec() {
                var spec = [];
                var temp_data = this.goods_specifications_choose;
                for (var i in temp_data) {
                    for (var k in temp_data[i]['value']) {
                        if ((temp_data[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                "type": temp_data[i]['name'],
                                "value": temp_data[i]['value'][k]['name']
                            });
                            break;
                        }
                    }
                }
                return spec;
            },
            
            // 商品规格详情返回数据处理
            goods_spec_detail_back_handle(data) {
                var spec_base = data.spec_base;
                var data = {
                    goods_spec_base_price: spec_base.price,
                    goods_spec_base_original_price: spec_base.original_price || 0,
                    goods_spec_base_inventory: parseInt(spec_base.inventory)
                };
                this.setData(data);
            },

            // 规格选择确认
            goods_spec_confirm_event(e) {
                var user = app.globalData.get_user_info(this, 'goods_spec_confirm_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=goods_spec_confirm_event"
                        });
                        return false;
                    } else {
                        // 属性
                        var temp_data = this.goods_specifications_choose;
                        var sku_count = temp_data.length;
                        var active_count = 0;
                        var spec = [];
                        if (sku_count > 0) {
                            for (var i in temp_data) {
                                for (var k in temp_data[i]['value']) {
                                    if ((temp_data[i]['value'][k]['is_active'] || null) != null) {
                                        active_count++;
                                        spec.push({
                                            "type": temp_data[i]['name'],
                                            "value": temp_data[i]['value'][k]['name']
                                        });
                                    }
                                }
                            }
            
                            if (active_count < sku_count) {
                                app.globalData.showToast('请选择规格');
                                return false;
                            }
                        }

                        // 数据操作处理
                        if(this.buy_number_event_handle(1, this.goods_choose_data, spec)) {
                            this.setData({
                                popup_spec_status: false
                            });
                        }
                    }
                }
            },

            // 规格图片查看
            goods_spec_base_images_view_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value]
                    });
                }
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