<template>
    <view>
        <!-- 开启事件 -->
        <movable-area v-if="online_service_status == 1" class="online-service-movable-container" :style="'height: calc(100% - '+height_dec+'rpx);top:'+top+'rpx;'">
            <movable-view direction="all" :x="x" :y="y" :animation="false" class="online-service-event-submit">
                <!-- #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU -->
                <button open-type="contact" :class="common_ent">
                    <image :src="common_static_url+'online-service-icon.png'" class="dis-block"></image>
                </button>
                <!-- #endif -->
                <!-- #ifdef MP-ALIPAY -->
                <button open-type="contact" :class="common_ent" :show-message-card="propCard" :send-message-title="propTitle" :send-message-path="propPath" :send-message-img="propImg">
                    <contact-button :tnt-inst-id="mini_alipay_tnt_inst_id" :scene="mini_alipay_scene" :alipay-card-no="mini_alipay_openid || ''" :icon="common_static_url+'online-service-icon.png'" size="60rpx*60rpx" />
                </button>
                <!-- #endif -->
                <!-- #ifdef H5 || APP -->
                <button type="default" :class="common_ent" @tap="call_event">
                    <image :src="common_static_url+'online-service-icon.png'" class="dis-block"></image>
                </button>
                <!-- #endif -->
            </movable-view>
        </movable-area>
    </view>
</template>
<script>
    const app = getApp();
     var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                common_app_customer_service_tel: null,
                online_service_status: 0,
                mini_alipay_tnt_inst_id: null,
                mini_alipay_scene: null,
                mini_alipay_openid: null,
                system: null,
                x: 0,
                y: 0,
                top: 0,
                height_dec: 0,
                is_first: 1,
                common_ent: ''
            };
        },
        components: {},
        props: {
            propIsBar: {
            	type: Boolean,
            	default: false
            },
            propIsNav: {
            	type: Boolean,
            	default: false
            },
            propCard: {
            	type: Boolean,
            	default: false
            },
            propTitle: {
            	type: String,
            	default: ''
            },
            propImg: {
            	type: String,
            	default: ''
            },
            propPath: {
            	type: String,
            	default: ''
            },
            propIsGrayscale: {
            	type:Number,
            	default: 0
            }
        },
        // 属性值改变监听
        watch: {
            // 是否灰度
        	propIsGrayscale(value, old_value) {
                this.common_ent = (value == 1) ? 'grayscale' : '';
        	}
        },
        // 页面被展示
        created: function(e) {
            this.init_config();

            // 页面是否定义导航
            var value = this.propIsNav ? 170 : 0;
            this.top = value
            this.height_dec = value;
            // #ifdef H5 || APP
            this.top = 90;
            this.height_dec = this.propIsBar ? 190 : 90;
            // #endif

            // 非首次进入则重新初始化配置接口
            if (this.is_first == 0) {
                app.globalData.init_config();
            }

            // 数据设置
            var system = app.globalData.get_system_info(null, null, true);
            var width = app.globalData.window_width_handle(system.windowWidth);
            var height = app.globalData.window_height_handle(system);
            this.setData({
                is_first: 0,
                system: system,
                x: width - 43,
                y: height - 380
            });
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    // #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU || MP-ALIPAY || H5 || APP
                    this.setData({
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                        online_service_status: app.globalData.get_config('config.common_app_is_online_service') || 0
                    });
                    // #endif
                    
                    // #ifdef H5 || APP
                    if((this.common_app_customer_service_tel || null) == null) {
                        this.setData({
                            online_service_status: 0
                        });
                    }
                    // #endif

                    // #ifdef MP-ALIPAY
                    // 在线客服开启，获取用户openid
                    if(this.online_service_status == 1)
                    {
                        this.setData({
                            mini_alipay_tnt_inst_id: app.globalData.get_config('config.common_app_mini_alipay_tnt_inst_id'),
                            mini_alipay_scene: app.globalData.get_config('config.common_app_mini_alipay_scene'),
                            mini_alipay_openid: app.globalData.get_user_cache_info('alipay_openid')
                        });
                    }
                    // #endif
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 客服电话
            call_event() {
                if (this.common_app_customer_service_tel == null) {
                    app.globalData.showToast("客服电话有误");
                } else {
                    app.globalData.call_tel(this.common_app_customer_service_tel);
                }
            }
        }
    };
</script>
<style>
    .online-service-movable-container {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: transparent;
        pointer-events: none;
        z-index: 2;
    }
    .online-service-event-submit {
        pointer-events: auto;
    }
    .online-service-event-submit,
    .online-service-event-submit button {
        width: 31px;
        height: 31px;
        border-radius: 50%;
    }
    .online-service-event-submit button {
        border: 0;
        padding: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        background: rgba(0, 0, 0, 0.6);
    }
    .online-service-event-submit image {
        width: 21px !important;
        height: 21px !important;
    }
    /* #ifdef MP-ALIPAY */
    .online-service-event-submit contact-button {
        line-height: initial;
        display: block;
    }
    /* #endif */
</style>