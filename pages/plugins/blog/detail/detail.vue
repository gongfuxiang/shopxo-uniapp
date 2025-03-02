<template>
    <view :class="theme_view">
        <view v-if="(info || null) != null" :class="(data_base || null) != null && (data_base.is_user_add_blog || 0) == 1 ? 'page-bottom-fixed' : ''">
            <view class="padding-main bg-white spacing-mb">
                <view class="spacing-mb">
                    <view class="fw-b text-size-xl">{{ info.title }}</view>
                    <view class="cr-grey-9 margin-top-lg oh br-t padding-top-main text-size-xs">
                        <view class="fl">
                            <text>{{ $t('article-detail.article-detail.728374') }}</text>
                            <text>{{ info.add_time }}</text>
                        </view>
                        <view class="fr">
                            <text class="margin-left-xxxl">{{ $t('article-detail.article-detail.j92ru0') }}</text>
                            <text>{{ info.access_count }}</text>
                        </view>
                    </view>
                </view>
                <view class="oh web-html-content spacing-mb">
                    <view v-if="(info.video_url || null) != null && ((info.is_live_play || 0) == 0 || client_type == 'weixin')">
                        <video :src="info.video_url" class="wh-auto" :autoplay="false" :controls="true"></video>
                    </view>
                    <mp-html :content="info.content" />
                </view>
                <!-- 评论内容 -->
                <component-blog-comments :propData="info" :propDataBase="data_base" :propEmojiList="emoji_list" :propShareInfo="share_info"></component-blog-comments>
            </view>

            <view class="padding-horizontal-main">
                <!-- 上一篇、下一篇 -->
                <view v-if="(last_next || null) != null" class="last-next-data spacing-mt margin-bottom-xxxl cr-grey-9">
                    <view v-if="(last_next.last || null) != null" class="flex-row">
                        <text>{{ $t('article-detail.article-detail.281s4a') }}</text>
                        <text :data-value="last_next.last.url" @tap="url_event" class="dis-inline-block flex-row flex-width single-text cp item">{{ last_next.last.title }}</text>
                    </view>
                    <view v-if="(last_next.next || null) != null" class="margin-top flex-row cr-main">
                        <text>{{ $t('article-detail.article-detail.uq5814') }}</text>
                        <text :data-value="last_next.next.url" @tap="url_event" class="dis-inline-block flex-row flex-width single-text cp item">{{ last_next.next.title }}</text>
                    </view>
                </view>
                <!-- 推荐博文 -->
                <view v-if="right_list.length > 0" class="plugins-blog-list">
                    <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                        <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ $t('detail.detail.455787') }}{{ blog_main_name }}</text>
                        <text data-value="/pages/plugins/blog/search/search" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                    </view>
                    <view v-for="(item, index) in right_list" :key="index">
                        <view :data-value="item.url" @tap="url_event" class="item oh padding-main border-radius-main bg-white spacing-mb cp">
                            <image class="blog-img fl radius" :src="item.cover" mode="aspectFill"></image>
                            <view class="base fr">
                                <view class="single-text">{{ item.title }}</view>
                                <view class="cr-grey margin-top-sm">{{ item.add_time_date_cn }}</view>
                                <view class="cr-grey multi-text margin-top-sm">{{ item.describe }}</view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 相关商品 -->
                <view v-if="(info.goods_list || null) != null && info.goods_list.length > 0">
                    <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                        <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{ $t('detail.detail.1j6yxy') }}</text>
                        <text data-value="/pages/goods-search/goods-search" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{ $t('common.more') }}</text>
                    </view>
                    <component-goods-list :propData="{ style_type: 1, goods_list: info.goods_list }" :propCurrencySymbol="currency_symbol"></component-goods-list>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>

        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

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

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentBlogComments from '../components/blog-comments/blog-comments';
    import componentGoodsList from '@/components/goods-list/goods-list';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                currency_symbol: app.globalData.currency_symbol(),
                client_type: app.globalData.application_client_type(),
                bottom_fixed_style: '',
                params: null,
                data_base: null,
                info: null,
                right_list: [],
                last_next: null,
                emoji_list: [],
                blog_main_name: this.$t('detail.detail.e439j9'),
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentBlogComments,
            componentGoodsList,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });

            // 初始化配置
            this.init_config();

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

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

            // 初始化
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'blog'),
                    method: 'POST',
                    data: {
                        id: this.params.id || 0,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        var data = res.data.data;
                        if (res.data.code == 0 && (data.data || null) != null) {
                            var info = data.data || null;
                            var base = data.base || null;
                            this.setData({
                                data_bottom_line_status: true,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                                data_base: base,
                                info: info,
                                right_list: data.right_list || [],
                                last_next: data.last_next || null,
                                emoji_list: data.emoji_list || [],
                                blog_main_name: base == null ? this.$t('detail.detail.e439j9') : (base.blog_main_name || this.$t('detail.detail.e439j9')),
                            });

                            if (info != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: info.seo_title || info.title,
                                        desc: info.seo_desc || info.describe,
                                        path: '/pages/plugins/blog/detail/detail',
                                        query: 'id=' + info.id,
                                        img: info.share_images || info.cover,
                                    },
                                });

                                // 标题
                                uni.setNavigationBarTitle({ title: info.title });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_list_loding_status: 2,
                        });
                    },
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style></style>
