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
        "plugins-givegift-goods": "Buy Gift",
        "plugins-givegift-receive": "Claim Gift",
        "plugins-givegift-gift": "My Gifts",
        "plugins-givegift-gift-detail": "Gift Details",
        "plugins-givegift-code": "Gift Link"
    },
    "givegift-gift": {
        "unlimited_collection": "Unlimited claims",
        "message_reminder": "Message tip",
        "message_prompt_maximum_format_200_characters": "Message tip, up to 200 characters",
        "leave_message_ta_express_gratitude": "Leave a thank-you message!"
    },
    "givegift": {
        "my_gift": "My Gifts"
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
