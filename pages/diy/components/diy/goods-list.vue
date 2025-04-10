<template>
    <view v-if="!isEmpty(list)" class="oh" :style="style_container" @tap.stop="onTap">
        <view class="oh" :style="style_img_container">
            <view :class="outer_class" :style="outer_style">
                <block v-if="!['5'].includes(theme)">
                    <view v-for="(item, index) in list" :key="index" class="pr oh" :style="layout_style" :data-index="index" :data-value="item.goods_url" @tap.stop="url_event">
                        <view :class="layout_type" :style="layout_img_style">
                            <block v-if="theme == '6'">
                                <view :class="['flex-row align-c jc-sb ptb-15 mlr-10 gap-20', { 'br-b-e': index != list.length - 1 }]">
                                    <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                                    <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num nowrap" :style="'color:' + new_style.shop_price_color">
                                        <text class="identifying">{{ item.show_price_symbol }}</text>
                                        <text :style="price_style">{{ item.min_price }}</text>
                                        <text v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</text>
                                    </view>
                                </view>
                            </block>
                            <block v-else>
                                <block v-if="!isEmpty(item)">
                                    <view class="oh pr" :class="img_size">
                                        <view v-if="!isEmpty(item.new_cover)" :style="img_size">
                                            <image-empty :propImageSrc="item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                        </view>
                                        <view v-else :style="img_size">
                                            <image-empty :propImageSrc="item.images" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                        </view>
                                        <!-- 角标 -->
                                        <subscriptIndex :propValue="propValue"></subscriptIndex>
                                    </view>
                                </block>
                                <view v-if="is_show('title') || is_show('simple_desc') || is_show('price') || is_show('original_price') || is_show('sales_count') || is_show('plugins_view_icon') || form.is_shop_show == '1'" class="flex-col flex-1 jc-sb content gap-10" :style="content_style">
                                    <view class="flex-col gap-10 top-title">
                                        <view v-if="is_show('title') || (['0', '1', '2', '3', '5'].includes(theme) && is_show('simple_desc'))" class="flex-col" :style="{ gap: new_style.title_simple_desc_spacing * 2 + 'rpx' }">
                                            <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                                            <view v-if="['0', '1', '2', '3', '5'].includes(theme) && is_show('simple_desc')" :class="form.simple_desc_row == '2' ? 'text-line-2' : 'text-line-1'" :style="simple_desc">{{ item.simple_desc }}</view>
                                        </view>
                                        <view v-if="show_content && is_show('plugins_view_icon') && !isEmpty(item.plugins_view_icon_data)" class="flex-row gap-5 align-c">
                                            <view v-for="(icon_data, icon_index) in item.plugins_view_icon_data" :key="icon_index" class="radius text-size-xsss padding-horizontal-xs" :style="{ background: icon_data.bg_color, color: icon_data.color, border: '1rpx solid' + (!isEmpty(icon_data.br_color) ? icon_data.br_color : icon_data.bg_color) }">{{ icon_data.name }}</view>
                                        </view>
                                    </view>
                                    <view v-if="!['3', '4', '5'].includes(form.theme)" class="flex-col gap-5">
                                        <view :class="[form.is_price_solo == '1' ? 'flex-row align-c nowrap' : 'flex-col gap-5']">
                                            <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="'color:' + new_style.shop_price_color">
                                                <text :style="price_symbol">{{ item.show_price_symbol }}</text>
                                                <text :style="price_style">{{ item.min_price }}</text>
                                                <text v-if="is_show('price_unit')" :style="price_unit">{{ item.show_price_unit }}</text>
                                            </view>
                                            <view v-if="show_content && is_show('original_price') && !isEmpty(item.min_original_price)" class="text-size-xss flex-row">
                                                <!-- <image v-if="form.static_img.length > 0" class="original-price-left" :src="form.static_img[0].url" model="widthFix"></image> -->
                                                <text :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]" :style="original_price">
                                                    {{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                    <block v-if="is_show('original_price_unit')">
                                                        {{ item.show_original_price_unit }}
                                                    </block>
                                                </text>
                                            </view>
                                        </view>
                                        <view class="flex-row jc-sb align-e">
                                            <view>
                                                <view v-if="show_content" class="flex-row align-c text-size-xss">
                                                    <view v-if="is_show('sales_count') && !isEmpty(item.sales_count)" class="pr-5" :style="sold_number_style">已售{{ item.sales_count || 0 }}件</view>
                                                    <!-- <view v-if="is_show('sales_count')" :class="['pr-5', {'br-r-e': is_show('sales_count') && is_show('4')}]" :style="sold_number_style>已售{{ item.sales_count }}件</view> -->
                                                    <!-- <view v-if="is_show('4')" class="pl-5" :style="score_style">评分0</view> -->
                                                </view>
                                            </view>
                                            <view v-if="(form.is_shop_show == '1' && form.shop_button_effect == '1' && item.is_error == 0) || (form.is_shop_show == '1' && form.shop_button_effect == '0')" class="pr" :data-index="index" @tap.stop="goods_button_event">
                                                <block v-if="form.shop_type == 'text'">
                                                    <view class="plr-11 padding-vertical-xs round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                                </block>
                                                <view v-else class="round padding-horizontal-sm ptb-5" :style="button_gradient">
                                                    <iconfont :name="'icon-' + (!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart')" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                                                </view>
                                                <view v-if="form.shop_button_effect == '1'" class="cart-badge-icon pa badge-style">
                                                    <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                    <view v-else class="flex-row align-c jc-sb">
                                        <view class="flex-row align-c nowrap">
                                            <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="'color:' + new_style.shop_price_color">
                                                <text :style="price_symbol">{{ item.show_price_symbol }}</text>
                                                <text :style="price_style">{{ item.min_price }}</text>
                                                <text v-if="is_show('price_unit')" :style="price_unit">{{ item.show_price_unit }}</text>
                                            </view>
                                            <view v-if="show_content && is_show('original_price') && !isEmpty(item.min_original_price)" class="text-size-xss flex-row">
                                                <!-- <image v-if="form.static_img.length > 0" class="original-price-left" :src="form.static_img[0].url" model="widthFix"></image> -->
                                                <text :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]" :style="original_price">
                                                    {{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                    <block v-if="is_show('original_price_unit')">
                                                        {{ item.show_original_price_unit }}
                                                    </block>
                                                </text>
                                            </view>
                                        </view>
                                        <view v-if="(form.is_shop_show == '1' && form.shop_button_effect == '1' && item.is_error == 0) || (form.is_shop_show == '1' && form.shop_button_effect == '0')" class="pr" :data-index="index" @tap.stop="goods_button_event">
                                            <block v-if="form.shop_type == 'text'">
                                                <view class="plr-11 padding-vertical-xs round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                            </block>
                                            <view v-else class="round padding-horizontal-sm ptb-5" :style="button_gradient">
                                                <iconfont :name="'icon-' + (!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart')" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                                            </view>
                                            <view v-if="form.shop_button_effect == '1'" class="cart-badge-icon pa badge-style">
                                                <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>
                </block>
                <block v-else>
                    <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :next-margin="new_style.rolling_fashion == 'translation' ? '-' + content_outer_spacing_magin : '0rpx'" :display-multiple-items="slides_per_group" :style="{ width: '100%', height: new_style.content_outer_height * new_scale + 'px' }">
                        <swiper-item v-for="(item1, index1) in shop_content_list" :key="index1">
                            <view class="flex-row wh-auto ht-auto" :style="outer_style">
                                <view v-for="(item, index) in item1.split_list" :key="index" class="pr oh" :style="layout_style" :data-index="index1" :data-split-index="index" :data-value="item.goods_url" @tap.stop="url_event">
                                    <template v-if="!isEmpty(item)">
                                        <view :class="layout_type" :style="layout_img_style">
                                            <block v-if="!isEmpty(item)">
                                                <view class="oh pr" :class="'flex-img' + theme">
                                                    <view v-if="!isEmpty(item.new_cover)" :class="'flex-img' + theme">
                                                        <image-empty :propImageSrc="item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                                    </view>
                                                    <view v-else :class="'flex-img' + theme">
                                                        <image-empty :propImageSrc="item.images" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                                    </view>
                                                    <!-- 角标 -->
                                                    <subscriptIndex :propValue="propValue"></subscriptIndex>
                                                </view>
                                            </block>
                                            <view v-if="is_show('title') || is_show('simple_desc') || is_show('price') || is_show('plugins_view_icon') || is_show('original_price') || form.is_shop_show == '1'" class="flex-col flex-1 jc-sb content gap-10" :style="content_style">
                                                <view class="flex-col gap-10 top-title">
                                                    <view v-if="is_show('title') || (['0', '1', '2', '3', '5'].includes(theme) && is_show('simple_desc'))" class="flex-col" :style="{ gap: new_style.title_simple_desc_spacing * 2 + 'rpx' }">
                                                        <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                                                        <view v-if="['0', '1', '2', '3', '5'].includes(theme) && is_show('simple_desc')" :class="form.simple_desc_row == '2' ? 'text-line-2' : 'text-line-1'" :style="simple_desc">{{ item.simple_desc }}</view>
                                                    </view>
                                                    <view v-if="show_content && is_show('plugins_view_icon') && !isEmpty(item.plugins_view_icon_data)" class="flex-row gap-5 align-c">
                                                        <view v-for="(icon_data, icon_index) in item.plugins_view_icon_data" :key="icon_index" class="radius text-size-xsss padding-horizontal-xs" :style="{ background: icon_data.bg_color, color: icon_data.color, border: '1rpx solid' + (!isEmpty(icon_data.br_color) ? icon_data.br_color : icon_data.bg_color) }">{{ icon_data.name }}</view>
                                                    </view>
                                                </view>
                                                <view class="flex-row align-c jc-sb">
                                                    <view class="flex-row align-c nowrap">
                                                        <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="'color:' + new_style.shop_price_color">
                                                            <text :style="price_symbol">{{ item.show_price_symbol }}</text>
                                                            <text :style="price_style">{{ item.min_price }}</text>
                                                            <text v-if="is_show('price_unit')" :style="price_unit">{{ item.show_price_unit }}</text>
                                                        </view>
                                                        <view v-if="show_content && is_show('original_price') && !isEmpty(item.min_original_price)" class="text-size-xss flex">
                                                            <!-- <image v-if="form.static_img.length > 0" class="original-price-left" :src="form.static_img[0].url" model="widthFix"></image> -->
                                                            <text :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]" :style="original_price">
                                                                {{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                                <block v-if="is_show('original_price_unit')">
                                                                    {{ item.show_original_price_unit }}
                                                                </block>
                                                            </text>
                                                        </view>
                                                    </view>
                                                    <view v-if="(form.is_shop_show == '1' && form.shop_button_effect == '1' && item.is_error == 0) || (form.is_shop_show == '1' && form.shop_button_effect == '0')" class="pr" :data-index="index1" :data-split-index="index" @tap.stop="goods_button_event">
                                                        <block v-if="form.shop_type == 'text'">
                                                            <view class="plr-11 padding-vertical-xs round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                                        </block>
                                                        <view v-else class="round padding-horizontal-sm ptb-5" :style="button_gradient">
                                                            <iconfont :name="'icon-' + (!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart')" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                                                        </view>
                                                        <view v-if="form.shop_button_effect == '1'" class="cart-badge-icon pa badge-style">
                                                            <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
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
                </block>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, gradient_handle, padding_computer, radius_computer, background_computer, border_computer, box_shadow_computer, old_margin, margin_computer, get_swiper_list } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    import subscriptIndex from '@/pages/diy/components/diy/modules/subscript/index.vue';
    import componentBadge from '@/components/badge/badge';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            imageEmpty,
            componentBadge,
            subscriptIndex
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propDiyIndex: {
                type: Number,
                default: 0,
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 0,
            },
            propNewList: {
                type: Array,
                default: () => ([])
            },
            propIsUseAuto: {
                type: Boolean,
                default: true,
            },
            propActivityIndex: {
                type: Number,
                default: 0
            }
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
                layout_type: '',
                layout_style: '',
                layout_img_style: '',
                content_style: '', // 内容区域的样式
                show_content: false, // 显示除标题外的其他区域
                text_line: '', // 超过多少行隐藏
                style_container: '', // 公共样式
                style_img_container: '',
                shop_content_list: [],
                slides_per_group: 1,
                // 内容样式
                title_style: '',
                price_style: '',
                sold_number_style: '',
                score_style: '',
                button_style: '',
                simple_desc: '',
                price_symbol: '',
                price_unit: '',
                original_price: '',
                // 按钮背景色
                button_gradient: '',
                // 图片大小
                img_size: '',
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
            isEmpty,
            init() {
                const new_form = this.propValue.content || null;
                const new_style = this.propValue.style || null;
                if (new_form != null && new_style != null) {
                    let new_list = [];
                    // 判断是否是活动传递过来的，是使用自动数据，还是使用传递过来的数据
                    if (this.propIsUseAuto) {
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
                        }
                    } else {
                        new_list = this.propNewList;
                    }
                    // 最外层不同风格下的显示
                    const flex = ['0', '2', '6'].includes(new_form.theme) ? 'flex-col ' : 'flex-row ';
                    const wrap = new_form.theme == '5' ? '' : 'flex-wrap ';
                    const background = ['6'].includes(new_form.theme) ? 'bg-white ' : '';
                    const button_gradient = gradient_handle(new_style.shop_button_color, '180deg');
                    // 默认数据
                    const product_style_list = [
                        { name: '单列展示', value: '0', width: 110, height: 120 },
                        { name: '大图展示', value: '2', width: 166, height: 166 },
                        { name: '无图模式', value: '6', width: 0, height: 0 },
                        { name: '两列展示(纵向)', value: '1', width: 180, height: 180 },
                        { name: '两列展示(横向)', value: '4', width: 70, height: 70 },
                        { name: '三列展示', value: '3', width: 116, height: 114 },
                        { name: '左右滑动展示', value: '5', width: 0, height: 0 },
                    ];
                    const scale = sys_width / 390;
                    let img_style = ``;
                    if (['0', '4'].includes(new_form.theme)) {
                        // 图片宽度
                        if (typeof new_style.content_img_width == 'number') {
                            img_style += `width: ${ new_style.content_img_width * scale }px;`;
                        } else {
                            const list = product_style_list.filter(item => item.value == new_form.theme);
                            if (list.length > 0) {
                                img_style += `width: ${ list[0].width * scale }px;`;
                            } else {
                                img_style += 'width: auto;';
                            }
                        }
                    }
                    if (!['5', '6'].includes(new_form.theme)) {
                        // 图片宽度
                        if (typeof new_style.content_img_height == 'number') {
                            img_style += `height: ${ new_style.content_img_height * scale }px;`;
                        } else {
                            const list = product_style_list.filter(item => item.value == new_form.theme);
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
                        outer_class: flex + wrap + background + 'oh',
                        list: new_list,
                        new_scale: scale,
                        content_img_radius: radius_computer(new_style.shop_img_radius), // 图片圆角设置
                        theme: new_form.theme, // 选择的风格
                        content_outer_spacing: new_style.content_outer_spacing, // 商品间距
                        content_outer_spacing_magin: new_style.content_outer_spacing * 2 + 'rpx',
                        outer_style: new_form.theme == '6' ? radius_computer(new_style.shop_radius) : `gap: ${new_style.content_outer_spacing * 2 + 'rpx'};`,
                        // 不同风格下的样式
                        layout_type: ['0', '4'].includes(new_form.theme) ? 'flex-row wh-auto ht-auto oh' : 'flex-col wh-auto ht-auto oh',
                        layout_style: this.get_layout_style(new_style, new_form),
                        layout_img_style: this.get_layout_img_style(new_style, new_form),
                        content_style: this.get_content_style(new_style, new_form), // 内容区域的样式
                        show_content: ['0', '1', '2'].includes(new_form.theme), // 显示除标题外的其他区域
                        text_line: this.get_text_line(new_form), // 超过多少行隐藏
                        style_container: this.propIsCommonStyle ? common_styles_computer(new_style.common_style) : '', // 公共样式
                        style_img_container: this.propIsCommonStyle ? common_img_computer(new_style.common_style, this.propIndex) : '', // 图片样式
                        // 内容样式设置
                        button_gradient: button_gradient,
                        title_style: this.trends_config(new_style, 'title', 'title', new_form),
                        price_style: this.trends_config(new_style, 'price'),
                        sold_number_style: this.trends_config(new_style, 'sold_number'),
                        score_style: this.trends_config(new_style, 'score'),
                        button_style: this.trends_config(new_style, 'button', 'buy_button') + button_gradient,
                        simple_desc: this.trends_config(new_style, 'simple_desc', 'desc', new_form),
                        price_symbol: !isEmpty(new_style.shop_price_symbol_color) ? this.trends_config(new_style, 'price_symbol') : 'font-size: 18rpx;color: #EA3323;' ,
                        price_unit: !isEmpty(new_style.shop_price_unit_color) ? this.trends_config(new_style, 'price_unit') : 'font-size: 18rpx;color: #EA3323;',
                        original_price: this.trends_config(new_style, 'original_price'),
                        shop_content_list: get_swiper_list(new_list, new_form.carousel_col, new_style.rolling_fashion),
                        slides_per_group: new_style.rolling_fashion == 'translation' ? new_form.carousel_col : 1,
                        img_size: img_style,
                    });
                }
            },
            get_text_line(form) {
                let line = '';
                if (['1', '6'].includes(form.theme)) {
                    line = 'text-line-1';
                } else if (['0', '2', '3', '4', '5'].includes(form.theme)) {
                    line = 'text-line-2';
                }
                return line;
            },
            // 不同风格下的样式
            get_layout_style(new_style, form) {
                const { shop_margin = old_margin } = new_style;
                const radius = form.theme == '6' ? '' : radius_computer(new_style.shop_radius);
                const style = form.theme != '6' ? gradient_handle(new_style?.shop_color_list || [], new_style?.shop_direction || '') + margin_computer(shop_margin) + border_computer(new_style) + box_shadow_computer(new_style) + 'box-sizing: border-box;' : '';
                let size_style = ``;
                const shop_left_right_width = shop_margin.margin_left + shop_margin.margin_right;
                if (['1', '4'].includes(form.theme)) {
                    size_style = `width: calc((100% - ${new_style.content_outer_spacing * 2 + (shop_left_right_width * 4) + 'rpx'}) / 2);`;
                } else if (form.theme == '3') {
                    size_style = `width: calc((100% - ${new_style.content_outer_spacing * 4 +  (shop_left_right_width * 6) + 'rpx'}) / 3);`;
                } else if (form.theme == '5') {
                    // 如果不是平移的时候执行
                    if (new_style.rolling_fashion != 'translation') {
                        size_style = `width: ${this.get_multicolumn_columns_width(new_style, form)};min-width: ${this.get_multicolumn_columns_width(new_style, form)};height: ${new_style.content_outer_height * (sys_width / 390) + 'px'};`;
                    } else {
                        size_style = `margin-right: ${ (new_style.content_outer_spacing * 2) + (shop_margin.margin_right * 2) }rpx;width: 100%;height: 100%;`;
                    }
                } else if (form.theme == '0') {
                    size_style = `width: calc(100% - ${ shop_left_right_width }px);`;
                }
                return `${radius} ${ style } ${size_style}`;
            },
            get_layout_img_style(new_style, form) {
                const padding = ['0', '4'].includes(form.theme) ? padding_computer(new_style.shop_padding) + 'box-sizing: border-box;' : '';
                const data = {
                    background_img_style: new_style?.shop_background_img_style || '',
                    background_img: new_style?.shop_background_img || '',
                }
                const background = form.theme != '6' ? background_computer(data) : '';
                return `${padding} ${background}`;
            },
            get_multicolumn_columns_width(new_style, form) {
                const { carousel_col } = form;
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (new_style.content_outer_spacing * (carousel_col - 1)) / carousel_col;
                return `calc(${100 / carousel_col}% - ${gap * 2}rpx)`;
            },
            get_content_style(new_style, form) {
                const spacing_value = new_style.content_spacing;
                let spacing = '';
                if (['0', '4'].includes(form.theme)) {
                    spacing = `margin-left: ${spacing_value * 2}rpx;`;
                } else {
                    spacing = padding_computer(new_style.shop_padding) + 'box-sizing: border-box;';
                }
                return `${spacing}`;
            },
            // 判断是否显示对应的内容
            is_show(index) {
                return this.form.is_show.includes(index);
            },
            // 根据传递的参数，从对象中取值
            trends_config(new_style, key, type, new_form) {
                return this.style_config(new_style[`shop_${key}_typeface`], new_style[`shop_${key}_size`], new_style[`shop_${key}_color`], type, new_form);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color, type, new_form) {
                let style = `font-weight:${typeface}; font-size: ${size * 2}rpx;`;
                if (type == 'title') {
                    if (['1', '6'].includes(new_form.theme)) {
                        style += `line-height: ${size * 2}rpx;height: ${size * 2}rpx;color: ${color};`;
                    } else if (['0', '2', '3', '4', '5'].includes(new_form.theme)) {
                        style += `line-height: ${size > 0 ? (size + 3) * 2 : 0}rpx;height: ${size > 0 ? (size + 3) * 4 : 0}rpx;color: ${color};`;
                    }
                } else if (type == 'desc') {
                    if (new_form.simple_desc_row == '2') {
                        style += `line-height: ${size > 0 ? (size + 3) * 2 : 0}rpx;height: ${size > 0 ? (size + 3) * 4 : 0}rpx;color: ${color};`;
                    } else {
                        style += `line-height: ${size * 2}rpx;height: ${size * 2}rpx;color: ${color};`;
                    }
                } else {
                    if (type != 'buy_button') {
                        style += `color: ${color};`;
                    }
                }
                return style;
            },
            // icon标志显示样式
            icon_style(item) {
                let style = `background: ${item.bg_color};color: ${item.color};`;
                if (!isEmpty(item.br_color)) {
                    style += `border: 2rpx solid ${item.br_color};`;
                } else {
                    style += `border: 2rpx solid ${item.bg_color};`;
                }
                return style;
            },
            url_event(e) {
                let index = e.currentTarget.dataset.index || 0;
                let goods = this.list[index];
                let split_index = 0;
                if (this.theme == '5') {
                    split_index = e.currentTarget.dataset.splitIndex || 0;
                    goods = this.shop_content_list[index].split_list[split_index];
                }
                app.globalData.goods_data_cache_handle(goods.id, goods);
                app.globalData.url_event(e);
            },
            goods_button_event(e) {
                this.goods_cart_event(e);
            },
            // 加入购物车
            goods_cart_event(e) {
                let index = e.currentTarget.dataset.index || 0;
                let split_index = 0;
                let goods = this.list[index];
                if (this.theme == '5') {
                    split_index = e.currentTarget.dataset.splitIndex || 0;
                    goods = this.shop_content_list[index].split_list[split_index];
                }
                if (this.form.shop_button_effect == '0') {
                    app.globalData.goods_data_cache_handle(goods.id, goods);

                    app.globalData.url_open(goods.goods_url);
                } else {
                    // 开启购物车抛物线效果则展示提示操作
                    let is_success_tips = this.propIsCartParaCurve ? 0 : 1;
                    this.$emit(
                        'goods_buy_event',
                        this.propDiyIndex,
                        goods,
                        {
                            buy_event_type: 'cart',
                            is_direct_cart: 1,
                            is_success_tips: is_success_tips,
                        },
                        {
                            index: index,
                            split_index: split_index,
                            activity_index: this.propActivityIndex,
                            pos: e,
                        }
                    );
                }
            },
            // 加入购物车成功回调
            goods_cart_back_event(e) {
                // 增加数量
                var { index, split_index } = e.back_data;
                let new_data = this.list;
                let goods = new_data[index];
                if (this.theme == '5') {
                    new_data = this.shop_content_list;
                    goods = new_data[index].split_list[split_index];
                }
                goods['user_cart_count'] = parseInt(goods['user_cart_count'] || 0) + parseInt(e.stock);
                if (goods['user_cart_count'] > 99) {
                    goods['user_cart_count'] = '99+';
                }
                if (this.theme != '5') {
                    new_data[index] = goods;
                    this.setData({
                        list: new_data,
                    });
                } else {
                    new_data[index].split_list[split_index] = goods;
                    this.setData({
                        shop_content_list: new_data,
                    });
                }
                app.globalData.showToast('加入成功', 'success');
            },
        },
    };
</script>

<style scoped lang="scss">
    .identifying {
        font-size: 18rpx;
    }
    .original-price {
        padding: 0 20rpx;
    }
    .flex-img5 {
        width: 100%;
        height: 100%;
    }
    // .original-price-left {
    //     width: 20rpx;
    //     height: 28rpx;
    // }
    .br-b-e {
        border-bottom: 2rpx solid #eee;
    }
    .badge-style {
        top: -20rpx;
        right: 10rpx;
    }
</style>
