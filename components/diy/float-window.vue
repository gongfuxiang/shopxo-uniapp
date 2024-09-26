<template>
    <movable-area class="online-service-movable-container">
        <movable-view :x="x" :y="y" direction="all" class="float-window-spread flex-row align-c jc-c">
            <block v-if="new_style.float_style == 'diffuse'">
                <view class="ring" :style="color"></view>
                <view class="ring" :style="color"></view>
            </block>
            <view class="img">
                <imageEmpty :propImageSrc="form.button_img[0]" :propStyle="color" propImgFit="aspectFill" propErrorStyle="width: 60rpx;height: 60rpx;"></imageEmpty>
            </view>
        </movable-view>
    </movable-area>
</template>

<script>
    const app = getApp();
    import { isEmpty } from '@/common/js/common/common.js';
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
    export default {
        components: {
            imageEmpty,
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                x: 0,
                y: 0,
                style: '',
                color: '',
            };
        },
        created() {
            this.setData({
                form: this.propValue.content,
                new_style: this.propValue.style,
            });
            this.init();
        },
        methods: {
            init() {
                const { float_style, float_style_color, display_location, offset_number_percentage } = this.propValue.style;

                const { windowWidth, windowHeight } = uni.getSystemInfoSync();
                let x = windowWidth - 10;
                if (display_location == 'left') {
                    x = 10;
                }
                // 计算出距离顶部的距离
                const num = Math.ceil(windowHeight * (1 - Number(offset_number_percentage)));
                this.setData({
                    color: float_style == 'shadow' ? `box-shadow: 0 10rpx 40rpx ${float_style_color};border-radius: 50%;` : `background-color: ${float_style_color};border-radius: 50%;`,
                    x: x,
                    y: num
                });
            },
            url_open() {
                const { button_jump, button_link } = this.form;
                if (button_jump == 'link' && !isEmpty(button_link)) {
                    app.globalData.url_open(button_link.page);
                } else {
                    console.log('客服');
                }
            },
        },
    };
</script>

<style scoped lang="scss">
    .img {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
    }
    .float-window {
        z-index: 103;
    }
    .online-service-movable-container {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: transparent;
        pointer-events: none;
        z-index: 103;
    }
    /**
    * 呼吸灯
    */
    .float-window-spread {
        position: relative;
        pointer-events: auto;
        z-index: 1;
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
    }
    .float-window-spread .ring {
        /* 速度为1.5 * 层数 = 实际运行速度，速度修改则 animation-delay 属性也修改相同速度 */
        animation: pulsing 1.5s ease-out infinite;
        border-radius: 100%;
        width: 100rpx;
        height: 100rpx;
        position: absolute;
    }
    /* 速度为1*层数 */
    .float-window-spread .ring:nth-of-type(1) {
        -webkit-animation-delay: -1.5s;
        animation-delay: -1.5s;
    }

    /* 速度为1*层数 */
    .float-window-spread .ring:nth-of-type(2) {
        -webkit-animation-delay: -2s;
        animation-delay: -2s;
    }
    @keyframes pulsing {
        100% {
            transform: scale(1.35);
            opacity: 0;
        }
    }
</style>
