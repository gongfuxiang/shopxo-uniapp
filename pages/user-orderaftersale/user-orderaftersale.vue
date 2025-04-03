<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view v-if="nav_status_index == index" class="item fl tc cr-main nav-active-line" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                <view v-else class="item fl tc" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>

        <!-- 订单列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="list-item padding-horizontal-main padding-top-main border-radius-main bg-white oh spacing-mb">
                    <view class="item-base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time }}</text>
                        <text class="fr cr-red">{{ item.status_text }}</text>
                    </view>
                    <view :data-value="'/pages/user-orderaftersale-detail/user-orderaftersale-detail?oid=' + item.order_id + '&did=' + item.order_detail_id" @tap="url_event" class="goods-item oh cp">
                        <image class="goods-image fl radius" :src="item.order_data.items.images" mode="aspectFill"></image>
                        <view class="goods-base pr">
                            <view class="multi-text">{{ item.order_data.items.title }}</view>
                            <view v-if="item.order_data.items.spec != null" class="margin-top-sm">
                                <block v-for="(sv, si) in item.order_data.items.spec" :key="si">
                                    <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                    <text class="cr-grey">{{ sv.value }}</text>
                                </block>
                            </view>
                            <view class="margin-top-sm">
                                <text class="fw-b">{{ item.order_data.currency_data.currency_symbol }}{{ item.order_data.items.price }}</text>
                                <text class="margin-left-sm">x{{ item.order_data.items.buy_number }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="item-describe padding-vertical-main">
                        <text class="cr-base">{{ item.type_text }}</text>
                        <text class="cr-grey margin-left-sm margin-right-sm">/</text>
                        <text class="cr-base">{{ item.reason }}</text>
                        <block v-if="item.price > 0">
                            <text class="cr-grey margin-left-sm margin-right-sm">/</text>
                            <text class="sales-price text-size-sm">{{ item.order_data.currency_data.currency_symbol }}{{ item.price }}</text>
                        </block>
                        <block v-if="item.number > 0">
                            <text class="cr-grey margin-left-sm margin-right-sm">/</text>
                            <text class="cr-main fw-b">{{ item.number }}</text>
                        </block>
                    </view>
                    <view v-if="item.status <= 2 || item.status == 4" class="item-operation tr br-t padding-vertical-main">
                        <button v-if="item.status != 3 && item.status != 5" class="br-yellow cr-yellow bg-white round" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.cancel')}}</button>
                        <button v-if="item.status == 1 && item.type == 1" class="br-green cr-green bg-white round" type="default" size="mini" @tap="delivery_event" :data-oid="item.order_id" :data-did="item.order_detail_id" :data-index="index" hover-class="none">{{$t('user-orderaftersale.user-orderaftersale.10c251')}}</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                data_is_loading: 0,
                // 接口数据
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                form_keyword_value: "",
                // 导航
                // 状态（0待确认, 1待退货, 2待审核, 3已完成, 4已拒绝, 5已取消）
                nav_status_list: [
                    { name: this.$t('common.all'), value: "-1" },
                    { name: this.$t('user-orderaftersale.user-orderaftersale.3wggcu'), value: "0" },
                    { name: this.$t('user-orderaftersale.user-orderaftersale.1kcn16'), value: "1" },
                    { name: this.$t('user-orderaftersale.user-orderaftersale.2kzi0t'), value: "2" },
                    { name: this.$t('order.order.15lr5l'), value: "3" },
                    { name: this.$t('user-orderaftersale.user-orderaftersale.1p5456'), value: "4" },
                    { name: this.$t('order.order.1k98tk'), value: "5" },
                ],
                nav_status_index: 0,
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
                form_keyword_value: params.keywords || "",
                nav_status_index: nav_status_index,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
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
            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.get_data_list();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
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
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 参数
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]["value"];
                uni.request({
                    url: app.globalData.get_request_url("index", "orderaftersale"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        keywords: this.form_keyword_value || "",
                        status: status,
                        is_more: 1,
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

                            if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
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

            // 输入框事件
            input_event(e) {
                this.setData({
                    form_keyword_value: e.detail.value,
                });
            },

            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.pn78ns'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;

                            // 加载loding
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url("cancel", "orderaftersale"),
                                method: "POST",
                                data: {
                                    id: id,
                                },
                                dataType: "json",
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]["status"] = 5;
                                        temp_data_list[index]["status_text"] = this.$t('order.order.1k98tk');
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        app.globalData.showToast(res.data.msg, "success");
                                    } else {
                                        if (app.globalData.is_login_check(res.data)) {
                                            app.globalData.showToast(res.data.msg);
                                        } else {
                                            app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                        }
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 退货
            delivery_event(e) {
                var oid = e.currentTarget.dataset.oid || 0;
                var did = e.currentTarget.dataset.did || 0;
                if (oid == 0 || did == 0) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.5k6k56'));
                    return false;
                }

                // 进入售后页面
                app.globalData.url_open('/pages/user-orderaftersale-detail/user-orderaftersale-detail?oid=' + oid + '&did=' + did + '&is_delivery_popup=1');
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import "./user-orderaftersale.css";
</style>
