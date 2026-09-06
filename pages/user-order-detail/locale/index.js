import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "user-order-detail": "订单详情",
        "plugins-bargain-team": "帮砍",
        "plugins-groupbuy-team": "参团"
    },
    "user-order-detail": {
        "shipping_services": "出货服务",
        "traceability_info": "溯源信息",
        "pickup_code": "取货码",
        "extended_data": "扩展数据",
        "key_information": "密钥信息",
        "order_mode": "订单模式",
        "order_unit_price": "订单单价",
        "discount_amount": "优惠金额",
        "increase_amount": "增加金额",
        "guest_book": "用户留言",
        "delivery_time": "发货时间",
        "receiving_time": "收货时间",
        "closing_time": "关闭时间",
        "service_information": "服务信息",
        "service_duration": "服务时长",
        "service_name": "服务人姓名",
        "service_mobile": "服务人手机",
        "traceability_code": "追溯码",
        "batch_number": "批次号",
        "batch_expiry_date": "批次有效期"
    },
    "friendpay": {
        "pay_mode_title": "邀请朋友代付",
        "order_id_error": "订单id有误"
    }
};
var en = {
    "pages": {
        "user-order-detail": "Order details",
        "plugins-bargain-team": "Help cut",
        "plugins-groupbuy-team": "Join group"
    },
    "user-order-detail": {
        "shipping_services": "Shipping Services",
        "traceability_info": "Traceability info",
        "pickup_code": "Pickup code",
        "extended_data": "Extended Data",
        "key_information": "Key Information",
        "order_mode": "Order Mode",
        "order_unit_price": "Order unit price",
        "discount_amount": "Discount amount",
        "increase_amount": "Increase amount",
        "guest_book": "guest book ",
        "delivery_time": "Delivery time",
        "receiving_time": "Receiving time",
        "closing_time": "Closing time",
        "service_information": "service information",
        "service_duration": "Service duration",
        "service_name": "Service Name",
        "service_mobile": "Service Mobile",
        "traceability_code": "traceability code",
        "batch_number": "Batch Number",
        "batch_expiry_date": "Batch Expiry Date"
    },
    "friendpay": {
        "pay_mode_title": "Invite friend to pay",
        "order_id_error": "Invalid order id"
    }
};
export default createPageLocaleMixin({ zh, en });
