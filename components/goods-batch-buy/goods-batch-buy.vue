<template>
    <view :class="theme_view">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="bg-white">
                <view class="close oh padding-horizontal-main padding-top-main">
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="plugins-batchbuy-container">
                    <!-- 批发规则 -->
                    <view v-if="(plugins_wholesale_data || null) != null" class="padding-main br-b-f5">
                        <component-wholesale-rules :propCurrencySymbol="propCurrencySymbol" :propData="plugins_wholesale_data"></component-wholesale-rules>
                    </view>
                    <!-- 下单规格选择 -->
                    <view v-if="(goods || null) != null && (batchbuy_data || null) != null && (batchbuy_data.goods_spec_data || null) != null && batchbuy_data.goods_spec_data.length > 0" :class="'spec-data-content oh '+((plugins_wholesale_data || null) != null ? 'wholesale' : '')">
                        <block v-if="batchbuy_data.is_only_level_one == 0">
                            <view class="left-nav ht-auto bg-base fl">
                                <scroll-view :scroll-y="true" class="ht-auto">
                                    <block v-for="(item, index) in batchbuy_data.goods_spec_data" :key="index">
                                        <view :class="'padding-vertical-main tc cp oh pr ' + (nav_active_index == index ? 'bg-white cr-main' : '')" :data-index="index" @tap="nav_event">
                                            <block v-if="(item.images || null) != null">
                                                <image class="dis-inline-block br-f5 radius dis-block spec-images" :src="item.images" mode="widthFix"></image>
                                                <view class="icon-enlarge-submit pa padding-xs lh-sm radius" :data-value="item.images" @tap="spec_images_view_event">
                                                    <iconfont name="icon-enlarge" size="26rpx" color="#fff" propClass="lh-sm"></iconfont>
                                                </view>
                                            </block>
                                            <view class="cr-base">{{ item.name }}</view>
                                            <view v-if="(item.badge_total || 0) > 0" class="badge-icon pa">
                                                <component-badge :propNumber="item.badge_total"></component-badge>
                                            </view>
                                        </view>
                                    </block>
                                </scroll-view>
                            </view>
                            <view class="right-conent ht-auto bs-bb fr">
                                <scroll-view :scroll-y="true" class="ht-auto">
                                    <block v-for="(item, index) in batchbuy_data.goods_spec_data[nav_active_index]['data']" :key="index">
                                        <view class="padding-main oh">
                                            <view class="fl item-left">
                                                <view class="text-size-xs">{{ item.name }}</view>
                                                <view class="sales-price text-size-xs">{{ propCurrencySymbol }}{{ item.base.price }}</view>
                                            </view>
                                            <text v-if="(item.base.inventory || 0) == 0" class="fr text-size-xs cr-grey">{{$t('goods-batch-buy.goods-batch-buy.dsfd98')}}</text>
                                            <view v-else class="tc oh round fr item-right text-size-xs">
                                                <view @tap="batchbuy_goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="0" :data-index="index">-</view>
                                                <input @blur="batchbuy_goods_buy_number_blur" class="number-input tc cr-grey bg-white fl va-m radius-0" type="number" :value="item.buy_number || 0" :data-index="index" />
                                                <view @tap="batchbuy_goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="1" :data-index="index">+</view>
                                            </view>
                                        </view>
                                    </block>
                                </scroll-view>
                            </view>
                        </block>
                        <block v-else>
                            <view class="right-conent ht-auto padding-main bs-bb right-conent-only-level-one">
                                <scroll-view :scroll-y="true" class="ht-auto">
                                    <block v-for="(item, index) in batchbuy_data.goods_spec_data" :key="index">
                                        <view class="oh padding-vertical-main">
                                            <view class="fl item-left">
                                                <view class="pr">
                                                    <block v-if="(item.images || null) != null">
                                                        <image class="dis-inline-block va-m br-f5 radius margin-right-sm spec-images" :src="item.images" mode="widthFix"></image>
                                                        <view class="icon-enlarge-submit pa padding-xs lh-sm radius" :data-value="item.images" @tap="spec_images_view_event">
                                                            <iconfont name="icon-enlarge" size="26rpx" color="#fff" propClass="lh-sm"></iconfont>
                                                        </view>
                                                    </block>
                                                    <text class="text-size-xs va-m">{{ item.name }}</text>
                                                </view>
                                                <view class="sales-price text-size-xs margin-top-xs">{{ propCurrencySymbol }}{{ item.base.price }}</view>
                                            </view>
                                            <text v-if="(item.base.inventory || 0) == 0" class="fr text-size-xs cr-grey">{{$t('goods-batch-buy.goods-batch-buy.dsfd98')}}</text>
                                            <view v-else :class="'tc oh round fr item-right text-size-xs margin-top'+((item.images || null) == null ? 'xs' : '')">
                                                <view @tap="batchbuy_goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="0" :data-index="index">-</view>
                                                <input @blur="batchbuy_goods_buy_number_blur" class="tc cr-grey bg-white fl va-m radius-0" type="number" :value="item.buy_number || 0" :data-index="index" />
                                                <view @tap="batchbuy_goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="1" :data-index="index">+</view>
                                            </view>
                                        </view>
                                    </block>
                                </scroll-view>
                            </view>
                        </block>
                        <view class="confirm-submit pa wh-auto bottom-line-exclude bg-white padding-top-main br-t-f5">
                            <view class="oh padding-horizontal-main padding-bottom-main cr-grey">
                                <text class="text-size-xs">
                                    <text>{{$t('buy.buy.g2vt78')}}</text>
                                    <text class="cr-red padding-left-xs padding-right-xs">{{ base_data.kind }}</text>
                                    <text>{{$t('goods-batch-buy.goods-batch-buy.9ectyf')}}</text>
                                    <text class="cr-red padding-left-xs padding-right-xs">{{ base_data.quantity }}</text>
                                    <text>{{ goods.inventory_unit }}</text>
                                </text>
                                <text class="text-size-xs fr">{{$t('goods-batch-buy.goods-batch-buy.geq82x')}}<text class="fw-b sales-price">{{ propCurrencySymbol }}{{ base_data.amount_money }}</text></text>
                            </view>
                            <view v-if="(opt_button || null) != null && opt_button.length > 0" class="padding-bottom-main">
                                <view :class="'oh buy-nav-btn-number-' + (opt_button.length || 0)">
                                    <block v-for="(item, index) in opt_button" :key="index">
                                        <view v-if="(item.name || null) != null && (item.type || null) != null" class="item fl bs-bb padding-horizontal-main">
                                            <button :class="'cr-white round text-size-sm bg-' + ((item.color || 'main') == 'main' ? 'main' : 'main-pair')" type="default" @tap="confirm_event" :data-type="item.type" hover-class="none">{{ item.name }}</button>
                                        </view>
                                    </block>
                                </view>
                            </view>
                        </view>
                    </view>
                    <block v-else>
                        <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">{{$t('goods-batch-buy.goods-batch-buy.ypby1k')}}</view>
                    </block>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
const app = getApp();
import base64 from "@/common/js/lib/base64.js";
import componentPopup from "@/components/popup/popup";
import componentBadge from "@/components/badge/badge";
import componentWholesaleRules from '@/components/wholesale-rules/wholesale-rules';
export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view(),
            popup_status: false,
            nav_active_index: 0,
            goods: null,
            batchbuy_data: null,
            back_data: null,
            opt_button: [],
            base_data: {
                kind: 0,
                quantity: 0,
                amount_money: "0.00",
            },
            // 批发数据
            plugins_wholesale_data: null,
        };
    },

    components: {
        componentPopup,
        componentBadge,
        componentWholesaleRules
    },
    
    props: {
        // 价格符号
        propCurrencySymbol: {
            type: String,
            default: app.globalData.currency_symbol(),
        },
        // 批发数据
        propPluginsWholesaleData: {
            type: [Array, Object],
            default: null,
        }
    },

    // 页面被展示
    created: function () {
        this.setData({
            plugins_wholesale_data: this.propPluginsWholesaleData,
        });
    },

    methods: {
        // 初始化
        init(params = {}) {
            if (!app.globalData.is_single_page_check()) {
                return false;
            }

            // 购买按钮处理，仅展示购买和购物车
            var opt_button = [];
            var buy_button = params.buy_button || null;
            if(buy_button != null && (buy_button.data || null) != null && buy_button.data.length > 0) {
                var arr = ['plugins-batchbuy-button-cart', 'plugins-batchbuy-button-buy'];
                for(var i in buy_button.data) {
                    if(arr.indexOf(buy_button.data[i]['type']) != -1) {
                        opt_button.push(buy_button.data[i]);
                    }
                }
            }

            // 设置数据
            this.setData({
                popup_status: true,
                opt_button: opt_button,
                goods: params.goods || null,
                batchbuy_data: params.batchbuy_data || null,
                back_data: params.back_data || null,
                plugins_wholesale_data: params.plugins_wholesale_data || null
            });
        },

        // 弹层关闭
        popup_close_event(e) {
            this.setData({
                popup_status: false,
            });
        },

        // 弹层导航切换
        nav_event(e) {
            this.setData({
                nav_active_index: e.currentTarget.dataset.index,
            });
        },

        // 商品批量下单数量操作事件
        batchbuy_goods_buy_number_event(e) {
            var type = e.currentTarget.dataset.type;
            var index = e.currentTarget.dataset.index;
            var temp_data = this.batchbuy_data;
            var temp_spec_data = parseInt(temp_data.is_only_level_one || 0) == 1 ? temp_data.goods_spec_data[index] : temp_data.goods_spec_data[this.nav_active_index]["data"][index];
            var number = parseInt(temp_spec_data.buy_number || 0);
            var min = parseInt(temp_spec_data.base.buy_min_number || 0);
            // 首次增加使用起购数量
            number = type == 0 ? number - 1 : number == 0 && min > 0 ? min : number + 1;
            this.batch_goods_buy_number_handle(temp_data, temp_spec_data, index, number);
        },

        // 商品批量下单数量输入事件
        batchbuy_goods_buy_number_blur(e) {
            var number = parseInt(e.detail.value) || 0;
            var index = e.currentTarget.dataset.index;
            var temp_data = this.batchbuy_data;
            var temp_spec_data = parseInt(temp_data.is_only_level_one || 0) == 1 ? temp_data.goods_spec_data[index] : temp_data.goods_spec_data[this.nav_active_index]["data"][index];
            if (isNaN(number)) {
                number = 0;
            }
            this.batch_goods_buy_number_handle(temp_data, temp_spec_data, index, number);
        },

        // 商品批量下单数量处理
        batch_goods_buy_number_handle(temp_data, temp_spec_data, index, number) {
            var min = parseInt(temp_spec_data.base.buy_min_number || 0);
            var max = parseInt(temp_spec_data.base.buy_max_number || 0);
            var inventory = parseInt(temp_spec_data.base.inventory || 0);
            var inventory_unit = this.goods.inventory_unit;

            // 是否负数
            if (number < 0) {
                number = 0;
            }
            // 不能小于起购数则0
            if (number > 0 && min > 0 && number < min) {
                number = 0;
                app.globalData.showToast(this.$t('recommend-detail.recommend-detail.265vyu') + min + inventory_unit);
            }
            // 不能超过最大限购
            if (max > 0 && number > max) {
                number = max;
                app.globalData.showToast(this.$t('goods-category.goods-category.z1eh3v') + max + inventory_unit);
            }
            // 不能超过库存
            if (number > inventory) {
                number = inventory;
                app.globalData.showToast(this.$t('recommend-detail.recommend-detail.2sis3v') + inventory + inventory_unit);
            }
            temp_spec_data["buy_number"] = number;
            if (parseInt(temp_data.is_only_level_one || 0) == 1) {
                temp_data.goods_spec_data[index] = temp_spec_data;
            } else {
                temp_data.goods_spec_data[this.nav_active_index]["data"][index] = temp_spec_data;
            }

            // 非仅一级则处理一级总数
            if (parseInt(temp_data.is_only_level_one || 0) != 1) {
                var badge_total = 0;
                temp_data.goods_spec_data[this.nav_active_index]["data"].forEach((item) => {
                    var temp_badge = parseInt(item.buy_number || 0);
                    if (temp_badge > 0) {
                        badge_total += temp_badge;
                    }
                });
                temp_data.goods_spec_data[this.nav_active_index]["badge_total"] = badge_total;
            }

            // 总数、汇总
            var stock_total = 0;
            var kind_total = 0;
            var amount_money_total = 0;
            temp_data.goods_spec_data.forEach((item) => {
                if (parseInt(temp_data.is_only_level_one || 0) == 1) {
                    var temp_stock = parseInt(item.buy_number || 0);
                    if (temp_stock > 0) {
                        stock_total += temp_stock;
                        kind_total += 1;
                        amount_money_total += temp_stock * parseFloat(item.base.price);
                    }
                } else {
                    item.data.forEach((item2) => {
                        var temp_stock = parseInt(item2.buy_number || 0);
                        if (temp_stock > 0) {
                            stock_total += temp_stock;
                            kind_total += 1;
                            amount_money_total += temp_stock * parseFloat(item2.base.price);
                        }
                    });
                }
            });

            // 设置数据
            this.setData({
                batchbuy_data: temp_data,
                base_data: {
                    kind: kind_total,
                    quantity: stock_total,
                    amount_money: app.globalData.price_two_decimal(amount_money_total),
                },
            });

            // 下单数据
            var goods_data = [];
            var goods_id = this.goods.id;
            temp_data.goods_spec_data.forEach((item) => {
                if (parseInt(temp_data.is_only_level_one || 0) == 1) {
                    goods_data.push({
                        id: goods_id,
                        stock: stock_total,
                        spec: item.spec || "",
                    });
                } else {
                    item.data.forEach((item2) => {
                        goods_data.push({
                            id: goods_id,
                            stock: stock_total,
                            spec: item2.spec || "",
                        });
                    });
                }
            });

            // 数量更新获取最新数据
            uni.request({
                url: app.globalData.get_request_url("stock", "goods"),
                method: "POST",
                data: { goods_data: goods_data },
                dataType: "json",
                success: (res) => {
                    if (res.data.code == 0) {
                        var plugins_wholesale_data = null;
                        res.data.data.forEach((item) => {
                            if (item.code == 0) {
                                // 批发数据
                                if((item.data.plugins_wholesale_data || null) != null && temp_spec_data.base_id == item.data.spec_base.id) {
                                    plugins_wholesale_data = item.data.plugins_wholesale_data;
                                }
                                // 规格数据处理
                                for (var i1 in temp_data.goods_spec_data) {
                                    if (parseInt(temp_data.is_only_level_one || 0) == 1) {
                                        if (temp_data.goods_spec_data[i1].base.id == item.data.spec_base.id) {
                                            temp_data.goods_spec_data[i1].base.price = item.data.spec_base.price;
                                            temp_data.goods_spec_data[i1].base.original_price = item.data.spec_base.original_price;
                                            temp_data.goods_spec_data[i1].base.inventory = item.data.spec_base.inventory;
                                        }
                                    } else {
                                        for (var i2 in temp_data.goods_spec_data[i1].data) {
                                            if (temp_data.goods_spec_data[i1].data[i2].base.id == item.data.spec_base.id) {
                                                temp_data.goods_spec_data[i1].data[i2].base.price = item.data.spec_base.price;
                                                temp_data.goods_spec_data[i1].data[i2].base.original_price = item.data.spec_base.original_price;
                                                temp_data.goods_spec_data[i1].data[i2].base.inventory = item.data.spec_base.inventory;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        this.setData({
                            batchbuy_data: temp_data,
                            plugins_wholesale_data: plugins_wholesale_data,
                        });
                        
                        // 调用父级
                        this.$emit("BatchStockSuccessEvent", {
                            current_spec: temp_spec_data,
                            goods_data: goods_data,
                            back_data: res.data.data,
                            plugins_wholesale_data: plugins_wholesale_data,
                        });
                    } else {
                        app.globalData.showToast(res.data.msg);
                    }
                },
                fail: () => {
                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                },
            });
        },

        // 确认事件
        confirm_event(e) {
            var user = app.globalData.get_user_info(this, "confirm_event", e);
            if (user != false) {
                // 获取数据
                var goods_data = [];
                var goods_id = this.goods.id;
                this.batchbuy_data.goods_spec_data.forEach((item) => {
                    if (parseInt(this.batchbuy_data.is_only_level_one || 0) == 1) {
                        var buy_number = parseInt(item.buy_number || 0);
                        if (buy_number > 0) {
                            goods_data.push({
                                goods_id: goods_id,
                                stock: buy_number,
                                spec: item.spec || "",
                            });
                        }
                    } else {
                        item.data.forEach((item2) => {
                            var buy_number = parseInt(item2.buy_number || 0);
                            if (buy_number > 0) {
                                goods_data.push({
                                    goods_id: goods_id,
                                    stock: buy_number,
                                    spec: item2.spec || "",
                                });
                            }
                        });
                    }
                });
                if (goods_data.length <= 0) {
                    app.globalData.showToast(this.$t('goods-detail.goods-detail.6brk57'));
                    return false;
                }

                // 操作类型
                switch (e.currentTarget.dataset.type) {
                    case "plugins-batchbuy-button-buy":
                        // 进入订单确认页面
                        var data = {
                            buy_type: "goods",
                            goods_data: encodeURIComponent(base64.encode(JSON.stringify(goods_data))),
                        };
                        app.globalData.url_open("/pages/buy/buy?data=" + encodeURIComponent(base64.encode(JSON.stringify(data))));
                        this.popup_close_event();
                        break;

                    // 加入购物车
                    case "plugins-batchbuy-button-cart":
                        this.goods_cart_event(goods_data);
                        break;

                    default:
                        app.globalData.showToast(this.$t('goods-batch-buy.goods-batch-buy.7tp1tc'));
                }
            }
        },

        // 加入购物车事件
        goods_cart_event(goods_data) {
            uni.showLoading({
                title: this.$t('common.processing_in_text'),
            });
            uni.request({
                url: app.globalData.get_request_url("save", "cart"),
                method: "POST",
                data: { goods_data: goods_data },
                dataType: "json",
                success: (res) => {
                    uni.hideLoading();
                    if (res.data.code == 0) {
                        app.globalData.showToast(res.data.msg, "success");

                        // 调用父级
                        this.$emit("BatchCartSuccessEvent", {
                            cart_number: res.data.data.buy_number,
                            back_data: this.back_data,
                        });

                        // 关闭购买弹窗窗口
                        this.popup_close_event();
                    } else {
                        if (app.globalData.is_login_check(res.data, this, "confirm_event")) {
                            app.globalData.showToast(res.data.msg);
                        }
                    }
                },
                fail: () => {
                    uni.hideLoading();
                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                },
            });
        },

        // 规格图片预览事件
        spec_images_view_event(e) {
            var value = e.currentTarget.dataset.value || null;
            if (value != null) {
                uni.previewImage({
                    current: value,
                    urls: [value],
                });
            }
        }
    },
};
</script>
<style>
    .plugins-batchbuy-container {
        height: 70vh;
        padding-bottom: 160rpx;
    }
    .plugins-batchbuy-container .spec-data-content {
        height: calc(100% - 15rpx);
    }
    .plugins-batchbuy-container .spec-data-content.wholesale {
        height: calc(100% - 160rpx);
    }
    .plugins-batchbuy-container .left-nav {
        width: 200rpx;
    }
    .plugins-batchbuy-container .left-nav .badge-icon {
        top: 8rpx;
        right: 36rpx;
    }
    .plugins-batchbuy-container .left-nav .spec-images {
        width: 100rpx;
        height: 100rpx !important;
    }
    .plugins-batchbuy-container .icon-enlarge-submit {
        left: 55rpx;
        top: 30rpx;
        background: rgb(0, 0, 0, 30%);
    }
    .plugins-batchbuy-container .right-conent {
        width: calc(100% - 210rpx);
    }
    .plugins-batchbuy-container .right-conent .item-left {
        width: calc(100% - 290rpx);
    }
    .plugins-batchbuy-container .item-right {
        background: #fbfbfb;
        border: 1px solid #f0f0f0;
    }
    .plugins-batchbuy-container .item-right .number-submit {
        width: 80rpx;
        font-weight: bold;
    }
    .plugins-batchbuy-container .item-right .number-input {
        width: 50px;
    }
    .plugins-batchbuy-container .item-right .number-submit,
    .plugins-batchbuy-container .item-right .number-input {
        padding: 0;
        height: 60rpx;
        line-height: 60rpx;
    }
    .plugins-batchbuy-container .right-conent-only-level-one {
        width: 100%;
    }
    .plugins-batchbuy-container .right-conent-only-level-one .spec-images {
        width: 100rpx;
        height: 100rpx !important;
    }
    .plugins-batchbuy-container .right-conent-only-level-one .icon-enlarge-submit {
        left: 5rpx;
        top: 5rpx;
    }
    .plugins-batchbuy-container .confirm-submit {
        left: 0;
        bottom: 0;
    }
    .plugins-batchbuy-container .buy-nav-btn-number-0 .item,
    .plugins-batchbuy-container .buy-nav-btn-number-1 .item {
        width: 100% !important;
    }
    .plugins-batchbuy-container .buy-nav-btn-number-2 .item {
        width: 50% !important;
    }
    .plugins-batchbuy-container .buy-nav-btn-number-3 .item {
        width: 33.33% !important;
    }
    .plugins-batchbuy-container .buy-nav-btn-number-4 .item {
        width: 25% !important;
    }
</style>
