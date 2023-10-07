<template>
    <view>
        <view v-if="(data_base || null) != null" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 10) + 'px;'">
            <!-- 头部背景 -->
            <image :src="membershiplevelvip_static_url + 'title-bg.png'" mode="widthFix" class="pa top-0 bg-img wh-auto" />
            <view class="pr z-i">
                <!-- 返回 -->
                <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
                <view v-if="is_realstore_top_nav_back == 1" class="nav-back padding-horizontal-main padding-top-sm round va-m">
                    <iconfont name="icon-tongyong-fanhui" size="40rpx" @tap="top_nav_left_back_event"></iconfont>
                </view>
                <!-- #endif -->
                <view class="padding-top-xxxl oh">
                    <!-- 头部 -->
                    <view class="head-box padding-main oh pr">
                        <view class="head-item flex-row align-c">
                            <image class="dis-block circle" @tap="preview_event" @error="user_avatar_error" :src="avatar" mode="widthFix"></image>
                            <view class="head-name padding-left-main">
                                <text class="text-size cr-black fw-b">{{ nickname }}</text>
                                <view class="head-base margin-top-sm">
                                    <!-- 已开通会员 -->
                                    <block v-if="(user_vip || null) != null">
                                        <!-- 付费购买 -->
                                        <block v-if="(user_vip.user_vip_model || null) == 'pay'">
                                            <view v-if="(user_vip || null) != null" class="single-text vip-badge round bg-black pr text-size-xss">
                                                <image v-if="(user_vip.icon || null) != null" class="level-icon pa" :src="user_vip.icon" mode="widthFix"></image>
                                                <text v-if="(user_vip.name || null) != null">{{ user_vip.level_name }}</text>
                                                <!-- 判断会员永久 -->
                                                <block v-if="(user_vip.is_permanent || 0) == 1">
                                                    <text class="padding-horizontal-xs">|</text>
                                                    <text>{{ user_vip.permanent_value }}{{ user_vip.permanent_unit }}</text>
                                                </block>
                                                <block v-else>
                                                    <view v-if="(user_vip.surplus_time_number || 0) !== 0">
                                                        <text class="padding-horizontal-xs">|</text>
                                                        <text>{{ user_vip.surplus_time_number }}{{ user_vip.surplus_time_unit }}</text>
                                                    </view>
                                                </block>
                                            </view>
                                        </block>
                                        <block v-else>
                                            <view v-if="(user_vip || null) != null" class="single-text vip-badge round bg-black pr text-size-xss">
                                                <image v-if="(user_vip.icon || null) != null" class="level-icon pa" :src="user_vip.icon" mode="widthFix"></image>
                                                <text v-if="(user_vip.name || null) != null">{{ user_vip.level_name }}</text>
                                            </view>
                                        </block>
                                    </block>
                                </view>
                            </view>
                        </view>
                        <!-- 已开通会员 -->
                        <view class="pa vip-btn flex-row align-c">
                            <navigator url="/pages/plugins/membershiplevelvip/member-code/member-code" hover-class="none">
                                <iconfont name="icon-wdhy-erweima" size="44rpx" color="#fff" class="padding-right-main pr bottom-md"></iconfont>
                            </navigator>
                            <block v-if="(user_vip || null) != null">
                                <!-- 判断会员永久 -->
                                <block v-if="(user_vip.is_permanent || 0) !== 1">
                                    <!-- 会员已过期或未开通 -->
                                    <block v-if="(user_vip.surplus_time_number || 0) == 0">
                                        <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
                                            <button v-if="(data_base.is_user_buy || null) == 1" class="submit-buy cr-white pr" type="default" size="mini" hover-class="none">
                                                开通会员
                                                <iconfont name="icon-qiandao-jiantou2" size="18rpx" class="pa"></iconfont>
                                            </button>
                                        </navigator>
                                    </block>
                                    <block v-else>
                                        <block v-if="(user_vip.is_supported_renew || null) == null || user_vip.is_supported_renew != 1">
                                            <block v-if="(data_base.is_supported_renew_old_order || null) == 1">
                                                <button size="mini" type="default" hover-class="none" class="submit-buy cr-white pr" @tap="uservip_renew_event" :disabled="submit_disabled_status">
                                                    续费会员
                                                    <iconfont name="icon-qiandao-jiantou2" size="18rpx" class="pa"></iconfont>
                                                </button>
                                            </block>
                                            <block v-else>
                                                <block v-if="(data_base || null) != null && (data_base.is_user_buy || 0) == 1">
                                                    <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
                                                        <button class="submit-buy cr-white pr" type="default" size="mini" hover-class="none">
                                                            连续开通
                                                            <iconfont name="icon-qiandao-jiantou2" size="18rpx" class="pa"></iconfont>
                                                        </button>
                                                    </navigator>
                                                </block>
                                            </block>
                                        </block>
                                    </block>
                                </block>
                            </block>
                            <!-- 未开通会员 -->
                            <block v-else>
                                <block v-if="(data_base || null) != null && (data_base.is_user_buy || 0) == 1">
                                    <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
                                        <button class="submit-buy cr-white pr" type="default" size="mini" hover-class="none">
                                            开通会员
                                            <iconfont name="icon-qiandao-jiantou2" size="18rpx" class="pa"></iconfont>
                                        </button>
                                    </navigator>
                                </block>
                            </block>
                        </view>
                    </view>
                </view>

                <!-- 会员中心通知 -->
                <view v-if="(user_vip || null) != null && (data_base.user_vip_center_notice || null) != null && data_base.user_vip_center_notice.length > 0" class="padding-horizontal-main">
                    <uni-notice-bar class="padding-0 margin-0" show-icon scrollable :text="data_base.user_vip_center_notice.join('')" background-color="transparent" color="#333" />
                </view>

                <view v-if="statistics_data !== null" class="padding-horizontal-main spacing-mt">
                    <!-- 推广客户 -->
                    <view class="promotion padding-sm border-radius-main bg-white pr spacing-mb">
                        <view class="title-left-border text-size fw-b padding-vertical-sm padding-horizontal-main margin-left-sm">推广客户</view>
                        <view class="flex-row jc-sa align-c">
                            <block v-for="(item, index) in statistics_data.user_total" :key="index">
                                <view class="flex-width-half">
                                    <view class="item border-radius-main margin-sm flex-row jc-c align-c">
                                        <image :src="item.icon" mode="widthFix" class="circle" />
                                        <view class="flex-1 flex-width padding-left-main">
                                            <view class="single-text margin-top-sm">
                                                <text class="num fw-b">{{ item.value }}</text>
                                                <text class="cr-grey-9 text-size-xs">人</text>
                                            </view>
                                            <view class="cr-base text-size-xs single-text">{{ item.name }}</view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>

                    <!-- 返利概况 -->
                    <view class="rebate profit-container padding-main border-radius-main bg-white">
                        <view class="title-left-border text-size fw-b padding-vertical-sm padding-horizontal-main margin-left-sm">返利概况</view>
                        <view class="oh tc flex-row jc-sa align-c">
                            <block v-for="(item, index) in statistics_data.user_profit" :key="index">
                                <view class="item padding-main flex-1" :class="index + 1 === statistics_data.user_profit.length ? '' : 'divider-r-f5'">
                                    <view class="single-text">
                                        <text>
                                            {{ item.first }}
                                        </text>
                                        <text class="fw-b price">
                                            {{ item.value }}
                                        </text>
                                    </view>
                                    <view class="cr-base text-size-xs margin-top-xs">{{ item.name }}</view>
                                </view>
                            </block>
                        </view>
                    </view>
                </view>

                <!-- 导航 -->
                <view v-if="nav_list.length > 0" class="nav oh flex-row flex-warp padding-sm">
                    <block v-for="(item, index) in nav_list" :key="index">
                        <view class="flex-width-half">
                            <view class="item bg-white border-radius-main margin-sm">
                                <navigator :url="item.url" hover-class="none" class="flex-row align-c">
                                    <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
                                    <view class="padding-left-main text-size fw-b flex-1 flex-width single-text">{{ item.title }}</view>
                                </navigator>
                            </view>
                        </view>
                    </block>
                </view>
                <!-- 会员中心通知 -->
                <view v-if="(data_base.not_opening_vip_desc || null) != null && data_base.not_opening_vip_desc.length > 0" class="padding-horizontal-main padding-bottom-lg">
                    <uni-notice-bar class="padding-0" show-icon scrollable :text="data_base.not_opening_vip_desc.join('')" background-color="transparent" color="#333" />
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
    import componentNoData from '../../../../components/no-data/no-data';
    var membershiplevelvip_static_url = app.globalData.get_static_url('membershiplevelvip', true) + 'app/';

    export default {
        data() {
            return {
                membershiplevelvip_static_url: membershiplevelvip_static_url,
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                user_vip: null,
                nav_list: [],
                avatar: app.globalData.data.default_user_head_src,
                nickname: '用户名',
                submit_disabled_status: false,
                // 推广客户，反力概况
                statistics_data: null,
            };
        },

        components: {
            componentNoData,
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
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '绑定手机号码',
                            confirmText: '确认',
                            cancelText: '暂不',
                            success: (result) => {
                                uni.stopPullDownRefresh();
                                if (result.confirm) {
                                    uni.navigateTo({
                                        url: '/pages/login/login?event_callback=init',
                                    });
                                }
                                this.set_user_base(user);
                            },
                        });
                    } else {
                        this.set_user_base(user);
                        this.get_data();
                    }
                }
            },
            // 设置用户基础信息
            set_user_base(user) {
                if ((user.avatar || null) != null) {
                    this.setData({ avatar: user.avatar });
                }
                if ((user.user_name_view || null) != null) {
                    this.setData({ nickname: user.user_name_view });
                }
            },
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'vip', 'membershiplevelvip'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                user_vip: data.user_vip || null,
                                nav_list: data.nav_list || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                                statistics_data: data.statistics_data || null,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
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
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 头像查看
            preview_event() {
                if (app.globalData.data.default_user_head_src != this.avatar) {
                    uni.previewImage({
                        current: this.avatar,
                        urls: [this.avatar],
                    });
                }
            },

            // 头像加载错误
            user_avatar_error(e) {
                this.setData({
                    avatar: app.globalData.data.default_user_head_src,
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
                    success: (result) => {
                        if (result.confirm) {
                            // 请求生成支付订单
                            self.setData({
                                submit_disabled_status: true,
                            });
                            uni.showLoading({
                                title: '处理中...',
                            });
                            uni.request({
                                url: app.globalData.get_request_url('renew', 'buy', 'membershiplevelvip'),
                                method: 'POST',
                                data: {},
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    self.setData({
                                        submit_disabled_status: false,
                                    });
                                    if (res.data.code == 0) {
                                        uni.setStorageSync(app.globalData.data.cache_page_pay_key, res.data.data.id);
                                        uni.redirectTo({
                                            url: '/pages/plugins/membershiplevelvip/order/order',
                                        });
                                    } else {
                                        if (app.globalData.is_login_check(res.data, self, 'uservip_renew_event')) {
                                            app.globalData.showToast(res.data.msg);
                                        }
                                    }
                                },
                                fail: () => {
                                    self.setData({
                                        submit_disabled_status: false,
                                    });
                                    uni.hideLoading();
                                    app.globalData.showToast('服务器请求出错');
                                },
                            });
                        }
                    },
                });
            },
            // 顶部返回操作
            top_nav_left_back_event(e) {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0],
                    });
                } else {
                    uni.navigateBack();
                }
            },
        },
    };
</script>
<style scoped>
    @import './user.css';
</style>
