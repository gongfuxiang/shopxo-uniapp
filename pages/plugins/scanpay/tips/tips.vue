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
                        <view class="cr-base">{{$t('user-order-detail.user-order-detail.yxwu8n')}}</view>
                        <view class="flex-1 flex-width tr" :class="data.order_info.status == 1 ? 'cr-green' : 'cr-red'">{{ data.order_info.status == 1 ? $t('paytips.paytips.679rxu') : $t('paytips.paytips.6y488i')+pay_fail_msg }}</view>
                    </view>
                    <view class="flex-row jc-sb align-c spacing-mb">
                        <view class="cr-base">{{$t('user-order-detail.user-order-detail.n18sd2')}}</view>
                        <view class="flex-1 flex-width tr">{{ data.order_info.order_no }}</view>
                    </view>
                    <view class="flex-row jc-sb align-c spacing-mb">
                        <view class="cr-base">{{$t('tips.tips.0azfc3')}}</view>
                        <view class="flex-1 flex-width tr fw-b cr-red">{{ currency_symbol }}{{ data.order_info.pay_price }}</view>
                    </view>
                </block>
                <block v-else>
                    <view class="padding-top-xxxl padding-bottom-main tc">
                        <view class="cr-grey-c">
                            <iconfont name="icon-payment-fail" size="120rpx"></iconfont>
                        </view>
                        <view class="margin-top-lg">{{$t('paytips.paytips.6y488i')}}{{ pay_fail_msg }}</view>
                    </view>
                </block>
            </view>
            <view v-if="(data.ad_code || null) !== null" class="padding-main">
                <view class="border-radius-main">
                    <mp-html :content="data.ad_code" />
                </view>
            </view>
            <view class="bottom-fixed" :style="bottom_fixed_style">
                <view class="bottom-line-exclude">
                    <button class="item bg-red br-red cr-white round text-size" type="default" hover-class="none" @tap="exit_event">{{$t('tips.tips.579u02')}}</button>
                </view>
            </view>
        </view>
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
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
                data: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                params: {},
                pay_fail_msg: '',
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            var params = params || {};
            this.setData({
                params: params,
                pay_fail_msg: (params.msg || null) == null ? '' : '('+params.msg+')',
            });
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

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
                    title: this.$t('common.loading_in_text'),
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
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
