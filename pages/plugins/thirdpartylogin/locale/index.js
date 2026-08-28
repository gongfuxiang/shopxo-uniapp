var zh = {
    "pages": {
        "plugins-thirdpartylogin-index": "授权登录"
    },
    "index": {
        "authorized_login": "授权登录",
        "my_own_operation_ignore_application": "若非本人操作，请忽略申请",
        "successfully_logged": "已登录成功"
    }
};
var en = {
    "pages": {
        "plugins-thirdpartylogin-index": "Authorized login"
    },
    "index": {
        "authorized_login": "Authorized login",
        "my_own_operation_ignore_application": "If it is not my own operation, please ignore the application",
        "successfully_logged": "Successfully logged in"
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
