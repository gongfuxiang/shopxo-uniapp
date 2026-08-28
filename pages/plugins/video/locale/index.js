var zh = {
    "pages": {
        "plugins-video-index": "短视频列表",
        "plugins-video-detail": "短视频详情",
        "plugins-video-search": "短视频搜索",
        "plugins-video-search-record": "短视频搜索记录"
    },
    "video-detail": {
        "reason_reporting": "举报原因",
        "choose_specific_type": "请选择具体的类型",
        "enter_wonderful_comment": "请输入您的精彩评论",
        "already_first_video": "已经是第一个视频了",
        "already_last_video": "已经是最后一个视频了"
    },
    "video-search": {
        "release_time": "发布时间",
        "video_duration": "视频时长"
    }
};
var en = {
    "pages": {
        "plugins-video-index": "Short Video List",
        "plugins-video-detail": "Short video details",
        "plugins-video-search": "Short video search",
        "plugins-video-search-record": "Short video searchrecord"
    },
    "video-detail": {
        "reason_reporting": "Reason for reporting",
        "choose_specific_type": "Please choose a specific type",
        "enter_wonderful_comment": "Please enter your wonderful comment",
        "already_first_video": "This is already the first video",
        "already_last_video": "This is already the last video"
    },
    "video-search": {
        "release_time": "Release time",
        "video_duration": "video duration"
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
