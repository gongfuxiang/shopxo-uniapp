<template>
    <view>
        <!-- 导航 -->
        <view v-if="nav_list.length > 0" class="nav oh padding-top-main">
            <block v-for="(item, index) in nav_list" :key="index">
                <view class="item fl tc padding-main border-radius-main bg-white">
                    <navigator :url="item.url" hover-class="none">
                        <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
                        <view class="tc cr-base margin-top-lg">{{item.title}}</view>
                    </navigator>
                </view>
            </block>
        </view>
        
        <!-- 通知 -->
        <view v-if="(data_base.signin_desc || null) != null && data_base.signin_desc.length > 0" class="padding-horizontal-main padding-bottom-main">
            <view class="notice-content">
                <view v-for="(item, index) in data_base.signin_desc" :key="index" class="item">{{item}}</view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                nav_list: []
            };
        },

        components: {},
        props: {},

        onLoad(params) {},

        onShow() {
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '绑定手机号码',
                            confirmText: '确认',
                            cancelText: '暂不',
                            success: result => {
                                uni.stopPullDownRefresh();
                                if (result.confirm) {
                                    uni.navigateTo({
                                        url: "/pages/login/login?event_callback=init"
                                    });
                                }
                            }
                        });
                    } else {
                        this.get_data();
                    }
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("center", "user", "signin"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            // 是否开启组队
                            var temp_nav_list = [{
                                icon: "/static/images/plugins/signin/user-signin-icon.png",
                                title: "我的签到",
                                url: "/pages/plugins/signin/user-signin/user-signin"
                            }];
                            if ((data.base || null) != null && (data.base.is_team || 0) == 1) {
                                temp_nav_list.push({
                                    icon: "/static/images/plugins/signin/user-qrcode-icon.png",
                                    title: "签到码管理",
                                    url: "/pages/plugins/signin/user-qrcode/user-qrcode"
                                });
                            }
                            this.setData({
                                data_base: data.base || null,
                                nav_list: temp_nav_list,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './user.css';
</style>