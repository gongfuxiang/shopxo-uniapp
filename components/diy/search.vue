<template>
    <view :style="style_container">
        <view :style="style" class="flex-row align-c">
            <view class="search wh-auto pr">
                <view class="box oh flex-row align-c gap-10 bg-white" :style="box_style">
                    <template v-if="form.is_icon_show == '1'">
                        <template v-if="form.icon_img.length > 0">
                            <view class="img-box">
                                <image :src="form.icon_img[0].url" class="img" mode="aspectFill"></image>
                            </view>
                        </template>
                        <template v-else>
                            <iconfont :name="!is_obj_empty(form.icon_class) ? 'icon-' + form.icon_class : 'icon-index-search'" size="'28rpx'" :color="new_style.icon_color"></iconfont>
                        </template>
                    </template>
                    <span v-if="form.is_tips_show == '1'" :class="[isPageSettings ? 'text-size-xs text-line-1' : 'text-size-md text-line-1']" :style="`color: ${ new_style.tips_color }`">{{ form.tips }}</span>
                </view>
                <view v-if="form.is_search_show == '1'" class="pa search-botton h flex-row align-c jc-c" :style="search_button">
                    <template v-if="form.search_type === 'text'">
                        <view :class="['padding-vertical-xs text-size-xs', isPageSettings ? 'padding-horizontal' : 'padding-horizontal-lg']">{{ form.search_tips }}</view>
                    </template>
                    <template v-else-if="!is_obj_empty(form.search_botton_img) && form.search_botton_img.length > 0">
                        <image :src="form.search_botton_img[0].url" class="img" :style="search_button_radius" mode="aspectFill"></image>
                    </template>
                    <template v-else>
                        <view :class="['padding-vertical-xs text-size-xs', isPageSettings ? 'padding-horizontal' : 'padding-horizontal-lg']">
                            <iconfont :name="!is_obj_empty(form.search_botton_icon) ? 'icon-' + form.search_botton_icon : ''" size="'28rpx'"></iconfont>
                        </view>
                    </template>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { background_computer, common_styles_computer, gradient_computer, radius_computer, is_obj_empty } from '@/common/js/common/common.js';
    export default {
        props: {
            value: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            isPageSettings: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                style: '',
                style_container: '',
                search_button_radius: '',
                box_style: '',
                search_button: '',
            };
        },
        created() {
            this.form = this.value.content;
            this.new_style = this.value.style;
            this.init();
        },
        methods: {
            is_obj_empty,
            init() {
                const { search_button_radius, common_style } = this.new_style;
                // 内部样式
                this.style = this.get_style();
                // 全局样式
                this.style_container = this.isPageSettings ? '' : common_styles_computer(common_style);
                // 按钮圆角
                this.search_button_radius = radius_computer(search_button_radius);
                // 搜索框设置
                this.box_style = this.get_box_style();
                // 搜索按钮显示
                this.search_button = this.get_search_button();
            },
            get_style() {
                let common_styles = '';
                if (this.new_style.text_style == 'italic') {
                    common_styles += `font-style: italic`;
                } else if (this.new_style.text_style == '500') {
                    common_styles += `font-weight: 500`;
                }
                return common_styles;
            },
            get_box_style() {
                let style = `border: 1px solid ${ this.new_style.search_border }; ${ radius_computer(this.new_style.search_border_radius) };`;
                if (this.form.is_center == '1') {
                    style += `justify-content: center;`;
                }
                return style;
            },
            get_search_button() {
                let style = this.search_button_radius;
                const { search_botton_color_list, search_botton_direction, search_botton_background_img_style, search_botton_background_img  } = this.new_style;
                if (this.form.search_type != 'img') {
                    const data = {
                        color_list: search_botton_color_list,
                        direction: search_botton_direction,
                        background_img: search_botton_background_img,
                        background_img_style: search_botton_background_img_style,
                    }
                    style += gradient_computer(data) + background_computer(data) + `color: ${ this.new_style.button_inner_color };`;
                }
                console.log(style);
                return style;
            }
        },
    };
</script>

<style lang="scss" scoped>
.search {
    height: 64rpx;
    .box {
        padding: 12rpx 30rpx;
    }
    .img-box {
        height: 100%;
        min-width: 4rpx;
        max-width: 12rpx;
    }
    .search-botton {
        height: 56rpx;
        top: 4rpx;
        right: 4rpx;
        .img {
            height: 56rpx;
            min-width: 6rpx;
            max-width: 20rpx;
        }
    }
    
}
</style>
