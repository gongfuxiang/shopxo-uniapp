<template>
    <view>
        <!-- 导航 -->
        <view class="nav bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc cr-gray ' + (nav_status_index == index ? 'cr-main' : '')" :data-index="index" @tap="nav_event">{{item.name}}</view>
            </block>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <navigator :url="'/pages/plugins/weixinliveplayer/detail/detail?id=' + item.id" hover-class="none">
                        <image class="fl radius" :src="item.share_img" mode="aspectFit"></image>
                        <view class="base fl">
                            <view class="single-text text-size">{{item.name}}</view>
                            <view class="margin-top-xl oh">
                                <view class="time-title fl cr-white radius tc text-size-sm padding-sm margin-right-sm">开播时间</view>
                                <view class="fl cr-green">{{item.start_time}}</view>
                                <view class="fl cr-red">{{item.end_time}}</view>
                            </view>
                            <view :class="'status pa status-' + item.status">{{item.status_name}}</view>
                        </view>
                    </navigator>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :prop-status="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_list: [],
                data_base: null,
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                params: null,
                nav_status_list: [
                    { name: "全部", value: "-1" },
                    { name: "未开始", value: "0" },
                    { name: "直播中", value: "1" },
                    { name: "暂停中", value: "2" },
                    { name: "已结束", value: "3" },
                ],
                nav_status_index: 0
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
            
            // 是否指定状态
            var nav_status_index = 0;
            if ((params.status || null) != null) {
                for (var i in this.nav_status_list) {
                    if (this.nav_status_list[i]['value'] == params.status) {
                        nav_status_index = i;
                        break;
                    }
                }
            }
            this.setData({
                params: params,
                nav_status_index: nav_status_index
            });
            this.init();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        onShow() {},

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
            var name = (this.data_base || null) != null && (this.data_base.application_name || null) != null ? this.data_base.application_name : app.globalData.data.application_title;
            return {
                title: name,
                desc: app.globalData.data.application_describe,
                path: '/pages/plugins/weixinliveplayer/search/search?referrer=' + user_id
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            var name = (this.data_base || null) != null && (this.data_base.application_name || null) != null ? this.data_base.application_name : app.globalData.data.application_title;
            return {
                title: name,
                query: 'referrer=' + user_id
            };
        },

        methods: {
            init() {
                // 获取数据
                this.get_data_list();
            },

            // 获取数据
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
                this.setData({
                    data_list_loding_status: 1
                });
                
                // 参数
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value']; // 获取数据

                uni.request({
                    url: app.globalData.get_request_url("index", "search", "weixinliveplayer"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        status: status,
                        is_more: 1
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = res.data.data.data;
                                } else {
                                    var temp_data_list = this.data_list;
                                    var temp_data = res.data.data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_base: res.data.data.base || null,
                                    data_list: temp_data_list,
                                    data_total: res.data.data.total,
                                    data_page_total: res.data.data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1
                                });
                                
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_list: [],
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
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1
                });
                this.get_data_list(1);
            }
        }
    };
</script>
<style>
    @import './search.css';
</style>