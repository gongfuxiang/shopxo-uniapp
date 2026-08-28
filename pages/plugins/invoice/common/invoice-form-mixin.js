const app = getApp();

const invoice_form_field_list = [
    'invoice_title',
    'invoice_code',
    'invoice_bank',
    'invoice_account',
    'invoice_tel',
    'invoice_address',
    'name',
    'tel',
    'address',
    'email',
    'user_note',
];

export default {
    methods: {
        // 表单数据赋值
        invoice_form_assign(data) {
            if (typeof this.setData === 'function') {
                this.setData(data);
            } else {
                Object.keys(data).forEach((key) => {
                    this[key] = data[key];
                });
            }
        },

        // 获取列表索引
        get_list_index(list, id) {
            if ((list || null) == null || list.length == 0) {
                return 0;
            }
            if (id === undefined || id === null || id === '') {
                return 0;
            }
            for (var i in list) {
                if (list[i]['id'] == id) {
                    return parseInt(i);
                }
            }
            return parseInt(id) < list.length ? parseInt(id) : 0;
        },

        // 发票类型事件
        form_invoice_type_event(e) {
            this.invoice_form_assign({
                form_invoice_type_index: parseInt((e.detail && e.detail.value) || 0),
            });
            this.invoice_container_handle();
        },

        // 申请类型事件
        form_apply_type_event(e) {
            this.invoice_form_assign({
                form_apply_type_index: parseInt((e.detail && e.detail.value) || 0),
            });
            this.invoice_container_handle();
        },

        // 发票内容事件
        form_invoice_content_event(e) {
            this.invoice_form_assign({
                form_invoice_content_index: parseInt((e.detail && e.detail.value) || 0),
            });
        },

        // 子组件文本框输入回写（兼容微信小程序 form 不收集组件内 input）
        form_field_input_event(e) {
            var field = (e && e.field) || '';
            if (!field) {
                return;
            }
            var value = e.value != null ? e.value : '';
            var upd = {};
            if (this.data !== undefined) {
                var data = Object.assign({}, this.data || {});
                data[field] = value;
                upd.data = data;
            }
            if (this.form_data !== undefined) {
                var form_data = Object.assign({}, this.form_data || {});
                form_data[field] = value;
                upd.form_data = form_data;
            }
            if (Object.keys(upd).length > 0) {
                this.invoice_form_assign(upd);
            }
        },

        // 合并 form.detail 与本地已回写字段
        invoice_form_merge_detail(form_value) {
            form_value = form_value || {};
            var local = Object.assign({}, this.form_data || {}, this.data || {});
            var data = Object.assign({}, form_value);
            for (var i in invoice_form_field_list) {
                var field = invoice_form_field_list[i];
                var from_form = form_value[field];
                if (from_form === undefined || from_form === null || String(from_form) === '') {
                    if (local[field] !== undefined && local[field] !== null) {
                        data[field] = local[field];
                    }
                }
            }
            return data;
        },

        // 表单容器显隐处理
        invoice_container_handle() {
            if ((this.can_invoice_type_list || []).length == 0) {
                return;
            }
            var invoice_type = this.can_invoice_type_list[this.form_invoice_type_index]['id'];
            var upd_data = {};
            if (invoice_type == 2 || invoice_type == 3) {
                upd_data.form_apply_type_index = this.get_list_index(this.apply_type_list, 1);
                upd_data.form_apply_type_disabled = true;
            } else {
                upd_data.form_apply_type_disabled = false;
            }

            switch (invoice_type) {
                case 0:
                    upd_data.company_special_container = false;
                    upd_data.addressee_container = false;
                    upd_data.email_container = true;
                    break;
                case 1:
                    upd_data.company_special_container = false;
                    upd_data.addressee_container = true;
                    upd_data.email_container = false;
                    break;
                case 2:
                    upd_data.company_container = true;
                    upd_data.company_special_container = true;
                    upd_data.addressee_container = true;
                    upd_data.email_container = false;
                    break;
                case 3:
                    upd_data.company_container = true;
                    upd_data.company_special_container = true;
                    upd_data.addressee_container = false;
                    upd_data.email_container = true;
                    break;
            }

            if (invoice_type == 0 || invoice_type == 1) {
                var apply_type = this.apply_type_list[this.form_apply_type_index]['id'];
                upd_data.company_container = apply_type != 0;
            }
            this.invoice_form_assign(upd_data);
        },

        // 构建表单校验规则
        invoice_form_build_validation(invoice_type, apply_type) {
            var validation = [
                { fields: 'invoice_title', msg: this.$t('invoice-saveinfo.fill_invoice_header_maximum_200_characters') },
            ];
            if (apply_type == 1) {
                validation.push({ fields: 'invoice_code', msg: this.$t('invoice-saveinfo.fill_unified_social_credit_code_tax') });
            }
            if (invoice_type == 2) {
                validation.push({ fields: 'invoice_bank', msg: this.$t('invoice-saveinfo.fill_name_company_account_opening_bank') });
                validation.push({ fields: 'invoice_account', msg: this.$t('invoice-saveinfo.fill_enterprise_account_number_maximum_160') });
                validation.push({ fields: 'invoice_tel', msg: this.$t('invoice-saveinfo.fill_company_contact_phone_number_which') });
                validation.push({ fields: 'invoice_address', msg: this.$t('invoice-saveinfo.fill_registered_address_company_maximum_230') });
            }
            if (invoice_type == 1 || invoice_type == 2) {
                validation.push({ fields: 'name', msg: this.$t('invoice-saveinfo.fill_recipient_name_format_between_30') });
                validation.push({ fields: 'tel', msg: this.$t('invoice-saveinfo.fill_recipient_phone_number_which_should') });
                validation.push({ fields: 'address', msg: this.$t('invoice-saveinfo.provide_recipient_address_maximum_230_characters') });
            }
            return validation;
        },

        // 收集表单提交数据
        invoice_form_collect_result(data, invoice_type, apply_type) {
            var result = {
                invoice_type: invoice_type,
                apply_type: apply_type,
            };
            if (this.invoice_content_list.length > 0 && this.invoice_content_list[this.form_invoice_content_index] != undefined) {
                result.invoice_content = this.invoice_content_list[this.form_invoice_content_index];
            }
            for (var i in invoice_form_field_list) {
                var field = invoice_form_field_list[i];
                result[field] = data[field] || '';
            }
            return result;
        },

        // 初始化表单状态
        invoice_form_init_state(source, default_data, lists) {
            source = source || {};
            default_data = default_data || {};
            var form_data = {};
            for (var i in invoice_form_field_list) {
                var field = invoice_form_field_list[i];
                form_data[field] = source[field] || default_data[field] || '';
            }
            var data = Object.assign({}, default_data, source, form_data);

            var invoice_content_index = 0;
            if ((source.invoice_content || default_data.invoice_content || null) != null) {
                invoice_content_index = (lists.invoice_content_list || []).indexOf(source.invoice_content || default_data.invoice_content);
                if (invoice_content_index == -1) {
                    invoice_content_index = 0;
                }
            }

            var apply_type_index = this.get_list_index(lists.apply_type_list || [], source.apply_type !== undefined ? source.apply_type : default_data.apply_type);
            this.invoice_form_assign({
                can_invoice_type_list: lists.can_invoice_type_list || [],
                apply_type_list: lists.apply_type_list || [],
                invoice_content_list: lists.invoice_content_list || [],
                form_data: form_data,
                data: data,
                form_invoice_type_index: this.get_list_index(lists.can_invoice_type_list || [], source.invoice_type !== undefined ? source.invoice_type : default_data.invoice_type),
                form_apply_type_index: apply_type_index,
                form_invoice_content_index: invoice_content_index,
                form_apply_type_disabled: ((lists.apply_type_list || [])[apply_type_index] || {}).id == 1,
            });
            this.invoice_container_handle();
        },

        // 表单数据校验
        invoice_form_validate(data) {
            var invoice_type = this.can_invoice_type_list[this.form_invoice_type_index]['id'];
            var apply_type = this.apply_type_list[this.form_apply_type_index]['id'];
            return app.globalData.fields_check(data, this.invoice_form_build_validation(invoice_type, apply_type));
        },
    },
};
