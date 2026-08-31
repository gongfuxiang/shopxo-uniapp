var zh = {
    "pages": {
        "user-orderaftersale-detail": "订单售后"
    },
    "invoice-detail": {
        "reason_rejection": "拒绝原因",
        "express_name": "快递名称"
    },
    "user-orderaftersale-detail": {
        "immediate_return": "立即退货",
        "return_address": "退货地址",
        "voucher": "凭证",
        "reason_refund": "退款原因",
        "number_items": "商品件数",
        "quantity_cannot_greater_than": "数量不能大于",
        "cannot_greater_than": "不能大于",
        "refund_instructions": "退款说明",
        "upload_credentials": "上传凭证",
        "upload_up_images": "最多上传3张图片",
        "select_reason": "请选择原因",
        "enter_refund_amount": "请输入退款金额",
        "refund_instructions_up_200_characters_long": "退款说明最多200个字符",
        "enter_courier_name": "请输入快递名称",
        "enter_tracking_number": "请输入快递单号",
        "refund_type": "退款类型",
        "current_state": "当前状态",
        "reason_application": "申请原因",
        "return_quantity": "退货数量",
        "refund_method": "退款方式",
        "return_time": "退货时间",
        "review_time": "审核时间",
        "select_operation_type": "请选择操作类型",
        "select_quantity_returns": "请选择退货数量",
        "fill_courier_name": "请填写快递名称",
        "fill_courier_tracking_number": "请填写快递单号",
        "applied_platform_intervention_mediation": "您已申请平台介入调解！",
        "apply_platform_intervention": "申请平台介入"
    }
};
var en = {
    "pages": {
        "user-orderaftersale-detail": "After sales of orders"
    },
    "invoice-detail": {
        "reason_rejection": "Reason for rejection",
        "express_name": "Express name"
    },
    "user-orderaftersale-detail": {
        "immediate_return": "Immediate return",
        "return_address": "Return address",
        "voucher": "voucher",
        "reason_refund": "Reason for refund",
        "number_items": "Number of items",
        "quantity_cannot_greater_than": "Quantity cannot be greater than",
        "cannot_greater_than": "Cannot be greater than",
        "refund_instructions": "Refund instructions",
        "upload_credentials": "Upload credentials",
        "upload_up_images": "Upload up to 3 images",
        "select_reason": "Please select the reason",
        "enter_refund_amount": "Please enter the refund amount",
        "refund_instructions_up_200_characters_long": "Refund instructions can be up to 200 characters long",
        "enter_courier_name": "Please enter the courier name",
        "enter_tracking_number": "Please enter the tracking number",
        "refund_type": "Refund type",
        "current_state": "current state",
        "reason_application": "Reason for application",
        "return_quantity": "Return quantity",
        "refund_method": "Refund method",
        "return_time": "Return time",
        "review_time": "Review time",
        "select_operation_type": "Please select the operation type",
        "select_quantity_returns": "Please select the quantity of returns",
        "fill_courier_name": "Please fill in the courier name",
        "fill_courier_tracking_number": "Please fill in the courier tracking number",
        "applied_platform_intervention_mediation": "You have applied for platform intervention in mediation!",
        "apply_platform_intervention": "Apply for platform intervention"
    }
};
var merged = false;
function usePluginLocale(i18n) {
    if (merged || !i18n || typeof i18n.mergeLocaleMessage != 'function') {
        return;
    }
    merged = true;
    i18n.mergeLocaleMessage('zh', zh);
    i18n.mergeLocaleMessage('zh-Hans', zh);
    i18n.mergeLocaleMessage('en', en);
}

export default {
    beforeCreate() {
        usePluginLocale(this.$i18n);
    }
};
