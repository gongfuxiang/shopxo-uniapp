<template>
    <view :class="theme_view">
        <block v-if="(data_base || null) != null">
                <view class="realstore-nav-bg" :style="'background-image:url('+(nav_title_bg || '')+')'">
                <!-- 位置 + 搜索 + 地图 -->
                <view class="nav-top-row padding-horizontal-main flex-row align-s pr z-i cr-white">
                    <view class="nav-location flex-row align-c">
                        <component-choice-location ref="choice_location" propTextMaxWidth="140rpx" @onBack="user_back_choice_location"></component-choice-location>
                    </view>
                    <view class="nav-search flex-1 flex-width margin-left">
                        <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" :propPlaceholder="$t('realstore-staff.search_staff_name')" propPlaceholderClass="cr-grey-c" propBgColor="#fff"></component-search>
                    </view>
                    <view v-if="(data_base.is_staff_search_map || 0) == 1" class="nav-map-entry flex-row align-c jc-c margin-left-sm" @tap="search_map_event">
                        <iconfont name="icon-map-location" color="#fff" size="40rpx"></iconfont>
                    </view>
                </view>
            </view>

            <view v-if="slider_list.length > 0" class="padding-horizontal-main">
                <component-banner :propData="slider_list"></component-banner>
            </view>

            <!-- 员工列表导航 -->
            <view v-if="icon_list.length > 0" class="padding-horizontal-main spacing-mb">
                <view class="bg-white border-radius-main">
                    <component-icon-nav :propData="{...{data: icon_list}, ...{random: random_value}}"></component-icon-nav>
                </view>
            </view>

            <block v-if="data_list.length > 0">
                <view class="padding-horizontal-main">
                    <component-title :propTitle="data_base.staff_home_staff_list_title || $t('index.nearby_staff')" :propMoreUrl="'/pages/plugins/realstore/staff-search/staff-search'"></component-title>
                    <view v-for="(item, index) in data_list" :key="index" class="staff-item padding-main border-radius-main bg-white spacing-mb cp" :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + item.id" @tap="url_event">
                        <view class="flex-row">
                            <image v-if="(item.avatar || null) != null && item.avatar != ''" class="staff-avatar-large circle br margin-right-main" :src="item.avatar" mode="aspectFill"></image>
                            <view v-else class="staff-avatar-large staff-avatar-placeholder circle br margin-right-main">
                                <iconfont name="icon-user" size="48rpx" color="#ccc"></iconfont>
                            </view>
                            <view class="flex-1 flex-width staff-item-content">
                                <view class="staff-title-row flex-row align-c flex-wrap">
                                    <view class="fw-b text-size staff-info-name flex-shrink-0">{{ item.alias }}</view>
                                    <view v-if="(item.position_name || null) != null && item.position_name != ''" class="staff-position-tag round bg-white br-grey cr-grey text-size-xs flex-shrink-0">{{ item.position_name }}</view>
                                    <view class="flex-1 flex-width"></view>
                                    <text v-if="(item.distance || '') != ''" class="staff-distance cr-grey text-size-xs flex-shrink-0">{{ item.distance }}</text>
                                </view>
                                <view v-if="staff_earliest_show(item) != '' || (item.rating || 0) > 0 || (item.service_count || item.booking_count || 0) > 0" class="staff-stat-row margin-top-xs flex-row align-c flex-wrap">
                                    <view v-if="staff_earliest_show(item) != ''" class="staff-specialty-tag round text-size-xss cr-main bg-main-light flex-shrink-0 margin-right-sm">{{ $t('realstore-staff.earliest') }}{{ staff_earliest_show(item) }}</view>
                                    <view v-if="(item.rating || 0) > 0 || (item.service_count || item.booking_count || 0) > 0" class="staff-rating-tag round text-size-xss margin-right-sm flex-shrink-0">{{ $t('realstore-staff.rating') }} {{ (item.rating || 0) > 0 ? item.rating : '5.0' }}</view>
                                    <text v-if="(item.service_count || item.booking_count || 0) > 0" class="cr-grey text-size-xs flex-shrink-0">{{ $t('realstore-staff.served') }}{{ item.service_count || item.booking_count }}{{ $t('realstore-staff.served_unit') }}</text>
                                </view>
                                <view class="staff-store-row margin-top-xs flex-row align-c">
                                    <text v-if="(item.realstore || null) != null && (item.realstore.name || '') != ''" class="single-text flex-1 flex-width cr-grey text-size-xs">{{ item.realstore.name }}</text>
                                    <view v-else class="flex-1 flex-width"></view>
                                    <view class="staff-store-meta flex-row align-c flex-shrink-0">
                                        <view class="staff-meta-icon flex-row align-c">
                                            <iconfont name="icon-message-o" size="24rpx" color="#ccc"></iconfont>
                                            <text class="cr-grey text-size-xs margin-left-xs">{{ item.comments_count || 0 }}</text>
                                        </view>
                                        <view class="staff-meta-icon flex-row align-c">
                                            <iconfont name="icon-heart-o" size="24rpx" color="#ccc"></iconfont>
                                            <text class="cr-grey text-size-xs margin-left-xs">{{ item.favor_count || 0 }}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="staff-bottom-row margin-top-sm flex-row align-c">
                            <view class="staff-meta flex-1 flex-width flex-row align-c flex-wrap">
                                <view v-if="(item.work_years || 0) > 0" class="text-size-xs cr-base margin-right">{{ $t('realstore-staff.work_years_prefix') }}{{ item.work_years }}{{ $t('realstore-staff.work_years_unit') }}</view>
                                <block v-if="(item.specialty_list || null) != null && item.specialty_list.length > 0">
                                    <text class="text-size-xs cr-grey margin-right-xs">{{ $t('realstore-staff.specialty') }}</text>
                                    <view v-for="(tag, tindex) in item.specialty_list.slice(0, 3)" :key="tindex" class="staff-specialty-tag round text-size-xss cr-grey bg-grey-f5 margin-right-xs">{{ tag }}</view>
                                </block>
                            </view>
                            <button class="staff-book-btn round text-size-xs bg-main cr-white br-main flex-shrink-0" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + item.id" @tap.stop="url_event">{{ $t('realstore-staff.book') }}</button>
                        </view>
                    </view>
                </view>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" propLoadingLogoTop="45vh"></component-no-data>
            </view>

            <!-- 位置选择提示 -->
            <view v-if="location_tips_close_status && (data_base.is_staff_home_choice_location || 0) == 1 && ((data_base.staff_home_choice_location_images || null) != null || (data_base.staff_home_choice_location_msg || null) != null)" class="choice-location-tips pf wh-auto ht-auto tc bs-bb">
                <view class="content bg-white auto padding-xxxl pr radius">
                    <view v-if="(data_base.is_staff_home_choice_location_force || 0) == 0" class="close oh pa">
                        <view @tap="location_tips_close_event">
                            <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="padding-lg">
                        <image v-if="(data_base.staff_home_choice_location_images || null) != null" class="icon max-w" :src="data_base.staff_home_choice_location_images" mode="widthFix"></image>
                        <view v-if="(data_base.staff_home_choice_location_msg || null) != null" class="cr-base margin-top-lg">{{ data_base.staff_home_choice_location_msg }}</view>
                        <button type="default" class="bg-main br-main cr-white text-size-sm margin-top-xxl round" hover-class="none" @tap="choose_user_location_event">{{$t('index.select_location')}}</button>
                    </view>
                </view>
            </view>
        </block>
        <block v-else>
            <component-no-data :propStatus="index_loding_status" :propMsg="index_loding_msg"></component-no-data>
        </block>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentBanner from '@/components/slider/slider';
    import componentSearch from '@/components/search/search';
    import componentIconNav from '@/components/icon-nav/icon-nav';
    import componentTitle from '@/components/title/title';
    import componentChoiceLocation from '@/components/choice-location/choice-location';
    import pluginLocale from '../locale/index.js';
    var plugins_static_url = app.globalData.get_static_url('realstore', true);

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                plugins_static_url: plugins_static_url,
                screen_width: parseInt(app.globalData.get_system_info('windowWidth', 0, true)),
                slider_list: [],
                icon_list: [],
                random_value: 0,
                is_first: 1,
                index_loding_status: 1,
                index_loding_msg: '',
                data_base: null,
                data_list: [],
                data_list_loding_status: 0,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                user_location: {},
                location_tips_close_status: false,
                // 自定义分享信息
                share_info: {},
                // 顶部背景图
                nav_title_bg: plugins_static_url+'staff-title-bg.png',
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentBanner,
            componentSearch,
            componentIconNav,
            componentTitle,
            componentChoiceLocation,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
            // #ifdef H5
            window.addEventListener('resize', this.handle_resize, true);
            // #endif
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 用户位置初始化
            this.user_location_init();

            // 数据加载
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        // 页面销毁时执行
        onUnload: function () {
            // #ifdef H5
            window.removeEventListener('resize', this.handle_resize);
            // #endif
        },

        methods: {
            // 获取数据
            get_data() {
                this.setData({
                    index_loding_status: 1,
                    data_bottom_line_status: false,
                });
                var lng = 0;
                var lat = 0;
                if ((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'staff', 'realstore'),
                    method: 'POST',
                    data: {
                        lng: lng,
                        lat: lat,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var data_list = data.data_list || [];
                            this.setData({
                                data_base: data.base || null,
                                slider_list: data.slider_list || [],
                                icon_list: data.icon_list || [],
                                data_list: data_list,
                                random_value: Math.random(),
                                index_loding_status: 3,
                                data_list_loding_status: data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: '',
                                data_bottom_line_status: data_list.length > 0,
                                nav_title_bg: this.nav_title_bg_handle(data.base || {}),
                            });

                            // 用户位置初始化
                            this.user_location_init();

                            // 是否自动获取用户当前位置
                            if(this.is_first == 1 && (this.data_base || null) != null) {
                                if(app.globalData.data.get_user_location_status != 1 && parseInt(this.data_base.is_staff_home_auto_user_location || 0) == 1) {
                                    app.globalData.get_user_location(this, 'user_back_auto_location', true);
                                }
                            }

                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.$t('pages.plugins-realstore-staff-list'),
                                    desc: this.$t('realstore-staff.bookable_staff_across_all_stores'),
                                    path: '/pages/plugins/realstore/staff-list/staff-list',
                                },
                                is_first: 0,
                            });

                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            uni.stopPullDownRefresh();
                            app.globalData.is_login_check(res.data);
                            this.setData({
                                index_loding_status: 0,
                                index_loding_msg: res.data.msg,
                                data_bottom_line_status: false,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            index_loding_status: 2,
                            index_loding_msg: this.$t('common.internet_error_tips'),
                            data_bottom_line_status: false,
                        });
                    },
                });
            },

            // 搜索事件
            search_button_event(e) {
                var params = (e === '') ? '' : '?keywords=' + e;
                app.globalData.url_open('/pages/plugins/realstore/staff-search/staff-search' + params);
            },

            // 地图搜索入口
            search_map_event() {
                app.globalData.url_open('/pages/plugins/realstore/staff-search/staff-search?show_type_mode=1');
            },

            // 选择地理位置
            choose_user_location_event(e) {
                if ((this.$refs.choice_location || null) != null) {
                    this.$refs.choice_location.choose_user_location_event();
                }
            },

            // 自动获取位置回调
            user_back_auto_location(e) {
                this.user_back_choice_location(e);
            },

            // 选择用户地理位置回调
            user_back_choice_location(e) {
                this.setData({
                    user_location: e,
                    location_tips_close_status: e.status != 1
                });
                this.get_data();
            },

            // 地址信息初始化
            user_location_init() {
                var res = app.globalData.choice_user_location_init();
                this.setData({
                    user_location: res
                });
                if(res.status != 1 && (this.data_base || null) != null && parseInt(this.data_base.is_staff_home_auto_user_location || 0) != 1) {
                    this.setData({
                        location_tips_close_status: true
                    });
                }
            },

            // 地址选择提示关闭事件
            location_tips_close_event(e) {
                this.setData({
                    location_tips_close_status: false,
                });
            },

            // 页面宽度变化监听
            handle_resize() {
                // #ifdef H5
                this.setData({
                    screen_width: window.innerWidth,
                    nav_title_bg: this.nav_title_bg_handle(this.data_base || {}),
                });
                // #endif
            },

            // 顶部背景图处理
            nav_title_bg_handle(data_base = {}) {
                var is_pc = this.screen_width > 960;
                if (is_pc) {
                    return data_base.staff_home_title_bg_pc_images || this.plugins_static_url + 'staff-title-bg-pc.png';
                }
                return data_base.staff_home_title_bg_images || this.plugins_static_url + 'staff-title-bg.png';
            },

            // 最早可约短文案（今天仅时刻，其它带日标签，如 Tomorrow08:00）
            staff_earliest_show(item) {
                var booking = (item || {}).earliest_booking || null;
                if (booking == null) {
                    return '';
                }
                var time = booking.start_time || '';
                if (time == '' && (booking.time_text || '') != '') {
                    time = String(booking.time_text).split(/[\s\-–—]/)[0] || '';
                }
                if (time == '') {
                    return booking.text || item.earliest_booking_text || '';
                }
                if (parseInt(booking.is_today || 0) == 1 || (booking.day_label || '') == '') {
                    return time;
                }
                return booking.day_label + time;
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './staff-list.css';
</style>
