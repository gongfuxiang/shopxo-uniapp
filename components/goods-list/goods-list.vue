<template>
    <view :class="theme_view">
        <view class="plugins-goods" :class="data.style_type == 2 ? 'bg-white border-radius-main padding-main spacing-mb' : ''" v-if="(data || null) != null && (data.goods_list || null) != null && data.goods_list.length > 0">
            <view v-if="(data.title || null) != null || (data.vice_title || null) != null" class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                <view class="title-left">
                    <text v-if="(data.title || null) != null" class="text-wrapper" :class="data.style_type == 2 ? '' : 'title-left-border'" :style="'color:' + (data.color || '#333') + ';'">{{ data.title }}</text>
                    <text v-if="(data.vice_title || null) != null" class="vice-name margin-left-sm cr-grey-9">{{ data.vice_title }}</text>
                </view>
                <navigator v-if="(data[propMoreUrlKey] || null) != null" :url="data[propMoreUrlKey]" hover-class="none" class="arrow-right padding-right cr-grey">{{ $t('common.more') }}</navigator>
            </view>
            <view class="wh-auto oh pr goods-list">
                <!-- 默认图文 -->
                <block v-if="(data.style_type || 0) == 0">
                    <view class="goods-data-list">
                        <view v-for="(item, index) in data.goods_list" :key="index" class="item oh padding-main border-radius-main bg-white oh pr spacing-mb">
                            <!-- 商品主体内容 -->
                            <view class="cp" :data-value="item.goods_url" @tap="url_event">
                                <image class="goods-img fl radius" :src="item.images" mode="aspectFit"></image>
                                <view class="base fr">
                                    <view class="multi-text">{{ item.title }}</view>
                                    <view v-if="(item.simple_desc || null) != null" class="cr-grey single-text margin-top-sm text-size-sm">{{ item.simple_desc }}</view>
                                    <view class="flex-row jc-sb align-c margin-top-main pr">
                                        <view class="base-bottom">
                                            <text v-if="propIsShowPriceIcon && (item.price_icon || null) != null" class="bg-red br-red cr-white text-size-xs padding-left-sm padding-right-sm round va-m margin-right-xs">{{ item.price_icon }}</text>
                                            <text class="sales-price va-m text-size-xss va-b">{{ propCurrencySymbol }}</text>
                                            <text class="sales-price va-m">{{ item[propPriceField] }}</text>
                                        </view>
                                        <block v-if="(item.is_error || 0) == 0 && is_show_cart">
                                            <view v-if="propOpenCart" class="bg-white right-cart-icon" :data-index="index" @tap.stop="goods_cart_event">
                                                <iconfont name="icon-cart-inc" size="40rpx" :color="theme_color"></iconfont>
                                                <view class="cart-badge-icon pa">
                                                    <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                                </view>
                                            </view>
                                        </block>
                                    </view>
                                </view>
                            </view>
                            <!-- 标签插件 -->
                            <view v-if="(propLabel || null) != null && propLabel.data.length > 0" :class="'plugins-label oh pa plugins-label-' + ((propLabel.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img') + ' plugins-label-' + (propLabel.base.user_goods_show_style || 'top-left')">
                                <block v-for="(lv, li) in propLabel.data" :key="li">
                                    <view v-if="(lv.goods_ids || null) != null && lv.goods_ids.indexOf(item.id) != -1" class="lv dis-inline-block va-m" :data-value="(propLabel.base.is_user_goods_label_url || 0) == 1 ? lv.url || '' : ''" @tap="url_event">
                                        <view v-if="(propLabel.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:' + lv.bg_color + ' !important;' : '') + ((lv.text_color || null) != null ? 'color:' + lv.text_color + ' !important;' : '')">
                                            {{ lv.name }}
                                        </view>
                                        <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                    </view>
                                </block>
                            </view>
                        </view>
                    </view>
                </block>
                <!-- 九方格 -->
                <block v-else-if="data.style_type == 1">
                    <view class="goods-data-grid-list flex-row flex-warp">
                        <view v-for="(item, index) in data.goods_list" :key="index" class="item oh border-radius-main bg-white oh pr spacing-mb">
                            <!-- 商品主体内容 -->
                            <view class="cp" :data-value="item.goods_url" @tap="url_event">
                                <image class="goods-img dis-block wh-auto" :src="item.images" mode="widthFix"></image>
                                <view class="base padding-horizontal-main margin-top-sm">
                                    <view class="goods-title multi-text">{{ item.title }}</view>
                                    <view class="margin-top-sm flex-row jc-sb align-c">
                                        <view>
                                            <block v-if="!propIntegral">
                                                <text v-if="propIsShowPriceIcon && (item.price_icon || null) != null" class="bg-red br-red cr-white text-size-xs padding-left-sm padding-right-sm round va-m margin-right-xs">{{ item.price_icon }}</text>
                                                <text class="sales-price va-m text-size-xss va-b">{{ propCurrencySymbol }}</text>
                                                <text class="sales-price va-m">{{ item[propPriceField] }}</text>
                                            </block>
                                            <block v-else>
                                                <view class="flex-col">
                                                    <view class="original-price">
                                                        <text class="va-m text-size-xsss va-b">{{ propCurrencySymbol }}</text>
                                                        <text class="va-m text-size-xs">{{ item[propPriceField] }}</text>
                                                    </view>
                                                    <view class="cr-main text-size-xs"> {{ item.integral }}{{ $t('index.index.t26j9z') }}</view>
                                                </view>
                                            </block>
                                        </view>
                                        <block v-if="propIsOpenGridBtnSet">
                                            <view :disabled="grid_btn_config.disabled" @tap="url_event" :style="[{ color: grid_btn_config.color }, { 'background-color': grid_btn_config.bg_color }, { padding: grid_btn_config.padding }, { 'border-radius': grid_btn_config.border_radius }, { 'font-size': grid_btn_config.font_size }]">
                                                {{ grid_btn_config.name }}
                                            </view>
                                        </block>
                                        <block v-else>
                                            <block v-if="(item.is_error || 0) == 0 && is_show_cart">
                                                <view v-if="propOpenCart" class="bg-white pr" :data-index="index" @tap.stop="goods_cart_event">
                                                    <iconfont name="icon-cart-inc" size="40rpx" :color="theme_color"></iconfont>
                                                    <view class="cart-badge-icon pa">
                                                        <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                                    </view>
                                                </view>
                                            </block>
                                        </block>
                                    </view>
                                </view>
                            </view>
                            <!-- 标签插件 -->
                            <view v-if="(propLabel || null) != null && propLabel.data.length > 0" :class="'plugins-label oh pa plugins-label-' + ((propLabel.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img') + ' plugins-label-' + (propLabel.base.user_goods_show_style || 'top-left')">
                                <block v-for="(lv, li) in propLabel.data" :key="li">
                                    <view v-if="(lv.goods_ids || null) != null && lv.goods_ids.indexOf(item.id) != -1" class="lv dis-inline-block va-m" :data-value="(propLabel.base.is_user_goods_label_url || 0) == 1 ? lv.url || '' : ''" @tap="url_event">
                                        <view v-if="(propLabel.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:' + lv.bg_color + ' !important;' : '') + ((lv.text_color || null) != null ? 'color:' + lv.text_color + ' !important;' : '')">
                                            {{ lv.name }}
                                        </view>
                                        <image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
                                    </view>
                                </block>
                            </view>
                        </view>
                    </view>
                </block>
                <!-- 滚动 -->
                <view v-else-if="data.style_type == 2" class="rolling-horizontal border-radius-main oh">
                    <view class="goods-data-rolling-list scroll-view-horizontal">
                        <swiper class="swiper" :vertical="false" :autoplay="propIsAutoPlay" :circular="false" :display-multiple-items="(data.multiple_items || null) == null ? (data.goods_list.length < 3 ? data.goods_list.length : 3) : data.goods_list.length < data.multiple_items ? data.goods_list.length : data.multiple_items" interval="3000">
                            <block v-for="(item, index) in data.goods_list" :key="index">
                                <swiper-item>
                                    <view class="item bg-white border-radius-main margin-right-main oh pr ht-auto pr">
                                        <!-- 商品主体内容 -->
                                        <view class="cp" :data-value="item.goods_url" @tap="url_event">
                                            <image class="goods-img dis-block wh-auto" :src="item.images" mode="aspectFit"></image>
                                            <view class="padding-left-sm padding-right-sm margin-top-sm">
                                                <view class="single-text text-size-xs">{{ item.title }}</view>
                                                <view class="margin-top-xs flex-row align-c">
                                                    <block v-if="(item.is_error || 0) == 0 && is_show_cart">
                                                        <view v-if="propOpenCart" class="bg-white right-cart-icon" :data-index="index" @tap.stop="goods_cart_event">
                                                            <iconfont name="icon-cart-inc" size="28rpx" :color="theme_color" propClass="pr top-xs margin-right-xs"></iconfont>
                                                            <view class="cart-badge-icon pa">
                                                                <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                                            </view>
                                                        </view>
                                                    </block>
                                                    <view class="flex-1 flex-width">
                                                        <text v-if="propIsShowPriceIcon && (item.price_icon || null) != null" class="bg-red br-red cr-white text-size-xs padding-left-sm padding-right-sm round va-m margin-right-xs">{{ item.price_icon }}</text>
                                                        <text class="sales-price va-m text-size-xss va-b">{{ propCurrencySymbol }}</text>
                                                        <text class="sales-price va-m">{{ item[propPriceField] }}</text>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                        <!-- 标签插件 -->
                                        <view v-if="(propLabel || null) != null && propLabel.data.length > 0" :class="'plugins-label oh pa plugins-label-' + ((propLabel.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img') + ' plugins-label-' + (propLabel.base.user_goods_show_style || 'top-left')">
                                            <block v-for="(lv, li) in propLabel.data" :key="li">
                                                <view v-if="(lv.goods_ids || null) != null && lv.goods_ids.indexOf(item.id) != -1" class="lv dis-inline-block va-m" :data-value="(propLabel.base.is_user_goods_label_url || 0) == 1 ? lv.url || '' : ''" @tap="url_event">
                                                    <view v-if="(propLabel.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl" :style="((lv.bg_color || null) != null ? 'background-color:' + lv.bg_color + ' !important;' : '') + ((lv.text_color || null) != null ? 'color:' + lv.text_color + ' !important;' : '')">
                                                        {{ lv.name }}
                                                    </view>
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
            </view>
        </view>

        <!-- 商品购买 -->
        <component-goods-buy v-if="is_show_cart" ref="goods_buy" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>

        <!-- 购物车抛物线 -->
        <component-cart-para-curve v-if="is_show_cart" ref="cart_para_curve"></component-cart-para-curve>
    </view>
</template>
<script>
    const app = getApp();
    import componentBadge from '../../components/badge/badge';
    import componentGoodsBuy from '../../components/goods-buy/goods-buy';
    import componentCartParaCurve from '../../components/cart-para-curve/cart-para-curve';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data: null,
                is_show_cart: false,
                theme_color: app.globalData.get_theme_color(),
                grid_btn_config: {
                    bg_color: '#D8D8D8',
                    color: '#fff',
                    name: this.$t('goods-list.goods-list.nr77jf'),
                    disabled: false,
                    border_radius: '24rpx',
                    padding: '6rpx 16rpx',
                    font_size: '24rpx',
                },
            };
        },
        components: {
            componentBadge,
            componentGoodsBuy,
            componentCartParaCurve,
        },
        props: {
            // 价格符号
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol(),
            },
            // 列表数据
            propData: {
                type: [Array, Object],
                default: [],
            },
            // 更多url地址
            propMoreUrlKey: {
                type: String,
                default: 'url',
            },
            // 关键字url地址
            propKeywordsUrl: {
                type: String,
                default: '/pages/goods-search/goods-search?keywords=',
            },
            // 滚动自动播放
            propIsAutoPlay: {
                type: Boolean,
                default: true,
            },
            // 标签数据
            propLabel: {
                type: [Array, Object, String],
                default: null,
            },
            // 展示加购抛物线
            propIsCartParaCurve: {
                type: Boolean,
                default: false,
            },
            // 展示价格icon图标
            propIsShowPriceIcon: {
                type: Boolean,
                default: false,
            },
            // 展示价格字段
            propPriceField: {
                type: String,
                default: 'min_price',
            },
            // 来源
            propSource: {
                type: String,
                default: '',
            },
            // 当开启时以前的按钮将失效
            propIsOpenGridBtnSet: {
                type: Boolean,
                default: false,
            },
            // 九宫格 按钮样式, ----- 需要和propIsOpenGridBtnSet一起使用
            propGridBtnConfig: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            // 积分列表时使用参数
            propIntegral: {
                type: Boolean,
                default: false,
            },
            // 是否开启购物车按钮  ------ 滚动使用
            propOpenCart: {
                type: Boolean,
                default: true,
            },
            // 是否开启购物车数量同步到底部导航
            propIsCartNumberTabBarBadgeSync: {
                type: Boolean,
                default: true,
            },
        },
        // 属性值改变监听
        watch: {
            // 数据
            propData(value, old_value) {
                this.setData({
                    data: value,
                });
            },
            propIsOpenGridBtnSet(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        grid_btn_config: Object.assign({}, this.grid_btn_config, this.propGridBtnConfig),
                    });
                }
            },
        },
        // 页面被展示
        created: function () {
            var is_app_mourning = app.globalData.is_app_mourning();
            var is_show_cart = app.globalData.data.is_goods_list_show_cart_opt == 1 ? (is_app_mourning && this.propSource == 'index' ? false : true) : false;
            this.setData({
                data: this.propData,
                is_show_cart: is_show_cart,
                grid_btn_config: Object.assign({}, this.grid_btn_config, this.propGridBtnConfig),
            });
        },
        methods: {
            // 加入购物车
            goods_cart_event(e) {
                if ((this.$refs.goods_buy || null) != null) {
                    var index = e.currentTarget.dataset.index || 0;
                    var goods = this.propData.goods_list[index];
                    // 开启购物车抛物线效果则展示提示操作
                    var is_success_tips = this.propIsCartParaCurve ? 0 : 1;
                    this.$refs.goods_buy.init(
                        goods,
                        {
                            buy_event_type: 'cart',
                            is_direct_cart: 1,
                            is_success_tips: is_success_tips,
                        },
                        {
                            index: index,
                            pos: e,
                        }
                    );
                }
            },
            // 加入购物车成功回调
            goods_cart_back_event(e) {
                // 增加数量
                var back = e.back_data;
                var new_data = this.data;
                var goods = new_data['goods_list'][back.index];
                goods['user_cart_count'] = parseInt(goods['user_cart_count'] || 0) + parseInt(e.stock);
                if (goods['user_cart_count'] > 99) {
                    goods['user_cart_count'] = '99+';
                }
                new_data['goods_list'][back.index] = goods;
                this.setData({
                    data: new_data,
                });

                // 抛物线
                if (this.propIsCartParaCurve && (this.$refs.cart_para_curve || null) != null) {
                    this.$refs.cart_para_curve.init(null, back.pos, goods.images);
                }

                // 导航购物车处理
                if (this.propIsCartNumberTabBarBadgeSync) {
                    var cart_total = e.cart_number || 0;
                    if (cart_total <= 0) {
                        app.globalData.set_tab_bar_badge(2, 0);
                    } else {
                        app.globalData.set_tab_bar_badge(2, 1, cart_total);
                    }
                }

                // 当前页面
                var page = app.globalData.current_page().split('?');
                switch (page[0]) {
                    // 商品详情页面
                    case 'pages/goods-detail/goods-detail':
                    // 商品搜索
                    case 'pages/goods-search/goods-search':
                        var res = app.globalData.get_page_object(page[0]);
                        if (res.length > 0) {
                            for (var i in res) {
                                res[i].$vm.goods_cart_count_handle(cart_total);
                            }
                        }
                        break;
                }
                this.$emit('CartSuccessEvent', { ...e, ...{ goods_list: new_data.goods_list, goods: goods } });
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 购物车角标变化回调
            goods_badge_change() {
                this.$emit('goods_badge_change');
            },
        },
    };
</script>
<style></style>
