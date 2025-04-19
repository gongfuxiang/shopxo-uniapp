<template>
    <view :class="theme_view">
        <block v-if="online_service_status == 1">
            <!-- 是否商品页样式 -->
            <view v-if="propIsGoods == true" class="goods-chat-container fl cp">
                <block v-if="is_chat == 1">
                    <view @tap="chat_event">
                        <image class="icon" :src="chat_icon" mode="scaleToFill"></image>
                        <text class="text dis-block text-size-xs cr-grey">{{$t('online-service.online-service.4l6k22')}}</text>
                    </view>
                </block>
                <block v-else>
                    <!-- #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU || MP-KUAISHOU -->
                    <button class="chat-btn" open-type="contact" :show-message-card="propCard" :send-message-title="propTitle" :send-message-path="propPath" :send-message-img="propImg">
                        <image class="icon" :src="chat_icon" mode="scaleToFill"></image>
                        <text class="text dis-block text-size-xs cr-grey">{{$t('online-service.online-service.4l6k22')}}</text>
                    </button>
                    <!-- #endif -->
                    <!-- #ifdef MP-ALIPAY -->
                    <button class="chat-btn alipay-contact" open-type="contact">
                        <contact-button class="alipay-chat-btn" :tnt-inst-id="mini_alipay_tnt_inst_id" :scene="mini_alipay_scene" :alipay-card-no="mini_alipay_openid || ''" :icon="chat_icon" size="40rpx*40rpx" />
                        <text class="text dis-block text-size-xs cr-grey">{{$t('online-service.online-service.4l6k22')}}</text>
                    </button>
                    <!-- #endif -->
                    <!-- #ifdef H5 || APP -->
                    <button class="chat-btn" type="default" @tap="call_event">
                        <image class="icon" :src="chat_icon" mode="scaleToFill"></image>
                        <text class="text dis-block text-size-xs cr-grey">{{$t('online-service.online-service.4l6k22')}}</text>
                    </button>
                    <!-- #endif -->
                </block>
            </view>
            <!-- 默认浮动展示-可拖拽位置 -->
            <view v-else>
                <block v-if="is_online_service_fixed == 1">
                    <block v-if="propIsMovable">
                        <movable-area class="online-service-movable-container" :style="'height: calc(100% - '+height_dec+'rpx);top:'+top+'rpx;'">
                            <movable-view direction="all" :x="x" :y="y" :animation="false" :class="'online-service-event-submit '+(propIsSpread ? ' spread' : '')">
                                <block v-if="propIsSpread">
                                    <view class="ring"></view>
                                    <view class="ring"></view>
                                </block>
                                <block v-if="is_chat == 1">
                                    <button class="chat-btn" type="default" :class="common_ent" @tap="chat_event">
                                        <image class="icon dis-block" :src="chat_image"></image>
                                    </button>
                                </block>
                                <block v-else>
                                    <!-- #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU -->
                                    <button class="chat-btn" open-type="contact" :class="common_ent" :show-message-card="propCard" :send-message-title="propTitle" :send-message-path="propPath" :send-message-img="propImg">
                                        <image class="icon dis-block" :src="chat_image"></image>
                                    </button>
                                    <!-- #endif -->
                                    <!-- #ifdef MP-ALIPAY -->
                                    <button class="chat-btn" open-type="contact" :class="'alipay-contact '+common_ent">
                                        <contact-button class="alipay-chat-btn" :tnt-inst-id="mini_alipay_tnt_inst_id" :scene="mini_alipay_scene" :alipay-card-no="mini_alipay_openid || ''" :icon="chat_image" size="50px*50px" />
                                    </button>
                                    <!-- #endif -->
                                    <!-- #ifdef H5 || APP -->
                                    <button class="chat-btn" type="default" :class="common_ent" @tap="call_event">
                                        <image class="icon dis-block" :src="chat_image"></image>
                                    </button>
                                    <!-- #endif -->
                                </block>
                            </movable-view>
                        </movable-area>
                    </block>
                    <block v-else>
                        <view class="online-service-movable-container" :style="'height: calc(100% - '+height_dec+'rpx);top:'+top+'rpx;'">
                            <view :class="'online-service-event-submit '+(propIsSpread ? ' spread' : '')">
                                <block v-if="propIsSpread">
                                    <view class="ring"></view>
                                    <view class="ring"></view>
                                </block>
                                <block v-if="is_chat == 1">
                                    <button class="chat-btn" type="default" :class="common_ent" @tap="chat_event">
                                        <image class="icon dis-block" :src="chat_image"></image>
                                    </button>
                                </block>
                                <block v-else>
                                    <!-- #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU -->
                                    <button class="chat-btn" open-type="contact" :class="common_ent" :show-message-card="propCard" :send-message-title="propTitle" :send-message-path="propPath" :send-message-img="propImg">
                                        <image class="icon dis-block" :src="chat_image"></image>
                                    </button>
                                    <!-- #endif -->
                                    <!-- #ifdef MP-ALIPAY -->
                                    <button class="chat-btn alipay-contact" :class="common_ent" open-type="contact">
                                        <contact-button class="alipay-chat-btn" :tnt-inst-id="mini_alipay_tnt_inst_id" :scene="mini_alipay_scene" :alipay-card-no="mini_alipay_openid || ''" :icon="chat_image" size="50px*50px" />
                                    </button>
                                    <!-- #endif -->
                                    <!-- #ifdef H5 || APP -->
                                    <button class="chat-btn" type="default" :class="common_ent" @tap="call_event">
                                        <image class="icon dis-block" :src="chat_image"></image>
                                    </button>
                                    <!-- #endif -->
                                </block>
                            </view>
                        </view>
                    </block>
                </block>
            </view>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: app.globalData.get_static_url('common'),
                client_value: app.globalData.application_client_type(),
                is_chat: 0,
                chat_url: null,
                chat_icon: '',
                chat_image: '',
                common_app_customer_service_tel: null,
                common_app_customer_service_custom: null,
                common_app_customer_service_company_weixin_corpid: null,
                common_app_customer_service_company_weixin_url: null,
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
            	type: Boolean,
            	default: false
            },
            propIsChat: {
            	type: Number,
            	default: 0
            },
            propChatUrl: {
            	type: String,
            	default: ''
            },
            propChatIcon: {
            	type: String,
            	default: ''
            },
            propChatImage: {
            	type: String,
            	default: ''
            },
            propIsSpread: {
            	type: Boolean,
            	default: true
            },
            propIsMovable: {
            	type: Boolean,
            	default: true
            },
        },
        // 属性值改变监听
        watch: {
            // 是否灰度
        	propIsGrayscale(value, old_value) {
                this.common_ent = value ? 'grayscale' : '';
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
            var top_h = this.propIsNav ? 130 : 0;
            this.setData({
                is_first: 0,
                system: system,
                chat_icon: this.propChatIcon || this.common_static_url+'chat-icon.png',
                chat_image: this.propChatImage || this.common_static_url+'online-service-icon.png',
                // 位置坐标
                x: width - 65,
                y: height - 380,
                // 展示位置处理
                top: top_h,
                height_dec: top_h,
                // #ifdef H5 || APP
                top: 210,
                height_dec: this.propIsBar ? 310 : 210,
                // #endif
                // 是否灰度
                common_ent: this.propIsGrayscale ? 'grayscale' : ''
            });
        },
        methods: {
            // 初始化配置
            init_config(status) {
                // 客服优先级顺序( 客服系统 -> 自定义客服 -> 企业微信客服(仅app+h5+微信小程序生效) -> 各端平台客服 -> 电话客服 )
                if ((status || false) == true) {
                    // 是否使用客服系统
                    var is_chat = app.globalData.get_config('plugins_base.chat.data.is_mobile_chat', 0);
                    var chat_url = app.globalData.get_config('plugins_base.chat.data.chat_url');
                    var is_online_service = app.globalData.get_config('config.common_app_is_online_service', 0);
                    if(is_chat == 1 && (chat_url != null || (this.propChatUrl || null) != null)) {
                        this.setData({
                            is_chat: is_chat,
                            chat_url: this.propChatUrl || chat_url,
                            online_service_status: is_online_service,
                        });
                    } else {
                        var online_service_url = app.globalData.get_config('config.common_app_customer_service_custom', null);
                        this.setData({
                            common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel', null),
                            common_app_customer_service_custom: (online_service_url == null || (online_service_url[this.client_value] || null) == null) ? null : online_service_url[this.client_value],
                            common_app_customer_service_company_weixin_corpid: app.globalData.get_config('config.common_app_customer_service_company_weixin_corpid', null),
                            common_app_customer_service_company_weixin_url: app.globalData.get_config('config.common_app_customer_service_company_weixin_url', null),
                            online_service_status: is_online_service,
                        });

                        // 存在自定义客服和微信企业客服则走客服模式
                        if((this.common_app_customer_service_custom || null) != null || ((this.common_app_customer_service_company_weixin_corpid || null) != null && (this.common_app_customer_service_company_weixin_url || null) != null)) {
                            this.setData({
                                is_chat: 1
                            });
                        }

                        // 对应平台没有提供客服的、[电话，自定义客服，企业微信客服]必须存在一个，则关闭在线客服
                        if(['qq', 'h5', 'ios', 'android'].indexOf(this.client_value) != -1 && (this.common_app_customer_service_tel || null) == null && (this.common_app_customer_service_custom || null) == null) {
                            var temp_service_status = this.online_service_status;
                            if(this.client_value == 'qq') {
                                temp_service_status = 0;
                            } else {
                                // h5,app是否配置企业微信客服
                                if((this.common_app_customer_service_company_weixin_corpid || null) == null && (this.common_app_customer_service_company_weixin_url || null) == null) {
                                    temp_service_status = 0;
                                }
                            }
                            this.setData({
                                online_service_status: temp_service_status
                            });
                        }

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

            // 客服事件
            chat_event() {
                // 在线客服系统
                if((this.chat_url || null) != null) {
                    app.globalData.chat_entry_handle(this.chat_url);
                } else {
                    // 自定义客服
                    if((this.common_app_customer_service_custom || null) != null) {
                        app.globalData.url_open(this.common_app_customer_service_custom);
                    } else {
                        // 企业微信客服
                        if((this.common_app_customer_service_company_weixin_corpid || null) != null && (this.common_app_customer_service_company_weixin_url || null) != null) {
                            // #ifdef APP
                            // app打开企业微信客服
                            plus.share.getServices(res => {
                                var wechat = res.find(i => i.id === 'weixin')
                                if(wechat) {
                                    wechat.openCustomerServiceChat({
                                        corpid: this.common_app_customer_service_company_weixin_corpid,
                                        url: this.common_app_customer_service_company_weixin_url,
                                    });
                                }
                            });
                            // #endif

                            // #ifdef MP-WEIXIN
                            // 微信小程序打开企业微信客服
                            uni.openCustomerServiceChat({
                                extInfo: {url: this.common_app_customer_service_company_weixin_url},
                                corpId: this.common_app_customer_service_company_weixin_corpid,
                                showMessageCard: this.propCard,
                                sendMessageTitle: this.propTitle,
                                sendMessagePath: this.propPath,
                                sendMessageImg: this.propImg,
                            });
                            // #endif
                            // #ifdef H5
                            app.globalData.url_open(this.common_app_customer_service_company_weixin_url);
                            // #endif
                        } else {
                            // 电话客服
                            this.call_event();
                        }
                    }
                }
            },

            // 客服电话
            call_event() {
                app.globalData.call_tel(this.common_app_customer_service_tel);
            }
        }
    };
</script>
<style scoped>
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
    .online-service-event-submit .chat-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .online-service-event-submit .chat-btn {
        border: 0;
        padding: 0;
    }
    .online-service-event-submit .icon {
        width: 50px !important;
        height: 50px !important;
        position: relative;
    }
    .goods-chat-container .chat-btn {
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
    .online-service-event-submit .alipay-chat-btn {
        line-height: initial;
        display: block;
    }
    /* #endif */
    
    /**
     * 呼吸灯
     */
     .spread {
        background-color: rgba(238, 73, 70,0.4);
        border-radius: 100%;
        width: 50px;
        height: 50px;
        position: relative;
        z-index: 1;
    }
    .spread .ring {
        /* 速度为1.5 * 层数 = 实际运行速度，速度修改则 animation-delay 属性也修改相同速度 */
        animation: pulsing 1.5s ease-out infinite;
        z-index: -1;
    }
    /* 速度为1*层数 */
    .spread .ring:nth-of-type(1) {
        -webkit-animation-delay: -1.5s;
        animation-delay: -1.5s;
    }

    /* 速度为1*层数 */
    .spread .ring:nth-of-type(2) {
        -webkit-animation-delay: -2s;
        animation-delay: -2s;
    }
    @keyframes pulsing {
        100% {
            transform: scale(1.35);
            opacity: 0
        }
    }
</style>