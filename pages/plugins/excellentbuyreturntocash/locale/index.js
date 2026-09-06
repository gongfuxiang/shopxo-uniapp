import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-excellentbuyreturntocash-profit": "优购返现明细",
        "plugins-excellentbuyreturntocash-profit-detail": "优购返现详情"
    },
    "profit": {
        "order_details": "订单详情",
        "immediate_settlement": "立即结算",
        "effect": "生效中",
        "effective_amount": "有效金额",
        "refund_amount": "返现金额",
        "order_id_incorrect": "订单id有误"
    },
    "profit-detail": {
        "settlement_time": "结算时间"
    }
};
var en = {
    "pages": {
        "plugins-excellentbuyreturntocash-profit": "Details of Yougou cashback",
        "plugins-excellentbuyreturntocash-profit-detail": "Details of Yougou cashback"
    },
    "profit": {
        "order_details": "Order details",
        "immediate_settlement": "Immediate settlement",
        "effect": "In effect",
        "effective_amount": "Effective amount",
        "refund_amount": "Refund amount",
        "order_id_incorrect": "Order ID is incorrect"
    },
    "profit-detail": {
        "settlement_time": "Settlement time"
    }
};
var spa = {
    "pages": {
        "plugins-excellentbuyreturntocash-profit": "Detalle de cashback",
        "plugins-excellentbuyreturntocash-profit-detail": "Detalle de cashback"
    },
    "profit": {
        "order_details": "Detalle del pedido",
        "immediate_settlement": "Liquidar ahora",
        "effect": "En vigor",
        "effective_amount": "Importe válido",
        "refund_amount": "Importe de cashback",
        "order_id_incorrect": "El ID del pedido es incorrecto"
    },
    "profit-detail": {
        "settlement_time": "Hora de liquidación"
    }
};
export default createPageLocaleMixin({ zh, en, spa });
