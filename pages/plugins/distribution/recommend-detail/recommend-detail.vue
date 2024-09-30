<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null" class="page-bottom-fixed">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 基础信息 -->
                <view class="base-container oh spacing-mb">
                    <image v-if="(data.icon || null) != null" class="dis-inline-block round br va-m margin-right-sm icon" :src="data.icon" mode="aspectFit"></image>
                    <view class="text-size cr-base fw dis-inline-block va-m title">{{ data.title }}</view>
                    <button class="round bg-white br-green cr-green fr share-submit" type="default" size="mini" hover-class="none" @tap="share_event" :data-index="index">
                        <view class="dis-inline-block va-m">
                            <uni-icons type="redo" size="34rpx" color="#1AAD19"></uni-icons>
                        </view>
                        <text class="va-m">{{$t('common.share')}}</text>
                    </button>
                </view>

                <view v-if="(data.detail_list || null) != null && data.detail_list.length > 0">
                    <!-- 商品 -->
                    <view class="data-list oh">
                        <view v-for="(item, index) in data.detail_list" :key="index" :class="'item padding-main border-radius-main bg-white oh pr spacing-mb ' + (item.goods.is_error == 0 ? '' : 'br-red')">
                            <image class="goods-img dis-block border-radius-main fl" :src="item.goods.images" mode="aspectFit" :data-value="item.goods.goods_url" @tap="url_event"></image>
                            <view class="right-base fr">
                                <label v-if="item.goods.is_error == 0" class="fr" :data-index="index" @tap="goods_choice_event">
                                    <radio :checked="item.checked == undefined || item.checked == true" style="transform: scale(0.9)" />
                                </label>
                                <view class="single-text padding-right">{{ item.goods.title }}</view>
                                <view class="single-text margin-top-lg">
                                    <text class="sales-price">{{ currency_symbol }}{{ item.goods.price }}</text>
                                    <text v-if="item.goods.original_price != 0" class="original-price margin-left-sm">{{ currency_symbol }}{{ item.goods.original_price }}</text>
                                    <text class="cr-grey text-size-xs fr">{{ item.goods.inventory }}{{ item.goods.inventory_unit }}</text>
                                </view>
                                <view class="margin-top-sm">
                                    <view v-if="item.goods.is_error == 0">
                                        <view v-if="(item.spec_text_view || null) != null" class="cr-grey text-size-xs spec-text">{{ item.spec_text_view }}</view>
                                        <view class="number-content tc oh round pa">
                                            <view class="number-submit tc cr-grey fl va-m" data-type="0" :data-index="index" @tap="goods_buy_number_event">-</view>
                                            <input class="tc cr-grey bg-white fl va-m radius-0" type="number" :value="item.stock || item.goods.buy_min_number || 1" :data-index="index" @blur="goods_buy_number_blur" />
                                            <view class="number-submit tc cr-grey fl va-m" data-type="1" :data-index="index" @tap="goods_buy_number_event">+</view>
                                        </view>
                                    </view>
                                    <view v-else class="cr-red text-size-xs tr margin-top-xxl">{{ item.goods.error_msg }}</view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 导航 -->
                    <view class="nav-button bg-white pf pa-w bottom-0 left-0 right-0 wh-auto">
                        <view class="padding-main">
                            <view class="oh">
                                <view class="left-price fl">
                                    <view class="sales-price single-text margin-top-sm">{{ currency_symbol }}{{ data.total_price }}</view>
                                </view>
                                <view class="right-button fr tr">
                                    <button type="default" size="mini" class="bg-main br-main cr-white round dis-block text-size-sm" @tap="buy_event">{{$t('detail.detail.27pmj3')}}</button>
                                </view>
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

            <!-- 分享弹窗 -->
            <component-share-popup ref="share"></component-share-popup>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

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
    import componentSharePopup from '@/components/share-popup/share-popup';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentSharePopup,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
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
                    url: app.globalData.get_request_url('detail', 'recommend', 'distribution'),
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
                                data: data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: (data || null) != null,
                            });

                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.title,
                                        desc: this.data.seo_desc || this.data.describe,
                                        path: '/pages/plugins/distribution/recommend-detail/recommend-detail',
                                        query: 'id=' + this.data.id,
                                        img: this.data.icon || '',
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
                var detail_list = temp_data.detail_list;
                detail_list[index]['checked'] = detail_list[index]['checked'] == undefined || detail_list[index]['checked'] == true ? false : true;
                temp_data['detail_list'] = detail_list;
                this.setData({ data: temp_data });

                // 导航总数处理
                this.nav_total_handle();
            },

            // 导航总数处理
            nav_total_handle() {
                var temp_data = this.data;
                var detail_list = temp_data.detail_list;
                var total_price = 0;
                for (var i in detail_list) {
                    if ((detail_list[i]['checked'] == undefined || detail_list[i]['checked'] == true) && detail_list[i]['goods']['is_error'] == 0) {
                        var stock = parseInt(detail_list[i]['stock'] || detail_list[i]['goods']['buy_min_number'] || 1);
                        total_price += parseFloat(detail_list[i]['goods']['price'] || 0) * stock;
                    }
                }
                temp_data['total_price'] = app.globalData.price_two_decimal(total_price);
                this.setData({ data: temp_data });
            },

            // 立即购买
            buy_event(e) {
                // 是否需要选择商品
                var type = parseInt(this.data.type || 0);
                var goods_data = [];
                var temp_goods = this.data.detail_list;
                for (var i in temp_goods) {
                    if (temp_goods[i]['goods']['is_error'] == 0 && (temp_goods[i]['checked'] == undefined || temp_goods[i]['checked'] == true)) {
                        goods_data.push({
                            goods_id: temp_goods[i]['goods']['id'],
                            stock: temp_goods[i]['stock'] || temp_goods[i]['goods']['buy_min_number'] || 1,
                            spec: temp_goods[i]['spec'] || '',
                        });
                    }
                }
                var buy_min_number = 1;
                if (goods_data.length < buy_min_number) {
                    app.globalData.showToast(this.$t('detail.detail.jsj3u8') + buy_min_number + this.$t('detail.detail.jksm81'));
                    return false;
                }

                // 进入订单确认页面
                var data = {
                    buy_type: 'goods',
                    goods_data: encodeURIComponent(base64.encode(JSON.stringify(goods_data))),
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },

            // 数量输入事件
            goods_buy_number_blur(e) {
                var index = e.currentTarget.dataset.index || 0;
                var temp_data = this.data;
                var detail_list = temp_data.detail_list;
                var item = detail_list[index];
                var goods = item['goods'];
                var number = parseInt(e.detail.value) || 1;
                if (isNaN(number)) {
                    number = goods['buy_min_number'] || 1;
                }
                this.goods_stock_handle(index, temp_data, detail_list, item, goods, number);
            },

            // 数量操作事件
            goods_buy_number_event(e) {
                var type = parseInt(e.currentTarget.dataset.type || 0);
                var index = e.currentTarget.dataset.index || 0;
                var temp_data = this.data;
                var detail_list = temp_data.detail_list;
                var item = detail_list[index];
                var goods = item['goods'];
                var temp_stock = parseInt(item['stock'] || goods['buy_min_number'] || 1);
                var number = type == 0 ? temp_stock - 1 : temp_stock + 1;
                this.goods_stock_handle(index, temp_data, detail_list, item, goods, number);
            },

            // 数量处理方法
            goods_stock_handle(index, temp_data, detail_list, item, goods, number) {
                var buy_min_number = parseInt(goods.buy_min_number || 1);
                var buy_max_number = parseInt(goods.buy_max_number || 0);
                var inventory = parseInt(goods.inventory || 0);
                var inventory_unit = goods.inventory_unit;

                // 最小起购数量
                if (buy_min_number > 0 && number < buy_min_number) {
                    number = buy_min_number;
                    app.globalData.showToast(this.$t('recommend-detail.recommend-detail.265vyu') + buy_min_number + inventory_unit);
                }

                // 最大购买数量
                if (buy_max_number > 0 && number > buy_max_number) {
                    number = buy_max_number;
                    app.globalData.showToast(this.$t('goods-category.goods-category.z1eh3v') + buy_max_number + inventory_unit);
                }

                // 是否超过库存数量
                if (number > inventory) {
                    number = inventory;
                    app.globalData.showToast(this.$t('recommend-detail.recommend-detail.2sis3v') + inventory + inventory_unit);
                }

                // 获取数据
                var data = this.params;
                data['id'] = goods.id;
                data['spec'] = item.spec || '';
                data['stock'] = number;
                uni.request({
                    url: app.globalData.get_request_url('stock', 'goods'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            // 基础数据
                            detail_list[index]['stock'] = number;
                            detail_list[index]['goods']['price'] = res.data.data.spec_base.price;
                            detail_list[index]['goods']['original_price'] = res.data.data.spec_base.original_price;
                            detail_list[index]['goods']['inventory'] = res.data.data.spec_base.inventory;
                            temp_data['detail_list'] = detail_list;
                            this.setData({
                                data: temp_data,
                            });

                            // 导航总数处理
                            this.nav_total_handle();
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 分享开启弹层
            share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info
                    });
                }
            },
        },
    };
</script>
<style>
    @import './recommend-detail.css';
</style>
