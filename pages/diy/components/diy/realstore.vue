<template>
    <view class="oh" :style="style_container">
        <view :style="style_img_container">
            <view :class="outer_class" :style="outer_style">
                <template v-if="!['3'].includes(theme)">
                    <view v-for="(item, index) in list" :key="index" class="pr oh" :style="layout_style" :data-value="item.url" @tap.stop="url_event">
                        <view class="flex-col" :style="layout_img_style">
                            <view :class="['oh wh-auto ht-auto', ['0'].includes(theme) ? 'flex-row' : 'flex-col' ]">
                                <template v-if="!isEmpty(item)">
                                    <view class="oh pr" :style="img_size">
                                        <view v-if="!isEmpty(item.new_cover)" :style="img_size">
                                            <image-empty :propImageSrc="item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                        </view>
                                        <view v-else :style="img_size">
                                            <image-empty :propImageSrc="item.logo" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                        </view>
                                    </view>
                                </template>
                                <view class="flex-1 flex-col" :style="content_style">
                                    <view class="flex-col jc-sb gap-10">
                                        <view class="flex-row jc-sb align-c gap-10">
                                            <view class="flex-row align-c gap-3">
                                                <view v-if="(item.alias || null) != null" class="nowrap" :style="shop_label_style">{{ item.alias }}</view>
                                                <view class="text-line-1" :style="title_style">{{ item.name }}</view>
                                            </view>
                                            <view v-if="['0', '2'].includes(theme) && (!isEmpty(item.service_data.service_tel) || (item.lat != 0 && item.lng != 0))" class="flex-row align-c" :style="'gap:' + new_style.phone_navigation_spacing * 2 + 'rpx;'">
                                                <view v-if="!isEmpty(item.service_data.service_tel)" :data-value="item.service_data.service_tel" @tap.stop="tel_event">
                                                    <imgOrIconOrText :propValue="propValue" propType="phone"/>
                                                </view>
                                                <view v-if="item.lat != 0 && item.lng != 0" :data-index="index" @tap.stop="address_map_event">
                                                    <imgOrIconOrText :propValue="propValue" propType="navigation"  />
                                                </view>
                                            </view>
                                        </view>
                                        <view v-if="!isEmpty(item.status_info) && !isEmpty(item.status_info.time)" class="flex-row gap-2 align-c">
                                            <imgOrIconOrText :propValue="propValue" propType="time" />
                                            <view class="flex-1 flex-row align-c">
                                                <text class="nowrap" :style="state_style + `color: ${ item.status_info.status == 1 ? new_style.realstore_state_color : new_style.realstore_default_state_color }`">{{ item.status_info.msg }}</text>
                                                <text v-if="!isEmpty(item.status_info.msg) || !isEmpty(item.status_info.time)" :style="'color: #ccc;' + margin_computer(new_style.realstore_business_distance)">|</text>
                                                <text class="text-line-1" :style="business_hours_style">{{ item.status_info.time }}</text>
                                            </view>
                                        </view>
                                    </view>
                                    <template v-if="theme !== '0' && (form.is_location_show == '1' || form.is_location_distance_show == '1' || form.is_location_title_show == '1')">
                                        <view :style="border_style"></view>
                                        <view class="flex-row jc-sb align-c gap-10">
                                            <view class="flex-1 flex-row align-c jc-sb">
                                                <view class="flex-1 flex-row align-b gap-2">
                                                    <imgOrIconOrText :propValue="propValue" propType="location" />
                                                    <text v-if="form.is_location_title_show == '1'" class="text-line-2 flex-1" :style="location_style">{{ item.province_name }}{{ item.city_name }}{{ item.county_name }}{{ item.address }}</text>
                                                </view>
                                                <text v-if="!isEmpty(item.distance) && theme != '1' && form.is_location_distance_show == '1'" :style="distance_style">距您{{ item.distance || '0km' }}</text>
                                            </view>
                                            <view v-if="!['0', '2'].includes(theme) && item.lat != 0 && item.lng != 0" :data-index="index" @tap.stop="address_map_event" >
                                                <imgOrIconOrText :propValue="propValue" propType="navigation" />
                                            </view>
                                        </view>
                                    </template>
                                </view>
                            </view>
                            <template v-if="theme == '0' && (form.is_location_show == '1' || form.is_location_distance_show == '1' || form.is_location_title_show == '1')">
                                <view :style="border_style"></view>
                                <view class="flex-row align-c jc-sb">
                                    <view class="flex-1 flex-row align-b gap-2">
                                        <imgOrIconOrText :propValue="propValue" propType="location" />
                                        <text v-if="form.is_location_title_show == '1'" class="text-line-2 flex-1" :style="location_style">{{ item.province_name }}{{ item.city_name }}{{ item.county_name }}{{ item.address }}</text>
                                    </view>
                                    <text v-if="form.is_location_distance_show == '1' && !isEmpty(item.distance)" :style="distance_style">距您{{ item.distance || '' }}</text>
                                </view>
                            </template>
                        </view>
                    </view>
                </template>
                <template v-else>
                    <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :next-margin="new_style.rolling_fashion == 'translation' ? '-' + content_outer_spacing_magin : '0rpx'" :display-multiple-items="slides_per_group" :style="{ width: '100%', height: new_style.content_outer_height * new_scale + 'px' }">
                        <swiper-item v-for="(item1, index1) in realstore_content_list" :key="index1">
                            <view class="flex-row wh-auto ht-auto" :style="outer_style">
                                <view v-for="(item, index) in item1.split_list" :key="index" class="pr oh" :style="layout_style" :data-value="item.url" @tap.stop="url_event">
                                    <template v-if="!isEmpty(item)">
                                        <view :class="['oh wh-auto ht-auto', ['0', '4'].includes(theme) ? 'flex-row' : 'flex-col' ]" :style="layout_img_style">
                                            <template v-if="!isEmpty(item)">
                                                <view class="oh pr wh-auto ht-auto">
                                                    <view v-if="!isEmpty(item.new_cover)" class="wh-auto ht-auto">
                                                        <image-empty :propImageSrc="item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                                    </view>
                                                    <view v-else class="wh-auto ht-auto">
                                                        <image-empty :propImageSrc="item.logo" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                                    </view>
                                                </view>
                                            </template>
                                            <view class="flex-1 flex-col jc-sb gap-10" :style="content_style">
                                                <view class="flex-row align-c gap-3">
                                                    <view v-if="(item.alias || null) != null" class="nowrap" :style="shop_label_style">{{ item.alias }}</view>
                                                    <view class="text-line-1" :style="title_style">{{ item.name }}</view>
                                                </view>
                                                <view class="flex-row jc-sb align-c">
                                                    <view v-if="!isEmpty(item.status_info) && !isEmpty(item.status_info.time)" class="flex-1 flex-row gap-2 align-c">
                                                        <imgOrIconOrText :propValue="propValue" propType="time" />
                                                        <text class="nowrap" :style="state_style + `color: ${ item.status_info.status == 1 ? new_style.realstore_state_color : new_style.realstore_default_state_color }`">{{ item.status_info.msg }}</text>
                                                    </view>
                                                    <view v-if="item.lat != 0 && item.lng != 0" :data-index="index1" :data-split="index" @tap.stop="address_map_event">
                                                        <imgOrIconOrText :propValue="propValue" propType="navigation" />
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </template>
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
    import { isEmpty, common_styles_computer, common_img_computer, gradient_handle, padding_computer, radius_computer, background_computer, border_computer, box_shadow_computer, get_swiper_list, margin_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    import subscriptIndex from '@/pages/diy/components/diy/modules/subscript/index.vue';
    import imgOrIconOrText from '@/pages/diy/components/diy/modules/img-or-icon-or-text.vue';
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
                list: [],
                content_img_radius: '', // 图片圆角设置
                theme: '', // 选择的风格
                content_outer_spacing: '', // 商品间距
                content_outer_spacing_magin: '', // 商品间距
                // 最外层不同风格下的显示
                outer_class: '',
                outer_style: '',
                // 不同风格下的样式
                layout_style: '',
                layout_img_style: '',
                content_style: '', // 内容区域的样式
                style_container: '', // 公共样式
                style_img_container: '',
                realstore_content_list: [],
                slides_per_group: 1,
                border_style: '',
                // 内容样式
                title_style: '',
                state_style: '',
                business_hours_style: '',
                distance_style: '',
                location_style: '',
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
                    let new_list = [];
                    // 指定商品并且指定商品数组不为空
                    if (!isEmpty(new_form.data_list) && new_form.data_type == '0') {
                        new_list = new_form.data_list.map((item) => ({
                            ...item.data,
                            name: !isEmpty(item.new_title) ? item.new_title : item.data.name,
                            new_cover: item.new_cover,
                        }));
                    } else if (!isEmpty(new_form.data_auto_list) && new_form.data_type == '1') {
                        // 筛选商品并且筛选商品数组不为空
                        new_list = new_form.data_auto_list;
                    }
                    // 最外层不同风格下的显示
                    const flex = ['0', '2'].includes(new_form.theme) ? 'flex-col ' : 'flex-row ';
                    const wrap = new_form.theme == '3' ? '' : 'flex-wrap ';
                    // 默认数据
                    const realstore_style_list = [
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
                            const list = realstore_style_list.filter(item => item.value == new_form.theme);
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
                            const list = realstore_style_list.filter(item => item.value == new_form.theme);
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
                        outer_style: `gap: ${new_style.content_outer_spacing * 2 + 'rpx'};`,
                        content_outer_spacing_magin: new_style.content_outer_spacing * 2 + 'rpx',
                        list: new_list,
                        new_scale: scale,
                        content_img_radius: radius_computer(new_style.realstore_img_radius), // 图片圆角设置
                        theme: new_form.theme, // 选择的风格
                        title_style: this.trends_config('title', new_style),
                        state_style: this.trends_config('state', new_style),
                        business_hours_style: this.trends_config('business_hours', new_style),
                        distance_style: this.trends_config('distance', new_style),
                        location_style: this.trends_config('location', new_style),
                        realstore_content_list: get_swiper_list(new_list, new_form.carousel_col, new_style.rolling_fashion),
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
                return this.style_config(new_style[`realstore_${key}_typeface`], new_style[`realstore_${key}_size`], new_style[`realstore_${key}_color`]);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color) {
                return `font-weight:${typeface}; font-size: ${size}px;color: ${color};`;
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
                const { realstore_margin, realstore_radius, realstore_color_list, realstore_direction } = new_style;
                const radius = radius_computer(realstore_radius);
                // 计算每个容器的大小
                let size_style = ``;
                const realstore_left_right_width = realstore_margin.margin_left + realstore_margin.margin_right;
                if (['1'].includes(form.theme)) {
                    size_style = `width: calc((100% - ${new_style.content_outer_spacing * 2 + (realstore_left_right_width * 4) + 'rpx'}) / 2);`;;
                } else if (form.theme == '3') {
                    // 如果不是平移的时候执行
                    if (new_style.rolling_fashion != 'translation') {
                        size_style = `width: ${this.get_multicolumn_columns_width(new_style, form)};min-width: ${this.get_multicolumn_columns_width(new_style, form)};height: ${new_style.content_outer_height * (sys_width / 390) + 'px'};`;
                    } else {
                        size_style = `margin-right: ${ (new_style.content_outer_spacing * 2) + (realstore_margin.margin_right * 2) }rpx;width: 100%;height: 100%;`;
                    }
                } else if (form.theme == '0') {
                    size_style = `width: calc(100% - ${ realstore_left_right_width * 2 }rpx);`;
                }
                const gradient = gradient_handle(realstore_color_list, realstore_direction) + margin_computer(realstore_margin) + border_computer(new_style) + box_shadow_computer(new_style);
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
                const { realstore_padding, realstore_background_img_style, realstore_background_img } = new_style;
                const padding = form.theme == '0' ? padding_computer(realstore_padding) : '';
                const data = {
                    background_img_style: realstore_background_img_style,
                    background_img: realstore_background_img,
                }
                return padding + background_computer(data);
            },
            get_content_style(form, new_style) {
                const spacing_value = new_style.content_spacing;
                let spacing = '';
                if (['0'].includes(form.theme)) {
                    spacing = `margin-left: ${spacing_value}px;`;
                } else {
                    spacing = padding_computer(new_style.realstore_padding);
                }
                return `${spacing}`;
            },
            // 电话
            tel_event(e) {
                app.globalData.call_tel(e);
            },
            // 地图查看
            address_map_event(e) {
                let info = this.list[e.currentTarget.dataset.index] || {};
                // 判断是否是轮播传递过来的数据
                if (!isEmpty(e.currentTarget.dataset.split)) {
                    const old_info = this.realstore_content_list[e.currentTarget.dataset.index].split_list || {};
                    info = old_info[e.currentTarget.dataset.split] || {};
                }
                if (info.lat == 0 || info.lng == 0) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                    return false;
                }
                var address = (info.province_name || "") + (info.city_name || "") + (info.county_name || "") + (info.address || "");
                app.globalData.open_location(info.lng, info.lat, info.name, address);
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style scoped lang="scss">
.gap-10 {
    gap: 20rpx;
}
.gap-2 {
    gap: 4rpx;
}
.gap-3 {
    gap: 6rpx;
}
</style>
