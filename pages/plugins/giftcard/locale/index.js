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
        "enter_card_password_key": "请输入卡密key"
    }
};
var en = {
    "pages": {
        "plugins-giftcard-index": "My gift card",
        "plugins-giftcard-form": "Gift card redemption"
    },
    "giftcard-index": {
        "card_type": "Card type",
        "cami_key": "Cami key",
        "card_security_data": "Card security data",
        "redemption_time": "Redemption time",
        "card_exchange": "Card exchange",
        "use_data": "Use data",
        "enter_card_password_key": "Please enter the card password key"
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
