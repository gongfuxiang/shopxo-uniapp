<template>
    <view>        
        <view v-if="(data || null) != null" class="padding-horizontal-main padding-top-main">
            <view class="padding-main border-radius-main bg-white spacing-mb">
                <view class="fw-b text-size-xl">{{data.title}}</view>
                <view class="cr-grey margin-top-lg oh br-t padding-top-main">
                    <view class="fl">
                        <text>时间：</text>
                        <text>{{data.add_time}}</text>
                    </view>
                    <view class="fr">
                        <text class="margin-left-xxxl">浏览：</text>
                        <text>{{data.access_count}}</text>
                    </view>
                </view>
            </view>
            <view class="padding-main border-radius-main bg-white oh spacing-mb">
                <mp-html :content="data.content" />
            </view>
            
            <!-- 推荐博文 -->
            <view v-if="right_list.length > 0" class="plugins-blog-list">
                <view class="spacing-nav-title">
                    <text class="text-wrapper">推荐博文</text>
                    <navigator url="/pages/plugins/blog/search/search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                </view>
                <view v-for="(item, index) in right_list" class="item oh padding-main border-radius-main bg-white spacing-mb">
                    <navigator :url="item.url" hover-class="none">
                        <image class="blog-img fl radius" :src="item.cover" mode="aspectFill"></image>
                        <view class="base fr">
                            <view class="single-text">{{item.title}}</view>
                            <view class="cr-gray margin-top-sm">{{item.add_time_date_cn}}</view>
                            <view class="cr-grey multi-text margin-top-sm">{{item.describe}}</view>
                        </view>
                    </navigator>
                </view>
            </view>
            
            <!-- 相关商品 -->
            <view v-if="(data.goods_list || null) != null && data.goods_list.length > 0" class="goods-list oh">
                <view class="spacing-nav-title">
                    <text class="text-wrapper">相关商品</text>
                    <navigator url="/pages/goods-search/goods-search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                </view>
                <view class="goods-list oh">
                    <view v-for="(item, index) in data.goods_list" :key="index" class="item padding-bottom-sm border-radius-main bg-white margin-bottom-main oh">
                        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.id" hover-class="none">
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
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                currency_symbol: app.globalData.data.currency_symbol,
                params: null,
                data_base: null,
                data: null,
                right_list: [],
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
            this.setData({
                params: params
            });

            // 初始化配置
            this.init_config();

            // 数据加载
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

            // 初始化
            get_data() {
                uni.showLoading({
                    title: "加载中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "index", "blog"),
                    method: "POST",
                    data: {
                        id: this.params.id || 0,
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        var data = res.data.data;
                        if (res.data.code == 0 && (data.data || null) != null) {
                            var blog = data.data;
                            this.setData({
                                data_bottom_line_status: true,
                                data_list_loding_status: 3,
                                data_base: data.base || null,
                                data: blog,
                                right_list: data.right_list || []
                            });

                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.data.seo_title || this.data.title,
                                    desc: this.data.seo_desc || this.data.describe,
                                    path: '/pages/plugins/blog/detail/detail',
                                    query: 'id='+this.data.id,
                                    img: this.data.cover
                                }
                            });

                            // 标题
                            uni.setNavigationBarTitle({title: this.data.title});
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.showToast(res.data.msg);
                        }

                        // 显示分享菜单
                        app.globalData.show_share_menu();
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2
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