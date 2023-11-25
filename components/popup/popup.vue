<template>
    <view :class="theme_view + ' ' + propMostClass">
        <view :class="'popup ' + (propClassname || '') + ' ' + (propShow ? 'popup-show' : 'popup-hide') + ' ' + (propAnimation ? 'animation' : '')" :disable-scroll="propDisablescroll">
            <view class="popup-mask" :style="'z-index: ' + propIndex + ';'" v-if="propMask" @tap="on_mask_tap"></view>
            <view :class="'popup-content popup-' + (propPosition || 'bottom') + ' ' + (propIsRadius ? '' : 'popup-radius-0') + ' ' + (propIsBar ? 'popup-bar' : '') + ' ' + (propPosition === 'bottom' ? 'bottom-line-exclude' : '')" :style="position_style">
                <slot></slot>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                popup_content_left_value: 'auto',
            };
        },
        components: {},
        props: {
            // 最外层的class
            propMostClass: {
                type: String,
                default: '',
            },
            // 内层class
            propClassname: {
                type: String,
                default: '',
            },
            propShow: {
                type: Boolean,
                default: false,
            },
            propPosition: {
                type: String,
                default: 'bottom',
            },
            propMask: {
                type: Boolean,
                default: true,
            },
            propAnimation: {
                type: Boolean,
                default: true,
            },
            propDisablescroll: {
                type: Boolean,
                default: false,
            },
            propIsBar: {
                type: Boolean,
                default: false,
            },
            // 弹窗是否需要圆角 默认需要
            propIsRadius: {
                type: Boolean,
                default: true,
            },
            propIndex: {
                type: Number,
                default: 100,
            },
            // 需要携带后缀
            propTop: {
                type: String,
                default: '',
            },
            propBottom: {
                type: String,
                default: '',
            },
            propStyle: {
                type: String,
                default: '',
            },
        },
        // 属性值改变监听
        watch: {
            // 监听状态
            propShow(value, old_value) {
                this.left_handle();
            },
        },
        computed: {
            position_style() {
                let style = 'left:' + this.popup_content_left_value + ';' + (this.propTop ? 'top:' + this.propTop : '') + ';' + (this.propBottom ? 'bottom:' + this.propBottom : '') + ';' + this.propStyle;
                return style;
            },
        },
        // 组建创建
        created: function () {
            this.left_handle();
        },
        methods: {
            // 事件处理
            on_mask_tap: function on_mask_tap() {
                this.$emit(
                    'onclose',
                    {
                        detail: {},
                    },
                    {}
                );
            },
            // 左边距位置处理
            left_handle() {
                var left = 0;
                // #ifdef H5
                // 处理内容左边距、避免父级设置内边距影响
                var width = uni.getSystemInfoSync().windowWidth;
                if (width > 800) {
                    left = (width - 800) / 2;
                }
                // #endif
                this.popup_content_left_value = left + 'px';
            },
        },
    };
</script>
<style>
    .popup {
        opacity: 0;
    }
    .popup-content {
        position: fixed;
        background: #fff;
        z-index: 101;
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
        z-index: 100;
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
        bottom: var(--window-bottom);
        width: 100vw;
        transform: translateY(100%);
    }
    .popup-show {
        opacity: 1;
    }
    .popup-hide {
        transition: all 1s linear;
    }
    .popup-show .popup-content {
        transform: none;
    }
    .popup-show .popup-mask {
        opacity: 1;
        pointer-events: auto;
    }
    .popup.animation .popup-mask,
    .popup.animation .popup-content {
        transition: all 0.35s linear;
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
    .popup-radius-0 {
        border-radius: 0 !important;
    }
    .popup-bar {
        /* #ifdef H5 || APP */
        bottom: var(--window-bottom) !important;
        /* #endif */
    }
</style>
