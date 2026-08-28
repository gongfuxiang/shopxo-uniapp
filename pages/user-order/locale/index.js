var zh = {
    "pages": {
        "user-order": "我的订单",
        "plugins-bargain-team": "帮砍",
        "plugins-groupbuy-team": "参团"
    },
    "friendpay": {
        "pay_mode_title": "邀请朋友代付",
        "order_id_error": "订单id有误"
    }
};
var en = {
    "pages": {
        "user-order": "My order",
        "plugins-bargain-team": "Help cut",
        "plugins-groupbuy-team": "Join group"
    },
    "friendpay": {
        "pay_mode_title": "Invite friend to pay",
        "order_id_error": "Invalid order id"
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
