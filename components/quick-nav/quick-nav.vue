<template>
    <view :class="theme_view">
        <!-- 开启事件 -->
        <movable-area v-if="propIsBtn && quick_status == 1" :class="'quick-movable-container ' + common_ent" :style="'height: calc(100% - ' + height_dec + 'rpx);top:' + top + 'rpx;'">
            <movable-view direction="all" :x="x" :y="y" :animation="false" class="quick-event-submit" @tap="quick_open_event">
                <image class="image" :src="common_static_url + 'quick-icon.png'" mode="widthFix"></image>
            </movable-view>
        </movable-area>

        <!-- 弹窗 -->
        <component-popup :propShow="popup_status" :propIsBar="propIsBar" propPosition="bottom" @onclose="quick_close_event">
            <view :class="'nav-popup-container ' + common_ent">
                <view class="close oh">
                    <view class="fr" @tap.stop="quick_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="nav-popup-content">
                    <view v-if="data_list.length > 0" class="nav-data-list">
                        <view v-for="(item, index) in data_list" :key="index" class="item cp">
                            <view :class="'item-content ' + ((item.bg_color || null) == null ? 'item-exposed' : '')" :data-value="item.event_value" :data-type="item.event_type" @tap="navigation_event" :style="(item.bg_color || null) == null ? '' : 'background-color:' + item.bg_color + ';'">
                                <image class="image" :src="item.images_url" mode="aspectFit"></image>
                            </view>
                            <view class="title">{{ item.name }}</view>
                        </view>
                    </view>
                    <view v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="0"></component-no-data>
                    </view>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: app.globalData.get_static_url('common'),
                popup_status: false,
                quick_status: 0,
                data_list: [],
                system: null,
                x: 0,
                y: 0,
                top: 0,
                height_dec: 0,
                is_first: 1,
                common_ent: '',
            };
        },
        components: {
            componentPopup,
            componentNoData,
        },
        props: {
            propIsBtn: {
                type: Boolean,
                default: true,
            },
            propIsBar: {
                type: Boolean,
                default: false,
            },
            propIsNav: {
                type: Boolean,
                default: false,
            },
            propIsGrayscale: {
                type: Boolean,
                default: false,
            },
        },
        // 属性值改变监听
        watch: {
            // 是否灰度
            propIsGrayscale(value, old_value) {
                this.common_ent = value ? 'grayscale' : '';
            },
        },
        // 页面被展示
        created: function () {
            this.init_config();

            // 页面是否定义导航
            var value = this.propIsNav ? 100 : 0;
            this.top = value;
            this.height_dec = value;
            // #ifdef H5 || APP
            this.top = 140;
            this.height_dec = this.propIsBar ? 280 : 140;
            // #endif

            // 非首次进入则重新初始化配置接口
            if (this.is_first == 0) {
                app.globalData.init_config();
            }

            // 数据设置
            var system = app.globalData.get_system_info(null, null, true);
            var height = app.globalData.window_height_handle(system);
            var width = app.globalData.window_width_handle(system.windowWidth);
            this.setData({
                is_first: 0,
                system: system,
                x: width - 65,
                y: height - 280,
                // 是否灰度
                common_ent: this.propIsGrayscale ? 'grayscale' : '',
            });
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    var data_list = app.globalData.get_config('quick_nav') || [];
                    this.setData({
                        data_list: data_list,
                        quick_status: (data_list.length > 0) ? (app.globalData.get_config('config.home_navigation_main_quick_status') || 0) : 0,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 弹层开启
            quick_open_event(e) {
                this.setData({
                    popup_status: true,
                    data_list: app.globalData.get_config('quick_nav') || [],
                });
            },

            // 弹层关闭
            quick_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },

            // 操作事件
            navigation_event(e) {
                this.setData({
                    popup_status: false,
                });
                app.globalData.operation_event(e);
            },
        },
    };
</script>
<style>
    /**
     * 按钮
     */
    .quick-movable-container {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: transparent;
        pointer-events: none;
        z-index: 2;
    }

    .quick-event-submit {
        pointer-events: auto;
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    .quick-event-submit .image {
        width: 50px !important;
        height: 50px !important;
        display: block;
        position: relative;
        z-index: 10;
        border-radius: 100%;
        box-shadow: 0 0 6rpx 10rpx rgba(89, 181, 255, 15%);
        background: #59b5ff;
    }

    /**
     * 弹窗
     */
    .nav-popup-container {
        padding: 20rpx 10rpx 0 10rpx;
        background: #fff;
    }

    .nav-popup-container .close {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        z-index: 2;
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

    .nav-data-list .item {
        width: calc(25% - 60rpx);
        float: left;
        padding: 30rpx;
        /* #ifdef H5 */
        cursor: pointer;
        /* #endif */
    }

    .nav-data-list .item-content {
        border-radius: 50%;
        padding: 20rpx;
        text-align: center;
        margin: 0 auto;
        -webkit-box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
        box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
    }

    .nav-data-list .item-content,
    .nav-data-list .item .image {
        width: 70rpx !important;
        height: 70rpx !important;
    }

    .nav-data-list .item .item-exposed {
        padding: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .nav-data-list .item .item-exposed,
    .nav-data-list .item .item-exposed .image {
        width: 110rpx !important;
        height: 110rpx !important;
    }

    .nav-data-list .item .title {
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
