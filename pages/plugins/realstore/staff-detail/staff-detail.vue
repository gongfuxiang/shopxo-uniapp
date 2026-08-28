<template>
    <view :class="theme_view">
        <block v-if="(staff || null) != null">
            <view v-if="photo_list.length > 0" class="staff-photo-banner">
                <component-banner :propData="photo_list" propSize="max" propRadius="" :propIsSpacingMb="false" :propHeight="photo_height" propImageMode="aspectFill"></component-banner>
            </view>
            <view class="staff-header padding-main bg-white spacing-mb">
                <view v-if="(staff.booking_count || 0) > 0" class="staff-booking-count cr-grey text-size-xs">{{ $t('realstore-staff.booked') }}{{ staff.booking_count }}</view>
                <view class="flex-row align-c">
                    <image v-if="(staff.avatar || null) != null && staff.avatar != ''" class="staff-avatar-large circle br margin-right-main" :src="staff.avatar" mode="aspectFill"></image>
                    <view v-else class="staff-avatar-large staff-avatar-placeholder circle br margin-right-main">
                        <iconfont name="icon-user" size="48rpx" color="#ccc"></iconfont>
                    </view>
                    <view class="flex-1 flex-width staff-info-content">
                        <view class="flex-row align-c staff-name-row">
                            <view class="fw-b text-size-lg staff-info-name flex-shrink-0">{{ staff.alias }}</view>
                            <view v-if="(staff.position_name || null) != null && staff.position_name != ''" class="staff-position-tag round bg-white br-yellow cr-yellow text-size-xs flex-shrink-0">{{ staff.position_name }}</view>
                        </view>
                        <view v-if="(staff.realstore || null) != null && (staff.realstore.name || '') != ''" class="cr-grey text-size-xs margin-top-xs single-text">{{ staff.realstore.name }}</view>
                    </view>
                </view>
            </view>

            <view class="padding-horizontal-main padding-bottom-main">
                <view v-if="(goods_category || null) != null && goods_category.length > 0" class="scroll-view-horizontal margin-bottom-main">
                    <scroll-view :scroll-x="true" :scroll-with-animation="true" :show-scrollbar="false">
                        <view :class="'category-tab dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right ' + (category_active_id == 0 ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey bg-white')" :data-id="0" @tap="category_event">{{ $t('common.all') }}</view>
                        <block v-for="(item, index) in goods_category" :key="index">
                            <view :class="'category-tab dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right ' + (category_active_id == item.id ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey bg-white')" :data-id="item.id" @tap="category_event">{{ item.name }}</view>
                        </block>
                    </scroll-view>
                </view>
                <view v-if="goods_list.length > 0">
                    <view v-for="(item, index) in goods_list" :key="index" class="goods-item padding-main border-radius-main bg-white spacing-mb flex-row">
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
                                    <button class="goods-select-btn round text-size-xs bg-main cr-white br-main" type="default" size="mini" hover-class="none" :data-index="index" @tap="goods_select_event">
                                        {{ $t('realstore-staff.select') }}
                                    </button>
                                </block>
                                <block v-else>
                                    <text class="cr-grey-c text-size-xs">{{ item.is_error_msg }}</text>
                                </block>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <component-no-data :propStatus="goods_list_loding_status" :propMsg="$t('realstore-staff.bookable_services_2')" :propLoadingLogoTop="(photo_list.length > 0 ? 85 : 35)+'vh'"></component-no-data>
                </view>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <component-goods-buy ref="goods_buy" @BackConfirmEvent="goods_buy_back_event"></component-goods-buy>
        <component-realstore-cart ref="staff_booking_cart" :propStatus="false" :propCurrencySymbol="currency_symbol" :propStaffBookingPopupTitle="$t('realstore-cart.select_time_slot')"></component-realstore-cart>
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
                    data: {
                        id: this.params.id,
                    },
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

                uni.request({
                    url: app.globalData.get_request_url('datalist', 'detail', 'realstore'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
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
                        this.setData({
                            goods_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                    },
                });
            },

            category_event(e) {
                var category_id = parseInt(e.currentTarget.dataset.id || 0);
                this.setData({
                    category_active_id: category_id,
                    data_page: 1,
                    goods_list: [],
                    goods_list_loding_status: 1,
                    data_bottom_line_status: false,
                });
                this.get_goods_list(1);
            },

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

            goods_buy_back_event(e) {
                var goods = e.goods || {};
                var spec = e.spec || [];
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
                    spec: spec,
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
