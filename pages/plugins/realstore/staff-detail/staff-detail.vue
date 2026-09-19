<template>
    <view :class="theme_view">
        <block v-if="(staff || null) != null">
            <view v-if="photo_list.length > 0" class="staff-photo-banner">
                <component-banner :propData="photo_list" propSize="max" propRadius="" :propIsSpacingMb="false" :propHeight="photo_height" propImageMode="aspectFill" propMode="count" :propRight="true" :propBottom="28" :propPreview="true"></component-banner>
            </view>
            <view :class="'staff-header padding-main bg-white spacing-mb' + (photo_list.length > 0 ? ' staff-header-cover' : '')">
                <view class="flex-row align-c">
                    <image v-if="(staff.avatar || null) != null && staff.avatar != ''" class="staff-avatar-large circle br margin-right-main" :src="staff.avatar" mode="aspectFill"></image>
                    <view v-else class="staff-avatar-large staff-avatar-placeholder circle br margin-right-main">
                        <iconfont name="icon-user" size="48rpx" color="#ccc"></iconfont>
                    </view>
                    <view class="flex-1 flex-width staff-info-content">
                        <view class="staff-title-row flex-row align-c flex-wrap">
                            <view class="fw-b text-size-lg staff-info-name flex-shrink-0">{{ staff.alias }}</view>
                            <view v-if="(staff.position_name || null) != null && staff.position_name != ''" class="staff-position-tag round bg-white br-grey cr-grey text-size-xs flex-shrink-0">{{ staff.position_name }}</view>
                            <view class="flex-1 flex-width"></view>
                            <text v-if="(staff.distance || '') != ''" class="staff-distance cr-grey text-size-xs flex-shrink-0">{{ $t('common.distance_from_you') }}{{ staff.distance }}</text>
                        </view>
                        <view v-if="(staff.rating || 0) > 0 || (staff.service_count || staff.booking_count || 0) > 0 || comments_count > 0 || earliest_time_show != ''" class="staff-stat-row margin-top-xs flex-row align-c flex-wrap">
                            <view v-if="earliest_time_show != ''" class="staff-specialty-tag round text-size-xss cr-main bg-main-light flex-shrink-0 margin-right-sm">{{ $t('realstore-staff.earliest') }}{{ earliest_time_show }}</view>
                            <view v-if="(staff.rating || 0) > 0 || (staff.service_count || staff.booking_count || 0) > 0 || comments_count > 0" class="staff-rating-tag round text-size-xss margin-right-sm flex-shrink-0">{{ $t('realstore-staff.rating') }} {{ (staff.rating || 0) > 0 ? staff.rating : '5.0' }}</view>
                            <text v-if="(staff.service_count || staff.booking_count || 0) > 0" class="cr-grey text-size-xs flex-shrink-0">{{ $t('realstore-staff.served') }}{{ staff.service_count || staff.booking_count }}{{ $t('realstore-staff.served_unit') }}</text>
                        </view>
                        <view v-if="(staff.work_years || 0) > 0 || ((staff.specialty_list || null) != null && staff.specialty_list.length > 0)" class="staff-meta margin-top-xs flex-row align-c flex-wrap">
                            <view v-if="(staff.work_years || 0) > 0" class="staff-work-years text-size-xs cr-base margin-right">{{ $t('realstore-staff.work_years_prefix') }}{{ staff.work_years }}{{ $t('realstore-staff.work_years_unit') }}</view>
                            <block v-if="(staff.specialty_list || null) != null && staff.specialty_list.length > 0">
                                <text class="text-size-xs cr-grey margin-right-xs margin-top-xs">{{ $t('realstore-staff.specialty') }}</text>
                                <view v-for="(tag, tindex) in staff.specialty_list" :key="tindex" class="staff-specialty-tag round text-size-xss cr-grey bg-grey-f5 margin-right-xs margin-top-xs">{{ tag }}</view>
                            </block>
                        </view>
                    </view>
                </view>
                <view v-if="(staff.introduce || '') != ''" class="staff-introduce text-size-xs cr-base margin-top radius padding-sm bg-grey-f8">{{ staff.introduce }}</view>

                <!-- 基础信息 -->
                <view v-if="profile_info_list.length > 0" class="staff-profile padding-top-xs">
                    <view class="staff-profile-grid">
                        <view v-for="(item, index) in (profile_expanded ? profile_info_list : profile_info_list.slice(0, 4))" :key="index" class="staff-profile-item">
                            <view class="staff-profile-label cr-grey text-size-xss">{{ item.label }}</view>
                            <view class="staff-profile-value text-size-sm single-text">{{ item.value }}</view>
                        </view>
                    </view>
                    <view v-if="profile_info_list.length > 4" class="staff-profile-toggle flex-row align-c jc-c cr-grey text-size-sm" @tap="profile_toggle_event">
                        <text>{{ profile_expanded ? $t('realstore-staff.collapse') : $t('realstore-staff.expand') }}</text>
                        <iconfont :name="profile_expanded ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="22rpx" color="#999" propClass="margin-left-xs"></iconfont>
                    </view>
                </view>
            </view>

            <!-- 所属门店（独立入口块） -->
            <view
                v-if="(realstore || null) != null && (realstore.name || '') != ''"
                class="staff-store-entry margin-horizontal-main spacing-mb flex-row align-c padding-main border-radius-main bg-white"
                :data-value="'/pages/plugins/realstore/detail/detail?id=' + realstore.id"
                @tap="url_event"
            >
                <image v-if="(realstore.logo || '') != ''" class="staff-store-logo radius br margin-right-sm" :src="realstore.logo" mode="aspectFill"></image>
                <view v-else class="staff-store-logo staff-store-logo-placeholder radius br margin-right-sm flex-row align-c jc-c">
                    <iconfont name="icon-store" size="28rpx" color="#999"></iconfont>
                </view>
                <view class="flex-1 flex-width">
                    <view class="text-size fw-b single-text">{{ realstore.name }}</view>
                    <view v-if="(realstore.status_info || null) != null && (realstore.status_info.time || '') != ''" class="cr-grey text-size-xs margin-top-xs single-text">{{ realstore.status_info.time }}</view>
                </view>
                <view class="staff-store-right flex-row align-c flex-shrink-0 margin-left-sm">
                    <view
                        v-if="(realstore.status_info || null) != null && (realstore.status_info.msg || '') != ''"
                        :class="'staff-store-status round text-size-xss margin-right-sm ' + ((realstore.status_info.status || 0) == 1 ? 'cr-green bg-green-light' : (realstore.status_info.type || 0) == 1 ? 'cr-red bg-red-light' : 'cr-grey')"
                    >{{ realstore.status_info.msg }}</view>
                    <iconfont name="icon-arrow-right" size="24rpx" color="#999"></iconfont>
                </view>
            </view>

            <!-- 评价预览 -->
            <view class="staff-comments-block margin-horizontal-main spacing-mb border-radius-main bg-white padding-main">
                <view class="flex-row align-c jc-sb">
                    <view class="flex-row align-c">
                        <text class="fw-b text-size">{{ $t('realstore-staff.comments') }}</text>
                        <text class="cr-grey text-size-xs margin-left-xs">({{ comments_count }})</text>
                    </view>
                    <view
                        class="flex-row align-c cr-grey text-size-xs"
                        :data-value="'/pages/plugins/realstore/service-comments/service-comments?staff_id=' + staff.id + '&realstore_id=' + (((realstore || null) == null) ? 0 : (realstore.id || 0))"
                        @tap="url_event"
                    >
                        <text>{{ $t('realstore-staff.positive_rate') }}{{ comments_rate }}%</text>
                        <iconfont name="icon-arrow-right" size="24rpx" color="#999" propClass="margin-left-xs"></iconfont>
                    </view>
                </view>
                <view v-if="comments_preview != null" class="staff-comment-preview margin-top-main">
                    <view class="flex-row align-c">
                        <image v-if="(comments_preview.user || null) != null && (comments_preview.user.avatar || '') != ''" class="staff-comment-avatar circle margin-right-sm" :src="comments_preview.user.avatar" mode="aspectFill"></image>
                        <view class="flex-1 flex-width">
                            <view class="text-size-sm">{{ ((comments_preview.user || null) == null) ? '' : (comments_preview.user.user_name_view || '') }}</view>
                            <view class="cr-grey text-size-xs margin-top-xs">{{ comments_preview.add_time }}</view>
                        </view>
                        <view class="cr-main text-size-sm">{{ comments_preview.rating }}{{ $t('orderallot-comments.score_unit') }}</view>
                    </view>
                    <view class="staff-comment-content margin-top-sm text-size-sm multi-text">{{ comments_preview.content }}</view>
                    <view v-if="(comments_preview.images || null) != null && comments_preview.images.length > 0" class="margin-top-sm flex-row flex-wrap">
                        <image
                            v-for="(img, ii) in comments_preview.images"
                            :key="ii"
                            class="staff-comment-image radius br margin-right-sm margin-bottom-sm"
                            :src="img"
                            mode="aspectFill"
                            :data-index="ii"
                            @tap="comment_images_preview_event"
                        ></image>
                    </view>
                    <view
                        class="staff-comments-more flex-row align-c jc-c cr-base text-size-sm margin-top-main"
                        :data-value="'/pages/plugins/realstore/service-comments/service-comments?staff_id=' + staff.id + '&realstore_id=' + (((realstore || null) == null) ? 0 : (realstore.id || 0))"
                        @tap="url_event"
                    >
                        <text>{{ $t('realstore-staff.view_all_comments') }}</text>
                        <iconfont name="icon-arrow-right" size="24rpx" color="#666" propClass="margin-left-xs"></iconfont>
                    </view>
                </view>
                <view v-else class="staff-comment-empty tc cr-grey text-size-xs margin-top-sm">{{ $t('realstore-staff.no_comments') }}</view>
            </view>

            <view id="staff-goods-section" class="padding-horizontal-main padding-bottom-main staff-goods-wrap">
                <view v-if="(goods_category || null) != null && goods_category.length > 0" class="scroll-view-horizontal margin-bottom-main">
                    <scroll-view :scroll-x="true" :scroll-with-animation="true" :show-scrollbar="false">
                        <view :class="'category-tab dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right ' + (category_active_id == 0 ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey bg-white')" :data-id="0" @tap="category_event">{{ $t('common.all') }}</view>
                        <block v-for="(item, index) in goods_category" :key="index">
                            <view :class="'category-tab dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right ' + (category_active_id == item.id ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey bg-white')" :data-id="item.id" @tap="category_event">{{ item.name }}</view>
                        </block>
                    </scroll-view>
                </view>
                <view :class="'staff-goods-list' + (goods_section_shake ? ' staff-goods-shake' : '')">
                    <view v-if="goods_list.length > 0">
                        <view v-for="(item, index) in goods_list" :key="index" class="goods-item padding-main border-radius-main bg-white spacing-mb flex-row cp" :data-index="index" @tap="goods_detail_event">
                            <image class="goods-image radius br margin-right-main" :src="item.images" mode="aspectFill"></image>
                            <view class="flex-1 flex-width goods-item-content flex-col jc-sb">
                                <view class="multi-text text-size-sm">{{ item.title }}</view>
                                <view class="goods-item-bottom flex-row align-c jc-sb">
                                    <view v-if="item.show_field_price_status == 1" class="flex-1 flex-width padding-right-main">
                                        <text class="sales-price fw-b">{{ item.show_price_symbol }}{{ item.price }}</text>
                                        <text class="cr-grey text-size-xs">{{ item.show_price_unit }}</text>
                                    </view>
                                    <view v-else class="flex-1 flex-width"></view>
                                    <block v-if="(item.is_error || 0) == 0">
                                        <button class="goods-select-btn round text-size-xs bg-main cr-white br-main" type="default" size="mini" hover-class="none" :data-index="index" @tap.stop="goods_select_event">
                                            {{ $t('realstore-staff.go_order') }}
                                        </button>
                                    </block>
                                    <block v-else>
                                        <text class="cr-grey-c text-size-xs">{{ item.is_error_msg }}</text>
                                    </block>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view v-else class="staff-goods-empty pr">
                        <component-no-data :propStatus="goods_list_loding_status" :propMsg="$t('realstore-staff.bookable_services_2')" :propBackBtn="false" propLoadingLogoTop="120rpx"></component-no-data>
                    </view>
                </view>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <view v-if="(staff || null) != null" class="staff-bottom-bar bg-white br-t flex-row align-c padding-horizontal-main">
            <view class="staff-bottom-icon-item tc margin-right-xl" @tap="share_event">
                <iconfont name="icon-share-square" size="36rpx" color="#666"></iconfont>
                <view class="text-size-xss cr-base margin-top-xs">{{ $t('common.share') }}</view>
            </view>
            <view class="staff-bottom-icon-item tc margin-right-main" @tap="favor_event">
                <view class="staff-bottom-icon-wrap pr dis-inline-block">
                    <iconfont :name="(favor_info.status || 0) == 1 ? 'icon-heart' : 'icon-heart-o'" size="36rpx" :color="(favor_info.status || 0) == 1 ? theme_color : '#666'"></iconfont>
                    <view class="badge-icon pa">
                        <component-badge :propNumber="favor_info.count || 0"></component-badge>
                    </view>
                </view>
                <view class="text-size-xss margin-top-xs" :class="(favor_info.status || 0) == 1 ? 'cr-main' : 'cr-base'">{{ (favor_info.status || 0) == 1 ? $t('realstore-staff.favored') : $t('realstore-staff.favor') }}</view>
            </view>
            <button class="staff-bottom-book-btn flex-1 flex-width round bg-main cr-white text-size" type="default" hover-class="none" @tap="book_now_event">{{ $t('realstore-staff.book_now') }}</button>
        </view>

        <component-goods-buy ref="goods_buy" @BackConfirmEvent="goods_buy_back_event"></component-goods-buy>
        <component-realstore-cart ref="staff_booking_cart" :propStatus="false" :propCurrencySymbol="currency_symbol" :propStaffBookingPopupTitle="$t('realstore-cart.select_time_slot')"></component-realstore-cart>
        <component-share-popup ref="share"></component-share-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentRealstoreCart from '@/pages/plugins/realstore/components/realstore-cart/realstore-cart';
    import componentBanner from '@/components/slider/slider';
    import componentSharePopup from '@/components/share-popup/share-popup';
    import componentBadge from '@/components/badge/badge';
    import pluginLocale from '../locale/index.js';

    const app = getApp();
    var system_info = app.globalData.get_system_info() || {};
    var win_width = parseInt(system_info.windowWidth || system_info.screenWidth || 0);
    var photo_height = (win_width <= 0) ? '55vh' : app.globalData.window_width_handle(win_width) + 'px';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                currency_symbol: app.globalData.currency_symbol(),
                params: null,
                realstore: null,
                staff: null,
                photo_list: [],
                photo_height: photo_height,
                goods_category: [],
                goods_list: [],
                category_active_id: 0,
                data_page: 1,
                data_page_total: 0,
                data_total: 0,
                data_is_loading: 0,
                goods_list_loding_status: 0,
                buy_use_type_data_index: 0,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                favor_info: { status: 0, count: 0 },
                profile_expanded: false,
                comments_count: 0,
                comments_data: [],
                comments_rate: 100,
                goods_section_shake: false,
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentGoodsBuy,
            componentRealstoreCart,
            componentBanner,
            componentSharePopup,
            componentBadge,
        },

        computed: {
            // 最早可约短文案：今天仅时刻，其它日期带日标签（如 Tomorrow22:00）
            earliest_time_show() {
                var booking = (this.staff || {}).earliest_booking || null;
                if (booking == null) {
                    return '';
                }
                var time = booking.start_time || '';
                if (time == '' && (booking.time_text || '') != '') {
                    time = String(booking.time_text).split(/[\s\-–—]/)[0] || '';
                }
                if (time == '') {
                    return booking.text || this.staff.earliest_booking_text || '';
                }
                if (parseInt(booking.is_today || 0) == 1 || (booking.day_label || '') == '') {
                    return time;
                }
                return booking.day_label + time;
            },
            // 基础信息网格（入驻/性别/年龄/身高/民族/属相/籍贯/星座）
            profile_info_list() {
                var staff = this.staff || {};
                var list = [];
                var push = (label, value) => {
                    if (value === null || value === undefined || value === '' || value === 0 || value === '0') {
                        return;
                    }
                    list.push({ label: label, value: String(value) });
                };
                push(this.$t('realstore-staff.join'), staff.join_month_text || '');
                push(this.$t('realstore-staff.gender'), staff.gender_name || '');
                push(this.$t('realstore-staff.age'), staff.age_group_text || '');
                push(this.$t('realstore-staff.height'), (staff.height || 0) > 0 ? String(staff.height) : '');
                push(this.$t('realstore-staff.nation'), staff.nation || '');
                push(this.$t('realstore-staff.zodiac'), staff.zodiac_name || '');
                push(this.$t('realstore-staff.native_place'), staff.native_place || '');
                push(this.$t('realstore-staff.constellation'), staff.constellation_name || '');
                return list;
            },
            // 评价预览（最新一条）
            comments_preview() {
                var list = this.comments_data || [];
                return list.length > 0 ? list[0] : null;
            },
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
            // 初始化配置
            this.init_config();

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
                goods_list: [],
                goods_list_loding_status: 1,
                data_bottom_line_status: false,
            });
            this.get_data();
        },

        onReachBottom() {
            this.get_goods_list();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            get_data() {
                if ((this.params || null) == null || (this.params.id || 0) <= 0) {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('realstore-staff.invalid_parameters'),
                    });
                    uni.stopPullDownRefresh();
                    return false;
                }

                this.setData({
                    data_list_loding_status: 1,
                    data_bottom_line_status: false,
                });
                uni.request({
                    url: app.globalData.get_request_url('detail', 'staff', 'realstore'),
                    method: 'POST',
                    data: (() => {
                        var post = { id: this.params.id };
                        var loc = app.globalData.choice_user_location_init() || {};
                        if ((loc.lng || 0) != 0 && (loc.lat || 0) != 0) {
                            post.lng = loc.lng;
                            post.lat = loc.lat;
                        }
                        return post;
                    })(),
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var staff = data.staff || null;
                            var photo_list = data.photo_list || [];
                            this.setData({
                                realstore: data.realstore || null,
                                staff: staff,
                                photo_list: photo_list,
                                favor_info: data.favor_info || { status: 0, count: 0 },
                                comments_count: data.comments_count || 0,
                                comments_data: data.comments_data || [],
                                comments_rate: (data.comments_rate === undefined || data.comments_rate === null) ? 100 : data.comments_rate,
                                goods_category: data.goods_category || [],
                                category_active_id: 0,
                                data_page: 1,
                                goods_list: [],
                                goods_list_loding_status: 1,
                                buy_use_type_data_index: this.get_buy_use_type_data_index(data.realstore || {}),
                                data_list_loding_status: 3,
                                data_bottom_line_status: false,
                            });

                            if (staff != null) {
                                // 基础自定义分享
                                var share_desc = [];
                                if ((staff.position_name || null) != null && staff.position_name != '') {
                                    share_desc.push(staff.position_name);
                                }
                                if ((staff.realstore || null) != null && (staff.realstore.name || '') != '') {
                                    share_desc.push(staff.realstore.name);
                                } else if ((data.realstore || null) != null && (data.realstore.name || '') != '') {
                                    share_desc.push(data.realstore.name);
                                }
                                var share_img = '';
                                if (photo_list.length > 0 && (photo_list[0].images_url || '') != '') {
                                    share_img = photo_list[0].images_url;
                                } else if ((staff.avatar || '') != '') {
                                    share_img = staff.avatar;
                                }
                                this.setData({
                                    share_info: {
                                        title: staff.alias || this.$t('pages.plugins-realstore-staff-detail'),
                                        desc: share_desc.join(' | '),
                                        path: '/pages/plugins/realstore/staff-detail/staff-detail',
                                        query: 'id=' + staff.id,
                                        img: share_img,
                                    },
                                });
                            }

                            this.get_goods_list(1);
                        } else {
                            uni.stopPullDownRefresh();
                            app.globalData.is_login_check(res.data);
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_bottom_line_status: false,
                            });
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_bottom_line_status: false,
                        });
                    },
                });
            },

            // 获取可预约商品列表
            get_goods_list(is_mandatory) {
                if ((this.staff || null) == null || (this.realstore || null) == null) {
                    uni.stopPullDownRefresh();
                    return false;
                }

                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                });

                var post_data = {
                    id: this.realstore.id,
                    staff_id: this.staff.id,
                    page: this.data_page,
                    category_id: this.category_active_id > 0 ? this.category_active_id : 0,
                };
                var request_category_id = this.category_active_id;

                uni.request({
                    url: app.globalData.get_request_url('datalist', 'detail', 'realstore'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        // 分类已切换则丢弃过期响应
                        if (request_category_id != this.category_active_id) {
                            return false;
                        }
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_goods_list = data.data;
                                } else {
                                    var temp_goods_list = this.goods_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_goods_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    goods_list: temp_goods_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    goods_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                this.setData({
                                    data_bottom_line_status: this.goods_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    goods_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        goods_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                goods_list_loding_status: 0,
                                data_is_loading: 0,
                            });
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        if (request_category_id != this.category_active_id) {
                            return false;
                        }
                        this.setData({
                            goods_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                    },
                });
            },

            // 商品分类切换
            category_event(e) {
                var category_id = parseInt(e.currentTarget.dataset.id || 0);
                if (category_id == this.category_active_id && this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    category_active_id: category_id,
                    data_page: 1,
                    goods_list: [],
                    goods_list_loding_status: 1,
                    data_bottom_line_status: false,
                    data_is_loading: 0,
                });
                this.get_goods_list(1);
            },

            // 解析门店下单类型索引
            get_buy_use_type_data_index(realstore) {
                var list = realstore.buy_use_type_list || [];
                if (list.length <= 0) {
                    return 0;
                }
                var cache_key = 'cache_plugins_realstore_buy_use_type_active_index_' + (realstore.id || 0);
                var active_index = uni.getStorageSync(cache_key);
                if (active_index !== null && active_index !== '' && list[active_index] != undefined) {
                    return parseInt(list[active_index]['index'] || 0);
                }
                var default_type = parseInt(realstore.default_buy_use_type || -1);
                if (default_type >= 0) {
                    for (var i in list) {
                        if (parseInt(list[i]['index']) == default_type) {
                            return default_type;
                        }
                    }
                }
                return parseInt(list[0]['index'] || 0);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 评价预览图片（多图可左右切换）
            comment_images_preview_event(e) {
                var list = ((this.comments_preview || null) == null) ? [] : (this.comments_preview.images || []);
                if (list.length <= 0) {
                    return;
                }
                var index = parseInt(e.currentTarget.dataset.index);
                if (isNaN(index) || index < 0 || index >= list.length) {
                    index = 0;
                }
                uni.previewImage({
                    current: list[index] || list[0],
                    urls: list,
                });
            },

            // 基础信息展开/收起
            profile_toggle_event() {
                this.setData({
                    profile_expanded: !this.profile_expanded,
                });
            },

            // 分享弹层
            share_event() {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info,
                    });
                }
            },

            // 立即预约：滚动到商品区 #staff-goods-section，并抖动提示选择
            book_now_event() {
                if ((this.goods_list || []).length <= 0 && this.goods_list_loding_status != 1) {
                    app.globalData.showToast(this.$t('realstore-staff.bookable_services_2'));
                    return false;
                }
                // 切回全部分类，方便选择
                if (this.category_active_id != 0) {
                    this.setData({
                        category_active_id: 0,
                        data_page: 1,
                        goods_list: [],
                        goods_list_loding_status: 1,
                        data_bottom_line_status: false,
                        data_is_loading: 0,
                    });
                    this.get_goods_list(1);
                }
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.scroll_to_goods_section(() => {
                            this.trigger_goods_section_shake();
                        });
                    }, 80);
                });
            },

            // 商品区域抖动提示（引导选择服务）
            trigger_goods_section_shake() {
                this.setData({ goods_section_shake: false });
                this.$nextTick(() => {
                    this.setData({ goods_section_shake: true });
                    clearTimeout(this._goods_shake_timer);
                    this._goods_shake_timer = setTimeout(() => {
                        this.setData({ goods_section_shake: false });
                    }, 500);
                });
            },

            // 滚动到商品区域，完成后回调
            scroll_to_goods_section(done) {
                // 节点位置用组件查询，页面滚动距离用 viewport（分开取，避免 scrollTop 为 0）
                var client = app.globalData.application_client();
                var scroll_duration = 300;
                // 小程序 complete 常会提前回调，按滚动时长延后，避免与抖动叠在一起像整页在晃
                var finish = () => {
                    clearTimeout(this._goods_scroll_timer);
                    this._goods_scroll_timer = setTimeout(() => {
                        if (typeof done == 'function') {
                            done();
                        }
                    }, scroll_duration + 120);
                };
                uni.createSelectorQuery()
                    .in(this)
                    .select('#staff-goods-section')
                    .boundingClientRect((rect) => {
                        if ((rect || null) == null) {
                            uni.pageScrollTo({
                                selector: '#staff-goods-section',
                                duration: scroll_duration,
                            });
                            finish();
                            return;
                        }
                        uni.createSelectorQuery()
                            .selectViewport()
                            .scrollOffset((scroll) => {
                                var top = ((scroll || {}).scrollTop || 0) + (rect.top || 0);
                                uni.pageScrollTo({
                                    scrollTop: top > 0 ? (client == 'h5' ? top+35 : top-10) : 0,
                                    duration: scroll_duration,
                                });
                                finish();
                            })
                            .exec();
                    })
                    .exec();
            },

            // 选择商品去下单
            goods_select_event(e) {
                var index = e.currentTarget.dataset.index;
                var goods = (this.goods_list || [])[index];
                if ((goods || null) == null) {
                    return false;
                }
                this.$refs.goods_buy.init(goods, {
                    buy_event_type: 'back',
                    is_success_tips: 0,
                    is_init: 1,
                });
            },

            // 进入商品详情
            goods_detail_event(e) {
                var index = e.currentTarget.dataset.index;
                var goods = (this.goods_list || [])[index];
                if ((goods || null) == null) {
                    return false;
                }
                var goods_id = parseInt(goods.goods_id || goods.id || 0);
                if (goods_id <= 0) {
                    return false;
                }
                if ((goods.goods_url || '') != '') {
                    app.globalData.url_open(goods.goods_url);
                    return false;
                }
                var realstore_id = parseInt(((this.realstore || null) == null) ? 0 : (this.realstore.id || 0));
                var url = '/pages/goods-detail/goods-detail?id=' + goods_id + '&is_opt_back=1&buy_use_type_data_index=' + this.buy_use_type_data_index;
                if (realstore_id > 0) {
                    url += '&realstore_id=' + realstore_id;
                }
                app.globalData.url_open(url);
            },

            // 收藏/取消
            favor_event() {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'favor_event');
                if (user != false) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('favor', 'staff', 'realstore'),
                        method: 'POST',
                        data: {
                            id: this.staff.id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    favor_info: res.data.data,
                                });
                                app.globalData.showToast(res.data.msg, 'success');
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'favor_event')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 规格确认回调：组装预约购物车并进入结算
            goods_buy_back_event(e) {
                var goods = e.goods || {};
                var spec = e.spec || [];
                var submit_spec = spec.map(function (v) { return { key: v.key }; });
                var stock = parseInt(e.buy_number || 1) || 1;
                var goods_id = parseInt(goods.goods_id || goods.id || 0);
                if (goods_id <= 0) {
                    return false;
                }

                var price = goods.price || 0;
                if ((goods.spec_base || null) != null && goods.spec_base.price != undefined) {
                    price = goods.spec_base.price;
                }

                var cart_item = {
                    id: 0,
                    goods_id: goods_id,
                    stock: stock,
                    title: goods.title || '',
                    images: goods.images || '',
                    price: price,
                    spec: spec,
                };
                var goods_item = {
                    goods_id: goods_id,
                    stock: stock,
                    spec: submit_spec,
                };
                var buy_data = {
                    buy_type: 'goods',
                    goods_data: encodeURIComponent(base64.encode(JSON.stringify([goods_item]))),
                    realstore_id: parseInt((this.realstore || {}).id || 0),
                    buy_use_type_data_index: this.buy_use_type_data_index,
                    staff_booking_cart_list: [cart_item],
                    staff_booking_prefer_staff_id: parseInt(this.staff.id || 0),
                    staff_booking_prefer_staff_alias: this.staff.alias || '',
                    staff_booking_prefer_staff_avatar: this.staff.avatar || '',
                };
                app.globalData.to_buy_handle(buy_data, '/pages/buy/buy', this);
            },
        },
    };
</script>
<style>
    @import './staff-detail.css';
</style>
