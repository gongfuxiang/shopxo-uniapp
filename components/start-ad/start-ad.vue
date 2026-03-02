<template>
    <view :class="theme_view">
        <view v-if="show && data.length > 1" class="start page-width-max">
            <view class="skip round br" :style="skip_position_style" @tap.stop="skip_event">{{$t('common.skip')}} {{skip_time}}</view>
            <swiper class="swiper" autoplay circular :interval="interval_time" @change="swiper_change_event">
                <swiper-item v-for="(item, index) in data" :key="index">
                    <view class="swiper-item" :style="((item.bg_color || null) == null ? '' : 'background-color:'+item.bg_color)" :data-value="item.event_value" :data-type="item.event_type" @tap="swiper_tap_event">
                        <image class="image" :src="item.images_url" mode="widthFix"></image>
                    </view>
                </swiper-item>
            </swiper>
            <view class="swiper-dot">
                <block v-for="(item, index) in data" :key="index">
                    <view class="view" :style="index == current ? 'background-color:'+theme_color : ''" :class="{'active': index == current}"></view>
                </block>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        props: {
            // 页面是否包含navbar
            propHasNavbar: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                // 是否首次
                is_first: true,
                // 列表数据
                data: [],
                // 当前轮播位置
                current: 0,
                // 是否显示
                show: false,
                // 定时任务记录
                timer: null,
                // 倒计时跳过
                skip_time: 6,
                // 轮播自动播放时间
                interval_time: 3000,
            }
        },
        computed: {
            // 跳过样式
            skip_position_style() {
                const {
                    statusBarHeight
                } = uni.getSystemInfoSync();
                if (!this.propHasNavbar) {
                    return this.obj_to_style({
                        'top': `${statusBarHeight*2 + 88 + 30}rpx`,
                    });
                }
                return this.obj_to_style({
                    'top': '30rpx'
                });
            }
        },
        created: function () {
            this.init_config();
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.init();
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                let pages = app.globalData.app_tabbar_pages() || [];
                let current_page = '/'+app.globalData.current_page(false);
                if(this.is_first && pages.length > 0 && pages[0] == current_page) {
                    let base = app.globalData.get_config('plugins_base.startad.data') || {};
                    this.setData({
                        is_first: false,
                        data: app.globalData.get_config('plugins_startad_list') || [],
                        skip_time: parseInt(base.skip_time || 6),
                        interval_time: parseInt(base.interval_time || 3)*1000,
                        show: parseInt(base.is_status || 0) == 1,
                    });
                    if(this.show) {
                        if (app.globalData.data.is_use_native_tabbar == 1) {
                            uni.hideTabBar();
                        }
                        let self = this;
                        self.timer = setInterval(() => {
                            self.skip_time--;
                            if(self.skip_time <= 0) {
                                self.skip_event();
                            }
                        }, 1000);
                    }
                }
            },

            // 样式转换处理
            obj_to_style(obj) {
                let style = '';
                for (let key in obj) {
                    style += `${key}:${obj[key]};`;
                }
                return style;
            },

            // 结束事件
            skip_event() {
                // 清除定时任务并关闭显示
                clearTimeout(this.timer);
                this.setData({
                    show: false,
                });
                // 是否显示系统菜单
                if (app.globalData.data.is_use_native_tabbar == 1) {
                    uni.showTabBar();
                }
            },

            // 切换改变事件
            swiper_change_event(e) {
                // 手动滑操作最后一个，自动结束
                if(e.detail.source == 'touch' && this.current == this.data.length-1 && e.detail.current == 0) {
                    this.skip_event();
                } else {
                    this.setData({
                        current: e.detail.current,
                    });
                }
            },

            // 切换点击事件
            swiper_tap_event(e) {
                app.globalData.operation_event(e);
            }
        }
    }
</script>
<style scoped>
    .start {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
    }

    .skip {
        position: absolute;
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        right: 30rpx;
        font-size: 28rpx;
        width: 140rpx;
        height: 52rpx;
        line-height: 52rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .swiper {
        height: 100vh;
        width: 100%;
    }

    .swiper-item {
        height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background-color: transparent;
    }

    .swiper-item .image {
        height: 100vh;
        width: 100%;
        display: block;
        position: relative;
        z-index: 2;
    }

    .swiper-dot {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 100rpx;
        z-index: 3;
        display: flex;
        justify-content: center;
    }

    .swiper-dot .view {
        width: 16rpx;
        height: 16rpx;
        border-radius: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        margin: 0 12rpx;
    }

    .swiper-dot .view.active {
        width: 30rpx;
        border-radius: 24rpx;
    }
</style>
