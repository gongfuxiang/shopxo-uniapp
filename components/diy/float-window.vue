<template>
    <view v-if="form.button_img.length > 0" class="pa" :style="style">
        <view class="flex-row align-c jc-c suspension">
            <view class="spread flex-row align-c jc-c">
                {{ new_style.float_style }}
                <block v-if="new_style.float_style == 'diffuse'">
                    <view class="ring"></view>
                    <view class="ring"></view>
                </block>
                <image :src="form.button_img[0].url" :class="{'shadow': new_style.float_style == 'shadow'}"></image>
            </view>
        </view>
    </view>
</template>

<script>
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
            const { float_style_color, display_location, offset_number } = this.value.style;
            this.color = float_style_color;
            let location = `right: 10px;`;
            if (display_location == 'left') {
                location = `left: 10px;`;
            }
            this.style = `bottom: ${((offset_number / window.innerHeight) * 100).toFixed(4) + '%'};` + location;
        },
        methods: {
            
        },
    };
</script>

<style scoped lang="scss">
:deep(.el-image) {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 50%;
    .image-slot img {
        width: 3rem;
        height: 3rem
    }
}
.shadow {
    box-shadow: 0 5px 20px v-bind(color);
}
/**
* 呼吸灯
*/
.spread {
    position: relative;
    z-index: 1;
    width: 6rem;
    height: 6rem;
}
.spread .ring {
    /* 速度为1.5 * 层数 = 实际运行速度，速度修改则 animation-delay 属性也修改相同速度 */
    animation: pulsing 1.5s ease-out infinite;
    background-color: v-bind(color);
    border-radius: 100%;
    width: 5rem;
    height: 5rem;
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
