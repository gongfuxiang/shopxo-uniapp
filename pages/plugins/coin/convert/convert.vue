<template>
    <view :class="theme_view">
        <view v-if="accounts_list.length > 0">
            <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
                <view class="padding-main pr">
                    <view class="padding-lg bg-white radius-md margin-bottom-main">
                        <view class="br-f5 margin-bottom-main radius-md padding-lg flex-row jc-sb">
                            <view>
                                <view class="flex-row align-c pr coin-dropdown" @tap="popup_coin_status_event(1)">
                                    <image v-if="accounts_list[send_accounts_id_index]['platform_icon']" :src="accounts_list[send_accounts_id_index]['platform_icon']" mode="widthFix" class="coin-content-list-img round" />
                                    <text class="margin-left-sm fw-b single-text">{{ accounts_list[send_accounts_id_index]['platform_name'] }}</text>
                                    <view class="coin-dropdown-icon pa padding-left-xxl">
                                        <iconfont name="icon-arrow-bottom" size="24rpx" color="#666"></iconfont>
                                    </view>
                                </view>
                                <view class="margin-top-main text-size-xs flex-row align-c">
                                    <text class="margin-right-sm">{{$t('convert.convert.o56h58')}}</text><text class="cr-blue">{{ accounts_list[send_accounts_id_index]['platform_symbol'] }} {{ accounts_list[send_accounts_id_index]['normal_coin'] }}</text>
                                </view>
                            </view>
                            <view class="coin-num pr flex-col">
                                <input type="digit" name="coin" :value="default_value" class="num input-br text-size" placeholder-class="text-size-sm cr-grey-9" :placeholder="$t('common.please_input')" @input="default_coin_change_event" />
                                <view class="margin-top-main tr text-size-xs">{{ accounts_list[send_accounts_id_index]['platform_symbol'] }} {{ accounts_list[send_accounts_id_index]['default_coin'] }}</view>
                            </view>
                        </view>
                        <view class="coin-center-convert pa flex-row jc-c align-c" @tap="coin_center_convert_event(2)">
                            <iconfont name="icon-convert" class="pa convert-icon" :class="convert_bool ? 'convert_true' : 'convert_false'" color="#1D7DEF" size="36rpx"></iconfont>
                        </view>
                        <view class="br-f5 margin-bottom-main radius-md padding-lg flex-row jc-sb">
                            <view>
                                <view class="flex-row align-c pr coin-dropdown" @tap="popup_coin_status_event">
                                    <image v-if="accounts_list[receive_accounts_id_index]['platform_icon']" :src="accounts_list[receive_accounts_id_index]['platform_icon']" mode="widthFix" class="coin-content-list-img round" />
                                    <text class="margin-left-sm fw-b single-text">{{ accounts_list[receive_accounts_id_index]['platform_name'] }}</text>
                                    <view class="coin-dropdown-icon pa padding-left-xxl">
                                        <iconfont name="icon-arrow-bottom" size="24rpx" color="#666"></iconfont>
                                    </view>
                                </view>
                                <view class="margin-top-main text-size-xs flex-row align-c">
                                    <text class="margin-right-sm">{{$t('convert.convert.o56h58')}}</text><text class="cr-blue">{{ accounts_list[receive_accounts_id_index]['platform_symbol'] }} {{ accounts_list[receive_accounts_id_index]['normal_coin'] }}</text>
                                </view>
                            </view>
                            <view class="coin-num pr flex-col">
                                <input type="digit" :value="convert_value" class="num text-size" placeholder-class="text-size-sm cr-grey-9" disabled />
                                <view class="margin-top-main tr text-size-xs">{{ accounts_list[receive_accounts_id_index]['platform_symbol'] }} {{ accounts_list[receive_accounts_id_index]['default_coin'] }}</view>
                            </view>
                        </view>
                        <view class="flex-row align-c">
                            <iconfont name="icon-recharge" color="#333" size="32rpx"></iconfont>
                            <view class="margin-left-sm">{{ default_value || 0 }} * {{ accounts_list[send_accounts_id_index]['platform_rate'] }} = {{ Math.round(default_value * accounts_list[receive_accounts_id_index]['platform_rate'] * 100) / 100 }}</view>
                        </view>
                    </view>
                    <!-- <view class="padding-main bg-white radius-md margin-bottom-xxxxl flex-row align-c">
                        <text class="padding-right">支付密码</text>
                        <input type="password" :value="pay_pwd" class="text-size flex-1 flex-width" placeholder-class="text-size-md cr-grey-9" placeholder="请输入支付密码" />
                    </view> -->
                    <view class="padding-main radius-md margin-bottom-main">
                        <button type="default" class="convert-btn cr-white round" @tap="convert_submit">{{$t('convert.convert.4kcix6')}}</button>
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
                            <view v-for="(item, index) in accounts_list" :key="index" class="flex-row jc-sb align-c padding-vertical-main" :class="accounts_list.length == index + 1 ? '' : 'br-b-f9'" :data-value="item.id" :data-index="index" @tap="coin_checked_event">
                                <view class="flex-row align-c">
                                    <image v-if="item.platform_icon" :src="item.platform_icon" mode="widthFix" class="coin-list-img round" />
                                    <view class="margin-left-sm text-size-md single-text">{{ item.platform_name }}</view>
                                </view>
                                <view>
                                    <iconfont :name="coin_index == index ? 'icon-zhifu-yixuan cr-red' : 'icon-zhifu-weixuan'" size="40rpx"></iconfont>
                                </view>
                            </view>
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
                data_list_loding_status: 1,
                data_list_loding_msg: '',

                // 虚拟币状态
                coin_type: 1,
                coin_index: 0,
                // 下标
                send_accounts_id_index: 0,
                receive_accounts_id_index: 0,
                // id
                send_accounts_id: 0,
                receive_accounts_id: 0,
                popup_coin_status: false,
                accounts_list: [],
                // 是否转换
                convert_bool: false,
                // 输入默认币
                default_value: '',
                // 转换币
                convert_value: '0.00',
                // 支付密码
                pay_pwd: '',
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentPopup,
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
                    url: app.globalData.get_request_url('createinfo', 'convert', 'coin'),
                    method: 'POST',
                    data: { send_accounts_id: this.send_accounts_id, receive_accounts_id: this.receive_accounts_id },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var send_accounts = data.send_accounts || null;
                            var receive_accounts = data.receive_accounts || null;
                            this.setData({
                                data_base: data.base || null,
                                accounts_list: data.accounts_list || [],
                                convert_value: data.convert_value || '0',
                                send_accounts_id: (send_accounts == null) ? 0 : send_accounts.id,
                                receive_accounts_id: (receive_accounts == null) ? 0 : receive_accounts.id,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                            });
                            if (data.accounts_list.length > 0) {
                                this.setData({
                                    send_accounts_id_index: data.accounts_list.findIndex((item) => item.id == data.send_accounts.id),
                                    receive_accounts_id_index: data.accounts_list.findIndex((item) => item.id == data.receive_accounts.id),
                                });
                            }
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
            popup_coin_status_event(type) {
                this.setData({
                    coin_type: type,
                    receive_accounts_idsend_accounts_id_index: this.receive_accounts_id_index,
                    popup_coin_status: true,
                });
            },
            // 切换账户
            coin_checked_event(e) {
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var old_index = (this.coin_type == 1) ? this.receive_accounts_id_index : this.send_accounts_id_index;
                if(index == old_index) {
                    app.globalData.showToast(this.$t('convert.convert.327y2v'));
                    return false;
                }
                if (this.coin_type == 1) {
                    this.setData({
                        send_accounts_id_index: index,
                        send_accounts_id: e.currentTarget.dataset.value,
                    });
                } else {
                    this.setData({
                        receive_accounts_id_index: index,
                        receive_accounts_id: e.currentTarget.dataset.value,
                    });
                }
                this.setData({
                    coin_index: index,
                    popup_coin_status: false,
                });
            },
            // 关闭账户选择弹窗
            popup_coin_status_close_event() {
                this.setData({
                    popup_coin_status: false,
                });
            },

            // 虚拟货币调换
            coin_center_convert_event() {
                var send_index = this.send_accounts_id_index;
                var receive_index = this.receive_accounts_id_index;
                var send_id = this.send_accounts_id;
                var receive_id = this.receive_accounts_id;
                this.setData({
                    receive_accounts_id_index: send_index,
                    send_accounts_id_index: receive_index,
                    receive_accounts_id: send_id,
                    send_accounts_id: receive_id,
                    convert_bool: !this.convert_bool,
                });
            },
            // 需要转换的值事件
            default_coin_change_event(e) {
                this.setData({
                    default_value: e.detail.value,
                    convert_value: Math.round(e.detail.value * this.accounts_list[this.receive_accounts_id_index]['platform_rate'] * 100) / 100,
                });
            },

            // 立即转换
            convert_submit() {
                var new_data = {
                    send_accounts_id: this.send_accounts_id,
                    receive_accounts_id: this.receive_accounts_id,
                    coin: this.default_value,
                };

                // 数据校验
                var validation = [{ fields: 'coin', msg: this.$t('convert.convert.vyjy7s') }];

                // 验证提交表单
                if (app.globalData.fields_check(new_data, validation)) {
                    // 远程请求
                    this.setData({
                        form_submit_loading: true,
                    });
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('create', 'convert', 'coin'),
                        method: 'POST',
                        data: new_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.url_open('/pages/plugins/coin/convert-list/convert-list', true);
                                }, 1000);
                            } else {
                                this.setData({
                                    form_submit_loading: false,
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            this.setData({
                                form_submit_loading: false,
                            });
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },
        },
    };
</script>
<style>
    @import './convert.css';
</style>
