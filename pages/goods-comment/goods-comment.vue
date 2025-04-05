<template>
    <view :class="theme_view">
        <!-- 提示信息 -->
        <block v-if="data_list_loding_status == 1">
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </block>
        <block v-else>
            <!-- 评分 -->
            <view v-if="goods_score != null" class="score-container oh padding-main">
                <view class="bg-white border-radius-main padding-main flex-row jc-sb align-c">
                    <view class="score tc">
                        <view class="cr-base">{{$t('goods-comment.goods-comment.dfmjxd')}}</view>
                        <view class="value cr-main">{{ goods_score.avg || "0.0" }}</view>
                    </view>
                    <view class="progress tc border-radius-main flex-1 flex-width">
                        <block v-if="goods_score.avg > 0">
                            <block v-for="(item, index) in goods_score.rating" :key="index">
                                <view v-if="item.portion > 0" :class="'progress-bar ' + progress_class[index]" :style="'width: ' + item.portion + '%;'">{{ item.name }}</view>
                            </block>
                        </block>
                        <text v-else class="cr-grey">{{$t('goods-comment.goods-comment.1qh8s8')}}</text>
                    </view>
                </view>
            </view>

            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                <view class="padding-horizontal-main goods-comment">
                    <!-- 评价 -->
                    <component-goods-comments :propData="data_list" :propIsReply="true" propClass="bg-white padding-main border-radius-main"></component-goods-comments>

                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
            </scroll-view>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentGoodsComments from "@/pages/goods-detail/components/goods-comments/goods-comments";

    var static_url = app.globalData.get_static_url("home");
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                static_url: static_url,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                data_list: [],
                data_page_total: 0,
                data_page: 1,
                goods_score: null,
                params: null,
                progress_class: ["progress-bar-danger", "progress-bar-warning", "progress-bar-secondary", "", "progress-bar-success"],
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentGoodsComments,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化
            init() {
                // 获取数据
                this.get_goods_score();
                this.get_data_list();
            },

            // 获取商品评分
            get_goods_score() {
                uni.request({
                    url: app.globalData.get_request_url("goodsscore", "goods"),
                    method: "POST",
                    data: {
                        goods_id: this.params.goods_id,
                    },
                    dataType: "json",
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.setData({
                                goods_score: res.data.data || null,
                            });
                        } else {
                            if (res.data.code != -400) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 参数校验
                if ((this.params.goods_id || null) == null) {
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_bottom_line_status: false,
                        data_list_loding_status: 2,
                    });
                } else {
                    // 分页是否还有数据
                    if ((is_mandatory || 0) == 0) {
                        if (this.data_bottom_line_status == true) {
                            uni.stopPullDownRefresh();
                            return false;
                        }
                    }

                    // 是否加载中
                    if (this.data_is_loading == 1) {
                        return false;
                    }
                    this.setData({
                        data_is_loading: 1,
                    });

                    uni.request({
                        url: app.globalData.get_request_url("comments", "goods"),
                        method: "POST",
                        data: {
                            goods_id: this.params.goods_id,
                            page: this.data_page,
                        },
                        dataType: "json",
                        success: (res) => {
                            uni.stopPullDownRefresh();
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                if (data.data.length > 0) {
                                    if (this.data_page <= 1) {
                                        var temp_data_list = data.data;
                                    } else {
                                        var temp_data_list = this.data_list || [];
                                        var temp_data = data.data;
                                        for (var i in temp_data) {
                                            temp_data_list.push(temp_data[i]);
                                        }
                                    }
                                    this.setData({
                                        data_list: temp_data_list,
                                        data_total: data.total,
                                        data_page_total: data.page_total,
                                        data_list_loding_status: 3,
                                        data_page: this.data_page + 1,
                                        data_is_loading: 0,
                                    });

                                    // 是否还有数据
                                    this.setData({
                                        data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                    });
                                } else {
                                    this.setData({
                                        data_list_loding_status: 0,
                                        data_is_loading: 0,
                                    });
                                    if (this.data_page <= 1) {
                                        this.setData({
                                            data_list: [],
                                            data_bottom_line_status: false,
                                        });
                                    }
                                }
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
                                if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.stopPullDownRefresh();
                            this.setData({
                                data_list_loding_status: 2,
                                data_is_loading: 0,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 评价图片预览
            comment_images_show_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                uni.previewImage({
                    current: this.data_list[index]["images"][ix],
                    urls: this.data_list[index]["images"],
                });
            },
        },
    };
</script>
<style>
    @import "./goods-comment.css";
</style>
