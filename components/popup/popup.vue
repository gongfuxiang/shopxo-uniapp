<template>
<view :class="'am-popup ' + propClassname || '' + ' ' + ((propShow || false) ? 'am-popup-show' : '') + ' ' + ( (propAnimation || true) ? 'animation': '' )" :disable-scroll="propDisablescroll">
  <view class="am-popup-mask" v-if="propMask || true" @tap="onMaskTap"></view>
  <view :class="'am-popup-content am-popup-' + propPosition || 'bottom'">
    <slot></slot>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    propClassname: String,
    propShow: Boolean,
    propPosition: String,
    propMask: Boolean,
    propAnimation: Boolean,
    propDisablescroll: Boolean
  },
  methods: {
    onMaskTap: function onMaskTap() {
      this.$emit('onclose', {
        detail: {}
      }, {});
    }
  }
};
</script>
<style>
.am-popup-content {
  position: fixed;
  background:#fff;
  z-index: 101;
}

.am-popup-mask {
  position: fixed;
  top: 0;/*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));/*  #endif  */
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.75);
  opacity: 0;
  pointer-events: none;
  z-index: 100;
}

.am-popup-left {
  transform: translateX(-100%);
  left: 0;
  top: 0;
  bottom: 0;
}

.am-popup-right {
  transform: translateX(100%);
  right: 0;
  top: 0;
  bottom: 0;
}

.am-popup-top {
  top: 0;
  width: 100vw;
  transform: translateY(-100%);
}

.am-popup-bottom {
  bottom: 0;
  width: 100vw;
  transform: translateY(100%);
}

.am-popup-show .am-popup-content {
  transform: none;
}

.am-popup-show .am-popup-mask {
  opacity: 1;
  pointer-events: auto;
}

.am-popup.animation .am-popup-content {
  transition: all 0.15s linear;
}

.am-popup.animation .am-popup-mask {
  transition: all 0.15s linear;
}
</style>