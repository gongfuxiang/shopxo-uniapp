<template>
    <view :class="theme_view">
        <view v-if="user_share_qrode != null || user_share_url != null" class="padding-main">
            <!-- 二维码 -->
            <view v-if="user_share_qrode != null" class="share qrcode padding-main border-radius-main bg-white spacing-mb">
                <view class="title border-color-main padding-left-lg text-size fw-b">二维码分享</view>
                <view class="cr-grey br-b padding-vertical-main"> 保存二维码后，发送给微信好友/群、QQ好友/群，分享到分朋友圈，微博等进行推广，轻轻松松赚返利！ </view>
                <view class="margin-top-lg">
                    <image :src="user_share_qrode" class="wh-auto dis-block radius" mode="widthFix"></image>
                </view>
                <view class="margin-top-lg">
                    <button class="dis-block wh-auto bg-white cr-green br-green round" type="default" size="mini" hover-class="none" @tap="images_show_event" :data-value="user_share_qrode">查看二维码长按保存</button>
                </view>
            </view>

            <!-- 链接 -->
            <view v-if="user_share_url != null" class="share url padding-main border-radius-main bg-white spacing-mb">
                <view class="title border-color-main padding-left-lg text-size fw-b">链接分享</view>
                <view class="cr-grey br-b padding-vertical-main"> 复制以下链接，发送给微信好友/群、QQ好友/群，分享到分朋友圈，微博等进行推广，轻轻松松赚返利！ </view>
                <view class="cr-main text-size margin-top-lg">{{ user_share_url }}</view>
                <view class="margin-top-lg">
                    <button class="dis-block wh-auto bg-white cr-green br-green round" type="default" size="mini" hover-class="none" @tap="url_event" :data-value="user_share_url">点击复制链接地址</button>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
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
            theme_view: app.globalData.get_theme_value_view(),
            data_list_loding_status: 1,
            data_list_loding_msg: "加载中...",
            data_bottom_line_status: false,
            user_share_qrode: null,
            user_share_url: null,
        };
    },

    components: {
        componentNoData,
        componentBottomLine,
    },
    props: {},

    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);

        // 加载数据
        this.init();
    },

    onShow() {
        // 调用公共事件方法
        app.globalData.page_event_onshow_handle();

        // 分享菜单处理
        app.globalData.page_share_handle();
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.init();
    },

    methods: {
        init() {
            uni.showLoading({
                title: "加载中...",
            });
            this.setData({
                data_list_loding_status: 1,
            });
            uni.request({
                url: app.globalData.get_request_url("index", "poster", "membershiplevelvip"),
                method: "POST",
                data: {},
                dataType: "json",
                success: (res) => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        var data = res.data.data;
                        this.setData({
                            user_share_qrode: data.user_share_qrode || null,
                            user_share_url: data.user_share_url || null,
                            data_list_loding_status: 3,
                            data_bottom_line_status: true,
                            data_list_loding_msg: "",
                        });

                        // 是否全部没数据
                        if (this.user_share_qrode == null && this.user_share_url == null) {
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
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_list_loding_status: 2,
                        data_bottom_line_status: false,
                        data_list_loding_msg: "网络开小差了哦~",
                    });
                    app.globalData.showToast("网络开小差了哦~");
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
                app.globalData.showToast("宣传图片地址有误");
            }
        },

        // url事件
        url_event(e) {
            app.globalData.text_copy_event(e);
        },
    },
};
</script>
<style>
@import "./poster.css";
</style>
