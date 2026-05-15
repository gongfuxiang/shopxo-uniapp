<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" :class="'scroll-box-ece-nav ' + ((data_base || null) != null && (data_base.signin_desc || null) != null && data_base.signin_desc.length > 0 ? 'top-notice' : '')" lower-threshold="60">
            <view class="data-list" :class="(data_base || null) != null && (data_base.is_team || 0) == 1 ? 'page-bottom-fixed' : ''">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                            <text class="cr-grey-9">{{ item.add_time }}</text>
                            <text class="cr-black">{{ item.is_enable_name }}</text>
                        </view>
                        <view :data-value="'/pages/plugins/signin/user-qrcode-detail/user-qrcode-detail?id=' + item.id" @tap="url_event" class="content margin-top cp">
                            <component-panel-content
                                :propData="item"
                                :propDataField="field_list"
                                propIsItemShowMax="8"
                                propExcludeField="id,add_time,is_enable_name"
                                :propIsTerse="true"
                            ></component-panel-content>
                        </view>
                        <view class="item-operation tr margin-top-main">
                            <button class="round bg-white br-grey-9 text-size-md" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/signin/detail/detail?id='+item.id" @tap="url_event">{{ $t('detail.detail.y2217b') }}</button>
                            <button v-if="(data_base.is_team_show_coming_user || 0) == 1" class="round bg-white cr-main br-main text-size-md" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/signin/user-coming-list/user-coming-list?id='+item.id" @tap="url_event">{{ $t('login.login.1i4o86') }}</button>
                            <button class="round bg-white cr-main br-main text-size-md" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo?id='+item.id" @tap="url_event">{{ $t('common.edit') }}</button>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status"></component-no-data>
                    <!-- 组队 -->
                    <view v-if="(data_base || null) != null && (data_base.is_team || 0) == 1" class="bottom-fixed">
                        <view class="bottom-line-exclude">
                            <button class="item cr-white bg-main br-main text-size auto round" type="default" hover-class="none" data-value="/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo" @tap="url_event">{{ $t('user-qrcode.user-qrcode.8p57v3') }}</button>
                        </view>
                    </view>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPanelContent from '@/components/panel-content/panel-content';

    export default {
        props: {
            propPullDownRefresh: {
                type: Boolean,
                default: false,
            },
            propScrollLower: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                data_base: null,
                data_list: [],
                field_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentPanelContent,
        },
        created() {
            this.init();
        },
        mounted() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },
        watch: {
            propPullDownRefresh(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        data_page: 1,
                    });
                    this.get_data_list(1);
                }
            },
            propScrollLower(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.get_data_list();
                }
            },
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

            // 获取数据（与发票列表一致：field_list + data_list 来自动态表单）
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
                    url: app.globalData.get_request_url('index', 'userqrcode', 'signin'),
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
                                data_base: data.base || null,
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

            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style scoped>
    .scroll-box-ece-nav.top-notice {
        height: calc(100vh - 154rpx);
    }
</style>
