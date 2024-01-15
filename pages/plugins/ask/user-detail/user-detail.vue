<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status != 1 && Object.keys(detail_data.length !== 0)">
            <component-nav-back></component-nav-back>
            <view class="weixin-nav-padding-top">
                <view class="padding-top-xxxl">
                    <view class="pa top-0 left-0 right-0 nav-top pa-w">
                        <image mode="widthFix" :src="ask_static_url + 'nav-top.png'" class="wh-auto"></image>
                    </view>
                    <view class="padding-main pr margin-top-xxxl">
                        <view class="bg-white border-radius-main padding-main text-size">
                            <view class="fw-b text-size-lg spacing-mb">{{$t('user-detail.user-detail.o92ral')}}</view>
                            <view v-if="detail_data.user && detail_data.user.user_name_view" class="spacing-mb">
                                <view class="cr-grey-9">{{$t('user-detail.user-detail.k5867n')}}</view>
                                <view class="margin-top-xs">{{ detail_data.user.user_name_view }}</view>
                            </view>
                            <view v-if="detail_data.tel" class="spacing-mb">
                                <view class="cr-grey-9">{{$t('user-detail.user-detail.gfe703')}}</view>
                                <view class="margin-top-xs">{{ detail_data.tel }}</view>
                            </view>
                            <view v-if="detail_data.title" class="spacing-mb">
                                <view class="cr-grey-9">{{$t('user-detail.user-detail.uy6lrz')}}</view>
                                <view class="margin-top-xs">{{ detail_data.title }}</view>
                            </view>
                            <view v-if="detail_data.content" class="spacing-mb">
                                <view class="cr-grey-9">{{$t('user-detail.user-detail.7cufw6')}}</view>
                                <view class="margin-top-xs">{{ detail_data.content }}</view>
                            </view>
                            <view v-if="detail_data.reply" class="spacing-mb">
                                <view class="cr-grey-9">{{$t('user-detail.user-detail.u411r2')}}</view>
                                <view class="margin-top-xs">{{ detail_data.reply }}</view>
                            </view>
                            <view v-if="detail_data.reply_time_time" class="spacing-mb">
                                <view class="cr-grey-9">{{$t('user-detail.user-detail.teo6qd')}}</view>
                                <view class="margin-top-xs">{{ detail_data.reply_time_time }}</view>
                            </view>
                            <view v-if="detail_data.add_time_time" class="spacing-mb">
                                <view class="cr-grey-9">{{$t('user-order-detail.user-order-detail.h2c78h')}}</view>
                                <view class="margin-top-xs">{{ detail_data.add_time_time }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </block>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                ask_static_url: app.globalData.get_static_url('ask', true),
                detail_data: {},
                data_list_loding_status: 1,
                params: '',
            };
        },

        components: {
            componentNavBack,
            componentNoData,
        },
        props: {},

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            if (params) {
                this.setData({
                    params: params,
                });
            }
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {},

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            get_data() {
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('detail', 'ask', 'ask'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            this.setData({
                                detail_data: res.data.data || {},
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

            // 页面滚动监听
            onPageScroll(res) {
                uni.$emit('onPageScroll', res);
            },
        },
    };
</script>
<style>
    @import './user-detail.css';
</style>
