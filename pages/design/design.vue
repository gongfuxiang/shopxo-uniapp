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
                layout_data: [],
                // 自定义分享信息
                share_info: {}
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
            this.setData({
                params: params
            });
        },

        onShow() {
            this.get_data();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
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

                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.name,
                                        desc: this.data.seo_desc,
                                        path: '/pages/design/design',
                                        query: 'id='+this.data.id,
                                        img: this.data.logo
                                    }
                                });

                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.data.name
                                });
                            }
                            
                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
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