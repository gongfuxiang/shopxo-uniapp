<template>
    <view :class="theme_view">
        <view v-if="(data || null) !== null && (user || null) !== null" class="tc padding-main padding-top-xxxl">
            <image :src="user.avatar" mode="widthFix" class="circle br user-avatar" />
            <view class="margin-top-xs">{{user.user_name_view}}</view>
            <block v-if="data.status == 1">
                <view class="margin-top-xxl">
                    <view class="fw-b">{{$t('index.index.slf50q')}}{{application_title}}</view>
                    <view class="cr-grey margin-top-sm">{{$t('index.index.rmv185')}}</view>
                </view>
                <view class="margin-top-xxxl padding-top-xl">
                    <button type="default" class="bg-main br-main cr-white round text-size" @tap="status_record(2)">{{$t('login.login.i1deai')}}</button>
                    <button type="default" class="bg-yellow br-yellow cr-white round text-size margin-top-lg" @tap="exit_event">{{$t('common.cancel')}}</button>
                </view>
            </block>
            <block v-else>
                <view class="margin-top-xxl">
                    <iconfont name="icon-qiandao-yixuan" size="28rpx" propClass="cr-green circle"></iconfont>
                    <text class="margin-left-xs">{{$t('index.index.n0vnl6')}}</text>
                </view>
                <view class="margin-top-xxxl padding-top-xl">
                    <button type="default" class="bg-yellow br-yellow cr-white round text-size margin-top-lg" @tap="exit_event">{{$t('frequencycard-list.frequencycard-list.n36x3w')}}</button>
                </view>
            </block>
        </view>
        <block v-else>
            <!-- 提示信息 -->
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
                // 基础配置
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: {},
                application_title: app.globalData.get_application_title(),
                user : null,
                data: null
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params || {},
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            init() {
                // 用户信息
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        user: user
                    });
                    // 记录状态
                    this.status_record(1);
                }
            },

            // 状态记录
            status_record(status) {
                // 加载loding
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });
                // 请求数据
                var post_data = {
                    ...this.params,
                    status: status
                };
                uni.request({
                    url: app.globalData.get_request_url('statusrecord', 'scan', 'thirdpartylogin'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                data: res.data.data,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'status_record', status)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 退出小程序
            exit_event(e) {
                uni.exitMiniProgram();
            }
        },
    };
</script>

<style>
    @import './index.css';
</style>