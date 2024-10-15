<template>
    <view :class="theme_view">
        <!-- 主体内容 -->
        <block v-if="data_list_loding_status == 3">
            <view class="password">
                <view class="padding-main">
                    <form @submit="form_bind_pwd">
                        <view class="margin-top-xxxl">
                            <view class="pr">
                                <input type="text" :placeholder="$t('password.password.4e24j1')" minlength="6" maxlength="18" name="my_pwd" :password="!eyes1" class="form-item margin-bottom-main" />
                                <view class="eyes pa" data-index="1" @tap="eyes_event"><iconfont :name="eyes1 ? 'icon-wodeqianbao-eye' : 'icon-eye-half'" color="#666" size="32rpx"></iconfont></view>
                            </view>
                            <view class="pr">
                                <input type="text" :placeholder="$t('password.password.1lwiaz')" minlength="6" maxlength="18" name="new_pwd" :password="!eyes2" class="form-item margin-bottom-main" />
                                <view class="eyes pa" data-index="2" @tap="eyes_event"><iconfont :name="eyes2 ? 'icon-wodeqianbao-eye' : 'icon-eye-half'" color="#666" size="32rpx"></iconfont></view>
                            </view>
                            <view class="pr">
                                <input type="text" :placeholder="$t('password.password.338433')" minlength="6" maxlength="18" name="confirm_new_pwd" :password="!eyes3" class="form-item margin-bottom-main" />
                                <view class="eyes pa" data-index="3" @tap="eyes_event"><iconfont :name="eyes3 ? 'icon-wodeqianbao-eye' : 'icon-eye-half'" color="#666" size="32rpx"></iconfont></view>
                            </view>
                        </view>
                        <view class="margin-top-xxxxl tc">
                            <button class="bg-main br-main cr-white round text-size" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('password.password.xyekjf')}}</button>
                        </view>
                    </form>
                </view>
            </view>
        </block>
        <block v-else>
            <!-- 错误提示 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

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
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                form_submit_loading: false,
                // 是否显示密码
                eyes1: false,
                eyes2: false,
                eyes3: false,
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
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        data_list_loding_status: 3,
                        user: user,
                    });
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('setup.setup.nwt4o1'),
                    });
                }
            },
            eyes_event(e) {
                if (e.currentTarget.dataset.index == '1') {
                    this.setData({
                        eyes1: !this.eyes1,
                    });
                } else if (e.currentTarget.dataset.index == '2') {
                    this.setData({
                        eyes2: !this.eyes2,
                    });
                } else {
                    this.setData({
                        eyes3: !this.eyes3,
                    });
                }
            },

            // 绑定表单
            form_bind_pwd(e) {
                // 数据验证
                var validation = [
                    { fields: 'my_pwd', msg: this.$t('login.login.277w03') },
                    { fields: 'new_pwd', msg: this.$t('password.password.1lwiaz') },
                    { fields: 'confirm_new_pwd', msg: this.$t('password.password.3pp6t7') },
                ];
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });

                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('loginpwdupdate', 'safety'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(res.data.msg, 'success');
                            if (res.data.code == 0) {
                                setTimeout(() => {
                                    // 默认返回上一页
                                    uni.navigateBack();
                                }, 1500);
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
        },
    };
</script>
<style>
    @import './password.css';
</style>
