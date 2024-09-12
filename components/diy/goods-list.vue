<template>
    <view class="oh" :style="style_container">
        <view :class="outer_class" :style="onter_style">
            <block v-if="!['5'].includes(theme)">
                <view v-for="(item, index) in list" :key="index" class="re" :class="layout_type" :style="layout_style">
                    <block v-if="theme == '6'">
                        <view :class="['flex-row align-c jc-sb ptb-15 mlr-10 gap-20', { 'br-b-e': index != list.length - 1 }]">
                            <view v-if="is_show('title')" :class="text_line" :style="trends_config('title')">{{ item.title }}</view>
                            <view v-if="is_show('price')" class="num nowrap" :style="{'color': new_style.shop_price_color }">
                                <span class="identifying">{{ item.show_price_symbol }}</span><span :style="trends_config('price')">{{ item.min_price }}</span>
                                <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <block v-if="!is_obj_empty(item)">
                            <block v-if="!is_obj_empty(item.new_cover)">
                                <image-empty v-model="item.new_cover[0]" :class="'flex-img' + theme" :style="content_img_radius"></image-empty>
                            </block>
                            <block v-else>
                                <image-empty v-model="item.images" :class="'flex-img' + theme" :style="content_img_radius"></image-empty>
                            </block>
                        </block>
                        <view class="flex-col flex-1 jc-sb content gap-10" :style="content_style">
                            <view class="flex-col gap-10 top-title">
                                <view v-if="is_show('title')" :class="text_line" :style="trends_config('title')">{{ item.title }}</view>
                                <view v-if="show_content && is_show('plugins_view_icon') && !is_obj_empty(item.plugins_view_icon_data)" class="flex-row gap-5 align-c">
                                    <view v-for="(icon_data, icon_index) in item.plugins_view_icon_data" :key="icon_index" class="radius-sm size-9 pl-3 pr-3" :style="icon_style(icon_data)">{{ icon_data.name }}</view>
                                </view>
                            </view>
                            <view v-if="!['3', '4', '5'].includes(form.theme)" class="flex-col gap-5 oh">
                                <view :class="[form.is_price_solo == '1' ? 'flex-row align-c nowrap' : 'flex-col gap-5']">
                                    <view v-if="is_show('price')" class="num" :style="{'color': new_style.shop_price_color }">
                                        <span class="identifying">{{ item.show_price_symbol }}</span><span :style="trends_config('price')">{{ item.min_price }}</span>
                                        <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                    </view>
                                    <view v-if="show_content && is_show('original_price')" class="size-10 flex-row">
                                        <span class="original-price-left"></span><span :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]">{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                            <block v-if="is_show('original_price_unit')">
                                                {{ item.show_original_price_unit }}
                                            </block>
                                        </span>
                                    </view>
                                </view>
                                <view class="flex-row jc-sb align-e">
                                    <view>
                                        <view v-if="show_content" class="flex-row align-c size-10">
                                            <view v-if="is_show('sales_count')" class="pr-5" :style="trends_config('sold_number')">已售{{ item.sales_count }}件</view>
                                            <!-- <view v-if="is_show('sales_count')" :class="['pr-5', {'br-r-e': is_show('sales_count') && is_show('4')}]" :style="trends_config('sold_number')">已售{{ item.sales_count }}件</view> -->
                                            <!-- <view v-if="is_show('4')" class="pl-5" :style="trends_config('score')">评分0</view> -->
                                        </view>
                                    </view>
                                    <view v-if="form.is_shop_show == '1'">
                                        <block v-if="form.shop_type == 'text'">
                                            <view class="plr-11 ptb-3 round cr-f" :style="trends_config('button', 'gradient') + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                        </block>
                                        <block v-else>
                                            <icon class="round plr-6 ptb-5" :name="!is_obj_empty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                        </block>
                                    </view>
                                </view>
                            </view>
                            <view v-else class="flex-row align-c jc-sb">
                                <view class="flex-row align-c nowrap">
                                    <view v-if="is_show('price')" class="num" :style="{'color': new_style.shop_price_color }">
                                        <span class="identifying">{{ item.show_price_symbol }}</span><span :style="trends_config('price')">{{ item.min_price }}</span>
                                        <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                    </view>
                                    <view v-if="show_content && is_show('original_price')" class="size-10 flex-row">
                                        <span class="original-price-left"></span><span :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]">{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                            <block v-if="is_show('original_price_unit')">
                                                {{ item.show_original_price_unit }}
                                            </block>
                                        </span>
                                    </view>
                                </view>
                                <view v-if="form.is_shop_show == '1'">
                                    <block v-if="form.shop_type == 'text'">
                                        <view class="plr-11 ptb-3 round cr-f" :style="trends_config('button', 'gradient') + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                    </block>
                                    <block v-else>
                                        <icon class="round plr-6 ptb-5" :name="!is_obj_empty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                    </block>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
            </block>
            <block v-else>
                <el-carousel :key="carouselKey" indicator-position="none" :interval="interval_time" arrow="never" :autoplay="is_roll">
                    <el-carousel-item v-for="(item1, index1) in shop_content_list" :key="index1" class="flex-row" :style="onter_style">
                        <view v-for="(item, index) in item1.split_list" :key="index" class="re" :class="layout_type" :style="layout_style">
                            <block v-if="!is_obj_empty(item)">
                                <block v-if="!is_obj_empty(item.new_cover)">
                                    <image-empty v-model="item.new_cover[0]" :class="'flex-img' + theme" :style="content_img_radius"></image-empty>
                                </block>
                                <block v-else>
                                    <image-empty v-model="item.images" :class="'flex-img' + theme" :style="content_img_radius"></image-empty>
                                </block>
                            </block>
                            <view class="flex-col flex-1 jc-sb content gap-10" :style="content_style">
                                <view class="flex-col gap-10 top-title">
                                    <view v-if="is_show('title')" :class="text_line" :style="trends_config('title')">{{ item.title }}</view>
                                    <view v-if="show_content && is_show('plugins_view_icon') && !is_obj_empty(item.plugins_view_icon_data)" class="flex-row gap-5 align-c">
                                        <view v-for="(icon_data, icon_index) in item.plugins_view_icon_data" :key="icon_index" class="radius-sm size-9 pl-3 pr-3" :style="icon_style(icon_data)">{{ icon_data.name }}</view>
                                    </view>
                                </view>
                                <view class="flex-row align-c jc-sb">
                                    <view class="flex-row align-c nowrap">
                                        <view v-if="is_show('price')" class="num" :style="{'color': new_style.shop_price_color }">
                                            <span class="identifying">{{ item.show_price_symbol }}</span><span :style="trends_config('price')">{{ item.min_price }}</span>
                                            <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                        </view>
                                        <view v-if="show_content && is_show('original_price')" class="size-10 flex">
                                            <span class="original-price-left"></span><span :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]">{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                <block v-if="is_show('original_price_unit')">
                                                    {{ item.show_original_price_unit }}
                                                </block>
                                            </span>
                                        </view>
                                    </view>
                                    <view v-if="form.is_shop_show == '1'">
                                        <block v-if="form.shop_type == 'text'">
                                            <view class="plr-11 ptb-3 round cr-f" :style="trends_config('button', 'gradient') + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                        </block>
                                        <block v-else>
                                            <icon class="round plr-6 ptb-5" :name="!is_obj_empty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                        </block>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </el-carousel-item>
                </el-carousel>
            </block>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import {
        is_obj_empty,
        common_styles_computer,
        get_math,
        gradient_handle,
        padding_computer,
        radius_computer
    } from '../../common/js/common/common';
    export default {
        props: {
            value: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            isCommonStyle: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
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
                    plugins_view_icon_data: [{
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
                list: [],
                content_radius: '', // 圆角设置
                content_img_radius: '', // 图片圆角设置
                content_padding: '', // 内边距设置
                theme: '', // 选择的风格
                content_outer_spacing: '', // 商品间距
                two_columns: '', // 两列风格
                three_columns: '', // 三列风格
                // 最外层不同风格下的显示
                outer_class: '',
                onter_style: '',
                // 不同风格下的样式
                layout_type: '',
                layout_style: '',
                content_style: '', // 内容区域的样式
                show_content: false, // 显示除标题外的其他区域
                text_line: '', // 超过多少行隐藏
                style_container: '', // 公共样式
                multicolumn_columns_width: '',
                multicolumn_columns_height: '',
            };
        },
        created() {
            this.setData({
                form: this.value.content,
                new_style: this.value.style
            });
            this.init();
        },
        methods: {
            is_obj_empty,
            init() {
                let new_list = [];
                // 指定商品并且指定商品数组不为空
                if (!is_obj_empty(this.form.data_list) && this.form.data_type == '0') {
                    new_list = this.form.data_list;
                } else if (!is_obj_empty(this.form.data_auto_list) && this.form.data_type == '1') {
                    // 筛选商品并且筛选商品数组不为空
                    new_list = this.form.data_auto_list;
                } else { // 为空的时候走默认数据
                    new_list = Array(4).fill(this.default_list);
                }
                // 最外层不同风格下的显示
                this.set_outer_class();
                this.setData({
                    list: new_list,
                    content_radius: radius_computer(this.new_style.shop_radius), // 圆角设置
                    content_img_radius: radius_computer(this.new_style.shop_img_radius), // 图片圆角设置
                    content_padding: padding_computer(this.new_style.shop_padding), // 内边距设置
                    theme: this.form.theme, // 选择的风格
                    content_outer_spacing: this.new_style.content_outer_spacing, // 商品间距
                    two_columns: this.new_style.content_outer_spacing + 'px', // 两列风格
                    three_columns: this.new_style.content_outer_spacing * 2 + 'px', // 三列风格
                    onter_style: this.form.theme == '6' ? radius_computer(this.new_style.shop_radius) : `gap: ${this.new_style.content_outer_spacing + 'px'};`,
                    // 不同风格下的样式
                    layout_type: this.get_layout_type(),
                    layout_style: this.get_layout_style(),
                    content_style: this.get_content_style(), // 内容区域的样式
                    show_content: ['0', '1', '2'].includes(this.form.theme), // 显示除标题外的其他区域
                    text_line: this.get_text_line(), // 超过多少行隐藏
                    style_container: this.isCommonStyle ? common_styles_computer(this.new_style.common_style) : '', // 公共样式
                    multicolumn_columns_width: this.get_multicolumn_columns_width(),
                    multicolumn_columns_height: this.new_style.content_outer_height + 'px',
                })
            },
            get_multicolumn_columns_width() {
                const {
                    carousel_col
                } = this.form;
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (this.new_style.content_outer_spacing * (carousel_col - 1)) / carousel_col;
                return `calc(${100 / carousel_col}% - ${gap}px)`;
            },
            get_shop_content_list() {
                // 深拷贝一下，确保不会出现问题
                const cloneList = JSON.parse(JSON.stringify(this.list));
                // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
                if (cloneList.length > 0) {
                    // 每页显示的数量
                    const num = this.form.carousel_col;
                    // 存储数据显示
                    let nav_list: nav_list[] = [];
                    // 拆分的数量
                    const split_num = Math.ceil(cloneList.length / num);
                    for (let i = 0; i < split_num; i++) {
                        nav_list.push({
                            split_list: cloneList.slice(i * num, (i + 1) * num)
                        });
                    }
                    return nav_list;
                } else {
                    // 否则的话，就返回全部的信息
                    return [{
                        split_list: cloneList
                    }];
                }
            },
            get_text_line() {
                let line = '';
                if (['1', '6'].includes(this.form.theme)) {
                    line = 'text-line-1';
                } else if (['0', '2', '3', '4', '5'].includes(this.form.theme)) {
                    line = 'text-line-2';
                }
                return line;
            },
            set_outer_class() {
                const flex = ['0', '2', '6'].includes(this.form.theme) ? 'flex-col ' : 'flex-row ';
                const wrap = this.form.theme == '5' ? '' : 'flex-wrap ';
                const background = ['6'].includes(this.form.theme) ? 'bg-white ' : '';
                this.setData({
                    outer_class: flex + wrap + background + 'oh',
                });
            },
            // 不同风格下的样式
            get_layout_type() {
                let class_type = '';
                switch (this.form.theme) {
                    case '0':
                        class_type = `flex-row bg-f oh`;
                        break;
                    case '1':
                        class_type = `flex-col two-columns bg-f oh`;
                        break;
                    case '2':
                        class_type = `flex-col bg-f oh`;
                        break;
                    case '3':
                        class_type = `flex-col three-columns bg-f oh`;
                        break;
                    case '4':
                        class_type = `flex-row two-columns bg-f oh`;
                        break;
                    case '5':
                        class_type = `flex-col multicolumn-columns bg-f oh`;
                        break;
                    default:
                        break;
                }
                return class_type;
            },
            get_layout_style() {
                const radius = this.form.theme == '6' ? '' : radius_computer(this.new_style.shop_radius);
                const padding = ['0', '4'].includes(this.form.theme) ? padding_computer(this.new_style.shop_padding) : '';
                return `${radius} ${padding}`;
            },
            get_content_style() {
                const spacing_value = this.new_style.content_spacing;
                let spacing = '';
                if (['0', '4'].includes(this.form.theme)) {
                    spacing = `margin-left: ${spacing_value}px;`;
                } else {
                    spacing = padding_computer(this.new_style.shop_padding);
                }
                return `${spacing}`;
            },
            // 判断是否显示对应的内容
            is_show(index) {
                return this.form.is_show.includes(index);
            },
            // 根据传递的参数，从对象中取值
            trends_config(key, type) {
                return this.style_config(this.new_style[`shop_${key}_typeface`], this.new_style[`shop_${key}_size`], this.new_style[`shop_${key}_color`], type);
            };
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color, type) {
                let style = `font-weight:${typeface}; font-size: ${size}px;`;
                if (type == 'gradient') {
                    style += button_gradient();
                } else {
                    style += `color: ${color};`;
                }
                return style;
            },
            // 按钮渐变色处理
            button_gradient() {
                return gradient_handle(this.new_style.shop_button_color, '180deg');
            },
            // icon标志显示样式
            icon_style(item) {
                let style = `background: ${item.bg_color};color: ${item.color};`;
                if (!is_obj_empty(item.br_color)) {
                    style += `border: 1px solid ${item.br_color};`;
                } else {
                    style += `border: 1px solid ${item.bg_color};`;
                }
                return style;
            },
            url_open_event(link) {
                if (!is_obj_empty(link)) {
                    app.globalData.url_open(link.page)
                }
            }
        },
    };
</script>

<style scoped lang="scss">
    :deep(.el-image) {
        background-color: #fff;

        .image-slot img {
            width: 5rem;
            height: 5rem;
        }
    }

    .identifying {
        font-size: 0.9rem;
    }

    .original-price-left {
        width: 1rem;
        background-image: url('/src/assets/images/components/model-goods-list/price.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .original-price {
        background-color: #ede2c5;
        border-radius: 0;
        border-bottom-right-radius: 1rem;
        border-top-right-radius: 1rem;
        padding: 0 1rem 0 0;
    }

    .two-columns {
        width: calc((100% - v-bind(two_columns)) / 2);
    }

    .three-columns {
        width: calc((100% - v-bind(three_columns)) / 3);
    }

    .multicolumn-columns {
        width: v-bind(multicolumn_columns_width);
        min-width: v-bind(multicolumn_columns_width);
        height: v-bind(multicolumn_columns_height);
    }

    .flex-img0 {
        height: auto;
        min-height: 11rem;
        max-height: 12rem;
        width: 11rem;
    }

    .flex-img1 {
        width: 100%;
        height: 18rem;
    }

    .flex-img2 {
        width: 100%;
        height: 16.6rem;
    }

    .flex-img3 {
        width: 100%;
        height: 11.4rem;
    }

    .flex-img4 {
        width: 7rem;
        height: 7rem;
    }

    .flex-img5 {
        width: 100%;
        min-height: 10.4rem;
    }

    :deep(.el-carousel) {
        width: 100%;

        .el-carousel__container {
            height: v-bind(multicolumn_columns_height);
        }
    }
</style>