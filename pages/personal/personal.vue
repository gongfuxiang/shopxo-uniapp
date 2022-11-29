<template>
    <view>
        <view class="page-bottom-fixed">
            <!-- 主体内容 -->
            <block v-if="data_list_loding_status == 3">
                <form @submit="form_submit" class="form-container">
                    <view class="padding-main oh">
                        <view class="form-gorup oh">
                            <view class="fw-b fl margin-top-lg">头像</view>
                            <button class="fr bg-white br-0 lh-0" hover-class="none" open-type="chooseAvatar" @chooseavatar="choose_avatar_event" @tap="choose_avatar_event">
                                <image :src="(user_data.avatar || default_avatar)" mode="widthFix" class="circle br user-avatar"></image>
                            </button>
                        </view>

                        <view class="form-gorup oh">
                            <view class="form-gorup-item-left">
                                <view class="form-gorup-title">昵称<text class="form-group-tips-must">*</text></view>
                                <input :type="(application_client_type == 'weixin') ? 'nickname' : 'text'" name="nickname" :value="user_data.nickname || ''" maxlength="16" placeholder-class="cr-grey" class="cr-base" placeholder="昵称2~16个字符">
                            </view>
                            <view class="form-gorup-item-right">
                                <view class="form-gorup-title">生日</view>
                                <picker name="birthday" mode="date" :value="user_data.birthday || ''" data-field="birthday" @change="select_change_event">
                                    <view :class="'picker '+((user_data.birthday || null) == null ? 'cr-grey' : '')">{{user_data.birthday || '请选择生日'}}</view>
                                </picker>
                            </view>
                        </view>

                        <view class="form-gorup">
                            <view class="oh">
                                <view class="form-gorup-item-left">
                                    <view class="form-gorup-title">所在省</view>
                                    <input type="text" name="province" :value="user_data.province || ''" maxlength="30" placeholder-class="cr-grey" class="cr-base" placeholder="所在省最多30个字符">
                                </view>
                                <view class="form-gorup-item-right">
                                    <view class="form-gorup-title">所在市</view>
                                    <input type="text" name="city" :value="user_data.city || ''" maxlength="30" placeholder-class="cr-grey" class="cr-base" placeholder="所在市最多30个字符">
                                </view>
                            </view>
                            <view class="oh br-t">
                                <view class="form-gorup-item-left padding-top-lg">
                                    <view class="form-gorup-title">所在区/县</view>
                                    <input type="text" name="county" :value="user_data.county || ''" maxlength="30" placeholder-class="cr-grey" class="cr-base" placeholder="所在区/县最多30个字符">
                                </view>
                                <view class="form-gorup-item-right padding-top-lg">
                                    <view class="form-gorup-title">详细地址</view>
                                    <input type="text" name="address" :value="user_data.address || ''" maxlength="30" placeholder-class="cr-grey" class="cr-base" placeholder="详细地址最多30个字符">
                                </view>
                            </view>
                        </view>

                        <view class="form-gorup oh">
                            <view class="form-gorup-title">性别</view>
                            <view class="radio-gorup">
                                <radio-group data-field="gender" @change="select_change_event">
                                    <block v-for="(item,index) in gender_list" :key="index">
                                        <label class="radio">
                                            <radio :value="item.id.toString()" :checked="(parseInt(user_data.gender || 0) == item.id)" />
                                            <text class="va-m">{{item.name}}</text>
                                        </label>
                                    </block>
                                </radio-group>
                            </view>
                        </view>

                        <view class="bottom-fixed padding-main">
                            <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">保存</button>
                        </view>
                    </view>
                </form>
            </block>

            <!-- 错误提示 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";

    export default {
        data() {
            return {
                application_client_type: app.globalData.application_client_type(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                form_submit_disabled_status: false,
                default_avatar: app.globalData.data.default_user_head_src,
                user_data: {},
                gender_list: []
            }
        },

        components: {
            componentNoData
        },

        onShow() {
            // 数据加载
            this.init();
        },

        methods: {
            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        this.setData({
                            data_list_loding_status: 0,
                            data_list_loding_msg: '请先绑定手机'
                        });
                        return false;
                    } else {
                        this.get_data();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: '请先登录'
                    });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "personal"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        if(res.data.code == 0) {
                            this.setData({
                                data_list_loding_status: 3,
                                user_data: res.data.data.data || {},
                                gender_list: res.data.data.gender_list || []
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.msg
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 生日、性别选择事件
            select_change_event(e) {
                var temp = this.user_data;
                temp[e.currentTarget.dataset.field] = e.detail.value;
                this.setData({user_data: temp});
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
                                var temp = self.user_data;
                                temp['avatar'] = data.data;
                                self.setData({user_data: temp});
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
                form_data['avatar'] = this.user_data.avatar || '';
                // 生日
                form_data['birthday'] = this.user_data.birthday || '';
                // 性别
                form_data['gender'] = this.user_data.gender || 0;

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
                            setTimeout(function() {
                                uni.navigateBack();
                            }, 1000);
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
</script>
<style>
    @import './personal.css';
</style>