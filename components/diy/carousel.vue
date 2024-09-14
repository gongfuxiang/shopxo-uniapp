<template>
    <view class="pr" :style="style_container">
        <swiper circular="true" :autoplay="form.is_roll == '1'" :interval="form.interval_time * 1000" :duration="500" :style="{ height: new_style.height * 2 + 'rpx' }" :previous-margin="previousMargin" :next-margin="nextMargin" @change="slideChange">
            <block v-if="form.carousel_type == 'card'">
                <swiper-item v-for="(item, index) in new_list" :key="index" class="flex-row align-c" @tap="url_open(item.carousel_link)">
                    <view class="swiper-item" :style="img_style" :class="['scale-defalt', { 'scale-1': animationData === index }]">
                        <image-empty :image-src="item.carousel_img[0]" class="img" :style="img_style" :img_fit="img_fit" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                    </view>
                    <view v-if="new_style.video_is_show == '1' && item.carousel_video.length > 0" :class="{ 'x-middle': new_style.video_location == 'center', 'right-0': new_style.video_location == 'flex-end' }" class="video-class flex-row pa gap-10 align-c oh" :style="video_style" @tap.stop="video_play(item.carousel_video)">
                        <block v-if="new_style.video_type == 'img'">
                            <image-empty :image-src="new_style.video_img[0]" class="video_img" img_fit="aspectFill" error-style="width: 28rpx;height: 28rpx;"></image-empty>
                        </block>
                        <block v-else>
                            <iconfont :name="!isEmpty(new_style.video_icon_class) ? 'icon-' + new_style.video_icon_class : 'icon-bofang'" size="'28rpx'" :color="new_style.video_icon_color"></iconfont>
                        </block>
                        <span v-if="!isEmpty(item.video_title)" :style="{ color: new_style.video_title_color, 'font-size': new_style.video_title_size * 2 + 'rpx' }">{{ item.video_title }}</span>
                    </view>
                </swiper-item>
            </block>
            <block v-else>
                <swiper-item v-for="(item, index) in new_list" :key="index">
                    <view class="item-image flex-row jc-c align-c wh-auto ht-auto pr" :style="img_style">
                        <image-empty :image-src="item.carousel_img[0]" class="img" :style="img_style" :img_fit="img_fit" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                    </view>
                    <view v-if="new_style.video_is_show == '1' && item.carousel_video.length > 0" :class="{ 'x-middle': new_style.video_location == 'center', 'right-0': new_style.video_location == 'flex-end' }" class="video-class flex-row pa gap-10 align-c oh" :style="video_style" @tap.stop="video_play(item.carousel_video)">
                        <block v-if="new_style.video_type == 'img'">
                            <image-empty :image-src="new_style.video_img[0]" class="video_img" img_fit="aspectFill" error-style="width: 28rpx;height: 28rpx;"></image-empty>
                        </block>
                        <block v-else>
                            <iconfont :name="!isEmpty(new_style.video_icon_class) ? 'icon-' + new_style.video_icon_class : 'icon-bofang'" size="'28rpx'" :color="new_style.video_icon_color"></iconfont>
                        </block>
                        <span v-if="!isEmpty(item.video_title)" :style="{ color: new_style.video_title_color, 'font-size': new_style.video_title_size * 2 + 'rpx' }">{{ item.video_title }}</span>
                    </view>
                </swiper-item>
            </block>
        </swiper>
        <view v-if="new_style.is_show == '1'" :class="{ 'dot-center': new_style.indicator_location == 'center', 'dot-right': new_style.indicator_location == 'flex-end' }" class="dot flex-row pa" :style="dot_style">
            <template v-if="new_style.indicator_style == 'num'">
                <view :style="indicator_style" class="dot-item">
                    <span :style="{ color: new_style.actived_color }">{{ actived_index + 1 }}</span
                    ><span>/{{ form.carousel_list.length }}</span>
                </view>
            </template>
            <template v-else>
                <view v-for="(item, index2) in form.carousel_list" :key="index2" :style="indicator_style + (actived_index == index2 ? 'background:' + new_style.actived_color : '')" class="dot-item" />
            </template>
        </view>
        <uni-popup ref="popup" type="center" border-radius="20rpx" :mask-click="false">
            <view class="flex-col align-c jc-c gap-10">
                <video :src="video_src" id="carousel_video" :autoplay="true" :controls="true" :loop="true" show-fullscreen-btn class="radius-md" :style="{ width: popup_width, height: popup_height }"></video>
                <iconfont name="icon-qiandao-tancguanbi" size="56rpx" color="#666" @tap="video_close"></iconfont>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, radius_computer, isEmpty, gradient_computer, padding_computer } from '@/common/js/common/common.js';
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
                // 通用样式显示
                style_container: '',
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
                video_src: '',
                popup_width: '0rpx',
                popup_height: '0rpx',
                // 样式二的处理
                animation: '',
                animationData: 0,
                previousMargin: '0rpx',
                nextMargin: '0rpx',
            };
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
                const { windowWidth } = uni.getSystemInfoSync();
                // 将90%的宽度分成16份
                const block = (windowWidth * 0.9) / 16;

                const { common_style, actived_color } = this.new_style;
                // aspectFill 对应 cover aspectFit 对应 contain  scaleToFill 对应 none
                const { img_fit } = this.form;
                let fit = 'scaleToFill';
                if (img_fit == 'cover') {
                    fit = 'aspectFill';
                } else if (img_fit == 'contain') {
                    fit = 'aspectFit';
                }
                this.setData({
                    seat_list: this.get_seat_list(),
                    new_list: this.seat_list.concat(this.form.carousel_list),
                    popup_width: block * 16 * 2 + 'rpx',
                    popup_height: block * 9 * 2 + 'rpx',
                    style_container: common_styles_computer(common_style), // 用于样式显示
                    img_style: radius_computer(this.new_style), // 图片的设置
                    indicator_style: this.get_indicator_style(), // 指示器的样式
                    dot_style: `bottom: ${common_style.padding_bottom * 2 + 12}rpx;`, // 指示器位置
                    img_fit: fit,
                    video_style: this.get_video_style(), // 视频播放按钮显示逻辑
                });

                if (this.form.carousel_type == 'card') {
                    this.$nextTick(() => {
                        this.setData({
                            previousMargin: '82rpx',
                            nextMargin: '82rpx',
                            animationData: 0,
                        });
                    });
                }
            },
            get_indicator_style() {
                const { indicator_radius, indicator_style, indicator_size, color } = this.new_style;
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
            get_seat_list() {
                if (this.form.carousel_list.length > 3) {
                    return [];
                } else {
                    let seat_list = [];
                    const list = JSON.parse(JSON.stringify(this.form.carousel_list));
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
            get_video_style() {
                const { video_bottom, video_radius, video_color_list, video_direction, video_title_color, video_padding } = this.new_style;
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
            video_play(list) {
                this.setData({
                    video_src: list[0].url,
                });
                this.$refs.popup.open();
                const videoContext = uni.createVideoContext('carousel_video');
                if (!isEmpty(videoContext)) {
                    videoContext.play();
                }
            },
            video_close() {
                const videoContext = uni.createVideoContext('carousel_video');
                if (!isEmpty(videoContext)) {
                    videoContext.pause();
                }
                this.$refs.popup.close();
            },
            url_open(link) {
                if (!isEmpty(link)) {
                    app.globalData.url_open(link.page);
                }
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

    .img {
        width: 100%;
        height: 100%;
    }
    .video_img {
        max-width: 120rpx;
        height: 28rpx;
    }
    .video-class {
        max-width: 100%;
    }
    .x-middle {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
