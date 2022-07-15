<template>
    <view>
        <view v-if="(propData || null) != null && (propData.goods_list || null) != null && propData.goods_list.length > 0">
            <view class="spacing-nav-title">
                <text class="text-wrapper" :style="'color:'+(propData.color || '#333')+';'">{{propData.title}}</text>
                <text v-if="(propData.vice_title || null) != null" class="vice-name margin-left-lg cr-gray">{{propData.vice_title}}</text>
                <navigator v-if="(propData[propMoreUrlKey] || null) != null" :url="propData[propMoreUrlKey]" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
            </view>
            <view class="wh-auto oh pr">
                <view v-if="propData.keywords_arr.length > 0" class="word-list scroll-view-horizontal margin-bottom-lg">
                    <scroll-view scroll-x>
                        <block v-for="(kv, ki) in propData.keywords_arr" :key="ki">
                            <navigator v-if="(kv || null) != null" :url="propKeywordsUrl + kv" hover-class="none" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right">{{kv}}</navigator>
                        </block>
                    </scroll-view>
                </view>
                <block v-if="propData.goods_list.length > 0">
                    <!-- 默认图文 -->
                    <block v-if="(propData.style_type || 0) == 0">
                        <view class="goods-data-list">
                            <view v-for="(item, index) in propData.goods_list" :key="index" class="item oh padding-main border-radius-main bg-white oh pr spacing-mb">
                                <!-- 商品主体内容 -->
                                <navigator :url="item.goods_url" hover-class="none">
                                    <image class="goods-img fl radius" :src="item.images" mode="aspectFit"></image>
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
                    <block v-else-if="propData.style_type == 1">
                        <view class="goods-data-grid-list">
                            <view v-for="(item, index) in propData.goods_list" :key="index" class="item oh border-radius-main bg-white oh pr spacing-mb">
                                <!-- 商品主体内容 -->
                                <navigator :url="item.goods_url" hover-class="none">
                                    <image class="goods-img dis-block" :src="item.images" mode="aspectFit"></image>
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
                    <view v-else-if="propData.style_type == 2" class="rolling-horizontal border-radius-main oh spacing-mb">
                        <view class="goods-data-rolling-list scroll-view-horizontal">
                            <swiper :vertical="false" :autoplay="propIsAutoPlay" :circular="false" :display-multiple-items="propData.goods_list.length < 3 ? propData.goods_list.length : 3" interval="3000">
                                <block v-for="(item, index) in propData.goods_list" :key="index">
                                    <swiper-item>
                                        <view class="item bg-white border-radius-main margin-right-main oh pr ht-auto pr">
                                            <!-- 商品主体内容 -->
                                            <navigator :url="item.goods_url" hover-class="none">
                                                <image class="goods-img dis-block wh-auto" :src="item.images" mode="aspectFit"></image>
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
                    </view>
                </block>
            </view>
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
            propData: {
            	type: [Array,Object],
            	default: []
            },
            propMoreUrlKey: {
                type: String,
                default: 'url'
            },
            propKeywordsUrl: {
                type: String,
                default: '/pages/goods-search/goods-search?keywords='
            },
            propIsAutoPlay: {
                type: Boolean,
                default: true
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