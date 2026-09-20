<template>
    <view :class="theme_view">
        <!-- 搜索 -->
        <component-nav-back :propFixed="false" propClass="bg-white cr-black" propColor="#333" :style="'padding-top:' + status_bar_height + 'px;'">
            <template slot="right" :class="is_mp_env ? 'top-search-width' : 'flex-1 flex-width'">
                <view class="staff-order-nav-right margin-left-main flex-row align-c">
                    <view class="staff-order-search flex-1 flex-width">
                        <component-search
                            @oninput="search_input_event"
                            :propIsOnInputEvent="true"
                            @onsearch="search_button_event"
                            :propIsOnEvent="true"
                            :propDefaultValue="search_keywords"
                            :propIsRequired="false"
                            :propPlaceholder="$t('staff-order.search_placeholder')"
                            propIconColor="#ccc"
                            propPlaceholderClass="cr-grey-c"
                            propBgColor="#f6f6f6"
                        ></component-search>
                    </view>
                    <view
                        v-if="is_edit_staff_profile == 1"
                        class="staff-profile-entry flex-row align-c jc-c"
                        @tap="staff_profile_event"
                    >
                        <iconfont name="icon-user-setup" size="40rpx" color="#333"></iconfont>
                    </view>
                </view>
            </template>
        </component-nav-back>
        <!-- 导航 -->
        <view v-if="nav_status_list.length > 0" class="nav-base bg-white scroll-view-horizontal">
            <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true">
                <block v-for="(item, index) in nav_status_list" :key="index">
                    <view :class="'item tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                </block>
            </scroll-view>
        </view>
        <!-- 数据列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" :style="content_style" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="list-item padding-horizontal-main padding-top-main border-radius-main bg-white oh spacing-mb">
                    <view class="item-base oh br-b padding-bottom-main" :data-value="'/pages/plugins/realstore/staff-order-detail/staff-order-detail?id=' + item.id" @tap="url_event">
                        <view class="fl">
                            <text class="cr-base">{{ item.order_allot_no }}</text>
                            <text v-if="(item.order_type_name || null) != null" class="order-type-tag br-main cr-main margin-left-sm">{{ item.order_type_name }}</text>
                        </view>
                        <text class="fr cr-red">{{ item.status_name }}</text>
                    </view>
                    <view v-if="(item.add_time || null) != null || list_address_text(item)" class="cr-grey text-size-xs padding-top-sm" :data-value="'/pages/plugins/realstore/staff-order-detail/staff-order-detail?id=' + item.id" @tap="url_event">
                        <view v-if="(item.add_time || null) != null">{{ item.add_time }}</view>
                        <view v-if="list_address_text(item)" class="margin-top-xs multi-text">{{ list_address_text(item) }}</view>
                    </view>
                    <view v-for="(detail, di) in item.items" :key="di" class="br-b-dashed oh padding-vertical-main" :data-value="'/pages/plugins/realstore/staff-order-detail/staff-order-detail?id=' + item.id" @tap="url_event">
                        <image class="goods-image fl radius" :src="detail.images" mode="aspectFill"></image>
                        <view class="goods-base pr">
                            <view class="multi-text">{{ detail.title }}</view>
                            <view v-if="detail.spec != null" class="margin-top-sm">
                                <block v-for="(sv, si) in detail.spec" :key="si">
                                    <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                    <text class="cr-grey">{{ sv.value }}</text>
                                </block>
                            </view>
                            <view class="margin-top-sm">
                                <text class="fw-b">{{ item.currency_data.currency_symbol }}{{ detail.price }}</text>
                                <text class="margin-left-sm">x{{ detail.buy_number }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="padding-vertical-main tr cr-base text-size">
                        <text>{{$t('common.total')}}<text class="fw-b">{{ item.buy_number_count }}</text>{{$t('common.total_pieces')}}<text class="sales-price margin-right-xs">{{ item.currency_data.currency_symbol }}{{ item.total_price }}</text></text>
                    </view>
                    <view v-if="staff_operate_show(item)" class="item-operation tr br-t padding-vertical-main">
                        <button v-if="is_buy_staff_booking == 1 && (item.operate_data.is_staff_booking || 0) == 1" class="round bg-white cr-main br-main" type="default" size="mini" @tap="staff_booking_event" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('staff-order.staff_booking') }}</button>
                        <button v-if="(item.operate_data.is_receive || 0) == 1" class="round bg-white cr-main br-main" type="default" size="mini" @tap="operate_event" data-action="receive" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('staff-order.receive') }}</button>
                        <button v-if="(item.operate_data.is_service || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="operate_event" data-action="service" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('staff-order.service_done') }}</button>
                        <button v-if="(item.operate_data.is_take || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="operate_event" data-action="take" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('staff-order.take') }}</button>
                        <button v-if="(item.operate_data.is_delivery || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="operate_event" data-action="delivery" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('staff-order.delivery') }}</button>
                        <button v-if="(item.operate_data.is_make_done || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="operate_event" data-action="makedone" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('staff-order.make_done') }}</button>
                        <button v-if="(item.operate_data.is_collect || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="operate_event" data-action="collect" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('common.receiving_goods') }}</button>
                        <button v-if="(item.operate_data.is_cancel || 0) == 1" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="operate_event" data-action="cancel" :data-value="item.id" :data-index="index" hover-class="none">{{ $t('common.cancel') }}</button>
                        <button class="round bg-white cr-base br-base" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/staff-order-detail/staff-order-detail?id=' + item.id" hover-class="none">{{ $t('common.detail_text') }}</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

        <component-staff-order-operate
            ref="staff_operate"
            :propExpressList="express_list"
            :propEditorPathType="editor_path_type"
            @success="operate_success"
        ></component-staff-order-operate>
        <component-orderallot-staff-booking ref="staff_booking" @success="operate_success"></component-orderallot-staff-booking>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentSearch from '@/components/search/search';
    import componentStaffOrderOperate from '../components/staff-order-operate/staff-order-operate';
    import componentOrderallotStaffBooking from '../components/orderallot-staff-booking/orderallot-staff-booking';
    import pluginLocale from '../locale/index.js';

    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO || H5
    bar_height = 0;
    // #endif

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                client_type: app.globalData.application_client_type(),
                status_bar_height: bar_height,
                is_mp_env: false,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || MP-QQ || MP-KUAISHOU
                is_mp_env: true,
                // #endif
                data_list: [],
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                search_keywords: '',
                content_style: '',
                nav_status_list: [],
                nav_status_index: 0,
                location_report_interval: 5,
                last_location_report_time: 0,
                express_list: [],
                editor_path_type: '',
                is_edit_staff_profile: 0,
                is_buy_staff_booking: 0,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentNavBack,
            componentSearch,
            componentStaffOrderOperate,
            componentOrderallotStaffBooking,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.setData({
                search_keywords: params.key || params.keywords || '',
                content_style: 'height: calc(100vh - 80rpx - ' + (this.status_bar_height + (this.client_type == 'h5' ? 55 : 50)) + 'px);',
            });
            this.init();
            this.start_location_update();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        onPullDownRefresh() {
            this.setData({ data_page: 1 });
            this.get_data_list(1);
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.load_init();
                    this.get_data_list(1);
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },
            load_init() {
                uni.request({
                    url: app.globalData.get_request_url('init', 'stafforder', 'realstore'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0 && (res.data.data || null) != null) {
                            this.setData({
                                nav_status_list: res.data.data.order_status_list || [],
                                location_report_interval: Math.max(0, parseInt(res.data.data.staff_location_report_interval || 5)),
                                express_list: res.data.data.express_list || [],
                                editor_path_type: res.data.data.editor_path_type || '',
                                is_edit_staff_profile: parseInt(res.data.data.is_edit_staff_profile || 0),
                                is_buy_staff_booking: parseInt(res.data.data.is_buy_staff_booking || 0),
                            });
                        } else if (res.data.code == -400) {
                            this.setData({
                                data_list: [],
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg || this.$t('staff-order.not_staff'),
                                data_bottom_line_status: false,
                            });
                        }
                    },
                });
            },
            list_address_text(item) {
                var addr = (item || {}).address_data || null;
                if (addr == null) {
                    return '';
                }
                var name = addr.name || '';
                var tel = addr.tel || '';
                var full = (addr.province_name || '') + (addr.city_name || '') + (addr.county_name || '') + (addr.address || '');
                var contact = (name + ' ' + tel).trim();
                if (contact != '' && full != '') {
                    return contact + ' · ' + full;
                }
                return contact || full;
            },
            start_location_update(e = null) {
                if (e == null) {
                    app.globalData.start_location_update(0, this, 'start_location_update');
                    return;
                }
                if ((e.status || 0) != 1) {
                    return;
                }
                var now = parseInt(Date.now() / 1000);
                var interval = Math.max(0, parseInt(this.location_report_interval || 5));
                if (interval > 0 && this.last_location_report_time > 0 && now - this.last_location_report_time < interval) {
                    return;
                }
                this.last_location_report_time = now;
                uni.request({
                    url: app.globalData.get_request_url('locationreport', 'staffuser', 'realstore'),
                    method: 'POST',
                    data: {
                        lat: e.lat,
                        lng: e.lng,
                    },
                    dataType: 'json',
                });
            },
            get_data_list(is_mandatory) {
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status == true) {
                    return false;
                }
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });
                if (this.data_page > 1) {
                    uni.showLoading({ title: this.$t('common.loading_in_text') });
                }
                var status = ((this.nav_status_list[this.nav_status_index] || null) == null) ? '-1' : this.nav_status_list[this.nav_status_index]['value'];
                uni.request({
                    url: app.globalData.get_request_url('index', 'stafforder', 'realstore'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        status: status,
                        key: this.search_keywords,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var list = data.data || [];
                            if (this.data_page <= 1) {
                                this.setData({
                                    data_list: list,
                                    data_total: data.total || 0,
                                    data_page_total: data.page_total || 0,
                                    data_list_loding_status: list.length > 0 ? 3 : 0,
                                    data_list_loding_msg: '',
                                    data_bottom_line_status: (list.length > 0 && (data.page_total || 0) <= 1),
                                    data_is_loading: 0,
                                });
                            } else {
                                this.setData({
                                    data_list: this.data_list.concat(list),
                                    data_list_loding_status: 3,
                                    data_list_loding_msg: '',
                                    data_bottom_line_status: this.data_page >= (data.page_total || 0),
                                    data_is_loading: 0,
                                });
                            }
                        } else {
                            var err_msg = res.data.msg || '';
                            if (res.data.code == -400) {
                                err_msg = err_msg || this.$t('staff-order.not_staff');
                            }
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: err_msg,
                                data_is_loading: 0,
                            });
                            if (res.data.code != -400) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                    },
                });
            },
            scroll_lower() {
                if (this.data_page < this.data_page_total) {
                    this.setData({ data_page: this.data_page + 1 });
                    this.get_data_list();
                }
            },
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },
            staff_operate_show(item) {
                var op = (item || {}).operate_data || {};
                return (
                    (this.is_buy_staff_booking == 1 ? (op.is_staff_booking || 0) : 0) +
                    (op.is_receive || 0) +
                    (op.is_service || 0) +
                    (op.is_take || 0) +
                    (op.is_delivery || 0) +
                    (op.is_make_done || 0) +
                    (op.is_collect || 0) +
                    (op.is_cancel || 0)
                ) > 0;
            },
            staff_booking_event(e) {
                var id = parseInt(e.currentTarget.dataset.value || 0);
                if(id <= 0 || (this.$refs.staff_booking || null) == null) {
                    return;
                }
                var idx = parseInt(e.currentTarget.dataset.index);
                var row = (!isNaN(idx) && (this.data_list || [])[idx]) ? this.data_list[idx] : null;
                var symbol = ((row && row.currency_data) || {}).currency_symbol || '';
                this.$refs.staff_booking.open(id, symbol);
            },
            operate_event(e) {
                var action = e.currentTarget.dataset.action || '';
                var id = e.currentTarget.dataset.value || 0;
                if (action == '' || id == 0) {
                    return;
                }
                // 自提 / 快递 / 外送：走对应弹层
                if (action == 'take' || action == 'delivery' || action == 'service') {
                    if ((this.$refs.staff_operate || null) != null) {
                        var idx = parseInt(e.currentTarget.dataset.index);
                        var row = (!isNaN(idx) && (this.data_list || [])[idx]) ? this.data_list[idx] : null;
                        this.$refs.staff_operate.open(action, id, action == 'delivery' ? ((row && row.express_data) || []) : null);
                    }
                    return;
                }
                var title_map = {
                    receive: this.$t('staff-order.confirm_receive'),
                    makedone: this.$t('staff-order.confirm_make_done'),
                    collect: this.$t('common.confirm_goods_been_received_completed_cannot'),
                    cancel: this.$t('common.cancel_confirm_tips'),
                };
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: title_map[action] || this.$t('common.confirm'),
                    success: (res) => {
                        if (!res.confirm) {
                            return;
                        }
                        this.submit_operate(action, id, {});
                    },
                });
            },
            submit_operate(action, id, extra) {
                uni.showLoading({ title: this.$t('common.processing_in_text') });
                var data = Object.assign({ id: id }, extra || {});
                uni.request({
                    url: app.globalData.get_request_url(action, 'stafforder', 'realstore'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        app.globalData.showToast(res.data.msg);
                        if (res.data.code == 0) {
                            this.operate_success();
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            operate_success() {
                this.setData({ data_page: 1 });
                this.get_data_list(1);
            },
            search_input_event(e) {
                this.setData({
                    search_keywords: e,
                });
            },
            search_button_event(e) {
                this.setData({
                    search_keywords: e,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },

            // 员工资料修改入口
            staff_profile_event() {
                if (this.is_edit_staff_profile != 1) {
                    return;
                }
                app.globalData.url_open('/pages/plugins/realstore/staff-profile/staff-profile');
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
@import './staff-order.css';
</style>
