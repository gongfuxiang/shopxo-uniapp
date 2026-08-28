var zh = {
    "pages": {
        "goods-detail": "商品详情"
    },
    "goods-detail": {
        "coupon": "优惠券",
        "related_stores": "相关门店",
        "evaluation": "商品评价",
        "positive_review_rate": "好评率",
        "want_evaluate": "我要评价",
        "view_all_answers": "查看全部回答",
        "product_parameters": "商品参数",
        "product_details": "商品详情",
        "detailed_data_available_moment": "暂无详情数据",
        "suspend_sales": "暂停销售",
        "url_value_empty": "url值为空",
        "copy_value_empty": "复制值为空",
        "store_data_incorrect": "门店数据有误",
        "event_not_processed": "事件未处理("
    },
    "goods-comments": {
        "administrator_reply": "管理员回复：",
        "product_been_reviewed_yet": "此商品暂时还没有评价哦~"
    }
};
var en = {
    "pages": {
        "goods-detail": "Product details"
    },
    "goods-detail": {
        "coupon": "coupon",
        "related_stores": "Related stores",
        "evaluation": "Evaluation",
        "positive_review_rate": "Positive review rate",
        "want_evaluate": "I want to evaluate",
        "view_all_answers": "View all answers",
        "product_parameters": "Product parameters",
        "product_details": "Product details",
        "detailed_data_available_moment": "No detailed data available at the moment",
        "suspend_sales": "Suspend sales",
        "url_value_empty": "The URL value is empty",
        "copy_value_empty": "Copy value is empty",
        "store_data_incorrect": "Store data is incorrect",
        "event_not_processed": "Event not processed（"
    },
    "goods-comments": {
        "administrator_reply": "Administrator's reply:",
        "product_been_reviewed_yet": "This product has not been reviewed yet~"
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
