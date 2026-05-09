<template>
    <view class="lottery-egg-outer">
        <view class="lottery-egg-canvas">
            <view class="lottery-egg-bg">
                <image v-if="nImg" :src="nImg" mode="aspectFill" class="lottery-bg-img" />
            </view>

            <view v-if="heroTitleImg" class="lottery-hero-title-overlay">
                <view class="lottery-hero-title-frame">
                    <image class="lottery-hero-title-img" :src="heroTitleImg" mode="aspectFit" />
                </view>
            </view>

            <view class="lottery-egg-machine-wrap">
                <view class="lottery-egg-frame">
                    <!-- 初次修复「看不见机台」：不用 CSS background-image，用 image 铺满（与当时一致） -->
                    <image
                        v-if="frameImageUrl"
                        class="lottery-egg-frame-bg-img"
                        :src="frameImageUrl"
                        mode="aspectFit"
                    />
                    <view class="lottery-egg-frame-lights" aria-hidden="true">
                        <view v-for="d in frameLightDots" :key="d" class="lottery-egg-frame-lights-dot" />
                    </view>
                    <view class="lottery-egg-machine-inner">
                        <view id="lottery-egg-stage" class="lottery-egg-stage">
                            <view class="lottery-egg-grid">
                                <view
                                    v-for="(cell, idx) in normalizedCells"
                                    :key="idx"
                                    :id="'lottery-egg-cell-' + idx"
                                    class="lottery-egg-cell"
                                    :class="{
                                        'lottery-egg-cell-inactive': !cell.active,
                                        'is-broken': cell.active && brokenState[idx],
                                        'is-busy': cell.active && busyDrawing,
                                    }"
                                    @tap="onCellTap(idx, cell)"
                                >
                                    <view class="lottery-egg-pedestal" />
                                    <!-- 小程序原生 image 对 v-show/display 支持不稳，易同时画出闭合+裂开图；改用 v-if 互斥 -->
                                    <block v-if="cell.active">
                                        <image
                                            v-if="!brokenState[idx]"
                                            :src="shellClose"
                                            class="lottery-egg-shell lottery-egg-shell-closed"
                                            mode="aspectFit"
                                        />
                                        <image
                                            v-if="brokenState[idx]"
                                            :src="shellOpen"
                                            class="lottery-egg-shell lottery-egg-shell-open"
                                            mode="aspectFit"
                                        />
                                    </block>
                                    <view v-else class="lottery-egg-placeholder" />
                                    <!-- 锤子挂在当前蛋格内定位：避免舞台级 boundingClientRect 在微信里与参照盒不一致导致飞到角落 -->
                                    <view
                                        v-if="hammerAtCell === idx && hammerImage"
                                        class="lottery-egg-hammer lottery-egg-hammer-in-cell"
                                        :class="{ 'is-strike': hammerStriking }"
                                    >
                                        <image class="lottery-egg-hammer-img" :src="hammerImage" mode="aspectFit" />
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="lottery-egg-hub lottery-egg-hub-in-frame">
                        <text class="lottery-egg-hub-cap">{{ hubCapText }}</text>
                        <text class="lottery-egg-hub-num">{{ chancesDisplayText }}</text>
                    </view>
                </view>
            </view>

            <slot name="footer-extra"></slot>
        </view>
    </view>
</template>

<script>
    /**
     * 砸金蛋画布（机台框 + 6 格蛋 + 锤子动画）
     * 与 PC 前台交互一致：点击蛋 → 父页 draw → strikeGen 驱动敲击动画 → strikeDone
     */
    export default {
        props: {
            /** 页面背景图（aspectFill） */
            nImg: {
                type: String,
                default: '',
            },
            /** 顶部标题图（优先于文字标题） */
            heroTitleImg: {
                type: String,
                default: '',
            },
            /** 后台 egg_cells（6 格，含 active / ring_index） */
            eggCells: {
                type: Array,
                default: () => [],
            },
            /** 金蛋闭合壳图片 URL */
            shellClose: {
                type: String,
                default: '',
            },
            /** 金蛋砸开裂开图 URL */
            shellOpen: {
                type: String,
                default: '',
            },
            /** 锤子图片 URL */
            hammerImage: {
                type: String,
                default: '',
            },
            /** 机台框背景图 URL（contain） */
            frameImage: {
                type: String,
                default: '',
            },
            /** 今日剩余次数或 ∞（与后台 egg_chances_display 一致） */
            chancesDisplay: {
                type: String,
                default: '',
            },
            /** 底部「今日可抽」等多语言标签 */
            chancesCapLabel: {
                type: String,
                default: '',
            },
            /** 父页抽奖成功后递增，watch 内触发 playStrike */
            strikeGen: {
                type: Number,
                default: 0,
            },
            /** 当前要敲击的蛋格索引（与 strikeGen 同步） */
            strikeTargetIndex: {
                type: Number,
                default: -1,
            },
            /** 已砸开蛋格索引，用于裂开图与样式 */
            brokenEggIndexes: {
                type: Array,
                default: () => [],
            },
            /** 父页正在请求开奖或动画中，禁止重复点击 */
            busyDrawing: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                /** 机台顶部彩灯数量（与 PC 9 盏一致） */
                frameLightDots: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                /** 当前播放敲击动画的蛋格索引；-1 表示不展示锤子 */
                hammerAtCell: -1,
                /** 敲击动画 CSS class 开关 */
                hammerStriking: false,
                strikeTimer: null,
                strikeClearTimer: null,
            };
        },
        computed: {
            /** 金蛋容器框底图 URL（template 用 image 渲染，避免小程序背景不显示） */
            frameImageUrl() {
                return String(this.frameImage || '').trim();
            },
            /** 固定 6 格，缺省补 inactive 占位 */
            normalizedCells() {
                const raw = Array.isArray(this.eggCells) ? this.eggCells : [];
                const out = [];
                for (let i = 0; i < 6; i++) {
                    out.push(raw[i] || { egg_index: i, active: false, ring_index: -1, slot: null });
                }
                return out;
            },
            /** 底部「今日可抽」标签文案 */
            hubCapText() {
                return String(this.chancesCapLabel || '').trim();
            },
            /** 底部次数或 ∞ 展示字符串 */
            chancesDisplayText() {
                const s = this.chancesDisplay;
                return s != null && s !== undefined ? String(s) : '';
            },
            /** 小程序模板不支持 :class="fn(idx)"，用数组供模板下标访问 */
            brokenState() {
                const a = this.brokenEggIndexes || [];
                const list = [];
                for (let i = 0; i < 6; i++) {
                    list.push(a.indexOf(i) !== -1);
                }
                return list;
            },
        },
        watch: {
            /** 父页抽奖成功后的敲击序列：定位锤子 → 播放动画 → strikeDone */
            strikeGen(newVal, oldVal) {
                if (newVal > 0 && newVal !== oldVal && this.strikeTargetIndex >= 0) {
                    this.playStrike(this.strikeTargetIndex);
                }
            },
        },
        beforeDestroy() {
            /** 页面销毁时清理锤子动画定时器 */
            this.clearStrikeTimers();
        },
        methods: {
            /** 清除敲击相关 setTimeout，避免内存泄漏 */
            clearStrikeTimers() {
                if (this.strikeTimer) {
                    clearTimeout(this.strikeTimer);
                    this.strikeTimer = null;
                }
                if (this.strikeClearTimer) {
                    clearTimeout(this.strikeClearTimer);
                    this.strikeClearTimer = null;
                }
            },
            /** 蛋格是否已砸开（仅供脚本逻辑，模板用 brokenState） */
            isBroken(idx) {
                const a = this.brokenEggIndexes || [];
                return a.indexOf(idx) !== -1;
            },
            /** 锤子落在蛋格内（CSS），再延时播放敲击动画，结束 emit strikeDone */
            playStrike(idx) {
                const self = this;
                this.clearStrikeTimers();
                this.hammerStriking = false;
                this.hammerAtCell = typeof idx === 'number' ? idx : -1;
                this.$nextTick(() => {
                    self.strikeTimer = setTimeout(() => {
                        self.hammerStriking = true;
                        self.strikeClearTimer = setTimeout(() => {
                            self.hammerStriking = false;
                            self.hammerAtCell = -1;
                            self.$emit('strikeDone');
                        }, 480);
                    }, 400);
                });
            },
            /** 点击有效蛋格：向父页 emit eggSelect */
            onCellTap(idx, cell) {
                if (!cell.active || this.isBroken(idx) || this.busyDrawing) {
                    return;
                }
                this.$emit('eggSelect', { eggIndex: idx });
            },
        },
    };
</script>

<style scoped>
    .lottery-egg-outer {
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }

    .lottery-egg-canvas {
        position: relative;
        width: 100%;
        padding-bottom: 24rpx;
        box-sizing: border-box;
    }

    .lottery-egg-bg {
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
        padding-top: calc(120rpx + constant(safe-area-inset-top));
        padding-top: calc(120rpx + env(safe-area-inset-top));
        padding-left: 24rpx;
        padding-right: 24rpx;
        padding-bottom: 24rpx;
        text-align: center;
        box-sizing: border-box;
    }

    .lottery-hero-title-frame {
        width: 92%;
        max-width: 620rpx;
        height: 156rpx;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .lottery-hero-title-img {
        display: block;
        width: 100%;
        height: 156rpx;
    }

    /* 略小于屏宽，容器背景图整体缩小一档（仍可 contain 完整展示） */
    .lottery-egg-machine-wrap {
        position: relative;
        z-index: 2;
        width: 80%;
        max-width: min(620rpx, 84vw);
        margin: 0 auto;
        padding: 8rpx 12rpx 0;
        box-sizing: border-box;
    }

    /* 与 PC 比例一致；min-height 兜底部分小程序不支持 aspect-ratio 时高度坍缩 */
    .lottery-egg-frame {
        position: relative;
        z-index: 1;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        overflow: visible;
        border-radius: 0;
        aspect-ratio: 750 / 1087;
        min-height: 360rpx;
        box-shadow: none;
    }

    .lottery-egg-frame-bg-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        display: block;
    }

    /* 与 PC egg.css：顶部彩灯槽 + 交错闪烁 */
    .lottery-egg-frame-lights {
        position: absolute;
        left: 50%;
        top: 2.8%;
        transform: translateX(-50%);
        z-index: 3;
        pointer-events: none;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 14rpx;
        width: 92%;
        max-width: 100%;
    }

    .lottery-egg-frame-lights-dot {
        width: 18rpx;
        height: 18rpx;
        border-radius: 50%;
        flex-shrink: 0;
        animation: lottery-egg-frame-light-blink 1.35s ease-in-out infinite;
        box-shadow: 0 0 12rpx currentColor;
    }

    .lottery-egg-frame-lights-dot:nth-child(1) {
        background: #ff4d6a;
        color: #ff4d6a;
        animation-delay: 0s;
    }
    .lottery-egg-frame-lights-dot:nth-child(2) {
        background: #ffb020;
        color: #ffb020;
        animation-delay: 0.15s;
    }
    .lottery-egg-frame-lights-dot:nth-child(3) {
        background: #ffe566;
        color: #ffe566;
        animation-delay: 0.3s;
    }
    .lottery-egg-frame-lights-dot:nth-child(4) {
        background: #4ade80;
        color: #4ade80;
        animation-delay: 0.45s;
    }
    .lottery-egg-frame-lights-dot:nth-child(5) {
        background: #38bdf8;
        color: #38bdf8;
        animation-delay: 0.6s;
    }
    .lottery-egg-frame-lights-dot:nth-child(6) {
        background: #a78bfa;
        color: #a78bfa;
        animation-delay: 0.75s;
    }
    .lottery-egg-frame-lights-dot:nth-child(7) {
        background: #f472b6;
        color: #f472b6;
        animation-delay: 0.9s;
    }
    .lottery-egg-frame-lights-dot:nth-child(8) {
        background: #22d3ee;
        color: #22d3ee;
        animation-delay: 1.05s;
    }
    .lottery-egg-frame-lights-dot:nth-child(9) {
        background: #fb923c;
        color: #fb923c;
        animation-delay: 1.2s;
    }

    @keyframes lottery-egg-frame-light-blink {
        0%,
        100% {
            opacity: 0.28;
            transform: scale(0.82);
        }
        45% {
            opacity: 1;
            transform: scale(1.08);
        }
    }

    /* 与 PC：蛋格区域落在背景图镂空区内（百分比随框缩放） */
    .lottery-egg-machine-inner {
        position: absolute;
        left: 9%;
        right: 9%;
        top: 22%;
        bottom: 32%;
        z-index: 2;
        display: block;
        box-sizing: border-box;
        min-height: 0;
        overflow: visible;
    }

    .lottery-egg-stage {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 0;
        margin: 0 auto;
        box-sizing: border-box;
        overflow: visible;
    }

    .lottery-egg-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr 1fr;
        height: 100%;
        gap: 10rpx 8rpx;
        align-items: stretch;
    }

    .lottery-egg-cell {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        min-height: 0;
    }

    .lottery-egg-cell-inactive {
        opacity: 0.35;
        pointer-events: none;
    }

    .lottery-egg-pedestal {
        position: absolute;
        left: 50%;
        bottom: 10rpx;
        transform: translateX(-50%);
        width: 68%;
        height: 18rpx;
        border-radius: 50%;
        background: radial-gradient(ellipse at center, #c41e12 0%, #7a0d08 100%);
        box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.35);
        z-index: 1;
    }

    .lottery-egg-shell {
        position: relative;
        z-index: 2;
        width: 72%;
        max-height: 200rpx;
        margin-bottom: 8rpx;
        display: block;
        filter: drop-shadow(0 8rpx 12rpx rgba(0, 0, 0, 0.35));
    }

    /* 砸开后裂开图：略下移、略偏左，与底座/透视对齐 */
    .lottery-egg-shell-open {
        position: absolute;
        left: 45%;
        bottom: -8rpx;
        transform: translateX(-50%);
        margin: 0;
        max-height: 190rpx;
        z-index: 3;
    }

    .lottery-egg-placeholder {
        height: 120rpx;
        width: 100%;
    }

    /*
     * 锤子在蛋格内绝对定位。勿用 top:%：flex 格子里包含块高度在微信里易导致百分比不生效，改 top 看起来像「没反应」。
     * 用 bottom:rpx 从格底往上量，蛋、底座贴在底部，锤子在蛋斜上方。
     */
    .lottery-egg-hammer-in-cell {
        position: absolute;
        z-index: 36;
        width: 112rpx;
        height: 112rpx;
        left: 62%;
        margin-left: -46rpx;
        top: auto;
        bottom: 132rpx;
        pointer-events: none;
    }

    .lottery-egg-hammer-img {
        width: 100%;
        height: 100%;
        display: block;
        transform-origin: 72% 68%;
    }

    .lottery-egg-hammer.is-strike .lottery-egg-hammer-img {
        animation: lottery-egg-hammer-strike 0.48s ease-out both;
    }

    @keyframes lottery-egg-hammer-strike {
        0% {
            transform: rotate(0deg);
        }
        45% {
            transform: rotate(-32deg);
        }
        100% {
            transform: rotate(14deg);
        }
    }

    .lottery-egg-hub {
        text-align: center;
        line-height: 1.4;
    }

    /* 贴在机台框底部，与 PC .lottery-egg-hub-in-frame 一致 */
    .lottery-egg-hub-in-frame {
        position: absolute;
        left: 50%;
        bottom: 3%;
        transform: translateX(-50%);
        width: auto;
        max-width: calc(100% - 32rpx);
        margin: 0;
        z-index: 4;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 10rpx;
        pointer-events: none;
        white-space: nowrap;
    }

    .lottery-egg-hub-cap {
        font-size: 26rpx;
        font-weight: 700;
        color: #ffffff;
        text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.4);
    }

    .lottery-egg-hub-num {
        font-size: 38rpx;
        font-weight: 800;
        line-height: 1;
        color: #ffffff;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.4);
    }
</style>
