<template>
    <view :class="theme_view">
        <!-- 是否有网络 -->
        <view v-if="network_type_value == 'none' && not_network_await_status == 0" class="network-type-tips wh-auto tc bs-bb padding-horizontal-main">
            <view class="cr-base text-size">{{$t('no-data.no-data.1u202v')}}</view>
            <view class="cr-grey margin-top-sm">{{$t('no-data.no-data.imw8f1')}}{{title}}{{$t('no-data.no-data.q87572')}}</view>
        </view>
        <view v-else>
            <!-- 1 加载中 -->
            <view v-if="propStatus == 1" class="no-data-box tc no-data-loading loading-animation">
                <text>{{title}}</text>
            </view>

            <!-- 2 处理错误 -->
            <view v-else-if="propStatus == 2" class="no-data-box tc">
                <image :src="static_dir + 'error.png'" mode="widthFix"></image>
                <view class="no-data-tips">{{propMsg || $t('form.form.bniyyt')}}</view>
                <view v-if="propBackBtn" class="margin-top-xxxl tc">
                    <button type="default" size="mini" class="bg-grey-e br-grey cr-base round" @tap="back_event">{{$t('common.return')}}</button>
                </view>
            </view>

            <!-- 0 默认没有数据 -->
            <view v-else-if="propStatus == 0" class="no-data-box tc">
                <image :src="propUrl ? propUrl : static_dir + 'empty.png'" mode="widthFix"></image>
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
                title: app.globalData.get_application_title(),
                network_type_value: '',
                not_network_await_status: 0,
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
            }
        },
    };
</script>
<style>
    .no-data-box {
        padding: 15% 0;
    }
    .no-data-box image {
        width: 160rpx;
        margin-bottom: 30rpx;
    }
    .no-data-box .no-data-tips {
        font-size: 24rpx;
        color: #999;
    }
    .no-data-loading text {
        color: #999;
    }
    .loading-animation,
    .network-type-tips {
        padding-top: 25%;
    }
    .loading-animation {
        background: #e7e7e7 -webkit-linear-gradient(left, #c6c6c6 0%, #c6c6c6 90%) no-repeat 0 0;
        background-size: 20% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 60rpx;
        font-weight: bold;
        -webkit-animation: loading-animation 2s linear infinite;
        animation: loading-animation 2s linear infinite;
    }
    @-webkit-keyframes loading-animation {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 100% 100%;
        }
    }
    @keyframes loading-animation {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 100% 100%;
        }
    }
</style>
