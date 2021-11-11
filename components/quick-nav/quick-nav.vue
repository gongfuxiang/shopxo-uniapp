<template>
    <view>
        <!-- 开启事件 -->
        <movable-area v-if="quick_status == 1" :class="'nav-movable-container '+ common_ent" :style="'height: calc(100% - '+top+'rpx);top:'+top+'rpx;'">
            <movable-view direction="all" :x="x" :y="y" :animation="false" class="nav-event-submit bg-main" @tap="quick_open_event">
                <image :src="common_static_url+'quick-icon.png'" mode="widthFix"></image>
            </movable-view>
        </movable-area>

        <!-- 弹窗 -->
        <component-popup :prop-show="popup_status" prop-position="bottom" @onclose="quick_close_event">
            <view :class="'nav-popup-container '+common_ent">
                <view class="close oh">
                    <view class="icon-right" @tap.stop="quick_close_event">
                        <icon type="clear" size="20"></icon>
                    </view>
                </view>
                <view class="nav-popup-content">
                    <view v-if="data_list.length > 0" class="nav-data-list">
                        <view v-for="(item, index) in data_list" :key="index" class="items">
                            <view class="items-content" :data-value="item.event_value" :data-type="item.event_type" @tap="navigation_event" :style="'background-color:' + (item.bg_color || '#fff')">
                                <image :src="item.images_url" mode="aspectFit"></image>
                            </view>
                            <view class="title">{{item.name}}</view>
                        </view>
                    </view>
                    <view v-else>
                        <!-- 提示信息 -->
                        <component-no-data :prop-status="0"></component-no-data>
                    </view>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from "../popup/popup";
    import componentNoData from "../no-data/no-data";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                popup_status: false,
                quick_status: 0,
                data_list: [],
                system: null,
                x: 0,
                y: 0,
                top: 0,
                is_first: 1,
                common_ent: ''
            };
        },
        components: {
            componentPopup,
            componentNoData
        },
        props: {
            propIsNav: {
            	type: Boolean,
            	default: false
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
        created: function() {
            this.init_config();
            
            // 页面是否定义导航
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
                x: 5,
                y: (system.windowHeight || 450) - 200
            });
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        data_list: app.globalData.get_config('quick_nav') || [],
                        quick_status: app.globalData.get_config('config.home_navigation_main_quick_status') || 0
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 弹层开启
            quick_open_event(e) {
                this.setData({
                    popup_status: true,
                    data_list: app.globalData.get_config('quick_nav') || []
                });
            },

            // 弹层关闭
            quick_close_event(e) {
                this.setData({
                    popup_status: false
                });
            },

            // 操作事件
            navigation_event(e) {
                app.globalData.operation_event(e);
            }
        }
    };
</script>
<style>
    /**
     * 按钮
     */
    .nav-movable-container {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: transparent;
        pointer-events: none;
        z-index: 2;
    }
    .nav-event-submit {
        pointer-events: auto;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        opacity: 0.8;
    }
    .nav-event-submit image {
        width: 50rpx;
        height: 50rpx;
        margin: 25rpx auto 25rpx auto;
        display: block;
    }

    /**
     * 弹窗
     */
    .nav-popup-container {
        padding: 20rpx 10rpx 0 10rpx;
        background: #fff;
    }
    .nav-popup-container .close {
        overflow: hidden;
    }
    .nav-popup-container .close .icon-right {
        float: right;
    }
    .nav-popup-content {
        max-height: 80vh;
        overflow-y: scroll;
        overflow-x: hidden;
        padding-bottom: 20rpx;
    }

    /**
     * 内容
     */
    .nav-data-list {
        overflow: hidden;
        background: #fff;
    }
    .nav-data-list .items {
        width: calc(25% - 60rpx);
        float: left;
        padding: 30rpx;
    }
    .nav-data-list .items-content {
        border-radius: 50%;
        padding: 20rpx;
        text-align: center;
        width: 70rpx;
        height: 70rpx;
        margin: 0 auto;
        -webkit-box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
        box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
    }
    .nav-data-list .items image {
        width: 60rpx !important;
        height: 60rpx !important;
        margin-top: 5rpx;
    }
    .nav-data-list .items .title {
        margin-top: 10rpx;
        font-size: 28rpx !important;
        text-align: center;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 100%;
    }
</style>