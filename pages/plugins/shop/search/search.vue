<template>
    <view :class="theme_view">
        <!-- 排序 -->
        <view class="nav-sort bg-white oh pr">
            <view class="nav-sort-content">
                <block v-for="(item, index) in search_nav_sort_list" :key="index">
                    <view class="item tc fl" :data-index="index" @tap="nav_sort_event">
                        <text class="cr-base va-m">{{item.name}}</text>
                        <image v-if="(item.icon || null) != null" class="icon va-m" :src="common_static_url + 'sort-' + item.icon + '-icon.png'" mode="aspectFill"></image>
                    </view>
                </block>
            </view>
            <image class="screening-submit pa cp" :src="common_static_url+'search-submit-icon.png'" mode="aspectFill" @tap="popup_form_event_show"></image>
            <image class="show-type-submit pa cp" :src="common_static_url+'show-'+(data_show_type_value == 0 ? 'grid' : 'list')+'-icon.png'" mode="aspectFill" @tap="data_show_type_event"></image>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main oh">
                <component-goods-list :propData="{style_type: data_show_type_value, goods_list: data_list}" :propCurrencySymbol="currency_symbol"></component-goods-list>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
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
                            <text class="fr cr-red" @tap="map_remove_event">{{$t('goods-search.goods-search.pxk051')}}</text>
                        </view>
                        <!-- 搜索关键字 -->
                        <input type="text" confirm-type="done" :placeholder="$t('search.search.723rbx')" name="wd" :value="(post_data.wd || '')" class="map-keywords wh-auto round bg-base margin-top-lg" placeholder-class="cr-grey">
                    </view>

                    <!-- 分类 -->
                    <view v-if="(search_map_list.category_list || null) != null && search_map_list.category_list.length > 0" class="map-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mt">
                        <view class="map-nav pr br-b">
                            <text>{{$t('common.category')}}</text>
                            <text class="arrow-bottom pa cr-grey" v-if="search_map_list.category_list.length > 3" @tap="more_event" data-value="category_list">{{$t('common.more')}}</text>
                        </view>
                        <view class="map-content map-text-item map-category-container oh margin-top-lg" :style="'height:' + map_fields_list.category_list.height + ';'">
                            <block v-for="(item, index) in search_map_list.category_list" :key="index">
                                <view :class="'item fl radius ' + (item.active == 1 ? 'cr-main br-main' : 'cr-base')" @tap="map_item_event" :data-value="item.id" data-field="category_list">{{item.name}}</view>
                            </block>
                        </view>
                        <block v-for="(item, index) in search_map_list.category_list" :key="index">
                            <view v-if="item.active == 1 && (item.items || null) != null && item.items.length > 0" class="map-category-two map-text-item padding-bottom">
                                <view class="bg-grey-f7 oh radius padding-sm">
                                    <block v-for="(item2, index2) in item.items" :key="index2">
                                        <view :class="'item fl radius ' + (item2.active == 1 ? 'cr-main' : 'cr-base')" @tap="map_item_event" :data-pvalue="item.id" :data-value="item2.id" data-field="category_list">{{item2.name}}</view>
                                    </block>
                                </view>
                            </view>
                        </block>
                    </view>

                    <view class="search-submit padding-main pa">
                        <button form-type="submit" class="btn bg-main cr-white text-size wh-auto round" :disabled="popup_form_loading_status" hover-class="none">{{$t('common.confirm')}}</button>
                    </view>
                </view>
            </form>
        </component-popup>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentPopup from "@/components/popup/popup";
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentGoodsList from "@/components/goods-list/goods-list";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                currency_symbol: app.globalData.currency_symbol(),
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                params: null,
                post_data: {},
                shop: null,
                is_show_popup_form: false,
                popup_form_loading_status: false,
                // 排序导航
                search_nav_sort_index: 0,
                search_nav_sort_list: [
                    { name: this.$t('goods-category.goods-category.x69aow'), field: "default", sort: "asc", "icon": null },
                    { name: this.$t('goods-category.goods-category.at5p35'), field: "sales_count", sort: "asc", "icon": "default" },
                    { name: this.$t('goods-category.goods-category.283ot0'), field: "access_count", sort: "asc", "icon": "default" },
                    { name: this.$t('goods-category.goods-category.g2u3lf'), field: "min_price", sort: "asc", "icon": "default" },
                    { name: this.$t('goods-category.goods-category.5p4ksj'), field: "id", sort: "asc", "icon": "default" }
                ],
                // 数据展示样式（0图文、1九方格）
                data_show_type_value: 1,
                // 搜素条件
                search_map_list: {
                    category_list: []
                },
                map_fields_list: {
                    category_list: {height: "82rpx", default: "82rpx", form_key: "category_ids"}
                },
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentNoData,
            componentBottomLine,
            componentGoodsList
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
                post_data: {
                    wd: params.keywords || '',
                    shop_id: params.shop_id || 0,
                    category_ids: ((params.category_id || 0) == 0) ? '' : JSON.stringify({"0":params.category_id})
                }
            });

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init_config();

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
                        currency_symbol: app.globalData.get_config('currency_symbol')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },
            
            // 初始化
            get_data() {
                var post_data = this.request_map_handle();
                uni.request({
                    url: app.globalData.get_request_url("index", "search", "shop"),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            // 分类选中处理
                            var category = data.shop_goods_category || [];
                            if((this.params.category_id || 0) != 0 && category.length > 0) {
                                for(var i in category) {
                                    category[i]['active'] = (category[i]['id'] == this.params.category_id) ? 1 : 0;
                                    if((category[i]['items'] || null) != null && category[i]['items'].length > 0) {
                                        for(var x in category[i]['items']) {
                                            category[i]['items'][x]['active'] = (category[i]['items'][x]['id'] == this.params.category_id) ? 1 : 0;
                                        }
                                    }
                                }
                            }
                            this.setData({
                                shop: data.shop || null,
                                search_map_info: data.search_map_info || [],
                                search_map_list: {
                                    category_list: category
                                }
                            });

                            if((this.shop || null) != null) {
                                // 获取列表数据
                                this.get_data_list(1);
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_bottom_line_status: false
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
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
                if(this.data_is_loading == 1) {
                    return false;
                }
                this.setData({data_is_loading: 1});
                
                // 获取数据
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                var post_data = this.request_map_handle();
                uni.request({
                    url: app.globalData.get_request_url("datalist", "search", "shop"),
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
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_total: 0,
                                    data_is_loading: 0
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
                                data_is_loading: 0
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            },

            // 搜索条件处理
            request_map_handle() {
                var params = this.params;
                var post_data = this.post_data;
                post_data['page'] = this.data_page;
                
                // 店铺id
                post_data['shop_id'] = params['shop_id'] || 0;

                // 搜索条件
                var temp_field = this.map_fields_list;
                var temp_list = this.search_map_list;
                for (var i in temp_field) {
                    if (temp_list[i] != null != null && temp_list[i].length > 0) {
                        var value = '';
                        for (var k in temp_list[i]) {
                            if ((temp_list[i][k]['active'] || 0) == 1) {
                                value = temp_list[i][k]['id'];
                                if((temp_list[i][k]['items'] || null) != null) {
                                    for(var x in temp_list[i][k]['items']) {
                                        if ((temp_list[i][k]['items'][x]['active'] || 0) == 1) {
                                            value = temp_list[i][k]['items'][x]['id'];
                                        }
                                    }
                                }
                            }
                        }
                        post_data[temp_field[i]['form_key']] = value;
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
                if((this.shop || null) != null) {
                    // 基础自定义分享
                    var shop_id = this.shop.id;
                    var category_id = this.params.category_id || 0;
                    var keywords = this.post_data.wd || '';
                    this.setData({
                        share_info: {
                            title: this.shop.seo_title || this.shop.name,
                            desc: this.shop.seo_desc || this.shop.describe,
                            path: '/pages/plugins/shop/search/search',
                            query: 'shop_id='+shop_id+'&category_id='+category_id+'&keywords='+keywords,
                            img: this.shop.logo
                        }
                    });
                }

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
                var pvalue = e.currentTarget.dataset.pvalue;
                var value = e.currentTarget.dataset.value;
                var field = e.currentTarget.dataset.field;
                var temp_list = this.search_map_list;
                if ((temp_list[field] || null) != null) {
                    if(pvalue === undefined) {
                        for(var i in temp_list[field]) {
                            temp_list[field][i]['active'] = (temp_list[field][i]['id'] == value) ? (temp_list[field][i]['active'] == 1 ? 0 : 1) : 0;
                            // 当前没有选中则取消子级数据的选中
                            if(temp_list[field][i]['active'] == 0 && (temp_list[field][i]['items'] || null) != null) {
                                for(var x in temp_list[field][i]['items']) {
                                    temp_list[field][i]['items'][x]['active'] = 0;
                                }
                            }
                        }
                    } else {
                        for(var i in temp_list[field]) {
                            temp_list[field][i]['active'] = (temp_list[field][i]['id'] == pvalue) ? 1 : 0;
                            if((temp_list[field][i]['items'] || null) != null) {
                                for(var x in temp_list[field][i]['items']) {
                                    temp_list[field][i]['items'][x]['active'] = (temp_list[field][i]['items'][x]['id'] == value) ? (temp_list[field][i]['items'][x]['active'] == 1 ? 0 : 1) : 0;
                                    // 选中父级
                                    if(temp_list[field][i]['items'][x]['active'] == 1) {
                                        temp_list[field][i]['active'] = 1;
                                    }
                                }
                            }
                        }
                    }
                    this.setData({
                        search_map_list: temp_list,
                    });
                }
            },

            // 条件-清空
            map_remove_event(e) {
                var temp_list = this.search_map_list;
                var temp_post = this.post_data;
                
                // 关键字
                temp_post['wd'] = '';
                
                // 分类
                for (var i in temp_list) {
                    if((temp_list[i] || null) != null && temp_list[i].length > 0) {
                        for(var k in temp_list[i]) {
                            temp_list[i][k]['active'] = 0;
                            if((temp_list[i][k]['items'] || null) != null) {
                                for(var x in temp_list[i][k]['items']) {
                                    temp_list[i][k]['items'][x]['active'] = 0;
                                }
                            }
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
                this.setData({data_show_type_value: this.data_show_type_value == 0 ? 1 : 0});
            }
        }
    };
</script>
<style>
    @import './search.css';
</style>