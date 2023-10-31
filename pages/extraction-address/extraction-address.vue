<template>
    <view>
        <view class="page">
            <view v-if="data_list.length > 0" class="padding-main">
                <view v-for="(item, index) in data_list" :key="index" class="item bg-white padding-main border-radius-main spacing-mb">
                    <view @tap="address_conent_event" :data-index="index" class="oh">
                        <view v-if="(item.logo || null) != null" class="fl oh margin-right-lg">
                            <image class="dis-block address-logo radius" :src="item.logo" mode="widthFix"></image>
                        </view>
                        <view class="oh">
                            <view class="base oh padding-bottom-main padding-top-xs">
                                <text v-if="(item.alias || null) != null" class="address-alias br-main cr-main round margin-right-sm">{{ item.alias }}</text>
                                <text>{{ item.name }}</text>
                                <text class="fr">{{ item.tel }}</text>
                            </view>
                            <view class="address oh padding-top-sm">
                                <image class="item-icon fl margin-top-xs" :src="common_static_url + 'map-icon.png'" mode="widthFix"></image>
                                <view class="text fr"> {{ item.province_name || "" }}{{ item.city_name || "" }}{{ item.county_name || "" }}{{ item.address || "" }} </view>
                            </view>
                        </view>
                    </view>
                    <view v-if="((item.distance_value || null) != null && (item.distance_unit || null) != null) || ((item.lng || 0) != 0 && (item.lat || 0) != 0)" class="item-operation br-t oh padding-top-main margin-top-main">
                        <view v-if="(item.distance_value || null) != null && (item.distance_unit || null) != null" class="fl margin-top-lg">
                            <text class="cr-grey">距离</text>
                            <text class="cr-base">{{ item.distance_value }}</text>
                            <text class="cr-grey">{{ item.distance_unit }}</text>
                        </view>
                        <button v-if="(item.lng || 0) != 0 && (item.lat || 0) != 0" class="fr round bg-white cr-base br" type="default" size="mini" @tap="address_map_event" :data-index="index" hover-class="none">查看地图</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
    </view>
</template>

<script>
const app = getApp();
import componentNoData from "../../components/no-data/no-data";
import componentBottomLine from "../../components/bottom-line/bottom-line";

var common_static_url = app.globalData.get_static_url("common");
export default {
    data() {
        return {
            common_static_url: common_static_url,
            data_list_loding_status: 1,
            data_bottom_line_status: false,
            data_list: [],
            params: null,
            is_default: 0,
            user_location_cache_key: app.globalData.data.cache_userlocation_key,
            user_location: null,
            is_first: 1,
            home_extraction_address_position: 0,
        };
    },

    components: {
        componentNoData,
        componentBottomLine,
    },
    props: {},

    onLoad(params) {
        this.setData({
            params: params,
            home_extraction_address_position: app.globalData.get_config("config.home_extraction_address_position", 0),
        });
    },

    onReady: function () {
        // 清除位置缓存信息
        uni.removeStorage({
            key: this.user_location_cache_key,
        });

        // #ifndef MP-KUAISHOU
        // 是否获取位置、下单选择地址进入需要传参 is_buy
        if ((this.params.is_buy || 0) == 1 && this.home_extraction_address_position == 1) {
            uni.navigateTo({
                url: "/pages/common/open-setting-location/open-setting-location",
            });
        }
        // #endif
    },

    onShow() {
        // #ifndef MP-KUAISHOU
        // 是否需要选择地理位置、这里不校验参数is_buy，仅页面进入才需要校验is_buy进入位置选择页面
        if (this.home_extraction_address_position == 1) {
            // 首次不请求数据
            if (this.is_first == 0) {
                this.user_location_init();
                this.init();
            }
        } else {
            this.init();
        }
        // #endif
        // #ifdef MP-KUAISHOU
        this.init();
        // #endif

        this.setData({
            is_first: 0,
        });

        // 分享菜单处理
        app.globalData.page_share_handle();
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.get_data_list();
    },

    methods: {
        // 初始化
        init() {
            var user = app.globalData.get_user_info(this, "init");
            if (user != false) {
                // 用户未绑定手机则转到登录页面
                if (app.globalData.user_is_need_login(user)) {
                    uni.redirectTo({
                        url: "/pages/login/login?event_callback=init",
                    });
                    return false;
                } else {
                    // 获取数据
                    this.get_data_list();
                }
            } else {
                this.setData({
                    data_list_loding_status: 0,
                    data_bottom_line_status: false,
                });
            }
        },

        // 地址信息初始化
        user_location_init() {
            var result = uni.getStorageSync(this.user_location_cache_key) || null;
            var data = null;
            if (result != null) {
                data = {
                    name: result.name || null,
                    address: result.address || null,
                    lat: result.latitude || null,
                    lng: result.longitude || null,
                };
            }
            this.setData({
                user_location: data,
            });
        },

        // 获取数据列表
        get_data_list() {
            // 加载loding
            uni.showLoading({
                title: "加载中...",
            });
            this.setData({
                data_list_loding_status: 1,
            });

            // 获取数据
            var data = this.params || {};

            // 是否有坐标
            if ((this.user_location || null) != null) {
                data["lng"] = this.user_location.lng;
                data["lat"] = this.user_location.lat;
            }

            // 请求接口
            uni.request({
                url: app.globalData.get_request_url("extraction", "useraddress"),
                method: "POST",
                data: data,
                dataType: "json",
                success: (res) => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        if (res.data.data.length > 0) {
                            // 获取当前默认地址
                            var is_default = 0;
                            for (var i in res.data.data) {
                                if (res.data.data[i]["is_default"] == 1) {
                                    is_default = res.data.data[i]["id"];
                                }
                            }

                            // 设置数据
                            this.setData({
                                data_list: res.data.data,
                                is_default: is_default,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                            });
                        }
                    } else {
                        this.setData({
                            data_list_loding_status: 0,
                        });
                        if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
                            app.globalData.showToast(res.data.msg);
                        }
                    }
                },
                fail: () => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_list_loding_status: 2,
                    });
                    app.globalData.showToast("服务器请求出错");
                },
            });
        },

        // 地图查看
        address_map_event(e) {
            var index = e.currentTarget.dataset.index || 0;
            var data = this.data_list[index] || null;
            if (data == null) {
                app.globalData.showToast("地址有误");
                return false;
            }

            // 打开地图
            var name = data.alias || data.name || "";
            var address = (data.province_name || "") + (data.city_name || "") + (data.county_name || "") + (data.address || "");
            app.globalData.open_location(data.lng, data.lat, name, address);
        },

        // 地址内容事件
        address_conent_event(e) {
            var index = e.currentTarget.dataset.index || 0;
            var is_back = this.params.is_back || 0;
            if (is_back == 1) {
                uni.setStorage({
                    key: app.globalData.data.cache_buy_user_address_select_key,
                    data: this.data_list[index],
                });
                uni.navigateBack();
            }
        },
    },
};
</script>
<style>
@import "./extraction-address.css";
</style>
