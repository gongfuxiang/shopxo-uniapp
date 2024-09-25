<template>
    <view class="oh" :style="style_container">
        <view :class="outer_class" :style="onter_style">
            <block v-if="!['5'].includes(theme)">
                <view v-for="(item, index) in list" :key="index" class="pr" :class="layout_type" :style="layout_style" :data-value="item.goods_url" @tap="url_event">
                    <block v-if="theme == '6'">
                        <view :class="['flex-row align-c jc-sb ptb-15 mlr-10 gap-20', { 'br-b-e': index != list.length - 1 }]">
                            <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                            <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num nowrap" :style="'color:' + new_style.shop_price_color">
                                <text class="identifying">{{ item.show_price_symbol }}</text
                                ><text :style="price_style">{{ item.min_price }}</text>
                                <text v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</text>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <block v-if="!isEmpty(item)">
                            <block v-if="!isEmpty(item.new_cover)">
                                <image-empty :image-src="item.new_cover[0]" :class="'flex-img' + theme" :style="content_img_radius" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                            </block>
                            <block v-else>
                                <image-empty :image-src="item.images" :class="'flex-img' + theme" :style="content_img_radius" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                            </block>
                        </block>
                        <view class="flex-col flex-1 jc-sb content gap-10" :style="content_style">
                            <view class="flex-col gap-10 top-title">
                                <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                                <view v-if="show_content && is_show('plugins_view_icon') && !isEmpty(item.plugins_view_icon_data)" class="flex-row gap-5 align-c">
                                    <view v-for="(icon_data, icon_index) in item.plugins_view_icon_data" :key="icon_index" class="radius text-size-xsss padding-horizontal-xs" :style="{ background: icon_data.bg_color, color: icon_data.color, border: '1rpx solid' + (!isEmpty(icon_data.br_color) ? icon_data.br_color : icon_data.bg_color) }">{{ icon_data.name }}</view>
                                </view>
                            </view>
                            <view v-if="!['3', '4', '5'].includes(form.theme)" class="flex-col gap-5">
                                <view :class="[form.is_price_solo == '1' ? 'flex-row align-c nowrap' : 'flex-col gap-5']">
                                    <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="'color:' + new_style.shop_price_color">
                                        <text class="identifying">{{ item.show_price_symbol }}</text
                                        ><text :style="price_style">{{ item.min_price }}</text>
                                        <text v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</text>
                                    </view>
                                    <view v-if="show_content && is_show('original_price') && !isEmpty(item.min_original_price)" class="text-size-xss flex-row">
                                        <image v-if="form.static_img.length > 0" class="original-price-left" :src="form.static_img[0].url" model="widthFix"></image>
                                        <text :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]"
                                            >{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                            <block v-if="is_show('original_price_unit')">
                                                {{ item.show_original_price_unit }}
                                            </block>
                                        </text>
                                    </view>
                                </view>
                                <view class="flex-row jc-sb align-e">
                                    <view>
                                        <view v-if="show_content" class="flex-row align-c text-size-xss">
                                            <view v-if="is_show('sales_count')" class="pr-5" :style="sold_number_style">已售{{ item.sales_count }}件</view>
                                            <!-- <view v-if="is_show('sales_count')" :class="['pr-5', {'br-r-e': is_show('sales_count') && is_show('4')}]" :style="sold_number_style>已售{{ item.sales_count }}件</view> -->
                                            <!-- <view v-if="is_show('4')" class="pl-5" :style="score_style">评分0</view> -->
                                        </view>
                                    </view>
                                    <view v-if="form.is_shop_show == '1'" class="pr" :data-index="index" @tap.stop="goods_button_event">
                                        <block v-if="form.shop_type == 'text'">
                                            <view class="plr-11 ptb-3 round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                        </block>
                                        <view v-else class="round plr-6 ptb-5" :style="button_gradient">
                                            <iconfont :name="'icon-' + (!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart')" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size * 2 + 'rpx'"></iconfont>
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
                                        <text class="identifying">{{ item.show_price_symbol }}</text
                                        ><text :style="price_style">{{ item.min_price }}</text>
                                        <text v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</text>
                                    </view>
                                    <view v-if="show_content && is_show('original_price') && !isEmpty(item.min_original_price)" class="text-size-xss flex-row">
                                        <image v-if="form.static_img.length > 0" class="original-price-left" :src="form.static_img[0].url" model="widthFix"></image>
                                        <text :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]"
                                            >{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                            <block v-if="is_show('original_price_unit')">
                                                {{ item.show_original_price_unit }}
                                            </block>
                                        </text>
                                    </view>
                                </view>
                                <view v-if="form.is_shop_show == '1'" :data-index="index" @tap.stop="goods_button_event">
                                    <block v-if="form.shop_type == 'text'">
                                        <view class="plr-11 ptb-3 round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                    </block>
                                    <view v-else class="round plr-6 ptb-5" :style="button_gradient">
                                        <iconfont :name="'icon-' + (!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart')" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size * 2 + 'rpx'"></iconfont>
                                    </view>
                                    <view v-if="form.shop_button_effect == '1'" class="cart-badge-icon pa badge-style">
                                        <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
            </block>
            <block v-else>
                <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :style="{ width: '100%', height: new_style.content_outer_height * 2 + 'rpx' }">
                    <swiper-item v-for="(item1, index1) in shop_content_list" :key="index1" class="flex-row" :style="onter_style">
                        <view v-for="(item, index) in item1.split_list" :key="index" class="pr" :class="layout_type" :style="layout_style" :data-value="item.goods_url" @tap="url_event">
                            <block v-if="!isEmpty(item)">
                                <block v-if="!isEmpty(item.new_cover)">
                                    <image-empty :image-src="item.new_cover[0]" :class="'flex-img' + theme" :style="content_img_radius" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                                </block>
                                <block v-else>
                                    <image-empty :image-src="item.images" :class="'flex-img' + theme" :style="content_img_radius" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                                </block>
                            </block>
                            <view class="flex-col flex-1 jc-sb content gap-10" :style="content_style">
                                <view class="flex-col gap-10 top-title">
                                    <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                                    <view v-if="show_content && is_show('plugins_view_icon') && !isEmpty(item.plugins_view_icon_data)" class="flex-row gap-5 align-c">
                                        <view v-for="(icon_data, icon_index) in item.plugins_view_icon_data" :key="icon_index" class="radius text-size-xsss padding-horizontal-xs" :style="{ background: icon_data.bg_color, color: icon_data.color, border: '1rpx solid' + (!isEmpty(icon_data.br_color) ? icon_data.br_color : icon_data.bg_color) }">{{ icon_data.name }}</view>
                                    </view>
                                </view>
                                <view class="flex-row align-c jc-sb">
                                    <view class="flex-row align-c nowrap">
                                        <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="'color:' + new_style.shop_price_color">
                                            <text class="identifying">{{ item.show_price_symbol }}</text
                                            ><text :style="price_style">{{ item.min_price }}</text>
                                            <text v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</text>
                                        </view>
                                        <view v-if="show_content && is_show('original_price') && !isEmpty(item.min_original_price)" class="text-size-xss flex">
                                            <image v-if="form.static_img.length > 0" class="original-price-left" :src="form.static_img[0].url" model="widthFix"></image>
                                            <text :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]"
                                                >{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                <block v-if="is_show('original_price_unit')">
                                                    {{ item.show_original_price_unit }}
                                                </block>
                                            </text>
                                        </view>
                                    </view>
                                    <view v-if="form.is_shop_show == '1'" :data-index="index1" :data-split-index="index" @tap.stop="goods_button_event">
                                        <block v-if="form.shop_type == 'text'">
                                            <view class="plr-11 ptb-3 round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                        </block>
                                        <view v-else class="round plr-6 ptb-5" :style="button_gradient">
                                            <iconfont :name="'icon-' + (!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart')" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size * 2 + 'rpx'"></iconfont>
                                        </view>
                                        <view v-if="form.shop_button_effect == '1'" class="cart-badge-icon pa badge-style">
                                            <component-badge :propNumber="item.user_cart_count || 0"></component-badge>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </swiper>
            </block>
        </view>
        <!-- 商品购买 -->
        <component-goods-buy v-if="is_show_cart" ref="goods_buy" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>

        <!-- 购物车抛物线 -->
        <component-cart-para-curve v-if="is_show_cart" ref="cart_para_curve"></component-cart-para-curve>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, get_math, gradient_handle, padding_computer, radius_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
    import componentBadge from '@/components/badge/badge';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentCartParaCurve from '@/components/cart-para-curve/cart-para-curve';
    export default {
        components: {
            imageEmpty,
            componentBadge,
            componentGoodsBuy,
            componentCartParaCurve,
        },
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
                is_show_cart: false,
                propIsCartParaCurve: true,
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
                list: [],
                content_radius: '', // 圆角设置
                content_img_radius: '', // 图片圆角设置
                content_padding: '', // 内边距设置
                theme: '', // 选择的风格
                content_outer_spacing: '', // 商品间距
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
                shop_content_list: [],
                // 内容样式
                title_style: '',
                price_style: '',
                sold_number_style: '',
                score_style: '',
                button_style: '',
            };
        },
        computed: {
            // 按钮渐变色处理
            button_gradient() {
                return gradient_handle(this.new_style.shop_button_color, '180deg');
            }
        },
        created() {
            this.setData({
                form: this.value.content,
                new_style: this.value.style,
            });
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                let new_list = [];
                // 指定商品并且指定商品数组不为空
                if (!isEmpty(this.form.data_list) && this.form.data_type == '0') {
                    new_list = this.form.data_list.map((item) => ({
                        ...item.data,
                        title: !isEmpty(item.new_title) ? item.new_title : item.data.title,
                        new_cover: item.new_cover,
                    }));
                } else if (!isEmpty(this.form.data_auto_list) && this.form.data_type == '1') {
                    // 筛选商品并且筛选商品数组不为空
                    new_list = this.form.data_auto_list;
                } else {
                    // 为空的时候走默认数据
                    new_list = Array(4).fill(this.default_list);
                }
                // 最外层不同风格下的显示
                this.set_outer_class();
                this.setData({
                    list: new_list,
                    content_radius: radius_computer(this.new_style.shop_radius), // 圆角设置
                    content_img_radius: radius_computer(this.new_style.shop_img_radius), // 图片圆角设置
                    content_padding: padding_computer(this.new_style.shop_padding) + 'box-sizing: border-box;', // 内边距设置
                    theme: this.form.theme, // 选择的风格
                    content_outer_spacing: this.new_style.content_outer_spacing, // 商品间距
                    onter_style: this.form.theme == '6' ? radius_computer(this.new_style.shop_radius) : `gap: ${this.new_style.content_outer_spacing * 2 + 'rpx'};`,
                    // 不同风格下的样式
                    layout_type: this.get_layout_type(),
                    layout_style: this.get_layout_style(),
                    content_style: this.get_content_style(), // 内容区域的样式
                    show_content: ['0', '1', '2'].includes(this.form.theme), // 显示除标题外的其他区域
                    text_line: this.get_text_line(), // 超过多少行隐藏
                    style_container: this.isCommonStyle ? common_styles_computer(this.new_style.common_style) : '', // 公共样式
                    // 内容样式设置
                    title_style: this.trends_config('title'),
                    price_style: this.trends_config('price'),
                    sold_number_style: this.trends_config('sold_number'),
                    score_style: this.trends_config('score'),
                    button_style: this.trends_config('button', 'gradient'),
                    shop_content_list: this.get_shop_content_list(new_list),
                    is_show_cart: this.form.shop_button_effect == '1',
                });
            },
            get_shop_content_list(list) {
                // 深拷贝一下，确保不会出现问题
                const cloneList = JSON.parse(JSON.stringify(list));
                // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
                if (cloneList.length > 0) {
                    // 每页显示的数量
                    const num = this.form.carousel_col;
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
                        class_type = `flex-row bg-white oh`;
                        break;
                    case '1':
                        class_type = `flex-col bg-white oh`;
                        break;
                    case '2':
                        class_type = `flex-col bg-white oh`;
                        break;
                    case '3':
                        class_type = `flex-col bg-white oh`;
                        break;
                    case '4':
                        class_type = `flex-row bg-white oh`;
                        break;
                    case '5':
                        class_type = `flex-col bg-white oh`;
                        break;
                    default:
                        break;
                }
                return class_type;
            },
            get_layout_style() {
                const radius = this.form.theme == '6' ? '' : radius_computer(this.new_style.shop_radius);
                const padding = ['0', '4'].includes(this.form.theme) ? padding_computer(this.new_style.shop_padding) + 'box-sizing: border-box;' : '';
                let size_style = ``;
                if (['1', '4'].includes(this.form.theme)) {
                    size_style = `width: calc((100% - ${this.new_style.content_outer_spacing * 2 + 'rpx'}) / 2);`;
                } else if (this.form.theme == '3') {
                    size_style = `width: calc((100% - ${this.new_style.content_outer_spacing * 4 + 'rpx'}) / 3);`;
                } else if (this.form.theme == '5') {
                    size_style = `width: ${this.get_multicolumn_columns_width()};min-width: ${this.get_multicolumn_columns_width()};height: ${this.new_style.content_outer_height * 2 + 'rpx'}`;
                }
                return `${radius} ${padding} ${size_style}`;
            },
            get_multicolumn_columns_width() {
                const { carousel_col } = this.form;
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (this.new_style.content_outer_spacing * (carousel_col - 1)) / carousel_col;
                return `calc(${100 / carousel_col}% - ${gap * 2}rpx)`;
            },
            get_content_style() {
                const spacing_value = this.new_style.content_spacing;
                let spacing = '';
                if (['0', '4'].includes(this.form.theme)) {
                    spacing = `margin-left: ${spacing_value * 2}rpx;`;
                } else {
                    spacing = padding_computer(this.new_style.shop_padding) + 'box-sizing: border-box;';
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
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color, type) {
                let style = `font-weight:${typeface}; font-size: ${size * 2}rpx;`;
                if (type == 'gradient') {
                    style += this.button_gradient;
                } else {
                    style += `color: ${color};`;
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
            url_event(link) {
                app.globalData.url_event(link);
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
                    index = e.currentTarget.dataset.index || 0;
                    split_index = e.currentTarget.dataset.split_index || 0;
                    goods = this.shop_content_list[index][split_index];
                }
                if (this.form.shop_button_effect == '0') {
                    app.globalData.url_event(goods.goods_url);
                } else {
                    if ((this.$refs.goods_buy || null) != null) {
                        // 开启购物车抛物线效果则展示提示操作
                        let is_success_tips = this.propIsCartParaCurve ? 0 : 1;
                        this.$refs.goods_buy.init(
                            goods,
                            {
                                buy_event_type: 'cart',
                                is_direct_cart: 1,
                                is_success_tips: is_success_tips,
                            },
                            {
                                index: index,
                                split_index: split_index,
                                pos: e,
                            }
                        );
                    }
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
                    goods = new_data[index][split_index];
                }
                goods['user_cart_count'] = parseInt(goods['user_cart_count'] || 0) + parseInt(e.stock);
                if (goods['user_cart_count'] > 99) {
                    goods['user_cart_count'] = '99+';
                }
                if (this.theme == '5') {
                    new_data[index] = goods;
                    this.setData({
                        list: new_data,
                    });
                } else {
                    new_data[index][split_index] = goods;
                    this.setData({
                        shop_content_list: new_data,
                    });
                }
            },
        },
    };
</script>

<style scoped lang="scss">
    .identifying {
        font-size: 18rpx;
    }
    .original-price {
        background-color: #ede2c5;
        border-radius: 0;
        font-size: 20rpx;
        border-bottom-right-radius: 20rpx;
        border-top-right-radius: 20rpx;
        padding: 0 20rpx 0 0;
    }

    .flex-img0 {
        height: auto;
        min-height: 220rpx;
        max-height: 240rpx;
        width: 220rpx;
    }

    .flex-img1 {
        width: 100%;
        height: 360rpx;
    }

    .flex-img2 {
        width: 100%;
        height: 332rpx;
    }

    .flex-img3 {
        width: 100%;
        height: 228rpx;
    }
    .flex-img4 {
        min-width: 140rpx;
        min-height: 140rpx;
        height: 100%;
    }
    .flex-img5 {
        width: 100%;
        min-height: 208rpx;
        height: 100%;
    }
    .plr-11 {
        padding-left: 22rpx;
        padding-right: 22rpx;
    }
    .ptb-3 {
        padding-top: 6rpx;
        padding-bottom: 6rpx;
    }
    .plr-6 {
        padding-left: 12rpx;
        padding-right: 12rpx;
    }
    .ptb-5 {
        padding-top: 10rpx;
        padding-bottom: 10rpx;
    }
    .ptb-15 {
        padding-top: 30rpx;
        padding-bottom: 30rpx;
    }
    .mlr-10 {
        margin-left: 20rpx;
        margin-right: 20rpx;
    }
    .gap-20 {
        gap: 40rpx;
    }
    .original-price-left {
        width: 20rpx;
        height: 28rpx;
    }
    .br-b-e {
        border-bottom: 2rpx solid #eee;
    }
    .badge-style {
        top: -20rpx;
        right: 0;
    }
</style>
