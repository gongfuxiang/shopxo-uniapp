<template>
    <view :class="theme_view">
        <view v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 地址 -->
                <view v-if="(detail.address_data || null) != null" class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="address-base oh">
                        <text v-if="(detail.address_data.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{ detail.address_data.alias }}</text>
                        <text data-event="copy" :data-value="detail.address_data.name" @tap="text_event">{{ detail.address_data.name }}</text>
                        <text class="fr" data-event="tel" :data-value="detail.address_data.tel" @tap="text_event">{{ detail.address_data.tel }}</text>
                    </view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url + 'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text data-event="copy" :data-value="detail.address_data.province_name + detail.address_data.city_name + detail.address_data.county_name + detail.address_data.address" @tap="text_event"
                                >{{ detail.address_data.province_name }}{{ detail.address_data.city_name }}{{ detail.address_data.county_name }}{{ detail.address_data.address }}</text
                            >
                        </view>
                    </view>
                    <view class="address-divider spacing-mb"></view>
                </view>

                <!-- 基础信息 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">基础信息</view>
                    <view class="panel-content oh">
                        <view class="item br-b oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">用户头像</view>
                            <view class="content fl br-l padding-left-main">
                                <image :src="detail.avatar" class="avatar dis-block circle fl" mode="widthFix" @tap="avatar_event" :data-value="detail.avatar"></image>
                            </view>
                        </view>
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view class="content fl br-l padding-left-main">{{ item.value }}</view>
                        </view>
                    </view>
                </view>

                <!-- 商品列表 -->
                <view v-if="detail.items.length > 0" class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">商品信息</view>
                    <view v-for="(item, index) in detail.items" :key="index" class="goods-item br-b-dashed oh padding-main">
                        <navigator :url="item.goods_url" hover-class="none">
                            <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{ item.title }}</view>
                                <view v-if="item.spec != null" class="margin-top-sm">
                                    <block v-for="(sv, si) in item.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-grey">{{ sv.value }}</text>
                                    </block>
                                </view>
                                <view class="margin-top-sm">
                                    <text class="fw-b">{{ detail.currency_data.currency_symbol }}{{ item.price }}</text>
                                    <text class="margin-left-sm">x{{ item.buy_number }}</text>
                                </view>
                                <view v-if="detail.is_can_launch_aftersale == 1 && (item.orderaftersale_btn_text || null) != null" class="orderaftersale-btn-text cr-blue pa bg-white" @tap.stop="orderaftersale_event" :data-oid="detail.id" :data-did="item.id">{{ item.orderaftersale_btn_text }}</view>
                            </view>
                        </navigator>
                    </view>
                    <view class="padding-top-main tr cr-base text-size">
                        <text
                            >共<text class="fw-b">{{ detail.buy_number_count }}</text
                            >件 合计 <text class="sales-price margin-right-xs">{{ detail.currency_data.currency_symbol }}{{ detail.total_price }}</text
                            >元</text
                        >
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

var common_static_url = app.globalData.get_static_url("common");
export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view(),
            common_static_url: common_static_url,
            params: null,
            data_list_loding_status: 1,
            data_list_loding_msg: "",
            data_bottom_line_status: false,
            detail: null,
            detail_list: [],
        };
    },

    components: {
        componentNoData,
        componentBottomLine,
    },
    props: {},

    onLoad(params) {
        //params['id'] = 1;
        this.setData({
            params: params,
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
                title: "加载中...",
            });
            this.setData({
                data_list_loding_status: 1,
            });
            uni.request({
                url: app.globalData.get_request_url("detail", "order", "distribution"),
                method: "POST",
                data: {
                    id: this.params.id,
                },
                dataType: "json",
                success: (res) => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        var data = res.data.data;
                        this.setData({
                            detail: data.data,
                            detail_list: [
                                { name: "用户昵称", value: data.data.user_name_view || "" },
                                { name: "订单号", value: data.data.order_no || "" },
                                { name: "订单金额", value: data.data.total_price + " 元" || "" },
                                { name: "退款金额", value: data.data.refund_price + " 元" || "" },
                                { name: "订单状态", value: data.data.order_status_name || "" },
                                { name: "支付状态", value: data.data.order_pay_status_name || "" },
                                { name: "来源终端", value: data.data.order_client_type_name || "" },
                                { name: "商品数量", value: data.data.buy_number_count || "" },
                                { name: "下单时间", value: data.data.add_time || "" },
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
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_list_loding_status: 2,
                        data_bottom_line_status: false,
                        data_list_loding_msg: "网络开小差了哦~",
                    });
                    app.globalData.showToast("网络开小差了哦~");
                },
            });
        },

        // 头像查看
        avatar_event(e) {
            var value = e.currentTarget.dataset.value || null;
            if (value != null) {
                uni.previewImage({
                    current: value,
                    urls: [value],
                });
            } else {
                app.globalData.showToast("头像地址有误");
            }
        },

        // 文本事件
        text_event(e) {
            app.globalData.text_event_handle(e);
        },
    },
};
</script>
<style>
@import "./order-detail.css";
</style>
