<template>
    <view :class="theme_view">
        <view class="bg-white">
            <!-- 搜索关键字 -->
            <view class="padding-horizontal-main padding-top-main padding-bottom-sm pr">
                <view class="top-search-input">
                    <component-search :propDefaultValue="post_data.wd || ''" propBrColor="#ddd" @onsearch="search_input_confirm_event" :propIsOnEvent="true" @oninput="search_input_value_event" :propIsOnInputEvent="true"
                        @onfocus="search_input_focus_event" :propIsOnFocusEvent="true" @onblur="search_input_blur_event" :propIsOnBlurEvent="true" :propIsRequired="false"
                        :propPlaceholder="$t('customview.customview.726k7y')"></component-search>
                </view>
                <view class="pa top-search-right">
                    <view v-if="top_search_right_type_status" class="pr cp" @tap="search_submit_confirm_event">
                        <uni-icons type="search" size="60rpx" color="#bbb"></uni-icons>
                    </view>
                    <view v-if="!top_search_right_type_status" class="pr cp" data-value="/pages/cart-page/cart-page" @tap="url_event">
                        <uni-icons type="cart" size="60rpx" color="#bbb"></uni-icons>
                        <view v-if="top_right_cart_total != 0" class="badge-icon pa">
                            <component-badge :propNumber="top_right_cart_total"></component-badge>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 排序 -->
            <view class="nav-sort oh pr">
                <view class="nav-sort-content">
                    <block v-for="(item, index) in search_nav_sort_list" :key="index">
                        <view class="item tc fl cp" :data-index="index" @tap="nav_sort_event">
                            <text class="cr-base va-m text-size-sm">{{item.name}}</text>
                            <image v-if="(item.icon || null) != null" class="icon va-m" :src="common_static_url + 'sort-' + item.icon + '-icon.png'" mode="aspectFill"></image>
                        </view>
                    </block>
                </view>
                <image class="screening-submit pa cp" :src="common_static_url+'search-submit-icon.png'" mode="aspectFill" @tap="popup_form_event_show"></image>
                <image class="show-type-submit pa cp" :src="common_static_url+'show-'+(data_show_type_value == 0 ? 'list' : 'grid')+'-icon.png'" mode="aspectFill" @tap="data_show_type_event"></image>
            </view>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main oh">
                <component-goods-list :propData="{style_type: (data_show_type_value) == 0 ? 1 : 0, goods_list: data_list, random: random_value}" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol"
                    :propIsCartParaCurve="true"></component-goods-list>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

        <!-- 筛选条件 popup -->
        <component-popup :propShow="is_show_popup_form" propPosition="left" @onclose="popup_form_event_close">
            <form @submit="form_submit_event" class="popup-form oh">
                <view class="search-map padding-main bg-base">
                    <view class="padding-main border-radius-main bg-white">
                        <view class="map-item map-base br-b">
                            <text>{{$t('goods-search.goods-search.j8o278')}}</text>
                            <text class="cr-main"> {{data_total}} </text>
                            <text>{{$t('goods-search.goods-search.t9nikq')}}</text>
                            <text class="fr cr-red cp" @tap="map_remove_event">{{$t('goods-search.goods-search.pxk051')}}</text>
                        </view>
                        <!-- 搜索关键字 -->
                        <input type="text" confirm-type="search" :placeholder="$t('customview.customview.726k7y')" name="wd" :value="(post_data.wd || '')" class="map-keywords wh-auto round bg-base margin-top-lg"
                            placeholder-class="cr-grey">
                    </view>

                    <!-- 品牌 -->
                    <view v-if="((search_map_list.brand_list || null) != null && search_map_list.brand_list.length > 0) || ((search_map_info.brand || null) != null)"
                        class="map-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mt">
                        <view class="map-nav br-b pr">
                            <text>{{$t('goods-search.goods-search.6n8316')}}</text>
                            <text class="arrow-bottom pa cr-grey cp" v-if="search_map_list.brand_list.length > 3" @tap="more_event" data-value="brand_list">{{$t('common.more')}}</text>
                        </view>
                        <view v-if="(search_map_info.brand || null) != null && (params.brand || null) != null" class="map-content brand-info oh margin-top-lg">
                            <image v-if="(search_map_info.brand.logo || null) != null" :src="search_map_info.brand.logo" mode="aspectFit" class="fl"></image>
                            <view v-else class="info-logo-empty tc fl">{{search_map_info.brand.name}}</view>
                            <view class="info-right fr">
                                <view v-if="(search_map_info.brand.logo || null) != null" class="info-name">{{search_map_info.brand.name}}</view>
                                <view v-if="(search_map_info.brand.describe || null) != null" class="info-desc multi-text cr-grey">{{search_map_info.brand.describe}}</view>
                            </view>
                        </view>
                        <view v-else class="map-content map-images-text-item map-brand-container oh margin-top-lg" :style="'height:' + map_fields_list.brand_list.height + ';'">
                            <block v-for="(item, index) in search_map_list.brand_list" :key="index">
                                <view :class="'item fl cr-base radius cp single-text tc '+  (index > 0 ? 'margin-left-sm ' : '') + (item.active == 1 ? 'cr-main br-main' : '')" @tap="map_item_event" :data-index="index"
                                    data-field="brand_list">
                                    <image v-if="(item.logo || null) != null" :src="item.logo" mode="aspectFit"></image>
                                    <text v-else>{{item.name}}</text>
                                </view>
                            </block>
                        </view>
                    </view>

                    <!-- 分类 -->
                    <view v-if="(search_map_list.category_list || null) != null && search_map_list.category_list.length > 0"
                        class="map-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mt">
                        <view class="map-nav pr br-b">
                            <text>{{$t('common.category')}}</text>
                            <text class="arrow-bottom pa cr-grey cp" v-if="search_map_list.category_list.length > 3" @tap="more_event" data-value="category_list">{{$t('common.more')}}</text>
                        </view>
                        <view class="map-content map-text-item map-category-container oh margin-top-lg" :style="'height:' + map_fields_list.category_list.height + ';'">
                            <block v-for="(item, index) in search_map_list.category_list" :key="index">
                                <view :class="'item fl cr-base radius cp margin-right-sm ' + (item.active == 1 ? 'cr-main br-main' : '')" @tap="map_item_event" :data-index="index" data-field="category_list">
                                    {{item.name}}</view>
                            </block>
                        </view>
                    </view>

                    <!-- 价格 -->
                    <view v-if="(search_map_list.screening_price_list || null) != null && search_map_list.screening_price_list.length > 0"
                        class="map-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mt">
                        <view class="map-nav br-b pr">
                            <text>{{$t('goods-category.goods-category.g2u3lf')}}</text>
                            <text class="arrow-bottom pa cr-grey cp" v-if="search_map_list.screening_price_list.length > 3" @tap="more_event" data-value="screening_price_list">{{$t('common.more')}}</text>
                        </view>
                        <view class="map-content map-text-item screening-price-container oh margin-top-lg" :style="'height:' + map_fields_list.screening_price_list.height + ';'">
                            <block v-for="(item, index) in search_map_list.screening_price_list" :key="index">
                                <view :class="'item fl cr-base radius cp margin-right-sm ' + (item.active == 1 ? 'cr-main br-main' : '')" @tap="map_item_event" :data-index="index" data-field="screening_price_list">
                                    {{item.name}}</view>
                            </block>
                        </view>
                    </view>

                    <!-- 商品产地 -->
                    <view v-if="(search_map_list.goods_place_origin_list || null) != null && search_map_list.goods_place_origin_list.length > 0"
                        class="map-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mt">
                        <view class="map-nav br-b pr">
                            <text>{{$t('goods-search.goods-search.4eerty')}}</text>
                            <text class="arrow-bottom pa cr-grey cp" v-if="search_map_list.goods_place_origin_list.length > 3" @tap="more_event" data-value="goods_place_origin_list">{{$t('common.more')}}</text>
                        </view>
                        <view class="map-content map-text-item screening-price-container oh margin-top-lg" :style="'height:' + map_fields_list.goods_place_origin_list.height + ';'">
                            <block v-for="(item, index) in search_map_list.goods_place_origin_list" :key="index">
                                <view :class="'item fl cr-base radius cp margin-right-sm ' + (item.active == 1 ? 'cr-main br-main' : '')" @tap="map_item_event" :data-index="index" data-field="goods_place_origin_list">
                                    {{item.name}}</view>
                            </block>
                        </view>
                    </view>

                    <!-- 属性 -->
                    <view v-if="(search_map_list.goods_params_list || null) != null && search_map_list.goods_params_list.length > 0"
                        class="map-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mt">
                        <view class="map-nav br-b pr">
                            <text>{{$t('goods-search.goods-search.v6e5b7')}}</text>
                            <text class="arrow-bottom pa cr-grey cp" v-if="search_map_list.goods_params_list.length > 3" @tap="more_event" data-value="goods_params_list">{{$t('common.more')}}</text>
                        </view>
                        <view class="map-content map-text-item goods-params-container oh margin-top-lg" :style="'height:' + map_fields_list.goods_params_list.height + ';'">
                            <block v-for="(item, index) in search_map_list.goods_params_list" :key="index">
                                <view :class="'item fl cr-base radius cp margin-right-sm ' + (item.active == 1 ? 'cr-main br-main' : '')" @tap="map_item_event" :data-index="index" data-field="goods_params_list">
                                    {{item.value}}</view>
                            </block>
                        </view>
                    </view>

                    <!-- 规格 -->
                    <view v-if="(search_map_list.goods_spec_list || null) != null && search_map_list.goods_spec_list.length > 0"
                        class="map-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mt">
                        <view class="map-nav br-b pr">
                            <text>{{$t('goods-detail.goods-detail.u401fi')}}</text>
                            <text class="arrow-bottom pa cr-grey cp" v-if="search_map_list.goods_spec_list.length > 3" @tap="more_event" data-value="goods_spec_list">{{$t('common.more')}}</text>
                        </view>
                        <view class="map-content map-text-item goods-spec-container oh margin-top-lg" :style="'height:' + map_fields_list.goods_spec_list.height + ';'">
                            <block v-for="(item, index) in search_map_list.goods_spec_list" :key="index">
                                <view :class="'item fl cr-base radius cp margin-right-sm ' + (item.active == 1 ? 'cr-main br-main' : '')" @tap="map_item_event" :data-index="index" data-field="goods_spec_list">
                                    {{item.value}}</view>
                            </block>
                        </view>
                    </view>

                    <view class="search-submit padding-main pa">
                        <button form-type="submit" class="bg-main cr-white text-size wh-auto round" :disabled="popup_form_loading_status" hover-class="none">{{$t('common.confirm')}}</button>
                    </view>
                </view>
            </form>
        </component-popup>

        <!-- 快捷导航 -->
        <component-quick-nav></component-quick-nav>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentQuickNav from "@/components/quick-nav/quick-nav";
    import componentPopup from "@/components/popup/popup";
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentGoodsList from "@/components/goods-list/goods-list";
    import componentSearch from "@/components/search/search";
    import componentBadge from "@/components/badge/badge";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                params: null,
                post_data: {},
                is_show_popup_form: false,
                popup_form_loading_status: false,
                top_search_right_type_status: false,
                load_status: 0,
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
                // 购物车
                top_right_cart_total: 0,
                // 自定义分享信息
                share_info: {},
                // 排序导航
                search_nav_sort_index: 0,
                search_nav_sort_list: [{
                        name: this.$t('goods-category.goods-category.x69aow'),
                        field: 'default',
                        sort: 'asc',
                        icon: null
                    },
                    {
                        name: this.$t('goods-category.goods-category.at5p35'),
                        field: 'sales_count',
                        sort: 'asc',
                        icon: 'default'
                    },
                    {
                        name: this.$t('goods-category.goods-category.283ot0'),
                        field: 'access_count',
                        sort: 'asc',
                        icon: 'default'
                    },
                    {
                        name: this.$t('goods-category.goods-category.g2u3lf'),
                        field: 'min_price',
                        sort: 'asc',
                        icon: 'default'
                    },
                    {
                        name: this.$t('goods-category.goods-category.5p4ksj'),
                        field: 'id',
                        sort: 'asc',
                        icon: 'default'
                    }
                ],
                // 数据展示样式（0九方格、1图文）
                data_show_type_value: 0,
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
                // 搜素条件
                search_map_list: {
                    brand_list: [],
                    category_list: [],
                    screening_price_list: [],
                    goods_place_origin_list: [],
                    goods_params_list: [],
                    goods_spec_list: []
                },
                search_map_info: [],
                map_fields_list: {
                    brand_list: {
                        height: "96rpx",
                        default: "96rpx",
                        form_key: "brand_ids"
                    },
                    category_list: {
                        height: "82rpx",
                        default: "82rpx",
                        form_key: "category_ids"
                    },
                    screening_price_list: {
                        height: "82rpx",
                        default: "82rpx",
                        form_key: "screening_price_values"
                    },
                    goods_place_origin_list: {
                        height: "82rpx",
                        default: "82rpx",
                        form_key: "place_origin_ids"
                    },
                    goods_params_list: {
                        height: "82rpx",
                        default: "82rpx",
                        form_key: "goods_params_values"
                    },
                    goods_spec_list: {
                        height: "82rpx",
                        default: "82rpx",
                        form_key: "goods_spec_values"
                    }
                },
                // 标签插件
                plugins_label_data: null
            };
        },

        components: {
            componentCommon,
            componentQuickNav,
            componentPopup,
            componentNoData,
            componentBottomLine,
            componentGoodsList,
            componentSearch,
            componentBadge
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 设置参数
            this.setData({
                params: params,
                post_data: {
                    wd: params.keywords || ''
                }
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init_config();

            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        data_show_type_value: parseInt(app.globalData.get_config('config.home_search_goods_show_type', 0))
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                // 获取数据
                this.get_data();
            },

            // 初始化数据
            get_data() {
                var post_data = this.request_map_handle();
                uni.request({
                    url: app.globalData.get_request_url("index", "search"),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var temp_load_status = this.load_status;
                            var data = res.data.data;
                            this.setData({
                                search_map_info: data.search_map_info || [],
                                search_map_list: {
                                    brand_list: data.brand_list || [],
                                    category_list: data.category_list || [],
                                    screening_price_list: data.screening_price_list || [],
                                    goods_place_origin_list: data.goods_place_origin_list || [],
                                    goods_params_list: data.goods_params_list || [],
                                    goods_spec_list: data.goods_spec_list || []
                                },
                                load_status: 1,
                                top_right_cart_total: data.cart_total.buy_number || 0,
                                plugins_label_data: (data.plugins_label_data || null) == null || (data.plugins_label_data.base || null) == null || (data.plugins_label_data.data ||
                                    null) == null || data.plugins_label_data.data.length <= 0 ? null : data.plugins_label_data
                            });

                            // 获取数据列表
                            if (temp_load_status == 0) {
                                this.get_data_list(1);
                            } else {
                                // 如果购物车为0则处理列表，避免存在购物车数量
                                if (this.top_right_cart_total == 0 && this.data_list.length > 0) {
                                    var temp_data_list = this.data_list;
                                    for (var i in temp_data_list) {
                                        temp_data_list[i]['user_cart_count'] = '';
                                    }
                                    this.setData({
                                        data_list: temp_data_list,
                                        random_value: Math.random()
                                    });
                                }
                            }

                            // 导航购物车处理
                            this.set_tab_bar_badge_handle();
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.is_login_check(res.data, this, 'get_data');
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    }
                });
            },

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 基础自定义分享
                this.share_info_handle();

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1
                });

                // 获取数据
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                var post_data = this.request_map_handle();
                uni.request({
                    url: app.globalData.get_request_url("datalist", "search"),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: res => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
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
                                    random_value: Math.random(),
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_list_loding_msg: '',
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0
                            });
                            app.globalData.is_login_check(res.data, this, 'get_data_list', is_mandatory);
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_is_loading: 0
                        });
                    }
                });
            },

            // 搜索条件处理
            request_map_handle() {
                var params = this.params;
                var post_data = this.post_data;
                post_data['page'] = this.data_page;

                // 指定分类、品牌
                post_data['category_id'] = params['category_id'] || 0;
                post_data['brand'] = params['brand'] || 0;

                // 搜索条件
                var temp_field = this.map_fields_list;
                var temp_list = this.search_map_list;
                for (var i in temp_field) {
                    if (temp_list[i] != null != null && temp_list[i].length > 0) {
                        var temp = {};
                        var index = 0;
                        for (var k in temp_list[i]) {
                            if ((temp_list[i][k]['active'] || 0) == 1) {
                                switch (i) {
                                    // 价格
                                    case 'screening_price_list':
                                        temp[index] = temp_list[i][k]['min_price'] + '-' + temp_list[i][k]['max_price'];
                                        break;
                                        // 属性、规格
                                    case 'goods_params_list':
                                    case 'goods_spec_list':
                                        temp[index] = temp_list[i][k]['value'];
                                        break;
                                        // 默认取值id
                                    default:
                                        temp[index] = temp_list[i][k]['id'];
                                }
                                index++;
                            }
                        }
                        post_data[temp_field[i]['form_key']] = app.globalData.get_length(temp) > 0 ? JSON.stringify(temp) : '';
                    }
                }

                // 排序
                var temp_index = this.search_nav_sort_index;
                var temp_search_nav_sort = this.search_nav_sort_list;
                post_data['order_by_type'] = temp_search_nav_sort[temp_index]['sort'] == 'desc' ? 'asc' : 'desc';
                post_data['order_by_field'] = temp_search_nav_sort[temp_index]['field'];

                return post_data;
            },

            // 分享设置处理
            share_info_handle() {
                var category_id = this.params.category_id || 0;
                var brand = this.params.brand || 0;
                var keywords = this.post_data.wd || '';
                this.setData({
                    share_info: {
                        path: '/pages/goods-search/goods-search',
                        query: 'category_id=' + category_id + '&brand=' + brand + '&keywords=' + keywords
                    }
                });

                // 分享菜单处理
                app.globalData.page_share_handle(this.share_info);
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 搜索条件
            form_submit_event(e) {
                this.setData({
                    post_data: e.detail.value,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
                this.popup_form_event_close();
            },

            // 筛选条件关闭
            popup_form_event_close(e) {
                this.setData({
                    is_show_popup_form: false
                });
            },

            // 筛选条件开启
            popup_form_event_show(e) {
                this.setData({
                    is_show_popup_form: true
                });
            },

            // 排序事件
            nav_sort_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var temp_search_nav_sort = this.search_nav_sort_list;
                var temp_sort = temp_search_nav_sort[index]['sort'] == 'desc' ? 'asc' : 'desc';
                for (var i in temp_search_nav_sort) {
                    if (i != index) {
                        if (temp_search_nav_sort[i]['icon'] != null) {
                            temp_search_nav_sort[i]['icon'] = 'default';
                        }
                        temp_search_nav_sort[i]['sort'] = 'desc';
                    }
                }
                temp_search_nav_sort[index]['sort'] = temp_sort;
                if (temp_search_nav_sort[index]['icon'] != null) {
                    temp_search_nav_sort[index]['icon'] = temp_sort;
                }

                this.setData({
                    search_nav_sort_index: index,
                    search_nav_sort_list: temp_search_nav_sort,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 条件-更多数据展示事件
            more_event(e) {
                var value = e.currentTarget.dataset.value || null;
                var temp_more = this.map_fields_list;
                if (value != null && (temp_more[value] || null) != null) {
                    temp_more[value]['height'] = temp_more[value]['height'] == 'auto' ? temp_more[value]['default'] : 'auto';
                    this.setData({
                        map_fields_list: temp_more
                    });
                }
            },

            // 条件-选择事件
            map_item_event(e) {
                var index = e.currentTarget.dataset.index;
                var field = e.currentTarget.dataset.field;
                var temp_list = this.search_map_list;
                if ((temp_list[field] || null) != null && (temp_list[field][index] || null) != null) {
                    temp_list[field][index]['active'] = (temp_list[field][index]['active'] || 0) == 0 ? 1 : 0;
                    this.setData({
                        search_map_list: temp_list
                    });
                }
            },

            // 条件-清空
            map_remove_event(e) {
                var temp_list = this.search_map_list;
                var temp_post = this.post_data;

                // 关键字
                temp_post['wd'] = '';

                // 品牌、分类、价格、属性、规格
                for (var i in temp_list) {
                    if ((temp_list[i] || null) != null && temp_list[i].length > 0) {
                        for (var k in temp_list[i]) {
                            temp_list[i][k]['active'] = 0;
                        }
                    }
                }

                // 排序导航
                var temp_search_nav_sort = this.search_nav_sort_list;
                for (var i in temp_search_nav_sort) {
                    temp_search_nav_sort[i]['sort'] = 'asc';
                    temp_search_nav_sort[i]['icon'] = (temp_search_nav_sort[i]['field'] == 'default') ? null : 'default';
                }

                // 关闭弹窗、分页恢复1页、重新获取数据
                this.setData({
                    search_map_list: temp_list,
                    post_data: temp_post,
                    is_show_popup_form: false,
                    search_nav_sort_list: temp_search_nav_sort,
                    search_nav_sort_index: 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 数据展示类型
            data_show_type_event(e) {
                this.setData({
                    data_show_type_value: this.data_show_type_value == 0 ? 1 : 0
                });
            },

            // 购物车导航角标
            set_tab_bar_badge_handle() {
                app.globalData.set_tab_bar_badge('cart', this.top_right_cart_total);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 搜索输入事件
            search_input_value_event(value) {
                var temp_post = this.post_data;
                temp_post['wd'] = value;
                this.setData({
                    post_data: temp_post
                });
            },

            // 搜索输入框输入失去焦点事件
            search_input_blur_event(value) {
                if (value == '') {
                    this.setData({
                        top_search_right_type_status: false
                    });
                }
            },

            // 搜索输入框输入获取焦点事件
            search_input_focus_event() {
                this.setData({
                    top_search_right_type_status: true
                });
            },

            // 搜索输入确认事件
            search_input_confirm_event(value) {
                var temp_post = this.post_data;
                temp_post['wd'] = value;
                this.setData({
                    top_search_right_type_status: false,
                    post_data: temp_post,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 搜索确认事件
            search_submit_confirm_event() {
                this.setData({
                    top_search_right_type_status: false,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 购物车总数处理
            goods_cart_count_handle(cart_number) {
                this.setData({
                    top_right_cart_total: cart_number
                });
                // 导航购物车处理
                this.set_tab_bar_badge_handle();
            }
        }
    };
</script>
<style>
    @import './goods-search.css';
</style>