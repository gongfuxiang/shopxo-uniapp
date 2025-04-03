<template>
    <view :class="theme_view">
        <view v-if="nav_type_list.length > 0" class="header bg-white">
            <!-- 导航 -->
            <view class="nav-base">
                <block v-for="(item, index) in nav_type_list" :key="index">
                    <view :class="'item fl tc pr ' + (nav_type_index == index ? 'cr-main' : '')" :data-index="index" @tap="nav_event">
                        <text>{{ item.name }}</text>
                        <view class="badge-icon pa">
                            <component-badge :propNumber="item.count || 0"></component-badge>
                        </view>
                    </view>
                </block>
            </view>
            <!-- 关键字搜索 -->
            <view class="padding-horizontal-main padding-bottom-main margin-top-xs pr nav-search">
                <view class="search-keywords">
                    <component-search
                        @onsearch="search_submit_event"
                        :propIsOnEvent="true"
                        :propIsRequired="false"
                        :propPlaceholder="$t('order.order.725882')"
                        propClass="br"
                        :propIsBtn="true"
                        :propDefaultValue="search_input_keywords_value"
                        <!-- #ifdef MP || APP -->
                        propIcon="icon-scan"
                        propIconColor="#333"
                        @onicon="search_icon_event"
                        :propIsIconOnEvent="true"
                        <!-- #endif -->
                    ></component-search>
                    <view class="map-submit pa" data-event="copy" @tap="map_show_type_event">
                        <uni-icons :type="(show_type == 0) ? 'map' : 'list'" size="56rpx" color="#999"></uni-icons>
                    </view>
                </view>
            </view>
        </view>

        <!-- 列表 -->
        <scroll-view v-if="show_type == 0" :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <block v-if="data_list.length > 0">
                <view class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="base oh br-b padding-bottom-main">
                            <text class="cr-base">{{ item.add_time_concise || item.add_time }}</text>
                            <text :class="'fr ' + (item.status == 4 ? 'cr-red' : item.status == 3 ? 'cr-green' : item.status == 2 ? 'cr-main' : 'cr-grey')">{{ item.status_name }}</text>
                        </view>
                        <view class="content margin-top">
                            <view class="oh margin-top-sm">
                                <view class="single-text fl" data-event="copy" :data-value="item.main_order_no" @tap="text_event">
                                    <text class="cr-grey">{{$t('order.order.232ygr')}}</text>
                                    <text class="cr-base margin-left-sm">{{ item.main_order_no }}</text>
                                </view>
                                <view class="single-text fr" data-event="copy" :data-value="item.main_order_id" @tap="text_event">
                                    <text class="cr-grey">{{$t('order.order.71n22h')}}</text>
                                    <text class="cr-base margin-left-sm">{{ item.main_order_id }}</text>
                                </view>
                            </view>
                            <view v-if="(item.warehouse_address || null) != null" class="margin-top">
                                <view class="cr-grey-d tc">{{$t('order.order.jhgfd1')}}</view>
                                <view class="cr-base margin-top-xs">
                                    <view>
                                        <text data-event="copy" :data-value="item.warehouse_address.name" @tap="text_event">{{item.warehouse_address.name}}</text>
                                        <text class="margin-left-xl" data-event="copy" :data-value="item.warehouse_address.tel" @tap="text_event">{{item.warehouse_address.tel}}</text>
                                        <text v-if="(item.merchant_name || null) != null" class="fr" data-event="copy" :data-value="item.merchant_name" @tap="text_event">{{item.merchant_name}}</text>
                                    </view>
                                    <view class="pr margin-top-xs">
                                        <view class="address-info">
                                            <text class="cr-base" data-event="copy" :data-value="item.warehouse_address.address_info" @tap="text_event">{{ item.warehouse_address.address_info }}</text>
                                            <view v-if="(item.warehouse_address.lng || 0) != 0 && (item.warehouse_address.lat || 0) != 0" class="icon-item bg-base circle dis-inline-block tc cp pa" data-type="warehouse_address" :data-index="index" @tap.stop="address_map_event">
                                                <uni-icons type="paperplane-filled" size="32rpx" color="#666"></uni-icons>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view v-if="(item.user_address || null) != null" class="margin-top">
                                <view class="cr-grey-d tc">{{$t('order.order.hbvwq4')}}</view>
                                <view class="cr-base margin-top-xs">
                                    <view>
                                        <text data-event="copy" :data-value="item.user_address.name" @tap="text_event">{{item.user_address.name}}</text>
                                        <text class="margin-left-xl" data-event="copy" :data-value="item.user_address.tel" @tap="text_event">{{item.user_address.tel}}</text>
                                    </view>
                                    <view v-if="(item.user_address.extraction_contact_name || null) != null || (item.user_address.extraction_contact_tel || null) != null" class="padding-vertical-xs">
                                        <text v-if="(item.user_address.extraction_contact_name || null) != null" class="margin-right-xl">{{item.user_address.extraction_contact_name}}</text>
                                        <text v-if="(item.user_address.extraction_contact_tel || null) != null">{{item.user_address.extraction_contact_tel}}</text>
                                    </view>
                                    <view v-if="(item.user_address.appoint_time || null) != null" class="cr-red padding-vertical-xs">{{item.user_address.appoint_time}}</view>
                                    <view class="pr margin-top-xs">
                                        <view class="address-info">
                                            <text class="cr-base" data-event="copy" :data-value="item.user_address.address_info" @tap="text_event">{{ item.user_address.address_info }}</text>
                                            <view v-if="(item.user_address.lng || 0) != 0 && (item.user_address.lat || 0) != 0" class="icon-item bg-base circle dis-inline-block tc cp pa" data-type="user_address" :data-index="index" @tap.stop="address_map_event">
                                                <uni-icons type="paperplane-filled" size="32rpx" color="#666"></uni-icons>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="margin-top-lg padding-top-sm">
                                <text>{{ item.describe }}</text>
                                <text v-if="(item.distance || null) != null" class="fr cr-grey">{{$t('extraction-address.extraction-address.42v8tv')}}{{ item.distance }}</text>
                            </view>
                        </view>
                        <view class="item-operation tr br-t padding-top-main margin-top-main">
                            <button class="round bg-white br-base cr-base" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/delivery/order-detail/order-detail?id=' + item.id" @tap="url_event">{{$t('order.order.75ie9c')}}</button>
                            <button v-if="item.status == 1" class="round bg-white br-blue cr-blue" type="default" size="mini" hover-class="none" :data-index="index" @tap="start_delivery_event">{{$t('order.order.021438')}}</button>
                            <button v-if="item.status == 4" class="round bg-white br-main cr-main" type="default" size="mini" hover-class="none" :data-index="index" @tap="start_delivery_event">{{$t('order.order.ip4xo5')}}</button>
                            <block v-if="item.status == 2">
                                <button class="round bg-white br-green cr-green" type="default" size="mini" hover-class="none" :data-index="index" @tap="popup_success_content_event">{{$t('order.order.51q275')}}</button>
                                <button class="round bg-white br-red cr-red" type="default" size="mini" hover-class="none" :data-index="index" @tap="popup_abnormal_content_event">{{$t('order.order.fb6dge')}}</button>
                            </block>
                        </view>
                    </view>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
            <block v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </block>
        </scroll-view>

        <!-- 地图 -->
        <view v-if="show_type == 1" class="map-container pr">
            <block v-if="markers.length > 0">
                <map class="wh-auto ht-auto"
                    :enable-zoom="true"
                    :enable-scroll="true"
                    :show-location="true"
                    :latitude="markers[0]['latitude'] || latitude"
                    :longitude="markers[0]['longitude'] || longitude"
                    :scale="scale"
                    :markers="markers"
                    @markertap="marker_tap_event"
                ></map>
                <view v-if="markers_active_data.length > 0" class="map-markers-active-data pa border-radius-main padding-main bs-bb">
                    <block v-for="(item,index) in markers_active_data" :key="index">
                        <view :class="'pr '+(index > 0 ? 'br-t padding-top-sm margin-top-sm' : '')">
                            <view>
                                <text>{{$t('order.order.71n22h')}}：</text>
                                <text class="cp" data-event="copy" :data-value="item.main_order_id" @tap="text_event">{{item.main_order_id}}</text>
                            </view>
                            <view>
                                <text>{{$t('order.order.232ygr')}}：</text>
                                <text class="cp" data-event="copy" :data-value="item.main_order_no" @tap="text_event">{{item.main_order_no}}</text>
                            </view>
                            <view class="single-text">
                                <text>{{$t('order.order.ra8222')}}：</text>
                                <text class="cp" data-event="copy" :data-value="item.user_address.address_info" @tap="text_event">{{ item.user_address.address_info }}</text>
                            </view>
                            <view v-if="(item.user_address.lng || 0) != 0 && (item.user_address.lat || 0) != 0" class="map-send-icon bg-base circle tc cp pa" data-type="map" :data-index="index" @tap.stop="address_map_event">
                                <uni-icons type="paperplane-filled" size="44rpx" color="#666"></uni-icons>
                            </view>
                        </view>
                    </block>
                </view>
            </block>
            <block v-else>
                <!-- 提示信息 -->
                <component-no-data propStatus="0"></component-no-data>
            </block>
        </view>
        
        <!-- 订单完成弹窗 -->
        <component-popup :propShow="popup_success_content_status" propPosition="bottom" @onclose="popup_success_content_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_success_content_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <form @submit="form_delivery_success_submit_event" class="form-container">
                    <view class="form-container">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('form.form.xy87t8')}}</view>
                            <view class="br padding-main radius margin-top">
                                <textarea placeholder-class="cr-grey" class="cr-base margin-0" :placeholder="$t('order.order.q4c8j0')" maxlength="200" :auto-height="true" :value="form_delivery_success_msg_value" @input="form_delivery_success_msg_event"></textarea>
                            </view>
                        </view>
                        <view class="form-gorup form-container-upload oh">
                            <view class="form-gorup-title">{{$t('order.order.46q2z7')}}<text class="form-group-tips-must">*</text><text class="form-group-tips">{{$t('order.order.o11d44')}}{{form_delivery_success_images_max_count}}{{$t('buy.buy.5iuqow')}}</text></view>
                            <view class="form-upload-data oh">
                                <block v-if="form_delivery_success_images_list.length > 0">
                                    <view v-for="(item, index) in form_delivery_success_images_list" :key="index" class="item fl">
                                        <text class="delete-icon" @tap="upload_delete_event" :data-index="index">x</text>
                                        <image :src="item" @tap="upload_show_event" :data-index="index" mode="aspectFill"></image>
                                    </view>
                                </block>
                                <image v-if="(form_delivery_success_images_list || null) == null || form_delivery_success_images_list.length < form_delivery_success_images_max_count" class="item fl upload-icon" :src="common_static_url + 'upload-icon.png'" mode="aspectFill" @tap="file_upload_event"></image>
                            </view>
                        </view>
                        <view class="form-gorup form-gorup-submit bottom-line-exclude">
                            <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">{{$t('order.order.9cvj96')}}</button>
                        </view>
                    </view>
                </form>
            </view>
        </component-popup>

        <!-- 订单异常弹窗 -->
        <component-popup :propShow="popup_abnormal_content_status" propPosition="bottom" @onclose="popup_abnormal_content_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_abnormal_content_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <form @submit="form_delivery_abnormal_submit_event" class="form-container">
                    <view class="form-container">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('order.order.865029')}}<text class="form-group-tips-must">*</text></view>
                            <view class="br padding-main radius margin-top">
                                <textarea placeholder-class="cr-grey" class="cr-base margin-0" :placeholder="$t('order.order.g23kyj')" maxlength="200" :auto-height="true" :value="form_delivery_abnormal_msg_value" @input="form_delivery_abnormal_msg_event"></textarea>
                            </view>
                        </view>
                        <view class="form-gorup form-gorup-submit bottom-line-exclude">
                            <button class="bg-red br-red cr-white round text-size" type="default" form-type="submit" hover-class="none">{{$t('order.order.eyir7g')}}</button>
                        </view>
                    </view>
                </form>
            </view>
        </component-popup>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentBadge from "@/components/badge/badge";
    import componentPopup from "@/components/popup/popup";
    import componentSearch from '@/components/search/search';

    var common_static_url = app.globalData.get_static_url("common");
    var plugins_static_url = app.globalData.get_static_url('delivery', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                plugins_static_url: plugins_static_url,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                nav_type_list: [],
                nav_type_index: 0,
                latitude: 0,
                longitude: 0,
                search_input_keywords_value: "",
                popup_abnormal_content_status: false,
                popup_abnormal_data_index: null,
                form_delivery_abnormal_msg_value: "",
                popup_success_content_status: false,
                popup_success_data_index: null,
                form_delivery_success_msg_value: "",
                form_delivery_success_images_list: [],
                form_delivery_success_images_max_count: 30,
                editor_path_type: "",
                show_type: 0,
                scale: 10,
                markers: [],
                markers_active_data: []
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentBadge,
            componentPopup,
            componentSearch
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
            this.init();

            // 位置实时监听
            this.start_location_update();

            // 分享菜单处理
            app.globalData.page_share_handle();
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
                    // 位置权限、回调并获取数据
                    app.globalData.get_location_check("scope.userLocation", this, "location_back_handle");
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 位置实时监听
            start_location_update(e = null) {
                if (e == null) {
                    app.globalData.start_location_update(0, this, "start_location_update");
                } else {
                    if ((e.status || 0) == 1) {
                        // 更新当前页面的位置
                        this.setData({
                            latitude: e.lat,
                            longitude: e.lng,
                        });
                        // 位置上报
                        uni.request({
                            url: app.globalData.get_request_url("locationreport", "user", "delivery"),
                            method: "POST",
                            data: {
                                lat: e.lat,
                                lng: e.lng,
                            },
                            dataType: "json",
                        });
                    } else {
                        console.log("error", e);
                    }
                }
            },

            // 位置权限校验回调
            location_back_handle(status = 0) {
                var self = this;
                if (status == 1) {
                    uni.getLocation({
                        type: "wgs84",
                        success: function (res) {
                            self.setData({
                                longitude: res.longitude,
                                latitude: res.latitude,
                            });
                            // 获取数据
                            self.get_data_list();
                        },
                    });
                } else {
                    if (app.globalData.data.is_distribution_map_force_location == 1) {
                        app.globalData.url_open('/pages/common/open-setting-location/open-setting-location?is_check_success_back=1');
                    } else {
                        // 获取数据
                        self.get_data_list();
                    }
                }
            },

            // 获取数据
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        return false;
                    }
                }

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });

                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 参数
                var type = (this.nav_type_list[this.nav_type_index] || null) == null ? -1 : this.nav_type_list[this.nav_type_index]["value"];
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "order", "delivery"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        type: type,
                        keywords: this.search_input_keywords_value || "",
                        lat: this.latitude,
                        lng: this.longitude,
                    },
                    dataType: "json",
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        if (res.data.code == 0) {
                            // 数据列表
                            var data = res.data.data;
                            if (this.data_page <= 1) {
                                var temp_data_list = data.data || [];
                            } else {
                                var temp_data_list = this.data_list || [];
                                var temp_data = data.data;
                                for (var i in temp_data) {
                                    temp_data_list.push(temp_data[i]);
                                }
                            }

                            // 地图标记
                            var temp_markers = [];
                            if(temp_data_list.length > 0) {
                                temp_data_list.forEach((item, index) => {
                                    if((item.user_address || null) != null && (item.user_address.lat || 0) != 0 && (item.user_address.lng || 0) != 0) {
                                        temp_markers.push({
                                            id: index,
                                            width: 30,
                                            height: 30,
                                            latitude: item.user_address.lat,
                                            longitude: item.user_address.lng,
                                            iconPath: this.plugins_static_url+'order.png'
                                        });
                                    }
                                });
                            }
                            this.setData({
                                editor_path_type: data.editor_path_type || "",
                                nav_type_list: data.nav_type_list || [],
                                markers: temp_markers,
                                data_list: temp_data_list,
                                data_total: data.total,
                                data_page_total: data.page_total,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });

                            // 是否还有数据
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_type_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            },

            // 打开url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 搜索关键字事件
            search_input_keywords_event(e) {
                this.setData({
                    search_input_keywords_value: e.detail.value,
                });
            },

            // 搜索确认事件
            search_submit_event(e) {
                this.setData({
                    search_input_keywords_value: e,
                    data_page: 1,
                });
                this.get_data_list(1);
            },

            // icon事件
            search_icon_event(e) {
                var self = this;
                uni.scanCode({
                    success: function (res) {
                        self.setData({
                            search_input_keywords_value: res.result,
                            data_page: 1
                        });
                        self.get_data_list(1);
                    },
                });
            },

            // 地图查看
            address_map_event(e) {
                var index = e.currentTarget.dataset.index;
                var type = e.currentTarget.dataset.type;
                if(type == 'map') {
                    this.address_map_handle(this.markers_active_data[index]['user_address']);
                } else {
                    var temp_data = this.data_list;
                    if ((temp_data[index] || null) == null || (temp_data[index][type] || null) == null) {
                        app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                        return false;
                    }
                    this.address_map_handle(temp_data[index][type]);
                }
            },

            // 地址打开地图
            address_map_handle(ads) {
                var name = ads.alias || ads.name || "";
                app.globalData.open_location(ads.lng, ads.lat, name, ads.address_info);
            },
            
            // 订单完成开启弹层
            popup_success_content_event(e) {
                this.setData({
                    popup_success_content_status: true,
                    popup_success_data_index: e.currentTarget.dataset.index,
                    form_delivery_success_msg_value: "",
                    form_delivery_success_images_list: []
                });
            },
            
            // 订单完成弹层关闭
            popup_success_content_close_event(e) {
                this.setData({
                    popup_success_content_status: false,
                });
            },

            // 订单完成说明输入事件
            form_delivery_success_msg_event(e) {
                this.setData({
                    form_delivery_success_msg_value: e.detail.value
                });
            },

            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.form_delivery_success_images_list[e.currentTarget.dataset.index],
                    urls: this.form_delivery_success_images_list,
                });
            },
            
            // 图片删除
            upload_delete_event(e) {
                var self = this;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.psi67g'),
                    success(res) {
                        if (res.confirm) {
                            var list = self.form_delivery_success_images_list;
                            list.splice(e.currentTarget.dataset.index, 1);
                            self.setData({
                                form_delivery_success_images_list: list,
                            });
                        }
                    },
                });
            },
            
            // 文件上传
            file_upload_event(e) {
                var self = this;
                uni.chooseImage({
                    count: this.form_delivery_success_images_max_count,
                    success(res) {
                        var success = 0;
                        var fail = 0;
                        var length = res.tempFilePaths.length;
                        var count = 0;
                        self.upload_one_by_one(res.tempFilePaths, success, fail, count, length);
                    },
                });
            },
            
            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length) {
                var self = this;
                if (self.form_delivery_success_images_list.length < this.form_delivery_success_images_max_count) {
                    uni.uploadFile({
                        url: app.globalData.get_request_url("index", "ueditor"),
                        filePath: img_paths[count],
                        name: "upfile",
                        formData: {
                            action: "uploadimage",
                            path_type: self.editor_path_type,
                        },
                        success: function (res) {
                            success++;
                            if (res.statusCode == 200) {
                                var data = typeof res.data == "object" ? res.data : JSON.parse(res.data);
                                if (data.code == 0 && (data.data.url || null) != null) {
                                    var list = self.form_delivery_success_images_list;
                                    list.push(data.data.url);
                                    self.setData({
                                        form_delivery_success_images_list: list,
                                    });
                                } else {
                                    app.globalData.showToast(data.msg);
                                }
                            }
                        },
                        fail: function (e) {
                            fail++;
                        },
                        complete: function (e) {
                            count++;
            
                            // 下一张
                            if (count >= length) {
                                // 上传完毕，作一下提示
                                //app.showToast('上传成功' + success +'张', 'success');
                            } else {
                                // 递归调用，上传下一张
                                self.upload_one_by_one(img_paths, success, fail, count, length);
                            }
                        },
                    });
                }
            },

            // 订单异常开启弹层
            popup_abnormal_content_event(e) {
                this.setData({
                    popup_abnormal_content_status: true,
                    popup_abnormal_data_index: e.currentTarget.dataset.index,
                    form_delivery_abnormal_msg_value: ""
                });
            },

            // 订单异常弹层关闭
            popup_abnormal_content_close_event(e) {
                this.setData({
                    popup_abnormal_content_status: false,
                });
            },
            
            // 订单异常原因输入事件
            form_delivery_abnormal_msg_event(e) {
                this.setData({
                    form_delivery_abnormal_msg_value: e.detail.value
                });
            },

            // 开始配送
            start_delivery_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.s5cpq5'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.not_yet'),
                    success: (result) => {
                        if (result.confirm) {
                            this.order_status_handle({
                                index: e.currentTarget.dataset.index,
                                new_status: 2,
                                status_name: this.$t('order.order.13j20t'),
                                action: "startdelivery",
                            });
                        }
                    },
                });
            },

            // 完成配送表单提交
            form_delivery_success_submit_event(e) {
                if(this.form_delivery_success_images_list.length == 0) {
                    app.globalData.showToast(this.$t('order.order.7ltibl'));
                    return false;
                }
                this.order_status_handle({
                    index: this.popup_success_data_index,
                    new_status: 3,
                    status_name: this.$t('order.order.c69064'),
                    action: "successdelivery",
                    msg: this.form_delivery_success_msg_value || '',
                    images: this.form_delivery_success_images_list
                });
            },

            // 异常表单提交
            form_delivery_abnormal_submit_event(e) {
                var msg = this.form_delivery_abnormal_msg_value || null;
                if (msg == null) {
                    app.globalData.showToast(this.$t('order.order.hun5n3'));
                } else {
                    this.order_status_handle({
                        index: this.popup_abnormal_data_index,
                        new_status: 4,
                        status_name: this.$t('order.order.fb6dge'),
                        action: "abnormaldelivery",
                        msg: msg,
                    });
                }
            },

            // 订单状态处理
            order_status_handle(params) {
                var temp_data = this.data_list;
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url(params.action, "order", "delivery"),
                    method: "POST",
                    data: {
                        id: temp_data[params.index]["id"],
                        msg: params.msg || "",
                        images: params.images || ""
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp_nav = this.nav_type_list;
                            for (var i in temp_nav) {
                                if (temp_nav[i]["value"] == temp_data[params.index]["status"] && (temp_nav[i]["count"] || 0) != 0) {
                                    temp_nav[i]["count"] = parseInt(temp_nav[i]["count"]) - 1;
                                }
                                if (temp_nav[i]["value"] == params.new_status) {
                                    temp_nav[i]["count"] = parseInt(temp_nav[i]["count"] || 0) + 1;
                                }
                            }
                            temp_data[params.index]["status"] = params.new_status;
                            temp_data[params.index]["status_name"] = params.status_name;
                            this.setData({
                                data_list: temp_data,
                                nav_type_list: temp_nav,
                                popup_success_content_status: false,
                                popup_abnormal_content_status: false
                            });
                            app.globalData.showToast(res.data.msg, "success");
                        } else {
                            if (app.globalData.is_login_check(res.data, this, "order_status_handle", params)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 展示类型
            map_show_type_event(e) {
                this.setData({
                    show_type: this.show_type == 0 ? 1 : 0
                });
            },

            // 点击标记点事件
            marker_tap_event(e) {
                // 点中数据id
                var index = e.detail.markerId;
                // 标记数据
                var temp_markers = this.markers;
                for(var i in temp_markers) {
                    if(temp_markers[i]['id'] == index) {
                        temp_markers[i]['iconPath'] = this.plugins_static_url+'order-active.png';
                    } else {
                        temp_markers[i]['iconPath'] = this.plugins_static_url+'order.png';
                    }
                }
                // 订单数据、先匹配实际点击的订单
                var temp = null;
                var temp_data_list = this.data_list;
                for(var i in temp_data_list) {
                    if(i == index) {
                        temp = temp_data_list[i];
                        break;
                    }
                }
                // 再匹配相同坐标的订单
                var markers_active_data = [];
                if(temp != null) {
                    for(var i in temp_data_list) {
                        if((temp_data_list[i]['user_address'] || null) != null && (temp_data_list[i]['user_address']['lng'] || 0) != 0 && (temp_data_list[i]['user_address']['lat'] || 0) != 0 && temp.user_address.lng == temp_data_list[i]['user_address']['lng'] && temp.user_address.lat == temp_data_list[i]['user_address']['lat']) {
                            markers_active_data.push(temp_data_list[i]);
                        }
                    }
                }
                this.setData({
                    markers: temp_markers,
                    markers_active_data: markers_active_data,
                });
            },
        },
    };
</script>
<style>
    @import "./order.css";
</style>