<template>
    <view>
        <view v-if="(data_base || null) != null" :style="seckill_bg">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 公告信息 -->
                <view v-if="(data_base.content_notice || null) != null && data_base.content_notice.length > 0" class="spacing-mb">
                    <view class="notice-content">
                        <view v-for="(item, index) in data_base.content_notice" :key="index" class="item">{{item}}</view>
                    </view>
                </view>

                <!-- 基础信息、倒计时 -->
                <view class="oh spacing-mb">
                    <text :class="'va-m '+(is_valid == 1 ? 'cr-base' : 'cr-red')">{{time.msg}}</text>
                    <view v-if="is_valid == 1" class="dis-inline-block va-m margin-left-sm">
                        <component-countdown :propHour="time.hours" :propMinute="time.minutes" :propSecond="time.seconds"></component-countdown>
                    </view>
                </view>

                <!-- 商品 -->
                <view v-if="goods.length > 0">
                    <component-goods-list :propData="{style_type: 1, goods_list: goods}" :propCurrencySymbol="currency_symbol" :propIsShowPriceIcon="true" propPriceField="seckill_min_price"></component-goods-list>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data propStatus="0" propMsg="没有相关商品"></component-no-data>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentCountdown from "../../../../components/countdown/countdown";
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";
    import componentGoodsList from "../../../../components/goods-list/goods-list";

    var seckill_static_url = app.globalData.get_static_url('seckill', true);
    export default {
        data() {
            return {
                seckill_bg: 'background: url('+seckill_static_url+'header-bg.png) top/100% no-repeat;',
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.data.currency_symbol,
                data_base: null,
                current: null,
                time: null,
                goods: [],
                is_valid: 0,
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentCountdown,
            componentNoData,
            componentBottomLine,
            componentGoodsList
        },
        props: {},

        onLoad() {},

        onShow() {
            // 初始化配置
            this.init_config();

            // 获取数据
            this.get_data();
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
                    url: app.globalData.get_request_url("index", "index", "seckill"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_base = data.config || null;
                            var current = data.current || null;
                            var time = (current == null) ? null : current.time || null;
                            var goods = (current == null) ? [] : (current.goods || []);
                            var is_valid = (time == null) ? 0 : (time.status == 1 ? 1 : 0);
                            if(goods.length > 0) {
                                for(var i in goods) {
                                    goods[i]['price_icon'] = (is_valid == 1) ? (current.goods_detail_icon || '秒杀价') : '';
                                }
                            }
                            this.setData({
                                data_base: data_base,
                                current: current,
                                time: time,
                                goods: goods,
                                is_valid: is_valid,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: (goods.length > 0)
                            });

                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/seckill/index/index',
                                        img: ((this.slider || null) != null && this.slider.length > 0) ? this.slider[0]['images_url'] : ''
                                    }
                                });

                                // 导航名称
                                if((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
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
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            }
        }
    };
</script>
<style>
</style>