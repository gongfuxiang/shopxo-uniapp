<template>
    <view class="page-width-max lottery-turn-outer">
        <view class="lottery-turn-canvas">
            <view class="lottery-turn-bg">
                <image v-if="nImg" :src="nImg" mode="aspectFill" class="lottery-bg-img"></image>
            </view>
            <view v-if="heroTitleImg" class="lottery-hero-title-overlay">
                <view class="lottery-hero-title-frame">
                    <image class="lottery-hero-title-img" :src="heroTitleImg" mode="aspectFit" />
                </view>
            </view>

            <view class="lottery-turn-machine-wrap">
                <view class="lottery-turn-rim">
                    <view
                        class="lottery-turn-rim-lights"
                        :class="{ 'lottery-turn-rim-lights--spinning': rimLightsSpinning }"
                        aria-hidden="true"
                    ></view>
                    <view class="lottery-turn-wheel-ring">
                        <!-- 指针朝下指向扇区（与 PC welfare 一致） -->
                        <view class="lottery-turn-pointer" aria-hidden="true"></view>
                        <!-- 小程序里 style 对象合并 transform 偶发无效，用字符串内联 -->
                        <view class="lottery-turn-wheel-disk" :style="diskRotateInlineStyle">
                            <view class="lottery-turn-wheel-pie" aria-hidden="true">
                                <image
                                    v-if="wheelPieSvgDataUrl"
                                    class="lottery-turn-wheel-pie-img"
                                    :src="wheelPieSvgDataUrl"
                                    mode="aspectFill"
                                />
                            </view>
                            <view
                                v-for="(sv, si) in sectors"
                                :key="si"
                                class="lottery-turn-sector-arm"
                                :style="{ '--mid': (sv.label_rotate_deg || 0) + 'deg' }"
                            >
                                <image v-if="sv.icon" :src="sv.icon" class="lottery-turn-sector-icon radius" mode="aspectFit" />
                                <text class="lottery-turn-sector-text">{{ sv.name || '' }}</text>
                            </view>
                        </view>
                        <view
                            class="lottery-turn-hub lottery-turn-hub--count"
                            :class="{ 'lottery-turn-hub-draw-busy': hubBusy }"
                            @tap.stop="onHubDrawTap"
                        >
                            <text class="lottery-turn-hub-num" :class="{ 'lottery-turn-hub-draw-cta': hubDrawCta }">{{ chancesText }}</text>
                            <text v-if="hubCapShow" class="lottery-turn-hub-cap">{{ hubCapLabel }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 底部抽奖按钮放在画布内，与背景图同一层级叠放，避免组件 min-height:100vh 把按钮顶到下一屏 -->
            <slot name="footer-draw"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            /** 活动页背景图 URL（aspectFill） */
            nImg: {
                type: String,
                default: '',
            },
            /** 顶部标题图 URL */
            heroTitleImg: {
                type: String,
                default: '',
            },
            /** 扇区奖品列表（含名称、图标、ring_index 等） */
            sectors: {
                type: Array,
                default: () => [],
            },
            /** 每扇区角度，与后台 sector_deg 一致 */
            sectorDeg: {
                type: Number,
                default: 0,
            },
            /** 扇区总数；为 0 时用 sectors 长度推算 */
            ringCount: {
                type: Number,
                default: 0,
            },
            /** 中心圆内次数数字展示 */
            chancesText: {
                type: String,
                default: '',
            },
            /** 中心圆次数下方说明文案，如「可用次数」；无每日上限时父页传空串则不展示 */
            hubCapLabel: {
                type: String,
                default: '可用次数',
            },
            /** 中心圆为「立即抽奖」文案时略缩小字号（与 PC welfare 一致） */
            hubDrawCta: {
                type: Boolean,
                default: false,
            },
            /** 抽奖进行中：中心圆禁用点击并弱化显示 */
            hubBusy: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                /** 盘面累计旋转角度（度） */
                accRotate: 0,
                /** requestAnimationFrame 旋转动画 id（便于取消） */
                spinRafId: null,
                /** 旋转过程中外圈灯条色相动画开关 */
                rimLightsSpinning: false,
            };
        },
        beforeDestroy() {
            this.cancelSpinAnimation();
        },
        computed: {
            hubCapShow() {
                return !!(this.hubCapLabel && String(this.hubCapLabel).trim());
            },
            /** 扇区配色：SVG data URI，供 image src */
            wheelPieSvgDataUrl() {
                const n = this.getWheelSectorCount();
                let svg;
                if (n <= 1) {
                    svg =
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="' +
                        this.turnSliceHsl(0, Math.max(1, n)) +
                        '"/></svg>';
                } else {
                    const parts = [];
                    for (let i = 0; i < n; i++) {
                        parts.push(
                            '<path d="' +
                                this.svgSectorPathD(i, n) +
                                '" fill="' +
                                this.turnSliceHsl(i, n) +
                                '"/>',
                        );
                    }
                    svg =
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
                        parts.join('') +
                        '</svg>';
                }
                return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
            },
            diskRotateInlineStyle() {
                const d = Number(this.accRotate) || 0;
                return (
                    'transform:rotate(' +
                    d +
                    'deg) translateZ(0);-webkit-transform:rotate(' +
                    d +
                    'deg) translateZ(0)'
                );
            },
        },
        methods: {
            /** 有效扇区数（与盘面逻辑一致） */
            getWheelSectorCount() {
                const raw =
                    this.ringCount > 0
                        ? this.ringCount
                        : Array.isArray(this.sectors)
                          ? this.sectors.length
                          : 0;
                return Math.max(1, Math.min(36, parseInt(raw, 10) || 1));
            },
            /** 扇形 path，viewBox 0..100，圆心 50,50 半径 50；角度与原先 canvas 扇区一致 */
            svgSectorPathD(i, n) {
                const r = 50;
                const cx = 50;
                const cy = 50;
                const a0 = -Math.PI / 2 + (i / n) * 2 * Math.PI;
                const a1 = -Math.PI / 2 + ((i + 1) / n) * 2 * Math.PI;
                const x0 = cx + r * Math.cos(a0);
                const y0 = cy + r * Math.sin(a0);
                const x1 = cx + r * Math.cos(a1);
                const y1 = cy + r * Math.sin(a1);
                let delta = a1 - a0;
                while (delta <= 0) {
                    delta += 2 * Math.PI;
                }
                while (delta > 2 * Math.PI) {
                    delta -= 2 * Math.PI;
                }
                const large = delta > Math.PI ? 1 : 0;
                return (
                    'M ' +
                    cx +
                    ' ' +
                    cy +
                    ' L ' +
                    x0 +
                    ' ' +
                    y0 +
                    ' A ' +
                    r +
                    ' ' +
                    r +
                    ' 0 ' +
                    large +
                    ' 1 ' +
                    x1 +
                    ' ' +
                    y1 +
                    ' Z'
                );
            },
            turnSliceHsl(i, n) {
                const h = ((360.0 * i) / n + 14.0) % 360;
                const lightness = 74 + (i % 2) * 11;
                return 'hsl(' + (h < 0 ? h + 360 : h) + ', 82%, ' + lightness + '%)';
            },
            /** 点击中心圆抽奖（与底部按钮共用父页 beforeDraw） */
            onHubDrawTap() {
                if (this.hubBusy) {
                    return;
                }
                this.$emit('hubDraw');
            },
            cancelSpinAnimation() {
                const id = this.spinRafId;
                if (id != null) {
                    if (typeof uni !== 'undefined' && uni.cancelAnimationFrame) {
                        uni.cancelAnimationFrame(id);
                    } else if (typeof cancelAnimationFrame === 'function') {
                        cancelAnimationFrame(id);
                    } else {
                        clearTimeout(id);
                    }
                    this.spinRafId = null;
                }
            },
            requestSpinFrame(cb) {
                if (typeof uni !== 'undefined' && uni.requestAnimationFrame) {
                    return uni.requestAnimationFrame(cb);
                }
                if (typeof requestAnimationFrame === 'function') {
                    return requestAnimationFrame(cb);
                }
                return setTimeout(cb, 16);
            },
            /** ease-out cubic，接近原 cubic-bezier(0.18, 0.75, 0.22, 1) 收尾感 */
            easeSpinOut(t) {
                return 1 - Math.pow(1 - t, 3);
            },
            /**
             * 与 PC turn.js spinToRing：指针固定朝上，盘面旋转使扇区中心对齐 0°
             */
            runSpin(ringIndex) {
                const n =
                    this.ringCount > 0
                        ? this.ringCount
                        : Math.min(8, Math.max(1, Math.round(360 / (this.sectorDeg || 45))));
                const per = this.sectorDeg > 0 ? this.sectorDeg : 360 / n;
                let ri = parseInt(ringIndex, 10);
                if (isNaN(ri)) {
                    ri = 0;
                }
                ri = ((ri % n) + n) % n;
                const cur = parseFloat(this.accRotate) || 0;
                const sectorCenterDeg = ri * per + per / 2;
                let combined = ((sectorCenterDeg + cur) % 360 + 360) % 360;
                let alignDelta = 360 - combined;
                if (alignDelta <= 0.01 || alignDelta >= 359.99) {
                    alignDelta = 360;
                }
                const fullSpins = 360 * 5;
                const delta = fullSpins + alignDelta;
                const next = cur + delta;
                const spinMs = 5200;
                this.cancelSpinAnimation();
                this.runSpinWithRaf(cur, next, spinMs);
            },
            runSpinWithRaf(start, end, spinMs) {
                this.rimLightsSpinning = true;
                const self = this;
                const usePerf = typeof performance !== 'undefined' && typeof performance.now === 'function';
                const tStart = usePerf ? performance.now() : Date.now();

                function tick() {
                    const now = usePerf ? performance.now() : Date.now();
                    const elapsed = now - tStart;
                    const p = Math.min(1, elapsed / spinMs);
                    self.accRotate = start + (end - start) * self.easeSpinOut(p);
                    if (p < 1) {
                        self.spinRafId = self.requestSpinFrame(tick);
                    } else {
                        self.accRotate = end;
                        self.spinRafId = null;
                        self.rimLightsSpinning = false;
                        self.$emit('spinDone');
                    }
                }
                this.spinRafId = this.requestSpinFrame(tick);
            },
        },
    };
</script>

<style scoped>
    .lottery-turn-outer {
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }

    .lottery-turn-canvas {
        position: relative;
        width: 100%;
        padding-bottom: 24rpx;
        box-sizing: border-box;
    }

    .lottery-turn-bg {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        min-height: calc(100vh + constant(safe-area-inset-bottom));
        min-height: calc(100vh + env(safe-area-inset-bottom));
        overflow: hidden;
        z-index: 0;
    }

    .lottery-bg-img {
        width: 100%;
        height: 100%;
        min-height: calc(100vh + constant(safe-area-inset-bottom));
        min-height: calc(100vh + env(safe-area-inset-bottom));
        display: block;
    }

    .lottery-hero-title-overlay {
        position: relative;
        z-index: 2;
        /* 与 PC lottery-turn-welfare-hero 类似：为状态栏 / 自定义顶栏留白，避免标题贴顶 */
        padding-top: calc(120rpx + constant(safe-area-inset-top));
        padding-top: calc(120rpx + env(safe-area-inset-top));
        padding-left: 24rpx;
        padding-right: 24rpx;
        padding-bottom: 24rpx;
        text-align: center;
        box-sizing: border-box;
    }

    /* 固定展示区域 + aspectFit，避免 widthFix 与 max-height 同时约束导致压扁、拉伸 */
    .lottery-hero-title-frame {
        width: 92%;
        max-width: 620rpx;
        height: 220rpx;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .lottery-hero-title-img {
        display: block;
        width: 100%;
        height: 220rpx;
    }

    .lottery-turn-machine-wrap {
        position: relative;
        z-index: 2;
        width: 88%;
        max-width: min(820rpx, 88vw);
        margin: 0 auto;
        padding: 16rpx 24rpx 0;
        box-sizing: border-box;
    }

    .lottery-turn-rim {
        position: relative;
        padding: 24rpx;
        border-radius: 50%;
        background: linear-gradient(145deg, #ff6b6b 0%, #e53935 45%, #c62828 100%);
        box-shadow: 0 12rpx 40rpx rgba(198, 40, 40, 0.55), inset 0 6rpx 0 rgba(255, 255, 255, 0.35);
    }

    .lottery-turn-rim-lights {
        position: absolute;
        left: 16rpx;
        top: 16rpx;
        right: 16rpx;
        bottom: 16rpx;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.55;
        background: repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.95) 0deg 3deg, transparent 3deg 11deg);
        mix-blend-mode: overlay;
    }

    /*
     * 抽奖旋转期间：横杠用有色条（白条 hue-rotate 几乎不变色），整圈平滑色相循环 + 略提高对比。
     * 叠色用 screen 让彩灯感更明显；外圈不旋转。
     */
    .lottery-turn-rim-lights--spinning {
        opacity: 0.96;
        mix-blend-mode: screen;
        background: repeating-conic-gradient(
            from 0deg,
            hsla(330, 100%, 58%, 0.96) 0deg 4deg,
            transparent 4deg 12deg
        );
        will-change: filter;
        -webkit-animation: lottery-turn-rim-lights-hue-cycle 1.05s linear infinite;
        animation: lottery-turn-rim-lights-hue-cycle 1.05s linear infinite;
    }

    @keyframes lottery-turn-rim-lights-hue-cycle {
        0% {
            -webkit-filter: hue-rotate(0deg) saturate(2.35) brightness(1.14) contrast(1.22);
            filter: hue-rotate(0deg) saturate(2.35) brightness(1.14) contrast(1.22);
        }
        100% {
            -webkit-filter: hue-rotate(360deg) saturate(2.35) brightness(1.14) contrast(1.22);
            filter: hue-rotate(360deg) saturate(2.35) brightness(1.14) contrast(1.22);
        }
    }

    .lottery-turn-wheel-ring {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        overflow: visible;
    }

    .lottery-turn-pointer {
        position: absolute;
        left: 50%;
        top: 36%;
        transform: translate(-50%, -8rpx);
        margin-left: 0;
        width: 0;
        height: 0;
        border-left: 18rpx solid transparent;
        border-right: 18rpx solid transparent;
        border-bottom: 30rpx solid #ffd54f;
        filter: drop-shadow(0 -6rpx 12rpx rgba(0, 0, 0, 0.38));
        z-index: 6;
        pointer-events: none;
    }

    .lottery-turn-wheel-disk {
        position: absolute;
        left: 4%;
        top: 4%;
        right: 4%;
        bottom: 4%;
        border-radius: 50%;
        z-index: 2;
        transform-origin: 50% 50%;
        overflow: visible;
        box-shadow:
            inset 0 0 0 8rpx rgba(255, 255, 255, 0.65),
            inset 0 0 24rpx rgba(233, 30, 99, 0.08),
            0 16rpx 56rpx rgba(0, 0, 0, 0.35);
    }

    .lottery-turn-wheel-pie {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        overflow: hidden;
        z-index: 1;
        pointer-events: none;
    }

    .lottery-turn-wheel-pie-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
    }

    .lottery-turn-sector-arm {
        position: absolute;
        left: 50%;
        bottom: 50%;
        width: 48%;
        margin-left: -24%;
        height: 54%;
        transform-origin: bottom center;
        transform: rotate(var(--mid, 0deg));
        pointer-events: none;
        z-index: 4;
    }

    .lottery-turn-sector-icon {
        position: absolute;
        left: 50%;
        bottom: 44%;
        transform: translateX(-50%);
        width: 56rpx;
        height: 56rpx;
    }

    .lottery-turn-sector-text {
        position: absolute;
        left: 50%;
        bottom: 65.5%;
        transform: translateX(-50%);
        width: 92%;
        max-width: 220rpx;
        font-size: 26rpx;
        font-weight: 700;
        color: #c62828;
        text-align: center;
        line-height: 1.2;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    /* 仅文案无图标时略靠中间，避免显得贴边 */
    .lottery-turn-sector-arm .lottery-turn-sector-text:first-child {
        bottom: 58.5%;
    }

    .lottery-turn-hub {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 24%;
        height: 24%;
        margin-left: -12%;
        margin-top: -12%;
        z-index: 8;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6rpx;
        padding: 12rpx;
        box-sizing: border-box;
        background:
            radial-gradient(circle at 50% 22%, rgba(255, 255, 255, 0.58) 0%, rgba(255, 230, 220, 0.22) 26%, transparent 46%),
            radial-gradient(circle at 50% 58%, #ff7043 0%, #d32f2f 46%, #8b0000 88%, #5c0000 100%);
        box-shadow:
            0 14rpx 32rpx rgba(0, 0, 0, 0.35),
            inset 0 12rpx 20rpx rgba(255, 248, 240, 0.42),
            inset 0 -12rpx 22rpx rgba(0, 0, 0, 0.38);
        border: 6rpx solid rgba(255, 240, 200, 0.55);
    }

    .lottery-turn-hub-draw-busy {
        opacity: 0.88;
    }

    /* 仅缩小文案字号，中心球尺寸保持原样 */
    .lottery-turn-hub-num {
        font-size: 40rpx;
        font-weight: 800;
        line-height: 1;
        color: #ffffff;
        font-variant-numeric: tabular-nums;
    }

    .lottery-turn-hub-num.lottery-turn-hub-draw-cta {
        font-size: 18rpx;
        font-weight: 700;
        line-height: 1.22;
        text-align: center;
        padding: 0 8rpx;
        font-variant-numeric: normal;
        letter-spacing: 0;
    }

    .lottery-turn-hub-cap {
        font-size: 18rpx;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.92);
    }

    /* 页面 disableScroll 时整页不可滚：压缩标题区与灯圈边距，尽量避免转盘被裁切 */
    @media screen and (max-height: 700px) {
        .lottery-hero-title-overlay {
            padding-top: calc(96rpx + constant(safe-area-inset-top));
            padding-top: calc(96rpx + env(safe-area-inset-top));
            padding-bottom: 12rpx;
        }

        .lottery-hero-title-frame {
            height: 160rpx;
        }

        .lottery-hero-title-img {
            height: 160rpx;
        }

        .lottery-turn-machine-wrap {
            padding: 8rpx 16rpx 0;
        }

        .lottery-turn-rim {
            padding: 16rpx;
        }
    }
</style>
