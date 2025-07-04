<template>
    <view class="content w flex-1 flex-row" :style="propStyle + 'height: 100%;' + line_location">
        <view :style="border_style"></view>
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
            propDataId: {
                type: String,
                default: '',
            },
            propStyle: {
                type: String,
                default: '',
            },
            propIsCustom: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                com_data: {},
                line_location: '',
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
                let border_style = '';
                 if (!this.propIsCustom) {
                    border_style =`width: ${ com_data.line_width }%;border-bottom: ${ com_data.line_size }px ${ com_data.line_style } ${ com_data.line_color };`;
                } else {
                    if (com_data.line_type === 'horizontal') {
                        border_style = `width: ${com_data.com_width * 2}rpx;margin: 10rpx 0;border-bottom: ${com_data.line_size * 2 }rpx ${com_data.line_style} ${com_data.line_color};`;
                    } else {
                        border_style = `height: ${com_data.com_height * 2}rpx;margin: 0 10rpx;border-right: ${com_data.line_size * 2 }rpx ${com_data.line_style} ${com_data.line_color};`;
                    }
                }
                this.setData({
                    com_data: com_data,
                    border_style: border_style,
                    line_location: `justify-content: ${ com_data.line_location };`
                });
            }
        },
    };
</script>

<style></style>
