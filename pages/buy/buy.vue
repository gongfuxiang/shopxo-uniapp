<template>
    <view :class="theme_view">
        <block v-if="buy_site_model_value == 4">
            <component-no-data propStatus="2" :propMsg="$t('buy.buy.l1c8q6')"></component-no-data>
        </block>
        <block v-else>
            <view v-if="goods_list.length > 0" class="page-bottom-fixed">
                <!-- 模式选择，站点类型选择 销售+自提 -->
                <view v-if="buy_site_model_list.length > 1" class="buy-site-model bg-white oh tc" :class="'count-'+buy_site_model_list.length">
                    <block v-for="(item, index) in buy_site_model_list" :key="index">
                        <view :class="'item fl cp ' + (buy_site_model_active_index == index ? 'nav-active-line cr-main' : 'cr-base')" :data-index="index" :data-value="item.value" @tap="buy_site_model_event">{{ item.name }}</view>
                    </block>
                </view>

                <view class="padding-horizontal-main padding-top-main bottom-line-exclude">
                    <!-- 非虚拟类型 则地址 -->
                    <view v-if="buy_site_model_value != 3" class="padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mb">
                        <view class="address arrow-right cp" @tap="address_event">
                            <view v-if="address != null" class="padding-bottom-main">
                                <view class="address-base">
                                    <text v-if="(address.alias || null) != null" class="address-alias br-main cr-main round margin-right-sm text-size-xs">{{ address.alias }}</text>
                                    <text>{{ address.name }}</text>
                                    <text class="fr">{{ address.tel }}</text>
                                </view>
                                <view class="address-detail oh margin-top-lg">
                                    <view class="dis-inline-block va-m">
                                        <iconfont name="icon-map-address" size="34rpx" color="#999"></iconfont>
                                    </view>
                                    <view class="text fr"> {{ address.province_name || '' }}{{ address.city_name || '' }}{{ address.county_name || '' }}{{ address.address || '' }} </view>
                                </view>
                            </view>
                            <view v-else class="padding-top-xl padding-bottom-xxxl cr-grey">
                                {{ (buy_site_model_value == 2) ? $t('buy.buy.wq7gnb') : $t('buy.buy.6rk813') }}
                            </view>
                        </view>
                        <view class="address-divider spacing-mb"></view>
                    </view>

                    <!-- 客户输入的数据 -->
                    <view v-if="((buy_extraction_contact_info || null) != null && (buy_extraction_contact_info.is_write || false) == true) || ((buy_datetime_info || null) != null && (buy_datetime_info.is_select || false) == true)" class="oh padding-horizontal-main bg-white border-radius-main spacing-mb padding-top-main form-container">
                        <!-- 时间选择 -->
                        <view v-if="(buy_datetime_info || null) != null && (buy_datetime_info.is_select || false) == true" class="form-gorup row padding-horizontal-0 padding-top-0">
                            <view class="form-gorup-title margin-right">{{ buy_datetime_info.title }}</view>
                            <view class="form-gorup-value tr">
                                <component-time-select :propTitle="buy_datetime_info.title" :propPlaceholder="buy_datetime_info.placeholder" :propRangeType="buy_datetime_info.range_type" :propRangeDay="buy_datetime_info.range_day || 2" :propRangeStartTime="buy_datetime_info.time_start" :propRangeEndTime="buy_datetime_info.time_end" :propDisabled="buy_datetime_info.disabled" :propIsShow="buy_datetime_info.status" @selectEvent="buy_datetime_event">
                                    <text v-if="(buy_datetime_info.value || null) == null" class="cr-grey va-m">{{ buy_datetime_info.placeholder }}</text>
                                    <text v-else class="cr-base va-m">{{ buy_datetime_info.value }}</text>
                                    <view class="dis-inline-block va-m lh-xs">
                                        <iconfont name="icon-arrow-right" color="#999"></iconfont>
                                    </view>
                                </component-time-select>
                            </view>
                        </view>
                        <!-- 自提客户名称和电话 -->
                        <block v-if="(buy_extraction_contact_info || null) != null && (buy_extraction_contact_info.is_write || false) == true">
                            <view class="form-gorup row padding-horizontal-0 padding-top-0">
                                <view class="form-gorup-title margin-right">{{$t('buy.buy.df3raf')}}</view>
                                <input type="text" name="extraction_contact_name" :value="buy_extraction_contact_info.name" data-value="name" @input="extraction_contact_event" maxlength="30" placeholder-class="cr-grey-9" class="cr-base br-b-f9" :placeholder="$t('user-address-save.user-address-save.65507o')" />
                            </view>
                            <view class="form-gorup row padding-horizontal-0 padding-top-0">
                                <view class="form-gorup-title margin-right">{{$t('buy.buy.hjwerf')}}</view>
                                <input type="text" name="extraction_contact_tel" :value="buy_extraction_contact_info.tel" data-value="tel" @input="extraction_contact_event" maxlength="30" placeholder-class="cr-grey-9" class="cr-base br-b-f9" :placeholder="$t('user-address-save.user-address-save.65507o')" />
                            </view>
                        </block>
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
                                <view class="goods-group-map-submit br round text-size-xs" :data-index="index" @tap="map_event">{{ $t('buy.buy.o7722q') }}</view>
                            </view>
                            <!-- #endif -->
                        </view>
                        <!-- 商品 -->
                        <view class="goods-content margin-bottom-sm">
                            <view v-for="(item, index2) in group.goods_items" :key="index2" class="goods-item padding-vertical-main oh br-b-dashed">
                                <!-- 商品主体 -->
                                <view class="goods-item-content">
                                    <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                                    <view class="goods-base">
                                        <view class="goods-title multi-text">{{ item.title }}</view>
                                        <view v-if="item.spec != null" class="margin-top-xs cr-grey">
                                            <block v-for="(spec, si) in item.spec" :key="si">
                                                <text v-if="si > 0">;</text>
                                                <text>{{ spec.value }}</text>
                                            </block>
                                        </view>
                                        <view class="oh pr margin-top-xs">
                                            <block v-if="item.show_field_price_status == 1">
                                                <text class="fw-b va-m">{{ item.show_price_symbol }}{{ item.price }}</text>
                                                <text class="cr-grey text-size-xs va-m">{{ item.show_price_unit }}</text>
                                            </block>
                                            <block v-if="item.show_field_original_price_status == 1">
                                                <text v-if="item.original_price > 0" class="original-price margin-left-sm">{{ item.show_original_price_symbol }}{{ item.original_price }}{{ item.show_original_price_unit }}</text>
                                            </block>
                                            <text class="buy-number pa cr-grey">x{{ item.stock }}</text>
                                        </view>
                                    </view>
                                </view>
                                <!-- 订单商品表单 -->
                                <view v-if="(item.plugins_ordergoodsform_data || null) != null && item.plugins_ordergoodsform_data.length > 0" class="goods-item-ordergoodsform">
                                    <component-buy-ordergoodsform ref="buy_ordergoodsform" :propData="item.plugins_ordergoodsform_data" :propGoodsID="item.goods_id"></component-buy-ordergoodsform>
                                </view>
                            </view>
                        </view>
                        <!-- 运费 -->
                        <view v-if="(group.plugins_freightfee_data || null) != null && (group.plugins_freightfee_data.default || null) != null && (group.plugins_freightfee_data.fee_list || null) != null && group.plugins_freightfee_data.fee_list.length > 0" class="buy-data-item oh">
                            <text class="cr-base">{{ $t('buy.buy.876tgh') }}</text>
                            <view class="right-value fr cp tr">
                                <view class="right-value-content single-text dis-inline-block va-m">
                                    <picker :data-wid="group.id" @change="plugins_freightfee_change_event" :value="group.plugins_freightfee_data.default.key" :range="group.plugins_freightfee_data.fee_list" range-key="fee_name">
                                        <view class="cr-grey">{{ group.plugins_freightfee_data.default.fee_name }}</view>
                                    </picker>
                                </view>
                                <view class="dis-inline-block va-m lh-xs">
                                    <iconfont name="icon-arrow-right" color="#999"></iconfont>
                                </view>
                            </view>
                        </view>
                        <!-- 优惠劵 -->
                        <view v-if="(plugins_coupon_data || null) != null && (plugins_coupon_data[index] || null) != null && (plugins_coupon_data[index].coupon_data || null) != null && (plugins_coupon_data[index].coupon_data.coupon_list || null) != null && plugins_coupon_data[index].coupon_data.coupon_list.length > 0" class="buy-data-item oh" :data-index="index" @tap="plugins_coupon_open_event">
                            <text class="cr-base">{{ $t('buy.buy.45ovhs') }}</text>
                            <view class="right-value fr cp tr">
                                <text class="right-value-content single-text cr-grey va-m">{{ (plugins_choice_coupon_value || null) != null && (plugins_choice_coupon_value[group.id] || null) != null ? plugins_choice_coupon_value[group.id] : $t('buy.buy.553mxo') }}</text>
                                <view class="dis-inline-block va-m lh-xs">
                                    <iconfont name="icon-arrow-right" color="#999"></iconfont>
                                </view>
                            </view>
                        </view>
                        <!-- 门店次卡 -->
                        <view v-if="(plugins_realstore_data || null) != null && (plugins_realstore_data.user_card || null) != null && (plugins_realstore_data['user_card'][group.id] || null) != null" class="plugins-realstore-container-view">
                            <block v-for="(item, index2) in plugins_realstore_data['user_card'][group.id]['data']" :key="index2">
                                <view class="buy-data-item oh oh wh-auto">
                                    <text class="cr-base va-m">{{ $t('buy.buy.58rs1a') }}</text>
                                    <image class="image circle br va-m margin-left-xs" :src="item.images" mode="aspectFill"></image>
                                    <text class="cr-grey va-m margin-left-xss text-size-xs">x{{ item.stock }}</text>
                                    <view class="right-value fr cp tr" :data-index="index2" :data-groupid="group.id" @tap="plugins_realstore_open_event">
                                        <text class="right-value-content single-text cr-grey va-m">{{ item.tips_msg }}</text>
                                        <view class="dis-inline-block va-m lh-xs">
                                            <iconfont name="icon-arrow-right" color="#999"></iconfont>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                        <!-- 扩展数据展示 -->
                        <view v-if="group.order_base.extension_data.length > 0" class="extension-list radius margin-top-lg">
                            <view v-for="(item, index2) in group.order_base.extension_data" :key="index2">
                                <view class="item oh padding-vertical-xs padding-main">
                                    <text class="cr-base fl">{{ item.name }}</text>
                                    <text class="text-tips fr">{{ item.tips }}</text>
                                </view>
                            </view>
                        </view>
                        <!-- 小计 -->
                        <view class="oh tr wh-auto goods-group-footer padding-top-xl">
                            <text class="sales-price">{{ currency_symbol }}{{ group.order_base.actual_price }}</text>
                        </view>
                    </view>

                    <!-- 积分 -->
                    <view v-if="(plugins_points_data || null) != null && ((plugins_points_data.discount_price || 0) > 0 || (plugins_points_data.is_support_goods_exchange || 0) == 1)" class="plugins-points-buy-container padding-main border-radius-main bg-white spacing-mb">
                        <block v-if="(plugins_points_data.discount_price || 0) > 0">
                            <view class="select oh">
                                <block v-if="plugins_points_data.discount_type == 1">
                                    <text v-if="(plugins_points_data.use_msg_tips || null) != null" class="va-m">{{ plugins_points_data.use_msg_tips }}</text>
                                </block>
                                <view v-else class="dis-inline-block">
                                    <text class="va-m">{{ $t('buy.buy.33fugm') }}</text>
                                    <input type="number" class="br radius dis-inline-block va-m tc text-size-xs padding-horizontal-sm margin-left-xs plugins-points-use-value" :value="actual_use_integral" @input="points_use_value_event" @confirm="points_use_value_confirm_event" :placeholder="$t('buy.buy.80y7sv')" />
                                    <button type="default" size="mini" class="bg-grey-e cr-gray cr-base text-size-xs radius va-m margin-right-xs plugins-points-use-submit" @tap="points_use_value_confirm_event">{{ $t('common.confirm') }}</button>
                                    <text class="va-m">{{ $t('buy.buy.4di4i2') }}</text>
                                </view>
                                <block v-if="plugins_points_data.is_pure_exchange_modal == undefined || plugins_points_data.is_pure_exchange_modal != 1 || plugins_points_data.discount_type != 1">
                                    <text class="sales-price va-m">-{{ currency_symbol }}{{ plugins_points_data.discount_price }}</text>
                                    <view class="fr cp" @tap="points_event">
                                        <iconfont :name="'icon-zhifu-' + (plugins_points_status ? 'yixuan' : 'weixuan')" size="40rpx" :color="plugins_points_status ? theme_color : '#999'"></iconfont>
                                    </view>
                                </block>
                            </view>
                            <view v-if="(plugins_points_data.usable_msg_tips || null) != null" class="desc margin-top-xs">{{ plugins_points_data.usable_msg_tips }}</view>
                        </block>
                        <block v-else>
                            <view v-if="(plugins_points_data.not_msg_tips || null) != null" class="desc tr">{{ plugins_points_data.not_msg_tips }}</view>
                        </block>
                    </view>

                    <!-- 留言 -->
                    <view class="content-textarea-container padding-main border-radius-main bg-white spacing-mb">
                        <view class="content">
                            <textarea v-if="user_note_status" class="textarea" @blur="bind_user_note_blur_event" @input="bind_user_note_event" :focus="true" :disable-default-padding="false" :value="user_note_value" maxlength="230" :placeholder="$t('buy.buy.2rhko1')"></textarea>
                            <view v-else @tap="bind_user_note_tap_event" :class="'textarea-view ' + ((user_note_value || null) == null ? 'cr-grey' : '')">{{ user_note_value || $t('buy.buy.2rhko1') }}</view>
                        </view>
                        <view v-if="(plugins_intellectstools_data || null) != null && (plugins_intellectstools_data.note_fast_data || null) != null" class="plugins-intellectstools-data-note-fast margin-top-sm">
                            <text class="cr-grey margin-right-sm va-m text-size-xs">{{ $t('buy.buy.q7jq76') }}</text>
                            <view class="note-fast-data-list scroll-view-horizontal dis-inline-block va-m">
                                <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true">
                                    <block v-for="(item, index) in plugins_intellectstools_data.note_fast_data" :key="index">
                                        <view :class="'dis-inline-block text-size-xs round padding-top-xs padding-bottom-xs padding-left padding-right br-grey-f5 cr-base cp ' + (index > 0 ? 'margin-left-sm' : '')" :data-value="item" @tap="note_fast_event">{{ item }}</view>
                                    </block>
                                </scroll-view>
                            </view>
                        </view>
                    </view>
                    
                    <!-- 支付选择 -->
                    <view v-if="total_price > 0 && ((common_order_is_booking != 1 && payment_list.length > 0) || plugins_coin_is_valid)" class="payment-list border-radius-main bg-white oh padding-main spacing-mb">
                        <!-- 虚拟币支付 -->
                        <block v-if="plugins_coin_is_valid">
                            <block v-for="(item, index) in plugins_coin_data.accounts_list" :key="index">
                                <view class="item flex-row jc-sb align-c" :data-value="item.id" @tap="plugins_coin_payment_event">
                                    <view class="item-content pr flex-row align-c">
                                        <image v-if="(item.platform_icon || null) != null" class="icon margin-right-sm va-m radius" :src="item.platform_icon" mode="widthFix"></image>
                                        <view class="flex-col">
                                            <view class="cr-base">{{ item.platform_name }}</view>
                                            <view class="flex-row align-c margin-top-xs">
                                                <view class="fw-b">{{ item.default_symbol }} {{ item.default_coin }}</view>
                                                <view class="margin-left-lg text-size-xs cr-999">{{ item.platform_symbol }} {{ item.normal_coin }}</view>
                                            </view>
                                        </view>
                                    </view>
                                    <view>
                                        <iconfont :name="plugins_coin_payment_id == item.id ? 'icon-zhifu-yixuan cr-red' : 'icon-zhifu-weixuan'" size="40rpx"></iconfont>
                                    </view>
                                </view>
                            </block>
                        </block>
                        <!-- 支付方式 -->
                        <view v-if="common_order_is_booking != 1 && payment_list.length > 0" :class="(plugins_coin_is_valid ? 'br-t-f9' : '')">
                            <view v-for="(item, index) in payment_list" :key="index">
                                <view class="item flex-row jc-sb align-c" :data-value="item.id" :data-index="index" @tap="payment_event">
                                    <view class="item-content pr flex-1 flex-width">
                                        <image v-if="(item.logo || null) != null" class="icon margin-right-sm va-m radius" :src="item.logo" mode="widthFix"></image>
                                        <text class="va-m">{{ item.name }}</text>
                                        <text v-if="(item.tips || null) !== null" class="pay-tips">{{ item.tips }}</text>
                                    </view>
                                    <view>
                                        <iconfont :name="payment_id == item.id ? 'icon-zhifu-yixuan cr-red' : 'icon-zhifu-weixuan'" size="40rpx"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 底部说明 - 智能工具箱插件 -->
                    <view v-if="(plugins_intellectstools_data || null) != null && (plugins_intellectstools_data.bottom_desc || null) != null && plugins_intellectstools_data.bottom_desc.length > 0" class="border-radius-main padding-main bg-white oh cr-orange spacing-mb">
                        <view v-for="(item, index) in plugins_intellectstools_data.bottom_desc" :key="index">
                            <view :class="index > 0 ? 'margin-top' : ''">{{item}}</view>
                        </view>
                    </view>
                </view>

                <!-- 导航 -->
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view class="item oh round flex-row jc-sb align-c br-top-shadow bg-white padding-vertical-sm">
                            <view class="nav-base single-text padding-left-main fl">
                                <text>{{ $t('buy.buy.wx78ju') }}</text>
                                <text class="sales-price">{{ currency_symbol }}{{ total_price }}</text>
                            </view>
                            <view class="nav-submit padding-horizontal-main fr">
                                <button class="btn bg-main cr-white round text-size-md" type="default" @tap="buy_submit_event" :disabled="buy_submit_disabled_status" hover-class="none">{{ $t('buy.buy.4884hk') }}</button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>

            <!-- 优惠劵选择 -->
            <component-popup :propShow="popup_plugins_coupon_status" propPosition="bottom" @onclose="plugins_coupon_close_event">
                <view class="plugins-coupon-popup bg-base">
                    <view class="close oh">
                        <view class="fr" @tap.stop="plugins_coupon_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view v-if="plugins_coupon_list.length > 0" class="plugins-coupon-container padding-horizontal-main padding-bottom-main oh">
                        <view class="not-use-tips tc">
                            <text class="cp" @tap="plugins_coupon_not_use_event">{{ $t('buy.buy.2c3i88') }}</text>
                        </view>
                        <block v-for="(item, index) in plugins_coupon_list" :key="index">
                            <view :class="'item spacing-mt bg-white border-radius-main ' + ((item.is_active || 0) == 1 ? 'item-disabled' : '')">
                                <view class="v-left fl">
                                    <view class="base single-text">
                                        <text v-if="item.coupon.type == 0" class="symbol cr-price">{{ currency_symbol }}</text>
                                        <text class="price cr-price">{{ item.coupon.discount_value }}</text>
                                        <text class="unit">{{ item.coupon.type_unit }}</text>
                                        <text v-if="(item.coupon.desc || null) != null" class="desc cr-grey">{{ item.coupon.desc }}</text>
                                    </view>
                                    <view v-if="(item.coupon.use_limit_type_name || null) != null" class="base-tips cr-base single-text">{{ item.coupon.use_limit_type_name }}</view>
                                    <view class="base-time cr-grey single-text">{{ item.time_start_show_text }}-{{ item.time_end_show_text }}</view>
                                </view>
                                <view :class="'v-right bg-main fr ' + ((item.is_active || 0) == 1 ? '' : 'cp')" :style="'background:' + item.coupon.bg_color_value + ';'" :data-index="index" :data-value="item.id" @tap="plugins_coupon_use_event">
                                    <text class="circle"></text>
                                    <text>{{ (item.is_active || 0) == 1 ? $t('buy.buy.g2vt78') : $t('buy.buy.inyxpx') }}</text>
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
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="plugins-realstore-container padding-horizontal-main padding-bottom-main oh">
                        <view class="not-use-tips tc">
                            <text class="cp cr-yellow text-size-sm" data-type="0" @tap="plugins_realstore_use_event">{{ $t('buy.buy.8vqfp3') }}</text>
                        </view>
                        <view v-if="(plugins_realstore_data || null) != null && (plugins_realstore_data.user_card || null) != null && (plugins_realstore_data['user_card'][popup_plugins_realstore_group_id] || null) != null">
                            <block v-for="(item, index) in plugins_realstore_data['user_card'][popup_plugins_realstore_group_id]['data'][popup_plugins_realstore_card_index]['user_card']" :key="index">
                                <view :class="'item spacing-mt bg-white border-radius-main ' + ((item.is_active || 0) == 1 ? 'item-disabled' : '')">
                                    <view class="v-left fl">
                                        <view class="base single-text">
                                            <text class="value fw-b text-size-xxl">{{ item.valid_number }}</text>
                                            <text class="unit margin-left-xs">{{ $t('buy.buy.0pgsrm') }}</text>
                                            <text v-if="(item.name || null) != null" class="cr-base margin-left-lg">{{ item.name }}</text>
                                        </view>
                                        <view v-if="(item.describe || null) != null" class="margin-top-sm cr-grey single-text">{{ item.describe }}</view>
                                        <view class="margin-top-sm cr-grey single-text text-size-xs">{{ item.start_time }}{{ $t('buy.buy.70u2vy') }}{{ item.end_time }}</view>
                                    </view>
                                    <view v-if="(item.is_active || 0) == 1" class="v-right bg-main fr tc cr-white">
                                        <text>{{ $t('buy.buy.g2vt78') }}</text>
                                    </view>
                                    <view v-else class="v-right bg-main fr tc cr-white cp" :data-index="index" :data-value="item.id" data-type="1" @tap="plugins_realstore_use_event">
                                        <text>{{ $t('buy.buy.inyxpx') }}</text>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>
                </view>
            </component-popup>
            <component-payment ref="payment" :propIsRedirectTo="true" :propPayUrl="pay_url" :propQrcodeUrl="qrcode_url" :propToAppointPage="to_appoint_page" propPayDataKey="ids" :propPaymentList="payment_list" :propToPageBack="to_page_back" :propToFailPage="to_fail_page"></component-payment>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    import componentTimeSelect from '@/pages/common/components/time-select/time-select';
    import componentPayment from '@/components/payment/payment';
    import componentBuyOrdergoodsform from '@/pages/plugins/ordergoodsform/components/buy-ordergoodsform/buy-ordergoodsform';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                buy_submit_disabled_status: false,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                params: null,
                payment_list: [],
                payment_index: -1,
                payment_id: 0,
                goods_list: [],
                address: null,
                address_id: null,
                total_price: 0,
                user_note_value: '',
                user_note_status: false,
                is_first: 1,
                common_site_type: 0,
                extraction_address: [],
                // 是否门店模式
                is_realstore_model: false,
                // 站点类型模式
                buy_site_model_active_index: 0,
                buy_site_model_value: -1,
                buy_site_model_list: [],
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
                common_order_is_booking: 0,
                // 下单时间选择
                buy_datetime_info: {},
                // 自提客户名称和电话
                buy_extraction_contact_info: {},
                // 订单是否已进入支付
                is_order_submit_payment: 0,
                // 优惠劵
                plugins_coupon_data: null,
                plugins_coupon_list: [],
                plugins_use_coupon_ids: [],
                plugins_choice_coupon_value: [],
                popup_plugins_coupon_status: false,
                popup_plugins_coupon_index: null,
                // 积分
                plugins_points_data: null,
                actual_use_integral: 0,
                plugins_points_status: false,
                // 门店
                plugins_realstore_data: null,
                plugins_choice_realstore_value: {},
                popup_plugins_realstore_status: false,
                popup_plugins_realstore_group_id: 0,
                popup_plugins_realstore_card_index: 0,
                // 智能工具箱
                plugins_intellectstools_data: null,
                // 运费
                plugins_freightfee_choice_data: {},
                // 虚拟币
                plugins_coin_data: null,
                plugins_coin_is_valid: false,
                plugins_coin_payment_id: 0,

                // 支付弹窗参数
                pay_url: '',
                qrcode_url: '',
                // 前往支付页面携带的参数
                to_page_back: {
                    title: this.$t('buy.buy.718tux'),
                    page: '/pages/user-order/user-order',
                },
                // 支付失败跳转的页面
                to_fail_page: '/pages/user-order/user-order',
                // 现金--跳转指定页面
                to_appoint_page: '/pages/user-order/user-order',
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentNoData,
            componentTimeSelect,
            componentPayment,
            componentBuyOrdergoodsform,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 下单参数处理
            // params.data 参数 urlencode(base64_encode(json字符串))
            // buy_type 下单类型（goods 立即购买、cart 购物车）
            // goods_data 下单商品urlencode(base64_encode(json字符串[{goods_id,stock,spec}]))
            // params['data'] = '{"buy_type":"goods","goods_data":"W3siZ29vZHNfaWQiOiI5Iiwic3RvY2siOjEsInNwZWMiOlt7InR5cGUiOiLpopzoibIiLCJ2YWx1ZSI6IueyieiJsiJ9LHsidHlwZSI6IuWwuueggSIsInZhbHVlIjoiTCJ9XX1"}';
            // ids 购物车主键ids
            if ((params.data || null) != null) {
                params = JSON.parse(base64.decode(decodeURIComponent(params.data)));
            }

            // 设置参数
            this.setData({
                params: params,
                is_realstore_model: (params.realstore_id || null) != null,
                plugins_points_status: app.globalData.get_config('plugins_base.points.data.is_default_use_points', null) == 1,
                pay_url: app.globalData.get_request_url('pay', 'order'),
                qrcode_url: app.globalData.get_request_url('paycheck', 'order'),
            });

            // 删除地址缓存
            uni.removeStorageSync(app.globalData.data.cache_buy_user_address_select_key);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

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
                // 订单是否已经提交进入支付
                if(this.is_order_submit_payment == 1) {
                    uni.stopPullDownRefresh();
                    return false;
                }
                // 订单参数信息是否正确
                if (this.params == null) {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('buy.buy.p7e91u'),
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

                // 是否门店订单
                if (this.is_realstore_model) {
                    var realstore_order_page = '/pages/plugins/realstore/orderallot-list/orderallot-list';
                    this.setData({
                        to_page_back: {
                            title: this.$t('buy.buy.4is2ak'),
                            page: realstore_order_page,
                        },
                        // 支付失败跳转的页面
                        to_fail_page: realstore_order_page,
                        // 现金--跳转指定页面
                        to_appoint_page: realstore_order_page,
                    });
                }

                // 加载loding
                if(this.is_first == 0) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                this.setData({
                    data_list_loding_status: 1,
                });
                var data = this.params;
                data['address_id'] = this.address_id;
                data['payment_id'] = this.payment_id;
                data['site_model'] = this.buy_site_model_value;
                uni.request({
                    url: app.globalData.get_request_url('index', 'buy'),
                    method: 'POST',
                    data: this.request_data_ext_params_merge(data),
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if(this.is_first == 0) {
                            uni.hideLoading();
                        }
                        if (res.data.code == 0) {
                            var data = res.data.data;

                            // 基础数据
                            this.setData({
                                currency_symbol: data.currency_symbol || app.globalData.currency_symbol(),
                                payment_list: data.payment_list || [],
                            });

                            // 首次
                            if(this.is_first == 1) {
                                // 赋值默认支付方式
                                var default_payment_id = parseInt(data.default_payment_id || 0);
                                if(this.payment_list.length > 0 && default_payment_id > 0) {
                                    var temp_payment_ids = this.payment_list.map(function(item){return item.id;});
                                    if(temp_payment_ids.indexOf(default_payment_id) != -1) {
                                        this.setData({
                                            payment_id: default_payment_id
                                        });
                                    }
                                }
                            }

                            // 订单是否已提交、直接进入支付页面
                            if ((data.is_order_submit || 0) == 1) {
                                this.buy_submit_response_handle(res.data);
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
                                    is_select: parseInt(temp_dt.is_select || 0) == 1,
                                    // 是否必选
                                    required: parseInt(temp_dt.required || 0) == 1,
                                    // 状态
                                    status: data_dt.status || parseInt(temp_dt.status || 0) == 1 || false,
                                    // 默认值
                                    value: data_dt.value || temp_dt.value || '',
                                    // 标题
                                    title: temp_dt.title || this.$t('buy.buy.s7rr5s'),
                                    // 占位文本及标题
                                    placeholder: temp_dt.placeholder || this.$t('buy.buy.1fi842'),
                                    // 天起始时间
                                    time_start: temp_dt.time_start || '',
                                    // 天结束时间
                                    time_end: temp_dt.time_end || '',
                                    // 随机类型（区间还是固定时间, 0或1）
                                    range_type: (temp_dt.range_type == undefined || parseInt(temp_dt.range_type || 0) == 1),
                                    // 可选最大天数
                                    range_day: parseInt(temp_dt.range_day || 2),
                                    // 禁止选择的时间
                                    disabled: temp_dt.disabled || '',
                                    // 未选择错误提示
                                    error_msg: temp_dt.error_msg || this.$t('buy.buy.q8u066'),
                                };
                                
                                // 自提客户信息
                                var data_ct = this.buy_extraction_contact_info || {};
                                var temp_ct = data.buy_extraction_contact_info || {};
                                var extraction_contact = {
                                    is_write: parseInt(temp_ct.is_write || 0) == 1,
                                    // 状态
                                    status: data_ct.status || (temp_ct.status || 0) == 1 || false,
                                    // 默认值、姓名和电话
                                    name: data_ct.name || temp_ct.name || '',
                                    tel: data_ct.tel || temp_ct.tel || '',
                                    // 是否必选
                                    required: parseInt(temp_ct.required || 0) == 1,
                                    // 未选择错误提示
                                    error_msg: temp_ct.error_msg || this.$t('buy.buy.8fghje'),
                                };

                                // 商品数据处理
                                var goods_list = data.goods_list;
                                for (var i in goods_list) {
                                    // 扩展数据处理，
                                    var temp_extension_data = [];
                                    if ((goods_list[i]['order_base'] || null) != null && (goods_list[i]['order_base']['extension_data'] || null) != null) {
                                        var temp_ext = goods_list[i]['order_base']['extension_data'];
                                        for (var t in temp_ext) {
                                            if (temp_ext[t]['is_buy_show'] == undefined || temp_ext[t]['is_buy_show'] == 1) {
                                                temp_extension_data.push(temp_ext[t]);
                                            }
                                        }
                                    }
                                    goods_list[i]['order_base']['extension_data'] = temp_extension_data;
                                }

                                // 设置数据
                                var plugins_coin_data = data.plugins_coin_data || null;
                                this.setData({
                                    goods_list: goods_list,
                                    total_price: data.base.actual_price,
                                    data_list_loding_status: 3,
                                    common_site_type: data.common_site_type || 0,
                                    buy_site_model_value: data.base.site_model || 0,
                                    extraction_address: data.base.extraction_address || [],
                                    buy_site_model_list: data.buy_site_model_list || [],
                                    buy_datetime_info: datetime,
                                    buy_extraction_contact_info: extraction_contact,
                                    plugins_coupon_data: data.plugins_coupon_data || null,
                                    plugins_points_data: data.plugins_points_data || null,
                                    plugins_realstore_data: data.plugins_realstore_data || null,
                                    plugins_intellectstools_data: data.plugins_intellectstools_data || null,
                                    plugins_coin_data: plugins_coin_data,
                                    plugins_coin_is_valid:  plugins_coin_data != null && (plugins_coin_data.accounts_list || null) != null &&  plugins_coin_data.accounts_list.length > 0,
                                });

                                // 非门店模式则赋值指定的类型模式
                                if(this.is_first == 1) {
                                    if (this.buy_site_model_list.length > 0) {
                                        for(var i in this.buy_site_model_list) {
                                            if(this.buy_site_model_list[i]['value'] == this.buy_site_model_value) {
                                                this.setData({
                                                    buy_site_model_active_index: i
                                                });
                                            }
                                        }
                                    }
                                }

                                // 可使用积分数量
                                if (this.plugins_points_data != null && this.is_first == 1) {
                                    this.setData({
                                        actual_use_integral: this.plugins_points_data.use_integral || '',
                                    });
                                }

                                // 优惠劵选择处理
                                if ((data.plugins_coupon_data || null) != null) {
                                    var plugins_choice_coupon_value = [];
                                    for (var i in data.plugins_coupon_data) {
                                        var cupk = data.plugins_coupon_data[i]['warehouse_id'];

                                        if ((data.plugins_coupon_data[i]['coupon_data']['coupon_choice'] || null) != null) {
                                            plugins_choice_coupon_value[cupk] = data.plugins_coupon_data[i]['coupon_data']['coupon_choice']['coupon']['desc'];
                                        } else {
                                            var coupon_count = (data.plugins_coupon_data[i]['coupon_data']['coupon_list'] || null) != null ? data.plugins_coupon_data[i]['coupon_data'].coupon_list.length : 0;
                                            plugins_choice_coupon_value[cupk] = coupon_count > 0 ? this.$t('buy.buy.hw4l5m') + coupon_count + this.$t('buy.buy.5iuqow') : this.$t('buy.buy.4rb08b');
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

                                // 非首次状态
                                this.setData({
                                    is_first: 0,
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
                        if(this.is_first == 0) {
                            uni.hideLoading();
                        }
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 请求参数合并
            request_data_ext_params_merge(data) {
                // 运费
                var fee = this.plugins_freightfee_choice_data || null;
                if (fee != null) {
                    for (var i in fee) {
                        data['freightfee_id_' + i] = fee[i];
                    }
                }

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
                if (data['is_points'] == 1) {
                    data['actual_use_integral'] = this.actual_use_integral;
                }

                // 虚拟币
                data['plugins_coin_payment_id'] = this.plugins_coin_payment_id;

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

            // 留言快捷选择
            note_fast_event(e) {
                var value = e.currentTarget.dataset.value;
                var user_note = this.user_note_value || '';
                if (user_note != '') {
                    // 已存在则不追加
                    if (user_note.indexOf(value) != -1) {
                        return false;
                    }
                    // 有数据组则增加分割符号
                    user_note += ',';
                }
                user_note += value;

                // 大于限定长度则不增加
                if (user_note.length <= 230) {
                    this.setData({
                        user_note_value: user_note,
                    });
                }
            },

            // 提交订单
            buy_submit_event(e) {
                // 表单数据
                var data = this.params;
                data['address_id'] = this.address_id;
                data['payment_id'] = this.payment_id;
                data['payment_type'] = this.payment_type;
                data['user_note'] = this.user_note_value;
                data['site_model'] = this.buy_site_model_value;

                // 数据验证
                var validation = [];
                if (this.buy_site_model_value <= 2) {
                    validation.push({
                        fields: 'address_id',
                        msg: this.$t('buy.buy.3740ur'),
                        is_can_zero: 1,
                    });
                    if (!app.globalData.fields_check(data, validation)) {
                        return false;
                    }
                }

                // 订单商品表单插件数据验证处理
                var buy_ordergoodsform = this.$refs.buy_ordergoodsform || [];
                if (buy_ordergoodsform.length > 0) {
                    for (var i in buy_ordergoodsform) {
                        if (!buy_ordergoodsform[i].data_check()) {
                            return false;
                        }
                    }
                }

                // 请求参数处理
                data = this.request_data_ext_params_merge(data);

                // 是否需要选择时间
                var datetime = this.buy_datetime_info || {};
                if ((datetime.is_select || false) == true) {
                    // 是否必选
                    if ((datetime.required || false) == true && (datetime.value || null) == null) {
                        app.globalData.showToast(datetime.error_msg || this.$t('buy.buy.q8u066'));
                        return false;
                    }
                    data['appoint_time'] = datetime.value || '';
                }

                // 自提客户名称和电话
                var extraction_contact = this.buy_extraction_contact_info || {};
                if ((extraction_contact.is_write || false) == true) {
                    // 是否必选
                    if ((extraction_contact.required || false) == true && ((extraction_contact.name || null) == null || (extraction_contact.tel || null) == null)) {
                        app.globalData.showToast(extraction_contact.error_msg || this.$t('buy.buy.8fghje'));
                        return false;
                    }
                    data['extraction_contact_name'] = extraction_contact.name || '';
                    data['extraction_contact_tel'] = extraction_contact.tel || '';
                }

                // 是否需要选择支付方式、并且未选择虚拟币支付方式
                if (this.total_price > 0 && this.common_order_is_booking != 1 && (this.plugins_coin_payment_id || null) == null) {
                    if ((data.payment_id || null) == null) {
                        app.globalData.showToast(this.$t('buy.buy.71kidy'));
                        return false;
                    }
                }

                // 加载loding
                uni.showLoading({
                    title: this.$t('buy.buy.r79t77'),
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
                            this.buy_submit_response_handle(res.data);
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
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 订单提交响应处理
            buy_submit_response_handle(res) {
                // 是否预约模式，则进入订单列表
                if (res.data.order_status == 0) {
                    var self = this;
                    uni.showModal({
                        title: this.$t('common.warm_tips'),
                        content: res.msg,
                        confirmText: this.$t('common.confirm'),
                        showCancel: false,
                        success(res) {
                            app.globalData.url_open(self.to_appoint_page, true);
                        },
                        fail(res) {
                            app.globalData.url_open(self.to_appoint_page, true);
                        },
                    });
                } else if(res.data.order_status == 2) {
                    // 线下支付（开启线下订单正常进入流程）
                    app.globalData.url_open(this.to_appoint_page, true);
                    
                } else {
                    // 调起支付
                    this.$refs.payment.pay_handle(res.data.order_ids.join(','), res.data.payment_id, this.payment_list);
                }
                this.setData({
                    is_order_submit_payment: 1
                });
            },

            // 支付方式选择
            payment_event(e) {
                var value = e.currentTarget.dataset.value;
                this.setData({
                    payment_id: (this.payment_id == value) ? 0 : value,
                    plugins_coin_payment_id: 0,
                });
                this.init();
            },

            // 虚拟币支付方式选择
            plugins_coin_payment_event(e) {
                var value = e.currentTarget.dataset.value;
                this.setData({
                    plugins_coin_payment_id: (this.plugins_coin_payment_id == value) ? 0 : value,
                    payment_id: 0,
                });
                this.init();
            },

            // 优惠劵弹层开启
            plugins_coupon_open_event(e) {
                var index = e.currentTarget.dataset.index;
                var coupon_data = this.plugins_coupon_data[index]['coupon_data'];
                var coupon_choice = coupon_data.coupon_choice || null;
                var temp_list = coupon_data.coupon_list || [];
                // 选中处理
                if (temp_list.length > 0) {
                    for (var i in temp_list) {
                        temp_list[i]['is_active'] = (coupon_choice || null) !== null && coupon_choice.id == temp_list[i]['id'] ? 1 : 0;
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
                    // 当前索引数据已选中则不处理
                    if ((temp_list[index]['is_active'] || 0) != 1) {
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

            // 运费选择事件
            plugins_freightfee_change_event(e) {
                var temp = this.plugins_freightfee_choice_data;
                temp[e.currentTarget.dataset.wid] = parseInt(e.detail.value);
                this.setData({
                    plugins_freightfee_choice_data: temp,
                });
                this.init();
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

                // 快递、同城、自提 需要选择地址
                if (this.buy_site_model_value <= 1) {
                    app.globalData.url_open('/pages/user-address/user-address?is_back=1' + params);
                } else if (this.buy_site_model_value == 2) {
                    app.globalData.url_open('/pages/extraction-address/extraction-address?is_back=1&is_buy=1' + params);
                } else {
                    app.globalData.showToast(this.$t('buy.buy.31616e'));
                }
            },

            // 销售,同城,自提,虚拟 模式选择事件
            buy_site_model_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                if (index != this.buy_site_model_active_index) {
                    // 数据设置
                    var upd_data = {
                        address: null,
                        address_id: null,
                        buy_site_model_value: e.currentTarget.dataset.value || 0,
                        buy_site_model_active_index: index,
                    };

                    // 是否门店模式下
                    if (this.is_realstore_model) {
                        // 覆盖选择的门店下单类型参数索引值
                        upd_data['params'] = {...this.params, ...{buy_use_type_data_index: this.buy_site_model_list[index]['index']}};
                    }
                    this.setData(upd_data);

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
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                    return false;
                }

                // 打开地图
                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            },

            // 积分使用值输入事件
            points_use_value_event(e) {
                var value = parseInt(e.detail.value || 0);
                var use_integral = parseInt(this.plugins_points_data.use_integral || 0);
                if (value > use_integral && use_integral > 0) {
                    value = use_integral;
                }
                this.setData({
                    actual_use_integral: value || '',
                });
            },

            // 积分使用值确认事件
            points_use_value_confirm_event(e) {
                this.setData({
                    plugins_points_status: this.actual_use_integral > 0,
                });
                this.init();
            },

            // 积分选择事件
            points_event(e) {
                this.setData({
                    plugins_points_status: !this.plugins_points_status,
                    actual_use_integral: this.actual_use_integral > 0 ? this.actual_use_integral : this.plugins_points_data.use_integral,
                });
                this.init();
            },

            // 仓库事件
            warehouse_group_event(e) {
                app.globalData.url_event(e);
            },

            // 下单选择时间
            buy_datetime_event() {
                let data = uni.getStorageSync(app.globalData.data.cache_time_select_choice_key) || '';
                let temp = this.buy_datetime_info;
                temp['status'] = !temp.status;
                if (data != 'open' && data != 'close') {
                    temp['value'] = ((data || null) != null ? data.value : '') || '';
                }
                this.setData({
                    buy_datetime_info: temp,
                });
            },

            // 自提客户名称和电话输入事件
            extraction_contact_event(e) {
                var temp = this.buy_extraction_contact_info;
                temp[e.currentTarget.dataset.value] = e.detail.value || '';
                this.setData({
                    buy_extraction_contact_info: temp,
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
                var id = this.plugins_realstore_data['user_card'][group_id]['data'][card_index]['id'];
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
