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
                    @regionchange="region_change_event"
                    @markertap="marker_tap_event"
                ></map>
                <image v-if="map_center_icon_status == 1" class="map-center-icon pa" :src="map_location_icon" mode="aspectFit"></image>
            </view>
            <scroll-view :scroll-y="true" :scroll-top="scroll_top" :scroll-with-animation="true" class="bg-white bs-bb user-container">
                <block v-if="(user || null) != null && user.length > 0">
                    <block v-for="(item, index) in user" :key="index">
                        <view :class="'item padding-main oh pr br-b '+(item.active || '')" :data-index="index" @tap="user_event">
                            <image class="circle br dis-block fl avatar" :src="item.avatar" mode="aspectFit"></image>
                            <view class="base fr">
                                <view class="base-top oh br-b-dashed padding-bottom-xs">
                                    <view class="single-text cr-base fl view-name">{{item.user_name_view}}</view>
                                    <view class="fr base-top-icon">
                                        <view v-if="(item.username || null) != null" class="dis-inline-block va-m" data-event="copy" :data-value="item.username" @tap.stop="text_event">
                                            <uni-icons type="person" size="34rpx" color="#999"></uni-icons>
                                        </view>
                                        <view v-if="(item.mobile || null) != null" class="dis-inline-block va-m" data-event="tel" :data-value="item.mobile" @tap.stop="text_event">
                                            <uni-icons type="phone" size="34rpx" color="#999"></uni-icons>
                                        </view>
                                        <view v-if="(item.email || null) != null" class="dis-inline-block va-m" data-event="copy" :data-value="item.email" @tap.stop="text_event">
                                            <uni-icons type="email" size="34rpx" color="#999"></uni-icons>
                                        </view>
                                    </view>
                                </view>
                                <view class="base-bottom cr-grey text-size-xs margin-top-sm oh">
                                    <text class="single-text fl address">{{item.address}}</text>
                                    <view class="fr">
                                        <view class="dis-inline-block va-m" data-event="copy" :data-value="item.address" @tap.stop="text_event">
                                            <uni-icons type="chatboxes" size="34rpx" color="#999"></uni-icons>
                                        </view>
                                        <view class="dis-inline-block va-m margin-left-xxl" data-event="copy" :data-value="item.address" :data-lng="item.lng" :data-lat="item.lat" @tap.stop="map_route_event">
                                            <uni-icons type="paperplane" size="34rpx" color="#999"></uni-icons>
                                        </view>
                                    </view>
                                </view>
                                <view class="text-size-xs margin-top-sm">
                                    <text class="cr-grey">{{$t('map.map.ivy154')}}</text>
                                    <text class="cr-base fw-b margin-left-sm">{{item.order_count}}</text>
                                    <button type="default" size="mini" class="br-main cr-main bg-white text-size-xs round fr order-submit" :data-value="item.id" @tap="user_order_event">{{$t('map.map.557z8x')}}</button>
                                </view>
                            </view>
                        </view>
                    </block>
                </block>
                <block v-else>
                    <component-no-data propStatus="0"></component-no-data>
                </block>
            </scroll-view>
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
    var plugins_static_url = app.globalData.get_static_url('distribution', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                data_list: [],
                map_location_icon: plugins_static_url+'app/map/location-icon.png',
                user: [],
                scale: 10,
                latitude: 39.909,
                longitude: 116.39742,
                markers: [],
                map_center_icon_status: 1,
                markers_active_index: null,
                scroll_top: 0
            };
        },

        components: {
            componentCommon,
            componentNoData
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params
            });

            // 获取数据
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
            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 位置权限、回调并获取数据
                    app.globalData.get_location_check('scope.userLocation', this, 'location_back_handle');
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false
                    });
                }
            },

            // 获取数据
            get_data() {
                // 参数
                uni.request({
                    url: app.globalData.get_request_url("map", "order", "distribution"),
                    method: 'POST',
                    data: {
                        lng: this.longitude,
                        lat: this.latitude
                    },
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var user = data.user || [];
                            var temp_markers = [];
                            if(user.length > 0) {
                                user.forEach((item, index) => {
                                    temp_markers.push({
                                        id: index,
                                        width: 25,
                                        height: 25,
                                        latitude: item.lat,
                                        longitude: item.lng,
                                        iconPath: plugins_static_url+'app/map/markers-icon.png'
                                    });
                                });
                            }
                            this.setData({
                                user: user,
                                markers: temp_markers,
                                markers_active_index: null,
                                scale: data.scale || 10,
                                data_list_loding_status: 3
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 3,
                                data_list_loding_msg: res.data.msg
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 3,
                            data_list_loding_msg: this.$t('common.internet_error_tips')
                        });
                    }
                });
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            },

            // 地址导航
            map_route_event(e) {
                app.globalData.open_location(e.currentTarget.dataset.lng, e.currentTarget.dataset.lat, '', e.currentTarget.dataset.value);
            },

            // 位置权限校验回调
            location_back_handle(status = 0) {
                var self = this;
                if(status == 1) {
                    uni.getLocation({
                    	type: 'wgs84',
                    	success: function (res) {
                            self.setData({
                                longitude: res.longitude,
                                latitude: res.latitude,
                            });
                            // 获取数据
                            self.get_data();
                    	}
                    });
                } else {
                    if(app.globalData.data.is_distribution_map_force_location == 1) {
                        app.globalData.url_open('/pages/common/open-setting-location/open-setting-location?is_check_success_back=1');
                    } else {
                        // 获取数据
                        self.get_data();
                    }                 
                }
            },

            // 视野改变事件
            region_change_event(e) {
                // 仅拖动及手势有效
                if(e.causedBy == 'drag' || e.causedBy == 'gesture') {
                    // 1. 开始显示中心图标
                    // 2. 结束重新拉取数据
                    if(e.type == 'end') {
                        this.setData({
                            latitude: e.detail.centerLocation.latitude,
                            longitude: e.detail.centerLocation.longitude
                        });
                        // 获取数据
                        this.get_data();
                    } else {
                        this.setData({
                            map_center_icon_status: 1,
                        });
                    }
                }
            },

            // 点击标记点事件
            marker_tap_event(e) {
                // 索引值
                var index = e.detail.markerId;
                // 选中处理
                this.user_markers_active_handle(index);
                // 列表滑动到用户位置
                this.setData({
                    scroll_top: (index*182)+'rpx'
                });
            },

            // 用户点击事件
            user_event(e) {
                // 索引值
                var index = e.currentTarget.dataset.index || 0;
                // 选中处理
                this.user_markers_active_handle(index);
                // 设置地图中心位置为当前用户位置
                var temp = this.user[index];
                this.setData({
                    latitude: temp['lat'],
                    longitude: temp['lng']
                });
            },

            // 用户和覆盖物选中处理
            user_markers_active_handle(index) {
                // 覆盖物
                var temp_markers = this.markers;
                for(var i in temp_markers) {
                    if(i == index) {
                        temp_markers[i]['iconPath'] = plugins_static_url+'app/map/markers-active-icon.png';
                    } else {
                        temp_markers[i]['iconPath'] = plugins_static_url+'app/map/markers-icon.png';
                    }
                }
                // 用户信息
                var temp_user = this.user;
                for(var i in temp_user) {
                    if(i == index) {
                        temp_user[i]['active'] = 'active';
                    } else {
                        temp_user[i]['active'] = '';
                    }
                }
                // 设置数据
                this.setData({
                    markers_active_index: index,
                    markers: temp_markers,
                    user: temp_user,
                    map_center_icon_status: 0
                });
            },

            // 用户订单事件
            user_order_event(e) {
                var value = e.currentTarget.dataset.value;
                app.globalData.url_open('/pages/plugins/distribution/order/order?uid='+value);
            }
        }
    };
</script>
<style>
    @import './map.css';
</style>