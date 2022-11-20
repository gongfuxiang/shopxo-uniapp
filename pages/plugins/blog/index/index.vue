<template>
    <view>
        <view v-if="(data_base || null) != null">
            <!-- 搜索框 -->
            <view class="nav-search padding-horizontal-main padding-top-main">
                <component-search propBrColor="#efefef" propBgColor="#fff" propUrl="/pages/plugins/blog/search/search"></component-search>
            </view>

            <!-- 轮播 -->
            <view v-if="slide_list.length > 0" class="padding-horizontal-main padding-top-main">
                <component-banner :propData="slide_list"></component-banner>
            </view>

            <!-- 分类 -->
            <view class="spacing-nav-title padding-horizontal-main">
                <text class="text-wrapper va-m">所有博文</text>
                <scroll-view v-if="(category || null) != null && category.length > 0" class="nav-list scroll-view-horizontal dis-inline-block oh va-m margin-left-sm" scroll-x="true">
                    <block v-for="(item, index) in category" :key="index">
                        <view class="item cr-base dis-inline-block padding-horizontal-main" :data-value="item.url" @tap="url_event">{{item.name}}</view>
                    </block>
                </scroll-view>
            </view>

            <!-- 博文列表 -->
            <view v-if="data_list.length > 0" class="plugins-blog-list padding-horizontal-main">
                <view v-for="(item, index) in data_list" class="item oh padding-main border-radius-main bg-white spacing-mb">
                    <navigator :url="item.url" hover-class="none">
                        <image class="blog-img fl radius" :src="item.cover" mode="aspectFill"></image>
                        <view class="base fr">
                            <view class="single-text text-size">{{item.title}}</view>
                            <view class="cr-grey margin-top-sm">{{item.add_time_date_cn}}</view>
                            <view class="cr-base text-size-sm multi-text margin-top-sm">{{item.describe}}</view>
                        </view>
                    </navigator>
                </view>
            </view>

            <!-- 热门博文-滚动 -->
            <view v-if="hot_list.length > 0" class="padding-horizontal-main spacing-mb">
                <view class="spacing-nav-title">
                    <text class="text-wrapper">热门博文</text>
                    <navigator url="/pages/plugins/blog/search/search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                </view>
                <view class="rolling-horizontal border-radius-main oh">
                    <view class="plugins-blog-rolling-list scroll-view-horizontal">
                        <swiper :vertical="false" :autoplay="(data_base.is_home_hot_auto_play || 0) == 1" :circular="false" :display-multiple-items="hot_list.length < 3 ? hot_list.length : 3" interval="3000">
                            <block v-for="(item, index) in hot_list" :key="index">
                                <swiper-item>
                                    <view class="item bg-white border-radius-main margin-right-main oh pr ht-auto pr">
                                        <navigator :url="item.url" hover-class="none">
                                            <image class="blog-img dis-block wh-auto" :src="item.cover" mode="aspectFill"></image>
                                            <view class="blog-title pa single-text cr-white padding-horizontal-main padding-top-sm padding-bottom-sm">{{item.title}}</view>
                                        </navigator>
                                    </view>
                                </swiper-item>
                            </block>
                        </swiper>
                    </view>
                </view>
            </view>
            
            <!-- 推荐博文 -->
            <view v-if="right_list.length > 0" class="padding-horizontal-main spacing-mb">
                <view class="spacing-nav-title">
                    <text class="text-wrapper">推荐博文</text>
                    <navigator url="/pages/plugins/blog/search/search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                </view>
                <view class="right-list padding-horizontal-main border-radius-main bg-white">
                    <block v-for="(item, index) in right_list" :key="index">
                        <view :class="'item padding-vertical-main oh '+(index > 0 ? 'br-t' : '')">
                            <navigator :url="item.url" hover-class="none">
                                <view class="blog-title single-text fl">{{item.title}}</view>
                                <text class="cr-grey fr">浏览{{item.access_count}}次</text>
                            </navigator>
                        </view>
                    </block>
                </view>
            </view>

            <!-- 推荐商品 -->
            <view v-if="goods_list.length > 0" class="goods-list oh padding-horizontal-main">
                <view class="spacing-nav-title">
                    <text class="text-wrapper">推荐商品</text>
                    <navigator url="/pages/goods-search/goods-search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                </view>
                <view class="goods-list oh">
                    <view v-for="(item, index) in goods_list" :key="index" class="item padding-bottom-sm border-radius-main bg-white margin-bottom-main oh">
                        <navigator :url="item.goods_url" hover-class="none">
                            <image class="goods-img dis-block" :src="item.images" mode="aspectFit"></image>
                            <view class="base padding-horizontal-main margin-top-sm">
                                <view class="multi-text">{{item.title}}</view>
                                <view class="price margin-top">
                                    <text class="sales-price">{{currency_symbol}}{{item.min_price}}</text>
                                </view>
                            </view>
                        </navigator>
                    </view>
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
    import componentSearch from "../../../../components/search/search";
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
                currency_symbol: app.globalData.data.currency_symbol,
                data_base:  null,
                category: [],
                data_list: [],
                slide_list: [],
                goods_list: [],
                hot_list: [],
                right_list: [],
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentSearch,
            componentBanner,
            componentCountdown,
            componentNoData,
            componentBottomLine
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
                    url: app.globalData.get_request_url("index", "index", "blog"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                category: data.category || [],
                                data_list: data.data_list || [],
                                slide_list: data.slide_list || [],
                                goods_list: data.goods_list || [],
                                hot_list: data.hot_list || [],
                                right_list: data.right_list || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });

                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.data_base.seo_title || this.data_base.application_name,
                                    desc: this.data_base.seo_desc,
                                    path: '/pages/plugins/blog/index/index',
                                    img: ((this.slide_list || null) != null && this.slide_list.length > 0) ? this.slide_list[0]['images_url'] : ''
                                }
                            });
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
            },
            
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>