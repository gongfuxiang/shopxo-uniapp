<template>
    <view>
        <view class="page padding-main">
            <!-- 主体内容 -->
            <block v-if="data_list_loding_status == 3">
                <view class="padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right oh" data-value="/pages/personal/personal" @tap="url_event">
                        <image :src="(user.avatar || default_avatar)" mode="widthFix" class="circle br fl user-avatar"></image>
                        <view class="fl margin-left">
                            <view>{{user.user_name_view || '用户名'}}</view>
                            <view v-if="(user || null) != null" class="br-main cr-main round tc padding-left-sm padding-right-sm margin-top-xs">ID {{user.id}}</view>
                        </view>
                    </view>
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-t" data-value="/pages/login/login?opt_form=bind_verify" @tap="url_event">
                        <text>更换手机</text>
                        <text class="fr cr-grey">{{user.mobile_security || ''}} 点击更换</text>
                    </view>
                </view>

                <view class="padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right" data-value="/pages/user-address/user-address" @tap="url_event">
                        <text>地址管理</text>
                        <text class="fr cr-grey">点击管理</text>
                    </view>
                    <view v-if="(plugins_invoice || null) != null" class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-t" data-value="/pages/plugins/invoice/user/user" @tap="url_event">
                        <text>发票管理</text>
                        <text class="fr cr-grey">点击前往</text>
                    </view>
                </view>

                <view class="padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                    <!-- #ifdef MP -->
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-b" @tap="open_setting_event">
                        <text>权限设置</text>
                        <text class="fr cr-grey">点击管理</text>
                    </view>
                    <!-- #endif -->
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-b" @tap="remove_user_cache_event">
                        <text>清除缓存</text>
                        <text class="fr cr-grey">点击清除</text>
                    </view>
                    <view v-if="(common_app_customer_service_tel || null) != null" class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-b" @tap="call_event">
                        <text>客服电话</text>
                        <text class="fr cr-grey">{{common_app_customer_service_tel || ''}} 点击拨打</text>
                    </view>
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right" data-value="/pages/logout/logout" @tap="url_event">
                        <text>账号注销</text>
                        <text class="fr cr-grey">注销后无法恢复</text>
                    </view>
                </view>
            </block>

            <!-- 错误提示 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                default_avatar: app.globalData.data.default_user_head_src,
                user: null,
                common_app_customer_service_tel: null,
                plugins_invoice: null
            }
        },

        components: {
            componentNoData
        },

        onShow() {
            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                        plugins_invoice: app.globalData.get_config('plugins_base.invoice', null)
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        this.setData({
                            data_list_loding_status: 0,
                            data_list_loding_msg: '请先绑定手机'
                        });
                        return false;
                    } else {
                        this.setData({
                            data_list_loding_status: 3,
                            user: user
                        });
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: '请先登录'
                    });
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 打开小程序权限中心
            open_setting_event() {
                uni.openSetting();
            },

            // 客服电话
            call_event() {
                if (this.common_app_customer_service_tel == null) {
                    app.globalData.showToast('客服电话有误');
                } else {
                    app.globalData.call_tel(this.common_app_customer_service_tel);
                }
            },

            // 清除缓存
            remove_user_cache_event(e) {
                app.globalData.remove_user_cache_event();
            },
        }
    }
</script>
<style>
    @import './setup.css';
</style>