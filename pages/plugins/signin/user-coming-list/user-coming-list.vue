<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view class="data-list">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view v-if="(item.user || null) != null" class="base oh br-b padding-bottom-main">
                            <image
                                v-if="(item.user.avatar || null) != null && item.user.avatar != ''"
                                :src="item.user.avatar"
                                class="avatar va-m circle"
                                mode="widthFix"
                                @tap="avatar_event"
                                :data-value="item.user.avatar"
                            />
                            <text class="cr-grey margin-left-sm va-m">{{ item.user.user_name_view || '' }}</text>
                        </view>
                        <view class="content margin-top">
                            <component-panel-content
                                :propData="item"
                                :propDataField="field_list"
                                propIsItemShowMax="8"
                                propExcludeField=""
                                :propIsTerse="true"
                            ></component-panel-content>
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
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPanelContent from '@/components/panel-content/panel-content';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                data_list: [],
                field_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent,
        },

        onLoad(params) {
            app.globalData.page_event_onload_handle(params);

            this.setData({
                params: params,
            });
            this.init();
        },

        onShow() {
            app.globalData.page_event_onshow_handle();

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
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data_list();
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
                    url: app.globalData.get_request_url('index', 'usercoming', 'signin'),
                    method: 'POST',
                    data: {
                        id: this.params.id || 0,
                        page: this.data_page,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var rows = data.data_list || data.data || [];
                            var page_total = data.page_total != null ? data.page_total : 0;
                            var total = data.data_total != null ? data.data_total : data.total != null ? data.total : 0;

                            if (this.data_page <= 1) {
                                var temp_data_list = rows;
                            } else {
                                var temp_data_list = this.data_list || [];
                                for (var i in rows) {
                                    temp_data_list.push(rows[i]);
                                }
                            }

                            this.setData({
                                field_list: data.field_list || [],
                                data_list: temp_data_list,
                                data_total: total,
                                data_page_total: page_total,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
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
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            scroll_lower(e) {
                this.get_data_list();
            },

            avatar_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value],
                    });
                } else {
                    app.globalData.showToast(this.$t('order.order.p3scy0'));
                }
            },
        },
    };
</script>
<style>
    @import './user-coming-list.css';
</style>
