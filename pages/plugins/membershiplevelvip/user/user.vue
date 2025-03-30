<template>
    <view :class="theme_view">
        <component-nav-back propColor="#333"></component-nav-back>
        <view v-if="(data_base || null) != null" class="weixin-nav-padding-top">
            <view class="padding-top-xxxl">
                <!-- 头部背景 -->
                <image :src="default_images_data.default_center_head_bg_images_app || (membershiplevelvip_static_url + 'head-bg.png')" mode="widthFix" class="pa top-0 bg-img wh-auto" />
                <view class="pr padding-top-main">
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
                                                        <block v-if="(user_vip.surplus_time_number || 0) !== 0">
                                                            <text class="padding-horizontal-xs">|</text>
                                                            <text>{{ user_vip.surplus_time_number }}{{ user_vip.surplus_time_unit }}</text>
                                                        </block>
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
                                <view v-if="(data_base.is_enable_member_code || 0) == 1" class="dis-inline-block cp pr padding-right-main" data-value="/pages/plugins/membershiplevelvip/member-code/member-code" @tap="url_event">
                                    <iconfont name="icon-qrcode" size="44rpx" color="#fff"></iconfont>
                                </view>
                                <block v-if="(user_vip || null) != null">
                                    <!-- 判断会员永久 -->
                                    <block v-if="(user_vip.is_permanent || 0) !== 1">
                                        <!-- 会员已过期或未开通 -->
                                        <block v-if="(user_vip.surplus_time_number || 0) == 0">
                                            <button v-if="(data_base.is_user_buy || null) == 1" data-value="/pages/plugins/membershiplevelvip/buy/buy" @tap="url_event" class="submit-buy cr-white pr" type="default" size="mini" hover-class="none">
                                                <text>{{$t('user.user.n4orgk')}}</text>
                                                <view class="dis-inline-block margin-left-sm"><iconfont name="icon-arrow-right" size="18rpx"></iconfont></view>
                                            </button>
                                        </block>
                                        <block v-else>
                                            <block v-if="(user_vip.is_supported_renew || null) == null || user_vip.is_supported_renew != 1">
                                                <block v-if="(data_base.is_supported_renew_old_order || null) == 1">
                                                    <button size="mini" type="default" hover-class="none" class="submit-buy cr-white pr" @tap="uservip_renew_event" :disabled="submit_disabled_status">{{$t('user.user.k614v7')}}<iconfont name="icon-arrow-right" size="18rpx"></iconfont>
                                                    </button>
                                                </block>
                                                <block v-else>
                                                    <block v-if="(data_base || null) != null && (data_base.is_user_buy || 0) == 1">
                                                        <button data-value="/pages/plugins/membershiplevelvip/buy/buy" @tap="url_event" class="submit-buy cr-white pr" type="default" size="mini" hover-class="none">{{$t('user.user.65cc6z')}}<iconfont name="icon-arrow-right" size="18rpx" propClass="pa right-icon"></iconfont></button>
                                                    </block>
                                                </block>
                                            </block>
                                        </block>
                                    </block>
                                </block>
                                <!-- 未开通会员 -->
                                <block v-else>
                                    <block v-if="(data_base || null) != null && (data_base.is_user_buy || 0) == 1">
                                        <button data-value="/pages/plugins/membershiplevelvip/buy/buy" @tap="url_event" class="submit-buy cr-white pr" type="default" size="mini" hover-class="none">
                                            <text>{{$t('user.user.n4orgk')}}</text>
                                            <view class="dis-inline-block margin-left-sm"><iconfont name="icon-arrow-right" size="18rpx" propClass="pa right-icon"></iconfont></view>
                                        </button>
                                    </block>
                                </block>
                            </view>
                        </view>
                    </view>

                    <!-- 会员中心通知 -->
                    <view v-if="(user_vip || null) != null && (data_base.user_vip_center_notice || null) != null && data_base.user_vip_center_notice.length > 0" class="padding-horizontal-main">
                        <uni-notice-bar class="padding-0 margin-0" show-icon scrollable :text="data_base.user_vip_center_notice.join('')" background-color="transparent" color="#666" />
                    </view>

                    <view v-if="statistics_data !== null" class="padding-horizontal-main spacing-mt">
                        <!-- 推广客户 -->
                        <view class="promotion padding-sm border-radius-main bg-white pr spacing-mb">
                            <view class="title-left-border text-size fw-b padding-vertical-sm padding-horizontal-main margin-left-sm">{{$t('user.user.76dcx6')}}</view>
                            <view class="flex-row jc-sa align-c">
                                <block v-for="(item, index) in statistics_data.user_total" :key="index">
                                    <view class="flex-width-half">
                                        <view class="item border-radius-main margin-sm flex-row jc-c align-c">
                                            <image :src="item.icon" mode="widthFix" class="circle" />
                                            <view class="flex-1 flex-width padding-left-main">
                                                <view class="single-text margin-top-sm">
                                                    <text class="num fw-b">{{ item.value }}</text>
                                                    <text class="cr-grey-9 text-size-xs">{{$t('user.user.rjye50')}}</text>
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
                            <view class="title-left-border text-size fw-b padding-vertical-sm padding-horizontal-main margin-left-sm">{{$t('user.user.981200')}}</view>
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
                    <view v-if="nav_list.length > 0" class="nav oh flex-row flex-wrap padding-sm">
                        <block v-for="(item, index) in nav_list" :key="index">
                            <view class="flex-width-half">
                                <view class="item bg-white border-radius-main margin-sm">
                                    <view :data-value="item.url" @tap="url_event" class="flex-row align-c cp">
                                        <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
                                        <view class="padding-left-main text-size fw-b flex-1 flex-width single-text">{{ item.title }}</view>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                    <!-- 会员中心通知 -->
                    <view v-if="(data_base.not_opening_vip_desc || null) != null && data_base.not_opening_vip_desc.length > 0" class="padding-horizontal-main padding-bottom-lg">
                        <uni-notice-bar class="padding-0" show-icon scrollable :text="data_base.not_opening_vip_desc.join('')" background-color="transparent" color="#666" />
                    </view>
                </view>
            </view>
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
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    var membershiplevelvip_static_url = app.globalData.get_static_url('membershiplevelvip', true) + 'app/center/';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                membershiplevelvip_static_url: membershiplevelvip_static_url,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                user_vip: null,
                nav_list: [],
                avatar: app.globalData.data.default_user_head_src,
                nickname: this.$t('login.login.6yfr9g'),
                submit_disabled_status: false,
                default_images_data: {},
                // 推广客户，反力概况
                statistics_data: null,
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
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
                    this.get_data();
                    this.set_user_base(user);
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
                                default_images_data: data.default_images_data || {},
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
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
                    title: this.$t('common.warm_tips'),
                    content: this.$t('user.user.95s1ez'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.not_yet'),
                    success: (result) => {
                        if (result.confirm) {
                            // 请求生成支付订单
                            self.setData({
                                submit_disabled_status: true,
                            });
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
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
                                        app.globalData.url_open('/pages/plugins/membershiplevelvip/order/order', true);
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
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 页面滚动监听
            onPageScroll(res) {
                uni.$emit('onPageScroll', res);
            },
        },
    };
</script>
<style scoped>
    @import './user.css';
</style>
