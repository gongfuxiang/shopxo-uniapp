<template>
    <view :class="theme_view" class="z-i-deep">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event" :propIndex="propIndex">
            <view class="goods-spec-choice-container padding-main bg-white pr">
                <view class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <!-- 规格基础信息 -->
                <view class="goods-spec-base oh br-b pr">
                    <image :src="goods_spec_base_images" mode="scaleToFill" class="spec-images radius br" @tap="goods_detail_images_view_event" :data-value="goods_spec_base_images"></image>
                    <view class="goods-spec-base-content">
                        <view class="goods-price">
                            <view v-if="(goods.show_field_price_status || 0) == 1">
                                <text class="sales-price va-m">{{ goods.show_price_symbol }}{{ goods_spec_base_price }}</text>
                                <text class="cr-grey text-size-xs va-m">{{ goods.show_price_unit }}</text>
                            </view>
                            <view v-if="(goods.show_field_original_price_status || 0) == 1 && (goods_spec_base_original_price || null) != null && goods_spec_base_original_price != 0" class="original-price margin-top-sm">{{ goods.show_original_price_symbol }}{{ goods_spec_base_original_price }}{{ goods.show_original_price_unit }}</view>
                        </view>
                        <view v-if="(goods.show_inventory_status || 0) == 1" class="inventory text-size-xs margin-top">
                            <text class="cr-grey">{{ $t('goods-detail.goods-detail.1s79t4') }}</text>
                            <text class="cr-base">{{ goods_spec_base_inventory }}</text>
                            <text class="cr-grey">{{ goods.inventory_unit }}</text>
                        </view>
                    </view>
                </view>
                <block v-if="(goods.is_exist_many_spec || 0) == 1 && goods_spec_choose.length == 0">
                    <view class="padding-top-xxxl padding-bottom-xxxl tc cr-red">{{ $t('goods-buy.goods-buy.ufdm25') }}</view>
                </block>
                <block v-else>
                    <view class="goods-spec-choice-content">
                        <!-- 商品规格 -->
                        <view v-if="goods_spec_choose.length > 0" class="goods-spec-choose">
                            <view v-for="(item, key) in goods_spec_choose" :key="key" class="item padding-top-xxl padding-bottom-xxl">
                                <view class="text-size-sm">{{ item.name }}</view>
                                <view v-if="item.value.length > 0" class="spec margin-top-sm">
                                    <block v-for="(items, keys) in item.value" :key="keys">
                                        <button @tap.stop="goods_spec_choice_event" :data-key="key" :data-keys="keys" type="default" size="mini" hover-class="none" :class="'spec-btn round ' + items.is_active + ' ' + items.is_dont + ' ' + items.is_disabled">
                                            <image v-if="(items.images || null) != null" :src="items.images" mode="scaleToFill" class="spec-images va-m dis-inline-block round margin-right-sm"></image>
                                            <text class="va-m">{{ items.name }}</text>
                                        </button>
                                    </block>
                                </view>
                            </view>
                        </view>

                        <!-- 购买数量 -->
                        <view class="goods-buy-number oh pr margin-top-xl margin-bottom-xxl">
                            <view class="fl margin-top">{{ $t('goods-buy.goods-buy.737wzz') }}</view>
                            <view class="number-content tc oh round">
                                <view @tap="goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="0">-</view>
                                <input @blur="goods_buy_number_blur" class="number-input tc cr-grey bg-white fl va-m radius-0" type="number" :value="buy_number" />
                                <view @tap="goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="1">+</view>
                            </view>
                        </view>
                    </view>
                    <view v-if="(opt_button || null) != null && opt_button.length > 0" class="padding-bottom-main">
                        <view :class="'oh buy-nav-btn-number-' + (opt_button.length || 0)">
                            <block v-for="(item, index) in opt_button" :key="index">
                                <view v-if="(item.name || null) != null && (item.type || null) != null" class="item fl bs-bb padding-horizontal-main">
                                    <button :class="'cr-white round text-size-sm bg-' + ((item.color || 'main') == 'main' ? 'main' : 'main-pair')" type="default" @tap="spec_confirm_event" :data-value="item.value" :data-type="item.type" :data-business="item.business || ''" hover-class="none">{{ item.name }}</button>
                                </view>
                            </block>
                        </view>
                    </view>
                    <button v-else class="bg-main br-main cr-white text-size-sm round" type="default" @tap.stop="spec_confirm_event" hover-class="none">{{ $t('index.index.7w75zb') }}</button>
                </block>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentPopup from '@/components/popup/popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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
                opt_button: [],
                is_direct_cart: 0,
                is_success_tips: 1,
                // 选中规格临时定时变量
                spec_selected_timer: null,
                spec_selected_timerout: null,
                // 智能工具插件
                plugins_intellectstools_config: app.globalData.get_config('plugins_base.intellectstools.data'),
            };
        },

        components: {
            componentPopup,
        },
        props: {
            propParams: {
                type: [String, Object],
                default: () => {
                    return {};
                },
            },
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol(),
            },
            // 弹窗层级
            propIndex: {
                type: Number,
                default: 100,
            },
        },

        created: function () {},

        methods: {
            // 初始化
            init(goods = {}, params = {}, back_data = null) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                params = params || {};

                // 状态默认开启弹窗
                var status = true;
                // 商品可选规格
                var goods_spec_choose = (goods.specifications || null) != null ? goods.specifications.choose || [] : [];
                // 无规格是否直接操作
                var is_direct_cart = 0;
                if ((params.is_direct_cart || 0) == 1 && parseInt(goods.is_exist_many_spec || 0) == 0 && goods_spec_choose.length == 0) {
                    status = false;
                    is_direct_cart = 1;
                }
                // 是否成功提示、默认提示
                var is_success_tips = params.is_success_tips == undefined ? 1 : params.is_success_tips || 0;
                // 直接加购、并且用户已经存在购物车则依次+1
                if (is_direct_cart == 1 && parseInt(goods.user_cart_count || 0) > 0) {
                    var buy_number = 1;
                } else {
                    var buy_number = goods.buy_min_number || 1;
                }

                // 购买按钮处理，仅展示购买和购物车
                var opt_button = [];
                var buy_button = params.buy_button || null;
                if (buy_button != null && (buy_button.data || null) != null && buy_button.data.length > 0) {
                    var arr = ['buy', 'cart', 'show'];
                    for (var i in buy_button.data) {
                        if (arr.indexOf(buy_button.data[i]['type']) != -1) {
                            opt_button.push(buy_button.data[i]);
                        }
                    }
                }

                // 设置数据
                this.setData({
                    popup_status: status,
                    params: params || {},
                    back_data: back_data,
                    goods: goods || {},
                    goods_spec_choose: goods_spec_choose,
                    goods_spec_base_price: goods.price,
                    goods_spec_base_original_price: goods.original_price || 0,
                    goods_spec_base_inventory: goods.inventory,
                    goods_spec_base_images: goods.images,
                    buy_number: buy_number,
                    buy_event_type: params.buy_event_type || 'cart',
                    opt_button: opt_button,
                    is_direct_cart: is_direct_cart,
                    is_success_tips: is_success_tips,
                });

                // 初始化不能选择规格处理
                this.spec_handle_dont(0, 1);

                // 获取规格详情
                this.get_spec_detail();

                // 规格选中处理
                this.selected_spec_handle();

                // 是否直接操作加入购物车
                if (is_direct_cart) {
                    this.spec_confirm_event();
                }
            },

            // 规格选中处理
            selected_spec_handle() {
                var temp_spec_choose = this.goods_spec_choose;
                if (temp_spec_choose.length > 0) {
                    // 是否已选择
                    var active_count = 0;
                    for (var i in temp_spec_choose) {
                        for (var k in temp_spec_choose[i]['value']) {
                            if ((temp_spec_choose[i]['value'][k]['is_active'] || null) != null) {
                                active_count++;
                            }
                        }
                    }
                    if (active_count > 0) {
                        return false;
                    }

                    // 是否指定规格初始化
                    var spec = (this.propParams || null) != null && (this.propParams.spec || null) != null ? this.propParams.spec : null;
                    if (spec != null) {
                        this.appoint_selected_spec_handle(temp_spec_choose, spec);
                    } else {
                        // 是否默认选中第一个规格、、已存在指定规格初始化则不走默认选择第一个规格
                        this.plugins_intellectstools_selected_spec_handle(temp_spec_choose);
                    }
                }
            },

            // 指定规格初始化
            appoint_selected_spec_handle(spec_choose, spec) {
                spec = decodeURIComponent(spec).split('|');
                if (spec.length == spec_choose.length) {
                    // 选择处理
                    var self = this;
                    // 销毁之前的任务
                    clearInterval(self.spec_selected_timer);
                    clearInterval(self.spec_selected_timerout);
                    // 必须存在购买和加入购物车任意一个、规格必须多个
                    var sku_count = app.globalData.get_length(spec_choose);
                    // 先清除价格展示信息
                    self.setData({
                        goods_spec_base_price: '...',
                        goods_spec_base_original_price: '...',
                    });
                    var num = 0;
                    var timer = setInterval(function () {
                        for (var i in spec_choose) {
                            // 清除价格展示信息、避免获取价格类型赋值
                            self.setData({
                                goods_spec_base_price: '...',
                                goods_spec_base_original_price: '...',
                            });
                            // 必须不存在已选择项
                            var active =
                                spec_choose[i]['value']
                                    .map(function (v) {
                                        return v.is_active;
                                    })
                                    .join('') || null;
                            if (active == null) {
                                // 不能选择规格处理
                                self.spec_handle_dont(i);

                                // 规格选择处理
                                var temp_spec = spec[i];
                                var status = false;
                                for (var k in spec_choose[i]['value']) {
                                    // 必须是可选和未选
                                    if (!status && (spec_choose[i]['value'][k]['is_disabled'] || null) == null && (spec_choose[i]['value'][k]['is_dont'] || null) == null && temp_spec == spec_choose[i]['value'][k]['name']) {
                                        self.goods_spec_choice_handle(i, k);
                                        status = true;
                                        num++;
                                    }
                                }
                            }
                        }
                        if (num >= sku_count) {
                            clearInterval(self.spec_selected_timer);
                        }
                    }, 100);
                    var timerout = setTimeout(function () {
                        clearInterval(self.spec_selected_timerout);
                    }, 20000);
                    self.setData({
                        spec_selected_timer: timer,
                        spec_selected_timerout: timerout,
                    });
                }
            },

            // 默认选中第一个规格 - 智能工具箱插件
            plugins_intellectstools_selected_spec_handle(spec_choose) {
                // 选择处理
                var self = this;
                // 销毁之前的任务
                clearInterval(self.spec_selected_timer);
                clearInterval(self.spec_selected_timerout);
                // 读取智能工具插件配置、是否开启
                var config = self.plugins_intellectstools_config || null;
                if (config != null && (config.is_goods_detail_selected_first_spec || 0) == 1) {
                    // 必须存在购买和加入购物车任意一个、规格必须多个
                    var sku_count = app.globalData.get_length(spec_choose);
                    // 先清除价格展示信息
                    self.setData({
                        goods_spec_base_price: '...',
                        goods_spec_base_original_price: '...',
                    });
                    var num = 0;
                    var timer = setInterval(function () {
                        for (var i in spec_choose) {
                            // 清除价格展示信息、避免获取价格类型赋值
                            self.setData({
                                goods_spec_base_price: '...',
                                goods_spec_base_original_price: '...',
                            });
                            // 必须不存在已选择项
                            var active =
                                spec_choose[i]['value']
                                    .map(function (v) {
                                        return v.is_active;
                                    })
                                    .join('') || null;
                            if (active == null) {
                                // 不能选择规格处理
                                self.spec_handle_dont(i);

                                // 规格选择处理
                                var status = false;
                                for (var k in spec_choose[i]['value']) {
                                    // 必须是可选和未选
                                    if (!status && (spec_choose[i]['value'][k]['is_disabled'] || null) == null && (spec_choose[i]['value'][k]['is_dont'] || null) == null) {
                                        self.goods_spec_choice_handle(i, k);
                                        status = true;
                                        num++;
                                    }
                                }
                            }
                        }
                        if (num >= sku_count) {
                            clearInterval(self.spec_selected_timer);
                        }
                    }, 100);
                    var timerout = setTimeout(function () {
                        clearInterval(self.spec_selected_timerout);
                    }, 20000);
                    self.setData({
                        spec_selected_timer: timer,
                        spec_selected_timerout: timerout,
                    });
                }
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false,
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
                var temp_images = this.goods_spec_base_images;
                // 不能选择和禁止选择跳过
                if ((temp_spec[key]['value'][keys]['is_dont'] || null) == null && (temp_spec[key]['value'][keys]['is_disabled'] || null) == null) {
                    // 规格选择
                    for (var i in temp_spec) {
                        for (var k in temp_spec[i]['value']) {
                            if ((temp_spec[i]['value'][k]['is_dont'] || null) == null && (temp_spec[i]['value'][k]['is_disabled'] || null) == null) {
                                if (key == i) {
                                    if (keys == k && (temp_spec[i]['value'][k]['is_active'] || null) == null) {
                                        temp_spec[i]['value'][k]['is_active'] = 'cr-white bg-main br-main';
                                        if ((temp_spec[i]['value'][k]['images'] || null) != null) {
                                            temp_images = temp_spec[i]['value'][k]['images'];
                                        }
                                    } else {
                                        temp_spec[i]['value'][k]['is_active'] = '';
                                    }
                                }
                            }
                        }
                    }
                    this.setData({
                        goods_spec_choose: temp_spec,
                        goods_spec_base_images: temp_images,
                    });

                    // 不能选择规格处理
                    this.spec_handle_dont(key);

                    // 获取下一个规格类型
                    this.get_spec_type(key);

                    // 获取规格详情
                    this.get_spec_detail();

                    // 规格选择回调
                    this.$emit('SpecChoiceEvent', {
                        goods_id: this.goods.id,
                        spec: this.choice_spec_data(),
                        goods_spec_choose: this.goods_spec_choose,
                    });
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
                var spec = this.choice_spec_data();
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
                                    goods_spec_choose: temp_spec,
                                });
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 选择规格数据
            choice_spec_data() {
                var spec = [];
                var temp_spec = this.goods_spec_choose;
                for (var i in temp_spec) {
                    for (var k in temp_spec[i]['value']) {
                        if ((temp_spec[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                type: temp_spec[i]['name'],
                                value: temp_spec[i]['value'][k]['name'],
                            });
                            break;
                        }
                    }
                }
                return spec;
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
                    if (buy_number < buy_min_number) {
                        buy_number = buy_min_number;
                    }
                    if (buy_max_number > 0 && buy_number > buy_max_number) {
                        buy_number = buy_max_number;
                    }
                    this.setData({
                        goods_spec_base_price: this.goods.price,
                        goods_spec_base_original_price: this.goods.original_price || 0,
                        goods_spec_base_inventory: this.goods.inventory,
                        goods_spec_base_buy_min_number: 0,
                        goods_spec_base_buy_max_number: 0,
                        buy_number: buy_number,
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
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.goods_spec_detail_back_handle(res.data.data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 商品规格详情返回数据处理
            goods_spec_detail_back_handle(data) {
                var spec_base = data.spec_base;
                var buy_number = parseInt(this.buy_number);
                var spec_buy_min_number = parseInt(spec_base.buy_min_number || 1);
                var spec_buy_max_number = parseInt(spec_base.buy_max_number || 0);
                if (spec_buy_min_number > 0 && buy_number < spec_buy_min_number) {
                    buy_number = spec_buy_min_number;
                }
                if (spec_buy_max_number > 0 && buy_number > spec_buy_max_number) {
                    buy_number = spec_buy_max_number;
                }
                this.setData({
                    goods_spec_base_price: spec_base.price,
                    goods_spec_base_original_price: spec_base.original_price || 0,
                    goods_spec_base_inventory: parseInt(spec_base.inventory || 0),
                    goods_spec_base_buy_min_number: spec_buy_min_number,
                    goods_spec_base_buy_max_number: spec_buy_max_number,
                    buy_number: buy_number,
                });

                // 调用父级
                this.$emit("BackSuccessEvent", {
                    buy_number: this.buy_number,
                    base_price: this.goods_spec_base_price,
                    base_original_price: this.goods_spec_base_original_price,
                    base_inventory: this.goods_spec_base_inventory,
                    base_buy_min_number: this.goods_spec_base_buy_min_number,
                    base_buy_max_number: this.goods_spec_base_buy_max_number,
                    back_data: data
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
                                value: temp_spec[i]['value'][k]['name'],
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
                            if (is_init == 1) {
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
                    goods_spec_choose: temp_spec,
                });
            },

            // 数量输入事件
            goods_buy_number_blur(e) {
                var number = parseInt(e.detail.value) || 1;
                if (isNaN(number)) {
                    number = this.goods.buy_min_number || 1;
                }
                this.goods_buy_number_func(number);
            },

            // 数量操作事件
            goods_buy_number_event(e) {
                var type = parseInt(e.currentTarget.dataset.type || 0);
                var temp_number = parseInt(this.buy_number);
                var number = type == 0 ? temp_number - 1 : temp_number + 1;
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
                var min = spec_buy_min_number > 0 ? spec_buy_min_number : buy_min_number;
                if (min > 0 && number < min) {
                    number = min;
                    app.globalData.showToast(this.$t('recommend-detail.recommend-detail.265vyu') + min + inventory_unit);
                }

                // 最大购买数量
                var max = spec_buy_max_number > 0 ? spec_buy_max_number : buy_max_number;
                if (max > 0 && number > max) {
                    number = max;
                    app.globalData.showToast(this.$t('goods-category.goods-category.z1eh3v') + max + inventory_unit);
                }

                // 是否超过库存数量
                if (number > inventory) {
                    number = inventory;
                    app.globalData.showToast(this.$t('recommend-detail.recommend-detail.2sis3v') + inventory + inventory_unit);
                }

                this.setData({ buy_number: number });

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
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.goods_spec_detail_back_handle(res.data.data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 详情图片查看
            goods_detail_images_view_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value],
                    });
                }
            },

            // 规格确认事件
            spec_confirm_event(e = null) {
                var user = app.globalData.get_user_info(this, 'spec_confirm_event');
                if (user != false) {
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
                                        value: temp_data[i]['value'][k]['name'],
                                    });
                                }
                            }
                        }
                        if (active_count < sku_count) {
                            app.globalData.showToast(this.$t('goods-detail.goods-detail.6brk57'));
                            return false;
                        }
                    }

                    // 操作类型
                    var type = (e == null) ? this.buy_event_type : (e.currentTarget.dataset.type || this.buy_event_type);
                    var value = (e == null) ? null : (e.currentTarget.dataset.value || null);
                    var business = (e == null) ? null : (e.currentTarget.dataset.business || null);
                    switch (type) {
                        // 展示型、商品页面规格选择展示型 拨打电话操作
                        case 'show':
                        case 'spec-show':
                            app.globalData.call_tel(value || app.globalData.get_config('config.common_app_customer_service_tel'));
                            break;

                        // 购买
                        case 'buy':
                            // 进入订单确认页面
                            var data = {
                                buy_type: 'goods',
                                goods_data: encodeURIComponent(
                                    base64.encode(
                                        JSON.stringify([
                                            {
                                                goods_id: this.goods.id,
                                                stock: this.buy_number,
                                                spec: spec,
                                            },
                                        ])
                                    )
                                )
                            };
                            // 转换数据
                            var data_params = encodeURIComponent(base64.encode(JSON.stringify(data)));

                            // 是否互联网医院插件-开处方
                            if(business == 'plugins-hospital') {
                                app.globalData.url_open('/pages/plugins/hospital/prescription/prescription?data=' + data_params);
                            } else {
                                // 默认进去订单确认页面
                                app.globalData.url_open('/pages/buy/buy?data=' + data_params);
                            }
                            // 关闭弹窗
                            this.popup_close_event();
                            break;

                        // 加入购物车
                        case 'cart':
                            this.goods_cart_event(spec);
                            break;

                        default:
                            app.globalData.showToast(this.$t('goods-buy.goods-buy.4maexq') + type + ')');
                    }
                }
            },

            // 加入购物车事件
            goods_cart_event(spec) {
                var data = this.params;
                data['goods_id'] = this.goods.id;
                data['spec'] = JSON.stringify(spec);
                data['stock'] = this.buy_number;
                uni.request({
                    url: app.globalData.get_request_url('save', 'cart'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            // 是否成功提示
                            if (this.is_success_tips == 1) {
                                app.globalData.showToast(res.data.msg, 'success');
                            }
                            var cart_number = res.data.data.buy_number;

                            // 调用父级
                            this.$emit('CartSuccessEvent', {
                                goods_id: this.goods.id,
                                spec: spec,
                                stock: this.buy_number,
                                cart_number: cart_number,
                                back_data: this.back_data,
                                goods_spec_choose: this.goods_spec_choose,
                            });

                            // 是否返回定义来源返回
                            if (parseInt(this.params.is_opt_buy_status || 0) == 1 && this.is_opt_back == 1) {
                                setTimeout(function () {
                                    uni.navigateBack();
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
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
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
    .goods-spec-base .spec-images {
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
    .goods-spec-choice-container .item .spec .spec-btn {
        background-color: #f5f5f5;
        color: #666;
        border: 1px solid #ccc;
    }
    .goods-spec-choice-container .item .spec .spec-btn:not(:last-child) {
        margin-right: 25rpx;
    }
    .goods-spec-choice-container .item .spec .spec-btn .spec-images {
        width: 40rpx;
        height: 40rpx !important;
    }
    .goods-spec-choice-container .spec-dont-choose {
        color: #b4b3b3 !important;
        background-color: #ffffff !important;
        border: 1px solid #ebeaea !important;
    }
    .goods-spec-choice-container .spec-dont-choose .spec-images {
        opacity: 0.5;
    }
    .goods-spec-choice-container .spec-items-disabled {
        color: #d2cfcf !important;
        background-color: #ffffff !important;
        border: 1px dashed #d5d5d5 !important;
    }
    .goods-spec-choice-container .spec-items-disabled .spec-images {
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
        border: 1px solid #eee;
    }
    .goods-spec-choice-container .number-content .number-submit {
        width: 80rpx;
        font-weight: bold;
    }
    .goods-spec-choice-container .number-content .number-input {
        width: 50px;
    }
    .goods-spec-choice-container .number-content .number-submit,
    .goods-spec-choice-container .number-content .number-input {
        padding: 0;
        height: 60rpx;
        line-height: 60rpx;
    }
    .goods-spec-choice-container .buy-nav-btn-number-0 .item,
    .goods-spec-choice-container .buy-nav-btn-number-1 .item {
        width: 100% !important;
    }
    .goods-spec-choice-container .buy-nav-btn-number-2 .item {
        width: 50% !important;
    }
    .goods-spec-choice-container .buy-nav-btn-number-3 .item {
        width: 33.33% !important;
    }
    .goods-spec-choice-container .buy-nav-btn-number-4 .item {
        width: 25% !important;
    }
</style>
