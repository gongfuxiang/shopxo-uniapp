<template>
    <view :class="theme_view">
        <view class="page padding-main">
            <block v-if="(user || null) != null">
                <view class="panel-item padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                    <view class="item padding-vertical-xxl padding-right-xxxl arrow-right oh" data-value="/pages/personal/personal" @tap="url_event">
                        <image :src="user.avatar || default_avatar" mode="widthFix" class="circle br fl user-avatar"></image>
                        <view class="fl margin-left margin-top">
                            <view>{{ user.user_name_view || $t('login.login.6yfr9g') }}</view>
                        </view>
                    </view>

                    <!-- 手机、邮箱、密码-->
                    <view v-if="common_user_is_mandatory_bind_mobile == 1 || ((home_user_login_type || null) != null && home_user_login_type.length > 0 && home_user_login_type.indexOf('sms') != -1)" class="item padding-vertical-xxl padding-right-xxxl arrow-right" data-value="/pages/login/login?opt_form=bind_verify" @tap="url_event">
                        <text>{{ $t('setup.setup.x81v6d') }}</text>
                        <text class="fr cr-grey">{{ user.mobile_security || '' }} {{ (user.mobile_security || null) == null ? $t('setup.setup.dfg4wf') : $t('setup.setup.j6skqh') }}</text>
                    </view>
                    <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0 && home_user_login_type.indexOf('email') != -1" class="item padding-vertical-xxl padding-right-xxxl arrow-right" data-value="/pages/login/login?opt_type=bind_email&opt_form=bind_email" @tap="url_event">
                        <text>{{$t('setup.setup.5u59b1')}}</text>
                        <text class="fr cr-grey">{{ user.email_security || '' }} {{ (user.email_security || null) == null ? $t('setup.setup.dfg4wf') : $t('setup.setup.j6skqh') }}</text>
                    </view>
                    <view class="item padding-vertical-xxl padding-right-xxxl arrow-right" data-value="/pages/password/password" @tap="url_event">
                        <text>{{$t('setup.setup.v8438r')}}</text>
                        <text class="fr cr-grey">{{ $t('setup.setup.j6skqh') }}</text>
                    </view>

                    <!-- 第三方账户绑定-->
                    <!-- #ifdef APP || H5 -->
                    <block v-if="(plugins_thirdpartylogin_data || null) != null">
                        <block v-for="(item, index) in plugins_thirdpartylogin_data" :key="index">
                            <block v-if="(item.bind_user_id || 0) == 0">
                                <view class="item padding-vertical-xxl padding-right-xxxl arrow-right" :data-value="'/pages/login/login?opt_type=bind_platform&opt_form=bind_platform&platform_type='+index" @tap="url_event">
                                    <text>{{item.name}}</text>
                                    <text class="fr cr-grey">{{ $t('setup.setup.dfg4wf') }}</text>
                                </view>
                            </block>
                            <block v-else>
                                <view class="item padding-vertical-xxl padding-right-xxxl arrow-right" :data-value="item.bind_id" @tap="unbind_event">
                                    <text>{{item.name}}</text>
                                    <view class="fr">
                                        <text class="cr-grey">{{item.bind_nickname}}</text>
                                        <text class="cr-blue margin-left-sm">{{ $t('setup.setup.87ytgh') }}</text>
                                    </view>
                                </view>
                            </block>
                        </block>
                    </block>
                    <!-- #endif -->
                    <view v-if="home_use_multilingual_status == 1" class="item padding-vertical-xxl padding-right-xxxl arrow-right" @tap="open_language_event">
                        <text>{{ $t('setup.setup.r7jz13') }}</text>
                        <text class="fr cr-grey">{{ language }}</text>
                    </view>
                </view>

                <!-- 地址、发票-->
                <view class="panel-item padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                    <view class="item padding-vertical-xxl padding-right-xxxl arrow-right" data-value="/pages/user-address/user-address" @tap="url_event">
                        <text>{{ $t('setup.setup.42mba7') }}</text>
                        <text class="fr cr-grey">{{ $t('setup.setup.5eltza') }}</text>
                    </view>
                    <view v-if="(plugins_invoice || null) != null" class="item padding-vertical-xxl padding-right-xxxl arrow-right" data-value="/pages/plugins/invoice/invoice/invoice" @tap="url_event">
                        <text>{{ $t('setup.setup.t60222') }}</text>
                        <text class="fr cr-grey">{{ $t('setup.setup.izg78g') }}</text>
                    </view>
                </view>
            </block>

            <!-- 权限管理、清除缓存、客服电话、账号注销 -->
            <view class="panel-item padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                <!-- #ifdef MP || APP -->
                <view class="item padding-vertical-xxl padding-right-xxxl arrow-right" @tap="open_setting_event">
                    <text>{{ $t('setup.setup.377uwg') }}</text>
                    <text class="fr cr-grey">{{ $t('setup.setup.5eltza') }}</text>
                </view>
                <!-- #endif -->
                <view class="item padding-vertical-xxl padding-right-xxxl arrow-right" @tap="remove_user_cache_event">
                    <text>{{ $t('setup.setup.5493ui') }}</text>
                    <text class="fr cr-grey">{{ $t('setup.setup.f53166') }}</text>
                </view>
                <view v-if="(common_app_customer_service_tel || null) != null" class="item padding-vertical-xxl padding-right-xxxl arrow-right" @tap="call_event">
                    <text>{{ $t('setup.setup.656fv1') }}</text>
                    <text class="fr cr-grey">{{ common_app_customer_service_tel || '' }} {{ $t('setup.setup.f25wcx') }}</text>
                </view>
                <view v-if="(user || null) != null" class="item padding-vertical-xxl padding-right-xxxl arrow-right" data-value="/pages/logout/logout" @tap="url_event">
                    <text>{{ $t('setup.setup.11k15d') }}</text>
                    <text class="fr cr-grey">{{ $t('setup.setup.48r261') }}</text>
                </view>
                <view class="item padding-vertical-xxl padding-right-xxxl arrow-right" data-value="/pages/about/about" @tap="url_event">
                    <text>{{ $t('setup.setup.tghrf2') }}</text>
                </view>
            </view>
            <!-- 打开语言选择弹层-->
            <component-lang-switch ref="lang_switch" @popup_sub_language_event="popup_sub_language_event"></component-lang-switch>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
    import componentLangSwitch from '@/components/lang-switch/lang-switch';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                default_avatar: app.globalData.data.default_user_head_src,
                user: null,
                common_app_customer_service_tel: null,
                plugins_invoice: null,
                home_user_login_type: [],
                common_user_is_mandatory_bind_mobile: 0,

                home_use_multilingual_status: 0,
                // 实际提交的语言字段
                language: '',
                
                // 第三方登录插件
                plugins_thirdpartylogin_data: null,
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentLangSwitch
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 多语言
            var language_key = app.globalData.get_language_value();
            var language_list = this.$t('language');
            this.setData({
                language: language_list[language_key],
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            app.globalData.init_config(0, this, 'init_config');
            
            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {                    
                    this.setData({
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                        home_use_multilingual_status: app.globalData.get_config('config.home_use_multilingual_status'),
                        plugins_invoice: app.globalData.get_config('plugins_base.invoice', null),
                        home_user_login_type: app.globalData.get_config('config.home_user_login_type'),
                        common_user_is_mandatory_bind_mobile: app.globalData.get_config('config.common_user_is_mandatory_bind_mobile'),
                        plugins_thirdpartylogin_data: app.globalData.get_config('plugins_thirdpartylogin_data') || null,
                    });
                    
                    // 第三方登录
                    // #ifdef APP
                    if((this.plugins_thirdpartylogin_data || null) != null) {
                        uni.getProvider({
                            service: 'oauth',
                            success: (result) => {
                                // app第三方登录通道隔离
                                var app_login_provider_list = result.provider || [];
                                var thirdpartylogin = this.plugins_thirdpartylogin_data || {};
                                if (Object.keys(thirdpartylogin).length) {
                                    var temp_thirdpartylogin = Object.keys(thirdpartylogin).reduce((pre, cur) => {
                                        if (this.app_login_provider_list.includes(cur)) {
                                            pre[cur] = thirdpartylogin[cur];
                                        }
                                        return pre;
                                    }, {});
                                    this.setData({
                                        plugins_thirdpartylogin_data: temp_thirdpartylogin,
                                    });
                                }
                            },
                            fail: (error) => {},
                        });
                    }
                    // #endif
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_cache_info();
                if (user != null) {
                    this.setData({
                        user: user
                    });
                }
            },

            // 解绑
            unbind_event(e) {
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('unbind', 'index', 'thirdpartylogin'),
                    method: 'POST',
                    data: {id: e.currentTarget.dataset.value},
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            app.globalData.init_config(0, this, 'init_config');
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

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 打开权限管理中心
            open_setting_event() {
                app.globalData.open_setting_event();
            },

            // 客服电话
            call_event() {
                if (this.common_app_customer_service_tel == null) {
                    app.globalData.showToast(this.$t('setup.setup.utnr7g'));
                } else {
                    app.globalData.call_tel(this.common_app_customer_service_tel);
                }
            },

            // 清除缓存
            remove_user_cache_event(e) {
                app.globalData.remove_user_cache_event(false);
            },
            open_language_event () {
                if ((this.$refs.lang_switch || null) != null) {
                    this.$refs.lang_switch.lang_open_event();
                }
            },
            // 提交语言选择
            popup_sub_language_event(e) {
                this.setData({
                    language: e,
                });
                // 重新设置当前页面导航标题
                app.globalData.set_pages_navigation_bar_title();
                // 重新读取数据配置
                app.globalData.init_config();
            },
        },
    };
</script>
<style>
    @import './setup.css';
</style>