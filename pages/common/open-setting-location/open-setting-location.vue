<template>
    <view>
        <view v-if="is_show_open_setting" class="open-setting-view">
            <view class="content bg-white">
                <view class="msg cr-gray">开启相应的权限服务</view>
                <view class="value cr-base">获取[ <text>位置信息</text> ]权限</view>
                <button type="primary" open-type="openSetting" size="mini" @opensetting="setting_callback_event">打开设置页</button>
                <view class="tc margin-top-sm">
                    <navigator open-type="navigateBack" class="cp cr-gray dis-inline-block" hover-class="none">返回</navigator>
                </view>
            </view>
        </view>
        <view v-else class="open-setting-loding">
            <image :src="common_static_url+'bg-loding.gif'" class="avatar dis-block" mode="widthFix"></image>
        </view>
    </view>
</template>
<script>
    const app = getApp();

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                params: null,
                is_show_open_setting: false,
                auth: 'scope.userLocation',
                cache_key: app.globalData.data.cache_userlocation_key
            };
        },

        components: {},
        props: {},
        onLoad: function(params) {
            this.setData({
                params: params
            });
            this.init();
        },
        methods: {
            // 获取权限
            init() {
                // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
                var self = this;
                uni.getSetting({
                    success(res) {
                        if (!res.authSetting[self.auth]) {
                            uni.authorize({
                                scope: self.auth,
                                success(res) {
                                    self.choose_location();
                                },
                                fail: res => {
                                    self.setData({
                                        is_show_open_setting: true
                                    });
                                }
                            });
                        } else {
                            self.choose_location();
                        }
                    },
                    fail: res => {
                        app.globalData.showToast("请先获取授权");
                    }
                });
                // #endif
                // #ifdef H5 || APP
                this.choose_location();
                // #endif
                // #ifdef MP-KUAISHOU
                app.globalData.showToast('不支持地理位置选择！');
                uni.navigateBack();
                // #endif
            },

            // 位置服务回调方法
            setting_callback_event(e) {
                if (e.detail.authSetting[this.auth]) {
                    this.setData({
                        is_show_open_setting: false
                    });
                    this.choose_location();
                }
            },

            // 打开位置服务
            choose_location() {
                uni.chooseLocation({
                    success: res => {
                        var position = app.globalData.map_gcj_to_bd(res.longitude, res.latitude);
                        res.longitude = position.lng;
                        res.latitude = position.lat;
                        uni.setStorageSync(this.cache_key, res);
                        uni.navigateBack();
                    },
                    fail: res => {
                        uni.navigateBack();
                    }
                });
            }
        }
    };
</script>
<style>
    @import './open-setting-location.css';
</style>