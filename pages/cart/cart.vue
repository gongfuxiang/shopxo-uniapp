<template>
    <view :class="theme_view">
        <!-- 购物车 -->
        <component-cart ref="cart" :propCartNavBottomValue="footer_height_value"></component-cart>

        <!-- 公共 -->
        <component-common ref="common" @onFooterHeight="footer_height_value_event" :propIsFooterSeat="false"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentCart from "@/components/cart/cart";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                load_status: 0,
                footer_height_value: 0
            };
        },
        components: {
            componentCommon,
            componentCart
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化
            this.init();
        },

        methods: {
            // 初始化
            init() {
                // 调用购物车
                if(app.globalData.get_config('status') == 1) {
                    app.globalData.init_config(0, this, 'init_config', true);
                } else {
                    app.globalData.is_config(this, 'init_config');
                }

                // 公共onshow事件
                if ((this.$refs.common || null) != null) {
                    this.$refs.common.on_show();
                }
            },

            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        load_status: 1
                    });
                    // 数据加载
                    if ((this.$refs.cart || null) != null) {
                        this.$refs.cart.init();
                    }
                }
            },

            // 底部菜单高度
            footer_height_value_event(value) {
                this.setData({
                    footer_height_value: value
                });
            }
        }
    };
</script>
<style>
</style>