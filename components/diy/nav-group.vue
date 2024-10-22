<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :style="{ height: new_height }" @change="slideChange">
                <swiper-item v-for="(item, index) in nav_content_list" :key="index">
                    <view class="flex-row align-c wh-auto ht-auto">
                        <view class="banner-img flex-row flex-wrap wh-auto" :class="'banner-img-' + propKey" :style="space">
                            <view v-for="(item1, index1) in item.split_list" :key="index1" class="flex-col gap-10 align-c" :style="group_width + nav_title_space" :data-value="item1.link.page" @tap="url_open_event">
                                <view v-if="['image_with_text', 'image'].includes(nav_style)" class="flex-row align-c jc-c">
                                    <view class="top-img" :style="img_size">
                                        <imageEmpty :propImageSrc="item1.img[0]" :propStyle="img_style" propErrorStyle="width: 60rpx;height: 60rpx;"></imageEmpty>
                                    </view>
                                </view>
                                <view v-if="['image_with_text', 'text'].includes(nav_style)" class="wh-auto size-12 ma-0 nowrap oh tc" :style="text_style">{{ item1.title }}</view>
                            </view>
                        </view>
                    </view>
                </swiper-item>
            </swiper>
            <view v-if="form.display_style == 'slide' && new_style.is_show == '1'" :style="{ 'justify-content': new_style.indicator_location || 'center' }" class="dot flex-row">
                <block v-if="new_style.indicator_style == 'num'">
                    <view :style="indicator_style" class="dot-item">
                        <text :style="{ color: new_style.actived_color }">{{ actived_index + 1 }}</text>
                        <text>/{{ nav_content_list.length }}</text>
                    </view>
                </block>
                <block v-else>
                    <view v-for="(item, index) in nav_content_list" :key="index" :style="indicator_style + (actived_index == index ? 'background:' + new_style.actived_color : '')" class="dot-item" />
                </block>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, radius_computer } from '@/common/js/common/common.js';
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
            propKey: {
                type: [String, Number],
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
                style_container: '',
                style_img_container: '',
                img_style: '',
                text_style: '',
                indicator_style: '',
                new_height: '300rpx',
                actived_index: 0,
                group_width: '',
                nav_content_list: [],
                nav_title_space: 'row-gap:20rpx', // 导航标题间距
                space: 'row-gap:20rpx', // 导航间距
                img_size: '72rpx',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.propValue.content;
                const new_style = this.propValue.style;
                this.setData({
                    form: new_content,
                    new_style: new_style,
                    style_container: common_styles_computer(new_style.common_style), // 用于样式显示
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    img_style: radius_computer(new_style), // 图片的设置
                    text_style: `font-size: ${new_style.title_size * 2 || 24}rpx; color: ${new_style.title_color || '#000'};`, // 标题的样式
                    indicator_style: this.get_indicator_style(new_style), // 指示器的样式
                    actived_color: new_style.actived_color || '#2A94FF', // 轮播图显示样式
                    group_width: `width: ${100 / (new_content.single_line || 4)}%;`, // 每个导航所占位置
                    nav_title_space: 'row-gap:' + (new_style.title_space || 0) * 2 + 'rpx', // 导航标题间距
                    space: 'row-gap:' + (new_style.space || 0) * 2 + 'rpx', // 导航间距
                    img_size: 'width:' + (new_style.img_size || 0) * 2 + 'rpx;height:' + (new_style.img_size || 0) * 2 + 'rpx;', // 图片大小
                    nav_style: new_content.nav_style || 'image_with_text', // 是否显示文字和图片
                    nav_content_list: this.get_nav_content_list(new_content),
                });
                this.$nextTick(() => {
                    const query = uni.createSelectorQuery().in(this);
                    // 选择我们想要的元素
                    query
                        .select('.banner-img-' + this.propKey)
                        .boundingClientRect((res) => {
                            if ((res || null) != null) {
                                // data包含元素的宽度、高度等信息
                                this.setData({
                                    new_height: res.height + 'px',
                                });
                            }
                        })
                        .exec(); // 执行查询
                });
            },
            get_nav_content_list(data) {
                // 深拷贝一下，确保不会出现问题
                const list = JSON.parse(JSON.stringify(data.nav_content_list || Array(4)));
                // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
                if (list.length > 0 && data.display_style == 'slide') {
                    // 存储数据显示
                    let nav_list = [];
                    // 每页显示的数量
                    const num = (data.single_line || 4) * (data.row || 1);
                    // 拆分的数量
                    const split_num = Math.ceil(list.length / num);
                    for (let i = 0; i < split_num; i++) {
                        nav_list.push({
                            split_list: list.slice(i * num, (i + 1) * num),
                        });
                    }
                    return nav_list;
                } else {
                    // 否则的话，就返回全部的信息
                    return [
                        {
                            split_list: list,
                        },
                    ];
                }
            },
            get_indicator_style(data) {
                const { indicator_radius, indicator_style, indicator_size, color } = data;
                let styles = '';
                if (!isEmpty(indicator_radius)) {
                    styles += radius_computer(indicator_radius);
                }
                // 数字类型的指示器
                if (indicator_style == 'num') {
                    styles += `color: ${color || '#DDDDDD'};`;
                    styles += `font-size: ${indicator_size * 2}rpx;`;
                } else if (indicator_style == 'elliptic') {
                    // 宽的指示器，按照宽高1:3 来计算
                    styles += `background: ${color || '#DDDDDD'};`;
                    styles += `width: ${indicator_size * 6}rpx; height: ${indicator_size * 2}rpx;`;
                } else {
                    // 圆点指示器
                    styles += `background: ${color || '#DDDDDD'};`;
                    styles += `width: ${indicator_size * 2}rpx; height: ${indicator_size * 2}rpx;`;
                }
                return styles;
            },
            slideChange(e) {
                this.setData({
                    actived_index: e.target.current,
                });
            },
            url_open_event(link) {
                app.globalData.url_event(link);
            },
        },
    };
</script>

<style scoped lang="scss">
    .top-img {
        height: 72rpx;
        width: 72rpx;
        border-radius: 8rpx;
    }

    .dot {
        margin-top: 20rpx;
        margin-bottom: 8rpx;
    }

    .dot .dot-item {
        margin: 0 6rpx;
    }

    .gap-x-10 {
        row-gap: 20rpx;
    }
</style>
