var zh = {
    "pages": {
        "user-orderaftersale": "退款/售后"
    },
    "user-orderaftersale": {
        "confirmed": "待确认",
        "returned": "待退货",
        "pending_review": "待审核",
        "rejected": "已拒绝"
    }
};
var en = {
    "pages": {
        "user-orderaftersale": "Refund/After sales"
    },
    "user-orderaftersale": {
        "confirmed": "To be confirmed",
        "returned": "To be returned",
        "pending_review": "Pending review",
        "rejected": "Rejected"
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
