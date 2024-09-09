<template>
    <view :style="style_container">
        <view class="pr flex-row" :class="title_center">
            <view class="z-i pr-15" :style="title_style">{{ form.title || '标题' }}</view>
            <view class="flex-row gap-10 align-c right-0 pa">
                <template v-if="form.keyword_show == '1'">
                    <view v-for="item in keyword_list" :key="item.id" :style="keyword_style">
                        {{ item.title }}
                    </view>
                </template>
                <view v-if="form.right_show == '1'" class="nowrap" :style="right_style">{{ form.right_title }}<el-icon class="iconfont icon-arrow-right" :color="new_style.right_color || '#999'"></el-icon></view>
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
            style_container: '',
        };
    },
    created() {
        this.form = this.value.content;
        this.new_style = this.value.style;
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
