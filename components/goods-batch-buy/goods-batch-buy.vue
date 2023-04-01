<template>
    <view>
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="bg-white">
                <view class="close oh padding-horizontal-main padding-top-main">
                    <view class="fr" @tap.stop="popup_close_event">
                        <icon type="clear" size="20"></icon>
                    </view>
                </view>
                <view class="plugins-batchbuy-container oh">
                    <block v-if="(goods || null) != null && (batchbuy_data || null) != null && (batchbuy_data.goods_spec_data || null) != null && batchbuy_data.goods_spec_data.length > 0">
                        <block v-if="batchbuy_data.is_only_level_one == 0">
                            <view class="left-nav ht-auto pa bg-base">
                                <scroll-view :scroll-y="true" class="ht-auto">
                                    <block v-for="(item, index) in batchbuy_data.goods_spec_data" :key="index">
                                        <view :class="'padding-top-xxl padding-bottom-xxl tc cp oh pr ' + (nav_active_index == index ? 'bg-white cr-main' : '')" :data-index="index" @tap="nav_event">
                                            <image v-if="(item.images || null) != null" class="dis-inline-block va-m radius margin-right" :src="item.images" mode="widthFix"></image>
                                            <text class="text-size-xs cr-base va-m">{{item.name}}</text>
                                            <view v-if="(item.badge_total || 0) > 0" class="badge-icon pa">
                                                <component-badge :propNumber="item.badge_total"></component-badge>
                                            </view>
                                        </view>
                                    </block>
                                </scroll-view>
                            </view>
                            <view class="right-conent ht-auto fr padding-main bs-bb">
                                <scroll-view :scroll-y="true" class="ht-auto">
                                    <block v-for="(item, index) in batchbuy_data.goods_spec_data[nav_active_index]['data']" :key="index">
                                        <view :class="'oh padding-vertical-main '+(index > 0 ? 'br-t' : '')">
                                            <view class="fl item-left">
                                                <view class="text-size-xs">{{item.name}}</view>
                                                <view class="sales-price text-size-xs">{{currency_symbol}}{{item.base.price}}</view>
                                            </view>
                                            <view class="tc oh round fr item-right text-size-xs">
                                                <view @tap="batchbuy_goods_buy_number_event" class="number-submit tc cr-gray fl va-m" data-type="0" :data-index="index">-</view>
                                                <input @blur="batchbuy_goods_buy_number_blur" class="tc cr-gray bg-white fl va-m radius-0" type="number" :value="(item.buy_number || 0)" :data-index="index">
                                                <view @tap="batchbuy_goods_buy_number_event" class="number-submit tc cr-gray fl va-m" data-type="1" :data-index="index">+</view>
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
                                        <view :class="'oh padding-vertical-main '+(index > 0 ? 'br-t' : '')">
                                            <view class="fl item-left">
                                                <view class="text-size-xs">{{item.name}}</view>
                                                <view class="sales-price text-size-xs">{{currency_symbol}}{{item.base.price}}</view>
                                            </view>
                                            <view class="tc oh round fr item-right text-size-xs">
                                                <view @tap="batchbuy_goods_buy_number_event" class="number-submit tc cr-gray fl va-m" data-type="0" :data-index="index">-</view>
                                                <input @blur="batchbuy_goods_buy_number_blur" class="tc cr-gray bg-white fl va-m radius-0" type="number" :value="(item.buy_number || 0)" :data-index="index">
                                                <view @tap="batchbuy_goods_buy_number_event" class="number-submit tc cr-gray fl va-m" data-type="1" :data-index="index">+</view>
                                            </view>
                                        </view>
                                    </block>
                                </scroll-view>
                            </view>
                        </block>
                        <view class="pa confirm-submit padding-horizontal-main wh-auto bs-bb bottom-line-exclude">
                            <button type="default" class="bg-main cr-white text-size tc wh-auto round" @tap="confirm_event">{{(buy_event_type == 'buy') ? '立即购买' : '加入购物车'}}</button>
                        </view>
                    </block>
                    <block v-else>
                        <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">无相关信息</view>
                    </block>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../common/js/lib/base64.js';
    import componentPopup from "../../components/popup/popup";
    import componentBadge from "../../components/badge/badge";
    export default {
        data() {
            return {
                currency_symbol: app.globalData.get_config('currency_symbol', app.globalData.data.currency_symbol),
                popup_status: false,
                nav_active_index: 0,
                buy_event_type: 'buy',
                goods: null,
                batchbuy_data: null,
                back_data: null,
            };
        },

        components: {
            componentPopup,
            componentBadge
        },

        created: function() {},

        methods: {
            // 初始化
            init(goods = null, batchbuy_data = null, buy_event_type = 'buy', back_data = null) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                this.setData({
                    popup_status: true,
                    goods: goods || null,
                    batchbuy_data: batchbuy_data || null,
                    buy_event_type: buy_event_type || 'buy',
                    back_data: back_data,
                });
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false
                });
            },

            // 弹层导航切换
            nav_event(e) {
                this.setData({
                    nav_active_index: e.currentTarget.dataset.index
                });
            },

            // 商品批量下单数量操作事件
            batchbuy_goods_buy_number_event(e) {
                var type = e.currentTarget.dataset.type;
                var index = e.currentTarget.dataset.index;
                var temp_data = this.batchbuy_data
                var temp_spec_data = (parseInt(temp_data.is_only_level_one || 0) == 1) ? temp_data.goods_spec_data[index] : temp_data.goods_spec_data[this.nav_active_index]['data'][index];
                var number = parseInt(temp_spec_data.buy_number || 0);
                var min = parseInt(temp_spec_data.base.buy_min_number || 0);
                // 首次增加使用起购数量
                number = (type == 0) ? number-1 : ((number == 0 && min > 0) ? min : number+1);
                this.batch_goods_buy_number_handle(temp_data, temp_spec_data, index, number);
            },

            // 商品批量下单数量输入事件
            batchbuy_goods_buy_number_blur(e) {
                var number = parseInt(e.detail.value) || 0;
                var index = e.currentTarget.dataset.index;
                var temp_data = this.batchbuy_data
                var temp_spec_data = (parseInt(temp_data.is_only_level_one || 0) == 1) ? temp_data.goods_spec_data[index] : temp_data.goods_spec_data[this.nav_active_index]['data'][index];
                if(isNaN(number)) {
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
                if(number < 0)
                {
                    number = 0;
                }
                // 不能小于起购数则0
                if(number > 0 && min > 0 && number < min)
                {
                    number = 0;
                    app.globalData.showToast('起购' + min + inventory_unit);
                }
                // 不能超过最大限购
                if(max > 0 && number > max)
                {
                    number = max;
                    app.globalData.showToast('限购' + max + inventory_unit);
                }
                // 不能超过库存
                if(number > inventory)
                {
                    number = inventory;
                    app.globalData.showToast('库存数量' + inventory + inventory_unit);
                }
                temp_spec_data['buy_number'] = number;
                if(parseInt(temp_data.is_only_level_one || 0) == 1) {
                    temp_data.goods_spec_data[index] = temp_spec_data;
                } else {
                    temp_data.goods_spec_data[this.nav_active_index]['data'][index] = temp_spec_data
                }

                // 非仅一级则处理一级总数
                if(parseInt(temp_data.is_only_level_one || 0) != 1)
                {
                    var badge_total = 0;
                    temp_data.goods_spec_data[this.nav_active_index]['data'].forEach(item => {
                        badge_total += parseInt(item.buy_number || 0);
                    });
                    temp_data.goods_spec_data[this.nav_active_index]['badge_total'] = badge_total;
                }

                // 设置数据
                this.setData({
                    batchbuy_data: temp_data
                });

                // 总数
                var stock_total = 0;
                temp_data.goods_spec_data.forEach(item => {
                    if(parseInt(temp_data.is_only_level_one || 0) == 1) {
                        stock_total += parseInt(item.buy_number || 0);
                    } else {
                        item.data.forEach(item2 => {
                            stock_total += parseInt(item2.buy_number || 0);
                        });
                    }
                });

                // 下单数据
                var goods_data = [];
                var goods_id = this.goods.id;
                temp_data.goods_spec_data.forEach(item => {
                    if(parseInt(temp_data.is_only_level_one || 0) == 1) {
                        goods_data.push({
                            id: goods_id,
                            stock: stock_total,
                            spec: item.spec || ''
                        });
                    } else {
                        item.data.forEach(item2 => {
                            goods_data.push({
                                id: goods_id,
                                stock: stock_total,
                                spec: item2.spec || ''
                            });
                        });
                    }
                });

                // 数量更新获取最新数据
                uni.request({
                    url: app.globalData.get_request_url('stock', 'goods'),
                    method: 'POST',
                    data: {goods_data: goods_data},
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            res.data.data.forEach(item => {
                                if(item.code == 0)
                                {
                                    for(var i1 in temp_data.goods_spec_data) {
                                        if(parseInt(temp_data.is_only_level_one || 0) == 1) {
                                            temp_data.goods_spec_data[i1].base.price = item.data.spec_base.price;
                                            temp_data.goods_spec_data[i1].base.original_price = item.data.spec_base.original_price;
                                            temp_data.goods_spec_data[i1].base.inventory = item.data.spec_base.inventory;
                                        } else {
                                            for(var i2 in temp_data.goods_spec_data[i1].data) {
                                                if(temp_data.goods_spec_data[i1].data[i2].base.id == item.data.spec_base.id) {
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
                                batchbuy_data: temp_data
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 确认事件
            confirm_event(e) {
                var user = app.globalData.get_user_info(this, 'confirm_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=confirm_event"
                        });
                        return false;
                    } else {
                        // 获取数据
                        var goods_data = [];
                        var goods_id = this.goods.id;
                        this.batchbuy_data.goods_spec_data.forEach(item => {
                            if(parseInt(this.batchbuy_data.is_only_level_one || 0) == 1) {
                                var buy_number = parseInt(item.buy_number || 0);
                                if(buy_number > 0) {
                                    goods_data.push({
                                        goods_id: goods_id,
                                        stock: buy_number,
                                        spec: item.spec || ''
                                    });
                                }
                            } else {
                                item.data.forEach(item2 => {
                                    var buy_number = parseInt(item2.buy_number || 0);
                                    if(buy_number > 0) {
                                        goods_data.push({
                                            goods_id: goods_id,
                                            stock: buy_number,
                                            spec: item2.spec || ''
                                        });
                                    }
                                });
                            }
                        });
                        if(goods_data.length <= 0) {
                            app.globalData.showToast('请选择规格');
                            return false;
                        }

                        // 操作类型
                        switch (this.buy_event_type) {
                            case 'buy':
                                // 进入订单确认页面
                                var data = {
                                    buy_type: "goods",
                                    goods_data: encodeURIComponent(base64.encode(JSON.stringify(goods_data)))
                                };
                                uni.navigateTo({
                                    url: '/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data)))
                                });
                                this.popup_close_event();
                                break;

                            // 加入购物车
                            case 'cart':
                                this.goods_cart_event(goods_data);
                                break;
                                        
                            default:
                                app.globalData.showToast("操作事件类型有误");
                        }
                    }
                }
            },

            // 加入购物车事件
            goods_cart_event(goods_data) {
                uni.showLoading({
                    title: '处理中...'
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'cart'),
                    method: 'POST',
                    data: {goods_data: goods_data},
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');

                            // 调用父级
                            this.$emit('BatchCartSuccessEvent', {
                                cart_number: res.data.data.buy_number,
                                back_data: this.back_data,
                            });

                            // 关闭购买弹窗窗口
                            this.popup_close_event();
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'confirm_event')) {
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
    };
</script>
<style>
    .plugins-batchbuy-container {
        height: 60vh;
        padding-bottom: 100rpx;;
    }
    .plugins-batchbuy-container .left-nav {
        width: 200rpx;
        top: 0;
        left: 0;
    }
    .plugins-batchbuy-container .left-nav .badge-icon {
        top: 8rpx;
        right: 36rpx;
    }
    .plugins-batchbuy-container .left-nav image {
        width: 50rpx;
        height: 50rpx !important;
    }
    .plugins-batchbuy-container .right-conent {
        width: calc(100% - 200rpx);
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
    .plugins-batchbuy-container .item-right input {
        width: 50px;
    }
    .plugins-batchbuy-container .item-right .number-submit,
    .plugins-batchbuy-container .item-right input {
        padding: 0;
        height: 60rpx;
        line-height: 60rpx;
    }
    .plugins-batchbuy-container .right-conent-only-level-one {
        width: 100%;
    }
    .plugins-batchbuy-container .confirm-submit {
        left: 0;
        bottom: 20rpx;
    }
</style>