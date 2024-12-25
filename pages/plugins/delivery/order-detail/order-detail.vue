<template>
    <view :class="theme_view">
        <view v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 发货地址 -->
                <view v-if="(detail.warehouse_address || null) != null" class="bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-sm fw-b text-size">{{$t('order.order.jhgfd1')}}</view>
                    <view class="address-base oh margin-top-sm">
                        <text v-if="(detail.warehouse_address.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{detail.warehouse_address.alias}}</text>
                        <text data-event="copy" :data-value="detail.warehouse_address.name" @tap="text_event">{{detail.warehouse_address.name}}</text>
                        <text class="fr" data-event="tel" :data-value="detail.warehouse_address.tel" @tap="text_event">{{detail.warehouse_address.tel}}</text>
                    </view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url+'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text data-event="copy" :data-value="detail.warehouse_address.address_info" @tap="text_event">{{detail.warehouse_address.address_info}}</text>
                            <text v-if="(detail.warehouse_address.lng || 0) != 0 && (detail.warehouse_address.lat || 0) != 0" class="address-map-submit cr-base br round bg-white margin-left-sm text-size-xs" @tap="address_map_event">{{$t('user-order-detail.user-order-detail.7lp6gw')}}</text>
                        </view>
                    </view>
                    <view class="address-divider margin-bottom-sm"></view>
                </view>
                
                <!-- 收货地址 -->
                <view v-if="(detail.user_address || null) != null" class="bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-sm fw-b text-size">{{$t('order.order.hbvwq4')}}</view>
                    <view class="address-base oh margin-top-sm">
                        <text v-if="(detail.user_address.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{detail.user_address.alias}}</text>
                        <text data-event="copy" :data-value="detail.user_address.name" @tap="text_event">{{detail.user_address.name}}</text>
                        <text class="fr" data-event="tel" :data-value="detail.user_address.tel" @tap="text_event">{{detail.user_address.tel}}</text>
                    </view>
                    <view v-if="(detail.user_address.appoint_time || null) != null" class="cr-red margin-top-xs">{{detail.user_address.appoint_time}}</view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url+'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text data-event="copy" :data-value="detail.user_address.address_info" @tap="text_event">{{detail.user_address.address_info}}</text>
                            <text v-if="(detail.user_address.lng || 0) != 0 && (detail.user_address.lat || 0) != 0" class="address-map-submit cr-base br round bg-white margin-left-sm text-size-xs" @tap="address_map_event">{{$t('user-order-detail.user-order-detail.7lp6gw')}}</text>
                        </view>
                    </view>
                    <view class="address-divider margin-bottom-sm"></view>
                </view>

                <!-- 基础信息 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('order-detail.order-detail.9er1pc')}}</view>
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
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.7f8p26')}}</view>
                    <view v-for="(item, index) in detail.goods_data" :key="index" class="goods-item br-b-dashed oh padding-main">
                        <view :data-value="item.goods_url" @tap="url_event" class="cp">
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
                        </view>
                    </view>
                    <view class="padding-top-main tr cr-base text-size">
                        <text>{{$t('user-order-detail.user-order-detail.423rmr')}}<text class="fw-b">{{detail.buy_number_count}}</text>{{$t('user-order-detail.user-order-detail.41ty94')}}<text class="sales-price margin-right-xs">{{detail.currency_data.currency_symbol}}{{detail.total_price}}</text></text>
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

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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
            componentCommon,
            componentNoData,
            componentBottomLine
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params
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
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                detail_list: [
                                    { name: this.$t('order-detail.order-detail.36op8f'), value: data.data.main_order_no || '', event: 'copy' },
                                    { name: this.$t('order-detail.order-detail.ygvc34'), value: data.data.merchant_name || '' },
                                    { name: this.$t('order-detail.order-detail.x3ge6c'), value: data.data.total_price || '' },
                                    { name: this.$t('order-detail.order-detail.8n1f72'), value: data.data.buy_number_count || '' },
                                    { name: this.$t('order-detail.order-detail.2443o1'), value: data.data.status_name || '' },
                                    { name: this.$t('order-detail.order-detail.342sfz'), value: data.data.start_delivery_time || '' },
                                    { name: this.$t('order-detail.order-detail.2dw4gd'), value: data.data.success_delivery_time || '' },
                                    { name: this.$t('order-detail.order-detail.r3bg45'), value: data.data.success_delivery_msg || '' },
                                    { name: this.$t('order-detail.order-detail.521pp4'), value: data.data.success_delivery_images || '', type: 'images-list' },
                                    { name: this.$t('order-detail.order-detail.u745i8'), value: data.data.abnormal_delivery_time || '' },
                                    { name: this.$t('order.order.865029'), value: data.data.reason || '' },
                                    { name: this.$t('order-detail.order-detail.5fq8pr'), value: data.data.add_time || '' },
                                    { name: this.$t('common.upd_time'), value: data.data.upd_time || '' },
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
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips')
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
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
                if ((this.detail.user_address || null) == null) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                    return false;
                }
                
                // 打开地图
                var data = this.detail.user_address;
                var name = data.alias || data.name || '';
                app.globalData.open_location(data.lng, data.lat, name, data.address_info);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './order-detail.css';
</style>