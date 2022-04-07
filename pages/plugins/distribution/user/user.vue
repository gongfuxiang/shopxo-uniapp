<template>
    <view>
        <view v-if="(data_base || null) != null">
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
            
            <!-- 上级用户 -->
            <view v-if="(superior || null) != null" class="superior bg-white border-radius-main margin-horizontal-main margin-bottom-main oh">
                <view class="superior-title cr-white fw-b va-m fl">上级用户</view>
                <view class="superior-content fl padding-main single-text">
                    <image :src="superior.avatar" mode="aspectFit" class="circle va-m"></image>
                    <text class="cr-gray va-m margin-left-sm">{{superior.user_name_view}}</text>
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
            <view v-if="(user_level || null) == null && (data_base.non_conformity_desc || null) != null && data_base.non_conformity_desc.length > 0" class="padding-horizontal-main padding-bottom-main">
                <view class="notice-content-blue">
                    <view v-for="(item, index) in data_base.non_conformity_desc" :key="index" class="item">{{item}}</view>
                </view>
            </view>
            
            <!-- 阶梯返佣提示 -->
            <view v-if="(profit_ladder || null) != null" class="padding-horizontal-main padding-bottom-main">
                <text class="cr-blue">{{profit_ladder.msg}}</text>
                <navigator url="/pages/plugins/distribution/poster/poster" hover-class="none" class="bg-green cr-white dis-inline-block round padding-top-xs padding-bottom-xs padding-horizontal-main">去推广</navigator>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                user_level: null,
                extraction: null,
                superior: null,
                profit_ladder: null,
                nav_list: [],
                avatar: app.globalData.data.default_user_head_src,
                nickname: "用户名"
            };
        },

        components: {
            componentNoData
        },
        props: {},

        onLoad(params) {},

        onShow() {
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
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
                            this.setData({
                                data_base: data.base || null,
                                user_level:  data.user_level || null,
                                extraction: data.extraction || null,
                                superior: data.superior || null,
                                profit_ladder: data.profit_ladder || null,
                                nav_list: data.nav_list || [],
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