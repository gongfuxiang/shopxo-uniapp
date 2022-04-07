<template>
    <view>
        <!-- 轮播 -->
        <view v-if="banner_list.length > 0" class="padding-horizontal-main padding-top-main">
            <component-banner :propData="banner_list"></component-banner>
        </view>

        <view v-if="data_list.length > 0">
            <view class="padding-horizontal-main">
                <!-- 导航 -->
                <view class="spacing-nav-title">
                    <text class="text-wrapper">最新直播</text>
                    <navigator url="/pages/plugins/weixinliveplayer/search/search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                </view>

                <!-- 数据列表 -->
                <view class="data-list">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main bg-white oh pr spacing-mb">
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
            </view>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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
                data_bottom_line_status: false,
                data_list_loding_msg: '',
                data_list: [],
                data_base: null,
                banner_list: [],
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentBanner,
            componentNoData,
            componentBottomLine
        },
        props: {},

        onShow() {
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                // 获取数据
                this.get_data_list();
            },

            // 获取数据
            get_data_list() {
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "weixinliveplayer"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var status = (data.data || null) == null || data.data.length == 0;
                            this.setData({
                                data_base: data.base || null,
                                banner_list: data.banner_list || [],
                                data_list: data.data,
                                data_list_loding_status: status ? 0 : 3,
                                data_bottom_line_status: !status
                            });

                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/weixinliveplayer/index/index',
                                        img: ((this.banner_list || null) != null && this.banner_list.length > 0) ? this.banner_list[0]['images_url'] : ''
                                    }
                                });

                                // 导航名称
                                if((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: true,
                                data_list_loding_status: 2,
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
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                    }
                });
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>