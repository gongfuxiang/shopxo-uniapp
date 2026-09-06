import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "common-open-setting-location": ""
    },
    "open-setting-location": {
        "permissions": "]权限",
        "enable_corresponding_permission_services": "开启相应的权限服务",
        "get": "获取[",
        "position_info": "位置信息",
        "open_settings_page": "打开设置页",
        "location_selection_failed": "位置选择失败"
    }
};
var en = {
    "open-setting-location": {
        "permissions": "]Permissions",
        "enable_corresponding_permission_services": "Enable corresponding permission services",
        "get": "Get[",
        "position_info": "position info",
        "open_settings_page": "Open the settings page",
        "location_selection_failed": "Location selection failed"
    }
};
export default createPageLocaleMixin({ zh, en });
