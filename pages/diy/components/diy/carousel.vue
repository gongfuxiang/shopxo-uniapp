<template>
    <view class="pr" :style="style_container + swiper_bg_style">
        <view class="pa top-0 wh-auto ht-auto" :style="swiper_bg_img_style"></view>
        <view class="pr" :style="style_img_container + (!isEmpty(swiper_bg_img_style) ? swiper_bg_img_style_null : '')">
            <swiper circular="true" :autoplay="form.is_roll == '1'" :interval="form.interval_time * 1000" :display-multiple-items="slides_per_group" :duration="500" :style="'height:' + swiper_height + '; '+ outer_img_style" :previous-margin="previousMargin" :next-margin="nextMargin" @change="slideChange">
                <block v-if="form.carousel_type == 'card'">
                    <swiper-item v-for="(item, index) in new_list" :key="index">
                        <view class="flex-row align-c wt-auto ht-auto pr" :data-value="item.carousel_link.page" @tap="url_open">
                            <view class="swiper-item" :style="img_style" :class="['scale-defalt', { 'scale-1': animationData === index }]">
                                <view class="wh-auto ht-auto">
                                    <image-empty :propImageSrc="item.carousel_img[0]" :propStyle="img_style" :propImgFit="img_fit" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                </view>
                            </view>
                            <view v-if="new_style.video_is_show == '1' && item.carousel_video.length > 0" :class="{ 'x-middle': new_style.video_location == 'center', 'right-0': new_style.video_location == 'flex-end' }" class="video-class pa oh" :style="{'bottom': new_style.video_bottom * 2 + 'rpx'}">
                                <view class="flex-row gap-5 align-c wh-auto ht-auto" :style="video_style" :data-value="item.carousel_video" @tap.stop="video_play">
                                    <block v-if="new_style.video_type == 'img'">
                                        <image-empty :propImageSrc="new_style.video_img[0]" :propStyle="video_img_style" propImgFit="scaleToFill" propErrorStyle="width: 28rpx;height: 28rpx;"></image-empty>
                                    </block>
                                    <block v-else>
                                        <iconfont :name="!isEmpty(new_style.video_icon_class) ? 'icon-' + new_style.video_icon_class : 'icon-bofang'" :size="video_icon_size" :color="new_style.video_icon_color" propContainerDisplay="flex"></iconfont>
                                    </block>
                                    <text v-if="!isEmpty(item.video_title)" :style="{ color: new_style.video_title_color, 'font-size': new_style.video_title_size * 2 + 'rpx', 'text-wrap': 'nowrap' }">{{ item.video_title }}</text>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </block>
                <block v-else>
                    <swiper-item v-for="(item, index) in new_list" :key="index">
                        <view class="ht-auto pr" :style="['oneDragOne', 'twoDragOne'].includes(form.carousel_type) ? 'padding-right:' + new_style.image_spacing * 2 + 'rpx;' : ''" :data-value="item.carousel_link.page" @tap="url_open">
                            <view class="wh-auto ht-auto" :style="img_style">
                                <image-empty :propImageSrc="item.carousel_img[0]" :propStyle="img_style" :propImgFit="img_fit" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                            </view>
                            <view v-if="new_style.video_is_show == '1' && item.carousel_video.length > 0" :class="{ 'x-middle': new_style.video_location == 'center', 'right-0': new_style.video_location == 'flex-end' }" class="video-class pa oh" :style="{'bottom': new_style.video_bottom * 2 + 'rpx'}">
                                <view class="flex-row gap-5 align-c wh-auto ht-auto" :style="video_style" :data-value="item.carousel_video" @tap.stop="video_play">
                                    <block v-if="new_style.video_type == 'img'">
                                        <image-empty :propImageSrc="new_style.video_img[0]" :propStyle="video_img_style" propImgFit="scaleToFill" propErrorStyle="width: 28rpx;height: 28rpx;"></image-empty>
                                    </block>
                                    <block v-else>
                                        <iconfont :name="!isEmpty(new_style.video_icon_class) ? 'icon-' + new_style.video_icon_class : 'icon-bofang'" :size="video_icon_size" :color="new_style.video_icon_color" propContainerDisplay="flex"></iconfont>
                                    </block>
                                    <text v-if="!isEmpty(item.video_title)" :style="{ color: new_style.video_title_color, 'font-size': new_style.video_title_size * 2 + 'rpx', 'text-wrap': 'nowrap' }">{{ item.video_title }}</text>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </block>
            </swiper>
            <view v-if="new_style.is_show == '1'" :class="['left', 'right'].includes(new_style.indicator_new_location) ? 'indicator_up_down_location' : 'indicator_about_location'" :style="indicator_location_style">
                <template v-if="new_style.indicator_style == 'num'">
                    <view :style="indicator_style" class="dot-item">
                        <text :style="{ color: new_style.actived_color }">{{ actived_index + 1 }}</text>
                        <text>/{{ form.carousel_list.length }}</text>
                    </view>
                </template>
                <template v-else>
                    <view v-for="(item, index2) in form.carousel_list" :key="index2" :style="indicator_style + (actived_index == index2 ? 'background:' + new_style.actived_color : '')" class="dot-item" />
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, radius_computer, isEmpty, gradient_computer, padding_computer, get_indicator_location_style, get_indicator_style, background_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            imageEmpty,
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propIsCommon: {
                type: Boolean,
                default: true,
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
            propOuterContainerPadding: {
                type: Number,
                default: 0,
            }
        },
        data() {
            return {
                form: {},
                new_style: {},
                // 通用样式显示
                style_container: '',
                style_img_container: '',
                // 图片的设置
                img_style: '',
                outer_img_style: '',
                // 指示器的样式
                indicator_style: '',
                seat_list: [],
                new_list: [],
                // 指示器选中的位置
                actived_index: 0,
                interval_types: '',
                img_fit: '',
                dot_style: '',
                video_style: '',
                video_img_style: '',
                video_icon_size: '',
                popup_width: '0rpx',
                popup_height: '0rpx',
                // 样式二的处理
                animation: '',
                animationData: 0,
                previousMargin: '0rpx',
                nextMargin: '0rpx',
                slides_per_group: 1,
                // hackReset: true,
                // 轮播图的高度
                swiper_height: 50,
                // 轮播时的背景样式
                swiper_bg_style: '',
                swiper_bg_img_style: '',
                swiper_bg_img_style_null: `background-image: url('')`
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
            init() {
                const new_form = this.propValue.content;
                const new_style = this.propValue.style;
                // 获取当前手机的宽度
                const { windowWidth } = uni.getSystemInfoSync();
                // 将80%的宽度分成16份
                const block = (windowWidth * 0.8) / 16;

                const { common_style, actived_color } = new_style;
                // scaleToFill 对应 fill aspectFit 对应 contain  aspectFill 对应 cover
                let fit = '';
                if (new_form.img_fit == 'contain') {
                    fit = 'aspectFit';
                } else if (new_form.img_fit == 'fill') {
                    fit = 'scaleToFill';
                } else if (new_form.img_fit == 'cover') {
                    fit = 'aspectFill';
                }
                const { margin_left, margin_right, padding_left, padding_right } = new_style.common_style;
                const width = sys_width - margin_left - margin_right - padding_left - padding_right - this.propOuterContainerPadding;
                const scale = width / 390;
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    seat_list: this.get_seat_list(new_form),
                    new_list: new_form.carousel_list.concat(this.get_seat_list(new_form)),
                    popup_width: block * 16 * 2 + 'rpx', // 视频的宽度，依照16:9比例来算
                    popup_height: block * 9 * 2 + 'rpx',  // 视频的高度
                    style_container: this.propIsCommon ? common_styles_computer(common_style) : '', // 公共样式显示
                    style_img_container: this.propIsCommon ? common_img_computer(common_style, this.propIndex) : '', // 公共样式显示
                    img_style: new_form.carousel_type == 'inherit' ? '' : radius_computer(new_style), // 图片的设置
                    outer_img_style: new_form.carousel_type == 'inherit' ? radius_computer(new_style) + 'overflow: hidden;' : '',
                    indicator_style: get_indicator_style(new_style), // 指示器的样式
                    indicator_location_style: get_indicator_location_style(new_style),
                    dot_style: `bottom: ${ new_style.indicator_bottom * scale }px;`, // 指示器位置
                    video_img_style: `width:${(new_style?.video_image_width || 14) * 2 }rpx;height:${ (new_style?.video_image_height || 14) * 2 }rpx;`,
                    video_icon_size: `${ (new_style?.video_icon_size || 14) * 2 }rpx`,
                    img_fit: fit, // 图片风格 默认为aspectFill
                    video_style: this.get_video_style(new_style), // 视频播放按钮显示逻辑   
                    swiper_height: new_form.height * scale + 'px', // 轮播图高度
                    swiper_bg_style: this.get_swiper_bg_style(new_form, 0),
                    swiper_bg_img_style: this.get_swiper_bg_img_style(new_form, 0),
                });
                
                // 风格二显示逻辑
                if (new_form.carousel_type == 'card') {
                    // this.$nextTick(() => {
                        this.setData({
                            previousMargin: '41px',
                            nextMargin: '41px',
                            animationData: 0,
                        });
                    // });
                } else if (new_form.carousel_type != 'inherit') {
                    // 风格三，四显示逻辑
                    // this.$nextTick(() => {
                        this.setData({
                            nextMargin: '50px',
                            slides_per_group: new_form.carousel_type == 'twoDragOne' ? 2 : 1,
                        });
                    // });
                }
            },
            get_swiper_bg_style(form, actived_index) {
                if (!this.propIsCommon) {
                    return '';
                }
                const style = form?.carousel_list?.[actived_index]?.style;
                if (style && !isEmpty(style.color_list)) {
                    const color_list = style.color_list;
                    const list = color_list.filter((item) => !isEmpty(item.color));
                    if (list.length > 0) {
                        try {
                            return gradient_computer(style);
                        } catch (error) {
                            return '';
                        }
                    }
                    return '';
                }
                return '';
            },
            get_swiper_bg_img_style(form, actived_index) {
                if (!this.propIsCommon) {
                    return '';
                }
                const { carousel_img, style = {} } = form?.carousel_list[actived_index] || {};
                // 如果是自定义的图片 判断图片是否存在
                if (!isEmpty(carousel_img) && style?.background_type == 'carousel') {
                    // 如果是使用轮播图，判断轮播图是否存在
                    const data = {
                        background_img: carousel_img,
                        background_img_style: style?.background_img_style || '2',
                    }
                    return background_computer(data) + (style.is_background_img_blur == '1' ? `filter: blur(14px);opacity: 0.6;` : '');
                } else if (!isEmpty(style?.background_img)) {
                    return background_computer(style) + (style.is_background_img_blur == '1' ? `filter: blur(14px);opacity: 0.6;` : '');
                }
                return '';
            },
            get_seat_list(form) {
                if (form.carousel_list.length > 3) {
                    return [];
                } else {
                    let seat_list = [];
                    const list = JSON.parse(JSON.stringify(form.carousel_list));
                    switch (list.length) {
                        case 1:
                            seat_list = [...list, ...list, ...list];
                            break;
                        case 2:
                            seat_list.push(...list);
                            break;
                        case 3:
                            seat_list.push(...list);
                            break;
                        default:
                            break;
                    }
                    return seat_list;
                }
            },
            slideChange(e) {
                let actived_index = e.detail.current;
                if (e.detail.current > this.form.carousel_list.length - 1) {
                    const seat_length = this.seat_list.length;
                    if (this.form.carousel_list.length > 1) {
                        actived_index = actived_index - seat_length;
                    } else {
                        actived_index = 0;
                    }
                }
                if (!this.propIsCommon) {
                    this.$emit('slideChange', actived_index);
                }
                this.setData({
                    animationData: e.detail.current,
                    actived_index: actived_index,
                    swiper_bg_style: this.get_swiper_bg_style(this.form, actived_index),
                    swiper_bg_img_style: this.get_swiper_bg_img_style(this.form, actived_index),
                });
            },
            get_video_style(new_style) {
                const { video_radius, video_color_list, video_direction, video_title_color, video_padding } = new_style;
                let style = ``;
                if (!isEmpty(video_radius)) {
                    style += radius_computer(video_radius);
                }
                const data = {
                    color_list: video_color_list,
                    direction: video_direction,
                };
                style += gradient_computer(data) + padding_computer(video_padding) + `color: ${video_title_color};box-sizing: border-box;`;
                return style;
            },
            video_play(e) {
                const list = e.currentTarget.dataset.value;
                if (!isEmpty(list)) {
                    this.$emit('onVideoPlay', list[0].url, this.popup_width, this.popup_height);
                }
            },
            url_open(link) {
                app.globalData.url_event(link);
            },
        },
    };
</script>

<style scoped lang="scss">
    .dot-center {
        left: 50%;
        transform: translateX(-50%);
    }
    .dot-right {
        right: 0;
    }
    .dot {
        z-index: 1;
        padding-left: 20rpx;
        padding-right: 20rpx;
        .dot-item {
            margin: 0 6rpx;
        }
    }
    .swiper-container {
        display: flex;
        align-items: center;
    }

    .swiper-item {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin-left: auto;
        margin-right: auto;
        height: 90%;
        width: 90%;
        text-align: center;
    }

    .scale-defalt {
        position: relative;
        border-radius: 20rpx;
        transform: scale(1);
        transition: -webkit-transform 400ms linear, transform 400ms linear;
        transform-origin: 50% 50% 0px;
        &.scale-1 {
            transform: scale(1.1);
        }
    }
    .video-class {
        padding-right: 20rpx;
        padding-left: 20rpx;
    }
    .x-middle {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
