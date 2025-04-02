<template>
    <view :class="theme_view">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view :class="'certificate-popup bg-white ' + (propIsGrayscale ? 'grayscale' : '')">
                <view class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="24rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="padding-main">
                    hello
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
                cconfig: null
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
                    // 业务数据
                    if((this.config || null) != null && (this.config.business_type_data || null) != null) {
                        this.setData({
                            popup_status: true,
                        });
                    }
                }
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },
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
</style>