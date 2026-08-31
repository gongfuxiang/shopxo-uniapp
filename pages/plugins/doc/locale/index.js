var zh = {
    pages: {
        "plugins-doc-index": "文档",
        "plugins-doc-search": "文档搜索",
        "plugins-doc-detail": "文档详情",
        "plugins-doc-user": "我的文档"
    },
    doc: {
        search_placeholder: "搜索文档",
        search_placeholder_all: "搜索文档名称或内容",
        search_group_doc: "文档",
        search_group_content: "文档内容",
        search_empty: "暂无搜索结果",
        menu: "目录",
        need_unlock: "本文档需要解锁后查看",
        pwd_placeholder: "请输入阅读密码",
        verify_code: "验证码",
        pwd_view: "密码查看",
        pay_view: "付费查看",
        need_integral: "需要",
        current_integral: "当前积分：{num}",
        integral_view: "积分查看",
        vip_only: "本文档仅指定会员等级可免费查阅",
        vip_levels: "可阅等级：{name}",
        vip_buy: "开通会员",
        switch_doc: "切换文档",
        more_nav: "更多导航",
        menu_keyword: "输入关键字",
        params_error: "参数有误",
        integral_confirm: "查看该文档需要{integral}积分，确定查看吗？",
        integral_confirm_days: "查看该文档需要{integral}积分（{days}），确定查看吗？",
        read: "阅读",
        continue_pay: "继续支付",
        refund_apply: "申请售后",
        cancel_pay_confirm: "确认取消待支付记录吗？",
        refund_confirm: "确认提交售后申请吗？",
        points: "积分"
    }
};
var en = {
    pages: {
        "plugins-doc-index": "Documents",
        "plugins-doc-search": "Document search",
        "plugins-doc-detail": "Document details",
        "plugins-doc-user": "My documents"
    },
    doc: {
        search_placeholder: "Search documents",
        search_placeholder_all: "Search document name or content",
        search_group_doc: "Documents",
        search_group_content: "Document content",
        search_empty: "No search results",
        menu: "Contents",
        need_unlock: "This document needs to be unlocked to view",
        pwd_placeholder: "Please enter the reading password",
        verify_code: "Captcha",
        pwd_view: "Unlock with password",
        pay_view: "Unlock with payment",
        need_integral: "Requires",
        current_integral: "Current points: {num}",
        integral_view: "Unlock with points",
        vip_only: "Only specified membership levels can view this document for free",
        vip_levels: "Eligible levels: {name}",
        vip_buy: "Activate membership",
        switch_doc: "Switch document",
        more_nav: "More navigation",
        menu_keyword: "Enter keywords",
        params_error: "Invalid parameters",
        integral_confirm: "Viewing this document requires {integral} points. Continue?",
        integral_confirm_days: "Viewing this document requires {integral} points ({days}). Continue?",
        read: "Read",
        continue_pay: "Continue payment",
        refund_apply: "Apply for after-sales",
        cancel_pay_confirm: "Cancel this unpaid record?",
        refund_confirm: "Submit the after-sales request?",
        points: "points"
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
