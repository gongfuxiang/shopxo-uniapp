var zh = {
    "pages": {
        "plugins-intellectstools-goods-comments": "商品评价"
    },
    "form": {
        "add_image": "添加图片("
    }
};
var en = {
    "pages": {
        "plugins-intellectstools-goods-comments": "Product evaluation"
    },
    "form": {
        "add_image": "Add image（"
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
