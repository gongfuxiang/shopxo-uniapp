<template>
    <view v-if="!is_loading" class="flex-row align-c jc-c pa-20 box-border-box bg-f9 oh" :style="good_style">
        <block v-if="good_list.length > 0">
            <view class="goods-header-fixed" :style="'width:' + windowWidth + 'px;'">
                <view class="flex-row align-c jc-sb pa-10">
                    <text class="flex-1 size-12 cr-b mr-10">{{ isGoodsPopup ? '' : '以下商品开播后自动添加到小黄车' }}</text>
                    <view class="flex-row align-c">
                        <button v-if="!isGoodsPopup" type="primary" plain class="btn-block cr-main flex-row align-c jc-c pa-5" style="width: 150rpx;height:68rpx;border-radius: 10rpx;"><text class="size-14 cr-main">取消</text></button>
                        <button type="primary" class="btn-block cr-main ml-10 flex-row align-c jc-c pa-5" style="width: 130rpx;height:68rpx;border-radius: 10rpx;border: 2rpx solid #0079ff;"><text class="size-14 cr-f">添加</text></button>
                    </view>
                </view>
            </view>
            <!-- nvue 使用 list进行列表渲染 -->
            <!-- #ifdef APP-NVUE -->
            <list class="scroll-type" :style="good_style + (isGoodsPopup ? 'padding-bottom: 20rpx;' : '' )" :show-scrollbar="false">
                <cell v-for="(item, index) in good_list" :key="item.id">
            <!-- #endif -->
            <!-- scroll-view 只有非nvue的页面使用 -->
            <!-- #ifndef APP-NVUE -->
            <scroll-view scroll-y class="scroll-type" :style="good_style + (isGoodsPopup ? 'padding-bottom: 20rpx;' : '' )" :show-scrollbar="false">
                <view v-for="(item, index) in good_list" :key="item.id">
            <!-- #endif -->
                    <view :class="'goods-item flex-row align-c' + (item.id == explanation_id ? ' bg-red-light' : '')" :style="'width:' + (windowWidth - 20) + 'px;'" :data-index="index" :data-value="item.checkbox">
                        <view class="flex-1">
                            <view class="flex-row align-c">
                                <view class="re goods-item-image-container">
                                    <!-- #ifndef APP-NVUE -->
                                    <image :class="isGoodsPopup ? 'goods-item-popup-image' : 'goods-item-image'" :src="item.images" mode="aspectFit"></image>
                                    <!-- #endif -->
                                    <!-- #ifdef APP-NVUE -->
                                    <image :class="isGoodsPopup ? 'goods-item-popup-image' : 'goods-item-image'" :src="item.images" mode="aspectFit"></image>
                                    <!-- #endif -->
                                    <text class="image-top-index">{{ index + 1 }}</text>
                                    <!-- 音乐进度条 -->
                                    <view v-if="item.id == explanation_id" class="music-progress-container flex-row align-c jc-c" :style="isGoodsPopup ? 'width: 200rpx;' : 'width: 120rpx;'">
                                        <!-- #ifndef APP-NVUE -->
                                        <view class="music-progress-bars mr-5">
                                            <view class="music-bar bar1"></view>
                                            <view class="music-bar bar2"></view>
                                            <view class="music-bar bar3"></view>
                                        </view>
                                        <!-- #endif -->
                                        <!-- #ifdef APP-NVUE -->
                                        <view class="music-progress-bars mr-5">
                                            <view :ref="(el) => { if(item.id == explanation_id) bar1Ref[index] = el }" class="music-bar nvue-bar"></view>
                                            <view :ref="(el) => { if(item.id == explanation_id) bar2Ref[index] = el }" class="music-bar nvue-bar"></view>
                                            <view :ref="(el) => { if(item.id == explanation_id) bar3Ref[index] = el }" class="music-bar nvue-bar"></view>
                                        </view>
                                        <!-- #endif -->
                                        <text class="size-12 cr-f">讲解中</text>
                                    </view>
                                </view>
                                <view :class="isGoodsPopup ? 'ml-10 flex-1 flex-col jc-sb goods-item-popup-content' : 'ml-10 flex-1 flex-col jc-sb goods-item-content'" >
                                    <template v-if="!isGoodsPopup">
                                        <text class="goods-item-title text-line-2">{{ item.title }}</text>
                                        <view class="flex-row align-c jc-sb">
                                            <view class="flex-row align-c">
                                                <text class="mr-5 size-10 cr-9">{{ item.show_price_symbol}}</text>
                                                <text class="goods-item-price size-10 cr-price">{{ item.price }}</text>
                                                <text class="ml-5 size-10 cr-9">{{ item.show_price_unit }}</text>
                                            </view>
                                            <view class="flex-row align-c">
                                                <text class="mr-5 size-10 cr-9">库存</text>
                                                <text class="goods-item-inventory size-10 cr-9">{{ item.inventory }}</text>
                                            </view>
                                        </view>
                                    </template>
                                    <template v-else>
                                        <text class="flex-1 goods-item-title text-line-2">{{ item.title }}</text>
                                        <view class="flex-1 mt-10">
                                            <view class="flex-1 flex-row align-c jc-sb">
                                                <view class="flex-row align-c">
                                                    <text class="mr-5 size-10 cr-9">{{ item.show_price_symbol}}</text>
                                                    <text class="goods-item-price size-10 cr-price">{{ item.price }}</text>
                                                    <text class="ml-5 size-10 cr-9">{{ item.show_price_unit }}</text>
                                                </view>
                                                <view class="flex-row align-c">
                                                    <text class="mr-5 size-10 cr-9">库存</text>
                                                    <text class="goods-item-inventory size-10 cr-9">{{ item.inventory }}</text>
                                                </view>
                                            </view>
                                            <view class="flex-row align-c mt-10 jc-e">
                                                <button v-if="index !== 0" type="primary" plain class="btn-block cr-main mr-10 ml-0 flex-row align-c jc-c pa-5" style="width: 100rpx;height:48rpx;border-radius: 10rpx" :data-id="item.id" @tap="top_good"><text class="size-14 cr-main">置顶</text></button>
                                                <button type="primary" class="btn-block bg-red mr-10 ml-0 flex-row align-c jc-c pa-5" style="width: 100rpx;height:48rpx;border-radius: 10rpx;border: 2rpx solid #e22c08;" :data-id="item.id" @tap="delete_good"><text class="size-14 cr-f">删除</text></button>
                                                <button v-if="isGoodsPopup" type="primary" class="btn-block cr-main mr-0 ml-0 flex-row align-c jc-c pa-5" style="width: 100rpx;height:48rpx;border-radius: 10rpx;border: 2rpx solid #0079ff;" :data-id="item.id" @tap="explanation"><text class="size-14 cr-f">{{ item.id == explanation_id ? '取消' : '讲解' }}</text></button>
                                            </view>
                                        </view>
                                    </template>
                                </view>
                            </view>
                            <view v-if="!isGoodsPopup" class="flex-row align-c jc-e mt-10">
                                <button v-if="index !== 0" type="primary" plain class="btn-block cr-main mr-10 ml-0 flex-row align-c jc-c pa-5" style="width: 100rpx;height:48rpx;border-radius: 10rpx" :data-id="item.id" @tap="top_good"><text class="size-14 cr-main">置顶</text></button>
                                <button type="primary" class="btn-block bg-red mr-10 ml-0 flex-row align-c jc-c pa-5" style="width: 100rpx;height:48rpx;border-radius: 10rpx;border: 2rpx solid #e22c08;" :data-id="item.id" @tap="delete_good"><text class="size-14 cr-f">删除</text></button>
                                <button v-if="isGoodsPopup" type="primary" class="btn-block cr-main mr-0 ml-0 flex-row align-c jc-c pa-5" style="width: 100rpx;height:48rpx;border-radius: 10rpx;border: 2rpx solid #0079ff;" :data-id="item.id" @tap="explanation"><text class="size-14 cr-f">{{ item.id == explanation_id ? '取消' : '讲解' }}</text></button>
                            </view>
                        </view>
                    </view>
            <!-- #ifdef APP-NVUE -->
                </cell>
                <cell>
                    <u-bottom-line :status="bottom_line_status" :width="windowWidth"></u-bottom-line>
                </cell>
            </list>
            <!-- #endif -->
            <!-- #ifndef APP-NVUE -->
                </view>
                <u-bottom-line :status="bottom_line_status"></u-bottom-line>
            </scroll-view>
            <!-- #endif -->
        </block>
        <block v-else>
            <view class="flex-1 flex-col align-c">
                <text class="tip-title">暂无商品</text>
            </view>
        </block>
    </view>
</template>

<script>
const app = getApp();

export default {
    name: 'Goods',
    props: {
        // isGoodsPopup 是否是商品弹出框，弹出框一般是用在直播页显示的商品列表，直播开始前isGoodsPopup是false，显示的是一整个页面
        isGoodsPopup: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            //#region 初始化
            // 搜索按钮点击事件
            page: 1,
            is_loading: true,
            //#endregion
            
            //#region 打开商品弹出框
            popup_goods_show: false,
            good_list: [],
            // 获取屏幕大小, 这个组件需要再vue页面和nvue页面使用，所以不能设置为100%，需要获取固定屏幕大小
            windowWidth: 0,
            windowHeight: 0,
            //#endregion
    
            //#region 商品列表处理
            bottom_line_status: true,
            explanation_id: '',
            //#endregion
            
            //#region 音乐进度条相关逻辑
            // #ifdef APP-NVUE
            // 在nvue平台，使用transition动画实现
            nvue_animation: null,
            bar1Ref: [],
            bar2Ref: [],
            bar3Ref: [],
            animationTimers: [],
            // #endif
            //#endregion
        }
    },
    computed: {
        //#region 设置页面屏幕大小
        good_style() {
            // 判断是否是弹出框形式
            if (!this.isGoodsPopup) {
                return `width:${ this.windowWidth }px;height: ${ this.windowHeight }px;`;
            } else {
                // 如果是弹出框模式的就不全屏显示
                return `width:${ this.windowWidth }px;height: ${ this.windowHeight - 300}px;`;
            }
        },
        //#endregion
        
        // 获取选中数量
        checkbox_number() {
            return this.good_list.filter(item => item.checkbox).length;
        }
    },
    watch: {
        //#region 音乐进度条相关逻辑
        // #ifdef APP-NVUE
        // 监听正在讲解的商品ID变化
        explanation_id: {
            handler(newVal, oldVal) {
                // 先停止所有动画
                this.stop_nvue_animation();
                
                if (newVal) {
                    // 延迟启动动画，确保元素已渲染
                    setTimeout(() => {
                        // 找到正在讲解的商品索引
                        const index = this.good_list.findIndex(item => item.id == newVal);
                        if (index !== -1) {
                            this.start_nvue_height_animation(this.bar1Ref[index], 100);
                            this.start_nvue_height_animation2(this.bar2Ref[index], 300);
                            this.start_nvue_height_animation3(this.bar3Ref[index], 500);
                        }
                    }, 50);
                }
            }
        }
        // #endif
        //#endregion
    },
    mounted() {
        const data = uni.getWindowInfo();
        this.windowWidth = data.windowWidth;
        this.windowHeight = data.windowHeight;
        this.init();
        
        // #ifdef APP-NVUE
        this.nvue_animation = uni.requireNativePlugin('animation');
        // #endif
    },
    onShow() {
        this.init();
    },
    beforeDestroy() {
        // #ifdef APP-NVUE
        this.stop_nvue_animation();
        // #endif
    },
    methods: {
        //#region 初始化
        init() {
            if (!this.isGoodsPopup) {
                this.is_loading = true;
            } else {
                this.is_loading = false;
            }
            uni.showLoading({
                title: '加载中...',
                mask: true
            });
            uni.request({
                url: app.globalData.get_request_url('index,roomgoods,live'),
                method: 'POST',
                data: {},
                dataType: 'json',
                success: (res) => { 
                    uni.hideLoading();
                    this.is_loading = false;
                    if (res.code == 0) {
                        this.good_list = res.data;
                    }
                },
                fail: () => {
                    uni.hideLoading();
                    this.is_loading = false;
                }
            });
        },
        //#endregion
        
        //#region 打开商品弹出框
        // 添加商品
        add_goods() {
            this.popup_goods_show = false;
            this.$nextTick(() => {
                this.popup_goods_show = true;
                this.$refs.popupGoodsRef.open();
            })
        },
        
        // 添加商品弹出框事件
        submitEvent() {
            this.$refs.popupGoodsRef.close();
            // 刷新数据
            this.init();
        },
        //#endregion
        
        //#region 商品列表处理
        // 讲解商品
        explanation(e) {
            // 讲解商品
            const id = e.currentTarget.dataset.id;
            if (id != null && id != this.explanation_id) {
                this.explanation_id = id;
            } else {
                this.explanation_id = '';
            }
        },
        //#endregion
        
        //#region 音乐进度条相关逻辑
        // #ifdef APP-NVUE
        // 高度动态变化的动画（与vue平台CSS动画频率一致）
        start_nvue_height_animation(barRef, delay) {
            if (!barRef) return;
            
            const animateBar = () => {
                if (!barRef) return;
                
                // 第一阶段：伸长到不同高度
                this.nvue_animation.transition(barRef, {
                    styles: {
                        transform: 'scaleY(2.8)'
                    },
                    duration: 165, // 1.1s * 0.15
                    timingFunction: 'ease-in-out'
                }, () => {
                    if (!barRef) return;
                    
                    // 第二阶段：稍微收缩
                    this.nvue_animation.transition(barRef, {
                        styles: {
                            transform: 'scaleY(1.2)'
                        },
                        duration: 165, // 1.1s * 0.15
                        timingFunction: 'ease-in-out'
                    }, () => {
                        if (!barRef) return;
                        
                        // 第三阶段：进一步伸长
                        this.nvue_animation.transition(barRef, {
                            styles: {
                                transform: 'scaleY(3.5)'
                            },
                            duration: 165, // 1.1s * 0.15
                            timingFunction: 'ease-in-out'
                        }, () => {
                            if (!barRef) return;
                            
                            // 第四阶段：收缩到中等高度
                            this.nvue_animation.transition(barRef, {
                                styles: {
                                    transform: 'scaleY(1.8)'
                                },
                                duration: 165, // 1.1s * 0.15
                                timingFunction: 'ease-in-out'
                            }, () => {
                                if (!barRef) return;
                                
                                // 第五阶段：轻微伸长
                                this.nvue_animation.transition(barRef, {
                                    styles: {
                                        transform: 'scaleY(2.2)'
                                    },
                                    duration: 165, // 1.1s * 0.15
                                    timingFunction: 'ease-in-out'
                                }, () => {
                                    if (!barRef) return;
                                    
                                    // 第六阶段：回到初始高度
                                    this.nvue_animation.transition(barRef, {
                                        styles: {
                                            transform: 'scaleY(1)'
                                        },
                                        duration: 165, // 1.1s * 0.15
                                        timingFunction: 'ease-in-out'
                                    }, () => {
                                        // 随机延迟后继续动画
                                        const randomDelay = 100 + Math.random() * 500;
                                        const timer = setTimeout(animateBar, randomDelay);
                                        this.animationTimers.push(timer);
                                    });
                                });
                            });
                        });
                    });
                });
            };
            
            // 初始延迟
            const timer = setTimeout(animateBar, delay);
            this.animationTimers.push(timer);
        },
        
        // 为第二个条形定义动画序列（1.4s周期）
        start_nvue_height_animation2(barRef, delay) {
            if (!barRef) return;
            
            const animateBar = () => {
                if (!barRef) return;
                
                // 按照CSS动画的关键帧定义
                const steps = [
                    { scale: 1.5, duration: 140 },   // 1.4s * 0.1
                    { scale: 3, duration: 140 },     // 1.4s * 0.1
                    { scale: 2, duration: 140 },     // 1.4s * 0.1
                    { scale: 4, duration: 140 },     // 1.4s * 0.1
                    { scale: 1.2, duration: 140 },   // 1.4s * 0.1
                    { scale: 2.5, duration: 140 },   // 1.4s * 0.1
                    { scale: 1.7, duration: 140 },   // 1.4s * 0.1
                    { scale: 3.2, duration: 140 },   // 1.4s * 0.1
                    { scale: 1.4, duration: 140 },   // 1.4s * 0.1
                    { scale: 1, duration: 140 }      // 1.4s * 0.1
                ];
                
                let stepIndex = 0;
                
                const executeStep = () => {
                    if (stepIndex >= steps.length) {
                        // 循环完成，随机延迟后重新开始
                        const randomDelay = 100 + Math.random() * 500;
                        const timer = setTimeout(animateBar, randomDelay);
                        this.animationTimers.push(timer);
                        return;
                    }
                    
                    const { scale, duration } = steps[stepIndex];
                    this.nvue_animation.transition(barRef, {
                        styles: {
                            transform: `scaleY(${scale})`
                        },
                        duration: duration,
                        timingFunction: 'ease-in-out'
                    }, () => {
                        stepIndex++;
                        executeStep();
                    });
                };
                
                executeStep();
            };
            
            // 初始延迟
            const timer = setTimeout(animateBar, delay);
            this.animationTimers.push(timer);
        },
        
        // 为第三个条形定义动画序列（0.9s周期）
        start_nvue_height_animation3(barRef, delay) {
            if (!barRef) return;
            
            const animateBar = () => {
                if (!barRef) return;
                
                // 按照CSS动画的关键帧定义
                const steps = [
                    { scale: 3.8, duration: 225 },   // 0.9s * 0.25
                    { scale: 1.6, duration: 225 },   // 0.9s * 0.25
                    { scale: 2.6, duration: 225 },   // 0.9s * 0.25
                    { scale: 1, duration: 225 }      // 0.9s * 0.25
                ];
                
                let stepIndex = 0;
                
                const executeStep = () => {
                    if (stepIndex >= steps.length) {
                        // 循环完成，随机延迟后重新开始
                        const randomDelay = 100 + Math.random() * 500;
                        const timer = setTimeout(animateBar, randomDelay);
                        this.animationTimers.push(timer);
                        return;
                    }
                    
                    const { scale, duration } = steps[stepIndex];
                    this.nvue_animation.transition(barRef, {
                        styles: {
                            transform: `scaleY(${scale})`
                        },
                        duration: duration,
                        timingFunction: 'ease-in-out'
                    }, () => {
                        stepIndex++;
                        executeStep();
                    });
                };
                
                executeStep();
            };
            
            // 初始延迟
            const timer = setTimeout(animateBar, delay);
            this.animationTimers.push(timer);
        },
        
        stop_nvue_animation() {
            // 清除所有定时器
            this.animationTimers.forEach(timer => {
                clearTimeout(timer);
            });
            this.animationTimers = [];
            
            // 重置所有条状元素
            const resetBar = (barRef) => {
                if (barRef) {
                    this.nvue_animation.transition(barRef, {
                        styles: {
                            transform: 'scaleY(1)'
                        },
                        duration: 100
                    });
                }
            };
            
            // 重置当前所有引用的元素
            this.bar1Ref.forEach(resetBar);
            this.bar2Ref.forEach(resetBar);
            this.bar3Ref.forEach(resetBar);
        },
        // #endif
        //#endregion
        
        back() {
            app.globalData.page_back_prev_event();
        }
    }
}
</script>

<style lang="scss" scoped>
.tip-title {
    font-size: 44rpx;
    font-weight: bold;
    color: #000;
}
.goods-header-fixed {
    position: absolute;
    top: 0;
    left:0;
    z-index: 9;
}
.goods-bottom-fixed {
    position: absolute;
    left: 0;
    bottom:0;
    z-index: 8;
}
.scroll-type {
    padding: 124rpx 10px;
    box-sizing: border-box;
}
.checkbox {
    transform: scale(0.85);
}
.goods-item {
    background: #fff;
    margin-bottom: 20rpx;
    padding: 30rpx 40rpx;
    border-radius: 20rpx;
    .goods-item-image-container {
        border-radius: 10rpx;
		overflow: hidden;
    }
    .goods-item-popup-image {
        width: 200rpx;
        height: 200rpx;
    }
    .goods-item-image {
        width: 120rpx;
        height: 120rpx;
    }
    .goods-item-title {
        font-weight: 500;
        font-size: 28rpx;
        color: #333;
    }
    .goods-item-content {
        height: 120rpx;
    }
    .goods-item-popup-content {
        height: 200rpx;
    }
}

.image-top-index {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 24rpx;
    padding: 4rpx 16rpx;
    border-top-left-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    z-index: 3;
}
/* #ifdef APP-NVUE */
.select-all {
    margin-left: 6rpx;
}
/* #endif */

.music-progress-container {
    position: absolute;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    padding: 10rpx 0;
    border-bottom-left-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    z-index: 3;
}

.music-progress-bars {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end; /* 底部对齐 */
    height: 20rpx;
}

.music-bar {
    width: 4rpx;
    height: 4rpx; /* 初始高度较小 */
    background-color: #fff;
    margin: 0 4rpx;
    transform-origin: bottom; /* 以底部为变换中心 */
}

.nvue-bar {
    width: 4rpx;
    height: 6rpx;
    background-color: #fff;
    margin: 0 4rpx;
    transform-origin: bottom; /* 以底部为变换中心 */
}

// #ifndef APP-NVUE
.bar1 {
    animation: beat1 1.1s infinite ease-in-out;
}

.bar2 {
    animation: beat2 1.4s infinite ease-in-out;
}

.bar3 {
    animation: beat3 0.9s infinite ease-in-out;
}

@keyframes beat1 {
    0% {
        transform: scaleY(1);
    }
    15% {
        transform: scaleY(2.8);
    }
    30% {
        transform: scaleY(1.2);
    }
    45% {
        transform: scaleY(3.5);
    }
    60% {
        transform: scaleY(1.8);
    }
    75% {
        transform: scaleY(2.2);
    }
    100% {
        transform: scaleY(1);
    }
}

@keyframes beat2 {
    0% {
        transform: scaleY(1);
    }
    10% {
        transform: scaleY(1.5);
    }
    20% {
        transform: scaleY(3);
    }
    30% {
        transform: scaleY(2);
    }
    40% {
        transform: scaleY(4);
    }
    50% {
        transform: scaleY(1.2);
    }
    60% {
        transform: scaleY(2.5);
    }
    70% {
        transform: scaleY(1.7);
    }
    80% {
        transform: scaleY(3.2);
    }
    90% {
        transform: scaleY(1.4);
    }
    100% {
        transform: scaleY(1);
    }
}

@keyframes beat3 {
    0% {
        transform: scaleY(1);
    }
    25% {
        transform: scaleY(3.8);
    }
    50% {
        transform: scaleY(1.6);
    }
    75% {
        transform: scaleY(2.6);
    }
    100% {
        transform: scaleY(1);
    }
}
// #endif
</style>

