<template>
    <view :class="theme_view">
        <block v-if="is_index_init">
            <view v-if="slider_list.length > 0" class="padding-horizontal-main padding-top-main">
                <component-banner :propData="slider_list"></component-banner>
            </view>

            <view class="staff-header-row flex-row align-c padding-horizontal-main padding-top-main padding-bottom-main bg-white spacing-mb">
                <view class="fw-b text-size staff-title flex-shrink-0">{{ $t('pages.plugins-realstore-staff-list') }}</view>
                <view class="flex-1 flex-width margin-left-main staff-search">
                    <component-search @onsearch="search_button_event" :propDefaultValue="search_keywords_value" :propIsOnEvent="true" :propIsRequired="false" :propIsBtn="true" propIconColor="#ccc" propPlaceholderClass="cr-grey-c" propBrColor="#eee" propBtnClass="bg-black cr-white text-size-xs" :propPlaceholder="$t('realstore-staff.realstore-staff.a2b3c4')"></component-search>
                </view>
            </view>

            <view v-if="data_list.length > 0" class="padding-horizontal-main">
                <view v-for="(item, index) in data_list" :key="index" class="staff-item padding-main border-radius-main bg-white spacing-mb flex-row cp" :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + item.id" @tap="url_event">
                    <image v-if="(item.avatar || null) != null && item.avatar != ''" class="staff-avatar-large circle br margin-right-main" :src="item.avatar" mode="aspectFill"></image>
                    <view v-else class="staff-avatar-large staff-avatar-placeholder circle br margin-right-main">
                        <iconfont name="icon-user" size="48rpx" color="#ccc"></iconfont>
                    </view>
                    <view class="flex-1 flex-width staff-item-content">
                        <view v-if="(item.booking_count || 0) > 0" class="staff-booking-count cr-grey text-size-xs">{{ $t('realstore-staff.realstore-staff.3b9c2d') }}{{ item.booking_count }}</view>
                        <view class="flex-row align-c staff-name-row">
                            <view class="fw-b text-size staff-info-name flex-shrink-0">{{ item.alias }}</view>
                            <view v-if="(item.position_name || null) != null && item.position_name != ''" class="staff-position-tag round bg-white br-yellow cr-yellow text-size-xs flex-shrink-0">{{ item.position_name }}</view>
                        </view>
                        <view v-if="(item.realstore || null) != null && (item.realstore.name || '') != ''" class="cr-grey text-size-xs margin-top-xs single-text">{{ item.realstore.name }}</view>
                        <button class="staff-book-btn staff-book-btn-br round text-size-xs bg-main cr-white br-main" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + item.id" @tap.stop="url_event">{{ $t('realstore-staff.realstore-staff.4c0d3e') }}</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" propLoadingLogoTop="45vh"></component-no-data>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <component-no-data :propStatus="index_loding_status" :propMsg="index_loding_msg"></component-no-data>
        </block>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentBanner from '@/components/slider/slider';
    import componentSearch from '@/components/search/search';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                slider_list: [],
                is_index_init: false,
                index_loding_status: 1,
                index_loding_msg: '',
                search_keywords_value: '',
                data_list: [],
                data_page: 1,
                data_page_total: 0,
                data_total: 0,
                data_is_loading: 0,
                data_list_loding_status: 0,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentBanner,
            componentSearch,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });

            // 数据加载
            this.get_data();
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
            this.setData({
                data_page: 1,
                data_list: [],
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
            });
            this.get_data();
        },

        onReachBottom() {
            if (this.is_index_init) {
                this.get_data_list();
            }
        },

        methods: {
            // 获取数据
            get_data() {
                this.setData({
                    index_loding_status: 1,
                    data_bottom_line_status: false,
                });
                uni.request({
                    url: app.globalData.get_request_url('index', 'staff', 'realstore'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.setData({
                                slider_list: data.slider_list || [],
                                is_index_init: true,
                                index_loding_status: 3,
                                data_page: 1,
                                data_list: [],
                                data_list_loding_status: 1,
                                data_list_loding_msg: '',
                                data_bottom_line_status: false,
                            });
                            this.get_data_list(1);

                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.$t('pages.plugins-realstore-staff-list'),
                                    desc: this.$t('realstore-staff.realstore-staff.2a8b1c'),
                                    path: '/pages/plugins/realstore/staff-list/staff-list',
                                },
                            });

                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            uni.stopPullDownRefresh();
                            app.globalData.is_login_check(res.data);
                            this.setData({
                                index_loding_status: 0,
                                index_loding_msg: res.data.msg,
                                data_bottom_line_status: false,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            index_loding_status: 2,
                            index_loding_msg: this.$t('common.internet_error_tips'),
                            data_bottom_line_status: false,
                        });
                    },
                });
            },

            get_data_list(is_mandatory) {
                if (!this.is_index_init) {
                    uni.stopPullDownRefresh();
                    return false;
                }

                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                });
                if (this.data_page <= 1 || (is_mandatory || 0) == 1) {
                    this.setData({
                        data_list_loding_msg: '',
                    });
                }

                uni.request({
                    url: app.globalData.get_request_url('datalist', 'staff', 'realstore'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        keywords: this.search_keywords_value || '',
                    },
                    dataType: 'json',
                    success: (res) => {
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
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_list_loding_msg: '',
                                    data_is_loading: 0,
                                });
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
                                data_list_loding_msg: res.data.msg || this.$t('common.no_relevant_data_tips'),
                                data_is_loading: 0,
                            });
                            if (this.data_page <= 1) {
                                this.setData({
                                    data_list: [],
                                    data_bottom_line_status: false,
                                });
                            }
                            app.globalData.is_login_check(res.data);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_is_loading: 0,
                        });
                        if (this.data_page <= 1) {
                            this.setData({
                                data_list: [],
                                data_bottom_line_status: false,
                            });
                        }
                    },
                });
            },

            search_button_event(e) {
                this.setData({
                    search_keywords_value: e || '',
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },

            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './staff-list.css';
</style>
