<template>
    <view>
        <!-- 顶部导航 -->
        <view v-if="goods != null" :class="'page '+(is_single_page == 1 ? ' single-page-top' : '')">
            <!-- 单页模式不展示导航栏 -->
            <block v-if="is_single_page == 0">
                <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
                <!-- 小导航 -->
                <view class="top-nav-left-icon pf" :style="'top:'+top_nav_icon_top_value+'px;'">
                    <uni-icons type="arrowleft" size="20" color="#333" class="icon round cp" @tap="top_nav_left_back_event"></uni-icons>
                    <uni-icons v-if="nav_more_list.length > 0" type="list" size="20" color="#333" class="icon round cp margin-left-lg" @tap="top_nav_left_more_event"></uni-icons>
                </view>
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU || H5 || APP -->
                <!-- 更多导航 -->
                <view v-if="nav_more_list.length > 0 && nav_more_status" class="nav-more-view tc" :style="'top:'+top_nav_more_top_value+'px;'">
                    <view class="triangle dis-inline-block pa"></view>
                    <view class="content radius padding-horizontal-main">
                        <block v-for="(item,index) in nav_more_list" :key="index">
                            <view class="item padding-main cp" :data-value="item.url" data-type="1" @tap="nav_more_event">
                                <view class="va-m dis-inline-block">
                                    <uni-icons :type="item.icon" size="16" color="#fff"></uni-icons>
                                </view>
                                <text class="cr-white va-m margin-left-sm">{{item.name}}</text>
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
                                    <text :class="'cp '+(top_nav_title_index == index ? 'nav-active border-color-main' : '')" :data-index="index" :data-value="item.ent" @tap="top_nav_title_event">{{item.name}}</text>
                                </block>
                            </view>
                        </view>
                    </component-trn-nav>
                </block>
                <!-- #endif -->
                <!-- #ifdef H5 || APP -->
                <!-- 右侧icon -->
                <view class="top-nav-right-icon pf" :style="'top:'+top_nav_icon_top_value+'px;left:'+top_nav_right_icon_left_value+'px;'">
                    <uni-icons type="redo" size="20" color="#333" class="icon round cp" @tap="popup_share_event"></uni-icons>
                </view>
                <!-- #endif -->
            </block>

            <!-- 相册 -->
            <view class="goods-photo bg-white oh pr" v-if="goods_photo.length > 0" :style="'height: ' + photo_height + ' !important;'">
                <!-- 视频 -->
                <block v-if="goods.video.length > 0">
                    <view v-if="goods_video_is_autoplay" class="goods-video pa tc">
                        <video :src="goods.video" :autoplay="goods_video_is_autoplay" :show-center-play-btn="true" :controls="false" :show-play-btn="false" :enable-progress-gesture="false" :show-fullscreen-btn="false" :style="'height: ' + photo_height + ' !important;'"></video>
                    </view>
                    <view class="goods-video-submit pa">
                        <image v-if="!goods_video_is_autoplay" class="goods-video-play cp" @tap="goods_video_play_event" :src="common_static_url+'video-play-icon.png'" mode="aspectFit"></image>
                        <image v-if="goods_video_is_autoplay" class="goods-video-close cp" @tap="goods_video_close_event" :src="common_static_url+'video-close-icon.png'" mode="aspectFit"></image>
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
                <view v-if="(plugins_label_data || null) != null && plugins_label_data.data.length > 0" :class="'plugins-label oh pa plugins-label-'+((plugins_label_data.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(plugins_label_data.base.user_goods_show_style || 'top-left')">
                    <block v-for="(lv,li) in plugins_label_data.data" :key="li">
                        <view class="lv dis-inline-block va-m" :data-value="((plugins_label_data.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
                            <view v-if="(plugins_label_data.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">{{lv.name}}</view>
                            <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                        </view>
                    </block>
                </view>
            </view>
            
            <!-- 价格信息 -->
            <view :class="'goods-base-price bg-white oh spacing-mb '+((plugins_seckill_is_valid == 1) ? 'goods-base-price-countdown' : '')">
                <!-- 价格 -->
                <view class="price-content padding-lg" :style="(plugins_seckill_is_valid == 1) ? 'background-image: url('+plugins_seckill_data.bg_img+')' : ''">
                    <view class="single-text">
                        <text v-if="(show_field_price_text || null) != null" class="price-icon round va-m">{{show_field_price_text}}</text>
                        <text class="sales-price va-m">{{currency_symbol}}{{goods_spec_base_price}}</text>
                    </view>
                    <view v-if="(goods_spec_base_original_price || null) != null && goods_spec_base_original_price != 0" class="original-price margin-top-sm single-text">{{currency_symbol}}{{goods_spec_base_original_price}}</view>
                </view>
                <!-- 秒杀 -->
                <view v-if="plugins_seckill_is_valid == 1" class="countdown-content padding-top-lg padding-bottom-lg padding-left-xs padding-right-xs fr tc">
                    <view class="time-title cr-white single-text">{{plugins_seckill_data.title || '限时秒杀'}}</view>
                    <component-countdown :propHour="plugins_seckill_data.time.hours" :propMinute="plugins_seckill_data.time.minutes" :propSecond="plugins_seckill_data.time.seconds" :propMsecShow="true" propTimeSize="32" propTimePadding="0" propTimeWeight="bold" propTimeBackgroundColor="transparent" propTimeColor="#ffe500" propDsColor="#fff"></component-countdown>
                </view>
            </view>

            <view class="padding-horizontal-main">
                <!-- 基础信息 -->
                <view class="goods-base-content border-radius-main bg-white spacing-mb">
                    <view class="padding-main">
                        <view class="goods-title-content oh">
                            <!-- 标题 -->
                            <view class="goods-title fl" :style="'color:' + goods.title_color">
                                <text class="va-m">{{goods.title}}</text>
                                <!-- icon -->
                                <view v-if="(goods.plugins_view_icon_data || null) != null && goods.plugins_view_icon_data.length > 0" class="goods-icon-container dis-inline-block va-m">
                                    <block v-for="(item, index) in goods.plugins_view_icon_data" :key="index">
                                        <text v-if="(item.name || null) != null" class="item round text-size-xs bg-white margin-left-sm" :style="((item.br_color || null) == null ? '' : 'border:1px solid '+item.br_color+';') + '' + ((item.color || null) == null ? '' : 'color: '+item.color+';')" :data-value="item.url || ''" @tap="url_event">{{item.name}}</text>
                                    </block>
                                </view>
                            </view>
                            <!-- 分享 -->
                            <view class="goods-share tc cp pa" @tap="popup_share_event">
                                <image :src="common_static_url+'share-icon.png'" mode="scaleToFill" class="dis-block auto"></image>
                                <view class="cr-gray text-size-xs">分享</view>
                            </view>
                        </view>

                        <!-- 简述 -->
                        <view v-if="(goods.simple_desc || null) != null" class="cr-red text-size-xs margin-top-lg">{{goods.simple_desc}}</view>
                    </view>

                    <!-- 基础总计数据 -->
                    <view class="br-t padding-main">
                        <view class="base-grid oh padding-top-sm padding-bottom-sm text-size-xs">
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

                <!-- 智能工具-基础提示信息 -->
                <view v-if="((plugins_intellectstools_data || null) != null) && (plugins_intellectstools_data.base_bottom || null) != null && (plugins_intellectstools_data.base_bottom.msg || null) != null" class="plugins-intellectstools-base-bottom-container spacing-mb">
                    <view class="notice-content text-size-xs">
                        <view class="va-m dis-inline-block margin-right-xs">
                            <uni-icons type="notification" size="32rpx" color="#dd514c"></uni-icons>
                        </view>
                        <text v-if="(plugins_intellectstools_data.base_bottom.title || null) != null" class="fw-b">{{plugins_intellectstools_data.base_bottom.title}}</text>
                        <view>{{plugins_intellectstools_data.base_bottom.msg}}</view>
                    </view>
                </view>

                <!-- 批发 -->
                <view v-if="((plugins_wholesale_data || null) != null)" class="plugins-wholesale-container-view pr oh padding-main border-radius-main bg-white arrow-right text-size-xs spacing-mb">
                    <view class="fl item-title margin-top-sm">{{plugins_wholesale_data.title}}</view>
                    <view class="fr column-right-view border-radius-main single-text" @tap="popup_wholesale_event">
                        <block  v-for="(item, index) in plugins_wholesale_data.rules" :key="index">
                            <view class="item round dis-inline-block">{{item.msg}}</view>
                        </block>
                    </view>
                </view>

                <!-- 优惠券 -->
                <view v-if="(plugins_coupon_data || null) != null && plugins_coupon_data.data.length > 0" class="plugins-coupon-container-view pr oh padding-main border-radius-main bg-white arrow-right text-size-xs spacing-mb">
                    <view class="fl item-title margin-top-sm">优惠券</view>
                    <view class="fr column-right-view border-radius-main single-text cp" @tap="popup_coupon_event">
                        <block v-for="(item, index) in plugins_coupon_data.data" :key="index">
                            <view class="item round cr-white dis-inline-block" :style="'background:' + item.bg_color_value + ';border:1px solid ' + item.bg_color_value + ';'">{{item.desc || item.name}}</view>
                        </block>
                    </view>
                </view>

                <!-- 规格选择 -->
                <view v-if="goods.is_exist_many_spec == 1 && ((buy_button || null) != null && ((buy_button.is_buy || 0)+(buy_button.is_cart || 0)+(buy_button.is_show || 0) > 0))" class="spec-container-view oh padding-horizontal-main padding-main border-radius-main bg-white arrow-right text-size-xs spacing-mb">
                    <view class="fl item-title">规格</view>
                    <view class="fr column-right-view border-radius-main cr-base single-text cp" @tap="nav_buy_submit_event" :data-type="((buy_button.is_buy || 0) == 1) ? 'buy' : (((buy_button.is_cart || 0) == 1) ? 'cart' : 'show')">{{goods_spec_selected_text}}</view>
                </view>
            </view>

            <view class="padding-horizontal-main">
                <!-- 面板提示信息 -->
                <view v-if="(goods.plugins_view_panel_data || null) != null && goods.plugins_view_panel_data.length > 0" class="goods-panel-container oh border-radius-main padding-horizontal-main padding-top-xs padding-bottom-xs bg-white text-size-xs spacing-mb">
                    <block v-for="(item, index) in goods.plugins_view_panel_data" :key="index">
                        <view v-if="(item || null) != null">{{item}}</view>
                    </block>
                </view>

                <!-- 商品基础参数 -->
                <view v-if="(goods.parameters || null) != null && (goods.parameters.base || null) != null && goods.parameters.base.length > 0" class="goods-parameters parameters-base border-radius-main padding-main bg-white arrow-right single-text text-size-xs spacing-mb" @tap="popup_params_event" data-value="base">
					<block v-for="(item, index) in goods.parameters.base" :key="index">
						<text v-if="index > 0">，</text>
						<text>{{item.value}}</text>
					</block>
                </view>

                <!-- 商品服务 -->
                <view v-if="(plugins_goodsservice_data || null) != null && plugins_goodsservice_data.length > 0" class="plugins-goodsservice-view-container border-radius-main padding-main bg-white arrow-right single-text text-size-xs spacing-mb" @tap="popup_goodsservice_event">
                    <block v-for="(item, index) in plugins_goodsservice_data" :key="index">
                        <view :class="'item dis-inline-block '+(index > 0 ? 'margin-left-xxl' : '')">
                            <image class="va-m" :src="item.images" mode="widthFix"></image>
                            <text class="cr-base va-m margin-left-sm">{{item.name}}</text>
                        </view>
                    </block>
                </view>

                <!-- 组合搭配 -->
                <block v-if="plugins_binding_data != null">
                    <component-binding-list :propData="plugins_binding_data" :propLabel="plugins_label_data"></component-binding-list>
                </block>

                <!-- 门店 -->
                <view v-if="plugins_realstore_data != null && plugins_realstore_data.length > 0" class="plugins-realstore-container">
                    <view class="spacing-nav-title">
                        <text class="line"></text>
                        <text class="text-wrapper">相关门店</text>
                        <text class="arrow-right padding-right-xxxl cr-gray fr" data-value="/pages/plugins/realstore/index/index" @tap="url_event">更多</text>
                    </view>
                    <component-realstore-list :propDataList="plugins_realstore_data" :propIsFavor="false"></component-realstore-list>
                </view>

                <!-- 多商户 -->
                <block v-if="plugins_shop_data != null">
                    <component-shop-list :propDataList="[plugins_shop_data]"></component-shop-list>
                </block>

                <!-- 商品评价 -->
                <view v-if="common_is_show_goods_comments == 1" class="goods-comment spacing-mb">
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
                                    <image class="avatar dis-block fl" :src="item.user.avatar || common_static_url+'default-user.png'" mode="aspectFit"></image>
                                    <view class="base-nav fr">
                                        <text class="va-m">{{item.user.user_name_view}}</text>
                                        <view class="dis-inline-block va-m margin-left-sm">
                                            <uni-rate :value="item.rating" :readonly="true" :is-fill="false" :size="14" />
                                        </view>
                                        <view class="fr">
                                            <text class="cr-grey text-size-xs">{{item.add_time_date}}</text>
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
                            <view class="tc">
                                <text class="cr-grey" :data-value="'/pages/goods-comment/goods-comment?goods_id=' + goods.id" @tap="url_event">查看更多评价 >></text>
                            </view>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-sm padding-bottom-sm">暂无评价数据</view>
                        </block>
                    </view>
                </view>

                <!-- 智能工具-详情顶部提示信息 -->
                <view v-if="((plugins_intellectstools_data || null) != null) && (plugins_intellectstools_data.content_top || null) != null && (plugins_intellectstools_data.content_top.msg || null) != null && plugins_intellectstools_data.content_top.msg.length > 0" class="plugins-intellectstools-content-top-container panel-item panel-item-only padding-main border-radius-main text-size-xs spacing-mb">
                    <view v-if="((plugins_intellectstools_data.content_top.title || null) != null)" class="panel-title padding-bottom-main fw-b text-size margin-bottom-main">{{plugins_intellectstools_data.content_top.title}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in plugins_intellectstools_data.content_top.msg" :key="index" class="item padding-top-sm padding-bottom-sm">
                            <view class="content">{{item}}</view>
                        </view>
                    </view>
                </view>

                <!-- 商品详情参数 -->
                <view v-if="(goods.parameters || null) != null && (goods.parameters.detail || null) != null && goods.parameters.detail.length > 0" class="spacing-mb">
                    <view class="spacing-nav-title">
                        <text class="line"></text>
                        <text class="text-wrapper">商品参数</text>
                    </view>
                    <view class="goods-parameters border-radius-main padding-main bg-white">
                        <view class="content-item oh">
							<view class="oh">
								<block v-for="(item, index) in goods.parameters.detail" :key="index">
									<view v-if="index <= 3" class="item single-text cr-base text-size-xs">
										<text class="name">{{item.name}}:</text>
										<text class="value">{{item.value}}</text>
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
                    <view class="spacing-nav-title">
                        <text class="line"></text>
                        <text class="text-wrapper">商品详情</text>
                    </view>
                    <view class="border-radius-main oh bg-white">
                        <block v-if="(common_is_goods_detail_show_photo == 1 && goods_photo.length > 0) || (common_app_is_use_mobile_detail == 0 && (goods.content_web || null) != null) || (common_app_is_use_mobile_detail == 1 && goods_content_app.length > 0)">
                            <!-- 是否详情展示相册 -->
                            <block v-if="common_is_goods_detail_show_photo == 1 && goods_photo.length > 0">
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
                                        <view v-for="(items, index2) in item.content" :key="index2">{{items}}</view>
                                    </view>
                                </view>
                            </block>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xxl padding-bottom-xxl">暂无详情数据</view>
                        </block>
                    </view>
                </view>
            </view>
            
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 底部操作 -->
            <view class="goods-buy-nav oh wh-auto bg-white br-t bottom-line-exclude">
                <!-- 左侧集合操作 -->
                <view :class="'bus-items fl tc bus-items-'+bottom_nav_bus_number">
                    <!-- 是否指定返回操作、返回操作情况下仅展示返回和收藏操作 -->
                    <block v-if="is_opt_back == 1 && is_goods_bottom_opt_back == 1">
                        <!-- 返回操作 -->
                        <view class="item fl cp" @tap="bottom_nav_back_event">
                            <image :src="common_static_url+'back-icon.png'" mode="scaleToFill"></image>
                            <text class="dis-block text-size-xs cr-gray">返回</text>
                        </view>
                    </block>
                    <block v-else>
                        <!-- 首页 -->
                        <view class="item fl cp" @tap="shop_event">
                            <image :src="nav_home_button_info.icon" mode="scaleToFill"></image>
                            <text class="dis-block text-size-xs cr-gray">{{nav_home_button_info.text}}</text>
                        </view>
                    </block>
                    <!-- 客服 -->
                    <component-online-service v-if="common_app_is_online_service == 1" :propIsGoods="true" :propIsNav="true" :propCard="true" :propTitle="goods.title" :propImg="goods.images" :propPath="'/pages/goods-detail/goods-detail?id='+goods.id" :propChatUrl="(plugins_chat_data == null) ? '' : plugins_chat_data.chat_url"></component-online-service>
                    <!-- 购物车 -->
                    <view v-if="is_opt_cart == 1" class="item fl cp" data-value="/pages/cart-page/cart-page" @tap="url_event">
                        <view class="badge-icon">
                            <component-badge :propNumber="quick_nav_cart_count"></component-badge>
                        </view>
                        <image :src="common_static_url+'cart-icon.png'" mode="scaleToFill"></image>
                        <text class="dis-block text-size-xs cr-gray">购物车</text>
                    </view>
                    <!-- 收藏 -->
                    <view class="item fl cp" @tap="goods_favor_event">
                        <image :src="common_static_url+'favor'+(nav_favor_button_info.status == 1 ? '-active' : '')+'-icon.png'" mode="scaleToFill"></image>
                        <text :class="'dis-block text-size-xs ' + (nav_favor_button_info.status == 1 ? 'cr-main' : 'cr-gray')">{{nav_favor_button_info.text}}</text>
                    </view>
                </view>
                <!-- 右侧主操作 -->
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

			<!-- 商品参数弹窗 -->
			<component-popup :propShow="popup_params_status" propPosition="bottom" @onclose="popup_params_close_event">
			    <view class="padding-horizontal-main padding-top-main bg-white">
			        <view class="close oh">
			            <view class="fr" @tap.stop="popup_params_close_event">
			                <icon type="clear" size="20"></icon>
			            </view>
			        </view>
			        <view class="popup-params-container">
			            <block v-if="(goods.parameters || null) != null && (goods.parameters[popup_params_type_field] || null) != null && goods.parameters[popup_params_type_field].length > 0">
							<block v-for="(item, index) in goods.parameters[popup_params_type_field]" :key="index">
								<view class="item padding-vertical-main br-b oh">
									<view class="name fl br-r single-text">{{item.name}}</view>
									<view class="value fr padding-left single-text">{{item.value}}</view>
								</view>
							</block>
			            </block>
			            <block v-else>
			                <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">无参数数据</view>
			            </block>
			        </view>
			    </view>
			</component-popup>

            <!-- 批发弹层 -->
            <component-popup :propShow="popup_wholesale_status" propPosition="bottom" @onclose="popup_wholesale_close_event">
                <view class="padding-horizontal-main padding-top-main bg-base">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_wholesale_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <view class="plugins-wholesale-container">
                        <block v-if="(plugins_wholesale_data || null) != null">
                            <text v-if="(plugins_wholesale_data.spec_tips || null) != null" class="spec-tips pa round">{{plugins_wholesale_data.spec_tips}}</text>
                            <view class="oh">
                                <block v-for="(item, index) in plugins_wholesale_data.rules" :key="index">
                                    <view class="item padding-main bg-white border-radius-main oh dis-inline-block tc">
                                        <text class="cr-base">{{item.arr.msg}}</text>
                                        <text class="margin-left-sm cr-main fw-b text-size-lg">{{item.arr.val}}</text>
                                        <text class="cr-grey margin-left-xs">{{item.arr.unit}}</text>
                                    </view>
                                </block>
                            </view>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">无批发信息</view>
                        </block>
                    </view>
                </view>
            </component-popup>
            
            <!-- 优惠券弹层 -->
            <component-popup :propShow="popup_coupon_status" propPosition="bottom" @onclose="popup_coupon_close_event">
                <view class="padding-horizontal-main padding-top-main bg-base">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_coupon_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <view class="plugins-coupon-container padding-bottom-main">
                        <block v-if="(plugins_coupon_data || null) != null && plugins_coupon_data.data.length > 0">
                            <block v-for="(item, index) in plugins_coupon_data.data" :key="index">
                                <view :class="'item bg-white border-radius-main ' + (item.is_operable == 0 ? 'item-disabled' : '')">
                                    <view class="v-left fl">
                                        <view class="base single-text" :style="'color:' + item.bg_color_value + ';'">
                                            <text v-if="item.type == 0" class="symbol">{{currency_symbol}}</text>
                                            <text class="price">{{item.discount_value}}</text>
                                            <text class="unit">{{item.type_unit}}</text>
                                        </view>
                                        <view v-if="(item.use_limit_type_name || null) != null" class="base-tips cr-base single-text">{{item.use_limit_type_name}}</view>
                                        <view v-if="(item.desc || null) != null" class="desc margin-top-xs cr-gray single-text text-size-xs">{{item.desc}}</view>
                                    </view>
                                    <view class="v-right fr cp" @tap="coupon_receive_event" :data-index="index" :data-value="item.id" :style="'background:' + item.bg_color_value + ';'">
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
            
            <!-- 门店弹层 -->
            <component-popup :propShow="popup_realstore_status" propPosition="bottom" @onclose="popup_realstore_close_event">
                <view class="padding-horizontal-main padding-top-main bg-base">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_realstore_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <view class="plugins-realstore-popup">
                        <block v-if="(plugins_realstore_data || null) != null && plugins_realstore_data.length > 0">
                            <component-realstore-list :propDataList="plugins_realstore_data" :propIsFavor="false"></component-realstore-list>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">无相关门店信息</view>
                        </block>
                    </view>
                </view>
            </component-popup>

            <!-- 商品服务弹层 -->
            <component-popup :propShow="popup_goodsservice_status" propPosition="bottom" @onclose="popup_goodsservice_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_goodsservice_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <view class="plugins-goodsservice-container">
                        <block v-if="(plugins_goodsservice_data || null) != null && plugins_goodsservice_data.length > 0">
                            <block v-for="(item, index) in plugins_goodsservice_data" :key="index">
                                <view :class="'item oh padding-vertical-main '+(index > 0 ? 'br-t' : '')">
                                    <view class="fl left">
                                        <image class="dis-block" :src="item.images" mode="widthFix"></image>
                                    </view>
                                    <view class="fr right tl">
                                        <view class="cr-base fw-b text-size-sm">{{item.name}}</view>
                                        <view class="cr-grey text-size-xs margin-top-xs">{{item.describe}}</view>
                                    </view>
                                </view>
                            </block>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">无相关服务信息</view>
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
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

        <!-- 无商品信息展示返回按钮 -->
        <view v-if="goods == null && data_list_loding_status != 1" class="tc margin-top-xxxl">
            <button type="default" class="bg-main br-main cr-white round" size="mini" @tap="goods_error_event">返回</button>
        </view>
        
        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>

        <!-- 商品购买 -->
        <component-goods-buy ref="goods_buy" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>

        <!-- 商品批量下单 -->
        <component-goods-batch-buy ref="goods_batch_buy" v-on:BatchCartSuccessEvent="batch_goods_cart_back_event"></component-goods-batch-buy>

        <!-- 快捷导航 -->
        <component-quick-nav :propIsNav="true"></component-quick-nav>
    </view>
</template>
<script>
    const app = getApp();
    import componentGoodsBuy from "../../components/goods-buy/goods-buy";
    import componentGoodsBatchBuy from "../../components/goods-batch-buy/goods-batch-buy";
    import componentQuickNav from "../../components/quick-nav/quick-nav";
    import componentPopup from "../../components/popup/popup";
    import componentBadge from "../../components/badge/badge";
    import componentTrnNav from "../../components/trn-nav/trn-nav";
    import componentCountdown from "../../components/countdown/countdown";
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";
    import componentOnlineService from "../../components/online-service/online-service";
    import componentRealstoreList from "../../components/realstore-list/realstore-list";
    import componentShopList from "../../components/shop-list/shop-list";
    import componentBindingList from "../../components/binding-list/binding-list";
    import componentSharePopup from "../../components/share-popup/share-popup";

    var common_static_url = app.globalData.get_static_url('common');
    var system_info = app.globalData.get_system_info() || {};
    var bar_height = parseInt(system_info.statusBarHeight || 0);
    var win_width = parseInt(system_info.windowWidth || system_info.screenWidth || 0);
    export default {
        data() {
            return {
                status_bar_height: bar_height,
                common_static_url: common_static_url,
                indicator_dots: false,
                indicator_color: 'rgba(0, 0, 0, .2)',
                indicator_active_color: '#666',
                autoplay: true,
                circular: true,
                load_status: 0,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                system_info: system_info,
                photo_height: (win_width <= 0) ? '55vh' : app.globalData.window_width_handle(win_width) + 'px',
                goods: null,
                goods_photo: [],
                goods_specifications_choose: [],
                goods_content_app: [],
                popup_buy_status: false,
                buy_event_type: 'buy',
                buy_button: {},
                goods_spec_base_price: 0,
                goods_spec_base_original_price: 0,
                goods_spec_selected_text: '请选择规格',
                show_field_price_text: null,
                goods_video_is_autoplay: false,
                // 更多导航
                nav_more_status: false,
                nav_more_timer: null,
                nav_more_list: [],
                // 导航首页按钮
                nav_home_button_info: {
                    "text": "首页",
                    "icon": common_static_url+"home-icon.png",
                    "value": app.globalData.data.tabbar_pages[0]
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
                plugins_is_goods_detail_poster: 0,
                common_app_is_online_service: 0,
                common_app_is_use_mobile_detail: 0,
                common_is_goods_detail_show_photo: 0,
                common_is_show_goods_comments: 1,
                common_app_customer_service_tel: null,
                // 是否单页预览
                is_single_page: app.globalData.is_current_single_page() || 0,
                // 底部导航业务操作按钮数量
                bottom_nav_bus_number: 4,
                // 是否底部导航展示返回按钮
                is_opt_back: 0,
                is_goods_bottom_opt_back: 0,
                // 是否开启购物车
                is_opt_cart: 1,
                // 滚动监听值
                scroll_value: 0,
                // 顶部导航信息
                // #ifdef MP
                top_nav_icon_top_value: bar_height+8,
                top_nav_more_top_value: bar_height+48,
                // #endif
                // #ifdef H5 || APP
                top_nav_icon_top_value: 6,
                top_nav_more_top_value: 50,
                top_nav_right_icon_left_value: (win_width <= 800) ? win_width-40 : win_width-((win_width-800)/2)-40,
                // #endif
                top_nav_height: 50,
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
                plugins_seckill_is_valid: 0,
                plugins_seckill_data: null,
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
                // 批发插件
                plugins_wholesale_data: null,
                popup_wholesale_status: false,
                // 标签插件
                plugins_label_data: null,
                // 智能工具插件
                plugins_intellectstools_data: null,
                // 客服插件
                plugins_chat_data: null,
                // 门店插件
                plugins_realstore_data: null,
                popup_realstore_status: false,
                // 组合搭配插件
                plugins_binding_data: null,
                // 商品服务插件
                plugins_goodsservice_data: null,
                popup_goodsservice_status: false,
                // 商品批量下单插件
                plugins_batchbuy_data: null
            };
        },

        components: {
            componentGoodsBuy,
            componentGoodsBatchBuy,
            componentQuickNav,
            componentPopup,
            componentBadge,
            componentCountdown,
            componentNoData,
            componentTrnNav,
            componentBottomLine,
            componentOnlineService,
            componentRealstoreList,
            componentShopList,
            componentBindingList,
            componentSharePopup
        },

        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params,
                // 是否自定义购买事件
                buy_event_type: params.opt_buy_event_type || 'buy',
                // 是否指定开启购买弹窗、默认0否、1是
                popup_buy_status: parseInt(params.is_opt_buy_status || 0) == 1,
                // 是否底部导航展示返回按钮
                is_opt_back: parseInt(params.is_opt_back || 0),
                is_goods_bottom_opt_back: app.globalData.data.is_goods_bottom_opt_back || 0,
                // 是否自定义购物车状态
                is_opt_cart: (params.is_opt_cart === undefined) ? (app.globalData.data.is_goods_bottom_opt_cart || 0) : parseInt(params.is_opt_cart || 0),
            });
        },

        onShow() {
            // 初始化配置
            this.init_config();

            // 数据加载
            this.init();
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
            var upd_data = {scroll_value: e.scrollTop};
            
            // 更多导航状态处理
            if(this.nav_more_status) {
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
                query.exec(function(res) {
                    var bar_h = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
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

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        common_app_is_online_service: app.globalData.get_config('config.common_app_is_online_service', 0),
                        common_app_is_use_mobile_detail: app.globalData.get_config('config.common_app_is_use_mobile_detail'),
                        common_is_goods_detail_show_photo: app.globalData.get_config('config.common_is_goods_detail_show_photo'),
                        common_is_show_goods_comments: app.globalData.get_config('config.common_is_show_goods_comments', 1),
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                        plugins_is_goods_detail_poster: app.globalData.get_config('plugins_base.distribution.data.is_goods_detail_poster')
                    });
                    
                    // 底部业务导航按钮数量处理
                    var value = 4;
                    if(this.is_opt_cart != 1) {
                        value--;
                    }
                    if(this.common_app_is_online_service != 1) {
                        value--;
                    }
                    this.setData({bottom_nav_bus_number: value});
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                uni.showLoading({
                    title: '加载中...'
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "goods"),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var goods = data.goods;
                            if(this.load_status == 1) {
                                this.setData({quick_nav_cart_count: data.cart_total.buy_number || 0});
                            } else {
                                var upd_data = {
                                    data_bottom_line_status: true,
                                    data_list_loding_status: 3,
                                    load_status: 1,
                                    goods: goods,
                                    indicator_dots: goods.photo.length > 1,
                                    autoplay: goods.photo.length > 1,
                                    goods_photo: goods.photo,
                                    nav_more_list: data.nav_more_list || [],
                                    goods_content_app: goods.content_app || [],
                                    nav_favor_button_info: {
                                        "text": (goods.is_favor == 1 ? '已' : '') + '收藏',
                                        "status": goods.is_favor
                                    },
                                    buy_button: data.buy_button || null,
                                    top_nav_title_data: data.middle_tabs_nav || [],
                                    goods_spec_base_price: goods.price,
                                    goods_spec_base_original_price: goods.original_price || 0,
                                    show_field_price_text: goods.show_field_price_text == '价格' ? null : goods.show_field_price_text.replace(/<[^>]+>/g, "") || null,
                                    plugins_seckill_data: data.plugins_seckill_data || null,
                                    plugins_seckill_is_valid: (data.plugins_seckill_data || null) != null && (data.plugins_seckill_data.is_valid || 0) == 1 ? 1 : 0,
                                    plugins_coupon_data: data.plugins_coupon_data || null,
                                    quick_nav_cart_count: data.cart_total.buy_number || 0,
                                    plugins_salerecords_data: data.plugins_salerecords_data || null,
                                    plugins_shop_data: data.plugins_shop_data || null,
                                    plugins_wholesale_data: ((data.plugins_wholesale_data || null) == null) ? null : data.plugins_wholesale_data,
                                    plugins_label_data: (data.plugins_label_data || null) == null || (data.plugins_label_data.base || null) == null || (data.plugins_label_data.data || null) == null || data.plugins_label_data.data.length <= 0 ? null : data.plugins_label_data,
                                    plugins_intellectstools_data: data.plugins_intellectstools_data || null,
                                    plugins_chat_data: data.plugins_chat_data || null,
                                    plugins_realstore_data: data.plugins_realstore_data || null,
                                    plugins_binding_data: data.plugins_binding_data || null,
                                    plugins_goodsservice_data: data.plugins_goodsservice_data || null,
                                    plugins_batchbuy_data: data.plugins_batchbuy_data || null
                                };
                                // 导航首页按钮
                                if ((data.nav_home_button_info || null) != null) {
                                    upd_data['nav_home_button_info'] = data.nav_home_button_info;
                                }
                                this.setData(upd_data);
                            }

                            // 如果已默认开启购买弹窗，库存为0则不开启
                            if(this.popup_buy_status && parseInt(goods.inventory) > 0) {
                                if((this.$refs.goods_buy || null) != null) {
                                    var buy_params = this.params;
                                    buy_params['buy_event_type'] = this.buy_event_type;
                                    this.$refs.goods_buy.init(this.goods, buy_params);
                                }
                            }

                            // 分享配置
                            this.setData({
                                // 基础自定义分享
                                share_info: {
                                    title: goods.seo_title || goods.title,
                                    kds: goods.seo_keywords || goods.simple_desc,
                                    desc: goods.seo_desc || goods.simple_desc,
                                    path: '/pages/goods-detail/goods-detail',
                                    query: 'id=' + goods.id,
                                    img: goods.images,
                                    video: goods.video
                                }
                            });

                            // 购买记录提示
                            this.plugins_salerecords_tips_handle();
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        uni.hideLoading();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 返回事件
            top_nav_left_back_event(e) {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0]
                    });
                } else {
                    uni.navigateBack();
                }
            },
            
            // 更多事件
            top_nav_left_more_event(e) {
                if(this.nav_more_list.length <= 0) {
                    app.globalData.showToast('无更多列表数据');
                    return false;
                }
                
                // 已开启则关闭并取消定时任务
                var data = {};
                clearInterval(this.nav_more_timer);
                if(this.nav_more_status) {
                    data['nav_more_status'] = false;
                } else {
                    var self = this;
                    data['nav_more_status'] = true;
                    data['nav_more_timer'] = setTimeout(function() {
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
                query.exec(function(res) {
                    // 选中
                    self.top_nav_title_index = index;

                    // 距离计算
                    var bar_h = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
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

            // 进入店铺
            shop_event(e) {
                app.globalData.url_open(this.nav_home_button_info.value);
            },

            // 导航购买按钮事件
            nav_buy_submit_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
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
                        this.setData({buy_event_type: type});
                        if((this.$refs.goods_buy || null) != null) {
                            var buy_params = this.params;
                            buy_params['buy_event_type'] = this.buy_event_type;
                            this.$refs.goods_buy.init(this.goods, buy_params);
                        }
                        break;
                    // url事件
                    case 'url':
                        if(value == null) {
                            app.globalData.showToast('url事件为空');
                            return false;
                        }
                        app.globalData.url_open(value);
                        break;
                    // 门店
                    case 'plugins-realstore' :
                        var temp_data_list = this.plugins_realstore_data || [];
                        if(temp_data_list.length == 1) {
                            app.globalData.url_open(temp_data_list[0]['url']);
                        } else {
                            this.setData({
                                popup_realstore_status: true
                            });
                        }
                        break;
                    // 商品批量下单-购买
                    case 'plugins-batchbuy-button-buy' :
                    // 商品批量下单-加入购物车
                    case 'plugins-batchbuy-button-cart' :
                        if((this.$refs.goods_batch_buy || null) != null) {
                            this.$refs.goods_batch_buy.init(this.goods, this.plugins_batchbuy_data, this.buy_button);
                        }
                        break;
                    // 默认
                    default:
                        app.globalData.showToast('事件未处理');
                }
            },

            // 加入购物车成功回调
            goods_cart_back_event(e) {
                this.setData({
                    goods_spec_selected_text: ((e.spec || null) == null) ? '' : e.spec.map(function(v){return v.value;}).join(' / ')
                });
                this.goods_cart_count_handle(e.cart_number);
            },

            // 购物车总数处理
            goods_cart_count_handle(cart_number) {
                this.setData({
                    quick_nav_cart_count: cart_number
                });
            },

            // 收藏事件
            goods_favor_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
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
                                    app.globalData.showToast(res.data.msg, 'success');
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
                if((this.$refs.share || null) != null) {
                    this.$refs.share.init({status: true, is_goods_poster: this.plugins_is_goods_detail_poster, goods_id: this.goods.id});
                }
            },

            // 优惠券开启弹层
            popup_coupon_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
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
                            title: '处理中...'
                        });
                        uni.request({
                            url: app.globalData.get_request_url("receive", "coupon", "coupon"),
                            method: 'POST',
                            data: {
                                "coupon_id": value
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    app.globalData.showToast(res.data.msg, 'success');
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
                                app.globalData.showToast('服务器请求出错');
                            }
                        });
                    }
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

            // 门店弹层关闭
            popup_realstore_close_event(e) {
                this.setData({
                    popup_realstore_status: false
                });
            },

            // 评价图片预览
            comment_images_show_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                uni.previewImage({
                    current: this.goods.comments_data[index]['images'][ix],
                    urls: this.goods.comments_data[index]['images']
                });
            },

            // 更多导航事件
            nav_more_event(e) {
                app.globalData.operation_event(e);
                this.setData({nav_more_status: false});
            },
			
			// 商品参数开启弹层
			popup_params_event(e) {
			    this.setData({
			        popup_params_status: true,
					popup_params_type_field: e.currentTarget.dataset.value || 'base'
			    });
			},

			// 商品参数关闭弹层
			popup_params_close_event(e) {
			    this.setData({
			        popup_params_status: false
			    });
			},

            // 批发开启弹层
            popup_wholesale_event(e) {
                this.setData({
                    popup_wholesale_status: true
                });
            },

            // 批发弹层关闭
            popup_wholesale_close_event(e) {
                this.setData({
                    popup_wholesale_status: false
                });
            },

            // 商品服务开启弹层
            popup_goodsservice_event(e) {
                this.setData({
                    popup_goodsservice_status: true
                });
            },

            // 商品服务弹层关闭
            popup_goodsservice_close_event(e) {
                this.setData({
                    popup_goodsservice_status: false
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 底部导航操作返回事件
            bottom_nav_back_event(e) {
                var pages = getCurrentPages();
                if(pages.length > 1) {
                    uni.navigateBack();
                } else {
                    // 默认首页
                    var url = app.globalData.data.tabbar_pages[0];

                    // 是否有参数定义
                    if(this.is_opt_back == 1) {
                        // 门店详情来源
                        if((this.params.realstore_id || null) != null) {
                            url = '/pages/plugins/realstore/detail/detail?id='+this.params.realstore_id;
                        }
                    }
                    app.globalData.url_open(url);
                }
            },

            // 商品错误返回、无上一个则返回首页
            goods_error_event(e) {
                var prev_url = app.globalData.prev_page();
                if(prev_url == null) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0]
                    });
                } else {
                    uni.navigateBack();
                }
            },

            // 商品批量下单加入购物车回调
            batch_goods_cart_back_event(e) {
                this.goods_cart_count_handle(e.cart_number);
            }
        }
    };
</script>
<style>
    @import './goods-detail.css';
</style>