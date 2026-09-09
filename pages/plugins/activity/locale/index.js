import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
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
export default createPageLocaleMixin({ zh, en });
