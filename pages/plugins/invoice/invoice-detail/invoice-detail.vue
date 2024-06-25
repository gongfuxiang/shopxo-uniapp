<template>
    <view :class="theme_view">
        <view v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('invoice-detail.invoice-detail.s70kj4')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view class="content fl br-l padding-left-main">{{ item.value }}</view>
                        </view>
                    </view>
                </view>

                <!-- 快递信息 -->
                <view v-if="detail.status == 2 && detail.invoice_type != 0 && express_data.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.0876xf')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in express_data" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view class="content fl br-l padding-left-main">{{ item.value }}</view>
                        </view>
                    </view>
                </view>

                <!-- 电子发票 -->
                <view v-if="detail.status == 2 && detail.invoice_type == 0 && (detail.electronic_invoice || null) != null" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('invoice-detail.invoice-detail.1s2f0g')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail.electronic_invoice" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="content fl" @tap="electronic_invoice_event" :data-value="item.url">{{ item.title }}</view>
                        </view>
                    </view>
                    <view class="br-t cr-red padding-top-main margin-top-main">{{$t('invoice-detail.invoice-detail.4tu3v3')}}</view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
const app = getApp();
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
            express_data: [],
        };
    },

    components: {
        componentNoData,
        componentBottomLine,
    },
    props: {},

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
                                { name: this.$t('invoice.invoice.l3832z'), value: data.data.business_type_name || "" },
                                { name: this.$t('invoice.invoice.hoenw8'), value: data.data.apply_type_name || "" },
                                { name: this.$t('invoice.invoice.j04kjc'), value: data.data.invoice_type_name || "" },
                                { name: this.$t('invoice.invoice.fvuc4p'), value: data.data.total_price || "" },
                                { name: this.$t('invoice-detail.invoice-detail.rrfex6'), value: data.data.status_name || "" },
                                { name: this.$t('invoice-detail.invoice-detail.p73963'), value: data.data.invoice_content || "" },
                                { name: this.$t('invoice.invoice.y724c7'), value: data.data.invoice_title || "" },
                                { name: this.$t('invoice-detail.invoice-detail.e5n838'), value: data.data.invoice_code || "" },
                                { name: this.$t('invoice-detail.invoice-detail.41qbu6'), value: data.data.invoice_bank || "" },
                                { name: this.$t('invoice-detail.invoice-detail.3a9459'), value: data.data.invoice_account || "" },
                                { name: this.$t('invoice-detail.invoice-detail.2g7t23'), value: data.data.invoice_tel || "" },
                                { name: this.$t('invoice-detail.invoice-detail.6k6sov'), value: data.data.invoice_address || "" },
                                { name: this.$t('invoice-detail.invoice-detail.7159m0'), value: data.data.name || "" },
                                { name: this.$t('invoice-detail.invoice-detail.f2222p'), value: data.data.tel || "" },
                                { name: this.$t('invoice-detail.invoice-detail.q8l3zj'), value: data.data.address || "" },
                                { name: this.$t('login.login.db1rf4'), value: data.data.email || "" },
                                { name: this.$t('invoice-detail.invoice-detail.rpdwd3'), value: data.data.refuse_reason || "" },
                                { name: this.$t('invoice-detail.invoice-detail.dt77rq'), value: data.data.user_note || "" },
                                { name: this.$t('user-order-detail.user-order-detail.h2c78h'), value: data.data.add_time || "" },
                                { name: this.$t('common.upd_time'), value: data.data.upd_time || "" },
                            ],
                            express_data: [
                                { name: this.$t('invoice-detail.invoice-detail.2000a0'), value: data.data.express_name || "" },
                                { name: this.$t('user-order-detail.user-order-detail.2byl8l'), value: data.data.express_number || "" },
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

        // 电子发票复制
        electronic_invoice_event(e) {
            app.globalData.text_copy_event(e);
        },
    },
};
</script>
<style></style>
