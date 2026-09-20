<template>
    <view :class="theme_view">
        <block v-if="(detail || null) != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 状态与操作（对齐门店订单详情） -->
                <view class="bg-white padding-main border-radius-main tc spacing-mb">
                    <view class="padding-vertical-xl">
                        <block v-if="status_progress_style == 'danger'">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-sigh-o" size="68rpx" propClass="cr-red"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-red">{{ status_progress_name }}</text>
                        </block>
                        <block v-else-if="status_progress_style == 'success'">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-enable" size="68rpx" propClass="cr-green"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-green">{{ status_progress_name }}</text>
                        </block>
                        <block v-else-if="status_progress_style == 'primary'">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-inventroy-manage" size="68rpx" propClass="cr-blue"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-blue">{{ status_progress_name }}</text>
                        </block>
                        <block v-else-if="status_progress_style == 'warning'">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-wait-receive-delivery" size="68rpx" propClass="cr-yellow"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-yellow">{{ status_progress_name }}</text>
                        </block>
                        <block v-else>
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-wait-payment" size="68rpx"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm">{{ status_progress_name }}</text>
                        </block>
                        <view v-if="status_progress_tips" class="cr-grey text-size-xs margin-top-sm">{{ status_progress_tips }}</view>
                        <view v-if="status_progress_steps.length > 0" class="make-progress-steps margin-top-main">
                            <view
                                v-for="(step, index) in status_progress_steps"
                                :key="index"
                                class="make-progress-step"
                                :class="make_step_class(index)"
                            >
                                <view class="make-progress-node">
                                    <view class="make-progress-dot" :class="make_step_done(index) || make_step_active(index) ? 'bg-main' : ''">
                                        <text v-if="make_step_done(index)" class="make-progress-dot-check cr-white">✓</text>
                                        <text v-else class="make-progress-dot-num" :class="make_step_active(index) ? 'cr-white' : 'cr-grey'">{{ index + 1 }}</text>
                                    </view>
                                    <view v-if="index < status_progress_steps.length - 1" class="make-progress-line" :class="make_step_done(index) ? 'bg-main' : ''"></view>
                                </view>
                                <text class="make-progress-name" :class="make_step_active(index) ? 'cr-main' : (make_step_done(index) ? 'cr-base' : 'cr-grey')">{{ step.name }}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if="staff_operate_show(detail)" class="item-operation margin-top-sm tc">
                        <button v-if="is_buy_staff_booking == 1 && (detail.operate_data.is_staff_booking || 0) == 1" class="round bg-white cr-main br-main" type="default" size="mini" @tap="staff_booking_event" hover-class="none">{{ $t('staff-order.staff_booking') }}</button>
                        <button v-if="(detail.operate_data.is_receive || 0) == 1" class="round bg-white cr-main br-main" type="default" size="mini" @tap="operate_event" data-action="receive" hover-class="none">{{ $t('staff-order.receive') }}</button>
                        <button v-if="(detail.operate_data.is_service || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="operate_event" data-action="service" hover-class="none">{{ $t('staff-order.service_done') }}</button>
                        <button v-if="(detail.operate_data.is_take || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="operate_event" data-action="take" hover-class="none">{{ $t('staff-order.take') }}</button>
                        <button v-if="(detail.operate_data.is_delivery || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="operate_event" data-action="delivery" hover-class="none">{{ $t('staff-order.delivery') }}</button>
                        <button v-if="(detail.operate_data.is_make_done || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="operate_event" data-action="makedone" hover-class="none">{{ $t('staff-order.make_done') }}</button>
                        <button v-if="(detail.operate_data.is_collect || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="operate_event" data-action="collect" hover-class="none">{{ $t('common.receiving_goods') }}</button>
                        <button v-if="(detail.operate_data.is_cancel || 0) == 1" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="operate_event" data-action="cancel" hover-class="none">{{ $t('common.cancel') }}</button>
                    </view>
                </view>

                <!-- 取货信息 -->
                <view v-if="extraction_take_show" class="extraction-take panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ $t('common.take_info_title') }}</view>
                    <view class="padding-top-main">
                        <view v-if="(detail.extraction_data.items || null) != null && detail.extraction_data.items.length > 0" class="extraction-take-switch">
                            <view v-if="detail.extraction_data.items.length > 1" class="extraction-take-arrow extraction-take-prev" @tap="extraction_take_prev_event">
                                <iconfont name="icon-angle-left" size="36rpx" color="#666"></iconfont>
                            </view>
                            <view class="extraction-take-body">
                                <view v-if="(detail.extraction_data.items[extraction_take_index].goods_url || null) != null && detail.extraction_data.items[extraction_take_index].goods_url != ''" class="extraction-take-goods cp" :data-value="detail.extraction_data.items[extraction_take_index].goods_url" @tap="url_event">
                                    <image v-if="(detail.extraction_data.items[extraction_take_index].goods_images || null) != null" class="extraction-take-goods-images br radius" :src="detail.extraction_data.items[extraction_take_index].goods_images" mode="aspectFill"></image>
                                    <view class="extraction-take-goods-title text-size-sm multi-text">{{ detail.extraction_data.items[extraction_take_index].goods_title || '' }}</view>
                                </view>
                                <view v-else class="extraction-take-goods">
                                    <image v-if="(detail.extraction_data.items[extraction_take_index].goods_images || null) != null" class="extraction-take-goods-images br radius" :src="detail.extraction_data.items[extraction_take_index].goods_images" mode="aspectFill"></image>
                                    <view class="extraction-take-goods-title text-size-sm multi-text">{{ detail.extraction_data.items[extraction_take_index].goods_title || '' }}</view>
                                </view>
                                <view class="extraction-take-code tc">
                                    <image v-if="(detail.extraction_data.items[extraction_take_index].images || null) != null" class="qrcode br radius" :src="detail.extraction_data.items[extraction_take_index].images" mode="aspectFill"></image>
                                    <view class="extraction-take-meta margin-top-sm">
                                        <text class="extraction-take-meta-label cr-grey">{{ $t('common.take_code_label') }}</text>
                                        <view class="extraction-take-meta-value">
                                            <block v-if="(detail.extraction_data.items[extraction_take_index].code || null) == null || detail.extraction_data.items[extraction_take_index].code == ''">
                                                <text class="cr-red">{{ $t('common.pickup_code_does_exist_contact_administrator') }}</text>
                                            </block>
                                            <block v-else>
                                                <view class="dis-inline-block" :data-value="detail.extraction_data.items[extraction_take_index].code" @tap="text_copy_event">
                                                    <text class="fw-b cr-blue text-size">{{ detail.extraction_data.items[extraction_take_index].code }}</text>
                                                    <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs va-m margin-left-sm">{{ $t('common.copy') }}</text>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                    <view class="extraction-take-meta margin-top-xs">
                                        <text class="extraction-take-meta-label cr-grey">{{ $t('common.take_verify_label') }}</text>
                                        <view class="extraction-take-meta-value">
                                            <text class="cr-green">{{ detail.extraction_data.items[extraction_take_index].verify_number || 0 }}</text>
                                            <text class="cr-grey">/</text>
                                            <text>{{ detail.extraction_data.items[extraction_take_index].total_number || 1 }}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view v-if="detail.extraction_data.items.length > 1" class="extraction-take-arrow extraction-take-next" @tap="extraction_take_next_event">
                                <iconfont name="icon-angle-right" size="36rpx" color="#666"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 地址 -->
                <view v-if="(detail.order_type == 0 || detail.order_type == 1 || detail.order_type == 2) && (detail.address_data || null) != null" class="address bg-white padding-main border-radius-main spacing-mb">
                    <view class="address-base oh">
                        <text v-if="(detail.address_data.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{ detail.address_data.alias }}</text>
                        <text class="cp" :data-value="detail.address_data.name" @tap="text_copy_event">{{ detail.address_data.name }}</text>
                        <text class="fr cp" :data-value="detail.address_data.tel" @tap="tel_event">{{ detail.address_data.tel }}</text>
                    </view>
                    <view class="address-detail oh cp" :data-value="address_full_text(detail.address_data)" @tap="text_copy_event">
                        <image class="icon fl" :src="common_static_url + 'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text>{{ address_full_text(detail.address_data) }}</text>
                        </view>
                    </view>
                </view>

                <!-- 商品信息 -->
                <view class="bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b">{{ $t('common.product_information') }}</view>
                    <view v-for="(g, gi) in detail.items" :key="gi" class="oh padding-vertical-main br-b-dashed cp" :data-value="goods_detail_url(g)" @tap="url_event">
                        <image class="goods-image fl radius" :src="g.images" mode="aspectFill"></image>
                        <view class="goods-base">
                            <view class="multi-text">{{ g.title }}</view>
                            <view v-if="g.spec != null" class="margin-top-sm">
                                <block v-for="(sv, si) in g.spec" :key="si">
                                    <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                    <text class="cr-grey">{{ sv.value }}</text>
                                </block>
                            </view>
                            <view class="margin-top-sm">
                                <text class="fw-b">{{ detail.currency_data.currency_symbol }}{{ g.price }}</text>
                                <text class="margin-left-sm">x{{ g.buy_number }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="padding-top-main tr">
                        <text>{{ $t('common.total') }} {{ detail.buy_number_count }} {{ $t('common.total_pieces') }}</text>
                        <text class="sales-price margin-left-sm">{{ detail.currency_data.currency_symbol }}{{ detail.total_price }}</text>
                    </view>
                </view>

                <!-- 服务人员 -->
                <view v-if="(detail.staff_data || null) != null && detail.staff_data.length > 0" class="staff-data bg-white padding-horizontal-main padding-top-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ $t('staff-order.staff_data') }}</view>
                    <view v-for="(sv, si) in detail.staff_data" :key="si" class="staff-data-item oh padding-vertical-main cp" :class="si + 1 < detail.staff_data.length ? 'br-b-dashed' : ''" :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + sv.staff_id" @tap="url_event">
                        <image class="staff-data-avatar fl radius" :src="sv.avatar" mode="aspectFill"></image>
                        <view class="staff-data-base">
                            <view class="staff-data-name-row flex-row jc-sb align-c">
                                <view class="flex-1 flex-width single-text">
                                    <text class="fw-b va-m">{{ sv.alias }}</text>
                                    <text v-if="(sv.is_self || 0) == 1" class="staff-self-tag br-grey cr-grey margin-left-sm va-m">{{ $t('staff-order.self_tag') }}</text>
                                </view>
                                <text v-if="staff_settle_text(sv)" class="staff-settle-text cr-green text-size-xs margin-left-sm">{{ $t('staff-order.settle_info') }}{{ staff_settle_text(sv) }}</text>
                            </view>
                            <view v-if="((sv.mobile || null) != null && sv.mobile != '') || ((sv.email || null) != null && sv.email != '')" class="staff-data-contact flex-row align-c flex-wrap margin-top-xs">
                                <view v-if="(sv.mobile || null) != null && sv.mobile != ''" class="staff-contact-item flex-row align-c cp margin-right-main" :data-value="sv.mobile" @tap.stop="tel_event">
                                    <iconfont name="icon-tel" size="24rpx" color="#999"></iconfont>
                                    <text class="cr-grey text-size-xs margin-left-xs">{{ sv.mobile }}</text>
                                </view>
                                <view v-if="(sv.email || null) != null && sv.email != ''" class="staff-contact-item flex-row align-c cp" :data-value="sv.email" @tap.stop="text_copy_event">
                                    <iconfont name="icon-email" size="24rpx" color="#999"></iconfont>
                                    <text class="cr-grey text-size-xs margin-left-xs">{{ sv.email }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 预约数据 -->
                <view v-if="(detail.staff_booking_data || null) != null && detail.staff_booking_data.length > 0" class="staff-booking bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ $t('orderallot-detail.booking_data') }}</view>
                    <view v-for="(group, gindex) in detail.staff_booking_data" :key="gindex" :class="'staff-booking-item oh ' + (gindex + 1 >= detail.staff_booking_data.length ? 'padding-main padding-bottom-0' : 'br-b-dashed padding-main')">
                        <view class="flex-row">
                            <view v-if="goods_detail_url(group)" class="cp" :data-value="goods_detail_url(group)" @tap="url_event">
                                <image v-if="(group.goods_images || null) != null" class="staff-booking-goods-image radius br" :src="group.goods_images" mode="aspectFill"></image>
                            </view>
                            <image v-else-if="(group.goods_images || null) != null" class="staff-booking-goods-image radius br" :src="group.goods_images" mode="aspectFill"></image>
                            <view class="staff-booking-goods-base flex-1 flex-width">
                                <view v-if="goods_detail_url(group)" class="multi-text cp" :data-value="goods_detail_url(group)" @tap="url_event">{{ group.goods_title || '' }}</view>
                                <view v-else class="multi-text">{{ group.goods_title || '' }}</view>
                                <view v-if="(group.goods_price || null) != null && group.goods_price != '' || (group.spec_text || null) != null && group.spec_text != ''" class="margin-top-xs">
                                    <text v-if="(group.goods_price || null) != null && group.goods_price != ''" class="sales-price">{{ detail.currency_data.currency_symbol }}{{ group.goods_price }}</text>
                                    <text v-if="(group.goods_price || null) != null && group.goods_price != ''" class="margin-left-sm">x{{ group.buy_number }}</text>
                                    <text v-if="(group.spec_text || null) != null && group.spec_text != ''" class="cr-grey margin-left">{{ group.spec_text }}</text>
                                </view>
                            </view>
                        </view>
                        <view v-for="(booking, bindex) in group.bookings" :key="bindex" :class="bindex > 0 ? 'staff-booking-unit margin-top-sm padding-top-sm br-t-dashed' : 'margin-top-sm'">
                            <view v-if="(booking.staff_alias || null) != null && booking.staff_alias != ''" class="staff-booking-info-row" :class="(booking.staff_id || 0) > 0 ? 'cp' : ''" :data-value="(booking.staff_id || 0) > 0 ? ('/pages/plugins/realstore/staff-detail/staff-detail?id=' + booking.staff_id) : ''" @tap="url_event">
                                <text class="cr-grey">{{ $t('common.staff') }}</text>
                                <image v-if="(booking.staff_avatar || null) != null" class="staff-booking-staff-avatar radius margin-right-xs" :src="booking.staff_avatar" mode="aspectFill"></image>
                                <text>{{ booking.staff_alias }}</text>
                            </view>
                            <view v-if="((booking.period_text || null) != null && booking.period_text != '') || ((booking.ymd_text || null) != null && booking.ymd_text != '')" class="staff-booking-info-row margin-top-xs cp" :data-value="booking_time_text(booking)" @tap="text_copy_event">
                                <text class="cr-grey">{{ $t('common.booking_time') }}</text>
                                <text v-if="(booking.ymd_text || null) != null && booking.ymd_text != ''">{{ booking.ymd_text }}</text>
                                <text v-if="(booking.period_text || null) != null && booking.period_text != ''" :class="(booking.ymd_text || null) != null && booking.ymd_text != '' ? 'margin-left' : ''">{{ booking.period_text }}</text>
                                <text v-if="parseInt(booking.status || 0) == 2" class="cr-grey margin-left">{{ booking.status_name || $t('common.canceled') }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 订单基础信息 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ $t('common.order_information') }}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view v-if="(item.is_copy || 0) == 1" class="content fl br-l padding-left-main" :data-value="item.value" @tap="text_copy_event">
                                <text>{{ item.value }}</text>
                                <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{ $t('common.copy') }}</text>
                            </view>
                            <view v-else class="content fl br-l padding-left-main">{{ item.value }}</view>
                        </view>
                    </view>
                </view>

                <!-- 快递信息 -->
                <view v-if="(detail.express_data || null) != null && detail.express_data.length > 0" class="express-data panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ $t('common.express_delivery_info') }}</view>
                    <view class="panel-content">
                        <view v-for="(item, index) in detail.express_data" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="item oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{ $t('common.express_delivery_company') }}</view>
                                <view class="content fl br-l padding-left-main">{{ item.express_name }}</view>
                            </view>
                            <view class="item oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{ $t('common.express_tracking_number') }}</view>
                                <view class="content fl br-l padding-left-main" :data-value="item.express_number" @tap="text_copy_event">
                                    <text>{{ item.express_number }}</text>
                                    <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{ $t('common.copy') }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <component-bottom-line :propStatus="true"></component-bottom-line>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <component-staff-order-operate
            ref="staff_operate"
            :propExpressList="express_list"
            :propEditorPathType="editor_path_type"
            @success="get_data"
        ></component-staff-order-operate>
        <component-orderallot-staff-booking ref="staff_booking" @success="get_data"></component-orderallot-staff-booking>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentStaffOrderOperate from '../components/staff-order-operate/staff-order-operate';
    import componentOrderallotStaffBooking from '../components/orderallot-staff-booking/orderallot-staff-booking';
    import pluginLocale from '../locale/index.js';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                params: {},
                detail: null,
                detail_list: [],
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                express_list: [],
                editor_path_type: '',
                extraction_take_index: 0,
                is_buy_staff_booking: 0,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentStaffOrderOperate,
            componentOrderallotStaffBooking,
        },
        computed: {
            status_progress() {
                const d = this.detail || {};
                return d.status_progress || d.make_progress || null;
            },
            status_progress_name() {
                const sp = this.status_progress || {};
                return sp.status_name || sp.current_name || ((this.detail || {}).status_name) || '';
            },
            status_progress_tips() {
                return String(((this.status_progress || {}).tips) || '');
            },
            status_progress_style() {
                return String(((this.status_progress || {}).style) || 'default');
            },
            status_progress_steps() {
                const steps = ((this.status_progress || {}).steps) || null;
                return (steps != null && steps.length > 0) ? steps : [];
            },
            extraction_take_show() {
                var data = ((this.detail || {}).extraction_data) || null;
                if (data == null || data === '') {
                    return false;
                }
                var items = data.items || [];
                return items.length > 0;
            },
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.setData({ params: params });
            this.init();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            make_step_class(index) {
                if (this.make_step_done(index)) {
                    return 'is-done';
                }
                if (this.make_step_active(index)) {
                    return 'is-active';
                }
                return 'is-wait';
            },
            make_step_done(index) {
                const cur = Number(((this.status_progress || {}).current) || 0);
                return index < cur;
            },
            make_step_active(index) {
                const cur = Number(((this.status_progress || {}).current) || 0);
                return index === cur;
            },
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.load_init();
                    this.get_data();
                } else {
                    this.setData({ data_list_loding_status: 0 });
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
                                express_list: res.data.data.express_list || [],
                                editor_path_type: res.data.data.editor_path_type || '',
                                is_buy_staff_booking: parseInt(res.data.data.is_buy_staff_booking || 0),
                            });
                        }
                    },
                });
            },
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'stafforder', 'realstore'),
                    method: 'POST',
                    data: { id: this.params.id || 0 },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = (res.data.data || {}).data || null;
                            if (data != null) {
                                this.setData({
                                    extraction_take_index: 0,
                                    detail: data,
                                    detail_list: [
                                        { name: this.$t('orderallot-detail.order_type'), value: data.order_type_name || '' },
                                        { name: this.$t('common.user_order_detail_order_number'), value: data.order_allot_no || '', is_copy: 1 },
                                        { name: this.$t('common.order_status'), value: data.status_name || '' },
                                        { name: this.$t('common.total_order_price'), value: data.total_price || '' },
                                        { name: this.$t('common.creation_time'), value: data.add_time || '' },
                                        { name: this.$t('common.receive_time'), value: data.receive_time || '' },
                                        { name: this.$t('common.service_time'), value: data.service_time || '' },
                                        { name: this.$t('common.completion_time'), value: data.success_time || '' },
                                        { name: this.$t('common.cancel_time'), value: data.cancel_time || '' },
                                    ].filter((v) => (v.value || '') !== ''),
                                    data_list_loding_status: 3,
                                    data_list_loding_msg: '',
                                });
                            } else {
                                this.setData({
                                    detail: null,
                                    data_list_loding_status: 0,
                                });
                            }
                        } else {
                            this.setData({
                                detail: null,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg || '',
                            });
                            if (res.data.code != -400) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
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
            staff_booking_event() {
                if((this.detail || null) == null || (this.$refs.staff_booking || null) == null) {
                    return;
                }
                var symbol = ((this.detail.currency_data) || {}).currency_symbol || '';
                this.$refs.staff_booking.open(this.detail.id, symbol);
            },
            extraction_take_prev_event() {
                var items = (((this.detail || {}).extraction_data || {}).items) || [];
                if (items.length <= 1) {
                    return;
                }
                var index = this.extraction_take_index || 0;
                this.setData({
                    extraction_take_index: index <= 0 ? items.length - 1 : index - 1,
                });
            },
            extraction_take_next_event() {
                var items = (((this.detail || {}).extraction_data || {}).items) || [];
                if (items.length <= 1) {
                    return;
                }
                var index = this.extraction_take_index || 0;
                this.setData({
                    extraction_take_index: index >= items.length - 1 ? 0 : index + 1,
                });
            },
            staff_settle_text(sv) {
                if ((sv || null) == null) {
                    return '';
                }
                var price = parseFloat(sv.settle_price || 0);
                if (price > 0) {
                    var symbol = ((((this.detail || null) == null) ? null : this.detail.currency_data) || {}).currency_symbol || '';
                    return symbol + price;
                }
                var rate = parseFloat(sv.settle_rate || 0);
                if (rate > 0) {
                    return rate + '%';
                }
                return '';
            },
            goods_detail_url(g) {
                if ((g || null) == null) {
                    return '';
                }
                if ((g.goods_url || null) != null && g.goods_url != '') {
                    return g.goods_url;
                }
                var goods_id = g.goods_id || 0;
                if (goods_id > 0) {
                    return '/pages/goods-detail/goods-detail?id=' + goods_id;
                }
                return '';
            },
            address_full_text(addr) {
                if ((addr || null) == null) {
                    return '';
                }
                return (addr.province_name || '') + (addr.city_name || '') + (addr.county_name || '') + (addr.address || '');
            },
            booking_time_text(booking) {
                if ((booking || null) == null) {
                    return '';
                }
                var ymd = booking.ymd_text || '';
                var period = booking.period_text || '';
                if (ymd != '' && period != '') {
                    return ymd + ' ' + period;
                }
                return ymd || period;
            },
            url_event(e) {
                if ((e.currentTarget.dataset.value || null) == null || e.currentTarget.dataset.value == '') {
                    return;
                }
                app.globalData.url_event(e);
            },
            operate_event(e) {
                var action = e.currentTarget.dataset.action || '';
                if (action == '' || (this.detail || null) == null) {
                    return;
                }
                var id = this.detail.id;
                if (action == 'take' || action == 'delivery' || action == 'service') {
                    if ((this.$refs.staff_operate || null) != null) {
                        this.$refs.staff_operate.open(action, id, action == 'delivery' ? ((this.detail && this.detail.express_data) || []) : null);
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
                uni.request({
                    url: app.globalData.get_request_url(action, 'stafforder', 'realstore'),
                    method: 'POST',
                    data: Object.assign({ id: id }, extra || {}),
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        app.globalData.showToast(res.data.msg);
                        if (res.data.code == 0) {
                            this.get_data();
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            text_copy_event(e) {
                if ((e.currentTarget.dataset.value || null) != null) {
                    app.globalData.text_copy_event(e);
                }
            },
            tel_event(e) {
                app.globalData.call_tel(e);
            },
        },
    };
</script>
<style>
.address-base,
.address-detail {
    padding: 10rpx 0;
}
.address-detail .icon {
    width: 30rpx;
    height: 35rpx !important;
}
.address-detail .text {
    width: calc(100% - 40rpx);
    line-height: 36rpx;
}
.address-alias {
    padding: 0 15rpx;
    line-height: 40rpx;
}
.goods-base {
    min-height: 160rpx;
    margin-left: 180rpx;
}
.goods-image {
    width: 160rpx;
    height: 160rpx;
}
.item-operation button {
    margin: 0 10rpx 10rpx;
}
.make-progress-steps {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
}
.make-progress-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
}
.make-progress-node {
    width: 100%;
    height: 36rpx;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.make-progress-dot {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    background: #e8e8e8;
    z-index: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}
.make-progress-dot-num,
.make-progress-dot-check {
    font-size: 20rpx;
    line-height: 1;
}
.make-progress-line {
    position: absolute;
    left: 50%;
    right: -50%;
    top: 50%;
    height: 4rpx;
    margin-top: -2rpx;
    background: #e8e8e8;
    z-index: 0;
}
.make-progress-name {
    margin-top: 12rpx;
    font-size: 24rpx;
    text-align: center;
    line-height: 1.3;
}
.make-progress-step.is-done .make-progress-name,
.make-progress-step.is-active .make-progress-name {
    font-weight: 500;
}
.panel-item .title {
    width: 160rpx;
}
.panel-item .content {
    width: calc(100% - 160rpx);
    word-wrap: break-word;
    word-break: break-all;
}
.extraction-take-switch {
    position: relative;
}
.extraction-take-body {
    width: 100%;
}
.extraction-take-goods {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 16rpx;
    margin-bottom: 24rpx;
}
.extraction-take-goods-images {
    width: 96rpx;
    height: 96rpx;
    flex-shrink: 0;
}
.extraction-take-goods-title {
    flex: 1;
    min-width: 0;
    text-align: left;
}
.extraction-take-code {
    padding: 0 88rpx;
}
.extraction-take-code .qrcode {
    width: 280rpx;
    height: 280rpx;
    margin: 0 auto;
    display: block;
}
.extraction-take-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    width: 420rpx;
    text-align: left;
}
.extraction-take-meta-label {
    width: 5em;
    flex-shrink: 0;
    text-align: right;
}
.extraction-take-meta-value {
    flex: 1;
    min-width: 0;
    text-align: left;
}
.extraction-take-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}
.extraction-take-prev {
    left: 0;
}
.extraction-take-next {
    right: 0;
}
.staff-data-avatar {
    width: 72rpx;
    height: 72rpx;
}
.staff-data-base {
    margin-left: 92rpx;
    min-height: 72rpx;
}
.staff-self-tag {
    display: inline-block;
    padding: 0 10rpx;
    line-height: 32rpx;
    font-size: 20rpx;
    border-radius: 6rpx;
    vertical-align: middle;
}
.staff-settle-text {
    flex-shrink: 0;
    line-height: 1.5;
}
.staff-data-contact {
    line-height: 1.5;
}
.staff-contact-item {
    max-width: 100%;
}
.staff-booking-goods-image {
    width: 120rpx;
    height: 120rpx;
    flex-shrink: 0;
    margin-right: 20rpx;
}
.staff-booking-goods-base {
    min-width: 0;
}
.staff-booking-staff-avatar {
    width: 36rpx;
    height: 36rpx;
    vertical-align: middle;
}
.staff-booking-info-row {
    line-height: 1.6;
}
.staff-booking-item:last-child {
    border-bottom: 0 !important;
}
</style>
