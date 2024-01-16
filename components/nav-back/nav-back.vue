<template>
    <view :class="theme_view">
        <view class="pa-w" :class="(propFixed ? 'pf z-i left-0 top-0 right-0' : '') + ' ' + propClass" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 0) + 'px;background-color:rgba(255,255,255,' + opacity + ');' + propStyle">
            <!-- 返回 -->
            <!-- #ifndef MP-ALIPAY -->
            <view v-if="(propName || null) != null || propIsRightSlot || propIsShowBack" class="nav-back padding-horizontal-main round va-m flex-row align-c" :class="(opacity > 0.3 ? 'cr-black ' : 'cr-white ') + (status_bar_height > 0 ? '' : 'padding-vertical-main')">
                <view v-if="(propName || null) != null" :class="'text-size-md tc pa left-0 right-0 padding-top-xs '+propNameClass" :style="propNameOpacity ? (opacity ? 'color:rgba(51,51,51,' + opacity + ')' : '') : ''">{{ propName }}</view>
                <iconfont v-if="propIsShowBack" name="icon-arrow-left" size="40rpx" @tap="top_nav_left_back_event" propClass="pr top-xs z-i" :color="propColor"></iconfont>
                <slot v-if="propIsRightSlot" name="right"></slot>
            </view>
            <!-- #endif -->
            <!-- #ifdef MP-ALIPAY -->
            <view class="nav-back"></view>
            <!-- #endif -->

            <slot name="content"></slot>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    export default {
        name: 'back',
        props: {
            // 是否显示返回按钮
            propIsShowBack: {
                type: Boolean,
                default: true,
            },
            // 最外层class
            propClass: {
                type: String,
                default: '',
            },
            // 最外层style
            propStyle: {
                type: String,
                default: '',
            },
            // 是否需要定位
            propFixed: {
                type: Boolean,
                default: true,
            },
            // 箭头颜色
            propColor: {
                type: String,
                default: '',
            },
            // 标题名称
            propName: {
                type: String,
                default: '',
            },
            // 标题名称class
            propNameClass: {
                type: String,
                default: '',
            },
            // 标题是否需要透明
            propNameOpacity: {
                type: Boolean,
                default: false,
            },
            // 是否有左侧卡槽内容
            propIsRightSlot: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                status_bar_height: 0,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU || MP-ALIPAY || H5 || APP
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0, true)),
                // #endif
                // 顶部返回导航背景透明度
                opacity: 0,
            };
        },
        mounted() {
            // #ifndef MP-ALIPAY
            var self = this;
            uni.$on('onPageScroll', function (e) {
                var top = e.scrollTop > 47 ? 1 : e.scrollTop / 47;
                self.setData({
                    opacity: top,
                });
            });
            /* #endif */
        },
        methods: {
            top_nav_left_back_event() {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0],
                    });
                } else {
                    uni.navigateBack();
                }
            },
        },
    };
</script>

<style scoped>
    .nav-back {
        height: 30px;
        padding-bottom: 10px !important;
    }
</style>
