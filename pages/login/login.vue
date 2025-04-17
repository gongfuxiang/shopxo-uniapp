<template>
    <view :class="theme_view">
        <view class="content">
            <block v-if="(is_exist_base_data || 0) == 1">
                <view class="flex-col jc-sb dom-content">
                    <view>
                        <!-- 多语言切换、绑定账户不展示语言切换 -->
                        <view v-if="home_use_multilingual_status == 1 && current_opt_form != 'bind_platform'" class="flex-row tr padding-top-sm padding-horizontal-lg padding-bottom-lg margin-bottom-xl">
                            <view class="flex-1 cr-base" @tap="open_language_event">
                                <view class="pr top-sm margin-right-sm dis-inline-block va-m">
                                    <iconfont name="icon-login-language" size="32rpx"></iconfont>
                                </view>
                                <text class="va-m text-size-sm">{{ language }}</text>
                                <view class="margin-left-sm dis-inline-block va-m">
                                    <iconfont name="icon-login-down-arrow" size="16rpx"></iconfont>
                                </view>
                            </view>
                        </view>

                        <!-- 绑定手机 -->
                        <view v-if="current_opt_form == 'bind_verify'" class="form-content">
                            <form @submit="form_submit_bind_mobile">
                                <view class="tc">
                                    <image class="icon circle auto dis-block margin-bottom-xxl br" :src="user.avatar || home_site_logo_square || '/static/images/common/user.png'" mode="widthFix"></image>
                                    <view v-if="(user.user_name_view || null) != null" class="cr-base">{{ user.user_name_view || '' }}</view>
                                </view>
                                <view class="margin-top-xxxl padding-top-xxxl">
                                    <input type="number" :placeholder="$t('login.login.28k91h')" maxlength="11" name="mobile" @input="form_input_mobile_event" class="form-item margin-vertical-main wh-auto" />
                                    <view class="code pr margin-vertical-main">
                                        <input type="number" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" />
                                        <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{ verify_submit_text }}</button>
                                    </view>
                                    <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{ $t('login.login.tfl656') }}</button>
                                </view>
                                <view class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-xxxl tc">
                                    <text class="cr-blue" data-value="bind" @tap="opt_form_event">{{ $t('login.login.483nho') }}</text>
                                </view>
                            </form>
                        </view>
                        <view v-if="current_opt_form == 'bind_email'" class="form-content">
                            <form @submit="form_submit_bind_email">
                                <view class="tc">
                                    <image class="icon circle auto dis-block margin-bottom-xxl br" :src="user.avatar || home_site_logo_square || '/static/images/common/user.png'" mode="widthFix"></image>
                                    <view v-if="(user.user_name_view || null) != null" class="cr-base">{{ user.user_name_view || '' }}</view>
                                </view>
                                <view class="margin-top-xxxl padding-top-xxxl">
                                    <input type="text" :placeholder="$t('login.login.db1rf4')" maxlength="60" name="email" @input="form_input_email_event" key="login_email_1" class="form-item margin-vertical-xl wh-auto" />
                                    <view class="code pr margin-vertical-main">
                                        <input type="number" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" />
                                        <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{ verify_submit_text }}</button>
                                    </view>
                                    <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{ $t('login.login.tfl656') }}</button>
                                </view>
                                <view class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-xxxl tc">
                                    <text class="cr-blue" data-value="bind" @tap="opt_form_event">{{ $t('login.login.483nho') }}</text>
                                </view>
                            </form>
                        </view>

                        <!-- 存在用户信息 -->
                        <block v-if="user != null">
                            <!-- 确认绑定方式 -->
                            <view v-if="current_opt_form == 'bind' || current_opt_form == 'success'" class="form-content">
                                <view class="tc">
                                    <image class="icon circle auto dis-block margin-bottom-xxl br" :src="user.avatar || home_site_logo_square || '/static/images/common/user.png'" mode="widthFix"></image>
                                    <view v-if="(user.user_name_view || null) != null" class="cr-base">{{ user.user_name_view || '' }}</view>
                                </view>
                                <block v-if="current_opt_form == 'bind'">
                                    <view v-if="(common_user_verify_bind_mobile_list.length > 0 && common_user_verify_bind_mobile_list.indexOf(client_value) != -1) || (common_user_onekey_bind_mobile_list.length > 0 && common_user_onekey_bind_mobile_list.indexOf(client_value) != -1)" class="margin-top-xxxl padding-top-xxxl">
                                        <button v-if="common_user_verify_bind_mobile_list.length > 0 && common_user_verify_bind_mobile_list.indexOf(client_value) != -1" class="bg-main-pair br-main-pair cr-white round text-size" type="warn" hover-class="none" data-value="bind_verify" @tap="opt_form_event">{{ $t('login.login.31r6p2') }}</button>
                                        <button v-if="common_user_onekey_bind_mobile_list.length > 0 && common_user_onekey_bind_mobile_list.indexOf(client_value) != -1" class="margin-top-xxl bg-main br-main cr-white round text-size" type="default" hover-class="none" open-type="getPhoneNumber" @getphonenumber="confirm_phone_number_event">{{ $t('login.login.p3kxy2') }}</button>
                                    </view>
                                    <!-- 当前还没有账号的情况下才可以操作登录和注册绑定 -->
                                    <view v-if="(user || null) == null || (user.id || null) == null" class="margin-top-xxxl padding-top-xxxl padding-horizontal-main padding-bottom-main">
                                        <!-- 登录 -->
                                        <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="margin-bottom-xxxl tc">
                                            <text class="cr-main round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="login" @tap="opt_form_event">{{ $t('login.login.54l805') }}</text>
                                        </view>
                                        <!-- 注册 -->
                                        <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0" class="margin-bottom-xl tc">
                                            <text class="cr-main-pair round padding-top-xs padding-bottom-xs padding-horizontal-main" data-value="reg" @tap="opt_form_event">{{ $t('login.login.q11t73') }}</text>
                                        </view>
                                    </view>
                                </block>
                                <view v-if="current_opt_form == 'success'" class="tc margin-top-xxxl">
                                    <view class="cr-green">{{ $t('login.login.s51ed9') }}</view>
                                    <button type="default" size="mini" class="dis-inline-block auto bg-main br-main cr-white round text-size-sm padding-left-xxxl padding-right-xxxl padding-top-xs padding-bottom-xs margin-top-xl" @tap="success_event">{{ $t('login.login.483nho') }}</button>
                                </view>
                            </view>
                        </block>

                        <!-- 账户绑定展示用户头像和名称 -->
                        <view v-if="current_opt_form == 'bind_platform'" class="padding-top-xxxxl margin-top-xxxxl tc">
                            <image class="icon circle auto dis-block margin-bottom-xxl br" :src="user.avatar || home_site_logo_square || '/static/images/common/user.png'" mode="widthFix"></image>
                            <view v-if="(user.user_name_view || null) != null" class="cr-base">{{ user.user_name_view || '' }}</view>
                        </view>

                        <!-- 默认站点logo -->
                        <image v-if="(home_site_logo_square || null) != null && current_opt_form != 'bind' && current_opt_form != 'bind_verify' && current_opt_form != 'bind_email' && current_opt_form != 'bind_platform' && current_opt_form != 'success'" class="icon circle auto dis-block br" :src="home_site_logo_square" mode="widthFix"></image>

                        <!-- 非登录成功则需要展示的数据 -->
                        <block v-if="current_opt_form != 'success'">
                            <!-- 错误提示信息 -->
                            <view v-if="(error_msg || null) != null" class="margin-top-xxxl margin-bottom-lg tc padding-horizontal-main">
                                <icon type="warn" size="16" color="#f00" class="va-m" />
                                <text class="cr-red va-m margin-left-sm">{{ error_msg }}</text>
                            </view>

                            <!-- 绑定账号提示 -->
                            <view v-if="(plugins_thirdpartylogin_user || null) != null && (plugins_thirdpartylogin_user.is_force_bind_user || 0) == 1" class="plugins-thirdpartylogin-bind tc padding-horizontal-main margin-top-xl">
                                <view class="margin-bottom-sm">
                                    <image v-if="(plugins_thirdpartylogin_user.avatar || null) != null" :src="plugins_thirdpartylogin_user.avatar" mode="aspectFit" class="round br va-m"></image>
                                    <text class="cr-blue margin-left-sm">{{ plugins_thirdpartylogin_user.nickname }}</text>
                                    <button type="default" size="mini" class="br-red cr-red bg-white round va-m text-size-xs margin-left-lg padding-top-xs padding-bottom-xs" @tap="plugins_thirdpartylogin_cancel_event">{{ $t('common.cancel') }}</button>
                                </view>
                                <view class="cr-grey text-size-xs">{{ $t('login.login.e77788') }}{{ plugins_thirdpartylogin_user.platform_name }}{{ $t('login.login.1i4o86') }}</view>
                            </view>
                        </block>

                        <!-- 登录 -->
                        <view v-if="current_opt_form == 'login'" class="form-content">
                            <form @submit="form_submit_login">
                                <!-- form表单距离去除顶部沾满整个空间的高度 -->
                                <view class="flex-col jc-sb">
                                    <view>
                                        <!-- 登录方式选择 -->
                                        <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="opt-type-list margin-vertical-xxxl">
                                            <text v-if="home_user_login_type.indexOf('username') != -1" class="padding-vertical-sm" :class="current_opt_type === 'login_username' ? 'cr-main nav-active-line' : ''" data-value="login_username" @tap="opt_type_event">{{ $t('login.login.n2pv70') }}</text>
                                            <text v-if="home_user_login_type.indexOf('sms') != -1" class="padding-vertical-sm" :class="current_opt_type === 'login_sms' ? 'cr-main nav-active-line' : ''" data-value="login_sms" @tap="opt_type_event">{{ $t('login.login.1p7843') }}</text>
                                            <text v-if="home_user_login_type.indexOf('email') != -1" class="padding-vertical-sm" :class="current_opt_type === 'login_email' ? 'cr-main nav-active-line' : ''" data-value="login_email" @tap="opt_type_event">{{ $t('login.login.p54kf1') }}</text>
                                        </view>
                                        <view v-else class="tc cr-grey padding-vertical-main">{{ $t('login.login.3i05ly') }}</view>
                                        <!-- 账号密码 -->
                                        <block v-if="current_opt_type == 'login_username'">
                                            <input type="text" :placeholder="$t('login.login.qe8a37')" maxlength="60" name="accounts" key="login_username_1" class="form-item margin-vertical-xl wh-auto" />
                                            <input type="text" :placeholder="$t('login.login.08fchn')" minlength="6" maxlength="18" name="pwd" password="true" key="login_username_2" class="form-item margin-vertical-xl wh-auto" />
                                            <view v-if="home_user_login_img_verify_state == 1" class="verify pr margin-vertical-xl">
                                                <input type="text" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" :value="form_input_image_verify_value" key="login_username_3" @input="form_input_image_verify_event" />
                                                <image v-if="(verify_image_url || null) != null" :src="verify_image_url" class="verify-image pa" mode="aspectFit" data-type="user_login" @tap="image_verify_event"></image>
                                            </view>
                                        </block>
                                        <!-- 手机 -->
                                        <block v-if="current_opt_type == 'login_sms'">
                                            <input type="number" :placeholder="$t('login.login.28k91h')" maxlength="11" name="accounts" @input="form_input_mobile_event" key="login_sms_1" class="form-item margin-vertical-xl wh-auto" />
                                            <view class="code pr margin-vertical-xl">
                                                <input type="number" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" key="login_sms_2" />
                                                <button :class="'verify-submit pa round br text-size-sm cr-grey-9 ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{ verify_submit_text }}</button>
                                            </view>
                                        </block>
                                        <!-- 邮箱 -->
                                        <block v-if="current_opt_type == 'login_email'">
                                            <input type="text" :placeholder="$t('login.login.db1rf4')" maxlength="60" name="accounts" @input="form_input_email_event" key="login_email_1" class="form-item margin-vertical-xl wh-auto" />
                                            <view class="code pr margin-vertical-xl">
                                                <input type="number" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" key="login_email_1" />
                                                <button :class="'verify-submit pa round br text-size-sm cr-grey-9 ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{ verify_submit_text }}</button>
                                            </view>
                                        </block>
                                        <!-- 协议 -->
                                        <view class="margin-top-xl cr-grey flex-row flex-wrap align-c">
                                            <view class="dis-inline-block va-m" @tap="agreement_change">
                                                <radio-group class="dis-inline-block va-m" style="transform: scale(0.6)">
                                                    <label>
                                                        <radio value="agreement" color="#20a53a" :checked="agreement_status" />
                                                    </label>
                                                </radio-group>
                                            </view>
                                            <view class="dis-inline-block va-m text-size-xs">
                                                <text>{{ $t('login.login.nddg2x') }}</text>
                                                <text class="cr-main" @tap="agreement_event" data-value="userregister">{{ $t('login.login.2v11we') }}</text>
                                                <text>{{ $t('login.login.l3r4vr') }}</text>
                                                <text class="cr-main" @tap="agreement_event" data-value="userprivacy">{{ $t('login.login.myno2x') }}</text>
                                            </view>
                                        </view>
                                        <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{ $t('login.login.i1deai') }}</button>
                                        <view class="margin-top-xxl oh flex-row jc-sb align-c">
                                            <!-- 注册 -->
                                            <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0">
                                                <text class="cr-grey-9" data-value="reg" @tap="opt_form_event">{{ $t('login.login.t75ee8') }}</text>
                                            </view>
                                            <text class="cr-grey-9" data-value="forget" @tap="opt_form_event">{{ $t('login.login.9d8gqi') }}</text>
                                        </view>
                                    </view>
                                </view>
                            </form>
                        </view>

                        <!-- 注册 -->
                        <view v-else-if="current_opt_form == 'reg'" class="form-content">
                            <form @submit="form_submit_reg">
                                <!-- form表单距离去除顶部沾满整个空间的高度 -->
                                <view class="flex-col jc-sb">
                                    <view>
                                        <!-- 注册方式选择 -->
                                        <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0" class="opt-type-list margin-vertical-xxxl">
                                            <text v-if="home_user_reg_type.indexOf('username') != -1" class="padding-vertical-sm" :class="current_opt_type === 'reg_username' ? 'cr-main nav-active-line' : ''" data-value="reg_username" @tap="opt_type_event">{{ $t('login.login.n2pv70') }}</text>
                                            <text v-if="home_user_reg_type.indexOf('sms') != -1" class="padding-vertical-sm" :class="current_opt_type === 'reg_sms' ? 'cr-main nav-active-line' : ''" data-value="reg_sms" @tap="opt_type_event">{{ $t('login.login.1p7843') }}</text>
                                            <text v-if="home_user_reg_type.indexOf('email') != -1" class="padding-vertical-sm" :class="current_opt_type === 'reg_email' ? 'cr-main nav-active-line' : ''" data-value="reg_email" @tap="opt_type_event">{{ $t('login.login.p54kf1') }}</text>
                                        </view>
                                        <view v-else class="tc cr-grey padding-vertical-main">{{ $t('login.login.t59dho') }}</view>
                                        <!-- 账号密码 -->
                                        <block v-if="current_opt_type == 'reg_username'">
                                            <input type="text" :placeholder="$t('login.login.6yfr9g')" maxlength="60" name="accounts" key="reg_username_1" class="form-item margin-vertical-xl wh-auto" />
                                            <input type="text" :placeholder="$t('login.login.08fchn')" minlength="6" maxlength="18" name="pwd" password="true" key="reg_username_2" class="form-item margin-vertical-xl wh-auto" />
                                            <view v-if="home_user_register_img_verify_state == 1" class="verify pr margin-vertical-xl">
                                                <input type="text" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" :value="form_input_image_verify_value" key="reg_username_3" @input="form_input_image_verify_event" />
                                                <image v-if="(verify_image_url || null) != null" :src="verify_image_url" class="verify-image pa" mode="aspectFit" data-type="user_reg" @tap="image_verify_event"></image>
                                            </view>
                                        </block>
                                        <!-- 手机 -->
                                        <block v-if="current_opt_type == 'reg_sms'">
                                            <input type="number" :placeholder="$t('login.login.28k91h')" maxlength="11" name="accounts" key="reg_sms_1" @input="form_input_mobile_event" class="form-item margin-vertical-xl wh-auto" />
                                            <view class="code pr margin-vertical-xl">
                                                <input type="number" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" key="reg_sms_2" />
                                                <button :class="'verify-submit pa round br text-size-sm cr-grey-9 ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{ verify_submit_text }}</button>
                                            </view>
                                            <input type="text" :placeholder="$t('login.login.08fchn')" minlength="6" maxlength="18" name="pwd" password="true" key="reg_sms_3" class="form-item margin-vertical-xl wh-auto" />
                                        </block>
                                        <!-- 邮箱 -->
                                        <block v-if="current_opt_type == 'reg_email'">
                                            <input type="text" :placeholder="$t('login.login.db1rf4')" maxlength="60" name="accounts" key="reg_email_1" @input="form_input_email_event" class="form-item margin-vertical-xl wh-auto" />
                                            <view class="code pr margin-vertical-xl">
                                                <input type="number" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" key="reg_email_2" />
                                                <button :class="'verify-submit pa round br text-size-sm cr-grey-9 ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{ verify_submit_text }}</button>
                                            </view>
                                            <input type="text" :placeholder="$t('login.login.08fchn')" minlength="6" maxlength="18" name="pwd" password="true" key="reg_email_3" class="form-item margin-vertical-xl wh-auto" />
                                        </block>
                                        <!-- 协议 -->
                                        <view class="margin-top-xxxl cr-grey">
                                            <view class="dis-inline-block va-m" @tap="agreement_change">
                                                <radio-group class="dis-inline-block va-m" style="transform: scale(0.6)">
                                                    <label>
                                                        <radio value="agreement" color="#20a53a" :checked="agreement_status" />
                                                    </label>
                                                </radio-group>
                                            </view>
                                            <view class="dis-inline-block va-m text-size-xs">
                                                <text>{{ $t('login.login.nddg2x') }}</text>
                                                <text class="cr-main" @tap="agreement_event" data-value="userregister">{{ $t('login.login.2v11we') }}</text>
                                                <text>{{ $t('login.login.l3r4vr') }}</text>
                                                <text class="cr-main" @tap="agreement_event" data-value="userprivacy">{{ $t('login.login.myno2x') }}</text>
                                            </view>
                                        </view>
                                        <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{ $t('login.login.hvunf8') }}</button>
                                        <view class="margin-top-xxl oh flex-row jc-sb align-c">
                                            <!-- 登录 -->
                                            <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="tc">
                                                <text class="cr-grey-9" data-value="login" @tap="opt_form_event">{{ $t('login.login.zy8tc4') }}</text>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </form>
                        </view>

                        <!-- 找回密码 -->
                        <view v-else-if="current_opt_form == 'forget'" class="form-content">
                            <form @submit="form_submit_forget">
                                <!-- form表单距离去除顶部沾满整个空间的高度 -->
                                <view class="flex-col jc-sb">
                                    <view class="margin-bottom-xxxl">
                                        <input type="text" :placeholder="$t('login.login.d178m0')" maxlength="60" name="accounts" @input="form_input_accounts_event" class="form-item margin-vertical-xl wh-auto" />
                                        <view class="code pr margin-vertical-xl">
                                            <input type="number" autocomplete="off" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" />
                                            <button :class="'verify-submit pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send_event">{{ verify_submit_text }}</button>
                                        </view>
                                        <input type="text" autocomplete="off" :placeholder="$t('login.login.9wx3ch')" minlength="6" maxlength="18" name="pwd" password="true" class="form-item margin-vertical-xl wh-auto" />
                                        <button class="bg-main br-main cr-white round text-size margin-top-xxxl" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{ $t('common.confirm_sub') }}</button>
                                        <view class="margin-top-xxl oh flex-row jc-sb align-c">
                                            <!-- 登录 -->
                                            <view v-if="(home_user_login_type || null) != null && home_user_login_type.length > 0" class="tc">
                                                <text class="cr-grey-9" data-value="login" @tap="opt_form_event">{{ $t('login.login.zy8tc4') }}</text>
                                            </view>
                                            <!-- 注册 -->
                                            <view v-if="(home_user_reg_type || null) != null && home_user_reg_type.length > 0" class="tc">
                                                <text class="cr-grey-9" data-value="reg" @tap="opt_form_event">{{ $t('login.login.b347k4') }}</text>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </form>
                        </view>

                        <!-- #ifdef MP -->
                        <!-- 小程序授权 -->
                        <view v-if="current_opt_form == 'auth' && (user || null) == null" class="margin-top-xxxl tc">
                            <view class="cr-base">{{ $t('login.login.836o8e') }}</view>
                            <view class="margin-top-sm cr-grey">
                                <view class="dis-inline-block va-m" @tap="agreement_change">
                                    <radio-group style="transform: scale(0.6)">
                                        <label>
                                            <radio value="agreement" color="#20a53a" :checked="agreement_status" />
                                        </label>
                                    </radio-group>
                                </view>
                                <view class="dis-inline-block va-m text-size-xs">
                                    <text>{{ $t('login.login.nddg2x') }}</text>
                                    <text class="cr-main" @tap="agreement_event" data-value="userregister">{{ $t('login.login.2v11we') }}</text>
                                    <text>{{ $t('login.login.l3r4vr') }}</text>
                                    <text class="cr-main" @tap="agreement_event" data-value="userprivacy">{{ $t('login.login.myno2x') }}</text>
                                </view>
                            </view>
                            <view class="margin-top-xxl">
                                <navigator open-type="navigateBack" hover-class="none" class="dis-inline-block margin-right-lg">
                                    <button class="bg-yellow br-yellow cr-white round" type="default" size="mini" hover-class="none">{{ $t('common.cancel') }}</button>
                                </navigator>
                                <!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
                                <button class="margin-left-lg bg-green br-green cr-white round" type="default" size="mini" @tap="get_user_info_event">{{ $t('buy.buy.33fugm') }}{{client_text}}{{ $t('login.login.tvl242') }}</button>
                                <!-- #endif -->
                                <!-- #ifdef MP-QQ || MP-BAIDU || MP-KUAISHOU -->
                                <button class="margin-left-lg bg-green br-green cr-white round" type="default" size="mini" open-type="getUserInfo" @getuserinfo="get_user_info_event">{{ $t('buy.buy.33fugm') }}{{client_text}}{{ $t('login.login.tvl242') }}</button>
                                <!-- #endif -->
                                <!-- #ifdef MP-ALIPAY -->
                                <button class="margin-left-lg bg-green br-green cr-white round" type="default" size="mini" open-type="getAuthorize" @getAuthorize="get_user_info_event" scope="userInfo">{{ $t('buy.buy.33fugm') }}{{client_text}}{{ $t('login.login.tvl242') }}</button>
                                <!-- #endif -->
                            </view>
                        </view>
                        <!-- #endif -->
                    </view>

                    <!-- 第三方登录 -->
                    <view v-if="current_opt_form == 'login' || current_opt_form == 'reg'" class="padding-main margin-bottom-xxxl">
                        <view class="bottom-line-exclude">
                            <!-- #ifdef H5 || APP -->
                            <view v-if="(plugins_thirdpartylogin_data || null) != null && (plugins_thirdpartylogin_config || null) != null" class="plugins-thirdpartylogin tc">
                                <view class="text-size-xs cr-grey-c margin-bottom-main">{{ $t('login.login.9q27d8') }}</view>
                                <view class="flex-row align-c jc-c">
                                    <view v-for="(item, key, index) in plugins_thirdpartylogin_data" :key="index">
                                        <block v-if="index < 3">
                                            <view class="item round flex-row align-c jc-c margin-horizontal-sm" :style="'background-color:' + item.bg_color + ';'" :data-type="key" @tap="plugins_thirdpartylogin_event">
                                                <image :src="item.icon" mode="aspectFit" class="dis-block auto"></image>
                                            </view>
                                        </block>
                                    </view>
                                    <view v-if="Object.keys(plugins_thirdpartylogin_data).length > 3" class="item dis-inline-block round more-submit margin-horizontal-sm" @tap="popup_login_open_event">
                                        <image :src="login_static_url + 'more.png'" mode="aspectFit" class="dis-block auto"></image>
                                    </view>
                                </view>
                            </view>
                            <!-- #endif -->
                        </view>
                    </view>
                </view>

                <!-- 图片验证码弹层 -->
                <component-popup :propShow="popup_image_verify_status" propPosition="bottom" @onclose="popup_image_verify_close_event">
                    <view class="bg-white padding-horizontal-main padding-top-main">
                        <view class="fr oh">
                            <view class="fr" @tap.stop="popup_image_verify_close_event">
                                <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                            </view>
                        </view>
                        <view class="form-content margin-top-xxxl padding-top-xxl">
                            <view class="verify pr margin-vertical-main">
                                <input type="text" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" :value="form_input_image_verify_value" @input="form_input_image_verify_event" />
                                <image v-if="(verify_image_url || null) != null" :src="verify_image_url" class="verify-image pa" mode="aspectFit" :data-type="'user_' + current_opt_form" @tap="image_verify_event"></image>
                            </view>
                            <view class="margin-top-xxxl margin-bottom-xxxl">
                                <button class="bg-main br-main cr-white round text-size" type="default" @tap="popup_image_verify_submit_event" hover-class="none" :disabled="verify_disabled">{{ $t('common.confirm') }}</button>
                            </view>
                        </view>
                    </view>
                </component-popup>

                <!-- 打开语言选择弹层-->
                <component-lang-switch ref="lang_switch" @popup_sub_language_event="popup_sub_language_event"></component-lang-switch>
                <!-- 选择登录方式 -->
                <component-popup :propShow="popup_login_status" propMostClass="z-i-deep pr" propPosition="bottom" :propIsRadius="false" propStyle="background-color:transparent;" @onclose="popup_login_close_event">
                    <view class="popup-login padding-sm">
                        <view class="bg-white border-radius-main content">
                            <view v-for="(item, key, index) in plugins_thirdpartylogin_data" :key="index">
                                <block v-if="index > 2">
                                    <view class="item padding-lg flex-col jc-c align-c" :data-type="key" @tap="plugins_thirdpartylogin_event">
                                        <view class="flex-row align-c login-width text-size-lg"> <image :src="item.icon" mode="aspectFit" class="margin-right-main"></image>{{ item.name }} </view>
                                    </view>
                                </block>
                            </view>
                        </view>
                        <view class="margin-top-main tc footer">
                            <view class="padding-main text-size-lg fw-b bg-white cancel-btn" @tap="popup_login_close_event">{{ $t('common.cancel') }}</view>
                        </view>
                    </view>
                </component-popup>
            </block>
            <view v-else class="padding-top-xxxl tc">
                <view class="cr-red margin-top-xxxl">{{ $t('login.login.pgyv78') }}</view>
                <view class="cr-grey-c text-size-xs margin-top-xxl">{{ $t('login.login.d76tgh') }}</view>
                <view class="margin-top-xl">
                    <button type="default" size="mini" class="br-main cr-white bg-main dis-inline-block padding-left-xxxl padding-right-xxxl padding-top-sm padding-bottom-sm round" @tap="cache_refresh_event">{{ $t('login.login.6fe6ra') }}</button>
                </view>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
    import componentLangSwitch from '@/components/lang-switch/lang-switch';
    let login_static_url = app.globalData.get_static_url('thirdpartylogin', true) + 'icon/';

    export default {
        data() {
            return {
                // 实际提交的语言字段
                language: '',
                home_use_multilingual_status: 0,
                theme_view: app.globalData.get_theme_value_view(),
                login_static_url: login_static_url,
                params: null,
                user: null,
                prev_page: null,
                form_input_mobile_value: '',
                form_input_email_value: '',
                form_input_accounts_value: '',
                form_input_image_verify_value: '',
                verify_submit_text: '',
                verify_loading: false,
                verify_disabled: false,
                form_submit_loading: false,
                verify_time_total: 60,
                temp_clear_time: null,
                agreement_status: false,
                verify_image_url: null,
                popup_image_verify_status: false,
                navigation_bar_title_key: '',
                // 基础配置
                is_refreshed_base_data: 0,
                is_exist_base_data: 0,
                common_user_verify_bind_mobile_list: [],
                common_user_onekey_bind_mobile_list: [],
                home_site_logo_square: null,
                home_user_login_type: [],
                home_user_reg_type: [],
                home_user_login_img_verify_state: 0,
                home_user_register_img_verify_state: 0,
                common_img_verify_state: 0,
                client_value: app.globalData.application_client_type(),
                // 0 确认绑定方式, 1 验证码绑定
                current_login_bind_type: 0,
                // 当前操作方式
                current_opt_form: 'auth',
                current_opt_type: 'auth',
                current_opt_type_title: {},
                // 第三方登录
                plugins_thirdpartylogin_data: null,
                plugins_thirdpartylogin_user: null,
                plugins_thirdpartylogin_is_call_app: 0,
                // app第三方登录通道
                app_login_provider_list: [],
                // 错误提示信息
                error_msg: null,
                // 登录方式弹窗状态
                popup_login_status: false,
                // 客户端名称
                client_text: '',
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentLangSwitch
        },

        // 页面加载初始化
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 资源设置
            this.set_resources_data();

            // #ifdef APP
            // 获取app第三方登录通道设置
            this.provider_action();
            //#endif

            // 多语言
            var language_key = app.globalData.get_language_value();
            var language_list = this.$t('language');
            this.setData({
                params: params,
                language: language_list[language_key],
            });

            // 上一个页面记录
            var page = app.globalData.prev_page();
            if (page != null && page != 'pages/login/login') {
                uni.setStorageSync(app.globalData.data.cache_prev_page_key, page);
            }

            // 错误提示信息
            if ((params.msg || null) != null) {
                var msg = base64.decode(decodeURIComponent(params.msg));
                this.setData({
                    error_msg: msg,
                });
            }

            // 第三方登录成功处理
            if ((params.thirdpartylogin || null) != null) {
                var user = JSON.parse(base64.decode(decodeURIComponent(params.thirdpartylogin)));
                this.setData({
                    plugins_thirdpartylogin_user: user,
                });
                // 是否需要绑定账号
                if ((user.is_force_bind_user || 0) != 1) {
                    uni.setStorageSync(app.globalData.data.cache_user_info_key, user);
                }
            }
        },

        // 页面显示
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 异步初始化配置
            this.init_config();

            // 数据初始化
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 资源设置
            set_resources_data() {
                this.setData({
                    current_opt_type_title: {
                        auth: this.$t('login.login.jw378f'),
                        bind: this.$t('login.login.np9177'),
                        bind_email: this.$t('login.login.tgsa4d'),
                        login_username: this.$t('login.login.725312'),
                        login_sms: this.$t('login.login.158yg2'),
                        login_email: this.$t('login.login.r329eu'),
                        reg_username: this.$t('login.login.39hn6v'),
                        reg_sms: this.$t('login.login.z13km0'),
                        reg_email: this.$t('login.login.jc0w0o'),
                        forget: this.$t('login.login.8tmyuc'),
                        success: this.$t('login.login.5p23c6'),
                        bind_platform: this.$t('login.login.876tdf'),
                    },
                    verify_submit_text: this.$t('login.login.s665h5'),
                    client_text: this.$t('client.'+this.client_value),
                });
            },

            // 数据初始化
            init() {
                // 缓存初始化配置
                this.init_config(true);

                // 用户信息
                var user = app.globalData.get_user_cache_info() || null;

                // 数据处理
                var type = user == null ? 'auth' : 'bind';
                var form = type;
                var is_base = app.globalData.data.common_data_init_status || 0;
                // #ifdef H5 || APP
                if (user == null) {
                    // 非小程序：如果开启登录则取第一个登录方式
                    if ((this.home_user_login_type || null) != null && this.home_user_login_type.length > 0) {
                        form = 'login';
                        // 开启登录则取第一个
                        type = 'login_' + this.home_user_login_type[0];

                        // 用户登录和验证码获取开启图片验证码
                        if (this.home_user_login_img_verify_state == 1 || this.common_img_verify_state == 1) {
                            this.image_verify_event('user_login');
                        }
                    } else {
                        is_base = 0;
                    }
                } else {
                    // 是否需要绑定手机
                    if (type == 'bind' && app.globalData.user_is_bind_mobile(user)) {
                        type = 'bind';
                        // 是否打开了一键获取手机、则直接展示验证码输入表单
                        if(this.common_user_onekey_bind_mobile_list.length > 0 && this.common_user_onekey_bind_mobile_list.indexOf(this.client_value) != -1) {
                            form = 'bind';
                        } else {
                            form = 'bind_verify';
                        }
                    } else {
                        form = 'success';
                    }
                }
                // #endif

                // 是否参数指定类型和表单
                if ((this.params.opt_type || null) != null) {
                    type = this.params.opt_type;
                }
                if ((this.params.opt_form || null) != null) {
                    form = this.params.opt_form;
                }

                // 没有基础数据则刷新
                if (is_base == 0 && this.is_refreshed_base_data == 0) {
                    this.cache_refresh_event();
                }

                this.setData({
                    user: user,
                    current_opt_type: type,
                    current_opt_form: form,
                    is_exist_base_data: is_base,
                    is_refreshed_base_data: 1,
                    navigation_bar_title_key: type
                });
                this.set_navigation_bar_title();

                // 调用登录处理
                if(parseInt(this.plugins_thirdpartylogin_is_call_app || 0) == 0 && type == 'bind_platform' && form == 'bind_platform' && (this.params.platform_type || null) != null) {
                    this.setData({
                        plugins_thirdpartylogin_is_call_app: 1
                    })
                    this.plugins_thirdpartylogin_handle(this.params.platform_type);
                    return false;
                }

                // 登录成功
                if (this.current_opt_form == 'success') {
                    var page = uni.getStorageSync(app.globalData.data.cache_prev_page_key) || null;
                    if (page != null) {
                        this.setData({ prev_page: page });
                        setTimeout(function () {
                            app.globalData.url_open('/' + page, true);
                        }, 2000);
                    }
                }
            },

            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        home_site_logo_square: app.globalData.get_config('config.home_site_logo_square'),
                        common_user_verify_bind_mobile_list: app.globalData.get_config('config.common_user_verify_bind_mobile_list', []),
                        common_user_onekey_bind_mobile_list: app.globalData.get_config('config.common_user_onekey_bind_mobile_list', []),
                        home_user_login_type: app.globalData.get_config('config.home_user_login_type'),
                        home_user_reg_type: app.globalData.get_config('config.home_user_reg_type'),
                        home_user_login_img_verify_state: app.globalData.get_config('config.home_user_login_img_verify_state'),
                        home_user_register_img_verify_state: app.globalData.get_config('config.home_user_register_img_verify_state'),
                        common_img_verify_state: app.globalData.get_config('config.common_img_verify_state'),
                        home_use_multilingual_status: app.globalData.get_config('config.home_use_multilingual_status'),
                        plugins_thirdpartylogin_config: app.globalData.get_config('plugins_base.thirdpartylogin.data'),
                        plugins_thirdpartylogin_data: app.globalData.get_config('plugins_thirdpartylogin_data'),
                    });

                    // #ifdef APP
                    // app第三方登录通道隔离
                    var thirdpartylogin = this.plugins_thirdpartylogin_data || {};
                    if (Object.keys(thirdpartylogin).length) {
                        var temp_thirdpartylogin = Object.keys(thirdpartylogin).reduce((pre, cur) => {
                            if (this.app_login_provider_list.includes(cur)) {
                                pre[cur] = thirdpartylogin[cur];
                            }
                            return pre;
                        }, {});
                        this.setData({
                            plugins_thirdpartylogin_data: temp_thirdpartylogin,
                        });
                    }
                    // #endif
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 登录授权事件
            get_user_info_event(e) {
                // 是否已同意协议
                if (!this.agreement_status) {
                    app.globalData.showToast(this.$t('login.login.btu2c1'));
                    return false;
                }

                // #ifdef MP-WEIXIN
                uni.getUserProfile({
                    desc: this.$t('login.login.no8ts6'),
                    lang: 'zh_CN',
                    success: (res) => {
                        this.user_auth_code(res.userInfo);
                    },
                    fail: (res) => {
                        app.globalData.user_login_handle(this, 'user_auth_back_event');
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
                    },
                });
                // #endif
                // #ifdef MP-ALIPAY
                uni.getOpenUserInfo({
                    success: (res) => {
                        var userinfo = JSON.parse(res.response).response;
                        this.user_auth_code(userinfo);
                    },
                });
                // #endif
                // #ifdef MP-BAIDU
                var userinfo = e.detail.userInfo;
                userinfo['encrypted_data'] = e.detail.encryptedData;
                userinfo['iv'] = e.detail.iv;
                this.user_auth_code(userinfo);
                // #endif
                // #ifdef MP-TOUTIAO
                uni.getUserProfile({
                    force: true,
                    success: (res) => {
                        // 由于头条getUserProfile内置了login
                        // 会刷新前面的login会导致后面获取手机号码数据解析失败
                        // 这里重新获取sessionKey登录
                        app.globalData.user_login_handle(null, null, false);
                        // 用户授权登录
                        this.user_auth_code(res.userInfo);
                    },
                });
                // #endif
                // #ifdef MP-KUAISHOU
                var userinfo = e.target.userInfo;
                this.user_auth_code(e.target.userInfo);
                // #endif
            },

            // 用户授权登录
            // auth_data  授权数据
            user_auth_code(auth_data) {
                if ((auth_data || null) != null) {
                    app.globalData.user_auth_login(this, 'user_auth_back_event', null, auth_data);
                } else {
                    app.globalData.showToast(this.$t('login.login.3nmrg2'));
                }
            },

            // 授权返回事件
            user_auth_back_event() {
                var user = app.globalData.get_user_cache_info() || null;
                this.setData({
                    user: user,
                });

                // 是否需要绑定手机号码
                if (!app.globalData.user_is_bind_mobile(user)) {
                    uni.navigateBack();
                }

                // 初始化
                this.init();
            },

            // 输入手机号码事件
            form_input_mobile_event(e) {
                this.setData({
                    form_input_mobile_value: e.detail.value,
                });
            },

            // 输入邮箱事件
            form_input_email_event(e) {
                this.setData({
                    form_input_email_value: e.detail.value,
                });
            },

            // 输入手机和邮箱事件
            form_input_accounts_event(e) {
                this.setData({
                    form_input_accounts_value: e.detail.value,
                });
            },

            // 输入图片验证码事件
            form_input_image_verify_event(e) {
                this.setData({
                    form_input_image_verify_value: e.detail.value,
                });
            },

            // 弹层图片验证码关闭
            popup_image_verify_close_event(e) {
                this.setData({
                    popup_image_verify_status: false,
                });
            },

            // 弹层图片验证码确认
            popup_image_verify_submit_event(e) {
                this.verify_send_handle();
            },

            // 短信验证码发送事件
            verify_send_event() {
                // 手机号码验证：手机登录、手机注册、手机绑定
                if (this.current_opt_type == 'login_sms' || this.current_opt_type == 'reg_sms' || this.current_opt_type == 'bind') {
                    if ((this.form_input_mobile_value || null) == null) {
                        app.globalData.showToast(this.$t('login.login.4c5n8o'));
                        return false;
                    }
                }
                // 邮箱验证：邮箱登录、邮箱注册
                if (this.current_opt_type == 'login_email' || this.current_opt_type == 'reg_email' || this.current_opt_type == 'bind_email') {
                    if ((this.form_input_email_value || null) == null) {
                        app.globalData.showToast(this.$t('login.login.xak8g1'));
                        return false;
                    }
                }
                // 密码找回：邮箱或手机
                if (this.current_opt_type == 'forget' && (this.form_input_accounts_value || null) == null) {
                    app.globalData.showToast(this.$t('login.login.ku05ty'));
                    return false;
                }
                // 是否开启图片验证码、绑定操作不使用图片验证码
                if (this.current_opt_form != 'bind' && this.current_opt_form != 'bind_verify' && this.current_opt_form != 'bind_email') {
                    if (this.common_img_verify_state == 1) {
                        this.setData({
                            popup_image_verify_status: true,
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
                if (this.current_opt_form != 'bind' && this.current_opt_form != 'bind_verify' && this.current_opt_form != 'bind_email') {
                    if (this.common_img_verify_state == 1) {
                        if ((this.form_input_image_verify_value || null) == null || this.form_input_image_verify_value.length < 4) {
                            app.globalData.showToast(this.$t('login.login.7r5h37'));
                            return false;
                        }
                    }
                }

                // 请求数据
                var action = '';
                var image_verify_type = '';
                if (this.current_opt_form == 'bind' || this.current_opt_form == 'bind_email' || this.current_opt_form == 'bind_verify') {
                    image_verify_type = 'user_bind';
                    if (this.current_opt_form == 'bind_email') {
                        action = 'appemailbindverifysend';
                        var post_data = {
                            email: this.form_input_email_value || '',
                        };
                        if ((post_data.email || null) == null) {
                            app.globalData.showToast(this.$t('login.login.xak8g1'));
                            return false;
                        }
                    } else if (this.current_opt_form == 'bind_verify') {
                        action = 'appmobilebindverifysend';
                        var post_data = {
                            mobile: this.form_input_mobile_value || '',
                        };
                        if ((post_data.mobile || null) == null) {
                            app.globalData.showToast(this.$t('login.login.4c5n8o'));
                            return false;
                        }
                    }
                } else {
                    if (this.current_opt_form == 'login') {
                        action = 'loginverifysend';
                        image_verify_type = 'user_login';
                    } else if (this.current_opt_form == 'reg') {
                        action = 'regverifysend';
                        image_verify_type = 'user_reg';
                    } else if (this.current_opt_form == 'forget') {
                        action = 'forgetpwdverifysend';
                        image_verify_type = 'user_forget';
                    }
                    var accounts = (this.current_opt_type == 'bind_verify' || this.current_opt_type == 'login_sms' || this.current_opt_type == 'reg_sms' ? this.form_input_mobile_value : this.current_opt_type == 'forget' ? this.form_input_accounts_value : this.form_input_email_value) || null;
                    if (accounts == null) {
                        app.globalData.showToast(this.$t('login.login.24mvbh'));
                        return false;
                    }
                    var post_data = {
                        accounts: accounts,
                        verify: this.form_input_image_verify_value,
                        type: this.current_opt_type.replace('login_', '').replace('reg_', ''),
                    };
                }

                // 网络请求
                var self = this;
                uni.showLoading({
                    title: this.$t('common.sending_in_text'),
                });
                this.setData({
                    verify_submit_text: this.$t('common.sending'),
                    verify_loading: true,
                    verify_disabled: true,
                });
                uni.request({
                    url: app.globalData.get_request_url(action, 'user'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            // 是否开启图片验证码
                            if (this.common_img_verify_state == 1) {
                                this.setData({
                                    popup_image_verify_status: false,
                                });
                            }

                            // 倒计时处理
                            this.setData({
                                verify_loading: false,
                            });
                            var temp_time = this.verify_time_total;
                            this.temp_clear_time = setInterval(function () {
                                if (temp_time <= 1) {
                                    clearInterval(self.temp_clear_time);
                                    self.setData({
                                        verify_submit_text: self.$t('login.login.s665h5'),
                                        verify_disabled: false,
                                    });
                                } else {
                                    temp_time--;
                                    self.setData({
                                        verify_submit_text: self.$t('login.login.n24i5u') + temp_time + self.$t('login.login.4306xr'),
                                    });
                                }
                            }, 1000);
                        } else {
                            this.setData({
                                verify_submit_text: this.$t('login.login.s665h5'),
                                verify_loading: false,
                                verify_disabled: false,
                                form_input_image_verify_value: '',
                            });
                            this.image_verify_event(image_verify_type);
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            verify_submit_text: this.$t('login.login.s665h5'),
                            verify_loading: false,
                            verify_disabled: false,
                            form_input_image_verify_value: '',
                        });
                        this.image_verify_event(image_verify_type);
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            form_submit_bind_mobile(e) {
                // 数据验证
                var validation = [
                    { fields: 'mobile', msg: this.$t('login.login.4c5n8o') },
                    { fields: 'verify', msg: this.$t('login.login.01xmab') },
                ];
                this.formBind(e, validation, app.globalData.get_request_url('appmobilebind', 'user'));
            },
            // 绑定手机表单提交
            form_submit_bind_email(e) {
                // 数据验证
                var validation = [
                    { fields: 'email', msg: this.$t('login.login.xak8g1') },
                    { fields: 'verify', msg: this.$t('login.login.01xmab') },
                ];
                this.formBind(e, validation, app.globalData.get_request_url('appemailbind', 'user'));
            },
            // 绑定表单提交
            formBind(e, validation, url) {
                // 其他数据
                var client_type = app.globalData.application_client_type();
                var user = this.user || this.plugins_thirdpartylogin_user || app.globalData.get_login_cache_info() || {};
                e.detail.value['nickname'] = user.nickname;
                e.detail.value['avatar'] = user.avatar;
                e.detail.value['province'] = user.province;
                e.detail.value['city'] = user.city;
                e.detail.value['gender'] = user.gender;

                // 小程序数据
                // #ifdef MP
                var field_openid = client_type + '_openid';
                var field_unionid = client_type + '_unionid';
                e.detail.value[field_openid] = user[field_openid] || '';
                e.detail.value[field_unionid] = user[field_unionid] || '';
                // #endif
                // #ifdef MP
                validation.push({ fields: field_openid, msg: this.$t('login.login.prqvf1') });
                // #endif
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });

                    // 网络请求
                    uni.request({
                        url: url,
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: (res) => {
                            this.user_success_handle(res);
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 获取手机号码一键登录
            confirm_phone_number_event(e) {
                var encrypted_data = e.detail.encryptedData || null;
                var iv = e.detail.iv || null;
                var code = e.detail.code || null;
                if ((encrypted_data != null && iv != null) || code != null) {
                    // 解密数据并绑定手机
                    var client_type = app.globalData.application_client_type();
                    var user = this.user || this.plugins_thirdpartylogin_user || app.globalData.get_login_cache_info() || {};
                    var field_openid = client_type + '_openid';
                    var field_unionid = client_type + '_unionid';
                    var data = {
                        encrypted_data: encrypted_data,
                        iv: iv,
                        code: code,
                        openid: user[field_openid] || '',
                        nickname: user.nickname || '',
                        avatar: user.avatar || '',
                        province: user.province || '',
                        city: user.city || '',
                        gender: user.gender || 0,
                    };
                    data[field_unionid] = user[field_unionid] || '';
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('onekeyusermobilebind', 'user'),
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        success: (res) => {
                            this.user_success_handle(res);
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                } else {
                    var msg = e.errmsg || e.errMsg || e.detail.errmsg || e.detail.errMsg || null;
                    if (msg != null) {
                        app.globalData.showToast(msg);
                    }
                }
            },

            // 登录表单提交
            form_submit_login(e) {
                // 是否已同意协议
                if (!this.agreement_status) {
                    app.globalData.showToast(this.$t('login.login.btu2c1'));
                    return false;
                }
                // 数据验证
                var validation = [];
                if (this.current_opt_type == 'login_sms') {
                    validation.push({ fields: 'accounts', msg: this.$t('login.login.yvj88j') });
                }
                if (this.current_opt_type == 'login_email') {
                    validation.push({ fields: 'accounts', msg: this.$t('login.login.yo6x3p') });
                }
                if (this.current_opt_type == 'login_username') {
                    validation.push({ fields: 'accounts', msg: this.$t('login.login.n7vh75') });
                    validation.push({ fields: 'pwd', msg: this.$t('login.login.277w03') });
                }
                if (this.current_opt_type == 'login_sms' || this.current_opt_type == 'login_email' || (this.current_opt_type == 'login_username' && this.home_user_login_img_verify_state == 1)) {
                    validation.push({ fields: 'verify', msg: this.$t('login.login.cesl5d') });
                }
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    // 登录方式
                    e.detail.value['type'] = this.current_opt_type.replace('login_', '');

                    // 其他数据
                    var client_type = app.globalData.application_client_type();
                    var user = this.user || this.plugins_thirdpartylogin_user || app.globalData.get_login_cache_info() || {};
                    e.detail.value['nickname'] = user.nickname;
                    e.detail.value['avatar'] = user.avatar;
                    e.detail.value['province'] = user.province;
                    e.detail.value['city'] = user.city;
                    e.detail.value['gender'] = user.gender;
                    // #ifdef MP
                    // 小程序数据
                    var field_openid = client_type + '_openid';
                    var field_unionid = client_type + '_unionid';
                    e.detail.value[field_openid] = user[field_openid] || '';
                    e.detail.value[field_unionid] = user[field_unionid] || '';
                    // #endif

                    // 网络请求
                    uni.showLoading({
                        title: this.$t('login.login.c5wa4u'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    uni.request({
                        url: app.globalData.get_request_url('login', 'user'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: (res) => {
                            this.user_success_handle(res);
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 注册表单提交
            form_submit_reg(e) {
                // 是否已同意协议
                if (!this.agreement_status) {
                    app.globalData.showToast(this.$t('login.login.btu2c1'));
                    return false;
                }
                // 数据验证
                var validation = [];
                if (this.current_opt_type == 'reg_sms') {
                    validation.push({ fields: 'accounts', msg: this.$t('login.login.yvj88j') });
                }
                if (this.current_opt_type == 'reg_email') {
                    validation.push({ fields: 'accounts', msg: this.$t('login.login.yo6x3p') });
                }
                if (this.current_opt_type == 'reg_username') {
                    validation.push({ fields: 'accounts', msg: this.$t('login.login.n7vh75') });
                    validation.push({ fields: 'pwd', msg: this.$t('login.login.277w03') });
                }
                if (this.current_opt_type == 'reg_sms' || this.current_opt_type == 'reg_email' || (this.current_opt_type == 'reg_username' && this.home_user_register_img_verify_state == 1)) {
                    validation.push({ fields: 'verify', msg: this.$t('login.login.cesl5d') });
                }
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    // 注册方式
                    e.detail.value['type'] = this.current_opt_type.replace('reg_', '');

                    // 其他数据
                    var client_type = app.globalData.application_client_type();
                    var user = this.user || this.plugins_thirdpartylogin_user || app.globalData.get_login_cache_info() || {};
                    e.detail.value['nickname'] = user.nickname;
                    e.detail.value['avatar'] = user.avatar;
                    e.detail.value['province'] = user.province;
                    e.detail.value['city'] = user.city;
                    e.detail.value['gender'] = user.gender;

                    // #ifdef MP
                    // 小程序数据
                    var field_openid = client_type + '_openid';
                    var field_unionid = client_type + '_unionid';
                    e.detail.value[field_openid] = user[field_openid] || '';
                    e.detail.value[field_unionid] = user[field_unionid] || '';
                    // #endif

                    // 网络请求
                    uni.showLoading({
                        title: this.$t('login.login.g30ew7'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    uni.request({
                        url: app.globalData.get_request_url('reg', 'user'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: (res) => {
                            this.user_success_handle(res);
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 密码找回表单提交
            form_submit_forget(e) {
                // 数据验证
                var validation = [
                    { fields: 'accounts', msg: this.$t('login.login.h0515x') },
                    { fields: 'verify', msg: this.$t('login.login.cesl5d') },
                    { fields: 'pwd', msg: this.$t('login.login.wysg7k') },
                ];
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    // 网络请求
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    uni.request({
                        url: app.globalData.get_request_url('forgetpwd', 'user'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                var self = this;
                                setTimeout(function () {
                                    var opt_type = (self.home_user_login_type || null) != null && self.home_user_login_type.length > 0 ? 'login_' + self.home_user_login_type[0] : null;
                                    self.setData({
                                        form_submit_loading: false,
                                        current_opt_form: 'login',
                                        current_opt_type: opt_type,
                                    });
                                    if (opt_type != null) {
                                        // 是否开启图片验证码
                                        if (self.home_user_login_img_verify_state == 1 || self.common_img_verify_state == 1) {
                                            self.image_verify_event('user_login');
                                        }
                                    }
                                }, 3000);
                            } else {
                                this.setData({
                                    form_submit_loading: false,
                                });
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
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
                    if ((this.plugins_thirdpartylogin_user || null) != null && (this.plugins_thirdpartylogin_user.is_force_bind_user || 0) == 1) {
                        uni.request({
                            url: app.globalData.get_request_url('bind', 'index', 'thirdpartylogin'),
                            method: 'POST',
                            data: this.plugins_thirdpartylogin_user,
                            dataType: 'json',
                            success: (res) => {
                                if (res.data.code == 0) {
                                    uni.hideLoading();
                                    uni.setStorageSync(app.globalData.data.cache_user_info_key, res.data.data);
                                    this.success_back_handle(res);
                                } else {
                                    uni.hideLoading();
                                    this.setData({
                                        form_submit_loading: false,
                                    });
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                this.setData({
                                    form_submit_loading: false,
                                });
                                app.globalData.showToast(this.$t('common.internet_error_tips'));
                            },
                        });
                    } else {
                        uni.hideLoading();
                        this.success_back_handle(res);
                    }
                } else {
                    uni.hideLoading();
                    this.setData({
                        form_submit_loading: false,
                    });
                    app.globalData.showToast(res.data.msg);
                }
            },

            // 成功后处理
            success_back_handle(res) {
                var self = this;
                var msg = (this.plugins_thirdpartylogin_is_call_app == 1) ? this.$t('login.login.87yui2') : res.data.msg;
                app.globalData.showToast(msg, 'success');
                var event_callback = this.params.event_callback || null;
                setTimeout(function () {
                    var pages = getCurrentPages();
                    if (pages.length > 1) {
                        // 触发回调函数
                        if (event_callback != null) {
                            if ((pages[pages.length - 2][event_callback] || null) != null) {
                                pages[pages.length - 2][event_callback]();
                            }
                        }
                        // 默认返回上一页
                        uni.navigateBack();
                    } else {
                        // 仅一个页面则执行成功返回
                        self.success_event();
                    }
                }, 1000);
            },

            // 协议事件
            agreement_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value == null) {
                    app.globalData.showToast(this.$t('login.login.4wc3hr'));
                    return false;
                }

                // 是否存在协议 url 地址
                var key = 'agreement_' + value + '_url';
                var url = app.globalData.get_config('config.' + key) || null;
                if (url == null) {
                    app.globalData.showToast(this.$t('login.login.x0nxxf'));
                    return false;
                }

                // 打开 webview
                app.globalData.open_web_view(url);
            },

            // 协议改变
            agreement_change(e) {
                this.setData({
                    agreement_status: !this.agreement_status,
                });
            },

            // 表单类型事件
            opt_form_event(e) {
                var value = e.currentTarget.dataset.value;
                // 手机或邮箱更换绑定来源则直接返回
                var is_verify = (this.params.opt_form || null) != null && (this.params.opt_form == 'bind_verify' || this.params.opt_form == 'bind_email');
                var is_no_bind_mobile = this.common_user_onekey_bind_mobile_list.length == 0 || this.common_user_onekey_bind_mobile_list.indexOf(this.client_value) == -1;
                if (value == 'bind' && (is_verify || is_no_bind_mobile)) {
                    uni.navigateBack();
                }

                // 设置数据
                var data = {
                    current_opt_form: value,
                };

                // 小程序使用授权自动登录
                // 切换手机绑定方式
                if (value == 'auth' || value == 'bind') {
                    data['current_opt_type'] = value;
                }

                // 密码找回同时设置表单类型
                if (value == 'forget') {
                    data['current_opt_type'] = 'forget';
                    if (this.common_img_verify_state == 1) {
                        this.image_verify_event('user_forget');
                    }
                }

                // 开启登录则取第一个
                if (value == 'login' && this.home_user_login_type.length > 0) {
                    data['current_opt_type'] = 'login_' + this.home_user_login_type[0];
                    // 是否开启图片验证码
                    if (this.home_user_login_img_verify_state == 1 || this.common_img_verify_state == 1) {
                        this.image_verify_event('user_login');
                    }
                }

                // 开启注册则取第一个
                if (value == 'reg' && this.home_user_reg_type.length > 0) {
                    data['current_opt_type'] = 'reg_' + this.home_user_reg_type[0];
                    // 是否开启图片验证码
                    if (this.home_user_register_img_verify_state == 1 || this.common_img_verify_state == 1) {
                        this.image_verify_event('user_reg');
                    }
                }
                this.setData(data);

                // 标题
                if ((data.current_opt_type || null) != null) {
                    this.setData({
                        navigation_bar_title_key: data.current_opt_type,
                    });
                    this.set_navigation_bar_title();
                }
            },

            // 操作类型事件
            opt_type_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    this.setData({
                        current_opt_type: value,
                    });

                    // 图片验证码
                    if (value == 'login_username' && this.home_user_login_img_verify_state == 1) {
                        this.image_verify_event('user_login');
                    }
                    if ((value == 'login_sms' || value == 'login_email') && this.common_img_verify_state == 1) {
                        this.image_verify_event('user_login');
                    }
                    if (value == 'reg_username' && this.home_user_register_img_verify_state == 1) {
                        this.image_verify_event('user_reg');
                    }
                    if ((value == 'reg_sms' || value == 'reg_email') && this.common_img_verify_state == 1) {
                        this.image_verify_event('user_reg');
                    }

                    // 标题
                    this.setData({
                        navigation_bar_title_key: value,
                    });
                    this.set_navigation_bar_title();
                }
            },

            // 导航名称设置
            set_navigation_bar_title() {
                // 重新设置静态资源
                this.set_resources_data();
                // 设置这标题
                uni.setNavigationBarTitle({
                    title: this.current_opt_type_title[this.navigation_bar_title_key],
                });
            },

            // 图片验证码事件
            image_verify_event(e) {
                var type = typeof e == 'string' ? e : e.currentTarget.dataset.type || null;
                if (type !== null) {
                    var tv = app.globalData.get_timestamp();
                    var url = app.globalData.get_request_url('userverifyentry', 'user', '', 'type=' + type + '&t=' + tv);
                    this.setData({
                        verify_image_url: url,
                    });
                }
            },

            // 缓存数据刷新
            cache_refresh_event(e) {
                app.globalData.init_config();
                var self = this;
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });
                setTimeout(function () {
                    self.init();
                    uni.hideLoading();
                }, 3000);
            },

            // 第三方登录事件
            plugins_thirdpartylogin_event(e) {
                // 是否已同意协议
                if (!this.agreement_status) {
                    app.globalData.showToast(this.$t('login.login.btu2c1'));
                    return false;
                }
                this.setData({
                    popup_login_status: false,
                });

                // 调用登录处理
                this.plugins_thirdpartylogin_handle(e.currentTarget.dataset.type);
            },
            
            // 第三方登录处理
            plugins_thirdpartylogin_handle(type) {            
                // #ifdef H5
                // 直接跳转到登录地址、这里还可以根据终端类型进行处理业务逻辑
                for(var i in this.plugins_thirdpartylogin_data) {
                    if(type == i) {
                        window.location.href = this.plugins_thirdpartylogin_data[i]['login_url'];
                    }
                }
                // #endif

                // #ifdef APP
                let self = this;
                switch (type) {
                    // 微信、QQ、谷歌
                    case 'weixin':
                    case 'qq':
                    case 'google':
                        uni.login({
                            provider: type,
                            success: function (res) {
                                let auth_result = res.authResult;
                                self.app_login_bind_handle(
                                    {
                                        ...auth_result,
                                        ...{
                                            platform: type,
                                            openid: auth_result.openid,
                                            access_token: auth_result.access_token,
                                        },
                                    },
                                    auth_result
                                );
                            },
                            fail: function (error) {
                                app.globalData.showToast(error.errMsg+'('+error.code+')');
                            },
                        });
                        break;
            
                    // 苹果
                    case 'apple':
                        uni.login({
                            provider: type,
                            success: function (res) {
                                let auth_result = res.appleInfo || res.userInfo;
                                self.app_login_bind_handle(
                                    {
                                        ...auth_result,
                                        ...{
                                            platform: type,
                                            openid: auth_result.openId || auth_result.user,
                                            access_token: auth_result.access_token || '',
                                        },
                                    },
                                    auth_result
                                );
                            },
                            fail: function (error) {
                                app.globalData.showToast(error.errMsg+'('+error.code+')');
                            },
                        });
                        break;
            
                    default:
                        app.globalData.showToast(type + this.$t('login.login.li9573'));
                }
                // #endif
            },

            // 登录回处理
            app_login_bind_handle(post_data, auth_result) {
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('bind', 'index', 'thirdpartylogin'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var user = { ...auth_result, ...res.data.data };
                            // 设置当前第三方登录用户数据
                            this.setData({
                                plugins_thirdpartylogin_user: user,
                            });

                            // 不需要绑定账号、则成功
                            if ((user.is_force_bind_user || 0) != 1) {
                                this.setData({
                                    user: user,
                                });

                                // 缓存当前用户数据
                                uni.setStorageSync(app.globalData.data.cache_user_info_key, user);

                                // 成功回调
                                this.success_back_handle(res);
                            }

                            // 重新初始化
                            this.init();
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: (res) => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 第三方登录绑定账号取消
            plugins_thirdpartylogin_cancel_event(e) {
                app.globalData.url_open('/pages/login/login', true);
            },

            // 成功返回
            success_event(e) {
                var url = this.prev_page == null ? app.globalData.app_tabbar_pages()[0] : this.prev_page;
                app.globalData.url_open(url, true);
            },

            // 返回首页
            back_event() {
                app.globalData.page_back_prev_event();
            },

            // 打开语言选择弹窗
            open_language_event() {
                if ((this.$refs.lang_switch || null) != null) {
                    this.$refs.lang_switch.lang_open_event();
                }
            },
            // 提交语言选择
            popup_sub_language_event(e) {
                this.setData({
                    language: e,
                });
                // 重新设置当前页面标题
                this.set_navigation_bar_title();
                // 重新读取数据配置
                app.globalData.init_config();
            },

            // 打开登录方式弹层
            popup_login_open_event() {
                // 是否已同意协议
                if (!this.agreement_status) {
                    app.globalData.showToast(this.$t('login.login.btu2c1'));
                    return false;
                }
                this.setData({
                    popup_login_status: true,
                });
            },

            // 关闭登录方式弹层
            popup_login_close_event() {
                this.setData({
                    popup_login_status: false,
                });
            },

            // 获取app第三方登录通道
            provider_action() {
                uni.getProvider({
                    service: 'oauth',
                    success: (result) => {
                        this.setData({
                            app_login_provider_list: result.provider || [],
                        });
                    },
                    fail: (error) => {},
                });
            },
        },
    };
</script>
<style>
    @import './login.css';
</style>
