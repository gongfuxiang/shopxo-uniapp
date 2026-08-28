var zh = {
    "pages": {},
    "login": {
        "account_password_login": "账号密码登录",
        "confirm_binding": "确认绑定",
        "return_previous_page": "返回上一页",
        "mobile_verification_code": "手机验证码",
        "get_phone_number_log_one_click": "获取手机号码一键登录",
        "bind_existing_account": "绑定已有账号",
        "register_account_bind": "注册账号并绑定",
        "successfully_logged_click_return_previous_page": "已成功登录、请点击返回上一页",
        "login_account_automatically_bound": "登录帐号将自动绑定",
        "account": "账号",
        "temporarily_closed_login": "暂时关闭了登录",
        "read_agree": "阅读并同意",
        "and": "与",
        "new_user_registration": "新用户注册",
        "retrieve_password": "找回密码",
        "authorization_automatically_log": "授权自动登录",
        "temporarily_closed_registration": "暂时关闭了注册",
        "confirm_registration": "确认注册",
        "register_now": "立即注册",
        "confirm_login_authorization_provide_better_servi": "确认登录授权，为您提供更优质的服务",
        "there_error_basic_data_automatically_loaded": "基础数据加载中...",
        "load_basic_data": "加载基础数据",
        "user_name": "用户名",
        "user_name_phone_email": "用户名/手机/邮箱",
        "login_password": "登录密码",
        "mobile_email": "手机/邮箱",
        "set_login_password": "设置登录密码",
        "bind_account": "绑定账户",
        "bind_successful": "绑定成功",
        "login_mobile_verification_code": "手机验证码登录",
        "email_verification_code_login": "邮箱验证码登录",
        "account_password_registration": "账号密码注册",
        "mobile_verification_code_registration": "手机验证码注册",
        "email_verification_code_registration": "邮箱验证码注册",
        "password_retrieval": "密码找回",
        "login_successful": "登录成功",
        "agree_agreement_first": "请先同意协议",
        "used_improve_member_info": "用于完善会员资料",
        "fill_phone_number": "请填写手机号码",
        "fill_email_address": "请填写电子邮箱",
        "fill_phone_email_address": "请填写手机或邮箱",
        "enter_valid_verification_code": "请输入有效验证码",
        "fill_account_number": "请填写账号",
        "fill_verification_code": "请填写验证码",
        "authorization_id_cannot_empty": "授权id不能为空",
        "enter_phone_number": "请输入手机号码",
        "enter_email_address": "请输入电子邮箱",
        "enter_account": "请输入账号",
        "logging": "登录中...",
        "registering": "注册中...",
        "enter_phone_email_address": "请输入手机或邮箱",
        "set_password": "请设置密码",
        "auto_load_failed_click_load": "如未自动加载则请手动点击加载！",
        "login_method_not_processed": "登录方式未处理"
    }
};
var en = {
    "pages": {},
    "login": {
        "account_password_login": "Account password login",
        "confirm_binding": "Confirm Binding",
        "return_previous_page": "Return to previous page",
        "mobile_verification_code": "Mobile verification code",
        "get_phone_number_log_one_click": "Get your phone number and log in with one click",
        "bind_existing_account": "Bind existing account",
        "register_account_bind": "Register an account and bind it",
        "successfully_logged_click_return_previous_page": "Successfully logged in, please click to return to the previous page",
        "login_account_automatically_bound": "Login account will be automatically bound",
        "account": "Account",
        "temporarily_closed_login": "Temporarily closed login",
        "read_agree": "Read and agree",
        "and": "And",
        "new_user_registration": "New User Registration",
        "retrieve_password": "Retrieve password",
        "authorization_automatically_log": "Authorization to automatically log in",
        "temporarily_closed_registration": "Temporarily closed registration",
        "confirm_registration": "Confirm Registration",
        "register_now": "Register Now",
        "confirm_login_authorization_provide_better_servi": "Confirm login authorization to provide you with better service",
        "there_error_basic_data_automatically_loaded": "There is an error in the basic data. If it is not automatically loaded, please manually click to load!",
        "load_basic_data": "Load basic data",
        "user_name": "User name",
        "user_name_phone_email": "User name/phone/email",
        "login_password": "Login password",
        "mobile_email": "Mobile/email",
        "set_login_password": "Set login password",
        "bind_account": "Bind account",
        "bind_successful": "Bind successful",
        "login_mobile_verification_code": "Login with mobile verification code",
        "email_verification_code_login": "Email verification code login",
        "account_password_registration": "Account password registration",
        "mobile_verification_code_registration": "Mobile verification code registration",
        "email_verification_code_registration": "Email verification code registration",
        "password_retrieval": "Password retrieval",
        "login_successful": "Login successful",
        "agree_agreement_first": "Please agree to the agreement first",
        "used_improve_member_info": "Used to improve member info",
        "fill_phone_number": "Please fill in your phone number",
        "fill_email_address": "Please fill in the email address",
        "fill_phone_email_address": "Please fill in your phone or email address",
        "enter_valid_verification_code": "Please enter a valid verification code",
        "fill_account_number": "Please fill in the account number",
        "fill_verification_code": "Please fill in the verification code",
        "authorization_id_cannot_empty": "Authorization ID cannot be empty",
        "enter_phone_number": "Please enter your phone number",
        "enter_email_address": "Please enter an email address",
        "enter_account": "Please enter an account",
        "logging": "Logging in",
        "registering": "Registering",
        "enter_phone_email_address": "Please enter your phone or email address",
        "set_password": "Please set password",
        "auto_load_failed_click_load": "If it is not automatically loaded, please manually click load!",
        "login_method_not_processed": "Login method not processed"
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
