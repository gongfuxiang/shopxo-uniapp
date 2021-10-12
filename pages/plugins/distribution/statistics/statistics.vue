<template>
    <view>
        <!-- 推广客户 -->
        <view class="container user-container bg-white">
            <view class="title">推广客户</view>
            <view class="base-content oh tc">
                <view class="item fl">
                    <view class="name cr-base">已推广用户总数</view>
                    <view class="value single-text">
                        <text class="golden">{{user_total.user_count || 0}}</text>
                        <text class="cr-gray">人</text>
                    </view>
                </view>
                <view class="item fl">
                    <view class="name cr-base">已消费用户总数</view>
                    <view class="value single-text">
                        <text class="green">{{user_total.valid_user_count || 0}}</text>
                        <text class="cr-gray">人</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 返利概况 -->
        <view class="container profit-container bg-white spacing-mt">
            <view class="title">返利概况</view>
            <view class="base-content oh tc">
                <view class="item fl">
                    <view class="name cr-base">返佣总额</view>
                    <view class="value single-text">
                        <text class="golden">{{currency_symbol}}{{user_profit_total_price || '0.00'}}</text>
                    </view>
                </view>
                <view class="item fl">
                    <view class="name cr-base">待生效</view>
                    <view class="value single-text">
                        <text class="yellow">{{currency_symbol}}{{user_profit_stay_price || '0.00'}}</text>
                    </view>
                </view>
                <view class="item fl">
                    <view class="name cr-base">待结算</view>
                    <view class="value single-text">
                        <text class="blue">{{currency_symbol}}{{user_profit_vaild_price || '0.00'}}</text>
                    </view>
                </view>
                <view class="item fl">
                    <view class="name cr-base">已结算</view>
                    <view class="value single-text">
                        <text class="green">{{currency_symbol}}{{user_profit_already_price || '0.00'}}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 结尾 -->
        <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
    </view>
</template>

<script>
    const app = getApp();
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '加载中...',
                data_bottom_line_status: false,
                user_total: null,
                user_profit_stay_price: 0.00,
                user_profit_vaild_price: 0.00,
                user_profit_already_price: 0.00,
                user_profit_total_price: 0.00,
                user_data: null,
                profit_data: null,
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol
            };
        },

        components: {
            componentBottomLine
        },
        props: {},

        onShow() {
            // 数据加载
            this.init();
            
            // 初始化配置
            this.init_config();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
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
                var self = this;
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "statistics", "distribution"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                user_total: data.user_total || null,
                                user_profit_stay_price: data.user_profit_stay_price || 0.00,
                                user_profit_vaild_price: data.user_profit_vaild_price || 0.00,
                                user_profit_already_price: data.user_profit_already_price || 0.00,
                                user_profit_total_price: data.user_profit_total_price || 0.00,
                                user_data: data.user_chart || null,
                                profit_data: data.profit_chart || null,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: ''
                            });
                        } else {
                            self.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, self, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './statistics.css';
</style>