<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc ' + (nav_status_index == index ? 'cr-main' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>

        <movable-area class="wh-auto ht-auto">
            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="base oh br-b padding-bottom-main">
                            <text class="cr-base">{{ item.add_time }}</text>
                            <text class="cr-main fr">{{ item.status_name }}</text>
                        </view>
                        <view class="content margin-top">
                            <block v-for="(fv, fi) in content_list" :key="fi">
                                <view class="single-text margin-top-xs">
                                    <text class="cr-grey margin-right-xl">{{ fv.name }}</text>
                                    <text class="cr-base">{{ item[fv.field] }}</text>
                                    <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                                </view>
                            </block>
                        </view>
                        <view v-if="item.status == 0" class="item-operation tr br-t-dashed padding-top-main margin-top-main">
                            <button class="round bg-white br cr-base" type="default" size="mini" hover-class="none" :data-index="index" :data-oid="item.order_id" :data-uid="item.order_user_id" @tap="list_submit_take_event">{{$t('extraction-order.extraction-order.2y7lq1')}}</button>
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

            <!-- 拖拽按钮 -->
            <movable-view class="search-drag tc circle" direction="all" @tap="drag_event">
                <icon type="search" size="20"></icon>
            </movable-view>
        </movable-area>

        <!-- 取货 popup -->
        <component-popup :propShow="is_show_take_popup" propPosition="bottom" @onclose="take_popup_event_close">
            <view class="form-container bg-base padding-horizontal-main padding-top-main padding-bottom-xs">
                <view class="form-gorup tc bg-white margin-top-lg">
                    <view class="form-gorup-title">{{$t('extraction-order.extraction-order.3m038g')}}</view>
                    <input type="number" :value="extraction_code" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('extraction-order.extraction-order.suo4oz')" maxlength="4" @input="extraction_code_input_event" />
                </view>
                <view class="form-gorup form-gorup-submit">
                    <button class="bg-main br-main cr-white round text-size" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_take_event">{{$t('common.confirm')}}</button>
                </view>
            </view>
        </component-popup>

        <!-- 搜索 popup -->
        <component-popup :propShow="is_show_search_popup" propPosition="bottom" @onclose="search_popup_event_close">
            <view class="form-container bg-base padding-horizontal-main padding-top-main padding-bottom-xs">
                <view class="form-gorup tc bg-white margin-top-lg">
                    <view class="form-gorup-title">{{$t('extraction-order.extraction-order.xb4044')}}</view>
                    <input type="number" :value="search_keywords_value" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('extraction-order.extraction-order.kuqvlv')" @input="search_input_keywords_event" />
                </view>
                <view class="form-gorup form-gorup-submit">
                    <button class="bg-main-pair br-main-pair cr-white round text-size" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="search_submit_event">{{$t('common.search')}}</button>
                </view>
            </view>
        </component-popup>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentPopup from "@/components/popup/popup";
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
                nav_status_list: [
                    { name: this.$t('common.all'), value: "-1" },
                    { name: this.$t('extraction.extraction.53h4fj'), value: "0" },
                    { name: this.$t('extraction.extraction.wq25fk'), value: "1" },
                ],
                nav_status_index: 0,
                is_show_take_popup: false,
                extraction_value: null,
                extraction_code: "",
                form_submit_disabled_status: false,
                is_show_search_popup: false,
                search_keywords_value: "",
                content_list: [
                    { name: this.$t('order-detail.order-detail.36op8f'), field: "order_no" },
                    { name: this.$t('user-order-detail.user-order-detail.516tlr'), field: "pay_price" },
                ],
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 是否指定状态
            var nav_status_index = 0;
            if (params.status != undefined) {
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

                // 参数
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]["value"];

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("order", "extraction", "distribution"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        status: status || 0,
                        keywords: this.search_keywords_value || "",
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

            // 取件码弹层-开启
            list_submit_take_event(e) {
                this.setData({
                    is_show_take_popup: true,
                    extraction_code: "",
                    extraction_value: {
                        index: e.currentTarget.dataset.index,
                        oid: e.currentTarget.dataset.oid,
                        uid: e.currentTarget.dataset.uid,
                    },
                });
            },

            // 取件码弹层-关闭
            take_popup_event_close() {
                this.setData({
                    is_show_take_popup: false,
                });
            },

            // 取件码输入事件
            extraction_code_input_event(e) {
                this.setData({
                    extraction_code: e.detail.value || "",
                });
            },

            // 取件提交
            form_submit_take_event(e) {
                // 参数
                if ((this.extraction_code || null) == null) {
                    app.globalData.showToast(this.$t('extraction-order.extraction-order.znufs8'));
                    return false;
                }
                if ((this.extraction_value || null) == null) {
                    app.globalData.showToast(this.$t('extraction-order.extraction-order.hbj4y7'));
                    return false;
                }

                // 提交表单
                var data = {
                    id: this.extraction_value.oid,
                    user_id: this.extraction_value.uid,
                    extraction_code: this.extraction_code,
                };
                this.setData({
                    form_submit_disabled_status: true,
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url("take", "extraction", "distribution"),
                    method: "POST",
                    data: data,
                    dataType: "json",
                    success: (res) => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp_data_list = this.data_list;
                            var index = this.extraction_value.index;
                            temp_data_list[index]["status"] = 1;
                            temp_data_list[index]["status_name"] = this.$t('extraction.extraction.wq25fk');
                            this.setData({
                                is_show_take_popup: false,
                                data_list: temp_data_list,
                            });
                            app.globalData.showToast(res.data.msg, "success");
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 搜索弹层-开启
            drag_event(e) {
                this.setData({
                    is_show_search_popup: true,
                });
            },

            // 搜索弹层-关闭
            search_popup_event_close() {
                this.setData({
                    is_show_search_popup: false,
                });
            },

            // 搜索关键字输入事件
            search_input_keywords_event(e) {
                this.setData({
                    search_keywords_value: e.detail.value || "",
                });
            },

            // 搜索确认事件
            search_submit_event(e) {
                this.setData({
                    is_show_search_popup: false,
                    data_page: 1,
                });
                this.get_data_list(1);
            },
        },
    };
</script>
<style>
    @import "./extraction-order.css";
</style>
