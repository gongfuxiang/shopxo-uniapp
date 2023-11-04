<template>
    <view>
        <block v-if="common_site_type == 1">
            <component-no-data propStatus="2" propMsg="展示型不允许提交订单"></component-no-data>
        </block>
        <block v-else>
            <view v-if="goods_list.length > 0" class="page-bottom-fixed">
                <!-- 销售+自提 模式选择 -->
                <view v-if="common_site_type == 4" class="buy-header-nav bg-white oh tc">
                    <block v-for="(item, index) in buy_header_nav" :key="index">
                        <view :class="'item fl cp ' + (site_model == item.value ? 'cr-main' : 'cr-base')" :data-value="item.value" @tap="buy_header_nav_event">{{ item.name }}</view>
                    </block>
                </view>

                <view class="padding-horizontal-main padding-top-main bottom-line-exclude">
                    <!-- 地址 -->
                    <view v-if="common_site_type == 0 || common_site_type == 2 || common_site_type == 4" class="padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mb">
                        <view class="address arrow-right cp" @tap="address_event">
                            <view v-if="address != null" class="padding-bottom-main">
                                <view class="address-base">
                                    <text v-if="(address.alias || null) != null" class="address-alias br-main cr-main round margin-right-sm text-size-xs">{{ address.alias }}</text>
                                    <text>{{ address.name }}</text>
                                    <text class="fr">{{ address.tel }}</text>
                                </view>
                                <view class="address-detail oh margin-top-lg">
                                    <image class="icon fl" :src="common_static_url + 'map-icon.png'" mode="widthFix"></image>
                                    <view class="text fr"> {{ address.province_name || '' }}{{ address.city_name || '' }}{{ address.county_name || '' }}{{ address.address || '' }} </view>
                                </view>
                            </view>
                            <view v-if="address == null" class="padding-top-xl padding-bottom-xxxl cr-grey">
                                {{ common_site_type == 0 || (common_site_type == 4 && site_model == 0) ? '请选择收货地址' : '请选择取货地址' }}
                            </view>
                        </view>
                        <view class="address-divider spacing-mb"></view>
                    </view>

                    <!-- 商品数据 -->
                    <view v-for="(group, index) in goods_list" :key="index" class="goods-group-list padding-main border-radius-main bg-white spacing-mb">
                        <!-- 仓库分组 -->
                        <view class="goods-group-hd oh br-b padding-bottom-main">
                            <view class="fl cp" @tap="warehouse_group_event" :data-value="group.url || ''">
                                <image v-if="(group.icon || null) != null" class="goods-group-icon va-m margin-right-xs" :src="group.icon" mode="aspectFit"></image>
                                <text class="goods-group-title va-m">{{ group.name }}</text>
                                <text v-if="(group.alias || null) != null" class="goods-group-alias va-m round margin-left-sm text-size-xs">{{ group.alias }}</text>
                            </view>
                            <!-- #ifndef MP-KUAISHOU -->
                            <view v-if="(group.lng || 0) != 0 && (group.lat || 0) != 0" class="fr">
                                <view class="goods-group-map-submit br round text-size-xs" :data-index="index" @tap="map_event">查看地图</view>
                            </view>
                            <!-- #endif -->
                        </view>
                        <!-- 商品 -->
                        <view class="goods-content margin-bottom-sm">
                            <view v-for="(item, index2) in group.goods_items" :key="index2" class="goods-item padding-vertical-main oh br-b-dashed">
                                <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                                <view class="goods-base">
                                    <view class="goods-title multi-text">{{ item.title }}</view>
                                    <view v-if="item.spec != null" class="margin-top-xs cr-grey">
                                        <block v-for="(spec, si) in item.spec" :key="si">
                                            <text v-if="si > 0">;</text>
                                            <text>{{ spec.value }}</text>
                                        </block>
                                    </view>
                                    <view class="oh pr margin-top-sm">
                                        <text class="fw-b">{{ currency_symbol }}{{ item.price }}</text>
                                        <text v-if="item.original_price > 0" class="original-price margin-left-sm">{{ currency_symbol }}{{ item.original_price }}</text>
                                        <text class="buy-number pa cr-grey">x{{ item.stock }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <!-- 优惠劵 -->
                        <view
                            v-if="(plugins_coupon_data || null) != null && (plugins_coupon_data[index] || null) != null && (plugins_coupon_data[index].coupon_data || null) != null && (plugins_coupon_data[index].coupon_data.coupon_list || null) != null && plugins_coupon_data[index].coupon_data.coupon_list.length > 0"
                            class="buy-data-item buy-data-item-group arrow-right"
                            :data-index="index"
                            @tap="plugins_coupon_open_event"
                        >
                            <text class="cr-base">优惠劵</text>
                            <text class="cr-grey fr cp">{{ (plugins_choice_coupon_value || null) != null && (plugins_choice_coupon_value[group.id] || null) != null ? plugins_choice_coupon_value[group.id] : '请选择优惠券' }}</text>
                        </view>
                        <!-- 门店次卡 -->
                        <view v-if="(plugins_realstore_data || null) != null && (plugins_realstore_data[group.id] || null) != null" class="plugins-realstore-container-view">
                            <block v-for="(item, index2) in plugins_realstore_data[group.id]['data']" :key="index2">
                                <view class="buy-data-item buy-data-item-group arrow-right">
                                    <text class="cr-base va-m">门店次卡</text>
                                    <image class="image circle br va-m margin-left-lg" :src="item.images" mode="aspectFill"></image>
                                    <text class="cr-grey va-m margin-left-xs text-size-xs">x{{ item.stock }}</text>
                                    <view class="right-value single-text dis-inline-block fr tr" :data-index="index2" :data-groupid="group.id" @tap="plugins_realstore_open_event">
                                        <text class="cr-grey">{{ item.tips_msg }}</text>
                                    </view>
                                </view>
                            </block>
                        </view>
                        <!-- 扩展数据展示 -->
                        <view v-if="group.order_base.extension_data.length > 0" class="extension-list radius margin-top-lg">
                            <view v-for="(item, index2) in group.order_base.extension_data" :key="index2" class="item oh padding-main">
                                <text class="cr-base fl">{{ item.name }}</text>
                                <text class="text-tips fr">{{ item.tips }}</text>
                            </view>
                        </view>
                        <!-- 小计 -->
                        <view class="oh tr goods-group-footer padding-top-xl">
                            <text v-if="group.order_base.total_price != group.order_base.actual_price" class="original-price margin-right-sm">{{ currency_symbol }}{{ group.order_base.total_price }}</text>
                            <text class="sales-price">{{ currency_symbol }}{{ group.order_base.actual_price }}</text>
                        </view>
                    </view>

                    <!-- 积分 -->
                    <view v-if="(plugins_points_data || null) != null && ((plugins_points_data.discount_price || 0) > 0 || (plugins_points_data.is_support_goods_exchange || 0) == 1)" class="plugins-points-buy-container padding-main border-radius-main bg-white spacing-mb">
                        <block v-if="(plugins_points_data.discount_price || 0) > 0">
                            <view class="select oh">
                                <text v-if="plugins_points_data.discount_type == 1">使用{{ plugins_points_data.use_integral }}个积分兑换商品</text>
                                <text v-else>使用积分{{ plugins_points_data.use_integral }}个</text>
                                <text class="sales-price">-{{ currency_symbol }}{{ plugins_points_data.discount_price }}</text>
                                <view @tap="points_event" class="fr cp">
                                    <image class="icon" :src="common_static_url + 'select' + (plugins_points_status ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
                                </view>
                            </view>
                            <view class="desc">
                                <text v-if="plugins_points_data.discount_type == 1">你有积分{{ plugins_points_data.user_integral }}个</text>
                                <text v-else>你有积分{{ plugins_points_data.user_integral }}个，可用{{ plugins_points_data.use_integral }}个</text>
                            </view>
                        </block>
                        <block v-else>
                            <view v-if="(plugins_points_data.is_support_goods_exchange || 0) == 1" class="desc tr">
                                <text>你有积分{{ plugins_points_data.user_integral }}个，不足以兑换当前商品</text>
                            </view>
                        </block>
                    </view>

                    <!-- 时间选择 -->
                    <view v-if="(buy_datetime_info || null) != null && (buy_datetime_info.is_select || false) == true" class="buy-data-item bg-white border-radius-main spacing-mb arrow-right">
                        <text class="cr-base">{{ buy_datetime_info.title }}</text>
                        <view class="right-value single-text dis-inline-block fr tr">
                            <component-time-select
                                :propTitle="buy_datetime_info.title"
                                :propPlaceholder="buy_datetime_info.placeholder"
                                :propRangeDay="buy_datetime_info.range_day || 2"
                                :propRangeStartTime="buy_datetime_info.time_start"
                                :propRangeEndTime="buy_datetime_info.time_end"
                                :propDisabled="buy_datetime_info.disabled"
                                :propIsShow="buy_datetime_info.status"
                                @selectEvent="buy_datetime_event"
                            >
                                <text v-if="(buy_datetime_info.value || null) == null" class="cr-grey">{{ buy_datetime_info.placeholder }}</text>
                                <text v-else class="cr-base">{{ buy_datetime_info.value }}</text>
                            </component-time-select>
                        </view>
                    </view>

                    <!-- 留言 -->
                    <view class="content-textarea-container padding-main border-radius-main bg-white spacing-mb">
                        <textarea v-if="user_note_status" @blur="bind_user_note_blur_event" @input="bind_user_note_event" :focus="true" :disable-default-padding="false" :value="user_note_value" maxlength="60" placeholder="留言"></textarea>
                        <view v-else @tap="bind_user_note_tap_event" :class="(user_note_value || null) == null ? 'cr-grey' : ''">{{ user_note_value || '留言' }}</view>
                    </view>

                    <!-- 支付方式 -->
                    <view v-if="total_price > 0 && payment_list.length > 0 && common_order_is_booking != 1" class="payment-list padding-horizontal-main padding-top-main border-radius-main bg-white oh">
                        <view v-for="(item, index) in payment_list" :key="index" class="item tc fl cp margin-bottom-xl">
                            <view :class="'item-content pr radius br ' + (payment_id == item.id ? 'cr-main br-main' : '')" :data-value="item.id" @tap="payment_event">
                                <image v-if="(item.logo || null) != null" class="icon margin-right-sm va-m" :src="item.logo" mode="widthFix"></image>
                                <text>{{ item.name }}</text>
                                <text v-if="(item.tips || null) !== null" class="pay-tips">{{ item.tips }}元</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 导航 -->
                <view class="buy-nav oh wh-auto bg-white br-t bottom-line-exclude flex-row jc-sb align-c">
                    <view class="nav-base single-text padding-left-main flex-1 flex-width">
                        <text>合计：</text>
                        <text class="sales-price">{{ currency_symbol }}{{ total_price }}</text>
                    </view>
                    <view class="nav-submit padding-top-sm padding-bottom-sm padding-horizontal-main">
                        <button class="bg-main cr-white round text-size-md" type="default" @tap="buy_submit_event" :disabled="buy_submit_disabled_status" hover-class="none">提交订单</button>
                    </view>
                </view>
            </view>

            <view v-if="goods_list.length == 0">
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>

            <!-- 优惠劵选择 -->
            <component-popup :propShow="popup_plugins_coupon_status" propPosition="bottom" @onclose="plugins_coupon_close_event">
                <view class="plugins-coupon-popup bg-base">
                    <view class="close oh">
                        <view class="fr" @tap.stop="plugins_coupon_close_event">
                            <iconfont name="icon-huiyuan-guanbi" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view v-if="plugins_coupon_list.length > 0" class="plugins-coupon-container padding-horizontal-main padding-bottom-main oh">
                        <view class="not-use-tips tc">
                            <text class="cp" @tap="plugins_coupon_not_use_event">不使用优惠劵</text>
                        </view>
                        <block v-for="(item, index) in plugins_coupon_list" :key="index">
                            <view :class="'item spacing-mt bg-white border-radius-main ' + ((item.is_active || 0) == 1 ? 'item-disabled' : '')">
                                <view class="v-left fl">
                                    <view class="base single-text" :style="'color:' + item.coupon.bg_color_value + ';'">
                                        <text v-if="item.coupon.type == 0" class="symbol">{{ currency_symbol }}</text>
                                        <text class="price">{{ item.coupon.discount_value }}</text>
                                        <text class="unit">{{ item.coupon.type_unit }}</text>
                                        <text v-if="(item.coupon.desc || null) != null" class="desc cr-grey">{{ item.coupon.desc }}</text>
                                    </view>
                                    <view v-if="(item.coupon.use_limit_type_name || null) != null" class="base-tips cr-base single-text">{{ item.coupon.use_limit_type_name }}</view>
                                    <view class="base-time cr-grey single-text">{{ item.time_start_show_text }}-{{ item.time_end_show_text }}</view>
                                </view>
                                <view :class="'v-right fr ' + ((item.is_active || 0) == 1 ? '' : 'cp')" :style="'background:' + item.coupon.bg_color_value + ';'" :data-index="index" :data-value="item.id" @tap="plugins_coupon_use_event">
                                    <text class="circle"></text>
                                    <text>{{ (item.is_active || 0) == 1 ? '已选' : '选择' }}</text>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </component-popup>

            <!-- 次卡选择 -->
            <component-popup :propShow="popup_plugins_realstore_status" propPosition="bottom" @onclose="plugins_realstore_close_event">
                <view class="bg-base padding-top-lg">
                    <view class="close oh margin-right-lg padding-bottom-sm">
                        <view class="fr" @tap.stop="plugins_realstore_close_event">
                            <iconfont name="icon-huiyuan-guanbi" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="plugins-realstore-container padding-horizontal-main padding-bottom-main oh">
                        <view class="not-use-tips tc">
                            <text class="cp cr-yellow text-size-sm" data-type="0" @tap="plugins_realstore_use_event">不使用次卡</text>
                        </view>
                        <view v-if="(plugins_realstore_data || null) != null && (plugins_realstore_data[popup_plugins_realstore_group_id] || null) != null">
                            <block v-for="(item, index) in plugins_realstore_data[popup_plugins_realstore_group_id]['data'][popup_plugins_realstore_card_index]['user_card']" :key="index">
                                <view :class="'item spacing-mt bg-white border-radius-main ' + ((item.is_active || 0) == 1 ? 'item-disabled' : '')">
                                    <view class="v-left fl">
                                        <view class="base single-text">
                                            <text class="value fw-b text-size-xxl">{{ item.valid_number }}</text>
                                            <text class="unit margin-left-xs">次</text>
                                            <text v-if="(item.name || null) != null" class="cr-base margin-left-lg">{{ item.name }}</text>
                                        </view>
                                        <view v-if="(item.describe || null) != null" class="margin-top-sm cr-grey single-text">{{ item.describe }}</view>
                                        <view class="margin-top-sm cr-grey single-text text-size-xs">{{ item.start_time }} 至 {{ item.end_time }}</view>
                                    </view>
                                    <view v-if="(item.is_active || 0) == 1" class="v-right bg-main fr tc cr-white">
                                        <text>已选</text>
                                    </view>
                                    <view v-else class="v-right bg-main fr tc cr-white cp" :data-index="index" :data-value="item.id" data-type="1" @tap="plugins_realstore_use_event">
                                        <text>选择</text>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>
                </view>
            </component-popup>
            <component-payment ref="payment" :prop-pay-url="pay_url" :prop-qrcode-url="qrcode_url" :prop-to-appoint-page="to_appoint_page" prop-pay-data-key="ids" :prop-payment-list="payment_list" :prop-to-page-back="to_page_back" :prop-to-fail-page="to_fail_page"></component-payment>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../common/js/lib/base64.js';
    import componentPopup from '../../components/popup/popup';
    import componentNoData from '../../components/no-data/no-data';
    import componentTimeSelect from '../../components/time-select/time-select';
    import componentPayment from '@/components/payment/payment';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                buy_submit_disabled_status: false,
                data_list_loding_msg: '',
                params: null,
                payment_list: [],
                goods_list: [],
                address: null,
                address_id: null,
                total_price: 0,
                user_note_value: '',
                user_note_status: false,
                is_first: 1,
                extension_data: [],
                common_site_type: 0,
                extraction_address: [],
                site_model: 0,
                buy_header_nav: [
                    { name: '快递邮寄', value: 0 },
                    { name: '自提点取货', value: 2 },
                ],
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                common_order_is_booking: 0,
                // 下单时间选择
                buy_datetime_info: {},
                // 优惠劵
                plugins_coupon_data: null,
                plugins_coupon_list: [],
                plugins_use_coupon_ids: [],
                plugins_choice_coupon_value: [],
                popup_plugins_coupon_status: false,
                popup_plugins_coupon_index: null,
                // 积分
                plugins_points_data: null,
                plugins_points_status: false,
                // 门店
                plugins_realstore_data: [],
                plugins_choice_realstore_value: {},
                popup_plugins_realstore_status: false,
                popup_plugins_realstore_group_id: 0,
                popup_plugins_realstore_card_index: 0,

                // 支付弹窗参数
                pay_url: '',
                qrcode_url: '',
                // 前往页面携带的参数
                to_page_back: {
                    title: '进入我的订单',
                    page: '/pages/user-order/user-order',
                },
                // 支付失败跳转的页面
                to_fail_page: '/pages/user-order/user-order',
                // 现金--跳转指定页面
                to_appoint_page: '',
            };
        },

        components: {
            componentPopup,
            componentNoData,
            componentTimeSelect,
            componentPayment,
        },
        props: {},

        onLoad(params) {
            // params.data 参数 urlencode(base64_encode(json字符串))
            //  buy_type 下单类型（goods 立即购买、cart 购物车）
            //  goods_data 下单商品urlencode(base64_encode(json字符串[{goods_id,stock,spec}]))
            //  params['data'] = '{"buy_type":"goods","goods_data":"W3siZ29vZHNfaWQiOiI5Iiwic3RvY2siOjEsInNwZWMiOlt7InR5cGUiOiLpopzoibIiLCJ2YWx1ZSI6IueyieiJsiJ9LHsidHlwZSI6IuWwuueggSIsInZhbHVlIjoiTCJ9XX1"}';
            //  ids 购物车主键ids
            if ((params.data || null) != null) {
                this.setData({
                    params: JSON.parse(base64.decode(decodeURIComponent(params.data))),
                    plugins_points_status: app.globalData.get_config('plugins_base.points.data.is_default_use_points', null) == 1,
                    pay_url: app.globalData.get_request_url('pay', 'order'),
                    qrcode_url: app.globalData.get_request_url('paycheck', 'order'),
                });

                // 删除地址缓存
                uni.removeStorageSync(app.globalData.data.cache_buy_user_address_select_key);
            }
        },

        onShow() {
            // 数据加载
            this.init();
            this.setData({
                is_first: 0,
            });

            // 初始化配置
            this.init_config();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        common_order_is_booking: app.globalData.get_config('config.common_order_is_booking'),
                        plugins_points_status: app.globalData.get_config('plugins_base.points.data.is_default_use_points', null) == 1,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                // 订单参数信息是否正确
                if (this.params == null) {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '商品信息有误',
                    });
                    uni.stopPullDownRefresh();
                    return false;
                }

                // 本地缓存地址
                if (this.is_first == 0) {
                    var cache_address = uni.getStorageSync(app.globalData.data.cache_buy_user_address_select_key);
                    if ((cache_address || null) != null) {
                        this.setData({
                            address: cache_address,
                            address_id: cache_address.id,
                        });
                    }
                }

                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });
                this.setData({
                    data_list_loding_status: 1,
                });
                var data = this.params;
                data['address_id'] = this.address_id;
                data['payment_id'] = this.payment_id;
                data['site_model'] = this.site_model;
                uni.request({
                    url: app.globalData.get_request_url('index', 'buy'),
                    method: 'POST',
                    data: this.request_data_ext_params_merge(data),
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var data = res.data.data;

                            // 订单是否已提交、直接进入支付页面
                            if ((data.is_order_submit || 0) == 1) {
                                this.buy_submit_response_handle(data);
                                return false;
                            }

                            // 处理订单初始化数据
                            if (data.goods_list.length == 0) {
                                this.setData({
                                    data_list_loding_status: 0,
                                });
                            } else {
                                // 下单选择时间
                                var data_dt = this.buy_datetime_info || {};
                                var temp_dt = data.buy_datetime_info || {};
                                var datetime = {
                                    // 是否开启时间选择
                                    is_select: (temp_dt.is_select || 0) == 1,
                                    // 是否必选
                                    required: (temp_dt.required || 0) == 1,
                                    // 状态
                                    status: data_dt.status || (temp_dt.status || 0) == 1 || false,
                                    // 默认值
                                    value: data_dt.value || temp_dt.value || '',
                                    // 标题
                                    title: temp_dt.title || '时间',
                                    // 占位文本及标题
                                    placeholder: temp_dt.placeholder || '选择时间',
                                    // 天起始时间
                                    time_start: temp_dt.time_start || '',
                                    // 天结束时间
                                    time_end: temp_dt.time_end || '',
                                    // 可选最大天数
                                    range_day: temp_dt.range_day || 2,
                                    // 禁止选择的时间
                                    disabled: temp_dt.disabled || '',
                                    // 未选择错误提示
                                    error_msg: temp_dt.error_msg || '请选择时间',
                                };

                                // 设置数据
                                this.setData({
                                    goods_list: data.goods_list,
                                    total_price: data.base.actual_price,
                                    extension_data: data.extension_data || [],
                                    data_list_loding_status: 3,
                                    common_site_type: data.common_site_type || 0,
                                    extraction_address: data.base.extraction_address || [],
                                    payment_list: data.payment_list || [],
                                    payment_id: data.default_payment_id || '',
                                    buy_datetime_info: datetime,
                                    plugins_coupon_data: data.plugins_coupon_data || null,
                                    plugins_points_data: data.plugins_points_data || null,
                                    plugins_realstore_data: data.plugins_realstore_data || null,
                                });

                                // 优惠劵选择处理
                                if ((data.plugins_coupon_data || null) != null) {
                                    var plugins_choice_coupon_value = [];
                                    for (var i in data.plugins_coupon_data) {
                                        var cupk = data.plugins_coupon_data[i]['warehouse_id'];

                                        if ((data.plugins_coupon_data[i]['coupon_data']['coupon_choice'] || null) != null) {
                                            plugins_choice_coupon_value[cupk] = data.plugins_coupon_data[i]['coupon_data']['coupon_choice']['coupon']['desc'];
                                        } else {
                                            var coupon_count = (data.plugins_coupon_data[i]['coupon_data']['coupon_list'] || null) != null ? data.plugins_coupon_data[i]['coupon_data'].coupon_list.length : 0;
                                            plugins_choice_coupon_value[cupk] = coupon_count > 0 ? '可选优惠劵' + coupon_count + '张' : '暂无可用优惠劵';
                                        }
                                    }

                                    this.setData({
                                        plugins_choice_coupon_value: plugins_choice_coupon_value,
                                    });
                                }

                                // 地址
                                this.setData({
                                    address: data.base.address || null,
                                    address_id: (data.base.address || null) != null ? data.base.address.id : null,
                                });
                                uni.setStorage({
                                    key: app.globalData.data.cache_buy_user_address_select_key,
                                    data: data.base.address || null,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 请求参数合并
            request_data_ext_params_merge(data) {
                // 优惠券
                var coupon_ids = this.plugins_use_coupon_ids;
                if ((coupon_ids || null) != null && coupon_ids.length > 0) {
                    for (var i in coupon_ids) {
                        data['coupon_id_' + i] = coupon_ids[i];
                    }
                }

                // 门店次卡
                var key = 'realstore_card_value';
                var realstore_value = this.plugins_choice_realstore_value;
                if (Object.keys(realstore_value).length > 0) {
                    data[key] = realstore_value;
                } else {
                    if (data[key] != undefined) {
                        delete data[key];
                    }
                }

                // 积分
                data['is_points'] = this.plugins_points_status === true ? 1 : 0;
                return data;
            },

            // 用户留言输入事件
            bind_user_note_event(e) {
                this.setData({
                    user_note_value: e.detail.value,
                });
            },

            // 用户留言点击
            bind_user_note_tap_event(e) {
                this.setData({
                    user_note_status: true,
                });
            },

            // 用户留言失去焦点
            bind_user_note_blur_event(e) {
                this.setData({
                    user_note_status: false,
                });
            },

            // 提交订单
            buy_submit_event(e) {
                // 表单数据
                var data = this.params;
                data['address_id'] = this.address_id;
                data['payment_id'] = this.payment_id;
                data['user_note'] = this.user_note_value;
                data['site_model'] = this.site_model;

                // 数据验证
                var validation = [];
                if (this.common_site_type == 0 || this.common_site_type == 2 || this.common_site_type == 4) {
                    validation.push({
                        fields: 'address_id',
                        msg: '请选择地址',
                        is_can_zero: 1,
                    });
                }

                if (app.globalData.fields_check(data, validation)) {
                    // 请求参数处理
                    data = this.request_data_ext_params_merge(data);

                    // 是否需要选择时间
                    var datetime = this.buy_datetime_info || {};
                    if ((datetime.is_select || false) == true) {
                        // 是否必选
                        if ((datetime.required || false) == true && (datetime.value || null) == null) {
                            app.globalData.showToast(datetime.error_msg || '请选择时间');
                            return false;
                        }
                        data['buy_datetime_value'] = datetime.value || '';
                    }

                    // 是否需要选择支付方式
                    if (this.total_price > 0 && this.common_order_is_booking != 1) {
                        if ((data.payment_id || null) == null) {
                            app.globalData.showToast('请选择支付方式');
                            return false;
                        }
                    }

                    // 加载loding
                    uni.showLoading({
                        title: '提交中...',
                    });
                    this.setData({
                        buy_submit_disabled_status: true,
                    });
                    uni.request({
                        url: app.globalData.get_request_url('add', 'buy'),
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.buy_submit_response_handle(res.data.data);
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                            this.setData({
                                buy_submit_disabled_status: false,
                            });
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                buy_submit_disabled_status: false,
                            });
                            app.globalData.showToast('服务器请求出错');
                        },
                    });
                }
            },

            // 订单提交响应处理
            buy_submit_response_handle(data) {
                this.setData({
                    to_appoint_page: '/pages/user-order/user-order?order_ids=' + data.order_ids.join(','),
                });
                this.$refs.payment.pay_handle(data.order_ids.join(','), data.payment_id);
            },

            // 支付方式选择
            payment_event(e) {
                this.setData({
                    payment_id: e.currentTarget.dataset.value,
                });
                this.init();
            },

            // 优惠劵弹层开启
            plugins_coupon_open_event(e) {
                var index = e.currentTarget.dataset.index;
                var temp_list = this.plugins_coupon_data[index]['coupon_data']['coupon_list'];
                // 选中处理
                if (temp_list.length > 0) {
                    var temp_ids = this.plugins_use_coupon_ids;
                    for (var i in temp_list) {
                        temp_list[i]['is_active'] = temp_ids.indexOf(temp_list[i]['id']) != -1 ? 1 : 0;
                    }
                }
                this.setData({
                    plugins_coupon_list: temp_list,
                    popup_plugins_coupon_status: true,
                    popup_plugins_coupon_index: index,
                });
            },

            // 优惠劵弹层关闭
            plugins_coupon_close_event(e) {
                this.setData({
                    popup_plugins_coupon_status: false,
                });
            },

            // 优惠劵选择
            plugins_coupon_use_event(e) {
                var index = e.currentTarget.dataset.index;
                var value = e.currentTarget.dataset.value;
                var temp_ids = this.plugins_use_coupon_ids;
                if (this.popup_plugins_coupon_index !== null && temp_ids.indexOf(value) == -1) {
                    var temp_data = this.plugins_coupon_data[this.popup_plugins_coupon_index];
                    var temp_list = this.plugins_coupon_list;

                    // 选中处理
                    for (var i in temp_list) {
                        temp_list[i]['is_active'] = index == i ? 1 : 0;
                    }

                    // 根据仓库id和优惠券id记录
                    temp_ids[temp_data['warehouse_id']] = value;
                    this.setData({
                        plugins_use_coupon_ids: temp_ids,
                        plugins_coupon_list: temp_list,
                        popup_plugins_coupon_status: false,
                    });

                    // 重新获取数据
                    this.init();
                }
            },

            // 不使用优惠劵
            plugins_coupon_not_use_event(e) {
                if (this.popup_plugins_coupon_index !== null) {
                    var temp_data = this.plugins_coupon_data[this.popup_plugins_coupon_index];
                    var temp_list = this.plugins_coupon_list;
                    var temp = this.plugins_use_coupon_ids;
                    for (var i in temp_list) {
                        temp_list[i]['is_active'] = 0;
                    }
                    temp[temp_data['warehouse_id']] = 0;
                    this.setData({
                        plugins_coupon_list: temp_list,
                        plugins_use_coupon_ids: temp,
                        popup_plugins_coupon_status: false,
                    });
                    this.init();
                }
            },

            // 地址选择事件
            address_event(e) {
                // 带上参数
                var json = this.params || null;
                if (json != null) {
                    var params =
                        '&' +
                        Object.keys(json)
                            .map(function (key) {
                                var temp_val = json[key] === undefined || json[key] === null ? '' : json[key];
                                return encodeURIComponent(key) + '=' + encodeURIComponent(temp_val);
                            })
                            .join('&');
                } else {
                    var params = '';
                }

                // 仅自提和快递需要选择地址
                if (this.common_site_type == 0 || (this.common_site_type == 4 && this.site_model == 0)) {
                    uni.navigateTo({
                        url: '/pages/user-address/user-address?is_back=1' + params,
                    });
                } else if (this.common_site_type == 2 || (this.common_site_type == 4 && this.site_model == 2)) {
                    uni.navigateTo({
                        url: '/pages/extraction-address/extraction-address?is_back=1&is_buy=1' + params,
                    });
                } else {
                    app.globalData.showToast('当前模式不允许使用地址');
                }
            },

            // 销售+自提 模式选择事件
            buy_header_nav_event(e) {
                var value = e.currentTarget.dataset.value || 0;
                if (value != this.site_model) {
                    // 数据设置
                    this.setData({
                        address: null,
                        address_id: null,
                        site_model: value,
                    });

                    // 删除地址缓存
                    uni.removeStorageSync(app.globalData.data.cache_buy_user_address_select_key);

                    // 数据初始化
                    this.init();
                }
            },

            // 地图查看
            map_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.goods_list[index] || null;
                if (data == null) {
                    app.globalData.showToast('地址有误');
                    return false;
                }

                // 打开地图
                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            },

            // 积分选择事件
            points_event(e) {
                this.setData({
                    plugins_points_status: !this.plugins_points_status,
                });
                this.init();
            },

            // 仓库事件
            warehouse_group_event(e) {
                app.globalData.url_event(e);
            },

            // 下单选择时间
            buy_datetime_event(e) {
                var temp = this.buy_datetime_info;
                temp['status'] = !temp.status;
                if (e != 'open' && e != 'close') {
                    temp['value'] = ((e || null) != null ? e._date : '') || '';
                }
                this.setData({
                    buy_datetime_info: temp,
                });
            },

            // 打开次卡选择
            plugins_realstore_open_event(e) {
                this.setData({
                    popup_plugins_realstore_status: true,
                    popup_plugins_realstore_group_id: e.currentTarget.dataset.groupid || 0,
                    popup_plugins_realstore_card_index: e.currentTarget.dataset.index || 0,
                });
            },

            // 关闭次卡选择
            plugins_realstore_close_event(e) {
                this.setData({
                    popup_plugins_realstore_status: false,
                });
            },

            // 次卡选择事件
            plugins_realstore_use_event(e) {
                var type = e.currentTarget.dataset.type;
                var group_id = this.popup_plugins_realstore_group_id;
                var card_index = this.popup_plugins_realstore_card_index;
                var id = this.plugins_realstore_data[group_id]['data'][card_index]['id'];
                var temp = this.plugins_choice_realstore_value;
                if (type == 1) {
                    if (temp[group_id] == undefined) {
                        temp[group_id] = {};
                    }
                    temp[group_id][id] = {
                        group_id: group_id,
                        data_id: id,
                        card_id: e.currentTarget.dataset.value,
                    };
                } else {
                    if (temp[group_id] != undefined && temp[group_id][id] != undefined) {
                        delete temp[group_id][id];
                        if (Object.keys(temp[group_id]).length <= 0) {
                            delete temp[group_id];
                        }
                    }
                }
                this.setData({
                    plugins_choice_realstore_value: temp,
                    popup_plugins_realstore_status: false,
                });
                this.init();
            },
        },
    };
</script>
<style>
    @import './buy.css';
</style>
