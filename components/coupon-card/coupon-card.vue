<template>
    <view :class="theme_view">
        <view class="padding-bottom padding-horizontal-main">
            <view class="coupon-card oh pr flex-row">
                <view class="card-left flex-col jc-sa align-c" :class="propStatusType > 3 ? 'failure cr-grey-9' : 'cr-white'">
                    <view class="price">
                        <text v-if="propData.type == '0'" class="symbol text-size">{{ currency_symbol }}</text>
                        <text class="num text-size-xxl">{{ propData.discount_value }}</text>
                        <text v-if="propData.type !== '0'" class="unit text-size-md">{{ propData.type_unit }}</text>
                    </view>
                    <text v-if="(propData.desc || null) != null" class="desc text-size-xs single-text">{{ propData.desc }}</text>
                </view>
                <view class="card-right flex-1 flex-width flex-row jc-sb align-c" :class="propStatusType > 3 ? 'failure cr-grey-9' : ''">
                    <view class="card-info flex-1 flex-width padding-right-main" :class="propStatusType > 3 ? 'failure cr-grey-9' : 'cr-black'">
                        <view class="title text-size-lg single-text" :class="propData.time_start">{{ propData.use_limit_type_name }}</view>
                        <view v-if="propStartTime && propEndTime" class="date text-size-xs cr-grey-9 single-text padding-top-sm">{{ propStartTime }}-{{ propEndTime }}</view>
                        <view v-if="propIsProgress && propData.process_data" class="progress padding-top-sm flex-row align-c">
                            <block v-if="propData.process_data.type == 0">
                                <text class="text-size-xs cr-grey-9"> {{ propData.process_data.msg }} </text>
                            </block>
                            <block v-else>
                                <progress class="flex-1" :percent="propData.process_data.value" stroke-width="6" activeColor="#FF7004" backgroundColor="#fff" border-radius="3" />
                                <view class="percent text-size-xss cr-grey-9 padding-left-main"> {{ propData.process_data.msg }} </view>
                            </block>
                        </view>
                        <view v-if="propData.expire_tips" class="padding-top-sm text-size-xs cr-red">{{ propData.expire_tips }}</view>
                    </view>
                    <view class="card-type">
                        <!-- 按钮状态 0-领取，1-已领取，2-已抢完，3-去使用,4-已使用，5-已过期 -->
                        <view v-if="propStatusType == 0" class="card-btn dis-inline-block cr-white" @tap="receive">{{ propStatusOperableName || this.$t('coupon-card.coupon-card.m9316y') }}</view>
                        <view v-else-if="propStatusType == 1" class="card-btn dis-inline-block cr-red br-red received">{{ propStatusOperableName || this.$t('coupon-card.coupon-card.m9316y') }}</view>
                        <view v-else-if="propStatusType == 2" class="card-btn dis-inline-block cr-white robbed">{{ propStatusOperableName || this.$t('coupon-card.coupon-card.m9316y') }}</view>
                        <view v-else-if="propStatusType == 3" :data-value="home_page_url" @tap="url_event" class="cp">
                            <view class="card-btn dis-inline-block cr-white">
                                {{ propStatusOperableName || this.$t('coupon-card.coupon-card.m9316y') }}
                            </view>
                        </view>
                        <view v-else-if="propStatusType == 4" class="card-image pa top-0 right-0">
                            <image class="image" :src="coupon_static_url + 'coupon-used.png'" mode="scaleToFill"></image>
                        </view>
                        <view v-else-if="propStatusType == 5" class="card-image pa top-0 right-0">
                            <image class="image" :src="coupon_static_url + 'coupon-expire.png'" mode="scaleToFill"></image>
                        </view>
                        <view v-else @tap="receive">{{$t('coupon-card.coupon-card.j318xx')}}</view>
                    </view>
                </view>
                <view class="card-circle-top" :style="{ background: `${propBg}` }"></view>
                <view class="card-circle-bottom" :style="{ background: `${propBg}` }"></view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    var coupon_static_url = app.globalData.get_static_url('coupon', true);
    var tabbar_pages = app.globalData.app_tabbar_pages();
    export default {
        name: 'coupon-card',
        props: {
            propData: {
                type: Object,
                default: () => {
                    return {
                        // id: "0",
                        // // 领取数量
                        // already_send_count: 0,
                        // // 总数
                        // process_data: {
                        //     type: 1, // 0 无限制
                        //     value: 20,
                        //     msg: "已领20%",
                        // },
                        // // 日期有效日期 // 2023.08.30-2023.09.1
                        // date: "",
                        // expire_tips: "",
                        // time_start: "",
                        // time_end: "",
                    };
                },
            },
            // 监听
            propRandom: {
                type: Number,
                default: 0,
            },
            // 半圆背景
            propBg: {
                type: String,
                default: '#fff',
            },
            // 进度条
            propIsProgress: {
                type: Boolean,
                default: false,
            },
            // 是否可重复领取
            propRepeatedClaim: {
                type: Boolean,
                default: false,
            },
            // 是否可点击
            propDisabled: {
                type: Boolean,
                default: false,
            },
            // 下标
            propIndex: {
                type: [Number,String],
                default: 0,
            },
            // 按钮状态 0-领取，1-已领取，2-已抢完，3-去使用,4-已使用，5-已过期
            propStatusType: {
                type: Number,
                default: 0,
            },
            // 按钮名称： 领取 已领取 已抢完 去使用
            propStatusOperableName: {
                type: String,
                default: '',
            },
            // 优惠券有效期
            propStartTime:{
                type: String,
                default: '',
            },
            propEndTime:{
                type: String,
                default: '',
            }
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                coupon_static_url: coupon_static_url + 'app/',
                // 符号
                currency_symbol: app.globalData.currency_symbol(),
                // 首页地址
                home_page_url: tabbar_pages[0],
            };
        },
        methods: {
            // 领取
            receive(e) {
                this.$emit('call-back', this.propIndex, this.propData.id);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>

<style scoped>
    .coupon-card {
        border-radius: 24rpx;
        height: 208rpx;
    }

    .card-left {
        width: 176rpx;
        padding: 24rpx 12rpx;
        background: linear-gradient(95deg, #ff994b 0%, #ff6e00 100%);
    }

    .card-left.failure {
        background: linear-gradient(95deg, #eeeeee 0%, #fafafa 100%);
    }

    .card-right {
        padding: 32rpx 24rpx 32rpx 46rpx;
        background-color: #ffe4d1;
    }

    .card-right.failure {
        background: linear-gradient(95deg, #f8f8f8 0%, #e0dede 100%);
    }

    .card-info.failure {
        padding-right: 116rpx;
    }

    .card-btn {
        width: 116rpx;
        text-align: center;
        padding: 6rpx 0;
        background: linear-gradient(93deg, #ff9747 0%, #ff6e01 100%);
        border-radius: 13px;
    }

    .robbed {
        background: #fbd3b7;
    }

    .received {
        border-radius: 13px;
        background: transparent;
    }

    ::v-deep .uni-progress-bar,
    ::v-deep .uni-progress-inner-bar {
        border-radius: 6rpx;
    }

    .card-circle-top,
    .card-circle-bottom {
        width: 40rpx;
        height: 40rpx;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        left: 180rpx;
        z-index: 1;
    }

    .card-circle-top {
        top: -20rpx;
    }

    .card-circle-bottom {
        bottom: -20rpx;
    }

    .card-image .image {
        width: 136rpx;
        height: 108rpx;
    }
</style>
