var zh = {
    "pages": {
        "article-category": "所有文章"
    },
    "article-category": {
        "view_volume": "浏览量"
    }
};
var en = {
    "pages": {
        "article-category": "All articles"
    },
    "article-category": {
        "view_volume": "View volume"
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
