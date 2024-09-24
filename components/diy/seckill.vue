<template>
    <view :style="style">
        <view class="flex-col gap-10">
            <view v-if="form.head_state == '1'" class="seckill-head flex-row align-c jc-sb oh" :style="seckill_head_style">
                <view :class="['flex-row align-c', { 'gap-10': form.theme != '1', 'jc-sb wh-auto': form.theme == '2' }]">
                    <view class="seckill-title">
                        <image-empty v-if="form.title_type == 'image'" :image-src="form.title_src[0]" img_fit="heightFix" error-style="width:42rpx; height: 20rpx;"></image-empty>
                        <span v-else :style="{'color': new_style.title_color, 'font-size': new_style.title_size * 2 + 'rpx', 'line-height': '42rpx', 'font-weight': 600 }">{{ form.title_text }}</span>
                    </view>
                    <view v-if="form.theme == '1'" class="plr-6 cr-white">|</view>
                    <view v-if="intervalId != undefined" class="flex-row align-c gap-4">
                        <span class="text-size-xss" :style="{ 'color': new_style.end_text_color }">{{ seckill_time.time_first_text }}</span>
                        <view class="flex-row gap-3 jc-c align-c" :style="[form.theme == '4' ? time_bg + 'padding: 6rpx 8rpx;border-radius: 22rpx;' : '']">
                            <image v-if="form.theme == '4'" class="seckill-head-icon radius-xs" :src="form.theme_4_static_img[0].url" />
                            <view v-for="(item, index) in time_config" :key="item.key" class="flex-row gap-3 jc-c align-c">
                                <template v-if="form.theme == '4'">
                                    <view class="text-size-xs" :style="{ color: new_style.countdown_color }">{{ item.value }}</view>
                                    <span v-if="[0, 1].includes(index)" class="colon" :style="{ 'color': new_style.countdown_color }">:</span>
                                </template>
                                <template v-else>
                                    <view class="time-config text-size-xs" :style="time_bg + 'color:' + new_style.countdown_color">{{ item.value }}</view>
                                    <span v-if="[0, 1].includes(index)" class="colon" :style="icon_time_check">:</span>
                                </template>
                            </view>
                        </view>
                    </view>
                    <view v-else class="flex-row align-c gap-4">
                        <span class="text-size-xss" :style="{ 'color': new_style.end_text_color }">已结束</span>
                    </view>
                </view>
                <view v-if="form.button_status == '1'" class="flex-row align-c" :style="{ 'color': new_style.head_button_color }" @tap="url_event('/pages/plugins/seckill/index/index')">
                    <span :style="{ 'font-size': new_style.head_button_size * 2 + 'rpx' }">{{ form.button_text }}</span>
                    <iconfont name="icon-arrow-right" :color="new_style.head_button_color"></iconfont>
                </view>
            </view>
            <template v-if="form.shop_style_type != '3'">
                <view class="flex-row flex-wrap wh-auto" :style="{ gap: content_outer_spacing * 2 + 'rpx' }">
                    <view v-for="(item1, index1) in list" :key="index1" class="flex-row wh-auto">
                        <view v-for="(item, index) in item1.split_list" :key="index" :class="layout_type" :style="layout_type_style + content_radius + (form.shop_style_type == '1' ? content_padding : '')" @tap="url_event(item.goods_url)">
                                <template v-if="!isEmpty(item)">
                                    <view class="oh pr" :class="'flex-img' + form.shop_style_type">
                                        <template v-if="!isEmpty(item.new_cover)">
                                            <image-empty :image-src="item.new_cover[0]" :class="'flex-img' + form.shop_style_type" :type_style="content_img_radius" error-style="width:100rpx; height: 100rpx;"></image-empty>
                                        </template>
                                        <template v-else>
                                            <image-empty :image-src="item.images" :class="'flex-img' + form.shop_style_type" :type_style="content_img_radius" error-style="width:100rpx; height: 100rpx;"></image-empty>
                                        </template>
                                        <view v-if="form.seckill_subscript_show == '1'" class="text-size-xs nowrap corner-marker" :style="corner_marker">
                                            <span class="text-line-1">{{ form.subscript_text }}</span>
                                        </view>
                                    </view>
                                </template>
                                <view class="flex-col gap-10 wh-auto flex-1 jc-sb" :style="content_style">
                                    <view class="flex-col gap-10 wh-auto">
                                        <!-- 标题 -->
                                        <view v-if="is_show('title')" :style="title_style" class="text-line-2">{{ item.title }}</view>
                                        <!-- 进度条 -->
                                        <!-- <view v-if="form.shop_style_type == '1'" class="flex-row align-c gap-6">
                                                <view class="re flex-1">
                                                    <view class="slide-bottom" :style="`background: ${new_style.progress_bg_color}`"></view>
                                                    <view class="slide-top" :style="` width: 51%; ${slide_active_color}`">
                                                        <view class="slide-top-icon round" :style="`background: ${new_style.progress_button_color}`"><icon name="a-miaosha" :color="new_style.progress_button_icon_color" size="9"></icon></view>
                                                    </view>
                                                </view>
                                                <span class="text-size-xss" :style="`color: ${new_style.progress_text_color}`">已抢51%</span>
                                            </view> -->
                                    </view>
                                    <view class="flex-row align-e gap-10 jc-sb">
                                        <view class="flex-col gap-5">
                                            <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="{ color: new_style.shop_price_color }">
                                                <span v-if="form.shop_style_type == '1'" class="text-size-xss pr-4">秒杀价</span>
                                                <span class="identifying">{{ item.show_price_symbol }}</span
                                                ><span :style="price_style">{{ item.min_price }}</span>
                                                <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                            </view>
                                            <view v-if="is_show('original_price') && !isEmpty(item.min_original_price)" class="size-11 flex" :style="{ color: new_style.original_price_color }">
                                                <span class="original-price text-line-1 flex-1"
                                                    >{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                    <template v-if="is_show('original_price_unit')">
                                                        {{ item.show_original_price_unit }}
                                                    </template>
                                                </span>
                                            </view>
                                        </view>
                                        <view v-if="form.is_shop_show == '1'">
                                            <template v-if="form.shop_type == 'text'">
                                                <view class="plr-11 ptb-3 round cr-white" :style="button_style + 'color:' + new_style.shop_button_text_color">{{ form.shop_button_text }}</view>
                                            </template>
                                            <template v-else>
                                                <icon class="round plr-6 ptb-5" :name="!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                            </template>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
            </template>
            <template v-else>
                <swiper circular="false" :autoplay="new_style.is_roll == '1'" :next-margin="new_style.rolling_fashion == 'translation' ? '-' + content_outer_spacing_magin : '0rpx'" :interval="new_style.interval_time * 1000" :duration="500" :display-multiple-items="slides_per_group" :style="{ height: new_style.content_outer_height * 2 + 'rpx' }">
                    <swiper-item v-for="(item1, index1) in list" :key="index1" :class="{'flex-row': new_style.rolling_fashion != 'translation'}" :style="new_style.rolling_fashion != 'translation' ? 'gap:' + content_outer_spacing_magin : ''">
                        <view v-for="(item, index) in item1.split_list" :key="index" :class="layout_type" :style="content_radius + (form.shop_style_type == '1' ? content_padding : '') + (new_style.rolling_fashion != 'translation' ? layout_type_style : 'margin-right:' + content_outer_spacing_magin + ';height: 100%;whith: 100%')" @tap="url_event(item.goods_url)">
                            <template v-if="!isEmpty(item)">
                                <view class="oh pr wh-auto ht-auto">
                                    <template v-if="!isEmpty(item.new_cover)">
                                        <image-empty :image-src="item.new_cover[0]" :class="'flex-img' + form.shop_style_type" :type_style="content_img_radius" error-style="width:100rpx; height: 100rpx;"></image-empty>
                                    </template>
                                    <template v-else>
                                        <image-empty :image-src="item.images" :class="'flex-img' + form.shop_style_type" :type_style="content_img_radius" error-style="width:100rpx; height: 100rpx;"></image-empty>
                                    </template>
                                    <view v-if="form.seckill_subscript_show == '1'" class="text-size-xs nowrap corner-marker" :style="corner_marker">
                                        <span class="text-line-1">{{ form.subscript_text }}</span>
                                    </view>
                                </view>
                            </template>
                            <view class="flex-col gap-10 wh-auto flex-1 jc-sb" :style="content_style">
                                <view class="flex-col gap-10 wh-auto">
                                    <!-- 标题 -->
                                    <view v-if="is_show('title')" :style="title_style" class="text-line-2">{{ item.title }}</view>
                                    <!-- 进度条 -->
                                    <!-- <view v-if="form.shop_style_type == '1'" class="flex-row align-c gap-6">
                                        <view class="re flex-1">
                                            <view class="slide-bottom" :style="{ 'background': new_style.progress_bg_color }"></view>
                                            <view class="slide-top" :style="'width: 51%;' + slide_active_color ">
                                                <view class="slide-top-icon round" :style="{ 'background': new_style.progress_button_color}"><icon name="a-miaosha" :color="new_style.progress_button_icon_color" size="9"></icon></view>
                                            </view>
                                        </view>
                                        <span class="text-size-xss" :style="{ 'color': new_style.progress_text_color }">已抢51%</span>
                                    </view> -->
                                </view>
                                <view class="flex-row align-e gap-10 jc-sb">
                                    <view class="flex-col gap-5">
                                        <view v-if="is_show('price') && !isEmpty(item.min_price)" class="num" :style="{ color: new_style.shop_price_color }">
                                            <span v-if="form.shop_style_type == '1'" class="text-size-xss pr-4">秒杀价</span>
                                            <span class="identifying">{{ item.show_price_symbol }}</span
                                            ><span :style="price_style">{{ item.min_price }}</span>
                                            <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                        </view>
                                        <view v-if="is_show('original_price') && !isEmpty(item.min_original_price)" class="size-11 flex" :style="{ color: new_style.original_price_color }">
                                            <span class="original-price text-line-1 flex-1"
                                                >{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                <template v-if="is_show('original_price_unit')">
                                                    {{ item.show_original_price_unit }}
                                                </template>
                                            </span>
                                        </view>
                                    </view>
                                    <view v-if="form.is_shop_show == '1'">
                                        <template v-if="form.shop_type == 'text'">
                                            <view class="plr-11 ptb-3 round cr-white" :style="button_style + 'color:' + new_style.shop_button_text_color">{{ form.shop_button_text }}</view>
                                        </template>
                                        <template v-else>
                                            <icon class="round plr-6 ptb-5" :name="!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                        </template>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </swiper>
            </template>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { background_computer, common_styles_computer, get_math, gradient_computer, gradient_handle, padding_computer, radius_computer, isEmpty } from '@/common/js/common/common.js';
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
    export default {
        components: {
            imageEmpty,
        },
        props: {
            value: {
                type: Object,
                default: () => {
                    return {};
                },
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
                },
                time_bg: '',
                slide_active_color: '',
                seckill_head_style: '',
                style: '',
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
                layout_type: '',
                layout_type_style: '',
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
            };
        },
        computed: {
            icon_time_check() {
                return `${this.time_bg};line-height: 1;background-clip: text;-webkit-background-clip: text;-webkit-text-fill-color: transparent;`;
            },
        },
        created() {
            this.setData({
                form: this.value.content,
                new_style: this.value.style,
            });
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
                const data = this.form.data;
                let new_list = [];
                if (data && !isEmpty(data.current)) {
                    if (!isEmpty(data.current.goods)) {
                        new_list = data.current.goods;
                    } else {
                        new_list = Array(4).fill(this.default_list);
                    }
                    const { status, time_first_text } = data.current.time;
                    this.setData({
                        seckill_time: {
                            endTime: data.current.time_end,
                            startTime: data.current.time_start,
                            status: status,
                            time_first_text: time_first_text,
                        }
                    });
                    // 先执行一次倒计时，后续的等待倒计时执行
                    setTimeout(() => {
                        this.updateCountdown();
                    }, 0);
                    this.setData({
                        intervalId: setInterval(this.updateCountdown, 1000),
                    })
                } else {
                    new_list = Array(4).fill(this.default_list);
                }
                this.setData({
                    time_bg: this.get_time_bg(),
                    slide_active_color: this.get_slide_active_color(),
                    seckill_head_style: this.get_seckill_head_style(),
                    style: common_styles_computer(this.new_style.common_style) + 'box-sizing: border-box;',
                    content_outer_spacing: this.new_style.content_outer_spacing,
                    content_outer_spacing_magin: this.new_style.content_outer_spacing * 2 + 'rpx',
                    content_radius: radius_computer(this.new_style.shop_radius),
                    content_padding: padding_computer(this.new_style.shop_padding) + 'box-sizing: border-box;',
                    content_style: this.get_content_style(),
                    layout_type: this.get_layout_type(),
                    layout_type_style: this.get_layout_type_style(),
                    content_img_radius: radius_computer(this.new_style.shop_img_radius),
                    corner_marker: this.get_corner_marker(),
                    slides_per_group: this.new_style.rolling_fashion == 'translation' ? this.form.carousel_col : 1,
                    // 内容样式设置
                    title_style: this.trends_config('title'),
                    price_style: this.trends_config('price'),
                    button_style: this.trends_config('button', 'gradient'),
                    list: this.get_shop_content_list(new_list),
                });
            },
            get_shop_content_list(list) {
                // 深拷贝一下，确保不会出现问题
                const cloneList = JSON.parse(JSON.stringify(list));
                if (this.new_style.rolling_fashion != 'translation') {
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
                } else {
                    // 存储数据显示
                    let nav_list = [];
                    cloneList.forEach(item => {
                        nav_list.push({
                            split_list: [ item ],
                        });
                    })
                    return nav_list;
                }
            },
            get_time_bg() {
                const { countdown_bg_color_list, countdown_direction } = this.new_style;
                // 渐变
                const gradient = { color_list: countdown_bg_color_list, direction: countdown_direction };
                return gradient_computer(gradient);
            },
            get_slide_active_color() {
                const { progress_actived_color_list, progress_actived_direction } = this.new_style;
                // 渐变
                const gradient = { color_list: progress_actived_color_list, direction: progress_actived_direction };
                return gradient_computer(gradient);
            },
            get_seckill_head_style() {
                let style = ``;
                const { header_background_img, header_background_img_style, header_background_color_list, header_background_direction } = this.new_style;
                // 渐变
                const gradient = { color_list: header_background_color_list, direction: header_background_direction };
                // 背景图
                const back = { background_img: header_background_img, background_img_style: header_background_img_style };
                style += gradient_computer(gradient) + background_computer(back);
                return style;
            },
            updateCountdown() {
                const now = new Date();
                let endTime = this.seckill_time.endTime.replace(/-/g, '/');
                if (this.seckill_time.status === 0) {
                    endTime = this.seckill_time.startTime.replace(/-/g, '/');
                }
                const distance = new Date(endTime).getTime() - now.getTime();
                // 如果倒计时结束，显示结束信息
                if (distance <= 1000) {
                    clearInterval(this.intervalId);
                    // 如果是待开始状态，则显示开始倒计时，并且在结束的时候根据结束时候再执行一个定时器
                    if (this.seckill_time.status === 0) {
                        this.setData({
                            seckill_time: {
                               endTime: this.seckill_time.current.time_end,
                               startTime: this.seckill_time.current.time_start,
                               status: 1,
                               time_first_text: '距结束',
                            }
                        })
                        // 先执行一次倒计时，后续的等待倒计时执行
                        setTimeout(() => {
                            this.updateCountdown();
                        }, 0);
                        this.setData({
                            intervalId: setInterval(this.updateCountdown, 1000),
                        })
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
            get_content_style() {
                const spacing_value = this.new_style.content_spacing;
                let spacing = '';
                if (this.form.shop_style_type == '1') {
                    spacing = `margin-left: ${spacing_value * 2}rpx;`;
                } else {
                    spacing = padding_computer(this.new_style.shop_padding) + 'box-sizing: border-box;';
                }
                return `${spacing}`;
            },
            get_layout_type() {
                let class_type = '';
                switch (this.form.shop_style_type) {
                    case '1':
                        class_type = `flex-row bg-white oh`;
                        break;
                    case '2':
                        class_type = `flex-col bg-white oh`;
                        break;
                    case '3':
                        class_type = `flex-col bg-white oh`;
                        break;
                    default:
                        break;
                }
                return class_type;
            },
            get_layout_type_style() {
                return ['1', '2'].includes(this.form.shop_style_type) ? `height: 100%;width: ${ this.get_multicolumn_columns_width() };min-width: ${ this.get_multicolumn_columns_width() };` : `height: ${ this.new_style.content_outer_height * 2 }rpx;width: ${ this.get_multicolumn_columns_width() };min-width: ${ this.get_multicolumn_columns_width() };`;
            },
            // 根据传递的参数，从对象中取值
            trends_config(key, type) {
                return this.style_config(this.new_style[`shop_${key}_typeface`], this.new_style[`shop_${key}_size`], this.new_style[`shop_${key}_color`], type);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color, type) {
                let style = `font-weight:${typeface}; font-size: ${size * 2}rpx;`;
                if (type == 'gradient') {
                    style += this.button_gradient();
                } else {
                    style += `color: ${color};`;
                }
                return style;
            },
            // 按钮渐变色处理
            button_gradient() {
                return gradient_handle(this.new_style.shop_button_color, '180deg');
            },
            get_multicolumn_columns_width() {
                let model_number = this.form.carousel_col;
                if (this.form.shop_style_type == '1') {
                    model_number = 1;
                } else if (this.form.shop_style_type == '2') {
                    model_number = 2;
                }
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (this.new_style.content_outer_spacing * (model_number - 1)) / model_number;
                return `calc(${100 / model_number }% - ${ gap * 2 }rpx)`;
            },
            is_show(index) {
                return this.form.is_show.includes(index);
            },
            get_corner_marker() {
                const { seckill_subscript_location, shop_img_radius, seckill_subscript_bg_color, seckill_subscript_text_color } = this.new_style;
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
                if (!isEmpty(link)) {
                    app.globalData.url_open(link);
                }
            },
        },
    };
</script>

<style scoped lang="scss">
    :deep(.el-image) {
        .image-slot img {
            width: 5rem;
            height: 5rem;
        }
    }
    .identifying {
        font-size: 18rpx;
    }
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
        top: -2rpx;
    }
    .flex-img1 {
        min-height: 220rpx;
        max-height: 240rpx;
        width: 220rpx;
    }
    .flex-img2 {
        width: 100%;
        height: 360rpx;
    }
    .flex-img3 {
        background: #f4fcff;
        width: 100%;
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
    .pr-4 {
        margin-right: 8rpx;
    }
    .size-11 {
        font-size: 22rpx;
    }
    .gap-20 {
        gap: 40rpx;
    }
    .gap-3 {
        gap: 6rpx;
    }
    .corner-marker {
        position: absolute;
        padding: 2rpx 20rpx;
        max-width: 100%;
    }
</style>