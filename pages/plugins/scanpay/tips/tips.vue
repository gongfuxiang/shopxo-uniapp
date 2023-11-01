<template>
    <view>
        <view v-if="(data || null) !== null">
            <view class="bg-white padding-main">
                <view v-if="(data.scanpay_info || null) !== null" class="tc margin-bottom-lg">
                    <view class="user-title-img auto margin-top-sm">
                        <image v-if="data.scanpay_info.logo" :src="data.scanpay_info.logo" mode="widthFix" class="wh-auto" />
                    </view>
                    <view class="text-size">{{ data.scanpay_info.name }}</view>
                </view>
                <block v-if="(data.order_info || null) !== null">
                    <view class="flex-row jc-sb align-c spacing-mb">
                        <view class="cr-base">订单状态</view>
                        <view class="flex-1 flex-width tr" :class="data.order_info.status == 1 ? 'cr-green' : 'cr-red'">{{ data.order_info.status == 1 ? '支付成功' : '支付失败' }}</view>
                    </view>
                    <view class="flex-row jc-sb align-c spacing-mb">
                        <view class="cr-base">订单编号</view>
                        <view class="flex-1 flex-width tr">{{ data.order_info.order_no }}</view>
                    </view>
                    <view class="flex-row jc-sb align-c spacing-mb">
                        <view class="cr-base">支付总额</view>
                        <view class="flex-1 flex-width tr fw-b cr-red">{{ currency_symbol }}{{ data.order_info.pay_price }}</view>
                    </view>
                </block>
            </view>
            <view class="bottom-fixed br-0 bg-grey-f5">
                <view class="bottom-line-exclude">
                    <button class="bg-main br-main cr-white round text-size" type="default" hover-class="none">关闭页面</button>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';
    export default {
        data() {
            return {
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                data: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: {},
            };
        },

        components: {
            componentNoData,
        },

        onLoad(params) {
            this.setData({
                params: params || {},
            });
            this.init();
        },

        onShow() {},

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            init() {
                this.get_data();
            },
            // 获取数据
            get_data() {
                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });
                uni.request({
                    url: app.globalData.get_request_url('orderinfo', 'index', 'scanpay'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                data: res.data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },
        },
    };
</script>

<style scoped>
    @import './tips.css';
</style>
