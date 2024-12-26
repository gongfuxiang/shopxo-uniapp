<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <block v-if="accounts_list.length > 0">
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="recharge-title flex-col padding-lg">
                    <view v-if="(accounts || mull) != null" class="margin-bottom-xxxl flex-row jc-sb margin-top-xl">
                        <view class="cr-white flex-1 flex-width">
                            <view class="coin-dropdown margin-bottom-main">
                                <view class="flex-row align-c pr" @tap="popup_coin_status_open_event">
                                    <image v-if="(accounts.platform_icon || null) != null" :src="accounts.platform_icon" mode="widthFix" class="coin-content-list-img round" />
                                    <text class="margin-left-xs">{{ accounts.platform_name }}</text>
                                    <view class="coin-dropdown-icon pa padding-left-xxl">
                                        <iconfont name="icon-arrow-bottom" size="24rpx" color="#fff"></iconfont>
                                    </view>
                                </view>
                            </view>
                            <view class="text-size-xl fw-b single-text">{{ accounts.normal_coin }}</view>
                        </view>
                        <view class="recharge-qrcode">
                            <block v-if="accounts.platform_data.recharge_qrcode">
                                <image :src="accounts.platform_data.recharge_qrcode" mode="widthFix" class="img margin-right-xs radius dis-block" :data-value="accounts.platform_data.recharge_qrcode" @tap="recharge_qrcode_event" />
                            </block>
                            <block v-else>
                                <iconfont name="icon-qrcode" size="160rpx" color="#f6f6f6"></iconfont>
                            </block>
                        </view>
                    </view>
                </view>
                <view class="recharge-content padding-xxl bg-white">
                    <view class="margin-bottom-xxxl">
                        <view class="margin-bottom-main">{{$t('recharge.recharge.lh6k86')}}</view>
                        <view class="recharge-content-input-bg padding-main border-radius-sm flex-row align-c">
                            <view class="single-text padding-right-sm flex-1 flex-width">{{ accounts.platform_data.recharge_address }}</view>
                            <view :data-value="accounts.platform_data.recharge_address" @tap.stop="text_copy_event">
                                <iconfont name="icon-copy" size="24rpx" color="#999"></iconfont>
                            </view>
                        </view>
                    </view>
                    <view class="margin-bottom-xxxl">
                        <view class="margin-bottom-main">{{$t('recharge.recharge.e5rblc')}}</view>
                        <block v-if="network_list.length > 0">
                            <picker class="recharge-content-input-bg padding-main border-radius-sm" @change="recharge_event" :value="network_list_index" :range="network_list" range-key="name">
                                <view class="picker arrow-bottom">
                                    {{ network_list[network_list_index]['name'] }}
                                </view>
                            </picker>
                        </block>
                        <view v-else class="cr-grey">{{$t('cash.cash.1g49wo')}}</view>
                    </view>
                    <view class="margin-bottom-xxxl">
                        <view v-if="accounts.platform_data.preset_data.length > 0">
                            <view class="margin-bottom-xs">{{$t('recharge.recharge.eb6722')}}</view>
                            <view class="flex-row flex-wrap recharge-price-item margin-bottom-xs">
                                <block v-for="(item, index) in accounts.platform_data.preset_data" :key="index">
                                    <view class="recharge-price-list flex-col align-c jc-c pr" :class="preset_data_index == index ? 'active' : ''" :data-index="index" :data-value="item.value" @tap="preset_data_change">
                                        <view class="flex-row align-c jc-c">
                                            <image :src="wallet_static_url + 'recharge-price.png'" mode="widthFix" class="recharge-price-img round" />
                                            <view class="margin-left-xs recharge-price-name">{{ item.value }}</view>
                                        </view>
                                        <view class="margin-top-sm cr-grey-9 text-size-xs">10000</view>
                                        <view v-if="item.tips" class="recharge-price-badge text-size-xss cr-white single-text">{{ item.tips }}</view>
                                    </view>
                                </block>
                            </view>
                        </view>
                        <view class="recharge-content-input-bg padding-main border-radius-sm flex-row align-c margin-bottom-xxl">
                            <text>{{$t('recharge.recharge.k1e7hs')}}</text>
                            <view class="padding-left-lg">
                                <input type="digit" name="coin" :value="recharge_num" placeholder-class="text-size-md cr-grey-9" :placeholder="$t('recharge.recharge.0i541i')" @input="recharge_num_change" />
                            </view>
                        </view>
                        <button type="default" class="recharge-btn cr-white round" @tap="recharge_submit">{{$t('recharge.recharge.x27b25')}}</button>
                    </view>
                    <view v-if="accounts.platform_data.recharge_desc.length > 0" class="margin-bottom-xxxl">
                        <view class="margin-bottom-main">{{$t('recharge.recharge.e8n7ul')}}</view>
                        <view class="recharge-content-tips">
                            <view v-for="(item, index) in accounts.platform_data.recharge_desc" :key="index" class="item pr padding-left-xl margin-bottom-sm cr-grey-9 text-size-xs">{{ item }}</view>
                        </view>
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
                            <view v-for="(item, index) in accounts_list" :key="index" class="flex-row jc-sb align-c padding-vertical-main" :class="accounts_list.length == index + 1 ? '' : 'br-b-f9'" :data-value="item" :data-index="index" @tap="coin_checked_event">
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
            </component-popup>
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

                // 账户
                accounts: {},
                // 虚拟币下拉框探弹窗状态
                popup_coin_status: false,
                // 虚拟币下拉框list
                accounts_list: [],
                // 充币网络
                network_list_index: 0,
                network_list: [],
                // 充值选中下标
                preset_data_index: null,
                // 充值数量
                recharge_num: '',
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
                    url: app.globalData.get_request_url('createinfo', 'recharge', 'coin'),
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

            // 虚拟币切换
            coin_checked_event(e) {
                this.setData({
                    accounts: this.accounts_list[e.currentTarget.dataset.index],
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
            recharge_event(e) {
                this.setData({
                    network_list_index: parseInt(e.detail.value || 0),
                });
            },
            // 充值币选中
            recharge_num_change(e) {
                this.setData({
                    recharge_num: e.detail.value,
                });
            },
            // 其他充值数量
            preset_data_change(e) {
                this.setData({
                    preset_data_index: parseInt(e.currentTarget.dataset.index || 0),
                    recharge_num: parseInt(e.currentTarget.dataset.value || 0),
                });
            },
            // 立即充值
            recharge_submit() {
                if(this.network_list.length == 0) {
                    app.globalData.showToast(this.$t('cash.cash.en6vsa'));
                    return false;
                }

                // 表单数据
                var new_data = {
                    accounts_id: this.accounts.id,
                    network_id: this.network_list[this.network_list_index].id,
                    address: this.accounts.platform_data.recharge_address,
                    coin: this.recharge_num,
                };
                // 数据校验
                var validation = [{ fields: 'coin', msg: this.$t('recharge.recharge.5q02ar') }];

                // 验证提交表单
                if (app.globalData.fields_check(new_data, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('create', 'recharge', 'coin'),
                        method: 'POST',
                        data: new_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.url_open('/pages/plugins/coin/recharge-list/recharge-list', true);
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
            
            // 二维码预览
            recharge_qrcode_event(e) {
                app.globalData.image_show_event(e);
            }
        },
    };
</script>
<style>
    @import './recharge.css';
</style>
