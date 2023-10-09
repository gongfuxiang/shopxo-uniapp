<template>
    <view class="pr" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 10) + 'px;'">
        <view class="pa top-0 left-0 right-0 nav-top">
            <image mode="widthFix" :src="answers_static_url + 'nav-top.png'" class="wh-auto"></image>
        </view>
        <!-- 返回 -->
        <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
        <view v-if="is_realstore_top_nav_back == 1" class="nav-back padding-left-main round va-m cr-white pr z-i">
            <iconfont name="icon-tongyong-fanhui" size="40rpx" @tap="top_nav_left_back_event"></iconfont>
        </view>
        <!-- #endif -->
        <view v-if="Object.keys(detail_data.length !== 0)" class="padding-main pr z-i margin-top-main">
            <view class="bg-white border-radius-main padding-main text-size">
                <view class="fw-b text-size-lg spacing-mb">提问详情</view>
                <view v-if="detail_data.user && detail_data.user.user_name_view" class="spacing-mb">
                    <view class="cr-grey-9">联系人</view>
                    <view class="margin-top-xs">{{ detail_data.user.user_name_view }}</view>
                </view>
                <view v-if="detail_data.tel" class="spacing-mb">
                    <view class="cr-grey-9">联系电话</view>
                    <view class="margin-top-xs">{{ detail_data.tel }}</view>
                </view>
                <view v-if="detail_data.title" class="spacing-mb">
                    <view class="cr-grey-9">标题</view>
                    <view class="margin-top-xs">{{ detail_data.title }}</view>
                </view>
                <view v-if="detail_data.content" class="spacing-mb">
                    <view class="cr-grey-9">内容</view>
                    <view class="margin-top-xs">{{ detail_data.content }}</view>
                </view>
                <view v-if="detail_data.reply" class="spacing-mb">
                    <view class="cr-grey-9">回复内容</view>
                    <view class="margin-top-xs">{{ detail_data.reply }}</view>
                </view>
                <view v-if="detail_data.reply_time_time" class="spacing-mb">
                    <view class="cr-grey-9">回复时间</view>
                    <view class="margin-top-xs">{{ detail_data.reply_time_time }}</view>
                </view>
                <view v-if="detail_data.add_time_time" class="spacing-mb">
                    <view class="cr-grey-9">创建时间</view>
                    <view class="margin-top-xs">{{ detail_data.add_time_time }}</view>
                </view>
            </view>
        </view>
        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status"></component-no-data>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';

    export default {
        data() {
            return {
                answers_static_url: app.globalData.get_static_url('answers', true),
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                detail_data: {},
                data_list_loding_status: 1,
                params: '',
            };
        },

        components: {
            componentNoData,
        },
        props: {},

        onLoad(params) {
            if (params) {
                this.setData({
                    params: params.id,
                });
            }
        },

        onShow() {
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
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
                    url: app.globalData.get_request_url('detail', 'answer'),
                    method: 'POST',
                    data: {
                        id: this.params,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        console.log(res.data.data);
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
                        app.globalData.showToast('服务器请求出错');
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
<style>
    @import './user-answers-detail.css';
</style>
