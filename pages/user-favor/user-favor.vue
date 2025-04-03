<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="padding-main border-radius-main oh bg-white pr spacing-mb">
                    <view :data-value="item.goods_url" @tap="url_event" class="cp">
                        <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                        <view class="goods-base">
                            <view class="goods-title multi-text padding-right-xxxxl">{{item.title}}</view>
                            <view class="oh margin-top-sm">
                                <block v-if="(item.show_field_price_status || 0) == 1">
                                    <text class="sales-price">{{item.show_price_symbol}}{{item.price}}</text>
                                    <text class="cr-grey text-size-xs">{{item.show_price_unit}}</text>
                                </block>
                                <text v-if="(item.show_field_original_price_status || 0) == 1 && item.original_price > 0" class="original-price margin-left">{{item.show_price_symbol}}{{item.original_price}}{{item.show_original_price_unit}}</text>
                            </view>
                        </view>
                    </view>
                    <view class="dis-inline-block pa top-xxxxl right-xxxxl" @tap="cancel_event" :data-value="item.goods_id" :data-index="index">
                        <iconfont name="icon-ellipsis" size="40rpx" color="#999"></iconfont>
                    </view>
                    <view v-if="(item.is_error || 0) == 0" class="dis-inline-block pa right-xxxxl bottom-xxxxl" :data-index="index" @tap.stop="goods_cart_event">
                        <iconfont name="icon-cart-inc" size="48rpx" :color="theme_color"></iconfont>
                        <view class="pa top-0-xxxl right-xs">
                            <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 商品购买 -->
            <component-goods-buy ref="goods_buy" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>
        </scroll-view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentBadge from '@/components/badge/badge';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                // 基础配置
                currency_symbol: app.globalData.currency_symbol()
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentBadge,
            componentGoodsBuy
        },
        
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
            
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.get_data_list();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false
                    });
                }
            },

            // 获取数据
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                
                // 是否加载中
                if(this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1
                });
                
                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "usergoodsfavor"),
                    method: 'POST',
                    data: {
                        page: this.data_page
                    },
                    dataType: 'json',
                    success: res => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;

                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0
                                });
                                
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 取消
            cancel_event(e) {
                var self = this;
                wx.showActionSheet({
                    itemList: [self.$t('cart.cart.87rfg3')],
                    success (res) {
                        // 参数
                        var id = e.currentTarget.dataset.value;
                        var index = e.currentTarget.dataset.index;
                        // 加载loding
                        uni.showLoading({
                            title: self.$t('common.processing_in_text')
                        });
                        uni.request({
                            url: app.globalData.get_request_url("cancel", "usergoodsfavor"),
                            method: 'POST',
                            data: {
                                id: id
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    var temp_data_list = self.data_list;
                                    temp_data_list.splice(index, 1);
                                    self.setData({
                                        data_list: temp_data_list
                                    });
                                    if (temp_data_list.length == 0) {
                                        self.setData({
                                            data_list_loding_status: 0,
                                            data_bottom_line_status: false
                                        });
                                    }
                                    app.globalData.showToast(res.data.msg, 'success');
                                } else {
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast(self.$t('common.internet_error_tips'));
                            }
                        });
                    }
                });
            },
            
            // 加入购物车
            goods_cart_event(e) {
                if ((this.$refs.goods_buy || null) != null) {
                    var index = e.currentTarget.dataset.index || 0;
                    var goods = this.data_list[index];
                        goods['id'] = goods.goods_id;
                    this.$refs.goods_buy.init(
                        goods,
                        {
                            buy_event_type: 'cart',
                            is_direct_cart: 1,
                        },
                        {
                            index: index,
                            pos: e,
                        }
                    );
                }
            },

            // 加入购物车成功回调
            goods_cart_back_event(e) {
                // 增加数量
                var back = e.back_data;
                var temp_data_list = this.data_list;
                var goods = temp_data_list[back.index];
                goods['user_cart_count'] = parseInt(goods['user_cart_count'] || 0) + parseInt(e.stock);
                if (goods['user_cart_count'] > 99) {
                    goods['user_cart_count'] = '99+';
                }
                temp_data_list[back.index] = goods;
                this.setData({
                    data_list: temp_data_list,
                });
                // 购物车导航角标
                app.globalData.set_tab_bar_badge('cart', e.cart_number || 0);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './user-favor.css';
</style>