<template>
    <view>
        <block v-if="(label || null) != null">
            <!-- 基础 -->
            <view class="label-info bg-white padding-horizontal-main padding-top-main padding-bottom-sm">
                <text class="round cr-white bg-main padding-left-lg padding-right-lg padding-top-xs padding-bottom-xs">{{label.name}}</text>
                <text class="cr-gray margin-left-sm">共有<text class="cr-main fw-b margin-left-xs margin-right-xs">{{data_total}}</text>条相关商品</text>
            </view>
            
            <!-- 排序 -->
            <view class="nav-sort bg-white oh">
                <view class="nav-sort-content">
                    <block v-for="(item, index) in search_nav_sort_list" :key="index">
                        <view class="item tc fl" :data-index="index" @tap="nav_sort_event">
                            <text class="cr-base va-m">{{item.name}}</text>
                            <image v-if="(item.icon || null) != null" class="icon va-m" :src="common_static_url + 'sort-' + item.icon + '-icon.png'" mode="aspectFill"></image>
                        </view>
                    </block>
                </view>
            </view>

            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main bg-white margin-bottom-main oh">
                        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.id" hover-class="none">
                            <image :src="item.images" mode="aspectFit"></image>
                            <view class="base margin-top tl">
                                <view class="multi-text">{{item.title}}</view>
                                <view class="price margin-top">
                                    <text class="sales-price">{{currency_symbol}}{{item.min_price}}</text>
                                </view>
                            </view>
                        </navigator>
                    </view>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
            </scroll-view>
        </block>

        <!-- 提示信息 -->
        <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                label: null,
                search_nav_sort_list: [
                    { name: "综合", field: "default", sort: "asc", "icon": null },
                    { name: "销量", field: "sales", sort: "asc", "icon": "default" },
                    { name: "热度", field: "access", sort: "asc", "icon": "default" },
                    { name: "价格", field: "price", sort: "asc", "icon": "default" },
                    { name: "最新", field: "new", sort: "asc", "icon": "default" }
                ],
                search_nav_sort_value: '',
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            // 启动参数处理
            params = app.globalData.launch_params_handle(params);

            // 初始参数
            this.setData({
                params: params
            });

            // 分享菜单
            app.globalData.show_share_menu();
        },

        onShow() {
            // 数据加载
            this.get_data();
            
            // 初始化配置
            this.init_config();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },

        // 自定义分享
        onShareAppMessage() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            var id = this.params.id || 0;
            return {
                title: this.label.seo_title || this.label.name || app.globalData.data.application_title,
                desc: this.label.seo_desc || app.globalData.data.application_describe,
                path: '/pages/plugins/label/detail/detail?id='+id+'&referrer=' + user_id
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            var id = this.params.id || 0;
            return {
                title: this.label.name || app.globalData.data.application_title,
                query: 'id='+id+'&referrer=' + user_id
            };
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

            // 获取数据
            get_data() {
                uni.showLoading({
                    title: "加载中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("detailinit", "index", "label"),
                    method: "POST",
                    data: {id: this.params.id || 0},
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var label = data.label || null;
                            this.setData({
                                data_base: data.base || null,
                                label: label,
                                data_list_loding_status: (label == null) ? 0 : 3,
                                data_list_loding_msg: '标签数据不存在',
                            });
                            
                            // 标题名称
                            if ((this.data_base || null) != null && (this.data_base.application_name || null) != null) {
                                uni.setNavigationBarTitle({
                                    title: this.data_base.application_name
                                });
                            }
                            
                            // 获取列表数据
                            this.get_data_list(1);
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
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 是否存在标签数据
                if((this.label || null) == null) {
                    uni.stopPullDownRefresh();
                    return false;
                }
                
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                
                // 获取数据
                uni.showLoading({
                    title: "加载中...",
                    mask: true
                });
                uni.request({
                    url: app.globalData.get_request_url("detailgoodslist", "index", "label"),
                    method: "POST",
                    data: {
                        id: this.params.id || 0,
                        page: this.data_page,
                        ov: this.search_nav_sort_value
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list;
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
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 排序事件
            nav_sort_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var temp_post_data = this.post_data;
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
                    search_nav_sort_value: temp_search_nav_sort[index]['field']+'-'+temp_sort,
                    search_nav_sort_list: temp_search_nav_sort,
                    data_page: 1
                });
                this.get_data_list(1);
            }
        }
    };
</script>
<style>
    @import './detail.css';
</style>