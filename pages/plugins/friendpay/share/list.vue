<template>
    <view :class="theme_view">
        <view class="nav-base bg-white flex-row jc-sa align-c">
            <view :class="'item tc ' + (list_type == 'owner' ? 'cr-main nav-active-line' : '')" data-type="owner" @tap="type_event">{{ $t('friendpay.friendpay.list_owner') }}</view>
            <view :class="'item tc ' + (list_type == 'payer' ? 'cr-main nav-active-line' : '')" data-type="payer" @tap="type_event">{{ $t('friendpay.friendpay.list_payer') }}</view>
        </view>
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time_text || item.add_time }}</text>
                        <text class="fr" :class="item.status == 1 ? 'cr-green' : (item.status == 3 ? 'cr-red' : (item.status == 2 ? 'cr-grey' : 'cr-main'))">{{ item.status_name }}</text>
                    </view>
                    <view class="margin-top-main">
                        <component-panel-content :propData="item" :propDataField="field_list" propExcludeField="status_name" :propIsTerse="true"></component-panel-content>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button class="round bg-white cr-base br-base" type="default" size="mini" hover-class="none" @tap="detail_event" :data-id="item.id">{{ $t('common.detail_text') }}</button>
                        <button v-if="list_type == 'owner' && item.status == 0" class="round bg-white cr-main br-main margin-left-sm" type="default" size="mini" hover-class="none" @tap="share_event" :data-id="item.id">{{ $t('friendpay.friendpay.go_share') }}</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentPanelContent from '@/components/panel-content/panel-content';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                list_type: 'owner',
                data_list: [],
                field_list: [],
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
            componentPanelContent,
            componentNoData,
            componentBottomLine,
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 是否指定列表类型
            if ((params.type || null) != null && params.type == 'payer') {
                this.setData({
                    list_type: 'payer',
                });
            }
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 页面标题
            uni.setNavigationBarTitle({ title: this.$t('pages.plugins-friendpay-list') });

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 初始化
            this.init();
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
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        data_page: 1,
                    });
                    this.get_data_list(1);
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                    });
                }
            },

            // 列表类型切换
            type_event(e) {
                var type = e.currentTarget.dataset.type || 'owner';
                if (type == this.list_type) {
                    return;
                }
                this.setData({
                    list_type: type,
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },

            // 列表数据
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status == true) {
                    uni.stopPullDownRefresh();
                    return false;
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
                uni.request({
                    url: app.globalData.get_request_url('list', 'share', 'friendpay'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        type: this.list_type,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_is_loading: 0,
                        });
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var temp_list = data.data_list || [];
                            if (this.data_page <= 1) {
                                var merge_list = temp_list;
                            } else {
                                var merge_list = this.data_list || [];
                                for (var i in temp_list) {
                                    merge_list.push(temp_list[i]);
                                }
                            }
                            this.setData({
                                data_list: merge_list,
                                field_list: data.field_list || [],
                                data_total: data.data_total || 0,
                                data_page_total: data.data_page_total || 0,
                                data_list_loding_status: merge_list.length > 0 ? 3 : 0,
                                data_page: this.data_page + 1,
                                data_bottom_line_status: merge_list.length > 0 && this.data_page > 1 && this.data_page > (data.data_page_total || 0),
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
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
                            data_is_loading: 0,
                            data_list_loding_status: 2,
                        });
                    },
                });
            },

            // 滚动加载
            scroll_lower() {
                this.get_data_list();
            },

            // 详情
            detail_event(e) {
                var id = e.currentTarget.dataset.id;
                app.globalData.url_open('/pages/plugins/friendpay/share/detail?id=' + id + '&type=' + this.list_type);
            },

            // 去分享
            share_event(e) {
                var id = e.currentTarget.dataset.id;
                app.globalData.url_open('/pages/plugins/friendpay/share/share?id=' + id);
            },
        },
    };
</script>
