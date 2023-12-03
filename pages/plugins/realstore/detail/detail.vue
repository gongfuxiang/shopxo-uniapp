<template>
    <view :class="theme_view">
        <view class="pr">
            <!-- 头部背景 -->
            <image v-if="(info || null) != null" :src="info.banner" mode="widthFix" class="header-bg wh-auto pa top-0 left-0 right-0" />
            <!-- 头部 -->
            <view class="header pr z-i">
                <component-nav-back :prop-fixed="false" prop-color="#333">
                    <template slot="right" :class="is_mp_env ? 'top-search-width' : 'flex-1 flex-width'">
                        <view :class="'va-m padding-left-main ' + (is_realstore_top_nav_back == 1 ? 'nav-search' : 'wh-auto')">
                            <!-- #ifndef H5 -->
                            <component-search
                                @onsearch="search_button_event"
                                @onicon="search_icon_event"
                                :propIsIconOnEvent="is_realstore_top_search_scan == 1"
                                :propIsOnEvent="true"
                                :propIsRequired="false"
                                :propIcon="is_realstore_top_search_scan == 1 ? 'icon-mendian-sousuosm' : 'icon-qiandao-dqxz'"
                                propPlaceholderClass="cr-grey-c"
                                propBgColor="#fff"
                                propIconColor="#333"
                                propPlaceholder="商品搜索"
                            ></component-search>
                            <!-- #endif -->
                            <!-- #ifdef H5 -->
                            <component-search @onsearch="search_button_event" :propIsRequired="false" propIconColor="#333" propPlaceholderClass="cr-grey-c" propPlaceholder="商品搜索" propBgColor="#fff"></component-search>
                            <!-- #endif -->
                        </view>
                    </template>
                    <template slot="content">
                        <!-- 桌码 -->
                        <view v-if="(tablecode || null) != null" class="tablecode dis-inline-block margin-left-main round cr-red"> {{ tablecode.name }}({{ tablecode.code }}) </view>
                    </template>
                </component-nav-back>
            </view>
            <view v-if="(info || null) != null" class="pr">
                <view class="pr">
                    <!-- 头部基础内容 -->
                    <view class="header-content padding-horizontal-main">
                        <view class="padding-main border-radius-main bg-white pr box-shadow z-i-deep">
                            <view class="base flex-row">
                                <!-- 基础内容 -->
                                <image :src="info.logo" mode="widthFix" class="logo border-radius-sm fl br" :data-value="info.logo" @tap="image_show_event"></image>
                                <view class="base-right flex-1 flex-width">
                                    <view v-if="(info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0" class="use-type-icon pa text-size-xs cr-white bg-main" @tap="buy_use_type_event">
                                        <text class="va-m margin-right-xs">{{ info.buy_use_type_list[buy_use_type_index]['name'] }}</text>
                                        <view class="dis-inline-block va-m pr top-sm">
                                            <iconfont name="icon-mendian-jiantou2" size="28rpx" color="#fff"></iconfont>
                                        </view>
                                    </view>
                                    <view :class="'title fw-b text-size single-text ' + ((info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0 ? 'title-length-limit' : '')">
                                        <text v-if="(info.alias || null) != null" class="va-m title-icon border-radius-sm br-main cr-main text-size-xs padding-left-sm padding-right-sm margin-right-xs">{{ info.alias }}</text>
                                        <text class="va-m">{{ info.name }}</text>
                                    </view>
                                    <view class="margin-top-xs text-size-xs cr-grey">
                                        <view v-if="(info.status_info.time || null) != null">营业时间：{{ info.status_info.time }}</view>
                                        <view v-if="(info.distance || null) != null">距您{{ info.distance }}</view>
                                    </view>
                                </view>
                            </view>
                            <view class="margin-top-main cp br-t-dashed padding-top-sm">
                                <view class="flex-row jc-sb align-c">
                                    <!-- 地址 -->
                                    <view class="flex-row align-c flex-1 flex-width">
                                        <iconfont name="icon-index-zxmd-dress" size="28rpx" prop-class="pr top-xs"></iconfont>
                                        <view class="address-content single-text cr-base margin-left-xs text-size-sm" :data-value="info.province_name + info.city_name + info.county_name + info.address" @tap="text_copy_event">
                                            {{ info.province_name }}{{ info.city_name }}{{ info.county_name }}{{ info.address }}
                                        </view>
                                        <!-- #ifndef MP-KUAISHOU -->
                                        <view v-if="info.lat != 0 && info.lng != 0" class="dis-inline-block tc cp border-radius-sm text-size-xss cr-green navigation margin-left-xs" @tap="address_map_event"> 导航 </view>
                                        <!-- #endif -->
                                    </view>
                                    <!-- 右侧操作 -->
                                    <view class="icon-list margin-left-main">
                                        <view v-if="(data_base.is_service_info || 0) == 1" class="icon-item green cr-green border-radius-sm dis-inline-block tc cp" @tap="header_service_event">
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

                    <!-- 在线客服 -->
                    <view v-if="header_service_status && ((data_base.is_service_info || 0) == 1 || (info.chat_info || null) != null)" class="header-service pa border-radius-main oh bg-white br">
                        <view v-if="(info.chat_info || null) != null" class="item padding-main br-t single-text">
                            <text class="va-m">客服：</text>
                            <view class="dis-inline-block chat-info cp" @tap="chat_event">
                                <image class="dis-inline-block va-m" :src="info.chat_info.icon" mode="scaleToFill"></image>
                                <text class="margin-left-sm va-m cr-blue" :data-value="info.chat_info.chat_url">{{ info.chat_info.name }}</text>
                            </view>
                        </view>
                        <view v-if="(info.service_qq || null) != null" class="item padding-main br-t single-text">
                            <text>Q Q：</text>
                            <text class="cp" @tap="text_copy_event" :data-value="info.service_qq">{{ info.service_qq }}</text>
                        </view>
                        <view v-if="(info.service_tel || null) != null" class="item padding-main br-t single-text">
                            <text>电话：</text>
                            <text class="cp" @tap="tel_event" :data-value="info.service_tel">{{ info.service_tel }}</text>
                        </view>
                        <view v-if="(info.service_weixin_qrcode || null) != null || (info.service_line_qrcode || null) != null" class="oh qrcode tc br-t padding-top-main">
                            <view v-if="(info.service_weixin_qrcode || null) != null" class="item padding-bottom-lg dis-inline-block">
                                <image class="radius cp" :src="info.service_weixin_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="info.service_weixin_qrcode"></image>
                                <view>长按微信咨询</view>
                            </view>
                            <view v-if="(info.service_line_qrcode || null) != null" class="item padding-bottom-lg dis-inline-block">
                                <image class="radius cp" :src="info.service_line_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="info.service_line_qrcode"></image>
                                <view>长按line咨询</view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 内容 -->
                <view class="content oh bg-white pr flex-row jc-sb" :style="content_style">
                    <!-- 左侧 -->
                    <scroll-view :scroll-y="true" class="left-content ht-auto bg-base">
                        <view class="left-content-actual text-size-xs">
                            <view :class="'item tc cr-base cp ' + (nav_active_index == -1 ? 'bg-white cr-main nav-left-border fw-b' : '')" :data-index="-1" :data-itemindex="-1" @tap="nav_event">全部</view>
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
                        <view class="right-content-actual pr">
                            <!-- 二级分类 -->
                            <view v-if="(goods_category || null) != null && goods_category.length > 0 && nav_active_index != -1 && (goods_category[nav_active_index]['items'] || null) != null && goods_category[nav_active_index]['items'].length > 0" class="word-list scroll-view-horizontal">
                                <scroll-view :scroll-x="true" :scroll-with-animation="true" :scroll-into-view="'two-nav-item-' + nav_active_item_index">
                                    <view
                                        :class="'word-icon dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right ' + (nav_active_item_index == -1 ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey')"
                                        :data-index="nav_active_index"
                                        :data-itemindex="-1"
                                        @tap="nav_event"
                                        >全部</view
                                    >
                                    <block v-for="(cv, ci) in goods_category[nav_active_index]['items']" :key="ci">
                                        <view
                                            :class="'word-icon dis-inline-block text-size-xs round padding-top-xs padding-bottom-xs padding-left padding-right ' + (nav_active_item_index != -1 && nav_active_item_index == ci ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey')"
                                            :id="'two-nav-item-' + ci"
                                            :data-index="nav_active_index"
                                            :data-itemindex="ci"
                                            @tap="nav_event"
                                            >{{ cv.name }}</view
                                        >
                                    </block>
                                </scroll-view>
                            </view>
                            <!-- 右侧商品列表 -->
                            <block v-if="(data_list || null) != null && data_list.length > 0">
                                <view v-for="(item, index) in data_list" :key="index" class="item bg-white padding-main border-radius-main oh spacing-mb">
                                    <view :data-value="'/pages/goods-detail/goods-detail?id=' + item.id + '&is_opt_back=1&buy_use_type_index=' + buy_use_type_index + '&realstore_id=' + info.id" @tap="goods_url_event">
                                        <view class="flex-row jc-sb">
                                            <image :src="item.images" mode="widthFix" class="goods-img radius fl br"></image>
                                            <view class="goods-base flex-1 flex-width padding-left-main flex-col jc-sb">
                                                <view class="goods-base-content">
                                                    <view class="goods-title text-size-md multi-text fw-b">{{ item.title }}</view>
                                                    <view v-if="(item.simple_desc || null) != null" class="simple-desc cr-grey-9 text-size-xs margin-top-xs single-text">{{ item.simple_desc }}</view>
                                                </view>
                                                <view class="margin-top oh flex-row jc-sb align-c">
                                                    <view class="single-text sales-price va-b va-m">
                                                        <text class="text-size-xss">{{ currency_symbol }}</text>
                                                        <text class="text-size-lg">{{ item.min_price }}</text>
                                                    </view>
                                                    <view class="tc flex-row align-c">
                                                        <block v-if="(item.is_error || 0) == 0">
                                                            <view v-if="(item.buy_number || 0) > 0" class="cp pr top-sm" :data-index="index" data-type="0" @tap.stop="buy_number_event">
                                                                <iconfont name="icon-cart-dec" size="40rpx" :color="theme_color"></iconfont>
                                                            </view>
                                                            <view v-if="(item.buy_number || 0) > 0" class="buy-number cr-black text-size-sm padding-left-xs padding-right-xs">
                                                                {{ item.buy_number }}
                                                            </view>
                                                            <view class="cp pr top-sm" :data-index="index" data-type="1" @tap.stop="buy_number_event">
                                                                <iconfont name="icon-cart-inc" size="40rpx" :color="theme_color"></iconfont>
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
                            <block v-else>
                                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                            </block>
                        </view>
                    </scroll-view>
                </view>

                <!-- 购物车列表 -->
                <block v-if="cart_status">
                    <view class="cart-mask wh-auto ht-auto pf" @tap="cart_event"></view>
                    <view class="cart-content bg-white border-radius-main pa oh">
                        <block v-if="(cart || null) != null && (cart.data || null) != null && cart.data.length > 0">
                            <view class="oh br-b padding-vertical-main padding-horizontal-main">
                                <text class="va-m text-size-xs cr-base">已选商品</text>
                                <view class="dis-inline-block margin-left-xl text-size-xs">
                                    <text class="cr-red">没有已加购的商品？</text>
                                    <text class="br-green cr-green round padding-left padding-right padding-top-xs padding-bottom-xs cp" @tap="buy_use_type_event">切换下单类型</text>
                                </view>
                                <view class="fr cp" @tap="cart_all_delete_event">
                                    <view class="dis-inline-block va-m">
                                        <uni-icons type="trash" size="24rpx" color="#f00"></uni-icons>
                                    </view>
                                    <text class="cr-red va-m text-size-xs margin-left-xs">清空</text>
                                </view>
                            </view>
                            <scroll-view :scroll-y="true" class="cart-list goods-list">
                                <view v-for="(goods, index) in cart.data" :key="index" class="item padding-main oh spacing-mb">
                                    <view :data-value="'/pages/goods-detail/goods-detail?id=' + goods.goods_id + '&is_opt_back=1&buy_use_type_index=' + buy_use_type_index + '&realstore_id=' + info.id" @tap="goods_url_event">
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
                                                <view class="margin-top-sm oh">
                                                    <view class="sales-price text-size-sm single-text dis-inline-block va-m">{{ currency_symbol }}{{ goods.price }}</view>
                                                    <view class="tc fr flex-row align-c">
                                                        <view v-if="(goods.stock || 0) > 0" class="cp pr top-sm" :data-index="index" data-type="0" @tap.stop="cart_buy_number_event">
                                                            <iconfont name="icon-cart-dec" size="28rpx" :color="theme_color"></iconfont>
                                                        </view>
                                                        <view v-if="(goods.stock || 0) > 0" class="buy-number dis-inline-block cr-black text-size-sm padding-left-xs padding-right-xs va-m">{{ goods.stock }} </view>
                                                        <view class="cp pr top-sm" :data-index="index" data-type="1" @tap.stop="cart_buy_number_event">
                                                            <iconfont name="icon-cart-inc" size="28rpx" :color="theme_color"></iconfont>
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </scroll-view>
                        </block>
                        <block v-else>
                            <component-no-data propStatus="0" propMsg="请先选购商品"></component-no-data>
                            <view class="padding-bottom-xxxl margin-bottom-xxxl tc text-size-xs margin-top-xxl">
                                <text class="cr-red">没有已加购的商品？</text>
                                <text class="br-green cr-green round padding-left padding-right padding-top-xs padding-bottom-xs cp" @tap="buy_use_type_event">切换下单类型</text>
                            </view>
                        </block>
                    </view>
                </block>

                <!-- 购物车底部导航 -->
                <view class="botton-nav round pa oh flex-row jc-sb align-c">
                    <view class="flex-row align-c flex-1 flex-width">
                        <view class="cart pr cp top-sm" @tap="cart_event">
                            <iconfont name="icon-applet-shop-acquiesce" size="36rpx" color="#666"></iconfont>
                            <view v-if="(cart || null) != null && (cart.buy_number || 0) > 0" class="badge-icon pa">
                                <component-badge :propNumber="cart.buy_number"></component-badge>
                            </view>
                        </view>
                        <view class="cart-total-price single-text fw-b cr-red flex-1">
                            <text class="text-size-xss">{{ currency_symbol }}</text>
                            <text class="text-size-lg">{{ (cart || null) == null ? 0 : cart.total_price || 0 }}</text>
                        </view>
                    </view>
                    <button type="default" size="mini" hover-class="none" @tap="buy_submit_event" :class="'text-size-md radius-0 ' + (info.status_info.status == 1 ? 'bg-main cr-white' : 'bg-grey cr-grey')">{{ info.status_info.status == 1 ? '去结算' : info.status_info.msg }}</button>
                </view>

                <!-- 购物车抛物线 -->
                <component-cart-para-curve ref="cart_para_curve"></component-cart-para-curve>

                <!-- 商品购买 -->
                <component-goods-buy ref="goods_buy" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNavBack from '@/components/nav-back/nav-back';
    import base64 from '../../../../common/js/lib/base64.js';
    import componentGoodsBuy from '../../../../components/goods-buy/goods-buy';
    import componentNoData from '../../../../components/no-data/no-data';
    import componentSearch from '../../../../components/search/search';
    import componentBadge from '../../../../components/badge/badge';
    import componentPopup from '../../../../components/popup/popup';
    import componentCartParaCurve from '../../../../components/cart-para-curve/cart-para-curve';

    var common_static_url = app.globalData.get_static_url('common');
    var status_bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                status_bar_height: status_bar_height,
                common_static_url: common_static_url,
                is_mp_env: false,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU
                is_mp_env: true,
                // #endif
                content_style: '',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
                currency_symbol: app.globalData.data.currency_symbol,
                cache_buy_use_type_index_key: 'cache_plugins_realstore_buy_use_type_index',
                buy_use_type_index: 0,
                params: null,
                is_first: 1,
                scroll_top: 0,
                scroll_top_old: 0,
                user: null,
                info: null,
                goods_category: [],
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                cart: null,
                goods_count: 0,
                data_base: null,
                favor_user: [],
                tablecode: null,
                category: [],
                goods_list: [],
                search_keywords_value: '',
                nav_active_index: -1,
                nav_active_item_index: -1,
                cart_status: false,
                popup_spec_status: false,
                goods_choose_data: {},
                header_service_status: false,
                // 收藏信息
                favor_info: {
                    text: '收藏',
                    status: 0,
                    count: 0,
                },
                // 用户位置信息
                user_location: null,
                // 自定义分享信息
                share_info: {},
                // 是否单页预览
                is_single_page: app.globalData.is_current_single_page() || 0,
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                is_realstore_top_search_scan: app.globalData.data.is_realstore_top_search_scan || 0,
                // 临时操作数据
                temp_opt_data: null,
                themeColor: app.globalData.get_theme_color(),
            };
        },

        components: {
            componentNavBack,
            componentGoodsBuy,
            componentNoData,
            componentSearch,
            componentBadge,
            componentPopup,
            componentCartParaCurve,
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: app.globalData.launch_params_handle(params),
                user: app.globalData.get_user_cache_info(),
            });
        },

        onShow() {
            // 类型选择
            this.setData({
                buy_use_type_index: this.get_buy_use_type_index(),
            });

            // 用户位置初始化
            this.user_location_init();

            // 获取数据
            this.get_detail_init();

            // 初始化配置
            this.init_config();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
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

            // 获取数据-初始化
            get_detail_init() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'detail', 'realstore'),
                    method: 'POST',
                    data: this.request_params_merge(
                        {
                            id: ((this.info || null) == null) ? (this.params.id || 0) : (this.info.id || 0),
                        },
                        'init'
                    ),
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            // 门店数据
                            var data = res.data.data;
                            // 桌码
                            var tablecode = data.tablecode || null;
                            // 内容其他高度
                            var content_other_height = '364rpx';
                            // #ifdef H5
                            content_other_height = '376rpx';
                            // #endif
                            this.setData({
                                data_base: data.base || null,
                                info: data.info || null,
                                goods_category: data.goods_category || [],
                                favor_user: data.favor_user || [],
                                tablecode: tablecode,
                                content_style: 'height: calc(100vh - '+content_other_height+' - '+this.status_bar_height+'px - '+(tablecode == null ? '0rpx' : '44rpx')+');',
                            });

                            // 下单类型是否存在索引
                            this.setData({
                                buy_use_type_index: this.get_buy_use_type_index(),
                            });

                            // 收藏处理
                            if ((this.info || null) != null) {
                                // 收藏信息
                                var status = this.favor_user.indexOf(this.info.id) != -1 ? 1 : 0;
                                this.setData({
                                    favor_info: {
                                        count: this.info.favor_count || 0,
                                        status: status,
                                        text: (status == 1 ? '已' : '') + '收藏',
                                    },
                                });

                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.info.seo_title || this.info.name,
                                        desc: this.info.seo_desc || this.info.describe,
                                        path: '/pages/plugins/realstore/detail/detail',
                                        query: 'id=' + this.info.id,
                                        img: this.info.logo,
                                    },
                                });

                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.info.name,
                                });

                                // 获取数据、仅首次调用
                                // 获取列表接口和购物车
                                if (this.is_first == 1) {
                                    this.get_data_list();
                                    this.get_cart_data(this.is_first);
                                    this.setData({
                                        is_first: 0,
                                    });
                                } else {
                                    // 非首次赋值购物车数据
                                    this.setData({
                                        cart: data.cart || null,
                                    });
                                    // 购物车更新列表数据处理
                                    this.cart_data_list_handle();
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
                            data_list_loding_msg: '网络开小差了哦~',
                        });
                        app.globalData.showToast('网络开小差了哦~');
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

                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                    mask: true,
                });

                // 分类id
                var temp_category = this.goods_category;
                if (this.nav_active_item_index != -1) {
                    var category_id = temp_category[this.nav_active_index]['items'][this.nav_active_item_index]['id'];
                } else {
                    var category_id = this.nav_active_index == -1 ? 0 : temp_category[this.nav_active_index]['id'];
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'detail', 'realstore'),
                    method: 'POST',
                    data: this.request_params_merge(
                        {
                            id: this.info.id || 0,
                            page: this.data_page,
                            keywords: this.search_keywords_value,
                            category_id: category_id,
                        },
                        'data'
                    ),
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
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
                                    data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
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
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '网络开小差了哦~',
                            data_is_loading: 0,
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 收藏事件
            favor_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'favor_event');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: '/pages/login/login?event_callback=favor_event',
                        });
                        return false;
                    } else {
                        uni.showLoading({
                            title: '处理中...',
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
                                app.globalData.showToast('网络开小差了哦~');
                            },
                        });
                    }
                }
            },

            // 列表数据操作
            buy_number_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this);
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: '/pages/login/login?event_callback=buy_number_event',
                        });
                        return false;
                    } else {
                        var index = e.currentTarget.dataset.index;
                        var type = parseInt(e.currentTarget.dataset.type) || 0;
                        var temp_goods = this.data_list[index];
                        this.setData({
                            goods_choose_data: temp_goods,
                        });

                        // 是否存在多规格
                        if ((temp_goods.is_exist_many_spec || 0) != 0) {
                            // 是否购物车中操作
                            if (type == 0) {
                                this.setData({
                                    cart_status: true,
                                });
                                app.globalData.showToast('不同规格的商品需在购物车减购');
                            } else {
                                if ((this.$refs.goods_buy || null) != null) {
                                    var buy_params = this.params;
                                    buy_params['buy_event_type'] = 'cart';
                                    buy_params['buy_use_type_index'] = this.buy_use_type_index;
                                    buy_params['realstore_id'] = this.info.id;
                                    this.$refs.goods_buy.init(temp_goods, buy_params);
                                }
                            }
                            return false;
                        }

                        // 数据操作处理
                        this.buy_number_event_handle(e, type, temp_goods);
                    }
                }
            },

            // 加入购物车成功回调
            goods_cart_back_event(e) {
                // 重新获取购物车数据
                this.get_cart_data();
            },

            // 列表数量事件处理
            buy_number_event_handle(e, type, goods, spec = '') {
                var res = this.buy_number_handle(type, goods, 'buy_number');
                if (res === false) {
                    return false;
                }

                // 数据临时记录
                this.setData({
                    temp_opt_data: {
                        pos: e,
                        goods: goods,
                        type: type,
                    },
                });

                // 为0或减操作则查询
                var cart_item = null;
                if (type == 0 || (type == 1 && goods['buy_number'] > 0)) {
                    var cart_data = this.cart.data;
                    var params_spec = (spec || null) == null || typeof spec != 'object' ? '' : JSON.stringify(spec);
                    for (var i in cart_data) {
                        if (goods['id'] == cart_data[i]['goods_id']) {
                            var cart_spec = (cart_data[i]['spec'] || null) == null || typeof cart_data[i]['spec'] != 'object' ? '' : JSON.stringify(cart_data[i]['spec']);
                            if (type == 0 || (type == 1 && cart_spec == params_spec)) {
                                cart_item = cart_data[i];
                            }
                            break;
                        }
                    }
                }

                // 操作类型
                if (res == 0) {
                    if (cart_item == null) {
                        app.globalData.showToast('购物车id有误');
                        return false;
                    }
                    this.cart_delete(cart_item.id);
                } else if (cart_item == null) {
                    this.cart_save(goods['id'], res, spec);
                } else {
                    var number = type == 0 ? parseInt(cart_item['stock']) - res : res + parseInt(cart_item['stock']);
                    this.cart_update(cart_item.id, goods['id'], number);
                }
                return true;
            },

            // 购物车抛物线动画
            cart_para_curve_handle() {
                if ((this.temp_opt_data || null) != null && (this.temp_opt_data.type || 0) == 1) {
                    if ((this.$refs.cart_para_curve || null) != null) {
                        var self = this;
                        uni.createSelectorQuery()
                            .select('.botton-nav .cart')
                            .boundingClientRect()
                            .exec(function (res) {
                                self.$refs.cart_para_curve.init(res, self.temp_opt_data.pos, self.temp_opt_data.goods.images);
                            });
                    }
                }
            },

            // 购物车数量操作
            cart_buy_number_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this);
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: '/pages/login/login?event_callback=cart_buy_number_event',
                        });
                        return false;
                    } else {
                        var index = e.currentTarget.dataset.index;
                        var type = parseInt(e.currentTarget.dataset.type) || 0;
                        var temp_data = this.cart.data;
                        var temp_goods = temp_data[index];

                        // 数据操作处理
                        var res = this.buy_number_handle(type, temp_goods, 'stock');
                        if (res === false) {
                            return false;
                        }

                        // 数据临时记录
                        this.setData({
                            temp_opt_data: {
                                pos: e,
                                goods: temp_goods,
                                type: type,
                            },
                        });

                        // 操作类型
                        if (res == 0) {
                            this.cart_delete(temp_goods['id']);
                        } else {
                            var number = type == 0 ? parseInt(temp_goods['stock']) - res : res + parseInt(temp_goods['stock']);
                            this.cart_update(temp_goods['id'], temp_goods['goods_id'], number);
                        }
                    }
                }
            },

            // 批量删除操作
            cart_all_delete_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '挑了这么久，真的要清空吗？',
                    confirmText: '确认',
                    cancelText: '暂不',
                    success: (result) => {
                        if (result.confirm) {
                            var ids = [];
                            var temp_data = this.cart.data;
                            for (var i in temp_data) {
                                ids.push(temp_data[i]['id']);
                            }
                            this.cart_delete(ids.join(','));
                            this.setData({
                                cart_status: !this.cart_status,
                            });
                        }
                    },
                });
            },

            // 数量操作处理
            buy_number_handle(type, goods, buy_number_field) {
                // 门店状态
                if (type == 1 && !this.is_status_check()) {
                    return false;
                }

                // 加减处理
                var buy_number = parseInt(goods[buy_number_field]) || 0;
                if (type == 0) {
                    buy_number -= 1;
                } else {
                    buy_number += 1;
                }
                if (buy_number < 0) {
                    buy_number = 0;
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
                if (min > 0) {
                    if (type == 0) {
                        if (buy_number < min) {
                            buy_number = 0;
                        }
                    } else {
                        if (buy_number < min) {
                            buy_number = min;
                        }
                    }
                }

                // 最大购买数量
                var max = spec_buy_max_number > 0 ? spec_buy_max_number : buy_max_number;
                if (max > 0 && buy_number > max) {
                    buy_number = max;
                    app.globalData.showToast('限购' + max + inventory_unit);
                    return false;
                }

                // 数量是否改变
                if (goods[buy_number_field] == buy_number) {
                    app.globalData.showToast('数量未改变');
                    return false;
                }

                // 操作数量
                var opt_number = 1;
                if (type == 0) {
                    if (buy_number <= 0) {
                        opt_number = 0;
                    }
                } else {
                    if (buy_number > goods['buy_number']) {
                        opt_number = buy_number - goods['buy_number'];
                    }
                }
                return opt_number;
            },

            // 购物车添加
            cart_save(goods_id, buy_number, spec = '') {
                uni.request({
                    url: app.globalData.get_request_url('save', 'cart'),
                    method: 'POST',
                    data: {
                        goods_id: goods_id,
                        stock: buy_number,
                        spec: spec,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.cart_para_curve_handle();
                            this.get_cart_data();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 购物车更新
            cart_update(cart_id, goods_id, buy_number) {
                uni.request({
                    url: app.globalData.get_request_url('stock', 'cart'),
                    method: 'POST',
                    data: {
                        id: cart_id,
                        goods_id: goods_id,
                        stock: buy_number,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.cart_para_curve_handle();
                            this.get_cart_data();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 购物车删除
            cart_delete(cart_id) {
                uni.request({
                    url: app.globalData.get_request_url('delete', 'cart'),
                    method: 'POST',
                    data: {
                        id: cart_id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.get_cart_data();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 获取购物车数据、参数是否首次请求
            get_cart_data(is_first = 0) {
                uni.request({
                    url: app.globalData.get_request_url('cartdata', 'detail', 'realstore'),
                    method: 'POST',
                    data: this.request_params_merge(
                        {
                            id: this.info.id || 0,
                        },
                        'cart'
                    ),
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.setData({
                                cart: res.data.data,
                            });
                            this.cart_data_list_handle();

                            // 首次判断是否需要开启购物车
                            if (is_first == 1 && (this.params.is_show_cart || 0) == 1) {
                                this.setData({
                                    cart_status: true,
                                });
                            }
                        } else {
                            app.globalData.showToast('请求失败，请重试！');
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 购物车更新列表数据处理
            cart_data_list_handle() {
                var temp_cart = this.cart || null;
                if (temp_cart != null) {
                    var temp_data_list = this.data_list;
                    if (temp_data_list.length > 0) {
                        for (var i in temp_data_list) {
                            temp_data_list[i]['buy_number'] = 0;
                            if (temp_cart.data.length > 0) {
                                for (var k in temp_cart.data) {
                                    if (temp_cart.data[k]['goods_id'] == temp_data_list[i]['id']) {
                                        temp_data_list[i]['buy_number'] += parseInt(temp_cart.data[k]['stock']);
                                    }
                                }
                            }
                        }
                    }
                    this.setData({
                        data_list: temp_data_list,
                    });
                }
            },

            // 门店状态判断
            is_status_check() {
                if ((this.info || null) == null) {
                    app.globalData.showToast('门店信息有误');
                    return false;
                } else {
                    if (this.info.status_info.status != 1) {
                        app.globalData.showToast(this.info.status_info.msg);
                        return false;
                    }
                }
                return true;
            },

            // 搜索事件
            search_button_event(e) {
                this.setData({
                    search_keywords_value: e || '',
                    data_page: 1,
                });
                this.reset_scroll();
                this.get_data_list(1);
            },

            // 搜索icon扫码事件、扫码商品id实现加入购物车
            search_icon_event(e) {
                var user = app.globalData.get_user_info(this);
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: '/pages/login/login?event_callback=cart_buy_number_event',
                        });
                        return false;
                    } else {
                        // 门店状态
                        if (!this.is_status_check()) {
                            return false;
                        }

                        // 调用扫码
                        var self = this;
                        uni.scanCode({
                            success: function (res) {
                                uni.showLoading({
                                    title: '处理中...',
                                    mask: true,
                                });
                                uni.request({
                                    url: app.globalData.get_request_url('scan', 'detail', 'realstore'),
                                    method: 'POST',
                                    data: self.request_params_merge(
                                        {
                                            value: res.result,
                                        },
                                        'buy'
                                    ),
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
                                                app.globalData.showToast('提交失败，请重试！');
                                            }
                                        }
                                    },
                                    fail: () => {
                                        uni.hideLoading();
                                        app.globalData.showToast('网络开小差了哦~');
                                    },
                                });
                            },
                        });
                    }
                }
            },

            // 购物车状态
            cart_event(e) {
                var bool = this.cart_status;
                if (this.cart.data.length > 0) {
                    bool = !bool;
                } else {
                    bool = false;
                }
                this.setData({
                    cart_status: bool,
                });
            },

            // 购物车结算
            buy_submit_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }

                // 门店状态
                if (!this.is_status_check()) {
                    return false;
                }

                // 获取购物车数据
                var ids = [];
                if ((this.cart || null) != null) {
                    var temp_data = this.cart.data || [];
                    for (var i in temp_data) {
                        ids.push(temp_data[i]['id']);
                    }
                }
                if (ids.length <= 0) {
                    app.globalData.showToast('请先选购商品');
                    return false;
                }

                // 起步价
                var starting_price = parseFloat(this.info.starting_price) || 0;
                if (starting_price > 0 && this.cart.total_price < starting_price) {
                    // 是否限制类型
                    var limit_type = this.info.starting_price_limit_type_list || [];
                    if (limit_type.length > 0) {
                        var buy_use_type = this.info.buy_use_type_list[this.buy_use_type_index];
                        if (limit_type.indexOf(buy_use_type['index']) != -1 || limit_type.indexOf(buy_use_type['index'].toString()) != -1) {
                            app.globalData.showToast(buy_use_type['name'] + '起步价' + starting_price + '元');
                            return false;
                        }
                    } else {
                        app.globalData.showToast('起步价' + starting_price + '元');
                        return false;
                    }
                }

                // 进入订单确认页面
                var data = this.request_params_merge(
                    {
                        buy_type: 'cart',
                        ids: ids.join(','),
                    },
                    'buy'
                );
                uni.navigateTo({
                    url: '/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))),
                });
            },

            // 剪切板
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },

            // 地图查看
            address_map_event(e) {
                var info = this.info;
                if (info.lat == 0 || info.lng == 0) {
                    app.globalData.showToast('地址有误');
                    return false;
                }

                // 打开地图
                var address = (info.province_name || '') + (info.city_name || '') + (info.county_name || '') + (info.address || '');
                app.globalData.open_location(info.lng, info.lat, info.name, address);
            },

            // 电话
            tel_event(e) {
                app.globalData.call_tel(this.info.service_tel || null);
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
                });
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

            // 地址信息初始化
            user_location_init() {
                var result = uni.getStorageSync(app.globalData.data.cache_userlocation_key) || null;
                var data = null;
                if (result != null) {
                    data = {
                        name: result.name || null,
                        address: result.address || null,
                        lat: result.latitude || null,
                        lng: result.longitude || null,
                    };
                }
                this.setData({
                    user_location: data,
                });
            },

            // 使用类型事件
            buy_use_type_event(e) {
                var self = this;
                uni.showActionSheet({
                    itemList: this.info.buy_use_type_list.map(function (v) {
                        return v.name;
                    }),
                    success: function (res) {
                        self.setData({
                            buy_use_type_index: res.tapIndex,
                            data_page: 1,
                        });
                        uni.setStorageSync(self.cache_buy_use_type_index_key, res.tapIndex);
                        self.reset_scroll();
                        self.get_data_list(1);
                        self.get_cart_data();
                    },
                });
            },

            // 获取使用类型数据索引、默认在店0
            get_buy_use_type_index() {
                var index = uni.getStorageSync(this.cache_buy_use_type_index_key);
                if ((this.info || null) != null) {
                    // 用户未设置类型则使用默认的
                    if (index === null || index === '') {
                        // 是否默认类型
                        if (this.info.default_buy_use_type != undefined && this.info.default_buy_use_type != -1) {
                            // 不在店铺设置的类型列表则默认0
                            var temp_index = null;
                            for (var i in this.info.buy_use_type_list) {
                                if (this.info.buy_use_type_list[i]['index'] == this.info.default_buy_use_type) {
                                    temp_index = i;
                                }
                            }
                            if (temp_index !== null) {
                                index = temp_index;
                            }
                        }
                    }

                    // 不在店铺设置的类型列表则默认0
                    if (this.info.buy_use_type_list[index] == undefined) {
                        index = 0;
                    }
                }
                return index || 0;
            },

            // 请求参数处理
            // 默认增加使用类型参数
            // 下单 buy / 初始化 init / 获取数据 data / 获取购物车 cart
            request_params_merge(data, type = 'init') {
                // 用户使用类型
                var index = this.buy_use_type_index;
                if ((this.info || null) != null && (this.info.buy_use_type_list || null) != null && this.info.buy_use_type_list.length > 0) {
                    if (this.info.buy_use_type_list[index] == undefined) {
                        index = 0;
                    }
                    data['buy_use_type_index'] = index;
                }

                // 初始化
                if (type == 'init') {
                    // 桌码
                    if ((this.params.tablecode_id || null) != null) {
                        data['tablecode_id'] = this.params.tablecode_id;
                    }
                }

                // 初始化、获取数据
                if (type == 'init' || type == 'data' || type == 'cart') {
                    // 用户选择的位置
                    var lng = 0;
                    var lat = 0;
                    if ((this.user_location || null) != null) {
                        lng = this.user_location.lng || 0;
                        lat = this.user_location.lat || 0;
                    }
                    data['lng'] = lng;
                    data['lat'] = lat;
                }

                // 提交订单
                if (type == 'buy') {
                    // 门店id
                    data['realstore_id'] = this.info.id;

                    // 桌码
                    if ((this.tablecode || null) != null) {
                        data['tablecode_id'] = this.tablecode.id;
                    }
                }

                return data;
            },

            // 商品url事件
            goods_url_event(e) {
                if(app.globalData.data.is_realstore_forbid_to_goods_detail != 1) {
                    app.globalData.url_event(e);
                }
            },

            // 客服服务事件
            header_service_event(e) {
                this.setData({
                    header_service_status: !this.header_service_status,
                });
            },
        },
    };
</script>
<style>
    @import './detail.css';
</style>
