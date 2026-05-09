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
                <view
                    class="lottery-egg-frame"
                    :style="frameBgStyle"
                >
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
                                    <block v-if="cell.active">
                                        <image
                                            v-show="!brokenState[idx]"
                                            :src="shellClose"
                                            class="lottery-egg-shell lottery-egg-shell-closed"
                                            mode="aspectFit"
                                        />
                                        <image
                                            v-show="brokenState[idx]"
                                            :src="shellOpen"
                                            class="lottery-egg-shell lottery-egg-shell-open"
                                            mode="aspectFit"
                                        />
                                    </block>
                                    <view v-else class="lottery-egg-placeholder" />
                                </view>
                            </view>

                            <view
                                class="lottery-egg-hammer"
                                :class="{ 'is-strike': hammerStriking }"
                                :style="hammerStyle"
                            >
                                <image v-if="hammerImage" class="lottery-egg-hammer-img" :src="hammerImage" mode="aspectFit" />
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
                /** 锤子 absolute 定位（px 或 %，由 positionHammer 写入） */
                hammerStyle: {
                    opacity: '0',
                    left: '0',
                    top: '0',
                },
                /** 敲击动画 CSS class 开关 */
                hammerStriking: false,
                strikeTimer: null,
                strikeClearTimer: null,
            };
        },
        computed: {
            /** 机台框背景：egg_machine_frame_image */
            frameBgStyle() {
                const u = String(this.frameImage || '').trim();
                return u ? { backgroundImage: 'url("' + u + '")' } : {};
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
            /**
             * 百分比在小程序里相对参照盒易错位；退化时用格子行列估算
             */
            fallbackPositionHammer(idx) {
                const col = idx % 3;
                const row = Math.floor(idx / 3);
                const cellW = 100 / 3;
                const left = col * cellW + cellW * 0.70 - 10;
                const top = row * 50 + 8;
                this.hammerStyle = {
                    left: Math.max(0, Math.min(88, left)) + '%',
                    top: Math.max(0, Math.min(80, top)) + '%',
                    opacity: '1',
                };
            },
            /**
             * 与 PC egg.js strikeEggCell 一致：用蛋格与舞台实测像素差定位（boundingClientRect）
             * left = cell 相对舞台左偏移 + cw*0.70 - hammer宽*0.45
             * top = cell 相对舞台上偏移 - ch*k（k 略小则锤整体略下移）
             */
            positionHammer(idx, done) {
                const self = this;
                const finish = typeof done === 'function' ? done : function () {};
                const runQuery = () => {
                    const q = uni.createSelectorQuery().in(self);
                    q.select('#lottery-egg-stage').boundingClientRect();
                    q.select('#lottery-egg-cell-' + idx).boundingClientRect();
                    q.exec((res) => {
                        const stage = res && res[0];
                        const cell = res && res[1];
                        if (!stage || !cell || stage.width === undefined || cell.width === undefined || cell.width <= 0) {
                            self.fallbackPositionHammer(idx);
                            finish();
                            return;
                        }
                        let hw = 56;
                        if (typeof uni !== 'undefined' && typeof uni.upx2px === 'function') {
                            hw = uni.upx2px(112);
                        }
                        const cw = cell.width;
                        const ch = cell.height;
                        const leftPx = cell.left - stage.left + cw * 0.70 - hw * 0.45;
                        /* PC 为 ch*0.12；这里加大系数使锤头明显落在蛋身偏上，避免像在砸底座 */
                        const topPx = cell.top - stage.top - ch * 0.26;
                        self.hammerStyle = {
                            left: leftPx + 'px',
                            top: topPx + 'px',
                            opacity: '1',
                        };
                        finish();
                    });
                };
                this.$nextTick(() => {
                    setTimeout(runQuery, 30);
                });
            },
            /** 定位锤子后延时播放敲击动画，结束向父页 emit strikeDone */
            playStrike(idx) {
                const self = this;
                this.clearStrikeTimers();
                this.hammerStriking = false;
                this.positionHammer(idx, () => {
                    self.strikeTimer = setTimeout(() => {
                        self.hammerStriking = true;
                        self.strikeClearTimer = setTimeout(() => {
                            self.hammerStriking = false;
                            self.hammerStyle = Object.assign({}, self.hammerStyle, { opacity: '0' });
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

    /* 与 PC egg.css .lottery-egg-machine-frame 一致：完整展示容器底图（contain + 750/1087） */
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
        background-size: contain;
        background-position: center bottom;
        background-repeat: no-repeat;
        background-color: transparent;
        box-shadow: none;
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
    }

    .lottery-egg-stage {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 0;
        margin: 0 auto;
        box-sizing: border-box;
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

    .lottery-egg-cell.is-broken .lottery-egg-shell-closed {
        display: none !important;
    }

    .lottery-egg-placeholder {
        height: 120rpx;
        width: 100%;
    }

    .lottery-egg-hammer {
        position: absolute;
        z-index: 20;
        width: 112rpx;
        height: 112rpx;
        pointer-events: none;
        opacity: 0;
    }

    .lottery-egg-hammer-img {
        width: 100%;
        height: 100%;
        display: block;
        /* 旋转支点略上移，落点更靠近蛋体上半部（配合 positionHammer 的 top） */
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
