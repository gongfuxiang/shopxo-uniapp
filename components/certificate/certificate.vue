<template>
    <view :class="theme_view">
        <component-popup v-if="(config || null) != null" :propShow="popup_status" propPosition="bottom" :propMaskTap="(config.is_user_force_select || 0) == 0" @onclose="popup_close_event">
            <view :class="'certificate-popup bg-white ' + (propIsGrayscale ? 'grayscale' : '')">
                <view v-if="(config.is_user_force_select || 0) == 0" class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="24rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="certificate-content">
                    <view>{{config.user_auth_business_data.business_title}}</view>
                    <view class="business-type-data">
                        <block v-for="(item, index) in config.business_type_data" :key="index">
                            <view v-if="item.status == 1" class="item padding-main tc br radius margin-top-lg" :data-value="item.url" @tap="url_event">
                                <image v-if="(item.icon || null) != null" :src="item.icon" mode="aspectFit" class="icon radius margin-bottom-sm"></image>
                                <view>{{item.name || item.name_old}}</view>
                                <view v-if="(item.desc || null) != null" class="cr-grey margin-top-sm">{{item.desc}}</view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                popup_status: false,
                config: null
            };
        },

        components: {
            componentPopup,
        },
        props: {
            propIsGrayscale: {
                type: Boolean,
                default: false,
            },
        },

        created: function () {
            // 初始化配置
            this.init_config();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        config: app.globalData.get_config('plugins_base.certificate.data') || null,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始配置
            init(params = {}) {
                // 初始化配置
                this.init_config(true);
                // 公共接口已初始化完成
                if(app.globalData.data.common_data_init_status == 1) {
                    var user = app.globalData.get_user_cache_info() || null;
                    var current_page = app.globalData.current_page();
                    // 业务数据
                    if(user != null && current_page.indexOf('pages/plugins/certificate/') == -1 && current_page.indexOf('pages/web-view/web-view') == -1 && (this.config || null) != null && (this.config.user_auth_business_data || null) != null && (this.config.business_type_data || null) != null) {
                        // 必须还没认证，可以选择业务
                        if(!this.config.user_auth_business_data.auth_status && this.config.user_auth_business_data.is_select) {
                            this.setData({
                                popup_status: true,
                            });
                        }
                    }
                }
                return this.popup_status;
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },

            // url事件
            url_event(e) {
                var self = this;
                setTimeout(function() {
                    self.popup_close_event();
                }, 1000);
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style scoped>
    .certificate-popup {
        padding: 36rpx;
        position: relative;
    }
    .certificate-popup .close {
        position: absolute;
        top: 36rpx;
        right: 36rpx;
        z-index: 2;
    }
    .business-type-data .item .icon {
        height: 80rpx !important;
        max-width: 100%;
    }
</style>