<template>
    <view>
        <view v-if="(propConfig || null) != null && (propData || null) != null && propData.length > 0">
            <block v-for="(floor, index) in propData" :key="index">
                <block v-if="floor.goods_list.length > 0 && floor.home_data_location == propLocation">
                    <view class="spacing-nav-title">
                        <text class="text-wrapper" :style="'color:'+(floor.color || '#333')+';'">{{floor.title}}</text>
                        <text v-if="(floor.vice_title || null) != null" class="vice-name margin-left-lg cr-gray">{{floor.vice_title}}</text>
                        <navigator :url="floor.url" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                    </view>
                    <view class="wh-auto oh pr">
                        <view v-if="floor.keywords_arr.length > 0" class="word-list scroll-view-horizontal margin-bottom-lg">
                            <scroll-view scroll-x>
                                <block v-for="(kv, ki) in floor.keywords_arr" :key="ki">
                                    <navigator v-if="(kv || null) != null" :url="'/pages/goods-search/goods-search?keywords=' + kv" hover-class="none" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right">{{kv}}</navigator>
                                </block>
                            </scroll-view>
                        </view>
                        <block v-if="floor.goods_list.length > 0">
                            <!-- 默认图文 -->
                            <block v-if="(floor.style_type || 0) == 0">
                                <view class="plugins-activity-list">
                                    <view v-for="(item, index) in floor.goods_list" :key="index" class="item oh padding-main border-radius-main bg-white oh pr spacing-mb">
                                        <!-- 商品主体内容 -->
                                        <navigator :url="item.goods_url" hover-class="none">
                                            <image class="activity-img fl radius" :src="item.images" mode="aspectFit"></image>
                                            <view class="base fr">
                                                <view class="multi-text">{{item.title}}</view>
                                                <view v-if="(item.simple_desc || null) != null" class="cr-grey single-text margin-top-sm">{{item.simple_desc}}</view>
                                                <view class="sales-price margin-top-sm">{{propCurrencySymbol}}{{item.min_price}}</view>
                                            </view>
                                        </navigator>
                                        <!-- 标签插件 -->
                                        <view v-if="(propLabel || null) != null && propLabel.data.length > 0" :class="'plugins-label oh pa plugins-label-'+((propLabel.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(propLabel.base.user_goods_show_style || 'top-left')">
                                            <block v-for="(lv,li) in propLabel.data" :key="li">
                                                <view v-if="lv.goods_ids.indexOf(item.id) != -1" class="lv dis-inline-block va-m" :data-value="((propLabel.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
                                                    <view v-if="(propLabel.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">{{lv.name}}</view>
                                                    <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                            </block>
                            <!-- 九方格 -->
                            <block v-else-if="floor.style_type == 1">
                                <view class="plugins-activity-grid-list">
                                    <view v-for="(item, index) in floor.goods_list" :key="index" class="item oh border-radius-main bg-white oh pr spacing-mb">
                                        <!-- 商品主体内容 -->
                                        <navigator :url="item.goods_url" hover-class="none">
                                            <image class="activity-img dis-block" :src="item.images" mode="aspectFit"></image>
                                            <view class="base padding-horizontal-main margin-top-sm">
                                                <view class="goods-title multi-text margin-bottom-sm">{{item.title}}</view>
                                                <view class="sales-price">{{propCurrencySymbol}}{{item.min_price}}</view>
                                            </view>
                                        </navigator>
                                        <!-- 标签插件 -->
                                        <view v-if="(propLabel || null) != null && propLabel.data.length > 0" :class="'plugins-label oh pa plugins-label-'+((propLabel.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(propLabel.base.user_goods_show_style || 'top-left')">
                                            <block v-for="(lv,li) in propLabel.data" :key="li">
                                                <view v-if="lv.goods_ids.indexOf(item.id) != -1" class="lv dis-inline-block va-m" :data-value="((propLabel.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
                                                    <view v-if="(propLabel.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">{{lv.name}}</view>
                                                    <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                                </view>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                            </block>
                            <!-- 滚动 -->
                            <block v-else-if="floor.style_type == 2">
                                <view class="plugins-activity-rolling-list scroll-view-horizontal border-radius-main oh spacing-mb">
                                    <swiper :vertical="false" :autoplay="(propConfig.is_home_auto_play || 0) == 1" :circular="false" :display-multiple-items="floor.goods_list.length < 3 ? floor.goods_list.length : 3" interval="3000">
                                        <block v-for="(item, index) in floor.goods_list" :key="index">
                                            <swiper-item class="padding-right-main">
                                                <view class="item bg-white border-radius-main oh pr ht-auto pr">
                                                    <!-- 商品主体内容 -->
                                                    <navigator :url="item.goods_url" hover-class="none">
                                                        <image class="activity-img dis-block wh-auto" :src="item.images" mode="aspectFit"></image>
                                                        <view class="padding-left-sm padding-right-sm margin-top-sm">
                                                            <view class="multi-text margin-bottom-sm">{{item.title}}</view>
                                                            <view class="sales-price">{{propCurrencySymbol}}{{item.min_price}}</view>
                                                        </view>
                                                    </navigator>
                                                    <!-- 标签插件 -->
                                                    <view v-if="(propLabel || null) != null && propLabel.data.length > 0" :class="'plugins-label oh pa plugins-label-'+((propLabel.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(propLabel.base.user_goods_show_style || 'top-left')">
                                                        <block v-for="(lv,li) in propLabel.data" :key="li">
                                                            <view v-if="lv.goods_ids.indexOf(item.id) != -1" class="lv dis-inline-block va-m" :data-value="((propLabel.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
                                                                <view v-if="(propLabel.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">{{lv.name}}</view>
                                                                <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                                            </view>
                                                        </block>
                                                    </view>
                                                </view>
                                            </swiper-item>
                                        </block>
                                    </swiper>
                                </view>
                            </block>
                        </block>
                    </view>
                </block>
            </block>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {};
        },
        components: {},
        props: {
            propCurrencySymbol: {
                type: String,
                default: app.globalData.data.currency_symbol
            },
            propLocation: {
            	type: [String,Number],
            	default: 0
            },
            propConfig: {
            	type: [String,Object],
            	default: null
            },
            propData: {
            	type: Array,
            	default: []
            },
            propLabel: {
                type: [Array,Object,String],
                default: null
            }
        },
        methods: {
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
</style>