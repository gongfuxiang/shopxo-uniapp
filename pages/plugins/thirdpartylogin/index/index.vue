<template>
    <view :class="theme_view">
        <view v-if="(data || null) !== null && (user || null) !== null" class="tc padding-main padding-top-xxxl">
            <image :src="user.avatar" mode="widthFix" class="circle br user-avatar" />
            <view class="margin-top-xs">{{user.user_name_view}}</view>
            <block v-if="data.status == 1">
                <view class="margin-top-xxl">
                    <view class="fw-b">授权登录{{application_title}}</view>
                    <view class="cr-grey margin-top-sm">若非本人操作，请忽略申请</view>
                </view>
                <view class="margin-top-xxxl padding-top-xl">
                    <button type="default" class="bg-main br-main cr-white round text-size" @tap="status_record(2)">确认登录</button>
                    <button type="default" class="bg-yellow br-yellow cr-white round text-size margin-top-lg" @tap="exit_event">取消</button>
                </view>
            </block>
            <block v-else>
                <view class="margin-top-xxl">
                    <iconfont name="icon-qiandao-dqxz" size="28rpx" prop-class="cr-green circle"></iconfont>
                    <text class="margin-left-xs">已登录成功</text>
                </view>
                <view class="margin-top-xxxl padding-top-xl">
                    <button type="default" class="bg-yellow br-yellow cr-white round text-size margin-top-lg" @tap="exit_event">关闭</button>
                </view>
            </block>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';
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
            componentNoData,
        },

        onLoad(params) {
            this.setData({
                params: params || {},
            });
        },

        onShow() {
            this.init();
        },

        methods: {
            init() {
                // 用户信息
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        // 记录状态
                        this.status_record(0);
                        // 进入登录页面
                        uni.navigateTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                    } else {
                        this.setData({
                            user: user
                        });
                        // 记录状态
                        this.status_record(1);
                    }
                }
            },

            // 状态记录
            status_record(status) {
                // 加载loding
                uni.showLoading({
                    title: '加载中...',
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
                            data_list_loding_msg: '网络开小差了哦~',
                        });
                        app.globalData.showToast('网络开小差了哦~');
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