<template>
    <!-- 视频列表 -->
    <view class="oh" :style="style_container">
        <view class="oh" :style="style_img_container">
            <view class="pr oh" :style="style">
                <view v-if="!['4'].includes(plugins_video_theme)" class="flex-wrap" :class="plugins_video_theme_class" :style="plugins_video_theme !== '3' ? plugins_video_spacing : ''">
                    <view v-for="(item, index) in data_list" :key="index" class="item oh" :style="plugins_video_style" :data-value="item.data.url" @tap="url_event">
                        <view :class="plugins_video_theme == '0' ? 'flex-row oh' : 'flex-col oh h'" :style="plugins_video_img_style">
                            <template v-if="plugins_video_theme !== '3'">
                                <view class="oh pr flex-row">
                                    <template v-if="item.new_cover.length > 0">
                                        <image :src="item.new_cover[0].url" class="img" :style="img_radius + img_size" mode="aspectFill" />
                                    </template>
                                    <template v-else>
                                        <image :src="item.data.cover" class="img" :style="img_radius + img_size" mode="aspectFill" />
                                    </template>
                                    <!-- 角标 -->
                                    <subscriptIndex :propValue="propValue"></subscriptIndex>
                                </view>
                            </template>
                            <view v-if="field_show.includes('0') || field_show.includes('1') || field_show.includes('2') || field_show.includes('3')" class="jc-sb flex-1" :class="plugins_video_theme == '3' ? 'flex-row align-c' : 'flex-col'" :style="plugins_video_theme !== '0' ? content_padding : ''">
                                <view class="flex-col" :class="plugins_video_theme == '3' ? 'flex-1 flex-width' : ''">
                                    <text v-if="field_show.includes('3')" class="title" :class="plugins_video_theme == '3' ? 'text-line-1' : 'text-line-2'" :style="plugins_video_name">{{ item.new_title ? item.new_title : item.data.title }}</text>
                                </view>
                                <view class="flex-row jc-sb gap-8" :class="plugins_video_theme == '3' ? 'margin-left' : 'align-e margin-top'">
                                    <text :style="plugins_video_date">{{ field_show.includes('0') ? item.data.add_time : '' }}</text>
                                    <view v-show="field_show.includes('1')" class="flex-row align-c gap-3" :style="plugins_video_page_view">
                                        <iconfont name="icon-eye" propContainerDisplay="flex" size="24rpx"></iconfont>
                                        <view>
                                            {{ item.data.access_count ? item.data.access_count : '' }}
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else class="oh" :class="plugins_video_theme_class">
                    <swiper class="swiper" circular :autoplay="is_roll ? true : false" :interval="interval_time" :next-margin="next_margin" :display-multiple-items="slides_per_group" :style="'height:' + carousel_height_computer">
                        <swiper-item v-for="(item1, index1) in plugins_video_carousel_list" :key="index1">
                            <view class="flex-row ht-auto" :style="plugins_video_spacing">
                                <view v-for="(item, index) in item1.split_list" :key="index" class="item oh ht-auto" :style="plugins_video_style" :data-value="item.data.url" @tap="url_event">
                                    <template v-if="!isEmpty(item)">
                                        <view class="oh flex-col ht-auto" :style="plugins_video_img_style">
                                            <view class="oh pr wh-auto ht-auto flex-row">
                                                <template v-if="item.new_cover.length > 0">
                                                    <image :src="item.new_cover[0].url" class="img" :style="img_radius + 'height:100%;'" mode="aspectFill" />
                                                </template>
                                                <template v-else>
                                                    <image :src="item.data.cover" class="img" :style="img_radius + 'height:100%;'" mode="aspectFill" />
                                                </template>
                                                <template v-if="field_show.includes('3') && name_float == '1'">
                                                    <text class="text-line-1" :style="plugins_video_name + float_name_style">{{ item.new_title ? item.new_title : item.data.title }}</text>
                                                </template>
                                                <!-- 角标 -->
                                                <subscriptIndex :propValue="propValue"></subscriptIndex>
                                            </view>
                                            <view v-if="field_show.includes('0') || field_show.includes('1') || field_show.includes('2') || (field_show.includes('3') && name_float == '0')" class="jc-sb flex-1 flex-col" :style="plugins_video_theme !== '0' ? content_padding : ''">
                                                <view class="flex-col">
                                                    <text v-if="field_show.includes('3') && name_float == '0'" class="title text-line-2" :style="plugins_video_name + plugins_video_name_height_computer">{{ item.new_title ? item.new_title : item.data.title }}</text> -->
                                                </view>
                                                <view :class="'flex-row jc-sb gap-8 align-e' + ((field_show.includes('3') && name_float == '0') || field_show.includes('2') ? ' margin-top' : '')">
                                                    <text :style="plugins_video_date">{{ field_show.includes('0') ? item.data.add_time : '' }}</text>
                                                    <view v-show="field_show.includes('1')" class="flex-row align-c gap-3" :style="plugins_video_page_view">
                                                        <iconfont name="icon-eye" propContainerDisplay="flex" size="24rpx"></iconfont>
                                                        <view>
                                                            {{ item.data.access_count ? item.data.access_count : '' }}
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </template>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, padding_computer, radius_computer, get_math, gradient_handle, background_computer, gradient_computer, margin_computer, box_shadow_computer, border_computer, old_margin, get_swiper_list } from '@/common/js/common/common.js';
    import subscriptIndex from '@/pages/diy/components/diy/modules/subscript.vue';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            subscriptIndex,
        },
        props: {
            propValue: {
                type: Object,
                default: () => {},
            },
            // 是否使用公共样式
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
            // 关键key
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
                style_container: '',
                style_img_container: '',
                style: '',
                // 数据
                data_list: [],
                // 风格
                plugins_video_theme: '0',

                // 是否显示
                field_show: ['0', '1'],
                // 视频
                plugins_video_name: '',
                // 日期
                plugins_video_date: '',
                // 浏览量
                plugins_video_page_view: '',
                // 内容圆角
                content_radius: '',
                // 图片圆角
                img_radius: '',
                // 内间距
                content_padding: '',
                // 内容间距
                content_spacing: '',
                // 视频间距
                plugins_video_spacing: '',
                // plugins_video_item_height: '',

                plugins_video_style: '',
                plugins_video_img_style: '',
                // 轮播图定时轮播
                interval_time: 2000,
                // 轮播图是否滚动
                is_roll: 1,

                plugins_video_theme_class: '',
                // 轮播高度
                carousel_height_computer: '',
                // 视频内容高度
                plugins_video_name_height_computer: '',
                // 视频名称浮动样式
                float_name_style: '',
                name_float: '0',
                // 图片大小
                img_size: '',
                // 视频轮播数据
                plugins_video_carousel_list: [],
                // 一行显示的数量
                slides_per_group: 1,
                next_margin: '0rpx',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                this.setData({
                    name_float: !isEmpty(new_content.name_float) ? new_content.name_float : '0',
                    // 判断是自动还是手动
                    data_list:
                        new_content.data_type == '0'
                            ? new_content.data_list
                            : new_content.data_auto_list && new_content.data_auto_list.length > 0
                            ? new_content.data_auto_list.map((item) => ({
                                  id: get_math(),
                                  new_title: '',
                                  new_cover: [],
                                  data: item,
                              }))
                            : [],
                    plugins_video_theme_class: this.plugins_video_theme_class_computer(new_content.theme),
                    plugins_video_theme: new_content.theme,
                    field_show: new_content.field_show,
                    // 样式
                    plugins_video_name: 'font-size:' + new_style.name_size * 2 + 'rpx;' + 'font-weight:' + new_style.name_weight + ';' + 'color:' + new_style.name_color + ';',
                    plugins_video_date: 'font-size:' + new_style.time_size * 2 + 'rpx;' + 'font-weight:' + new_style.time_weight + ';' + 'color:' + new_style.time_color + ';',
                    plugins_video_page_view: 'font-size:' + new_style.page_view_size * 2 + 'rpx;' + 'font-weight:' + new_style.page_view_weight + ';' + 'color:' + new_style.page_view_color + ';',
                    content_radius: radius_computer(new_style.content_radius),
                    img_radius: radius_computer(new_style.img_radius),
                    // 内间距
                    content_padding: padding_computer(new_style.padding),
                    // 内容间距
                    content_spacing: `gap: ${new_style.content_spacing}px;`,
                    // 视频间距
                    plugins_video_spacing: `gap: ${new_style.plugins_video_spacing}px;`,
                    next_margin: new_style.rolling_fashion == 'translation' ? '-' + new_style.plugins_video_spacing_margin + 'px' : '0rpx',
                    // 视频内容高度
                    slides_per_group: new_style.rolling_fashion == 'translation' ?  Number(new_content.carousel_col) + 1 : 1,

                });
                // 默认数据
                const product_style_list = [
                    { name: '单列展示', value: '0', width:110, height: 83 },
                    { name: '两列展示（纵向）', value: '1', width:180, height: 180 },
                    { name: '大图展示', value: '2', width:0, height: 180 },
                    { name: '无图模式', value: '3', width:0, height: 0 },
                    { name: '左右滑动展示', value: '4', width:0, height: 0 },
                ];
                const scale = sys_width / 390;
                let img_style = ``;
                if (['0'].includes(new_content.theme)) {
                    // 图片宽度
                    if (typeof new_style.content_img_width == 'number') {
                        img_style += `width: ${ new_style.content_img_width * scale }px;`;
                    } else {
                        const list = product_style_list.filter(item => item.value == new_content.theme);
                        if (list.length > 0) {
                            img_style += `width: ${ list[0].width * scale }px;`;
                        } else {
                            img_style += 'width: auto;';
                        }
                    }
                }
                if (!['3', '4'].includes(new_content.theme)) {
                    // 图片宽度
                    if (typeof new_style.content_img_height == 'number') {
                        img_style += `height: ${ new_style.content_img_height * scale }px;`;
                    } else {
                        const list = product_style_list.filter(item => item.value == new_content.theme);
                        if (list.length > 0) {
                            img_style += `height: ${ list[0].height * scale }px;`;
                        } else {
                            img_style += 'height: auto;';
                        }
                    }
                }
                // 背景图的处理
                const plugins_video_data = {
                    background_img_style: new_style?.plugins_video_background_img_style || '',
                    background_img: new_style?.plugins_video_background_img || '',
                }
                const plugins_video_margin = new_style.value?.margin || old_margin;
                const margin_width = plugins_video_margin.margin_left + plugins_video_margin.margin_right;
                // 渐变效果
                const all_style = gradient_handle(new_style?.plugins_video_color_list || [], new_style?.plugins_video_direction || '') + margin_computer(plugins_video_margin) + box_shadow_computer(new_style) + border_computer(new_style);
                // 视频样式
                if (this.plugins_video_theme == '0') {
                    this.setData({
                        img_size: img_style,
                        plugins_video_style:  this.content_radius + all_style,
                        plugins_video_img_style: this.content_spacing + this.content_padding + background_computer(plugins_video_data)
                    });
                } else if (this.plugins_video_theme == '1') {
                    this.setData({
                        img_size: img_style,
                        plugins_video_style: `width: calc(50% - ${(new_style.plugins_video_spacing + (margin_width * 2)) / 2}px);` + this.content_radius + all_style,
                        plugins_video_img_style: background_computer(plugins_video_data)
                    });
                } else if (this.plugins_video_theme == '2') {
                    this.setData({
                        img_size: img_style,
                        plugins_video_style: this.content_radius + all_style,
                        plugins_video_img_style: background_computer(plugins_video_data)
                    });
                } else if (this.plugins_video_theme == '3') {
                    this.setData({
                        style: `padding: 0 ${new_style.content_spacing}px;background:#fff;` + this.content_radius,
                    });
                } else if (this.plugins_video_theme == '4') {
                    // 更新轮播图的key，确保更换时能重新更新轮播图
                    const temp_carousel_col = new_content.carousel_col || '1';
                    // 计算间隔的空间。(gap * gap数量) / 模块数量
                    let gap = temp_carousel_col !== '0' ? ((new_style.plugins_video_spacing * temp_carousel_col - 1) + (margin_width * temp_carousel_col)) / temp_carousel_col : '0';
                    const multicolumn_columns_width = new_style.rolling_fashion == 'translation' ? `margin-right: ${ new_style.plugins_video_spacing + plugins_video_margin.margin_right }px;width:100%;` : `width:calc(${100 / (Number(temp_carousel_col) + 1)}% - ${gap * 2}rpx);min-width:calc(${100 / (Number(temp_carousel_col) + 1)}% - ${gap * 2}rpx);`;
                    const { name_bg_color_list = [], name_bg_direction = '180deg', name_bg_radius, name_bg_padding, name_bg_margin } = new_style;
                    const data = {
                        color_list: name_bg_color_list,
                        direction: name_bg_direction,
                    }
                    let location = 'position:absolute;bottom:0;left:0;right:0;'
                    // 每页显示的数量
                    const num = Number(temp_carousel_col) + 1;
                    // 轮播宽度
                    this.setData({
                        // 滚动时间
                        interval_time: (new_style.interval_time || 2) * 1000,
                        // 是否滚动修改
                        is_roll: new_style.is_roll,
                        // plugins_video_item_height: `height: ${new_style.plugins_video_height }px`,
                        plugins_video_style: this.content_radius + all_style + multicolumn_columns_width,
                        // 轮播高度
                        carousel_height_computer: new_style.plugins_video_height * scale + 'px',
                        // 视频内容高度
                        plugins_video_name_height_computer: `height:${new_style.name_size * 2.4 * 2}rpx;line-height:${new_style.name_size * 1.2 * 2}rpx;`,
                        float_name_style: gradient_computer(data) + (!isEmpty(name_bg_radius) ? radius_computer(name_bg_radius) : '') + (!isEmpty(name_bg_padding) ? padding_computer(name_bg_padding) : '' ) + (!isEmpty(name_bg_padding) ? margin_computer(name_bg_margin) : '') + location,
                        plugins_video_img_style: background_computer(plugins_video_data),
                        plugins_video_carousel_list: get_swiper_list(this.data_list, num, new_style.rolling_fashion),
                    });
                }

                if (this.propIsCommonStyle) {
                    this.setData({
                        style_container: common_styles_computer(new_style.common_style),
                        style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    });
                }
            },
            // 视频主题样式
            plugins_video_theme_class_computer(theme) {
                switch (theme) {
                    case '0':
                        return 'style1 flex-col';
                    case '1':
                        return 'style2 flex-row flex-wrap';
                    case '2':
                        return 'style3 flex-col';
                    case '3':
                        return 'style4 flex-col';
                    default:
                        return 'style5';
                }
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .h {
        height: 100%;
    }
    .style1 {
        .item {
            max-width: 100%;
        }
    }
    .style2 {
        .item {
            .img {
                width: 100%;
            }
        }
    }
    .style3 {
        .item {
            width: 100%;
            .img {
                width: 100%;
            }
        }
    }
    .style4 {
        .item {
            width: 100%;
            &:not(:last-child) {
                border-bottom: 2rpx solid #eee;
            }
        }
    }
    .style5 {
        .item {
            width: 100%;
            .img {
                width: 100%;
            }
        }
    }
</style>
