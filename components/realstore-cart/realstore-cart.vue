<template>
    <view :class="theme_view">
        <view v-if="!propIsBaseMode && propStatus">
            <!-- 购物车弹层背景 -->
            <view v-if="cart_status" class="plugins-realstore-cart-mask wh-auto ht-auto pf" @tap="cart_switch_event"></view>
            <!-- 购物车列表 -->
            <view class="plugins-realstore-cart-content pf wh-auto" :style="realstore_cart_content_style">
                <view class="bottom-line-exclude">
                    <view v-if="cart_status" class="bg-white border-radius-main pr oh margin-horizontal-main margin-bottom-xxxl">
                        <block v-if="(cart || null) != null && (cart.data || null) != null && cart.data.length > 0">
                            <view class="oh br-b padding-vertical-main padding-horizontal-main text-size-xs">
                                <text class="va-m cr-base">{{$t('goods-category.goods-category.ico62g')}}</text>
                                <view v-if="(info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0" class="dis-inline-block margin-left-xl">
                                    <text class="cr-red">{{$t('realstore-cart.realstore-cart.v437n6')}}</text>
                                    <view class="va-m dis-inline-block br-green cr-green round padding-horizontal-sm padding-vertical-xs cp" @tap="buy_use_type_event">
                                        <text class="va-m">{{$t('realstore-cart.realstore-cart.6bmc34')}}({{info.buy_use_type_list[buy_use_type_active_index]['name']}})</text>
                                        <view class="va-m dis-inline-block margin-left-xs">
                                            <iconfont name="icon-arrow-bottom" size="24rpx" propClass="cr-green"></iconfont>
                                        </view>
                                    </view>
                                </view>
                                <view class="fr cp" @tap="cart_all_delete_event">
                                    <view class="dis-inline-block va-m">
                                        <uni-icons type="trash" size="24rpx" color="#f00"></uni-icons>
                                    </view>
                                    <text class="cr-red va-m margin-left-xs">{{$t('common.clear')}}</text>
                                </view>
                            </view>
                            <scroll-view :scroll-y="true" class="cart-list goods-list">
                                <view v-for="(goods, index) in cart.data" :key="index" class="item padding-main oh spacing-mb">
                                    <view :data-index="index" @tap="goods_event">
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
                                                <view class="margin-top-sm">
                                                    <view class="sales-price text-size-sm single-text dis-inline-block va-m">{{ propCurrencySymbol }}{{ goods.price }}</view>
                                                    <view class="tc fr flex-row align-c">
                                                        <view v-if="(goods.stock || 0) > 0" class="cp pr top-sm" :data-index="index" data-type="0" @tap.stop="cart_stock_event">
                                                            <iconfont name="icon-cart-dec" size="48rpx" :color="theme_color"></iconfont>
                                                        </view>
                                                        <view v-if="(goods.stock || 0) > 0" class="buy-number dis-inline-block cr-black text-size-sm padding-left-xs padding-right-xs va-m">{{ goods.stock }} </view>
                                                        <view class="cp pr top-sm" :data-index="index" data-type="1" @tap.stop="cart_stock_event">
                                                            <iconfont name="icon-cart-inc" size="48rpx" :color="theme_color"></iconfont>
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
                            <component-no-data propStatus="0" :propMsg="$t('realstore-cart.realstore-cart.2dc65q')"></component-no-data>
                            <view v-if="(info.buy_use_type_list || null) != null && info.buy_use_type_list.length > 0" class="padding-vertical-xxxl margin-vertical-xxxl tc text-size-xs">
                                <text class="cr-red va-m">{{$t('realstore-cart.realstore-cart.v437n6')}}</text>
                                <view class="va-m dis-inline-block br-green cr-green round padding-horizontal padding-vertical-xs cp" @tap="buy_use_type_event">
                                    <text class="va-m">{{$t('realstore-cart.realstore-cart.6bmc34')}}{{info.buy_use_type_list[buy_use_type_active_index]['name']}})</text>
                                    <view class="va-m dis-inline-block margin-left-xs">
                                        <iconfont name="icon-arrow-bottom" size="24rpx" propClass="cr-green"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>

                    <!-- 购物车底部导航 -->
                    <view class="plugins-realstore-cart-botton-nav pr round oh bg-white">
                        <view class="wh-auto flex-row jc-sb align-c">
                            <view class="flex-row align-c flex-1 flex-width padding-bottom-xs">
                                <view class="cart-icon-total pr cp top-sm padding-left-main" @tap="cart_switch_event">
                                    <iconfont name="icon-menu-cart" size="36rpx" color="#666"></iconfont>
                                    <view v-if="(cart || null) != null && (cart.buy_number || 0) > 0" class="badge-icon pa">
                                        <component-badge :propNumber="cart.buy_number"></component-badge>
                                    </view>
                                </view>
                                <view class="cart-total-price single-text fw-b cr-red padding-left-sm" @tap="cart_switch_event">
                                    <text class="text-size-xss">{{ propCurrencySymbol }}</text>
                                    <text class="text-size-lg">{{ (cart || null) == null ? '0.00' : (cart.total_price || '0.00') }}</text>
                                </view>
                            </view>
                            <view class="padding-right-main padding-top-main padding-bottom-sm">
                                <button v-if="params.source == 'goods'" type="default" size="mini" hover-class="none" @tap="cart_submit_event" :loading="realstore_goods_data_cart_loading" :class="'btn text-size-md round margin-right-main ' + (realstore_goods_data_cart_status ? 'bg-main-pair cr-white' : 'bg-grey-disabled cr-grey')" :disabled="!realstore_goods_data_cart_status">{{ realstore_goods_data_cart_text }}</button>
                                <button type="default" size="mini" hover-class="none" @tap="buy_submit_event" :loading="settlement_btn_loading" :class="'btn text-size-md round ' + (settlement_btn_status ? 'bg-main cr-white' : 'bg-grey-disabled cr-grey')">{{ settlement_btn_text }}</button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 下单类型选择弹窗 -->
            <block v-if="buy_use_type_choice_status">
                <!-- 下单类型选择弹层背景 -->
                <view class="plugins-realstore-buy-type-mask wh-auto ht-auto pf"></view>
                <!-- 下单类型弹窗选择 -->
                <view class="plugins-realstore-buy-type-choice pf bg-white border-radius-main padding-xxl">
                    <view class="tc margin-top-xs margin-bottom-xl">
                        <text class="cr-grey text-size">{{$t('realstore-cart.realstore-cart.d1kk7x')}}</text>
                        <view v-if="(base.is_tips_user_choice_buy_use_type_mandatory || 0) == 0" class="fr" @tap="buy_use_type_choice_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <block v-for="(item, index) in buy_use_type_choice_list" :key="index">
                        <view class="item pr">
                            <view :class="'item-content pr padding-horizontal border-radius-main item-content-'+item.index" :data-index="item.key" @tap="buy_use_type_choice_event">
                                <image class="left-icon dis-inline-block va-m" :src="static_url+'buy_use_type/'+item.index+'.png'" mode="aspectFit"></image>
                                <text class="cr-black text-size-sm va-m margin-left-sm">{{item.name}}</text>
                                <view class="right-arrow pa top-0 right-xxxxl">
                                    <iconfont name="icon-arrow-right" size="24rpx" propClass="lh-il" color="#333"></iconfont>
                                </view>
                            </view>
                            <!-- #ifndef H5 -->
                            <view v-if="item.index == 0" class="scan-item border-radius-main tc pa right-0 top-0" :data-index="index" @tap="search_icon_event">
                                <iconfont name="icon-scan" size="36rpx" propClass="lh-il va-m" color="#02b3c2"></iconfont>
                            </view>
                            <!-- #endif -->
                        </view>
                    </block>
                </view>
            </block>

            <!-- 商品购买 -->
            <component-goods-buy ref="goods_buy" :propCurrencySymbol="propCurrencySymbol" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>

            <!-- 购物车抛物线 -->
            <component-cart-para-curve ref="cart_para_curve"></component-cart-para-curve>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentPopup from "@/components/popup/popup";
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentCartParaCurve from '@/components/cart-para-curve/cart-para-curve';
    import componentBadge from '@/components/badge/badge';
    import componentNoData from '@/components/no-data/no-data';

    var static_url = app.globalData.get_static_url('realstore', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                static_url: static_url,
                params: {},
                is_first: 1,
                cart_status: false,
                cart: null,
                info: null,
                base: null,
                source: null,
                // 结算按钮
                settlement_btn_loading: true,
                settlement_btn_status: false,
                settlement_btn_text: this.$t('realstore-cart.realstore-cart.50lf68'),
                // 临时操作数据
                temp_opt_data: null,
                // 下单类型
                cache_buy_use_type_active_index_key: 'cache_plugins_realstore_buy_use_type_active_index_',
                buy_use_type_active_index: 0,
                // 下单类型选择弹窗
                buy_use_type_choice_list: [],
                buy_use_type_choice_status: false,
                cache_buy_use_type_interval_time_key: 'cache_plugins_realstore_buy_use_type_interval_time_',
                // 指定商品信息
                realstore_goods_data: null,
                // 操作按钮是否加载中
                realstore_goods_data_cart_loading: true,
                realstore_goods_data_cart_status: false,
                realstore_goods_data_cart_type: null,
                realstore_goods_data_cart_value: null,
                realstore_goods_data_cart_text: this.$t('realstore-cart.realstore-cart.50lf68'),
                // 样式
                realstore_cart_content_style: ''
            };
        },

        components: {
            componentPopup,
            componentGoodsBuy,
            componentCartParaCurve,
            componentBadge,
            componentNoData
        },
        props: {
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol(),
            },
            propIsBaseMode: {
                type: Boolean,
                default: false,
            },
            propStatus: {
                type: Boolean,
                default: true,
            },
            propIndex: {
                type: Number,
                default: 100
            }
        },

        created: function() {},

        methods: {
            // 获取数据
            init(params) {
                // 非基础模式
                if(!this.propIsBaseMode) {
                    // 获取底部菜单高度、如果当前为底部菜单页面则增加底部间距、如果当前使用了原生菜单则不取底部菜单高度
                    var tabbar_height = (app.globalData.data.is_tabbar_pages == 0 && app.globalData.is_tabbar_pages()) ? (app.globalData.app_tabbar_height_value()*2) : 0;
                    // 门店信息
                    var info = params.info || null;
                    if(info != null && (params.source || null) != null) {
                        this.setData({
                            params: params,
                            info: info,
                            base: params.base || null,
                            source: params.source,
                            realstore_cart_content_style: 'bottom: '+tabbar_height+'rpx',
                        });

                        // 商品来源
                        var type_data = this.buy_use_type_data();
                        if(this.source == 'goods' && (params.realstore_id || null) == null) {
                            // 调用父级需要重新加载数据
                            this.$emit('RefreshLoadingEvent', {buy_use_type_active_index: type_data.active_index, buy_use_type_data_index: type_data.data_index, realstore_id: this.info.id});
                        } else {
                            // 非系统购物车来源
                            if(this.source != 'system-cart') {
                                // 店铺状态正常、是否指定商品、如果不存在操作按钮、不可以加入购物车则置空
                                var cart_status = false;
                                var cart_type = '';
                                var cart_text = '';
                                var realstore_goods_data = params.realstore_goods_data || null;
                                if(realstore_goods_data != null && (realstore_goods_data.buy_button || null) != null) {
                                    // 是否存在错误
                                    if((realstore_goods_data.buy_button.error || null) != null) {
                                        cart_text = realstore_goods_data.buy_button.error;
                                        // 是否展示型、门店存在客服电话则展示电话号码
                                        if((realstore_goods_data.buy_button.data || null) != null && (realstore_goods_data.buy_button['data'][0] || null) != null && realstore_goods_data.buy_button['data'][0]['type'] == 'show') {
                                            var cart_value = ((info.service_data || null) == null ? info.contacts_tel : (info.service_data.service_tel || info.contacts_tel)) || null;
                                            if(cart_value != null) {
                                                cart_status = true;
                                                cart_type = 'show';
                                                cart_text = this.$t('cart.cart.31h34v');
                                            }
                                        }
                                    } else {
                                        // 匹配是否可以加入购物车操作
                                        if(realstore_goods_data.buy_button.data.length > 0) {
                                            var buy_button = realstore_goods_data.buy_button.data;
                                            var arr = ['cart', 'buy', 'plugins-batchbuy-button-cart', 'plugins-batchbuy-button-buy'];
                                            for(var i in buy_button) {
                                                if(arr.indexOf(buy_button[i]['type']) != -1) {
                                                    cart_status = true;
                                                    cart_type = buy_button[i]['type'];
                                                    cart_text = this.$t('realstore-cart.realstore-cart.b27ln3');
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                this.setData({
                                    realstore_goods_data: realstore_goods_data,
                                    realstore_goods_data_cart_status: cart_status,
                                    realstore_goods_data_cart_type: cart_type,
                                    realstore_goods_data_cart_value: cart_value,
                                    realstore_goods_data_cart_loading: false,
                                    realstore_goods_data_cart_text: cart_text,
                                });

                                // 是否需要弹出下单类型选择
                                // 打开开关，并且店铺必须存在下单类型
                                var cache_index = this.get_cache_buy_use_type_active_index();
                                if((this.base || null) != null && parseInt(this.base.is_tips_user_choice_buy_use_type || 0) == 1 && (cache_index === null || cache_index === '') && (this.info.buy_use_type_list || null) != null && this.info.buy_use_type_list.length > 1 && (this.info.status_info || null) != null && this.info.status_info.status == 1) {
                                    // 门店、商品是否开启了弹窗提示
                                    var key = 'is_tips_user_choice_buy_use_type_'+this.params.source+'_detail';
                                    if(parseInt(this.base[key] || 0) == 1) {
                                        // 配置的间隔时间（秒）
                                        var interval_time = parseInt(this.base.tips_user_choice_buy_use_type_interval_time || 0);
                                        // 缓存的间隔时间（秒）
                                        var cache_time = parseInt(uni.getStorageSync(this.cache_buy_use_type_interval_time_key+this.info.id) || 0);
                                        // 当前时间（秒）
                                        var current_time = Date.parse(new Date()) / 1000;
                                        // 配置时间为空 或 缓存时间为空 或 当前时间大于缓存+配置时间
                                        if (interval_time == 0 || (cache_time == 0 || current_time > cache_time+interval_time)) {
                                            // 倒序处理展示、系统默认在店在最前面，目的是让在店在最后面展示
                                            var temp = [];
                                            this.info.buy_use_type_list.forEach((v, i) => {
                                                v['key'] = i;
                                                temp.unshift(v);
                                            });
                                            this.setData({
                                                buy_use_type_choice_list: temp,
                                                buy_use_type_choice_status: true
                                            });
                                        }
                                    }
                                }

                                // 获取购物车数据
                                this.get_cart_data();
                            }
                        }

                        // 设置下单类型
                        this.setData({
                            buy_use_type_active_index: type_data.active_index,
                        });
                    }
                }
            },

            // 获取购物车数据
            get_cart_data() {
                uni.request({
                    url: app.globalData.get_request_url('cartdata', 'detail', 'realstore'),
                    method: 'POST',
                    data: this.request_params_merge(
                        {
                            id: this.info.id || 0,
                        }, 'cart'),
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            this.setData({
                                cart: res.data.data,
                            });

                            // 首次判断是否需要开启购物车
                            if(this.is_first == 1 && (this.params.is_show_cart || 0) == 1) {
                                this.cart_event(true);
                            }

                            // 非首次状态记录
                            this.setData({
                                is_first: 0,
                            });

                            // 购物车获取成功回调
                            this.$emit('CartDataBackEvent', this.cart);
                        } else {
                            app.globalData.showToast(this.$t('realstore-cart.realstore-cart.47h2a0'));
                        }
                        
                        // 结算按钮处理
                        this.settlement_btn_handle();
                    },
                    fail: () => {
                        // 结算按钮处理
                        this.settlement_btn_handle();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 结算按钮处理
            settlement_btn_handle() {
                // 结算按钮状态处理
                var btn_status = true;
                var btn_text = this.$t('goods-category.goods-category.44f1ww');
                if(this.info.status_info.status != 1) {
                    btn_status = false;
                    btn_text = this.info.status_info.msg;
                } else {
                    // 购物车是否存在商品
                    if((this.cart || null) == null || parseInt(this.cart.buy_number || 0) == 0) {
                        btn_status = false;
                    } else {
                        // 起步价
                        var msg = this.starting_price_handle();
                        if(msg !== null) {
                            btn_status = false;
                            btn_text = msg;
                        }
                    }
                }

                this.setData({
                    settlement_btn_status: btn_status,
                    settlement_btn_loading: false,
                    settlement_btn_text: btn_text,
                });
            },

            // 起步价处理
            starting_price_handle() {
                var starting_price = parseFloat(this.info.starting_price) || 0;
                if(starting_price > 0 && (this.cart || null) != null) {
                    if(parseFloat(this.cart.total_price) < starting_price) {
                        // 是否限制类型
                        var limit_type = this.info.starting_price_limit_type_list || [];
                        if(limit_type.length > 0) {
                            var type_data = this.buy_use_type_data();
                            if(limit_type.indexOf(type_data.data_index) != -1 || limit_type.indexOf(type_data.data_index.toString()) != -1) {
                                return temp['name'] + this.$t('realstore-cart.realstore-cart.miv944')+ this.propCurrencySymbol + starting_price;
                            }
                        } else {
                            return this.$t('realstore-cart.realstore-cart.miv944') + this.propCurrencySymbol + starting_price;
                        }
                    }
                }
                return null;
            },

            // 购物车状态切换
            cart_switch_event(e) {
                this.setData({
                    cart_status: !this.cart_status,
                });
            },

            // 购物车状态设置
            cart_event(status) {
                this.setData({
                    cart_status: status,
                });
            },

            // 加入购物车
            cart_submit_event(e) {
                // 是否展示模式、则拨打电话
                if(this.realstore_goods_data_cart_type == 'show' && (this.realstore_goods_data_cart_value || null) != null) {
                    app.globalData.call_tel(this.realstore_goods_data_cart_value);
                    return false;
                }

                // 门店商品是否正常
                if((this.realstore_goods_data || null) == null) {
                    app.globalData.showToast(this.$t('realstore-cart.realstore-cart.20epzm'));
                    return false;
                }
                this.$refs.goods_buy.init(this.realstore_goods_data, {...this.params, ...{buy_event_type: 'cart'}});
            },

            // 购物车结算
            buy_submit_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }

                // 门店状态
                if(!this.is_status_check()) {
                    return false;
                }

                // 获取购物车数据
                var ids = [];
                if((this.cart || null) != null) {
                    var temp_data = this.cart.data || [];
                    for (var i in temp_data) {
                        ids.push(temp_data[i]['id']);
                    }
                }
                if(ids.length <= 0) {
                    app.globalData.showToast(this.$t('realstore-cart.realstore-cart.2dc65q'));
                    return false;
                }

                // 起步价
                var msg = this.starting_price_handle();
                if(msg !== null) {
                    app.globalData.showToast(this.$t('realstore-cart.realstore-cart.2dc65q'));
                    return false;
                }

                // 进入订单确认页面
                var data = this.request_params_merge(
                    {
                        buy_type: 'cart',
                        ids: ids.join(','),
                    }, 'buy');
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },

            // 门店状态判断
            is_status_check() {
                if((this.info || null) == null) {
                    app.globalData.showToast(this.$t('realstore-cart.realstore-cart.8tzr7l'));
                    return false;
                } else {
                    if(this.info.status_info.status != 1) {
                        app.globalData.showToast(this.info.status_info.msg);
                        return false;
                    }
                }
                return true;
            },

            // 批量删除操作
            cart_all_delete_event(e) {
                var self = this;
                uni.showModal({
                    title: self.$t('common.warm_tips'),
                    content: self.$t('goods-category.goods-category.o6i1w2'),
                    confirmText: self.$t('common.confirm'),
                    cancelText: self.$t('common.not_yet'),
                    success: (result) => {
                        if(result.confirm) {
                            self.setData({
                                temp_opt_data: null,
                            });
                            var ids = [];
                            var temp_data = self.cart.data;
                            for (var i in temp_data) {
                                ids.push(temp_data[i]['id']);
                            }
                            self.cart_delete(ids.join(','));
                            self.cart_event(false);
                        }
                    },
                });
            },

            // 购物车数量操作
            cart_stock_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'cart_stock_event', e);
                if(user != false) {
                    var index = e.currentTarget.dataset.index;
                    var type = parseInt(e.currentTarget.dataset.type) || 0;
                    var temp_data = this.cart.data;
                    var temp_goods = temp_data[index];

                    // 数据操作处理
                    var opt_number = this.stock_handle(type, temp_goods, 'stock');
                    if(opt_number === false) {
                        return false;
                    }

                    // 数据临时记录
                    this.setData({
                        temp_opt_data: null,
                    });

                    // 操作类型
                    if(opt_number == 0) {
                        this.cart_delete(temp_goods['id'], temp_goods.goods_id);
                    } else {
                        var number = type == 0 ? parseInt(temp_goods['stock']) - opt_number : opt_number + parseInt(temp_goods['stock']);
                        this.cart_update(temp_goods['id'], temp_goods['goods_id'], number);
                    }
                }
            },

            // 数量操作处理
            stock_handle(type, goods, stock_field) {
                // 加减处理
                var stock = parseInt(goods[stock_field]) || 0;
                if(type == 0) {
                    stock -= 1;
                } else {
                    stock += 1;
                }
                if(stock < 0) {
                    stock = 0;
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
                if(min > 0) {
                    if(type == 0) {
                        if(stock < min) {
                            stock = 0;
                        }
                    } else {
                        if(stock < min) {
                            stock = min;
                        }
                    }
                }

                // 最大购买数量
                var max = spec_buy_max_number > 0 ? spec_buy_max_number : buy_max_number;
                if(max > 0 && stock > max) {
                    stock = max;
                    app.globalData.showToast(this.$t('goods-category.goods-category.z1eh3v') + max + inventory_unit);
                    return false;
                }

                // 数量是否改变
                if(goods[stock_field] == stock) {
                    app.globalData.showToast(this.$t('goods-category.goods-category.1ox23z'));
                    return false;
                }

                // 操作数量
                var opt_number = 1;
                if(type == 0) {
                    if(stock <= 0) {
                        opt_number = 0;
                    }
                } else {
                    if(stock > goods['buy_number']) {
                        opt_number = stock - goods['buy_number'];
                    }
                }
                return opt_number;
            },

            // 购物车添加
            cart_save(goods_id, stock, spec = '') {
                uni.request({
                    url: app.globalData.get_request_url('save', 'cart'),
                    method: 'POST',
                    data: {
                        goods_id: goods_id,
                        stock: stock,
                        spec: spec,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            // 购物车操作成功回调
                            this.cart_opt_success_handle({
                                type: 'save',
                                goods_id: goods_id,
                                stock: stock,
                            });
                        } else {
                            if(app.globalData.is_login_check(res.data)) {
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
            cart_update(cart_id, goods_id, stock) {
                uni.request({
                    url: app.globalData.get_request_url('stock', 'cart'),
                    method: 'POST',
                    data: {
                        id: cart_id,
                        goods_id: goods_id,
                        stock: stock,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            // 购物车操作成功回调
                            this.cart_opt_success_handle({
                                type: 'update',
                                cart_id: cart_id,
                                goods_id: goods_id,
                                stock: stock,
                            });
                        } else {
                            if(app.globalData.is_login_check(res.data)) {
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
            cart_delete(cart_id, goods_id = null) {
                uni.request({
                    url: app.globalData.get_request_url('delete', 'cart'),
                    method: 'POST',
                    data: {
                        id: cart_id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code == 0) {
                            // 购物车操作成功回调
                            this.cart_opt_success_handle({
                                type: (goods_id === null) ? 'all-delete' : 'delete',
                                cart_id: cart_id,
                                goods_id: goods_id,
                                stock: 0,
                            });
                        } else {
                            if(app.globalData.is_login_check(res.data)) {
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

            // 扫码事件
            search_icon_event(e) {
                this.buy_use_type_choice_event(e);
                this.search_icon_handle(e);
            },

            // 搜索icon扫码事件、扫码商品id实现加入购物车
            search_icon_handle(e) {
                var user = app.globalData.get_user_info(this, 'search_icon_handle', e);
                if (user != false) {
                    // 门店状态
                    if (!this.is_status_check()) {
                        return false;
                    }

                    // 调用扫码
                    var self = this;
                    uni.scanCode({
                        success: function (res) {
                            uni.showLoading({
                                title: self.$t('common.processing_in_text'),
                                mask: true,
                            });
                            uni.request({
                                url: app.globalData.get_request_url('scan', 'detail', 'realstore'),
                                method: 'POST',
                                data: self.request_params_merge(
                                    {
                                        value: res.result,
                                    }, 'buy'),
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
                                            app.globalData.showToast(self.$t('common.sub_error_retry_tips'));
                                        }
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(self.$t('common.internet_error_tips'));
                                },
                            });
                        },
                    });
                }
            },

            // 商品操作处理，添加，减少，增加数量自动处理
            goods_opt_handle(type, goods, spec, stock_field, pos = null) {
                var opt_number = this.stock_handle(type, goods, stock_field);
                if(opt_number === false) {
                    return false;
                }

                // 临时存在操作数据
                this.setData({
                    temp_opt_data: {
                        pos: pos,
                        goods: goods,
                        type: type,
                    },
                });

                // 为0或减操作则查询
                var cart_item = this.goods_opt_cart_data(type, goods, spec);
                
                // 操作类型
                if(opt_number == 0) {
                    if(cart_item == null) {
                        app.globalData.showToast(this.$t('goods-category.goods-category.x46kbv'));
                        return false;
                    }
                    this.cart_delete(cart_item.id, cart_item.goods_id);
                } else if(cart_item == null) {
                    this.cart_save(goods['id'], opt_number, spec);
                } else {
                    var number = type == 0 ? parseInt(cart_item['stock']) - opt_number : opt_number + parseInt(cart_item['stock']);
                    this.cart_update(cart_item.id, goods['id'], number);
                }
            },

            // 商品操作获取购物车存在的数据
            // type 0减少, 1增加
            // goods 商品数据
            // spec 操作的商品规格
            goods_opt_cart_data(type, goods, spec = '') {
                var cart_item = null;
                if(type == 0 || (type == 1 && goods['buy_number'] > 0)) {
                    var cart_data = this.cart.data;
                    var params_spec = (spec || null) == null || typeof spec != 'object' ? '' : JSON.stringify(spec);
                    for (var i in cart_data) {
                        if(goods['id'] == cart_data[i]['goods_id']) {
                            var cart_spec = (cart_data[i]['spec'] || null) == null || typeof cart_data[i]['spec'] != 'object' ? '' : JSON.stringify(cart_data[i]['spec']);
                            if(type == 0 || (type == 1 && cart_spec == params_spec)) {
                                cart_item = cart_data[i];
                            }
                            break;
                        }
                    }
                }
                return cart_item;
            },

            // 购物车操作成功处理
            cart_opt_success_handle(params) {
                // 获取购物车数据
                this.get_cart_data();

                // 调用父级
                this.$emit('CartSuccessEvent', params);

                // 执行购物车抛物线
                this.cart_para_curve_handle();
            },

            // 购物车抛物线动画
            cart_para_curve_handle() {
                if((this.temp_opt_data || null) != null && (this.temp_opt_data.pos || null) != null && (this.temp_opt_data.type || 0) == 1) {
                    if((this.$refs.cart_para_curve || null) != null) {
                        this.$refs.cart_para_curve.init(null, this.temp_opt_data.pos, this.temp_opt_data.goods.images, 0);
                    }
                }
            },

            // 使用类型事件
            buy_use_type_event() {
                var self = this;
                uni.showActionSheet({
                    itemList: this.info.buy_use_type_list.map(function (v) {
                        return v.name;
                    }),
                    success: function (res) {
                        self.buy_use_type_confirm_handle(self, res.tapIndex);
                    },
                });
            },

            // 下单类型选择事件
            buy_use_type_choice_event(e) {
                this.buy_use_type_confirm_handle(this, e.currentTarget.dataset.index);
                this.setData({
                    buy_use_type_choice_status: false,
                });
                app.globalData.showToast(this.$t('recommend-form.recommend-form.145ci4'), 'success');
            },

            // 下单类型确认处理
            buy_use_type_confirm_handle(self, index) {
                self.setData({
                    buy_use_type_active_index: index,
                    settlement_btn_loading: true,
                    realstore_goods_data_cart_loading: true,
                });
                uni.setStorageSync(self.cache_buy_use_type_active_index_key+self.info.id, index);

                // 获取购物车数据、系统购物车来源则不执行
                if(this.source != 'system-cart') {
                    self.get_cart_data();
                }

                // 下单类型切换回调
                var type_data = this.buy_use_type_data();
                self.$emit('BuyTypeSwitchEvent', {buy_use_type_active_index: type_data.active_index, buy_use_type_data_index: type_data.data_index, realstore_id: this.info.id});
            },

            // 下单类型弹窗关闭
            buy_use_type_choice_close_event(e) {
                this.setData({
                    buy_use_type_choice_status: false,
                });
                uni.setStorageSync(this.cache_buy_use_type_interval_time_key+this.info.id, Date.parse(new Date()) / 1000);
            },

            // 获取使用类型数据索引、默认在店0
            buy_use_type_data() {
                // 不在店铺设置的类型列表则默认0
                var data = {
                    active_index: 0,
                    data_index: 0,
                }
                // 门店信息
                if((this.info || null) != null) {
                    // 用户未设置类型则使用默认的
                    var active_index = this.get_cache_buy_use_type_active_index();
                    if(active_index !== null && active_index !== '') {
                        var temp = this.info.buy_use_type_list[active_index] || null;
                        if(temp != null) {
                            data['active_index'] = active_index;
                            data['data_index'] = temp.index;
                        }
                    } else {
                        // 是否默认类型
                        if(this.info.default_buy_use_type != undefined && this.info.default_buy_use_type != -1) {
                            // 不在店铺设置的类型列表则默认0
                            for (var i in this.info.buy_use_type_list) {
                                if(this.info.buy_use_type_list[i]['index'] == this.info.default_buy_use_type) {
                                    data['active_index'] = i;
                                    data['data_index'] = this.info.buy_use_type_list[i]['index'];
                                    break;
                                }
                            }
                        }
                    }
                }
                return data;
            },

            // 获取下单类型缓存数据
            get_cache_buy_use_type_active_index() {
                return uni.getStorageSync(this.cache_buy_use_type_active_index_key+this.info.id);
            },

            // 请求参数处理
            // 默认增加使用类型参数
            // 下单 buy / 初始化 init / 获取数据 data / 获取购物车 cart
            request_params_merge(data, type = 'init') {
                // 用户使用类型
                if((this.info || null) != null && (this.info.buy_use_type_list || null) != null && this.info.buy_use_type_list.length > 0) {
                    var type_data = this.buy_use_type_data();
                    data['buy_use_type_data_index'] = type_data.data_index;
                }

                // 初始化
                if(type == 'init' || type == 'buy') {
                    // 桌码
                    if((this.params.tablecode_id || null) != null) {
                        data['tablecode_id'] = this.params.tablecode_id;
                    }
                }

                // 初始化、获取数据
                if(type == 'init' || type == 'data' || type == 'cart') {
                    // 用户选择的位置
                    var lng = 0;
                    var lat = 0;
                    var user_location = app.globalData.choice_user_location_init();
                    if((user_location || null) != null) {
                        lng = user_location.lng || 0;
                        lat = user_location.lat || 0;
                    }
                    data['lng'] = lng;
                    data['lat'] = lat;
                }

                // 提交订单
                if(type == 'buy') {
                    // 门店id
                    data['realstore_id'] = this.info.id;
                }

                return data;
            },

            // 加入购物车成功回调
            goods_cart_back_event(e) {
                this.get_cart_data();
            },

            // 商品事件
            goods_event(e) {
                // 是否可以打开商品页面
                if(app.globalData.data.is_realstore_forbid_to_goods_detail != 1) {
                    // 商品数据缓存处理
                    var goods = this.cart.data[e.currentTarget.dataset.index];
                    goods['id'] = goods.goods_id;
                    app.globalData.goods_data_cache_handle(goods.id, goods);
                    
                    // 调用公共打开url地址
                    var type_data = this.buy_use_type_data();
                    var url = '/pages/goods-detail/goods-detail?id=' + goods.id + '&is_opt_back=1&buy_use_type_data_index=' + type_data.data_index + '&realstore_id=' + this.info.id;
                    app.globalData.url_open(url);
                }
            }
        }
    };
</script>
<style>
    .plugins-realstore-cart-mask,
    .plugins-realstore-buy-type-mask {
        left: 0;
        top: 0;
        background: rgb(0, 0, 0, 0.6);
        z-index: 5;
    }
    .plugins-realstore-cart-content,
    .plugins-realstore-buy-type-choice {
        left: 0;
        bottom: 0;
        z-index: 6;
    }

    /**
     * 购物车列表
     */
    .plugins-realstore-cart-content .cart-list {
        max-height: 60vh;
    }
    .plugins-realstore-cart-content .cart-list .goods-img {
        width: 120rpx;
        height: 120rpx !important;
    }
    .plugins-realstore-cart-content .cart-list .goods-base {
        width: calc(100% - 140rpx);
    }
    .plugins-realstore-cart-content .cart-list .goods-base-content {
        min-height: 60rpx;
    }
    .plugins-realstore-cart-content .cart-list .goods-base .buy-number {
        min-width: 32rpx;
    }

    /**
     * 底部导航
     */
    .plugins-realstore-cart-botton-nav {
        width: calc(100% - 40rpx);
        left: auto;
        bottom: 20rpx;
        z-index: 2;
        margin-left: 20rpx;
        box-shadow: 0rpx 4rpx 8rpx 0px rgba(0, 0, 0, 0.16);
    }
    .plugins-realstore-cart-botton-nav .cart-icon-total .badge-icon {
        top: -20rpx;
        right: -2rpx;
    }
    .plugins-realstore-cart-botton-nav .btn {
        min-width: 160rpx;
        line-height: 70rpx;
        height: 70rpx;
        padding: 0 38rpx;
        border: 0;
        /* #ifdef MP-QQ */
        padding-top: 0;
        padding-bottom: 0;
        /* #endif */
    }

    /**
     * 弹窗下单类型选择
     */
    .plugins-realstore-buy-type-mask {
        z-index: 10;
    }
    .plugins-realstore-buy-type-choice {
        z-index: 11;
        width: calc(100% - 240rpx);
        left: 50%;
        top: 50%;
        height: -webkit-max-content;
        height: max-content;
        transform: translate(-50%, -50%);
    }
    .plugins-realstore-buy-type-choice .item {
        height: 112rpx;
        line-height: 112rpx;
    }
    .plugins-realstore-buy-type-choice .item .scan-item,
    .plugins-realstore-buy-type-choice .item-content-0 {
        background: #E8FFF2;
    }
    .plugins-realstore-buy-type-choice .item-content-1 {
        background: #FFF9DC;
    }
    .plugins-realstore-buy-type-choice .item-content-2 {
        background: #FFE8DC;
    }
    .plugins-realstore-buy-type-choice .item-content-3 {
        background: #EDF9FF;
    }
    .plugins-realstore-buy-type-choice .item-content .left-icon {
        width: 68rpx;
        height: 68rpx;
    }
    .plugins-realstore-buy-type-choice .item:not(:last-child) {
        margin-bottom: 32rpx;
    }
    /* #ifndef H5 */
    .plugins-realstore-buy-type-choice .item-content-0 {
        width: calc(100% - 190rpx);
    }
    .plugins-realstore-buy-type-choice .item .scan-item {
        width: 120rpx;
    }
    /* #endif */
</style>