<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 基础信息 -->
                <view class="base-container tc pr padding-main border-radius-main bg-main oh spacing-mb" :style="'background-color:' + data.color + ' !important;background-image:url(' + (data.banner || data.cover) + ')'">
                    <view v-if="(data.describe || null) != null" class="text cr-white pa bs-bb text-size wh-auto ht-auto">{{ data.describe }}</view>
                </view>

                <!-- 关键字 -->
                <view v-if="data.keywords_arr.length > 0" class="word-content scroll-view-horizontal margin-bottom-sm">
                    <scroll-view scroll-x>
                        <block v-for="(kv, ki) in data.keywords_arr" :key="ki">
                            <text :data-value="'/pages/goods-search/goods-search?keywords=' + kv" @tap="url_event" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right cp">{{ kv }}</text>
                        </block>
                    </scroll-view>
                </view>

                <!-- 推荐商品 -->
                <view v-if="(data.goods_list || null) != null && data.goods_list.length > 0">
                    <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                        <view class="title-left">
                            <text class="text-wrapper title-left-border">{{$t('detail.detail.b4f3nw')}}</text>
                            <text class="vice-name margin-left-lg cr-grey">{{ data.vice_title }}</text>
                        </view>
                        <text data-value="/pages/plugins/activity/index/index" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{$t('detail.detail.ans2p4')}}</text>
                    </view>
                    <component-goods-list :propData="{ style_type: 1, goods_list: data.goods_list }" :propCurrencySymbol="currency_symbol"></component-goods-list>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data propStatus="0" :propMsg="$t('detail.detail.5knxg6')"></component-no-data>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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
    import componentCommon from '@/components/common/common';
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
            componentGoodsList,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
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
                    url: app.globalData.get_request_url('detail', 'index', 'activity'),
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
                                data_base: data.base || null,
                                data: data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: (data.data || null) != null && (data.data.goods_list || null) != null && data.data.goods_list.length > 0,
                            });

                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.title,
                                        desc: this.data.seo_desc || this.data.describe,
                                        path: '/pages/plugins/activity/detail/detail',
                                        query: 'id=' + this.data.id,
                                        img: this.data.share_images || this.data.cover,
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
            }
        },
    };
</script>
<style>
    @import './detail.css';
</style>
