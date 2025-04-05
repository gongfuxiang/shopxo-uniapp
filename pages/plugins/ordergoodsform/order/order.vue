<template>
    <view :class="theme_view">
        <block v-if="data != null && data.length > 0">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 商品列表 -->
                <view class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view v-for="(item, index) in data" :key="index" :class="'goods-item oh padding-main '+(index > 0 ? 'br-t-dashed' : '')">
                        <!-- 订单主体内容 -->
                        <view :data-value="item.goods_url" @tap="url_event" class="cp">
                            <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{ item.title }}</view>
                                <view v-if="item.spec != null" class="margin-top-xs cr-grey">{{ item.spec_text }}</view>
                                <view class="margin-top-xs">
                                    <text class="fw-b">{{ item.currency_data.currency_symbol }}{{ item.price }}</text>
                                    <text class="margin-left-sm">x{{ item.buy_number }}</text>
                                </view>
                            </view>
                        </view>
                        <!-- 订单商品表单 -->
                        <view v-if="(item.form_data || null) != null && item.form_data.length > 0" class="goods-item-ordergoodsform">
                            <component-buy-ordergoodsform ref="buy_ordergoodsform" :propData="item.form_data" :propIsRead="true"></component-buy-ordergoodsform>
                        </view>
                        <view v-else class="text-size-xs cr-grey">{{$t('order.order.93j3zq')}}</view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentBuyOrdergoodsform from '@/pages/plugins/ordergoodsform/components/buy-ordergoodsform/buy-ordergoodsform';

    var common_static_url = app.globalData.get_static_url("common");
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                data: [],
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentBuyOrdergoodsform
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 获取数据
            init() {
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url("order", "goods", "ordergoodsform"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || [];
                            this.setData({
                                data: data,
                                data_list_loding_status: data.length == 0 ? 0 : 3,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "init")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import "./order.css";
</style>