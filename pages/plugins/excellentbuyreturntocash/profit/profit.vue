<template>
    <view :class="theme_view">
        <!-- 自定义导航 + 搜索订单号 -->
        <component-nav-back :propFixed="false" propClass="bg-white cr-black" propColor="#333" :propName="nav_title" :style="'padding-top:' + status_bar_height + 'px;'">
            <template slot="right" :class="is_mp_env ? 'top-search-width' : ''">
                <view class="margin-left-main" :class="is_mp_env ? '' : 'flex-1 flex-width'">
                    <component-search
                        @oninput="search_input_event"
                        @onsearch="search_button_event"
                        :propDefaultValue="search_keywords"
                        :propIsOnInputEvent="true"
                        :propIsOnEvent="true"
                        :propIsRequired="false"
                        :propPlaceholder="$t('profit.search_order_no')"
                        propIconColor="#ccc"
                        propPlaceholderClass="cr-grey-c"
                        propBgColor="#f6f6f6"
                    ></component-search>
                </view>
            </template>
        </component-nav-back>

        <!-- 公告（状态上方，点击查看完整内容） -->
        <view v-if="notice_list.length > 0" class="bg-white padding-horizontal-main padding-top-sm">
            <uni-notice-bar
                class="padding-0 margin-0"
                show-icon
                show-get-more
                scrollable
                :text="notice_text"
                background-color="transparent"
                color="#666"
                @click="notice_open_event"
            />
        </view>

        <!-- 状态导航（可横向滚动） -->
        <view class="profit-header bg-white">
            <view v-if="nav_status_list.length > 0" class="nav-base profit-order-nav scroll-view-horizontal padding-horizontal-main">
                <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'profit-nav-' + nav_status_index">
                    <block v-for="(item, index) in nav_status_list" :key="index">
                        <view
                            :id="'profit-nav-' + index"
                            :class="'item tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : 'cr-grey')"
                            :data-index="index"
                            @tap="nav_event"
                        >{{ item.name }}</view>
                    </block>
                </scroll-view>
            </view>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box-profit-order" :style="content_style" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time }}</text>
                        <text class="fr cr-main">{{ item.status_name }}</text>
                    </view>
                    <view :data-value="'/pages/plugins/excellentbuyreturntocash/profit-detail/profit-detail?id=' + item.id" @tap="url_event" class="content margin-top cp">
                        <view v-for="(fv, fi) in content_list" :key="fi">
                            <view class="single-text margin-top-xs">
                                <text class="cr-grey margin-right-xl">{{ fv.name }}</text>
                                <text class="cr-base">{{ item[fv.field] }}</text>
                                <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button class="round bg-white br cr-base br" type="default" size="mini" hover-class="none" :data-oid="item.order_id" @tap="list_submit_order_event">{{$t('profit.order_details')}}</button>
                        <button v-if="item.status == 2" class="round bg-white br-green cr-green" type="default" size="mini" hover-class="none" :data-index="index" @tap="list_submit_settlement_event">{{$t('profit.immediate_settlement')}}</button>
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

        <!-- 公告弹窗 -->
        <component-popup v-if="notice_list.length > 0" :propShow="popup_notice_status" propPosition="bottom" @onclose="notice_close_event">
            <view class="padding-main bg-white">
                <view class="cr-black text-size-md fw-b margin-bottom-main">{{$t('common.warm_tips')}}</view>
                <scroll-view :scroll-y="true" class="content-notice">
                    <view v-for="(item, index) in notice_list" :key="index" class="cr-grey text-size-md padding-vertical-xs">{{ item }}</view>
                </scroll-view>
                <button type="default" class="bg-main cr-white round text-size-md wh-auto margin-top-lg" @tap="notice_close_event">{{$t('common.got')}}</button>
            </view>
        </component-popup>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentSearch from '@/components/search/search';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentPopup from '@/components/popup/popup';
    import pluginLocale from '../locale/index.js';

    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO || H5
    bar_height = 0;
    // #endif

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                client_type: app.globalData.application_client_type(),
                status_bar_height: bar_height,
                is_mp_env: false,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || MP-QQ || MP-KUAISHOU
                is_mp_env: true,
                // #endif
                nav_title: '',
                content_style: '',
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                search_keywords: '',
                notice_list: [],
                popup_notice_status: false,
                nav_status_list: [
                    { name: this.$t('common.all'), value: "-1" },
                    { name: this.$t('common.profit_effective'), value: "0" },
                    { name: this.$t('profit.effect'), value: "1" },
                    { name: this.$t('common.settled'), value: "2" },
                    { name: this.$t('common.settled_2'), value: "3" },
                    { name: this.$t('common.invalid'), value: "4" },
                ],
                nav_status_index: 0,
                content_list: [
                    { name: this.$t('common.order_amount'), field: "total_price" },
                    { name: this.$t('common.refund_amount'), field: "refund_price" },
                    { name: this.$t('profit.effective_amount'), field: "valid_price" },
                    { name: this.$t('profit.refund_amount'), field: "profit_price" },
                ],
            };
        },

        computed: {
            notice_text() {
                return (this.notice_list || []).join(' ');
            },
        },

        components: {
            componentCommon,
            componentNavBack,
            componentSearch,
            componentNoData,
            componentBottomLine,
            componentPopup,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

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
                search_keywords: params.keywords || params.order_no || '',
                nav_title: this.$t('pages.plugins-excellentbuyreturntocash-profit'),
                content_style: 'height: calc(100vh - 80rpx - ' + (this.status_bar_height + (this.client_type == 'h5' ? 55 : 50)) + 'px);',
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
                    url: app.globalData.get_request_url("index", "profit", "excellentbuyreturntocash"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        status: status,
                        keywords: this.search_keywords || '',
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
                            if (this.data_page <= 1) {
                                var notice = data.user_cach_order_notice || [];
                                this.setData({
                                    notice_list: Array.isArray(notice) ? notice.filter(function(v){ return (v || '') !== ''; }) : [],
                                });
                            }
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
                                data_list_loding_status: 2,
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
                    },
                });
            },

            // 订单详情
            list_submit_order_event(e) {
                var oid = e.currentTarget.dataset.oid || null;
                if (oid != null) {
                    app.globalData.url_open('/pages/user-order-detail/user-order-detail?id=' + oid);
                } else {
                    app.globalData.showToast(this.$t('profit.order_id_incorrect'));
                }
            },

            // 立即结算事件
            list_submit_settlement_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url("auto", "profit", "excellentbuyreturntocash"),
                    method: "POST",
                    data: {
                        id: this.data_list[index]["id"],
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp_data_list = this.data_list;
                            temp_data_list[index]["status"] = 3;
                            temp_data_list[index]["status_name"] = this.$t('common.settled_2');
                            this.setData({
                                data_list: temp_data_list,
                            });
                            app.globalData.showToast(res.data.msg, "success");
                        } else {
                            app.globalData.alert({
                                msg: res.data.msg,
                                is_show_cancel: 0,
                            });
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
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

            // 搜索输入事件
            search_input_event(e) {
                this.setData({
                    search_keywords: e
                });
            },

            // 关键字搜索
            search_button_event(e) {
                this.setData({
                    search_keywords: e,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 打开公告弹窗
            notice_open_event() {
                this.setData({
                    popup_notice_status: true,
                });
            },

            // 关闭公告弹窗
            notice_close_event() {
                this.setData({
                    popup_notice_status: false,
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
    @import "./profit.css";
</style>
