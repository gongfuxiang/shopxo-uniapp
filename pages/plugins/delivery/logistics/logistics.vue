<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="map-container pr">
                <map class="wh-auto ht-auto"
                    :enable-zoom="true"
                    :enable-scroll="true"
                    :show-location="true"
                    :latitude="latitude"
                    :longitude="longitude"
                    :scale="scale"
                    :markers="markers"
                    :polyline="polyline"
                ></map>
                <view class="team bs-bb oh pa border-radius-main padding-main">
                    <view class="top pr">
                        <view class="base">
                            <image class="avatar circle br va-m" :src="team.work_photo" mode="aspectFit"></image>
                            <text class="cr-base text-size-sm margin-left-sm">{{team.idcard_name}}</text>
                        </view>
                        <view v-if="(team.user.mobile || null) != null" class="tel circle bg-base br tc cp pa" data-event="tel" :data-value="team.user.mobile" @tap="text_event">
                            <uni-icons type="phone" size="34rpx" color="#fd8008"></uni-icons>
                        </view>
                    </view>
                    <view class="br-t-dashed margin-top-sm padding-top-sm text-size-sm cr-base">
                        <view>
                            <text>{{$t('logistics.logistics.dxu6ql')}}</text>
                            <text v-if="(start_delivery_time || null) != null">{{start_delivery_time}}</text>
                            <text v-else class="cr-grey-9">{{$t('logistics.logistics.5542tq')}}</text>
                        </view>
                        <view class="margin-top-sm">
                            <text>{{$t('logistics.logistics.895ug2')}}</text>
                            <text v-if="(success_delivery_time || null) != null">{{success_delivery_time}}</text>
                            <text v-else class="cr-grey-9">{{$t('logistics.logistics.76q0ii')}}</text>
                        </view>
                    </view>
                </view>
            </view>
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

    var plugins_static_url = app.globalData.get_static_url('delivery', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_msg: '',
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                params: {},
                scale: 10,
                latitude: 39.909,
                longitude: 116.39742,
                markers: [],
                polyline: [],
                team: null,
                start_delivery_time: null,
                success_delivery_time: null,
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
        },

        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 获取数据
            get_data() {
                this.setData({
                    data_list_loding_status: 1,
                });
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("logistics", "order", "delivery"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                latitude: data.latitude || 39.909,
                                longitude: data.longitude || 116.39742,
                                markers: data.markers || [],
                                polyline: data.polyline || [],
                                scale: data.scale || 10,
                                team: data.team || null,
                                start_delivery_time: data.start_delivery_time || null,
                                success_delivery_time: data.success_delivery_time || null,
                                data_list_loding_status: 3,
                                data_list_loding_msg: ''
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips')
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            }
        },
    };
</script>
<style>
    @import "./logistics.css";
</style>