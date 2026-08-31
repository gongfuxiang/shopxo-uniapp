<template>
    <view :class="theme_view" class="z-i-deep">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event" :propIndex="propIndex">
            <view class="goods-spec-choice-container padding-main bg-white pr">
                <view class="close oh pa top-0 right-0 z-i-deep">
                    <view class="fr padding-top padding-right padding-left-sm padding-bottom-sm" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <!-- 规格基础信息 -->
                <view class="goods-spec-base oh br-b pr" :class="goods_cover_class">
                    <image :src="goods_spec_base_images" mode="aspectFill" class="spec-images radius br" @tap="goods_detail_images_view_event" :data-value="goods_spec_base_images"></image>
                    <view class="goods-spec-base-content">
                        <view class="goods-price">
                            <view v-if="(goods.show_field_price_status || 0) == 1">
                                <text class="sales-price va-m">{{ goods.show_price_symbol }}{{ goods_spec_base_price }}</text>
                                <text class="cr-grey text-size-xs va-m">{{ goods_show_price_unit }}</text>
                            </view>
                            <view v-if="(goods.show_field_original_price_status || 0) == 1 && (goods_spec_base_original_price || null) != null && goods_spec_base_original_price != 0" class="original-price margin-top-sm">{{ goods.show_original_price_symbol }}{{ goods_spec_base_original_price }}{{ goods_show_original_price_unit }}</view>
                        </view>
                        <view v-if="(goods.show_inventory_status || 0) == 1" class="inventory text-size-xs margin-top">
                            <text class="cr-grey">{{ $t('common.stock') }}</text>
                            <text class="cr-base">{{ goods_spec_base_inventory }}</text>
                            <text class="cr-grey">{{ goods_spec_base_inventory_unit }}</text>
                        </view>
                    </view>
                </view>
                <block v-if="(goods.is_exist_many_spec || 0) == 1 && goods_spec_choose.length == 0">
                    <view class="padding-top-xxxl padding-bottom-xxxl tc cr-red">{{ $t('goods-buy.incorrect_specification_data') }}</view>
                </block>
                <block v-else>
                    <scroll-view :scroll-y="true" class="goods-spec-choice-content">
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
                            <view class="fl margin-top">{{ $t('goods-buy.purchase_quantity') }}</view>
                            <view class="number-content tc oh round">
                                <view @tap="goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="0">-</view>
                                <input @blur="goods_buy_number_blur" class="number-input tc cr-grey bg-white fl va-m radius-0" type="number" :value="buy_number" />
                                <view @tap="goods_buy_number_event" class="number-submit tc cr-grey fl va-m" data-type="1">+</view>
                            </view>
                        </view>
                    </scroll-view>
                    <view v-if="(opt_button || null) != null && opt_button.length > 0" class="padding-bottom-main">
                        <view :class="'flex-row jc-sa gap-20 buy-nav-btn-number-' + (opt_button.length || 0)">
                            <block v-for="(item, index) in opt_button" :key="index">
                                <view v-if="(item.name || null) != null && (item.type || null) != null" class="item">
                                    <button :class="'cr-white round text-size-sm bg-' + ((item.color || 'main') == 'main' ? 'main' : 'main-pair')" type="default" @tap="spec_confirm_event" :disabled="spec_confirm_btn_disabled_status" :data-value="item.value" :data-type="item.type" :data-business="item.business || ''" :data-buylink="item.buylink || ''" hover-class="none">{{ item.name }}</button>
                                </view>
                            </block>
                        </view>
                    </view>
                    <button v-else class="bg-main br-main cr-white text-size-sm round" type="default" @tap.stop="spec_confirm_event" :disabled="spec_confirm_btn_disabled_status" hover-class="none">{{ $t('common.ok_text') }}</button>
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
                // init 传入的 data_params，合并到下单页 data
                buy_data_params: {},
                back_data: {},
                popup_status: false,
                goods_spec_base_price: 0,
                goods_spec_base_original_price: 0,
                goods_spec_base_inventory: 0,
                goods_spec_base_buy_min_number: 0,
                goods_spec_base_buy_max_number: 0,
                goods_spec_base_images: '',
                goods_spec_base_inventory_unit: '',
                goods_show_price_unit: '',
                goods_show_original_price_unit: '',
                goods: {},
                goods_spec_choose: [],
                buy_number: 1,
                buy_event_type: 'cart',
                opt_button: [],
                is_direct_cart: 0,
                is_success_tips: 1,
                goods_cover_class: '',
                is_exist_many_spec: false,
                spec_confirm_btn_disabled_status: true,
                // 弹窗打开时的默认价格库存（未选完规格时恢复展示）
                default_spec_display: null,
                // 选中规格临时定时变量
                spec_selected_timer: null,
                spec_selected_timerout: null,
                spec_auto_select_match_callback: null,
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
            // 插件名称（拼团等规格接口走插件）
            propPluginsName: {
                type: String,
                default: '',
            },
        },

        created: function () {},

        methods: {
            // 合并下单页扩展参数（init 传入 data_params）
            buy_data_extend_merge(data) {
                var extend = this.buy_data_params || {};
                var reserve_keys = { buy_type: 1, goods_data: 1 };
                for (var key in extend) {
                    if (reserve_keys[key] == 1) {
                        continue;
                    }
                    if (extend[key] !== undefined && extend[key] !== null) {
                        data[key] = extend[key];
                    }
                }
                return data;
            },

            // 规格/库存接口请求参数（插件活动页 init 覆盖 goods.id 为活动 id）
            get_spec_request_data(extend) {
                extend = extend || {};
                var data = {
                    id: parseInt((this.goods || {}).id || 0),
                    is_lang: 0,
                };
                for (var key in extend) {
                    if (extend[key] !== undefined && extend[key] !== null) {
                        data[key] = extend[key];
                    }
                }
                return data;
            },

            // 规格接口地址
            get_goods_spec_request_url(action) {
                var plugins = this.params.plugins_name || this.propPluginsName || '';
                if(plugins != '')
                {
                    return app.globalData.get_request_url(action, 'goods', plugins);
                }
                return app.globalData.get_request_url(action, 'goods');
            },

            // 初始化规格数据（深拷贝并清除上次选择状态，避免关闭弹窗后残留选中效果）
            goods_spec_choose_init(goods) {
                var choose = (goods.specifications || null) != null ? goods.specifications.choose || [] : [];
                if(choose.length <= 0) {
                    return [];
                }
                var temp_spec = JSON.parse(JSON.stringify(choose));
                for(var i in temp_spec) {
                    if((temp_spec[i]['value'] || null) == null) {
                        continue;
                    }
                    for(var k in temp_spec[i]['value']) {
                        temp_spec[i]['value'][k]['is_active'] = '';
                        temp_spec[i]['value'][k]['is_dont'] = '';
                        temp_spec[i]['value'][k]['is_disabled'] = '';
                    }
                }
                return temp_spec;
            },

            // 初始化
            init(goods = {}, params = {}, back_data = null) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                params = params || {};
                var buy_data_params = params.data_params || {};
                var init_params = Object.assign({}, params);
                delete init_params.data_params;

                // 状态默认开启弹窗
                var status = true;
                // 商品可选规格
                var goods_spec_choose = this.goods_spec_choose_init(goods);
                // 是否存在多规格
                var is_exist_many_spec = parseInt(goods.is_exist_many_spec || 0) == 1 && goods_spec_choose.length > 0;
                // 无规格是否直接操作
                var is_direct_cart = 0;
                if ((init_params.is_direct_cart || 0) == 1 && !is_exist_many_spec) {
                    status = false;
                    is_direct_cart = 1;
                }
                // 是否成功提示、默认提示
                var is_success_tips = init_params.is_success_tips == undefined ? 1 : init_params.is_success_tips || 0;
                // 直接加购、并且用户已经存在购物车则依次+1
                if (is_direct_cart == 1 && parseInt(goods.user_cart_count || 0) > 0) {
                    var buy_number = 1;
                } else {
                    var buy_number = goods.buy_min_number || 1;
                }

                // 购买按钮处理，仅展示购买和购物车
                var opt_button = [];
                var buy_button = init_params.buy_button || null;
                if (buy_button != null && (buy_button.data || null) != null && buy_button.data.length > 0) {
                    var arr = ['buy', 'cart', 'show', 'back'];
                    for (var i in buy_button.data) {
                        if (arr.indexOf(buy_button.data[i]['type']) != -1) {
                            opt_button.push(buy_button.data[i]);
                        }
                    }
                }
                
                // 商品封面尺寸类型
                var goods_cover_size_type = app.globalData.get_config('config.common_goods_cover_size_type', 0);

                // 默认价格库存快照（未选完多层规格时恢复）
                var default_spec_display = {
                    price: goods.price,
                    original_price: goods.original_price || 0,
                    inventory: goods.inventory,
                    inventory_unit: goods.inventory_unit,
                    show_price_unit: goods.show_price_unit,
                    show_original_price_unit: goods.show_original_price_unit,
                };

                // 设置数据
                this.setData({
                    popup_status: status,
                    params: init_params || {},
                    buy_data_params: buy_data_params,
                    back_data: back_data,
                    goods: goods || {},
                    default_spec_display: default_spec_display,
                    goods_spec_choose: goods_spec_choose,
                    goods_spec_base_price: goods.price,
                    goods_spec_base_original_price: goods.original_price || 0,
                    goods_spec_base_inventory: goods.inventory,
                    goods_spec_base_inventory_unit: goods.inventory_unit,
                    goods_show_price_unit: goods.show_price_unit,
                    goods_show_original_price_unit: goods.show_original_price_unit,
                    buy_number: buy_number,
                    buy_event_type: init_params.buy_event_type || 'cart',
                    opt_button: opt_button,
                    is_direct_cart: is_direct_cart,
                    is_success_tips: is_success_tips,
                    goods_cover_class: (goods_cover_size_type == 1) ? 'cover-tall' : '',
                    is_exist_many_spec: is_exist_many_spec,
                    spec_confirm_btn_disabled_status: is_exist_many_spec,
                    goods_spec_base_images: goods.images,
                });

                // 初始化不能选择规格处理
                var is_init = (init_params.is_init === undefined || parseInt(init_params.is_init) == 1);
                this.spec_handle_dont(is_init ? 0 : null);

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

            // 清除自动选规格定时器
            clear_spec_selected_timer() {
                clearInterval(this.spec_selected_timer);
                clearTimeout(this.spec_selected_timerout);
                this.setData({
                    spec_selected_timer: null,
                    spec_selected_timerout: null,
                    spec_auto_select_match_callback: null,
                });
            },

            // 未选完规格时恢复默认价格库存
            restore_default_spec_display() {
                var display = this.default_spec_display || null;
                var goods = this.goods || {};
                if (display == null) {
                    display = {
                        price: goods.price,
                        original_price: goods.original_price || 0,
                        inventory: goods.inventory,
                        inventory_unit: goods.inventory_unit,
                        show_price_unit: goods.show_price_unit,
                        show_original_price_unit: goods.show_original_price_unit,
                    };
                }
                var buy_number = parseInt(this.buy_number);
                var buy_min_number = parseInt(goods.buy_min_number || 1);
                var buy_max_number = parseInt(goods.buy_max_number || 0);
                if (buy_number < buy_min_number) {
                    buy_number = buy_min_number;
                }
                if (buy_max_number > 0 && buy_number > buy_max_number) {
                    buy_number = buy_max_number;
                }
                this.setData({
                    goods_spec_base_price: display.price,
                    goods_spec_base_original_price: display.original_price,
                    goods_spec_base_inventory: display.inventory,
                    goods_spec_base_inventory_unit: display.inventory_unit,
                    goods_show_price_unit: display.show_price_unit,
                    goods_show_original_price_unit: display.show_original_price_unit,
                    goods_spec_base_buy_min_number: 0,
                    goods_spec_base_buy_max_number: 0,
                    buy_number: buy_number,
                    spec_confirm_btn_disabled_status: this.is_exist_many_spec,
                });
                this.$emit('BackReleaseEvent');
            },

            // 已选规格层数
            goods_spec_selected_count() {
                var count = 0;
                var temp_spec = this.goods_spec_choose || [];
                for (var i in temp_spec) {
                    for (var k in temp_spec[i]['value']) {
                        if ((temp_spec[i]['value'][k]['is_active'] || '') != '') {
                            count++;
                            break;
                        }
                    }
                }
                return count;
            },

            // 自动选中下一层规格（无法继续时停止并恢复默认展示）
            auto_select_spec_interval_handle(spec_choose, sku_count, match_name_callback) {
                var self = this;
                self.clear_spec_selected_timer();
                self.spec_auto_select_match_callback = match_name_callback;
                var timer = setInterval(function () {
                    self.spec_auto_select_try_next();
                }, 150);
                var timerout = setTimeout(function () {
                    self.clear_spec_selected_timer();
                    self.restore_default_spec_display();
                }, 20000);
                self.setData({
                    spec_selected_timer: timer,
                    spec_selected_timerout: timerout,
                });
                self.spec_auto_select_try_next();
            },

            // 尝试自动选中下一层规格
            spec_auto_select_try_next() {
                if((this.spec_selected_timer || null) == null) {
                    return false;
                }
                var match_name_callback = this.spec_auto_select_match_callback;
                if(typeof match_name_callback !== 'function') {
                    return false;
                }
                var temp_spec = this.goods_spec_choose || [];
                var sku_count = app.globalData.get_length(temp_spec);
                if(sku_count <= 0) {
                    this.clear_spec_selected_timer();
                    return false;
                }
                if(this.goods_spec_selected_count() >= sku_count) {
                    this.clear_spec_selected_timer();
                    return true;
                }
                for (var i in temp_spec) {
                    var active =
                        temp_spec[i]['value']
                            .map(function (v) {
                                return v.is_active;
                            })
                            .join('') || null;
                    if (active == null) {
                        this.spec_handle_dont(i);
                        var status = false;
                        for (var k in temp_spec[i]['value']) {
                            if (!status && (temp_spec[i]['value'][k]['is_disabled'] || null) == null && (temp_spec[i]['value'][k]['is_dont'] || null) == null && match_name_callback(temp_spec, i, k)) {
                                this.goods_spec_choice_handle(i, k);
                                status = true;
                            }
                        }
                        // 下一层规格可能还在异步加载，继续等待
                        if (!status) {
                            return false;
                        }
                        break;
                    }
                }
                if(this.goods_spec_selected_count() >= sku_count) {
                    this.clear_spec_selected_timer();
                }
                return true;
            },

            // 指定规格初始化
            appoint_selected_spec_handle(spec_choose, spec) {
                spec = decodeURIComponent(spec).split('|');
                if (spec.length == spec_choose.length) {
                    var sku_count = app.globalData.get_length(spec_choose);
                    this.auto_select_spec_interval_handle(spec_choose, sku_count, function (spec_choose, i, k) {
                        return spec[i] == spec_choose[i]['value'][k]['name'];
                    });
                }
            },

            // 默认选中第一个规格 - 智能工具箱插件
            plugins_intellectstools_selected_spec_handle(spec_choose) {
                var config = this.plugins_intellectstools_config || null;
                if (config != null && (config.is_goods_detail_selected_first_spec || 0) == 1) {
                    var sku_count = app.globalData.get_length(spec_choose);
                    this.auto_select_spec_interval_handle(spec_choose, sku_count, function () {
                        return true;
                    });
                }
            },

            // 弹层关闭
            popup_close_event(e) {
                this.clear_spec_selected_timer();
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
                        goods_id: this.goods.goods_id || this.goods.id,
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
                var data = this.get_spec_request_data({
                    spec: JSON.stringify(spec),
                });
                uni.request({
                    url: this.get_goods_spec_request_url('spectype'),
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
                                if((this.spec_selected_timer || null) != null) {
                                    this.spec_auto_select_try_next();
                                }
                                // 下一层无可选规格时，保持弹窗顶部默认价格库存
                                var selected_spec = this.goods_selected_spec();
                                if (selected_spec.length > 0 && selected_spec.length < sku_count && spec_type.length <= 0) {
                                    this.restore_default_spec_display();
                                }
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
                    this.restore_default_spec_display();
                    return false;
                }

                // 获取数据
                var data = this.get_spec_request_data({
                    spec: JSON.stringify(spec),
                    stock: this.buy_number,
                });
                uni.request({
                    url: this.get_goods_spec_request_url('specdetail'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.goods_spec_detail_back_handle(res.data.data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                            this.restore_default_spec_display();
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                        this.restore_default_spec_display();
                    },
                });
            },

            // 商品规格详情返回数据处理
            goods_spec_detail_back_handle(data) {
                var spec_base = data.spec_base;
                var buy_number = parseInt(this.buy_number);
                var spec_buy_min_number = parseInt(spec_base.buy_min_number || 1);
                var spec_buy_max_number = parseInt(spec_base.buy_max_number || 0);
                var spec_inventory = parseInt(spec_base.inventory || 0);
                if (spec_buy_min_number > 0 && buy_number < spec_buy_min_number) {
                    buy_number = spec_buy_min_number;
                }
                if (spec_buy_max_number > 0 && buy_number > spec_buy_max_number) {
                    buy_number = spec_buy_max_number;
                }
                if(buy_number > spec_inventory) {
                    buy_number = spec_inventory;
                }
                var btn_disabled_status = this.is_exist_many_spec ? (buy_number <= 0 || (buy_number > 0 && buy_number < spec_buy_min_number)) : false;
                var upd_data = {
                    goods_spec_base_price: spec_base.price,
                    goods_spec_base_original_price: spec_base.original_price || 0,
                    goods_spec_base_inventory: spec_inventory,
                    goods_spec_base_buy_min_number: spec_buy_min_number,
                    goods_spec_base_buy_max_number: spec_buy_max_number,
                    buy_number: buy_number,
                    spec_confirm_btn_disabled_status: btn_disabled_status,
                };
                if((spec_base.inventory_unit || null) != null) {
                    upd_data['goods_spec_base_inventory_unit'] = spec_base.inventory_unit;
                    upd_data['goods_show_price_unit'] = ' / '+spec_base.inventory_unit;
                    upd_data['goods_show_original_price_unit'] = ' / '+spec_base.inventory_unit;
                }
                this.setData(upd_data);

                // 成功-调用父级
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
            spec_handle_dont(key = null) {
                var temp_spec = this.goods_spec_choose || [];
                if (temp_spec.length <= 0) {
                    return false;
                }

                // 是否不能选择
                if(key !== null) {
                    key = parseInt(key);
                    for (var i in temp_spec) {
                        for (var k in temp_spec[i]['value']) {
                            if (i > key) {
                                temp_spec[i]['value'][k]['is_dont'] = 'spec-dont-choose';
                                temp_spec[i]['value'][k]['is_disabled'] = '';
                                temp_spec[i]['value'][k]['is_active'] = '';
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
                }
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
                var inventory_unit = this.goods_spec_base_inventory_unit;
                var min = spec_buy_min_number > 0 ? spec_buy_min_number : buy_min_number;
                var max = spec_buy_max_number > 0 ? spec_buy_max_number : buy_max_number;

                // 最小起购数量
                if (min > 0 && number < min) {
                    number = (min > max) ? max : min;
                    app.globalData.showToast(this.$t('common.starting_purchase') + min + inventory_unit);
                    return false;
                }

                // 最大购买数量
                if (max > 0 && number > max) {
                    number = max;
                    app.globalData.showToast(this.$t('common.purchase_limit') + max + inventory_unit);
                    return false;
                }

                // 是否超过库存数量
                if (number > inventory) {
                    number = inventory;
                    app.globalData.showToast(this.$t('common.inventory_quantity') + inventory + inventory_unit);
                    return false;
                }

                // 数量是否改变
                if(this.buy_number != number) {
                    this.setData({ buy_number: number });

                    // 存在规格的时候是否已完全选择规格
                    var spec = this.goods_selected_spec();
                    var sku_count = this.goods_spec_choose.length;
                    var active_count = spec.length;
                    if (sku_count > 0 && active_count < sku_count) {
                        return false;
                    }

                    // 获取数据
                    var data = this.get_spec_request_data({
                        spec: spec,
                        stock: this.buy_number,
                    });
                    uni.request({
                        url: this.get_goods_spec_request_url('stock'),
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
                }
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
                            app.globalData.showToast(this.$t('common.please_select_spec'));
                            return false;
                        }
                    }

                    // 操作类型
                    var type = (e == null) ? this.buy_event_type : (e.currentTarget.dataset.type || this.buy_event_type);
                    var value = (e == null) ? null : (e.currentTarget.dataset.value || null);
                    var business = (e == null) ? null : (e.currentTarget.dataset.business || null);
                    var buylink = (e == null) ? null : (e.currentTarget.dataset.buylink || null);
                    switch (type) {
                        // 展示型、商品页面规格选择展示型 拨打电话操作
                        case 'show':
                        case 'spec-show':
                            app.globalData.call_tel(value || app.globalData.get_config('config.common_app_customer_service_tel'));
                            break;

                        // 购买
                        case 'buy':
                            // 进入订单确认页面
                            var goods_item = {
                                goods_id: this.goods.goods_id || this.goods.id,
                                stock: this.buy_number,
                                spec: spec,
                            };
                            var data = {
                                buy_type: 'goods',
                                goods_data: encodeURIComponent(
                                    base64.encode(
                                        JSON.stringify([
                                            goods_item,
                                        ])
                                    )
                                )
                            };
                            this.buy_data_extend_merge(data);
                            var buy_query_data = encodeURIComponent(base64.encode(JSON.stringify(data)));

                            // 购买链接、默认系统购买页面
                            if(buylink == null) {
                                buylink = '/pages/buy/buy';
                            }
                            // 进去订单确认页面
                            app.globalData.url_open(buylink+'?data=' + buy_query_data);

                            // 关闭弹窗
                            this.popup_close_event();
                            break;

                        // 加入购物车
                        case 'cart':
                            this.goods_cart_event(spec);
                            break;

                        // 事件回调
                        case 'back':
                            this.$emit('BackConfirmEvent', {
                                spec: spec,
                                buy_number: this.buy_number,
                                goods_id: this.goods.goods_id || this.goods.id,
                                goods: this.goods,
                                goods_spec_choose: this.goods_spec_choose,
                                back_data: this.back_data,
                            });
                            this.popup_close_event();
                            break;

                        default:
                            app.globalData.showToast(this.$t('goods-buy.incorrect_operation_event_type') + type + ')');
                    }
                }
            },

            // 加入购物车事件
            goods_cart_event(spec) {
                var data = this.params;
                data['goods_id'] = this.goods.goods_id || this.goods.id;
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
                                goods_id: this.goods.goods_id || this.goods.id,
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
<style scoped>
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
    .goods-spec-base.cover-tall {
        height: 280rpx;
    }
    .goods-spec-base.cover-tall .spec-images {
        height: 244rpx;
    }
    .goods-spec-base-content {
        position: absolute;
        left: 220rpx;
        top: 0;
    }
    .goods-spec-choice-content {
        max-height: 50vh;
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
        right: 0;
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
