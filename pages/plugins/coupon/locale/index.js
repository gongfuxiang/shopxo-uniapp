var zh = {
    "pages": {
        "plugins-coupon-index": "领券中心",
        "plugins-coupon-detail": "优惠券",
        "plugins-coupon-shop": "店铺领券中心",
        "plugins-coupon-user": "我的卡券"
    },
    "coupon-card": {
        "there_currently_type_parameter_available": "暂无type参数",
        "go_ahead_use": "去使用"
    },
    "index": {
        "my_coupon": "我的优惠券"
    },
    "user": {
        "used_2": "已使用",
        "currently_any_coupons": "您暂无优惠券哦～",
        "unused": "未使用"
    }
};
var en = {
    "pages": {
        "plugins-coupon-index": "Coupon Collection Center",
        "plugins-coupon-detail": "Coupon",
        "plugins-coupon-shop": "Shop Coupon Collection Center",
        "plugins-coupon-user": "My coupons"
    },
    "coupon-card": {
        "there_currently_type_parameter_available": "There is currently no type parameter available",
        "go_ahead_use": "Go ahead and use it"
    },
    "index": {
        "my_coupon": "My coupon"
    },
    "user": {
        "used_2": "Used",
        "currently_any_coupons": "You currently do not have any coupons~",
        "unused": "not used"
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
