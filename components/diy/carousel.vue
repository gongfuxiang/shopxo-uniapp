<template>
    <view class="pr" :style="style_container">
        <view class="pr" :style="style_img_container">
            <swiper circular="true" :autoplay="form.is_roll == '1'" :interval="form.interval_time * 1000" :display-multiple-items="slides_per_group" :duration="500" :style="{ height: new_style.height * 2 + 'rpx' }" :previous-margin="previousMargin" :next-margin="nextMargin" @change="slideChange">
                <block v-if="form.carousel_type == 'card'">
                    <swiper-item v-for="(item, index) in new_list" :key="index" class="flex-row align-c" :data-value="item.carousel_link.page" @tap="url_open">
                        <view class="swiper-item" :style="img_style" :class="['scale-defalt', { 'scale-1': animationData === index }]">
                            <imageEmpty :propImageSrc="item.carousel_img[0]" :propStyle="img_style" :propImgFit="img_fit" propErrorStyle="width: 100rpx;height: 100rpx;"></imageEmpty>
                        </view>
                        <view v-if="new_style.video_is_show == '1' && item.carousel_video.length > 0" :class="{ 'x-middle': new_style.video_location == 'center', 'right-0': new_style.video_location == 'flex-end' }" class="video-class flex-row pa gap-10 align-c oh" :style="video_style" :data-value="item.carousel_video" @tap.stop="video_play">
                            <block v-if="new_style.video_type == 'img'">
                                <view class="video_img">
                                    <imageEmpty :propImageSrc="new_style.video_img[0]" propImgFit="aspectFill" propErrorStyle="width: 28rpx;height: 28rpx;"></imageEmpty>
                                </view>
                            </block>
                            <block v-else>
                                <iconfont :name="!isEmpty(new_style.video_icon_class) ? 'icon-' + new_style.video_icon_class : 'icon-bofang'" size="'28rpx'" :color="new_style.video_icon_color" propContainerDisplay="flex"></iconfont>
                            </block>
                            <text v-if="!isEmpty(item.video_title)" :style="{ color: new_style.video_title_color, 'font-size': new_style.video_title_size * 2 + 'rpx', 'text-wrap': 'nowrap' }">{{ item.video_title }}</text>
                        </view>
                    </swiper-item>
                </block>
                <block v-else>
                    <swiper-item v-for="(item, index) in new_list" :key="index" :style="['oneDragOne', 'twoDragOne'].includes(form.carousel_type) ? 'padding-right:' + new_style.image_spacing * 2 + 'rpx;' : ''" :data-value="item.carousel_link.page" @tap="url_open">
                        <view class="wh-auto ht-auto pr" :style="img_style">
                            <imageEmpty :propImageSrc="item.carousel_img[0]" :propStyle="img_style" :propImgFit="img_fit" propErrorStyle="width: 100rpx;height: 100rpx;"></imageEmpty>
                        </view>
                        <view v-if="new_style.video_is_show == '1' && item.carousel_video.length > 0" :class="{ 'x-middle': new_style.video_location == 'center', 'right-0': new_style.video_location == 'flex-end' }" class="video-class flex-row pa gap-10 align-c oh" :style="video_style" :data-value="item.carousel_video" @tap.stop="video_play">
                            <block v-if="new_style.video_type == 'img'">
                                <view class="video_img">
                                    <imageEmpty :propImageSrc="new_style.video_img[0]" propImgFit="aspectFill" propErrorStyle="width: 28rpx;height: 28rpx;"></imageEmpty>
                                </view>
                            </block>
                            <block v-else>
                                <iconfont :name="!isEmpty(new_style.video_icon_class) ? 'icon-' + new_style.video_icon_class : 'icon-bofang'" size="'28rpx'" :color="new_style.video_icon_color" propContainerDisplay="flex"></iconfont>
                            </block>
                            <text v-if="!isEmpty(item.video_title)" :style="{ color: new_style.video_title_color, 'font-size': new_style.video_title_size * 2 + 'rpx', 'text-wrap': 'nowrap' }">{{ item.video_title }}</text>
                        </view>
                    </swiper-item>
                </block>
            </swiper>
            <view v-if="new_style.is_show == '1'" :class="{ 'dot-center': new_style.indicator_location == 'center', 'dot-right': new_style.indicator_location == 'flex-end' }" class="dot flex-row pa" :style="dot_style">
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
    import { common_styles_computer, common_img_computer, radius_computer, isEmpty, gradient_computer, padding_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/components/diy/modules/image-empty.vue';
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
            propkey: {
                type: String,
                default: '',
            },
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
                popup_width: '0rpx',
                popup_height: '0rpx',
                // 样式二的处理
                animation: '',
                animationData: 0,
                previousMargin: '0rpx',
                nextMargin: '0rpx',
                slides_per_group: 1,
                // hackReset: true,
            };
        },
        watch: {
            propkey(val) {
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
                const { windowWidth } = uni.getSystemInfoSync();
                // 将90%的宽度分成16份
                const block = (windowWidth * 0.9) / 16;

                const { common_style, actived_color } = new_style;
                // aspectFill 对应 cover aspectFit 对应 contain  scaleToFill 对应 none
                let fit = 'scaleToFill';
                if (new_form.img_fit == 'cover') {
                    fit = 'aspectFill';
                } else if (new_form.img_fit == 'contain') {
                    fit = 'aspectFit';
                }
                this.setData({
                    form: this.propValue.content,
                    new_style: this.propValue.style,
                    seat_list: this.get_seat_list(new_form),
                    new_list: new_form.carousel_list.concat(this.get_seat_list(new_form)),
                    popup_width: block * 16 * 2 + 'rpx',
                    popup_height: block * 9 * 2 + 'rpx',
                    style_container: this.propIsCommon ? common_styles_computer(common_style) : '', // 用于样式显示
                    style_img_container: this.propIsCommon ? common_img_computer(common_style) : '', // 用于样式显示
                    img_style: radius_computer(new_style), // 图片的设置
                    indicator_style: this.get_indicator_style(new_style), // 指示器的样式
                    dot_style: `bottom: ${common_style.padding_bottom * 2 + 24}rpx;`, // 指示器位置
                    img_fit: fit,
                    video_style: this.get_video_style(new_style), // 视频播放按钮显示逻辑
                });
                if (new_form.carousel_type == 'card') {
                    this.$nextTick(() => {
                        this.setData({
                            previousMargin: '82rpx',
                            nextMargin: '82rpx',
                            animationData: 0,
                        });
                    });
                } else if (new_form.carousel_type != 'inherit') {
                    this.$nextTick(() => {
                        this.setData({
                            nextMargin: '100rpx',
                            slides_per_group: new_form.carousel_type == 'twoDragOne' ? 2 : 1,
                        });
                    });
                }
                // this.setData({
                //     hackReset: false,
                // });
                // this.$nextTick(() => {
                //     this.setData({
                //         hackReset: true,
                //     });
                // });
            },
            get_indicator_style(new_style) {
                const { indicator_radius, indicator_style, indicator_size, color } = new_style;
                let styles = '';
                if (!isEmpty(indicator_radius)) {
                    styles += radius_computer(indicator_radius);
                }
                if (indicator_style == 'num') {
                    styles += `color: ${color || '#DDDDDD'};`;
                    styles += `font-size: ${indicator_size * 2}rpx;`;
                } else if (indicator_style == 'elliptic') {
                    styles += `background: ${color || '#DDDDDD'};`;
                    styles += `width: ${indicator_size * 6}rpx; height: ${indicator_size * 2}rpx;`;
                } else {
                    styles += `background: ${color || '#DDDDDD'};`;
                    styles += `width: ${indicator_size * 2}rpx; height: ${indicator_size * 2}rpx;`;
                }
                return styles;
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
                            seat_list.push(...list.slice(0, 1));
                            break;
                        default:
                            break;
                    }
                    return seat_list;
                }
            },
            slideChange(e) {
                let actived_index = e.target.current;
                if (e.target.current > this.form.carousel_list.length - 1) {
                    const seat_length = this.seat_list.length;
                    if (seat_length == 2 && e.target.current == 3) {
                        actived_index = 1;
                    } else if (seat_length == 3) {
                        actived_index = 0;
                    } else {
                        actived_index = e.target.current - this.seat_list.length;
                    }
                }
                this.setData({
                    animationData: e.target.current,
                    actived_index: actived_index,
                });
            },
            get_video_style(new_style) {
                const { video_bottom, video_radius, video_color_list, video_direction, video_title_color, video_padding } = new_style;
                let style = `bottom: ${video_bottom}px;`;
                if (!isEmpty(video_radius)) {
                    style += radius_computer(video_radius);
                }
                const data = {
                    color_list: video_color_list,
                    direction: video_direction,
                };
                style += gradient_computer(data) + padding_computer(video_padding) + `color: ${video_title_color};`;
                return style;
            },
            video_play(e) {
                const list = e.currentTarget.dataset.value;
                if (!isEmpty(list)) {
                    this.$emit('video_play', list[0].url, this.popup_width, this.popup_height);
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
    .video_img {
        max-width: 120rpx;
        height: 28rpx;
    }
    .video-class {
        max-width: 100%;
        margin-right: 20rpx;
        margin-left: 20rpx;
    }
    .x-middle {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
