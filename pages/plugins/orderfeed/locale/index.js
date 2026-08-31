var zh = {
    "pages": {
        "plugins-orderfeed-user": "反馈数据列表",
        "plugins-orderfeed-form": "反馈数据"
    },
    "orderfeed-form": {
        "choose_other_products": "选择其他商品",
        "feedback_product": "反馈该商品"
    }
};
var en = {
    "pages": {
        "plugins-orderfeed-user": "Feed List",
        "plugins-orderfeed-form": "Feed Data"
    },
    "orderfeed-form": {
        "choose_other_products": "Choose other products",
        "feedback_product": "Feedback on this product"
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
