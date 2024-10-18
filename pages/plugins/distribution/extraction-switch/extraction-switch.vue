<template>
    <view :class="theme_view">
        <view class="page">
            <view v-if="data_list.length > 0" class="data-list padding-main">
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
                    <view v-if="((item.distance_value || null) != null && (item.distance_unit || null) != null) || ((item.lng || 0) != 0 && (item.lat || 0) != 0)" class="br-t oh padding-top-main margin-top-main">
                        <view v-if="(item.distance_value || null) != null && (item.distance_unit || null) != null" class="fl margin-top-lg">
                            <text class="cr-grey">{{$t('extraction-switch.extraction-switch.w94x36')}}</text>
                            <text class="cr-base">{{ item.distance_value }}</text>
                            <text class="cr-grey">{{ item.distance_unit }}</text>
                        </view>
                        <view class="item-operation fr oh">
                            <button v-if="(item.is_default || 0) == 0" class="round bg-white cr-green br-green" type="default" size="mini" @tap="address_switch_event" :data-index="index" hover-class="none">{{$t('buy.buy.inyxpx')}}</button>
                            <button v-if="(item.lng || 0) != 0 && (item.lat || 0) != 0" class="round bg-white cr-base br" type="default" size="mini" @tap="address_map_event" :data-index="index" hover-class="none">{{$t('buy.buy.o7722q')}}</button>
                        </view>
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

        <!-- 位置选择 -->
        <component-choice-location ref="choice_location" :propIsShowAddressChoice="false" @onBack="user_back_choice_location"></component-choice-location>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentChoiceLocation from '@/components/choice-location/choice-location';
    var common_static_url = app.globalData.get_static_url("common");
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_list: [],
                params: null,
                user_location: null,
                is_first: 1,
                home_extraction_address_position: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentChoiceLocation
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
                home_extraction_address_position: app.globalData.get_config("config.home_extraction_address_position", 0),
            });

            // 清除位置缓存信息
            app.globalData.choice_user_location_remove();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 是否需要选择地理位置
            if (this.home_extraction_address_position == 1) {
                // 用户位置初始化
                this.user_location_init();
            } else {
                this.init();
            }
            this.setData({
                is_first: 0,
            });

            // 是否获取位置
            if (this.home_extraction_address_position == 1) {
                if((this.user_location || null) == null || this.user_location.status != 1) {
                    this.$refs.choice_location.choose_user_location();
                }
            }

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

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
                    this.get_data_list();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 选择用户地理位置回调
            user_back_choice_location(e) {
                this.setData({
                    user_location: e
                });
                this.init();
            },

            // 地址信息初始化
            user_location_init() {
                this.setData({
                    user_location: app.globalData.choice_user_location_init()
                });
            },

            // 获取数据列表
            get_data_list() {
                // 加载loding
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });
                this.setData({
                    data_list_loding_status: 1,
                });

                // 获取数据
                var data = {};

                // 是否有坐标
                if ((this.user_location || null) != null) {
                    data["lng"] = this.user_location.lng;
                    data["lat"] = this.user_location.lat;
                }

                // 请求接口
                uni.request({
                    url: app.globalData.get_request_url("switchinfo", "extraction", "distribution"),
                    method: "POST",
                    data: data,
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.extraction_address.length > 0) {
                                this.setData({
                                    data_list: data.extraction_address,
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
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 地图查看
            address_map_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index] || null;
                if (data == null) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
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

            // 切换选择事件
            address_switch_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var temp_data = this.data_list;
                if ((temp_data[index] || null) == null) {
                    app.globalData.showToast(this.$t('extraction-switch.extraction-switch.613b58'));
                    return false;
                }

                // 请求切换
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url("switchsave", "extraction", "distribution"),
                    method: "POST",
                    data: {
                        id: temp_data[index]["id"],
                        value: temp_data[index]["id_old"] || 0,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, "success");
                            var temp_data = this.data_list;
                            for (var i in temp_data) {
                                temp_data[i]["is_default"] = i == index ? 1 : 0;
                            }
                            this.setData({
                                data_list: temp_data,
                            });
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style>
    @import "./extraction-switch.css";
</style>
