<template>
    <view :class="theme_view">
        <view v-if="(data_base || null) != null" class="ht bg-white">
            <view class="plugins-coupon-container">
                <view class="coupon-content padding-top-main page-bottom-fixed">
                    <!-- 优惠劵列表 -->
                    <block v-if="(data || null) != null">
                        <component-coupon-card :propData="data" :propStatusType="data.status_type" :propStatusOperableName="data.status_operable_name" propIndex="0" propIsProgress @call-back="coupon_receive_event"></component-coupon-card>
                    </block>
                    <block v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                    </block>

                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
            </view>
            <view class="bottom-fixed" :style="bottom_fixed_style">
                <view class="bottom-line-exclude">
                    <button class="item round cr-main bg-white br-main text-size wh-auto" type="default" hover-class="none" data-value="/pages/plugins/coupon/user/user" @tap="url_event">{{$t('index.index.lk0i6c')}}</button>
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
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentCouponCard from '@/pages/plugins/coupon/components/coupon-card/coupon-card';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                params: {},
                data: null,
                data_base: null,
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
                params: app.globalData.launch_params_handle(params),
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.get_data();

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
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'coupon'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                                data_bottom_line_status: false,
                            });
                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.name,
                                        desc: this.data.desc,
                                        path: '/pages/plugins/coupon/detail/detail',
                                        query: 'id='+this.data.id
                                    },
                                });

                                // 导航名称
                                uni.setNavigationBarTitle({
                                    title: this.data.name,
                                });
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
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
                    var data = this.data;
                    if (data['status_type'] == 0) {
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
                                    data = res.data.data.coupon;
                                    this.setData({
                                        data_list: data,
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

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style scoped>
</style>