<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="padding-main border-radius-main oh bg-white spacing-mb">
                    <view
                        v-if="(item.staff_info || null) != null && (item.staff_info.id || 0) > 0"
                        :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + item.staff_info.id"
                        @tap="url_event"
                        class="cp"
                    >
                        <image v-if="(item.staff_info.avatar || '') != ''" class="logo fl radius circle" :src="item.staff_info.avatar" mode="aspectFill"></image>
                        <view v-else class="logo fl radius circle staff-avatar-placeholder flex-row align-c jc-c">
                            <iconfont name="icon-user" size="48rpx" color="#ccc"></iconfont>
                        </view>
                        <view class="base">
                            <view class="single-text fw-b">{{ item.staff_info.alias || '' }}</view>
                            <view v-if="(item.staff_info.realstore_name || '') != ''" class="multi-text cr-grey margin-top-sm">{{ $t('realstore-staff.store') }}{{ item.staff_info.realstore_name }}</view>
                        </view>
                    </view>
                    <view v-else class="cr-grey text-size-sm">{{ $t('common.no_relevant_data_tips') }}</view>
                    <button class="br-yellow cr-yellow bg-white fr round" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('common.cancel') }}</button>
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
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
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
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            this.init();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
            app.globalData.page_share_handle();
        },
        onPullDownRefresh() {
            this.setData({ data_page: 1 });
            this.get_data_list(1);
        },
        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        data_page: 1,
                        data_list: [],
                        data_bottom_line_status: false,
                    });
                    this.get_data_list(1);
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },
            // 获取收藏列表
            get_data_list(is_mandatory) {
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
                    data_list_loding_status: 1,
                });
                if (this.data_page > 1) {
                    uni.showLoading({ title: this.$t('common.loading_in_text') });
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'stafffavor', 'realstore'),
                    method: 'POST',
                    data: { page: this.data_page },
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data || [];
                            if (list.length > 0) {
                                var temp_data_list = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total || 0,
                                    data_page_total: data.page_total || 0,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });
                                this.setData({
                                    data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({ data_list_loding_status: 0, data_is_loading: 0 });
                                if (this.data_page <= 1) {
                                    this.setData({ data_list: [], data_bottom_line_status: false });
                                }
                            }
                        } else {
                            this.setData({ data_list_loding_status: 0, data_is_loading: 0 });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({ data_list_loding_status: 2, data_is_loading: 0 });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 滚动加载
            scroll_lower() {
                this.get_data_list();
            },
            // 取消收藏
            cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.cancel_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            uni.showLoading({ title: this.$t('common.processing_in_text') });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'stafffavor', 'realstore'),
                                method: 'POST',
                                data: { ids: id },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list.slice();
                                        temp_data_list.splice(index, 1);
                                        this.setData({ data_list: temp_data_list });
                                        if (temp_data_list.length == 0) {
                                            this.setData({
                                                data_list_loding_status: 0,
                                                data_bottom_line_status: false,
                                            });
                                        }
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        if (app.globalData.is_login_check(res.data)) {
                                            app.globalData.showToast(res.data.msg);
                                        } else {
                                            app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                        }
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
@import './staff-favor.css';
</style>
