<template>
    <view>
        <view v-if="(data_base || null) != null">
            <!-- 分类 -->
            <scroll-view v-if="(brand_category_list || null) != null && brand_category_list.length > 0"
                class="nav-list scroll-view-horizontal bg-white tc oh" scroll-x="true">
                <view :class="'item cr-gray ' + (nav_active_value == 0 ? 'cr-main' : '')" @tap="nav_event"
                    data-value="0">全部</view>
                <block v-for="(item, index) in brand_category_list" :key="index">
                    <view :class="'item cr-gray ' + (nav_active_value == item.id ? 'cr-main' : '')" @tap="nav_event" :data-value="item.id">{{item.name}}</view>
                </block>
            </scroll-view>

            <!-- 品牌列表 -->
            <view v-if="(brand_list || null) != null && brand_list.length > 0" class="data-list padding-horizontal-main padding-top-main oh">
                <block v-for="(item, index) in brand_list" :key="index">
                    <view v-if="(item.is_not_show || 0) == 0" class="item border-radius-main bg-white spacing-mb">
                        <navigator :url="'/pages/goods-search/goods-search?brand_id=' + item.id" hover-class="none">
                            <image :src="item.logo" mode="aspectFit"></image>
                            <view class="padding-main tc">
                                <view class="single-text fw-b cr-base">{{item.name}}</view>
                                <view class="multi-text cr-grey margin-top-sm">{{item.describe}}</view>
                            </view>
                        </navigator>
                    </view>
                </block>
            </view>

            <!-- 提示信息 -->
            <component-no-data :prop-status="data_list_loding_status"></component-no-data>
            

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                data_base: null,
                brand_list: [],
                brand_category_list: [],
                nav_active_value: 0
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
        },

        onShow() {
            this.get_data();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        // 自定义分享
        onShareAppMessage() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.data_base.seo_title || '品牌 - ' + app.globalData.data.application_title,
                desc: this.data_base.seo_desc || app.globalData.data.application_describe,
                path: '/pages/plugins/brand/index/index?referrer=' + user_id
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.data_base.seo_title || '品牌 - ' + app.globalData.data.application_title,
                query: 'referrer=' + user_id,
                imageUrl: this.data_base.right_images || ''
            };
        },

        methods: {
            // 获取数据
            get_data() {
                var self = this;
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "brand"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var brand_list = data.brand_list || [];
                            self.setData({
                                data_base: data.base || null,
                                brand_list: brand_list,
                                brand_category_list: data.brand_category_list || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: brand_list.length > 0 ? 3 : 0,
                                data_bottom_line_status: brand_list.length > 0
                            });
                            
                            // 导航选中处理
                            self.nav_active_handle();
                        } else {
                            self.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_value: e.currentTarget.dataset.value || 0
                });
                this.nav_active_handle();
            },

            // 导航选中处理
            nav_active_handle() {
                var value = this.nav_active_value;
                var temp_brand_list = this.brand_list;
                var count = 0;
                for (var i in temp_brand_list) {
                    if (value == 0) {
                        temp_brand_list[i]['is_not_show'] = 0;
                        count++;
                    } else {
                        var is_not_show = temp_brand_list[i]['brand_category_ids'].indexOf(value) == -1 ? 1 : 0;
                        temp_brand_list[i]['is_not_show'] = is_not_show;
                        if (is_not_show == 0) {
                            count++;
                        }
                    }
                }

                this.setData({
                    brand_list: temp_brand_list,
                    data_list_loding_status: count > 0 ? 3 : 0,
                    data_bottom_line_status: count > 0
                });
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>