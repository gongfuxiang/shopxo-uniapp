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

        // 加载购物车页面
        this.loading_cart();
    },

    methods: {
        // 加载购物车
        loading_cart() {
            if ((this.$refs.cart || null) != null) {
                this.$refs.cart.init('cart');
            }
        }
    },
};
</script>
<style>
</style>