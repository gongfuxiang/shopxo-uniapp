<template>
    <view>
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_tabs_list" :key="index">
                <view :class="'item fl tc cr-gray ' + (item.value == nav_tabs_value ? 'cr-main' : '')" :data-index="index" :data-value="item.value" @tap="nav_tabs_event">{{item.name}}</view>
            </block>
        </view>
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" lower-threshold="30">
            <!-- 优惠劵列表 -->
            <view v-if="data_list != null" class="plugins-coupon-container padding-horizontal-main padding-top-main">
                <!-- 未使用 -->
                <block v-if="(data_list.not_use || null) != null && data_list.not_use.length > 0 && nav_tabs_value == 'not_use'">
                    <block v-for="(item, index) in data_list.not_use" :key="index">
                        <view class="item spacing-mb bg-white border-radius-main">
                            <view class="v-left fl">
                                <view class="base single-text" :style="'color:' + item.coupon.bg_color_value + ';'">
                                    <text v-if="item.coupon.type == 0" class="symbol">{{currency_symbol}}</text>
                                    <text class="price">{{item.coupon.discount_value}}</text>
                                    <text class="unit">{{item.coupon.type_unit}}</text>
                                    <text v-if="(item.coupon.desc || null) != null" class="desc cr-gray">{{item.coupon.desc}}</text>
                                </view>
                                <view v-if="(item.coupon.use_limit_type_name || null) != null" class="base-tips cr-base single-text">{{item.coupon.use_limit_type_name}}</view>
                                <view class="base-time cr-gray single-text">{{item.time_start}} 至{{item.time_end}}</view>
                            </view>
                            <navigator :url="home_page_url" open-type="switchTab" hover-class="none">
                                <view class="v-right fr" :style="'background:' + item.coupon.bg_color_value + ';'">
                                    <text class="circle"></text>
                                    <text>去使用</text>
                                </view>
                            </navigator>
                        </view>
                    </block>
                </block>

                <!-- 已使用 -->
                <block v-if="(data_list.already_use || null) != null && data_list.already_use.length > 0 && nav_tabs_value == 'already_use'">
                    <block v-for="(item, index) in data_list.already_use" :key="index">
                        <view class="item spacing-mb bg-white border-radius-main item-disabled">
                            <view class="v-left fl">
                                <view class="base single-text">
                                    <text v-if="item.coupon.type == 0" class="symbol">{{currency_symbol}}</text>
                                    <text class="price">{{item.coupon.discount_value}}</text>
                                    <text class="unit">{{item.coupon.type_unit}}</text>
                                    <text v-if="(item.coupon.desc || null) != null" class="desc cr-gray">{{item.coupon.desc}}</text>
                                </view>
                                <view v-if="(item.coupon.use_limit_type_name || null) != null" class="base-tips cr-base single-text">{{item.coupon.use_limit_type_name}}</view>
                                <view class="base-time cr-gray single-text">使用 {{item.use_time_time}}</view>
                            </view>
                            <view class="v-right fr">
                                <text class="circle"></text>
                                <text>已使用</text>
                            </view>
                        </view>
                    </block>
                </block>

                <!-- 已过期 -->
                <block v-if="(data_list.already_expire || null) != null && data_list.already_expire.length > 0 && nav_tabs_value == 'already_expire'">
                    <block v-for="(item, index) in data_list.already_expire" :key="index">
                        <view class="item spacing-mt bg-white border-radius-main item-disabled">
                            <view class="v-left fl">
                                <view class="base single-text">
                                    <text v-if="item.coupon.type == 0" class="symbol">{{currency_symbol}}</text>
                                    <text class="price">{{item.coupon.discount_value}}</text>
                                    <text class="unit">{{item.coupon.type_unit}}</text>
                                    <text v-if="(item.coupon.desc || null) != null" class="desc cr-gray">{{item.coupon.desc}}</text>
                                </view>
                                <view v-if="(item.coupon.use_limit_type_name || null) != null" class="base-tips cr-base single-text">{{item.coupon.use_limit_type_name}}</view>
                                <view class="base-time cr-gray single-text">过期 {{item.time_end}}</view>
                            </view>
                            <view class="v-right fr">
                                <text class="circle"></text>
                                <text>已过期</text>
                            </view>
                        </view>
                    </block>
                </block>
            </view>
            
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_list: null,
                nav_tabs_list: [
                    { name: "未使用", value: "not_use" },
                    { name: "已使用", value: "already_use" },
                    { name: "已过期", value: "already_expire" },
                ],
                nav_tabs_value: 'not_use',
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                // 首页地址
                home_page_url: app.globalData.data.tabbar_pages[0]
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onShow() {
            // 数据加载
            this.init();
            
            // 初始化配置
            this.init_config();
            
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data_list();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false
                    });
                }
            },

            // 获取数据
            get_data_list() {
                var self = this;
                uni.showLoading({
                    title: '加载中...'
                });
                if (this.data_list == null || (this.data_list[this.nav_tabs_value] || null) == null || this.data_list[this.nav_tabs_value].length <= 0) {
                    this.setData({
                        data_list_loding_status: 1
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url("index", "coupon", "coupon"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            self.setData({
                                data_list: res.data.data || null,
                                data_list_loding_msg: ''
                            });
                            self.data_view_handle();
                        } else {
                            self.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, self, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 数据处理
            data_view_handle() {
                var status = 0;
                if (this.data_list != null && (this.data_list[this.nav_tabs_value] || null) != null && this.data_list[this.nav_tabs_value].length > 0) {
                    status = 3;
                }
                this.setData({
                    data_list_loding_status: status,
                    data_bottom_line_status: status == 3
                });
            },

            // 导航事件
            nav_tabs_event(e) {
                this.setData({
                    nav_tabs_value: e.currentTarget.dataset.value
                });
                this.data_view_handle();
            }
        }
    };
</script>
<style>
    @import './user.css';
</style>