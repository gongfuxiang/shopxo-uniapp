var zh = {
    "pages": {
        "plugins-givegift-goods": "购买礼品",
        "plugins-givegift-receive": "礼品领取",
        "plugins-givegift-gift": "我的送礼",
        "plugins-givegift-gift-detail": "送礼详情",
        "plugins-givegift-code": "礼品链接"
    },
    "givegift-gift": {
        "unlimited_collection": "不限领取",
        "message_reminder": "留言提示",
        "message_prompt_maximum_format_200_characters": "留言提示,格式最多200个字符",
        "leave_message_ta_express_gratitude": "给Ta留言表示感谢！"
    },
    "givegift": {
        "my_gift": "我的送礼"
    }
};
var en = {
    "pages": {
        "plugins-givegift-goods": "Buying Gifts",
        "plugins-givegift-receive": "Gift collection",
        "plugins-givegift-gift": "My gift",
        "plugins-givegift-gift-detail": "gift details",
        "plugins-givegift-code": "Gift Link"
    },
    "givegift-gift": {
        "unlimited_collection": "Unlimited collection",
        "message_reminder": "Message reminder",
        "message_prompt_maximum_format_200_characters": "Message prompt, maximum format of 200 characters",
        "leave_message_ta_express_gratitude": "Leave a message for Ta to express gratitude!"
    },
    "givegift": {
        "my_gift": "My gifts"
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
