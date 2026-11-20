<template>
    <view class="notice-marquee" :style="color_style || ''">
        <view class="notice-marquee-inner">
            <text class="notice-marquee-measure">{{ show_text }}</text>
            <view
                class="notice-marquee-track"
                :style="'transform:translateX(' + offset + 'px);'"
            >
                <text class="notice-marquee-text">{{ show_text }}</text>
                <text class="notice-marquee-text">{{ show_text }}</text>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            text: {
                type: String,
                default: ''
            },
            // 1慢 ~ 10快
            speed: {
                type: [Number, String],
                default: 3
            },
            // 恒定像素/秒（优先）；与文案长短无关
            pxPerSec: {
                type: [Number, String],
                default: 0
            },
            colorStyle: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                offset: 0,
                text_width: 0,
                timer: null
            };
        },
        computed: {
            show_text() {
                return String(this.text || '').replace(/\s+/g, ' ');
            },
            color_style() {
                return this.colorStyle || '';
            },
            // 恒定 px/s，改文案不改变快慢
            px_per_sec() {
                var px = parseFloat(this.pxPerSec);
                if (!isNaN(px) && px > 0) {
                    return px;
                }
                var speed = Math.max(1, Math.min(10, parseInt(this.speed, 10) || 3));
                var map = {1: 15, 2: 25, 3: 40, 4: 55, 5: 75, 6: 95, 7: 120, 8: 150, 9: 180, 10: 220};
                return map[speed] || 40;
            }
        },
        watch: {
            text() {
                this.$nextTick(() => {
                    this.measure_and_start();
                });
            },
            speed() {
                this.start_timer();
            },
            pxPerSec() {
                this.start_timer();
            }
        },
        mounted() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.measure_and_start();
                }, 80);
            });
        },
        beforeDestroy() {
            this.clear_timer();
        },
        methods: {
            clear_timer() {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            },
            estimate_width(text) {
                var px = 0;
                var font_size = 14;
                for (var i = 0; i < text.length; i++) {
                    px += text.charCodeAt(i) > 255 ? font_size : font_size * 0.55;
                }
                return Math.max(px + 24, 40);
            },
            measure_and_start() {
                var self = this;
                this.clear_timer();
                this.offset = 0;
                var text = this.show_text;
                if (!text) {
                    this.text_width = 0;
                    return;
                }
                this.text_width = this.estimate_width(text);
                this.start_timer();
                uni.createSelectorQuery()
                    .in(this)
                    .select('.notice-marquee-measure')
                    .boundingClientRect(function (rect) {
                        if (rect && rect.width > 0) {
                            self.text_width = rect.width;
                            // 宽度只用于无缝循环复位，不改变像素速度
                        }
                    })
                    .exec();
            },
            start_timer() {
                var self = this;
                this.clear_timer();
                if (this.text_width <= 0) {
                    return;
                }
                var px_per_ms = this.px_per_sec / 1000;
                var step_ms = 16;
                this.timer = setInterval(function () {
                    var next = self.offset - px_per_ms * step_ms;
                    if (self.text_width > 0 && -next >= self.text_width) {
                        next += self.text_width;
                    }
                    self.offset = next;
                }, step_ms);
            }
        }
    };
</script>
<style scoped>
    .notice-marquee {
        flex: 1;
        min-width: 0;
        height: 56rpx;
        overflow: hidden;
        position: relative;
    }
    .notice-marquee-inner {
        width: 100%;
        height: 56rpx;
        overflow: hidden;
        position: relative;
    }
    .notice-marquee-measure {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        pointer-events: none;
        white-space: nowrap;
        padding-right: 48rpx;
        font-size: 28rpx;
        line-height: 56rpx;
    }
    .notice-marquee-track {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 56rpx;
        white-space: nowrap;
    }
    .notice-marquee-text {
        flex-shrink: 0;
        padding-right: 48rpx;
        line-height: 56rpx;
        height: 56rpx;
        white-space: nowrap;
        font-size: 28rpx;
    }
</style>
