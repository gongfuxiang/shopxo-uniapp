<template>
    <view class="border-radius-main bg-white oh">
        <view class="form-gorup">
            <view class="form-gorup-title">{{ $t('invoice.invoice.j04kjc') }}<text class="form-group-tips-must">*</text></view>
            <picker name="invoice_type" @change="invoice_type_event" :value="form_invoice_type_index" :range="can_invoice_type_list" range-key="name">
                <view :class="'picker ' + (can_invoice_type_list[form_invoice_type_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                    {{ can_invoice_type_list[form_invoice_type_index] == undefined ? $t('invoice-saveinfo.invoice-saveinfo.t3i3e3') : can_invoice_type_list[form_invoice_type_index]['name'] }}
                </view>
            </picker>
        </view>

        <view class="form-gorup">
            <view class="form-gorup-title">{{ $t('invoice.invoice.hoenw8') }}<text class="form-group-tips-must">*</text></view>
            <picker name="apply_type" @change="apply_type_event" :disabled="form_apply_type_disabled" :value="form_apply_type_index" :range="apply_type_list" range-key="name">
                <view :class="'picker ' + (apply_type_list[form_apply_type_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                    {{ apply_type_list[form_apply_type_index] == undefined ? $t('invoice-saveinfo.invoice-saveinfo.k31t2s') : apply_type_list[form_apply_type_index]['name'] }}
                </view>
            </picker>
        </view>

        <view v-if="invoice_content_list.length > 0" class="form-gorup">
            <view class="form-gorup-title">{{ $t('invoice-detail.invoice-detail.p73963') }}<text class="form-group-tips-must">*</text></view>
            <picker name="invoice_content" @change="invoice_content_event" :value="form_invoice_content_index" :range="invoice_content_list">
                <view :class="'picker ' + (invoice_content_list[form_invoice_content_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                    {{ invoice_content_list[form_invoice_content_index] == undefined ? $t('invoice-saveinfo.invoice-saveinfo.i73t3c') : invoice_content_list[form_invoice_content_index] }}
                </view>
            </picker>
        </view>

        <view class="form-gorup">
            <view class="form-gorup-title">{{ $t('invoice.invoice.y724c7') }}<text class="form-group-tips-must">*</text></view>
            <input type="text" name="invoice_title" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.x461e0')" maxlength="200" :value="form_data.invoice_title || ''" />
        </view>

        <view v-if="company_container">
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-saveinfo.invoice-saveinfo.x8hhiv') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_code" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.924cag')" maxlength="160" :value="form_data.invoice_code || ''" />
            </view>
        </view>

        <view v-if="company_special_container">
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.invoice-detail.41qbu6') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_bank" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.ymvw6b')" maxlength="200" :value="form_data.invoice_bank || ''" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.invoice-detail.3a9459') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_account" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.664qc7')" maxlength="160" :value="form_data.invoice_account || ''" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.invoice-detail.2g7t23') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_tel" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.bbseo1')" maxlength="15" :value="form_data.invoice_tel || ''" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.invoice-detail.6k6sov') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="invoice_address" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.85735j')" maxlength="230" :value="form_data.invoice_address || ''" />
            </view>
        </view>

        <view v-if="addressee_container">
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.invoice-detail.7159m0') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="name" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.gsc7dy')" maxlength="30" :value="form_data.name || ''" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.invoice-detail.f2222p') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="tel" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.bp8822')" maxlength="15" :value="form_data.tel || ''" />
            </view>
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('invoice-detail.invoice-detail.q8l3zj') }}<text class="form-group-tips-must">*</text></view>
                <input type="text" name="address" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.u7h724')" maxlength="230" :value="form_data.address || ''" />
            </view>
        </view>

        <view v-if="email_container">
            <view class="form-gorup">
                <view class="form-gorup-title">{{ $t('login.login.db1rf4') }}</view>
                <input type="text" name="email" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.d3qbe1')" maxlength="60" :value="form_data.email || ''" />
            </view>
        </view>

        <view class="form-gorup">
            <view class="form-gorup-title">{{ $t('common.note') }}</view>
            <input type="text" name="user_note" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.vaw647')" maxlength="60" :value="form_data.user_note || ''" />
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
