<template>
    <view>
        <view v-if="is_show_open_setting" class="open-setting-view">
            <view class="content bg-white">
                <view class="msg cr-grey">开启相应的权限服务</view>
                <view class="value cr-base">获取[ <text>位置信息</text> ]权限</view>
                <button type="primary" open-type="openSetting" size="mini" @opensetting="setting_event">打开设置页</button>
                <view class="tc margin-top-sm">
                    <navigator open-type="navigateBack" class="cp cr-grey dis-inline-block" hover-class="none">返回</navigator>
                </view>
            </view>
        </view>
        <view v-else class="open-setting-loding">
            <image :src="common_static_url + 'bg-loding.gif'" class="avatar dis-block" mode="widthFix"></image>
            <view class="tc margin-top-sm">
                <navigator open-type="navigateBack" class="cp cr-grey dis-inline-block" hover-class="none">返回</navigator>
            </view>
        </view>
        <view v-if="(error_msg || null) != null" class="cr-red margin-top-lg padding-horizontal-main">{{ error_msg }}</view>
    </view>
</template>
<script>
const app = getApp();

var common_static_url = app.globalData.get_static_url("common");
export default {
    data() {
        return {
            common_static_url: common_static_url,
            params: null,
            is_show_open_setting: false,
            auth: "scope.userLocation",
            cache_key: app.globalData.data.cache_userlocation_key,
            error_msg: null,
        };
    },

    components: {},
    props: {},
    onLoad: function (params) {
        this.setData({
            params: params,
        });
        this.init();
    },
    methods: {
        // 获取权限
        init() {
            app.globalData.get_location_check(this.auth, this, "location_back_handle");
        },

        // 位置权限校验回调
        location_back_handle(status = 0) {
            if (status == 1) {
                // 是否校验成功直接返回
                if (parseInt(this.params.is_check_success_back || 0) == 1) {
                    uni.navigateBack();
                } else {
                    this.choose_location();
                }
            } else {
                this.setData({
                    is_show_open_setting: true,
                });
            }
        },

        // 配置打开事件
        setting_event(e) {
            if (e.detail.authSetting[this.auth]) {
                // 不展示打开设置的按钮容器
                this.setData({
                    is_show_open_setting: false,
                });

                // 是否校验成功直接返回
                if (parseInt(this.params.is_check_success_back || 0) == 1) {
                    uni.navigateBack();
                } else {
                    this.choose_location();
                }
            }
        },

        // 打开位置服务
        choose_location() {
            uni.chooseLocation({
                success: (res) => {
                    uni.setStorageSync(this.cache_key, res);
                    setTimeout(function () {
                        uni.navigateBack();
                    }, 500);
                },
                fail: (res) => {
                    // 取消则自动返回、则显示错误
                    if (res.errMsg.indexOf("cancel") != -1) {
                        uni.navigateBack();
                    } else {
                        this.setData({ error_msg: res.errMsg });
                        app.globalData.showToast(res.errMsg);
                    }
                },
            });
        },
    },
};
</script>
<style>
@import "./open-setting-location.css";
</style>
