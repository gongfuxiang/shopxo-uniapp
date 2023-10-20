<template>
    <view class="padding-main">
        <form @submit="formSubmit" class="form-container">
            <view class="bg-white border-radius-main padding-main flex-row align-c spacing-mb">
                <image v-if="data.url" class="avatar dis-block margin-right-xs" :src="data.url" mode="aspectFit"></image>
                <view class="flex-1 flex-width">
                    <view class="margin-right-sm">商品评分</view>
                    <uni-rate :value="rate_value" />
                </view>
            </view>
            <view class="bg-white border-radius-main padding-main">
                <textarea name="content" @input="text_input_event" maxlength="500" auto-height placeholder="请输入您的评价" class="wh-auto input-height" />
                <view class="tr text-size-xs cr-grey-c">{{ text_num }}/500</view>
                <view class="spacing-mt">
                    <view class="margin-bottom-main">添加图片(0/3)</view>
                    <component-upload :propData="image_list" :prop-path-type="editor_path_type" @call-back="retrun_image_event"></component-upload>
                </view>
                <view class="tr">
                    <label>
                        <checkbox name="is_anonymous" value="cb" checked="false" :color="theme_color" style="transform: scale(0.6)" />
                        匿名发布
                    </label>
                </view>
            </view>
            <view class="sub-btn">
                <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">提交</button>
            </view>
        </form>
    </view>
</template>
<script>
    const app = getApp();
    import componentUpload from '@/components/upload/upload';
    const theme_color = app.globalData.get_theme_color();
    export default {
        data() {
            return {
                theme_color: theme_color,
                data: {},
                rate_value: 0,
                image_list: [],
                editor_path_type: '',
                goods_id: '',
                text_num: 0,
            };
        },

        components: {
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
                uni.request({
                    url: app.globalData.get_request_url('index', 'goodscomments', 'intellectstools'),
                    method: 'POST',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            this.setData({
                                editor_path_type: res.data.data.editor_path_type || '',
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 表单提交
            formSubmit(e) {
                console.log(e.detail.value);
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
                    var newData = {
                        image_list:this.image_list,
                        ...validate,
                    }
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'goodscomments', 'intellectstools'),
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
            text_input_event(e) {
                this.setData({
                    text_num: e.detail.cursor,
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
