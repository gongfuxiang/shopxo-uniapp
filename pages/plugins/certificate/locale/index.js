var zh = {
    "pages": {
        "plugins-certificate-userauth": "资质认证",
        "plugins-certificate-userauth-saveinfo": "资质认证编辑",
        "plugins-certificate-userauth-detail": "资质认证详情"
    },
    "certificate-userauth": {
        "go_authenticate": "去认证",
        "certificate_name": "证件名称",
        "id": "证件号码",
        "expiration_date": "过期时间"
    }
};
var en = {
    "pages": {
        "plugins-certificate-userauth": "Certificate",
        "plugins-certificate-userauth-saveinfo": "Certificate editor",
        "plugins-certificate-userauth-detail": "Certificate detail"
    },
    "certificate-userauth": {
        "go_authenticate": "Go authenticate",
        "certificate_name": "Certificate Name",
        "id": "ID NO",
        "expiration_date": "Expiration date"
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
