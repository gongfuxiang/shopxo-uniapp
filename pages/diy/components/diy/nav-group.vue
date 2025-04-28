<template>
    <view :style="style_container">
        <view class="pr" :style="style_img_container">
            <swiper class="swiper" circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :display-multiple-items="slides_per_group" :style="{ height: new_height }" @change="slideChange">
                <swiper-item v-for="(item, index) in nav_content_list" :key="index" class="swiper-item">
                    <view class="banner-img flex-row flex-wrap wh-auto" :class="'banner-img-' + propKey" :style="space">
                        <view v-for="(item1, index1) in item.split_list" :key="index1" class="flex-col gap-10 align-c" :style="group_width + nav_title_space" :data-value="item1.link.page" @tap="url_open_event">
                            <view v-if="['image_with_text', 'image'].includes(nav_style)" class="flex-row align-c jc-c pr">
                                <view class="top-img" :style="img_size">
                                    <image-empty :propImageSrc="item1.img[0]" :propStyle="img_style" propErrorStyle="width: 60rpx;height: 60rpx;"></image-empty>
                                </view>
                                <!-- 角标 -->
                                <subscriptIndex :propValue="item1.subscript" propType="nav-group"></subscriptIndex>
                            </view>
                            <view v-if="['image_with_text', 'text'].includes(nav_style)" class="wh-auto size-12 ma-0 nowrap oh tc" :style="text_style">{{ item1.title }}</view>
                        </view>
                    </view>
                </swiper-item>
            </swiper>
            <view v-if="form.display_style == 'slide' && new_style.is_show == '1'" :class="['left', 'right'].includes(new_style.indicator_new_location) ? 'indicator_up_down_location' : 'indicator_about_location'" :style="indicator_location_style">
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
import { isEmpty, common_styles_computer, common_img_computer, radius_computer, padding_computer, get_indicator_style, get_indicator_location_style, old_padding } from '@/common/js/common/common.js';
import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
import subscriptIndex from '@/pages/diy/components/diy/modules/subscript/index.vue';
export default {
    components: {
        imageEmpty,
        subscriptIndex,
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
            new_height: '0rpx',
            actived_index: 0,
            group_width: '',
            nav_content_list: [],
            nav_title_space: 'row-gap:20rpx', // 导航标题间距
            space: 'row-gap:20rpx', // 导航间距
            img_size: '72rpx',
            slides_per_group: 1,
            indicator_location_style: '',
            subscriptStyle: {
                seckill_subscript_location: 'top-left',
                text_or_icon_color: '#fff',
                text_or_icon_size: 12,
                img_width: 20,
                img_height: 20,
                direction: '90deg',
                top_or_bottom_spacing: 0,
                left_or_right_spacing: 0,
                color_list: [{ color: '#FF7607', color_percentage: undefined }],
                background_img_style: '2',
                background_img: [],
                margin: 0,
                margin_top: 0,
                margin_bottom: 0,
                margin_left: 0,
                margin_right: 0,
                radius: 4,
                radius_top_left: 4,
                radius_top_right: 4,
                radius_bottom_left: 4,
                radius_bottom_right: 4,
                padding: 0,
                padding_top: 0,
                padding_bottom: 0,
                padding_left: 0,
                padding_right: 0,
                box_shadow_color: '',
                box_shadow_x: 0,
                box_shadow_y: 0,
                box_shadow_blur: 0,
                box_shadow_spread: 0,
            }
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
            
            let group = 1;
            // 每行显示的数量
            const single_line = new_content.single_line || 4;
            let group_width = `width: ${100 / (single_line)}%;`;
            // 判断是否是轮播图
            if (new_content?.display_style == 'slide') {
                if (new_content.row == 1 && new_style.rolling_fashion == 'translation') {
                    group = single_line;
                    group_width = 'width: 100%;';
                } else {
                    group = 1;
                    group_width = `width: ${100 / (single_line)}%;`;
                }
            }
            this.setData({
                form: new_content,
                new_style: new_style,
                style_container: common_styles_computer(new_style.common_style), // 用于样式显示
                style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                img_style: radius_computer(new_style), // 图片的设置
                text_style: `font-size: ${new_style.title_size * 2 || 24}rpx;line-height:${new_style.title_size * 2 || 24}rpx;height:${new_style.title_size * 2 || 24}rpx;color: ${new_style.title_color || '#000'};`, // 标题的样式
                indicator_style: get_indicator_style(new_style), // 指示器的样式
                indicator_location_style: get_indicator_location_style(new_style), // 指示器位置处理
                actived_color: new_style.actived_color || '#2A94FF', // 轮播图显示样式
                slides_per_group: group, // 每个轮播图显示的个数
                group_width: group_width, // 每个导航所占位置
                nav_title_space: 'row-gap:' + (new_style.title_space || 0) * 2 + 'rpx', // 导航标题间距
                space: 'row-gap:' + (new_style.space || 0) * 2 + 'rpx;' + padding_computer(new_style.data_padding), // 导航间距
                img_size: 'width:' + (new_style.img_size || 0) * 2 + 'rpx;height:' + (new_style.img_size || 0) * 2 + 'rpx;', // 图片大小
                nav_style: new_content.nav_style || 'image_with_text', // 是否显示文字和图片
                nav_content_list: this.get_nav_content_list(new_content, new_style),
                new_height: this.get_new_height(new_content, new_style),
            });
            setTimeout(() => {
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
            }, 500);
        },
        get_new_height(new_content, new_style) {
            const { nav_content_list = Array(4), single_line = 4, row = 1, nav_style = 'image_with_text' } = new_content;
            const { img_size = 0, title_size = 0, title_space = 0, space = 0, data_padding = old_padding } = new_style;
            const temp_nav_content = nav_content_list;
            // 每页的总行数
            let total_num = 1;
            // 每行显示的数量
            const quantity_per_row = single_line;
            // 判断是否是滑动显示
            if (new_content.display_style == 'slide') {
                // 每页需要显示的总数量
                const num = quantity_per_row * row;
                // 数量大于显示的总数量，每页的总行数就按照配置的来，否则的话，取总数除以每行显示的数量
                if (temp_nav_content.length > num) {
                    total_num = row;
                } else {
                    total_num = Math.ceil(temp_nav_content.length / quantity_per_row);
                }
            } else {
                // 拆分的数量
                total_num = Math.ceil(temp_nav_content.length / quantity_per_row);
            }
            // 每行的总高度，由图片的高度加上标题的高度加上标题间距
            let each_row_height = img_size + title_size + title_space;
            // 如果只有图片的话，只计算图片的高度
            if (nav_style == 'image') {
                each_row_height = img_size;
            } else if (nav_style == 'text') {
                // 如果只有文字的话，只计算文字的高度
                each_row_height = title_size;
            }
            // 总高度
            return ((each_row_height * total_num) + ((total_num - 1) * space) + (data_padding.padding_top + data_padding.padding_bottom)) * 2 + 'rpx';
        },
        get_nav_content_list(data, new_style) {
            // 深拷贝一下，确保不会出现问题
            const list = JSON.parse(JSON.stringify(data.nav_content_list || Array(4))).map(item => ({
                ...item,
                // 角标配置
                subscript: isEmpty(item.subscript) ?
                    {
                        content: {
                            seckill_subscript_show: '0',
                            subscript_type: 'text',
                            subscript_img_src: [],
                            subscript_icon_class: '',
                            subscript_text: '',
                        },
                        style: this.subscriptStyle,
                    } : item.subscript,
            }));
            // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
            if (list.length > 0 && data.display_style == 'slide') {
                // 存储数据显示
                let nav_list = [];
                if (data.row == 1 && new_style.rolling_fashion == 'translation') {
                    // 拆分的数量
                    list.forEach((item) => {
                        nav_list.push({
                            split_list: [item],
                        });
                    });
                    return nav_list;
                } else {
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
                }
            } else {
                // 否则的话，就返回全部的信息
                return [
                    {
                        split_list: list,
                    },
                ];
            }
        },
        slideChange(e) {
            this.setData({
                actived_index: e.detail.current,
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

.gap-x-10 {
    row-gap: 20rpx;
}
</style>
