<template>
    <view :class="theme_view">
        <view v-if="(goods || null) != null" class="page-bottom-fixed">
            <form @submit="form_submit">
                <image :src="goods.images" mode="widthFix" class="wh-auto dis-block"></image>
                <view class="padding-main">
                    <view class="bg-white padding-main border-radius-main">
                        <view class="fw-b text-size multi-text lh-xl margin-bottom">{{goods.title}}</view>
                        <view class="pr">
                            <view v-if="(goods.show_field_price_status || 0) == 1" class="margin-bottom-xs">
                                <text class="price cr-price">{{goods.show_price_symbol}}</text>
                                <text class="sales-price text-size-lg">{{goods.price}}</text>
                                <text v-if="(goods.show_price_unit || null) != null" class="cr-grey text-size-xs">{{goods.show_price_unit}}</text>
                            </view>
                            <view v-if="(goods.show_field_original_price_status || 0) == 1" class="original-price">
                                <text class="text-size-xs">{{goods.show_original_price_symbol}}</text>
                                <text class="text-size">{{goods.original_price}}</text>
                                <text v-if="(goods.show_original_price_unit || null) != null" class="text-size-xs">{{goods.show_original_price_unit}}</text>
                            </view>
                            <view class="pa top-0 right-0" @tap="share_event">
                                <iconfont name="icon-share-square" size="34rpx" color="#999"></iconfont>
                            </view>
                        </view>
                        <view v-if="(goods.show_inventory_status || 0) == 1" class="inventory text-size-xs margin-top">
                            <text class="cr-grey">{{ $t('goods-detail.goods-detail.1s79t4') }}</text>
                            <text class="cr-base">{{ goods.inventory }}</text>
                            <text class="cr-grey">{{ goods.inventory_unit }}</text>
                        </view>

                        <view class="goods-buy-number oh pr margin-top-xxxl">
                            <view class="fl margin-top-sm">{{ $t('common.num') }}</view>
                            <view class="number-content tc oh round pa right-0 top-0">
                                <view @tap="goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="0">-</view>
                                <input @blur="goods_buy_number_blur" class="tc cr-grey bg-white fl va-m radius-0" type="number" name="buy_number" :value="buy_number" />
                                <view @tap="goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="1">+</view>
                            </view>
                        </view>

                        <view class="oh margin-top-xl">
                            <view class="fl margin-top-sm">{{$t('givegift-gift.givegift-gift.8yghjd')}}</view>
                            <view class="fr">
                                <switch name="is_no_limit_receive" :checked="true" />
                            </view>
                        </view>

                        <view class="oh margin-top-xl right-width">
                            <view class="fl margin-top-sm">{{$t('givegift-gift.givegift-gift.567uye')}}</view>
                            <view class="fr">
                                <input type="text" class="br round padding-horizontal lh-xxl ht-xxl" placeholder-class="cr-grey-c" :placeholder="$t('givegift-gift.givegift-gift.rtyu33')" name="message_tips" />
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button type="default" form-type="submit" class="item bg-main br-main cr-white text-size round wh-auto" :disabled="form_submit_disabled_status">{{$t('common.submit_payment')}}</button>
                    </view>
                </view>
            </form>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>

        <!-- 支付组件 -->
        <component-payment
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            propPayDataKey="order_id"
            :propPaymentList="payment_list"
            :propTempPayValue="temp_pay_value"
            :propTempPayIndex="temp_pay_index"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsRedirectTo="true"
            :propToPageBack="to_page_back"
            :propToFailPage="to_fail_page"
            :propToAppointPage="to_appoint_page"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
        ></component-payment>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';
    import componentSharePopup from '@/components/share-popup/share-popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                params: {},
                goods: null,
                buy_number: 1,
                form_submit_disabled_status: false,
                // 支付弹窗参数
                pay_url: '',
                qrcode_url: '',
                payment_list: [],
                temp_pay_value: '',
                temp_pay_index: 0,
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
                pay_price: 0,
                // 前往支付页面携带的参数
                to_page_back: {
                    page: '/pages/plugins/givegift/gift/gift',
                    title: '我的送礼'
                },
                // 支付失败跳转的页面
                to_fail_page: '/pages/plugins/givegift/gift/gift',
                // 现金--跳转指定页面
                to_appoint_page: '/pages/plugins/givegift/gift/gift',
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentPayment,
            componentSharePopup
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 初始化
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            init(e) {
                this.setData({
                    pay_url: app.globalData.get_request_url('pay', 'gift', 'givegift'),
                    qrcode_url: app.globalData.get_request_url('paycheck', 'gift', 'givegift'),
                });
                this.get_data();
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('goods', 'gift', 'givegift'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var payment_list = data.payment_list || [];
                            var default_payment_id = data.default_payment_id || 0;
                            this.setData({
                                goods: data.goods || null,
                                default_payment_id: default_payment_id,
                                payment_list: payment_list,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                            });
                            if (this.goods != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.goods.seo_title || this.goods.title,
                                        desc: this.goods.seo_desc || this.goods.simple_desc,
                                        path: '/pages/goods-detail/goods-detail',
                                        query: 'id='+this.goods.id,
                                        img: this.goods.images
                                    },
                                });
                                // 标题
                                uni.setNavigationBarTitle({ title: this.goods.title });
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            
            // 数量输入事件
            goods_buy_number_blur(e) {
                var number = parseInt(e.detail.value) || 1;
                if (isNaN(number)) {
                    number = this.goods.buy_min_number || 1;
                }
                this.goods_buy_number_func(number);
            },
            
            // 数量操作事件
            goods_buy_number_event(e) {
                var type = parseInt(e.currentTarget.dataset.type || 0);
                var temp_number = parseInt(this.buy_number);
                var number = type == 0 ? temp_number - 1 : temp_number + 1;
                this.goods_buy_number_func(number);
            },

            // 数量处理方法
            goods_buy_number_func(number) {
                var buy_min_number = parseInt(this.goods.buy_min_number || 1);
                var buy_max_number = parseInt(this.goods.buy_max_number || 0);
                var spec_buy_min_number = parseInt(this.goods_spec_base_buy_min_number || 0);
                var spec_buy_max_number = parseInt(this.goods_spec_base_buy_max_number || 0);
                var inventory = parseInt(this.goods.inventory || 0);
                var inventory_unit = this.goods.inventory_unit;

                // 最小起购数量
                var min = spec_buy_min_number > 0 ? spec_buy_min_number : buy_min_number;
                if (min > 0 && number < min) {
                    number = min;
                    app.globalData.showToast(this.$t('recommend-detail.recommend-detail.265vyu') + min + inventory_unit);
                }

                // 最大购买数量
                var max = spec_buy_max_number > 0 ? spec_buy_max_number : buy_max_number;
                if (max > 0 && number > max) {
                    number = max;
                    app.globalData.showToast(this.$t('goods-category.goods-category.z1eh3v') + max + inventory_unit);
                }

                // 是否超过库存数量
                if (number > inventory) {
                    number = inventory;
                    app.globalData.showToast(this.$t('recommend-detail.recommend-detail.2sis3v') + inventory + inventory_unit);
                }

                this.setData({ buy_number: number });
            },

            // 数据提交
            form_submit(e) {
                // 是否登录
                var user = app.globalData.get_user_info(this, 'form_submit', e);
                if(user !== false) {
                    var form_data = e.detail.value;
                    form_data['goods_id'] = this.goods.id;
                    this.setData({
                        form_submit_disabled_status: true,
                    });
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('create', 'gift', 'givegift'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                if(parseInt(data.is_success || 0) == 1) {
                                    app.globalData.showToast(res.data.msg, 'success');
                                    var self = this;
                                    setTimeout(function() {
                                        app.globalData.url_open(self.to_appoint_page, true);
                                    }, 1500);
                                } else {
                                    this.setData({
                                        is_show_payment_popup: this.is_show_payment_popup ? false : true,
                                        temp_pay_value: data.order_id,
                                        pay_price: data.total_price,
                                        payment_id: data.payment_user_id || this.default_payment_id,
                                    });
                                    uni.setStorageSync(app.globalData.data.cache_page_pay_key, {
                                        order_ids: data.order_id,
                                    });
                                }
                            } else {
                                this.setData({
                                    form_submit_disabled_status: false,
                                });
                                if (app.globalData.is_login_check(res.data, this, 'form_submit', e)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 支付窗口关闭
            payment_popup_event_close() {
                this.setData({
                    is_show_payment_popup: false,
                    form_submit_disabled_status: false,
                });
            },

            // 分享开启弹层
            share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        status: true,
                        share_info: this.share_info
                    });
                }
            }
        }
    };
</script>
<style scoped>
    @import './goods.css';
</style>
