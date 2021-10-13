<template>
    <view>
        <view class="padding-horizontal-main padding-top-main oh">
            <!-- 头部 -->
            <view class="head-box padding-main border-radius-main oh pr spacing-mb">
                <view class="head-item tc fl">
                    <view class="avatar bg-white circle">
                        <image class="dis-block circle" @tap="preview_event" @error="user_avatar_error" :src="avatar" mode="widthFix"></image>
                    </view>
                    <text class="margin-top-sm dis-block cr-white">{{nickname}}</text>
                </view>
                <view class="head-base fr">
                    <view v-if="(user_level || null) != null" class="single-text tr">
                        <image v-if="(user_level.images_url || null) != null" class="level-icon va-m margin-right-sm" :src="user_level.images_url" mode="widthFix"></image>
                        <text v-if="(user_level.name || null) != null" class="level-name text-size-sm fw-b va-m">{{user_level.name}}</text>
                    </view>
                    <block v-if="(data_base || null) != null && (data_base.is_enable_self_extraction || 0) == 1">
                        <navigator url="/pages/plugins/distribution/extraction/extraction" hover-class="none">
                            <button class="head-base-submit pa bg-white cr-main round text-size-sm" size="mini" type="default" hover-class="none">{{(extraction || null) == null ? '申请' : ''}}取货点</button>
                        </navigator>
                    </block>
                </view>
            </view>
        </view>
        
        <!-- 会员中心通知 -->
        <view v-if="(user_level || null) != null && (data_base.user_center_notice || null) != null && data_base.user_center_notice.length > 0" class="padding-horizontal-main padding-bottom-main">
            <view class="notice-content">
                <view v-for="(item, index) in data_base.user_center_notice" :key="index" class="item">{{item}}</view>
            </view>
        </view>

        <!-- 导航 -->
        <view v-if="nav_list.length > 0" class="nav oh">
            <block v-for="(item, index) in nav_list" :key="index">
                <view class="item fl tc padding-main border-radius-main bg-white">
                    <navigator :url="item.url" hover-class="none">
                        <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
                        <view class="tc cr-base margin-top-lg">{{item.title}}</view>
                    </navigator>
                </view>
            </block>
        </view>

        <!-- 不符合分销条件描述 -->
        <view v-if="(data_base.non_conformity_desc || null) != null && data_base.non_conformity_desc.length > 0" class="padding-horizontal-main padding-bottom-main">
            <view class="notice-content-blue">
                <view v-for="(item, index) in data_base.non_conformity_desc" :key="index" class="item">{{item}}</view>
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
                user_level: null,
                extraction: null,
                avatar: app.globalData.data.default_user_head_src,
                nickname: "用户名",
                // 导航
                nav_list: []
            };
        },

        components: {},
        props: {},

        onLoad(params) {
            this.setData({
                nav_list: this.nav_list_data()
            });
        },

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
                                this.set_user_base(user);
                            }
                        });
                    } else {
                        this.set_user_base(user);
                        this.get_data();
                    }
                }
            },
            
            // 设置用户基础信息
            set_user_base(user) {
                if((user.avatar || null) != null) {
                    this.setData({"avatar": user.avatar});
                }
                if((user.user_name_view || null) != null) {
                    this.setData({"nickname": user.user_name_view});
                }
            },

            // 导航数据
            nav_list_data() {
                return [{
                    icon: "/static/images/plugins/distribution/user-center-order-icon.png",
                    title: "分销订单",
                    url: "/pages/plugins/distribution/order/order"
                }, {
                    icon: "/static/images/plugins/distribution/user-center-profit-icon.png",
                    title: "收益明细",
                    url: "/pages/plugins/distribution/profit/profit"
                }, {
                    icon: "/static/images/plugins/distribution/user-center-team-icon.png",
                    title: "我的团队",
                    url: "/pages/plugins/distribution/team/team"
                }, {
                    icon: "/static/images/plugins/distribution/user-center-poster-icon.png",
                    title: "推广返利",
                    url: "/pages/plugins/distribution/poster/poster"
                }, {
                    icon: "/static/images/plugins/distribution/user-center-statistics-icon.png",
                    title: "数据统计",
                    url: "/pages/plugins/distribution/statistics/statistics"
                }];
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "user", "distribution"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_base = data.base || null;
                            var user_level = data.user_level || null;
                            this.setData({
                                data_base: data_base,
                                user_level: user_level,
                                extraction: data.extraction || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false
                            });
                            
                            // 导航
                            var temp_data_list = this.nav_list_data();
                            
                            // 等级介绍
                            if (data_base != null && (data_base.is_show_introduce || 0) == 1) {
                                temp_data_list.push({
                                    icon: "/static/images/plugins/distribution/user-center-introduce-icon.png",
                                    title: "等级介绍",
                                    url: "/pages/plugins/distribution/introduce/introduce"
                                });
                            }
                            this.setData({
                                nav_list: temp_data_list
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
            },

            // 头像查看
            preview_event() {
                if (app.globalData.data.default_user_head_src != this.avatar) {
                    uni.previewImage({
                        current: this.avatar,
                        urls: [this.avatar]
                    });
                }
            },

            // 头像加载错误
            user_avatar_error(e) {
                this.setData({
                    avatar: app.globalData.data.default_user_head_src
                });
            }
        }
    };
</script>
<style>
    @import './user.css';
</style>