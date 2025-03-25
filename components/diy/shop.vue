<template>
    <view class="oh" :style="style_container">
        <view :style="style_img_container">
            <view :class="outer_class" :style="onter_style">
                <template v-if="!['3'].includes(theme)">
                    <view v-for="(item, index) in list" :key="index" class="pr oh" :style="layout_style" :data-value="item.url" @tap.stop="url_event">
                        <view :class="['oh', ['0'].includes(theme) ? 'flex-row' : 'flex-col' ]" :style="layout_img_style">
                            <template v-if="!isEmpty(item)">
                                <view class="oh pr" :style="img_size">
                                    <view v-if="!isEmpty(item.new_cover)" :style="img_size">
                                        <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></imageEmpty>
                                    </view>
                                    <view v-else :style="img_size">
                                        <imageEmpty :propImageSrc="item.logo" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></imageEmpty>
                                    </view>
                                </view>
                            </template>
                            <view class="flex-1 flex-row jc-sb gap-10" :style="content_style">
                                <view class="flex-1 flex-col jc-sb gap-10">
                                    <view class="text-line-2" :style="title_style">
                                        <template v-for="(item1, index1) in item.icon_list">
                                            <template v-if="!isEmpty(item1.icon)">
                                                <img :key="index1" :src="item1.icon" class="title-img" :style="title_img_style + 'margin-right: ' + (index < item.icon_list.length - 1 ? new_style.shop_title_img_inner_spacing * 2 : new_style.shop_title_img_outer_spacing * 2) + 'rpx;vertical-align: middle;'" />
                                            </template>
                                        </template>{{ item.name }}
                                    </view>
                                    <span v-if="form.shop_desc == '1'" :class="form.shop_desc_row == '2' ? 'text-line-2' : 'text-line-1'" :style="desc_style">{{ item.describe }}</span>
                                </view>
                                <view v-if="theme == '0'" class="flex-row align-c">
                                    <img-or-icon-or-text :propValue="propValue" propType="right" />
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else>
                    <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :next-margin="new_style.rolling_fashion == 'translation' ? '-' + content_outer_spacing_magin : '0rpx'" :display-multiple-items="slides_per_group" :style="{ width: '100%', height: new_style.content_outer_height * new_scale + 'px' }">
                        <swiper-item v-for="(item1, index) in shop_content_list" :key="index">
                            <view class="flex-row wh-auto ht-auto" :style="onter_style">
                                <view v-for="(item, index) in item1.split_list" :key="index" class="pr oh" :style="layout_style" :data-value="item.url" @tap.stop="url_event">
                                    <view :class="['oh ht-auto', ['0', '4'].includes(theme) ? 'flex-row' : 'flex-col' ]" :style="layout_img_style">
                                        <template v-if="!isEmpty(item)">
                                            <view class="oh pr wh-auto ht-auto">
                                                <view v-if="!isEmpty(item.new_cover)" class="wh-auto ht-auto">
                                                    <imageEmpty :propImageSrc="item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></imageEmpty>
                                                </view>
                                                <view v-else class="wh-auto ht-auto">
                                                    <imageEmpty :propImageSrc="item.logo" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></imageEmpty>
                                                </view>
                                            </view>
                                        </template>
                                        <view class="flex-col jc-sb gap-10" :style="content_style">
                                            <view class="text-line-2" :style="title_style">
                                                <template v-for="(item1, index1) in item.icon_list">
                                                    <template v-if="!isEmpty(item1.icon)">
                                                        <image :key="index1" :src="item1.icon" mode="aspectFit" :style="title_img_style + 'margin-right: ' + (index < item.icon_list.length - 1 ? new_style.shop_title_img_inner_spacing * 2 : new_style.shop_title_img_outer_spacing * 2) + 'rpx;vertical-align: middle;'" :data-value="item1.url" @tap.stop="url_event" />
                                                    </template>
                                                </template>{{ item.name }}
                                            </view>
                                            <span v-if="form.shop_desc == '1'" :class="form.shop_desc_row == '2' ? 'text-line-2' : 'text-line-1'" :style="desc_style">{{ item.describe }}</span>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, gradient_handle, padding_computer, radius_computer, background_computer, border_computer, box_shadow_computer, old_margin, margin_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
    import subscriptIndex from '@/components/diy/modules/subscript/index.vue';
    import imgOrIconOrText from '@/components/diy/modules/img-or-icon-or-text.vue';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            imageEmpty,
            imgOrIconOrText,
            subscriptIndex
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
                default: 0,
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                propIsCartParaCurve: false,
                list: [],
                content_radius: '', // 圆角设置
                content_img_radius: '', // 图片圆角设置
                content_padding: '', // 内边距设置
                theme: '', // 选择的风格
                content_outer_spacing: '', // 商品间距
                content_outer_spacing_magin: '', // 商品间距
                // 最外层不同风格下的显示
                outer_class: '',
                onter_style: '',
                // 不同风格下的样式
                layout_style: '',
                layout_img_style: '',
                content_style: '', // 内容区域的样式
                show_content: false, // 显示除标题外的其他区域
                text_line: '', // 超过多少行隐藏
                style_container: '', // 公共样式
                style_img_container: '',
                shop_content_list: [],
                slides_per_group: 1,
                border_style: '',
                // 内容样式
                title_style: '',
                desc_style: '',
                title_img_style: '',
                // 图片大小
                img_size: '',
                shop_label_style: '',
                new_scale: 1,
            };
        },
        watch: {
            propKey(val) {
                this.init();
            },
            propValue(new_value, old_value) {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty, margin_computer,
            init() {
                const new_form = this.propValue.content || null;
                const new_style = this.propValue.style || null;
                if (new_form != null && new_style != null) {
                    const default_list = {
                        name: '测试商户标题',
                        describe: '测试商户描述',
                        icon_list: [{ icon: `http://shopxo.com/static/diy/images/components/model-shop/auth.png`}, { icon: ''}],
                        logo: '',
                        new_cover: [],
                    };
                    let new_list = [];
                    // 指定商品并且指定商品数组不为空
                    if (!isEmpty(new_form.data_list) && new_form.data_type == '0') {
                        new_list = new_form.data_list.map((item) => ({
                            ...item.data,
                            title: !isEmpty(item.new_title) ? item.new_title : item.data.title,
                            new_cover: item.new_cover,
                        }));
                    } else if (!isEmpty(new_form.data_auto_list) && new_form.data_type == '1') {
                        // 筛选商品并且筛选商品数组不为空
                        new_list = new_form.data_auto_list;
                    } else {
                        new_list = Array(4).fill(default_list);
                    }
                    // 最外层不同风格下的显示
                    const flex = ['0', '2'].includes(new_form.theme) ? 'flex-col ' : 'flex-row ';
                    const wrap = new_form.theme == '3' ? '' : 'flex-wrap ';
                    // 默认数据
                    const shop_style_list = [
                        { name: '单列展示', value: '0', width: 50, height: 50 },
                        { name: '两列展示（纵向）', value: '1', width:180, height: 180 },
                        { name: '大图展示', value: '2', width:0, height: 180 },
                        { name: '左右滑动展示', value: '3', width:0, height: 0 },
                    ];
                    const scale = sys_width / 390;
                    let img_style = ``;
                    if (['0'].includes(new_form.theme)) {
                        // 图片宽度
                        if (typeof new_style.content_img_width == 'number') {
                            img_style += `width: ${ new_style.content_img_width * scale }px;`;
                        } else {
                            const list = shop_style_list.filter(item => item.value == new_form.theme);
                            if (list.length > 0) {
                                img_style += `width: ${ list[0].width * scale }px;`;
                            } else {
                                img_style += 'width: auto;';
                            }
                        }
                    }
                    if (!['3'].includes(new_form.theme)) {
                        // 图片宽度
                        if (typeof new_style.content_img_height == 'number') {
                            img_style += `height: ${ new_style.content_img_height * scale }px;`;
                        } else {
                            const list = shop_style_list.filter(item => item.value == new_form.theme);
                            if (list.length > 0) {
                                img_style += `height: ${ list[0].height * scale }px;`;
                            } else {
                                img_style += 'height: auto;';
                            }
                        }
                    }
                    this.setData({
                        form: new_form,
                        new_style: new_style,
                        outer_class: flex + wrap + 'oh',
                        onter_style: `gap: ${new_style.content_outer_spacing * 2 + 'rpx'};`,
                        list: new_list,
                        new_scale: scale,
                        content_radius: radius_computer(new_style.shop_radius), // 圆角设置
                        content_img_radius: radius_computer(new_style.shop_img_radius), // 图片圆角设置
                        content_padding: padding_computer(new_style.shop_padding) + 'box-sizing: border-box;', // 内边距设置
                        theme: new_form.theme, // 选择的风格
                        title_style: this.trends_config('title', new_style),
                        desc_style: this.trends_config('desc', new_style),
                        shop_content_list: this.get_shop_content_list(new_list, new_form, new_style),
                        title_img_style: this.get_title_img_style(new_style),
                        img_size: img_style,
                        shop_label_style: this.get_shop_label_style(new_style),
                        border_style: this.get_border_style(new_style),
                        layout_style: this.get_layout_style(new_form, new_style),
                        layout_img_style: this.get_layout_img_style(new_form, new_style),
                        content_style: this.get_content_style(new_form, new_style),
                        slides_per_group: new_style.rolling_fashion == 'translation' ? new_form.carousel_col : 1,
                        style_container: common_styles_computer(new_style.common_style), // 公共样式
                        style_img_container: common_img_computer(new_style.common_style, this.propIndex), // 图片样式
                    });
                }
            },
            // 标签显示
            get_shop_label_style(new_style) {
                const { shop_lable_color, shop_lable_size, shop_lable_padding, shop_lable_radius, shop_lable_color_list, shop_lable_direction, shop_lable_border_color, shop_lable_border_size } = new_style;
                return `color: ${ shop_lable_color };font-size: ${ shop_lable_size }px;${ padding_computer(shop_lable_padding) };${ radius_computer(shop_lable_radius) };${ gradient_handle(shop_lable_color_list, shop_lable_direction) };border: ${ shop_lable_border_size }px solid ${ shop_lable_border_color };` 
            },
            // 根据传递的参数，从对象中取值
            trends_config(key, new_style) {
                return this.style_config(new_style[`shop_${key}_typeface`], new_style[`shop_${key}_size`], new_style[`shop_${key}_color`]);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color) {
                return `font-weight:${typeface}; font-size: ${size}px;color: ${color};`;
            },
            get_title_img_style(new_style) {
                const { shop_title_img_width = 0, shop_title_img_height = 0, shop_title_img_radius } = new_style;
                return `width: ${shop_title_img_width || 0 }px;height: ${ shop_title_img_height || 0 }px;${ radius_computer(shop_title_img_radius) }`;
            },
            get_shop_content_list(list, form, new_style) {
                // 深拷贝一下，确保不会出现问题
                const cloneList = JSON.parse(JSON.stringify(list));
                if (new_style.rolling_fashion != 'translation') {
                    // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
                    if (cloneList.length > 0) {
                        // 每页显示的数量
                        const num = form.carousel_col;
                        // 存储数据显示
                        let nav_list = [];
                        // 拆分的数量
                        const split_num = Math.ceil(cloneList.length / num);
                        for (let i = 0; i < split_num; i++) {
                            nav_list.push({
                                split_list: cloneList.slice(i * num, (i + 1) * num),
                            });
                        }
                        return nav_list;
                    } else {
                        // 否则的话，就返回全部的信息
                        return [
                            {
                                split_list: cloneList,
                            },
                        ];
                    }
                } else {
                    // 存储数据显示
                    let nav_list = [];
                    cloneList.forEach((item) => {
                        nav_list.push({
                            split_list: [item],
                        });
                    });
                    return nav_list;
                }
            },
            get_border_style(new_style) {
                const { content_border_margin, content_border_size, content_border_is_show, content_border_color, content_border_style } = new_style;
                let border = ``;
                if (content_border_is_show == '1') {
                    border += `${ margin_computer(content_border_margin) };border-width: ${content_border_size}px 0px 0px 0px;border-style: ${ content_border_style };border-color: ${content_border_color};`
                }
                return border;
            },
            // 容器样式
            get_layout_style(form, new_style) {
                const { shop_margin, shop_radius, shop_color_list, shop_direction } = new_style;
                const radius = radius_computer(shop_radius);
                // 计算每个容器的大小
                let size_style = ``;
                const shop_left_right_width = shop_margin.margin_left + shop_margin.margin_right;
                if (['1'].includes(form.theme)) {
                    size_style = `width: calc((100% - ${new_style.content_outer_spacing * 2 + (shop_left_right_width * 4) + 'rpx'}) / 2);`;;
                } else if (form.theme == '3') {
                    // 如果不是平移的时候执行
                    if (new_style.rolling_fashion != 'translation') {
                        size_style = `width: ${this.get_multicolumn_columns_width(new_style, form)};min-width: ${this.get_multicolumn_columns_width(new_style, form)};height: ${new_style.content_outer_height * (sys_width / 390) + 'px'};`;
                    } else {
                        size_style = `margin-right: ${ (new_style.content_outer_spacing * 2) + (shop_margin.margin_right * 2) }rpx;width: 100%;height: 100%;`;
                    }
                } else if (form.theme == '0') {
                    size_style = `width: calc(100% - ${ shop_left_right_width }px);`;
                }
                const gradient = gradient_handle(shop_color_list, shop_direction) + margin_computer(shop_margin) + border_computer(new_style) + box_shadow_computer(new_style);
                return `${radius} ${ gradient } ${ size_style }`;
            },
            get_multicolumn_columns_width(new_style, form) {
                const { carousel_col } = form;
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (new_style.content_outer_spacing * (carousel_col - 1)) / carousel_col;
                return `calc(${100 / carousel_col}% - ${gap * 2}rpx)`;
            },
            // 容器图片样式
            get_layout_img_style(form, new_style) {
                const { shop_padding, shop_background_img_style, shop_background_img } = new_style;
                const padding = form.theme == '0' ? padding_computer(shop_padding) : '';
                const data = {
                    background_img_style: shop_background_img_style,
                    background_img: shop_background_img,
                }
                return padding + background_computer(data);
            },
            get_content_style(form, new_style) {
                const spacing_value = new_style.content_spacing;
                let spacing = '';
                if (['0'].includes(form.theme)) {
                    spacing = `margin-left: ${spacing_value}px;`;
                } else {
                    spacing = padding_computer(new_style.shop_padding);
                }
                return `${spacing}`;
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style scoped lang="scss">
    .title-img {
        object-fit: contain;
    }
</style>
