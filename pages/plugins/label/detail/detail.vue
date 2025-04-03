<template>
    <view :class="theme_view">
        <block v-if="(label || null) != null">
            <!-- 基础 -->
            <view class="label-info bg-white padding-horizontal-main padding-top-main padding-bottom-sm">
                <view
                    class="dis-inline-block round cr-white bg-main padding-left-lg padding-right-lg padding-top-xs padding-bottom-xs"
                    :style="('background-color:'+(label.bg_color || '#666'))+' !important;'+('color:'+(label.text_color || '#fff'))+' !important;'"
                    >{{ label.name }}</view
                >
                <view class="dis-inline-block cr-grey margin-left-sm"
                    >{{$t('detail.detail.025362')}}<text class="cr-red fw-b margin-left-xs margin-right-xs">{{ data_total }}</text
                    >{{$t('detail.detail.0av5r9')}}</view
                >
            </view>

            <!-- 排序 -->
            <view class="nav-sort bg-white oh pr">
                <view class="nav-sort-content">
                    <block v-for="(item, index) in search_nav_sort_list" :key="index">
                        <view class="item tc fl" :data-index="index" @tap="nav_sort_event">
                            <text class="cr-base va-m">{{ item.name }}</text>
                            <image v-if="(item.icon || null) != null" class="icon va-m" :src="common_static_url + 'sort-' + item.icon + '-icon.png'" mode="aspectFill"></image>
                        </view>
                    </block>
                </view>
                <image class="show-type-submit pa cp" :src="common_static_url + 'show-' + (data_show_type_value == 0 ? 'grid' : 'list') + '-icon.png'" mode="aspectFill" @tap="data_show_type_event"></image>
            </view>

            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                    <component-goods-list :propData="{ style_type: data_show_type_value, goods_list: data_list }" :propCurrencySymbol="currency_symbol"></component-goods-list>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </scroll-view>
        </block>
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
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentGoodsList from "@/components/goods-list/goods-list";

    var common_static_url = app.globalData.get_static_url("common");
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                data_is_loading: 0,
                currency_symbol: app.globalData.currency_symbol(),
                params: null,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                label: null,
                search_nav_sort_list: [
                    { name: this.$t('goods-category.goods-category.x69aow'), field: "default", sort: "asc", icon: null },
                    { name: this.$t('goods-category.goods-category.at5p35'), field: "sales", sort: "asc", icon: "default" },
                    { name: this.$t('goods-category.goods-category.283ot0'), field: "access", sort: "asc", icon: "default" },
                    { name: this.$t('goods-category.goods-category.g2u3lf'), field: "price", sort: "asc", icon: "default" },
                    { name: this.$t('goods-category.goods-category.5p4ksj'), field: "new", sort: "asc", icon: "default" },
                ],
                search_nav_sort_value: "",
                // 数据展示样式（0图文、1九方格）
                data_show_type_value: 1,
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

            // 数据加载
            this.get_data();

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
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config("currency_symbol"),
                    });
                } else {
                    app.globalData.is_config(this, "init_config");
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("detailinit", "index", "label"),
                    method: "POST",
                    data: { id: this.params.id || 0 },
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var label = data.label || null;
                            this.setData({
                                data_base: data.base || null,
                                label: label,
                                data_list_loding_status: label == null ? 0 : 1,
                                data_list_loding_msg: this.$t('detail.detail.53m44k'),
                            });

                            if (this.label != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.label.seo_title || this.label.name,
                                        desc: this.label.seo_desc,
                                        path: "/pages/plugins/label/detail/detail",
                                        query: "id=" + this.label.id,
                                    },
                                });

                                // 标题名称
                                if ((this.label.name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.label.name,
                                    });
                                }
                            }

                            // 获取列表数据
                            this.get_data_list(1);
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

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 是否存在标签数据
                if ((this.label || null) == null) {
                    uni.stopPullDownRefresh();
                    return false;
                }

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
                this.setData({ data_is_loading: 1 });

                // 获取数据
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                        mask: true,
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url("detailgoodslist", "index", "label"),
                    method: "POST",
                    data: {
                        id: this.params.id || 0,
                        page: this.data_page,
                        ov: this.search_nav_sort_value,
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

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 排序事件
            nav_sort_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var temp_post_data = this.post_data;
                var temp_search_nav_sort = this.search_nav_sort_list;
                var temp_sort = temp_search_nav_sort[index]["sort"] == "desc" ? "asc" : "desc";
                for (var i in temp_search_nav_sort) {
                    if (i != index) {
                        if (temp_search_nav_sort[i]["icon"] != null) {
                            temp_search_nav_sort[i]["icon"] = "default";
                        }
                        temp_search_nav_sort[i]["sort"] = "desc";
                    }
                }
                temp_search_nav_sort[index]["sort"] = temp_sort;
                if (temp_search_nav_sort[index]["icon"] != null) {
                    temp_search_nav_sort[index]["icon"] = temp_sort;
                }
                this.setData({
                    search_nav_sort_value: temp_search_nav_sort[index]["field"] + "-" + temp_sort,
                    search_nav_sort_list: temp_search_nav_sort,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 数据展示类型
            data_show_type_event(e) {
                this.setData({ data_show_type_value: this.data_show_type_value == 0 ? 1 : 0 });
            },
        },
    };
</script>
<style>
    @import "./detail.css";
</style>
