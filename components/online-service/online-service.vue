<template>
    <view>
        <block>
            <!-- 开启事件 -->
            <movable-area v-if="online_service_status == 1" class="online-service-movable-container" :style="'height: calc(100% - '+top+'rpx);top:'+top+'rpx;'">
                <movable-view direction="all" :x="x" :y="y" :animation="false" class="online-service-event-submit">
                    <button :class="common_ent" open-type="contact" :show-message-card="propCard" :send-message-title="propTitle" :send-message-path="propPath" :send-message-img="propImg">
                        <image :src="common_static_url+'online-service-icon.png'" class="dis-block"></image>
                    </button>
                </movable-view>
            </movable-area>
        </block>
    </view>
</template>
<script>
    const app = getApp();
     var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                online_service_status: 0,
                system: null,
                x: 0,
                y: 0,
                top: 0,
                is_first: 1,
                common_ent: ''
            };
        },
        components: {},
        props: {
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

            // 是否定义导航
            this.top = this.propIsNav ? 150 : 0;

            // 非首次进入则重新初始化配置接口
            if (this.is_first == 0) {
                app.globalData.init_config();
            }

            // 数据设置
            var system = app.globalData.get_system_info();
            this.setData({
                is_first: 0,
                system: system,
                x: system.windowWidth-52,
                y: (system.windowHeight || 450) - 380
            });
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        online_service_status: app.globalData.get_config('config.common_app_is_online_service') || 0
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
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
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
    }
    .online-service-event-submit button {
        border: 0;
        padding: 15rpx;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        background: rgba(0, 0, 0, 0.6);
    }
    .online-service-event-submit image {
        width: 60rpx !important;
        height: 60rpx !important;
    }
</style>