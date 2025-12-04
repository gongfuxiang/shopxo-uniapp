<template>
    <view class="like-button">
        <!-- #ifdef APP-NVUE -->
        <list class="animate-wrap">
            <cell class="a-img" v-for="(item,index) in viewList" :key="item.elId" :ref="item.elId" :style="{ 'right': propSite.x || propSite[0] + 'rpx', 'bottom': propSite.y || propSite[1] + 'rpx'}">
                <image :style="{ 'width': propImgWidth + 'rpx', 'height': propImgHeight + 'rpx'}" mode="widthFix" :src="item.src" :animation="item.animation"></image>
            </cell>
        </list>
        <!-- #endif -->
        <!-- #ifndef APP-NVUE -->
        <view class="animate-wrap">
            <view class="a-img" v-for="(item,index) in viewList" :key="item.elId" :ref="item.elId" :style="{ 'right': propSite.x || propSite[0] + 'rpx', 'bottom': propSite.y || propSite[1] + 'rpx'}">
                <image :style="{'width': propImgWidth + 'rpx', 'height': propImgHeight + 'rpx'}" mode="widthFix" :src="item.src" :animation="item.animation"></image>
            </view>
        </view>
        <!-- #endif -->
        <view class="on-button">
            <view ref="likeBtn" id="like-btn" class="el-like-btn" @tap="handleClick">
                <slot></slot>
            </view>
        </view>
    </view>

</template>

<script>
    export default {
        props: {
            propShowImgs: { // 显示图标路径
                type: Array,
                default: () => {
                    return []
                }
            },
            propDuration: { // 动画效果时间
                type: Number,
                default: 5000
            },
            propRange: { // x 间隔幅度
                type: Number,
                default: 50
            },
            propHigh: { // 图标高度
                type: Number,
                default: 200
            },
            propWidth: { // 图标宽度
                type: Number || String,
                default: 52
            },
            propHeight: { // 图标高度
                type: Number || String,
                default: 52
            },
            propImgWidth: { // 图标宽度
                type: Number || String,
                default: 52
            },
            propImgHeight: { // 图标高度
                type: Number || String,
                default: 52
            },
            propThrottle: { // 点击节流 ms
                type: Number,
                default: 200
            },
            propSite: { // x y 坐标 [x<Number>, y<Number>]
                type: Array || Object,
                default: () => {
                    return [122, 95] || {
                        x: 122,
                        y: 95
                    }
                }
            },
            propLarge: { // 是否缩放冒泡
                type: [Number, Boolean],
                default: false
            },
            propAlone: {
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
                if (interval < this.propThrottle) return null;
                this.oldTime = e.timeStamp
                let animation = {}
                // 创建animate配置
                // #ifdef APP-NVUE
                animation = weex.requireModule('animation')
                // #endif
                let randomImg = Math.floor(Math.random() * this.propShowImgs.length)
                let _item = {
                    elId: 'el_likeicon_' + this.elId, // 生成元素ref
                    src: this.propShowImgs[randomImg], // 随机图标
                    animation: animation, // 每个盒子动画
                    x: Math.ceil(Math.random() * this.propRange), // 方向间距
                    q: Math.floor(Math.random() * 2), // 随机方向
                }
                // 动画
                let _abs = ['-', '']
                let _dirX = Number(_abs[_item.q] + _item.x) // 随机的方向和间距
                let _dirY = this.propHigh - Math.random() * 10
                // 生成DOM
                this.elId++
                this.viewList.push(_item)
                // #ifndef APP-NVUE
                _item.animation = uni.createAnimation({
                    duration: this.propDuration,
                    timingFunction: 'ease-out',
                })
                setTimeout(() => {
                    // 完成后事件回调
                    this.$emit('finished')
                    // 逐渐消失
                    if (this.propAlone) {
                        this.waitDeleteIndex++
                        this.onThrottle(this.deleteView, this.propDuration)
                        return null;
                    } else {
                        // 完成动画后在n秒后清空
                        clearTimeout(this.timer)
                        this.timer = setTimeout(() => {
                            this.viewList = []
                        }, this.propDuration)
                        return null;
                    }
                }, this.propDuration)
                // #endif
                // 执行动画
                setTimeout(() => {
                    this.$nextTick(() => {
                        let _n = 1
                        if (this.propLarge) _n = typeof(this.propLarge) === 'number' ? this.propLarge : 2;
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
                            duration: this.propDuration, // ms
                            timingFunction: 'ease-out',
                            delay: 0 // ms
                        }, () => {
                            console.log('animation finished.')
                            // 完成后事件回调
                            this.$emit('finished')
                            // 逐渐消失
                            if (this.propAlone) {
                                this.waitDeleteIndex++
                                this.onThrottle(this.deleteView, this.propDuration)
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

<style lang="scss" scoped>
    .a-img {
        position: fixed;
    }
</style>