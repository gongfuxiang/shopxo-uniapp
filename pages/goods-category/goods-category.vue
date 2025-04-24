<template>
    <view :class="theme_view">
        <view :class="popup_status ? 'fixed-top' : ''">
            <view class="pr" :class="is_single_page == 1 ? 'margin-top-xxxl single-page-top' : ''">
                <block v-if="category_list.length > 0">
                    <view v-if="category_list.length > 0" class="goods-top-bg pa top-0 left-0 right-0 wh-auto oh">
                        <image :src="theme_static_url + 'top-bg.png'" mode="widthFix" class="wh-auto"></image>
                    </view>
                    <!-- 搜索框 -->
                    <block v-if="is_single_page == 0">
                        <view class="nav-search padding-horizontal-main pr" :style="'padding-top:' + (status_bar_height + 5) + 'px;'">
                            <view class="goods-top-search-bg pa top-0 left-0 right-0 bottom-0 wh-auto oh">
                                <image :src="theme_static_url + 'top-bg.png'" mode="widthFix" class="wh-auto"></image>
                            </view>
                            <block v-if="category_goods_is_search_alone == 1">
                                <component-search :propPlaceholder="$t('customview.customview.726k7y')"></component-search>
                            </block>
                            <block v-else>
                                <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" :propPlaceholder="$t('customview.customview.726k7y')"></component-search>
                            </block>
                        </view>
                    </block>
                    <view class="category-container">
                        <!-- 分类内容 -->
                        <view :class="'category-content bs-bb pr ' + (category_show_level == 0 ? 'goods-model' : '')" :style="category_content_style">
                            <block v-if="category_show_level == 1">
                                <!-- 一级模式 -->
                                <scroll-view scroll-y class="ht-auto" :show-scrollbar="false">
                                    <view class="model-one padding-sm oh flex-row flex-wrap">
                                        <block v-for="(item, index) in category_list" :key="index">
                                            <view class="content-item cp" :data-value="item.id" @tap="category_event">
                                                <view class="padding-sm">
                                                    <view class="content bg-white border-radius-main">
                                                        <image v-if="(item[category_goods_model_icon_field] || null) != null" :src="item[category_goods_model_icon_field]" mode="aspectFit" class="icon circle"></image>
                                                        <view class="text single-text margin-top-sm" :class="'text-random-' + (Math.floor(Math.random() * 9) + 1)">{{ item.name }}</view>
                                                        <view class="desc multi-text margin-top-xs padding-top-xss cr-grey-9 text-size-xss">{{ item.describe }}</view>
                                                    </view>
                                                </view>
                                            </view>
                                        </block>
                                    </view>
                                </scroll-view>
                            </block>
                            <block v-else>
                                <!-- 商品列表模式 -->
                                <block v-if="category_show_level == 0">
                                    <!-- 一级导航 -->
                                    <view class="top-nav wh-auto pa scroll-view-horizontal bottom-0">
                                        <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'one-nav-item-' + nav_active_index" class="top-nav-scroll">
                                            <block v-for="(item, index) in category_list" :key="index">
                                                <view class="item tc cp dis-inline-block text-size-xss" :id="'one-nav-item-' + index" :data-index="index" :data-itemtwoindex="-1" :data-itemthreeindex="-1" @tap="nav_event">
                                                    <view :class="'icon-content circle br auto ' + (nav_active_index == index ? 'border-color-main' : '')">
                                                        <image :src="(item[category_goods_model_icon_field] || null) == null ? common_static_url + 'images.png' : item[category_goods_model_icon_field]" mode="aspectFit" class="icon dis-block auto wh-auto ht-auto circle"></image>
                                                    </view>
                                                    <view class="padding-left-sm padding-right-sm round margin-top-xs" :class="nav_active_index == index ? 'bg-main border-color-main cr-white' : ''">{{ item.name }} </view>
                                                </view>
                                            </block>
                                        </scroll-view>
                                        <component-nav-more class="nav-more-top" :propTop="search_height + 'px'" :propStatus="popup_status" @open-popup="open_popup_event">
                                            <view class="nav-list-more">
                                                <view class="flex-row flex-wrap align-c">
                                                    <block v-for="(item, index) in category_list" :key="index">
                                                        <view class="item tc cr-base cp text-size-xss" :id="'one-nav-item-' + index" :data-index="index" :data-itemtwoindex="-1" :data-itemthreeindex="-1" @tap="nav_event">
                                                            <view :class="'icon-content circle br auto ' + (nav_active_index == index ? 'border-color-main' : '')">
                                                                <image :src="(item[category_goods_model_icon_field] || null) == null ? common_static_url + 'images.png' : item[category_goods_model_icon_field]" mode="aspectFit" class="icon dis-block auto wh-auto ht-auto circle"></image>
                                                            </view>
                                                            <view class="dis-inline-block padding-left-sm padding-right-sm round margin-top-xs" :class="nav_active_index == index ? 'bg-main border-color-main cr-white' : ''">
                                                                {{ item.name }}
                                                            </view>
                                                        </view>
                                                    </block>
                                                </view>
                                            </view>
                                        </component-nav-more>
                                    </view>
                                    <!-- 二级导航 -->
                                    <view v-if="category_one_subset_count > 0" class="left-nav" :style="left_content_actual_style">
                                        <scroll-view :scroll-y="true" :show-scrollbar="false" class="ht-auto">
                                            <view :class="'text-size-sm item tc cr-base cp oh ' + (nav_active_item_two_index == -1 ? 'nav-active cr-main nav-left-border' : '')" :data-index="nav_active_index" :data-itemtwoindex="-1" :data-itemthreeindex="-1" @tap="nav_event">
                                                <text>{{ $t('common.all') }}</text>
                                            </view>
                                            <block v-if="(data_content || null) != null && (data_content.items || null) != null && data_content.items.length > 0">
                                                <block v-for="(item, index) in data_content.items" :key="index">
                                                    <view :class="'text-size-sm item tc cr-base cp oh ' + (nav_active_item_two_index == index ? 'nav-active cr-main nav-left-border' : '')" :data-index="nav_active_index" :data-itemtwoindex="index" :data-itemthreeindex="-1" @tap="nav_event">
                                                        <text>{{ item.name }}</text>
                                                    </view>
                                                </block>
                                            </block>
                                        </scroll-view>
                                    </view>
                                    <!-- 商品列表 -->
                                    <view :class="'goods-right-content bg-white pa bs-bb ' + (category_one_subset_count > 0 ? '' : 'category-one-subset-content')">
                                        <scroll-view :scroll-y="true" :show-scrollbar="false" class="ht-auto goods-list" :scroll-top="scroll_top" @scroll="scroll_event" @scrolltolower="scroll_lower" lower-threshold="60">
                                            <view class="padding-left-main" :style="right_content_actual_style">
                                                <!-- 操作导航 -->
                                                <view class="goods-list-top-nav bg-white">
                                                    <!-- 排序 -->
                                                    <view class="nav-sort-content oh">
                                                        <block v-for="(item, index) in search_nav_sort_list" :key="index">
                                                            <view class="sort-item tc fl cp" :data-index="index" @tap="nav_sort_event">
                                                                <text class="cr-base va-m text-size-sm">{{ item.name }}</text>
                                                                <image v-if="(item.icon || null) != null" class="sort-icon va-m" :src="common_static_url + 'sort-' + item.icon + '-icon.png'" mode="aspectFill"></image>
                                                            </view>
                                                        </block>
                                                    </view>
                                                    <!-- 三级导航 -->
                                                    <view v-if="(data_three_content || null) != null && (data_three_content.items || null) != null && data_three_content.items.length > 0" class="word-list scroll-view-horizontal padding-bottom-main">
                                                        <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'three-nav-item-' + nav_active_item_three_index">
                                                            <view :class="'word-icon dis-inline-block text-size-xs round padding-top-xs padding-bottom-xs padding-left padding-right ' + (nav_active_item_three_index == -1 ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey')" :data-index="nav_active_index" :data-itemtwoindex="nav_active_item_two_index" :data-itemthreeindex="-1" @tap="nav_event">{{ $t('common.all') }}</view>
                                                            <block v-for="(item, index) in data_three_content.items" :key="index">
                                                                <view :class="'word-icon dis-inline-block text-size-xs round padding-top-xs padding-bottom-xs padding-left padding-right ' + (nav_active_item_three_index == index ? 'bg-main-light br-main-light cr-main' : 'br-grey cr-grey')" :id="'three-nav-item-' + index" :data-index="nav_active_index" :data-itemtwoindex="nav_active_item_two_index" :data-itemthreeindex="index" @tap="nav_event">{{ item.name }}</view>
                                                            </block>
                                                        </scroll-view>
                                                    </view>
                                                </view>
                                                <!-- 右侧商品列表 -->
                                                <view v-if="(data_list || null) != null && data_list.length > 0" class="oh">
                                                    <view v-for="(item, index) in data_list" :key="index" class="item oh pr spacing-mb">
                                                        <!-- 商品主体内容 -->
                                                        <view class="flex-row jc-sb" data-type="type" :data-index="index" :data-value="item.goods_url + '&is_opt_back=1'" @tap="goods_event">
                                                            <image :src="item.images" mode="widthFix" class="goods-img radius dis-block"></image>
                                                            <view class="goods-base flex-col jc-sb">
                                                                <view class="goods-base-content">
                                                                    <view class="goods-title multi-text">{{ item.title }}</view>
                                                                    <view v-if="(item.simple_desc || null) != null" class="simple-desc cr-grey-9 text-size-xs margin-top-sm single-text">{{ item.simple_desc }}</view>
                                                                </view>
                                                                <view v-if="(item.show_field_price_status || 0) == 1" class="oh flex-row jc-sb align-c">
                                                                    <view class="single-text va-m">
                                                                        <text class="sales-price">
                                                                            <text class="text-size-xss">{{ item.show_price_symbol }}</text>
                                                                            <text class="text-size">{{ item.min_price }}</text>
                                                                        </text>
                                                                        <text class="text-size-xss cr-grey">{{ item.show_price_unit }}</text>
                                                                    </view>
                                                                    <view v-if="common_site_type != 4" class="buy-opt flex-row align-c tc">
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
                                                                            <text class="cr-grey text-size-xs">{{ item.error_msg }}</text>
                                                                        </block>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </view>
                                                        <!-- 标签插件 -->
                                                        <view v-if="(plugins_label_data || null) != null && plugins_label_data.data.length > 0" :class="'plugins-label oh pa plugins-label-' + ((plugins_label_data.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img') + ' plugins-label-' + (plugins_label_data.base.user_goods_show_style || 'top-left')">
                                                            <block v-for="(lv, li) in plugins_label_data.data" :key="li">
                                                                <view v-if="(lv.goods_ids || null) != null && lv.goods_ids.indexOf(item.id) != -1" class="lv dis-inline-block va-m" :data-value="(plugins_label_data.base.is_user_goods_label_url || 0) == 1 ? lv.url || '' : ''" @tap="url_event">
                                                                    <view v-if="(plugins_label_data.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="('background-color:'+(lv.bg_color || '#666'))+' !important;'+('color:'+(lv.text_color || '#fff'))+' !important;'">
                                                                        {{ lv.name }}
                                                                    </view>
                                                                    <block v-else>
                                                                        <image v-if="(lv.icon || null) != null" class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                                                    </block>
                                                                </view>
                                                            </block>
                                                        </view>
                                                    </view>
                                                </view>
                                                <block v-else>
                                                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" :propBackBtn="false" propPage="goods-category-item"></component-no-data>
                                                </block>
                                            </view>
                                        </scroll-view>
                                    </view>
                                </block>
                                <block v-else>
                                    <!-- 一级导航 -->
                                    <view class="left-nav ht-auto">
                                        <scroll-view :scroll-y="true" class="ht-auto" :show-scrollbar="false">
                                            <view :class="common_site_type != 4 ? 'left-content-actual ht-auto' : ''">
                                                <view class="ht-auto padding-0" :style="left_content_actual_style">
                                                    <block v-for="(item, index) in category_list" :key="index">
                                                        <view :class="'text-size-sm item tc cr-base cp oh ' + (nav_active_index == index ? 'nav-active cr-main nav-left-border' : '')" :data-index="index" :data-itemindex="-1" @tap="nav_event">
                                                            <text>{{ item.name }}</text>
                                                        </view>
                                                    </block>
                                                </view>
                                            </view>
                                        </scroll-view>
                                    </view>
                                    <view class="right-container pa">
                                        <scroll-view :scroll-y="true" class="ht-auto bg-white" :show-scrollbar="false">
                                            <!-- 一级内容基础容 -->
                                            <view v-if="(data_content || null) != null" class="oh">
                                                <view class="padding-top-main padding-horizontal-main">
                                                    <!-- 一级基础信息 -->
                                                    <block v-if="(data_content.banner_images || null) !== null">
                                                        <view :class="'one-content border-radius-main cp ' + (category_show_level == 3 ? 'spacing-mb' : '')" :data-value="data_content.id" @tap="category_event">
                                                            <image :src="data_content.banner_images" mode="scaleToFill" class="wh-auto radius"></image>
                                                        </view>
                                                    </block>
                                                    <block v-else>
                                                        <view v-if="(data_content.vice_name || null) != null || (data_content.describe || null) != null" :class="'one-content border-radius-main cp pr ' + (category_show_level == 3 ? 'spacing-mb' : '')" :data-value="data_content.id" @tap="category_event">
                                                            <image :src="theme_static_url + 'level2-content-bg.png'" mode="scaleToFill" class="wh-auto ht-auto radius pa top-0 left-0"></image>
                                                            <view class="pr padding-main">
                                                                <view v-if="(data_content.vice_name || null) != null" class="text-size-md fw-b" :style="'color:' + data_content.bg_color + ';'">
                                                                    {{ data_content.vice_name }}
                                                                </view>
                                                                <view v-if="(data_content.describe || null) != null" class="text-size-xs cr-grey margin-top-sm">{{ data_content.describe }}</view>
                                                            </view>
                                                        </view>
                                                    </block>
                                                    <!-- 一二级数据渲染 -->
                                                    <block v-if="(data_content.items || null) != null && data_content.items.length > 0">
                                                        <!-- 二级模式 -->
                                                        <block v-if="category_show_level == 2">
                                                            <view class="two-content oh border-radius-main spacing-mb flex-row flex-wrap">
                                                                <block v-for="(v, index) in data_content.items" :key="index">
                                                                    <view class="content-item tc cp two-img" :data-value="v.id" @tap="category_event">
                                                                        <view class="content">
                                                                            <image v-if="(v.icon || null) != null" :src="v.icon" mode="aspectFit" class="icon radius margin-bottom-main"></image>
                                                                            <view class="single-text text-size-sm cr-grey">{{ v.name }}</view>
                                                                        </view>
                                                                    </view>
                                                                </block>
                                                            </view>
                                                        </block>
                                                        <!-- 三级模式 -->
                                                        <block v-if="category_show_level == 3">
                                                            <block v-for="(v, index) in data_content.items" :key="index">
                                                                <view class="spacing-nav-title flex-row jc-sb align-c">
                                                                    <view class="flex-1">
                                                                        <text class="text-wrapper text-size-md">{{ v.name }}</text>
                                                                        <text v-if="(v.describe || null) != null" class="vice-name margin-left-lg cr-grey">{{ v.describe }}</text>
                                                                    </view>
                                                                    <view :data-value="v.id" @tap="category_event" class="arrow-right padding-right cr-grey text-size-xs">{{ $t('common.more') }}</view>
                                                                </view>
                                                                <view v-if="(v.items || null) != null && v.items.length > 0" class="oh border-radius-main spacing-mb flex-row flex-wrap">
                                                                    <block v-for="(vs, index2) in v.items" :key="index2">
                                                                        <view class="content-item two-img tc cp" :data-value="vs.id" @tap="category_event">
                                                                            <view class="content">
                                                                                <image v-if="(vs.icon || null) != null" :src="vs.icon" mode="aspectFit" class="icon radius margin-bottom-main"></image>
                                                                                <view class="single-text text-size-sm cr-grey">{{ vs.name }}</view>
                                                                            </view>
                                                                        </view>
                                                                    </block>
                                                                </view>
                                                            </block>
                                                        </block>
                                                    </block>
                                                    <block v-else>
                                                        <!-- 提示信息 -->
                                                        <component-no-data propStatus="0" :propMsg="$t('goods-category.goods-category.7e4m68')"></component-no-data>
                                                    </block>
                                                </view>
                                            </view>
                                            <view v-else>
                                                <!-- 提示信息 -->
                                                <component-no-data propStatus="0" :propMsg="$t('goods-category.goods-category.7e4m68')"></component-no-data>
                                            </view>
                                        </scroll-view>
                                    </view>
                                </block>
                            </block>
                        </view>

                        <view v-if="category_list.length == 0 && data_list_loding_status != 0">
                            <!-- 提示信息 -->
                            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
                        </view>

                        <!-- 仅商品模式展示购物车和规格选择 -->
                        <block v-if="category_goods_is_show_cart_nav == 1 && common_site_type != 4 && category_show_level == 0">
                            <!-- 购物车列表 -->
                            <block v-if="cart_status">
                                <view class="cart-mask wh-auto ht-auto pf" @tap="cart_event"></view>
                                <view class="cart-content bg-white border-radius-main pa oh" :style="cart_content_style">
                                    <block v-if="(cart || null) != null && (cart.data || null) != null && cart.data.length > 0">
                                        <view class="oh br-b padding-vertical-main padding-horizontal-main">
                                            <text class="va-m text-size-xs cr-base">{{ $t('goods-category.goods-category.ico62g') }}</text>
                                            <view class="fr cp" @tap="cart_all_delete_event">
                                                <view class="dis-inline-block va-m pr top-xs">
                                                    <uni-icons type="trash" size="16" color="#f00"></uni-icons>
                                                </view>
                                                <text class="cr-red va-m text-size-xs">{{ $t('common.clear') }}</text>
                                            </view>
                                        </view>
                                        <scroll-view :scroll-y="true" class="cart-list goods-list" :show-scrollbar="false">
                                            <view v-for="(goods, index) in cart.data" :key="index" class="item padding-main oh spacing-mb">
                                                <view data-type="cart" :data-index="index" :data-value="goods.goods_url" @tap="goods_event" class="cp flex-row jc-sb">
                                                    <image :src="goods.images" mode="widthFix" class="goods-img radius br"></image>
                                                    <view class="goods-base flex-1 flex-width flex-col jc-sb">
                                                        <view class="goods-base-content">
                                                            <view class="goods-title text-size-sm single-text">{{ goods.title }}</view>
                                                            <view v-if="goods.spec != null" class="text-size-xs cr-grey margin-top-xs">
                                                                <block v-for="(sv, si) in goods.spec" :key="si">
                                                                    <text v-if="si > 0" class="padding-left-xs padding-right-xs">;</text>
                                                                    <text>{{ sv.value }}</text>
                                                                </block>
                                                            </view>
                                                        </view>
                                                        <view class="margin-top-xs oh">
                                                            <view class="sales-price text-size single-text dis-inline-block va-m pr top-sm">{{ currency_symbol }}{{ goods.price }}</view>
                                                            <view class="tc fr flex-row align-c">
                                                                <block v-if="goods.is_error == 0">
                                                                    <view v-if="(goods.stock || 0) > 0" class="cp pr top-sm" :data-index="index" data-type="0" @tap.stop="cart_buy_number_event">
                                                                        <iconfont name="icon-cart-dec" size="48rpx" :color="theme_color"></iconfont>
                                                                    </view>
                                                                    <view v-if="(goods.stock || 0) > 0" class="buy-number dis-inline-block cr-black text-size-sm padding-left-xs padding-right-xs va-m">
                                                                        {{ goods.stock }}
                                                                    </view>
                                                                    <view class="cp pr top-sm" :data-index="index" data-type="1" @tap.stop="cart_buy_number_event">
                                                                        <iconfont name="icon-cart-inc" size="48rpx" :color="theme_color"></iconfont>
                                                                    </view>
                                                                </block>
                                                                <block v-else>
                                                                    <text class="cr-red">{{ goods.error_msg }}</text>
                                                                </block>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                        </scroll-view>
                                    </block>
                                    <block v-else>
                                        <component-no-data propStatus="0" :propMsg="$t('goods-category.goods-category.5pj8ip')"></component-no-data>
                                    </block>
                                </view>
                            </block>
                            <!-- 购物车底部导航 -->
                            <view class="botton-nav bg-white round pa oh padding-sm flex-row jc-sb align-c" :style="botton_nav_style+(cart_status ? 'z-index:5;' : '')">
                                <view class="flex-row align-c flex-1 flex-width">
                                    <view class="cart pr cp top-sm padding-left-sm" @tap="cart_event">
                                        <iconfont name="icon-menu-cart" size="36rpx" color="#666"></iconfont>
                                        <view v-if="(cart || null) != null && (cart.buy_number || 0) != 0" class="badge-icon pa">
                                            <component-badge :propNumber="cart.buy_number"></component-badge>
                                        </view>
                                    </view>
                                    <view class="cart-total-price single-text padding-left-sm fw-b cr-red flex-1">
                                        <text class="text-size-xss">{{ currency_symbol }}</text>
                                        <text class="text-size-lg">{{ (cart || null) == null ? 0 : cart.total_price || 0 }}</text>
                                    </view>
                                </view>
                                <button type="default" size="mini" hover-class="none" class="btn bg-main cr-white text-size-md round margin-right-xs" @tap="buy_submit_event">{{ $t('goods-category.goods-category.44f1ww') }}</button>
                            </view>
                        </block>
                    </view>
                </block>
                <block v-else>
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" propPage="goods-category" :propIsHeader="true"></component-no-data>
                </block>

                <block v-if="data_list_loding_status != 1">
                    <!-- 购物车抛物线 -->
                    <component-cart-para-curve ref="cart_para_curve"></component-cart-para-curve>

                    <!-- 商品购买 -->
                    <component-goods-buy ref="goods_buy" :propCurrencySymbol="currency_symbol" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>
                </block>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common" @onFooterHeight="footer_height_value_event" :propIsFooterSeat="false"></component-common>
    </view>
</template>

<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentSearch from '@/components/search/search';
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';
    import componentBadge from '@/components/badge/badge';
    import componentCartParaCurve from '@/components/cart-para-curve/cart-para-curve';
    import componentNavMore from '@/components/nav-more/nav-more';

    var theme_static_url = app.globalData.get_static_url('goods-category');
    var common_static_url = app.globalData.get_static_url('common');
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif

    var icon_type = app.globalData.data.category_goods_model_icon_type;
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_static_url: theme_static_url,
                common_static_url: common_static_url,
                status_bar_height: bar_height,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
                load_status: 0,
                user: null,
                params: null,
                tabbar_params: null,
                common_site_type: 0,
                category_list: [],
                data_content: null,
                data_three_content: null,
                cart: null,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                currency_symbol: app.globalData.currency_symbol(),
                is_first: 1,
                search_keywords_value: '',
                nav_active_index: 0,
                nav_active_item_two_index: -1,
                nav_active_item_three_index: -1,
                scroll_top: 0,
                scroll_top_old: 0,
                cart_status: false,
                goods_choose_data: {},
                category_one_subset_count: 0,
                // 基础配置
                category_show_level: 0,
                // 排序导航
                search_nav_sort_index: 0,
                search_nav_sort_list: [],
                // 自定义分享信息
                share_info: {},
                // 是否单页预览
                is_single_page: app.globalData.is_current_single_page() || 0,
                // 商品列表模式一级分类图标类型
                category_goods_model_icon_field: icon_type == 0 ? 'realistic_images' : icon_type == 1 ? 'icon' : 'big_images',
                // 商品分类页面搜索进入独立搜索页面
                category_goods_is_search_alone: app.globalData.data.category_goods_is_search_alone,
                // 商品分类页面开启购物车导航
                category_goods_is_show_cart_nav: app.globalData.data.category_goods_is_show_cart_nav,
                // 临时操作数据
                temp_opt_data: null,
                // 标签插件
                plugins_label_data: null,
                theme_color: app.globalData.get_theme_color(),
                popup_status: false,
                // 获取搜索框高度
                search_height: 0,
                // 底部tab高度 - 只有H5下有值
                window_bottom_height: 0,
                // #ifdef H5
                window_bottom_height: (app.globalData.data.is_use_native_tabbar == 1) ? (uni.getWindowInfo().windowBottom || 50) : 0,
                // #endif
                // 样式
                category_content_style: '',
                left_content_actual_style: '',
                right_content_actual_style: '',
                botton_nav_style: '',
                cart_content_style: '',
                footer_height_value: 0,
            };
        },

        components: {
            componentCommon,
            componentGoodsBuy,
            componentSearch,
            componentNoData,
            componentPopup,
            componentBadge,
            componentCartParaCurve,
            componentNavMore
        },

        onLoad(params) {
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

            // 资源设置
            this.set_resources_data();

            // 基础参数
            this.setData({
                user: app.globalData.get_user_cache_info(),
                tabbar_params: app.globalData.get_page_tabbar_switch_params(),
            });

            // 数据加载
            this.init();

            // 初始化配置
            if(app.globalData.get_config('status') == 1) {
                app.globalData.init_config(0, this, 'init_config', true);
            } else {
                app.globalData.is_config(this, 'init_config');
            }

            // 清除tab参数
            app.globalData.remove_page_tabbar_switch_params();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show({object: this, method: 'init'});
            }
        },

        methods: {
            // 资源设置
            set_resources_data() {
                var search_nav_sort_list = [
                    {
                        name: this.$t('goods-category.goods-category.x69aow'),
                        field: 'default',
                        sort: 'asc',
                        icon: null,
                    },
                    {
                        name: this.$t('goods-category.goods-category.at5p35'),
                        field: 'sales_count',
                        sort: 'asc',
                        icon: 'default',
                    },
                    {
                        name: this.$t('goods-category.goods-category.283ot0'),
                        field: 'access_count',
                        sort: 'asc',
                        icon: 'default',
                    },
                    {
                        name: this.$t('goods-category.goods-category.g2u3lf'),
                        field: 'min_price',
                        sort: 'asc',
                        icon: 'default',
                    },
                    {
                        name: this.$t('goods-category.goods-category.5p4ksj'),
                        field: 'id',
                        sort: 'asc',
                        icon: 'default',
                    },
                ];
                this.setData({
                    search_nav_sort_list,
                });
            },
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        common_site_type: app.globalData.get_config('config.common_site_type'),
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        category_show_level: app.globalData.get_config('config.category_show_level'),
                    });
                }
            },

            // 获取数据
            init(params = {}) {
                // 网络检查
                if ((params || null) == null || (params.loading || 0) == 0) {
                    app.globalData.network_type_handle(this, 'init', params);
                    return false;
                }

                // 请求数据
                if (this.is_first == 1) {
                    this.setData({
                        data_list_loding_status: 1,
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('category', 'goods'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var active_index = this.nav_active_index;
                            var temp_category = data.category || [];
                            // 全部分类子级数量
                            var category_one_subset_count = 0;
                            // 是否指定分类
                            if (temp_category.length > 0) {
                                for (var i in temp_category) {
                                    // tab切换参数、访问请求参数
                                    if (((this.tabbar_params || null) != null && (this.tabbar_params.id || null) != null && temp_category[i]['id'] == this.tabbar_params.id) || ((this.params || null) != null && (this.params.id || null) != null && temp_category[i]['id'] == this.params.id)) {
                                        active_index = i;
                                    }
                                    // 是否全部数据都无二级
                                    if ((temp_category[i]['items'] || null) != null && temp_category[i]['items'].length > 0) {
                                        category_one_subset_count++;
                                    }
                                }
                            }
                            // 设置分类及右侧数据和及基础数据
                            var upd_data = {
                                load_status: 1,
                                category_list: temp_category,
                                data_content: temp_category[active_index] || null,
                                nav_active_index: active_index,
                                category_one_subset_count: category_one_subset_count,
                                plugins_label_data: (data.plugins_label_data || null) == null || (data.plugins_label_data.base || null) == null || (data.plugins_label_data.data || null) == null || data.plugins_label_data.data.length <= 0 ? null : data.plugins_label_data,
                            };
                            // 指定分类则重新读取列表数据
                            if (this.nav_active_index != active_index) {
                                upd_data['is_first'] = 1;
                                upd_data['data_page'] = 1;
                                upd_data['data_list'] = [];
                                upd_data['data_list_loding_status'] = 1;
                                upd_data['nav_active_item_two_index'] = -1;
                                upd_data['nav_active_item_three_index'] = -1;
                            }
                            // 非商品列表模式
                            if (this.category_show_level != 0) {
                                upd_data['data_list_loding_status'] = temp_category.length == 0 ? 0 : 3;
                                upd_data['data_bottom_line_status'] = true;
                            }
                            this.setData(upd_data);

                            // 商品列表模式
                            if (this.category_show_level == 0) {
                                // 商品列表模式获取购物车数据
                                this.get_cart_data();
                                // 获取商品列表、仅首次请求商品列表
                                if (this.is_first == 1) {
                                    this.get_goods_list(1);
                                }
                            }

                            // 计算更多分类弹窗的高度、由于页面元素渲染异步问题，这里加延时执行
                            if (this.is_first == 1) {
                                var self = this;
                                var timer = setInterval(function () {
                                    if (self.search_height == 0) {
                                        self.search_height_computer();
                                    } else {
                                        clearInterval(timer);
                                    }
                                }, 500);
                            }

                            // 内容大小处理
                            this.content_actual_size_handle();

                            // 是否首次记录
                            this.setData({
                                is_first: 0,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }

                        // 基础自定义分享
                        this.setData({
                            share_info: {
                                path: '/pages/goods-category/goods-category',
                            },
                        });

                        // 分享菜单处理、延时执行，确保基础数据已加载完成
                        setTimeout(function () {
                            app.globalData.page_share_handle(this.share_info);
                        }, 3000);
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

            // 内容实际大小处理
            content_actual_size_handle() {
                // 底部加点距离
                var bottom_style_value = 20;
                // 左侧
                var left_style = '';
                if(this.category_goods_is_show_cart_nav == 1) {
                    left_style = 'height: calc(100% - 120rpx - '+bottom_style_value+'rpx);';
                }
                // 右侧
                var right_style = '';
                if(this.category_goods_is_show_cart_nav == 1 && this.common_site_type != 4) {
                    right_style = 'padding-bottom: calc(120rpx + '+bottom_style_value+'rpx);';
                }
                // 底部导航高度
                var footer_height = this.footer_height_value;
                var footer_height_unit = 'px';
                // #ifdef H5
                if(app.globalData.is_pc()) {
                    var system = app.globalData.get_system_info(null, null, true);
                    if(system.windowWidth <= 960) {
                        footer_height *= 2;
                        footer_height_unit = 'rpx';
                    }
                }
                // #endif
                this.setData({
                    category_content_style: 'height:calc(100vh - ' + (this.search_height + this.window_bottom_height)+'px - '+footer_height+footer_height_unit+');',
                    left_content_actual_style: left_style,
                    right_content_actual_style: right_style,
                    botton_nav_style: 'bottom: calc(20rpx);',
                    cart_content_style: 'bottom: calc(150rpx);',
                });
            },

            // 获取商品列表
            get_goods_list(is_mandatory) {
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
                    page: this.data_page,
                    wd: this.search_keywords_value || '',
                };
                // 分类id
                if ((this.data_content || null) != null) {
                    // 主分类id
                    post_data['category_id'] = this.data_content['id'];
                    // 是否选中了二级分类
                    if (this.nav_active_item_two_index != -1) {
                        post_data['category_id'] = this.data_content['items'][this.nav_active_item_two_index]['id'];
                    }
                    // 是否选中了三级分类
                    if (this.data_three_content != null && this.nav_active_item_three_index != -1) {
                        post_data['category_id'] = this.data_three_content['items'][this.nav_active_item_three_index]['id'];
                    }
                }
                // 排序
                var temp_index = this.search_nav_sort_index;
                var temp_search_nav_sort = this.search_nav_sort_list;
                post_data['order_by_type'] = temp_search_nav_sort[temp_index]['sort'] == 'desc' ? 'asc' : 'desc';
                post_data['order_by_field'] = temp_search_nav_sort[temp_index]['field'];

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'search'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
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

                                // 购物车数据处理
                                this.cart_data_list_handle();
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_total: 0,
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
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_is_loading: 0,
                        });
                    },
                });
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
                this.get_goods_list();
            },

            // 导航事件
            nav_event(e) {
                var index = e.currentTarget.dataset.index;
                var two_index = e.currentTarget.dataset.itemtwoindex;
                var three_index = e.currentTarget.dataset.itemthreeindex;
                var temp_data_content = this.category_list[index] || null;
                var temp_data_three_content = null;
                if (two_index != -1 && temp_data_content != null) {
                    temp_data_three_content = temp_data_content['items'][two_index];
                }
                this.setData({
                    nav_active_index: index,
                    nav_active_item_two_index: two_index,
                    nav_active_item_three_index: three_index,
                    data_content: temp_data_content,
                    data_three_content: temp_data_three_content,
                    popup_status: false,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.reset_scroll();
                this.get_goods_list(1);
            },

            // 打开弹窗
            open_popup_event(e) {
                this.setData({
                    popup_status: e,
                });
            },

            // 分类事件
            category_event(e) {
                app.globalData.url_open('/pages/goods-search/goods-search?category_id=' + e.currentTarget.dataset.value);
            },

            // 搜索事件
            search_button_event(e) {
                // 商品列表模式
                if (this.category_show_level == 0) {
                    this.setData({
                        search_keywords_value: e || '',
                        data_page: 1,
                        data_list: [],
                        data_list_loding_status: 1,
                        data_bottom_line_status: false
                    });
                    this.get_goods_list(1);
                } else {
                    // 进入搜索页面
                    app.globalData.url_open('/pages/goods-search/goods-search' + ((e || null) == null ? '' : '?keywords=' + e));
                }
            },

            // 商品事件
            goods_event(e) {
                // 商品数据缓存处理
                var index = e.currentTarget.dataset.index;
                if(e.currentTarget.dataset.type == 'cart') {
                    var goods = this.cart.data[index];
                    goods['id'] = goods['goods_id'];
                } else {
                    var goods = this.data_list[index];
                }
                app.globalData.goods_data_cache_handle(goods.id, goods);

                // 调用公共打开url地址
                app.globalData.url_event(e);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
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
                            app.globalData.showToast(this.$t('goods-category.goods-category.gy7y0w'));
                        } else {
                            if ((this.$refs.goods_buy || null) != null) {
                                this.$refs.goods_buy.init(temp_goods, {
                                    buy_event_type: 'cart',
                                });
                            }
                        }
                        return false;
                    }

                    // 数据操作处理
                    this.buy_number_event_handle(e, type, temp_goods);
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

                // 数据临时记录
                this.setData({
                    temp_opt_data: {
                        pos: e,
                        goods: goods,
                        type: type,
                    },
                });

                // 操作类型
                if (res == 0) {
                    if (cart_item == null) {
                        app.globalData.showToast(this.$t('goods-category.goods-category.x46kbv'));
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
                var user = app.globalData.get_user_info(this, 'cart_buy_number_event', e);
                if (user != false) {
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
            },

            // 数量操作处理
            buy_number_handle(type, goods, buy_number_field) {
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
                    app.globalData.showToast(this.$t('goods-category.goods-category.z1eh3v') + max + inventory_unit);
                    return false;
                }

                // 数量是否改变
                if (goods[buy_number_field] == buy_number) {
                    app.globalData.showToast(this.$t('goods-category.goods-category.1ox23z'));
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
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
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
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 获取购物车数据
            get_cart_data() {
                if (this.user != null) {
                    uni.request({
                        url: app.globalData.get_request_url('index', 'cart'),
                        method: 'POST',
                        data: {},
                        dataType: 'json',
                        success: (res) => {
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                var temp_cart = data.data || [];
                                this.setData({
                                    cart: res.data.data,
                                });
                                this.cart_data_list_handle();

                                // 购物车导航角标
                                app.globalData.set_tab_bar_badge('cart', data.buy_number);
                            }
                        },
                        fail: () => {
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
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

            // 批量删除操作
            cart_all_delete_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('goods-category.goods-category.o6i1w2'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.not_yet'),
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

                // 获取购物车数据
                var ids = [];
                if ((this.cart || null) != null) {
                    var temp_data = this.cart.data || [];
                    for (var i in temp_data) {
                        if (temp_data[i]['is_error'] == 0) {
                            ids.push(temp_data[i]['id']);
                        }
                    }
                }
                if (ids.length <= 0) {
                    app.globalData.showToast(this.$t('goods-category.goods-category.5pj8ip'));
                    return false;
                }

                // 进入订单确认页面
                var data = {
                    buy_type: 'cart',
                    ids: ids.join(','),
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },

            // 计算搜索框的高度
            search_height_computer() {
                const query = uni.createSelectorQuery();
                query
                    .select('.nav-search')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            // 获取搜索框高度
                            this.setData({
                                search_height: res.height,
                            });
                            this.content_actual_size_handle();
                        }
                    })
                    .exec();
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
                this.reset_scroll();
                this.get_goods_list(1);
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
<style scoped>
    @import './goods-category.css';
</style>
