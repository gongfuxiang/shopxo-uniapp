<template>
    <component-popup :propShow="propShow" propPosition="bottom" @onclose="close_event">
        <view class="poupon-title padding-main tc text-size-md pr">
            {{ $t('payment.payment.iu792d') }}
            <iconfont name="icon-close-line" propClass="pa right-0 margin-right-main margin-top-xs" size="30rpx" color="#999" @tap="close_event"></iconfont>
        </view>
        <view class="padding-horizontal-main">
            <component-friendpay-mode-switch :propPluginsData="propPluginsData" :propIsFriendPay="is_friend_pay" @modeChange="friendpay_mode_change_event"></component-friendpay-mode-switch>
        </view>
        <view class="tc padding-top-sm padding-bottom-sm br-b lh-il">
            <text class="text-size-md cr-price">{{ currency_symbol }}</text>
            <text class="text-size-xxl cr-price fw-b">{{ propPayPrice }}</text>
        </view>
        <view v-if="payment_list.length > 0" class="oh">
            <view class="payment-list">
                <scroll-view scroll-y="true" class="scroll-y wh-auto">
                    <view v-for="(item, index) in payment_list" :key="index" class="item br-b flex-row jc-sb align-c" :data-value="item.id" @tap="checked_payment">
                        <view class="flex-1 flex-width">
                            <image v-if="(item.logo || null) != null" class="icon va-m margin-right-sm" :src="item.logo" mode="widthFix"></image>
                            <text class="va-m">{{ item.name }}</text>
                            <text v-if="(item.tips || null) != null" class="cr-red text-size-xs va-m margin-left-sm">（{{ item.tips }}）</text>
                        </view>
                        <iconfont :name="payment_id == item.id && is_friend_pay != 1 ? 'icon-selected-solid' : 'icon-not-selected'" size="44rpx" :color="payment_id == item.id && is_friend_pay != 1 ? '#E22C08' : '#ccc'"></iconfont>
                    </view>
                </scroll-view>
            </view>
            <view class="payment-submit">
                <button class="bg-main br-main cr-white round text-size wh-auto" type="default" hover-class="none" :disabled="submit_disabled || (is_friend_pay != 1 && payment_id <= 0)" @tap="submit_event">{{ is_friend_pay == 1 ? $t('friendpay.friendpay.create_link') : $t('payment.payment.25r53g') }}</button>
            </view>
        </view>
        <view v-else class="padding-top-xxxl padding-bottom-xxxl oh bg-white tc cr-grey">{{ $t('payment.payment.058a46') }}</view>
    </component-popup>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentFriendpayModeSwitch from '@/pages/plugins/friendpay/components/pay-mode-switch/pay-mode-switch';
    export default {
        name: 'component-friendpay-order-pay-popup',
        components: {
            componentPopup,
            componentFriendpayModeSwitch,
        },
        props: {
            propShow: {
                type: Boolean,
                default: false,
            },
            propPluginsData: {
                type: Object,
                default: null,
            },
            propPayPrice: {
                type: [Number, String],
                default: 0,
            },
            propOrderIds: {
                type: [String, Number],
                default: '',
            },
            propPaymentList: {
                type: Array,
                default: () => [],
            },
            propDefaultPaymentId: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                currency_symbol: app.globalData.currency_symbol(),
                is_friend_pay: 0,
                payment_id: 0,
                payment_list: [],
                submit_disabled: false,
            };
        },
        watch: {
            // 弹窗显示
            propShow(val) {
                if (val) {
                    this.is_friend_pay = 0;
                    this.payment_list = this.propPaymentList || [];
                    var default_id = parseInt(this.propDefaultPaymentId || 0);
                    this.payment_id = default_id > 0 ? default_id : ((this.payment_list[0] || {}).id || 0);
                }
            },
            // 支付方式列表
            propPaymentList(val) {
                this.payment_list = val || [];
            },
        },
        methods: {
            // 关闭弹窗
            close_event() {
                this.$emit('close');
            },

            // 代付模式切换（兼容 H5 直接传值 / 小程序 e.detail）
            friendpay_mode_change_event(e) {
                var value = e;
                if (typeof e === 'object' && e !== null && Object.prototype.hasOwnProperty.call(e, 'detail')) {
                    value = Array.isArray(e.detail) ? e.detail[0] : e.detail;
                    if (typeof value === 'object' && value !== null && Array.isArray(value.__args__)) {
                        value = value.__args__[0];
                    }
                }
                this.is_friend_pay = parseInt(value || 0) === 1 ? 1 : 0;
            },

            // 支付方式选择
            checked_payment(e) {
                this.is_friend_pay = 0;
                this.payment_id = parseInt(e.currentTarget.dataset.value || 0);
            },

            // 提交
            submit_event() {
                if (this.is_friend_pay == 1) {
                    this.create_event();
                } else {
                    this.self_pay_event();
                }
            },

            // 创建代付
            create_event() {
                if ((this.propOrderIds || '') == '') {
                    app.globalData.showToast(this.$t('friendpay.friendpay.order_id_error'));
                    return;
                }
                this.submit_disabled = true;
                uni.showLoading({ title: this.$t('common.loading_in_text') });
                uni.request({
                    url: app.globalData.get_request_url('create', 'share', 'friendpay'),
                    method: 'POST',
                    data: { order_ids: this.propOrderIds },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        this.submit_disabled = false;
                        if (res.data.code == 0 && (res.data.data || null) != null) {
                            this.$emit('close');
                            var id = res.data.data.id;
                            var url = (res.data.data.owner_share_url || '').trim();
                            if (url == '') {
                                url = '/pages/plugins/friendpay/share/share?id=' + id;
                            }
                            app.globalData.url_open(url);
                        } else {
                            app.globalData.showToast(res.data.msg || this.$t('common.operate_fail'));
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.submit_disabled = false;
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 自行支付
            self_pay_event() {
                this.$emit('self-pay', {
                    order_ids: this.propOrderIds,
                    payment_id: this.payment_id,
                    payment_list: this.payment_list,
                });
            },
        },
    };
</script>
<style scoped>
    .payment-list .scroll-y {
        max-height: 430rpx;
    }
    .payment-list .item {
        padding: 28rpx 28rpx 28rpx 32rpx;
    }
    .payment-list .icon {
        width: 50rpx;
        height: 50rpx !important;
    }
    .payment-submit {
        padding: 40rpx;
    }
</style>
