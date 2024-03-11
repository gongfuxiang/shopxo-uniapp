<template>
    <view :class="theme_view">
        <!-- 主体内容 -->
        <block v-if="data_list_loding_status == 3">
            <view class="password">
                <view class="padding-main">
                    <form @submit="formBindPwd">
                        <view class="margin-top-xxxl">
                            <input type="text" placeholder="请输入当前密码" minlength="6" maxlength="18" name="pwd_old" password="true" class="form-item wh-auto margin-bottom-main" />
                            <input type="text" placeholder="请输入新密码" minlength="6" maxlength="18" name="pwd_new" password="true" class="form-item wh-auto margin-bottom-main" />
                            <input type="text" placeholder="请确认新密码" minlength="6" maxlength="18" name="pwd_renew" password="true" class="form-item wh-auto margin-bottom-main" />
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

            formBindPwd() {
                // 小程序数据
                // #ifdef MP
                var field_openid = client_type + '_openid';
                var field_unionid = client_type + '_unionid';
                e.detail.value[field_openid] = user[field_openid] || '';
                e.detail.value[field_unionid] = user[field_unionid] || '';
                // #endif

                // 数据验证
                var validation = [
                    { fields: 'pwd_old', msg: '请输入密码' },
                    { fields: 'pwd_new', msg: '请输入新密码' },
                    { fields: 'pwd_renew', msg: '确认新密码' },
                ];
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
                        url: app.globalData.get_request_url('apppwdbind', 'user'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(res.data.msg);
                            if (res.data.code == 0 && (res.data.data || null) != null) {
                                // 默认返回上一页
                                uni.navigateBack();
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
