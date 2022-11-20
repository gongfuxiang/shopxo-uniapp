<template>
    <view>
        <view v-if="(data_base || null) != null">
            <!-- 顶部 -->
            <view class="bg-white padding-top-main padding-horizontal-main">
                <!-- 位置 -->
                <view class="nav-location dis-inline-block round single-text cr-base" @tap="choose_location_event">
                    <view class="dis-inline-block va-m">
                        <uni-icons type="map-pin-ellipse" size="12" color="#888"></uni-icons>
                    </view>
                    <text class="va-m margin-left-xs">
                        <block v-if="(user_location || null) != null">{{user_location.name || user_location.address || ''}}</block>
                        <block v-else>未选择位置</block>
                    </text>
                </view>
                <!-- 搜索 -->
                <view class="nav-search fr">
                    <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" :propDefaultValue="search_keywords_value" propPlaceholder="输入门店名称" propPlaceholderClass="cr-grey"></component-search>
                </view>
            </view>

            <!-- 分类 -->
            <scroll-view v-if="(category || null) != null && category.length > 0" class="nav-base scroll-view-horizontal bg-white oh" scroll-x="true">
                <view :class="'item cr-gray dis-inline-block padding-horizontal-main ' + (nav_active_value == 0 ? 'cr-main' : '')" @tap="nav_event" data-value="0">全部</view>
                <block v-for="(item, index) in category" :key="index">
                    <view :class="'item cr-gray dis-inline-block padding-horizontal-main ' + (nav_active_value == item.id ? 'cr-main' : '')" @tap="nav_event" :data-value="item.id">{{item.name}}</view>
                </block>
            </scroll-view>
            
            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="30">
                <block v-if="(data_list || null) != null && data_list.length > 0">
                    <component-realstore-list :propDataList="data_list" :propFavorUser="favor_user"></component-realstore-list>
                </block>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </scroll-view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";
    import componentSearch from "../../../../components/search/search";
    import componentRealstoreList from "../../../../components/realstore-list/realstore-list";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                params: null,
                data_base: null,
                category: [],
                search_keywords_value: '',
                nav_active_value: 0,
                favor_user: [],
                // 用户位置信息
                user_location: null,
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentSearch,
            componentRealstoreList
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params,
                search_keywords_value: params.keywords || '',
                nav_active_value: params.category_id || 0,
            });
            
            // 数据加载
            this.get_data();
        },
        
        onShow() {
            // 用户位置初始化
            this.user_location_init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化
            get_data() {
                uni.showLoading({
                    title: '加载中...'
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "search", "realstore"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                category: data.category || [],
                                favor_user: data.favor_user || [],
                            });
                            
                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.search_keywords_value || this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/realstore/search/search',
                                        query: 'category_id='+this.nav_active_value+'&keywords='+this.search_keywords_value
                                    }
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
                        
                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast('服务器请求出错');
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
                
                // 加载loding
                uni.showLoading({
                    title: '加载中...'
                });
                
                // 用户位置
                var lng = 0;
                var lat = 0;
                if((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("datalist", "search", "realstore"),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        keywords: this.search_keywords_value,
                        category_id: this.nav_active_value || 0,
                        lng: lng,
                        lat: lat
                    },
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
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_value: e.currentTarget.dataset.value || 0,
                    data_page: 1
                });
                this.get_data_list(1);
            },
            
            // 搜索事件
            search_button_event(e) {
                this.setData({
                    search_keywords_value: e || '',
                    data_page: 1
                });
                this.get_data_list(1);
            },
            
            // 选择地理位置
            choose_location_event(e) {
                uni.navigateTo({
                    url: '/pages/common/open-setting-location/open-setting-location'
                });
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
            }
        }
    };
</script>
<style>
    @import './search.css';
</style>