import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-groupbuy-team": "参团",
        "plugins-groupbuy-index": "拼团",
        "plugins-groupbuy-detail": "拼团详情",
        "plugins-groupbuy-order": "我的拼团"
    },
    "plugins-groupbuy-order": {
        "order": {
            "enter_group_buy_order": "请输入拼团单号"
        }
    },
    "groupbuy": {
        "join_team": "参团",
        "play_rules": "拼团玩法",
        "group_price": "拼团价",
        "group_formed": "成团",
        "group_count": "成团数",
        "open_now": "立即开团",
        "join_now": "立即参团",
        "invite_join": "，邀请你一起参团",
        "invite_group": "，快来一起拼团吧",
        "grouping_need": "拼团中，还差",
        "group_success": "拼团成功",
        "group_full_success": "恭喜！本团已满员，拼团圆满成团啦~",
        "full_group": "满员成团",
        "group_fail": "拼团失败",
        "group_fail_tips": "很遗憾，本次拼团未成团",
        "team_leader": "团长",
        "login_to_join": "登录后参团",
        "invite_friends": "邀请好友参团",
        "cancel_open": "取消开团",
        "invite_you": "邀请你参团",
        "people_group_invite": "人成团，快来一起拼团吧",
        "confirm_cancel": "确定要取消当前拼团吗？",
        "go_groupbuy": "去拼团",
        "group_buy_rules": "拼团规则",
        "group_buy": "拼团"
    }
};
var en = {
    "pages": {
        "plugins-groupbuy-team": "Join group",
        "plugins-groupbuy-index": "Group buy",
        "plugins-groupbuy-detail": "Group buy details",
        "plugins-groupbuy-order": "My Groupbuy"
    },
    "plugins-groupbuy-order": {
        "order": {
            "enter_group_buy_order": "Enter group buy order no."
        }
    },
    "groupbuy": {
        "join_team": "Join group",
        "play_rules": "How group buy works",
        "group_price": "Group price",
        "group_formed": "Group formed",
        "group_count": "Groups formed",
        "open_now": "Open group now",
        "join_now": "Join now",
        "invite_join": ", invite you to join",
        "invite_group": ", come group buy together",
        "grouping_need": "Grouping, still need",
        "group_success": "Group buy success",
        "group_full_success": "Congratulations! Group is full!",
        "full_group": "Full group",
        "group_fail": "Group buy failed",
        "group_fail_tips": "Sorry, this group did not form",
        "team_leader": "Team leader",
        "login_to_join": "Log in to join",
        "invite_friends": "Invite friends",
        "cancel_open": "Cancel group",
        "invite_you": "Invite you to join",
        "people_group_invite": "people group, join us",
        "confirm_cancel": "Cancel this group buy?",
        "go_groupbuy": "Go group buy",
        "group_buy_rules": "Group buy rules",
        "group_buy": "Group buy"
    }
};
export default createPageLocaleMixin({ zh, en });
