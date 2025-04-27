<template>
    <view v-if="!isEmpty(list) || !isEmpty(sckill_list)" :style="style_container">
        <view :style="style_img_container">
            <view class="flex-col gap-10">
                <view v-if="form.head_state == '1'" class="oh" :style="seckill_head_style">
                    <view class="seckill-head flex-row align-c jc-sb" :style="seckill_head_img_style">
                        <view :class="['flex-row align-c', { 'gap-10': form.theme != '1', 'jc-sb wh-auto': form.theme == '2' }]">
                            <view class="seckill-title">
                                <image-empty v-if="form.title_type == 'image'" :propImageSrc="form.title_src[0]" propImgFit="heightFix" propErrorStyle="width:42rpx; height: 20rpx;"></image-empty>
                                <text v-else :style="{ color: new_style.title_color, 'font-size': new_style.title_size * 2 + 'rpx', 'line-height': '42rpx', 'font-weight': 600 }">{{ form.title_text }}</text>
                            </view>
                            <view v-if="form.theme == '1'" class="padding-horizontal-sm cr-white">|</view>
                            <view v-if="intervalId != undefined" class="flex-row align-c gap-4">
                                <text class="text-size-xss" :style="{ color: new_style.end_text_color }">{{ seckill_time.time_first_text }}</text>
                                <view class="flex-row gap-3 jc-c align-c" :style="form.theme == '4' ? time_bg + 'padding: 6rpx 8rpx;border-radius: 22rpx;' : ''">
                                    <image v-if="form.theme == '4' && form.theme_4_static_img.length > 0" class="seckill-head-icon radius-xs" :src="form.theme_4_static_img[0].url" />
                                    <view v-for="(item, index) in time_config" :key="item.key" class="flex-row gap-3 jc-c align-c">
                                        <template v-if="form.theme == '4'">
                                            <view class="text-size-xs flex-row jc-c align-c" :style="'min-width:50rpx;color:' + new_style.countdown_color">{{ item.value }}</view>
                                            <text v-if="[0, 1].includes(index)" class="colon" :style="{ color: new_style.countdown_color }">:</text>
                                        </template>
                                        <template v-else>
                                            <view class="time-config text-size-xs flex-row jc-c align-c" :style="time_bg + 'min-width:50rpx;color:' + new_style.countdown_color">{{ item.value }}</view>
                                            <text v-if="[0, 1].includes(index)" class="colon" :style="icon_time_check">:</text>
                                        </template>
                                    </view>
                                </view>
                            </view>
                            <view v-else class="flex-row align-c gap-4">
                                <text class="text-size-xss" :style="{ color: new_style.end_text_color }">已结束</text>
                            </view>
                        </view>
                        <view v-if="form.button_status == '1'" class="flex-row align-c" :style="{ color: new_style.head_button_color }" :data-value="'/pages/plugins/seckill/index/index'" @tap="url_event">
                            <text :style="{ 'font-size': new_style.head_button_size * 2 + 'rpx' }">{{ form.button_text }}</text>
                            <iconfont name="icon-arrow-right" :color="new_style.head_button_color" propContainerDisplay="flex"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="oh" :style="shop_container">
                    <view class="oh" :style="shop_img_container">
                        <template v-if="form.shop_style_type != '3'">
                            <view class="flex-row flex-wrap wh-auto ht-auto" :style="{ gap: content_outer_spacing }">
                                <view v-for="(item, index) in sckill_list" :key="index"  :style="layout_style + layout_type_style + content_radius" :data-value="item.goods_url" @tap="url_event">
                                    <view :class="layout_type" :style="layout_img_style">
                                        <template v-if="!isEmpty(item)">
                                            <view class="oh pr">
                                                <view v-if="!isEmpty(item.new_cover)" :style="img_size">
                                                    <image-empty :propImageSrc="item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width:100rpx; height: 100rpx;"></image-empty>
                                                </view>
                                                <view v-else :style="img_size">
                                                    <image-empty :propImageSrc="item.images" :propStyle="content_img_radius" propErrorStyle="width:100rpx; height: 100rpx;"></image-empty>
                                                </view>
                                                <!-- 角标 -->
                                                <subscriptIndex :propValue="propValue"></subscriptIndex>
                                            </view>
                                        </template>
                                        <view v-if="is_show('title') || is_show('simple_desc') || is_show('price') || is_show('original_price') || form.is_shop_show == '1'" class="flex-col gap-10 wh-auto flex-1 jc-sb oh" :style="content_style">
                                            <view class="flex-col gap-10 wh-auto">
                                                <!-- 标题 -->
                                                <view v-if="is_show('title') || is_show('simple_desc')" class="flex-col" :style="{'gap': new_style.title_simple_desc_spacing * 2 + 'rpx'  }">
                                                    <view v-if="is_show('title')" :style="title_style" class="text-line-2">{{ item.title }}</view>
                                                    <view v-if="is_show('simple_desc')" class="text-line-1" :style="simple_desc">{{ item.simple_desc }}</view>
                                                </view>
                                                <!-- 进度条 -->
                                                <!-- <view v-if="form.shop_style_type == '1'" class="flex-row align-c gap-6">
                                                        <view class="re flex-1">
                                                            <view class="slide-bottom" :style="`background: ${new_style.progress_bg_color}`"></view>
                                                            <view class="slide-top" :style="` width: 51%; ${slide_active_color}`">
                                                                <view class="slide-top-icon round" :style="`background: ${new_style.progress_button_color}`"><icon name="a-miaosha" :color="new_style.progress_button_icon_color" size="9"></icon></view>
                                                            </view>
                                                        </view>
                                                        <text class="text-size-xss" :style="`color: ${new_style.progress_text_color}`">已抢51%</text>
                                                    </view> -->
                                            </view>
                                            <view class="flex-row align-e gap-10 jc-sb">
                                                <view class="flex-col gap-5">
                                                    <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="{ color: new_style.shop_price_color }">
                                                        <text v-if="form.shop_style_type == '1'" class="text-size-xss pr-4">{{ form.seckill_pirce_title ?  form.seckill_pirce_title : ''}}</text>
                                                        <text :style="price_symbol">{{ item.show_price_symbol }}</text>
                                                        <text :style="price_style">{{ item.min_price }}</text>
                                                        <text v-if="is_show('price_unit')" :style="price_unit">{{ item.show_price_unit }}</text>
                                                    </view>
                                                    <view v-if="is_show('original_price') && !isEmpty(item.min_original_price)" class="size-11 flex" :style="original_price">
                                                        <text class="original-price text-line-1 flex-1">
                                                            {{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                            <template v-if="is_show('original_price_unit')">
                                                                {{ item.show_original_price_unit }}
                                                            </template>
                                                        </text>
                                                    </view>
                                                </view>
                                                <view v-if="form.is_shop_show == '1'">
                                                    <template v-if="form.shop_type == 'text'">
                                                        <view class="plr-11 padding-vertical-xs round" :style="button_style + 'color:' + new_style.shop_button_text_color">{{ form.shop_button_text }}</view>
                                                    </template>
                                                    <view v-else class="round padding-horizontal-sm ptb-5" :styles="button_gradient">
                                                        <iconfont :name="'icon-' + (!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart')" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </template>
                        <template v-else>
                            <swiper circular="false" :autoplay="new_style.is_roll == '1'" :next-margin="new_style.rolling_fashion == 'translation' ? '-' + content_outer_spacing_magin : '0rpx'" :interval="new_style.interval_time * 1000" :duration="500" :display-multiple-items="slides_per_group" :style="{ height: new_style.content_outer_height * 2 + 'rpx' }">
                                <swiper-item v-for="(item1, index1) in list" :key="index1">
                                    <view class="wh-auto ht-auto" :class="{ 'flex-row': new_style.rolling_fashion != 'translation' }" :style="new_style.rolling_fashion != 'translation' ? 'gap:' + content_outer_spacing_magin : ''">
                                        <view v-for="(item, index) in item1.split_list" :key="index" :style="layout_style + content_radius + (new_style.rolling_fashion != 'translation' ? layout_type_style : 'margin-right:' + content_outer_spacing_magin + ';height: 100%;whith: 100%')" :data-value="item.goods_url" @tap="url_event">
                                            <template v-if="!isEmpty(item)">
                                                <view :class="layout_type" :style="layout_img_style">
                                                    <template v-if="!isEmpty(item)">
                                                        <view class="oh pr wh-auto ht-auto">
                                                            <view v-if="!isEmpty(item.new_cover)" class="wh-auto ht-auto">
                                                                <image-empty :propImageSrc="item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width:100rpx; height: 100rpx;"></image-empty>
                                                            </view>
                                                            <view v-else class="wh-auto ht-auto">
                                                                <image-empty :propImageSrc="item.images" :propStyle="content_img_radius" propErrorStyle="width:100rpx; height: 100rpx;"></image-empty>
                                                            </view>
                                                            <!-- 角标 -->
                                                            <subscriptIndex :propValue="propValue"></subscriptIndex>
                                                        </view>
                                                    </template>
                                                    <view v-if="is_show('title') || is_show('simple_desc') || is_show('price') || is_show('original_price') || form.is_shop_show == '1'"  class="flex-col gap-10 wh-auto flex-1 jc-sb" :style="content_style">
                                                        <view class="flex-col gap-10 wh-auto">
                                                            <!-- 标题 -->
                                                            <view v-if="is_show('title') || is_show('simple_desc')" class="flex-col" :style="{'gap': new_style.title_simple_desc_spacing * 2 + 'rpx'  }">
                                                                <view v-if="is_show('title')" :style="title_style" class="text-line-2">{{ item.title }}</view>
                                                                <view v-if="is_show('simple_desc')" class="text-line-1" :style="simple_desc">{{ item.simple_desc }}</view>
                                                            </view>
                                                            <!-- 进度条 -->
                                                            <!-- <view v-if="form.shop_style_type == '1'" class="flex-row align-c gap-6">
                                                            <view class="re flex-1">
                                                                <view class="slide-bottom" :style="{ 'background': new_style.progress_bg_color }"></view>
                                                                <view class="slide-top" :style="'width: 51%;' + slide_active_color ">
                                                                    <view class="slide-top-icon round" :style="{ 'background': new_style.progress_button_color}"><icon name="a-miaosha" :color="new_style.progress_button_icon_color" size="9"></icon></view>
                                                                </view>
                                                            </view>
                                                            <text class="text-size-xss" :style="{ 'color': new_style.progress_text_color }">已抢51%</text>
                                                        </view> -->
                                                        </view>
                                                        <view class="flex-row align-e gap-10 jc-sb">
                                                            <view class="flex-col gap-5">
                                                                <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="{ color: new_style.shop_price_color }">
                                                                    <text v-if="form.shop_style_type == '1'" class="text-size-xss pr-4">{{ form.seckill_pirce_title ? form.seckill_pirce_title : ''}}</text>
                                                                    <text :style="price_symbol">{{ item.show_price_symbol }}</text>
                                                                    <text :style="price_style">{{ item.min_price }}</text>
                                                                    <text v-if="is_show('price_unit')" :style="price_unit">{{ item.show_price_unit }}</text>
                                                                </view>
                                                                <view v-if="is_show('original_price') && !isEmpty(item.min_original_price)" class="size-11 flex" :style="original_price">
                                                                    <text class="original-price text-line-1 flex-1">
                                                                        {{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                                        <template v-if="is_show('original_price_unit')">
                                                                            {{ item.show_original_price_unit }}
                                                                        </template>
                                                                    </text>
                                                                </view>
                                                            </view>
                                                            <view v-if="form.is_shop_show == '1'">
                                                                <template v-if="form.shop_type == 'text'">
                                                                    <view class="plr-11 padding-vertical-xs round" :style="button_style + 'color:' + new_style.shop_button_text_color">{{ form.shop_button_text }}</view>
                                                                </template>
                                                                <view v-else class="round padding-horizontal-sm ptb-5" :styles="button_gradient">
                                                                    <iconfont :name="'icon-' + (!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart')" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
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
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { background_computer, common_styles_computer, common_img_computer, gradient_computer, gradient_handle, padding_computer, radius_computer, isEmpty, margin_computer, box_shadow_computer, border_computer, old_margin, old_border_and_box_shadow, get_swiper_list } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    import subscriptIndex from '@/pages/diy/components/diy/modules/subscript/index.vue';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            imageEmpty,
            subscriptIndex
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propKey: {
                type: [String,Number],
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
                new_style: {},
                time_bg: '',
                slide_active_color: '',
                seckill_head_style: '',
                style_container: '',
                style_img_container: '',
                time_config: [
                    { key: 'hour', value: '00' },
                    { key: 'minute', value: '00' },
                    { key: 'second', value: '00' },
                ],
                seckill_time: {},
                // 商品间距
                content_outer_spacing: '',
                content_outer_spacing_magin: '',
                // 圆角设置
                content_radius: '',
                // 内边距设置
                content_padding: '',
                // 内容区域的样式
                content_style: '',
                // 不同风格下的样式
                img_size: '',
                layout_type: '',
                layout_type_style: '',
                layout_img_style: '',
                layout_style: '',
                //图片圆角设置
                content_img_radius: '',
                //角标设置
                corner_marker: '',
                // 定时器
                intervalId: null,
                // 数据存储
                list: [],
                // 一屏显示的数量
                slides_per_group: '',
                // 内容样式
                title_style: '',
                price_style: '',
                button_style: '',
                simple_desc: '',
                price_symbol: '',
                price_unit: '',
                original_price: '',
                shop_container: '',
                shop_img_container: '',
                // 商品列表
                sckill_list: [],
            };
        },
        computed: {
            icon_time_check() {
                return `${this.time_bg};line-height: 1;background-clip: text;-webkit-background-clip: text;-webkit-text-fill-color: transparent;`;
            },
            // 按钮渐变色处理
            button_gradient() {
                return gradient_handle(this.new_style.shop_button_color, '180deg');
            },
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
        beforeDestroy() {
            // 如果有定时任务执行，在离开的时候清空掉定时任务
            if (!isEmpty(this.intervalId)) {
                clearInterval(this.intervalId);
            }
        },
        methods: {
            isEmpty,
            init() {
                const new_form = this.propValue.content;
                const new_style = this.propValue.style;
                const data = new_form.data;
                let new_list = [];
                if (data && !isEmpty(data.current) && !isEmpty(data.current.time)) {
                    if (!isEmpty(data.current.goods)) {
                        new_list = data.current.goods;
                    }
                    const { status = '1', time_first_text = '已结束' } = data?.current?.time || {};
                    this.setData({
                        seckill_time: {
                            time_end_number: Number(data.current.time_end_number + '000'),
                            time_start_number: Number(data.current.time_start_number + '000'),
                            status: status,
                            time_first_text: time_first_text,
                        },
                    });
                    // 先执行一次倒计时，后续的等待倒计时执行
                    setTimeout(() => {
                        this.updateCountdown();
                    }, 0);
                    this.setData({
                        intervalId: setInterval(this.updateCountdown, 1000),
                    });
                }
                // 默认数据
                const product_style_list = [
                    { name: '单列', value: '1', width: 110, height: 120 },
                    { name: '双列', value: '2', width: 180, height: 180 },
                    { name: '横向滑动', value: '3', width: 0, height: 0 },
                ];
                const scale = sys_width / 390;
                let img_style = ``;
                if (['1'].includes(new_form.shop_style_type)) {
                    // 图片宽度
                    if (typeof new_style.content_img_width == 'number') {
                        img_style += `width: ${ new_style.content_img_width * scale }px;`;
                    } else {
                        const list = product_style_list.filter(item => item.value == new_form.shop_style_type);
                        if (list.length > 0) {
                            img_style += `width: ${ list[0].width * scale }px;`;
                        } else {
                            img_style += 'width: auto;';
                        }
                    }
                }
                if (!['3'].includes(new_form.shop_style_type)) {
                    // 图片宽度
                    if (typeof new_style.content_img_height == 'number') {
                        img_style += `height: ${ new_style.content_img_height * scale }px;`;
                    } else {
                        const list = product_style_list.filter(item => item.value == new_form.shop_style_type);
                        if (list.length > 0) {
                            img_style += `height: ${ list[0].height * scale }px;`;
                        } else {
                            img_style += 'height: auto;';
                        }
                    }
                }
                const shop_style = new_style?.shop_style || old_border_and_box_shadow;
                this.setData({
                    form: this.propValue.content,
                    new_style: this.propValue.style,
                    time_bg: this.get_time_bg(new_style),
                    slide_active_color: this.get_slide_active_color(new_style),
                    seckill_head_style: this.get_seckill_head_style(new_style, '1'),
                    seckill_head_img_style: this.get_seckill_head_style(new_style, '2'),
                    style_container: common_styles_computer(new_style.common_style) + 'box-sizing: border-box;',
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    content_outer_spacing: new_style.content_outer_spacing + 'px',
                    content_outer_spacing_magin: new_style.content_outer_spacing * 2 + 'rpx',
                    content_radius: radius_computer(new_style.shop_radius),
                    content_padding: padding_computer(new_style.shop_padding) + 'box-sizing: border-box;',
                    content_style: this.get_content_style(new_style, new_form),
                    layout_type: new_form.shop_style_type == '1' ? 'flex-row wh-auto ht-auto oh' : 'flex-col wh-auto ht-auto oh',
                    layout_img_style: this.get_layout_img_style(new_style, new_form),
                    layout_type_style: this.get_layout_type_style(new_style, new_form),
                    layout_style: gradient_handle(new_style.shop_color_list, new_style.shop_direction) + margin_computer(new_style?.shop_margin || old_margin) + border_computer(shop_style) + box_shadow_computer(shop_style),
                    content_img_radius: radius_computer(new_style.shop_img_radius),
                    corner_marker: this.get_corner_marker(new_style),
                    slides_per_group: new_style.rolling_fashion == 'translation' ? new_form.carousel_col : 1,
                    // 内容样式设置
                    title_style: this.trends_config(new_style, 'title', 'title'),
                    price_style: this.trends_config(new_style, 'price'),
                    button_style: this.trends_config(new_style, 'button', 'gradient'),
                    simple_desc: this.trends_config(new_style, 'simple_desc', 'desc'),
                    price_symbol: !isEmpty(new_style.shop_price_symbol_color) ? this.trends_config(new_style, 'price_symbol') : 'font-size: 18rpx;color: #EA3323;' ,
                    price_unit: !isEmpty(new_style.shop_price_unit_color) ? this.trends_config(new_style, 'price_unit') : 'font-size: 18rpx;color: #EA3323;',
                    original_price: this.trends_config(new_style, 'original_price'),
                    list: get_swiper_list(new_list, new_form.carousel_col, new_style.rolling_fashion),
                    shop_container: this.get_shop_container(new_style),
                    shop_img_container: this.get_shop_img_container(new_style),
                    sckill_list: new_list,
                    img_size: img_style,
                });
            },
            // 商品内容区域显示
            get_shop_container(new_style){
                const { shop_content_color_list = [], shop_content_direction = '', shop_content_radius = old_radius, shop_content_margin = old_margin, shop_content = old_border_and_box_shadow } = new_style;
                // 渐变
                const gradient = { color_list: shop_content_color_list, direction: shop_content_direction };
                return gradient_computer(gradient) + radius_computer(shop_content_radius) + margin_computer(shop_content_margin) + border_computer(shop_content) + box_shadow_computer(shop_content);
            },
            get_shop_img_container (new_style) {
                const { shop_content_background_img_style = '2', shop_content_background_img = [], shop_content_padding = old_padding } = new_style;
                // 背景图
                const back = { background_img: shop_content_background_img, background_img_style: shop_content_background_img_style };
                return padding_computer(shop_content_padding) + background_computer(back);
            },
            get_time_bg(new_style) {
                const { countdown_bg_color_list, countdown_direction } = new_style;
                // 渐变
                const gradient = { color_list: countdown_bg_color_list, direction: countdown_direction };
                return gradient_computer(gradient);
            },
            get_slide_active_color(new_style) {
                const { progress_actived_color_list, progress_actived_direction } = new_style;
                // 渐变
                const gradient = { color_list: progress_actived_color_list, direction: progress_actived_direction };
                return gradient_computer(gradient);
            },
            get_seckill_head_style(new_style, num) {
                const { header_background_img, header_background_img_style, header_background_color_list, header_background_direction, seckill_head_padding, seckill_head_radius, seckill_head_margin = old_margin, seckill_head_style = old_border_and_box_shadow } = new_style;
                // 渐变
                const gradient = { color_list: header_background_color_list, direction: header_background_direction };
                // 背景图
                const back = { background_img: header_background_img, background_img_style: header_background_img_style };
                if (num == '1') {
                    return gradient_computer(gradient) + radius_computer(seckill_head_radius) + margin_computer(seckill_head_margin) + border_computer(seckill_head_style) + box_shadow_computer(seckill_head_style);
                } else {
                    // 秒杀头部内间距设置， 没有的时候默认15px
                    const padding = !isEmpty(seckill_head_padding) ? seckill_head_padding : { padding: 0, padding_top: 15, padding_bottom: 15, padding_left: 13, padding_right: 13};
                    return background_computer(back) + padding_computer(padding) + 'box-sizing: border-box;';
                }
            },
            updateCountdown() {
                let time_end_number = this.seckill_time.time_end_number;
                if (this.seckill_time.status === 0) {
                    time_end_number = this.seckill_time.time_start_number;
                }
                // 先获取秒杀结束时间和当前时间的差值
                const distance = time_end_number - new Date().getTime();
                // 如果倒计时结束，显示结束信息
                if (distance <= 1000) {
                    clearInterval(this.intervalId);
                    // 如果是待开始状态，则显示开始倒计时，并且在结束的时候根据结束时候再执行一个定时器
                    if (this.seckill_time.status === 0) {
                        this.setData({
                            seckill_time: {
                                time_end_number: this.seckill_time.time_end_number,
                                time_start_number: this.seckill_time.time_start_number,
                                status: 1,
                                time_first_text: '距结束',
                            },
                        });
                        // 先执行一次倒计时，后续的等待倒计时执行
                        setTimeout(() => {
                            this.updateCountdown();
                        }, 0);
                        this.setData({
                            intervalId: setInterval(this.updateCountdown, 1000),
                        });
                    }
                    return;
                }
                // 计算时间
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                this.time_config.forEach((item) => {
                    if (item.key == 'hour') {
                        item.value = hours < 10 ? '0' + hours : hours.toString();
                    } else if (item.key == 'minute') {
                        item.value = minutes < 10 ? '0' + minutes : minutes.toString();
                    } else if (item.key == 'second') {
                        item.value = seconds < 10 ? '0' + seconds : seconds.toString();
                    }
                });
            },
            get_content_style(new_style, form) {
                const spacing_value = new_style.content_spacing;
                let spacing = '';
                if (form.shop_style_type == '1') {
                    spacing = `margin-left: ${spacing_value * 2}rpx;`;
                } else {
                    spacing = padding_computer(new_style.shop_padding) + 'box-sizing: border-box;';
                }
                return `${spacing}`;
            },
            get_layout_type_style(new_style, form) {
                return ['1', '2'].includes(form.shop_style_type) ? `height: 100%;width: ${this.get_multicolumn_columns_width(new_style, form)};min-width: ${this.get_multicolumn_columns_width(new_style, form)};` : `height: ${new_style.content_outer_height * 2}rpx;width: ${this.get_multicolumn_columns_width(new_style, form)};min-width: ${this.get_multicolumn_columns_width(new_style, form)};`;
            },
            get_layout_img_style(new_style, form) {
                const padding = ['1'].includes(form.shop_style_type) ? padding_computer(new_style.shop_padding) + 'box-sizing: border-box;' : '';
                const data = {
                    background_img_style: new_style.shop_background_img_style,
                    background_img: new_style.shop_background_img,
                }
                return `${padding} ${ background_computer(data) }`;
            },
            // 根据传递的参数，从对象中取值
            trends_config(new_style, key, type) {
                return this.style_config(new_style[`shop_${key}_typeface`], new_style[`shop_${key}_size`], new_style[`shop_${key}_color`], type, new_style);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color, type, new_style) {
                let style = `font-weight:${typeface}; font-size: ${size * 2}rpx;`;
                if (type == 'gradient') {
                    style += gradient_handle(new_style.shop_button_color, '180deg');
                } else if (type == 'title') {
                    style += `line-height: ${size > 0 ? (size + 3) * 2 : 0}rpx;height: ${size > 0 ? (size + 3) * 4 : 0}rpx;color: ${color};`;
                } else if (type == 'desc') {
                    style += `line-height: ${size * 2}rpx;height: ${size * 2}rpx;color: ${color};`;
                } else {
                    style += `color: ${color};`;
                }
                return style;
            },
            get_multicolumn_columns_width(new_style, form) {
                let model_number = form.carousel_col;
                if (form.shop_style_type == '1') {
                    model_number = 1;
                } else if (form.shop_style_type == '2') {
                    model_number = 2;
                }
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (new_style.content_outer_spacing * (model_number - 1)) / model_number;
                return `calc(${100 / model_number}% - ${gap}px)`;
            },
            is_show(index) {
                return this.form.is_show.includes(index);
            },
            get_corner_marker(new_style) {
                const { seckill_subscript_location, shop_img_radius, seckill_subscript_bg_color, seckill_subscript_text_color } = new_style;
                let location = `background: ${seckill_subscript_bg_color};color: ${seckill_subscript_text_color};`;
                // 圆角根据图片的圆角来计算 对角线是同样的圆角
                if (seckill_subscript_location == 'top-left') {
                    location += `top: 0;left: 0;border-radius: ${shop_img_radius.radius_top_left * 2}rpx 0 ${shop_img_radius.radius_top_left * 2}rpx 0;`;
                } else if (seckill_subscript_location == 'top-right') {
                    location += `top: 0;right: 0;border-radius: 0 ${shop_img_radius.radius_top_right * 2}rpx 0 ${shop_img_radius.radius_top_right * 2}rpx;`;
                } else if (seckill_subscript_location == 'bottom-left') {
                    location += `bottom: 0;left: 0;border-radius: 0 ${shop_img_radius.radius_bottom_left * 2}rpx 0 ${shop_img_radius.radius_bottom_left * 2}rpx;`;
                } else if (seckill_subscript_location == 'bottom-right') {
                    location += `bottom: 0;right: 0;border-radius: ${shop_img_radius.radius_bottom_right * 2}rpx 0 ${shop_img_radius.radius_bottom_right * 2}rpx 0;`;
                }
                return location;
            },
            // 跳转链接
            url_event(link) {
                app.globalData.url_event(link);
            },
        },
    };
</script>

<style scoped lang="scss">
    .seckill-head {
        padding: 30rpx 26rpx;
        width: 100%;
        height: 102rpx;
        border-radius: 16rpx 16rpx 0 0;
        box-sizing: border-box;
        .seckill-title {
            width: auto;
            height: 42rpx;
        }
        .time-config {
            padding: 2rpx 10rpx;
            box-sizing: border-box;
            line-height: 34rpx;
            border-radius: 8rpx;
        }
    }
    .seckill-head-icon {
        width: 32rpx;
        height: 32rpx;
    }
    .colon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 33rpx;
        top: -2rpx;
    }
    .slide-bottom {
        height: 20rpx;
        border-radius: 10rpx;
        background: red;
    }
    .slide-top {
        position: absolute;
        height: 20rpx;
        top: 0;
        left: 0;
        border-radius: 10rpx;
        .slide-top-icon {
            position: absolute;
            top: -6rpx;
            right: 0;
            width: 32rpx;
            height: 32rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .original-price {
        text-decoration-line: line-through;
    }
    .size-11 {
        font-size: 22rpx;
    }
</style>
