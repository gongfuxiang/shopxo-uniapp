<template>
    <block v-if="online_service_status == 1">
        <!-- 是否商品页样式 -->
        <view v-if="propIsGoods == true" class="goods-chat-container item fl cp">
            <block v-if="is_chat == 1">
                <view @tap="chat_event">
                    <image class="icon" :src="common_static_url+'chat-icon.png'" mode="scaleToFill"></image>
                    <text class="text dis-block text-size-xs cr-gray">客服</text>
                </view>
            </block>
            <block v-else>
                <!-- #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU || MP-KUAISHOU -->
                <button open-type="contact" :show-message-card="propCard" :send-message-title="propTitle" :send-message-path="propPath" :send-message-img="propImg">
                    <image class="icon" :src="common_static_url+'chat-icon.png'" mode="scaleToFill"></image>
                <!-- #endif -->
                <!-- #ifdef MP-ALIPAY -->
                <button open-type="contact" class="alipay-contact">
                    <contact-button :tnt-inst-id="mini_alipay_tnt_inst_id" :scene="mini_alipay_scene" :alipay-card-no="mini_alipay_openid || ''" :icon="common_static_url+'chat-icon.png'" size="40rpx*40rpx" />
                <!-- #endif -->
                <!-- #ifdef H5 || APP -->
                <button type="default" @tap="call_event">
                    <image class="icon" :src="common_static_url+'chat-icon.png'" mode="scaleToFill"></image>
                <!-- #endif -->
                    <text class="text dis-block text-size-xs cr-gray">客服</text>
                </button>
            </block>
        </view>
        <!-- 默认浮动展示-可拖拽位置 -->
        <view v-else>
            <block v-if="is_online_service_fixed == 1">
                <movable-area class="online-service-movable-container" :style="'height: calc(100% - '+height_dec+'rpx);top:'+top+'rpx;'">
                    <movable-view direction="all" :x="x" :y="y" :animation="false" class="online-service-event-submit">
                        <block v-if="is_chat == 1">
                            <button type="default" :class="common_ent" @tap="chat_event">
                                <image class="icon dis-block" :src="common_static_url+'online-service-icon.png'"></image>
                            </button>
                        </block>
                        <block v-else>
                            <!-- #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU -->
                            <button open-type="contact" :class="common_ent" :show-message-card="propCard" :send-message-title="propTitle" :send-message-path="propPath" :send-message-img="propImg">
                                <image class="icon dis-block" :src="common_static_url+'online-service-icon.png'"></image>
                            </button>
                            <!-- #endif -->
                            <!-- #ifdef MP-ALIPAY -->
                            <button open-type="contact" :class="'alipay-contact '+common_ent">
                                <contact-button :tnt-inst-id="mini_alipay_tnt_inst_id" :scene="mini_alipay_scene" :alipay-card-no="mini_alipay_openid || ''" :icon="common_static_url+'online-service-icon.png'" size="40rpx*40rpx" />
                            </button>
                            <!-- #endif -->
                            <!-- #ifdef H5 || APP -->
                            <button type="default" :class="common_ent" @tap="call_event">
                                <image class="icon dis-block" :src="common_static_url+'online-service-icon.png'"></image>
                            </button>
                            <!-- #endif -->
                        </block>
                    </movable-view>
                </movable-area>
            </block>
        </view>
    </block>
</template>
<script>
    const app = getApp();
    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                is_chat: 0,
                chat_url: null,
                common_app_customer_service_tel: null,
                online_service_status: 0,
                is_online_service_fixed: app.globalData.data.is_online_service_fixed,
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
            propIsGoods: {
            	type: Boolean,
            	default: false
            },
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
            },
            propIsChat: {
            	type:Number,
            	default: 0
            },
            propChatUrl: {
            	type: String,
            	default: ''
            },
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

            // 非首次进入则重新初始化配置接口
            if (this.is_first == 0) {
                app.globalData.init_config();
            }

            // 数据设置
            var system = app.globalData.get_system_info(null, null, true);
            var width = app.globalData.window_width_handle(system.windowWidth);
            var height = app.globalData.window_height_handle(system);
            
            // 页面是否定义导航
            var top_h = this.propIsNav ? 170 : 0;
            this.setData({
                is_first: 0,
                system: system,
                // 位置坐标
                x: width - 43,
                y: height - 380,
                // 展示位置处理
                top: top_h,
                height_dec: top_h,
                // #ifdef H5 || APP
                top: 90,
                height_dec: this.propIsBar ? 190 : 90,
                // #endif
                // 是否使用客服系统
                is_chat: this.propIsChat || this.is_chat,
                chat_url: this.propChatUrl || this.chat_url,
            });
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    // 是否使用客服系统
                    var is_chat = app.globalData.get_config('plugins_base.chat.data.is_mobile_chat', 0);
                    var chat_url = app.globalData.get_config('plugins_base.chat.data.chat_url');
                    if(is_chat == 1 && chat_url != null) {
                        this.setData({
                            is_chat: is_chat,
                            chat_url: chat_url,
                            common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                            online_service_status: app.globalData.get_config('config.common_app_is_online_service', 0)
                        });
                    } else {
                        // #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU || MP-ALIPAY || MP-KUAISHOU || H5 || APP
                        this.setData({
                            common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                            online_service_status: app.globalData.get_config('config.common_app_is_online_service', 0)
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
                    }
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
            },
            
            // 进入客服系统
            chat_event() {
                var url = this.propChatUrl || this.chat_url || null;
                app.globalData.chat_entry_handle(url);
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
    .online-service-event-submit .icon {
        width: 21px !important;
        height: 21px !important;
    }
    .goods-chat-container button {
        padding: 0;
        border: 0;
        line-height: initial;
        font-size: 24rpx;
        background: transparent;
    }
    .goods-chat-container .icon {
        width: 40rpx;
        height: 40rpx;
        margin: 10rpx 0 5rpx 0;
    }
    .goods-chat-container .text {
        margin-top: -10rpx;
    }
    /* #ifdef MP-ALIPAY */
    .goods-chat-container .alipay-contact {
        margin-top: 10rpx;
    }
    .goods-chat-container .alipay-contact .text {
        margin-top: -5rpx;
    }
    .online-service-event-submit contact-button {
        line-height: initial;
        display: block;
    }
    /* #endif */
</style>