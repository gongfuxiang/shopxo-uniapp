<template>
    <view :class="theme_view">
        <view class="pr">
            <block v-if="(info || null) != null">
                <!-- 头部背景 -->
                <image :src="info.banner" mode="widthFix" class="header-bg wh-auto pa top-0 left-0 right-0" />
                <!-- 头部 -->
                <view class="header pr z-i">
                    <component-nav-back :propIsShowBack="is_realstore_top_nav_back == 1" :propFixed="false" propColor="#333">
                        <template slot="right" :class="is_top_search_width ? 'top-search-width' : 'flex-1 flex-width'">
                            <view v-if="is_base_mode != 1" :class="'va-m wh-auto top-nav-search '+(is_realstore_top_nav_back == 1 ? 'padding-left-main' : '')">
                                <block v-if="client_type == 'h5'">
                                    <component-search @onsearch="search_button_event" :propIsRequired="false" propIconColor="#333" propPlaceholderClass="cr-grey-c" :propPlaceholder="$t('detail.detail.q42ger')" propBgColor="#fff"></component-search>
                                </block>
                                <block v-else>
                                    <component-search
                                        @onsearch="search_button_event"
                                        @onicon="search_icon_event"
                                        :propIsIconOnEvent="is_realstore_top_search_scan == 1"
                                        :propIsOnEvent="true"
                                        :propIsRequired="false"
                                        :propIcon="is_realstore_top_search_scan == 1 ? 'icon-scan' : 'icon-qiandao-yixuan'"
                                        propPlaceholderClass="cr-grey-c"
                                        propBgColor="#fff"
                                        propIconColor="#333"
                                        :propPlaceholder="$t('detail.detail.q42ger')"
                                    ></component-search>
                                </block>
                            </view>
                        </template>
                        <template slot="content">
                            <!-- 桌码 -->
                            <view v-if="(tablecode || null) != null" class="tablecode dis-inline-block margin-left-main round cr-red"> {{ tablecode.name }}({{ tablecode.code }}) </view>
                        </template>
                    </component-nav-back>
                </view>
                <view class="pr">
                    <view class="header-top pr">
                        <!-- 头部基础内容 -->
                        <view class="header-content padding-horizontal-main">
                            <view class="padding-main border-radius-main bg-white pr z-i-deep">
                                <view class="base flex-row">
                                    <!-- 基础内容 -->
                                    <image :src="info.logo" mode="widthFix" class="logo border-radius-sm fl br" :data-value="info.logo" @tap="image_show_event"></image>
                                    <view class="base-right padding-left-sm flex-1 flex-width">
                                        <view v-if="is_base_mode != 1 && (info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0" class="use-type-icon pa text-size-xs cr-white bg-main tl" @tap="buy_use_type_event">
                                            <text class="va-m margin-right-xs">{{ info.buy_use_type_list[buy_use_type_active_index]['name'] }}</text>
                                            <view class="dis-inline-block va-m pr">
                                                <iconfont name="icon-arrow-bottom" size="24rpx" color="#fff"></iconfont>
                                            </view>
                                        </view>
                                        <view :class="'title ' + (is_base_mode != 1 && (info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0 ? 'title-length-limit' : '')" @tap="realstore_switch_event">
                                            <view class="dis-inline-block va-m single-text title-content" :class="is_realstore_switch == 1 ? 'switch' : ''">
                                                <text v-if="(info.alias || null) != null" class="va-m title-icon border-radius-sm br-main cr-main text-size-xs padding-left-sm padding-right-sm margin-right-xs">{{ info.alias }}</text>
                                                <text class="va-m fw-b text-size">{{ info.name }}</text>
                                            </view>
                                            <view v-if="is_realstore_switch == 1" class="dis-inline-block va-m margin-left-xs">
                                                <iconfont name="icon-transfer" size="36rpx" color="#666"></iconfont>
                                            </view>
                                        </view>
                                        <view class="margin-top-xs text-size-xss cr-grey tl">
                                            <view v-if="(info.status_info.time || null) != null">{{$t('detail.detail.dor2v9')}}{{ info.status_info.time }}</view>
                                            <view v-if="(info.distance || null) != null">{{$t('extraction-address.extraction-address.42v8tv')}}{{ info.distance }}</view>
                                        </view>
                                    </view>
                                </view>
                                <view class="margin-top-sm cp br-t-dashed padding-top-sm">
                                    <view class="flex-row jc-sb align-c">
                                        <!-- 地址 -->
                                        <view class="flex-row align-c flex-1 flex-width">
                                            <iconfont name="icon-map-address" size="28rpx" propClass="pr top-xs"></iconfont>
                                            <view class="address-content single-text cr-base margin-left-xs text-size-sm" :data-value="info.province_name + info.city_name + info.county_name + info.address" @tap="text_copy_event">
                                                {{ info.province_name }}{{ info.city_name }}{{ info.county_name }}{{ info.address }}
                                            </view>
                                            <!-- #ifndef MP-KUAISHOU -->
                                            <view v-if="info.lat != 0 && info.lng != 0" class="dis-inline-block tc cp border-radius-sm text-size-xss cr-green br-green padding-horizontal-xs margin-left-xs" @tap="address_map_event">{{$t('detail.detail.688i26')}}</view>
                                            <!-- #endif -->
                                        </view>
                                        <!-- 右侧操作 -->
                                        <view class="icon-list margin-left-main">
                                            <view v-if="(data_base || null) != null && is_service_info == 1" class="icon-item green cr-green border-radius-sm dis-inline-block tc cp" @tap="popup_service_open_event">
                                                <iconfont name="icon-mendian-kefu" size="26rpx"></iconfont>
                                            </view>
                                            <view :class="'icon-item red border-radius-sm dis-inline-block tc cp pr ' + (favor_info.status == 1 ? 'cr-red' : 'cr-grey-9')" @tap="favor_event">
                                                <iconfont name="icon-mendian-sc" size="26rpx"></iconfont>
                                                <view class="badge-icon pa">
                                                    <component-badge :propNumber="favor_info.count"></component-badge>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 门店基础模式 -->
                    <view v-if="is_base_mode == 1 && is_base_mode_show_type == 2" class="nav-base bg-white fw-b margin-bottom-sm margin-top-sm">
                        <block v-for="(item, index) in nav_base_list" :key="index">
                            <view v-if="nav_base_index == index" class="item fl tc padding-horizontal-main cr-main nav-active-line" :data-index="index" @tap="nav_base_event">{{ item.name }}</view>
                            <view v-else class="item fl tc padding-horizontal-main" :data-index="index" @tap="nav_base_event">{{ item.name }}</view>
                        </block>
                    </view>
                    <!-- 门店基础模式 - 商品 -->
                    <view v-if="is_base_mode == 1 && (is_base_mode_show_type == 0 || (is_base_mode_show_type == 2 && nav_base_index == 0))" class="padding-horizontal-main border-radius-main bg-white">
                        <view v-if="is_base_mode_show_type == 0" class="padding-top-sm margin-bottom-sm margin-top-main">
                            <view class="fw-b title-left-border">{{$t('goods-detail.goods-detail.dfge45')}}</view>
                        </view>
                        <scroll-view :scroll-y="true" class="cr-base text-size-sm" :style="content_style">
                            <view class="right-content-actual base-mode-goods">
                                <mp-html :content="info.describe" />
                            </view>
                        </scroll-view>
                    </view>
                    <block v-if="is_base_mode == 0 || (is_base_mode_show_type == 1 || (is_base_mode_show_type == 2 && nav_base_index == 1))">
                        <!-- 左侧分类和右侧商品 -->
                        <view class="content oh bg-white pr flex-row jc-sb" :style="content_style">
                            <!-- 左侧 -->
                            <scroll-view :scroll-y="true" class="left-content ht-auto bg-base">
                                <view class="left-content-actual text-size-sm">
                                    <view :class="'item tc cr-base cp ' + (nav_active_index == -1 ? 'bg-white cr-main nav-left-border fw-b' : '')" :data-index="-1" :data-itemindex="-1" @tap="nav_event">{{$t('common.all')}}</view>
                                    <block v-if="(goods_category || null) != null && goods_category.length > 0">
                                        <block v-for="(item, index) in goods_category" :key="index">
                                            <view :class="'item tc cr-base pr cp ' + (nav_active_index == index ? 'bg-white cr-main nav-left-border fw-b' : '')" :data-index="index" :data-itemindex="-1" @tap="nav_event">
                                                <text>{{ item.name }}</text>
                                                <view v-if="(item.buy_number || 0) > 0" class="badge-icon pa">
                                                    <component-badge :propNumber="item.buy_number"></component-badge>
                                                </view>
                                            </view>
                                        </block>
                                    </block>
                                </view>
                            </scroll-view>
                            <!-- 右侧 -->
                            <scroll-view :scroll-y="true" class="right-content ht-auto goods-list flex-1 flex-width" :scroll-top="scroll_top" @scroll="scroll_event" @scrolltolower="scroll_lower" lower-threshold="60">
                                <view :class="'right-content-actual pr '+(is_base_mode == 1 ? 'base-mode-goods' : '')">
                                    <!-- 操作导航 -->
                                    <view class="goods-list-top-nav bg-white">
                                        <!-- 排序 -->
                                        <view class="nav-sort-content oh">
                                            <block v-for="(item, index) in search_nav_sort_list" :key="index">
                                                <view class="sort-item tc fl cp" :data-index="index" @tap="nav_sort_event">
                                                    <text class="cr-base va-m text-size-sm">{{item.name}}</text>
                                                    <image v-if="(item.icon || null) != null" class="sort-icon va-m" :src="common_static_url + 'sort-' + item.icon + '-icon.png'" mode="aspectFill"></image>
                                                </view>
                                            </block>
                                        </view>
                                        <!-- 二级分类 -->
                                        <view v-if="(goods_category || null) != null && goods_category.length > 0 && nav_active_index != -1 && (goods_category[nav_active_index]['items'] || null) != null && goods_category[nav_active_index]['items'].length > 0" class="word-list scroll-view-horizontal padding-horizontal-main padding-bottom-main">
                                            <scroll-view :scroll-x="true" :scroll-with-animation="true" :scroll-into-view="'two-nav-item-' + nav_active_item_index">
                                                <view :class="'word-icon dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right ' + (nav_active_item_index == -1 ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey')" :data-index="nav_active_index" :data-itemindex="-1" @tap="nav_event">{{$t('common.all')}}</view>
                                                <block v-for="(cv, ci) in goods_category[nav_active_index]['items']" :key="ci">
                                                    <view :class="'word-icon dis-inline-block text-size-xs round padding-top-xs padding-bottom-xs padding-left padding-right ' + (nav_active_item_index != -1 && nav_active_item_index == ci ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey')" :id="'two-nav-item-' + ci" :data-index="nav_active_index" :data-itemindex="ci" @tap="nav_event">{{ cv.name }}</view>
                                                </block>
                                            </scroll-view>
                                        </view>
                                    </view>
                                    <!-- 右侧商品列表 -->
                                    <block v-if="(data_list || null) != null && data_list.length > 0">
                                        <block v-for="(item, index) in data_list" :key="index">
                                            <view :class="'goods-item bg-white padding-main border-radius-main oh spacing-mb '+((item.is_highlight || 0) == 1 ? 'item-highlight' : '')">
                                                <view :data-index="index" @tap="goods_event">
                                                    <view class="flex-row jc-sb">
                                                        <image :src="item.images" mode="widthFix" class="goods-img radius fl br"></image>
                                                        <view class="goods-base flex-1 flex-width padding-left-sm flex-col jc-sb">
                                                            <view class="goods-base-content">
                                                                <view class="goods-title text-size-md multi-text fw-b">{{ item.title }}</view>
                                                                <view v-if="(item.simple_desc || null) != null" class="simple-desc cr-grey-9 text-size-xs margin-top-xs single-text">{{ item.simple_desc }}</view>
                                                            </view>
                                                            <view class="margin-top-sm oh flex-row jc-sb align-c">
                                                                <view class="single-text sales-price va-b va-m">
                                                                    <text class="text-size-xss">{{ item.show_price_symbol }}</text>
                                                                    <text class="text-size">{{ item.min_price }}</text>
                                                                    <text class="text-size-xss cr-grey">{{ item.show_price_unit }}</text>
                                                                </view>
                                                                <view v-if="is_base_mode != 1" class="tc flex-row align-c">
                                                                    <block v-if="(item.is_error || 0) == 0">
                                                                        <view v-if="(item.buy_number || 0) > 0" class="cp pr top-sm" :data-index="index" data-type="0" @tap.stop="buy_number_event">
                                                                            <iconfont name="icon-cart-dec" size="48rpx" :color="theme_color"></iconfont>
                                                                        </view>
                                                                        <view v-if="(item.buy_number || 0) > 0" class="buy-number cr-black text-size-sm padding-left-xs padding-right-xs">
                                                                            {{ item.buy_number }}
                                                                        </view>
                                                                        <view class="cp pr top-sm" :data-index="index" data-type="1" @tap.stop="buy_number_event">
                                                                            <iconfont name="icon-cart-inc" size="48rpx" :color="theme_color"></iconfont>
                                                                        </view>
                                                                    </block>
                                                                    <block v-else>
                                                                        <text class="cr-grey-c text-size-xs">{{ item.is_error_msg }}</text>
                                                                    </block>
                                                                </view>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                        </block>
                                    </block>
                                    <block v-else>
                                        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" :propBackBtn="false"></component-no-data>
                                    </block>
                                </view>
                            </scroll-view>
                        </view>

                        <!-- 商品购买 -->
                        <component-goods-buy ref="goods_buy" :propCurrencySymbol="currency_symbol" v-on:CartSuccessEvent="goods_spec_cart_back_event"></component-goods-buy>
                    </block>

                    <!-- 基础模式底部导航 -->
                    <view v-if="is_base_mode == 1" class="plugins-realstore-detail-base-mode-nav z-i-deep bg-white pf left-0 bottom-0 wh-auto padding-main bs-bb br-top-shadow">
                        <view class="bottom-line-exclude button-list">
                            <view :class="'button-left tc '+(is_service_info == 1 ? '' : 'wh-auto')">
                                <!-- #ifndef MP-KUAISHOU -->
                                <view v-if="info.lat != 0 && info.lng != 0" propClass="item" @tap="address_map_event">
                                    <view>
                                        <iconfont name="icon-map-navigator" class="lh-sm" size="26rpx"></iconfont>
                                    </view>
                                    <view class="cr-base text-size-md">{{$t('detail.detail.688i26')}}</view>
                                </view>
                                <!-- #endif -->
                                <view class="item" @tap="share_event">
                                    <view>
                                        <iconfont name="icon-share-square" propClass="lh-sm" size="26rpx"></iconfont>
                                    </view>
                                    <view class="cr-base text-size-md">{{$t('common.share')}}</view>
                                </view>
                            </view>
                            <view v-if="is_service_info == 1" class="button-right">
                                <button type="default" class="item br-main bg-main cr-white round text-size-md dis-block wh-auto" @tap="popup_service_open_event">{{$t('cart.cart.31h34v')}}</button>
                            </view>
                        </view>
                    </view>
                </view>
            </block>
            <block v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </block>
        </view>

        <!-- 门店购物车 -->
        <component-realstore-cart ref="realstore_cart" :propIsBaseMode="is_base_mode == 1" :propCurrencySymbol="currency_symbol" :propStatus="is_cart_nav" v-on:CartSuccessEvent="goods_opt_cart_back_event" v-on:BuyTypeSwitchEvent="buy_type_switch_event" v-on:CartDataBackEvent="cart_data_back_event"></component-realstore-cart>

        <!-- 客服弹窗 -->
        <component-popup :propShow="popup_service_status" propPosition="bottom" @onclose="popup_service_close_event">
            <view class="padding-top-main bg-white">
                <view class="padding-horizontal-main">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_service_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="popup-service-container">
                    <view v-if="(info || null) != null && (data_base || null) != null && is_service_info == 1" class="header-service">
                        <view v-if="(info.chat_info || null) != null" class="item padding-main single-text">
                            <text class="va-m">{{$t('detail.detail.r4124d')}}</text>
                            <view class="dis-inline-block chat-info cp" @tap="chat_event">
                                <image class="dis-inline-block va-m" :src="info.chat_info.icon" mode="scaleToFill"></image>
                                <text class="margin-left-sm va-m cr-blue" :data-value="info.chat_info.chat_url">{{ info.chat_info.name }}</text>
                            </view>
                        </view>
                        <block v-if="(info.service_data || null) != null">
                            <view v-if="(info.service_data.service_qq || null) != null" class="item padding-main br-t-f9 single-text">
                                <text>Q Q：</text>
                                <text class="cp" @tap="text_copy_event" :data-value="info.service_data.service_qq">{{ info.service_data.service_qq }}</text>
                            </view>
                            <view v-if="(info.service_data.service_tel || null) != null" class="item padding-main br-t-f9 single-text">
                                <text>{{$t('order.order.7dxbm5')}}</text>
                                <text class="cp" @tap="tel_event" :data-value="info.service_data.service_tel">{{ info.service_data.service_tel }}</text>
                            </view>
                            <view v-if="(info.service_data.service_weixin_qrcode || null) != null || (info.service_data.service_line_qrcode || null) != null" class="oh qrcode tc br-t-f9 padding-top-main">
                                <view v-if="(info.service_data.service_weixin_qrcode || null) != null" class="item padding-bottom-lg dis-inline-block">
                                    <image class="radius cp" :src="info.service_data.service_weixin_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="info.service_data.service_weixin_qrcode"></image>
                                    <view>{{$t('detail.detail.54k10s')}}</view>
                                </view>
                                <view v-if="(info.service_data.service_line_qrcode || null) != null" class="item padding-bottom-lg dis-inline-block">
                                    <image class="radius cp" :src="info.service_data.service_line_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="info.service_data.service_line_qrcode"></image>
                                    <view>{{$t('detail.detail.vj4nom')}}</view>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </component-popup>

        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>

        <!-- 公共 -->
        <component-common ref="common" @onFooterHeight="footer_height_value_event" :propIsFooterSeat="false"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentNoData from '@/components/no-data/no-data';
    import componentSearch from '@/components/search/search';
    import componentBadge from '@/components/badge/badge';
    import componentPopup from '@/components/popup/popup';
    import componentRealstoreCart from '@/components/realstore-cart/realstore-cart';
    import componentSharePopup from '@/components/share-popup/share-popup';

    var common_static_url = app.globalData.get_static_url('common');
    var status_bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                status_bar_height: status_bar_height,
                common_static_url: common_static_url,
                client_type: app.globalData.application_client_type(),
                currency_symbol: app.globalData.currency_symbol(),
                is_top_search_width: false,
                // #ifdef MP-WEIXIN || MP-QQ || MP-ALIPAY || MP-BAIDU || MP-KUAISHOU || APP
                is_top_search_width: true,
                // #endif
                content_style: '',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
                is_base_mode: 0,
                is_base_mode_show_type: 0,
                is_cart_nav: false,
                params: {},
                is_first: 1,
                scroll_top: 0,
                scroll_top_old: 0,
                info: null,
                goods_category: [],
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                cart: null,
                data_base: null,
                favor_user: [],
                tablecode: null,
                search_keywords_value: '',
                nav_active_index: -1,
                nav_active_item_index: -1,
                popup_service_status: false,
                // 基础导航
                nav_base_index: 0,
                nav_base_list: [
                    { name: this.$t('goods-detail.goods-detail.dfge45'), value: 0 },
                    { name: this.$t('goods-detail.goods-detail.567uhg'), value: 1 },
                ],
                // 下单类型
                buy_use_type_active_index: 0,
                // 排序导航
                search_nav_sort_index: 0,
                search_nav_sort_list: [{
                		name: this.$t('goods-category.goods-category.x69aow'),
                		field: 'default',
                		sort: 'asc',
                		icon: null
                	},
                	{
                		name: this.$t('goods-category.goods-category.at5p35'),
                		field: 'sales_count',
                		sort: 'asc',
                		icon: 'default'
                	},
                	{
                		name: this.$t('goods-category.goods-category.283ot0'),
                		field: 'access_count',
                		sort: 'asc',
                		icon: 'default'
                	},
                	{
                		name: this.$t('goods-category.goods-category.g2u3lf'),
                		field: 'min_price',
                		sort: 'asc',
                		icon: 'default'
                	},
                	{
                		name: this.$t('goods-category.goods-category.5p4ksj'),
                		field: 'id',
                		sort: 'asc',
                		icon: 'default'
                	}
                ],
                // 收藏信息
                favor_info: {
                    text: this.$t('goods-detail.goods-detail.dco1sc'),
                    status: 0,
                    count: 0,
                },
                // 门店客服信息展示
                is_service_info: 0,
                // 是否支持门店切换
                is_realstore_switch: 0,
                // 自定义分享信息
                share_info: {},
                // 是否单页预览
                is_single_page: app.globalData.is_current_single_page() || 0,
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                // #ifdef MP-TOUTIAO
                is_realstore_top_nav_back : 0,
                // #endif
                is_realstore_top_search_scan: app.globalData.data.is_realstore_top_search_scan || 0,
                // 底部菜单高度
                footer_height_value: 0,
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentGoodsBuy,
            componentNoData,
            componentSearch,
            componentBadge,
            componentPopup,
            componentRealstoreCart,
            componentSharePopup
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            params = app.globalData.launch_params_handle(params);
            // 是否指定门店id
            var realstore_id = app.globalData.data.plugins_realstore_id || null;
            if(realstore_id != null) {
                params['id'] = realstore_id;
            }
            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 门店选择初始化
            this.realstore_choice_init();

            // 初始化配置
            this.init_config();

            // 获取数据
            var self = this;
            setTimeout(function() {
                self.get_detail_init();
            }, 100);

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
                data_list_loding_status: (this.data_list_loding_status == 2) ? 1 : this.data_list_loding_status
            });
            this.reset_scroll();
            this.get_detail_init();
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

            // 门店选择初始化
            realstore_choice_init() {
                var key = app.globalData.data.cache_realstore_detail_choice_key;
                var res = uni.getStorageSync(key) || null;
                if(res != null && (res.data || null) != null && res.status == 1) {
                    uni.setStorageSync(key, {
                        data: res.data,
                        status: 0
                    });
                    this.setData({
                        params: {...this.params, ...{id: res.data.id}},
                        info: res.data,
                        is_first: 1,
                        data_list: [],
                        data_total: 0,
                        data_page: 1,
                        data_page_total: 0,
                        data_is_loading: 0,
                        data_list_loding_status: 1,
                        data_bottom_line_status: false
                    });
                    this.source_goods_remove();
                    this.reset_scroll();
                }
            },

            // 获取数据-初始化
            get_detail_init(params = {}) {
                // 网络检查
                if((params || null) == null || (params.loading || 0) == 0) {
                    app.globalData.network_type_handle(this, 'get_detail_init');
                    return false;
                }

                // 请求数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'detail', 'realstore'),
                    method: 'POST',
                    data: this.$refs.realstore_cart.request_params_merge(
                        {
                            id: ((this.info || null) == null) ? (this.params.id || 0) : (this.info.id || 0),
                        }, 'init'),
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            // 门店数据
                            var data = res.data.data;
                            // 基础配置
                            var data_base = data.base || {};

                            this.setData({
                                is_service_info: parseInt(data_base.is_service_info || 0),
                                is_realstore_switch: parseInt(data_base.is_realstore_switch || 0),
                                is_base_mode: parseInt(data.is_base_mode || 0),
                                is_base_mode_show_type: parseInt(data.is_base_mode_show_type || 0),
                                is_cart_nav: true,
                                data_base: data_base,
                                info: data.info || null,
                                goods_category: data.goods_category || [],
                                favor_user: data.favor_user || [],
                                tablecode: data.tablecode || null
                            });
                            
                            // 样式处理
                            this.content_actual_size_handle();

                            // 收藏处理
                            if ((this.info || null) != null) {
                                // 收藏信息
                                var status = this.favor_user.indexOf(this.info.id) != -1 ? 1 : 0;
                                this.setData({
                                    favor_info: {
                                        count: this.info.favor_count || 0,
                                        status: status,
                                        text: (status == 1 ? this.$t('goods-detail.goods-detail.by7052') : '') + this.$t('goods-detail.goods-detail.dco1sc'),
                                    },
                                });

                                // #ifndef MP-ALIPAY
                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.info.name,
                                });
                                // #endif

                                // 基础自定义分享
                                // 指定商品
                                var source_goods_id = this.params.source_goods_id || null;
                                var source_goods = (source_goods_id == null) ? '' : '&source_goods_id='+source_goods_id;
                                // 桌码
                                var tablecode_id = this.params.tablecode_id || null;
                                var tablecode = (tablecode_id == null) ? '' : '&tablecode_id='+tablecode_id;
                                // 关键字
                                var keywords_value = this.search_keywords_value || null;
                                var keywords = (keywords_value == null) ? '' : '&keywords_value='+keywords_value;
                                this.setData({
                                    share_info: {
                                        title: this.info.seo_title || this.info.name,
                                        desc: this.info.seo_desc || this.info.describe,
                                        path: '/pages/plugins/realstore/detail/detail',
                                        query: 'id=' + this.info.id+source_goods+tablecode+keywords,
                                        img: this.info.share_images || this.info.logo,
                                    },
                                });

                                // 是否基础模式
                                if(this.is_base_mode != 1) {
                                    // 获取购物车数据
                                    this.get_cart_data();
                                }

                                // 下单类型索引
                                var type_data = this.buy_use_type_data();
                                this.setData({
                                    buy_use_type_active_index: type_data.active_index,
                                });

                                // 获取数据、仅首次调用，获取列表接口
                                if (this.is_first == 1) {
                                    // 是否基础模式
                                    if(this.is_base_mode != 1 || this.is_base_mode_show_type != 0) {
                                        this.get_data_list();
                                    }
                                    // 非首次记录
                                    this.setData({
                                        is_first: 0,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
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
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 获取数据-商品列表
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                });

                // 请求参数
                var post_data = {
                    id: this.info.id || 0,
                    page: this.data_page,
                    keywords: this.search_keywords_value,
                };
                // 分类id
                var temp_category = this.goods_category;
                if (this.nav_active_item_index != -1) {
                    post_data['category_id'] = temp_category[this.nav_active_index]['items'][this.nav_active_item_index]['id'];
                } else {
                    post_data['category_id'] = this.nav_active_index == -1 ? 0 : temp_category[this.nav_active_index]['id'];
                }
                // 排序
                var temp_index = this.search_nav_sort_index;
                var temp_search_nav_sort = this.search_nav_sort_list;
                post_data['order_by_type'] = temp_search_nav_sort[temp_index]['sort'] == 'desc' ? 'asc' : 'desc';
                post_data['order_by_field'] = temp_search_nav_sort[temp_index]['field'];
                // 指定商品
                if((this.params.source_goods_id || null) != null) {
                    post_data['source_goods_id'] = this.params.source_goods_id;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'detail', 'realstore'),
                    method: 'POST',
                    data: this.$refs.realstore_cart.request_params_merge(post_data, 'data'),
                    dataType: 'json',
                    success: (res) => {
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
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 样式处理
            content_actual_size_handle() {
                // 基础模式内容高度处理
                var value = 0;
                if(this.is_base_mode == 1) {
                    value = (this.is_base_mode_show_type == 1) ? 110 : 220;
                }
                // 内容高度
                value += (this.client_type == 'h5') ? 370 : 352;
                // 桌码
                if(this.tablecode != null) {
                    value += 44;
                }

                // 减去内容高度、底部菜单高度
                this.setData({
                    content_style: 'height: calc(100vh - '+value+'rpx - '+(this.status_bar_height+this.footer_height_value)+'px);',
                });
            },

            // 收藏事件
            favor_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'favor_event');
                if (user != false) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('reversal', 'favor', 'realstore'),
                        method: 'POST',
                        data: {
                            id: this.info.id,
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

            // 列表数据操作
            buy_number_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'buy_number_event', e);
                if (user != false) {
                    var index = e.currentTarget.dataset.index;
                    var type = parseInt(e.currentTarget.dataset.type) || 0;
                    var temp_goods = this.data_list[index];
                    // 是否存在多规格
                    if ((temp_goods.is_exist_many_spec || 0) != 0) {
                        // 是否购物车中操作
                        if (type == 0) {
                            this.$refs.realstore_cart.cart_event(true);
                            app.globalData.showToast(this.$t('goods-category.goods-category.gy7y0w'));
                        } else {
                            if ((this.$refs.goods_buy || null) != null) {
                                var buy_params = this.params;
                                var type_data = this.buy_use_type_data();
                                buy_params['buy_event_type'] = 'cart';
                                buy_params['buy_use_type_data_index'] = type_data.data_index;
                                buy_params['realstore_id'] = this.info.id;
                                this.$refs.goods_buy.init(temp_goods, buy_params);
                            }
                        }
                        return false;
                    }

                    // 数据操作处理
                    this.buy_number_event_handle(e, type, temp_goods);
                }
            },

            // 多规格加入购物车成功回调
            goods_spec_cart_back_event(params) {
                // 重新获取购物车数据
                this.get_cart_data();
                // 更新列表数据处理
                this.cart_data_list_handle(params, 1);
            },

            // 购物车操作成功回调
            goods_opt_cart_back_event(params) {
                // 更新列表数据处理
                this.cart_data_list_handle(params);
            },

            // 购物车数据获取成功回调
            cart_data_back_event(params) {
                var temp_data_list = this.data_list;
                if (temp_data_list.length > 0) {
                    for (var i in temp_data_list) {
                        // 非追加则赋值0
                        temp_data_list[i]['buy_number'] = 0;
                        // 对应商品叠加数量
                        if((params || null) != null && (params.data || null) != null && params.data.length > 0) {
                            for (var x in params.data) {
                                if (params.data[x]['goods_id'] == temp_data_list[i]['id']) {
                                    temp_data_list[i]['buy_number'] += parseInt(params.data[x]['stock'] || 0);
                                }
                            }
                        }
                    }
                    this.setData({
                        data_list: temp_data_list,
                    });
                }
            },

            // 更新列表数据处理
            // params 操作数据
            // is_append 是否追加数据（0否、1是）
            cart_data_list_handle(params, is_append = 0) {
                var temp_data_list = this.data_list;
                if (temp_data_list.length > 0) {
                    for (var i in temp_data_list) {
                        // 非追加则赋值0
                        if(is_append == 0 && (params.type || null) != 'save') {
                            temp_data_list[i]['buy_number'] = 0;
                        }
                        // 对应商品叠加数量
                        if (params.goods_id == temp_data_list[i]['id']) {
                            temp_data_list[i]['buy_number'] += parseInt(params.stock || 0);
                        }
                    }
                    this.setData({
                        data_list: temp_data_list,
                    });
                }
            },

            // 获取购物车数据
            get_cart_data() {
                if((this.$refs.realstore_cart || null) != null) {
                    this.$refs.realstore_cart.init({...{source: 'realstore', base: this.data_base, info: this.info}, ...this.params});
                }
            },

            // 列表数量事件处理
            buy_number_event_handle(e, type, goods, spec = '') {
                // 调用门店购物车方法处理
                if((this.$refs.realstore_cart || null) != null) {
                    this.$refs.realstore_cart.goods_opt_handle(type, goods, spec, 'buy_number', e);
                }
            },

            // 搜索事件
            search_button_event(e) {
                this.setData({
                    search_keywords_value: e || '',
                    data_page: 1,
                });
                this.source_goods_remove();
                this.reset_scroll();
                this.get_data_list(1);
            },

            // 搜索icon扫码事件、扫码商品id实现加入购物车
            search_icon_event(e) {
                if((this.$refs.realstore_cart || null) != null) {
                    this.$refs.realstore_cart.search_icon_handle(e);
                }
            },

            // 剪切板
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },

            // 地图查看
            address_map_event(e) {
                var info = this.info || {};
                if (info.lat == 0 || info.lng == 0) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                    return false;
                }
                var address = (info.province_name || '') + (info.city_name || '') + (info.county_name || '') + (info.address || '');
                app.globalData.open_location(info.lng, info.lat, info.name, address);
            },

            // 电话
            tel_event(e) {
                app.globalData.call_tel(e);
            },

            // 图片预览
            image_show_event(e) {
                app.globalData.image_show_event(e);
            },

            // 进入客服系统
            chat_event() {
                app.globalData.chat_entry_handle(this.info.chat_info.chat_url);
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_index: e.currentTarget.dataset.index,
                    nav_active_item_index: e.currentTarget.dataset.itemindex,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.source_goods_remove();
                this.reset_scroll();
                this.get_data_list(1);
            },

            // 重置滑动位置
            reset_scroll() {
                this.setData({
                    scroll_top: this.scroll_top_old,
                });
                this.$nextTick(() => {
                    this.setData({
                        scroll_top: 0,
                    });
                });
            },

            // 滑动事件位置记录
            scroll_event(e) {
                this.setData({
                    scroll_top_old: e.detail.scrollTop,
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 排序事件
            nav_sort_event(e) {
            	var index = e.currentTarget.dataset.index || 0;
            	var temp_search_nav_sort = this.search_nav_sort_list;
            	var temp_sort = temp_search_nav_sort[index]['sort'] == 'desc' ? 'asc' : 'desc';
            	for (var i in temp_search_nav_sort) {
            		if (i != index) {
            			if (temp_search_nav_sort[i]['icon'] != null) {
            				temp_search_nav_sort[i]['icon'] = 'default';
            			}
            			temp_search_nav_sort[i]['sort'] = 'desc';
            		}
            	}
            	temp_search_nav_sort[index]['sort'] = temp_sort;
            	if (temp_search_nav_sort[index]['icon'] != null) {
            		temp_search_nav_sort[index]['icon'] = temp_sort;
            	}

            	this.setData({
            		search_nav_sort_index: index,
            		search_nav_sort_list: temp_search_nav_sort,
            		data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
            	});
                this.source_goods_remove();
                this.reset_scroll();
            	this.get_data_list(1);
            },

            // 来源商品清空
            source_goods_remove() {
                // 存在参数指定来源商品id则清空
                if((this.params.source_goods_id || null) != null) {
                    var temp_params = this.params;
                    delete temp_params['source_goods_id'];
                    this.setData({
                        params: temp_params
                    });
                }
            },

            // 使用类型事件
            buy_use_type_event(e) {
                if((this.$refs.realstore_cart || null) != null) {
                    this.$refs.realstore_cart.buy_use_type_event();
                }
            },

            // 下单类型切换事件回调
            buy_type_switch_event(params) {
                this.setData({
                    buy_use_type_active_index: params.buy_use_type_active_index,
                    data_page: 1,
                });
                this.reset_scroll();
                this.get_data_list(1);
            },

            // 获取使用类型数据索引、默认在店0
            buy_use_type_data() {
                if((this.$refs.realstore_cart || null) != null) {
                    return this.$refs.realstore_cart.buy_use_type_data();
                }
                return 0;
            },

            // 商品事件
            goods_event(e) {
                // 是否可以打开商品页面
                if(app.globalData.data.is_realstore_forbid_to_goods_detail != 1) {
                    // 商品数据缓存处理
                    var goods = this.data_list[e.currentTarget.dataset.index];
                    app.globalData.goods_data_cache_handle(goods.id, goods);

                    // 调用公共打开url地址
                    var type_data = this.buy_use_type_data();
                    var url = '/pages/goods-detail/goods-detail?id=' + goods.id + '&is_opt_back=1&buy_use_type_data_index=' + type_data.data_index + '&realstore_id=' + this.info.id;
                    app.globalData.url_open(url);
                }
            },

            // 门店切换事件
            realstore_switch_event (e) {
                if(this.is_realstore_switch == 1) {
                    app.globalData.url_open('/pages/plugins/realstore/search/search?is_choice_mode=1&show_type_mode=1');
                }
            },

            // 开启客服弹层
            popup_service_open_event(e) {
                this.setData({
                    popup_service_status: true,
                });
            },

            // 关闭客服弹层
            popup_service_close_event(e) {
                this.setData({
                    popup_service_status: false,
                });
            },

            // 分享开启弹层
            share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info
                    });
                }
            },

            // 基础导航事件
            nav_base_event(e) {
                this.setData({
                    nav_base_index: e.currentTarget.dataset.index,
                });
            },

            // 底部菜单高度
            footer_height_value_event(value) {
                this.setData({
                    footer_height_value: value
                });
                this.content_actual_size_handle();
            }
        },
    };
</script>
<style>
    @import './detail.css';
</style>
