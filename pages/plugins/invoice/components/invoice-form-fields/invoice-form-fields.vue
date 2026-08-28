<template>
    <view class="border-radius-main bg-white oh">
        <view class="form-gorup">
            <view class="form-gorup-title">{{ $t('invoice.invoice_type') }}<text class="form-group-tips-must">*</text></view>
            <picker name="invoice_type" @change="invoice_type_event" :value="form_invoice_type_index" :range="can_invoice_type_list" range-key="name">
                <view :class="'picker ' + (can_invoice_type_list[form_invoice_type_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                    {{ can_invoice_type_list[form_invoice_type_index] == undefined ? $t('invoice-saveinfo.select_invoice_type') : can_invoice_type_list[form_invoice_type_index]['name'] }}
                </view>
            </picker>
        </view>

        <view class="form-gorup">
            <view class="form-gorup-title">{{ $t('invoice.application_type') }}<text class="form-group-tips-must">*</text></view>
            <picker name="apply_type" @change="apply_type_event" :disabled="form_apply_type_disabled" :value="form_apply_type_index" :range="apply_type_list" range-key="name">
                <view :class="'picker ' + (apply_type_list[form_apply_type_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                    {{ apply_type_list[form_apply_type_index] == undefined ? $t('invoice-saveinfo.select_application_type') : apply_type_list[form_apply_type_index]['name'] }}
                </view>
            </picker>
        </view>

        <view v-if="invoice_content_list.length > 0" class="form-gorup">
            <view class="form-gorup-title">{{ $t('invoice-detail.invoice_content') }}<text class="form-group-tips-must">*</text></view>
            <picker name="invoice_content" @change="invoice_content_event" :value="form_invoice_content_index" :range="invoice_content_list">
                <view :class="'picker ' + (invoice_content_list[form_invoice_content_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                    {{ invoice_content_list[form_invoice_content_index] == undefined ? $t('invoice-saveinfo.select_invoice_content') : invoice_content_list[form_invoice_content_index] }}
                </view>
            </picker>
        </view>

        <view class="form-gorup">
            <view class="form-gorup-title">{{ $t('invoice.invoice_header') }}<text class="form-group-tips-must">*</text></view>
            <input type="text" name="invoice_title" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice_header_up_200_characters_long')" maxlength="200" :value="form_data.invoice_title || ''"  data-field="invoice_title" @input="input_event" />
        </view>

        <view v-if="company_container">
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-saveinfo.unified_social_credit_code_tax_identification') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_code" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.unified_social_credit_code_tax_identification_2')" maxlength="160" :value="form_data.invoice_code || ''"  data-field="invoice_code" @input="input_event" />
            </view>
        </view>

        <view v-if="company_special_container">
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.name_bank_where_enterprise_opens_account') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_bank" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.enterprise_account_opening_bank_name_up')" maxlength="200" :value="form_data.invoice_bank || ''"  data-field="invoice_bank" @input="input_event" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.enterprise_account_opening') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_account" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.enterprise_account_opening_maximum_160_character')" maxlength="160" :value="form_data.invoice_account || ''"  data-field="invoice_account" @input="input_event" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.enterprise_contact_phone_number') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_tel" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.enterprise_contact_phone_number_15_characters')" maxlength="15" :value="form_data.invoice_tel || ''"  data-field="invoice_tel" @input="input_event" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.registered_address_enterprise') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_address" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.registered_address_enterprise_maximum_230_charac')" maxlength="230" :value="form_data.invoice_address || ''"  data-field="invoice_address" @input="input_event" />
            </view>
        </view>

        <view v-if="addressee_container">
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.recipient_name') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="name" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.recipient_name_format_should_between_30')" maxlength="30" :value="form_data.name || ''"  data-field="name" @input="input_event" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.recipient_phone_number') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="tel" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.recipient_phone_number_15_characters_long')" maxlength="15" :value="form_data.tel || ''"  data-field="tel" @input="input_event" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.recipient_address') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="address" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.recipient_address_up_230_characters')" maxlength="230" :value="form_data.address || ''"  data-field="address" @input="input_event" />
            </view>
        </view>

        <view v-if="email_container">
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('common.mail') }}</view>
                <input type="text" name="email" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.email_up_60_characters')" maxlength="60" :value="form_data.email || ''"  data-field="email" @input="input_event" />
            </view>
        </view>

        <view class="form-gorup">
            <view class="form-gorup-title">{{ $t('common.note') }}</view>
            <input type="text" name="user_note" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('common.remarks_up_230_characters_long')" maxlength="60" :value="form_data.user_note || ''"  data-field="user_note" @input="input_event" />
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            can_invoice_type_list: {
                type: Array,
                default: () => [],
            },
            apply_type_list: {
                type: Array,
                default: () => [],
            },
            invoice_content_list: {
                type: Array,
                default: () => [],
            },
            form_data: {
                type: Object,
                default: () => ({}),
            },
            form_invoice_type_index: {
                type: Number,
                default: 0,
            },
            form_apply_type_index: {
                type: Number,
                default: 0,
            },
            form_invoice_content_index: {
                type: Number,
                default: 0,
            },
            form_apply_type_disabled: {
                type: Boolean,
                default: false,
            },
            company_container: {
                type: Boolean,
                default: false,
            },
            company_special_container: {
                type: Boolean,
                default: false,
            },
            addressee_container: {
                type: Boolean,
                default: false,
            },
            email_container: {
                type: Boolean,
                default: true,
            },
        },
        methods: {
            // 文本输入（小程序 form 无法收集自定义组件内 input，需回传父级）
            input_event(e) {
                var field = (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.field) || '';
                if (!field) {
                    return;
                }
                this.$emit('field-input', {
                    field: field,
                    value: (e.detail && e.detail.value != null) ? e.detail.value : '',
                });
            },

            // 发票类型选择
            invoice_type_event(e) {
                this.$emit('invoice-type-change', e);
            },

            // 申请类型选择
            apply_type_event(e) {
                this.$emit('apply-type-change', e);
            },

            // 发票内容选择
            invoice_content_event(e) {
                this.$emit('invoice-content-change', e);
            },
        },
    };
</script>
