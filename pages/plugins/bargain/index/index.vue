<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="bargain-index-page bg-grey-f5 padding-horizontal-main">
                <component-banner v-if="slider_list.length > 0" :propData="slider_list" propRadius="radius"></component-banner>

                <block v-if="data.length > 0">
                    <view class="bargain-goods-list">
                        <view v-for="(item, index) in data" :key="index" class="bargain-goods-card border-radius-main bg-white spacing-mb">
                            <view class="bargain-goods-main" :data-value="item.url" @tap="url_event">
                                <view class="bargain-goods-image-wrap bg-grey-f5 radius">
                                    <image class="bargain-goods-image" :src="item.images" mode="aspectFill"></image>
                                </view>
                                <view class="bargain-goods-body">
                                    <view class="multi-text cr-black">{{ item.bargain_title || item.title }}</view>
                                    <view class="bargain-goods-meta">
                                        <text class="bargain-tag br-main cr-main bg-white text-size-xs radius padding-horizontal-sm">{{ item.bargain_success_tag_text }}</text>
                                        <text class="bargain-success-text cr-main text-size-xs">{{ item.bargain_success_text }}</text>
                                    </view>
                                    <view class="bargain-goods-price-row">
                                        <view class="bargain-goods-price">
                                            <text v-if="item.is_show_original_price == 1" class="original-price">{{ currency_symbol }}{{ item.original_price }}</text>
                                            <view class="bargain-current-price cr-main fw-b">
                                                <text class="price-symbol text-size-xs">{{ currency_symbol }}</text>
                                                <text class="price-value text-size-lg">{{ item.bargain_price_text || item.bargain_price }}</text>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="bargain-goods-btn bg-main cr-white text-size-sm radius" :data-value="item.url" @tap="url_event">去砍价</view>
                        </view>
                    </view>
                </block>
                <block v-else>
                    <component-no-data propStatus="0" :propMsg="$t('detail.detail.5knxg6')"></component-no-data>
                </block>

                <component-bargain-play-rules v-if="data.length > 0" :propConfig="bargain_config" :propPlaySideNav="play_side_nav"></component-bargain-play-rules>
                <component-bottom-line v-if="data.length > 0" :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentBanner from '@/components/slider/slider';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentBargainPlayRules from '../components/bargain-play-rules/bargain-play-rules';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.currency_symbol(),
                data: [],
                slider_list: [],
                bargain_config: null,
                play_side_nav: [],
                data_base: null,
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentBanner,
            componentNoData,
            componentBottomLine,
            componentBargainPlayRules,
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
                    url: app.globalData.get_request_url('index', 'index', 'bargain'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data || [];
                            var slider_list = data.slider_list || [];
                            var data_base = data.data_base || null;
                            var nav_title = '砍价';
                            var share_img = '';
                            if (data_base != null) {
                                nav_title = data_base.application_name || nav_title;
                                if (slider_list.length > 0 && (slider_list[0].images_url || null) != null) {
                                    share_img = slider_list[0].images_url;
                                } else if (data_list.length > 0 && (data_list[0].images || null) != null) {
                                    share_img = data_list[0].images;
                                }
                            }
                            this.setData({
                                data: data_list,
                                slider_list: slider_list,
                                bargain_config: data.bargain_config || null,
                                play_side_nav: data.play_side_nav || [],
                                data_base: data_base,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                                data_bottom_line_status: data_list.length > 0,
                                share_info: {
                                    title: (data_base || {}).seo_title || nav_title,
                                    desc: (data_base || {}).seo_desc || '',
                                    path: '/pages/plugins/bargain/index/index',
                                    img: share_img,
                                },
                            });
                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style scoped>
    @import './index.css';
</style>
