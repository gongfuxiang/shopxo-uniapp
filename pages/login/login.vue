<template>
    <view>
        <view class="content">
            <block v-if="(home_site_logo_square || null) != null">
                <!-- 存在用户信息 -->
                <block v-if="user != null">
                    <!-- 表单验证码 -->
                    <view v-if="current_opt_form == 'bind_verify'" class="form-content">
                        <form @submit="formBind">
                            <view class="tc">
                                <image class="icon circle auto dis-block margin-bottom-xxl br" :src="(user.avatar || null) == null ? '/static/images/default-user.png' : user.avatar" mode="widthFix"></image>
                                <view v-if="(user.nickname || null) != null" class="cr-base">{{user.nickname}}</view>
                            </view>
                            <view class="margin-top-xxxl padding-top-xxxl">
                                <input type="number" placeholder="输入手机号码" maxlength="11" name="mobile" @input="form_input_mobile_event" class="form-item margin-vertical-main wh-auto">
                                <view class="code pr margin-vertical-main">
                                    <input type="number" placeholder="验证码" name="verify" maxlength="4">
                                    <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{verify_submit_text}}</button>
                                </view>
                                <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">确认绑定</button>
                            </view>
                            <view class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-xxxl tc">
                                <text class="cr-blue" data-value="bind" @tap="opt_form_event">返回上一页</text>
                            </view>
                        </form>
                    </view>
                    <block v-else>
                        <!-- 确认绑定方式 -->
                        <view class="form-content">
                            <view class="tc">
                                <image class="icon circle auto dis-block margin-bottom-xxl br" :src="(user.avatar || null) == null ? '/static/images/default-user.png' : user.avatar" mode="widthFix"></image>
                                <view v-if="(user.nickname || null) != null" class="cr-base">{{user.nickname}}</view>
                            </view>
                            <block v-if="current_opt_form == 'bind'">
                                <view class="margin-top-xxxl padding-top-xxxl">
                                    <button class="bg-main-pair br-main-pair cr-white round text-size" type="warn" hover-class="none" data-value="bind_verify" @tap="opt_form_event">手机验证码</button>
                                    <!-- #ifdef MP-WEIXIN || MP-BAIDU -->
                                    <button v-if="common_user_is_onekey_bind_mobile == 1" class="margin-top-xxl bg-main br-main cr-white round text-size" type="default" hover-class="none" open-type="getPhoneNumber" @getphonenumber="confirm_phone_number_event">获取手机号码一键登录</button>
                                    <!-- #endif -->
                                </view>
                                <!-- 当前还没有账号的情况下才可以操作登录和注册绑定 -->
                                <view v-if="(user || null) == null || (user.id || null) == null" class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-main">
                                    <!-- 登录 -->
                                    <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="margin-bottom-xxxl tc">
                                        <text class="cr-main round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="login" @tap="opt_form_event">绑定已有账号</text>
                                    </view>
                                    <!-- 注册 -->
                                    <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0" class="margin-bottom-xl tc">
                                        <text class="cr-main-pair round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="reg" @tap="opt_form_event">注册账号并绑定</text>
                                    </view>
                                </view>
                            </block>
                            <view v-else class="tc margin-top-xxxl">
                                <view class="cr-green">已成功登录、请点击进入首页</view>
                                <navigator open-type="switchTab" url="/pages/index/index" class="dis-inline-block auto bg-main br-main cr-white round text-size-sm padding-left-xxxl padding-right-xxxl padding-top-xs padding-bottom-xs margin-top-xl">进入首页</navigator>
                            </view>
                        </view>
                    </block>
                </block>

                <!-- 站点logo -->
                <image v-if="current_opt_form != 'bind' && current_opt_form != 'bind_verify' && current_opt_form != 'success'" class="icon circle auto dis-block br" :src="home_site_logo_square" mode="widthFix"></image>
                
                <!-- 非登录成功则需要展示的数据 -->
                <block v-if="current_opt_form != 'success'">
                    <!-- 错误提示信息 -->
                    <view v-if="(error_msg || null) != null" class="margin-top-xxxl margin-bottom-lg tc padding-horizontal-main">
                        <icon type="warn" size="16" color="#f00" class="va-m" />
                        <text class="cr-red va-m margin-left-sm">{{error_msg}}</text>
                    </view>

                    <!-- 绑定账号提示 -->
                    <view v-if="(plugins_thirdpartylogin_user || null) != null && (plugins_thirdpartylogin_user.is_force_bind_user || 0) == 1" class="plugins-thirdpartylogin-bind tc padding-horizontal-main margin-top-xxxl">
                        <image :src="plugins_thirdpartylogin_user.avatar" mode="aspectFit" class="round br va-m"></image>
                        <text class="cr-blue margin-left-sm">{{plugins_thirdpartylogin_user.nickname}}</text>
                        <text class="va-m margin-left-lg cr-grey">登录帐号将自动绑定{{plugins_thirdpartylogin_user.platform_name}}用户</text>
                        <button type="default" size="mini" class="br-red cr-red bg-white round va-m text-size-xs margin-left-lg padding-top-xs padding-bottom-xs" @tap="plugins_thirdpartylogin_cancel_event">取消</button>
                    </view>
                </block>

                <!-- 登录 -->
                <view v-if="current_opt_form == 'login'" class="form-content">
                    <form @submit="formLogin">
                        <!-- 账号密码 -->
                        <block v-if="current_opt_type == 'login_username'">
                            <input type="text" placeholder="输入用户名/手机/邮箱" maxlength="60" name="accounts" class="form-item margin-vertical-main wh-auto">
                            <input type="text" placeholder="输入登录密码" minlength="6" maxlength="18" name="pwd" password="true" class="form-item margin-vertical-main wh-auto">
                            <view  v-if="home_user_login_img_verify_state == 1" class="verify pr margin-vertical-main">
                                <input type="text" placeholder="验证码" name="verify" maxlength="4" :value="form_input_image_verify_value" @input="form_input_image_verify_event">
                                <image v-if="(verify_image_url || null) != null" :src="verify_image_url" class="verify-image pa" mode="aspectFit" data-type="user_login" @tap="image_verify_event"></image>
                            </view>
                        </block>
                        <!-- 手机 -->
                        <block v-if="current_opt_type == 'login_sms'">
                            <input type="number" placeholder="输入手机号码" maxlength="11" name="accounts" @input="form_input_mobile_event" class="form-item margin-vertical-main wh-auto">
                            <view class="code pr margin-vertical-main">
                                <input type="number" placeholder="验证码" name="verify" maxlength="4">
                                <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{verify_submit_text}}</button>
                            </view>
                        </block>
                        <!-- 邮箱 -->
                        <block v-if="current_opt_type == 'login_email'">
                            <input type="text" placeholder="输入电子邮箱" maxlength="60" name="accounts" @input="form_input_email_event" class="form-item margin-vertical-main wh-auto">
                            <view class="code pr margin-vertical-main">
                                <input type="number" placeholder="验证码" name="verify" maxlength="4">
                                <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{verify_submit_text}}</button>
                            </view>
                        </block>
                        <!-- 协议 -->
                        <view class="margin-top-xxxl cr-gray">
                            <view class="dis-inline-block va-m" @tap="agreement_change">
                                <radio-group class="dis-inline-block va-m" style="transform:scale(0.6)">
                                    <label>
                                        <radio value="agreement" color="#20a53a" :checked="agreement_status" />
                                    </label>
                                </radio-group>
                            </view>
                            <view class="dis-inline-block va-m">
                                阅读并同意 《<text class="cr-main" @tap="agreement_event" data-value="userregister">服务协议</text>》 与 《<text class="cr-main" @tap="agreement_event" data-value="userprivacy">隐私政策</text>》
                            </view>
                        </view>
                        <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">确认登录</button>
                        <view class="margin-top-xxl oh">
                            <!-- #ifdef H5 || APP -->
                            <view v-if="(plugins_thirdpartylogin_data || null) != null && (plugins_thirdpartylogin_config || null) != null" class="plugins-thirdpartylogin fl">
                                <block v-for="(item,index) in plugins_thirdpartylogin_data">
                                    <view class="item dis-inline-block round" :style="'background-color:'+item.bg_color+';'" :data-type="index" :data-url="item.login_url" @tap="plugins_thirdpartylogin_event">
                                        <image :src="item.icon" mode="aspectFit" class="dis-block auto margin-top-xs"></image>
                                    </view>
                                </block>
                            </view>
                            <!-- #endif -->
                            <text class="cr-gray fr" data-value="forget" @tap="opt_form_event">找回密码</text>
                        </view>
                        <view class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-main">
                            <!-- #ifdef MP -->
                            <!-- 小程序授权登录 -->
                            <view class="margin-bottom-xxxl tc">
                                <text v-if="(user || null) == null" class="cr-red round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="auth" @tap="opt_form_event">使用授权自动登录</text>
                                <text v-else class="cr-red round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="bind" @tap="opt_form_event">返回上一页</text>
                            </view>
                            <!-- #endif -->
                            <!-- 注册 -->
                            <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0" class="margin-bottom-xxxl tc">
                                <text class="cr-main-pair round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="reg" @tap="opt_form_event">还没账号？立即注册</text>
                            </view>
                            <!-- 登录方式选择 -->
                            <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="opt-type-list margin-bottom-xl tc">
                                <text v-if="home_user_login_type.indexOf('username') != -1" class="cr-blue" data-value="login_username" @tap="opt_type_event">账号密码</text>
                                <text v-if="home_user_login_type.indexOf('sms') != -1" class="cr-blue" data-value="login_sms" @tap="opt_type_event">短信验证码</text>
                                <text v-if="home_user_login_type.indexOf('email') != -1" class="cr-blue" data-value="login_email" @tap="opt_type_event">邮箱验证码</text>
                            </view>
                        </view>
                    </form>
                </view>

                <!-- 注册 -->
                <view v-else-if="current_opt_form == 'reg'" class="form-content">
                    <form @submit="formReg">
                        <!-- 账号密码 -->
                        <block v-if="current_opt_type == 'reg_username'">
                            <input type="text" placeholder="输入用户名" maxlength="60" name="accounts" class="form-item margin-vertical-main wh-auto">
                            <input type="text" placeholder="输入登录密码" minlength="6" maxlength="18" name="pwd" password="true" class="form-item margin-vertical-main wh-auto">
                            <view  v-if="home_user_register_img_verify_state == 1" class="verify pr margin-vertical-main">
                                <input type="text" placeholder="验证码" name="verify" maxlength="4" :value="form_input_image_verify_value" @input="form_input_image_verify_event">
                                <image v-if="(verify_image_url || null) != null" :src="verify_image_url" class="verify-image pa" mode="aspectFit" data-type="user_reg" @tap="image_verify_event"></image>
                            </view>
                        </block>
                        <!-- 手机 -->
                        <block v-if="current_opt_type == 'reg_sms'">
                            <input type="number" placeholder="输入手机号码" maxlength="11" name="accounts" @input="form_input_mobile_event" class="form-item margin-vertical-main wh-auto">
                            <view class="code pr margin-vertical-main">
                                <input type="number" placeholder="验证码" name="verify" maxlength="4">
                                <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{verify_submit_text}}</button>
                            </view>
                            <input type="text" placeholder="输入登录密码" minlength="6" maxlength="18" name="pwd" password="true" class="form-item margin-vertical-main wh-auto">
                        </block>
                        <!-- 邮箱 -->
                        <block v-if="current_opt_type == 'reg_email'">
                            <input type="text" placeholder="输入电子邮箱" maxlength="60" name="accounts" @input="form_input_email_event" class="form-item margin-vertical-main wh-auto">
                            <view class="code pr margin-vertical-main">
                                <input type="number" placeholder="验证码" name="verify" maxlength="4">
                                <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{verify_submit_text}}</button>
                            </view>
                            <input type="text" placeholder="输入登录密码" minlength="6" maxlength="18" name="pwd" password="true" class="form-item margin-vertical-main wh-auto">
                        </block>
                        <!-- 协议 -->
                        <view class="margin-top-xxxl cr-gray">
                            <view class="dis-inline-block va-m" @tap="agreement_change">
                                <radio-group class="dis-inline-block va-m" style="transform:scale(0.6)">
                                    <label>
                                        <radio value="agreement" color="#20a53a" :checked="agreement_status" />
                                    </label>
                                </radio-group>
                            </view>
                            <view class="dis-inline-block va-m">
                                阅读并同意 《<text class="cr-main" @tap="agreement_event" data-value="userregister">服务协议</text>》 与 《<text class="cr-main" @tap="agreement_event" data-value="userprivacy">隐私政策</text>》
                            </view>
                        </view>
                        <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">确认注册</button>
                        <view class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-main">
                            <!-- #ifdef MP -->
                            <!-- 小程序授权登录 -->
                            <view class="margin-bottom-xxxl tc">
                                <text v-if="(user || null) == null" class="cr-red round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="auth" @tap="opt_form_event">使用授权自动登录</text>
                                <text v-else class="cr-red round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="bind" @tap="opt_form_event">返回上一页</text>
                            </view>
                            <!-- #endif -->
                            <!-- 登录 -->
                            <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="margin-bottom-xxxl tc">
                                <text class="cr-main-pair round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="login" @tap="opt_form_event">已有账号？立即登录</text>
                            </view>
                            <!-- 注册方式选择 -->
                            <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0" class="opt-type-list margin-bottom-xl tc">
                                <text v-if="home_user_reg_type.indexOf('username') != -1" class="cr-blue" data-value="reg_username" @tap="opt_type_event">账号密码</text>
                                <text v-if="home_user_reg_type.indexOf('sms') != -1" class="cr-blue" data-value="reg_sms" @tap="opt_type_event">短信验证码</text>
                                <text v-if="home_user_reg_type.indexOf('email') != -1" class="cr-blue" data-value="reg_email" @tap="opt_type_event">邮箱验证码</text>
                            </view>
                        </view>
                    </form>
                </view>

                <!-- 找回密码 -->
                <view v-else-if="current_opt_form == 'forget'" class="form-content">
                    <form @submit="formForget">
                        <input type="text" placeholder="输入手机/邮箱" maxlength="60" name="accounts" @input="form_input_accounts_event" class="form-item margin-vertical-main wh-auto">
                        <view class="code pr margin-vertical-main">
                            <input type="number" placeholder="验证码" name="verify" maxlength="4">
                            <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{verify_submit_text}}</button>
                        </view>
                        <input type="text" placeholder="设置登录密码" minlength="6" maxlength="18" name="pwd" password="true" class="form-item margin-vertical-main wh-auto">
                        <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">确认提交</button>
                        <view class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-main">
                            <!-- #ifdef MP -->
                            <!-- 小程序授权登录 -->
                            <view class="margin-bottom-xxxl tc">
                                <text v-if="(user || null) == null" class="cr-red round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="auth" @tap="opt_form_event">使用授权自动登录</text>
                                <text v-else class="cr-red round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="bind" @tap="opt_form_event">返回上一页</text>
                            </view>
                            <!-- #endif -->
                            <!-- 登录 -->
                            <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="margin-bottom-xxxl tc">
                                <text class="cr-main round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="login" @tap="opt_form_event">已有账号？立即登录</text>
                            </view>
                            <!-- 注册 -->
                            <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0" class="margin-bottom-xl tc">
                                <text class="cr-main-pair round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="reg" @tap="opt_form_event">还没账号？立即注册</text>
                            </view>
                        </view>
                    </form>
                </view>

                <!-- #ifdef MP -->
                <!-- 小程序授权 -->
                <view v-if="current_opt_form == 'auth' && (user || null) == null" class="margin-top-xxxl tc">
                    <view class="cr-base">确认登录授权，为您提供更优质的服务</view>
                    <view class="margin-top-sm cr-gray">
                        <view class="dis-inline-block va-m" @tap="agreement_change">
                            <radio-group style="transform:scale(0.6)">
                                <label>
                                    <radio value="agreement" color="#20a53a" :checked="agreement_status" />
                                </label>
                            </radio-group>
                        </view>
                        <view class="dis-inline-block va-m">
                            阅读并同意 《<text class="cr-main" @tap="agreement_event" data-value="userregister">服务协议</text>》 与 《<text class="cr-main" @tap="agreement_event" data-value="userprivacy">隐私政策</text>》
                        </view>
                    </view>
                    <view class="margin-top-xxl">
                        <navigator open-type="navigateBack" hover-class="none" class="dis-inline-block margin-right-lg">
                            <button class="bg-yellow br-yellow cr-white round" type="default" size="mini" hover-class="none">取消</button>
                        </navigator>
                        <!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
                        <button class="margin-left-lg bg-green br-green cr-white round" type="default" size="mini" @tap="get_user_info_event">使用授权自动登录</button>
                        <!-- #endif -->
                        <!-- #ifdef MP-QQ || MP-BAIDU -->
                        <button class="margin-left-lg bg-green br-green cr-white round" type="default" size="mini" open-type="getUserInfo" @getuserinfo="get_user_info_event">使用授权自动登录</button>
                        <!-- #endif -->
                        <!-- #ifdef MP-ALIPAY -->
                        <button class="margin-left-lg bg-green br-green cr-white round" type="default" size="mini" open-type="getAuthorize" @getAuthorize="get_user_info_event" scope="userInfo">使用授权自动登录</button>
                        <!-- #endif -->
                    </view>
                    <view class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-main">
                        <!-- 登录 -->
                        <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="margin-bottom-xxxl tc">
                            <text class="cr-main round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="login" @tap="opt_form_event">已有账号？立即登录</text>
                        </view>
                        <!-- 注册 -->
                        <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0" class="margin-bottom-xl tc">
                            <text class="cr-main-pair round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="reg" @tap="opt_form_event">还没账号？注册账号</text>
                        </view>
                    </view>
                </view>
                <!-- #endif -->

                <!-- 图片验证码弹层 -->
                <component-popup :propShow="popup_image_verify_status" propPosition="bottom" @onclose="popup_image_verify_close_event">
                    <view class="bg-white padding-horizontal-main padding-top-main">
                        <view class="fr oh">
                            <view class="fr" @tap.stop="popup_image_verify_close_event">
                                <icon type="clear" size="20"></icon>
                            </view>
                        </view>
                        <view class="form-content margin-top-xxxl padding-top-xxl">
                            <view class="verify pr margin-vertical-main">
                                <input type="text" placeholder="验证码" name="verify" maxlength="4" :value="form_input_image_verify_value" @input="form_input_image_verify_event">
                                <image v-if="(verify_image_url || null) != null" :src="verify_image_url" class="verify-image pa" mode="aspectFit" :data-type="'user_'+current_opt_form" @tap="image_verify_event"></image>
                            </view>
                            <view class="margin-top-xxxl margin-bottom-xxxl">
                                <button class="bg-main br-main cr-white round text-size" type="default" @tap="popup_image_verify_submit_event" hover-class="none" :disabled="verify_disabled">确认</button>
                            </view>
                        </view>
                    </view>
                </component-popup>
            </block>
            <view v-else class="margin-top-xxxl padding-top-xxxl tc">
                <text class="cr-red">基础数据有误、请点击刷新！</text>
                <view class="margin-top-xl">
                    <button type="default" size="mini" class="br-main cr-white bg-main dis-inline-block padding-left-xxxl padding-right-xxxl padding-top-sm padding-bottom-sm round" @tap="cache_refresh_event">刷新基础数据</button>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../common/js/lib/base64.js';
    import componentPopup from "../../components/popup/popup";

    export default {
        data() {
            return {
                params: null,
                user: null,
                form_input_mobile_value: '',
                form_input_email_value: '',
                form_input_accounts_value: '',
                form_input_image_verify_value: '',
                verify_submit_text: '获取验证码',
                verify_loading: false,
                verify_disabled: false,
                form_submit_loading: false,
                verify_time_total: 60,
                temp_clear_time: null,
                agreement_status: false,
                verify_image_url: null,
                popup_image_verify_status: false,
                // 基础配置
                common_user_is_onekey_bind_mobile: 0,
                home_site_logo_square: null,
                home_user_login_type: [],
                home_user_reg_type: [],
                home_user_login_img_verify_state: 0,
                home_user_register_img_verify_state: 0,
                common_img_verify_state: 0,
                // 0 确认绑定方式, 1 验证码绑定
                current_login_bind_type: 0,
                // 当前操作方式
                current_opt_form: 'auth',
                current_opt_type: 'auth',
                current_opt_type_title: {
                    auth: "授权用户信息",
                    bind: "绑定手机",
                    login_username: "账号密码登录",
                    login_sms: "手机验证码登录",
                    login_email: "邮箱验证码登录",
                    reg_username: "账号密码注册",
                    reg_sms: "手机验证码注册",
                    reg_email: "邮箱验证码注册",
                    forget: "密码找回",
                    success: "登录成功",
                },
                // 第三方登录
                plugins_thirdpartylogin_data: null,
                plugins_thirdpartylogin_user: null,
                // 错误提示信息
                error_msg: null
            };
        },

        components: {
            componentPopup
        },
        props: {},

        // 页面加载初始化
        onLoad(params) {
            this.setData({
                params: params
            });
            
            // 错误提示信息
            if((params.msg || null) != null) {
                var msg = base64.decode(decodeURIComponent(params.msg));
                this.setData({
                    error_msg: msg
                });
            }
            
            // 第三方登录成功处理
            if((params.thirdpartylogin || null) != null) {
                var user = JSON.parse(base64.decode(decodeURIComponent(params.thirdpartylogin)));
                this.setData({
                    plugins_thirdpartylogin_user: user
                });
                // 是否需要绑定账号
                if((user.is_force_bind_user || 0) != 1) {
                    uni.setStorageSync(app.globalData.data.cache_user_info_key, user);
                }
            }

            // 数据初始化
            this.init();
        },

        // 页面显示
        onShow() {            
            // 异步初始化配置
            this.init_config();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        methods: {
            // 数据初始化
            init() {
                // 缓存初始化配置
                this.init_config(true);

                // 用户信息
                var user = app.globalData.get_user_cache_info() || null;

                // 数据处理
                var type = (user == null) ? 'auth' : 'bind';
                var form = type;
                // #ifdef H5 || APP
                if(user == null) {
                    // 非小程序：如果开启登录则取第一个登录方式
                    if((this.home_user_login_type || null) != null && this.home_user_login_type.length > 0) {
                        // 开启登录则取第一个
                        form = 'login';
                        type = 'login_'+this.home_user_login_type[0];
                        
                        // 用户登录和验证码获取开启图片验证码
                        if(this.home_user_login_img_verify_state == 1 || this.common_img_verify_state == 1) {
                            this.image_verify_event('user_login');
                        }
                    }
                } else {
                    // 是否需要绑定手机
                    if (type == 'bind' && !app.globalData.user_is_need_login(user)) {
                        type = 'success';
                        form = 'success';
                    }
                }
                // #endif
                uni.setNavigationBarTitle({
                    title: this.current_opt_type_title[type]
                });
                this.setData({
                    user: user,
                    current_opt_type: type,
                    current_opt_form: form
                });
            },

            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        common_user_is_onekey_bind_mobile: app.globalData.get_config('config.common_user_is_onekey_bind_mobile'),
                        home_site_logo_square: app.globalData.get_config('config.home_site_logo_square'),
                        home_user_login_type: app.globalData.get_config('config.home_user_login_type'),
                        home_user_reg_type: app.globalData.get_config('config.home_user_reg_type'),
                        home_user_login_img_verify_state: app.globalData.get_config('config.home_user_login_img_verify_state'),
                        home_user_register_img_verify_state: app.globalData.get_config('config.home_user_register_img_verify_state'),
                        common_img_verify_state: app.globalData.get_config('config.common_img_verify_state'),
                        plugins_thirdpartylogin_config: app.globalData.get_config('plugins_base.thirdpartylogin.data'),
                        plugins_thirdpartylogin_data: app.globalData.get_config('plugins_thirdpartylogin_data')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 登录授权事件
            get_user_info_event(e) {
                // 是否已同意协议
                if(!this.agreement_status) {
                    app.globalData.showToast('请先同意协议');
                    return false;
                }

                // #ifdef MP-WEIXIN
                uni.getUserProfile({
                    desc: '用于完善会员资料',
                    lang: 'zh_CN',
                    success: (res) => {
                        this.user_auth_code(res.userInfo);
                    }
                });
                // #endif
                // #ifdef MP-QQ
                uni.getUserInfo({
                    withCredentials: true,
                    lang: 'zh_CN',
                    success: (res) => {
                        var userinfo = res.userInfo;
                        userinfo['encrypted_data'] = res.encryptedData;
                        userinfo['iv'] = res.iv;
                        this.user_auth_code(userinfo);
                    }
                });
                // #endif
                // #ifdef MP-ALIPAY
                uni.getOpenUserInfo({
                    success: (res) => {
                        var userinfo = JSON.parse(res.response).response;
                        this.user_auth_code(userinfo);
                    }
                });
                // #endif
                // #ifdef MP-BAIDU
                var userinfo = e.detail.userInfo;
                userinfo['encrypted_data'] = e.detail.encryptedData;
                userinfo['iv'] = e.detail.iv;
                this.user_auth_code(userinfo);
                // #endif
                // #ifdef MP-TOUTIAO
                if(e == 1) {
                    var self = this;
                    uni.getUserInfo({
                        success (res) {
                            var userinfo = JSON.parse(res.rawData);
                            self.user_auth_code(userinfo);
                        }
                    });
                } else {
                    app.globalData.auth_check(this, 'get_user_info_event', 'scope.userInfo');
                }
                // #endif
            },

            // 用户授权
            // auth_data  授权数据
            user_auth_code(auth_data) {
                if ((auth_data || null) != null) {
                    app.globalData.user_auth_login(this, 'user_auth_back_event', auth_data);
                } else {
                    app.globalData.showToast("授权失败");
                }
            },

            // 授权返回事件
            user_auth_back_event() {
                var user = app.globalData.get_user_cache_info();
                this.setData({
                    user: user || null
                });

                // 是否需要绑定手机号码
                if (app.globalData.user_is_need_login(user) == false) {
                    uni.navigateBack();
                }

                // 初始化
                this.init();
            },

            // 输入手机号码事件
            form_input_mobile_event(e) {
                this.setData({
                    form_input_mobile_value: e.detail.value
                });
            },

            // 输入邮箱事件
            form_input_email_event(e) {
                this.setData({
                    form_input_email_value: e.detail.value
                });
            },
            
            // 输入手机和邮箱事件
            form_input_accounts_event(e) {
                this.setData({
                    form_input_accounts_value: e.detail.value
                });
            },

            // 输入图片验证码事件
            form_input_image_verify_event(e) {
                this.setData({
                    form_input_image_verify_value: e.detail.value
                });
            },
            
            // 弹层图片验证码关闭
            popup_image_verify_close_event(e) {
                this.setData({
                    popup_image_verify_status: false
                });
            },
            
            // 弹层图片验证码确认
            popup_image_verify_submit_event(e) {
                this.verify_send_handle();
            },

            // 短信验证码发送事件
            verify_send_event() {
                // 手机号码验证：手机登录、手机注册、手机绑定
                if(this.current_opt_type == 'login_sms' || this.current_opt_type == 'reg_sms' || this.current_opt_type == 'bind') {
                    if((this.form_input_mobile_value || null) == null) {
                        app.globalData.showToast("请填写手机号码");
                        return false;
                    }
                }
                // 邮箱验证：邮箱登录、邮箱注册
                if(this.current_opt_type == 'login_email' || this.current_opt_type == 'reg_email') {
                    if((this.form_input_email_value || null) == null) {
                        app.globalData.showToast("请填写电子邮箱");
                        return false;
                    }
                }
                // 密码找回：邮箱或手机
                if(this.current_opt_type == 'forget' && (this.form_input_accounts_value || null) == null) {
                    app.globalData.showToast("请填写手机或邮箱");
                    return false;
                }
                // 是否开启图片验证码、绑定操作不使用图片验证码
                if(this.current_opt_form != 'bind' && this.current_opt_form != 'bind_verify') {
                    if(this.common_img_verify_state == 1) {
                        this.setData({
                            popup_image_verify_status: true
                        });
                        return false;
                    }
                }

                // 发送验证码处理
                this.verify_send_handle();
            },
            
            // 短信验证码发送处理
            verify_send_handle() {
                // 是否开启图片验证码
                if(this.current_opt_form != 'bind' && this.current_opt_form != 'bind_verify') {
                    if(this.common_img_verify_state == 1) {
                        if((this.form_input_image_verify_value || null) == null || this.form_input_image_verify_value.length < 4) {
                            app.globalData.showToast("请输入有效验证码");
                            return false;
                        }
                    }
                }
                
                // 请求数据
                var action = '';
                var image_verify_type = '';
                if(this.current_opt_form == 'bind' || this.current_opt_form == 'bind_verify') {
                    action = 'appmobilebindverifysend';
                    image_verify_type = 'user_bind';
                    var post_data = {
                        mobile: this.form_input_mobile_value || ''
                    };
                } else {
                    if(this.current_opt_form == 'login') {
                        action = 'loginverifysend';
                        image_verify_type = 'user_login';
                    } else if(this.current_opt_form == 'reg') {
                        action = 'regverifysend';
                        image_verify_type = 'user_reg';
                    } else if(this.current_opt_form == 'forget') {
                        action = 'forgetpwdverifysend';
                        image_verify_type = 'user_forget';
                    }
                    var accounts  = (this.current_opt_type == 'bind_verify' || this.current_opt_type == 'login_sms' || this.current_opt_type == 'reg_sms') ? this.form_input_mobile_value :  (this.current_opt_type == 'forget' ? this.form_input_accounts_value : this.form_input_email_value);
                    var post_data = {
                        accounts: accounts,
                        verify: this.form_input_image_verify_value,
                        type: this.current_opt_type.replace('login_', '').replace('reg_', '')
                    };
                }

                // 网络请求
                var self = this;
                uni.showLoading({
                    title: '发送中...'
                });
                this.setData({
                    verify_submit_text: '发送中',
                    verify_loading: true,
                    verify_disabled: true
                });
                uni.request({
                    url: app.globalData.get_request_url(action, 'user'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            // 是否开启图片验证码
                            if(this.common_img_verify_state == 1) {
                                this.setData({
                                    popup_image_verify_status: false
                                });
                            }

                            // 倒计时处理
                            this.setData({
                                verify_loading: false
                            });
                            var temp_time = this.verify_time_total;
                            this.temp_clear_time = setInterval(function() {
                                if (temp_time <= 1) {
                                    clearInterval(self.temp_clear_time);
                                    self.setData({
                                        verify_submit_text: '获取验证码',
                                        verify_disabled: false
                                    });
                                } else {
                                    temp_time--;
                                    self.setData({
                                        verify_submit_text: '剩余 ' + temp_time + ' 秒'
                                    });
                                }
                            }, 1000);
                        } else {
                            this.setData({
                                verify_submit_text: '获取验证码',
                                verify_loading: false,
                                verify_disabled: false,
                                form_input_image_verify_value: ''
                            });
                            this.image_verify_event(image_verify_type);
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            verify_submit_text: '获取验证码',
                            verify_loading: false,
                            verify_disabled: false,
                            form_input_image_verify_value: ''
                        });
                        this.image_verify_event(image_verify_type);
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 绑定手机表单提交
            formBind(e) {
                // 系统参数
                var params = app.globalData.get_launch_cache_info();
                
                // 数据验证
                var client_type = app.globalData.application_client_type();
                var field_openid = client_type+'_openid';
                var field_unionid = client_type+'_unionid';
                e.detail.value[field_openid] = this.user[field_openid] || '';
                e.detail.value[field_unionid] = this.user[field_unionid] || '';
                e.detail.value['nickname'] = this.user.nickname;
                e.detail.value['avatar'] = this.user.avatar;
                e.detail.value['province'] = this.user.province;
                e.detail.value['city'] = this.user.city;
                e.detail.value['gender'] = this.user.gender;
                e.detail.value['referrer'] = (params == null) ? ((this.user || null) == null ? 0 : this.user.referrer || 0) : params.referrer || 0;
                var validation = [
                    {fields: 'mobile', msg: '请填写手机号码'},
                    {fields: 'verify', msg: '请填写验证码'}
                ];
                // #ifdef MP
                validation.push({fields: field_openid, msg: '授权id不能为空'});
                // #endif
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    uni.showLoading({
                        title: '处理中...'
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('appmobilebind', 'user'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: res => {
                            this.user_success_handle(res);
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false
                            });
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },

            // 获取手机号码一键登录
            confirm_phone_number_event(e) {
                var encrypted_data = e.detail.encryptedData || null;
                var iv = e.detail.iv || null;
                if (encrypted_data != null && iv != null) {
                    // 系统参数、邀请人id
                    var params = app.globalData.get_launch_cache_info();
                    var referrer = (params == null) ? ((this.user || null) == null ? 0 : this.user.referrer || 0) : params.referrer || 0;
                    
                    // 解密数据并绑定手机
                    var client_type = app.globalData.application_client_type();
                    var field_openid = client_type+'_openid';
                    var field_unionid = client_type+'_unionid';
                    var data = {
                        "encrypted_data": encrypted_data,
                        "iv": iv,
                        "openid": this.user[field_openid] || '',
                        "nickname": this.user.nickname || '',
                        "avatar": this.user.avatar || '',
                        "province": this.user.province || '',
                        "city": this.user.city || '',
                        "gender": this.user.gender || 0,
                        "referrer": referrer
                    };
                    data[field_unionid] = this.user[field_unionid] || '';
                    uni.showLoading({
                        title: "处理中..."
                    });
                    var self = this;
                    uni.request({
                        url: app.globalData.get_request_url('onekeyusermobilebind', 'user'),
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        success: res => {
                            this.user_success_handle(res);
                        },
                        fail: () => {
                            uni.hideLoading();
                            self.showToast('服务器请求出错');
                        }
                    });
                }
            },
            
            // 登录表单提交
            formLogin(e) {   
                // 是否已同意协议
                if(!this.agreement_status) {
                    app.globalData.showToast('请先同意协议');
                    return false;
                }
                // 数据验证
                var validation = [];
                if(this.current_opt_type == 'login_sms') {
                    validation.push({fields: 'accounts', msg: '请输入手机号码'});
                }
                if(this.current_opt_type == 'login_email') {
                    validation.push({fields: 'accounts', msg: '请输入电子邮箱'});
                }
                if(this.current_opt_type == 'login_username') {
                    validation.push({fields: 'accounts', msg: '请输入账号'});
                    validation.push({fields: 'pwd', msg: '请输入密码'});
                }
                if(this.current_opt_type == 'login_sms' || this.current_opt_type == 'login_email' || (this.current_opt_type == 'login_username' && this.home_user_login_img_verify_state == 1)) {
                    validation.push({fields: 'verify', msg: '请输入验证码'});
                }
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    // 登录方式
                    e.detail.value['type'] = this.current_opt_type.replace('login_', '');

                    // #ifdef MP
                    // 小程序数据
                    var client_type = app.globalData.application_client_type();
                    if((this.user || null) != null) {
                        var field_openid = client_type+'_openid';
                        var field_unionid = client_type+'_unionid';
                        e.detail.value[field_openid] = this.user[field_openid] || '';
                        e.detail.value[field_unionid] = this.user[field_unionid] || '';
                    } else {
                        var login_data = app.globalData.get_login_cache_info();
                        if(login_data != null) {
                            var field_openid = client_type+'_openid';
                            var field_unionid = client_type+'_unionid';
                            e.detail.value[field_openid] = login_data['openid'] || '';
                            e.detail.value[field_unionid] = login_data['unionid'] || '';
                        }
                    }
                    // #endif

                    // 网络请求
                    uni.showLoading({
                        title: '登录中...'
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    uni.request({
                        url: app.globalData.get_request_url('login', 'user'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: res => {
                            this.user_success_handle(res);
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false
                            });
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },
            
            // 注册表单提交
            formReg(e) {   
                // 是否已同意协议
                if(!this.agreement_status) {
                    app.globalData.showToast('请先同意协议');
                    return false;
                }
                // 数据验证
                var validation = [];
                if(this.current_opt_type == 'reg_sms') {
                    validation.push({fields: 'accounts', msg: '请输入手机号码'});
                }
                if(this.current_opt_type == 'reg_email') {
                    validation.push({fields: 'accounts', msg: '请输入电子邮箱'});
                }
                if(this.current_opt_type == 'reg_username') {
                    validation.push({fields: 'accounts', msg: '请输入账号'});
                    validation.push({fields: 'pwd', msg: '请输入密码'});
                }
                if(this.current_opt_type == 'reg_sms' || this.current_opt_type == 'reg_email' || (this.current_opt_type == 'reg_username' && this.home_user_register_img_verify_state == 1)) {
                    validation.push({fields: 'verify', msg: '请输入验证码'});
                }
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    // 注册方式
                    e.detail.value['type'] = this.current_opt_type.replace('reg_', '');
                    
                    // #ifdef MP
                    // 小程序数据
                    var client_type = app.globalData.application_client_type();
                    if((this.user || null) != null) {
                        var field_openid = client_type+'_openid';
                        var field_unionid = client_type+'_unionid';
                        e.detail.value[field_openid] = this.user[field_openid] || '';
                        e.detail.value[field_unionid] = this.user[field_unionid] || '';
                        e.detail.value['nickname'] = this.user.nickname;
                        e.detail.value['avatar'] = this.user.avatar;
                        e.detail.value['province'] = this.user.province;
                        e.detail.value['city'] = this.user.city;
                        e.detail.value['gender'] = this.user.gender;
                    } else {
                        var login_data = app.globalData.get_login_cache_info();
                        if(login_data != null) {
                            var field_openid = client_type+'_openid';
                            var field_unionid = client_type+'_unionid';
                            e.detail.value[field_openid] = login_data['openid'] || '';
                            e.detail.value[field_unionid] = login_data['unionid'] || '';
                        }
                    }
                    // #endif

                    // 系统参数、邀请人id
                    var params = app.globalData.get_launch_cache_info();
                    e.detail.value['referrer'] = (params == null) ? ((this.user || null) == null ? 0 : this.user.referrer || 0) : params.referrer || 0;

                    // 网络请求
                    uni.showLoading({
                        title: '注册中...'
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    uni.request({
                        url: app.globalData.get_request_url('reg', 'user'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: res => {
                            this.user_success_handle(res);
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false
                            });
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },
            
            // 密码找回表单提交
            formForget(e) {   
                // 数据验证
                var validation = [
                    {fields: 'accounts', msg: '请输入手机或邮箱'},
                    {fields: 'verify', msg: '请输入验证码'},
                    {fields: 'pwd', msg: '请设置密码'}
                ];
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    // 网络请求
                    uni.showLoading({
                        title: '处理中...'
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    uni.request({
                        url: app.globalData.get_request_url('forgetpwd', 'user'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: res => {
                            uni.hideLoading();
                            if(res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                var self = this;
                                setTimeout(function() {
                                    var opt_type = ((self.home_user_login_type || null) != null && self.home_user_login_type.length > 0) ? 'login_'+self.home_user_login_type[0] : null;
                                    self.setData({
                                        form_submit_loading: false,
                                        current_opt_form: "login",
                                        current_opt_type: opt_type
                                    });
                                    if(opt_type != null) {
                                        // 是否开启图片验证码
                                        if(self.home_user_login_img_verify_state == 1 || self.common_img_verify_state == 1) {
                                            self.image_verify_event('user_login');
                                        }
                                    }
                                }, 3000);
                            } else {
                                this.setData({
                                    form_submit_loading: false
                                });
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false
                            });
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },
            
            // 登录和注册成功回调处理
            user_success_handle(res) {
                if (res.data.code == 0 && (res.data.data || null) != null) {
                    // 清除定时任务并存储用户信息
                    clearInterval(this.temp_clear_time);
                    uni.setStorageSync(app.globalData.data.cache_user_info_key, res.data.data);

                    // 是否强制绑定账号处理
                    if((this.plugins_thirdpartylogin_user || null) != null && (this.plugins_thirdpartylogin_user.is_force_bind_user || 0) == 1) {
                        uni.request({
                            url: app.globalData.get_request_url('bind', 'index', 'thirdpartylogin'),
                            method: 'POST',
                            data: this.plugins_thirdpartylogin_user,
                            dataType: 'json',
                            success: res => {
                                if(res.data.code == 0) {
                                    uni.hideLoading();
                                    uni.setStorageSync(app.globalData.data.cache_user_info_key, res.data.data);
                                    this.success_back_handle(res);
                                } else {
                                    uni.hideLoading();
                                    this.setData({
                                        form_submit_loading: false
                                    });
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                this.setData({
                                    form_submit_loading: false
                                });
                                app.globalData.showToast("服务器请求出错");
                            }
                        });
                    } else {
                        uni.hideLoading();
                        this.success_back_handle(res);
                    }
                } else {
                    uni.hideLoading();
                    this.setData({
                        form_submit_loading: false
                    });
                    app.globalData.showToast(res.data.msg);
                }
            },
            
            // 成功后处理
            success_back_handle(res) {
                app.globalData.showToast(res.data.msg, 'success');
                var event_callback = this.params.event_callback || null;
                setTimeout(function() {
                    // 触发回调函数
                    if (event_callback != null) {
                        var pages = getCurrentPages();
                        if((pages[pages.length-2][event_callback] || null) != null) {
                            pages[pages.length-2][event_callback]();
                        }
                    }
                    uni.navigateBack();
                }, 1000);
            },

            // 协议事件
            agreement_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value == null) {
                    app.globalData.showToast('协议类型有误');
                    return false;
                }

                // 是否存在协议 url 地址
                var key = 'agreement_' + value + '_url';
                var url = app.globalData.get_config('config.' + key) || null;
                if (url == null) {
                    app.globalData.showToast('协议url地址有误');
                    return false;
                }

                // 打开 webview
                app.globalData.open_web_view(url);
            },

            // 协议改变
            agreement_change(e) {
                this.setData({
                    agreement_status: !this.agreement_status
                });
            },

            // 表单类型事件
            opt_form_event(e) {
                var value = e.currentTarget.dataset.value;
                var data = {
                    current_opt_form: value
                };
                
                // 小程序使用授权自动登录
                // 切换手机绑定方式
                if(value == 'auth' || value == 'bind') {
                    data['current_opt_type'] = value;
                }

                // 密码找回同时设置表单类型
                if(value == 'forget') {
                    data['current_opt_type'] = 'forget';
                    if(this.common_img_verify_state == 1) {
                        this.image_verify_event('user_forget');
                    }
                }

                // 开启登录则取第一个
                if(value == 'login' && this.home_user_login_type.length > 0) {
                    data['current_opt_type'] = 'login_'+this.home_user_login_type[0];
                    // 是否开启图片验证码
                    if(this.home_user_login_img_verify_state == 1 || this.common_img_verify_state == 1) {
                        this.image_verify_event('user_login');
                    }
                }

                // 开启注册则取第一个
                if(value == 'reg' && this.home_user_reg_type.length > 0) {
                    data['current_opt_type'] = 'reg_'+this.home_user_reg_type[0];
                    // 是否开启图片验证码
                    if(this.home_user_register_img_verify_state == 1 || this.common_img_verify_state == 1) {
                        this.image_verify_event('user_reg');
                    }
                }
                this.setData(data);

                // 标题
                if((data.current_opt_type || null) != null) {
                    uni.setNavigationBarTitle({
                        title: this.current_opt_type_title[data.current_opt_type]
                    });
                }
            },
            
            // 操作类型事件
            opt_type_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if(value != null) {
                    this.setData({
                        current_opt_type: value
                    });

                    // 图片验证码
                    if(value == 'login_username' && this.home_user_login_img_verify_state == 1) {
                        this.image_verify_event('user_login');
                    }
                    if((value == 'login_sms' || value == 'login_email') && this.common_img_verify_state == 1) {
                        this.image_verify_event('user_login');
                    }
                    if(value == 'reg_username' && this.home_user_register_img_verify_state == 1) {
                        this.image_verify_event('user_reg');
                    }
                    if((value == 'reg_sms' || value == 'reg_email') && this.common_img_verify_state == 1) {
                        this.image_verify_event('user_reg');
                    }

                    // 标题
                    uni.setNavigationBarTitle({
                        title: this.current_opt_type_title[value]
                    });
                }
            },
            
            // 图片验证码事件
            image_verify_event(e) {
                var type = (typeof e == 'string') ? e : e.currentTarget.dataset.type || null;
                if(type !== null) {
                    var tv = app.globalData.get_timestamp();
                    var url = app.globalData.get_request_url('userverifyentry', 'user', '', 'type='+type+'&t='+tv);
                    this.setData({
                        verify_image_url: url
                    });
                }
            },
            
            // 缓存数据刷新
            cache_refresh_event(e) {
                app.globalData.init_config();
                var self = this;
                uni.showLoading({
                    title: '刷新中...'
                });
                setTimeout(function() {
                    self.init();
                    uni.hideLoading();
                }, 3000);
            },
            
            // 第三方登录事件
            plugins_thirdpartylogin_event(e) {
                // 是否已同意协议
                if(!this.agreement_status) {
                    app.globalData.showToast('请先同意协议');
                    return false;
                }
                // 直接跳转到登录地址、这里还可以根据终端类型进行处理业务逻辑
                var type = e.currentTarget.dataset.type || null;
                var url = e.currentTarget.dataset.url || null;
                window.location.href = url;
            },
            
            // 第三方登录绑定账号取消
            plugins_thirdpartylogin_cancel_event(e) {
                uni.redirectTo({
                    url: '/pages/login/login'
                });
            }
        }
    };
</script>
<style>
    @import './login.css';
</style>