<template>
    <view>
        <view v-if="(data || null) != null">
            <!-- 搜索 -->
            <block v-if="(data.is_header || 0) == 1">
                <!-- 搜索框 -->
                <view class="padding-main bg-white">
                    <component-search propPlaceholder="输入商品名称搜索"></component-search>
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
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentLayout from "../../components/layout/layout";
    import componentSearch from "../../components/search/search";
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                data: null,
                layout_data: []
            };
        },

        components: {
            componentLayout,
            componentSearch,
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
                title: this.data.name || this.data.seo_title || app.globalData.data.application_title,
                desc: this.data.seo_desc || app.globalData.data.application_describe,
                path: '/pages/design/design?id=' + this.data.id + '&referrer=' + user_id
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.data.name || this.data.seo_title || app.globalData.data.application_title,
                query: 'id=' + this.data.id + '&referrer=' + user_id,
                imageUrl: this.data.logo || ''
            };
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "design"),
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
                                data: (data.data || null) != null && data.data.length != 0 ? data.data : null,
                                layout_data: data.layout_data || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });
                            
                            // 标题名称
                            if ((this.data || null) != null) {
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
            }
        }
    };
</script>
<style>
</style>