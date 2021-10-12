<template>
    <view>
        <view v-if="detail != null" class="padding-main">            
            <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                <view class="panel-content oh">
                    <view v-for="(item, index) in detail_list" :key="index" class="item br-b oh padding-vertical-main">
                        <view class="title fl padding-right-main cr-gray">{{item.name}}</view>
                        <view class="content fl br-l padding-left-main">{{item.value}}</view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                detail: null,
                detail_list: []
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            //params['id'] = 1;
            this.setData({
                params: params
            });
            this.init();
        },

        onShow() {},

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                var self = this;
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "profit", "distribution"),
                    method: "POST",
                    data: {
                        id: this.params.id
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();

                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                detail: data.data,
                                detail_list: [
                                    { name: "订单金额", value: data.data.total_price + '元' || '' },
                                    { name: "退款金额", value: data.data.refund_price + '元' || '' },
                                    { name: "收益金额", value: data.data.profit_price + '元' || '' },
                                    { name: "当前级别", value: data.data.level_name || '' },
                                    { name: "结算状态", value: data.data.status_name || '' },
                                    { name: "订单状态", value: data.data.order_status_name || '' },
                                    { name: "订单支付状态", value: data.data.order_pay_status_name || '' },
                                    { name: "来源终端", value: data.data.order_client_type_name || '' },
                                    { name: "添加时间", value: data.data.add_time_time || '' },
                                    { name: "更新时间", value: data.data.upd_time_text || '' },
                                ],
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
</style>