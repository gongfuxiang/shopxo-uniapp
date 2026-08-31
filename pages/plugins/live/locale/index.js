var zh = {
    "pages": {
        "plugins-live-pull": "直播详情"
    },
    "live-content": {
        "socket_connection_failed": "socket连接失败！"
    },
    "live": {
        "exit_room": "退出直播间",
        "browser_mute_prefix": "因浏览器限制静音，",
        "click_unmute": "请点击打开声音",
        "host_away": "主播暂时离开",
        "host_away_tips": "休息片刻，更多精彩马上到来",
        "buy_goods": "购买商品",
        "connect_fail_retry": "连接失败点击重试",
        "like_this_session": "本场点赞",
        "new_messages_suffix": "条新消息",
        "socket_connect_fail_nth": "第{0}次连接失败",
        "socket_reconnecting_nth": "第{0}次重连中...",
        "live_ended": "直播已结束"
    }
};
var en = {
    "pages": {
        "plugins-live-pull": "Live Details"
    },
    "live-content": {
        "socket_connection_failed": "Socket connection failed!"
    },
    "live": {
        "exit_room": "Exit room",
        "browser_mute_prefix": "Browser muted,",
        "click_unmute": "Click to unmute",
        "host_away": "Host is away",
        "host_away_tips": "Break time, more coming soon",
        "buy_goods": "Buy products",
        "connect_fail_retry": "Connection failed, tap to retry",
        "like_this_session": "Likes this session",
        "new_messages_suffix": " new messages",
        "socket_connect_fail_nth": "Connection failed ({0})",
        "socket_reconnecting_nth": "Reconnecting ({0})...",
        "live_ended": "Live ended"
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
