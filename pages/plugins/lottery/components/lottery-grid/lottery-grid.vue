<template>
    <view class="page-width-max lottery-grid-outer">
        <view class="lottery-grid-canvas">
            <view class="lottery-grid-bg">
                <image :src="nImg" mode="aspectFill" class="lottery-bg-img"></image>
            </view>
            <view class="luck-list">
                <view
                    v-for="(item, index) in AwardList"
                    :key="index"
                    class="cell-item"
                    :class="index == 4 || index === sel ? 'y-b' : 'w-b'"
                    @tap="begin(index)"
                >
                    <view class="cell-content" :class="index == 4 || index === sel ? 'y' : 'w'">
                        <view v-if="item.image" class="lottery-cell-img-wrap" :class="{ radius: index !== 4 }">
                            <image
                                :src="item.image"
                                mode="aspectFill"
                                class="lottery-cell-img"
                            ></image>
                        </view>
                        <view class="lottery-cell-name">
                            <text class="lottery-cell-text" :class="{ 'lottery-cell-text-draw-btn': index === 4 }">{{ item.name }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            // 背景图
            nImg: String,
            // 列表
            AwardList: {
                type: Array,
                default: () => [],
            },
            // 中奖索引
            sjNum: {
                type: Number,
                default: 0,
            },
            // 抽奖触发计数，值变更后启动转盘
            drawTrigger: {
                type: Number,
                default: 0,
            },
        },
        watch: {
            /**
             * 父组件 drawTrigger 递增后启动转盘
             * @param {number} val 新计数
             * @param {number} oldVal 旧计数
             */
            drawTrigger(val, oldVal) {
                if (val !== oldVal && val > 0) {
                    this.startLoop();
                }
            },
        },
        data() {
            return {
                sel: '',
                FastNums: 0,
                SlowNums: 0,
                time: 1000,
                LoopStatus: true,
                noClick: true,
            };
        },
        methods: {
            /**
             * 转盘停在目标格后通知父组件展示结果
             * @param {number} sjNum 中奖格子索引
             */
            updateMoney(sjNum) {
                this.$emit('updateMoney', sjNum);
            },
            /**
             * 格子点击：中间格触发抽奖，其余格忽略
             * @param {number} index 格子索引（4 为抽奖按钮）
             */
            begin(index) {
                if (index == 4) {
                    if (!this.noClick) {
                        uni.showToast({
                            title: '请勿频繁点击',
                            icon: 'none',
                            position: 'bottom',
                        });
                        return;
                    }
                    this.$emit('beforeDraw');
                }
            },
            /**
             * 初始化转盘状态并开始循环高亮
             */
            startLoop() {
                this.noClick = false;
                this.FastNums = 0;
                this.SlowNums = 0;
                this.time = 200;
                this.LoopStatus = true;
                this.loop();
            },
            /**
             * 按速度递减高亮路径，停在 props.sjNum 对应格后结束
             */
            loop() {
                let sjNum = this.sjNum;
                if (!this.sel || this.sel < 9) {
                    if (this.sel == 3) {
                        this.sel = 0;
                    } else if (this.sel === '') {
                        this.sel = 0;
                    } else if (this.sel == 2) {
                        this.sel = 5;
                    } else if (this.sel == 5) {
                        this.sel = 8;
                    } else if (this.sel == 8) {
                        this.sel = 7;
                    } else if (this.sel == 7) {
                        this.sel = 6;
                    } else if (this.sel == 6) {
                        this.sel = 3;
                    } else {
                        this.sel++;
                    }
                    this.FastNums++;
                    if (this.FastNums == 4) {
                        this.FastNums = 0;
                        this.time = 50;
                        this.SlowNums++;
                    }
                    if (this.SlowNums == 8) {
                        this.SlowNums = 0;
                        this.time = 500;
                        this.FastNums = 5;
                    }
                    if (this.FastNums > 5) {
                        if (this.sel == sjNum) {
                            this.noClick = true;
                            this.LoopStatus = false;
                            this.updateMoney(sjNum);
                        }
                    }
                    if (this.LoopStatus) {
                        setTimeout(() => {
                            this.loop();
                        }, this.time);
                    }
                }
            },
        },
    };
</script>

<style scoped>
    .lottery-grid-outer {
        background-color: #1015f2;
        min-height: 100%;
    }

    .lottery-grid-canvas {
        position: relative;
        width: 100%;
        margin: 0 auto;
    }

    .lottery-grid-bg {
        position: relative;
        width: 100%;
        aspect-ratio: 750 / 1338;
        overflow: hidden;
    }

    .lottery-bg-img {
        display: block;
        width: 100%;
        height: 100%;
    }

    /* 九宫格：宽高比、位置、间距按底图槽位微调（与背景图对齐） */
    .luck-list {
        position: absolute;
        left: 50%;
        top: 32%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        width: 60%;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        aspect-ratio: 500 / 530;
        -webkit-column-gap: 1.33%;
        column-gap: 4%;
        row-gap: 4%;
    }

    .cell-item {
        width: 100%;
        height: 100%;
        min-height: 0;
        min-width: 0;
        box-sizing: border-box;
        padding: 1.1%;
        border-radius: 18%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cell-content {
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 16%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 6% 4%;
    }

    .lottery-cell-img-wrap {
        width: 52%;
        height: 0;
        padding-top: 52%;
        position: relative;
        flex-shrink: 0;
        overflow: hidden;
    }
    .lottery-cell-img {
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
    }

    .lottery-cell-name {
        margin-top: 4%;
        width: 100%;
        text-align: center;
        line-height: 1.2;
    }

    .lottery-cell-text {
        font-size: 24rpx;
        font-weight: bold;
    }
    .lottery-cell-text-draw-btn {
        font-size: 20rpx;
        font-weight: normal;
    }

    .w {
        background-color: #fdf2ee;
    }

    .w-b {
        background-color: #f8d0c3;
    }
    .y {
        background-color: #fee610;
    }

    .y-b {
        background-color: #efcd22;
    }
</style>
