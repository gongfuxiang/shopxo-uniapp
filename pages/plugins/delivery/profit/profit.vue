<template>
    <view :class="[theme_view, 'page-delivery-profit']">
        <view class="header bg-white">
            <!-- 汇总 -->
            <view class="summary padding-main oh br-b">
                <view class="item fl tc">
                    <view class="cr-main text-size">{{ currency_symbol }}{{ summary.wait_price || '0.00' }}</view>
                    <view class="cr-grey text-size-xs margin-top-xs">{{ $t('profit.wait_price') }}</view>
                </view>
                <view class="item fl tc">
                    <view class="cr-green text-size">{{ currency_symbol }}{{ summary.settled_price || '0.00' }}</view>
                    <view class="cr-grey text-size-xs margin-top-xs">{{ $t('profit.settled_price') }}</view>
                </view>
                <view class="item fl tc">
                    <view class="cr-grey text-size">{{ currency_symbol }}{{ summary.invalid_price || '0.00' }}</view>
                    <view class="cr-grey text-size-xs margin-top-xs">{{ $t('profit.invalid_price') }}</view>
                </view>
            </view>

            <!-- 导航 -->
            <view class="nav-base">
                <view v-for="(item, index) in nav_status_list" :key="index">
                    <view :class="'item fl tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : 'cr-grey')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                </view>
            </view>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time_text || item.add_time }}</text>
                        <text class="fr cr-main">{{ item.status_name }}</text>
                    </view>
                    <view class="content margin-top">
                        <view class="single-text margin-top-xs">
                            <text class="cr-grey margin-right-xl">{{ $t('profit.order_no') }}</text>
                            <text class="cr-base cp" data-event="copy" :data-value="item.main_order_no" @tap="text_event">{{ item.main_order_no }}</text>
                        </view>
                        <view class="single-text margin-top-xs">
                            <text class="cr-grey margin-right-xl">{{ $t('profit.distance_km') }}</text>
                            <text class="cr-base">{{ item.distance_km }}</text>
                        </view>
                        <view class="single-text margin-top-xs">
                            <text class="cr-grey margin-right-xl">{{ $t('profit.total_price') }}</text>
                            <text class="cr-base">{{ currency_symbol }}{{ item.total_price }}</text>
                        </view>
                        <view class="single-text margin-top-xs">
                            <text class="cr-grey margin-right-xl">{{ $t('profit.platform_price') }}</text>
                            <text class="cr-base">{{ currency_symbol }}{{ item.platform_price }}</text>
                        </view>
                        <view class="single-text margin-top-xs">
                            <text class="cr-grey margin-right-xl">{{ $t('profit.profit_price') }}</text>
                            <text class="cr-main">{{ currency_symbol }}{{ item.profit_price }}</text>
                        </view>
                        <view v-if="(item.settle_time_text || null) != null" class="single-text margin-top-xs">
                            <text class="cr-grey margin-right-xl">{{ $t('profit.settle_time') }}</text>
                            <text class="cr-base">{{ item.settle_time_text }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                summary: {},
                currency_symbol: app.globalData.currency_symbol(),
                nav_status_list: [
                    { name: this.$t('profit.tab_wait'), value: "1" },
                    { name: this.$t('profit.tab_settled'), value: "2" },
                    { name: this.$t('profit.tab_invalid'), value: "3" },
                ],
                nav_status_index: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 是否指定状态
            var nav_status_index = 0;
            if ((params.status || null) != null) {
                for (var i in this.nav_status_list) {
                    if (this.nav_status_list[i]["value"] == params.status) {
                        nav_status_index = i;
                        break;
                    }
                }
            }
            this.setData({
                params: params,
                nav_status_index: nav_status_index,
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

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.get_data_list();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 获取数据
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
                    data_list_loding_status: 1,
                });

                // 加载loding
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 获取数据
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? 1 : this.nav_status_list[this.nav_status_index]["value"];
                uni.request({
                    url: app.globalData.get_request_url("index", "profit", "delivery"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        status: status,
                    },
                    dataType: "json",
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var result = res.data.data || {};
                            var rows = result.data || [];
                            var page_total = result.page_total != null ? result.page_total : 0;
                            var total = result.total != null ? result.total : 0;
                            var temp_data_list = [];
                            if (this.data_page <= 1) {
                                temp_data_list = rows;
                            } else {
                                temp_data_list = this.data_list || [];
                                for (var i in rows) {
                                    temp_data_list.push(rows[i]);
                                }
                            }
                            this.setData({
                                data_list: temp_data_list,
                                data_total: total,
                                data_page_total: page_total,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                                summary: result.summary || {},
                            });
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            },
        },
    };
</script>
<style>
    @import "./profit.css";
</style>
