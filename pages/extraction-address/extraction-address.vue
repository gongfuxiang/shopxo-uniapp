<template>
    <view :class="theme_view">
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
                        <view v-if="(item.distance_value || null) != null && (item.distance_unit || null) != null" class="fl margin-top-sm">
                            <text class="cr-grey text-size-xs">{{$t('extraction-address.extraction-address.42v8tv')}}{{ item.distance_value }}{{ item.distance_unit }}</text>
                        </view>
                        <button v-if="(item.lng || 0) != 0 && (item.lat || 0) != 0" class="fr round bg-white cr-base br" type="default" size="mini" @tap="address_map_event" :data-index="index" hover-class="none">{{$t('buy.buy.o7722q')}}</button>
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

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>

<script>
const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";

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
                is_default: 0,
                is_first: 1,
                home_extraction_address_position: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
                home_extraction_address_position: app.globalData.get_config("config.home_extraction_address_position", 0),
            });
        },

        onReady() {
            // #ifndef MP-KUAISHOU
            // 是否获取位置、下单选择地址进入需要传参 is_buy
            if ((this.params.is_buy || 0) == 1 && this.home_extraction_address_position == 1) {
                app.globalData.choose_user_location_event();
            }
            // #endif
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // #ifndef MP-KUAISHOU
            // 是否需要选择地理位置、这里不校验参数is_buy，仅页面进入才需要校验is_buy进入位置选择页面
            if (this.home_extraction_address_position == 1) {
                // 首次不请求数据
                if (this.is_first == 0) {
                    // 先解绑自定义事件
                    uni.$off('refresh');
                    // 监听自定义事件并进行页面刷新操作
                    uni.$on('refresh', (data) => {
                        // 初始位置数据
                        if((data.location_success || false) == true) {
                            // 重新请求数据
                            // #ifdef APP
                            this.init();
                            // #endif
                        }
                    });

                    // 初始化数据
                    this.init();
                }
            } else {
                this.init();
            }
            // #endif
            // #ifdef MP-KUAISHOU
            this.init();
            // #endif

            // 首次状态
            this.setData({
                is_first: 0,
            });

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

            // 获取数据列表
            get_data_list() {
                this.setData({
                    data_list_loding_status: 1,
                });

                // 获取数据
                var data = this.params || {};

                // 是否有坐标
                var user_location = app.globalData.choice_user_location_init();
                if ((user_location || null) != null) {
                    data["lng"] = user_location.lng;
                    data["lat"] = user_location.lat;
                }

                // 请求接口
                uni.request({
                    url: app.globalData.get_request_url("extraction", "useraddress"),
                    method: "POST",
                    data: data,
                    dataType: "json",
                    success: (res) => {
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
        },
    };
</script>
<style>
    @import "./extraction-address.css";
</style>
