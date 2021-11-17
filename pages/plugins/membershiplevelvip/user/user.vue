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
                        <block v-if="(user_vip || null) != null">
                            <block v-if="(user_vip.user_vip_model || null) == 'pay'">
                                <view v-if="(user_vip || null) != null" class="single-text tr margin-bottom-sm">
                                    <image v-if="(user_vip.icon || null) != null" class="level-icon va-m margin-right-sm" :src="user_vip.icon" mode="widthFix"></image>
                                    <text v-if="(user_vip.name || null) != null" class="level-name text-size-sm fw-b va-m">{{user_vip.level_name}}</text>
                                </view>
                                <view class="tr">
                                    <block v-if="(user_vip.is_permanent || 0) == 1">
                                        <text class="cr-grey">有效期</text>
                                        <text class="cr-white fw-b margin-left-xs margin-right-xs">{{user_vip.permanent_value}}</text>
                                        <text class="cr-grey">{{user_vip.permanent_unit}}</text>
                                    </block>
                                    <block v-else>
                                        <block v-if="(user_vip.surplus_time_number || 0) == 0">
                                            <view class="cr-grey">会员已过期或未开通</view>
                                            <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
                                                <button v-if="(data_base.is_user_buy || null) == 1" class="submit-buy round pa" type="default" size="mini" hover-class="none">开通会员</button>
                                            </navigator>
                                        </block>
                                        <block v-else>
                                            <text class="cr-grey">有效期</text>
                                            <text class="cr-white fw-b margin-left-xs margin-right-xs">{{user_vip.surplus_time_number}}</text>
                                            <text class="cr-grey">{{user_vip.surplus_time_unit}}</text>
                                            <block v-if="(user_vip.is_supported_renew || null) == null || user_vip.is_supported_renew != 1">
                                                <block v-if="(plugins_base.is_supported_renew_old_order || null) == 1">
                                                    <button size="mini" type="default" hover-class="none" class="renew-buy" @tap="uservip_renew_event" :disabled="submit_disabled_status">续费会员</button>
                                                </block>
                                                <block v-else>
                                                    <block v-if="(data_base || null) != null && (data_base.is_user_buy || 0) == 1">
                                                        <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
                                                            <button class="submit-buy round pa" type="default" size="mini" hover-class="none">连续开通</button>
                                                        </navigator>
                                                    </block>
                                                </block>
                                            </block>
                                        </block>
                                    </block>
                                </view>
                            </block>
                            <block v-else>
                                <view v-if="(user_vip || null) != null" class="single-text tr">
                                    <image v-if="(user_vip.icon || null) != null" class="level-icon va-m margin-right-sm" :src="user_vip.icon" mode="widthFix"></image>
                                    <text v-if="(user_vip.name || null) != null" class="level-name text-size-sm fw-b va-m">{{user_vip.level_name}}</text>
                                </view>
                            </block>
                        </block>
                        <block v-else>
                            <block v-if="(data_base || null) != null && (data_base.is_user_buy || 0) == 1">
                                <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
                                    <button class="submit-buy round pa" type="default" size="mini" hover-class="none">开通会员</button>
                                </navigator>
                            </block>
                        </block>
                    </view>
                </view>
            </view>

            <!-- 会员中心通知 -->
            <view v-if="(user_vip || null) != null && (data_base.user_vip_center_notice || null) != null && data_base.user_vip_center_notice.length > 0" class="padding-horizontal-main padding-bottom-main">
                <view class="notice-content">
                    <view v-for="(item, index) in data_base.user_vip_center_notice" :key="index" class="item">{{item}}</view>
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
            
            <!-- 会员中心通知 -->
            <view v-if="(data_base.not_opening_vip_desc || null) != null && data_base.not_opening_vip_desc.length > 0" class="padding-horizontal-main padding-bottom-main">
                <view class="notice-content-blue">
                    <view v-for="(item, index) in data_base.not_opening_vip_desc" :key="index" class="item">{{item}}</view>
                </view>
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
                user_vip: null,
                nav_list: [],
                avatar: app.globalData.data.default_user_head_src,
                nickname: "用户名",
                submit_disabled_status: false
            };
        },

        components: {
            componentNoData
        },
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
                    url: app.globalData.get_request_url("index", "vip", "membershiplevelvip"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                user_vip: data.user_vip || null,
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
            },

            // 连续开通会员事件
            uservip_renew_event(e) {
                var self = this;
                uni.showModal({
                    title: '温馨提示',
                    content: '按照原时长和费用续费，确定继续吗？',
                    confirmText: '确认',
                    cancelText: '暂不',
                    success: result => {
                        if (result.confirm) {
                            // 请求生成支付订单
                            self.setData({
                                submit_disabled_status: true
                            });
                            uni.showLoading({
                                title: "处理中..."
                            });
                            uni.request({
                                url: app.globalData.get_request_url("renew", "buy", "membershiplevelvip"),
                                method: "POST",
                                data: {},
                                dataType: "json",
                                success: res => {
                                    uni.hideLoading();
                                    self.setData({
                                        submit_disabled_status: false
                                    });
                                    if (res.data.code == 0) {
                                        // 进入以后会员中心并发起支付
                                        uni.redirectTo({
                                            url: '/pages/plugins/membershiplevelvip/order/order?is_pay=1&order_id=' + res.data.data.id
                                        });
                                    } else {
                                        if (app.globalData.is_login_check(res.data, self, 'uservip_renew_event')) {
                                            app.globalData.showToast(res.data.msg);
                                        }
                                    }
                                },
                                fail: () => {
                                    self.setData({
                                        submit_disabled_status: false
                                    });
                                    uni.hideLoading();
                                    app.globalData.showToast("服务器请求出错");
                                }
                            });
                        }
                    }
                });
            }
        }
    };
</script>
<style>
    @import './user.css';
</style>