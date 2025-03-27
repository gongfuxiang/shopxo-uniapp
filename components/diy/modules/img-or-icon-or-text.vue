<template>
    <view v-if="is_show" :style="corner_marker + (propType == 'data_discounts' ? 'background-size: 400%;' : '')" :class="propType == 'data_discounts' ? 'discount-icon' : ''">
        <view class="flex-row nowrap oh" :style="corner_img_marker">
            <template v-if="type_boolean">
                <template v-if="!isEmpty(type_img)">
                    <image-empty v-model="type_img[0]" :style="img_style"></image-empty>
                </template>
                <template v-else>
                    <iconfont :name="'icon-' + type_icon" :size="new_type_size * 2 + 'rpx'" :color="new_type_color" propContainerDisplay="flex"></iconfont>
                </template>
            </template>
            <template v-else>
                <view class="text-line-1" :style="'font-size:' + new_type_size * 2 + 'rpx;color:' + new_type_color">{{ type_text }}</view>
            </template>
        </view>
    </view>
</template>

<script>
    import { isEmpty, common_styles_computer, padding_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propType: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                is_show: false,
                type_boolean: false,
                type_img: [],
                type_icon: '',
                type_text: '',
                new_type_size: 0,
                new_type_color: '',
                img_style: '',
            };
        },
        watch: {
            propValue(val) {
                this.init();
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                const content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                // 取出某一个对应的数据信息
                const new_type_style = new_style[`${ this.propType }_style`] || {};
                this.setData({
                    is_show: content[`is_${ this.propType }_show`] == '1',
                    type_boolean: content[`${ this.propType }_type`] == 'img-icon',
                    type_img: content[`${ this.propType }_img`] || [],
                    type_icon: content[`${ this.propType }_icon`] || '',
                    type_text: content[`${ this.propType }_text`] || '',
                    // 取出对应的大小显示
                    new_type_size: new_type_style?.size || 0,
                    new_type_color: new_type_style?.color || '',
                    // 大小设置
                    corner_marker: common_styles_computer(new_type_style),
                    corner_img_marker: padding_computer(new_type_style),
                    // 图片设置
                    img_style: `height: ${ new_type_style.img_height }px; width: ${ new_type_style.img_width }px`,
                })
            },
        },
    };
</script>
<style lang="scss" scoped>
    .img_wh {
        width: 100%;
        height: 100%;
    }
    .discount-icon {
        animation: gradient 5s ease infinite;
    }
    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
</style>
