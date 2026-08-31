var zh = {
    "pages": {
        "paytips": "安全支付"
    },
    "paytips": {
        "processing": "正在处理中",
        "payment_canceled": "已取消支付",
        "network_connection_error": "网络连接出错",
        "payment_result_unknown": "支付结果未知",
        "other_abnormal_errors": "其它异常错误"
    }
};
var en = {
    "pages": {
        "paytips": "Secure payment"
    },
    "paytips": {
        "processing": "Processing",
        "payment_canceled": "Payment canceled",
        "network_connection_error": "Network connection error",
        "payment_result_unknown": "Payment result unknown",
        "other_abnormal_errors": "Other abnormal errors"
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
