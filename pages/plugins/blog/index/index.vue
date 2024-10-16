<template>
    <view :class="theme_view">
        <view v-if="(data_base || null) != null" :class="(data_base || null) != null && (data_base.is_user_add_blog || 0) == 1 ? 'page-bottom-fixed' : ''">
            <!-- 搜索框 -->
            <view class="nav-search padding-main">
                <component-search propBrColor="#efefef" propBgColor="#fff" propUrl="/pages/plugins/blog/search/search"></component-search>
            </view>

            <!-- 轮播 -->
            <view v-if="slide_list.length > 0" class="padding-horizontal-main spacing-mb">
                <component-banner :propData="slide_list"></component-banner>
            </view>

            <!-- 分类导航 -->
            <view v-if="(data_base.is_home_category_main_nav || 0) == 1 && (category || null) != null && category.length > 0" class="nav-blog-category padding-horizontal-main oh">
                <block v-for="(item, index) in category" :key="index">
                    <view class="item oh padding-main margin-bottom-main radius bg-white bs-bb" :data-value="item.url" @tap="url_event">
                        <image v-if="(item.icon || null) != null" :src="item.icon" mode="aspectFill" class="fl icon radius"></image>
                        <view v-else class="fl radius icon-text tc">{{ item.name.substr(0, 1) }}</view>
                        <view class="fr right-base">
                            <view class="single-text cr-base">
                                <text class="fw">{{ item.name }}</text>
                                <text v-if="(item.blog_data || null) != null && item.blog_data.day_comments_count > 0" class="margin-left-sm cr-red fw">({{ item.blog_data.day_comments_count }})</text>
                            </view>
                            <view v-if="(item.blog_data || null) != null" class="single-text cr-grey text-size-xs">
                                <text>{{ blog_main_name }}: {{ item.blog_data.blog_count }}</text>
                                <text v-if="(data_base.is_blog_comments_show || 0) == 1" class="margin-left">{{ $t('index.index.lkld04') }}{{ item.blog_data.comments_count }}</text>
                                <text v-if="(data_base.is_blog_give_thumbs || 0) == 1" class="margin-left">{{ $t('index.index.r6vv25') }}{{ item.blog_data.give_thumbs_count }}</text>
                            </view>
                        </view>
                    </view>
                </block>
            </view>

            <!-- 分类 -->
            <view class="padding-horizontal-main">
                <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                    <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ $t('index.index.6rsqp1') }}{{ blog_main_name }}</text>
                    <text data-value="/pages/plugins/blog/search/search" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                </view>
            </view>

            <!-- 博文列表 -->
            <view v-if="data_list.length > 0" class="plugins-blog-list padding-horizontal-main">
                <view v-for="(item, index) in data_list" :key="index">
                    <view :data-value="item.url" @tap="url_event" class="item oh padding-main border-radius-main bg-white cp spacing-mb">
                        <image class="blog-img fl radius" :src="item.cover" mode="aspectFill"></image>
                        <view class="base fr">
                            <view class="single-text text-size">{{ item.title }}</view>
                            <view class="cr-grey margin-top-sm">{{ item.add_time_date_cn }}</view>
                            <view class="cr-base text-size-sm multi-text margin-top-sm">{{ item.describe }}</view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 热门博文-滚动 -->
            <view v-if="hot_list.length > 0" class="padding-horizontal-main spacing-mb">
                <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                    <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ $t('index.index.pot64x') }}{{ blog_main_name }}</text>
                    <text data-value="/pages/plugins/blog/search/search" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                </view>
                <view class="rolling-horizontal border-radius-main oh">
                    <view class="plugins-blog-rolling-list scroll-view-horizontal">
                        <swiper :vertical="false" :autoplay="(data_base.is_home_hot_auto_play || 0) == 1" :circular="false" :display-multiple-items="hot_list.length < 3 ? hot_list.length : 3" interval="3000">
                            <block v-for="(item, index) in hot_list" :key="index">
                                <swiper-item>
                                    <view :data-value="item.url" @tap="url_event" class="item bg-white border-radius-main margin-right-main oh pr ht-auto pr cp">
                                        <image class="blog-img dis-block wh-auto" :src="item.cover" mode="aspectFill"></image>
                                        <view class="blog-title pa single-text cr-white padding-horizontal-main padding-top-sm padding-bottom-sm">{{ item.title }}</view>
                                    </view>
                                </swiper-item>
                            </block>
                        </swiper>
                    </view>
                </view>
            </view>

            <!-- 推荐博文 -->
            <view v-if="right_list.length > 0" class="padding-horizontal-main spacing-mb">
                <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                    <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ $t('detail.detail.455787') }}{{ blog_main_name }}</text>
                    <text data-value="/pages/plugins/blog/search/search" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                </view>
                <view class="right-list padding-horizontal-main border-radius-main bg-white">
                    <block v-for="(item, index) in right_list" :key="index">
                        <view :data-value="item.url" @tap="url_event" :class="'item padding-vertical-main oh cp ' + (index > 0 ? 'br-t' : '')">
                            <view class="blog-title single-text fl">{{ item.title }}</view>
                            <text class="cr-grey fr">{{ $t('detail.detail.e6ga1y') }}{{ item.access_count }}{{ $t('buy.buy.0pgsrm') }}</text>
                        </view>
                    </block>
                </view>
            </view>

            <!-- 推荐商品 -->
            <view v-if="goods_list.length > 0" class="goods-list oh padding-horizontal-main">
                <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                    <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ $t('index.index.8t4j95') }}</text>
                    <text data-value="/pages/goods-search/goods-search" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                </view>
                <component-goods-list :propData="{ style_type: 1, goods_list: goods_list }" :propCurrencySymbol="currency_symbol"></component-goods-list>
            </view>

            <!-- 发布博文、我的博文入口 -->
            <view v-if="(data_base || null) != null && (data_base.is_user_add_blog || 0) == 1" class="bottom-fixed" :style="bottom_fixed_style">
                <view class="bottom-line-exclude">
                    <view class="item flex-row jc-sa align-c text-size fw-b br bg-white round padding-vertical">
                        <view data-value="/pages/plugins/blog/form/form" @tap="url_event" class="flex-1 tc flex-col jc-c align-c cp">
                            <view class="divider-r-d wh-auto"> <iconfont name="icon-edit-below-line" size="30rpx" color="#333" propClass="margin-right-sm"></iconfont>{{$t('detail.detail.fn3w01')}}{{ blog_main_name }}</view>
                        </view>
                        <view data-value="/pages/plugins/blog/user-list/user-list" @tap="url_event" class="flex-1 tc flex-col jc-c align-c cp">
                            <view class="wh-auto"> <iconfont name="icon-list-dot" size="32rpx" color="#333" propClass="margin-right-sm pr top-xs"></iconfont>{{$t('common.my')}}{{ blog_main_name }}</view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentSearch from '@/components/search/search';
    import componentBanner from '@/components/slider/slider';
    import componentCountdown from '@/components/countdown/countdown';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsList from '@/components/goods-list/goods-list';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.currency_symbol(),
                bottom_fixed_style: '',
                data_base: null,
                category: [],
                data_list: [],
                slide_list: [],
                goods_list: [],
                hot_list: [],
                right_list: [],
                blog_main_name: this.$t('detail.detail.e439j9'),
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentSearch,
            componentBanner,
            componentCountdown,
            componentNoData,
            componentBottomLine,
            componentGoodsList,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
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
                    url: app.globalData.get_request_url('index', 'index', 'blog'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
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
                                blog_main_name: (data.base || null) == null ? this.$t('detail.detail.e439j9') : data.base.blog_main_name || this.$t('detail.detail.e439j9'),
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true,
                            });

                            // 基础自定义分享
                            var title = this.data_base.seo_title || this.data_base.application_name;
                            this.setData({
                                share_info: {
                                    title: title,
                                    desc: this.data_base.seo_desc,
                                    path: '/pages/plugins/blog/index/index',
                                    img: (this.slide_list || null) != null && this.slide_list.length > 0 ? this.slide_list[0]['images_url'] : '',
                                },
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }

                        // 标题
                        uni.setNavigationBarTitle({ title: title });

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
        },
    };
</script>
<style>
    @import './index.css';
</style>
