<template>
    <view :class="theme_view">
        <!-- 底部菜单 -->
        <block v-if="is_tabbar">
            <component-diy-footer :propKey="key" :propValue="app_tabbar" @onFooterHeight="footer_height_value_event"></component-diy-footer>
            <view v-if="propIsFooterSeat && footer_height_value > 0" :style="'height:'+footer_height_value+'rpx;'"></view>
        </block>

        <!-- 微信隐私提示弹窗 -->
        <view v-if="is_show_privacy" class="agreement-page bs-bb pf wh-auto ht-auto left-0 top-0 z-i-deep-must">
            <view class="agreement-content border-radius-main bg-white">
                <view class="tc">
                    <image class="logo circle auto dis-block margin-bottom-lg br" :src="logo" mode="widthFix"></image>
                    <view class="cr-base fw-b text-size-lg">{{ title }}{{$t('common.warm_tips')}}</view>
                </view>
                <view class="margin-top-lg text-size-sm cr-base content-desc">
                    <block v-if="(privacy_content || null) == null">{{$t('agreement.agreement.w38e3v')}}{{ title }}{{$t('agreement.agreement.hjn568')}}</block>
                    <block v-else>{{ privacy_content }}</block>
                </view>
                <view class="cr-blue margin-top-lg">
                    <view>
                        <text @tap="agreement_event" data-value="userregister">《{{ title }}{{$t('agreement.agreement.iy7863')}}</text>
                    </view>
                    <view class="margin-top-sm">
                        <text @tap="agreement_event" data-value="userprivacy">《{{ title }}{{$t('agreement.agreement.jwi8n1')}}</text>
                    </view>
                </view>
                <view class="buttom tc margin-top-xxxl padding-top-lg">
                    <button type="default" size="mini" class="btn br-grey cr-base bg-white text-size-sm round margin-right-xxxl" @tap="exit_event">{{$t('agreement.agreement.062co8')}}</button>
                    <button type="default" size="mini" class="btn br-main cr-white bg-main text-size-sm round margin-left-xxxl" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="agree_privacy_auth_event">{{$t('agreement.agreement.60t34e')}}</button>
                </view>
            </view>
        </view>

        <!-- app管理 -->
        <component-app-admin ref="app_admin" :propIsHideStar="true"></component-app-admin>

        <!-- 用户基础 -->
        <component-user-base ref="user_base" :propIsGrayscale="propIsGrayscale"></component-user-base>
    </view>
</template>
<script>
    const app = getApp();
    import componentDiyFooter from '@/components/diy/footer';
    import componentAppAdmin from '@/components/app-admin/app-admin';
    import componentUserBase from '@/components/user-base/user-base';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                logo: app.globalData.get_application_logo_square(),
                title: app.globalData.get_application_title(),
                is_show_privacy: false,
                privacy_content: null,
                key: '',
                is_tabbar: false,
                app_tabbar: null,
                footer_height_value: 0,
            };
        },
        props: {
            // 是否灰度
            propIsGrayscale: {
                type: Boolean,
                default: false,
            },
            // 是否显示底部菜单占位
            propIsFooterSeat: {
                type: Boolean,
                default: true,
            },
            // 是否引入app管理
            propIsAppAdmin: {
                type: Boolean,
                default: true,
            },
            // 是否引入用户基础信息提示
            propIsUserBase: {
                type: Boolean,
                default: true,
            },
        },
        components: {
            componentDiyFooter,
            componentAppAdmin,
            componentUserBase
        },
        // 页面被展示
        created: function () {
            // 初始化配置
            this.init_config();
        },
        methods: {
            // 显示响应方法
            on_show(params = {}) {
                //隐藏系统tabbar
                if(app.globalData.data.is_use_native_tabbar != 1) {
                    app.globalData.system_hide_tabbar();
                }

                // 初始化配置
                this.init_config(false, params);

                // 系统底部菜单
                this.footer_init();
            },

            // 初始化配置
            init_config(status = false, params = {}) {
                if ((status || false) == true) {
                    // 初始化数据
                    this.init(params);
                } else {
                    app.globalData.is_config(this, 'init_config', params);
                }
            },

            // 初始化数据
            init(params = {}) {
                // 系统底部菜单
                this.footer_init();

                // app管理
                if (this.propIsAppAdmin && (this.$refs.app_admin || null) != null) {
                    this.$refs.app_admin.init(params);
                }

                // 用户头像和昵称设置提示
                if (this.propIsUserBase && (this.$refs.user_base || null) != null) {
                    this.$refs.user_base.init(params);
                }

                // #ifdef MP-WEIXIN
                // 微信协议验证
                if (app.globalData.data.is_weixin_privacy_setting == 1) {
                    uni.getPrivacySetting({
                        success: (res) => {
                            if (res.needAuthorization) {
                                this.setData({
                                    is_show_privacy: true,
                                    privacy_content: app.globalData.get_config('config.common_app_mini_weixin_privacy_content', null),
                                });
                            }
                        }
                    });
                }
                // #endif
            },

            // 底部菜单初始化
            footer_init(status = 0) {
                var is_use_native_tabbar = app.globalData.data.is_use_native_tabbar == 1;
                var upd_data = {
                    is_tabbar: is_use_native_tabbar ? false : app.globalData.is_tabbar_pages()
                };
                if(upd_data['is_tabbar']) {
                    upd_data['key'] = Math.random();
                    upd_data['app_tabbar'] = app.globalData.get_config('app_tabbar') || null;
                }
                this.setData(upd_data);

                // 如果没有菜单数据则读取一次
                if(!is_use_native_tabbar && status == 0 && (upd_data['app_tabbar'] || null) == null) {
                    app.globalData.init_config(0, this, 'footer_init', 1);
                }
            },

            // 底部菜单高度回调事件
            footer_height_value_event(value) {
                this.setData({
                    footer_height_value: (value*2)+20
                });
                this.$emit('onFooterHeight', value);

                // 存储底部菜单高度
                app.globalData.app_tabbar_height_save(value);
            },

            // 协议事件
            agreement_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value == null) {
                    app.globalData.showToast(this.$t('login.login.4wc3hr'));
                    return false;
                }
                // 是否存在协议 url 地址
                var key = 'agreement_' + value + '_url';
                var url = app.globalData.get_config('config.' + key) || null;
                if (url == null) {
                    app.globalData.showToast(this.$t('login.login.x0nxxf'));
                    return false;
                }
                // 打开 webview
                app.globalData.open_web_view(url);
            },

            // 授权回调
            agree_privacy_auth_event() {
                this.setData({
                    is_show_privacy: false
                });
            },

            // 退出小程序
            exit_event(e) {
                uni.exitMiniProgram();
            },
        }
    };
</script>
<style scoped>
    .agreement-page {
        background-color: rgba(0, 0, 0, 0.6);
        height: 100vh;
        padding: 40rpx;
    }
    .agreement-content {
        padding: 40rpx;
        position: absolute;
        top: 15%;
        width: calc(100% - 160rpx);
    }
    .agreement-content .logo {
        width: 160rpx;
        height: 160rpx;
    }
    .agreement-content .content-desc {
        line-height: 46rpx;
        max-height: calc(30vh);
        overflow-y: auto;
    }
    .agreement-content .buttom .btn {
        min-width: 200rpx;
    }
</style>