import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
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
        "my_own_operation_ignore_application": "If this is not your action, please ignore the request",
        "successfully_logged": "Logged in successfully"
    }
};
var spa = {
    "pages": {
        "plugins-thirdpartylogin-index": "Inicio de sesión autorizado"
    },
    "index": {
        "authorized_login": "Inicio de sesión autorizado",
        "my_own_operation_ignore_application": "Si no es su operación, ignore la solicitud",
        "successfully_logged": "Sesión iniciada correctamente"
    }
};
export default createPageLocaleMixin({ zh, en, spa });
