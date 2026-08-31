var zh = {
    "pages": {
        "plugins-bargain-team": "帮砍",
        "plugins-bargain-index": "砍价",
        "plugins-bargain-detail": "砍价详情",
        "plugins-bargain-order": "我的砍价"
    },
    "plugins-bargain-order": {
        "order": {
            "enter_bargain_order": "请输入砍价单号"
        }
    },
    "bargain": {
        "bargain": "砍价",
        "play_rules": "砍价玩法",
        "goods_price": "商品售价",
        "help_cut": "帮砍",
        "join_count": "参与数",
        "launch_count": "发起次数",
        "join_bargain": "参与砍价",
        "people_helped": "人帮砍，",
        "invite_bargain": "快来一起砍价吧",
        "view_bargain": "查看砍价",
        "bargaining_need": "砍价中，还差",
        "people_success": "人砍价成功",
        "current_price": "当前价",
        "bargain_success": "砍价成功",
        "bargain_fail": "砍价失败",
        "bargain_fail_tips": "很遗憾，本次砍价未成功",
        "login_to_help": "登录后帮砍",
        "help_now": "立即帮砍",
        "already_helped": "已帮砍",
        "invite_help": "请邀请帮砍",
        "cannot_help": "暂无法帮砍",
        "invite_help_cut": "邀请帮砍",
        "cancel_launch": "取消发起砍价",
        "bargain_record": "砍价记录",
        "invite_you_help": "邀请你帮砍",
        "invite_help_one": "人帮砍，快来帮砍一刀吧",
        "help_success": "帮砍成功",
        "go_bargain": "去砍价",
        "people_help_cut_suffix": "人帮砍",
        "floor_price": "底价",
        "already_cut": "已砍",
        "cut_remain": "还剩",
        "success_go_pay": "恭喜您砍价成功，快去支付吧！",
        "bargain_rules": "砍价规则"
    }
};
var en = {
    "pages": {
        "plugins-bargain-team": "Help cut",
        "plugins-bargain-index": "Bargain",
        "plugins-bargain-detail": "Bargain details",
        "plugins-bargain-order": "My bargain"
    },
    "plugins-bargain-order": {
        "order": {
            "enter_bargain_order": "Enter bargain order no."
        }
    },
    "bargain": {
        "bargain": "Bargain",
        "play_rules": "How to bargain",
        "goods_price": "Product price",
        "help_cut": "Help cut",
        "join_count": "Participants",
        "launch_count": "Launches",
        "join_bargain": "Join bargain",
        "people_helped": "people helped,",
        "invite_bargain": "Come bargain together",
        "view_bargain": "View bargain",
        "bargaining_need": "Bargaining, still need",
        "people_success": "people to succeed",
        "current_price": "Current price",
        "bargain_success": "Bargain success",
        "bargain_fail": "Bargain failed",
        "bargain_fail_tips": "Sorry, this bargain did not succeed",
        "login_to_help": "Log in to help",
        "help_now": "Help now",
        "already_helped": "Already helped",
        "invite_help": "Invite to help",
        "cannot_help": "Cannot help now",
        "invite_help_cut": "Invite help",
        "cancel_launch": "Cancel bargain",
        "bargain_record": "Bargain records",
        "invite_you_help": "Invite you to help",
        "invite_help_one": "people helped, come help",
        "help_success": "Help successful",
        "go_bargain": "Go bargain",
        "people_help_cut_suffix": " helped",
        "floor_price": "Floor price",
        "already_cut": "Cut",
        "cut_remain": "Remaining",
        "success_go_pay": "Congratulations! Bargain succeeded, go pay now!",
        "bargain_rules": "Bargain rules"
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
