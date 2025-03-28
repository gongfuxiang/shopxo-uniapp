<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <!-- 申请信息 -->
            <component-panel-content :propData="detail" :propDataField="field_list" propExcludeField="express_name,express_number" :propTitle="$t('invoice-detail.invoice-detail.s70kj4')"></component-panel-content>

            <!-- 快递信息 -->
            <block v-if="detail.status == 2 && detail.invoice_type != 0">
                <component-panel-content :propData="detail" :propDataField="field_list" propAppointField="express_name,express_number" :propTitle="$t('user-order-detail.user-order-detail.0876xf')"></component-panel-content>
            </block>

            <!-- 电子发票 -->
            <block v-if="detail.status == 2 && detail.invoice_type == 0 && (detail.electronic_invoice || null) != null" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                <component-panel-content :propTitle="$t('invoice-detail.invoice-detail.1s2f0g')">
                    <view v-for="(item, index) in detail.electronic_invoice" :key="index" class="item br-b-f5 oh padding-vertical-main">
                        <view class="content fl" @tap="electronic_invoice_event" :data-value="item.url">{{ item.title }}</view>
                    </view>
                    <view class="cr-red padding-top-main">{{$t('invoice-detail.invoice-detail.4tu3v3')}}</view>
                </component-panel-content>
            </block>

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
    import componentPanelContent from "@/components/panel-content/panel-content";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                field_list: [],
                detail: null
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent
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
                    url: app.globalData.get_request_url("detail", "user", "invoice"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                field_list: data.field_list || [],
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

            // 电子发票复制
            electronic_invoice_event(e) {
                app.globalData.text_copy_event(e);
            },
        },
    };
</script>
<style></style>
