<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <form v-if="check_status == 1 && is_cash_available && user_cash_type_list.length > 0" @submit="form_submit" class="form-container">
                <view class="padding-main oh">
                    <view class="form-gorup margin-bottom radius-md">
                        <view class="form-gorup-title">{{$t('cash-create.withdrawal_amount')}}<text class="form-group-tips-must">*</text></view>
                        <input type="digit" name="money" :value="default_data.money || ''" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('cash-create.withdrawal_amount_minimum') + ((data_base.cash_minimum_amount || 0) <= 0 ? 0.01 : data_base.cash_minimum_amount) + $t('cash-create.highest') + cash_input_max_money_value" @input="cash_money_event" />
                        <view class="text-size-xs">
                            <view v-if="cash_limit_tips_status" class="cr-red margin-bottom-xs">
                                <text>{{ cash_limit_tips_text }}</text>
                            </view>
                            <view>
                                <text>{{$t('cash-create.withdrawable_amount')}}</text>
                                <text class="cr-main fw-b margin-left-sm">{{ can_cash_max_money }}</text>
                            </view>
                            <view>
                                <text>{{$t('cash-create.available_amount')}}</text>
                                <text class="cr-green fw-b margin-left-sm">{{ user_wallet.normal_money }}</text>
                            </view>
                            <view>
                                <text>{{$t('cash-create.total_amount_gifts')}}</text>
                                <text class="cr-base fw-b margin-left-sm">{{ user_wallet.give_money }}</text>
                                <text v-if="(data_base || null) == null || data_base.is_cash_retain_give != 0" class="cr-red margin-left-lg">{{$t('cash-create.gift_amount_cannot_withdrawn')}}</text>
                            </view>
                            <view v-if="(data_base || null) == null || data_base.cash_commission_rate != 0" class="margin-top-sm cr-red">
                                <text>{{$t('cash-create.estimated_handling_fee')}}</text>
                                <text class="fw-b margin-left-sm">{{cash_commission_value}}</text>
                            </view>
                        </view>
                    </view>

                    <view class="form-gorup margin-bottom radius-md">
                        <view class="form-gorup-title">{{$t('cash-create.withdrawal_method')}}<text class="form-group-tips-must">*</text></view>
                        <radio-group name="cash_type" @change="cash_type_event">
                            <block v-for="(item, index) in user_cash_type_list" :key="index">
                                <label class="margin-right">
                                    <radio :value="item.value.toString()" :color="theme_color" :checked="default_data.cash_type == item.value" style="transform: scale(0.7)" /> {{item.name}}
                                </label>
                            </block>
                        </radio-group>
                    </view>

                    <view v-if="cash_type_0_status" class="form-gorup margin-bottom radius-md">
                        <view class="form-gorup-title">{{$t('cash-create.payment_platform')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="bank_name" :value="default_data.bank_name || ''" placeholder-class="cr-grey" class="cr-base" maxlength="60" :placeholder="$t('cash-create.format_payment_platform_between_60_characters')" />
                        <view class="cr-grey-c text-size-xs">{{$t('cash-create.strongly_recommended_give_priority_filling_names')}}</view>
                    </view>

                    <view v-if="cash_type_0_status || cash_type_2_status" class="form-gorup margin-bottom radius-md">
                        <view class="form-gorup-title">{{$t('cash-create.receiving_account')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="bank_accounts" :value="default_data.bank_accounts || ''" placeholder-class="cr-grey" class="cr-base" maxlength="60" :placeholder="$t('cash-create.format_receiving_account_should_between_60')" />
                        <view class="cr-grey-c text-size-xs">{{$t('cash-create.bank_account_virtual_account_alipay_tenpay')}}</view>
                    </view>

                    <view class="form-gorup margin-bottom radius-md">
                        <view class="form-gorup-title">{{$t('cash-create.name_account_holder')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="bank_username" :value="default_data.bank_username || ''" placeholder-class="cr-grey" class="cr-base" maxlength="30" :placeholder="$t('cash-create.format_account_holder_name_between_30')" />
                        <view class="cr-grey-c text-size-xs">{{$t('cash-create.real_name_account_holder_receiving_account')}}</view>
                    </view>

                    <view v-if="cash_desc_list.length > 0" class="cash-desc-alert margin-top-main">
                        <block v-for="(item, index) in cash_desc_list" :key="index">
                            <view v-if="item" class="cash-desc-line">{{ item }}</view>
                        </block>
                    </view>

                    <view class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                        </view>
                    </view>
                </view>
            </form>

            <!-- 不可提现 -->
            <view v-else-if="check_status == 1 && !is_cash_available && cash_apply_available != null" class="padding-main">
                <component-cash-unavailable :propCashApplyAvailable="cash_apply_available"></component-cash-unavailable>
            </view>

            <!-- 未配置提现方式 -->
            <view v-else-if="check_status == 1 && is_cash_available && user_cash_type_list.length == 0" class="padding-main">
                <component-no-data propStatus="0" :propMsg="$t('cash-create.administrator_configured_withdrawal_methods_cont')"></component-no-data>
            </view>

            <!-- 已过期 -->
            <view v-else-if="check_status === 0" class="overdue tc">
                <view class="padding-main">
                    <view class="cr-red margin-top-xxxl">{{$t('cash-create.security_verification_timed_out_verify_again')}}</view>
                    <button class="round bg-main cr-white cr-white text-size margin-top-xl" size="mini" type="default" hover-class="none" data-value="/pages/plugins/wallet/cash-auth/cash-auth" data-redirect="1" @tap="url_event">{{$t('cash-create.return_reapply_cash')}}</button>
                </view>
            </view>
            <view v-else-if="data_list_loding_status != 3">
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentCashUnavailable from '@/pages/plugins/wallet/components/cash-unavailable/cash-unavailable';
    import { BuildCashApplyAvailable, IsCashApplyAvailable } from '@/pages/plugins/wallet/common/cash-apply-available';
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                params: null,
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                data_base: null,
                user_wallet: {},
                default_data: {},
                check_status: null,
                can_cash_max_money: 0.00,
                cash_input_max_money: 0.00,
                cash_commission_value: 0.00,
                user_cash_type_list: [],
                cash_type_0_status: false,
                cash_type_2_status: false,
                cash_apply_available: null,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentCashUnavailable,
        },

        computed: {
            cash_desc_list() {
                var list = ((this.data_base || null) != null && (this.data_base.cash_desc || null) != null) ? this.data_base.cash_desc : [];
                if (!Array.isArray(list)) {
                    return [];
                }
                return list.filter(function(item) {
                    return item;
                });
            },
            cash_minimum_limit() {
                var base = this.data_base || null;
                if (base == null) {
                    return 0;
                }
                return parseFloat(base.cash_minimum_amount || 0) || 0;
            },
            cash_maximum_limit() {
                var base = this.data_base || null;
                if (base == null) {
                    return 0;
                }
                var val = base.cash_maximum_amount;
                if (val === '' || val === null || val === undefined) {
                    return 0;
                }
                return parseFloat(val) || 0;
            },
            cash_limit_tips_status() {
                return this.cash_minimum_limit > 0 || this.cash_maximum_limit > 0;
            },
            cash_limit_tips_text() {
                var tips = [];
                if (this.cash_minimum_limit > 0) {
                    tips.push(this.$t('cash-auth.minimum_cash_amount') + ' ' + this.cash_minimum_limit + this.$t('cash-create.minimum'));
                }
                if (this.cash_maximum_limit > 0) {
                    tips.push(this.$t('cash-create.maximum_withdrawal_amount') + ' ' + this.cash_maximum_limit);
                }
                return tips.join(this.$t('cash-create.text'));
            },
            cash_input_max_money_value() {
                var val = parseFloat(this.cash_input_max_money);
                if (!isNaN(val) && val >= 0) {
                    return val;
                }
                return parseFloat(this.can_cash_max_money) || 0;
            },
            is_cash_available() {
                return IsCashApplyAvailable(this.cash_apply_available);
            },
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
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
            this.get_data();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('common.authorize_user_info_first'),
                    });
                }
            },

            // 获取数据
            get_data() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('createinit', 'cash', 'wallet'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || null;
                            var cash_apply_available = (data.cash_apply_available || null) || BuildCashApplyAvailable(data.user_wallet, data.base, app.globalData.currency_symbol());
                            this.setData({
                                data_list_loding_status: 3,
                                data_base: data.base || null,
                                check_status: data.check_status || 0,
                                cash_apply_available: cash_apply_available,
                                default_data: data.default_data || {},
                                user_wallet: data.user_wallet || {},
                                can_cash_max_money: parseFloat(data.can_cash_max_money) || (cash_apply_available ? parseFloat(cash_apply_available.can_cash_max_money) : 0) || 0.0,
                                cash_input_max_money: parseFloat(data.cash_input_max_money) || 0.0,
                                user_cash_type_list: data.user_cash_type_list || []
                            });
                            // 默认选中处理
                            if(this.default_data.cash_type !== undefined) {
                                this.cash_type_event(this.default_data.cash_type);
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data)) {
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

            // 提现金额事件
            cash_money_event(e) {
                if((this.data_base || null) != null && (this.data_base.cash_commission_rate || 0) != 0) {
                    var value = parseFloat(e.detail.value || 0);
                    this.setData({
                        cash_commission_value: app.globalData.price_two_decimal(value*parseFloat(this.data_base.cash_commission_rate)),
                    })
                }
            },

            // 提现方式事件
            cash_type_event(e) {
                var status_0 = false;
                var status_2 = false;
                var value = parseInt(typeof(e) == 'object' ? e.detail.value : e);
                switch(value)
                {
                    // 其他方式
                    case 0 :
                        status_2 = false;
                        status_0 = true;
                        break;
                    // 微信
                    case 1 :
                        status_0 = false;
                        status_2 = false;
                        break;
                    // 支付宝
                    case 2 :
                        status_0 = false;
                        status_2 = true;
                        break;
                }
                this.setData({
                    cash_type_0_status: status_0,
                    cash_type_2_status: status_2
                });
            },

            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;

                // 数据校验
                var validation = [
                    { fields: 'money', msg: this.$t('cash-create.fill_cash_amount') },
                    { fields: 'cash_type', msg: this.$t('cash-create.choose_withdrawal_method'), is_can_zero: 1 }
                ];
                var cash_type = parseInt(form_data.cash_type);
                if(cash_type == 0) {
                    validation.push({ fields: 'bank_name', msg: this.$t('cash-create.fill_payment_platform') });
                }
                if(cash_type == 0 || cash_type == 2) {
                    validation.push({ fields: 'bank_accounts', msg: this.$t('cash-create.fill_receiving_account_number') });
                }
                validation.push({ fields: 'bank_username', msg: this.$t('cash-create.fill_name_account_holder') });

                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    // 提现金额不能小于最低金额、不能大于最大可提现金额
                    if (this.cash_minimum_limit > 0 && parseFloat(form_data.money) < this.cash_minimum_limit) {
                        app.globalData.showToast(this.$t('cash-create.withdrawals_cannot_lower_than') + this.cash_minimum_limit);
                        return false;
                    }
                    if (this.cash_maximum_limit > 0 && parseFloat(form_data.money) > this.cash_maximum_limit) {
                        app.globalData.showToast(this.$t('cash-create.single_withdrawal_cannot_exceed') + this.cash_maximum_limit);
                        return false;
                    }
                    if (parseFloat(form_data.money) > this.cash_input_max_money_value) {
                        app.globalData.showToast(this.$t('cash-create.withdrawal_cannot_greater_than') + this.cash_input_max_money_value);
                        return false;
                    }

                    // 远程请求
                    this.setData({
                        form_submit_loading: true,
                    });
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('create', 'cash', 'wallet'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.url_open('/pages/plugins/wallet/user/user?type=cash', true);
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

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import './cash-create';
</style>