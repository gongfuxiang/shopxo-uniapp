<template>
    <view>
        <view v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="panel-content oh">
                        <view class="item br-b oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-gray">用户头像</view>
                            <view class="content fl br-l padding-left-main">
                                <image :src="detail.avatar" class="avatar dis-block circle fl" mode="widthFix" @tap="avatar_event" :data-value="detail.avatar"></image>
                            </view>
                        </view>
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-gray">{{item.name}}</view>
                            <view class="content fl br-l padding-left-main">{{item.value}}</view>
                        </view>
                    </view>
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
                detail_list: []
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

        onShow() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                uni.showLoading({
                    title: '加载中...'
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "order", "distribution"),
                    method: 'POST',
                    data: {
                        id: this.params.id
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                detail_list: [
                                    { name: "用户昵称", value: data.data.user_name_view || '' },
                                    { name: "订单金额", value: data.data.total_price + ' 元' || '' },
                                    { name: "退款金额", value: data.data.refund_price + ' 元' || '' },
                                    { name: "订单状态", value: data.data.order_status_name || '' },
                                    { name: "支付状态", value: data.data.order_pay_status_name || '' },
                                    { name: "来源终端", value: data.data.order_client_type_name || '' },
                                    { name: "下单时间", value: data.data.add_time_time || '' },
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
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 头像查看
            avatar_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value]
                    });
                } else {
                    app.globalData.showToast('头像地址有误');
                }
            }
        }
    };
</script>
<style>
    @import './order-detail.css';
</style>