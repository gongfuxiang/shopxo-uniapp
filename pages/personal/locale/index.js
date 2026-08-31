var zh = {
    "pages": {
        "personal": "个人资料"
    },
    "personal": {
        "birthday": "生日",
        "gender": "性别",
        "nickname_16": "昵称1~16个字符",
        "select_birthday": "请选择生日",
        "address_up_30_long": "详细地址最多30个字符"
    }
};
var en = {
    "pages": {
        "personal": "personal data"
    },
    "personal": {
        "birthday": "birthday",
        "gender": "Gender",
        "nickname_16": "Nickname of 1-16",
        "select_birthday": "Please select your birthday",
        "address_up_30_long": "Address can be up to 30 long"
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
