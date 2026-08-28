var zh = {
    "pages": {
        "logout": "账号注销"
    },
    "logout": {
        "confirm_cancellation": "确认注销",
        "after_account_cancellation_cannot_restored_sure": "账号注销后不可恢复、确定继续吗？"
    }
};
var en = {
    "pages": {
        "logout": "Account cancellation"
    },
    "logout": {
        "confirm_cancellation": "Confirm cancellation",
        "after_account_cancellation_cannot_restored_sure": "After account cancellation, it cannot be restored. Are you sure to continue?"
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
