<template>
    <view :class="theme_view">
        <!-- 购物车 -->
        <component-cart ref="cart" propSourceType="page"></component-cart>

        <!-- 快捷导航 -->
        <component-quick-nav :propIsBar="true"></component-quick-nav>
    </view>
</template>
<script>
    const app = getApp();
    import componentQuickNav from '../../components/quick-nav/quick-nav';
    import componentCart from '../../components/cart/cart';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
            };
        },
        components: {
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
        },

        methods: {},
    };
</script>
<style></style>
