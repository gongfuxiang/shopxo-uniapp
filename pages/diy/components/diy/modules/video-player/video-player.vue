<!-- eslint-disable -->
<template>
  <view
    class="player-wrapper"
    :id="videoWrapperId"
    :parentId="id"
    :randomNum="randomNum"
    :change:randomNum="domVideoPlayer.randomNumChange"
    :viewportProps="viewportProps"
    :change:viewportProps="domVideoPlayer.viewportChange"
    :videoSrc="videoSrc"
    :change:videoSrc="domVideoPlayer.initVideoPlayer"
    :command="eventCommand"
    :change:command="domVideoPlayer.triggerCommand"
    :func="renderFunc"
    :change:func="domVideoPlayer.triggerFunc"
  />
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
    loop: {
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
    isLoading: {
      type: Boolean,
      default: false
    },
    poster: {
      type: String,
      default: ''
    },
    id: {
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
        loop: this.loop,
        objectFit: this.objectFit,
        poster: this.poster,
        isLoading: this.isLoading,
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
    // 自定义函数 - 移除视频
    remove(params) {
      this.renderFunc = {
        name: 'removeHandler',
        params
      }
    },
    // 自定义函数 - 全屏播放
    fullScreen(params) {
      this.renderFunc = {
        name: 'fullScreenHandler',
        params
      }
    },
    // 自定义函数 - 跳转到指定时间点
    toSeek(sec, isDelay = false) {
      this.renderFunc = {
        name: 'toSeekHandler',
        params: { sec, isDelay }
      }
    }
  }
}
</script>


<script module="domVideoPlayer" lang="renderjs">
const PLAYER_ID = 'DOM_VIDEO_PLAYER'
export default {
  data() {
    return {
      num: '',
      videoEl: null,
      loadingEl: null,
      // 延迟生效的函数
      delayFunc: null,
      renderProps: {}
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
      this.delayFunc = null
      await this.$nextTick()
      if (!src) return
      if (this.videoEl) {
        // 切换视频源
        if (!this.isApple() && this.loadingEl) {
          this.loadingEl.style.display = 'block'
        }
        this.videoEl.src = src
        return
      }

      const videoEl = document.createElement('video')
      this.videoEl = videoEl
      // 开始监听视频相关事件
      this.listenVideoEvent()

      const { autoplay, muted, controls, loop, playbackRate, objectFit, poster } = this.renderProps
      videoEl.src = src
      videoEl.autoplay = autoplay
      videoEl.controls = controls
      videoEl.loop = loop
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
      // document.getElementById(this.wrapperId).appendChild(videoEl)
      const playerWrapper = document.getElementById(this.wrapperId)
      playerWrapper.insertBefore(videoEl, playerWrapper.firstChild)

      // 插入loading 元素（遮挡安卓的默认加载过程中的黑色播放按钮）
      this.createLoading()
    },
    // 创建 loading
    createLoading() {
      const { isLoading } = this.renderProps
      if (!this.isApple() && isLoading) {
        const loadingEl = document.createElement('div')
        this.loadingEl = loadingEl
        loadingEl.className = 'loading-wrapper'
        loadingEl.style.position = 'absolute'
        loadingEl.style.top = '0'
        loadingEl.style.left = '0'
        loadingEl.style.zIndex = '1'
        loadingEl.style.width = '100%'
        loadingEl.style.height = '100%'
        loadingEl.style.backgroundColor = 'black'
        document.getElementById(this.wrapperId).appendChild(loadingEl)

        // 创建 loading 动画
        const animationEl = document.createElement('div')
        animationEl.className = 'loading'
        animationEl.style.zIndex = '2'
        animationEl.style.position = 'absolute'
        animationEl.style.top = '50%'
        animationEl.style.left = '50%'
        animationEl.style.marginTop = '-15px'
        animationEl.style.marginLeft = '-15px'
        animationEl.style.width = '30px'
        animationEl.style.height = '30px'
        animationEl.style.border = '2px solid #FFF'
        animationEl.style.borderTopColor = 'rgba(255, 255, 255, 0.2)'
        animationEl.style.borderRightColor = 'rgba(255, 255, 255, 0.2)'
        animationEl.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)'
        animationEl.style.borderRadius = '100%'
        animationEl.style.animation = 'circle infinite 0.75s linear'
        loadingEl.appendChild(animationEl)

        // 创建 loading 动画所需的 keyframes
        const style = document.createElement('style')
        const keyframes = `
          @keyframes circle {
            0% {
              transform: rotate(0);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `
        style.type = 'text/css'
        if (style.styleSheet) {
          style.styleSheet.cssText = keyframes
        } else {
          style.appendChild(document.createTextNode(keyframes))
        }
        document.head.appendChild(style)
      }
    },
    // 监听视频相关事件
    listenVideoEvent() {
      // 播放事件监听
      const playHandler = () => {
        this.$ownerInstance.callMethod('eventEmit', { event: 'play' })
        this.$ownerInstance.callMethod('setViewData', {
          key: 'playing',
          value: true
        })

        if (this.loadingEl) {
          this.loadingEl.style.display = 'none'
        }
      }
      this.videoEl.removeEventListener('play', playHandler)
      this.videoEl.addEventListener('play', playHandler)

      // 暂停事件监听
      const pauseHandler = () => {
        this.$ownerInstance.callMethod('eventEmit', { event: 'pause' })
        this.$ownerInstance.callMethod('setViewData', {
          key: 'playing',
          value: false
        })
      }
      this.videoEl.removeEventListener('pause', pauseHandler)
      this.videoEl.addEventListener('pause', pauseHandler)

      // 结束事件监听
      const endedHandler = () => {
        this.$ownerInstance.callMethod('eventEmit', { event: 'ended' })
        this.$ownerInstance.callMethod('resetEventCommand')
      }
      this.videoEl.removeEventListener('ended', endedHandler)
      this.videoEl.addEventListener('ended', endedHandler)

      // 加载完成事件监听
      const canPlayHandler = () => {
        this.$ownerInstance.callMethod('eventEmit', { event: 'canplay' })
        this.execDelayFunc()
      }
      this.videoEl.removeEventListener('canplay', canPlayHandler)
      this.videoEl.addEventListener('canplay', canPlayHandler)

      // 加载失败事件监听
      const errorHandler = (e) => {
        if (this.loadingEl) {
          this.loadingEl.style.display = 'block'
        }
        this.$ownerInstance.callMethod('eventEmit', { event: 'error' })
      }
      this.videoEl.removeEventListener('error', errorHandler)
      this.videoEl.addEventListener('error', errorHandler)

      // loadedmetadata 事件监听
      const loadedMetadataHandler = () => {
        this.$ownerInstance.callMethod('eventEmit', { event: 'loadedmetadata' })
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

        // 加载首帧视频 模拟出封面图, 如果没有传封面图的时候才加载首帧视频
        if (this.poster == '' || this.poster == null || this.poster == undefined) {
          this.loadFirstFrame()
        }
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
    // 加载首帧视频，模拟出封面图
    loadFirstFrame() {
      let { autoplay, muted } = this.renderProps
      if (this.isApple()) {
        this.videoEl.play()
        if (!autoplay) {
          this.videoEl.pause()
        }
      } else {
        // optimize: timeout 延迟调用是为了规避控制台的`https://goo.gl/LdLk22`这个报错
        /**
         * 原因：chromium 内核中，谷歌协议规定，视频不允许在非静音状态下进行自动播放
         * 解决：在自动播放时，先将视频静音，然后延迟调用 play 方法，播放视频
         * 说明：iOS 的 Safari 内核不会有这个，仅在 Android 设备出现，即使有这个报错也不影响的，所以不介意控制台报错的话是可以删掉这个 timeout 的
         */
        this.videoEl.muted = true
        setTimeout(() => {
          this.videoEl.play()
          this.videoEl.muted = muted
          if (!autoplay) {
            setTimeout(() => {
              this.videoEl.pause()
            }, 100)
          }
        }, 10)
      }
    },
    triggerCommand(eventType) {
      if (eventType) {
        this.$ownerInstance.callMethod('resetEventCommand')
        this.videoEl && this.videoEl[eventType]()
      }
    },
    triggerFunc(func) {
      const { name, params } = func || {}
      if (name) {
        this[name](params)
        this.$ownerInstance.callMethod('resetFunc')
      }
    },
    removeHandler() {
      if (this.videoEl) {
        this.videoEl.pause()
        this.videoEl.src = ''
        this.$ownerInstance.callMethod('setViewData', {
          key: 'videoSrc',
          value: ''
        })
        this.videoEl.load()
      }
    },
    fullScreenHandler() {
      if (this.isApple()) {
        this.videoEl.webkitEnterFullscreen()
      } else {
        this.videoEl.requestFullscreen()
      }
    },
    toSeekHandler({ sec, isDelay }) {
      const func = () => {
        if (this.videoEl) {
          this.videoEl.currentTime = sec
        }
      }

      // 延迟执行
      if (isDelay) {
        this.delayFunc = func
      } else {
        func()
      }
    },
    // 执行延迟函数
    execDelayFunc() {
      this.delayFunc && this.delayFunc()
      this.delayFunc = null
    },
    viewportChange(props) {
      this.renderProps = props
      const { autoplay, muted, controls, loop, playbackRate } = props
      if (this.videoEl) {
        this.videoEl.autoplay = autoplay
        this.videoEl.controls = controls
        this.videoEl.loop = loop
        this.videoEl.muted = muted
        this.videoEl.playbackRate = playbackRate
      }
    },
    randomNumChange(val) {
      this.num = val
    }
  }
}
</script>

<style scoped>
.player-wrapper {
  overflow: hidden;
  height: 100%;
  padding: 0;
  position: relative;
}
</style>
