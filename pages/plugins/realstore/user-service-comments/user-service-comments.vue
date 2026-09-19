<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time_time || item.add_time || '' }}</text>
                        <text class="fr cr-main">{{ item.comment_type_name || '' }}</text>
                    </view>
                    <view class="margin-top">
                        <view v-if="(item.target || null) != null" class="oh" :data-value="target_url(item)" @tap="url_event">
                            <image v-if="(item.target.images || '') != ''" :src="item.target.images" mode="aspectFill" class="radius goods-images fl"></image>
                            <view class="goods-title fr">
                                <view class="multi-text">{{ item.target.title || '' }}</view>
                                <view v-if="item.comment_type == 'goods'" class="cr-grey text-size-xs margin-top-xs">
                                    <text v-if="(item.target.spec_text || '') != ''" class="margin-right-sm">{{ item.target.spec_text }}</text>
                                    <text v-if="item.target.price !== undefined && item.target.price !== null && item.target.price !== ''" class="sales-price margin-right-sm">{{ currency_symbol }}{{ item.target.price }}</text>
                                    <text v-if="(item.target.buy_number || 0) > 0">x{{ item.target.buy_number }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="content margin-top-main">
                            <component-panel-content :propData="item" :propDataField="field_list" propExcludeField="add_time_time,comment_type_name,target_title" :propIsTerse="true"></component-panel-content>
                        </view>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button class="round bg-white cr-red br-red" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('common.del') }}</button>
                    </view>
                </view>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </scroll-view>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPanelContent from '@/components/panel-content/panel-content';
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                currency_symbol: app.globalData.currency_symbol(),
                field_list: [],
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.init_title();
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
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },
        methods: {
            // 对象跳转地址
            target_url(item) {
                if ((item || null) == null || (item.target || null) == null) {
                    return '';
                }
                var target = item.target;
                if ((target.goods_url || '') != '') {
                    return target.goods_url;
                }
                if ((target.url || '') != '') {
                    return target.url;
                }
                if (item.comment_type == 'goods' && (target.id || 0) > 0) {
                    return '/pages/goods-detail/goods-detail?id=' + target.id;
                }
                if (item.comment_type == 'staff' && (target.id || 0) > 0) {
                    return '/pages/plugins/realstore/staff-detail/staff-detail?id=' + target.id;
                }
                return '';
            },
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
                }
            },
            // 标题
            init_title() {
                uni.request({
                    url: app.globalData.get_request_url('config', 'usercomments', 'realstore'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0 && (res.data.data || null) != null && (res.data.data.name || '') != '') {
                            uni.setNavigationBarTitle({ title: res.data.data.name });
                        } else {
                            uni.setNavigationBarTitle({ title: this.$t('pages.plugins-realstore-user-service-comments') });
                        }
                    },
                    fail: () => {
                        uni.setNavigationBarTitle({ title: this.$t('pages.plugins-realstore-user-service-comments') });
                    },
                });
            },
            // 获取数据
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
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'usercomments', 'realstore'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            if (this.data_page <= 1) {
                                var temp_data_list = data.data_list || [];
                            } else {
                                var temp_data_list = this.data_list || [];
                                var temp_data = data.data_list || [];
                                for (var i in temp_data) {
                                    temp_data_list.push(temp_data[i]);
                                }
                            }
                            this.setData({
                                field_list: data.field_list || [],
                                data_list: temp_data_list,
                                data_total: data.data_total || data.total || 0,
                                data_page_total: data.page_total || 0,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: '',
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 删除
            delete_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.delete_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            var value = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'usercomments', 'realstore'),
                                method: 'POST',
                                data: {
                                    ids: value,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        if (temp_data_list.length == 0) {
                                            this.setData({
                                                data_list_loding_status: 0,
                                                data_bottom_line_status: false,
                                            });
                                        }
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
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
            // 滚动加载
            scroll_lower() {
                this.get_data_list();
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
.scroll-box {
    height: 100vh;
}
.goods-images {
    width: 76rpx;
    height: 76rpx;
}
.goods-title {
    width: calc(100% - 90rpx);
}
</style>
