<template>
    <view>
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view :class="'user-base-popup bg-white page-bottom-fixed '+(propIsGrayscale ? 'grayscale' : '')">
                <view class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <icon type="clear" size="46rpx"></icon>
                    </view>
                </view>
                <form @submit="form_submit" class="form-container">
                    <view class="padding-horizontal-main padding-top-main">
                        <view class="cr-base margin-bottom-xl tc text-size-xs fw-b">请完善头像及昵称，让我们更好的为您服务！</view>
                        <view v-if="(user.avatar || null) == null" class="form-gorup oh">
                            <view class="form-gorup-title fl">头像<text class="form-group-tips-must">*</text></view>
                            <button class="fl bg-white br-0 lh-0 padding-0 margin-left-xxl" hover-class="none" open-type="chooseAvatar" @chooseavatar="choose_avatar_event" @tap="choose_avatar_event">
                                <image :src="(user_avatar || default_avatar)" mode="widthFix" class="circle br user-base-avatar"></image>
                            </button>
                        </view>
                        <view v-if="(user.nickname || null) == null" class="form-gorup oh">
                            <view class="form-gorup-title fl">昵称<text class="form-group-tips-must">*</text></view>
                            <view class="fr user-nickname-container">
                                <input :type="(application_client_type == 'weixin') ? 'nickname' : 'text'" name="nickname" maxlength="16" placeholder-class="cr-grey" class="cr-base" placeholder="输入昵称1~16个字符">
                            </view>
                        </view>

                        <view class="bottom-fixed padding-main">
                            <button class="bg-main br-main cr-white round text-size-sm" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">保存</button>
                        </view>
                    </view>
                </form>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from "../../components/popup/popup";
    export default {
        data() {
            return {
                application_client_type: app.globalData.application_client_type(),
                default_avatar: app.globalData.data.default_user_head_src,
                cache_key: app.globalData.data.cache_user_base_personal_interval_time_key,
                popup_status: false,
                user: null,
                user_avatar: '',
                pages: [],
                client: [],
                interval_time: 0
            };
        },

        components: {
            componentPopup
        },
        props: {
            propIsGrayscale: {
            	type: Boolean,
            	default: false
            }
        },

        created: function() {
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
                        interval_time: parseInt(app.globalData.get_config('config.common_app_user_base_popup_interval_time', 1800))
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始配置
            init(type = '') {
                // 初始化配置
                this.init_config(true);

                // 是否需要展示弹窗提示
                if(this.pages.indexOf(type) != -1 && this.client.indexOf(this.application_client_type) != -1) {
                    // 当前缓存用户
                    var user = app.globalData.get_user_cache_info();
                    // 头像是默认则置为空
                    if(user != null && (user.avatar || null) != null && user.avatar.indexOf('default-user-avatar') != -1) {
                        user.avatar = '';
                    }
                    // 状态
                    var status = (user == null) ? false : (((user.avatar || null) == null || (user.nickname || null) == null) ? true : false);
                    // 间隔时间
                    var cache_time = parseInt(uni.getStorageSync(this.cache_key) || 0);
                    var current_time = Date.parse(new Date())/1000;
                    if(status && !this.popup_status && cache_time > 0 && current_time < cache_time+parseInt(this.interval_time)) {
                        status = false;
                    }
                    this.setData({
                        popup_status: status,
                        user: user
                    });
                }
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false
                });
                uni.setStorageSync(this.cache_key, Date.parse(new Date())/1000);
            },

            // 头像事件
            choose_avatar_event(e) {
                var self = this;
                if(this.application_client_type == 'weixin') {
                    self.upload_handle(e.detail.avatarUrl);
                } else {
                    uni.chooseImage({
                        count: 1,
                        success(res) {
                            if(res.tempFilePaths.length > 0) {
                                self.upload_handle(res.tempFilePaths[0]);
                            }
                        }
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
                    success: function(res) {
                        if(res.statusCode == 200) {
                            var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                            if(data.code == 0) {
                                self.setData({user_avatar: data.data});
                            } else {
                                app.globalData.showToast(data.msg);
                            }
                        }
                    }
                });
            },
            
            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;
                // 头像
                form_data['avatar'] = this.user_avatar || '';

                // 验证数据项
                var validation = [];
                if((this.user.avatar || null) == null) {
                    validation.push({fields: 'avatar', msg: '请上传头像'});
                }
                if((this.user.nickname || null) == null) {
                    validation.push({fields: 'nickname', msg: '请填写昵称'});
                }
                if(app.globalData.fields_check(e.detail.value, validation)) {
                    // 数据保存
                    this.setData({
                        form_submit_disabled_status: true
                    });
                    uni.showLoading({
                        title: '处理中...'
                    });
                    uni.request({
                        url: app.globalData.get_request_url('save', 'personal'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: res => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_disabled_status: false
                            });
                            if(res.data.code == 0) {
                                uni.setStorageSync(app.globalData.data.cache_user_info_key, res.data.data);
                                app.globalData.showToast(res.data.msg, 'success');
                                this.setData({
                                    popup_status: false
                                });
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast('提交失败，请重试！');
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_disabled_status: false
                            });
                            app.globalData.showToast('服务器请求出错');
                        }
                    });
                }
            }
        }
    };
</script>
<style>
    .user-base-popup {
        padding: 20rpx 10rpx 0 10rpx;
        position: relative;
    }
    .user-base-popup .close {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
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
    .user-base-popup .user-nickname-container {
        width: calc(100% - 120rpx);
    }
</style>