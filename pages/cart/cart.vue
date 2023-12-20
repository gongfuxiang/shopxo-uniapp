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

    onShow() {
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