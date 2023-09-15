<template>
    <view>
        <view v-if="(data || null) != null" class="page-bottom-fixed">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 基础信息 -->
                <view class="base-container oh spacing-mb">
                    <image v-if="(data.images || null) != null" class="dis-inline-block round br va-m margin-right-sm icon" :src="data.images" mode="aspectFit"></image>
                    <view class="text-size cr-base fw dis-inline-block va-m title">{{data.title}}</view>
                    <button class="round bg-white br-green cr-green fr share-submit" type="default" size="mini" hover-class="none" @tap="share_event" :data-index="index">
                        <view class="dis-inline-block va-m">
                            <uni-icons type="redo" size="34rpx" color="#1AAD19"></uni-icons>
                        </view>
                        <text class="va-m">分享</text>
                    </button>
                </view>

                <view v-if="(data.goods || null) != null && data.goods.length > 0">
                    <!-- 商品 -->
                    <view class="data-list oh">
                        <view v-for="(item, index) in data.goods" :key="index" :class="'item padding-main border-radius-main bg-white oh spacing-mb '+(item.is_error == 0 ? '' : 'br-red')">
                            <image class="goods-img dis-block border-radius-main fl" :src="item.images" mode="aspectFit" :data-value="item.goods_url" @tap="url_event"></image>
                            <view class="right-base fr">
                                <label v-if="data.type == 1 && item.is_error == 0" class="fr" :data-index="index" @tap="goods_choice_event">
                                    <radio :checked="(item.checked == undefined || item.checked == true)" style="transform:scale(0.9)" />
                                </label>
                                <view :class="'multi-text '+(data.type == 1 ? 'padding-right' : '')">{{item.title}}</view>
                                <view class="single-text margin-top-sm">
                                    <text class="sales-price">{{currency_symbol}}{{item.price}}</text>
                                    <text v-if="(item.discount_price || 0) != 0" class="cr-green margin-left-lg text-size-xs">节省{{currency_symbol}}{{item.discount_price}}</text>
                                </view>
                                <view class="margin-top-xs">
                                    <view v-if="item.is_error == 0">
                                        <view class="va-m dis-inline-block margin-right-xl pr" :data-index="index" @tap="goods_cart_event">
                                            <uni-icons type="cart" size="46rpx" color="#999"></uni-icons>
                                            <view class="cart-badge-icon pa">
                                                <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                            </view>
                                        </view>
                                        <text class="cr-gray text-size-xs">{{item.inventory}}{{item.inventory_unit}}</text>
                                        <view v-if="(item.is_exist_many_spec || 0) == 1" class="br-gray cr-gray round fr padding-left padding-right single-text text-size-xs spec-choice" :data-index="index" @tap="spec_choice_event">{{item.spec_choice_text || '选择规格'}}</view>
                                    </view>
                                    <view v-else class="cr-yellow text-size-xs">{{item.error_msg}}</view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 导航 -->
                    <view class="nav-button bottom-fixed padding-main pr bg-white">
                        <view class="bottom-line-exclude oh">
                            <view class="left-price fl">
                                <view v-if="data.estimate_discount_price != 0" class="pa single-text estimate-discount-price">
                                    <text class="discount-icon cr-white text-size-xs">节省</text>
                                    <text class="cr-green">{{currency_symbol}}{{data.estimate_discount_price}}</text>
                                </view>
                                <view :class="'sales-price single-text margin-top-'+(data.estimate_discount_price == 0 ? 'sm' : 'xl')">{{currency_symbol}}{{data.estimate_price}}</view>
                            </view>
                            <view class="right-button fr tr">
                                <button type="default" size="mini" class="bg-main br-main cr-white round dis-block text-size-sm" @tap="buy_event">立即购买</button>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data propStatus="0" propMsg="没有相关商品"></component-no-data>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 分享弹窗 -->
            <component-share-popup ref="share"></component-share-popup>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 规格选择 -->
        <component-goods-spec-choice ref="goods_spec_choice" v-on:specConfirmEvent="spec_confirm_event"></component-goods-spec-choice>
        
        <!-- 商品购买 -->
        <component-goods-buy ref="goods_buy" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../../../common/js/lib/base64.js';
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";
    import componentGoodsSpecChoice from "../../../../components/goods-spec-choice/goods-spec-choice";
    import componentGoodsBuy from "../../../../components/goods-buy/goods-buy";
    import componentBadge from "../../../../components/badge/badge";
    import componentSharePopup from "../../../../components/share-popup/share-popup";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.currency_symbol(),
                params: null,
                user: null,
                data_base: null,
                data: null,
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentGoodsSpecChoice,
            componentGoodsBuy,
            componentBadge,
            componentSharePopup
        },

        onLoad(params) {
            this.setData({
                params: params
            });
        },

        onShow() {
            // 初始化配置
            this.init_config();

            // 获取数据
            this.get_data();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
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

            // 获取数据
            get_data() {
                uni.showLoading({
                    title: '加载中...'
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "index", "binding"),
                    method: 'POST',
                    data: {
                        id: this.params.id || 0
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: ((data.data || null) != null && (data.data.goods || null) != null && data.data.goods.length > 0)
                            });

                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.title,
                                        desc: this.data.seo_desc || this.data.describe,
                                        path: '/pages/plugins/binding/detail/detail',
                                        query: 'id='+this.data.id,
                                        img: this.data.images
                                    }
                                });

                                // 标题
                                if((this.data.title || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data.title
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 商品选择事件
            goods_choice_event(e) {
                // 选择处理
                var index = e.currentTarget.dataset.index || 0;
                var temp_data = this.data;
                var goods = temp_data.goods;
                goods[index]['checked'] = (goods[index]['checked'] == undefined || goods[index]['checked'] == true) ? false : true;
                temp_data['goods'] = goods;

                // 已选商品
                var min_price = 0;
                var max_price = 0;
                var min_discount_price = 0;
                var max_discount_price = 0;
                for(var i in goods) {
                    if((goods[i]['checked'] == undefined || goods[i]['checked'] == true) && goods[i]['is_error'] == 0) {
                        min_price += parseFloat(goods[i]['min_price'] || 0);
                        max_price += parseFloat(goods[i]['max_price'] || 0);
                        var discount_price = goods[i]['discount_price'] || null;
                        if(discount_price != null)
                        {
                            if(discount_price.indexOf('-') == -1)
                            {
                                min_discount_price += parseFloat(discount_price);
                                max_discount_price += parseFloat(discount_price);
                            } else {
                                var temp = discount_price.split('-');
                                min_discount_price += parseFloat(temp[0]);
                                max_discount_price += parseFloat(temp[1]);
                            }
                        }
                    }
                }

                // 价格
                if(min_price == max_price)
                {
                    var price = app.globalData.price_two_decimal(min_price);
                } else {
                    var price = app.globalData.price_two_decimal(min_price)+'-'+app.globalData.price_two_decimal(max_price);
                }

                // 节省
                if(min_discount_price == max_discount_price)
                {
                    var discount_price = app.globalData.price_two_decimal(min_discount_price);
                } else {
                    var discount_price = app.globalData.price_two_decimal(min_discount_price)+'-'+app.globalData.price_two_decimal(max_discount_price);
                }

                // 购买价格
                temp_data['estimate_price'] = price;
                // 节省价格
                temp_data['estimate_discount_price'] = discount_price;
                this.setData({data: temp_data});
            },

            // 规格选择
            spec_choice_event(e) {
                if((this.$refs.goods_spec_choice || null) != null) {
                    var index = e.currentTarget.dataset.index || 0;
                    var goods = this.data['goods'][index];
                    this.$refs.goods_spec_choice.init(goods.id, goods['specifications']['choose'], goods.buy_min_number, index);
                }
            },

            // 规格确认回调事件
            spec_confirm_event(value) {
                var temp_data = this.data;
                temp_data['goods'][value.out_value]['spec_choice_data'] = value.spec;
                temp_data['goods'][value.out_value]['spec_choice_text'] = value.spec.map(function(v){return v.value;}).join(' / ');
                this.setData({data: temp_data});
            },

            // 立即购买
            buy_event(e) {
                // 是否需要选择商品
                var type = parseInt(this.data.type || 0);
                var goods_data = [];
                var temp_goods = this.data.goods;
                for(var i in temp_goods) {
                    if(temp_goods[i]['is_error'] == 0) {
                        var goods_id = null;
                        if(type == 1) {
                            if(temp_goods[i]['checked'] == undefined || temp_goods[i]['checked'] == true) {
                                goods_id = temp_goods[i]['id'];
                            }
                        } else {
                            goods_id = temp_goods[i]['id'];
                        }
                        if(goods_id !== null) {
                            // 是否存在多规格
                            if((temp_goods[i]['is_exist_many_spec'] || 0) == 1 && (temp_goods[i]['spec_choice_data'] || null) == null) {
                                app.globalData.showToast('请选择第'+(parseInt(i)+1)+'个商品规格');
                                return false;
                            }
                            goods_data.push({
                                goods_id: goods_id,
                                stock: temp_goods[i]['buy_min_number'] || 1,
                                spec: temp_goods[i]['spec_choice_data'] || ''
                            });
                        }
                    } else {
                        // 组合搭配则每一个商品都需要正确状态
                        if(type == 0) {
                            app.globalData.showToast('第'+(parseInt(i)+1)+'个商品不可用');
                            return false;
                        }
                    }
                }
                var buy_min_number = parseInt(this.data.buy_min_number || 1);
                if(goods_data.length < buy_min_number) {
                    app.globalData.showToast('请至少选择'+buy_min_number+'个商品');
                    return false;
                }

                // 进入订单确认页面
                var data = {
                    binding_id: this.data.id,
                    buy_type: "goods",
                    goods_data: encodeURIComponent(base64.encode(JSON.stringify(goods_data)))
                };
                uni.navigateTo({
                    url: '/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data)))
                });
            },

            // 加入购物车
            goods_cart_event(e) {
                if((this.$refs.goods_buy || null) != null) {
                    var index = e.currentTarget.dataset.index || 0;
                    var goods = this.data['goods'][index];
                    this.$refs.goods_buy.init(goods, {buy_event_type: 'cart', is_direct_cart: 1}, {index: index});
                }
            },

            // 加入购物车成功回调
            goods_cart_back_event(e) {
                // 增加数量
                var back = e.back_data;
                var temp = this.data;
                var goods = temp['goods'][back.index];
                goods['user_cart_count'] = parseInt(goods['user_cart_count'] || 0)+parseInt(e.stock);
                if(goods['user_cart_count'] > 99) {
                    goods['user_cart_count'] = '99+';
                }
                temp['goods'][back.index] = goods;
                this.setData({data: temp});
            },

            // 分享开启弹层
            share_event(e) {
                if((this.$refs.share || null) != null) {
                    this.$refs.share.init();
                }
            }
        }
    };
</script>
<style>
    @import './detail.css';
</style>