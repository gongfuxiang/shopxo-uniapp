<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_tabs_list" :key="index">
                <view :class="'item fl tc cr-grey ' + (item.value == nav_tabs_value ? 'cr-main nav-active-line' : '')" :data-index="index" :data-value="item.value" @tap="nav_tabs_event">{{ item.name }} </view>
            </block>
        </view>
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" lower-threshold="60">
            <!-- 优惠劵列表 -->
            <view v-if="data_list != null" class="plugins-coupon-container padding-top-main">
                <!-- 未使用 -->
                <block v-if="(data_list.not_use || null) != null && data_list.not_use.length > 0 && nav_tabs_value == 'not_use'">
                    <block v-for="(item, index) in data_list.not_use" :key="index">
                        <component-coupon-card :propData="item.coupon" :propStartTime="item.time_start_show_text" :propEndTime="item.time_end_show_text" :propStatusType="item.status_type" :propStatusOperableName="item.status_operable_name" propBg="#f5f5f5"></component-coupon-card>
                    </block>
                </block>

                <!-- 已使用 -->
                <block v-if="(data_list.already_use || null) != null && data_list.already_use.length > 0 && nav_tabs_value == 'already_use'">
                    <block v-for="(item, index) in data_list.already_use" :key="index">
                        <component-coupon-card :propData="item.coupon" :propStartTime="item.time_start_show_text" :propEndTime="item.time_end_show_text" :propStatusType="item.status_type" :propStatusOperableName="item.status_operable_name" propBg="#f5f5f5"></component-coupon-card>
                    </block>
                </block>

                <!-- 已过期 -->
                <block v-if="(data_list.already_expire || null) != null && data_list.already_expire.length > 0 && nav_tabs_value == 'already_expire'">
                    <block v-for="(item, index) in data_list.already_expire" :key="index">
                        <component-coupon-card :propData="item.coupon" :propStartTime="item.time_start_show_text" :propEndTime="item.time_end_show_text" :propStatusType="item.status_type" :propStatusOperableName="item.status_operable_name" propBg="#f5f5f5"></component-coupon-card>
                    </block>
                </block>
            </view>

            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" :propUrl="coupon_static_url + 'no-data.png'"></component-no-data>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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
    import componentCouponCard from '@/pages/plugins/coupon/components/coupon-card/coupon-card';
    const coupon_static_url = app.globalData.get_static_url('coupon', true);

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                coupon_static_url: coupon_static_url + 'app/',
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_list: null,
                nav_tabs_list: [
                    {
                        name: this.$t('user.user.s3y4ji'),
                        value: 'not_use',
                    },
                    {
                        name: this.$t('user.user.pggs6s'),
                        value: 'already_use',
                    },
                    {
                        name: this.$t('user.user.528t26'),
                        value: 'already_expire',
                    },
                ],
                nav_tabs_value: 'not_use',
                // 首页地址
                home_page_url: app.globalData.app_tabbar_pages()[0],
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentCouponCard,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },

        methods: {
            // 获取数据
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

            // 获取数据
            get_data_list() {
                if (this.data_list == null || (this.data_list[this.nav_tabs_value] || null) == null || this.data_list[this.nav_tabs_value].length <= 0) {
                    this.setData({
                        data_list_loding_status: 1,
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'coupon', 'coupon'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            this.setData({
                                data_list: res.data.data || null,
                                data_list_loding_msg: this.$t('user.user.3ks1wi'),
                            });
                            this.data_view_handle();
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 数据处理
            data_view_handle() {
                if(this.data_list_loding_status != 2) {
                    var status = 0;
                    if (this.data_list != null && (this.data_list[this.nav_tabs_value] || null) != null && this.data_list[this.nav_tabs_value].length > 0) {
                        status = 3;
                    }
                    this.setData({
                        data_list_loding_status: status,
                        data_bottom_line_status: status == 3,
                    });
                }
            },

            // 导航事件
            nav_tabs_event(e) {
                this.setData({
                    nav_tabs_value: e.currentTarget.dataset.value,
                });
                this.data_view_handle();
            },
        },
    };
</script>
<style>
    @import './user.css';
</style>
