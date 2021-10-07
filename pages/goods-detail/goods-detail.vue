<template>
    <view>
        <!-- 顶部导航 -->
        <view v-if="goods != null" class="page">
            <view class="top-nav-left-icon" :style="'top:'+(status_bar_height+8)+'px;'">
                <uni-icons type="arrowleft" size="20" color="#333" class="icon round" @tap="top_nav_left_back_event"></uni-icons>
                <uni-icons type="list" size="20" color="#333" class="icon round margin-left-lg" @tap="top_nav_left_more_event"></uni-icons>
            </view>
            <block v-if="(top_nav_title_data || null) != null && top_nav_title_data.length > 0">
                <component-trn-nav :prop-scroll="scroll_value" :prop-height="top_nav_height">
                    <view class="top-nav padding-bottom padding-horizontal-main">
                        <view class="top-nav-content tc">
                            <block v-for="(item, index) in top_nav_title_data" :key="index">
                                <text @tap="top_nav_title_event" :data-index="index" :data-value="item.ent" :class="top_nav_title_index == index ? 'nav-active border-color-main' : ''">{{item.name}}</text>
                            </block>
                        </view>
                    </view>
                </component-trn-nav>
            </block>
                     
            <!-- 轮播图片 -->
            <swiper :indicator-dots="indicator_dots" :indicator-color="indicator_color" :indicator-active-color="indicator_active_color" :autoplay="autoplay" :circular="circular" class="goods-photo bg-white" v-if="goods_photo.length > 0" :style="'height: ' + photo_height + ' !important;'">
                <block v-for="(item, index) in goods_photo" :key="index">
                    <swiper-item>
                        <image class="swiper-item wh-auto" @tap="goods_photo_view_event" :data-index="index" :src="item.images" mode="scaleToFill" :style="'height: ' + photo_height + ' !important;'">
                        </image>
                    </swiper-item>
                </block>
            </swiper>
            
            <!-- 视频 -->
            <block v-if="goods.video.length > 0">
                <view v-if="goods_video_is_autoplay" class="goods-video">
                    <video :src="goods.video" :autoplay="goods_video_is_autoplay" :show-center-play-btn="true" :controls="false" :show-play-btn="false" :enable-progress-gesture="false" :show-fullscreen-btn="false" :style="'height: ' + photo_height + ' !important;'"></video>
                </view>
                <view class="goods-video-submit" :style="'top: calc(' + photo_height + ' - 110rpx) !important;'">
                    <image v-if="!goods_video_is_autoplay" class="goods-video-play" @tap="goods_video_play_event" :src="static_url+'video-play-icon.png'" mode="aspectFit"></image>
                    <image v-if="goods_video_is_autoplay" class="goods-video-close" @tap="goods_video_close_event" :src="static_url+'video-close-icon.png'" mode="aspectFit"></image>
                </view>
            </block>
            
            <!-- 价格信息 -->
            <view :class="'goods-base-price bg-white oh spacing-mb '+((plugins_limitedtimediscount_is_valid == 1) ? 'goods-base-price-countdown' : '')">
                <!-- 价格 -->
                <view class="price-content padding-lg" :style="(plugins_limitedtimediscount_is_valid == 1) ? 'background-image: url('+plugins_limitedtimediscount_data.bg_img+')' : ''">
                    <view class="single-text">
                        <text v-if="(show_field_price_text || null) != null" class="price-icon radius va-m">{{show_field_price_text}}</text>
                        <text class="sales-price va-m">{{currency_symbol}}{{goods.min_price}}</text>
                    </view>
                    <view v-if="(goods.min_original_price || null) != null && goods.min_original_price > 0" class="original-price margin-top-sm single-text">{{currency_symbol}}{{goods.min_original_price}}</view>
                </view>
                <!-- 秒杀 -->
                <view v-if="plugins_limitedtimediscount_is_valid == 1" class="countdown-content padding-lg fr tc">
                    <view class="time-title cr-white single-text">{{plugins_limitedtimediscount_data.title || '限时秒杀'}}</view>
                    <component-countdown :prop-hour="plugins_limitedtimediscount_data.time.hours" :prop-minute="plugins_limitedtimediscount_data.time.minutes" :prop-second="plugins_limitedtimediscount_data.time.seconds" :prop-msec-show="true" prop-time-size="32" prop-time-padding="0" prop-time-weight="bold" prop-time-background-color="transparent" prop-time-color="#ffe500" prop-ds-color="#fff"></component-countdown>
                </view>
            </view>

            <view class="padding-horizontal-main">
                <!-- 基础信息 -->
                <view class="goods-base-content border-radius-main bg-white spacing-mb">
                    <view class="padding-main">
                        <view class="goods-title-content oh">
                            <!-- 标题 -->
                            <view class="goods-title fl" :style="'color:' + goods.title_color">{{goods.title}}</view>
                            <!-- 分享 -->
                            <view class="goods-share fr tc" @tap="popup_share_event">
                                <image :src="static_url+'share-icon.png'" mode="scaleToFill" class="dis-block"></image>
                                <view class="cr-gray text-size-sm">分享</view>
                            </view>
                        </view>
                        
                        <!-- 简述 -->
                        <view v-if="(goods.simple_desc || null) != null" class="cr-red margin-top-lg">{{goods.simple_desc}}</view>
                    </view>
                    
                    <!-- 基础总计数据 -->
                    <view class="br-t padding-main">
                        <view class="base-grid oh padding-top-sm padding-bottom-sm">
                            <view class="fl tl">
                                <text class="cr-gray">库存</text>
                                <text class="cr-main padding-left-sm">{{goods.inventory}}</text>
                            </view>
                            <view class="fl tc">
                                <text class="cr-gray">热度</text>
                                <text class="cr-main padding-left-sm">{{goods.access_count}}</text>
                            </view>
                            <view class="fl tr">
                                <text class="cr-gray">销量</text>
                                <text class="cr-main padding-left-sm">{{goods.sales_count}}</text>
                            </view>
                        </view>
                    </view>
                </view>
            
                <!-- 优惠券 -->
                <view v-if="(plugins_coupon_data || null) != null && plugins_coupon_data.data.length > 0" class="coupon-container-view oh padding-horizontal-main padding-top-main padding-bottom-sm border-radius-main bg-white arrow-right spacing-mb">
                    <view class="fl item-title">优惠券</view>
                    <view class="fr column-right-view single-text" @tap="popup_coupon_event">
                        <block v-for="(item, index) in plugins_coupon_data.data" :key="index">
                            <view class="item round cr-white dis-inline-block" :style="'background:' + item.bg_color_value + ';'">{{item.desc || item.name}}</view>
                        </block>
                    </view>
                </view>

                <!-- 规格选择 -->
                <view v-if="goods.is_exist_many_spec == 1 && ((buy_button || null) != null && ((buy_button.is_buy || 0) == 1 || (buy_button.is_cart || 0) == 1))" class="spec-container-view oh padding-horizontal-main padding-main border-radius-main bg-white arrow-right spacing-mb">
                    <view class="fl item-title">规格</view>
                    <view class="fr column-right-view cr-base single-text" @tap="nav_buy_submit_event" data-type="buy">{{goods_spec_selected_text}}</view>
                </view>
            </view>

            <!-- icon -->
            <view v-if="(goods.plugins_view_icon_data || null) != null && goods.plugins_view_icon_data.length > 0" class="goods-icon-container oh border-radius-main padding-horizontal-main margin-bottom-sm">
                <block v-for="(item, index) in goods.plugins_view_icon_data" :key="index">
                    <view v-if="(item.name || null) != null" class="fl tc round" :style="((item.br_color || null) == null ? '' : 'border:1px solid '+item.br_color+';') + '' + ((item.color || null) == null ? '' : 'color: '+item.color+';')">{{item.name}}</view>
                </block>
            </view>

            <view class="padding-horizontal-main">
                <!-- 面板提示信息 -->
                <view v-if="(goods.plugins_view_panel_data || null) != null && goods.plugins_view_panel_data.length > 0" class="goods-panel-container oh border-radius-main padding-horizontal-main padding-top-xs padding-bottom-xs bg-white spacing-mb">
                    <block v-for="(item, index) in goods.plugins_view_panel_data" :key="index">
                        <view v-if="(item || null) != null">{{item}}</view>
                    </block>
                </view>

                <!-- 商品基础参数 -->
                <view v-if="(goods.parameters || null) != null && goods.parameters.base.length > 0" class="goods-parameters parameters-base border-radius-main padding-main bg-white spacing-mb">
                    <view class="content-item oh">
                        <block v-for="(item, index) in goods.parameters.base" :key="index">
                            <view class="item single-text">
                                <text class="name">{{item.name}}:</text>
                                <text class="value">{{item.value}}</text>
                            </view>
                        </block>
                    </view>
                </view>
            </view>

            <view class="padding-horizontal-main">
                <!-- 多商户 -->
                <view v-if="plugins_shop_data != null" class="plugins-shop-container oh border-radius-main padding-main bg-white arrow-right spacing-mb">
                    <navigator :url="'/pages/plugins/shop/detail/detail?id=' + plugins_shop_data.id" hover-class="none">
                        <image :src="plugins_shop_data.logo" mode="aspectFit" class="plugins-shop-logo fl radius"></image>
                        <view class="plugins-shop-base column-right-view fr">
                            <view class="plugins-shop-title single-text">
                                <text v-if="plugins_shop_data.auth_type == 1" class="plugins-shop-auth-icon">{{plugins_shop_data.auth_type_name}}</text>
                                <text>{{plugins_shop_data.name}}</text>
                            </view>
                            <view class="plugins-shop-desc multi-text cr-gray margin-top-sm">{{plugins_shop_data.describe}}
                            </view>
                        </view>
                    </navigator>
                </view>

                <!-- 商品评价 -->
                <view class="goods-comment spacing-mb">
                    <view class="spacing-nav-title">
                        <text class="line"></text>
                        <text class="text-wrapper">商品评价</text>
                        <text class="margin-left-xs">({{goods.comments_count}})</text>
                        <navigator :url="'/pages/goods-comment/goods-comment?goods_id=' + goods.id" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">好评率 {{goods.comments_score.rate}}%</navigator>
                    </view>
                    <view class="border-radius-main padding-main bg-white">
                        <block v-if="((goods.comments_data || null) != null && goods.comments_data.length > 0)">
                            <view v-for="(item, index) in goods.comments_data" :key="index" class="goods-comment-item spacing-mb">
                                <view class="oh nav br-b padding-bottom-sm">
                                    <image class="avatar dis-block fl" :src="item.user.avatar || static_url+'default-user.png'" mode="aspectFit"></image>
                                    <view class="base-nav fr">
                                        <text class="va-m">{{item.user.user_name_view}}</text>
                                        <view class="dis-inline-block va-m margin-left-sm">
                                            <uni-rate :value="item.rating" :is-fill="false" :size="14" />
                                        </view>
                                        <view class="fr">
                                            <text class="cr-grey">{{item.add_time_date}}</text>
                                        </view>
                                    </view>
                                </view>
                                <view class="base-content oh padding-sm">
                                    <view class="content cr-base text-size-sm">{{item.content}}</view>
                                    <view v-if="(item.images || null) != null && item.images.length > 0" class="images oh margin-top-lg">
                                        <block v-for="(iv, ix) in item.images" :key="ix">
                                            <image class="br radius" @tap="comment_images_show_event" :data-index="index" :data-ix="ix" :src="iv" mode="aspectFit"></image>
                                        </block>
                                    </view>
                                    <view v-if="(item.msg || null) != null" class="spec cr-grey margin-top-lg">{{item.msg}}</view>
                                </view>
                            </view>
                            <navigator :url="'/pages/goods-comment/goods-comment?goods_id=' + goods.id" hover-class="none" class="cr-base tc">查看更多评价 >></navigator>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-sm padding-bottom-sm">暂无评价数据</view>
                        </block>
                    </view>
                </view>
                
                <!-- 商品详情参数 -->
                <view v-if="(goods.parameters || null) != null && goods.parameters.detail.length > 0" class="spacing-mb">
                    <view class="spacing-nav-title">
                        <text class="line"></text>
                        <text class="text-wrapper">商品参数</text>
                    </view>
                    <view class="goods-parameters border-radius-main padding-main bg-white">
                        <view class="content-item oh">
                            <block v-for="(item, index) in goods.parameters.detail" :key="index">
                                <view class="item single-text">
                                    <text class="name">{{item.name}}:</text>
                                    <text class="value">{{item.value}}</text>
                                </view>
                            </block>
                        </view>
                    </view>
                </view>

                <!-- 商品详情 -->
                <view class="goods-detail">
                    <view class="spacing-nav-title">
                        <text class="line"></text>
                        <text class="text-wrapper">商品详情</text>
                    </view>
                    <view class="border-radius-main oh bg-white">
                        <!-- 是否详情展示相册 -->
                        <block v-if="common_is_goods_detail_show_photo == 1 && goods_photo.length > 0">
                            <view v-for="(item, index) in goods_photo" :key="index" class="goods-detail-photo">
                                <image v-if="(item.images || null) != null" @tap="goods_detail_images_view_event" :data-value="item.images" class="wh-auto dis-block" :src="item.images" mode="widthFix">
                                </image>
                            </view>
                        </block>
                        <!-- web详情 -->
                        <view v-if="common_app_is_use_mobile_detail == 0">
                            <rich-text :nodes="goods.content_web || ''"></rich-text>
                        </view>
                        <!-- 手机独立详情 -->
                        <block v-if="common_app_is_use_mobile_detail == 1 && goods_content_app.length > 0">
                            <view v-for="(item, index) in goods_content_app" :key="index" class="goods-detail-app">
                                <image v-if="(item.images || null) != null" @tap="goods_detail_images_view_event" :data-value="item.images" class="wh-auto dis-block" :src="item.images" mode="widthFix">
                                </image>
                                <view v-if="(item.content || null) != null" class="content-items">
                                    <view v-for="(items, index2) in item.content" :key="index2">{{items}}</view>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
            
            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>

            <!-- 底部操作 -->
            <view class="goods-buy-nav oh wh-auto bg-white br-t">
                <view class="bus-items fl tc">
                    <view class="item fl" @tap="shop_event">
                        <image :src="nav_home_button_info.icon" mode="scaleToFill"></image>
                        <text class="dis-block text-size-xs cr-gray">{{nav_home_button_info.text}}</text>
                    </view>
                    <view class="item fl">
                        <navigator url="/pages/cart/cart" open-type="switchTab" hover-class="none">
                            <view class="badge-icon">
                                <component-badge :prop-number="quick_nav_cart_count"></component-badge>
                            </view>
                            <image :src="static_url+'cart-icon.png'" mode="scaleToFill"></image>
                            <text class="dis-block text-size-xs cr-gray">购物车</text>
                        </navigator>
                    </view>
                    <view class="item fl " @tap="goods_favor_event">
                        <image :src="static_url+'favor'+(nav_favor_button_info.status == 1 ? '-active' : '')+'-icon.png'" mode="scaleToFill"></image>
                        <text :class="'dis-block text-size-xs ' + (nav_favor_button_info.status == 1 ? 'cr-main' : 'cr-gray')">{{nav_favor_button_info.text}}</text>
                    </view>
                </view>
                <view :class="'btn-items fr goods-buy-nav-btn-number-' + buy_button.count || 0">
                        <block v-if="(buy_button.data || null) != null && buy_button.data.length > 0">
                            <block v-for="(item, index) in buy_button.data" :key="index">
                                <block v-if="(item.name || null) != null && (item.type || null) != null">
                                    <button :class="'item fl cr-white round bg-' + ((item.color || 'main') == 'main' ? 'main' : 'main-pair')" type="default" @tap="nav_buy_submit_event" :data-type="item.type" :data-value="item.value || ''" hover-class="none">{{item.name}}</button>
                                </block>
                            </block>
                        </block>
                        <block v-else>
                            <button class="item bg-gray round tc" type="default" disabled>{{buy_button.error || '暂停销售'}}</button>
                        </block>
                    </view>
            </view>

            <!-- 购买弹层 -->
            <component-popup :prop-show="popup_status" prop-position="bottom" @onclose="popup_close_event">
                <view class="goods-popup padding-main bg-white">
                    <view class="close fr oh">
                        <view class="fr" @tap.stop="popup_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <!-- 规格基础信息 -->
                    <view class="goods-popup-base oh br-b">
                        <image :src="goods_spec_base_images" mode="scaleToFill" class="radius br" @tap="goods_detail_images_view_event" :data-value="goods_spec_base_images"></image>
                        <view class="goods-popup-base-content">
                            <view class="goods-price">
                                <view class="sales-price">{{currency_symbol}}{{goods_spec_base_price}}</view>
                                <view v-if="(goods_spec_base_original_price || null) != null && goods_spec_base_original_price > 0" class="original-price">{{currency_symbol}}{{goods_spec_base_original_price}}</view>
                            </view>
                            <view class="inventory">
                                <text class="cr-gray">库存</text>
                                <text class="cr-base">{{goods_spec_base_inventory}}</text>
                                <text class="cr-gray">{{goods.inventory_unit}}</text>
                            </view>
                        </view>
                    </view>

                    <view class="goods-popup-content">
                        <!-- 商品规格 -->
                        <view v-if="goods_specifications_choose.length > 0" class="goods-spec-choose">
                            <view v-for="(item, key) in goods_specifications_choose" :key="key" class="item br-b">
                                <view class="title">{{item.name}}</view>
                                <view v-if="item.value.length > 0" class="spec">
                                    <block v-for="(items, keys) in item.value" :key="keys">
                                        <button @tap.stop="goods_specifications_event" :data-key="key" :data-keys="keys" type="default" size="mini" hover-class="none" :class="items.is_active + ' ' + items.is_dont + ' ' + items.is_disabled">
                                            <image v-if="(items.images || null) != null" :src="items.images" mode="scaleToFill" class="va-m round margin-right-sm"></image>
                                            <text class="va-m">{{items.name}}</text>
                                        </button>
                                    </block>
                                </view>
                            </view>
                        </view>

                        <!-- 购买数量 -->
                        <view class="goods-buy-number oh">
                            <view class="title fl">购买数量</view>
                            <view class="number-content tc oh radius">
                                <view @tap="goods_buy_number_event" class="number-submit tc cr-gray fl" data-type="0">-</view>
                                <input @blur="goods_buy_number_blur" class="tc cr-gray fl" type="number" :value="buy_number">
                                <view @tap="goods_buy_number_event" class="number-submit tc cr-gray fl" data-type="1">+</view>
                            </view>
                        </view>
                    </view>
                    <button class="goods-popup-submit bg-main cr-white" type="default" @tap.stop="goods_buy_confirm_event" hover-class="none">确定</button>
                </view>
            </component-popup>

            <!-- 分享弹层 -->
            <component-popup :prop-show="popup_share_status" prop-position="bottom" @onclose="popup_share_close_event">
                <view class="share-popup bg-white">
                    <view class="close fr oh">
                        <view class="fr" @tap.stop="popup_share_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <view class="share-popup-content">
                        <view v-if="common_app_is_good_thing == 1" class="share-items oh">
                            <share-button :product="share_product" type="3" class="dis-block oh">
                                <image class="fl" :src="static_url+'share-recomend-icon.png'" mode="scaleToFill">
                                </image>
                                <view class="cr-gray single-text fl">好物推荐、和大家一起分享你发现的宝贝</view>
                            </share-button>
                        </view>
                        <view class="share-items oh">
                            <button class="dis-block" type="default" size="mini" open-type="share" hover-class="none" @tap="popup_share_close_event">
                                <image :src="static_url+'share-weixin-icon.png'" mode="scaleToFill"></image>
                                <text class="cr-gray single-text">一键分享给好友、群聊</text>
                            </button>
                        </view>
                        <view v-if="common_app_is_poster_share == 1" class="share-items oh" @tap="poster_event">
                            <image :src="static_url+'share-friend-icon.png'" mode="scaleToFill"></image>
                            <text class="cr-gray single-text">生成海报，分享到朋友圈、好友及群聊</text>
                        </view>
                    </view>
                </view>
            </component-popup>
            
            <!-- 优惠券弹层 -->
            <component-popup :prop-show="popup_coupon_status" prop-position="bottom" @onclose="popup_coupon_close_event">
                <view class="coupon-popup padding-horizontal-main padding-top-main">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_coupon_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <view class="coupon-container padding-bottom-main">
                        <block v-if="(plugins_coupon_data || null) != null && plugins_coupon_data.data.length > 0">
                            <block v-for="(item, index) in plugins_coupon_data.data" :key="index">
                                <view :class="'item bg-white border-radius-main ' + (item.is_operable == 0 ? 'item-disabled' : '')" :style="'border:1px solid ' + item.bg_color_value + ';'">
                                    <view class="v-left fl">
                                        <view class="base single-text" :style="'color:' + item.bg_color_value + ';'">
                                            <text v-if="item.type == 0" class="symbol">{{currency_symbol}}</text>
                                            <text class="price">{{item.discount_value}}</text>
                                            <text class="unit">{{item.type_unit}}</text>
                                        </view>
                                        <view v-if="(item.use_limit_type_name || null) != null"
                                            class="base-tips cr-base single-text">{{item.use_limit_type_name}}</view>
                                        <view v-if="(item.desc || null) != null" class="desc margin-top-xs cr-gray single-text">{{item.desc}}
                                        </view>
                                    </view>
                                    <view class="v-right fr" @tap="coupon_receive_event" :data-index="index" :data-value="item.id" :style="'background:' + item.bg_color_value + ';'">
                                        <text class="circle"></text>
                                        <text>{{item.is_operable_name}}</text>
                                    </view>
                                </view>
                            </block>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">无优惠券信息</view>
                        </block>
                    </view>
                </view>
            </component-popup>

            <!-- 购买记录 -->
            <view v-if="(plugins_salerecords_tips_content || null) != null" :class="'plugins-salerecords-tips' + plugins_salerecords_tips_ent">
                <image mode="widthFix" :src="plugins_salerecords_tips_content.user.avatar" class="va-m br"></image>
                <text class="margin-left-sm">{{plugins_salerecords_tips_content.tips}}</text>
            </view>
        </view>

        <!-- 提示信息 -->
        <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
        
        <!-- 在线客服 -->
        <component-online-service :prop-is-nav="true"></component-online-service>

        <!-- 快捷导航 -->
        <component-quick-nav :prop-is-nav="true"></component-quick-nav>
    </view>
</template>

<script>
    const app = getApp();
    import componentQuickNav from "../../components/quick-nav/quick-nav";
    import componentPopup from "../../components/popup/popup";
    import componentBadge from "../../components/badge/badge";
    import componentCountdown from "../../components/countdown/countdown";
    import componentNoData from "../../components/no-data/no-data";
    import componentTrnNav from "../../components/trn-nav/trn-nav";
    import componentBottomLine from "../../components/bottom-line/bottom-line";
    import componentOnlineService from "../../components/online-service/online-service";

    var common_static_url = app.globalData.get_static_url('common');
    var static_url = app.globalData.get_static_url('goods_detail');
    export default {
        data() {
            return {
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight')),
                common_static_url: common_static_url,
                static_url: static_url,
                indicator_dots: false,
                indicator_color: 'rgba(0, 0, 0, .3)',
                indicator_active_color: '#e31c55',
                autoplay: true,
                circular: true,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                system_info: null,
                photo_height: '55vh',
                goods: null,
                goods_photo: [],
                goods_specifications_choose: [],
                goods_content_app: [],
                popup_status: false,
                buy_number: 1,
                buy_event_type: 'buy',
                buy_button: {},
                goods_spec_base_price: 0,
                goods_spec_base_original_price: 0,
                goods_spec_base_inventory: 0,
                goods_spec_base_images: '',
                goods_spec_selected_text: '请选择规格',
                show_field_price_text: null,
                goods_video_is_autoplay: false,
                popup_share_status: false,
                // 导航首页按钮
                nav_home_button_info: {
                    "text": "首页",
                    "icon": static_url+"home-icon.png",
                    "value": "/pages/index/index"
                },
                // 导航收藏按钮
                nav_favor_button_info: {
                    "text": "收藏",
                    "status": 0
                },
                // 购物车快捷导航
                quick_nav_cart_count: 0,
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                common_app_is_poster_share: 0,
                common_app_is_good_thing: 0,
                common_app_is_online_service: 0,
                common_app_is_use_mobile_detail: 0,
                common_is_goods_detail_show_photo: 0,
                common_app_customer_service_tel: null,
                // 滚动监听值
                scroll_value: 0,
                // 顶部导航信息
                top_nav_height: 50,
                top_nav_title_index: 0,
                top_nav_title_scroll: true,
                top_nav_title_timer: null,
                top_nav_title_data: [],
                // 好物圈分享信息
                share_product: {
                    "item_code": "",
                    "title": "",
                    "desc": "",
                    "category_list": [],
                    "image_list": [],
                    "src_mini_program_path": "",
                    "brand_info": {}
                },
                // 限时秒杀插件
                plugins_limitedtimediscount_is_valid: 0,
                plugins_limitedtimediscount_data: null,
                // 优惠劵
                plugins_coupon_data: null,
                temp_coupon_receive_index: null,
                temp_coupon_receive_value: null,
                popup_coupon_status: false,
                // 购买记录
                plugins_salerecords_data: null,
                plugins_salerecords_timer: null,
                plugins_salerecords_tips_content: null,
                plugins_salerecords_tips_ent: '',
                // 多商户
                plugins_shop_data: null,
            };
        },

        components: {
            componentQuickNav,
            componentPopup,
            componentBadge,
            componentCountdown,
            componentNoData,
            componentTrnNav,
            componentBottomLine,
            componentOnlineService
        },

        onLoad(params) {
            // 启动参数处理
            params = app.globalData.launch_params_handle(params);
            //params['goods_id']=12;

            // 参数赋值,初始化
            var system_info = app.globalData.get_system_info();
            this.setData({
                params: params,
                system_info: system_info,
                photo_height: (system_info || null) == null || (system_info.screenWidth || null) == null ? '55vh' : system_info.screenWidth + 'px'
            });

            // 数据加载
            this.init();
        },

        onShow() {
            uni.setNavigationBarTitle({
                title: this.goods == null ? app.globalData.data.common_pages_title.goods_detail : this.goods.title
            });

            // 初始化配置
            this.init_config();

            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },
        
        // 页面销毁时执行
        onUnload: function() {
            clearInterval(this.plugins_salerecords_timer);
        },
        
        // 监听滚动
        onPageScroll(e) {
            // 位置记录
            this.scroll_value = e.scrollTop;

            // 顶部导航选中处理
            if (this.top_nav_title_scroll) {
                var self = this;
                var data = this.top_nav_title_data;
                var query = uni.createSelectorQuery();
                for (var i in data) {
                    query.select(data[i]['ent']).boundingClientRect();
                }
                query.exec(function(res) {
                    var bar_h = app.globalData.get_system_info('statusBarHeight') || 0;
                    var nav_h = self.top_nav_height;
                    var length = res.length-1;
                    for (var i=length; i>=0; i--) {
                        var temp = res[i]['top']-bar_h-nav_h;
                        if (temp <= 0) {
                            if (self.top_nav_title_index != i) {
                                self.top_nav_title_index = i;
                            }
                            break;
                        }
                    }
                });
            }
        },

        // 自定义分享
        onShareAppMessage() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.goods.title + '-' + app.globalData.data.application_title,
                desc: app.globalData.data.application_describe,
                path: '/pages/goods-detail/goods-detail?goods_id=' + this.goods.id + '&referrer=' + user_id,
                imageUrl: this.goods.images
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.goods.title + '-' + app.globalData.data.application_title,
                query: 'goods_id=' + this.goods.id + '&referrer=' + user_id,
                imageUrl: this.goods.images
            };
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        common_app_is_use_mobile_detail: app.globalData.get_config(
                            'config.common_app_is_use_mobile_detail'),
                        common_is_goods_detail_show_photo: app.globalData.get_config(
                            'config.common_is_goods_detail_show_photo'),
                        common_app_is_online_service: app.globalData.get_config(
                            'config.common_app_is_online_service'),
                        common_app_is_good_thing: app.globalData.get_config('config.common_app_is_good_thing'),
                        common_app_is_poster_share: app.globalData.get_config(
                            'config.common_app_is_poster_share'),
                        common_app_customer_service_tel: app.globalData.get_config(
                            'config.common_app_customer_service_tel')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                // 参数校验
                if ((this.params.goods_id || null) == null) {
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_bottom_line_status: false,
                        data_list_loding_status: 2,
                        data_list_loding_msg: '商品ID有误'
                    });
                } else {
                    var self = this;
                    uni.showLoading({
                        title: '加载中...'
                    });
                    this.setData({
                        data_list_loding_status: 1
                    });
                    uni.request({
                        url: app.globalData.get_request_url("detail", "goods"),
                        method: "POST",
                        data: {
                            goods_id: this.params.goods_id
                        },
                        dataType: "json",
                        success: res => {
                            uni.stopPullDownRefresh();
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                self.setData({
                                    data_bottom_line_status: true,
                                    data_list_loding_status: 3,
                                    goods: data.goods,
                                    indicator_dots: data.goods.photo.length > 1,
                                    autoplay: data.goods.photo.length > 1,
                                    goods_photo: data.goods.photo,
                                    goods_specifications_choose: data.goods.specifications.choose ||
                                        [],
                                    goods_content_app: data.goods.content_app || [],
                                    buy_number: data.goods.buy_min_number || 1,
                                    nav_favor_button_info: {
                                        "text": (data.goods.is_favor == 1 ? '已' : '') + '收藏',
                                        "status": data.goods.is_favor
                                    },
                                    buy_button: data.buy_button || null,
                                    top_nav_title_data: data.middle_tabs_nav || [],
                                    goods_spec_base_price: data.goods.price,
                                    goods_spec_base_original_price: data.goods.original_price,
                                    goods_spec_base_inventory: data.goods.inventory,
                                    goods_spec_base_images: data.goods.images,
                                    show_field_price_text: data.goods.show_field_price_text == '销售价' ? null : data.goods.show_field_price_text.replace(/<[^>]+>/g, "") || null,
                                    plugins_limitedtimediscount_data: data.plugins_limitedtimediscount_data || null,
                                    plugins_limitedtimediscount_is_valid: (data.plugins_limitedtimediscount_data || null) != null && (data.plugins_limitedtimediscount_data.is_valid || 0) == 1 ? 1 : 0,
                                    plugins_coupon_data: data.plugins_coupon_data || null,
                                    quick_nav_cart_count: data.common_cart_total || 0,
                                    plugins_salerecords_data: (data.plugins_salerecords_data || null) == null || data.plugins_salerecords_data.length <= 0 ? null : data.plugins_salerecords_data,
                                    plugins_shop_data: (data.plugins_shop_data || null) == null || data.plugins_shop_data.length <= 0 ? null : data.plugins_shop_data
                                });

                                // 标题
                                uni.setNavigationBarTitle({
                                    title: data.goods.title
                                });

                                // 好物分享
                                this.setData({
                                    share_product: {
                                        'item_code': data.goods.id.toString(),
                                        'title': data.goods.title,
                                        'image_list': data.goods.photo.map(function(v) {
                                            return v.images;
                                        }),
                                        'desc': data.goods.simple_desc,
                                        'category_list': data.goods.category_names || [],
                                        'src_mini_program_path': '/pages/goods-detail/goods-detail?goods_id=' + data.goods.id,
                                        'brand_info.name': data.goods.brand_name,
                                    }
                                });

                                // 导航首页按钮、多商户
                                if (this.plugins_shop_data != null) {
                                    this.setData({
                                        nav_home_button_info: {
                                            "text": "店铺",
                                            "icon": this.plugins_shop_data.shop_icon,
                                            "value": "/pages/plugins/shop/detail/detail?id=" + this
                                                .plugins_shop_data.id
                                        }
                                    });
                                }
                                
                                // 不能选择规格处理
                                this.goods_specifications_choose_handle_dont(0);
                                
                                // 购买记录提示
                                this.plugins_salerecords_tips_handle();
                            } else {
                                self.setData({
                                    data_bottom_line_status: false,
                                    data_list_loding_status: 0,
                                    data_list_loding_msg: res.data.msg
                                });
                            }
                        },
                        fail: () => {
                            uni.stopPullDownRefresh();
                            uni.hideLoading();
                            self.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: '服务器请求出错'
                            });
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },

            // 返回事件
            top_nav_left_back_event(e) {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: '/pages/index/index'
                    });
                } else {
                    uni.navigateBack();
                }
            },
            
            // 更多事件
            top_nav_left_more_event(e) {
                app.globalData.showToast('更多列表开发中...');
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
                const query = uni.createSelectorQuery();
                query.select(value).boundingClientRect();
                query.selectViewport().scrollOffset();
                query.exec(function(res) {
                    // 选中
                    self.top_nav_title_index = index;

                    // 距离计算
                    var bar_h = app.globalData.get_system_info('statusBarHeight') || 0;
                    var nav_h = self.top_nav_height;
                    var top = res[0].top+res[1].scrollTop-nav_h-bar_h;
                    uni.pageScrollTo({
                        scrollTop: top,
                        duration: 300
                    });
               });
               
               // 滚动完成后等待2秒解除滚动改变状态
               self.top_nav_title_timer = setTimeout(function() {
                   self.top_nav_title_scroll = true;
               }, 500);
            },

            // 不能选择规格处理
            goods_specifications_choose_handle_dont(key) {
                var temp_data = this.goods_specifications_choose || [];
                if (temp_data.length <= 0) {
                    return false;
                }

                // 是否不能选择
                for (var i in temp_data) {
                    for (var k in temp_data[i]['value']) {
                        if (i > key) {
                            temp_data[i]['value'][k]['is_dont'] = 'spec-dont-choose', temp_data[i]['value'][k]['is_disabled'] = '';
                            temp_data[i]['value'][k]['is_active'] = '';
                        }

                        // 当只有一个规格的时候
                        if (key == 0 && temp_data.length == 1) {
                            temp_data[i]['value'][k]['is_disabled'] = (temp_data[i]['value'][k]['is_only_level_one'] || null) != null && (temp_data[i]['value'][k]['inventory'] || 0) <= 0 ? 'spec-items-disabled' : '';
                        }
                    }
                }

                this.setData({
                    goods_specifications_choose: temp_data
                });
            },

            // 购买弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false
                });
            },

            // 进入店铺
            shop_event(e) {
                var value = this.nav_home_button_info.value;
                if (app.globalData.is_tabbar_pages(value)) {
                    uni.switchTab({
                        url: value
                    });
                } else {
                    uni.navigateTo({
                        url: value
                    });
                }
            },

            // 导航购买按钮事件
            nav_buy_submit_event(e) {
                var type = e.currentTarget.dataset.type || 'buy';
                var value = e.currentTarget.dataset.value || null;

                switch (type) {
                    // 展示型、拨打电话
                    case 'show':
                        app.globalData.call_tel(value || this.common_app_customer_service_tel);
                        break;
                        // 购买、加入购物车
                    case 'buy':
                    case 'cart':
                        this.setData({
                            popup_status: true,
                            buy_event_type: type
                        });
                        break;
                        // 默认
                    default:
                        app.globalData.showToast('事件未处理');
                }
            },

            // 收藏事件
            goods_favor_event(e) {
                var user = app.globalData.get_user_info(this, 'goods_favor_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=goods_favor_event"
                        });
                        return false;
                    } else {
                        uni.showLoading({
                            title: '处理中...'
                        });
                        uni.request({
                            url: app.globalData.get_request_url('favor', 'goods'),
                            method: 'POST',
                            data: {
                                "id": this.goods.id
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    this.setData({
                                        'goods.is_favor': res.data.data.status,
                                        nav_favor_button_info: {
                                            "text": res.data.data.text,
                                            "status": res.data.data.status
                                        }
                                    });
                                    app.globalData.showToast(res.data.msg, "success");
                                } else {
                                    if (app.globalData.is_login_check(res.data, this,
                                        'goods_favor_event')) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast('服务器请求出错');
                            }
                        });
                    }
                }
            },

            // 加入购物车事件
            goods_cart_event(spec) {
                var user = app.globalData.get_user_info(this, 'goods_buy_confirm_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=goods_buy_confirm_event"
                        });
                        return false;
                    } else {
                        uni.showLoading({
                            title: '处理中...'
                        });
                        uni.request({
                            url: app.globalData.get_request_url('save', 'cart'),
                            method: 'POST',
                            data: {
                                "goods_id": this.goods.id,
                                "stock": this.buy_number,
                                "spec": JSON.stringify(spec)
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();

                                if (res.data.code == 0) {
                                    this.setData({
                                        quick_nav_cart_count: res.data.data
                                    });
                                    this.popup_close_event();
                                    app.globalData.showToast(res.data.msg, "success");
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, 'goods_buy_confirm_event')) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast('服务器请求出错');
                            }
                        });
                    }
                }
            },

            // 规格事件
            goods_specifications_event(e) {
                var key = e.currentTarget.dataset.key || 0;
                var keys = e.currentTarget.dataset.keys || 0;
                var temp_data = this.goods_specifications_choose;
                var temp_images = this.goods_spec_base_images;

                // 不能选择和禁止选择跳过
                if ((temp_data[key]['value'][keys]['is_dont'] || null) == null && (temp_data[key]['value'][keys]['is_disabled'] || null) == null) {
                    // 规格选择
                    for (var i in temp_data) {
                        for (var k in temp_data[i]['value']) {
                            if ((temp_data[i]['value'][k]['is_dont'] || null) == null && (temp_data[i]['value'][k]['is_disabled'] || null) == null) {
                                if (key == i) {
                                    if (keys == k && (temp_data[i]['value'][k]['is_active'] || null) == null) {
                                        temp_data[i]['value'][k]['is_active'] = 'cr-white bg-main br-main';
                                        if ((temp_data[i]['value'][k]['images'] || null) != null) {
                                            temp_images = temp_data[i]['value'][k]['images'];
                                        }
                                    } else {
                                        temp_data[i]['value'][k]['is_active'] = '';
                                    }
                                }
                            }
                        }
                    }
                    this.setData({
                        goods_specifications_choose: temp_data,
                        goods_spec_base_images: temp_images,
                        //buy_number: this.goods.buy_min_number || 1,
                    });

                    // 不能选择规格处理
                    this.goods_specifications_choose_handle_dont(key);

                    // 获取下一个规格类型
                    this.get_goods_specifications_type(key);

                    // 获取规格详情
                    this.get_goods_specifications_detail();
                }
                
                // 已选择规格
                var spec_selected = [];
                for (var i in temp_data) {
                    for (var k in temp_data[i]['value']) {
                        if ((temp_data[i]['value'][k]['is_active'] || null) != null)
                        {
                            spec_selected.push(temp_data[i]['value'][k]['name']);
                        }
                    }
                }
                this.setData({
                    goods_spec_selected_text: (spec_selected.length <= 0) ? '请选择规格' : spec_selected.join(' / ')
                });
            },

            // 获取下一个规格类型
            get_goods_specifications_type(key) {
                var temp_data = this.goods_specifications_choose;
                var active_index = key + 1;
                var sku_count = temp_data.length;
                if (active_index <= 0 || active_index >= sku_count) {
                    return false;
                }
                
                // 获取规格值
                var spec = [];
                for (var i in temp_data) {
                    for (var k in temp_data[i]['value']) {
                        if ((temp_data[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                "type": temp_data[i]['name'],
                                "value": temp_data[i]['value'][k]['name']
                            });
                            break;
                        }
                    }
                }
                if (spec.length <= 0) {
                    return false;
                }
                var self = this;
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('spectype', 'goods'),
                    method: 'POST',
                    data: {
                        "id": this.goods.id,
                        "spec": JSON.stringify(spec)
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var spec_type = res.data.data.spec_type;
                            var spec_count = spec.length;
                            var index = spec_count > 0 ? spec_count : 0;
                            if (index < sku_count) {
                                for (var i in temp_data) {
                                    for (var k in temp_data[i]['value']) {
                                        if (index == i) {
                                            temp_data[i]['value'][k]['is_dont'] = '';
                                            var temp_value = temp_data[i]['value'][k]['name'];
                                            var temp_status = false;
                                            for (var t in spec_type) {
                                                if (spec_type[t] == temp_value) {
                                                    temp_status = true;
                                                    break;
                                                }
                                            }
                                            if (temp_status == true) {
                                                temp_data[i]['value'][k]['is_disabled'] = '';
                                            } else {
                                                temp_data[i]['value'][k]['is_disabled'] = 'spec-items-disabled';
                                            }
                                        }
                                    }
                                }
                                this.setData({
                                    goods_specifications_choose: temp_data
                                });
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 获取规格详情
            get_goods_specifications_detail() {
                // 获取规格值
                var spec = this.goods_selected_spec();

                // 存在规格的时候是否已完全选择规格
                var sku_count = this.goods_specifications_choose.length;
                var active_count = spec.length;
                if (spec.length <= 0 || active_count < sku_count) {
                    this.setData({
                        goods_spec_base_price: this.goods.price,
                        goods_spec_base_original_price: this.goods.original_price,
                        goods_spec_base_inventory: this.goods.inventory
                    });
                    return false;
                }
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('specdetail', 'goods'),
                    method: 'POST',
                    data: {
                        "id": this.goods.id,
                        "spec": JSON.stringify(spec),
                        "stock": this.buy_number,
                    },
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            this.goods_spec_detail_back_handle(res.data.data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },
            
            // 已选的商品规格
            goods_selected_spec() {
                var spec = [];
                var temp_data = this.goods_specifications_choose;
                for (var i in temp_data) {
                    for (var k in temp_data[i]['value']) {
                        if ((temp_data[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                "type": temp_data[i]['name'],
                                "value": temp_data[i]['value'][k]['name']
                            });
                            break;
                        }
                    }
                }
                return spec;
            },
            
            // 商品规格详情返回数据处理
            goods_spec_detail_back_handle(data) {
                var spec_base = data.spec_base;
                var data = {
                    goods_spec_base_price: spec_base.price,
                    goods_spec_base_original_price: spec_base.original_price,
                    goods_spec_base_inventory: spec_base.inventory,
                };

                // 已选数量是否超过规格库存
                if(this.buy_number > spec_base.inventory) {
                    data['buy_number'] = spec_base.inventory;
                }
                this.setData(data);
            },

            // 数量输入事件
            goods_buy_number_blur(e) {
                var number = parseInt(e.detail.value) || 1;
                if(isNaN(number)) {
                    number = this.goods.buy_min_number || 1;
                }
                this.goods_buy_number_func(number);
            },

            // 数量操作事件
            goods_buy_number_event(e) {
                var type = parseInt(e.currentTarget.dataset.type) || 0;
                var temp_number = parseInt(this.buy_number);
                var number = (type == 0) ? (temp_number - 1) : (temp_number + 1);
                this.goods_buy_number_func(number);
            },

            // 数量处理方法
            goods_buy_number_func(number) {
                var buy_min_number = parseInt(this.goods.buy_min_number) || 1;
                var buy_max_number = parseInt(this.goods.buy_max_number) || 0;
                var inventory = parseInt(this.goods_spec_base_inventory);
                var inventory_unit = this.goods.inventory_unit;

                if (number < buy_min_number) {
                    number = buy_min_number;
                    app.globalData.showToast('起购' + buy_min_number + inventory_unit);
                }

                if (buy_max_number > 0 && number > buy_max_number) {
                    number = buy_max_number;
                    app.globalData.showToast('限购' + buy_max_number + inventory_unit);
                }

                if (number > inventory) {
                    number = inventory;
                    app.globalData.showToast('库存数量' + inventory + inventory_unit);
                }

                this.setData({
                    buy_number: number
                });
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('stock', 'goods'),
                    method: 'POST',
                    data: {
                        "id": this.goods.id,
                        "spec": this.goods_selected_spec(),
                        "stock": this.buy_number,
                    },
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            this.goods_spec_detail_back_handle(res.data.data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 确认
            goods_buy_confirm_event(e) {
                var user = app.globalData.get_user_info(this, 'goods_buy_confirm_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=goods_buy_confirm_event"
                        });
                        return false;
                    } else {
                        // 属性
                        var temp_data = this.goods_specifications_choose;
                        var sku_count = temp_data.length;
                        var active_count = 0;
                        var spec = [];

                        if (sku_count > 0) {
                            for (var i in temp_data) {
                                for (var k in temp_data[i]['value']) {
                                    if ((temp_data[i]['value'][k]['is_active'] || null) != null) {
                                        active_count++;
                                        spec.push({
                                            "type": temp_data[i]['name'],
                                            "value": temp_data[i]['value'][k]['name']
                                        });
                                    }
                                }
                            }

                            if (active_count < sku_count) {
                                app.globalData.showToast('请选择规格');
                                return false;
                            }
                        }
                        
                        // 操作类型
                        switch (this.buy_event_type) {
                            case 'buy':
                                // 进入订单确认页面
                                var data = {
                                    "buy_type": "goods",
                                    "goods_id": this.goods.id,
                                    "stock": this.buy_number,
                                    "spec": JSON.stringify(spec)
                                };
                                uni.navigateTo({
                                    url: '/pages/buy/buy?data=' + encodeURIComponent(JSON.stringify(data))
                                });
                                this.popup_close_event();
                                break;

                            case 'cart':
                                this.goods_cart_event(spec);
                                break;

                            default:
                                app.globalData.showToast("操作事件类型有误");
                        }
                    }
                }
            },

            // 详情图片查看
            goods_detail_images_view_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value]
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
                    urls: all
                });
            },

            // 视频播放
            goods_video_play_event(e) {
                this.setData({
                    goods_video_is_autoplay: true
                });
            },

            // 视频关闭
            goods_video_close_event(e) {
                this.setData({
                    goods_video_is_autoplay: false
                });
            },

            // 分享开启弹层
            popup_share_event(e) {
                this.setData({
                    popup_share_status: true
                });
            },

            // 分享弹层关闭
            popup_share_close_event(e) {
                this.setData({
                    popup_share_status: false
                });
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
                    var timer = setInterval(function() {
                        self.setData({
                            plugins_salerecords_tips_content: list[index]
                        });
                        setTimeout(function() {
                            self.setData({
                                plugins_salerecords_tips_content: null
                            });
                        }, pause);
                        index++;
                        if (index >= count) {
                            index = 0;
                        }
                    }, interval);
                    self.setData({
                        plugins_salerecords_timer: timer,
                        plugins_salerecords_tips_ent: location
                    });
                }
            },

            // 商品海报分享
            poster_event() {
                var user = app.globalData.get_user_info(this, 'poster_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=poster_event"
                        });
                        return false;
                    } else {
                        uni.showLoading({
                            title: '生成中...'
                        });
                        uni.request({
                            url: app.globalData.get_request_url('goodsposter', 'distribution', 'distribution'),
                            method: 'POST',
                            data: {
                                "goods_id": this.goods.id
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();

                                if (res.data.code == 0) {
                                    uni.previewImage({
                                        current: res.data.data,
                                        urls: [res.data.data]
                                    });
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, 'poster_event')) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast("服务器请求出错");
                            }
                        });
                    }
                }
            },
            
            // 优惠券开启弹层
            popup_coupon_event(e) {
                this.setData({
                    popup_coupon_status: true
                });
            },
            
            // 优惠券弹层关闭
            popup_coupon_close_event(e) {
                this.setData({
                    popup_coupon_status: false
                });
            },

            // 优惠劵领取事件
            coupon_receive_event(e) {
                // 参数处理
                if ((e || null) == null) {
                    var index = this.temp_coupon_receive_index;
                    var value = this.temp_coupon_receive_value;
                } else {
                    var index = e.currentTarget.dataset.index;
                    var value = e.currentTarget.dataset.value;
                    this.setData({
                        temp_coupon_receive_index: index,
                        temp_coupon_receive_value: value
                    });
                }
                // 是否可以领取
                var temp_list = this.plugins_coupon_data.data;
                if (temp_list[index]['is_operable'] != 1) {
                    return false;
                }
                
                // 登录校验
                var user = app.globalData.get_user_info(this, 'coupon_receive_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=coupon_receive_event"
                        });
                        return false;
                    } else {
                        uni.showLoading({
                            title: "处理中..."
                        });
                        uni.request({
                            url: app.globalData.get_request_url("receive", "coupon", "coupon"),
                            method: "POST",
                            data: {
                                "coupon_id": value
                            },
                            dataType: "json",
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    app.globalData.showToast(res.data.msg, "success");
                                    if (this.plugins_coupon_data.base != null && this
                                        .plugins_coupon_data.base.is_repeat_receive != 1) {
                                        temp_list[index]['is_operable'] = 0;
                                        temp_list[index]['is_operable_name'] = '已领取';
                                        this.setData({
                                            'plugins_coupon_data.data': temp_list
                                        });
                                    }
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, 'coupon_receive_event')) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast("服务器请求出错");
                            }
                        });
                    }
                }
            },
            
            // 评价图片预览
            comment_images_show_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                uni.previewImage({
                    current: this.goods.comments_data[index]['images'][ix],
                    urls: this.goods.comments_data[index]['images']
                });
            }
        }
    };
</script>
<style>
    @import './goods-detail.css';
</style>