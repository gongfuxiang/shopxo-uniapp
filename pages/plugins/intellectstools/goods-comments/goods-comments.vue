<template>
    <view :class="theme_view">
        <view v-if="goods_id" class="padding-main">
            <form v-if="data_list_loding_status == 0" @submit="formSubmit" class="form-container">
                <view class="bg-white border-radius-main padding-main flex-row align-c spacing-mb">
                    <image v-if="data.url" class="avatar dis-block margin-right-xs" :src="data.url" mode="aspectFit"></image>
                    <view class="flex-1 flex-width flex-row align-c">
                        <view class="margin-right-sm">商品评分</view>
                        <uni-rate :value="rate_value" @change="rate_change_event" />
                    </view>
                </view>
                <view class="bg-white border-radius-main padding-main">
                    <textarea name="content" @input="text_input_event" maxlength="230" auto-height placeholder="请输入您的评价" placeholder-class="cr-grey-9" class="wh-auto input-height" />
                    <view class="tr text-size-xs cr-grey-c">{{ text_num }}/230</view>
                    <view class="spacing-mt">
                        <view class="margin-bottom-main">添加图片({{ image_list.length }}/3)</view>
                        <component-upload :propData="image_list" :prop-path-type="editor_path_type" @call-back="retrun_image_event"></component-upload>
                    </view>
                    <view class="tr">
                        <checkbox-group @change="is_anonymous_change_event">
                            <label class="cr-grey-9 text-size-xs">
                                <checkbox value="1" :checked="false" :color="theme_color" style="transform: scale(0.5)" />
                                <text class="pr top-xs">匿名发布</text>
                            </label>
                        </checkbox-group>
                    </view>
                </view>
                <view class="sub-btn">
                    <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">提交</button>
                </view>
            </form>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data propStatus="0"></component-no-data>
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
                data: {},
                rate_value: 0,
                image_list: [],
                editor_path_type: '',
                goods_id: '',
                is_anonymous: '0',
                text_num: 0,
                theme_color: theme_color,
                data_list_loding_status: 1,
                data_list_loding_msg: '处理错误',
            };
        },

        components: {
            componentNoData,
            componentUpload,
        },

        onLoad(params) {
            if (params !== null && params.goods_id) {
                this.setData({
                    goods_id: params.goods_id,
                });
            }
        },

        onShow() {
            // 数据加载
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        // 页面销毁时执行
        onUnload: function () {},

        methods: {
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
                    uni.request({
                        url: app.globalData.get_request_url('index', 'goodscomments', 'intellectstools'),
                        method: 'POST',
                        success: (res) => {
                            uni.stopPullDownRefresh();
                            if (res.data.code == 0) {
                                this.setData({
                                    data: res.data.data.data || {},
                                    editor_path_type: res.data.data.editor_path_type || '',
                                    data_list_loding_status: 0,
                                });
                            }
                        },
                        fail: () => {
                            uni.stopPullDownRefresh();
                            app.globalData.showToast('网络开小差了哦~');
                        },
                    });
                } else {
                    // 提示错误
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '用户未登录',
                    });
                }
            },

            // 表单提交
            formSubmit(e) {
                // 数据验证
                var validation = [
                    { fields: 'rating', msg: '请选择评分' },
                    { fields: 'content', msg: '请输入评价' },
                ];
                var validate = {
                    rating: this.rate_value,
                    content: e.detail.value.content,
                };
                if (app.globalData.fields_check(validate, validation)) {
                    uni.showLoading({
                        title: '提交中...',
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    var newData = {
                        goods_id: this.goods_id,
                        image_list: this.image_list,
                        is_anonymous: this.is_anonymous,
                        ...validate,
                    };
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'goodscomments', 'intellectstools'),
                        method: 'POST',
                        data: newData,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.page_back_prev_event();
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
                            app.globalData.showToast('网络开小差了哦~');
                        },
                    });
                }
            },
            text_input_event(e) {
                this.setData({
                    text_num: e.detail.cursor,
                });
            },
            rate_change_event(e) {
                this.setData({
                    rate_value: e.value,
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
<style>
    @import './goods-comments.css';
</style>
