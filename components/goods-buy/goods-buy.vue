<template>
    <view>
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="goods-spec-choice-container padding-main bg-white pr">
                <view class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <icon type="clear" size="20"></icon>
                    </view>
                </view>
                <!-- 规格基础信息 -->
                <view class="goods-spec-base oh br-b pr">
                    <image :src="goods_spec_base_images" mode="scaleToFill" class="radius br" @tap="goods_detail_images_view_event" :data-value="goods_spec_base_images"></image>
                    <view class="goods-spec-base-content">
                        <view class="goods-price">
                            <view class="sales-price">{{currency_symbol}}{{goods_spec_base_price}}</view>
                            <view v-if="(goods_spec_base_original_price || null) != null && goods_spec_base_original_price != 0" class="original-price margin-top-sm">{{currency_symbol}}{{goods_spec_base_original_price}}</view>
                        </view>
                        <view class="inventory text-size-xs margin-top-xs">
                            <text class="cr-gray">库存</text>
                            <text class="cr-base">{{goods_spec_base_inventory}}</text>
                            <text class="cr-gray">{{goods.inventory_unit}}</text>
                        </view>
                    </view>
                </view>
                <view class="goods-spec-choice-content">
                    <!-- 商品规格 -->
                    <view v-if="goods_spec_choose.length > 0" class="goods-spec-choose">
                        <view v-for="(item, key) in goods_spec_choose" :key="key" class="item padding-top-xxl padding-bottom-xxl">
                            <view class="text-size-sm">{{item.name}}</view>
                            <view v-if="item.value.length > 0" class="spec margin-top-sm">
                                <block v-for="(items, keys) in item.value" :key="keys">
                                    <button @tap.stop="goods_spec_choice_event" :data-key="key" :data-keys="keys" type="default" size="mini" hover-class="none" :class="'round '+items.is_active + ' ' + items.is_dont + ' ' + items.is_disabled">
                                        <image v-if="(items.images || null) != null" :src="items.images" mode="scaleToFill" class="va-m dis-inline-block round margin-right-sm"></image>
                                        <text class="va-m">{{items.name}}</text>
                                    </button>
                                </block>
                            </view>
                        </view>
                    </view>

                    <!-- 购买数量 -->
                    <view class="goods-buy-number oh pr margin-top-xl margin-bottom-xxl">
                        <view class="fl margin-top">购买数量</view>
                        <view class="number-content tc oh round">
                            <view @tap="goods_buy_number_event" class="number-submit tc cr-gray fl" data-type="0">-</view>
                            <input @blur="goods_buy_number_blur" class="tc cr-gray fl" type="number" :value="buy_number">
                            <view @tap="goods_buy_number_event" class="number-submit tc cr-gray fl" data-type="1">+</view>
                        </view>
                    </view>
                </view>
                <button class="bg-main br-main cr-white text-size-sm round" type="default" @tap.stop="spec_confirm_event" hover-class="none">确定</button>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../common/js/lib/base64.js';
    import componentPopup from "../../components/popup/popup";
    export default {
        data() {
            return {
                currency_symbol: app.globalData.get_config('currency_symbol', app.globalData.data.currency_symbol),
                params: {},
                back_data: {},
                popup_status: false,
                goods_spec_base_price: 0,
                goods_spec_base_original_price: 0,
                goods_spec_base_inventory: 0,
				goods_spec_base_buy_min_number: 0,
				goods_spec_base_buy_max_number: 0,
                goods_spec_base_images: '',
                goods: {},
                goods_spec_choose: [],
                buy_number: 1,
                buy_event_type: 'cart',
                // 智能工具插件
                plugins_intellectstools_config: app.globalData.get_config('plugins_base.intellectstools.data'),
                plugins_intellectstools_timer: null,
                plugins_intellectstools_timerout: null,
            };
        },

        components: {
            componentPopup
        },

        created: function() {},

        methods: {
            // 获取数据
            init(goods = {}, params = {}, back_data = null) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                this.setData({
                    popup_status: true,
                    params: params || {},
                    back_data: back_data,
                    goods: goods || {},
                    goods_spec_choose: goods.specifications.choose || [],
                    goods_spec_base_price: goods.price,
                    goods_spec_base_original_price: goods.original_price || 0,
                    goods_spec_base_inventory: goods.inventory,
                    goods_spec_base_images: goods.images,
                    buy_number: goods.buy_min_number || 1,
                    buy_event_type: params.buy_event_type || 'cart'
                });

                // 不能选择规格处理
                this.spec_handle_dont(0, 1);

                // 是否默认选中第一个规格
                this.plugins_intellectstools_selected_spec_handle();
            },

            // 默认选中第一个规格
            plugins_intellectstools_selected_spec_handle() {
                // 是否已选择
                var temp_data = this.goods_spec_choose;
                if (temp_data.length > 0) {
                    var active_count = 0;
                    for (var i in temp_data) {
                        for (var k in temp_data[i]['value']) {
                            if ((temp_data[i]['value'][k]['is_active'] || null) != null) {
                                active_count++;
                            }
                        }
                    }
                    if (active_count > 0) {
                        return false;
                    }

                    // 选择处理
                    var self = this;
                    // 销毁之前的任务
                    clearInterval(self.plugins_intellectstools_timer);
                    clearInterval(self.plugins_intellectstools_timerout);
                    // 读取智能工具插件配置、是否开启
                    var config = self.plugins_intellectstools_config || null;
                    if(config != null && (config.is_goods_detail_selected_first_spec || 0) == 1) {
                        // 必须存在购买和加入购物车任意一个、规格必须多个
                        var buy = self.buy_button;
                        var sku_count = app.globalData.get_length(temp_data);
                        // 先清除价格展示信息
                        self.setData({
                            goods_spec_base_price: '...',
                            goods_spec_base_original_price: '...'
                        });
                        var num = 0;
                        var timer = setInterval(function() {
                            for(var i in temp_data) {
                                // 清除价格展示信息、避免获取价格类型赋值
                                self.setData({
                                    goods_spec_base_price: '...',
                                    goods_spec_base_original_price: '...'
                                });
                                // 必须不存在已选择项
                                var active = temp_data[i]['value'].map(function(v){return v.is_active}).join('') || null;
                                if(active == null) {
                                    var status = false;
                                    for(var k in temp_data[i]['value']) {
                                        // 必须是可选和未选
                                        if(!status && (temp_data[i]['value'][k]['is_disabled'] || null) == null && (temp_data[i]['value'][k]['is_dont'] || null) == null) {
                                            self.goods_spec_choice_handle(i, k);
                                            status = true;
                                            num++;
                                        }
                                    }
                                }
                            }
                            if(num >= sku_count) {
                                clearInterval(self.plugins_intellectstools_timer);
                            }
                        }, 100);
                        var timerout = setTimeout(function() {
                            clearInterval(self.plugins_intellectstools_timerout);
                        }, 20000);
                        self.setData({
                            plugins_intellectstools_timer: timer,
                            plugins_intellectstools_timerout: timerout
                        });
                    }
                }
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false
                });
            },

            // 规格事件
            goods_spec_choice_event(e) {
                var key = e.currentTarget.dataset.key || 0;
                var keys = e.currentTarget.dataset.keys || 0;
                this.goods_spec_choice_handle(key, keys);
            },

            // 规格选择处理
            goods_spec_choice_handle(key, keys) {
                var temp_spec = this.goods_spec_choose;
                // 不能选择和禁止选择跳过
                if ((temp_spec[key]['value'][keys]['is_dont'] || null) == null && (temp_spec[key]['value'][keys]['is_disabled'] || null) == null) {
                    // 规格选择
                    for (var i in temp_spec) {
                        for (var k in temp_spec[i]['value']) {
                            if ((temp_spec[i]['value'][k]['is_dont'] || null) == null && (temp_spec[i]['value'][k]['is_disabled'] || null) == null) {
                                if (key == i) {
                                    if (keys == k && (temp_spec[i]['value'][k]['is_active'] || null) == null) {
                                        temp_spec[i]['value'][k]['is_active'] = 'cr-white bg-main br-main';
                                    } else {
                                        temp_spec[i]['value'][k]['is_active'] = '';
                                    }
                                }
                            }
                        }
                    }
                    this.setData({
                        spec: temp_spec
                    });

                    // 不能选择规格处理
                    this.spec_handle_dont(key);

                    // 获取下一个规格类型
                    this.get_spec_type(key);

                    // 获取规格详情
                    this.get_spec_detail();
                }
            },
            
            // 获取下一个规格类型
            get_spec_type(key) {
                var temp_spec = this.goods_spec_choose;
                var active_index = parseInt(key) + 1;
                var sku_count = app.globalData.get_length(temp_spec);
                if (active_index <= 0 || active_index >= sku_count) {
                    return false;
                }

                // 获取规格值
                var spec = [];
                for (var i in temp_spec) {
                    for (var k in temp_spec[i]['value']) {
                        if ((temp_spec[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                type: temp_spec[i]['name'],
                                value: temp_spec[i]['value'][k]['name']
                            });
                            break;
                        }
                    }
                }
                if (spec.length <= 0) {
                    return false;
                }

                // 获取数据
                var data = this.params;
                data['id'] = this.goods.id;
                data['spec'] = JSON.stringify(spec);
                uni.request({
                    url: app.globalData.get_request_url('spectype', 'goods'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var spec_type = res.data.data.spec_type;
                            var spec_count = spec.length;
                            var index = spec_count > 0 ? spec_count : 0;
                            if (index < sku_count) {
                                for (var i in temp_spec) {
                                    for (var k in temp_spec[i]['value']) {
                                        if (index == i) {
                                            temp_spec[i]['value'][k]['is_dont'] = '';
                                            var temp_value = temp_spec[i]['value'][k]['name'];
                                            var temp_status = false;
                                            for (var t in spec_type) {
                                                if (spec_type[t] == temp_value) {
                                                    temp_status = true;
                                                    break;
                                                }
                                            }
                                            if (temp_status == true) {
                                                temp_spec[i]['value'][k]['is_disabled'] = '';
                                            } else {
                                                temp_spec[i]['value'][k]['is_disabled'] = 'spec-items-disabled';
                                            }
                                        }
                                    }
                                }
                                this.setData({
                                    spec: temp_spec
                                });
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 获取规格详情
            get_spec_detail() {
                // 获取规格值
                var spec = this.goods_selected_spec();

                // 存在规格的时候是否已完全选择规格
                var sku_count = this.goods_spec_choose.length;
                var active_count = spec.length;
                if (spec.length <= 0 || active_count < sku_count) {
					var buy_number = parseInt(this.buy_number);
					var buy_min_number = parseInt(this.goods.buy_min_number || 1);
					var buy_max_number = parseInt(this.goods.buy_max_number || 0);
					if(buy_number < buy_min_number) {
						buy_number = buy_min_number;
					}
					if(buy_max_number > 0 && buy_number > buy_max_number) {
						buy_number = buy_max_number;
					}
                    this.setData({
                        goods_spec_base_price: this.goods.price,
                        goods_spec_base_original_price: this.goods.original_price || 0,
                        goods_spec_base_inventory: this.goods.inventory,
						goods_spec_base_buy_min_number : 0,
						goods_spec_base_buy_max_number : 0,
						buy_number: buy_number
                    });
                    return false;
                }

                // 获取数据
                var data = this.params;
                data['id'] = this.goods.id;
                data['spec'] = JSON.stringify(spec);
                data['stock'] = this.buy_number;
                uni.request({
                    url: app.globalData.get_request_url('specdetail', 'goods'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            this.goods_spec_detail_back_handle(res.data.data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 商品规格详情返回数据处理
            goods_spec_detail_back_handle(data) {
                var spec_base = data.spec_base;
				var buy_number = parseInt(this.buy_number);
				var spec_buy_min_number = parseInt(spec_base.buy_min_number || 1);
				var spec_buy_max_number = parseInt(spec_base.buy_max_number || 0);
				if(spec_buy_min_number > 0 && buy_number < spec_buy_min_number) {
					buy_number = spec_buy_min_number;
				}
				if(spec_buy_max_number > 0 && buy_number > spec_buy_max_number) {
					buy_number = spec_buy_max_number;
				}
                this.setData({
                    goods_spec_base_price: spec_base.price,
                    goods_spec_base_original_price: spec_base.original_price || 0,
                    goods_spec_base_inventory: parseInt(spec_base.inventory || 0),
					goods_spec_base_buy_min_number: spec_buy_min_number,
					goods_spec_base_buy_max_number: spec_buy_max_number,
					buy_number: buy_number
                });
            },

            // 已选的商品规格
            goods_selected_spec() {
                var spec = [];
                var temp_spec = this.goods_spec_choose;
                for (var i in temp_spec) {
                    for (var k in temp_spec[i]['value']) {
                        if ((temp_spec[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                type: temp_spec[i]['name'],
                                value: temp_spec[i]['value'][k]['name']
                            });
                            break;
                        }
                    }
                }
                return spec;
            },

            // 不能选择规格处理
            spec_handle_dont(key, is_init = 0) {
                var temp_spec = this.goods_spec_choose || [];
                if (temp_spec.length <= 0) {
                    return false;
                }

                // 是否不能选择
                key = parseInt(key);
                for (var i in temp_spec) {
                    for (var k in temp_spec[i]['value']) {
                        if (i > key) {
                            temp_spec[i]['value'][k]['is_dont'] = 'spec-dont-choose';
                            temp_spec[i]['value'][k]['is_disabled'] = '';
                            temp_spec[i]['value'][k]['is_active'] = '';
                        } else {
                            if(is_init == 1) {
                                temp_spec[i]['value'][k]['is_active'] = '';
                            }
                        }

                        // 当只有一个规格的时候
                        if (key == 0 && temp_spec.length == 1) {
                            temp_spec[i]['value'][k]['is_disabled'] = (temp_spec[i]['value'][k]['is_only_level_one'] || null) != null && parseInt(temp_spec[i]['value'][k]['inventory'] || 0) <= 0 ? 'spec-items-disabled' : '';
                        }
                    }
                }

                this.setData({
                    spec: temp_spec
                });
            },

            // 数量输入事件
            goods_buy_number_blur(e) {
                var number = parseInt(e.detail.value) || 1;
                if(isNaN(number)) {
                    number = this.goods.buy_min_number || 1;
                }
                this.goods_buy_number_func(number);
            },

            // 数量操作事件
            goods_buy_number_event(e) {
                var type = parseInt(e.currentTarget.dataset.type || 0);
                var temp_number = parseInt(this.buy_number);
                var number = (type == 0) ? temp_number - 1 : temp_number + 1;
                this.goods_buy_number_func(number);
            },

            // 数量处理方法
            goods_buy_number_func(number) {
                var buy_min_number = parseInt(this.goods.buy_min_number || 1);
                var buy_max_number = parseInt(this.goods.buy_max_number || 0);
				var spec_buy_min_number = parseInt(this.goods_spec_base_buy_min_number || 0);
				var spec_buy_max_number = parseInt(this.goods_spec_base_buy_max_number || 0);
                var inventory = parseInt(this.goods_spec_base_inventory || 0);
                var inventory_unit = this.goods.inventory_unit;

                // 最小起购数量
				var min = (spec_buy_min_number > 0) ? spec_buy_min_number : buy_min_number;
				if (min > 0 && number < min) {
				    number = min;
				    app.globalData.showToast('起购' + min + inventory_unit);
				}

                // 最大购买数量
				var max = (spec_buy_max_number > 0) ? spec_buy_max_number : buy_max_number;
				if (max > 0 && number > max) {
				    number = max;
				    app.globalData.showToast('限购' + max + inventory_unit);
				}

                // 是否超过库存数量
                if (number > inventory) {
                    number = inventory;
                    app.globalData.showToast('库存数量' + inventory + inventory_unit);
                }

                this.setData({buy_number: number});

                // 存在规格的时候是否已完全选择规格
                var spec = this.goods_selected_spec();
                var sku_count = this.goods_spec_choose.length;
                var active_count = spec.length;
                if (sku_count > 0 && active_count < sku_count) {
                    return false;
                }

                // 获取数据
                var data = this.params;
                data['id'] = this.goods.id;
                data['spec'] = spec;
                data['stock'] = this.buy_number;
                uni.request({
                    url: app.globalData.get_request_url('stock', 'goods'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            this.goods_spec_detail_back_handle(res.data.data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('服务器请求出错');
                    }
                });
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

            // 规格确认事件
            spec_confirm_event(e) {
                var user = app.globalData.get_user_info(this, 'spec_confirm_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=spec_confirm_event"
                        });
                        return false;
                    } else {
                        // 规格
                        var temp_data = this.goods_spec_choose;
                        var sku_count = temp_data.length;
                        var active_count = 0;
                        var spec = [];
                        if (sku_count > 0) {
                            for (var i in temp_data) {
                                for (var k in temp_data[i]['value']) {
                                    if ((temp_data[i]['value'][k]['is_active'] || null) != null) {
                                        active_count++;
                                        spec.push({
                                            type: temp_data[i]['name'],
                                            value: temp_data[i]['value'][k]['name']
                                        });
                                    }
                                }
                            }
                            if (active_count < sku_count) {
                                app.globalData.showToast('请选择规格');
                                return false;
                            }
                        }

                        // 操作类型
                        switch (this.buy_event_type) {
                            case 'buy':
                                // 进入订单确认页面
                                var data = {
                                    buy_type: "goods",
                                    goods_data: encodeURIComponent(base64.encode(JSON.stringify([{
                                        goods_id: this.goods.id,
                                        stock: this.buy_number,
                                        spec: spec
                                    }])))
                                };
                                uni.navigateTo({
                                    url: '/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data)))
                                });
                                this.popup_close_event();
                                break;

                            // 加入购物车
                            case 'cart':
                                this.goods_cart_event(spec);
                                break;
                
                            default:
                                app.globalData.showToast("操作事件类型有误");
                        }
                    }
                }
            },

            // 加入购物车事件
            goods_cart_event(spec) {
                var data = this.params;
                data['goods_id'] = this.goods.id;
                data['spec'] = JSON.stringify(spec);
                data['stock'] = this.buy_number;
                uni.showLoading({
                    title: '处理中...'
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'cart'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            var cart_number = res.data.data.buy_number;

                            // 调用父级
                            this.$emit('CartSuccessEvent', {
                                goods_id: this.goods.id,
                                spec: spec,
                                stock: this.buy_number,
                                cart_number: cart_number,
                                back_data: this.back_data,
                            });

                            // 是否返回定义来源返回
                            if(parseInt(this.params.is_opt_buy_status || 0) == 1 && this.is_opt_back == 1) {
                                setTimeout(function() {
                                    uni.navigateBack();;
                                }, 1000);
                            } else {
                                // 关闭购买弹窗窗口
                                this.popup_close_event();
                            }
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'spec_confirm_event')) {
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
    .goods-spec-choice-container .close {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        z-index: 2;
    }
    .goods-spec-base {
        height: 230rpx;
    }
    .goods-spec-base image {
        width: 200rpx;
        height: 200rpx;
        position: absolute;
        left: 0;
        top: 0;
    }
    .goods-spec-base-content {
        position: absolute;
        left: 220rpx;
        top: 0;
    }
    .goods-spec-choice-content {
        max-height: 50vh;
        overflow-y: scroll;
        overflow-x: hidden;
        margin-top: 20rpx;
    }
    .goods-spec-choice-container .item .spec button {
        background-color: #f5f5f5;
        color: #666;
        border: 1px solid #ccc;
    }
    .goods-spec-choice-container .item .spec button:not(:last-child) {
        margin-right: 25rpx;
    }
    .goods-spec-choice-container .item .spec button image {
        width: 40rpx;
        height: 40rpx !important;
    }
    .goods-spec-choice-container .spec-dont-choose {
        color: #b4b3b3 !important;
        background-color: #ffffff !important;
        border: 1px solid #ebeaea !important;
    }
    .goods-spec-choice-container .spec-dont-choose image {
        opacity: 0.5;
    }
    .goods-spec-choice-container .spec-items-disabled {
        color: #d2cfcf !important;
        background-color: #ffffff !important;
        border: 1px dashed #d5d5d5 !important;
    }
    .goods-spec-choice-container .spec-items-disabled image {
        opacity: 0.3;
    }

    .goods-spec-choice-container .goods-buy-number {
        height: 70rpx;
    }
    .goods-spec-choice-container .number-content {
        position: absolute;
        right: 20rpx;
        top: 0;
        background: #eee;
        border-radius: 2px;
        border: 1px solid #eee;
    }
    .goods-spec-choice-container .number-content .number-submit {
        width: 80rpx;
        font-weight: bold;
    }
    .goods-spec-choice-container .number-content input {
        width: 50px;
        background: #fff;
        border-radius: 0px;
    }
    .goods-spec-choice-container .number-content .number-submit,
    .goods-spec-choice-container .number-content input {
        padding: 0;
        vertical-align: middle;
        height: 60rpx;
        line-height: 60rpx;
    }
</style>