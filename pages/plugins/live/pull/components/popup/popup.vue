<template>
    <view v-if="showPopup" class="uni-popup" :class="popupstyle + (isDesktop ? ' fixforpc-z-index' : '')">
        <view @touchstart="touchstart">
            <component-transition key="1" v-if="maskShow" name="mask" mode="fade" :customStyle="maskClass" :duration="duration" :show="showTrans" @click="onTap" />
            <component-transition key="2" :mode="ani" name="content" :customStyle="transClass" :duration="duration" :show="showTrans">
                <view class="pr" :style="'border-radius:' + round + 'px'">
                    <view v-if="closeType == 'icon' && closeable" class="popup-close pa-14 box-border-box" :class="closeIconPos" :style="closeIconStyle" @tap="close">
                        <component-icon :name="closeIcon" :type="closeIconType" :size="closeIconSize + 'rpx'"></component-icon>
                    </view>
                    <view v-if="closeType == 'text' && closeable" class="flex-row jc-sb align-c w abs top-0 pa-14 z-i">
                        <text class="cr-info" @click="close">取消</text>
                        <view class="pr">
                            <text v-if="isCustomBtn" class="inline-block" :style="customBtnStyle" @click="custom_change">{{ customBtnText }}</text>
                            <text class="cr-primary" @click="comfirm">确定</text>
                        </view>
                    </view>
                    <view v-if="title != ''" class="pr">
                        <view class="popup-close pa-14 box-border-box" :class="titleBorder ? 'br-b-e' : ''">
                            <view v-if="title != ''" class="title ">
                                <text class="fw tc">{{ title }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="uni-popup__wrapper radius-lg" :style="{ backgroundColor: bg, maxHeight: height }" :class="[popupstyle]" @click="clear">
                        <slot />
                    </view>
                </view>
            </component-transition>
        </view>
        <!-- #ifdef H5 -->
        <keypress v-if="maskShow" @esc="onTap" />
        <!-- #endif -->
    </view>
</template>

<script>
    import componentTransition from '@/pages/plugins/live/pull/components/transition/transition.vue';
    import componentIcon from "@/pages/plugins/live/pull/components/icon/icon.vue";
    // #ifdef H5
    import keypress from './keypress.js';
    // #endif

    /**
     * PopUp 弹出层
     * @description 弹出层组件，为了解决遮罩弹层的问题
     * @property {String} type = [top|center|bottom|left|right|message|dialog|share] 弹出方式
     * 	@value top 顶部弹出
     * 	@value center 中间弹出
     * 	@value bottom 底部弹出
     * 	@value left		左侧弹出
     * 	@value right  右侧弹出
     * 	@value message 消息提示
     * 	@value dialog 对话框
     * 	@value share 底部分享示例
     * @property {Boolean} animation = [true|false] 是否开启动画
     * @property {Boolean} maskClick = [true|false] 蒙版点击是否关闭弹窗(废弃)
     * @property {Boolean} isMaskClick = [true|false] 蒙版点击是否关闭弹窗
     * @property {String}  backgroundColor 主窗口背景色
     * @property {String}  maskBackgroundColor 蒙版颜色
     * @property {Boolean} safeArea		   是否适配底部安全区
     * @property {Boolean} closeable Boolean | 是否显示关闭图标，默认true
     * @property {String} closeIcon String | 关闭iconfont，默认‘close’ ---还有close-o，或者其他自定义icon
     * @property {String} closeIconType String | 关闭颜色，默认‘6’ 参照组件u-icon
     * @property {String} closeIconPos = [top-left|top-right|top-center|bottom-left|bottom-right|bottom-center] String | 关闭图标位置
     * 	@value top-left 左上角
     * 	@value top-right 右上角
     * 	@value bottom-left 左下角
     * 	@value bottom-right 右下角
     * @property {Number} closeIconSize Number | 关闭图标大小，默认32(单位rpx)
     * @property {Boolean} closeType Boolean | 显示关闭图标还是文本(文本包含确定和取消)，默认icon,------icon,text,
     * @property {Boolean} isCustomBtn Boolean | 自定义按钮
     * @property {String} customBtnText String | 自定义按钮文本
     * @property {Object} customBtnStyle Object | 自定义按钮样式
     * @property {String}  title String | 弹窗标题
     * @property {String}  titleBorder String | 弹窗底部边框
     * @property {String}  height String | 弹窗内容高度
     * @property {String}  round String | 弹窗圆角
     * @property {Boolean}  isConfirmClose Boolean | 是否点击确认按钮时主动关闭弹窗
     * @event {Function} change 打开关闭弹窗触发，e={show: false}
     * @event {Function} maskClick 点击遮罩触发
     * @event {Function} callBack 确定按钮回调方法
     * @event {Function} custom_change 自定义按钮回调方法
     */

    export default {
        name: 'uniPopup',
        components: {
            // #ifdef H5
            keypress,
            // #endif
            componentTransition,
            componentIcon,
        },
        emits: ['change', 'maskClick', 'callBack', 'callBackCustom'],
        props: {
            // 开启动画
            animation: {
                type: Boolean,
                default: true,
            },
            // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
            // message: 消息提示 ; dialog : 对话框
            type: {
                type: String,
                default: 'bottom',
            },
            // maskClick
            isMaskClick: {
                type: Boolean,
                default: null,
            },
            // TODO 2 个版本后废弃属性 ，使用 isMaskClick
            maskClick: {
                type: Boolean,
                default: null,
            },
            backgroundColor: {
                type: String,
                default: 'none',
            },
            safeArea: {
                type: Boolean,
                default: true,
            },
            maskBackgroundColor: {
                type: String,
                default: 'rgba(0, 0, 0, 0.4)',
            },
            // 是否显示关闭图标
            closeable: {
                type: Boolean,
                default: true,
            },
            // icon
            closeIcon: {
                type: String,
                default: 'close-line',
            },
            // icon颜色
            closeIconType: {
                type: String,
                default: '6',
            },
            // 关闭图标大小
            closeIconSize: {
                type: Number,
                default: 32,
            },
            // 关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角，top-center为外部上部中间位置， bottom-center为外部底部中间位置，
            closeIconPos: {
                type: String,
                validator: (value) => ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'].includes(value),
                default: 'top-right',
            },
            closeType: {
                type: String,
                default: 'icon',
            },
            isCustomBtn: {
                type: Boolean,
                default: false,
            },
            customBtnText: {
                type: String,
                default: '自定义',
            },
            customBtnStyle: {
                type: String,
                default: '',
            },
            // 标题
            title: {
                type: String,
                default: '',
            },
            titleBorder: {
                type: Boolean,
                default: false,
            },
            height: {
                type: String,
                default: 'auto',
            },
            round: {
                type: Number,
                default: 0,
            },
            isConfirmClose: {
                type: Boolean,
                default: true,
            },
        },

        watch: {
            /**
             * 监听type类型
             */
            type: {
                handler: function (type) {
                    if (!this.config[type]) return;
                    this[this.config[type]](true);
                },
                immediate: true,
            },
            isDesktop: {
                handler: function (newVal) {
                    if (!this.config[newVal]) return;
                    this[this.config[this.type]](true);
                },
                immediate: true,
            },
            /**
             * 监听遮罩是否可点击
             * @param {Object} val
             */
            maskClick: {
                handler: function (val) {
                    this.mkclick = val;
                },
                immediate: true,
            },
            isMaskClick: {
                handler: function (val) {
                    this.mkclick = val;
                },
                immediate: true,
            },
            // H5 下禁止底部滚动
            showPopup(show) {
                // #ifdef H5
                // fix by mehaotian 处理 h5 滚动穿透的问题
                document.getElementsByTagName('body')[0].style.overflow = show ? 'hidden' : 'visible';
                // #endif
            },
        },
        data() {
            return {
                duration: 300,
                ani: [],
                showPopup: false,
                showTrans: false,
                popupWidth: 0,
                popupHeight: 0,
                config: {
                    top: 'top',
                    bottom: 'bottom',
                    center: 'center',
                    left: 'left',
                    right: 'right',
                    message: 'top',
                    dialog: 'center',
                    share: 'bottom',
                },
                maskClass: {
                    position: 'fixed',
                    bottom: 0,
                    top: '-1000%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                },
                transClass: {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                },
                maskShow: true,
                mkclick: true,
                popupstyle: this.isDesktop ? 'fixforpc-top' : 'top',
            };
        },
        computed: {
            isDesktop() {
                return this.popupWidth >= 500 && this.popupHeight >= 500;
            },
            bg() {
                if (this.backgroundColor === '' || this.backgroundColor === 'none') {
                    return '#fff';
                }
                return this.backgroundColor;
            },
            // transition固定样式
            transitionFixedStyle() {
                let style = {
                    backgroundColor: this.bgColor,
                    zIndex: this.zIndex,
                };
                switch (this.mode) {
                    case 'top':
                        style['borderBottomLeftRadius'] = this.round + 'px';
                        style['borderBottomRightRadius'] = this.round + 'px';
                        break;
                    case 'bottom':
                        style['borderTopLeftRadius'] = this.round + 'px';
                        style['borderTopRightRadius'] = this.round + 'px';
                        break;
                    case 'left':
                        style['borderTopRightRadius'] = this.round + 'px';
                        style['borderBottomRightRadius'] = this.round + 'px';
                        break;
                    case 'right':
                        style['borderTopLeftRadius'] = this.round + 'px';
                        style['borderBottomLeftRadius'] = this.round + 'px';
                        break;
                    case 'center':
                        style['borderRadius'] = this.round + 'px';
                        break;
                }

                return style;
            },
            // 关闭Icon样式
            closeIconStyle() {
                let style = {
                    zIndex: 999,
                };
                let posSize = 28;
                switch (this.closeIconPos) {
                    case 'top-left':
                        style['position'] = 'absolute';
                        style['top'] = '0rpx';
                        style['left'] = '0rpx';
                        break;
                    case 'top-right':
                        style['position'] = 'absolute';
                        style['top'] = '0rpx';
                        style['right'] = '0rpx';
                        break;
                    case 'top-center':
                        style['position'] = 'absolute';
                        style['top'] = -(posSize * 4) + 'rpx';
                        style['left'] = '0rpx';
                        style['right'] = '0rpx';
                        break;
                    case 'bottom-left':
                        style['position'] = 'absolute';
                        style['bottom'] = '0rpx';
                        style['left'] = '0rpx';
                        break;
                    case 'bottom-right':
                        style['position'] = 'absolute';
                        style['bottom'] = '0rpx';
                        style['right'] = '0rpx';
                        break;
                    case 'bottom-center':
                        style['position'] = 'absolute';
                        style['bottom'] = -(posSize * 4) + 'rpx';
                        style['left'] = '0rpx';
                        style['right'] = '0rpx';
                        break;
                    default:
                        if (this.title != '') {
                            style['position'] = 'absolute';
                            style['top'] = '0rpx';
                            style['right'] = '0rpx';
                        }
                        break;
                }
                let result = '';
                Object.keys(style).forEach(key => {
                    result += `${key}: ${style[key]};`;
                });
                return result;
            },
        },
        mounted() {
            const fixSize = () => {
                const { windowWidth, windowHeight, windowTop, safeArea, screenHeight, safeAreaInsets } = uni.getSystemInfoSync();
                this.popupWidth = windowWidth;
                this.popupHeight = windowHeight + (windowTop || 0);
                // TODO fix by mehaotian 是否适配底部安全区 ,目前微信ios 、和 app ios 计算有差异，需要框架修复
                if (safeArea && this.safeArea) {
                    // #ifdef MP-WEIXIN
                    this.safeAreaInsets = screenHeight - safeArea.bottom;
                    // #endif
                    // #ifndef MP-WEIXIN
                    this.safeAreaInsets = safeAreaInsets.bottom;
                    // #endif
                } else {
                    this.safeAreaInsets = 0;
                }
            };
            fixSize();
            // #ifdef H5
            // window.addEventListener('resize', fixSize)
            // this.$once('hook:beforeDestroy', () => {
            // 	window.removeEventListener('resize', fixSize)
            // })
            // #endif
            // #ifdef APP-NVUE
            // 修复nvue 遮罩层位置问题
            const data = uni.getWindowInfo();
            this.maskClass.top = - data.windowHeight + 'px;';
            // #endif
        },
        // #ifndef VUE3
        // TODO vue2
        destroyed() {
            this.setH5Visible();
        },
        // #endif
        // #ifdef VUE3
        // TODO vue3
        unmounted() {
            this.setH5Visible();
        },
        // #endif
        created() {
            // this.mkclick =  this.isMaskClick || this.maskClick
            if (this.isMaskClick === null && this.maskClick === null) {
                this.mkclick = true;
            } else {
                this.mkclick = this.isMaskClick != null ? this.isMaskClick : this.maskClick;
            }
            if (this.animation) {
                this.duration = 300;
            } else {
                this.duration = 0;
            }
            // TODO 处理 message 组件生命周期异常的问题
            this.messageChild = null;
            // TODO 解决头条冒泡的问题
            this.clearPropagation = false;
            this.maskClass.backgroundColor = this.maskBackgroundColor;
        },
        methods: {
            setH5Visible() {
                // #ifdef H5
                // fix by mehaotian 处理 h5 滚动穿透的问题
                document.getElementsByTagName('body')[0].style.overflow = 'visible';
                // #endif
            },
            /**
             * 公用方法，不显示遮罩层
             */
            closeMask() {
                this.maskShow = false;
            },
            /**
             * 公用方法，遮罩层禁止点击
             */
            disableMask() {
                this.mkclick = false;
            },
            // TODO nvue 取消冒泡
            clear(e) {
                // #ifndef APP-NVUE
                e.stopPropagation();
                // #endif
                this.clearPropagation = true;
            },

            open(direction) {
                // fix by mehaotian 处理快速打开关闭的情况
                if (this.showPopup) {
                    clearTimeout(this.timer);
                    this.showPopup = false;
                }
                let innerType = ['top', 'center', 'bottom', 'left', 'right', 'message', 'dialog', 'share'];
                if (!(direction && innerType.indexOf(direction) != -1)) {
                    direction = this.type;
                }
                if (!this.config[direction]) {
                    return;
                }
                this[this.config[direction]]();
                this.$emit('change', {
                    show: true,
                    type: direction,
                });
            },
            close(type) {
                this.showTrans = false;
                this.$emit('change', {
                    show: false,
                    type: this.type,
                });
                clearTimeout(this.timer);
                // // 自定义关闭事件
                // this.customOpen && this.customClose()
                this.timer = setTimeout(() => {
                    this.showPopup = false;
                }, 300);
            },
            // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
            touchstart() {
                this.clearPropagation = false;
            },

            onTap() {
                if (this.clearPropagation) {
                    // fix by mehaotian 兼容 nvue
                    this.clearPropagation = false;
                    return;
                }
                this.$emit('maskClick');
                if (!this.mkclick) return;
                this.close();
            },
            /**
             * 顶部弹出样式处理
             */
            top(type) {
                this.popupstyle = this.isDesktop ? 'fixforpc-top' : 'top';
                this.ani = ['slide-top'];
                this.transClass = {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    backgroundColor: this.bg,
                };
                // TODO 兼容 type 属性 ，后续会废弃
                if (type) return;
                this.showPopup = true;
                this.showTrans = true;
                this.$nextTick(() => {
                    if (this.messageChild && this.type === 'message') {
                        this.messageChild.timerClose();
                    }
                });
            },
            /**
             * 底部弹出样式处理
             */
            bottom(type) {
                this.popupstyle = 'bottom';
                this.ani = ['slide-bottom'];
                this.transClass = {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    paddingBottom: this.safeAreaInsets + 'px',
                    backgroundColor: this.bg,
                };
                // TODO 兼容 type 属性 ，后续会废弃
                if (type) return;
                this.showPopup = true;
                this.showTrans = true;
            },
            /**
             * 中间弹出样式处理
             */
            center(type) {
                this.popupstyle = 'center';
                this.ani = ['zoom-out', 'fade'];
                this.transClass = {
                    position: 'fixed',
                    /* #ifndef APP-NVUE */
                    display: 'flex',
                    flexDirection: 'column',
                    /* #endif */
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                };
                // TODO 兼容 type 属性 ，后续会废弃
                if (type) return;
                this.showPopup = true;
                this.showTrans = true;
            },
            left(type) {
                this.popupstyle = 'left';
                this.ani = ['slide-left'];
                this.transClass = {
                    position: 'fixed',
                    left: 0,
                    bottom: 0,
                    top: 0,
                    backgroundColor: this.bg,
                    /* #ifndef APP-NVUE */
                    display: 'flex',
                    flexDirection: 'column',
                    /* #endif */
                };
                // TODO 兼容 type 属性 ，后续会废弃
                if (type) return;
                this.showPopup = true;
                this.showTrans = true;
            },
            right(type) {
                this.popupstyle = 'right';
                this.ani = ['slide-right'];
                this.transClass = {
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    top: 0,
                    backgroundColor: this.bg,
                    /* #ifndef APP-NVUE */
                    display: 'flex',
                    flexDirection: 'column',
                    /* #endif */
                };
                // TODO 兼容 type 属性 ，后续会废弃
                if (type) return;
                this.showPopup = true;
                this.showTrans = true;
            },
            comfirm() {
                if (this.isConfirmClose) {
                    this.close();
                }
                this.$emit('callBack');
            },
            // 自定义按钮点击回调
            custom_change() {
                if (this.isConfirmClose) {
                    this.close();
                }
                this.$emit('callBackCustom');
            },
        },
    };
</script>
<style lang="scss" scoped>
    .uni-popup {
        position: fixed;
        /* #ifndef APP-NVUE */
        z-index: 99;

        /* #endif */
        &.top,
        &.left,
        &.right {
            /* #ifdef H5 */
            top: var(--window-top);
            /* #endif */
            /* #ifndef H5 */
            top: 0;
            /* #endif */
        }

        &.top {
            .popup-close {
                display: none;
            }
        }
        &.center,
        &.bottom,
        &.left {
            .popup-close {
                display: flex;
                justify-content: flex-end;
            }
        }

        &.right {
            .popup-close {
                display: flex;
                justify-content: flex-start;
            }
        }

        .uni-popup__wrapper {
            /* #ifndef APP-NVUE */
            display: block;
            /* #endif */
            position: relative;
            overflow-y: auto;

            /* iphonex 等安全区设置，底部安全区适配 */
            /* #ifndef APP-NVUE */
            // padding-bottom: constant(safe-area-inset-bottom);
            // padding-bottom: env(safe-area-inset-bottom);
            /* #endif */
            &.left,
            &.right {
                /* #ifdef H5 */
                padding-top: var(--window-top);
                /* #endif */
                /* #ifndef H5 */
                padding-top: 0;
                /* #endif */
                flex: 1;
            }
        }

        .popup-close {
            padding: 28rpx;
            &.top-center,
            &.bottom-center {
                justify-content: center;
            }
        }

        .title {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .fixforpc-z-index {
        /* #ifndef APP-NVUE */
        z-index: 999;
        /* #endif */
    }

    .fixforpc-top {
        top: 0;
    }
</style>
