var zh = {
    "pages": {
        "plugins-points-index": "积分商城",
        "plugins-points-search": "兑换商品搜索",
        "plugins-points-scan": "扫码领积分"
    },
    "points": {
        "search": {
            "title": "兑换商品搜索",
            "placeholder": "搜索可积分兑换的商品",
            "all_goods": "全部可兑换商品",
            "clear_where": "清除搜索条件"
        }
    },
    "index": {
        "get_details_member_points": "获知会员积分详情",
        "currently_available": "当前可用",
        "integral_rule": "积分规则",
        "points_details": "积分明细",
        "product_exchange": "商品兑换",
        "exchange": "兑换"
    }
};
var en = {
    "pages": {
        "plugins-points-index": "Points Mall",
        "plugins-points-search": "Exchange goods search",
        "plugins-points-scan": "Scan the QR code to claim points"
    },
    "points": {
        "search": {
            "title": "Exchange goods search",
            "placeholder": "Search redeemable goods",
            "all_goods": "All redeemable goods",
            "clear_where": "Clear search"
        }
    },
    "index": {
        "get_details_member_points": "Get details of member points",
        "currently_available": "Currently available",
        "integral_rule": "Integral rule",
        "points_details": "Points details",
        "product_exchange": "Product exchange",
        "exchange": "exchange"
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
