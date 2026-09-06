import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "password": "密码修改"
    },
    "password": {
        "confirm_new_password": "请确认新密码",
        "confirm_modifications": "确认修改",
        "enter_current_password": "请输入当前密码",
        "enter_new_password": "请输入新密码",
        "confirm_new_password_2": "确认新密码"
    }
};
var en = {
    "pages": {
        "password": "password modify"
    },
    "password": {
        "confirm_new_password": "Please confirm the new password",
        "confirm_modifications": "Confirm modifications",
        "enter_current_password": "Please enter the current password",
        "enter_new_password": "Please enter a new password",
        "confirm_new_password_2": "Confirm new password"
    }
};
export default createPageLocaleMixin({ zh, en });
