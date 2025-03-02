<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null" class="page-bottom-fixed">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 基础信息 -->
                <view class="base-container oh spacing-mb">
                    <view class="title-left-border text-size fw-b">{{ data.title }}</view>
                </view>
                <view v-if="(data.goods || null) != null && data.goods.length > 0">
                    <!-- 商品 -->
                    <view class="data-list oh">
                        <view v-for="(item, index) in data.goods" :key="index" class="item padding-main border-radius-main bg-white oh spacing-mb flex-row pr">
                            <image class="goods-img dis-block border-radius-main" :src="item.images" mode="aspectFit" :data-value="item.goods_url" @tap="url_event"></image>
                            <view class="right-base flex-1 flex-width padding-left-main">
                                <view class="flex-row jc-c">
                                    <view :class="'multi-text flex-1 flex-width ' + (data.type == 1 ? 'padding-right' : '')">{{ item.title }}</view>
                                    <label v-if="data.type == 1 && item.is_error == 0" class="tr binding-check pr bottom-sm" :data-index="index" @tap="goods_choice_event">
                                        <radio :checked="item.checked == undefined || item.checked == true" :color="theme_color" style="transform: scale(0.7)" />
                                    </label>
                                </view>
                                <view class="single-text margin-top-sm flex-row align-c">
                                    <view v-if="(item.show_field_price_status || 0) == 1" class="margin-right-lg">
                                        <text class="sales-price va-m">
                                            <text class="text-size-xs">{{ item.show_price_symbol }}</text>
                                            <text class="text-size-lg fw-b">{{ item.price }}</text>
                                        </text>
                                        <text class="cr-grey text-size-xs va-m">{{ item.show_price_unit }}</text>
                                    </view>
                                    <view v-if="(item.discount_price || 0) != 0" class="cr-green text-size-xs">{{$t('detail.detail.6026t4')}}<text class="text-size-xs">{{ currency_symbol }}</text>
                                        {{ item.discount_price }}
                                    </view>
                                </view>
                                <view class="margin-top-xs">
                                    <view v-if="item.is_error == 0" class="flex-row jc-sb align-c">
                                        <view class="flex-row align-c">
                                            <view class="margin-right-sm pr" :data-index="index" @tap="goods_cart_event">
                                                <iconfont name="icon-cart-add" size="42rpx" color="#E22C08"></iconfont>
                                                <view class="cart-badge-icon pa">
                                                    <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                                </view>
                                            </view>
                                            <text class="cr-grey-9 text-size-xs">{{ item.inventory }}{{ item.inventory_unit }}</text>
                                        </view>
                                        <view v-if="(item.is_exist_many_spec || 0) == 1" class="bg-grey-e cr-grey round single-text text-size-xss spec-choice" :data-index="index" @tap="spec_choice_event">
                                            {{ item.spec_choice_text || $t('detail.detail.9624hp') }}
                                            <iconfont name="icon-arrow-bottom" size="14rpx" color="#666" class="pa"></iconfont>
                                        </view>
                                    </view>
                                    <view v-else class="cr-grey-9 text-size-xs">{{ item.error_msg }}</view>
                                </view>
                            </view>
                            <view v-if="item.is_error !== 0" class="pa left-0 right-0 top-0 bottom-0 lose-efficacy flex-row jc-c align-c">
                                <view class="rotate pr">
                                    <image :src="binding_static_url + 'lapse-icon.png'" mode="widthFix" class="dis-block rotate-img"></image>
                                    <text class="rotate-text pa cr-red text-size">{{$t('detail.detail.32171c')}}</text>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 导航 -->
                    <view class="bottom-fixed br-top-shadow pr bg-white bt">
                        <view class="bottom-line-exclude oh flex-row jc-sb align-c">
                            <view class="left-price">
                                <view class="sales-price single-text">
                                    <text class="text-size-xs">
                                        {{ currency_symbol }}
                                    </text>
                                    <text class="price">
                                        {{ data.estimate_price }}
                                    </text>
                                </view>
                                <view v-if="data.estimate_discount_price != 0" class="single-text estimate-discount-price margin-top-sm">
                                    <text class="discount-icon cr-white text-size-xs">{{$t('detail.detail.6026t4')}}</text>
                                    <text class="cr-green text-size-md">
                                        <text class="text-size-xss">
                                            {{ currency_symbol }}
                                        </text>
                                        {{ data.estimate_discount_price }}
                                    </text>
                                </view>
                            </view>
                            <view class="right-button">
                                <button type="default" size="mini" class="btn bg-main br-main cr-white round text-size fw-b wh-auto" @tap="buy_event">{{$t('detail.detail.27pmj3')}}</button>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data propStatus="0" :propMsg="$t('detail.detail.5knxg6')"></component-no-data>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 规格选择 -->
        <component-goods-spec-choice ref="goods_spec_choice" v-on:specConfirmEvent="spec_confirm_event"></component-goods-spec-choice>

        <!-- 商品购买 -->
        <component-goods-buy ref="goods_buy" :propCurrencySymbol="currency_symbol" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsSpecChoice from '@/components/goods-spec-choice/goods-spec-choice';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentBadge from '@/components/badge/badge';
    let binding_static_url = app.globalData.get_static_url('binding', true);

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                binding_static_url: binding_static_url,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.currency_symbol(),
                params: null,
                user: null,
                data_base: null,
                data: null,
                // 自定义分享信息
                share_info: {},
                theme_color: app.globalData.get_theme_color(),
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentGoodsSpecChoice,
            componentGoodsBuy,
            componentBadge
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init_config();

            // 获取数据
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
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
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'binding'),
                    method: 'POST',
                    data: {
                        id: this.params.id || 0,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: (data.data || null) != null && (data.data.goods || null) != null && data.data.goods.length > 0,
                            });

                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.title,
                                        desc: this.data.seo_desc || this.data.describe,
                                        path: '/pages/plugins/binding/detail/detail',
                                        query: 'id=' + this.data.id,
                                        img: this.data.share_images || this.data.images,
                                    },
                                });

                                // 标题
                                if ((this.data.title || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data.title,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
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
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
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
                goods[index]['checked'] = goods[index]['checked'] == undefined || goods[index]['checked'] == true ? false : true;
                temp_data['goods'] = goods;

                // 已选商品
                var min_price = 0;
                var max_price = 0;
                var min_discount_price = 0;
                var max_discount_price = 0;
                for (var i in goods) {
                    if ((goods[i]['checked'] == undefined || goods[i]['checked'] == true) && goods[i]['is_error'] == 0) {
                        min_price += parseFloat(goods[i]['min_price'] || 0);
                        max_price += parseFloat(goods[i]['max_price'] || 0);
                        var discount_price = goods[i]['discount_price'] || null;
                        if (discount_price != null) {
                            if (discount_price.indexOf('-') == -1) {
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
                if (min_price == max_price) {
                    var price = app.globalData.price_two_decimal(min_price);
                } else {
                    var price = app.globalData.price_two_decimal(min_price) + '-' + app.globalData.price_two_decimal(max_price);
                }

                // 节省
                if (min_discount_price == max_discount_price) {
                    var discount_price = app.globalData.price_two_decimal(min_discount_price);
                } else {
                    var discount_price = app.globalData.price_two_decimal(min_discount_price) + '-' + app.globalData.price_two_decimal(max_discount_price);
                }

                // 购买价格
                temp_data['estimate_price'] = price;
                // 节省价格
                temp_data['estimate_discount_price'] = discount_price;
                this.setData({ data: temp_data });
            },

            // 规格选择
            spec_choice_event(e) {
                if ((this.$refs.goods_spec_choice || null) != null) {
                    var index = e.currentTarget.dataset.index || 0;
                    var goods = this.data['goods'][index];
                    this.$refs.goods_spec_choice.init(goods.id, goods['specifications']['choose'], goods.buy_min_number, index);
                }
            },

            // 规格确认回调事件
            spec_confirm_event(value) {
                var temp_data = this.data;
                temp_data['goods'][value.out_value]['spec_choice_data'] = value.spec;
                temp_data['goods'][value.out_value]['spec_choice_text'] = value.spec
                    .map(function (v) {
                        return v.value;
                    })
                    .join(' / ');
                this.setData({ data: temp_data });
            },

            // 立即购买
            buy_event(e) {
                // 是否需要选择商品
                var type = parseInt(this.data.type || 0);
                var goods_data = [];
                var temp_goods = this.data.goods;
                for (var i in temp_goods) {
                    if (temp_goods[i]['is_error'] == 0) {
                        var goods_id = null;
                        if (type == 1) {
                            if (temp_goods[i]['checked'] == undefined || temp_goods[i]['checked'] == true) {
                                goods_id = temp_goods[i]['id'];
                            }
                        } else {
                            goods_id = temp_goods[i]['id'];
                        }
                        if (goods_id !== null) {
                            // 是否存在多规格
                            if ((temp_goods[i]['is_exist_many_spec'] || 0) == 1 && (temp_goods[i]['spec_choice_data'] || null) == null) {
                                app.globalData.showToast(this.$t('detail.detail.8618mj') + (parseInt(i) + 1) + this.$t('detail.detail.09e3bx'));
                                return false;
                            }
                            goods_data.push({
                                goods_id: goods_id,
                                stock: temp_goods[i]['buy_min_number'] || 1,
                                spec: temp_goods[i]['spec_choice_data'] || '',
                            });
                        }
                    } else {
                        // 组合搭配则每一个商品都需要正确状态
                        if (type == 0) {
                            app.globalData.showToast(this.$t('detail.detail.40298g') + (parseInt(i) + 1) + this.$t('detail.detail.5kbjoy'));
                            return false;
                        }
                    }
                }
                var buy_min_number = parseInt(this.data.buy_min_number || 1);
                if (goods_data.length < buy_min_number) {
                    app.globalData.showToast(this.$t('detail.detail.jsj3u8') + buy_min_number + this.$t('detail.detail.jksm81'));
                    return false;
                }

                // 进入订单确认页面
                var data = {
                    binding_id: this.data.id,
                    buy_type: 'goods',
                    goods_data: encodeURIComponent(base64.encode(JSON.stringify(goods_data))),
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },

            // 加入购物车
            goods_cart_event(e) {
                if ((this.$refs.goods_buy || null) != null) {
                    var index = e.currentTarget.dataset.index || 0;
                    var goods = this.data['goods'][index];
                    this.$refs.goods_buy.init(goods, { buy_event_type: 'cart', is_direct_cart: 1 }, { index: index });
                }
            },

            // 加入购物车成功回调
            goods_cart_back_event(e) {
                // 增加数量
                var back = e.back_data;
                var temp = this.data;
                var goods = temp['goods'][back.index];
                goods['user_cart_count'] = parseInt(goods['user_cart_count'] || 0) + parseInt(e.stock);
                if (goods['user_cart_count'] > 99) {
                    goods['user_cart_count'] = '99+';
                }
                temp['goods'][back.index] = goods;
                this.setData({ data: temp });
            },
        },
    };
</script>
<style scoped>
    @import './detail.css';
</style>
