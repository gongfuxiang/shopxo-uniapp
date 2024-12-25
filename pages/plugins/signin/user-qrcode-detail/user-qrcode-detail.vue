<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('order-detail.order-detail.9er1pc')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view class="content fl br-l padding-left-main">{{ item.value }}</view>
                        </view>
                    </view>
                </view>

                <!-- 连续签到翻倍奖励 -->
                <view v-if="(detail.continuous_rules || null) != null && detail.continuous_rules.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-qrcode-detail.user-qrcode-detail.18680z')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail.continuous_rules" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="content fl">{{$t('user-qrcode-detail.user-qrcode-detail.dupsnc')}}{{ item.number }}{{$t('user-qrcode-detail.user-qrcode-detail.b5ilz3')}}{{ item.value }}{{$t('user-qrcode-detail.user-qrcode-detail.c8e5of')}}</view>
                        </view>
                    </view>
                </view>

                <!-- 指定时段额外奖励 -->
                <view
                    v-if="(detail.specified_time_reward || null) != null && (detail.specified_time_reward.time_start || null) != null && (detail.specified_time_reward.time_end || null) != null && (detail.specified_time_reward.value || null) != null"
                    class="panel-item padding-main border-radius-main bg-white spacing-mb"
                >
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-qrcode-detail.user-qrcode-detail.37bh73')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail.specified_time_reward" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="content fl">{{$t('user-qrcode-detail.user-qrcode-detail.6l7r99')}}{{ detail.specified_time_reward.time_start }}{{$t('user-qrcode-detail.user-qrcode-detail.22zc5y')}}{{ detail.specified_time_reward.value }}</view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                detail: null,
                detail_list: [],
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "userqrcode", "signin"),
                    method: "POST",
                    data: {
                        id: this.params.id,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                detail_list: [
                                    { name: this.$t('form.form.043a10'), value: data.data.is_enable_name || "" },
                                    { name: this.$t('user-qrcode-detail.user-qrcode-detail.mjfygy'), value: (data.data.reward_master || 0) + this.$t('index.index.t26j9z') },
                                    { name: this.$t('user-qrcode-detail.user-qrcode-detail.pb2e32'), value: (data.data.reward_invitee || 0) + this.$t('index.index.t26j9z') },
                                    { name: this.$t('user-qrcode-detail.user-qrcode-detail.do23j6'), value: data.data.name || "" },
                                    { name: this.$t('user-qrcode-detail.user-qrcode-detail.5k2ibd'), value: data.data.tel || "" },
                                    { name: this.$t('user-qrcode-detail.user-qrcode-detail.911a61'), value: data.data.address || "" },
                                    { name: this.$t('common.note'), value: data.data.note || "" },
                                    { name: this.$t('user-order-detail.user-order-detail.h2c78h'), value: data.data.add_time || "" },
                                    { name: this.$t('common.upd_time'), value: data.data.upd_time || "" },
                                ],
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: "",
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "init")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style></style>
