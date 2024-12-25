<template>
    <view :class="theme_view">
        <view v-if="cart_icon_data != null && (cart_icon_data.status || 0) == 1" class="cart-para-curve-container pf round" :style="cart_icon_data.style">
            <image v-if="(cart_icon_data.icon || null) != null" class="cart-para-curve-icon round br" :src="cart_icon_data.icon"></image>
            <view v-else class="cart-para-curve-icon bg-red padding dis-inline-block round br"></view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                cart_icon_data: null
            };
        },
        components: {},
        props: {
            propBtnHeight: {
            	type: Number,
            	default: 30
            },
            propBtnWidth: {
            	type: Number,
            	default: 30
            },
            propCart: {
            	type: String,
            	default: ''
            },
        },
        methods: {
            // 初始（购物车对象、当前点击对象、图标、支持tabbar位置）
            init(cart, pos, icon = '', tabbar_pos = null) {
                if((pos || null) != null) {
                    var self = this;
                    var btn_size = this.propBtnHeight;
                    var btn_width = this.propBtnWidth;
                    // 未指定购物车对象则读取tabbar数据自动计算购物车位置
                    if((cart || null) == null || (cart[0] || null) == null) {
                        var info = uni.getSystemInfoSync();
                        // 当前页面
                        var page = app.globalData.current_page().split('?');
                        switch(page[0]) {                        
                            // 商品搜索
                            case 'pages/goods-search/goods-search' :
                                var cart_top = 20;
                                var cart_width = 35;
                                var cart_left = info.screenWidth-20;
                                break;

                            // 默认购物车
                            default :
                                // 无购物车菜单则结束执行
                                var tabbar = app.globalData.app_tabbar_pages();
                                if(tabbar_pos === null) {
                                    tabbar_pos = tabbar.indexOf('/pages/cart/cart');
                                    if(tabbar_pos == -1) {
                                        return false;
                                    }
                                }
                                // 计算购物车菜单位置
                                var tabbar_count = tabbar.length;
                                var cart_top = info.screenHeight;
                                var cart_width = info.screenWidth/tabbar_count;
                                var cart_left = cart_width*tabbar_pos;
                        }
                    } else {
                        var temp = cart[0];
                        var cart_width = temp.width;
                        var cart_left = temp.left;
                        var cart_top = temp.top;
                    }
                    /* #ifndef MP-ALIPAY */
                    var left = pos.changedTouches[0].clientX + btn_width/2 - btn_size/2;
                    var top = pos.changedTouches[0].clientY - btn_size;
                    /* #endif */
                    /* #ifdef MP-ALIPAY */
                    var left = pos.detail.clientX + btn_width/2 - btn_size/2;
                    var top = pos.detail.clientY - btn_size;
                    /* #endif */
                    var x = cart_left + cart_width/2 - btn_size/2 - left;
                    var y = cart_top - btn_size - top;
                     if(self.cart_icon_data == null || (self.cart_icon_data.status || 0) == 0) {
                        self.setData({cart_icon_data: {
                            status: 1,
                            style: `--left:${left}px;--top:${top}px;--x:${x}px;--y:${y}px;`,
                            icon: icon,
                        }});
                        setTimeout(function(){
                            self.setData({ cart_icon_data: {status: 0}});
                        }, 495);
                    }
                }
            }
        }
    };
</script>
<style>
    @keyframes moveY {
        to {
            transform: translateY(var(--y));
        }
    }
    @keyframes moveX {
        to {
            transform: translateX(var(--x));
        }
    }
    .cart-para-curve-container {
        width: 60rpx;
        height: 60rpx;
        z-index: 10;
        left: var(--left);
        top: var(--top);
        --duration: 0.5s;
        animation: moveY var(--duration) cubic-bezier(0.5, -0.25, 1, 1);
    }
    .cart-para-curve-container .cart-para-curve-icon {
        max-width: 100%;
        max-height: 100%;
        animation: moveX var(--duration) linear;
    }
</style>