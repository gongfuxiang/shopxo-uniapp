<template>
    <view :class="theme_view">
        <form v-if="data_list_loding_status == 0" @submit="formSubmit" class="form-container">
            <view class="padding-main oh">
                <view class="form-gorup border-radius-main">
                    <textarea class="cr-base textarea-height" name="content" maxlength="230" auto-height placeholder-class="cr-grey-9" :placeholder="$t('form.form.qt0q5u')" @input="text_input_event"></textarea>
                    <view class="tr text-size-xs cr-grey-c">{{ text_num }}/500</view>
                    <view class="spacing-mt dis-none">
                        <view class="margin-bottom-main">{{$t('form.form.s14osm')}}{{ image_list.length }}/3)</view>
                        <component-upload :propData="image_list" :propPathType="editor_path_type" @call-back="retrun_image_event"></component-upload>
                    </view>
                    <view class="tr margin-top-sm">
                        <checkbox-group @change="is_anonymous_change_event">
                            <label class="cr-grey-9 text-size-xs">
                                <checkbox value="1" :checked="false" :color="theme_color" style="transform: scale(0.5)" />
                                <text class="pr top-xs">{{$t('form.form.2f52v3')}}</text>
                            </label>
                        </checkbox-group>
                    </view>
                </view>
                <view class="sub-btn">
                    <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('form.form.4yd066')}}</button>
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
    import componentUpload from '@/components/upload/upload';
    const theme_color = app.globalData.get_theme_color();

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: theme_color,
                data_list_loding_status: 1,
                data_list_loding_msg: this.$t('form.form.bniyyt'),
                form_submit_loading: false,
                text_num: 0,
                image_list: [],
                is_anonymous: '0',
                editor_path_type: '', // ----------目前缺少此子段
            };
        },

        components: {
            componentNoData,
            componentUpload,
        },
        props: {},

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');

                if (user != false) {
                    // 用户未绑定手机则转到登录页面
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
                        data_list_loding_msg: this.$t('form.form.8l3ul5'),
                    });
                }
            },

            /**
             * 表单提交
             */
            formSubmit(e) {
                // 数据验证
                var validation = [
                    { fields: 'content', msg: this.$t('form.form.5v5bjs') },
                ];
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    uni.showLoading({
                        title: this.$t('buy.buy.r79t77'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    var newData = {
                        image_list:this.image_list,
                        is_anonymous:this.is_anonymous,
                        ...e.detail.value,
                    }
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'ask', 'ask'),
                        method: 'POST',
                        data: newData,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    uni.redirectTo({
                                        url: '/pages/plugins/ask/user-list/user-list',
                                    });
                                }, 2000);
                            } else {
                                this.setData({
                                    form_submit_loading: false,
                                });
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
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },
            text_input_event(e) {
                this.setData({
                    text_num: e.detail.cursor,
                });
            },
            is_anonymous_change_event(e) {
                this.setData({
                    is_anonymous: e.detail.value.length > 0 ? e.detail.value[0] : 0,
                });
            },
            // 上传回调
            retrun_image_event(data) {
                this.setData({
                    image_list: data,
                });
            },
        },
    };
</script>
<style scoped>
    @import './form.css';
</style>
