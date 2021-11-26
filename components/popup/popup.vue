<template>
    <view>
        <view :class="'popup ' + (propClassname || '') + ' ' + ((propShow || false) ? 'popup-show' : '') + ' ' + ((propAnimation || true) ? 'animation': '' )" :disable-scroll="propDisablescroll">
            <view class="popup-mask" v-if="propMask || true" @tap="onMaskTap"></view>
            <view :class="'popup-content popup-' + propPosition || 'bottom'">
                <slot></slot>
            </view>
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
    .popup-content {
        position: fixed;
        background: #fff;
        z-index: 1001;
        overflow: hidden;
    }
    .popup-mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.6);
        opacity: 0;
        pointer-events: none;
        z-index: 1000;
    }
    .popup-left {
        transform: translateX(-100%);
        left: 0;
        top: 0;
        bottom: 0;
    }
    .popup-right {
        transform: translateX(100%);
        right: 0;
        top: 0;
        bottom: 0;
    }
    .popup-top {
        top: 0;
        width: 100vw;
        transform: translateY(-100%);
    }
    .popup-bottom {
        bottom: 0;
        width: 100vw;
        transform: translateY(100%);
    }
    .popup-show .popup-content {
        transform: none;
    }
    .popup-show .popup-mask {
        opacity: 1;
        pointer-events: auto;
    }
    .popup.animation .popup-content {
        transition: all 0.25s linear;
    }
    .popup.animation .popup-mask {
        transition: all 0.25s linear;
    }
    .popup-top {
        border-bottom-right-radius: 20rpx;
        border-bottom-left-radius: 20rpx;
    }
    .popup-bottom {
        border-top-right-radius: 20rpx;
        border-top-left-radius: 20rpx;
    }
    .popup-left {
        border-top-right-radius: 20rpx;
        border-bottom-right-radius: 20rpx;
    }
    .popup-right {
        border-top-left-radius: 20rpx;
        border-bottom-left-radius: 20rpx;
    }
</style>