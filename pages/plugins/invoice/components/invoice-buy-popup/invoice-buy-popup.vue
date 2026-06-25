<template>
    <component-popup :propShow="propShow" propPosition="bottom" @onclose="close_event">
        <view class="plugins-invoice-buy-popup bg-base">
            <view class="popup-header flex-row jc-sb align-c padding-horizontal-main padding-top-main padding-bottom-sm">
                <view class="text-size fw-b">{{ $t('buy.buy.k8inv1') }}</view>
                <view class="cp" @tap.stop="close_event">
                    <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                </view>
            </view>
            <view class="padding-horizontal-main padding-bottom-main">
                <view v-if="(config.invoice_desc || null) != null && config.invoice_desc.length > 0" class="padding-main border-radius-main bg-white spacing-mb cr-grey text-size-xs">
                    <view v-for="(item, index) in config.invoice_desc" :key="index">{{ index + 1 }}. {{ item }}</view>
                </view>

                <view class="padding-main border-radius-main bg-white spacing-mb">
                    <text class="cr-base margin-right-sm">{{ $t('invoice.invoice.fvuc4p') }}</text>
                    <text class="cr-main text-size fw-b">{{ currency_symbol }}{{ config.total_price }}</text>
                </view>

                <form @submit="form_submit" class="form-container">
                    <view class="border-radius-main bg-white oh spacing-mb">
                        <view class="form-gorup invoice-choice-group">
                            <view class="form-gorup-title">{{ $t('buy.buy.k8inv7') }}</view>
                            <radio-group class="invoice-radio-group" name="is_buy_invoice" @change="buy_invoice_choice_event">
                                <label class="invoice-radio-item margin-right-lg">
                                    <radio class="invoice-radio" value="0" :checked="is_buy_invoice == 0" color="#E22C08" style="transform: scale(0.7)" />{{ $t('buy.buy.k8inv2') }}
                                </label>
                                <label class="invoice-radio-item">
                                    <radio class="invoice-radio" value="1" :checked="is_buy_invoice == 1" color="#E22C08" style="transform: scale(0.7)" />{{ $t('buy.buy.k8inv8') }}
                                </label>
                            </radio-group>
                        </view>

                        <block v-if="is_buy_invoice == 1">
                            <component-invoice-form-fields
                                :can_invoice_type_list="can_invoice_type_list"
                                :apply_type_list="apply_type_list"
                                :invoice_content_list="invoice_content_list"
                                :form_data="form_data"
                                :form_invoice_type_index="form_invoice_type_index"
                                :form_apply_type_index="form_apply_type_index"
                                :form_invoice_content_index="form_invoice_content_index"
                                :form_apply_type_disabled="form_apply_type_disabled"
                                :company_container="company_container"
                                :company_special_container="company_special_container"
                                :addressee_container="addressee_container"
                                :email_container="email_container"
                                @invoice-type-change="form_invoice_type_event"
                                @apply-type-change="form_apply_type_event"
                                @invoice-content-change="form_invoice_content_event"
                            ></component-invoice-form-fields>
                        </block>
                    </view>

                    <view class="padding-bottom-main">
                        <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">{{ $t('common.confirm') }}</button>
                    </view>
                </form>
            </view>
        </view>
    </component-popup>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentInvoiceFormFields from '@/pages/plugins/invoice/components/invoice-form-fields/invoice-form-fields';
    import invoiceFormMixin from '@/pages/plugins/invoice/common/invoice-form-mixin.js';

    export default {
        mixins: [invoiceFormMixin],
        props: {
            propShow: {
                type: Boolean,
                default: false,
            },
            propConfig: {
                type: Object,
                default: null,
            },
            propCacheData: {
                type: Object,
                default: null,
            },
            propCurrencySymbol: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                config: {},
                currency_symbol: app.globalData.currency_symbol(),
                is_buy_invoice: 0,
                can_invoice_type_list: [],
                apply_type_list: [],
                invoice_content_list: [],
                form_data: {},
                form_invoice_type_index: 0,
                form_apply_type_index: 0,
                form_invoice_content_index: 0,
                form_apply_type_disabled: false,
                company_container: false,
                company_special_container: false,
                addressee_container: false,
                email_container: true,
            };
        },

        components: {
            componentPopup,
            componentInvoiceFormFields,
        },

        watch: {
            propShow(val) {
                if (val) {
                    this.init_form();
                }
            },
            propConfig(val) {
                if ((val || null) != null) {
                    this.config = val;
                }
            },
        },

        methods: {
            // 初始化表单数据
            init_form() {
                var config = this.propConfig || {};
                var cache = this.propCacheData || {};
                var default_data = config.data || {};
                var source = Object.keys(cache).length > 0 ? cache : default_data;

                this.config = config;
                this.is_buy_invoice = parseInt(source.is_buy_invoice || 0);
                this.invoice_form_init_state(source, default_data, {
                    can_invoice_type_list: config.can_invoice_type_list || [],
                    apply_type_list: config.apply_type_list || [],
                    invoice_content_list: config.invoice_content_list || [],
                });
            },

            // 是否开发票选择
            buy_invoice_choice_event(e) {
                this.is_buy_invoice = parseInt(e.detail.value || 0);
                if (this.is_buy_invoice == 1) {
                    this.invoice_container_handle();
                }
            },

            // 表单提交
            form_submit(e) {
                var data = e.detail.value || {};
                var result = {
                    is_buy_invoice: this.is_buy_invoice,
                };
                if (this.is_buy_invoice != 1) {
                    this.$emit('onconfirm', result);
                    return;
                }
                if (!this.invoice_form_validate(data)) {
                    return;
                }
                var invoice_type = this.can_invoice_type_list[this.form_invoice_type_index]['id'];
                var apply_type = this.apply_type_list[this.form_apply_type_index]['id'];
                result = Object.assign(result, this.invoice_form_collect_result(data, invoice_type, apply_type));
                result.is_buy_invoice = 1;
                this.$emit('onconfirm', result);
            },

            // 关闭弹窗
            close_event() {
                this.$emit('onclose');
            },
        },
    };
</script>
<style scoped>
    .plugins-invoice-buy-popup {
        max-height: 85vh;
        overflow-y: auto;
    }
    .plugins-invoice-buy-popup .popup-header {
        position: sticky;
        top: 0;
        z-index: 1;
        background: inherit;
    }
    .plugins-invoice-buy-popup .invoice-choice-group .form-gorup-title {
        margin-bottom: 0;
    }
    .plugins-invoice-buy-popup .invoice-radio-group {
        margin-top: 20rpx;
    }
    .plugins-invoice-buy-popup .invoice-radio-item {
        display: inline-flex;
        align-items: center;
        font-size: 28rpx;
        line-height: 1.4;
    }
</style>
