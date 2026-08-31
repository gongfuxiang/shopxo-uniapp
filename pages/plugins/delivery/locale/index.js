var zh = {
    "pages": {
        "plugins-delivery-order": "配送订单",
        "plugins-delivery-order-detail": "订单详情",
        "plugins-delivery-logistics": "物流信息"
    },
    "logistics": {
        "delivery_time": "配送时间：",
        "delivery_started_yet": "未开始配送",
        "delivery_time_2": "送达时间：",
        "yet_delivered": "还没有送达"
    },
    "order": {
        "enter_order_number_recipient_recipient_phone": "输入订单号/收件人/收件电话",
        "abnormal_cause": "异常原因",
        "shipping_info": "发货信息",
        "receipt_info": "收货信息",
        "single_id": "单ID",
        "order_number": "单号",
        "address": "地址",
        "details": "详情",
        "start_delivery": "开始配送",
        "redelivery": "再次配送",
        "complete_delivery": "完成配送",
        "abnormal": "异常",
        "upload_photos": "上传照片",
        "submission_completed": "提交完成",
        "submit_exception": "提交异常",
        "description_up_200_characters_long": "描述最多200个字符",
        "reason_anomaly_up_200_characters_long": "异常原因最多200个字符",
        "sure_start_shipping_order": "确定开始配送订单吗？",
        "delivery": "配送中",
        "upload_photos_2": "请上传照片",
        "delivered": "已配送",
        "fill_reason": "请填写原因"
    },
    "order-detail": {
        "merchant_name": "商户名称",
        "delivery_status": "配送状态",
        "delivery_time": "配送时间",
        "complete_description": "完成描述",
        "complete_photos": "完成照片",
        "abnormal_time": "异常时间",
        "dispatch_time": "派单时间"
    }
};
var en = {
    "pages": {
        "plugins-delivery-order": "Delivery order",
        "plugins-delivery-order-detail": "Order details",
        "plugins-delivery-logistics": "Logistics info"
    },
    "logistics": {
        "delivery_time": "Delivery time:",
        "delivery_started_yet": "Delivery has not started yet",
        "delivery_time_2": "Delivery time:",
        "yet_delivered": "Not yet delivered"
    },
    "order": {
        "enter_order_number_recipient_recipient_phone": "Enter order number/recipient/recipient phone number",
        "abnormal_cause": "Abnormal cause",
        "shipping_info": "Shipping info",
        "receipt_info": "Receipt info",
        "single_id": "Single ID",
        "order_number": "Order number",
        "address": "Address",
        "details": "details",
        "start_delivery": "Start delivery",
        "redelivery": "Redelivery",
        "complete_delivery": "Complete delivery",
        "abnormal": "abnormal",
        "upload_photos": "Upload photos",
        "submission_completed": "Submission completed",
        "submit_exception": "Submit exception",
        "description_up_200_characters_long": "Description can be up to 200 characters long",
        "reason_anomaly_up_200_characters_long": "The reason for the anomaly can be up to 200 characters long",
        "sure_start_shipping_order": "Are you sure to start shipping the order?",
        "delivery": "In delivery",
        "upload_photos_2": "Please upload photos",
        "delivered": "Delivered",
        "fill_reason": "Please fill in the reason"
    },
    "order-detail": {
        "merchant_name": "Merchant name",
        "delivery_status": "Delivery status",
        "delivery_time": "Delivery time",
        "complete_description": "Complete description",
        "complete_photos": "Complete photos",
        "abnormal_time": "Abnormal time",
        "dispatch_time": "Dispatch time"
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
