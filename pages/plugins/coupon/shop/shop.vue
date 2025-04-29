<template>
    <view :class="theme_view">
        <view class="plugins-coupon-container">
            <!-- 优惠劵列表 -->
            <view v-if="data_list.length > 0" class="coupon-content bg-white pr padding-top-main page-bottom-fixed">
                <view class="flex-col">
                    <block v-for="(item, index) in data_list" :key="index">
                        <component-coupon-card :propData="item" :propStatusType="item.status_type" :propStatusOperableName="item.status_operable_name" :propIndex="index" propIsProgress @call-back="coupon_receive_event"></component-coupon-card>
                    </block>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>
        <!-- 回到店铺 -->
        <view v-if="(shop || null) != null" class="popup-bottom bottom-fixed bg-white">
            <view class="bottom-line-exclude">
                <button class="bg-white cr-main br-main round dis-block text-size" type="default" hover-class="none" :data-value="shop.url" @tap="shop_event">{{ $t('index.index.i78v36') }}</button>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentCouponCard from '@/pages/plugins/coupon/components/coupon-card/coupon-card';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                data_list: [],
                data_base: null,
                shop: null,
                // 优惠劵领取
                temp_coupon_receive_index: null,
                temp_coupon_receive_value: null,
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentCouponCard,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
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

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },

        methods: {
            // 获取数据
            init() {
                this.get_data_list();
            },

            // 获取数据
            get_data_list() {
                if (this.data_list.length <= 0) {
                    this.setData({
                        data_list_loding_status: 1,
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('shop', 'index', 'coupon'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var status = (data.data || []).length > 0;
                            this.setData({
                                data_base: data.base || null,
                                shop: data.shop || null,
                                data_list: data.data || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: status ? 3 : 0,
                                data_bottom_line_status: status,
                            });

                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/coupon/shop/shop',
                                    },
                                });

                                // 导航名称
                                if ((this.data_base.shop_application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.shop_application_name,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 优惠劵领取事件
            coupon_receive_event(index, value) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                // 参数处理
                if ((index || null) == null && (value || null) == null) {
                    var index = this.temp_coupon_receive_index;
                    var value = this.temp_coupon_receive_value;
                } else {
                    this.setData({
                        temp_coupon_receive_index: index,
                        temp_coupon_receive_value: value,
                    });
                }
                // 登录校验
                var user = app.globalData.get_user_info(this, 'coupon_receive_event');
                if (user != false) {
                    var temp_list = this.data_list;
                    if (temp_list[index]['status_type'] == 0) {
                        uni.showLoading({
                            title: this.$t('common.processing_in_text'),
                        });
                        uni.request({
                            url: app.globalData.get_request_url('receive', 'coupon', 'coupon'),
                            method: 'POST',
                            data: {
                                coupon_id: value,
                            },
                            dataType: 'json',
                            success: (res) => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    app.globalData.showToast(res.data.msg, 'success');
                                    temp_list[index] = res.data.data.coupon;
                                    this.setData({
                                        data_list: temp_list,
                                    });
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, 'coupon_receive_event')) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast(this.$t('common.internet_error_tips'));
                            },
                        });
                    }
                }
            },

            // 店铺事件
            shop_event(e) {
                var prev_url = app.globalData.prev_page();
                if (prev_url != null && prev_url.indexOf('pages/plugins/shop/detail/detail') != -1) {
                    uni.navigateBack();
                } else {
                    app.globalData.url_event(e);
                }
            },
        },
    };
</script>
<style>
    @import './shop.css';
</style>
