<template>
    <view v-if="form.button_img.length > 0" class="pa" :style="style">
        <view class="flex-row align-c jc-c" @click="url_open">
            <view class="spread flex-row align-c jc-c">
                <block v-if="new_style.float_style == 'diffuse'">
                    <view class="ring" :style="`background-color: ${ color }`"></view>
                    <view class="ring" :style="`background-color: ${ color }`"></view>
                </block>
                <image :src="form.button_img[0].url" class="img" :style="color" fit="cover"></image>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
import { is_obj_empty } from '../../common/js/common/common';
export default {
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
        this.form = this.value.content;
        this.new_style = this.value.style;
        const { float_style, float_style_color, display_location, offset_number } = this.value.style;
        this.color = float_style == 'shadow' ? `box-shadow: 0 5px 20px ${ float_style_color }` : float_style_color;
        let location = `right: 10px;`;
        if (display_location == 'left') {
            location = `left: 10px;`;
        }
        this.style = `bottom: ${((offset_number / window.innerHeight) * 100).toFixed(4) + '%'};` + location;
    },
    methods: {
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
