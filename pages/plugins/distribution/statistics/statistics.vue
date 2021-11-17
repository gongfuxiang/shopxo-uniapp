<template>
    <view>
        <view class="padding-main">
            <!-- 推广客户 -->
            <view class="container padding-main border-radius-main bg-white">
                <view class="title border-color-main padding-left-lg text-size fw-b">推广客户</view>
                <view class="margin-top-lg oh tc">
                    <block v-for="(item, index) in stats_user_data_list" :key="index">
                        <view class="item fl padding-main">
                            <view class="cr-base">{{item.name}}</view>
                            <view class="single-text margin-top-sm">
                                <text class="text-size">{{item.value}}</text>
                                <text class="cr-gray margin-left-sm">人</text>
                            </view>
                        </view>
                    </block>
                </view>
            </view>

            <!-- 返利概况 -->
            <view class="container padding-main border-radius-main bg-white spacing-mt">
                <view class="title border-color-main padding-left-lg text-size fw-b">返利概况</view>
                <view class="margin-top-lg oh tc">
                    <block v-for="(item, index) in stats_profit_data_list" :key="index">
                        <view class="item fl padding-main">
                            <view class="cr-base">{{item.name}}</view>
                            <view class="single-text margin-top-sm">
                                <text :class="'fw-b text-size '+item.ent">{{currency_symbol}}{{item.value}}</text>
                            </view>
                        </view>
                    </block>
                </view>
            </view>
        </view>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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
                data_bottom_line_status: true,
                stats_user_data_list: [
                    {name: "已推广用户总数", value: 0},
                    {name: "已消费用户总数", value: 0}
                ],
                stats_profit_data_list: [
                    {name: "返佣总额", value: '0.00', ent: "cr-base"},
                    {name: "待生效", value: '0.00', ent: "cr-yellow"},
                    {name: "待结算", value: '0.00', ent: "cr-blue"},
                    {name: "已结算", value: '0.00', ent: "cr-green"}
                ],
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
                            
                            // 用户统计
                            var temp_stats_user = this.stats_user_data_list;
                            temp_stats_user[0]['value'] = data.user_total.user_count || 0;
                            temp_stats_user[1]['value'] = data.user_total.valid_user_count || 0;
                            
                            // 收益统计
                            var temp_stats_profit = this.stats_profit_data_list;
                            temp_stats_profit[0]['value'] = data.user_profit_total_price || '0.00';
                            temp_stats_profit[1]['value'] = data.user_profit_stay_price || '0.00';
                            temp_stats_profit[2]['value'] = data.user_profit_vaild_price || '0.00';
                            temp_stats_profit[3]['value'] = data.user_profit_already_price || '0.00';
                            
                            // 数据设置
                            this.setData({
                                stats_user_data_list: temp_stats_user,
                                stats_profit_data_list: temp_stats_profit,
                                user_data: data.user_chart || null,
                                profit_data: data.profit_chart || null,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: ''
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
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