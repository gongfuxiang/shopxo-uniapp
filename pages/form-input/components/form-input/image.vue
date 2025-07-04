<template>
    <view class="form-input-image"> 
        <image-empty :propImageSrc="img_src" :propStyle="img_style" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
    </view>
</template>

<script> 
    import { isEmpty } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/form-input/components/form-input/modules/image-empty.vue';
    export default {
        components: {
            imageEmpty
        },
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
                img_src: '',
                img_style: 'width: 100%;height:100%;',
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
            init() {
                const com_data = this.propValue;
                let img_style = `width: 100%;height:100%;`;
                if (!this.propIsCustom && !isEmpty(com_data)) {
                    const { img_width, img_scale_type } = com_data;
                    const height = img_scale_type === '1' ? img_width : img_scale_type == '0' ? (img_width * 9) / 16 : (img_width * 3) / 4;
                    img_style = `width: ${ img_width * 2 }rpx;height:${ height * 2 }rpx;`
                }
                this.setData({
                    com_data: com_data,
                    img_src: com_data.img_src.length > 0 ? com_data.img_src[0] : '',
                    img_style: img_style,
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>