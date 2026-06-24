<template>
    <view :class="theme_view">
        <view class="padding-main">
            <form @submit="form_submit" class="form-container">
                <view class="border-radius-main bg-white padding-main padding-bottom-xxxxl spacing-mb">
                    <view class="title fw-b text-size margin-vertical-xxxl">{{$t('common.verification_text')}}</view>
                    <view class="flex-row align-c padding-bottom-xl">
                        <!-- #ifndef H5 -->
                        <view class="margin-right" @tap="scan_event">
                            <uni-icons type="scan" size="56rpx" color="#666"></uni-icons>
                        </view>
                        <!-- #endif -->
                        <input type="text" class="wh-auto check-value" :placeholder="$t('common.verification_message')" placeholder-class="cr-grey-c" :value="check_value" @input="check_event" />
                    </view>
                </view>
                <view class="padding-main">
                    <button type="default" form-type="submit" hover-class="none" class="br-main bg-main cr-white round text-size-lg" :disabled="form_submit_loading">{{$t('common.confirm')}}</button>
                </view>
                <view class="padding-lg margin-top-xl text-size-lg tc">
                    <text v-if="(error_msg || null) != null" class="cr-red">{{error_msg}}</text>
                    <text v-if="(success_msg || null) != null" class="cr-green">{{success_msg}}</text>
                </view>
                <!-- 核验成功订单信息 -->
                <view v-if="(success_order_data || null) != null" class="margin-top-xl border-radius-main bg-white padding-main spacing-mb">
                    <view class="fw-b text-size margin-bottom-main">{{$t('user-order-detail.user-order-detail.0f26j2')}}</view>
                    <view class="cr-base text-size-sm">
                        <view class="padding-vertical-xs">{{$t('common.order_id_label')}}{{success_order_data.id}}</view>
                        <view class="padding-vertical-xs">{{$t('user-order-detail.user-order-detail.n18sd2')}}：{{success_order_data.order_no}}</view>
                        <view class="padding-vertical-xs">{{$t('order-detail.order-detail.9153qn')}}：{{success_order_data.add_time}}</view>
                        <view class="padding-vertical-xs">{{$t('user-order-detail.user-order-detail.2y7l13')}}：{{currency_symbol}}{{success_order_data.total_price}}</view>
                        <view class="padding-vertical-xs">{{$t('user-order-detail.user-order-detail.516tlr')}}：<text class="cr-price fw-b">{{currency_symbol}}{{success_order_data.pay_price}}</text></view>
                    </view>
                    <view v-if="(success_order_data.items || null) != null && success_order_data.items.length > 0" class="margin-top-main">
                        <view class="fw-b text-size margin-bottom-main">{{$t('user-order-detail.user-order-detail.yghjkf')}}</view>
                        <view v-for="(item, index) in success_order_data.items" :key="index" class="oh margin-top flex-row gap-10">
                            <image :src="item.images" mode="aspectFill" class="br-f5 radius goods-cover"></image>
                            <view class="goods-base flex-1 flex-width">
                                <view class="multi-text">{{item.title}}</view>
                                <view class="margin-top-xs cr-grey text-size-sm">
                                    <text>{{currency_symbol}}{{item.price}} x{{item.buy_number}}</text>
                                    <text class="fr cr-price">{{currency_symbol}}{{item.total_price}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </form>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                currency_symbol: app.globalData.currency_symbol(),
                form_submit_loading: false,
                check_value: '',
                error_msg: '',
                success_msg: '',
                success_order_data: null
            };
        },
        components: {
            componentCommon
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

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            // 获取数据
            init() {
                app.globalData.get_user_info(this, "init");
            },

            // 输入事件
            check_event(e) {
                this.setData({
                    check_value: e.detail.value
                });
            },

            // 扫码事件
            scan_event(e) {
                var self = this;
                uni.scanCode({
                	success: function (res) {
                        if((res.result || null) != null) {
                            self.setData({
                                check_value: res.result
                            });
                            self.form_submit();
                        }
                	}
                });
            },

            // 表单提交
            form_submit() {
                this.setData({
                    error_msg: '',
                    success_msg: '',
                    success_order_data: null
                });
                var form_data = {
                    extraction_code: this.check_value
                }
                var validation = [
                    { fields: 'extraction_code', msg: this.$t('common.verification_message') }
                ];
                if (app.globalData.fields_check(form_data, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    var temp_code = this.check_value;
                    uni.request({
                        url: app.globalData.get_request_url('verification', 'adminorder', 'shop'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    form_submit_loading: false,
                                    check_value: '',
                                    error_msg: '',
                                    success_msg: res.data.msg+'（'+temp_code+'）',
                                    success_order_data: res.data.data || null,
                                });
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'form_submit')) {
                                    this.setData({
                                        form_submit_loading: false,
                                        error_msg: res.data.msg+'（'+temp_code+'）',
                                        success_msg: '',
                                        success_order_data: null,
                                    });
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                                error_msg: this.$t('common.internet_error_tips')+'（'+temp_code+'）',
                                success_msg: '',
                                success_order_data: null,
                            });
                        },
                    });
                }
            }
        }
    };
</script>
<style scoped>
    input.check-value {
        height: 100rpx;
        line-height: 100rpx;
        font-size: 44rpx;
    }
    .goods-cover {
        width: 140rpx;
        height: 140rpx;
        flex-shrink: 0;
    }
</style>