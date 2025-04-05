<template>
    <view v-if="!isEmpty(list) || !isEmpty(swiper_new_list)" class="oh" :style="style_container">
        <view :style="style_img_container + 'height:' + swiper_outer_height * 2 + 'rpx;'">
            <template v-if="['translation', 'vertical'].includes(form.rotation_direction)">
                <swiper circular="true" vertical="true" :autoplay="form.is_roll == '1'" :interval="form.rotation_direction == 'vertical' ? swiper_interval_time : interval_time" :duration="form.rotation_direction == 'vertical' ? interval_time : 1000" :easing-function="form.rotation_direction == 'vertical' ? 'default' : 'default'" :style="'height:' + swiper_height * 2 + 'rpx;'" :display-multiple-items="slides_per_group">
                    <swiper-item v-for="(item, index) in list" :key="index">
                        <view class="flex-row align-c" :style="'gap:' + new_style.content_spacing * 2 + 'rpx;margin-bottom:' + new_style.content_spacing * 2 + 'rpx;'">
                            <template v-if="!isEmpty(item) && is_show('head')">
                                <image-empty :propImageSrc="item.user.avatar" :propStyle="heading_img_radius" propErrorStyle="width: 20rpx;height: 20rpx;"></image-empty>
                            </template>
                            <text v-if="is_show('nick_name')" class="text-line-1" :style="nick_name_style">{{ item.user.user_name_view }}</text>
                            <view v-if="is_show('goods_image') || is_show('goods_title')" class="flex-1 flex-row align-c" :style="'gap:' + new_style.content_spacing * 2 + 'rpx;'" :data-value="item.goods_url" @tap.stop="url_event">
                                <template v-if="is_show('goods_image')">
                                    <image-empty :propImageSrc="item.images" :propStyle="goods_img_radius" propErrorStyle="width: 20rpx;height: 20rpx;"></image-empty>
                                </template>
                                <text v-if="is_show('goods_title')" class="flex-1 text-line-1" :style="goods_title_style">{{ item.title }}</text>
                            </view>
                            <text v-if="is_show('time')" class="nowrap" :style="time_style">{{ item.add_time }}</text>
                        </view>
                    </swiper-item>
                </swiper>
            </template>
            <template v-else>
                <view class="swiper-free-mode swiper-horizontal-free-mode" :style="'height:' + swiper_height * 2 + 'rpx;'">
                    <view v-for="(item, index) in swiper_new_list" :key="index" :style="'margin-bottom:' + (index < swiper_new_list.length - 1 ? new_style.data_spacing * 2 : 0) + 'rpx;'">
                        <template v-if="!isEmpty(item.split_list)">
                            <!-- #ifndef H5 || MP-BAIDU || APP -->
                            <swiper circular="true" autoplay="true" :interval="swiper_interval_time" :duration="interval_time + (1000 * index)" easing-function="linear" :style="'height:' + new_swiper_height * 2 + 'rpx;'" :data-index="index" :data-value="item.split_list.length" @change="swiper_change">
                                <swiper-item v-for="(new_item, new_index) in item.split_list" :key="new_index">
                                    <view :style="swiper_horizontal_container + 'margin-left:' + (new_index == 0 && swiper_margin_left_list[index].is_left ? slides_offset_before : 0) + 'px;'">
                                        <view class="flex-row align-c" :style="swiper_horizontal_img_container">
                                            <view v-if="is_show('goods_image') || is_show('goods_title')" class="flex-row align-c" :style="'gap:' + new_style.content_spacing * 2 + 'rpx;'" :data-value="new_item.goods_url" @tap.stop="url_event">
                                                <template v-if="is_show('goods_image')">
                                                    <image-empty :propImageSrc="new_item.images" :propStyle="goods_img_radius" propErrorStyle="width: 20rpx;height: 20rpx;"></image-empty>
                                                </template>
                                                <view v-if="is_show('goods_title')" class="flex-1 text-line-1" :style="goods_title_style + 'white-space: initial;'">{{ new_item.title }}</view>
                                            </view>
                                            <text v-if="is_show('time')" class="nowrap" :style="time_style">{{ new_item.add_time }}</text>
                                        </view>
                                    </view>
                                </swiper-item>
                            </swiper>
                            <!-- #endif -->
                            <!-- #ifdef H5 || MP-BAIDU || APP -->
                            <next-notice-bar :key="propKey + '-' + index" :propKey="propKey + '-' + index" :y="false" initPosition="right" :row="1" :speed="(interval_time / 100) + (10 * index)" :propList="item.split_list">
                                <template #default="{ row }">
                                    <view :style="swiper_horizontal_container">
                                        <view class="flex-row align-c" :style="swiper_horizontal_img_container">
                                            <view v-if="is_show('goods_image') || is_show('goods_title')" class="flex-row align-c" :style="'gap:' + new_style.content_spacing * 2 + 'rpx;'" :data-value="row.goods_url" @tap.stop="url_event">
                                                <template v-if="is_show('goods_image')">
                                                    <image-empty :propImageSrc="row.images" :propStyle="goods_img_radius" propErrorStyle="width: 20rpx;height: 20rpx;"></image-empty>
                                                </template>
                                                <view v-if="is_show('goods_title')" class="flex-1 text-line-1" :style="goods_title_style + 'max-width: ' + max_title_width * 2 + 'rpx;white-space: initial;'">{{ row.title }}</view>
                                            </view>
                                            <text v-if="is_show('time')" class="nowrap" :style="time_style">{{ row.add_time }}</text>
                                        </view>
                                    </view>
                                </template>
                            </next-notice-bar>
                            <!-- #endif -->
                        </template>
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, padding_computer, radius_computer, background_computer, gradient_handle } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    import nextNoticeBar from '@/pages/diy/components/diy/modules/next-notice-bar.vue';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            imageEmpty,
            nextNoticeBar
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                list: [],
                nick_name_style: '',
                goods_title_style: '',
                time_style: '',
                heading_img_radius: '',
                goods_img_radius: '',
                slides_per_group: 1,
                swiper_outer_height: 0,
                swiper_height: 0,
                new_swiper_height: 0,
                swiper_horizontal_container: '',
                swiper_horizontal_img_container: '',
                max_title_width: 0,
                swiper_new_list: [],
                swiper_margin_left_list: [], // 是否偏移的数组
                slides_offset_before: 0,
                interval_time: 0,
                swiper_interval_time: 0,
                style_container: '', // 公共样式
                style_img_container: '', // 图片样式
            };
        },
        watch: {
            propKey(val) {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                const new_form = this.propValue.content || null;
                const new_style = this.propValue.style || null;
                if (new_form != null && new_style != null) {
                    let new_list = [];
                    if (!isEmpty(new_form.data_auto_list)) {
                        // 筛选商品并且筛选商品数组不为空
                        new_list = new_form.data_auto_list;
                    }
                    // 轮播图高度
                    let swiper_height = 0;
                    let new_swiper_height = 0;
                    let swiper_outer_height = 0;
                    let max_title_width = 0;
                    let swiper_list = [];
                    let swiper_left_list = [];
                    // 显示数量
                    const show_num = new_form.show_number || 1;
                    const { heading_img_height, nick_name_size, goods_img_height, goods_title_size, time_size, data_spacing, common_style, content_padding } = new_style;
                    if (['translation', 'vertical'].includes(new_form.rotation_direction)) {
                        swiper_height = Math.max(this.size_handle(heading_img_height, 'head', new_form), this.size_handle(nick_name_size, 'nick_name', new_form), this.size_handle(goods_img_height, 'goods_image', new_form), this.size_handle(goods_title_size, 'goods_title', new_form), this.size_handle(time_size, 'time', new_form)) * show_num + (data_spacing * (show_num - 1));
                    } else {
                        max_title_width = goods_title_size * 9;
                        // 拆分的数量
                        const split_num = Math.ceil(new_list.length / show_num);
                        let new_num = show_num;
                        for (let i = 0; i < show_num; i++) {
                            if (!isEmpty(new_list[i * split_num])) {
                                swiper_list.push({ split_list: new_list.slice(i * split_num, (i + 1) * split_num) });
                                swiper_left_list.push({ is_left: true });
                            } else {
                                new_num = i - 1;
                                break;
                            }
                        }
                        // 每个swiper的高度
                        new_swiper_height = Math.max(this.size_handle(goods_img_height, 'goods_image', new_form), this.size_handle(goods_title_size, 'goods_title', new_form), this.size_handle(time_size, 'time', new_form)) + content_padding.padding_top + content_padding.padding_bottom;
                        // 总的高度
                        swiper_height = new_swiper_height * new_num + (data_spacing * (new_num - 1));
                    }
                    swiper_outer_height = swiper_height + common_style.padding_top + common_style.padding_bottom;
                    let swiper_interval_time = 0;
                    // #ifdef H5 || MP-BAIDU || APP
                    swiper_interval_time = (new_form.interval_time * 1000) / 2;
                    // #endif
                    this.setData({
                        form: new_form,
                        new_style: new_style,
                        list: new_list,
                        swiper_margin_left_list: swiper_left_list,
                        swiper_new_list: swiper_list,
                        max_title_width: max_title_width,
                        nick_name_style: this.trends_config('nick_name', new_style),
                        goods_title_style: this.trends_config('goods_title', new_style),
                        time_style: this.trends_config('time', new_style),
                        heading_img_radius: this.get_heading_img_radius(new_style),
                        goods_img_radius: this.get_goods_img_radius(new_style),
                        slides_per_group: show_num,
                        swiper_outer_height: swiper_outer_height,
                        swiper_height: swiper_height,
                        new_swiper_height: new_swiper_height,
                        interval_time: new_form.interval_time * 1000,
                        swiper_interval_time: swiper_interval_time,
                        slides_offset_before: sys_width - common_style.margin_left + common_style.margin_right - common_style.padding_left - common_style.padding_right,
                        swiper_horizontal_container: this.get_swiper_horizontal_container(new_style),
                        swiper_horizontal_img_container: this.get_swiper_horizontal_img_container(new_style),
                        style_container: common_styles_computer(new_style.common_style), // 公共样式
                        style_img_container: common_img_computer(new_style.common_style, this.propIndex), // 图片样式
                    });
                }
            },
            // 横向时的显示内容
            get_swiper_horizontal_container(new_style) {
                const { content_color_list, content_direction, content_radius } = new_style
                return gradient_handle(content_color_list, content_direction) + radius_computer(content_radius) + 'margin-right:' + new_style.data_spacing * 2 + 'rpx;';
            },
            // 横向时的图片显示内容
            get_swiper_horizontal_img_container(new_style) {
                const { content_background_img_style, content_background_img, content_padding } = new_style;
                const data = {
                    background_img_style: content_background_img_style,
                    background_img: content_background_img,
                }
                return background_computer(data) + padding_computer(content_padding) + 'gap:' + new_style.content_spacing * 2 + 'rpx;';
            },
            get_heading_img_radius(new_style) {
                const { heading_img_radius, heading_img_width, heading_img_height, heading_img_border_color, heading_img_border_size } = new_style;
                return `width: ${ heading_img_width }px;height: ${ heading_img_height }px;border: ${ heading_img_border_size }px solid ${ heading_img_border_color };` + radius_computer(heading_img_radius);
            },
            get_goods_img_radius(new_style) {
                const { goods_img_radius, goods_img_width, goods_img_height, goods_img_border_color, goods_img_border_size } = new_style;
                return `width: ${ goods_img_width }px;height: ${ goods_img_height }px;border: ${ goods_img_border_size }px solid ${ goods_img_border_color };` + radius_computer(goods_img_radius);
            },
            size_handle(val, type, form){
                return form.is_show.includes(type) ? val : 0;
            },
            // 判断是否显示对应的内容
            is_show(val) {
                return this.form.is_show.includes(val);
            },
            // 根据传递的参数，从对象中取值
            trends_config(key, new_style) {
                return this.style_config(new_style[`${key}_typeface`], new_style[`${key}_size`], new_style[`${key}_color`]);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color) {
                return `font-weight:${typeface}; font-size: ${size}px;color: ${color};`;
            },
            // 将偏移量设置为0
            swiper_change(e) {
                const dataset = e.target.dataset;
                if (e.target.current > dataset.value - 2) {
                    const index = dataset.index;
                    const list = this.swiper_margin_left_list;
                    list[index].is_left = false;
                    this.setData({
                        swiper_margin_left_list: list,
                    });
                }
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style scoped lang="scss">
.swiper-horizontal-free-mode :deep .swiper-slide {
    width: auto !important;
}
</style>
