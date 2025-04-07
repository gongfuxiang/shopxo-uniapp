<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <form v-if="check_status == 1" @submit="form_submit" class="form-container">
                <view class="padding-main oh">
                    <view class="form-gorup">
                        <view class="form-gorup-title">{{$t('cash-create.cash-create.qg404q')}}<text class="form-group-tips-must">*</text></view>
                        <input type="digit" name="money" :value="default_data.money || ''" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('cash-create.cash-create.cymbdz') + ((data_base.cash_minimum_amount || 0) <= 0 ? 0.01 : data_base.cash_minimum_amount) + $t('cash-create.cash-create.27ky42') + can_cash_max_money" @input="cash_money_event" />
                        <view class="text-size-xs">
                            <view v-if="(data_base || null) != null && data_base.cash_minimum_amount > 0">
                                <text>{{$t('cash-auth.cash-auth.27b4w5')}}</text>
                                <text class="cr-red fw-b margin-left-sm">{{ data_base.cash_minimum_amount }}</text>
                            </view>
                            <view>
                                <text>{{$t('cash-create.cash-create.iaw845')}}</text>
                                <text class="cr-main fw-b margin-left-sm">{{ can_cash_max_money }}</text>
                            </view>
                            <view>
                                <text>{{$t('cash-create.cash-create.1dbkw2')}}</text>
                                <text class="cr-green fw-b margin-left-sm">{{ user_wallet.normal_money }}</text>
                            </view>
                            <view>
                                <text>{{$t('cash-create.cash-create.162f7o')}}</text>
                                <text class="cr-base fw-b margin-left-sm">{{ user_wallet.give_money }}</text>
                                <text v-if="(data_base || null) == null || data_base.is_cash_retain_give != 0" class="cr-red margin-left-lg">{{$t('cash-create.cash-create.5o1q52')}}</text>
                            </view>
                            <view v-if="(data_base || null) == null || data_base.cash_commission_rate != 0" class="margin-top-sm cr-red">
                                <text>{{$t('cash-create.cash-create.678iu2')}}</text>
                                <text class="fw-b margin-left-sm">{{cash_commission_value}}</text>
                            </view>
                        </view>
                    </view>

                    <view class="form-gorup">
                        <view class="form-gorup-title">{{$t('cash-create.cash-create.yu2raf')}}<text class="form-group-tips-must">*</text></view>
                        <radio-group name="cash_type" @change="cash_type_event">
                            <block v-for="(item, index) in user_cash_type_list" :key="index">
                                <label class="margin-right">
                                    <radio :value="item.value.toString()" :color="theme_color" :checked="default_data.cash_type == item.value" style="transform: scale(0.7)" /> {{item.name}}
                                </label>
                            </block>
                        </radio-group>
                    </view>

                    <view v-if="cash_type_0_status" class="form-gorup">
                        <view class="form-gorup-title">{{$t('cash-create.cash-create.5mmir5')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="bank_name" :value="default_data.bank_name || ''" placeholder-class="cr-grey" class="cr-base" maxlength="60" :placeholder="$t('cash-create.cash-create.u2rnlw')" />
                        <view class="cr-grey-c text-size-xs">{{$t('cash-create.cash-create.14n20v')}}</view>
                    </view>

                    <view v-if="cash_type_0_status || cash_type_2_status" class="form-gorup">
                        <view class="form-gorup-title">{{$t('cash-create.cash-create.36756z')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="bank_accounts" :value="default_data.bank_accounts || ''" placeholder-class="cr-grey" class="cr-base" maxlength="60" :placeholder="$t('cash-create.cash-create.s72t44')" />
                        <view class="cr-grey-c text-size-xs">{{$t('cash-create.cash-create.748r3i')}}</view>
                    </view>

                    <view class="form-gorup">
                        <view class="form-gorup-title">{{$t('cash-create.cash-create.1xtff6')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="bank_username" :value="default_data.bank_username || ''" placeholder-class="cr-grey" class="cr-base" maxlength="30" :placeholder="$t('cash-create.cash-create.f4605e')" />
                        <view class="cr-grey-c text-size-xs">{{$t('cash-create.cash-create.445m7n')}}</view>
                    </view>

                    <view class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                        </view>
                    </view>
                </view>
            </form>

            <!-- 已过期 -->
            <view v-else-if="check_status === 0" class="overdue tc">
                <view class="padding-main">
                    <view class="cr-red margin-top-xxxl">{{$t('cash-create.cash-create.858o54')}}</view>
                    <button class="round bg-main cr-white cr-white text-size margin-top-xl" size="mini" type="default" hover-class="none" data-value="/pages/plugins/wallet/cash-auth/cash-auth" data-redirect="1" @tap="url_event">{{$t('cash-create.cash-create.ke15x5')}}</button>
                </view>
            </view>
            <view v-else>
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

    export default {
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
                cash_commission_value: 0.00,
                user_cash_type_list: [],
                cash_type_0_status: false,
                cash_type_2_status: false
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
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
                        data_list_loding_msg: this.$t('extraction-apply.extraction-apply.m3xdif'),
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
                            this.setData({
                                data_list_loding_status: 3,
                                data_base: data.base || null,
                                check_status: data.check_status || 0,
                                default_data: data.default_data || {},
                                user_wallet: data.user_wallet || {},
                                can_cash_max_money: parseFloat(data.can_cash_max_money) || 0.0,
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
                    { fields: 'money', msg: this.$t('cash-create.cash-create.6t7x9u') },
                    { fields: 'cash_type', msg: this.$t('cash-create.cash-create.thjid2'), is_can_zero: 1 }
                ];
                var cash_type = parseInt(form_data.cash_type);
                if(cash_type == 0) {
                    validation.push({ fields: 'bank_name', msg: this.$t('cash-create.cash-create.vbr59h') });
                }
                if(cash_type == 0 || cash_type == 2) {
                    validation.push({ fields: 'bank_accounts', msg: this.$t('cash-create.cash-create.0mn186') });
                }
                validation.push({ fields: 'bank_username', msg: this.$t('cash-create.cash-create.c7h4mu') });

                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    // 提现金额不能小于最低金额、不能大于最大可提现金额
                    if (parseFloat(this.data_base.cash_minimum_amount || 0) > 0 && parseFloat(form_data.money) < parseFloat(this.data_base.cash_minimum_amount)) {
                        app.globalData.showToast(this.$t('cash-create.cash-create.724kn8') + this.data_base.cash_minimum_amount);
                        return false;
                    }
                    if (parseFloat(form_data.money) > this.can_cash_max_money) {
                        app.globalData.showToast(this.$t('cash-create.cash-create.duo0ts') + this.can_cash_max_money);
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