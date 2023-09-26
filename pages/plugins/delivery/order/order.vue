<template>
    <view>
        <view v-if="nav_type_list.length > 0" class="header bg-white">
            <!-- 导航 -->
            <view class="nav-base">
                <block v-for="(item, index) in nav_type_list" :key="index">
                    <view :class="'item fl tc cr-grey pr ' + (nav_type_index == index ? 'cr-main' : '')" :data-index="index" @tap="nav_event">
                        <text>{{ item.name }}</text>
                        <view class="badge-icon pa">
                            <component-badge :propNumber="item.count || 0"></component-badge>
                        </view>
                    </view>
                </block>
            </view>
            <!-- 关键字搜索 -->
            <view class="padding-horizontal-main padding-bottom-main margin-top-xs pr nav-search">
                <view class="search-keywords padding-left-main round br-main oh">
                    <input class="text-size-sm padding-left-sm padding-top-sm padding-bottom-xs dis-inline-block va-m" placeholder-class="cr-grey" placeholder="输入订单号/收件人/收件电话" @input="search_input_keywords_event" />
                    <button type="default" size="mini" class="br-main cr-white bg-main fr radius-0" @tap="search_submit_event">搜索</button>
                </view>
                <view class="map-submit pa" data-event="copy" @tap="map_show_type_event">
                    <uni-icons :type="(show_type == 0) ? 'map' : 'list'" size="58rpx" color="#999"></uni-icons>
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
                            <view class="single-text margin-top-sm">
                                <text class="cr-grey">单ID：</text>
                                <text class="cr-base" data-event="copy" :data-value="item.main_order_id" @tap="text_event">{{ item.main_order_id }}</text>
                            </view>
                            <view class="single-text margin-top-sm">
                                <text class="cr-grey">单号：</text>
                                <text class="cr-base" data-event="copy" :data-value="item.main_order_no" @tap="text_event">{{ item.main_order_no }}</text>
                            </view>
                            <view v-if="(item.address_data || null) != null">
                                <view class="single-text margin-top-sm">
                                    <text class="cr-grey">姓名：</text>
                                    <text class="cr-base" data-event="copy" :data-value="item.address_data.name" @tap="text_event">{{ item.address_data.name }}</text>
                                </view>
                                <view class="single-text margin-top-sm">
                                    <text class="cr-grey">电话：</text>
                                    <text class="cr-base" data-event="tel" :data-value="item.address_data.tel" @tap="text_event">{{ item.address_data.tel }}</text>
                                </view>
                                <view class="margin-top-sm pr">
                                    <text class="cr-grey va-t">地址：</text>
                                    <view class="dis-inline-block address-info">
                                        <text class="cr-base" data-event="copy" :data-value="item.address_data.address_info" @tap="text_event">{{ item.address_data.address_info }}</text>
                                        <view v-if="(item.address_data.lng || 0) != 0 && (item.address_data.lat || 0) != 0" class="icon-item bg-base circle dis-inline-block tc cp pa" :data-index="index" @tap.stop="address_map_event">
                                            <uni-icons type="paperplane-filled" size="32rpx" color="#666"></uni-icons>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view v-else class="single-text margin-top-sm">
                                <text class="cr-grey">地址：</text>
                                <text class="cr-grey-white">没有地址信息</text>
                            </view>
                            <view class="margin-top-lg padding-top-sm br-t-dashed">
                                <text>{{ item.describe }}</text>
                                <text v-if="(item.distance || null) != null" class="fr cr-grey">距您{{ item.distance }}</text>
                            </view>
                        </view>
                        <view class="item-operation tr br-t padding-top-main margin-top-main">
                            <button class="round bg-white br-base cr-base" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/delivery/order-detail/order-detail?id=' + item.id" @tap="url_event">详情</button>
                            <button v-if="item.status == 1" class="round bg-white br-blue cr-blue" type="default" size="mini" hover-class="none" :data-index="index" @tap="start_delivery_event">开始配送</button>
                            <button v-if="item.status == 4" class="round bg-white br-main cr-main" type="default" size="mini" hover-class="none" :data-index="index" @tap="start_delivery_event">再次配送</button>
                            <block v-if="item.status == 2">
                                <button class="round bg-white br-green cr-green" type="default" size="mini" hover-class="none" :data-index="index" @tap="success_delivery_event">完成配送</button>
                                <button class="round bg-white br-red cr-red" type="default" size="mini" hover-class="none" :data-index="index" @tap="popup_abnormal_content_event">异常</button>
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
                                <text>单ID：</text>
                                <text class="cp" data-event="copy" :data-value="item.main_order_id" @tap="text_event">{{item.main_order_id}}</text>
                            </view>
                            <view>
                                <text>单号：</text>
                                <text class="cp" data-event="copy" :data-value="item.main_order_no" @tap="text_event">{{item.main_order_no}}</text>
                            </view>
                            <view class="single-text">
                                <text>地址：</text>
                                <text class="cp" data-event="copy" :data-value="item.address_data.address_info" @tap="text_event">{{ item.address_data.address_info }}</text>
                            </view>
                            <view v-if="(item.address_data.lng || 0) != 0 && (item.address_data.lat || 0) != 0" class="map-send-icon bg-base circle tc cp pa" data-type="map" :data-index="index" @tap.stop="address_map_event">
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

        <!-- 异常订单原因填写 -->
        <component-popup :propShow="popup_abnormal_content_status" propPosition="bottom" @onclose="popup_abnormal_content_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_abnormal_content_close_event">
                        <uni-icons type="clear" size="46rpx" color="#999"></uni-icons>
                    </view>
                </view>
                <form @submit="form_delivery_submit_event" class="form-container">
                    <view class="form-container">
                        <view class="form-gorup">
                            <view class="form-gorup-title">异常原因</view>
                            <view class="br padding-main radius margin-top">
                                <textarea name="msg" placeholder-class="cr-grey" class="cr-base margin-0" placeholder="异常原因最多200个字符" maxlength="200" :auto-height="true"></textarea>
                            </view>
                        </view>
                        <view class="form-gorup form-gorup-submit">
                            <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">提交</button>
                        </view>
                    </view>
                </form>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";
    import componentBadge from "../../../../components/badge/badge";
    import componentPopup from "../../../../components/popup/popup";

    var plugins_static_url = app.globalData.get_static_url('delivery', true);
    export default {
        data() {
            return {
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
                show_type: 0,
                scale: 10,
                markers: [],
                markers_active_data: []
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentBadge,
            componentPopup,
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params,
            });
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        onShow() {
            // 位置实时监听
            this.start_location_update();
        },

        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init",
                        });
                        return false;
                    } else {
                        // 位置权限、回调并获取数据
                        app.globalData.get_location_check("scope.userLocation", this, "location_back_handle");
                    }
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
                        uni.navigateTo({
                            url: "/pages/common/open-setting-location/open-setting-location?is_check_success_back=1",
                        });
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
                uni.showLoading({
                    title: "加载中...",
                });

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
                        uni.hideLoading();
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
                                    if((item.address_data || null) != null && (item.address_data.lat || 0) != 0 && (item.address_data.lng || 0) != 0) {
                                        temp_markers.push({
                                            id: index,
                                            width: 30,
                                            height: 30,
                                            latitude: item.address_data.lat,
                                            longitude: item.address_data.lng,
                                            iconPath: plugins_static_url+'order.png'
                                        });
                                    }
                                });
                            }
                            this.setData({
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
                                data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
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
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast("服务器请求出错");
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
                    data_page: 1,
                });
                this.get_data_list(1);
            },

            // 地图查看
            address_map_event(e) {
                var index = e.currentTarget.dataset.index;
                var type = e.currentTarget.dataset.type || null;
                if(type == 'map') {
                    this.address_map_handle(this.markers_active_data[index]['address_data']);
                } else {
                    var temp_data = this.data_list;
                    if ((temp_data[index] || null) == null || (temp_data[index]["address_data"] || null) == null) {
                        app.globalData.showToast("地址有误");
                        return false;
                    }
                    this.address_map_handle(temp_data[index]["address_data"]);
                }
            },

            // 地址打开地图
            address_map_handle(ads) {
                var name = ads.alias || ads.name || "";
                app.globalData.open_location(ads.lng, ads.lat, name, ads.address_info);
            },

            // 异常订单开启弹层
            popup_abnormal_content_event(e) {
                this.setData({
                    popup_abnormal_content_status: true,
                    popup_abnormal_data_index: e.currentTarget.dataset.index,
                });
            },

            // 异常订单弹层关闭
            popup_abnormal_content_close_event(e) {
                this.setData({
                    popup_abnormal_content_status: false,
                });
            },

            // 开始配送
            start_delivery_event(e) {
                uni.showModal({
                    title: "温馨提示",
                    content: "确定开始配送订单吗？",
                    confirmText: "确认",
                    cancelText: "暂不",
                    success: (result) => {
                        if (result.confirm) {
                            this.order_status_handle({
                                index: e.currentTarget.dataset.index,
                                new_status: 2,
                                status_name: "配送中",
                                action: "startdelivery",
                            });
                        }
                    },
                });
            },

            // 完成配送
            success_delivery_event(e) {
                uni.showModal({
                    title: "温馨提示",
                    content: "确定订单已配送到客户地址？",
                    confirmText: "确认",
                    cancelText: "没有",
                    success: (result) => {
                        if (result.confirm) {
                            this.order_status_handle({
                                index: e.currentTarget.dataset.index,
                                new_status: 3,
                                status_name: "已配送",
                                action: "successdelivery",
                            });
                        }
                    },
                });
            },

            // 异常
            form_delivery_submit_event(e) {
                var msg = e.detail.value.msg || null;
                if (msg == null) {
                    app.globalData.showToast("请填写原因");
                } else {
                    this.order_status_handle({
                        index: this.popup_abnormal_data_index,
                        new_status: 4,
                        status_name: "异常",
                        action: "abnormaldelivery",
                        msg: msg,
                    });
                }
            },

            // 订单状态处理
            order_status_handle(params) {
                var temp_data = this.data_list;
                uni.showLoading({
                    title: "处理中...",
                });
                uni.request({
                    url: app.globalData.get_request_url(params.action, "order", "delivery"),
                    method: "POST",
                    data: {
                        id: temp_data[params.index]["id"],
                        msg: params.msg || "",
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
                                popup_abnormal_content_status: false,
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
                        app.globalData.showToast("服务器请求出错");
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
                        temp_markers[i]['iconPath'] = plugins_static_url+'order-active.png';
                    } else {
                        temp_markers[i]['iconPath'] = plugins_static_url+'order.png';
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
                        if((temp_data_list[i]['address_data'] || null) != null && (temp_data_list[i]['address_data']['lng'] || 0) != 0 && (temp_data_list[i]['address_data']['lat'] || 0) != 0 && temp.address_data.lng == temp_data_list[i]['address_data']['lng'] && temp.address_data.lat == temp_data_list[i]['address_data']['lat']) {
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