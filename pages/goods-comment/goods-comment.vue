<template>
    <view>
        <!-- 评分 -->
        <view v-if="goods_score != null" class="score-container oh padding-main">
            <view class="score fl tc">
                <view class="cr-base">综合评分</view>
                <view class="value cr-main">{{goods_score.avg || '0.0'}}</view>
            </view>
            <view class="progress fr tc border-radius-main">
                <block v-if="goods_score.avg > 0">
                    <block v-for="(item, index) in goods_score.rating" :key="index">
                        <view v-if="item.portion > 0" :class="'progress-bar ' + progress_class[index]" :style="'width: ' + item.portion + '%;'">{{item.name}}</view>
                    </block>
                </block>
                <text v-else class="cr-gray">暂无评分</text>
            </view>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
            <view class="padding-horizontal-main goods-comment">
                <view v-for="(item, index) in data_list" :key="index" class="goods-comment-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="oh nav br-b padding-bottom-sm">
                        <image class="avatar dis-block fl" :src="item.user.avatar || static_url+'default-user.png'" mode="aspectFit"></image>
                        <view class="base-nav fr">
                            <text class="va-m">{{item.user.user_name_view}}</text>
                            <view class="dis-inline-block va-m margin-left-sm">
                                <uni-rate :value="item.rating" :is-fill="false" :size="14" />
                            </view>
                            <view class="fr">
                                <text class="cr-grey">{{item.add_time_date}}</text>
                            </view>
                        </view>
                    </view>
                    <view class="base-content oh padding-sm">
                        <view class="content cr-base text-size-sm">{{item.content}}</view>
                        <view v-if="(item.images || null) != null && item.images.length > 0" class="images oh margin-top-lg">
                            <block v-for="(iv, ix) in item.images" :key="ix">
                                <image class="br radius" @tap="comment_images_show_event" :data-index="index" :data-ix="ix" :src="iv" mode="aspectFit"></image>
                            </block>
                        </view>
                        <view v-if="(item.msg || null) != null" class="spec cr-grey margin-top-lg">{{item.msg}}</view>
                        <view v-if="item.is_reply == 1 && (item.reply || null) != null" class="reply br-t-dashed margin-top-lg padding-top-lg text-size-sm">
                            <text class="cr-base">管理员回复：</text>
                            <text class="reply-desc cr-main-pair">{{item.reply}}</text>
                        </view>
                    </view>
                </view>

                <!-- 提示信息 -->
                <component-no-data :prop-status="data_list_loding_status"></component-no-data>

                <!-- 结尾 -->
                <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
            </view>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

    var static_url = app.globalData.get_static_url('home');
    export default {
        data() {
            return {
                static_url: static_url,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_list: [],
                data_page_total: 0,
                data_page: 1,
                goods_score: null,
                params: null,
                progress_class: ['progress-bar-danger', 'progress-bar-warning', 'progress-bar-secondary', '', 'progress-bar-success'],
            };
        },
        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            //params['goods_id']=9;
            this.setData({
                params: params
            });
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
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
                        goods_id: this.params.goods_id
                    },
                    dataType: "json",
                    success: res => {
                        if (res.data.code == 0) {
                            this.setData({
                                goods_score: res.data.data || null
                            });
                        } else {
                            if (res.data.code != -400) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 参数校验
                if ((this.params.goods_id || null) == null) {
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_bottom_line_status: false,
                        data_list_loding_status: 2
                    });
                } else {
                    var self = this;
                    // 分页是否还有数据
                    if ((is_mandatory || 0) == 0) {
                        if (this.data_bottom_line_status == true) {
                            return false;
                        }
                    }

                    uni.showLoading({
                        title: "加载中..."
                    });
                    this.setData({
                        data_list_loding_status: 1
                    });
                    uni.request({
                        url: app.globalData.get_request_url("comments", "goods"),
                        method: "POST",
                        data: {
                            goods_id: this.params.goods_id,
                            page: this.data_page
                        },
                        dataType: "json",
                        success: res => {
                            uni.hideLoading();
                            uni.stopPullDownRefresh();

                            if (res.data.code == 0) {
                                if (res.data.data.data.length > 0) {
                                    if (this.data_page <= 1) {
                                        var temp_data_list = res.data.data.data;
                                    } else {
                                        var temp_data_list = this.data_list;
                                        var temp_data = res.data.data.data;

                                        for (var i in temp_data) {
                                            temp_data_list.push(temp_data[i]);
                                        }
                                    }

                                    this.setData({
                                        data_list: temp_data_list,
                                        data_total: res.data.data.total,
                                        data_page_total: res.data.data.page_total,
                                        data_list_loding_status: 3,
                                        data_page: this.data_page + 1
                                    }); // 是否还有数据

                                    if (this.data_page > 1 && this.data_page > this.data_page_total) {
                                        this.setData({
                                            data_bottom_line_status: true
                                        });
                                    } else {
                                        this.setData({
                                            data_bottom_line_status: false
                                        });
                                    }
                                } else {
                                    this.setData({
                                        data_list_loding_status: 0
                                    });

                                    if (this.data_page <= 1) {
                                        this.setData({
                                            data_list: [],
                                            data_bottom_line_status: false
                                        });
                                    }
                                }
                            } else {
                                this.setData({
                                    data_list_loding_status: 0
                                });

                                if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
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
                    current: this.data_list[index]['images'][ix],
                    urls: this.data_list[index]['images']
                });
            }
        }
    };
</script>
<style>
    @import './goods-comment.css';
</style>
