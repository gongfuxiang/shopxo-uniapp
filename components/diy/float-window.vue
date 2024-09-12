<template>
    <view v-if="form.button_img.length > 0" class="pa" :style="style">
        <view class="flex-row align-c jc-c" @click="url_open">
            <view class="spread flex-row align-c jc-c">
                <block v-if="new_style.float_style == 'diffuse'">
                    <view class="ring" :style="color"></view>
                    <view class="ring" :style="color"></view>
                </block>
                <image-empty :image-src="form.button_img[0]" class="img" :style="color" img_fit="aspectFill" error-style="width: 60rpx;height: 60rpx;"></image-empty>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
import { is_obj_empty } from '../../common/js/common/common';
import imageEmpty from './modules/image-empty.vue';
export default {
    components: {
        imageEmpty
    },
    props: {
        value: {
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
            style: '',
            color: ''
        };
    },
    created() {
        this.setData({
            form: this.value.content,
            new_style: this.value.style
        });
        this.init();
    },
    methods: {
        init() {
            const { float_style, float_style_color, display_location, offset_number } = this.value.style;
            let location = `right: 20rpx;`;
            if (display_location == 'left') {
                location = `left: 20rpx;`;
            }
            const { windowHeight } = uni.getSystemInfoSync();
            this.setData({
                color: float_style == 'shadow' ? `box-shadow: 0 10rpx 40rpx ${ float_style_color }` : `background-color: ${ float_style_color }`,
                style: `bottom: ${((offset_number / windowHeight) * 100).toFixed(4) + '%'};` + location
            });
        },
        url_open() {
            const { button_jump, button_link} = this.form;
            if (button_jump == 'link' && !is_obj_empty(button_link)) {
                app.globalData.url_open(button_link.page)
            } else {
                console.log('客服');
            }
        }
    },
};
</script>

<style scoped lang="scss">
.img {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
}
/**
* 呼吸灯
*/
.spread {
    position: relative;
    z-index: 1;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
}
.spread .ring {
    /* 速度为1.5 * 层数 = 实际运行速度，速度修改则 animation-delay 属性也修改相同速度 */
    animation: pulsing 1.5s ease-out infinite;
    border-radius: 100%;
    width: 100rpx;
    height: 100rpx;
    position: absolute;
}
/* 速度为1*层数 */
.spread .ring:nth-of-type(1) {
    -webkit-animation-delay: -1.5s;
    animation-delay: -1.5s;
}

/* 速度为1*层数 */
.spread .ring:nth-of-type(2) {
    -webkit-animation-delay: -2s;
    animation-delay: -2s;
}
@keyframes pulsing {
    100% {
        transform: scale(1.35);
        opacity: 0
    }
}
</style>
