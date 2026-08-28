var zh = {
    "pages": {
        "plugins-lottery-grid": "幸运抽奖",
        "plugins-lottery-turn": "转盘抽奖",
        "plugins-lottery-egg": "砸金蛋",
        "plugins-lottery-egg-chances-label": "今日可抽",
        "plugins-lottery-turn-draw": "立即抽奖",
        "plugins-lottery-turn-chances-label": "可用次数",
        "plugins-lottery-record": "我的中奖"
    },
    "lottery": {
        "rules_title": "抽奖规则",
        "thanks_join": "谢谢参与",
        "try_again_tips": "再努力努力肯定就会中哦！",
        "congrats_get": "恭喜您获得",
        "my_prize": "我的中奖",
        "balance_label": "余额：",
        "integral_label": "，积分：",
        "draw_fail": "抽奖失败",
        "activity_unavailable": "活动暂不可用",
        "draw_now": "立即抽奖",
        "won_prefix": "抽中"
    }
};
var en = {
    "pages": {
        "plugins-lottery-grid": "Lucky Draw",
        "plugins-lottery-turn": "Wheel Lottery",
        "plugins-lottery-egg": "Golden Egg",
        "plugins-lottery-egg-chances-label": "Chances today",
        "plugins-lottery-turn-draw": "Spin Now",
        "plugins-lottery-turn-chances-label": "Chances",
        "plugins-lottery-record": "My Winnings"
    },
    "lottery": {
        "rules_title": "Lottery rules",
        "thanks_join": "Thanks for participating",
        "try_again_tips": "Keep trying, you will win!",
        "congrats_get": "Congratulations, you won",
        "my_prize": "My prizes",
        "balance_label": "Balance:",
        "integral_label": ", Points:",
        "draw_fail": "Lottery failed",
        "activity_unavailable": "Activity unavailable",
        "draw_now": "Draw now",
        "won_prefix": "Won"
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
