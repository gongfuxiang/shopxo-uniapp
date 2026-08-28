var zh = {
    "pages": {
        "user-address": "我的地址"
    },
    "user-address": {
        "default": "默认",
        "add_new_address": "添加新地址",
        "import_system_address": "导入系统地址",
        "consignee": "收货人：",
        "contact_phone_number": "联系电话：",
        "shipping_address": "收货地址："
    }
};
var en = {
    "pages": {
        "user-address": "My address"
    },
    "user-address": {
        "default": "default",
        "add_new_address": "Add new address",
        "import_system_address": "Import System Address",
        "consignee": "Consignee:",
        "contact_phone_number": "Contact phone number:",
        "shipping_address": "Shipping address:"
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
