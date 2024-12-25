<template>
    <view class="iconfont-container" :class="propClass" :style="'display:'+propContainerDisplay+';'">
        <text class="iconfont" :class="name" :style="[{ color: color }, { 'font-size': size }]" @tap="$emit('click', $event)"></text>
    </view>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: '',
            },
            color: {
                type: String,
                default: '',
            },
            size: {
                type: String,
                default: '28rpx',
            },
            propClass: {
                type: String,
                default: '',
            },
            propContainerDisplay: {
                type: String,
                default: 'inline-block',
            }
        },
    };
</script>

<style scoped>
    /* iconfont.css全局注册需要将src切换成绝对路径 */
    /* @/static/icon/ */
    @import url('@/static/icon/iconfont.css');
    /* @import url('https://at.alicdn.com/t/c/font_4227145_kbr2f9jt68b.css'); */
    .iconfont {
        display: flex;
        font-size: inherit;
        overflow: hidden;
        /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
        vertical-align: -0.15em;
        outline: none;
        /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
        fill: currentcolor;
    }
</style>
