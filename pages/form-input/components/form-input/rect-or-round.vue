<template>
    <view class="rendering-area wh-auto ht-auto pa-3">
        <view class="wh-auto ht-auto" :style="border_style"></view>
    </view>
</template>

<script>
    import { isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
        },
        data() {
            return {
                border_style: '',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                const com_data = this.propValue;
                this.setData({
                    border_style: `${ com_data.type == 'rect' ? '' : 'border-radius: 50%;'}box-sizing: border-box;border: ${ com_data.border_size }px ${ com_data.border_style } ${ com_data.border_color};`,
                });
            }
        },
    };
</script>

<style lang="scss" scoped>
.pa-3 {
    padding: 6rpx;
    box-sizing: border-box;
}
</style>
