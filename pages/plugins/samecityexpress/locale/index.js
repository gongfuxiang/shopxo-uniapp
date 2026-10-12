import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        // 与 App 自动标题规则一致：pages/plugins/.../order/track → pages.plugins-samecityexpress-order
        "plugins-samecityexpress-order": "骑手轨迹"
    },
    "track": {
        "courier": "骑手",
        "status": "状态",
        "query_time": "查询时间",
        "kd_order_id": "配送平台单号",
        "cancel_reason": "取消说明",
        "send": "寄件",
        "rec": "收件",
        "official_url": "官方轨迹",
        "refresh": "刷新位置"
    }
};
var en = {
    "pages": {
        "plugins-samecityexpress-order": "Courier track"
    },
    "track": {
        "courier": "Courier",
        "status": "Status",
        "query_time": "Query time",
        "kd_order_id": "Platform order no.",
        "cancel_reason": "Cancel note",
        "send": "Sender",
        "rec": "Recipient",
        "official_url": "Official track",
        "refresh": "Refresh"
    }
};
export default createPageLocaleMixin({ zh, en });
