<template>
    <view :style="style">
        <view class="flex-col gap-10">
            <view v-if="form.head_state == '1'" class="seckill-head flex-row align-c jc-sb oh" :style="seckill_head_style">
                <view :class="['flex-row align-c', { 'gap-10': form.theme != '1', 'jc-sb wh-auto': form.theme == '2' }]">
                    <view class="seckill-title">
                        <image-empty v-if="form.topic_type == 'image'" v-model="form.topic_src[0]" error-img-style="width:42rpx; height: 20rpx;"></image-empty>
                        <span v-else :style="{'color': new_style.title_color, 'font-size': new_style.title_size * 2 + 'rpx', 'line-height': 42rpx, 'font-weight': 600 }">{{ form.topic_text }}</span>
                    </view>
                    <view v-if="form.theme == '1'" class="pl-6 pr-6 cr-f">|</view>
                    <view v-if="intervalId != undefined" class="flex-row align-c gap-4">
                        <span class="size-10" :style="{ color: new_style.end_text_color }">{{ seckill_time.time_first_text }}</span>
                        <view class="flex-row gap-3 jc-c align-c" :style="[form.theme == '4' ? time_bg + 'padding: 6rpx 8rpx;border-radius: 22rpx;' : '']">
                            <img v-if="form.theme == '4'" class="seckill-head-icon radius-xs" :src="new_url" />
                            <template v-for="(item, index) in time_config" :key="item.key">
                                <template v-if="form.theme == '4'">
                                    <view class="size-12" :style="{ color: new_style.countdown_color }">{{ item.value }}</view>
                                    <span v-if="[0, 1].includes(index)" class="colon" :style="{ color: new_style.countdown_color }">:</span>
                                </template>
                                <template v-else>
                                    <view class="time-config size-12" :style="time_bg + 'color:' + new_style.countdown_color">{{ item.value }}</view>
                                    <span v-if="[0, 1].includes(index)" class="colon" :style="icon_time_check()">:</span>
                                </template>
                            </template>
                        </view>
                    </view>
                    <view v-else class="flex-row align-c gap-4">
                        <span class="size-10" :style="{ color: new_style.end_text_color }">已结束</span>
                    </view>
                </view>
                <view v-if="form.button_status == '1'" class="flex-row align-c" :style="{ color: new_style.head_button_color }">
                    <span :style="{ 'font-size': new_style.head_button_size * 2 + 'rpx' }">{{ form.button_text }}</span>
                    <el-icon class="iconfont icon-arrow-right" :color="new_style.head_button_color"></el-icon>
                </view>
            </view>
            <template v-if="form.shop_style_type != '3'">
                <view class="flex-row flex-wrap" :style="{ gap: content_outer_spacing * 2 + 'rpx' }">
                    <view v-for="(item, index) in list" :key="index" :class="layout_type" :style="content_radius + (form.shop_style_type == '1' ? content_padding : '')">
                        <template v-if="!isEmpty(item)">
                            <view class="oh pr" :class="'flex-img' + form.shop_style_type">
                                <template v-if="!isEmpty(item.new_cover)">
                                    <image-empty v-model="item.new_cover[0]" :class="'flex-img' + form.shop_style_type" :style="content_img_radius"></image-empty>
                                </template>
                                <template v-else>
                                    <image-empty v-model="item.images" :class="'flex-img' + form.shop_style_type" :style="content_img_radius"></image-empty>
                                </template>
                                <view v-if="form.seckill_subscript_show == '1'" class="size-12 nowrap corner-marker" :style="corner_marker">
                                    <span class="text-line-1">{{ form.subscript_text }}</span>
                                </view>
                            </view>
                        </template>
                        <view class="flex-col gap-10 wh-auto flex-1 jc-sb" :style="content_style">
                            <view class="flex-col gap-10 wh-auto">
                                <!-- 标题 -->
                                <view v-if="is_show('title')" :style="trends_config('title')" class="text-line-2">{{ item.title }}</view>
                                <!-- 进度条 -->
                                <!-- <view v-if="form.shop_style_type == '1'" class="flex-row align-c gap-6">
                                        <view class="re flex-1">
                                            <view class="slide-bottom" :style="`background: ${new_style.progress_bg_color}`"></view>
                                            <view class="slide-top" :style="` width: 51%; ${slide_active_color}`">
                                                <view class="slide-top-icon round" :style="`background: ${new_style.progress_button_color}`"><icon name="a-miaosha" :color="new_style.progress_button_icon_color" size="9"></icon></view>
                                            </view>
                                        </view>
                                        <span class="size-10" :style="`color: ${new_style.progress_text_color}`">已抢51%</span>
                                    </view> -->
                            </view>
                            <view class="flex-row align-e gap-10 jc-sb">
                                <view class="flex-col gap-5">
                                    <view v-if="is_show('price')" class="num" :style="{ color: new_style.shop_price_color }">
                                        <span v-if="form.shop_style_type == '1'" class="size-10 pr-4">秒杀价</span>
                                        <span class="identifying">{{ item.show_price_symbol }}</span
                                        ><span :style="trends_config('price')">{{ item.min_price }}</span>
                                        <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                    </view>
                                    <view v-if="is_show('original_price')" class="size-11 flex" :style="{ color: new_style.original_price_color }">
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
                                        <view class="plr-11 ptb-3 round cr-f" :style="trends_config('button', 'gradient') + 'color:' + new_style.shop_button_text_color">{{ form.shop_button_text }}</view>
                                    </template>
                                    <template v-else>
                                        <icon class="round plr-6 ptb-5" :name="!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                    </template>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else>
                <swiper :key="carouselKey" class="w flex-row" direction="horizontal" :loop="true" :autoplay="autoplay" :slides-per-view="form.carousel_col" :slides-per-group="slides_per_group" :allow-touch-move="false" :space-between="content_outer_spacing" :pause-on-mouse-enter="true" :modules="modules">
                    <swiper-slide v-for="(item, index) in list" :key="index" :class="layout_type" :style="content_radius + (form.shop_style_type == '1' ? content_padding : '')">
                        <template v-if="!isEmpty(item)">
                            <view class="oh pr wh-auto ht-auto">
                                <template v-if="!isEmpty(item.new_cover)">
                                    <image-empty v-model="item.new_cover[0]" :class="'flex-img' + form.shop_style_type" :style="content_img_radius"></image-empty>
                                </template>
                                <template v-else>
                                    <image-empty v-model="item.images" :class="'flex-img' + form.shop_style_type" :style="content_img_radius"></image-empty>
                                </template>
                                <view v-if="form.seckill_subscript_show == '1'" class="size-12 nowrap corner-marker" :style="corner_marker">
                                    <span class="text-line-1">{{ form.subscript_text }}</span>
                                </view>
                            </view>
                        </template>
                        <view class="flex-col gap-10 wh-auto flex-1 jc-sb" :style="content_style">
                            <view class="flex-col gap-10 wh-auto">
                                <!-- 标题 -->
                                <view v-if="is_show('title')" :style="trends_config('title')" class="text-line-2">{{ item.title }}</view>
                                <!-- 进度条 -->
                                <!-- <view v-if="form.shop_style_type == '1'" class="flex-row align-c gap-6">
                                    <view class="re flex-1">
                                        <view class="slide-bottom" :style="{ 'background': new_style.progress_bg_color }"></view>
                                        <view class="slide-top" :style="'width: 51%;' + slide_active_color ">
                                            <view class="slide-top-icon round" :style="{ 'background': new_style.progress_button_color}"><icon name="a-miaosha" :color="new_style.progress_button_icon_color" size="9"></icon></view>
                                        </view>
                                    </view>
                                    <span class="size-10" :style="{ 'color': new_style.progress_text_color }">已抢51%</span>
                                </view> -->
                            </view>
                            <view class="flex-row align-e gap-10 jc-sb">
                                <view class="flex-col gap-5">
                                    <view v-if="is_show('price')" class="num" :style="{ color: new_style.shop_price_color }">
                                        <span v-if="form.shop_style_type == '1'" class="size-10 pr-4">秒杀价</span>
                                        <span class="identifying">{{ item.show_price_symbol }}</span
                                        ><span :style="trends_config('price')">{{ item.min_price }}</span>
                                        <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                    </view>
                                    <view v-if="is_show('original_price')" class="size-11 flex" :style="{ color: new_style.original_price_color }">
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
                                        <view class="plr-11 ptb-3 round cr-f" :style="trends_config('button', 'gradient') + 'color:' + new_style.shop_button_text_color">{{ form.shop_button_text }}</view>
                                    </template>
                                    <template v-else>
                                        <icon class="round plr-6 ptb-5" :name="!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                    </template>
                                </view>
                            </view>
                        </view>
                    </swiper-slide>
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
                // 圆角设置
                content_radius: '',
                // 内边距设置
                content_padding: '',
                // 内容区域的样式
                content_style: '',
                // 不同风格下的样式
                layout_type: '',
                //容器宽度
                multicolumn_columns_width: '',
                //容器高度
                multicolumn_columns_height: '',
                //图片圆角设置
                content_img_radius: '',
                //角标设置
                corner_marker: '',
            };
        },
        computed: {
            icon_time_check() {
                return `${time_bg.value};line-height: 1;background-clip: text;-webkit-background-clip: text;-webkit-text-fill-color: transparent;`;
            },
        },
        created() {
            this.setData({
                form: this.value.content,
                new_style: this.value.style,
            });
            this.init();
        },
        methods: {
            init() {
                this.setData({
                    time_bg: this.get_time_bg(),
                    slide_active_color: this.get_slide_active_color(),
                    seckill_head_style: this.get_seckill_head_style(),
                    style: common_styles_computer(this.new_style.common_style),
                    content_outer_spacing: this.new_style.content_outer_spacing,
                    content_radius: radius_computer(this.new_style.shop_radius),
                    content_padding: padding_computer(this.new_style.shop_padding),
                    content_style: this.get_content_style(),
                    layout_type: this.get_layout_type(),
                    multicolumn_columns_width: this.get_multicolumn_columns_width(),
                    multicolumn_columns_height: this.new_style.content_outer_height * 2 + 'rpx',
                    content_img_radius: radius_computer(this.new_style.shop_img_radius),
                    corner_marker: this.get_corner_marker(),
                });
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
                let endTime = this.seckill_time.endTime;
                if (this.seckill_time.status === 0) {
                    endTime = this.seckill_time.startTime;
                }
                const distance = new Date(endTime).getTime() - now.getTime();
                // 如果倒计时结束，显示结束信息
                if (distance <= 1000) {
                    clearInterval(intervalId.value);
                    // 如果是待开始状态，则显示开始倒计时，并且在结束的时候根据结束时候再执行一个定时器
                    if (this.seckill_time.status === 0) {
                        this.seckill_time.status = 1;
                        this.seckill_time.time_first_text = '距结束';
                        // 先执行一次倒计时，后续的等待倒计时执行
                        setTimeout(() => {
                            this.updateCountdown();
                        }, 0);
                        intervalId.value = setInterval(updateCountdown, 1000);
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
                    spacing = content_padding.value;
                }
                return `${spacing}`;
            },
            get_layout_type() {
                let class_type = '';
                switch (this.form.shop_style_type) {
                    case '1':
                        class_type = `flex-row bg-f oh multicolumn-columns`;
                        break;
                    case '2':
                        class_type = `flex-col bg-f oh multicolumn-columns`;
                        break;
                    case '3':
                        class_type = `flex-col bg-f oh roll-columns`;
                        break;
                    default:
                        break;
                }
                return class_type;
            },
            // 根据传递的参数，从对象中取值
            trends_config(key, type) {
                return style_config(this.new_style[`shop_${key}_typeface`], this.new_style[`shop_${key}_size`], this.new_style[`shop_${key}_color`], type);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color, type) {
                let style = `font-weight:${typeface}; font-size: ${size * 2}rpx;`;
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
            get_multicolumn_columns_width() {
                const { carousel_col } = toRefs(this.form);
                let model_number = carousel_col.value;
                if (this.form.shop_style_type == '1') {
                    model_number = 1;
                } else if (this.form.shop_style_type == '2') {
                    model_number = 2;
                }
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (this.new_style.content_outer_spacing * (model_number - 1)) / model_number;
                return `calc(${100 / model_number}% - ${gap * 2}rpx)`;
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
        font-size: 0.9rem;
    }
    .seckill-head {
        padding: 1.5rem 1.3rem;
        width: 100%;
        height: 5.1rem;
        border-radius: 0.8rem 0.8rem 0 0;
        .seckill-title {
            height: 2.1rem;
        }
        .time-config {
            padding: 0.1rem 0.5rem;
            line-height: 1.7rem;
            border-radius: 0.4rem;
        }
    }
    .seckill-head-icon {
        width: 1.6rem;
        height: 1.6rem;
    }
    .colon {
        position: relative;
        top: -0.1rem;
    }
    .multicolumn-columns {
        height: 100%;
        width: v-bind(multicolumn_columns_width) !important;
        min-width: v-bind(multicolumn_columns_width) !important;
    }
    .flex-img1 {
        min-height: 11rem;
        max-height: 12rem;
        width: 11rem;
    }
    .flex-img2 {
        width: 100%;
        height: 18rem;
    }
    .flex-img3 {
        background: #f4fcff;
        width: 100%;
    }
    .slide-bottom {
        height: 1rem;
        border-radius: 0.5rem;
        background: red;
    }
    .slide-top {
        position: absolute;
        height: 1rem;
        top: 0;
        left: 0;
        border-radius: 0.5rem;
        .slide-top-icon {
            position: absolute;
            top: -0.3rem;
            right: 0;
            width: 1.6rem;
            height: 1.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .original-price {
        text-decoration-line: line-through;
    }
    .roll-columns {
        height: v-bind(multicolumn_columns_height);
    }
    .corner-marker {
        position: absolute;
        padding: 0.1rem 1rem;
        max-width: 100%;
    }
</style>