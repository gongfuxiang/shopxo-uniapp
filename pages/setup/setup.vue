<template>
    <view :class="theme_view">
        <view class="page padding-main">
            <!-- 主体内容 -->
            <block v-if="data_list_loding_status == 3">
                <view class="padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right oh" data-value="/pages/personal/personal" @tap="url_event">
                        <image :src="user.avatar || default_avatar" mode="widthFix" class="circle br fl user-avatar"></image>
                        <view class="fl margin-left margin-top">
                            <view>{{ user.user_name_view || $t('login.login.6yfr9g') }}</view>
                        </view>
                    </view>
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-t" data-value="/pages/login/login?opt_form=bind_verify" @tap="url_event">
                        <text>{{ $t('setup.setup.x81v6d') }}</text>
                        <text class="fr cr-grey">{{ user.mobile_security || '' }} {{ $t('setup.setup.j6skqh') }}</text>
                    </view>
                    <view v-if="home_use_multilingual_status == 1" class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-t" data-value="/pages/login/login?opt_form=bind_verify" @tap="open_language_event">
                        <text>{{ $t('setup.setup.r7jz13') }}</text>
                        <text class="fr cr-grey">{{ language }}</text>
                    </view>
                </view>

                <view class="padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right" data-value="/pages/user-address/user-address" @tap="url_event">
                        <text>{{ $t('setup.setup.42mba7') }}</text>
                        <text class="fr cr-grey">{{ $t('setup.setup.5eltza') }}</text>
                    </view>
                    <view v-if="(plugins_invoice || null) != null" class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-t" data-value="/pages/plugins/invoice/invoice/invoice" @tap="url_event">
                        <text>{{ $t('setup.setup.t60222') }}</text>
                        <text class="fr cr-grey">{{ $t('setup.setup.izg78g') }}</text>
                    </view>
                </view>

                <view class="padding-horizontal-main border-radius-main bg-white oh spacing-mb">
                    <!-- #ifdef MP -->
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-b" @tap="open_setting_event">
                        <text>{{ $t('setup.setup.377uwg') }}</text>
                        <text class="fr cr-grey">{{ $t('setup.setup.5eltza') }}</text>
                    </view>
                    <!-- #endif -->
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-b" @tap="remove_user_cache_event">
                        <text>{{ $t('setup.setup.5493ui') }}</text>
                        <text class="fr cr-grey">{{ $t('setup.setup.f53166') }}</text>
                    </view>
                    <view v-if="(common_app_customer_service_tel || null) != null" class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right br-b" @tap="call_event">
                        <text>{{ $t('setup.setup.656fv1') }}</text>
                        <text class="fr cr-grey">{{ common_app_customer_service_tel || '' }} {{ $t('setup.setup.f25wcx') }}</text>
                    </view>
                    <view class="padding-top-xxl padding-bottom-xxl padding-right-xxxl arrow-right" data-value="/pages/logout/logout" @tap="url_event">
                        <text>{{ $t('setup.setup.11k15d') }}</text>
                        <text class="fr cr-grey">{{ $t('setup.setup.48r261') }}</text>
                    </view>
                </view>

                <!-- 打开语言选择弹层-->
                <component-popup :propShow="popup_language_status" propPosition="bottom" :propIsRadius="false" @onclose="popup_language_close_event">
                    <view class="popup-language">
                        <view class="flex-row align-c jc-sb padding-main">
                            <view @tap="popup_language_close_event">
                                <iconfont name="icon-close-o" size="28rpx"></iconfont>
                            </view>
                            <view class="text-size" @tap="popup_sub_language_event">{{ $t('common.confirm') }}</view>
                        </view>
                        <view class="br-t-f5 padding-main list">
                            <view v-for="(value, key) in language_list" :key="key" class="spacing-mb flex-row jc-sb align-c" :class="language_key == key ? 'cr-main' : ''" :data-key="key" :data-value="value" @tap="checked_language_event">
                                {{ value }}
                                <iconfont v-if="language_key == key" name="icon-checked" size="32rpx"></iconfont>
                            </view>
                        </view>
                    </view>
                </component-popup>
            </block>

            <!-- 错误提示 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../components/no-data/no-data';
    import componentPopup from '../../components/popup/popup';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                default_avatar: app.globalData.data.default_user_head_src,
                user: null,
                common_app_customer_service_tel: null,
                plugins_invoice: null,

                // 多语言
                system_locale: '',
                application_locale: '',
                is_android: '',
                home_use_multilingual_status: 0,
                // 语言选择
                popup_language_status: false,
                language_list: '',
                language_key: '',
                // 实际提交的语言字段
                language: '',
            };
        },

        components: {
            componentNoData,
            componentPopup,
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 多语言
            let system_info = uni.getSystemInfoSync();
            this.system_locale = system_info.language;
            this.application_locale = app.globalData.get_language_value();
            this.is_android = system_info.platform.toLowerCase() === 'android';
            uni.onLocaleChange((e) => {
                this.application_locale = e.locale;
            });
            var language_key = app.globalData.get_language_value();
            var language_list = this.$t('language');
            this.setData({
                language_list: language_list,
                language_key: language_key,
                language: language_list[language_key],
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();

            console.log(uni.getLocale());
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                        home_use_multilingual_status: app.globalData.get_config('config.home_use_multilingual_status'),
                        plugins_invoice: app.globalData.get_config('plugins_base.invoice', null),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        this.setData({
                            data_list_loding_status: 0,
                            data_list_loding_msg: this.$t('setup.setup.07o10b'),
                        });
                        return false;
                    } else {
                        this.setData({
                            data_list_loding_status: 3,
                            user: user,
                        });
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('setup.setup.nwt4o1'),
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
                    app.globalData.showToast(this.$t('setup.setup.utnr7g'));
                } else {
                    app.globalData.call_tel(this.common_app_customer_service_tel);
                }
            },

            // 清除缓存
            remove_user_cache_event(e) {
                app.globalData.remove_user_cache_event();
            },

            // 打开语言选择弹窗
            open_language_event() {
                this.setData({
                    popup_language_status: !this.popup_language_status,
                });
            },

            // 关闭语言弹窗
            popup_language_close_event() {
                this.setData({
                    popup_language_status: false,
                });
            },

            // 选择语言
            checked_language_event(e) {
                this.setData({
                    language_key: e.currentTarget.dataset.key,
                });
            },

            // 提交语言选择
            popup_sub_language_event() {
                this.language_change(this.language_key);
                var language_list = this.$t('language');
                this.setData({
                    language_list: language_list,
                    language: language_list[this.language_key],
                    popup_language_status: false,
                });
                // 重新设置当前页面导航标题
                app.globalData.set_pages_navigation_bar_title();
            },

            // 多语言切换
            language_change(key) {
                if (this.is_android) {
                    uni.showModal({
                        content: this.$t('login.login.d9d11z'),
                        success: (res) => {
                            if (res.confirm) {
                                uni.setLocale(key);
                            }
                        },
                    });
                } else {
                    uni.setLocale(key);
                    this.$i18n.locale = key;
                }
            },
        },
    };
</script>
<style>
    @import './setup.css';
</style>
