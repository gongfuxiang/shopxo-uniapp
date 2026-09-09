import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "buy": "订单确认"
    },
    "common": {
        "text_2": "发票信息",
        "text_6": "开发票",
        "no_invoice": "不开发票"
    },
    "buy": {
        "payment_expand_all": "展开全部支付方式",
        "payment_collapse": "收起支付方式",
        "to": " 至 ",
        "shipping_method": "运送方式",
        "coupons": "优惠劵",
        "store_secondary_card": "门店次卡",
        "points": "个积分",
        "quick_input": "快捷输入",
        "display_type_does_allow_submission_orders": "展示型不允许提交订单",
        "select_shipping_address": "请选择收货地址",
        "select_pickup_address": "请选择取货地址",
        "select_coupon": "请选择优惠券",
        "enter_store_order": "进入门店订单",
        "select_time": "选择时间",
        "my_name": "我的姓名",
        "my_phone": "我的电话",
        "fill_name_phone_number": "请填写姓名和电话",
        "optional_coupons": "可选优惠劵",
        "there_currently_available_coupons_available": "暂无可用优惠劵",
        "select_address": "请选择地址",
        "modify": "修改发票信息",
        "text_4": "查看发票信息",
        "pay": "钱包支付不支持开票",
        "pay_2": "当前支付方式为钱包支付，不支持开具发票",
        "current_mode_does_allow_use_addresses": "当前模式不允许使用地址",
        "not_use_coupons": "不使用优惠劵",
        "not_use_secondary_cards": "不使用次卡",
        "text_5": "是否需要发票"
    },
    "invoice": {
        "application_type": "申请类型",
        "invoice_type": "发票类型",
        "invoice_amount": "发票金额",
        "invoice_header": "发票抬头"
    },
    "invoice-detail": {
        "invoice_content": "发票内容",
        "name_bank_where_enterprise_opens_account": "企业开户行名称",
        "enterprise_account_opening": "企业开户帐号",
        "enterprise_contact_phone_number": "企业联系电话",
        "registered_address_enterprise": "企业注册地址",
        "recipient_name": "收件人姓名",
        "recipient_phone_number": "收件人电话",
        "recipient_address": "收件人地址"
    },
    "invoice-saveinfo": {
        "unified_social_credit_code_tax_identification": "企业统一社会信用代码或纳税识别号",
        "select_invoice_type": "请选择发票类型",
        "select_application_type": "请选择申请类型",
        "select_invoice_content": "请选择发票内容",
        "invoice_header_up_200_characters_long": "发票抬头、最多200个字符",
        "unified_social_credit_code_tax_identification_2": "企业统一社会信用代码或纳税识别号、最多160个字符",
        "enterprise_account_opening_bank_name_up": "企业开户行名称、最多200个字符",
        "enterprise_account_opening_maximum_160_character": "企业开户帐号、最多160个字符",
        "enterprise_contact_phone_number_15_characters": "企业联系电话 6~15 个字符",
        "registered_address_enterprise_maximum_230_charac": "企业注册地址、最多230个字符",
        "recipient_name_format_should_between_30": "收件人姓名格式 2~30 个字符之间",
        "recipient_phone_number_15_characters_long": "收件人电话 6~15 个字符",
        "recipient_address_up_230_characters": "收件人地址、最多230个字符",
        "email_up_60_characters": "电子邮箱、最多60个字符",
        "fill_invoice_header_maximum_200_characters": "请填写发票抬头、最多200个字符",
        "fill_unified_social_credit_code_tax": "请填写企业统一社会信用代码或纳税识别号、最多160个字符",
        "fill_name_company_account_opening_bank": "请填写企业开户行名称、最多200个字符",
        "fill_enterprise_account_number_maximum_160": "请填写企业开户帐号、最多160个字符",
        "fill_company_contact_phone_number_which": "请填写企业联系电话 6~15 个字符",
        "fill_registered_address_company_maximum_230": "请填写企业注册地址、最多230个字符",
        "fill_recipient_name_format_between_30": "请填写收件人姓名格式 2~30 个字符之间",
        "fill_recipient_phone_number_which_should": "请填写收件人电话 6~15 个字符",
        "provide_recipient_address_maximum_230_characters": "请填写收件人地址、最多230个字符"
    },
    "friendpay": {
        "pay_mode_title": "邀请朋友代付"
    }
};
var en = {
    "pages": {
        "buy": "acknowledgement of order"
    },
    "common": {
        "text_2": "Invoice information",
        "text_6": "Request invoice",
        "no_invoice": "No invoice"
    },
    "buy": {
        "payment_expand_all": "Show all payment methods",
        "payment_collapse": "Collapse payment methods",
        "to": "to",
        "shipping_method": "shipping method",
        "coupons": "Coupons",
        "store_secondary_card": "Store Secondary Card",
        "points": "Points",
        "quick_input": "Quick input",
        "display_type_does_allow_submission_orders": "Display type does not allow submission of orders",
        "select_shipping_address": "Please select a shipping address",
        "select_pickup_address": "Please select a pickup address",
        "select_coupon": "Please select a coupon",
        "enter_store_order": "Enter store order",
        "select_time": "Select time",
        "my_name": "My Name",
        "my_phone": "My Phone",
        "fill_name_phone_number": "Please fill in your name and phone number",
        "optional_coupons": "Optional coupons",
        "there_currently_available_coupons_available": "There are currently no available coupons available",
        "select_address": "Please select an address",
        "current_mode_does_allow_use_addresses": "The current mode does not allow the use of addresses",
        "not_use_coupons": "Do not use coupons",
        "not_use_secondary_cards": "Do not use secondary cards",
        "modify": "Edit invoice info",
        "text_4": "View invoice info",
        "pay": "Wallet payment does not support invoicing",
        "pay_2": "The current payment method is wallet and does not support invoicing",
        "text_5": "Need invoice?"
    },
    "invoice": {
        "application_type": "Application type",
        "invoice_type": "Invoice type",
        "invoice_amount": "Invoice amount",
        "invoice_header": "Invoice header"
    },
    "invoice-detail": {
        "invoice_content": "Invoice content",
        "name_bank_where_enterprise_opens_account": "Name of the bank where the enterprise opens the account",
        "enterprise_account_opening": "Enterprise account opening",
        "enterprise_contact_phone_number": "Enterprise contact phone number",
        "registered_address_enterprise": "Registered address of the enterprise",
        "recipient_name": "Recipient Name",
        "recipient_phone_number": "Recipient's phone number",
        "recipient_address": "Recipient address"
    },
    "invoice-saveinfo": {
        "unified_social_credit_code_tax_identification": "Unified social credit code or tax identification number for enterprises",
        "select_invoice_type": "Please select invoice type",
        "select_application_type": "Please select the application type",
        "select_invoice_content": "Please select invoice content",
        "invoice_header_up_200_characters_long": "Invoice header, up to 200 characters long",
        "unified_social_credit_code_tax_identification_2": "Unified social credit code or tax identification number for enterprises, with a maximum of 160 characters",
        "enterprise_account_opening_bank_name_up": "Enterprise account opening bank name, up to 200 characters",
        "enterprise_account_opening_maximum_160_character": "Enterprise account opening, with a maximum of 160 characters",
        "enterprise_contact_phone_number_15_characters": "Enterprise contact phone number 6-15 characters",
        "registered_address_enterprise_maximum_230_charac": "Registered address of the enterprise, with a maximum of 230 characters",
        "recipient_name_format_should_between_30": "The recipient's name format should be between 2 and 30 characters",
        "recipient_phone_number_15_characters_long": "Recipient's phone number is 6-15 characters long",
        "recipient_address_up_230_characters": "Recipient address, up to 230 characters",
        "email_up_60_characters": "Email, up to 60 characters",
        "fill_invoice_header_maximum_200_characters": "Please fill in the invoice header, with a maximum of 200 characters",
        "fill_unified_social_credit_code_tax": "Please fill in the unified social credit code or tax identification number of the enterprise, with a maximum of 160 characters",
        "fill_name_company_account_opening_bank": "Please fill in the name of the company's account opening bank, with a maximum of 200 characters",
        "fill_enterprise_account_number_maximum_160": "Please fill in the enterprise account number, with a maximum of 160 characters",
        "fill_company_contact_phone_number_which": "Please fill in the company's contact phone number, which is 6-15 characters long",
        "fill_registered_address_company_maximum_230": "Please fill in the registered address of the company, with a maximum of 230 characters",
        "fill_recipient_name_format_between_30": "Please fill in the recipient's name format between 2 and 30 characters",
        "fill_recipient_phone_number_which_should": "Please fill in the recipient's phone number, which should be 6-15 characters long",
        "provide_recipient_address_maximum_230_characters": "Please provide the recipient's address, with a maximum of 230 characters"
    },
    "friendpay": {
        "pay_mode_title": "Invite friend to pay"
    }
};
var spa = {
    "pages": {
        "buy": "Confirmar pedido"
    },
    "common": {
        "text_2": "Información de factura",
        "text_6": "Solicitar factura",
        "no_invoice": "Sin factura"
    },
    "buy": {
        "payment_expand_all": "Mostrar todos los métodos de pago",
        "payment_collapse": "Ocultar métodos de pago",
        "to": " a ",
        "shipping_method": "Método de envío",
        "coupons": "Cupones",
        "store_secondary_card": "Tarjeta de tienda",
        "points": "puntos",
        "quick_input": "Entrada rápida",
        "display_type_does_allow_submission_orders": "El tipo de exhibición no permite enviar pedidos",
        "select_shipping_address": "Seleccione la dirección de envío",
        "select_pickup_address": "Seleccione la dirección de recogida",
        "select_coupon": "Seleccione un cupón",
        "enter_store_order": "Ir al pedido de la tienda",
        "select_time": "Seleccionar hora",
        "my_name": "Mi nombre",
        "my_phone": "Mi teléfono",
        "fill_name_phone_number": "Complete el nombre y el teléfono",
        "optional_coupons": "Cupones disponibles",
        "there_currently_available_coupons_available": "No hay cupones disponibles",
        "select_address": "Seleccione una dirección",
        "modify": "Editar información de factura",
        "text_4": "Ver información de factura",
        "pay": "El pago con billetera no admite facturación",
        "pay_2": "El método de pago actual es billetera y no admite facturación",
        "current_mode_does_allow_use_addresses": "El modo actual no permite usar direcciones",
        "not_use_coupons": "No usar cupones",
        "not_use_secondary_cards": "No usar tarjetas",
        "text_5": "¿Necesita factura?"
    }
};
export default createPageLocaleMixin({ zh, en, spa });
