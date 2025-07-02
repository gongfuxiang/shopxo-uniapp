<template>
    <!-- 视频 -->
    <view :style="propStyle + 'height:100%;color:' + com_data.text_color + ';'">
       {{ isEmpty(form_value) ? '没有内容' : form_value }}
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
            propDataIndex: {
                type: Number,
                default: 0,
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
                form_value: '',
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
                    com_data: com_data,
                    form_value: com_data?.form_value || '',
                });
            }
        },
    };
</script>

<style></style>
