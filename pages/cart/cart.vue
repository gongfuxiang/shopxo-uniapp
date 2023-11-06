<template>
    <view :class="theme_view">
        <!-- 购物车 -->
        <component-cart ref="cart"></component-cart>
    </view>
</template>
<script>
const app = getApp();
import componentCart from "../../components/cart/cart";
export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view(),
        };
    },
    components: {
        componentCart,
    },

    onShow() {
        // 数据加载
        if ((this.$refs.cart || null) != null) {
            this.$refs.cart.init("cart");
        }
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.$refs.cart.init("cart");
    },

    methods: {},
};
</script>
<style></style>
