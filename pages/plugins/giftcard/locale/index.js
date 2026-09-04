var zh = {
    "pages": {
        "plugins-giftcard-index": "我的礼品卡",
        "plugins-giftcard-form": "礼品卡兑换"
    },
    "giftcard-index": {
        "card_type": "卡密类型",
        "cami_key": "卡密key",
        "card_security_data": "卡密数据",
        "redemption_time": "兑换时间",
        "card_exchange": "卡密兑换",
        "use_data": "使用数据",
        "enter_card_password_key": "请输入卡密key",
        "card_exchange_closed_tips": "未开启卡密兑换、请联系管理员！"
    }
};
var en = {
    "pages": {
        "plugins-giftcard-index": "My Gift Cards",
        "plugins-giftcard-form": "Redeem Gift Card"
    },
    "giftcard-index": {
        "card_type": "Card type",
        "cami_key": "Card key",
        "card_security_data": "Card data",
        "redemption_time": "Redeemed at",
        "card_exchange": "Redeem card",
        "use_data": "Usage data",
        "enter_card_password_key": "Enter card key",
        "card_exchange_closed_tips": "Card redemption is not enabled. Please contact the administrator."
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
