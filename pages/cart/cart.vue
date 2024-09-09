<template>
    <view :class="theme_view">
        <!-- 购物车 -->
        <component-cart ref="cart"></component-cart>

        <!-- 用户基础 -->
        <component-user-base ref="user_base"></component-user-base>

        <!-- app管理 -->
        <component-app-admin ref="app_admin"></component-app-admin>
    </view>
</template>
<script>
const app = getApp();
import componentCart from "@/components/cart/cart";
import componentUserBase from '@/components/user-base/user-base';
import componentAppAdmin from '@/components/app-admin/app-admin';
export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view()
        };
    },
    components: {
        componentCart,
        componentUserBase,
        componentAppAdmin
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

        // app管理
        if ((this.$refs.app_admin || null) != null) {
            this.$refs.app_admin.init();
        }

        // 用户头像和昵称设置提示
        if ((this.$refs.user_base || null) != null) {
            this.$refs.user_base.init('cart');
        }
    },

    methods: {},
};
</script>
<style>
</style>