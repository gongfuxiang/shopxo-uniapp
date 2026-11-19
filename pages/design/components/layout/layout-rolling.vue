<template>
    <view :class="'module-list-rolling ' + (navDotEnt || '')">
        <scroll-view
            class="module-list-rolling-scroll"
            scroll-x
            :scroll-left="scroll_left"
            scroll-with-animation
            :show-scrollbar="false"
            :enhanced="rolling_enhanced"
            enable-flex
            @scroll="scroll_event"
            @touchstart="touch_start"
            @touchend="touch_end">
            <view class="module-list-rolling-track">
                <slot></slot>
            </view>
        </scroll-view>
        <view v-if="showDots && page_count > 1" class="module-list-rolling-dots">
            <view
                v-for="(d, i) in page_count"
                :key="i"
                :class="'module-list-rolling-dot ' + (current === i ? 'active' : '')"
                :style="current === i ? ('background:' + theme_color) : ''">
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            // 与 PC flexslider itemWidth / itemMargin 一致，单位 CSS px
            itemWidth: { type: [Number, String], default: 200 },
            itemMargin: { type: [Number, String], default: 20 },
            autoplay: { type: Boolean, default: false },
            showDots: { type: Boolean, default: false },
            navDotEnt: { type: String, default: '' },
            count: { type: [Number, String], default: 0 },
            interval: { type: [Number, String], default: 3000 }
        },
        data() {
            const app = getApp();
            // enhanced 仅微信小程序对 show-scrollbar 生效；H5 开了反而易异常，用 CSS 隐藏滚动条
            var rolling_enhanced = false;
            // #ifdef MP-WEIXIN
            rolling_enhanced = true;
            // #endif
            return {
                scroll_left: 0,
                current: 0,
                timer: null,
                pause: false,
                rolling_enhanced: rolling_enhanced,
                theme_color: (app && app.globalData && app.globalData.get_theme_color)
                    ? (app.globalData.get_theme_color() || '#1677ff')
                    : '#1677ff'
            };
        },
        computed: {
            item_width_px() {
                return parseInt(this.itemWidth, 10) || 200;
            },
            item_margin_px() {
                var n = parseInt(this.itemMargin, 10);
                return isNaN(n) ? 20 : n;
            },
            step() {
                return this.item_width_px + this.item_margin_px;
            },
            page_count() {
                return parseInt(this.count, 10) || 0;
            }
        },
        watch: {
            autoplay: {
                immediate: true,
                handler() {
                    this.rebind_timer();
                }
            },
            interval() {
                this.rebind_timer();
            },
            count() {
                this.rebind_timer();
            }
        },
        beforeDestroy() {
            this.clear_timer();
        },
        // #ifdef VUE3
        beforeUnmount() {
            this.clear_timer();
        },
        // #endif
        methods: {
            clear_timer() {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            },
            rebind_timer() {
                this.clear_timer();
                if (!this.autoplay || this.page_count <= 1 || this.step <= 0) {
                    return;
                }
                var self = this;
                this.timer = setInterval(function () {
                    if (self.pause) {
                        return;
                    }
                    var next = self.current + 1;
                    if (next >= self.page_count) {
                        next = 0;
                    }
                    self.go_index(next);
                }, parseInt(this.interval, 10) || 3000);
            },
            go_index(idx) {
                this.current = idx;
                var left = idx * this.step;
                // 同值不触发滚动时先微调再设回
                if (Math.abs((this.scroll_left || 0) - left) < 0.5) {
                    this.scroll_left = left + 1;
                    var self = this;
                    this.$nextTick(function () {
                        self.scroll_left = left;
                    });
                } else {
                    this.scroll_left = left;
                }
            },
            scroll_event(e) {
                var left = (e.detail && e.detail.scrollLeft) || 0;
                var idx = Math.round(left / this.step);
                if (idx < 0) {
                    idx = 0;
                }
                if (idx >= this.page_count) {
                    idx = this.page_count - 1;
                }
                if (idx !== this.current) {
                    this.current = idx;
                }
            },
            touch_start() {
                this.pause = true;
            },
            touch_end() {
                var self = this;
                setTimeout(function () {
                    self.pause = false;
                }, 800);
            }
        }
    };
</script>
<style scoped>
    .module-list-rolling {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .module-list-rolling-scroll {
        width: 100%;
        overflow: hidden;
    }
    .module-list-rolling-track {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: max-content;
    }
    .module-list-rolling-dots {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 12rpx 0 4rpx;
    }
    .module-list-rolling-dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.2);
        margin: 0 6rpx;
    }
</style>
<!-- H5：scroll-view 内层才是真正滚动层，必须穿透隐藏，否则滚动条显隐会撑高导致抖动 -->
<style lang="scss">
/* #ifdef H5 */
.module-list-rolling,
.module-list-rolling uni-scroll-view,
.module-list-rolling .uni-scroll-view,
.module-list-rolling .uni-scroll-view-content {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}
.module-list-rolling ::-webkit-scrollbar,
.module-list-rolling uni-scroll-view::-webkit-scrollbar,
.module-list-rolling .uni-scroll-view::-webkit-scrollbar,
.module-list-rolling .uni-scroll-view-content::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
}
.module-list-rolling .uni-scroll-view {
    overflow-x: auto !important;
    overflow-y: hidden !important;
}
/* #endif */
</style>
