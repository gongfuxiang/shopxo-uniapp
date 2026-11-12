<template>
    <view :class="theme_view">
        <block v-if="data_list.length > 0">
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                <view class="page-bottom-fixed padding-top-main">
                    <view v-for="(item, index) in data_list" class="bg-white spacing-mb" :key="index">
                        <view class="padding-main flex-row" :data-value="'/pages/plugins/video/detail/detail?id=' + item.id" @tap="url_event">
                            <view v-if="item.cover" class="padding-right-main">
                                <view class="video-cover-wrap pr radius oh">
                                    <image class="video-cover" :src="item.cover" mode="aspectFill"></image>
                                    <view v-if="item.duration_text || item.duration" class="cover-duration pa text-size-xs cr-white">{{ item.duration_text || (item.duration + '′') }}</view>
                                </view>
                            </view>
                            <view class="flex-1 flex-width">
                                <view class="multi-text text-size fw-b margin-bottom-xs">{{ item.title }}</view>
                                <view v-if="item.category_name" class="text-size-sm cr-grey-9 margin-bottom-xs">{{ item.category_name }}</view>
                                <view class="text-size-sm cr-grey-9 margin-bottom-sm">{{ item.add_time }}</view>
                                <view class="flex-row align-c flex-wrap">
                                    <view v-if="is_user_video_audit == 1" class="badge" :class="audit_badge_class(item)">{{ item.audit_status_name || status_text(item) }}</view>
                                    <view class="badge" :class="parseInt(item.is_enable) == 1 ? 'success' : 'info'">{{ parseInt(item.is_enable) == 1 ? $t('user-list.enabled') : $t('user-list.disabled') }}</view>
                                </view>
                                <view v-if="item.audit_status == 3 && item.audit_reject_reason" class="text-size-xs cr-red margin-top-sm">{{ item.audit_reject_reason }}</view>
                            </view>
                        </view>
                        <view v-if="item.goods" class="goods-link margin-horizontal-main margin-bottom-main bg-grey-f9 padding-sm border-radius-sm" :data-value="item.goods.goods_url || '/pages/goods-detail/goods-detail?id=' + item.goods.id" @tap.stop="url_event">
                            <view class="flex-row align-c">
                                <image v-if="item.goods.images" class="goods-img radius" :src="item.goods.images" mode="aspectFill"></image>
                                <view class="flex-1 flex-width padding-left-sm">
                                    <view class="text-size-sm multi-text">{{ item.goods.title }}</view>
                                    <view class="cr-red text-size-sm margin-top-xs">{{ currency_symbol }}{{ item.goods.price }}</view>
                                </view>
                            </view>
                        </view>
                        <view class="br-t-f5 flex-row jc-sa align-c text-size tc">
                            <view class="cr-base flex-1 divider-r-f5 padding-vertical-main" :data-value="'/pages/plugins/video/form/form?id=' + item.id" @tap="url_event">
                                <view class="margin-right-xs dis-inline-block">
                                    <iconfont name="icon-edit-below-line" size="32rpx"></iconfont>
                                </view>{{$t('common.edit')}}
                            </view>
                            <view v-if="item.operate_data && item.operate_data.is_submit_audit == 1" class="cr-green flex-1 divider-r-f5 padding-vertical-main" :data-id="item.id" data-type="submit" @tap="audit_event">
                                <view class="margin-right-xs dis-inline-block">
                                    <iconfont name="icon-checked" size="32rpx"></iconfont>
                                </view>{{$t('user-list.submit_audit')}}
                            </view>
                            <view v-if="item.operate_data && item.operate_data.is_revoke_audit == 1" class="cr-yellow flex-1 divider-r-f5 padding-vertical-main" :data-id="item.id" data-type="revoke" @tap="audit_event">
                                <view class="margin-right-xs dis-inline-block">
                                    <iconfont name="icon-refresh" size="32rpx"></iconfont>
                                </view>{{$t('user-list.revoke_audit')}}
                            </view>
                            <view class="cr-red flex-1 padding-vertical-main" :data-id="item.id" @tap="del_event">
                                <view class="margin-right-xs dis-inline-block">
                                    <iconfont name="icon-delete" size="32rpx" color="#E22C08"></iconfont>
                                </view>{{$t('common.del')}}
                            </view>
                        </view>
                    </view>
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
            </scroll-view>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <view class="bottom-fixed" :style="bottom_fixed_style">
            <view class="bottom-line-exclude">
                <button class="item cr-main bg-white br-main round text-size wh-auto flex-row align-c jc-c" type="default" hover-class="none" data-value="/pages/plugins/video/form/form" @tap="url_event">
                    <view class="add-icon">
                        <iconfont name="icon-add-wide" size="32rpx"></iconfont>
                    </view>
                    <text>{{$t('common.add')}}</text>
                </button>
            </view>
        </view>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import pluginLocale from '../locale/index.js';
    const CACHE_LIST_REFRESH = 'cache_plugins_video_user_list_refresh';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                data_list: [],
                data_is_loading: 0,
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                is_user_video_audit: 0,
                currency_symbol: app.globalData.currency_symbol(),
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
            app.globalData.page_common_on_show(this);
        },
        onPullDownRefresh() {
            this.reload_all();
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user == false) {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('common.user_not_logged'),
                    });
                    return;
                }
                var refresh = uni.getStorageSync(CACHE_LIST_REFRESH) || null;
                if (refresh) {
                    uni.removeStorageSync(CACHE_LIST_REFRESH);
                    if (refresh.type == 'edit' && parseInt(refresh.id || 0) > 0 && (this.data_list || []).length > 0) {
                        this.refresh_item(refresh.id);
                        return;
                    }
                    this.reload_all();
                    return;
                }
                // 首次进入或空列表才拉，避免 onShow 整表重刷打乱分页
                if ((this.data_list || []).length <= 0) {
                    this.reload_all();
                }
            },
            reload_all() {
                this.setData({
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },
            refresh_item(id) {
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'uservideo', 'video'),
                    method: 'POST',
                    data: { id: id },
                    success: (res) => {
                        if (res.data.code == 0 && (res.data.data.data || null) != null) {
                            var item = res.data.data.data;
                            var list = this.data_list || [];
                            for (var i in list) {
                                if (parseInt(list[i]['id']) == parseInt(item.id)) {
                                    list[i] = Object.assign({}, list[i], item);
                                    break;
                                }
                            }
                            this.setData({
                                data_list: list,
                                is_user_video_audit: res.data.data.is_user_video_audit || this.is_user_video_audit,
                            });
                        }
                    },
                });
            },
            status_text(item) {
                if (this.is_user_video_audit == 1) {
                    return item.audit_status_name || '';
                }
                return parseInt(item.is_enable) == 1 ? this.$t('user-list.enabled') : this.$t('user-list.disabled');
            },
            audit_badge_class(item) {
                if (this.is_user_video_audit == 1) {
                    var s = parseInt(item.audit_status);
                    if (s == 2) {
                        return 'success';
                    }
                    if (s == 3) {
                        return 'error';
                    }
                    if (s == 1) {
                        return 'warning';
                    }
                    return 'info';
                }
                return parseInt(item.is_enable) == 1 ? 'success' : 'info';
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
                    url: app.globalData.get_request_url('index', 'uservideo', 'video'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                    },
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                is_user_video_audit: data.is_user_video_audit || 0,
                            });
                            if (data.data.length > 0) {
                                var temp_data_list = this.data_page <= 1 ? data.data : (this.data_list || []).concat(data.data);
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_list_loding_msg: '',
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });
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
                                        data_bottom_line_status: false,
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
            audit_event(e) {
                // 勿用 e.type（点击事件自带 tap，会误走提审接口）
                var dataset = (e.currentTarget || {}).dataset || {};
                var audit_type = e.audit_type || dataset.type || 'submit';
                var id = e.id || dataset.id;
                if (e.alert_status != 0 && e.alert_status != 1) {
                    app.globalData.alert({
                        msg: audit_type == 'revoke' ? this.$t('user-list.sure_want_revoke_audit') : this.$t('user-list.sure_want_submit_audit'),
                        is_show_cancel: 1,
                        object: this,
                        params: { id: id, audit_type: audit_type },
                        method: 'audit_event',
                    });
                    return false;
                }
                if (e.alert_status == 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url(audit_type == 'revoke' ? 'revokeaudit' : 'submitaudit', 'uservideo', 'video'),
                        method: 'POST',
                        data: { id: e.id },
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                this.refresh_item(e.id);
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
            del_event(e) {
                if (e.alert_status != 0 && e.alert_status != 1) {
                    app.globalData.alert({
                        msg: this.$t('user-list.sure_want_delete_video'),
                        is_show_cancel: 1,
                        object: this,
                        params: { id: e.currentTarget.dataset.id },
                        method: 'del_event',
                    });
                    return false;
                }
                if (e.alert_status == 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('delete', 'uservideo', 'video'),
                        method: 'POST',
                        data: { ids: e.id },
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var temp_list = [];
                                var temp_data_list = this.data_list;
                                for (var i in temp_data_list) {
                                    if (e.id.indexOf(temp_data_list[i]['id']) == -1) {
                                        temp_list.push(temp_data_list[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_list,
                                });
                                app.globalData.showToast(this.$t('common.del_success'), 'success');
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(this.$t('common.del_fail'));
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
            scroll_lower() {
                this.get_data_list();
            },
        },
    };
</script>
<style>
    @import './user-list.css';
</style>
