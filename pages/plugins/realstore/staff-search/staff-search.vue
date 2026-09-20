<template>
    <view :class="theme_view">
        <block v-if="(data_base || null) != null">
            <!-- 顶部 -->
            <view class="bg-white padding-main oh flex-row jc-sb align-c" :class="show_type_mode == 1 ? 'map padding-bottom' : ''">
                <!-- 位置 -->
                <view v-if="show_type_mode == 0" class="nav-location flex-row align-c single-text margin-right-sm">
                    <component-choice-location ref="choice_location" propBaseColor="#666" propTextMaxWidth="180rpx" @onBack="user_back_choice_location"></component-choice-location>
                </view>
                <!-- 搜索 -->
                <view class="nav-search" :class="show_type_mode == 1 ? 'map' : ''">
                    <component-search @oninput="search_input_event" :propIsOnInputEvent="true" @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" :propDefaultValue="search_keywords_value" :propPlaceholder="$t('realstore-staff.search_staff_name')" propPlaceholderClass="cr-grey-c" propBgColor="#f5f5f5"></component-search>
                </view>
                <view v-if="is_search_map == 1" class="nav-map-switch dis-inline-block margin-left" @tap="show_event">
                    <iconfont :name="show_type_mode == 1 ? 'icon-list-dot' : 'icon-map-location'" color="#666" size="38rpx"></iconfont>
                </view>
            </view>

            <!-- 地图 -->
            <view v-show="show_type_mode == 1" class="map-container pr" :class="list_is_fold ? 'fold' : ''">
                <map class="wh-auto ht-auto"
                    :enable-zoom="true"
                    :enable-scroll="true"
                    :show-location="true"
                    :latitude="latitude"
                    :longitude="longitude"
                    :scale="map_scale"
                    :markers="markers"
                    @regionchange="region_change_event"
                    @markertap="marker_tap_event"
                ></map>
                <image v-if="map_center_icon_status == 1" class="map-center-icon pa" :src="map_location_icon" mode="aspectFit"></image>
            </view>

            <!-- 列表收起/展开（地图模式） -->
            <view v-if="show_type_mode == 1" class="list-fold-bar flex-row align-c jc-c bg-white" @tap="list_fold_event">
                <view class="list-fold-handle"></view>
                <iconfont :name="list_is_fold ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx" color="#999" propClass="margin-left-xs"></iconfont>
            </view>

            <!-- 纵滑列表（独立节点，小程序不与横滑共用滚动状态） -->
            <scroll-view
                v-if="!list_is_fold"
                :scroll-y="true"
                :scroll-top="scroll_top"
                :scroll-with-animation="list_scroll_animation"
                class="scroll-box scroll-box-ece-nav js-list-scroll-y"
                :class="show_type_mode == 1 ? 'map' : ''"
                @scrolltolower="scroll_lower"
                lower-threshold="60"
            >
                <component-staff-search-list
                    ref="staff_list_y"
                    :propDataList="data_list"
                    :propIsFold="false"
                    :propIsMap="show_type_mode == 1"
                    :propLodingStatus="data_list_loding_status"
                    :propLodingMsg="data_list_loding_msg"
                ></component-staff-search-list>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </scroll-view>

            <!-- 横滑列表（仅折叠时挂载） -->
            <scroll-view
                v-if="list_is_fold"
                :scroll-x="true"
                :scroll-left="scroll_left"
                :scroll-with-animation="list_scroll_animation"
                class="scroll-box scroll-box-ece-nav map fold js-list-scroll-x"
            >
                <component-staff-search-list
                    ref="staff_list_x"
                    :propDataList="data_list"
                    :propIsFold="true"
                    :propIsMap="true"
                    :propLodingStatus="data_list_loding_status"
                    :propLodingMsg="data_list_loding_msg"
                ></component-staff-search-list>
            </scroll-view>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentSearch from "@/components/search/search";
    import componentChoiceLocation from '@/components/choice-location/choice-location';
    import componentStaffSearchList from './staff-search-list.vue';
    import pluginLocale from '../locale/index.js';
    var plugins_static_url = app.globalData.get_static_url('realstore', true);
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                data_is_loading: 0,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                params: null,
                data_base: null,
                search_keywords_value: "",
                // 显示类型模式（0列表，1地图）
                show_type_mode: 0,
                // 地图
                is_search_map: 0,
                map_location_icon: plugins_static_url+'app/staff-search/location-icon.png',
                markers_icon: plugins_static_url+'app/staff-search/markers-icon.png',
                markers_icon_active: '',
                map_scale: 12,
                latitude: 39.909,
                longitude: 116.39742,
                markers: [],
                map_center_icon_status: 1,
                markers_active_index: null,
                scroll_top: 0,
                scroll_left: 0,
                list_scroll_animation: true,
                // 地图模式下列表是否收起（收起后单行横滑）
                list_is_fold: false,
                // 用户位置信息
                user_location: {},
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentBottomLine,
            componentSearch,
            componentChoiceLocation,
            componentStaffSearchList
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
                show_type_mode: parseInt(params.show_type_mode || 0),
                search_keywords_value: params.keywords || "",
            });

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 用户位置初始化
            this.user_location_init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 标题设置
            uni.setNavigationBarTitle({
                title: this.$t('pages.plugins-realstore-staff-search')
            });
        },

        methods: {
            // 初始化
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "staff", "realstore"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_base = data.base || {};
                            var is_search_map = parseInt(data_base.is_staff_search_map || 0);
                            this.setData({
                                data_base: data.base || null,
                                is_search_map: is_search_map,
                                // 未开启地图则强制列表模式
                                show_type_mode: is_search_map == 1 ? this.show_type_mode : 0,
                                map_scale: (data_base.staff_search_map_scale === undefined || data_base.staff_search_map_scale === null || data_base.staff_search_map_scale === '') ? 12 : parseInt(data_base.staff_search_map_scale),
                                markers_icon: data_base.staff_search_map_staff_icon || this.markers_icon,
                                markers_icon_active: data_base.staff_search_map_staff_icon_active || '',
                                map_location_icon: data_base.staff_search_map_location_icon || this.map_location_icon,
                            });

                            // 获取列表数据
                            this.get_data_list(1);
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
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

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 基础自定义分享
                this.share_info_handle();

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({ data_is_loading: 1 });

                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 用户位置
                var lng = 0;
                var lat = 0;
                if ((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("datalist", "staff", "realstore"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        keywords: this.search_keywords_value,
                        lng: this.longitude || lng,
                        lat: this.latitude || lat,
                    },
                    dataType: "json",
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
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
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
                            }

                            // 地图展示
                            var temp_markers = [];
                            if(this.data_list.length > 0) {
                                this.data_list.forEach((item, index) => {
                                    if ((item.lat || 0) != 0 && (item.lng || 0) != 0) {
                                        temp_markers.push({
                                            id: index,
                                            width: 25,
                                            height: 25,
                                            latitude: item.lat,
                                            longitude: item.lng,
                                            iconPath: this.markers_icon
                                        });
                                    }
                                });
                            }
                            this.setData({
                                markers: temp_markers,
                                markers_active_index: null
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
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

            // 搜索输入事件
            search_input_event(e) {
                this.setData({
                    search_keywords_value: e
                });
            },

            // 搜索事件
            search_button_event(e) {
                this.setData({
                    search_keywords_value: e,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },

            // 分享处理
            share_info_handle() {
                this.setData({
                    share_info: {
                        title: this.$t('pages.plugins-realstore-staff-search'),
                        path: '/pages/plugins/realstore/staff-search/staff-search',
                        query: 'keywords='+(this.search_keywords_value || ''),
                    }
                });
                app.globalData.page_share_handle(this.share_info);
            },

            // 选择用户地理位置回调
            user_back_choice_location(e) {
                this.setData({
                    user_location: e,
                    data_page: 1,
                });
                // 重新请求数据
                this.get_data_list(1);
            },

            // 地址信息初始化
            user_location_init() {
                var user_location = app.globalData.choice_user_location_init();
                var upd_data = {
                    user_location: user_location
                };
                if ((user_location || null) != null) {
                    upd_data['longitude'] = user_location.lng;
                    upd_data['latitude'] = user_location.lat;
                }
                this.setData(upd_data);
            },

            // 显示类型事件
            show_event(e) {
                var next_mode = (this.show_type_mode == 1) ? 0 : 1;
                this.setData({
                    show_type_mode: next_mode,
                    list_is_fold: next_mode == 1 ? this.list_is_fold : false,
                    scroll_top: 0,
                    scroll_left: 0,
                });
            },

            // 地图模式列表收起/展开
            list_fold_event() {
                var next_fold = !this.list_is_fold;
                var active_index = this.markers_active_index;
                var has_active = active_index !== null && active_index !== undefined && active_index !== '' && !isNaN(parseInt(active_index));

                this.setData({
                    list_is_fold: next_fold,
                    list_scroll_animation: false,
                    scroll_top: 0,
                    scroll_left: 0,
                });

                setTimeout(() => {
                    this.setData({
                        list_scroll_animation: true,
                    });
                    if(has_active) {
                        this.list_scroll_to_index(parseInt(active_index));
                    }
                }, 180);
            },

            // 点击标记点事件
            marker_tap_event(e) {
                var index = parseInt(e.detail.markerId);
                if(isNaN(index) || index < 0) {
                    return;
                }
                this.data_markers_active_handle(index);
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.list_scroll_to_index(index);
                    }, 60);
                });
            },

            // 列表滚动到指定下标（用 scroll-top/left，不依赖组件内 id）
            list_scroll_to_index(index) {
                index = parseInt(index);
                if(isNaN(index) || index < 0) {
                    return;
                }
                if(this.list_is_fold) {
                    this.set_fold_scroll_left(index);
                } else {
                    this.set_col_scroll_top(index);
                }
            },

            // 强制更新滚动值（相同值不会触发）
            bump_scroll_value(key, value) {
                var current = this[key] || 0;
                var next = value;
                if(Math.abs(current - value) < 0.5) {
                    next = value + 0.5;
                }
                var data = {};
                data[key] = next;
                this.setData(data);
            },

            // 纵滑定位
            set_col_scroll_top(index) {
                var self = this;
                var fallback = uni.upx2px(index * 320);
                var list_ref = this.$refs.staff_list_y;
                this.$nextTick(() => {
                    setTimeout(() => {
                        var apply_top = function(box, offset, item_rect) {
                            var top = fallback;
                            if(box != null && item_rect != null && offset != null) {
                                top = Math.max(0, (offset.scrollTop || 0) + item_rect.top - box.top);
                            }
                            self.bump_scroll_value('scroll_top', top);
                        };
                        uni.createSelectorQuery().in(self)
                            .select('.js-list-scroll-y').boundingClientRect()
                            .select('.js-list-scroll-y').scrollOffset()
                            .select('#staff-item-' + index).boundingClientRect()
                            .selectAll('.staff-scroll-target').boundingClientRect()
                            .exec((res) => {
                                var box = (res || [])[0] || null;
                                var offset = (res || [])[1] || null;
                                var rect = (res || [])[2] || null;
                                if(rect == null) {
                                    rect = ((res || [])[3] || [])[index] || null;
                                }
                                if(rect != null || !list_ref) {
                                    apply_top(box, offset, rect);
                                    return;
                                }
                                uni.createSelectorQuery().in(list_ref)
                                    .select('#staff-item-' + index).boundingClientRect()
                                    .selectAll('.staff-scroll-target').boundingClientRect()
                                    .exec((item_res) => {
                                        var item_rect = (item_res || [])[0] || null;
                                        if(item_rect == null) {
                                            item_rect = ((item_res || [])[1] || [])[index] || null;
                                        }
                                        apply_top(box, offset, item_rect);
                                    });
                            });
                    }, 30);
                });
            },

            // 横滑定位
            set_fold_scroll_left(index) {
                var self = this;
                var fallback = uni.upx2px(index * 644);
                var list_ref = this.$refs.staff_list_x;
                this.$nextTick(() => {
                    setTimeout(() => {
                        var apply_left = function(rect) {
                            var target = fallback;
                            if(rect != null && (rect.width || 0) > 0) {
                                target = index * rect.width;
                            }
                            self.bump_scroll_value('scroll_left', target);
                        };
                        uni.createSelectorQuery().in(self)
                            .select('.staff-scroll-target.is-fold').boundingClientRect()
                            .exec((res) => {
                                var rect = (res || [])[0] || null;
                                if(rect != null || !list_ref) {
                                    apply_left(rect);
                                    return;
                                }
                                uni.createSelectorQuery().in(list_ref)
                                    .select('.staff-scroll-target.is-fold').boundingClientRect()
                                    .exec((item_res) => {
                                        apply_left((item_res || [])[0] || null);
                                    });
                            });
                    }, 30);
                });
            },

            // 用户和覆盖物选中处理
            data_markers_active_handle(index) {
                // 新数组，确保选中态能传到列表组件（小程序尤甚）
                var temp_data_list = (this.data_list || []).map((item, i) => {
                    return Object.assign({}, item, {
                        active: (i == index) ? 'active' : '',
                    });
                });
                // 覆盖物
                var temp_markers = this.markers;
                for(var i in temp_markers) {
                    if(i == index) {
                        temp_markers[i]['iconPath'] = this.markers_icon_active || temp_data_list[temp_markers[i]['id']]['avatar'] || this.markers_icon;
                    } else {
                        temp_markers[i]['iconPath'] = this.markers_icon;
                    }
                }
                // 设置数据（保持中心定位图标显示）
                this.setData({
                    markers_active_index: index,
                    markers: temp_markers,
                    data_list: temp_data_list,
                });
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
                            longitude: e.detail.centerLocation.longitude,
                            data_page: 1,
                            data_list: [],
                            data_list_loding_status: 1,
                            data_bottom_line_status: false,
                        });
                        this.get_data_list(1);
                    } else {
                        this.setData({
                            map_center_icon_status: 1,
                        });
                    }
                }
            },
        }
    };
</script>
<style>
    @import "./staff-search.css";
</style>
