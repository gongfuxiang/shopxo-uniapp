<template>
    <view :class="theme_view">
        <view v-if="is_show_open_setting" class="open-setting-view">
            <view class="content bg-white">
                <view class="msg cr-grey">{{$t('open-setting-location.open-setting-location.61wezw')}}</view>
                <view class="value cr-base">{{$t('open-setting-location.open-setting-location.6vev38')}}<text>{{$t('open-setting-location.open-setting-location.lult41')}}</text>{{$t('open-setting-location.open-setting-location.407106')}}</view>
                <button type="primary" open-type="openSetting" size="mini" @opensetting="setting_event">{{$t('open-setting-location.open-setting-location.65q4b3')}}</button>
                <view class="tc margin-top-sm">
                    <navigator open-type="navigateBack" class="cp cr-grey dis-inline-block" hover-class="none">{{$t('common.return')}}</navigator>
                </view>
            </view>
        </view>
        <view v-else class="open-setting-loding">
            <image :src="common_static_url + 'bg-loding.gif'" class="avatar dis-block" mode="widthFix"></image>
            <view class="tc margin-top-sm">
                <navigator open-type="navigateBack" class="cp cr-grey dis-inline-block" hover-class="none">{{$t('common.return')}}</navigator>
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
            theme_view: app.globalData.get_theme_value_view(),
            common_static_url: common_static_url,
            params: null,
            is_show_open_setting: false,
            auth: "scope.userLocation",
            cache_key: app.globalData.data.cache_userlocation_key,
            error_msg: null,
        };
    },

    components: {},

    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);

        // 设置参数
        this.setData({
            params: params,
        });
        this.init();
    },

    onShow() {
        // 调用公共事件方法
        app.globalData.page_event_onshow_handle();
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
            // app先返回当前页面再调用位置选择组件
            // #ifdef APP
            uni.navigateBack();
            // #endif

            // 调用位置选择组件
            uni.chooseLocation({
                success: (res) => {
                    // 位置数据存储缓存中，改变状态值（成功）
                    res['status'] = 1;
                    res['lat'] = res.latitude;
                    res['lng'] = res.longitude;
                    delete res['latitude'];
                    delete res['longitude'];
                    uni.setStorageSync(this.cache_key, res);

                    // 触发自定义事件并传递参数给上一页
                    uni.$emit('refresh', { location_success: true });

                    // app则不执行返回操作、上面已经返回过了
                    // #ifndef APP
                    setTimeout(function () {
                        uni.navigateBack();
                    }, 500);
                    // #endif
                },
                fail: (res) => {
                    // 存在数据则改变状态值（失败）
                    var result = {...(uni.getStorageSync(this.cache_key) || {}), ...{status: 3}};
                    uni.setStorageSync(this.cache_key, result);

                    // 取消则自动返回、则显示错误
                    // error=11 支付宝取消、msg包含cancel则其他平台
                    var msg = res.errorMessage || res.chooseLocation || res.errMsg || this.$t('open-setting-location.open-setting-location.hwn386');
                    if(res.error == 11 || msg.indexOf('cancel') != -1) {
                        // app则不执行返回操作、上面已经返回过了
                        // #ifndef APP
                        uni.navigateBack();
                        // #endif
                    } else {
                        this.setData({ error_msg: res.errMsg });
                        app.globalData.showToast(res.errMsg);
                    }
                }
            });
        }
    },
};
</script>
<style>
@import "./open-setting-location.css";
</style>
