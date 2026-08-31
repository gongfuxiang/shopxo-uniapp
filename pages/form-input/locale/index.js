var zh = {
    pages: {
        "form-input": "表单"
    }
};
var en = {
    pages: {
        "form-input": "Form input"
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
