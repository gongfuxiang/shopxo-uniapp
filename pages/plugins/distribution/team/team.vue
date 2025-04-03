<template>
    <view :class="theme_view">
        <!-- 搜索条件 -->
        <view class="form-container nav-search bg-white br-b oh padding-horizontal-main padding-bottom-main text-size-xs cr-base pr">
            <view class="margin-top oh">
                <view class="fl margin-top">{{$t('team.team.784249')}}</view>
                <view class="multiple-picker fl tc">
                    <view class="item br dis-inline-block pr radius tl fl">
                        <uni-datetime-picker v-model="nav_search_value.team_search_user_time_start" :border="false" :showFirstIcon="false" :hide-second="true" type="datetime" :placeholder="$t('team.team.pcaom3')" placeholder-class="cr-grey" />
                    </view>
                    <view class="dis-inline-block cr-grey-white margin-top-sm">-</view>
                    <view class="item br dis-inline-block pr radius tl fr">
                        <uni-datetime-picker v-model="nav_search_value.team_search_user_time_end" :border="false" :showFirstIcon="false" :hide-second="true" type="datetime" :placeholder="$t('team.team.iee9bp')" placeholder-class="cr-grey" />
                    </view>
                </view>
                <checkbox-group class="dis-inline-block fr margin-top-xs" data-value="team_search_user_time_reverse" @change="search_cholce_event">
                    <label> <checkbox value="1" :checked="nav_search_value.team_search_user_time_reverse.indexOf('1') != -1" style="transform: scale(0.7)" />{{$t('team.team.i040fg')}}</label>
                </checkbox-group>
            </view>
            <view class="margin-top oh">
                <view class="fl margin-top">{{$t('team.team.2ny6k1')}}</view>
                <view class="multiple-picker fl tc">
                    <view class="item br dis-inline-block pr radius tl fl">
                        <uni-datetime-picker v-model="nav_search_value.team_search_order_time_start" :border="false" :showFirstIcon="false" :hide-second="true" type="datetime" :placeholder="$t('team.team.pcaom3')" placeholder-class="cr-grey" />
                    </view>
                    <view class="dis-inline-block cr-grey-white margin-top-sm">-</view>
                    <view class="item br dis-inline-block pr radius tl fr">
                        <uni-datetime-picker v-model="nav_search_value.team_search_order_time_end" :border="false" :showFirstIcon="false" :hide-second="true" type="datetime" :placeholder="$t('team.team.iee9bp')" placeholder-class="cr-grey" />
                    </view>
                </view>
                <checkbox-group class="dis-inline-block fr margin-top-xs" data-value="team_search_order_time_reverse" @change="search_cholce_event">
                    <label> <checkbox value="1" :checked="nav_search_value.team_search_order_time_reverse.indexOf('1') != -1" style="transform: scale(0.7)" />{{$t('team.team.i040fg')}}</label>
                </checkbox-group>
            </view>
            <view class="margin-top oh">
                <view class="fl">{{$t('team.team.2i4k79')}}</view>
                <checkbox-group data-value="team_search_buy_type" @change="search_cholce_event">
                    <label> <checkbox value="0" :checked="nav_search_value.team_search_buy_type.indexOf('0') != -1" style="transform: scale(0.7)" />{{$t('promotion-user.promotion-user.g5332w')}}</label>
                    <label class="margin-left-xxl"> <checkbox value="1" :checked="nav_search_value.team_search_buy_type.indexOf('1') != -1" style="transform: scale(0.7)" />{{$t('promotion-user.promotion-user.8i641g')}}</label>
                </checkbox-group>
            </view>
            <view class="search-submit-list pa">
                <button type="default" size="mini" class="bg-grey br-grey cr-base text-size-xs round margin-right-main" @tap="search_reset_event">{{$t('team.team.3l538c')}}</button>
                <button type="default" size="mini" class="bg-main br-main cr-white text-size-xs round" @tap="search_submit_event">{{$t('common.search')}}</button>
            </view>
        </view>

        <!-- 数据列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <image class="avatar dis-block fl circle" :src="item.avatar" mode="widthFix" @tap="avatar_event" :data-value="item.avatar"></image>
                        <text class="cr-base margin-left-sm">{{ item.user_name_view || "" }}</text>
                        <text class="cr-base fr">{{ item.add_time }}</text>
                    </view>
                    <view class="content margin-top">
                        <block v-for="(fv, fi) in content_list" :key="fi">
                            <view class="single-text margin-top-xs">
                                <text class="cr-grey margin-right-xl">{{ fv.name }}</text>
                                <text class="cr-base" :data-event="fv.event" :data-value="item[fv.field]" @tap="text_event">{{ item[fv.field] || fv.default }}</text>
                                <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                            </view>
                        </block>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button v-if="(item.email || null) != null" class="round bg-white br cr-base" type="default" size="mini" hover-class="none" @tap="text_event" data-event="copy" :data-value="item.email">{{$t('login.login.p54kf1')}}</button>
                        <button v-if="(item.mobile || null) != null" class="round bg-white br cr-base" type="default" size="mini" hover-class="none" @tap="text_event" data-event="tel" :data-value="item.mobile">{{$t('promotion-user.promotion-user.62c8m1')}}</button>
                        <button class="round bg-white br cr-base" type="default" size="mini" hover-class="none" @tap="user_order_event" :data-value="item.id">{{$t('promotion-user.promotion-user.i2rf31')}}</button>
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
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                content_list: [
                    { name: this.$t('promotion-user.promotion-user.2g7enc'), field: "order_count", unit: "", default: 0 },
                    { name: this.$t('promotion-user.promotion-user.32bf15'), field: "order_total", unit: "", default: 0 },
                    { name: this.$t('promotion-user.promotion-user.76748p'), field: "order_last_time", default: "" },
                    { name: this.$t('promotion-user.promotion-user.u43380'), field: "find_order_count", unit: "", default: 0 },
                    { name: this.$t('promotion-user.promotion-user.8n4tr3'), field: "find_order_total", unit: "", default: 0 },
                    { name: this.$t('promotion-user.promotion-user.1gc3ny'), field: "find_order_last_time", default: "" },
                    { name: this.$t('promotion-user.promotion-user.3l1187'), field: "referrer_count", unit: "", default: 0 },
                ],
                nav_search_buy_type_list: [
                    { value: -1, name: this.$t('common.all') },
                    { value: 0, name: this.$t('promotion-user.promotion-user.g5332w') },
                    { value: 1, name: this.$t('promotion-user.promotion-user.8i641g') },
                ],
                nav_search_value: {
                    team_search_user_time_start: "",
                    team_search_user_time_end: "",
                    team_search_user_time_reverse: [],
                    team_search_order_time_start: "",
                    team_search_order_time_end: "",
                    team_search_order_time_reverse: [],
                    team_search_buy_type: [],
                },
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
                params: params,
            });

            // 初始数据
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
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
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

                // 请求参数
                var data = {
                    page: this.data_page,
                };

                // 搜索注册时间
                if ((this.nav_search_value.team_search_user_time_start || null) != null) {
                    data["team_search_user_time_start"] = this.nav_search_value.team_search_user_time_start;
                }
                if ((this.nav_search_value.team_search_user_time_end || null) != null) {
                    data["team_search_user_time_end"] = this.nav_search_value.team_search_user_time_end;
                }
                // 用户反向
                if (this.nav_search_value.team_search_user_time_reverse.length > 0) {
                    data["team_search_user_time_reverse"] = 1;
                }

                // 搜索下单时间
                if ((this.nav_search_value.team_search_order_time_start || null) != null) {
                    data["team_search_order_time_start"] = this.nav_search_value.team_search_order_time_start;
                }
                if ((this.nav_search_value.team_search_order_time_end || null) != null) {
                    data["team_search_order_time_end"] = this.nav_search_value.team_search_order_time_end;
                }
                // 订单反向
                if (this.nav_search_value.team_search_order_time_reverse.length > 0) {
                    data["team_search_order_time_reverse"] = 1;
                }

                // 搜索是否下单
                if (this.nav_search_value.team_search_buy_type.length > 0) {
                    data["team_search_buy_type"] = this.nav_search_value.team_search_buy_type.join(",");
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "team", "distribution"),
                    method: "POST",
                    data: data,
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

            // 头像查看
            avatar_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value],
                    });
                } else {
                    app.globalData.showToast(this.$t('order.order.p3scy0'));
                }
            },

            // 用户订单事件
            user_order_event(e) {
                var value = e.currentTarget.dataset.value;
                app.globalData.url_open('/pages/plugins/distribution/order/order?uid=' + value);
            },

            // 搜索条件事件
            search_cholce_event(e) {
                var value = e.currentTarget.dataset.value;
                var temp_data = this.nav_search_value;
                temp_data[value] = e.detail.value;
                this.setData({
                    nav_search_value: temp_data,
                });
            },

            // 搜索重置事件
            search_reset_event(e) {
                var temp_data = this.nav_search_value;
                var arr_field = ["team_search_buy_type", "team_search_order_time_reverse", "team_search_user_time_reverse"];
                for (var i in temp_data) {
                    temp_data[i] = arr_field.indexOf(i) == -1 ? "" : [];
                }
                this.setData({
                    nav_search_value: temp_data,
                    data_page: 1,
                });
                this.get_data_list(1);
            },

            // 搜索确认事件
            search_submit_event(e) {
                this.setData({
                    data_page: 1,
                });
                this.get_data_list(1);
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            },
        },
    };
</script>
<style>
    @import "./team.css";
</style>
