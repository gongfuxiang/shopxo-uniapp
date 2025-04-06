<template>
    <view :class="theme_view">
        <!-- 是否有网络 -->
        <view v-if="network_type_value == 'none' && not_network_await_status == 0" class="network-type-tips wh-auto tc bs-bb padding-horizontal-main">
            <view class="cr-base text-size">{{$t('no-data.no-data.1u202v')}}</view>
            <view class="cr-grey margin-top-sm">{{$t('no-data.no-data.imw8f1')}}{{title}}{{$t('no-data.no-data.q87572')}}</view>
            <view class="margin-top-lg tc">
                <button type="default" class="br-main bg-main cr-white round padding-horizontal-xxl" size="mini" @tap="open_setting_event">{{ $t('setup.setup.377uwg') }}</button>
            </view>
        </view>
        <view v-else>
            <!-- 1 加载中(0loog, 1名称) -->
            <view v-if="propStatus == 1 && network_type_value != 'none'" :class="'no-data-box tc no-data-loading '+(is_loading_use_skeleton == 1 && (propPage || null) != null ? 'skeleton' : '')">
                <block v-if="(is_loading_use_skeleton == 1 || propLoadingUseSkeleton) && (propPage || null) != null">
                    <!-- 是否展示头站位 -->
                    <view v-if="propIsHeader" class="skeleton-header"></view>
                    <!-- 首页 -->
                    <block v-if="propPage == 'home'">
                        <x-skeleton propType="banner"></x-skeleton>
                        <x-skeleton propType="menu"></x-skeleton>
                        <x-skeleton propType="waterfall"></x-skeleton>
                        <x-skeleton propType="list" propRowNumber="4"></x-skeleton>
                    </block>
                    <!-- 商品分类-整体内容 -->
                    <block v-else-if="propPage == 'goods-category'">
                        <x-skeleton propType="menu" propRowNumber="1"></x-skeleton>
                        <view class="goods-category-content flex-row jc-sb">
                            <view class="left">
                                <x-skeleton :propConfig="skeleton_goods_category_left_config"></x-skeleton>
                            </view>
                            <view class="right">
                                <x-skeleton propType="list" propRowNumber="7"></x-skeleton>
                            </view>
                        </view>
                    </block>
                    <!-- 商品分类-内容项 -->
                    <block v-else-if="propPage == 'goods-category-item'">
                        <x-skeleton propType="list" propRowNumber="6"></x-skeleton>
                    </block>
                    <!-- 购物车 -->
                    <block v-else-if="propPage == 'cart'">
                        <x-skeleton propType="list" propRowNumber="3"></x-skeleton>
                        <x-skeleton propType="waterfall" propRowNumber="4"></x-skeleton>
                    </block>
                    <!-- 商品详情 -->
                    <block v-else-if="propPage == 'goods'">
                        <x-skeleton propType="banner" propHeightNumber="600"></x-skeleton>
                        <x-skeleton propType="text"></x-skeleton>
                        <x-skeleton propType="info"></x-skeleton>
                        <x-skeleton propType="waterfall" propRowNumber="4"></x-skeleton>
                    </block>
                </block>
                <block v-else>
                    <view v-if="loading_content_type == 1" class="loading-title-animation">
                        <text class="title">{{title}}</text>
                    </view>
                    <view v-else class="loading-logo-content" :style="'margin-top: '+propLoadingLogoTop+';'">
                        <view class="loading-logo" :style="'background-image: url('+loading_logo+')'"></view>
                        <view class="loading-border" :style="'background-image: url('+loading_logo_border+')'"></view>
                    </view>
                </block>
            </view>

            <!-- 2 处理错误 -->
            <view v-else-if="propStatus == 2" class="no-data-box tc">
                <image class="image" :src="static_dir + 'error.png'" mode="widthFix"></image>
                <view class="no-data-tips">{{propMsg || $t('form.form.bniyyt')}}</view>
                <view v-if="propBackBtn" class="margin-top-xxxl tc">
                    <button type="default" size="mini" class="bg-grey-e br-grey cr-base round" @tap="back_event">{{$t('common.return')}}</button>
                </view>
            </view>

            <!-- 0 默认没有数据 -->
            <view v-else-if="propStatus == 0" class="no-data-box tc">
                <image class="image" :src="propUrl ? propUrl : static_dir + 'empty.png'" mode="widthFix"></image>
                <view class="no-data-tips">{{propMsg || $t('common.no_relevant_data_tips')}}</view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                static_dir: '/static/images/common/',
                is_loading_use_skeleton: app.globalData.data.is_loading_use_skeleton,
                loading_logo_border: app.globalData.data.static_url+'static/common/svg/loading-border.svg',
                loading_logo: app.globalData.get_application_logo_square() || app.globalData.data.static_url+'favicon.ico',
                loading_content_type: app.globalData.data.loading_content_type,
                title: app.globalData.get_application_title(),
                network_type_value: '',
                not_network_await_status: 0,

                // 骨架屏配置
                // 商品分类内容-左侧
                skeleton_goods_category_left_config: {
                	padding: '30rpx',
                	gridRows: 19,
                	gridColumns: 1,
                	gridRowsGap: '30rpx',
                	headShow: true,
                	headWidth: '200rpx',
                	headHeight: '60rpx',
                	headBorderRadius: '16rpx',
                	textShow: false,
                },
            };
        },
        components: {},
        props: {
            propStatus: {
                type: [Number, String],
                default: 0,
            },
            propMsg: {
                type: String,
                default: '',
            },
            propUrl: {
                type: String,
                default: '',
            },
            propBackBtn: {
                type: Boolean,
                default: true,
            },
            propNetworkTimeNum: {
                type: Number,
                default: 40,
            },
            propPage: {
                type: String,
                default: '',
            },
            propIsHeader: {
                type: Boolean,
                default: false,
            },
            propLoadingLogoTop: {
                type: String,
                default: '50%',
            },
            propLoadingUseSkeleton: {
                type: Boolean,
                default: false,
            }
        },
        // 页面被展示
        created: function () {
            self = this;
            uni.getNetworkType({
                success: function (res) {
                    // 当前网络
                    self.network_type_value = res.networkType;
                    // 无网络进入等待网络中
                    if(self.network_type_value == 'none') {
                        self.not_network_await_status = 1;
                    }

                    // 定时处理
                    self.countdown(self);
                }
            });
        },
        // #ifndef VUE2
        destroyed() {
            clearInterval(this.timer);
        },
        // #endif
        // #ifdef VUE3
        unmounted() {
            clearInterval(this.timer);
        },
        // #endif
        methods: {
            // 定时任务
            countdown(self) {
                // 销毁之前的任务
                clearInterval(self.timer);

                // 没有网络则启动定时任务
                if(self.network_type_value == 'none') {
                    var temp_num = self.propNetworkTimeNum;
                    self.timer = setInterval(function () {
                        // 读取网络状态
                        uni.getNetworkType({
                            success: function (res) {
                                self.network_type_value = res.networkType;
                                // 已经有网络了则结束定时任务、并正常继续等待走加载过程
                                if(self.network_type_value != 'none') {
                                    clearInterval(self.timer);
                                }
                            }
                        });

                        // 每次减1
                        temp_num--;

                        // 0则结束
                        if(temp_num <= 0) {
                            // 销毁任务
                            clearInterval(self.timer);
                            // 无需等待网络
                            self.not_network_await_status = 0;
                        }
                    }, 500);
                }
            },

            // 返回事件
            back_event(e) {
                app.globalData.page_back_prev_event();
            },

            // 打开权限管理中心
            open_setting_event() {
                app.globalData.open_setting_event();
            },
        },
    };
</script>
<style scoped>
    .no-data-box {
        padding: 15% 0;
    }
    .no-data-box .image {
        width: 160rpx;
        margin-bottom: 30rpx;
    }
    .no-data-box .no-data-tips {
        font-size: 24rpx;
        color: #999;
    }
    .no-data-loading .title {
        color: #999;
    }

    /**
     * 名称加载
     */
    .loading-title-animation,
    .network-type-tips {
        padding-top: 25%;
    }
    .loading-title-animation {
        background: #e7e7e7 -webkit-linear-gradient(left, #c6c6c6 0%, #c6c6c6 90%) no-repeat 0 0;
        background-size: 20% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 60rpx;
        font-weight: bold;
        -webkit-animation: loading-text-animation 2s linear infinite;
        animation: loading-text-animation 2s linear infinite;
    }
    @-webkit-keyframes loading-text-animation {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 100% 100%;
        }
    }
    @keyframes loading-text-animation {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 100% 100%;
        }
    }

    /**
     * logo加载
     */
    .loading-logo-content {
        position: absolute;
        width: 140rpx;
        height: 140rpx;
        left: calc(50% - 70rpx);
        top: 0;
        border-radius: 50%;
        overflow: hidden;
        background: #fff;
        margin-top: 50%;
    }
    .loading-logo-content .loading-logo {
        content: '';
        display: block;
        position: absolute;
        left: 30rpx;
        top: 30rpx;
        width: 80rpx;
        height: 80rpx;
        opacity: 0.8;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
    }
    .loading-logo-content .loading-border {
        content: '';
        display: block;
        position: absolute;
        width: 168rpx;
        height: 168rpx;
        left: -14rpx;
        top: -14rpx;
        opacity: 0.8;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
    }
    
    /**
     * 骨架屏
     */
    .skeleton-header {
        /* #ifndef H5 || APP */
        padding-top: var(--status-bar-height);
        padding-bottom: 55px;
        /* #endif */
    }
    .no-data-box.skeleton {
        padding: 0;
    }
    .no-data-loading .goods-category-content > .left {
        width: 30%;
    }
    .no-data-loading .goods-category-content > .right {
        width: 70%;
    }
</style>
