<template>
    <view :class="theme_view">
        <view v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view class="content fl br-l padding-left-main">{{ item.value }}</view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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
            theme_view: app.globalData.get_theme_value_view(),
            params: null,
            data_list_loding_status: 1,
            data_list_loding_msg: "",
            data_bottom_line_status: false,
            detail: null,
            detail_list: [],
        };
    },

    components: {
        componentNoData,
        componentBottomLine,
    },
    props: {},

    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);

        // 设置参数
        this.setData({
            params: params,
        });
        this.init();
    },

    onShow() {
        // 调用公共事件方法
        app.globalData.page_event_onshow_handle();

        // 分享菜单处理
        app.globalData.page_share_handle();
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.init();
    },

    methods: {
        init() {
            uni.showLoading({
                title: "加载中...",
            });
            this.setData({
                data_list_loding_status: 1,
            });
            uni.request({
                url: app.globalData.get_request_url("detail", "profit", "excellentbuyreturntocash"),
                method: "POST",
                data: {
                    id: this.params.id,
                },
                dataType: "json",
                success: (res) => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        var data = res.data.data;
                        this.setData({
                            detail: data.data,
                            detail_list: [
                                { name: "订单号", value: data.data.order_no },
                                { name: "订单金额", value: data.data.total_price || "" },
                                { name: "退款金额", value: data.data.refund_price || "" },
                                { name: "有效金额", value: data.data.valid_price || "" },
                                { name: "返现金额", value: data.data.profit_price || "" },
                                { name: "结算状态", value: data.data.status_name || "" },
                                { name: "订单状态", value: data.data.order_status_name || "" },
                                { name: "订单支付状态", value: data.data.order_pay_status_name || "" },
                                { name: "来源终端", value: data.data.order_client_type_name || "" },
                                { name: "结算时间", value: (data.data.status == 2 && (data.data.success_estimate_icon || null) != null ? "(" + data.data.success_estimate_icon + ") " : "") + data.data.success_time || "" },
                                { name: "添加时间", value: data.data.add_time || "" },
                                { name: "更新时间", value: data.data.upd_time || "" },
                            ],
                            data_list_loding_status: 3,
                            data_bottom_line_status: true,
                            data_list_loding_msg: "",
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
                        data_list_loding_msg: "网络开小差了哦~",
                    });
                    app.globalData.showToast("网络开小差了哦~");
                },
            });
        },
    },
};
</script>
<style></style>
