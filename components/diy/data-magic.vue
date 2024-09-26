<template>
    <view ref="container" class="img-magic" :style="'height:' + container_size + ';' + style_container">
        <view class="pr" :style="'width:calc(100% + ' + outer_spacing + ');height:calc(100% + ' +  outer_spacing +');margin:-' + spacing + ';'">
            <!-- 风格9 -->
            <template v-if="form.style_actived == 7">
                <view class="flex-row align-c jc-c style-size flex-wrap">
                    <view v-for="(item, index) in data_magic_list" :key="index" :style="item.data_style.background_style + content_radius + 'margin:'+ spacing + ';' + ([0, 1].includes(index) ? 'width:calc(50% - ' + outer_spacing + ');height:calc(50% - ' +  outer_spacing +')' : 'width:calc((100% / 3) - ' + outer_spacing + ');height:calc(50% - ' + outer_spacing + ')')" class="style9">
                        <template v-if="item.data_content.data_type == 'goods'">
                            <view class="wh-auto ht-auto flex-col gap-20" :style="[0, 1].includes(index) ? item.data_style.chunk_padding_data : ''">
                                <view v-if="(!isEmpty(item.data_content.heading_title) || !isEmpty(item.data_content.subtitle)) && [0, 1].includes(index)" class="flex-col gap-5 tl">
                                    <view class="ma-0 wh-auto text-line-1" :style="item.data_style.daheading_style">{{ item.data_content.heading_title || '' }}</view>
                                    <view class="ma-0 wh-auto text-line-1" :style="item.data_style.subtitle_style">{{ item.data_content.subtitle || '' }}</view>
                                </view>
                                <view class="wh-auto ht-auto">
                                    <magic-carousel :propValue="item" :contentImgRadius="content_img_radius" :actived="form.style_actived" type="product" @carousel_change="carousel_change($event, index)"></magic-carousel>
                                </view>
                            </view>
                        </template>
                        <template v-else>
                            <magic-carousel :propValue="item" :contentImgRadius="content_img_radius" type="img" :actived="form.style_actived" @carousel_change="carousel_change($event, index)"></magic-carousel>
                        </template>
                        <view v-if="item.data_style.is_show == '1' && item.data_content.list.length > 1" :class="{'dot-center': item.data_style.indicator_location == 'center', 'dot-right': item.data_style.indicator_location == 'flex-end' }" class="dot flex-row pa" :style="{'bottom': item.data_style.indicator_bottom * 2 +'rpx'}">
                            <template v-if="item.data_style.indicator_style == 'num'">
                                <view :style="item.data_style.indicator_styles" class="dot-item">
                                    <text class="num-active" :style="{'color': item.data_style.actived_color }">{{ item.actived_index + 1 }}</text><text>/{{ item.data_content.list.length }}</text>
                                </view>
                            </template>
                            <template v-else>
                                <view v-for="(item3, index3) in item.data_content.list" :key="index3" :style="item.data_style.indicator_styles + style_actived_color(item, index3)" class="dot-item" />
                            </template>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else>
                <view v-for="(item, index) in data_magic_list" :key="index" class="cube-selected cr-main" :style="selected_style(item) + item.data_style.background_style + content_radius + ';margin:'+ spacing + ';'">
                    <template v-if="item.data_content.data_type == 'goods'">
                        <view :class="[spacing_processing(index) ? 'gap-20 wh-auto ht-auto flex-col' : 'gap-10 wh-auto ht-auto flex-col']" :style="item.data_style.chunk_padding_data">
                            <view v-if="!isEmpty(item.data_content.heading_title) || !isEmpty(item.data_content.subtitle)" class="flex-col gap-5 tl">
                                <view class="ma-0 wh-auto text-line-1" :style="item.data_style.heading_style">{{ item.data_content.heading_title || '' }}</view>
                                <view class="ma-0 wh-auto text-line-1" :style="item.data_style.subtitle_style">{{ item.data_content.subtitle || '' }}</view>
                            </view>
                            <view class="wh-auto ht-auto">
                                <magic-carousel :propValue="item" :contentImgRadius="content_img_radius" type="product" :actived="form.style_actived" @carousel_change="carousel_change($event, index)"></magic-carousel>
                            </view>
                        </view>
                    </template>
                    <template v-else>
                        <magic-carousel :propValue="item" :contentImgRadius="content_img_radius" type="img" :actived="form.style_actived" @carousel_change="carousel_change($event, index)"></magic-carousel>
                    </template>
                    <view v-if="item.data_style.is_show == '1' && item.data_content.list.length > 1" :class="{'dot-center': item.data_style.indicator_location == 'center', 'dot-right': item.data_style.indicator_location == 'flex-end' }" class="dot flex-row pa" :style="{'bottom': item.data_style.indicator_bottom * 2 +'rpx'}">
                        <template v-if="item.data_style.indicator_style == 'num'">
                            <view :style="item.data_style.indicator_styles" class="dot-item">
                                <text class="num-active" :style="{'color': item.data_style.actived_color }">{{ item.actived_index + 1 }}</text><text>/{{ item.data_content.list.length }}</text>
                            </view>
                        </template>
                        <template v-else>
                            <view v-for="(item3, index3) in item.data_content.list" :key="index3" :style="item.data_style.indicator_styles + style_actived_color(item, index3)" class="dot-item" />
                        </template>
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import magicCarousel from '@/components/diy/modules/data-magic/magic-carousel.vue';
    import { background_computer, common_styles_computer, gradient_computer, radius_computer, percentage_count, isEmpty, padding_computer } from '@/common/js/common/common.js';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            magicCarousel,
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                // 设置默认值
                default_list: {
                    title: '测试商品标题',
                    min_original_price: '41.2',
                    show_original_price_symbol: '￥',
                    show_original_price_unit: '/ 台',
                    min_price: '51',
                    show_price_symbol: '￥',
                    show_price_unit: '/ 台',
                    sales_count: '1000',
                    images: '',
                    new_cover: [],
                    plugins_view_icon_data: [
                        {
                            name: '满减活动',
                            bg_color: '#EA3323',
                            br_color: '',
                            color: '#fff',
                            url: '',
                        },
                        {
                            name: '包邮',
                            bg_color: '',
                            br_color: '#EA3323',
                            color: '#EA3323',
                            url: '',
                        },
                        {
                            name: '领劵',
                            bg_color: '',
                            br_color: '#EA9223',
                            color: '#EA9223',
                            url: '',
                        },
                    ],
                },
                outer_spacing: '',
                // 图片间距设置
                spacing: '',
                // 内容圆角设置
                content_radius: '',
                // 图片圆角设置
                content_img_radius: '',
                data_magic_list: [],
                cubeCellWidth: 0,
                container_size: 0,
                style_container: '',
            };
        },
        computed: {
            // 根据当前页面大小计算成百分比
            selected_style() {
                return (item) => {
                    return `overflow: hidden;width: calc(${this.percentage(this.getSelectedWidth(item))} - ${ this.outer_spacing } ); height: calc(${this.percentage(this.getSelectedHeight(item))} - ${ this.outer_spacing } ); top: ${this.percentage(this.getSelectedTop(item))}; left: ${this.percentage(this.getSelectedLeft(item))};`;
                }
            },
            style_actived_color() {
                return (item, index) => {
                   return item.actived_index == index ? `background: ${ item.data_style.actived_color };` : '';
                }
            }
        },
        created() {
            this.setData({
                form: this.propValue.content,
                new_style: this.propValue.style,
            });
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                const density = 4;
                this.setData({
                    outer_spacing: this.new_style.image_spacing * 2 + 'rpx',
                    spacing: this.new_style.image_spacing + 'rpx',
                    content_radius: radius_computer(this.new_style.data_radius),
                    content_img_radius: radius_computer(this.new_style.img_radius),
                    cubeCellWidth: sys_width / density,
                    container_size: sys_width * 2 + 'rpx',
                    data_magic_list: this.get_data_magic_list(this.form.data_magic_list),
                    style_container: common_styles_computer(this.new_style.common_style) + 'box-sizing: border-box;', // 用于样式显示
                })
            },
            get_data_magic_list(data) {
              data.forEach((item) => {
                  const data_content = item.data_content;
                  const data_style = item.data_style;
                  const key = data_style.carouselKey;
                  item.actived_index = 0;
                  // 指示器样式
                  data_style.indicator_styles = this.indicator_style(data_style);
                  data_style.background_style = this.background_style(data_style);
                  data_style.chunk_padding_data = padding_computer(item.data_style.chunk_padding) + 'box-sizing: border-box;';
                  data_style.heading_style = this.trends_config(item.data_style, 'heading');
                  data_style.subtitle_style = this.trends_config(item.data_style, 'subtitle');
                  
                  const { goods_list, images_list } = data_content;
                  if (data_content.data_type == 'goods') {
                      data_content.list = this.commodity_list(data_content.goods_list, item.num);
                  } else {
                      data_content.list = data_content.images_list;
                  }
              });
              return data;
            },
            /*
            ** 组装产品的数据
            ** @param {Array} list 商品列表
            ** @param {Number} num 显示数量
            ** @return {Array}
            */
            commodity_list(list, num) {
                if (list.length > 0) {
                    // 深拷贝一下，确保不会出现问题
                    const goods_list = JSON.parse(JSON.stringify(list)).map((item) => ({
                        ...item.data,
                        title: !isEmpty(item.new_title) ? item.new_title : item.data.title,
                        new_cover: item.new_cover,
                    }));
                    // 存储数据显示
                    let nav_list = [];
                    // 拆分的数量
                    const split_num = Math.ceil(goods_list.length / num);
                    for (let i = 0; i < split_num; i++) {
                        nav_list.push({ split_list: goods_list.slice(i * num, (i + 1) * num) });
                    }
                    return nav_list;
                } else {
                    return [{ split_list: Array(num).fill(this.default_list)}];
                }
            },
            background_style(item) {
                return gradient_computer(item) + background_computer(item);
            },
            getSelectedWidth (item) {
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
                return percentage_count(num, sys_width);
            },
            // 根据传递的参数，从对象中取值
            trends_config(style, key) {
                return this.text_style(style[`${key}_typeface`], style[`${key}_size`], style[`${key}_color`]);
            },
            text_style(typeface, size, color) {
                return `font-weight:${ typeface }; font-size: ${ size * 2 }rpx; color: ${ color };`;
            },
            // 不属于第9个，并且第9个的第一个和第二个
            spacing_processing(index) {
                return this.form.style_actived !== 8 || (this.form.style_actived === 8 && [0, 1].includes(index))
            },
            // 指示器的样式
            indicator_style(item) {
                let styles = '';
                if (!isEmpty(item.indicator_radius)) {
                    styles += radius_computer(item.indicator_radius)
                }
                const size = item.indicator_size || 5;
                if (item.indicator_style == 'num') {
                    styles += `color: ${item.color || '#DDDDDD'};`;
                    styles += `font-size: ${size * 2}rpx;`;
                } else if (item.indicator_style == 'elliptic') {
                    styles += `background: ${item.color || '#DDDDDD'};`;
                    styles += `width: ${size * 6 }rpx; height: ${size * 2}rpx;`;
                } else {
                    styles += `background: ${item.color || '#DDDDDD'};`;
                    styles += `width: ${size * 2}rpx; height: ${size * 2 }rpx;`;
                }
                return styles;
            },
            carousel_change(e, key) {
                if (this.data_magic_list[key]) {
                    this.data_magic_list[key].actived_index = e.target.current;
                }
            }
        },
    };
</script>

<style lang="scss" scoped>
// 图片魔方是一个正方形，根据宽度计算高度
.img-magic {
    width: 100%;
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
        margin: 0 0.3rem;
    }
}
.gap-20 {
    gap: 40rpx;
}
</style>
