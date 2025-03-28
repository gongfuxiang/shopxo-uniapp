<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view class="content fl br-l padding-left-main">{{ item.value }}</view>
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
                    url: app.globalData.get_request_url("detail", "cash", "wallet"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                detail_list: [
                                    { name: this.$t('user-cash-detail.user-cash-detail.e8a3e8'), value: data.data.cash_no || "" },
                                    { name: this.$t('user-cash-detail.user-cash-detail.wyad6w'), value: data.data.status_name || "" },
                                    { name: this.$t('cash-create.cash-create.qg404q'), value: data.data.money || "" },
                                    { name: this.$t('cash-create.cash-create.9ugssd'), value: data.data.commission || "" },
                                    { name: this.$t('cash-create.cash-create.yu2raf'), value: data.data.cash_type_name || "" },
                                    { name: this.$t('user-cash-detail.user-cash-detail.j5s3u6'), value: data.data.bank_name || "" },
                                    { name: this.$t('user-cash-detail.user-cash-detail.53k647'), value: data.data.bank_username || "" },
                                    { name: this.$t('user-cash-detail.user-cash-detail.m556tl'), value: data.data.bank_accounts || "" },
                                    { name: this.$t('user-cash-detail.user-cash-detail.i308o1'), value: data.data.pay_money <= 0 ? "" : data.data.pay_money || "" },
                                    { name: this.$t('user-cash-detail.user-cash-detail.451xxt'), value: data.data.pay_time || "" },
                                    { name: this.$t('common.note'), value: data.data.msg || "" },
                                    { name: this.$t('common.apply_time'), value: data.data.add_time || "" },
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
