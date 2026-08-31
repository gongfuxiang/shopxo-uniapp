var zh = {
    "pages": {
        "plugins-seckill-index": "限时秒杀"
    },
    "index": {
        "about_start_robbery": "即将开抢",
        "second_price_reduction": "秒杀价"
    }
};
var en = {
    "pages": {
        "plugins-seckill-index": "Limited time flash sale"
    },
    "index": {
        "about_start_robbery": "We are about to start a robbery",
        "second_price_reduction": "Second price reduction"
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
