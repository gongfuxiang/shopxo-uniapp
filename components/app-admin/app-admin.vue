<template>
    <view :class="theme_view">
        <!-- 更新 -->
        <view v-if="is_update_status && (update_data || null) != null" class="update-container pf left-0 top-0 wh-auto ht-auto">
            <view class="update-content auto bg-white pr">
                <image :src="update_alert_bg_images" mode="widthFix" class="update-alert-bg-images wh-auto"></image>
                <view class="padding-top-xs padding-left-xl padding-right-xl padding-bottom-xl">
                    <view class="text-size-xl fw-b tc pa name">{{update_data.name}}</view>
                    <view class="text-size tc pa version">v{{update_data.version_new}}</view>
                    <scroll-view :scroll-y="true" class="content tl">
                        <block v-for="(item, index) in update_data.content" :key="index">
                            <view class="margin-bottom-sm text-size-xs">{{item}}</view>
                        </block>
                    </scroll-view>
                    <view class="margin-top-xl flex-row">
                        <button v-if="(update_data.is_force_update || 0) == 0" type="default" class="br-main bg-white cr-main round text-size-md" size="mini" @tap="update_close_event">{{$t('common.cancel')}}</button>
                        <button type="default" class="br-main bg-main cr-white round text-size-md" size="mini" @tap="to_update_event">{{$t('common.now_update_text')}}</button>
                    </view>
                </view>
            </view>
        </view>

        <!-- 评分 -->
        <view v-if="is_star_status && (star_url || null) != null && (star_alert_images || null) != null" class="star-container pf left-0 top-0 wh-auto ht-auto tc">
            <view class="star-content">
                <image :src="star_alert_images" mode="widthFix" class="star-alert-images wh-auto" @tap="to_star_event"></image>
            </view>
            <view class="padding-sm margin-top-xl">
                <view class="dis-inline-block" @tap="close_star_event">
                    <iconfont name="icon-close-o" size="30rpx" color="#ccc"></iconfont>
                </view>
            </view>
        </view>

        <!-- 关于我们中使用 -->
        <!-- #ifdef APP -->
        <view v-if="is_about_page && !propIsHideStar" class="margin-top">
            <text class="cr-grey-9">{{app_version_info}}</text>
            <block v-if="is_loading">
                <text v-if="(update_data || null) == null" class="cr-grey-c margin-left-lg text-size-xs">{{$t('common.already_latest_text')}}</text>
                <text v-else class="cr-blue margin-left-lg text-size-xs cp" @tap="update_event">{{$t('common.to_update_text')}}(v{{update_data.version_new}})</text>
                <text v-if="(star_url || null) != null && (star_alert_images || null) != null" class="cr-blue margin-left-lg text-size-xs cp" @tap="star_event">{{$t('common.to_star_text')}}</text>
            </block>
        </view>
        <!-- #endif -->
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                update_tips_cache_key: app.globalData.data.cache_app_update_tips_interval_time_key,
                star_tips_cache_key: app.globalData.data.cache_app_star_tips_interval_time_key,
                app_version_info: app.globalData.data.app_version_info,
                is_about_page: false,
                is_loading: false,
                update_data: null,
                // 更新提示
                is_update_status: false,
                update_tips_interval_time: 0,
                update_alert_bg_images: null,
                // 评分提示
                is_star_status: false,
                star_tips_await_time: 0,
                star_tips_interval_time: 0,
                star_alert_images: null,
                star_url: null
                
            };
        },
        props: {
            propIsHideStar: {
                type: Boolean,
                default: false,
            },
        },
        // 页面被展示
        created: function () {
            this.init();
        },

        methods: {
            // 初始化、获取数据
            init(is_init = 0) {
                // #ifdef APP
                // 是否关于我们页面
                this.setData({
                    is_about_page: app.globalData.current_page(false) == 'pages/about/about',
                });

                // 请求接口获取版本数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'version', 'appadmin'),
                    method: 'POST',
                    data: {app_version: app.globalData.data.app_version_info},
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            var data = res.data.data;
                            var upd_data = {
                                is_loading: true,
                                update_data: data.update_data || null,
                                // 更新提示
                                update_alert_bg_images: data.update_alert_bg_images || null,
                                is_update_status: parseInt(data.is_update_status || 0) == 1,
                                update_tips_interval_time: parseInt(data.update_tips_interval_time || 600),
                                // 评分提示
                                is_star_status: parseInt(data.is_star_status || 0) == 1,
                                star_tips_await_time: parseInt(data.star_tips_await_time || 600),
                                star_tips_interval_time: parseInt(data.star_tips_interval_time || 1800),
                                star_alert_images: data.star_alert_images || null,
                                star_url: data.star_url || null,
                            };

                            // 当前时间
                            var current_time = Date.parse(new Date()) / 1000;

                            // 更新提示间隔时间
                            var update_tips_cache_time = parseInt(uni.getStorageSync(this.update_tips_cache_key) || 0);
                            if(update_tips_cache_time > 0 && current_time < update_tips_cache_time + upd_data.update_tips_interval_time) {
                                upd_data.is_update_status = false;
                            }

                            // 评分是否可以展示评分
                            var star_tips_cache_time = parseInt(uni.getStorageSync(this.star_tips_cache_key) || 0);
                            if(star_tips_cache_time > 0) {
                                upd_data.is_star_status = current_time > star_tips_cache_time;
                            }
                            // 首次则记录评分缓存
                            if(star_tips_cache_time == 0) {
                                uni.setStorageSync(this.star_tips_cache_key, (Date.parse(new Date()) / 1000)+upd_data.star_tips_await_time);
                                // 如果等待时间为0则不需要等待就提示评分
                                if(upd_data.star_tips_await_time == 0) {
                                    upd_data.is_star_status = true;
                                }
                            }
                            // 如果已经展示更新弹窗则不展示评分弹窗
                            if(upd_data.is_update_status) {
                                upd_data.is_star_status = false;
                            }

                            // 关于我们页面则不直接展示
                            if(this.is_about_page) {
                                upd_data.is_update_status = false;
                                upd_data.is_star_status = false;
                            }

                            this.setData(upd_data);
                        }
                    },
                    fail: () => {
                        // 失败则再重试一次
                        if(is_init == 0) {
                            this.get_data(1);
                        }
                    }
                });
                // #endif
            },

            // 更新关闭
            update_close_event(e) {
                this.setData({
                    is_update_status: false
                });
                uni.setStorageSync(this.update_tips_cache_key, Date.parse(new Date()) / 1000);
            },

            // 打开更新事件
            update_event(e) {
                this.setData({
                    is_update_status: true
                });
            },

            // 去更新事件
            to_update_event(e) {
                plus.runtime.openURL(this.update_data.update_url);
            },
            
            // 打开评分事件
            star_event(e) {
                this.setData({
                    is_star_status: true
                });
            },

            // 去打分事件
            to_star_event(e) {
                // 先关闭评分
                this.close_star_event();

                // 打开地址
                plus.runtime.openURL(this.star_url);
            },

            // 关闭评分事件
            close_star_event(e) {
                this.setData({
                    is_star_status: false
                });
                // 增加间隔时间，到时间后才会再提示
                uni.setStorageSync(this.star_tips_cache_key, (Date.parse(new Date()) / 1000)+this.star_tips_interval_time);
            }
        }
    };
</script>
<style scoped>
    .update-container,
    .star-container {
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 100;
        padding-top: 26vh;
    }
    .update-container .update-content {
        width: 75vw;
        padding-top: 100rpx;
        border-radius: 20rpx;
    }
    .update-container .update-content .update-alert-bg-images {
        margin-top: -180rpx;
    }
    .update-container .update-content .name {
        left: 36rpx;
        top: 60rpx;
    }
    .update-container .update-content .version {
        left: 36rpx;
        top: 140rpx;
    }
    .update-container .update-content .content {
        max-height: 26vh;
    }
    .star-container .star-content {
        border-radius: 20rpx;
    }
    .star-container .star-content .star-alert-images {
        max-width: 460rpx;
    }
</style>