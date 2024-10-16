<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <view v-if="(data_base || null) != null">
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="coin-title flex-col padding-lg" :style="'background-image:url(' + wallet_static_url + 'user-head-bg.png)'">
                    <view class="margin-bottom-main flex-row jc-sb align-c">
                        <view>
                            <view class="cr-base text-size-md">{{$t('user.user.67p34x')}}</view>
                            <view class="text-size-40 fw-b">{{ is_price_show ? accounts_summary : '***' }}</view>
                        </view>
                        <view @tap="price_change">
                            <iconfont :name="is_price_show ? 'icon-wodeqianbao-eye' : 'icon-eye-half'" size="44rpx"></iconfont>
                        </view>
                    </view>
                    <view class="flex-row jc-sb padding-bottom-main">
                        <view v-if="data_base.is_enable_recharge == 1" class="tc text-size-xs" data-value="/pages/plugins/coin/recharge/recharge" @tap="url_event">
                            <view class="coin-operate-list bg-white flex-row align-c jc-c margin-bottom-main">
                                <iconfont name="icon-recharge" size="44rpx" color="#635BFF"></iconfont>
                            </view>
                            <view>{{$t('recharge.recharge.otwkjn')}}</view>
                        </view>
                        <view v-if="data_base.is_enable_convert == 1" class="tc text-size-xs" data-value="/pages/plugins/coin/convert/convert" @tap="url_event">
                            <view class="coin-operate-list bg-white flex-row align-c jc-c margin-bottom-main">
                                <iconfont name="icon-convert-o" size="44rpx" color="#635BFF"></iconfont>
                            </view>
                            <view>{{$t('pages.plugins-coin-convert')}}</view>
                        </view>
                        <view v-if="data_base.is_enable_cash == 1" class="tc text-size-xs" data-value="/pages/plugins/coin/cash/cash" @tap="url_event">
                            <view class="coin-operate-list bg-white flex-row align-c jc-c margin-bottom-main">
                                <iconfont name="icon-cash" size="44rpx" color="#635BFF"></iconfont>
                            </view>
                            <view>{{$t('user.user.8752a4')}}</view>
                        </view>
                        <view class="tc text-size-xs" data-value="/pages/plugins/coin/detail/detail" data-method="true" @tap="url_event">
                            <view class="coin-operate-list bg-white flex-row align-c jc-c margin-bottom-main">
                                <iconfont name="icon-detail" size="44rpx" color="#635BFF"></iconfont>
                            </view>
                            <view>{{$t('pages.plugins-coin-detail')}}</view>
                        </view>
                    </view>
                </view>
                <view v-if="accounts_list.length > 0" class="coin-content padding-lg">
                    <view class="bg-white radius-lg padding-sm">
                        <view class="coin-item padding-main">
                            <view v-for="(item, index) in accounts_list" :key="index" class="flex-row jc-sb align-c" :class="accounts_list.length == index + 1 ? '' : 'br-b-f5 margin-bottom-lg padding-bottom-lg'" :data-value="'/pages/plugins/coin/detail/detail?id=' + item.id" @tap="url_event">
                                <view class="flex-1 flex-width flex-row align-c padding-right-main">
                                    <image v-if="item.platform_icon" :src="item.platform_icon" mode="widthFix" class="coin-content-list-img round" />
                                    <text class="fw-b single-text margin-left-main">{{ item.platform_name }}</text>
                                </view>
                                <view class="flex-col align-e">
                                    <view class="margin-bottom-xss text-size">{{ item.platform_symbol }} {{ item.normal_coin }}</view>
                                    <view class="cr-grey-9 text-size-xs">{{ item.default_symbol }} {{ item.default_coin }}</view>
                                </view>
                            </view>
                            <!-- 结尾 -->
                            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data propStatus="0"></component-no-data>
                </view>
            </scroll-view>
            <!-- 明细 -->
            <component-popup :propShow="popup_user_detail_status" propPosition="bottom" @onclose="popup_user_detail_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="oh">
                        <text class="text-size">{{$t('pages.plugins-coin-detail')}}</text>
                        <view class="fr" @tap.stop="popup_user_detail_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="popup_user_detail_container padding-vertical-main flex-row flex-wrap align-c tc text-size">
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/recharge-list/recharge-list" @tap="url_event">{{$t('pages.plugins-coin-recharge-list')}}</view>
                        </view>
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/transfer-list/transfer-list" @tap="url_event">{{$t('pages.plugins-coin-transfer-list')}}</view>
                        </view>
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/transaction-list/transaction-list" @tap="url_event">{{$t('pages.plugins-coin-transaction-list')}}</view>
                        </view>
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/cash-list/cash-list" @tap="url_event">{{$t('pages.plugins-coin-cash-list')}}</view>
                        </view>
                        <view class="flex-width-half">
                            <view class="item padding-vertical-lg radius margin-sm" data-value="/pages/plugins/coin/convert-list/convert-list" @tap="url_event">{{$t('pages.plugins-coin-convert-list')}}</view>
                        </view>
                    </view>
                </view>
            </component-popup>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
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
                status_bar_height: bar_height,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,

                // 是否显示虚拟币
                is_price_show: false,
                data_base: null,
                // 虚拟币数量
                accounts_summary: 0,
                accounts_list: [],
                // 明细弹窗
                popup_user_detail_status: false,
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentPopup,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
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
            this.get_data();
        },
        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'user', 'coin'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                accounts_list: data.accounts_list || [],
                                accounts_summary: data.accounts_summary || 0,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                                data_bottom_line_status: false,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 显示隐藏虚拟币
            price_change() {
                this.setData({
                    is_price_show: !this.is_price_show,
                });
            },

            // 明细弹窗打开
            popup_user_detail_open_event() {
                this.setData({
                    popup_user_detail_status: true,
                });
            },
            // 明细弹窗关闭
            popup_user_detail_close_event(e) {
                this.setData({
                    popup_user_detail_status: false,
                });
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },

            // url事件
            url_event(e) {
                if (e.currentTarget.dataset.method) {
                    this.popup_user_detail_open_event();
                } else {
                    app.globalData.url_event(e);
                }
            },
        },
    };
</script>
<style>
    @import './user.css';
</style>
