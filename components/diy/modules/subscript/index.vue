<template>
    <view v-if="form.seckill_subscript_show == '1'" class="corner-marker" :style="corner_marker">
        <view class="flex-row nowrap" :style="corner_img_marker">
            <template v-if="form.subscript_type == 'img-icon'">
                <template v-if="!isEmpty(form.subscript_img_src)">
                    <image :src="form.subscript_img_src[0].url" mode="aspectFill" :style="img_style" />
                </template>
                <template v-else>
                    <iconfont :name="'icon-' + form.subscript_icon_class" propContainerDisplay="flex" :size="new_style.subscript_style.text_or_icon_size * 2 + 'rpx'" :color="new_style.subscript_style.text_or_icon_color"></iconfont>
                </template>
            </template>
            <template v-else>
                <span class="text-line-1" :style="text_size">{{ form.subscript_text }}</span>
            </template>
        </view>
    </view>
</template>

<script>
    import { common_img_computer, common_styles_computer, isEmpty } from '@/common/js/common/common.js';
    import iconfont from '@/components/iconfont/iconfont';
    export default {
        components: {
            iconfont,
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propType: {
                type: String,
                default: 'outer',
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                corner_img_marker: '',
                img_style: '',
                text_size: '',
            };
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                if (!isEmpty(this.propValue)) {
                    const new_content = this.propValue.content || {};
                    const new_style = this.propType == 'outer' ? this.propValue.style || {} : { subscript_style: this.propValue.style || {} };
                    if (!isEmpty(new_style.subscript_style)) {
                        // 视频比例
                        this.setData({
                            form: new_content,
                            new_style: new_style,
                            corner_marker: this.get_corner_marker(new_style),
                            text_size: `font-size: ${ new_style.subscript_style.text_or_icon_size * 2 }rpx;color: ${ new_style.subscript_style.text_or_icon_color };`,
                            corner_img_marker: common_img_computer(new_style.subscript_style),
                            img_style: `height: ${new_style.subscript_style.img_height * 2}rpx; width: ${new_style.subscript_style.img_width * 2}rpx`,
                        });
                    }
                }
            },
            get_corner_marker(new_style) {
                const { subscript_style } = new_style;
                let location = common_styles_computer(subscript_style);
                // 获取内部的显示数据
                const { seckill_subscript_location, top_or_bottom_spacing, left_or_right_spacing } = subscript_style;
                // 圆角根据图片的圆角来计算 对角线是同样的圆角
                if (seckill_subscript_location == 'top-left') {
                    location += `top: ${ top_or_bottom_spacing * 2 }rpx;left: ${ left_or_right_spacing * 2 }rpx;`;
                } else if (seckill_subscript_location == 'top-center') {
                    location += 'top: 0;left: 50%;transform: translateX(-50%);';
                } else if (seckill_subscript_location == 'top-right') {
                    location += `top: ${ top_or_bottom_spacing * 2 }rpx;right:${ left_or_right_spacing * 2 }rpx;`;
                } else if (seckill_subscript_location == 'bottom-left') {
                    location += `bottom: ${ top_or_bottom_spacing * 2 }rpx;left: ${ left_or_right_spacing * 2 }rpx;`;
                } else if (seckill_subscript_location == 'bottom-center') {
                    location += 'bottom: 0;left: 50%;transform: translateX(-50%);';
                } else if (seckill_subscript_location == 'bottom-right') {
                    location += `bottom: ${ top_or_bottom_spacing * 2 }rpx;right: ${ left_or_right_spacing * 2 }rpx;`;
                }
                return location;
            },
        },
    };
</script>

<style>
.corner-marker {
    position: absolute;
    max-width: 100%;
}
</style>
