<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3 && (data || null) != null">
            <view class="padding-main">
                <view class="card-base padding-main border-radius-main bg-white">
                    <view class="fw-b flex-row align-c flex-wrap">
                        <text>{{$t('track.courier')}}：</text>
                        <text class="contact-name">{{ data.courier_name || '-' }}</text>
                        <block v-if="(data.courier_mobile || null) != null && data.courier_mobile != ''">
                            <text class="contact-mobile cr-main" :data-value="data.courier_mobile" @tap="text_copy_event">{{ data.courier_mobile }}</text>
                            <view class="courier-tel-icon flex-row align-c" :data-value="data.courier_mobile" @tap.stop="tel_event">
                                <iconfont name="icon-tel" size="32rpx" color="#666"></iconfont>
                            </view>
                        </block>
                    </view>
                    <view class="margin-top-sm">
                        <text class="fw-b">{{$t('track.status')}}：</text>
                        <text class="cr-red">{{ data.status_name || '-' }}</text>
                        <text v-if="(data.kuaidicom_name || null) != null && data.kuaidicom_name != ''" class="margin-left-sm">{{ data.kuaidicom_name }}</text>
                    </view>
                    <view v-if="(data.cancel_reason || null) != null && data.cancel_reason != ''" class="margin-top-sm cr-red text-size-sm">
                        {{$t('track.cancel_reason')}}：{{ data.cancel_reason }}
                    </view>
                    <view class="margin-top-main">
                        <view class="fw-b">{{$t('track.send')}}</view>
                        <view class="cr-base margin-top-xs flex-row align-c flex-wrap">
                            <text v-if="(data.send_name || null) != null && data.send_name != ''" class="contact-name cp" :data-value="data.send_name" @tap="text_copy_event">{{ data.send_name }}</text>
                            <block v-if="(data.send_mobile || null) != null && data.send_mobile != ''">
                                <text class="contact-mobile cp" :data-value="data.send_mobile" @tap="text_copy_event">{{ data.send_mobile }}</text>
                                <view class="courier-tel-icon flex-row align-c" :data-value="data.send_mobile" @tap.stop="tel_event">
                                    <iconfont name="icon-tel" size="32rpx" color="#666"></iconfont>
                                </view>
                            </block>
                        </view>
                        <view v-if="(data.send_addr || null) != null && data.send_addr != ''" class="cr-grey text-size-sm margin-top-xs cp" :data-value="data.send_addr" @tap="text_copy_event">{{ data.send_addr }}</view>
                        <view v-else class="cr-grey text-size-sm margin-top-xs">-</view>
                    </view>
                    <view class="margin-top-main">
                        <view class="fw-b">{{$t('track.rec')}}</view>
                        <view class="cr-base margin-top-xs flex-row align-c flex-wrap">
                            <text v-if="(data.rec_name || null) != null && data.rec_name != ''" class="contact-name cp" :data-value="data.rec_name" @tap="text_copy_event">{{ data.rec_name }}</text>
                            <block v-if="(data.rec_mobile || null) != null && data.rec_mobile != ''">
                                <text class="contact-mobile cp" :data-value="data.rec_mobile" @tap="text_copy_event">{{ data.rec_mobile }}</text>
                                <view class="courier-tel-icon flex-row align-c" :data-value="data.rec_mobile" @tap.stop="tel_event">
                                    <iconfont name="icon-tel" size="32rpx" color="#666"></iconfont>
                                </view>
                            </block>
                        </view>
                        <view v-if="(data.rec_addr || null) != null && data.rec_addr != ''" class="cr-grey text-size-sm margin-top-xs cp" :data-value="data.rec_addr" @tap="text_copy_event">{{ data.rec_addr }}</view>
                        <view v-else class="cr-grey text-size-sm margin-top-xs">-</view>
                    </view>
                    <view v-if="(data.track_url || null) != null && data.track_url != ''" class="margin-top-main">
                        <text class="cr-main" @tap="open_track_url">{{$t('track.official_url')}}</text>
                    </view>
                    <view class="margin-top-main flex-row jc-sb align-c">
                        <view class="flex-1 flex-width cr-grey text-size-xs">
                            <text v-if="(data.query_time || null) != null && data.query_time != ''">{{$t('track.query_time')}}：{{ data.query_time }}</text>
                        </view>
                        <button
                            class="bg-main br-main cr-white round text-size-sm margin-left-sm"
                            type="default"
                            size="mini"
                            :disabled="refresh_loading"
                            :loading="refresh_loading"
                            @tap="refresh_event"
                        >{{$t('track.refresh')}}</button>
                    </view>
                </view>
            </view>

            <view v-if="!data.is_basic_only" class="map-box margin-top-sm">
                <map
                    class="map"
                    :latitude="latitude"
                    :longitude="longitude"
                    :scale="scale"
                    :markers="markers"
                    :polyline="polyline"
                    :include-points="include_points"
                    :show-location="true"
                    :enable-3D="false"
                ></map>
                <view class="map-legend flex-row align-c flex-wrap padding-sm">
                    <view class="legend-item flex-row align-c margin-right-main">
                        <image v-if="legend_icons.send" class="legend-dot" :src="legend_icons.send" mode="aspectFit"></image>
                        <text class="text-size-xs cr-grey">{{$t('track.send')}}</text>
                    </view>
                    <view class="legend-item flex-row align-c margin-right-main">
                        <image v-if="legend_icons.courier" class="legend-dot" :src="legend_icons.courier" mode="aspectFit"></image>
                        <text class="text-size-xs cr-grey">{{$t('track.courier')}}</text>
                    </view>
                    <view class="legend-item flex-row align-c">
                        <image v-if="legend_icons.rec" class="legend-dot" :src="legend_icons.rec" mode="aspectFit"></image>
                        <text class="text-size-xs cr-grey">{{$t('track.rec')}}</text>
                    </view>
                </view>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <component-common ref="common"></component-common>
    </view>
</template>

<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                data: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                latitude: 39.909,
                longitude: 116.39742,
                scale: 14,
                markers: [],
                polyline: [],
                include_points: [],
                poll_timer: null,
                legend_icons: { send: '', courier: '', rec: '' },
                refresh_loading: false,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.setData({ params: params });
            this.init();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            app.globalData.page_common_on_show(this);
        },
        onUnload() {
            this.clear_poll_timer();
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data(false);
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },
            clear_poll_timer() {
                if (this.poll_timer != null) {
                    clearInterval(this.poll_timer);
                    this.poll_timer = null;
                }
            },
            start_poll_timer() {
                this.clear_poll_timer();
                var st = parseInt((this.data && this.data.status) || 0);
                if (st < 100 || st == 520 || st == 720) {
                    return;
                }
                this.poll_timer = setInterval(() => {
                    this.get_data(true);
                }, 15000);
            },
            request_params() {
                var p = {};
                if ((this.params.allot_id || null) != null && parseInt(this.params.allot_id) > 0) {
                    p.allot_id = parseInt(this.params.allot_id);
                } else if ((this.params.id || null) != null) {
                    p.id = this.params.id;
                }
                return p;
            },
            get_data(is_poll, from_btn) {
                // 首次 Track；轮询/手动刷新 Trackrefresh
                var action = (is_poll || false) ? 'trackrefresh' : 'track';
                if (!(is_poll || false)) {
                    this.setData({ data_list_loding_status: 1 });
                }
                uni.request({
                    url: app.globalData.get_request_url(action, 'order', 'samecityexpress'),
                    method: 'POST',
                    data: this.request_params(),
                    dataType: 'json',
                    success: (res) => {
                        if (from_btn || false) {
                            this.setData({ refresh_loading: false });
                        }
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.apply_map(data);
                            this.setData({
                                data: data,
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                                data_bottom_line_status: true,
                            });
                            if (!(data.is_basic_only || 0)) {
                                if (!(is_poll || false) || this.poll_timer == null) {
                                    this.start_poll_timer();
                                }
                            } else {
                                this.clear_poll_timer();
                            }
                        } else {
                            if (!(is_poll || false)) {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_list_loding_msg: res.data.msg,
                                });
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if (from_btn || false) {
                            this.setData({ refresh_loading: false });
                        }
                        if (!(is_poll || false)) {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: this.$t('common.internet_error_tips'),
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        }
                    },
                });
            },
            // 文档支持网络 iconPath；与配送物流一致直接用接口远程图（和 PC 同一套）
            apply_map(data) {
                var role_colors = { send: '#5eb95e', courier: '#0e90d2', rec: '#F37B1D' };
                var role_names = {
                    send: this.$t('track.send'),
                    courier: this.$t('track.courier'),
                    rec: this.$t('track.rec'),
                };
                var icons = (data.marker_icons && typeof data.marker_icons === 'object') ? data.marker_icons : {};
                // 接口未带时，按插件静态目录拼远程地址（与 get_static_url('samecityexpress', true) 一致）
                var static_base = app.globalData.get_static_url('samecityexpress', true);
                var legend_icons = {
                    send: icons.send || (static_base + 'marker-send.png'),
                    courier: icons.courier || (static_base + 'marker-courier.png'),
                    rec: icons.rec || (static_base + 'marker-rec.png'),
                };
                this.setData({ legend_icons: legend_icons });
                var pts = {
                    send: {
                        latitude: parseFloat(data.send_lat || 0),
                        longitude: parseFloat(data.send_lng || 0),
                        title: role_names.send + (data.send_name ? ' ' + data.send_name : ''),
                        icon: legend_icons.send,
                    },
                    courier: {
                        latitude: parseFloat(data.courier_lat || 0),
                        longitude: parseFloat(data.courier_lng || 0),
                        title: role_names.courier + (data.courier_name ? ' ' + data.courier_name : ''),
                        icon: legend_icons.courier,
                    },
                    rec: {
                        latitude: parseFloat(data.rec_lat || 0),
                        longitude: parseFloat(data.rec_lng || 0),
                        title: role_names.rec + (data.rec_name ? ' ' + data.rec_name : ''),
                        icon: legend_icons.rec,
                    },
                };
                var order = ['send', 'courier', 'rec'];
                var markers = [];
                var line_points = [];
                var include_points = [];
                var center = null;
                var mid = null;
                order.forEach((role, idx) => {
                    var p = pts[role];
                    if (!p.latitude || !p.longitude || isNaN(p.latitude) || isNaN(p.longitude)) {
                        return;
                    }
                    var point = { latitude: p.latitude, longitude: p.longitude };
                    line_points.push(point);
                    include_points.push(point);
                    if (role === 'courier') {
                        center = point;
                    }
                    if (!mid) {
                        mid = point;
                    }
                    markers.push({
                        id: idx + 1,
                        latitude: p.latitude,
                        longitude: p.longitude,
                        title: p.title,
                        iconPath: p.icon,
                        width: 24,
                        height: 24,
                        anchor: { x: 0.5, y: 0.5 },
                        callout: {
                            content: p.title,
                            color: '#ffffff',
                            fontSize: 12,
                            borderRadius: 3,
                            bgColor: role_colors[role],
                            padding: 5,
                            display: 'ALWAYS',
                            textAlign: 'center',
                        },
                    });
                });
                var c = center || mid || { latitude: 39.909, longitude: 116.39742 };
                var polyline = [];
                if (line_points.length >= 2) {
                    polyline.push({
                        points: line_points,
                        color: '#0e90d2',
                        width: 5,
                        arrowLine: true,
                        borderColor: '#ffffff',
                        borderWidth: 1,
                    });
                }
                this.setData({
                    latitude: c.latitude,
                    longitude: c.longitude,
                    markers: markers,
                    polyline: polyline,
                    include_points: include_points,
                    scale: include_points.length > 1 ? 12 : 14,
                });
            },
            refresh_event() {
                if (this.refresh_loading) {
                    return;
                }
                this.setData({ refresh_loading: true });
                this.get_data(true, true);
            },
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },
            tel_event(e) {
                app.globalData.call_tel(e);
            },
            open_track_url() {
                if ((this.data.track_url || null) != null && this.data.track_url != '') {
                    app.globalData.url_open(this.data.track_url);
                }
            },
        },
    };
</script>
<style>
    @import './track.css';
</style>
