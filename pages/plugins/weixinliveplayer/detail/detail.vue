<template>
    <view :class="theme_view">
        <view v-if="detail != null" class="page-bottom-fixed">
            <!-- 封面图片 -->
            <image v-if="(detail || null) != null && (detail.share_img || null) != null" class="banner wh-auto dis-block" :src="detail.share_img" mode="widthFix" @tap="detail_images_view_event" :data-value="detail.share_img"></image>

            <!-- 标题 -->
            <view class="text-size fw-b padding-main">{{ detail.name }}</view>

            <!-- 基础信息 -->
            <view class="padding-horizontal-main">
                <view class="base padding-horizontal-main border-radius-main bg-white oh pr">
                    <view class="item padding-vertical-main flex-row jc-sb">
                        <view>
                            <image class="item-icon va-m margin-right-sm" :src="static_url + 'detail-status-icon.png'" mode="widthFix"></image>
                            <text class="cr-grey va-m">{{$t('detail.detail.4u64dg')}}</text>
                        </view>
                        <view :class="'status status-' + detail.status">{{ detail.status_name }}</view>
                    </view>
                    <view class="item padding-vertical-main br-t oh flex-row jc-sb">
                        <view class="">
                            <image class="item-icon va-m margin-right-sm" :src="static_url + 'detail-time-icon.png'" mode="widthFix"></image>
                            <text class="cr-grey va-m">{{$t('detail.detail.y2639j')}}</text>
                        </view>
                        <view class="flex-row flex-nowrap align-c flex-1 flex-width cr-grey-9 single-text padding-left-main"> {{ detail.start_time }} - {{ detail.end_time }} </view>
                    </view>
                </view>
            </view>

            <!-- 导航 -->
            <view class="nav pf pa-w left-0 right-0 bottom-0 wh-auto">
                <view class="padding-main flex-row jc-sb">
                    <button class="share-friend-submit cr-white text-size-sm round" type="default" hover-class="none" @tap="share_event">
                        <image class="item-icon va-m margin-right-sm" :src="static_url + 'nav-share-friend-icon.png'" mode="widthFix"></image>
                        <text class="va-m">{{$t('common.share')}}</text>
                    </button>
                    <button class="share-poster-submit cr-white text-size-sm round" type="default" hover-class="none" @tap="share_poster_event">
                        <image class="item-icon va-m margin-right-sm" :src="static_url + 'nav-share-poster-icon.png'" mode="widthFix"></image>
                        <text class="va-m">{{$t('detail.detail.fa8h7j')}}</text>
                    </button>
                    <button class="player-submit cr-white text-size-sm round" type="default" hover-class="none" @tap="player_event">
                        <image class="item-icon va-m margin-right-sm" :src="static_url + 'nav-player-icon.png'" mode="widthFix"></image>
                        <text class="va-m">{{$t('detail.detail.eg25j9')}}</text>
                    </button>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 分享 -->
            <component-share-popup ref="share"></component-share-popup>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentSharePopup from '@/components/share-popup/share-popup';

    var static_url = app.globalData.get_static_url('weixinliveplayer', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                static_url: static_url + 'app/',
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                detail: null,
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentSharePopup
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('detail', 'search', 'weixinliveplayer'),
                    method: 'POST',
                    data: {
                        id: this.params.id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data || null,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: '',
                            });

                            if ((this.detail || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.detail.seo_title || this.detail.name,
                                        desc: this.detail.seo_desc,
                                        path: '/pages/plugins/weixinliveplayer/detail/detail',
                                        query: 'id=' + this.detail.id,
                                        img: this.detail.share_img,
                                    },
                                });

                                // 标题
                                uni.setNavigationBarTitle({
                                    title: this.detail.name,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 详情图片查看
            detail_images_view_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value],
                    });
                }
            },

            // 进入直播
            player_event(e) {
                // 打开直播参数
                var params = encodeURIComponent(
                    JSON.stringify({
                        type: 'detail',
                    })
                );
                var url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${this.detail.roomid}&custom_params=${params}`;

                // #ifdef APP
                // APP则直接打开微信小程序直播
                var weixin_original_id = app.globalData.get_config('config.common_app_mini_weixin_share_original_id', null);
                if(weixin_original_id != null) {
                    plus.share.getServices(res => {
                        let sweixin = null;
                        for(let i in res) {
                            if(res[i].id == 'weixin') {
                                sweixin = res[i];
                            }
                        }
                        //唤醒微信小程序
                        if(sweixin) {
                            sweixin.launchMiniProgram({
                                id: weixin_original_id,
                                type: 0,
                                path: url
                            });
                        } else {
                            app.globalData.showToast(this.$t('detail.detail.86g7e1'));
                        }
                    });
                }
                return false;
                // #endif

                // #ifdef MP-WEIXIN
                app.globalData.url_open(url);
                return false;
                // #endif

                // 非微信环境和APP环境
                app.globalData.showToast(this.$t('detail.detail.9d3o6w'));
            },

            // 海报分享
            share_poster_event() {
                uni.showLoading({
                    title: this.$t('detail.detail.6xvl35'),
                });
                uni.request({
                    url: app.globalData.get_request_url('poster', 'index', 'weixinliveplayer'),
                    method: 'POST',
                    data: {
                        id: this.detail.id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            uni.previewImage({
                                current: res.data.data,
                                urls: [res.data.data],
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 分享开启弹层
            share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info
                    });
                }
            }
        }
    };
</script>
<style>
    @import './detail.css';
</style>
