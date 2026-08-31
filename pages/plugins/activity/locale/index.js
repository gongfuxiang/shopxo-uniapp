var zh = {
    "pages": {
        "plugins-activity-index": "所有活动",
        "plugins-activity-detail": "活动详情"
    },
    "detail": {
        "activity_products": "活动商品",
        "more_activities": "更多活动"
    }
};
var en = {
    "pages": {
        "plugins-activity-index": "All activities",
        "plugins-activity-detail": "Event details"
    },
    "detail": {
        "activity_products": "Activity products",
        "more_activities": "More activities"
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
