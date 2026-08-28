var zh = {
    "pages": {
        "plugins-vip-index": "会员VIP",
        "plugins-vip-buy": "开通会员",
        "plugins-vip-user": "我的会员",
        "plugins-vip-order": "开通订单",
        "plugins-vip-order-detail": "订单详情",
        "plugins-vip-profit": "收益明细",
        "plugins-vip-profit-detail": "收益详情",
        "plugins-vip-poster": "推广奖励",
        "plugins-vip-team": "我的团队",
        "plugins-vip-member-code": "会员码"
    },
    "buy": {
        "card_type_selection": "卡种选择",
        "active": "立即开通",
        "all_orders": "所有订单",
        "select_duration_activation": "请选择开通时长",
        "incorrect_activation_duration": "开通时长有误",
        "purchase_duration_not_configured": "购买时长未配置",
        "member_level_not_configured": "未配置会员等级"
    },
    "index": {
        "join": "加入会员"
    },
    "user": {
        "rebate_overview": "返利概况",
        "activate_membership": "开通会员",
        "renewal_membership": "续费会员",
        "continuous_activation": "连续开通",
        "promote_customers": "推广客户"
    },
    "order": {
        "opening_order_number": "开通单号",
        "opening_duration": "开通时长"
    },
    "order-detail": {
        "type": "类型"
    },
    "profit": {
        "rebate_amount": "返佣金额"
    },
    "profit-detail": {
        "rebate_rules": "返佣规则"
    },
    "team": {
        "joined": "加入时间"
    },
    "member-code": {
        "member_code_empty": "会员码为空"
    }
};
var en = {
    "pages": {
        "plugins-vip-index": "Member VIP",
        "plugins-vip-buy": "Activate membership",
        "plugins-vip-user": "My Members",
        "plugins-vip-order": "Open an order",
        "plugins-vip-order-detail": "Order details",
        "plugins-vip-profit": "Revenue details",
        "plugins-vip-profit-detail": "Revenue details",
        "plugins-vip-poster": "Promotion rewards",
        "plugins-vip-team": "My team",
        "plugins-vip-member-code": "Member Code"
    },
    "buy": {
        "card_type_selection": "Card type selection",
        "active": "Active",
        "all_orders": "All orders",
        "select_duration_activation": "Please select the duration of activation",
        "incorrect_activation_duration": "Incorrect activation duration",
        "purchase_duration_not_configured": "Purchase duration not configured",
        "member_level_not_configured": "Member level not configured"
    },
    "index": {
        "join": "Join"
    },
    "user": {
        "rebate_overview": "Rebate Overview",
        "activate_membership": "Activate membership",
        "renewal_membership": "Renewal of membership",
        "continuous_activation": "Continuous activation",
        "promote_customers": "Promote customers"
    },
    "order": {
        "opening_order_number": "Opening order number",
        "opening_duration": "Opening duration"
    },
    "order-detail": {
        "type": "type"
    },
    "profit": {
        "rebate_amount": "Rebate amount"
    },
    "profit-detail": {
        "rebate_rules": "Rebate rules"
    },
    "team": {
        "joined": "Joined at"
    },
    "member-code": {
        "member_code_empty": "The member code is empty"
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
