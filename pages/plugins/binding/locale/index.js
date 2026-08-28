var zh = {
    "pages": {
        "plugins-binding-index": "组合搭配",
        "plugins-binding-detail": "组合搭配详情"
    },
    "detail": {
        "save": "节省",
        "select_specifications": "选择规格",
        "select_number": "请选择第",
        "product_specifications": "个商品规格",
        "section": "第",
        "item_unavailable": "个商品不可用"
    }
};
var en = {
    "pages": {
        "plugins-binding-index": "Combination and matching",
        "plugins-binding-detail": "Combination and matching details"
    },
    "detail": {
        "save": "save",
        "select_specifications": "Select specifications",
        "select_number": "Please select the number",
        "product_specifications": "Product specifications",
        "section": "Section",
        "item_unavailable": "Item unavailable"
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
