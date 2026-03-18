<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view v-if="buy_goods.length > 0" class="page-bottom-fixed">
                <view class="padding-horizontal-main padding-top-main bottom-line-exclude">
                    <!-- 商品数据 -->
                    <view class="padding-main border-radius-main bg-white spacing-mb">
                        <!-- 商品 -->
                        <view v-for="(item, index) in buy_goods" :key="index" class="goods-item oh">
                            <view class="goods-item-content">
                                <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                                <view class="goods-base">
                                    <view class="goods-title multi-text">{{ item.title }}</view>
                                    <view v-if="item.spec != null" class="margin-top-xs cr-grey">
                                        <block v-for="(spec, si) in item.spec" :key="si">
                                            <text v-if="si > 0">;</text>
                                            <text>{{ spec.value }}</text>
                                        </block>
                                    </view>
                                    <view class="oh pr margin-top-xs">
                                        <block v-if="item.show_field_price_status == 1">
                                            <text class="fw-b va-m">{{ item.show_price_symbol }}{{ item.price }}</text>
                                            <text class="cr-grey text-size-xs va-m">{{ item.show_price_unit }}</text>
                                        </block>
                                        <block v-if="item.show_field_original_price_status == 1">
                                            <text v-if="item.original_price > 0" class="original-price margin-left-sm">{{ item.show_original_price_symbol }}{{ item.original_price }}{{ item.show_original_price_unit }}</text>
                                        </block>
                                        <text class="buy-number pa cr-grey">x{{ item.stock }}</text>
                                    </view>
                                    <view v-if="(item.plugins_presale_data || null) != null && (presale_config || null) != null" class="margin-top-xs">
                                        <text>{{presale_config.goods_detail_icon}}{{ item.show_price_symbol }}{{item.plugins_presale_data.deposit_price}}</text>
                                        <text class="margin-left-sm cr-main br-main radius padding-horizontal-sm text-size-xs">{{presale_config.goods_detail_deduct_text}}{{ item.show_price_symbol }}{{item.plugins_presale_data.deduct_price}}</text>
                                    </view>
                                </view>
                            </view>
                            <!-- 小计 -->
                            <view class="oh tr wh-auto goods-group-footer padding-top-xl">
                                <text class="sales-price">{{ item.show_price_symbol }}{{ item.total_deposit_price }}</text>
                                <text v-if="(item.total_deduct_price || 0) > 0 && (presale_config || null) != null" class="margin-left-sm cr-main br-main radius padding-horizontal-sm text-size-xs">{{presale_config.goods_detail_deduct_text}}{{ item.show_price_symbol }}{{item.total_deduct_price}}</text>
                            </view>
                        </view>
                    </view>

                    <!-- 支付选择 -->
                    <view v-if="payment_list.length > 0" class="payment-list border-radius-main bg-white oh padding-main spacing-mb">
                        <view v-for="(item, index) in payment_list" :key="index">
                            <view class="item flex-row jc-sb align-c" :data-value="item.id" :data-index="index" @tap="payment_event">
                                <view class="item-content pr flex-1 flex-width">
                                    <image v-if="(item.logo || null) != null" class="icon margin-right-sm va-m radius" :src="item.logo" mode="widthFix"></image>
                                    <text class="va-m">{{ item.name }}</text>
                                    <text v-if="(item.tips || null) !== null" class="pay-tips">{{ item.tips }}</text>
                                </view>
                                <view>
                                    <iconfont :name="payment_id == item.id ? 'icon-selected-solid cr-main' : 'icon-not-selected'" size="40rpx"></iconfont>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 导航 -->
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view class="item oh round flex-row jc-sb align-c br-top-shadow bg-white padding-vertical-sm">
                            <view class="nav-base single-text padding-left-main fl">
                                <text>{{ $t('buy.buy.wx78ju') }}</text>
                                <text class="sales-price">{{ currency_symbol }}{{ buy_base.total_deposit_price }}</text>
                            </view>
                            <view class="nav-submit padding-horizontal-main fr">
                                <button class="btn bg-main cr-white round text-size-md" type="default" @tap="buy_submit_event" :disabled="buy_submit_disabled_status" hover-class="none">{{ $t('buy.buy.4884hk') }}</button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 支付组件 -->
            <component-payment ref="payment" :propIsRedirectTo="true" :propPayUrl="pay_url" :propQrcodeUrl="qrcode_url" :propToAppointPage="to_appoint_page" propPayDataKey="ids" :propPaymentList="payment_list" :propToPageBack="to_page_back" :propToFailPage="to_fail_page"></component-payment>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                buy_submit_disabled_status: false,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                params: null,
                payment_list: [],
                payment_index: -1,
                payment_id: 0,
                buy_goods: [],
                buy_base: {},
                presale_config: {},
                is_first: 1,
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
                // 订单是否已进入支付
                is_order_submit_payment: 0,
                // 支付弹窗参数
                pay_url: '',
                qrcode_url: '',
                // 前往支付页面携带的参数
                to_page_back: {
                    title: this.$t('buy.buy.718tux'),
                    page: '/pages/plugins/presale/order/order',
                },
                // 支付失败跳转的页面
                to_fail_page: '/pages/plugins/presale/order/order',
                // 现金--跳转指定页面
                to_appoint_page: '/pages/plugins/presale/order/order',
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentPayment
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 下单参数处理
            // params.data 参数 urlencode(base64_encode(json字符串))
            // buy_type 下单类型（goods 立即购买、cart 购物车）
            // goods_data 下单商品urlencode(base64_encode(json字符串[{goods_id,stock,spec}]))
            // params['data'] = '{"buy_type":"goods","goods_data":"W3siZ29vZHNfaWQiOiI5Iiwic3RvY2siOjEsInNwZWMiOlt7InR5cGUiOiLpopzoibIiLCJ2YWx1ZSI6IueyieiJsiJ9LHsidHlwZSI6IuWwuueggSIsInZhbHVlIjoiTCJ9XX1"}';
            // ids 购物车主键ids
            if ((params.data || null) != null) {
                params = JSON.parse(base64.decode(decodeURIComponent(params.data)));
            }

            // 设置参数
            this.setData({
                params: params,
                pay_url: app.globalData.get_request_url('pay', 'buy', 'presale'),
                qrcode_url: app.globalData.get_request_url('paycheck', 'buy', 'presale'),
            });
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
            this.init();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                // 订单是否已经提交进入支付
                if(this.is_order_submit_payment == 1) {
                    uni.stopPullDownRefresh();
                    return false;
                }
                // 订单参数信息是否正确
                if (this.params == null) {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('buy.buy.p7e91u'),
                    });
                    uni.stopPullDownRefresh();
                    return false;
                }

                // 加载loding
                if(this.is_first == 0) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                } else {
                    this.setData({
                        data_list_loding_status: 1,
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'buy', 'presale'),
                    method: 'POST',
                    data: this.request_data_ext_params_merge(this.params),
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if(this.is_first == 0) {
                            uni.hideLoading();
                        }
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            // 基础数据
                            this.setData({
                                buy_goods: data.buy_goods,
                                buy_base: data.buy_base,
                                presale_config: data.presale_config,
                                data_list_loding_status: 3,
                                payment_list: data.payment_list || [],
                            });

                            // 首次
                            if(this.is_first == 1) {
                                // 赋值默认支付方式
                                var default_payment_id = parseInt(data.default_payment_id || 0);
                                if(this.payment_list.length > 0 && default_payment_id > 0) {
                                    var temp_payment_ids = this.payment_list.map(function(item){return item.id;});
                                    if(temp_payment_ids.indexOf(default_payment_id) != -1) {
                                        this.setData({
                                            payment_id: default_payment_id
                                        });
                                    }
                                }
                            }

                            // 非首次状态
                            this.setData({
                                is_first: 0,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        if(this.is_first == 0) {
                            uni.hideLoading();
                        }
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 请求参数合并
            request_data_ext_params_merge(data) {
                data['payment_id'] = this.payment_id;
                return data;
            },

            // 提交订单
            buy_submit_event(e) {
                // 请求参数处理
                var data = this.request_data_ext_params_merge(this.params);
                // 数据验证
                var validation = [
                    {
                        fields: 'payment_id',
                        msg: this.$t('buy.buy.71kidy'),
                    }
                ];
                if (!app.globalData.fields_check(data, validation)) {
                    return false;
                }

                // 加载loding
                uni.showLoading({
                    title: this.$t('common.submit_in_text'),
                });
                this.setData({
                    buy_submit_disabled_status: true,
                });
                uni.request({
                    url: app.globalData.get_request_url('add', 'buy', 'presale'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.$refs.payment.pay_handle_event(res.data.data.ids.join(','), this.payment_id);
                            this.setData({
                                is_order_submit_payment: 1
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                        this.setData({
                            buy_submit_disabled_status: false,
                        });
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            buy_submit_disabled_status: false,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 支付方式选择
            payment_event(e) {
                var value = e.currentTarget.dataset.value;
                this.setData({
                    payment_id: (this.payment_id == value) ? 0 : value
                });
                this.init();
            }
        }
    };
</script>
<style>
    @import './buy.css';
</style>