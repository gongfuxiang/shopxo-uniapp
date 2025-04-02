<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null && status == 1" class="plugins-popupscreen wh-auto ht-auto">
            <view class="content pr">
                <image class="dis-block auto" :src="data.images" mode="widthFix" :data-value="data.images_url || ''" @tap="url_event"></image>
                <view class="tc margin-top-xl">
                    <view class="close cp round padding-sm auto" @tap.stop="close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#cacaca"></iconfont>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data: null,
                status: 0,
                cache_key: 'plugins_popupscreen_cache_key',
                timer: null,
            };
        },
        props: {},
        // 页面被展示
        created: function () {
            this.init_config();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        data: app.globalData.get_config('plugins_base.popupscreen.data') || null,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                var data = this.data || null;
                if (data != null && parseInt(data.is_app_enable || 0) == 1 && parseInt(data.is_valid || 0) == 1) {
                    // 是否全局
                    var temp_status = true;
                    if(parseFloat(data.is_overall || 0) == 0) {
                        // 非首页则不展示
                        if(!app.globalData.is_tabbar_home()) {
                            temp_status = false;
                        }
                    }
                    if(temp_status) {
                        // 不存在关闭缓存或者超过间隔时间则显示
                        var key = this.cache_key;
                        var cv = parseInt(uni.getStorageSync(key)) || 0;
                        var pv = parseInt(data.interval_time) || 86400;
                        if (cv == 0 || cv + pv < app.globalData.get_timestamp()) {
                            // 是否开启自动关闭
                            var timer = null;
                            var ct = parseInt(data.close_time) || 0;
                            if (ct > 0) {
                                var self = this;
                                timer = setTimeout(function () {
                                    self.setData({
                                        status: 0,
                                    });
                                    uni.setStorage({
                                        key: key,
                                        data: app.globalData.get_timestamp(),
                                    });
                                }, ct * 1000);
                            }
                            this.setData({
                                status: 1,
                                timer: timer,
                            });
                        }
                    }
                }
                return this.status == 1;
            },
            
            // 关闭事件
            close_event(e) {
                this.setData({
                    status: 0,
                });
                uni.setStorage({
                    key: this.cache_key,
                    data: app.globalData.get_timestamp(),
                });
                clearInterval(this.timer);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style scoped>
    .plugins-popupscreen {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 20;
        background-color: rgb(0 0 0 / 0.3);
    }
    .plugins-popupscreen .close {
        right: 10%;
        top: 0;
        z-index: 1;
        width: 46rpx;
        height: 46rpx;
        line-height: 46rpx;
        background-color: rgb(4 4 4 / 0.3);
        border: solid 1px #a9a9a9;
    }
    .plugins-popupscreen .content {
        margin-top: calc(50vh - 200rpx) !important;
    }
    .plugins-popupscreen .content image {
        width: 600rpx;
    }
</style>