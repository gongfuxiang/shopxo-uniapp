<template>
    <view :class="theme_view">
        <block v-if="(data_base || null) != null">
            <!-- 顶部 -->
            <view class="bg-white padding-top-main padding-horizontal-main oh flex-row jc-sb align-c cr-grey">
                <!-- 位置 -->
                <view class="nav-location flex-row align-c single-text margin-right-sm">
                    <component-choice-location ref="choice_location" propBaseColor="#666" propTextMaxWidth="180rpx" @onBack="user_back_choice_location"></component-choice-location>
                </view>
                <!-- 搜索 -->
                <view class="nav-search">
                    <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" :propDefaultValue="search_keywords_value" :propPlaceholder="$t('index.index.c5273j')" propPlaceholderClass="cr-grey-c" propBgColor="#f5f5f5"></component-search>
                </view>
            </view>

            <!-- 分类 -->
            <scroll-view v-if="(category || null) != null && category.length > 0" class="nav-base scroll-view-horizontal bg-white oh" scroll-x="true">
                <view :class="'item cr-grey dis-inline-block padding-horizontal-main ' + (nav_active_value == 0 ? 'cr-main' : '')" @tap="nav_event" data-value="0">{{$t('common.all')}}</view>
                <block v-for="(item, index) in category" :key="index">
                    <view :class="'item cr-grey dis-inline-block padding-horizontal-main ' + (nav_active_value == item.id ? 'cr-main fw-b nav-active-line' : '')" @tap="nav_event" :data-value="item.id">{{ item.name }}</view>
                </block>
            </scroll-view>

            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
                <view v-if="(data_list || null) != null && data_list.length > 0" class="padding-top-main padding-horizontal-main">
                    <component-realstore-list :propData="{data: data_list}" :propRealstoreDetailQuery="realstore_detail_query" :propFavorUser="favor_user"></component-realstore-list>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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
    import componentSearch from "@/components/search/search";
    import componentRealstoreList from "@/components/realstore-list/realstore-list";
    import componentChoiceLocation from '@/components/choice-location/choice-location';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                data_is_loading: 0,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                params: null,
                data_base: null,
                category: [],
                search_keywords_value: "",
                nav_active_value: 0,
                favor_user: [],
                realstore_detail_query: '',
                // 用户位置信息
                user_location: {},
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentSearch,
            componentRealstoreList,
            componentChoiceLocation
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 设置参数
            this.setData({
                params: params,
                search_keywords_value: params.keywords || "",
                nav_active_value: params.category_id || 0,
                realstore_detail_query: (params.goods_id || null) == null ? '' : '&source_goods_id='+params.goods_id
            });

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 用户位置初始化
            this.user_location_init();

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
            // 初始化
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "search", "realstore"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                category: data.category || [],
                                favor_user: data.favor_user || [],
                            });

                            // 获取列表数据
                            this.get_data_list(1);
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
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

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 基础自定义分享
                this.share_info_handle();

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({ data_is_loading: 1 });

                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 用户位置
                var lng = 0;
                var lat = 0;
                if ((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("datalist", "search", "realstore"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        keywords: this.search_keywords_value,
                        category_id: this.nav_active_value || 0,
                        goods_id: this.params.goods_id || 0,
                        lng: lng,
                        lat: lat,
                    },
                    dataType: "json",
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
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
                                    data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
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
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 分享设置处理
            share_info_handle() {
                if ((this.data_base || null) != null) {
                    // 基础自定义分享
                    this.setData({
                        share_info: {
                            title: this.search_keywords_value || this.data_base.seo_title || this.data_base.application_name,
                            desc: this.data_base.seo_desc,
                            path: "/pages/plugins/realstore/search/search",
                            query: "category_id=" + this.nav_active_value + "&keywords=" + this.search_keywords_value+"&goods_id="+(this.params.goods_id || 0),
                        },
                    });
                }

                // 分享菜单处理
                app.globalData.page_share_handle(this.share_info);
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_value: e.currentTarget.dataset.value || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 搜索事件
            search_button_event(e) {
                this.setData({
                    search_keywords_value: e || "",
                    data_page: 1,
                });
                this.get_data_list(1);
            },

            // 选择用户地理位置回调
            user_back_choice_location(e) {
                this.setData({
                    user_location: e,
                    data_page: 1,
                });
                // 重新请求数据
                this.get_data_list(1);
            },

            // 地址信息初始化
            user_location_init() {
                this.setData({
                    user_location: app.globalData.choice_user_location_init()
                });
            },
        },
    };
</script>
<style>
    @import "./search.css";
</style>
