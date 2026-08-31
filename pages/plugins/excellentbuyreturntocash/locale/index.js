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
