<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" :class="data_list.length > 0 ? 'active' : ''" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="cart-page">
                <!-- 数据列表 -->
                <view class="padding-horizontal-main padding-top-main" :class="source_type != 'cart' ? 'bottom-line-exclude' : ''">
                    <uni-swipe-action>
                        <view v-for="(item, index) in data_list" :key="index" class="oh border-radius-main bg-white spacing-mb">
                            <uni-swipe-action-item :right-options="swipe_options" @click="swipe_opt_event" @change="swipe_change($event, index)">
                                <view class="flex-row align-c" :class="'cart-goods-item padding-main pr ' + (common_site_type == 1 ? 'cart-exhibition-mode-data' : '')">
                                    <!-- 选择 -->
                                    <view v-if="common_site_type != 1" @tap="selected_event" data-type="node" :data-index="index" class="cart-selected pr z-i ht-auto">
                                        <image class="icon" :src="common_static_url + 'select' + (item.selected || false ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
                                    </view>
                                    <view class="items oh padding-left-main flex-1 flex-row">
                                        <view>
                                            <navigator :url="item.goods_url" hover-class="none">
                                                <!-- 图片 -->
                                                <image :class="'cart-goods-image fl radius ' + ((item.is_error || 0) == 1 ? 'opacity' : '')" :src="item.images" mode="aspectFill"></image>
                                                <!-- 错误 -->
                                                <view v-if="(item.is_error || 0) == 1" class="error-msg pa tc text-size-xs">
                                                    <text class="cr-red tc bg-white round">{{ item.error_msg }}</text>
                                                </view>
                                            </navigator>
                                        </view>

                                        <!-- 基础 -->
                                        <view class="cart-goods-base padding-left-main flex-1">
                                            <!-- 标题、规格 -->
                                            <navigator :url="item.goods_url" hover-class="none">
                                                <view :class="'cart-goods-title multi-text margin-bottom-sm fw-b ' + ((item.is_error || 0) == 1 ? 'cr-grey' : '')">{{ item.title }}</view>
                                            </navigator>
                                            <view v-if="item.spec != null" class="margin-bottom-sm">
                                                <block v-for="(sv, si) in item.spec" :key="si">
                                                    <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                                    <text class="cr-grey">{{ sv.value }}</text>
                                                </block>
                                            </view>

                                            <!-- 底部内容 -->
                                            <view class="goods-bottom pr margin-top-sm flex-row jc-sb align-c">
                                                <!-- 价格 -->
                                                <view class="sales-price fw-b">
                                                    <text class="text-size-sm">{{ currency_symbol }}</text>
                                                    <text class="text-size-lg">{{ item.price }}</text>
                                                </view>

                                                <!-- 数量 -->
                                                <view v-if="(item.is_error || 0) != 1 && common_site_type != 1" class="cart-number-content pa tc oh round br">
                                                    <view @tap="goods_buy_number_event" class="number-submit tc cr-grey fl va-m" :data-index="index" data-type="0">-</view>
                                                    <input @blur="goods_buy_number_blur" class="tc cr-grey fl va-m bg-white radius-0" type="number" :value="item.stock" :data-index="index" />
                                                    <view @tap="goods_buy_number_event" class="number-submit tc cr-grey fl va-m" :data-index="index" data-type="1">+</view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </uni-swipe-action-item>
                        </view>
                    </uni-swipe-action>
                </view>
            </view>

            <!-- 空购物车 -->
            <view v-if="data_list.length == 0 && data_list_loding_status == 0" class="cart-no-data-box tc">
                <image :src="common_static_url + 'cart-empty.png'" mode="widthFix" class="margin-bottom-lg"></image>
                <view class="cr-grey text-size-sm">{{ data_list_loding_msg || '购物车空空如也' }}</view>
                <navigator class="dis-inline-block" :url="home_page_url" open-type="switchTab" hover-class="none">
                    <button class="bg-main br-main cr-white text-size-md round margin-top-xxl" type="default" size="mini" hover-class="none">去逛逛</button>
                </navigator>
            </view>

            <!-- 提示信息 -->
            <block v-if="data_list.length == 0 && data_list_loding_status != 0">
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </block>

            <!-- 猜你喜欢 -->
            <view v-if="goods_list.length > 0" class="padding-horizontal-main">
                <view class="tc spacing-mb">
                    <view class="guess-like fw-b text-size-md">猜你喜欢</view>
                </view>
                <component-goods-list class="spacing-mt" :propData="{ style_type: 1, goods_list: goods_list, random: random_value }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true" propSource="index" @CartSuccessEvent="cart_success_event"> </component-goods-list>
            </view>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="goods_bottom_line_status"></component-bottom-line>
        </scroll-view>
        <!-- 操作导航 -->
        <!-- 展示型 -->
        <block v-if="data_list.length > 0">
            <view v-if="common_site_type == 1" :class="'cart-buy-nav oh wh-auto ' + (source_type != 'cart' ? 'bottom-line-exclude' : '')">
                <view class="cart-exhibition-mode padding-horizontal-main">
                    <button class="bg-main cr-white round wh-auto text-size-sm" type="default" @tap="exhibition_submit_event" hover-class="none">
                        <view class="dis-inline-block va-m margin-right-xl">
                            <uni-icons type="phone" size="14" color="#fff" />
                        </view>
                        <text class="va-m">{{ common_is_exhibition_mode_btn_text }}</text>
                    </button>
                </view>
            </view>
            <!-- 销售,自提,虚拟销售 -->
            <view v-else class="flex-row jc-sb align-c cart-buy-nav oh wh-auto br-t bg-white" :class="source_type != 'cart' ? 'bottom-line-exclude' : ''">
                <view class="cart-nav-base single-text padding-left flex-row jc-sb align-c">
                    <view class="cart-selected flex-row align-c">
                        <view @tap="selected_event" data-type="all">
                            <image class="icon va-m" :src="common_static_url + 'select' + (is_selected_all ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
                        </view>
                        <text v-if="already_selected_status" @tap="cart_all_remove_event" class="margin-left-main cart-nav-remove-submit dis-inline-block va-m bg-white cr-red br-red round cp">删除</text>
                        <text v-else class="va-m cr-base padding-left-main" @tap="selected_event" data-type="all">全选</text>
                    </view>
                    <view class="price flex-row jc-e flex-nowrap align-c">
                        <view>合计：</view>
                        <view class="sales-price single-text fw-b">
                            <text class="text-size-sm">{{ currency_symbol }}</text>
                            <text class="text-size-lg">{{ total_price }}</text>
                        </view>
                    </view>
                </view>
                <view class="cart-nav-submit">
                    <button class="bg-main cr-white round" type="default" @tap="buy_submit_event" :disabled="!already_valid_selected_status" hover-class="none">
                        去结算
                        <text v-if="total_num > 0">({{ total_num }})</text>
                    </button>
                </view>
            </view>
        </block>
        <!-- 用户基础 -->
        <component-user-base ref="user_base"></component-user-base>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../common/js/lib/base64.js';
    import componentNoData from '../../components/no-data/no-data';
    import componentUserBase from '../../components/user-base/user-base';
    import componentGoodsList from '../../components/goods-list/goods-list';
    import componentBottomLine from '../../components/bottom-line/bottom-line';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_list: [],
                total_price: '0.00',
                total_num: 0,
                is_selected_all: false,
                already_selected_status: false,
                already_valid_selected_status: false,
                source_type: null,
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                common_site_type: 0,
                common_is_exhibition_mode_btn_text: null,
                common_app_customer_service_tel: null,
                swipe_item_index: null,
                swipe_options: [
                    {
                        text: '收藏',
                        style: {
                            backgroundColor: '#1AAD19',
                        },
                    },
                    {
                        text: '删除',
                        style: {
                            backgroundColor: '#E64340',
                        },
                    },
                ],
                // 首页地址
                home_page_url: app.globalData.data.tabbar_pages[0],
                // 猜你喜欢 参数
                goods_list: [],
                goods_bottom_line_status: false,
                goods_is_loading: 0,
                goods_total: 0,
                goods_page_total: 0,
                goods_page: 1,
                // 标签插件
                plugins_label_data: null,
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
            };
        },

        components: {
            componentNoData,
            componentUserBase,
            componentGoodsList,
            componentBottomLine,
        },
        props: {},

        created: function () {
            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();

            // 猜你喜欢
            this.get_data_list(1);
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        common_site_type: app.globalData.get_config('config.common_site_type'),
                        common_is_exhibition_mode_btn_text: app.globalData.get_config('config.common_is_exhibition_mode_btn_text', '立即咨询'),
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init(source_type = null) {
                this.setData({
                    source_type: source_type,
                });
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.stopPullDownRefresh();
                        uni.showModal({
                            title: '温馨提示',
                            content: '绑定手机号码',
                            confirmText: '确认',
                            cancelText: '暂不',
                            success: (result) => {
                                if (result.confirm) {
                                    uni.navigateTo({
                                        url: '/pages/login/login?event_callback=init',
                                    });
                                } else {
                                    this.setData({
                                        data_list_loding_status: 0,
                                        data_list_loding_msg: '请绑定手机号码',
                                    });
                                }
                            },
                        });

                        // 分享菜单处理
                        app.globalData.page_share_handle();
                    } else {
                        // 获取数据
                        this.get_data();

                        // 用户头像和昵称设置提示
                        if ((this.$refs.user_base || null) != null) {
                            var self = this;
                            setTimeout(function () {
                                self.$refs.user_base.init('cart');
                            }, 10);
                        }
                    }
                } else {
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: '请先授权用户信息',
                    });

                    // 分享菜单处理
                    app.globalData.page_share_handle();
                }
            },

            // 获取数据
            get_data(type) {
                uni.request({
                    url: app.globalData.get_request_url('index', 'cart'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data || [];
                            if (data_list.length > 0) {
                                // 选中状态处理
                                var not_use = uni.getStorageSync(app.globalData.data.cache_user_cart_not_use_data_key) || {};
                                for (var i in data_list) {
                                    if ((not_use[data_list[i]['id']] || null) == null || not_use[data_list[i]['id']] != data_list[i]['stock']) {
                                        data_list[i]['selected'] = true;
                                    }
                                }
                                // 缓存记录用户未选中的购物车数据
                                uni.setStorageSync(app.globalData.data.cache_user_cart_not_use_data_key, not_use);
                            }
                            let new_goods_list = [];
                            // 判断猜你喜欢是否含有数据
                            if (this.goods_list.length > 0) {
                                if (type !== 1) {
                                    new_goods_list = this.goods_change(data_list);
                                    this.setData({
                                        goods_list: new_goods_list,
                                    });
                                }
                            }
                            // 设置数据
                            this.setData({
                                data_list: data_list,
                                data_list_loding_status: data_list.length == 0 ? 0 : 3,
                                data_list_loding_msg: '购物车空空如也',
                            });
                            // 选择处理
                            this.cart_selected_calculate();
                            // 导航购物车处理
                            var cart_total = data.buy_number || 0;
                            if (cart_total <= 0) {
                                app.globalData.set_tab_bar_badge(2, 0);
                            } else {
                                app.globalData.set_tab_bar_badge(2, 1, cart_total);
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }

                        // 分享菜单处理、延时执行，确保基础数据已加载完成
                        setTimeout(function () {
                            app.globalData.page_share_handle();
                        }, 3000);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '网络开小差了哦~',
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 数量输入事件
            goods_buy_number_blur(e) {
                var index = e.currentTarget.dataset.index || 0;
                var buy_number = parseInt(e.detail.value) || 1;
                this.goods_buy_number_func(index, buy_number);
            },

            // 数量操作事件
            goods_buy_number_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var type = parseInt(e.currentTarget.dataset.type) || 0;
                var temp_number = parseInt(this.data_list[index]['stock']);
                var buy_number = type == 0 ? temp_number - 1 : temp_number + 1;
                this.goods_buy_number_func(index, buy_number, type);
            },
            // 删除弹窗
            model_tips(id) {
                uni.showModal({
                    title: '温馨提示',
                    content: '挑了这么久，真的要删除吗？',
                    confirmText: '确认',
                    cancelText: '暂不',
                    success: (result) => {
                        if (result.confirm) {
                            this.cart_delete(id, 'delete');
                        }
                    },
                });
            },

            // 数量处理方法
            goods_buy_number_func(index, buy_number, type) {
                var temp_data_list = this.data_list;
                var buy_min_number = parseInt(temp_data_list[index]['spec_buy_min_number']) || 1;
                var buy_max_number = parseInt(temp_data_list[index]['spec_buy_max_number']) || 0;
                var inventory = parseInt(temp_data_list[index]['inventory']);
                var inventory_unit = temp_data_list[index]['inventory_unit'];
                let new_type = type === 0 ? 'del' : 'add';
                if (buy_number < buy_min_number) {
                    buy_number = buy_min_number;
                    this.data_list[index].stock = buy_min_number;
                    if (buy_min_number > 1) {
                        app.globalData.showToast('起购' + buy_min_number + inventory_unit);
                        this.model_tips(temp_data_list[index]['id']);
                        return false;
                    }
                }

                if (buy_max_number > 0 && buy_number > buy_max_number) {
                    buy_number = buy_max_number;
                    app.globalData.showToast('限购' + buy_max_number + inventory_unit);
                    return false;
                }

                if (buy_number > inventory) {
                    buy_number = inventory;
                    app.globalData.showToast('库存数量' + inventory + inventory_unit);
                    return false;
                }

                if (temp_data_list[index]['stock'] == 1 && buy_number == 1) {
                    this.model_tips(temp_data_list[index]['id']);
                    return false;
                }

                // 更新数据库
                uni.showLoading({
                    title: '处理中...',
                    mask: true,
                });
                uni.request({
                    url: app.globalData.get_request_url('stock', 'cart'),
                    method: 'POST',
                    data: {
                        id: temp_data_list[index]['id'],
                        goods_id: temp_data_list[index]['goods_id'],
                        stock: buy_number,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var not_use = uni.getStorageSync(app.globalData.data.cache_user_cart_not_use_data_key) || {};
                            var data = res.data.data;
                            temp_data_list[index]['stock'] = data.stock;
                            temp_data_list[index]['original_price'] = data.original_price;
                            temp_data_list[index]['price'] = data.price;
                            temp_data_list[index]['selected'] = true;
                            delete not_use[temp_data_list[index]['id']];

                            let new_goods_list = this.goods_change(temp_data_list);
                            this.setData({
                                data_list: temp_data_list,
                                goods_list: new_goods_list,
                            });

                            // 缓存记录用户未选中的购物车数据
                            uni.setStorageSync(app.globalData.data.cache_user_cart_not_use_data_key, not_use);

                            // 选择处理
                            this.cart_selected_calculate();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 收藏+删除
            goods_favor_delete(id, goods_id, type) {
                uni.request({
                    url: app.globalData.get_request_url('favor', 'goods'),
                    method: 'POST',
                    data: {
                        id: goods_id,
                        is_mandatory_favor: 1,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.cart_delete(id, type);
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 批量删除操作
            cart_all_remove_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '挑了这么久，真的要删除吗？',
                    confirmText: '确认',
                    cancelText: '暂不',
                    success: (result) => {
                        if (result.confirm) {
                            var data = [];
                            var temp_data_list = this.data_list || [];
                            for (var i in temp_data_list) {
                                if ((temp_data_list[i]['selected'] || false) == true) {
                                    data.push(temp_data_list[i]['id']);
                                }
                            }
                            if (data.length <= 0) {
                                app.globalData.showToast('请先选择数据');
                                return false;
                            }
                            this.cart_delete(data.join(','), 'delete');
                        }
                    },
                });
            },

            // 滑动事件
            swipe_change(e, v) {
                this.setData({
                    swipe_item_index: e == 'none' ? null : v,
                });
            },

            // 移除操作事件
            swipe_opt_event(e) {
                var index = e.index || 0;
                var temp_data_list = this.data_list;
                console.log('this.swipe_item_index', this.swipe_item_index);
                if (this.swipe_item_index === null) {
                    app.globalData.showToast('请先滑动要操作的数据');
                    return false;
                }
                if ((temp_data_list[this.swipe_item_index] || null) == null) {
                    app.globalData.showToast('数据不存在');
                    return false;
                }

                // 根据操作类型处理数据
                var id = temp_data_list[this.swipe_item_index]['id'];
                var goods_id = temp_data_list[this.swipe_item_index]['goods_id'];
                if (index == 0) {
                    this.goods_favor_delete(id, goods_id, 'favor');
                } else {
                    this.cart_delete(id, 'delete');
                }
            },

            // 购物车删除
            cart_delete(id, type) {
                uni.request({
                    url: app.globalData.get_request_url('delete', 'cart'),
                    method: 'POST',
                    data: {
                        id: id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var temp_list = [];
                            var temp_id_arr = id.split(',');
                            var temp_data_list = this.data_list;
                            for (var i in temp_data_list) {
                                if (temp_id_arr.indexOf(temp_data_list[i]['id']) == -1) {
                                    temp_list.push(temp_data_list[i]);
                                }
                            }
                            let new_goods_list = this.goods_change(temp_list);
                            this.setData({
                                data_list: temp_list,
                                data_list_loding_status: temp_list.length == 0 ? 0 : this.data_list_loding_status,
                                goods_list: new_goods_list,
                                random_value: Math.random(),
                            });
                            app.globalData.showToast(type == 'delete' ? '删除成功' : '收藏成功', 'success');

                            // 选择处理
                            this.cart_selected_calculate();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(type == 'delete' ? '删除失败' : '收藏失败');
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 选中处理
            selected_event(e) {
                var type = e.currentTarget.dataset.type || null;
                if (type != null) {
                    var temp_data_list = this.data_list;
                    var temp_is_selected_all = this.is_selected_all;
                    var not_use = uni.getStorageSync(app.globalData.data.cache_user_cart_not_use_data_key) || {};
                    switch (type) {
                        // 批量操作
                        case 'all':
                            temp_is_selected_all = temp_is_selected_all == true ? false : true;
                            for (var i in temp_data_list) {
                                temp_data_list[i]['selected'] = temp_is_selected_all;
                                // 选中清除则则记录
                                if (temp_is_selected_all) {
                                    delete not_use[temp_data_list[i]['id']];
                                } else {
                                    not_use[temp_data_list[i]['id']] = temp_data_list[i]['stock'];
                                }
                            }
                            break;
                        // 节点操作
                        case 'node':
                            var index = e.currentTarget.dataset.index || 0;
                            temp_data_list[index]['selected'] = temp_data_list[index]['selected'] == true ? false : true;
                            // 选中清除则则记录
                            if (temp_data_list[index]['selected']) {
                                delete not_use[temp_data_list[index]['id']];
                            } else {
                                not_use[temp_data_list[index]['id']] = temp_data_list[index]['stock'];
                            }
                            break;
                    }
                    this.setData({
                        data_list: temp_data_list,
                        is_selected_all: temp_is_selected_all,
                    });

                    // 缓存记录用户未选中的购物车数据
                    uni.setStorageSync(app.globalData.data.cache_user_cart_not_use_data_key, not_use);

                    // 选择处理
                    this.cart_selected_calculate();
                }
            },

            // 选中计算
            cart_selected_calculate() {
                var cart_total = 0;
                var total_price = 0;
                var total_num = 0;
                var data_count = 0;
                var selected_count = 0;
                var temp_data_list = this.data_list;
                for (var i in temp_data_list) {
                    if ((temp_data_list[i]['selected'] || false) == true) {
                        selected_count++;
                        if ((temp_data_list[i]['is_error'] || 0) == 0) {
                            data_count++;
                            total_price += parseInt(temp_data_list[i]['stock']) * parseFloat(temp_data_list[i]['price']);
                            total_num += parseInt(temp_data_list[i]['stock']);
                        }
                    }
                    cart_total += parseInt(temp_data_list[i]['stock']);
                }

                this.setData({
                    total_price: total_price.toFixed(2),
                    total_num: total_num,
                    already_selected_status: selected_count > 0,
                    already_valid_selected_status: data_count > 0,
                    is_selected_all: selected_count > 0 && selected_count >= temp_data_list.length,
                });
                if (cart_total <= 0) {
                    app.globalData.set_tab_bar_badge(2, 0);
                } else {
                    app.globalData.set_tab_bar_badge(2, 1, cart_total);
                }
            },

            // 结算
            buy_submit_event(e) {
                var selected_count = 0;
                var ids = [];
                var temp_data_list = this.data_list || [];
                for (var i in temp_data_list) {
                    if ((temp_data_list[i]['is_error'] || 0) == 0 && (temp_data_list[i]['selected'] || false) == true) {
                        ids.push(temp_data_list[i]['id']);
                        selected_count++;
                    }
                }
                if (selected_count <= 0) {
                    app.globalData.showToast('请先选择商品');
                    return false;
                }

                // 进入订单确认页面
                var data = {
                    buy_type: 'cart',
                    ids: ids.join(','),
                };
                uni.navigateTo({
                    url: '/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))),
                });
            },

            // 展示型事件
            exhibition_submit_event(e) {
                app.globalData.call_tel(this.common_app_customer_service_tel);
            },
            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 猜你喜欢
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.goods_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 是否加载中
                if (this.goods_is_loading == 1) {
                    return false;
                }
                this.setData({
                    goods_is_loading: 1,
                });

                // 获取数据
                uni.showLoading({
                    title: '加载中...',
                    mask: true,
                });
                var goods_data = {
                    page: this.goods_page,
                };
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'search'),
                    method: 'POST',
                    data: goods_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.goods_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.goods_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    goods_list: temp_data_list,
                                    random_value: Math.random(),
                                    goods_total: data.total,
                                    goods_page_total: data.page_total,
                                    goods_page: this.goods_page + 1,
                                    goods_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    goods_bottom_line_status: this.goods_page > 1 && this.goods_page > this.goods_page_total,
                                });
                            } else {
                                this.setData({
                                    goods_total: 0,
                                    goods_is_loading: 0,
                                });
                                if (this.goods_page <= 1) {
                                    this.setData({
                                        goods_list: [],
                                        goods_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                goods_is_loading: 0,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            goods_is_loading: 0,
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 猜你喜欢加入购物车回调
            cart_success_event() {
                // 传1表示为购物车回调方法调用的此方法
                this.get_data(1);
            },

            // 猜你喜欢数据更新
            // cart_list: 购物车数据；
            goods_change(cart_list) {
                // 更新猜你喜欢的数据
                let new_goods_list = this.goods_list;
                for (let i = 0; i < new_goods_list.length; i++) {
                    let bool = app.globalData.some_arry(cart_list, new_goods_list[i].id, 'goods_id');
                    console.log(bool);
                    if (bool) {
                        // 将购物车中相同商品不同规格的商品数量累加
                        let new_goods_item = this.cart_item_num(cart_list);
                        for (let j = 0; j < new_goods_item.length; j++) {
                            if (new_goods_list[i].id === new_goods_item[j].id) {
                                new_goods_list[i].user_cart_count = new_goods_item[j].num;
                            }
                        }
                    } else {
                        new_goods_list[i].user_cart_count = 0;
                    }
                }
                return new_goods_list;
            },

            // 商品数量去重累加数量
            cart_item_num(cart_list) {
                let _res = [];
                for (let i = 0; i < cart_list.length; ) {
                    let num = 0;
                    let count = 0;
                    for (let j = i; j < cart_list.length; j++) {
                        if (cart_list[i].goods_id == cart_list[j].goods_id) {
                            num += Number(cart_list[j].stock ? cart_list[j].stock : 0);
                            count++;
                        }
                    }
                    let obj = {
                        id: cart_list[i].goods_id,
                        num: num,
                    };
                    _res.push(obj);
                    i += count;
                }
                return _res;
            },
        },
    };
</script>
<style scoped>
    /**
    * 商品列表
    */
    .cart-page {
        margin-bottom: 40rpx;
    }
    .scroll-box.active {
        height: calc(100vh - 125rpx);
        /* 125rpx */
        /* #ifdef H5 */
        height: calc(100vh - 224rpx);
        /* #endif */
    }
    .scroll-box {
        /* #ifdef H5 */
        height: calc(100vh - 100rpx);
        /* #endif */
    }

    .cart-goods-title {
        line-height: 44rpx;
        min-height: 86rpx;
    }

    .cart-goods-image {
        width: 156rpx;
        height: 156rpx;
    }

    .cart-goods-base {
        width: calc(100% - 170rpx);
    }

    .cart-goods-item .selected {
        margin-top: 60rpx;
    }

    /**
     * 错误提示
     */
    .cart-goods-item .error-msg {
        left: 80rpx;
        top: 78rpx;
        width: 160rpx;
        filter: blur(0.3px);
    }

    .cart-goods-item .error-msg text {
        padding: 2rpx 10rpx;
        box-shadow: 0 2px 10px rgb(181 181 181 / 95%);
    }

    /**
     * 底部
     */
    .cart-goods-item .goods-bottom {
        height: 58rpx;
    }

    /**
    * 数量操作
    */
    .cart-number-content {
        right: 0;
        top: 0;
    }

    .cart-number-content .number-submit {
        width: 60rpx;
        font-weight: bold;
    }

    .cart-number-content input {
        width: 30px;
        border-width: 0 1px;
        border-style: solid;
        border-color: #efefef;
    }

    .cart-number-content .number-submit,
    .cart-number-content input {
        padding: 0;
        height: 50rpx;
        line-height: 50rpx;
    }

    /**
    * 空购物车
    */
    .cart-no-data-box {
        padding: 100rpx 0 40rpx 0;
    }

    .cart-no-data-box image {
        width: 160rpx;
    }

    /**
    * 操作导航
    */
    .cart-buy-nav {
        position: fixed;
        z-index: 2;
        left: 0;
        bottom: 0rpx;
        /* #ifdef H5 || APP */
        bottom: var(--window-bottom);
        /* #endif */
    }

    .cart-nav-submit button {
        font-size: 32rpx;
        padding: 0 32rpx;
    }

    .cart-nav-base {
        width: calc(75% - 20rpx);
    }

    .cart-nav-submit {
        padding: 20rpx 24rpx;
        white-space: nowrap;
    }

    .cart-nav-submit button {
        border-radius: 0;
    }

    .cart-selected .icon {
        width: 35rpx;
        height: 35rpx !important;
    }

    .cart-buy-nav .price {
        width: calc(100% - 170rpx);
    }

    .cart-buy-nav .sales-price {
        max-width: calc(100% - 40px);
    }

    .cart-nav-remove-submit {
        padding: 0rpx 20rpx;
    }

    /*
    * 展示型
    */
    .cart-exhibition-mode button {
        line-height: 80rpx;
    }

    .cart-exhibition-mode-data .items {
        padding-left: 0;
    }

    .cart-exhibition-mode-data .error-msg {
        left: 26rpx;
    }

    /**
	 * 猜你喜欢
	 */
    .guess-like {
        position: relative;
        text-align: center;
        display: inline-block;
    }

    .guess-like::before,
    .guess-like::after {
        content: '';
        width: 76px;
        height: 1px;
        background: #dddddd;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

    .guess-like::before {
        left: calc(100% + 20rpx);
    }

    .guess-like::after {
        right: calc(100% + 20rpx);
    }
</style>
