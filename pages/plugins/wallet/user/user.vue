<template>
    <view>
        <view v-if="(data_base || null) != null">
            <!-- 钱包信息 -->
            <view class="padding-main">
                <view class="padding-main border-radius-main bg-white pr">
                    <view class="item oh">
                        <view class="fl cr-base">有效</view>
                        <view class="fl cr-main fw-b single-text margin-left-sm margin-right-sm">{{ user_wallet.normal_money || "0.00" }}</view>
                        <view class="fl cr-grey unit">元</view>
                    </view>
                    <view class="item oh margin-top-sm">
                        <view class="fl cr-base">冻结</view>
                        <view class="fl cr-red fw-b single-text margin-left-sm margin-right-sm">{{ user_wallet.frozen_money || "0.00" }}</view>
                        <view class="fl cr-grey unit">元</view>
                    </view>
                    <view class="item oh margin-top-sm">
                        <view class="fl cr-base">赠送</view>
                        <view class="fl cr-base fw-b single-text margin-left-sm margin-right-sm">{{ user_wallet.give_money || "0.00" }}</view>
                        <view class="fl cr-grey unit">元</view>
                    </view>
                    <view class="submit-container pa oh">
                        <navigator v-if="(data_base || null) != null && (data_base.is_enable_recharge || 0) == 1" class="dis-inline" url="/pages/plugins/wallet/recharge/recharge" hover-class="none">
                            <button class="round cr-white bg-green br-green text-size-sm fl" size="mini" type="default" hover-class="none">充值</button>
                        </navigator>
                        <navigator v-if="(data_base || null) != null && (data_base.is_enable_cash || 0) == 1" class="dis-inline" url="/pages/plugins/wallet/cash-auth/cash-auth" hover-class="none">
                            <button class="round cr-white bg-main br-main text-size-sm fl margin-left-lg" size="mini" type="default" hover-class="none">提现</button>
                        </navigator>
                    </view>
                </view>
            </view>

            <!-- 导航 -->
            <view v-if="nav_list.length > 0" class="nav oh">
                <block v-for="(item, index) in nav_list" :key="index">
                    <view class="item fl tc padding-main border-radius-main bg-white">
                        <navigator :url="item.url" hover-class="none">
                            <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
                            <view class="tc cr-base margin-top-lg">{{ item.title }}</view>
                        </navigator>
                    </view>
                </block>
            </view>

            <!-- 通知 -->
            <view v-if="(data_base.user_center_notice || null) != null && data_base.user_center_notice.length > 0" class="padding-horizontal-main padding-bottom-main">
                <view class="notice-content">
                    <view v-for="(item, index) in data_base.user_center_notice" :key="index" class="item">{{ item }}</view>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
const app = getApp();
import componentNoData from "../../../../components/no-data/no-data";

export default {
    data() {
        return {
            data_bottom_line_status: false,
            data_list_loding_status: 1,
            data_list_loding_msg: "",
            data_base: null,
            user_wallet: null,
            nav_list: [],
            submit_disabled_status: false,
        };
    },

    components: {
        componentNoData,
    },
    props: {},

    onLoad(params) {},

    onShow() {
        this.init();

        // 分享菜单处理
        app.globalData.page_share_handle();
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.get_data();
    },

    methods: {
        init(e) {
            var user = app.globalData.get_user_info(this, "init");
            if (user != false) {
                // 用户未绑定用户则转到登录页面
                if (app.globalData.user_is_need_login(user)) {
                    uni.showModal({
                        title: "温馨提示",
                        content: "绑定手机号码",
                        confirmText: "确认",
                        cancelText: "暂不",
                        success: (result) => {
                            uni.stopPullDownRefresh();
                            if (result.confirm) {
                                uni.navigateTo({
                                    url: "/pages/login/login?event_callback=init",
                                });
                            }
                        },
                    });
                } else {
                    this.get_data();
                }
            }
        },

        // 获取数据
        get_data() {
            uni.request({
                url: app.globalData.get_request_url("index", "user", "wallet"),
                method: "POST",
                data: {},
                dataType: "json",
                success: (res) => {
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        var data = res.data.data;
                        this.setData({
                            data_base: data.base || null,
                            user_wallet: data.user_wallet || null,
                            nav_list: data.nav_list || [],
                            data_list_loding_msg: "",
                            data_list_loding_status: 0,
                            data_bottom_line_status: false,
                        });
                    } else {
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: res.data.msg,
                        });
                        if (app.globalData.is_login_check(res.data, this, "get_data")) {
                            app.globalData.showToast(res.data.msg);
                        }
                    }
                },
                fail: () => {
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_bottom_line_status: false,
                        data_list_loding_status: 2,
                        data_list_loding_msg: "服务器请求出错",
                    });
                    app.globalData.showToast("服务器请求出错");
                },
            });
        },
    },
};
</script>
<style>
@import "./user.css";
</style>
