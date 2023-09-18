<template>
    <view class="pr">
        <view v-if="(data_base || null) != null && (data_base.banner_images || null) != null" class="pa top-0 left-0 right-0">
            <image class="wh-auto dis-block border-radius-main" :src="data_base.banner_images" mode="widthFix" :data-value="data_base.url || ''" @tap="url_event"></image>
        </view>
        <view class="plugins-coupon-container">
            <scroll-view scroll-y class="coupon-content bg-white">
                <!-- 优惠劵列表 -->
                <view v-if="data_list.length > 0" class="flex-col">
                    <block v-for="(item, index) in data_list" :key="index">
                        <component-poupon-card :prop-data="item" :prop-status-type="item.status_type" :prop-status-operable-name="item.status_operable_name" :prop-index="index" propIsProgress @call-back="coupon_receive_event"></component-poupon-card>
                    </block>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </scroll-view>
        </view>
        <view class="popup-bottom pf bottom-0 left-0 right-0 bg-white">
            <view class="popup-btn tc">
                <navigator url="/pages/plugins/coupon/user/user" hover-class="none">我的优惠券</navigator>
            </view>
        </view>
    </view>
</template>
<script>
const app = getApp();
import componentNoData from "../../../../components/no-data/no-data";
import componentBottomLine from "../../../../components/bottom-line/bottom-line";
import componentPouponCard from "@/components/coupon-card/coupon-card.vue";

export default {
    data() {
        return {
            data_bottom_line_status: false,
            data_list_loding_status: 1,
            data_list_loding_msg: "",
            currency_symbol: app.globalData.data.currency_symbol,
            data_list: [],
            data_base: null,
            // 优惠劵领取
            temp_coupon_receive_index: null,
            temp_coupon_receive_value: null,
            // 自定义分享信息
            share_info: {},
        };
    },

    components: {
        componentNoData,
        componentBottomLine,
        componentPouponCard,
    },
    props: {},

    onShow() {
        // 数据加载
        this.init();

        // 初始化配置
        this.init_config();
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
                    currency_symbol: app.globalData.get_config("currency_symbol"),
                });
            } else {
                app.globalData.is_config(this, "init_config");
            }
        },

        // 获取数据
        init() {
            this.get_data_list();
        },

        // 获取数据
        get_data_list() {
            var self = this;
            uni.showLoading({
                title: "加载中...",
            });
            if (self.data_list.length <= 0) {
                self.setData({
                    data_list_loding_status: 1,
                });
            }
            uni.request({
                url: app.globalData.get_request_url("index", "index", "coupon"),
                method: "POST",
                data: {},
                dataType: "json",
                success: (res) => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        var data = res.data.data;
                        var status = (data.data || []).length > 0;
                        console.log(data.data);
                        this.setData({
                            data_base: data.base || null,
                            data_list: data.data || [],
                            data_list_loding_msg: "",
                            data_list_loding_status: status ? 3 : 0,
                            data_bottom_line_status: status,
                        });

                        if ((this.data_base || null) != null) {
                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.data_base.seo_title || this.data_base.application_name,
                                    desc: this.data_base.seo_desc,
                                    path: "/pages/plugins/coupon/index/index",
                                },
                            });

                            // 导航名称
                            if ((this.data_base.application_name || null) != null) {
                                uni.setNavigationBarTitle({
                                    title: this.data_base.application_name,
                                });
                            }
                        }
                    } else {
                        self.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: res.data.msg,
                        });
                        app.globalData.showToast(res.data.msg);
                    }

                    // 分享菜单处理
                    app.globalData.page_share_handle(this.share_info);
                },
                fail: () => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    self.setData({
                        data_bottom_line_status: false,
                        data_list_loding_status: 2,
                        data_list_loding_msg: "服务器请求出错",
                    });
                    app.globalData.showToast("服务器请求出错");
                },
            });
        },

        // 优惠劵领取事件
        coupon_receive_event(index, value) {
            if (!app.globalData.is_single_page_check()) {
                return false;
            }
            // 参数处理
            if ((index || null) == null && (value || null) == null) {
                var index = this.temp_coupon_receive_index;
                var value = this.temp_coupon_receive_value;
            } else {
                this.setData({
                    temp_coupon_receive_index: index,
                    temp_coupon_receive_value: value,
                });
            }

            // 登录校验
            var user = app.globalData.get_user_info(this, "coupon_receive_event");
            if (user != false) {
                // 用户未绑定用户则转到登录页面
                if (app.globalData.user_is_need_login(user)) {
                    uni.navigateTo({
                        url: "/pages/login/login?event_callback=coupon_receive_event",
                    });
                    return false;
                } else {
                    var temp_list = this.data_list;
                    if (temp_list[index]["is_operable"] != 0) {
                        uni.showLoading({
                            title: "处理中...",
                        });
                        uni.request({
                            url: app.globalData.get_request_url("receive", "coupon", "coupon"),
                            method: "POST",
                            data: {
                                coupon_id: value,
                            },
                            dataType: "json",
                            success: (res) => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    app.globalData.showToast(res.data.msg, "success");
                                    if (this.data_base != null && this.data_base.is_repeat_receive != 1) {
                                        temp_list[index]["is_operable"] = 0;
                                        temp_list[index]["is_operable_name"] = "已领取";
                                        this.setData({
                                            data_list: temp_list,
                                        });
                                    }
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, "coupon_receive_event")) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast("服务器请求出错");
                            },
                        });
                    }
                }
            }
        },

        // url事件
        url_event(e) {
            app.globalData.url_event(e);
        },
    },
};
</script>
<style scoped>
@import "./index.css";
</style>
