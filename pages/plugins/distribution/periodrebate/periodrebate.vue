<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view v-if="nav_status_list.length > 0" class="nav-base bg-white scroll-view-horizontal">
            <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true">
                <block v-for="(item, index) in nav_status_list" :key="index">
                    <view :class="'item tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                </block>
            </scroll-view>
        </view>
        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                        <text class="cr-grey-9">{{ item.add_time }}</text>
                        <text :class="item.status == 2 ? 'cr-grey-c' : item.status == 1 ? 'cr-main' : 'cr-black'">{{ item.status_name }}</text>
                    </view>
                    <view class="content margin-top-main">
                        <component-panel-content :propData="item" :propDataField="field_list" propIsItemShowMax="6" propExcludeField="add_time,status_name" :propIsTerse="true"></component-panel-content>
                    </view>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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
    import componentPanelContent from '@/pages/common/components/panel-content/panel-content';
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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
                nav_status_list: [],
                nav_status_index: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init();

            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);

            // 分享菜单处理
            app.globalData.page_share_handle();
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
                }
            },

            // 获取数据
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
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 请求数据
                var data = {
                    page: this.data_page,
                };

                // 状态
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['id'];
                if (status != -1 && status !== '' && status != null) {
                    data['status'] = status;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'periodrebate', 'distribution'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var result = res.data.data || {};
                            var rows = result.data_list || [];
                            var page_total = result.page_total != null ? result.page_total : 0;
                            var total = result.data_total != null ? result.data_total : result.total != null ? result.total : 0;
                            var temp_data_list = [];
                            if (this.data_page <= 1) {
                                temp_data_list = rows;
                            } else {
                                temp_data_list = this.data_list || [];
                                for (var i in rows) {
                                    temp_data_list.push(rows[i]);
                                }
                            }
                            var nav_status_list = this.nav_status_list;
                            var nav_status_index = this.nav_status_index;
                            if (nav_status_list.length == 0 && (result.nav || null) != null) {
                                nav_status_list = result.nav;
                                if ((this.params || null) != null && (this.params.status || null) != null) {
                                    for (var n in nav_status_list) {
                                        if (nav_status_list[n]['id'] == this.params.status) {
                                            nav_status_index = n;
                                            break;
                                        }
                                    }
                                }
                            }
                            this.setData({
                                field_list: result.field_list || this.field_list || [],
                                nav_status_list: nav_status_list,
                                nav_status_index: nav_status_index,
                                data_list: temp_data_list,
                                data_total: total,
                                data_page_total: page_total,
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },
        },
    };
</script>
<style>
    @import './periodrebate.css';
</style>
