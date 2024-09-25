<template>
    <view :class="theme_view">
        <view class="countdown" v-if="is_show && !is_end">
            <block v-if="propMsecShow">
                <view class="fr time" :style="time_style">{{ msec }}</view>
                <view class="fr ds" :style="ds_style">{{ propSecondDs }}</view>
            </block>
            <view class="fr time" :style="time_style">{{ second }}</view>
            <view class="fr ds" :style="ds_style">{{ propMinuteDs }}</view>
            <view class="fr time" :style="time_style">{{ minute }}</view>
            <view class="fr ds" :style="ds_style">{{ propHourDs }}</view>
            <view class="fr time" :style="time_style">{{ hour }}</view>
        </view>
        <view v-if="is_show && is_end" class="timer-title">{{ propMsg || this.$t('index.index.443683') }}</view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                hour: '00',
                minute: '00',
                second: '00',
                msec: 0,
                is_show: true,
                is_end: false,
                timer: null,
                timers: null,
            };
        },
        components: {},
        props: {
            propHour: {
                type: [String, Number],
                default: '00',
            },
            propMinute: {
                type: [String, Number],
                default: '00',
            },
            propSecond: {
                type: [String, Number],
                default: '00',
            },
            propEndShow: {
                type: Boolean,
                default: false,
            },
            propMsecShow: {
                type: Boolean,
                default: false,
            },
            propMsg: {
                type: String,
                default: '',
            },
            propHourDs: {
                type: String,
                default: ':',
            },
            propMinuteDs: {
                type: String,
                default: ':',
            },
            propSecondDs: {
                type: String,
                default: ':',
            },
            propTimePadding: {
                type: [Number, String],
                default: 0,
            },
            propTimeSize: {
                type: [Number, String],
                default: 24,
            },
            propTimeBackgroundColor: {
                type: String,
                default: 'linear-gradient(180deg, #FF601B 0%, #FE1B33 100%);',
            },
            propTimeColor: {
                type: String,
                default: '#FFF',
            },
            propTimeWeight: {
                type: [Number, String],
                default: '400',
            },
            propDsColor: {
                type: String,
                default: '#4B5459',
            },
            propDsSize: {
                type: [Number, String],
                default: 24,
            },
            propDsWeight: {
                type: [Number, String],
                default: '400',
            },
        },
        computed: {
            time_style() {
                return 'padding: 0 ' + this.propTimePadding + 'rpx;background:' + this.propTimeBackgroundColor + ';color:' + this.propTimeColor + ';font-size:' + this.propTimeSize + 'rpx;font-weight:' + this.propTimeWeight;
            },
            ds_style() {
                return 'color:' + this.propDsColor + ';font-size:' + this.propDsSize + 'rpx;font-weight:' + this.propDsWeight;
            },
        },
        created: function (e) {
            // 参数处理
            this.hour = this.propHour;
            this.minute = this.propMinute;
            this.second = this.propSecond;

            // 定时处理
            this.countdown();
        },
        // #ifndef VUE2
        destroyed() {
            clearInterval(this.timer);
            clearInterval(this.timers);
        },
        // #endif
        // #ifdef VUE3
        unmounted() {
            clearInterval(this.timer);
            clearInterval(this.timers);
        },
        // #endif
        methods: {
            // 倒计时处理
            countdown() {
                // 销毁之前的任务
                clearInterval(this.timer);
                clearInterval(this.timers);

                // 秒
                var self = this;
                var hour = parseInt(self.hour);
                var minute = parseInt(self.minute);
                var second = parseInt(self.second);
                self.timer = setInterval(function () {
                    if (second <= 0) {
                        if (minute > 0) {
                            minute--;
                            second = 59;
                        } else if (hour > 0) {
                            hour--;
                            minute = 59;
                            second = 59;
                        }
                    } else {
                        second--;
                    }

                    self.hour = hour < 10 ? '0' + hour : hour;
                    self.minute = minute < 10 ? '0' + minute : minute;
                    self.second = second < 10 ? '0' + second : second;
                    if (self.propHour <= 0 && self.propMinute <= 0 && self.propSecond <= 0) {
                        // 停止时间
                        clearInterval(self.timer);
                        clearInterval(self.timers);
                        self.is_end = true;

                        // 活动已结束、是否结束还展示
                        if (!self.propEndShow) {
                            self.is_show = false;
                        }
                    }
                }, 1000);

                // 毫秒
                var count = 0;
                self.timers = setInterval(function () {
                    count++;
                    self.msec = count;
                    if (count > 9) {
                        count = 0;
                    }
                    if (!self.is_show) {
                        clearInterval(self.timers);
                    }
                }, 100);
            },
        },
    };
</script>
<style scoped>
    .countdown {
        line-height: 38rpx;
    }
    .countdown .timer-title {
        color: #666;
        margin-right: 10rpx;
    }
    .countdown .time {
        padding: 0;
        -moz-border-radius: 8rpx;
        border-radius: 8rpx;
        color: #fff;
        min-width: 40rpx;
        text-align: center;
    }
    .countdown .ds {
        color: #4b5459;
        padding: 0 8rpx;
    }
</style>
