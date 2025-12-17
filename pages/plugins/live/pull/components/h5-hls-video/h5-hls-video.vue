<template>
    <!-- 视频播放器容器 -->
    <view class="player-wrapper" :id="videoWrapperId" :randomNum="randomNum" :change:randomNum="hlsVideoPlayer.randomNumChange" :viewportProps="viewportProps" :change:viewportProps="hlsVideoPlayer.viewportChange" :videoSrc="videoSrc" :change:videoSrc="hlsVideoPlayer.initVideoPlayer" :command="eventCommand" :change:command="hlsVideoPlayer.triggerCommand" :func="renderFunc" :change:func="hlsVideoPlayer.triggerFunc" />
</template>

<script>
    /**
     * H5 HLS视频播放组件
     * 支持HLS流媒体播放和普通视频格式播放，兼容多种浏览器和移动端设备
     */
    export default {
        /**
         * 组件属性
         * @property {String} propSrc - 视频源地址
         * @property {Boolean} propAutoplay - 是否自动播放
         * @property {Boolean} propControls - 是否显示控件
         * @property {String} propObjectFit - 视频填充方式
         * @property {Boolean} propMuted - 是否静音
         * @property {Number} propPlaybackRate - 播放速率
         * @property {String} propPoster - 视频封面图
         */
        props: {
            propSrc: {
                type: String,
                default: ''
            },
            propAutoplay: {
                type: Boolean,
                default: false
            },
            propControls: {
                type: Boolean,
                default: false
            },
            propObjectFit: {
                type: String,
                default: 'contain'
            },
            propMuted: {
                type: Boolean,
                default: false
            },
            propPlaybackRate: {
                type: Number,
                default: 1
            },
            propPoster: {
                type: String,
                default: ''
            }
        },
        /**
         * 组件内部数据
         * @property {Number} randomNum - 随机数用于生成唯一ID
         * @property {String} videoSrc - 视频源地址
         * @property {Object} eventCommand - 视频原生事件指令
         * @property {Object} renderFunc - renderjs层函数执行指令
         * @property {Number} currentTime - 当前播放时间
         * @property {Number} duration - 视频总时长
         * @property {Boolean} playing - 是否正在播放
         */
        data() {
            return {
                randomNum: Math.floor(Math.random() * 100000000),
                videoSrc: '',
                // 父组件向子组件传递的事件指令（video的原生事件）
                eventCommand: null,
                // 父组件传递过来的，对 renderjs 层的函数执行（对视频控制的自定义事件）
                renderFunc: {
                    name: null,
                    params: null
                },
                // 提供给父组件进行获取的视频属性
                currentTime: 0,
                duration: 0,
                playing: false
            }
        },
        /**
         * 数据监听器
         */
        watch: {
            // 监听视频资源地址更新
            propSrc: {
                /**
                 * 处理视频源地址变更
                 * @param {String} val - 新的视频源地址
                 */
                handler(val) {
                    if (!val) return
                    setTimeout(() => {
                        this.videoSrc = val
                    }, 0)
                },
                immediate: true
            }
        },
        /**
         * 计算属性
         */
        computed: {
            /**
             * 视频容器ID
             * @returns {String} 唯一的视频容器ID
             */
            videoWrapperId() {
                return `video-wrapper-${this.randomNum}`
            },
            // 聚合视图层的所有数据变化，传给renderjs的渲染层
            /**
             * 视口属性集合
             * @returns {Object} 包含所有视口相关配置的对象
             */
            viewportProps() {
                return {
                    autoplay: this.propAutoplay,
                    muted: this.propMuted,
                    controls: this.propControls,
                    objectFit: this.propObjectFit,
                    poster: this.propCustomImages,
                    playbackRate: this.propPlaybackRate
                }
            }
        },
        /**
         * 组件方法
         */
        methods: {
            /**
             * 向父组件发送事件
             * @param {Object} options - 事件选项
             * @param {String} options.event - 事件名称
             * @param {*} [options.data] - 事件数据
             */
            // 传递事件指令给父组件
            eventEmit({ event, data }) {
                this.$emit(event, data)
            },
            /**
             * 更新视图层数据
             * @param {Object} options - 数据选项
             * @param {String} options.key - 数据键名
             * @param {*} options.value - 数据值
             */
            // 修改view视图层的data数据
            setViewData({ key, value }) {
                key && this.$set(this, key, value)
            },
            /**
             * 重置事件指令
             */
            // 重置事件指令
            resetEventCommand() {
                this.eventCommand = null
            },
            /**
             * 发送播放指令
             */
            // 播放指令
            play() {
                this.eventCommand = 'play'
            },
            /**
             * 发送暂停指令
             */
            // 暂停指令
            pause() {
                this.eventCommand = 'pause'
            },
            /**
             * 重置自定义函数指令
             */
            // 重置自定义函数指令
            resetFunc() {
                this.renderFunc = {
                    name: null,
                    params: null
                }
            },
            /**
             * 移除视频
             * @param {*} params - 参数
             */
            // 自定义事件 - 移除视频
            remove(params) {
                this.renderFunc = {
                    name: 'removeHandler',
                    params
                }
            },
            /**
             * 全屏操作
             * @param {*} params - 参数
             */
            // 自定义事件 - 全屏
            fullScreen(params) {
                this.renderFunc = {
                    name: 'fullScreenHandler',
                    params
                }
            },
            /**
             * 跳转到指定时间点
             * @param {Number} time - 时间点(秒)
             */
            // 跳转到指定时间点
            toSeek(time) {
                this.renderFunc = {
                    name: 'toSeekHandler',
                    params: time
                }
            }
        }
    }
</script>

<script module="hlsVideoPlayer" lang="renderjs">
    /**
     * RenderJS模块 - HLS视频播放器核心逻辑
     * 在RenderJS环境中运行，负责实际的视频播放控制
     */
    import hlsjs from '@/node_modules/hls.js/dist/hls.min.js'
    const PLAYER_ID = 'HLS_VIDEO_PLAYER'
    export default {
        /**
         * RenderJS数据
         * @property {String} num - 随机数标识符
         * @property {HTMLElement} videoEl - 视频元素引用
         * @property {Object} hlsPlayer - HLS播放器实例
         * @property {Object} renderProps - 渲染属性
         * @property {Boolean} autoplayRejected - 自动播放是否被拒绝
         */
        data() {
            return {
                num: '',
                videoEl: null,
                hlsPlayer: null,
                renderProps: {},
                autoplayRejected: false // 标记自动播放是否被拒绝
            }
        },
        /**
         * RenderJS计算属性
         */
        computed: {
            /**
             * 播放器ID
             * @returns {String} 唯一的播放器ID
             */
            playerId() {
                return `${PLAYER_ID}_${this.num}`
            },
            /**
             * 容器ID
             * @returns {String} 视频容器ID
             */
            wrapperId() {
                return `video-wrapper-${this.num}`
            }
        },
        /**
         * RenderJS方法
         */
        methods: {
            /**
             * 判断是否为苹果设备
             * @returns {Boolean} 是否为苹果设备(iPhone或iPad)
             */
            isApple() {
                const ua = navigator.userAgent.toLowerCase()
                return ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1
            },
            /**
             * 初始化视频播放器
             * @param {String} src - 视频源地址
             */
            async initVideoPlayer(src) {
                await this.$nextTick()
                if (!src) return
                if (this.videoEl) {
                    // 清理之前的播放器实例
                    this.destroyPlayer()
                }
                const videoEl = document.createElement('video')
                this.videoEl = videoEl
                // 开始监听视频相关事件
                this.listenVideoEvent()
                const { autoplay, muted, controls, playbackRate, objectFit, poster } = this.renderProps
                videoEl.autoplay = autoplay
                videoEl.controls = controls
                videoEl.muted = muted
                videoEl.playbackRate = playbackRate
                videoEl.id = this.playerId
                // videoEl.setAttribute('x5-video-player-type', 'h5')
                videoEl.setAttribute('preload', 'auto')
                videoEl.setAttribute('playsinline', true)
                videoEl.setAttribute('webkit-playsinline', true)
                videoEl.setAttribute('crossorigin', 'anonymous')
                videoEl.setAttribute('controlslist', 'nodownload')
                videoEl.setAttribute('disablePictureInPicture', true)
                videoEl.style.objectFit = objectFit
                poster && (videoEl.poster = poster)
                videoEl.style.width = '100%'
                videoEl.style.height = '100%'
                // 插入视频元素
                document.getElementById(this.wrapperId).appendChild(videoEl)
                // 检查是否是HLS流
                const isHls = src.includes('.m3u8')
                // #ifdef H5
                if (isHls) {
                    //#endif
                    //#ifndef H5
                    if (isHls && !this.isApple()) {
                        //#endif
                        this.initHlsPlayer(src)
                    } else {
                        // 对于MP4等普通格式或者苹果设备上的HLS流
                        videoEl.src = src
                        // 添加错误处理
                        videoEl.addEventListener('error', (e) => {
                            console.error('Video error:', e)
                            this.$ownerInstance.callMethod('eventEmit', {
                                event: 'error',
                                data: e
                            })
                        })
                    }
                    
                    // 如果设置了自动播放，尝试播放视频
                    if (autoplay) {
                        this.attemptAutoPlay(videoEl, muted);
                    }
                },
                /**
                 * 尝试自动播放视频
                 * @param {HTMLVideoElement} videoElement - 视频元素
                 * @param {Boolean} isMuted - 是否静音
                 */
                // 尝试自动播放视频
                attemptAutoPlay(videoElement, isMuted) {
                    const playPromise = videoElement.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                                // 自动播放成功
                                this.autoplayRejected = false;
                                // 通知父组件静音播放成功
                                this.$ownerInstance.callMethod('eventEmit', {
                                    event: 'autoPlaySuccess',
                                    data: this.renderProps.muted,
                                });
                            })
                            .catch((error) => {
                                // 自动播放被拒绝
                                this.autoplayRejected = true;
                                // 通知父组件静音播放成功
                                this.$ownerInstance.callMethod('eventEmit', {
                                    event: 'autoPlayError',
                                    data: this.renderProps.muted,
                                });
                            });
                    }
                },
                /**
                 * 初始化HLS播放器
                 * @param {String} src - HLS流地址
                 */
                // 播放视频流
                initHlsPlayer(src) {
                    if (hlsjs.isSupported()) {
                        this.hlsPlayer = new hlsjs({
                            manifestLoadingTimeOut: 60000, // 设置播放列表加载超时时间（毫秒）
                            fragLoadingTimeOut: 60000,    // 设置片段加载超时时间（毫秒）
                            maxLiveSyncPlaybackRate: 1, // 最大追赶播放速率（1.05倍速）
                            lowLatencyMode: true, // 启用低延迟模式
                            debug: false // 启用调试日志
                        })
                        this.hlsPlayer.loadSource(src)
                        this.hlsPlayer.attachMedia(this.videoEl)
                        this.hlsPlayer.on(hlsjs.Events.MANIFEST_PARSED, () => {
                            // hls 视频流加载完成
                            this.$ownerInstance.callMethod('eventEmit', {
                                event: 'hlsManifestParsed'
                            })
                            
                            // HLS流加载完成后尝试自动播放
                            if (this.renderProps.autoplay) {
                                this.attemptAutoPlay(this.videoEl, this.renderProps.muted);
                            }
                        })
                        this.hlsPlayer.on(hlsjs.Events.ERROR, (event, data) => {
                            // hls 视频加载错误
                            this.$ownerInstance.callMethod('eventEmit', {
                                event: 'hlsError',
                                data
                            })
                            // 如果HLS播放失败，尝试直接播放源地址作为降级方案
                            if (this.videoEl && data.fatal) {
                                this.videoEl.src = src
                            }
                        })
                    } else {
                        // 浏览器不支持hls.js，直接使用原生播放
                        this.videoEl.src = src
                    }
                },
                /**
                 * 监听视频相关事件
                 * 注册各种视频事件监听器，包括播放、暂停、结束等
                 */
                // 监听视频相关事件
                listenVideoEvent() {
                    // 播放事件监听
                    const playHandler = () => {
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'play'
                        })
                        this.$ownerInstance.callMethod('setViewData', {
                            key: 'playing',
                            value: true
                        })
                    }
                    this.videoEl.removeEventListener('play', playHandler)
                    this.videoEl.addEventListener('play', playHandler)
                    // 暂停事件监听
                    const pauseHandler = () => {
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'pause'
                        })
                        this.$ownerInstance.callMethod('setViewData', {
                            key: 'playing',
                            value: false
                        })
                    }
                    this.videoEl.removeEventListener('pause', pauseHandler)
                    this.videoEl.addEventListener('pause', pauseHandler)
                    // 结束事件监听
                    const endedHandler = () => {
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'ended'
                        })
                        this.$ownerInstance.callMethod('resetEventCommand')
                    }
                    this.videoEl.removeEventListener('ended', endedHandler)
                    this.videoEl.addEventListener('ended', endedHandler)
                    // 加载完成事件监听
                    const canPlayHandler = () => {
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'canplay'
                        })
                    }
                    this.videoEl.removeEventListener('canplay', canPlayHandler)
                    this.videoEl.addEventListener('canplay', canPlayHandler)
                    // 加载失败事件监听
                    const errorHandler = (e) => {
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'error',
                            data: e
                        })
                    }
                    this.videoEl.removeEventListener('error', errorHandler)
                    this.videoEl.addEventListener('error', errorHandler)
                    // loadedmetadata 事件监听
                    const loadedMetadataHandler = () => {
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'loadedmetadata'
                        })
                        // 获取视频的长度
                        const duration = this.videoEl.duration
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'durationchange',
                            data: duration
                        })
                        this.$ownerInstance.callMethod('setViewData', {
                            key: 'duration',
                            value: duration
                        })
                    }
                    this.videoEl.removeEventListener('loadedmetadata', loadedMetadataHandler)
                    this.videoEl.addEventListener('loadedmetadata', loadedMetadataHandler)
                    // 播放进度监听
                    const timeupdateHandler = (e) => {
                        const currentTime = e.target.currentTime
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'timeupdate',
                            data: currentTime
                        })
                        this.$ownerInstance.callMethod('setViewData', {
                            key: 'currentTime',
                            value: currentTime
                        })
                    }
                    this.videoEl.removeEventListener('timeupdate', timeupdateHandler)
                    this.videoEl.addEventListener('timeupdate', timeupdateHandler)
                    // 倍速播放监听
                    const ratechangeHandler = (e) => {
                        const playbackRate = e.target.playbackRate
                        this.$ownerInstance.callMethod('eventEmit', {
                            event: 'ratechange',
                            data: playbackRate
                        })
                    }
                    this.videoEl.removeEventListener('ratechange', ratechangeHandler)
                    this.videoEl.addEventListener('ratechange', ratechangeHandler)
                    // 全屏事件监听
                    if (this.isApple()) {
                        const webkitbeginfullscreenHandler = () => {
                            const presentationMode = this.videoEl.webkitPresentationMode
                            let isFullScreen = null
                            if (presentationMode === 'fullscreen') {
                                isFullScreen = true
                            } else {
                                isFullScreen = false
                            }
                            this.$ownerInstance.callMethod('eventEmit', {
                                event: 'fullscreenchange',
                                data: isFullScreen
                            })
                        }
                        this.videoEl.removeEventListener('webkitpresentationmodechanged', webkitbeginfullscreenHandler)
                        this.videoEl.addEventListener('webkitpresentationmodechanged', webkitbeginfullscreenHandler)
                    } else {
                        const fullscreenchangeHandler = () => {
                            let isFullScreen = null
                            if (document.fullscreenElement) {
                                isFullScreen = true
                            } else {
                                isFullScreen = false
                            }
                            this.$ownerInstance.callMethod('eventEmit', {
                                event: 'fullscreenchange',
                                data: isFullScreen
                            })
                        }
                        document.removeEventListener('fullscreenchange', fullscreenchangeHandler)
                        document.addEventListener('fullscreenchange', fullscreenchangeHandler)
                    }
                },
                /**
                 * 销毁播放器实例
                 * 清理HLS播放器和视频元素，释放资源
                 */
                // 销毁播放器实例
                destroyPlayer() {
                    if (this.hlsPlayer) {
                        this.hlsPlayer.destroy()
                        this.hlsPlayer = null
                    }
                    if (this.videoEl) {
                        this.videoEl.pause()
                        this.videoEl.src = ''
                        // 移除所有事件监听器
                        this.videoEl.removeAttribute('src')
                        this.videoEl.load()
                        this.videoEl = null
                    }
                    // 重置自动播放标记
                    this.autoplayRejected = false;
                },
                /**
                 * 触发指令事件
                 * @param {String} eventType - 事件类型(play/pause等)
                 */
                triggerCommand(eventType) {
                    if (eventType) {
                        this.$ownerInstance.callMethod('resetEventCommand')
                        if (this.videoEl) {
                            try {
                                this.videoEl[eventType]()
                            } catch (e) {
                                console.error(`Error executing ${eventType}:`, e)
                            }
                        }
                    }
                },
                /**
                 * 触发函数调用
                 * @param {Object} func - 函数对象
                 * @param {String} func.name - 函数名
                 * @param {*} func.params - 函数参数
                 */
                triggerFunc(func) {
                    const { name, params } = func || {}
                    if (name) {
                        if (typeof this[name] === 'function') {
                            this[name](params)
                        }
                        this.$ownerInstance.callMethod('resetFunc')
                    }
                },
                /**
                 * 移除视频处理器
                 */
                removeHandler() {
                    this.destroyPlayer()
                    this.$ownerInstance.callMethod('setViewData', {
                        key: 'videoSrc',
                        value: ''
                    })
                },
                /**
                 * 全屏处理器
                 * @param {*} params - 参数
                 */
                fullScreenHandler() {
                    if (this.videoEl) {
                        if (this.isApple()) {
                            if (this.videoEl.webkitEnterFullscreen) {
                                this.videoEl.webkitEnterFullscreen()
                            }
                        } else {
                            if (this.videoEl.requestFullscreen) {
                                this.videoEl.requestFullscreen()
                            }
                        }
                    }
                },
                /**
                 * 跳转时间点处理器
                 * @param {Number} time - 时间点(秒)
                 */
                toSeekHandler(time) {
                    if (this.videoEl) {
                        this.videoEl.currentTime = time
                    }
                },
                /**
                 * 视口变更处理
                 * @param {Object} props - 视口属性
                 */
                viewportChange(props) {
                    this.renderProps = props
                    const { autoplay, muted, controls, playbackRate } = props
                    if (this.videoEl) {
                        this.videoEl.autoplay = autoplay
                        this.videoEl.controls = controls
                        this.videoEl.muted = muted
                        this.videoEl.playbackRate = playbackRate
                        
                        // 如果更改了静音状态且之前自动播放被拒绝，重新尝试播放
                        if (this.autoplayRejected && autoplay) {
                            this.attemptAutoPlay(this.videoEl, muted);
                        }
                    }
                },
                /**
                 * 随机数变更处理
                 * @param {Number} val - 随机数
                 */
                randomNumChange(val) {
                    this.num = val
                }
            },
            /**
             * 组件销毁前钩子
             * 清理播放器资源
             */
            // 组件销毁时清理资源
            beforeDestroy() {
                this.destroyPlayer()
            }
        }
</script>

<style lang="scss" scoped>
    .player-wrapper {
        overflow: hidden;
        height: 100%;
        padding: 0;
    }
</style>