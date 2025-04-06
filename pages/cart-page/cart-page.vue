<template>
    <view :class="theme_view">
        <!-- 购物车 -->
        <component-cart ref="cart" :propCartNavBottomValue="footer_height_value" propSourceType="page"></component-cart>

        <!-- 快捷导航 -->
        <component-quick-nav :propIsBar="true"></component-quick-nav>

        <!-- 公共 -->
        <component-common ref="common" @onFooterHeight="footer_height_value_event" :propIsFooterSeat="false"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentQuickNav from '@/components/quick-nav/quick-nav';
    import componentCart from '@/components/cart/cart';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                footer_height_value: 0
            };
        },
        components: {
            componentCommon,
            componentQuickNav,
            componentCart,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            // 底部菜单高度
            footer_height_value_event(value) {
                this.setData({
                    footer_height_value: value
                });
            }
        },
    };
</script>
<style></style>
