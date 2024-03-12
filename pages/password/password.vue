<template>
    <view :class="theme_view">
        <!-- 主体内容 -->
        <block v-if="data_list_loding_status == 3">
            <view class="password">
                <view class="padding-main">
                    <form @submit="formBindPwd">
                        <view class="margin-top-xxxl">
                            <view class="pr">
                                <input type="text" placeholder="请输入当前密码" minlength="6" maxlength="18" name="my_pwd" :password="!eyes1" class="form-item wh-auto margin-bottom-main" />
                                <view class="eyes pa" @tap="eyes1 = !eyes1"><iconfont :name="eyes1 ? 'icon-wodeqianbao-eye' : 'icon-wodeqianbao-eyeclo2'" color="#666" size="32rpx"></iconfont></view>
                            </view>
                            <view class="pr">
                                <input type="text" placeholder="请输入新密码" minlength="6" maxlength="18" name="new_pwd" :password="!eyes2" class="form-item wh-auto margin-bottom-main" />
                                <view class="eyes pa" @tap="eyes2 = !eyes2"><iconfont :name="eyes2 ? 'icon-wodeqianbao-eye' : 'icon-wodeqianbao-eyeclo2'" color="#666" size="32rpx"></iconfont></view>
                            </view>
                            <view class="pr">
                                <input type="text" placeholder="请确认新密码" minlength="6" maxlength="18" name="confirm_new_pwd" :password="!eyes3" class="form-item wh-auto margin-bottom-main" />
                                <view class="eyes pa" @tap="eyes3 = !eyes3"><iconfont :name="eyes3 ? 'icon-wodeqianbao-eye' : 'icon-wodeqianbao-eyeclo2'" color="#666" size="32rpx"></iconfont></view>
                            </view>
                        </view>
                        <view class="margin-top-xxxxl tc">
                            <button class="bg-main br-main cr-white round text-size" form-type="submit" type="default" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">确认修改</button>
                        </view>
                    </form>
                </view>
            </view>
        </block>
        <block v-else>
            <!-- 错误提示 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../components/no-data/no-data';
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
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        this.setData({
                            data_list_loding_status: 0,
                            data_list_loding_msg: this.$t('setup.setup.07o10b'),
                        });
                        return false;
                    } else {
                        this.setData({
                            data_list_loding_status: 3,
                            user: user,
                        });
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('setup.setup.nwt4o1'),
                    });
                }
            },

            formBindPwd(e) {
                // 数据验证
                var validation = [
                    { fields: 'my_pwd', msg: '请输入密码' },
                    { fields: 'new_pwd', msg: '请输入新密码' },
                    { fields: 'confirm_new_pwd', msg: '确认新密码' },
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
