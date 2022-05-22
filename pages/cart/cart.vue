<template>
    <view>
        <view v-if="data_list.length > 0" class="page">
            <!-- 数据列表 -->
            <view class="padding-horizontal-main padding-top-main">
                <uni-swipe-action>
                    <view v-for="(item, index) in data_list" :key="index" class="oh border-radius-main bg-white spacing-mb">
                        <uni-swipe-action-item :right-options="swipe_options" @click="swipe_opt_event" @change="swipe_change($event, index)">
                            <view :class="'goods-item padding-main pr ' + (common_site_type == 1 ? 'exhibition-mode-data' : '')">
                                <!-- 选择 -->
                                <view v-if="common_site_type != 1" @tap="selected_event" data-type="node" :data-index="index" class="fl selected">
                                    <image v-if="(item.is_error || 0) != 1" class="icon" :src="common_static_url+'select' + ((item.is_error || 0) == 1 ? '-disabled' : ((item.selected || false) ? '-active' : '')) + '-icon.png'" mode="widthFix"></image>
                                    <text v-if="(item.is_error || 0) == 1" class="cr-grey">失效</text>
                                </view>

                                <view class="items">
                                    <navigator :url="item.goods_url" hover-class="none">
                                        <!-- 图片 -->
                                        <image :class="'goods-image fl radius '+((item.is_error || 0) == 1 ? 'opacity' : '')" :src="item.images" mode="aspectFill"></image>
                                        <!-- 错误 -->
                                        <view v-if="(item.is_error || 0) == 1" class="error-msg pa tc text-size-xs">
                                            <text class="cr-red tc bg-white round">{{item.error_msg}}</text>
                                        </view>
                                    </navigator>

                                    <!-- 基础 -->
                                    <view class="goods-base">
                                        <!-- 标题、规格 -->
                                        <navigator :url="item.goods_url" hover-class="none">
                                            <view :class="'goods-title multi-text margin-bottom-sm '+((item.is_error || 0) == 1 ? 'cr-grey' : '')">{{item.title}}</view>
                                        </navigator>
                                        <view v-if="item.spec != null" class="margin-bottom-sm">
                                            <block v-for="(sv, si) in item.spec" :key="si">
                                                <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                                <text class="cr-gray">{{sv.value}}</text>
                                            </block>
                                        </view>

                                        <!-- 底部内容 -->
                                        <view class="goods-bottom pr margin-top-sm">
                                            <!-- 价格 -->
                                            <text class="sales-price">{{currency_symbol}}{{item.price}}</text>
                                        
                                            <!-- 数量 -->
                                            <view v-if="(item.is_error || 0) != 1 && common_site_type != 1" class="number-content pa tc oh round br">
                                                <view @tap="goods_buy_number_event" class="number-submit tc cr-gray fl va-m" :data-index="index" data-type="0">-</view>
                                                <input @blur="goods_buy_number_blur" class="tc cr-gray fl va-m bg-white radius-0" type="number" :value="item.stock" :data-index="index">
                                                <view @tap="goods_buy_number_event" class="number-submit tc cr-gray fl va-m" :data-index="index" data-type="1">+</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </uni-swipe-action-item>
                    </view>
                </uni-swipe-action>
            </view>

            <!-- 操作导航 -->
            <view class="buy-nav oh wh-auto">
                <!-- 展示型 -->
                <view v-if="common_site_type == 1" class="exhibition-mode padding-horizontal-main">
                    <button class="bg-main cr-white round wh-auto text-size" type="default" @tap="exhibition_submit_event" hover-class="none">
                        <view class="dis-inline-block va-m margin-right-xl">
                            <uni-icons type="phone" size="14" color="#fff" />
                        </view>
                        <text class="va-m">{{common_is_exhibition_mode_btn_text}}</text>
                    </button>
                </view>

                <!-- 销售,自提,虚拟销售 -->
                <view v-else class="br-t bg-white wh-auto ht-auto">
                    <view class="nav-base fl single-text padding-left">
                        <view @tap="selected_event" data-type="all" class="fl selected">
                            <image class="icon va-m" :src="common_static_url+'select' + (is_selected_all ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
                            <text v-if="!already_selected_status" class="va-m cr-base">全选</text>
                        </view>
                        <view v-if="already_selected_status" @tap="cart_all_remove_event" class="nav-remove-submit pa bg-white cr-red br-red round cp">删除</view>
                        <view class="fr price">
                            <view class="sales-price single-text fr">{{currency_symbol}}{{total_price}}</view>
                            <view class="fr">合计：</view>
                        </view>
                    </view>
                    <view class="fr nav-submit padding-top padding-bottom padding-horizontal-main">
                        <button class="bg-main cr-white round text-size-lg" type="default" @tap="buy_submit_event" :disabled="!already_selected_status" hover-class="none">结算</button>
                    </view>
                </view>
            </view>
        </view>

        <!-- 空购物车 -->
        <view v-if="data_list.length == 0 && data_list_loding_status == 0" class="no-data-box tc">
            <image :src="common_static_url+'cart-empty.png'" mode="widthFix" class="margin-bottom-lg"></image>
            <view class="cr-grey text-size-sm">{{data_list_loding_msg || '购物车空空如也'}}</view>
            <navigator class="dis-inline-block" :url="home_page_url" open-type="switchTab" hover-class="none">
                <button class="bg-main br-main cr-white text-size round margin-top-xxl" type="default" size="mini" hover-class="none">去逛逛</button>
            </navigator>
        </view>

        <!-- 提示信息 -->
        <block v-if="data_list.length == 0 && data_list_loding_status != 0">
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 快捷导航 -->
        <component-quick-nav :propIsBar="true"></component-quick-nav>
    </view>
</template>
<script>
    const app = getApp();
    import componentQuickNav from "../../components/quick-nav/quick-nav";
    import componentNoData from "../../components/no-data/no-data";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_list: [],
                total_price: '0.00',
                is_selected_all: false,
                already_selected_status: false,
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                common_site_type: 0,
                common_is_exhibition_mode_btn_text: null,
                common_app_customer_service_tel: null,
                swipe_item_index: null,
                swipe_options:[
                    {
                        text: '收藏',
                        style: {
                            backgroundColor: '#1AAD19'
                        }
                    },{
                        text: '删除',
                        style: {
                            backgroundColor: '#E64340'
                        }
                    }
                ],
                // 首页地址
                home_page_url: app.globalData.data.tabbar_pages[0]
            };
        },

        components: {
            componentQuickNav,
            componentNoData
        },
        props: {},

        onShow() {
            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();
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
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init(e) {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.stopPullDownRefresh();
                        uni.showModal({
                            title: '温馨提示',
                            content: '绑定手机号码',
                            confirmText: '确认',
                            cancelText: '暂不',
                            success: result => {
                                if (result.confirm) {
                                    uni.navigateTo({
                                        url: "/pages/login/login?event_callback=init"
                                    });
                                } else {
                                    this.setData({
                                        data_list_loding_status: 0,
                                        data_bottom_line_status: false,
                                        data_list_loding_msg: '请绑定手机号码'
                                    });
                                }
                            }
                        });

                        // 分享菜单处理
                        app.globalData.page_share_handle();
                    } else {
                        this.get_data();
                    }
                } else {
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                        data_list_loding_msg: '请先授权用户信息'
                    });

                    // 分享菜单处理
                    app.globalData.page_share_handle();
                }
            },

            // 获取数据
            get_data() {
                this.setData({
                    data_list_loding_status: 1,
                    total_price: '0.00',
                    is_selected_all: false,
                    already_selected_status: false
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "cart"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data || [];
                            this.setData({
                                data_list: data_list,
                                data_list_loding_status: data_list.length == 0 ? 0 : 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: '购物车空空如也'
                            });

                            // 导航购物车处理
                            var cart_total = data.common_cart_total || 0;
                            if (cart_total <= 0) {
                                app.globalData.set_tab_bar_badge(2, 0);
                            } else {
                                app.globalData.set_tab_bar_badge(2, 1, cart_total);
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }

                        // 分享菜单处理、延时执行，确保基础数据已加载完成
                        setTimeout(function() {
                            app.globalData.page_share_handle();
                        }, 3000);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
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
                var buy_number = (type == 0) ? temp_number - 1 : temp_number + 1;
                this.goods_buy_number_func(index, buy_number);
            },

            // 数量处理方法
            goods_buy_number_func(index, buy_number) {
                var temp_data_list = this.data_list;
                var buy_min_number = parseInt(temp_data_list[index]['buy_min_number']) || 1;
                var buy_max_number = parseInt(temp_data_list[index]['buy_max_number']) || 0;
                var inventory = parseInt(temp_data_list[index]['inventory']);
                var inventory_unit = temp_data_list[index]['inventory_unit'];
                if (buy_number < buy_min_number) {
                    buy_number = buy_min_number;
                    if (buy_min_number > 1) {
                        app.globalData.showToast('起购' + buy_min_number + inventory_unit);
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
                    return false;
                }
                
                // 更新数据库
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                });
                uni.request({
                    url: app.globalData.get_request_url("stock", "cart"),
                    method: "POST",
                    data: {
                        "id": temp_data_list[index]['id'],
                        "goods_id": temp_data_list[index]['goods_id'],
                        "stock": buy_number
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            temp_data_list[index]['stock'] = data.stock;
                            temp_data_list[index]['original_price'] = data.original_price;
                            temp_data_list[index]['price'] = data.price;
                            this.setData({
                                data_list: temp_data_list
                            });
                            
                            // 选择处理
                            this.selected_calculate();
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
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 收藏+删除
            goods_favor_delete(id, goods_id, type) {
                uni.request({
                    url: app.globalData.get_request_url('favor', 'goods'),
                    method: 'POST',
                    data: {
                        "id": goods_id,
                        "is_mandatory_favor": 1
                    },
                    dataType: 'json',
                    success: res => {
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
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },
            
            // 批量删除操作
            cart_all_remove_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '挑了这么久，真的要删除吗？',
                    confirmText: '确认',
                    cancelText: '暂不',
                    success: result => {
                        if (result.confirm) {
                            var data = [];
                            var temp_data_list = this.data_list || [];
                            for (var i in temp_data_list) {                
                                if ((temp_data_list[i]['selected'] || false) == true) {
                                    data.push(temp_data_list[i]['id']);
                                }
                            }
                            if(data.length <= 0) {
                                app.globalData.showToast('请先选择数据');
                                return false;
                            }
                            this.cart_delete(data.join(','), 'delete');
                        }
                    }
                });
            },
            
            // 滑动事件
            swipe_change(e, v) {
                this.setData({
                   swipe_item_index:  (e == 'none') ? null : v
                });
            },

            // 移除操作事件
            swipe_opt_event(e) {
                var index = e.index || 0;
                var temp_data_list = this.data_list;
                if(this.swipe_item_index === null) {
                    app.globalData.showToast("请先滑动要操作的数据");
                    return false;
                }
                if((temp_data_list[this.swipe_item_index] || null) == null) {
                    app.globalData.showToast("数据不存在");
                    return false;
                }

                // 根据操作类型处理数据
                var id = temp_data_list[this.swipe_item_index]['id'];
                if (index == 0) {
                    var goods_id = temp_data_list[this.swipe_item_index]['goods_id'];
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
                        "id": id
                    },
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            var temp_list = [];
                            var temp_id_arr = id.split(',');
                            var temp_data_list = this.data_list;
                            for(var i in temp_data_list) {
                                if(temp_id_arr.indexOf(temp_data_list[i]['id']) == -1) {
                                    temp_list.push(temp_data_list[i]);
                                }
                            }
                            this.setData({
                                data_list: temp_list,
                                data_list_loding_status: temp_list.length == 0 ? 0 : this.data_list_loding_status
                            });

                            // 导航购物车处理
                            var cart_total = res.data.data || 0;
                            if (cart_total <= 0) {
                                app.globalData.set_tab_bar_badge(2, 0);
                            } else {
                                app.globalData.set_tab_bar_badge(2, 1, cart_total);
                            }
                            app.globalData.showToast(type == 'delete' ? '删除成功' : '收藏成功', 'success');
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(type == 'delete' ? '删除失败' : '收藏失败');
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 选中处理
            selected_event(e) {
                var type = e.currentTarget.dataset.type || null;
                if (type != null) {
                    var temp_data_list = this.data_list;
                    var temp_is_selected_all = this.is_selected_all;
                    switch (type) {
                        // 批量操作
                        case 'all':
                            temp_is_selected_all = temp_is_selected_all == true ? false : true;
                            for (var i in temp_data_list) {
                                if (temp_data_list[i]['is_error'] != 1) {
                                    temp_data_list[i]['selected'] = temp_is_selected_all;
                                }
                            }
                            break;
                            // 节点操作
                        case 'node':
                            var index = e.currentTarget.dataset.index || 0;
                            if (temp_data_list[index]['is_error'] != 1) {
                                temp_data_list[index]['selected'] = temp_data_list[index]['selected'] == true ? false : true;
                            }
                            break;
                    }

                    this.setData({
                        data_list: temp_data_list,
                        is_selected_all: temp_is_selected_all
                    });

                    // 选择处理
                    this.selected_calculate();
                }
            },

            // 选中计算
            selected_calculate() {
                var total_price = 0;
                var data_count = 0;
                var selected_count = 0;
                var temp_data_list = this.data_list;
                for (var i in temp_data_list) {
                    if ((temp_data_list[i]['is_error'] || 0) == 0) {
                        data_count++;
                    }

                    if ((temp_data_list[i]['selected'] || false) == true) {
                        total_price += temp_data_list[i]['stock'] * temp_data_list[i]['price'];
                        selected_count++;
                    }
                }

                this.setData({
                    total_price: total_price.toFixed(2),
                    already_selected_status: selected_count > 0,
                    is_selected_all: selected_count > 0 && selected_count >= data_count
                });
            },

            // 结算
            buy_submit_event(e) {
                var selected_count = 0;
                var ids = [];
                var temp_data_list = this.data_list || [];
                for (var i in temp_data_list) {
                    if ((temp_data_list[i]['selected'] || false) == true) {
                        ids.push(temp_data_list[i]['id']);
                        selected_count++;
                    }
                }
                if (selected_count <= 0) {
                    app.globalData.showToast("请选择商品");
                    return false;
                }

                // 进入订单确认页面
                var data = {
                    "buy_type": "cart",
                    "ids": ids.join(',')
                };
                uni.navigateTo({
                    url: '/pages/buy/buy?data=' + encodeURIComponent(JSON.stringify(data))
                });
            },

            // 展示型事件
            exhibition_submit_event(e) {
                app.globalData.call_tel(this.common_app_customer_service_tel);
            }
        }
    };
</script>
<style>
    @import './cart.css';
</style>
