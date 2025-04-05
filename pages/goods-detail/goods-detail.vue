<template>
    <view :class="theme_view">
        <!-- 顶部导航 -->
        <view v-if="goods != null" :class="'page ' + (is_single_page == 1 ? ' single-page-top' : '')">
            <!-- 单页模式不展示导航栏 -->
            <block v-if="is_single_page == 0">
                <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
                <!-- 小导航 -->
                <view class="top-nav-left-icon pf" :style="'top:' + top_nav_icon_top_value + 'px;'">
                    <uni-icons type="arrowleft" size="22" color="#333" class="icon round cp" @tap="top_nav_left_back_event"></uni-icons>
                    <uni-icons v-if="nav_more_list.length > 0" type="list" size="20" color="#333" class="icon round cp margin-left-lg" @tap="top_nav_left_more_event"></uni-icons>
                </view>
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU || H5 || APP -->
                <!-- 更多导航 -->
                <view v-if="nav_more_list.length > 0 && nav_more_status" class="nav-more-view tc" :style="'top:' + top_nav_more_top_value + 'px;'">
                    <view class="triangle dis-inline-block pa"></view>
                    <view class="content radius padding-horizontal-main">
                        <block v-for="(item, index) in nav_more_list" :key="index">
                            <view class="item padding-main cp" :data-value="item.url" data-type="1" @tap="nav_more_event">
                                <view class="va-m dis-inline-block">
                                    <uni-icons :type="item.icon" size="16" color="#fff"></uni-icons>
                                </view>
                                <text class="cr-white va-m margin-left-sm">{{ item.name }}</text>
                            </view>
                        </block>
                    </view>
                </view>
                <!-- 顶部导航 -->
                <block v-if="(top_nav_title_data || null) != null && top_nav_title_data.length > 0">
                    <component-trn-nav :propScroll="scroll_value" :propHeight="top_nav_height">
                        <view class="top-nav padding-bottom padding-horizontal-main pr">
                            <view class="top-nav-content tc">
                                <block v-for="(item, index) in top_nav_title_data" :key="index">
                                    <text :class="'cp ' + (top_nav_title_index == index ? 'nav-active border-color-main' : '')" :data-index="index" :data-value="item.ent" @tap="top_nav_title_event">{{ item.name }}</text>
                                </block>
                            </view>
                        </view>
                    </component-trn-nav>
                </block>
                <!-- #endif -->
            </block>

            <!-- 相册 -->
            <view class="goods-photo bg-white oh pr" v-if="goods_photo.length > 0" :style="'height: ' + photo_height + ' !important;'">
                <!-- 视频 -->
                <block v-if="(goods.video || null) != null">
                    <view v-if="goods_video_is_autoplay" class="goods-video pa tc">
                        <video :src="goods.video" :autoplay="goods_video_is_autoplay" :show-center-play-btn="true" :controls="false" :show-play-btn="false" :enable-progress-gesture="false" :show-fullscreen-btn="false" :style="'height: ' + photo_height + ' !important;'"></video>
                    </view>
                    <view class="goods-video-submit pa">
                        <image v-if="!goods_video_is_autoplay" class="goods-video-play cp" @tap="goods_video_play_event" :src="common_static_url + 'video-play-icon.png'" mode="aspectFit"></image>
                        <image v-if="goods_video_is_autoplay" class="goods-video-close cp" @tap="goods_video_close_event" :src="common_static_url + 'video-close-icon.png'" mode="aspectFit"></image>
                    </view>
                </block>
                <!-- 相册内容 -->
                <swiper :indicator-dots="indicator_dots" :indicator-color="indicator_color" :indicator-active-color="indicator_active_color" :autoplay="autoplay" :circular="circular" class="swiper" :style="'height: ' + photo_height + ' !important;'">
                    <block v-for="(item, index) in goods_photo" :key="index">
                        <swiper-item>
                            <image class="swiper-item wh-auto" @tap="goods_photo_view_event" :data-index="index" :src="item.images" mode="scaleToFill" :style="'height: ' + photo_height + ' !important;'"></image>
                        </swiper-item>
                    </block>
                </swiper>
                <!-- 标签插件 -->
                <view v-if="(plugins_label_data || null) != null && plugins_label_data.data.length > 0" :class="'plugins-label oh pa plugins-label-' + ((plugins_label_data.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img') + ' plugins-label-' + (plugins_label_data.base.user_goods_show_style || 'top-left')">
                    <block v-for="(lv, li) in plugins_label_data.data" :key="li">
                        <view class="lv dis-inline-block va-m" :data-value="(plugins_label_data.base.is_user_goods_label_url || 0) == 1 ? lv.url || '' : ''" @tap="url_event">
                            <view v-if="(plugins_label_data.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="('background-color:'+(lv.bg_color || '#666'))+' !important;'+('color:'+(lv.text_color || '#fff'))+' !important;'">{{ lv.name }}</view>
                            <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                        </view>
                    </block>
                </view>
            </view>

            <!-- 价格信息 -->
            <view class="goods-base-price bg-white oh spacing-mb" :class="plugins_seckill_is_valid ? 'goods-base-price-countdown' : ''">
                <!-- 批发规则、未隐藏商品售价的时候独立行展示 -->
                <block v-if="(plugins_wholesale_data || null) != null && (plugins_wholesale_data.is_hide_goods_price || 0) != 1">
                    <component-wholesale-rules :propIsPopup="true" :propCurrencySymbol="currency_symbol" :propData="plugins_wholesale_data" :propIsAlone="true"></component-wholesale-rules>
                </block>
                <!-- 价格 -->
                <view class="price-content padding-vertical-main padding-left-main bs-bb fl" :style="plugins_seckill_is_valid ? 'background-image: url(' + plugins_seckill_data.goods_detail_header + ')' : ''">
                    <!-- 批发插件是否开启隐藏价格信息 -->
                    <block v-if="(plugins_wholesale_data || null) == null || (plugins_wholesale_data.is_hide_goods_price || 0) != 1">
                        <!-- 售价 -->
                        <view v-if="(goods.show_field_price_status || 0) == 1" class="item single-text">
                            <!-- 图标 -->
                            <text v-if="(show_field_price_text || null) != null" :class="'price-icon round va-m margin-right-xs '+((plugins_seckill_is_valid) ? 'seckill' : '')">{{ show_field_price_text }}</text>
                            <!-- 售价 -->
                            <text class="sales-price va-m">{{ goods.show_price_symbol }}{{ goods_spec_base_price }}</text>
                            <text class="sales-price-unit text-size-xs cr-grey va-m">{{ goods.show_price_unit }}</text>
                        </view>
                        <!-- 原价 -->
                        <view v-if="(goods.show_field_original_price_status || 0) == 1 && (goods_spec_base_original_price || null) != null && goods_spec_base_original_price != 0" class="item original-price single-text">{{ goods.show_original_price_symbol }}{{ goods_spec_base_original_price }}{{ goods.show_original_price_unit }}</view>
                        <!-- 积分兑换 -->
                        <view v-if="(goods.plugins_points_data || null) != null && (goods.plugins_points_data.is_goods_detail_show || 0) == 1" class="item">
                            <text class="points-price-value text-size-lg cr-base va-m">{{ goods.plugins_points_data.points_value }}</text>
                            <text class="points-price-unit text-size-xs cr-grey va-m margin-left-xs">{{goods.plugins_points_data.points_unit}}</text>
                        </view>
                    </block>
                    <block v-else>
                        <!-- 批发开启了隐藏价格，则价格容器这里展示批发价格信息 -->
                        <component-wholesale-rules :propIsPopup="true" :propCurrencySymbol="currency_symbol" :propData="plugins_wholesale_data"></component-wholesale-rules>
                    </block>
                </view>
                <block v-if="plugins_seckill_is_valid">
                    <view class="countdown-content padding-top-lg padding-bottom-lg padding-left-xs padding-right-xs fr tc">
                        <view class="time-title cr-white single-text">{{ plugins_seckill_data.goods_detail_title || $t('goods-detail.goods-detail.775ppk') }}</view>
                        <component-countdown
                            :propHour="plugins_seckill_data.time.hours"
                            :propMinute="plugins_seckill_data.time.minutes"
                            :propSecond="plugins_seckill_data.time.seconds"
                            :propMsecShow="true"
                            propTimeSize="32"
                            propTimePadding="0"
                            propTimeWeight="bold"
                            propTimeBackgroundColor="transparent"
                            propTimeColor="#ffe500"
                            propDsColor="#fff"
                        ></component-countdown>
                    </view>
                </block>
                <block v-else>
                    <!-- 右侧操作 -->
                    <view class="goods-base-right-opt padding-top-lg padding-bottom-lg padding-left-xs padding-right-main fr oh">
                        <!-- 收藏 -->
                        <view class="collect tc cp fr margin-left" @tap="goods_favor_event">
                            <image :src="common_static_url + 'favor' + (nav_favor_button_info.status == 1 ? '-active' : '') + '-icon.png'" mode="scaleToFill" class="dis-block auto"></image>
                            <view :class="'cr-grey text-size-xs ' + (nav_favor_button_info.status == 1 ? 'cr-main' : 'cr-grey')">{{ nav_favor_button_info.text }}</view>
                        </view>
                        <!-- 分享 -->
                        <view class="goods-share tc cp fr" @tap="popup_share_event">
                            <image :src="common_static_url + 'share-icon.png'" mode="scaleToFill" class="dis-block auto"></image>
                            <view class="cr-grey text-size-xs">{{$t('common.share')}}</view>
                        </view>
                    </view>
                </block>
            </view>

            <view class="padding-horizontal-main">
                <!-- 基础信息 -->
                <view class="goods-base-content border-radius-main bg-white spacing-mb">
                    <view class="padding-main">
                        <view class="goods-title-content oh flex-row jc-sb align-c">
                            <!-- 标题容器 -->
                            <view class="goods-title flex-1 flex-width" :style="'color:' + goods.title_color">
                                <!-- icon -->
                                <block v-if="(goods.plugins_view_icon_data || null) != null && goods.plugins_view_icon_data.length > 0">
                                    <block v-for="(item, index) in goods.plugins_view_icon_data" :key="index">
                                        <text
                                            v-if="(item.name || null) != null"
                                            class="goods-title-icon-item va-m radius text-size-xs margin-right-xs"
                                            :style="((item.br_color || null) == null ? '' : 'border:1px solid ' + item.br_color + ';') + ((item.bg_color || null) == null ? '' : 'background: ' + item.bg_color + ';') + '' + ((item.color || null) == null ? '' : 'color: ' + item.color + ';')"
                                            :data-value="item.url || ''"
                                            @tap="url_event">{{ item.name }}</text>
                                    </block>
                                </block>
                                <!-- 标题 -->
                                <text class="va-m">{{ goods.title }}</text>
                            </view>
                            <view v-if="(plugins_seckill_data || null) !== null" class="flex-row align-c padding-left-main">
                                <!-- 分享 -->
                                <view class="goods-share tc cp" @tap="popup_share_event">
                                    <image :src="common_static_url + 'share-icon.png'" mode="scaleToFill" class="dis-block auto"></image>
                                    <view class="cr-grey text-size-xs">{{$t('common.share')}}</view>
                                </view>
                                <!-- 收藏 -->
                                <view class="collect tc cp margin-left-xxxl" @tap="goods_favor_event">
                                    <image :src="common_static_url + 'favor' + (nav_favor_button_info.status == 1 ? '-active' : '') + '-icon.png'" mode="scaleToFill" class="dis-block auto"></image>
                                    <view :class="'cr-grey text-size-xs ' + (nav_favor_button_info.status == 1 ? 'cr-main' : 'cr-grey')">{{ nav_favor_button_info.text }}</view>
                                </view>
                            </view>
                        </view>
                        <!-- 简述 -->
                        <view v-if="(goods.simple_desc || null) != null" class="cr-red text-size-xs margin-top-sm">{{ goods.simple_desc }}</view>
                    </view>

                    <!-- 基础总计数据 -->
                    <view v-if="(goods.show_sales_number_status || 0) == 1 || (goods.show_inventory_status || 0) == 1" class="br-t padding-main">
                        <view class="text-size-xs flex-row jc-sb">
                            <view v-if="(goods.show_inventory_status || 0) == 1">
                                <text class="cr-grey">{{$t('goods-detail.goods-detail.1s79t4')}}</text>
                                <text class="cr-main padding-left-sm">{{ goods.inventory }}</text>
                            </view>
                            <view>
                                <text class="cr-grey">{{$t('goods-category.goods-category.283ot0')}}</text>
                                <text class="cr-main padding-left-sm">{{ goods.access_count }}</text>
                            </view>
                            <view v-if="(goods.show_sales_number_status || 0) == 1">
                                <text class="cr-grey">{{$t('goods-category.goods-category.at5p35')}}</text>
                                <text class="cr-main padding-left-sm">{{ goods.sales_count }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 面板提示信息 -->
                <view v-if="(goods.plugins_view_panel_data || null) != null && goods.plugins_view_panel_data.length > 0" class="goods-panel-container oh border-radius-main padding-horizontal-main padding-top-xs padding-bottom-xs bg-white text-size-xs spacing-mb">
                    <block v-for="(item, index) in goods.plugins_view_panel_data" :key="index">
                        <view v-if="(item || null) != null">{{ item }}</view>
                    </block>
                </view>

                <!-- 智能工具-基础提示信息 -->
                <view v-if="(plugins_intellectstools_data || null) != null && (plugins_intellectstools_data.base_bottom || null) != null && (plugins_intellectstools_data.base_bottom.msg || null) != null" class="plugins-intellectstools-base-bottom-container spacing-mb">
                    <view class="notice-content text-size-xs">
                        <view class="va-m dis-inline-block margin-right-xs">
                            <uni-icons type="notification" size="32rpx" color="#dd514c"></uni-icons>
                        </view>
                        <text v-if="(plugins_intellectstools_data.base_bottom.title || null) != null" class="fw-b">{{ plugins_intellectstools_data.base_bottom.title }}</text>
                        <view>{{ plugins_intellectstools_data.base_bottom.msg }}</view>
                    </view>
                </view>

                <!-- 优惠券 -->
                <view v-if="(plugins_coupon_data || null) != null && plugins_coupon_data.data.length > 0" class="plugins-coupon-container-view pr oh padding-main border-radius-main bg-white text-size-xs spacing-mb flex-row jc-sb align-c">
                    <view class="item-title padding-right-main self-c">{{$t('goods-detail.goods-detail.w3jma9')}}</view>
                    <view class="flex-row align-c flex-1 flex-width">
                        <view class="margin-right-main cp flex-1 flex-width flex-row coupon-srcoll">
                            <block v-for="(item, index) in plugins_coupon_data.data" :key="index">
                                <view class="coupon-padding margin-right-xs">
                                    <view class="oh">
                                        <view class="item margin-vertical-xs mini-coupon flex-row flex-nowrap" :class="item.status_type === 2 ? 'received-coupon mini-coupon-br' : 'not-received-coupon'">
                                            <text class="nowrap" @tap="popup_coupon_event">{{ item.desc || item.name }}</text>
                                            <text class="dis-inline-block nowrap margin-left-sm padding-left-sm divider-l" @tap="coupon_receive_event(index, item.id)">{{ item.status_operable_name }}</text>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                        <view @tap="popup_coupon_event">
                            <text class="text-size-xs cr-grey-9">{{$t('user-order-detail.user-order-detail.423rmr')}}{{ plugins_coupon_data.data.length }}{{$t('buy.buy.5iuqow')}}</text>
                            <iconfont name="icon-arrow-right" color="#999" propClass="va-m"></iconfont>
                        </view>
                    </view>
                </view>

                <!-- 规格选择 -->
                <view v-if="!plugins_realstore_cart_nav_status && goods.is_exist_many_spec == 1 && (buy_button || null) != null && (buy_button.is_buy || 0) + (buy_button.is_cart || 0) + (buy_button.is_show || 0) > 0" class="spec-container-view oh padding-horizontal-main padding-main border-radius-main bg-white text-size-xs spacing-mb">
                    <view class="fl item-title">{{$t('goods-detail.goods-detail.u401fi')}}</view>
                    <view class="fr column-right-view border-radius-main single-text cp" @tap="nav_buy_submit_event" :data-type="(buy_button.is_buy || 0) == 1 ? 'buy' : (buy_button.is_cart || 0) == 1 ? 'cart' : 'spec-show'">
                        <text class="text-size-xs cr-grey-9">{{ goods_spec_selected_text }}</text>
                        <iconfont name="icon-arrow-right" color="#999" propClass="va-m"></iconfont>
                    </view>
                </view>
            </view>

            <view class="padding-horizontal-main">
                <!-- 商品基础参数 -->
                <view v-if="(goods.parameters || null) != null && (goods.parameters.base || null) != null && goods.parameters.base.length > 0" class="goods-parameters parameters-base border-radius-main padding-main bg-white text-size-xs spacing-mb flex-row jc-sb align-c" @tap="popup_params_event" data-value="base">
                    <view class="single-text padding-right-main flex-1 flex-width">
                        <block v-for="(item, index) in goods.parameters.base" :key="index">
                            <text v-if="index > 0">，</text>
                            <text>{{ item.value }}</text>
                        </block>
                    </view>
                    <iconfont name="icon-arrow-right" color="#999"></iconfont>
                </view>

                <!-- 商品服务 -->
                <view v-if="(plugins_goodsservice_data || null) != null && plugins_goodsservice_data.length > 0" class="plugins-goodsservice-view-container border-radius-main padding-main bg-white text-size-xs spacing-mb flex-row jc-sb align-c" @tap="popup_goodsservice_event">
                    <view class="padding-right-main single-text border-radius-right-main flex-1 flex-width">
                        <block v-for="(item, index) in plugins_goodsservice_data" :key="index">
                            <view :class="'item dis-inline-block ' + (index > 0 ? 'margin-left-xxl' : '')">
                                <image class="va-m radius" :src="item.images" mode="widthFix"></image>
                                <text class="cr-base va-m margin-left-sm">{{ item.name }}</text>
                            </view>
                        </block>
                    </view>
                    <iconfont name="icon-arrow-right" color="#999" propClass="va-m"></iconfont>
                </view>

                <!-- 组合搭配 -->
                <block v-if="plugins_binding_data != null">
                    <component-binding-detail-list :propData="plugins_binding_data" :propLabel="plugins_label_data"></component-binding-detail-list>
                </block>

                <!-- 门店 -->
                <view v-if="plugins_realstore_data != null && ((plugins_realstore_data.data || null) != null) && plugins_realstore_data.data.length > 0" class="plugins-realstore-container">
                    <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                        <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{$t('goods-detail.goods-detail.317jp2')}}</text>
                        <text :data-value="'/pages/plugins/realstore/search/search?goods_id='+goods.id" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{$t('common.more')}}</text>
                    </view>
                    <component-realstore-list :propData="{...{data: plugins_realstore_data.data}, ...{random: random_value}}" :propRealstoreDetailQuery="'&source_goods_id='+goods.id" :propIsFavor="false"></component-realstore-list>
                </view>

                <!-- 多商户 -->
                <block v-if="plugins_shop_data != null">
                    <component-shop-list :propData="{...{data: [plugins_shop_data]}, ...{random: random_value}}"></component-shop-list>
                </block>

                <!-- 商品评价 -->
                <view v-if="common_is_goods_detail_show_comments == 1" class="goods-comment spacing-mb">
                    <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                        <view class="title-left">
                            <text class="text-wrapper title-left-border">{{$t('goods-detail.goods-detail.znz76d')}}</text>
                            <text class="vice-name cr-grey">({{ goods.comments_count || 0 }})</text>
                        </view>
                        <text :data-value="'/pages/goods-comment/goods-comment?goods_id=' + goods.id" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{$t('goods-detail.goods-detail.1rqkjt')}}{{ (goods.comments_score || null) == null ? 0 : (goods.comments_score.rate || 0) }}%</text>
                    </view>
                    <view class="border-radius-main padding-main bg-white">
                        <!-- 商品数据 -->
                        <component-goods-comments :propData="goods.comments_data"></component-goods-comments>
                        <!-- 是否开启评论入口 -->
                        <view v-if="(plugins_intellectstools_data || null) !== null && (plugins_intellectstools_data.is_comments_add || 0) == 1">
                            <view data-value="/pages/plugins/intellectstools/goods-comments/goods-comments?goods_id=' + goods.id" @tap="url_event" class="cp">
                                <view class="br-t-e padding-top-main cr-base flex-row jc-c align-c">{{$t('goods-detail.goods-detail.6k7808')}}<iconfont name="icon-arrow-right" color="#666" propClass="margin-left-sm pr top-xs"></iconfont>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 问答 -->
                <view v-if="(plugins_ask_data || null) !== null && (plugins_ask_data.is_ask_add || 0) == 1" class="goods-comment spacing-mb">
                    <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                        <view class="title-left">
                            <text class="text-wrapper title-left-border">{{$t('goods-detail.goods-detail.k5u755')}}</text>
                            <text class="vice-name cr-grey">({{ plugins_ask_data.ask_total }})</text>
                        </view>
                        <text :data-value="'/pages/plugins/ask/goods-list/goods-list?goods_id=' + goods.id" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{$t('goods-detail.goods-detail.q8e577')}}</text>
                    </view>
                    <view class="border-radius-main padding-main bg-white">
                        <component-ask-comments-goods :propData="plugins_ask_data.ask_data"></component-ask-comments-goods>
                        <view :data-value="'/pages/plugins/ask/form/form?goods_id='+goods.id" @tap="url_event" class="cp">
                            <view class="br-t-e padding-top-main cr-base flex-row jc-c align-c">{{$t('goods-detail.goods-detail.7ulh8b')}}<iconfont name="icon-arrow-right" color="#666" propClass="pr top-sm margin-left-sm"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 智能工具-详情顶部提示信息 -->
                <view
                    v-if="(plugins_intellectstools_data || null) != null && (plugins_intellectstools_data.content_top || null) != null && (plugins_intellectstools_data.content_top.msg || null) != null && plugins_intellectstools_data.content_top.msg.length > 0"
                    class="plugins-intellectstools-content-top-container panel-item panel-item-only padding-main border-radius-main text-size-xs spacing-mb"
                >
                    <view v-if="(plugins_intellectstools_data.content_top.title || null) != null" class="panel-title padding-bottom-main fw-b text-size margin-bottom-main">
                        {{ plugins_intellectstools_data.content_top.title }}
                    </view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in plugins_intellectstools_data.content_top.msg" :key="index" class="item padding-top-sm padding-bottom-sm">
                            <view class="content">{{ item }}</view>
                        </view>
                    </view>
                </view>

                <!-- 商品详情参数 -->
                <view v-if="(goods.parameters || null) != null && (goods.parameters.detail || null) != null && goods.parameters.detail.length > 0" class="spacing-mb">
                    <view class="spacing-nav-title">
                        <text class="line"></text>
                        <text class="text-wrapper">{{$t('goods-detail.goods-detail.l7dzv2')}}</text>
                    </view>
                    <view class="goods-parameters border-radius-main padding-main bg-white">
                        <view class="content-item oh">
                            <view class="oh">
                                <block v-for="(item, index) in goods.parameters.detail" :key="index">
                                    <view v-if="index <= 3" class="item single-text cr-base text-size-xs">
                                        <text class="name">{{ item.name }}:</text>
                                        <text class="value">{{ item.value }}</text>
                                    </view>
                                </block>
                            </view>
                            <view class="tc margin-top-lg">
                                <text class="cr-grey text-size-xs" @tap="popup_params_event" data-value="detail">查看全部参数 >></text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 商品详情 -->
                <view class="goods-detail">
                    <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                        <text class="text-wrapper title-left-border">{{$t('goods-detail.goods-detail.2j44o2')}}</text>
                    </view>
                    <view class="border-radius-main oh bg-white">
                        <block v-if="(common_is_goods_detail_content_show_photo == 1 && goods_photo.length > 0) || (common_app_is_use_mobile_detail == 0 && (goods.content_web || null) != null) || (common_app_is_use_mobile_detail == 1 && goods_content_app.length > 0)">
                            <!-- 是否详情展示相册 -->
                            <block v-if="common_is_goods_detail_content_show_photo == 1 && goods_photo.length > 0">
                                <view v-for="(item, index) in goods_photo" :key="index" class="goods-detail-photo">
                                    <image v-if="(item.images || null) != null" @tap="goods_detail_images_view_event" :data-value="item.images" class="wh-auto dis-block" :src="item.images" mode="widthFix"></image>
                                </view>
                            </block>
                            <!-- web详情 -->
                            <view v-if="common_app_is_use_mobile_detail == 0 && (goods.content_web || null) != null" class="padding-main web-html-content">
                                <mp-html :content="goods.content_web" />
                            </view>
                            <!-- 手机独立详情 -->
                            <block v-if="common_app_is_use_mobile_detail == 1 && goods_content_app.length > 0">
                                <view v-for="(item, index) in goods_content_app" :key="index" class="goods-detail-app">
                                    <image v-if="(item.images || null) != null" @tap="goods_detail_images_view_event" :data-value="item.images" class="wh-auto dis-block" :src="item.images" mode="widthFix"></image>
                                    <view v-if="(item.content || null) != null" class="content-items">
                                        <view v-for="(items, index2) in item.content" :key="index2">{{ items }}</view>
                                    </view>
                                </view>
                            </block>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xxl padding-bottom-xxl">{{$t('goods-detail.goods-detail.27wudx')}}</view>
                        </block>
                    </view>
                </view>

                <!-- 猜你喜欢 -->
                <view v-if="guess_you_like.length > 0" class="padding-horizontal-main margin-top-main">
                    <view class="tc spacing-mb">
                        <view class="guess-like fw-b text-size-md">{{$t('goods-detail.goods-detail.v2974w')}}</view>
                    </view>
                    <div class="spacing-mt">
                        <component-goods-list :propData="{ style_type: 1, goods_list: guess_you_like }"  :propCurrencySymbol="currency_symbol"></component-goods-list>
                    </div>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 底部操作先展示加载 -->
            <block v-if="goods_bottom_nav_status">
                <view v-if="plugins_realstore_cart_nav_status || data_loading_status == 0" class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view class="item goods-buy-nav oh round bg-white flex-row jc-sb align-c padding-vertical-sm padding-horizontal-xs">
                            <button class="bg-white br-white round tc text-size-md wh-auto margin-horizontal-main cr-grey" type="default" :loading="true">{{ $t('realstore-cart.realstore-cart.50lf68') }}</button>
                        </view>
                    </view>
                </view>
                <block v-else>
                    <!-- 底部操作 -->
                    <view v-if="goods_bottom_opt_nav_status" class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <view class="item goods-buy-nav oh round bg-white flex-row jc-sb align-c padding-vertical-sm padding-horizontal-xs">
                                <!-- 左侧集合操作 -->
                                <view class="tc flex-row jc-sa align-c flex-width-half padding-right-sm">
                                    <!-- 是否指定返回操作 -->
                                    <view v-if="is_opt_back == 1" class="cp" @tap="bottom_nav_back_event">
                                        <image :src="common_static_url + 'back-icon.png'" mode="scaleToFill" class="image"></image>
                                        <text class="dis-block text-size-xs cr-grey">{{$t('common.return')}}</text>
                                    </view>
                                    <!-- 左侧购买导航列表 -->
                                    <block v-if="buy_left_nav.length > 0">
                                        <block v-for="(item, index) in buy_left_nav" :key="index">
                                            <!-- 不展示收藏 -->
                                            <block v-if="item.type != 'favor'">
                                                <!-- 客服 -->
                                                <block v-if="item.type == 'chat'">
                                                    <component-online-service
                                                        :propIsGoods="true"
                                                        :propIsNav="true"
                                                        :propCard="true"
                                                        :propTitle="goods.title"
                                                        :propImg="goods.images"
                                                        :propPath="'/pages/goods-detail/goods-detail?id=' + goods.id"
                                                        :propChatUrl="item.url || ''"
                                                    ></component-online-service>
                                                </block>
                                                <!-- 首页 -->
                                                <block v-else-if="item.type == 'home'">
                                                    <view v-if="is_opt_back != 1" class="cp" :data-value="item.url || default_home_url" :data-type="item.type" @tap="buy_left_nav_event">
                                                        <image :src="item.icon" mode="scaleToFill" class="image"></image>
                                                        <text class="dis-block text-size-xs cr-grey">{{ item.name }}</text>
                                                    </view>
                                                </block>
                                                <!-- 其他通用的 -->
                                                <block v-else>
                                                    <view class="cp" :data-value="item.url" :data-type="item.type" @tap="buy_left_nav_event">
                                                        <image :src="item.icon" mode="scaleToFill" class="image"></image>
                                                        <text class="dis-block text-size-xs cr-grey">{{ item.name }}</text>
                                                    </view>
                                                </block>
                                            </block>
                                        </block>
                                    </block>
                                    <!-- 购物车 -->
                                    <view v-if="is_opt_cart == 1" class="cp pr" data-value="/pages/cart-page/cart-page" @tap="url_event">
                                        <view class="badge-icon">
                                            <component-badge :propNumber="quick_nav_cart_count"></component-badge>
                                        </view>
                                        <image :src="common_static_url + 'cart-icon.png'" mode="scaleToFill" class="image"></image>
                                        <text class="dis-block text-size-xs cr-grey">{{$t('common.cart')}}</text>
                                    </view>
                                </view>
                                <!-- 右侧主操作 -->
                                <view :class="'btn-items flex-row jc-sa align-c flex-width-half goods-buy-nav-btn-number-' + (buy_button.count || 0)">
                                    <block v-if="(buy_button.data || null) != null && buy_button.data.length > 0">
                                        <block v-for="(item, index) in buy_button.data" :key="index">
                                            <block v-if="(item.name || null) != null && (item.type || null) != null">
                                                <button :class="'btn fl cr-white text-size-md round bg-' + ((item.color || 'main') == 'main' ? 'main' : 'main-pair')" type="default" @tap="nav_buy_submit_event" :data-type="item.type" :data-value="item.value || ''" :data-business="item.business || ''" hover-class="none">{{ item.name }}</button>
                                            </block>
                                        </block>
                                    </block>
                                    <button v-else class="btn fl round text-size-md cr-grey" type="default" hover-class="none" disabled>{{ buy_button.error }}</button>
                                </view>
                            </view>
                        </view>
                    </view>
                </block>
            </block>

            <!-- 商品参数弹窗 -->
            <component-popup :propShow="popup_params_status" propPosition="bottom" @onclose="popup_params_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_params_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="popup-params-container">
                        <block v-if="(goods.parameters || null) != null && (goods.parameters[popup_params_type_field] || null) != null && goods.parameters[popup_params_type_field].length > 0">
                            <block v-for="(item, index) in goods.parameters[popup_params_type_field]" :key="index">
                                <view class="item padding-vertical-main br-b oh">
                                    <view class="name fl br-r">{{ item.name }}</view>
                                    <view class="value fr">{{ item.value }}</view>
                                </view>
                            </block>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">{{$t('goods-detail.goods-detail.0gx41x')}}</view>
                        </block>
                    </view>
                </view>
            </component-popup>

            <!-- 优惠券弹层 -->
            <component-popup :propShow="popup_coupon_status" propPosition="bottom" @onclose="popup_coupon_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_coupon_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="plugins-coupon-container padding-bottom-main">
                        <block v-if="(plugins_coupon_data || null) != null && plugins_coupon_data.data.length > 0">
                            <block v-for="(item, index) in plugins_coupon_data.data" :key="index">
                                <component-coupon-card :propData="item" :propStatusType="item.status_type" :propStatusOperableName="item.status_operable_name" :propIndex="index" propIsProgress @call-back="coupon_receive_event"></component-coupon-card>
                            </block>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">{{$t('goods-detail.goods-detail.96y691')}}</view>
                        </block>
                    </view>
                </view>
            </component-popup>

            <!-- 门店弹层 -->
            <component-popup :propShow="popup_realstore_status" propPosition="bottom" @onclose="popup_realstore_close_event">
                <view class="padding-horizontal-main padding-top-main bg-grey-f5">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_realstore_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="plugins-realstore-popup">
                        <block v-if="(plugins_realstore_data || null) != null && ((plugins_realstore_data.data || null) != null) && plugins_realstore_data.data.length > 0">
                            <component-realstore-list :propData="{...{data: plugins_realstore_data.data}, ...{random: random_value}}" :propRealstoreDetailQuery="'&source_goods_id='+goods.id" :propIsFavor="false"></component-realstore-list>
                            <view class="tc margin-top-sm margin-bottom-lg">
                                <text :data-value="'/pages/plugins/realstore/search/search?goods_id='+goods.id" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{$t('common.more')}}{{$t('goods-detail.goods-detail.317jp2')}}</text>
                            </view>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">{{$t('goods-detail.goods-detail.gwwf19')}}</view>
                        </block>
                    </view>
                </view>
            </component-popup>

            <!-- 商品服务弹层 -->
            <component-popup :propShow="popup_goodsservice_status" propPosition="bottom" @onclose="popup_goodsservice_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_goodsservice_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="plugins-goodsservice-container">
                        <block v-if="(plugins_goodsservice_data || null) != null && plugins_goodsservice_data.length > 0">
                            <block v-for="(item, index) in plugins_goodsservice_data" :key="index">
                                <view :class="'item oh padding-vertical-main ' + (index > 0 ? 'br-t' : '')">
                                    <view class="fl left">
                                        <image class="dis-block radius" :src="item.images" mode="widthFix"></image>
                                    </view>
                                    <view class="fr right tl">
                                        <view class="cr-base fw-b text-size-sm">{{ item.name }}</view>
                                        <view class="cr-grey text-size-xs margin-top-xs">{{ item.describe }}</view>
                                    </view>
                                </view>
                            </block>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">{{$t('goods-detail.goods-detail.8ej346')}}</view>
                        </block>
                    </view>
                </view>
            </component-popup>

            <!-- 购买记录 -->
            <view v-if="(plugins_salerecords_tips_content || null) != null" :class="'plugins-salerecords-tips' + plugins_salerecords_tips_ent">
                <image mode="widthFix" :src="plugins_salerecords_tips_content.user.avatar" class="va-m br"></image>
                <text class="margin-left-sm">{{ plugins_salerecords_tips_content.tips }}</text>
            </view>
        </view>

        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" propPage="goods" :propIsHeader="true"></component-no-data>

        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>

        <!-- 商品购买 -->
        <component-goods-buy ref="goods_buy" :propParams="params" :propCurrencySymbol="currency_symbol" v-on:BackSuccessEvent="goods_buy_back_success_event" v-on:CartSuccessEvent="goods_cart_back_event" v-on:SpecChoiceEvent="goods_spec_back_event"></component-goods-buy>

        <!-- 商品批量下单 -->
        <component-goods-batch-buy ref="goods_batch_buy" v-on:BatchCartSuccessEvent="batch_goods_cart_back_event"></component-goods-batch-buy>

        <!-- 门店购物车 -->
        <component-realstore-cart ref="realstore_cart" :propStatus="plugins_realstore_cart_nav_status" v-on:BuyTypeSwitchEvent="refresh_loading_event" v-on:RefreshLoadingEvent="refresh_loading_event" :propCurrencySymbol="currency_symbol"></component-realstore-cart>

        <!-- 品类限制温馨提示 -->
        <block v-if="(plugins_categorylimit_data || null) != null">
            <component-categorylimit-warm-tips :propData="plugins_categorylimit_data"></component-categorylimit-warm-tips>
        </block>
        
        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentGoodsBatchBuy from '@/components/goods-batch-buy/goods-batch-buy';
    import componentPopup from '@/components/popup/popup';
    import componentBadge from '@/components/badge/badge';
    import componentTrnNav from '@/components/trn-nav/trn-nav';
    import componentCountdown from '@/components/countdown/countdown';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentOnlineService from '@/components/online-service/online-service';
    import componentRealstoreList from '@/pages/plugins/realstore/components/realstore-list/realstore-list';
    import componentShopList from '@/pages/plugins/shop/components/shop-list/shop-list';
    import componentBindingDetailList from '@/pages/plugins/binding/components/binding-detail-list/binding-detail-list';
    import componentSharePopup from '@/components/share-popup/share-popup';
    import componentGoodsComments from '@/pages/goods-detail/components/goods-comments/goods-comments';
    import componentAskCommentsGoods from '@/pages/plugins/ask/components/ask-comments-goods/ask-comments-goods';
    import componentCouponCard from '@/pages/plugins/coupon/components/coupon-card/coupon-card';
    import componentRealstoreCart from '@/components/realstore-cart/realstore-cart';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentWholesaleRules from '@/components/wholesale-rules/wholesale-rules';
    import componentCategorylimitWarmTips from '@/components/categorylimit-warm-tips/categorylimit-warm-tips';

    var common_static_url = app.globalData.get_static_url('common');
    var system_info = app.globalData.get_system_info() || {};
    var bar_height = parseInt(system_info.statusBarHeight || 0);
    var win_width = parseInt(system_info.windowWidth || system_info.screenWidth || 0);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                status_bar_height: bar_height,
                common_static_url: common_static_url,
                bottom_fixed_style: '',
                indicator_dots: false,
                indicator_color: 'rgba(0, 0, 0, .2)',
                indicator_active_color: '#666',
                autoplay: true,
                circular: true,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_loading_status: 0,
                params: null,
                system_info: system_info,
                photo_height: win_width <= 0 ? '55vh' : app.globalData.window_width_handle(win_width) + 'px',
                goods: null,
                guess_you_like: [],
                goods_photo: [],
                goods_specifications_choose: [],
                goods_content_app: [],
                popup_buy_status: false,
                buy_event_type: 'buy',
                buy_button: {},
                buy_left_nav: [],
                goods_spec_base_price: 0,
                goods_spec_base_original_price: 0,
                goods_spec_selected_text: this.$t('goods-detail.goods-detail.6brk57'),
                show_field_price_text: null,
                goods_video_is_autoplay: false,
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
                // 是否显示底部购买导航
                goods_bottom_nav_status: true,
                // 底部导航展示状态、如果已开启多门店默认展示、则先展示加载
                goods_bottom_opt_nav_status: app.globalData.get_config('plugins_base.realstore', null) == null,
                // 更多导航
                nav_more_status: false,
                nav_more_timer: null,
                nav_more_list: [],
                // 默认首页地址
                default_home_url: app.globalData.app_tabbar_pages()[0],
                // 导航收藏按钮
                nav_favor_button_info: {
                    text: this.$t('goods-detail.goods-detail.dco1sc'),
                    status: 0,
                },
                // 购物车快捷导航
                quick_nav_cart_count: 0,
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
                plugins_is_goods_detail_poster: 0,
                common_app_is_use_mobile_detail: 0,
                common_is_goods_detail_content_show_photo: 0,
                common_is_goods_detail_show_comments: 1,
                common_app_customer_service_tel: null,
                // 是否单页预览
                is_single_page: app.globalData.is_current_single_page() || 0,
                // 是否底部导航展示返回按钮
                is_opt_back: 0,
                // 是否开启购物车
                is_opt_cart: 1,
                // 滚动监听值
                scroll_value: 0,
                // 顶部导航信息
                // #ifdef MP || APP
                top_nav_icon_top_value: bar_height + 8,
                top_nav_more_top_value: bar_height + 48,
                // #endif
                // #ifdef H5
                top_nav_icon_top_value: 6,
                top_nav_more_top_value: 50,
                // #endif
                // #ifdef H5 || APP
                top_nav_right_icon_left_value: win_width <= 800 ? win_width - 40 : win_width - (win_width - 800) / 2 - 40,
                // #endif
                top_nav_height: 20,
                top_nav_title_index: 0,
                top_nav_title_scroll: true,
                top_nav_title_timer: null,
                top_nav_title_data: [],
                // 详情参数弹窗
                popup_params_status: false,
                popup_params_type_field: 'base',
                // 自定义分享信息
                share_info: {},
                // 限时秒杀插件
                plugins_seckill_data: null,
                plugins_seckill_is_valid: false,
                // 优惠劵插件
                plugins_coupon_data: null,
                temp_coupon_receive_index: null,
                temp_coupon_receive_value: null,
                popup_coupon_status: false,
                // 购买记录插件
                plugins_salerecords_data: null,
                plugins_salerecords_timer: null,
                plugins_salerecords_tips_content: null,
                plugins_salerecords_tips_ent: '',
                // 多商户插件
                plugins_shop_data: null,
                // 标签插件
                plugins_label_data: null,
                // 智能工具插件
                plugins_intellectstools_data: null,
                // 客服插件
                plugins_chat_data: null,
                // 门店插件
                plugins_realstore_data: null,
                plugins_realstore_cart_nav_status: false,
                popup_realstore_status: false,
                // 组合搭配插件
                plugins_binding_data: null,
                // 商品服务插件
                plugins_goodsservice_data: null,
                popup_goodsservice_status: false,
                // 商品批量下单插件
                plugins_batchbuy_data: null,
                // 问答插件
                plugins_ask_data: null,
                // 批发插件
                plugins_wholesale_data: null,
                // 品类限制插件
                plugins_categorylimit_data: null,
            };
        },

        components: {
            componentCommon,
            componentGoodsBuy,
            componentGoodsBatchBuy,
            componentPopup,
            componentBadge,
            componentCountdown,
            componentNoData,
            componentTrnNav,
            componentBottomLine,
            componentOnlineService,
            componentRealstoreList,
            componentShopList,
            componentBindingDetailList,
            componentSharePopup,
            componentGoodsComments,
            componentAskCommentsGoods,
            componentCouponCard,
            componentRealstoreCart,
            componentGoodsList,
            componentWholesaleRules,
            componentCategorylimitWarmTips
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params,
                // 是否自定义购买事件
                buy_event_type: params.opt_buy_event_type || 'buy',
                // 是否指定开启购买弹窗、默认0否、1是
                popup_buy_status: parseInt(params.is_opt_buy_status || 0) == 1,
                // 是否底部导航展示返回按钮
                is_opt_back: parseInt(params.is_opt_back || 0) == 1 && (app.globalData.data.is_goods_bottom_opt_back || 0) == 1 ? 1 : 0,
                // 是否自定义购物车状态
                is_opt_cart: params.is_opt_cart === undefined ? app.globalData.data.is_goods_bottom_opt_cart || 0 : parseInt(params.is_opt_cart || 0),
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init_config();

            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        // 页面销毁时执行
        onUnload: function () {
            clearInterval(this.plugins_salerecords_timer);
        },

        // 监听滚动
        onPageScroll(e) {
            // 位置记录
            var upd_data = { scroll_value: e.scrollTop };

            // 更多导航状态处理
            if (this.nav_more_status) {
                upd_data['nav_more_status'] = false;
                clearInterval(this.nav_more_timer);
            }
            this.setData(upd_data);

            // 顶部导航选中处理
            if (this.top_nav_title_scroll) {
                var self = this;
                var data = this.top_nav_title_data;
                var query = uni.createSelectorQuery();
                for (var i in data) {
                    query.select(data[i]['ent']).boundingClientRect();
                }
                query.exec(function (res) {
                    if((res || null) != null) {
                        var bar_h = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
                        var nav_h = self.top_nav_height;
                        var length = res.length - 1;
                        for (var i = length; i >= 0; i--) {
                            if((res[i] || null) != null) {
                                var temp = res[i]['top'] - bar_h - nav_h;
                                if (temp <= 0) {
                                    if (self.top_nav_title_index != i) {
                                        self.top_nav_title_index = i;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                });
            }
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        common_app_is_use_mobile_detail: app.globalData.get_config('config.common_app_is_use_mobile_detail'),
                        common_is_goods_detail_content_show_photo: app.globalData.get_config('config.common_is_goods_detail_content_show_photo'),
                        common_is_goods_detail_show_comments: app.globalData.get_config('config.common_is_goods_detail_show_comments'),
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                        plugins_is_goods_detail_poster: app.globalData.get_config('plugins_base.distribution.data.is_goods_detail_poster'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                // 缓存数据
                if((this.goods || null) == null) {
                    var goods = app.globalData.goods_data_cache_handle(this.params.id);
                    if(goods != null) {
                        this.init_result_data_handle(goods);
                    }
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('detail', 'goods'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var goods = data.goods;

                            // 商品数据
                            this.init_result_data_handle(goods);

                            // 基础数据
                            var plugins_seckill_data = data.plugins_seckill_data || null;
                            var upd_data = {
                                random_value: Math.random(),
                                data_loading_status: 1,
                                goods_bottom_nav_status: true,
                                goods_bottom_opt_nav_status: true,
                                guess_you_like: data.guess_you_like || [],
                                nav_more_list: data.nav_more_list || [],
                                buy_button: data.buy_button || null,
                                buy_left_nav: data.buy_left_nav || [],
                                top_nav_title_data: data.middle_tabs_nav || [],
                                plugins_seckill_data: plugins_seckill_data,
                                plugins_seckill_is_valid:  plugins_seckill_data != null && (plugins_seckill_data.time || null) != null && plugins_seckill_data.time.status == 1,
                                plugins_coupon_data: data.plugins_coupon_data || null,
                                quick_nav_cart_count: data.cart_total.buy_number || 0,
                                plugins_salerecords_data: data.plugins_salerecords_data || null,
                                plugins_shop_data: data.plugins_shop_data || null,
                                plugins_wholesale_data: (data.plugins_wholesale_data || null) == null ? null : data.plugins_wholesale_data,
                                plugins_label_data: (data.plugins_label_data || null) == null || (data.plugins_label_data.base || null) == null || (data.plugins_label_data.data || null) == null || data.plugins_label_data.data.length <= 0 ? null : data.plugins_label_data,
                                plugins_intellectstools_data: data.plugins_intellectstools_data || null,
                                plugins_chat_data: data.plugins_chat_data || null,
                                plugins_realstore_data: data.plugins_realstore_data || null,
                                plugins_binding_data: data.plugins_binding_data || null,
                                plugins_goodsservice_data: data.plugins_goodsservice_data || null,
                                plugins_batchbuy_data: data.plugins_batchbuy_data || null,
                                plugins_ask_data: data.plugins_ask_data || null,
                                plugins_categorylimit_data: data.plugins_categorylimit_data || null,
                            };
                            this.setData(upd_data);

                            // 如果已默认开启购买弹窗，库存为0则不开启
                            if (this.popup_buy_status && parseInt(goods.inventory) > 0) {
                                if ((this.$refs.goods_buy || null) != null) {
                                    this.$refs.goods_buy.init(this.goods, {...{buy_event_type: this.buy_event_type, buy_button: this.buy_button}, ...this.params});
                                }
                            }

                            // 是否展示门店购物车导航
                            if((this.plugins_realstore_data || null) != null && (this.$refs.realstore_cart || null) != null) {
                                // 当前门店信息
                                if((this.plugins_realstore_data.info || null) != null) {
                                    this.setData({
                                        plugins_realstore_cart_nav_status: true,
                                        goods_bottom_nav_status: false,
                                        goods_bottom_opt_nav_status: false,
                                    });
                                    this.$refs.realstore_cart.init({...{source: 'goods', base: this.plugins_realstore_data.base, info: this.plugins_realstore_data.info, realstore_goods_data: {...{buy_button: this.buy_button}, ...this.goods}}, ...this.params});
                                }

                                // 是否需要隐藏购物车
                                if(parseInt(this.plugins_realstore_data.is_hide_cart || 0) == 1) {
                                    this.setData({is_opt_cart: 0});
                                }
                            }

                            // 分享配置
                            var query = 'id=' + goods.id;
                            if((this.params.realstore_id || null) != null) {
                                query += '&realstore_id='+this.params.realstore_id;
                                if(this.params.buy_use_type_data_index !== undefined) {
                                    query += '&buy_use_type_data_index='+this.params.buy_use_type_data_index;
                                }
                            }
                            this.setData({
                                // 基础自定义分享
                                share_info: {
                                    title: goods.seo_title || goods.title,
                                    kds: goods.seo_keywords || goods.simple_desc,
                                    desc: goods.seo_desc || goods.simple_desc,
                                    path: '/pages/goods-detail/goods-detail',
                                    query: query,
                                    img: goods.share_images || goods.images,
                                    video: goods.video,
                                },
                            });

                            // 购买记录提示
                            this.plugins_salerecords_tips_handle();
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 初始化数据处理
            init_result_data_handle(goods) {
                // 价格字段
                var price_text_arr = [this.$t('goods-detail.goods-detail.bogx42'), this.$t('goods-category.goods-category.g2u3lf'), this.$t('goods-detail.goods-detail.3kdgjl')];
                // 相册处理
                var photo = goods.photo || [];
                if(photo.length == 0 && (goods.images || null) != null) {
                    photo.push({images: goods.images});
                }
                this.setData({
                    data_bottom_line_status: true,
                    data_list_loding_status: 3,
                    goods: goods,
                    indicator_dots: photo.length > 1,
                    autoplay: photo.length > 1,
                    goods_photo: photo,
                    goods_content_app: goods.content_app || [],
                    nav_favor_button_info: {
                        text: (goods.user_is_favor == 1 ? this.$t('goods-detail.goods-detail.by7052') : '') + this.$t('goods-detail.goods-detail.dco1sc'),
                        status: goods.user_is_favor,
                    },
                    goods_spec_base_price: goods.price,
                    goods_spec_base_original_price: goods.original_price || 0,
                    show_field_price_text: price_text_arr.indexOf(goods.show_field_price_text) != -1 ? null : goods.show_field_price_text.replace(/<[^>]+>/g, '') || null,
                });
            },

            // 返回事件
            top_nav_left_back_event(e) {
                app.globalData.page_back_prev_event();
            },

            // 更多事件
            top_nav_left_more_event(e) {
                if (this.nav_more_list.length <= 0) {
                    app.globalData.showToast(this.$t('common.not_more_list_data_tips'));
                    return false;
                }

                // 已开启则关闭并取消定时任务
                var data = {};
                clearInterval(this.nav_more_timer);
                if (this.nav_more_status) {
                    data['nav_more_status'] = false;
                } else {
                    var self = this;
                    data['nav_more_status'] = true;
                    data['nav_more_timer'] = setTimeout(function () {
                        self.setData({
                            nav_more_status: false,
                        });
                    }, 5000);
                }
                this.setData(data);
            },

            // 顶部导航事件
            top_nav_title_event(e) {
                var self = this;
                var index = e.currentTarget.dataset.index || 0;
                var value = e.currentTarget.dataset.value || null;

                // 清除定时任务并禁止滚动改变
                clearTimeout(self.top_nav_title_timer);
                self.top_nav_title_scroll = false;

                // 获取节点位置
                var query = uni.createSelectorQuery();
                query.select(value).boundingClientRect();
                query.selectViewport().scrollOffset();
                query.exec(function (res) {
                    // 选中
                    self.top_nav_title_index = index;

                    // 距离计算
                    var bar_h = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
                    var nav_h = self.top_nav_height;
                    var top = res[0].top + res[1].scrollTop - nav_h - bar_h;
                    uni.pageScrollTo({
                        scrollTop: top,
                        duration: 300,
                    });
                });

                // 滚动完成后等待2秒解除滚动改变状态
                self.top_nav_title_timer = setTimeout(function () {
                    self.top_nav_title_scroll = true;
                }, 500);
            },

            // 导航左侧操作事件
            buy_left_nav_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var type = e.currentTarget.dataset.type || null;
                var value = e.currentTarget.dataset.value || null;
                app.globalData.url_open(value);
            },

            // 导航购买按钮事件
            nav_buy_submit_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var type = e.currentTarget.dataset.type || 'buy';
                var value = e.currentTarget.dataset.value || null;
                switch (type) {
                    // 展示型、拨打电话
                    case 'show':
                    case 'tel':
                        app.globalData.call_tel(value || this.common_app_customer_service_tel);
                        break;
                    // 规格选择(展示模式)、购买、加入购物车
                    case 'spec-show':
                    case 'buy':
                    case 'cart':
                        this.setData({ buy_event_type: type });
                        if ((this.$refs.goods_buy || null) != null) {
                            this.$refs.goods_buy.init(this.goods, {...{buy_event_type: this.buy_event_type, buy_button: this.buy_button, is_init: 0}, ...this.params});
                        }
                        break;
                    // url事件
                    case 'url':
                    case 'link':
                        if (value == null) {
                            app.globalData.showToast(this.$t('goods-detail.goods-detail.tq1976'));
                            return false;
                        }
                        app.globalData.url_open(value);
                        break;
                    // 复制事件
                    case 'copy':
                        if (value == null) {
                            app.globalData.showToast(this.$t('goods-detail.goods-detail.uyghj2'));
                            return false;
                        }
                        app.globalData.text_copy_event(value);
                        break;
                    // 门店
                    case 'plugins-realstore':
                        if((this.plugins_realstore_data || null) == null || (this.plugins_realstore_data.data || null) == null) {
                            app.globalData.showToast(this.$t('goods-detail.goods-detail.98v424'));
                            return false;
                        }
                        var temp_data_list = this.plugins_realstore_data.data || [];
                        if (temp_data_list.length == 1) {
                            app.globalData.url_open(temp_data_list[0]['url']+'&source_goods_id='+this.goods.id);
                        } else {
                            this.setData({
                                popup_realstore_status: true,
                            });
                        }
                        break;
                    // 商品批量下单-购买
                    case 'plugins-batchbuy-button-buy':
                    // 商品批量下单-加入购物车
                    case 'plugins-batchbuy-button-cart':
                        if ((this.$refs.goods_batch_buy || null) != null) {
                            this.$refs.goods_batch_buy.init({goods: this.goods, batchbuy_data: this.plugins_batchbuy_data, buy_button: this.buy_button, plugins_wholesale_data: this.plugins_wholesale_data});
                        }
                        break;
                    // 默认
                    default:
                        app.globalData.showToast(this.$t('goods-detail.goods-detail.721e2h')+type+')');
                }
            },

            // 数量和规格详情回调成功
            goods_buy_back_success_event(e) {
                if((e.back_data.plugins_wholesale_data || null) != null) {
                    this.setData({
                        plugins_wholesale_data: e.back_data.plugins_wholesale_data
                    });
                }
            },

            // 加入购物车成功回调
            goods_cart_back_event(e) {
                this.goods_spec_back_event(e);
                this.goods_cart_count_handle(e.cart_number);
            },

            // 规格选择回调
            goods_spec_back_event(e) {
                var temp_goods = this.goods;
                // 存在多规格则使用已选规格覆盖现有规格
                if ((temp_goods.specifications || null) != null) {
                    temp_goods['specifications']['choose'] = e.goods_spec_choose;
                }
                this.setData({
                    goods_spec_selected_text: (e.spec || null) == null ? '' : e.spec.map(function (v) {return v.value;}).join(' / '),
                    goods: temp_goods,
                });
            },

            // 购物车总数处理
            goods_cart_count_handle(cart_number) {
                this.setData({
                    quick_nav_cart_count: cart_number,
                });
            },

            // 收藏事件
            goods_favor_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'goods_favor_event', e);
                if (user != false) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('favor', 'goods'),
                        method: 'POST',
                        data: {
                            id: this.goods.id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    'goods.user_is_favor': res.data.data.status,
                                    nav_favor_button_info: {
                                        text: res.data.data.text,
                                        status: res.data.data.status,
                                    },
                                });
                                app.globalData.showToast(res.data.msg, 'success');
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'goods_favor_event')) {
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

            // 详情图片查看
            goods_detail_images_view_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value],
                    });
                }
            },

            // 商品相册图片查看
            goods_photo_view_event(e) {
                var index = e.currentTarget.dataset.index;
                var all = [];
                for (var i in this.goods_photo) {
                    all.push(this.goods_photo[i]['images']);
                }
                uni.previewImage({
                    current: all[index],
                    urls: all,
                });
            },

            // 视频播放
            goods_video_play_event(e) {
                this.setData({
                    goods_video_is_autoplay: true,
                });
            },

            // 视频关闭
            goods_video_close_event(e) {
                this.setData({
                    goods_video_is_autoplay: false,
                });
            },

            // 分享开启弹层
            popup_share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        status: true,
                        is_goods_poster: this.plugins_is_goods_detail_poster,
                        goods_id: this.goods.id,
                        share_info: this.share_info
                    });
                }
            },

            // 优惠券开启弹层
            popup_coupon_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                this.setData({
                    popup_coupon_status: true,
                });
            },

            // 优惠券弹层关闭
            popup_coupon_close_event(e) {
                this.setData({
                    popup_coupon_status: false,
                });
            },

            // 优惠劵领取事件
            coupon_receive_event(index, value) {
                // 参数处理
                if ((index || null) == null && (value || null) == null) {
                    var index = this.temp_coupon_receive_index;
                    var value = this.temp_coupon_receive_value;
                } else {
                    this.setData({
                        temp_coupon_receive_index: index,
                        temp_coupon_receive_value: value,
                    });
                }

                // 登录校验
                var user = app.globalData.get_user_info(this, 'coupon_receive_event');
                if (user != false) {
                    var temp_list = this.plugins_coupon_data.data;
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('receive', 'coupon', 'coupon'),
                        method: 'POST',
                        data: {
                            coupon_id: value,
                        },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                temp_list[index] = res.data.data.coupon;
                                this.setData({
                                    'plugins_coupon_data.data': temp_list,
                                });
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'coupon_receive_event')) {
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

            // 购买记录提示处理
            plugins_salerecords_tips_handle() {
                // 销毁之前的任务
                clearInterval(this.plugins_salerecords_timer);
                // 是否存在数据
                var data = this.plugins_salerecords_data || null;
                if (data != null && (data.data || null) != null && data.data.length > 0) {
                    var self = this;
                    var base = data.base || null;
                    var location = base == null || (base.goods_detail_tips_location || null) == null ? '' : '-' + base.goods_detail_tips_location;
                    var pause = (base == null ? 5 : base.goods_detail_time_pause || 5) * 1000;
                    var interval = (base == null ? 10 : base.goods_detail_time_interval || 10) * 1000;
                    var index = 0;
                    var list = data.data;
                    var count = list.length;
                    var timer = setInterval(function () {
                        self.setData({
                            plugins_salerecords_tips_content: list[index],
                        });
                        setTimeout(function () {
                            self.setData({
                                plugins_salerecords_tips_content: null,
                            });
                        }, pause);
                        index++;
                        if (index >= count) {
                            index = 0;
                        }
                    }, interval);
                    self.setData({
                        plugins_salerecords_timer: timer,
                        plugins_salerecords_tips_ent: location,
                    });
                }
            },

            // 门店弹层关闭
            popup_realstore_close_event(e) {
                this.setData({
                    popup_realstore_status: false,
                });
            },

            // 更多导航事件
            nav_more_event(e) {
                app.globalData.operation_event(e);
                this.setData({ nav_more_status: false });
            },

            // 商品参数开启弹层
            popup_params_event(e) {
                this.setData({
                    popup_params_status: true,
                    popup_params_type_field: e.currentTarget.dataset.value || 'base',
                });
            },

            // 商品参数关闭弹层
            popup_params_close_event(e) {
                this.setData({
                    popup_params_status: false,
                });
            },

            // 商品服务开启弹层
            popup_goodsservice_event(e) {
                this.setData({
                    popup_goodsservice_status: true,
                });
            },

            // 商品服务弹层关闭
            popup_goodsservice_close_event(e) {
                this.setData({
                    popup_goodsservice_status: false,
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 底部导航操作返回事件
            bottom_nav_back_event(e) {
                var pages = getCurrentPages();
                if (pages.length > 1) {
                    uni.navigateBack();
                } else {
                    // 默认首页
                    var url = app.globalData.app_tabbar_pages()[0];

                    // 是否有参数定义
                    if (this.is_opt_back == 1) {
                        // 门店详情来源
                        if ((this.params.realstore_id || null) != null) {
                            url = '/pages/plugins/realstore/detail/detail?id=' + this.params.realstore_id;
                        }
                    }
                    app.globalData.url_open(url);
                }
            },

            // 商品批量下单加入购物车回调
            batch_goods_cart_back_event(e) {
                this.goods_cart_count_handle(e.cart_number);
            },

            // 下单类型切换事件、数据刷新事件
            refresh_loading_event(params) {
                this.setData({params: {...this.params, ...params}});
                this.init();
            }
        }
    };
</script>
<style>
    @import './goods-detail.css';
</style>
