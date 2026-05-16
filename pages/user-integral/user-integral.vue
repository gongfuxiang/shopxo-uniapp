<template>
    <view :class="theme_view">
        <view class="padding-main">
            <view v-if="(user_integral_header || null) != null" class="integral-header bg-white border-radius-main">
                <view class="flex-row align-s">
                    <view class="flex-1 flex-row align-c padding-main">
                        <image :src="user_integral_header.available.icon" mode="aspectFit" class="integral-header-icon" />
                        <view class="flex-1 flex-width margin-left-sm">
                            <view class="text-size-xs">{{ user_integral_header.available.name }}</view>
                            <view class="margin-top-xs">
                                <text class="text-size-lg fw-b">{{ user_integral_header.available.value }}</text>
                                <text class="text-size-xs cr-grey margin-left-sm">{{ user_integral_header.available.unit }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="integral-header-divider"></view>
                    <view class="flex-1 flex-row align-c padding-main">
                        <image :src="user_integral_header.locking.icon" mode="aspectFit" class="integral-header-icon" />
                        <view class="flex-1 flex-width margin-left-sm">
                            <view class="text-size-xs">{{ user_integral_header.locking.name }}</view>
                            <view class="margin-top-xs">
                                <text class="text-size-lg fw-b">{{ user_integral_header.locking.value }}</text>
                                <text class="text-size-xs cr-grey margin-left-sm">{{ user_integral_header.locking.unit }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view class="padding-horizontal-main">
                <!-- 积分兑换余额 -->
                <view v-if="(integral_to_balance || null) != null && (integral_to_balance.is_enable_feature || 0) == 1" class="bg-white padding-main border-radius-main margin-bottom-main">
                    <view class="flex-row align-c gap-10">
                        <view class="flex-1 flex-width text-size-sm cr-base">
                            <text>{{ integral_to_balance.text_entry_intro_before }}</text><text class="fw-b">{{ integral_to_balance.currency_symbol }}{{ integral_to_balance.integral_to_balance_estimate }}</text><text>{{ integral_to_balance.text_entry_intro_after }}</text>
                            <text v-if="(integral_to_balance.can_exchange || 0) != 1 && (integral_to_balance.display_message || '') != ''" class="text-size-xs cr-grey margin-left-sm">{{ integral_to_balance.display_message }}</text>
                        </view>
                        <button v-if="(integral_to_balance.can_exchange || 0) == 1" type="default" size="mini" class="bg-main br-main cr-white round text-size-xs flex-shrink" hover-class="none" data-value="/pages/plugins/wallet/integral-to-balance/integral-to-balance" @tap="url_event">{{ integral_to_balance.text_btn_exchange }}</button>
                    </view>
                </view>
                <view v-if="data_list.length > 0" class="padding-horizontal-main points-integral bg-white border-radius-main">
                    <view v-for="(item,index) in data_list" class="list" :key="index">
                        <view class="flex-row jc-sb align-c">
                            <view class="cr-grey-9">{{$t('index.index.srd2ch')}}<text class="cr-black fw-b padding-left-sm">{{item.original_integral}}</text>
                                <text class="padding-horizontal-sm">/</text>{{$t('goods-category.goods-category.5p4ksj')}}<text class="cr-black fw-b padding-left-sm">{{item.new_integral}}</text>
                            </view>
                            <view class="cr-grey-9">{{item.add_time_time}}</view>
                        </view>
                        <view class="flex-row jc-sb align-c margin-top-main">
                            <view>{{item.msg}}</view>
                            <view>
                                <text class="text-size-xs cr-grey va-m margin-right-sm">{{item.integral_type_text}}</text>
                                <text class="text-size fw-b va-m" :class="item.operation_type == 1 ? 'cr-green' : 'cr-red'">{{item.operation_type == 1 ? '+' : '-'}}{{item.operation_integral}}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status"></component-no-data>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </scroll-view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                user_integral_header: null,
                integral_to_balance: null,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 从积分兑换余额页返回后刷新列表与提示区
            if (app.globalData.wallet_integral_to_balance_refresh == 1) {
                app.globalData.wallet_integral_to_balance_refresh = 0;
                this.setData({
                    data_page: 1,
                    data_bottom_line_status: false,
                    data_is_loading: 0,
                });
            }

            // 加载数据
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.get_data_list();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false
                    });
                }
            },
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1
                });
                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "userintegral"),
                    method: 'POST',
                    data: {
                        page: this.data_page
                    },
                    dataType: 'json',
                    success: res => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var patch = {};
                            if (typeof data.user_integral_header !== 'undefined') {
                                patch.user_integral_header = data.user_integral_header;
                            }
                            if (typeof data.integral_to_balance !== 'undefined') {
                                patch.integral_to_balance = data.integral_to_balance;
                            }
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData(Object.assign({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0
                                }, patch));
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                var empty_patch = Object.assign({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                }, patch);
                                this.setData(empty_patch);
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            },
            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // url 跳转（与钱包页一致）
            url_event(e) {
                app.globalData.url_event(e);
            },
        }
    };
</script>
<style>
    @import './user-integral.css';
</style>