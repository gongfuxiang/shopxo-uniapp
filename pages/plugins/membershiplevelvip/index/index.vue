<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <view v-if="(data_base || null) != null" class="bg-white">
            <view class="pr wh-auto oh">
                <image :src="default_images_data.default_bg_images_app || membership_level_vip_static + 'bg.png'" mode="widthFix" class="vip-bg"></image>
                <view class="banner oh pa top-0 pa-w wh-auto head-top">
                    <view class="tc">
                        <image :src="default_images_data.default_logo_app || membership_level_vip_static + 'logo.png'" mode="widthFix" class="title-img"></image>
                        <!-- 标题 -->
                        <view v-if="(data_base.banner_top_title || null) != null" class="banner-title single-text text-size-lg margin-top-xxxl"> {{ data_base.banner_top_title }} </view>
                        <!-- 购买按钮 -->
                        <button data-value="/pages/plugins/membershiplevelvip/buy/buy" @tap="url_event" class="banner-buy fw-b round auto margin-top-xxxl" hover-class="none" :style="buy_vip_btn">
                            {{ data_base.banner_middle_name || $t('index.index.tbo22p') }}
                        </button>
                    </view>
                </view>
                <!-- 介绍列表 -->
                <view v-if="(introduce_data || null) != null && introduce_data.length > 0" class="data-list oh flex-row jc-sa align-c">
                    <block v-for="(item, index) in introduce_data" :key="index">
                        <view class="item tc bg-white">
                            <image class="dis-block auto" :src="item.images_url" mode="scaleToFill"></image>
                            <view class="single-text text-size margin-top-main">{{ item.name }}</view>
                            <view class="multi-text cr-grey-c text-size-xs margin-top-xs">{{ item.desc }}</view>
                        </view>
                    </block>
                </view>
                <!-- 富文本 -->
                <view v-if="(data_base.banner_bottom_content || null) != null" class="padding-main spacing-mt">
                    <view class="border-radius-main bg-white oh">
                        <mp-html :content="data_base.banner_bottom_content" />
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
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    let membership_level_vip_static = app.globalData.get_static_url('membershiplevelvip', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                membership_level_vip_static: membership_level_vip_static + 'app/index/',
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                introduce_data: [],
                data_base: null,
                default_images_data: {},
                buy_vip_btn: '',
                // 自定义分享信息
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentBottomLine,
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.init();
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
            init() {
                // 获取数据
                this.get_data();
            },

            // 获取数据
            get_data() {
                if (this.introduce_data.length <= 0) {
                    this.setData({
                        data_list_loding_status: 1,
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'membershiplevelvip'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var default_images_data = data.default_images_data || {};
                            this.setData({
                                data_base: data.base || null,
                                default_images_data: default_images_data,
                                introduce_data: data.introduce_data || [],
                                buy_vip_btn: 'background-image: url(' + (default_images_data.default_btn_bg_app || membership_level_vip_static+'app/index/btn.png')+') !important;',
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true,
                            });
                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/membershiplevelvip/index/index',
                                        img: this.default_images_data.default_logo_app || this.default_images_data.default_bg_images_app || '',
                                    },
                                });

                                // #ifndef MP-ALIPAY
                                // 导航名称
                                if ((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name,
                                    });
                                }
                                // #endif
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
                    },
                });
            },

            // 页面滚动监听
            onPageScroll(res) {
                uni.$emit('onPageScroll', res);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import './index.css';
</style>
