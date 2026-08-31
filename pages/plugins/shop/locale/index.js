var zh = {
    "pages": {
        "plugins-shop-index": "所有店铺",
        "plugins-shop-detail": "店铺首页",
        "plugins-shop-search": "店铺商品搜索",
        "plugins-shop-design": "",
        "plugins-shop-favor": "店铺收藏",
        "plugins-shop-license": "工商资质",
        "plugins-shop-check": "订单核销"
    },
    "shop": {
        "received": "已领取"
    },
    "design": {
        "shop_close_weekname_shop_open_time": "至{{shop.close_week_name}}，{{shop.open_time}}-",
        "search_all": "搜全站",
        "online_service": "在线客服",
        "branch": "分",
        "view_product_categories": "查看商品分类",
        "enter_keywords_product_searching": "请输入您搜索的商品关键字",
        "search": "搜本店",
        "to": "至"
    },
    "index": {
        "internet_deviated_bit_00home": "网络开小差了哦~00home"
    },
    "detail": {
        "to": "至",
        "product_keywords": "商品关键字"
    },
    "diy": {
        "view_more_goods": "查看更多商品 >>"
    }
};
var en = {
    "pages": {
        "plugins-shop-index": "All stores",
        "plugins-shop-detail": "Store homepage",
        "plugins-shop-search": "Store Product Search",
        "plugins-shop-favor": "Store favorites",
        "plugins-shop-license": "Business qualifications",
        "plugins-shop-check": "Order verification"
    },
    "shop": {
        "received": "Received"
    },
    "design": {
        "shop_close_weekname_shop_open_time": "To {shop. close_weekname}, {shop. open-time}}-",
        "search_all": "Search All",
        "online_service": "Online Service",
        "branch": "branch",
        "view_product_categories": "View product categories",
        "enter_keywords_product_searching": "Please enter the keywords of the product you are searching for",
        "search": "Search",
        "to": "to"
    },
    "index": {
        "internet_deviated_bit_00home": "The internet has deviated a bit~00home"
    },
    "detail": {
        "to": "To",
        "product_keywords": "Product keywords"
    },
    "diy": {
        "view_more_goods": "View more products >>"
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
