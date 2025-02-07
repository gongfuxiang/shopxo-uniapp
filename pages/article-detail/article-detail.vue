<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null" class="padding-main">
            <view class="padding-main border-radius-main bg-white spacing-mb">
                <view class="fw-b text-size-xl">{{ data.title }}</view>
                <view class="cr-grey margin-top-lg oh br-t padding-top-main">
                    <view class="fl">
                        <text>{{$t('article-detail.article-detail.728374')}}</text>
                        <text>{{ data.add_time }}</text>
                    </view>
                    <view class="fr">
                        <text class="margin-left-xxxl">{{$t('article-detail.article-detail.j92ru0')}}</text>
                        <text>{{ data.access_count }}</text>
                    </view>
                </view>
            </view>
            <view class="padding-main border-radius-main bg-white oh web-html-content spacing-mb">
                <mp-html :content="data.content" />
            </view>

            <!-- 上一篇、下一篇 -->
            <view v-if="(last_next || null) != null" class="last-next-data spacing-mb">
                <view v-if="(last_next.last || null) != null">
                    <text class="cr-grey va-m">{{$t('article-detail.article-detail.281s4a')}}</text>
                    <text :data-value="last_next.last.url" @tap="url_event" class="dis-inline-block va-m cr-blue cp item">{{ last_next.last.title }}</text>
                </view>
                <view v-if="(last_next.next || null) != null" class="margin-top-sm">
                    <text class="cr-grey va-m">{{$t('article-detail.article-detail.uq5814')}}</text>
                    <text :data-value="last_next.next.url" @tap="url_event" class="dis-inline-block va-m cr-blue cp item">{{ last_next.next.title }}</text>
                </view>
            </view>
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
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                params: null,
                data: null,
                last_next: null,
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });

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
            // 初始化
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("detail", "article"),
                    method: "POST",
                    data: {
                        id: this.params.id || 0,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        var data = res.data.data;
                        if (res.data.code == 0 && (data.data || null) != null) {
                            var article = data.data;
                            this.setData({
                                data_bottom_line_status: true,
                                data_list_loding_status: 3,
                                data: article,
                                last_next: data.last_next || null,
                            });

                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.data.seo_title || this.data.title,
                                    desc: this.data.seo_desc,
                                    path: "/pages/article-detail/article-detail",
                                    query: "id=" + this.data.id,
                                    img: this.data.share_images || this.data.cover,
                                },
                            });

                            // 标题
                            uni.setNavigationBarTitle({ title: article.title });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
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
    @import "./article-detail.css";
</style>
