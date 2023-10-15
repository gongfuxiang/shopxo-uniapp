<template>
    <view>
        <view v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 地址 -->
                <view v-if="(detail.address_data || null) != null" class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="address-base oh">
                        <text v-if="(detail.address_data.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{detail.address_data.alias}}</text>
                        <text data-event="copy" :data-value="detail.address_data.name" @tap="text_event">{{detail.address_data.name}}</text>
                        <text class="fr" data-event="tel" :data-value="detail.address_data.tel" @tap="text_event">{{detail.address_data.tel}}</text>
                    </view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url+'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text data-event="copy" :data-value="detail.address_data.address_info" @tap="text_event">{{detail.address_data.address_info}}</text>
                            <text v-if="(detail.address_data.lng || 0) != 0 && (detail.address_data.lat || 0) != 0" class="address-map-submit cr-base br round bg-white margin-left-sm text-size-xs" @tap="address_map_event">查看位置</text>
                        </view>
                    </view>
                    <view class="address-divider spacing-mb"></view>
                </view>

                <!-- 基础信息 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">基础信息</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-gray">{{item.name}}</view>
                            <view class="content fl br-l padding-left-main">
                                <block v-if="(item.type || null) == 'images-list'">
                                    <view v-if="(item.value || null) != null && item.value.length > 0" class="images-list">
                                        <block v-for="(iv, ii) in item.value" :key="ii">
                                            <image class="item-images radius fl dis-block br padding-xs" :src="iv" mode="aspectFit" :data-ii="ii" @tap="images_list_event"></image>
                                        </block>
                                    </view>
                                </block>
                                <block v-else>
                                    <block v-if="(item.event || null) == null">
                                        <text>{{item.value}}</text>
                                    </block>
                                    <block v-else>
                                        <view data-event="copy" :data-value="item.value" @tap="text_event">{{item.value}}</view>
                                    </block>
                                </block>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 商品列表 -->
                <view v-if="detail.goods_data.length > 0" class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">商品信息</view>
                    <view v-for="(item, index) in detail.goods_data" :key="index" class="goods-item br-b-dashed oh padding-main">
                        <navigator :url="item.goods_url" hover-class="none">
                            <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{item.title}}</view>
                                <view v-if="item.spec != null" class="margin-top-sm">
                                    <block v-for="(sv, si) in item.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-gray">{{sv.value}}</text>
                                    </block>
                                </view>
                                <view class="margin-top-sm">
                                    <text class="fw-b">{{detail.currency_data.currency_symbol}}{{item.price}}</text>
                                    <text class="margin-left-sm">x{{item.buy_number}}</text>
                                </view>
                                <view v-if="detail.is_can_launch_aftersale == 1 && (item.orderaftersale_btn_text || null) != null" class="orderaftersale-btn-text cr-blue pa bg-white" @tap.stop="orderaftersale_event" :data-oid="detail.id" :data-did="item.id">{{item.orderaftersale_btn_text}}</view>
                            </view>
                        </navigator>
                    </view>
                    <view class="padding-top-main tr cr-base text-size">
                        <text>共<text class="fw-b">{{detail.buy_number_count}}</text>件 合计 <text class="sales-price margin-right-xs">{{detail.currency_data.currency_symbol}}{{detail.total_price}}</text>元</text>
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

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
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
                    url: app.globalData.get_request_url("detail", "order", "delivery"),
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
                                    { name: "订单号", value: data.data.main_order_no || '', event: 'copy' },
                                    { name: "订单金额", value: data.data.total_price + ' 元' || '' },
                                    { name: "退款金额", value: data.data.refund_price + ' 元' || '' },
                                    { name: "订单状态", value: data.data.main_status_name || '' },
                                    { name: "商品数量", value: data.data.buy_number_count || '' },
                                    { name: "配送状态", value: data.data.status_name || '' },
                                    { name: "配送时间", value: data.data.start_delivery_time || '' },
                                    { name: "完成时间", value: data.data.success_delivery_time || '' },
                                    { name: "完成描述", value: data.data.success_delivery_msg || '' },
                                    { name: "完成照片", value: data.data.success_delivery_images || '', type: 'images-list' },
                                    { name: "异常时间", value: data.data.abnormal_delivery_time || '' },
                                    { name: "异常原因", value: data.data.reason || '' },
                                    { name: "派单时间", value: data.data.add_time || '' },
                                    { name: "更新时间", value: data.data.upd_time || '' },
                                    { name: "订单时间", value: data.data.order_add_time || '' },
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

            // 图片列表查看
            images_list_event(e) {
                var ii = e.currentTarget.dataset.ii;
                uni.previewImage({
                    current: this.detail.success_delivery_images[ii],
                    urls: this.detail.success_delivery_images
                });
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            },

            // 地图查看
            address_map_event(e) {
                if ((this.detail.address_data || null) == null) {
                    app.globalData.showToast("地址有误");
                    return false;
                }
                
                // 打开地图
                var data = this.detail.address_data;
                var name = data.alias || data.name || '';
                app.globalData.open_location(data.lng, data.lat, name, data.address_info);
            }
        }
    };
</script>
<style>
    @import './order-detail.css';
</style>