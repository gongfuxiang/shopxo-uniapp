var zh = {
    "pages": {
        "plugins-presale-index": "预售",
        "plugins-presale-buy": "订单确认",
        "plugins-presale-order": "预售订单"
    }
};
var en = {
    "pages": {
        "plugins-presale-index": "Presale",
        "plugins-presale-buy": "Confirm Order",
        "plugins-presale-order": "Presale Orders"
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
