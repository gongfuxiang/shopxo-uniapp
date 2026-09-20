<template>
    <view :class="theme_view">
        <block v-if="(detail || null) != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 状态与操作（对齐系统订单详情） -->
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
                        <view v-if="(detail.operate_data || null) != null && (detail.operate_data.is_pay || 0) == 1" class="cr-price fw-b margin-top-sm">
                            <text class="text-size">{{ ((detail.currency_data || null) == null) ? payment_currency_symbol : (detail.currency_data.currency_symbol || payment_currency_symbol) }}</text>
                            <text class="text-size-xl margin-left-xs">{{ detail.total_price }}</text>
                        </view>
                        <view v-if="status_progress_tips" class="cr-grey text-size-xs margin-top-sm">{{ status_progress_tips }}</view>
                        <view v-if="status_progress_steps.length > 0" class="make-progress-steps margin-top-main">
                            <view
                                v-for="(step, index) in status_progress_steps"
                                :key="step.key"
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
                    <view v-if="show_detail_operate" class="item-operation margin-top-sm tc">
                        <button v-if="(detail.operate_data || null) != null && (detail.operate_data.is_cancel || 0) == 1" class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" hover-class="none">{{$t('common.cancel')}}</button>
                        <button v-if="(detail.operate_data || null) != null && (detail.operate_data.is_pay || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" hover-class="none">{{$t('common.pay')}}</button>
                        <button v-if="(detail.operate_data || null) != null && (detail.operate_data.is_collect || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="collect_event" hover-class="none">{{$t('common.receiving_goods')}}</button>
                        <button v-if="(detail.operate_data || null) != null && (detail.operate_data.is_comments || 0) == 1" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/orderallot-comments/orderallot-comments?id=' + detail.id" hover-class="none">{{$t('realstore-staff.comments')}}</button>
                        <button v-if="(detail.operate_data || null) != null && (detail.operate_data.is_order_batch || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/batchorder-list/batchorder-list?oid=' + detail.order_id" hover-class="none">{{$t('common.batch')}}</button>
                        <button v-if="(detail.operate_data || null) != null && (detail.operate_data.is_order_frequencycard || 0) == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/frequencycard-list/frequencycard-list?oid=' + detail.order_id" hover-class="none">{{$t('common.secondary_card')}}</button>
                        <button v-if="(detail.express_data || null) != null && detail.express_data.length > 0" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/express/detail/detail?oid=' + detail.id + '&action_type=realstore'" hover-class="none">{{$t('common.logistics')}}</button>
                        <button v-if="(detail.plugins_delivery_data || 0) > 0" class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/delivery/logistics/logistics?id=' + detail.plugins_delivery_data" hover-class="none">{{$t('common.logistics')}}</button>
                        <button v-if="(detail.plugins_ordergoodsform_data || 0) == 1" class="round bg-white cr-blue br-blue" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/ordergoodsform/order/order?id=' + detail.order_id" hover-class="none">{{$t('common.form')}}</button>
                    </view>
                </view>

                <!-- 取货信息 -->
                <view v-if="(detail.extraction_data || null) != null" class="extraction-take panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('common.take_info_title')}}</view>
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
                                        <text class="extraction-take-meta-label cr-grey">{{$t('common.take_code_label')}}</text>
                                        <view class="extraction-take-meta-value">
                                            <block v-if="(detail.extraction_data.items[extraction_take_index].code || null) == null || detail.extraction_data.items[extraction_take_index].code == ''">
                                                <text class="cr-red">{{$t('common.pickup_code_does_exist_contact_administrator')}}</text>
                                            </block>
                                            <block v-else>
                                                <view class="dis-inline-block" :data-value="detail.extraction_data.items[extraction_take_index].code" @tap="text_copy_event">
                                                    <text class="fw-b cr-blue text-size">{{ detail.extraction_data.items[extraction_take_index].code }}</text>
                                                    <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs va-m margin-left-sm">{{$t('common.copy')}}</text>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                    <view class="extraction-take-meta margin-top-xs">
                                        <text class="extraction-take-meta-label cr-grey">{{$t('common.take_verify_label')}}</text>
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
                        <view v-else class="extraction-take-code tc">
                            <image v-if="(detail.extraction_data.images || null) != null" class="qrcode br radius" :src="detail.extraction_data.images" mode="aspectFill"></image>
                            <view class="margin-top-sm" :data-value="detail.extraction_data.code" @tap="text_copy_event">
                                <text class="fw-b cr-blue text-size-xl va-m">{{ detail.extraction_data.code || $t('common.pickup_code_does_exist_contact_administrator') }}</text>
                                <text v-if="(detail.extraction_data.code || null) != null" class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs va-m margin-left">{{$t('common.copy')}}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 地址 -->
                <view v-if="(detail.order_type == 0 || detail.order_type == 1 || detail.order_type == 2) && (detail.address_data || null) != null" class="address bg-white padding-horizontal-main padding-top-main border-radius-main spacing-mb">
                    <view class="address-base oh">
                        <text v-if="(detail.address_data.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{ detail.address_data.alias }}</text>
                        <text>{{ detail.address_data.name }}</text>
                        <text class="fr">{{ detail.address_data.tel }}</text>
                    </view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url + 'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text>{{ detail.address_data.province_name }}{{ detail.address_data.city_name }}{{ detail.address_data.county_name }}{{ detail.address_data.address }}</text>
                            <text v-if="detail.order_model == 2 && (detail.address_data.lng || 0) != 0 && (detail.address_data.lat || 0) != 0" class="address-map-submit cr-base br round bg-white margin-left-sm text-size-xs" @tap="address_map_event">{{$t('common.view_location')}}</text>
                        </view>
                    </view>
                    <view class="address-divider spacing-mb"></view>
                </view>

                <!-- 商品列表 -->
                <view class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('common.product_information')}}</view>
                    <view v-for="(item, index) in detail.items" :key="index" class="goods-item br-b-dashed oh padding-main">
                        <view :data-value="item.goods_url" @tap="url_event" class="cp">
                            <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{ item.title }}</view>
                                <view v-if="item.spec != null" class="margin-top-sm">
                                    <block v-for="(sv, si) in item.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-grey">{{ sv.value }}</text>
                                    </block>
                                </view>
                                <view class="margin-top-sm">
                                    <text class="fw-b">{{ detail.currency_data.currency_symbol }}{{ item.price }}</text>
                                    <text class="margin-left-sm">x{{ item.buy_number }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="padding-top-main tr cr-base text-size">
                        <text>{{$t('common.total')}}<text class="fw-b">{{ detail.buy_number_count }}</text>{{$t('common.total_pieces')}}<text class="sales-price margin-right-xs">{{ detail.currency_data.currency_symbol }}{{ detail.total_price }}</text></text>
                    </view>
                </view>

                <!-- 预约数据 -->
                <view v-if="(detail.staff_booking_data || null) != null && detail.staff_booking_data.length > 0" class="staff-booking bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('orderallot-detail.booking_data')}}</view>
                    <view v-for="(group, gindex) in detail.staff_booking_data" :key="gindex" :class="'staff-booking-item oh ' + (gindex + 1 >= detail.staff_booking_data.length ? 'padding-main padding-bottom-0' : 'br-b-dashed padding-main')">
                        <view class="flex-row">
                            <view v-if="(group.goods_url || null) != null && group.goods_url != ''" :data-value="group.goods_url" @tap="url_event" class="cp">
                                <image v-if="(group.goods_images || null) != null" class="staff-booking-goods-image radius br" :src="group.goods_images" mode="aspectFill"></image>
                            </view>
                            <image v-else-if="(group.goods_images || null) != null" class="staff-booking-goods-image radius br" :src="group.goods_images" mode="aspectFill"></image>
                            <view class="staff-booking-goods-base flex-1 flex-width">
                                <view v-if="(group.goods_url || null) != null && group.goods_url != ''" :data-value="group.goods_url" @tap="url_event" class="multi-text cp">{{ group.goods_title || '' }}</view>
                                <view v-else class="multi-text">{{ group.goods_title || '' }}</view>
                                <view v-if="(group.goods_price || null) != null && group.goods_price != '' || (group.spec_text || null) != null && group.spec_text != ''" class="margin-top-xs">
                                    <text v-if="(group.goods_price || null) != null && group.goods_price != ''" class="sales-price">{{ detail.currency_data.currency_symbol }}{{ group.goods_price }}</text>
                                    <text v-if="(group.goods_price || null) != null && group.goods_price != ''" class="margin-left-sm">x{{ group.buy_number }}</text>
                                    <text v-if="(group.spec_text || null) != null && group.spec_text != ''" class="cr-grey margin-left">{{ group.spec_text }}</text>
                                </view>
                            </view>
                        </view>
                        <view v-for="(booking, bindex) in group.bookings" :key="bindex" :class="bindex > 0 ? 'staff-booking-unit margin-top-sm padding-top-sm br-t-dashed' : 'margin-top-sm'">
                            <view v-if="(booking.staff_alias || null) != null && booking.staff_alias != ''" class="staff-booking-info-row">
                                <text class="cr-grey">{{$t('common.staff')}}</text>
                                <image v-if="(booking.staff_avatar || null) != null" class="staff-booking-staff-avatar radius margin-right-xs" :src="booking.staff_avatar" mode="aspectFill"></image>
                                <text>{{ booking.staff_alias }}</text>
                            </view>
                            <view v-if="((booking.period_text || null) != null && booking.period_text != '') || ((booking.ymd_text || null) != null && booking.ymd_text != '')" class="staff-booking-info-row margin-top-xs">
                                <text class="cr-grey">{{$t('common.booking_time')}}</text>
                                <text v-if="(booking.ymd_text || null) != null && booking.ymd_text != ''">{{ booking.ymd_text }}</text>
                                <text v-if="(booking.period_text || null) != null && booking.period_text != ''" :class="(booking.ymd_text || null) != null && booking.ymd_text != '' ? 'margin-left' : ''">{{ booking.period_text }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 虚拟销售数据 -->
                <view v-if="(site_fictitious || null) != null" class="site-fictitious panel-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ site_fictitious.title || item.fictitious_goods_title }}</view>
                    <view class="panel-content oh padding-top-main">
                        <view v-if="(site_fictitious.tips || null) != null" class="tips-value radius padding-main margin-bottom-main">
                            <mp-html :content="site_fictitious.tips" />
                        </view>
                        <view v-for="(item, index) in detail.items" :key="index" class="item br-b-dashed oh padding-bottom-main margin-bottom-main">
                            <image class="left-image br fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="right-value fr">
                                <view v-if="(item.spec_text || null) != null" class="text-grey padding-bottom-xs margin-bottom-xs br-b-f9 text-size-xs">{{item.spec_text}}</view>
                                <mp-html v-if="(item.fictitious_goods_value || null) != null" :content="item.fictitious_goods_value" />
                                <text v-else class="cr-grey">{{$t('common.unconfigured_data')}}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 订单基础数据 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('common.order_information')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view v-if="(item.is_copy || 0) == 1" class="content fl br-l padding-left-main" :data-value="item.value" @tap="text_copy_event">
                                <text>{{ item.value }}</text>
                                <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                            </view>
                            <view v-else class="content fl br-l padding-left-main">{{ item.value }}</view>
                        </view>
                    </view>
                </view>

                <!-- 快递信息 -->
                <view v-if="(detail.express_data || null) != null && detail.express_data.length > 0" class="express-data panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('common.express_delivery_info')}}</view>
                    <view class="panel-content">
                        <view v-for="(item, index) in detail.express_data" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="item oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{$t('common.express_delivery_company')}}</view>
                                <view class="content fl br-l padding-left-main" :data-value="item.express_name" @tap="text_copy_event">{{item.express_name}}</view>
                            </view>
                            <view class="item oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{$t('common.express_tracking_number')}}</view>
                                <view class="content fl br-l padding-left-main" :data-value="item.express_number" @tap="text_copy_event">
                                    <text>{{item.express_number}}</text>
                                    <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 支付组件 -->
        <component-payment
            ref="payment"
            :propCurrencySymbol="payment_currency_symbol"
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            :propPaymentList="payment_list"
            propPayDataKey="ids"
            :propTempPayValue="temp_pay_value"
            :propTempPayIndex="temp_pay_index"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
        ></component-payment>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentPayment from '@/components/payment/payment';
    import pluginLocale from '../locale/index.js';

    var common_static_url = app.globalData.get_static_url("common");
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                detail: null,
                detail_list: [],
                site_fictitious: null,
                extraction_take_index: 0,
                // 支付
                payment_currency_symbol: app.globalData.currency_symbol(),
                pay_price: 0,
                pay_url: '',
                qrcode_url: '',
                payment_list: [],
                temp_pay_value: '',
                temp_pay_index: 0,
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
                is_order_pay_only_can_buy_payment: 0,
                original_payment_list: [],
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPayment,
        },

        computed: {
            // 订单状态进度数据
            status_progress() {
                const d = this.detail || {};
                return d.status_progress || d.make_progress || null;
            },

            // 状态进度标题
            status_progress_name() {
                const sp = this.status_progress || {};
                return sp.status_name || sp.current_name || ((this.detail || {}).status_name) || '';
            },

            // 状态进度提示文案
            status_progress_tips() {
                return String(((this.status_progress || {}).tips) || '');
            },

            // 状态进度样式（danger/success/primary/warning/default）
            status_progress_style() {
                return String(((this.status_progress || {}).style) || 'default');
            },

            // 状态进度步骤列表
            status_progress_steps() {
                const steps = ((this.status_progress || {}).steps) || null;
                return (steps != null && steps.length > 0) ? steps : [];
            },

            // 是否展示详情操作按钮区
            show_detail_operate() {
                const d = this.detail || null;
                if (d == null) {
                    return false;
                }
                const op = d.operate_data || {};
                return (
                    Number(op.is_cancel || 0) +
                    Number(op.is_pay || 0) +
                    Number(op.is_collect || 0) +
                    Number(op.is_comments || 0) +
                    Number(d.plugins_delivery_data || 0) +
                    Number(d.plugins_ordergoodsform_data || 0) +
                    Number(op.is_order_batch || 0) +
                    Number(op.is_order_frequencycard || 0) +
                    (((d.express_data || null) != null && d.express_data.length > 0) ? 1 : 0)
                ) > 0;
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
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 进度步骤样式类
            make_step_class(index) {
                if (this.make_step_done(index)) {
                    return 'is-done';
                }
                if (this.make_step_active(index)) {
                    return 'is-active';
                }
                return 'is-wait';
            },

            // 进度步骤是否已完成
            make_step_done(index) {
                const cur = Number(((this.status_progress || {}).current) || 0);
                return index < cur;
            },

            // 进度步骤是否当前步骤
            make_step_active(index) {
                const cur = Number(((this.status_progress || {}).current) || 0);
                return index === cur;
            },

            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        is_order_pay_only_can_buy_payment: parseInt(app.globalData.get_config('plugins_base.intellectstools.data.is_order_pay_only_can_buy_payment', 0)),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                this.setData({
                    data_list_loding_status: 1,
                    pay_url: app.globalData.get_request_url('pay', 'order'),
                    qrcode_url: app.globalData.get_request_url('paycheck', 'order'),
                });
                this.init_config();
                uni.request({
                    url: app.globalData.get_request_url("detail", "orderallot", "realstore"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if((data.data || null) != null) {
                                this.setData({
                                    detail: data.data,
                                    extraction_take_index: 0,
                                    detail_list: [
                                        { name: this.$t('orderallot-detail.order_type'), value: data.data.order_type_name || '' },
                                        { name: this.$t('common.user_order_detail_order_number'), value: data.data.order_allot_no || '', is_copy: 1 },
                                        { name: this.$t('common.order_status'), value: data.data.status_name || '' },
                                        { name: this.$t('common.total_order_price'), value: data.data.total_price || '' },
                                        { name: this.$t('common.creation_time'), value: data.data.add_time || '' },
                                        { name: this.$t('common.add_time'), value: data.data.add_time || '' },
                                        { name: this.$t('common.receive_time'), value: data.data.receive_time || '' },
                                        { name: this.$t('common.service_time'), value: data.data.service_time || '' },
                                        { name: this.$t('common.completion_time'), value: data.data.success_time || '' },
                                        { name: this.$t('common.cancel_time'), value: data.data.cancel_time || '' },
                                    ],
                                    site_fictitious: data.site_fictitious || null,
                                    original_payment_list: data.payment_list || [],
                                    payment_list: data.payment_list || [],
                                    default_payment_id: data.default_payment_id || 0,
                                    data_list_loding_status: 3,
                                    data_bottom_line_status: true,
                                    data_list_loding_msg: '',
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_bottom_line_status: false,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "init")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 支付
            pay_event() {
                const detail = this.detail || null;
                if (detail == null) {
                    return;
                }
                const payment_id = (((detail.main_order_data || null) == null) ? 0 : (detail.main_order_data.payment_id || 0));
                var payment_list = this.original_payment_list || [];
                if (this.is_order_pay_only_can_buy_payment == 1) {
                    payment_list = [];
                    (this.original_payment_list || []).forEach((v) => {
                        if (v.id == payment_id) {
                            payment_list.push(v);
                        }
                    });
                }
                this.setData({
                    is_show_payment_popup: true,
                    payment_list: payment_list,
                    payment_currency_symbol: (((detail.currency_data || null) == null) ? app.globalData.currency_symbol() : (detail.currency_data.currency_symbol || app.globalData.currency_symbol())),
                    temp_pay_value: detail.order_id,
                    temp_pay_index: 0,
                    payment_id: payment_id,
                    pay_price: detail.total_price,
                });
            },

            // 支付弹窗关闭
            payment_popup_event_close() {
                this.setData({
                    is_show_payment_popup: false,
                });
            },

            // 支付成功后刷新详情
            order_item_pay_success_handle() {
                this.setData({
                    is_show_payment_popup: false,
                });
                this.init();
            },

            // 取消
            cancel_event() {
                const detail = this.detail || null;
                if (detail == null) {
                    return;
                }
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.cancel_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url("cancel", "orderallot", "realstore"),
                                method: 'POST',
                                data: {
                                    id: detail.id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        app.globalData.showToast(res.data.msg, 'success');
                                        this.init();
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 收货
            collect_event() {
                const detail = this.detail || null;
                if (detail == null) {
                    return;
                }
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.confirm_goods_been_received_completed_cannot'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url("collect", "orderallot", "realstore"),
                                method: "POST",
                                data: {
                                    id: detail.id,
                                },
                                dataType: "json",
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        app.globalData.showToast(res.data.msg, "success");
                                        this.init();
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 地图查看
            address_map_event(e) {
                if ((this.detail.address_data || null) == null) {
                    app.globalData.showToast(this.$t('common.incorrect_address'));
                    return false;
                }

                // 打开地图
                var data = this.detail.address_data;
                var name = data.alias || data.name || "";
                var address = (data.province_name || "") + (data.city_name || "") + (data.county_name || "") + (data.address || "");
                app.globalData.open_location(data.lng, data.lat, name, address);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 文本复制
            text_copy_event(e) {
                if((e.currentTarget.dataset.value || null) != null) {
                    app.globalData.text_copy_event(e);
                }
            },

            // 取货码上一页
            extraction_take_prev_event() {
                var list = (((this.detail || null) == null) ? null : this.detail.extraction_data) || null;
                var items = ((list || null) == null) ? [] : (list.items || []);
                if (items.length <= 1) {
                    return;
                }
                var index = this.extraction_take_index || 0;
                this.setData({
                    extraction_take_index: index <= 0 ? items.length - 1 : index - 1,
                });
            },

            // 取货码下一页
            extraction_take_next_event() {
                var list = (((this.detail || null) == null) ? null : this.detail.extraction_data) || null;
                var items = ((list || null) == null) ? [] : (list.items || []);
                if (items.length <= 1) {
                    return;
                }
                var index = this.extraction_take_index || 0;
                this.setData({
                    extraction_take_index: index >= items.length - 1 ? 0 : index + 1,
                });
            },

        },
    };
</script>
<style>
    @import "./orderallot-detail.css";
</style>
