<template>
    <view :class="theme_view">
        <block v-if="data_list.length > 0">
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                <view class="page-bottom-fixed padding-top-main">
                    <view v-for="(item, index) in data_list" class="bg-white spacing-mb" :key="index">
                        <view class="padding-main flex-row" :data-value="'/pages/plugins/blog/detail/detail?id=' + item.id" @tap="url_event">
                            <view v-if="item.cover" class="padding-right-main">
                                <image class="blog-img radius" :src="item.cover" mode="aspectFit"></image>
                            </view>
                            <view class="flex-1 flex-width">
                                <view class="multi-text text-size fw-b margin-bottom-xs">{{ item.title }}</view>
                                <view class="text-size-sm cr-grey-9 margin-bottom-sm">{{ item.date }}</view>
                                <view class="badge" :class="item.status == '0' ? 'info' : item.status == 1 ? 'success' : 'error'">{{ item.status_name }}</view>
                                <view v-if="item.status == 2 && item.reason" class="text-size-xs cr-red margin-top-sm">{{ item.reason }}</view>
                            </view>
                        </view>
                        <view class="br-t-f5 flex-row jc-sa align-c text-size tc">
                            <view class="cr-base flex-1 divider-r-f5 padding-vertical-main" :data-value="'/pages/plugins/blog/form/form?id=' + item.id" @tap="url_event">
                                <view class="margin-right-xs dis-inline-block">
                                    <iconfont name="icon-edit-below-line" size="32rpx"></iconfont>
                                </view>{{$t('common.edit')}}</view>
                            <view class="cr-red flex-1 padding-vertical-main" :data-id="item.id" @tap="del_event">
                                <view class="margin-right-xs dis-inline-block">
                                    <iconfont name="icon-delete" size="32rpx" color="#E22C08"></iconfont>
                                </view>{{$t('common.del')}}</view>
                        </view>
                    </view>
                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
            </scroll-view>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 底部操作 -->
        <view class="bottom-fixed" :style="bottom_fixed_style">
            <view class="bottom-line-exclude">
                <button class="item cr-main bg-white br-main round text-size wh-auto flex-row align-c jc-c" type="default" hover-class="none" data-value="/pages/plugins/blog/form/form" @tap="url_event">
                    <view class="add-icon">
                        <iconfont name="icon-add-wide" size="32rpx"></iconfont>
                    </view>
                    <text>{{$t('common.add')}}</text>
                </button>
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
    import pluginLocale from '../locale/index.js';
    const CACHE_LIST_REFRESH = 'cache_plugins_blog_user_list_refresh';
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
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.reload_all();
        },

        // 页面销毁时执行
        onUnload: function () {},

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
                    url: app.globalData.get_request_url('saveinfo', 'blog', 'blog'),
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
                            });
                        }
                    },
                });
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
                    data_list_loding_status: 1,
                });
                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'blog', 'blog'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                    },
                    success: (res) => {
                        if(this.data_page > 1) {
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
                        if(this.data_page > 1) {
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

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 删除
            del_event(e) {
                // 是否再次确认
                if (e.alert_status != 0 && e.alert_status != 1) {
                    app.globalData.alert({
                        msg: this.$t('user-list.sure_want_delete_post'),
                        is_show_cancel: 1,
                        object: this,
                        params: { id: e.currentTarget.dataset.id },
                        method: 'del_event',
                    });
                    return false;
                }
                if (e.alert_status == 1) {
                    // 加载loding
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('delete', 'blog', 'blog'),
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
            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },
        },
    };
</script>
<style>
    @import './user-list.css';
</style>
