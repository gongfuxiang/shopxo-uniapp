<template>
    <!-- 图片魔方 -->
    <view class="img-magic" :style="style_container + 'height:' + (form.style_actived == 10 ? '100%' : container_size)">
        <view class="magic-container wh-auto ht-auto" :style="style_img_container">
            <view class="pr" :style="outer_style">
                <!-- 风格3 -->
                <template v-if="form.style_actived == 2">
                    <view class="flex-row align-c jc-c style-size">
                        <view v-for="(item, index) in form.img_magic_list" :key="index" class="three" :style="img_spacing" :data-value="item.img_link ? item.img_link.page : ''" @tap="url_event">
                            <image v-if="item.img.length > 0" :src="item.img[0].url" class="dis-block wh-auto ht-auto" :mode="img_fit" :style="content_img_radius"></image>
                        </view>
                    </view>
                </template>
                <!-- 风格9 -->
                <template v-else-if="form.style_actived == 8">
                    <view class="flex-row align-c jc-c style-size flex-wrap">
                        <view v-for="(item, index) in form.img_magic_list" :key="index" :class="[{ 'style9-top': [0, 1].includes(index), 'style9-bottom': ![0, 1].includes(index) }]" :style="img_spacing" :data-value="item.img_link ? item.img_link.page : ''" @tap="url_event">
                            <image v-if="item.img.length > 0" :src="item.img[0].url" class="dis-block wh-auto ht-auto" :mode="img_fit" :style="content_img_radius"></image>
                        </view>
                    </view>
                </template>
                <template v-else-if="form.style_actived == 10">
                    <template v-if="form.limit_size == '0'">
                        <view v-for="(item, index) in form.img_magic_list" :key="index" class="cr-main" :style="img_spacing + selected_style(item)" :data-value="item.img_link ? item.img_link.page : ''" @tap="url_event">
                            <image v-if="item.img.length > 0" :src="item.img[0].url" class="dis-block wh-auto" mode="widthFix" :style="content_img_radius"></image>
                        </view>
                    </template>
                    <template v-else>
                        <view v-for="(item, index) in form.img_magic_list" :key="index" class="cr-main" :style="img_spacing + selected_style(item) + ';height:' + form.image_height * 2 + 'rpx;'" :data-value="item.img_link ? item.img_link.page : ''" @tap="url_event">
                            <image v-if="item.img.length > 0" :src="item.img[0].url" class="dis-block wh-auto ht-auto" :mode="img_fit" :style="content_img_radius"></image>
                        </view>
                    </template>
                </template>
                <template v-else>
                    <view v-for="(item, index) in form.img_magic_list" :key="index" class="cube-selected cr-main" :style="img_spacing + selected_style(item)" :data-value="item.img_link ? item.img_link.page : ''" @tap="url_event">
                        <image v-if="item.img.length > 0" :src="item.img[0].url" class="dis-block wh-auto ht-auto" :mode="img_fit" :style="content_img_radius"></image>
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, radius_computer, percentage_count, isEmpty } from '@/common/js/common/common.js';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
        },
        data() {
            return {
                form: {},
                style_container: '',
                style_img_container: '',
                // 外部样式
                outer_style: '',
                // 图片间距设置
                img_spacing: '',
                // 图片圆角
                content_img_radius: '',
                cube_cell: '',
                container_size: '',
                div_width: 0,
                img_fit: '',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        computed: {
            // 根据当前页面大小计算成百分比
            selected_style() {
                return (item) => {
                    return `overflow: hidden;width: ${this.percentage(this.getSelectedWidth(item))}; height: ${this.percentage(this.getSelectedHeight(item))}; top: ${this.percentage(this.getSelectedTop(item))}; left: ${this.percentage(this.getSelectedLeft(item))};`;
                };
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                const new_style_spacing = new_content.style_actived === 10 ? 0 : new_style.image_spacing;
                // 外部样式
                const outer_spacing = `calc(100% + ${new_style_spacing * 2}rpx)`;
                const outer_sx = `-${new_style_spacing}rpx`;
                // 图片间距设置
                const spacing = `${new_style_spacing}rpx`;
                // scaleToFill 对应 cover aspectFit 对应 contain  center 对应 none
                let fit = '';
                if (new_content.img_fit == 'contain') {
                    fit = 'aspectFit';
                } else if (new_content.img_fit == 'fill') {
                    fit = 'scaleToFill';
                } else if (new_content.img_fit == 'cover') {
                    fit = 'aspectFill';
                }
                const container_height = !isEmpty(new_content.container_height) ? new_content.container_height : sys_width;
                const density = !isEmpty(new_content.magic_cube_density) ? new_content.magic_cube_density : 4;
                this.setData({
                    form: this.propValue.content,
                    new_style: this.propValue.style,
                    outer_style: `width:${outer_spacing};height:${outer_spacing};margin:${outer_sx};`,
                    img_spacing: `padding:${spacing};`,
                    content_img_radius: radius_computer(new_style),
                    style_container: common_styles_computer(new_style.common_style) + 'box-sizing: border-box;',
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex) + 'box-sizing: border-box;',
                    img_fit: fit,
                    div_width: sys_width,
                    container_size: container_height * 2 + 'rpx',
                    cube_cell: sys_width / density,
                });
            },
            getSelectedWidth(item) {
                return (item.end.x - item.start.x + 1) * this.cube_cell;
            },
            //计算选中层的高度。
            getSelectedHeight(item) {
                return (item.end.y - item.start.y + 1) * this.cube_cell;
            },
            //计算选中层的右边距离。
            getSelectedTop(item) {
                return (item.start.y - 1) * this.cube_cell;
            },
            //计算选中层的左边距离。
            getSelectedLeft(item) {
                return (item.start.x - 1) * this.cube_cell;
            },
            // 计算成百分比
            percentage(num) {
                return percentage_count(num, this.div_width);
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style lang="scss" scoped>
    // 图片魔方是一个正方形，根据宽度计算高度
    .img-magic {
        overflow: hidden;
        box-sizing: border-box;
    }
    .cube-selected {
        position: absolute;
        text-align: center;
        box-sizing: border-box;
    }
    .style-size {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        .three {
            width: 33%;
            height: 100%;
            position: relative;
            box-sizing: border-box;
        }
        .style9-top {
            width: 50%;
            height: 50%;
            position: relative;
            box-sizing: border-box;
        }
        .style9-bottom {
            width: calc(100% / 3);
            height: 50%;
            position: relative;
            box-sizing: border-box;
        }
    }
</style>
