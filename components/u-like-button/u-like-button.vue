<template>
    <view class="like-button">
        <!-- #ifdef APP-NVUE -->
        <list class="animate-wrap">
            <cell class="a-img" v-for="(item,index) in viewList" :key="item.elId" :ref="item.elId" :style="{ 'right': site.x || site[0] + 'rpx', 'bottom': site.y || site[1] + 'rpx'}">
                <image :style="{ 'width': imgWidth + 'rpx', 'height': imgHeight + 'rpx'}" mode="widthFix" :src="item.src" :animation="item.animation"></image>
            </cell>
        </list>
        <!-- #endif -->
        <!-- #ifndef APP-NVUE -->
        <view class="animate-wrap">
            <view class="a-img" v-for="(item,index) in viewList" :key="item.elId" :ref="item.elId" :style="{ 'right': site.x || site[0] + 'rpx', 'bottom': site.y || site[1] + 'rpx'}">
                <image :style="{'width': imgWidth + 'rpx', 'height': imgHeight + 'rpx'}" mode="widthFix" :src="item.src" :animation="item.animation"></image>
            </view>
        </view>
        <!-- #endif -->
        <view class="on-button">
            <image :src="src" mode="widthFix" :style="{ 'width': width + 'rpx', 'height': height + 'rpx' }" v-if="!$slots.default" @click="handleClick"></image>
            <view class="el_like_btn" @click="handleClick">
                <slot></slot>
            </view>
        </view>
    </view>

</template>

<script>
    export default {
        props: {
            src: {
                type: String,
                default: '/static/images/green/tabbar/cart.png'
            },
            showImgs: { // 显示图标路径
                type: Array,
                default: () => {
                    return [
                        `data:image/png;base64,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`,
                        '/static/images/green/tabbar/cart.png',
                    ]
                }
            },
            duration: { // 动画效果时间
                type: Number,
                default: 5000
            },
            range: { // x 间隔幅度
                type: Number,
                default: 50
            },
            high: {
                type: Number,
                default: 360
            },
            width: { // 图标宽度
                type: Number || String,
                default: 52
            },
            height: { // 图标高度
                type: Number || String,
                default: 52
            },
            imgWidth: { // 图标宽度
                type: Number || String,
                default: 52
            },
            imgHeight: { // 图标高度
                type: Number || String,
                default: 52
            },
            throttle: { // 点击节流 ms
                type: Number,
                default: 200
            },
            site: { // x y 坐标 [x<Number>, y<Number>]
                type: Array || Object,
                default: () => {
                    return [30, 160] || {
                        x: 30,
                        y: 160
                    }
                }
            },
            large: { // 是否缩放冒泡
                type: [Number, Boolean],
                default: false
            },
            alone: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                viewList: [], // 渲染元素
                elId: 0, // 元素渲染id
                oldTime: 0, // 全局时间用于函数节流
                timer: null, // 定时器
                waitDeleteIndex: 0
            }
        },
        watch: {},
        methods: {
            handleClick(e) {
                // 函数节流
                let interval = e.timeStamp - this.oldTime
                if (interval < this.throttle) return null;
                this.oldTime = e.timeStamp
                let animation = {}
                // 创建animate配置
                // #ifdef APP-NVUE
                animation = weex.requireModule('animation')
                // #endif
                let randomImg = Math.floor(Math.random() * this.showImgs.length)
                let _item = {
                    elId: 'el_likeicon_' + this.elId, // 生成元素ref
                    src: this.showImgs[randomImg], // 随机图标
                    animation: animation, // 每个盒子动画
                    x: Math.ceil(Math.random() * this.range), // 方向间距
                    q: Math.floor(Math.random() * 2), // 随机方向
                }
                // 动画
                let _abs = ['-', '']
                let _dirX = Number(_abs[_item.q] + _item.x) // 随机的方向和间距
                let _dirY = this.high - Math.random() * 10
                // 生成DOM
                this.elId++
                this.viewList.push(_item)
                // #ifndef APP-NVUE
                _item.animation = uni.createAnimation({
                    duration: this.duration,
                    timingFunction: 'ease-out',
                })
                setTimeout(() => {
                    console.log('animation finished.')
                    // 完成后事件回调
                    this.$emit('finished')
                    // 逐渐消失
                    if (this.alone) {
                        this.waitDeleteIndex++
                        this.onThrottle(this.deleteView, this.duration)
                        return null;
                    } else {
                        // 完成动画后在n秒后清空
                        clearTimeout(this.timer)
                        this.timer = setTimeout(() => {
                            this.viewList = []
                        }, this.duration)
                        return null;
                    }
                }, this.duration)
                // #endif
                // 执行动画
                setTimeout(() => {
                    this.$nextTick(() => {
                        let _n = 1
                        if (this.large) _n = typeof(this.large) === 'number' ? this.large : 2;
                        // #ifndef APP-NVUE
                        _item.animation.translateY(-_dirY).translateX(_dirX).scale(_n, _n).opacity(0).step()
                        _item.animation = _item.animation.export()
                        // #endif
                        // #ifdef APP-NVUE
                        let el = this.$refs[_item.elId][0];
                        clearTimeout(this.timer)
                        _item.animation.transition(el, {
                            styles: {
                                transform: `translate(${_dirX}rpx, -${_dirY}rpx) scale(${_n}, ${_n}])`,
                                transformOrigin: 'center center',
                                opacity: 0
                            },
                            duration: this.duration, // ms
                            timingFunction: 'ease-out',
                            delay: 0 // ms
                        }, () => {
                            console.log('animation finished.')
                            // 完成后事件回调
                            this.$emit('finished')
                            // 逐渐消失
                            if (this.alone) {
                                this.waitDeleteIndex++
                                this.onThrottle(this.deleteView, this.duration)
                                return null
                            } else {
                                // 完成动画后在n秒后清空
                                clearTimeout(this.timer)
                                this.timer = setTimeout(() => {
                                    this.viewList = []
                                }, this.duration)
                            }
                        })
                        // #endif
                    })
                }, 0)
                // 点击立即触发组件事件
                this.$emit('handleClick', this.elId)
            },
            deleteView() {
                this.viewList.splice(0, this.waitDeleteIndex)
                this.waitDeleteIndex = 0
            },
            onThrottle(fn, delay) {
                let verifi = true
                return (function() {
                    if (!verifi) return false;
                    verifi = false
                    setTimeout(() => {
                        fn()
                        verifi = true
                    }, delay)
                })()
            }
        }
    }
</script>

<style lang="scss">
    .a-img {
        position: fixed;
    }
</style>