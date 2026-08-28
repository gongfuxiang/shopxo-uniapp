var zh = {
    "pages": {
        "setup": "设置",
        "plugins-complaint-form": "投诉/举报"
    },
    "setup": {
        "replace_phone": "更换手机",
        "click_replace": "点击更换",
        "click_bind": "点击绑定",
        "update_language": "修改语言",
        "address": "地址管理",
        "click_manage": "点击管理",
        "invoices": "发票管理",
        "click_go": "点击前往",
        "clear_cache": "清除缓存",
        "click_clear": "点击清除",
        "service_phone": "客服电话",
        "click_call": "点击拨打",
        "account_cancel": "账号注销",
        "about_us": "关于我们",
        "bind_phone_first": "请先绑定手机",
        "unbind": "解绑",
        "change_email": "更换邮箱",
        "change_password": "更换密码",
        "logout_cannot_recover": "注销后无法恢复"
    }
};
var en = {
    "pages": {
        "setup": "set up",
        "plugins-complaint-form": "Complaint/Report"
    },
    "setup": {
        "replace_phone": "Replace phone",
        "click_replace": "Click to replace",
        "click_bind": "Click to bind",
        "update_language": "update language",
        "address": "Address",
        "click_manage": "Click to manage",
        "invoices": "Invoices",
        "click_go": "Click to go",
        "clear_cache": "Clear cache",
        "click_clear": "Click to clear",
        "service_phone": "Service phone",
        "click_call": "Click to call",
        "account_cancel": "Account cancel",
        "about_us": "About Us",
        "bind_phone_first": "Please bind your phone first",
        "unbind": "Unbind",
        "change_email": "Change email",
        "change_password": "Change password",
        "logout_cannot_recover": "Logout and can't recover."
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
