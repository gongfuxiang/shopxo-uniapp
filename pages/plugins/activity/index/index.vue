<template>
    <view>
        <view v-if="(data_base || null) != null">
            <!-- 轮播 -->
            <view v-if="slider_list.length > 0" class="padding-horizontal-main padding-top-main">
                <component-banner :prop-data="slider_list" prop-size="mini"></component-banner>
            </view>

            <!-- 分类 -->
            <scroll-view v-if="(activity_category || null) != null && activity_category.length > 0" class="nav-list scroll-view-horizontal bg-white oh" scroll-x="true">
                <view :class="'item cr-gray dis-inline-block padding-horizontal-main ' + (nav_active_value == 0 ? 'cr-main' : '')" @tap="nav_event" data-value="0">全部</view>
                <block v-for="(item, index) in activity_category" :key="index">
                    <view :class="'item cr-gray dis-inline-block padding-horizontal-main ' + (nav_active_value == item.id ? 'cr-main' : '')" @tap="nav_event" :data-value="item.id">{{item.name}}</view>
                </block>
            </scroll-view>
            
            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
                <view v-if="(data_list || null) != null && data_list.length > 0" class="data-list padding-horizontal-main padding-top-main oh">
                    <block v-for="(item, index) in data_list" :key="index">
                        <view class="item border-radius-main bg-white oh spacing-mb">
                            <navigator :url="'/pages/plugins/activity/detail/detail?id=' + item.id" hover-class="none">
                                <image :src="item.cover" mode="aspectFit"></image>
                                <view class="padding-main tc">
                                    <view class="single-text fw-b cr-base">{{item.title}}</view>
                                    <view class="multi-text cr-grey margin-top-sm">{{item.describe}}</view>
                                </view>
                            </navigator>
                        </view>
                    </block>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
            </scroll-view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentBanner from "../../../../components/slider/slider";
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

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
                slider_list: [],
                activity_category: [],
                nav_active_value: 0
            };
        },

        components: {
            componentBanner,
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            // 启动参数处理
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params
            });
            
            // 数据加载
            this.get_data();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
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
            return {
                title: this.data_base.seo_title || this.data_base.application_name || app.globalData.data.application_title,
                desc: this.data_base.seo_desc || app.globalData.data.application_describe,
                path: '/pages/plugins/activity/index/index?referrer=' + user_id
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.data_base.seo_title || this.data_base.application_name || app.globalData.data.application_title,
                query: 'referrer=' + user_id
            };
        },

        methods: {
            // 初始化
            get_data() {
                uni.showLoading({
                    title: "加载中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "activity"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                slider_list: data.slider_list || [],
                                activity_category: data.activity_category || []
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
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                
                // 加载loding
                uni.showLoading({
                    title: "加载中..."
                });

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("datalist", "index", "activity"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        category_id: this.nav_active_value || 0
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

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_value: e.currentTarget.dataset.value || 0,
                    data_page: 1
                });
                this.get_data_list(1);
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>