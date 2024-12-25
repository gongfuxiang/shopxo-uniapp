<template>
    <view :class="theme_view">
        <view v-if="user_share_poster != null || user_share_qrode != null || user_share_url != null" class="padding-main">
            <!-- 海报 -->
            <view v-if="user_share_poster != null" class="share qrcode padding-main border-radius-main bg-white spacing-mb">
                <view class="title border-color-main padding-left-lg text-size fw-b">{{$t('poster.poster.rbdj4b')}}</view>
                <view class="cr-grey br-b padding-vertical-main">{{$t('poster.poster.m54q3e')}}</view>
                <view class="margin-top-lg">
                    <image :src="user_share_poster" class="wh-auto dis-block radius" mode="widthFix"></image>
                </view>
                <view class="submit-double oh margin-top-lg">
                    <button class="fl item bg-white cr-green br-green round" type="default" hover-class="none" size="mini" :data-value="user_share_poster" @tap="images_show_event">{{$t('poster.poster.b5i123')}}</button>
                    <view class="fr item">
                        <button class="bg-white cr-main br-main round" type="default" hover-class="none" size="mini" @tap="poster_refresh_event">{{$t('poster.poster.hk8c9p')}}</button>
                        <button class="fr bg-white cr-base br-base round" type="default" hover-class="none" size="mini" @tap="share_event">{{$t('common.share')}}</button>
                    </view>
                </view>
            </view>

            <!-- 二维码 -->
            <view v-if="user_share_qrode != null" class="share qrcode padding-main border-radius-main bg-white spacing-mb">
                <view class="title border-color-main padding-left-lg text-size fw-b">{{$t('poster.poster.9y4bwq')}}</view>
                <view class="cr-grey br-b padding-vertical-main">{{$t('poster.poster.h212v8')}}</view>
                <view class="margin-top-lg">
                    <image :src="user_share_qrode" class="wh-auto dis-block radius" mode="widthFix"></image>
                </view>
                <view class="margin-top-lg">
                    <button class="dis-block wh-auto bg-white cr-green br-green round" type="default" size="mini" hover-class="none" @tap="images_show_event" :data-value="user_share_qrode">{{$t('poster.poster.j3qv45')}}</button>
                </view>
            </view>

            <!-- 链接 -->
            <view v-if="user_share_url != null" class="share url padding-main border-radius-main bg-white spacing-mb">
                <view class="title border-color-main padding-left-lg text-size fw-b">{{$t('poster.poster.r534xd')}}</view>
                <view class="cr-grey br-b padding-vertical-main">{{$t('poster.poster.vn36y7')}}</view>
                <view class="cr-main text-size margin-top-lg">{{ user_share_url }}</view>
                <view class="margin-top-lg">
                    <button class="dis-block wh-auto bg-white cr-green br-green round" type="default" size="mini" hover-class="none" @tap="url_event" :data-value="user_share_url">{{$t('poster.poster.673605')}}</button>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 分享弹窗 -->
            <component-share-popup ref="share"></component-share-popup>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentSharePopup from "@/components/share-popup/share-popup";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: this.$t('common.loading_in_text'),
                data_bottom_line_status: false,
                user_share_poster: null,
                user_share_qrode: null,
                user_share_url: null,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentSharePopup
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 加载数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "poster", "distribution"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                user_share_poster: data.user_share_poster || null,
                                user_share_qrode: data.user_share_qrode || null,
                                user_share_url: data.user_share_url || null,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: "",
                            });

                            // 是否全部没数据
                            if (this.user_share_poster == null && this.user_share_qrode == null && this.user_share_url == null) {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_bottom_line_status: false,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "init")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 刷新海报
            poster_refresh_event(e) {
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url("refresh", "poster", "distribution"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                user_share_poster: res.data.data,
                            });
                            app.globalData.showToast(res.data.msg, "success");
                        } else {
                            if (app.globalData.is_login_check(res.data, self, "init")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 图片查看事件
            images_show_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value],
                    });
                } else {
                    app.globalData.showToast(this.$t('poster.poster.eu3j21'));
                }
            },

            // url事件
            url_event(e) {
                app.globalData.text_copy_event(e);
            },

            // 分享事件
            share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        type: 2,
                        images: this.user_share_poster || this.user_share_qrode
                    });
                }
            }
        },
    };
</script>
<style>
    @import "./poster.css";
</style>
