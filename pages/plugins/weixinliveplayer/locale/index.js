import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-weixinliveplayer-index": "直播",
        "plugins-weixinliveplayer-search": "直播列表",
        "plugins-weixinliveplayer-detail": "直播详情"
    },
    "index": {
        "new_live": "最新直播"
    },
    "detail": {
        "live_streaming_status": "直播状态",
        "start_time": "开播时间",
        "poster": "海报",
        "enter_live": "进入直播"
    },
    "search": {
        "living": "直播中",
        "paused": "暂停中",
        "not_started": "未开始"
    }
};
var en = {
    "pages": {
        "plugins-weixinliveplayer-index": "direct seeding",
        "plugins-weixinliveplayer-search": "Live streaming list",
        "plugins-weixinliveplayer-detail": "Live streaming details"
    },
    "index": {
        "new_live": "New Live"
    },
    "detail": {
        "live_streaming_status": "Live streaming status",
        "start_time": "Start time",
        "poster": "poster",
        "enter_live": "Enter live"
    },
    "search": {
        "living": "Living",
        "paused": "Paused",
        "not_started": "not begin"
    }
};
export default createPageLocaleMixin({ zh, en });
