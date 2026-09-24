<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time_time || '' }}</text>
                        <text class="fr cr-main">{{ item.rating_text || '' }}</text>
                    </view>
                    <view class="margin-top">
                        <view v-if="(item.goods || null) != null" class="oh" :data-value="item.goods.goods_url || ('/pages/goods-detail/goods-detail?id=' + item.goods.id)" @tap="url_event">
                            <image v-if="(item.goods.images || '') != ''" :src="item.goods.images" mode="aspectFill" class="radius goods-images fl"></image>
                            <view class="goods-title fr">
                                <view class="multi-text">{{ item.goods.title || '' }}</view>
                                <view class="cr-grey text-size-xs margin-top-xs">
                                    <text v-if="(item.goods.spec_text || item.msg || '') != ''" class="margin-right-sm">{{ item.goods.spec_text || item.msg }}</text>
                                    <text v-if="item.goods.price !== undefined && item.goods.price !== null && item.goods.price !== ''" class="sales-price margin-right-sm">{{ currency_symbol }}{{ item.goods.price }}</text>
                                    <text v-if="(item.goods.buy_number || 0) > 0">x{{ item.goods.buy_number }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="content margin-top-main">
                            <component-panel-content :propData="item" :propDataField="field_list" propExcludeField="add_time_time,rating_text" :propIsTerse="true"></component-panel-content>
                        </view>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button :data-value="'/pages/user-goods-comments-form/user-goods-comments-form?id=' + item.id" @tap="url_event" class="round bg-white br-main cr-main margin-left-lg" type="default" size="mini" hover-class="none">{{ $t('common.edit') }}</button>
                        <button class="round bg-white br-red cr-red margin-left-lg" type="default" size="mini" hover-class="none" @tap="delete_event" :data-index="index" :data-value="item.id">{{ $t('common.del') }}</button>
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
    import componentPanelContent from '@/pages/common/components/panel-content/panel-content';
    import pluginLocale from './locale/index.js';

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
                params: null,
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
            this.setData({
                params: params,
            });
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            uni.$off('refresh');
            this.init();
            uni.$on('refresh', () => {
                this.init();
            });
            app.globalData.page_common_on_show(this);
        },
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },
        methods: {
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
                    url: app.globalData.get_request_url('index', 'usergoodscomments'),
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
            scroll_lower() {
                this.get_data_list();
            },
            delete_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var value = e.currentTarget.dataset.value || 0;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.delete_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'usergoodscomments'),
                                method: 'POST',
                                data: { ids: value },
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
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
@import './user-goods-comments.css';
</style>
