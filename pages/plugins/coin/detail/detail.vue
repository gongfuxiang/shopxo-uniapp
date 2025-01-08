<template>
    <view :class="theme_view">
        <component-nav-back :propName="$t('detail.detail.yvmu0z')"></component-nav-back>
        <view v-if="accounts_list.length > 0">
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="coin-title flex-col padding-lg">
                    <view v-if="accounts_list.length > 0 && (accounts || null) != null" class="margin-bottom-xxxxl padding-bottom-main flex-row jc-sb align-c">
                        <view class="flex-row">
                            <image v-if="(accounts.platform_icon || null) != null" :src="accounts.platform_icon" mode="widthFix" class="coin-content-list-img round" />
                            <view class="padding-left-main">
                                <view class="coin-dropdown text-size-md pr margin-bottom-xs flex-row" @tap="popup_coin_status_open_event">
                                    <text class="cr-666">{{ accounts.platform_name }}</text>
                                    <view class="padding-left-sm">
                                        <iconfont name="icon-arrow-bottom" size="24rpx" color="#666"></iconfont>
                                    </view>
                                </view>
                                <view>
                                    <text class="fw-b text-size">{{ is_price_show ? accounts.normal_coin : '***' }}</text>
                                    <text v-if="is_price_show" class="cr-grey-9 text-size-xs margin-left">{{ accounts.default_symbol }} {{ accounts.default_coin }}</text>
                                </view>
                            </view>
                        </view>
                        <view @tap="price_change">
                            <iconfont :name="is_price_show ? 'icon-wodeqianbao-eye' : 'icon-eye-half'" size="44rpx"></iconfont>
                        </view>
                    </view>
                    <view class="flex-row jc-sb">
                        <view v-for="(item, index) in coin_oprate_list" class="flex-1 padding-sm tc text-size-md" :key="index" :data-value="item.url" :data-method="item.method" @tap="url_event">
                            <view class="coin-oprate-list bg-white flex-row align-c jc-c">
                                <view class="pr top-xs">
                                    <iconfont :name="item.icon" size="28rpx" color="#635BFF"></iconfont>
                                </view>
                                <view class="margin-left-sm fw-b">{{ item.name }}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="coin-content padding-lg pr">
                    <block v-if="log_list.length > 0" >
                        <view v-for="(item, index) in log_list" :key="index" class="bg-white radius-md padding-main margin-bottom-main">
                            <view class="br-b-dashed padding-bottom-main margin-bottom-main flex-row jc-sb align-c">
                                <view>{{ item.coin_type_name }}</view>
                                <view class="cr-grey-9">{{ item.add_time }}</view>
                            </view>
                            <view>
                                <view class="margin-bottom-sm flex-row">
                                    <text class="cr-grey-9">{{$t('detail.detail.4w20tq')}}</text>
                                    <text class="fw-b warp">{{ item.operate_type_name }}</text>
                                </view>
                                <view class="margin-bottom-sm flex-row">
                                    <text class="cr-grey-9">{{$t('detail.detail.s101d1')}}</text>
                                    <text class="fw-b warp">{{ item.operate_coin }}</text>
                                </view>
                                <view class="margin-bottom-sm flex-row">
                                    <text class="cr-grey-9">{{$t('detail.detail.e30wj1')}}</text>
                                    <text class="fw-b warp">{{ item.original_coin }}</text>
                                </view>
                                <view class="flex-row">
                                    <text class="cr-grey-9">{{$t('detail.detail.jdour8')}}</text>
                                    <text class="fw-b warp">{{ item.latest_coin }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="tc cr-grey cp" :data-value="'/pages/plugins/coin/transaction-list/transaction-list?id=' + accounts.id" @tap="url_event">
                            <text class="va-m">{{$t('detail.detail.7fhy2u')}}</text>
                            <view class="dis-inline-block va-m margin-top-xs margin-left-xs">
                                <iconfont name="icon-arrow-right" color="#999"></iconfont>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                    </block>
                </view>
            </scroll-view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <!-- 虚拟币下拉框 -->
        <component-popup :propShow="popup_coin_status" propPosition="bottom" @onclose="popup_coin_status_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="oh">
                    <view class="fr" @tap.stop="popup_coin_status_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="popup_coin_status_container padding-vertical-main flex-col text-size">
                    <view class="scroll-y">
                        <view v-for="(item, index) in accounts_list" :key="index">
                            <view class="flex-row jc-sb align-c padding-vertical-main" :class="accounts_list.length == index + 1 ? '' : 'br-b-f9'" :data-value="item" :data-index="index" @tap="coin_checked_event">
                                <view class="flex-row align-c">
                                    <image v-if="item.platform_icon" :src="item.platform_icon" mode="widthFix" class="coin-list-img round" />
                                    <view class="margin-left-sm text-size-md single-text">{{ item.platform_name }}</view>
                                </view>
                                <view>
                                    <iconfont :name="accounts.id == item.id ? 'icon-zhifu-yixuan cr-red' : 'icon-zhifu-weixuan'" size="40rpx"></iconfont>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>
        <!-- 明细 -->
        <component-popup :propShow="popup_user_detail_status" propPosition="bottom" @onclose="popup_user_detail_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="oh">
                    <text class="text-size">{{$t('pages.plugins-coin-detail')}}</text>
                    <view class="fr" @tap.stop="popup_user_detail_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view v-if="accounts_list.length > 0 && (accounts || null) != null" class="popup_user_detail_container padding-vertical-main flex-row flex-wrap align-c tc text-size">
                    <view class="flex-width-half">
                        <view class="item padding-vertical-lg radius margin-sm" :data-value="'/pages/plugins/coin/recharge-list/recharge-list?id=' + accounts.id" @tap="url_event">{{$t('pages.plugins-coin-recharge-list')}}</view>
                    </view>
                    <view class="flex-width-half">
                        <view class="item padding-vertical-lg radius margin-sm" :data-value="'/pages/plugins/coin/transfer-list/transfer-list?id=' + accounts.id" @tap="url_event">{{$t('pages.plugins-coin-transfer-list')}}</view>
                    </view>
                    <view class="flex-width-half">
                        <view class="item padding-vertical-lg radius margin-sm" :data-value="'/pages/plugins/coin/transaction-list/transaction-list?id=' + accounts.id" @tap="url_event">{{$t('pages.plugins-coin-transaction-list')}}</view>
                    </view>
                    <view class="flex-width-half">
                        <view class="item padding-vertical-lg radius margin-sm" :data-value="'/pages/plugins/coin/cash-list/cash-list?id=' + accounts.id" @tap="url_event">{{$t('pages.plugins-coin-cash-list')}}</view>
                    </view>
                    <view class="flex-width-half">
                        <view class="item padding-vertical-lg radius margin-sm" :data-value="'/pages/plugins/coin/convert-list/convert-list?id=' + accounts.id" @tap="url_event">{{$t('pages.plugins-coin-convert-list')}}</view>
                    </view>
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
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';
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
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',

                // 虚拟币下拉框探弹窗状态
                popup_coin_status: false,
                // 虚拟币下拉框list
                accounts_list: [],
                // 账户
                accounts: {},

                // 是否显示虚拟币
                is_price_show: false,
                // 虚拟币操作列表
                coin_oprate_list: [],

                // 明细弹窗
                popup_user_detail_status: false,

                // 日志列表
                log_list: [],
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentPopup,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 设置参数
            this.setData({
                params: params,
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
                    url: app.globalData.get_request_url('detail', 'accounts', 'coin'),
                    method: 'POST',
                    data: {id: this.accounts.id || this.params.id || null},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                accounts: data.accounts || {},
                                accounts_list: data.accounts_list || [],
                                log_list: data.log_list || [],
                                accounts_summary: data.accounts_summary || 0,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                            });

                            // 操作导航
                            var temp_coin_oprate_list = [];
                            if(parseInt(this.accounts.platform_data.is_enable_transfer || 0) == 1) {
                                temp_coin_oprate_list.push({
                                    name: this.$t('user.user.29f6n5'),
                                    icon: 'icon-transfer-count',
                                    url: '/pages/plugins/coin/transfer/transfer?id=' + this.accounts.id,
                                });
                            }
                            temp_coin_oprate_list.push({
                                name: this.$t('index.index.6941e7'),
                                icon: 'icon-collection',
                                url: '/pages/plugins/coin/collection/collection?accounts_key=' + this.accounts.accounts_key,
                            });
                            temp_coin_oprate_list.push({
                                name: this.$t('pages.plugins-coin-detail'),
                                icon: 'icon-detail',
                                url: '',
                                method: true,
                            });
                            this.setData({
                                coin_oprate_list: temp_coin_oprate_list
                            });
                        } else {
                            this.setData({
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

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },

            // 虚拟币切换
            coin_checked_event(e) {
                this.setData({
                    accounts: this.accounts_list[e.currentTarget.dataset.index],
                    popup_coin_status: false,
                    log_list: [],
                    data_list_loding_status: 1,
                });
                this.get_data();
            },
            popup_coin_status_open_event() {
                this.setData({
                    popup_coin_status: !this.popup_coin_status,
                });
            },
            popup_coin_status_close_event() {
                this.setData({
                    popup_coin_status: false,
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
    @import './detail.css';
</style>
