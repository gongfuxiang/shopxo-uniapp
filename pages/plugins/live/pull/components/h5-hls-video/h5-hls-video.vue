<!-- eslint-disable -->
<template>
    <view class="player-wrapper" :id="videoWrapperId" :randomNum="randomNum" :change:randomNum="hlsVideoPlayer.randomNumChange" :viewportProps="viewportProps" :change:viewportProps="hlsVideoPlayer.viewportChange" :videoSrc="videoSrc" :change:videoSrc="hlsVideoPlayer.initVideoPlayer" :command="eventCommand" :change:command="hlsVideoPlayer.triggerCommand" :func="renderFunc" :change:func="hlsVideoPlayer.triggerFunc" />
</template>

<script>
    export default {
        props: {
            src: {
                type: String,
                default: ''
            },
            autoplay: {
                type: Boolean,
                default: false
            },
            controls: {
                type: Boolean,
                default: false
            },
            objectFit: {
                type: String,
                default: 'contain'
            },
            muted: {
                type: Boolean,
                default: false
            },
            playbackRate: {
                type: Number,
                default: 1
            },
            poster: {
                type: String,
                default: ''
            }
        },
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
        watch: {
            // 监听视频资源地址更新
            src: {
                handler(val) {
                    if (!val) return
                    setTimeout(() => {
                        this.videoSrc = val
                    }, 0)
                },
                immediate: true
            }
        },
        computed: {
            videoWrapperId() {
                return `video-wrapper-${this.randomNum}`
            },
            // 聚合视图层的所有数据变化，传给renderjs的渲染层
            viewportProps() {
                return {
                    autoplay: this.autoplay,
                    muted: this.muted,
                    controls: this.controls,
                    objectFit: this.objectFit,
                    poster: this.poster,
                    playbackRate: this.playbackRate
                }
            }
        },
        // 方法
        methods: {
            // 传递事件指令给父组件
            eventEmit({ event, data }) {
                this.$emit(event, data)
            },
            // 修改view视图层的data数据
            setViewData({ key, value }) {
                key && this.$set(this, key, value)
            },
            // 重置事件指令
            resetEventCommand() {
                this.eventCommand = null
            },
            // 播放指令
            play() {
                this.eventCommand = 'play'
            },
            // 暂停指令
            pause() {
                this.eventCommand = 'pause'
            },
            // 重置自定义函数指令
            resetFunc() {
                this.renderFunc = {
                    name: null,
                    params: null
                }
            },
            // 自定义事件 - 移除视频
            remove(params) {
                this.renderFunc = {
                    name: 'removeHandler',
                    params
                }
            },
            // 自定义事件 - 全屏
            fullScreen(params) {
                this.renderFunc = {
                    name: 'fullScreenHandler',
                    params
                }
            },
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
    import hlsjs from '@/node_modules/hls.js/dist/hls.min.js'
    const PLAYER_ID = 'HLS_VIDEO_PLAYER'
    export default {
        data() {
            return {
                num: '',
                videoEl: null,
                hlsPlayer: null,
                renderProps: {},
                autoplayRejected: false // 标记自动播放是否被拒绝
            }
        },
        computed: {
            playerId() {
                return `${PLAYER_ID}_${this.num}`
            },
            wrapperId() {
                return `video-wrapper-${this.num}`
            }
        },
        methods: {
            isApple() {
                const ua = navigator.userAgent.toLowerCase()
                return ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1
            },
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
                // 播放视频流
                initHlsPlayer(src) {
                    if (hlsjs.isSupported()) {
                        this.hlsPlayer = new hlsjs()
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
                            console.error('HLS Error:', data, event, '444')
                            // 如果HLS播放失败，尝试直接播放源地址作为降级方案
                            if (this.videoEl && data.fatal) {
                                this.videoEl.src = src
                            } else {
                                // hls 视频加载错误
                                this.$ownerInstance.callMethod('eventEmit', {
                                    event: 'hlsError',
                                    data
                                })
                            }
                        })
                    } else {
                        // 浏览器不支持hls.js，直接使用原生播放
                        this.videoEl.src = src
                    }
                },
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
                triggerFunc(func) {
                    const { name, params } = func || {}
                    if (name) {
                        if (typeof this[name] === 'function') {
                            this[name](params)
                        }
                        this.$ownerInstance.callMethod('resetFunc')
                    }
                },
                removeHandler() {
                    this.destroyPlayer()
                    this.$ownerInstance.callMethod('setViewData', {
                        key: 'videoSrc',
                        value: ''
                    })
                },
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
                toSeekHandler(time) {
                    if (this.videoEl) {
                        this.videoEl.currentTime = time
                    }
                },
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
                randomNumChange(val) {
                    this.num = val
                }
            },
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