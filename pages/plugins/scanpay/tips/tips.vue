<template>
    <view :class="theme_view">
        <view v-if="(data || null) !== null" class="page-bottom-fixed">
            <view class="bg-white padding-main">
                <block v-if="(data.order_info.status || null) !== null && data.order_info.status == 1">
                    <view class="tc margin-bottom-lg">
                        <view class="user-title-img auto circle br oh">
                            <image v-if="data.scanpay_info.logo" :src="data.scanpay_info.logo" mode="widthFix" class="wh-auto" />
                        </view>
                        <view class="text-size margin-top-sm">{{ data.scanpay_info.name }}</view>
                    </view>
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
                <block v-else>
                    <view class="padding-top-xxxl padding-bottom-main tc">
                        <view class="cr-grey-c">
                            <iconfont name="icon-payment-fail" size="120rpx"></iconfont>
                        </view>
                        <view class="margin-top-lg">支付失败</view>
                    </view>
                </block>
            </view>
            <view v-if="(data.ad_code || null) !== null" class="padding-main">
                <view class="border-radius-main">
                    <mp-html :content="data.ad_code" />
                </view>
            </view>
            <view class="bottom-fixed br-0 bg-grey-f5">
                <view class="bottom-line-exclude">
                    <button class="bg-red br-red cr-white round text-size" type="default" hover-class="none" @tap="exit_event">退出页面</button>
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
                theme_view: app.globalData.get_theme_value_view(),
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
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
                        uni.stopPullDownRefresh();
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
                            data_list_loding_msg: '网络开小差了哦~',
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 关闭页面
            exit_event(e) {
                // #ifdef APP || H5
                uni.navigateBack();
                // #endif
                // #ifdef MP
                uni.exitMiniProgram();
                // #endif
            },
        },
    };
</script>

<style scoped>
    @import './tips.css';
</style>
