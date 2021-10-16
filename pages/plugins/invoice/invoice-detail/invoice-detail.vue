<template>
    <view>
        <view v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">申请信息</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-gray">{{item.name}}</view>
                            <view class="content fl br-l padding-left-main">{{item.value}}</view>
                        </view>
                    </view>
                </view>

                <!-- 快递信息 -->
                <view v-if="detail.status == 2 && detail.invoice_type != 0 && express_data.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">快递信息</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in express_data" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-gray">{{item.name}}</view>
                            <view class="content fl br-l padding-left-main">{{item.value}}</view>
                        </view>
                    </view>
                </view>

                <!-- 电子发票 -->
                <view v-if="detail.status == 2 && detail.invoice_type == 0 && (detail.electronic_invoice || null) != null" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">电子发票</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail.electronic_invoice" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="content fl" @tap="electronic_invoice_event" :data-value="item.url">{{item.title}}</view>
                        </view>
                    </view>
                    <view class="br-t cr-red padding-top-main margin-top-main">可点击发票名称复制后、到浏览器打开地址下载发票。</view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                detail: null,
                detail_list: [],
                express_data: []
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            //params['id'] = 1;
            this.setData({
                params: params
            });
            this.init();
        },

        onShow() {},

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "user", "invoice"),
                    method: "POST",
                    data: {
                        id: this.params.id
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                detail_list: [
                                    { name: "业务类型", value: data.data.business_type_name || '' },
                                    { name: "申请类型", value: data.data.apply_type_name || '' },
                                    { name: "发票类型", value: data.data.invoice_type_name || '' },
                                    { name: "发票金额", value: data.data.total_price || '' },
                                    { name: "状态", value: data.data.status_name || '' },
                                    { name: "发票内容", value: data.data.invoice_content || '' },
                                    { name: "发票抬头", value: data.data.invoice_title || '' },
                                    { name: "纳税识别号", value: data.data.invoice_code || '' },
                                    { name: "企业开户行名称", value: data.data.invoice_bank || '' },
                                    { name: "企业开户帐号", value: data.data.invoice_account || '' },
                                    { name: "企业联系电话", value: data.data.invoice_tel || '' },
                                    { name: "企业注册地址", value: data.data.invoice_address || '' },
                                    { name: "收件人姓名", value: data.data.name || '' },
                                    { name: "收件人电话", value: data.data.tel || '' },
                                    { name: "收件人地址", value: data.data.address || '' },
                                    { name: "电子邮箱", value: data.data.email || '' },
                                    { name: "拒绝原因", value: data.data.refuse_reason || '' },
                                    { name: "用户备注", value: data.data.user_note || '' },
                                    { name: "创建时间", value: data.data.add_time || '' },
                                    { name: "更新时间", value: data.data.upd_time || '' },
                                ],
                                express_data: [
                                    { name: "快递名称", value: data.data.express_name || '' },
                                    { name: "快递单号", value: data.data.express_number || '' },
                                ],
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: ''
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 电子发票复制
            electronic_invoice_event(e) {
                app.globalData.text_copy_event(e);
            }
        }
    };
</script>
<style>
</style>