<template>
    <view :class="theme_view">
        <view class="transfer-accounts">
            <view class="padding-main bg-white pr nav flex-row">
                <view class="flex-row align-c margin-right-main" @tap="popup_wallet_open_event">
                    <view>钱包</view>
                    <view class="padding-left-sm"><iconfont :name="popup_wallet_status ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx"></iconfont></view>
                </view>
            </view>
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event" @scrolltolower="scroll_lower">
                <view class="padding-main">
                    <view v-for="(item, index) in data" :key="index" class="padding-main bg-white radius-md margin-bottom-main">
                        <view class="br-b-dashed padding-bottom-main margin-bottom-main flex-row jc-sb align-c">
                            <view>转账时间</view>
                            <view class="cr-grey-9">{{ item.date }}</view>
                        </view>
                        <view>
                            <view class="margin-bottom-sm flex-row">
                                <text class="cr-grey-9">收款人：</text>
                                <text class="fw-b">{{ item.payee }}</text>
                            </view>
                            <view class="margin-bottom-sm flex-row">
                                <text class="cr-grey-9">转账金额：</text>
                                <text class="fw-b">{{ item.transfer_amount }}</text>
                            </view>
                            <view class="flex-row">
                                <text class="cr-grey-9">转账备注：</text>
                                <text class="fw-b">{{ item.transfer_note }}</text>
                            </view>
                        </view>
                    </view>
                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
            </scroll-view>
            <!-- 钱包 -->
            <component-popup :propShow="popup_wallet_status" propPosition="top" :propTop="popup_top_height + 'px'" @onclose="popup_wallet_close_event">
                <view class="padding-vertical-lg">
                    <view class="padding-horizontal-main text-size-xs">钱包种类</view>
                    <view class="popup_wallet_container padding-sm flex-row flex-warp align-c tc text-size-md">
                        <view v-for="(item, index) in accounts_list" class="flex-width-half-half" :key="index">
                            <view class="item margin-sm padding-vertical-sm" :class="accounts_list_index === index ? 'cr-main bg-main-light' : ''" :data-index="index" :data-id="item.id" @tap="wallet_event">{{ item.platform_name }}</view>
                        </view>
                    </view>
                    <view class="tc padding-top-lg br-t" @tap="popup_wallet_close_event">
                        <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                        <iconfont name="icon-arrow-top" color="#ccc"></iconfont>
                    </view>
                </view>
            </component-popup>
        </view>
    </view>
</template>
<script>
    const app = getApp();
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

                // 弹窗距离顶部距离
                popup_top_height: 0,

                // 钱包
                popup_wallet_status: false,
                accounts_list_index: 0,
                accounts_list: [],
                transfer_id: null,
                data: [],
                data_page_total: 0,
                data_page: 1,
                data_is_loading: 0,
            };
        },

        components: {
            componentNoData,
            componentPopup,
            componentBottomLine,
        },
        props: {},

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();

            this.init();
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
                    this.init_data();
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
            init_data() {
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
                            });
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
                uni.request({
                    url: app.globalData.get_request_url('index', 'transfer', 'coin'),
                    method: 'POST',
                    data: { send_accounts_id: this.transfer_id, page: this.data_page },
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data_list.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data_list;
                                } else {
                                    var temp_data_list = this.data || [];
                                    var temp_data = res.data.data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data: temp_data_list,
                                    data_page_total: data.page_total,
                                    data_page: this.page + 1,
                                    data_list_loding_msg: '',
                                    data_list_loding_status: 3,
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
                                if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 钱包打开
            popup_wallet_open_event() {
                if (!this.popup_type_status) {
                    this.setData({
                        popup_wallet_status: !this.popup_wallet_status,
                    });
                }
            },

            // 钱包关闭
            popup_wallet_close_event() {
                this.setData({
                    popup_wallet_status: false,
                });
            },

            // 钱包选择
            wallet_event(e) {
                this.setData({
                    accounts_list_index: e.currentTarget.dataset.index,
                    transfer_id: e.currentTarget.dataset.id,
                    popup_wallet_status: false,
                });
                this.get_data_list();
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
            scroll_event(e) {},

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },
        },
    };
</script>
<style>
    @import './transfer-accounts-detail.css';
</style>
