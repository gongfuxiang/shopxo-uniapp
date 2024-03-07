<template>
    <view :class="'switch-container switch-container-size-' + propSize" :style="'background:' + propBgColor + ';border:1px solid ' + propBrColor + ';'">
        <view class="switch_view">
            <view :class="'switch-item ' + propCheckedClass + ' ' + (isSwitch ? 'checked_switch' : '')" :style="isSwitch ? `color:${propCheckedColor}` : ''" @click.prevent.stop="changeSwitch(true)" :animation="animationData2">
                {{ propSwitchList[0] || this.$t('switch.switch.924s7v') }}
            </view>
            <view class="switch-item" :class="{ checked_switch: !isSwitch }" :style="!isSwitch ? `color:${propCheckedColor}` : ''" @click.prevent.stop="changeSwitch(false)" :animation="animationData3">
                {{ propSwitchList[1] || this.$t('switch.switch.g142o6') }}
            </view>
        </view>
        <view class="disabled" v-if="propDisabled"></view>
        <view :class="'position_view ' + propCheckedBgClass" :animation="animationData1" :style="[{ background: propCheckedBgColor }]"></view>
    </view>
</template>
<script>
    export default {
        props: {
            propSwitchList: {
                type: Array,
                default: ['', ''],
            },
            propSize: {
                type: String,
                default: 'sm',
            },
            propDefault: {
                type: Boolean,
                default: true,
            },
            propIsShowModal: {
                type: Boolean,
                default: false,
            },
            propDisabled: {
                type: Boolean,
                default: false,
            },
            propBgColor: {
                type: String,
                default: '#fff',
            },
            propBrColor: {
                type: String,
                default: '#ccc',
            },
            propCheckedBgColor: {
                type: String,
                default: '#4caf50',
            },
            propCheckedBgClass: {
                type: String,
                default: '',
            },
            propCheckedColor: {
                type: String,
                default: '#fff',
            },
            propCheckedClass: {
                type: String,
                default: '',
            },
            propId: {
                type: null,
                default: null,
            },
        },
        data() {
            return {
                isSwitch: true,
                initAnimation: {},
                animationData1: {},
                animationData2: {},
                animationData3: {},
            };
        },
        created() {
            this.initAnimation = uni.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            });
            this.isSwitch = this.propDefault;
            this.changeAnimation();
        },
        methods: {
            changeSwitch(isSwitch) {
                if (isSwitch == this.isSwitch || this.propDisabled) {
                    return;
                }
                if (this.propIsShowModal) {
                    let index = isSwitch ? 0 : 1;
                    let text = this.propSwitchList[index];
                    let self = this;
                    uni.showModal({
                        title: self.$t('switch.switch.447u86'),
                        content: self.$t('switch.switch.8w5ok6', [text]),
                        success: (res) => {
                            if (res.confirm) {
                                self.isSwitch = isSwitch;
                                self.changeAnimation();
                                self.callParentEvent(isSwitch);
                            }
                        },
                    });
                } else {
                    this.isSwitch = isSwitch;
                    this.changeAnimation();
                    this.callParentEvent(isSwitch);
                }
            },
            changeAnimation() {
                if (this.isSwitch) {
                    this.animationData1 = this.initAnimation.left(0).width('60%').step().export();
                    this.animationData2 = this.initAnimation.width('60%').step().export();
                    this.animationData3 = this.initAnimation.width('40%').step().export();
                } else {
                    this.animationData1 = this.initAnimation.left('40%').width('60%').step().export();
                    this.animationData2 = this.initAnimation.width('40%').step().export();
                    this.animationData3 = this.initAnimation.width('60%').step().export();
                }
            },
            callParentEvent() {
                this.$emit('change', this.isSwitch, this.propId, () => {
                    // 回调方法应用场景：父级组件请求api接口失败调用
                    this.isSwitch = !this.isSwitch;
                    this.changeAnimation();
                });
            },
        },
    };
</script>
<style>
    .switch-container {
        display: flex;
        flex-direction: row;
        width: 180rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 1000px;
        position: relative;
    }
    .switch-container .switch_view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        display: flex;
        border-radius: 1000px;
    }
    .switch-container .switch_view .switch-item {
        color: #666;
        font-size: 24rpx;
        height: 100%;
        width: 40%;
        border-radius: 1000px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .switch-container .position_view {
        position: absolute;
        top: 0;
        left: 0;
        width: 60%;
        height: 100%;
        border-radius: 1000px;
        background: #1aad19;
    }
    .switch-container .disabled {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        background: #fff;
        opacity: 0.6;
        border-radius: 1000px;
    }
    .switch-container-size-xs {
        width: 150rpx;
        height: 45rpx;
        line-height: 45rpx;
    }
</style>
