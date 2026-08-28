<template>
    <view :class="theme_view">
        <view v-if="!propIsBaseMode && propStatus">
            <!-- 购物车弹层背景 -->
            <view v-if="cart_status" class="plugins-realstore-cart-mask wh-auto ht-auto pf" @tap="cart_switch_event"></view>
            <!-- 购物车列表 -->
            <view class="plugins-realstore-cart-content pf wh-auto" :style="realstore_cart_content_style">
                <view class="bottom-line-exclude">
                    <view v-if="cart_status" class="bg-white border-radius-main pr oh margin-horizontal-main margin-bottom-xxxl">
                        <block v-if="(cart || null) != null && (cart.data || null) != null && cart.data.length > 0">
                            <view class="oh br-b padding-vertical-main padding-horizontal-main text-size-xs">
                                <text class="va-m cr-base">{{$t('common.selected_product')}}</text>
                                <view v-if="(info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0" class="dis-inline-block margin-left-xl">
                                    <text class="cr-red">{{$t('realstore-cart.any_purchased_items')}}</text>
                                    <view class="va-m dis-inline-block br-green cr-green round padding-horizontal-sm padding-vertical-xs cp" @tap="buy_use_type_event">
                                        <text class="va-m">{{$t('common.switch_text')}}({{info.buy_use_type_list[buy_use_type_active_index]['name']}})</text>
                                        <view class="va-m dis-inline-block margin-left-xs">
                                            <iconfont name="icon-arrow-bottom" size="24rpx" propClass="cr-green"></iconfont>
                                        </view>
                                    </view>
                                </view>
                                <view class="fr cp" @tap="cart_all_delete_event">
                                    <view class="dis-inline-block va-m">
                                        <uni-icons type="trash" size="24rpx" color="#f00"></uni-icons>
                                    </view>
                                    <text class="cr-red va-m margin-left-xs">{{$t('common.clear')}}</text>
                                </view>
                            </view>
                            <scroll-view :scroll-y="true" class="cart-list goods-list">
                                <uni-swipe-action ref="swipe_action">
                                    <view v-for="(goods, index) in cart.data" :key="goods.id || index" class="item oh">
                                        <uni-swipe-action-item :right-options="swipe_options" @click="swipe_opt_event" @change="swipe_change($event, index)">
                                            <view class="padding-main" :data-index="index" @tap="goods_event">
                                                <view class="flex-row jc-sb">
                                                    <image :src="goods.images" mode="widthFix" class="goods-img radius br"></image>
                                                    <view class="goods-base flex-1 flex-width padding-left-main flex-col jc-sb">
                                                        <view class="goods-base-content">
                                                            <view class="goods-title text-size-sm single-text">{{ goods.title }}</view>
                                                            <view v-if="goods.spec != null" class="text-size-xs cr-grey margin-top-sm">
                                                                <block v-for="(sv, si) in goods.spec" :key="si">
                                                                    <text v-if="si > 0" class="padding-left-xs padding-right-xs">;</text>
                                                                    <text>{{ sv.value }}</text>
                                                                </block>
                                                            </view>
                                                        </view>
                                                        <view class="margin-top-sm">
                                                            <view class="sales-price text-size-sm single-text dis-inline-block va-m">{{ propCurrencySymbol }}{{ goods.price }}</view>
                                                            <view class="tc fr flex-row align-c">
                                                                <view v-if="(goods.stock || 0) > 0" class="cp pr top-sm" :data-index="index" data-type="0" @tap.stop="cart_stock_event">
                                                                    <iconfont name="icon-reduce" size="48rpx" :color="theme_color"></iconfont>
                                                                </view>
                                                                <view v-if="(goods.stock || 0) > 0" class="buy-number dis-inline-block cr-black text-size-sm padding-left-xs padding-right-xs va-m">{{ goods.stock }} </view>
                                                                <view class="cp pr top-sm" :data-index="index" data-type="1" @tap.stop="cart_stock_event">
                                                                    <iconfont name="icon-add-solid" size="48rpx" :color="theme_color"></iconfont>
                                                                </view>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                        </uni-swipe-action-item>
                                    </view>
                                </uni-swipe-action>
                            </scroll-view>
                        </block>
                        <block v-else>
                            <component-no-data propStatus="0" :propMsg="$t('realstore-cart.add_product_first')"></component-no-data>
                            <view v-if="(info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0" class="padding-vertical-xxxl margin-vertical-xxxl tc text-size-xs">
                                <text class="cr-red va-m">{{$t('realstore-cart.any_purchased_items')}}</text>
                                <view class="va-m dis-inline-block br-green cr-green round padding-horizontal padding-vertical-xs cp" @tap="buy_use_type_event">
                                    <text class="va-m">{{$t('common.switch_text')}}{{info.buy_use_type_list[buy_use_type_active_index]['name']}})</text>
                                    <view class="va-m dis-inline-block margin-left-xs">
                                        <iconfont name="icon-arrow-bottom" size="24rpx" propClass="cr-green"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>

                    <!-- 购物车底部导航 -->
                    <view class="plugins-realstore-cart-botton-nav pr round oh bg-white">
                        <view class="wh-auto flex-row jc-sb align-c">
                            <view class="flex-row align-c flex-1 flex-width padding-bottom-xs">
                                <view class="cart-icon-total pr cp top-sm padding-left-main" @tap="cart_switch_event">
                                    <iconfont name="icon-cart" size="36rpx" color="#666"></iconfont>
                                    <view v-if="(cart || null) != null && (cart.buy_number || 0) > 0" class="badge-icon pa">
                                        <component-badge :propNumber="cart.buy_number"></component-badge>
                                    </view>
                                </view>
                                <view class="cart-total-price single-text fw-b cr-red padding-left-sm" @tap="cart_switch_event">
                                    <text class="text-size-xss">{{ propCurrencySymbol }}</text>
                                    <text class="text-size-lg">{{ (cart || null) == null ? '0.00' : (cart.total_price || '0.00') }}</text>
                                </view>
                            </view>
                            <view class="padding-right-main padding-top-main padding-bottom-sm">
                                <button v-if="params.source == 'goods'" type="default" size="mini" hover-class="none" @tap="cart_submit_event" :loading="realstore_goods_data_cart_loading" :class="'btn text-size-md round margin-right-main ' + (realstore_goods_data_cart_status ? 'bg-main-pair cr-white' : 'bg-grey-disabled cr-grey')" :disabled="!realstore_goods_data_cart_status">{{ realstore_goods_data_cart_text }}</button>
                                <button type="default" size="mini" hover-class="none" @tap="buy_submit_event" :loading="settlement_btn_loading" :class="'btn text-size-md round ' + (settlement_btn_status ? 'bg-main cr-white' : 'bg-grey-disabled cr-grey')">{{ settlement_btn_text }}</button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 下单类型选择弹窗 -->
            <block v-if="buy_use_type_choice_status">
                <!-- 下单类型选择弹层背景 -->
                <view class="plugins-realstore-buy-type-mask wh-auto ht-auto pf"></view>
                <!-- 下单类型弹窗选择 -->
                <view class="plugins-realstore-buy-type-choice pf bg-white border-radius-main padding-xxl">
                    <view class="tc margin-top-xs margin-bottom-xl">
                        <text class="cr-grey text-size">{{$t('realstore-cart.select_order_type')}}</text>
                        <view v-if="(base.is_tips_user_choice_buy_use_type_mandatory || 0) == 0" class="fr" @tap="buy_use_type_choice_close_event">
                            <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <block v-for="(item, index) in buy_use_type_choice_list" :key="index">
                        <view class="item pr">
                            <view :class="'item-content pr padding-horizontal border-radius-main item-content-'+item.index" :data-index="item.key" @tap="buy_use_type_choice_event">
                                <image class="left-icon dis-inline-block va-m" :src="static_url+'buy_use_type/'+item.index+'.png'" mode="aspectFit"></image>
                                <text class="cr-black text-size-sm va-m margin-left-sm">{{item.name}}</text>
                                <view class="right-arrow pa top-0 right-xxxxl">
                                    <iconfont name="icon-arrow-right" size="24rpx" propClass="lh-il" color="#333"></iconfont>
                                </view>
                            </view>
                            <!-- #ifndef H5 -->
                            <view v-if="item.index == 0" class="scan-item border-radius-main tc pa right-0 top-0" :data-index="index" @tap="search_icon_event">
                                <iconfont name="icon-scan" size="36rpx" propClass="lh-il va-m" color="#02b3c2"></iconfont>
                            </view>
                            <!-- #endif -->
                        </view>
                    </block>
                </view>
            </block>

            <!-- 商品购买 -->
            <component-goods-buy ref="goods_buy" :propCurrencySymbol="propCurrencySymbol" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>

            <!-- 购物车抛物线 -->
            <component-cart-para-curve ref="cart_para_curve"></component-cart-para-curve>
        </view>

        <!-- 员工预定 -->
        <component-popup :propShow="staff_booking_popup_status" propPosition="bottom" @onclose="staff_booking_close_event">
            <view class="padding-top-main bg-white plugins-realstore-staff-booking-popup">
                <view class="padding-horizontal-main margin-bottom pr">
                    <view class="plugins-realstore-staff-booking-title fw-b text-size tc">{{ staff_booking_popup_title }}</view>
                    <view class="plugins-realstore-staff-booking-close pa" @tap.stop="staff_booking_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>

                <scroll-view scroll-y="true" class="plugins-realstore-staff-booking-scroll-content">
                    <view class="plugins-realstore-staff-booking-scroll-inner padding-horizontal-main">
                        <view v-if="staff_booking_init_loading_status != 3" class="plugins-realstore-staff-booking-init-loading">
                            <component-no-data :propStatus="staff_booking_init_loading_status" :propMsg="staff_booking_init_loading_msg" :propBackBtn="false" propLoadingLogoTop="20%"></component-no-data>
                        </view>
                        <block v-if="staff_booking_init_loading_status == 3 && (staff_booking_cart_list || null) != null && staff_booking_cart_list.length > 0">
                            <view v-for="(goods, gindex) in staff_booking_cart_list" :key="gindex" :class="'plugins-realstore-staff-booking-goods-item ' + (gindex + 1 >= staff_booking_cart_list.length ? '' : 'br-b padding-bottom-xxxxl margin-bottom-xxxxl')">
                                <view class="flex-row jc-sb">
                                    <image :src="goods.images" mode="widthFix" class="plugins-realstore-staff-booking-goods-img radius br"></image>
                                    <view class="plugins-realstore-staff-booking-goods-base flex-1 flex-width padding-left-main flex-col jc-sb">
                                        <view class="plugins-realstore-staff-booking-goods-base-content">
                                            <view class="plugins-realstore-staff-booking-goods-title text-size-sm single-text">{{ goods.title }}</view>
                                            <view v-if="(goods.spec || null) != null && goods.spec.length > 0" class="text-size-xs cr-grey margin-top-sm single-text">
                                                <block v-for="(sv, si) in goods.spec" :key="si">
                                                    <text v-if="si > 0" class="padding-left-xs padding-right-xs">;</text>
                                                    <text>{{ sv.value }}</text>
                                                </block>
                                            </view>
                                        </view>
                                        <view>
                                            <view class="sales-price text-size-sm single-text">{{ propCurrencySymbol }}{{ goods.price }}</view>
                                        </view>
                                    </view>
                                </view>

                                <view v-for="(unit, uindex) in staff_booking_get_goods_units(goods)" :key="uindex"
                                    :class="'plugins-realstore-staff-booking-unit-block ' + (staff_booking_get_goods_units(goods).length > 1 && uindex > 0 ? 'plugins-realstore-staff-booking-unit-block-multi margin-top padding-top br-t-dashed' : 'margin-top-sm')">
                                    <view v-if="staff_booking_get_goods_units(goods).length > 1" class="plugins-realstore-staff-booking-unit-label text-size-xs cr-base margin-bottom-sm">{{$t('common.num')}}{{ uindex + 1 }}</view>

                                    <view v-if="staff_booking_prefer_mode != 1" class="margin-top-sm">
                                        <scroll-view scroll-x="true" class="plugins-realstore-staff-booking-staff-scroll" :show-scrollbar="false" enable-flex="true">
                                            <view class="plugins-realstore-staff-booking-staff-scroll-inner">
                                                <view v-for="(staff, sindex) in staff_booking_get_unit_staff_list(gindex, uindex)" :key="sindex"
                                                    :class="'plugins-realstore-staff-booking-staff-card dis-inline-block tc margin-right-sm br ' + (staff_booking_is_staff_selected(gindex, uindex, staff.id) ? 'br-main bg-main-light cr-main' : 'bg-white br-grey cp')"
                                                    :data-gindex="gindex"
                                                    :data-uindex="uindex"
                                                    :data-sindex="sindex"
                                                    @tap="staff_booking_goods_staff_event">
                                                    <image :src="staff.avatar" mode="aspectFill" class="plugins-realstore-staff-booking-staff-avatar-sm radius margin-bottom-xs"></image>
                                                    <view class="plugins-realstore-staff-booking-staff-name text-size-xss single-text">{{ staff.alias }}</view>
                                                </view>
                                            </view>
                                        </scroll-view>
                                    </view>

                                    <view v-if="staff_booking_get_booking_unit(gindex, uindex).staff_id > 0" class="margin-top-sm">
                                        <view class="cr-grey text-size-xss margin-bottom-xs">{{$t('realstore-cart.select_date')}}</view>
                                        <scroll-view scroll-x="true" class="scroll-view-horizontal plugins-realstore-staff-booking-unit-date-scroll" :show-scrollbar="false">
                                            <view v-for="(date_item, date_index) in staff_booking_ymd_list" :key="date_index"
                                                :class="'plugins-realstore-staff-booking-date-item margin-right-sm radius text-size-sm br ' + ((date_item.day_label || '') != '' ? 'plugins-realstore-staff-booking-date-item-with-label ' : 'plugins-realstore-staff-booking-date-item-no-label ') + (staff_booking_get_booking_unit(gindex, uindex).ymd == date_item.ymd ? 'br-main bg-main-light cr-main' : (date_item.disabled == 1 ? 'bg-grey-disabled cr-grey' : 'bg-white br-grey cr-base cp'))"
                                                :data-gindex="gindex"
                                                :data-uindex="uindex"
                                                :data-ymd="date_item.ymd"
                                                :data-disabled="date_item.disabled"
                                                @tap="staff_booking_goods_ymd_event">
                                                <view v-if="(date_item.day_label || '') != ''" class="plugins-realstore-staff-booking-date-main-wrap">
                                                    <view class="plugins-realstore-staff-booking-date-main">{{ date_item.date_text }}</view>
                                                </view>
                                                <view v-else class="plugins-realstore-staff-booking-date-main">{{ date_item.date_text }}</view>
                                                <view v-if="(date_item.day_label || '') != ''" class="plugins-realstore-staff-booking-date-day-label text-size-xss">{{ date_item.day_label }}</view>
                                            </view>
                                        </scroll-view>
                                    </view>

                                    <view v-if="staff_booking_get_booking_unit(gindex, uindex).staff_id > 0 && staff_booking_get_booking_unit(gindex, uindex).ymd > 0" class="plugins-realstore-staff-booking-period-list margin-top-sm">
                                        <view class="cr-grey text-size-xss margin-bottom-xs">{{$t('realstore-cart.select_time_slot_2')}}</view>
                                        <view v-if="staff_booking_is_unit_periods_empty_loading(gindex, uindex)" class="cr-grey text-size-xs">{{$t('common.loading_in_text')}}</view>
                                        <view v-else-if="staff_booking_get_unit_periods(gindex, uindex).length <= 0" class="cr-grey text-size-xs">{{$t('realstore-cart.available_time_slots_date')}}</view>
                                        <view v-else class="plugins-realstore-staff-booking-period-wrap">
                                            <view v-for="(period, pindex) in staff_booking_get_unit_periods(gindex, uindex)" :key="pindex"
                                                :class="'plugins-realstore-staff-booking-period-tag dis-inline-block margin-right-sm margin-bottom-sm padding-horizontal-sm padding-vertical-xs radius text-size-xs br ' + staff_booking_get_period_class(gindex, uindex, staff_booking_get_booking_unit(gindex, uindex).staff_id, period)"
                                                :data-gindex="gindex"
                                                :data-uindex="uindex"
                                                :data-pindex="pindex"
                                                @tap="staff_booking_goods_period_event">
                                                {{ period.name || '' }}<text v-if="parseInt(period.is_available || 0) == 0" class="cr-grey">({{ parseInt(period.occupied_flag || 0) == 1 ? $t('realstore-cart.booked') : $t('realstore-cart.taken') }})</text>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                </scroll-view>

                <view class="padding-main">
                    <button type="default" hover-class="none" :loading="staff_booking_submit_loading" :disabled="staff_booking_submit_loading || staff_booking_init_loading_status != 3" class="radius bg-main cr-white text-size-md wh-auto" @tap="staff_booking_submit_event">
                        {{$t('realstore-cart.confirm_checkout')}}
                    </button>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentPopup from "@/components/popup/popup";
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentCartParaCurve from '@/components/cart-para-curve/cart-para-curve';
    import componentBadge from '@/components/badge/badge';
    import componentNoData from '@/components/no-data/no-data';

    var static_url = app.globalData.get_static_url('realstore', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                static_url: static_url,
                params: {},
                is_first: 1,
                cart_status: false,
                cart: null,
                info: null,
                base: null,
                source: null,
                // 结算按钮
                settlement_btn_loading: true,
                settlement_btn_status: false,
                settlement_btn_text: this.$t('common.loading_in_text'),
                // 临时操作数据
                temp_opt_data: null,
                // 下单类型
                cache_buy_use_type_active_index_key: 'cache_plugins_realstore_buy_use_type_active_index_',
                buy_use_type_active_index: 0,
                // 下单类型选择弹窗
                buy_use_type_choice_list: [],
                buy_use_type_choice_status: false,
                cache_buy_use_type_interval_time_key: 'cache_plugins_realstore_buy_use_type_interval_time_',
                // 指定商品信息
                realstore_goods_data: null,
                // 操作按钮是否加载中
                realstore_goods_data_cart_loading: true,
                realstore_goods_data_cart_status: false,
                realstore_goods_data_cart_type: null,
                realstore_goods_data_cart_value: null,
                realstore_goods_data_cart_text: this.$t('common.loading_in_text'),
                // 样式
                realstore_cart_content_style: '',
                // 员工预定
                is_staff_booking: 0,
                staff_booking_popup_status: false,
                staff_booking_popup_title: '',
                staff_booking_realstore_id: 0,
                staff_booking_ymd_list: [],
                staff_booking_staff_list: [],
                staff_booking_cart_list: null,
                staff_booking_form: {},
                staff_booking_unit_periods: {},
                staff_booking_unit_periods_loading: {},
                staff_booking_init_loading_status: 3,
                staff_booking_init_loading_msg: '',
                staff_booking_submit_loading: false,
                staff_booking_prefer_mode: 0,
                staff_booking_prefer_staff_id: 0,
                staff_booking_prefer_staff_alias: '',
                staff_booking_prefer_staff_avatar: '',
                // 左滑删除
                swipe_item_index: null,
                swipe_options: [
                    {
                        text: this.$t('common.del'),
                        style: {
                            backgroundColor: '#E64340',
                        },
                    },
                ],
            };
        },

        components: {
            componentPopup,
            componentGoodsBuy,
            componentCartParaCurve,
            componentBadge,
            componentNoData,
        },
        props: {
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol(),
            },
            propIsBaseMode: {
                type: Boolean,
                default: false,
            },
            propStatus: {
                type: Boolean,
                default: true,
            },
            propIndex: {
                type: Number,
                default: 100
            },
            propStaffBookingPopupTitle: {
                type: String,
                default: '',
            }
        },

        created: function() {},

        methods: {
            // 获取数据
            init(params) {
                // 非基础模式
                if(!this.propIsBaseMode) {
                    // 获取底部菜单高度、如果当前为底部菜单页面则增加底部间距、如果当前使用了原生菜单则不取底部菜单高度
                    var tabbar_height = (app.globalData.data.is_tabbar_pages == 0 && app.globalData.is_tabbar_pages()) ? (app.globalData.app_tabbar_height_value()*2) : 0;
                    // 门店信息
                    var info = params.info || null;
                    if(info != null && (params.source || null) != null) {
                        this.setData({
                            params: params,
                            info: info,
                            base: params.base || null,
                            source: params.source,
                            realstore_cart_content_style: 'bottom: '+tabbar_height+'rpx',
                            is_staff_booking: parseInt((params.base || {}).is_buy_staff_booking || 0),
                        });

                        // 商品来源
                        var type_data = this.buy_use_type_data();
                        if(this.source == 'goods' && (params.realstore_id || null) == null) {
                            var back_data = {
                                buy_use_type_active_index: type_data.active_index,
                                buy_use_type_data_index: type_data.data_index,
                                realstore_id: this.info.id,
                            };
                            // 缓存事件数据
                            uni.setStorageSync(app.globalData.data.cache_plugins_realstore_cart_keys.refresh_loading_event, back_data);
                            // 调用父级需要重新加载数据
                            this.$emit('RefreshLoadingEvent', back_data);
                        } else {
                            // 非系统购物车来源
                            if(this.source != 'system-cart') {
                                // 店铺状态正常、是否指定商品、如果不存在操作按钮、不可以加入购物车则置空
                                var cart_status = false;
                                var cart_type = '';
                                var cart_text = '';
                                var realstore_goods_data = params.realstore_goods_data || null;
                                if(realstore_goods_data != null && (realstore_goods_data.buy_button || null) != null) {
                                    // 是否存在错误
                                    if((realstore_goods_data.buy_button.error || null) != null) {
                                        cart_text = realstore_goods_data.buy_button.error;
                                        // 是否展示型、门店存在客服电话则展示电话号码
                                        if((realstore_goods_data.buy_button.data || null) != null && (realstore_goods_data.buy_button['data'][0] || null) != null && realstore_goods_data.buy_button['data'][0]['type'] == 'show') {
                                            var cart_value = ((info.service_data || null) == null ? info.contacts_tel : (info.service_data.service_tel || info.contacts_tel)) || null;
                                            if(cart_value != null) {
                                                cart_status = true;
                                                cart_type = 'show';
                                                cart_text = this.$t('common.consult_now');
                                            }
                                        }
                                    } else {
                                        // 匹配是否可以加入购物车操作
                                        if(realstore_goods_data.buy_button.data.length > 0) {
                                            var buy_button = realstore_goods_data.buy_button.data;
                                            var arr = ['cart', 'buy', 'plugins-batchbuy-button-cart', 'plugins-batchbuy-button-buy'];
                                            for(var i in buy_button) {
                                                if(arr.indexOf(buy_button[i]['type']) != -1) {
                                                    cart_status = true;
                                                    cart_type = buy_button[i]['type'];
                                                    cart_text = this.$t('realstore-cart.add_cart');
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                this.setData({
                                    realstore_goods_data: realstore_goods_data,
                                    realstore_goods_data_cart_status: cart_status,
                                    realstore_goods_data_cart_type: cart_type,
                                    realstore_goods_data_cart_value: cart_value,
                                    realstore_goods_data_cart_loading: false,
                                    realstore_goods_data_cart_text: cart_text,
                                });

                                // 是否需要弹出下单类型选择
                                // 打开开关，并且店铺必须存在下单类型
                                var cache_index = this.get_cache_buy_use_type_active_index();
                                if(this.params.buy_use_type == undefined && (this.base || null) != null && parseInt(this.base.is_tips_user_choice_buy_use_type || 0) == 1 && (cache_index === null || cache_index === '') && (this.info.buy_use_type_list || null) != null && this.info.buy_use_type_list.length > 1 && (this.info.status_info || null) != null && this.info.status_info.status == 1) {
                                    // 门店、商品是否开启了弹窗提示
                                    var key = 'is_tips_user_choice_buy_use_type_'+this.params.source+'_detail';
                                    if(parseInt(this.base[key] || 0) == 1) {
                                        // 配置的间隔时间（秒）
                                        var interval_time = parseInt(this.base.tips_user_choice_buy_use_type_interval_time || 0);
                                        // 缓存的间隔时间（秒）
                                        var cache_time = parseInt(uni.getStorageSync(this.cache_buy_use_type_interval_time_key+this.info.id) || 0);
                                        // 当前时间（秒）
                                        var current_time = Date.parse(new Date()) / 1000;
                                        // 配置时间为空 或 缓存时间为空 或 当前时间大于缓存+配置时间
                                        if (interval_time == 0 || (cache_time == 0 || current_time > cache_time+interval_time)) {
                                            // 倒序处理展示、系统默认在店在最前面，目的是让在店在最后面展示
                                            var temp = [];
                                            this.info.buy_use_type_list.forEach((v, i) => {
                                                v['key'] = i;
                                                temp.unshift(v);
                                            });
                                            this.setData({
                                                buy_use_type_choice_list: temp,
                                                buy_use_type_choice_status: true
                                            });
                                        }
                                    }
                                }

                                // 获取购物车数据
                                this.get_cart_data();
                            }
                        }

                        // 设置下单类型
                        this.setData({
                            buy_use_type_active_index: type_data.active_index,
                        });
                    }
                }
            },

            // 获取购物车数据
            get_cart_data() {
                uni.request({
                    url: app.globalData.get_request_url('cartdata', 'detail', 'realstore'),
                    method: 'POST',
                    data: this.request_params_merge(
                        {
                            id: this.info.id || 0,
                        }, 'cart'),
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            this.setData({
                                cart: res.data.data,
                            });

                            // 首次判断是否需要开启购物车
                            if(this.is_first == 1 && (this.params.is_show_cart || 0) == 1) {
                                this.cart_event(true);
                            }

                            // 非首次状态记录
                            this.setData({
                                is_first: 0,
                            });

                            // 缓存事件数据
                            uni.setStorageSync(app.globalData.data.cache_plugins_realstore_cart_keys.cart_data_back, this.cart);
                            // 购物车获取成功回调
                            this.$emit('CartDataBackEvent', this.cart);
                        } else {
                            app.globalData.showToast(this.$t('realstore-cart.request_failed_try_again'));
                        }
                        
                        // 结算按钮处理
                        this.settlement_btn_handle();
                    },
                    fail: () => {
                        // 结算按钮处理
                        this.settlement_btn_handle();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 结算按钮处理
            settlement_btn_handle() {
                // 结算按钮状态处理
                var btn_status = true;
                var btn_text = this.$t('common.go_settlement');
                if(this.info.status_info.status != 1) {
                    btn_status = false;
                    btn_text = this.info.status_info.msg;
                } else {
                    // 购物车是否存在商品
                    if((this.cart || null) == null || parseInt(this.cart.buy_number || 0) == 0) {
                        btn_status = false;
                    } else {
                        // 起步价
                        var msg = this.starting_price_handle();
                        if(msg !== null) {
                            btn_status = false;
                            btn_text = msg;
                        }
                    }
                }

                this.setData({
                    settlement_btn_status: btn_status,
                    settlement_btn_loading: false,
                    settlement_btn_text: btn_text,
                });
            },

            // 起步价处理
            starting_price_handle() {
                var starting_price = parseFloat(this.info.starting_price) || 0;
                if(starting_price > 0 && (this.cart || null) != null) {
                    if(parseFloat(this.cart.total_price) < starting_price) {
                        // 是否限制类型
                        var limit_type = this.info.starting_price_limit_type_list || [];
                        if(limit_type.length > 0) {
                            var type_data = this.buy_use_type_data();
                            if(limit_type.indexOf(type_data.data_index) != -1 || limit_type.indexOf(type_data.data_index.toString()) != -1) {
                                return this.$t('realstore-cart.start')+ this.propCurrencySymbol + starting_price;
                            }
                        } else {
                            return this.$t('realstore-cart.start') + this.propCurrencySymbol + starting_price;
                        }
                    }
                }
                return null;
            },

            // 购物车状态切换
            cart_switch_event(e) {
                this.setData({
                    cart_status: !this.cart_status,
                });
                this.swipe_close_handle();
            },

            // 购物车状态设置
            cart_event(status) {
                this.setData({
                    cart_status: status,
                });
                if(!status) {
                    this.swipe_close_handle();
                }
            },

            // 关闭所有滑动
            swipe_close_handle() {
                this.setData({
                    swipe_item_index: null,
                });
                if((this.$refs.swipe_action || null) != null) {
                    this.$refs.swipe_action.closeAll();
                }
            },

            // 滑动事件
            swipe_change(e, v) {
                this.setData({
                    swipe_item_index: e == 'none' ? null : v,
                });
            },

            // 左滑删除
            swipe_opt_event(e) {
                var temp_data = ((this.cart || null) != null && (this.cart.data || null) != null) ? this.cart.data : [];
                if(this.swipe_item_index === null || (temp_data[this.swipe_item_index] || null) == null) {
                    app.globalData.showToast(this.$t('common.data_not_exist'));
                    return false;
                }
                var goods = temp_data[this.swipe_item_index];
                this.cart_delete(goods['id'], goods['goods_id']);
                this.swipe_close_handle();
            },

            // 加入购物车
            cart_submit_event(e) {
                // 是否展示模式、则拨打电话
                if(this.realstore_goods_data_cart_type == 'show' && (this.realstore_goods_data_cart_value || null) != null) {
                    app.globalData.call_tel(this.realstore_goods_data_cart_value);
                    return false;
                }

                // 门店商品是否正常
                if((this.realstore_goods_data || null) == null) {
                    app.globalData.showToast(this.$t('realstore-cart.product_data_incorrect'));
                    return false;
                }
                this.$refs.goods_buy.init(this.realstore_goods_data, {...this.params, ...{buy_event_type: 'cart'}});
            },

            // 购物车结算
            buy_submit_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }

                // 门店状态
                if(!this.is_status_check()) {
                    return false;
                }

                // 获取购物车数据
                var ids = [];
                if((this.cart || null) != null) {
                    var temp_data = this.cart.data || [];
                    for (var i in temp_data) {
                        ids.push(temp_data[i]['id']);
                    }
                }
                if(ids.length <= 0) {
                    app.globalData.showToast(this.$t('realstore-cart.add_product_first'));
                    return false;
                }

                // 起步价
                var msg = this.starting_price_handle();
                if(msg !== null) {
                    app.globalData.showToast(msg);
                    return false;
                }

                this.buy_open_handle();
            },

            // 跳转订单确认
            buy_open_handle() {
                var ids = [];
                if((this.cart || null) != null) {
                    var temp_data = this.cart.data || [];
                    for (var i in temp_data) {
                        ids.push(temp_data[i]['id']);
                    }
                }
                var data = this.request_params_merge(
                    {
                        buy_type: 'cart',
                        ids: ids.join(','),
                    }, 'buy');
                data['staff_booking_cart_list'] = (this.cart || null) != null ? (this.cart.data || []) : [];
                app.globalData.to_buy_handle(data, '/pages/buy/buy', this);
            },

            // 员工预定成功回调
            staff_booking_success_event(booking_data) {
                if((app.globalData.data.staff_booking_pending || null) != null) {
                    app.globalData.staff_booking_success(booking_data);
                    return true;
                }
                var ids = [];
                if((this.cart || null) != null) {
                    var temp_data = this.cart.data || [];
                    for (var i in temp_data) {
                        ids.push(temp_data[i]['id']);
                    }
                }
                var data = this.request_params_merge(
                    {
                        buy_type: 'cart',
                        ids: ids.join(','),
                    }, 'buy');
                data['staff_booking_cart_list'] = (this.cart || null) != null ? (this.cart.data || []) : [];
                if((booking_data || null) != null) {
                    data['staff_booking_data'] = booking_data;
                }
                app.globalData.to_buy_handle_finish(data);
            },

            // 门店状态判断
            is_status_check() {
                if((this.info || null) == null) {
                    app.globalData.showToast(this.$t('realstore-cart.incorrect_store_info'));
                    return false;
                } else {
                    if(this.info.status_info.status != 1) {
                        app.globalData.showToast(this.info.status_info.msg);
                        return false;
                    }
                }
                return true;
            },

            // 批量删除操作
            cart_all_delete_event(e) {
                var self = this;
                uni.showModal({
                    title: self.$t('common.warm_tips'),
                    content: self.$t('common.after_picking_so_long_really_want'),
                    confirmText: self.$t('common.confirm'),
                    cancelText: self.$t('common.not_yet'),
                    success: (result) => {
                        if(result.confirm) {
                            self.setData({
                                temp_opt_data: null,
                            });
                            var ids = [];
                            var temp_data = self.cart.data;
                            for (var i in temp_data) {
                                ids.push(temp_data[i]['id']);
                            }
                            self.cart_delete(ids.join(','));
                            self.cart_event(false);
                        }
                    },
                });
            },

            // 购物车数量操作
            cart_stock_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'cart_stock_event', e);
                if(user != false) {
                    var index = e.currentTarget.dataset.index;
                    var type = parseInt(e.currentTarget.dataset.type) || 0;
                    var temp_data = this.cart.data;
                    var temp_goods = temp_data[index];

                    // 数据操作处理
                    var opt_number = this.stock_handle(type, temp_goods, 'stock');
                    if(opt_number === false) {
                        return false;
                    }

                    // 数据临时记录
                    this.setData({
                        temp_opt_data: null,
                    });

                    // 操作类型
                    if(opt_number == 0) {
                        this.cart_delete(temp_goods['id'], temp_goods.goods_id);
                    } else {
                        var number = type == 0 ? parseInt(temp_goods['stock']) - opt_number : opt_number + parseInt(temp_goods['stock']);
                        this.cart_update(temp_goods['id'], temp_goods['goods_id'], number);
                    }
                }
            },

            // 数量操作处理
            stock_handle(type, goods, stock_field) {
                // 加减处理
                var stock = parseInt(goods[stock_field]) || 0;
                if(type == 0) {
                    stock -= 1;
                } else {
                    stock += 1;
                }
                if(stock < 0) {
                    stock = 0;
                }
        
                // 数据校验
                var buy_min_number = parseInt(goods['buy_min_number']) || 1;
                var buy_max_number = parseInt(goods['buy_max_number']) || 0;
                var spec_buy_min_number = parseInt(goods['spec_buy_min_number']) || 0;
                var spec_buy_max_number = parseInt(goods['spec_buy_max_number']) || 0;
                var inventory = parseInt(goods['inventory']);
                var inventory_unit = goods['inventory_unit'];

                // 最小起购数量
                var min = spec_buy_min_number > 0 ? spec_buy_min_number : buy_min_number;
                if(min > 0) {
                    if(type == 0) {
                        if(stock < min) {
                            stock = 0;
                        }
                    } else {
                        if(stock < min) {
                            stock = min;
                        }
                    }
                }

                // 最大购买数量
                var max = spec_buy_max_number > 0 ? spec_buy_max_number : buy_max_number;
                if(max > 0 && stock > max) {
                    stock = max;
                    app.globalData.showToast(this.$t('common.purchase_limit') + max + inventory_unit);
                    return false;
                }

                // 数量是否改变
                if(goods[stock_field] == stock) {
                    app.globalData.showToast(this.$t('common.quantity_unchanged'));
                    return false;
                }

                // 操作数量
                var opt_number = 1;
                if(type == 0) {
                    if(stock <= 0) {
                        opt_number = 0;
                    }
                } else {
                    if(stock > goods['buy_number']) {
                        opt_number = stock - goods['buy_number'];
                    }
                }
                return opt_number;
            },

            // 购物车添加
            cart_save(goods_id, stock, spec = '') {
                uni.request({
                    url: app.globalData.get_request_url('save', 'cart'),
                    method: 'POST',
                    data: {
                        goods_id: goods_id,
                        stock: stock,
                        spec: spec,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            // 购物车操作成功回调
                            this.cart_opt_success_handle({
                                type: 'save',
                                goods_id: goods_id,
                                stock: stock,
                            });
                        } else {
                            if(app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 购物车更新
            cart_update(cart_id, goods_id, stock) {
                uni.request({
                    url: app.globalData.get_request_url('stock', 'cart'),
                    method: 'POST',
                    data: {
                        id: cart_id,
                        goods_id: goods_id,
                        stock: stock,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            // 购物车操作成功回调
                            this.cart_opt_success_handle({
                                type: 'update',
                                cart_id: cart_id,
                                goods_id: goods_id,
                                stock: stock,
                            });
                        } else {
                            if(app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 购物车删除
            cart_delete(cart_id, goods_id = null) {
                uni.request({
                    url: app.globalData.get_request_url('delete', 'cart'),
                    method: 'POST',
                    data: {
                        id: cart_id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            // 购物车操作成功回调
                            this.cart_opt_success_handle({
                                type: (goods_id === null) ? 'all-delete' : 'delete',
                                cart_id: cart_id,
                                goods_id: goods_id,
                                stock: 0,
                            });
                        } else {
                            if(app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 扫码事件
            search_icon_event(e) {
                this.buy_use_type_choice_event(e);
                this.search_icon_handle(e);
            },

            // 搜索icon扫码事件、扫码商品id实现加入购物车
            search_icon_handle(e) {
                var user = app.globalData.get_user_info(this, 'search_icon_handle', e);
                if (user != false) {
                    // 门店状态
                    if (!this.is_status_check()) {
                        return false;
                    }

                    // 调用扫码
                    var self = this;
                    uni.scanCode({
                        success: function (res) {
                            uni.showLoading({
                                title: self.$t('common.processing_in_text'),
                                mask: true,
                            });
                            uni.request({
                                url: app.globalData.get_request_url('scan', 'detail', 'realstore'),
                                method: 'POST',
                                data: self.request_params_merge(
                                    {
                                        value: res.result,
                                    }, 'buy'),
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        if (res.data.data.is_error == 1) {
                                            app.globalData.showToast(res.data.data.is_error_msg);
                                        } else {
                                            // 加入购物车
                                            self.cart_save(res.data.data.goods_id, 1, res.data.data.spec);
                                        }
                                    } else {
                                        if (app.globalData.is_login_check(res.data)) {
                                            app.globalData.showToast(res.data.msg);
                                        } else {
                                            app.globalData.showToast(self.$t('common.sub_error_retry_tips'));
                                        }
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(self.$t('common.internet_error_tips'));
                                },
                            });
                        },
                    });
                }
            },

            // 商品操作处理，添加，减少，增加数量自动处理
            goods_opt_handle(type, goods, spec, stock_field, pos = null) {
                var opt_number = this.stock_handle(type, goods, stock_field);
                if(opt_number === false) {
                    return false;
                }

                // 临时存在操作数据
                this.setData({
                    temp_opt_data: {
                        pos: pos,
                        goods: goods,
                        type: type,
                    },
                });

                // 为0或减操作则查询
                var cart_item = this.goods_opt_cart_data(type, goods, spec);
                
                // 操作类型
                if(opt_number == 0) {
                    if(cart_item == null) {
                        app.globalData.showToast(this.$t('common.cart_id_incorrect'));
                        return false;
                    }
                    this.cart_delete(cart_item.id, cart_item.goods_id);
                } else if(cart_item == null) {
                    this.cart_save(goods['id'], opt_number, spec);
                } else {
                    var number = type == 0 ? parseInt(cart_item['stock']) - opt_number : opt_number + parseInt(cart_item['stock']);
                    this.cart_update(cart_item.id, goods['id'], number);
                }
            },

            // 商品操作获取购物车存在的数据
            // type 0减少, 1增加
            // goods 商品数据
            // spec 操作的商品规格
            goods_opt_cart_data(type, goods, spec = '') {
                var cart_item = null;
                if(type == 0 || (type == 1 && goods['buy_number'] > 0)) {
                    var cart_data = this.cart.data;
                    var params_spec = (spec || null) == null || typeof spec != 'object' ? '' : JSON.stringify(spec);
                    for (var i in cart_data) {
                        if(goods['id'] == cart_data[i]['goods_id']) {
                            var cart_spec = (cart_data[i]['spec'] || null) == null || typeof cart_data[i]['spec'] != 'object' ? '' : JSON.stringify(cart_data[i]['spec']);
                            if(type == 0 || (type == 1 && cart_spec == params_spec)) {
                                cart_item = cart_data[i];
                            }
                            break;
                        }
                    }
                }
                return cart_item;
            },

            // 购物车操作成功处理
            cart_opt_success_handle(params) {
                // 获取购物车数据
                this.get_cart_data();

                // 缓存事件数据
                uni.setStorageSync(app.globalData.data.cache_plugins_realstore_cart_keys.cart_opt_success_back, params);
                // 调用父级
                this.$emit('CartSuccessEvent', params);

                // 执行购物车抛物线
                this.cart_para_curve_handle();
            },

            // 购物车抛物线动画
            cart_para_curve_handle() {
                if((this.temp_opt_data || null) != null && (this.temp_opt_data.pos || null) != null && (this.temp_opt_data.type || 0) == 1) {
                    if((this.$refs.cart_para_curve || null) != null) {
                        this.$refs.cart_para_curve.init(null, this.temp_opt_data.pos, this.temp_opt_data.goods.images, 0);
                    }
                }
            },

            // 使用类型事件
            buy_use_type_event() {
                var self = this;
                uni.showActionSheet({
                    itemList: this.info.buy_use_type_list.map(function (v) {
                        return v.name;
                    }),
                    success: function (res) {
                        self.buy_use_type_confirm_handle(self, res.tapIndex);
                    },
                });
            },

            // 下单类型选择事件
            buy_use_type_choice_event(e) {
                this.buy_use_type_confirm_handle(this, e.currentTarget.dataset.index);
                this.setData({
                    buy_use_type_choice_status: false,
                });
                app.globalData.showToast(this.$t('common.selection_successful'), 'success');
            },

            // 下单类型确认处理
            buy_use_type_confirm_handle(self, index) {
                self.setData({
                    buy_use_type_active_index: index,
                    settlement_btn_loading: true,
                    realstore_goods_data_cart_loading: true,
                });
                uni.setStorageSync(self.cache_buy_use_type_active_index_key+self.info.id, index);

                // 获取购物车数据、系统购物车来源则不执行
                if(this.source != 'system-cart') {
                    self.get_cart_data();
                }

                // 下单类型切换回调
                var type_data = this.buy_use_type_data();
                var back_data = {
                    buy_use_type_active_index: type_data.active_index,
                    buy_use_type_data_index: type_data.data_index,
                    realstore_id: this.info.id,
                };
                // 缓存事件数据
                uni.setStorageSync(app.globalData.data.cache_plugins_realstore_cart_keys.buy_type_switch_event, back_data);
                // 回调事件
                self.$emit('BuyTypeSwitchEvent', back_data);
            },

            // 下单类型弹窗关闭
            buy_use_type_choice_close_event(e) {
                this.setData({
                    buy_use_type_choice_status: false,
                });
                uni.setStorageSync(this.cache_buy_use_type_interval_time_key+this.info.id, Date.parse(new Date()) / 1000);
            },

            // 获取使用类型数据索引、默认在店0
            buy_use_type_data() {
                // 不在店铺设置的类型列表则默认0
                var data = {
                    active_index: 0,
                    data_index: 0,
                }
                // 门店信息
                if((this.info || null) != null) {
                    // 门店下单类型列表
                    var use_type_list = this.info.buy_use_type_list;
                    // 用户未设置类型则使用默认的
                    var active_index = this.get_cache_buy_use_type_active_index();
                    if(active_index !== null && active_index !== '') {
                        var temp = use_type_list[active_index] || null;
                        if(temp != null) {
                            data['active_index'] = active_index;
                            data['data_index'] = temp.index;
                        }
                    } else {
                        // 是否默认类型
                        if(this.info.default_buy_use_type != undefined && this.info.default_buy_use_type != -1) {
                            // 不在店铺设置的类型列表则默认0
                            for (var i in use_type_list) {
                                if(use_type_list[i]['index'] == this.info.default_buy_use_type) {
                                    data['active_index'] = i;
                                    data['data_index'] = use_type_list[i]['index'];
                                    break;
                                }
                            }
                        }
                    }
                    // 是否指定类型
                    if(this.params.buy_use_type !== undefined) {
                        var buy_use_type = parseInt(this.params.buy_use_type);
                        for (var i in use_type_list) {
                            if(use_type_list[i]['index'] == buy_use_type) {
                                data['active_index'] = i;
                                data['data_index'] = use_type_list[i]['index'];
                                break;
                            }
                        }
                    }
                }
                return data;
            },

            // 获取下单类型缓存数据
            get_cache_buy_use_type_active_index() {
                return uni.getStorageSync(this.cache_buy_use_type_active_index_key+this.info.id);
            },

            // 请求参数处理
            // 默认增加使用类型参数
            // 下单 buy / 初始化 init / 获取数据 data / 获取购物车 cart
            request_params_merge(data, type = 'init') {
                // 用户使用类型
                if((this.info || null) != null && (this.info.buy_use_type_list || null) != null && this.info.buy_use_type_list.length > 0) {
                    var type_data = this.buy_use_type_data();
                    data['buy_use_type_data_index'] = type_data.data_index;
                }

                // 初始化
                if(type == 'init' || type == 'buy') {
                    // 桌码
                    if((this.params.tablecode_id || null) != null) {
                        data['tablecode_id'] = this.params.tablecode_id;
                    }
                }

                // 初始化、获取数据
                if(type == 'init' || type == 'data' || type == 'cart') {
                    // 用户选择的位置
                    var lng = 0;
                    var lat = 0;
                    var user_location = app.globalData.choice_user_location_init();
                    if((user_location || null) != null) {
                        lng = user_location.lng || 0;
                        lat = user_location.lat || 0;
                    }
                    data['lng'] = lng;
                    data['lat'] = lat;
                }

                // 提交订单
                if(type == 'buy') {
                    // 门店id
                    data['realstore_id'] = this.info.id;
                }

                return data;
            },

            // 加入购物车成功回调
            goods_cart_back_event(e) {
                this.get_cart_data();
            },

            // 商品事件
            goods_event(e) {
                // 是否可以打开商品页面
                if(app.globalData.data.is_realstore_forbid_to_goods_detail != 1) {
                    // 商品数据缓存处理
                    var goods = this.cart.data[e.currentTarget.dataset.index];
                    goods['id'] = goods.goods_id;
                    app.globalData.goods_data_cache_handle(goods.id, goods);
                    
                    // 调用公共打开url地址
                    var type_data = this.buy_use_type_data();
                    var url = '/pages/goods-detail/goods-detail?id=' + goods.id + '&is_opt_back=1&buy_use_type_data_index=' + type_data.data_index + '&realstore_id=' + this.info.id;
                    app.globalData.url_open(url);
                }
            },

            // 员工预定弹窗标题
            staff_booking_resolve_popup_title(api_title) {
                if((this.propStaffBookingPopupTitle || '') != '') {
                    return this.propStaffBookingPopupTitle;
                }
                return api_title || this.$t('realstore-cart.select_staff_time_slot');
            },

            // 打开员工预定弹窗并初始化
            staff_booking_init(params) {
                params = params || {};
                var cart_list = params.cart_list || null;
                var realstore_id = params.realstore_id || 0;
                var prefer_staff_id = parseInt(params.prefer_staff_id || 0);
                var prefer_staff_alias = params.prefer_staff_alias || '';
                var prefer_staff_avatar = params.prefer_staff_avatar || '';
                var prefer_mode = prefer_staff_id > 0 ? 1 : 0;
                var booking_form = {};
                if(cart_list != null) {
                    for(var gi in cart_list) {
                        var stock = parseInt(cart_list[gi].stock) || 1;
                        booking_form[gi] = [];
                        for(var ui = 0; ui < stock; ui++) {
                            booking_form[gi].push({
                                cart_id: cart_list[gi].id,
                                goods_id: cart_list[gi].goods_id,
                                unit_index: ui,
                                staff_id: prefer_mode == 1 ? prefer_staff_id : 0,
                                staff_alias: prefer_mode == 1 ? prefer_staff_alias : '',
                                staff_avatar: prefer_mode == 1 ? prefer_staff_avatar : '',
                                booking_periods_id: 0,
                                period_text: '',
                                ymd: 0,
                            });
                        }
                    }
                }
                this.setData({
                    staff_booking_popup_status: true,
                    staff_booking_popup_title: this.propStaffBookingPopupTitle || '',
                    staff_booking_realstore_id: realstore_id,
                    staff_booking_cart_list: cart_list,
                    staff_booking_form: booking_form,
                    staff_booking_unit_periods: {},
                    staff_booking_unit_periods_loading: {},
                    staff_booking_init_loading_status: 1,
                    staff_booking_init_loading_msg: '',
                    staff_booking_prefer_mode: prefer_mode,
                    staff_booking_prefer_staff_id: prefer_staff_id,
                    staff_booking_prefer_staff_alias: prefer_staff_alias,
                    staff_booking_prefer_staff_avatar: prefer_staff_avatar,
                });
                this.staff_booking_load_init_data();
            },

            // 按商品购买数量返回序号数组
            staff_booking_get_goods_units(goods) {
                var stock = parseInt(goods.stock) || 1;
                var units = [];
                for(var i = 0; i < stock; i++) {
                    units.push(i);
                }
                return units;
            },

            // 获取某个商品某个数量单元的预约表单数据
            staff_booking_get_booking_unit(gindex, uindex) {
                var units = this.staff_booking_form[gindex] || [];
                return units[uindex] || {};
            },

            // 判断服务人员是否已被当前单元选中
            staff_booking_is_staff_selected(gindex, uindex, staff_id) {
                var item = this.staff_booking_get_booking_unit(gindex, uindex);
                return (item.staff_id || 0) == staff_id;
            },

            // 获取某个单元已加载的时段列表
            staff_booking_get_unit_periods(gindex, uindex) {
                var unit_key = String(gindex) + '_' + String(uindex);
                return this.staff_booking_unit_periods[unit_key] || [];
            },

            // 时段是否正在加载且尚无数据
            staff_booking_is_unit_periods_empty_loading(gindex, uindex) {
                var unit_key = String(gindex) + '_' + String(uindex);
                return (this.staff_booking_unit_periods_loading[unit_key] || 0) == 1 && this.staff_booking_get_unit_periods(gindex, uindex).length <= 0;
            },

            // 加载可选日期、服务人员等初始化数据
            staff_booking_load_init_data() {
                this.setData({
                    staff_booking_init_loading_status: 1,
                    staff_booking_init_loading_msg: '',
                });
                var post_data = { realstore_id: this.staff_booking_realstore_id };
                var cart_list = this.staff_booking_cart_list || [];
                if(cart_list.length == 1 && parseInt(cart_list[0].goods_id || 0) > 0) {
                    post_data.goods_id = parseInt(cart_list[0].goods_id);
                }
                uni.request({
                    url: app.globalData.get_request_url('available', 'staffbooking', 'realstore'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        var set_data = {
                            staff_booking_init_loading_status: 0,
                            staff_booking_init_loading_msg: '',
                        };
                        if(res.data.code == 0) {
                            var result = res.data.data;
                            var form = this.staff_booking_form;
                            if((this.staff_booking_cart_list || null) != null && Object.keys(form).length <= 0) {
                                form = {};
                                for(var gi in this.staff_booking_cart_list) {
                                    var stock = parseInt(this.staff_booking_cart_list[gi].stock) || 1;
                                    form[gi] = [];
                                    for(var ui = 0; ui < stock; ui++) {
                                        form[gi].push({
                                            cart_id: this.staff_booking_cart_list[gi].id,
                                            goods_id: this.staff_booking_cart_list[gi].goods_id,
                                            unit_index: ui,
                                            staff_id: 0,
                                            staff_alias: '',
                                            staff_avatar: '',
                                            booking_periods_id: 0,
                                            period_text: '',
                                            ymd: 0,
                                        });
                                    }
                                }
                            }
                            set_data.staff_booking_ymd_list = result.ymd_list || [];
                            set_data.staff_booking_staff_list = result.staff_list || [];
                            set_data.staff_booking_form = form;
                            set_data.staff_booking_popup_title = this.staff_booking_resolve_popup_title(result.popup_title || '');
                            set_data.staff_booking_init_loading_status = 3;
                        } else {
                            set_data.staff_booking_init_loading_msg = res.data.msg;
                        }
                        this.setData(set_data);
                    },
                    fail: () => {
                        this.setData({
                            staff_booking_init_loading_status: 0,
                            staff_booking_init_loading_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 加载指定单元的可用时段
            staff_booking_load_unit_periods(gindex, uindex, staff_id, ymd) {
                var unit_key = String(gindex) + '_' + String(uindex);
                var loading_map = JSON.parse(JSON.stringify(this.staff_booking_unit_periods_loading || {}));
                loading_map[unit_key] = 1;
                this.setData({ staff_booking_unit_periods_loading: loading_map });

                uni.request({
                    url: app.globalData.get_request_url('available', 'staffbooking', 'realstore'),
                    method: 'POST',
                    data: {
                        realstore_id: this.staff_booking_realstore_id,
                        staff_id: staff_id,
                        ymd: ymd,
                        goods_id: (this.staff_booking_cart_list || [])[gindex] ? (this.staff_booking_cart_list[gindex].goods_id || 0) : 0,
                    },
                    dataType: 'json',
                    success: (res) => {
                        var periods_map = JSON.parse(JSON.stringify(this.staff_booking_unit_periods || {}));
                        var loading_map_done = JSON.parse(JSON.stringify(this.staff_booking_unit_periods_loading || {}));
                        var form = JSON.parse(JSON.stringify(this.staff_booking_form || {}));
                        loading_map_done[unit_key] = 0;
                        if(res.data.code == 0) {
                            var staff_list = res.data.data.staff_list || [];
                            var periods = [];
                            for(var i in staff_list) {
                                if(parseInt(staff_list[i]['id']) == parseInt(staff_id)) {
                                    periods = staff_list[i]['periods'] || [];
                                    break;
                                }
                            }
                            periods_map[unit_key] = periods;
                            var item = form[gindex][uindex];
                            if((item.booking_periods_id || 0) > 0) {
                                var matched = null;
                                for(var pi in periods) {
                                    if(parseInt(periods[pi]['id']) == parseInt(item.booking_periods_id)) {
                                        matched = periods[pi];
                                        break;
                                    }
                                }
                                if(matched == null || parseInt(matched.is_available || 0) == 0) {
                                    item.booking_periods_id = 0;
                                    item.period_text = '';
                                    if(matched != null) {
                                        app.globalData.showToast(this.$t('realstore-cart.time_slot_occupied_select_again'));
                                    }
                                }
                            }
                        } else {
                            periods_map[unit_key] = [];
                            app.globalData.showToast(res.data.msg);
                        }
                        this.setData({
                            staff_booking_unit_periods: periods_map,
                            staff_booking_unit_periods_loading: loading_map_done,
                            staff_booking_form: form,
                        });
                    },
                    fail: () => {
                        var periods_map = JSON.parse(JSON.stringify(this.staff_booking_unit_periods || {}));
                        var loading_map_done = JSON.parse(JSON.stringify(this.staff_booking_unit_periods_loading || {}));
                        periods_map[unit_key] = [];
                        loading_map_done[unit_key] = 0;
                        this.setData({
                            staff_booking_unit_periods: periods_map,
                            staff_booking_unit_periods_loading: loading_map_done,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 清空某个单元的时段缓存
            staff_booking_clear_unit_periods(gindex, uindex) {
                var unit_key = String(gindex) + '_' + String(uindex);
                var periods_map = JSON.parse(JSON.stringify(this.staff_booking_unit_periods || {}));
                var loading_map = JSON.parse(JSON.stringify(this.staff_booking_unit_periods_loading || {}));
                delete periods_map[unit_key];
                delete loading_map[unit_key];
                this.setData({
                    staff_booking_unit_periods: periods_map,
                    staff_booking_unit_periods_loading: loading_map,
                });
            },

            // 判断时段是否可选
            staff_booking_is_period_available(gindex, uindex, staff_id, period) {
                if(parseInt(period.is_available || 0) == 0) {
                    return false;
                }
                var current_ymd = this.staff_booking_get_booking_unit(gindex, uindex).ymd || 0;
                for(var gi in this.staff_booking_form) {
                    for(var ui in (this.staff_booking_form[gi] || [])) {
                        if(String(gi) == String(gindex) && String(ui) == String(uindex)) {
                            continue;
                        }
                        var other = this.staff_booking_form[gi][ui];
                        if((other.staff_id || 0) == staff_id && (other.booking_periods_id || 0) == period.id && (other.ymd || 0) == current_ymd && current_ymd > 0) {
                            return false;
                        }
                    }
                }
                return true;
            },

            // 时段标签样式
            staff_booking_get_period_class(gindex, uindex, staff_id, period) {
                var item = this.staff_booking_get_booking_unit(gindex, uindex);
                var unit_key = String(gindex) + '_' + String(uindex);
                if((this.staff_booking_unit_periods_loading[unit_key] || 0) == 1) {
                    return 'bg-grey-disabled cr-grey';
                }
                var available = this.staff_booking_is_period_available(gindex, uindex, staff_id, period);
                if((item.booking_periods_id || 0) == period.id && available) {
                    return 'br-main bg-main-light cr-main cp';
                }
                if(!available) {
                    return 'bg-grey-disabled cr-grey';
                }
                return 'bg-white br-grey cr-base cp';
            },

            // 选择/取消选择日期
            staff_booking_goods_ymd_event(e) {
                if(parseInt(e.currentTarget.dataset.disabled || 0) == 1) {
                    app.globalData.showToast(this.$t('realstore-cart.date_available'));
                    return false;
                }
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var ymd = parseInt(e.currentTarget.dataset.ymd);
                var form = JSON.parse(JSON.stringify(this.staff_booking_form || {}));
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == 0) {
                    app.globalData.showToast(this.$t('realstore-cart.select_staff_first'));
                    return false;
                }
                if((item.ymd || 0) == ymd) {
                    item.ymd = 0;
                    item.booking_periods_id = 0;
                    item.period_text = '';
                    this.staff_booking_clear_unit_periods(gindex, uindex);
                    this.setData({ staff_booking_form: form });
                    return true;
                }
                item.ymd = ymd;
                item.booking_periods_id = 0;
                item.period_text = '';
                this.setData({ staff_booking_form: form });
                this.staff_booking_load_unit_periods(gindex, uindex, item.staff_id, ymd);
            },

            // 获取当前商品可服务的员工列表
            staff_booking_get_unit_staff_list(gindex, uindex) {
                var list = this.staff_booking_staff_list || [];
                var goods = (this.staff_booking_cart_list || [])[gindex];
                if((goods || null) == null) {
                    return list;
                }
                var goods_id = parseInt(goods.goods_id) || 0;
                if(goods_id <= 0) {
                    return list;
                }
                var result = [];
                for(var i in list) {
                    var staff = list[i];
                    var ids = staff.goods_ids || [];
                    if(!ids || ids.length <= 0) {
                        result.push(staff);
                        continue;
                    }
                    var matched = false;
                    for(var j in ids) {
                        if(parseInt(ids[j]) == goods_id) {
                            matched = true;
                            break;
                        }
                    }
                    if(matched) {
                        result.push(staff);
                    }
                }
                return result;
            },

            // 选择/取消选择服务人员
            staff_booking_goods_staff_event(e) {
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var staff = this.staff_booking_get_unit_staff_list(gindex, uindex)[e.currentTarget.dataset.sindex];
                if((staff || null) == null) {
                    return false;
                }
                var form = JSON.parse(JSON.stringify(this.staff_booking_form || {}));
                if((form[gindex] || null) == null) {
                    return false;
                }
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == staff.id) {
                    item.staff_id = 0;
                    item.staff_alias = '';
                    item.staff_avatar = '';
                } else {
                    item.staff_id = staff.id;
                    item.staff_alias = staff.alias;
                    item.staff_avatar = staff.avatar || '';
                }
                item.ymd = 0;
                item.booking_periods_id = 0;
                item.period_text = '';
                this.staff_booking_clear_unit_periods(gindex, uindex);
                this.setData({ staff_booking_form: form });
            },

            // 选择/取消选择时段
            staff_booking_goods_period_event(e) {
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var unit_key = String(gindex) + '_' + String(uindex);
                if((this.staff_booking_unit_periods_loading[unit_key] || 0) == 1) {
                    return false;
                }
                var pindex = e.currentTarget.dataset.pindex;
                var form = JSON.parse(JSON.stringify(this.staff_booking_form || {}));
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == 0) {
                    app.globalData.showToast(this.$t('realstore-cart.select_staff_first'));
                    return false;
                }
                if((item.ymd || 0) == 0) {
                    app.globalData.showToast(this.$t('realstore-cart.select_date_first'));
                    return false;
                }
                var periods = this.staff_booking_get_unit_periods(gindex, uindex);
                var period = periods[pindex];
                if((period || null) == null) {
                    return false;
                }
                if((item.booking_periods_id || 0) == period.id) {
                    item.booking_periods_id = 0;
                    item.period_text = '';
                    this.setData({ staff_booking_form: form });
                    return true;
                }
                if(!this.staff_booking_is_period_available(gindex, uindex, item.staff_id, period)) {
                    app.globalData.showToast(this.$t('realstore-cart.time_slot_occupied'));
                    return false;
                }
                item.booking_periods_id = period.id;
                item.period_text = period.name || '';
                this.setData({ staff_booking_form: form });
            },

            // 校验并提交员工预定
            staff_booking_submit_event() {
                if((this.staff_booking_cart_list || null) == null || this.staff_booking_cart_list.length <= 0) {
                    app.globalData.showToast(this.$t('realstore-cart.cart_empty'));
                    return false;
                }
                var booking_data = [];
                for(var gi in this.staff_booking_cart_list) {
                    var units = this.staff_booking_form[gi] || [];
                    for(var ui in units) {
                        var item = units[ui];
                        if((item.staff_id || 0) == 0 || (item.ymd || 0) == 0 || (item.booking_periods_id || 0) == 0) {
                            app.globalData.showToast(this.$t('realstore-cart.select_staff_date_time_slot_each'));
                            return false;
                        }
                        var periods = this.staff_booking_get_unit_periods(gi, ui);
                        var matched = null;
                        for(var pi in periods) {
                            if(parseInt(periods[pi]['id']) == parseInt(item.booking_periods_id)) {
                                matched = periods[pi];
                                break;
                            }
                        }
                        if(matched == null || !this.staff_booking_is_period_available(gi, ui, item.staff_id, matched)) {
                            app.globalData.showToast(this.$t('realstore-cart.selected_time_slot_occupied_select_again'));
                            return false;
                        }
                        booking_data.push({
                            cart_id: item.cart_id,
                            goods_id: item.goods_id,
                            unit_index: item.unit_index,
                            staff_id: item.staff_id,
                            staff_alias: item.staff_alias || '',
                            booking_periods_id: item.booking_periods_id,
                            period_text: item.period_text || '',
                            ymd: item.ymd,
                        });
                    }
                }

                this.setData({ staff_booking_popup_status: false, staff_booking_submit_loading: false });
                if((app.globalData.data.staff_booking_pending || null) != null) {
                    app.globalData.staff_booking_success(booking_data);
                } else {
                    this.staff_booking_success_event(booking_data);
                }
            },

            // 关闭员工预定弹窗
            staff_booking_close_event() {
                this.setData({ staff_booking_popup_status: false });
            },
        }
    };
</script>
<style scoped>
    .plugins-realstore-cart-mask,
    .plugins-realstore-buy-type-mask {
        left: 0;
        top: 0;
        background: rgb(0, 0, 0, 0.6);
        z-index: 5;
    }
    .plugins-realstore-cart-content,
    .plugins-realstore-buy-type-choice {
        left: 0;
        bottom: 0;
        z-index: 6;
    }

    /**
     * 购物车列表
     */
    .plugins-realstore-cart-content .cart-list {
        max-height: 60vh;
    }
    .plugins-realstore-cart-content .cart-list .item {
        width: 100%;
    }
    .plugins-realstore-cart-content .cart-list .goods-img {
        width: 120rpx;
        height: 120rpx !important;
    }
    .plugins-realstore-cart-content .cart-list .goods-base {
        width: calc(100% - 140rpx);
    }
    .plugins-realstore-cart-content .cart-list .goods-base-content {
        min-height: 60rpx;
    }
    .plugins-realstore-cart-content .cart-list .goods-base .buy-number {
        min-width: 32rpx;
    }

    /**
     * 底部导航
     */
    .plugins-realstore-cart-botton-nav {
        width: calc(100% - 40rpx);
        left: auto;
        bottom: 20rpx;
        z-index: 2;
        margin-left: 20rpx;
        box-shadow: 0rpx 4rpx 8rpx 0px rgba(0, 0, 0, 0.16);
    }
    .plugins-realstore-cart-botton-nav .cart-icon-total .badge-icon {
        top: -20rpx;
        right: -2rpx;
    }
    .plugins-realstore-cart-botton-nav .btn {
        min-width: 160rpx;
        line-height: 70rpx;
        height: 70rpx;
        padding: 0 38rpx;
        border: 0;
        /* #ifdef MP-QQ */
        padding-top: 0;
        padding-bottom: 0;
        /* #endif */
    }

    /**
     * 弹窗下单类型选择
     */
    .plugins-realstore-buy-type-mask {
        z-index: 10;
    }
    .plugins-realstore-buy-type-choice {
        z-index: 11;
        width: calc(100% - 240rpx);
        left: 50%;
        top: 50%;
        height: -webkit-max-content;
        height: max-content;
        transform: translate(-50%, -50%);
    }
    .plugins-realstore-buy-type-choice .item {
        height: 112rpx;
        line-height: 112rpx;
    }
    .plugins-realstore-buy-type-choice .item .scan-item,
    .plugins-realstore-buy-type-choice .item-content-0 {
        background: #E8FFF2;
    }
    .plugins-realstore-buy-type-choice .item-content-1 {
        background: #FFF9DC;
    }
    .plugins-realstore-buy-type-choice .item-content-2 {
        background: #FFE8DC;
    }
    .plugins-realstore-buy-type-choice .item-content-3 {
        background: #EDF9FF;
    }
    .plugins-realstore-buy-type-choice .item-content .left-icon {
        width: 68rpx;
        height: 68rpx;
    }
    .plugins-realstore-buy-type-choice .item:not(:last-child) {
        margin-bottom: 32rpx;
    }
    /* #ifndef H5 */
    .plugins-realstore-buy-type-choice .item-content-0 {
        width: calc(100% - 190rpx);
    }
    .plugins-realstore-buy-type-choice .item .scan-item {
        width: 120rpx;
    }
    /* #endif */

    /**
     * 员工预定弹窗
     */
    .plugins-realstore-staff-booking-popup {
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .plugins-realstore-staff-booking-title {
        line-height: 44rpx;
        padding: 0 48rpx;
    }
    .plugins-realstore-staff-booking-close {
        top: 0;
        right: 24rpx;
        height: 44rpx;
        display: flex;
        align-items: center;
        padding: 0 8rpx;
        z-index: 1;
    }
    .plugins-realstore-staff-booking-scroll-content {
        max-height: 58vh;
        width: 100%;
        box-sizing: border-box;
    }
    .plugins-realstore-staff-booking-scroll-inner {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        padding-bottom: 10rpx;
    }
    .plugins-realstore-staff-booking-init-loading {
        min-height: 40vh;
    }
    .plugins-realstore-staff-booking-date-item {
        min-width: 120rpx;
        height: 88rpx;
        padding: 8rpx 32rpx;
        box-sizing: border-box;
        vertical-align: top;
        display: inline-flex !important;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .plugins-realstore-staff-booking-date-item-no-label {
        justify-content: center;
    }
    .plugins-realstore-staff-booking-date-item-with-label {
        justify-content: space-between;
    }
    .plugins-realstore-staff-booking-date-main-wrap {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 0;
    }
    .plugins-realstore-staff-booking-date-main {
        line-height: 1.4;
    }
    .plugins-realstore-staff-booking-date-day-label {
        flex-shrink: 0;
        height: 24rpx;
        line-height: 24rpx;
        opacity: 0.75;
    }
    .plugins-realstore-staff-booking-date-item.bg-main-light .plugins-realstore-staff-booking-date-day-label {
        opacity: 0.9;
    }
    .plugins-realstore-staff-booking-date-item.br-grey .plugins-realstore-staff-booking-date-day-label {
        color: #999;
    }
    .plugins-realstore-staff-booking-goods-item {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .plugins-realstore-staff-booking-goods-item .plugins-realstore-staff-booking-goods-img {
        width: 120rpx;
        height: 120rpx !important;
        flex-shrink: 0;
    }
    .plugins-realstore-staff-booking-goods-item .plugins-realstore-staff-booking-goods-base {
        min-width: 0;
    }
    .plugins-realstore-staff-booking-goods-item .plugins-realstore-staff-booking-goods-base-content {
        min-height: 60rpx;
    }
    .plugins-realstore-staff-booking-unit-block {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .plugins-realstore-staff-booking-staff-scroll {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .plugins-realstore-staff-booking-staff-scroll-inner {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        padding-right: 4rpx;
    }
    .plugins-realstore-staff-booking-staff-card {
        width: 120rpx;
        flex-shrink: 0;
        vertical-align: top;
        padding: 12rpx 8rpx;
        border-radius: 10rpx;
        box-sizing: border-box;
    }
    .plugins-realstore-staff-booking-staff-avatar-sm {
        width: 72rpx;
        height: 72rpx;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .plugins-realstore-staff-booking-staff-name {
        max-width: 104rpx;
        margin: 0 auto;
        line-height: 1.4;
    }
    .plugins-realstore-staff-booking-period-wrap {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .plugins-realstore-staff-booking-unit-label {
        line-height: 1.4;
    }
    .plugins-realstore-staff-booking-unit-date-scroll {
        width: 100%;
        box-sizing: border-box;
        white-space: nowrap;
    }
    .plugins-realstore-staff-booking-period-tag {
        line-height: 1.6;
        max-width: 100%;
        box-sizing: border-box;
    }
</style>