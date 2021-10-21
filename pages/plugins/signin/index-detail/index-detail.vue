<template>
    <view>
        <view v-if="(data || null) != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 签到 -->
                <view class="coming-container tc pr border-radius-main spacing-mb">
                    <navigator v-if="(data_base.is_user_menu || 0) == 1" class="signin-user-menu-submit round pa" url="/pages/plugins/signin/user-signin/user-signin" hover-class="none">我的签到</navigator>
                    <view :class="'coming-submit circle auto ' + ((is_already_coming == 1) ? 'already-coming' : '')" @tap="coming_event">签到</view>
                    <block v-if="(user || null) == null">
                        <view class="cr-white margin-top-lg">登录签到获得积分奖励</view>
                    </block>
                    <block v-else>
                        <!-- 是否已签到 -->
                        <block v-if="(user_signin_data || null) != null && (user_signin_data.integral || 0) > 0">
                            <view class="cr-white margin-top-lg">今日已签到，获得{{user_signin_data.integral}}积分，共{{user_signin_data.total}}次</view>
                            <view class="coming-tips-msg margin-top-xs">请明日继续签到，更多积分奖励</view>
                        </block>
                        <block v-else>
                            <view class="cr-white margin-top-lg am-margin-top-sm">立即签到获得积分奖励</view>
                        </block>

                        <!-- 队长 -->
                        <block v-if="(team_signin_data || null) != null && user.id == data.user_id">
                            <view class="cr-white margin-top-lg">
                                <text>今日{{team_signin_data.day}}人签到，共{{team_signin_data.total}}人</text>
                                <navigator class="cr-blue dis-inline margin-left-sm" v-if="(data_base.is_team_show_coming_user || 0) == 1" :url="'/pages/plugins/signin/user-coming-list/user-coming-list?id=' + data.id" hover-class="none">详情 >></navigator>
                            </view>
                            <view class="coming-tips-msg margin-top-xs">分享获得更多奖励</view>
                        </block>
                    </block>

                    <!-- 按钮组 -->
                    <view class="submit-container pa">
                        <button v-if="(data_base.is_team || 0) == 1 && (user || null) != null && data.user_id != user.id" class="team-submit round" type="default" size="mini" @tap="team_event">组队</button>
                        <button v-if="(data_base.is_share || 0) == 1" class="share-submit round" type="default" size="mini" open-type="share">分享</button>
                    </view>
                </view>

                <!-- 广告图片 -->
                <view  v-if="(data.right_images || null) != null" class="spacing-mb">
                    <image class="wh-auto dis-block border-radius-main" :src="data.right_images" mode="widthFix" @tap="right_images_event"></image>
                </view>
                
                <!-- 公告信息 -->
                <view v-if="(data_base.signin_desc || null) != null && data_base.signin_desc.length > 0" class="spacing-mb">
                    <view class="notice-content">
                        <view v-for="(item, index) in data_base.signin_desc" :key="index" class="item">{{item}}</view>
                    </view>
                </view>

                <!-- 推荐商品 -->
                <view v-if="(data.goods_list || null) != null && data.goods_list.length > 0">
                    <view class="spacing-nav-title">
                        <text class="text-wrapper">推荐商品</text>
                        <navigator url="/pages/goods-search/goods-search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                    </view>
                    <view class="data-list oh">
                        <view v-for="(item, index) in data.goods_list" :key="index" class="item padding-main border-radius-main bg-white margin-bottom-main">
                            <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.id" hover-class="none">
                                <image :src="item.images" mode="aspectFit"></image>
                                <view class="margin-top-sm">
                                    <view class="multi-text">{{item.title}}</view>
                                    <view class="sales-price single-text margin-top-sm">{{currency_symbol}}{{item.min_price}}</view>
                                </view>
                            </navigator>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 签到成功提示信息 -->
            <view v-if="is_success_tips == 1" class="coming-tips-container am-text-center">
                <view class="coming-content tc">
                    <view class="icon-close-submit pa" @tap="coming_success_close_event">
                        <icon type="clear" size="20"></icon>
                    </view>
                    <image :src="static_url+'coming-success-icon.png'" mode="widthFix"></image>
                    <view class="coming-tips-content">
                        <text class="bg-white cr-red round padding-top-sm padding-bottom-sm padding-horizontal-main">获得 <text>{{coming_integral}}</text> 积分</text>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    var static_url = app.globalData.get_static_url('signin', true);
    export default {
        data() {
            return {
                static_url: static_url,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                user: null,
                data_base: null,
                data: null,
                team_signin_data: null,
                user_signin_data: null,
                is_already_coming: 0,
                is_success_tips: 0,
                coming_integral: 0,
                currency_symbol: app.globalData.data.currency_symbol
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            //params['id'] = 1;
            this.setData({
                params: params,
                user: app.globalData.get_user_cache_info()
            });
        },

        onShow() {
            // 获取数据
            this.get_data();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        // 自定义分享
        onShareAppMessage() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.data.seo_title || '签到 - ' + app.globalData.data.application_title,
                desc: this.data.seo_desc || '签到获得积分奖励 - ' + app.globalData.data.application_describe,
                path: '/pages/plugins/signin/index-detail/index-detail?id=' + this.data.id + '&referrer=' + user_id
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            return {
                title: this.data.seo_title || '签到 - ' + app.globalData.data.application_title,
                query: 'id=' + this.data.id + '&referrer=' + user_id,
                imageUrl: this.data.right_images || ''
            };
        },

        methods: {
            // 获取数据
            get_data() {
                var self = this;
                uni.request({
                    url: app.globalData.get_request_url("detail", "index", "signin"),
                    method: "POST",
                    data: {
                        id: this.params.id || 0
                    },
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                team_signin_data: data.team_signin_data || null,
                                user_signin_data: data.user_signin_data || null,
                                is_already_coming: (data.user_signin_data || null) != null && (data.user_signin_data.integral || 0) > 0 ? 1 : 0,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });
                        } else {
                            self.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 初始化
            init() {
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
                        return true;
                    }
                }
                return false;
            },

            // 签到
            coming_event(e) {
                if (this.is_already_coming != 1 && this.init()) {
                    var self = this;
                    uni.showLoading({
                        title: "处理中..."
                    });
                    uni.request({
                        url: app.globalData.get_request_url("coming", "index", "signin"),
                        method: "POST",
                        data: {
                            id: this.data.id
                        },
                        dataType: "json",
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    is_already_coming: 1,
                                    is_success_tips: 1,
                                    coming_integral: res.data.data
                                });
                                this.get_data();
                            } else {
                                if (app.globalData.is_login_check(res.data, self, 'team_request')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },

            // 签到成功提示关闭
            coming_success_close_event(e) {
                this.setData({
                    is_success_tips: 0
                });
            },

            // 组队事件
            team_event(e) {
                if (this.init()) {
                    uni.showLoading({
                        title: "处理中..."
                    });
                    uni.request({
                        url: app.globalData.get_request_url("team", "userqrcode", "signin"),
                        method: "POST",
                        data: {},
                        dataType: "json",
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                switch (res.data.data.status) {
                                    // 组队成功
                                    case 0:
                                        // 设置签到码id
                                        var temp_params = this.params;
                                        temp_params['id'] = res.data.data.qrcode_id;
                                        this.setData({
                                            params: temp_params
                                        });
                                        
                                        // 重新拉取数据
                                        this.get_data();
                                        break;
                                    // 需要填写联系人信息
                                    case 1:
                                        uni.navigateTo({
                                            url: '/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo?is_team=1'
                                        });
                                        break;
                                }
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'team_request')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            },

            // 图片事件
            right_images_event(e) {
                if ((this.data.right_images_url || null) != null) {
                    uni.navigateTo({
                        url: this.data.right_images_url
                    });
                }
            }
        }
    };
</script>
<style>
    @import './index-detail.css';
</style>