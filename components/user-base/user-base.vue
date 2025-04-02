<template>
    <view :class="theme_view">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view :class="'user-base-popup bg-white ' + (propIsGrayscale ? 'grayscale' : '')">
                <view class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="24rpx" color="#999"></iconfont>
                    </view>
                </view>
                <form @submit="form_submit" class="form-container">
                    <view class="padding-top-sm">
                        <view class="text-size-md spacing-mb">
                            <text>{{$t('user-base.user-base.g5663y')}}</text>
                            <text v-if="(check_field.is_avatar || 0) == 1">{{$t('personal.personal.cw1d8p')}}</text>
                            <text v-if="(check_field.is_nickname || 0) == 1">、{{$t('personal.personal.gw8br3')}}</text>
                            <text v-if="(check_field.is_mobile || 0) == 1">、{{$t('login.login.28k91h')}}</text>
                        </view>
                        <view class="padding-bottom-main cr-grey-9 br-b">
                            <text>{{$t('user-base.user-base.913g4e')}}</text>
                            <text v-if="(check_field.is_avatar || 0) == 1">{{$t('personal.personal.cw1d8p')}}</text>
                            <text v-if="(check_field.is_nickname || 0) == 1">、{{$t('personal.personal.gw8br3')}}</text>
                            <text v-if="(check_field.is_mobile || 0) == 1">、{{$t('login.login.28k91h')}}</text>
                            <text>{{$t('user-base.user-base.yujeaf')}}</text>
                        </view>
                        <view v-if="(check_field.is_avatar || 0) == 1" class="form-gorup oh flex-row align-c br-b">
                            <view class="form-gorup-title text-size-md">{{$t('personal.personal.cw1d8p')}}<text class="form-group-tips-must">*</text></view>
                            <button class="bg-white br-0 padding-0 margin-left-xxl flex-row jc-sb align-c flex-1" hover-class="none" open-type="chooseAvatar" @chooseavatar="choose_avatar_event" @tap="choose_avatar_event">
                                <image :src="user_avatar || default_avatar" mode="widthFix" class="circle br user-base-avatar"></image>
                                <iconfont name="icon-arrow-right" size="24rpx" color="#ccc"></iconfont>
                            </button>
                        </view>
                        <view v-if="(check_field.is_nickname || 0) == 1" class="form-gorup oh flex-row align-c br-b">
                            <view class="form-gorup-title text-size-md">{{$t('personal.personal.gw8br3')}}<text class="form-group-tips-must">*</text></view>
                            <view class="user-nickname-container padding-left-xxl">
                                <input :type="client_value == 'weixin' ? 'nickname': 'text'" maxlength="16" placeholder-class="cr-grey-c" class="cr-base" :placeholder="$t('user-base.user-base.o19lj3')" @input="on_input_nickname" @blur="on_input_nickname" />
                            </view>
                        </view>
                        <view v-if="(check_field.is_mobile || 0) == 1" class="form-gorup oh flex-row align-c br-b">
                            <view class="form-gorup-title text-size-md">{{$t('login.login.1p7843')}}<text class="form-group-tips-must">*</text></view>
                            <view class="user-mobile-container padding-left-xxl">
                                <button class="bg-white br-white text-size-md margin-top-sm padding-left-0 tl" :class="(user_mobile || null) == null ? 'cr-green' : ''" type="default" hover-class="none" open-type="getPhoneNumber" @getphonenumber="confirm_phone_number_event">{{ user_mobile || $t('login.login.8fghjs') }}</button>
                            </view>
                        </view>

                        <view class="tc padding-top-xxl">
                            <button class="sub-btn cr-white text-size" :class="form_submit_disabled_status ? 'bg-grey-d br-grey-d' : 'bg-main br-main'" type="default" form-type="submit" hover-class="none">{{$t('common.save')}}</button>
                        </view>
                    </view>
                </form>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                client_value: app.globalData.application_client_type(),
                default_avatar: app.globalData.data.default_user_head_src,
                cache_key: app.globalData.data.cache_user_base_personal_interval_time_key,
                popup_status: false,
                user: {},
                check_field: {},
                user_avatar: '',
                nickname: '',
                user_mobile: '',
                pages: [],
                client: [],
                interval_time: 0,
                is_weixin_force: false,
                form_submit_disabled_status: true,
                back_object: null,
                back_method: null,
                back_params: null
            };
        },

        components: {
            componentPopup,
        },
        props: {
            propIsGrayscale: {
                type: Boolean,
                default: false,
            },
        },

        created: function () {
            // 初始化配置
            this.init_config();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        pages: app.globalData.get_config('config.common_app_user_base_popup_pages', []),
                        client: app.globalData.get_config('config.common_app_user_base_popup_client', []),
                        interval_time: parseInt(app.globalData.get_config('config.common_app_user_base_popup_interval_time', 1800)),
                        is_weixin_force: this.client_value == 'weixin' && parseInt(app.globalData.get_config('config.common_app_is_weixin_force_user_base', 0)) == 1,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始配置
            init(params = {}) {
                // 初始化配置
                this.init_config(true);
                // 公共接口已初始化完成
                if(app.globalData.data.common_data_init_status == 1) {
                    // 未指定类型则自动匹配页面
                    var type = '';
                    if((params.type || null) == null) {
                        var page = '/'+app.globalData.current_page(false);
                        var obj = {
                            'index': '/pages/index/index',
                            'goods-category': '/pages/goods-category/goods-category',
                            'cart': '/pages/cart/cart',
                            'user': '/pages/user/user',
                        };
                        var index = Object.values(obj).indexOf(page);
                        if(index != -1) {
                            type = Object.keys(obj)[index];
                        }
                    } else {
                        type = params.type;
                    }
                    if((type || null) != null) {
                        // 是否需要展示弹窗提示
                        if (!this.popup_status && this.pages.indexOf(type) != -1 && this.client.indexOf(this.client_value) != -1) {
                            // 当前缓存用户
                            var user = app.globalData.get_user_cache_info() || null;
                            // 需要填写字段数据
                            var result = this.form_write_field_check_data(user);
                            // 非微信 或者 微信小程序是否强制填写基础信息、强制则不验证时间
                            if(this.client_value != 'weixin' || !this.is_weixin_force) {
                                // 间隔时间
                                var cache_time = parseInt(uni.getStorageSync(this.cache_key) || 0);
                                var current_time = Date.parse(new Date()) / 1000;
                                if (result.popup_status && !this.popup_status && cache_time > 0 && current_time < cache_time + parseInt(this.interval_time)) {
                                    result['popup_status'] = false;
                                }
                            }
                            this.setData({
                                ...result,
                                ...{
                                    back_object: params.object || null,
                                    back_method: params.method || null,
                                    back_params: params.params || params,
                                }
                            });
                        }
                    }
                }
                return this.popup_status;
            },

            // 表单需要填写的验证数据
            form_write_field_check_data(user, is_set_data = false) {
                var check_field = {
                    is_nickname: 0,
                    is_avatar: 0,
                    is_mobile: 0,
                };
                if((user || null) != null) {
                    // 默认昵称则赋空值
                    var arr = [this.$t('user-base.user-base.8u9on2'), this.$t('user-base.user-base.t8i9l4'), this.$t('user-base.user-base.0imw74'), this.$t('user-base.user-base.27q5af'), this.$t('user-base.user-base.211pk4'), this.$t('user-base.user-base.5x8o43'), 'WeChat User', 'Usuarios de Wechat'];
                    if ((user.nickname || null) == null || arr.indexOf(user.nickname) != -1) {
                        user['nickname'] = '';
                        check_field['is_nickname'] = 1;
                    }
                    // 头像是默认则置为空
                    if ((user.avatar || null) == null || user.avatar.indexOf('default-user-avatar') != -1) {
                        user['avatar'] = '';
                        check_field['is_avatar'] = 1;
                    }
                    // 手机
                    if(parseInt(user.is_mandatory_bind_mobile || 0) == 1 && (user.mobile || null) == null) {
                        var onekey_bind_mobile = app.globalData.get_config('config.common_user_onekey_bind_mobile_list', []);
                        if(onekey_bind_mobile.length > 0) {
                            if(onekey_bind_mobile.indexOf(this.client_value) != -1) {
                                user['mobile'] = '';
                                check_field['is_mobile'] = 1;
                            }
                        }
                    }
                }
                var result = {
                    check_field: check_field,
                    user: user,
                    popup_status: check_field.is_nickname + check_field.is_avatar + check_field.is_mobile > 0,
                };
                // 是否设置数据
                if(is_set_data) {
                    this.setData(result);
                }
                return result;
            },

            // 基础信息填写打开
            user_base_open(object, method, params) {
                this.setData({
                    popup_status: true,
                    back_object: object,
                    back_method: method,
                    back_params: params
                });
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false,
                });
                uni.setStorageSync(this.cache_key, Date.parse(new Date()) / 1000);
            },

            // 头像事件
            choose_avatar_event(e) {
                var self = this;
                if (this.client_value == 'weixin') {
                    self.upload_handle(e.detail.avatarUrl);
                } else {
                    uni.chooseImage({
                        count: 1,
                        success(res) {
                            if (res.tempFilePaths.length > 0) {
                                self.upload_handle(res.tempFilePaths[0]);
                            }
                        },
                    });
                }
            },

            // 上传处理
            upload_handle(image) {
                var self = this;
                uni.uploadFile({
                    url: app.globalData.get_request_url('useravatarupload', 'personal'),
                    filePath: image,
                    name: 'file',
                    formData: {},
                    success: function (res) {
                        if (res.statusCode == 200) {
                            var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                            if (data.code == 0) {
                                self.setData({
                                    user_avatar: data.data
                                });
                                // 提交按钮状态处理
                                self.submit_button_status_handle();
                            } else {
                                app.globalData.showToast(data.msg);
                            }
                        }
                    },
                });
            },

            // 输入框值监听
            on_input_nickname(e) {
                this.setData({
                    nickname: e.detail.value || '',
                });
                // 提交按钮状态处理
                this.submit_button_status_handle();
            },

            // 一键获取手机号码
            confirm_phone_number_event(e) {
                var encrypted_data = e.detail.encryptedData || null;
                var iv = e.detail.iv || null;
                var code = e.detail.code || null;
                if ((encrypted_data != null && iv != null) || code != null) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    var user = this.user || {};
                    var data = {
                        encrypted_data: encrypted_data,
                        iv: iv,
                        code: code,
                        openid: user[this.client_value + '_openid'] || '',
                    };
                    var field_unionid = this.client_value + '_unionid';
                    data[field_unionid] = user[field_unionid] || '';
                    uni.request({
                        url: app.globalData.get_request_url('onekeyusermobiledecrypt', 'user'),
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    user_mobile: res.data.data
                                });
                                // 提交按钮状态处理
                                this.submit_button_status_handle();
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
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

            // 提交按钮状态处理
            submit_button_status_handle() {
                var status = false;
                // 头像
                if(parseInt(this.check_field.is_avatar || 0) == 1 && (this.user_avatar || null) == null) {
                    status = true;
                }
                // 昵称
                if(!status && parseInt(this.check_field.is_nickname || 0) == 1 && (this.nickname || null) == null) {
                    status = true;
                }
                // 手机
                if(!status && parseInt(this.check_field.is_mobile || 0) == 1 && (this.user_mobile || null) == null) {
                    status = true;
                }
                this.setData({
                    form_submit_disabled_status: status,
                });
            },

            // 数据提交
            form_submit(e) {
                // 验证数据项
                var validation = [];
                if (parseInt(this.check_field.is_avatar || 0) == 1) {
                    validation.push({
                        fields: 'avatar',
                        msg: this.$t('user-base.user-base.gzc3y4'),
                    });
                }
                if (parseInt(this.check_field.is_nickname || 0) == 1) {
                    validation.push({
                        fields: 'nickname',
                        msg: this.$t('user-base.user-base.lro9u7'),
                    });
                }
                if (parseInt(this.check_field.is_mobile || 0) == 1) {
                    validation.push({
                        fields: 'mobile',
                        msg: this.$t('login.login.tghjer'),
                    });
                }
                // 数据
                var data = {
                    nickname: this.nickname || '',
                    avatar: this.user_avatar || '',
                    mobile: this.user_mobile || ''
                };
                // 当前用户是否已经存在
                var user = this.user || {};
                if((user.id || null) == null) {
                    data['openid'] = user[this.client_value + '_openid'] || '';
                    data['province'] = user.province || '';
                    data['city'] = user.city || '';
                    data['gender'] = user.gender || 0;
                    var field_unionid = this.client_value + '_unionid';
                    data[field_unionid] = user[field_unionid] || '';
                    // 接口地址
                    var url = app.globalData.get_request_url('userbasereg', 'user');
                } else {
                    // 存在用户则先存储用户信息
                    uni.setStorageSync(app.globalData.data.cache_user_info_key, user);
                    // 验证数据项
                    if (parseInt(this.check_field.is_avatar || 0) != 1) {
                        delete data['avatar'];
                    }
                    if (parseInt(this.check_field.is_nickname || 0) != 1) {
                        delete data['nickname'];
                    }
                    if (parseInt(this.check_field.is_mobile || 0) != 1) {
                        delete data['mobile'];
                    }
                    // 接口地址
                    var url = app.globalData.get_request_url('save', 'personal');
                }
                if (app.globalData.fields_check(data, validation)) {
                    // 数据保存
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: url,
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                uni.setStorageSync(app.globalData.data.cache_user_info_key, res.data.data);
                                app.globalData.showToast(res.data.msg, 'success');
                                this.setData({
                                    popup_status: false,
                                });
                                // 回调
                                if (typeof this.back_object === 'object' && (this.back_method || null) != null) {
                                    this.back_object[this.back_method](this.back_params);
                                }
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            }
        }
    };
</script>
<style scoped>
    .user-base-popup {
        padding: 36rpx;
        position: relative;
    }
    .user-base-popup .close {
        position: absolute;
        top: 36rpx;
        right: 36rpx;
        z-index: 2;
    }
    .user-base-avatar {
        width: 80rpx;
        height: 80rpx !important;
    }
    .user-base-popup .form-gorup-title {
        line-height: 70rpx;
        margin-bottom: 0;
    }
    .user-base-popup .user-nickname-container,
    .user-base-popup .user-mobile-container {
        width: calc(100% - 120rpx);
    }
    .form-container .form-gorup {
        padding: 24rpx 0;
        border-radius: 0;
    }
    .form-container .form-gorup-title {
        font-weight: 400;
    }
    .sub-btn {
        width: 336rpx;
        height: 84rpx;
        line-height: 84rpx;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 12rpx;
    }
</style>
