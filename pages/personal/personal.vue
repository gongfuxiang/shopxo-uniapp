<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <!-- 主体内容 -->
            <block v-if="data_list_loding_status == 3">
                <form @submit="form_submit" class="form-container">
                    <view class="padding-main page-bottom-fixed">
                        <view class="bg-white border-radius-main oh">
                            <view class="form-gorup oh flex-row jc-sb align-c">
                                <view>{{$t('personal.personal.cw1d8p')}}</view>
                                <view class="flex-row align-c">
                                    <button class="bg-white br-0 lh-0 padding-horizontal-sm" hover-class="none" open-type="chooseAvatar" @chooseavatar="choose_avatar_event" @tap="choose_avatar_event">
                                        <image :src="user_data.avatar || default_avatar" mode="widthFix" class="circle br user-avatar flex-1 flex-width"></image>
                                    </button>
                                    <iconfont name="icon-arrow-right" size="34rpx" color="#ccc"></iconfont>
                                </view>
                            </view>

                            <view class="form-gorup oh flex-row jc-sb align-c">
                                <view class="form-gorup-title">{{$t('personal.personal.gw8br3')}}<text class="form-group-tips-must">*</text></view>
                                <view class="flex-row align-c flex-1 flex-width">
                                    <input :type="application_client_type == 'weixin' ? 'nickname' : 'text'" name="nickname" :value="user_data.nickname || ''" maxlength="16" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('personal.personal.44112i')" />
                                </view>
                            </view>

                            <view class="form-gorup oh flex-row jc-sb align-c">
                                <view class="form-gorup-title">{{$t('personal.personal.jibx42')}}</view>
                                <view class="flex-1 flex-width flex-row jc-e align-c">
                                    <picker class="margin-right-sm wh-auto tr" name="birthday" mode="date" :value="user_data.birthday || ''" data-field="birthday" @change="select_change_event">
                                        <view :class="'picker ' + ((user_data.birthday || null) == null ? 'cr-grey' : '')">{{ user_data.birthday || $t('personal.personal.85404s') }}</view>
                                    </picker>
                                    <iconfont name="icon-arrow-right" size="34rpx" color="#ccc"></iconfont>
                                </view>
                            </view>

                            <view class="form-gorup oh flex-row jc-sb align-c">
                                <view class="form-gorup-title">{{$t('personal.personal.6m33c4')}}</view>
                                <view class="flex-row align-c flex-1 flex-width">
                                    <input type="text" name="address" :value="user_data.address || ''" maxlength="30" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('personal.personal.re674n')" />
                                </view>
                            </view>

                            <view class="form-gorup oh flex-row jc-sb align-c">
                                <view class="form-gorup-title">{{$t('personal.personal.x2fofv')}}</view>
                                <view class="flex-row jc-e align-c flex-1 flex-width">
                                    <picker @change="select_change_event" :value="user_data.gender || ''" :range="gender_list" range-key="name" name="gender" data-field="gender" class="margin-right-sm wh-auto tr">
                                        <view class="uni-input cr-base picker">{{ gender_list[user_data.gender].name || '' }}</view>
                                    </picker>
                                    <iconfont name="icon-arrow-right" size="34rpx" color="#ccc"></iconfont>
                                </view>
                            </view>
                        </view>

                        <view class="bottom-fixed" :style="bottom_fixed_style">
                            <view class="bottom-line-exclude">
                                <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('common.save')}}</button>
                            </view>
                        </view>
                    </view>
                </form>
            </block>

            <!-- 错误提示 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                application_client_type: app.globalData.application_client_type(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                form_submit_disabled_status: false,
                default_avatar: app.globalData.data.default_user_head_src,
                user_data: {},
                gender_list: [],
            };
        },

        components: {
            componentCommon,
            componentNoData
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('setup.setup.nwt4o1'),
                    });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'personal'),
                    method: 'POST',
                    data: {lang_can_key: 'gender_list'},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.setData({
                                data_list_loding_status: 3,
                                user_data: res.data.data.data || {},
                                gender_list: res.data.data.gender_list || [],
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
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
                this.setData({ user_data: temp });
            },

            // 头像事件
            choose_avatar_event(e = null) {
                let self = this;
                let arr = ['weixin', 'alipay'];
                if (arr.indexOf(this.application_client_type) != -1) {
                    if(e !== null) {
                        let temp_url = e.detail.avatarUrl;
                        if(this.application_client_type == 'alipay') {
                            // 支付宝如果是临时文件走文件上传，普通图片地址走表单
                            if(temp_url.substr(-6) == '.image') {
                                self.upload_handle(temp_url, self);
                            } else {
                                self.upload_url_handle(temp_url, self);
                            }
                        } else {
                            self.upload_handle(temp_url, self);
                        }
                    }
                } else {
                    uni.chooseImage({
                        count: 1,
                        success(res) {
                            if (res.tempFilePaths.length > 0) {
                                self.upload_handle(res.tempFilePaths[0], self);
                            }
                        },
                    });
                }
            },
            
            // 上传处理
            upload_handle(image, self) {
                uni.uploadFile({
                    url: app.globalData.get_request_url('useravatarupload', 'personal'),
                    filePath: image,
                    name: 'file',
                    formData: {},
                    success: function (res) {
                        if (res.statusCode == 200) {
                            var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                            if (data.code == 0) {
                                var temp = self.user_data;
                                temp['avatar'] = data.data;
                                self.setData({ user_data: temp });
                            } else {
                                app.globalData.showToast(data.msg);
                            }
                        }
                    },
                });
            },
            
            // form上传url
            upload_url_handle(image, self) {
                uni.showLoading({
                    title: this.$t('common.upload_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('useravatarupload', 'personal'),
                    method: 'POST',
                    data: {file: image},
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp = self.user_data;
                            temp['avatar'] = res.data.data;
                            self.setData({ user_data: temp });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
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
                    form_submit_disabled_status: true,
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'personal'),
                    method: 'POST',
                    data: form_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        if (res.data.code == 0) {
                            uni.setStorageSync(app.globalData.data.cache_user_info_key, res.data.data);
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(function () {
                                uni.navigateBack();
                            }, 1000);
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
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style>
    @import './personal.css';
</style>
