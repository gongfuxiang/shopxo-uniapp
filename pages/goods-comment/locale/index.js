var zh = {
    "pages": {
        "goods-comment": "商品评价"
    },
    "goods-comment": {
        "rate": "综合评分",
        "there_currently_rating_available": "暂无评分"
    },
    "goods-comments": {
        "administrator_reply": "管理员回复：",
        "product_been_reviewed_yet": "此商品暂时还没有评价哦~"
    }
};
var en = {
    "pages": {
        "goods-comment": "Product evaluation"
    },
    "goods-comment": {
        "rate": "Rate",
        "there_currently_rating_available": "There is currently no rating available"
    },
    "goods-comments": {
        "administrator_reply": "Administrator's reply:",
        "product_been_reviewed_yet": "This product has not been reviewed yet~"
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
