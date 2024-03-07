<template>
    <view :class="theme_view">
        <component-cart ref="cart"></component-cart>
    </view>
</template>
<script>
const app = getApp();
import componentCart from "../../components/cart/cart";
export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view()
        };
    },
    components: {
        componentCart
    },

    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);
    },

    onShow() {
        // 调用公共事件方法
        app.globalData.page_event_onshow_handle();

        // 数据加载
        if ((this.$refs.cart || null) != null) {
            this.$refs.cart.init();
        }
    },

    methods: {},
};
</script>
<style>
</style>