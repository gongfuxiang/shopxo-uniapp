<template>
    <view>
        <view v-if="(data || null) != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 基础信息 -->
                <view class="base-container tc border-radius-main bg-main spacing-mb" :style="'background-color:'+data.color+' !important;'">
                    <image class="dis-block circle auto" :src="data.cover" mode="widthFix"></image>
                    <view class="cr-white margin-top-lg">{{data.describe}}</view>
                </view>

                <!-- 关键字 -->
                <view v-if="data.keywords_arr.length > 0" class="word-content scroll-view-horizontal margin-bottom-sm">
                    <scroll-view scroll-x>
                        <block v-for="(kv, ki) in data.keywords_arr" :key="ki">
                            <navigator :url="'/pages/goods-search/goods-search?keywords=' + kv" hover-class="none" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right">{{kv}}</navigator>
                        </block>
                    </scroll-view>
                </view>

                <!-- 推荐商品 -->
                <view v-if="(data.goods_list || null) != null && data.goods_list.length > 0">
                    <view class="spacing-nav-title">
                        <text class="text-wrapper">活动商品</text>
                        <text class="cr-grey text-size-xs margin-left-lg">{{data.vice_title}}</text>
                        <navigator url="/pages/plugins/activity/index/index" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多活动</navigator>
                    </view>
                    <view class="data-list oh">
                        <view v-for="(item, index) in data.goods_list" :key="index" class="item padding-bottom-sm border-radius-main bg-white margin-bottom-main">
                            <navigator :url="item.goods_url" hover-class="none">
                                <image class="goods-img dis-block" :src="item.images" mode="aspectFit"></image>
                                <view class="padding-horizontal-main margin-top-sm">
                                    <view class="multi-text">{{item.title}}</view>
                                    <view class="single-text margin-top-sm">
                                        <text v-if="(data_base.goods_detail_icon || null) != null" class="text-size-xs bg-red cr-white round padding-left-sm padding-right-sm padding-top-xs padding-bottom-xs" :style="'background-color:'+data.color+' !important;'">{{data_base.goods_detail_icon}}</text>
                                        <text class="sales-price va-m">{{currency_symbol}}{{item.min_price}}</text>
                                    </view>
                                </view>
                            </navigator>
                        </view>
                    </view>
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
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.data.currency_symbol,
                params: null,
                user: null,
                data_base: null,
                data: null,
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            //params['id'] = 1;
            this.setData({
                params: params
            });
        },

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
                    url: app.globalData.get_request_url("detail", "index", "activity"),
                    method: "POST",
                    data: {
                        id: this.params.id || 0
                    },
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: ((data.data || null) != null && (data.data.goods_list || null) != null && data.data.goods_list.length > 0)
                            });
                            
                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.title,
                                        desc: this.data.seo_desc || this.data.describe,
                                        path: '/pages/plugins/activity/detail/detail',
                                        query: 'id='+this.data.id,
                                        img: this.data.cover
                                    }
                                });

                                // 标题
                                if((this.data.title || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data.title
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
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './detail.css';
</style>