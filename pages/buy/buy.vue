<template>
    <view>
        <block v-if="common_site_type == 1">
            <component-no-data prop-status="2" prop-msg="展示型不允许提交订单"></component-no-data>
        </block>
        <block v-else>
            <view v-if="goods_list.length > 0" class="page">
                <!-- 销售+自提 模式选择 -->
                <view v-if="common_site_type == 4" class="buy-header-nav oh tc">
                    <block v-for="(item, index) in buy_header_nav" :key="index">
                        <view :class="'item fl ' + (site_model == item.value ? 'cr-main' : 'cr-base')" :data-value="item.value" @tap="buy_header_nav_event">{{item.name}}</view>
                    </block>
                </view>

                <view class="padding-horizontal-main padding-top-main">
                    <!-- 地址 -->
                    <view v-if="common_site_type == 0 || common_site_type == 2 || common_site_type == 4" class="padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mb">
                        <view class="address arrow-right" @tap="address_event">
                            <view v-if="address != null" class="padding-bottom-main">
                                <view class="address-base">
                                    <text v-if="(address.alias || null) != null" class="address-alias br-main cr-main round margin-right-sm">{{address.alias}}</text>
                                    <text>{{address.name}}</text>
                                    <text class="fr">{{address.tel}}</text>
                                </view>
                                <view class="address-detail oh margin-top-lg">
                                    <image class="icon fl" :src="common_static_url+'map-icon.png'" mode="widthFix"></image>
                                    <view class="text fr">
                                        {{address.province_name || ''}}{{address.city_name || ''}}{{address.county_name || ''}}{{address.address || ''}}
                                    </view>
                                </view>
                            </view>
                            <view v-if="address == null" class="padding-top-xl padding-bottom-xxxl cr-gray">
                                {{(common_site_type == 0 || (common_site_type == 4 && site_model == 0)) ? '请选择收货地址' : '请选择取货地址'}}
                            </view>
                        </view>
                        <view class="address-divider spacing-mb"></view>
                    </view>

                    <!-- 商品数据 -->
                    <view v-for="(group, index) in goods_list" :key="index" class="goods-group-list padding-main border-radius-main bg-white spacing-mb">
                        <!-- 仓库分组 -->
                        <view class="goods-group-hd oh br-b padding-bottom-main">
                            <view class="fl" @tap="warehouse_group_event" :data-value="group.url || ''">
                                <image v-if="(group.icon || null) != null" class="goods-group-icon va-m margin-right-xs" :src="group.icon" mode="aspectFit"></image>
                                <text class="goods-group-title va-m">{{group.name}}</text>
                                <text v-if="(group.alias || null) != null" class="goods-group-alias va-m round margin-left-sm">{{group.alias}}</text>
                            </view>
                            <view v-if="(group.lng || 0) != 0 && (group.lat || 0) != 0" class="fr">
                                <view class="goods-group-map-submit br round" :data-index="index" @tap="map_event">查看地图</view>
                            </view>
                        </view>
                        <!-- 商品 -->
                        <view v-for="(item, index2) in group.goods_items" :key="index2" class="goods-item oh">
                            <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="goods-base">
                                <view class="goods-title multi-text">{{item.title}}</view>
                                <view v-if="item.spec != null" class="margin-top-xs cr-gray">
                                    <block v-for="(spec, si) in item.spec" :key="si">
                                        <text v-if="si > 0">;</text>
                                        <text>{{spec.value}}</text>
                                    </block>
                                </view>
                                <view class="oh pr margin-top-sm">
                                    <text class="fw-b">{{currency_symbol}}{{item.price}}</text>
                                    <text v-if="item.original_price > 0" class="original-price margin-left-sm">{{currency_symbol}}{{item.original_price}}</text>
                                    <text class="buy-number pa cr-gray">x{{item.stock}}</text>
                                </view>
                            </view>
                        </view>
                        <!-- 优惠劵 -->
                        <view v-if="(plugins_coupon_data || null) != null && (plugins_coupon_data[index] || null) != null && (plugins_coupon_data[index].coupon_data || null) != null && (plugins_coupon_data[index].coupon_data.coupon_list || null) != null && plugins_coupon_data[index].coupon_data.coupon_list.length > 0" class="plugins-coupon bg-white spacing-mb arrow-right" :data-index="index" @tap="plugins_coupon_open_event">
                            <text class="cr-base">优惠劵</text>
                            <text class="cr-grey fr">{{((plugins_choice_coupon_value || null) != null && (plugins_choice_coupon_value[group.id] || null) != null) ? plugins_choice_coupon_value[group.id] : '请选择优惠券'}}</text>
                        </view>
                        <!-- 扩展数据展示 -->
                        <view v-if="group.order_base.extension_data.length > 0" class="extension-list radius spacing-mb">
                            <view v-for="(item, index2) in group.order_base.extension_data" :key="index2" class="item oh padding-main">
                                <text class="cr-base fl">{{item.name}}</text>
                                <text class="text-tips fr">{{item.tips}}</text>
                            </view>
                        </view>
                        <!-- 小计 -->
                        <view class="oh tr goods-group-footer padding-top-main">
                            <text v-if="group.order_base.total_price != group.order_base.actual_price" class="original-price margin-right-sm">{{currency_symbol}}{{group.order_base.total_price}}</text>
                            <text class="sales-price">{{currency_symbol}}{{group.order_base.actual_price}}</text>
                        </view>
                    </view>

                    <!-- 留言 -->
                    <view class="content-textarea-container padding-main border-radius-main bg-white spacing-mb">
                        <textarea v-if="user_note_status" @blur="bind_user_note_blur_event" @input="bind_user_note_event" :focus="true" :disable-default-padding="false" :value="user_note_value" maxlength="60" placeholder="留言"></textarea>
                        <view v-else @tap="bind_user_note_tap_event" :class="(user_note_value || null) == null ? 'cr-gray' : ''">{{user_note_value || '留言'}}</view>
                    </view>

                    <!-- 积分 -->
                    <view v-if="(plugins_points_data || null) != null && (plugins_points_data.discount_price || 0) > 0" class="plugins-points-buy-container padding-main border-radius-main bg-white spacing-mb">
                        <view class="select oh">
                            <text v-if="plugins_points_data.discount_type == 1">使用{{plugins_points_data.use_integral}}个积分兑换商品</text>
                            <text v-else>使用积分{{plugins_points_data.use_integral}}个</text>
                            <text class="sales-price">-{{currency_symbol}}{{plugins_points_data.discount_price}}</text>
                            <view @tap="points_event" class="fr">
                                <image class="icon" :src="common_static_url+'select' + (plugins_points_status ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
                            </view>
                        </view>
                        <view class="desc">
                            <text v-if="plugins_points_data.discount_type == 1">你有积分{{plugins_points_data.user_integral}}个</text>
                            <text v-else>你有积分{{plugins_points_data.user_integral}}个，可用{{plugins_points_data.use_integral}}个</text>
                        </view>
                    </view>

                    <!-- 支付方式 -->
                    <view v-if="payment_list.length > 0 && common_order_is_booking != 1" class="payment-list padding-horizontal-main padding-top-main border-radius-main bg-white oh">
                        <view v-for="(item, index) in payment_list" :key="index" class="item tc fl margin-bottom-main">
                            <view :class="'item-content radius br ' + (item.selected || '')" :data-value="item.id" @tap="payment_event">
                                <image v-if="(item.logo || null) != null" class="icon margin-right-sm va-m" :src="item.logo" mode="widthFix"></image>
                                <text>{{item.name}}</text>
                            </view>
                        </view>
                    </view>
                </view>
                
                <!-- 导航 -->
                <view class="buy-nav oh wh-auto bg-white br-t">
                    <view class="nav-base fl single-text padding-left-main">
                        <text>合计：</text>
                        <text class="sales-price">{{currency_symbol}}{{total_price}}</text>
                    </view>
                    <view class="fr nav-submit padding-top padding-bottom padding-horizontal-main">
                        <button class="bg-main cr-white round text-size-lg" type="default" @tap="buy_submit_event" :disabled="buy_submit_disabled_status" hover-class="none">提交订单</button>
                    </view>
                </view>
            </view>

            <view v-if="goods_list.length == 0">
                <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
            </view>

            <!-- 优惠劵选择 -->
            <component-popup :prop-show="popup_plugins_coupon_status" prop-position="bottom" @onclose="plugins_coupon_close_event">
                <view class="plugins-coupon-popup bg-white">
                    <view class="close oh">
                        <view class="fr" @tap.stop="plugins_coupon_close_event">
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <view v-if="plugins_coupon_list.length > 0" class="coupon-container oh br-b">
                        <view class="not-use-tips tc">
                            <text @tap="plugins_coupon_not_use_event">不使用优惠劵</text>
                        </view>
                        <block v-for="(item, index) in plugins_coupon_list" :key="index">
                            <view :class="'item spacing-mt bg-white radius ' + ((item.is_active || 0) == 1 ? 'item-disabled' : '')" :style="'border:1px solid ' + item.coupon.bg_color_value + ';'">
                                <view class="v-left fl">
                                    <view class="base single-text" :style="'color:' + item.coupon.bg_color_value + ';'">
                                        <text v-if="item.coupon.type == 0" class="symbol">{{currency_symbol}}</text>
                                        <text class="price">{{item.coupon.discount_value}}</text>
                                        <text class="unit">{{item.coupon.type_unit}}</text>
                                        <text v-if="(item.coupon.desc || null) != null" class="desc cr-gray">{{item.coupon.desc}}</text>
                                    </view>
                                    <view v-if="(item.coupon.use_limit_type_name || null) != null" class="base-tips cr-base single-text">{{item.coupon.use_limit_type_name}}</view>
                                    <view class="base-time cr-gray single-text">{{item.time_start_text}} 至 {{item.time_end_text}}</view>
                                </view>
                                <view class="v-right fr" :style="'background:' + item.coupon.bg_color_value + ';'" :data-index="index" :data-value="item.id" @tap="plugins_coupon_use_event">
                                    <text class="circle"></text>
                                    <text>{{(item.is_active || 0) == 1 ? '已选' : '选择'}}</text>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </component-popup>
        </block>

        <!-- 快捷导航 -->
        <component-quick-nav></component-quick-nav>
    </view>
</template>
<script>
    const app = getApp();
    import componentQuickNav from "../../components/quick-nav/quick-nav";
    import componentPopup from "../../components/popup/popup";
    import componentNoData from "../../components/no-data/no-data";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                buy_submit_disabled_status: false,
                data_list_loding_msg: '',
                params: null,
                payment_list: [],
                goods_list: [],
                address: null,
                address_id: null,
                total_price: 0,
                user_note_value: '',
                user_note_status: false,
                is_first: 1,
                extension_data: [],
                payment_id: 0,
                common_site_type: 0,
                extraction_address: [],
                site_model: 0,
                buy_header_nav: [
                    { name: "快递邮寄", value: 0 },
                    { name: "自提点取货", value: 2 }
                ],
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                common_order_is_booking: 0,
                // 优惠劵
                plugins_coupon_data: null,
                plugins_coupon_list: [],
                plugins_use_coupon_ids: [],
                plugins_choice_coupon_value: [],
                popup_plugins_coupon_status: false,
                popup_plugins_coupon_index: null,
                // 积分
                plugins_points_data: null,
                plugins_points_status: false
            };
        },

        components: {
            componentQuickNav,
            componentPopup,
            componentNoData
        },
        props: {},

        onLoad(params) {
            //params['data'] = '{"buy_type":"goods","goods_id":"1","stock":"1","spec":"[]"}';
            if ((params.data || null) != null && app.globalData.get_length(JSON.parse(decodeURIComponent(params.data))) > 0) {
                this.setData({
                    params: JSON.parse(decodeURIComponent(params.data))
                });

                // 删除地址缓存
                uni.removeStorageSync(app.globalData.data.cache_buy_user_address_select_key);
            }
        },

        onShow() {
            // 数据加载
            this.init();
            this.setData({
                is_first: 0
            });

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
                        common_order_is_booking: app.globalData.get_config('config.common_order_is_booking')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                // 订单参数信息是否正确
                if (this.params == null) {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '订单信息有误'
                    });
                    uni.stopPullDownRefresh();
                    return false;
                }

                // 本地缓存地址
                if (this.is_first == 0) {
                    var cache_address = uni.getStorageSync(app.globalData.data.cache_buy_user_address_select_key);
                    if ((cache_address || null) != null) {
                        this.setData({
                            address: cache_address,
                            address_id: cache_address.id
                        });
                    }
                }

                // 加载loding
                uni.showLoading({
                    title: '加载中...'
                });
                this.setData({
                    data_list_loding_status: 1
                });
                var data = this.params;
                data['address_id'] = this.address_id;
                data['payment_id'] = this.payment_id;
                data['site_model'] = this.site_model;
                uni.request({
                    url: app.globalData.get_request_url("index", "buy"),
                    method: "POST",
                    data: this.request_data_ext_params_merge(data),
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var data = res.data.data;

                            if (data.goods_list.length == 0) {
                                this.setData({
                                    data_list_loding_status: 0
                                });
                            } else {
                                this.setData({
                                    goods_list: data.goods_list,
                                    total_price: data.base.actual_price,
                                    extension_data: data.extension_data || [],
                                    data_list_loding_status: 3,
                                    common_site_type: data.common_site_type || 0,
                                    extraction_address: data.base.extraction_address || [],
                                    plugins_coupon_data: data.plugins_coupon_data || null,
                                    plugins_points_data: data.plugins_points_data || null
                                });

                                // 优惠劵选择处理
                                if ((data.plugins_coupon_data || null) != null) {
                                    var plugins_choice_coupon_value = [];
                                    for (var i in data.plugins_coupon_data) {
                                        var cupk = data.plugins_coupon_data[i]['warehouse_id'];

                                        if ((data.plugins_coupon_data[i]['coupon_data']['coupon_choice'] || null) != null) {
                                            plugins_choice_coupon_value[cupk] = data.plugins_coupon_data[i]['coupon_data']['coupon_choice']['coupon']['desc'];
                                        } else {
                                            var coupon_count = (data.plugins_coupon_data[i]['coupon_data']['coupon_list'] || null) != null ? data.plugins_coupon_data[i]['coupon_data'].coupon_list.length : 0;
                                            plugins_choice_coupon_value[cupk] = coupon_count > 0 ? '可选优惠劵' +coupon_count + '张' : '暂无可用优惠劵';
                                        }
                                    }

                                    this.setData({
                                        plugins_choice_coupon_value: plugins_choice_coupon_value
                                    });
                                }

                                // 地址
                                this.setData({
                                    address: data.base.address || null,
                                    address_id: (data.base.address || null) != null ? data.base.address.id : null
                                });
                                uni.setStorage({
                                    key: app.globalData.data.cache_buy_user_address_select_key,
                                    data: data.base.address || null
                                });

                                // 支付方式
                                this.payment_list_data(data.payment_list);
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 请求参数合并
            request_data_ext_params_merge(data) {
                // 优惠券
                var coupon_ids = this.plugins_use_coupon_ids;
                if ((coupon_ids || null) != null && coupon_ids.length > 0) {
                    for (var i in coupon_ids) {
                        data['coupon_id_' + i] = coupon_ids[i];
                    }
                }
                
                // 积分
                data['is_points'] = this.plugins_points_status === true ? 1 : 0;
                return data;
            },

            // 用户留言输入事件
            bind_user_note_event(e) {
                this.setData({
                    user_note_value: e.detail.value
                });
            },

            // 用户留言点击
            bind_user_note_tap_event(e) {
                this.setData({
                    user_note_status: true
                });
            },

            // 用户留言失去焦点
            bind_user_note_blur_event(e) {
                this.setData({
                    user_note_status: false
                });
            },

            // 提交订单
            buy_submit_event(e) {
                // 表单数据
                var data = this.params;
                data['address_id'] = this.address_id;
                data['payment_id'] = this.payment_id;
                data['user_note'] = this.user_note_value;
                data['site_model'] = this.site_model;

                // 数据验证
                var validation = [];
                if (this.common_site_type == 0 || this.common_site_type == 2 || this.common_site_type == 4) {
                    validation.push({
                        fields: 'address_id',
                        msg: '请选择地址',
                        is_can_zero: 1
                    });
                }

                if (this.common_order_is_booking != 1) {
                    validation.push({
                        fields: 'payment_id',
                        msg: '请选择支付方式'
                    });
                }

                if (app.globalData.fields_check(data, validation)) {
                    // 加载loding
                    uni.showLoading({
                        title: '提交中...'
                    });
                    this.setData({
                        buy_submit_disabled_status: true
                    });
                    uni.request({
                        url: app.globalData.get_request_url("add", "buy"),
                        method: "POST",
                        data: this.request_data_ext_params_merge(data),
                        dataType: "json",
                        success: res => {
                            uni.hideLoading();

                            if (res.data.code == 0) {
                                if (res.data.data.order_status == 1) {
                                    uni.redirectTo({
                                        url: '/pages/user-order/user-order?is_pay=1&order_ids=' + res.data.data.order_ids.join(',')
                                    });
                                } else {
                                    uni.redirectTo({
                                        url: '/pages/user-order/user-order'
                                    });
                                }
                            } else {
                                app.globalData.showToast(res.data.msg);
                                this.setData({
                                    buy_submit_disabled_status: false
                                });
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                buy_submit_disabled_status: false
                            });
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },

            // 支付方式选择
            payment_event(e) {
                this.setData({
                    payment_id: e.currentTarget.dataset.value
                });
                this.payment_list_data(this.payment_list);
                this.init();
            },

            // 支付方式数据处理
            payment_list_data(data) {
                if (this.payment_id != 0) {
                    for (var i in data) {
                        data[i]['selected'] = (data[i]['id'] == this.payment_id) ? 'cr-main br-main' : '';
                    }
                }
                this.setData({
                    payment_list: data || []
                });
            },

            // 优惠劵弹层开启
            plugins_coupon_open_event(e) {
                var index = e.currentTarget.dataset.index;
                var temp_list = this.plugins_coupon_data[index]['coupon_data']['coupon_list'];
                // 选中处理
                if(temp_list.length > 0) {
                    var temp_ids = this.plugins_use_coupon_ids;
                    for(var i in temp_list) {
                        temp_list[i]['is_active'] = (temp_ids.indexOf(temp_list[i]['id']) != -1) ? 1 : 0;
                    }
                }
                this.setData({
                    plugins_coupon_list: temp_list,
                    popup_plugins_coupon_status: true,
                    popup_plugins_coupon_index: index
                });
            },

            // 优惠劵弹层关闭
            plugins_coupon_close_event(e) {
                this.setData({
                    popup_plugins_coupon_status: false
                });
            },

            // 优惠劵选择
            plugins_coupon_use_event(e) {
                var index = e.currentTarget.dataset.index;
                var value = e.currentTarget.dataset.value;
                var temp_ids = this.plugins_use_coupon_ids;
                if(this.popup_plugins_coupon_index !== null && temp_ids.indexOf(value) == -1) {
                    var temp_data = this.plugins_coupon_data[this.popup_plugins_coupon_index];
                    var temp_list = this.plugins_coupon_list;

                    // 选中处理
                    for(var i in temp_list) {
                        temp_list[i]['is_active'] = (index == i) ? 1 : 0;
                    }
                    
                    // 根据仓库id和优惠券id记录
                    temp_ids[temp_data['warehouse_id']] = value;
                    this.setData({
                        plugins_use_coupon_ids: temp_ids,
                        plugins_coupon_list: temp_list,
                        popup_plugins_coupon_status: false
                    });

                    // 重新获取数据
                    this.init();
                }
            },

            // 不使用优惠劵
            plugins_coupon_not_use_event(e) {
                if(this.popup_plugins_coupon_index !== null) {
                    var temp_data = this.plugins_coupon_data[this.popup_plugins_coupon_index];
                    var temp_list = this.plugins_coupon_list;
                    var temp = this.plugins_use_coupon_ids;
                    for(var i in temp_list) {
                        temp_list[i]['is_active'] = 0;
                    }
                    temp[temp_data['warehouse_id']] = 0;
                    this.setData({
                        plugins_coupon_list: temp_list,
                        plugins_use_coupon_ids: temp,
                        popup_plugins_coupon_status: false
                    });
                    this.init();
                }
            },

            // 地址选择事件
            address_event(e) {
                if (this.common_site_type == 0 || this.common_site_type == 4 && this.site_model == 0) {
                    uni.navigateTo({
                        url: '/pages/user-address/user-address?is_back=1'
                    });
                } else if (this.common_site_type == 2 || this.common_site_type == 4 && this.site_model == 2) {
                    uni.navigateTo({
                        url: '/pages/extraction-address/extraction-address?is_back=1&is_buy=1'
                    });
                } else {
                    app.globalData.showToast('当前模式不允许使用地址');
                }
            },

            // 销售+自提 模式选择事件
            buy_header_nav_event(e) {
                var value = e.currentTarget.dataset.value || 0;
                if (value != this.site_model) {
                    // 数据设置
                    this.setData({
                        address: null,
                        address_id: null,
                        site_model: value
                    });

                    // 删除地址缓存
                    uni.removeStorageSync(app.globalData.data.cache_buy_user_address_select_key);
                    
                    // 数据初始化
                    this.init();
                }
            },

            // 地图查看
            map_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.goods_list[index] || null;
                if (data == null) {
                    app.globalData.showToast("地址有误");
                    return false;
                }

                // 打开地图
                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            },

            // 积分选择事件
            points_event(e) {
                this.setData({
                    plugins_points_status: !this.plugins_points_status
                });
                this.init();
            },

            // 仓库事件
            warehouse_group_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './buy.css';
</style>