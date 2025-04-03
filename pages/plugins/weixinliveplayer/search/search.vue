<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-main">
                <view v-for="(item, index) in data_list" :key="index" class="item border-radius-main bg-white oh pr spacing-mb">
                    <view class="flex-row jc-sb cp" :class="Number(item.status) > 3 ? 'expire' : ''" :data-value="'/pages/plugins/weixinliveplayer/detail/detail?id=' + item.id" @tap="url_event">
                        <image class="radius" :src="item.share_img" mode="aspectFill"></image>
                        <view v-if="item.status === '1'" class="pa bottom-0 left-0 live-content circle">
                            <view class="live-action flex-row jc-sa align-e">
                                <view class="live-1"></view>
                                <view class="live-2"></view>
                                <view class="live-3"></view>
                            </view>
                        </view>
                        <view class="base flex-1 flex-width flex-col jc-sb">
                            <view>
                                <view class="single-text text-size-md fw-b">{{ item.name }}</view>
                                <view class="margin-top-sm oh flex-row flex-nowrap align-c">
                                    <iconfont name="icon-zhibo-time" color="#ccc" size="28rpx" propClass="margin-right-sm"></iconfont>
                                    <view class="flex-row flex-nowrap align-c flex-1 flex-width cr-grey-9 single-text"> {{ item.start_time }} - {{ item.end_time }} </view>
                                </view>
                            </view>
                            <view class="self-e text-size-xs cr-grey-9 flex-row align-c" :class="'status-' + item.status"
                                ><!-- 未开始 -->
                                <iconfont v-if="item.status === '0'" name="icon-zhibo-time" propClass="margin-right-xs pr top-xs"></iconfont>
                                <!-- 直播中 -->
                                <div v-else-if="item.status === '1'" class="spread margin-right-sm">
                                    <div class="ring"></div>
                                    <div class="ring"></div>
                                    <div class="ring"></div>
                                </div>
                                <!-- 暂停中 -->
                                <iconfont v-else-if="item.status === '2'" name="icon-player-pause" propClass="margin-right-xs pr top-xs"></iconfont>
                                <!-- 已结束 -->
                                <iconfont v-else-if="item.status === '3'" name="icon-player-end" propClass="margin-right-xs pr top-xs"></iconfont>
                                <!-- 其他 -->
                                <iconfont v-else name="icon-zhibo-shixiao" propClass="margin-right-xs pr top-xs"></iconfont>
                                {{ item.status_name }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

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
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                load_status: 0,
                data_list: [],
                data_base: null,
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                nav_status_list: [
                    {
                        name: this.$t('common.all'),
                        value: "-1",
                    },
                    {
                        name: this.$t('search.search.e415ir'),
                        value: "0",
                    },
                    {
                        name: this.$t('search.search.46g3i2'),
                        value: "1",
                    },
                    {
                        name: this.$t('search.search.v60305'),
                        value: "2",
                    },
                    {
                        name: this.$t('index.index.443683'),
                        value: "3",
                    },
                ],
                nav_status_index: 0,
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

            // 是否指定状态
            var nav_status_index = 0;
            if ((params.status || null) != null) {
                for (var i in this.nav_status_list) {
                    if (this.nav_status_list[i]["value"] == params.status) {
                        nav_status_index = i;
                        break;
                    }
                }
            }
            this.setData({
                params: params,
                nav_status_index: nav_status_index,
            });
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
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            init() {
                // 获取数据
                this.get_data_list();
            },

            // 获取数据
            get_data_list(is_mandatory) {
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
                    data_list_loding_status: 1,
                });

                // 加载loding
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });

                // 参数
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]["value"];

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "search", "weixinliveplayer"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        status: status,
                        is_more: 1,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
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
                                    data_base: data.base || null,
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

                                // 首次设置首次加载状态
                                if (this.load_status == 0) {
                                    // 基础自定义分享
                                    this.setData({
                                        load_status: 1,
                                        share_info: {
                                            title: this.data_base.seo_title || this.data_base.application_name,
                                            desc: this.data_base.seo_desc,
                                            path: "/pages/plugins/weixinliveplayer/search/search",
                                            query: "status=" + this.nav_status_index,
                                        },
                                    });

                                    // 分享菜单处理
                                    app.globalData.page_share_handle(this.share_info);
                                }
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
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import "./search.css";
</style>
