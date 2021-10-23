<template>
    <view>
        <view v-if="user != null" class="content">
            <!-- 表单验证码 -->
            <form v-if="login_type_status == 1" @submit="formSubmit">
                <input type="number" placeholder="输入手机号码" maxlength="11" name="mobile" @input="bind_key_input" class="mobile">
                <view class="code pr">
                    <input type="number" placeholder="验证码" maxlength="4" name="verify" class="verify">
                    <button :class="'verify-sub pa round br text-size-sm cr-base ' + (verify_disabled ? 'sub-disabled' : '')" type="default" hover-class="none" size="mini" :loading="verify_loading" :disabled="verify_disabled" @tap="verify_send">{{verify_submit_text}}</button>
                </view>
                <button class="submit pa bg-main br-main cr-white round text-size" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">确认绑定</button>
            </form>

            <!-- 确认绑定方式 -->
            <view v-if="login_type_status == 0" class="login-base tc">
                <image class="login-logo circle auto br margin-bottom-xxl" :src="(user.avatar || null) == null ? '/static/images/default-user.png' : user.avatar" mode="widthFix"></image>
                <view v-if="(user.nickname || null) != null" class="cr-base">{{user.nickname}}</view>
                <view class="margin-top-xxxl padding-top-xxxl">
                    <button class="bg-main-pair br-main-pair cr-white round text-size" type="warn" hover-class="none" @tap="confirm_verify_event">验证码登录</button>
                    <button v-if="common_user_is_onekey_bind_mobile == 1" class="margin-top-xxl bg-main br-main cr-white round text-size" type="default" hover-class="none" open-type="getPhoneNumber" @getphonenumber="confirm_phone_number_event">获取手机号码一键登录</button>
                </view>
            </view>
        </view>

        <!-- 获取用户信息授权 -->
        <view v-else class="login-base tc">
            <image v-if="(home_site_logo_square || null) != null" class="login-logo circle auto br margin-bottom-xxl" :src="home_site_logo_square" mode="widthFix"></image>
            <view class="cr-base">确认登录授权，为您提供更优质的服务</view>
            <view class="margin-top-sm padding-bottom-xxl cr-gray">
                阅读并同意 《<text class="cr-main" @tap="agreement_event" data-value="userregister">服务协议</text>》 与 《<text class="cr-main" @tap="agreement_event" data-value="userprivacy">隐私政策</text>》
            </view>
            <view class="margin-top-xxl">
                <navigator open-type="navigateBack" hover-class="none" class="dis-inline-block margin-right-lg">
                    <button class="bg-yellow br-yellow cr-white round" type="default" size="mini" hover-class="none">取消</button>
                </navigator>
                <button class="margin-left-lg bg-green br-green cr-white round" type="default" size="mini" @tap="get_user_info_event">同意授权登录</button>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();

    export default {
        data() {
            return {
                params: null,
                user: null,
                mobile: null,
                verify_submit_text: '获取验证码',
                verify_loading: false,
                verify_disabled: false,
                form_submit_loading: false,
                verify_time_total: 60,
                temp_clear_time: null,
                // 基础配置
                // 0 确认绑定方式, 1 验证码绑定
                login_type_status: 0,
                common_user_is_onekey_bind_mobile: 0,
                home_site_logo_square: null
            };
        },

        components: {},
        props: {},

        // 页面加载初始化
        onLoad(option) {
            this.setData({
                params: option,
                user: app.globalData.get_user_cache_info() || null
            });
        },

        // 页面显示
        onShow() {
            uni.setNavigationBarTitle({
                title: this.user == null ? '授权用户信息' : '手机绑定'
            });
            
            // 初始化配置
            this.init_config();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        common_user_is_onekey_bind_mobile: app.globalData.get_config('config.common_user_is_onekey_bind_mobile'),
                        home_site_logo_square: app.globalData.get_config('config.home_site_logo_square')
                    });
                    console.log(this.home_site_logo_square)
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            /**
             * 登录授权事件
             */
            get_user_info_event(e) {
                uni.getUserProfile({
                    desc: '注册使用',
                    lang: 'zh_CN',
                    success: res => {
                        this.user_auth_code(res.userInfo);
                    }
                });
            },

            /**
             * 用户授权
             * auth_data  授权数据
             */
            user_auth_code(auth_data) {
                if ((auth_data || null) != null) {
                    app.globalData.user_auth_login(this, 'user_auth_back_event', auth_data);
                } else {
                    app.globalData.showToast("授权失败");
                }
            },

            /**
             * 授权返回事件
             */
            user_auth_back_event() {
                var user = app.globalData.get_user_cache_info();
                this.setData({
                    user: user || null
                });

                if (app.globalData.user_is_need_login(user) == false) {
                    uni.navigateBack();
                }
            },

            /**
             * 输入手机号码事件
             */
            bind_key_input(e) {
                this.setData({
                    mobile: e.detail.value
                });
            },

            /**
             * 短信验证码发送
             */
            verify_send() {
                // 数据验证
                var validation = [{
                    fields: 'mobile',
                    msg: '请填写手机号码'
                }];

                if (app.globalData.fields_check(this, validation)) {
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
                        url: app.globalData.get_request_url('appmobilebindverifysend', 'user'),
                        method: 'POST',
                        data: {
                            mobile: this.mobile
                        },
                        dataType: 'json',
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
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
                                    verify_disabled: false
                                });
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                verify_submit_text: '获取验证码',
                                verify_loading: false,
                                verify_disabled: false
                            });
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },

            /**
             * 表单提交
             */
            formSubmit(e) {
                // 邀请人参数
                var params = uni.getStorageSync(app.globalData.data.cache_launch_info_key) || null;
                
                // 数据验证
                var client_type = app.globalData.data.application_type;
                var field_openid = client_type+'_openid';
                var field_unionid = client_type+'_unionid';
                var validation = [
                    {fields: 'mobile', msg: '请填写手机号码'},
                    {fields: 'verify', msg: '请填写验证码'},
                    {fields: field_openid, msg: '授权id不能为空'}
                ];
                e.detail.value[field_openid] = this.user[field_openid] || '';
                e.detail.value['nickname'] = this.user.nickname;
                e.detail.value['avatar'] = this.user.avatar;
                e.detail.value['province'] = this.user.province;
                e.detail.value['city'] = this.user.city;
                e.detail.value['gender'] = this.user.gender;
                e.detail.value[field_unionid] = this.user[field_unionid] || '';
                e.detail.value['referrer'] = params == null ? this.user.referrer || 0 : params.referrer || 0;
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
                            uni.hideLoading();
                            if (res.data.code == 0 && (res.data.data || null) != null) {
                                clearInterval(this.temp_clear_time);
                                app.globalData.showToast(res.data.msg, 'success');
                                uni.setStorage({
                                    key: app.globalData.data.cache_user_info_key,
                                    data: res.data.data
                                });
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

            // 获取手机号码一键登录
            confirm_phone_number_event(e) {
                var encrypted_data = e.detail.encryptedData || null;
                var iv = e.detail.iv || null;
                if (encrypted_data != null && iv != null) {
                    // 邀请人参数
                    var params = uni.getStorageSync(app.globalData.data.cache_launch_info_key) || null;
                    var referrer = params == null ? this.user.referrer || 0 : params.referrer || 0;
                    
                    // 解密数据并绑定手机
                    var client_type = app.globalData.data.application_type;
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
                        "referrer": referrer || 0
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
                            uni.hideLoading();
                            if (res.data.code == 0 && (res.data.data || null) != null) {
                                app.globalData.showToast(res.data.msg, 'success');
                                uni.setStorage({
                                    key: app.globalData.data.cache_user_info_key,
                                    data: res.data.data
                                });
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
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            self.showToast('服务器请求出错');
                        }
                    });
                }
            },

            // 确认使用验证码
            confirm_verify_event(e) {
                this.setData({
                    login_type_status: 1
                });
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
            }
        }
    };
</script>
<style>
    @import './login.css';
</style>