<template>
    <view :style="style_container">
        <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :style="{'height': newHeight }" @change="slideChange">
            <swiper-item v-for="(item, index) in nav_content_list" :key="index" class="flex-row align-c" @tap="url_open(item.carousel_link)">
                <view ref="bannerImg" class="flex-row flex-wrap wh-auto gap-x-10">
                    <view v-for="(item1, index1) in item.split_list" :key="index1" class="flex-col gap-10 align-c" :style="{'width': group_width }" @tap="url_open_event(item1.link)">
                        <view v-if="['image_with_text', 'image'].includes(nav_style)" class="top-img flex-row align-c jc-c">
                            <image-empty :image-src="item1.img[0]" :style="img_style" error-style="width: 60rpx;height: 60rpx;"></image-empty>
                        </view>
                        <p v-if="['image_with_text', 'text'].includes(nav_style)" class="size-12 ma-0" :style="text_style">{{ item1.title }}</p>
                    </view>
                </view>
            </swiper-item>
        </swiper>
        <view v-if="form.display_style == 'slide' && new_style.is_show == '1'" :style="{ 'justify-content': new_style.indicator_location || 'center'}" class="dot flex-row">
            <template v-if="new_style.indicator_style == 'num'">
                <view :style="indicator_style" class="dot-item">
                    <span :style="{ color: new_style.actived_color }">{{ actived_index + 1 }}</span><span>/{{ nav_content_list.length }}</span>
                </view>
            </template>
            <template v-else>
                <view v-for="(item, index) in nav_content_list" :key="index" :style="indicator_style + (actived_index == index ? 'background:' + new_style.actived_color : '')" class="dot-item" />
            </template>
        </view>
    </view>
</template>

<script>
const app = getApp();
import { is_obj_empty, common_styles_computer, radius_computer } from '../../common/js/common/common';
import imageEmpty from './modules/image-empty.vue';
export default {
    components: {
        imageEmpty
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
            style_container: '',
            img_style: '',
            text_style: '',
            indicator_style: '',
            newHeight: '200rpx',
            actived_index: 0,
            group_width: '',
            nav_content_list: []
        };
    },
    created() {
        this.setData({
            form: this.value.content,
            new_style: this.value.style
        });
        this.init();
    },
    mounted() {
        this.$nextTick(() => {
            this.newHeight = this.$refs.bannerImg[0].$el.clientHeight * 2 + 'rpx';
        });
        window.onresize = () => {
            this.newHeight = this.$refs.bannerImg[0].$el.clientHeight * 2 + 'rpx';
        }
    },
    methods: {
        init() {
            this.setData({
                style_container: common_styles_computer(this.new_style.common_style), // 用于样式显示
                img_style: radius_computer(this.new_style), // 图片的设置
                text_style: `font-size: ${this.new_style.title_size * 2 || 24}rpx; color: ${this.new_style.title_color || '#000'};`, // 标题的样式
                indicator_style: this.get_indicator_style(),// 指示器的样式
                actived_color: this.new_style.actived_color || '#2A94FF', // 轮播图显示样式
                group_width: `${100 / (this.form.single_line || 4)}%`, // 每个导航所占位置
                nav_style: this.form.nav_style || 'image_with_text', // 是否显示文字和图片
                nav_content_list: this.get_nav_content_list()
            })
        },
        get_nav_content_list() {
            // 深拷贝一下，确保不会出现问题
            const list = JSON.parse(JSON.stringify(this.form?.nav_content_list || Array(4)));
            console.log(this.form);
            // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
            if (list.length > 0 && this.form.display_style == 'slide') {
                // 存储数据显示
                let nav_list = [];
                // 每页显示的数量
                const num = (this.form?.single_line || 4) * (this.form?.row || 1);
                // 拆分的数量
                const split_num = Math.ceil(list.length / num);
                for (let i = 0; i < split_num; i++) {
                    nav_list.push({ split_list: list.slice(i * num, (i + 1) * num) });
                }
                return nav_list;
            } else {
                // 否则的话，就返回全部的信息
                return [{ split_list: list }];
            }
        },
        get_indicator_style() {
            const { indicator_radius, indicator_style, indicator_size, color } = this.new_style;
            let styles = '';
            if (!is_obj_empty(indicator_radius)) {
                styles += radius_computer(indicator_radius)
            }
            if (indicator_style == 'num') {
                styles += `color: ${color || '#DDDDDD'};`;
                styles += `font-size: ${ indicator_size * 2 }rpx;`;
            } else if (indicator_style == 'elliptic') {
                styles += `background: ${color || '#DDDDDD'};`;
                styles += `width: ${ indicator_size * 6 }rpx; height: ${ indicator_size * 2 }rpx;`;
            } else {
                styles += `background: ${color || '#DDDDDD'};`;
                styles += `width: ${ indicator_size * 2 }rpx; height: ${ indicator_size * 2 }rpx;`;
            }
            return styles;
        },
        slideChange(e) {
            this.setData({
                actived_index: e.target.current
            })
        },
        url_open_event(link) {
            if (!is_obj_empty(link)) {
                app.globalData.url_open(link.page)
            }
        },
        
    },
};
</script>

<style scoped lang="scss">
.top-img {
    height: 100rpx;
    width: 100rpx;
    border-radius: 8rpx;
}
.dot{
    margin-top: 20rpx;
    margin-bottom: 8rpx;
}
.dot .dot-item {
    margin: 0 12rpx;
}
.gap-x-10 {
    row-gap: 20rpx;
}
</style>
