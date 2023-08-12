<template>
    <view>
        <view v-if="(data_base || null) != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 顶部 -->
                <view class="points-user tc pr border-radius-main spacing-mb">
                    <navigator class="points-user-menu-submit round pa" url="/pages/user-integral/user-integral" hover-class="none">我的积分</navigator>
                    <block v-if="(user || null) == null">
                        <button class="login-submit round bg-white" type="default" size="mini" @tap="login_event">立即登录</button>
                        <view class="desc margin-top-xxl">获知会员积分详情</view>
                    </block>
                    <block v-else>
                        <image class="avatar dis-block circle" @tap="preview_event" :src="user.avatar || avatar_default" mode="widthFix"></image>
                        <view class="cr-white margin-top-sm">{{user.user_name_view}}</view>
                        <view class="desc margin-top-lg">当前可用 {{user_integral.integral || 0}} 积分</view>
                    </block>

                    <!-- 分享 -->
                    <button class="share-submit round pa" type="default" size="mini" open-type="share">分享</button>
                </view>

                <!-- 广告图片 -->
                <view  v-if="(data_base.right_images || null) != null" class="spacing-mb">
                    <image class="wh-auto dis-block border-radius-main" :src="data_base.right_images" mode="widthFix" :data-value="data_base.right_images_url || ''" @tap="url_event"></image>
                </view>

                <!-- 公告信息 -->
                <view v-if="(data_base.points_desc || null) != null && data_base.points_desc.length > 0" class="spacing-mb">
                    <view class="notice-content">
                        <view v-for="(item, index) in data_base.points_desc" :key="index" class="item">{{item}}</view>
                    </view>
                </view>

                <!-- 商品兑换 -->
                <view v-if="(data_base.goods_exchange_data || null) != null && data_base.goods_exchange_data.length > 0">
                    <view class="spacing-nav-title">
                        <text class="text-wrapper">商品兑换</text>
                        <navigator url="/pages/goods-search/goods-search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                    </view>
                    <view class="data-list oh">
                        <view v-for="(item, index) in data_base.goods_exchange_data" :key="index" class="item padding-bottom-sm border-radius-main bg-white margin-bottom-main">
                            <navigator :url="item.goods_url" hover-class="none">
                                <image class="goods-img dis-block" :src="item.images" mode="aspectFit"></image>
                                <view class="padding-horizontal-main margin-top-sm">
                                    <view class="multi-text">{{item.title}}</view>
                                    <view class="single-text original-price margin-top-sm">{{currency_symbol}}{{item.price}}</view>
                                    <view class="single-text">
                                        <text class="sales-price text-size">{{item.integral}}</text>
                                        <text class="cr-grey margin-left-xs">积分</text>
                                    </view>
                                </view>
                            </navigator>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.data.currency_symbol,
                params: null,
                user: null,
                data_base: null,
                user_integral: null,
                avatar_default: app.globalData.data.default_user_head_src,
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params,
                user: app.globalData.get_user_cache_info()
            });
        },

        onShow() {
            // 初始化配置
            this.init_config();

            // 获取数据
            this.get_data();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "points"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                user_integral: data.user_integral || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });

                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/points/index/index',
                                        img: this.data_base.right_images
                                    }
                                });

                                // 导航名称
                                if((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 立即登录
            login_event() {
                var user = app.globalData.get_user_info(this, "login_event");
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
                    }
                }
                this.setData({
                    user: user || null
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 头像查看
            preview_event() {
                if (app.globalData.data.default_user_head_src != this.user.avatar) {
                    uni.previewImage({
                        current: this.user.avatar,
                        urls: [this.user.avatar]
                    });
                }
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>