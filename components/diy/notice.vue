<template>
    <!-- 公告 -->
    <view :style="style_container">
        <view :style="style_img_container">
            <template v-if="form_content.notice_style == 'inherit'">
                <view class="news-box" :style="container_background_style + container_height">
                    <view class="flex-row align-c gap-8" :style="container_background_img_style">
                        <template v-if="form_content.title_type == 'img-icon'">
                            <view v-if="form_content.icon_class">
                                <iconfont :name="'icon-' + form_content.icon_class" :size="form_style.icon_size * 2 + 'rpx'" :color="form_style.icon_color" propContainerDisplay="flex"></iconfont>
                            </view>
                            <view v-else>
                                <image v-if="form_content.img_src.length > 0" :src="form_content.img_src[0].url" class="border-radius-sm dis-block" mode="aspectFill" :style="img_style"></image>
                            </view>
                        </template>
                        <template v-else>
                            <view :style="title_style" class="padding-horizontal-sm border-radius-sm">{{ form_content.title || '公告' }}</view>
                        </template>
                        <swiper class="swiper flex-1" circular :indicator-dots="false" :autoplay="true" :interval="interval_time" :vertical="direction_type == 'vertical'" :style="container_height">
                            <swiper-item v-for="(item, index) in notice_list" :key="index">
                                <view class="swiper-item flex-row align-c ht-auto" :style="content_title_style + 'color:' + form_style.news_color" :data-value="item.notice_link.page" @tap="url_event">
                                    <view class="text-line-1">{{ item.notice_title }}</view>
                                </view>
                            </swiper-item>
                        </swiper>
                        <view v-if="form_content.is_right_button == '1'" class="flex-row align-c" :style="'color: ' + form_style.right_button_color + ';font-size:' + form_style.right_button_size * 2 + 'rpx;'" :data-value="form_content.more_link.page" @tap="url_event">
                            {{ form_content.right_title }}
                            <view class="pr">
                                <iconfont name="icon-arrow-right" :color="form_style.right_button_color || '#999'" :size="form_style.right_button_size * 2 + 'rpx'"  propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else>
                <view class="news-card" :style="container_background_style">
                    <view class="flex-col gap-10" :style="container_background_img_style">
                        <view class="flex-row wh-auto jc-sb align-c">
                            <template v-if="form_content.title_type == 'img-icon'">
                                <template v-if="form_content.icon_class">
                                    <iconfont :name="'icon-' + form_content.icon_class" :size="form_style.icon_size * 2 + 'rpx'" :color="form_style.icon_color" propContainerDisplay="flex"></iconfont>
                                </template>
                                <template v-else>
                                    <image v-if="form_content.img_src.length > 0" :src="form_content.img_src[0].url" class="border-radius-sm dis-block" mode="aspectFill" :style="img_style"></image>
                                </template>
                            </template>
                            <template v-else>
                                <view :style="title_style" class="padding-horizontal-sm border-radius-sm">{{ form_content.title }}</view>
                            </template>
                            <view v-if="form_content.is_right_button == '1'" class="flex-row align-c" :style="'color: ' + form_style.right_button_color + ';font-size:' + form_style.right_button_size * 2 + 'rpx;'" :data-value="form_content.more_link.page" @tap="url_event">
                                {{ form_content.right_title }}
                                <view class="pr">
                                    <iconfont name="icon-arrow-right" :color="form_style.right_button_color || '#999'" :size="form_style.right_button_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                                </view>
                            </view>
                        </view>
                        <view v-for="(item, index) in notice_list" :key="index" class="flex-row" :style="content_title_style" :data-value="item.notice_link.page" @tap="url_event">
                            <view class="num" :class="'one' + (index + 1)">{{ index + 1 }}</view>
                            <view class="break" :style="'color:' + form_style.news_color">{{ item.notice_title }}</view>
                        </view>
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { background_computer, common_styles_computer, common_img_computer, gradient_computer, gradient_handle, radius_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
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
                form_content: {},
                form_style: {},
                style_container: '',
                style_img_container: '',
                // 容器高度
                container_height: '',
                // 容器背景
                container_background_style: '',
                // 图片设置
                img_style: '',
                // 标题的设置
                title_style: '',
                // 内容标题设置
                content_title_style: '',
                // 指示器的样式
                // 轮播图定时显示
                interval_time: 2000,
                // 轮播图滚动方向 // vertical' | 'horizontal
                direction_type: 'vertical',
                // 记录当前显示的轮播图的数据
                interval_list: {
                    time: 2000,
                    direction: 'vertical',
                    notice_length: 1,
                },
                // 公告数据
                notice_list: [],
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
            // 初始化数据
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                // 容器背景
                const { container_color_list, container_direction, container_background_img_style, container_background_img } = new_style;
                const temp_obj = {
                    color_list: container_color_list,
                    direction: container_direction,
                    background_img: container_background_img,
                    background_img_style: container_background_img_style,
                };
                const temp_container_background_style = gradient_computer(temp_obj) + radius_computer(new_style.container_radius) + `overflow:hidden;`;
                const temp_container_background_img_style = background_computer(temp_obj);
                // 标题渐变色处理
                const gradient = gradient_handle(new_style.title_color_list, '90deg');
                const time = (new_style.interval_time || 2) * 1000;
                const direction = new_content.direction;
                const new_notice_list = new_content.notice_list.filter((item) => item.is_show == '1');
                // 判断长度是否相等
                const notice_length = new_notice_list.length;
                const new_interval_list = {
                    time: time,
                    direction: direction,
                    notice_length: notice_length,
                };
                this.setData({
                    form_content: new_content,
                    form_style: new_style,
                    container_height: 'height:' + new_style.container_height * 2 + 'rpx',
                    container_background_style: temp_container_background_style,
                    container_background_img_style: temp_container_background_img_style,
                    img_style: `height: ${new_style.title_height * 2}rpx; width: ${new_style.title_width * 2}rpx`,
                    title_style: `color:${new_style.title_color}; font-size: ${new_style.title_size * 2}rpx; font-weight: ${new_style.title_typeface}; ${gradient}`,
                    content_title_style: `font-size: ${new_style.news_size * 2}rpx; font-weight: ${new_style.news_typeface};`,
                    notice_list: new_notice_list,
                    interval_time: time,
                    direction_type: direction,
                    interval_list: new_interval_list,
                    style_container: common_styles_computer(new_style.common_style),
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                });
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .news-box {
        overflow: hidden;
        padding: 0 20rpx;
        background: #fff;
    }
    .news-card {
        padding: 30rpx;
        background: #fff;
    }
    .num {
        padding-right: 14rpx;
        color: #999;
    }
    .one1 {
        color: #ea3323;
    }
    .one2 {
        color: #ff7303;
    }
    .one3 {
        color: #ffc300;
    }
    .two-style {
        width: 48rpx;
        height: 48rpx;
    }
    .break {
        word-break: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
</style>
