<template>
    <view class="like-button">
        <!-- #ifdef APP-NVUE -->
        <!-- 在NVUE环境下使用list容器显示动画元素 -->
        <list class="animate-wrap">
            <!-- 循环渲染点赞动画元素 -->
            <cell class="a-img" v-for="(item,index) in viewList" :key="item.elId" :ref="item.elId" :style="{ 'right': propSite.x || propSite[0] + 'rpx', 'bottom': propSite.y || propSite[1] + 'rpx'}">
                <image :style="{ 'width': propImgWidth + 'rpx', 'height': propImgHeight + 'rpx'}" mode="widthFix" :src="item.src" :animation="item.animation"></image>
            </cell>
        </list>
        <!-- #endif -->
        <!-- #ifndef APP-NVUE -->
        <!-- 在非NVUE环境下使用view容器显示动画元素 -->
        <view class="animate-wrap">
            <!-- 循环渲染点赞动画元素 -->
            <view class="a-img" v-for="(item,index) in viewList" :key="item.elId" :ref="item.elId" :style="{ 'right': propSite.x || propSite[0] + 'rpx', 'bottom': propSite.y || propSite[1] + 'rpx'}">
                <image :style="{'width': propImgWidth + 'rpx', 'height': propImgHeight + 'rpx'}" mode="widthFix" :src="item.src" :animation="item.animation"></image>
            </view>
        </view>
        <!-- #endif -->
        <!-- 点赞按钮区域 -->
        <view class="on-button">
            <view ref="likeBtn" id="like-btn" class="el-like-btn" @tap="handleClick">
                <slot></slot>
            </view>
        </view>
    </view>

</template>

<script>
    /**
     * 点赞动画按钮组件
     * 实现点击按钮后产生飞出图标动画的效果，常用于直播场景中的点赞功能
     */
    export default {
        props: {
            /**
             * 显示图标路径数组
             * @type {Array}
             * @default []
             */
            propShowImgs: { // 显示图标路径
                type: Array,
                default: () => {
                    return []
                }
            },
            /**
             * 动画持续时间（毫秒）
             * @type {Number}
             * @default 5000
             */
            propDuration: { // 动画效果时间
                type: Number,
                default: 5000
            },
            /**
             * X轴方向随机幅度范围
             * @type {Number}
             * @default 50
             */
            propRange: { // x 间隔幅度
                type: Number,
                default: 50
            },
            /**
             * 图标飞行最大高度
             * @type {Number}
             * @default 200
             */
            propHigh: { // 图标高度
                type: Number,
                default: 200
            },
            /**
             * 组件宽度
             * @type {Number|String}
             * @default 52
             */
            propWidth: { // 图标宽度
                type: Number || String,
                default: 52
            },
            /**
             * 组件高度
             * @type {Number|String}
             * @default 52
             */
            propHeight: { // 图标高度
                type: Number || String,
                default: 52
            },
            /**
             * 图标宽度
             * @type {Number|String}
             * @default 52
             */
            propImgWidth: { // 图标宽度
                type: Number || String,
                default: 52
            },
            /**
             * 图标高度
             * @type {Number|String}
             * @default 52
             */
            propImgHeight: { // 图标高度
                type: Number || String,
                default: 52
            },
            /**
             * 点击节流时间（毫秒），防止过快点击
             * @type {Number}
             * @default 200
             */
            propThrottle: { // 点击节流 ms
                type: Number,
                default: 200
            },
            /**
             * 图标出现位置坐标
             * 可以是[x, y]数组或{x, y}对象格式
             * @type {Array|Object}
             * @default [122, 95]
             */
            propSite: { // x y 坐标 [x<Number>, y<Number>]
                type: Array || Object,
                default: () => {
                    return [122, 95] || {
                        x: 122,
                        y: 95
                    }
                }
            },
            /**
             * 是否启用缩放效果，可以设置为数字指定缩放倍数
             * @type {Number|Boolean}
             * @default false
             */
            propLarge: { // 是否缩放冒泡
                type: [Number, Boolean],
                default: false
            },
            /**
             * 是否单独移除动画元素（true时逐个删除，false时统一删除）
             * @type {Boolean}
             * @default true
             */
            propAlone: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                viewList: [], // 渲染元素列表
                elId: 0, // 元素渲染ID计数器
                oldTime: 0, // 上次点击时间戳，用于节流
                timer: null, // 定时器引用
                waitDeleteIndex: 0 // 等待删除的元素索引计数
            }
        },
        watch: {},
        methods: {
            /**
             * 处理点击事件，创建并播放点赞动画
             * @param {Event} e 点击事件对象
             */
            handleClick(e) {
                // 函数节流，防止过快点击
                let interval = e.timeStamp - this.oldTime
                if (interval < this.propThrottle) return null;
                this.oldTime = e.timeStamp
                let animation = {}
                // 创建animate配置
                // #ifdef APP-NVUE
                animation = weex.requireModule('animation')
                // #endif
                // 随机选择一个图标
                let randomImg = Math.floor(Math.random() * this.propShowImgs.length)
                // 构造动画元素数据
                let _item = {
                    elId: 'el_likeicon_' + this.elId, // 生成元素ref
                    src: this.propShowImgs[randomImg], // 随机图标
                    animation: animation, // 每个盒子动画
                    x: Math.ceil(Math.random() * this.propRange), // 方向间距
                    q: Math.floor(Math.random() * 2), // 随机方向
                }
                // 计算随机飞行方向和距离
                let _abs = ['-', '']
                let _dirX = Number(_abs[_item.q] + _item.x) // 随机的方向和间距
                let _dirY = this.propHigh - Math.random() * 10
                // 添加到渲染列表
                this.elId++
                this.viewList.push(_item)
                // #ifndef APP-NVUE
                // 非NVUE环境下创建动画实例
                _item.animation = uni.createAnimation({
                    duration: this.propDuration,
                    timingFunction: 'ease-out',
                })
                // 设置动画结束后的处理逻辑
                setTimeout(() => {
                    // 完成后事件回调
                    this.$emit('finished')
                    // 根据propAlone属性决定逐个删除还是一起删除
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
                        // 确定缩放倍数
                        let _n = 1
                        if (this.propLarge) _n = typeof(this.propLarge) === 'number' ? this.propLarge : 2;
                        // #ifndef APP-NVUE
                        // 非NVUE环境下的动画实现
                        _item.animation.translateY(-_dirY).translateX(_dirX).scale(_n, _n).opacity(0).step()
                        _item.animation = _item.animation.export()
                        // #endif
                        // #ifdef APP-NVUE
                        // NVUE环境下的动画实现
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
                            // 完成后事件回调
                            this.$emit('finished')
                            // 根据propAlone属性决定逐个删除还是一起删除
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
            /**
             * 删除已完成动画的视图元素
             */
            deleteView() {
                this.viewList.splice(0, this.waitDeleteIndex)
                this.waitDeleteIndex = 0
            },
            /**
             * 节流函数，控制函数执行频率
             * @param {Function} fn 需要节流的函数
             * @param {Number} delay 延迟时间（毫秒）
             */
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
    /* 动画元素固定定位样式 */
    .a-img {
        position: absolute;
    }
</style>