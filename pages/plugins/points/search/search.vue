<template>
    <view :class="theme_view">
        <view v-if="(data_base || null) != null">
            <!-- 顶栏：返回积分商城 + 我的积分 -->
            <view class="search-toolbar padding-horizontal-main padding-vertical-sm bg-white">
                <view class="flex-row jc-sb align-c margin-bottom-sm">
                    <view class="search-back cr-base" @tap="points_home_event">
                        <iconfont name="icon-home" size="28rpx" color="#666" propClass="margin-right-xs"></iconfont>
                        <text>{{ $t('pages.plugins-points-index') }}</text>
                    </view>
                    <view v-if="(user || null) != null" class="search-integral cr-main" data-value="/pages/user-integral/user-integral" @tap="url_event">
                        <iconfont name="icon-points-terse" size="28rpx" :color="theme_color || '#DF7B0E'" propClass="margin-right-xs"></iconfont>
                        <text>{{ $t('user.user.k78280') }}</text>
                        <text class="fw-b margin-left-xs">{{ (user_integral || null) != null ? (user_integral.integral || 0) : 0 }}</text>
                    </view>
                </view>
                <component-search
                    @onsearch="search_button_event"
                    :propIsOnEvent="true"
                    :propIsRequired="false"
                    :propIsBtn="true"
                    :propDefaultValue="search_keywords_value"
                    :propPlaceholder="$t('points.search.placeholder')"
                    propPlaceholderClass="cr-grey-c"
                    propIconColor="#999"
                    propBgColor="#f5f5f5"
                    propBrColor="#eee"
                ></component-search>
            </view>

            <!-- 结果摘要 -->
            <view class="padding-horizontal-main padding-top-sm padding-bottom-sm bg-white search-summary cr-grey text-size-sm flex-row jc-sb align-c">
                <view class="summary-text">
                    <text v-if="(search_keywords_value || null) != null && search_keywords_value != ''">{{ $t('points.search.keywords_label') }}「</text>
                    <text v-if="(search_keywords_value || null) != null && search_keywords_value != ''" class="cr-main">{{ search_keywords_value }}</text>
                    <text v-if="(search_keywords_value || null) != null && search_keywords_value != ''">」</text>
                    <text v-else>{{ $t('points.search.all_goods') }}</text>
                    <text>，{{ $t('common.total') }}{{ data_total }}{{ $t('points.search.goods_unit') }}</text>
                </view>
                <text v-if="(search_keywords_value || null) != null && search_keywords_value != ''" class="clear-search cr-grey-9 text-size-xs cp" @tap="clear_search_event">{{ $t('points.search.clear_where') }}</text>
            </view>

            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                <view v-if="(data_list || null) != null && data_list.length > 0" class="padding-horizontal-main padding-top-main oh">
                    <component-goods-list :propData="{ style_type: 1, goods_list: data_list }" :propCurrencySymbol="currency_symbol" propPriceField="plugins_points_exchange_integral" :propIsShowPriceIcon="false" :propGridBtnConfig="gridBtnConfig" :propIsOpenGridBtnSet="isOpenGridBtnSet"></component-goods-list>
                </view>
                <view v-else>
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </view>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </scroll-view>
        </view>
        <block v-else>
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
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentSearch from '@/components/search/search';
    import iconfont from '@/components/iconfont/iconfont';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                user: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                params: null,
                data_base: null,
                user_integral: null,
                search_keywords_value: '',
                currency_symbol: app.globalData.currency_symbol(),
                isOpenGridBtnSet: true,
                gridBtnConfig: {
                    name: this.$t('index.index.4v5nq5'),
                    bg_color: app.globalData.get_theme_color(),
                    padding: '8rpx 16rpx',
                    border_radius: '8rpx',
                },
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentGoodsList,
            componentSearch,
            iconfont,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params,
                search_keywords_value: params.keywords || '',
            });
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
            // 用户信息
            this.setData({
                user: app.globalData.get_user_cache_info(),
            });
            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
                data_list: [],
                data_bottom_line_status: false,
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'search', 'points'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                user_integral: data.user_integral || null,
                            });
                            // 基础自定义分享
                            this.share_info_handle();
                            // 获取列表数据
                            this.get_data_list(1);
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 获取数据列表
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
                this.setData({ data_is_loading: 1 });

                // 加载loding
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'search', 'points'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        wd: this.search_keywords_value,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
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
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_list_loding_msg: '',
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_total: 0,
                                        data_bottom_line_status: false,
                                    });
                                } else {
                                    this.setData({
                                        data_bottom_line_status: true,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                            app.globalData.showToast(res.data.msg);
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

            // 基础自定义分享
            share_info_handle() {
                this.setData({
                    share_info: {
                        title: this.$t('points.search.title'),
                        path: '/pages/plugins/points/search/search',
                        query: 'keywords=' + (this.search_keywords_value || ''),
                    },
                });
                app.globalData.page_share_handle(this.share_info);
            },

            // 滚动加载
            scroll_lower() {
                this.get_data_list();
            },

            // 搜索确认
            search_button_event(value) {
                this.setData({
                    search_keywords_value: value || '',
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                });
                this.share_info_handle();
                this.get_data_list(1);
            },

            // 积分商城首页（上一页是积分商城首页则返回，避免页面循环）
            points_home_event() {
                var prev_url = app.globalData.prev_page();
                if (prev_url != null && prev_url.indexOf('pages/plugins/points/index/index') != -1) {
                    uni.navigateBack();
                } else {
                    app.globalData.url_open('/pages/plugins/points/index/index');
                }
            },

            // 清除搜索条件
            clear_search_event() {
                this.setData({
                    search_keywords_value: '',
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                });
                this.share_info_handle();
                this.get_data_list(1);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './search.css';
</style>
