<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <block v-if="accounts_list.length > 0">
            <view class="cash">
                <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                    <view class="title flex-col padding-lg">
                        <view class="margin-bottom-xxxl flex-row jc-sb margin-top-xl">
                            <view v-if="(accounts || mull) != null" class="cr-white">
                                <view class="flex-row align-e margin-bottom-main">
                                    <view class="flex-row align-c pr coin-dropdown" @tap="popup_coin_status_open_event">
                                        <image v-if="(accounts.platform_icon || null) != null" :src="accounts.platform_icon" mode="widthFix" class="coin-content-list-img round" />
                                        <text class="margin-left-xs">{{ accounts.platform_name }}</text>
                                        <view class="coin-dropdown-icon pa padding-left-xxl">
                                            <iconfont name="icon-arrow-bottom" size="24rpx" color="#fff"></iconfont>
                                        </view>
                                    </view>
                                    <view class="text-size-xs fw-b padding-left-main text">{{$t('cash.cash.zmhf3n')}}</view>
                                </view>
                                <view class="flex-row align-e">
                                    <view class="text-size-40 fw-b">{{ accounts.normal_coin }}</view>
                                    <view class="padding-left-sm margin-bottom-main cr-grey-d">{{ accounts.default_symbol }} {{ accounts.default_coin }}</view>
                                </view>
                            </view>
                            <view class="detail pa right-0 fw-b cr-white" :data-value="'/pages/plugins/coin/cash-list/cash-list?id='+accounts.id" @tap="url_event">{{$t('pages.plugins-coin-cash-list')}}</view>
                        </view>
                    </view>
                    <view class="content padding-main">
                        <view class="padding-xxxl bg-white radius-md margin-bottom-main">
                            <view class="margin-bottom-xxxl">
                                <view class="margin-bottom-main fw-b">{{$t('cash.cash.f6p4hm')}}</view>
                                <view class="padding-vertical-main br-b-e flex-row align-c">
                                    <input type="digit" :value="coin_num" class="flex-1 flex-width" placeholder-class="text-size-md cr-grey-9" :placeholder="$t('common.please_input')" @input="coin_num_change" />
                                    <view @tap.stop="all_cash_event">{{$t('cash.cash.6oc6e7')}}</view>
                                </view>
                            </view>
                            <view class="margin-bottom-xxxl">
                                <view class="margin-bottom-main">{{$t('cash.cash.ucg8e2')}}</view>
                                <view class="recharge-content-input-bg padding-main border-radius-sm flex-row align-c">
                                    <input type="text" name="coin_address" class="padding-right-sm flex-1 flex-width" :value="coin_address" placeholder-class="text-size-md cr-grey-9" :placeholder="$t('cash.cash.i1f373')" @input="coin_address_change" />
                                </view>
                            </view>
                            <view>
                                <view class="margin-bottom-main">{{$t('cash.cash.h9i16y')}}</view>
                                <block v-if="network_list.length > 0">
                                    <picker class="content-input-bg padding-main margin-bottom-main border-radius-sm" @change="cash_event" :value="network_list_index" :range="network_list" range-key="name">
                                        <view class="picker arrow-bottom">
                                            {{ network_list[network_list_index]['name'] }}
                                        </view>
                                    </picker>
                                </block>
                                <view v-else class="cr-grey margin-bottom">{{$t('cash.cash.1g49wo')}}</view>
                                <view class="content-input-bg padding-main border-radius-sm">
                                    <input type="text" name="user_note" :value="user_note" placeholder-class="text-size-md cr-grey-9" :placeholder="$t('cash.cash.g05p4g')" @input="user_note_change" />
                                </view>
                            </view>
                        </view>
                        <!-- <view class="padding-main bg-white radius-md">
                            <view class="padding-vertical-sm border-radius-sm flex-row align-c">
                                <text class="text-size fw-b">支付密码</text>
                                <view class="padding-left-lg">
                                    <input type="digit" name="coin" :value="pay_pwd" placeholder-class="text-size-md cr-grey-9" placeholder="请输入支付密码" />
                                </view>
                            </view>
                        </view> -->
                        <view class="padding-xxxl">
                            <button type="default" class="cash-btn cr-white round" @tap="apply_for_cash_event">{{$t('cash.cash.42b37m')}}</button>
                        </view>
                    </view>
                </scroll-view>
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
                                    <view class="flex-row jc-sb align-c padding-vertical-main" :class="accounts_list.length == index + 1 ? '' : 'br-b-f9'" :data-value="item.id" :data-index="index" @tap="coin_checked_event">
                                        <view class="flex-row align-c">
                                            <image v-if="platform_icon" :src="item.platform_icon" mode="widthFix" class="coin-list-img round" />
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
            </view>
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
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: {},

                // 虚拟币
                coin_num: '',
                
                // 账户
                accounts: {},

                // 虚拟币下拉框探弹窗状态
                popup_coin_status: false,
                // 虚拟币下拉框list
                accounts_list: [],
                // 充币网络
                network_list_index: 0,
                network_list: [],
                // 提币地址
                coin_address: '',
                // 备注
                user_note: '',
                // 支付密码
                pay_pwd: '',
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
                    url: app.globalData.get_request_url('createinfo', 'cash', 'coin'),
                    method: 'POST',
                    data: {accounts_id : this.accounts.id || this.params.id || null},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                accounts: data.accounts || {},
                                accounts_list: data.accounts_list || [],
                                network_list: data.network_list || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.is_login_check(res.data, this, 'get_data');
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
                this.setData({});
            },

            // 虚拟币切换
            coin_checked_event(e) {
                this.setData({
                    accounts: this.accounts_list[e.currentTarget.dataset.index],
                    coin_num: '',
                    popup_coin_status: false,
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

            // 充币网络切换
            cash_event(e) {
                this.setData({
                    network_list_index: parseInt(e.detail.value || 0),
                });
            },

            // 全部提现
            all_cash_event(e) {
                this.setData({
                    coin_num: this.accounts.normal_coin || '',
                });
            },

            // 提币地址
            coin_address_change(e) {
                this.setData({
                    coin_address: e.detail.value,
                });
            },

            // 提现数量
            coin_num_change(e) {
                this.setData({
                    coin_num: e.detail.value,
                });
            },

            // 备注
            user_note_change(e) {
                this.setData({
                    user_note: e.detail.value,
                });
            },

            // 申请提现
            apply_for_cash_event() {
                if(this.network_list.length == 0) {
                    app.globalData.showToast(this.$t('cash.cash.en6vsa'));
                    return false;
                }

                // 表单数据
                var new_data = {
                    accounts_id: this.accounts.id,
                    network_id: this.network_list[this.network_list_index].id,
                    address: this.coin_address,
                    coin: this.coin_num,
                    user_note: this.user_note,
                };
                // 数据校验
                var validation = [
                    { fields: 'coin', msg: this.$t('cash.cash.w01qjc') },
                    { fields: 'address', msg: this.$t('cash.cash.i1f373') },
                ];
                // 验证提交表单
                if (app.globalData.fields_check(new_data, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('create', 'cash', 'coin'),
                        method: 'POST',
                        data: new_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.url_open('/pages/plugins/coin/cash-list/cash-list', true);
                                }, 1000);
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.stopPullDownRefresh();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },

            // 复制文本
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './cash.css';
</style>
