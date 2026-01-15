<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status !== 1">
            <form @submit="form_submit" class="form-container">
                <view class="page-bottom-fixed padding-main">
                    <view v-if="(business || null) != null" class="business bg-white oh padding-main border-radius-main spacing-mb">
                        <view class="fw-b padding-bottom-sm">{{$t('common.wait')}}{{$t('common.complaint')}}{{business.type_name}}{{$t('common.info')}}</view>
                        <view class="flex-row gap-10">
                            <image v-if="(business.cover || null) != null" :src="business.cover" mode="aspectFit" class="cover br-f5 radius"></image>
                            <view class="title">{{business.title}}</view>
                        </view>
                        <view class="margin-top-sm">
                            <text v-if="(business.tips || null) != null" class="cr-yellow">{{business.tips}}</text>
                            <text class="cr-blue margin-left-lg cp" @tap="business_cancel_event">{{$t('common.cancel')}}</text>
                        </view>
                    </view>
                    <view v-else-if="(data || null) != null && (data.data_title || null) != null" class="business bg-white oh padding-main border-radius-main spacing-mb">
                        <view class="fw-b padding-bottom-sm">{{$t('common.complaint')}}{{data.data_type_name}}{{$t('common.info')}}</view>
                        <view class="flex-row gap-10">
                            <image v-if="(data.data_cover || null) != null" :src="data.data_cover" mode="aspectFit" class="cover br-f5 radius"></image>
                            <view class="title">{{data.data_title}}</view>
                        </view>
                    </view>
                    <view v-if="complaint_type_list.length > 0" class="form-gorup border-radius-main spacing-mb">
                        <view class="form-gorup-title">{{$t('complaint-form.complaint-form.23rdfg')}}<text class="form-group-tips-must">*</text></view>
                        <view class="section">
                            <picker name="complaint_type" @change="complaint_type_event" :value="complaint_type_index" :range="complaint_type_list">
                                <view :class="'picker name ' + (complaint_type_index === null ? 'cr-grey' : 'cr-base')">
                                    <view v-if="complaint_type_index === null">{{$t('complaint-form.complaint-form.5434rd')}}</view>
                                    <view v-else>{{ complaint_type_list[complaint_type_index] }}</view>
                                </view>
                            </picker>
                        </view>
                    </view>
                    <view class="form-gorup border-radius-main spacing-mb">
                        <view class="form-gorup-title padding-right-main">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.87tuff')}}<text class="form-group-tips-must">*</text></view>
                        <textarea name="describe" placeholder-class="cr-grey-9" class="cr-base" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.6uygft')" maxlength="230" :value="data.describe || ''"></textarea>
                    </view>
                    <view class="form-gorup border-radius-main">
                        <view class="form-gorup-title padding-right-main">{{$t('complaint-form.complaint-form.78iudg')}}<text class="form-group-tips">{{$t('complaint-form.complaint-form.56ys33')}}</text></view>
                        <view class="margin-top-main">
                            <component-upload :propData="data.images" :propMaxNum="10" :propPathType="editor_path_type" @call-back="retrun_image_event"></component-upload>
                        </view>
                    </view>
                </view>
                <!-- 底部操作 -->
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view class="flex-row align-c gap-10">
                            <button class="item cr-white bg-main round text-size wh-auto" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                            <view v-if="(user || null) != null && params.is_list != 0" class="tc cp flex-width-half-half" @tap="url_event" data-value="/pages/plugins/complaint/user/user">
                                <iconfont name="icon-order-list" size="34rpx" propClass="cr-base"></iconfont>
                                <view class="cr-base">{{$t('common.list')}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </form>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentUpload from '@/components/upload/upload';
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_list_loding_status: 1,
                bottom_fixed_style: '',
                params: {},
                user: null,
                data: {},
                business: null,
                complaint_type_index: null,
                complaint_type_list: [],
                editor_path_type: '',
                form_submit_loading: false,
                is_complaint_app_login: false,
            };
        },
        components: {
            componentCommon,
            componentUpload,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
                user: app.globalData.get_user_cache_info() || null,
            });

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            app.globalData.init_config(0, this, 'init_config');

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            // 数据加载
            this.get_data();
        },

        // 页面销毁时执行
        onUnload: function () {},

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    var complaint_config = app.globalData.get_config('plugins_base.complaint.data') || {};
                    this.setData({
                        is_complaint_app_login: parseInt(complaint_config.is_complaint_app_login || 0) == 1,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            get_data() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'index', 'complaint'),
                    method: 'POST',
                    data: this.params,
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var complaint_type_list = data.complaint_type_list || [];
                            var complaint_type_index = null;
                            if((data.data || null) != null && (data.data.complaint_type || null) != null && complaint_type_list.length > 0) {
                                var temp_index = complaint_type_list.indexOf(data.data.complaint_type);
                                if(temp_index != -1) {
                                    complaint_type_index = temp_index;
                                }
                            }
                            this.setData({
                                data: data.data || {},
                                business: data.business || null,
                                complaint_type_list: complaint_type_list,
                                complaint_type_index: complaint_type_index,
                                editor_path_type: data.editor_path_type,
                                data_list_loding_status: 3,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
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
            },
            
            // 投诉/举报类型事件
            complaint_type_event(e) {
                this.setData({
                    complaint_type_index: e.detail.value || 0,
                });
            },

            // 上传回调
            retrun_image_event(res) {
                var temp_data = this.data;
                temp_data['images'] = res;
                this.setData({
                    data: temp_data,
                });
            },

            // 表单提交
            form_submit(e) {
                // 是否需要登录
                if(this.is_complaint_app_login) {
                    var user = app.globalData.get_user_info(this, 'form_submit', e);
                    if (user == false) {
                        return;
                    }
                }
                // 数据验证
                var validation = [
                    { fields: 'describe', msg: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.6uygft') },
                ];
                if(this.complaint_type_list.length > 0) {
                    validation.push({ fields: 'complaint_type', msg: this.$t('complaint-form.complaint-form.5434rd') });
                }
                var form_data = this.data;
                    form_data['complaint_type'] = (this.complaint_type_index === null || this.complaint_type_list.length == 0) ? '' : (this.complaint_type_list[this.complaint_type_index] || '');
                    form_data['describe'] = e.detail.value.describe;
                if (app.globalData.fields_check(form_data, validation)) {
                    if((this.business || null) != null) {
                        form_data['dataid'] = this.business.id || 0;
                        form_data['datatype'] = this.business.type || 0;
                    }
                    var page_url = app.globalData.prev_page() || null;
                    form_data['page_url'] = (page_url == null) ? '' : encodeURIComponent(base64.encode(page_url));
                    uni.showLoading({
                        title: this.$t('common.submit_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'index', 'complaint'),
                        method: 'POST',
                        data: form_data,
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

            // 业务数据取消
            business_cancel_event(e) {
                var temp_params = this.params || {};
                delete temp_params['dataid'];
                delete temp_params['datatype'];
                this.setData({
                    params: temp_params,
                    business: null,
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './form.css';
</style>
