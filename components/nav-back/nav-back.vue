<template>
    <view :class="theme_view">
        <view class="pa-w" :class="(propFixed ? 'pf z-i left-0 top-0 right-0' : '') + ' ' + propClass" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 0) + 'px;background-color:rgba(255,255,255,' + opacity + ');' + propStyle">
            <view v-if="(propName || null) != null || propIsRightSlot || is_show_back" class="nav-back padding-horizontal-main round va-m flex-row align-c" :class="(opacity > 0.3 ? 'cr-black ' : 'cr-white ') + (status_bar_height > 0 ? '' : 'padding-vertical-main')">
                <view v-if="(propName || null) != null" :class="'text-size-md tc pa left-0 right-0 padding-top-xs ' + propNameClass" :style="propNameOpacity ? (opacity ? 'color:rgba(51,51,51,' + opacity + ')' : '') : ''">{{ propName }}</view>
                <view v-if="is_show_back" @tap="top_nav_left_back_event" class="dis-inline-block">
                    <iconfont name="icon-arrow-left" size="40rpx" propClass="pr top-xs z-i" :color="(client_value == 'alipay' || client_value == 'baidu') ? 'transparent' : propColor"></iconfont>
                </view>
                <slot v-if="propIsRightSlot" name="right"></slot>
            </view>
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
                client_value: app.globalData.application_client_type(),
                status_bar_height: 0,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU || MP-ALIPAY || H5 || APP
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0, true)),
                // #endif
                // 顶部返回导航背景透明度
                opacity: 0,
            };
        },
        // 页面被展示
        created: function () {
            this.setData({
                is_show_back: this.propIsShowBack && !app.globalData.is_tabbar_pages()
            });
        },
        mounted() {
            var self = this;
            uni.$on('onPageScroll', function (e) {
                var top = e.scrollTop > 47 ? 1 : e.scrollTop / 47;
                self.setData({
                    opacity: top,
                });
            });
        },
        methods: {
            top_nav_left_back_event() {
                app.globalData.page_back_prev_event();
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
