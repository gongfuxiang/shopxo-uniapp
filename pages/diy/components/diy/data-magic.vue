<template>
    <view class="img-magic" :style="'height:' + container_size + ';' + style_container">
        <view class="magic-container w h pr" :style="style_img_container">
            <view class="pr" :style="'width:calc(100% + ' + outer_spacing + ');height:calc(100% + ' + outer_spacing + ');margin:-' + spacing + ';'">
                <!-- 风格9 -->
                <template v-if="form.style_actived == 7">
                    <view class="flex-row align-c jc-c style-size flex-wrap">
                        <view v-for="(item, index) in data_magic_list" :key="index" :style="'margin:' + spacing + ';' + ([0, 1].includes(index) ? 'width:calc(50% - ' + outer_spacing + ');height:calc(50% - ' + outer_spacing + ')' : 'width:calc((100% / 3) - ' + outer_spacing + ');height:calc(50% - ' + outer_spacing + ')')" class="style9">
                            <view class="w h flex-row" :style="item.data_style.background_style + content_radius">
                                <view class="re flex-1 oh" :style="item.data_style.background_img_style">
                                    <template v-if="item.data_content.data_type == 'goods'">
                                        <view class="w h flex-col" :style="'gap:'+ item.data_style.title_data_gap * 2 + 'rpx;'">
                                            <view v-if="(!isEmpty(item.data_content.heading_title) || !isEmpty(item.data_content.subtitle)) && [0, 1].includes(index)" :class="'tl' + (item.data_style.title_line == '1' ? ' flex-row align-c' : ' flex-col')" :style="'gap:' + item.data_style.title_gap * 2 + 'rpx;'">
                                                <template v-if="item.data_content.heading_title_type && item.data_content.heading_title_type == 'image'">
                                                    <view v-if="item.data_content.heading_title_img.length > 0" class="re oh" :style="'width:100%;height:' + (!isEmpty(item.data_style.heading_img_height) ? item.data_style.heading_img_height * magic_scale : 0) + 'px'">
                                                        <image :src="item.data_content.heading_title_img[0].url" class="ht-auto max-w" mode="heightFix" />
                                                    </view>
                                                </template>
                                                <template v-else>
                                                    <view class="ma-0 w text-word-break text-line-1 flex-basis-shrink" :style="item.data_style.heading_style">{{ item.data_content.heading_title || '' }}</view>
                                                </template>
                                                <template v-if="item.data_content.subtitle_title_type && item.data_content.subtitle_title_type == 'image'">
                                                    <view v-if="item.data_content.subtitle_title_img.length > 0" class="re oh" :style="'width:100%;height:' + (!isEmpty(item.data_style.subtitle_img_height) ? item.data_style.subtitle_img_height * magic_scale : 0) + 'px'">
                                                        <image :src="item.data_content.subtitle_title_img[0].url" class="ht-auto max-w" mode="heightFix" />
                                                    </view>
                                                </template>
                                                <template v-else>
                                                    <view class="ma-0 w text-word-break text-line-1 flex-basis-shrink" :style="item.data_style.subtitle_style">{{ item.data_content.subtitle || '' }}</view>
                                                </template>
                                            </view>
                                            <view class="w h flex-1 oh flex-row">
                                                <magic-carousel class="flex-1" :propKey="propKey + index" :propValue="item" :propGoodStyle="item.data_style" :propActived="form.style_actived" propType="product" :propDataIndex="index" @onCarouselChange="carousel_change"></magic-carousel>
                                            </view>
                                        </view>
                                    </template>
                                    <template v-else-if="item.data_content.data_type == 'images'">
                                        <view class="w h flex-1 oh flex-row">
                                            <magic-carousel class="flex-1" :propKey="propKey + index" :propValue="item" propType="img" :propActived="form.style_actived" :propDataIndex="index" @onCarouselChange="carousel_change"></magic-carousel>
                                        </view>
                                    </template>
                                    <template v-else-if="item.data_content.data_type == 'custom'">
                                        <customIndex :propKey="propKey + index" :propValue="item" :propMagicScale="magic_scale" :propDataSpacing="new_style.image_spacing" :propDataIndex="index" @onCarouselChange="carousel_change"></customIndex>
                                    </template>
                                    <template v-else>
                                        <videoIndex :propKey="propKey + index" :propValue="item.data_content" :propDataStyle="item.data_style"></videoIndex>
                                    </template>
                                    <view v-if="item.data_style.is_show == '1' && item.data_content.list.length > 1" :class="['left', 'right'].includes(item.data_style.indicator_new_location) ? 'indicator_up_down_location' : 'indicator_about_location'" :style="item.data_style.indicator_location_style">
                                        <template v-if="item.data_style.indicator_style == 'num'">
                                            <view :style="item.data_style.indicator_styles" class="dot-item">
                                                <text class="num-active" :style="{ color: item.data_style.actived_color }">{{ item.actived_index + 1 }}</text
                                                ><text>/{{ item.data_content.list.length }}</text>
                                            </view>
                                        </template>
                                        <template v-else>
                                            <view v-for="(item3, index3) in item.data_content.list" :key="index3" :style="item.data_style.indicator_styles + style_actived_color(item, index3)" class="dot-item" />
                                        </template>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else>
                    <view v-for="(item, index) in data_magic_list" :key="index" class="cr-main cube-selected" :style="selected_style(item) + ';margin:' + spacing + ';'">
                        <view class="w h flex-row" :style="item.data_style.background_style + content_radius">
                            <view class="re flex-1 oh" :style="item.data_style.background_img_style">
                                <template v-if="item.data_content.data_type == 'goods'">
                                    <view class="w h flex-col" :style="'gap:'+ item.data_style.title_data_gap * 2 + 'rpx;'">
                                        <view v-if="!isEmpty(item.data_content.heading_title) || !isEmpty(item.data_content.subtitle)" :class="'tl' + (item.data_style.title_line == '1' ? ' flex-row align-c' : ' flex-col')" :style="'gap:' + item.data_style.title_gap * 2 + 'rpx;'">
                                            <template v-if="item.data_content.heading_title_type && item.data_content.heading_title_type == 'image'">
                                                <view v-if="item.data_content.heading_title_img.length > 0" class="re oh" :style="'width:100%;height:' + (!isEmpty(item.data_style.heading_img_height) ? item.data_style.heading_img_height * magic_scale : 0) + 'px'">
                                                    <image :src="item.data_content.heading_title_img[0].url" class="ht-auto max-w" mode="heightFix" />
                                                </view>
                                            </template>
                                            <template v-else>
                                                <view class="ma-0 w text-word-break text-line-1 flex-basis-shrink" :style="item.data_style.heading_style">{{ item.data_content.heading_title || '' }}</view>
                                            </template>
                                            <template v-if="item.data_content.subtitle_title_type && item.data_content.subtitle_title_type == 'image'">
                                                <view v-if="item.data_content.subtitle_title_img.length > 0" class="re oh" :style="'width:100%;height:' + (!isEmpty(item.data_style.subtitle_img_height) ? item.data_style.subtitle_img_height * magic_scale : 0) + 'px'">
                                                    <image :src="item.data_content.subtitle_title_img[0].url" class="ht-auto max-w" mode="heightFix" />
                                                </view>
                                            </template>
                                            <template v-else>
                                                <view class="ma-0 w text-word-break text-line-1 flex-basis-shrink" :style="item.data_style.subtitle_style">{{ item.data_content.subtitle || '' }}</view>
                                            </template>
                                        </view>
                                        <view class="w h oh flex-row">
                                            <magic-carousel class="flex-1" :propKey="propKey + index" :propValue="item" :propGoodStyle="item.data_style" propType="product" :propActived="form.style_actived" :propDataIndex="index"  @onCarouselChange="carousel_change"></magic-carousel>
                                        </view>
                                    </view>
                                </template>
                                <template v-else-if="item.data_content.data_type == 'images'">
                                    <view class="w h oh flex-row">
                                        <magic-carousel class="flex-1" :propKey="propKey + index" :propValue="item" propType="img" :propActived="form.style_actived" :propDataIndex="index"  @onCarouselChange="carousel_change"></magic-carousel>
                                    </view>
                                </template>
                                <template v-else-if="item.data_content.data_type == 'custom'">
                                    <customIndex :propKey="propKey + index" :propValue="item" :propMagicScale="magic_scale" :propDataSpacing="new_style.image_spacing" :propDataIndex="index" @onCarouselChange="carousel_change"></customIndex>
                                </template>
                                <template v-else>
                                    <videoIndex :propKey="propKey + index" :propValue="item.data_content" :propDataStyle="item.data_style"></videoIndex>
                                </template>
                                <view v-if="item.data_style.is_show == '1' && item.data_content.list.length > 1" :class="['left', 'right'].includes(item.data_style.indicator_new_location) ? 'indicator_up_down_location' : 'indicator_about_location'" :style="item.data_style.indicator_location_style">
                                    <template v-if="item.data_style.indicator_style == 'num'">
                                        <view :style="item.data_style.indicator_styles" class="dot-item">
                                            <text class="num-active" :style="{ color: item.data_style.actived_color }">{{ item.actived_index + 1 }}</text>
                                            <text>/{{ item.data_content.list.length }}</text>
                                        </view>
                                    </template>
                                    <template v-else>
                                        <view v-for="(item3, index3) in item.data_content.list" :key="index3" :style="item.data_style.indicator_styles + style_actived_color(item, index3)" class="dot-item" />
                                    </template>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import magicCarousel from '@/pages/diy/components/diy/modules/data-magic/magic-carousel.vue';
    import customIndex from '@/pages/diy/components/diy/modules/data-magic/custom/index.vue';
    import videoIndex from '@/pages/diy/components/diy/modules/data-magic/video/index.vue';
    import { background_computer, common_styles_computer, common_img_computer, gradient_computer, radius_computer, percentage_count, isEmpty, padding_computer, margin_computer, old_border_and_box_shadow, old_margin, old_padding, box_shadow_computer, border_computer, get_indicator_location_style, get_indicator_style, border_width } from '@/common/js/common/common.js';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            magicCarousel,
            customIndex,
            videoIndex
        },
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
            propOuterContainerPadding: {
                type: Number,
                default: 0,
            }
        },
        data() {
            return {
                form: {},
                new_style: {},
                outer_spacing: '',
                // 图片间距设置
                spacing: '',
                // 内容圆角设置
                content_radius: '',
                // 图片圆角设置
                // content_img_radius: '',
                data_magic_list: [],
                cubeCellWidth: 0,
                container_size: 0,
                style_container: '',
                style_img_container: '',
                div_width: 0,
                magic_scale: 1,
                // is_unlimited_size: false,
            };
        },
        computed: {
            // 根据当前页面大小计算成百分比
            selected_style() {
                return (item) => {
                    return `overflow: hidden;width: calc(${this.percentage(this.getSelectedWidth(item))} - ${this.outer_spacing} ); height: calc(${this.percentage(this.getSelectedHeight(item))} - ${this.outer_spacing} ); top: ${this.percentage(this.getSelectedTop(item))}; left: ${this.percentage(this.getSelectedLeft(item))};`;
                };
            },
            style_actived_color() {
                return (item, index) => {
                    return item.actived_index == index ? `background: ${item.data_style.actived_color};` : '';
                };
            },
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
                const new_form = this.propValue.content;
                const new_style = this.propValue.style;
                const container_height = !isEmpty(new_form.container_height) ? new_form.container_height : sys_width;
                const density = !isEmpty(new_form.magic_cube_density) ? new_form.magic_cube_density : 4;
                const { margin_left, margin_right } = new_style.common_style;
                const width = sys_width - margin_left - margin_right - border_width(new_style.common_style) - this.propOuterContainerPadding;
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    outer_spacing: new_style.image_spacing * 2 + 'rpx',
                    spacing: new_style.image_spacing + 'rpx',
                    content_radius: radius_computer(new_style.data_radius),
                    // content_img_radius: radius_computer(new_style.img_radius),
                    data_magic_list: this.get_data_magic_list(new_form.data_magic_list, new_style),
                    style_container: common_styles_computer(new_style.common_style) + 'box-sizing: border-box;', // 用于样式显示
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    magic_scale: width / 390,
                    div_width: sys_width,
                    cubeCellWidth: sys_width / density,
                    container_size: container_height * (width / 390) + 'px',
                });
            },
            get_data_magic_list(data, new_style) {
                data.forEach((item) => {
                    const data_content = item.data_content;
                    const data_style = item.data_style;
                    item.actived_index = 0;
                    // 指示器样式
                    data_style.indicator_styles = get_indicator_style(data_style);
                    data_style.indicator_location_style = get_indicator_location_style(data_style);
                    // 获取当前的margin
                    const chunk_margin = data_style?.chunk_margin || old_margin;
                    // 计算左右间距
                    const left_right_width_margin = (chunk_margin?.margin_left || 0) + (chunk_margin?.margin_right || 0);
                    // 计算上下间距
                    const top_bottom_height_margin = (chunk_margin?.margin_top || 0) + (chunk_margin?.margin_bottom || 0);
                    data_style.background_style = gradient_computer(data_style) + margin_computer(data_style?.chunk_margin || old_margin) + `width: calc(100% - ${ left_right_width_margin }px);height:calc(100% - ${ top_bottom_height_margin }px);` + box_shadow_computer(data_style?.data_common_style || old_border_and_box_shadow) + border_computer(data_style?.data_common_style || old_border_and_box_shadow);
                    data_style.background_img_style = background_computer(data_style) + padding_computer(data_style?.chunk_padding || old_padding);
                    // 商品价格处理
                    data_style.goods_price_symbol_style = this.goods_trends_config(data_style, 'price_symbol');
                    data_style.goods_price_unit_style = this.goods_trends_config(data_style, 'price_unit');

                    let fit = '';
                    if (data_content.img_fit == 'contain') {
                        fit = 'aspectFit';
                    } else if (data_content.img_fit =='fill') {
                        fit = 'scaleToFill';
                    } else if (data_content.img_fit == 'cover') {
                        fit = 'aspectFill';
                    } 
                    data_content.fit = fit;
                    // 商品名称和价格样式
                    data_style.goods_title_style = this.goods_trends_config(data_style, 'title') + `line-height: ${ (item.data_style.goods_title_size + 3) * 2 }rpx;height: ${ (item.data_style.goods_title_size + 3) * 2 }rpx;`;
                    data_style.goods_price_style = this.goods_trends_config(data_style, 'price') + `line-height: ${ item.data_style.goods_price_size * 2 }rpx;height: ${ (item.data_style.goods_title_size + 3) * 2 }rpx;`;
                    const radius = !isEmpty(data_style.img_radius) ? data_style.img_radius : { radius: 4, radius_top_left: 4, radius_top_right: 4, radius_bottom_left: 4, radius_bottom_right: 4 };
                    data_style.get_img_radius = radius_computer(radius);

                    data_style.chunk_padding_data = padding_computer(data_style.chunk_padding) + 'box-sizing: border-box;';
                    data_style.heading_style = this.trends_config(data_style, 'heading');
                    data_style.subtitle_style = this.trends_config(data_style, 'subtitle');

                    if (data_content.data_type == 'goods') {
                        data_content.list = this.commodity_list(data_content.goods_list, data_content.goods_num, data_content, data_style);
                    } else if (data_content.data_type == 'custom' && ['vertical-scroll', 'horizontal'].includes(data_content.data_source_direction)) {
                        // 是自定义并且是轮播状态的时候，添加数据
                        const list = this.data_source_content_list(data_content);
                        const carousel_col = data_content?.data_source_carousel_col || 1;
                        const num = new_style.rolling_fashion == 'translation' ? list.length : Math.ceil(list.length / carousel_col);
                        data_content.list = Array(num);
                    } else {
                        data_content.list = data_content.images_list;
                    }
                });
                return data;
            },
            // 数据来源的内容
            data_source_content_list(data_content){
                if (data_content.is_custom_data == '1') {
                    if (Number(data_content.data_source_content.data_type) === 0) {
                        return data_content.data_source_content.data_list;
                    } else {
                        return data_content.data_source_content.data_auto_list.map((item) => ({
                            id: Math.random(),
                            new_cover: [],
                            new_title: '',
                            data: item,
                        }));
                    }
                } else {
                    return data_content.data_source_content.data_list;
                }
            },
            /*
             ** 组装产品的数据
             ** @param {Array} list 商品列表
             ** @param {Number} num 显示数量
             ** @return {Array}
             */
            commodity_list(list, num, data_content, data_style) {
                if (list.length > 0) {
                    // 深拷贝一下，确保不会出现问题
                    const goods_list = JSON.parse(JSON.stringify(list)).map((item) => ({
                        ...item.data,
                        title: !isEmpty(item.new_title) ? item.new_title : item.data.title,
                        new_cover: item.new_cover,
                    }));
                    // 存储数据显示
                    let nav_list = [];
                    // 如果是滑动，需要根据每行显示的个数来区分来拆分数据  translation 表示的是平移
                    if (data_style.rolling_fashion != 'translation') {
                        // 拆分的数量
                        const split_num = Math.ceil(goods_list.length / num);
                        for (let i = 0; i < split_num; i++) {
                            nav_list.push({ split_list: goods_list.slice(i * num, (i + 1) * num) });
                        }
                        return nav_list;
                    } else {
                        return this.rotation_calculation(goods_list, num, data_content, data_style);
                    }
                } else {
                    return [];
                }
            },
            rotation_calculation(list, num, data_content, data_style)  {
                // 存储数据显示
                let nav_list = [];
                const goods_outerflex = data_content.goods_outerflex;
                const rotation_direction = data_style.rotation_direction;
                // 如果是商品是横排的，轮播也是横排的，就不对商品进行拆分/如果商品是竖排的，轮播也是竖排的，不对商品进行拆分
                if ((goods_outerflex == 'row' && rotation_direction == 'horizontal') || (goods_outerflex == 'col' && rotation_direction == 'vertical')) {
                    list.forEach((item) => {
                        nav_list.push({
                            split_list: [item],
                        });
                    });
                } else {
                    // 拆分的数量
                    const split_num = Math.ceil(list.length / num);
                    for (let i = 0; i < split_num; i++) {
                        nav_list.push({ split_list: list.slice(i * num, (i + 1) * num) });
                    }
                    return nav_list;
                }
                return nav_list;
            },
            getSelectedWidth(item) {
                return (item.end.x - item.start.x + 1) * this.cubeCellWidth;
            },
            //计算选中层的高度。
            getSelectedHeight(item) {
                return (item.end.y - item.start.y + 1) * this.cubeCellWidth;
            },
            //计算选中层的右边距离。
            getSelectedTop(item) {
                return (item.start.y - 1) * this.cubeCellWidth;
            },
            //计算选中层的左边距离。
            getSelectedLeft(item) {
                return (item.start.x - 1) * this.cubeCellWidth;
            },
            // 计算成百分比
            percentage(num) {
                return percentage_count(num, this.div_width);
            },
            goods_trends_config(style, key) {
                return this.text_style(style[`goods_${key}_typeface`], style[`goods_${key}_size`], style[`goods_${key}_color`]);
            },
            // 根据传递的参数，从对象中取值
            trends_config(style, key) {
                return this.text_style(style[`${key}_typeface`], style[`${key}_size`], style[`${key}_color`]);
            },
            text_style(typeface, size, color) {
                return `font-weight:${typeface}; font-size: ${size * 2}rpx; color: ${color};`;
            },
            carousel_change(actived_index, index) {
                if (this.data_magic_list[index]) {
                    this.data_magic_list[index].actived_index = actived_index;
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    // 图片魔方是一个正方形，根据宽度计算高度
    .img-magic {
        overflow: hidden;
    }
    .cube-selected {
        position: absolute;
        text-align: center;
        box-sizing: border-box;
    }
    .text-line-1 {
        word-break: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
    .style-size {
        height: 100%;
        width: 100%;
        .style9 {
            position: relative;
            overflow: hidden;
        }
    }
    .dot-center {
        left: 50%;
        transform: translateX(-50%);
    }
    .dot-right {
        right: 0;
    }
    .dot {
        z-index: 3;
        .dot-item {
            margin: 0 6rpx;
        }
    }
    .gap-20 {
        gap: 40rpx;
    }
    .w {
        width: 100%;
    }
    .h {
        height: 100%;
    }
    .flex-basis-shrink {
        flex-basis: content;
        flex-shrink: 1;
    }
</style>
