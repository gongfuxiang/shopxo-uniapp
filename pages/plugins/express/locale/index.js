var zh = {
    "pages": {
        "plugins-express-detail": "物流详情"
    },
    "detail": {
        "there_currently_logistics_info_available": "暂无物流信息"
    }
};
var en = {
    "pages": {
        "plugins-express-detail": "Logistics details"
    },
    "detail": {
        "there_currently_logistics_info_available": "There is currently no logistics info available"
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
