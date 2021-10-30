<template>
    <view>
        <view v-if="(data_base || null) != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 轮播 -->
                <view v-if="slider.length > 0">
                    <component-banner :prop-data="slider" prop-size="mini"></component-banner>
                </view>
                
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
                        <component-countdown :prop-hour="time.hours" :prop-minute="time.minutes" :prop-second="time.seconds"></component-countdown>
                    </view>
                </view>

                <!-- 商品 -->
                <view v-if="goods.length > 0">
                    <view class="data-list oh">
                        <view v-for="(item, index) in goods" :key="index" class="item padding-main border-radius-main bg-white margin-bottom-main">
                            <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.id" hover-class="none">
                                <image :src="item.images" mode="aspectFit"></image>
                                <view class="margin-top-sm">
                                    <view class="multi-text">{{item.title}}</view>
                                    <view class="single-text margin-top-sm">
                                        <text v-if="time.status == 0 || time.status == 1" class="text-size-xs bg-red cr-white round padding-left-sm padding-right-sm padding-top-xs padding-bottom-xs">{{data_base.goods_detail_icon || '秒杀价'}}</text>
                                        <text class="sales-price va-m">{{currency_symbol}}{{item.min_price}}</text>
                                    </view>
                                </view>
                            </navigator>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data prop-status="0" prop-msg="没有相关商品"></component-no-data>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentBanner from "../../../../components/slider/slider";
    import componentCountdown from "../../../../components/countdown/countdown";
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                time: null,
                goods: [],
                slider: [],
                is_valid: 0,
                currency_symbol: app.globalData.data.currency_symbol
            };
        },

        components: {
            componentBanner,
            componentCountdown,
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad() {},

        onShow() {
            // 获取数据
            this.get_data();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        // 自定义分享
        onShareAppMessage() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.data_base.seo_title || this.data_base.application_name || '限时秒杀 - ' + app.globalData.data.application_title,
                desc: this.data_base.seo_desc || '限时秒杀 - ' + app.globalData.data.application_describe,
                path: '/pages/plugins/seckill/index/index?referrer=' + user_id
            };
        },
        
        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.data_base.seo_title || this.data_base.application_name || '限时秒杀 - ' + app.globalData.data.application_title,
                query: 'referrer=' + user_id,
                imageUrl: this.data_base.right_images || ''
            };
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "seckill"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                time: data.time || null,
                                goods: data.goods || [],
                                slider: data.slider || [],
                                is_valid: data.is_valid || 0,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: ((data.goods || null) != null && data.goods.length > 0)
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>