<template>
    <view>
        <form v-if="data_list_loding_status == 0" @submit="formSubmit" class="form-container">
            <view class="padding-main oh">
                <view class="form-gorup spacing-mb border-radius-main flex-row jc-sb align-c">
                    <view class="form-gorup-title padding-right-main text-size cr-black">联系人<text class="form-group-tips-must">*</text></view>
                    <input type="text" class="cr-base flex-1 flex-width tr" name="name" maxlength="30" placeholder="联系人格式 1~30 个字符之间" placeholder-class="cr-grey-9" />
                </view>

                <view class="form-gorup spacing-mb border-radius-main flex-row jc-sb align-c">
                    <view class="form-gorup-title padding-right-main text-size cr-black">联系电话<text class="form-group-tips-must">*</text></view>
                    <input type="text" class="cr-base flex-1 flex-width tr" name="tel" maxlength="30" placeholder-class="cr-grey-9" placeholder="座机 或 手机" />
                </view>

                <view class="form-gorup spacing-mb border-radius-main flex-row jc-sb align-c">
                    <view class="form-gorup-title padding-right-main text-size cr-black">标题<text class="form-group-tips-must">*</text></view>
                    <input type="text" class="cr-base flex-1 flex-width tr" name="title" maxlength="30" placeholder-class="cr-grey-9" placeholder="请输入标题" />
                </view>

                <view class="form-gorup spacing-mb border-radius-main">
                    <view class="form-gorup-title text-size cr-black">描述<text class="form-group-tips-must">*</text></view>
                    <textarea class="cr-base textarea-height" name="content" maxlength="160" placeholder-class="cr-grey-9" placeholder="请详细描述问题，我们将尽快为您解答！"></textarea>
                </view>

                <view class="form-gorup form-gorup-submit bottom-fixed form-btn bg-white">
                    <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">提交</button>
                </view>
            </view>
        </form>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '处理错误',
                form_submit_loading: false,
            };
        },

        components: {
            componentNoData,
        },
        props: {},

        onLoad() {},

        onShow() {
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');

                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    }

                    // 开启表单
                    this.setData({
                        data_list_loding_status: 0,
                    });
                } else {
                    // 提示错误
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '用户未登录',
                    });
                }
            },

            /**
             * 表单提交
             */
            formSubmit(e) {
                // 数据验证
                var validation = [
                    { fields: 'name', msg: '请填写联系人' },
                    { fields: 'tel', msg: '请填写联系电话' },
                    { fields: 'title', msg: '请填写标题' },
                    { fields: 'content', msg: '请填写内容' },
                ];
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    uni.showLoading({
                        title: '提交中...',
                    });
                    this.setData({
                        form_submit_loading: true,
                    });

                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('add', 'answer'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    uni.redirectTo({
                                        url: '/pages/plugins/answers/index/index',
                                    });
                                }, 2000);
                            } else {
                                this.setData({
                                    form_submit_loading: false,
                                });
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
                                form_submit_loading: false,
                            });
                            app.globalData.showToast('服务器请求出错');
                        },
                    });
                }
            },
        },
    };
</script>
<style scoped>
    @import './user-answers-form.css';
</style>
