<template>
    <view :class="theme_view">
        <view v-if="goods_id" class="padding-main">
            <form v-if="data_list_loding_status == 3" @submit="formSubmit" class="form-container">
                <view class="bg-white border-radius-main padding-main flex-row align-c spacing-mb">
                    <image v-if="data.images" class="avatar dis-block margin-right-xs br-f5 padding-xs radius" :src="data.images" mode="aspectFit"></image>
                    <view class="flex-1 flex-width flex-row align-c">
                        <view class="margin-right-sm">{{ $t('goods-comments.goods-comments.31ees6') }}</view>
                        <uni-rate :value="rate_value" @change="rate_change_event" />
                    </view>
                </view>
                <view class="bg-white border-radius-main padding-main">
                    <textarea name="content" @input="text_input_event" maxlength="230" auto-height :placeholder="$t('goods-comments.goods-comments.6p942c')" placeholder-class="cr-grey-9" class="wh-auto input-height" />
                    <view class="tr text-size-xs cr-grey-c">{{ text_num }}/230</view>
                    <view class="spacing-mt">
                        <view class="margin-bottom-main">{{ $t('form.form.s14osm') }}{{ image_list.length }}/3)</view>
                        <component-upload :propData="image_list" :propPathType="editor_path_type" @call-back="retrun_image_event"></component-upload>
                    </view>
                    <view class="tr">
                        <checkbox-group @change="is_anonymous_change_event">
                            <label class="cr-grey-9 text-size-xs">
                                <checkbox value="1" :checked="false" :color="theme_color" style="transform: scale(0.5)" />
                                <text class="pr top-xs">{{ $t('form.form.2f52v3') }}</text>
                            </label>
                        </checkbox-group>
                    </view>
                </view>
                <view class="sub-btn">
                    <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{ $t('common.submit') }}</button>
                </view>
            </form>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data propStatus="0"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
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
                data_list_loding_msg: this.$t('form.form.bniyyt'),
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentUpload,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            if (params !== null && params.goods_id) {
                this.setData({
                    goods_id: params.goods_id,
                });
            }
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
                    uni.request({
                        url: app.globalData.get_request_url('index', 'goodscomments', 'intellectstools'),
                        method: 'POST',
                        success: (res) => {
                            uni.stopPullDownRefresh();
                            if (res.data.code == 0) {
                                this.setData({
                                    data: res.data.data.goods || {},
                                    editor_path_type: res.data.data.editor_path_type || '',
                                    data_list_loding_status: 3,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                });
                            }
                        },
                        fail: () => {
                            uni.stopPullDownRefresh();
                            this.setData({
                                data_list_loding_status: 2,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                } else {
                    // 提示错误
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('form.form.8l3ul5'),
                    });
                }
            },

            // 表单提交
            formSubmit(e) {
                // 数据验证
                var validation = [
                    { fields: 'rating', msg: this.$t('goods-comments.goods-comments.pe5p52') },
                    { fields: 'content', msg: this.$t('goods-comments.goods-comments.1wut9j') },
                ];
                var validate = {
                    rating: this.rate_value,
                    content: e.detail.value.content,
                };
                if (app.globalData.fields_check(validate, validation)) {
                    uni.showLoading({
                        title: this.$t('buy.buy.r79t77'),
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
