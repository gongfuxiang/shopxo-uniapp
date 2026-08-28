var zh = {
    "pages": {
        "user-goods-comments": "商品评论"
    },
    "user-goods-comments": {
        "displayed": "是否显示",
        "want_reply": "是否回复",
        "anonymous": "是否匿名",
        "comment_content": "评论内容"
    },
    "user-detail": {
        "reply_content": "回复内容",
        "reply_time": "回复时间"
    }
};
var en = {
    "pages": {
        "user-goods-comments": "Product reviews"
    },
    "user-goods-comments": {
        "displayed": "Is it displayed",
        "want_reply": "Do you want to reply",
        "anonymous": "Anonymous or not",
        "comment_content": "Comment content"
    },
    "user-detail": {
        "reply_content": "Reply content",
        "reply_time": "Reply time"
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
