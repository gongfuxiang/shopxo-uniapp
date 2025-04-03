<template>
    <view :class="theme_view">
        <view class="cash">
            <view class="padding-main bg-white pr nav flex-row oa">
                <view class="flex-shrink flex-row align-c margin-right-xxxl padding-right-xl pr" @tap="popup_accounts_open_event">
                    <view>{{ accounts_name !== null && accounts_name !== $t('common.all') ? accounts_name : $t('cash-list.cash-list.n74r94') }}</view>
                    <view class="pa right-0"><iconfont :name="popup_accounts_status ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx"></iconfont></view>
                </view>
                <view class="flex-shrink flex-row align-c margin-right-xxxl padding-right-xl pr" @tap="popup_recharge_status_open_event">
                    <view>{{ recharge_status_name !== null && recharge_status_name !== $t('common.all') ? recharge_status_name : $t('invoice-detail.invoice-detail.rrfex6') }}</view>
                    <view class="pa right-0"><iconfont :name="popup_recharge_status_status ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx"></iconfont></view>
                </view>
                <view class="flex-shrink flex-row align-c padding-right-xl pr" @tap="popup_network_open_event">
                    <view>{{ network_name !== null && network_name !== $t('common.all') ? network_name : $t('cash-list.cash-list.2g251t') }}</view>
                    <view class="pa right-0"><iconfont :name="popup_network_status ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx"></iconfont></view>
                </view>
            </view>
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="padding-main">
                    <view v-if="data_list.length > 0">
                        <view v-for="(item, index) in data_list" :key="index" class="padding-main bg-white radius-md margin-bottom-main">
                            <view class="br-b-dashed padding-bottom-main margin-bottom-main flex-row jc-sb align-c">
                                <view class="cr-grey-9 title">{{ item.add_time }}</view>
                                <view :class="item.status == 0 ? 'cr-black' : item.status_type == 1 ? 'cr-grey-9' : 'cr-black'">{{ item.status_name }}</view>
                            </view>
                            <view class="convert-group-row">
                                <view class="margin-bottom-sm flex-row">
                                    <text class="cr-grey-9 title">{{$t('cash-list.cash-list.e6pffe')}}</text>
                                    <text class="fw-b warp">{{ item.cash_no }}</text>
                                </view>
                                <view class="margin-bottom-sm flex-row">
                                    <text class="cr-grey-9 title title">{{$t('cash-list.cash-list.2w20g2')}}</text>
                                    <text class="fw-b warp">{{ item.platform_name }}</text>
                                </view>
                                <view class="margin-bottom-sm flex-row">
                                    <text class="cr-grey-9 title title">{{$t('cash-list.cash-list.23ii8s')}}</text>
                                    <text class="fw-b warp">{{ item.network_name }}</text>
                                </view>
                                <view class="margin-bottom-sm flex-row">
                                    <text class="cr-grey-9 title title">{{$t('cash-list.cash-list.714g2h')}}</text>
                                    <text class="fw-b warp">{{ item.address }}</text>
                                </view>
                                <view class="flex-row">
                                    <text class="cr-grey-9 title">{{$t('cash-list.cash-list.1o8838')}}</text>
                                    <text class="fw-b warp">{{ item.coin }}</text>
                                </view>
                            </view>
                            <div v-if="item.status == 0" class="br-t-dashed padding-top-main margin-top-main flex-row jc-e align-c">
                                <button type="default" class="recharge-del-btn round margin-0" :data-id="item.id" @tap="cash_del_event">{{$t('common.del')}}</button>
                            </div>
                        </view>
                        <!-- 结尾 -->
                        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                    </view>
                    <view v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                    </view>
                </view>
            </scroll-view>
            <!-- 账户 -->
            <component-popup :propShow="popup_accounts_status" propPosition="top" :propTop="popup_top_height + 'px'" @onclose="popup_accounts_close_event">
                <view class="padding-vertical-lg">
                    <view class="padding-horizontal-main text-size-xs">{{$t('cash-list.cash-list.s7l616')}}</view>
                    <view class="popup_accounts_container padding-sm flex-row flex-wrap align-c tc text-size-md">
                        <view class="flex-width-half-half">
                            <view class="item margin-sm padding-vertical-sm" :class="accounts_list_index == null ? 'cr-main bg-main-light' : ''" :data-name="$t('common.all')" :data-value="null" :data-index="null" @tap="accounts_list_event">{{$t('common.all')}}</view>
                        </view>
                        <view v-for="(item, index) in accounts_list" class="flex-width-half-half" :key="index">
                            <view class="item margin-sm padding-vertical-sm" :class="accounts_list_index == index ? 'cr-main bg-main-light' : ''" :data-name="item.platform_name" :data-value="item.id" :data-index="index" @tap="accounts_list_event">{{ item.platform_name }}</view>
                        </view>
                    </view>
                    <view class="tc padding-top-lg br-t" @tap="popup_accounts_close_event">
                        <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                        <iconfont name="icon-arrow-top" color="#ccc"></iconfont>
                    </view>
                </view>
            </component-popup>
            <!-- 类型 -->
            <component-popup :propShow="popup_recharge_status_status" propPosition="top" :propTop="popup_top_height + 'px'" @onclose="popup_recharge_status_close_event">
                <view class="padding-vertical-lg">
                    <view class="padding-horizontal-main text-size-xs">{{$t('cash-list.cash-list.t66tu3')}}</view>
                    <view class="popup_accounts_container padding-sm flex-row flex-wrap align-c tc text-size-md">
                        <view class="flex-width-half-half">
                            <view class="item margin-sm padding-vertical-sm" :class="recharge_status_list_index == null ? 'cr-main bg-main-light' : ''" :data-name="$t('common.all')" :data-value="null" :data-index="null" @tap="recharge_status_list_event">{{$t('common.all')}}</view>
                        </view>
                        <view v-for="(item, index) in recharge_status_list" class="flex-width-half-half" :key="index">
                            <view class="item margin-sm padding-vertical-sm" :class="recharge_status_list_index == index ? 'cr-main bg-main-light' : ''" :data-name="item.name" :data-value="item.value" :data-index="index" @tap="recharge_status_list_event">{{ item.name }}</view>
                        </view>
                    </view>
                    <view class="tc padding-top-lg br-t" @tap="popup_recharge_status_close_event">
                        <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                        <iconfont name="icon-arrow-top" color="#ccc"></iconfont>
                    </view>
                </view>
            </component-popup>
            <!-- 网络 -->
            <component-popup :propShow="popup_network_status" propPosition="top" :propTop="popup_top_height + 'px'" @onclose="popup_network_close_event">
                <view class="padding-vertical-lg">
                    <view class="padding-horizontal-main text-size-xs">{{$t('cash-list.cash-list.311tt2')}}</view>
                    <view class="popup_accounts_container padding-sm flex-row flex-wrap align-c tc text-size-md">
                        <view class="flex-width-half-half">
                            <view class="item margin-sm padding-vertical-sm" :class="network_list_index == null ? 'cr-main bg-main-light' : ''" :data-name="$t('common.all')" :data-value="null" :data-index="null" @tap="network_list_event">{{$t('common.all')}}</view>
                        </view>
                        <view v-for="(item, index) in network_list" class="flex-width-half-half" :key="index">
                            <view class="item margin-sm padding-vertical-sm" :class="network_list_index == index ? 'cr-main bg-main-light' : ''" :data-name="item.name" :data-value="item.id" :data-index="index" @tap="network_list_event">{{ item.name }}</view>
                        </view>
                    </view>
                    <view class="tc padding-top-lg br-t" @tap="popup_network_close_event">
                        <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                        <iconfont name="icon-arrow-top" color="#ccc"></iconfont>
                    </view>
                </view>
            </component-popup>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    var wallet_static_url = app.globalData.get_static_url('coin', true) + 'app/';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                wallet_static_url: wallet_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: {},

                // 弹窗距离顶部距离
                popup_top_height: 0,

                // 账户
                popup_accounts_status: false,
                accounts_id: null,
                accounts_list_index: null,
                accounts_name: null,
                accounts_list: [],
                // 类型
                popup_recharge_status_status: false,
                status: null,
                recharge_status_list_index: null,
                recharge_status_name: null,
                recharge_status_list: [],
                // 网络
                popup_network_status: false,
                network_id: null,
                network_list_index: null,
                network_name: null,
                network_list: [],

                data_list: [],
                data_page_total: 0,
                data_page: 1,
                data_is_loading: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentPopup,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 设置参数
            this.setData({
                params: params,
                accounts_id: params.id || null,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始数据
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
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                    this.get_data_list();
                    var self = this;
                    var timer = setInterval(function () {
                        if (self.popup_top_height == 0) {
                            self.popup_top_height_computer();
                        } else {
                            clearInterval(timer);
                        }
                    }, 500);
                }
            },

            // 初始化数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('init', 'user', 'coin'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                accounts_list: data.accounts_list || [],
                                recharge_status_list: data.recharge_status_list || [],
                                network_list: data.network_list || [],
                            });
                            if (this.accounts_list.length > 0 && (this.accounts_id || null) != null) {
                                var index = this.accounts_list.findIndex((item) => item.id == this.accounts_id);
                                this.setData({
                                    accounts_list_index: index,
                                    accounts_id: this.accounts_list[index].id,
                                    accounts_name: this.accounts_list[index].platform_name,
                                });
                            }
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
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
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                var new_data = {
                    accounts_id: this.accounts_id,
                    network_id: this.network_id,
                    status: this.status,
                    page: this.data_page,
                };
                uni.request({
                    url: app.globalData.get_request_url('index', 'cash', 'coin'),
                    method: 'POST',
                    data: new_data,
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            // 数据列表
                            var data = res.data.data;
                            if (this.data_page <= 1) {
                                var temp_data_list = data.data_list || [];
                            } else {
                                var temp_data_list = this.data_list || [];
                                var temp_data = data.data_list;
                                for (var i in temp_data) {
                                    temp_data_list.push(temp_data[i]);
                                }
                            }

                            this.setData({
                                data_list: temp_data_list,
                                data_total: data.total,
                                data_page_total: data.page_total,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: '',
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });

                            // 是否还有数据
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 账户打开
            popup_accounts_open_event() {
                this.setData({
                    popup_accounts_status: !this.popup_accounts_status,
                    popup_recharge_status_status: false,
                    popup_network_status: false,
                });
            },

            // 账户关闭
            popup_accounts_close_event() {
                this.setData({
                    popup_accounts_status: false,
                });
            },

            // 账户选择
            accounts_list_event(e) {
                this.setData({
                    accounts_list_index: e.currentTarget.dataset.index,
                    accounts_id: e.currentTarget.dataset.value,
                    accounts_name: e.currentTarget.dataset.name,
                    popup_accounts_status: false,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 类型打开
            popup_recharge_status_open_event() {
                this.setData({
                    popup_recharge_status_status: !this.popup_recharge_status_status,
                    popup_accounts_status: false,
                    popup_network_status: false,
                });
            },

            // 类型关闭
            popup_recharge_status_close_event() {
                this.setData({
                    popup_recharge_status_status: false,
                });
            },

            // 类型选择
            recharge_status_list_event(e) {
                this.setData({
                    recharge_status_list_index: e.currentTarget.dataset.index,
                    status: e.currentTarget.dataset.value,
                    recharge_status_name: e.currentTarget.dataset.name,
                    popup_recharge_status_status: false,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 网络打开
            popup_network_open_event() {
                this.setData({
                    popup_network_status: !this.popup_network_status,
                    popup_accounts_status: false,
                    popup_recharge_status_status: false,
                });
            },

            // 网络关闭
            popup_network_close_event() {
                this.setData({
                    popup_network_status: false,
                });
            },

            // 网络选择
            network_list_event(e) {
                this.setData({
                    network_list_index: e.currentTarget.dataset.index,
                    network_id: e.currentTarget.dataset.value,
                    network_name: e.currentTarget.dataset.name,
                    popup_network_status: false,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 删除支付
            cash_del_event(e) {
                // 是否再次确认
                if (e.alert_status != 0 && e.alert_status != 1) {
                    app.globalData.alert({
                        msg: this.$t('cash-list.cash-list.8hrc73'),
                        is_show_cancel: 1,
                        object: this,
                        params: { id: e.currentTarget.dataset.id },
                        method: 'cash_del_event',
                    });
                    return false;
                }
                if (e.alert_status == 1) {
                    // 加载loding
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('delete', 'cash', 'coin'),
                        method: 'POST',
                        data: { ids: e.id },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    data_page: 1,
                                });
                                app.globalData.showToast(this.$t('common.del_success'), 'success');
                                this.get_data_list(1);
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(this.$t('common.del_fail'));
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

            // 计算搜索框的高度
            popup_top_height_computer() {
                const query = uni.createSelectorQuery();
                query
                    .select('.nav')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            // 获取搜索框高度
                            this.setData({
                                popup_top_height: res.height,
                            });
                        }
                    })
                    .exec();
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },
        },
    };
</script>
<style>
    @import './cash-list.css';
</style>
