<template>
    <view>
        <view v-if="detail != null" class="page">
            <!-- 封面图片 -->
            <image v-if="(detail || null) != null && (detail.share_img || null) != null" class="banner wh-auto dis-block" :src="detail.share_img" mode="widthFix" @tap="detail_images_view_event" :data-value="detail.share_img"></image>

            <!-- 标题 -->
            <view class="text-size fw-b padding-main">{{detail.name}}</view>

            <!-- 基础信息 -->
            <view class="padding-horizontal-main">
                <view class="base padding-horizontal-main border-radius-main bg-white oh pr">
                    <view class="item padding-vertical-main">
                        <image class="item-icon va-m margin-right-sm" :src="static_url+'detail-status-icon.png'" mode="widthFix"></image>
                        <text class="cr-gray va-m">直播状态</text>
                        <view :class="'fr status status-' + detail.status">{{detail.status_name}}</view>
                    </view>
                    <view class="item padding-vertical-main br-t oh">
                        <view class="fl margin-top-lg">
                            <image class="item-icon va-m margin-right-sm" :src="static_url+'detail-time-icon.png'" mode="widthFix"></image>
                            <text class="cr-gray va-m">开播时间</text>
                        </view>
                        <view class="fr">
                            <view class="cr-green">{{detail.start_time}}</view>
                            <view class="cr-red">{{detail.end_time}}</view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 导航 -->
            <view class="nav wh-auto oh">
                <button class="share-friend-submit fl cr-white text-size round margin-left-main" type="default" hover-class="none" open-type="share">
                    <image class="item-icon va-m margin-right-sm" :src="static_url+'nav-share-friend-icon.png'" mode="widthFix"></image>
                    <text class="va-m">分享</text>
                </button>
                <button class="share-poster-submit fl cr-white text-size round margin-left-main" type="default" hover-class="none" @tap="share_poster_event">
                    <image class="item-icon va-m margin-right-sm" :src="static_url+'nav-share-poster-icon.png'" mode="widthFix"></image>
                    <text class="va-m">海报</text>
                </button>
                <button class="player-submit fr cr-white text-size round margin-horizontal-main" type="default" hover-class="none" @tap="player_event">
                    <image class="item-icon va-m margin-right-sm" :src="static_url+'nav-player-icon.png'" mode="widthFix"></image>
                    <text class="va-m">进入直播</text>
                </button>
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
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    var static_url = app.globalData.get_static_url('weixinliveplayer', true);
    export default {
        data() {
            return {
                static_url: static_url+'app/',
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                detail: null
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
            this.init();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        onShow() {},

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        // 自定义分享
        onShareAppMessage() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            var did = (this.detail || null) != null ? this.detail.id : 0;
            var name = (this.detail || null) != null ? this.detail.name : app.globalData.data.application_title;
            return {
                title: name,
                desc: app.globalData.data.application_describe,
                path: '/pages/plugins/weixinliveplayer/detail/detail?id=' + did + '&referrer=' + user_id,
                imageUrl: this.detail.share_img || ''
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            var did = (this.detail || null) != null ? this.detail.id : 0;
            var name = (this.detail || null) != null ? this.detail.name : app.globalData.data.application_title;
            return {
                title: name,
                query: 'id=' + did + '&referrer=' + user_id,
                imageUrl: this.detail.share_img || ''
            };
        },

        methods: {
            init() {
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "search", "weixinliveplayer"),
                    method: "POST",
                    data: {
                        id: this.params.id
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();

                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: ''
                            });
                            
                            // 标题
                            uni.setNavigationBarTitle({
                                title: data.data.name
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 详情图片查看
            detail_images_view_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value]
                    });
                }
            },

            // 进入直播
            player_event(e) {
                var params = encodeURIComponent(JSON.stringify({
                    type: 'detail'
                }));
                uni.navigateTo({
                    url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${this.detail.roomid}&custom_params=${params}`
                });
            },

            // 海报分享
            share_poster_event() {
                uni.showLoading({
                    title: '生成中...'
                });
                uni.request({
                    url: app.globalData.get_request_url('poster', 'index', 'weixinliveplayer'),
                    method: 'POST',
                    data: {
                        "id": this.detail.id
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            uni.previewImage({
                                current: res.data.data,
                                urls: [res.data.data]
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './detail.css';
</style>